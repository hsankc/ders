// Veri Yapıları: CoderLog'un "C Dilinde Veri Yapıları" oynatma listesindeki videolarda yazılan kodlar
// fns: {ad: [ne yapar, [adımlar], dikkat, [animasyonlar], düzeltilmiş kod]}
window.VY_CL = {
  playlist: 'https://www.youtube.com/playlist?list=PLzmB302RFLdM6w8iyptjmMFy3pVVmig1k',
  channel: 'https://www.youtube.com/@coder_log',
  // no, başlık, video kimliği, süre
  videos: [
    ['1.1', 'İşaretçiler (Pointers) Nedir?', 'xtNJvT6GIjI', '14:18'],
    ['1.2', 'Pointer\'a Pointer (Pointer to Pointer) Nedir?', 'hiWl-OkhW40', '10:17'],
    ['1.3', 'Pointerların Gerçek Kullanım Amacı Nedir?', '40JfIBY3eiE', '10:36'],
    ['1.4', 'Pointerların Gerçek Kullanım Amacı Nedir 2?', 'W2b8LYTXLdk', '8:42'],
    ['2.1', 'Pointer ve Dizi Benzerliği', 'gSZPrEVfXuk', '13:07'],
    ['2.2', 'Statik ve Dinamik Dizi', 'xv2oFHPjK5A', '11:38'],
    ['2.3', 'Bir Boyutlu Dinamik Dizi', 'wgEB0El4jcc', '11:55'],
    ['2.4', 'İki Boyutlu Dinamik Dizi', 'peIeNIbrnq8', '31:00'],
    ['2.5', 'Matrislerde İşlemler', 'n6UJfXepIug', '36:00'],
    ['3.1', 'Struct\'ı Hatırlayalım (Ayrıntılı)', '7NBuYcEvgZ4', '40:00'],
    ['3.2', 'Bağlı Liste Nedir?', 'WEPcS8P5U8Y', '14:55'],
    ['3.3', 'Bağlı Listenin Başına ve Sonuna Düğüm Ekleme', '1QMDopTAZ-M', '16:00'],
    ['3.4', 'Bağlı Listeden Düğüm Silme', 'Aox71ziEaxY', '15:00'],
    ['3.5', 'Bağlı Listeyi Sıralama ve Sıralı Bağlı Listeye Eleman Ekleme', 'Z18CU-dtc7E', '17:00'],
    ['3.6', 'Bağlı Listeyi Ters Çevirme', 'BvwuBOAaSVw', '10:33']
  ]
};

