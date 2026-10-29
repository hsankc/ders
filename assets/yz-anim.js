// Yapay Zeka: çizimler ve adım adım animasyonlar.
// Sayfadaki her <div class="yza" data-cfg='{...}'> bir animasyon ya da statik şekil olur.
// Animasyonlar "kare" listesi üretir; her karede SVG, yan panel ve açıklama vardır. Oynatıcı bunları sırayla gösterir.
(function(){
  var esc = function(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var tx = function(s){ return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); };
  var r1 = function(x){ return Math.round(x * 10) / 10; };
  var fmt = function(x){ return String(Math.round(x * 100) / 100).replace('.', ','); };
  var trCmp = function(a, b){ return a.localeCompare(b, 'tr'); };

  // her SVG kendi ok işaretini taşır: gizli bir görünümdeki aynı id'li işarete bağlanan oklar çizilmez
  var uid = 0;
  function svg(w, h, body, cls){
    var u = 'yz' + (++uid);
    body = body.replace(/url\(#yzahg\)/g, 'url(#' + u + 'g)').replace(/url\(#yzah\)/g, 'url(#' + u + ')');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="yza-svg' + (cls ? ' ' + cls : '') + '" role="img" preserveAspectRatio="xMidYMid meet">' +
      '<defs><marker id="' + u + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker>' +
      '<marker id="' + u + 'g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ahg"/></marker></defs>' + body + '</svg>';
  }
  var T = function(x, y, s, cls, extra){ return '<text x="' + r1(x) + '" y="' + r1(y) + '"' + (cls ? ' class="' + cls + '"' : '') + (extra || '') + '>' + esc(s) + '</text>'; };

  // ================================================================ GRAFLAR
  var GRAPHS = {
    study: {w: 470, h: 250, dir: true, s: 'S', t: 'G', r: 21,
      nodes: {S: [40, 125, 7], A: [175, 45, 5], B: [175, 205, 4], C: [320, 55, 2], G: [430, 195, 0]},
      edges: [['S', 'A', 2], ['S', 'B', 5], ['A', 'B', 1], ['A', 'C', 6], ['B', 'C', 2], ['B', 'G', 8], ['C', 'G', 3]]},
    cz: {w: 480, h: 300, dir: false, s: 'Çanakkale', t: 'İzmir', r: 30,
      note: {astar: ' Ama gerçek en kısa yol **285** (Çan → Balıkesir). A* yanıldı çünkü h(Balıkesir) = 150, Balıkesir\'den İzmir\'e gerçek yol ise 130: tahmin gerçeği abartıyor, sezgisel **kabul edilebilir değil**. Balıkesir\'in f\'si (305) İzmir\'in f\'sinden (300) büyük göründüğü için hiç açılmadı.', greedy: ' Gerçek en kısa yol 285 (Çan → Balıkesir); Greedy sadece Ezine\'nin h\'si (190) Çan\'ınkinden (210) küçük olduğu için sahile saptı.'},
      nodes: {'Çanakkale': [240, 38, 230], 'Ezine': [85, 100, 190], 'Çan': [395, 100, 210], 'Edremit': [85, 215, 130], 'Balıkesir': [395, 215, 150], 'İzmir': [240, 265, 0]},
      edges: [['Çanakkale', 'Ezine', 45], ['Çanakkale', 'Çan', 65], ['Ezine', 'Edremit', 65], ['Çan', 'Balıkesir', 90], ['Edremit', 'İzmir', 190], ['Balıkesir', 'İzmir', 130]]},
    ucs: {w: 480, h: 260, dir: true, s: 'S', t: 'Z', r: 19, labels: {S: 'Start', Z: 'End'},
      nodes: {S: [40, 50], A: [70, 205], B: [170, 95], C: [215, 215], D: [310, 150], E: [300, 35], F: [430, 105], Z: [430, 225]},
      edges: [['S', 'A', 10], ['A', 'B', 10], ['A', 'C', 50], ['B', 'E', 20], ['B', 'D', 100], ['E', 'F', 20], ['F', 'D', 10], ['C', 'D', 25], ['D', 'Z', 25], ['F', 'Z', 20]]},
    sabg: {w: 300, h: 220, dir: false, s: 'S', t: 'G', r: 20,
      nodes: {S: [40, 110], A: [150, 40], B: [150, 180], G: [260, 110]},
      edges: [['S', 'A'], ['S', 'B'], ['A', 'B'], ['A', 'G'], ['B', 'G']]}
  };
  var TREES = {
    t07: {w: 440, h: 230, r: 18, kids: {0: [1, 2, 3], 1: [4, 5], 2: [6], 3: [7]}, pos: {0: [220, 30], 1: [100, 110], 2: [220, 110], 3: [340, 110], 4: [55, 195], 5: [145, 195], 6: [220, 195], 7: [340, 195]}},
    taf: {w: 440, h: 230, r: 19, kids: {A: ['B', 'C', 'D'], C: ['E'], D: ['F']}, extra: [['C', 'F']], pos: {A: [220, 30], B: [90, 110], C: [220, 110], D: [350, 110], E: [190, 195], F: [350, 195]}}
  };
  var ALG = {bfs: 'BFS', dfs: 'DFS', ucs: 'UCS', greedy: 'Greedy', astar: 'A*', pre: 'Preorder', post: 'Postorder', sdfs: 'DFS (yığın)',
    hc: 'Tepe tırmanma', sa: 'Tavlama (zar tuttu)', sa2: 'Tavlama (zar tutmadı)', tabu: 'Tabu arama'};

  function adjOf(G){
    var a = {};
    Object.keys(G.nodes).forEach(function(n){ a[n] = {}; });
    G.edges.forEach(function(e){ a[e[0]][e[1]] = e[2]; if(!G.dir) a[e[1]][e[0]] = e[2]; });
    return a;
  }
  var lab = function(G, n){ return (G.labels && G.labels[n]) || n; };
  var hOf = function(G, n){ return G.nodes[n][2]; };

  // graf çizimi: st = {cls:{node:'fr'|'ex'|'cur'|'path'}, tree:{"a>b":1}, path:[...], showH, showW}
  function drawGraph(G, st){
    st = st || {};
    var cls = st.cls || {}, body = '', R = G.r, pathE = {};
    (st.path || []).forEach(function(n, i, p){ if(i) { pathE[p[i - 1] + '>' + n] = 1; pathE[n + '>' + p[i - 1]] = 1; } });
    G.edges.forEach(function(e){
      var a = G.nodes[e[0]], b = G.nodes[e[1]], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
      var x1 = a[0] + ux * R, y1 = a[1] + uy * R, x2 = b[0] - ux * (R + (G.dir ? 3 : 0)), y2 = b[1] - uy * (R + (G.dir ? 3 : 0));
      var k = e[0] + '>' + e[1], c = pathE[k] ? 'pa' : (st.tree && (st.tree[k] || (!G.dir && st.tree[e[1] + '>' + e[0]])) ? 'tr' : '');
      body += '<line class="ed ' + c + '" x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '"' + (G.dir ? ' marker-end="url(#' + (c === 'pa' ? 'yzahg' : 'yzah') + ')"' : '') + '/>';
      if(e[2] != null && st.showW !== false){
        var mx = (a[0] + b[0]) / 2 - uy * 11, my = (a[1] + b[1]) / 2 + ux * 11;
        body += '<g class="wt"><rect x="' + r1(mx - 13) + '" y="' + r1(my - 9) + '" width="26" height="17" rx="5"/>' + T(mx, my + 4, e[2]) + '</g>';
      }
    });
    Object.keys(G.nodes).forEach(function(n){
      var p = G.nodes[n], c = cls[n] || '';
      if(n === G.t && !c) c = 'goal';
      body += '<g class="nd ' + c + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + R + '"/>' + T(p[0], p[1] + 4.5, lab(G, n), 'nl' + (lab(G, n).length > 3 ? ' sm' : '')) + '</g>';
      if(st.showH && p[2] != null) body += T(p[0], p[1] + R + 14, 'h=' + p[2], 'hv');
    });
    return svg(G.w, G.h, body, 'graph');
  }

  // ---------- arama adımları (graf araması; hedef testi düğüm açılırken; eşitlikte alfabetik)
  function searchFrames(G, alg){
    var adj = adjOf(G), s = G.s, goal = G.t, frames = [], explored = [], F = [];
    var useG = alg === 'ucs' || alg === 'astar', useH = alg === 'greedy' || alg === 'astar';
    var fval = function(g, n){ return alg === 'ucs' ? g : alg === 'greedy' ? hOf(G, n) : alg === 'astar' ? g + hOf(G, n) : g; };
    var tree = {};
    var DS = {bfs: 'Kuyruk (FIFO): soldan çıkar', dfs: 'Yığın (LIFO): sağdan (üstten) çıkar', ucs: 'Öncelikli kuyruk: en küçük g önce', greedy: 'Öncelikli kuyruk: en küçük h önce', astar: 'Öncelikli kuyruk: en küçük f = g + h önce'}[alg];
    function chip(it){
      var v = alg === 'bfs' || alg === 'dfs' ? 'g=' + it.g : alg === 'ucs' ? 'g=' + it.g : alg === 'greedy' ? 'h=' + hOf(G, it.n) : 'f=' + it.g + '+' + hOf(G, it.n) + '=' + (it.g + hOf(G, it.n));
      return '<span class="yza-chip">' + esc(lab(G, it.n)) + ' <i>' + v + '</i></span>';
    }
    function order(){ if(alg === 'bfs' || alg === 'dfs') return F; return F.slice().sort(function(a, b){ return a.f - b.f || trCmp(a.n, b.n); }); }
    function snap(cur, note, path){
      var cls = {};
      F.forEach(function(it){ cls[it.n] = 'fr'; });
      explored.forEach(function(n){ cls[n] = 'ex'; });
      if(cur) cls[cur] = 'cur';
      if(path) path.forEach(function(n){ cls[n] = 'path'; });
      var side = '<div class="yza-ds"><span class="yza-lbl">' + DS + '</span><div class="yza-chips">' + (order().length ? order().map(chip).join('') : '<span class="muted">boş</span>') + '</div></div>' +
        '<div class="yza-ds"><span class="yza-lbl">Açılanlar (sırayla)</span><div class="yza-chips">' + (explored.length ? explored.map(function(n, i){ return '<span class="yza-chip ex">' + (i + 1) + '. ' + esc(lab(G, n)) + '</span>'; }).join('') : '<span class="muted">henüz yok</span>') + '</div></div>';
      var t = {}; Object.keys(tree).forEach(function(k){ t[k] = 1; });
      frames.push({svg: drawGraph(G, {cls: cls, tree: t, path: path, showH: useH || alg === 'astar'}), side: side, note: note});
    }
    var push = function(n, g, par){ var it = {n: n, g: g, par: par, f: fval(g, n)}; F.push(it); tree[par.n + '>' + n] = 1; return it; };
    F.push({n: s, g: 0, par: null, f: fval(0, s)});
    snap(null, '**Başlangıç:** ' + lab(G, s) + (alg === 'dfs' ? ' yığına' : ' kuyruğa') + ' konur. Hedef: ' + lab(G, goal) + '.' + (useH ? ' Düğümlerin altındaki h değerleri hedefe kalan tahmini mesafe.' : ''));
    var guard = 0;
    while(F.length && guard++ < 60){
      var it;
      if(alg === 'bfs') it = F.shift();
      else if(alg === 'dfs') it = F.pop();
      else { var o = order()[0]; F.splice(F.indexOf(o), 1); it = o; }
      if(explored.indexOf(it.n) >= 0){ snap(null, '**' + lab(G, it.n) + '** daha önce açıldı; atlanır.'); continue; }
      explored.push(it.n);
      var path = []; for(var p = it; p; p = p.par) path.unshift(p.n);
      if(it.n === goal){
        var cost = 0; for(var i = 1; i < path.length; i++) cost += adj[path[i - 1]][path[i]];
        snap(it.n, '**' + lab(G, it.n) + ' açıldı → hedef!** Yol: ' + path.map(function(n){ return lab(G, n); }).join(' → ') + ', toplam maliyet **' + cost + '**.' + (alg === 'bfs' ? ' BFS en az kenarlı yolu bulur; maliyetlere bakmaz.' : alg === 'greedy' ? ' Greedy sadece h\'ye baktığı için en ucuz yolu garanti etmez.' : '') + ((G.note && G.note[alg]) || ''), path);
        return frames;
      }
      var kids = Object.keys(adj[it.n]).sort(trCmp), notes = [];
      if(alg === 'dfs') kids = kids.slice().reverse();
      kids.forEach(function(k){
        if(explored.indexOf(k) >= 0){ notes.push(lab(G, k) + ' zaten açıldı'); return; }
        var g = it.g + adj[it.n][k], inF = F.filter(function(x){ return x.n === k; })[0];
        if(alg === 'bfs'){
          if(inF){ notes.push(lab(G, k) + ' zaten kuyrukta'); return; }
          push(k, g, it); notes.push('**' + lab(G, k) + '** eklendi');
        } else if(alg === 'dfs'){
          if(inF) F.splice(F.indexOf(inF), 1);
          push(k, g, it); notes.push('**' + lab(G, k) + '** yığına' + (inF ? ' (yeniden, en üste)' : ''));
        } else {
          var f = fval(g, k);
          if(!inF){ push(k, g, it); notes.push('**' + lab(G, k) + '** eklendi (' + (alg === 'greedy' ? 'h=' + hOf(G, k) : alg === 'astar' ? 'f=' + g + '+' + hOf(G, k) + '=' + f : 'g=' + g) + ')'); }
          else if(alg !== 'greedy' && g < inF.g){ delete tree[inF.par.n + '>' + k]; inF.g = g; inF.f = f; inF.par = it; tree[it.n + '>' + k] = 1; notes.push('**' + lab(G, k) + '** güncellendi: daha ucuz yol, ' + (alg === 'astar' ? 'f=' + f : 'g=' + g)); }
          else notes.push(lab(G, k) + ' kuyrukta zaten ' + (alg === 'greedy' ? 'var' : 'daha iyi ya da eşit (' + (alg === 'astar' ? 'f=' + inF.f : 'g=' + inF.g) + ')'));
        }
      });
      var why = alg === 'bfs' ? 'Kuyruğun başındaki' : alg === 'dfs' ? 'Yığının üstündeki' : alg === 'ucs' ? 'g\'si en küçük olan' : alg === 'greedy' ? 'h\'si en küçük olan' : 'f\'si en küçük olan';
      snap(it.n, why + ' **' + lab(G, it.n) + '** açıldı' + (useG ? ' (g=' + it.g + (alg === 'astar' ? ', f=' + it.f : '') + ')' : alg === 'greedy' ? ' (h=' + hOf(G, it.n) + ')' : '') + '. ' + (notes.length ? 'Komşular: ' + notes.join('; ') + '.' : 'Komşusu yok.'));
    }
    snap(null, 'Kuyruk boşaldı: çözüm yok.');
    return frames;
  }

  // ---------- ağaç dolaşma
  function treeDraw(Tr, st){
    var body = '', R = Tr.r, cls = st.cls || {}, ord = st.ord || {};
    var line = function(a, b, dash){ var p = Tr.pos[a], q = Tr.pos[b], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy);
      return '<line class="ed' + (dash ? ' dash' : '') + '" x1="' + r1(p[0] + dx / L * R) + '" y1="' + r1(p[1] + dy / L * R) + '" x2="' + r1(q[0] - dx / L * (R + 3)) + '" y2="' + r1(q[1] - dy / L * (R + 3)) + '" marker-end="url(#yzah)"/>'; };
    Object.keys(Tr.kids).forEach(function(a){ Tr.kids[a].forEach(function(b){ body += line(a, b); }); });
    (Tr.extra || []).forEach(function(e){ body += line(e[0], e[1], true); });
    Object.keys(Tr.pos).forEach(function(n){
      var p = Tr.pos[n];
      body += '<g class="nd ' + (cls[n] || '') + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + R + '"/>' + T(p[0], p[1] + 4.5, n, 'nl') + '</g>';
      if(ord[n]) body += '<g class="ord"><circle cx="' + (p[0] + R * .8) + '" cy="' + (p[1] - R * .8) + '" r="9"/>' + T(p[0] + R * .8, p[1] - R * .8 + 3.5, ord[n]) + '</g>';
    });
    return svg(Tr.w, Tr.h, body, 'graph');
  }
  function treeFrames(Tr, alg){
    var frames = [], out = [], cls = {}, ord = {}, kids = function(n){ return (Tr.kids[n] || []).map(String); };
    var root = Object.keys(Tr.pos)[0];
    function snap(cur, note, ds){
      var c = {}; Object.keys(cls).forEach(function(k){ c[k] = cls[k]; }); if(cur != null) c[cur] = 'cur';
      var o = {}; Object.keys(ord).forEach(function(k){ o[k] = ord[k]; });
      frames.push({svg: treeDraw(Tr, {cls: c, ord: o}), note: note,
        side: (ds ? '<div class="yza-ds"><span class="yza-lbl">' + ds[0] + '</span><div class="yza-chips">' + (ds[1].length ? ds[1].map(function(n){ return '<span class="yza-chip">' + esc(n) + '</span>'; }).join('') : '<span class="muted">boş</span>') + '</div></div>' : '') +
          '<div class="yza-ds"><span class="yza-lbl">Çıktı sırası</span><div class="yza-chips">' + (out.length ? out.map(function(n){ return '<span class="yza-chip ex">' + esc(n) + '</span>'; }).join('') : '<span class="muted">henüz yok</span>') + '</div></div>'});
    }
    var visit = function(n){ out.push(n); ord[n] = out.length; cls[n] = 'ex'; };
    if(alg === 'pre' || alg === 'post'){
      snap(null, alg === 'pre' ? '**Preorder (kök – sol – sağ):** önce düğümün kendisi yazılır, sonra çocukları soldan sağa aynı kuralla.' : '**Postorder (sol – sağ – kök):** önce bütün çocuklar soldan sağa dolaşılır, düğüm en son yazılır.');
      (function rec(n){
        if(alg === 'pre'){ visit(n); snap(n, '**' + n + '** yazıldı' + (kids(n).length ? '; şimdi çocukları: ' + kids(n).join(', ') + '.' : ' (yaprak).')); }
        else { cls[n] = 'fr'; snap(n, '**' + n + '** düğümüne gelindi; ' + (kids(n).length ? 'önce çocukları (' + kids(n).join(', ') + ') dolaşılacak.' : 'çocuğu yok, hemen yazılır.')); }
        kids(n).forEach(rec);
        if(alg === 'post'){ visit(n); snap(n, '**' + n + '** yazıldı' + (kids(n).length ? ': bütün çocukları bitti.' : '.')); }
      })(root);
    } else if(alg === 'bfs'){
      var q = [root];
      snap(null, '**BFS:** kuyruk = [' + root + ']. Seviye seviye, soldan sağa.', ['Kuyruk (FIFO)', q.slice()]);
      while(q.length){ var n = q.shift(); visit(n); q = q.concat(kids(n)); snap(n, '**' + n + '** kuyruktan çıktı ve yazıldı' + (kids(n).length ? '; çocukları (' + kids(n).join(', ') + ') kuyruğun sonuna eklendi.' : '.'), ['Kuyruk (FIFO)', q.slice()]); }
    } else {
      var st = [root];
      snap(null, '**DFS (yığınla):** yığın = [' + root + ']. Her adımda yığının üstündeki (en son eklenen) düğüm çıkar; çocuklar B, C, D sırasıyla konduğu için en son konan D önce çıkar.', ['Yığın (LIFO) · sağ uç üst', st.slice()]);
      while(st.length){ var m = st.pop(); visit(m); st = st.concat(kids(m)); snap(m, '**' + m + '** yığından çıktı ve yazıldı' + (kids(m).length ? '; çocukları (' + kids(m).join(', ') + ') yığına kondu.' : '.'), ['Yığın (LIFO) · sağ uç üst', st.slice()]); }
    }
    frames[frames.length - 1].note += ' **Sonuç: ' + out.join(' ') + '**';
    return frames;
  }

  // ---------- durum uzayından arama ağacına (ağaç araması, aynı yolda tekrar yok)
  function expandFrames(){
    var G = GRAPHS.sabg, adj = adjOf(G), frames = [];
    // ağaç: her düğüm {n, path, kids}
    var root = {n: 'S', path: ['S'], d: 0}, levels = [[root]];
    for(var d = 0; d < 3; d++){
      var next = [];
      levels[d].forEach(function(nd){
        nd.kids = [];
        if(nd.n === 'G') return;
        Object.keys(adj[nd.n]).sort(trCmp).forEach(function(k){ if(nd.path.indexOf(k) < 0){ var c = {n: k, path: nd.path.concat(k), d: d + 1}; nd.kids.push(c); next.push(c); } });
      });
      if(!next.length) break;
      levels.push(next);
    }
    // yaprak sayısına göre yatay yerleşim
    var leaves = 0;
    (function place(nd){ if(!nd.kids || !nd.kids.length){ nd.x = leaves++; return; } nd.kids.forEach(place); nd.x = (nd.kids[0].x + nd.kids[nd.kids.length - 1].x) / 2; })(root);
    var W = 340, X0 = 330, cw = W / Math.max(1, leaves - 1 || 1), RY = 52;
    function drawUpTo(maxD){
      var body = '', count = 0;
      // sol: harita
      var gsv = drawGraph(G, {}).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace(/<defs>.*?<\/defs>/, '');
      body += '<g transform="translate(0,10)">' + gsv + '</g>' + T(150, 248, 'Durum uzayı (harita)', 'cap');
      (function walk(nd){
        if(nd.d > maxD) return;
        count++;
        var x = X0 + nd.x * cw * .9 + 10, y = 26 + nd.d * RY;
        (nd.kids || []).forEach(function(c){ if(c.d <= maxD){ var cx = X0 + c.x * cw * .9 + 10, cy = 26 + c.d * RY; body += '<line class="ed tr" x1="' + r1(x) + '" y1="' + (y + 14) + '" x2="' + r1(cx) + '" y2="' + (cy - 14) + '"/>'; } walk(c); });
        body += '<g class="nd ' + (nd.n === 'G' ? 'path' : nd.d === maxD ? 'fr' : 'ex') + '"><circle cx="' + r1(x) + '" cy="' + y + '" r="14"/>' + T(x, y + 4, nd.n, 'nl sm') + '</g>';
      })(root);
      body += T(X0 + W * .45, 248, 'Arama ağacı', 'cap');
      return {svg: svg(700, 260, body, 'graph'), count: count};
    }
    var notes = ['Sol tarafta 4 mekanlı harita var. Arama ağacının kökü başlangıç durumu **S**.',
      '1. adım: S\'den gidilebilen yerler A ve B ağaca eklenir.',
      '2. adım: A\'dan B ve G, B\'den A ve G. Aynı mekanlar (A, B, G) ağaçta birden çok kez görünmeye başladı.',
      '3. adım: G yaprak; B ve A dallarından tekrar G\'ye ulaşılır. Harita 4 mekan ama ağaç şimdiden büyüdü. Gerçek problemlerde bu büyüme üsteldir: **kombinatoryal patlama**.'];
    for(var k = 0; k < levels.length; k++){ var dr = drawUpTo(k); frames.push({svg: dr.svg, note: notes[k] + ' (Ağaçta ' + dr.count + ' düğüm.)', side: ''}); }
    return frames;
  }

  // ================================================================ YEREL ARAMA MANZARASI
  var LAND = [{s: '[A,B,C,D]', v: 60, t: 'Başlangıç'}, {s: '[B,A,C,D]', v: 70, t: 'Yerel maksimum'}, {s: '[B,C,A,D]', v: 50, t: 'Vadi'}, {s: '[D,C,B,A]', v: 100, t: 'Gerçek zirve'}, {s: '[D,C,A,B]', v: 80, t: 'Plato'}, {s: '[C,D,A,B]', v: 80, t: 'Plato'}];
  function landDraw(at, extra){
    var w = 560, h = 260, x0 = 60, dx = 90, yv = function(v){ return 225 - (v - 30) * 2.6; };
    var pts = LAND.map(function(p, i){ return [x0 + i * dx, yv(p.v)]; });
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for(var i = 1; i < pts.length; i++){ var a = pts[i - 1], b = pts[i], mx = (a[0] + b[0]) / 2; d += ' C' + mx + ',' + a[1] + ' ' + mx + ',' + b[1] + ' ' + b[0] + ',' + b[1]; }
    var body = '<line class="axis" x1="30" y1="232" x2="545" y2="232"/><line class="axis" x1="30" y1="232" x2="30" y2="20"/>' + T(36, 16, 'puan (hedef fonksiyonu)', 'cap', ' style="text-anchor:start"') + T(540, 250, 'durum uzayı', 'cap', ' style="text-anchor:end"');
    body += '<path class="land" d="' + d + '"/>';
    pts.forEach(function(p, i){
      body += '<circle class="lp' + (extra && extra.tabu && extra.tabu.indexOf(i) >= 0 ? ' tabu' : '') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="4"/>' + T(p[0], p[1] + 21, LAND[i].v, 'lv') + T(p[0], 248, LAND[i].s, 'ls');
    });
    if(at != null){ var p = pts[at]; body += '<circle class="ball" cx="' + p[0] + '" cy="' + (p[1] - 9) + '" r="9"/>'; }
    if(extra && extra.look) extra.look.forEach(function(i){ var q = pts[i]; body += '<circle class="look" cx="' + q[0] + '" cy="' + q[1] + '" r="11"/>'; });
    return svg(w, h, body, 'plot');
  }
  function localFrames(alg){
    var F = [];
    var add = function(at, note, ex, side){ F.push({svg: landDraw(at, ex), note: note, side: side || ''}); };
    var tabuSide = function(l){ return '<div class="yza-ds"><span class="yza-lbl">Tabu listesi</span><div class="yza-chips">' + (l.length ? l.map(function(x){ return '<span class="yza-chip bad">' + x + '</span>'; }).join('') : '<span class="muted">boş</span>') + '</div></div>'; };
    var tSide = function(t){ return '<div class="yza-ds"><span class="yza-lbl">Sıcaklık</span><div class="yza-chips"><span class="yza-chip">T = ' + t + '</span></div></div>'; };
    if(alg === 'hc'){
      add(0, '**Tepe tırmanma.** Başlangıç [A,B,C,D], puan 60. Kural: sadece daha yüksek puanlı komşuya geç.');
      add(0, 'Komşulara bak: sağdaki [B,A,C,D] 70 puan, daha iyi.', {look: [1]});
      add(1, '70\'e çıkıldı. Geçmiş unutulur (hafızasız).');
      add(1, 'Komşulara bak: sol 60, sağ 50. İkisi de **daha kötü**.', {look: [0, 2]});
      add(1, '**DUR.** Algoritma zirveye ulaştığını sanar ama burası 70 puanlık **yerel maksimum**. Asıl zirve (100) vadinin arkasında; aşağı inmeyi reddettiği için oraya hiç ulaşamaz.');
    } else if(alg === 'sa' || alg === 'sa2'){
      add(0, '**Tavlama benzetimi.** Başlangıç 60, sıcaklık T = 40.', null, tSide(40));
      add(1, 'Rastgele seçilen komşu 70: ΔE = +10 > 0, daha iyi → kesin kabul.', null, tSide(40));
      add(1, 'Rastgele komşu vadi (50): ΔE = 50 − 70 = −20. Hemen reddetme! P = e^(−20/40) = e^(−0,5) ≈ **0,61**.', {look: [2]}, tSide(40));
      if(alg === 'sa'){
        add(1, 'Zar atılır: r = 0,45. r ≤ 0,61 olduğu için kötü hamle **kabul**: vadiye inilir.', {look: [2]}, tSide(40));
        add(2, 'Vadideyiz (50). T soğutulur: T ← 0,9 · 40 = 36.', null, tSide(36));
        add(2, 'Rastgele komşu 100: ΔE = +50 > 0 → kesin kabul.', {look: [3]}, tSide(36));
        add(3, '**Gerçek zirve (100).** Kötü hamleyi göze aldığı için tepe tırmanmanın takıldığı yerel maksimumdan kurtuldu. T düştükçe kötü hamle kabul etme ihtimali azalır ve algoritma burada yerleşir.', null, tSide(30));
      } else {
        add(1, 'Zar atılır: r = 0,80. r > 0,61 → kötü hamle **reddedildi**, 70\'te kalınır. T soğur: 36.', {look: [2]}, tSide(36));
        add(1, 'Bir sonraki denemede yine vadi seçilirse P = e^(−20/36) ≈ 0,57; şans tutana kadar dener. T çok düşerse (örn. T = 5 → P ≈ 0,02) artık inemez ve **70\'te mahsur** kalır. Sonuç şansa bağlıdır.', null, tSide(5));
      }
    } else {
      add(0, '**Tabu arama.** Başlangıç 60. Kural: durmak yasak; daha iyi komşu yoksa en az kötüsüne git.', null, tabuSide([]));
      add(1, 'En iyi komşu 70 → çıkıldı. Geri dönmemek için 60\'a dönüş hamlesi (1↔2 değişimi) tabu listesine yazılır.', {tabu: [0]}, tabuSide(['1↔2 (60\'a dönüş)']));
      add(1, '70\'te daha iyi komşu yok. Geri dönüş yasak → mecburen 50\'ye (en az kötü olana) inilecek.', {tabu: [0], look: [2]}, tabuSide(['1↔2 (60\'a dönüş)']));
      add(2, 'Vadide (50). Tekrar 70\'e çıkmamak için bu hamle (2↔3) de tabuya eklenir.', {tabu: [0, 1]}, tabuSide(['1↔2', '2↔3 (70\'e dönüş)']));
      add(3, 'Tek açık yol ileri: **100\'e kesin ulaşıldı.** Tabu listesi geri dönüşleri yasakladığı için döngüye girmedi.', {tabu: [0, 1]}, tabuSide(['1↔2', '2↔3']));
    }
    return F;
  }

  // ================================================================ SAÇILIM GRAFİĞİ YARDIMCISI
  function plot(o){
    // o: {w,h,xr:[a,b],yr:[a,b],xl,yl,ticks}
    var w = o.w || 460, h = o.h || 300, L = 48, Rm = 18, Tm = 16, B = 42;
    var sx = function(x){ return L + (x - o.xr[0]) / (o.xr[1] - o.xr[0]) * (w - L - Rm); };
    var sy = function(y){ return h - B - (y - o.yr[0]) / (o.yr[1] - o.yr[0]) * (h - B - Tm); };
    var axes = '<line class="axis" x1="' + L + '" y1="' + (h - B) + '" x2="' + (w - Rm) + '" y2="' + (h - B) + '"/><line class="axis" x1="' + L + '" y1="' + (h - B) + '" x2="' + L + '" y2="' + Tm + '"/>';
    (o.xt || []).forEach(function(t){ axes += '<line class="grid" x1="' + sx(t) + '" y1="' + Tm + '" x2="' + sx(t) + '" y2="' + (h - B) + '"/>' + T(sx(t), h - B + 15, t, 'tk'); });
    (o.yt || []).forEach(function(t){ axes += '<line class="grid" x1="' + L + '" y1="' + sy(t) + '" x2="' + (w - Rm) + '" y2="' + sy(t) + '"/>' + T(L - 7, sy(t) + 4, t, 'tk', ' style="text-anchor:end"'); });
    axes += T((L + w - Rm) / 2, h - 6, o.xl || '', 'cap') + '<text class="cap" transform="translate(13,' + ((Tm + h - B) / 2) + ') rotate(-90)">' + esc(o.yl || '') + '</text>';
    return {sx: sx, sy: sy, wrap: function(body){ return svg(w, h, axes + body, 'plot'); }, w: w, h: h, L: L, Rm: Rm, Tm: Tm, B: B};
  }
  // çizgiyi (a·x + b·y + c = 0) grafiğin kutusuna kırpar
  function lineIn(P, o, a, b, c){
    var pts = [], x0 = o.xr[0], x1 = o.xr[1], y0 = o.yr[0], y1 = o.yr[1];
    if(Math.abs(b) > 1e-9){ [x0, x1].forEach(function(x){ var y = -(a * x + c) / b; if(y >= y0 - 1e-6 && y <= y1 + 1e-6) pts.push([x, y]); }); }
    if(Math.abs(a) > 1e-9){ [y0, y1].forEach(function(y){ var x = -(b * y + c) / a; if(x >= x0 - 1e-6 && x <= x1 + 1e-6) pts.push([x, y]); }); }
    if(pts.length < 2) return '';
    return '<line class="dline" x1="' + r1(P.sx(pts[0][0])) + '" y1="' + r1(P.sy(pts[0][1])) + '" x2="' + r1(P.sx(pts[1][0])) + '" y2="' + r1(P.sy(pts[1][1])) + '"/>';
  }

  // ---------- K-NN
  function knnFrames(){
    var D = [[80, 85, 1], [30, 40, 0], [90, 95, 1], [45, 35, 0], [75, 70, 1]], q = [85, 80], o = {xr: [20, 100], yr: [20, 100], xt: [20, 40, 60, 80, 100], yt: [20, 40, 60, 80, 100], xl: 'derse katılım (%)', yl: 'lab notu'};
    var P = plot(o), dist = D.map(function(p){ return {p: p, d: Math.sqrt(Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2))}; }).sort(function(a, b){ return a.d - b.d; });
    function draw(k, showAll){
      var body = '';
      if(k){ var rad = dist[k - 1].d; var rx = P.sx(q[0] + rad) - P.sx(q[0]), ry = P.sy(q[1]) - P.sy(q[1] + rad); body += '<ellipse class="knnr" cx="' + P.sx(q[0]) + '" cy="' + P.sy(q[1]) + '" rx="' + r1(rx + 6) + '" ry="' + r1(ry + 6) + '"/>'; }
      dist.forEach(function(e, i){ if(showAll || i < k){ body += '<line class="knnl' + (i < k ? ' in' : '') + '" x1="' + P.sx(q[0]) + '" y1="' + P.sy(q[1]) + '" x2="' + P.sx(e.p[0]) + '" y2="' + P.sy(e.p[1]) + '"/>'; if(showAll) body += T((P.sx(q[0]) + P.sx(e.p[0])) / 2 + 4, (P.sy(q[1]) + P.sy(e.p[1])) / 2 - 4, fmt(e.d), 'dl'); } });
      D.forEach(function(p){ body += '<circle class="pt ' + (p[2] ? 'c1' : 'c0') + '" cx="' + P.sx(p[0]) + '" cy="' + P.sy(p[1]) + '" r="7"/>' + T(P.sx(p[0]) + 10, P.sy(p[1]) - 9, '(' + p[0] + ', ' + p[1] + ')', 'pl', ' style="text-anchor:start"'); });
      body += '<rect class="pt q" x="' + (P.sx(q[0]) - 7) + '" y="' + (P.sy(q[1]) - 7) + '" width="14" height="14" rx="3"/>' + T(P.sx(q[0]) - 10, P.sy(q[1]) + 22, 'yeni (85, 80)', 'pl q', ' style="text-anchor:end"');
      body += '<g class="leg"><circle class="pt c1" cx="70" cy="22" r="6"/>' + T(80, 26, 'Geçti', 'pl', ' style="text-anchor:start"') + '<circle class="pt c0" cx="135" cy="22" r="6"/>' + T(145, 26, 'Kaldı', 'pl', ' style="text-anchor:start"') + '</g>';
      return P.wrap(body);
    }
    var vote = function(k){ var g = dist.slice(0, k).filter(function(e){ return e.p[2]; }).length; return g + ' Geçti, ' + (k - g) + ' Kaldı → **' + (g > k - g ? 'Geçti' : 'Kaldı') + '**'; };
    return [
      {svg: draw(0), note: 'Beş öğrencinin katılım ve lab notu, yeşil = Geçti, kırmızı = Kaldı. Yeni öğrenci (kare): katılım %85, lab 80. Sınıfı ne?'},
      {svg: draw(0, true), note: 'Yeni noktadan bütün noktalara **Öklid mesafesi**: √((x₂−x₁)² + (y₂−y₁)²). En yakın: (80, 85) 7,07; sonra (75, 70) 14,14 ve (90, 95) 15,81.'},
      {svg: draw(1), note: '**K = 1:** en yakın tek komşu (80, 85) Geçti → ' + vote(1)},
      {svg: draw(3), note: '**K = 3:** en yakın üç komşunun çoğunluğu: ' + vote(3)},
      {svg: draw(5), note: '**K = 5:** beş komşu: ' + vote(5) + '. Bu veride K ne olursa olsun sonuç Geçti.'}
    ];
  }

  // ---------- K-Means
  function kmeansFrames(){
    var X = [[1.5, 2], [2.2, 1.2], [2.8, 2.6], [1.2, 3.1], [7.5, 2.2], [8.4, 3.1], [8.8, 1.6], [7.2, 3.4], [4.6, 7.8], [5.6, 8.6], [5.2, 7.1], [4.1, 8.4]];
    var C = [[2.2, 1.2], [2.8, 2.6], [1.5, 2]], K = 3, o = {xr: [0, 10], yr: [0, 10], xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10], xl: 'x₁ (örn. gelir)', yl: 'x₂ (örn. harcama)'};
    var P = plot(o), frames = [], asg = X.map(function(){ return -1; });
    function draw(cs, a, prev){
      var body = '';
      if(prev) prev.forEach(function(p, i){ body += '<line class="mv" x1="' + P.sx(p[0]) + '" y1="' + P.sy(p[1]) + '" x2="' + P.sx(cs[i][0]) + '" y2="' + P.sy(cs[i][1]) + '"/>'; });
      X.forEach(function(p, i){ body += '<circle class="pt ' + (a[i] < 0 ? 'cn' : 'k' + a[i]) + '" cx="' + r1(P.sx(p[0])) + '" cy="' + r1(P.sy(p[1])) + '" r="6.5"/>'; });
      cs.forEach(function(c, i){ var x = P.sx(c[0]), y = P.sy(c[1]); body += '<g class="cen k' + i + '"><path d="M' + (x - 8) + ',' + (y - 8) + ' L' + (x + 8) + ',' + (y + 8) + ' M' + (x + 8) + ',' + (y - 8) + ' L' + (x - 8) + ',' + (y + 8) + '"/></g>'; });
      return P.wrap(body);
    }
    var cp = function(c){ return c.map(function(p){ return p.slice(); }); };
    frames.push({svg: draw(C, asg), note: '12 etiketsiz nokta. **1. adım:** K = 3 merkez (X) rastgele seçildi; bilerek kötü seçtik: üçü de sol alttaki gruptan.'});
    for(var it = 1; it <= 8; it++){
      var na = X.map(function(p){ var best = 0, bd = 1e9; C.forEach(function(c, j){ var d = Math.pow(p[0] - c[0], 2) + Math.pow(p[1] - c[1], 2); if(d < bd){ bd = d; best = j; } }); return best; });
      var changed = na.some(function(v, i){ return v !== asg[i]; }); asg = na;
      frames.push({svg: draw(C, asg), note: '**İterasyon ' + it + ' · atama:** her nokta en yakın merkezin rengini aldı.' + (changed ? '' : ' Hiçbir nokta küme değiştirmedi.')});
      if(!changed){ frames[frames.length - 1].note += ' **Merkezler sabit → dur.** Üç doğal grup bulundu.'; break; }
      var prev = cp(C);
      C = C.map(function(c, j){ var m = X.filter(function(p, i){ return asg[i] === j; }); if(!m.length) return c; return [m.reduce(function(s, p){ return s + p[0]; }, 0) / m.length, m.reduce(function(s, p){ return s + p[1]; }, 0) / m.length]; });
      frames.push({svg: draw(C, asg, prev), note: '**İterasyon ' + it + ' · güncelleme:** her merkez kendi kümesindeki noktaların ortalamasına taşındı (kesik çizgi = merkezin yolu).'});
    }
    return frames;
  }

  // ---------- Perceptron kredi
  function percFrames(){
    var D = [['A', 10, 20, 0], ['B', 15, 80, 0], ['C', 70, 15, 0], ['D', 85, 90, 1]], N = [['E', 90, 20], ['F', 60, 80]];
    var o = {xr: [0, 100], yr: [0, 100], xt: [0, 20, 40, 60, 80, 100], yt: [0, 20, 40, 60, 80, 100], xl: 'aylık gelir (bin TL)', yl: 'kredi skoru'}, P = plot(o);
    function draw(w1, w2, b, shownew, shade){
      var body = '';
      if(shade){ // onay bölgesini hafif boya: noktaları ızgarada test et
        for(var x = 0; x <= 100; x += 5) for(var y = 0; y <= 100; y += 5){ if(w1 * x + w2 * y + b >= 0) body += '<rect class="zone" x="' + r1(P.sx(x) - 6) + '" y="' + r1(P.sy(y) - 6) + '" width="12" height="12"/>'; }
      }
      body += lineIn(P, o, w1, w2, b);
      D.forEach(function(p){ var z = w1 * p[1] + w2 * p[2] + b, pred = z >= 0 ? 1 : 0, ok = pred === p[3];
        body += '<circle class="pt ' + (p[3] ? 'c1' : 'c0') + (ok ? '' : ' wrong') + '" cx="' + P.sx(p[1]) + '" cy="' + P.sy(p[2]) + '" r="7"/>' + T(P.sx(p[1]) + 10, P.sy(p[2]) + 4, p[0] + (ok ? '' : ' ✗'), 'pl', ' style="text-anchor:start"'); });
      if(shownew) N.forEach(function(p){ var z = w1 * p[1] + w2 * p[2] + b; body += '<rect class="pt q ' + (z >= 0 ? 'c1' : 'c0') + '" x="' + (P.sx(p[1]) - 7) + '" y="' + (P.sy(p[2]) - 7) + '" width="14" height="14" rx="3"/>' + T(P.sx(p[1]) + 10, P.sy(p[2]) + 4, p[0] + ' (yeni)', 'pl', ' style="text-anchor:start"'); });
      return P.wrap(body);
    }
    return [
      {svg: draw(0, 0, -1), note: 'Geçmiş 4 müşteri: sadece **D** (yüksek gelir, yüksek skor) onay aldı (yeşil). Perceptron bu iki sınıfı ayıran bir doğru arıyor.'},
      {svg: draw(0.23, -0.5, 0.1, false, true), note: 'Başlangıçta rastgele ağırlıklar: w₁ = 0,23, w₂ = −0,5, b = 0,1. Mavi bölge = "onay" dediği yer. **C** yanlışlıkla onaylanıyor, **D** reddediliyor (✗). Hata (loss) büyük → ağırlıklar güncellenecek.'},
      {svg: draw(1, 1, -120, false, true), note: 'Binlerce epoch sonra: w₁ = 1, w₂ = 1, b = −120. Karar doğrusu **Gelir + Skor = 120**. Dört müşterinin hepsi doğru tarafta.'},
      {svg: draw(1, 1, -120, true, true), note: 'Yeni müşteriler: **E** (90, 20): z = −10 → red. **F** (60, 80): z = 20 → onay. Tek bir doğru yetti, çünkü veri **doğrusal ayrılabilir**.'}
    ];
  }

  // ---------- XOR ve MLP
  function xorFrames(){
    var X = [[0, 0, 0], [1, 0, 1], [0, 1, 1], [1, 1, 0]], o = {xr: [-0.3, 1.4], yr: [-0.3, 1.4], xt: [0, 1], yt: [0, 1], xl: 'x₁ (öğrenci)', yl: 'x₂ (emekli)', w: 300, h: 260};
    var oh = {xr: [-0.3, 2.4], yr: [-0.3, 1.4], xt: [0, 1, 2], yt: [0, 1], xl: 'h₁ = ReLU(x₁ + x₂)', yl: 'h₂ = ReLU(x₁ + x₂ − 1)', w: 300, h: 260};
    function inp(line){
      var P = plot(o), body = line ? lineIn(P, o, line[0], line[1], line[2]) : '';
      X.forEach(function(p){ body += '<circle class="pt ' + (p[2] ? 'c1' : 'c0') + '" cx="' + P.sx(p[0]) + '" cy="' + P.sy(p[1]) + '" r="8"/>' + T(P.sx(p[0]) + 11, P.sy(p[1]) - 9, '(' + p[0] + ',' + p[1] + ')', 'pl', ' style="text-anchor:start"'); });
      return P.wrap(body);
    }
    function hid(line){
      var P = plot(oh), body = line ? lineIn(P, oh, 1, -2, -0.5) : '', seen = {};
      X.forEach(function(p){ var h1 = Math.max(0, p[0] + p[1]), h2 = Math.max(0, p[0] + p[1] - 1), k = h1 + ',' + h2; var off = seen[k] ? 14 : 0; seen[k] = 1;
        body += '<circle class="pt ' + (p[2] ? 'c1' : 'c0') + '" cx="' + (P.sx(h1) + off) + '" cy="' + P.sy(h2) + '" r="8"/>' + T(P.sx(h1) + off, P.sy(h2) + (off ? 24 : -12), '(' + p[0] + ',' + p[1] + ')', 'pl'); });
      return P.wrap(body);
    }
    var two = function(a, b){ return '<div class="yza-two">' + a + b + '</div>'; };
    return [
      {svg: inp(), note: 'İndirim örneği = **XOR**. Yeşil (1): sadece öğrenci (1,0) ve sadece emekli (0,1). Kırmızı (0): hiçbiri (0,0) ve ikisi birden (1,1).'},
      {svg: inp([1, 1, -0.5]), note: 'Deneme 1: x₁ + x₂ = 0,5 doğrusu. (0,0) doğru tarafta ama **(1,1)** yeşillerle aynı tarafta kaldı → yanlış.'},
      {svg: inp([1, 1, -1.5]), note: 'Deneme 2: x₁ + x₂ = 1,5. Bu sefer (1,1) ayrıldı ama yeşiller **(0,0)** ile aynı tarafta. Hangi düz çizgiyi çizersen çiz en az bir nokta yanlış kalır: XOR **doğrusal ayrılamaz**.'},
      {svg: two(inp(), hid()), note: 'MLP\'nin gizli katmanı noktaları yeni bir uzaya taşır: h₁ = ReLU(x₁ + x₂), h₂ = ReLU(x₁ + x₂ − 1). (1,0) ve (0,1) aynı noktaya (1, 0) düşer; (1,1) ise (2, 1)\'e gider.'},
      {svg: two(inp(), hid(true)), note: 'Yeni uzayda tek bir doğru yeter: h₁ − 2h₂ = 0,5. Çıktı y = ReLU(h₁ − 2h₂): (0,0) → 0, (1,0) → 1, (0,1) → 1, (1,1) → 2 − 2 = 0. **Gizli katman problemi doğrusal ayrılabilir hâle getirdi.**'}
    ];
  }

  // ---------- Genetik algoritma (sırt çantası)
  function gaFrames(){
    var IT = [['Heykel', 7, 100], ['Kutu', 5, 80], ['Kılıç', 4, 70], ['Saat', 3, 50]];
    var calc = function(b){ var w = 0, v = 0; b.forEach(function(x, i){ if(x){ w += IT[i][1]; v += IT[i][2]; } }); return [w, v]; };
    function chrom(name, b, y, o){
      o = o || {};
      var body = T(16, y + 22, name, 'gname', ' style="text-anchor:start"'), wv = calc(b);
      b.forEach(function(x, i){ var X = 120 + i * 58; body += '<g class="gene' + (x ? ' on' : '') + ((o.flip === i) ? ' flip' : '') + (o.from && o.from[i] ? ' ' + o.from[i] : '') + '"><rect x="' + X + '" y="' + y + '" width="50" height="32" rx="7"/>' + T(X + 25, y + 21, x, 'gb') + '</g>'; });
      if(o.cut) body += '<line class="cut" x1="' + (120 + 2 * 58 - 4) + '" y1="' + (y - 6) + '" x2="' + (120 + 2 * 58 - 4) + '" y2="' + (y + 38) + '"/>';
      if(!o.nofit){ var over = wv[0] > 15; body += T(372, y + 21, wv[0] + ' kg · ' + wv[1] + ' TL', 'gfit' + (over ? ' bad' : o.best ? ' best' : ''), ' style="text-anchor:start"') + (over ? T(500, y + 21, 'sınır dışı', 'gfit bad', ' style="text-anchor:start"') : o.best ? T(500, y + 21, 'en iyi', 'gfit best', ' style="text-anchor:start"') : ''); }
      return body;
    }
    function head(){ var h = ''; IT.forEach(function(t, i){ h += T(145 + i * 58, 16, t[0], 'ghead') + T(145 + i * 58, 30, t[1] + 'kg/' + t[2], 'ghead sm'); }); return h; }
    var S = function(rows, hgt){ return svg(580, hgt || 200, head() + rows); };
    return [
      {svg: S(chrom('Birey A', [1, 1, 0, 0], 44, {nofit: 1}) + chrom('Birey B', [0, 1, 1, 1], 92, {nofit: 1}) + chrom('Birey C', [1, 1, 1, 0], 140, {nofit: 1})), note: '**1. Kodlama ve popülasyon:** her eşya bir gen; çantadaysa 1, değilse 0. Rastgele üç birey (çözüm adayı). Sınır: 15 kg.'},
      {svg: S(chrom('Birey A', [1, 1, 0, 0], 44) + chrom('Birey B', [0, 1, 1, 1], 92) + chrom('Birey C', [1, 1, 1, 0], 140)), note: '**2. Uygunluk:** A 12 kg / 180 TL, B 12 kg / 200 TL, C 16 kg → **sınır dışı**, elenir ya da cezalandırılır.'},
      {svg: S(chrom('Ebeveyn A', [1, 1, 0, 0], 44, {cut: 1}) + chrom('Ebeveyn B', [0, 1, 1, 1], 92, {cut: 1}), 150), note: '**3. Seçim:** en yüksek skorlu ve sınırı aşmayan A ile B ebeveyn seçilir. **4. Çaprazlama:** ikisi 2. genden sonra kesilir.'},
      {svg: S(chrom('Ebeveyn A', [1, 1, 0, 0], 44, {cut: 1, from: ['a', 'a', '', '']}) + chrom('Ebeveyn B', [0, 1, 1, 1], 92, {cut: 1, from: ['', '', 'b', 'b']}) + chrom('Çocuk', [1, 1, 1, 1], 150, {from: ['a', 'a', 'b', 'b']}), 200), note: 'Çocuk ilk iki geni A\'dan, son iki geni B\'den alır: [1,1,1,1]. Ama 19 kg → sınır dışı.'},
      {svg: S(chrom('Çocuk', [1, 1, 1, 1], 44) + chrom('Mutasyon 1', [1, 1, 1, 0], 92, {flip: 3}), 150), note: '**5. Mutasyon:** rastgele bir gen değişir. Son gen 1 → 0: [1,1,1,0] = 16 kg, hâlâ sınır dışı (C ile aynı).'},
      {svg: S(chrom('Çocuk', [1, 1, 1, 1], 44) + chrom('Mutasyon 2', [1, 1, 0, 1], 92, {flip: 2, best: 1}), 150), note: 'Başka bir mutasyon 3. geni 0 yapar: **[1,1,0,1] = heykel + kutu + saat = 15 kg, 230 TL.** Sınırda ve B\'den (200 TL) değerli.'},
      {svg: S(chrom('Birey B', [0, 1, 1, 1], 44) + chrom('En iyi', [1, 1, 0, 1], 92, {best: 1}), 150), note: '**6. Durdurma:** nesiller boyu tekrarlanır. Slayt B\'yi (200 TL) "en iyilerden biri" diye gösteriyor; 16 kombinasyonun hepsini denedim, gerçek en iyi **230 TL**.'}
    ];
  }

  // ---------- K-katlı çapraz doğrulama
  function kfoldFrames(){
    var F = [];
    for(var k = 0; k <= 5; k++){
      var body = '';
      for(var r = 0; r < 5; r++){
        var y = 18 + r * 38, act = k === 0 || r === k - 1;
        body += T(46, y + 20, (r + 1) + '. tur', 'ls' + (act ? '' : ' dim'), ' style="text-anchor:end"');
        for(var c = 0; c < 5; c++){ var isV = c === r; body += '<g class="fold ' + (isV ? 'v' : 't') + (act ? '' : ' dim') + '"><rect x="' + (60 + c * 66) + '" y="' + y + '" width="60" height="28" rx="6"/>' + T(90 + c * 66, y + 19, isV ? 'doğrulama' : 'eğitim') + '</g>'; }
        body += T(400, y + 19, 'skor ' + (r + 1), 'ls' + (act ? '' : ' dim'), ' style="text-anchor:start"');
      }
      body += '<g class="fold test"><rect x="470" y="18" width="76" height="180" rx="8"/>' + T(508, 102, 'TEST', 'tt') + T(508, 120, '%20', 'tt sm') + T(508, 136, 'en sona', 'tt sm') + '</g>';
      F.push({svg: svg(560, 210, body), note: k === 0 ? 'Verinin %20\'si **test** için kenara ayrılır. Kalan %80 beş eşit parçaya (fold) bölünür. Her turda bir parça doğrulama, dördü eğitim.' : k < 5 ? '**' + k + '. tur:** model 4 parçada eğitilir, ' + k + '. parçada ölçülür → skor ' + k + '.' : '**5. tur** biter. Performans = 5 skorun ortalaması. Her örnek bir kez doğrulamada kullanıldı; tek seferlik bölmenin şans etkisi gider. Model hazır olunca bir kez test edilir.'});
    }
    return F;
  }

  // ---------- aktivasyon fonksiyonları
  function actFrames(){
    var o = {xr: [-6, 6], yr: [-0.2, 1.2], xt: [-6, -4, -2, 0, 2, 4, 6], yt: [0, 0.5, 1], xl: 'x', yl: 'f(x)'}, oR = {xr: [-6, 6], yr: [-1, 6], xt: [-6, -4, -2, 0, 2, 4, 6], yt: [0, 2, 4, 6], xl: 'x', yl: 'f(x)'};
    function curve(op, f, cls){ var P = plot(op), d = ''; for(var i = 0; i <= 240; i++){ var x = op.xr[0] + (op.xr[1] - op.xr[0]) * i / 240, y = Math.max(op.yr[0], Math.min(op.yr[1], f(x))); d += (i ? 'L' : 'M') + r1(P.sx(x)) + ',' + r1(P.sy(y)); } return P.wrap('<path class="fx ' + cls + '" d="' + d + '"/>'); }
    return [
      {svg: curve(o, function(x){ return x >= 0 ? 1 : 0; }, 'a'), note: '**Sert adım (step):** x ≥ 0 ise 1, değilse 0. Perceptron bunu kullanır. Sıçrama noktasında türevi yok; bu yüzden geri yayılımla eğitilemez.'},
      {svg: curve(o, function(x){ return 1 / (1 + Math.exp(-x)); }, 'b'), note: '**Sigmoid:** 1 / (1 + e^(−x)). Çıktı yumuşakça 0 ile 1 arasında; (0; 0,5) noktasından geçer. Türevlenebilir, olasılık gibi yorumlanır.'},
      {svg: curve(oR, function(x){ return Math.max(0, x); }, 'c'), note: '**ReLU:** max(0, x). Negatif girişi 0 yapar, pozitifi olduğu gibi geçirir. Hesabı çok ucuz; derin ağlarda en yaygın aktivasyon. XOR çözümündeki gizli katman bunu kullanıyor.'}
    ];
  }

  // ================================================================ OYNATICI
  function player(el, frames, cfg){
    var i = 0, timer = null;
    var algs = cfg.algs && cfg.algs.length > 1 ? '<div class="yza-algs" role="group" aria-label="Algoritma">' + cfg.algs.map(function(a){ return '<button type="button" data-a="' + a + '"' + (a === cfg.alg ? ' aria-pressed="true"' : '') + '>' + esc(ALG[a] || a) + '</button>'; }).join('') + '</div>' : '';
    el.innerHTML = (cfg.title ? '<div class="yza-title">' + tx(cfg.title) + '</div>' : '') + algs +
      '<div class="yza-draw"></div><div class="yza-side"></div><div class="anim-note yza-note"></div>' +
      '<div class="yza-ctl"><button class="btn" type="button" data-c="first" aria-label="Başa">⏮</button><button class="btn" type="button" data-c="prev">◀ Geri</button>' +
      '<button class="btn primary" type="button" data-c="play">▶ Oynat</button><button class="btn" type="button" data-c="next">İleri ▶</button><span class="anim-step"></span></div>';
    var draw = el.querySelector('.yza-draw'), side = el.querySelector('.yza-side'), note = el.querySelector('.yza-note'), step = el.querySelector('.anim-step'), playB = el.querySelector('[data-c="play"]');
    function show(){
      var f = frames[i];
      draw.innerHTML = f.svg; side.innerHTML = f.side || ''; side.hidden = !f.side; note.innerHTML = tx(f.note);
      step.textContent = 'Adım ' + (i + 1) + ' / ' + frames.length;
      el.querySelector('[data-c="prev"]').disabled = i === 0; el.querySelector('[data-c="first"]').disabled = i === 0; el.querySelector('[data-c="next"]').disabled = i === frames.length - 1;
    }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } playB.textContent = '▶ Oynat'; }
    el.querySelector('.yza-ctl').addEventListener('click', function(e){
      var c = e.target.dataset.c; if(!c) return;
      if(c === 'play'){ if(timer){ stop(); return; } if(i === frames.length - 1) i = 0; show(); playB.textContent = '⏸ Durdur';
        timer = setInterval(function(){ if(i >= frames.length - 1 || !el.isConnected || el.offsetParent === null){ stop(); return; } i++; show(); }, cfg.speed || 1700); return; }
      stop();
      if(c === 'first') i = 0; else if(c === 'prev') i = Math.max(0, i - 1); else if(c === 'next') i = Math.min(frames.length - 1, i + 1);
      show();
    });
    if(algs) el.querySelector('.yza-algs').addEventListener('click', function(e){
      var a = e.target.dataset.a; if(!a) return;
      stop(); cfg.alg = a; frames = build(cfg); i = 0;
      el.querySelectorAll('.yza-algs button').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.a === a ? 'true' : 'false'); });
      show();
    });
    if(cfg.end) i = frames.length - 1;
    show();
  }

  // ---------- etkileşimli: tavlama olasılığı
  function saProb(el){
    el.innerHTML = '<div class="yza-title">Kötü hamleyi kabul olasılığı: P = e<sup>−|ΔE|/T</sup></div>' +
      '<div class="yza-sl"><label>Kalite kaybı |ΔE| <b data-o="e"></b><input type="range" min="1" max="60" value="20" data-i="e"></label>' +
      '<label>Sıcaklık T <b data-o="t"></b><input type="range" min="1" max="100" value="40" data-i="t"></label></div>' +
      '<div class="yza-bar"><span></span></div><div class="anim-note yza-note"></div>';
    function upd(){
      var e = +el.querySelector('[data-i="e"]').value, t = +el.querySelector('[data-i="t"]').value, p = Math.exp(-e / t);
      el.querySelector('[data-o="e"]').textContent = e; el.querySelector('[data-o="t"]').textContent = t;
      el.querySelector('.yza-bar span').style.width = (p * 100).toFixed(1) + '%';
      el.querySelector('.yza-note').innerHTML = tx('P = e^(−' + e + '/' + t + ') = e^(−' + fmt(e / t) + ') ≈ **' + fmt(p) + '** (%' + Math.round(p * 100) + '). ' + (p > .5 ? 'Sıcaklık yüksek: kötü hamle çoğu zaman kabul edilir (keşif).' : p > .1 ? 'Orta: bazen kabul edilir.' : 'Soğudu: kötü hamle neredeyse hiç kabul edilmez (yerleşme).'));
    }
    el.addEventListener('input', upd); upd();
  }

  // ================================================================ KURULUM
  function build(cfg){
    switch(cfg.t){
      case 'search': return searchFrames(GRAPHS[cfg.g], cfg.alg);
      case 'tree': return treeFrames(TREES[cfg.g], cfg.alg);
      case 'expand': return expandFrames();
      case 'local': return localFrames(cfg.alg);
      case 'knn': return knnFrames();
      case 'kmeans': return kmeansFrames();
      case 'perc': return percFrames();
      case 'xor': return xorFrames();
      case 'ga': return gaFrames();
      case 'kfold': return kfoldFrames();
      case 'act': return actFrames();
    }
    return [{svg: '', note: 'Bilinmeyen animasyon: ' + cfg.t}];
  }
  function mount(el){
    if(el.dataset.ready) return;
    el.dataset.ready = '1';
    var cfg; try{ cfg = JSON.parse(el.dataset.cfg); }catch(e){ return; }
    if(cfg.t === 'saprob'){ saProb(el); return; }
    if(cfg.static){ // sadece şekil (soru metninde)
      var G = GRAPHS[cfg.g];
      el.innerHTML = '<div class="yza-draw">' + (G ? drawGraph(G, {showH: cfg.h}) : treeDraw(TREES[cfg.g], {})) + '</div>' + (cfg.cap ? '<p class="yza-cap">' + tx(cfg.cap) + '</p>' : '');
      el.classList.add('static');
      return;
    }
    player(el, build(cfg), cfg);
  }
  window.YZA = {build: build, mount: function(root){ Array.prototype.forEach.call((root || document).querySelectorAll('.yza[data-cfg]'), mount); }};
  window.YZA.mount();
})();
