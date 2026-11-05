(function(){
  var PLAN = [
    {id:1, t:"Temel kavramlar ve veri toplama", sub:"NLP nedir, pipeline, corpus ve treebank, crawling, IR, kütüphaneler"},
    {id:2, t:"Metin ön işleme", sub:"Tokenization, normalizasyon, stopword, stemming ve lemmatization, BOW, TF-IDF, Word2Vec"},
    {id:3, t:"re, morfoloji ve otomatlar", sub:"Regular expression, morfolojik analiz, DFA, NFA, transducer (FST)"},
    {id:4, t:"Dil modelleri", sub:"Unigram, bigram, n-gram, otomatik tamamlama, Transformer, LLM, RAG"},
    {id:5, t:"Sözdizimi ve anlam", sub:"POS tagging (HMM), parser, constituency ve dependency, NER, semantik, sentiment"},
    {id:6, t:"MNIST ve metrikler", sub:"Binary ve multiclass, fit ve predict, accuracy, precision, recall, F1, confusion matrix, PR, ROC-AUC"},
    {id:7, t:"Azure Language Services", sub:"Çıkmışta 10 soru vardı: Text Analytics, NER, LUIS, Translator, Language Studio"},
    {id:8, t:"Deneme: çıkmış sınav", sub:"Geçen yılın 30 çoktan seçmeli sorusu, cevap ve açıklamalarıyla"}
  ];
  var B = {}; (window.NLP_B || []).forEach(function(b){ B[b.id] = b; });
  var KEY = 'vh.nlp.v1', L = 'ABCD';
  var st = {}; try { st = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch(e) { st = {}; }
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {} }
  function S(id){ if(!st[id]) st[id] = {a:{}, s:{}, i:0, ph:'c'}; return st[id]; }
  function nm(s){ return String(s).replace(/İ/g,'i').replace(/I/g,'ı').toLowerCase()
    .replace(/[çğıöşü]/g, function(c){ return {'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u'}[c]; })
    .replace(/[^a-z0-9]/g,''); }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function score(b){ var s = st[b.id]; if(!s) return null;
    var n = 0, ok = 0; b.C.forEach(function(c,j){ if(s.a[j] !== undefined){ n++; if(s.a[j] === c.a) ok++; } });
    (b.S||[]).forEach(function(q,j){ if(s.s[j]){ n++; if(s.s[j].ok) ok++; } });
    return n ? {n:n, ok:ok, tot:b.C.length + (b.S||[]).length} : null; }

  var toastT;
  function toast(msg){ var t = document.getElementById('nlp-toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function(){ t.hidden = true; }, 3200); }
  function copy(text){
    function fb(){ var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'absolute'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(ta); toast(ok ? 'Kopyalandı. Claude\'a yapıştır.' : 'Kopyalanamadı. Şunu yaz: ' + text); }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ toast('Kopyalandı. Claude\'a yapıştır.'); }, fb);
    } else fb();
  }

  function home(){
    document.getElementById('nlp-bolumler').innerHTML = PLAN.map(function(p){
      var b = B[p.id];
      if(!b) return '<div class="card dim"><span class="label">Bölüm ' + p.id + '</span><h3>' + esc(p.t) + '</h3><p class="desc">' + esc(p.sub) +
        '</p><div class="foot"><span class="tag wait">Hazırlanıyor</span></div></div>';
      var sc = score(b), tot = b.C.length + (b.S||[]).length;
      var tag = sc ? '<span class="tag ' + (sc.n === sc.tot ? 'ok' : 'accent') + '">' + sc.ok + '/' + sc.tot + ' doğru' + (sc.n < sc.tot ? ' · devam ediyor' : '') + '</span>'
                   : '<span class="tag">' + b.C.length + ' kart · ' + (b.S||[]).length + ' kısa cevap</span>';
      return '<a class="card" href="#b' + p.id + '"><span class="label">Bölüm ' + p.id + '</span><h3>' + esc(b.t || p.t) + '</h3><p class="desc">' + esc(b.sub || p.sub) +
        '</p><div class="foot">' + tag + '<span class="go">' + (sc ? 'Devam →' : 'Başla →') + '</span></div></a>';
    }).join('');
  }

  var cur = null;
  function dots(b, s){
    return '<div class="nlp-dots">' + b.C.map(function(c,j){
      var cls = (s.ph === 'c' && j === s.i) ? 'on' : s.a[j] === undefined ? '' : s.a[j] === c.a ? 'ok' : 'no';
      return '<span class="' + cls + '"></span>'; }).join('') +
      ((b.S && b.S.length) ? '<span class="' + (s.ph === 's' ? 'on' : s.ph === 'e' ? 'ok' : '') + ' sq"></span>' : '') + '</div>';
  }
  function draw(){
    var b = cur, s = S(b.id), el = document.getElementById('nlp-run'); save();
    var head = '<div class="nlp-top"><span class="muted">', html;
    if(s.ph === 'c'){
      var c = b.C[s.i], a = s.a[s.i], has = a !== undefined, ok = a === c.a;
      html = head + 'Kart ' + (s.i + 1) + ' / ' + b.C.length + '</span>' + dots(b, s) + '</div>' +
        '<div class="qz nlp-card"><div><span class="nlp-k">' + esc(c.k) + '</span>' + (c.tag ? '<span class="nlp-tag">' + esc(c.tag) + '</span>' : '') + '</div>' +
        (c.d ? '<p>' + esc(c.d) + '</p>' : '') + (c.ex ? '<div class="nlp-ex' + (c.code ? ' mono' : '') + '">' + esc(c.ex) + '</div>' : '') +
        '<p class="nlp-q">' + esc(c.q) + '</p><div class="opts">' + c.o.map(function(o,j){
          var cls = has ? (j === c.a ? ' right' : j === a ? ' wrong' : '') : '';
          return '<button class="opt' + cls + '" type="button" data-j="' + j + '"' + (has ? ' disabled' : '') + '><b>' + L[j] + ')</b><span>' + esc(o) + '</span></button>'; }).join('') + '</div>' +
        (has ? '<div class="nlp-fb ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? 'Doğru.' : 'Değil, cevap ' + L[c.a] + '.') + '</b> ' + esc(c.w) + '</div>' : '') +
        '</div><div class="nlp-err" id="nlp-err"></div>' +
        '<div class="nlp-nav"><button class="btn" type="button" data-act="bk"' + (s.i === 0 ? ' disabled' : '') + '>← Geri</button>' +
        '<button class="btn" type="button" data-act="dk">Bu kartı anlamadım (kopyala)</button>' +
        '<button class="btn primary" type="button" data-act="nx">Sonraki →</button></div>';
    } else if(s.ph === 's'){
      html = head + 'Kısa cevap turu</span>' + dots(b, s) + '</div>' +
        '<div class="qz nlp-card"><div><span class="nlp-k">Kısa cevap</span><span class="nlp-tag">Sınavdaki 1–2 kelimelik sorular gibi. Yaz, Enter\'a bas.</span></div>' +
        b.S.map(function(q,j){ var r = s.s[j];
          return '<div class="nlp-sa"><p>' + (j + 1) + '. ' + esc(q.q) + '</p><div class="nlp-row"><input type="text" id="nlp-in' + j + '" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="cevabın" value="' + (r ? esc(r.v) : '') + '">' +
            '<button class="btn" type="button" data-k="' + j + '">Kontrol</button></div><div class="nlp-sf" id="nlp-f' + j + '">' + sf(b, j) + '</div></div>'; }).join('') +
        '</div><div class="nlp-err" id="nlp-err"></div>' +
        '<div class="nlp-nav"><button class="btn" type="button" data-act="bk">← Kartlara dön</button><button class="btn primary" type="button" data-act="nx">Bitir →</button></div>';
    } else {
      var sc = score(b) || {ok:0, tot:0}, mc = b.C.filter(function(c,j){ return s.a[j] === c.a; }).length;
      var sa = (b.S||[]).filter(function(q,j){ return s.s[j] && s.s[j].ok; }).length;
      var wr = b.C.filter(function(c,j){ return s.a[j] !== c.a; }).map(function(c){ return c.k; })
        .concat((b.S||[]).filter(function(q,j){ return !(s.s[j] && s.s[j].ok); }).map(function(q){ return q.show; }));
      cur._wr = wr;
      html = head + 'Özet</span>' + dots(b, s) + '</div>' +
        '<div class="nlp-met"><div><span>Çoktan seçmeli</span><b>' + mc + '/' + b.C.length + '</b></div>' +
        ((b.S && b.S.length) ? '<div><span>Kısa cevap</span><b>' + sa + '/' + b.S.length + '</b></div>' : '') + '</div>' +
        '<div class="qz nlp-card"><div><span class="nlp-k">Ezber kartı</span></div>' + b.C.map(function(c){
          return '<div class="nlp-z"><b>' + esc(c.k) + '</b><span>' + esc(c.z || c.w) + '</span></div>'; }).join('') + '</div>' +
        '<div class="nlp-nav">' + (wr.length ? '<button class="btn" type="button" data-act="wr">Yanlışlarımı anlat (kopyala)</button>' : '') +
        '<button class="btn" type="button" data-act="rs">Baştan çöz</button>' +
        (B[b.id + 1] ? '<a class="btn primary" href="#b' + (b.id + 1) + '">Bölüm ' + (b.id + 1) + ' →</a>' : '<a class="btn primary" href="#">Tüm bölümler</a>') + '</div>';
    }
    el.innerHTML = html;
  }
  function sf(b, j){ var r = S(b.id).s[j]; if(!r) return '';
    return r.ok ? '<span class="ok">Doğru. (' + esc(b.S[j].show) + ')</span>' : '<span class="no">Değil. Cevap: ' + esc(b.S[j].show) + '</span>'; }
  function chk(j){
    var b = cur, s = S(b.id), inp = document.getElementById('nlp-in' + j), f = document.getElementById('nlp-f' + j), v = inp.value.trim();
    if(!v){ f.innerHTML = '<span class="no">Önce bir cevap yaz.</span>'; return; }
    s.s[j] = {v:v, ok:b.S[j].acc.some(function(x){ return nm(x) === nm(v); })}; save(); f.innerHTML = sf(b, j);
  }

  document.addEventListener('click', function(e){
    var run = document.getElementById('nlp-run'); if(!cur || !run.contains(e.target)) return;
    var btn = e.target.closest('button'); if(!btn) return;
    var b = cur, s = S(b.id), er = document.getElementById('nlp-err');
    if(btn.dataset.j !== undefined){ if(s.a[s.i] === undefined){ s.a[s.i] = +btn.dataset.j; draw(); } return; }
    if(btn.dataset.k !== undefined){ chk(+btn.dataset.k); return; }
    switch(btn.dataset.act){
      case 'bk': if(s.ph === 's'){ s.ph = 'c'; s.i = b.C.length - 1; } else if(s.i > 0) s.i--; draw(); break;
      case 'nx':
        if(s.ph === 'c'){
          if(s.a[s.i] === undefined){ er.textContent = 'Önce bir şık seç.'; return; }
          if(s.i < b.C.length - 1) s.i++; else s.ph = (b.S && b.S.length) ? 's' : 'e';
        } else {
          var miss = b.S.filter(function(q,j){ return !s.s[j]; }).length;
          if(miss){ er.textContent = miss + ' soruyu kontrol etmedin. Bilmiyorsan aklına geleni yaz, cevabı görürsün.'; return; }
          s.ph = 'e';
        }
        draw(); window.scrollTo({top: document.getElementById('nlp-run').offsetTop - 80, behavior:'smooth'}); break;
      case 'dk': copy('NLP Bölüm ' + b.id + ', kart ' + (s.i + 1) + ' (' + b.C[s.i].k + ') anlamadım, daha basit anlat'); break;
      case 'wr': copy('NLP Bölüm ' + b.id + '\'de bunları yanlış yaptım, daha basit anlat: ' + cur._wr.join('; ')); break;
      case 'rs': st[b.id] = {a:{}, s:{}, i:0, ph:'c'}; draw(); break;
    }
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && e.target.id && e.target.id.indexOf('nlp-in') === 0){ e.preventDefault(); chk(+e.target.id.slice(6)); }
  });
  document.addEventListener('input', function(e){
    var er = document.getElementById('nlp-err'); if(er) er.textContent = '';
    var m = e.target.id && e.target.id.match(/^nlp-in(\d+)$/);
    if(m && cur && !S(cur.id).s[m[1]]){ var f = document.getElementById('nlp-f' + m[1]); if(f) f.innerHTML = ''; }
  });

  function route(){
    var h = location.hash.replace('#',''), m = h.match(/^b(\d+)$/), b = m && B[+m[1]];
    document.querySelectorAll('.view').forEach(function(v){ v.hidden = true; });
    if(b){
      cur = b;
      var v = document.querySelector('[data-view="bolum"]'); v.hidden = false;
      document.getElementById('nlp-bl').textContent = 'Bölüm ' + b.id;
      document.getElementById('nlp-bt').textContent = b.t;
      document.getElementById('nlp-bs').textContent = b.sub;
      draw(); window.scrollTo(0, 0);
    } else {
      cur = null; document.querySelector('[data-view="home"]').hidden = false; home();
    }
  }
  window.addEventListener('hashchange', route);
  route();
})();
