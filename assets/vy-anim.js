// Veri Yapıları: adım adım kod animasyonları.
// Her animasyon dersin C kodunu satır satır yürütür; her adımda vurgulanan satır, açıklama,
// değişkenler ve veri yapısının o anki hâli kaydedilir. Oynatıcı bu kareleri video gibi oynatır.
(function(){
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  var clone = function(o){ return JSON.parse(JSON.stringify(o)); };
  var nums = function(s){ return (String(s).match(/-?\d+/g) || []).map(Number); };

  // ---------- C sözdizimi renklendirme (kod görüntüleyici de kullanır)
  var KW = /\b(int|void|struct|return|if|else|while|for|do|break|continue|char|float|double|static|sizeof|NULL|unsigned|long|typedef|const|bool|true|false|include|define)\b/;
  function hlLine(line, st){
    var out = '', i = 0;
    while(i < line.length){
      if(st.c){ var e = line.indexOf('*/', i); if(e < 0){ out += '<span class="cm">' + esc(line.slice(i)) + '</span>'; return out; } out += '<span class="cm">' + esc(line.slice(i, e + 2)) + '</span>'; i = e + 2; st.c = false; continue; }
      var rest = line.slice(i), m;
      if(rest.indexOf('/*') === 0){ st.c = true; continue; }
      if(rest.indexOf('//') === 0){ out += '<span class="cm">' + esc(rest) + '</span>'; return out; }
      if((m = /^"(?:\\.|[^"\\])*"/.exec(rest)) || (m = /^'(?:\\.|[^'\\])'/.exec(rest))){ out += '<span class="st">' + esc(m[0]) + '</span>'; i += m[0].length; continue; }
      if((m = /^#\w+/.exec(rest))){ out += '<span class="kw">' + esc(m[0]) + '</span>'; i += m[0].length; continue; }
      if((m = /^[A-Za-z_]\w*/.exec(rest))){
        var w = m[0];
        if(KW.test(w) && new RegExp('^(' + KW.source.slice(3, -3) + ')$').test(w)) out += '<span class="kw">' + w + '</span>';
        else if(/^(malloc|free|realloc|printf|exit|rand|srand|time|scanf)$/.test(w)) out += '<span class="fn">' + w + '</span>';
        else out += esc(w);
        i += w.length; continue;
      }
      if((m = /^\d+/.exec(rest))){ out += '<span class="nu">' + m[0] + '</span>'; i += m[0].length; continue; }
      out += esc(line[i]); i++;
    }
    return out;
  }
  function hlCode(src, startNo){
    var st = {c:false}, n = startNo || 1;
    return src.split('\n').map(function(l, k){ return '<span class="cl" data-l="' + (n + k) + '"><span class="ln">' + (n + k) + '</span>' + (hlLine(l, st) || ' ') + '\n</span>'; }).join('');
  }
  window.VY_HL = hlCode;

  // ---------- kayıt tutucu
  function Rec(code){
    var lines = code.split('\n');
    this.frames = [];
    // önce satırın tamamı eşleşen, yoksa içinde geçen n. satır; '$' son satır
    this.line = function(sub, nth){
      nth = nth || 1;
      if(sub === '$'){ for(var j = lines.length - 1; j >= 0; j--) if(lines[j].trim()) return j + 1; }
      var exact = [], part = [];
      lines.forEach(function(l, i){ if(l.trim() === sub) exact.push(i + 1); if(l.indexOf(sub) >= 0) part.push(i + 1); });
      if(exact.length >= nth) return exact[nth - 1];
      if(part.length >= nth) return part[nth - 1];
      throw new Error('satır yok: ' + sub);
    };
  }
  Rec.prototype.f = function(sub, note, st, vars, nth){
    this.frames.push({l: sub ? this.line(sub, nth) : 0, note: note, st: clone(st), v: clone(vars || {})});
  };

  // ================= ÇİZİCİLER =================
  var W = 84, H = 40, GAP = 46;
  function svg(w, h, body){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" class="anim-svg" role="img">' +
    '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker></defs>' + body + '</svg>'; }
  function ptrTags(list, x, y, up){ // işaretçi etiketleri bir düğümün üstünde/altında
    var h = '';
    list.forEach(function(p, i){
      var ty = up ? y - 26 - i * 22 : y + H + 10 + i * 22, w = Math.max(34, p.length * 7.4 + 12);
      h += '<g class="ptr' + (p === 'liste_basi' || p === 'bas' || p === 'yigin' || p === 'kok' ? ' main' : '') + '"><rect x="' + (x + W / 2 - w / 2) + '" y="' + ty + '" width="' + w + '" height="18" rx="9"/><text x="' + (x + W / 2) + '" y="' + (ty + 13) + '">' + esc(p) + '</text></g>';
    });
    if(list.length){
      var y1 = up ? y - 8 : y + H + 10, y2 = up ? y - 1 : y + H + 1;
      h += '<line class="ptr-l" x1="' + (x + W / 2) + '" y1="' + y1 + '" x2="' + (x + W / 2) + '" y2="' + y2 + '" marker-end="url(#ah)"/>';
    }
    return h;
  }
  function byNode(ptrs){ var m = {}; Object.keys(ptrs).forEach(function(k){ var v = ptrs[k]; if(v != null){ (m[v] = m[v] || []).push(k); } }); return m; }

  // tek yönlü liste: st = {nodes:{id:{k,n,row,freed}}, order:[id], ptrs:{ad:id|null}, hl:[id]}
  function drawList(st){
    var pos = {}, x0 = 24, maxRow = 0, tagsUp = 0, tagsDn = 0, pm = byNode(st.ptrs);
    st.order.forEach(function(id, i){ var nd = st.nodes[id]; if(!nd) return; pos[id] = {x: x0 + i * (W + GAP), row: nd.row || 0}; if(pos[id].row > maxRow) maxRow = pos[id].row; });
    Object.keys(pm).forEach(function(id){ if(!pos[id]) return; if(pos[id].row === 0) tagsUp = Math.max(tagsUp, pm[id].length); else tagsDn = Math.max(tagsDn, pm[id].length); });
    var top = 16 + tagsUp * 22, rowY = function(r){ return top + r * (H + 70); };
    var w = x0 * 2 + Math.max(1, st.order.length) * (W + GAP), h = rowY(maxRow) + H + 30 + tagsDn * 22;
    var body = '';
    st.order.forEach(function(id){
      var nd = st.nodes[id], p = pos[id]; if(!nd || !p) return;
      var x = p.x, y = rowY(p.row);
      if(nd.n != null && pos[nd.n] && !nd.freed){
        var t = pos[nd.n], tx = t.x, ty = rowY(t.row), sx = x + W - 18, sy = y + H / 2;
        if(t.row === p.row && tx > x) body += '<path class="arr" d="M' + sx + ',' + sy + ' L' + (tx - 2) + ',' + (ty + H / 2) + '" marker-end="url(#ah)"/>';
        else if(t.row === p.row){ var dy = y + H + 34; body += '<path class="arr back" d="M' + sx + ',' + (y + H) + ' C' + sx + ',' + dy + ' ' + (tx + W / 2) + ',' + dy + ' ' + (tx + W / 2) + ',' + (ty + H + 2) + '" marker-end="url(#ah)"/>'; }
        else { var my = (sy + ty + H / 2) / 2; body += '<path class="arr" d="M' + sx + ',' + (t.row < p.row ? y : y + H) + ' C' + sx + ',' + my + ' ' + (tx + 18) + ',' + my + ' ' + (tx + 18) + ',' + (t.row < p.row ? ty + H + 2 : ty - 2) + '" marker-end="url(#ah)"/>'; }
      }
    });
    st.order.forEach(function(id){
      var nd = st.nodes[id], p = pos[id]; if(!nd || !p) return;
      var x = p.x, y = rowY(p.row), cls = 'node' + ((st.hl || []).indexOf(id) >= 0 ? ' hl' : '') + (nd.freed ? ' freed' : '') + (nd.row ? ' fresh' : '');
      body += '<g class="' + cls + '"><rect x="' + x + '" y="' + y + '" width="' + W + '" height="' + H + '" rx="8"/>' +
        '<line x1="' + (x + W - 36) + '" y1="' + y + '" x2="' + (x + W - 36) + '" y2="' + (y + H) + '" class="div"/>' +
        '<text x="' + (x + (W - 36) / 2) + '" y="' + (y + 26) + '" class="k">' + esc(nd.k == null ? '?' : nd.k) + '</text>' +
        (nd.n === undefined ? '<text x="' + (x + W - 18) + '" y="' + (y + 26) + '" class="q">?</text>' :
         nd.n === null && !nd.freed ? '<line x1="' + (x + W - 32) + '" y1="' + (y + H - 6) + '" x2="' + (x + W - 4) + '" y2="' + (y + 6) + '" class="nul"/>' : '') +
        (nd.freed ? '<text x="' + (x + W / 2) + '" y="' + (y - 6) + '" class="fr">free</text>' : '') + '</g>';
      body += ptrTags(pm[id] || [], x, y, p.row === 0);
    });
    return svg(w, h, body);
  }

  // çift yönlü liste: düğüm [geri | anahtar | ileri]
  function drawDList(st){
    var pos = {}, x0 = 24, pm = byNode(st.ptrs), tags = 0;
    st.order.forEach(function(id, i){ pos[id] = {x: x0 + i * (W + 64), row: st.nodes[id].row || 0}; });
    Object.keys(pm).forEach(function(id){ tags = Math.max(tags, pm[id].length); });
    var top = 18 + tags * 22, rowY = function(r){ return top + r * (H + 70); };
    var w = x0 * 2 + st.order.length * (W + 64), h = rowY(1) + H + 40, body = '';
    st.order.forEach(function(id){
      var nd = st.nodes[id], p = pos[id], x = p.x, y = rowY(p.row);
      if(nd.n != null && pos[nd.n]){ var t = pos[nd.n]; body += '<path class="arr" d="M' + (x + W - 12) + ',' + (y + 12) + ' L' + (t.x - 2) + ',' + (rowY(t.row) + 12) + '" marker-end="url(#ah)"/>'; }
      if(nd.g != null && pos[nd.g]){ var g = pos[nd.g]; body += '<path class="arr back" d="M' + (x + 12) + ',' + (y + H - 10) + ' L' + (g.x + W + 2) + ',' + (rowY(g.row) + H - 10) + '" marker-end="url(#ah)"/>'; }
    });
    st.order.forEach(function(id){
      var nd = st.nodes[id], p = pos[id], x = p.x, y = rowY(p.row);
      body += '<g class="node' + ((st.hl || []).indexOf(id) >= 0 ? ' hl' : '') + (nd.row ? ' fresh' : '') + '"><rect x="' + x + '" y="' + y + '" width="' + W + '" height="' + H + '" rx="8"/>' +
        '<line x1="' + (x + 24) + '" y1="' + y + '" x2="' + (x + 24) + '" y2="' + (y + H) + '" class="div"/><line x1="' + (x + W - 24) + '" y1="' + y + '" x2="' + (x + W - 24) + '" y2="' + (y + H) + '" class="div"/>' +
        '<text x="' + (x + W / 2) + '" y="' + (y + 26) + '" class="k">' + esc(nd.k) + '</text>' +
        (nd.g === null ? '<line x1="' + (x + 4) + '" y1="' + (y + H - 6) + '" x2="' + (x + 20) + '" y2="' + (y + 6) + '" class="nul"/>' : '') +
        (nd.n === null ? '<line x1="' + (x + W - 20) + '" y1="' + (y + H - 6) + '" x2="' + (x + W - 4) + '" y2="' + (y + 6) + '" class="nul"/>' : '') + '</g>';
      body += ptrTags(pm[id] || [], x, y, p.row === 0);
    });
    return svg(w, h, body);
  }

  // ağaç: st = {nodes:{id:{k,l,r}}, root:id, ptrs:{}, hl:[], vis:[], gone:[]}
  function drawTree(st){
    var i = 0, maxD = 0, P = {}, R = 20, SX = 50, SY = 66, pm = byNode(st.ptrs);
    (function w(id, d){ if(id == null || !st.nodes[id]) return; var nd = st.nodes[id]; w(nd.l, d + 1); P[id] = {x: i++, d: d}; if(d > maxD) maxD = d; w(nd.r, d + 1); })(st.root, 0);
    var loose = Object.keys(st.nodes).filter(function(id){ return !P[id]; });
    loose.forEach(function(id){ P[id] = {x: i++, d: maxD + 1, loose: true}; });
    if(loose.length) maxD++;
    var px = function(id){ return 30 + P[id].x * SX; }, py = function(id){ return 56 + P[id].d * SY; };
    var w = Math.max(200, 60 + Math.max(1, i) * SX), h = 96 + maxD * SY + 30, body = '';
    Object.keys(P).forEach(function(id){ var nd = st.nodes[id]; [nd.l, nd.r].forEach(function(c){ if(c != null && P[c]) body += '<line class="te' + ((st.path || []).indexOf(c) >= 0 ? ' on' : '') + '" x1="' + px(id) + '" y1="' + py(id) + '" x2="' + px(c) + '" y2="' + py(c) + '"/>'; }); });
    Object.keys(P).forEach(function(id){
      var nd = st.nodes[id], cls = 'tn' + ((st.hl || []).indexOf(id) >= 0 ? ' hl' : '') + ((st.vis || []).indexOf(id) >= 0 ? ' vis' : '') + ((st.gone || []).indexOf(id) >= 0 ? ' gone' : '') + (P[id].loose ? ' fresh' : '');
      body += '<g class="' + cls + '"><circle cx="' + px(id) + '" cy="' + py(id) + '" r="' + R + '"/><text x="' + px(id) + '" y="' + (py(id) + 4) + '">' + esc(nd.k) + '</text></g>';
      var tags = pm[id] || [];
      if(tags.length){ var t = tags.join(', '), tw = t.length * 7 + 12; body += '<g class="ptr' + (tags.indexOf('kok') >= 0 ? ' main' : '') + '"><rect x="' + (px(id) - tw / 2) + '" y="' + (py(id) - R - 24) + '" width="' + tw + '" height="17" rx="8"/><text x="' + px(id) + '" y="' + (py(id) - R - 12) + '">' + esc(t) + '</text></g>'; }
    });
    return svg(w, h, body);
  }

  // heap: st = {a:[], n, hl:[], sw:[]}
  function drawHeap(st){
    var CW = 46, n = st.a.length, body = '', w = Math.max(260, 30 + n * CW);
    st.a.forEach(function(v, i){
      var x = 15 + i * CW, cls = 'cell' + (i >= st.n ? ' out' : '') + ((st.hl || []).indexOf(i) >= 0 ? ' hl' : '') + ((st.sw || []).indexOf(i) >= 0 ? ' sw' : '');
      body += '<g class="' + cls + '"><rect x="' + x + '" y="20" width="' + (CW - 4) + '" height="34" rx="6"/><text x="' + (x + CW / 2 - 2) + '" y="42">' + esc(v) + '</text><text class="ix" x="' + (x + CW / 2 - 2) + '" y="14">' + i + '</text></g>';
    });
    // ağaç görünümü
    var act = Math.max(st.n, 0), cnt = 0, P = {}, maxD = 0;
    (function w2(i, d){ if(i >= act) return; w2(2 * i + 1, d + 1); P[i] = {x: cnt++, d: d}; if(d > maxD) maxD = d; w2(2 * i + 2, d + 1); })(0, 0);
    var SX = 44, SY = 58, ox = 30, oy = 100, tw = 60 + cnt * SX;
    Object.keys(P).forEach(function(k){ var i = +k; [2 * i + 1, 2 * i + 2].forEach(function(c){ if(P[c]) body += '<line class="te" x1="' + (ox + P[i].x * SX) + '" y1="' + (oy + P[i].d * SY) + '" x2="' + (ox + P[c].x * SX) + '" y2="' + (oy + P[c].d * SY) + '"/>'; }); });
    Object.keys(P).forEach(function(k){ var i = +k, cls = 'tn' + ((st.hl || []).indexOf(i) >= 0 ? ' hl' : '') + ((st.sw || []).indexOf(i) >= 0 ? ' sw' : '');
      body += '<g class="' + cls + '"><circle cx="' + (ox + P[i].x * SX) + '" cy="' + (oy + P[i].d * SY) + '" r="18"/><text x="' + (ox + P[i].x * SX) + '" y="' + (oy + P[i].d * SY + 4) + '">' + esc(st.a[i]) + '</text><text class="ix" x="' + (ox + P[i].x * SX) + '" y="' + (oy + P[i].d * SY + 32) + '">' + i + '</text></g>'; });
    return svg(Math.max(w, tw), oy + maxD * SY + 50, body);
  }

  // dizi ile yığın: st = {arr:[], cap, ust}
  function drawStack(st){
    var CH = 34, w = 260, h = 40 + st.cap * CH + 30, body = '';
    for(var i = 0; i < st.cap; i++){
      var y = 20 + (st.cap - 1 - i) * CH, used = i <= st.ust, cls = 'cell' + (used ? '' : ' empty') + ((st.hl || []).indexOf(i) >= 0 ? ' hl' : '');
      body += '<g class="' + cls + '"><rect x="90" y="' + y + '" width="80" height="' + (CH - 4) + '" rx="6"/><text x="130" y="' + (y + 20) + '">' + (used ? esc(st.arr[i]) : '') + '</text><text class="ix" x="72" y="' + (y + 20) + '">' + i + '</text></g>';
    }
    var uy = st.ust < 0 ? 20 + st.cap * CH + 4 : 20 + (st.cap - 1 - st.ust) * CH + 15;
    body += '<g class="ptr main"><rect x="186" y="' + (uy - 9) + '" width="62" height="18" rx="9"/><text x="217" y="' + (uy + 4) + '">ust=' + st.ust + '</text></g><line class="ptr-l" x1="186" y1="' + uy + '" x2="174" y2="' + uy + '" marker-end="url(#ah)"/>';
    body += '<text class="cap" x="130" y="' + (h - 6) + '">kapasite = ' + st.cap + '</text>';
    return svg(w, h, body);
  }

  // bellek: st = {stack:[{ad, v, to}], heap:[{id, ad, cells:[{v, to}], adr}]}
  function drawMem(st){
    var body = '', CW = 44, bx = 285, y = 34, pos = {}, cellPos = {};
    st.heap.forEach(function(b){
      pos[b.id] = {x: bx, y: y};
      body += '<text class="lbl" x="' + bx + '" y="' + (y - 8) + '">' + esc(b.ad) + (b.adr ? ' · ' + esc(b.adr) : '') + '</text>';
      b.cells.forEach(function(c, i){
        var x = bx + i * CW;
        cellPos[b.id + ':' + i] = {x: x + CW / 2 - 2, y: y + 30};
        body += '<g class="cell' + (c.hl ? ' hl' : '') + '"><rect x="' + x + '" y="' + y + '" width="' + (CW - 4) + '" height="30" rx="5"/><text x="' + (x + CW / 2 - 2) + '" y="' + (y + 20) + '">' + (c.to != null ? '•' : esc(c.v == null ? '?' : c.v)) + '</text></g>';
      });
      y += 72;
    });
    var sy = 34, body2 = '', arrows = '';
    body2 += '<text class="zone" x="20" y="18">STACK</text><text class="zone" x="' + bx + '" y="18">HEAP</text>';
    st.stack.forEach(function(s){
      body2 += '<g class="cell' + (s.hl ? ' hl' : '') + '"><rect x="20" y="' + sy + '" width="190" height="30" rx="5"/><text x="30" y="' + (sy + 20) + '" class="lft">' + esc(s.ad) + '</text><text x="200" y="' + (sy + 20) + '" class="rgt">' + (s.to != null ? '•' : esc(s.v == null ? '?' : s.v)) + '</text></g>';
      if(s.to != null && pos[s.to]) arrows += '<path class="arr" d="M208,' + (sy + 15) + ' C245,' + (sy + 15) + ' 245,' + (pos[s.to].y + 15) + ' ' + (pos[s.to].x - 2) + ',' + (pos[s.to].y + 15) + '" marker-end="url(#ah)"/>';
      sy += 44;
    });
    st.heap.forEach(function(b){ b.cells.forEach(function(c, i){ if(c.to != null && pos[c.to]){ var f = cellPos[b.id + ':' + i], t = pos[c.to];
      arrows += '<path class="arr" d="M' + f.x + ',' + (f.y - 4) + ' C' + f.x + ',' + (t.y - 20) + ' ' + (t.x + 10) + ',' + (t.y - 30) + ' ' + (t.x + 10) + ',' + (t.y - 2) + '" marker-end="url(#ah)"/>'; } }); });
    var maxCells = Math.max.apply(null, [3].concat(st.heap.map(function(b){ return b.cells.length; })));
    return svg(bx + maxCells * CW + 30, Math.max(y, sy) + 20, body2 + body + arrows);
  }

  // matris çarpımı: st = {A, B, C, i, j, k}
  function drawMatrix(st){
    var CW = 38, body = '', x = 10;
    function grid(M, name, hl){
      var h = '<text class="lbl" x="' + x + '" y="16">' + name + '</text>';
      M.forEach(function(row, r){ row.forEach(function(v, c){ var on = hl(r, c); h += '<g class="cell' + (on === 2 ? ' sw' : on ? ' hl' : '') + '"><rect x="' + (x + c * CW) + '" y="' + (24 + r * CW) + '" width="' + (CW - 4) + '" height="' + (CW - 4) + '" rx="5"/><text x="' + (x + c * CW + CW / 2 - 2) + '" y="' + (24 + r * CW + 22) + '">' + (v == null ? '' : v) + '</text></g>'; }); });
      x += M[0].length * CW + 40; return h;
    }
    body += grid(st.A, 'A', function(r, c){ return r === st.i ? (c === st.k ? 2 : 1) : 0; });
    body += grid(st.B, 'B', function(r, c){ return c === st.j ? (r === st.k ? 2 : 1) : 0; });
    body += grid(st.C, 'C', function(r, c){ return r === st.i && c === st.j ? 2 : 0; });
    var rows = Math.max(st.A.length, st.B.length);
    return svg(x, 40 + rows * CW, body);
  }

  var DRAW = {list: drawList, dlist: drawDList, tree: drawTree, heap: drawHeap, stack: drawStack, mem: drawMem, matrix: drawMatrix};

  // ================= ANİMASYONLAR =================
  var ANIMS = [];
  function def(o){ ANIMS.push(o); }

  // liste yardımcıları
  function mkList(keys){ var st = {nodes:{}, order:[], ptrs:{}, hl:[]}; keys.forEach(function(k, i){ var id = 'n' + i; st.nodes[id] = {k:k, n: i < keys.length - 1 ? 'n' + (i + 1) : null}; st.order.push(id); }); return st; }
  function headOf(st){ return st.order.length ? st.order[0] : null; }
  function printList(st, head){ var out = [], cur = head, guard = 0; while(cur != null && guard++ < 50){ out.push(st.nodes[cur].k); cur = st.nodes[cur].n; } return out.join(' '); }

  var C_OLUSTUR = 'struct dugum* dugum_olustur(int anahtar){\n    struct dugum *a;\n    a=(struct dugum*)malloc(sizeof(struct dugum));\n    if(a==NULL){\n        printf("Heap alaninda yer ayrilamadi ...");\n        exit(1);\n    }\n    a->anahtar=anahtar;\n    a->sonraki=NULL;\n    return a;\n}';
  function olusturFrames(r, st, id, key, vars, label){
    r.f('struct dugum* dugum_olustur', 'dugum_olustur(' + key + ') çağrıldı. Yeni düğümü bu fonksiyon yaratacak.', st, vars);
    st.nodes[id] = {k:null, n:undefined, row:1}; st.order = label(st.order, id); st.ptrs.a = id; st.hl = [id];
    r.f('a=(struct dugum*)malloc', 'malloc heap\'ten bir düğümlük yer ayırdı. a bu yerin adresini tutuyor. İçi henüz boş (?).', st, Object.assign({}, vars, {a:'yeni adres'}));
    r.f('if(a==NULL)', 'Yer ayrılabildi mi? a NULL değil, devam.', st, vars);
    st.nodes[id].k = key;
    r.f('a->anahtar=anahtar', 'Düğümün anahtar alanına ' + key + ' yazıldı.', st, vars);
    st.nodes[id].n = null;
    r.f('a->sonraki=NULL', 'sonraki alanı NULL: şimdilik kimseyi göstermiyor (çapraz çizgi).', st, vars);
    r.f('return a;', 'Yeni düğümün adresi çağıran fonksiyona döndü.', st, vars);
  }

  def({id:'a-basa', week:3, title:'Listenin başına ekleme', view:'list', file:'h3-liste',
    desc:'dugum_olustur ile malloc\'tan yeni düğüm alınır, sonra iki satırla listenin başına bağlanır.',
    inputs:[['liste', 'Liste', '30 50 70'], ['yeni', 'Eklenecek', '10']],
    code: C_OLUSTUR + '\n\nvoid liste_basina_ekle(int anahtar,struct dugum **liste_basi){\n    struct dugum* a=dugum_olustur(anahtar);\n    a->sonraki=*liste_basi;\n    *liste_basi=a;\n}',
    run: function(p, r){
      var st = mkList(nums(p.liste)), key = nums(p.yeni)[0]; if(key == null) key = 10;
      st.ptrs.liste_basi = headOf(st);
      r.f('void liste_basina_ekle', 'main\'den liste_basina_ekle(' + key + ', &liste) çağrıldı. liste_basi, main\'deki liste değişkeninin adresini tutuyor; *liste_basi ilk düğüm.', st, {anahtar:key});
      r.f('struct dugum* a=dugum_olustur', 'İlk iş yeni düğümü oluşturmak.', st, {anahtar:key});
      var vars = {anahtar:key};
      olusturFrames(r, st, 'nw', key, vars, function(o, id){ return [id].concat(o); });
      r.f('struct dugum* a=dugum_olustur', 'Geri döndük: liste_basina_ekle\'deki a yeni düğümü gösteriyor.', st, vars);
      st.nodes.nw.n = st.ptrs.liste_basi;
      r.f('a->sonraki=*liste_basi;', st.ptrs.liste_basi ? 'a->sonraki = *liste_basi: yeni düğüm eski ilk düğümü (' + st.nodes[st.ptrs.liste_basi].k + ') gösteriyor. Liste henüz değişmedi.' : 'Liste boştu: *liste_basi NULL, yeni düğümün sonraki\'si de NULL kaldı.', st, vars);
      st.ptrs.liste_basi = 'nw'; st.nodes.nw.row = 0;
      r.f('*liste_basi=a;', '*liste_basi = a: liste başı artık yeni düğüm. main\'deki liste de değişti, çünkü adresiyle geldi.', st, vars);
      delete st.ptrs.a; st.hl = [];
      r.f('$', 'Bitti. Liste: ' + printList(st, 'nw') + '. İki satırın sırası ters olsaydı eski liste kaybolurdu.', st, {}, 2);
    }});

  def({id:'a-sona', week:3, title:'Listenin sonuna ekleme', view:'list', file:'h3-liste',
    desc:'x ile son düğüme kadar yürünür, yeni düğüm oraya bağlanır. Liste boşsa yeni düğüm liste başı olur.',
    inputs:[['liste', 'Liste', '30 50 70'], ['yeni', 'Eklenecek', '90']],
    code: 'void liste_sonuna_ekle(int icerik,struct dugum **liste_basi){\n    struct dugum* a=dugum_olustur(icerik);\n    if(*liste_basi==NULL){\n        a->sonraki=*liste_basi;\n        *liste_basi=a;\n    }\n    else {\n        struct dugum *x=*liste_basi;\n        while(x->sonraki!=NULL){\n            x=x->sonraki;\n        }\n        x->sonraki=a;\n    }\n}',
    run: function(p, r){
      var st = mkList(nums(p.liste)), key = nums(p.yeni)[0]; if(key == null) key = 90;
      st.ptrs.liste_basi = headOf(st);
      r.f('void liste_sonuna_ekle', 'liste_sonuna_ekle(' + key + ', &liste) çağrıldı.', st, {icerik:key});
      st.nodes.nw = {k:key, n:null, row:1}; st.order.push('nw'); st.ptrs.a = 'nw'; st.hl = ['nw'];
      r.f('struct dugum* a=dugum_olustur', 'dugum_olustur yeni düğümü heap\'te yarattı (anahtar ' + key + ', sonraki NULL). Ayrıntısı "başa ekleme" animasyonunda.', st, {icerik:key});
      if(st.ptrs.liste_basi == null){
        r.f('if(*liste_basi==NULL)', 'Liste boş mu? Evet.', st, {});
        r.f('a->sonraki=*liste_basi;', 'a->sonraki = NULL (liste boştu).', st, {});
        st.ptrs.liste_basi = 'nw'; st.nodes.nw.row = 0;
        r.f('*liste_basi=a;', 'Yeni düğüm liste başı oldu.', st, {});
      } else {
        r.f('if(*liste_basi==NULL)', 'Liste boş mu? Hayır, sona kadar yürüyeceğiz.', st, {});
        var x = st.ptrs.liste_basi; st.ptrs.x = x; st.hl = [x, 'nw'];
        r.f('struct dugum *x=*liste_basi;', 'x ilk düğümde (' + st.nodes[x].k + ').', st, {x: st.nodes[x].k});
        while(st.nodes[x].n != null){
          r.f('while(x->sonraki!=NULL)', 'x->sonraki NULL değil, bir ileri.', st, {x: st.nodes[x].k});
          x = st.nodes[x].n; st.ptrs.x = x; st.hl = [x, 'nw'];
          r.f('x=x->sonraki;', 'x artık ' + st.nodes[x].k + '.', st, {x: st.nodes[x].k});
        }
        r.f('while(x->sonraki!=NULL)', 'x->sonraki NULL: x son düğümde, döngü bitti.', st, {x: st.nodes[x].k});
        st.nodes[x].n = 'nw'; st.nodes.nw.row = 0;
        r.f('x->sonraki=a;', 'Son düğüm (' + st.nodes[x].k + ') artık yeni düğümü gösteriyor.', st, {x: st.nodes[x].k});
      }
      st.ptrs = {liste_basi: st.ptrs.liste_basi}; st.hl = [];
      r.f('$', 'Bitti. Liste: ' + printList(st, st.ptrs.liste_basi) + '. Sona yürümek gerektiği için O(n).', st, {}, 3);
    }});

  def({id:'a-sirali', week:3, title:'Sıralı listeye ekleme', view:'list', file:'h3-liste',
    desc:'b ile ilerlenir, a hep b\'nin bir öncesinde durur. Yeni düğüm a ile b\'nin arasına girer.',
    inputs:[['liste', 'Sıralı liste', '10 20 40 80'], ['yeni', 'Eklenecek', '30']],
    code: 'void liste_sirali_ekle(int anahtar, struct dugum **liste_basi){\n   struct dugum *a, *b, *eklenen;\n   b=*liste_basi;\n   while(b!=NULL && b->anahtar <= anahtar){\n       if(b->anahtar==anahtar) return;\n       a = b;\n       b= b->sonraki;\n   }\n   eklenen=dugum_olustur(anahtar);\n   if(b==*liste_basi){\n       eklenen->sonraki=*liste_basi;\n       *liste_basi=eklenen;\n   }\n   else {\n       a->sonraki=eklenen;\n       eklenen->sonraki=b;\n   }\n}',
    run: function(p, r){
      var keys = nums(p.liste).sort(function(x, y){ return x - y; }), st = mkList(keys), key = nums(p.yeni)[0]; if(key == null) key = 30;
      st.ptrs.liste_basi = headOf(st);
      r.f('void liste_sirali_ekle', 'liste_sirali_ekle(' + key + ') çağrıldı. Liste küçükten büyüğe sıralı.', st, {anahtar:key});
      var b = st.ptrs.liste_basi, a = null; st.ptrs.b = b; st.hl = b ? [b] : [];
      r.f('b=*liste_basi;', 'b ilk düğümden başlıyor.', st, {b: b ? st.nodes[b].k : 'NULL', a:'-'});
      while(b != null && st.nodes[b].k <= key){
        r.f('while(b!=NULL && b->anahtar <= anahtar)', st.nodes[b].k + ' <= ' + key + ', ilerlemeye devam.', st, {b: st.nodes[b].k, a: a ? st.nodes[a].k : '-'});
        if(st.nodes[b].k === key){ r.f('if(b->anahtar==anahtar) return;', key + ' zaten listede, ekleme yapılmadan çıkılıyor.', st, {}); return; }
        a = b; st.ptrs.a = a;
        r.f('a = b;', 'a, b\'nin yerine geldi.', st, {a: st.nodes[a].k, b: st.nodes[b].k});
        b = st.nodes[b].n; st.ptrs.b = b; st.hl = [a].concat(b ? [b] : []);
        r.f('b= b->sonraki;', 'b bir ileri: ' + (b ? st.nodes[b].k : 'NULL') + '.', st, {a: st.nodes[a].k, b: b ? st.nodes[b].k : 'NULL'});
      }
      r.f('while(b!=NULL && b->anahtar <= anahtar)', b ? st.nodes[b].k + ' > ' + key + ': yer bulundu, döngü bitti.' : 'b NULL: listenin sonuna gelindi.', st, {a: a ? st.nodes[a].k : '-', b: b ? st.nodes[b].k : 'NULL'});
      var at = a ? st.order.indexOf(a) + 1 : 0; st.order.splice(at, 0, 'nw'); st.nodes.nw = {k:key, n:null, row:1}; st.ptrs.eklenen = 'nw'; st.hl = ['nw'];
      r.f('eklenen=dugum_olustur(anahtar);', 'Yeni düğüm oluşturuldu (' + key + ').', st, {});
      if(b === st.ptrs.liste_basi){
        r.f('if(b==*liste_basi)', 'b hâlâ ilk düğüm: yeni düğüm en başa girecek.', st, {});
        st.nodes.nw.n = st.ptrs.liste_basi;
        r.f('eklenen->sonraki=*liste_basi;', 'Yeni düğüm eski ilk düğümü gösteriyor.', st, {});
        st.ptrs.liste_basi = 'nw'; st.nodes.nw.row = 0;
        r.f('*liste_basi=eklenen;', 'Liste başı yeni düğüm oldu.', st, {});
      } else {
        r.f('if(b==*liste_basi)', 'b ilk düğüm değil: a ile b arasına girecek.', st, {});
        st.nodes[a].n = 'nw';
        r.f('a->sonraki=eklenen;', st.nodes[a].k + ' artık yeni düğümü gösteriyor.', st, {});
        st.nodes.nw.n = b; st.nodes.nw.row = 0;
        r.f('eklenen->sonraki=b;', 'Yeni düğüm ' + (b ? st.nodes[b].k + '\'u' : 'NULL\'u') + ' gösteriyor.', st, {});
      }
      st.ptrs = {liste_basi: st.ptrs.liste_basi}; st.hl = [];
      r.f('$', 'Bitti. Liste: ' + printList(st, st.ptrs.liste_basi) + '.', st, {}, 3);
    }});

  def({id:'a-sil', week:3, title:'Listeden düğüm silme', view:'list', file:'h3-liste',
    desc:'temp aranan düğümü, once onun öncesini tutar. Bulunan düğüm zincirden çıkarılıp free edilir.',
    inputs:[['liste', 'Liste', '10 20 30 40'], ['sil', 'Silinecek', '30']],
    code: 'void liste_eleman_sil(int anahtar, struct dugum **liste_basi){\n    struct dugum *temp=*liste_basi;\n    struct dugum *once;\n    while(temp!=NULL && temp->anahtar!=anahtar){\n        once = temp;\n        temp=temp->sonraki;\n    }\n    if(temp==NULL) return;\n    else {\n        if(temp==*liste_basi) *liste_basi=(*liste_basi)->sonraki;\n        else once->sonraki=temp->sonraki;\n        free(temp);\n    }\n}',
    run: function(p, r){
      var st = mkList(nums(p.liste)), key = nums(p.sil)[0]; if(key == null) key = 30;
      st.ptrs.liste_basi = headOf(st);
      r.f('void liste_eleman_sil', 'liste_eleman_sil(' + key + ') çağrıldı.', st, {anahtar:key});
      var t = st.ptrs.liste_basi, o = null; st.ptrs.temp = t; st.hl = t ? [t] : [];
      r.f('struct dugum *temp=*liste_basi;', 'temp ilk düğümde.', st, {temp: t ? st.nodes[t].k : 'NULL'});
      while(t != null && st.nodes[t].k !== key){
        r.f('while(temp!=NULL && temp->anahtar!=anahtar)', st.nodes[t].k + ' aranan değil, ilerle.', st, {temp: st.nodes[t].k});
        o = t; st.ptrs.once = o;
        r.f('once = temp;', 'once temp\'in yerine geldi.', st, {once: st.nodes[o].k});
        t = st.nodes[t].n; st.ptrs.temp = t; st.hl = t ? [t] : [];
        r.f('temp=temp->sonraki;', 'temp bir ileri: ' + (t ? st.nodes[t].k : 'NULL') + '.', st, {temp: t ? st.nodes[t].k : 'NULL', once: st.nodes[o].k});
      }
      r.f('while(temp!=NULL && temp->anahtar!=anahtar)', t ? 'Bulundu: temp ' + key + '\'u gösteriyor.' : 'temp NULL: ' + key + ' listede yok.', st, {});
      if(t == null){ r.f('if(temp==NULL) return;', 'Silinecek düğüm yok, çıkılıyor.', st, {}); return; }
      r.f('if(temp==NULL) return;', 'temp NULL değil, silmeye geç.', st, {});
      if(t === st.ptrs.liste_basi){
        st.ptrs.liste_basi = st.nodes[t].n; st.nodes[t].row = 1;
        r.f('if(temp==*liste_basi)', 'Silinen ilk düğüm: liste başı bir ileri kaydı.', st, {});
      } else {
        st.nodes[o].n = st.nodes[t].n; st.nodes[t].row = 1;
        r.f('else once->sonraki=temp->sonraki;', st.nodes[o].k + ' artık silinenin sonrasını gösteriyor. ' + key + ' zincirden çıktı.', st, {});
      }
      st.nodes[t].freed = true;
      r.f('free(temp);', 'free(temp): düğümün belleği heap\'e geri verildi.', st, {});
      delete st.nodes[t]; st.order.splice(st.order.indexOf(t), 1); st.ptrs = {liste_basi: st.ptrs.liste_basi}; st.hl = [];
      r.f('$', 'Bitti. Liste: ' + (printList(st, st.ptrs.liste_basi) || 'boş') + '. Aramadan dolayı O(n).', st, {}, 2);
    }});

  def({id:'a-ters', week:3, title:'Listeyi ters çevirme', view:'list', file:'h3-liste',
    desc:'Düğümler yerinde kalır, sadece okların yönü çevrilir. a çevrilmiş kısmı, b sıradaki düğümü tutar.',
    inputs:[['liste', 'Liste', '10 20 30 40']],
    code: 'void liste_ters_cevir(struct dugum **liste_basi){\n    struct dugum *a,*b;\n    a=NULL;\n    while(*liste_basi!=NULL){\n        b=*liste_basi;\n        *liste_basi=(*liste_basi)->sonraki;\n        b->sonraki=a;\n        a=b;\n    }\n    *liste_basi=a;\n}',
    run: function(p, r){
      var st = mkList(nums(p.liste)); st.ptrs.liste_basi = headOf(st);
      var name = function(id){ return id ? st.nodes[id].k : 'NULL'; };
      r.f('void liste_ters_cevir', 'liste_ters_cevir(&liste) çağrıldı.', st, {});
      var a = null, b; st.ptrs.a = null;
      r.f('a=NULL;', 'a çevrilmiş kısmın başı. Başta çevrilmiş kısım boş.', st, {a:'NULL'});
      while(st.ptrs.liste_basi != null){
        r.f('while(*liste_basi!=NULL)', 'Çevrilecek düğüm var.', st, {a:name(a), liste_basi:name(st.ptrs.liste_basi)});
        b = st.ptrs.liste_basi; st.ptrs.b = b; st.hl = [b];
        r.f('b=*liste_basi;', 'b sıradaki düğüm: ' + name(b) + '.', st, {a:name(a), b:name(b)});
        st.ptrs.liste_basi = st.nodes[b].n;
        r.f('*liste_basi=(*liste_basi)->sonraki;', 'liste_basi bir ileri kaydı (' + name(st.ptrs.liste_basi) + '), böylece kalan liste kaybolmuyor.', st, {a:name(a), b:name(b)});
        st.nodes[b].n = a;
        r.f('b->sonraki=a;', name(b) + ' artık geriyi (' + name(a) + ') gösteriyor: ok ters döndü.', st, {a:name(a), b:name(b)});
        a = b; st.ptrs.a = a;
        r.f('a=b;', 'a çevrilmiş kısmın yeni başı: ' + name(a) + '.', st, {a:name(a), b:name(b)});
      }
      r.f('while(*liste_basi!=NULL)', 'liste_basi NULL: bütün düğümler çevrildi.', st, {a:name(a)});
      st.ptrs.liste_basi = a; delete st.ptrs.b; st.hl = [];
      r.f('*liste_basi=a;', 'Liste başı a oldu. Yeni liste: ' + printList(st, a) + '.', st, {});
    }});

  def({id:'a-sondaki', week:3, title:'Sondaki düğümü silme (vize sorusu)', view:'list', file:'h3-liste',
    desc:'2023 vizesindeki soru. Son düğüme kadar yürünür, önceki düğüm hatırlanır; boş ve tek düğümlü liste ayrı ele alınır.',
    inputs:[['liste', 'Liste', '10 20 30 40']],
    code: 'void en_sondaki_dugumu_sil(struct dugum **liste_basi){\n    struct dugum *a, *once = NULL;\n    if(*liste_basi == NULL) return;\n    a = *liste_basi;\n    while(a->sonraki != NULL){ once = a; a = a->sonraki; }\n    if(once == NULL) *liste_basi = NULL;\n    else once->sonraki = NULL;\n    free(a);\n}',
    run: function(p, r){
      var st = mkList(nums(p.liste)); st.ptrs.liste_basi = headOf(st);
      r.f('void en_sondaki_dugumu_sil', 'Fonksiyon çağrıldı.', st, {});
      if(st.ptrs.liste_basi == null){ r.f('if(*liste_basi == NULL) return;', 'Liste boş, yapacak bir şey yok.', st, {}); return; }
      r.f('if(*liste_basi == NULL) return;', 'Liste boş değil.', st, {});
      var a = st.ptrs.liste_basi, o = null; st.ptrs.a = a; st.hl = [a];
      r.f('a = *liste_basi;', 'a ilk düğümde.', st, {a: st.nodes[a].k, once:'NULL'});
      while(st.nodes[a].n != null){
        o = a; a = st.nodes[a].n; st.ptrs.once = o; st.ptrs.a = a; st.hl = [a];
        r.f('while(a->sonraki != NULL)', 'a bir ileri (' + st.nodes[a].k + '), once onun bir gerisinde (' + st.nodes[o].k + ').', st, {a: st.nodes[a].k, once: st.nodes[o].k});
      }
      if(o == null){ st.ptrs.liste_basi = null; st.nodes[a].row = 1; r.f('if(once == NULL) *liste_basi = NULL;', 'once NULL: tek düğüm vardı, liste boşaldı.', st, {}); }
      else { st.nodes[o].n = null; st.nodes[a].row = 1; r.f('else once->sonraki = NULL;', st.nodes[o].k + ' artık son düğüm (sonraki NULL).', st, {}); }
      st.nodes[a].freed = true;
      r.f('free(a);', 'Eski son düğüm free edildi.', st, {});
      delete st.nodes[a]; st.order.splice(st.order.indexOf(a), 1); st.ptrs = {liste_basi: st.ptrs.liste_basi}; st.hl = [];
      r.f('$', 'Bitti. Liste: ' + (printList(st, st.ptrs.liste_basi) || 'boş') + '.', st, {}, 2);
    }});

  def({id:'a-cift', week:3, title:'Çift yönlü listeye ekleme', view:'dlist', file:'h3-cift',
    desc:'Her düğümün ileri ve geri işaretçisi var. bas ve son bilindiği için başa da sona da O(1) eklenir.',
    inputs:[['liste', 'Liste', '40 60'], ['yeni', 'Eklenecek', '90'], ['yer', 'Nereye (basa / sona)', 'sona']],
    code: 'void liste_basina_ekle(int anahtar,struct ciftYonluListe *liste){\n    struct dugum *yeni;\n    yeni=dugumOlustur(anahtar);\n    if(liste->son==NULL) liste->son=yeni;\n    else{\n        liste->bas->geri=yeni;\n        yeni->ileri=liste->bas;\n    }\n    liste->bas=yeni;\n}\n\nvoid liste_sonuna_ekle(int anahtar,struct ciftYonluListe *liste){\n    struct dugum *yeni;\n    yeni=dugumOlustur(anahtar);\n    if(liste->bas==NULL) liste->bas=yeni;\n    else {\n        liste->son->ileri=yeni;\n        yeni->geri=liste->son;\n    }\n    liste->son=yeni;\n}',
    run: function(p, r){
      var keys = nums(p.liste), key = nums(p.yeni)[0], sona = !/bas/i.test(p.yer || ''), st = {nodes:{}, order:[], ptrs:{}, hl:[]};
      if(key == null) key = 90;
      keys.forEach(function(k, i){ st.nodes['n' + i] = {k:k, n: i < keys.length - 1 ? 'n' + (i + 1) : null, g: i > 0 ? 'n' + (i - 1) : null}; st.order.push('n' + i); });
      st.ptrs.bas = keys.length ? 'n0' : null; st.ptrs.son = keys.length ? 'n' + (keys.length - 1) : null;
      var fn = sona ? 'void liste_sonuna_ekle' : 'void liste_basina_ekle', nth = function(s){ return sona ? 2 : 1; };
      r.f(fn, (sona ? 'liste_sonuna_ekle(' : 'liste_basina_ekle(') + key + ', liste) çağrıldı. liste yapısı bas ve son\'u tutuyor.', st, {});
      st.nodes.nw = {k:key, n:null, g:null, row:1}; if(sona) st.order.push('nw'); else st.order.unshift('nw'); st.ptrs.yeni = 'nw'; st.hl = ['nw'];
      r.f('yeni=dugumOlustur(anahtar);', 'Yeni düğüm oluşturuldu; ileri ve geri NULL.', st, {}, nth());
      if(sona){
        if(st.ptrs.bas == null){ st.ptrs.bas = 'nw'; r.f('if(liste->bas==NULL) liste->bas=yeni;', 'Liste boştu: yeni düğüm aynı zamanda baş.', st, {}); }
        else {
          r.f('if(liste->bas==NULL) liste->bas=yeni;', 'Liste boş değil.', st, {});
          st.nodes[st.ptrs.son].n = 'nw'; r.f('liste->son->ileri=yeni;', 'Eski son (' + st.nodes[st.ptrs.son].k + ') ileri doğru yeni düğümü gösteriyor.', st, {});
          st.nodes.nw.g = st.ptrs.son; st.nodes.nw.row = 0; r.f('yeni->geri=liste->son;', 'Yeni düğüm geri doğru eski sonu gösteriyor.', st, {});
        }
        st.ptrs.son = 'nw'; st.nodes.nw.row = 0;
        r.f('liste->son=yeni;', 'son artık yeni düğüm. Yürümeye gerek olmadı: O(1).', st, {});
      } else {
        if(st.ptrs.son == null){ st.ptrs.son = 'nw'; r.f('if(liste->son==NULL) liste->son=yeni;', 'Liste boştu: yeni düğüm aynı zamanda son.', st, {}); }
        else {
          r.f('if(liste->son==NULL) liste->son=yeni;', 'Liste boş değil.', st, {});
          st.nodes[st.ptrs.bas].g = 'nw'; r.f('liste->bas->geri=yeni;', 'Eski baş (' + st.nodes[st.ptrs.bas].k + ') geri doğru yeni düğümü gösteriyor.', st, {});
          st.nodes.nw.n = st.ptrs.bas; st.nodes.nw.row = 0; r.f('yeni->ileri=liste->bas;', 'Yeni düğüm ileri doğru eski başı gösteriyor.', st, {});
        }
        st.ptrs.bas = 'nw'; st.nodes.nw.row = 0;
        r.f('liste->bas=yeni;', 'bas artık yeni düğüm.', st, {});
      }
      delete st.ptrs.yeni; st.hl = [];
      var out = [], c = st.ptrs.bas; while(c){ out.push(st.nodes[c].k); c = st.nodes[c].n; }
      r.f(null, 'Bitti. Baştan: ' + out.join(' ') + ', sondan: ' + out.slice().reverse().join(' ') + '.', st, {});
    }});

  def({id:'a-yigin', week:4, title:'Dizi ile yığın: push, pop, büyütme', view:'stack', file:'h4-statik',
    desc:'Elemanlar bir dizide, en üstteki indeks ust\'te. Dolunca realloc ile dizi iki katına çıkar.',
    inputs:[['islem', 'İşlemler (sayı = push, p = pop)', '10 40 5 -10 p'], ['kap', 'Başlangıç kapasitesi', '3']],
    code: 'int yigin_bosmu(struct yigin *y){\n    if(y->ust==-1) return 1;\n    else return 0;\n}\nint yigin_dolumu(struct yigin *y){\n    if(y->ust==y->kapasite-1) return 1;\n    else return 0;\n}\nvoid yigin_ekle(int eleman, struct yigin **y){\n    if(yigin_dolumu(*y)) {\n        kapasiteyi_artir_yeni(y,2);\n    }\n    (*y)->dizi[++(*y)->ust]=eleman;\n}\nint yigin_eleman_sil(struct yigin *y){\n    if(yigin_bosmu(y))return SENTINEL;\n    return y->dizi[y->ust--];\n}\nvoid kapasiteyi_artir_yeni(struct yigin **yigin, int kackat){\n    (*yigin)->dizi=(int*)realloc((*yigin)->dizi,kackat*(*yigin)->kapasite*sizeof(int));\n    (*yigin)->kapasite = 2*(*yigin)->kapasite;\n}',
    run: function(p, r){
      var cap = nums(p.kap)[0] || 3, st = {arr:[], cap:cap, ust:-1, hl:[]};
      var ops = String(p.islem).split(/[\s,]+/).filter(Boolean);
      r.f(null, 'Boş yığın: ust = -1, kapasite = ' + cap + '.', st, {ust:-1});
      ops.forEach(function(op){
        st.hl = [];
        if(/^p/i.test(op)){
          r.f('int yigin_eleman_sil', 'Pop: en üstteki çıkarılacak.', st, {ust:st.ust});
          if(st.ust === -1){ r.f('if(yigin_bosmu(y))return SENTINEL;', 'Yığın boş: SENTINEL döndü.', st, {}); return; }
          r.f('if(yigin_bosmu(y))return SENTINEL;', 'ust = ' + st.ust + ', yığın boş değil.', st, {ust:st.ust});
          var v = st.arr[st.ust]; st.hl = [st.ust]; st.ust--;
          r.f('return y->dizi[y->ust--];', 'dizi[' + (st.ust + 1) + '] = ' + v + ' döndü, sonra ust bir azaldı (' + st.ust + '). Değer dizide kalır ama artık yığının parçası değil.', st, {ust:st.ust, 'dönen':v});
          return;
        }
        var e = Number(op);
        r.f('void yigin_ekle', 'Push ' + e + '.', st, {eleman:e, ust:st.ust});
        r.f('if(y->ust==y->kapasite-1) return 1;', 'Dolu mu? ust (' + st.ust + ') == kapasite-1 (' + (st.cap - 1) + ') ' + (st.ust === st.cap - 1 ? 'evet.' : 'hayır.'), st, {ust:st.ust});
        if(st.ust === st.cap - 1){
          r.f('kapasiteyi_artir_yeni(y,2);', 'Yığın dolu: kapasite artırılacak.', st, {});
          st.cap *= 2;
          r.f('(*yigin)->dizi=(int*)realloc', 'realloc diziyi ' + st.cap + ' elemanlık yaptı; eski elemanlar korunuyor.', st, {kapasite:st.cap});
          r.f('(*yigin)->kapasite = 2*', 'kapasite = ' + st.cap + '.', st, {kapasite:st.cap});
        }
        st.ust++; st.arr[st.ust] = e; st.hl = [st.ust];
        r.f('(*y)->dizi[++(*y)->ust]=eleman;', '++ust: önce ust ' + st.ust + ' oldu, sonra dizi[' + st.ust + '] = ' + e + '.', st, {ust:st.ust});
      });
      st.hl = [];
      var top = []; for(var i = st.ust; i >= 0; i--) top.push(st.arr[i]);
      r.f(null, 'Bitti. Üstten alta: ' + (top.join(' ') || 'boş') + ' · kapasite ' + st.cap + '.', st, {});
    }});

  def({id:'a-yigin2', week:4, title:'Bağlı liste ile yığın', view:'list', file:'h4-dinamik',
    desc:'Push başa ekleme, pop baştan silmedir. yigin işaretçisi en üstteki düğümü gösterir.',
    inputs:[['islem', 'İşlemler (sayı = push, p = pop)', '100 20 60 p']],
    code: 'void ekle(int anahtar, struct dugum **yigin){\n    struct dugum *d=dugum_olustur(anahtar);\n    d->sonraki = *yigin;\n    *yigin=d;\n}\nint sil(struct dugum **yigin){\n    struct dugum *d;\n    int anahtar;\n    if(*yigin == NULL) return SENTINEL;\n    d=*yigin;\n    *yigin=(*yigin)->sonraki;\n    anahtar=d->anahtar;\n    free(d);\n    return anahtar;\n}',
    run: function(p, r){
      var st = {nodes:{}, order:[], ptrs:{yigin:null}, hl:[]}, n = 0;
      var ops = String(p.islem).split(/[\s,]+/).filter(Boolean);
      r.f(null, 'Boş yığın: yigin = NULL.', st, {});
      ops.forEach(function(op){
        if(/^p/i.test(op)){
          r.f('int sil(struct dugum **yigin)', 'Pop.', st, {});
          if(st.ptrs.yigin == null){ r.f('if(*yigin == NULL) return SENTINEL;', 'Yığın boş: SENTINEL.', st, {}); return; }
          var d = st.ptrs.yigin; st.ptrs.d = d; st.hl = [d];
          r.f('d=*yigin;', 'd en üstteki düğüm (' + st.nodes[d].k + ').', st, {});
          st.ptrs.yigin = st.nodes[d].n; st.nodes[d].row = 1;
          r.f('*yigin=(*yigin)->sonraki;', 'yigin bir alttakine kaydı.', st, {});
          var k = st.nodes[d].k;
          r.f('anahtar=d->anahtar;', 'Anahtar (' + k + ') saklandı.', st, {anahtar:k});
          st.nodes[d].freed = true;
          r.f('free(d);', 'Düğüm free edildi.', st, {anahtar:k});
          delete st.nodes[d]; st.order.splice(st.order.indexOf(d), 1); delete st.ptrs.d; st.hl = [];
          r.f('return anahtar;', k + ' döndü.', st, {'dönen':k});
          return;
        }
        var e = Number(op), id = 'n' + (n++);
        r.f('void ekle(int anahtar', 'Push ' + e + '.', st, {});
        st.nodes[id] = {k:e, n:null, row:1}; st.order.unshift(id); st.ptrs.d = id; st.hl = [id];
        r.f('struct dugum *d=dugum_olustur(anahtar);', 'Yeni düğüm (' + e + ').', st, {});
        st.nodes[id].n = st.ptrs.yigin;
        r.f('d->sonraki = *yigin;', 'Yeni düğüm eski üstü gösteriyor.', st, {});
        st.ptrs.yigin = id; st.nodes[id].row = 0;
        r.f('*yigin=d;', 'yigin artık yeni düğüm: en üstte ' + e + '.', st, {});
        delete st.ptrs.d; st.hl = [];
      });
      r.f(null, 'Bitti. Üstten alta: ' + (printList(st, st.ptrs.yigin) || 'boş') + '.', st, {});
    }});

  // ağaç yardımcıları
  function mkTree(keys){
    var st = {nodes:{}, root:null, ptrs:{}, hl:[], vis:[], path:[]}, n = 0;
    keys.forEach(function(k){
      if(st.root == null){ st.root = 't' + n; st.nodes['t' + n++] = {k:k, l:null, r:null}; return; }
      var d = st.root;
      for(;;){ var nd = st.nodes[d]; if(k < nd.k){ if(nd.l == null){ nd.l = 't' + n; break; } d = nd.l; } else if(k > nd.k){ if(nd.r == null){ nd.r = 't' + n; break; } d = nd.r; } else return; }
      st.nodes['t' + n++] = {k:k, l:null, r:null};
    });
    st._n = n; return st;
  }
  var K = function(st, id){ return id == null ? 'NULL' : st.nodes[id].k; };

  def({id:'a-bst-ekle', week:5, title:'BST\'ye ekleme', view:'tree', file:'h5-bst',
    desc:'Kökten başlanır; küçükse sola, büyükse sağa inilir. Yeni düğüm her zaman yaprak olur. geri, d\'nin ebeveynini tutar.',
    inputs:[['agac', 'Ağaç (ekleme sırası)', '50 25 100 80 30'], ['yeni', 'Eklenecek', '39']],
    code: 'void ekle(struct agac_dugum **kok,int anahtar){\n    struct agac_dugum *dugum;\n    struct agac_dugum *d;\n    struct agac_dugum *geri;\n    d=*kok;\n    while(d!=NULL){\n        geri=d;\n        if(anahtar < d->anahtar) d=d->sol;\n        else if(anahtar > d->anahtar) d= d->sag;\n        else return;\n    }\n    dugum=dugum_olustur(anahtar);\n    if(*kok==NULL){\n        *kok = dugum;\n        return;\n    }\n    if(anahtar < geri->anahtar) geri->sol = dugum;\n    else geri->sag = dugum;\n}',
    run: function(p, r){
      var st = mkTree(nums(p.agac)), key = nums(p.yeni)[0]; if(key == null) key = 39;
      st.ptrs.kok = st.root;
      r.f('void ekle', 'ekle(&kok, ' + key + ') çağrıldı.', st, {anahtar:key});
      var d = st.root, g = null; st.ptrs.d = d; st.hl = d ? [d] : [];
      r.f('d=*kok;', 'd kökten başlıyor.', st, {d:K(st, d)});
      while(d != null){
        r.f('while(d!=NULL)', 'd NULL değil, karşılaştır.', st, {d:K(st, d), geri:K(st, g)});
        g = d; st.ptrs.geri = g; st.path.push(g);
        r.f('geri=d;', 'geri = d (' + K(st, g) + '): ebeveyni hatırlıyoruz.', st, {d:K(st, d), geri:K(st, g)});
        var nd = st.nodes[d];
        if(key < nd.k){ d = nd.l; r.f('if(anahtar < d->anahtar) d=d->sol;', key + ' < ' + nd.k + ': sola in. d = ' + K(st, d) + '.', Object.assign(st, {ptrs: Object.assign({}, st.ptrs, {d:d}), hl: d ? [d] : [g]}), {d:K(st, d), geri:K(st, g)}); }
        else if(key > nd.k){ d = nd.r; st.ptrs.d = d; st.hl = d ? [d] : [g]; r.f('else if(anahtar > d->anahtar) d= d->sag;', key + ' > ' + nd.k + ': sağa in. d = ' + K(st, d) + '.', st, {d:K(st, d), geri:K(st, g)}); }
        else { r.f('else return;', key + ' zaten ağaçta: eklenmeden çıkılıyor.', st, {}); return; }
        st.ptrs.d = d;
      }
      r.f('while(d!=NULL)', 'd NULL oldu: boş yer bulundu, ebeveyni geri (' + K(st, g) + ').', st, {d:'NULL', geri:K(st, g)});
      var id = 't' + st._n; st.nodes[id] = {k:key, l:null, r:null}; st.ptrs.dugum = id; delete st.ptrs.d; st.hl = [id];
      r.f('dugum=dugum_olustur(anahtar);', 'Yeni düğüm oluşturuldu (henüz bağlı değil).', st, {});
      if(st.root == null){ st.root = id; st.ptrs.kok = id; r.f('*kok = dugum;', 'Ağaç boştu: yeni düğüm kök oldu.', st, {}); return; }
      r.f('if(*kok==NULL){', 'Ağaç boş değil.', st, {});
      if(key < st.nodes[g].k){ st.nodes[g].l = id; r.f('if(anahtar < geri->anahtar) geri->sol = dugum;', key + ' < ' + st.nodes[g].k + ': geri\'nin soluna bağlandı.', st, {}); }
      else { st.nodes[g].r = id; r.f('else geri->sag = dugum;', key + ' > ' + st.nodes[g].k + ': geri\'nin sağına bağlandı.', st, {}); }
      st.ptrs = {kok: st.root}; st.hl = [id]; st.path = [];
      r.f(null, 'Bitti. ' + key + ' yaprak olarak eklendi. Adım sayısı ağacın yüksekliği kadar: O(h).', st, {});
    }});

  def({id:'a-bst-sil', week:5, title:'BST\'den silme', view:'tree', file:'h5-bst',
    desc:'Silinecek düğüm bulunur. Solu ya da sağı boşsa diğer çocuğu yerine geçer; iki çocuğu varsa sol alt ağacın en sağındaki düğüm yerine geçer.',
    inputs:[['agac', 'Ağaç (ekleme sırası)', '50 25 100 15 40 80 130 35 45'], ['sil', 'Silinecek', '50']],
    code: 'void sil(struct agac_dugum **kok, int silinen){\n    struct agac_dugum *d=*kok;\n    struct agac_dugum *parent=NULL;\n    struct agac_dugum *d1,*d2;\n    int sol;\n    while(d!=NULL){\n        if(silinen < d->anahtar){\n            parent=d; d=d->sol; sol=1;\n        }\n        else if(silinen > d->anahtar){\n            parent=d; d=d->sag; sol = 0;\n        }\n        else break;\n    }\n    if(d==NULL) return;\n    if(d->sol==NULL){ // silinen dugumun solu bos\n        if(parent==NULL) *kok=d->sag;\n        else{\n            if(sol==1) parent->sol=d->sag;\n            else parent->sag=d->sag;\n        }\n    }\n    else if(d->sag==NULL){  // silinen dugumun sagi bos\n        if(parent==NULL) *kok=d->sol;\n        else {\n            if(sol==1) parent->sol=d->sol;\n            else parent->sag = d->sol;\n        }\n    }\n    else { // hem sagi hem solu dolu: solun en sagi\n        d1=d->sol;\n        d2=NULL;\n        while(d1->sag!=NULL){\n            d2=d1;\n            d1=d1->sag;\n        }\n        if(d2!=NULL){\n            d2->sag= d1->sol;\n            d1->sol=d->sol;\n        }\n        d1->sag = d->sag;\n        if(parent==NULL) *kok=d1; // agacin koku degisti\n        else {\n            if(sol==1) parent->sol=d1;\n            else parent->sag=d1;\n        }\n    }\n    free(d);\n}',
    run: function(p, r){
      var st = mkTree(nums(p.agac)), key = nums(p.sil)[0]; if(key == null) key = 50;
      st.ptrs.kok = st.root;
      var d = st.root, par = null, sol;
      st.ptrs.d = d; st.hl = d ? [d] : [];
      r.f('struct agac_dugum *d=*kok;', 'sil(&kok, ' + key + '). d kökte, parent NULL.', st, {d:K(st, d), parent:'NULL'});
      while(d != null){
        var nd = st.nodes[d];
        if(key < nd.k){ par = d; d = nd.l; sol = 1; st.ptrs.parent = par; st.ptrs.d = d; st.hl = d ? [d] : []; r.f('parent=d; d=d->sol; sol=1;', key + ' < ' + nd.k + ': sola. sol = 1.', st, {d:K(st, d), parent:K(st, par), sol:1}); }
        else if(key > nd.k){ par = d; d = nd.r; sol = 0; st.ptrs.parent = par; st.ptrs.d = d; st.hl = d ? [d] : []; r.f('parent=d; d=d->sag; sol = 0;', key + ' > ' + nd.k + ': sağa. sol = 0.', st, {d:K(st, d), parent:K(st, par), sol:0}); }
        else { r.f('else break;', 'Bulundu: d = ' + nd.k + '.', st, {d:nd.k, parent:K(st, par)}); break; }
      }
      if(d == null){ r.f('if(d==NULL) return;', key + ' ağaçta yok.', st, {}); return; }
      var nd2 = st.nodes[d], link = function(x){ if(par == null){ st.root = x; st.ptrs.kok = x; } else if(sol === 1) st.nodes[par].l = x; else st.nodes[par].r = x; };
      if(nd2.l == null){
        r.f('if(d->sol==NULL)', 'd\'nin solu boş: sağ çocuğu (' + K(st, nd2.r) + ') yerine geçecek.', st, {});
        link(nd2.r);
        r.f(par == null ? 'if(parent==NULL) *kok=d->sag;' : (sol === 1 ? 'if(sol==1) parent->sol=d->sag;' : 'else parent->sag=d->sag;'), par == null ? 'Silinen kökmüş: kök sağ çocuk oldu.' : 'parent (' + K(st, par) + ') artık d\'nin sağ çocuğunu gösteriyor.', st, {});
      } else if(nd2.r == null){
        r.f('else if(d->sag==NULL)', 'd\'nin sağı boş: sol çocuğu (' + K(st, nd2.l) + ') yerine geçecek.', st, {});
        link(nd2.l);
        r.f(par == null ? 'if(parent==NULL) *kok=d->sol;' : (sol === 1 ? 'if(sol==1) parent->sol=d->sol;' : 'else parent->sag = d->sol;'), par == null ? 'Kök sol çocuk oldu.' : 'parent (' + K(st, par) + ') artık d\'nin sol çocuğunu gösteriyor.', st, {});
      } else {
        r.f('else { // hem sagi hem solu dolu', 'İki çocuğu var. Sol alt ağacın en sağını (en büyüğünü) bulacağız.', st, {});
        var d1 = nd2.l, d2 = null; st.ptrs.d1 = d1; st.hl = [d, d1];
        r.f('d1=d->sol;', 'd1 sol çocukta (' + K(st, d1) + '), d2 NULL.', st, {d1:K(st, d1), d2:'NULL'});
        while(st.nodes[d1].r != null){ d2 = d1; d1 = st.nodes[d1].r; st.ptrs.d1 = d1; st.ptrs.d2 = d2; st.hl = [d, d1]; r.f('d1=d1->sag;', 'Sağa devam: d1 = ' + K(st, d1) + ', d2 = ' + K(st, d2) + '.', st, {d1:K(st, d1), d2:K(st, d2)}); }
        r.f('while(d1->sag!=NULL)', 'd1\'in sağı boş: ' + K(st, d1) + ' sol alt ağacın en büyüğü.', st, {d1:K(st, d1), d2:K(st, d2)});
        if(d2 != null){
          st.nodes[d2].r = st.nodes[d1].l; r.f('d2->sag= d1->sol;', 'd2 (' + K(st, d2) + ') d1\'in sol çocuğunu (' + K(st, st.nodes[d1].l) + ') devralıyor.', st, {});
          st.nodes[d1].l = nd2.l; r.f('d1->sol=d->sol;', 'd1 silinenin sol alt ağacını alıyor.', st, {});
        }
        st.nodes[d1].r = nd2.r; r.f('d1->sag = d->sag;', 'd1 silinenin sağ alt ağacını alıyor.', st, {});
        link(d1);
        r.f(par == null ? 'if(parent==NULL) *kok=d1;' : (sol === 1 ? 'if(sol==1) parent->sol=d1;' : 'else parent->sag=d1;'), par == null ? 'Silinen kökmüş: yeni kök ' + K(st, d1) + '.' : 'parent artık d1\'i gösteriyor.', st, {});
      }
      st.gone = [d]; st.hl = [];
      r.f('free(d);', key + ' free edildi.', st, {});
      delete st.nodes[d]; st.ptrs = {kok: st.root}; st.gone = [];
      var inord = []; (function w(id){ if(id == null) return; w(st.nodes[id].l); inord.push(st.nodes[id].k); w(st.nodes[id].r); })(st.root);
      r.f(null, 'Bitti. Inorder hâlâ sıralı: ' + inord.join(' ') + '.', st, {});
    }});

  def({id:'a-dolasim', week:5, title:'Preorder, inorder, postorder', view:'tree', file:'h5-bst',
    desc:'Aynı özyinelemeli fonksiyon; tek fark printf\'in yeri. Çağrı yığını ve çıktı adım adım görünür.',
    inputs:[['agac', 'Ağaç (ekleme sırası)', '50 25 100 15 30 80'], ['tur', 'Dolaşım (pre / in / post)', 'in']],
    code: 'void preorder_yardimci(struct agac_dugum *kok){\n    if(kok==NULL) return;\n    printf("%4d ",kok->anahtar);\n    preorder_yardimci(kok->sol);\n    preorder_yardimci(kok->sag);\n}\n\nvoid inorder_yardimci(struct agac_dugum *kok){\n    if(kok==NULL) return;\n    inorder_yardimci(kok->sol);\n    printf("%4d ",kok->anahtar);\n    inorder_yardimci(kok->sag);\n}\n\nvoid postorder_yardimci(struct agac_dugum *kok){\n    if(kok==NULL) return;\n    postorder_yardimci(kok->sol);\n    postorder_yardimci(kok->sag);\n    printf("%4d ",kok->anahtar);\n}',
    run: function(p, r){
      var st = mkTree(nums(p.agac)), t = /pre/i.test(p.tur) ? 'pre' : /post/i.test(p.tur) ? 'post' : 'in';
      var fn = t + 'order_yardimci', nth = {pre:1, in:2, post:3}[t], out = [], stack = [];
      st.ptrs.kok = st.root;
      var V = function(){ return {'çağrı yığını': stack.map(function(id){ return fn.split('_')[0] + '(' + st.nodes[id].k + ')'; }).join(' → ') || '-', 'çıktı': out.join(' ') || '-'}; };
      var lines = {pre: ['printf("%4d ",kok->anahtar);', 'preorder_yardimci(kok->sol);', 'preorder_yardimci(kok->sag);'], in: ['inorder_yardimci(kok->sol);', 'printf("%4d ",kok->anahtar);', 'inorder_yardimci(kok->sag);'], post: ['postorder_yardimci(kok->sol);', 'postorder_yardimci(kok->sag);', 'printf("%4d ",kok->anahtar);']}[t];
      var nthOf = function(s){ return s.indexOf('printf') === 0 ? nth : 1; };
      (function visit(id){
        if(id == null) return;
        stack.push(id); st.ptrs = {kok: st.root}; st.ptrs['kok (çağrı)'] = id; st.hl = [id];
        r.f('void ' + fn, fn.split('_')[0] + '(' + st.nodes[id].k + ') çağrıldı.', st, V());
        lines.forEach(function(L){
          if(L.indexOf('printf') === 0){ out.push(st.nodes[id].k); st.vis.push(id); st.hl = [id]; st.ptrs = {kok: st.root}; st.ptrs['kok (çağrı)'] = id; r.f(L, st.nodes[id].k + ' yazıldı.', st, V(), nth); }
          else { var c = L.indexOf('sol') > 0 ? st.nodes[id].l : st.nodes[id].r, side = L.indexOf('sol') > 0 ? 'sol' : 'sağ';
            st.hl = [id]; st.ptrs = {kok: st.root}; st.ptrs['kok (çağrı)'] = id;
            r.f(L, c == null ? side + ' çocuk NULL: çağrı hemen geri döner.' : side + ' alt ağaca iniliyor (' + st.nodes[c].k + ').', st, V(), 1);
            visit(c); }
        });
        stack.pop();
      })(st.root);
      st.hl = []; st.ptrs = {kok: st.root};
      r.f(null, t + 'order çıktısı: ' + out.join(' ') + (t === 'in' ? ' (BST\'de her zaman sıralı).' : '.'), st, {'çıktı': out.join(' ')});
    }});

  def({id:'a-iter', week:5, title:'Yığınla iteratif inorder', view:'tree', file:'h5-iter',
    desc:'Özyineleme yerine elle yığın. NULL olmayan düğüm yığına atılıp sola inilir; NULL\'a gelince yığından çıkarılıp yazılır ve sağa geçilir.',
    inputs:[['agac', 'Ağaç (ekleme sırası)', '50 25 100 15 30']],
    code: 'void iterative_inOrder(struct agac_dugum *root){\n  struct agac_dugum *current = root;\n  struct yigin_dugum *s = NULL;\n  int done = 0;\n  while (!done){\n    if(current !=  NULL){\n      yigin_ekle(current,&s);\n      current = current->sol;\n    }\n    else{\n      if (!yigin_bosmu(s)){\n        current = yigin_cikar(&s);\n        printf("%d ", current->anahtar);\n        current = current->sag;\n      }\n      else\n        done = 1;\n    }\n  }\n}',
    run: function(p, r){
      var st = mkTree(nums(p.agac)), s = [], out = [], cur = st.root;
      var V = function(){ return {current:K(st, cur), 'yığın (alt→üst)': s.map(function(id){ return st.nodes[id].k; }).join(' ') || 'boş', 'çıktı': out.join(' ') || '-'}; };
      st.ptrs = {kok: st.root, current: cur}; st.hl = cur ? [cur] : [];
      r.f('struct agac_dugum *current = root;', 'current kökte, yığın boş.', st, V());
      for(var guard = 0; guard < 200; guard++){
        if(cur != null){
          s.push(cur); st.hl = [cur];
          r.f('yigin_ekle(current,&s);', st.nodes[cur].k + ' yığına atıldı (sonra yazılmak üzere).', st, V());
          cur = st.nodes[cur].l; st.ptrs.current = cur; st.hl = cur ? [cur] : [];
          r.f('current = current->sol;', 'Sola inildi: current = ' + K(st, cur) + '.', st, V());
        } else if(s.length){
          cur = s.pop(); st.ptrs.current = cur; st.hl = [cur];
          r.f('current = yigin_cikar(&s);', 'current NULL: yığından ' + st.nodes[cur].k + ' çıkarıldı.', st, V());
          out.push(st.nodes[cur].k); st.vis.push(cur);
          r.f('printf("%d ", current->anahtar);', st.nodes[cur].k + ' yazıldı.', st, V());
          cur = st.nodes[cur].r; st.ptrs.current = cur; st.hl = cur ? [cur] : [];
          r.f('current = current->sag;', 'Sağ alt ağaca geçildi: current = ' + K(st, cur) + '.', st, V());
        } else { r.f('done = 1;', 'current NULL ve yığın boş: bitti.', st, V()); break; }
      }
      st.hl = [];
      r.f(null, 'Çıktı: ' + out.join(' ') + '.', st, {'çıktı': out.join(' ')});
    }});

  def({id:'a-bst-max', week:5, title:'BST\'de en büyüğü silme (vize sorusu)', view:'tree', file:'h5-main',
    desc:'2023 vizesindeki soru. En büyük anahtar en sağdaki düğümdür; sağ çocuğu olamaz, bu yüzden sol çocuğu ebeveynine bağlanır.',
    inputs:[['agac', 'Ağaç (ekleme sırası)', '50 25 100 80 130 120 110']],
    code: 'void en_sondaki_dugumu_sil(struct agac_dugum **kok){\n    struct agac_dugum *a,*b;\n    if(*kok==NULL) return;\n    a=*kok;\n    while(a->sag!=NULL){\n        b=a;\n        a=a->sag;\n    }\n    if(a==*kok) *kok= (*kok)->sol;\n    else b->sag=a->sol;\n    free(a);\n}',
    run: function(p, r){
      var st = mkTree(nums(p.agac)); st.ptrs.kok = st.root;
      r.f('void en_sondaki_dugumu_sil', 'en_sondaki_dugumu_sil(&kok) çağrıldı. Silinecek: en büyük anahtar.', st, {});
      if(st.root == null){ r.f('if(*kok==NULL) return;', 'Ağaç boş.', st, {}); return; }
      r.f('if(*kok==NULL) return;', 'Ağaç boş değil.', st, {});
      var a = st.root, b = null; st.ptrs.a = a; st.hl = [a];
      r.f('a=*kok;', 'a kökte (' + K(st, a) + ').', st, {a:K(st, a), b:'-'});
      while(st.nodes[a].r != null){
        r.f('while(a->sag!=NULL)', K(st, a) + '\'in sağı var, sağa devam.', st, {a:K(st, a), b:K(st, b)});
        b = a; st.ptrs.b = b; st.path.push(b);
        r.f('b=a;', 'b ebeveyni tutuyor: ' + K(st, b) + '.', st, {a:K(st, a), b:K(st, b)});
        a = st.nodes[a].r; st.ptrs.a = a; st.hl = [a];
        r.f('a=a->sag;', 'a = ' + K(st, a) + '.', st, {a:K(st, a), b:K(st, b)});
      }
      r.f('while(a->sag!=NULL)', K(st, a) + '\'in sağı yok: en büyük bu.', st, {a:K(st, a), b:K(st, b)});
      if(a === st.root){ st.root = st.nodes[a].l; st.ptrs.kok = st.root; r.f('if(a==*kok) *kok= (*kok)->sol;', 'En büyük kökmüş: kök sol çocuğa geçti.', st, {}); }
      else {
        r.f('if(a==*kok) *kok= (*kok)->sol;', 'a kök değil.', st, {});
        st.nodes[b].r = st.nodes[a].l;
        r.f('else b->sag=a->sol;', 'b (' + K(st, b) + ') artık a\'nın sol çocuğunu (' + K(st, st.nodes[a].l) + ') gösteriyor.', st, {});
      }
      st.gone = [a]; st.hl = [];
      r.f('free(a);', K(st, a) + ' free edildi.', st, {});
      delete st.nodes[a]; st.ptrs = {kok: st.root}; st.gone = []; st.path = [];
      r.f(null, 'Bitti. Ağacın yüksekliği kadar adım: O(h).', st, {});
    }});

  def({id:'a-invert', week:5, title:'Ağacı aynalama (invert)', view:'tree', file:'h5-main',
    desc:'Her düğümde sol ve sağ çocuk yer değiştirir, sonra aynı iş alt ağaçlara yapılır. Finalde "donustur" adıyla soruldu.',
    inputs:[['agac', 'Ağaç (ekleme sırası)', '50 25 100 15 30 80']],
    code: 'void invert(struct agac_dugum *kok){\n    struct agac_dugum *temp;\n    if(kok==NULL) return;\n    temp=kok->sol;\n    kok->sol=kok->sag;\n    kok->sag=temp;\n    invert(kok->sol);\n    invert(kok->sag);\n}',
    run: function(p, r){
      var st = mkTree(nums(p.agac)), stack = [];
      var V = function(){ return {'çağrı yığını': stack.map(function(id){ return 'invert(' + st.nodes[id].k + ')'; }).join(' → ') || '-'}; };
      (function inv(id){
        if(id == null) return;
        stack.push(id); st.ptrs = {kok: st.root, 'kok (çağrı)': id}; st.hl = [id];
        r.f('void invert', 'invert(' + st.nodes[id].k + ') çağrıldı.', st, V());
        var nd = st.nodes[id], t = nd.l;
        r.f('temp=kok->sol;', 'temp sol çocuğu tutuyor (' + K(st, t) + ').', st, V());
        nd.l = nd.r;
        r.f('kok->sol=kok->sag;', 'Sol artık eski sağ (' + K(st, nd.l) + ').', st, V());
        nd.r = t; st.vis.push(id);
        r.f('kok->sag=temp;', 'Sağ artık eski sol (' + K(st, nd.r) + '). Bu düğüm aynalandı.', st, V());
        st.ptrs = {kok: st.root, 'kok (çağrı)': id}; st.hl = [id];
        r.f('invert(kok->sol);', nd.l == null ? 'Sol NULL, çağrı hemen döner.' : 'Sol alt ağaç aynalanacak.', st, V());
        inv(nd.l);
        st.ptrs = {kok: st.root, 'kok (çağrı)': id}; st.hl = [id];
        r.f('invert(kok->sag);', nd.r == null ? 'Sağ NULL, çağrı hemen döner.' : 'Sağ alt ağaç aynalanacak.', st, V());
        inv(nd.r);
        stack.pop();
      })(st.root);
      st.hl = []; st.ptrs = {kok: st.root};
      var inord = []; (function w(id){ if(id == null) return; w(st.nodes[id].l); inord.push(st.nodes[id].k); w(st.nodes[id].r); })(st.root);
      r.f(null, 'Bitti. Inorder artık büyükten küçüğe: ' + inord.join(' ') + '.', st, {});
    }});

  // heap
  function bubbleDownFrames(r, st, i, label){
    for(;;){
      var l = 2 * i + 1, rr = l + 1;
      if(l >= st.n){ st.hl = [i]; r.f('while(sol<heap->eleman_sayisi)', i + ' numaralı düğümün çocuğu yok: buble_down bitti.', st, {index:i}); return; }
      var b = l; if(rr < st.n && st.a[rr] > st.a[l]) b = rr;
      st.hl = [i, b];
      r.f('if(sag < heap->eleman_sayisi', 'Çocuklar: ' + st.a[l] + (rr < st.n ? ' ve ' + st.a[rr] : '') + '. Büyük olan ' + st.a[b] + ' (indeks ' + b + ').', st, {index:i, sol:l, sag:rr});
      if(st.a[b] < st.a[i]){ r.f('if(large_key < heap->dizi[index].key) break;', st.a[b] + ' < ' + st.a[i] + ': heap özelliği sağlandı, dur.', st, {index:i}); return; }
      var t = st.a[i]; st.a[i] = st.a[b]; st.a[b] = t; st.sw = [i, b];
      r.f(b === l ? 'heap->dizi[index] = heap->dizi[sol];' : 'heap->dizi[index] = heap->dizi[sag];', st.a[b] + ' ile ' + st.a[i] + ' yer değiştirdi.', st, {index:i});
      st.sw = []; i = b;
      r.f(b === l ? 'index=2*index + 1;' : 'index=2*index + 2;', 'index bir alt seviyeye indi: ' + i + '.', st, {index:i});
    }
  }
  var C_DOWN = 'void buble_down(struct heap *heap, int index){\n    int sol,sag;\n    int large_key;\n    int sol_buyuk;\n    struct dugum temp_dugum;\n    sol=2*index+1;\n    sag=2*index+2;\n    while(sol<heap->eleman_sayisi) {\n        sol_buyuk = 1;\n        large_key=heap->dizi[sol].key;\n        temp_dugum = heap->dizi[index];\n        if(sag < heap->eleman_sayisi &&\n                heap->dizi[sag].key >heap->dizi[sol].key) {\n            sol_buyuk=0;\n            large_key=heap->dizi[sag].key;\n        }\n        if(large_key < heap->dizi[index].key) break;\n        if(sol_buyuk){\n            heap->dizi[index] = heap->dizi[sol];\n            heap->dizi[sol] = temp_dugum;\n            index=2*index + 1;\n        }\n        else {\n            heap->dizi[index] = heap->dizi[sag];\n            heap->dizi[sag] = temp_dugum;\n            index=2*index + 2;\n        }\n        sol=2*index+1;\n        sag=2*index+2;\n    }\n}';

  def({id:'a-heap-ekle', week:6, title:'Heap\'e ekleme (buble_up)', view:'heap', file:'h6-heap',
    desc:'Yeni anahtar dizinin sonuna konur, ebeveyninden büyük oldukça yukarı çıkar. Ebeveyn (i-1)/2.',
    inputs:[['heap', 'Max heap (dizi)', '98 78 92 52 56 44 84 15 34 48'], ['yeni', 'Eklenecek', '88']],
    code: 'void buble_up(struct heap *heap,int index){\n    int parent_index;\n    struct dugum temp_dugum;\n    parent_index= (index-1)/2;\n    while(parent_index>=0 && heap->dizi[parent_index].key <heap->dizi[index].key){\n        temp_dugum= heap->dizi[parent_index];\n        heap->dizi[parent_index]= heap->dizi[index];\n        heap->dizi[index] = temp_dugum;\n        index = parent_index;\n        parent_index =(index-1)/2;\n    }\n}\n\nvoid heap_insert(struct heap *heap, int key){\n    if(heap_search(heap,key)) return;\n    if(heap->eleman_sayisi<heap->kapasite){\n        heap->eleman_sayisi++;\n        heap->dizi[heap->eleman_sayisi-1].key=key;\n        buble_up(heap,heap->eleman_sayisi-1);\n    }\n}',
    run: function(p, r){
      var a = nums(p.heap), key = nums(p.yeni)[0]; if(key == null) key = 88;
      var st = {a:a.slice(), n:a.length, hl:[], sw:[]};
      r.f('void heap_insert', 'heap_insert(' + key + ').', st, {});
      if(a.indexOf(key) >= 0){ r.f('if(heap_search(heap,key)) return;', key + ' zaten var, eklenmedi.', st, {}); return; }
      r.f('if(heap_search(heap,key)) return;', key + ' heap\'te yok (arama O(n)).', st, {});
      st.a.push(key); st.n++; st.hl = [st.n - 1];
      r.f('heap->dizi[heap->eleman_sayisi-1].key=key;', key + ' dizinin sonuna (indeks ' + (st.n - 1) + ') kondu. Heap özelliği bozulmuş olabilir.', st, {eleman_sayisi:st.n});
      var i = st.n - 1, par = Math.trunc((i - 1) / 2);
      r.f('parent_index= (index-1)/2;', 'Ebeveyn indeksi (' + i + '-1)/2 = ' + par + '.', st, {index:i, parent_index:par});
      while(par >= 0 && st.a[par] < st.a[i]){
        st.hl = [par, i];
        r.f('while(parent_index>=0', st.a[par] + ' < ' + st.a[i] + ': yukarı çıkacak.', st, {index:i, parent_index:par});
        var t = st.a[par]; st.a[par] = st.a[i]; st.a[i] = t; st.sw = [par, i];
        r.f('heap->dizi[index] = temp_dugum;', 'Yer değiştirdiler.', st, {});
        st.sw = []; i = par; par = Math.trunc((i - 1) / 2); st.hl = [i];
        r.f('parent_index =(index-1)/2;', 'index = ' + i + ', yeni ebeveyn ' + par + '.', st, {index:i, parent_index:par});
      }
      st.hl = [i];
      r.f('while(parent_index>=0', i === 0 ? 'Köke gelindi ((0-1)/2 = 0, a[0] < a[0] yanlış): dur.' : st.a[par] + ' >= ' + st.a[i] + ': ebeveyn daha büyük, dur.', st, {index:i});
      st.hl = [];
      r.f(null, 'Bitti: ' + st.a.join(' ') + '. En fazla ağaç yüksekliği kadar adım: O(log n).', st, {});
    }});

  def({id:'a-heap-sil', week:6, title:'delete_max (buble_down)', view:'heap', file:'h6-heap',
    desc:'Kök ile son eleman yer değiştirir, eleman sayısı bir azalır, kök aşağı indirilir. Silinen en büyük dizinin sonunda kalır.',
    inputs:[['heap', 'Max heap (dizi)', '98 88 92 52 78 44 84 15 34 48 56']],
    code: 'void delete_max(struct heap *heap){\n    struct dugum dugum;\n    if(heap->eleman_sayisi>1){\n        dugum=heap->dizi[0];\n        heap->dizi[0]= heap->dizi[heap->eleman_sayisi-1];\n        heap->dizi[heap->eleman_sayisi-1]=dugum;\n        heap->eleman_sayisi--;\n        buble_down(heap,0);\n    }\n}\n\n' + C_DOWN,
    run: function(p, r){
      var a = nums(p.heap), st = {a:a.slice(), n:a.length, hl:[], sw:[]};
      r.f('void delete_max', 'delete_max: en büyük (kök, ' + st.a[0] + ') silinecek.', st, {});
      if(st.n <= 1){ r.f('if(heap->eleman_sayisi>1)', 'Tek eleman var, bir şey yapılmıyor.', st, {}); return; }
      var t = st.a[0]; st.a[0] = st.a[st.n - 1]; st.a[st.n - 1] = t; st.sw = [0, st.n - 1];
      r.f('heap->dizi[heap->eleman_sayisi-1]=dugum;', 'Kök ile son eleman yer değiştirdi.', st, {});
      st.sw = []; st.n--;
      r.f('heap->eleman_sayisi--;', 'eleman_sayisi = ' + st.n + '. ' + t + ' artık heap\'in dışında (gri).', st, {eleman_sayisi:st.n});
      r.f('buble_down(heap,0);', 'Kökteki ' + st.a[0] + ' aşağı indirilecek.', st, {index:0});
      bubbleDownFrames(r, st, 0);
      st.hl = [];
      r.f(null, 'Bitti: heap ' + st.a.slice(0, st.n).join(' ') + ' · dışarıda ' + st.a.slice(st.n).join(' ') + '. Heap sort bunu n-1 kez tekrarlar.', st, {});
    }});

  def({id:'a-heapify', week:6, title:'heapify', view:'heap', file:'h6-heap',
    desc:'Diziyi max heap yapar: son iç düğümden (n/2-1) köke kadar her düğüme buble_down uygulanır. Vizede sonucu çizdiriliyor.',
    inputs:[['dizi', 'Dizi', '20 5 42 80 65 70 88 12 6 4 33 90 27']],
    code: 'void heapify(struct heap *heap){\n    int i;\n    for(i=heap->eleman_sayisi/2 -1; i>=0; i--) buble_down(heap,i);\n}\n\n' + C_DOWN,
    run: function(p, r){
      var a = nums(p.dizi), st = {a:a.slice(), n:a.length, hl:[], sw:[]};
      var s = Math.floor(st.n / 2) - 1;
      r.f('void heapify', 'n = ' + st.n + '. Son iç düğüm ' + st.n + '/2-1 = ' + s + '. Ondan büyük indeksliler yaprak.', st, {});
      for(var i = s; i >= 0; i--){
        st.hl = [i];
        r.f('for(i=heap->eleman_sayisi/2 -1; i>=0; i--) buble_down(heap,i);', 'buble_down(' + i + '): ' + st.a[i] + ' yerine oturtulacak.', st, {i:i});
        bubbleDownFrames(r, st, i);
      }
      st.hl = [];
      r.f(null, 'Heap hazır: ' + st.a.join(' ') + '. Karmaşıklık O(n).', st, {});
    }});

  // bellek
  function malloc1N(p){ return Math.min(Math.max(nums(p.n)[0] || 4, 1), 8); }
  def({id:'a-malloc1', week:2, title:'malloc ile dinamik dizi', view:'mem', file:'h2-dinamik',
    desc:'main\'deki işaretçi fonksiyona adresiyle (int**) gönderilir; fonksiyon malloc ile heap\'te yer ayırıp adresini o işaretçiye yazar.',
    inputs:[['n', 'Eleman sayısı', '4']],
    code: function(p){ return 'void tek_boyutlu_dizi_olustur(int **dizi, int eleman_sayisi){\n    int i;\n    *dizi=(int*)malloc(sizeof(int)*eleman_sayisi);\n    for(i=0; i<eleman_sayisi; i++){\n      (*dizi)[i]=rand()%10;\n    }\n}\n\nint main(int argc, char** argv) {\n    int *dizi;\n    int eleman_sayisi;\n    eleman_sayisi=' + malloc1N(p) + ';\n    tek_boyutlu_dizi_olustur(&dizi, eleman_sayisi);\n    tek_boyutlu_dizi_yaz(dizi, eleman_sayisi);\n}'; },
    run: function(p, r){
      var n = malloc1N(p);
      var st = {stack:[{ad:'main: int *dizi', v:'?'}, {ad:'main: eleman_sayisi', v:'?'}], heap:[]};
      r.f('int *dizi;', 'main\'de dizi adında bir işaretçi var. Henüz hiçbir yeri göstermiyor (?). Stack\'te 8 byte.', st, {});
      st.stack[1].v = n;
      r.f('eleman_sayisi=' + n + ';', 'eleman_sayisi = ' + n + '.', st, {});
      st.stack.push({ad:'fonk: int **dizi', v:'&dizi', hl:true}); st.stack.push({ad:'fonk: eleman_sayisi', v:n});
      r.f('tek_boyutlu_dizi_olustur(&dizi, eleman_sayisi);', 'Fonksiyona main\'deki dizi\'nin ADRESİ gönderildi. Fonksiyondaki dizi (int**) onu gösteriyor.', st, {});
      var cells = []; for(var i = 0; i < n; i++) cells.push({v:'?'});
      st.heap.push({id:'b', ad:'heap bloğu', adr: n + '×4 = ' + (n * 4) + ' byte', cells:cells}); st.stack[0].to = 'b'; st.stack[0].hl = true; st.stack[2].hl = false;
      r.f('*dizi=(int*)malloc(sizeof(int)*eleman_sayisi);', 'malloc heap\'ten ' + (n * 4) + ' byte ayırdı. *dizi = ... ile adresi main\'deki dizi\'ye yazıldı (ok).', st, {});
      st.stack[0].hl = false;
      for(var j = 0; j < n; j++){ cells[j].v = (j * 7 + 3) % 10; cells[j].hl = true; st.heap[0].cells = clone(cells); r.f('(*dizi)[i]=rand()%10;', '(*dizi)[' + j + '] = ' + cells[j].v + ' (rastgele).', st, {i:j}); cells[j].hl = false; }
      st.heap[0].cells = clone(cells); st.stack.splice(2, 2);
      r.f('tek_boyutlu_dizi_yaz(dizi, eleman_sayisi);', 'Fonksiyon bitti, parametreleri stack\'ten silindi. Heap bloğu duruyor ve main\'deki dizi onu gösteriyor.', st, {});
    }});

  def({id:'a-malloc2', week:2, title:'malloc ile 2B matris (int**)', view:'mem', file:'h2-dinamik',
    desc:'Önce satır işaretçileri dizisi, sonra her satır ayrı ayrı malloc edilir. Vizede bellek hesabı soruldu.',
    inputs:[['satir', 'Satır', '3'], ['sutun', 'Sütun', '4']],
    code: 'void dinamik_matris_olustur1(int ***dizi,int satir,int sutun){\n    int i,j;\n    *dizi=(int**)malloc(satir*sizeof(int*));\n    for(i=0; i<satir; i++){\n        (*dizi)[i]= (int*)malloc(sutun*sizeof(int));\n        for(j=0; j<sutun; j++)\n            (*dizi)[i][j]= rand()%2;\n    }\n}\n\n// main:  int **A;  dinamik_matris_olustur1(&A, 3, 4);',
    run: function(p, r){
      var R = Math.min(Math.max(nums(p.satir)[0] || 3, 1), 5), Cn = Math.min(Math.max(nums(p.sutun)[0] || 4, 1), 6);
      var st = {stack:[{ad:'main: int **A', v:'?'}, {ad:'fonk: int ***dizi', v:'&A'}], heap:[]};
      r.f('void dinamik_matris_olustur1', 'main\'den dinamik_matris_olustur1(&A, ' + R + ', ' + Cn + ') çağrıldı. A\'nın adresi geldi.', st, {});
      var rows = []; for(var i = 0; i < R; i++) rows.push({v:'?'});
      st.heap.push({id:'rp', ad:'satır işaretçileri', adr: R + '×8 = ' + (R * 8) + ' byte', cells:rows}); st.stack[0].to = 'rp';
      r.f('*dizi=(int**)malloc(satir*sizeof(int*));', 'Önce ' + R + ' tane işaretçilik blok ayrıldı (her biri 8 byte). A artık onu gösteriyor.', st, {});
      for(var k = 0; k < R; k++){
        var cells = []; for(var j = 0; j < Cn; j++) cells.push({v:'?'});
        st.heap.push({id:'r' + k, ad:'satır ' + k, adr: Cn + '×4 = ' + (Cn * 4) + ' byte', cells:cells});
        st.heap[0].cells[k] = {to:'r' + k, hl:true};
        r.f('(*dizi)[i]= (int*)malloc(sutun*sizeof(int));', 'Satır ' + k + ' için ' + (Cn * 4) + ' byte ayrıldı; (*dizi)[' + k + '] onu gösteriyor.', st, {i:k});
        st.heap[0].cells[k].hl = false;
        st.heap[k + 1].cells = cells.map(function(c, j){ return {v: (k + j) % 2}; });
        r.f('(*dizi)[i][j]= rand()%2;', 'Satır ' + k + ' 0/1 ile dolduruldu.', st, {i:k});
      }
      var total = 8 + R * 8 + R * Cn * 4;
      r.f(null, 'Toplam: A (8) + satır işaretçileri (' + R + '·8) + elemanlar (' + R + '·' + Cn + '·4) = ' + total + ' byte. Heap\'te olan: ' + (total - 8) + ' byte.', st, {});
    }});

  def({id:'a-matris', week:2, title:'Matris çarpımı', view:'matrix', file:'h2-statik',
    desc:'C[i][j], A\'nın i. satırı ile B\'nin j. sütununun çarpımlarının toplamıdır. Üç iç içe döngü.',
    inputs:[['a', 'A (satırlar ; ile)', '1 0 2 ; 2 1 4'], ['b', 'B (satırlar ; ile)', '0 1 ; 2 4 ; 3 1']],
    code: 'void matris_carpimi(int *A, int A_satir, int A_sutun,\n                    int *B, int B_satir,int B_sutun,\n                    int *C,int C_satir, int C_sutun){\n    int i,j,k;\n    if(A_sutun!=B_satir){\n        printf("Carpim matrislerinin boyutlari uyusmuyor!!!");\n        return;\n    }\n    for(i=0; i<A_satir; i++)\n        for(j=0; j<B_sutun; j++){\n            *(C+i*C_sutun+j)= 0;\n            for(k=0; k<A_sutun; k++)\n                *(C+i*C_sutun+j)= *(C+i*C_sutun+j) + *(A+i*A_sutun +k)* *(B+k*B_sutun +j);\n        }\n}',
    run: function(p, r){
      var parse = function(s){ return String(s).split(';').map(nums).filter(function(x){ return x.length; }); };
      var A = parse(p.a), B = parse(p.b);
      var C = A.map(function(){ return B[0].map(function(){ return null; }); });
      var st = {A:A, B:B, C:C, i:-1, j:-1, k:-1};
      r.f('void matris_carpimi', 'A ' + A.length + '×' + A[0].length + ', B ' + B.length + '×' + B[0].length + '. Sonuç ' + A.length + '×' + B[0].length + ' olacak.', st, {});
      if(A[0].length !== B.length){ r.f('if(A_sutun!=B_satir){', 'A\'nın sütun sayısı B\'nin satır sayısına eşit değil: çarpılamaz.', st, {}); return; }
      r.f('if(A_sutun!=B_satir){', 'A_sutun (' + A[0].length + ') == B_satir (' + B.length + '): çarpılabilir.', st, {});
      for(var i = 0; i < A.length; i++) for(var j = 0; j < B[0].length; j++){
        st.i = i; st.j = j; st.k = -1; st.C[i][j] = 0;
        r.f('*(C+i*C_sutun+j)= 0;', 'C[' + i + '][' + j + '] = 0 ile başla.', st, {i:i, j:j});
        var parts = [];
        for(var k = 0; k < A[0].length; k++){
          st.k = k; st.C[i][j] += A[i][k] * B[k][j]; parts.push(A[i][k] + '·' + B[k][j]);
          r.f('*(C+i*C_sutun+j)= *(C+i*C_sutun+j) +', 'k = ' + k + ': A[' + i + '][' + k + ']·B[' + k + '][' + j + '] = ' + A[i][k] + '·' + B[k][j] + ' eklendi. C[' + i + '][' + j + '] = ' + parts.join(' + ') + ' = ' + st.C[i][j] + '.', st, {i:i, j:j, k:k});
        }
      }
      st.i = st.j = st.k = -1;
      r.f(null, 'Bitti. Toplam ' + (A.length * B[0].length * A[0].length) + ' çarpma: O(m·n·p).', st, {});
    }});

  // ================= OYNATICI =================
  var BY_ID = {}; ANIMS.forEach(function(a){ BY_ID[a.id] = a; });
  window.VY_ANIMS = ANIMS;

  function build(a){
    var sec = document.createElement('section');
    sec.className = 'view'; sec.dataset.view = a.id; sec.hidden = true;
    sec.innerHTML =
      '<a class="back" href="#anim">← Bütün animasyonlar</a>' +
      '<div class="view-head"><span class="label">Hafta ' + a.week + ' · animasyon</span><h1>' + esc(a.title) + '</h1><p class="muted">' + esc(a.desc) + '</p></div>' +
      '<div class="anim-inputs">' + a.inputs.map(function(f){ return '<div class="field"><label for="' + a.id + '-' + f[0] + '">' + esc(f[1]) + '</label><input type="text" id="' + a.id + '-' + f[0] + '" value="' + esc(f[2]) + '"></div>'; }).join('') +
      '<button class="btn" type="button" data-apply>Bu verilerle hazırla</button></div>' +
      '<div class="anim-grid"><div class="anim-code"><div class="anim-cap">Kod</div><pre class="code hl" data-code></pre></div>' +
      '<div class="anim-vis"><div class="anim-cap">Bellekte</div><div class="anim-draw" data-draw></div><div class="anim-note" data-note></div><div class="anim-vars" data-vars></div></div></div>' +
      '<div class="anim-ctl"><button class="btn" type="button" data-first title="Başa sar">⏮</button><button class="btn" type="button" data-prev title="Bir adım geri">◀</button>' +
      '<button class="btn primary" type="button" data-play>▶ Oynat</button><button class="btn" type="button" data-next title="Bir adım ileri">▶|</button>' +
      '<input type="range" min="0" value="0" data-seek aria-label="Adım">' +
      '<span class="anim-step" data-step></span>' +
      '<select data-speed aria-label="Hız"><option value="2200">Yavaş</option><option value="1400" selected>Normal</option><option value="700">Hızlı</option></select>' +
      '<label class="anim-type"><input type="checkbox" data-type checked> Kodu yazarak başlat</label></div>' +
      (a.file ? '<p class="muted" style="margin-top:14px;font-size:.92rem">Bu kodun bütün dosyası ve fonksiyon fonksiyon açıklaması: <a href="#k-' + a.file + '">Kod anlatımı</a></p>' : '');
    return sec;
  }

  function Player(a, sec){
    var q = function(s){ return sec.querySelector(s); };
    var codeEl = q('[data-code]'), drawEl = q('[data-draw]'), noteEl = q('[data-note]'), varsEl = q('[data-vars]');
    var seek = q('[data-seek]'), stepEl = q('[data-step]'), playBtn = q('[data-play]'), speed = q('[data-speed]'), typeBox = q('[data-type]');
    var frames = [], at = 0, timer = null, typed = false, typing = null, code = '';
    function prepare(){
      stop();
      var p = {}; a.inputs.forEach(function(f){ p[f[0]] = q('#' + a.id + '-' + f[0]).value; });
      code = typeof a.code === 'function' ? a.code(p) : a.code;
      var r = new Rec(code);
      try { a.run(p, r); } catch(e){ r.frames.push({l:0, note:'Bu verilerle çalıştırılamadı: ' + e.message, st:null, v:{}}); }
      frames = r.frames; at = 0; typed = false;
      codeEl.innerHTML = hlCode(code);
      seek.max = Math.max(0, frames.length - 1);
      show();
    }
    function show(){
      var f = frames[at]; if(!f) return;
      codeEl.querySelectorAll('.cl.on').forEach(function(e){ e.classList.remove('on'); });
      if(f.l){ var ln = codeEl.querySelector('.cl[data-l="' + f.l + '"]'); if(ln){ ln.classList.add('on'); var top = ln.offsetTop - codeEl.clientHeight / 2 + 20; codeEl.scrollTo({top: Math.max(0, top), behavior: 'smooth'}); } }
      // her animasyonun ok işareti ayrı kimlik taşısın; gizli görünümlerdeki aynı id'ler çizimi bozmasın
      if(f.st) drawEl.innerHTML = DRAW[a.view](f.st).replace('id="ah"', 'id="ah-' + a.id + '"').replace(/url\(#ah\)/g, 'url(#ah-' + a.id + ')');
      noteEl.textContent = f.note;
      var keys = Object.keys(f.v || {});
      varsEl.innerHTML = keys.map(function(k){ return '<span class="var"><b>' + esc(k) + '</b> = ' + esc(f.v[k]) + '</span>'; }).join('');
      seek.value = at; stepEl.textContent = 'Adım ' + (at + 1) + ' / ' + frames.length;
    }
    function go(i){ at = Math.max(0, Math.min(frames.length - 1, i)); show(); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } if(typing){ clearInterval(typing); typing = null; codeEl.innerHTML = hlCode(code); show(); } playBtn.textContent = '▶ Oynat'; }
    function runFrames(){
      timer = setInterval(function(){ if(at >= frames.length - 1){ stop(); return; } go(at + 1); }, +speed.value);
    }
    function play(){
      if(timer || typing){ stop(); return; }
      playBtn.textContent = '⏸ Duraklat';
      if(at >= frames.length - 1) go(0);
      if(typeBox.checked && !typed && at === 0){
        typed = true;
        var src = code, n = 0, stepN = Math.max(3, Math.ceil(src.length / 90));
        drawEl.innerHTML = ''; noteEl.textContent = 'Kod yazılıyor…'; varsEl.innerHTML = '';
        typing = setInterval(function(){
          n += stepN;
          if(n >= src.length){ clearInterval(typing); typing = null; codeEl.innerHTML = hlCode(src); show(); runFrames(); return; }
          codeEl.innerHTML = hlCode(src.slice(0, n)) + '<span class="caret"></span>';
          codeEl.scrollTop = codeEl.scrollHeight;
        }, 30);
        return;
      }
      runFrames();
    }
    q('[data-apply]').addEventListener('click', prepare);
    q('[data-first]').addEventListener('click', function(){ stop(); go(0); });
    q('[data-prev]').addEventListener('click', function(){ stop(); go(at - 1); });
    q('[data-next]').addEventListener('click', function(){ stop(); go(at + 1); });
    playBtn.addEventListener('click', play);
    seek.addEventListener('input', function(){ stop(); go(+seek.value); });
    speed.addEventListener('change', function(){ if(timer){ clearInterval(timer); runFrames(); } });
    this.prepare = prepare; this.stop = stop; this.play = play;
    this.step = function(d){ stop(); go(at + d); };
  }

  window.VY_ANIM_LIB = {Rec: Rec, DRAW: DRAW};
  if(typeof document === 'undefined') return;

  // görünümleri sayfaya ekle
  var main = document.querySelector('main');
  var players = {}, open = null;
  ANIMS.forEach(function(a){ var sec = build(a); main.appendChild(sec); players[a.id] = new Player(a, sec); });
  window.VY_ANIM_OPEN = function(id){ open = players[id] ? id : null; if(open && !players[id].ready){ players[id].prepare(); players[id].ready = true; } };
  window.VY_ANIM_STOP = function(){ Object.keys(players).forEach(function(k){ players[k].stop(); }); };
  // klavye: ← → adım, boşluk oynat/duraklat
  document.addEventListener('keydown', function(e){
    if(!open || /INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName)) return;
    if(e.key === 'ArrowRight'){ players[open].step(1); e.preventDefault(); }
    else if(e.key === 'ArrowLeft'){ players[open].step(-1); e.preventDefault(); }
    else if(e.key === ' '){ players[open].play(); e.preventDefault(); }
  });
})();