(function(){
  var B = 'kaynaklar/veri-yapilari/coderlog/';
  // main'in içindeki bölümler: başlık, satır aralığı, satır satır açıklama, gerçek çıktı (derleyip çalıştırarak alındı)
  // lines: [[satır ya da 'a-b', açıklama]]; commented: dosyada /* */ içinde
  var PARTS1 = [
   {title:'Pointer nedir? & Pointer\'a pointer nedir?', from:6, to:39, commented:1, videos:['1.1','1.2'], anim:['a-cl-pointer'],
    what:'a adında bir int, onu gösteren ptr, ptr\'yi gösteren ptr2 ve ptr2\'yi gösteren ptr3 tanımlanıyor. Her printf bir değeri ya da bir adresi basıyor. Kural: her * bir ok takip etmek demek.',
    lines:[[9, 'a adında int değişken, değeri 10. Bellekte 4 byte.'], [11, 'int* ptr: bir int\'in adresini tutabilen değişken (pointer). Şu an içinde çöp değer var.'], [12, 'int** ptr2: bir int*\'ın, yani bir pointer\'ın adresini tutar.'], [13, 'int*** ptr3: bir int**\'ın adresini tutar.'],
      [15, '&a, a\'nın adresi. ptr artık a\'yı gösteriyor.'], [17, '%d ile a\'nın değeri: 10.'], [18, '%p adres basar: a\'nın adresi.'], [19, 'ptr\'nin içindeki değer: yine a\'nın adresi (18. satırla aynı).'], [20, '*ptr: ptr\'nin gösterdiği yere git, oradaki değeri al: 10.'], [21, '&ptr: pointer\'ın kendi adresi. Pointer da bellekte duran bir değişken.'],
      [25, 'ptr2\'ye ptr\'nin adresi yazılıyor: pointer\'a pointer.'], [27, 'ptr2\'nin değeri = ptr\'nin adresi (21. satırla aynı).'], [28, '&ptr2: ptr2\'nin kendi adresi.'], [29, '**ptr2: iki ok git, a\'ya ulaş: 10.'],
      [31, 'ptr3\'e ptr2\'nin adresi yazılıyor.'], [35, 'ptr3 = ptr2\'nin adresi (28. satırla aynı).'], [36, '*ptr3: bir ok git = ptr2\'nin değeri = ptr\'nin adresi.'], [37, '**ptr3: iki ok git = ptr\'nin değeri = a\'nın adresi.'], [38, '***ptr3: üç ok git = a\'nın kendisi: 10.']],
    out:'10\n000000000061FE14\n000000000061FE14\n10\n000000000061FE08\n-----------------------------\n000000000061FE08\n000000000061FE00\n10\n-----------------------------\n000000000061FE00\n000000000061FE08\n000000000061FE14\n10',
    note:'Adresler bilgisayardan bilgisayara ve çalıştırmadan çalıştırmaya değişebilir; aralarındaki ilişki değişmez. a\'nın adresi 61FE14, ptr\'nin 61FE08, ptr2\'nin 61FE00: pointer\'lar 8 byte.'},
   {title:'Pointerların gerçek kullanımı', from:41, to:56, commented:1, videos:['1.3','1.4'], anim:['a-cl-kati'],
    what:'Bir fonksiyona değişkenin kendisini (değerini) göndermekle adresini göndermek arasındaki fark. Kullanılan iki fonksiyon dosyanın en altında: sayinin_iki_kati ve sayinin_uc_kati.',
    lines:[[44, 'x = 20.'], [45, 'int* ptr tanımı.'], [47, 'ptr, x\'i gösteriyor.'], [50, 'Ekrana 20.'], [52, 'x\'in değeri (20) kopyalanıp gönderiliyor. Fonksiyon kopyayı 40 yapar ama main\'deki x değişmez.'], [53, 'Bu sefer x\'in adresi gönderiliyor. Fonksiyon *ptr ile main\'deki x\'in kendisini 3 katına, 60\'a çıkarır.'], [55, 'Ekrana 60: sadece adresle gönderilen fonksiyon x\'i değiştirebildi.']],
    out:'20\n60',
    note:'Bu bölüm iki fonksiyonu kullanıyor ve onların prototipi üstte yok; denerken fonksiyonları main\'in üstüne al ya da prototip yaz. Liste başını değiştiren fonksiyonlara ** gönderilmesinin sebebi de bu bölümdeki fikir.'},
   {title:'Dizi ve pointerların benzerliği', from:59, to:86, commented:1, videos:['2.1'],
    what:'Dizinin ismi ilk elemanın adresidir; bu yüzden dizi bir pointer gibi kullanılabilir. *dizi, dizi[0] ile; *(dizi+1), dizi[1] ile aynı şey.',
    lines:[['61-64', 'Önceki bölümden kalan x ve onu gösteren ptr.'], [67, '3 elemanlı int dizisi.'], [69, 'dizi[0] = 1.'], [71, '&dizi: dizinin tamamının adresi.'], [72, '&dizi[0]: ilk elemanın adresi; 71. satırla aynı adres (tipleri farklı).'], [73, '&dizi[1]: 4 byte sonrası (int 4 byte).'], [74, '&dizi[2]: 8 byte sonrası.'],
      [78, 'dizi (sadece ismi): yine ilk elemanın adresi. Dizi ile pointer\'ın en büyük ortak özelliği bu.'], [79, 'ptr: x\'in adresi.'], [83, '*ptr = x = 20.'], [84, '*dizi = dizi[0] = 1.'], [85, '*(dizi+1) = dizi[1] = 2. dizi+1, bir sonraki int\'in adresi.']],
    out:'1\n000000000061FE08\n000000000061FE08\n000000000061FE0C\n000000000061FE10\n-------------------------\n000000000061FE08\n000000000061FE14\n-------------------------\n20\n1\n2',
    note:'Adresler 4\'er byte artıyor (…08, …0C, …10). Hocanın Hafta 1 kodundaki adres yazdırma denemesi de aynı şeyi gösteriyor.'},
   {title:'Statik ve dinamik dizi nedir?', from:88, to:99, commented:1, videos:['2.2'],
    what:'Statik dizi: boyu kodda sabit, derlerken belli (int dizi[] = {1,2,3}), stack\'te durur. Dinamik dizi: boyu program çalışırken belli olur ve malloc ile heap\'ten alınır (bir sonraki bölüm).',
    lines:[[93, 'Statik dizi: 3 eleman.'], [98, '"Dynamic Array" başlığı altında bir pointer\'a dizinin adresi veriliyor.']],
    note:'98. satır dinamik dizi oluşturmaz; sadece var olan statik diziyi gösterir. Ayrıca &dizi\'nin tipi int (*)[3] olduğu için derleyici uyarı veriyor (derledim: incompatible pointer type). Doğrusu int* ptr = dizi; gerçek dinamik dizi bir sonraki bölümde.',
    fix:'int dizi[] = {1,2,3};                      // statik: boyu sabit\nint* ptr = dizi;                           // dizi zaten ilk elemanın adresi\n\nint* d = (int*)malloc(3 * sizeof(int));    // dinamik: heap\'ten'},
   {title:'Bir boyutlu dinamik dizi oluşturalım', from:102, to:122, commented:1, videos:['2.3'], anim:['a-malloc1'],
    what:'Eleman sayısı kullanıcıdan okunuyor, o kadar int için malloc ile yer açılıp 0–99 arası sayılarla dolduruluyor.',
    lines:[[105, 'Dizinin başlangıç adresini tutacak pointer.'], [107, 'Eleman sayısı ve döngü sayacı.'], ['109-110', 'Eleman sayısı klavyeden okunuyor (scanf\'e değişkenin adresi verilir: &sutun_sayisi).'],
      [114, 'malloc heap\'ten sizeof(int) · sutun_sayisi byte ayırır ve başlangıç adresini döndürür; (int*) ile int adresine çevrilip ptr\'ye yazılır.'], [119, '*(ptr+i), ptr[i] ile aynı. rand()%100: 0–99 arası sayı.'], [120, 'Elemanı yazdır.']],
    input:'5', out:'Sutun sayisini giriniz.41 67 34 0 69',
    note:'srand çağrılmadığı için rand her çalıştırmada aynı sayıları verir (41 67 34 …). İşin bitince free(ptr) yazmak gerekir; burada yok.'},
   {title:'İki boyutlu dinamik dizi oluşturalım', from:126, to:148, commented:1, videos:['2.4'], anim:['a-malloc2'],
    what:'Önce satır sayısı kadar satır adresi (int*) için, sonra her satıra sütun sayısı kadar int için malloc yapılıyor. Hocanın dinamik_matris_olustur1 fonksiyonunun main içinde yazılmış hâli.',
    lines:[[128, 'int** ptr: satır adreslerini tutan dizinin adresi.'], [129, 'Sayaçlar ve boyutlar.'], ['131-135', 'Satır ve sütun sayısı okunuyor.'], [137, 'Satır sayısı kadar int* için yer: her eleman bir satırın adresi olacak.'], [141, 'Her satır için sütun sayısı kadar int; adresi (ptr+i)\'nin gösterdiği yere yazılıyor.'], [145, '*(*(ptr+i)+j), ptr[i][j] ile aynı: önce i. satırın adresi, sonra o satırın j. elemanı.'], [146, 'Elemanı yazdır.']],
    input:'3 ve 4', out:'Satir sayisini giriniz: Sutun sayisini giriniz: 41 67 34 0 69 24 78 58 62 64 5 45',
    note:'Satır sonunda alt satıra geçilmediği için 12 sayı tek satırda çıkıyor; sonraki bölümdeki matris_yaz bunu düzeltiyor. Heap\'te ayrılan yer: satir·8 + satir·sutun·4 byte (vize sorusu: 10×15 için 680 byte, main\'deki 8 byte\'lık pointer ile 688).'},
   {title:'Çalışan kısım: fonksiyonlarla matris', from:152, to:165, videos:['2.4'], anim:['a-malloc2'],
    what:'Bir önceki bölümün işi iki fonksiyona taşınmış: iki_boyutlu_matris_olustur matrisi açıp dolduruyor, matris_yaz satır satır yazıyor. Dosya çalıştırılınca sadece bu kısım çalışır.',
    lines:[[152, 'Matrisin kendisi: int**.'], [153, 'Boyutlar.'], ['155-159', 'Satır ve sütun sayısı okunuyor.'], [161, '&matris gönderiliyor (int***): fonksiyon main\'deki matris değişkenine heap\'teki matrisin adresini yazacak.'], [162, 'Yazdırma. Burada da &matris gönderilmiş (int** yeterdi); parametre sırası sutun, satir.'], [165, 'Program başarıyla bitti.']],
    input:'3 ve 4', out:'Satir sayisini giriniz: Sutun sayisini giriniz: 41 67 34 0\n69 24 78 58\n62 64 5 45',
    note:'Fonksiyonların prototipi olmadığı için yeni gcc sürümleri hata verir; düzeltmesi main açıklamasının altında.'}
  ];
  var PARTS3 = [
   {title:'İlk deneme: struct değişkeni, struct gönderme, ok (->)', from:16, to:42, commented:1, videos:['3.1'],
    what:'Videonun ilk yarısı. O sırada Student yapısında p bir işaretçi değil düz bir struct Person, okul numarasının adı da sNo imiş. Bu yüzden blok şimdiki yapılarla derlenmez; çıktıyı o eski yapıyla derleyip aldım.',
    lines:[[16, 'struct Person türünde p1 değişkeni (typedef\'ten önceki uzun yazım).'], ['18-19', 'Nokta ile alanlara değer: p1 bir değişken, işaretçi değil.'], ['21-22', '%s bir yazıyı (char*) basar, %d bir sayıyı.'], [26, 'Struct fonksiyona değerle gider: fonksiyon kopyasını alır.'],
      [30, 'student s1: typedef\'li kısa ad.'], ['31-33', 'Struct içinde struct: s1.p.age, s1.p.name (o zamanki yapıda p düz bir struct).'], [35, 'Öğrenciyi yazdır.'], [39, 'person* ptr = &p1: struct\'ı gösteren pointer.'], ['41-42', 'Pointer ile alana ok (->) ile erişilir: ptr->name, (*ptr).name ile aynı.']],
    out:'Person\'s name: Ahmet\nPerson\'s age: 20\n-------------------------------------\nPerson\'s name: Ahmet\nPerson\'s age: 20\n-------------------------------------\nStudent\'s school number: 2000\nStudent\'s name: Ali\nStudent\'s age: 18\n-------------------------------------\nPerson\'s name: Ahmet\nPerson\'s age: 20'},
   {title:'Struct\'ın ve alanlarının adresleri', from:44, to:52, videos:['3.1'],
    what:'Bir struct bellekte alanlarının arka arkaya dizildiği tek bir bloktur. İlk alanın adresi struct\'ın adresidir.',
    lines:[['44-46', 'person p ve nokta ile alanlara değer.'], [48, '&p: struct\'ın adresi.'], [49, '&(p.name): ilk alanın adresi, struct\'ın adresiyle aynı.'], [50, '&(p.age): ikinci alan, 8 byte sonra (char* 8 byte).']],
    out:'Struct\'in adresi: 000000000061FE00\nName\'in adresi: 000000000061FE00\nAge\'in adresi: 000000000061FE08\n---------------------------------'},
   {title:'malloc ile struct ve ok (->)', from:55, to:70, videos:['3.1'],
    what:'Öğrenci heap\'te malloc ile açılıyor; pointer üzerinden alanlara ok ile erişiliyor. Burada bir bellek hatası var.',
    lines:[[55, 'student* std: öğrenciyi gösterecek pointer (stack\'te).'], [57, 'malloc ile heap\'te bir student kadar yer: school_number + p işaretçisi.'], [59, 'std->school_number = 2005: std bir pointer olduğu için ok.'], ['60-61', 'HATA: std->p hiçbir yeri göstermiyor (malloc içini doldurmaz), çöp bir adrese yazılıyor.'], ['63-68', 'Adresler: std\'nin kendisi stack\'te, student heap\'te; school_number struct\'ın başında, p 8 byte sonra.']],
    out:'std pointerin adresi: 000000000061FDF8\nstudent\'in adresi: 0000000000AA7D40\nstudent\'in school_number\'in adresi: 0000000000AA7D40\nstudent\'in person\'in adresi: 0000000000AA7D48\nstudent\'in person\'in name\'in adresi: 0000000000AA7D60\nstudent\'in person\'in age\'in adresi: 0000000000AA7D68',
    note:'Bu çıktı eksik satır (std->p için malloc) eklenmiş hâlinden. Orijinali çöp adrese yazdığı için çökebilir.',
    fix:'student* std;\nstd = (student*)malloc(sizeof(student));\nstd->school_number = 2005;\nstd->p = (person*)malloc(sizeof(person));   // eksik olan satır\nstd->p->name = "Selin";\nstd->p->age = 24;'}
  ];
  var FILES = [
 {id:'cl-1', week:1, title:'Pointer ve dinamik dizi', path:'1-pointer-ve-dinamik-dizi.c', parts:{main:PARTS1}, videos:['1.1','1.2','1.3','1.4','2.1','2.2','2.3','2.4'], anim:['a-cl-pointer','a-cl-kati','a-malloc1','a-malloc2'],
  intro:'1.1–2.4 videolarında yazılan kod. Her videoda bir önceki deneme yorum satırına (/* */) alınıp altına yenisi yazılmış. Bu yüzden main\'in içinde sırayla altı küçük deneme duruyor; sadece en sondaki, fonksiyonla iki boyutlu matris oluşturma kısmı çalışıyor. Konular hocanın Hafta 1–2 kodlarıyla aynı: pointer, pointer\'a pointer, dizi ve pointer ilişkisi, malloc ile bir ve iki boyutlu dinamik dizi.',
  fns:{
   'main':['Videolardaki denemeleri sırayla içeriyor. Sadece en alttaki matris kısmı çalışıyor, diğerleri /* */ içinde.', [
      'Pointer nedir (1.1, 1.2): a = 10, ptr = &a. ptr a\'nın adresini, *ptr a\'nın değerini (10), &ptr pointer\'ın kendi adresini verir. ptr2 = &ptr ile pointer\'a pointer, **ptr2 yine 10. ptr3 = &ptr2; *ptr3 ptr\'nin adresi, **ptr3 a\'nın adresi, ***ptr3 a\'nın değeri.',
      'Gerçek kullanım (1.3, 1.4): sayinin_iki_kati(x) x\'in kopyasını alır, main\'deki x değişmez. sayinin_uc_kati(ptr) adresi alır, *ptr ile main\'deki x\'i 60 yapar.',
      'Dizi ve pointer benzerliği (2.1): dizinin ismi ilk elemanın adresidir. dizi, &dizi[0] aynı adresi basar; *dizi = dizi[0], *(dizi+1) = dizi[1]. Adresler 4\'er byte artar.',
      'Statik ve dinamik dizi (2.2): int dizi[] = {1,2,3} boyu baştan belli statik dizi. Dinamik dizinin boyu çalışırken belli olur ve malloc ile açılır.',
      'Bir boyutlu dinamik dizi (2.3): sütun sayısı scanf ile okunur, ptr = (int*)malloc(sizeof(int)*sutun_sayisi) ile yer açılır, *(ptr+i) = rand()%100 ile doldurulur.',
      'İki boyutlu dinamik dizi (2.4): önce satır sayısı kadar int* için yer (int**), sonra her satıra sütun sayısı kadar int. *(*(ptr+i)+j), ptr[i][j] ile aynı.',
      'Çalışan kısım: satır ve sütun okunur, iki_boyutlu_matris_olustur(&matris, …) heap\'te matrisi açar, matris_yaz basar.'],
     'Fonksiyonlar main\'in altında ve en üstte prototipleri yok. CodeBlocks\'taki gcc 8 bunu uyarıyla geçiyor, yeni gcc sürümleri hata veriyor. Çözüm: fonksiyonları main\'in üstüne taşı ya da en üste prototiplerini yaz.',
     ['a-cl-pointer', 'a-cl-kati', 'a-malloc1'],
     '// #include satırlarının hemen altına:\nvoid matris_yaz(int***, int, int);\nvoid iki_boyutlu_matris_olustur(int***, int, int);\nvoid sayinin_iki_kati(int);\nvoid sayinin_uc_kati(int*);'],
   'matris_yaz':['Matrisi satır satır yazar. Matris int*** olarak, yani main\'deki değişkenin adresiyle gelmiş.', [
      '*matris, main\'deki int** matris\'tir. *(*matris+i) i. satır, *(*(*matris+i)+j) de (*matris)[i][j] elemanı.',
      'j son sütuna gelince alt satıra geçilir.'],
     'Yazdırmak matrisi değiştirmediği için int** göndermek yeterdi (matris işlemleri dosyasındaki matris_yaz öyle). Parametre sırası (sutun, satir) olmuş; çağrıda da aynı sırayla verildiği için doğru çalışıyor.', [], ''],
   'iki_boyutlu_matris_olustur':['Heap\'te satir × sutun boyutunda matris açıp 0–99 arası sayılarla doldurur.', [
      'main\'deki int** matris değişeceği için adresi gelir (int***).',
      '*matris = (int**)malloc(sizeof(int*)*satir_sayisi): satır işaretçileri dizisi.',
      '*(*matris+i) = (int*)malloc(sizeof(int)*sutun_sayisi): her satır için ayrı blok.',
      '*(*(*matris+i)+j) = rand()%100 ile doldurulur.'],
     'Hocanın dinamik_matris_olustur1 fonksiyonunun aynısı. Hoca (*dizi)[i] yazıyor, burada *(*matris+i) yazılmış; ikisi aynı şey.', ['a-malloc2'], ''],
   'sayinin_iki_kati':['Değerle gönderme örneği: x\'in kopyasını iki katına çıkarır, main\'deki x değişmez.', [],
     'Fonksiyon bitince kopya da silinir; yani bu fonksiyon hiçbir şeyi değiştirmez. Videodaki amaç farkı göstermek.', ['a-cl-kati'], ''],
   'sayinin_uc_kati':['Adresle gönderme örneği: *ptr ile main\'deki değişkenin kendisini üç katına çıkarır.', [
      'ptr, main\'deki x\'in adresini tutar.',
      '*ptr = (*ptr) * 3 satırı x\'i 60 yapar.'],
     'Liste başını değiştiren fonksiyonların ** alması da aynı sebepten.', ['a-cl-kati'], '']
  }},
 {id:'cl-2', week:2, title:'Matris işlemleri', path:'2-matris-islemleri.c', videos:['2.5'], anim:['a-malloc2','a-matris'],
  intro:'2.5 videosunun kodu: kullanıcıdan alınan boyutlarla iki dinamik matris oluşturur, ikisini toplar ve çarpar. Hocanın Hafta 2 matris çarpımı kodunun int** ile yazılmış dinamik hâli.',
  fns:{
   'matris_olustur':['Heap\'te satir × sutun matris açar, elemanlara 0, 1 ya da 2 koyar (rand()%3).', [
      'Önce satır işaretçileri, sonra her satır malloc ile açılır.'],
     'Pointer ve dinamik dizi dosyasındaki iki_boyutlu_matris_olustur ile aynı.', ['a-malloc2'], ''],
   'matris_yaz':['Matrisi int** olarak alıp yazar; *(*(matris+i)+j), matris[i][j] ile aynı.', [], '', [], ''],
   'matris_topla':['Aynı boyutlu iki matrisi toplar, sonucu yeni bir matris olarak döndürür.', [
      'Sonuç matrisi m3 en başta m1 boyutunda oluşturulur.',
      'Boyutlar aynıysa m3[i][j] = m1[i][j] + m2[i][j] (kodda *(*(m3+i)+j) yazımıyla).',
      'm3 (int**) döndürülür.'],
     'Boyutlar uyuşmazsa return; ile değer döndürmeden çıkıyor. main bu çöp değeri matris sanıp yazdırınca program çöküyor: 2×3 ve 3×2 matrisle denedim, çöktü. Ayrıca m3 kontrolden önce açıldığı için o durumda bellek boşa gidiyor. Doğrusu: önce kontrol et, uymuyorsa NULL döndür, main\'de NULL mı diye bak.', [],
     'int** matris_topla(int** m1,int satir1,int sutun1,\n                   int** m2,int satir2,int sutun2)\n{\n    int i,j;\n    int** m3;\n    if(satir1!=satir2 || sutun1!=sutun2)\n    {\n        printf("Satir ve sutun uyusmazligindan dolayi toplanamaz.\\n");\n        return NULL;\n    }\n    matris_olustur(&m3,satir1,sutun1);\n    for(i=0;i<satir1;i++)\n        for(j=0;j<sutun1;j++)\n            m3[i][j] = m1[i][j] + m2[i][j];\n    return m3;\n}\n\n// main\'de:\nm3 = matris_topla(m1,satir1,sutun1, m2,satir2,sutun2);\nif(m3 != NULL) matris_yaz(m3,satir1,sutun1);'],
   'matris_carp':['m1 (satir1 × sutun1) ile m2 (satir2 × sutun2) matrisini çarpar; sonuç satir1 × sutun2.', [
      'Çarpım şartı: sutun1 == satir2.',
      'm3[i][j] = 0 ile başlanır; k döngüsü m1[i][k]*m2[k][j] çarpımlarını toplar.',
      'Burada dizi yazımı (m3[i][j]) kullanılmış. Yorumdaki pointer yazımında en dıştaki * eksik; o hâliyle derlenmez.'],
     'matris_topla\'daki hata burada da var: şart tutmazsa değersiz return; var ve m3 önceden açılıyor. Düzeltmesi aynı: önce kontrol, uymuyorsa return NULL. Üç iç içe döngü: O(satir1 · sutun1 · sutun2).', ['a-matris'], ''],
   'main':['Dört boyutu okur, iki matris oluşturup yazar, toplar ve çarpar.', [
      'Toplama için iki matris aynı boyutta, çarpma için sutun1 == satir2 olmalı. Kare matris girersen (ör. 2 2 2 2) ikisi de çalışır.',
      '2×3 ve 3×2 girersen toplama tutmaz ve program çöker (matris_topla\'daki not).'],
     'free hiç çağrılmıyor. Bu küçük programda sorun değil ama hocanın kodunda matrisi geri veren fonksiyon var ve vizede bellek soruları çıkıyor.', [], '']
  }},
 {id:'cl-3', week:3, title:'Struct', path:'3-struct.c', parts:{main:PARTS3}, videos:['3.1'], anim:[],
  intro:'3.1 videosunun kodu: struct, typedef, nokta (.) ve ok (->) ile alanlara erişim, struct\'ın ve alanlarının bellekteki adresleri. Bağlı listeye geçmeden önceki hazırlık. Dikkat: dosya olduğu gibi derlenmiyor (displayStudent\'a bak) ve main\'de bir bellek hatası var.',
  fns:{
   'struct Person':['Bir kişi: name ve age.', [
      'typedef sayesinde struct Person yerine kısaca person yazılabiliyor.',
      'name bir char*: p.name = "Ahmet" yazının kendisini değil, bellekteki adresini tutar.'], '', [], ''],
   'struct Student':['Öğrenci: school_number ve bir kişiye işaretçi (p).', [
      'p bir struct Person*. Yani öğrencinin içinde kişi bilgisi değil, kişinin adresi var.'],
     'Videonun başında p işaretçi değilmiş; yorumdaki s1.p.age gibi kullanımlar o hâlden kalma. Sonradan işaretçi yapılınca displayStudent güncellenmemiş.', [], ''],
   'main':['Struct değişkeninin ve alanlarının adreslerini yazdırır, sonra malloc ile bir öğrenci açar.', [
      'person p; p.age = 20; p.name = "Ahmet"; p bir değişken olduğu için alanlara nokta ile erişilir.',
      '&p ile &(p.name) aynı adresi basar: ilk alan struct\'ın başındadır. &(p.age) 8 byte sonradır, çünkü char* 8 byte.',
      'student* std = malloc(sizeof(student)); std bir işaretçi olduğu için alanlara ok ile erişilir: std->school_number = 2005.',
      'std->p->name = "Selin" satırı hatalı: std->p hiçbir yeri göstermiyor (malloc içini doldurmaz), çöp bir adrese yazılıyor.'],
     'Doğrusu önce kişi için de yer açmak. Düzeltilmiş hâliyle derleyip çalıştırdım: student\'ın ve school_number\'ın adresi aynı, p 8 byte sonra çıkıyor.', [],
     'student* std;\nstd = (student*)malloc(sizeof(student));\nstd->school_number = 2005;\nstd->p = (person*)malloc(sizeof(person));   // eksik olan satır\nstd->p->name = "Selin";\nstd->p->age = 24;'],
   'displayPerson':['Kişiyi yazdırır. Struct değerle gelir (kopyası), alanlara nokta ile erişilir.', [],
     'Büyük struct\'larda kopyalamak yerine adres (person*) göndermek daha ucuz. Prototipi üstte yok.', [], ''],
   'displayStudent':['Öğrenciyi yazdırır.', [],
     'Dosya bu fonksiyon yüzünden derlenmiyor: struct\'ta sNo diye bir alan yok (adı school_number oldu) ve p artık işaretçi; s.p.name değil s.p->name olmalı.', [],
     'void displayStudent(student s)\n{\n    printf("Student\'s school number: %d\\n", s.school_number);\n    printf("Student\'s name: %s\\n", s.p->name);\n    printf("Student\'s age: %d\\n", s.p->age);\n}']
  }},
 {id:'cl-4', week:3, title:'Bağlı liste', path:'4-bagli-liste.c', videos:['3.2','3.3','3.4','3.5','3.6'], anim:['a-basa','a-sona','a-sil','a-sirali','a-cl-ters'],
  intro:'3.2–3.6 videolarının kodu: tek yönlü bağlı listede düğüm oluşturma, başa ve sona ekleme, silme, sıralı ekleme, sıralama ve ters çevirme. Hocanın Hafta 3 liste kodunun İngilizce adlı karşılığı: dugum → Node, anahtar → data, sonraki → next, liste_basi → head_of_list.',
  fns:{
   'struct Node':['Liste düğümü: data ve next. typedef ile kısaca node.', [], 'Hocanın struct dugum { anahtar; sonraki; } yapısıyla aynı.', [], ''],
   'create_linkedlist':['Yeni bir düğüm oluşturup adresini döndürür. Adı "liste oluştur" ama tek düğüm yaratıyor.', [
      'malloc(sizeof(node)) ile heap\'te yer açılır.',
      'data yazılır, next = NULL yapılır, adres döndürülür.'],
     'Hocanın dugum_olustur\'u ile aynı. Hoca ayrıca malloc NULL döndü mü diye bakıp exit(1) yapıyor.', ['a-basa'], ''],
   'write_linkedlist':['iter ile baştan sona gezip yazar.', [], 'Liste başını kaybetmemek için ayrı bir iter kullanmak iyi alışkanlık.', [], ''],
   'add_node_head_of_linkedlist':['Başa ekleme, O(1).', [
      'temp = yeni düğüm.',
      'temp->next = *head_of_list: yeni düğüm eski ilk düğümü gösterir.',
      '*head_of_list = temp: liste başı artık yeni düğüm.'],
     'Hocanın liste_basina_ekle\'si satır satır aynı. Liste başı değiştiği için ** ile gelir.', ['a-basa'], ''],
   'add_node_end_of_linkedlist':['Sona ekleme, O(n).', [
      'Liste boşsa yeni düğüm liste başı olur.',
      'Değilse iter ile son düğüme kadar yürünür (iter->next != NULL).',
      'iter->next = yeni düğüm.'],
     'Hocanınkiyle aynı mantık; tek fark düğümü en başta değil, gerektiği yerde oluşturması.', ['a-sona'], ''],
   'delete_node_from_linkedlist':['Değeri verilen düğümü siler.', [
      'Liste boşsa mesaj yazar.',
      'Silinecek ilk düğümse: temp = ikinci düğüm, free(ilk düğüm), baş = temp.',
      'Değilse iter aranan düğümü, temp onun bir öncesini tutarak ilerlenir.',
      'Bulunamazsa mesaj; bulunursa temp->next = iter->next ve free(iter).'],
     'Hoca ilk düğüm durumunu ayrı yazmadan aynı döngüyle çözüyor; sonuç aynı. Arama yüzünden O(n).', ['a-sil'], ''],
   'add_node_to_sorted_linkedlist':['Sıralı listeye sırayı bozmadan ekler.', [
      'Liste boşsa yeni düğüm liste başı olur.',
      'İlk düğümün değeri eklenenden büyükse yeni düğüm en başa girer.',
      'Değilse iter ile data\'dan küçük düğümler geçilir, temp bir öncekini tutar.',
      'temp->next = yeni düğüm, yeni düğümün next\'i = iter.'],
     'Eklenen sayı ilk düğümle aynıysa program çöküyor: döngü hiç dönmez, temp hiç atanmamış olur ve temp->next geçersiz adrese yazar (1 2 3 listesine 1 ekleyerek denedim, çöktü). İkinci koşulu >= yapınca düzeliyor. Aynı sayı ortadaysa ikinci kez eklenir; videodaki çıktıda 5\'in iki kez görünmesi bundan. Hocanın versiyonu eşit sayıyı hiç eklemiyor.', ['a-sirali'],
     'else if(iter!=NULL && iter->data>=data)   // > yerine >=\n{\n    node* temp = create_linkedlist(data);\n    temp->next = *head_of_list;\n    *head_of_list = temp;\n}'],
   'liste_sirala':['Listeyi eklemeli sıralama (insertion sort) ile sıralar. Hocanın liste_sirala fonksiyonunun data ve next ile yazılmış hâli.', [
      'İlk düğüm tek başına sıralı liste olur, d kalan düğümleri tutar.',
      'Her turda c = d alınır, d ilerler; c sıralı kısımda doğru yere sokulur (a önceki, b sonraki düğüm).',
      'b hâlâ baştaysa c başa geçer; değilse a->next = c, c->next = b.'],
     'O(n²). main\'de çağrılmıyor.', [], ''],
   'reverse_linkedlist':['Listeyi ters çevirir; hocanınkinden farklı bir yolla.', [
      'iter ikinci düğümden başlar, ilk düğümün next\'i NULL yapılır (o artık son düğüm olacak).',
      'Her turda temp = iter, iter ilerler, temp listenin başına taşınır: temp->next = baş, baş = temp.',
      'Yani düğümler sırayla en başa alınıyor ve sonunda sıra tersine dönüyor.'],
     'Boş listede çöker: (*head_of_list)->next, liste boş mu kontrolünden önce okunuyor. Kontrolü en başa almak gerekir. Hocanın liste_ters_cevir\'i boş listede de çalışır.', ['a-cl-ters', 'a-ters'],
     'void reverse_linkedlist(struct Node** head_of_list)\n{\n    node* temp;\n    node* iter;\n    if(*head_of_list == NULL)\n    {\n        printf("The list is empty.");\n        return;\n    }\n    iter = (*head_of_list)->next;\n    (*head_of_list)->next = NULL;\n    while(iter!=NULL)\n    {\n        temp = iter;\n        iter = iter->next;\n        temp->next = (*head_of_list);\n        (*head_of_list) = temp;\n    }\n}'],
   'main':['3 ile başlar, başa 2 ve 1, sona 4 5 6 7 ekler; sonra sıralı ekleme ve ters çevirme yapar.', [
      'İlk yazım: 1 2 3 4 5 6 7',
      '5 eklenince: 1 2 3 4 5 5 6 7',
      '0 eklenince: 0 1 2 3 4 5 5 6 7',
      '8 eklenince: 0 1 2 3 4 5 5 6 7 8',
      'Ters çevrilince: 8 7 6 5 5 4 3 2 1 0'],
     'Bu çıktıları programı derleyip çalıştırarak kontrol ettim.', [], '']
  }},
 {id:'cl-5', week:7, title:'İkili ağaç: AVL sağa döndürme', path:'5-avl-sag-rotasyon.c', videos:[], anim:[], out:1,
  intro:'AVL ağacında sağa döndürme (right rotation) denemesi. Bu oynatma listesinde videosu yok ve AVL vize konusu değil (hoca heap\'e kadar işledi); finale çalışırken işine yarar.',
  fns:{
   'struct node':['AVL düğümü: key, left, right ve height (yükseklik).', [], '', [], ''],
   'newNode':['Yeni düğüm açar; tek başına olduğu için height = 1.', [], 'Fonksiyonun sonundaki }; içindeki ; fazlalık ama zararsız.', [], ''],
   'preOrder_yardimci':['Preorder: önce düğüm (anahtar ve yükseklik), sonra sol, sonra sağ.', [], '', [], ''],
   'preOrder':['Yardımcıyı çağırıp alt satıra geçer.', [], '', [], ''],
   'rightRotate':['y\'nin sol çocuğu x yukarı çıkar, y onun sağına iner; x\'in sağ alt ağacı (T) y\'nin soluna geçer.', [
      'x = y->left, T = x->right.',
      'x->right = y; y->left = T.'],
     'Eksik: return x; yok ve yükseklikler güncellenmiyor. Fonksiyon bir şey döndürmediği için main\'deki n çöp değer alıyor. Çalıştırınca ikinci satır "3 (1) 5 (1)" çıktı, 4 ve 6 kayboldu. Düzeltilmiş hâli "4 (3) 6 (1) 3 (2) 5 (1)" yazıyor.', [],
     'int height(struct node* n){ return n == NULL ? 0 : n->height; }\nint max(int a, int b){ return a > b ? a : b; }\n\nstruct node* rightRotate(struct node* y){\n    struct node* x = y->left, *T = x->right;\n    x->right = y;\n    y->left = T;\n    y->height = max(height(y->left), height(y->right)) + 1;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    return x;\n}'],
   'main':['3\'ün solunda 4 (onun solunda 6), sağında 5 olan küçük bir ağaç elle kurulur; preorder yazılır, sağa döndürülüp tekrar yazılır.', [],
     'Bu ağaç arama ağacı değil (4 > 3 ama solda); sadece döndürmeyi göstermek için kurulmuş.', [], '']
  }}
  ];
  FILES.forEach(function(f){ f.cl = 1; f.base = B; });
  window.VY_KOD = (window.VY_KOD || []).concat(FILES);
})();
