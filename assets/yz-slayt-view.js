// "Slayt slayt" görünümleri (#s3 … #s7): her slaytın yazısı ve altında hoca ağzından anlatım.
// yz.js'ten önce çalışır; yönlendirme ve KaTeX yz.js'te.
(function(){
  var S = window.YZS, P = (window.YZ && window.YZ.parts) || [];
  var esc = function(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var tx = function(s){ return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\{\{(.+?)\}\}/g, '<code>$1</code>'); };
  function load(){ try{ return JSON.parse(localStorage.getItem('yz.sl')) || {}; }catch(e){ return {}; } }
  var OK = load();
  function save(){ try{ localStorage.setItem('yz.sl', JSON.stringify(OK)); }catch(e){} }

  // anlatım metni: boş satırla paragraflar, "- " ile liste, "→ bN" ile bölüme bağlantı
  function hoca(src){
    if(!src) return '<p class="muted">Bu slayt için anlatım yok.</p>';
    var go = '';
    src = src.replace(/\n?→ b(\d+)\s*$/, function(m, n){
      var p = P.filter(function(x){ return String(x.no) === n; })[0];
      go = p ? '<a class="go-link" href="#b' + n + '">Konu anlatımı ve animasyon: ' + esc(p.title) + ' →</a>' : ''; return '';
    });
    return src.trim().split(/\n\s*\n/).map(function(par){
      var lines = par.split('\n'), out = '', li = [];
      lines.forEach(function(l){
        if(/^- /.test(l)) li.push('<li>' + tx(l.slice(2)) + '</li>');
        else { if(li.length){ out += '<ul>' + li.join('') + '</ul>'; li = []; } out += '<p>' + tx(l) + '</p>'; }
      });
      return out + (li.length ? '<ul>' + li.join('') + '</ul>' : '');
    }).join('') + go;
  }
  var count = function(w){ var n = 0; w.parts.forEach(function(p){ p.items.forEach(function(it){ if(it.n) n++; }); }); return n; };
  var done = function(w){ var n = 0; w.parts.forEach(function(p){ p.items.forEach(function(it){ if(it.n && OK[it.n]) n++; }); }); return n; };

  // haftanın rengi
  var WC = {'3':'#3557D6', '4':'#0F7A6C', '5':'#B25F00', '6':'#2E7D32', '7':'#6B46C1'};
  var WS = {'3':'#EAF0FD', '4':'#E5F4F1', '5':'#FBF0E2', '6':'#E8F4E9', '7':'#F0EAFC'};
  // slayt yazısını görselleştirir: "Etiket: açıklama" maddeleri kart ızgarası, kısa maddeler çip, şekil satırları ikonlu kutu;
  // anlatımda "Sınavda…" cümleleri ipucu kutusu olur
  function vis(root){
    Array.prototype.forEach.call(root.querySelectorAll('.sl-slide > ol, .sl-slide > ul'), function(list){
      var lis = Array.prototype.filter.call(list.children, function(x){ return x.tagName === 'LI'; });
      var lab = lis.filter(function(li){ var b = li.firstElementChild; return b && b.tagName === 'B' && li.firstChild === b; });
      if(lis.length >= 2 && lab.length >= lis.length - 1){
        var g = document.createElement('div'); g.className = 'sl-cards' + (list.tagName === 'OL' ? ' num' : '');
        lis.forEach(function(li, i){
          var c = document.createElement('div'); c.className = 'sl-card';
          var b = li.firstElementChild, head = document.createElement('div'); head.className = 'sl-ch';
          if(list.tagName === 'OL') head.innerHTML = '<span class="sl-num">' + (li.getAttribute('value') || i + 1) + '</span>';
          if(b && b.tagName === 'B' && li.firstChild === b){ head.appendChild(document.createTextNode(b.textContent.replace(/:$/, ''))); b.remove(); }
          var body = document.createElement('div'); body.className = 'sl-cb';
          while(li.firstChild) body.appendChild(li.firstChild);
          c.appendChild(head); c.appendChild(body); g.appendChild(c);
        });
        list.replaceWith(g); return;
      }
    });
    // kısa maddeli listeler (iç içe olanlar dahil): çip ya da numaralı adım
    Array.prototype.forEach.call(root.querySelectorAll('.sl-slide ul, .sl-slide ol'), function(list){
      var lis = Array.prototype.filter.call(list.children, function(x){ return x.tagName === 'LI'; });
      if(lis.length < 2 || !lis.every(function(li){ return li.textContent.length <= 60 && !li.querySelector('ul,ol,.sek'); })) return;
      var ch = document.createElement('div'); ch.className = 'sl-chips' + (list.tagName === 'OL' ? ' num' : '');
      lis.forEach(function(li, i){ var x = document.createElement('span'); x.innerHTML = (list.tagName === 'OL' ? '<b class="sl-num">' + (li.getAttribute('value') || i + 1) + '</b>' : '') + li.innerHTML; ch.appendChild(x); });
      list.replaceWith(ch);
    });
    Array.prototype.forEach.call(root.querySelectorAll('.sl-slide .sek'), function(e){
      var li = e.closest('li'), box = document.createElement('div'); box.className = 'sl-fig';
      box.innerHTML = '<span class="ic">▦</span><span>' + e.innerHTML.replace(/^Şekil[^:]*:\s*/, '') + '</span>';
      if(li && li.parentNode.children.length === 1) li.parentNode.replaceWith(box);
      else if(li){ li.parentNode.parentNode.insertBefore(box, li.parentNode.nextSibling); li.remove(); }
      else e.closest('p') ? e.closest('p').replaceWith(box) : e.replaceWith(box);
    });
    Array.prototype.forEach.call(root.querySelectorAll('.sl-slide ul:empty, .sl-slide ol:empty'), function(x){ x.remove(); });
    Array.prototype.forEach.call(root.querySelectorAll('.sl-hoca p'), function(p){
      if(/Sınavda|sınavda|sorarsam|sorulursa/.test(p.textContent)) p.className = 'sl-tip';
    });
  }

  var main = document.querySelector('main.page');
  S.weeks.forEach(function(w, i){
    var sec = document.createElement('section');
    sec.className = 'view sl-view'; sec.dataset.view = 's' + w.no; sec.hidden = true;
    var toc = '', body = '';
    w.parts.forEach(function(p, pi){
      if(w.parts.length > 1) body += '<h2 class="sl-part">' + esc(p.label) + '</h2>';
      p.items.forEach(function(it){
        if(!it.n){
          body += it.k === 'gap' ? '<p class="sl-gap">' + esc(it.t) + '</p>' : '<h2 class="sl-band">' + esc(it.t) + '</h2>';
          return;
        }
        var id = 'sl-' + it.n.replace('.', '-');
        toc += '<li><a href="#s' + it.n.replace('.', '-') + '"><span>' + it.n + '</span> ' + esc(it.t) + '</a></li>';
        body += '<article class="sl" id="' + id + '"><h3><span class="n">' + it.n + '</span>' + esc(it.t) + '</h3>' +
          '<div class="sl-slide"><span class="lbl-sm">Slaytta</span>' + it.b + '</div>' +
          '<div class="sl-hoca"><span class="sl-who"><i>H</i>Hoca anlatıyor</span>' + hoca(S.hoca[it.n]) + '</div>' +
          '<label class="ex-ok"><input type="checkbox" data-sl="' + it.n + '"' + (OK[it.n] ? ' checked' : '') + '> Anladım</label></article>';
      });
    });
    var prev = S.weeks[i - 1], next = S.weeks[i + 1];
    sec.innerHTML = '<a class="back" href="#">← Tüm bölümler</a>' +
      '<div class="view-head"><span class="label">Slayt slayt · Hafta ' + w.no + '</span><h1>' + esc(w.title) + '</h1>' +
      '<p class="muted vlead">' + count(w) + ' slayt, hocanın sırasıyla. Her slaytta önce slaytta yazanlar, altında hocanın derste anlatacağı gibi açıklaması var. Anlatımlar benim; hocanın kendi sözleri değil.</p></div>' +
      '<div class="read"><details class="sl-toc"><summary>Bu haftanın slaytları · <span data-slc>' + done(w) + ' / ' + count(w) + ' anlaşıldı</span></summary><ol>' + toc + '</ol></details>' +
      body + '<div class="pager">' + (prev ? '<a class="btn" href="#s' + prev.no + '">← Hafta ' + prev.no + '</a>' : '<a class="btn" href="#">← Tüm bölümler</a>') +
      (next ? '<a class="btn primary" href="#s' + next.no + '">Hafta ' + next.no + ' →</a>' : '<a class="btn" href="#">Tüm bölümler →</a>') + '</div></div>';
    sec.style.setProperty('--wc', WC[w.no] || 'var(--yz)'); sec.style.setProperty('--wc-soft', WS[w.no] || 'var(--yz-soft)');
    vis(sec);
    main.appendChild(sec);
  });

  // ana sayfada hafta kartları
  var home = document.querySelector('[data-view="home"]'), parts = document.getElementById('yz-parts');
  var box = document.createElement('div'); box.className = 'section';
  function paint(){
    box.innerHTML = '<div class="section-title"><h2>Slayt slayt hoca anlatımı</h2><p>143 slayt, sırasıyla</p></div><div class="grid">' +
      S.weeks.map(function(w){
        var d = done(w), c = count(w);
        return '<a class="card" href="#s' + w.no + '"><span class="label">Hafta ' + w.no + '</span><h3>' + esc(w.title) + '</h3>' +
          '<p class="desc">Her slaytın yazısı ve altında hoca gibi anlatımı.</p><div class="foot"><span class="meta">' + c + ' slayt' + (d ? ' · ' + d + ' anlaşıldı' : '') + '</span>' +
          (d === c ? '<span class="tag ok">Bitti</span>' : '<span class="go">Aç →</span>') + '</div></a>';
      }).join('') + '</div>';
  }
  paint();
  if(home && parts) parts.parentNode.insertBefore(box, parts);

  document.addEventListener('change', function(e){
    var k = e.target.dataset && e.target.dataset.sl; if(!k) return;
    if(e.target.checked) OK[k] = 1; else delete OK[k];
    save(); paint();
    var w = S.weeks.filter(function(x){ return x.no === k.split('.')[0]; })[0], el = document.querySelector('[data-view="s' + w.no + '"] [data-slc]');
    if(el) el.textContent = done(w) + ' / ' + count(w) + ' anlaşıldı';
  });
})();
