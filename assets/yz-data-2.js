// Yapay Zeka · 2. kısım: makine öğrenmesi ve YSA bölümleri (Hafta 5–7), test, senaryolar, dikkat listesi
(function(){
  var R = String.raw;
  var Y = window.YZ, P = Y.parts;

  // ---------------------------------------------------------------- 6
  P.push({
    no: 6, hafta: 'Hafta 5', grp: 'Makine öğrenmesi', title: 'Makine öğrenmesi ve gözetimli öğrenme',
    ozet: R`Kuralı makinenin veriden çıkarması: klasik programlamayla farkı, 4 öğrenme türü, özellik ve etiket, gözetimli öğrenmenin eğitim/tahmin aşamaları, sınıflandırma (K-NN, karar ağacı) ve regresyon (doğrusal regresyon).`,
    konu: [
      {h: R`Makine öğrenmesi nedir?`, li: [
        R`Makineye kuralı bizim yazmadığımız, makinenin **veriye bakarak kuralı/istatistiği kendi çıkardığı** sistemlerdir. Örnekler: K-NN, karar ağaçları, destek vektör makineleri.`,
        R`İç içe halkalar: **Yapay zeka ⊃ Makine öğrenmesi ⊃ YSA ⊃ Derin öğrenme ⊃ Üretken yapay zeka.** Big data ve NLP bu halkalarla kesişen ayrı alanlardır.`]},
      {h: R`Klasik programlama ve makine öğrenmesi`, tbl: {h: ['Yaklaşım', 'Girdiler', 'Çıktı'], r: [
        [R`**Klasik programlama** (kural tabanlı klasik YZ)`, R`Veri + **kurallar**`, R`Cevap`],
        [R`**Makine öğrenmesi** (veri odaklı sistemler)`, R`Veri + **cevap (çıktı)**`, R`**Kurallar**`]]},
        p2: [R`Yani klasik programlamada kuralı programcı yazar; makine öğrenmesinde örneklerden kuralı algoritma öğrenir.`]},
      {h: R`Makine öğrenmesinin 4 türü`, tbl: {h: ['Tür', 'Veri', 'Tipik görevler'], r: [
        [R`**Gözetimli** (supervised)`, R`Etiketli veri; hata geri beslemesiyle eşleme (mapping) öğrenilir`, R`Sınıflandırma, regresyon`],
        [R`**Gözetimsiz** (unsupervised)`, R`Etiketsiz veri; gruplar/yapı keşfedilir`, R`Kümeleme, boyut indirgeme`],
        [R`**Yarı gözetimli** (semi-supervised)`, R`Az etiketli + çok etiketsiz veri`, R`Yarı gözetimli sınıflandırma`],
        [R`**Pekiştirmeli** (reinforcement)`, R`Durum ve eylem; ödül (reward) ya da ceza ile öğrenme`, R`Eylem seçme (oyun, robot)`]]}},
      {h: R`Doğru yöntemi seçmek`, li: [
        R`Tek bir doğru cevap, **her duruma uyan bir seçenek yok**. Deneme yanılma esastır.`,
        R`Seçimleri daraltmak için sorular: **verinin boyutu · veri türü · istenen çıktı · hız ve açıklanabilirlik**.`]},
      {h: R`Özellik, model ve etiket`, tbl: {h: ['', 'Ne?', 'Örnek'], r: [
        [R`**$X$ · Özellik** (feature)`, R`Girdi verisi; modelin anladığı ölçülebilir nitelikler.`, R`Metrekare, oda sayısı, bina yaşı`],
        [R`**$f(x)$ · Model algoritması**`, R`Girdiyi alıp çıktıya dönüştüren haritalama fonksiyonu.`, R`K-NN, karar ağacı`],
        [R`**$Y$ · Etiket** (label)`, R`Tahmin edilmeye çalışılan hedef değişken; çıktı.`, R`Evin fiyatı`]]}},
      {h: R`Gözetimli öğrenme: iki aşama`, li: [
        R`**Eğitim aşaması:** girdiler $X$ (araba, kedi, köpek, ev görselleri) ve etiketler $Y$ (araba, kedi, köpek, ev) birlikte algoritmaya verilir. Algoritma bir öğrenme fonksiyonu $f(x) = y$ üretir, hataları hesaplar, düzeltir → **eğitilmiş model**.`,
        R`**Tahmin aşaması:** daha önce görülmemiş bir kedi görseli eğitilmiş modele verilir → **tahmin: "kedi"**.`,
        R`**Amaç:** girdileri ($X$) alıp istenen çıktılara ($Y$) dönüştüren **en optimal haritalama fonksiyonunu $f(x) = y$** bulmaktır.`,
        R`Slayttaki resim: etiketli veri ("elma") ile eğitilen model, yeni gelen bilinmeyen meyveye "Bu bir elma!" der.`]},
      {h: R`Gözetimli öğrenmenin kör noktası: husky mi kurt mu?`, ek: true, p: [
        R`Slaytta bir husky ve bir kurt fotoğrafı var. Bilinen deneyde kurt fotoğraflarının çoğu karlı arka planlıydı; model hayvana değil **karlara** bakmayı öğrendi ve karda duran husky'ye "kurt" dedi. Ders: model etiketle tesadüfen birlikte görünen bir özelliği ezberleyebilir; eğitim verisi temsil edici olmalı, modelin neye baktığı kontrol edilmeli.`]},
      {h: R`Sınıflandırma ve regresyon`, li: [
        R`Gözetimli öğrenme **çıktının ($Y$) matematiksel yapısına göre** ikiye ayrılır.`,
        R`**Sınıflandırma:** veriden **ayrık sınıflara**. Örnek algoritmalar: K-NN, karar ağaçları.`,
        R`**Regresyon:** veriden **sayısal bir değerin** tahmini.`,
        R`**İkili sınıflandırma** (binary): sadece iki olasılık vardır, örn. spam / spam değil. **Çok sınıflı** (multiclass): ikiden fazla kategori, örn. köpek, kedi, at, balık, kuş.`]},
      {h: R`Sınıflandırma örneği: dersi geçti mi?`, tbl: {h: ['$X_1$ derse katılım (%)', '$X_2$ lab notu', '$Y$ durum'], r: [
        ['80', '85', 'Geçti'], ['30', '40', 'Kaldı'], ['90', '95', 'Geçti'], ['45', '35', 'Kaldı'], ['75', '70', 'Geçti'], ['**85**', '**80**', '**?**']]},
        p2: [R`Son öğrencinin sınıfını K-NN ile bulmak için "Çözümlü sorular" 6.1'e bak (cevap: Geçti).`]},
      {h: R`K-en yakın komşuluk (K-NN)`, li: [
        R`Bir veri noktasının sınıfı, uzayda ona en yakın **K adet komşunun çoğunluk sınıfı** tarafından belirlenir.`,
        R`Makine öğrenmesindeki **en sezgisel** yaklaşımdır.`,
        R`Yakınlık nasıl hesaplanır? **Öklid mesafesi** ya da **Manhattan** (arama konusundaki aynı formüller).`,
        R`Şekil: yeni nokta P, en yakın komşulara oklarla bakıyor; Class A, B, C kümeleri.`]},
      {h: R`K seçerken dikkat`, ek: true, p: [R`İki sınıflı problemde K'yı **tek sayı** seçmek beraberliği önler. K çok küçükse model gürültüye duyarlı olur, çok büyükse sınırlar bulanıklaşır. Özelliklerin ölçekleri çok farklıysa (örneğin TL ve yüzde) mesafeyi büyük ölçekli özellik domine eder; önce ölçekleme yapılır.`]},
      {h: R`Karar ağaçları (decision tree)`, p: [
        R`Veri setindeki özellikleri kullanarak **sorular sorar** ve veriyi en iyi şekilde alt gruplara ayırarak bir ağaç yapısı oluşturur.`,
        R`Slayttaki ağaç: **Kaç bacağı var?** → 0: **Yılan** · 2: **Konuşabiliyor mu?** (hayır → **Kanguru**; evet → **Söylediğini anlıyor mu?** evet → **İnsan**, hayır → **Papağan**) · 4: **Mırlıyor mu?** (evet → **Kedi**, hayır → **Köpek**).`]},
      {h: R`Regresyon`, li: [
        R`Tahmin edilen etiket **sayısal (sürekli)** bir değerse regresyon problemidir; sonsuz sayıda olası çıktı vardır.`,
        R`Kullanım: **geleceği tahmin etmek**, **değişkenler arası ilişkiyi** bulmak.`,
        R`Popüler algoritmalar: **doğrusal regresyon** (linear regression), **destek vektör regresyonu** (SVR), **karar ağacı regresyonu**.`]},
      {h: R`Doğrusal regresyon`, li: [
        R`Veri noktalarının arasından geçen **optimum (en iyi) doğruyu** matematiksel olarak bulma işlemidir.`,
        R`**Nasıl öğrenir? (kayıp fonksiyonu):** gerçek noktalarla çizilen doğru arasındaki uzaklıkların karelerinin ortalaması (**MSE**) minimize edilir.`,
        R`$W$: ağırlık / eğim. $b$: sapma / y-kesişimi (modelin öğrendiği başlangıç).`,
        R`Grafik: ev fiyatı tahmini, x ekseni evin büyüklüğü (m²), y ekseni fiyat.`,
        R`**Özellik mühendisliği:** çoklu girdiler (metrekare, oda sayısı, konum) bir matematiksel formülle tek bir girdiye, örneğin "ev değer skoru"na dönüştürülüp o skor üzerinden doğru çizilebilir.`],
        f: [R`Y = W \cdot X + b \qquad \text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2`]},
      {h: R`Lab uygulaması (gözetimli öğrenme)`, li: [
        R`Sınıflandırma: K-en yakın komşuluk, karar ağacı. Regresyon: doğrusal regresyon.`,
        R`Adımlar: **veri yükleme → veri bölme (data splitting) → eğitim (train) ve test → görselleştirme**.`]}
    ],
    ezber: [
      R`ML: kuralı makine veriden çıkarır. YZ ⊃ ML ⊃ YSA ⊃ DL ⊃ üretken YZ.`,
      R`Klasik programlama: veri + kural → cevap. ML: veri + cevap → kural.`,
      R`4 tür: gözetimli (etiketli), gözetimsiz (etiketsiz), yarı gözetimli (az etiket), pekiştirmeli (ödül).`,
      R`Doğru yöntem için 4 soru: veri boyutu, veri türü, istenen çıktı, hız ve açıklanabilirlik.`,
      R`$X$ özellik, $f(x)$ model, $Y$ etiket. Amaç: en optimal $f(x) = y$.`,
      R`Sınıflandırma = ayrık sınıf (ikili / çok sınıflı); regresyon = sayısal değer.`,
      R`K-NN: K komşunun çoğunluğu; Öklid ya da Manhattan. Karar ağacı: sorularla bölme.`,
      R`Doğrusal regresyon: $Y = WX + b$, MSE'yi minimize et.`],
    formul: [[R`Doğrusal regresyon`, R`Y = W \cdot X + b`], [R`Kayıp (MSE)`, R`\frac{1}{n} \sum (y_i - \hat{y}_i)^2`], [R`K-NN Öklid mesafesi`, R`\sqrt{(x_1 - a_1)^2 + (x_2 - a_2)^2}`]],
    qs: [
      {id: '6.1', q: R`Tablo: (katılım, lab) → durum: (80, 85) Geçti, (30, 40) Kaldı, (90, 95) Geçti, (45, 35) Kaldı, (75, 70) Geçti. Yeni öğrenci (85, 80). **K = 3** ve Öklid mesafesiyle K-NN sonucu nedir?`,
        st: [R`(80, 85): $\sqrt{5^2 + 5^2} = \sqrt{50} \approx 7{,}07$ → Geçti.`, R`(75, 70): $\sqrt{10^2 + 10^2} = \sqrt{200} \approx 14{,}14$ → Geçti.`, R`(90, 95): $\sqrt{5^2 + 15^2} = \sqrt{250} \approx 15{,}81$ → Geçti.`, R`(45, 35): $\sqrt{40^2 + 45^2} \approx 60{,}21$ → Kaldı. (30, 40): $\sqrt{55^2 + 40^2} \approx 68{,}01$ → Kaldı.`, R`En yakın 3 komşu: 7,07 Geçti, 14,14 Geçti, 15,81 Geçti.`],
        ans: R`3 komşunun 3'ü de Geçti → **Geçti**. (K = 1 ve K = 5 ile de Geçti çıkar.)`},
      {id: '6.2', q: R`Aynı soruyu Manhattan mesafesiyle çözünüz.`,
        st: [R`(80, 85): 5 + 5 = 10 · (75, 70): 10 + 10 = 20 · (90, 95): 5 + 15 = 20 · (45, 35): 40 + 45 = 85 · (30, 40): 55 + 40 = 95.`, R`En yakın üç: 10, 20, 20 → hepsi Geçti.`],
        ans: R`**Geçti**.`},
      {id: '6.3', q: R`Karar ağacına göre sınıflandırınız: a) 4 bacaklı, mırlamıyor b) 2 bacaklı, konuşuyor ama ne dediğini anlamıyor c) 2 bacaklı, konuşmuyor d) bacaksız.`,
        ans: R`a) **Köpek** b) **Papağan** c) **Kanguru** d) **Yılan**.`},
      {id: '6.4', q: R`Sınıflandırma mı regresyon mu? (İkili mi çok sınıflı mı?) a) E-postanın spam olup olmadığı b) Evin fiyatı c) Fotoğraftaki hayvanın türü d) Yarınki sıcaklık e) Kredi başvurusu onay/ret.`,
        ans: R`a) **İkili sınıflandırma** b) **Regresyon** c) **Çok sınıflı sınıflandırma** d) **Regresyon** e) **İkili sınıflandırma**.`},
      {id: '6.5', q: R`Doğrusal regresyon modeli $Y = 0{,}03 \cdot X + 1$ (X: m², Y: milyon TL). 100 m² ve 150 m² evin tahmini fiyatı nedir? $W$ ve $b$ neyi ifade eder?`,
        st: [R`100 m²: $0{,}03 \cdot 100 + 1 = 4$ milyon TL.`, R`150 m²: $0{,}03 \cdot 150 + 1 = 5{,}5$ milyon TL.`],
        ans: R`**4 milyon TL** ve **5,5 milyon TL**. $W = 0{,}03$ eğim: her ek m² fiyatı 30 bin TL artırır. $b = 1$ sapma: doğrunun y-kesişimi.`},
      {id: '6.6', q: R`Klasik programlama ile makine öğrenmesini girdi ve çıktılarıyla karşılaştırınız.`,
        ans: R`Klasik programlamada girdi **veri + kurallar**, çıktı **cevaptır**; kuralları programcı yazar. Makine öğrenmesinde girdi **veri + cevaplar (etiketler)**, çıktı **kurallardır**; model kuralı örneklerden öğrenir.`},
      {id: '6.7', q: R`Hangi öğrenme türü? a) Binlerce etiketli röntgenle hastalık teşhisi b) Etiketsiz müşteri verisini gruplamak c) Bir robotun düşünce ceza, ilerleyince ödül alarak yürümeyi öğrenmesi d) 100 etiketli ve 10.000 etiketsiz görselle sınıflandırma.`,
        ans: R`a) **Gözetimli** b) **Gözetimsiz** c) **Pekiştirmeli** d) **Yarı gözetimli**.`},
      {id: '6.8', q: R`Gözetimli öğrenmenin "kör noktası" nedir? Husky–kurt örneğiyle açıklayınız.`,
        ans: R`Model, etiketle tesadüfen birlikte görünen bir özelliği öğrenebilir. Kurt fotoğrafları hep karlıysa model hayvana değil kara bakar ve karda duran husky'ye "kurt" der. Çözüm: temsil edici, çeşitli eğitim verisi ve modelin neye baktığını kontrol etmek.`}
    ]
  });

  // ---------------------------------------------------------------- 7
  P.push({
    no: 7, hafta: 'Hafta 6', grp: 'Makine öğrenmesi', title: 'Gözetimsiz öğrenme: kümeleme ve anomali',
    ozet: R`Etiket olmadan verinin içindeki yapıyı bulmak: kümeleme, K-Means'in 4 adımı, K-Means ile anomali tespiti, John Snow'un kolera haritası ve hangi senaryonun hangi öğrenme türü olduğu.`,
    konu: [
      {h: R`Gözetimsiz öğrenme`, li: [
        R`**Eğitim aşaması:** sadece girdiler $X$ verilir (etiket yok). Algoritma **örüntü ve benzerlik keşfi** yapar (kümeleme) → eğitilmiş model.`,
        R`**Tahmin aşaması:** daha önce görülmemiş bir kedi görseli → tahmin: **"Küme 1"** (benzerler grubu). Model "kedi" demez; sadece hangi gruba benzediğini söyler.`,
        R`**Amaç:** girdileri belirli bir sonuca haritalamak değil, **verinin kendi içindeki gizli yapıyı, dağılımı ya da temel özelliklerini modellemektir.**`,
        R`Slayttaki resim: karışık elma ve armutlar → model "bir örüntü görüyorum" der → elmalar bir grup, armutlar bir grup.`]},
      {h: R`Kümeleme`, li: [
        R`Etiketlenmemiş verileri **benzerliklerine göre anlamlı gruplara** ayırma.`,
        R`**Kullanım alanları:** müşteri segmentasyonu · anomali tespiti · görüntü işleme.`,
        R`**Popüler algoritmalar:** K-means kümeleme · Mean shift kümeleme · Gaussian Mixture.`]},
      {h: R`K-Means kümeleme`, p: [
        R`Etiketsiz verileri (cevap anahtarı olmayan) uzaydaki yakınlıklarına göre **K adet gruba (kümeye)** ayırma işlemidir. Gözetimsiz öğrenmenin **en temel** algoritmasıdır.`],
        ol: [R`**K adet merkezi rastgele belirle.**`, R`**Her veriyi en yakın merkeze ata.**`, R`**Güncelleme:** her merkezi kendi kümesindeki noktaların ortalamasına taşı.`, R`**Merkezler sabit olana kadar tekrar et.**`],
        p2: [R`Slayttaki animasyon: iterasyon 0'da noktalar renksiz; 1'de 4 merkez (kırmızı X) ve 4 renkli küme; 2 ve 4. iterasyonda merkezler kayar, kümeler oturur.`]},
      {h: R`K'yı kim seçer?`, ek: true, p: [R`K'yı algoritma değil **biz** seçeriz. Yaygın yöntem "dirsek" (elbow): farklı K değerleri için küme içi uzaklık toplamı çizilir, eğrinin kırıldığı nokta seçilir. Başlangıç merkezleri rastgele olduğu için farklı çalıştırmalar farklı sonuç verebilir.`]},
      {h: R`K-Means ile anomali tespiti`, li: [
        R`Veri setindeki genel kalıplara, çoğunluğun davranışına ya da normal dağılıma **uymayan sıra dışı noktaların (aykırı değerlerin)** otomatik olarak bulunması. Küme merkezinden çok uzak kalan noktalar şüphelidir.`,
        R`Kullanım: **kredi kartı sahtekârlığı** (fraud detection) · **siber güvenlik** (ağ ihlalleri) · **kestirimci bakım**.`,
        R`Slayttaki grafik: müşteri verisinde (yıllık gelir – harcama skoru) normal müşteriler, anormal müşteriler ve küme merkezleri.`]},
      {h: R`Tarihin ilk veri bilimi haritası: John Snow (1854)`, p: [
        R`Londra'daki 1854 kolera salgınında John Snow ölümleri sokak haritasına işaretledi; vakaların bir su pompasının çevresinde kümelendiğini gördü. Kümeleme fikrinin tarihteki ünlü örneği olarak gösterildi.`]},
      {h: R`Lab uygulaması 1 (gözetimsiz)`, li: [
        R`Elinde bir mağazanın müşteri verileri var. Pazarlama: "Müşterilere özel kampanya yapacağız ama kimin neye ilgi duyduğunu bilmiyoruz, onları grupla."`,
        R`Ama elinde etiket (şu kişi zengin, şu kişi cimri) yok. K-Means'e sadece **gelir** ve **harcama** sütunları verilir.`,
        R`Algoritma noktalar arası mesafeleri hesaplar, birbirine yakın gelir/harcama alışkanlığı olanları aynı renge boyar ve **3 müşteri profili** çıkarır. Aynı labda anomali tespiti de yapıldı.`]}
    ],
    ezber: [
      R`Gözetimsiz: etiket yok; amaç verinin gizli yapısını bulmak. Tahmin "kedi" değil "Küme 1".`,
      R`Kümeleme kullanım: müşteri segmentasyonu, anomali tespiti, görüntü işleme. Algoritmalar: K-means, mean shift, Gaussian mixture.`,
      R`K-Means 4 adım: **K merkez rastgele → ata → güncelle (ortalama) → merkezler sabitlenene kadar tekrar**.`,
      R`Anomali: çoğunluğa uymayan aykırı noktalar; fraud, siber güvenlik, kestirimci bakım.`,
      R`John Snow, 1854 kolera haritası.`],
    formul: [[R`Küme merkezi güncelleme`, R`\mu_k = \frac{1}{|C_k|} \sum_{x \in C_k} x`]],
    qs: [
      {id: '7.1', q: R`**Senaryo (slayt):** Her biri için öğrenme türünü yazınız. 1) Dilimleyici ayarlarına bakarak 3D baskının kaç gram filament harcayacağını ve kaç saat süreceğini hesaplamak. 2) Kameradan alınan el iskelet verisinin sözlükteki hangi kelimeye/harfe denk geldiğini bulmak. 3) Normal motor titreşimlerinin içine karışmış olağandışı titreşimleri anında tespit etmek. 4) Geçmişteki "çalıntı" ve "normal" etiketli banka verilerine bakarak yeni işlemin dolandırıcılık olup olmadığına karar vermek. 5) Teşhis raporu (etiketi) olmayan binlerce röntgeni yapısal benzerliklerine göre 4 gruba ayırmak.`,
        st: [R`1) Çıktı sınıf değil, sürekli sayısal değer (gram, saat).`, R`2) Çıktı belirli ve ayrık bir liste (harfler/kelimeler), etiketli eğitim.`, R`3) Çoğunluktan aşırı sapan noktaları bulmak.`, R`4) Çıktı iki ayrık olasılık (evet/hayır) ve veri etiketli.`, R`5) Cevap anahtarı yok; sadece benzerliğe göre gruplamak.`],
        ans: R`1) **Gözetimli – regresyon** 2) **Gözetimli – çoklu sınıflandırma** 3) **Gözetimsiz – anomali tespiti** 4) **Gözetimli – ikili sınıflandırma** 5) **Gözetimsiz – kümeleme**.`},
      {id: '7.2', q: R`Noktalar: 1, 2, 3, 10, 11, 12. K = 2, başlangıç merkezleri 1 ve 2. K-Means'i merkezler sabitlenene kadar çalıştırınız.`,
        tip: R`Her noktayı en yakın merkeze ata, sonra merkez = kümenin ortalaması.`,
        st: [R`**İterasyon 1:** 1 → merkez 1; 2, 3, 10, 11, 12 → merkez 2 (2'ye daha yakın). Yeni merkezler: {1} → 1; {2, 3, 10, 11, 12} → 38 / 5 = 7,6.`, R`**İterasyon 2:** 1, 2, 3 → merkez 1'e yakın (örn. 3: |3−1| = 2 < |3−7,6| = 4,6); 10, 11, 12 → 7,6'ya yakın. Yeni merkezler: {1, 2, 3} → 2; {10, 11, 12} → 11.`, R`**İterasyon 3:** atamalar değişmiyor → merkezler sabit → dur.`],
        ans: R`Kümeler **{1, 2, 3}** (merkez 2) ve **{10, 11, 12}** (merkez 11).`},
      {id: '7.3', q: R`Gözetimli ve gözetimsiz öğrenmenin farkını eğitim verisi, amaç ve tahmin çıktısı açısından yazınız.`,
        ans: R`Gözetimli: veri **etiketli**; amaç $X$'i $Y$'ye eşleyen en iyi $f(x) = y$'yi bulmak; tahmin bir etiket ("kedi") ya da sayıdır. Gözetimsiz: veri **etiketsiz**; amaç verinin gizli yapısını/gruplarını bulmak; tahmin bir küme numarasıdır ("Küme 1").`},
      {id: '7.4', q: R`K-Means'in adımlarını yazınız. Algoritma ne zaman durur?`,
        ans: R`1) K merkezi rastgele seç 2) her noktayı en yakın merkeze ata 3) merkezleri kümelerinin ortalamasına güncelle 4) tekrarla. **Merkezler artık değişmeyince** (atamalar sabitlenince) durur.`},
      {id: '7.5', q: R`Anomali tespitine üç kullanım alanı yazınız ve K-Means ile nasıl yapıldığını açıklayınız.`,
        ans: R`Kredi kartı sahtekârlığı, siber güvenlikte ağ ihlalleri, kestirimci bakım (makine arızası). Veri kümelere ayrılır; çoğunluğun oluşturduğu kümelerden ve merkezlerden çok uzak kalan noktalar aykırı (anormal) kabul edilir.`}
    ]
  });

  // ---------------------------------------------------------------- 8
  P.push({
    no: 8, hafta: 'Hafta 6', grp: 'Makine öğrenmesi', title: 'Model değerlendirme ve metrikler',
    ozet: R`Modelin gerçekten öğrenip öğrenmediğini ölçmek: eğitim/doğrulama/test ayrımı, aşırı ve eksik öğrenme, K-katlı çapraz doğrulama, hata matrisi, sınıflandırma, regresyon ve kümeleme metrikleri, doğruluk paradoksu.`,
    konu: [
      {h: R`Veri bölme: eğitim, doğrulama, test`, p: [R`Veri seti modelin **genellenebilirliğini** ve performansını ölçmek için 3 parçaya ayrılır:`],
        tbl: {h: ['Parça', 'Pay', 'Ne işe yarar?'], r: [
          [R`**Eğitim seti** (train)`, R`~%70`, R`Modelin kuralları ve örüntüleri öğrendiği, ağırlıkların güncellendiği ana veri.`],
          [R`**Doğrulama seti** (validation)`, R`~%15`, R`Hiperparametreleri (örn. öğrenme hızı) ayarlamak ve eğitim sırasında ezberlemeyi (overfitting) önlemek için ara test.`],
          [R`**Test seti** (test)`, R`~%15`, R`Model eğitilirken ve ayarlanırken **hiç görmediği**, nihai performansı ölçen bağımsız veri; en son kullanılır.`]]},
        p2: [R`Benzetme: **train** = ders çalışma soruları, **validation** = evde çözdüğün deneme sınavı, **test** = gerçek vize/final.`]},
      {h: R`Aşırı öğrenme (overfitting)`, li: [
        R`Model eğitim verisini **ezberler**; yeni veride genelleme yapamaz.`,
        R`Benzetme: öğrenci son 5 yılın çıkmış sorularını cevap şıklarının sırasına kadar ezberler, evde %100 yapar; hoca finalde sorudaki sayıları değiştirince %20 alır (genelleme sıfır).`,
        R`**Gerçek vaka (Tetris):** bir YZ modeline Tetris oynaması ve kaybedince ceza alacağı öğretilir. Kötü oynadığı için bloklar tepeye kadar birikir; tam "Game Over" yazısı çıkmadan bir milisaniye önce oyunu **duraklatır (pause)**. Oyunun dinamiklerini ve uzun vadede hayatta kalmayı öğrenmek (genellemek) yerine "kaybedersen ceza yersin" kuralını kelimesi kelimesine ezberlemiş; sonsuza kadar pause ekranında bekleyerek sistemi hackler.`]},
      {h: R`Overfitting'e karşı ne yapılır?`, ek: true, li: [R`Daha fazla ve çeşitli eğitim verisi`, R`Modeli sadeleştirmek (daha az parametre, daha sığ ağaç)`, R`Düzenlileştirme (L1, L2) parametrelerini artırmak`, R`Erken durdurma: doğrulama hatası artmaya başlayınca eğitimi kesmek`, R`K-katlı çapraz doğrulamayla tespit etmek`],
        p2: [R`Belirti: **eğitim başarısı çok yüksek, doğrulama/test başarısı düşük.**`]},
      {h: R`Eksik öğrenme (underfitting)`, li: [
        R`Modelin **çok basit kalması** ve verinin altındaki gerçek örüntüleri yakalayacak kapasitesinin olmaması.`,
        R`Model **hem eğitim hem doğrulama setinde başarısız** olur.`,
        R`**Çözüm:** modelin karmaşıklığını (kapasitesini) artırmak · daha fazla özellik eklemek · düzenlileştirme (L1, L2) parametrelerini azaltmak · eğitim süresini (epoch/iterasyon) artırmak.`]},
      {h: R`K-katlı çapraz doğrulama`, li: [
        R`Eğitim verisi **K eşit parçaya** bölünür; her parça sırayla test (doğrulama) seti olur; **K sonucun ortalaması** alınır. Tek seferlik bölmenin **rastgelelik kaynaklı yanılgılarını** önler.`,
        R`Slayttaki uygulama: I. %80 eğitim, %20 test. II. %80'lik veri kendi içinde 5 eşit parçaya bölünür. III. Her iterasyonda 4 parça train, 1 parça validation. IV. Hiperparametreler (öğrenme hızı, ağaç derinliği…) validation skorlarına göre seçilir. V. Model hazır olunca test.`,
        R`Faydaları: **1)** ezberlemeyi (overfitting) engeller ve tespit eder **2)** verinin tamamını değerlendirmede kullanır **3)** gerçekçi ve güvenilir performans sonucu verir.`,
        R`**StratifiedKFold:** sınıf oranları her parçada korunarak bölme (lab 2).`],
        f: [R`\text{Performans} = \frac{1}{K} \sum_{i=1}^{K} \text{Performans}_i`]},
      {h: R`Performans metrikleri haritası`, p: [R`Bir modelin tahminlerinin gerçek verilere ne kadar yakın olduğunu ölçen matematiksel araçlar:`],
        tbl: {h: ['Sınıflandırma', 'Regresyon', 'Kümeleme'], r: [[R`Hata matrisi, doğruluk (accuracy), kesinlik (precision), duyarlılık (recall), F1-skoru, ROC-AUC`, R`MAE, MSE, RMSE, R-kare`, R`Silhouette skoru, Calinski-Harabasz, Davies-Bouldin index`]]}},
      {h: R`Hata matrisi (confusion matrix)`, p: [
        R`Sınıflandırma modelinin tahminlerinin gerçek değerlerle ne kadar uyuştuğunu gösteren çapraz tablodur. İkili sınıflandırmada dört sonuç vardır. Slayttaki düzen: **sütunlar gerçek değerler, satırlar tahmin.**`],
        tbl: {h: ['', 'Gerçek pozitif (1)', 'Gerçek negatif (0)'], r: [
          [R`**Tahmin pozitif (1)**`, R`**TP** · gerçekte olanı doğru bilmek`, R`**FP** · yanlış alarm vermek`],
          [R`**Tahmin negatif (0)**`, R`**FN** · tehlikeyi gözden kaçırmak`, R`**TN** · olmayanı doğru bilmek`]]}},
      {h: R`1 · Sınıflandırma metrikleri`, tbl: {h: ['Metrik', 'Ne gösterir?'], r: [
        [R`**Doğruluk** (accuracy)`, R`Bütün tahminlerin ne kadarının doğru olduğu.`],
        [R`**Kesinlik / keskinlik** (precision)`, R`"Pozitif" dediklerinin ne kadarının gerçekten pozitif olduğu.`],
        [R`**Duyarlılık** (recall)`, R`Gerçekte pozitif olanların ne kadarının yakalandığı.`],
        [R`**F1-skoru**`, R`Kesinlik ve duyarlılığın **harmonik ortalaması**.`]]},
        f: [R`\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN} \qquad \text{Precision} = \frac{TP}{TP + FP}`, R`\text{Recall} = \frac{TP}{TP + FN} \qquad F_1 = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}`]},
      {h: R`Precision mı recall mı?`, ek: true, p: [R`**Yanlış alarm pahalıysa precision** önemlidir: spam filtresi önemli bir maili spam'e atmamalı (FP az olmalı). **Kaçırmak pahalıysa recall** önemlidir: kanser taramasında hastayı kaçırmamak gerekir (FN az olmalı). İkisi arasında denge isteniyorsa F1 kullanılır.`]},
      {h: R`2 · Regresyon hata metrikleri`, tbl: {h: ['Metrik', 'Özelliği', 'Ne zaman?'], r: [
        [R`**MAE**`, R`Aykırı değerlere (outlier) karşı dirençli.`, R`Bütün hataların büyüklüğü eşit önemdeyse, genel sapma görülmek isteniyorsa.`],
        [R`**MSE**`, R`Büyük hataları çok şiddetli cezalandırır.`, R`Büyük hata yapmak çok riskliyse (örn. yanlış ilaç dozu); sağlık ve medikal tahminler.`],
        [R`**RMSE**`, R`MSE gibi büyük hataları cezalandırır ama sonucu **orijinal birimde** (TL, saat) verir.`, R`Hem büyük hatalardan kaçınmak hem kolay yorumlanan birimle raporlamak istendiğinde.`],
        [R`**$R^2$**`, R`Modelin başarısını 0 ile 1 (%0–%100) arasında oranlar.`, R`Teknik olmayan kişilere (yönetim, müşteri) modelin veriyi ne kadar iyi açıkladığını gösterirken.`]]},
        f: [R`\text{MAE} = \frac{1}{n} \sum |y_i - \hat{y}_i| \qquad \text{MSE} = \frac{1}{n} \sum (y_i - \hat{y}_i)^2`, R`\text{RMSE} = \sqrt{\frac{1}{n} \sum (y_i - \hat{y}_i)^2} \qquad R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}`]},
      {h: R`3 · Kümeleme metrikleri`, li: [
        R`**Küme içi mesafe:** aynı kümedeki noktalar birbirine ne kadar yakın? **Düşük** olması istenir.`,
        R`**Kümeler arası mesafe:** farklı kümeler birbirinden ne kadar uzak? **Yüksek** olması istenir.`,
        R`**Silhouette skoru:** bir noktanın kendi kümesine ne kadar benzediğini (kohezyon) ve diğer kümelerden ne kadar farklı olduğunu (ayrışma) ölçer. Aralık **−1 ile +1**; +1'e yakın iyi.`,
        R`**Davies-Bouldin endeksi (DBI):** sıfıra ne kadar yakınsa kümeleme o kadar iyidir. Slaytta "kümeler arası mesafenin küme içi mesafeye oranı" yazıyor; doğru tanım tersidir: **küme içi dağılımın kümeler arası mesafeye oranı** (bu yüzden küçük olması iyi).`]},
      {h: R`Sınıf dengesizliği yanılgısı: doğruluk paradoksu`, tbl: {h: ['', ''], r: [
        [R`**Veri**`, R`990 sağlıklı, 10 kanser`],
        [R`**Modelin kararı**`, R`Herkese "sağlıklı" (sıfır analiz)`],
        [R`**Kâğıt üzerinde başarı**`, R`%99 doğruluk (accuracy)`],
        [R`**Gerçek hayatta başarı**`, R`%0: 10 hastanın 10'u da gözden kaçtı`],
        [R`**Sonuç**`, R`Dengesiz veride accuracy yanıltıcıdır; önemli olan azınlık sınıfını yakalamaktır. "Harika istatistik! Ölümcül ve çöp bir model!"`]]},
        p2: [R`**Çözümler:** doğru metriği seçmek (recall, F1) · veri seviyesinde: yeniden örnekleme (**resampling**) · algoritma seviyesinde: sınıf ağırlıklandırma (**class weights**).`]},
      {h: R`Lab uygulaması 2: meme kanseri verisi`, ol: [R`Wisconsin meme kanseri verisinin yüklenmesi.`, R`Normal veri bölme (train/test).`, R`Decision tree ve random forest ile doğruluk, kesinlik, duyarlılık ve F1 hesabı.`, R`StratifiedKFold: sınıf oranları korunarak 5 parçaya bölme; her parça sırayla test, iki modelin ortalama (gerçek) genelleme başarısı.`]}
    ],
    ezber: [
      R`Train ~%70 (öğren), validation ~%15 (ayarla, ezberi yakala), test ~%15 (son, hiç görülmemiş).`,
      R`Overfitting: train çok iyi, test kötü (ezber; Tetris pause). Underfitting: ikisi de kötü (model çok basit).`,
      R`Underfitting çözümü: kapasite ↑, özellik ↑, düzenlileştirme ↓, epoch ↑.`,
      R`K-katlı CV: K parça, her biri sırayla test, ortalama al; ezberi tespit eder, bütün veriyi kullanır, güvenilir sonuç verir.`,
      R`TP doğru bilmek, FP yanlış alarm, FN tehlikeyi kaçırmak, TN olmayanı doğru bilmek.`,
      R`Precision = TP/(TP+FP), Recall = TP/(TP+FN), F1 harmonik ortalama.`,
      R`MAE aykırıya dirençli · MSE büyük hatayı cezalandırır (ilaç) · RMSE orijinal birim · $R^2$ yönetim için 0–1.`,
      R`Silhouette −1..+1 (büyük iyi); DBI 0'a yakın iyi.`,
      R`990/10 verisinde herkese sağlıklı → accuracy %99, recall %0. Çözüm: doğru metrik, resampling, class weights.`],
    formul: [[R`Doğruluk`, R`\frac{TP + TN}{TP + TN + FP + FN}`], [R`Kesinlik`, R`\frac{TP}{TP + FP}`], [R`Duyarlılık`, R`\frac{TP}{TP + FN}`], [R`F1`, R`2 \cdot \frac{P \cdot R}{P + R}`],
      [R`MAE`, R`\frac{1}{n} \sum |y_i - \hat{y}_i|`], [R`MSE`, R`\frac{1}{n} \sum (y_i - \hat{y}_i)^2`], [R`RMSE`, R`\sqrt{\text{MSE}}`], [R`$R^2$`, R`1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}`], [R`K-katlı CV`, R`\frac{1}{K} \sum_{i=1}^{K} \text{Perf}_i`]],
    qs: [
      {id: '8.1', q: R`Bir modelin hata matrisi: TP = 40, FP = 10, FN = 20, TN = 30. Doğruluk, kesinlik, duyarlılık ve F1'i hesaplayınız.`,
        st: [R`Toplam = 40 + 10 + 20 + 30 = 100.`, R`Accuracy = (40 + 30) / 100 = **0,70**.`, R`Precision = 40 / (40 + 10) = **0,80**.`, R`Recall = 40 / (40 + 20) = 0,667.`, R`F1 = 2 · 0,80 · 0,667 / (0,80 + 0,667) = 1,067 / 1,467 ≈ **0,727**.`],
        ans: R`Doğruluk 0,70 · kesinlik 0,80 · duyarlılık ≈ 0,67 · F1 ≈ 0,73.`},
      {id: '8.2', q: R`990 sağlıklı ve 10 kanser hastası olan veride model herkese "sağlıklı" diyor. Pozitif sınıf = kanser. TP, FP, FN, TN'yi yazıp doğruluk ve duyarlılığı hesaplayınız.`,
        st: [R`Model hiç "kanser" demiyor → TP = 0, FP = 0.`, R`10 hasta kaçtı → FN = 10. 990 sağlıklı doğru → TN = 990.`, R`Accuracy = (0 + 990) / 1000 = 0,99. Recall = 0 / (0 + 10) = 0.`],
        ans: R`Doğruluk **%99** ama duyarlılık **%0**. Dengesiz veride accuracy yanıltıcıdır (doğruluk paradoksu).`},
      {id: '8.3', q: R`Gerçek değerler $y = [3, 5, 7]$, tahminler $\hat{y} = [2, 5, 9]$. MAE, MSE, RMSE ve $R^2$'yi hesaplayınız.`,
        st: [R`Hatalar: 3 − 2 = 1, 5 − 5 = 0, 7 − 9 = −2.`, R`MAE = (1 + 0 + 2) / 3 = **1**.`, R`MSE = (1 + 0 + 4) / 3 = 5/3 ≈ **1,67**.`, R`RMSE = √1,67 ≈ **1,29**.`, R`$\bar{y} = 5$; $\sum (y_i - \bar{y})^2 = 4 + 0 + 4 = 8$; $R^2 = 1 - 5/8 = $ **0,375**.`],
        ans: R`MAE 1 · MSE ≈ 1,67 · RMSE ≈ 1,29 · $R^2$ = 0,375.`},
      {id: '8.4', q: R`Overfitting mi underfitting mi? a) Eğitim doğruluğu %99, test doğruluğu %60. b) Eğitim %55, doğrulama %53. c) Eğitim %92, test %90.`,
        ans: R`a) **Overfitting** (ezber; eğitimde çok iyi, yeni veride kötü). b) **Underfitting** (ikisi de kötü; model çok basit). c) **İyi genelleme** (ikisi de yüksek ve yakın).`},
      {id: '8.5', q: R`1000 örneklik veri, %80 eğitim / %20 test ayrılıyor; eğitim kısmında 5-katlı çapraz doğrulama yapılıyor. Her iterasyonda kaç örnek eğitimde, kaç örnek doğrulamada kullanılır? Test setinde kaç örnek var?`,
        st: [R`Test: 1000 · 0,20 = 200. Eğitim: 800.`, R`800 / 5 = 160 örneklik 5 parça.`, R`Her iterasyonda 4 parça (640) eğitim, 1 parça (160) doğrulama.`],
        ans: R`Her iterasyonda **640 eğitim + 160 doğrulama**; test seti **200** örnek ve en sonda bir kez kullanılır.`},
      {id: '8.6', q: R`Hangi regresyon metriği? a) İlaç dozu tahmininde büyük hata çok tehlikeli. b) Yönetime "model veriyi yüzde kaç açıklıyor" diye sunum. c) Veride çok aykırı değer var, genel sapma görülmek isteniyor. d) Sonucu TL cinsinden raporlamak istiyorsun ama büyük hatalar da önemli.`,
        ans: R`a) **MSE** b) **$R^2$** c) **MAE** d) **RMSE**.`},
      {id: '8.7', q: R`Precision ve recall'dan hangisi daha önemlidir? a) Spam filtresi b) Kanser taraması.`,
        ans: R`a) **Precision:** önemli bir maili spam'e atmak (FP) pahalı. b) **Recall:** hastayı kaçırmak (FN) ölümcül.`},
      {id: '8.8', q: R`Eğitim, doğrulama ve test setlerinin görevlerini sınav benzetmesiyle açıklayınız. Test seti neden en sona saklanır?`,
        ans: R`Train ders çalışma soruları (öğrenme), validation evde çözülen deneme (ayar ve ezberi yakalama), test gerçek sınav. Test seti model hiç görmediği için en sona saklanır; görülürse ölçüm şişer ve gerçek genelleme başarısı ölçülemez.`},
      {id: '8.9', q: R`Kümeleme metriklerinde silhouette skoru ve Davies-Bouldin endeksi nasıl yorumlanır?`,
        ans: R`Silhouette −1 ile +1 arasındadır; +1'e yakınsa nokta kendi kümesine çok benziyor ve diğerlerinden ayrışıyor (iyi), 0 civarı sınırda, negatif yanlış kümede demektir. DBI'nin 0'a yakın olması iyidir: kümeler kendi içinde sıkı ve birbirinden uzak.`}
    ]
  });

  // ---------------------------------------------------------------- 9
  P.push({
    no: 9, hafta: 'Hafta 7', grp: 'Makine öğrenmesi', title: 'Yapay sinir ağları: perceptron ve MLP',
    ozet: R`Biyolojik nörondan yapay nörona; tek katmanlı perceptron ve banka kredi örneği, doğrusal ayrılabilirlik (AND ve XOR), indirim kampanyası örneği, çok katmanlı algılayıcının XOR çözümü, aktivasyon fonksiyonları, epoch ve batch size.`,
    konu: [
      {h: R`Nörondan yapay sinir ağına`, tbl: {h: ['Biyolojik nöron', 'Yapay nöron'], r: [
        [R`**Dendrit:** komşu sinyalleri toplar`, R`**Girdiler ($x$):** sayısal öznitelik vektörü`],
        [R`**Sinaps:** bağlantı gücünü ayarlar`, R`**Ağırlıklar ($w$):** öğrenilebilir bağlantı katsayıları`],
        [R`**Soma:** hücre gövdesi sinyali işler`, R`**Toplama:** ağırlıklı çarpımların birleşimi ($z$)`],
        [R`**Akson:** elektriksel dürtüyü iletir`, R`**Aktivasyon:** doğrusal olmayan çıktı üretimi ($y$)`]]}},
      {h: R`Tek katmanlı perceptron (1957)`, li: [
        R`Girdileri **doğrusal bir kombinasyon** hâlinde birleştirir ve bir **eşik değerine göre ikili (0/1) çıktı** üretir.`,
        R`$x_0 = 1$ sabit girdi ve onun ağırlığı $w_0$ = **sapma (bias)**. Aktivasyon: **basamak (step) fonksiyonu**.`],
        f: [R`z = \sum_{i=0}^{m} w_i x_i = w_0 + w_1 x_1 + \dots + w_m x_m \qquad o = \begin{cases} 1, & z \ge 0 \\ 0, & \text{aksi hâlde} \end{cases}`]},
      {h: R`Örnek: banka kredi onayı`, li: [
        R`Banka 2 veriye bakıyor: **aylık gelir $x_1$** (bin TL) ve **kredi skoru $x_2$** (0–100). Kredi için (çıktı 1) hem gelirin hem skorun belirli bir eşiğin üzerinde olması gerekir; değilse ret (çıktı 0). Bu, **AND kapısı** mantığıdır.`,
        R`Geçmiş müşteriler: **A** (10, 20) → Red · **B** (15, 80) → Red · **C** (70, 15) → Red · **D** (85, 90) → Onay.`,
        R`**Öğrenme süreci:** I. ağ başta tamamen rastgele ağırlıklar atar (örn. $w_1 = 0{,}23$, $w_2 = -0{,}5$, $b = 0{,}1$). II. A, B, C, D için tahmin yapar. III. Tahminleri gerçek sonuçlarla (1/0) karşılaştırıp hatayı bulur (**loss function**). IV. Hatayı azaltmak için ağırlıkları ve sapmayı **geri yayılımla (backpropagation)** adım adım günceller.`,
        R`YSA'da öğrenme, **$w$ ve $b$'nin ideal değerlerini veriye bakarak kendi kendine bulma** sürecidir.`,
        R`Binlerce iterasyon (epoch) sonucu: **$w_1 = 1$, $w_2 = 1$, $b = -120$.**`],
        f: [R`z = (\text{Gelir} \times 1) + (\text{Skor} \times 1) - 120 \qquad z \ge 0 \Rightarrow \text{Kredi ver (1)}, \quad z < 0 \Rightarrow \text{Reddet (0)}`],
        p2: [R`Kontrol: A: 10 + 20 − 120 = −90 → 0 ✓ · B: −25 → 0 ✓ · C: −35 → 0 ✓ · D: 85 + 90 − 120 = 55 → 1 ✓.`]},
      {h: R`Yeni müşteriler ve neden tek katman yetti?`, li: [
        R`**E:** gelir 90, skor 20 → $z = 90 + 20 - 120 = -10$ → **Red (0)**.`,
        R`**F:** gelir 60, skor 80 → $z = 60 + 80 - 120 = 20$ → **Onay (1)**.`,
        R`Grafikte karar sınırı **Gelir + Skor = 120** doğrusudur; D ve F doğrunun üstünde (onay), A, B, C ve E altında (ret). Onaylanan ve reddedilenler **tek bir düz çizgiyle ayrılabildiği** için tek katmanlı perceptron yetti.`]},
      {h: R`Dikkat: öğrenilen kural tam "AND" değil`, ek: true, p: [R`Perceptron "ikisi de eşiğin üstünde" kuralını birebir öğrenmez; sadece 4 eğitim noktasını ayıran bir doğru bulur. Bu doğruya göre geliri 30, skoru 95 olan biri de onay alır ($30 + 95 - 120 = 5 \ge 0$). Az veriyle öğrenilen sınır, istenen kuraldan farklı olabilir.`]},
      {h: R`Doğrusal ayrılabilirlik: AND ve XOR`, tbl: {h: ['a', 'b', 'AND', 'XOR'], r: [['0', '0', '0', '0'], ['0', '1', '0', '1'], ['1', '0', '0', '1'], ['1', '1', '1', '0']]},
        p2: [R`**AND doğrusal ayrılabilir:** tek bir doğru (1,1)'i diğer üç noktadan ayırır. **XOR doğrusal ayrılamaz:** (0,1) ve (1,0) = 1; (0,0) ve (1,1) = 0. Bu noktaları ayıracak tek bir düz çizgi çizmek **matematiksel olarak imkânsızdır**; perceptron ağırlıkları ne kadar güncellerse güncellesin en az bir noktayı yanlış sınıflandırır.`]},
      {h: R`Örnek: indirim kampanyası (XOR)`, p: [
        R`Mağaza indirimi **yalnızca öğrenci** ya da **yalnızca emekli** olana veriyor; hem öğrenci hem emekli olana (ileri yaşta üniversite okuyan) ya da hiçbiri olmayana vermiyor.`,
        R`Müşteri 1: öğrenci değil (0), emekli değil (0) → **indirim yok (0)** · Müşteri 2: öğrenci (1), emekli değil (0) → **var (1)** · Müşteri 3: öğrenci değil (0), emekli (1) → **var (1)** · Müşteri 4: öğrenci (1), emekli (1) → **yok (0)**. Bu tam olarak **XOR** tablosudur, tek katmanlı perceptron çözemez.`]},
      {h: R`Çok katmanlı perceptron (MLP)`, li: [
        R`Perceptron'un doğrusal olarak ayrılamayan problemleri (XOR) çözemediği kanıtlanınca yapı genişletildi: **Çok Katmanlı Algılayıcı (Multilayer Perceptron, MLP)**. Slaytta yıl **1969**.`,
        R`Katmanlar: **giriş katmanı → gizli katmanlar → çıktı katmanı**.`,
        R`MLP'yi güçlü yapan üçlü: **gizli katman** · **geri yayılım (backpropagation)** · **doğrusal olmayan aktivasyon fonksiyonu**. Öğrenebilmesi için: **1. geri yayılım, 2. gradyan inişi (gradient descent)**.`]},
      {h: R`Tarih notu: 1969 ve 1986`, ek: true, p: [R`1969 yılı Minsky ve Papert'in "Perceptrons" kitabıyla tek katmanlı perceptronun XOR'u çözemediğinin gösterildiği yıldır. Çok katmanlı ağların geri yayılımla eğitilmesi 1986'da (Rumelhart, Hinton, Williams) yaygınlaştı. Sınavda slayttaki 1969'u bilmen yeterli.`]},
      {h: R`Aktivasyon fonksiyonları`, tbl: {h: ['Fonksiyon', 'Formül', 'Not'], r: [
        [R`**1. Sert adım** (step)`, R`$f(x) = 1$ ($x \ge 0$), $0$ ($x < 0$)`, R`Perceptron'un fonksiyonu; türevi yok, geri yayılıma uygun değil.`],
        [R`**2. Sigmoid**`, R`$f(x) = \dfrac{1}{1 + e^{-x}}$`, R`Çıktı 0–1 arası; $(0;\, 0{,}5)$ noktasından geçer.`],
        [R`**3. ReLU**`, R`$f(x) = \max(0, x)$`, R`Negatife 0, pozitifi olduğu gibi verir.`]]}},
      {h: R`MLP XOR'u nasıl çözer?`, p: [
        R`Girdiler $x_1$ (öğrenci), $x_2$ (emekli). Gizli katmanda iki ReLU düğümü, çıktıda bir ReLU düğümü:`],
        f: [R`h_1 = \text{ReLU}(x_1 + x_2) \quad (b_1 = 0) \qquad h_2 = \text{ReLU}(x_1 + x_2 - 1) \quad (b_2 = -1)`, R`y = \text{ReLU}(h_1 - 2h_2) \quad (b_{out} = 0)`],
        tbl: {h: ['Girdi', 'Durum', '$h_1$', '$h_2$', '$y$'], r: [
          ['(0, 0)', R`Öğrenci değil, emekli değil`, '0', '0', R`**0** (indirim yok)`],
          ['(1, 0)', R`Sadece öğrenci`, '1', '0', R`**1** (indirim var)`],
          ['(0, 1)', R`Sadece emekli`, '1', '0', R`**1** (indirim var)`],
          ['(1, 1)', R`Hem öğrenci hem emekli`, '2', '1', R`2 − 2 = **0** (indirim yok)`]]},
        p2: [R`Gizli katman uzayı büker; sonuçta karar sınırı düz bir çizgi değil **eğri** olur (slayt 14: "doğrusal olmayan karar sınırı").`]},
      {h: R`Epoch ve batch size`, li: [
        R`**Epoch (öğrenme döngüsü):** bütün eğitim veri setinin YSA'dan **tam olarak bir kez** geçmesi. Ağ veriyi tek seferde öğrenemeyeceği için aynı veri defalarca (50, 100, 1000 epoch) gösterilir; ağırlıklar ideal noktaya yavaş yavaş yaklaşır.`,
        R`**Batch size (grup/yığın boyutu):** ağ hata oranını hesaplayıp ağırlıkları güncellemeden önce ağa **aynı anda verilen örnek sayısı**. Her örneği tek tek görüp güncellemek çok yavaş, bütün veriyi birden görmek çok bellek harcar; bu yüzden veri gruplar hâlinde işlenir.`]},
      {h: R`Bir epoch'ta kaç güncelleme?`, ek: true, f: [R`\text{epoch başına güncelleme} = \frac{\text{örnek sayısı}}{\text{batch size}}`], p: [R`1000 örnek, batch 100 → bir epoch'ta 10 güncelleme (iterasyon); 50 epoch → 500 güncelleme.`]}
    ],
    ezber: [
      R`Dendrit ↔ girdi, sinaps ↔ ağırlık, soma ↔ toplama, akson ↔ aktivasyon/çıktı.`,
      R`Perceptron (1957): $z = \sum w_i x_i$, $x_0 = 1$ bias; step: $z \ge 0 \Rightarrow 1$.`,
      R`Kredi: $w_1 = w_2 = 1$, $b = -120$. E (90, 20) → −10 red; F (60, 80) → 20 onay.`,
      R`Öğrenme: rastgele w → tahmin → loss → backpropagation ile güncelle.`,
      R`AND doğrusal ayrılabilir; XOR ayrılamaz → tek katman yetmez.`,
      R`MLP (slaytta 1969): gizli katman + geri yayılım + doğrusal olmayan aktivasyon; öğrenme: backprop + gradient descent.`,
      R`Step, sigmoid $1/(1 + e^{-x})$ (0,5'ten geçer), ReLU $\max(0, x)$.`,
      R`XOR MLP: $h_1 = \text{ReLU}(x_1 + x_2)$, $h_2 = \text{ReLU}(x_1 + x_2 - 1)$, $y = \text{ReLU}(h_1 - 2h_2)$.`,
      R`Epoch = verinin tamamı bir kez; batch = güncelleme başına örnek sayısı.`],
    formul: [[R`Perceptron toplamı`, R`z = \sum_{i=0}^{m} w_i x_i`], [R`Basamak`, R`o = 1 \text{ eğer } z \ge 0, \text{ yoksa } 0`], [R`Kredi kararı`, R`z = \text{Gelir} + \text{Skor} - 120`], [R`Sigmoid`, R`\frac{1}{1 + e^{-x}}`], [R`ReLU`, R`\max(0, x)`],
      [R`XOR gizli katman`, R`h_1 = \text{ReLU}(x_1 + x_2),\ h_2 = \text{ReLU}(x_1 + x_2 - 1)`], [R`XOR çıktı`, R`y = \text{ReLU}(h_1 - 2h_2)`]],
    qs: [
      {id: '9.1', q: R`Kredi modeli $z = \text{Gelir} + \text{Skor} - 120$. Müşteri E (gelir 90, skor 20) ve F (gelir 60, skor 80) kabul mü, red mi?`,
        st: [R`E: $90 + 20 - 120 = -10 < 0$ → 0.`, R`F: $60 + 80 - 120 = 20 \ge 0$ → 1.`],
        ans: R`E **reddedilir**, F **onaylanır**.`},
      {id: '9.2', q: R`Ağ başta rastgele $w_1 = 0{,}23$, $w_2 = -0{,}5$, $b = 0{,}1$ ağırlıklarıyla başlıyor. Müşteri D (85, 90) için tahmin nedir? Doğru mu?`,
        st: [R`$z = 0{,}23 \cdot 85 + (-0{,}5) \cdot 90 + 0{,}1 = 19{,}55 - 45 + 0{,}1 = -25{,}35$.`, R`$z < 0$ → tahmin 0 (red). Gerçek cevap 1 (onay).`],
        ans: R`Tahmin **0**, gerçek **1** → hata var. Bu hata loss fonksiyonuyla ölçülür ve ağırlıklar geri yayılımla güncellenir.`},
      {id: '9.3', q: R`AND kapısını gerçekleştiren bir perceptron için ağırlık ve sapma bulunuz.`,
        tip: R`Sadece (1,1) için toplam 0'ın üstüne çıkmalı.`,
        st: [R`$w_1 = w_2 = 1$, $b = -1{,}5$ deneyelim.`, R`(0,0): −1,5 → 0 · (0,1): −0,5 → 0 · (1,0): −0,5 → 0 · (1,1): 0,5 → 1.`],
        ans: R`Örneğin **$w_1 = w_2 = 1$, $b = -1{,}5$** (1 < −b ≤ 2 olan her b işe yarar). Aynı ağırlıklarla $b = -0{,}5$ seçilirse OR kapısı elde edilir.`},
      {id: '9.4', q: R`XOR neden tek katmanlı perceptronla çözülemez?`,
        ans: R`Perceptron'un karar sınırı tek bir düz doğrudur. XOR'da (0,1) ve (1,0) = 1, (0,0) ve (1,1) = 0; bu noktalar çaprazdadır ve onları ayıracak tek bir doğru yoktur (doğrusal ayrılamaz). Ağırlıklar nasıl seçilirse seçilsin en az bir nokta yanlış sınıflanır. Çözüm gizli katmanlı MLP'dir.`},
      {id: '9.5', q: R`İndirim MLP'sinde ($h_1 = \text{ReLU}(x_1 + x_2)$, $h_2 = \text{ReLU}(x_1 + x_2 - 1)$, $y = \text{ReLU}(h_1 - 2h_2)$) (1,1) ve (0,1) girdileri için ileri besleme yapınız.`,
        st: [R`(1,1): $h_1 = \text{ReLU}(2) = 2$; $h_2 = \text{ReLU}(1) = 1$; $y = \text{ReLU}(2 - 2) = 0$.`, R`(0,1): $h_1 = 1$; $h_2 = \text{ReLU}(0) = 0$; $y = \text{ReLU}(1) = 1$.`],
        ans: R`(1,1) → **0** (indirim yok), (0,1) → **1** (indirim var).`},
      {id: '9.6', q: R`Aktivasyon değerlerini hesaplayınız: step(−0,1), step(0), sigmoid(0), ReLU(−3), ReLU(2,5).`,
        ans: R`step(−0,1) = **0**, step(0) = **1**, sigmoid(0) = $1/(1+1)$ = **0,5**, ReLU(−3) = **0**, ReLU(2,5) = **2,5**.`},
      {id: '9.7', q: R`2000 örneklik veri, batch size 50, 10 epoch. Bir epoch'ta kaç ağırlık güncellemesi olur? Toplam kaç?`,
        st: [R`2000 / 50 = 40 güncelleme / epoch.`, R`10 epoch · 40 = 400.`],
        ans: R`Epoch başına **40**, toplam **400** güncelleme.`},
      {id: '9.8', q: R`Biyolojik nöronun dört parçasını yapay nörondaki karşılıklarıyla eşleştiriniz.`,
        ans: R`Dendrit → girdiler $x$ · sinaps → ağırlıklar $w$ · soma → toplama $z = \sum w_i x_i$ · akson → aktivasyon ve çıktı $y$.`},
      {id: '9.9', q: R`MLP'nin öğrenebilmesi için gereken iki yöntemi ve doğrusal olmayan aktivasyonun neden şart olduğunu açıklayınız.`,
        ans: R`**Geri yayılım** hatanın her ağırlığa düşen payını çıktıdan girişe doğru hesaplar; **gradyan inişi** ağırlıkları bu payın tersi yönünde küçük adımlarla günceller. Aktivasyon doğrusal olsaydı üst üste katmanlar yine tek bir doğrusal fonksiyona indirgenirdi ve XOR gibi problemler çözülemezdi.`}
    ]
  });

  // ---------------------------------------------------------------- test
  Y.test = [
    {q: R`Hangisi kör (bilgisiz) arama algoritması **değildir**?`, o: ['BFS', 'DFS', 'UCS', 'A*'], a: 3, w: R`A* sezgisel tahmin $h(n)$ kullanır; bilgili aramadır.`, go: 3},
    {q: R`BFS hangi veri yapısını kullanır?`, o: ['LIFO yığın', 'FIFO kuyruk', 'Öncelikli kuyruk', 'Hash tablosu'], a: 1, w: R`BFS katman katman gider: ilk giren ilk çıkar (FIFO).`, go: 2},
    {q: R`DFS'nin seçim kuralı hangisidir?`, o: [R`$f(n) = d(n)$`, R`$f(n) = -d(n)$`, R`$f(n) = g(n)$`, R`$f(n) = h(n)$`], a: 1, w: R`En büyük derinlikteki düğüm seçilir; $-d(n)$ en küçük olan en derin olandır.`, go: 3},
    {q: R`Kenar maliyetleri farklıysa BFS hangi yolu bulur?`, o: ['En ucuz yolu', 'En az kenarlı (en sığ) yolu', 'Rastgele bir yolu', 'Hiç yol bulamaz'], a: 1, w: R`BFS her adımı 1 sayar; maliyetleri okumaz.`, go: 2},
    {q: R`UCS ile Dijkstra arasındaki tek fark nedir?`, o: ['UCS negatif kenar kabul eder', 'UCS hedefe ulaşınca durur', 'Dijkstra sezgisel kullanır', 'Dijkstra yığın kullanır'], a: 1, w: R`Dijkstra bütün düğümlere en kısa yolu bulana kadar çalışır; UCS hedefte durur.`, go: 2},
    {q: R`Greedy aramanın değerlendirme fonksiyonu hangisidir?`, o: [R`$g(n)$`, R`$h(n)$`, R`$g(n) + h(n)$`, R`$d(n)$`], a: 1, w: R`Greedy sadece hedefe kalan tahmine bakar.`, go: 3},
    {q: R`A*'ın ağaç aramasında optimal olması için sezgisel hangi şartı sağlamalıdır?`, o: ['Tutarsız olmalı', R`$h(n) \le h^*(n)$`, R`$h(n) \ge h^*(n)$`, R`$h(n) = 0$ olmalı`], a: 1, w: R`Kabul edilebilirlik: tahmin gerçeği asla abartmamalı.`, go: 3},
    {q: R`Tutarlılık şartı hangisidir?`, o: [R`$h(n) \le c(n, n') + h(n')$`, R`$h(n) \ge c(n, n') + h(n')$`, R`$g(n) \le h(n)$`, R`$h(n) = h(n')$`], a: 0, w: R`Üçgen eşitsizliği; f değerlerinin düşmemesini sağlar.`, go: 3},
    {q: R`Çapraz hareketin yasak olduğu kareli bir labirentte hangi sezgisel kullanılır?`, o: ['Öklid', 'Manhattan', 'Hamming', 'Kosinüs'], a: 1, w: R`Sadece yatay/dikey hareket varsa $|\Delta x| + |\Delta y|$.`, go: 3},
    {q: R`Problemin 5 bileşeninden hangisi PEAS'teki P (performans) ile doğrudan ilişkilidir?`, o: ['Başlangıç durumu', 'Eylemler', 'Geçiş modeli', 'Yol maliyeti'], a: 3, w: R`Yol maliyeti $g(n)$ performans ölçütüyle doğrudan ilişkilidir.`, go: 1},
    {q: R`Explored set tutulmayan aramanın adı nedir?`, o: ['Graf araması', 'Ağaç araması', 'Yerel arama', 'Tabu arama'], a: 1, w: R`Ziyaret edilenleri hatırlamaz; döngüye girebilir.`, go: 1},
    {q: R`Arama algoritmalarında zaman karmaşıklığı neyle ölçülür?`, o: ['Saniye', 'Üretilen düğüm sayısı', 'RAM miktarı', 'Kod satırı'], a: 1, w: R`$O(b^d)$ gibi; saniye makineye bağlıdır.`, go: 1},
    {q: R`10 şehirli gezgin satıcı probleminde (slayttaki hesapla) kaç rota vardır?`, o: ['100', '1024', '3.628.800', '362.880'], a: 2, w: R`$10! = 3.628.800$.`, go: 4},
    {q: R`Tepe tırmanmanın en büyük zayıflığı nedir?`, o: ['Çok bellek harcar', 'Yerel maksimumda kilitlenir', 'Parametre gerektirir', 'Çok yavaştır'], a: 1, w: R`Kötü hamleyi asla kabul etmez; ilk tepede ya da platoda kalır.`, go: 4},
    {q: R`Tavlama benzetiminde kötü bir hamlenin kabul olasılığı hangisidir?`, o: [R`$e^{-|\Delta E|/T}$`, R`$e^{|\Delta E| \cdot T}$`, R`$|\Delta E| / T$`, R`$1 - T$`], a: 0, w: R`Sıcaklık yüksekken olasılık büyük, soğudukça küçük.`, go: 4},
    {q: R`$\Delta E = -20$, $T = 40$ iken kötü hamlenin kabul olasılığı yaklaşık kaçtır?`, o: ['0,14', '0,37', '0,61', '0,95'], a: 2, w: R`$e^{-0{,}5} \approx 0{,}61$ (slaytta 0,60).`, go: 4},
    {q: R`Tabu aramada yasaklı bir hamlenin yine de yapılmasına izin veren kural hangisidir?`, o: ['Tabu süresi', 'Zorunlu hareket', 'Aspirasyon kriteri', 'Soğutma takvimi'], a: 2, w: R`Hamle şimdiye kadarki en iyi global çözümden ($x_{best}$) daha iyiye götürüyorsa yasak delinir.`, go: 4},
    {q: R`Mikroçipte milyonlarca transistörün yerleşimi gibi komşu sayısı devasa bir problemde hangisi uygundur?`, o: ['Tabu arama', 'Tavlama benzetimi', 'BFS', 'A*'], a: 1, w: R`Bütün komşulara bakmaz; rastgele tek komşu seçer.`, go: 4},
    {q: R`Genetik algoritmada mutasyonun amacı nedir?`, o: ['En iyi bireyi korumak', 'Çeşitliliği korumak, yerel maksimuma sıkışmamak', 'Popülasyonu küçültmek', 'Uygunluğu hesaplamak'], a: 1, w: R`Çok düşük olasılıkla rastgele küçük değişiklik.`, go: 5},
    {q: R`Hangisinde evrimsel eleme (ölüm) **yoktur**?`, o: ['Genetik algoritma', 'Parçacık sürü optimizasyonu', 'İkisinde de vardır', 'İkisinde de yoktur'], a: 1, w: R`PSO'da parçacıklar ölmez; $P_{best}$ ve $G_{best}$'e göre hız ve konum günceller.`, go: 5},
    {q: R`Karınca kolonisinde feromon buharlaşmasının görevi nedir?`, o: ['Kısa yolu işaretlemek', 'Kötü yolları unutmak, yerel tuzağı önlemek', 'Karıncaları hızlandırmak', 'Rotayı sabitlemek'], a: 1, w: R`İzler periyodik silinir; kötü yollar unutulur.`, go: 5},
    {q: R`NASA ST5 anteni hangi yöntemle tasarlandı?`, o: ['A*', 'Tabu arama', 'Evrimsel (genetik) algoritma', 'K-Means'], a: 2, w: R`2006, ilk evrimleşmiş uzay anteni.`, go: 5},
    {q: R`Makine öğrenmesinde girdi ve çıktı nedir?`, o: ['Veri + kural → cevap', 'Veri + cevap → kural', 'Kural → veri', 'Cevap → veri'], a: 1, w: R`Klasik programlama veri + kural → cevap; ML veri + cevap → kural.`, go: 6},
    {q: R`"Yarınki hava sıcaklığı" tahmini hangi problem tipidir?`, o: ['İkili sınıflandırma', 'Çok sınıflı sınıflandırma', 'Regresyon', 'Kümeleme'], a: 2, w: R`Çıktı sürekli sayısal bir değer.`, go: 6},
    {q: R`K-NN bir noktanın sınıfını nasıl belirler?`, o: ['Ağaçtaki sorularla', 'En yakın K komşunun çoğunluğuyla', 'Doğrunun eğimiyle', 'Küme merkezinin ortalamasıyla'], a: 1, w: R`Mesafe Öklid ya da Manhattan ile ölçülür.`, go: 6},
    {q: R`Doğrusal regresyon neyi minimize ederek öğrenir?`, o: ['MAE', 'MSE (hata kareleri ortalaması)', 'Doğruluk', 'Silhouette'], a: 1, w: R`Gerçek noktalarla doğru arasındaki uzaklık karelerinin ortalaması.`, go: 6},
    {q: R`Gözetimsiz öğrenmede model yeni bir kedi görseline ne der?`, o: [R`"Kedi"`, R`"Küme 1" (benzerler grubu)`, R`"Hata"`, R`Bir sayı (fiyat)`], a: 1, w: R`Etiket olmadığı için sadece hangi gruba benzediğini söyler.`, go: 7},
    {q: R`K-Means ne zaman durur?`, o: ['K iterasyon sonra', 'Merkezler sabitlenince', 'Bütün noktalar aynı kümeye girince', 'Hata sıfırlanınca'], a: 1, w: R`Atamalar ve merkezler değişmeyince.`, go: 7},
    {q: R`"Normal motor titreşimlerine karışmış olağandışı titreşimleri bulmak" hangisidir?`, o: ['Gözetimli – regresyon', 'Gözetimsiz – anomali tespiti', 'Gözetimli – ikili sınıflandırma', 'Pekiştirmeli öğrenme'], a: 1, w: R`Çoğunluktan aşırı sapan noktaları bulmak.`, go: 7},
    {q: R`Hiperparametreleri ayarlamak için kullanılan veri parçası hangisidir?`, o: ['Eğitim', 'Doğrulama (validation)', 'Test', 'Hiçbiri'], a: 1, w: R`Test seti en sona, hiç görülmemiş veri olarak saklanır.`, go: 8},
    {q: R`Eğitim doğruluğu %99, test doğruluğu %60 olan model için ne söylenir?`, o: ['Underfitting', 'Overfitting', 'İdeal model', 'Veri dengeli'], a: 1, w: R`Ezberlemiş, genelleme yapamıyor.`, go: 8},
    {q: R`Hangisi underfitting'in çözümlerinden **değildir**?`, o: ['Model kapasitesini artırmak', 'Daha fazla özellik eklemek', 'Düzenlileştirmeyi artırmak', 'Epoch sayısını artırmak'], a: 2, w: R`Underfitting'de düzenlileştirme (L1, L2) **azaltılır**.`, go: 8},
    {q: R`Kesinlik (precision) formülü hangisidir?`, o: [R`$TP/(TP+FN)$`, R`$TP/(TP+FP)$`, R`$(TP+TN)/\text{toplam}$`, R`$TN/(TN+FP)$`], a: 1, w: R`"Pozitif" dediklerinin ne kadarı gerçekten pozitif.`, go: 8},
    {q: R`Kanser taramasında hastayı kaçırmamak için hangi metrik en önemlidir?`, o: ['Precision', 'Recall', 'Accuracy', 'R-kare'], a: 1, w: R`FN'yi azaltmak = recall'u yükseltmek.`, go: 8},
    {q: R`Büyük hataları en şiddetli cezalandıran regresyon metriği hangisidir?`, o: ['MAE', 'MSE', 'R-kare', 'Silhouette'], a: 1, w: R`Hatanın karesi alındığı için büyük hatalar çok büyür (ilaç dozu örneği).`, go: 8},
    {q: R`990 sağlıklı / 10 hasta verisinde herkese "sağlıklı" diyen modelin doğruluğu ve duyarlılığı nedir?`, o: ['%99 ve %99', '%99 ve %0', '%1 ve %100', '%50 ve %50'], a: 1, w: R`Doğruluk paradoksu.`, go: 8},
    {q: R`Silhouette skorunun aralığı nedir?`, o: ['0 ile 1', '−1 ile +1', '0 ile ∞', '−∞ ile +∞'], a: 1, w: R`+1'e yakın iyi kümeleme.`, go: 8},
    {q: R`Perceptron hangi aktivasyon fonksiyonunu kullanır?`, o: ['Sigmoid', 'ReLU', 'Basamak (step)', 'Tanh'], a: 2, w: R`$z \ge 0$ ise 1, değilse 0.`, go: 9},
    {q: R`Hangi mantık kapısı tek katmanlı perceptronla çözülemez?`, o: ['AND', 'OR', 'XOR', 'NOT'], a: 2, w: R`XOR doğrusal ayrılamaz.`, go: 9},
    {q: R`ReLU(−4) kaçtır?`, o: ['−4', '0', '4', '0,5'], a: 1, w: R`$\max(0, x)$.`, go: 9},
    {q: R`Bütün eğitim verisinin ağdan bir kez geçmesine ne denir?`, o: ['Batch', 'Epoch', 'Iteration', 'Fold'], a: 1, w: R`Batch size ise güncelleme başına verilen örnek sayısıdır.`, go: 9}
  ];

  // ---------------------------------------------------------------- hangisi?
  Y.hangi = {
    sets: {
      alg: {h: 'Hangi algoritma?', o: [['bfs', 'BFS'], ['dfs', 'DFS'], ['ucs', 'UCS'], ['greedy', 'Greedy'], ['astar', 'A*'], ['hc', 'Tepe tırmanma'], ['sa', 'Tavlama'], ['tabu', 'Tabu'], ['ga', 'Genetik alg.'], ['pso', 'PSO'], ['aco', 'Karınca']]},
      ml: {h: 'Hangi öğrenme türü?', o: [['sinif2', 'Gözetimli · ikili sınıflandırma'], ['sinifn', 'Gözetimli · çok sınıflı'], ['reg', 'Gözetimli · regresyon'], ['kume', 'Gözetimsiz · kümeleme'], ['anom', 'Gözetimsiz · anomali'], ['pek', 'Pekiştirmeli']]}
    },
    items: [
      {t: 'alg', s: R`Sosyal ağda bir kişinin 2. derece bağlantılarını (arkadaşının arkadaşları) bulmak.`, a: ['bfs'], w: R`Yakın katmanlar önce: BFS katman katman tarar.`, go: 2},
      {t: 'alg', s: R`{{pip install}} bir paketin bağımlılıklarının bağımlılıklarına sonuna kadar inmek.`, a: ['dfs'], w: R`Bir dala sonuna kadar dalmak: DFS.`, go: 2},
      {t: 'alg', s: R`İşletim sisteminde kaynak tahsis grafında döngü (deadlock) tespiti.`, a: ['dfs'], w: R`Slayt: deadlock kontrolü için RAG'da cycle tespiti DFS ile.`, go: 2},
      {t: 'alg', s: R`İnternet yönlendirici paketin gideceği en düşük maliyetli yolu buluyor; tahmin bilgisi yok.`, a: ['ucs'], w: R`Routing = Dijkstra = UCS.`, go: 2},
      {t: 'alg', s: R`StarCraft'ta bir birim, hedefe kuş uçuşu en yakın görünen kareye doğru hızla ilerliyor.`, a: ['greedy'], w: R`Sadece $h(n)$'e bakan hızlı arama: Greedy.`, go: 3},
      {t: 'alg', s: R`Navigasyon cihazı hem gidilen km'yi hem hedefe kuş uçuşu mesafeyi kullanarak en kısa yolu buluyor.`, a: ['astar'], w: R`$f = g + h$: A*.`, go: 3},
      {t: 'alg', s: R`Oyun motorunda NavMesh üzerinde karakterin yol bulması.`, a: ['astar'], w: R`Slayt: oyun motorları, NavMesh → A*.`, go: 3},
      {t: 'alg', s: R`Robotun 5 milisaniyede karar vermesi gerekiyor; en yakın iyi hamle yeterli.`, a: ['hc'], w: R`Gerçek zamanlı sistemler: tepe tırmanma.`, go: 4},
      {t: 'alg', s: R`Arazinin tek tepeli (konveks) olduğu biliniyor; en hızlı ve parametresiz yöntem isteniyor.`, a: ['hc'], w: R`Tek tepede tavlama/tabu ile vakit kaybetmek anlamsız.`, go: 4},
      {t: 'alg', s: R`Mikroçipte milyonlarca transistörün yerleşimi; bütün komşulara bakmak imkânsız.`, a: ['sa'], w: R`Rastgele tek komşu: tavlama benzetimi.`, go: 4},
      {t: 'alg', s: R`Üniversitenin ders programı; çakışan atamalar tekrar denenmesin.`, a: ['tabu'], w: R`Kurallı çizelgeleme ve hafıza: tabu arama.`, go: 4},
      {t: 'alg', s: R`Hastane nöbet çizelgesi hazırlanıyor.`, a: ['tabu'], w: R`Çizelgeleme: tabu arama.`, go: 4},
      {t: 'alg', s: R`Uydu anteninin fiziksel şekli rastgele tasarımlardan nesiller boyu evrimleştirilerek bulunuyor.`, a: ['ga'], w: R`NASA ST5: genetik algoritma.`, go: 5},
      {t: 'alg', s: R`50 eşyalı sırt çantası problemine kısa sürede iyi bir çözüm bulmak.`, a: ['ga', 'sa'], w: R`Slayttaki örnek genetik algoritma; kombinasyon problemi olduğu için tavlama da kullanılabilir.`, go: 5},
      {t: 'alg', s: R`Kurtarma ekibi, herkesin ölçtüğü en iyi sinyali ve ekibin ortak en iyi noktasını harmanlayarak kara kutuyu arıyor.`, a: ['pso'], w: R`$P_{best}$ + $G_{best}$: PSO.`, go: 5},
      {t: 'alg', s: R`Kargo şirketinin onlarca durağı en kısa turla dolaşması (gezgin satıcı).`, a: ['aco', 'ga', 'sa'], w: R`Senaryoda TSP karınca kolonisine eşlendi; GA ve tavlama da TSP için kullanılır.`, go: 5},
      {t: 'alg', s: R`Derin öğrenme modelinin öğrenme oranı ve katman sayısı ayarlanıyor.`, a: ['pso', 'sa'], w: R`Slaytlarda hem PSO hem tavlama hiperparametre optimizasyonu için geçiyor.`, go: 5},
      {t: 'ml', s: R`E-postanın spam olup olmadığına karar vermek.`, a: ['sinif2'], w: R`İki ayrık sınıf, etiketli veri.`, go: 6},
      {t: 'ml', s: R`Fotoğraftaki hayvanın köpek, kedi, at, balık ya da kuş olduğunu bulmak.`, a: ['sinifn'], w: R`İkiden fazla kategori.`, go: 6},
      {t: 'ml', s: R`Metrekare, oda sayısı ve bina yaşından evin fiyatını tahmin etmek.`, a: ['reg'], w: R`Sayısal çıktı.`, go: 6},
      {t: 'ml', s: R`3D baskının kaç gram filament harcayacağını ve kaç saat süreceğini hesaplamak.`, a: ['reg'], w: R`Slayt senaryosu 1: sürekli sayısal değer.`, go: 7},
      {t: 'ml', s: R`Kameradan alınan el iskelet verisinin hangi harfe denk geldiğini bulmak.`, a: ['sinifn'], w: R`Slayt senaryosu 2: belirli ve ayrık bir liste.`, go: 7},
      {t: 'ml', s: R`Motor titreşim verisindeki olağandışı titreşimleri anında yakalamak.`, a: ['anom'], w: R`Slayt senaryosu 3.`, go: 7},
      {t: 'ml', s: R`"Çalıntı" ve "normal" etiketli geçmiş işlemlere bakıp yeni işlemin dolandırıcılık olup olmadığına karar vermek.`, a: ['sinif2'], w: R`Slayt senaryosu 4: etiketli ve iki sınıf. (Etiket olmasaydı anomali tespiti olurdu.)`, go: 7},
      {t: 'ml', s: R`Teşhisi olmayan binlerce röntgeni benzerliklerine göre 4 gruba ayırmak.`, a: ['kume'], w: R`Slayt senaryosu 5: cevap anahtarı yok.`, go: 7},
      {t: 'ml', s: R`Mağazanın müşterilerini gelir ve harcamaya göre 3 profile ayırmak; etiket yok.`, a: ['kume'], w: R`Lab 1: K-Means ile müşteri segmentasyonu.`, go: 7},
      {t: 'ml', s: R`Etiketsiz kart işlemlerinde çoğunluğa hiç benzemeyen şüpheli işlemleri bulmak.`, a: ['anom'], w: R`Etiket yok, aykırı nokta arıyoruz.`, go: 7},
      {t: 'ml', s: R`Tetris oynayan bir ajan kaybedince ceza, ilerleyince ödül alarak öğreniyor.`, a: ['pek'], w: R`Ödül/ceza ile öğrenme: pekiştirmeli.`, go: 6}
    ]
  };

  // ---------------------------------------------------------------- dikkat
  Y.dikkat = [
    {w: R`Sırt çantası: en iyi çözüm 230 TL`, t: R`Slayt 52, B bireyinin (kutu + kılıç + saat, 12 kg, 200 TL) "en optimum çözümlerden biri" olduğunu söylüyor. Bütün 16 kombinasyonu denedim: **[1,1,0,1] = heykel + kutu + saat = 15 kg, 230 TL** sınırı aşmıyor ve daha değerli. Üstelik slayt 51 bu kombinasyonu mutasyonla türetiyor. Gerçek optimum 230 TL.`, go: '5/5.2'},
    {w: R`Çanakkale–İzmir: A* en kısa yolu bulmuyor`, t: R`Verilen sayılarla A* sahil yolunu (300 km) döndürür; gerçek en kısa yol Çan–Balıkesir (285 km). Sebep h(Balıkesir) = 150'nin, Balıkesir–İzmir gerçek yolundan (130) büyük olması: tahmin gerçeği abartıyor, sezgisel **kabul edilebilir değil**. (Kuş uçuşu mesafe yol mesafesinden büyük olamayacağı için verilerin kendisi de çelişkili.) Sınavda bu soru gelirse A*'ın sonucunu yaz ve kabul edilebilirlik ihlalini açıkla.`, go: '3/3.4'},
    {w: R`Çanakkale–Çan mesafesi: 63 mü 65 mi?`, t: R`Grafik slaytında sayı 63 gibi okunuyor; soru slaytındaki tabloda açıkça **65 km**. Çözümlerde 65 kullandım. Sonuç değişmez.`, go: '3/3.4'},
    {w: R`Davies-Bouldin tanımı ters yazılmış`, t: R`Slayt: "kümeler arası mesafenin küme içi mesafeye oranı; sıfıra yakın iyi". Bu tanımla küçük değer kötü olurdu. Doğrusu **küme içi dağılımın kümeler arası mesafeye oranı**; bu yüzden 0'a yakın olması iyidir.`, go: '8'},
    {w: R`DFS örneğinde iki farklı sıra`, t: R`Hafta 3 DFS slaytında hem "A D F C E B" hem "Preorder A → B → C → E → D → F" yazıyor. İkisi de DFS: ilki yığına çocukları B, C, D sırasıyla koyup en üsttekini (D) önce çıkaran sürüm, ikincisi soldan başlayan özyinelemeli sürüm. Sınavda hangi kuralı kullandığını belirt.`, go: '2'},
    {w: R`MLP yılı: 1969`, t: R`Slaytta "Çok Katmanlı Perceptron (1969)" yazıyor. 1969, Minsky ve Papert'in tek katmanlı perceptronun XOR'u çözemediğini gösterdiği yıldır; MLP'nin geri yayılımla eğitimi 1986'da yaygınlaştı. Sınavda slayttaki 1969'u yazman yeterli.`, go: '9'},
    {w: R`Gezgin satıcı: n! bir üst sınır`, t: R`Slayt rota sayısını n! veriyor (5 şehir = 120). Tur bir döngü olduğu için başlangıç şehri ve yön fark etmez; birbirinden farklı tur sayısı $(n-1)!/2$'dir (5 şehir için 12). Hocanın hesabıyla cevap ver.`, go: '4'},
    {w: R`Kredi perceptronu tam "AND" öğrenmiyor`, t: R`Problem "hem gelir hem skor eşiğin üstünde olmalı" diyor; öğrenilen kural ise Gelir + Skor ≥ 120. Bu kurala göre geliri 30, skoru 95 olan biri de onay alır. Perceptron sadece 4 eğitim noktasını ayıran bir doğru bulur.`, go: '9'},
    {w: R`Hata matrisinde satır/sütun düzeni`, t: R`Hocanın slaytında **sütunlar gerçek değer, satırlar tahmin**. Bazı kaynaklarda tam tersidir. Sınavda tablo verilirse önce başlıklara bak; TP, FP, FN, TN'nin yeri buna göre değişir.`, go: '8'},
    {w: R`Precision için iki isim`, t: R`Metrik haritasında "Kesinlik", formül slaytında "Keskinlik (Precision)" yazıyor. İkisi aynı metrik.`, go: '8'}
  ];

  // ---------------------------------------------------------------- son 10 dakika
  Y.son = [
    R`**5 bileşen:** başlangıç durumu, eylemler, geçiş modeli, hedef testi, yol maliyeti $g(n)$. **4 kriter:** tamlık, optimallik, bellek, zaman $O(b^d)$.`,
    R`**BFS** FIFO, $d(n)$, tam, eşit maliyette optimal, bellek çok kötü · **DFS** LIFO, $-d(n)$, tam değil, optimal değil, bellek çok iyi · **UCS** $g(n)$, her zaman optimal.`,
    R`**Greedy** $f = h$, hızlı, optimal değil · **A*** $f = g + h$; kabul edilebilir ($h \le h^*$) ve tutarlı ($h(n) \le c + h(n')$) ise optimal.`,
    R`Öklid = kuş uçuşu (çapraz serbest), Manhattan = $|\Delta x| + |\Delta y|$ (ızgara).`,
    R`TSP: **n!** rota. Klasik arama yolu, yerel arama nihai durumun kalitesini önemser.`,
    R`**Tepe tırmanma** yerel max/platoda kalır · **Tavlama** $P = e^{-|\Delta E|/T}$, $T \leftarrow \alpha T$ · **Tabu** son k hamle yasak, aspirasyon kriteri.`,
    R`**GA:** test → seçilim → çaprazlama → mutasyon. **PSO:** $P_{best}$ + $G_{best}$, eleme yok. **ACO:** feromon $\tau$, $\eta$, buharlaşma.`,
    R`**ML:** veri + cevap → kural. Gözetimli (sınıflandırma, regresyon), gözetimsiz (kümeleme, anomali), yarı gözetimli, pekiştirmeli.`,
    R`**K-NN** K komşunun çoğunluğu · **Doğrusal regresyon** $Y = WX + b$, MSE'yi küçült · **K-Means** merkez → ata → güncelle → tekrar.`,
    R`Train/validation/test ≈ 70/15/15. **Overfitting** train iyi test kötü; **underfitting** ikisi de kötü. K-katlı CV = K sonucun ortalaması.`,
    R`Precision $TP/(TP+FP)$, recall $TP/(TP+FN)$, F1 harmonik ortalama; dengesiz veride accuracy yanıltır.`,
    R`MAE aykırıya dirençli, MSE büyük hatayı cezalandırır, RMSE orijinal birim, $R^2$ 0–1. Silhouette −1..+1, DBI 0'a yakın iyi.`,
    R`Perceptron $z = \sum w_i x_i$, step. AND ayrılabilir, **XOR ayrılamaz** → MLP (gizli katman + backprop + doğrusal olmayan aktivasyon). Sigmoid $1/(1+e^{-x})$, ReLU $\max(0,x)$.`,
    R`**Epoch** = verinin tamamı bir kez; **batch size** = güncelleme başına örnek sayısı.`
  ];
})();
