// Kütle ve Enerji Denklikleri sayfası: bütün görünümleri window.KED verisinden kurar.
// Matematik KaTeX auto-render ile basılır; animasyonlar assets/ked-anim.js içinde (window.KEDA).
(function(){
  var D = window.KED, P = D.parts;
  var esc = function(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var tx = function(s){ return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); };
  var para = function(s){ return '<p>' + tx(s) + '</p>'; };
  var disp = function(f){ return '<div class="dmath"><div class="dp">$$' + esc(f) + '$$</div></div>'; };
  var $ = function(sel, el){ return (el || document).querySelector(sel); };
  var $$ = function(sel, el){ return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var nf = function(v, d){ return Number(v).toLocaleString('tr-TR', {maximumFractionDigits: d == null ? 2 : d, useGrouping: false}); };
  function load(k, d){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }catch(e){ return d; } }
  function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  var OK = load('ked.ok', {}), DONE = load('ked.done', {}), ANS = load('ked.ans', {});

  function math(el){
    if(!el) return;
    if(!window.renderMathInElement){ window.addEventListener('load', function(){ math(el); }, {once:true}); return; }
    window.renderMathInElement(el, {delimiters:[{left:'$$', right:'$$', display:true}, {left:'$', right:'$', display:false}], throwOnError:false, ignoredClasses:['ka-svg', 'anim-host']});
  }
  function table(t){
    return '<div class="tblw"><table class="kt"><thead><tr>' + t.head.map(function(x){ return '<th>' + tx(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.rows.map(function(r){ return '<tr>' + r.map(function(x){ return '<td>' + tx(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  var animBtn = function(id, label){
    var a = window.KEDA && window.KEDA.info(id);
    return '<button type="button" class="anim-btn" data-anim="' + esc(id) + '">' + esc(label || ('Animasyon: ' + (a ? a.t : id))) + '</button>';
  };
  // bir animasyon düğmesinin hemen altına oynatıcıyı açar / kapatır
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-anim]'); if(!b) return;
    var next = b.nextElementSibling;
    if(next && next.classList.contains('anim-host')){ next.remove(); b.classList.remove('open'); return; }
    var host = document.createElement('div'); host.className = 'anim-host';
    var a = window.KEDA.info(b.dataset.anim);
    host.innerHTML = '<h4>' + esc(a ? a.t : '') + '</h4>' + (a && a.d ? '<p class="muted">' + esc(a.d) + '</p>' : '');
    var body = document.createElement('div'); host.appendChild(body);
    b.insertAdjacentElement('afterend', host); b.classList.add('open');
    window.KEDA.mount(b.dataset.anim, body);
  });

  // ---------- soru kartı (örnekler ve çıkmışlar)
  function qHTML(q, key, domId){
    var tag = q.tag ? '<span class="tag ' + (q.tag === 'Çıkmış' ? 'red' : 'ked') + '">' + esc(q.tag) + '</span>' : '';
    return '<article class="exq" id="' + domId + '"><div class="exq-top"><span class="exq-no">' + esc(q.id) + '</span>' + tag +
      (q.key ? '<span class="tag accent" title="Sınava en çok benzeyen örnekler">Önemli</span>' : '') + (q.ek ? '<span class="tag">Ek · slaytta yok</span>' : '') +
      (q.src ? '<span class="meta">' + esc(q.src) + '</span>' : '') + '</div>' +
      '<div class="exq-q">' + tx(q.q) + '</div>' +
      (q.note ? '<div class="ex-out"><b>Dikkat:</b> ' + tx(q.note) + '</div>' : '') +
      '<textarea class="ex-ans" rows="2" data-ans="' + esc(key) + '" placeholder="Önce kendin dene (bu tarayıcıda saklanır)">' + esc(ANS[key] || '') + '</textarea>' +
      '<details class="ex-sol"><summary>Çözümü göster</summary><div class="ex-solb"><ol class="dsteps">' + q.st.map(function(s){ return '<li>' + tx(s) + '</li>'; }).join('') + '</ol>' +
      '<p class="ex-at"><b>Cevap:</b> ' + tx(q.ans) + '</p></div></details>' +
      (q.anim ? animBtn(q.anim, 'Animasyonla adım adım izle') : '') +
      '<label class="ex-ok"><input type="checkbox" data-ok="' + esc(key) + '"' + (OK[key] ? ' checked' : '') + '> Doğru yaptım</label></article>';
  }
  var keyOf = function(p, q){ return p.no + '/' + q.id; };
  function scoreTxt(p){ var n = p.ornek.filter(function(q){ return OK[keyOf(p, q)]; }).length; return n + ' / ' + p.ornek.length + ' doğru'; }

  // ---------- bölüm görünümleri
  var main = $('main.page');
  var onNav = $('.topbar nav a.on'); if(onNav) onNav.parentNode.scrollLeft = onNav.offsetLeft - 40;
  P.forEach(function(p, idx){
    var sec = document.createElement('section');
    sec.className = 'view'; sec.dataset.view = 'b' + p.no; sec.hidden = true;
    var anims = [];
    p.konu.forEach(function(k){ if(k.anim && anims.indexOf(k.anim) < 0) anims.push(k.anim); });
    p.ornek.forEach(function(q){ if(q.anim && anims.indexOf(q.anim) < 0) anims.push(q.anim); });
    var konu = '<div class="prose">' + p.konu.map(function(k, j){
      return '<div class="box' + (k.ek ? ' ek' : '') + '"><h3><span class="n">' + p.no + '.' + (j + 1) + '</span>' + esc(k.h) + '</h3>' +
        (k.p || []).map(para).join('') + (k.f || []).map(disp).join('') + (k.li ? '<ul>' + k.li.map(function(x){ return '<li>' + tx(x) + '</li>'; }).join('') + '</ul>' : '') +
        (k.tbl ? table(k.tbl) : '') + (k.p2 || []).map(para).join('') + (k.anim ? animBtn(k.anim) : '') + '</div>';
    }).join('') + '<p class="muted src">Orijinal: <a href="kaynaklar/kutle-enerji/slaytlar/' + p.slayt + '" target="_blank" rel="noopener">hocanın ' + esc(p.hafta.toLowerCase()) + ' slaytları (PDF)</a></p></div>';
    var anim = '<p class="muted">Düğmeye bas, animasyon altında açılır. Adımlı olanlarda ▶ Oynat ya da İleri; kaydırıcılı olanlarda değerleri değiştir.</p><div class="prose">' +
      anims.map(function(a){ var i = window.KEDA.info(a); return '<div class="box"><h3>' + esc(i ? i.t : a) + '</h3><p>' + esc(i ? i.d : '') + '</p>' + animBtn(a, 'Aç') + '</div>'; }).join('') + '</div>';
    var formul = '<div class="fgrid">' + p.formul.map(function(f){ return '<div class="fcard"><span class="lbl-sm">' + tx(f[0]) + '</span>' + disp(f[1]) + '</div>'; }).join('') + '</div>';
    var soru = '<div class="toolbar ex-bar"><button class="btn" type="button" data-openall>Bütün çözümleri aç</button><span class="ex-score" data-score>' + scoreTxt(p) + '</span></div>' +
      '<p class="muted">Slayttaki bütün örnekler. "Önemli" işaretliler sınava en çok benzeyenler. Önce kâğıtta çöz, sonra aç.</p>' +
      '<div class="ex-list">' + p.ornek.map(function(q, i){ return qHTML(q, keyOf(p, q), 'q-' + p.no + '-' + i); }).join('') + '</div>';
    var tuzak = '<div class="prose"><div class="note"><b class="t">Sık yapılan hatalar</b><ul>' + p.tuzak.map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="box"><h3>Bu bölümün hap bilgileri</h3><ul>' + p.hap.map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul></div></div>';
    var ozet = '<div class="prose"><div class="box"><h3>15 dakikalık tekrar</h3><ul>' + p.tekrar.map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="box"><h3>Tek bakışta</h3><ul>' + p.kisa.map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul></div></div>';
    sec.innerHTML = '<a class="back" href="#">← Bütün haftalar</a>' +
      '<div class="view-head"><span class="label">' + esc(p.hafta) + ' · ' + esc(p.grp) + '</span><h1>' + esc(p.title) + '</h1><p class="muted lead">' + tx(p.ozet) + '</p></div>' +
      '<div class="tabs" role="tablist">' +
        '<button type="button" role="tab" data-tab="konu" aria-selected="true">Konu anlatımı</button>' +
        (anims.length ? '<button type="button" role="tab" data-tab="anim" aria-selected="false">Animasyonlar · ' + anims.length + '</button>' : '') +
        '<button type="button" role="tab" data-tab="formul" aria-selected="false">Formüller · ' + p.formul.length + '</button>' +
        '<button type="button" role="tab" data-tab="soru" aria-selected="false">Çözümlü örnekler · ' + p.ornek.length + '</button>' +
        '<button type="button" role="tab" data-tab="tuzak" aria-selected="false">Tuzaklar</button>' +
        '<button type="button" role="tab" data-tab="ozet" aria-selected="false">Özet</button></div>' +
      '<div class="read">' +
        '<div class="panel" data-panel="konu">' + konu + '</div>' +
        (anims.length ? '<div class="panel" data-panel="anim" hidden>' + anim + '</div>' : '') +
        '<div class="panel" data-panel="formul" hidden>' + formul + '</div>' +
        '<div class="panel" data-panel="soru" hidden>' + soru + '</div>' +
        '<div class="panel" data-panel="tuzak" hidden>' + tuzak + '</div>' +
        '<div class="panel" data-panel="ozet" hidden>' + ozet + '</div>' +
        '<div class="pager"></div></div>';
    main.appendChild(sec);
    $$('.tabs button', sec).forEach(function(t){ t.addEventListener('click', function(){ selectTab(sec, t.dataset.tab); }); });
    var openBtn = $('[data-openall]', sec);
    openBtn.addEventListener('click', function(){
      var all = $$('.panel[data-panel="soru"] details.ex-sol', sec), open = !all.every(function(d){ return d.open; });
      all.forEach(function(d){ d.open = open; }); openBtn.textContent = open ? 'Bütün çözümleri kapat' : 'Bütün çözümleri aç';
    });
    var prev = P[idx - 1], next = P[idx + 1], pager = $('.pager', sec);
    function paintPager(){
      pager.innerHTML = (prev ? '<a class="btn" href="#b' + prev.no + '">← ' + esc(prev.hafta) + '</a>' : '<a class="btn" href="#">← Bütün haftalar</a>') +
        '<button class="btn' + (DONE[p.no] ? '' : ' primary') + '" type="button" data-done>' + (DONE[p.no] ? '✓ Bitti olarak işaretli' : 'Bu haftayı bitirdim') + '</button>' +
        (next ? '<a class="btn" href="#b' + next.no + '">' + esc(next.hafta) + ' →</a>' : '<a class="btn" href="#cikmis">Çıkmış sorular →</a>');
      $('[data-done]', pager).addEventListener('click', function(){ DONE[p.no] = !DONE[p.no]; save('ked.done', DONE); paintPager(); paintHome(); });
    }
    paintPager();
  });
  function selectTab(sec, tab){
    $$('.tabs button', sec).forEach(function(x){ x.setAttribute('aria-selected', x.dataset.tab === tab ? 'true' : 'false'); });
    $$('.panel', sec).forEach(function(pn){ pn.hidden = pn.dataset.panel !== tab; });
  }
  var timer;
  document.addEventListener('input', function(e){
    var k = e.target.dataset && e.target.dataset.ans; if(!k) return;
    ANS[k] = e.target.value; if(!ANS[k]) delete ANS[k];
    clearTimeout(timer); timer = setTimeout(function(){ save('ked.ans', ANS); }, 400);
  });
  document.addEventListener('change', function(e){
    var k = e.target.dataset && e.target.dataset.ok; if(!k) return;
    if(e.target.checked) OK[k] = 1; else delete OK[k];
    save('ked.ok', OK);
    var p = P.filter(function(x){ return String(x.no) === k.split('/')[0]; })[0];
    if(p){ var sc = $('[data-view="b' + p.no + '"] [data-score]'); if(sc) sc.textContent = scoreTxt(p); }
    paintHome();
  });

  // ---------- ana sayfa
  function paintHome(){
    var groups = [];
    P.forEach(function(p){ var g = groups.filter(function(x){ return x.name === p.grp; })[0]; if(!g){ g = {name:p.grp, list:[]}; groups.push(g); } g.list.push(p); });
    $('#ked-parts').innerHTML = groups.map(function(g){
      return '<div class="section"><div class="section-title"><h2>' + esc(g.name) + '</h2><p>' + esc(g.list[0].hafta) + '–' + esc(g.list[g.list.length - 1].hafta.replace('Hafta ', '')) + '</p></div><div class="grid">' +
        g.list.map(function(p){
          var n = p.ornek.filter(function(q){ return OK[keyOf(p, q)]; }).length;
          return '<a class="card" href="#b' + p.no + '"><span class="label">' + esc(p.hafta) + '</span><h3>' + esc(p.title) + '</h3><p class="desc">' + esc(p.ozet) + '</p>' +
            '<div class="foot"><span class="meta">' + p.ornek.length + ' örnek' + (n ? ' · ' + n + ' doğru' : '') + '</span>' + (DONE[p.no] ? '<span class="tag ok">Bitti</span>' : '<span class="go">Aç →</span>') + '</div></a>';
        }).join('') + '</div></div>';
    }).join('');
  }
  paintHome();

  // PDF kartları ve slaytlar
  $('#ked-pdf').innerHTML = $('#ked-pdf2').innerHTML = D.pdfs.map(function(f){
    return '<div class="card"><span class="label">' + esc(f.lbl) + '</span><h3>' + esc(f.t) + '</h3><p class="desc">' + esc(f.d) + '</p>' +
      '<div class="files"><a href="' + f.href + '" target="_blank" rel="noopener"><span class="ic pdf">PDF</span><span>Aç</span><span class="sz">' + esc(f.sz) + '</span></a>' +
      '<a href="' + f.href + '" download><span class="ic pdf">↓</span><span>İndir</span><span class="sz">' + esc(f.pg) + '</span></a></div></div>';
  }).join('');
  $('#ked-slayt').innerHTML = '<div class="files">' + D.slides.map(function(f){
    return '<a href="' + f.href + '" target="_blank" rel="noopener"><span class="ic pdf">PDF</span><span>' + esc(f.t) + '</span><span class="sz">' + esc(f.sz) + '</span></a>';
  }).join('') + '</div>';

  // ---------- çözüm reçetesi
  $('#recete-all').innerHTML = '<ol class="recete">' + D.recete.map(function(r){ return '<li><b>' + esc(r[0]) + '.</b> ' + tx(r[1]) + '</li>'; }).join('') + '</ol>' +
    '<div class="box"><h3>Animasyonla gör</h3><p>Aynı reçete farklı ünitelerde. Hepsinde mantık aynı: toplam denklik + bir bileşen denkliği.</p>' +
    ['evaporator', 'karistirma', 'kristal', 'separator', 'salca', 'nektar', 'cikmis'].map(function(a){ return animBtn(a); }).join(' ') + '</div>';

  // ---------- çıkmış ve sınıf soruları
  $('#cikmis-all').innerHTML = D.cikmis.map(function(q, i){ return qHTML(q, 'c/' + q.id, 'c-' + i); }).join('');

  // ---------- formül kâğıdı, hap bilgiler, tuzaklar
  $('#formul-all').innerHTML = P.map(function(p){
    return '<div class="fsec"><h2><span class="n">' + p.no + '</span>' + esc(p.title) + '</h2><div class="fgrid">' +
      p.formul.map(function(f){ return '<div class="fcard"><span class="lbl-sm">' + tx(f[0]) + '</span>' + disp(f[1]) + '</div>'; }).join('') + '</div></div>';
  }).join('');
  $('#print-f').addEventListener('click', function(){ window.print(); });
  $('#hap-all').innerHTML = P.map(function(p){
    return '<div class="box"><h3><span class="n">' + p.no + '</span><a href="#b' + p.no + '">' + esc(p.title) + '</a></h3><ul class="hapl">' +
      p.hap.concat(p.kisa).map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul></div>';
  }).join('');
  $('#tuzak-all').innerHTML = P.map(function(p){
    return '<div class="box"><h3><span class="n">' + p.no + '</span><a href="#b' + p.no + '">' + esc(p.title) + '</a></h3><ul>' + p.tuzak.map(function(t){ return '<li>' + tx(t) + '</li>'; }).join('') + '</ul></div>';
  }).join('');

  // ---------- bütün animasyonlar
  var order = ['kurutma', 'birimagaci', 'cevirme', 'resayi', 'ppm', 'molar', 'interp', 'yogunluk', 'termometre', 'basinc', 'tank', 'sistemler', 'evaporator', 'karistirma', 'kristal', 'separator', 'salca', 'nektar', 'cikmis'];
  $('#anim-all').innerHTML = order.map(function(a){ var i = window.KEDA.info(a); return '<div class="box"><h3>' + esc(i.t) + '</h3><p>' + esc(i.d) + '</p>' + animBtn(a, 'Aç') + '</div>'; }).join('');

  // ---------- kavram testi
  var testHost = $('#test-list'), testScore = $('#test-score');
  function buildTest(){
    var list = D.quiz.map(function(t, i){ return {t:t, i:i}; });
    for(var i = list.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), x = list[i]; list[i] = list[j]; list[j] = x; }
    var right = 0, done = 0; testScore.textContent = '';
    testHost.innerHTML = list.map(function(o, n){
      return '<div class="qz" data-i="' + o.i + '"><span class="qn">' + (n + 1) + ' / ' + list.length + ' · Hafta ' + o.t[4] + '</span><p><b>' + tx(o.t[0]) + '</b></p>' +
        '<div class="mopts">' + o.t[1].map(function(m, k){ return '<button type="button" class="opt" data-k="' + k + '">' + tx(m) + '</button>'; }).join('') + '</div><p class="qexp" hidden></p></div>';
    }).join('');
    $$('.qz', testHost).forEach(function(box){
      var t = D.quiz[+box.dataset.i];
      $$('button.opt', box).forEach(function(b){
        b.addEventListener('click', function(){
          var good = +b.dataset.k === t[2];
          $$('button.opt', box).forEach(function(x){ x.disabled = true; if(+x.dataset.k === t[2]) x.classList.add('right'); });
          if(!good) b.classList.add('wrong');
          var ex = $('.qexp', box);
          ex.innerHTML = (good ? '<b class="okc">Doğru.</b> ' : '<b class="badc">Yanlış.</b> ') + tx(t[3]) + ' <a href="#b' + t[4] + '">Hafta ' + t[4] + ' →</a>';
          ex.hidden = false;
          done++; if(good) right++;
          testScore.textContent = right + ' / ' + done + ' doğru' + (done === list.length ? ' · bitti' : '');
          testScore.className = 'score' + (done === list.length && right / done >= .8 ? ' good' : '');
        });
      });
    });
  }
  $('#test-again').addEventListener('click', buildTest);
  buildTest();

  // ---------- sınırsız pratik: rastgele sayılarla soru üretici
  var R = function(a, b, st){ st = st || 1; return a + Math.floor(Math.random() * (Math.floor((b - a) / st) + 1)) * st; };
  var pick = function(a){ return a[Math.floor(Math.random() * a.length)]; };
  var c = function(v, d){ return nf(v, d == null ? 2 : d).replace(/,/g, '{,}'); }; // matematik içinde
  var n_ = function(v, d){ return nf(v, d == null ? 2 : d); }; // düz metinde
  var GEN = {
    kur:{t:'Kurutma', h:1, g:function(){
      var m = R(50, 500, 10), n1 = R(70, 92), n2 = R(5, 20), km_ = m * (100 - n1) / 100, pr = km_ / ((100 - n2) / 100);
      return {q:'%' + n1 + ' nemli ' + m + ' kg ürün kurutularak nemi %' + n2 + '\'e düşürülüyor. Kaç kg kurutulmuş ürün elde edilir?', a:pr, u:'kg',
        st:['Kuru madde: $' + m + '\\times' + c((100 - n1) / 100, 2) + ' = ' + c(km_) + '$ kg (değişmez).', 'Üründe KM %' + (100 - n2) + ': $' + c(km_) + '/' + c((100 - n2) / 100, 2) + ' = ' + c(pr) + '$ kg.', 'Uçan su: $' + c(m - pr) + '$ kg.']};
    }},
    eva:{t:'Evaporatör', h:8, g:function(){
      var W = R(100, 900, 50), x1 = pick([8, 10, 11, 12, 14]), x2 = pick([30, 35, 40, 45, 50, 65]), C = W / (x2 / x1 - 1);
      return {q:'Evaporatörde saatte ' + W + ' kg su uzaklaştırılıyor. Giren meyve suyu %' + x1 + ', çıkan konsantre %' + x2 + ' kuru madde. Konsantre üretim hızı kaç kg/h?', a:C, u:'kg/h',
        st:['Baz 1 h. Toplam: $F = C + ' + W + '$.', 'KM: $' + c(x1 / 100) + 'F = ' + c(x2 / 100) + 'C$ → $F = ' + c(x2 / x1, 3) + 'C$.', '$' + c(x2 / x1, 3) + 'C = C + ' + W + '$ → $C = ' + c(C) + '$ kg/h (F = ' + c(C + W) + ').']};
    }},
    sey:{t:'Seyreltme', h:8, g:function(){
      var m = R(10, 100, 5), x1 = pick([60, 65, 66, 70]), x2 = R(10, 20), Y = m * x1 / x2;
      return {q:'%' + x1 + ' şekerli ' + m + ' kg şurup suyla seyreltilip %' + x2 + '\'lik şurup yapılacak. Kaç kg su eklenmeli?', a:Y - m, u:'kg',
        st:['Şeker: $' + m + '(' + c(x1 / 100) + ') = Y(' + c(x2 / 100) + ')$ → $Y = ' + c(Y) + '$ kg.', 'Su $= Y - ' + m + ' = ' + c(Y - m) + '$ kg.']};
    }},
    kar:{t:'Karıştırma', h:8, g:function(){
      var x = pick([10, 11, 12, 13]), s = pick([60, 65, 66, 68, 70]), t = x + R(2, 5), X = 100 * (t - x) / (s - t);
      return {q:'%' + x + ' KM\'li 100 kg meyve suyuna %' + s + '\'lik şeker şurubu eklenip KM %' + t + '\'e çıkarılacak. Kaç kg şurup gerekir?', a:X, u:'kg',
        st:['Toplam: $100 + X = Y$. KM: $100(' + c(x / 100) + ') + ' + c(s / 100) + 'X = ' + c(t / 100) + 'Y$.', '$Y = 100 + X$ koy: $' + x + ' + ' + c(s / 100) + 'X = ' + t + ' + ' + c(t / 100) + 'X$.', '$X = ' + (t - x) + '/' + c((s - t) / 100) + ' = ' + c(X) + '$ kg.']};
    }},
    kri:{t:'Kristalizasyon', h:8, g:function(){
      var F = R(100, 1000, 50), x = R(72, 80), xs = R(62, 68), Y = F * (100 - x) / (100 - xs);
      return {q:'%' + x + ' sakarozlu ' + F + ' kg sıcak şurup soğutuluyor; doymuş çözelti %' + xs + ' sakaroz içeriyor. Kaç kg kristal oluşur (kristaller kuru)?', a:F - Y, u:'kg',
        st:['Su kristale girmez: $' + F + '(' + c((100 - x) / 100) + ') = Y(' + c((100 - xs) / 100) + ')$ → $Y = ' + c(Y) + '$ kg şurup.', 'Kristal $= ' + F + ' - ' + c(Y) + ' = ' + c(F - Y) + '$ kg.']};
    }},
    sep:{t:'Separatör', h:8, g:function(){
      var m = R(2000, 10000, 500), f = pick([3.5, 3.8, 4, 4.2]), fk = R(30, 45), fs = pick([.05, .1, .2, .5]), K = m * (f - fs) / (fk - fs);
      return {q:'Saatte ' + m + ' kg süt (%' + n_(f, 1) + ' yağ) separatörde krema (%' + fk + ' yağ) ve yağsız süte (%' + n_(fs) + ' yağ) ayrılıyor. Krema kaç kg/h?', a:K, u:'kg/h',
        st:['Toplam: $' + m + ' = K + S$. Yağ: $' + m + '(' + c(f / 100, 3) + ') = ' + c(fk / 100) + 'K + ' + c(fs / 100, 4) + 'S$.', '$S = ' + m + ' - K$ koy → $K = ' + m + '(' + c(f, 2) + ' - ' + c(fs) + ')/(' + fk + ' - ' + c(fs) + ') = ' + c(K) + '$ kg/h.']};
    }},
    ppm:{t:'ppm / ppb', h:5, g:function(){
      var V = pick([100, 200, 250, 500, 750]), rho = pick([1.02, 1.03, 1.04, 1.05, 1.1]), mg = pick([.5, 1.2, 2.5, 3, 4.5]), kg = V * rho / 1000, ppm = mg / kg, lim = pick([2, 5, 10]);
      return {q:'Yoğunluğu ' + n_(rho) + ' g/mL olan bir meyve suyunun ' + V + ' mL\'sinde ' + n_(mg) + ' mg kalıntı bulundu. Kaç ppm? (İzin verilen ' + lim + ' ppm; uygun mu?)', a:ppm, u:'ppm',
        st:['Kütle: $' + V + '\\times' + c(rho) + ' = ' + c(V * rho) + '$ g $= ' + c(kg, 4) + '$ kg.', 'ppm $= ' + c(mg) + '/' + c(kg, 4) + ' = ' + c(ppm) + '$ ppm (= ' + c(ppm * 1000, 0) + ' ppb).', ppm > lim ? 'Sınırın üstünde → **uygun değil**.' : 'Sınırın altında → **uygun**.']};
    }},
    sic:{t:'Sıcaklık (ΔT)', h:7, g:function(){
      var a = R(-20, 60, 5), b = a + R(10, 80, 5);
      return {q:'Bir ürün ' + a + ' °C\'den ' + b + ' °C\'ye ısıtılıyor. Kaç °F ısınmıştır?', a:(b - a) * 1.8, u:'°F',
        st:['ΔT = ' + (b - a) + ' °C. Farkta +32 yok.', '$\\Delta °F = 1{,}8\\times' + (b - a) + ' = ' + c((b - a) * 1.8) + '$ °F.', '(Değer çevirme olsaydı: ' + b + ' °C = ' + c(b * 1.8 + 32) + ' °F.)']};
    }},
    tan:{t:'Tank (P = ρgh)', h:7, g:function(){
      var P_ = R(110, 160, 5), rho = pick([1000, 1028, 1025, 1040, 915]);
      var hh = (P_ * 1000 - 101325) / (rho * 9.81);
      return {q:'Ağzı açık tanka yoğunluğu ' + rho + ' kg/m³ olan sıvı dolduruluyor. Tabandaki basınç ' + P_ + ' kPa\'ı geçmemeli. En fazla kaç m yüksekliğe kadar doldurulur?', a:hh, u:'m',
        st:['Açık tank: $P_{sıvı} = ' + P_ + ' - 101{,}325 = ' + c(P_ - 101.325, 3) + '$ kPa.', '$h = ' + c(P_ * 1000 - 101325, 0) + '/(' + rho + '\\times9{,}81) = ' + c(hh, 3) + '$ m.']};
    }},
    isi:{t:'Q = m·cp·ΔT', h:3, g:function(){
      var m = R(5, 50, 5), cp = pick([.8, .9, 1]), T1 = R(40, 70, 5), T2 = T1 + R(30, 120, 10), Q = m * cp * (T2 - T1), kwh = Q * 1055 / 3.6e6;
      return {q:'Özgül ısısı ' + n_(cp) + ' BTU/(lbm °F) olan ' + m + ' lbm ürün ' + T1 + ' °F\'tan ' + T2 + ' °F\'a ısıtılıyor. Gereken ısı kaç kWh?', a:kwh, u:'kWh',
        st:['$Q = ' + m + '\\times' + c(cp) + '\\times' + (T2 - T1) + ' = ' + c(Q) + '$ BTU.', '$' + c(Q) + '\\times1055 = ' + c(Q * 1055, 0) + '$ J; $\\div 3{,}6\\times10^6 = ' + c(kwh, 4) + '$ kWh.']};
    }},
    mol:{t:'Molarite', h:5, g:function(){
      var sp = pick([['NaCl', 58.5, 1], ['NaOH', 40, 1], ['H₂SO₄', 98, 2], ['sakaroz', 342, 1]]), W = R(2, 40), V = pick([100, 200, 250, 500, 1000]);
      var M = W / sp[1] / (V / 1000);
      return {q:V + ' mL çözeltide ' + W + ' g ' + sp[0] + ' (Mw = ' + n_(sp[1], 1) + ' g/mol) var. Molarite kaç M?' + (sp[2] > 1 ? ' (Normalite?)' : ''), a:M, u:'M',
        st:['$n = ' + W + '/' + c(sp[1], 1) + ' = ' + c(W / sp[1], 4) + '$ mol.', '$M = ' + c(W / sp[1], 4) + '/' + c(V / 1000, 3) + ' = ' + c(M, 4) + '$ M.' + (sp[2] > 1 ? ' $N = M\\times' + sp[2] + ' = ' + c(M * sp[2], 4) + '$ N.' : '')]};
    }},
    bir:{t:'Birim çevirme', h:3, g:function(){
      var k = pick([['BTU/(h ft °F)', 'W/(m K)', 1055 * 1.8 / (3600 * .3048), '1055 J/BTU, 1 h/3600 s, 1 ft/0,3048 m, 1,8 °F/K'], ['BTU/(lbm °F)', 'J/(kg K)', 1055 * 1.8 / .4536, '1055 J/BTU, 1 lbm/0,4536 kg, 1,8 °F/K'], ['lbm/ft³', 'kg/m³', .4536 / Math.pow(.3048, 3), '0,4536 kg/lbm, 1 ft³/0,028317 m³'], ['BTU/(ft² h °F)', 'W/(m² K)', 1055 * 1.8 / (3600 * .3048 * .3048), '1055 J/BTU, 1 ft²/0,0929 m², 1 h/3600 s, 1,8 °F/K']]);
      var v = pick([.3, .45, .6, .8, 2, 5, 12, 25, 60]);
      return {q:n_(v) + ' ' + k[0] + ' değerini ' + k[1] + ' birimine çeviriniz.', a:v * k[2], u:k[1],
        st:['Çevirme kesirleri: ' + k[3] + '.', 'Toplam çarpan: $' + c(k[2], 4) + '$.', '$' + c(v) + '\\times' + c(k[2], 4) + ' = ' + c(v * k[2], 3) + '$ ' + k[1] + '.']};
    }}
  };
  var prType = 'kar', prCur = null, PR = load('ked.pr', {ok:0, n:0});
  var prBox = $('#pr-box');
  $('#pr-types').innerHTML = '<button type="button" class="chip" data-t="*">Karışık</button>' + Object.keys(GEN).map(function(k){ return '<button type="button" class="chip' + (k === prType ? ' on' : '') + '" data-t="' + k + '">' + esc(GEN[k].t) + '</button>'; }).join('');
  function newQ(){
    var t = prType === '*' ? pick(Object.keys(GEN)) : prType, g = GEN[t];
    prCur = g.g(); prCur.t = t;
    prBox.innerHTML = '<span class="label">' + esc(g.t) + ' · Hafta ' + g.h + '</span><p class="exq-q">' + tx(prCur.q) + '</p>' +
      '<div class="pr-in"><input type="text" inputmode="decimal" id="pr-a" placeholder="Cevap" autocomplete="off"><span class="muted">' + esc(prCur.u) + '</span>' +
      '<button type="button" class="btn primary" id="pr-check">Kontrol et</button><button type="button" class="btn" id="pr-new">Yeni soru</button></div>' +
      '<p class="pr-res" id="pr-res"></p><details class="ex-sol" id="pr-sol"><summary>Çözümü göster</summary><div class="ex-solb"><ol class="dsteps">' +
      prCur.st.map(function(s){ return '<li>' + tx(s) + '</li>'; }).join('') + '</ol><p class="ex-at"><b>Cevap:</b> ' + nf(prCur.a, 3) + ' ' + esc(prCur.u) + '</p></div></details>';
    math(prBox);
    $('#pr-new').addEventListener('click', newQ);
    $('#pr-check').addEventListener('click', check);
    $('#pr-a').addEventListener('keydown', function(e){ if(e.key === 'Enter') check(); });
  }
  function check(){
    var raw = $('#pr-a').value.trim().replace(/\s/g, ''), res = $('#pr-res');
    if(!raw) return;
    var v = parseFloat(raw.indexOf(',') >= 0 ? raw.replace(/\./g, '').replace(',', '.') : raw);
    var good = isFinite(v) && Math.abs(v - prCur.a) <= Math.max(Math.abs(prCur.a) * .015, .011);
    PR.n++; if(good) PR.ok++; save('ked.pr', PR);
    res.className = 'pr-res ' + (good ? 'ok' : 'bad');
    res.textContent = (good ? 'Doğru! ' : 'Olmadı. Doğrusu ' + nf(prCur.a, 3) + ' ' + prCur.u + '. ') + '(Toplam ' + PR.ok + ' / ' + PR.n + ')';
    if(!good) $('#pr-sol').open = true;
  }
  $('#pr-types').addEventListener('click', function(e){
    var b = e.target.closest('.chip'); if(!b) return;
    prType = b.dataset.t; $$('#pr-types .chip').forEach(function(x){ x.classList.toggle('on', x === b); }); newQ();
  });
  newQ();

  // ---------- yönlendirme
  function route(){
    var h = location.hash.slice(1), id = h;
    if(!/^[\w-]+$/.test(id) || !$('[data-view="' + id + '"]')) id = 'home';
    $$('.view').forEach(function(el){ el.hidden = el.dataset.view !== id; });
    var v = $('[data-view="' + id + '"]');
    if(!v.dataset.km){ v.dataset.km = '1'; math(v); }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
