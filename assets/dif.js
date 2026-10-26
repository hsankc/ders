// Diferansiyel Denklemler sayfası: bütün görünümleri window.DIF verisinden kurar.
// Formüller KaTeX auto-render ile basılır; her görünüm ilk açıldığında bir kez işlenir.
(function(){
  var D = window.DIF;
  var CH = D.chapters.slice().sort(function(a, b){ return a.no - b.no; });
  var PDF = 'kaynaklar/diferansiyel/ders-notlari-arasinav.pdf', OFF = 4; // basılı sayfa + 4 = PDF sayfası
  var GO = {ayr:5, axby:5, xy:5, x2y2:5, hom:6, kay:6, tam:7, carp:7, lin:8, ber:8, ric:8};
  var esc = function(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  // **kalın** dışında metin olduğu gibi kalır; $...$ kısımlarını KaTeX sonra işler
  var tx = function(s){ return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); };
  var para = function(s){ return '<p>' + tx(s) + '</p>'; };
  // \qquad ile yan yana yazılmış formülleri parçalara ayırır; dar ekranda alt alta geçerler
  function parts(f){
    var out = [], depth = 0, start = 0;
    for(var i = 0; i < f.length; i++){
      var ch = f[i];
      if(ch === '\\' && f.substr(i, 6) === '\\qquad' && depth === 0 && !/[a-zA-Z]/.test(f[i + 6] || '')){ out.push(f.slice(start, i)); start = i + 6; i += 5; continue; }
      if(ch === '\\'){ i++; continue; }
      if(ch === '{') depth++; else if(ch === '}') depth--;
    }
    out.push(f.slice(start));
    return out.map(function(s){ return s.trim(); }).filter(Boolean);
  }
  var disp = function(f){ return '<div class="dmath">' + parts(f).map(function(p){ return '<div class="dp">$$' + esc(p) + '$$</div>'; }).join('') + '</div>'; };
  var pdfAt = function(pages){ return PDF + '#page=' + (parseInt(pages, 10) + OFF); };
  var $ = function(sel, el){ return (el || document).querySelector(sel); };
  var $$ = function(sel, el){ return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  // ---------- tarayıcıda saklanan ilerleme
  function load(k, d){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }catch(e){ return d; } }
  function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  var OK = load('dif.ok', {}), ANS = load('dif.ans', {}), DONE = load('dif.done', {});

  // ---------- KaTeX
  function math(el){
    if(!el || el.dataset.km) return;
    if(!window.renderMathInElement){ window.addEventListener('load', function(){ math(el); }, {once:true}); return; }
    el.dataset.km = '1';
    window.renderMathInElement(el, {delimiters:[{left:'$$', right:'$$', display:true}, {left:'$', right:'$', display:false}], throwOnError:false});
  }

  // ---------- soru kartı
  var RED = '<span class="tag red" title="Hocanın notunda bu soru kırmızıyla yazılmış">Notta kırmızı</span>';
  var label = function(q){ return /^\d/.test(q.id) ? 'Soru ' + q.id : q.id; };
  var keyOf = function(ch, q, s){ return ch.no + '/' + q.id + (s ? '/' + s.l : ''); };
  function keysOf(ch){
    var k = [];
    ch.qs.forEach(function(q){ if(q.subs) q.subs.forEach(function(s){ k.push(keyOf(ch, q, s)); }); else k.push(keyOf(ch, q)); });
    return k;
  }
  function solBlock(o){
    return '<details class="ex-sol"><summary>Çözümü göster</summary><div class="ex-solb">' +
      (o.st && o.st.length ? '<ol class="dsteps">' + o.st.map(function(s){ return '<li>' + tx(s) + '</li>'; }).join('') + '</ol>' : '') +
      '<p class="ex-at"><b>Cevap:</b> ' + tx(o.ans) + '</p></div></details>';
  }
  var ansBox = function(k){ return '<textarea class="ex-ans" rows="2" data-ans="' + esc(k) + '" placeholder="Cevabını buraya yaz (bu tarayıcıda saklanır)">' + esc(ANS[k] || '') + '</textarea>'; };
  var okBox = function(k){ return '<label class="ex-ok"><input type="checkbox" data-ok="' + esc(k) + '"' + (OK[k] ? ' checked' : '') + '> Doğru yaptım</label>'; };
  var tipBox = function(t){ return t ? '<details class="ex-tip"><summary>İpucu</summary><p>' + tx(t) + '</p></details>' : ''; };
  function qHTML(ch, q, domId, extra){
    var k = keyOf(ch, q);
    var h = '<article class="exq" id="' + domId + '"><div class="exq-top"><span class="exq-no">' + esc(label(q)) + '</span>' +
      (q.red ? RED : '') + (q.note ? '<span class="tag wait">Notta düzeltme var</span>' : '') + '</div>' +
      '<div class="exq-q">' + tx(q.q) + '</div>' +
      (q.note ? '<div class="ex-out"><b>Dikkat:</b> ' + tx(q.note) + '</div>' : '') + (extra || '');
    if(q.subs){
      h += q.subs.map(function(s){
        var sk = keyOf(ch, q, s);
        return '<div class="exs"><div class="exs-q"><b>' + s.l + ')</b> ' + tx(s.q) + (s.red ? ' ' + RED : '') + '</div>' + ansBox(sk) + tipBox(s.tip) + solBlock(s) + okBox(sk) + '</div>';
      }).join('');
    } else {
      h += ansBox(k) + tipBox(q.tip) + solBlock(q) + okBox(k);
    }
    return h + '</article>';
  }
  function scoreTxt(ch){
    var k = keysOf(ch), n = k.filter(function(x){ return OK[x]; }).length;
    return n + ' / ' + k.length + ' doğru';
  }

  // ---------- bölüm görünümleri
  var main = $('main.page');
  var onNav = $('.topbar nav a.on'); // telefonda menünün sonundaki "Diferansiyel" görünsün
  if(onNav) onNav.parentNode.scrollLeft = onNav.offsetLeft - 40;
  CH.forEach(function(ch, idx){
    var sec = document.createElement('section');
    sec.className = 'view'; sec.dataset.view = 'b' + ch.no; sec.hidden = true;
    var nQ = keysOf(ch).length;
    var konu = '<div class="prose">' + ch.konu.map(function(k, j){
      return '<div class="box' + (k.ek ? ' ek' : '') + '"><h3><span class="n">' + ch.no + '.' + (j + 1) + '</span>' + esc(k.h) + (k.ek ? ' <span class="tag accent">Ek · notta yok</span>' : '') + '</h3>' +
        (k.p || []).map(para).join('') + (k.f || []).map(disp).join('') + (k.p2 || []).map(para).join('') + '</div>';
    }).join('') + '<p class="muted src">Orijinal: <a href="' + pdfAt(ch.pages) + '" target="_blank" rel="noopener">hocanın ders notu, s.' + ch.pages + '</a></p></div>';
    var formul = '<div class="fgrid">' + ch.formul.map(function(f){ return '<div class="fcard"><span class="lbl-sm">' + tx(f[0]) + '</span>' + disp(f[1]) + '</div>'; }).join('') + '</div>';
    var soru = '<div class="toolbar ex-bar"><button class="btn" type="button" data-openall>Bütün çözümleri aç</button><span class="ex-score" data-score>' + scoreTxt(ch) + '</span></div>' +
      '<p class="muted">Önce kâğıtta ya da kutuda kendin çöz, sonra çözümü aç. Doğru yaptıklarını işaretle; bu tarayıcıda saklanır.</p>' +
      '<div class="ex-list">' + ch.qs.map(function(q, i){ return qHTML(ch, q, 'q-' + ch.no + '-' + i); }).join('') + '</div>';
    var taktik = '<div class="prose"><div class="box"><h3>Soru taktikleri</h3><ul>' + ch.taktik.map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="note"><b class="t">Sık yapılan hatalar</b><ul>' + ch.hata.map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul></div></div>';
    sec.innerHTML = '<a class="back" href="#">← Tüm bölümler</a>' +
      '<div class="view-head"><span class="label">Bölüm ' + ch.no + ' · s.' + ch.pages + '</span><h1>' + esc(ch.title) + '</h1><p class="muted lead">' + tx(ch.ozet) + '</p></div>' +
      '<div class="tabs" role="tablist" aria-label="Bölüm ' + ch.no + ' bölümleri">' +
        '<button type="button" role="tab" data-tab="konu" aria-selected="true">Konu anlatımı</button>' +
        '<button type="button" role="tab" data-tab="formul" aria-selected="false">Formüller · ' + ch.formul.length + '</button>' +
        '<button type="button" role="tab" data-tab="soru" aria-selected="false">Çözümlü sorular · ' + nQ + '</button>' +
        '<button type="button" role="tab" data-tab="taktik" aria-selected="false">Taktik ve hatalar</button></div>' +
      '<div class="read">' +
        '<div class="panel" data-panel="konu">' + konu + '</div>' +
        '<div class="panel" data-panel="formul" hidden>' + formul + '</div>' +
        '<div class="panel" data-panel="soru" hidden>' + soru + '</div>' +
        '<div class="panel" data-panel="taktik" hidden>' + taktik + '</div>' +
        '<div class="pager"></div></div>';
    main.appendChild(sec);

    $$('.tabs button', sec).forEach(function(t){ t.addEventListener('click', function(){ selectTab(sec, t.dataset.tab); }); });
    var openBtn = $('[data-openall]', sec);
    openBtn.addEventListener('click', function(){
      var all = $$('.panel[data-panel="soru"] details.ex-sol', sec), open = !all.every(function(d){ return d.open; });
      all.forEach(function(d){ d.open = open; });
      openBtn.textContent = open ? 'Bütün çözümleri kapat' : 'Bütün çözümleri aç';
    });
    var prev = CH[idx - 1], next = CH[idx + 1], pager = $('.pager', sec);
    function paintPager(){
      pager.innerHTML = (prev ? '<a class="btn" href="#b' + prev.no + '">← Bölüm ' + prev.no + '</a>' : '<a class="btn" href="#">← Tüm bölümler</a>') +
        '<button class="btn' + (DONE[ch.no] ? '' : ' primary') + '" type="button" data-done>' + (DONE[ch.no] ? '✓ Bitti olarak işaretli' : 'Bu bölümü bitirdim') + '</button>' +
        (next ? '<a class="btn" href="#b' + next.no + '">Bölüm ' + next.no + ' →</a>' : '<a class="btn" href="#">Tüm bölümler →</a>');
      $('[data-done]', pager).addEventListener('click', function(){ DONE[ch.no] = !DONE[ch.no]; save('dif.done', DONE); paintPager(); paintHome(); });
    }
    paintPager();
  });
  function selectTab(sec, tab){
    $$('.tabs button', sec).forEach(function(x){ x.setAttribute('aria-selected', x.dataset.tab === tab ? 'true' : 'false'); });
    $$('.panel', sec).forEach(function(p){ p.hidden = p.dataset.panel !== tab; });
  }

  // cevap kutusu ve "doğru yaptım" (bütün sayfa için tek dinleyici)
  var timer;
  document.addEventListener('input', function(e){
    var k = e.target.dataset && e.target.dataset.ans; if(!k) return;
    ANS[k] = e.target.value; if(!ANS[k]) delete ANS[k];
    clearTimeout(timer); timer = setTimeout(function(){ save('dif.ans', ANS); }, 400);
  });
  document.addEventListener('change', function(e){
    var k = e.target.dataset && e.target.dataset.ok; if(!k) return;
    if(e.target.checked) OK[k] = 1; else delete OK[k];
    save('dif.ok', OK);
    $$('[data-ok="' + k.replace(/"/g, '\\"') + '"]').forEach(function(b){ b.checked = e.target.checked; });
    var ch = CH.filter(function(c){ return String(c.no) === k.split('/')[0]; })[0];
    var sc = $('[data-view="b' + ch.no + '"] [data-score]'); if(sc) sc.textContent = scoreTxt(ch);
    paintHome();
  });

  // ---------- ana sayfa kartları
  function paintHome(){
    var groups = [];
    CH.forEach(function(ch){ var g = groups.filter(function(x){ return x.name === ch.grp; })[0]; if(!g){ g = {name:ch.grp, list:[]}; groups.push(g); } g.list.push(ch); });
    $('#dif-chapters').innerHTML = groups.map(function(g){
      return '<div class="section"><div class="section-title"><h2>' + esc(g.name) + '</h2><p>Bölüm ' + g.list[0].no + '–' + g.list[g.list.length - 1].no + '</p></div><div class="grid">' +
        g.list.map(function(ch){
          var k = keysOf(ch), n = k.filter(function(x){ return OK[x]; }).length;
          return '<a class="card" href="#b' + ch.no + '"><span class="label">Bölüm ' + ch.no + ' · s.' + ch.pages + '</span><h3>' + esc(ch.title) + '</h3><p class="desc">' + esc(ch.ozet) + '</p>' +
            '<div class="foot"><span class="meta">' + k.length + ' soru' + (n ? ' · ' + n + ' doğru' : '') + '</span>' + (DONE[ch.no] ? '<span class="tag ok">Bitti</span>' : '<span class="go">Aç →</span>') + '</div></a>';
        }).join('') + '</div></div>';
    }).join('');
  }
  paintHome();

  // ---------- hangi yöntem?
  $('#karar').innerHTML = '<ol class="karar">' + D.karar.map(function(k){
    return '<li class="box"><h3>' + tx(k.q) + '</h3><p>' + tx(k.a) + '</p>' + (k.go ? '<a class="go-link" href="#b' + k.go + '">Bölüm ' + k.go + ' →</a>' : '') + '</li>';
  }).join('') + '</ol>';

  // ---------- formül kâğıdı
  $('#formul-all').innerHTML = CH.map(function(ch){
    return '<div class="fsec"><h2><span class="n">' + ch.no + '</span>' + esc(ch.title) + '</h2><div class="fgrid">' +
      ch.formul.map(function(f){ return '<div class="fcard"><span class="lbl-sm">' + tx(f[0]) + '</span>' + disp(f[1]) + '</div>'; }).join('') + '</div></div>';
  }).join('');
  $('#print-f').addEventListener('click', function(){ window.print(); });

  // ---------- taktik ve hatalar (hepsi)
  $('#hata-all').innerHTML = CH.map(function(ch){
    return '<div class="box"><h3><span class="n">' + ch.no + '</span><a href="#b' + ch.no + '">' + esc(ch.title) + '</a></h3>' +
      '<span class="lbl-sm">Taktikler</span><ul>' + ch.taktik.map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul>' +
      '<span class="lbl-sm bad">Sık yapılan hatalar</span><ul>' + ch.hata.map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul></div>';
  }).join('');

  // ---------- notlardaki hatalar
  function qLink(go){
    var p = go.split('/'), ch = CH.filter(function(c){ return String(c.no) === p[0]; })[0];
    var i = ch.qs.map(function(q){ return q.id; }).indexOf(p[1]);
    return i < 0 ? '#b' + ch.no : '#b' + ch.no + '-q' + i;
  }
  $('#dikkat-all').innerHTML = D.dikkat.map(function(d){
    return '<div class="box"><h3>' + esc(d.w) + '</h3><p>' + tx(d.t) + '</p>' + (d.go ? '<a class="go-link" href="' + qLink(d.go) + '">Soruya git →</a>' : '') + '</div>';
  }).join('');

  // ---------- son 10 dakika
  $('#son-all').innerHTML = '<ol class="son">' + D.son.map(function(s){ return '<li>' + tx(s) + '</li>'; }).join('') + '</ol>';

  // ---------- yöntem tanıma testi
  var testHost = $('#test-list'), testScore = $('#test-score');
  function buildTest(){
    var list = D.test.map(function(t, i){ return {t:t, i:i}; });
    for(var i = list.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), x = list[i]; list[i] = list[j]; list[j] = x; }
    var right = 0, done = 0;
    testScore.textContent = '';
    testHost.innerHTML = list.map(function(o, n){
      return '<div class="qz" data-i="' + o.i + '"><span class="qn">' + (n + 1) + ' / ' + list.length + '</span><div class="qeq">$$' + esc(o.t.e) + '$$</div>' +
        '<div class="mopts">' + D.yontemler.map(function(m){ return '<button type="button" class="opt" data-m="' + m[0] + '">' + esc(m[1]) + '</button>'; }).join('') + '</div><p class="qexp" hidden></p></div>';
    }).join('');
    delete testHost.dataset.km; math(testHost);
    $$('.qz', testHost).forEach(function(box){
      var t = D.test[+box.dataset.i];
      $$('button.opt', box).forEach(function(b){
        b.addEventListener('click', function(){
          var good = t.a.indexOf(b.dataset.m) >= 0;
          $$('button.opt', box).forEach(function(x){ x.disabled = true; if(t.a.indexOf(x.dataset.m) >= 0) x.classList.add('right'); });
          if(!good) b.classList.add('wrong');
          var ex = $('.qexp', box), ch = GO[t.a[0]];
          ex.innerHTML = (good ? '<b class="okc">Doğru.</b> ' : '<b class="badc">Yanlış.</b> ') + tx(t.w) + ' <a href="#b' + ch + '">Bölüm ' + ch + ' →</a>';
          ex.hidden = false; math(ex);
          done++; if(good) right++;
          testScore.textContent = right + ' / ' + done + ' doğru' + (done === list.length ? ' · bitti' : '');
          testScore.className = 'score' + (done === list.length && right / done >= .8 ? ' good' : '');
        });
      });
    });
  }
  $('#test-again').addEventListener('click', buildTest);
  buildTest();

  // ---------- karışık pratik
  var kHost = $('#kar-q'), kAll = $('#kar-all'), last = -1;
  function pool(){
    var p = [];
    CH.forEach(function(ch){ if(ch.no >= 5 || kAll.checked) ch.qs.forEach(function(q, i){ if(!q.subs) p.push({ch:ch, q:q, i:i}); }); });
    return p;
  }
  function nextQ(){
    var p = pool(), r;
    do{ r = Math.floor(Math.random() * p.length); } while(p.length > 1 && r === last);
    last = r;
    var o = p[r];
    kHost.innerHTML = qHTML(o.ch, o.q, 'kar-' + o.ch.no + '-' + o.i,
      '<details class="ex-tip"><summary>Hangi bölümden? (yöntem)</summary><p>Bölüm ' + o.ch.no + ': <a href="#b' + o.ch.no + '-q' + o.i + '">' + esc(o.ch.title) + '</a></p></details>');
    math(kHost.firstChild);
  }
  $('#kar-next').addEventListener('click', nextQ);
  kAll.addEventListener('change', function(){ last = -1; nextQ(); });
  nextQ();

  // ---------- yönlendirme
  function route(){
    var h = location.hash.slice(1), m = /^b(\d+)-q(\d+)$/.exec(h), id = m ? 'b' + m[1] : h;
    if(!/^[\w-]+$/.test(id) || !$('[data-view="' + id + '"]')) id = 'home';
    $$('.view').forEach(function(el){ el.hidden = el.dataset.view !== id; });
    var v = $('[data-view="' + id + '"]');
    math(v);
    if(m){
      selectTab(v, 'soru');
      var el = document.getElementById('q-' + m[1] + '-' + m[2]);
      if(el){
        el.scrollIntoView({block:'start'});
        el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
        return;
      }
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
