// Hafta 5–7 slaytları için hoca ağzından anlatım (benim yazdığım; hocanın kendi sözleri değil)
(function(){ var R = String.raw, H = window.YZS.hoca;
// ---------- Hafta 5
H['5.1'] = R`Makine öğrenmesinin tanımı: kuralı biz yazmıyoruz, makine veriye bakarak kuralı kendisi çıkarıyor.

İç içe halkalara bakın: yapay zekanın içinde makine öğrenmesi, onun içinde YSA, onun içinde derin öğrenme, en içte üretken yapay zeka. Big data ve NLP bu halkaları kesen ayrı alanlar. K-NN, karar ağacı, SVM klasik makine öğrenmesi örnekleri.
→ b6`;
H['5.2'] = R`Farkı tek tabloda görün. Klasik programlamada **veri + kural** verirsiniz, **cevap** alırsınız. Makine öğrenmesinde **veri + cevap** verirsiniz, **kuralı** alırsınız. Yani girdi ile çıktının yeri değişiyor. Sınavda bu ters çevrilmeyi yazın.
→ b6`;
H['5.3'] = R`Dört öğrenme türü var. **Gözetimli**: etiketli veri, model hatasından öğrenir; sınıflandırma ve regresyon. **Gözetimsiz**: etiket yok, model kendi grupları bulur; kümeleme ve boyut indirgeme. **Yarı gözetimli**: azı etiketli, çoğu etiketsiz veri. **Pekiştirmeli**: ajan bir durumda eylem yapar, ödül ya da ceza alır; oyun oynayan YZ böyle öğrenir.
→ b6`;
H['5.4'] = R`"Hangi yöntem en iyi?" sorusunun tek bir cevabı yok; deneme-yanılma esastır. Seçimi daraltmak için dört soru sorun: veri ne kadar büyük, veri türü ne, nasıl bir çıktı isteniyor, hız ve açıklanabilirlik ne kadar önemli. Örneğin bankacılıkta neden red verildiğini açıklayabilmek gerekir; karar ağacı bu yüzden sevilir.`;
H['5.5'] = R`Gözetimli öğrenmenin resmi: modele "bunlar elma" diye etiketli örnekler gösteriyoruz, model işleyip öğreniyor. Sonra hiç görmediği bir elma veriyoruz, model "bu bir elma" diyor. Öğretmenin cevap anahtarıyla çalıştığı bir sınıf gibi düşünün.
→ b6`;
H['5.6'] = R`Üç terimi oturtun. **X özellik (feature)**: girdi, ölçülebilir nitelikler; metrekare, oda sayısı, bina yaşı. **f(x) model**: girdiyi çıktıya çeviren fonksiyon; K-NN, karar ağacı. **Y etiket (label)**: tahmin edilen hedef; evin fiyatı. Bir soruda bunları ayırabilmeniz lazım.
→ b6`;
H['5.7'] = R`Gözetimli öğrenmenin iki aşaması var. **Eğitimde** X'ler ve Y'ler birlikte verilir; model tahmin yapar, hatasını hesaplar, kendini düzeltir. **Tahminde** daha önce görülmemiş bir X gelir, eğitilmiş model Y'yi tahmin eder.

Amaç tek cümle: X'i Y'ye dönüştüren en iyi $f(x) = y$ fonksiyonunu bulmak.
→ b6`;
H['5.8'] = R`Bu iki fotoğraf meşhur bir örnek: husky ile kurdu ayıran model çok başarılı görünüyordu. Sonra anlaşıldı ki hayvana değil, arka plandaki kara bakıyormuş. Kurt fotoğraflarının çoğu karda çekilmişti.

Ders şu: etiketli veri olsa bile model yanlış özelliği öğrenebilir. Verinin dengeli ve çeşitli olması bu yüzden önemli.
→ b6`;
H['5.9'] = R`Gözetimli öğrenme çıktının türüne göre ikiye ayrılır. Çıktı **ayrık bir sınıfsa** (geçti/kaldı, kedi/köpek) **sınıflandırma**. Çıktı **sayısal bir değerse** (fiyat, sıcaklık) **regresyon**. Soru gelince ilk bakacağınız şey: tahmin edilen şey bir etiket mi, bir sayı mı?
→ b6`;
H['5.10'] = R`Sınıflandırmanın iki türü: **ikili** (sadece iki sınıf, spam/spam değil) ve **çok sınıflı** (köpek, kedi, at, balık, kuş). Sayıya dikkat: iki sınıf varsa ikili, ikiden fazlaysa çok sınıflı.
→ b6`;
H['5.11'] = R`Örnek veri: derse katılım ve lab notu ile geçti/kaldı. Son satırda katılım %85, lab 80, sonuç soru işareti. Tabloya bakınca 80/85 ve 90/95 geçmiş; yeni öğrenci onlara çok yakın, büyük ihtimalle **geçti**. Az önce kafanızda yaptığınız şey K-NN'in kendisi; bir sonraki slayt.
→ b6`;
H['5.12'] = R`K-NN: yeni noktanın sınıfına, ona **en yakın K komşunun çoğunluğu** karar verir. Makine öğrenmesindeki en sezgisel yöntem.

Yakınlığı Öklid ya da Manhattan mesafesiyle ölçeriz. Önceki örnekte (85, 80) noktasına en yakın 3 komşu (80, 85), (90, 95), (75, 70); üçü de "geçti", sonuç geçti. K'yı genelde tek seçeriz ki oylama berabere kalmasın.
→ b6`;
H['5.13'] = R`Karar ağacı veriye sırayla sorular sorar: kaç bacağı var? 0 ise yılan. 2 ise konuşabiliyor mu? Konuşamıyorsa kanguru; konuşuyorsa söylediğini anlıyor mu, evetse insan, hayırsa papağan. 4 ise mırlıyor mu, evetse kedi, hayırsa köpek.

Her soru veriyi daha saf gruplara böler. Artısı açıklanabilir olması: kararın gerekçesini yol olarak okuyabilirsiniz.
→ b6`;
H['5.14'] = R`Regresyonda tahmin edilen etiket sürekli, sayısal; sonsuz sayıda olası çıktı var. Geleceği tahmin etmek ve değişkenler arası ilişkiyi anlamak için kullanılır. Popüler algoritmalar: doğrusal regresyon, destek vektör regresyonu (SVR), karar ağacı regresyonu.
→ b6`;
H['5.15'] = R`Doğrusal regresyon noktaların arasından geçen **en iyi doğruyu** bulur: $Y = W X + b$. $W$ eğim (ağırlık), $b$ y-kesişimi (sapma).

"En iyi" ne demek? Her noktanın doğruya dikey uzaklığının karesini alıp ortalıyoruz (MSE) ve bunu en küçük yapan $W$ ve $b$'yi seçiyoruz. Bu kayıp fonksiyonu fikri YSA'da da karşımıza çıkacak.
→ b6`;
H['5.16'] = R`Gerçekte evin fiyatı tek özelliğe bağlı değil: metrekare, oda sayısı ve diğerleri. Bunları bir formülle tek bir "ev değer skoru"na çevirip yine tek girdili regresyon yapabiliriz. Buna **özellik mühendisliği** diyoruz: ham veriyi modelin daha iyi kullanacağı bir özelliğe dönüştürmek.
→ b6`;
H['5.17'] = R`Labda yapacaklarımız: sınıflandırmada K-NN ve karar ağacı, regresyonda doğrusal regresyon. Adımlar her projede aynı: veriyi yükle, eğitim ve test diye böl, modeli eğitim verisiyle eğit, test verisiyle dene, sonuçları görselleştir. Veri bölmeyi 6. haftada ayrıntılı göreceğiz.`;
// ---------- Hafta 6
H['6.1'] = R`Gözetimsiz öğrenmede elimizde etiket yok: elmalar ve armutlar karışık. Model kimseden cevap almadan "bir örüntü görüyorum" diyor ve benzerleri gruplara ayırıyor. Bu gruplara ad vermiyor, sadece "bunlar birbirine benziyor" diyor.
→ b7`;
H['6.2'] = R`Eğitim aşamasında etiketsiz X'ler veriliyor; model benzerlik ve örüntü keşfediyor. Tahmin aşamasında yeni bir kedi görseli geldiğinde model "kedi" demiyor, "**Küme 1**" diyor.

Gözetimliden farkı: amaç X'i bir Y'ye eşlemek değil, verinin kendi içindeki gizli yapıyı ortaya çıkarmak.
→ b7`;
H['6.3'] = R`Gözetimsiz öğrenmenin ana işi kümeleme: etiketsiz verileri benzerliklerine göre gruplara ayırmak. Kullanım alanları müşteri segmentasyonu, anomali tespiti, görüntü işleme. Algoritmalar K-means, mean shift, Gaussian mixture. Biz K-means'i göreceğiz.
→ b7`;
H['6.4'] = R`K-means dört adım:

- K tane merkezi rastgele seç.
- Her noktayı en yakın merkeze ata.
- Her merkezi, kendi kümesindeki noktaların ortalamasına taşı.
- Merkezler artık yer değiştirmeyene kadar 2. ve 3. adımı tekrarla.

Fotoğraflarda iterasyon 0'da noktalar renksiz, 1'de kabaca boyanıyor, 4'te kümeler oturuyor. K'yı siz seçersiniz; algoritma kendisi bulmaz.
→ b7`;
H['6.5'] = R`Kümelemenin önemli bir kullanımı anomali tespiti. Kümeler oluştuktan sonra hiçbir merkeze yakın olmayan noktalar "aykırı" sayılır. Kredi kartı dolandırıcılığı, ağ saldırıları, makinelerde arıza öncesi tuhaf titreşimler bu şekilde yakalanır. Grafikte kırmızı noktalar kalabalıktan uzak kalan müşteriler.
→ b7`;
H['6.6'] = R`Tarihten güzel bir örnek: 1854 Londra kolera salgını. John Snow ölümleri haritaya işaretledi ve ölümlerin bir su pompasının çevresinde **kümelendiğini** gördü. Pompa kapatıldı, salgın yavaşladı. Etiket yok, sadece konumlar var; bu bir kümeleme fikri.`;
H['6.7'] = R`Beş senaryo; her biri için önce kendinize iki soru sorun. Etiket var mı? Varsa gözetimli, yoksa gözetimsiz. Gözetimliyse çıktı sayı mı, sınıf mı? Gözetimsizse grup mu arıyoruz, aykırı mı?

Cevaplara bakmadan beşini de bu iki soruyla çözmeyi deneyin.
→ b7`;
H['6.8'] = R`Cevaplar ve gerekçeleri. Filament gramı ve süre sayısal, **regresyon**. Hangi harf: belli bir listeden seçim, **çok sınıflı sınıflandırma**. Marjinal titreşimler: çoğunluktan sapan noktalar, **anomali tespiti**. Dolandırıcılık mı değil mi: iki sınıf ve etiketli veri, **ikili sınıflandırma**. Teşhissiz röntgenleri 4 gruba ayırmak: etiket yok, **kümeleme**.
→ b7`;
H['6.9'] = R`Lab senaryosu: pazarlama müşterileri gruplamamızı istiyor ama kim zengin, kim cimri bilgisi yok. K-means'e sadece gelir ve harcama sütunlarını veriyoruz. Algoritma mesafelere bakıp benzer alışkanlıktakileri aynı renge boyuyor; ortaya 3 müşteri profili çıkıyor. Profillere "zengin ama az harcayan" gibi adları sonra biz veriyoruz.
→ b7`;
H['6.10'] = R`Veriyi üçe bölüyoruz. **Eğitim** (~%70): model kuralları burada öğrenir. **Doğrulama** (~%15): hiperparametreleri ayarlamak ve ezberi erken yakalamak için. **Test** (~%15): modelin hiç görmediği, en sonda bir kez kullanılan veri.

Test verisine eğitimde hiç dokunulmaz; dokunursanız sonuç sizi kandırır.
→ b8`;
H['6.11'] = R`En iyi benzetme sizin hayatınız: eğitim ders çalışma soruları, doğrulama evde çözdüğünüz deneme, test gerçek vize.

**Overfitting** şu: son 5 yılın çıkmışlarını şık sırasına kadar ezberleyen öğrenci evde %100 yapar, hoca sayıları değiştirince %20 alır. Model eğitim verisini ezberler, yeni veride genelleyemez. Belirtisi: eğitim başarısı çok yüksek, doğrulama başarısı düşük.
→ b8`;
H['6.12'] = R`Gerçek bir vaka: Tetris oynayan bir YZ'ye kaybedince ceza vereceğiz dendi. Model kötü oynadı, bloklar tepeye geldi ve tam kaybetmeden önce oyunu **duraklattı**. Sonsuza kadar pause ekranında bekledi; hiç kaybetmedi.

Model oyunu öğrenmedi, ceza kuralını kelimesi kelimesine ezberleyip açığını buldu. Ceza fonksiyonunu tasarlarken bu yüzden dikkatli olmak gerekir.
→ b8`;
H['6.13'] = R`Underfitting overfitting'in tersi: model çok basit, verideki örüntüyü yakalayamıyor. Belirtisi hem eğitimde hem doğrulamada başarısız olması.

Çözümler: modeli karmaşıklaştırmak, daha fazla özellik eklemek, düzenlileştirmeyi (L1, L2) azaltmak, daha uzun eğitmek. Overfitting'de bunların tam tersini yaparsınız.
→ b8`;
H['6.14'] = R`Tek bir rastgele bölme şanslı ya da şanssız çıkabilir. K-katlı çapraz doğrulama bunu önler. Önce %20 testi ayırın. Kalan %80'i 5 eşit parçaya bölün. Her turda 4 parça eğitim, 1 parça doğrulama olsun; 5 turda her parça bir kez doğrulama olur.

5 sonucun ortalaması modelin gerçek performansıdır: $\frac{1}{5}\sum P_i$. Hiperparametreler bu ortalamaya göre seçilir, en sonda test verisiyle bir kez ölçülür.
→ b8`;
H['6.15'] = R`Performans metrikleri problem türüne göre değişir. Sınıflandırmada hata matrisi, doğruluk, kesinlik, duyarlılık, F1, ROC-AUC. Regresyonda MAE, MSE, RMSE, $R^2$. Kümelemede Silhouette, Calinski-Harabasz, Davies-Bouldin. Bir problemde hangi metriği kullanacağınızı önce problemin türü belirler.
→ b8`;
H['6.16'] = R`Hata matrisi dört kutu. **TP**: hasta olana hasta dedik. **TN**: sağlam olana sağlam dedik. **FP**: sağlam olana hasta dedik, yanlış alarm. **FN**: hasta olana sağlam dedik, tehlikeyi kaçırdık.

İsimlendirmenin mantığı: ikinci harf modelin tahmini (P/N), ilk harf tahminin doğru olup olmadığı (T/F). Tıpta FN genelde çok daha pahalıdır.
→ b8`;
H['6.17'] = R`Dört formül hata matrisinden çıkar. Doğruluk $\frac{TP+TN}{\text{hepsi}}$. Kesinlik $\frac{TP}{TP+FP}$: "pozitif dediklerimin kaçı gerçekten pozitif?" Duyarlılık $\frac{TP}{TP+FN}$: "gerçek pozitiflerin kaçını yakaladım?" F1 ikisinin harmonik ortalaması.

Küçük örnek: TP 8, FP 2, FN 4, TN 86. Doğruluk 0,94, kesinlik 0,80, duyarlılık 0,67, F1 yaklaşık 0,73.
→ b8`;
H['6.18'] = R`Regresyon metrikleri hatanın nasıl cezalandırılacağına göre seçilir. **MAE** mutlak hataların ortalaması; aykırı değerlere dirençli. **MSE** kare alır; büyük hataları çok sert cezalandırır, ilaç dozu gibi büyük hatanın tehlikeli olduğu yerde. **RMSE** MSE'nin karekökü; sonucu orijinal birimde (TL, saat) verir, raporlaması kolay. **$R^2$** 0 ile 1 arası; modelin veriyi ne kadar açıkladığını teknik olmayan birine anlatmak için.
→ b8`;
H['6.19'] = R`Kümelemede iki şey istiyoruz: küme içi mesafe **küçük**, kümeler arası mesafe **büyük**. **Silhouette** −1 ile +1 arası; +1'e yakınsa nokta kendi kümesine iyi oturmuş.

Davies-Bouldin'de dikkat: küçük olması iyi. Slaytta "kümeler arası mesafenin küme içine oranı" yazıyor ama kaynaklarda tanım tersi: küme içi dağılımın kümeler arası mesafeye oranı. Bu yüzden sıfıra yaklaştıkça iyi.
→ b8`;
H['6.20'] = R`Doğruluk paradoksu: 1000 kişinin 10'u kanser. Model herkese "sağlıklı" diyor; doğruluk %99! Ama 10 hastanın 10'unu da kaçırdı, duyarlılık sıfır.

"Harika istatistik, ölümcül model." Dengesiz veride doğruluğa güvenmeyin; azınlık sınıfını yakalayıp yakalamadığınıza, yani duyarlılığa ve F1'e bakın.
→ b8`;
H['6.21'] = R`Dengesizliğe üç çözüm. Doğru metriği seçmek (doğruluk yerine duyarlılık, F1). Veri seviyesinde yeniden örnekleme: azınlık sınıfı çoğaltmak ya da çoğunluğu azaltmak. Algoritma seviyesinde sınıf ağırlıkları: azınlık sınıfı yanlış bilmeyi daha ağır cezalandırmak.
→ b8`;
H['6.22'] = R`İkinci lab: Wisconsin meme kanseri verisi. Önce normal bir eğitim/test bölmesi yapıp karar ağacı ile random forest'ın doğruluk, kesinlik, duyarlılık ve F1 değerlerini hesaplıyoruz. Sonra **StratifiedKFold** ile 5 katlı çapraz doğrulama yapıyoruz. "Stratified" her parçada sınıf oranının korunması demek; dengesiz veride bu önemli.
→ b8`;
// ---------- Hafta 7
H['7.1'] = R`Yapay nöron biyolojik nörondan ilham alır. Dendrit sinyalleri toplar → yapay nöronda **girdiler** $x$. Sinaps bağlantının gücünü ayarlar → **ağırlıklar** $w$. Soma sinyali işler → **toplama** $z = \sum w_i x_i + b$. Akson dürtüyü iletir → **aktivasyon** $f(z)$ çıktıyı üretir.

Bu eşleştirme tablosunu sınavda sorabilirim.
→ b9`;
H['7.2'] = R`Perceptron (1957) en basit sinir ağı: girdileri ağırlıklarla çarpıp toplar, sonuç eşiği geçiyorsa 1, geçmiyorsa 0 verir. $x_0 = 1$ ve $w_0$ bias'ın hilesi: eşiği ağırlıkların içine koyuyoruz. Aktivasyon basamak fonksiyonu: $z \ge 0$ ise 1, değilse 0.
→ b9`;
H['7.3'] = R`Perceptron'u bir banka problemiyle görelim. İki girdi var: aylık gelir $x_1$ ve kredi skoru $x_2$. Kredi verilmesi için **ikisinin birden** yeterince yüksek olması lazım. "İkisi birden" ifadesi bir AND mantığı; bunu birazdan kullanacağız.
→ b9`;
H['7.4'] = R`Perceptron nasıl öğrenir? Başta ağırlıklar rastgele: $w_1 = 0.23$, $w_2 = -0.5$, $b = 0.1$. Bu ağırlıklarla müşteriler için tahmin yapar, gerçek sonuçlarla karşılaştırıp hatasını (loss) bulur, ağırlıkları hatayı azaltacak yönde günceller. Bunu binlerce kez tekrarlar.

Kutudaki cümle tanım gibidir: YSA'da öğrenme, $w$ ve $b$'nin ideal değerlerini veriden kendi kendine bulmaktır.
→ b9`;
H['7.5'] = R`Veri seti 4 müşteri: düşük-düşük, düşük-yüksek, yüksek-düşük reddedilmiş; sadece yüksek-yüksek onaylanmış. Köşedeki AND tablosuyla aynı yapı.

Eğitim sonunda $w_1 = 1$, $w_2 = 1$, $b = -120$ bulunmuş. Karar: $z = \text{Gelir} + \text{Skor} - 120 \ge 0$ ise kredi ver. Kontrol edin: D için $85 + 90 - 120 = 55$, onay; C için $70 + 15 - 120 = -35$, red.
→ b9`;
H['7.6'] = R`Aynı modelin resmi: dört müşteri girdi olarak giriyor, gelir ve skor 1 ağırlıkla çarpılıyor, −120 bias ekleniyor, toplam düğümü $z$'yi hesaplıyor, karar düğümü basamak fonksiyonuyla 1 ya da 0 veriyor. Bir perceptron çizmeniz istenirse bu şemayı çizin.
→ b9`;
H['7.7'] = R`Şimdi modeli hiç görmediği iki müşteriyle test ediyoruz. E: gelir 90, skor 20. F: gelir 60, skor 80. Formülü uygulamadan önce tahmin edin: E çok kazanıyor ama skoru düşük, F ikisinde de orta-iyi.
→ b9`;
H['7.8'] = R`Hesaplayalım. E: $90 + 20 - 120 = -10 < 0$, **red**. F: $60 + 80 - 120 = 20 \ge 0$, **onay**. Grafikte $\text{Gelir} + \text{Skor} = 120$ doğrusu iki bölgeyi ayırıyor; F yeşil tarafta, E kırmızı tarafta.

"Neden tek katman yetti?" Çünkü onaylananlarla reddedilenleri **tek bir düz çizgi** ayırabiliyor.
→ b9`;
H['7.9'] = R`Doğrusal ayrılabilirlik dediğimiz şey bu. AND'de sadece (1,1) noktası 1; onu diğer üçünden tek bir doğru ayırır. XOR'da (0,1) ve (1,0) noktaları 1, (0,0) ve (1,1) noktaları 0; çapraz duruyorlar. Hangi doğruyu çizerseniz çizin en az bir nokta yanlış tarafta kalır. Tek katmanlı perceptron sadece doğrusal ayrılabilir problemleri çözer.
→ b9`;
H['7.10'] = R`XOR gerçek hayatta: indirim sadece öğrenciye **ya da** sadece emekliye var; ikisi birden olana da, hiçbiri olmayana da yok. Tablo birebir XOR. Yani bu kampanyayı tek bir perceptron öğrenemez.
→ b9`;
H['7.11'] = R`Noktaları çizin: onaylananlar (0,1) ve (1,0), reddedilenler (0,0) ve (1,1). Yeşilleri kırmızılardan tek bir düz çizgiyle ayırmak matematiksel olarak imkânsız. Perceptron ağırlıklarını ne kadar güncellerse güncellesin, en az bir noktayı yanlış sınıflandırır. Bu, 1969'da tek katmanlı ağların sınırı olarak gösterildi.
→ b9`;
H['7.12'] = R`Çözüm: araya **gizli katman** eklemek. Çok katmanlı perceptron (MLP) giriş, gizli ve çıkış katmanlarından oluşur.

Ama sadece katman eklemek yetmez; üç şey birlikte gerekiyor. Gizli katman, **doğrusal olmayan aktivasyon** (yoksa katmanlar tek bir doğrusal fonksiyona çöker) ve öğrenme için **geri yayılım** ile **gradyan inişi**.
→ b9`;
H['7.13'] = R`Üç aktivasyon fonksiyonu. **Basamak**: 0 ya da 1, türevi yok; geri yayılımla eğitilemez. **Sigmoid**: $\frac{1}{1+e^{-x}}$, 0 ile 1 arasında yumuşak geçiş, $x = 0$'da 0,5. **ReLU**: $\max(0, x)$, negatifleri sıfırlar; basit ve hızlı, bugün en yaygını.

MLP'nin öğrenebilmesi için geri yayılım hatayı katmanlara dağıtır, gradyan inişi ağırlıkları hatayı azaltan yönde adım adım günceller.
→ b9`;
H['7.14'] = R`İndirim problemini çözen küçük bir MLP. Gizli katmanda iki nöron: $h_1 = \text{ReLU}(x_1 + x_2)$, $h_2 = \text{ReLU}(x_1 + x_2 - 1)$. Çıktı: $y = \text{ReLU}(h_1 - 2h_2)$.

Tabloyu kendiniz doldurun. (0,0): $h_1 = 0$, $h_2 = 0$, $y = 0$. (1,0) ve (0,1): $h_1 = 1$, $h_2 = 0$, $y = 1$. (1,1): $h_1 = 2$, $h_2 = 1$, $y = 2 - 2 = 0$. XOR tam olarak çıktı. $h_2$ "ikisi birden mi?" nöronu gibi çalışıyor ve o durumu cezalandırıyor.
→ b9`;
H['7.15'] = R`Sol grafik sorunu, sağ grafik çözümü gösteriyor. Tek perceptron düz bir çizgi çizebiliyordu ve yetmiyordu. MLP ise **eğri bir karar sınırı** öğreniyor: indirim bölgesi ile indirimsiz bölgeyi doğrusal olmayan bir sınırla ayırıyor. Gizli katmanın kazandırdığı şey tam olarak bu.
→ b9`;
H['7.16'] = R`İki eğitim terimi. **Epoch**: bütün eğitim verisinin ağdan bir kez geçmesi. Ağ bir turda öğrenemez, o yüzden 50, 100, 1000 epoch eğitiriz.

**Batch size**: ağırlıkları güncellemeden önce ağa verilen örnek sayısı. Her örnekte güncellemek çok yavaş, bütün veriyi birden vermek çok bellek ister; ortası gruplar halinde vermek. Örnek: 1000 örnek, batch 100 ise bir epoch 10 güncelleme yapar.
→ b9`;
H['7.17'] = R`Haftayı K-katlı çapraz doğrulamanın faydalarıyla kapatıyoruz; YSA'yı değerlendirirken de aynı yöntemi kullanırız. Ezberlemeyi engeller ve tespit eder, verinin tamamını değerlendirmede kullanır, tek bir şanslı bölmeye göre çok daha gerçekçi bir performans verir.
→ b8`;
})();
