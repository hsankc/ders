// Altını çiz: seçilen metni işaretler ve ders ders bu tarayıcıda saklar. Her dersin ana sayfasında o dersin çizgileri ayrı bir bölümde listelenir.
(function(){
  var K = 'vh.cizgi', page = location.pathname.split('/').pop() || 'index.html';
  var DERS = {'yazilim-muhendisligi.html':'Yazılım Mühendisliği', 'veri-yapilari.html':'Veri Yapıları', 'yapay-zeka.html':'Yapay Zeka', 'diferansiyel-denklemler.html':'Diferansiyel Denklemler', 'dogal-dil-isleme.html':'Doğal Dil İşleme'};
  var RENK = {'yazilim-muhendisligi.html':'ym', 'veri-yapilari.html':'vy', 'yapay-zeka.html':'yz', 'diferansiyel-denklemler.html':'dif', 'dogal-dil-isleme.html':'ddi'};
  function load(){ try{ return JSON.parse(localStorage.getItem(K)) || {}; }catch(e){ return {}; } }
  function save(d){ try{ localStorage.setItem(K, JSON.stringify(d)); }catch(e){} }
  var esc = function(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  var st = document.createElement('style');
  st.textContent = 'mark.cz{background:#FFE58F;color:inherit;box-shadow:inset 0 -2px #E0A800;border-radius:2px}' +
    '#cz-btn{position:absolute;z-index:70;font:600 .85rem inherit;background:#1F2430;color:#fff;border:0;border-radius:8px;padding:6px 10px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.2)}' +
    '#cz-pan{display:grid;gap:12px;grid-template-columns:repeat(5,minmax(0,1fr))}#cz-pan.tek{grid-template-columns:minmax(0,1fr)}' +
    '@media (max-width:1000px){#cz-pan{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}}' +
    '.cz-card{background:var(--c-soft);border:1px solid var(--line);border-top:4px solid var(--c);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;min-width:0;min-height:120px}' +
    '.cz-card h4{margin:0;font-size:.95rem;color:var(--c);display:flex;justify-content:space-between;gap:6px}.cz-card h4 span{color:#6B7385;font-weight:500;font-size:.8rem}' +
    '.cz-card .lst{display:grid;gap:6px;max-height:260px;overflow:auto}#cz-pan.tek .lst{max-height:none}' +
    '.cz-k{cursor:pointer;font:inherit;text-align:left;min-height:96px;justify-content:space-between}.cz-k:hover,.cz-k.on{box-shadow:0 0 0 2px var(--c)}.cz-n{color:#6B7385;font-size:.85rem}.cz-acik{grid-column:1/-1}.cz-acik .lst{max-height:none}' +
    '.cz-card .it{display:flex;gap:6px;align-items:flex-start;background:#fff;border-radius:8px;padding:6px 8px;font-size:.86rem;line-height:1.35}' +
    '.cz-card .it a{flex:1;min-width:0;color:inherit;text-decoration:none;overflow-wrap:anywhere;box-shadow:inset 0 -2px #FFE58F}' +
    '.cz-card .it button{border:0;background:none;color:#9AA0A8;cursor:pointer;font-size:1rem;line-height:1}.cz-card .bos{color:#6B7385;margin:0;font-size:.85rem}';
  document.head.appendChild(st);

  var btn = document.createElement('button'); btn.id = 'cz-btn'; btn.type = 'button'; btn.textContent = 'Altını çiz'; btn.hidden = true;
  document.body.appendChild(btn);
  // listenin yeri: dersin ana görünümünün sonunda ayrı bir bölüm (ana sayfada bütün dersler)
  var host = document.querySelector('[data-view="home"]') || document.querySelector('main');
  var sec = document.createElement('div'); sec.className = 'section'; sec.id = 'cizgiler';
  sec.innerHTML = '<div class="section-title"><h2>' + esc(DERS[page] ? DERS[page] + ' · Altını çizdiklerim' : 'Altını çizdiklerim') + '</h2><p id="cz-say"></p></div><div id="cz-pan"></div>';
  if(host) host.appendChild(sec);
  var pan = sec.querySelector('#cz-pan');

  // aralıktaki her metin parçasını <mark> içine alır; işaretlenen parçaların metnini döndürür
  function wrap(r, id){
    var root = r.commonAncestorContainer; if(root.nodeType === 3) root = root.parentNode;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, list = [], parts = [];
    while((n = w.nextNode())) if(r.intersectsNode(n) && n.nodeValue.trim()) list.push(n);
    list.forEach(function(t){
      var s = t === r.startContainer ? r.startOffset : 0, e = t === r.endContainer ? r.endOffset : t.nodeValue.length;
      if(e <= s) return;
      var mid = s ? t.splitText(s) : t; if(e - s < mid.nodeValue.length) mid.splitText(e - s);
      var m = document.createElement('mark'); m.className = 'cz'; m.dataset.cz = id;
      mid.parentNode.insertBefore(m, mid); m.appendChild(mid); var sc = kapsam(mid); parts.push({x: mid.nodeValue, k: sira(mid), s: sc.dataset ? sc.dataset.view || '' : ''});
    });
    return parts;
  }
  function okRange(){
    var sel = getSelection(); if(!sel.rangeCount || sel.isCollapsed) return null;
    var r = sel.getRangeAt(0), txt = sel.toString().trim(), a = r.commonAncestorContainer;
    if(a.nodeType === 3) a = a.parentNode;
    if(txt.length < 2 || txt.length > 1500 || !a.closest('main') || a.closest('textarea,input,button,svg,.katex,#cz-pan')) return null;
    return r;
  }
  var tm;
  document.addEventListener('selectionchange', function(){
    clearTimeout(tm);
    tm = setTimeout(function(){
      var r = okRange(); if(!r){ btn.hidden = true; return; }
      var b = r.getBoundingClientRect();
      btn.style.left = Math.max(8, Math.min(innerWidth - 110, b.left + scrollX)) + 'px';
      btn.style.top = (b.bottom + scrollY + 8) + 'px'; btn.hidden = false;
    }, 150);
  });
  btn.addEventListener('mousedown', function(e){ e.preventDefault(); });
  btn.addEventListener('click', function(){
    var r = okRange(); btn.hidden = true; if(!r) return;
    var id = Date.now().toString(36), txt = getSelection().toString().trim();
    var parts = wrap(r, id); getSelection().removeAllRanges();
    if(!parts.length) return;
    var d = load(); (d[page] = d[page] || []).push({id: id, t: txt, p: parts, v: location.hash.slice(1)}); save(d); paint();
  });

  // kayıtlı çizgileri sayfada yeniden işaretler (metin tek parça hâlinde bulunursa)
  // aynı metin sayfada birden çok yerde geçebilir: kaçıncı geçiş olduğunu (görünüm içinde) sakla
  function kapsam(n){ var e = n.parentNode; return (e && e.closest('[data-view]')) || document.querySelector('main'); }
  function adaylar(scope, x){
    var w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT), n, out = [];
    while((n = w.nextNode())) if(n.nodeValue.indexOf(x) >= 0 && !n.parentNode.closest('textarea,#cizgiler')) out.push(n);
    return out;
  }
  function sira(node){ var a = adaylar(kapsam(node), node.nodeValue); return Math.max(0, a.indexOf(node)); }
  function remark(){
    (load()[page] || []).forEach(function(it){
      if(document.querySelector('mark.cz[data-cz="' + it.id + '"]')) return;
      it.p.forEach(function(part){
        var x = typeof part === 'string' ? part : part.x, k = typeof part === 'string' ? 0 : part.k;
        var sv = typeof part === 'string' ? it.v : part.s;
        var scope = (sv && document.querySelector('[data-view="' + sv + '"]')) || document.querySelector('main'); if(!scope) return;
        var a = adaylar(scope, x).filter(function(n){ return !n.parentNode.closest('mark.cz[data-cz="' + it.id + '"]'); });
        if(!a.length) return;
        var n = a[Math.min(k, a.length - 1)];
        if(n.parentNode.closest('mark.cz') && n.parentNode.closest('mark.cz').textContent === x) return;
        var i = n.nodeValue.indexOf(x), r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + x.length); wrap(r, it.id);
      });
    });
  }
  // ders sayfasında o dersin kartı ve listesi; ana sayfada sadece ders kartları, tıklanan dersin çizgileri altta açılır
  var acik = null;
  function liste(pg, list){
    return '<div class="lst">' + (list.length ? list.map(function(it){
      return '<div class="it"><a href="' + pg + (it.v ? '#' + esc(it.v) : '') + '">' + esc(it.t.length > 260 ? it.t.slice(0, 260) + '…' : it.t) + '</a><button type="button" data-del="' + pg + '|' + it.id + '" aria-label="Sil">×</button></div>';
    }).join('') : '<p class="bos">Henüz yok. Metni seç, "Altını çiz"e bas.</p>') + '</div>';
  }
  function paint(){
    var d = load(), all = 0;
    if(DERS[page]){
      var l = d[page] || []; all = l.length; pan.className = 'tek';
      pan.innerHTML = '<div class="cz-card c-' + RENK[page] + '"><h4>' + esc(DERS[page]) + '<span>' + l.length + ' çizgi</span></h4>' + liste(page, l) + '</div>';
    } else {
      pan.className = '';
      pan.innerHTML = Object.keys(DERS).map(function(pg){
        var n = (d[pg] || []).length; all += n;
        return '<button type="button" class="cz-card cz-k c-' + RENK[pg] + (acik === pg ? ' on' : '') + '" data-ac="' + pg + '"><h4>' + esc(DERS[pg]) + '</h4><span class="cz-n">' + n + ' çizgi</span></button>';
      }).join('') + (acik ? '<div class="cz-card cz-acik c-' + RENK[acik] + '"><h4>' + esc(DERS[acik]) + '<span>' + (d[acik] || []).length + ' çizgi</span></h4>' + liste(acik, d[acik] || []) + '</div>' : '');
    }
    sec.querySelector('#cz-say').textContent = all ? all + ' çizgi' : '';
  }
  pan.addEventListener('click', function(e){
    var k = e.target.closest('[data-ac]'); if(!k) return;
    acik = acik === k.dataset.ac ? null : k.dataset.ac; paint();
  });
  pan.addEventListener('click', function(e){
    var k = e.target.dataset && e.target.dataset.del; if(!k) return;
    var p = k.split('|'), d = load();
    d[p[0]] = (d[p[0]] || []).filter(function(it){ return it.id !== p[1]; }); if(!d[p[0]].length) delete d[p[0]]; save(d);
    document.querySelectorAll('mark.cz[data-cz="' + p[1] + '"]').forEach(function(m){ m.replaceWith(document.createTextNode(m.textContent)); });
    paint();
  });
  paint();
  remark(); window.addEventListener('load', function(){ remark(); setTimeout(remark, 1200); });
  // notlar ve görünümler sonradan yüklenebiliyor (fetch, sekme); sayfaya yeni içerik eklendikçe tekrar işaretle
  var mt, main = document.querySelector('main');
  if(main && window.MutationObserver) new MutationObserver(function(ms){
    if(ms.every(function(m){ return m.target.closest && m.target.closest('#cizgiler,mark.cz'); })) return;
    clearTimeout(mt); mt = setTimeout(remark, 250);
  }).observe(main, {childList: true, subtree: true});
})();
