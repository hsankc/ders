// Yazılım Mühendisliği vize sayfaları: cevap taslakları, sayfa içi atlamalar ve "Sistemi gör, stili seç" alıştırması
(function(){
  var store = {
    get: function(k, d){ try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch(e){ return d; } },
    set: function(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  };
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };

  // --- cevap taslakları (tarayıcıda saklanır)
  var ans = store.get('ym.vize.ans', {});
  document.querySelectorAll('textarea[data-k]').forEach(function(t){
    if(ans[t.dataset.k]) t.value = ans[t.dataset.k];
    t.addEventListener('input', function(){ ans[t.dataset.k] = t.value; store.set('ym.vize.ans', ans); });
  });

  // --- başka görünümdeki ya da aynı görünümdeki bir başlığa atla
  document.addEventListener('click', function(e){
    var a = e.target.closest('[data-jump]');
    if(!a) return;
    var el = document.getElementById(a.dataset.jump);
    if(!el) return;
    e.preventDefault();
    var view = el.closest('.view'), go = function(){ el.scrollIntoView({behavior:'smooth', block:'start'}); };
    if(view && view.hidden){
      // görünüm değişince sayfa başa döner; oradan uzun bir kaydırma animasyonu yerine doğrudan başlığa git
      window.addEventListener('hashchange', function once(){ window.removeEventListener('hashchange', once); requestAnimationFrame(function(){ el.scrollIntoView({block:'start'}); }); });
      location.hash = view.dataset.view;
    } else go();
  });

  // --- Sistemi gör, stili seç
  var OPT = {
    org: {h:'Hangi organizasyon stili?', o:[['depo','Ortak veri deposu'], ['is','İstemci-sunucu'], ['kat','Katmanlı']]},
    kon: {h:'Hangi kontrol modeli?', o:[['cr','Çağır-dön'], ['yon','Yönetici'], ['yay','Yayın'], ['kes','Kesme güdümlü']]}
  };
  var P = [
    {t:'org', s:'Tasarım editörü, kod üreteci, tasarım analizcisi ve rapor üretecinin aynı proje verisi üzerinde çalıştığı bir CASE araç seti.', a:['depo'],
     w:'Bütün araçlar aynı büyük veriyi kullanıyor; biri üretiyor, diğerleri okuyor. Araçlar birbirini değil sadece depo şemasını bilir. Kitaptaki depo örneği.'},
    {t:'org', s:'Kullanıcıların internetten katalog arayıp film klibi ve fotoğraf indirdiği bir film ve fotoğraf kütüphanesi.', a:['is'],
     w:'Katalog, video ve resim birbirinden bağımsız hizmetler, her biri ayrı sunucuda; kullanıcılar ağdan bağlanıyor. Kitaptaki istemci-sunucu örneği.'},
    {t:'org', s:'Farklı işletim sistemlerine taşınabilmesi gereken bir sürüm (versiyon) yönetim sistemi.', a:['kat'],
     w:'İşletim sistemi en alt katmanda. Bir katmanın arayüzü değişince sadece komşusu etkilendiği için taşırken alt katmanı değiştirmek yeter. Kitaptaki katmanlı örnek.'},
    {t:'org', s:'Bilgisayarlar arasındaki iletişimi sağlayan ağ protokolü yazılımı.', a:['kat'],
     w:'Her katman altındakinin hizmetini kullanıp üstündekine hizmet verir. OSI referans modeli katmanlıdır.'},
    {t:'org', s:'Bir bankanın yüzlerce ATM\'sinin merkezdeki hesap ve kart doğrulama sunucularına bağlandığı sistem.', a:['is'],
     w:'ATM\'ler istemci, hesap ve doğrulama hizmetleri sunucuda. Yeni ATM eklemek ya da sunucuyu yükseltmek kolay; veri ve işlem ağa dağılmış.'},
    {t:'org', s:'Radar ve sensörlerden gelen büyük miktarda veriyi harita, tehdit analizi ve raporlama alt sistemlerinin ortak kullandığı bir komuta-kontrol sistemi.', a:['depo'],
     w:'Büyük ortak veri var; bir alt sistem üretiyor, diğerleri kullanıyor. Kitap komuta-kontrol sistemlerini depo modelinin tipik örneği olarak sayar.'},
    {t:'org', s:'Öğrencilerin evden web üzerinden ders kaydı yaptığı, not ve harç bilgilerine baktığı üniversite sistemi.', a:['is'],
     w:'Kullanıcılar farklı yerlerden ağ üzerinden bağlanıyor; ders, not ve harç hizmetleri ayrı sunucularda olabilir. Sunucunun içi ayrıca katmanlı kurulabilir: büyük sistemler çoğu zaman tek stile uymaz.'},
    {t:'org', s:'Güvenliğin en önemli gereksinim olduğu, şifreleme anahtarlarını saklayan bir sistem.', a:['kat'],
     w:'Slayt 5: güvenlik önemliyse katmanlı mimari, kritik varlıklar en iç katmanda. Dışarıdan gelen istek iç katmana ulaşmadan her katmanda denetlenir.'},
    {t:'org', s:'Poliklinik, laboratuvar, eczane ve faturalamanın aynı hasta kayıtlarını kullandığı, tek binadaki bir hastane sistemi.', a:['depo','is'],
     w:'Herkes aynı hasta verisini paylaşıyor; tutarlılık, gizlilik ve yedekleme merkezde yönetilir, bu yüzden en iyi gerekçe depo modeline gider. Bölümler kendi verisini tutup ağdan paylaşıyorsa istemci-sunucu da savunulabilir.'},
    {t:'org', s:'Birçok katılımcının aynı anda görüntü, ses ve veri paylaştığı video konferans sistemi.', a:['is'],
     w:'Dağıtık bir sistem: görüntü, ses ve veri için ayrı sunucular var, katılımcıların bilgisayarları istemci. Her medya sunucusu bağımsız olarak eklenip yükseltilebilir.'},
    {t:'org', s:'İstasyonlardaki bilet otomatlarının merkezdeki tarife ve kredi kartı doğrulama hizmetlerini kullandığı sistem.', a:['is'],
     w:'Çok sayıda otomat aynı hizmetleri kullanıyor. Tarife değişince sadece sunucu güncellenir, yeni otomat eklemek kolay.'},
    {t:'org', s:'Koridorları temizleyen, duvar ve engelleri algılaması gereken bir robot süpürge.', a:['kat'],
     w:'Sensör ve motor sürücüleri → hareket kontrolü → engel algılama ve yol bulma → temizlik planı. Sensör donanımı değişince sadece en alt katman değişir.'},
    {t:'kon', s:'Çalışma saatlerinden maaş bordrosu ve banka transfer listesi basan toplu (batch) işleme sistemi.', a:['cr'],
     w:'Adımlar sırayla yapılıyor: oku → hesapla → yazdır. Eşzamanlı süreç ve dış olay yok; kontrol ana programdan alt yordamlara iner.'},
    {t:'kon', s:'Farklı firmaların ürettiği ama birlikte çalışması gereken yazılım araçları.', a:['yay'],
     w:'Araçlar birbirinin iç yapısını bilmeden ilgilendikleri olaylara kaydolur, ortak bir olay ve mesaj işleyici üzerinden çalışır. Kontrol politikası tek bir araçta olmadığı için yeni araç eklemek kolay.'},
    {t:'kon', s:'Uzaktan kumanda sinyallerine cevap veren televizyon denetleyicisi.', a:['kes'],
     w:'Her tuş bir kesme. Kesme türleri belli (güç, kanal, ses) ve her birinin işleyicisi var; cevap anında olmalı.'},
    {t:'kon', s:'Arabadaki hava yastığı sistemi: çarpışma sensörü tetiklenince milisaniyeler içinde açılmalı.', a:['kes'],
     w:'Zaman kısıtı çok sıkı bir gerçek zamanlı sistem. Olay sıra beklemeden doğrudan işleyicisine gitmeli.'},
    {t:'kon', s:'Görüntü sistemi, kol denetleyicisi, kavrayıcı ve konveyörün aynı anda çalıştığı ve birbirine göre koordine edilmesi gereken paketleme robotu.', a:['yon','kes'],
     w:'Eşzamanlı süreçler var ve bir denetleyici onları başlatıp durdurup koordine etmeli: yönetici modeli (slayt 32, gerçek zamanlı sistem kontrolü). Sensör olaylarına çok hızlı cevap gerekiyorsa kesme güdümlü de savunulabilir.'},
    {t:'kon', s:'Bir şirketin farklı şehirlerdeki bilgisayarlarında çalışan stok, sipariş ve sevkiyat alt sistemleri; yeni bir sipariş gelince ilgili alt sistemler haberdar olmalı.', a:['yay'],
     w:'Dağıtık bir sistem. "Yeni sipariş" olayı yayınlanır, ona kaydolmuş alt sistemler (stok, sevkiyat) işler.'},
    {t:'kon', s:'Kaynak kodu sırayla sözcük analizi, sözdizimi analizi ve kod üretiminden geçiren bir derleyici.', a:['cr'],
     w:'Sıralı işlem: ana program aşamaları sırayla çağırır. Ayrıştırma olarak da boru hattı modeline uyar.'},
    {t:'kon', s:'Seradaki sıcaklık ve nem sensörlerini birkaç saniyede bir yoklayıp ısıtıcı ve fanları açıp kapatan, zaman kısıtı sıkı olmayan kontrol sistemi.', a:['yon'],
     w:'Bir denetleyici sensör ve aktüatör süreçlerini döngü içinde yoklayıp yönetir. Kesme kadar hızlı cevap gerekmiyor, doğrulaması da daha kolay.'}
  ];

  var host = document.getElementById('pr-list'), scoreEl = document.getElementById('pr-score');
  if(!host) return;
  function build(){
    var items = P.slice(), right = 0, done = 0;
    for(var i = items.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = items[i]; items[i] = items[j]; items[j] = t; }
    function paint(){ scoreEl.textContent = right + ' / ' + done + (done < items.length ? ' · ' + (items.length - done) + ' sistem kaldı' : ' · bitti'); scoreEl.classList.toggle('good', done === items.length && right >= Math.ceil(items.length * 0.8)); }
    host.innerHTML = '';
    items.forEach(function(it, n){
      var box = document.createElement('div'), o = OPT[it.t];
      box.className = 'qz';
      box.innerHTML = '<span class="qn">Sistem ' + (n + 1) + ' · ' + o.h + '</span><p>' + esc(it.s) + '</p><div class="mopts"></div><p class="qexp" hidden></p>';
      var opts = box.querySelector('.mopts'), exp = box.querySelector('.qexp');
      o.o.forEach(function(op){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'opt'; b.textContent = op[1];
        b.addEventListener('click', function(){
          var ok = it.a.indexOf(op[0]) >= 0;
          opts.querySelectorAll('button').forEach(function(x, k){ x.disabled = true; if(it.a.indexOf(o.o[k][0]) >= 0) x.classList.add('right'); });
          if(!ok) b.classList.add('wrong');
          done++; if(ok) right++;
          exp.innerHTML = (ok ? '<b class="okc">Doğru.</b> ' : '<b class="badc">Olmadı.</b> ') + esc(it.w);
          exp.hidden = false;
          paint();
        });
        opts.appendChild(b);
      });
      host.appendChild(box);
    });
    paint();
  }
  document.getElementById('pr-again').addEventListener('click', build);
  build();
})();
