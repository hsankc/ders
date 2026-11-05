// Kütle ve Enerji Denklikleri · animasyonlar
// İki tür var: (1) adım adım sahneler (akış diyagramı, birim ağacı, yoğunluk türleri…) ve
// (2) kaydırıcılı etkileşimli olanlar (kurutma, termometre, basınç, tank, interpolasyon).
// ked.js, window.KEDA.mount(id, kutu) ile çağırır. id "cevirme:cp" gibi bir varyant da taşıyabilir.
(function(){
  var NS = 'http://www.w3.org/2000/svg', UID = 0;
  var esc = function(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  function km(t, disp){
    t = String(t).replace(/(\d),(\d)/g, '$1{,}$2'); // Türkçe ondalık virgülü KaTeX'te boşluk açmasın
    if(window.katex){ try{ return window.katex.renderToString(t, {throwOnError:false, displayMode:!!disp}); }catch(e){} }
    return esc(t);
  }
  // **kalın** ve $matematik$ içeren kısa metin
  function tx(s){
    return String(s).split(/(\$[^$]+\$)/).map(function(p){
      if(p.length > 1 && p[0] === '$' && p[p.length - 1] === '$') return km(p.slice(1, -1));
      return esc(p).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    }).join('');
  }
  var nf = function(v, d){ return Number(v).toLocaleString('tr-TR', {maximumFractionDigits: d == null ? 2 : d, minimumFractionDigits: 0, useGrouping: false}); };
  function h(tag, attrs, html){ var e = document.createElement(tag); for(var k in attrs || {}) e.setAttribute(k, attrs[k]); if(html != null) e.innerHTML = html; return e; }
  function s(tag, attrs, parent){ var e = document.createElementNS(NS, tag); for(var k in attrs || {}) e.setAttribute(k, attrs[k]); if(parent) parent.appendChild(e); return e; }
  function stext(parent, x, y, str, cls, anchor){
    var t = s('text', {x:x, y:y, 'class':cls || '', 'text-anchor':anchor || 'middle'}, parent);
    String(str).split('\n').forEach(function(line, i){ var sp = s('tspan', {x:x, dy:i ? '1.25em' : 0}, t); sp.textContent = line; });
    return t;
  }
  function arrowHead(parent, x1, y1, x2, y2, cls){
    var a = Math.atan2(y2 - y1, x2 - x1), L = 11, W = 6;
    var p = [[x2, y2], [x2 - L * Math.cos(a) + W * Math.sin(a), y2 - L * Math.sin(a) - W * Math.cos(a)], [x2 - L * Math.cos(a) - W * Math.sin(a), y2 - L * Math.sin(a) + W * Math.cos(a)]];
    return s('polygon', {points:p.map(function(q){ return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '), 'class':'ah ' + (cls || '')}, parent);
  }

  // ---------------------------------------------------------------- adım oynatıcı (ortak)
  function player(host, opt){
    // opt: {n: adım sayısı, go: function(i), title, speed}
    var cur = 0, timer = null;
    var bar = h('div', {'class':'ka-ctl'});
    bar.innerHTML = '<button type="button" class="btn" data-a="bas" title="Baştan">⟲</button>' +
      '<button type="button" class="btn" data-a="geri">◀ Geri</button>' +
      '<button type="button" class="btn primary" data-a="oyna">▶ Oynat</button>' +
      '<button type="button" class="btn" data-a="ileri">İleri ▶</button>' +
      '<span class="ka-step"></span>';
    host.appendChild(bar);
    var stepEl = bar.querySelector('.ka-step'), playBtn = bar.querySelector('[data-a="oyna"]');
    function show(i){
      cur = Math.max(0, Math.min(opt.n - 1, i));
      opt.go(cur);
      stepEl.textContent = 'Adım ' + (cur + 1) + ' / ' + opt.n;
      bar.querySelector('[data-a="geri"]').disabled = cur === 0;
      bar.querySelector('[data-a="ileri"]').disabled = cur === opt.n - 1;
    }
    function stop(){ clearInterval(timer); timer = null; playBtn.textContent = '▶ Oynat'; }
    function play(){
      if(timer){ stop(); return; }
      if(cur >= opt.n - 1) show(0);
      playBtn.textContent = '❚❚ Durdur';
      timer = setInterval(function(){ if(cur >= opt.n - 1 || !document.body.contains(host)){ stop(); return; } show(cur + 1); }, opt.speed || 3200);
    }
    bar.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      var a = b.dataset.a;
      if(a === 'oyna') play(); else { stop(); show(a === 'bas' ? 0 : a === 'geri' ? cur - 1 : cur + 1); }
    });
    show(0);
    return {show:show};
  }

  // ---------------------------------------------------------------- sahne motoru
  // def: {w, h, els:[{k, s, e, hl, ...}], steps:[{n:'not', q:'latex'}]}
  // Bir öğe s <= adım < e iken görünür; ilk göründüğü adımda (ve hl listesindeki adımlarda) parlar.
  function scene(host, def){
    var wrap = h('div', {'class':'ka-scene'});
    var svg = s('svg', {viewBox:'0 0 ' + def.w + ' ' + def.h, 'class':'ka-svg', role:'img'});
    var side = h('div', {'class':'ka-side'});
    var note = h('div', {'class':'ka-note'}), eqs = h('div', {'class':'ka-eqs'});
    side.appendChild(note); side.appendChild(eqs);
    wrap.appendChild(h('div', {'class':'ka-draw'})).appendChild(svg);
    wrap.appendChild(side);
    host.appendChild(wrap);
    var groups = [];
    def.els.forEach(function(o){
      var g = s('g', {'class':'k'}, svg);
      g._s = o.s || 0; g._e = o.e == null ? 1e9 : o.e; g._hl = o.hl || []; g._nohl = !!o.nohl;
      draw(g, o);
      groups.push(g);
    });
    var eqList = [];
    def.steps.forEach(function(st, i){ if(st.q) eqList.push({i:i, q:st.q}); });
    player(host, {n:def.steps.length, speed:def.speed, go:function(i){
      groups.forEach(function(g){
        var on = g._s <= i && i < g._e;
        g.classList.toggle('on', on);
        g.classList.toggle('hl', on && (g._hl.indexOf(i) >= 0 || (g._s === i && i > 0 && !g._nohl)));
      });
      note.innerHTML = tx(def.steps[i].n || '');
      var shown = eqList.filter(function(x){ return x.i <= i; });
      eqs.innerHTML = shown.length ? '<span class="lbl-sm">Denklemler</span>' + shown.map(function(x){
        return '<div class="ka-eq' + (x.i === i ? ' now' : '') + '">' + km(x.q, true) + '</div>';
      }).join('') : '';
    }});
  }
  function draw(g, o){
    var k = o.k;
    if(k === 'box'){
      s('rect', {x:o.x, y:o.y, width:o.w, height:o.h, rx:o.r == null ? 12 : o.r, 'class':'bx ' + (o.c || '')}, g);
      if(o.t) stext(g, o.x + o.w / 2, o.y + o.h / 2 + 5 - (String(o.t).split('\n').length - 1) * 8, o.t, 'bxt');
    } else if(k === 'rect'){
      s('rect', {x:o.x, y:o.y, width:o.w, height:o.h, rx:o.r || 0, 'class':'fill ' + (o.c || '')}, g);
    } else if(k === 'bnd'){
      s('rect', {x:o.x, y:o.y, width:o.w, height:o.h, rx:16, 'class':'bnd'}, g);
      if(o.t) stext(g, o.x + 10, o.y + 16, o.t, 'bndt', 'start');
    } else if(k === 'txt'){
      stext(g, o.x, o.y, o.t, 'tx ' + (o.c || ''), o.a);
    } else if(k === 'arr'){
      var d = o.p.map(function(q, i){ return (i ? 'L' : 'M') + q[0] + ' ' + q[1]; }).join(' ');
      s('path', {d:d, 'class':'ar ' + (o.c || '')}, g);
      var n = o.p.length; arrowHead(g, o.p[n - 2][0], o.p[n - 2][1], o.p[n - 1][0], o.p[n - 1][1], o.c);
    } else if(k === 'line'){
      s('line', {x1:o.x1, y1:o.y1, x2:o.x2, y2:o.y2, 'class':'ln ' + (o.c || '')}, g);
    } else if(k === 'circ'){
      s('circle', {cx:o.x, cy:o.y, r:o.r, 'class':'fill ' + (o.c || '')}, g);
    } else if(k === 'path'){
      s('path', {d:o.d, 'class':o.c || ''}, g);
    } else if(k === 'drops'){
      var dg = s('g', {'class':'drops'}, g);
      [0, 1, 2].forEach(function(j){ s('circle', {cx:o.x + (j - 1) * 9, cy:o.y, r:3.4, style:'animation-delay:' + (j * .45) + 's'}, dg); });
    } else if(k === 'x'){
      var r = o.r || 11;
      s('path', {d:'M' + (o.x - r) + ' ' + (o.y - r) + ' L' + (o.x + r) + ' ' + (o.y + r) + ' M' + (o.x + r) + ' ' + (o.y - r) + ' L' + (o.x - r) + ' ' + (o.y + r), 'class':'xx'}, g);
    } else if(k === 'cryst'){
      for(var j = 0; j < (o.n || 5); j++) s('rect', {x:o.x + (j % 3) * 13, y:o.y + Math.floor(j / 3) * 13, width:10, height:10, transform:'rotate(' + (j * 17 % 40 - 20) + ' ' + (o.x + (j % 3) * 13 + 5) + ' ' + (o.y + Math.floor(j / 3) * 13 + 5) + ')', 'class':'fill sugar'}, g);
    } else if(k === 'beaker'){
      // o: x, y (üst sol), w, h, lvl (0..1), c (sıvı sınıfı), t (etiket)
      var lv = o.h * (o.lvl == null ? .7 : o.lvl);
      s('rect', {x:o.x + 3, y:o.y + o.h - lv, width:o.w - 6, height:lv - 3, rx:6, 'class':'fill ' + (o.c || 'water')}, g);
      s('path', {d:'M' + o.x + ' ' + o.y + ' L' + o.x + ' ' + (o.y + o.h - 8) + ' Q' + o.x + ' ' + (o.y + o.h) + ' ' + (o.x + 8) + ' ' + (o.y + o.h) + ' L' + (o.x + o.w - 8) + ' ' + (o.y + o.h) + ' Q' + (o.x + o.w) + ' ' + (o.y + o.h) + ' ' + (o.x + o.w) + ' ' + (o.y + o.h - 8) + ' L' + (o.x + o.w) + ' ' + o.y, 'class':'bk'}, g);
      if(o.mark != null){ var my = o.y + o.h - o.h * o.mark; s('line', {x1:o.x + o.w - 18, y1:my, x2:o.x + o.w, y2:my, 'class':'ln'}, g); stext(g, o.x + o.w + 6, my + 4, o.markT || '', 'tx m', 'start'); }
      if(o.t) stext(g, o.x + o.w / 2, o.y + o.h + 20, o.t, 'tx', 'middle');
    }
  }

  // akış diyagramı kısayolları
  function A(p, c, st, e){ return {k:'arr', p:p, c:c, s:st, e:e}; }
  function T(x, y, t, c, st, e, a){ return {k:'txt', x:x, y:y, t:t, c:c, s:st, e:e, a:a}; }
  function B(x, y, w, hh, t, st, c){ return {k:'box', x:x, y:y, w:w, h:hh, t:t, s:st, c:c}; }

  var SC = {};
  SC.evaporator = {w:720, h:260, els:[
    {k:'bnd', x:250, y:18, w:240, h:200, t:'sistem sınırı', s:1, nohl:1},
    B(290, 110, 160, 74, 'Evaporatör', 0),
    A([[40, 147], [290, 147]], 'in', 1), T(165, 135, 'F = ? kg/h', 'q', 1, 7), T(165, 135, 'F = 681,8 kg/h', 'v ok', 7), T(165, 170, 'KM %12', 'k', 1),
    A([[370, 110], [370, 34]], 'w', 2), {k:'drops', x:370, y:70, s:2}, T(384, 40, 'W = 500 kg/h', 'v w', 2, null, 'start'), T(384, 60, 'KM %0 (sadece su)', 'm', 2, null, 'start'),
    A([[450, 147], [690, 147]], 'out', 3), T(570, 135, 'C = ? kg/h', 'q', 3, 6), T(570, 135, 'C = 181,8 kg/h', 'v ok', 6), T(570, 170, 'KM %45', 'k', 3)
  ], steps:[
    {n:'Evaporatör meyve suyundaki suyu buhar olarak uçurur. Saatte 500 kg su uzaklaşıyor. Sürekli proses olduğu için **baz: 1 saat**.'},
    {n:'Sisteme **F** kg/h meyve suyu giriyor; %12 kuru madde. Miktarı bilinmiyor.'},
    {n:'Su akımı **W = 500 kg/h**. Su akımında kuru madde **sıfır**; kuru madde suyla kaçmaz.'},
    {n:'**C** kg/h konsantre çıkıyor; %45 kuru madde. İki bilinmeyen (F ve C) var, iki denklem kuracağız.'},
    {n:'**Toplam kütle denkliği:** giren = çıkan.', q:'F = W + C = 500 + C \\quad (1)'},
    {n:'**Kuru madde denkliği:** her akımı kendi KM oranıyla çarp. Su akımının katkısı 0.', q:'0{,}12\\,F = 0\\cdot 500 + 0{,}45\\,C \\;\\Rightarrow\\; F = 3{,}75\\,C \\quad (2)'},
    {n:'(2)\'yi (1)\'e koy, C\'yi çöz.', q:'3{,}75\\,C = C + 500 \\;\\Rightarrow\\; C = \\dfrac{500}{2{,}75} = 181{,}8\\ \\text{kg/h}'},
    {n:'F = 181,8 + 500. **Kontrol:** $681{,}8\\times0{,}12 = 81{,}8$ ve $181{,}8\\times0{,}45 = 81{,}8$ ✓ Kuru madde aynı kaldı.', q:'F = 681{,}8\\ \\text{kg/h}'}
  ]};
  SC.karistirma = {w:720, h:280, els:[
    {k:'bnd', x:240, y:60, w:250, h:170, t:'sistem sınırı', s:1, nohl:1},
    B(285, 120, 160, 80, 'Karıştırma\ntankı', 0),
    A([[30, 160], [285, 160]], 'in', 1), T(150, 132, '100 kg meyve suyu', 'v', 1), T(150, 150, 'KM %12 · asit %0,8', 'k', 1),
    A([[365, 20], [365, 120]], 'sug', 2), T(380, 40, 'X = ? kg şurup', 'q', 2, 7, 'start'), T(380, 40, 'X = 5,9 kg şurup', 'v ok', 7, null, 'start'), T(380, 58, '%66 şeker', 'k', 2, null, 'start'),
    A([[445, 160], [700, 160]], 'out', 3), T(575, 132, 'Y = ? kg', 'q', 3, 6), T(575, 132, 'Y = 105,9 kg', 'v ok', 6), T(575, 150, 'KM %15', 'k', 3), T(575, 182, 'asit = ?', 'q', 3, 8), T(575, 182, 'asit %0,76', 'v ok', 8)
  ], steps:[
    {n:'Meyve suyunun kuru maddesini %12\'den %15\'e çıkarmak için %66\'lık şeker şurubu ekleniyor. Miktar verilmemiş: **baz 100 kg meyve suyu**.'},
    {n:'Giren 1: **100 kg meyve suyu**, %12 KM, %0,8 asit.'},
    {n:'Giren 2: **X kg şurup**, %66 şeker (şeker de kuru maddedir). Şurupta asit yok.'},
    {n:'Çıkan: **Y kg ayarlanmış meyve suyu**, %15 KM; asidi de soruluyor.'},
    {n:'Toplam kütle denkliği.', q:'100 + X = Y \\quad (1)'},
    {n:'Kuru madde denkliği. (1)\'den X = Y − 100 koy.', q:'100(0{,}12) + 0{,}66\\,X = 0{,}15\\,Y \\Rightarrow 12 + 0{,}66(Y-100) = 0{,}15\\,Y'},
    {n:'Y\'yi çöz.', q:'0{,}51\\,Y = 54 \\;\\Rightarrow\\; Y = 105{,}9\\ \\text{kg}'},
    {n:'X = Y − 100.', q:'X = 5{,}9\\ \\text{kg şurup}'},
    {n:'**Asit denkliği:** asit yalnız meyve suyundan geliyor, karışıma dağılıyor. 100 kg meyve suyu başına 5,9 kg şurup, asit %0,76\'ya iner.', q:'100(0{,}008) = 105{,}9\\,z \\Rightarrow z = 0{,}0076 = \\%0{,}76'}
  ]};
  SC.kristal = {w:720, h:280, els:[
    {k:'bnd', x:230, y:40, w:260, h:190, t:'sistem sınırı', s:1, nohl:1},
    B(275, 115, 170, 80, 'Kristalizatör\n(15 °C\'ye soğutma)', 0),
    A([[30, 155], [275, 155]], 'in', 1), T(150, 128, '100 kg sıcak şurup', 'v', 1), T(150, 146, '%75 sakaroz · %25 su', 'k', 1),
    A([[445, 135], [560, 135], [560, 60], [690, 60]], 'sug', 2), {k:'cryst', x:600, y:72, n:6, s:2}, T(625, 40, 'X = ? kristal', 'q', 2, 6), T(625, 40, 'X = 26,5 kg kristal', 'v ok', 6), T(650, 112, '%100 sakaroz', 'k', 2),
    A([[445, 175], [690, 175]], 'out', 3), T(580, 200, 'Y = ? doymuş şurup', 'q', 3, 5), T(580, 200, 'Y = 73,5 kg şurup', 'v ok', 5), T(580, 220, '%66 sakaroz (15 °C\'de doymuş)', 'k', 3)
  ], steps:[
    {n:'Sıcak şurup soğuyunca sakaroz çözünürlüğü düşer; fazlası **kristal** olarak çöker. Kristaller kuru çıkıyor (saf sakaroz).'},
    {n:'Giren: **100 kg** şurup, %75 sakaroz.'},
    {n:'Çıkan 1: **X kg kristal**. Kristal saf sakaroz: kesri **1**.'},
    {n:'Çıkan 2: **Y kg doymuş şurup**. 15 °C\'de doymuş çözelti %66 sakaroz içerir.'},
    {n:'Toplam ve sakaroz denklikleri.', q:'100 = X + Y \\qquad 100(0{,}75) = X(1) + Y(0{,}66)'},
    {n:'İkinciden X = 75 − 0,66Y, birinciye koy. **Kısa yol:** su kristale girmez: $25 = 0{,}34\\,Y$.', q:'100 = 75 + 0{,}34\\,Y \\Rightarrow Y = 73{,}5\\ \\text{kg}'},
    {n:'Kristal = 100 − 73,5. **Kontrol:** $26{,}5 + 73{,}5\\times0{,}66 = 75$ kg sakaroz ✓', q:'X = 26{,}5\\ \\text{kg kristal}'}
  ]};
  SC.separator = {w:720, h:280, els:[
    B(280, 110, 150, 80, 'Separatör\n(santrifüj)', 0),
    A([[30, 150], [280, 150]], 'in', 1), T(150, 110, '36 000 kg / 6 saat', 'm', 1), T(150, 130, '6000 kg/h süt', 'v', 1, null), T(150, 172, 'yağ %4', 'k', 1),
    A([[430, 130], [540, 130], [540, 60], [690, 60]], 'out', 2), T(615, 40, 'K = ? krema', 'q', 2, 5), T(615, 40, 'K = 471,9 kg/h krema', 'v ok', 5), T(615, 82, 'yağ %45', 'k', 2),
    A([[430, 170], [540, 170], [540, 235], [690, 235]], 'out', 3), T(615, 222, 'S = ? yağsız süt', 'q', 3, 6), T(615, 222, 'S = 5528,1 kg/h', 'v ok', 6), T(615, 258, 'yağ %0,5', 'k', 3)
  ], steps:[
    {n:'Santrifüj separatör sütü kremaya ve yağsız süte ayırır. 36 000 kg süt 6 saatte işleniyor; soru **1 saat** için: baz 1 saat.'},
    {n:'Giren: $36\\,000/6 = 6000$ kg/h süt, %4 yağ.'},
    {n:'Çıkan 1: **krema K**, %45 yağ.'},
    {n:'Çıkan 2: **yağsız süt S**, %0,5 yağ. İki bilinmeyen → toplam + yağ denkliği.', q:'6000 = K + S'},
    {n:'Yağ denkliği; S = 6000 − K koy.', q:'6000(0{,}04) = 0{,}45K + 0{,}005(6000-K) \\Rightarrow 240 = 0{,}445K + 30'},
    {n:'K\'yi çöz.', q:'K = 210/0{,}445 = 471{,}9\\ \\text{kg/h}'},
    {n:'S = 6000 − 471,9. **Kontrol:** $471{,}9(0{,}45) + 5528{,}1(0{,}005) = 212{,}4 + 27{,}6 = 240$ kg yağ ✓', q:'S = 5528{,}1\\ \\text{kg/h}'}
  ]};
  SC.salca = {w:780, h:320, els:[
    {k:'bnd', x:96, y:28, w:540, h:262, t:'tüm sistem', s:6, nohl:1},
    B(120, 120, 110, 64, 'Ayıklama', 0), B(320, 120, 110, 64, 'Palper', 0), B(510, 120, 110, 64, 'Evaporatör', 0),
    A([[10, 152], [120, 152]], 'in', 1), T(62, 112, '250 kg/h', 'v', 1), T(62, 130, 'domates', 'm', 1), T(62, 176, 'KM %5', 'k', 1),
    A([[175, 184], [175, 262]], 'out', 2), T(175, 282, 'atık 1 = %2', 'q', 2, 3), T(175, 282, 'atık 1 = 5 kg', 'v ok', 3), T(195, 230, 'KM %5', 'k', 2, null, 'start'),
    A([[230, 152], [320, 152]], 'in', 3), T(275, 140, '245 kg', 'v ok', 3),
    A([[375, 184], [375, 262]], 'out', 4), T(375, 282, 'atık 2 = 19,6 kg', 'v ok', 4), T(395, 230, '%8 · KM %5', 'k', 4, null, 'start'),
    A([[430, 152], [510, 152]], 'in', 4), T(470, 140, '225,4 kg', 'v ok', 4), T(470, 176, 'pulp', 'm', 4),
    A([[565, 120], [565, 44]], 'w', 5), {k:'drops', x:565, y:82, s:5}, T(580, 50, 'W = ? su', 'q', 5, 8, 'start'), T(580, 50, 'W = 185,15 kg', 'v w', 8, null, 'start'),
    A([[620, 152], [770, 152]], 'out', 5), T(700, 140, 'S = ? salça', 'q', 5, 7), T(700, 140, 'S = 40,25 kg/h', 'v ok', 7), T(700, 176, 'KM %28', 'k', 5),
    T(700, 210, '× 24 h ÷ 0,5 kg', 'm', 9), T(700, 232, '= 1932 kutu/gün', 'v ok', 9)
  ], steps:[
    {n:'Salça hattının **madde akış diyagramı**: sadece kayıp ya da değişim olan basamaklar (ayıklama, palper, evaporatör). Yıkama, parçalama, ısıtma, dolum kayıpsız.'},
    {n:'Baz **1 saat**: 250 kg domates, %5 kuru madde.'},
    {n:'Ayıklamada **%2 atık**. Yüzde, bu basamağa **giren** miktarın yüzdesi.'},
    {n:'Atık 1 = 250 × 0,02 = 5 kg → palpere 245 kg girer.', q:'250 = 5 + 245'},
    {n:'Palperde **%8 atık**: 245 × 0,08 = 19,6 kg → 225,4 kg pulp.', q:'245 = 19{,}6 + 225{,}4'},
    {n:'Evaporatör suyu uçurur; %28\'lik salça çıkar. Bilinmeyenler: W ve S.'},
    {n:'**Tüm sistem** için kuru madde denkliği yaz: atıkların KM\'si de %5, suyunki 0.', q:'250(0{,}05) = 5(0{,}05) + 19{,}6(0{,}05) + W(0) + S(0{,}28)'},
    {n:'12,5 − 0,25 − 0,98 = 11,27 kg KM salçada.', q:'S = 11{,}27/0{,}28 = 40{,}25\\ \\text{kg/h}'},
    {n:'Toplam denklikten su.', q:'W = 225{,}4 - 40{,}25 = 185{,}15\\ \\text{kg/h}'},
    {n:'Günde (24 saat) $40{,}25\\times24 = 966$ kg salça; 500 g\'lık kutulara: **1932 kutu**.', q:'966/0{,}5 = 1932\\ \\text{kutu/gün}'}
  ]};
  SC.nektar = {w:740, h:300, els:[
    B(290, 130, 160, 80, 'Ayarlama\ntankı', 0),
    A([[20, 170], [290, 170]], 'in', 1), T(150, 132, '4000 L vişne suyu', 'm', 1), T(150, 150, '= 4262,1 kg', 'v ok', 1), T(150, 192, 'KM %16 · asit %2', 'k', 1),
    A([[330, 30], [330, 130]], 'sug', 2), T(318, 40, 'X = ? şurup', 'q', 2, 5, 'end'), T(318, 40, 'X = 1191 kg şurup', 'v ok', 5, null, 'end'), T(318, 58, '%68 şeker', 'k', 2, null, 'end'),
    A([[410, 30], [410, 130]], 'w', 2), T(422, 40, 'Y = ? su', 'q', 2, 6, 'start'), T(422, 40, 'Y = 5202 kg su', 'v w', 6, null, 'start'),
    A([[450, 170], [720, 170]], 'out', 3), T(585, 132, 'Z = ? nektar', 'q', 3, 4), T(585, 132, 'Z = 10 655 kg nektar', 'v ok', 4), T(585, 192, 'KM %14 · asit %0,8', 'k', 3)
  ], steps:[
    {n:'Vişne suyu çok asitli; su ve şeker ekleyip içilebilir **nektar** yapılacak. Bilinmeyenler: şurup X, su Y, nektar Z.'},
    {n:'Hacim verilmiş: **Tablo 2**\'den %16 KM\'nin yoğunluğu interpolasyonla 1,06552 kg/L. $4000\\times1{,}06552 = 4262{,}1$ kg.', q:'\\rho_{16} = 1{,}065 + \\tfrac{16-15{,}88}{16{,}11-15{,}88}(0{,}001) = 1{,}06552'},
    {n:'Şurup (%68 şeker, asitsiz) ve su (KM\'siz, asitsiz) ekleniyor.'},
    {n:'Çıkan nektar: %14 KM, %0,8 asit. Üç bilinmeyen → üç denklem: toplam, KM, asit.'},
    {n:'**Önce asit:** asit sadece vişne suyundan geliyor → tek bilinmeyen!', q:'4262{,}1(0{,}02) = Z(0{,}008) \\Rightarrow Z = 10\\,655\\ \\text{kg}'},
    {n:'Sonra kuru madde denkliği.', q:'4262{,}1(0{,}16) + 0{,}68X = 10\\,655(0{,}14) \\Rightarrow X = 1191\\ \\text{kg}'},
    {n:'En son toplam denklikten su. (Kristal şeker kullanılsaydı X = 809,8 kg, Y = 5583 kg.)', q:'Y = 10\\,655 - 4262{,}1 - 1191 = 5202\\ \\text{kg}'}
  ]};
  SC.cikmis = {w:800, h:330, els:[
    {k:'bnd', x:62, y:24, w:200, h:200, t:'evap. alt sistemi', s:3, nohl:1},
    {k:'bnd', x:470, y:60, w:180, h:200, t:'santrifüj alt sistemi', s:6, nohl:1},
    B(90, 120, 120, 64, 'Evaporatör', 0), B(300, 120, 130, 64, 'Kristalizatör\n(soğutma)', 0), B(500, 120, 120, 64, 'Santrifüj', 0),
    A([[0, 152], [90, 152]], 'in', 1), T(42, 112, '100 kg', 'v', 1), T(42, 176, '%16 sak.', 'k', 1),
    A([[150, 120], [150, 44]], 'w', 2), {k:'drops', x:150, y:82, s:2}, T(165, 50, 'S = ? su', 'q', 2, 5, 'start'), T(165, 50, 'S = 77,14 kg', 'v w', 5, null, 'start'),
    A([[210, 152], [300, 152]], 'in', 2), T(255, 140, 'K = ?', 'q', 2, 4), T(255, 140, 'K = 22,86', 'v ok', 4), T(255, 176, '%70 sak.', 'k', 2),
    A([[430, 152], [500, 152]], 'in', 2), T(465, 176, 'K', 'm', 2),
    A([[620, 140], [790, 140]], 'sug', 2), {k:'cryst', x:690, y:94, n:6, s:2}, T(705, 170, 'C = ? kristal', 'q', 2, 8), T(705, 170, 'C = 7,62 kg', 'v ok', 8), T(705, 188, '%100 sak.', 'k', 2),
    A([[560, 184], [560, 290]], 'out', 2), T(580, 280, 'M = ? doymuş çöz.', 'q', 2, 8, 'start'), T(580, 280, 'M = 15,24 kg', 'v ok', 8, null, 'start'), T(580, 300, '%55 sak.', 'k', 2, null, 'start')
  ], steps:[
    {n:'**Çıkmış soru.** Seyreltik şeker çözeltisi önce evaporatörde koyulaştırılıyor, sonra kristalizatörde soğutulup santrifüjde kristal ayrılıyor.'},
    {n:'Giren: 100 kg, %16 sakaroz → içinde **16 kg sakaroz**.'},
    {n:'Akımlar: su S (evaporatör), %70\'lik şurup K, saf kristal C (kesir 1), doymuş çözelti M (%55). Defterde %85 yazıyor ama tahtadaki çözüm %55; %85 olamaz (konsantre zaten %70).'},
    {n:'**Evaporatör alt sistemi:** toplam ve sakaroz.', q:'100 = S + K \\qquad 100(0{,}16) = S(0) + K(0{,}70)'},
    {n:'K\'yi bul.', q:'K = 16/0{,}70 = 22{,}857\\ \\text{kg}'},
    {n:'S = 100 − K.', q:'S = 77{,}143\\ \\text{kg su}'},
    {n:'**Santrifüj alt sistemi** (kristalizatör kütle değiştirmez, sadece soğutur).', q:'22{,}857 = M + C \\qquad 16 = 0{,}55\\,M + C'},
    {n:'İki denklemi taraf tarafa çıkar: C gider.', q:'22{,}857 - 16 = 0{,}45\\,M \\Rightarrow M = 15{,}238\\ \\text{kg}'},
    {n:'C = 22,857 − 15,238. **Kontrol:** $77{,}14 + 15{,}24 + 7{,}62 = 100$ ✓', q:'C = 7{,}619\\ \\text{kg kristal}'}
  ]};
  SC.sistemler = {w:760, h:270, els:[
    B(50, 90, 170, 90, 'AÇIK', 0, 'open'), B(295, 90, 170, 90, 'KAPALI', 1, 'closed'), B(540, 90, 170, 90, 'İZOLE', 2, 'iso'),
    A([[10, 135], [50, 135]], 'in', 0), A([[220, 135], [262, 135]], 'out', 0), T(135, 210, 'kütle ✓', 'ok', 0), A([[135, 30], [135, 88]], 'heat', 0), T(150, 40, 'ısı ✓', 'ok', 0, null, 'start'),
    A([[255, 135], [293, 135]], 'in', 1), {k:'x', x:274, y:135, s:1}, A([[467, 135], [505, 135]], 'out', 1), {k:'x', x:486, y:135, s:1}, T(380, 210, 'kütle ✗', 'bad', 1), A([[380, 30], [380, 88]], 'heat', 1), T(395, 40, 'ısı ✓', 'ok', 1, null, 'start'),
    A([[500, 135], [538, 135]], 'in', 2), {k:'x', x:519, y:135, s:2}, T(625, 210, 'kütle ✗', 'bad', 2), A([[625, 30], [625, 88]], 'heat', 2), {k:'x', x:625, y:60, s:2}, T(640, 40, 'ısı ✗', 'bad', 2, null, 'start'),
    T(380, 250, 'Adyabatik: ısı alışverişi yok · İzotermal: sabit sıcaklık, ısı alışverişi var', 'm', 3)
  ], steps:[
    {n:'**Açık sistem:** sınırdan kütle de geçer, ısı da (ör. evaporatör, borulu tank).'},
    {n:'**Kapalı sistem:** sınır akışı önler; kütle geçmez ama ısı geçebilir (ör. kapalı tank).'},
    {n:'**İzole sistem:** ne kütle ne ısı geçer.'},
    {n:'İki özel durum: **adyabatik** (çevreyle ısı alışverişi yok) ve **izotermal** (reaksiyon sabit sıcaklıkta, çevreyle ısı alışverişi var).'}
  ]};
  SC.birimagaci = {w:640, h:300, els:[
    B(60, 20, 90, 46, 'kg', 0, 'base'), B(230, 20, 90, 46, 'm', 0, 'base'), B(400, 20, 90, 46, 's', 0, 'base'), T(560, 48, 'temel', 'm', 0),
    A([[105, 66], [180, 128]], 'in', 1), A([[275, 66], [215, 128]], 'in', 1), A([[425, 66], [240, 132]], 'in', 1),
    B(140, 130, 120, 56, 'N\nkg·m/s²', 1), T(330, 104, '÷ s²', 'm', 1),
    A([[260, 158], [330, 158]], 'in', 2), T(295, 148, '× m', 'm', 2), B(330, 130, 120, 56, 'J = N·m\nkg·m²/s²', 2),
    A([[450, 158], [500, 158]], 'in', 3), T(475, 148, '÷ s', 'm', 3), B(500, 130, 120, 56, 'W = J/s\nkg·m²/s³', 3),
    A([[200, 186], [200, 226]], 'in', 4), T(222, 212, '÷ m²', 'm', 4, null, 'start'), B(140, 228, 120, 56, 'Pa = N/m²\nkg/(m·s²)', 4),
    T(450, 250, 'iş = enerji = ısı → J', 'v ok', 5), T(450, 272, '1 bar = 10⁵ Pa', 'm', 5)
  ], steps:[
    {n:'SI\'nın temel birimlerinden üçü: **kg, m, s**. Diğer mekanik birimler bunlardan türetilir.'},
    {n:'**Newton** (kuvvet): F = m·a → 1 kg kütleye 1 m/s² ivme kazandıran kuvvet.', q:'1\\ \\text{N} = 1\\ \\text{kg m s}^{-2}'},
    {n:'**Joule** (enerji, iş, ısı): 1 N\'luk kuvvet 1 m yol aldırınca yapılan iş.', q:'1\\ \\text{J} = 1\\ \\text{N m} = 1\\ \\text{kg m}^2\\text{s}^{-2}'},
    {n:'**Watt** (güç): birim zamanda yapılan iş.', q:'1\\ \\text{W} = 1\\ \\text{J/s} = 1\\ \\text{kg m}^2\\text{s}^{-3}'},
    {n:'**Paskal** (basınç): birim alana düşen kuvvet. Çok küçük olduğu için kPa ve bar kullanılır.', q:'1\\ \\text{Pa} = 1\\ \\text{N/m}^2 = 1\\ \\text{kg m}^{-1}\\text{s}^{-2}'},
    {n:'Akılda tut: iş, enerji ve ısı **aynı boyuttadır**, hepsinin birimi Joule.'}
  ]};
  SC.ppm = {w:720, h:290, els:[
    {k:'beaker', x:40, y:70, w:90, h:140, lvl:.45, t:'80 mL su', s:0}, {k:'circ', x:85, y:180, r:6, c:'dot', s:0}, T(85, 52, '1 mg Ca²⁺', 'v', 0),
    A([[150, 160], [250, 160]], 'in', 1), T(200, 148, '× 1000/80', 'v', 1), T(200, 182, '= × 12,5', 'm', 1),
    {k:'beaker', x:270, y:40, w:120, h:170, lvl:.86, mark:.86, markT:'1 L', t:'1000 mL ≈ 1 kg', s:1}, {k:'circ', x:300, y:180, r:6, c:'dot', s:1}, {k:'circ', x:330, y:150, r:6, c:'dot', s:1}, {k:'circ', x:360, y:185, r:6, c:'dot', s:1}, {k:'circ', x:315, y:120, r:6, c:'dot', s:1}, T(330, 28, '12,5 mg Ca²⁺', 'v ok', 1),
    T(560, 110, '12,5 mg/kg', 'v', 2), T(560, 132, '= 12,5 ppm', 'big ok', 2),
    T(560, 190, '× 1000 µg/mg', 'm', 3), T(560, 214, '12 500 µg/kg', 'v', 3), T(560, 236, '= 12 500 ppb', 'big ok', 3)
  ], steps:[
    {n:'80 mL suda 1 mg Ca²⁺ var. ppm = mg/kg; önce miktarı **1 kg\'a (1 L suya) ölçekle**.'},
    {n:'80 mL → 1000 mL için çarpan 1000/80 = 12,5. Çözünen de aynı oranda artar.', q:'\\frac{1\\ \\text{mg}}{80\\ \\text{mL}}\\times\\frac{1000/80}{1000/80} = \\frac{12{,}5\\ \\text{mg}}{1\\ \\text{L}}'},
    {n:'Su için 1 L ≈ 1 kg → **12,5 ppm**. (Başka sıvıda yoğunlukla kütleye çevir!)', q:'\\text{ppm} = \\text{mg/kg} = 12{,}5'},
    {n:'ppb = µg/kg. 1 mg = 1000 µg → ppm × 1000.', q:'12{,}5\\ \\text{ppm} = 12\\,500\\ \\text{ppb}'}
  ]};
  SC.molar = {w:740, h:300, els:[
    T(170, 24, 'MOLARİTE (M)', 'v', 0), T(560, 24, 'MOLALİTE (m)', 'v', 2),
    {k:'beaker', x:110, y:60, w:120, h:170, lvl:.8, mark:.8, markT:'1 L çizgisi', t:'çözelti: 1 L', s:0}, {k:'cryst', x:140, y:180, n:5, s:0},
    T(170, 280, 'çözünen + su → çizgiye kadar', 'm', 1),
    {k:'rect', x:470, y:200, w:180, h:10, r:3, c:'scale', s:2}, {k:'path', d:'M560 210 L560 250 M520 250 L600 250', c:'ln', s:2},
    {k:'beaker', x:500, y:70, w:120, h:130, lvl:.75, t:'', s:2}, {k:'cryst', x:530, y:160, n:5, s:2}, T(560, 280, '1000 g su tartılır + çözünen eklenir', 'm', 3),
    T(370, 140, 'farkı:', 'm', 4), T(370, 162, 'çözelti hacmi ↔ çözücü kütlesi', 'v', 4)
  ], steps:[
    {n:'**Molarite:** çözüneni ölçü balonuna koy, su ekleyerek **çözeltiyi 1 L çizgisine** tamamla.', q:'M = \\frac{n}{V_{\\text{çözelti}}}\\ (\\text{mol/L})'},
    {n:'Payda **çözeltinin toplam hacmi**dir; ne kadar su eklendiği önemli değil, çizgiye kadar.'},
    {n:'**Molalite:** **1000 g çözücü** (su) tartılır, çözünen içine eklenir. Toplam kütle 1 kg\'dan fazla olur.', q:'m = \\frac{n}{1\\ \\text{kg çözücü}}'},
    {n:'Molalite sıcaklıkla değişmez (kütleye dayalı); molarite hacme dayalı olduğu için değişebilir.'},
    {n:'Normalite ise molaritenin tesir değerliğiyle çarpımıdır: H₂SO₄ 2 H⁺ verir.', q:'N = M\\times\\text{T.D.}\\qquad 0{,}5\\ \\text{M H}_2\\text{SO}_4 = 1\\ \\text{N}'}
  ]};
  (function(){
    // yoğunluk türleri: üç kutu, içinde taneler ve tane içi boşluklar
    var els = [];
    var grains = [[38, 60], [78, 52], [58, 92], [100, 92], [30, 128], [80, 132], [118, 130], [112, 56]];
    [0, 1, 2].forEach(function(p){
      var ox = 40 + p * 240;
      els.push({k:'box', x:ox, y:40, w:160, h:130, r:6, s:0, c:'cont', nohl:1});
      grains.forEach(function(g){
        els.push({k:'circ', x:ox + g[0] + 6, y:g[1] + 10, r:17, c:'grain', s:0, nohl:1});
        els.push({k:'circ', x:ox + g[0], y:g[1] + 6, r:4, c:'pore', s:0, nohl:1});
        els.push({k:'circ', x:ox + g[0] + 10, y:g[1] + 16, r:3, c:'pore', s:0, nohl:1});
      });
    });
    // vurgular
    grains.forEach(function(g){ els.push({k:'circ', x:40 + g[0] + 6, y:g[1] + 10, r:17, c:'solidhl', s:1}); });
    grains.forEach(function(g){ els.push({k:'circ', x:280 + g[0] + 6, y:g[1] + 10, r:19, c:'parthl', s:2}); });
    els.push({k:'rect', x:520, y:40, w:160, h:130, r:6, c:'bulkhl', s:3});
    els.push(T(120, 200, 'KATI', 'v', 1), T(120, 220, 'tüm boşluklar hariç', 'm', 1));
    els.push(T(360, 200, 'PARTİKÜL', 'v', 2), T(360, 220, 'tane içi boşluk dahil', 'm', 2));
    els.push(T(600, 200, 'KİTLE (bulk)', 'v', 3), T(600, 220, 'taneler arası da dahil', 'm', 3));
    els.push(T(360, 262, 'ρ katı  ≥  ρ partikül  ≥  ρ kitle', 'big', 4));
    SC.yogunluk = {w:720, h:290, els:els, steps:[
      {n:'Aynı tahıl yığını üç kez çizildi. Taneler (kahverengi), tane içindeki küçük hava boşlukları (beyaz) ve taneler arası boşluklar.'},
      {n:'**Katı yoğunluğu:** hacme sadece katı madde girer; bütün boşluklar hariç. Belirtilmemişse yoğunluk budur.', q:'\\rho_{\\text{katı}} = \\frac{m}{V_{\\text{katı}}}'},
      {n:'**Partikül yoğunluğu:** her tanenin dış çizgisine kadar hacim; tane içi boşluklar dahil, taneler arası hariç.', q:'\\rho_{\\text{partikül}} = \\frac{m}{V_{\\text{katı}} + V_{\\text{iç boşluk}}}'},
      {n:'**Kitle yoğunluğu:** kabın tamamı; taneler arası boşluklar da dahil. **Depo, silo, çuval hacmi** bununla hesaplanır.', q:'\\rho_{\\text{kitle}} = \\frac{m}{V_{\\text{kap}}}'},
      {n:'Kütle aynı, hacim büyüdükçe yoğunluk küçülür. Porozite: katının doldurmadığı hacim oranı.', q:'\\varepsilon = 1 - \\frac{\\rho_{\\text{kitle}}}{\\rho_{\\text{katı}}}'}
    ]};
  })();

  // ---------------------------------------------------------------- birim çevirme zinciri
  var CH = {
    k:{t:'10 BTU/(h·ft·°F) → J/(s·m·K)', v:10, num:['BTU'], den:['h', 'ft', '°F'], f:[[1055, 'J', 1, 'BTU'], [1, 'h', 3600, 's'], [1, 'ft', .3048, 'm'], [1.8, '°F', 1, 'K']], d:1},
    cp:{t:'0,64 BTU/(lbm·°F) → J/(kg·K)', v:.64, num:['BTU'], den:['lbm', '°F'], f:[[1055, 'J', 1, 'BTU'], [1, 'lbm', .4536, 'kg'], [1.8, '°F', 1, 'K']], d:0},
    hs:{t:'210 BTU/(ft²·h·°F) → W/(m²·K)', v:210, num:['BTU'], den:['ft²', 'h', '°F'], f:[[1055, 'J', 1, 'BTU'], [1, 'ft²', .0929, 'm²'], [1, 'h', 3600, 's'], [1.8, '°F', 1, 'K']], d:0},
    rho:{t:'64,5 lbm/ft³ → kg/m³', v:64.5, num:['lbm'], den:['ft³'], f:[[.4536, 'kg', 1, 'lbm'], [1, 'ft³', .028317, 'm³']], d:0},
    firin:{t:'6500 BTU/h × 0,5 h → kWh', v:6500, num:['BTU'], den:['h'], f:[[.5, 'h', null, null], [1055, 'J', 1, 'BTU'], [1, ['W', 's'], 1, 'J'], [1, 'kW', 1000, 'W'], [1, 'h', 3600, 's']], d:3},
    re:{t:'Reynolds: D·V·ρ / µ birimsiz mi?', units:true, v:null, num:['m'], den:[], f:[[null, 'm', null, 's'], [null, 'kg', null, ['m', 'm', 'm']], [null, ['m', 's'], null, 'kg']], lab:['D', 'V', 'ρ', '1/µ']}
  };
  function chain(host, variant){
    var keys = host.dataset.only ? [host.dataset.only] : ['k', 'cp', 'hs', 'rho', 'firin'];
    if(variant === 're') keys = ['re'];
    var pick = h('div', {'class':'ka-pick'});
    var stage = h('div', {'class':'ka-chain'});
    var note = h('div', {'class':'ka-note'});
    if(keys.length > 1){ host.appendChild(pick); pick.innerHTML = keys.map(function(k){ return '<button type="button" class="chip" data-k="' + k + '">' + esc(CH[k].t) + '</button>'; }).join(''); }
    host.appendChild(stage); host.appendChild(note);
    var ctlHost = h('div'); host.appendChild(ctlHost);
    function build(key){
      [].forEach.call(pick.querySelectorAll('.chip'), function(b){ b.classList.toggle('on', b.dataset.k === key); });
      var c = CH[key];
      var arr = function(x){ return x == null ? [] : Array.isArray(x) ? x : [x]; };
      // fraksiyonlar: başlangıç + çarpanlar
      var fr = [{n:c.v, nu:c.num.slice(), d:null, du:c.den.slice(), lab:c.lab ? c.lab[0] : null}].concat(c.f.map(function(f, i){ return {n:f[0], nu:arr(f[1]), d:f[2], du:arr(f[3]), lab:c.lab ? c.lab[i + 1] : null}; }));
      stage.innerHTML = '';
      var cells = fr.map(function(f, i){
        var el = h('div', {'class':'ka-fr' + (i ? '' : ' first')});
        var top = (f.n != null ? '<span class="n">' + nf(f.n, 4) + '</span>' : '') + f.nu.map(function(u, j){ return '<span class="u" data-u="t' + j + '">' + esc(u) + '</span>'; }).join('');
        var bot = (f.d != null ? '<span class="n">' + nf(f.d, 6) + '</span>' : '') + f.du.map(function(u, j){ return '<span class="u" data-u="b' + j + '">' + esc(u) + '</span>'; }).join('');
        el.innerHTML = (f.lab ? '<span class="lab">' + esc(f.lab) + '</span>' : '') + '<span class="t">' + (top || '1') + '</span>' + (bot ? '<span class="b">' + bot + '</span>' : '');
        if(i) el.insertAdjacentHTML('afterbegin', '');
        stage.appendChild(el);
        if(i < fr.length - 1){ var x = h('span', {'class':'ka-op'}, '×'); stage.appendChild(x); f._op = x; }
        return el;
      });
      var res = h('div', {'class':'ka-res'}); stage.appendChild(res);
      // adım adım iptaller hesaplanır
      var plan = [], live = [];
      fr.forEach(function(f, i){
        var cancels = [];
        f.nu.forEach(function(u, j){ var m = live.filter(function(t){ return !t.x && t.side === 'b' && t.u === u; })[0]; if(m){ m.x = true; cancels.push(m, {i:i, side:'t', j:j}); } else live.push({i:i, side:'t', j:j, u:u}); });
        f.du.forEach(function(u, j){ var m = live.filter(function(t){ return !t.x && t.side === 't' && t.u === u; })[0]; if(m){ m.x = true; cancels.push(m, {i:i, side:'b', j:j}); } else live.push({i:i, side:'b', j:j, u:u}); });
        plan.push(cancels);
      });
      var left = live.filter(function(t){ return !t.x; });
      var uTop = left.filter(function(t){ return t.side === 't'; }).map(function(t){ return t.u; });
      var uBot = left.filter(function(t){ return t.side === 'b'; }).map(function(t){ return t.u; });
      var val = null;
      if(!c.units){ val = c.v; c.f.forEach(function(f){ if(f[0] != null) val *= f[0]; if(f[2] != null) val /= f[2]; }); }
      var unitStr = (uTop.join('·') || '1') + (uBot.length ? ' / (' + uBot.join('·') + ')' : '');
      var steps = fr.length + 1;
      ctlHost.innerHTML = '';
      player(ctlHost, {n:steps, speed:2400, go:function(i){
        cells.forEach(function(el, j){ el.classList.toggle('on', j <= i); el.classList.toggle('now', j === i); if(fr[j]._op) fr[j]._op.classList.toggle('on', j < i); });
        stage.querySelectorAll('.u').forEach(function(u){ u.classList.remove('x'); });
        for(var k = 0; k <= Math.min(i, plan.length - 1); k++) plan[k].forEach(function(t){
          var el = cells[t.i].querySelector('.' + t.side + ' [data-u="' + t.side + t.j + '"]'); if(el) el.classList.add('x');
        });
        res.classList.toggle('on', i === steps - 1);
        res.innerHTML = '= ' + (c.units ? '<b>birimsiz</b>' : '<b>' + nf(val, c.d == null ? 2 : c.d + 1) + '</b> ' + esc(unitStr));
        var msg;
        if(i === 0) msg = c.units ? 'Re = D·V·ρ/µ. Her değişkenin SI birimini yaz; pay ve paydada aynı birim görünce üstünü çiz.' : 'Hedef birim: **' + esc(c.t.split('→')[1].trim()) + '**. Başlangıç değeri sağa yazıldı. İstemediğin her birimi götürecek bir kesir ekleyeceğiz.';
        else if(i < fr.length){
          var cx = plan[i].filter(function(t){ return t.i !== i; }).map(function(t){ return fr[t.i][t.side === 't' ? 'nu' : 'du'][t.j]; });
          msg = (fr[i].lab ? '**' + fr[i].lab + '** eklendi. ' : 'Çarpan eklendi. ') + (cx.length ? 'Sadeleşen: **' + cx.join(', ') + '**' : 'Henüz sadeleşen yok.') + (fr[i].nu.indexOf('°F') >= 0 ? ' · Sıcaklık **farkı** olduğu için 1 K = 1,8 °F; +32 yok.' : '');
        } else msg = c.units ? 'Hepsi sadeleşti: **Re birimsizdir.** Bu yüzden her birim sisteminde aynı değeri verir.' : 'Kalan birim: **' + esc(unitStr) + '**. Sayıları çarp (paydakilere böl): **' + nf(val, c.d == null ? 2 : c.d + 1) + '**.';
        note.innerHTML = tx(msg);
      }});
    }
    pick.addEventListener('click', function(e){ var b = e.target.closest('.chip'); if(b) build(b.dataset.k); });
    build(keys.indexOf(variant) >= 0 ? variant : keys[0]);
  }

  // ---------------------------------------------------------------- etkileşimli: kurutma
  function slider(label, min, max, step, val, unit){
    var w = h('label', {'class':'ka-sl'});
    w.innerHTML = '<span>' + label + ' <b></b></span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '">';
    var inp = w.querySelector('input'), b = w.querySelector('b');
    var upd = function(){ b.textContent = nf(+inp.value, 2) + (unit || ''); };
    inp.addEventListener('input', upd); upd();
    return {el:w, inp:inp, get:function(){ return +inp.value; }, set:function(v){ inp.value = v; upd(); }};
  }
  function kurutma(host){
    var box = h('div', {'class':'ka-inter'});
    var ctl = h('div', {'class':'ka-sls'});
    var m = slider('Giren kütle', 10, 1000, 10, 100, ' kg'), n1 = slider('Başlangıç nemi', 50, 95, 1, 85, ' %'), n2 = slider('Son nem', 1, 45, 1, 15, ' %');
    [m, n1, n2].forEach(function(x){ ctl.appendChild(x.el); });
    var svg = s('svg', {viewBox:'0 0 640 300', 'class':'ka-svg'});
    var out = h('div', {'class':'ka-note'});
    var btn = h('button', {type:'button', 'class':'btn primary'}, '▶ Kurutmayı izle');
    box.appendChild(ctl); box.appendChild(h('div', {'class':'ka-draw'})).appendChild(svg); box.appendChild(out); box.appendChild(btn);
    host.appendChild(box);
    var BASE = 260, MAXH = 220, X1 = 110, X2 = 430, W = 110;
    stext(svg, X1 + W / 2, 290, 'Giren (yaş)', 'tx m');
    stext(svg, X2 + W / 2, 290, 'Ürün (kurumuş)', 'tx m');
    var w1 = s('rect', {x:X1, width:W, 'class':'fill water bar'}, svg), k1 = s('rect', {x:X1, width:W, 'class':'fill km bar'}, svg);
    var w2 = s('rect', {x:X2, width:W, 'class':'fill water bar'}, svg), k2 = s('rect', {x:X2, width:W, 'class':'fill km bar'}, svg);
    var lw1 = stext(svg, X1 - 10, 0, '', 'tx w', 'end'), lk1 = stext(svg, X1 - 10, 0, '', 'tx k', 'end');
    var lw2 = stext(svg, X2 + W + 10, 0, '', 'tx w', 'start'), lk2 = stext(svg, X2 + W + 10, 0, '', 'tx k', 'start');
    var link = s('path', {'class':'ln dash'}, svg);
    s('path', {d:'M250 150 L400 150', 'class':'ar w'}, svg); arrowHead(svg, 380, 150, 400, 150, 'w');
    var lw = stext(svg, 325, 135, '', 'tx v w'), dg = s('g', {'class':'drops on'}, svg);
    [0, 1, 2].forEach(function(j){ s('circle', {cx:310 + j * 14, cy:120, r:3.6, style:'animation-delay:' + (j * .4) + 's'}, dg); });
    stext(svg, 325, 180, 'kuru madde kaçmaz', 'tx k');
    function place(rect, y, hh){ rect.style.y = y + 'px'; rect.style.height = Math.max(hh, 0) + 'px'; rect.setAttribute('y', y); rect.setAttribute('height', Math.max(hh, 0)); }
    function paint(anim){
      if(n2.get() >= n1.get()) n2.set(n1.get() - 1);
      var M = m.get(), x1 = 1 - n1.get() / 100, x2 = 1 - n2.get() / 100, KM = M * x1, P = KM / x2, Wt = M - P;
      var sc = MAXH / M, hk = KM * sc, hw1 = (M - KM) * sc, hw2 = (P - KM) * sc;
      place(k1, BASE - hk, hk); place(w1, BASE - hk - hw1, hw1);
      place(k2, BASE - hk, hk);
      if(anim){ place(w2, BASE - hk - hw1, hw1); setTimeout(function(){ place(w2, BASE - hk - hw2, hw2); }, 450); }
      else place(w2, BASE - hk - hw2, hw2);
      link.setAttribute('d', 'M' + (X1 + W) + ' ' + (BASE - hk) + ' L' + X2 + ' ' + (BASE - hk));
      var set = function(t, y, str){ t.setAttribute('y', y); t.firstChild.setAttribute('y', y); t.firstChild.textContent = str; };
      set(lk1, BASE - hk / 2 + 5, nf(KM, 2) + ' kg KM'); set(lw1, BASE - hk - hw1 / 2 + 5, nf(M - KM, 2) + ' kg su');
      set(lk2, BASE - hk / 2 + 5, nf(KM, 2) + ' kg KM'); set(lw2, BASE - hk - Math.max(hw2, 14) / 2 + 5, nf(P - KM, 2) + ' kg su');
      lw.firstChild.textContent = 'W = ' + nf(Wt, 2) + ' kg su uçar';
      out.innerHTML = tx('Kuru madde: $' + nf(M, 2) + '\\times' + nf(x1, 3) + ' = ' + nf(KM, 2) + '$ kg (iki çubukta **aynı yükseklik**). Ürün: $' + nf(KM, 2) + '/' + nf(x2, 3) + ' = ' + nf(P, 2) + '$ kg. Uçan su: $' + nf(M, 2) + ' - ' + nf(P, 2) + ' = ' + nf(Wt, 2) + '$ kg.');
    }
    [m, n1, n2].forEach(function(x){ x.inp.addEventListener('input', function(){ paint(false); }); });
    btn.addEventListener('click', function(){ paint(true); });
    paint(true);
  }

  // ---------------------------------------------------------------- etkileşimli: termometre (T ve ΔT)
  function termometre(host){
    var box = h('div', {'class':'ka-inter'});
    var ctl = h('div', {'class':'ka-sls'});
    var t1 = slider('Başlangıç T₁', -50, 120, 1, 40, ' °C'), t2 = slider('Son T₂', -50, 120, 1, 95, ' °C');
    ctl.appendChild(t1.el); ctl.appendChild(t2.el);
    var svg = s('svg', {viewBox:'0 0 680 340', 'class':'ka-svg'});
    var out = h('div', {'class':'ka-note'});
    box.appendChild(ctl); box.appendChild(h('div', {'class':'ka-draw'})).appendChild(svg); box.appendChild(out);
    host.appendChild(box);
    var TOP = 30, BOT = 290, LO = -60, HI = 130;
    var yOf = function(c){ return BOT - (c - LO) / (HI - LO) * (BOT - TOP); };
    var SK = [
      {n:'°C', f:function(c){ return c; }, x:80}, {n:'K', f:function(c){ return c + 273.15; }, x:240},
      {n:'°F', f:function(c){ return c * 1.8 + 32; }, x:400}, {n:'R', f:function(c){ return c * 1.8 + 491.67; }, x:560}
    ];
    var parts = SK.map(function(k){
      s('rect', {x:k.x - 9, y:TOP - 8, width:18, height:BOT - TOP + 10, rx:9, 'class':'tube'}, svg);
      s('circle', {cx:k.x, cy:BOT + 14, r:16, 'class':'fill hg'}, svg);
      var col = s('rect', {x:k.x - 5, width:10, 'class':'fill hg bar'}, svg);
      [[-40, 'm'], [0, 'm'], [100, 'm']].forEach(function(r){
        var y = yOf(r[0]);
        s('line', {x1:k.x + 10, y1:y, x2:k.x + 20, y2:y, 'class':'ln'}, svg);
        stext(svg, k.x + 24, y + 4, nf(k.f(r[0]), 2), 'tx sm m', 'start');
      });
      stext(svg, k.x, 16, k.n, 'tx v');
      var m1 = s('line', {x1:k.x - 22, x2:k.x + 10, 'class':'ln mark'}, svg);
      var v1 = stext(svg, k.x - 26, 0, '', 'tx sm', 'end'), v2 = stext(svg, k.x - 26, 0, '', 'tx sm v', 'end');
      var br = s('path', {'class':'ln br'}, svg), d = stext(svg, k.x + 58, 0, '', 'tx v ok', 'start');
      return {k:k, col:col, m1:m1, v1:v1, v2:v2, br:br, d:d};
    });
    function paint(){
      var a = t1.get(), b = t2.get(), dt = b - a;
      parts.forEach(function(p){
        var ya = yOf(a), yb = yOf(b);
        p.col.style.y = yb + 'px'; p.col.style.height = (BOT + 4 - yb) + 'px'; p.col.setAttribute('y', yb); p.col.setAttribute('height', BOT + 4 - yb);
        p.m1.setAttribute('y1', ya); p.m1.setAttribute('y2', ya);
        var set = function(t, y, str){ t.setAttribute('y', y); t.firstChild.setAttribute('y', y); t.firstChild.textContent = str; };
        set(p.v1, ya + 4, nf(p.k.f(a), 2)); set(p.v2, yb + 4, nf(p.k.f(b), 2));
        var xb = p.k.x + 50;
        p.br.setAttribute('d', 'M' + (xb - 6) + ' ' + ya + ' L' + xb + ' ' + ya + ' L' + xb + ' ' + yb + ' L' + (xb - 6) + ' ' + yb);
        var dd = p.k.n === '°F' || p.k.n === 'R' ? dt * 1.8 : dt;
        set(p.d, (ya + yb) / 2 + 4, 'Δ ' + nf(dd, 2));
      });
      out.innerHTML = tx('Değer çevirme: $T_2 = ' + nf(b, 2) + '$ °C $= ' + nf(b + 273.15, 2) + '$ K $= 1{,}8(' + nf(b, 2) + ') + 32 = ' + nf(b * 1.8 + 32, 2) + '$ °F. ' +
        'Fark çevirme: $\\Delta T = ' + nf(dt, 2) + '$ °C $= ' + nf(dt, 2) + '$ K $= 1{,}8\\times' + nf(dt, 2) + ' = ' + nf(dt * 1.8, 2) + '$ °F. **Farkta +32 ve +273 yok!**');
    }
    [t1, t2].forEach(function(x){ x.inp.addEventListener('input', paint); });
    paint();
  }

  // ---------------------------------------------------------------- etkileşimli: basınç (mutlak / efektif / vakum)
  function basinc(host){
    var box = h('div', {'class':'ka-inter'});
    var ctl = h('div', {'class':'ka-sls'});
    var pa = slider('Atmosfer basıncı', .8, 1.05, .001, 1, ' atm'), pe = slider('Manometre (efektif) basınç', -1, 2, .005, -.395, ' atm');
    ctl.appendChild(pa.el); ctl.appendChild(pe.el);
    var unit = h('div', {'class':'ka-pick'}); unit.innerHTML = ['atm', 'kPa', 'mmHg', 'psi'].map(function(u, i){ return '<button type="button" class="chip' + (i ? '' : ' on') + '" data-u="' + u + '">' + u + '</button>'; }).join('');
    var svg = s('svg', {viewBox:'0 0 640 340', 'class':'ka-svg'});
    var out = h('div', {'class':'ka-note'});
    box.appendChild(ctl); box.appendChild(unit); box.appendChild(h('div', {'class':'ka-draw'})).appendChild(svg); box.appendChild(out);
    host.appendChild(box);
    var U = {atm:1, kPa:101.325, mmHg:760, psi:14.696}, cu = 'atm';
    var B0 = 290, SC = 85; // 1 atm = 85 px
    s('line', {x1:60, y1:B0, x2:600, y2:B0, 'class':'ln'}, svg); stext(svg, 335, B0 + 44, 'alttaki çizgi = 0: mükemmel vakum (mutlak sıfır basınç)', 'tx sm m', 'middle');
    var atmL = s('line', {x1:60, x2:600, 'class':'ln dash atm'}, svg), atmT = stext(svg, 140, 0, 'atmosfer', 'tx sm', 'end');
    var absR = s('rect', {x:150, width:70, 'class':'fill water bar'}, svg); stext(svg, 185, 312, 'mutlak', 'tx sm m');
    var atmR = s('rect', {x:300, width:70, 'class':'fill air bar'}, svg); stext(svg, 335, 312, 'atmosfer', 'tx sm m');
    var effR = s('rect', {x:450, width:70, 'class':'fill eff bar'}, svg); var effT = stext(svg, 485, 312, 'efektif', 'tx sm m');
    var tAbs = stext(svg, 185, 0, '', 'tx v'), tAtm = stext(svg, 335, 0, '', 'tx v'), tEff = stext(svg, 485, 0, '', 'tx v');
    function place(r, y1, y2){ var y = Math.min(y1, y2), hh = Math.abs(y2 - y1); r.style.y = y + 'px'; r.style.height = hh + 'px'; r.setAttribute('y', y); r.setAttribute('height', hh); }
    function setT(t, y, str){ t.setAttribute('y', y); t.firstChild.setAttribute('y', y); t.firstChild.textContent = str; }
    function paint(){
      if(pe.get() < -pa.get()) pe.set(-pa.get());
      var A_ = pa.get(), E_ = pe.get(), P = A_ + E_, f = U[cu];
      var ya = B0 - A_ * SC, yp = B0 - P * SC;
      atmL.setAttribute('y1', ya); atmL.setAttribute('y2', ya); setT(atmT, ya - 6, 'P atm');
      place(absR, B0, yp); place(atmR, B0, ya); place(effR, ya, yp);
      effR.classList.toggle('neg', E_ < 0);
      setT(tAbs, yp - 8, nf(P * f, 3)); setT(tAtm, ya - 22, nf(A_ * f, 3)); setT(tEff, Math.min(ya, yp) - 8, (E_ < 0 ? '−' : '+') + nf(Math.abs(E_) * f, 3));
      effT.firstChild.textContent = E_ < 0 ? 'vakum' : 'efektif';
      var abbr = cu === 'psi' ? ['psia', 'psig'] : [cu + ' (abs)', cu + ' (eff)'];
      out.innerHTML = tx(E_ < 0
        ? '**Vakum var.** Mutlak basınç atmosferin altında: $P_{abs} = ' + nf(P * f, 3) + '$ ' + abbr[0] + '. Vakum $= P_{atm} - P_{abs} = ' + nf(-E_ * f, 3) + '$ ' + cu + '. (Slayttaki kutu: 0,605 atm abs → 0,395 atm = 300,2 mmHg vakum.)'
        : '$P_{abs} = P_{atm} + P_{eff} = ' + nf(A_ * f, 3) + ' + ' + nf(E_ * f, 3) + ' = ' + nf(P * f, 3) + '$ ' + abbr[0] + '. Manometre yalnız $' + nf(E_ * f, 3) + '$ ' + abbr[1] + ' gösterir; atmosferi sıfır sayar.');
    }
    [pa, pe].forEach(function(x){ x.inp.addEventListener('input', paint); });
    unit.addEventListener('click', function(e){ var b = e.target.closest('.chip'); if(!b) return; cu = b.dataset.u; [].forEach.call(unit.querySelectorAll('.chip'), function(x){ x.classList.toggle('on', x === b); }); paint(); });
    paint();
  }

  // ---------------------------------------------------------------- etkileşimli: tank P = ρgh
  function tank(host, variant){
    var dom = variant === 'domates';
    var box = h('div', {'class':'ka-inter'});
    var ctl = h('div', {'class':'ka-sls'});
    var LIQ = [['Su', 1000], ['Süt', 1028], ['Zeytinyağı', 915], ['Domates suyu (%6 KM)', 1025], ['Cıva', 13595]];
    var selW = h('label', {'class':'ka-sl'}); selW.innerHTML = '<span>Sıvı</span><select>' + LIQ.map(function(l, i){ return '<option value="' + i + '">' + l[0] + ' · ' + l[1] + ' kg/m³</option>'; }).join('') + '</select>';
    var sel = selW.querySelector('select'); sel.value = dom ? 3 : 1;
    var hh = slider('Sıvı yüksekliği h', 0, 6, .01, dom ? 1.86 : 2.01, ' m'), dd = slider('Tank çapı', .5, 4, .05, 1, ' m');
    var openW = h('label', {'class':'ka-chk'}); openW.innerHTML = '<input type="checkbox"' + (dom ? ' checked' : '') + '> Ağzı açık (üstte atmosfer var)';
    var open = openW.querySelector('input');
    [selW, hh.el, dd.el, openW].forEach(function(x){ ctl.appendChild(x); });
    var svg = s('svg', {viewBox:'0 0 640 320', 'class':'ka-svg'});
    var out = h('div', {'class':'ka-note'});
    box.appendChild(ctl); box.appendChild(h('div', {'class':'ka-draw'})).appendChild(svg); box.appendChild(out);
    host.appendChild(box);
    var B0 = 290, SCY = 40, CX = 200;
    var wall = s('path', {'class':'bk'}, svg), liq = s('rect', {'class':'fill water bar'}, svg);
    var atmA = s('g', {'class':'k'}, svg); [0, 1, 2].forEach(function(j){ s('path', {d:'M' + (CX - 40 + j * 40) + ' 8 L' + (CX - 40 + j * 40) + ' 34', 'class':'ar heat'}, atmA); arrowHead(atmA, CX - 40 + j * 40, 20, CX - 40 + j * 40, 34, 'heat'); });
    var atmT = stext(atmA, CX + 70, 24, 'P atm = 101,325 kPa', 'tx sm', 'start');
    var gauge = s('circle', {cx:470, cy:B0 - 20, r:44, 'class':'gauge'}, svg), gv = stext(svg, 470, B0 - 16, '', 'tx v'), gu = stext(svg, 470, B0 + 2, 'kPa', 'tx sm m');
    s('path', {d:'M' + (CX + 10) + ' ' + (B0 - 4) + ' L426 ' + (B0 - 20), 'class':'ln'}, svg);
    var hl = stext(svg, 0, 0, '', 'tx v', 'end');
    var lim = s('line', {x1:300, x2:600, 'class':'ln dash bad'}, svg), limT = stext(svg, 600, 0, '', 'tx sm bad', 'end');
    function paint(){
      var rho = LIQ[+sel.value][1], H = hh.get(), D = dd.get(), op = open.checked;
      var ph = rho * 9.81 * H, pt = ph + (op ? 101325 : 0), Wd = 40 + D * 50, x0 = CX - Wd / 2;
      wall.setAttribute('d', 'M' + x0 + ' ' + (B0 - 6 * SCY - 10) + ' L' + x0 + ' ' + B0 + ' L' + (x0 + Wd) + ' ' + B0 + ' L' + (x0 + Wd) + ' ' + (B0 - 6 * SCY - 10));
      var y = B0 - H * SCY; liq.setAttribute('x', x0 + 3); liq.setAttribute('width', Wd - 6); liq.style.y = y + 'px'; liq.style.height = (H * SCY) + 'px'; liq.setAttribute('y', y); liq.setAttribute('height', H * SCY);
      liq.classList.toggle('oil', rho < 990); liq.classList.toggle('hgl', rho > 2000); liq.classList.toggle('tom', rho === 1025); liq.classList.toggle('milk', rho === 1028);
      atmA.classList.toggle('on', op);
      gv.firstChild.textContent = nf(pt / 1000, 2);
      hl.setAttribute('x', x0 - 8); hl.setAttribute('y', y + H * SCY / 2 + 4); hl.firstChild.setAttribute('x', x0 - 8); hl.firstChild.textContent = 'h = ' + nf(H, 2) + ' m';
      var m = rho * Math.PI * D * D / 4 * H;
      var over = dom && pt > 120000;
      gauge.classList.toggle('over', over);
      lim.style.display = limT.style.display = dom ? '' : 'none';
      if(dom){ lim.setAttribute('y1', B0 - 70); lim.setAttribute('y2', B0 - 70); limT.setAttribute('y', B0 - 76); limT.firstChild.textContent = 'sınır: 120 kPa'; }
      out.innerHTML = tx('Hidrostatik: $\\rho g h = ' + nf(rho) + '\\times9{,}81\\times' + nf(H, 2) + ' = ' + nf(ph / 1000, 2) + '$ kPa' + (op ? '; ağzı açık → $+101{,}325$ → tabanda **' + nf(pt / 1000, 2) + ' kPa** (mutlak)' : ' (efektif)') + '. ' +
        'Kütle: $\\rho\\,\\pi r^2 h = ' + nf(m, 0) + '$ kg. **Çapı değiştir: kütle değişir, basınç değişmez.**' + (dom ? (over ? ' **Sınır aşıldı!**' : ' Sınırın altında. En fazla h = 1,86 m, ≈ 1495 kg.') : ''));
    }
    [hh, dd].forEach(function(x){ x.inp.addEventListener('input', paint); });
    sel.addEventListener('change', paint); open.addEventListener('change', paint);
    paint();
  }

  // ---------------------------------------------------------------- etkileşimli: interpolasyon (su yoğunluğu)
  function interp(host){
    var TB = [[0, .99987], [3.98, 1], [5, .99999], [10, .99973], [15, .99913], [40, .99224], [80, .97183], [100, .95838]];
    var box = h('div', {'class':'ka-inter'});
    var ctl = h('div', {'class':'ka-sls'});
    var tt = slider('Sıcaklık', 0, 100, .5, 12, ' °C'); ctl.appendChild(tt.el);
    var svg = s('svg', {viewBox:'0 0 640 300', 'class':'ka-svg'});
    var out = h('div', {'class':'ka-note'});
    box.appendChild(ctl); box.appendChild(h('div', {'class':'ka-draw'})).appendChild(svg); box.appendChild(out);
    host.appendChild(box);
    var X0 = 70, X1 = 610, Y0 = 260, Y1 = 30, RLO = .955, RHI = 1.001;
    var xo = function(t){ return X0 + t / 100 * (X1 - X0); }, yo = function(r){ return Y0 - (r - RLO) / (RHI - RLO) * (Y0 - Y1); };
    s('line', {x1:X0, y1:Y0, x2:X1, y2:Y0, 'class':'ln'}, svg); s('line', {x1:X0, y1:Y0, x2:X0, y2:Y1, 'class':'ln'}, svg);
    stext(svg, X1, Y0 + 30, 'T (°C)', 'tx sm m', 'end'); stext(svg, X0 - 6, Y1 - 10, 'ρ (g/cm³)', 'tx sm m', 'start');
    s('path', {d:TB.map(function(p, i){ return (i ? 'L' : 'M') + xo(p[0]) + ' ' + yo(p[1]); }).join(' '), 'class':'ln curve'}, svg);
    var dots = TB.map(function(p){ stext(svg, xo(p[0]), Y0 + 16, nf(p[0], 2), 'tx sm m'); return s('circle', {cx:xo(p[0]), cy:yo(p[1]), r:4.5, 'class':'fill dotp'}, svg); });
    var seg = s('line', {'class':'ln seg'}, svg), pt = s('circle', {r:6.5, 'class':'fill hit'}, svg), vl = s('line', {'class':'ln dash'}, svg), pv = stext(svg, 0, 0, '', 'tx v', 'start');
    function paint(){
      var t = tt.get(), i = 0;
      while(i < TB.length - 2 && t > TB[i + 1][0]) i++;
      var a = TB[i], b = TB[i + 1], r = a[1] + (t - a[0]) / (b[0] - a[0]) * (b[1] - a[1]);
      dots.forEach(function(d, j){ d.classList.toggle('br', j === i || j === i + 1); });
      seg.setAttribute('x1', xo(a[0])); seg.setAttribute('y1', yo(a[1])); seg.setAttribute('x2', xo(b[0])); seg.setAttribute('y2', yo(b[1]));
      pt.setAttribute('cx', xo(t)); pt.setAttribute('cy', yo(r));
      vl.setAttribute('x1', xo(t)); vl.setAttribute('x2', xo(t)); vl.setAttribute('y1', Y0); vl.setAttribute('y2', yo(r));
      pv.setAttribute('x', Math.min(xo(t) + 10, 470)); pv.setAttribute('y', yo(r) + 24); pv.firstChild.setAttribute('x', Math.min(xo(t) + 10, 470)); pv.firstChild.textContent = 'ρ = ' + nf(r, 5);
      out.innerHTML = tx('Komşular: $(' + nf(a[0], 2) + ';\\ ' + nf(a[1], 5) + ')$ ve $(' + nf(b[0], 2) + ';\\ ' + nf(b[1], 5) + ')$. ' +
        '$\\rho = ' + nf(a[1], 5) + ' + \\dfrac{' + nf(t, 2) + ' - ' + nf(a[0], 2) + '}{' + nf(b[0], 2) + ' - ' + nf(a[0], 2) + '}(' + nf(b[1], 5) + ' - ' + nf(a[1], 5) + ') = ' + nf(r, 5) + '$ g/cm³ $= ' + nf(r * 1000, 2) + '$ kg/m³');
    }
    tt.inp.addEventListener('input', paint); paint();
  }

  // ---------------------------------------------------------------- dışa açılan
  var LIST = {
    kurutma:{t:'Kurutma: kuru madde kaçmaz', d:'Kaydırıcılarla kütleyi ve nemleri değiştir; kuru madde bloğu iki çubukta aynı kalır.', f:kurutma},
    birimagaci:{t:'SI birim ağacı: kg, m, s → N, J, W, Pa', d:'Türetilmiş birimler temel birimlerden adım adım.', f:function(el){ scene(el, SC.birimagaci); }},
    cevirme:{t:'Birim çevirme zinciri', d:'Çevirme kesirleri tek tek eklenir, sadeleşen birimlerin üstü çizilir.', f:chain},
    resayi:{t:'Reynolds sayısı neden birimsiz?', d:'D·V·ρ/µ\'nün bütün birimleri sadeleşir.', f:function(el){ chain(el, 're'); }},
    ppm:{t:'ppm ve ppb: 1 kg\'a ölçekle', d:'80 mL suda 1 mg → 12,5 ppm → 12 500 ppb.', f:function(el){ scene(el, SC.ppm); }},
    molar:{t:'Molarite mi, molalite mi?', d:'Çözelti hacmi ile çözücü kütlesi farkı.', f:function(el){ scene(el, SC.molar); }},
    yogunluk:{t:'Katı, partikül ve kitle yoğunluğu', d:'Hangi boşluk hacme dahil?', f:function(el){ scene(el, SC.yogunluk); }},
    interp:{t:'İnterpolasyon (su yoğunluğu tablosu)', d:'Sıcaklığı kaydır; iki komşu nokta arasındaki doğru üstünde değer okunur.', f:interp},
    termometre:{t:'Dört termometre: T ve ΔT', d:'İki sıcaklık seç; değer çevirme ile fark çevirmenin farkını gör.', f:termometre},
    basinc:{t:'Mutlak, efektif basınç ve vakum', d:'Manometre değerini kaydır; mutlak = atmosfer + efektif.', f:basinc},
    tank:{t:'Tank: P = ρgh', d:'Sıvıyı, yüksekliği ve çapı değiştir; çap basıncı değiştirmez.', f:tank},
    sistemler:{t:'Açık, kapalı, izole sistem', d:'Sınırdan kütle ve ısı geçiyor mu?', f:function(el){ scene(el, SC.sistemler); }},
    evaporator:{t:'Evaporatör: toplam + kuru madde denkliği', d:'Hafta 8, Örnek 7 adım adım.', f:function(el){ scene(el, SC.evaporator); }},
    karistirma:{t:'Karıştırma: meyve suyu + şurup', d:'Hafta 8, Örnek 8: üç denklem.', f:function(el){ scene(el, SC.karistirma); }},
    kristal:{t:'Kristalizasyon', d:'Hafta 8, Örnek 9: kristal ve doymuş şurup.', f:function(el){ scene(el, SC.kristal); }},
    separator:{t:'Krema separatörü', d:'Derste çözülen soru: yağ denkliği.', f:function(el){ scene(el, SC.separator); }},
    salca:{t:'Salça hattı: ayıklama → palper → evaporatör', d:'Hafta 9, Örnek 3: günde kaç kutu?', f:function(el){ scene(el, SC.salca); }},
    nektar:{t:'Nektar ayarlama: önce asit', d:'Hafta 9, Örnek 5: vişne nektarı.', f:function(el){ scene(el, SC.nektar); }},
    cikmis:{t:'Çıkmış soru: evaporatör + kristalizatör + santrifüj', d:'Alt sistemlerle adım adım.', f:function(el){ scene(el, SC.cikmis); }}
  };
  window.KEDA = {
    list:LIST,
    info:function(id){ return LIST[String(id).split(':')[0]]; },
    mount:function(id, el){
      var p = String(id).split(':'), a = LIST[p[0]];
      el.innerHTML = '';
      if(!a){ el.textContent = 'Animasyon bulunamadı: ' + id; return; }
      UID++;
      a.f(el, p[1]);
    }
  };
})();
