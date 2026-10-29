// Yapay Zeka sayfası: bütün görünümleri window.YZ verisinden kurar.
// Formüller KaTeX auto-render ile basılır; her görünüm ilk açıldığında bir kez işlenir.
(function(){
  var D = window.YZ;
  var CH = D.parts.slice().sort(function(a, b){ return a.no - b.no; });
  var esc = function(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  // **kalın** ve {{kod}} dışında metin olduğu gibi kalır; $...$ kısımlarını KaTeX sonra işler
  var tx = function(s){ return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\{\{(.+?)\}\}/g, '<code>$1</code>'); };
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
  var $ = function(sel, el){ return (el || document).querySelector(sel); };
  var $$ = function(sel, el){ return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var byNo = function(n){ return CH.filter(function(c){ return String(c.no) === String(n); })[0]; };

  // ---------- tarayıcıda saklanan ilerleme
  function load(k, d){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }catch(e){ return d; } }
  function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  var OK = load('yz.ok', {}), ANS = load('yz.ans', {}), DONE = load('yz.done', {});

  // ---------- KaTeX
  function math(el){
    if(!el || el.dataset.km) return;
    if(!window.renderMathInElement){ window.addEventListener('load', function(){ math(el); }, {once:true}); return; }
    el.dataset.km = '1';
    window.renderMathInElement(el, {delimiters:[{left:'$$', right:'$$', display:true}, {left:'$', right:'$', display:false}], throwOnError:false});
  }

  // ---------- konu kutuları
  function table(t){
    return '<div class="tblw"><table><thead><tr>' + t.h.map(function(c){ return '<th>' + tx(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.r.map(function(r){ return '<tr>' + r.map(function(c){ return '<td>' + tx(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function konuBox(ch, k, j){
    return '<div class="box' + (k.ek ? ' ek' : '') + '"><h3><span class="n">' + ch.no + '.' + (j + 1) + '</span>' + tx(k.h) + (k.ek ? ' <span class="tag accent">Ek · slaytta yok</span>' : '') + '</h3>' +
      (k.p || []).map(para).join('') + (k.f || []).map(disp).join('') +
      (k.li ? '<ul>' + k.li.map(function(s){ return '<li>' + tx(s) + '</li>'; }).join('') + '</ul>' : '') +
      (k.ol ? '<ol class="dsteps">' + k.ol.map(function(s){ return '<li>' + tx(s) + '</li>'; }).join('') + '</ol>' : '') +
      (k.tbl ? table(k.tbl) : '') + (k.p2 || []).map(para).join('') + '</div>';
  }

  // ---------- soru kartı
  var keyOf = function(ch, q){ return ch.no + '/' + q.id; };
  function solBlock(q){
    return '<details class="ex-sol"><summary>Çözümü göster</summary><div class="ex-solb">' +
      (q.st && q.st.length ? '<ol class="dsteps">' + q.st.map(function(s){ return '<li>' + tx(s) + '</li>'; }).join('') + '</ol>' : '') +
      '<p class="ex-at"><b>Cevap:</b> ' + tx(q.ans) + '</p></div></details>';
  }
  function qHTML(ch, q, domId, extra){
    var k = keyOf(ch, q);
    return '<article class="exq" id="' + domId + '"><div class="exq-top"><span class="exq-no">Soru ' + esc(q.id) + '</span></div>' +
      '<div class="exq-q">' + tx(q.q) + '</div>' + (extra || '') +
      '<textarea class="ex-ans" rows="2" data-ans="' + esc(k) + '" placeholder="Cevabını buraya yaz (bu tarayıcıda saklanır)">' + esc(ANS[k] || '') + '</textarea>' +
      (q.tip ? '<details class="ex-tip"><summary>İpucu</summary><p>' + tx(q.tip) + '</p></details>' : '') + solBlock(q) +
      '<label class="ex-ok"><input type="checkbox" data-ok="' + esc(k) + '"' + (OK[k] ? ' checked' : '') + '> Doğru yaptım</label></article>';
  }
  function scoreTxt(ch){
    var n = ch.qs.filter(function(q){ return OK[keyOf(ch, q)]; }).length;
    return n + ' / ' + ch.qs.length + ' doğru';
  }
  var fcards = function(list){ return '<div class="fgrid">' + list.map(function(f){ return '<div class="fcard"><span class="lbl-sm">' + tx(f[0]) + '</span>' + disp(f[1]) + '</div>'; }).join('') + '</div>'; };

  // ---------- bölüm görünümleri
  var main = $('main.page');
  var onNav = $('.topbar nav a.on'); // telefonda menüde bu dersin bağlantısı görünsün
  if(onNav) onNav.parentNode.scrollLeft = onNav.offsetLeft - 40;
  CH.forEach(function(ch, idx){
    var sec = document.createElement('section');
    sec.className = 'view'; sec.dataset.view = 'b' + ch.no; sec.hidden = true;
    var konu = '<div class="prose">' + ch.konu.map(function(k, j){ return konuBox(ch, k, j); }).join('') + '</div>';
    var ezber = '<div class="prose"><div class="box"><h3>Mutlaka bil</h3><ol class="dsteps">' + ch.ezber.map(function(s){ return '<li>' + tx(s) + '</li>'; }).join('') + '</ol></div>' +
      (ch.formul.length ? '<h2 class="vh">Formüller</h2>' + fcards(ch.formul) : '') + '</div>';
    var soru = '<div class="toolbar ex-bar"><button class="btn" type="button" data-openall>Bütün çözümleri aç</button><span class="ex-score" data-score>' + scoreTxt(ch) + '</span></div>' +
      '<p class="muted">Önce kâğıtta ya da kutuda kendin çöz, sonra çözümü aç. Doğru yaptıklarını işaretle; bu tarayıcıda saklanır.</p>' +
      '<div class="ex-list">' + ch.qs.map(function(q, i){ return qHTML(ch, q, 'q-' + ch.no + '-' + i); }).join('') + '</div>';
    sec.innerHTML = '<a class="back" href="#">← Tüm bölümler</a>' +
      '<div class="view-head"><span class="label">Bölüm ' + ch.no + ' · ' + esc(ch.hafta) + '</span><h1>' + esc(ch.title) + '</h1><p class="muted vlead">' + tx(ch.ozet) + '</p></div>' +
      '<div class="tabs" role="tablist" aria-label="Bölüm ' + ch.no + ' bölümleri">' +
        '<button type="button" role="tab" data-tab="konu" aria-selected="true">Konu anlatımı</button>' +
        '<button type="button" role="tab" data-tab="ezber" aria-selected="false">Mutlaka bil</button>' +
        '<button type="button" role="tab" data-tab="soru" aria-selected="false">Çözümlü sorular · ' + ch.qs.length + '</button></div>' +
      '<div class="read">' +
        '<div class="panel" data-panel="konu">' + konu + '</div>' +
        '<div class="panel" data-panel="ezber" hidden>' + ezber + '</div>' +
        '<div class="panel" data-panel="soru" hidden>' + soru + '</div>' +
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
      $('[data-done]', pager).addEventListener('click', function(){ DONE[ch.no] = !DONE[ch.no]; save('yz.done', DONE); paintPager(); paintHome(); });
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
    clearTimeout(timer); timer = setTimeout(function(){ save('yz.ans', ANS); }, 400);
  });
  document.addEventListener('change', function(e){
    var k = e.target.dataset && e.target.dataset.ok; if(!k) return;
    if(e.target.checked) OK[k] = 1; else delete OK[k];
    save('yz.ok', OK);
    $$('[data-ok="' + k.replace(/"/g, '\\"') + '"]').forEach(function(b){ b.checked = e.target.checked; });
    var ch = byNo(k.split('/')[0]);
    var sc = $('[data-view="b' + ch.no + '"] [data-score]'); if(sc) sc.textContent = scoreTxt(ch);
    paintHome();
  });

  // ---------- ana sayfa kartları
  function paintHome(){
    var groups = [];
    CH.forEach(function(ch){ var g = groups.filter(function(x){ return x.name === ch.grp; })[0]; if(!g){ g = {name:ch.grp, list:[]}; groups.push(g); } g.list.push(ch); });
    $('#yz-parts').innerHTML = groups.map(function(g){
      return '<div class="section"><div class="section-title"><h2>' + esc(g.name) + '</h2><p>Bölüm ' + g.list[0].no + '–' + g.list[g.list.length - 1].no + '</p></div><div class="grid">' +
        g.list.map(function(ch){
          var n = ch.qs.filter(function(q){ return OK[keyOf(ch, q)]; }).length;
          return '<a class="card" href="#b' + ch.no + '"><span class="label">Bölüm ' + ch.no + ' · ' + esc(ch.hafta) + '</span><h3>' + esc(ch.title) + '</h3><p class="desc">' + esc(ch.ozet.replace(/\$/g, '')) + '</p>' +
            '<div class="foot"><span class="meta">' + ch.qs.length + ' soru' + (n ? ' · ' + n + ' doğru' : '') + '</span>' + (DONE[ch.no] ? '<span class="tag ok">Bitti</span>' : '<span class="go">Aç →</span>') + '</div></a>';
        }).join('') + '</div></div>';
    }).join('');
  }
  paintHome();

  // ---------- formül kâğıdı
  $('#formul-all').innerHTML = CH.filter(function(ch){ return ch.formul.length; }).map(function(ch){
    return '<div class="fsec"><h2><span class="n">' + ch.no + '</span>' + esc(ch.title) + '</h2>' + fcards(ch.formul) + '</div>';
  }).join('');
  $('#print-f').addEventListener('click', function(){ window.print(); });

  // ---------- dikkat listesi
  function qLink(go){
    var p = String(go).split('/'), ch = byNo(p[0]);
    var i = p[1] ? ch.qs.map(function(q){ return q.id; }).indexOf(p[1]) : -1;
    return i < 0 ? '#b' + ch.no : '#b' + ch.no + '-q' + i;
  }
  $('#dikkat-all').innerHTML = D.dikkat.map(function(d){
    return '<div class="box"><h3>' + tx(d.w) + '</h3><p>' + tx(d.t) + '</p>' + (d.go ? '<a class="go-link" href="' + qLink(d.go) + '">' + (String(d.go).indexOf('/') > 0 ? 'Soruya git →' : 'Bölüm ' + d.go + ' →') + '</a>' : '') + '</div>';
  }).join('');

  // ---------- son 10 dakika
  $('#son-all').innerHTML = '<ol class="son">' + D.son.map(function(s){ return '<li>' + tx(s) + '</li>'; }).join('') + '</ol>';

  // ---------- karıştırma
  function shuffle(a){ for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function scoreLine(el, right, done, total){
    el.textContent = right + ' / ' + done + ' doğru' + (done === total ? ' · bitti' : ' · ' + (total - done) + ' kaldı');
    el.className = 'score' + (done === total && right / done >= .8 ? ' good' : '');
  }

  // ---------- kavram testi
  var testHost = $('#test-list'), testScore = $('#test-score');
  function buildTest(){
    var list = shuffle(D.test.map(function(t, i){ return i; })), right = 0, done = 0;
    testScore.textContent = '';
    testHost.innerHTML = list.map(function(i, n){
      var t = D.test[i];
      return '<div class="qz" data-i="' + i + '"><span class="qn">' + (n + 1) + ' / ' + list.length + '</span><p>' + tx(t.q) + '</p><div class="opts">' +
        t.o.map(function(o, k){ return '<button type="button" class="opt" data-k="' + k + '"><b>' + 'abcd'[k] + ')</b><span>' + tx(o) + '</span></button>'; }).join('') + '</div><p class="qexp" hidden></p></div>';
    }).join('');
    delete testHost.dataset.km; math(testHost);
    $$('.qz', testHost).forEach(function(box){
      var t = D.test[+box.dataset.i];
      $$('button.opt', box).forEach(function(b){
        b.addEventListener('click', function(){
          var good = +b.dataset.k === t.a;
          $$('button.opt', box).forEach(function(x){ x.disabled = true; if(+x.dataset.k === t.a) x.classList.add('right'); });
          if(!good) b.classList.add('wrong');
          var ex = $('.qexp', box);
          ex.innerHTML = (good ? '<b class="okc">Doğru.</b> ' : '<b class="badc">Yanlış.</b> ') + tx(t.w) + ' <a href="#b' + t.go + '">Bölüm ' + t.go + ' →</a>';
          ex.hidden = false; delete ex.dataset.km; math(ex);
          done++; if(good) right++;
          scoreLine(testScore, right, done, list.length);
        });
      });
    });
  }
  $('#test-again').addEventListener('click', buildTest);
  buildTest();

  // ---------- hangisi? (senaryo tanıma)
  var hHost = $('#hangi-list'), hScore = $('#hangi-score'), hSel = $('#hangi-set');
  function buildHangi(){
    var set = hSel.value, items = shuffle(D.hangi.items.filter(function(it){ return set === 'all' || it.t === set; })), right = 0, done = 0;
    hScore.textContent = '';
    hHost.innerHTML = items.map(function(it, n){
      var o = D.hangi.sets[it.t];
      return '<div class="qz"><span class="qn">' + (n + 1) + ' / ' + items.length + ' · ' + esc(o.h) + '</span><p>' + tx(it.s) + '</p><div class="mopts">' +
        o.o.map(function(op){ return '<button type="button" class="opt" data-m="' + op[0] + '">' + esc(op[1]) + '</button>'; }).join('') + '</div><p class="qexp" hidden></p></div>';
    }).join('');
    delete hHost.dataset.km; math(hHost);
    $$('.qz', hHost).forEach(function(box, n){
      var it = items[n];
      $$('button.opt', box).forEach(function(b){
        b.addEventListener('click', function(){
          var good = it.a.indexOf(b.dataset.m) >= 0;
          $$('button.opt', box).forEach(function(x){ x.disabled = true; if(it.a.indexOf(x.dataset.m) >= 0) x.classList.add('right'); });
          if(!good) b.classList.add('wrong');
          var ex = $('.qexp', box);
          ex.innerHTML = (good ? '<b class="okc">Doğru.</b> ' : '<b class="badc">Olmadı.</b> ') + tx(it.w) + ' <a href="#b' + it.go + '">Bölüm ' + it.go + ' →</a>';
          ex.hidden = false; delete ex.dataset.km; math(ex);
          done++; if(good) right++;
          scoreLine(hScore, right, done, items.length);
        });
      });
    });
  }
  $('#hangi-again').addEventListener('click', buildHangi);
  hSel.addEventListener('change', buildHangi);
  buildHangi();

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
