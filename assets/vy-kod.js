// Veri Yapıları: C dili sözlüğü ve ders kodlarının fonksiyon fonksiyon açıklaması
window.VY_C = [
  // grp, ad, ne işe yarar, nasıl yazılır, dersteki örnek, dikkat
  ['Başlangıç', '#include', 'Hazır kütüphaneleri programa ekler. stdio.h ekrana yazma (printf), stdlib.h bellek ayırma (malloc, free, exit, rand) için.', '#include <stdio.h>\n#include <stdlib.h>\n#include "ikiliAramaAgaci.h"', 'Her dosyanın en üstünde stdio.h ve stdlib.h var. BST projesinde kendi başlık dosyası "ikiliAramaAgaci.h" tırnakla ekleniyor.', 'Köşeli parantez < > sistem kütüphanesi, tırnak " " kendi dosyan demek.'],
  ['Başlangıç', '#define', 'Sabit tanımlar. Derleyici, kodda geçen adı değeriyle değiştirir.', '#define SENTINEL -10000000', 'Yığında "boş yığından eleman istendi" demek için SENTINEL değeri döndürülüyor.', 'Sonuna noktalı virgül konmaz.'],
  ['Başlangıç', 'int main(int argc, char** argv)', 'Programın başladığı yer. return (EXIT_SUCCESS); programın sorunsuz bittiğini söyler.', 'int main(int argc, char** argv) {\n    ...\n    return (EXIT_SUCCESS);\n}', 'Her dosyada fonksiyonlar main içinden çağrılarak denenir.', 'argc ve argv komut satırı argümanlarıdır, derste kullanılmıyor.'],
  ['Başlangıç', 'printf', 'Ekrana yazar. % ile başlayan yerlere sırayla değişkenler gelir.', 'printf("%4d ", anahtar);\nprintf("%p", adres);\nprintf("\\n");', '%d tam sayı, %4d en az 4 karakterlik yer ayırarak tam sayı, %p adres, \\n alt satır.', 'Format ile değişken tipi uyuşmalı: int için %d, adres için %p.'],
  ['Başlangıç', 'void', '"Hiçbir şey" demek. Değer döndürmeyen fonksiyonun dönüş tipidir.', 'void liste_yaz(struct dugum *liste_basi)', 'Ekrana yazan, ekleyen, silen fonksiyonların çoğu void.', 'void * ise "tipi belli olmayan adres" demektir (malloc bunu döndürür).'],

  ['İşaretçiler', '* (işaretçi tanımı)', 'Değişken tanımında * o değişkenin bir adres tuttuğunu söyler.', 'int *p;           // int adresi tutar\nstruct dugum *a;  // düğüm adresi tutar', 'struct dugum *liste_basi; listenin ilk düğümünün adresini tutar.', 'Tanımdaki * ile kullanımdaki * farklı işlerdir.'],
  ['İşaretçiler', '* (adresteki değer)', 'Bir işaretçinin önüne * koyunca o adresteki değere ulaşılır.', 'int x = 5; int *p = &x;\n*p = 7;   // x artık 7', '*(dizi+i) dizinin i. elemanı demek, dizi[i] ile aynı.', 'İşaretçi bir yeri göstermiyorsa (NULL ya da çöp) *p programı çökertir.'],
  ['İşaretçiler', '& (adres alma)', 'Bir değişkenin bellekteki adresini verir.', 'int x;\nint *p = &x;\nliste_basina_ekle(20, &liste);', 'Fonksiyon liste başını değiştirecekse &liste gönderilir.', 'scanf\'te de & kullanılır: scanf("%d", &x).'],
  ['İşaretçiler', '** ve *** (işaretçiye işaretçi)', 'Bir işaretçinin adresini tutar. Fonksiyonun dışarıdaki işaretçiyi değiştirebilmesi için kullanılır.', 'void liste_basina_ekle(int anahtar, struct dugum **liste_basi){\n    ...\n    *liste_basi = a;   // main\'deki liste değişir\n}', 'int **A matris, dinamik_matris_olustur(int ***dizi, ...) içinde *dizi = malloc(...) ile main\'deki A doldurulur.', 'Kural: değiştirmek istediğin değişkenin tipine bir * ekle. int* değişecekse int**, int** değişecekse int*** gönder.'],
  ['İşaretçiler', '-> (ok)', 'İşaretçinin gösterdiği yapının alanına ulaşır. a->anahtar, (*a).anahtar ile aynıdır.', 'a->anahtar = 10;\na->sonraki = NULL;\nkok->sol->anahtar', 'Liste ve ağaç kodlarının tamamı -> ile yazılmış.', 'Yapının kendisi için nokta (.), yapının adresi için ok (->) kullanılır.'],
  ['İşaretçiler', '. (nokta)', 'Yapı değişkeninin alanına ulaşır.', 'heap->dizi[i].key', 'Heap kodunda dizi elemanları yapı olduğu için .key ile anahtara ulaşılıyor.', 'heap bir işaretçi olduğu için heap->dizi, dizi[i] ise yapı olduğu için .key.'],
  ['İşaretçiler', 'NULL', 'Hiçbir yeri göstermeyen işaretçi. Liste sonunu ve boş ağacı gösterir.', 'a->sonraki = NULL;\nif(kok == NULL) return;', 'Listenin son düğümünün sonraki\'si NULL, boş liste liste_basi == NULL.', 'NULL olan bir işaretçide -> kullanmak programı çökertir; önce kontrol et.'],
  ['İşaretçiler', 'İşaretçi aritmetiği', 'İşaretçiye 1 eklemek, gösterdiği tipin boyutu kadar ilerlemek demektir.', 'int *p = dizi;\n*(p + 2)        // dizi[2]\n*(A + i*sutun + j)  // A[i][j]', 'Matris fonksiyonları 2B diziyi int* olarak alıp *(A+i*A_sutun+k) ile geziyor.', 'int için +1 = 4 byte ilerler, int (*)[4] için +1 = 16 byte (bir satır).'],
  ['İşaretçiler', 'Dizi ismi', 'Dizinin ismi ilk elemanın adresini tutan sabit işaretçidir.', 'int A[6];\nint *p = A;     // &A[0] ile aynı\nA = A + 1;      // HATA: değiştirilemez', 'tek_boyutlu_dizi_yaz(A, 6) çağrısında A, ilk elemanın adresi olarak gider.', 'Fonksiyona dizi gönderince kopyası değil adresi gider; fonksiyon diziyi değiştirebilir.'],
  ['İşaretçiler', 'int (*p)[4]', '4 elemanlı bir satırı gösteren işaretçi. 2B dizilerin parametre tipi.', 'void yaz2(int (*dizi)[4], int uzunluk)\n// erişim: *(*(dizi+i)+j)  ==  dizi[i][j]', 'iki_boyutlu_dizi_yaz2(B, 3) ile int B[3][4] gönderiliyor.', 'int *p[4] farklıdır: 4 tane int işaretçisinden oluşan dizi.'],

  ['Bellek', 'malloc', 'Heap\'ten istenen byte kadar yer ayırır, başlangıç adresini döndürür. Yer yoksa NULL döner.', 'struct dugum *a;\na = (struct dugum*)malloc(sizeof(struct dugum));\nif(a == NULL){ printf("yer yok"); exit(1); }', 'Her yeni düğüm dugum_olustur içinde malloc ile yaratılıyor. Dinamik dizi: malloc(sizeof(int) * eleman_sayisi).', 'Dönen void* adres (struct dugum*) gibi istenen tipe çevrilir. Ayrılan yer fonksiyon bitince kaybolmaz; free edene kadar durur.'],
  ['Bellek', 'free', 'malloc ile ayrılan yeri heap\'e geri verir.', 'free(temp);\nfree((*matris)[i]);\nfree(*matris);', 'Silinen her düğüm free ile geri veriliyor. 2B matriste önce satırlar, sonra satır işaretçileri dizisi.', 'free ettiğin belleğe bir daha dokunma. Ders kodundaki liste_yok_et tam bu hatayı yapıyor.'],
  ['Bellek', 'sizeof', 'Bir tipin ya da değişkenin kaç byte olduğunu verir.', 'sizeof(int)            // genelde 4\nsizeof(struct dugum)   // alanların toplamı\nsizeof(int*)           // 64-bit\'te 8', 'malloc(kapasite*sizeof(int)), malloc(sizeof(struct dugum)).', 'dinamik_matris_olustur2 içinde sizeof(int) yerine yanlışlıkla sizeof(int*) yazılmış.'],
  ['Bellek', 'realloc', 'Daha önce ayrılan bloğu büyütür ya da küçültür, gerekirse yeni yere taşır.', 'y->dizi = (int*)realloc(y->dizi, 2*y->kapasite*sizeof(int));', 'Statik yığın dolunca kapasiteyi_artir_yeni dizi alanını iki katına çıkarıyor.', 'realloc yeni adres döndürebilir; eski adresi kullanmaya devam etme.'],
  ['Bellek', 'Stack ve heap', 'Yerel değişkenler ve parametreler stack\'te durur, fonksiyon bitince silinir. malloc ile alınanlar heap\'te durur, free edilene kadar yaşar.', 'int **A;              // stack: 8 byte\nA = malloc(...);      // gösterdiği yer: heap', 'Vize sorusu: 10×15 int matris, int 4 ve işaretçi 8 byte ise 8 + 10·8 + 10·15·4 = 688 byte.', 'Yerel değişkenin adresini fonksiyondan döndürmek hatadır; fonksiyon bitince o yer geçersiz olur.'],
  ['Bellek', 'exit(1)', 'Programı hemen bitirir. 1 hata ile bittiğini söyler.', 'if(a == NULL){ printf("Heap alaninda yer ayrilamadi"); exit(1); }', 'malloc başarısız olursa bütün kodlar exit(1) ile çıkıyor.', 'return sadece fonksiyondan çıkar, exit bütün programı bitirir.'],

  ['Yapılar', 'struct', 'Farklı tipte alanları tek bir kayıtta toplar.', 'struct dugum{\n    int anahtar;\n    struct dugum *sonraki;\n};', 'Liste düğümü: anahtar + sonraki. Ağaç düğümü: anahtar + sol + sag. Heap: dizi + kapasite + eleman_sayisi.', 'Tanımın sonunda }; noktalı virgül şart.'],
  ['Yapılar', 'Kendini gösteren yapı', 'Bir yapının içinde kendi tipinden bir işaretçi olabilir. Bağlı yapıların temeli budur.', 'struct dugum *sonraki;   // bir sonraki düğüm\nstruct agac_dugum *sol, *sag;', 'Liste, yığın ve ağaç kodlarının hepsi bu fikre dayanıyor.', 'İçinde kendisi değil, kendisinin adresi olabilir (sonsuz büyük olurdu).'],

  ['Akış', 'if / else', 'Koşul doğruysa ilk bloğu, değilse else bloğunu çalıştırır.', 'if(*liste_basi == NULL) *liste_basi = a;\nelse x->sonraki = a;', 'Boş liste ve dolu liste durumları hep if/else ile ayrılıyor.', 'Tek satırlık blokta süslü parantez şart değil ama karışmasın diye koymak iyi.'],
  ['Akış', 'while', 'Koşul doğru olduğu sürece tekrar eder.', 'while(x->sonraki != NULL)\n    x = x->sonraki;', 'Listede sona yürümek, ağaçta aşağı inmek while ile yapılıyor.', 'Koşulu hiç bozulmayan while sonsuza kadar döner.'],
  ['Akış', 'for', 'Sayaçlı tekrar: başlangıç; koşul; artış.', 'for(i = 0; i < eleman_sayisi; i++)\n    printf("%4d", A[i]);', 'Dizi, matris ve heap kodları for ile geziyor. Matris çarpımı iç içe 3 for.', 'Dizi indeksi 0\'dan başlar, son eleman n-1.'],
  ['Akış', 'break / continue / return', 'break döngüden çıkar, continue döngünün sıradaki turuna geçer, return fonksiyondan çıkar (değer döndürebilir).', 'if(large_key < heap->dizi[index].key) break;\nif(b->anahtar == anahtar) return;', 'buble_down heap özelliği sağlanınca break ile duruyor. Sıralı eklemede aynı anahtar varsa return.', 'void fonksiyonda return; değer almadan çıkar.'],
  ['Akış', '&& ve || (kısa devre)', '&& ilk koşul yanlışsa ikinciye bakmaz; || ilk koşul doğruysa ikinciye bakmaz.', 'while(temp != NULL && temp->anahtar != anahtar)', 'Önce temp != NULL kontrol edildiği için temp->anahtar asla NULL üzerinde çalışmaz.', 'Sırayı ters yazarsan (önce temp->anahtar) NULL\'da program çöker.'],

  ['Fonksiyonlar', 'Değerle ve adresle gönderme', 'C\'de parametreler kopyalanarak gider. Fonksiyon kopyayı değiştirse dışarıdaki değişmez; dışarıyı değiştirmek için adres gönderilir.', 'void yaz(struct dugum *bas)     // listeyi okur\nvoid ekle(..., struct dugum **bas) // liste başını değiştirir', 'liste_yaz tek *, liste_basina_ekle çift ** alıyor.', 'Liste başı değişebilecekse ** gönder.'],
  ['Fonksiyonlar', 'Özyineleme (recursion)', 'Fonksiyonun kendini daha küçük problemle çağırması. Mutlaka bir durma koşulu olmalı.', 'int dugum_sayisi(struct agac_dugum *kok){\n    if(kok == NULL) return 0;\n    return 1 + dugum_sayisi(kok->sol) + dugum_sayisi(kok->sag);\n}', 'Ağaç dolaşımları, düğüm/yaprak sayma, yoket hep özyinelemeli.', 'printf çağrıdan önceyse düz, sonraysa ters sırada yazar (tersten_liste_yaz_recursive).'],
  ['Fonksiyonlar', 'Prototip ve .h dosyası', 'Fonksiyonun gövdesi yazılmadan önce adı ve parametreleri duyurulur.', 'void kapasiteyi_artir(struct yigin**, int);', 'BST projesinde bütün prototipler ikiliAramaAgaci.h içinde.', 'Prototip ; ile biter, tanımda gövde { } gelir.'],

  ['Diğer', 'rand / srand / time', 'rand() rastgele sayı üretir; srand(time(NULL)) her çalıştırmada farklı sayılar gelsin diye başlangıç değerini saate bağlar.', 'srand(time(NULL));\nx = rand() % 10;   // 0..9', 'Dinamik matrisler rand()%2 ile 0/1 dolduruluyor.', '% (mod) bölümden kalan: rand()%10 her zaman 0–9 arası.'],
  ['Diğer', 'Yorum satırı', 'Derleyicinin görmezden geldiği açıklamalar.', '// tek satır\n/* birden\n   çok satır */', 'Hocanın kodlarında denenen alternatifler yorum satırına alınmış (ör. sağın en solu ile silme).', 'Yorum içindeki kod çalışmaz.'],
  ['Diğer', 'va_list (değişken sayıda argüman)', 'Fonksiyonun 1 ya da 2 argümanla çağrılabilmesini sağlar.', '#include <stdarg.h>\nint f(int arg_count, ...){\n    va_list ap; va_start(ap, arg_count);\n    kok = va_arg(ap, struct agac_dugum*);\n}', 'ikili_arama_agaci_mi_yeni(1, kok) ve (2, kok, node) şeklinde çağrılıyor.', 'Sınavda beklenmez; yardımcı fonksiyonlu sürümü bilmen yeter.']
];

