// Hafta 4 slaytları için hoca ağzından anlatım (benim yazdığım; hocanın kendi sözleri değil)
(function(){ var R = String.raw, H = window.YZS.hoca;
H['4.1'] = R`Geçen haftayı iki cümleyle toparlayalım. Kör aramalar hedefin yerini bilmez, haritayı tarar. Bilgili aramalar $h(n)$ ile hedefin yönü ve uzaklığı hakkında bir tahmine sahiptir.
→ b2`;
H['4.2'] = R`Beş algoritmanın özü tek satırda. BFS yatay, katman katman ilerler; DFS dikey, sonuna kadar dalar. UCS sadece geçmişe, $g(n)$'ye bakar. Greedy sadece geleceğe, $h(n)$'ye bakar. A* ikisini toplar.

Bu "geçmiş / gelecek / ikisi" ayrımını bilirseniz tabloyu kafanızdan kurarsınız.
→ b3`;
H['4.3'] = R`Bu tablo çok kullanışlı: aslında hepsi aynı algoritma, sadece **sıralama ölçütü $f(n)$** değişiyor. BFS en sığ düğümü ($f = d$), DFS en derin düğümü ($f = -d$) seçer. UCS $g$, Greedy $h$, A* $g + h$ ile sıralar.

Veri yapıları da buradan gelir: BFS kuyruk (FIFO), DFS yığın (LIFO), diğer üçü öncelikli kuyruk.
→ b3`;
H['4.4'] = R`BFS'nin gerçek hayattaki yeri: "yakından uzağa" tarama gereken her yer. LinkedIn'de 1., 2., 3. derece bağlantılar tam olarak BFS seviyeleridir. Web tarayıcılar bir sayfadan linkleri katman katman gezer. Mesh ağlarda mesaj da komşudan komşuya yayılır.`;
H['4.5'] = R`DFS "sonuna kadar git" gereken yerlerde. {{pip install}} bir paketi kurarken önce onun bağımlılığına, sonra onun bağımlılığına iner. İşletim sistemi kaynak tahsis grafında döngü arayarak deadlock tespit eder. Sudoku, labirent gibi bulmaca çözücüler de dene-geri dön mantığıyla çalışır.`;
H['4.6'] = R`UCS/Dijkstra maliyetin önemli olduğu rotalamada: internet yönlendirme protokolleri, kargo rotaları.

Google Maps sorusunun cevabı: $g(n)$ sadece km değildir. Süre, hız sınırı, trafik, dönüş cezaları, kavşaklar, gişe ve feribotlar, yakıt (eko-rota), yolun kalitesi hepsi maliyete girer. Yani "maliyet" problemin neyi önemsediğine göre tanımlanır.`;
H['4.7'] = R`Greedy hızın en önemli olduğu yerde: strateji oyunlarında yüzlerce birim aynı anda yol bulmalı, en iyi yol değil hızlı yol lazım. Drone ve robotlar da anlık karar verir. Eski navigasyon cihazları da optimal değil, hızlı çözüm üretiyordu.`;
H['4.8'] = R`A* hem hızlı hem optimal olduğu için oyun motorlarının standardı; NavMesh karakterlerin yürüyebildiği alanın grafıdır ve A* bunun üzerinde çalışır. Otonom araçlar ve robotlar da SLAM ile haritayı çıkarırken A* ile yol planlar.`;
H['4.9'] = R`Bu kısım güncel bir bağlantı: LLM'ler sadece "sıradaki kelimeyi tahmin eden kara kutu" değil. Bir cümle kurarken her adımda birçok olası kelime var; bu bir arama ağacıdır. Matematik problemi çözerken de farklı düşünce yollarını deneyip en iyisini seçerler.`;
H['4.10'] = R`Gördüğümüz algoritmaların LLM karşılıkları. **Beam search** her adımda sadece en iyi $k$ adayı tutan, belleği sınırlı bir BFS'dir. **Tree of Thoughts** düşünce adımlarını ağaç gibi gezer; DFS/BFS'nin LLM versiyonu. **LLM-A*** A*'ın sezgiselini LLM'e verdirir. **MCTS** klasik aramaya olasılık ve istatistik ekler; AlphaGo'nun kullandığı yöntem.`;
H['4.11'] = R`Şimdi yeni bir problem tipine geçiyoruz: Gezgin Satıcı (TSP). Satıcı $n$ şehrin hepsine birer kez uğrayıp başladığı yere dönecek; en kısa turu arıyoruz.

Fark şu: artık "A'dan B'ye yol" aramıyoruz, **bütün şehirlerin sıralamasını** arıyoruz. Bu bir kombinatoryal optimizasyon problemi.
→ b4`;
H['4.12'] = R`Problemin büyüklüğünü görmek için: çözülmüş en büyük TSP 33.810 nokta, bir mikroçip tasarımı. Hâlâ uğraşılan problem dünyadaki bütün yerleşimler: 1.904.711 şehir.`;
H['4.13'] = R`Neden bu kadar zor? Başlangıçta $n$ seçenek, sonra $n-1$, sonra $n-2$... Toplam $n!$ rota. 5 şehirde 120 rota, 15 şehirde 1,3 trilyon.

Kullanım alanları da çok: kurye dağıtımı, araç rotalama, saha ekipleri, mikroçip üretimi.
→ b4`;
H['4.14'] = R`10 şehirde $10! = 3.628.800$ rota; 100 şehirde bu sayı evrendeki atom sayısını geçer. A* ya da BFS burada çöker, çünkü bütün olasılıkları ağaçta tutmaya çalışırlar: bellek ve zaman patlar.

Çözüm: yolu değil, iyi bir **sonucu** arayan yerel arama ve optimizasyon algoritmaları.
→ b4`;
H['4.15'] = R`Kafa değişikliğini burada yapıyoruz. Klasik aramada **yol** önemliydi, maliyeti $g(n)$'yi düşürüyorduk. Yerel aramada hangi yoldan geldiğiniz önemsiz; sadece vardığınız **durumun kalitesi** $f(x)$ önemli.

Ve artık kesin, en iyi çözüm garantisi aramıyoruz. Devasa uzayda makul sürede **yeterince iyi** çözümü bulmak hedef.
→ b4`;
H['4.16'] = R`Tabloyu satır satır okuyun. Klasik arama yolu bulur, alternatifleri ağaçta tutar, bellek pahalı, geri dönebilir. Yerel arama en iyi noktayı bulur, ağaç tutmaz; sadece şu anki durumu ve en iyi skoru hatırlar. Dalları hatırlamadığı için geri sarıp başka yola giremez.

Sınavda "klasik arama ile yerel arama farkı" sorulursa bu üç satır yeter.
→ b4`;
H['4.17'] = R`Durum uzayı manzarası yerel aramanın haritası. Yatayda bütün olası çözümler, dikeyde kaliteleri. Tepeler iyi çözümler.

Terimleri bilin: **global maksimum** en yüksek tepe, **yerel maksimum** etrafına göre yüksek ama en yüksek olmayan tepe, **düz (flat) yerel maksimum / plato** komşuların hepsi eşit olan düzlük, **omuz** sonra yükselmeye devam eden düzlük. Algoritmaların hepsi bu tuzaklarla uğraşıyor.
→ b4`;
H['4.18'] = R`Aynı manzarayı TSP'ye uyguluyoruz. Yatay eksen şehirlerin ziyaret sıraları: [A-B-C-D], [A-C-B-D]... Dikey eksen o rotanın sağladığı tasarruf. [B-A-C-D] yerel tepe, [D-C-B-A] global tepe.
→ b4`;
H['4.19'] = R`Bütün dersin haritası bu şema. Sol taraf **sistematik yol tabanlı**: kör (BFS, DFS, UCS) ve bilgili (Greedy, A*). Sağ taraf **yerel arama**: tek bir aday tutanlar (tepe tırmanma, tavlama, tabu) ve popülasyon tutanlar (GA, PSO, karınca kolonisi).

Sınavda bir algoritma adı gördüğünüzde bu şemadaki yerini söyleyebilmelisiniz.`;
H['4.20'] = R`Tekil durum algoritmalarında hafızada aynı anda tek bir aday çözüm $x$ var. Üç algoritmayı bir zincir gibi düşünün: her biri bir öncekinin zayıflığını kapatıyor. Tepe tırmanma takılır, tavlama kurtarır; tavlama aynı yerlere döner, tabu hafızayla engeller.
→ b4`;
H['4.21'] = R`Tepe tırmanma tamamen açgözlü ve hafızasız. Rastgele bir $x$ ile başla, bütün komşulara bak, en iyisini seç. En iyi komşu şu ankinden iyi değilse **dur**: zirvede olduğunu sanır. Değilse oraya geç ve tekrarla.

"Sisli havada dağa tırmanmak" gibi düşünün: sadece ayağınızın altındaki eğime bakıyorsunuz.
→ b4`;
H['4.22'] = R`Zayıf noktası: asla kötü bir hamle kabul etmez. Bu yüzden ilk küçük tepede (yerel maksimum) ya da düzlükte (plato) takılır kalır. Aşağı inmeden daha yüksek tepeye geçemezsiniz; tepe tırmanma inmeyi reddeder. Çözüm bir sonraki algoritma: tavlama benzetimi.
→ b4`;
H['4.23'] = R`Tavlama benzetimi metal tavlamadan geliyor: sıcak metal şekil alır, soğudukça sertleşir. Algoritma rastgele **bir** komşu seçer. Daha iyiyse kesin kabul eder. Daha kötüyse hemen reddetmez, $P = e^{-|\Delta E|/T}$ olasılıkla kabul eder.

$T$ yüksekken kötü hamle sık kabul edilir (keşif), $T$ düştükçe algoritma tepe tırmanmaya benzer (sömürü). Her adımda $T \leftarrow \alpha T$, örneğin $\alpha = 0.95$.
→ b4`;
H['4.24'] = R`Tavlamanın zayıflığı: hafızası yok. Az önce indiği tepenin yamacına rastgele tekrar tırmanabilir; aynı yerlerde vakit kaybeder. Bunu çözmek için hafızalı bir algoritma lazım: tabu arama.
→ b4`;
H['4.25'] = R`Tabu arama kısa süreli hafıza kullanır. Daha iyi komşu yoksa bile durmaz, **en az kötü** komşuya geçer. Geri dönüp döngüye girmemek için son $k$ hamleyi **tabu listesine** yazar. Yasak süreli: örneğin 5 iterasyon sonra listeden düşer (FIFO).

**Aspirasyon kriteri:** yasak bir hamle şimdiye kadarki en iyi global çözümden bile iyi bir yere götürüyorsa yasak delinir. Bu dört kavramı sınavda sorarım.
→ b4`;
H['4.26'] = R`Üç algoritmayı aynı örnekte karşılaştıracağız. Kargo aracı 4 noktayı bir sırayla ziyaret ediyor; her sıralamanın bir puanı var. Başlangıç [A,B,C,D] 60 puan. Sağında 70'lik yerel tepe, sonra 50'lik vadi, sonra 100'lük gerçek zirve, en sağda plato.

Komşu olmak = iki harfin yerini değiştirmek. Hedef 100'e ulaşmak.
→ b4`;
H['4.27'] = R`Tepe tırmanma 60'tan 70'e çıkar. 70'te bakar: sol 60, sağ 50, ikisi de kötü. Durur. 100'lük zirveyi hiç görmez, çünkü oraya gitmek için 50'lik vadiden geçmek lazım.

Plato sorununu da not edin: komşuların hepsi eşitse algoritma yön bulamaz.
→ b4`;
H['4.28'] = R`Tavlama 70'teyken vadiye inmeyi düşünür. $\Delta E = 50 - 70 = -20$, $T = 40$ ile $P = e^{-20/40} = e^{-0.5} \approx 0.61$. Yani yaklaşık %60 ihtimalle vadiye iner.

Rastgele sayı 0,61'in altına düşerse risk alır, iner ve oradan 100'e çıkar. Düşmezse 70'te kalır. $T$ her adımda düşer (40, 36, 30...), bu yüzden riski erken almak gerekir.
→ b4`;
H['4.29'] = R`Tabu arama durmayı yasaklar. 60'tan 70'e çıkar ve bu hamleyi (1↔2) tabuya yazar. 70'te daha iyi komşu yok; geri dönmek yasak, o yüzden mecburen 50'ye iner, bu hamleyi de tabuya yazar. 50'de eski tepeye dönüş yasak, tek açık yol ileri: 100'e ulaşır.

Tavlamada şans gerekiyordu, tabuda gerekmiyor. Ama bedeli var, sonraki slayt.
→ b4`;
H['4.30'] = R`Tabu bu örnekte kolay göründü çünkü sadece 2 komşu vardı. Gerçek hayatta iki sorunu var. Birincisi her adımda **bütün komşulara** bakmak zorunda; milyonlarca komşu varsa çok yavaş. İkincisi **sürekli uzayda** çalışamaz: virgüllü sayılarda "aynı hamleyi" listede tutmak anlamsız.`;
H['4.31'] = R`Tepe tırmanma basit ama boş değil: çok hızlı ve ayar gerektirmiyor. Tek tepeli (konveks) problemlerde başka algoritmaya gerek yok; YSA'daki gradyan inişi aslında sürekli uzayda tepe tırmanmadır. Milisaniyelik karar gereken oyun ve robotikte de kullanılır. Hibrit sistemlerde GA doğru tepeyi bulur, son rötuşu tepe tırmanma yapar.`;
H['4.32'] = R`Tavlamanın gücü bütün komşulara bakmaması: rastgele bir komşu, iyiyse git, kötüyse zar at. Bu yüzden komşu sayısının devasa olduğu problemlerde, örneğin milyonlarca transistörün yerleştirildiği VLSI çip tasarımında kullanılır. Sürekli ve gürültülü fonksiyonlarda da rahat çalışır.`;
H['4.33'] = R`İki uygulama daha. Derin öğrenmede hiperparametre (öğrenme oranı, katman sayısı) ararken başta yüksek $T$ ile riskli değişikliklere izin verilir, model yerel bir doğrulukta takılmasın diye. Lojistikte de geçici olarak daha uzun bir rotayı kabul edip sonra çok daha iyi bir kestirme bulmayı sağlar.`;
H['4.34'] = R`Tabunun gücü hafıza: aynı döngüye girmez. Kurallı **çizelgeleme** problemlerinin klasik çözümüdür: ders programı, hastane nöbetleri, havayolu mürettebatı. Çakışan atamalar tabuya alınır.

LLM'lerde tekrar cezası (sık kullanılan kelimeleri geçici cezalandırmak) aynı fikir. Finansta riskli hisse kombinasyonlarını tabuya almak arama uzayını daraltır.
→ b4`;
H['4.35'] = R`Seçim kuralını tek cümleyle hatırlayın. Tek tepe varsa **tepe tırmanma**. Milyonlarca komşu var ve hepsine bakacak vakit yoksa **tavlama**. Kurallı bir çizelge var ve aynı hatayı tekrarlamak istemiyorsanız **tabu**.

Sınavda "şu probleme hangi algoritma" sorusu gelirse bu üç cümleye bakın.
→ b4`;
H['4.36'] = R`Şimdi tek aday yerine **kalabalıkla** arayan algoritmalar. Uzaya aynı anda çok sayıda rastgele aday bırakılır. Adaylar bağımsız değil, iyi özelliklerini paylaşır. Kötüler elenir, iyiler kalır. Geniş alana yayılarak başladıkları için yerel tepeye takılma riski çok düşük.
→ b5`;
H['4.37'] = R`Üç popülasyon algoritması ve ilham kaynakları. **Genetik algoritma** evrimden: kromozom, çaprazlama, mutasyon. **Karınca kolonisi** karıncaların feromon izinden. **Parçacık sürüsü** kuş ve balık sürülerinin haberleşmesinden.
→ b5`;
H['4.38'] = R`GA evrimin "güçlü olan hayatta kalır" ilkesini taklit eder. Döngü: test et (uygunluk), seç, çaprazla, mutasyona uğrat, tekrar test et. Yeterince iyi bir çözüme yakınsayana ya da nesil sınırına ulaşana kadar döner.
→ b5`;
H['4.39'] = R`Terimleri tek tek bilin. **Popülasyon** aday çözümler kümesi. **Kromozom** bir adayın kodlanmış hali, örneğin [1,0,1,1,0]. **Uygunluk testi** adayın puanı. **Seçilim** yüksek puanlıların ebeveyn olması. **Çaprazlama** ebeveyn genlerinin bir noktadan kesilip birleşmesi.

**Mutasyon** çok düşük olasılıkla rastgele küçük değişiklik. Amacı çeşitliliği korumak ve yerel tepeye sıkışmayı önlemek. "Mutasyon neden var?" sorusunun cevabı bu.
→ b5`;
H['4.40'] = R`GA'yı somut bir örnekle çözüyoruz: 15 kg taşıyan çanta, 4 eşya. Heykel 7 kg/100 TL, kutu 5 kg/80 TL, kılıç 4 kg/70 TL, saat 3 kg/50 TL. Ağırlığı aşmadan toplam değeri en büyük yapacağız. Bundan sonraki 6 slayt GA'nın 6 adımı.
→ b5`;
H['4.41'] = R`1. adım kodlama: her eşya bir gen, çantadaysa 1, değilse 0. Kromozom 4 haneli: [Heykel, Kutu, Kılıç, Saat]. Rastgele 3 birey: A = [1,1,0,0], B = [0,1,1,1], C = [1,1,1,0].
→ b5`;
H['4.42'] = R`2. adım uygunluk: A 12 kg, 180 TL. B 12 kg, 200 TL. C 16 kg; sınırı aşıyor, elenir ya da cezalandırılır. Uygunluk fonksiyonu kısıtları da hesaba katmalı; sadece değere bakarsanız C en iyi çıkardı.
→ b5`;
H['4.43'] = R`3. adım seçim: sınırı aşmayan en yüksek iki skor, A ve B, ebeveyn olur.
→ b5`;
H['4.44'] = R`4. adım çaprazlama: iki ebeveyni ortadan kesiyoruz. A'nın ilk yarısı [1,1], B'nin ikinci yarısı [1,1]. Çocuk [1,1,1,1]. Bu tek noktalı çaprazlama.
→ b5`;
H['4.45'] = R`5. adım mutasyon: çocuk 19 kg, sınır dışı. Mutasyon son geni 0 yapar: [1,1,1,0], ama bu da C ile aynı, 16 kg. Döngü devam eder ve başka mutasyonlarla [1,1,0,1] gibi yeni kombinasyonlar çıkar. Mutasyonun işe yaradığı yer burası: çaprazlamanın üretemeyeceği adayları üretiyor.
→ b5`;
H['4.46'] = R`6. adım durdurma: nesiller boyu devam eder, slayta göre B = [0,1,1,1], 200 TL, "en iyi çözümlerden biri" olarak kalır.

Ama dikkat: [1,1,0,1] yani heykel + kutu + saat 15 kg ve 230 TL. Sınırı aşmıyor ve 200'den büyük; gerçek optimum bu. Sınavda bu soru gelirse 230'u gösterin.
→ b5`;
H['4.47'] = R`"4 eşyada 16 kombinasyonu dene, olsun bitsin" diyebilirsiniz. 4 eşyada evet. Ama 50 eşyada $2^{50} \approx 1{,}13 \times 10^{15}$ kombinasyon var; süper bilgisayar bile yıllarca uğraşır. Gerçek lojistik ve üretim problemleri binlerce değişkenli. GA'yı bu yüzden kullanıyoruz.
→ b5`;
H['4.48'] = R`GA'nın üç avantajı: akıllı arama ile zaman tasarrufu, mutasyonla kör noktalardan kaçış, matematiksel kolaylık (türev vs. gerekmiyor).

Kutudaki cümle çok önemli: GA **en kusursuz çözümü garanti etmez**; ama hepsini denemenin imkânsız olduğu yerde kısa sürede mükemmele yakın çözüm bulur. Sırt çantası örneğinde de tam bunu gördük.
→ b5`;
H['4.49'] = R`GA'nın en ünlü başarısı: NASA'nın ST5 uydusu için anten. Az enerjiyle zor ortamda sinyal yakalayan bir anten lazımdı. Evrimsel algoritma ve süper bilgisayarla tasarlandı; uzaya giden ilk "evrimleşmiş" donanım, 2006.`;
H['4.50'] = R`Anteni görünce şaşırıyorsunuz: insanların çizdiği simetrik çanak ya da çubuk antenlere hiç benzemiyor, bükülmüş bir tel gibi. Çünkü bir insan tasarlamadı; algoritma sıfırdan üretti.`;
H['4.51'] = R`Antenin hikâyesi GA'nın adımlarının aynısı. Binlerce rastgele bükülmüş tel tasarımı (popülasyon), her birinin sinyal performansı (uygunluk). Kötüler elenir (seçilim). İyi kıvrımlar birleştirilir, rastgele yeni açılar eklenir (çaprazlama ve mutasyon). Sonunda asimetrik ama X-bandında kusursuz çalışan tasarım çıkar.
→ b5`;
H['4.52'] = R`PSO kuş ve balık sürülerinden ilham alır. GA'dan önemli farkı: **eleme yok**, kimse ölmüyor. Bütün parçacıklar hayatta kalır ve ortak akılla hedefe doğru uçar.
→ b5`;
H['4.53'] = R`Her parçacığın bir **konumu** ve bir **hızı** var. Her biri kendi bulduğu en iyi noktayı, **P_best**'i hatırlar (bireysel hafıza). Sürü de herkesin bulduğu en iyi noktayı, **G_best**'i paylaşır (sosyal bilgi).

Bir sonraki adım üç şeyin karışımı: mevcut hız (atalet), kendi P_best'ine çekim, G_best'e çekim. İterasyonlar ilerledikçe bütün sürü global optimumun etrafında toplanır; buna yakınsama diyoruz.
→ b5`;
H['4.54'] = R`Somut örnek: kara kutuyu arayan telsizli kurtarma ekibi. Herkes kendi yolunda ölçtüğü en güçlü sinyali hatırlıyor (P_best). Biri "kuzeyde sinyal %70" diye anons ediyor (G_best). Herkes ikisini harmanlayıp yön seçiyor. Sonunda ekip tek bir noktada buluşuyor.
→ b5`;
H['4.55'] = R`Bugün PSO genelde tek başına değil, derin öğrenmenin arka planında kullanılıyor. Hiperparametre ayarı (öğrenme oranı, katman sayısı, dropout) ve özellik seçimi (en kritik girdileri bulup eğitimi kısaltmak) en yaygın iki kullanımı.`;
H['4.56'] = R`Karınca kolonisinde iletişim dolaylı: karıncalar birbirine değil, **çevreye** feromon bırakarak konuşur. Algoritmada her yolun bir feromon değeri $\tau$ (geçmiş başarı) ve bir sezgisel değeri $\eta$ (yolun kısalığı) var. Karınca yolu bu ikisinin dengesine göre rulet gibi olasılıkla seçer.

Feromon zamanla **buharlaşır**, böylece kötü yollar unutulur. Kısa yoldan dönen karıncalar daha yoğun iz bırakır.
→ b5`;
H['4.57'] = R`Neden çalıştığını görün: kısa yoldan giden karınca daha erken döner, o yolda trafik ve koku artar. Arkadan gelenler kokunun yoğun olduğu yolu seçer, koku daha da artar: pozitif geri besleme. Uzun yoldaki koku buharlaşır. Sonunda koloni tek bir kısa rotada birleşir. Bu yüzden TSP ve rotalama problemlerinde kullanılır.
→ b5`;
H['4.58'] = R`ACO'nun bugünkü yeri hep rotalama: çiplerde milyarlarca transistör arasındaki kablolar, Amazon depolarında binlerce robotun çarpışmadan hareketi, UPS ve FedEx'te anlık değişen dağıtım rotaları.`;
H['4.59'] = R`Şimdi her şeyi birleştiren bir senaryo: bir e-ticaret şirketinin otonom dağıtım sistemi. 6 görevi 6 algoritmayla eşleştirin. Benim önerim:

- Sokak sokak rota (TSP) → **Karınca kolonisi**
- Drone'un fiziksel tasarımı → **Genetik algoritma** (NASA anteni gibi)
- Anlık sıcak nokta arama → **PSO** (sinyal arama gibi)
- Vardiya ve şarj çizelgesi → **Tabu arama**
- Modelin hiperparametre ayarı → **Tavlama benzetimi** (PSO da savunulabilir)
- Anlık engel aşma → **Tepe tırmanma** (milisaniyelik karar)
→ b5`;
H['4.60'] = R`Senaryonun mesajı: gerçek bir sistemde bu algoritmalar birbiriyle yarışmaz. Her biri sistemin bir departmanında kendi işini yapar ve birbirini tamamlar.`;
H['4.61'] = R`Kapanış cümlesi popülasyon algoritmalarının özeti: "Hiçbirimiz hepimiz kadar akıllı değiliz." Tek bir aday takılabilir; kalabalık birlikte daha iyi çözüm bulur.`;
})();
