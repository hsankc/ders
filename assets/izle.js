// Sesli anlatım ("izle" modu): açık görünümdeki başlık, paragraf ve maddeleri sırayla vurgular, ekrana getirir
// ve tarayıcının Türkçe sesiyle okur. Alttaki çubukla durdur, geri/ileri, hız. Çalarken bir paragrafa tıklamak oradan başlatır.
(function(){
  if(!('speechSynthesis' in window)) return;
  var SY = window.speechSynthesis, voice = null;
  function pickVoice(){
    var vs = SY.getVoices();
    voice = vs.filter(function(v){ return /^tr/i.test(v.lang) && /online|natural|google/i.test(v.name); })[0] || vs.filter(function(v){ return /^tr/i.test(v.lang); })[0] || null;
  }
  pickVoice(); SY.onvoiceschanged = pickVoice;
  var RATE = 1; try{ RATE = +localStorage.getItem('vh.izle.hiz') || 1; }catch(e){}

  var st = document.createElement('style');
  st.textContent = '.izle-btn{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font:600 .9rem inherit;background:#1F2430;color:#fff;border:0;border-radius:999px;padding:7px 14px;cursor:pointer}' +
    '.izle-on{background:#FFF3C4!important;box-shadow:0 0 0 4px #FFF3C4;border-radius:6px;transition:background .2s}' +
    '#izle-bar{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:80;display:flex;gap:6px;align-items:center;background:#1F2430;color:#fff;border-radius:999px;padding:6px 10px;box-shadow:0 8px 24px rgba(0,0,0,.25);font-size:.85rem;max-width:calc(100vw - 20px)}' +
    '#izle-bar button{background:none;border:0;color:#fff;font-size:1.05rem;cursor:pointer;padding:4px 8px;border-radius:999px}#izle-bar button:hover{background:rgba(255,255,255,.12)}' +
    '#izle-bar .say{opacity:.75;white-space:nowrap;padding:0 4px}#izle-bar select{background:#2E3442;color:#fff;border:0;border-radius:8px;padding:3px 4px;font:inherit}';
  document.head.appendChild(st);

  var bar = document.createElement('div'); bar.id = 'izle-bar'; bar.hidden = true;
  bar.innerHTML = '<button type="button" data-a="geri" title="Önceki">⏮</button><button type="button" data-a="oynat" title="Durdur / devam">⏸</button><button type="button" data-a="ileri" title="Sonraki">⏭</button>' +
    '<span class="say"></span><select aria-label="Hız">' + [0.8, 0.9, 1, 1.15, 1.3, 1.5, 1.75].map(function(r){ return '<option value="' + r + '"' + (r === RATE ? ' selected' : '') + '>' + r + 'x</option>'; }).join('') + '</select>' +
    '<button type="button" data-a="kapat" title="Kapat">✕</button>';
  document.body.appendChild(bar);
  var say = bar.querySelector('.say'), playBtn = bar.querySelector('[data-a="oynat"]');

  var blocks = [], i = 0, playing = false, token = 0;
  var SEL = 'h1,h2,h3,h4,p,li,td,figcaption,.exq-q,.sl-ch,.sl-cb,.sl-chips span,.lbl';
  var SKIP = 'nav,.back,.tabs,.toolbar,.pager,button,textarea,select,#cizgiler,#izle-bar,.ex-sol:not([open]),.ex-tip:not([open]),.yza-ctl,svg,.izle-btn,footer,.ex-ok,.qn,.opts,.mopts';
  function textOf(el){
    var c = el.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll('.katex'), function(k){
      var a = k.querySelector('annotation'); var t = a ? a.textContent : k.textContent;
      t = t.replace(/\\(frac|dfrac)\{([^{}]*)\}\{([^{}]*)\}/g, '$2 bölü $3').replace(/\\le(q)?/g, ' küçük eşit ').replace(/\\ge(q)?/g, ' büyük eşit ')
        .replace(/\\(text|mathrm|operatorname)\{([^{}]*)\}/g, '$2').replace(/\\sum/g, ' toplam ').replace(/\\sqrt/g, ' karekök ').replace(/\\cdot|\\times/g, ' çarpı ')
        .replace(/\^/g, ' üssü ').replace(/_/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}\\]/g, ' ');
      k.replaceWith(document.createTextNode(' ' + t + ' '));
    });
    Array.prototype.forEach.call(c.querySelectorAll('ul,ol,.katex-mathml'), function(x){ x.remove(); });
    return c.textContent.replace(/→/g, ', ').replace(/×/g, ' çarpı ').replace(/≈/g, ' yaklaşık ').replace(/≤/g, ' küçük eşit ').replace(/≥/g, ' büyük eşit ').replace(/\s+/g, ' ').trim();
  }
  function collect(root, from){
    var list = Array.prototype.filter.call(root.querySelectorAll(SEL), function(el){
      if(!el.offsetParent || el.closest(SKIP)) return false;
      if(el.tagName === 'LI' && el.querySelector('p')) return false;
      if((el.tagName === 'P' || el.tagName === 'LI') && el.closest('.sl-cb,td')) return false;
      return textOf(el).length > 1;
    });
    // aynı içeriği iki kez okumamak için iç içe seçilenleri at
    list = list.filter(function(el){ return !list.some(function(o){ return o !== el && o.contains(el); }); });
    blocks = list; i = Math.max(0, from ? blocks.indexOf(from) : 0);
  }
  function mark(){
    blocks.forEach(function(b){ b.classList.remove('izle-on'); });
    var b = blocks[i]; if(!b) return;
    b.classList.add('izle-on'); b.scrollIntoView({block: 'center', behavior: 'smooth'});
    say.textContent = (i + 1) + ' / ' + blocks.length;
  }
  // uzun metni cümlelere bölerek okur (Chrome uzun cümlede kesiliyor)
  function speak(){
    var my = ++token; SY.cancel();
    if(i >= blocks.length){ stop(); return; }
    mark();
    var parts = textOf(blocks[i]).match(/[^.!?;:]+[.!?;:]*\s*/g) || [textOf(blocks[i])], k = 0;
    (function next(){
      if(my !== token || !playing) return;
      if(k >= parts.length){ i++; setTimeout(function(){ if(my === token && playing) speak(); }, 250); return; }
      var u = new SpeechSynthesisUtterance(parts[k++]); u.lang = 'tr-TR'; if(voice) u.voice = voice; u.rate = RATE;
      u.onend = next; u.onerror = function(e){ if(e.error !== 'interrupted' && e.error !== 'canceled') next(); };
      SY.speak(u);
    })();
  }
  function start(root, from){
    collect(root, from); if(!blocks.length) return;
    playing = true; bar.hidden = false; playBtn.textContent = '⏸'; speak();
  }
  function stop(){
    token++; playing = false; SY.cancel(); bar.hidden = true;
    blocks.forEach(function(b){ b.classList.remove('izle-on'); });
  }
  bar.addEventListener('click', function(e){
    var a = e.target.dataset && e.target.dataset.a; if(!a) return;
    if(a === 'kapat') stop();
    else if(a === 'oynat'){
      if(playing){ playing = false; token++; SY.cancel(); playBtn.textContent = '▶'; }
      else { playing = true; playBtn.textContent = '⏸'; speak(); }
    } else { i = Math.max(0, Math.min(blocks.length - 1, i + (a === 'ileri' ? 1 : -1))); if(playing) speak(); else mark(); }
  });
  bar.querySelector('select').addEventListener('change', function(){
    RATE = +this.value; try{ localStorage.setItem('vh.izle.hiz', RATE); }catch(e){}
    if(playing) speak();
  });
  // çalarken bir bloğa tıklayınca oradan devam
  document.addEventListener('click', function(e){
    if(bar.hidden || e.target.closest('a,button,input,select,summary,#izle-bar')) return;
    var b = e.target.closest(SEL); if(!b) return;
    var j = blocks.indexOf(b); if(j < 0) return;
    i = j; playing = true; playBtn.textContent = '⏸'; speak();
  });
  window.addEventListener('hashchange', stop);

  // her görünümün başlığına düğme
  function addButtons(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-view]:not([data-view="home"]) .view-head'), function(h){
      if(h.querySelector('.izle-btn')) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'izle-btn'; b.innerHTML = '▶ Sesli anlat';
      b.addEventListener('click', function(){
        if(!voice) pickVoice();
        if(!voice && !confirm('Bu tarayıcıda Türkçe ses bulunamadı; varsayılan sesle okunacak. Devam edilsin mi?')) return;
        start(h.closest('[data-view]'));
      });
      h.appendChild(b);
    });
  }
  addButtons(); window.addEventListener('load', function(){ addButtons(); setTimeout(addButtons, 1000); });
})();