// dosya: id, hafta, başlık, yol, genel açıklama, fonksiyonlar {ad: [ne yapar, [adımlar], dikkat]}, çıktı
window.VY_KOD = [
 {id:'h1-dizi', week:1, title:'Diziler ve işaretçiler', path:'hafta-1-dizi/main.c', anim:['a-malloc1'],
  intro:'1, 2 ve 3 boyutlu dizilerin bellekte nasıl durduğunu ve fonksiyonlara nasıl gönderildiğini gösterir. Aynı diziyi farklı işaretçi tipleriyle yazdıran fonksiyonlar var. main en sonda C dizisinin her elemanının adresini basar; adreslerin 4\'er byte arttığını görürsün.',
  fns:{
   'tek_boyutlu_dizi_yaz':['Tek boyutlu diziyi yazdırır.', ['Dizi, ilk elemanının adresi olarak (int *dizi) gelir.', '*(dizi+i) i. elemandır, dizi[i] ile aynı.'], 'Fonksiyon dizinin boyunu bilemez, uzunluk ayrıca gönderilir.'],
   'iki_boyutlu_dizi_yaz1':['2B diziyi tek boyutlu gibi gezerek yazdırır.', ['Çağrı: iki_boyutlu_dizi_yaz1(&B[0][0], 3, 4). İlk elemanın adresi gider.', 'Satır öncelikli saklandığı için B[i][j] = *(dizi + i*uzunluk2 + j).'], 'Her boyutta matris için çalışan genel yöntem budur.'],
   'iki_boyutlu_dizi_yaz2':['2B diziyi "4 elemanlı satıra işaretçi" tipiyle alır.', ['Parametre int (*dizi)[4]; çağrı iki_boyutlu_dizi_yaz2(B, 3).', '*(dizi+i) i. satır, *(*(dizi+i)+j) o satırın j. elemanı.'], 'Sütun sayısı (4) tipin içinde sabit; başka sütun sayılı matris gönderilemez.'],
   'iki_boyutlu_dizi_yaz3':['Dizinin tamamına işaretçi alır: int (*dizi)[3][4].', ['Çağrı: iki_boyutlu_dizi_yaz3(&B).', '*dizi dizinin kendisi, (*dizi)[i][j] eleman.'], '&B, B ve &B[0][0] aynı adresi basar ama tipleri farklıdır.'],
   'uc_boyutlu_dizi_yaz1':['3B diziyi tek boyutlu gibi gezer.', ['Adres: dizi + i*M*N + j*N + k (M=3, N=4).'], 'Formül 2B formülün genişletilmiş hâli.'],
   'uc_boyutlu_dizi_yaz2':['3B diziyi int (*dizi)[3][4] ile alır.', ['*(*(*(dizi+i)+j)+k) = dizi[i][j][k].'], ''],
   'uc_boyutlu_dizi_yaz3':['3B dizinin tamamına işaretçi alır.', ['Parametre int (*dizi)[2][3][4], çağrı &C.'], ''],
   'uc_boyutlu_dizi_yaz4':['3B diziyi satır işaretçisi int (*dizi)[4] gibi gezer.', ['Çağrı &C[0][0]; i*uzunluk2+j satırı, k sütunu seçer.'], ''],
   'foo':['Sadece verilen adresteki sayıyı yazan deneme fonksiyonu.', ['foo(*(B+1)+2) çağrısı B[1][2]\'nin adresini gönderir.'], ''],
   'main':['Dizileri tanımlar ve yazdırma fonksiyonlarını dener.', ['B[][4] tanımında ilk boyut boş bırakılabilir, derleyici sayar.', 'Son döngü C dizisinin her elemanının adresini %p ile basar.'], 'C[i] ile *(C+i) aynı adresi verir.']
  }},
 {id:'h2-statik', week:2, title:'Matris çarpımı (statik)', path:'hafta-2-matris-statik/main.c', anim:['a-matris'],
  intro:'Sabit boyutlu dizilerle eleman eleman çarpım ve matris çarpımı yapar. Aynı matris çarpımı iki farklı parametre tipiyle yazılmış.',
  fns:{
   'dot_carpim':['İki diziyi eleman eleman çarpıp üçüncü diziye yazar.', ['C[i] = A[i] * B[i].', 'x={3,4,0,6,1}, y={2,-1,4,-2,3} → z={6,-4,0,-12,3}.'], 'Adı "dot" ama toplama yapmıyor, sadece eleman eleman çarpım.'],
   'tek_boyutlu_dizi_yaz':['Diziyi %4d ile yan yana yazar.', [], ''],
   'matris_carpimi':['A (A_satir×A_sutun) ile B\'yi çarpıp C\'ye yazar. Matrisler int* olarak gelir.', ['Önce boyut kontrolü: A_sutun == B_satir olmalı, C de A_satir × B_sutun olmalı.', 'i satır, j sütun için C[i][j] sıfırlanır.', 'k döngüsü A[i][k]*B[k][j] çarpımlarını toplar.', 'Adresler: *(A+i*A_sutun+k), *(B+k*B_sutun+j), *(C+i*C_sutun+j).'], 'Üç iç içe döngü: O(m·n·p).'],
   'matris_carpimi1':['Aynı çarpım, parametreler int A[][3], int B[][2] gibi sabit sütunlu.', ['C[i][j] = *(*(C+i)+j) yazımı da kullanılıyor.'], 'Sadece 3 sütunlu A ve 2 sütunlu B ile çalışır.'],
   'matris_yazA':['3 sütunlu matrisi yazar.', [], ''],
   'matris_yazB':['2 sütunlu matrisi yazar.', [], ''],
   'matris_yaz_genel':['Her boyutta matrisi int* olarak alıp yazar.', ['Eleman: *(dizi + i*sutun_sayisi + j).'], ''],
   'main':['x, y dizileri ve 4×3 A, 3×2 B matrisleriyle fonksiyonları dener.', ['Çıktı: C = A·B = {{6,3},{14,10},{2,9},{13,11}}.'], 'Çağrıda &A[0][0] gönderilir.']
  }},
 {id:'h2-dinamik', week:2, title:'Matris çarpımı (dinamik)', path:'hafta-2-matris-dinamik/main.c', anim:['a-malloc1','a-malloc2','a-matris'],
  intro:'Dizileri ve matrisleri çalışırken malloc ile heap\'te oluşturur. İki yol var: satır satır ayrılan int** matris ve tek blok int* matris.',
  fns:{
   'tek_boyutlu_dizi_olustur':['Heap\'te n elemanlı dizi açar ve rastgele doldurur.', ['main\'deki int *dizi değişecek, bu yüzden adresi (int **dizi) gelir.', '*dizi = malloc(sizeof(int)*n): main\'deki işaretçiye yeni bloğun adresi yazılır.', '(*dizi)[i] = rand()%10 ile doldurulur.'], 'Çağrı: tek_boyutlu_dizi_olustur(&dizi, 10).'],
   'tek_boyutlu_dizi_yaz':['Önce elemanların adreslerini, sonra değerlerini yazar.', ['Adresler 4\'er byte artar.'], ''],
   'matris_degistir':['int** matrisin elemanlarını 0/1 ile yeniden doldurur.', [], ''],
   'dinamik_matris_olustur1':['satir×sutun matrisi satır satır oluşturur (int**).', ['*dizi = malloc(satir*sizeof(int*)): satır işaretçileri dizisi.', 'Her satır için (*dizi)[i] = malloc(sutun*sizeof(int)).', 'Elemanlar (*dizi)[i][j] ile doldurulur.'], 'Bellek: işaretçi + satir·işaretçi + satir·sutun·int. Çağrı &A.'],
   'dinamik_matris_yaz1':['int** matrisi dizi[i][j] ile yazar.', [], ''],
   'dinamik_matris_carpimi1':['int** matrislerle çarpım.', ['Aynı 3 döngü, erişim C[i][j] = C[i][j] + A[i][k]*B[k][j].'], ''],
   'dinamik_matris_olustur2':['Matrisi tek parça blok olarak oluşturur (int*).', ['*dizi = malloc(satir*sutun*...) tek blok.', 'Eleman (*dizi)[i] doğrusal sırada.'], 'Kodda sizeof(int*) yazılmış; doğrusu sizeof(int). 64-bit\'te iki kat yer ayırır.'],
   'dinamik_matris_yaz2':['Tek blok matrisi dizi[i*sutun+j] ile yazar.', [], ''],
   'dinamik_matris_carpimi2':['Tek blok matrislerle çarpım.', ['C[i*C_sutun+j] += A[i*A_sutun+k] * B[k*B_sutun+j].'], ''],
   'foo':['Boş deneme fonksiyonu.', [], ''],
   'dizi_kopyala':['Statik diziyi heap\'te yeni bir diziye kopyalar.', ['*dinamik_dizi = malloc(...), NULL ise exit(1).', 'Uzunluk da adresle gönderildiği için *dinamik_dizi_uzunlugu ile dışarı yazılır.'], ''],
   'main':['Dinamik dizi ve iki tür dinamik matrisi oluşturup çarpar.', ['A 5×6, B 6×7, C 5×7.', 'Sondaki printf &X, X, &X[0], &X[0][0], &X[0][0][0] için aynı adresi basar.'], 'srand(time(NULL)) her çalıştırmada farklı sayılar verir.']
  }},
 {id:'h3-liste', week:3, title:'Tek yönlü bağlı liste', path:'hafta-3-liste/main.c', anim:['a-basa','a-sona','a-sirali','a-sil','a-ters','a-sondaki'],
  intro:'Vizede her yıl soru çıkan dosya. Düğüm oluşturma, başa, sona ve sıralı ekleme, silme, sıralama, ters çevirme ve özel sorular (ardışık mı, küçükleri sil) var.',
  fns:{
   'struct dugum':['Liste düğümü: bir anahtar ve sonraki düğümün adresi.', ['anahtar: düğümde tutulan sayı.', 'sonraki: bir sonraki düğümün adresi, son düğümde NULL.'], ''],
   'dugum_olustur':['Heap\'te yeni bir düğüm açar ve adresini döndürür.', ['malloc(sizeof(struct dugum)) ile yer ayrılır.', 'Yer yoksa (NULL) program biter.', 'anahtar yazılır, sonraki NULL yapılır, adres return edilir.'], 'Fonksiyon bitse de düğüm heap\'te durur.'],
   'liste_basina_ekle':['Yeni düğümü listenin en başına koyar. O(1).', ['Yeni düğüm oluşturulur (a).', 'a->sonraki = *liste_basi: yeni düğüm eski ilk düğümü gösterir.', '*liste_basi = a: liste başı artık yeni düğüm.'], 'Liste başı değiştiği için ** ile gelir. İki satırın sırası ters olursa liste kaybolur.'],
   'liste_sonuna_ekle':['Yeni düğümü listenin sonuna koyar. O(n).', ['Liste boşsa yeni düğüm liste başı olur.', 'Değilse x ile son düğüme kadar yürünür (x->sonraki != NULL).', 'x->sonraki = a ile sona bağlanır.'], 'Boş liste durumunda liste başı değiştiği için ** gerekir.'],
   'liste_yaz':['Listeyi baştan sona yazar.', ['liste_basi kopya olduğu için ilerletmek main\'deki listeyi bozmaz.'], ''],
   'liste_yaz_recursive':['Listeyi özyinelemeli yazar: önce düğümü yaz, sonra kalanını.', [], ''],
   'tersten_liste_yaz_recursive':['Listeyi sondan başa yazar.', ['Önce kalan liste yazdırılır (özyineleme), dönüşte düğüm yazılır.'], 'printf çağrıdan sonra olduğu için ters sıra çıkar.'],
   'liste_yok_et':['Bütün düğümleri free etmeye çalışır.', ['Döngü: free(*liste_basi), sonra *liste_basi = (*liste_basi)->sonraki.'], 'HATA: önce free edip sonra o düğümün sonraki\'sini okuyor. Doğrusu: temp = baş; baş = baş->sonraki; free(temp).'],
   'liste_sirali_ekle':['Sıralı listeye sırayı bozmadan ekler.', ['b ile ilerlenir, a hep b\'nin bir öncesini tutar.', 'b->anahtar <= anahtar olduğu sürece devam; eşit anahtar varsa ekleme yapılmaz.', 'b hâlâ liste başıysa yeni düğüm başa eklenir.', 'Değilse a ile b arasına girer: a->sonraki = eklenen; eklenen->sonraki = b.'], 'Boş listede de çalışır (b NULL, b == *liste_basi).'],
   'liste_eleman_sil':['Anahtarı verilen düğümü siler.', ['temp aranan düğümü, once onun öncesini tutar.', 'Bulunamazsa çıkılır.', 'İlk düğümse liste başı bir ileri kayar; değilse once->sonraki = temp->sonraki.', 'free(temp).'], 'Arama yüzünden O(n).'],
   'liste_sirala':['Listeyi eklemeli sıralama (insertion sort) ile sıralar.', ['İlk düğüm tek başına sıralı liste olur, kalanlar d ile gezilir.', 'Her düğüm (c) sıralı kısımda doğru yere yerleştirilir.'], 'O(n²).'],
   'liste_ters_cevir':['Bağları çevirerek listeyi ters çevirir.', ['a çevrilmiş kısmı tutar (başta NULL).', 'b sıradaki düğüm; liste başı bir ileri kayar; b->sonraki = a; a = b.', 'Döngü bitince liste başı a olur.'], 'Yeni düğüm oluşturulmaz, sadece okların yönü değişir.'],
   'ardisik_mi':['anahtar1 ve anahtar2 yan yana mı diye bakar.', ['anahtar1 bulunur, önceki düğüm de tutulur.', 'Öncekinin ya da sonrakinin anahtarı anahtar2 ise 1 döner.'], ''],
   'listeden_cikar':['Anahtarı verilen değerden küçük bütün düğümleri siler.', ['Baştaki küçükler silinirken liste başı ilerler.', 'Ortadakiler a->sonraki = b->sonraki ile atlanıp free edilir.'], 'Örnek: 10 20 30 40 80 200 ve 41 → 80 200.'],
   'fonk':['İki dizinin toplamını heap\'te yeni diziye yazar.', [], ''],
   'main':['Başa ekleme, sıralama, silme ve küçükleri çıkarmayı dener.', ['Başa 20,30,200,40,80,10 → 10 80 40 200 30 20.', 'Sıralama → 10 20 30 40 80 200. 10 silinir. 41\'den küçükler çıkarılır → 80 200.'], '']
  }},
 {id:'h3-cift', week:3, title:'Çift yönlü bağlı liste', path:'hafta-3-cift-yonlu-liste/main.c', anim:['a-cift'],
  intro:'Her düğümde iki işaretçi var: ileri ve geri. Listenin başı ve sonu ayrı bir yapıda tutulduğu için sona ekleme O(1).',
  fns:{
   'struct dugum':['Düğüm: anahtar, ileri (sonraki) ve geri (önceki).', [], ''],
   'struct ciftYonluListe':['Listenin ilk (bas) ve son (son) düğümünü tutan yapı.', [], ''],
   'dugumOlustur':['Heap\'te düğüm açar, ileri ve geri NULL.', [], ''],
   'ciftYonluListeBaslat':['bas ve son\'u tutan yapıyı heap\'te açar, ikisini de NULL yapar.', ['main\'deki liste işaretçisi değişeceği için ** ile gelir.'], ''],
   'liste_basina_ekle':['Başa ekler.', ['Liste boşsa yeni düğüm aynı zamanda son olur.', 'Değilse eski baş->geri = yeni, yeni->ileri = eski baş.', 'bas = yeni.'], ''],
   'liste_sonuna_ekle':['Sona ekler, yürümeye gerek yok.', ['Liste boşsa yeni düğüm aynı zamanda baş olur.', 'Değilse son->ileri = yeni, yeni->geri = son.', 'son = yeni.'], 'O(1), çünkü son düğüm biliniyor.'],
   'liste_yazdir':['bas\'tan ileri doğru yazar.', [], ''],
   'liste_yazdir_yanlis':['Yanlış yöntemi gösteren (yorumda) fonksiyon.', ['liste->bas ilerletilirse listenin başı kaybolur.'], 'Dolaşırken yerel kopya kullan.'],
   'liste_yazdir_sondan':['son\'dan geri doğru yazar.', [], ''],
   'liste_yok_et':['Düğümleri tek tek free eder, sonra liste yapısını free edip NULL yapar.', ['Önce a = bas, bas ilerler, sonra free(a): doğru sıra.'], ''],
   'main':['Ekleme ve iki yönlü yazdırmayı dener.', ['Başa 40, sona 60, başa 90, sona 5, sona 15 → 90 40 60 5 15; sondan 15 5 60 40 90.'], '']
  }},
 {id:'h4-statik', week:4, title:'Yığın (dizi ile)', path:'hafta-4-yigin-statik/main.c', anim:['a-yigin'],
  intro:'Yığın son giren ilk çıkar (LIFO). Burada elemanlar bir dizide, en üstteki elemanın indeksi ust\'te tutuluyor. Dolunca dizi realloc ile büyütülüyor.',
  fns:{
   'struct yigin':['dizi: elemanlar, ust: en üstteki indeks, kapasite: en fazla eleman.', [], 'Boş yığında ust = -1.'],
   'yigin_olustur':['Yığın yapısını ve diziyi heap\'te açar, ust = -1.', ['Kapasite pozitif değilse program biter.'], 'Yeni yığının adresini döndürür.'],
   'yigin_olustur_parametre_ile':['Aynı işi adres parametresiyle yapar (struct yigin **y).', [], ''],
   'yigin_bosmu':['ust == -1 ise 1 döner.', [], ''],
   'yigin_dolumu':['ust == kapasite-1 ise 1 döner.', [], ''],
   'yigin_ekle':['Push: elemanı en üste koyar.', ['Doluysa kapasite 2 katına çıkarılır.', '(*y)->dizi[++(*y)->ust] = eleman: önce ust bir artar, sonra o yere yazılır.'], 'O(1).'],
   'yigin_yaz':['Kapasiteyi, eleman sayısını ve elemanları üstten alta yazar.', [], ''],
   'yigin_eleman_sil':['Pop: en üsttekini döndürür ve ust\'u bir azaltır.', ['Boşsa SENTINEL döner.', 'return y->dizi[y->ust--]: önce değer alınır, sonra ust azalır.'], 'Eleman diziden silinmez, sadece ust geriler.'],
   'yigin_yok_et':['Önce diziyi, sonra yapıyı free eder, işaretçiyi NULL yapar.', [], ''],
   'kapasiteyi_artir':['Büyük yeni yığın açıp elemanları kopyalar, eskisini yok eder.', [], ''],
   'kapasiteyi_artir_yeni':['realloc ile diziyi büyütür.', ['dizi = realloc(dizi, kackat*kapasite*sizeof(int)).'], 'Kapasite kackat yerine sabit 2 ile çarpılıyor; kackat 2 değilse yanlış olur.'],
   'main':['Kapasite 3 ile başlayıp 8 eleman ekler, sonra bir eleman siler.', ['Kapasite 3 → 6 → 12 olur. Sonda üstten: 89 25 -40 -10 5 40 10.'], '']
  }},
 {id:'h4-dinamik', week:4, title:'Yığın (bağlı liste ile)', path:'hafta-4-yigin-dinamik/main.c', anim:['a-yigin2'],
  intro:'Yığının bağlı liste hâli. Ekleme = başa ekleme, silme = baştan silme. Dolma derdi yok.',
  fns:{
   'struct dugum':['Liste düğümüyle aynı: anahtar + sonraki.', [], ''],
   'dugum_olustur':['Heap\'te düğüm açar.', [], ''],
   'ekle':['Push: başa ekleme.', ['d->sonraki = *yigin; *yigin = d.'], 'O(1).'],
   'yazdir':['Üstten alta yazar, boşsa "Yigin bos".', [], ''],
   'sil':['Pop: baştaki düğümü çıkarır, anahtarını döndürür.', ['Boşsa SENTINEL.', 'd = baş, baş ilerler, anahtar saklanır, free(d).'], 'Önce anahtarı al, sonra free et.'],
   'yigin_bosmu':['yigin == NULL ise 1.', [], ''],
   'yigini_yok_et':['Döngüyle bütün düğümleri free eder.', [], ''],
   'yigin_yok_et_recursive':['Özyinelemeli yok etme: önce kalanı yok et, dönüşte bu düğümü free et.', [], ''],
   'main':['100, 20, 60 eklenir (üstte 60), bir eleman çıkarılır (60).', [], '']
  }},
 {id:'h5-bst', week:5, title:'İkili arama ağacı', path:'hafta-5-ikili-arama-agaci/ikiliAramaAgaci.c', anim:['a-bst-ekle','a-bst-sil','a-dolasim'],
  intro:'BST\'nin bütün işlemleri: ekleme, üç dolaşım, düğüm ve yaprak sayma, silme, yok etme, en kısa yol, BST mi ve dengeli mi kontrolü.',
  fns:{
   'dugum_olustur':['Heap\'te ağaç düğümü açar, sol ve sag NULL.', [], ''],
   'ikili_agac_bosmu':['kok == NULL ise 1.', [], ''],
   'ekle':['Anahtarı doğru yere yaprak olarak ekler.', ['d kökten başlar, geri d\'nin ebeveynini tutar.', 'Küçükse sola, büyükse sağa inilir; eşitse eklenmez.', 'Ağaç boşsa yeni düğüm kök olur.', 'Değilse geri\'nin soluna ya da sağına bağlanır.'], 'O(h): dengeli ağaçta O(log n).'],
   'inorder_yardimci':['Sol alt ağaç, düğüm, sağ alt ağaç sırasıyla yazar.', [], 'BST\'de küçükten büyüğe sıralı çıkar.'],
   'inorder':['Ağaç boş değilse inorder yazar ve alt satıra geçer.', [], ''],
   'preorder_yardimci':['Önce düğüm, sonra sol, sonra sağ.', [], 'İlk yazılan kök.'],
   'preorder':['Preorder yazar.', [], ''],
   'postorder_yardimci':['Önce sol, sonra sağ, en son düğüm.', [], 'Son yazılan kök.'],
   'postorder':['Postorder yazar.', [], ''],
   'dugum_sayisi':['Düğüm sayısı = 1 + sol alt ağaç + sağ alt ağaç.', [], ''],
   'yaprak_sayisi':['İki çocuğu da NULL olan düğümleri sayar.', [], ''],
   'sil':['Anahtarı verilen düğümü siler.', ['Önce düğüm (d) ve ebeveyni (parent) bulunur; sol=1 d\'nin ebeveynin solunda olduğunu söyler.', 'Solu boşsa sağ çocuğu yerine geçer; sağı boşsa sol çocuğu.', 'İki çocuğu varsa sol alt ağacın en sağındaki düğüm (d1) yerine geçer.', 'Kök silindiyse *kok güncellenir. En sonda free(d).'], 'Yorum satırında sağ alt ağacın en solunu kullanan alternatif de var.'],
   'yoket':['Postorder sırayla bütün düğümleri free eder ve kökü NULL yapar.', [], ''],
   'ic_dugum_sayisi':['Yaprak olmayan düğümleri sayar.', [], ''],
   'en_kisa_yol_uzunlugu':['Kökten en yakın yaprağa kadar düğüm sayısı.', ['Tek çocuklu düğümde boş taraf yaprak değildir, büyük olan alınır.'], ''],
   'ikili_arama_agaci_yardimci':['Her düğümü kökten arar; arama o düğüme ulaşamıyorsa ağaç BST değildir.', [], ''],
   'ikili_arama_agaci_mi':['Yardımcıyı kökle başlatır.', [], ''],
   'ikili_arama_agaci_mi_yeni':['Aynı kontrol, değişken sayıda argümanla (va_list).', [], ''],
   'ikili_arama_agaci_dengeli_yardimci':['Her düğümde sol ve sağ yüksekliğin farkı en fazla 1 mi diye bakar.', ['Yükseklikleri negatif sayılarla taşır, 0 "dengesiz" demek.'], ''],
   'ikili_arama_agaci_dengeli_mi':['Dengeli ise 1, değilse 0.', [], '']
  }},
 {id:'h5-main', week:5, title:'BST denemeleri (main.c)', path:'hafta-5-ikili-arama-agaci/main.c', anim:['a-bst-max','a-invert'],
  intro:'BST fonksiyonlarını dener, ayrıca en büyüğü silme ve ağacı aynalama (invert) var.',
  fns:{
   'en_sondaki_dugumu_sil':['En büyük anahtarlı düğümü (en sağdaki) siler.', ['En sağa yürünür, b ebeveyni tutar.', 'Kökse kök sol çocuğa geçer, değilse b->sag = a->sol.'], '2023 vizesinde soruldu.'],
   'invert':['Ağacı aynalar: her düğümde sol ve sağ yer değiştirir.', [], '2023–24 finalinde "donustur" adıyla soruldu.'],
   'invert1':['Önce alt ağaçları çevirip sonra kökte yer değiştirir.', [], 'Sonuç yine ayna görüntüsü.'],
   'main':['50, 25, 100, 80, 30, 130, 39, 35 eklenir.', ['inorder 25 30 35 39 50 80 100 130, preorder 50 25 30 39 35 100 80 130, postorder 35 39 30 25 80 130 100 50.'], '']
  }},
 {id:'h5-iter', week:5, title:'Yığınla iteratif dolaşım', path:'hafta-5-iteratif-dolasim/ikiliAramaAgaci.c', anim:['a-iter'],
  intro:'Özyineleme yerine kendi yığınımızı kullanarak inorder, preorder ve postorder dolaşım. Yığın düğümleri ağaç düğümlerinin adresini tutar.',
  fns:{
   'iterative_inOrder':['Yığınla inorder.', ['current NULL değilse yığına at, sola in.', 'NULL ise yığından çıkar, yazdır, sağa geç.', 'Yığın da boşsa bitti.'], 'Vizede boşluk doldurma olarak soruldu.'],
   'iterative_preOrder':['Yığınla preorder.', ['Kökü at. Döngüde çıkar, yazdır, önce sağ sonra sol çocuğu at.'], 'Sol önce işlensin diye sağ önce atılır.'],
   'iterative_postOrder':['Yığınla postorder.', ['Sola inerken önce sağ çocuğu sonra düğümü at.', 'Çıkardığın düğümün sağ çocuğu yığının üstündeyse önce onu işle.'], '']
  }},
 {id:'h5-yigin', week:5, title:'Ağaç için yığın (yigin.c)', path:'hafta-5-iteratif-dolasim/yigin.c', anim:[],
  intro:'İteratif dolaşımın kullandığı yığın. Her yığın düğümü bir ağaç düğümünün adresini (veri) tutar.',
  fns:{
   'yigin_dugum_olustur':['Ağaç düğümü adresini tutan yığın düğümü açar.', [], ''],
   'yigin_ekle':['Push: başa ekleme.', [], ''],
   'yigin_cikar':['Pop: baştakini çıkarıp tuttuğu ağaç düğümünü döndürür.', [], ''],
   'yigin_bosmu':['Boşsa 1.', [], ''],
   'yigin_goz_at':['Peek: çıkarmadan üstteki ağaç düğümünü döndürür.', [], 'Postorder bunu kullanıyor.']
  }},
 {id:'h6-heap', week:6, title:'Heap ve heap sort', path:'hafta-6-heap/main.c', anim:['a-heap-ekle','a-heap-sil','a-heapify'],
  intro:'Max heap bir dizide tutulur: i\'nin çocukları 2i+1 ve 2i+2, ebeveyni (i-1)/2. Ekleme buble_up, en büyüğü silme ve heapify buble_down kullanır.',
  fns:{
   'struct dugum':['Heap elemanı: key (ve başka bilgiler eklenebilir).', [], ''],
   'struct heap':['dizi: elemanlar, kapasite: en fazla, eleman_sayisi: şu an kaç tane.', [], ''],
   'heap_olustur':['Heap yapısını ve kapasite kadar diziyi heap bellekte açar.', [], ''],
   'print_heap':['Diziyi sırayla yazar.', [], ''],
   'initialize_heap_data':['Diziyi birbirinden farklı rastgele anahtarlarla doldurur.', [], ''],
   'buble_down':['index\'teki elemanı büyük çocuğuyla yer değiştirerek aşağı indirir.', ['Sol çocuk 2i+1, sağ 2i+2.', 'Büyük çocuk seçilir.', 'Büyük çocuk ebeveynden küçükse durulur (break).', 'Değilse yer değiştirilir, index o çocuğa iner.'], 'O(log n).'],
   'heapify':['Diziyi max heap yapar.', ['i = n/2 - 1\'den (son iç düğüm) 0\'a kadar buble_down.'], 'O(n).'],
   'buble_up':['index\'teki elemanı ebeveyninden büyük oldukça yukarı çıkarır.', ['Ebeveyn (index-1)/2.', 'Kökte (0-1)/2 = 0 olur, a[0] < a[0] yanlış, döngü biter.'], ''],
   'delete_max':['En büyüğü (kök) siler.', ['Kök ile son eleman yer değiştirir.', 'eleman_sayisi bir azalır.', 'Kökten buble_down.'], 'Silinen eleman dizinin sonunda kalır; heap sort bunu kullanır.'],
   'heap_search':['Diziyi baştan sona arar.', [], 'Heap aramayı hızlandırmaz: O(n).'],
   'heap_insert':['Yeni anahtarı ekler.', ['Aynı anahtar varsa eklemez.', 'Sona koyar, eleman_sayisi artar, buble_up.'], 'O(log n) (arama hariç).'],
   'heap_sort':['n-1 kez delete_max yapıp diziyi küçükten büyüğe sıralar.', ['Sonunda eleman_sayisi eski değerine döner.'], 'O(n log n).'],
   'main':['812, 900, 12, 121, 989, 990, 12 eklenir, bir kez delete_max.', ['Heap: 990 900 989 121 812 12 (ikinci 12 eklenmez). delete_max sonrası: 989 900 12 121 812.'], 'Altta yorum satırında ağaçla (işaretçilerle) heap denemesi var.']
  }},
 {id:'h5-bst-h', week:5, title:'BST başlık dosyası (.h)', path:'hafta-5-ikili-arama-agaci/ikiliAramaAgaci.h', anim:[], extra:true,
  intro:'.h dosyası ağaç düğümünün yapısını ve bütün fonksiyonların prototiplerini tutar. .c dosyaları bunu #include "ikiliAramaAgaci.h" ile ekler. #ifndef, #define ve #endif aynı dosyanın iki kez eklenmesini önler.',
  fns:{
   'struct agac_dugum':['Ağaç düğümü: bir anahtar ve iki çocuğun adresi.', ['sol: anahtarı daha küçük olan alt ağacın kökü.', 'sag: anahtarı daha büyük olan alt ağacın kökü.', 'Yaprakta ikisi de NULL.'], 'Liste düğümünden tek farkı: bir sonraki yerine iki işaretçi (sol, sag).']
  }},
 {id:'h5-iter-h', week:5, title:'İteratif dolaşım başlık dosyası (.h)', path:'hafta-5-iteratif-dolasim/ikiliAramaAgaci.h', anim:[], extra:true,
  intro:'BST başlık dosyasının aynısı; sonuna üç iteratif dolaşımın prototipi eklenmiş.',
  fns:{
   'struct agac_dugum':['Ağaç düğümü: anahtar, sol ve sag.', [], '']
  }},
 {id:'h5-yigin-h', week:5, title:'Yığın başlık dosyası (yigin.h)', path:'hafta-5-iteratif-dolasim/yigin.h', anim:['a-iter'], extra:true,
  intro:'İteratif dolaşımın kullandığı yığının yapısı ve fonksiyon prototipleri.',
  fns:{
   'struct yigin_dugum':['Yığın düğümü: veri bir ağaç düğümünün adresi, link alttaki yığın düğümü.', ['veri sayı değil struct agac_dugum* tutar.', 'Böylece yığından çıkan düğümün sol ve sağ çocuğuna gidilebilir.'], 'Liste düğümündeki "sonraki" burada "link" adını almış.']
  }},
 {id:'h5-iter-main', week:5, title:'İteratif dolaşım denemesi (main.c)', path:'hafta-5-iteratif-dolasim/main.c', anim:['a-iter'], extra:true,
  intro:'Ağacı kurup üç iteratif dolaşımı yazdırır.',
  fns:{
   'main':['50, 25, 100, 80, 78, 130, 39, 35, 11 eklenir, üç dolaşım yazdırılır.', ['inorder: 11 25 35 39 50 78 80 100 130', 'preorder: 50 25 11 39 35 100 80 78 130', 'postorder: 11 35 39 25 78 80 130 100 50'], 'Çıktılar özyinelemeli dolaşımla aynı olmalı.']
  }}
];
