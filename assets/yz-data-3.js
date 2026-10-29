// Yapay Zeka · 3. kısım: genişletilmiş konu anlatımı, animasyon bağlantıları ve tahmini 1–2. hafta bölümleri.
// 1. ve 2. kısımdaki bölümlere kutu ekler, soru ve kutulara animasyon (anim) / şekil (fig) bağlar.
(function(){
  var R = String.raw;
  var Y = window.YZ, P = Y.parts;
  var part = function(no){ return P.filter(function(p){ return p.no === no; })[0]; };
  var idx = function(p, h){ for(var i = 0; i < p.konu.length; i++) if(p.konu[i].h === h) return i; throw new Error('başlık yok: ' + h); };
  // after: başlık metni (o kutudan sonra), '^' (en başa) ya da null (en sona)
  function add(no, after, boxes){
    var p = part(no), at = after === '^' ? 0 : after == null ? p.konu.length : idx(p, after) + 1;
    Array.prototype.splice.apply(p.konu, [at, 0].concat(boxes));
  }
  function setAnim(no, h, a){ part(no).konu[idx(part(no), h)].anim = a; }
  function q(no, id, props){ var x = part(no).qs.filter(function(z){ return z.id === id; })[0]; if(!x) throw new Error('soru yok ' + id); Object.keys(props).forEach(function(k){ x[k] = props[k]; }); }
  function addQs(no, list){ part(no).qs = part(no).qs.concat(list); }
  var S5 = ['bfs', 'dfs', 'ucs', 'greedy', 'astar'];

  // ================================================================ Bölüm 1
  add(1, 'Problemin 5 temel bileşeni ("Ne?")', [
    {h: R`Temel sözlük: durum, eylem, yol, çözüm`, ek: true, tbl: {h: ['Terim', 'Anlamı', 'Rota örneğinde'], r: [
      [R`**Durum** (state)`, R`Dünyanın o anki hâlinin ajan için önemli kısmı.`, R`"Araç Ezine'de."`],
      [R`**Eylem** (action)`, R`Bir durumda yapılabilen, durumu değiştiren hamle.`, R`"Edremit yoluna sap."`],
      [R`**Geçiş modeli**`, R`Sonuç(durum, eylem) = yeni durum.`, R`Sonuç(Ezine, Edremit'e git) = Edremit`],
      [R`**Yol** (path)`, R`Art arda gelen durumlar ve aralarındaki eylemler.`, R`Çanakkale → Ezine → Edremit`],
      [R`**Çözüm**`, R`Başlangıç durumundan hedef duruma götüren eylem dizisi.`, R`Çanakkale → … → İzmir`],
      [R`**Optimal çözüm**`, R`Yol maliyeti $g$ en düşük olan çözüm.`, R`En az km'lik rota`]]}},
    {h: R`Örnek problem tanımı: robot süpürge dünyası`, ek: true, p: [
      R`Sınavda "şu problemi 5 bileşeniyle tanımlayınız" gelebilir. Klasik örnek: iki kareli (Sol, Sağ) bir odada robot süpürge; her kare kirli ya da temiz olabilir.`],
      tbl: {h: ['Bileşen', 'Robot süpürge'], r: [
        [R`**Durumlar**`, R`Robotun yeri (2) × sol karenin durumu (2) × sağ karenin durumu (2) = **8 durum**`],
        [R`**Başlangıç durumu**`, R`Herhangi biri, örn. robot solda, iki kare de kirli`],
        [R`**Eylemler**`, R`Sola git, sağa git, süpür`],
        [R`**Geçiş modeli**`, R`"Süpür" bulunduğu kareyi temizler; solda "sola git" bir şey değiştirmez`],
        [R`**Hedef testi**`, R`İki kare de temiz mi?`],
        [R`**Yol maliyeti**`, R`Her eylem 1 → toplam adım sayısı`]]}}
  ]);
  setAnim(1, 'Durum uzayından arama ağacına', {t: 'expand', title: 'Haritadan arama ağacına: ağaç her adımda büyüyor'});
  add(1, 'Ağaç araması ve graf araması', [
    {h: R`Arama ağacındaki bir düğüm ne tutar?`, ek: true, li: [
      R`**Durum:** hangi şehirde/konumdayız.`, R`**Ata (parent):** bu düğüme hangi düğümden gelindi. Hedefe ulaşınca atalara geri giderek yol çıkarılır.`,
      R`**Eylem:** atadan buraya hangi hamleyle gelindi.`, R`**Yol maliyeti $g(n)$** ve **derinlik $d(n)$**.`],
      p2: [R`Aynı durum ağaçta birden çok düğümle temsil edilebilir (farklı yollardan gelinmiş). Explored set bu tekrarları ayıklar.`]},
    {h: R`Bütün arama algoritmalarının ortak iskeleti`, ek: true, p: [
      R`BFS, DFS, UCS, Greedy ve A*'ın hepsi aynı döngüyü çalıştırır. **Tek fark 3. adımda hangi düğümün seçildiğidir.** Bunu kavrarsan beş algoritmayı tek seferde öğrenmiş olursun.`],
      ol: [R`**Sınır (frontier)** listesine başlangıç düğümünü koy. Açılanlar (explored) kümesi boş.`, R`Sınır boşsa → çözüm yok, dur.`, R`Sınırdan bir düğüm **seç ve çıkar** (strateji burada: BFS en eskiyi, DFS en yeniyi, UCS en küçük $g$'yi, Greedy en küçük $h$'yi, A* en küçük $g + h$'yi seçer).`, R`Bu düğüm hedefse → atalarını izleyerek yolu döndür.`, R`Düğümü açılanlara ekle ve **genişlet:** çocuklarını üret, daha önce açılmamış olanları sınıra koy.`, R`2. adıma dön.`]}
  ]);
  q(1, '1.3', {fig: {g: 'cz', cap: 'Çanakkale–İzmir yol haritası (kenarlardaki sayılar km)'}});

  // ================================================================ Bölüm 2
  setAnim(2, 'BFS · Sığ (genişlik) öncelikli arama', {t: 'search', g: 'study', alg: 'bfs', algs: ['bfs', 'dfs', 'ucs'], title: 'Çalışma grafında kör arama: algoritmayı seç, adım adım izle'});
  add(2, 'BFS · Sığ (genişlik) öncelikli arama', [
    {h: R`BFS'yi kuyrukla adım adım düşün`, ek: true, p: [
      R`Kuyruk bir sıradır: **ilk giren ilk çıkar**. Bir düğüm açılınca çocukları kuyruğun **sonuna** eklenir. Bu yüzden önce 1 adım uzaktakilerin hepsi, sonra 2 adım uzaktakiler çıkar.`,
      R`Yukarıdaki animasyonda BFS'yi seç: S açılınca A ve B kuyruğa girer; A açılınca C eklenir (B zaten kuyrukta); B açılınca G eklenir. G'nin atası B olduğu için yol S → B → G çıkar. Bu yol **2 kenarlıdır** ama maliyeti 13'tür; daha ucuz olan S → A → B → C → G (8) 4 kenarlı olduğu için BFS onu tercih etmez.`]}
  ]);
  add(2, 'DFS · Derin öncelikli arama', [
    {h: R`BFS ve DFS'nin bedeli: zaman ve bellek`, ek: true, tbl: {h: ['', 'BFS', 'DFS'], r: [
      [R`**Zaman**`, R`$O(b^d)$: hedefin derinliğine kadar her şeyi üretir`, R`$O(b^m)$: $m$ en büyük derinlik; şanssızsa bütün ağacı gezer`],
      [R`**Bellek**`, R`$O(b^d)$: bir seviyenin tamamı kuyrukta bekler`, R`$O(b \cdot m)$: sadece üzerinde yürüdüğü yol ve kardeşleri`],
      [R`**Örnek** $b = 10$, $d = m = 6$`, R`Yaklaşık 1.000.000 düğüm bellekte`, R`Yaklaşık 60 düğüm bellekte`]]},
      p2: [R`Slayttaki "BFS belleği çabuk doldurur, DFS belleği yormaz" cümlesinin sayısal karşılığı budur.`]},
    {h: R`DFS'nin sonsuz döngü sorunu ve çözümleri`, ek: true, li: [
      R`Durum uzayında döngü varsa (Çanakkale ↔ Ezine) explored set tutmayan DFS sonsuza kadar gidip gelir; bu yüzden **tam değildir**.`,
      R`**Explored set:** açılmış durumu bir daha açmamak döngüyü kırar.`,
      R`**Derinlik sınırlı arama:** belli bir derinlikten sonra inmemek.`,
      R`**İteratif derinleştirme (IDS):** sınırı 0, 1, 2, … diye artırarak DFS'yi tekrar tekrar çalıştırmak. BFS'nin tamlığını DFS'nin az belleğiyle birleştirir.`]}
  ]);
  setAnim(2, 'DFS dolaşma sıraları', [{t: 'tree', g: 't07', alg: 'pre', algs: ['pre', 'post', 'bfs'], title: 'Ağaç 1: preorder, postorder ve BFS sırası', speed: 1200}, {t: 'tree', g: 'taf', alg: 'sdfs', algs: ['sdfs', 'pre', 'bfs'], title: 'Ağaç 2 (slayttaki): yığınla DFS neden A D F C E B verir?', speed: 1400}]);
  setAnim(2, 'UCS · Eşit maliyetli arama (Uniform Cost)', {t: 'search', g: 'ucs', alg: 'ucs', algs: ['ucs', 'bfs'], title: 'Slayttaki UCS grafı: UCS ile BFS aynı grafta'});
  add(2, 'UCS · Eşit maliyetli arama (Uniform Cost)', [
    {h: R`UCS neden her zaman en ucuz yolu bulur?`, ek: true, p: [
      R`UCS bir düğümü kuyruktan çıkardığında, kuyrukta kalan her yolun maliyeti ondan **büyük ya da eşittir**. Kenar maliyetleri negatif olmadığı için bu yollar uzadıkça daha da pahalılaşır; yani açılan düğüme daha ucuz bir yoldan ulaşmak imkânsızdır. Hedef açıldığı an bulunan yol en ucuzdur.`,
      R`Bu yüzden UCS'de hedef, **kuyruğa eklendiğinde değil, kuyruktan çıktığında** kontrol edilir. Slayttaki grafta End önce D üzerinden değil F üzerinden 80 ile kuyruğa girer; sonra D açılınca 95'lik bir yol daha bulunur ama 80 daha ucuz olduğu için değişmez.`,
      R`Animasyonda BFS'ye geç: BFS aynı grafta Start → A → B → D → End (145) bulur, çünkü B → D kenarı 100 olsa da tek adımdır.`]},
    {h: R`Hangi kör aramayı ne zaman seçerim?`, ek: true, tbl: {h: ['Durum', 'Seçim', 'Neden'], r: [
      [R`Bütün adımların maliyeti eşit, en kısa yol isteniyor`, R`**BFS**`, R`Eşit maliyette optimal ve tam`],
      [R`Bellek çok kısıtlı, çözüm derinde, herhangi bir çözüm yeter`, R`**DFS**`, R`Sadece bir yolu hatırlar`],
      [R`Kenar maliyetleri farklı, en ucuz yol şart, tahmin bilgisi yok`, R`**UCS**`, R`Her zaman optimal`]]}}
  ]);
  q(2, '2.1', {fig: {g: 'study', cap: 'Çalışma grafı (yönlü, kenarlarda maliyet)'}, anim: {t: 'search', g: 'study', alg: 'bfs'}});
  q(2, '2.2', {fig: {g: 'study'}, anim: {t: 'search', g: 'study', alg: 'dfs'}});
  q(2, '2.3', {fig: {g: 'study'}, anim: {t: 'search', g: 'study', alg: 'ucs'}});
  q(2, '2.4', {fig: {g: 'ucs', cap: 'Slayttaki UCS grafı'}, anim: {t: 'search', g: 'ucs', alg: 'ucs'}});
  q(2, '2.5', {fig: {g: 't07'}, anim: {t: 'tree', g: 't07', alg: 'pre', algs: ['pre', 'post']}});

  // ================================================================ Bölüm 3
  setAnim(3, 'Greedy · Açgözlü en-iyi ilk arama', {t: 'search', g: 'study', alg: 'greedy', algs: S5, title: 'Aynı grafta beş algoritma: Greedy ile A* farkını izle'});
  add(3, 'Sezgisel fonksiyon $h(n)$: en sık iki yöntem', [
    {h: R`İyi bir sezgisel nereden bulunur?`, ek: true, li: [
      R`**Problemi gevşet:** kuralları biraz kaldırıp kolaylaşan problemin cevabını tahmin olarak kullan. Duvarları yok sayarsan labirentte Manhattan mesafesi çıkar; yolları yok sayarsan kuş uçuşu mesafe çıkar. Gevşetilmiş problemin cevabı gerçek cevaptan büyük olamayacağı için bu sezgiseller **kabul edilebilir**dir.`,
      R`**8'li bulmaca örneği:** $h_1$ = yanlış yerdeki taş sayısı, $h_2$ = her taşın hedef yerine Manhattan mesafeleri toplamı. İkisi de kabul edilebilir; $h_2 \ge h_1$ olduğu için A* $h_2$ ile **daha az düğüm** açar (daha bilgili sezgisel).`,
      R`$h(n) = 0$ seçersen A* UCS'ye dönüşür: doğru ama yavaş. $h$ gerçeğe yaklaştıkça arama hızlanır; gerçeği aşarsa optimallik bozulur.`]}
  ]);
  add(3, 'A* (A-yıldız) araması', [
    {h: R`Greedy, UCS ve A*: tek formülün üç hâli`, ek: true, tbl: {h: ['Algoritma', 'Neye bakar?', 'Benzetme'], r: [
      [R`**UCS** $f = g$`, R`Sadece geçmiş: buraya kaça geldim?`, R`Dikiz aynasına bakan şoför`],
      [R`**Greedy** $f = h$`, R`Sadece gelecek: hedefe ne kadar kaldı (tahmin)?`, R`Sadece hedef tabelasına bakan şoför`],
      [R`**A*** $f = g + h$`, R`İkisi birden: toplam fatura ne olacak?`, R`Hem aynaya hem tabelaya bakan şoför`]]},
      p2: [R`Yukarıdaki animasyonda aynı grafta Greedy S → B → G (13), A* S → A → B → C → G (8) bulur. A*'ta açılan düğümlerin f değerleri 7, 7, 7, 7, 8: hiç düşmüyor (tutarlılık).`]},
    {h: R`A* ne zaman durur? (sık yapılan hata)`, ek: true, p: [
      R`Hedef **kuyruğa ilk girdiği an değil, kuyruktan çıktığı (açıldığı) an** durulur. Çalışma grafında G kuyruğa önce B üzerinden f = 11 ile girer; durursak 11'lik yolu verirdik. A* devam eder, C'yi açar ve G'yi f = 8 ile günceller. G açıldığında elimizdeki yol en ucuzdur.`]}
  ]);
  add(3, 'Tutarlı olan kabul edilebilirdir', [
    {h: R`Çanakkale–İzmir: A* neden yanıldı?`, anim: {t: 'search', g: 'cz', alg: 'astar', algs: ['greedy', 'astar', 'ucs', 'bfs'], title: 'Slayttaki soru: Greedy, A*, UCS karşılaştırması'}, p: [
      R`Slayttaki soruda iki yol var: sahil (Ezine–Edremit, 300 km) ve iç kesim (Çan–Balıkesir, 285 km). Animasyonda A*'ı izle: Ezine (235) ve Edremit (240) önce açılır, İzmir f = 300 ile kuyruğa girer. Çan (275) açılınca Balıkesir f = 155 + 150 = **305** olur. 300 < 305 olduğu için İzmir açılır ve A* **300'lük yolu** döndürür.`,
      R`Gerçek en kısa yol 285. Sebep: h(Balıkesir) = 150, Balıkesir'den İzmir'e gerçek mesafe ise 130. **Tahmin gerçeği abartıyor** → kabul edilebilirlik bozuk → A*'ın garantisi yok. UCS'yi seçersen 285'i bulduğunu görürsün (çünkü tahmin kullanmaz).`,
      R`Sınavda bu soru gelirse A*'ın adımlarını yaz, 300 bulduğunu söyle ve "h(Balıkesir) > h*(Balıkesir) olduğu için kabul edilebilir değil" diye açıkla. Bu cümle tam puanın anahtarı.`]}
  ]);
  q(3, '3.1', {fig: {g: 'study', h: true, cap: 'Çalışma grafı; düğüm altlarında sezgisel h değerleri'}, anim: {t: 'search', g: 'study', alg: 'greedy'}});
  q(3, '3.2', {fig: {g: 'study', h: true}, anim: {t: 'search', g: 'study', alg: 'astar', algs: ['astar', 'greedy', 'ucs']}});
  q(3, '3.3', {fig: {g: 'study', h: true}});
  q(3, '3.4', {fig: {g: 'cz', h: true, cap: 'Kenarlarda gerçek km, düğüm altlarında İzmir\'e kuş uçuşu tahmin h'}, anim: {t: 'search', g: 'cz', alg: 'astar', algs: ['greedy', 'astar', 'ucs']}});

  // ================================================================ Bölüm 4
  setAnim(4, 'Örnek: kargo aracının 4 durak sırası', {t: 'local', alg: 'hc', algs: ['hc', 'sa', 'sa2', 'tabu'], title: 'Aynı manzarada üç algoritma (top = mevcut durum)', speed: 2000});
  setAnim(4, 'Sıcaklık neden önemli?', {t: 'saprob'});
  add(4, 'Durum uzayı manzarası', [
    {h: R`Komşu durum nedir?`, ek: true, p: [
      R`Yerel aramada her adım mevcut çözümün **küçük bir değişikliğidir**. Rota problemlerinde en yaygın hamle iki durağın yerini değiştirmektir (swap): [A,B,C,D] → [B,A,C,D] slayttaki "1↔2 değişimi"dir. 4 duraklı bir rotada $\binom{4}{2} = 6$ farklı swap, yani 6 komşu vardır; 100 durakta 4950 komşu. Tabu aramanın "bütün komşulara bakma" maliyeti buradan gelir.`]}
  ]);
  add(4, '1 · Tepe tırmanma (Hill Climbing)', [
    {h: R`Tepe tırmanmanın çeşitleri`, ek: true, li: [
      R`**En dik çıkış (steepest ascent):** bütün komşulara bakıp en iyisine gitmek. Slayttaki algoritma budur.`,
      R`**İlk iyi (first choice):** komşuları rastgele dener, ilk daha iyi olana gider. Komşu çoksa hızlıdır.`,
      R`**Rastgele yeniden başlatma (random restart):** farklı rastgele başlangıçlardan defalarca tırmanıp en iyi sonucu almak. Yerel maksimum tuzağına karşı en basit çare.`]}
  ]);
  add(4, '3 · Tabu arama (Tabu Search)', [
    {h: R`Üç tekil durum algoritmasının karşılaştırması`, tbl: {h: ['', 'Tepe tırmanma', 'Tavlama benzetimi', 'Tabu arama'], r: [
      [R`**Komşulara bakış**`, R`Hepsi, en iyisi`, R`Rastgele bir tane`, R`Hepsi, en iyi (yasaklı olmayan)`],
      [R`**Kötü hamle**`, R`Asla`, R`Olasılıkla: $e^{-|\Delta E|/T}$`, R`Mecburen (durmak yasak)`],
      [R`**Hafıza**`, R`Yok`, R`Yok (sadece T)`, R`Tabu listesi (son k hamle)`],
      [R`**Takıldığı yer**`, R`Yerel maksimum, plato`, R`Aynı yamaçlara tekrar tırmanabilir`, R`Nadiren; ama yavaş`],
      [R`**Hız / sürekli uzay**`, R`En hızlı / evet (gradyan inişi)`, R`Hızlı / evet`, R`Yavaş / hayır`]]}}
  ]);
  q(4, '4.1', {anim: {t: 'local', alg: 'hc'}});
  q(4, '4.2', {anim: {t: 'local', alg: 'sa', algs: ['sa', 'sa2']}});
  q(4, '4.3', {anim: {t: 'saprob'}});
  q(4, '4.4', {anim: {t: 'local', alg: 'tabu'}});

  // ================================================================ Bölüm 5
  setAnim(5, 'GA örneği: sırt çantası (knapsack) problemi', {t: 'ga', title: 'Sırt çantası: bir neslin adım adım evrimi', speed: 2200});
  add(5, 'GA örneği: sırt çantası (knapsack) problemi', [
    {h: R`Seçilim nasıl yapılır?`, ek: true, li: [
      R`**Rulet tekerleği:** her bireyin seçilme olasılığı uygunluğuyla orantılı. A (180) ve B (200) için: A %47, B %53. Zayıf birey de bazen seçilir; çeşitlilik korunur.`,
      R`**Turnuva seçimi:** rastgele birkaç birey seçilir, aralarından en iyisi ebeveyn olur.`,
      R`**Elitizm:** en iyi bir-iki birey değişmeden bir sonraki nesle aktarılır; en iyi çözüm hiç kaybolmaz.`,
      R`**Sınır dışı bireyler:** ya elenir ya uygunluğuna büyük bir **ceza** eklenir (örn. değer − 100 × aşan kg).`]},
    {h: R`Çaprazlama ve mutasyon oranları`, ek: true, p: [
      R`Çaprazlama sık yapılır (tipik olasılık 0,7–0,9); iyi parçaları birleştirmek ana motordur. Mutasyon çok seyrek yapılır (gen başına ~%1); fazla mutasyon aramayı rastgele yürüyüşe çevirir, hiç mutasyon olmazsa popülasyon tek tipe yakınsayıp yerel maksimumda kalır.`]}
  ]);
  add(5, 'PSO güncelleme formülü', [
    {h: R`PSO'yu tek sayıyla dene`, ek: true, p: [
      R`Tek boyutta bir parçacık: konum $x = 2$, hız $v = 1$, kendi en iyisi $P_{best} = 3$, sürünün en iyisi $G_{best} = 6$. Katsayılar $w = 0{,}5$, $c_1 = c_2 = 1$, rastgele sayılar $r_1 = r_2 = 0{,}5$:`,
      R`$v = 0{,}5 \cdot 1 + 1 \cdot 0{,}5 \cdot (3 - 2) + 1 \cdot 0{,}5 \cdot (6 - 2) = 0{,}5 + 0{,}5 + 2 = 3$, yeni konum $x = 2 + 3 = 5$. Parçacık hem kendi en iyisine hem (daha güçlü olarak) sürünün en iyisine doğru çekildi.`]}
  ]);
  add(5, 'Karınca kolonisi optimizasyonu (ACO)', [
    {h: R`Rulet seçimiyle bir yol seçimi`, ek: true, p: [
      R`Bir karınca iki yol arasında kalıyor: kısa yol (uzunluk 2) ve uzun yol (uzunluk 4). Feromon ikisinde eşit ($\tau = 1$), sezgisel bilgi $\eta = 1/\text{uzunluk}$. Seçim olasılığı $\tau \cdot \eta$ ile orantılı: kısa yol $0{,}5$, uzun yol $0{,}25$ → kısa yolu seçme olasılığı $0{,}5 / 0{,}75 \approx$ **%67**. Kısa yoldan dönenler oraya daha çok feromon bıraktıkça bu oran giderek artar (pozitif geri bildirim).`]},
    {h: R`GA, PSO ve ACO karşılaştırması`, tbl: {h: ['', 'Genetik algoritma', 'Parçacık sürü', 'Karınca kolonisi'], r: [
      [R`**İlham**`, R`Evrim, doğal seçilim`, R`Kuş/balık sürüsü`, R`Karıncaların feromon izi`],
      [R`**Birey**`, R`Kromozom (gen dizisi)`, R`Konum + hız`, R`Yol kuran karınca`],
      [R`**Bilgi paylaşımı**`, R`Çaprazlama ile genler`, R`$G_{best}$ duyurusu`, R`Ortamdaki feromon (dolaylı)`],
      [R`**Eleme**`, R`Var`, R`Yok`, R`Yok (kötü izler buharlaşır)`],
      [R`**Tipik problem**`, R`Tasarım, sırt çantası, çizelge`, R`Sürekli sayısal ayar (hiperparametre)`, R`Rotalama, TSP`]]}}
  ]);
  q(5, '5.2', {anim: {t: 'ga'}});

  // ================================================================ Bölüm 6
  setAnim(6, 'K-en yakın komşuluk (K-NN)', {t: 'knn', title: 'Slayttaki tablo: yeni öğrenci geçer mi?', speed: 2000});
  add(6, 'K-en yakın komşuluk (K-NN)', [
    {h: R`K-NN adım adım`, ek: true, ol: [R`Yeni noktanın eğitim verisindeki **her noktaya mesafesini** hesapla (Öklid ya da Manhattan).`, R`Mesafeleri küçükten büyüğe **sırala**.`, R`İlk **K** noktayı al.`, R`Bu K noktanın sınıflarına bak; **çoğunluk** hangisiyse onu ver. (Regresyonda K komşunun değerlerinin ortalaması alınır.)`],
      p2: [R`K-NN "tembel öğrenici"dir: eğitim aşamasında bir şey öğrenmez, veriyi saklar; bütün hesap tahmin anında yapılır. Bu yüzden veri büyüdükçe tahmin yavaşlar.`]}
  ]);
  add(6, 'Karar ağaçları (decision tree)', [
    {h: R`Karar ağacı hangi soruyu önce sorar?`, ek: true, p: [
      R`Ağaç her düğümde veriyi **en iyi ayıran** özelliği seçer: soru sorulduktan sonra oluşan grupların olabildiğince "saf" (tek sınıftan) olması istenir. Saflık **entropi** ya da **Gini** ile ölçülür. Slayttaki hayvan ağacında "kaç bacağı var?" ilk soru olarak çok iyi bir ayırıcıdır: 0 bacak tek başına yılanı ayırır.`,
      R`Avantajı: kuralları okunabilir, açıklanabilir (doğru yöntem seçmede "açıklanabilirlik" sorusu). Dezavantajı: çok derin ağaç eğitim verisini ezberler (overfitting, Bölüm 8).`]}
  ]);
  add(6, 'Doğrusal regresyon', [
    {h: R`Doğru nasıl hesaplanır? (en küçük kareler)`, ek: true, p: [R`MSE'yi en küçük yapan eğim ve sapma kapalı formülle bulunur:`],
      f: [R`W = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2} \qquad b = \bar{y} - W \bar{x}`],
      p2: [R`Örnek: $x = 1, 2, 3$ ve $y = 2, 3, 5$. $\bar{x} = 2$, $\bar{y} = 10/3$. Pay: $(-1)(-4/3) + 0 + (1)(5/3) = 3$; payda: $1 + 0 + 1 = 2$ → $W = 1{,}5$, $b = 10/3 - 3 = 1/3$. Model $\hat{y} = 1{,}5x + 0{,}33$; $x = 4$ için tahmin $6{,}33$.`]}
  ]);
  addQs(6, [
    {id: '6.9', q: R`Veri: $x = 1, 2, 3$ ve $y = 2, 3, 5$. En küçük kareler doğrusunu ($W$ ve $b$) bulunuz ve $x = 4$ için tahmin yapınız.`,
      st: [R`$\bar{x} = 2$, $\bar{y} = (2 + 3 + 5)/3 = 10/3 \approx 3{,}33$.`, R`$\sum (x_i - \bar{x})(y_i - \bar{y}) = (-1)(-1{,}33) + 0 \cdot (-0{,}33) + 1 \cdot 1{,}67 = 3$.`, R`$\sum (x_i - \bar{x})^2 = 1 + 0 + 1 = 2$ → $W = 3/2 = 1{,}5$.`, R`$b = \bar{y} - W\bar{x} = 3{,}33 - 3 = 0{,}33$.`, R`$x = 4$: $\hat{y} = 1{,}5 \cdot 4 + 0{,}33 = 6{,}33$.`],
      ans: R`$\hat{y} = 1{,}5x + 0{,}33$; $x = 4$ için **6,33**.`}
  ]);
  q(6, '6.1', {anim: {t: 'knn'}});

  // ================================================================ Bölüm 7
  setAnim(7, 'K-Means kümeleme', {t: 'kmeans', title: 'K-Means: ata → güncelle → tekrar', speed: 1800});
  add(7, 'K-Means kümeleme', [
    {h: R`K-Means neyi küçültür?`, ek: true, p: [R`Her noktanın kendi küme merkezine uzaklığının karesi toplanır (küme içi kareler toplamı, **WCSS** ya da inertia). Atama adımı her noktayı en yakın merkeze vererek, güncelleme adımı merkezi ortalamaya taşıyarak bu toplamı **hiç artırmaz**; bu yüzden algoritma mutlaka durur. Ama durduğu yer başlangıç merkezlerine bağlı bir **yerel en iyi** olabilir. Çare: farklı başlangıçlarla birkaç kez çalıştırmak ya da merkezleri birbirinden uzak seçmek (k-means++).`],
      f: [R`\text{WCSS} = \sum_{k=1}^{K} \sum_{x \in C_k} \lVert x - \mu_k \rVert^2`]},
    {h: R`Sınıflandırma ile kümeleme farkı`, tbl: {h: ['', 'Sınıflandırma (gözetimli)', 'Kümeleme (gözetimsiz)'], r: [
      [R`**Veri**`, R`Etiketli`, R`Etiketsiz`],
      [R`**Grup sayısı**`, R`Etiketlerden belli`, R`Biz seçeriz (K) ya da algoritma bulur`],
      [R`**Çıktı**`, R`"kedi", "spam"`, R`"Küme 1", "Küme 2"`],
      [R`**Örnek algoritma**`, R`K-NN, karar ağacı`, R`K-Means, mean shift`],
      [R`**İsim benzerliği tuzağı**`, R`K-NN: K = komşu sayısı`, R`K-Means: K = küme sayısı`]]}},
    {h: R`Mean shift ve Gaussian mixture kısaca`, ek: true, li: [
      R`**Mean shift:** her nokta çevresindeki noktaların ortalamasına doğru kayar; noktalar yoğunluğun tepelerinde toplanır. Küme sayısını kendisi bulur.`,
      R`**Gaussian mixture (GMM):** her kümeyi bir normal dağılım (çan eğrisi) olarak modeller; her noktaya "bu kümeye %80 aitsin" gibi **olasılıklı (yumuşak)** atama yapar. K-Means'te atama kesindir (sert).`]}
  ]);

  // ================================================================ Bölüm 8
  setAnim(8, 'K-katlı çapraz doğrulama', {t: 'kfold', title: '5 katlı çapraz doğrulama', speed: 1500});
  add(8, 'Eksik öğrenme (underfitting)', [
    {h: R`Aşırı ve eksik öğrenmeyi bir grafikte düşün`, ek: true, p: [
      R`Yatay eksende **model karmaşıklığı**, dikeyde **hata** olsun. Karmaşıklık arttıkça **eğitim hatası** hep düşer. **Doğrulama hatası** önce düşer, sonra yeniden yükselir.`,
      R`Sol taraf (iki hata da yüksek) **underfitting**; sağ taraf (eğitim hatası çok düşük, doğrulama hatası yükseliyor) **overfitting**. En iyi model doğrulama hatasının dibindeki karmaşıklıktır. Doğrulama setinin işi tam olarak bu noktayı bulmaktır.`]}
  ]);
  add(8, 'Precision mı recall mı?', [
    {h: R`ROC eğrisi ve AUC`, ek: true, p: [
      R`Çoğu sınıflandırıcı bir olasılık verir; "0,5'in üstü pozitif" gibi bir **eşik** seçilir. Eşik düşerse daha çok pozitif yakalanır (recall artar) ama yanlış alarm da artar. **ROC eğrisi** farklı eşiklerde duyarlılığı (TP oranı) yanlış alarm oranına (FPR = FP / (FP + TN)) karşı çizer. **AUC** bu eğrinin altındaki alandır: 0,5 rastgele tahmin, 1 mükemmel ayırıcı.`]}
  ]);
  add(8, 'Sınıf dengesizliği yanılgısı: doğruluk paradoksu', [
    {h: R`Resampling ve class weights ne yapar?`, ek: true, li: [
      R`**Oversampling:** azınlık sınıfının örnekleri çoğaltılır (kopyalanır ya da SMOTE ile benzerleri üretilir).`,
      R`**Undersampling:** çoğunluk sınıfından örnek atılarak dengelenir (veri kaybı riski).`,
      R`**Class weights:** model eğitilirken azınlık sınıfında yapılan hataya daha büyük ceza verilir; örneğin kanser vakasını kaçırmak 99 kat pahalı sayılır.`,
      R`Doğru metrik: dengesiz veride accuracy yerine **recall, precision, F1** ya da **AUC** raporlanır.`]}
  ]);
  q(8, '8.5', {anim: {t: 'kfold'}});

  // ================================================================ Bölüm 9
  setAnim(9, 'Yeni müşteriler ve neden tek katman yetti?', {t: 'perc', title: 'Perceptron kredi örneği: rastgele ağırlıktan öğrenilmiş doğruya', speed: 2400});
  setAnim(9, 'MLP XOR\'u nasıl çözer?', {t: 'xor', title: 'XOR: tek doğru yetmez, gizli katman uzayı büker', speed: 2600});
  setAnim(9, 'Aktivasyon fonksiyonları', {t: 'act', title: 'Üç aktivasyon fonksiyonu'});
  add(9, 'Örnek: banka kredi onayı', [
    {h: R`Perceptron nasıl öğrenir? (öğrenme kuralı)`, ek: true, p: [R`Her eğitim örneğinde tahmin $\hat{y}$ hesaplanır; yanlışsa ağırlıklar hata yönünde düzeltilir ($\eta$ öğrenme oranı):`],
      f: [R`w_i \leftarrow w_i + \eta \, (y - \hat{y}) \, x_i \qquad b \leftarrow b + \eta \, (y - \hat{y})`],
      p2: [R`Örnek (AND, $\eta = 1$, başta $w_1 = w_2 = b = 0$): (0,0) için $z = 0 \Rightarrow \hat{y} = 1$ ama $y = 0$ → hata −1: $b = -1$. (1,1) için $z = -1 \Rightarrow \hat{y} = 0$, $y = 1$ → hata +1: $w_1 = 1$, $w_2 = 1$, $b = 0$. Bu şekilde örnekler üzerinde birkaç tur dönülünce ağırlıklar dört noktanın hepsini doğru ayıran bir doğruya yerleşir. Doğru tahminde ($y = \hat{y}$) hiçbir şey değişmez.`]}
  ]);
  add(9, 'Epoch ve batch size', [
    {h: R`Geri yayılım ve gradyan inişi sezgisel olarak`, ek: true, li: [
      R`**Kayıp (loss) $L$:** tahminle gerçek arasındaki farkın ölçüsü (örn. MSE).`,
      R`**Gradyan** $\partial L / \partial w$: ağırlığı biraz artırırsam kayıp ne kadar artar? **Geri yayılım** bu türevi çıktı katmanından girişe doğru zincir kuralıyla bütün ağırlıklar için hesaplar.`,
      R`**Gradyan inişi:** her ağırlığı gradyanın tersi yönünde küçük bir adım oynat: $w \leftarrow w - \eta \, \partial L / \partial w$. Sisli bir dağda her adımda en dik iniş yönüne basmak gibi (Bölüm 4'teki tepe tırmanmanın sürekli uzaydaki tersi).`,
      R`**Öğrenme oranı $\eta$:** çok büyükse vadiyi atlayıp salınır, çok küçükse çok yavaş iner.`]},
    {h: R`Bir ağda kaç parametre var?`, ek: true, p: [R`Her katmanda (giriş sayısı × nöron sayısı) ağırlık + nöron sayısı kadar bias. XOR ağı (2 giriş → 2 gizli → 1 çıktı): $(2 \times 2 + 2) + (2 \times 1 + 1) = 6 + 3 = 9$ parametre. Eğitim bu 9 sayıyı bulmaktır.`]}
  ]);
  q(9, '9.1', {anim: {t: 'perc'}});
  q(9, '9.5', {anim: {t: 'xor'}});

  // ================================================================ Tahmini 1. ve 2. hafta
  P.push({
    no: 10, ord: -2, lbl: 'Giriş 1', hafta: 'Hafta 1 · tahmini', grp: 'Giriş: 1–2. hafta (tahmini)', title: 'Yapay zekaya giriş',
    ozet: R`Fotoğrafı olmayan 1. haftanın tahmini içeriği: yapay zekanın tanımları ve 4 yaklaşım, Turing testi, kısa tarihçe, dar ve genel yapay zeka, alt alanlar. Standart müfredattan (Russell & Norvig 1. bölüm) hazırlandı.`,
    konu: [
      {h: R`Bu bölüm neden "tahmini"?`, ek: true, p: [R`1. ve 2. haftanın fotoğrafı yok. 3. haftanın ilk slaytı "PEAS ile 2. haftada otonom bir araç tasarladık" diyor; 5. hafta da "yapay zeka ⊃ makine öğrenmesi ⊃ YSA ⊃ derin öğrenme" halkalarını gösteriyor. Bu ipuçları dersin standart yapay zeka müfredatını izlediğini gösteriyor. Bu yüzden 1. hafta için giriş konuları, 2. hafta için akıllı ajanlar ve PEAS yazıldı. Hocanın anlattıklarıyla birebir aynı olmayabilir; sınıftan biriyle karşılaştır.`]},
      {h: R`Yapay zeka nedir? Dört yaklaşım`, p: [R`Yapay zeka, insanın zeki dediği işleri (öğrenme, akıl yürütme, problem çözme, algılama, dil) yapabilen sistemler üretmeyi amaçlayan bilgisayar bilimi alanıdır. Tanımlar iki eksende ayrılır: **düşünce mi davranış mı**, **insan gibi mi rasyonel mi**.`],
        tbl: {h: ['', 'İnsan gibi', 'Rasyonel (ideal, doğru)'], r: [
          [R`**Düşünme**`, R`İnsan gibi düşünen sistemler: bilişsel modelleme (insan zihninin nasıl çalıştığını taklit)`, R`Rasyonel düşünen sistemler: mantık, "düşünce yasaları" (Aristoteles'in kıyasları)`],
          [R`**Davranma**`, R`İnsan gibi davranan sistemler: **Turing testi** yaklaşımı`, R`Rasyonel davranan sistemler: **rasyonel ajan** yaklaşımı (bugünkü ana yaklaşım; 2. hafta)`]]}},
      {h: R`Turing testi (1950)`, li: [
        R`Alan Turing'in "Makineler düşünebilir mi?" sorusuna önerdiği deney: bir sorgulayıcı yazışarak bir insanla ve bir makineyle konuşur. Hangisinin makine olduğunu ayırt edemezse makine testi **geçmiş** sayılır.`,
        R`Testi geçmek için gereken yetenekler: **doğal dil işleme** (iletişim), **bilgi temsili** (bildiğini saklamak), **otomatik akıl yürütme** (soruları cevaplamak, sonuç çıkarmak), **makine öğrenmesi** (yeni duruma uyum).`,
        R`**Tam Turing testi** (fiziksel etkileşimli): buna **bilgisayarla görme** ve **robotik** eklenir.`,
        R`Eleştiri (Searle'ün Çin odası): sembolleri kurala göre işleyip doğru cevap vermek "anlamak" anlamına gelmeyebilir.`]},
      {h: R`Kısa tarihçe`, tbl: {h: ['Yıl', 'Olay'], r: [
        ['1943', R`McCulloch ve Pitts: ilk yapay nöron modeli`],
        ['1950', R`Turing: "Computing Machinery and Intelligence", Turing testi`],
        ['1956', R`**Dartmouth konferansı:** "yapay zeka" terimi doğdu (John McCarthy)`],
        ['1957', R`Rosenblatt: **perceptron** (7. hafta)`],
        ['1969', R`Minsky ve Papert: tek katmanlı perceptron XOR'u çözemez → ilk "YZ kışı"na katkı`],
        ['1980\'ler', R`Uzman sistemler (kural tabanlı klasik YZ); 1986'da geri yayılımın yaygınlaşması`],
        ['1997', R`IBM Deep Blue, satrançta dünya şampiyonu Kasparov'u yendi (arama tabanlı)`],
        ['2012', R`Derin öğrenme patlaması: AlexNet görüntü tanımada büyük sıçrama`],
        ['2016', R`AlphaGo, Go'da Lee Sedol'u yendi (MCTS + derin ağ; 4. haftadaki MCTS)`],
        ['2017–2022', R`Transformer mimarisi (2017), ChatGPT ile büyük dil modelleri (2022)`]]}},
      {h: R`Dar, genel ve süper yapay zeka`, li: [
        R`**Dar (zayıf) YZ:** tek bir işte iyi olan sistem (satranç programı, spam filtresi, yüz tanıma). Bugünkü bütün sistemler bu gruptadır.`,
        R`**Genel (güçlü) YZ, AGI:** insan gibi her türlü zihinsel işi öğrenip yapabilen sistem. Henüz yok; tartışma ve araştırma konusu.`,
        R`**Süper zeka:** her alanda insanı aşan varsayımsal sistem.`]},
      {h: R`Yapay zekanın alt alanları`, li: [
        R`**Arama ve planlama** (3–4. hafta): rota bulma, oyun oynama, çizelgeleme.`,
        R`**Makine öğrenmesi** (5–6. hafta) ve **yapay sinir ağları / derin öğrenme** (7. hafta).`,
        R`**Doğal dil işleme:** çeviri, sohbet botları, büyük dil modelleri.`,
        R`**Bilgisayarla görme:** nesne tanıma, otonom araç kameraları.`,
        R`**Robotik**, **uzman sistemler** (kural tabanlı), **bilgi temsili ve akıl yürütme**.`,
        R`5. haftadaki şema: **YZ ⊃ makine öğrenmesi ⊃ YSA ⊃ derin öğrenme ⊃ üretken YZ**; büyük veri ve NLP bunlarla kesişir.`]}
    ],
    ezber: [
      R`4 yaklaşım: insan gibi düşünen, insan gibi davranan (Turing testi), rasyonel düşünen (mantık), rasyonel davranan (rasyonel ajan).`,
      R`Turing testi (1950): sorgulayıcı insanı makineden ayırt edemezse makine geçer. Gerekenler: NLP, bilgi temsili, akıl yürütme, öğrenme (+ görme, robotik).`,
      R`1956 Dartmouth = "yapay zeka" teriminin doğuşu (McCarthy). 1957 perceptron. 1997 Deep Blue. 2016 AlphaGo.`,
      R`Dar YZ (bugün) / genel YZ (AGI, henüz yok) / süper zeka.`],
    formul: [],
    qs: [
      {id: 'G1.1', q: R`Yapay zekanın dört yaklaşımını tablo hâlinde yazınız. Bugün hangisi ana yaklaşımdır?`, ans: R`İnsan gibi düşünme (bilişsel modelleme), insan gibi davranma (Turing testi), rasyonel düşünme (mantık), rasyonel davranma (rasyonel ajan). Bugünkü ana yaklaşım **rasyonel ajan** yaklaşımıdır: performans ölçütünü en iyi yapacak eylemi seçen ajan.`},
      {id: 'G1.2', q: R`Turing testi nedir? Bir makinenin bu testi geçmesi için hangi yeteneklere sahip olması gerekir?`, ans: R`Bir sorgulayıcının yazışarak insanı makineden ayırt edemediği durumda makinenin "zeki davrandığı" kabul edilir (Turing, 1950). Gereken yetenekler: doğal dil işleme, bilgi temsili, otomatik akıl yürütme, makine öğrenmesi; fiziksel (tam) testte ayrıca bilgisayarla görme ve robotik.`},
      {id: 'G1.3', q: R`Olayları tarih sırasına diziniz: AlphaGo, Dartmouth konferansı, perceptron, Deep Blue, Turing testi makalesi.`, ans: R`Turing makalesi (1950) → Dartmouth (1956) → perceptron (1957) → Deep Blue (1997) → AlphaGo (2016).`},
      {id: 'G1.4', q: R`Dar yapay zeka ile genel yapay zeka arasındaki fark nedir? Birer örnek veriniz.`, ans: R`Dar YZ tek bir işte uzmanlaşmıştır (spam filtresi, satranç programı). Genel YZ (AGI) insan gibi her türlü zihinsel işi öğrenip yapabilen sistemdir; henüz yoktur.`}
    ]
  });
  P.push({
    no: 11, ord: -1, lbl: 'Giriş 2', hafta: 'Hafta 2 · tahmini', grp: 'Giriş: 1–2. hafta (tahmini)', title: 'Akıllı ajanlar ve PEAS',
    ozet: R`2. haftanın tahmini içeriği: ajan, algılayıcı ve eyleyici, rasyonel ajan, PEAS tanımı (3. haftanın başında tekrarı var), çevre türleri ve beş ajan türü.`,
    konu: [
      {h: R`Ajan nedir?`, li: [
        R`**Ajan:** çevresini **algılayıcılar (sensörler)** ile algılayan ve çevresine **eyleyiciler (aktüatörler)** ile etki eden her şey. İnsan (gözler / eller), robot (kamera / motorlar), yazılım ajanı (klavye girdisi, dosya / ekrana yazmak).`,
        R`**Algı (percept):** ajanın bir anda aldığı girdi. **Algı dizisi:** ajanın o ana kadar aldığı bütün algılar.`,
        R`**Ajan fonksiyonu:** algı dizisini eyleme eşleyen matematiksel tanım. **Ajan programı:** bu fonksiyonu gerçekleştiren kod.`]},
      {h: R`Rasyonel ajan`, p: [
        R`**Rasyonel ajan**, her olası algı dizisi için, algı dizisinin sağladığı kanıta ve sahip olduğu bilgiye dayanarak **performans ölçütünü en yüksek yapması beklenen** eylemi seçen ajandır.`,
        R`Rasyonel olmak **her şeyi bilmek** değildir (karşıdan karşıya bakarak geçen kişi, düşen bir uçak parçası yüzünden zarar görse de rasyoneldir). Rasyonellik dört şeye bağlıdır: **performans ölçütü, çevre hakkındaki ön bilgi, yapılabilen eylemler, algı dizisi.**`]},
      {h: R`PEAS: görev ortamını tanımlamak`, p: [R`Bir ajan tasarlamadan önce görev ortamı dört başlıkla tanımlanır: **P**erformance (performans ölçütü), **E**nvironment (çevre), **A**ctuators (eyleyiciler), **S**ensors (algılayıcılar). 3. haftanın ilk slaytı derste yapılan otonom araç örneğini tekrar ediyor (tablonun ilk satırı).`],
        tbl: {h: ['Ajan', 'P (performans)', 'E (çevre)', 'A (eyleyici)', 'S (algılayıcı)'], r: [
          [R`**Otonom araç** (derste)`, R`Kaza yapmadan hızlı gitmek; güvenlik, konfor, yasal sürüş`, R`Kuralları olan trafik ortamı: yollar, araçlar, yayalar`, R`Direksiyon, gaz, fren, sinyal`, R`Kameralar, GPS, radar/lidar, hız göstergesi`],
          [R`**Robot süpürge**`, R`Temizlenen alan, harcanan enerji, süre`, R`Ev, mobilyalar, halı, kir`, R`Tekerlekler, fırça, vakum`, R`Çarpma sensörü, kir sensörü, kamera`],
          [R`**Tıbbi teşhis sistemi**`, R`Doğru teşhis, hasta sağlığı, maliyet`, R`Hasta, hastane, personel`, R`Ekrana soru, teşhis ve tedavi önerisi`, R`Klavye girdisi: belirtiler, tahlil sonuçları`],
          [R`**Spam filtresi**`, R`Doğru ayıklanan e-posta oranı`, R`E-posta sunucusu, kullanıcının kutusu`, R`Spam klasörüne taşıma, etiketleme`, R`Gelen e-postanın metni ve başlıkları`]]}},
      {h: R`Çevre türleri`, tbl: {h: ['Özellik', 'Bir uç', 'Öbür uç'], r: [
        [R`**Gözlemlenebilirlik**`, R`Tam gözlemlenebilir: algılayıcılar çevrenin bütün ilgili durumunu görür (satranç tahtası)`, R`Kısmi gözlemlenebilir: bir kısmı görünmez (trafikte köşedeki araç, kartlar kapalı poker)`],
        [R`**Belirlilik**`, R`Deterministik: sonraki durum mevcut durum ve eylemle kesin belli (satranç)`, R`Stokastik: belirsizlik var (trafik, zar)`],
        [R`**Zaman bağımlılığı**`, R`Epizodik: her karar bağımsız (bant üzerindeki parçayı sağlam/bozuk ayırmak)`, R`Sıralı: bugünkü karar sonrakileri etkiler (satranç, araba sürmek)`],
        [R`**Değişim**`, R`Statik: ajan düşünürken çevre değişmez (bulmaca)`, R`Dinamik: çevre değişir (trafik)`],
        [R`**Değerler**`, R`Ayrık: sınırlı durum ve eylem (satranç)`, R`Sürekli: hız, açı gibi sürekli değerler (araba sürmek)`],
        [R`**Ajan sayısı**`, R`Tek ajanlı (bulmaca çözmek)`, R`Çok ajanlı: rekabetçi (satranç) ya da işbirlikçi (trafik)`]]},
        p2: [R`En zor ortam: kısmi gözlemlenebilir, stokastik, sıralı, dinamik, sürekli ve çok ajanlı. Otonom araç tam olarak budur.`]},
      {h: R`Beş ajan türü`, tbl: {h: ['Tür', 'Nasıl karar verir?', 'Örnek'], r: [
        [R`**Basit refleks ajan**`, R`Sadece şu anki algıya bakar: "eğer … ise …" kuralları`, R`Termostat, "kare kirliyse süpür"`],
        [R`**Model tabanlı refleks ajan**`, R`Görmediği kısmı tahmin etmek için iç bir dünya modeli (durum) tutar`, R`Ayna ile arkasını takip eden sürücü`],
        [R`**Hedef tabanlı ajan**`, R`Bir hedefi vardır; eylemlerinin hedefe götürüp götürmediğine bakar → **arama ve planlama** kullanır`, R`Navigasyon (3–4. haftadaki arama algoritmaları)`],
        [R`**Fayda tabanlı ajan**`, R`Hedefe giden yollar arasında en yüksek **fayda (mutluluk)** sağlayanı seçer`, R`En hızlı + en ucuz + en güvenli rotayı tartan navigasyon`],
        [R`**Öğrenen ajan**`, R`Deneyimle performansını artırır: öğrenme öğesi, performans öğesi, eleştirmen, problem üretici`, R`Makine öğrenmesi sistemleri (5–7. hafta)`]]}}
    ],
    ezber: [
      R`Ajan = algılayıcılarla algılar, eyleyicilerle etki eder. Ajan fonksiyonu: algı dizisi → eylem.`,
      R`Rasyonel ajan: beklenen performansı en yüksek eylemi seçer; her şeyi bilmek zorunda değil.`,
      R`PEAS: Performance, Environment, Actuators, Sensors. Otonom araç: P kazasız hızlı gitmek, E trafik, A direksiyon/gaz, S kameralar.`,
      R`Çevre: tam/kısmi gözlemlenebilir, deterministik/stokastik, epizodik/sıralı, statik/dinamik, ayrık/sürekli, tek/çok ajanlı.`,
      R`Ajan türleri: basit refleks → model tabanlı → hedef tabanlı → fayda tabanlı → öğrenen.`],
    formul: [],
    qs: [
      {id: 'G2.1', q: R`Otonom bir araç için PEAS tanımını yapınız.`, ans: R`**P:** kaza yapmadan hızlı gitmek (güvenlik, süre, konfor, kurallara uyum). **E:** kuralları olan trafik ortamı (yollar, diğer araçlar, yayalar, hava). **A:** direksiyon, gaz, fren, sinyal, korna. **S:** kameralar, GPS, radar/lidar, hız ve motor sensörleri.`},
      {id: 'G2.2', q: R`Bir robot süpürge için PEAS tanımını yapınız.`, ans: R`**P:** temizlenen alan oranı, enerji, süre. **E:** ev, odalar, mobilya, kir. **A:** tekerlek motorları, fırça, vakum. **S:** çarpma sensörü, kir sensörü, kamera/lazer mesafe sensörü.`},
      {id: 'G2.3', q: R`Satranç (saatli) ve taksi sürmek için çevre özelliklerini belirleyiniz.`, ans: R`**Satranç:** tam gözlemlenebilir, deterministik, sıralı, yarı dinamik (saat ilerler), ayrık, çok ajanlı (rekabetçi). **Taksi:** kısmi gözlemlenebilir, stokastik, sıralı, dinamik, sürekli, çok ajanlı.`},
      {id: 'G2.4', q: R`Hangi ajan türü? a) Oda 22 °C altına düşünce kombiyi açan termostat b) Kavşaklarda hedefe giden yolu arayan navigasyon c) Trafik, ücret ve süreyi birlikte tartıp en iyi rotayı seçen navigasyon d) Oyun oynadıkça daha iyi oynamayı öğrenen program.`, ans: R`a) **Basit refleks** b) **Hedef tabanlı** c) **Fayda tabanlı** d) **Öğrenen ajan**.`},
      {id: 'G2.5', q: R`Rasyonel ajan nedir? Rasyonel olmak her şeyi bilmek midir?`, ans: R`Her algı dizisi için, eldeki kanıt ve bilgiyle performans ölçütünü en yüksek yapması beklenen eylemi seçen ajandır. Her şeyi bilmek (omniscience) değildir: ajan bilemeyeceği bir şey yüzünden kötü sonuç alsa da doğru (beklenen değeri en iyi) kararı verdiyse rasyoneldir.`}
    ]
  });

  // ---------------------------------------------------------------- ek test soruları ve son 10 dakika
  Y.test = Y.test.concat([
    {q: R`Turing testine göre bir makine ne zaman "zeki" sayılır?`, o: ['Satrançta insanı yenince', 'Sorgulayıcı onu insandan ayırt edemeyince', 'Doğru cevap oranı %90 olunca', 'Kendi kodunu yazınca'], a: 1, w: R`Turing, 1950.`, go: 10},
    {q: R`"Yapay zeka" terimi hangi olayda ortaya çıktı?`, o: ['1950 Turing makalesi', '1956 Dartmouth konferansı', '1957 perceptron', '1997 Deep Blue'], a: 1, w: R`John McCarthy, Dartmouth 1956.`, go: 10},
    {q: R`PEAS'teki "A" neyi ifade eder?`, o: ['Algoritma', 'Eyleyiciler (actuators)', 'Ajan', 'Doğruluk (accuracy)'], a: 1, w: R`Performance, Environment, Actuators, Sensors.`, go: 11},
    {q: R`Sadece şu anki algıya bakıp "eğer–ise" kuralıyla davranan ajan hangisidir?`, o: ['Basit refleks ajan', 'Hedef tabanlı ajan', 'Fayda tabanlı ajan', 'Öğrenen ajan'], a: 0, w: R`Termostat gibi.`, go: 11},
    {q: R`Hangi çevre kısmi gözlemlenebilir, stokastik ve dinamiktir?`, o: ['Bulmaca', 'Satranç', 'Taksi sürmek', 'Sudoku'], a: 2, w: R`Trafikte her şey görünmez, olaylar belirsiz ve sürekli değişir.`, go: 11}
  ]);
  Y.son.unshift(R`**Giriş (tahmini):** 4 yaklaşım (insan gibi/rasyonel × düşünme/davranma), Turing testi 1950, Dartmouth 1956. Ajan = sensör + eyleyici; **PEAS**; çevre türleri; ajanlar: basit refleks, model tabanlı, hedef tabanlı, fayda tabanlı, öğrenen.`);
})();
