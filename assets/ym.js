// Yazılım Mühendisliği sayfası: kart ızgarası, bölüm görünümleri, testler ve sözlük
(function(){
  var D = window.YM, ESS = window.YM_ESS, LISTS = window.YM_LISTS;
  var store = {
    get: function(k, d){ try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch(e){ return d; } },
    set: function(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  };
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  var prog = function(n){ return store.get('ym.ch' + n, {done:false, best:0}); };
  var saveProg = function(n, p){ store.set('ym.ch' + n, p); paintCards(); };

  // --- bölüm kartları
  function paintCards(){
    var done = 0;
    document.getElementById('ch-cards').innerHTML = D.map(function(ch){
      var p = prog(ch.no); if(p.done) done++;
      var st = p.done ? '<span class="tag ok">✓ Bitti</span>' : p.best ? '<span class="tag accent">Test ' + p.best + '/18</span>' : '<span class="meta">' + esc(ch.pages) + '</span>';
      return '<a class="card" href="#b' + ch.no + '"><span class="label">Bölüm ' + ch.no + '</span>' +
        '<h3>' + esc(ch.tr) + '</h3><p class="desc">' + esc(ESS[ch.no]) + '</p>' +
        '<div class="foot"><span class="meta">Konu anlatımı · ' + ch.qa.length + ' soru · ' + ch.quiz.length + ' test</span>' + st + '</div></a>';
    }).join('');
    document.getElementById('ch-progress').textContent = done + ' / 7 bölüm bitti';
  }

  // --- test
  function buildQuiz(host, items, scoreEl, onFinish){
    var right = 0, answered = 0;
    host.innerHTML = '';
    scoreEl.textContent = '0 / ' + items.length;
    scoreEl.classList.remove('good');
    items.forEach(function(it, n){
      var q = it.q, box = document.createElement('div');
      box.className = 'qz';
      box.innerHTML = '<span class="qn">Soru ' + (n+1) + (it.ch ? ' · Bölüm ' + it.ch : '') + '</span><p>' + esc(q.q) + '</p><div class="opts"></div>';
      var opts = box.querySelector('.opts');
      q.opts.forEach(function(o, k){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'opt';
        b.innerHTML = '<b>' + 'abcd'[k] + ')</b><span>' + esc(o) + '</span>';
        b.addEventListener('click', function(){
          opts.querySelectorAll('button').forEach(function(x, j){ x.disabled = true; if(j === q.ans) x.classList.add('right'); });
          if(k === q.ans) right++; else b.classList.add('wrong');
          answered++;
          scoreEl.textContent = right + ' / ' + items.length + (answered < items.length ? ' · ' + (items.length - answered) + ' soru kaldı' : '');
          if(answered === items.length){
            scoreEl.classList.toggle('good', right >= Math.ceil(items.length * 0.8));
            if(onFinish) onFinish(right);
          }
        });
        opts.appendChild(b);
      });
      host.appendChild(box);
    });
  }

  // --- cevap dili
  var lang = store.get('ym.lang', 'both');
  function applyLang(){
    document.body.classList.remove('lang-en', 'lang-tr');
    if(lang !== 'both') document.body.classList.add('lang-' + lang);
    document.querySelectorAll('.seg button').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'); });
  }

  // --- bölüm görünümleri
  D.forEach(function(ch, idx){
    var view = document.querySelector('[data-view="b' + ch.no + '"]');
    var panels = {};
    view.querySelectorAll('.panel').forEach(function(p){ panels[p.dataset.panel] = p; });

    panels.mb.innerHTML = '<ol class="mb">' + ch.mustknow.map(function(m){ return '<li>' + esc(m) + '</li>'; }).join('') + '</ol>';

    panels.soru.innerHTML =
      '<div class="toolbar" style="margin-bottom:14px"><div class="seg" role="group" aria-label="Cevap dili">' +
      '<button type="button" data-lang="both">EN + TR</button><button type="button" data-lang="en">İngilizce</button><button type="button" data-lang="tr">Türkçe</button></div>' +
      '<button class="btn" type="button" data-openall>Bütün cevapları aç</button></div><div class="qa">' +
      ch.qa.map(function(q, i){
        return '<div class="qcard"><div class="qtop"><span>' + (q.ex ? 'Kitap alıştırması ' + esc(q.ex) : 'Soru ' + (i+1)) + '</span><span>' + esc(q.ref) + '</span></div>' +
          '<p class="q-en">' + esc(q.q_en) + '</p><p class="q-tr">' + esc(q.q_tr) + '</p>' +
          '<details><summary>Cevabı göster</summary><div class="ans">' +
          '<p class="a-en"><span class="lbl">EN</span>' + esc(q.a_en) + '</p>' +
          '<p class="a-tr"><span class="lbl">TR</span>' + esc(q.a_tr) + '</p></div></details></div>';
      }).join('') + '</div>';
    panels.soru.querySelectorAll('.seg button').forEach(function(b){
      b.addEventListener('click', function(){ lang = b.dataset.lang; store.set('ym.lang', lang); applyLang(); });
    });
    var openAll = panels.soru.querySelector('[data-openall]'), opened = false;
    openAll.addEventListener('click', function(){
      opened = !opened;
      panels.soru.querySelectorAll('details').forEach(function(d){ d.open = opened; });
      openAll.textContent = opened ? 'Bütün cevapları kapat' : 'Bütün cevapları aç';
    });

    panels.test.innerHTML = '<div class="toolbar" style="margin-bottom:14px"><button class="btn primary" type="button" data-start>Testi başlat</button><span class="score" data-score></span></div><div class="quiz" data-host></div>';
    var start = panels.test.querySelector('[data-start]');
    start.addEventListener('click', function(){
      start.textContent = 'Baştan başla';
      buildQuiz(panels.test.querySelector('[data-host]'), ch.quiz.map(function(q){ return {q:q}; }), panels.test.querySelector('[data-score]'), function(r){
        var p = prog(ch.no); if(r > (p.best || 0)){ p.best = r; saveProg(ch.no, p); }
      });
    });

    // sekmeler
    var tabs = view.querySelectorAll('.tabs button');
    tabs.forEach(function(t){
      t.addEventListener('click', function(){
        tabs.forEach(function(x){ x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        Object.keys(panels).forEach(function(k){ panels[k].hidden = k !== t.dataset.tab; });
      });
    });

    // alt gezinme
    var prev = D[idx - 1], next = D[idx + 1];
    var pager = view.querySelector('.pager');
    function paintPager(){
      var p = prog(ch.no);
      pager.innerHTML =
        (prev ? '<a class="btn" href="#b' + prev.no + '">← Bölüm ' + prev.no + '</a>' : '<a class="btn" href="#">← Tüm bölümler</a>') +
        '<button class="btn' + (p.done ? '' : ' primary') + '" type="button" data-done>' + (p.done ? '✓ Bitti olarak işaretli' : 'Bu bölümü bitirdim') + '</button>' +
        (next ? '<a class="btn" href="#b' + next.no + '">Bölüm ' + next.no + ' →</a>' : '<a class="btn" href="#">Tüm bölümler →</a>');
      pager.querySelector('[data-done]').addEventListener('click', function(){
        var pp = prog(ch.no); pp.done = !pp.done; saveProg(ch.no, pp); paintPager();
      });
    }
    paintPager();
  });
  applyLang();

  // --- sözlük
  var G = [];
  D.forEach(function(ch){ ch.glossary.forEach(function(g){ G.push({ch:ch.no, en:g.en, tr:g.tr, desc:g.desc, page:g.page}); }); });
  var sel = document.getElementById('glc');
  D.forEach(function(ch){ var o = document.createElement('option'); o.value = ch.no; o.textContent = 'Bölüm ' + ch.no + ' · ' + ch.tr; sel.appendChild(o); });
  var norm = function(s){ return s.toLocaleLowerCase('tr'); };
  function drawGl(){
    var q = norm(document.getElementById('glq').value.trim()), c = +sel.value;
    var rows = G.filter(function(g){ return (!c || g.ch === c) && (!q || norm(g.en + ' ' + g.tr + ' ' + g.desc).indexOf(q) >= 0); });
    document.getElementById('glcount').textContent = rows.length + ' terim';
    document.getElementById('glbody').innerHTML = rows.map(function(g){
      return '<tr><td><b>' + esc(g.en) + '</b></td><td>' + esc(g.tr) + '</td><td>' + esc(g.desc) + '</td><td class="n">B' + g.ch + ' · ' + esc(g.page) + '</td></tr>';
    }).join('');
  }
  document.getElementById('glq').addEventListener('input', drawGl);
  sel.addEventListener('change', drawGl);
  drawGl();

  // --- karışık test
  var ALL = [];
  D.forEach(function(ch){ ch.quiz.forEach(function(q){ ALL.push({ch:ch.no, q:q}); }); });
  document.getElementById('mixgo').addEventListener('click', function(){
    var pool = ALL.slice();
    for(var i = pool.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    this.textContent = 'Yeni 20 soru getir';
    buildQuiz(document.getElementById('mixquiz'), pool.slice(0, 20), document.getElementById('mixscore'));
  });

  // --- sayılı listeler
  document.getElementById('lists').innerHTML = LISTS.map(function(r){
    return '<tr><td class="big">' + r[0] + '</td><td><b>' + esc(r[1]) + '</b></td><td>' + esc(r[2]) + '</td><td class="n">' + esc(r[3]) + '</td></tr>';
  }).join('');

  // --- konu anlatımı: Türkçe notun bölüm içeriği, sekme açılınca yüklenir
  var notesState = {};
  var GRP = {
    intro: {cls:'intro', ic:'◎', title:'Bu bölüm ne anlatıyor?'},
    kitap: {cls:'kitap', ic:'📖', title:'Kitapta ne anlatılıyor'},
    hoca:  {cls:'hoca',  ic:'👨‍🏫', title:'Hocanın sözleri'},
    not:   {cls:'not',   ic:'📝', title:'Notlar'}
  };
  var FOLD = {hoca:1, not:1};   // konu anlatımında açılır kapanır gruplar
  function txt(b){ return b.em ? '<strong>' + esc(b.x) + '</strong>' : esc(b.x); }
  function renderItems(items){
    var h = '', tops = null;
    function flush(){
      if(!tops) return;
      h += '<ul class="nl">' + tops.map(function(t){
        return '<li>' + t.html + (t.kids.length ? '<ul>' + t.kids.map(function(k){ return '<li>' + k + '</li>'; }).join('') + '</ul>' : '') + '</li>';
      }).join('') + '</ul>';
      tops = null;
    }
    items.forEach(function(b){
      if(b.t === 'li'){
        if(!tops) tops = [];
        if(b.l === 2 && tops.length) tops[tops.length - 1].kids.push(txt(b));
        else tops.push({html: txt(b), kids: []});
        return;
      }
      flush();
      if(b.t === 'p') h += '<p>' + txt(b) + '</p>';
      else if(b.t === 'label') h += '<p class="lbl-sm">' + esc(b.x) + '</p>';
      else if(b.t === 'img') h += '<figure class="nfig"><img src="assets/ym-notes/img/' + b.src + '" width="' + Math.round(b.w * 1.4) + '" alt="' + esc(b.cap || 'Şema') + '" loading="lazy">' + (b.cap ? '<figcaption>' + esc(b.cap) + '</figcaption>' : '') + '</figure>';
    });
    flush();
    return h;
  }
  function groupsOf(blocks){
    var groups = [], cur = null;
    blocks.forEach(function(b){
      if(b.t === 'h'){ cur = {k: b.k, items: []}; groups.push(cur); return; }
      if(!cur){ cur = {k: 'kitap', items: []}; groups.push(cur); }
      cur.items.push(b);
    });
    return groups;
  }
  function renderGroups(blocks){
    return groupsOf(blocks).map(function(g){
      var m = GRP[g.k] || GRP.kitap, head = '<span aria-hidden="true">' + m.ic + '</span>' + m.title;
      if(FOLD[g.k]) return '<details class="grp fold ' + m.cls + '"><summary class="grp-h">' + head + '<span class="hint"></span></summary><div class="grp-body">' + renderItems(g.items) + '</div></details>';
      return '<div class="grp ' + m.cls + '"><p class="grp-h">' + head + '</p>' + renderItems(g.items) + '</div>';
    }).join('');
  }
  // tek bir grup türünü (hocanın sözleri ya da notlar) bütün bölümden toplayıp sayfa sırasıyla gösterir
  function renderOnly(k, d){
    var m = GRP[k];
    var parts = [{p:'', title:'Bölüme giriş', blocks:d.intro}].concat(d.pages).map(function(pg){
      var items = [];
      groupsOf(pg.blocks).forEach(function(g){ if(g.k === k) items = items.concat(g.items); });
      return items.length ? {pg:pg, items:items} : null;
    }).filter(Boolean);
    if(!parts.length) return '<p class="muted">Bu bölümde bu kısım yok.</p>';
    return '<p class="muted" style="margin-bottom:16px">' + (k === 'hoca' ? 'Hocanın bu bölümde anlattıkları, kitap sayfası sırasıyla bir arada.' : 'Deftere yazılacak kısa notlar, kitap sayfası sırasıyla bir arada.') + '</p>' +
      parts.map(function(x){
        return '<article class="pg"><div class="pg-head"><span class="pg-no">' + (x.pg.p ? 'Kitap s.' + esc(x.pg.p) : 'Giriş') + '</span><h3>' + esc(x.pg.title || ('Sayfa ' + x.pg.p)) + '</h3></div>' +
          '<div class="grp ' + m.cls + '"><p class="grp-h"><span aria-hidden="true">' + m.ic + '</span>' + m.title + '</p>' + renderItems(x.items) + '</div></article>';
      }).join('');
  }
  function renderNotes(n, d){
    var h = '<div class="toolbar fold-bar"><span class="muted">Hocanın sözleri ve notlar kapalı; başlığına tıklayınca açılır.</span><button class="btn" type="button" data-foldall>Hepsini aç</button></div>' +
      '<div class="konu-nav" role="group" aria-label="Kitap sayfasına git"><span class="muted">Kitap sayfası:</span>' +
      d.pages.map(function(pg, i){ return '<button type="button" data-goto="b' + n + '-pg' + i + '">s.' + esc(pg.p) + '</button>'; }).join('') + '</div>';
    if(d.intro.length) h += '<div class="pg">' + renderGroups(d.intro) + '</div>';
    h += d.pages.map(function(pg, i){
      return '<article class="pg" id="b' + n + '-pg' + i + '"><div class="pg-head"><span class="pg-no">Kitap s.' + esc(pg.p) + '</span><h3>' + esc(pg.title || ('Sayfa ' + pg.p)) + '</h3></div>' + renderGroups(pg.blocks) + '</article>';
    }).join('');
    h += '<p class="muted" style="font-size:.9rem">Bu metin, kitabın bu bölümünden sayfa sayfa hazırlanmış Türkçe vize notlarının kendisidir. <a href="kaynaklar/yazilim-muhendisligi/vize-notlari.pdf" target="_blank" rel="noopener">PDF hâlini aç</a>.</p>';
    return h;
  }
  function loadNotes(n){
    if(notesState[n]) return;
    notesState[n] = 'loading';
    var view = document.querySelector('[data-view="b' + n + '"]');
    var panel = view.querySelector('[data-panel="konu"]'), hp = view.querySelector('[data-panel="hoca"]'), np = view.querySelector('[data-panel="not"]');
    fetch('assets/ym-notes/b' + n + '.json').then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); }).then(function(d){
      panel.innerHTML = renderNotes(n, d);
      hp.innerHTML = renderOnly('hoca', d);
      np.innerHTML = renderOnly('not', d);
      panel.querySelectorAll('[data-goto]').forEach(function(b){
        b.addEventListener('click', function(){ document.getElementById(b.dataset.goto).scrollIntoView({behavior:'smooth', block:'start'}); });
      });
      var all = panel.querySelector('[data-foldall]'), open = false;
      all.addEventListener('click', function(){
        open = !open;
        panel.querySelectorAll('details.fold').forEach(function(x){ x.open = open; });
        all.textContent = open ? 'Hepsini kapat' : 'Hepsini aç';
      });
      notesState[n] = 'done';
    }).catch(function(){
      notesState[n] = null;
      var msg = '<p class="muted">Konu anlatımı yüklenemedi. Sayfayı yenile ya da <a href="kaynaklar/yazilim-muhendisligi/vize-notlari.pdf" target="_blank" rel="noopener">notların PDF hâlini aç</a>.</p>';
      panel.innerHTML = msg; hp.innerHTML = msg; np.innerHTML = msg;
    });
  }

  // --- görünüm yönlendirme (#b3, #sozluk ...)
  var views = document.querySelectorAll('.view');
  var first = true;
  function route(){
    var id = location.hash.slice(1);
    if(id === 'kaynaklar'){ id = 'home'; }
    var has = document.querySelector('[data-view="' + id + '"]');
    var v = has ? id : 'home';
    views.forEach(function(el){ el.hidden = el.dataset.view !== v; });
    var m = /^b(\d)$/.exec(v); if(m) loadNotes(+m[1]);
    if(location.hash === '#kaynaklar'){ document.getElementById('kaynaklar').scrollIntoView(); }
    else if(!first || has){ window.scrollTo(0, 0); }
    first = false;
  }
  window.addEventListener('hashchange', route);
  paintCards();
  route();
})();
