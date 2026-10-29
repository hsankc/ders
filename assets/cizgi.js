// Altını çiz: seçilen metni işaretler ve ders ders bu tarayıcıda saklar. Sağ alttaki düğme bütün derslerin listesini açar.
(function(){
  var K = 'vh.cizgi', page = location.pathname.split('/').pop() || 'index.html';
  var DERS = {'yazilim-muhendisligi.html':'Yazılım Mühendisliği', 'veri-yapilari.html':'Veri Yapıları', 'yapay-zeka.html':'Yapay Zeka', 'diferansiyel-denklemler.html':'Diferansiyel Denklemler'};
  function load(){ try{ return JSON.parse(localStorage.getItem(K)) || {}; }catch(e){ return {}; } }
  function save(d){ try{ localStorage.setItem(K, JSON.stringify(d)); }catch(e){} }
  var esc = function(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  var st = document.createElement('style');
  st.textContent = 'mark.cz{background:#FFE58F;color:inherit;box-shadow:inset 0 -2px #E0A800;border-radius:2px}' +
    '#cz-btn{position:absolute;z-index:70;font:600 .85rem inherit;background:#1F2430;color:#fff;border:0;border-radius:8px;padding:6px 10px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.2)}' +
    '#cz-open{position:fixed;right:14px;bottom:14px;z-index:70;font:600 .88rem inherit;background:#fff;color:#1F2430;border:1px solid #D9DCE1;border-radius:999px;padding:8px 14px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.12)}' +
    '#cz-pan{position:fixed;right:14px;bottom:62px;z-index:70;width:min(380px,calc(100vw - 28px));max-height:65vh;overflow:auto;background:#fff;border:1px solid #D9DCE1;border-radius:14px;padding:14px 16px;box-shadow:0 10px 30px rgba(0,0,0,.15);font-size:.92rem}' +
    '#cz-pan h4{margin:12px 0 6px;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#6B7280}#cz-pan h4:first-child{margin-top:0}' +
    '#cz-pan .it{display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-top:1px solid #EEF0F2}#cz-pan .it a{flex:1;color:inherit;text-decoration:none}' +
    '#cz-pan .it button{border:0;background:none;color:#9AA0A8;cursor:pointer;font-size:1rem;line-height:1}#cz-pan .bos{color:#6B7280;margin:0}';
  document.head.appendChild(st);

  var btn = document.createElement('button'); btn.id = 'cz-btn'; btn.type = 'button'; btn.textContent = 'Altını çiz'; btn.hidden = true;
  var open = document.createElement('button'); open.id = 'cz-open'; open.type = 'button';
  var pan = document.createElement('div'); pan.id = 'cz-pan'; pan.hidden = true;
  document.body.appendChild(btn); document.body.appendChild(open); document.body.appendChild(pan);

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
      mid.parentNode.insertBefore(m, mid); m.appendChild(mid); parts.push(mid.nodeValue);
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
  function remark(){
    (load()[page] || []).forEach(function(it){
      if(document.querySelector('mark.cz[data-cz="' + it.id + '"]')) return;
      it.p.forEach(function(part){
        var main = document.querySelector('main'); if(!main) return;
        var w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT), n;
        while((n = w.nextNode())){
          var i = n.nodeValue.indexOf(part);
          if(i < 0 || n.parentNode.closest('mark.cz,textarea')) continue;
          var r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + part.length); wrap(r, it.id); break;
        }
      });
    });
  }
  function paint(){
    var d = load(), all = 0, h = '';
    Object.keys(DERS).concat(Object.keys(d).filter(function(k){ return !DERS[k]; })).forEach(function(pg){
      var list = d[pg] || []; if(!list.length) return; all += list.length;
      h += '<h4>' + esc(DERS[pg] || pg) + ' · ' + list.length + '</h4>' + list.map(function(it){
        return '<div class="it"><a href="' + pg + (it.v ? '#' + esc(it.v) : '') + '">' + esc(it.t.length > 220 ? it.t.slice(0, 220) + '…' : it.t) + '</a><button type="button" data-del="' + pg + '|' + it.id + '" aria-label="Sil">×</button></div>';
      }).join('');
    });
    pan.innerHTML = h || '<p class="bos">Henüz çizgi yok. Bir metni fareyle seç, çıkan "Altını çiz" düğmesine bas. Çizdiklerin bu tarayıcıda ders ders saklanır.</p>';
    open.textContent = '✎ Çizdiklerim' + (all ? ' (' + all + ')' : '');
  }
  open.addEventListener('click', function(){ pan.hidden = !pan.hidden; });
  pan.addEventListener('click', function(e){
    var k = e.target.dataset && e.target.dataset.del; if(!k) return;
    var p = k.split('|'), d = load();
    d[p[0]] = (d[p[0]] || []).filter(function(it){ return it.id !== p[1]; }); if(!d[p[0]].length) delete d[p[0]]; save(d);
    document.querySelectorAll('mark.cz[data-cz="' + p[1] + '"]').forEach(function(m){ m.replaceWith(document.createTextNode(m.textContent)); });
    paint();
  });
  paint();
  remark(); window.addEventListener('load', function(){ remark(); setTimeout(remark, 1200); });
})();
