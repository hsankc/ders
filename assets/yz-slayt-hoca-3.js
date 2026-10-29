// Hafta 3 slaytları için hoca ağzından anlatım (benim yazdığım; hocanın kendi sözleri değil)
(function(){ var R = String.raw, H = window.YZS.hoca;
H['3.1'] = R`Geçen hafta PEAS ile bir otonom araç tasarladık: sensörü, eyleyicisi, ortamı ve performans ölçütü belli bir ajan. Ama ajanı tasarlamak yetmiyor; araç A'dan B'ye gidecekse ona bir **problem** vermemiz lazım.

Bu 5 soruyu aklınızda tutun: neredeyim, ne yapabilirim, yaptığım şey beni nereye götürür, vardım mı, ne kadar harcadım. Bütün arama algoritmaları bu beş bilgiyle çalışır. Bir sonraki slaytta bunların resmî adlarını göreceğiz.
→ b1`;
H['3.2'] = R`Önceki slayttaki 5 soru burada resmî adlarını alıyor: başlangıç durumu, eylemler, geçiş modeli, hedef testi, yol maliyeti.

Güzel olan şu: her bileşen PEAS'teki bir harfe bağlanıyor. Başlangıç durumunu **sensörler** verir, eylemleri **eyleyiciler** sınırlar, geçiş modeli **ortamın** kurallarıdır (duvardan geçemezsiniz), yol maliyeti de **performans** ölçütüyle ilgilidir. Sınavda "problemin bileşenleri nelerdir" derlerse bu beşini örnekle yazın.
→ b1`;
H['3.3'] = R`Önceki slayt problemin "ne" olduğunu söylüyordu, bu slayt "nasıl" çözüldüğünü. Sıra önemli: önce hedefi netleştiririz (bu kapsamı daraltır), sonra problemi tanımlarız, sonra bütün olası durumların haritasını, yani durum uzayını çıkarırız.

Arama algoritması bu uzayda ilerlerken her düğümde "hedef mi?" diye sorar. Birden çok yol bulunursa maliyetlere bakılıp en ucuzu seçilir. Bu son adım ileride UCS ve A*'ı neden öğrendiğimizin cevabı.
→ b1`;
H['3.4'] = R`Burası çok önemli bir ayrım: **durum uzayı** fiziksel haritadır, **arama ağacı** ise algoritmanın o haritayı gezerken oluşturduğu olasılıklardır.

Haritada S, A, B, G diye 4 nokta var. Ama ağaçta aynı nokta birden çok kez çıkabilir: S'den A'ya, A'dan B'ye, B'den G'ye gidebilirsiniz; ya da S'den direkt B'ye. Her farklı yol ağaçta ayrı bir daldır.
→ b1`;
H['3.5'] = R`Bakın, 4 mekânlı küçük bir haritada bile 3. adımda ağaç 10 düğüme çıktı. Buna **kombinatoryal patlama** diyoruz: düğüm sayısı her seviyede çarpılarak büyüyor.

Bu yüzden "bütün yolları dene" diyemiyoruz. Hangi düğümü önce açacağımızı akıllıca seçen bir **arama stratejisine** ihtiyacımız var. Dersin geri kalanı bu stratejiler.`;
H['3.6'] = R`İki aileyi ayırın. **Kör (bilgisiz) arama** hedefin nerede olduğunu bilmez, haritayı sistematik tarar: BFS, DFS, UCS. **Bilgili (sezgisel) arama** hedefe ne kadar kaldığına dair bir tahmin $h(n)$ kullanır: Greedy ve A*.

Sınavda bir algoritma adı verilirse ilk soru şu olmalı: $h(n)$ kullanıyor mu? Kullanıyorsa bilgili, kullanmıyorsa kör.`;
H['3.7'] = R`BFS ağacı **katman katman** tarar: önce 1 adım uzaktakilerin hepsi, sonra 2 adım uzaktakiler. Örnekte A'dan başlıyoruz: B, C, D (1. seviye), sonra E, F (2. seviye). Sıra A B C D E F.

Artısı: çözüm varsa bulur, adımlar eşit maliyetliyse en kısa yolu bulur. Eksisi: bekleyen bütün düğümleri kuyrukta tuttuğu için bellek çok çabuk dolar. Veri yapısı **FIFO kuyruk**.
→ b2`;
H['3.8'] = R`DFS'nin artısı hafıza: o an üzerinde yürüdüğü tek yolu tutar. Eksisi: hedef sağda, yakında olsa bile sola dalıp çok derin (hatta sonsuz) bir çıkmaza girebilir; en iyi yolu garanti etmez.

Ağaçtaki iki sıraya dikkat edin. Yığına (stack) çocukları soldan sağa koyarsanız en son konan D önce çıkar: **A D F C E B**. Özyinelemeli (recursive) yazarsanız soldan başlar: **A B C E D F**. İkisi de DFS; sınavda hangi kuralı kullandığınızı yazın.
→ b2`;
H['3.9'] = R`DFS'nin tanımı: önüne çıkan ilk yoldan gidebildiği en uca kadar gider, çıkmaza girince bir adım geri dönüp diğer dalı dener. Veri yapısı **LIFO yığın**.

Ağaç dolaşmalarıyla bağını da kurun. 0 kökünden **preorder** (kök-sol-sağ) 0, 1, 4, 5, 2, 6, 3, 7 verir; bu tam olarak DFS'nin düğümleri ziyaret sırasıdır. **Postorder** (sol-sağ-kök) 4, 5, 1, 6, 2, 7, 3, 0. Inorder sadece ikili ağaçlarda anlamlı.
→ b2`;
H['3.10'] = R`BFS her adımı 1 sayıyordu; oysa 1 km'lik yol ile 100 km'lik yol aynı değil. UCS bunu düzeltir: adım sayısına değil, o ana kadar harcanan gerçek maliyete $g(n)$ bakar. $f(n) = g(n)$.

Her zaman faturası en düşük düğümü açar. Kenar maliyetleri negatif olmadığı sürece en ucuz yolu garanti eder.
→ b2`;
H['3.11'] = R`UCS'nin işleyişi üç adım: bütün yollar toplam maliyete göre **öncelikli kuyrukta** sıralanır, her seferinde en ucuz olan açılır, ucuz sandığı yol pahalılaşırsa algoritma kuyruktaki diğer yola döner.

Graftaki örnekte S'den çıkış ucuz görünen B–D kenarı 100'e patlıyor; UCS orayı bırakıp E–F tarafına döner. Bulduğu yol S→A→B→E→F→Send, toplam $10+10+20+20+20 = 80$. C üzerinden yol 110, D üzerinden yollar daha pahalı.
→ b2`;
H['3.12'] = R`UCS ile Dijkstra aynı mantık; isimleri alana göre değişiyor. Ağcılar ve yöneylemciler Dijkstra der, yapay zekacılar UCS.

Tek fark: Dijkstra **bütün** düğümlere en kısa yolu bulana kadar çalışır, UCS hedefe ulaşınca **durur**. "UCS ile Dijkstra'nın farkı nedir" diye sorarsam cevap budur.`;
H['3.13'] = R`Burada $g(n)$'nin adım adım nasıl biriktiğini görüyoruz. Kural basit: bir düğümün maliyeti, atasının maliyeti artı aradaki kenarın maliyeti: $g(n) = g(\text{ata}) + c(\text{ata}, n)$.

S→A→B ile $g(B) = 2 + 1 = 3$ olmuştu. B'den C'ye: $g(C) = 3 + 2 = 5$. C'den G'ye: $g(G) = 5 + 3 = 8$. Bu 8, çalışma grafındaki optimal maliyettir.
→ b2`;
H['3.14'] = R`BFS ve DFS kenarın gerçek maliyetine bakmaz, her adıma 1 ekler. Bu yüzden BFS'nin "en kısa yol" garantisi sadece **bütün adımlar eşitse** geçerli; kareli labirentte BFS mükemmel çalışır.

Maliyetler farklıysa BFS en ucuz yolu değil, **en az kenarlı** yolu bulur. Gerçek faturayı okuyabilen algoritmalar UCS ve A*.
→ b2`;
H['3.15'] = R`Bilgili aramada $h(n)$ tahminini nereden buluyoruz? En yaygın iki yol var.

**Öklid** kuş uçuşu mesafedir: $\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$; çapraz gitmek serbestse kullanılır. **Manhattan** sadece yatay-dikey hareket varsa kullanılır: $|x_2-x_1| + |y_2-y_1|$; hesaplaması daha ucuzdur. Izgarada çapraz gidemiyorsanız Manhattan gerçeğe daha yakın tahmin verir.
→ b3`;
H['3.16'] = R`Greedy sadece $h(n)$'ye bakar: $f(n) = h(n)$. Her kavşakta "hangisi beni hedefe daha çok yaklaştırıyor" diye sorar, şimdiye kadar ne harcadığını umursamaz.

Çok hızlıdır ama optimal değildir: önündeki dağı, nehri hesaba katmaz. Kısa görünen yol onu uzun bir çıkmaza sokabilir. Birazdan çalışma grafında tam olarak bunu göreceğiz.
→ b3`;
H['3.17'] = R`A* iki bilgiyi birleştirir: şimdiye kadar harcanan kesin maliyet $g(n)$ ve hedefe kalan tahmin $h(n)$. $f(n) = g(n) + h(n)$; her adımda $f$'i en küçük düğüm açılır.

Şartı da aklınızda olsun: tahmin $h$ gerçek kalan mesafeyi **hiçbir zaman abartmazsa** A* en kısa yolu garanti eder. Bu şartın adı kabul edilebilirlik; birkaç slayt sonra geliyor.
→ b3`;
H['3.18'] = R`Bir arama algoritmasını dört soruyla değerlendiriyoruz. **Tamlık:** çözüm varsa bulur mu? **Optimallik:** bulduğu en ucuz mu? **Alan karmaşıklığı:** bellekte kaç düğüm tutuyor? **Zaman karmaşıklığı:** kaç düğüm üretiyor?

Dikkat: YZ'de hız saniyeyle değil, dallanma faktörü $b$ ve derinlik $d$ ile ölçülür, örneğin $O(b^d)$. Bir sonraki tabloyu bu dört kritere göre okuyacağız.
→ b2`;
H['3.19'] = R`Bu tabloyu ezberlemenizi değil, **gerekçesini** bilmenizi istiyorum. BFS tamdır ve eşit maliyette optimaldir ama bellek çok kötü. DFS tam değil (sonsuz döngü) ama bellek çok iyi. UCS her zaman optimal ama yavaş.

Greedy hızlıdır ama ne tam ne optimal. A* doğru sezgiselle hem tam hem optimal; bedeli bellek. Sınavda "hangisini seçersiniz" sorusu bu tablodan gelir.
→ b3`;
H['3.20'] = R`Şimdi her algoritmayı aynı graf üzerinde çalıştıracağız. Graf yönlü; kenar maliyetleri ve $h$ değerleri üstünde. Her algoritma için üç şey isteniyor: açılan düğümlerin sırası, bulunan yol, yolun maliyeti. Eşitlikte alfabetik sıra.

Grafta iki yol var: **en az kenarlı** S→B→G, maliyeti 13. **Optimal** S→A→B→C→G, maliyeti 8. BFS az kenarlıyı, UCS ve A* optimali bulur. Greedy'nin ne yapacağı bir sonraki slaytta.
→ b3`;
H['3.21'] = R`Greedy S'de A ($h=5$) ile B ($h=4$) arasında kalır, B'yi seçer. B'de C ($h=2$) ile G ($h=0$) arasında G'yi seçer. Bulduğu yol S→B→G, maliyet $5 + 8 = 13$.

Neden yanıldı? Kısa vadeli düşündü. "B beni hedefe çok yaklaştırdı" dedi ama B'den G'ye giden kenarın 8 tuttuğunu hesaba katmadı. Optimal yol 8 iken 13 ödedi. Greedy'nin tuzağı tam olarak bu.
→ b3`;
H['3.22'] = R`A*'ı optimal yapan iki kural var. **Kabul edilebilirlik:** $h(n) \le h^*(n)$, yani tahmin gerçeği asla abartmaz. Bu, ağaç aramasında optimalliği sağlar.

**Tutarlılık:** $h(n) \le c(n,n') + h(n')$, bir üçgen eşitsizliği. Bir adım atınca tahmin, atılan adımın maliyetinden fazla düşemez. Bunun sonucu: A*'ın açtığı düğümlerin $f$ değerleri hiç azalmaz. Çalışma grafında 7, 7, 7, 7, 8 gördük. Graf aramasında da düğümleri tekrar açmak gerekmez.
→ b3`;
H['3.23'] = R`Tutarlılığı tek bir kenar üzerinde kontrol edelim. A'dan B'ye: $h(A) = 5$, kenar 1, $h(B) = 4$. $5 \le 1 + 4$, eşitlik sağlanıyor, tutarlı.

Sezgisi şu cümlede: "Hedefe 10 km var diyorsan, 1 km yürüdükten sonra 2 km kaldı diyemezsin." Tahminler adım adım, dengeli azalmalı. Sınavda her kenar için bu eşitsizliği yazıp kontrol edersiniz.
→ b3`;
H['3.24'] = R`Gerçek bir örnek: Çanakkale'den İzmir'e iki yol. Sahil yolu Ezine–Edremit, iç yol Çan–Balıkesir. Kenar maliyetleri gerçek km, $h$ ise İzmir'e kuş uçuşu.

Sahil yolu $45 + 65 + 190 = 300$ km, iç yol $65 + 90 + 130 = 285$ km. Greedy Ezine'yi seçer ($h=190 < 210$) ve 300'lük yolu bulur. A* de 300'ü bulur! Çünkü $h(\text{Balıkesir}) = 150$, Balıkesir'den İzmir'e gerçek yol 130: tahmin **abartıyor**, kabul edilebilir değil. UCS doğru cevabı, 285'i bulur.
→ b3`;
H['3.25'] = R`Bu slayt önceki sorunun haritası: her şehrin $h$ değeri ve aradaki gerçek mesafeler. Soruyu çözerken bu grafiği çizip üzerinde çalışın.

Ufak bir not: grafikte Çanakkale–Çan kenarı 63 gibi okunuyor, soru slaytında 65. Hesaplarda 65'i kullandım.
→ b3`;
H['3.26'] = R`Son olarak sorunun ilk şıkkı: durum uzayını arama ağacına çevirmek. Ajan ziyaret ettiği şehre geri dönmezse ağaç iki dala iner: Çanakkale→Ezine→Edremit→İzmir ve Çanakkale→Çan→Balıkesir→İzmir.

Ziyaret edilenler listesi tutmazsanız buna **ağaç araması** denir ve ajan Çanakkale ile Ezine arasında sonsuza kadar gidip gelebilir. Tek bir {{if dugum in ziyaret_edilenler}} kontrolüyle **graf aramasına** geçersiniz; patlama durur, ağaç sonlu olur.
→ b1`;
})();
