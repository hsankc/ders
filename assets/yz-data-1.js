// Yapay Zeka · 1. kısım: arama ve optimizasyon bölümleri (Hafta 3–4)
// Kaynak: derste çekilen slayt fotoğrafları. Metinler String.raw şablonu; içinde dolar-süslü parantez kullanma.
// Biçim: **kalın**, {{kod}}, $...$ satır içi formül (KaTeX).
(function(){
  var R = String.raw;
  window.YZ = {parts: []};
  var P = window.YZ.parts;

  // ---------------------------------------------------------------- 1
  P.push({
    no: 1, hafta: 'Hafta 3', grp: 'Arama', title: 'Problem çözme ve durum uzayı',
    ozet: R`Bir problemi ajana tanıtmak: PEAS'ten probleme geçiş, problemin 5 bileşeni, problem çözme adımları, durum uzayından arama ağacına geçiş, kombinatoryal patlama ve arama algoritmalarının 4 performans kriteri.`,
    konu: [
      {h: R`PEAS'ten probleme`, p: [
        R`2. haftada PEAS ile otonom bir araç tasarlanmıştı: kameralar **Sensör (S)**, direksiyon ve gaz pedalı **Eyleyici (A)**, kuralları olan trafik ortamı **Çevre (E)**, kaza yapmadan hızlı gitme amacı **Performans (P)**.`,
        R`Aracın A noktasından B noktasına gidebilmesi için navigasyon cihazına bir **problem** tanımlamak gerekir. Algoritmanın çalışması için sisteme 5 parametre girilir:`],
        ol: [R`**Neredeyiz?** → Başlangıç durumu`, R`**Hangi yollara sapabiliriz?** → Eylemler`, R`**O yol bizi hangi şehre çıkarır?** → Geçiş modeli`, R`**B noktasına geldik mi?** → Hedef testi`, R`**Kaç km yol yaptık?** → Yol maliyeti`]},
      {h: R`Problemin 5 temel bileşeni ("Ne?")`, tbl: {h: ['Bileşen', 'Ne demek?', 'PEAS ile bağı'], r: [
        [R`**1. Başlangıç durumu** (Initial State)`, R`Ajanın aramaya başladığı nokta.`, R`Ajanın **sensörleri (S)** aracılığıyla çevreden aldığı ilk veri.`],
        [R`**2. Eylemler** (Actions)`, R`Bulunulan durumda yapılabilecek geçerli hamleler kümesi.`, R`Ajanın **eyleyicilerinin (A)** kapasitesiyle sınırlı.`],
        [R`**3. Geçiş modeli** (Transition Model)`, R`Bulunulan durumdan hangi durumlara geçilebileceği; yani durum uzayı.`, R`Ajanın içinde bulunduğu **çevrenin (E)** kuralları. Duvarın içinden geçilememesi çevrenin bir kısıtı.`],
        [R`**4. Hedef testi** (Goal Test)`, R`Bulunulan durumun hedef olup olmadığını kontrol eden mekanizma.`, R`—`],
        [R`**5. Yol maliyeti** (Path Cost, $g(n)$)`, R`Başlangıçtan mevcut duruma kadar yapılan hamlelerin toplam maliyeti.`, R`Ajanın **performans ölçütü (P)** ile doğrudan ilişkili.`]]}},
      {h: R`Yapay zekada problem çözme adımları ("Nasıl?")`, ol: [
        R`**Hedef formülasyonu:** Ajanın tam olarak neyi başarması gerektiğini belirlemesi. Hedefin netleşmesi problemin kapsamını daraltır; odak hedefle ilişkili eylemlerdedir.`,
        R`**Problemin tanımlanması:** Başlangıç durumu, hedef, mevcut kısıtlamalar ve yasal eylemler belirlenerek problemin sınırları (çerçevesi) net çizilir.`,
        R`**Durum uzayının tanımlanması:** Çözüm aranırken çıkabilecek bütün olası durumların ve aralarındaki bağlantıların ağaç ya da graf biçiminde haritası çıkarılır.`,
        R`**Hedef durumunun test edilmesi:** Arama algoritması uzayda ilerlerken ulaştığı her yeni düğümde "Hedefe ulaştım mı?" kontrolünü yapar.`,
        R`**Maliyetin hesaplanması:** Hedefe giden birden fazla yol varsa sistem bu yolların faturasını değerlendirir ve en az kaynak (zaman, mesafe vb.) tüketen optimum rotayı seçer.`],
        p2: [R`Karıştırma: "Ne?" slaytı problemin **parçalarını** (5 bileşen), "Nasıl?" slaytı çözüm **sürecini** (5 adım) anlatır.`]},
      {h: R`Durum uzayından arama ağacına`, p: [
        R`**Durum uzayı** fiziksel haritadır; her yer bir kez çizilir. **Arama ağacı** ise bu haritada ajanın izleyebileceği yolların açılmış hâlidir; aynı yer ağaçta birçok kez görünebilir.`,
        R`Slayttaki örnek: harita S–A, S–B, A–B, A–G, B–G. Ağaç: S → A → {B → G, G} ve S → B → {A → G, G}.`,
        R`Durum uzayında 4 mekan varken arama ağacında daha 3. adımda 10 düğüm oluşur. Yapay zeka literatüründe buna **kombinatoryal patlama** denir. Bu üstel büyüme doğru bir arama algoritmasıyla kontrol altına alınmazsa dünyanın en güçlü bilgisayarları bile basit bir labirentte kilitlenip kalır. Ajanın bu olasılıklar ağacında kaybolmasını önlemek ve onu hedefe en az maliyetle ulaştırmak ancak doğru bir **arama stratejisiyle** mümkündür.`]},
      {h: R`Ağaç araması ve graf araması`, p: [
        R`Kodda bir "ziyaret edilenler" (**explored set**) listesi tutulmazsa yapılan işin adı **ağaç aramasıdır**: ajan Çanakkale ile Ezine arasında sonsuza kadar gidip gelerek sistemi kilitleyebilir.`,
        R`Basit bir {{if dugum in ziyaret_edilenler:}} kontrolü eklenince arama **graf aramasına** dönüşür: ajan geçmişi hatırlar, aynı şehre ikinci kez adım atmaz; o devasa kombinatoryal patlama bir anda kontrol edilebilir, sonlu bir ağaca dönüşür.`]},
      {h: R`Arama algoritmalarının 4 performans kriteri`, tbl: {h: ['Kriter', 'Sorduğu soru', 'Ayrıntı'], r: [
        [R`**Tamlık** (Completeness)`, R`Çözüm varsa garanti bulur mu?`, R`Çözüm yoksa sonsuza kadar aramak yerine bir noktada durup "çözüm yok" diyebilmesi de buna dahildir.`],
        [R`**Optimallik** (Optimality)`, R`Bulunan çözüm en ucuz çözüm mü?`, R`Hedefe ulaşılan ilk yol değil; harcanan toplam kaynak (mesafe, enerji, $g(n)$) açısından en ucuz yol.`],
        [R`**Alan / bellek karmaşıklığı** (Space)`, R`Bellekte aynı anda kaç düğüm tutulur?`, R`Çalışırken açık tutulan sınır/kuyruk ve ziyaret edilenler listelerinin boyutu.`],
        [R`**Zaman karmaşıklığı** (Time)`, R`Çözümü bulmak ne kadar sürer?`, R`Saniyeyle değil, **üretilen düğüm sayısıyla** ölçülür: dallanma faktörü $b$ ve derinlik $d$ ile $O(b^d)$ gibi.`]]}},
      {h: R`b ve d ne demek?`, ek: true, p: [
        R`**Dallanma faktörü $b$:** bir düğümden çıkan ortalama dal sayısı. **Derinlik $d$:** hedefin bulunduğu seviye. Kök 0. seviyedir.`,
        R`$d$ derinliğe kadar en fazla $1 + b + b^2 + \dots + b^d$ düğüm üretilir; bu yaklaşık $b^d$'dir. Örneğin $b = 10$, $d = 5$ ise yaklaşık 100.000 düğüm. Saniye bilgisayara göre değişir, düğüm sayısı değişmez; bu yüzden hız düğüm sayısıyla ölçülür.`]}
    ],
    ezber: [
      R`Problemin 5 bileşeni: **başlangıç durumu, eylemler, geçiş modeli, hedef testi, yol maliyeti $g(n)$**.`,
      R`PEAS bağı: başlangıç durumu ↔ **S**, eylemler ↔ **A**, geçiş modeli ↔ **E**, yol maliyeti ↔ **P**.`,
      R`5 adım: **hedef formülasyonu → problemin tanımı → durum uzayının tanımı → hedef testi → maliyet hesabı**.`,
      R`Durum uzayı = harita; arama ağacı = haritadaki yolların açılmış hâli. Ağacın üstel büyümesi = **kombinatoryal patlama**.`,
      R`Explored set yok → **ağaç araması** (döngüye girebilir). Var → **graf araması**.`,
      R`4 kriter: **tamlık, optimallik, bellek, zaman**. Zaman saniyeyle değil düğüm sayısıyla: $O(b^d)$.`],
    formul: [[R`Zaman karmaşıklığı (b dallanma, d derinlik)`, R`O(b^d)`], [R`$d$ derinliğe kadar üretilen düğüm`, R`1 + b + b^2 + \dots + b^d`]],
    qs: [
      {id: '1.1', q: R`Otonom bir aracın Çanakkale'den İzmir'e gitmesi problemi için problemin 5 bileşenini yazınız.`,
        st: [R`**Başlangıç durumu:** Çanakkale (GPS/sensörden okunan konum).`, R`**Eylemler:** bulunulan kavşaktan sapılabilecek yollar (Ezine'ye git, Çan'a git…).`, R`**Geçiş modeli:** hangi yolun hangi şehre çıktığı; yani yol haritası (Ezine → Edremit, Çan → Balıkesir…).`, R`**Hedef testi:** "Şu an İzmir'de miyiz?"`, R`**Yol maliyeti $g(n)$:** o ana kadar yapılan toplam km (ya da süre, yakıt).`],
        ans: R`Başlangıç = Çanakkale, eylemler = sapılabilecek yollar, geçiş modeli = yol haritası, hedef testi = İzmir'de miyiz?, yol maliyeti = toplam km.`},
      {id: '1.2', q: R`Problemin 5 bileşenini PEAS ile ilişkilendiriniz.`,
        st: [R`Başlangıç durumu sensörlerle (S) alınan ilk veridir.`, R`Eylemler eyleyicilerin (A) yapabildikleriyle sınırlıdır.`, R`Geçiş modeli çevrenin (E) kurallarıdır (duvardan geçilemez).`, R`Yol maliyeti performans ölçütüyle (P) doğrudan ilişkilidir.`, R`Hedef testi PEAS'te ayrı bir harfe karşılık gelmez.`],
        ans: R`S → başlangıç durumu, A → eylemler, E → geçiş modeli, P → yol maliyeti.`},
      {id: '1.3', q: R`Ajanın daha önce ziyaret ettiği bir şehre tekrar dönmediği (explored set kullandığı) kabul edilirse, Çanakkale–İzmir durum uzayının dönüştüğü arama ağacını çiziniz. (Yollar: Çanakkale–Ezine, Ezine–Edremit, Edremit–İzmir, Çanakkale–Çan, Çan–Balıkesir, Balıkesir–İzmir.)`,
        tip: R`Kökte Çanakkale var. Bir şehir aynı dalda ikinci kez yazılamaz.`,
        st: [R`Kök: **Çanakkale** (başlangıç). Çocukları: **Ezine** ve **Çan**.`, R`Ezine'nin çocuğu **Edremit** (Çanakkale ziyaret edildiği için geri yazılmaz). Edremit'in çocuğu **İzmir (Hedef 1)**.`, R`Çan'ın çocuğu **Balıkesir**, onun çocuğu **İzmir (Hedef 2)**.`, R`Explored set olmasaydı ağaç Çanakkale → Ezine → Çanakkale → Ezine … diye sonsuza uzardı (ağaç araması).`],
        ans: R`Çanakkale → Ezine → Edremit → İzmir ve Çanakkale → Çan → Balıkesir → İzmir. İzmir iki farklı yaprak olarak, iki ayrı yolun sonunda görünür.`},
      {id: '1.4', q: R`Ağaç araması ile graf araması arasındaki fark nedir? Hangisi kombinatoryal patlamayı kontrol eder?`,
        st: [R`Ağaç araması ziyaret edilen düğümleri hatırlamaz; aynı duruma tekrar tekrar girebilir, döngüde kalabilir.`, R`Graf araması explored set tutar; ziyaret edilmiş duruma ikinci kez girmez.`],
        ans: R`Fark explored set'tir. Graf araması tekrar eden durumları atladığı için arama ağacını sonlu tutar ve patlamayı kontrol eder.`},
      {id: '1.5', q: R`Arama algoritmalarının 4 performans kriterini yazınız. Zaman karmaşıklığı neden saniyeyle ölçülmez?`,
        st: [R`Tamlık, optimallik, alan (bellek) karmaşıklığı, zaman karmaşıklığı.`, R`Saniye kullanılan bilgisayara göre değişir; üretilen düğüm sayısı makineden bağımsızdır.`],
        ans: R`Kriterler: tamlık, optimallik, bellek, zaman. Zaman üretilen düğüm sayısıyla, $O(b^d)$ gibi ölçülür çünkü saniye makineye bağlıdır.`},
      {id: '1.6', q: R`Dallanma faktörü $b = 3$ olan bir problemde hedef $d = 4$. seviyedeyse, kökten 4. seviyeye kadar en fazla kaç düğüm üretilir?`, tip: R`Her seviyede bir öncekinin 3 katı düğüm var.`,
        st: [R`Seviye 0: 1, seviye 1: 3, seviye 2: 9, seviye 3: 27, seviye 4: 81.`, R`Toplam $1 + 3 + 9 + 27 + 81 = 121$.`],
        ans: R`121 düğüm; mertebesi $O(3^4) = 81$ ile aynı.`}
    ]
  });

  // ---------------------------------------------------------------- 2
  P.push({
    no: 2, hafta: 'Hafta 3–4', grp: 'Arama', title: 'Kör arama: BFS, DFS, UCS',
    ozet: R`Hedefin yerini bilmeden haritayı tarayan üç algoritma: katman katman giden BFS, sonuna kadar dalan DFS ve gerçek maliyete bakan UCS (Dijkstra). Kör aramada $g(n)$ ve gerçek dünyadaki kullanım alanları.`,
    konu: [
      {h: R`Arama algoritmalarının haritası`, tbl: {h: ['Grup', 'Algoritmalar', 'Ne bilir?'], r: [
        [R`**Bilgisiz / kör arama** (Uninformed)`, R`BFS, DFS, UCS`, R`Hedefin nerede olduğuna dair hiçbir fikirleri yoktur, sadece haritayı tararlar.`],
        [R`**Bilgili / sezgisel arama** (Informed)`, R`Greedy, A*`, R`Hedefin yönü ve uzaklığı hakkında bir sezgisel tahmine $h(n)$ sahiptirler.`]]},
        p2: [R`4. haftadaki büyük şema: **Sistematik yol tabanlı** arama = kör arama (BFS, DFS, UCS) + bilgili arama (Greedy, A*). **Yerel arama ve optimizasyon** = tekil durum (tepe tırmanma, tavlama benzetimi, tabu arama) + popülasyon tabanlı (genetik algoritma, parçacık sürü, karınca kolonisi).`]},
      {h: R`BFS · Sığ (genişlik) öncelikli arama`, li: [
        R`Ağacın her seviyesini sırayla, **soldan sağa** tarar: önce 1 adım uzaklıktaki bütün seçenekler, sonra 2 adım uzaklıktakiler. Ağaçta **katman katman (yatay)** ilerler.`,
        R`Veri yapısı **FIFO kuyruk**. Seçim kuralı $f(n) = d(n)$: en küçük derinlikteki düğüm seçilir.`,
        R`**Avantaj:** çözüm varsa kesin bulur. Bütün adımların maliyeti eşitse en kısa yolu garanti eder.`,
        R`**Dezavantaj:** bekleyen bütün düğümleri hafızada tuttuğu için RAM'i çok hızlı tüketir.`,
        R`Örnek ağaç A → B, C, D; C → E, F: ziyaret sırası **A B C D E F**.`,
        R`**Kullanım:** sosyal ağlar (LinkedIn, Facebook), web arama motorları (web crawling), ağ yayıncılığı (Wi-Fi mesh ağları, P2P sistemler).`]},
      {h: R`DFS · Derin öncelikli arama`, li: [
        R`Önüne çıkan ilk yoldan gidebileceği **en uç noktaya (çıkmaza)** kadar gider; çıkmaza girerse bir adım geri dönüp diğer dalı dener. Bir yola girer ve sonuna kadar **(dikey)** gider.`,
        R`Veri yapısı **LIFO yığın (stack)**. Seçim kuralı $f(n) = -d(n)$: en büyük derinlikteki düğüm seçilir.`,
        R`**Avantaj:** hafıza dostudur; sadece o an üzerinde yürüdüğü tek yolu aklında tutar.`,
        R`**Dezavantaj:** hedef sağdaki en kısa dalda olsa bile soldaki devasa ya da sonsuz bir çıkmaza girip kaybolabilir. En iyi yolu bulmayı garanti etmez.`,
        R`**Kullanım:** paket yöneticileri ve bağımlılık çözme ({{pip install}}), işletim sistemlerinde deadlock kontrolü için kaynak tahsis grafında (RAG) döngü tespiti, oyun ve bulmaca çözücüler.`]},
      {h: R`DFS dolaşma sıraları`, p: [
        R`Ağaç: 0 → 1, 2, 3; 1 → 4, 5; 2 → 6; 3 → 7.`],
        tbl: {h: ['Dolaşma', 'Kural', 'Sıra'], r: [
          [R`**Preorder**`, R`Kök – Sol – Sağ`, R`0, 1, 4, 5, 2, 6, 3, 7`],
          [R`**Postorder**`, R`Sol – Sağ – Kök`, R`4, 5, 1, 6, 2, 7, 3, 0`],
          [R`**Inorder**`, R`Sol – Kök – Sağ`, R`Sadece ikili ağaçlar için tanımlı`]]},
        p2: [R`Slayttaki ikinci örnekte (A → B, C, D; C → E; D → F) iki sıra yazılı: **A D F C E B** ve preorder **A B C E D F**. İkisi de DFS'dir. Çocuklar yığına B, C, D sırasıyla konursa yığından ilk çıkan D olur ve sıra A D F C E B gelir. Özyinelemeli (preorder) DFS ise soldan başlar: A B C E D F. Sınavda hangi kuralı kullandığını yaz.`]},
      {h: R`Kör aramada $g(n)$`, li: [
        R`BFS ve DFS her adımın (kenarın) maliyetini **her zaman 1** kabul eder: gerçek maliyet ne olursa olsun formüle sadece 1 ekler (adım maliyeti sabit).`,
        R`Bütün adımların maliyeti zaten eşitse (her hücreye geçişin 1 olduğu kareli labirent) BFS mükemmel ve optimal çalışır.`,
        R`Maliyetler farklıysa BFS en ucuz yolu değil, sadece **en az düğümden geçen (en sığ)** yolu bulur.`,
        R`Gerçek $g(n)$ faturasını okuyabilen algoritmalar **UCS ve A***'dır.`],
        f: [R`g(\text{çocuk}) = g(\text{ata}) + c(\text{ata}, \text{çocuk})`],
        p2: [R`Örnek (S → A 2, A → B 1, B → C 2, C → G 3): $g(A) = 2$, $g(B) = 2 + 1 = 3$, $g(C) = 3 + 2 = 5$, $g(G) = 5 + 3 = 8$.`]},
      {h: R`UCS · Eşit maliyetli arama (Uniform Cost)`, li: [
        R`Başlangıç ile bitiş arasındaki en kısa (en ucuz) yolu bulmayı amaçlar. Adım sayısına (seviyeye) değil, **o ana kadar harcanan maliyete** bakar: $f(n) = g(n)$.`,
        R`BFS'nin "1 km'lik yol da 100 km'lik yol da 1 adımdır" mantığını düzeltir. Her zaman faturası en ucuz görünen düğümden ilerler.`,
        R`**Öncelikli kuyruk:** bulunan bütün yollar o ana kadarki toplam maliyete $g(n)$ göre küçükten büyüğe sıralanıp bekletilir.`,
        R`**En ucuza yönelme:** her zaman kuyruğun başındaki, güncel faturası en düşük düğüm alınıp genişletilir.`,
        R`**Geri dönüş (düzeltme):** ucuz sandığı yolda devasa bir maliyet çıkarsa o yolun toplamı aniden fırlar; algoritma o yolu beklemeye alıp kuyruktaki "daha ucuz kalmış" alternatiflere döner.`,
        R`**Avantaj:** yol maliyetleri negatif olmadığı sürece her zaman en kısa/en ucuz yolu garanti eder.`,
        R`**Dijkstra ilişkisi:** UCS yapay zekadaki adıdır; ağ yönlendirme ve yöneylem araştırmasında aynı mantık Dijkstra algoritmasıdır. Tek fark: klasik Dijkstra graftaki **bütün düğümlere** en kısa yolu bulana kadar çalışır, UCS **hedefe ulaşır ulaşmaz** durur.`,
        R`**Kullanım:** internet yönlendirme protokolleri (routing), lojistik ve kargo rotalama. Slayttaki tartışma sorusu: Google Maps rota çizerken $g(n)$ olarak neleri hesaba katıyor? (mesafe, trafikteki süre, ücretli yollar, yol tipi gibi)`]}
    ],
    ezber: [
      R`BFS: **FIFO kuyruk**, $f(n) = d(n)$, katman katman; tam; maliyetler eşitse optimal; bellek çok kötü.`,
      R`DFS: **LIFO yığın**, $f(n) = -d(n)$, sonuna kadar dal; tam değil (sonsuz döngü riski), optimal değil; bellek çok iyi.`,
      R`UCS: **öncelikli kuyruk**, $f(n) = g(n)$; tam ve her zaman optimal (maliyet negatif değilse); bellek kötü.`,
      R`BFS/DFS her adımı 1 sayar. Maliyetler farklıysa BFS en az kenarlı yolu bulur, en ucuzu değil.`,
      R`UCS = Dijkstra; fark: UCS hedefte durur, Dijkstra bütün düğümlere yol bulur.`,
      R`Kullanım: BFS → sosyal ağ, web crawling, P2P · DFS → pip bağımlılıkları, deadlock (RAG döngüsü), bulmaca · UCS → routing, kargo.`],
    formul: [[R`BFS seçim kuralı`, R`f(n) = d(n)`], [R`DFS seçim kuralı`, R`f(n) = -d(n)`], [R`UCS seçim kuralı`, R`f(n) = g(n)`], [R`Yol maliyeti`, R`g(n') = g(n) + c(n, n')`]],
    qs: [
      {id: '2.1', q: R`**Çalışma grafı** (yönlü): S → A 2, S → B 5, A → B 1, A → C 6, B → C 2, B → G 8, C → G 3. Başlangıç S, hedef G. **BFS** için açılan düğümlerin sırasını, bulunan yolu ve maliyetini bulunuz. Eşitlikte alfabetik sıra.`,
        tip: R`BFS maliyetlere bakmaz; kuyruğa giriş sırasına bakar.`,
        st: [R`Kuyruk: [S]. **S**'yi aç → kuyruk: A, B.`, R`**A**'yı aç → B zaten kuyrukta, C eklenir → kuyruk: B, C.`, R`**B**'yi aç → C zaten kuyrukta, G eklenir (atası B) → kuyruk: C, G.`, R`**C**'yi aç → G zaten kuyrukta → kuyruk: G.`, R`**G**'yi aç → hedef. Yol: G'nin atası B, B'nin atası S.`, R`Not: hedef testi düğüm üretilirken yapılırsa B açılırken G görülür ve durulur; açılanlar S, A, B olur, yol yine aynıdır.`],
        ans: R`Açılma sırası S, A, B, C, G. Yol **S → B → G**, maliyet 5 + 8 = **13**. En az kenarlı yol bulundu; en ucuz yol (8) değil.`},
      {id: '2.2', q: R`Aynı çalışma grafında **DFS** için açılan düğümleri, yolu ve maliyeti bulunuz (alfabetik olarak ilk çocuktan devam).`,
        st: [R`**S** → alfabetik ilk çocuk **A**.`, R`**A** → çocukları B, C → **B**.`, R`**B** → çocukları C, G → **C**.`, R`**C** → çocuğu **G** → hedef.`, R`Yol S → A → B → C → G: 2 + 1 + 2 + 3 = 8.`],
        ans: R`Açılma sırası S, A, B, C, G. Yol **S → A → B → C → G**, maliyet **8**. Bu grafta DFS şans eseri en ucuz yolu buldu; genelde garanti etmez. A'dan önce C'ye inseydi S → A → C → G = 11 bulurdu.`},
      {id: '2.3', q: R`Aynı çalışma grafında **UCS** için adım adım öncelikli kuyruğu yazınız; yolu ve maliyeti bulunuz.`,
        st: [R`[S:0] → **S(0)**'ı aç: A:2, B:5.`, R`**A(2)**'yi aç: B = 2 + 1 = 3 (5'ten ucuz, güncelle), C = 2 + 6 = 8 → kuyruk: B:3, C:8.`, R`**B(3)**'ü aç: C = 3 + 2 = 5 (8'den ucuz, güncelle), G = 3 + 8 = 11 → kuyruk: C:5, G:11.`, R`**C(5)**'i aç: G = 5 + 3 = 8 (11'den ucuz, güncelle) → kuyruk: G:8.`, R`**G(8)**'i aç → hedef.`],
        ans: R`Açılma sırası S(0), A(2), B(3), C(5), G(8). Yol **S → A → B → C → G**, maliyet **8** (optimal).`},
      {id: '2.4', q: R`UCS slaytındaki graf: Sstart → A 10, A → B 10, A → C 50, B → E 20, B → D 100, E → F 20, F → D 10, C → D 25, D → Send 25, F → Send 20. UCS hangi yolu bulur?`,
        tip: R`B → D 100 pahalı; UCS onu beklemeye alır.`,
        st: [R`S(0) → A:10.`, R`A(10) → B:20, C:60.`, R`B(20) → E:40, D:120.`, R`E(40) → F:60.`, R`C(60) ve F(60) eşit; alfabetik C: D = 60 + 25 = 85 (120'den ucuz).`, R`F(60) → D = 60 + 10 = 70 (85'ten ucuz), Send = 60 + 20 = 80.`, R`D(70) → Send = 95 (80 daha ucuz, değişmez).`, R`Send(80) → hedef.`],
        ans: R`Yol Sstart → A → B → E → F → Send, maliyet **80** (slayttaki "A B E F").`},
      {id: '2.5', q: R`Ağaç: 0 → 1, 2, 3; 1 → 4, 5; 2 → 6; 3 → 7. Preorder ve postorder sıralarını yazınız.`,
        st: [R`Preorder (kök–sol–sağ): önce kök yazılır, sonra çocuklar soldan sağa aynı kuralla.`, R`Postorder (sol–sağ–kök): önce bütün çocuklar, en son kök.`],
        ans: R`Preorder **0, 1, 4, 5, 2, 6, 3, 7**. Postorder **4, 5, 1, 6, 2, 7, 3, 0**.`},
      {id: '2.6', q: R`"BFS her zaman en kısa yolu bulur." Doğru mu? Açıklayınız.`,
        ans: R`Kısmen doğru. BFS **en az adımlı** yolu bulur. Bütün kenar maliyetleri eşitse bu en kısa yoldur. Maliyetler farklıysa (çalışma grafında S → B → G = 13, ama en ucuz 8) BFS en ucuz yolu bulmaz; bunun için UCS ya da A* gerekir.`},
      {id: '2.7', q: R`UCS ile Dijkstra algoritması arasındaki fark nedir?`,
        ans: R`Mantık aynıdır: en düşük toplam maliyetli düğüm önce açılır. Dijkstra bütün düğümlere en kısa yolu bulana kadar çalışır; UCS istenen hedefe ulaşınca durur. UCS yapay zekadaki, Dijkstra ağ yönlendirme ve yöneylem araştırmasındaki adıdır.`},
      {id: '2.8', q: R`Hangi algoritma? a) Sosyal ağda "tanıyor olabileceğin kişiler" (2. derece bağlantılar). b) {{pip install}} paketin bağımlılıklarını sırayla çözmesi. c) Kargo aracına en az km'lik rotayı bulmak.`,
        st: [R`a) Yakın katmanlar önce: 1. derece, sonra 2. derece → BFS.`, R`b) Bir bağımlılığın bağımlılığına sonuna kadar inmek → DFS.`, R`c) Kenar maliyetleri (km) farklı, en ucuz yol isteniyor → UCS (ya da tahmin varsa A*).`],
        ans: R`a) **BFS**, b) **DFS**, c) **UCS** (Dijkstra).`}
    ]
  });

  // ---------------------------------------------------------------- 3
  P.push({
    no: 3, hafta: 'Hafta 3–4', grp: 'Arama', title: 'Bilgili arama: Greedy ve A*',
    ozet: R`Hedefe kalan mesafeyi tahmin eden $h(n)$ ile aramak: Öklid ve Manhattan sezgiselleri, sadece tahmine bakan Greedy, $g(n) + h(n)$ toplayan A*, A*'ı optimal yapan kabul edilebilirlik ve tutarlılık kuralları, karşılaştırma tabloları ve LLM'lerdeki arama.`,
    konu: [
      {h: R`Sezgisel fonksiyon $h(n)$: en sık iki yöntem`, li: [
        R`**Öklid mesafesi** (Euclidean): iki nokta arasındaki kuş uçuşu düz çizgi mesafesi (Pisagor). Genellikle **çapraz hareketin serbest olduğu** haritalarda kullanılır.`,
        R`**Manhattan mesafesi:** sadece yatay ve dikey hareket edilebilen (çapraz gidişin yasak olduğu) **ızgara (grid)** tabanlı haritalarda ve labirentlerde kullanılır. Hesaplaması çok daha ucuzdur.`],
        f: [R`h_{\text{Euclid}} = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} \qquad h_{\text{Manhattan}} = |x_2 - x_1| + |y_2 - y_1|`],
        p2: [R`Örnek (ek): (0, 0) → (3, 4) için Öklid $\sqrt{9 + 16} = 5$, Manhattan $3 + 4 = 7$.`]},
      {h: R`Greedy · Açgözlü en-iyi ilk arama`, li: [
        R`$f(n) = h(n)$: geçmiş maliyete bakmaz, sadece **hedefe kalan tahmini mesafeye** odaklanır. Şu ana kadar harcadığı parayı umursamaz.`,
        R`Her yol ayrımında "Hangisi beni hedefe fiziksel olarak daha çok yaklaştırıyor?" diye sorar.`,
        R`**Dezavantaj:** gözü sadece hedefte olduğu için önündeki engelleri (dağları, nehirleri) hesaba katmaz. Kısa göründüğü için girdiği yol onu çok daha uzun bir çıkmaza sokabilir. **Optimal değildir**; tam da değildir.`,
        R`**Avantaj:** çok hızlıdır, belleği az kullanır.`,
        R`**Kullanım:** gerçek zamanlı oyun yapay zekası (StarCraft, Age of Empires), otonom robotlar ve drone navigasyonu, eski navigasyon uygulamaları.`]},
      {h: R`A* (A-yıldız) araması`, li: [
        R`**Tüm arama algoritmalarının şahıdır**; oyun programlamadan navigasyon cihazlarına kadar her yerde kullanılır.`,
        R`Hem geçmişin kesin maliyetini hem geleceğin tahminini birleştirir: **Fatura = şu ana kadar harcanan yol (G) + hedefe kalan tahmini yol (H)**.`,
        R`Her adımda faturanın toplamı en düşük olan düğüme gider.`,
        R`Tahmin (H) hedefe olan gerçek mesafeyi **hiçbir zaman abartmıyorsa** A* her zaman en kısa yolu bulmayı garanti eder.`,
        R`**Kullanım:** oyun motorları ve NavMesh altyapısı, otonom araçlar ve robotik (SLAM: eşzamanlı konumlandırma ve haritalama).`],
        f: [R`f(n) = g(n) + h(n)`]},
      {h: R`A*'ı mükemmel yapan iki matematiksel kural`, li: [
        R`**1. Kabul edilebilirlik** ($h \le h^*$): tahmin asla gerçeği abartmamalıdır. $h^*(n)$ = n'den hedefe gerçek en kısa mesafe. Bu kural **ağaç araması** yapan A*'ı optimal yapar.`,
        R`**2. Tutarlılık** ($h(n) \le c(n, n') + h(n')$): üçgen eşitsizliğidir. Bir düğümden komşusuna geçerken harcanan maliyet, tahmindeki düşüşten büyük ya da eşit olmalıdır. Tahminler adım adım ilerlerken kendi içinde çelişmesin, dengeli azalsın.`,
        R`Tutarlılık sayesinde A*'ın açtığı düğümlerin f değerleri **asla düşmez** (çalışma grafında 7, 7, 7, 7, 8) ve **graf araması** yaparken düğümleri tekrar tekrar açmak zorunda kalmaz.`,
        R`Örnek: A'dan B'ye geçerken $h(A) \le c(A, B) + h(B)$ → $5 \le 1 + 4$ → eşitlik sağlandı.`,
        R`Slayttaki benzetme: A noktasındayken "hedefe 10 km var" diyorsan, 1 km yürüdüğünde bir anda "hedefe 2 km kaldı!" diyemezsin.`]},
      {h: R`Tutarlı olan kabul edilebilirdir`, ek: true, p: [
        R`Hedefte $h = 0$ ise, tutarlı her sezgisel kabul edilebilirdir; tersi her zaman doğru değildir. Kuş uçuşu mesafe gerçek yoldan uzun olamayacağı için normalde hem kabul edilebilir hem tutarlıdır.`,
        R`Kontrol yöntemi: kabul edilebilirlik için her düğümde $h(n) \le h^*(n)$; tutarlılık için **her kenarda** $h(n) \le c(n, n') + h(n')$ yazıp tek tek bak.`]},
      {h: R`Karşılaştırma tablosu 1: seçim kuralı ve veri yapısı`, tbl: {h: ['Algoritma', '$f(n)$', 'Mantığı', 'Veri yapısı'], r: [
        [R`**BFS**`, R`$f(n) = d(n)$`, R`En küçük derinliğe sahip düğüm seçilir`, R`FIFO (kuyruk)`],
        [R`**DFS**`, R`$f(n) = -d(n)$`, R`En büyük derinliğe sahip düğüm seçilir`, R`LIFO (yığın / stack)`],
        [R`**UCS**`, R`$f(n) = g(n)$`, R`Başlangıçtan beri biriken gerçek maliyet`, R`Öncelikli kuyruk`],
        [R`**Greedy**`, R`$f(n) = h(n)$`, R`Hedefe kalan tahmini maliyet`, R`Öncelikli kuyruk`],
        [R`**A***`, R`$f(n) = g(n) + h(n)$`, R`Gerçek maliyet + tahmini kalan maliyet`, R`Öncelikli kuyruk`]]},
        p2: [R`$d(n)$: n düğümünün derinliği (depth).`]},
      {h: R`Karşılaştırma tablosu 2: performans`, tbl: {h: ['Algoritma', 'Tamlık', 'Optimallik', 'Bellek', 'Hız'], r: [
        [R`**BFS**`, R`Evet`, R`Evet (maliyetler eşitse)`, R`Çok kötü (çabuk şişer)`, R`Kötü`],
        [R`**DFS**`, R`Hayır (sonsuz döngü riski)`, R`Hayır`, R`Çok iyi`, R`Kötü`],
        [R`**UCS**`, R`Evet`, R`Evet (her zaman)`, R`Kötü`, R`Kötü`],
        [R`**Greedy**`, R`Hayır`, R`Hayır`, R`İyi`, R`Çok iyi`],
        [R`**A***`, R`Evet`, R`Evet (doğru sezgisel ile)`, R`Kötü`, R`İyi`]]}},
      {h: R`LLM'lerde kullanılan arama algoritmaları`, p: [
        R`Büyük dil modelleri dışarıdan sadece metin üreten kara kutular gibi görünse de, bir cümleyi kurarken ya da karmaşık bir matematik problemini çözerken aslında **devasa bir arama ağacında yol ararlar**. Sadece sıradaki kelimeyi tahmin etmekle kalmaz; mantıklı metin üretmek, kod yazmak ve karmaşık problemleri çözmek için arama algoritmalarından yararlanırlar.`],
        tbl: {h: ['Algoritma', 'Neye benzer?'], r: [
          [R`**Beam Search** (ışın araması)`, R`Kısıtlı (sınırlı bellekli) BFS: her adımda sadece en iyi birkaç aday tutulur.`],
          [R`**Tree of Thoughts** (düşünce ağacı, ToT)`, R`DFS ve BFS'nin LLM versiyonu.`],
          [R`**LLM-A***`, R`A*'ın LLM ile birleşimi.`],
          [R`**Monte Carlo Ağaç Araması** (MCTS)`, R`Klasik arama algoritması + olasılık + istatistik.`]]}}
    ],
    ezber: [
      R`Öklid = kuş uçuşu, çapraz serbest; Manhattan = $|\Delta x| + |\Delta y|$, ızgara/labirent, daha ucuz.`,
      R`Greedy $f = h$: hızlı ama optimal değil, tam değil. Kullanım: StarCraft, drone, eski navigasyon.`,
      R`A* $f = g + h$: tam ve optimal (doğru sezgisel ile). Kullanım: oyun motorları/NavMesh, otonom araç/SLAM.`,
      R`Kabul edilebilirlik $h \le h^*$ → ağaç aramasında optimal. Tutarlılık $h(n) \le c(n, n') + h(n')$ → f değerleri düşmez, graf aramasında tekrar açma yok.`,
      R`Beam search ≅ sınırlı bellekli BFS · ToT ≅ DFS/BFS · MCTS ≅ arama + olasılık + istatistik.`],
    formul: [[R`Greedy`, R`f(n) = h(n)`], [R`A*`, R`f(n) = g(n) + h(n)`], [R`Kabul edilebilirlik`, R`h(n) \le h^*(n)`], [R`Tutarlılık`, R`h(n) \le c(n, n') + h(n')`],
      [R`Öklid`, R`\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`], [R`Manhattan`, R`|x_2 - x_1| + |y_2 - y_1|`]],
    qs: [
      {id: '3.1', q: R`Çalışma grafı: S → A 2, S → B 5, A → B 1, A → C 6, B → C 2, B → G 8, C → G 3; sezgiseller h(S) = 7, h(A) = 5, h(B) = 4, h(C) = 2, h(G) = 0. **Greedy** için açılan düğümleri, yolu ve maliyeti bulunuz.`,
        st: [R`**S**: komşular A (h = 5) ve B (h = 4). Daha küçük h → **B**.`, R`**B**: komşular C (h = 2) ve G (h = 0). → **G**.`, R`G hedef. Yol S → B → G = 5 + 8 = 13.`],
        ans: R`Açılanlar S, B, G. Yol **S → B → G**, maliyet **13**. Neden yanıldı: kısa vadeli düşünür; "B beni hedefe çok yaklaştırdı" der ama B'den G'ye gerçek maliyetin (8) çok pahalı olduğunu hesaba katmaz. En ucuz yol 8'dir.`},
      {id: '3.2', q: R`Aynı grafta **A*** için her adımda f = g + h değerlerini yazınız; yolu ve maliyeti bulunuz.`,
        tip: R`Bir düğüme daha ucuz bir g ile ulaşırsan kuyruktaki değerini güncelle.`,
        st: [R`**S**: f = 0 + 7 = 7. Aç → A: 2 + 5 = **7**, B: 5 + 4 = 9.`, R`**A (7)**'yı aç → B: g = 3, f = 3 + 4 = **7** (9'dan iyi, güncelle); C: g = 8, f = 10.`, R`**B (7)**'yi aç → C: g = 5, f = 5 + 2 = **7** (güncelle); G: g = 11, f = 11.`, R`**C (7)**'yi aç → G: g = 8, f = **8** (güncelle).`, R`**G (8)**'i aç → hedef.`],
        ans: R`Açılma sırası S, A, B, C, G; f değerleri **7, 7, 7, 7, 8** (hiç düşmüyor → tutarlılık). Yol **S → A → B → C → G**, maliyet **8** (optimal).`},
      {id: '3.3', q: R`Aynı grafta sezgiselin kabul edilebilir ve tutarlı olup olmadığını kontrol ediniz.`,
        st: [R`Gerçek kalan mesafeler $h^*$: S = 8, A = 6, B = 5, C = 3, G = 0.`, R`Kabul edilebilirlik: 7 ≤ 8, 5 ≤ 6, 4 ≤ 5, 2 ≤ 3, 0 ≤ 0 → hepsi sağlanıyor.`, R`Tutarlılık (her kenar): S→A: 7 ≤ 2 + 5 ✓ · S→B: 7 ≤ 5 + 4 ✓ · A→B: 5 ≤ 1 + 4 ✓ (eşit) · A→C: 5 ≤ 6 + 2 ✓ · B→C: 4 ≤ 2 + 2 ✓ (eşit) · B→G: 4 ≤ 8 + 0 ✓ · C→G: 2 ≤ 3 + 0 ✓.`],
        ans: R`Sezgisel hem **kabul edilebilir** hem **tutarlı**. Bu yüzden A* optimal yolu (8) buldu.`},
      {id: '3.4', q: R`**SORU (slayt):** Çanakkale'den İzmir'e iki yol var: sahilden Ezine–Edremit hattı ve iç kesimden Çan–Balıkesir otobanı. Gerçek maliyetler: Çanakkale → Ezine 45, Çanakkale → Çan 65, Ezine → Edremit 65, Çan → Balıkesir 90, Edremit → İzmir 190 (sahil yolu, virajlı), Balıkesir → İzmir 130 (otoban). İzmir'e kuş uçuşu $h$: Çanakkale 230, Ezine 190, Çan 210, Edremit 130, Balıkesir 150, İzmir 0. a) Arama ağacı b) Greedy c) A* hangi yolu bulur?`,
        tip: R`A*'ta İzmir'i ilk gördüğün an durma; İzmir kuyruktan çıkana kadar devam et.`,
        st: [R`**a)** Çanakkale → Ezine → Edremit → İzmir ve Çanakkale → Çan → Balıkesir → İzmir (soru 1.3).`, R`**b) Greedy:** Çanakkale'den Ezine (190) mi Çan (210) mı? → Ezine. Sonra Edremit (130), sonra İzmir (0). Sahil yolu: 45 + 65 + 190 = **300 km**.`, R`**c) A*:** Ezine f = 45 + 190 = 235, Çan f = 65 + 210 = 275 → Ezine'yi aç → Edremit f = 110 + 130 = 240 → Edremit'i aç → İzmir f = 300 + 0 = 300.`, R`Kuyruk: Çan 275, İzmir 300 → **Çan**'ı aç → Balıkesir f = 155 + 150 = 305.`, R`Kuyruk: İzmir 300, Balıkesir 305 → **İzmir (300)** çıkar, arama biter.`, R`Gerçek en kısa yol iç yoldur: 65 + 90 + 130 = **285 km**. A* bunu kaçırdı.`, R`Sebep: h(Balıkesir) = 150, ama Balıkesir'den İzmir'e gerçek yol 130. Tahmin gerçeği **abartıyor** → sezgisel kabul edilebilir değil → A*'ın optimallik garantisi bozuldu. h(Balıkesir) ≤ 130 olsaydı f(Balıkesir) ≤ 285 < 300 olurdu ve A* 285'i bulurdu.`],
        ans: R`Greedy ve A* ikisi de **sahil yolunu (300 km)** bulur; gerçek en kısa yol **Çan–Balıkesir (285 km)**. A*'ın yanılmasının sebebi h(Balıkesir) = 150 > 130 olması, yani kabul edilebilirlik kuralının çiğnenmesi.`},
      {id: '3.5', q: R`(2, 1) noktasından (5, 5) noktasına Öklid ve Manhattan mesafesini hesaplayınız. Kareli bir labirentte hangisi kullanılır?`,
        st: [R`$\Delta x = 3$, $\Delta y = 4$.`, R`Öklid: $\sqrt{3^2 + 4^2} = \sqrt{25} = 5$.`, R`Manhattan: $3 + 4 = 7$.`],
        ans: R`Öklid **5**, Manhattan **7**. Labirentte çapraz gidilemediği için **Manhattan** kullanılır.`},
      {id: '3.6', q: R`Kabul edilebilirlik ile tutarlılık arasındaki fark nedir? Hangisi neyi garanti eder?`,
        ans: R`Kabul edilebilirlik her düğümde tahminin gerçek kalan mesafeyi aşmamasıdır ($h \le h^*$); ağaç araması yapan A*'ı optimal yapar. Tutarlılık her kenarda üçgen eşitsizliğidir ($h(n) \le c(n,n') + h(n')$); açılan f değerlerinin hiç düşmemesini ve graf aramasında düğümlerin tekrar açılmamasını garanti eder. Tutarlı olan kabul edilebilirdir.`},
      {id: '3.7', q: R`LLM'lerde kullanılan dört arama yöntemini ve her birinin klasik karşılığını yazınız.`,
        ans: R`Beam Search ≅ kısıtlı (sınırlı bellekli) BFS; Tree of Thoughts ≅ DFS ve BFS'nin LLM versiyonu; LLM-A* ≅ A*; MCTS ≅ klasik arama + olasılık + istatistik.`}
    ]
  });

  // ---------------------------------------------------------------- 4
  P.push({
    no: 4, hafta: 'Hafta 4', grp: 'Optimizasyon', title: 'Yerel arama: tepe tırmanma, tavlama, tabu',
    ozet: R`Gezgin satıcı gibi devasa problemlerde yol değil iyi bir sonuç aranır. Durum uzayı manzarası, tek bir aday çözümle çalışan üç algoritma (tepe tırmanma, tavlama benzetimi, tabu arama), kargo örneği ve hangisinin nerede kullanıldığı.`,
    konu: [
      {h: R`Gezgin satıcı problemi (TSP)`, li: [
        R`Yöneylem araştırması ve teorik bilgisayar biliminde incelenen bir **kombinatoryel optimizasyon** problemidir.`,
        R`Bir seyyar satıcı mallarını n şehirde satmak istiyor; bu şehirleri **mümkün olan en kısa şekilde** ve **her şehre en fazla bir kez** uğrayarak turlamak istiyor. Bir başlangıç noktasından yola çıkıp bütün duraklara uğrayarak yine aynı noktaya dönen en kısa turu bulma problemidir.`,
        R`**Karmaşıklık:** başlangıç için n, ilk şehirde n − 1, ikincide n − 2 seçenek… → toplam olası **n!** rota. Şehir sayısı arttıkça rota sayısı faktöriyel büyür; bütün yolları tek tek denemek imkânsıza yaklaşır.`,
        R`5 şehir = 120 rota → 10 şehir = 10! = 3.628.800 → 15 şehir ≈ 1,3 trilyon → 100 şehirde bu sayı evrendeki atom sayısını geçer.`,
        R`Bugüne kadar çözülen en büyük problem **33.810 noktalı**dır (bir mikroçipin model tasarımı için). Şu anda çözülmeye çalışılan en büyük problem dünyadaki bütün kayıtlı yerleşimler için en kısa turdur: **1.904.711 şehir**.`,
        R`**Kullanım:** lojistik, kurye dağıtımı, araç rotalama, saha hizmetleri, mikroçip üretimi.`,
        R`**A* veya BFS burada neden çöker?** Bellek ve zaman patlaması (combinatorial explosion)! **Çözüm:** yerel arama ve optimizasyon algoritmaları.`],
        f: [R`\text{rota sayısı} = n! = n \cdot (n-1) \cdot (n-2) \cdots 1`]},
      {h: R`Farklı tur sayısı aslında daha az`, ek: true, p: [
        R`Tur bir döngü olduğu için başlangıç şehri ve dönüş yönü fark etmez; birbirinden gerçekten farklı tur sayısı $(n-1)!/2$'dir (5 şehir için 12). Slayttaki $n!$ üst sınırdır; sınavda hocanın yazdığı $n!$ ile cevap ver, istersen bu notu ekle.`]},
      {h: R`Klasik aramadan yerel aramaya`, tbl: {h: ['', 'Klasik arama', 'Yerel arama ve optimizasyon'], r: [
        [R`**Amaç**`, R`Hedefe giden **yolu** bulmak (örn. labirent çıkışı)`, R`En iyi **durumu/noktayı** bulmak (örn. en kârlı üretim planı)`],
        [R`**Önemli olan**`, R`Yol maliyetini $g(n)$ düşürmek`, R`Hangi yoldan gidildiği önemsiz; sadece nihai durumun amaç fonksiyonundaki kalitesi $f(x)$`],
        [R`**Bellek**`, R`Alternatif yolları ağaç yapısında tutar; bellek maliyeti çok yüksek`, R`Ağaç tutmaz; sadece mevcut durumu ve geçmişteki en iyi skoru hatırlar`],
        [R`**Geri dönüş**`, R`Vardır`, R`Alternatif dalları tutmadığı için geriye sarıp başka yola giremez`]]},
        p2: [R`Artık **kesin çözüm garantisi aranmaz**; devasa uzayda makul sürede **yeterince iyi** çözümü bulan sezgisel yöntemlere geçilir.`]},
      {h: R`Durum uzayı manzarası`, li: [
        R`Bir optimizasyon probleminde algoritmanın başına gelebilecek bütün senaryoları gösteren genel başarı haritasıdır.`,
        R`**Yatay eksen** (state space): olası bütün çözümler. TSP'de şehirlerin olası ziyaret sıralamaları ([A-B-C-D], [A-C-B-D] …).`,
        R`**Dikey eksen** (objective function): çözümün kalite puanı. TSP'de o rotanın sağladığı tasarruf/kâr.`,
        R`İşaretler: **global maksimum** (gerçek zirve), **yerel maksimum** (sahte tepe), **"flat" yerel maksimum / plato** (düzlük), **omuz** (shoulder: yükselmeden önceki düz kısım), **current state** (şu anki durum).`]},
      {h: R`Tekil durum algoritmaları`, p: [
        R`Hafızada aynı anda sadece **1 aday çözüm $x$** tutulur. Bu üç algoritma birbirinin eksiğini kapatır: **1. Tepe tırmanma → 2. Tavlama benzetimi → 3. Tabu arama.**`]},
      {h: R`1 · Tepe tırmanma (Hill Climbing)`, li: [
        R`Tamamen **açgözlü (greedy)** ve **hafızasızdır**. Sadece mevcut durumun komşularına bakar ve durumu iyileştiren yöne gider.`],
        ol: [R`**Rastgele başlangıç:** $x$ seç ve kalitesini $f(x)$ hesapla.`, R`Mevcut durumun **bütün komşularına** bak.`, R`En yüksek değere sahip komşuyu ($x_{\text{en iyi}}$) seç.`, R`**Zirve kontrolü:** $f(x_{\text{en iyi}}) \le f(x)$ ise **DUR**; zirveye ulaştığını sanır.`, R`Aksi hâlde $x = x_{\text{en iyi}}$ yap ve 2. adıma dön.`],
        p2: [R`**Zayıf noktası:** asla daha kötü bir hamle yapmayı kabul etmez; ilk çıktığı küçük tepede (**yerel maksimum**) ya da düzlükte (**plato**) kilitlenip kalır. **Çözüm:** ikinci bir algoritmaya ihtiyaç duyar → tavlama benzetimi.`]},
      {h: R`2 · Tavlama benzetimi (Simulated Annealing)`, li: [
        R`Tepe tırmanmanın yerel maksimum tuzağından **olasılıksal olarak kötü hamlelere izin vererek** kurtulur. Yine hafızasızdır ama **cesurdur**.`],
        ol: [R`**Başlangıç:** rastgele bir $x$ ve çok yüksek bir **sıcaklık $T$** belirle.`, R`Mevcut durumun **rastgele bir komşusunu** $x'$ seç; hepsine bakma.`, R`Kalite farkını hesapla: $\Delta E = f(x') - f(x)$ (maksimizasyon varsayımıyla).`, R`**Karar anı:** $\Delta E > 0$ ise (yeni durum daha iyi) kesinlikle kabul et ($x = x'$). $\Delta E < 0$ ise hemen reddetme; $P = e^{-|\Delta E|/T}$ olasılığıyla kabul et: 0 ile 1 arası rastgele $r$ çek, $P \ge r$ ise kabul.`, R`$T$'yi soğutma takvimine göre düşür ($T \leftarrow \alpha \cdot T$, örn. $\alpha = 0{,}95$) ve tekrarla.`],
        f: [R`P = e^{-|\Delta E| / T} \qquad T \leftarrow \alpha \cdot T`],
        p2: [R`**Zayıf noktası:** hafızası olmadığı için az önce indiği tepenin yamacına rastgele tekrar tırmanabilir; aynı yerlerde vakit kaybedebilir. **Çözüm:** farklı bir algoritma → tabu arama.`]},
      {h: R`Sıcaklık neden önemli?`, ek: true, p: [
        R`Ad metallerin tavlanmasından gelir: metal ısıtılıp yavaş soğutulunca atomlar düzenli yerleşir. $T$ yüksekken kötü hamle kabul olasılığı yüksektir (keşif), $T$ düştükçe azalır (yerleşme).`,
        R`$\Delta E = -20$ için: $T = 40$ → $e^{-0{,}5} \approx 0{,}61$; $T = 20$ → $e^{-1} \approx 0{,}37$; $T = 10$ → $e^{-2} \approx 0{,}14$. Aynı kötü hamle soğudukça daha zor kabul edilir.`]},
      {h: R`3 · Tabu arama (Tabu Search)`, p: [R`Yerel maksimumdan kurtulmak için **kısa süreli hafıza (tabu listesi)** kullanır.`],
        ol: [R`**Zorunlu hareket:** mevcut durumdan daha iyi bir komşu yoksa bile durmaz; komşular içindeki en iyisine (**en az kötü olana**) geçer.`, R`**Tabu listesi:** yokuş aşağı adım attığında, bir sonraki adımda aynı tepeye geri tırmanıp sonsuz döngüye girmemek için son yaptığı **k adet hamleyi** tabuya yazar.`, R`**Tabu süresi:** bir hamle sonsuza kadar yasaklı kalmaz; örneğin 5 iterasyon yasaklı kalır, sonra listeden silinir (FIFO kuyruğu gibi).`, R`**Aspirasyon kriteri:** yasaklı bir hamle şimdiye kadar bulunan en iyi global çözümden ($x_{\text{best}}$) bile daha iyi bir yere götürüyorsa yasak delinir.`],
        p2: [R`**Madem daha iyi, neden her zaman kullanılmaz? (gizli maliyeti)** Kargo örneğinde sadece 2 komşu vardı, bu yüzden kolay göründü. Gerçek hayatta: **1. Bütün komşulara bakma zorunluluğu (hız sorunu)** · **2. Sürekli (continuous) uzayda çalışamaz.**`]},
      {h: R`Örnek: kargo aracının 4 durak sırası`, p: [
        R`Durum uzayı: kargo aracının 4 noktayı ziyaret sıralaması. Hedef fonksiyonu: her sıralamanın kalite/verimlilik puanı. Komşuluk kuralı: dizideki harflerin yerini değiştirerek grafikte bir sağdaki ya da soldaki komşuya geçmek. Üç algoritma da **[A,B,C,D] (60)** noktasından başlar.`,
        R`Manzara (soldan sağa): **[A,B,C,D] 60** (başlangıç) → **[B,A,C,D] 70** (yerel maksimum) → **[B,C,A,D] 50** (vadi) → **[D,C,B,A] 100** (gerçek zirve) → plato.`],
        tbl: {h: ['Algoritma', 'Ne olur?', 'Sonuç'], r: [
          [R`**Tepe tırmanma**`, R`Kural: sadece puanı yüksek komşuya geç. 60 → 70 kabul. 70'te sol komşu 60, sağ komşu 50; ikisi de kötü → durur. Platoya gelseydi komşular eşit olduğu için yön bulamayıp sıkışırdı.`, R`**70**'te kalır (zirve yanılgısı)`],
          [R`**Tavlama benzetimi**`, R`60 → 70'e çık, geçmişi unut. T = 40. Vadiye inme: $\Delta E = 50 - 70 = -20$, $e^{-20/40} = e^{-0{,}5} \approx 0{,}60$ → %60 ihtimal. Zar at: şans tutarsa (r ≤ 0,60) vadiye in. T her adımda düşer: 40, 36, 30…`, R`Riski aldıysa **100**'e kesin çıkar; almadıysa 70'te mahsur`],
          [R`**Tabu arama**`, R`Kural: durmak yasak. 60 → 70. Geri dönüş hamlesi (1↔2 değişimi) tabuya. 70'te geri dönmek yasak → mecburen 50'ye iner. Tekrar 70'e çıkmamak için bu hamle (2↔3) de tabuya. 50'den tek açık yol ileri.`, R`**100**'e kesin ulaşır`]]}},
      {h: R`Hangisi nerede kullanılır?`, tbl: {h: ['Algoritma', 'En büyük gücü', 'Nerede?'], r: [
        [R`**Tepe tırmanma**`, R`İnanılmaz hızlıdır, sıfır ayar (parametre) gerektirir.`, R`1) Yerel maksimumun olmadığı **tek tepeli / konveks** problemler (YSA'daki **gradyan inişi** sürekli uzaydaki bir tepe tırmanmadır). 2) **Gerçek zamanlı (milisaniyelik)** sistemler: oyun YZ'si, robotik; 5 ms'de en yakın tepeye çık. 3) **Hibrit algoritmaların sonunda:** GA doğru tepeyi bulur, son rötuşu tepe tırmanma yapar.`],
        [R`**Tavlama benzetimi**`, R`Bütün komşuları hesaplamaz; rastgele 1 komşu seçer, iyiyse gider, kötüyse zar atar. Çok hızlıdır.`, R`1) **Komşu sayısı devasa** problemler: mikroçip (VLSI) tasarımında milyonlarca transistörün yeri. 2) **Sürekli (virgüllü) ve gürültülü** uzaylar. 3) Derin öğrenmede **hiperparametre** ayarı (başta riskli, yüksek T değişimler). 4) **Lojistik rotalama:** geçici olarak uzun yolu kabul edip sonra büyük kestirme bulma.`],
        [R`**Tabu arama**`, R`Hafızası sayesinde aynı döngülere girmez; dar koridorlardan ve keskin tuzaklardan ustalıkla çıkar.`, R`1) **Karmaşık çizelgeleme:** üniversite ders programları, hastane nöbet çizelgeleri, havayolu mürettebat atamaları; çakışan atamalar tabuya alınır. 2) **LLM ve NLP:** sık üretilen kalıpları geçici cezalandırarak tekrarı önleme. 3) **Finansal portföy:** riskli hisse kombinasyonlarını tabuya alıp aramayı daraltma.`]]},
        p2: [R`**Özetle:** arazide tek tepe varsa **tepe tırmanma**; milyonlarca komşu adım var ve hepsine bakacak vaktin yoksa **tavlama benzetimi**; belirli kuralları olan bir nöbet/ders çizelgesi hazırlıyorsan ve aynı hataları tekrar etmek istemiyorsan **tabu arama**.`]}
    ],
    ezber: [
      R`TSP: rota sayısı **n!** (5 → 120, 10 → 3.628.800, 15 → 1,3 trilyon). En büyük çözülen 33.810 nokta; hedef 1.904.711 şehir.`,
      R`Klasik arama yolu ve $g(n)$'i önemser; yerel arama sadece nihai durumun kalitesini $f(x)$.`,
      R`Manzara: global max, yerel max, plato (flat local max), omuz (shoulder).`,
      R`Tepe tırmanma: açgözlü, hafızasız; yerel max ve platoda kilitlenir.`,
      R`Tavlama: rastgele 1 komşu; kötü hamleyi $P = e^{-|\Delta E|/T}$ ile kabul; $T \leftarrow \alpha T$; hafızasız.`,
      R`Tabu: durmak yasak, son k hamle tabu, tabu süresi (FIFO), aspirasyon kriteri. Gizli maliyet: bütün komşulara bakmak, sürekli uzayda çalışamamak.`,
      R`Kargo örneği: tepe tırmanma 70'te kalır; tavlama şansa bağlı 100; tabu kesin 100.`],
    formul: [[R`TSP rota sayısı`, R`n!`], [R`Kalite farkı`, R`\Delta E = f(x') - f(x)`], [R`Kötü hamleyi kabul olasılığı`, R`P = e^{-|\Delta E|/T}`], [R`Soğutma takvimi`, R`T \leftarrow \alpha \cdot T \quad (\alpha \approx 0{,}95)`]],
    qs: [
      {id: '4.1', q: R`Kargo örneğinde (60 → 70 → 50 → 100) tepe tırmanma nerede durur? Neden?`,
        st: [R`60'tan komşu 70'e çıkar (daha iyi).`, R`70'te sol komşu 60, sağ komşu 50; ikisi de daha kötü.`, R`Kural "sadece daha iyi komşuya geç" olduğu için durur.`],
        ans: R`**70 puanlık yerel maksimumda** durur. Aşağı inmeyi reddettiği için vadiden geçip 100'e ulaşamaz (zirve yanılgısı).`},
      {id: '4.2', q: R`Tavlama benzetiminde T = 40 iken 70 puandan 50 puanlık komşuya geçme olasılığı nedir? Çekilen rastgele sayı r = 0,45 ise ne olur? r = 0,80 ise?`,
        st: [R`$\Delta E = 50 - 70 = -20$.`, R`$P = e^{-|\Delta E|/T} = e^{-20/40} = e^{-0{,}5} \approx 0{,}61$ (slaytta yuvarlanmış 0,60).`, R`r = 0,45 ≤ 0,61 → kötü hamle **kabul**, vadiye iner.`, R`r = 0,80 > 0,61 → **reddedilir**, 70'te kalır.`],
        ans: R`P ≈ 0,61 (%60). r = 0,45 → kabul; r = 0,80 → ret.`},
      {id: '4.3', q: R`Aynı kötü hamle ($\Delta E = -20$) için sıcaklık 10'a düştüğünde kabul olasılığı ne olur? Bu ne anlama gelir?`,
        st: [R`$P = e^{-20/10} = e^{-2} \approx 0{,}135$.`],
        ans: R`Yaklaşık **%13,5**. Soğudukça algoritma kötü hamleleri daha zor kabul eder: başta geniş keşif, sonda iyi tepeye yerleşme.`},
      {id: '4.4', q: R`Kargo örneğinde tabu aramanın adımlarını yazınız.`,
        st: [R`60 → 70'e çık (ilk tırmanış).`, R`60'a geri dönüş hamlesini (1↔2) tabu listesine ekle.`, R`70'te daha iyi komşu yok ama durmak yasak; geri dönüş de yasak → mecburen 50'ye in.`, R`70'e geri çıkmamak için 2↔3 hamlesini de tabuya ekle.`, R`50'den tek açık yol ileri → 100'e ulaş.`],
        ans: R`60 → 70 → 50 → **100**. Tabu listesi geri dönüşleri yasakladığı için gerçek zirveye kesin ulaşır.`},
      {id: '4.5', q: R`6 şehirli ve 8 şehirli bir gezgin satıcı probleminde (slayttaki $n!$ mantığıyla) kaç olası rota vardır?`,
        st: [R`$6! = 720$.`, R`$8! = 40.320$.`],
        ans: R`6 şehir → **720**, 8 şehir → **40.320** rota. (Farklı tur sayısı $(n-1)!/2$ ile 60 ve 2.520.)`},
      {id: '4.6', q: R`Hangi yerel arama algoritması? a) Arazide tek bir zirve olduğu biliniyor. b) Bir mikroçipte milyonlarca transistörün yeri belirlenecek. c) Hastane nöbet çizelgesi hazırlanacak, çakışmalar tekrarlanmasın.`,
        ans: R`a) **Tepe tırmanma** (hızlı, parametresiz; tek tepede yeter). b) **Tavlama benzetimi** (bütün komşulara bakamazsın; rastgele tek hamle). c) **Tabu arama** (hafıza, çakışan atamalar tabuya).`},
      {id: '4.7', q: R`Tabu arama tavlamadan daha garantili görünüyor. Neden her zaman tercih edilmez?`,
        ans: R`İki gizli maliyeti var: 1) Her adımda **bütün komşulara bakmak** zorunda; komşu sayısı çok büyükse çok yavaşlar. 2) **Sürekli uzayda** (virgüllü değerlerde) sonsuz komşu olduğu için tabu listesi tutulamaz, çalışamaz.`},
      {id: '4.8', q: R`Klasik arama ile yerel arama arasındaki farkları yazınız.`,
        ans: R`Klasik arama hedefe giden **yolu** bulur, yol maliyetini $g(n)$ önemser, alternatifleri ağaçta tutar (bellek yüksek) ve geri dönebilir. Yerel arama en iyi **durumu** bulur, sadece $f(x)$'i önemser, sadece mevcut durumu ve en iyi skoru tutar, geri dönemez; kesin çözüm yerine makul sürede yeterince iyi çözüm hedefler.`}
    ]
  });

  // ---------------------------------------------------------------- 5
  P.push({
    no: 5, hafta: 'Hafta 4', grp: 'Optimizasyon', title: 'Popülasyon tabanlı: GA, PSO, karınca',
    ozet: R`Tek aday yerine bir sürü adayla aramak: genetik algoritma (sırt çantası örneği, NASA ST5 anteni), parçacık sürü optimizasyonu (P_best, G_best), karınca kolonisi (feromon) ve e-ticaret senaryosu.`,
    konu: [
      {h: R`Popülasyon tabanlı temel mantık`, ol: [
        R`**Çoklu çözüm (popülasyon):** tek bir ajan yerine uzaya aynı anda çok sayıda rastgele aday bırakılır.`,
        R`**Etkileşim:** adaylar birbirinden bağımsız değildir; iyi özellikleri birleştirerek yeni çözümler üretirler.`,
        R`**Doğal seçilim:** her jenerasyonda düşük puanlı zayıf adaylar elenir, iyiler hayatta kalır.`,
        R`**Tuzak direnci:** aramaya geniş bir alana yayılarak başlandığı için yerel maksimum (sahte tepe) tuzaklarına takılma riski minimumdur.`],
        tbl: {h: ['Algoritma', 'Nereden ilham alır?'], r: [
          [R`**Genetik algoritma** (GA)`, R`Çözümleri kromozom gibi kodlayıp çaprazlama ve mutasyonla evrimleştirir.`],
          [R`**Karınca kolonisi** (ACO)`, R`Karıncaların yiyecek ararken bıraktığı feromon izlerini taklit ederek en kısa yolu bulur.`],
          [R`**Parçacık sürü** (PSO)`, R`Kuş ya da balık sürülerinin yiyecek ararken birbirleriyle haberleşerek hareket etmesi.`]]}},
      {h: R`Genetik algoritma (GA)`, p: [
        R`Doğadaki evrim sürecini ve **güçlü olanın hayatta kalması** ilkesini taklit eden arama yöntemidir. Döngü: **Test → Seçilim → Çaprazlama → Mutasyon → Test …** Sistem yeterince iyi bir çözüme yakınsayana ya da belirlenen jenerasyon sınırına ulaşılana kadar tekrar eder.`],
        tbl: {h: ['Kavram', 'Anlamı'], r: [
          [R`**Popülasyon**`, R`Çözüm adaylarının (bireylerin) oluşturduğu başlangıç kümesi.`],
          [R`**Kromozom (birey) kodlama**`, R`Her çözüm adayı bir gen dizilimi olarak yazılır, örn. [1, 0, 1, 1, 0].`],
          [R`**Uygunluk testi** (fitness)`, R`Her bireyin probleme ne kadar iyi çözüm sunduğu hesaplanır ve puanlanır.`],
          [R`**Seçilim**`, R`Puanı yüksek (güçlü) bireyler yeni nesli oluşturmak için ebeveyn seçilir; düşükler elenir.`],
          [R`**Çaprazlama**`, R`Ebeveynlerin genleri belli bir noktadan kesilip birleştirilerek yeni yavrular üretilir; iyi özellikler nesilden nesile aktarılır.`],
          [R`**Mutasyon**`, R`Yavruların genlerinde çok düşük bir ihtimalle rastgele ufak değişiklik yapılır. Amaç: çeşitliliği korumak ve yerel maksimuma sıkışmayı engellemek.`]]}},
      {h: R`GA örneği: sırt çantası (knapsack) problemi`, p: [
        R`Çanta en fazla **15 kg** taşıyor. Eşyalar: 1) Altın heykel 7 kg / 100 TL · 2) Elmas kutu 5 kg / 80 TL · 3) Tarihi kılıç 4 kg / 70 TL · 4) Antika saat 3 kg / 50 TL. Amaç: 15 kg'ı aşmadan en yüksek toplam değeri çantaya koymak.`],
        ol: [
          R`**Kodlama ve popülasyon:** her eşya 1 gen; alırsak 1, almazsak 0. Kromozom [Heykel, Kutu, Kılıç, Saat]. Rastgele 3 birey: A = [1,1,0,0] (heykel + kutu), B = [0,1,1,1] (kutu + kılıç + saat), C = [1,1,1,0] (heykel + kutu + kılıç).`,
          R`**Uygunluk:** A: 7 + 5 = 12 kg, **180 TL** · B: 5 + 4 + 3 = 12 kg, **200 TL** · C: 7 + 5 + 4 = 16 kg → **sınır dışı**, elenir ya da cezalandırılır.`,
          R`**Seçim:** en yüksek skorlu ve sınırı aşmayan **A ve B** ebeveyn seçilir.`,
          R`**Çaprazlama:** tam ortadan (2. genden sonra) kes: A = [1,1 | 0,0], B = [0,1 | 1,1] → çocuk **[1,1,1,1]** (ilk iki gen A'dan, son iki gen B'den).`,
          R`**Mutasyon:** çocuk 19 kg → elenir. Mutasyon rastgele bir geni değiştirir: son geni 0 yapınca [1,1,1,0] (C ile aynı, yine sınır dışı). Döngü devam eder; başka bir mutasyonla [1,1,0,1] gibi yeni kombinasyonlar türer.`,
          R`**Durdurma:** algoritma nesiller boyu tekrarlar. Slayta göre sonunda B'nin (kutu + kılıç + saat, 12 kg, 200 TL) en iyi çözümlerden biri olduğunu doğrular.`],
        p2: [R`**Dikkat (kontrol ettim):** mutasyonla türeyen **[1,1,0,1]** = heykel + kutu + saat = 7 + 5 + 3 = **15 kg, 230 TL**. Sınırı aşmıyor ve 200'den büyük; gerçek optimum budur. Sonra 220 TL ile [1,0,1,1] gelir. Sınavda "en iyi çözüm" sorulursa 230 TL'yi yaz, slayttaki 200 TL'nin neden en iyi olmadığını da bir cümleyle ekle.`]},
      {h: R`Neden genetik algoritma?`, li: [
        R`4 eşya için $2^4 = 16$ kombinasyon denemek daha kolay değil mi? 4 eşya için evet, çok kolay. Ama 50 eşya için $2^{50} \approx 1{,}13 \times 10^{15}$ kombinasyon var; dünyanın en güçlü süper bilgisayarı bile yıllarca çalışmalı. Gerçek hayattaki lojistik, kargo rotaları, fabrika çizelgeleri ve borsa modelleri binlerce değişkenden oluşur.`,
        R`Faydaları: **zaman tasarrufu (akıllı arama)** · **kör noktalardan kaçış (mutasyon)** · **matematiksel kolaylık**.`,
        R`GA **en kusursuz çözümü garanti etmez**; ama bütün kombinasyonları denemenin imkânsız olduğu durumlarda kabul edilebilir kısa bir sürede **mükemmele en yakın** çözümü bulur.`]},
      {h: R`GA gerçek vakası: NASA ST5 anteni (2006)`, li: [
        R`NASA, uzaya gönderilecek küçük uyduların üzerinde çalışacak, sıradışı ortamlarda bile sinyalleri mükemmel yakalayan ve olabildiğince az enerji harcayan bir anten istiyordu.`,
        R`Evrimsel bir algoritma ve süper bilgisayarla tasarlanan, tarihteki **ilk yapay zeka / evrimleşmiş uzay antenidir**. İnsan mühendislerin simetrik çanak ya da çubuk antenlerine hiç benzemiyor; sıfırdan algoritma tarafından üretildi.`,
        R`**Popülasyon ve test:** rastgele bükülmüş binlerce tel tasarımı simüle edildi, sinyal performansı (uygunluk) ölçüldü. **Doğal seçilim:** sinyal yayılımı kötü olanlar elendi. **Çaprazlama ve mutasyon:** iyi kıvrımlar birleştirildi, rastgele yeni bükülme açıları eklendi. **Optimum:** insan aklına gelmeyecek kadar asimetrik ama istenen X-bandı frekansında kusursuz çalışan tasarım.`]},
      {h: R`Parçacık sürü optimizasyonu (PSO)`, p: [
        R`Kuş ve balık sürülerinin yiyecek ararken sergilediği sosyal davranıştan ilham alır. **Evrimsel bir eleme (ölüm) yoktur**; bunun yerine **ortak akılla hedefe uçuş** vardır. Temel yaklaşım: sürü zekası (swarm intelligence).`],
        tbl: {h: ['Kavram', 'Anlamı'], r: [
          [R`**Parçacık** (çözüm adayı)`, R`Arama uzayında anlık konumu (position) ve hız vektörü (velocity) ile tanımlanır.`],
          [R`**$P_{best}$** (yerel hafıza, personal best)`, R`Parçacığın kendi geçmişinde ulaştığı en iyi (hedefe en yakın) koordinat. Bilişsel eğilim.`],
          [R`**$G_{best}$** (global hafıza, global best)`, R`Bütün sürünün o iterasyona kadar keşfettiği en iyi ortak nokta. Sosyal çekim merkezi.`],
          [R`**Hız ve konum güncellemesi**`, R`Bir sonraki adım; mevcut hız (atalet), $P_{best}$'e uzaklık ve $G_{best}$'e uzaklık ağırlıklandırılarak hesaplanır.`],
          [R`**Yakınsama**`, R`$G_{best}$ güncellendikçe bütün parçacıkların global optimuma doğru kümelenmesi ve sistemin kararlı duruma geçmesi.`]]},
        p2: [R`**Örnek: açık alanda Wi-Fi / kara kutu sinyali arama.** Sürü = telsizli kurtarma ekibi · $P_{best}$ = herkesin kendi güzergâhında ölçtüğü en yüksek sinyal · $G_{best}$ = "Kuzeyde sinyal %70" anonsu · Hareket = $P_{best}$ ve $G_{best}$'i harmanlayıp o yöne ilerlemek · Sonuç = ortak akılla tek bir hedefi bulmak.`,
          R`**Günümüzdeki yeri:** tek başına çalışmaktan çok derin öğrenme modellerinin arka plan motoru: **hiperparametre optimizasyonu** (öğrenme oranı, katman sayısı, dropout oranı) ve **özellik seçimi** (en kritik verilere odaklanıp eğitim süresini kısaltma).`]},
      {h: R`PSO güncelleme formülü`, ek: true, p: [R`Slaytta formül sözle anlatıldı; standart hâli şudur ($w$ atalet, $c_1, c_2$ öğrenme katsayıları, $r_1, r_2$ 0–1 arası rastgele sayılar):`],
        f: [R`v \leftarrow w \cdot v + c_1 r_1 (P_{best} - x) + c_2 r_2 (G_{best} - x) \qquad x \leftarrow x + v`]},
      {h: R`Karınca kolonisi optimizasyonu (ACO)`, p: [
        R`Kör karıncaların yuva ile yiyecek arasındaki **en kısa yolu** bulma yeteneğine dayanır. Genelde **rotalama** ve **gezgin satıcı (TSP)** problemlerinde kullanılır.`],
        tbl: {h: ['Kavram', 'Anlamı'], r: [
          [R`**Dolaylı iletişim**`, R`Çevreye bırakılan kimyasal izler (feromon) üzerinden haberleşme.`],
          [R`**Feromon izi $\tau$**`, R`Geçmişteki başarıyı temsil eden dinamik yol puanı matrisi.`],
          [R`**Sezgisel bilgi $\eta$**`, R`İki nokta arası fiziksel mesafe ya da maliyet gibi probleme ait sabit veri.`],
          [R`**Olasılıksal geçiş kuralı**`, R`Rota seçiminin $\tau$ (iz yoğunluğu) ve $\eta$ (yolun kısalığı) dengesine göre **rulet** mantığıyla yapılması.`],
          [R`**Feromon buharlaşması**`, R`Yerel tuzağa saplanmamak ve kötü yolları unutmak için izlerin periyodik olarak silinmesi.`],
          [R`**Feromon güncellemesi**`, R`Kısa yoldan hedefe ulaşan ajanların rotaya daha yoğun iz bırakıp yeni nesilleri o güzergâha çekmesi.`]]},
        p2: [R`**Neden çalışır?** Kısa yoldan gidenler hedefe çabuk varıp hızlı döner → kısa yolda trafik artar, feromon hızla yoğunlaşır. Arkadan gelenler en yoğun kokuyu seçer; koku arttıkça o yola giren karınca da artar (**pozitif geri bildirim**). Uzun yollardaki feromon buharlaşır; sistem kötü çözümleri kendi kendine unutur ve koloni tek ideal rotada birleşir.`,
          R`**Günümüzdeki yeri:** mikroçip (VLSI) tasarımı ve kablolama (CPU/GPU'da milyarlarca transistörün routing'i), Amazon ve otonom depo robotları (Kiva/Pegasus), küresel kargo şirketleri (UPS, FedEx, Amazon Logistics; anlık değişikliklerde saniyeler içinde yeni feromon izleri).`]},
      {h: R`Senaryo: bir e-ticaret devinin şehir içi otonom dağıtım sistemi`, p: [
        R`Slaytta altı görev ve altı algoritma eşleştirilmek üzere verildi (cevaplar "Çözümlü sorular" sekmesinde, soru 5.4). Ana fikir: karmaşık bir mühendislik sisteminde bu algoritmaların hiçbiri birbiriyle yarışmaz; sistemin **farklı departmanlarında birbirlerini tamamlarlar**. Slaytın kapanış sözü: "Hiçbirimiz hepimiz kadar akıllı değiliz." (Ken Blanchard)`]}
    ],
    ezber: [
      R`Popülasyon tabanlı: çoklu çözüm, etkileşim, doğal seçilim, tuzak direnci.`,
      R`GA döngüsü: **test (uygunluk) → seçilim → çaprazlama → mutasyon**. Mutasyon = çeşitlilik, yerel max'tan kaçış.`,
      R`Sırt çantası: A 180, B 200, C sınır dışı (16 kg), çocuk [1,1,1,1] 19 kg; gerçek optimum **[1,1,0,1] = 15 kg, 230 TL**.`,
      R`$2^{50} \approx 1{,}13 \times 10^{15}$ → bu yüzden GA. GA kusursuzu garanti etmez, mükemmele yakını hızlı bulur.`,
      R`NASA ST5 (2006): ilk evrimleşmiş uzay anteni, asimetrik, X-bandı.`,
      R`PSO: eleme yok, $P_{best}$ (bireysel) + $G_{best}$ (sosyal); hiperparametre ve özellik seçimi.`,
      R`ACO: feromon $\tau$, sezgisel $\eta$, rulet seçimi, buharlaşma, pozitif geri bildirim; TSP, VLSI, depo robotları, kargo.`],
    formul: [[R`$n$ eşya için kombinasyon`, R`2^n`], [R`PSO hız (ek)`, R`v \leftarrow w v + c_1 r_1 (P_{best} - x) + c_2 r_2 (G_{best} - x)`], [R`PSO konum (ek)`, R`x \leftarrow x + v`]],
    qs: [
      {id: '5.1', q: R`Sırt çantası örneğinde (15 kg; heykel 7/100, kutu 5/80, kılıç 4/70, saat 3/50) bireyler A = [1,1,0,0], B = [0,1,1,1], C = [1,1,1,0]. Uygunluklarını hesaplayınız, ebeveynleri seçiniz, 2. genden sonra çaprazlayınız.`,
        st: [R`A: 7 + 5 = 12 kg, 100 + 80 = 180 TL.`, R`B: 5 + 4 + 3 = 12 kg, 80 + 70 + 50 = 200 TL.`, R`C: 7 + 5 + 4 = 16 kg > 15 → sınır dışı.`, R`Ebeveynler: A ve B.`, R`A = [1,1 | 0,0], B = [0,1 | 1,1] → çocuk [1,1 | 1,1] = [1,1,1,1], 19 kg → sınır dışı.`],
        ans: R`A 180 TL, B 200 TL, C elenir. Ebeveyn A ve B; çocuk [1,1,1,1] (19 kg) elenir, mutasyon gerekir.`},
      {id: '5.2', q: R`Aynı problemin gerçek en iyi çözümü nedir? GA bunu nasıl bulabilir?`,
        tip: R`Ağırlığı tam 15 kg olan bir kombinasyon var.`,
        st: [R`Sınırı aşmayan en değerli kombinasyonları dene: heykel + kutu + saat = 15 kg, 230 TL; heykel + kılıç + saat = 14 kg, 220 TL; kutu + kılıç + saat = 12 kg, 200 TL.`, R`Çocuk [1,1,1,1]'de üçüncü geni 0 yapan bir mutasyon [1,1,0,1]'i üretir.`],
        ans: R`**[1,1,0,1] = heykel + kutu + saat, 15 kg, 230 TL.** Mutasyon çocuğun bir genini değiştirerek bu kombinasyona ulaşır; uygunluk testi 230 > 200 olduğunu görür.`},
      {id: '5.3', q: R`Ebeveynler [1,0,1,1,0] ve [0,1,0,0,1]. 3. genden sonra tek noktalı çaprazlama yapınız. Sonra birinci çocuğun son genine mutasyon uygulayınız.`,
        st: [R`[1,0,1 | 1,0] ve [0,1,0 | 0,1].`, R`Çocuk 1: ilk üç gen birinciden, son iki gen ikinciden → [1,0,1,0,1].`, R`Çocuk 2: [0,1,0,1,0].`, R`Mutasyon: çocuk 1'in son geni 1 → 0: [1,0,1,0,0].`],
        ans: R`Çocuklar **[1,0,1,0,1]** ve **[0,1,0,1,0]**; mutasyonlu çocuk **[1,0,1,0,0]**.`},
      {id: '5.4', q: R`**Senaryo (slayt):** e-ticaret devinin otonom dağıtım sistemi. Görevleri algoritmalarla eşleştiriniz. Görevler: 1) Sokak sokak rota optimizasyonu (gezgin satıcı) 2) Kargo drone'unun fiziksel tasarımı 3) Anlık filo konumlandırma (sıcak nokta arama) 4) Depo vardiya ve şarj çizelgeleme 5) Tahmin modelinin ince ayarı (hiperparametre) 6) Drone'un anlık çıkan engeli aşması. Algoritmalar: A Tepe tırmanma, B Tavlama benzetimi, C Tabu arama, D Genetik algoritma, E PSO, F Karınca kolonisi.`,
        tip: R`Her algoritmanın "nerede kullanılır" slaytını hatırla; her harf bir kez kullanılıyor.`,
        st: [R`1 → **F (ACO):** rotalama ve TSP karıncanın uzmanlık alanı.`, R`2 → **D (GA):** fiziksel tasarımı evrimleştirmek; NASA ST5 anteni gibi.`, R`3 → **E (PSO):** sürünün ortak akılla sinyal/sıcak nokta araması (Wi-Fi örneği).`, R`4 → **C (Tabu):** kurallı çizelgeleme, çakışmaları tekrarlamamak.`, R`5 → **B (Tavlama):** hiperparametre ayarında yerel doğruluğa takılmamak için başta riskli değişimler.`, R`6 → **A (Tepe tırmanma):** milisaniyelik karar; en yakın iyi hamle.`],
        ans: R`**1-F, 2-D, 3-E, 4-C, 5-B, 6-A.** Not: PSO da hiperparametre için kullanılır; ama her harf bir kez kullanılınca 5'e tavlama düşer.`},
      {id: '5.5', q: R`PSO ile genetik algoritma arasındaki temel fark nedir?`,
        ans: R`GA'da evrimsel eleme vardır: zayıf bireyler ölür, güçlüler çaprazlanıp mutasyona uğrar. PSO'da **eleme yoktur**; parçacıklar yaşamaya devam eder ve kendi en iyisi ($P_{best}$) ile sürünün en iyisine ($G_{best}$) bakarak hız ve konumlarını günceller (ortak akılla hedefe uçuş).`},
      {id: '5.6', q: R`Karınca kolonisinde feromon buharlaşması olmasaydı ne olurdu?`,
        ans: R`İlk bulunan (belki kötü) yollardaki iz hiç silinmez, pozitif geri bildirimle daha da güçlenirdi. Koloni bir yerel tuzağa saplanır, daha iyi yolları keşfedemezdi. Buharlaşma kötü yolların unutulmasını ve keşfin sürmesini sağlar.`},
      {id: '5.7', q: R`50 eşyalı bir sırt çantası probleminde kaç kombinasyon vardır? Neden kaba kuvvet yerine GA kullanılır?`,
        st: [R`Her eşya için 2 seçenek (al / alma) → $2^{50}$.`, R`$2^{50} = 1.125.899.906.842.624 \approx 1{,}13 \times 10^{15}$.`],
        ans: R`Yaklaşık **$1{,}13 \times 10^{15}$** kombinasyon; hepsini denemek süper bilgisayarda bile yıllar sürer. GA kusursuzu garanti etmez ama kısa sürede mükemmele yakın çözüm bulur.`}
    ]
  });
})();
