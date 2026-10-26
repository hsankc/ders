// Veri Yapıları sayfası: görünüm yönlendirme, C sözlüğü, kod anlatımı ve animasyon listesi
(function(){
  var REPO = 'https://github.com/hsankc/ders/blob/main/';
  var K = 'kaynaklar/veri-yapilari/kod/';
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var CS = window.VY_C || [], KOD = window.VY_KOD || [], ANIMS = window.VY_ANIMS || [];
  var hl = window.VY_HL || function(s){ return esc(s); };
  var fileById = {}, animById = {};
  KOD.forEach(function(f){ fileById[f.id] = f; });
  ANIMS.forEach(function(a){ animById[a.id] = a; });

  // ---------- C dosyasını üst düzey parçalara böl: fonksiyonlar, struct'lar ve aradaki satırlar
  function chunks(src){
    var L = src.split('\n'), n = L.length, out = [], depth = 0, inC = false, defStart = -1, last = 0;
    function bare(line){ // yorum ve dizeler çıkarılmış satır
      var s = '', i = 0;
      while(i < line.length){
        if(inC){ var e = line.indexOf('*/', i); if(e < 0) return s; i = e + 2; inC = false; continue; }
        var c = line[i], d = line[i + 1];
        if(c === '/' && d === '*'){ inC = true; i += 2; continue; }
        if(c === '/' && d === '/') return s;
        if(c === '"' || c === "'"){ var j = i + 1; while(j < line.length && line[j] !== c){ if(line[j] === '\\') j++; j++; } i = j + 1; s += ' '; continue; }
        s += c; i++;
      }
      return s;
    }
    var B = L.map(bare);
    var isComment = function(i){ var t = L[i].trim(); return /^(\/\/|\/\*|\*)/.test(t) || /\*\/$/.test(t); };
    function misc(a, z){
      while(a <= z && !L[a].trim()) a++;
      while(z >= a && !L[z].trim()) z--;
      if(a <= z) out.push({name:null, from:a, to:z});
    }
    for(var i = 0; i < n; i++){
      for(var k = 0; k < B[i].length; k++){
        var ch = B[i][k];
        if(ch === '{'){
          if(depth === 0){
            var h = i; // imzanın başı: ; } { ile biten ya da # ile başlayan satıra kadar geri git, üstteki yorumu da al
            while(h > last && B[h - 1].trim() && !/[;}{]\s*$/.test(B[h - 1]) && !/^\s*#/.test(L[h - 1])) h--;
            while(h > last && L[h - 1].trim() && isComment(h - 1)) h--;
            defStart = h;
          }
          depth++;
        } else if(ch === '}' && depth > 0){
          depth--;
          if(depth === 0 && defStart >= 0){
            if(defStart > last) misc(last, defStart - 1);
            var head = B.slice(defStart, i + 1).join(' '), pre = head.slice(0, head.indexOf('{')), m, nm = null;
            if((m = /^\s*(?:typedef\s+)?struct\s+(\w+)\s*$/.exec(pre))) nm = 'struct ' + m[1];
            else if(pre.indexOf('(') >= 0 && (m = /([A-Za-z_]\w*)\s*$/.exec(pre.slice(0, pre.indexOf('('))))) nm = m[1];
            out.push({name:nm, from:defStart, to:i, head:pre});
            last = i + 1; defStart = -1;
          }
        }
      }
    }
    if(last < n) misc(last, n - 1);
    out.forEach(function(c){ c.body = B.slice(c.from, c.to + 1).join('\n'); c.raw = L.slice(c.from, c.to + 1).join('\n'); });
    return out;
  }
  window.VY_CHUNKS = chunks;
  if(typeof document === 'undefined') return;

  // ---------- C sözlüğü
  var cIdx = {}; CS.forEach(function(e, i){ cIdx[e[1]] = i; });
  // koddaki kelimenin üzerine gelince kısa anlamı
  var WORD = {};
  CS.forEach(function(e){ e[1].split(/[\s\/(]+/).forEach(function(w){ if(/^#?[A-Za-z_]+$/.test(w) && !/^(int|char|ve|Stack|heap|main)$/.test(w) && !WORD[w]) WORD[w] = e[2]; }); });
  function tips(root){ root.querySelectorAll('.kw,.fn').forEach(function(s){ var t = WORD[s.textContent]; if(t) s.title = t; }); }

  function cEntry(e, i){
    return '<article class="centry" id="c-' + i + '"><h3><code>' + esc(e[1]) + '</code></h3><p>' + esc(e[2]) + '</p>' +
      '<div class="lbl-sm">Nasıl yazılır</div><pre class="code hl">' + hl(e[3]) + '</pre>' +
      '<div class="lbl-sm">Derste</div><p class="c-ex">' + esc(e[4]) + '</p>' +
      (e[5] ? '<p class="fn-note"><b>Dikkat:</b> ' + esc(e[5]) + '</p>' : '') + '</article>';
  }
  (function buildC(){
    var box = document.getElementById('c-list'); if(!box) return;
    var groups = [];
    CS.forEach(function(e, i){ var g = groups[groups.length - 1]; if(!g || g.name !== e[0]) groups.push(g = {name:e[0], items:[]}); g.items.push([e, i]); });
    box.innerHTML = groups.map(function(g){ return '<div class="section c-grp"><div class="section-title"><h2>' + esc(g.name) + '</h2></div><div class="grid wide">' + g.items.map(function(x){ return cEntry(x[0], x[1]); }).join('') + '</div></div>'; }).join('');
    tips(box);
    var q = document.getElementById('c-q');
    q.addEventListener('input', function(){
      var s = q.value.trim().toLocaleLowerCase('tr');
      box.querySelectorAll('.centry').forEach(function(el){ el.hidden = !!s && el.textContent.toLocaleLowerCase('tr').indexOf(s) < 0; });
      box.querySelectorAll('.c-grp').forEach(function(g){ g.hidden = !g.querySelector('.centry:not([hidden])'); });
    });
  })();

  // ---------- bir parçada geçen C ifadeleri
  var noArgv = function(t){ return t.replace(/char\s*\*\*\s*argv/g, ''); };
  var DET = [
    ['malloc', /\bmalloc\s*\(/], ['realloc', /\brealloc\s*\(/], ['free', /\bfree\s*\(/], ['sizeof', /\bsizeof\b/], ['exit(1)', /\bexit\s*\(/],
    ['** ve *** (işaretçiye işaretçi)', function(t){ return /\*\*/.test(noArgv(t)); }],
    ['-> (ok)', /->/], ['. (nokta)', function(t){ return /[\]A-Za-z_]\.[A-Za-z_]/.test(t.replace(/^\s*#.*$/mg, '')); }],
    ['& (adres alma)', /(^|[^&\w)\]])&(?!&)\s*[A-Za-z_(]/m], ['* (işaretçi tanımı)', /\b(int|char|void|struct\s+\w+)\s*\*+\s*\w/],
    ['İşaretçi aritmetiği', /\*\s*\(\s*\*?\s*\w+\s*\+/], ['int (*p)[4]', /\(\s*\*\s*\w+\s*\)\s*\[/], ['NULL', /\bNULL\b/],
    ['struct', function(t, c){ return !!c.name && c.name.indexOf('struct ') === 0; }],
    ['Kendini gösteren yapı', function(t, c){ return !!c.name && c.name.indexOf('struct ') === 0 && t.indexOf(c.name + ' *') > 0; }],
    ['Değerle ve adresle gönderme', function(t, c){ return !!c.head && /\*\*/.test(noArgv(c.head)); }],
    ['Özyineleme (recursion)', function(t, c){ return !!c.name && c.name.indexOf('struct') !== 0 && c.name !== 'main' && new RegExp('\\b' + c.name + '\\s*\\(').test(t.slice(t.indexOf('{'))); }],
    ['if / else', /\bif\s*\(/], ['while', /\bwhile\s*\(/], ['for', /\bfor\s*\(/], ['break / continue / return', /\b(break|continue)\b/],
    ['&& ve || (kısa devre)', /&&|\|\|/], ['printf', /\bprintf\s*\(/], ['rand / srand / time', /\b(rand|srand)\s*\(/],
    ['va_list (değişken sayıda argüman)', /va_list/], ['#include', /#include/], ['#define', /#define/],
    ['Prototip ve .h dosyası', function(t, c){ return !c.name && /^\s*[A-Za-z_][\w\s\*]*\([^)]*\)\s*;\s*$/m.test(t); }],
    ['int main(int argc, char** argv)', function(t, c){ return c.name === 'main'; }]
  ];
  function detect(c){
    var t = c.body;
    return DET.filter(function(d){ return cIdx[d[0]] != null && (typeof d[1] === 'function' ? d[1](t, c) : d[1].test(t)); }).map(function(d){ return cIdx[d[0]]; });
  }
  function chipsHtml(list){
    if(!list.length) return '';
    return '<div class="chips"><span class="lbl-sm">Bu kodda geçen C ifadeleri</span>' + list.map(function(i){ return '<button type="button" class="chip" aria-pressed="false" data-c="' + i + '">' + esc(CS[i][1]) + '</button>'; }).join('') + '</div><div class="cpop" hidden></div>';
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest('button.chip[data-c]'); if(!b) return;
    var row = b.parentNode, pop = row.nextElementSibling, on = b.getAttribute('aria-pressed') === 'true';
    row.querySelectorAll('.chip').forEach(function(x){ x.setAttribute('aria-pressed', 'false'); });
    if(on){ pop.hidden = true; return; }
    var en = CS[+b.dataset.c];
    b.setAttribute('aria-pressed', 'true');
    pop.innerHTML = '<b><code>' + esc(en[1]) + '</code></b><p>' + esc(en[2]) + '</p><pre class="code hl">' + hl(en[3]) + '</pre>' + (en[5] ? '<p class="muted"><b>Dikkat:</b> ' + esc(en[5]) + '</p>' : '') + '<a href="#c">Bütün C sözlüğü →</a>';
    pop.hidden = false;
  });

  // ---------- kod anlatımı
  function animsOf(f){ return ANIMS.filter(function(a){ return a.file === f.id || (f.anim || []).indexOf(a.id) >= 0; }); }
  function animCode(a){ if(typeof a.code !== 'function') return a.code; var p = {}; a.inputs.forEach(function(x){ p[x[0]] = x[2]; }); return a.code(p); }
  function animsFor(f, name){
    var re = new RegExp('\\b' + name.replace(/\s+/g, '\\s+') + '\\s*\\([^;]*\\)\\s*\\{');
    return animsOf(f).filter(function(a){ return re.test(animCode(a)); });
  }
  function explain(f, name){
    if(f.fns && f.fns[name]) return {e:f.fns[name]};
    var other = KOD.filter(function(o){ return o !== f && o.fns && o.fns[name]; })
      .sort(function(a, b){ return Math.abs(a.week - f.week) - Math.abs(b.week - f.week); })[0];
    return other ? {e:other.fns[name], from:other} : null;
  }
  function miscInfo(t){
    if(/#ifndef/.test(t)) return ['Başlık koruması ve prototipler', '#ifndef … #define … #endif aynı başlık dosyası iki kez eklenirse içeriğin tekrar tanımlanmasını engeller. Aradaki satırlar prototiplerdir: fonksiyonun adı, dönüş tipi ve parametreleri; gövdesi .c dosyasında.'];
    if(/#include/.test(t)) return ['Dosyanın başı', '#include ile kütüphaneler eklenir, #define ile sabitler tanımlanır. Ardından gelen satırlar varsa fonksiyon prototipleridir: gövdesi aşağıda yazılan fonksiyonlar önceden duyurulur.'];
    if(!t.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/mg, '').trim()) return ['Yorum satırları', 'Derleyici yorumları görmez. Hocanın denediği alternatif kodlar ve notlar burada duruyor.'];
    if(/\)\s*;/.test(t)) return ['Fonksiyon prototipleri', 'Gövdesi sonra yazılan fonksiyonların adı ve parametreleri önceden duyuruluyor.'];
    return ['Diğer satırlar', ''];
  }
  function buildKodView(f){
    var sec = document.createElement('section');
    sec.className = 'view'; sec.dataset.view = 'k-' + f.id; sec.hidden = true;
    var an = animsOf(f);
    sec.innerHTML = '<a class="back" href="#kod">← Bütün kodlar</a>' +
      '<div class="view-head"><span class="label">Hafta ' + f.week + ' · ' + esc(f.path) + '</span><h1>' + esc(f.title) + '</h1><p class="muted" style="max-width:70ch">' + esc(f.intro) + '</p></div>' +
      '<div class="chips kod-top">' + an.map(function(a){ return '<a class="chip anim" href="#' + a.id + '">▶ ' + esc(a.title) + '</a>'; }).join('') +
      '<a class="chip" href="' + REPO + K + f.path + '" target="_blank" rel="noopener">GitHub\'da aç</a><a class="chip" href="' + K + f.path + '" download>Dosyayı indir</a></div>' +
      '<div class="konu-nav" data-toc></div><div class="kod-body" data-body><p class="muted">Yükleniyor…</p></div>';
    sec.addEventListener('click', function(e){
      var b = e.target.closest('[data-goto]'); if(!b) return;
      var t = sec.querySelector('[data-i="' + b.dataset.goto + '"]');
      if(t){ if(t.tagName === 'DETAILS') t.open = true; t.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
    return sec;
  }
  function renderKod(f, sec, src){
    var parts = chunks(src), toc = [], html = '';
    parts.forEach(function(c, i){
      var rng = 'satır ' + (c.from + 1) + (c.to > c.from ? '–' + (c.to + 1) : '');
      var chips = chipsHtml(detect(c)), code = '<pre class="code hl">' + hl(c.raw, c.from + 1) + '</pre>';
      if(!c.name){
        var mi = miscInfo(c.raw);
        toc.push('<button type="button" class="dim" data-goto="' + i + '">' + esc(mi[0]) + '</button>');
        html += '<details class="fn-misc" data-i="' + i + '"><summary>' + esc(mi[0]) + ' <span class="muted">· ' + rng + '</span></summary>' + (mi[1] ? '<p class="muted">' + esc(mi[1]) + '</p>' : '') + chips + code + '</details>';
        return;
      }
      var ex = explain(f, c.name), an = animsFor(f, c.name);
      toc.push('<button type="button" data-goto="' + i + '">' + esc(c.name) + '</button>');
      html += '<article class="fn-card" data-i="' + i + '"><div class="fn-head"><h3><code>' + esc(c.name) + '</code></h3><span class="muted">' + rng + '</span></div>';
      if(ex){
        var e = ex.e;
        if(e[0]) html += '<p class="fn-what">' + esc(e[0]) + '</p>';
        if(e[1] && e[1].length) html += '<ol class="fn-steps">' + e[1].map(function(s){ return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>';
        if(e[2]) html += '<p class="fn-note"><b>Dikkat:</b> ' + esc(e[2]) + '</p>';
        if(ex.from) html += '<p class="muted" style="font-size:.88rem">Aynı fonksiyon <a href="#k-' + ex.from.id + '">' + esc(ex.from.title) + '</a> dosyasında da var; açıklama oradan.</p>';
      }
      if(an.length) html += '<div class="chips">' + an.map(function(a){ return '<a class="chip anim" href="#' + a.id + '">▶ Animasyonu izle: ' + esc(a.title) + '</a>'; }).join('') + '</div>';
      html += chips + code + '</article>';
    });
    sec.querySelector('[data-toc]').innerHTML = '<span class="lbl-sm" style="margin:0 4px 0 0">Bu dosyada</span>' + toc.join('');
    var body = sec.querySelector('[data-body]');
    body.innerHTML = html;
    tips(body);
  }
  var kodViews = {};
  var main = document.querySelector('main');
  KOD.forEach(function(f){ var s = buildKodView(f); main.appendChild(s); kodViews[f.id] = s; });
  function openKod(f){
    var sec = kodViews[f.id];
    if(sec.dataset.loaded) return;
    sec.dataset.loaded = '1';
    fetch(K + f.path).then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); })
      .then(function(t){ renderKod(f, sec, t.replace(/\r\n?/g, '\n').replace(/\t/g, '    ')); })
      .catch(function(){ delete sec.dataset.loaded; sec.querySelector('[data-body]').innerHTML = '<p class="muted">Dosya burada açılamadı. <a href="' + REPO + K + f.path + '" target="_blank" rel="noopener">GitHub\'da aç</a></p>'; });
  }

  // ---------- liste sayfaları
  var WEEKN = {1:'Diziler', 2:'Matris ve dinamik bellek', 3:'Bağlı listeler', 4:'Yığın', 5:'İkili arama ağacı', 6:'Heap'};
  function byWeek(list){ var g = {}; list.forEach(function(x){ (g[x.week] = g[x.week] || []).push(x); }); return Object.keys(g).sort().map(function(w){ return [w, g[w]]; }); }
  var ki = document.getElementById('kod-index');
  if(ki) ki.innerHTML = byWeek(KOD).map(function(g){
    return '<div class="section"><div class="section-title"><h2>Hafta ' + g[0] + ' · ' + WEEKN[g[0]] + '</h2></div><div class="grid">' + g[1].map(function(f){
      var nf = Object.keys(f.fns || {}).length, na = animsOf(f).length;
      return '<a class="card" href="#k-' + f.id + '"><span class="label">' + esc(f.path.split('/').pop()) + '</span><h3>' + esc(f.title) + '</h3><p class="desc">' + esc(f.intro.split('. ')[0].replace(/\.$/, '')) + '.</p>' +
        '<div class="foot"><span class="meta">' + (f.extra ? 'Yardımcı dosya' : nf + ' parça açıklamalı') + (na ? ' · ' + na + ' animasyon' : '') + '</span><span class="go">Aç →</span></div></a>';
    }).join('') + '</div></div>';
  }).join('');
  var ai = document.getElementById('anim-index');
  if(ai) ai.innerHTML = byWeek(ANIMS).map(function(g){
    return '<div class="section"><div class="section-title"><h2>Hafta ' + g[0] + ' · ' + WEEKN[g[0]] + '</h2></div><div class="grid">' + g[1].map(function(a){
      return '<a class="card" href="#' + a.id + '"><span class="label">Animasyon</span><h3>' + esc(a.title) + '</h3><p class="desc">' + esc(a.desc) + '</p><div class="foot"><span class="meta">Kendi verinle oynatabilirsin</span><span class="go">▶ Oynat</span></div></a>';
    }).join('') + '</div></div>';
  }).join('');

  // her haftanın konusunun başına o haftanın kodları ve animasyonları
  [1, 2, 3, 4, 5, 6].forEach(function(w){
    var sec = document.querySelector('[data-view="h' + w + '"] .read > section'); if(!sec) return;
    var fs = KOD.filter(function(f){ return f.week === w && !f.extra; });
    var as = ANIMS.filter(function(a){ return a.week === w || fs.some(function(f){ return (f.anim || []).indexOf(a.id) >= 0; }); });
    if(!fs.length && !as.length) return;
    var box = document.createElement('div');
    box.className = 'kod-week';
    box.innerHTML = (fs.length ? '<div class="chips"><span class="lbl-sm">Bu haftanın kodları</span>' + fs.map(function(f){ return '<a class="chip" href="#k-' + f.id + '">' + esc(f.title) + '</a>'; }).join('') + '</div>' : '') +
      (as.length ? '<div class="chips"><span class="lbl-sm">Animasyonlar</span>' + as.map(function(a){ return '<a class="chip anim" href="#' + a.id + '">▶ ' + esc(a.title) + '</a>'; }).join('') + '</div>' : '');
    var head = sec.querySelector('.sec-head');
    if(head) head.insertAdjacentElement('afterend', box); else sec.insertBefore(box, sec.firstChild);
  });

  // ---------- yönlendirme
  function route(){
    var id = location.hash.slice(1);
    if(!/^[\w-]+$/.test(id)) id = '';
    if(id.indexOf('k-') === 0 && fileById[id.slice(2)]) openKod(fileById[id.slice(2)]);
    var v = id && document.querySelector('[data-view="' + id + '"]') ? id : 'home';
    if(window.VY_ANIM_STOP) window.VY_ANIM_STOP();
    document.querySelectorAll('.view').forEach(function(el){ el.hidden = el.dataset.view !== v; });
    if(window.VY_ANIM_OPEN) window.VY_ANIM_OPEN(animById[v] ? v : null);
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
