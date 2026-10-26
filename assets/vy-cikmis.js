// Veri Yapıları: çıkmış sınavlar, soru soru. Her soruda metin, verilen kod, ipucu, çözüm adımları, cevap ve gerekiyorsa çizim var.
// soru: {n, p (puan), t (hafta görünümü), q (metin), qc (verilen kod), tip, st [adımlar], ac (cevap kodu), at (cevap metni),
//        draw [{cap, heap:[...]} | {cap, bst:[...]} | {cap, tree:[k, sol, sağ]}], anim, out (final konusu), subs [aynı alanlarla şıklar]}
(function(){
  var L = function(){ return Array.prototype.join.call(arguments, '\n'); };
  var LISTE = L('struct dugum{', '    int anahtar;', '    struct dugum *sonraki;', '};');
  var AGAC = L('struct dugum {', '    int anahtar;', '    struct dugum *sol, *sag;', '};');
  var AGAC_LINK = L('struct dugum {', '    int anahtar;', '    struct dugum *sol_link, *sag_link;', '};');
  var HASH = L('struct cell {', '    char *anahtar;', '    struct cell *next;', '};', 'struct table_node{', '    int count;', '    struct cell *header;', '};', 'struct hash_tablosu{', '    struct table_node *tablo_basi;', '    int tablo_uzunlugu;', '    int multiplier;', '};');
  var FINAL = 'Final konusu, vize kapsamında değil.';

  // ortak cevaplar
  var A_DENGE = 'Her düğümde sol ve sağ alt ağacın yükseklik farkı en fazla 1 ise ağaç dengelidir. (|h(sol) − h(sağ)| ≤ 1, her düğüm için.)';
  var A_BST_EKLE = 'O(h), h ağacın yüksekliği. Dengeli ağaçta O(log n), en kötü durumda (sıralı eklemeyle zincire dönmüş ağaçta) O(n).';
  var A_HEAPIFY_O = 'O(n).';
  var KARDES = L(
    'int iki_dugum_kardes_mi(struct dugum *kok, int anahtar1, int anahtar2){',
    '    int k = anahtar1 < anahtar2 ? anahtar1 : anahtar2;   // küçük',
    '    int b = anahtar1 < anahtar2 ? anahtar2 : anahtar1;   // büyük',
    '    while(kok != NULL){',
    '        if(b < kok->anahtar) kok = kok->sol;          // ikisi de solda',
    '        else if(k > kok->anahtar) kok = kok->sag;     // ikisi de sağda',
    '        else                                          // yollar ayrıldı: ortak ebeveyn ancak bu olabilir',
    '            return kok->sol != NULL && kok->sag != NULL &&',
    '                   kok->sol->anahtar == k && kok->sag->anahtar == b;',
    '    }',
    '    return 0;',
    '}');

  var EX = [
  {id:'v2425', kind:'Vize', title:'Vize 2024-2025', date:'15/11/2024', dur:90, pdf:'vize-2024-2025.pdf',
   qs:[
    {n:'1', p:25, t:'h3', q:'Bağlantılı liste için düğüm tanımlaması aşağıda verilmektedir. Buna göre listenin en sonundaki düğüm ile en baştaki düğümü yer değiştiren (listenin başındaki düğüm listenin sonunda, listenin sonundaki düğüm ise listenin başında olacak şekilde) ve tanımlaması aşağıdaki gibi olan fonksiyonu yazınız.',
     qc: LISTE + '\n\nvoid en_sondaki_dugumu_sil(struct dugum **liste_basi){',
     note:'Kâğıtta fonksiyonun adı yanlışlıkla en_sondaki_dugumu_sil kalmış (bir önceki yılın sorusundan). İstenen iş yer değiştirme.',
     tip:'Değerleri değil düğümleri taşı. Son düğümü ve onun bir öncesini bul. Boş, tek düğümlü ve iki düğümlü listeyi ayrı düşün.',
     st:['0 ya da 1 düğüm varsa yapılacak bir şey yok, çık.', 'ilk = *liste_basi. son\'a kadar yürü; once hep son\'un bir öncesini tutsun.', 'Sadece iki düğüm varsa (once == ilk): son->sonraki = ilk.', 'Daha fazla düğüm varsa: son->sonraki = ilk->sonraki (son, ilk\'in yerine geçer) ve once->sonraki = ilk (ilk sona geçer).', 'ilk->sonraki = NULL ve *liste_basi = son.'],
     ac: L('void en_sondaki_dugumu_sil(struct dugum **liste_basi){   // aslında: ilk ve sonu yer değiştir',
       '    struct dugum *ilk, *son, *once = NULL;',
       '    if(*liste_basi == NULL || (*liste_basi)->sonraki == NULL) return;  // 0 veya 1 düğüm',
       '    ilk = *liste_basi;',
       '    son = ilk;',
       '    while(son->sonraki != NULL){ once = son; son = son->sonraki; }',
       '    if(once == ilk){                 // sadece 2 düğüm',
       '        son->sonraki = ilk;',
       '    } else {',
       '        son->sonraki = ilk->sonraki; // son, ilk\'in yerine geçer',
       '        once->sonraki = ilk;         // ilk, sona geçer',
       '    }',
       '    ilk->sonraki = NULL;',
       '    *liste_basi = son;',
       '}'),
     at:'Örnek: 1→2→3→4 olur 4→2→3→1. İki düğümlü durumu ayrı ele almazsan son→ilk→son döngüsü oluşur ve liste sonsuza kadar döner.'},
    {n:'2', p:25, t:'h5', q:'İkili arama ağacının düğüm tanımlaması aşağıda verilmektedir. Buna göre anahtarları verilen iki düğüm arasında kardeş ilişkisi olup olmadığını belirleyen ve tanımlaması aşağıda verilen fonksiyonu yazınız. Eğer ilgili düğümler birbirinin kardeşi ise fonksiyon geriye 1, aksi durumda 0 döndürmelidir.',
     qc: AGAC + '\n\nint iki_dugum_kardes_mi(struct dugum *kok, int anahtar1, int anahtar2){',
     tip:'Kardeşler aynı ebeveynin sol ve sağ çocuğudur. BST\'de küçük olan solda, büyük olan sağda olmak zorunda. İkisinin yolunun ayrıldığı düğüm, ortak ebeveyn olabilecek tek düğüm.',
     st:['Anahtarları küçük (k) ve büyük (b) diye sırala.', 'Kökten in: b bile düğümden küçükse ikisi de solda, sola git; k bile büyükse ikisi de sağda, sağa git.', 'Yollar ayrıldığında o düğümün sol çocuğu k ve sağ çocuğu b mi diye bak; öyleyse 1.', 'Ağaçtan düşersen 0.'],
     ac: KARDES,
     at:'O(h). BST özelliğini kullanmadan her düğümde (sol, sağ) çiftine bakan özyinelemeli çözüm de doğru kabul edilir.'},
    {n:'3', t:'h1', q:'Aşağıdaki soruları cevaplayınız.', subs:[
      {l:'a', p:5, t:'h5', q:'Dengeli ikili arama ağacı nedir, tek bir cümleyle ifade ediniz.', at:'Her düğümde sol ve sağ alt ağaçlarının yükseklik farkı en fazla 1 olan ikili arama ağacıdır.'},
      {l:'b', p:5, t:'h6', q:'Heap veri yapısı dengeli ikili arama ağacı mıdır? Evet ya da Hayır şeklinde cevaplayınız.', at:'Hayır. Heap dengeli (tam) bir ikili ağaçtır ama arama ağacı değildir: max heap\'te ebeveyn çocuklarından büyüktür, sol < kök < sağ sıralaması yoktur.'},
      {l:'c', p:5, q:'C programlama dilinde bir dizinin ismi ne anlama gelir, sadece bir cümle ile ifade ediniz.', at:'Dizinin ismi, dizinin ilk elemanının adresini tutan sabit bir işaretçidir.'},
      {l:'d', p:5, q:'int dizi[]={1,2,3,4,5,6}; tanımlamasına göre "dizi=dizi+1" ifadesinin doğru bir ifade olup olmadığının nedenini tek bir cümle ile ifade ediniz.', at:'Doğru değil: dizi ismi sabit (değiştirilemez) bir işaretçi olduğu için ona atama yapılamaz, derleyici hata verir. (int *p = dizi; p = p + 1; yazılabilir.)'},
      {l:'e', p:5, q:'Dizi elemanlarının tiplerinin aynı olmasının sebebini tek bir cümle ile açıklayınız.', at:'Elemanlar bellekte ardışık durur ve i. elemanın adresi taban + i · eleman_boyutu ile hesaplanır; bu hesabın çalışması için her elemanın aynı boyutta, yani aynı tipte olması gerekir.'}]},
    {n:'4', t:'h6', q:'Aşağıdaki soruları cevaplayınız.', subs:[
      {l:'a', p:5, t:'h5', q:'İkili arama ağacında düğüm ekleme işleminin karmaşıklığını O notasyonunda ifade ediniz.', at:A_BST_EKLE},
      {l:'b', p:5, t:'h5', q:'preorder sırada çıktısı verilen bir ikili arama ağacı çizilebilir mi? Cevabınızı Evet ya da Hayır şeklinde belirtiniz.', at:'Evet. Anahtarları preorder sırasıyla teker teker boş bir BST\'ye eklersen aynı ağaç oluşur (ilk eleman kök, ondan küçükler solda, büyükler sağda).'},
      {l:'c', p:5, q:'heapify algoritmasının karmaşıklığını O notasyonunda ifade ediniz.', at:A_HEAPIFY_O},
      {l:'d', p:10, q:'Elemanları {20, 5, 42, 80, 65, 70, 88, 12, 6, 4, 33, 90, 27} olan bir diziye heapify algoritmasını uyguladığımızda elde edilen heap\'in son hâlini ikili ağaç şeklinde çiziniz.',
       st:['n = 13, son iç düğüm 13/2 − 1 = 5. buble_down sırası: i = 5, 4, 3, 2, 1, 0.', 'i=5: 70\'in çocukları 90 ve 27; 90 büyük, yer değiştir. i=4: 65 > 4 ve 33, kalır. i=3: 80 > 12 ve 6, kalır.', 'i=2: 42\'nin çocukları 90 ve 88; 90 ile yer değiştir. Aşağıda 42 < 70, bir kez daha yer değiştir.', 'i=1: 5\'in çocukları 80 ve 65; 80 ile yer değiştir. Aşağıda 5 < 12, yer değiştir.', 'i=0: 20\'nin çocukları 80 ve 90; 90 ile yer değiştir. Aşağıda 20 < 88, yer değiştir; 20 yaprağa indi, dur.'],
       at:'Dizi: 90 80 88 12 65 70 20 5 6 4 33 42 27', draw:[{heap:[90,80,88,12,65,70,20,5,6,4,33,42,27]}], anim:'a-heapify'}]}
   ]},

  {id:'v2324', kind:'Vize', title:'Vize 2023-2024', date:'23/11/2023', dur:90, pdf:'vize-2023-2024.pdf',
   qs:[
    {n:'1', p:20, t:'h3', q:'Bağlantılı liste için düğüm tanımlaması aşağıda verilmektedir. Buna göre listenin en sonundaki düğümü silen ve tanımlaması aşağıda verilen fonksiyonu yazınız.',
     qc: LISTE + '\n\nvoid en_sondaki_dugumu_sil(struct dugum **liste_basi){',
     tip:'Son düğümü silmek için bir öncekine ulaşman lazım (onun sonraki\'si NULL olacak). Üç durum: boş liste, tek düğüm, çok düğüm.',
     st:['Liste boşsa çık.', 'a ile son düğüme kadar yürü; once bir öncekini tutsun.', 'once NULL kaldıysa tek düğüm vardı: *liste_basi = NULL.', 'Değilse once->sonraki = NULL.', 'free(a).'],
     ac: L('void en_sondaki_dugumu_sil(struct dugum **liste_basi){',
       '    struct dugum *a, *once = NULL;',
       '    if(*liste_basi == NULL) return;              // boş liste',
       '    a = *liste_basi;',
       '    while(a->sonraki != NULL){ once = a; a = a->sonraki; }',
       '    if(once == NULL) *liste_basi = NULL;         // tek düğüm vardı',
       '    else once->sonraki = NULL;',
       '    free(a);',
       '}'),
     at:'Puanı genelde tek düğüm durumu götürüyor: once NULL kalır ve liste başı da NULL yapılmalı.', anim:'a-sondaki'},
    {n:'2', p:20, t:'h5', q:'İkili arama ağacının düğüm tanımlaması aşağıda verilmektedir. Buna göre ikili arama ağacında en büyük anahtara sahip düğümü silen ve tanımlaması aşağıda verilen fonksiyonu yazınız.',
     qc: AGAC + '\n\nvoid en_buyuk_anahtara_sahip_dugumu_sil(struct dugum **kok){',
     tip:'En büyük anahtar en sağdaki düğümde. O düğümün sağ çocuğu olamaz; sadece sol alt ağacı olabilir.',
     st:['Ağaç boşsa çık.', 'a ile en sağa in, b ebeveyni tutsun.', 'En büyük kökün kendisiyse (b NULL): *kok = a->sol.', 'Değilse b->sag = a->sol.', 'free(a).'],
     ac: L('void en_buyuk_anahtara_sahip_dugumu_sil(struct dugum **kok){',
       '    struct dugum *a, *b = NULL;',
       '    if(*kok == NULL) return;',
       '    a = *kok;',
       '    while(a->sag != NULL){ b = a; a = a->sag; }   // en sağdaki = en büyük',
       '    if(b == NULL) *kok = a->sol;                   // en büyük kökmüş',
       '    else b->sag = a->sol;                          // sağı yok; solunu ebeveyne bağla',
       '    free(a);',
       '}'),
     at:'Hocanın Hafta 5 main.c\'sindeki en_sondaki_dugumu_sil fonksiyonu bunun aynısı.', anim:'a-bst-max'},
    {n:'3', p:20, t:'h2', q:'main fonksiyonundan aşağıdaki gibi çağrılabilen, kare matrisi birim matrise dönüştüren ve tanımlaması aşağıda verilen fonksiyonu yazınız.',
     qc: L('main(){', '    int matris[][5]={{0,1,2,3,4},{5,6,7,8,9},{0,1,2,3,4},{5,6,7,8,9},{0,1,2,3,4}};', '    birim_matrise_donustur(&matris[0][0],5);', '', '    // matrisin birim matrisine dönüşmüş hali', '    // matris[][5]={{1,0,0,0,0},{0,1,0,0,0},{0,0,1,0,0},{0,0,0,1,0},{0,0,0,0,1}};', '}', '', 'void birim_matrise_donustur(int *dizi, int satir_sayisi){'),
     tip:'Matris int* olarak geliyor: 2B dizi bellekte satır satır durur, [i][j] elemanı dizi + i·sütun + j adresindedir. Kare olduğu için sütun = satır sayısı.',
     st:['i ve j ile bütün elemanları gez.', 'i == j (köşegen) ise 1, değilse 0 yaz.', 'Adres: *(dizi + i*satir_sayisi + j).'],
     ac: L('void birim_matrise_donustur(int *dizi, int satir_sayisi){',
       '    int i, j;',
       '    for(i = 0; i < satir_sayisi; i++)',
       '        for(j = 0; j < satir_sayisi; j++)',
       '            *(dizi + i*satir_sayisi + j) = (i == j) ? 1 : 0;   // köşegen 1, gerisi 0',
       '}')},
    {n:'4', t:'h5', q:'Aşağıdaki soruları cevaplayınız.', subs:[
      {l:'a', p:5, q:'Dengeli ikili ağaç ne demektir, bir cümle ile ifade ediniz.', at:A_DENGE},
      {l:'b', p:5, q:'İkili arama ağacında düğüm ekleme işleminin karmaşıklığını O notasyonunda ifade ediniz.', at:A_BST_EKLE},
      {l:'c', p:5, q:'inorder sırada çıktısı verilen bir ikili arama ağacı çizilebilir mi? Cevabınızı evet veya hayır şeklinde belirtiniz.', at:'Hayır. BST\'nin inorder çıktısı her zaman küçükten büyüğe sıralıdır; aynı sıralı diziyi veren birçok farklı ağaç vardır, hangisi olduğu bilinemez.'},
      {l:'d', p:5, t:'h6', q:'heapSort algoritmasının karmaşıklığını O notasyonunda ifade ediniz.', at:'O(n log n): heapify O(n), sonra n − 1 kez delete_max, her biri O(log n).'},
      {l:'e', p:5, t:'h6', q:'Elemanları {20, 30, 5, 42, 80, 70, 3, 12, 6, 4, 33} olan bir diziye heapify algoritmasını uyguladığımızda elde edilen dizinin gösterimini ikili ağaç şeklinde çiziniz.',
       st:['n = 11, son iç düğüm 4. Sıra: i = 4, 3, 2, 1, 0.', 'i=4: 80 > 4 ve 33, kalır. i=3: 42 > 12 ve 6, kalır. i=2: 5 < 70 → yer değiştir.', 'i=1: 30 < 80 → yer değiştir; aşağıda 30 < 33 → yer değiştir.', 'i=0: 20 < 80 → yer değiştir; 20 < 42 → yer değiştir; 20 > 12 ve 6, dur.'],
       at:'Dizi: 80 42 70 20 33 5 3 12 6 4 30', draw:[{heap:[80,42,70,20,33,5,3,12,6,4,30]}], anim:'a-heapify'},
      {l:'f', p:5, t:'h1', q:'int dizi[5][6][7]; tanımlamasına göre &dizi ifadesinin tipini yazınız.', at:'int (*)[5][6][7]: dizinin tamamını gösteren işaretçi.'},
      {l:'g', p:5, t:'h1', q:'*(dizi + 3) + 2 ifadesinin tipini yazınız.', at:'int (*)[7]. dizi, int (*)[6][7] gibi davranır; *(dizi+3) 3. katman olan int[6][7] dizisidir ve ilk satırını gösteren int (*)[7]\'ye dönüşür; +2 o katmanın 2. satırını gösterir.'},
      {l:'h', p:5, t:'h1', q:'dizi[1][4] ifadesinin tipini yazınız.', at:'int[7]: 7 elemanlı bir satır. İfadelerde ilk elemanının adresine, yani int*\'a dönüşür.'}]}
   ]},

  {id:'v2223', kind:'Vize', title:'Vize 2022-2023', date:'05/12/2022', dur:90, pdf:'vize-2022-2023.pdf',
   qs:[
    {n:'1', p:25, t:'h3', q:'İki liste çift işaretçi (pointer) olarak parametre veriliyor; liste1\'de sayılardan oluşan bir liste var. Bu listedeki çift sayıları liste1\'de, tek sayıları liste2\'de bırakacak şekilde ayıran fonksiyonu yazınız.',
     note:'Bu sorunun kâğıt fotoğrafı yok; metin "2022 vize özeti" dosyasından alındı. Yeni malloc yapmadan, var olan düğümleri taşıyarak çöz.',
     qc: LISTE + '\n\nvoid cift_tek_ayir(struct dugum **liste1, struct dugum **liste2){',
     tip:'Listeyi baştan gezerken her düğümü kopar ve ya liste1\'in ya liste2\'nin başına ekle. Düğümü koparmadan önce sıradakini kaydet.',
     st:['d = *liste1 ile eski listeyi tut, iki listeyi de NULL yap.', 'Her turda a = d; d = d->sonraki (önce sıradakini kaydet).', 'a->anahtar çiftse liste1\'in başına, tekse liste2\'nin başına ekle.'],
     ac: L('void cift_tek_ayir(struct dugum **liste1, struct dugum **liste2){',
       '    struct dugum *d = *liste1, *a;',
       '    *liste1 = NULL;',
       '    *liste2 = NULL;',
       '    while(d != NULL){',
       '        a = d;',
       '        d = d->sonraki;                    // önce sıradakini kaydet',
       '        if(a->anahtar % 2 == 0){ a->sonraki = *liste1; *liste1 = a; }',
       '        else                   { a->sonraki = *liste2; *liste2 = a; }',
       '    }',
       '}'),
     at:'Başa eklendiği için sıra ters döner; soru sırayı istemediği için sorun değil. Sırayı korumak istersen her listenin son düğümünü de tutup sona ekle.'},
    {n:'2', p:25, t:'h5', q:'İkili arama ağacının düğüm tanımlaması aşağıda verilmektedir. Buna göre ikili arama ağacında anahtarı parametre olarak verilen bir düğümün ebeveyninin (parent) ebeveynine ait anahtarı geriye döndüren ve tanımlaması aşağıdaki gibi olan fonksiyonu yazınız. Not: Anahtarı verilen düğüm ağaçta yoksa ya da ebeveyninin ebeveyni yoksa fonksiyon SENTINEL değerini döndürmelidir.',
     qc: '#define SENTINEL 0xFFFFFFFF\n' + AGAC + '\n\nint ebeveynin_ebeveyni_anahtari(struct dugum *kok, int anahtar){',
     tip:'Aramayı yaparken son iki atayı (ebeveyn ve dede) yanında taşı.',
     st:['dede ve ebeveyn NULL ile başla.', 'Her adımda dede = ebeveyn, ebeveyn = kok, sonra küçükse sola, büyükse sağa in.', 'Bulamadıysan ya da dede NULL kaldıysa SENTINEL, değilse dede->anahtar.'],
     ac: L('int ebeveynin_ebeveyni_anahtari(struct dugum *kok, int anahtar){',
       '    struct dugum *dede = NULL, *ebeveyn = NULL;',
       '    while(kok != NULL && kok->anahtar != anahtar){',
       '        dede = ebeveyn;',
       '        ebeveyn = kok;',
       '        kok = (anahtar < kok->anahtar) ? kok->sol : kok->sag;',
       '    }',
       '    if(kok == NULL || dede == NULL) return SENTINEL;   // yok ya da dedesi yok',
       '    return dede->anahtar;',
       '}')},
    {n:'3', t:'h6', q:'Heap veri yapısına ilişkin tanımlamalar aşağıda verilmektedir.',
     qc: L('struct dugum{', '    int anahtar;', '    char *ad;', '};', 'struct heap{', '    struct dugum *dizi;', '    int kapasite;      // dizinin toplam tutabilecegi dugum sayisi', '    int eleman_sayisi; // aktif dugum sayisi', '};'),
     subs:[
      {l:'a', p:10, q:'n tane elemana sahip olan bir MaxHeap veri yapısında en küçük anahtara sahip olan düğüm (kayıt) kaç farklı pozisyonda olabilir, n cinsinden hesaplayınız.',
       st:['En küçük elemanın çocuğu olamaz (çocuğu ondan küçük olurdu), yani o bir yapraktır.', 'n elemanlı heap\'te yapraklar ⌊n/2⌋ … n−1 indekslerindedir.'],
       at:'n − ⌊n/2⌋ = ⌈n/2⌉ farklı pozisyon. Örnek: n = 10 → 5, n = 11 → 6.'},
      {l:'b', p:15, q:'MaxHeap veri yapısında en az anahtar karşılaştırması yaparak en küçük anahtarı bulup geri döndüren ve tanımlaması aşağıdaki gibi olan fonksiyonu yazınız.',
       qc:'int minimum_anahtari_bul(struct heap *heap){',
       tip:'(a) şıkkını kullan: sadece yapraklara bakman yeterli.',
       ac: L('int minimum_anahtari_bul(struct heap *heap){',
         '    int i, n = heap->eleman_sayisi, min;',
         '    if(n == 0) return SENTINEL;',
         '    min = heap->dizi[n/2].anahtar;           // ilk yaprak',
         '    for(i = n/2 + 1; i < n; i++)             // sadece yapraklara bak',
         '        if(heap->dizi[i].anahtar < min)',
         '            min = heap->dizi[i].anahtar;',
         '    return min;                              // ⌈n/2⌉ − 1 karşılaştırma',
         '}')}]},
    {n:'4', t:'h5', q:'Aşağıdaki soruları cevaplayınız.', subs:[
      {l:'a', p:10, q:'Dengeli ikili arama ağacında denge koşulu nedir, açıklayınız.', at:A_DENGE + ' Sadece kökte değil, ağaçtaki her düğümde sağlanmalıdır.'},
      {l:'b', p:5, q:'inorder sırada anahtarları verilen bir ikili arama ağacını çizebilir miyiz? Evet veya hayır şeklinde cevaplayınız.', at:'Hayır. BST\'nin inorder çıktısı her zaman sıralıdır; aynı sıralı diziyi veren çok sayıda farklı ağaç vardır.'},
      {l:'c', p:10, q:'preorder sırada anahtar değerleri 70, 60, 50, 32, 35, 55, 80, 75, 73, 78 olarak verilen bir ikili arama ağacının anahtarlarını postorder sırada yazınız.',
       st:['Preorder sırasıyla teker teker BST\'ye ekle: 70 kök; 60, 50, 32 sola doğru; 35, 32\'nin sağı; 55, 50\'nin sağı; 80 kökün sağı; 75, 80\'in solu; 73 ve 78, 75\'in çocukları.', 'Postorder: önce sol alt ağaç, sonra sağ alt ağaç, en son düğüm.'],
       at:'35 32 55 50 60 73 78 75 80 70', draw:[{bst:[70,60,50,32,35,55,80,75,73,78]}], anim:'a-dolasim'}]}
   ]},

  {id:'v2021', kind:'Vize', title:'Vize 2020-2021 (ödev)', date:'30/11/2020', dur:0, pdf:'vize-2020-cevapli-2.pdf',
   intro:'Pandemi döneminde ödev olarak verilen vize. Klasördeki cevaplı dosyalarda bazı cevaplar yanlış; doğruları aşağıda.',
   qs:[
    {n:'1', t:'h1', q:'İki boyutlu matrisi dinamik oluşturma alt programı ve bu alt programın main() içerisinden nasıl çağrıldığı aşağıda gösterilmektedir. Tam sayıların bellekte 4 byte ve işaretçilerin 8 byte yer kapladıkları kabul edilerek:',
     qc: L('void dinamik_matris_olustur(int ***dizi, int satir, int sutun){', '    int i,j;', '    *dizi=(int**)malloc(satir*sizeof(int*));', '    for(i=0; i<satir; i++){', '        *(*dizi+i)= (int*)malloc(sutun*sizeof(int));', '        for(j=0; j<sutun; j++)', '            *(*(*dizi+i)+j)= rand()%100;', '    }', '}', '', 'int main(int argc, char** argv) {', '    int **A;', '    dinamik_matris_olustur(&A, 10, 15);', '}'),
     subs:[
      {l:'a', p:5, q:'Programların bellek haritası dikkate alındığında A matrisinin elemanları dinamik olarak belleğin hangi bölgesinde oluşturulur?', at:'Heap bölgesinde (malloc ile ayrılan her şey heap\'tedir).'},
      {l:'b', p:10, q:'Dinamik olarak oluşturulan A matrisi için bellekte ne kadar (kaç byte) yer ayrılır, hesaplayınız.', st:['A işaretçisi: 8 byte.', 'Satır işaretçileri: 10 · 8 = 80 byte.', 'Elemanlar: 10 · 15 · 4 = 600 byte.'], at:'8 + 80 + 600 = 688 byte (680\'i heap\'te, 8\'i stack\'teki A).', anim:'a-malloc2'},
      {l:'c', p:5, q:'main()\'de tanımlanan A değişkeni belleğin hangi bölgesinde saklanır ve bellekte ne kadar yer kaplar?', at:'Yerel değişken olduğu için stack\'te; işaretçi olduğu için 8 byte.'},
      {l:'d', p:15, q:'Dinamik olarak oluşturulan iki boyutlu diziyi yok eden (ayrılan bellek bölgelerini geri iade eden) ve tanımlaması aşağıda verilen fonksiyonu yazınız.', qc:'void matris_geri_ver(int ***matris, int satir){',
       tip:'Önce her satırı, sonra satır işaretçileri dizisini free et. Parametre int*** olduğu için matrise *matris ile ulaşılır.',
       ac: L('void matris_geri_ver(int ***matris, int satir){', '    int i;', '    for(i = 0; i < satir; i++)', '        free((*matris)[i]);      // her satır', '    free(*matris);               // satır işaretçileri dizisi', '    *matris = NULL;', '}'),
       at:'Klasördeki cevap free(matris[i]) yazıyor; parametre int*** olduğu için bu yanlış adresleri free eder. Doğrusu (*matris)[i].'}]},
    {n:'2', p:20, t:'h3', q:'Tek yönlü bir listeye ait düğüm tanımlaması aşağıda verilmektedir. Buna göre listenin ilk ve son düğümlerini silen ve tanımlaması aşağıda verilen fonksiyonu yazınız.',
     qc: LISTE + '\n\nvoid ilk_ve_son_dugumleri_sil(struct dugum **liste_basi){',
     tip:'İki iş arka arkaya: önce baştan sil, sonra kalan listede sondakini sil. Her adımdan sonra liste boşaldı mı diye bak.',
     ac: L('void ilk_ve_son_dugumleri_sil(struct dugum **liste_basi){',
       '    struct dugum *a, *once;',
       '    if(*liste_basi == NULL) return;',
       '    a = *liste_basi;                     // 1) ilk düğümü sil',
       '    *liste_basi = a->sonraki;',
       '    free(a);',
       '    if(*liste_basi == NULL) return;      // tek düğüm vardı, bitti',
       '    once = NULL;                         // 2) son düğümü sil',
       '    a = *liste_basi;',
       '    while(a->sonraki != NULL){ once = a; a = a->sonraki; }',
       '    if(once == NULL) *liste_basi = NULL; // iki düğüm vardı',
       '    else once->sonraki = NULL;',
       '    free(a);',
       '}')},
    {n:'3', p:20, t:'h5', q:'İkili ağacın düğüm tanımlaması aşağıda verilmektedir. Derste anlatılan dengeli ağaç koşulunu dikkate alarak verilen bir ikili ağacın dengeli olup olmadığını bulan ve ağaç dengesiz ise geriye 0, dengeli ise geriye 1 döndüren ve tanımlaması aşağıda verilen fonksiyonu yazınız.',
     qc: AGAC_LINK + '\n\nint ikili_agac_dengeli_mi(struct dugum *kok){',
     tip:'Bir yükseklik fonksiyonu yaz. Kökte bakmak yetmez; her düğümde sol ve sağ yüksekliği karşılaştır.',
     ac: L('int yukseklik(struct dugum *kok){',
       '    int s, g;',
       '    if(kok == NULL) return 0;',
       '    s = yukseklik(kok->sol_link);',
       '    g = yukseklik(kok->sag_link);',
       '    return 1 + (s > g ? s : g);',
       '}',
       'int ikili_agac_dengeli_mi(struct dugum *kok){',
       '    int fark;',
       '    if(kok == NULL) return 1;                        // boş ağaç dengeli',
       '    fark = yukseklik(kok->sol_link) - yukseklik(kok->sag_link);',
       '    if(fark > 1 || fark < -1) return 0;',
       '    return ikili_agac_dengeli_mi(kok->sol_link) && ikili_agac_dengeli_mi(kok->sag_link);',
       '}'),
     at:'Klasördeki cevaplar 0/1 yerine yükseklik döndürüyor ya da static değişkenlerle karışık bir çözüm kullanıyor; sorunun istediği 0 ya da 1.'},
    {n:'4', p:10, t:'h5', q:'3. sorudaki düğüm tanımlaması dikkate alınarak aşağıda kodu yazılı olan foo fonksiyonunun ne yaptığını bir veya iki cümle ile ifade ediniz.',
     qc: L('int foo(struct dugum *kok1, struct dugum *kok2){', '    if(kok1==NULL && kok2==NULL) return 1;', '    if(!kok1 || !kok2) return 0;', '    return foo(kok1->sol_link, kok2->sol_link) && foo(kok1->sag_link,kok2->sag_link);', '}'),
     at:'İki ağacın şekli (yapısı) aynıysa 1, değilse 0 döndürür. Anahtarları karşılaştırmaz; "iki ağaç eşit mi" demek yanlış olur.'},
    {n:'5', t:'h6', q:'Heap veri yapısını ve aşağıdaki dizi tanımlamasını dikkate alarak:', qc:'int dizi[18] ={3, 44, 24, 56, 78, 89, 36, 55, 98, 76, 5, 25, 73, 88, 94, 61};', subs:[
      {l:'a', p:5, q:'Bu diziyi dengeli ikili ağaç şeklinde gösteriniz.', st:['Diziyi sıralama. 0. eleman kök, 1–2 ikinci seviye, 3–6 üçüncü seviye… İndeks sırasıyla soldan sağa yerleştir.', 'i\'nin çocukları 2i+1 ve 2i+2.'], draw:[{heap:[3,44,24,56,78,89,36,55,98,76,5,25,73,88,94,61]}], at:'Klasördeki bazı çözümler diziyi sıralayıp çiziyor; o yanlış.'},
      {l:'b', p:10, q:'Bu diziye derste anlatılan heapify algoritması uygulandığında elde edilen diziyi heap şeklinde (dengeli ikili ağaç) gösteriniz.', st:['n = 16, son iç düğüm 7. buble_down sırası i = 7, 6, …, 0.'], at:'Dizi: 98 78 94 61 76 89 88 55 56 3 5 25 73 24 36 44', draw:[{heap:[98,78,94,61,76,89,88,55,56,3,5,25,73,24,36,44]}], anim:'a-heapify'}]}
   ]},

  {id:'f2425', kind:'Final', title:'Final 2024-2025', date:'06/01/2025', dur:90, pdf:'final-butunleme-2023-2025.pdf',
   intro:'Bu finalin fotoğraflarda iki sayfası var.',
   qs:[
    {n:'?', out:1, t:'h3', q:'Hash tablosu ve liste düğüm tanımlamaları verilmektedir. Parametre olarak verilen hash tablosuna listedeki tüm düğümleri yerleştiren fonksiyonu yazınız. Not: Hash tablosunun heap\'te daha önce oluşturulduğunu (hiçbir malloc yapılmayacak) ve tamamen boş olduğunu kabul ediniz; derste gördüğümüz hash fonksiyonu tanımlıdır.',
     qc: HASH + '\n\nvoid liste_dugumlerini_hash_tablosuna_yerlestir(struct hash_tablosu *htable, struct cell **liste_basi){'},
    {n:'3', t:'h5', q:'Aşağıdaki soruları cevaplayınız.', subs:[
      {l:'a', p:5, out:1, q:'Derste gördüğümüz Minimum Spanning Tree algoritmalarının isimlerini yazınız.', at:'Prim ve Kruskal.'},
      {l:'b', p:5, out:1, q:'Graflar konusunda derste anlatılan hangi algoritma priority queue (öncelik kuyruğu) veri yapısını kullanıyor, ismini yazınız.', at:'Dijkstra (en kısa yol). Prim de öncelik kuyruğuyla yazılır.'},
      {l:'c', p:5, out:1, q:'Graflarda kuyruk kullanılan search (arama) algoritmasının ismini yazınız.', at:'Breadth-first search (BFS, genişlik öncelikli arama). DFS yığın kullanır.'},
      {l:'d', p:10, out:1, q:'Başlangıçta boş olan bir AVL ağacına anahtar değerleri sırasıyla 50, 80, 70, 90 ve 95 olan düğümler ekleniyor. Eklemeler sonucu oluşan AVL ağacının şeklini çiziniz.',
       st:['50, 80, 70: 50\'de sağ-sol dengesizlik → çift döndürme, kök 70 olur (50, 80).', '90: 80\'in sağına.', '95: 90\'ın sağına; 80 dengesiz (sağ-sağ) → 80\'de sola döndür, 90 yukarı çıkar.'],
       at:'Kök 70; solda 50; sağda 90, onun çocukları 80 ve 95.', draw:[{bst:[70,50,90,80,95]}]}]}
   ]},

  {id:'b2324', kind:'Bütünleme', title:'Bütünleme 2023-2024', date:'29/01/2024', dur:90, pdf:'final-butunleme-2023-2025.pdf',
   intro:'Bu sınavın fotoğraflarda bir sayfası var.',
   qs:[
    {n:'3', p:20, out:1, q:'Kenar ağırlıkları pozitif tam sayılar olan yönlü bir graf için grafta en kısa döngünün (cycle) uzunluğunu bulan en_kisa_dongu_uzunlugu isimli bir fonksiyon yazınız. Fonksiyon önce en kısa yol hesaplayan floyd_warshall(TEST_SIZE, d) fonksiyonunu çağırmalı; grafta döngü varsa en kısa döngünün uzunluğunu, yoksa −1 döndürmelidir.'}
   ]},

  {id:'f2324', kind:'Final', title:'Final 2023-2024', date:'08/01/2024', dur:90, pdf:'final-butunleme-2023-2025.pdf',
   intro:'Bu finalin fotoğraflarda iki sayfası var.',
   qs:[
    {n:'1', p:20, t:'h5', q:'İkili ağaca ilişkin düğüm tanımlaması verilmiştir. Buna göre tanımlaması aşağıda verilen donustur isimli fonksiyonu yazınız. Bu fonksiyona örnek olarak altta soldaki gibi bir ikili ağaç girdi olarak verilirse, bu ağacı sağdaki ikili ağaca dönüştürmektedir.',
     qc: L('struct dugum{ // ikili arama ağacı', '    int key;', '    struct dugum *sol,*sag;', '};', '', 'void donustur(struct dugum *kok){'),
     draw:[{cap:'sol (girdi)', tree:[50, [25, null, [30, null, [39, [35], null]]], [90, [80], [13]]]}, {cap:'sağ (çıktı)', tree:[50, [90, [13], [80]], [25, [30, [39, null, [35]], null], null]]}],
     tip:'Sağdaki ağaç soldakinin ayna görüntüsü. Her düğümde ne değişmiş?',
     st:['Her düğümde sol ve sağ çocuk yer değiştiriyor.', 'Aynı işi alt ağaçlara özyinelemeyle yap.'],
     ac: L('void donustur(struct dugum *kok){', '    struct dugum *temp;', '    if(kok == NULL) return;', '    temp = kok->sol;          // sol ↔ sağ', '    kok->sol = kok->sag;', '    kok->sag = temp;', '    donustur(kok->sol);', '    donustur(kok->sag);', '}'),
     at:'Hocanın Hafta 5 main.c\'sindeki invert fonksiyonunun aynısı.', anim:'a-invert'},
    {n:'3', p:20, out:1, q:'Kenar ağırlıkları pozitif tam sayılar olan yönlü bir graf için grafta cycle (döngü) olup olmadığını test eden cycle_tespiti isimli bir fonksiyon yazınız. Fonksiyon önce floyd_warshall(TEST_SIZE, d) fonksiyonunu çağırmalı; grafta cycle varsa 1, yoksa 0 döndürmelidir.', qc:'int cycle_tespiti(int test_size, int *d[]){'}
   ]},

  {id:'b2223', kind:'Bütünleme', title:'Bütünleme 2022-2023 (telafi ödevi)', date:'27/02/2023', dur:0, pdf:'butunleme-2022-2023.pdf',
   qs:[
    {n:'1', p:25, t:'h5', q:'İkili arama ağacı ve bağlantılı listeye ait düğüm tanımlamaları verilmiştir. Buna göre ikili arama ağacının kökünden anahtarı verilen düğüme kadar olan yol üzerinde bulunan düğümleri listeye ekleyen ve tanımlaması aşağıda verilen fonksiyonu yazınız.',
     qc: L('struct bt_dugum{ // ikili arama ağacı', '    int anahtar;', '    struct bt_dugum *sol,*sag;', '};', 'struct ls_dugum{ // bağlantılı liste', '    struct bt_dugum *dugum;', '    struct ls_dugum *sonraki;', '};', '', 'void liste_olustur(struct bt_dugum *kok, int anahtar, struct ls_dugum **liste_basi){'),
     tip:'BST\'de aramanın izlediği yol tam olarak istenen yol. Arama yaparken geçtiğin her düğüm için bir liste düğümü oluşturup sona ekle.',
     st:['Önce anahtarın ağaçta olup olmadığına bak; yoksa liste boş kalsın.', 'Kökten başla; her düğüm için ls_dugum aç, dugum alanına ağaç düğümünü koy, listenin sonuna ekle.', 'Anahtara gelince dur; değilse küçükse sola, büyükse sağa in.'],
     ac: L('void liste_olustur(struct bt_dugum *kok, int anahtar, struct ls_dugum **liste_basi){',
       '    struct bt_dugum *d = kok;',
       '    struct ls_dugum *yeni, *son = NULL;',
       '    *liste_basi = NULL;',
       '    while(d != NULL && d->anahtar != anahtar)          // anahtar ağaçta var mı?',
       '        d = (anahtar < d->anahtar) ? d->sol : d->sag;',
       '    if(d == NULL) return;                              // yoksa liste boş',
       '    d = kok;',
       '    while(d != NULL){                                  // kökten anahtara yürü',
       '        yeni = (struct ls_dugum*)malloc(sizeof(struct ls_dugum));',
       '        yeni->dugum = d;',
       '        yeni->sonraki = NULL;',
       '        if(son == NULL) *liste_basi = yeni; else son->sonraki = yeni;',
       '        son = yeni;',
       '        if(d->anahtar == anahtar) break;',
       '        d = (anahtar < d->anahtar) ? d->sol : d->sag;',
       '    }',
       '}'),
     at:'PDF\'in sonundaki öğrenci cevabında yön ters: düğümün anahtarı aranandan büyükse sola gidilmeli, o sağa gidiyor.'},
    {n:'2', p:25, out:1, q:'Hash tablosu ile ilgili veri tanımlaması verilmektedir. Buna göre parametre olarak anahtarı verilen düğümün bulunduğu listedeki anahtarı en küçük olan düğümü silen ve tanımlaması aşağıda verilen fonksiyonu yazınız.', qc: HASH + '\n\nvoid liste_sil(struct hash_tablosu *htable, char *anahtar){'},
    {n:'3', p:25, out:1, q:'Yönlü bir graf ve kenar ağırlıkları verilmektedir. a) Bu grafa ait bitişiklik matrisini yazınız (5). b) Floyd-Warshall kod parçacığı (if(k==2) break; satırıyla) çalıştırıldıktan sonra d matrisini yazınız (10). c) if(k==2) break; satırını silersek hesaplanan d matrisini yazınız (10).'},
    {n:'4', t:'h6', q:'Aşağıdaki soruları cevaplayınız.', subs:[
      {l:'a', p:5, out:1, q:'n düğüm sayısı olmak üzere AVL ağacına düğüm ekleme algoritmasının karmaşıklığını O notasyonunda ifade ediniz.', at:'O(log n).'},
      {l:'b', p:5, out:1, q:'n düğüm sayısı olmak üzere AVL ağacının yüksekliğini O notasyonunda ifade ediniz.', at:'O(log n).'},
      {l:'c', p:5, q:'MinHeap veri yapısında eleman ekleme işleminin karmaşıklığını O notasyonunda ifade ediniz.', at:'O(log n): eleman sona konur ve buble_up ile en fazla ağacın yüksekliği kadar yukarı çıkar.', anim:'a-heap-ekle'},
      {l:'d', p:5, out:1, q:'"Minimum Spanning Tree (en küçük kapsama ağacı) yönsüz graflar için hesaplanır" ifadesinin doğru olup olmadığını Evet veya Hayır şeklinde cevaplayınız.', at:'Evet.'},
      {l:'e', p:5, out:1, q:'Minimum spanning tree ve shortest path algoritmalarına birer örnek veriniz (sadece isimlerini yazınız).', at:'MST: Prim, Kruskal. En kısa yol: Dijkstra, Floyd-Warshall, Bellman-Ford.'}]}
   ]},

  {id:'f2223', kind:'Final', title:'Final 2022-2023', date:'16/01/2023', dur:90, pdf:'final-butunleme-2023-2025.pdf',
   intro:'Bu finalin fotoğraflarda iki sayfası var.',
   qs:[
    {n:'1', p:25, t:'h5', q:'İkili arama ağacı ve bağlantılı listeye ait düğüm tanımlamaları verilmiştir. İkili arama ağacı düğüm tanımlamasındaki derinlik verisi ilgili düğüme ait derinlik (yükseklik) bilgisini saklamaktadır. Buna göre ikili arama ağacındaki en uzun yol (veya birden fazla en uzun yol varsa bunlardan herhangi biri) üzerindeki düğümleri listeye ekleyen ve tanımlaması aşağıda verilen fonksiyonu yazınız.',
     qc: L('struct bt_dugum{ // ikili arama ağacı', '    int key;', '    int derinlik;', '    struct bt_dugum *sol,*sag;', '};', 'struct ls_dugum{ // bağlantılı liste', '    struct bt_dugum *dugum;', '    struct ls_dugum *sonraki;', '};', '', 'void liste_olustur(struct bt_dugum *kok, struct ls_dugum **liste_basi){'),
     tip:'En uzun yol kökten başlar. Her düğümde derinliği (yüksekliği) büyük olan çocuğa inersen en uzun yolu izlemiş olursun.',
     st:['Kökten başla, geçtiğin her düğüm için bir liste düğümü açıp sona ekle.', 'Tek çocuk varsa ona in; iki çocuk varsa derinliği büyük olana in.', 'Yaprağa gelince dur.'],
     ac: L('void liste_olustur(struct bt_dugum *kok, struct ls_dugum **liste_basi){',
       '    struct ls_dugum *yeni, *son = NULL;',
       '    *liste_basi = NULL;',
       '    while(kok != NULL){',
       '        yeni = (struct ls_dugum*)malloc(sizeof(struct ls_dugum));',
       '        yeni->dugum = kok;',
       '        yeni->sonraki = NULL;',
       '        if(son == NULL) *liste_basi = yeni;      // ilk eleman',
       '        else son->sonraki = yeni;',
       '        son = yeni;',
       '        if(kok->sol == NULL) kok = kok->sag;     // tek yol (yapraksa NULL olur, döngü biter)',
       '        else if(kok->sag == NULL) kok = kok->sol;',
       '        else kok = (kok->sol->derinlik >= kok->sag->derinlik) ? kok->sol : kok->sag;',
       '    }',
       '}'),
     at:'Eşitlikte hangi tarafa gittiğin fark etmez. Başa ekleyen çözüm de kabul edilir; o zaman liste yapraktan köke sıralanır.'},
    {n:'3', p:25, out:1, q:'Yönlü bir graf ve kenar ağırlıkları verilmektedir. a) Bu grafa ait bitişiklik matrisini yazınız (5). b) Verilen Floyd-Warshall kod parçacığı (if(k==3) break; satırıyla) çalıştırıldıktan sonra d matrisini yazınız (10). c) if(k==3) break; satırını silersek d matrisini yazınız (10).'}
   ]},

  {id:'f2021', kind:'Final', title:'Final 2020-2021 (ödev)', date:'11/01/2021', dur:0, pdf:'final-2020-2021.pdf',
   qs:[
    {n:'1', p:20, t:'h5', q:'İkili ağacın düğüm tanımlaması aşağıda verilmektedir. Buna göre ikili bir ağaçta tek çocuğa sahip olan düğümlerin sayısını bulan ve tanımlaması aşağıdaki gibi olan fonksiyonu yazınız.',
     qc: AGAC_LINK + '\n\nint tek_cocuklu_dugum_sayisi(struct dugum *kok){',
     tip:'Her düğüm için "tam olarak bir çocuğu var mı" diye bak ve sol ile sağ alt ağaçtaki sayıları da ekle.',
     ac: L('int tek_cocuklu_dugum_sayisi(struct dugum *kok){',
       '    int tek;',
       '    if(kok == NULL) return 0;',
       '    tek = (kok->sol_link == NULL) != (kok->sag_link == NULL);   // tam olarak biri boşsa 1',
       '    return tek + tek_cocuklu_dugum_sayisi(kok->sol_link)',
       '               + tek_cocuklu_dugum_sayisi(kok->sag_link);',
       '}'),
     at:'PDF\'teki öğrenci cevabı tek çocuklu düğümü bulunca 1 döndürüp duruyor; altındaki tek çocuklu düğümleri saymadığı için yanlış.'},
    {n:'2', p:30, out:1, q:'Hash veri yapısı tanımlamaları verilmektedir. Düğüm tanımlaması struct cell olan bağlı bir listedeki düğümleri başlangıçta boş olan hash tablosuna yerleştiren fonksiyonu yazınız (malloc yapılmayacak; fonksiyondan dönüldüğünde liste boş olmalı).', qc:'void listeyi_hash_tablosuna_donusturme(struct hash_tablosu *htable, struct cell **liste_basi){'},
    {n:'3', p:30, out:1, t:'h6', q:'Heap veri yapısının dizi yerine parent, sol ve sağ işaretçileri olan ağaç düğümleriyle gerçekleştirildiğini kabul edelim (heap yapısında kok ve en_son_eklenen işaretçileri var). Buna göre heap\'e ekleme yapan void heap_insert(struct heap *heap, int key) fonksiyonunu yazınız.'},
    {n:'4', p:20, out:1, q:'a) Preorder çıktısı "50 (4) 20 (3) 10 (1) 35 (2) 30 (1) 40 (1) 70 (3) 60 (1) 80 (2) 90 (1)" (parantez içi yükseklik) olan AVL ağacını çiziniz. b) Bu ağaca anahtarı 25 olan düğüm eklendiğinde oluşan şekli çiziniz.'}
   ]},

  {id:'f2015', kind:'Final', title:'Final 2015 (sadece cevaplar)', date:'2015', dur:0, pdf:'final-2015-cevaplar.pdf',
   intro:'Elimizde bu sınavın soru kâğıdı yok, iki sorunun cevap dosyası var. Soru metinleri cevaplardan çıkarıldı.',
   qs:[
    {n:'1', t:'h3', q:'Tek yönlü bir listede anahtarı (içeriği) en küçük olan düğümü silen fonksiyonu yazınız.',
     qc: L('struct hucre{', '    int icerik;', '    struct hucre *sonraki;', '};', '', 'void enkucuksil(struct hucre **liste){'),
     tip:'Listeyi bir kez gezerek en küçüğü ve ondan bir öncekini bul. En küçük baştaysa liste başı değişir.',
     st:['Liste boşsa çık.', 'enk = ilk düğüm, enk_once = NULL. Gezerken daha küçük bulursan enk\'i ve öncesini güncelle.', 'enk baştaysa *liste = enk->sonraki; değilse enk_once->sonraki = enk->sonraki.', 'free(enk).'],
     ac: L('void enkucuksil(struct hucre **liste){',
       '    struct hucre *enk, *enk_once = NULL, *once, *g;',
       '    if(*liste == NULL) return;',
       '    enk = *liste;',
       '    once = *liste;',
       '    for(g = (*liste)->sonraki; g != NULL; once = g, g = g->sonraki)',
       '        if(g->icerik < enk->icerik){ enk = g; enk_once = once; }',
       '    if(enk_once == NULL) *liste = enk->sonraki;   // en küçük baştaymış',
       '    else enk_once->sonraki = enk->sonraki;',
       '    free(enk);',
       '}'),
     anim:'a-sil'},
    {n:'4', out:1, q:'İki hash tablosunun içeriklerini birbiriyle karşılaştıran (aynıysa 1, değilse 0 döndüren) fonksiyonu yazınız.'}
   ]},

  {id:'b2016', kind:'Bütünleme', title:'Bütünleme 2016', date:'2016', dur:0, pdf:'butunleme-2016.pdf',
   intro:'Sınava girenlerin hatırladıklarından yazılmış; struct alanları kâğıtta yok, dersteki adlarla çözüldü.',
   qs:[
    {n:'1', out:1, q:'Bir hash tablosunda soyadı bilgileri tutuluyor. Silmek istediğimiz soyadını gönderip hash tablosunda bulup silen fonksiyonu yazınız.', qc:'Sil(struct hash *hash_table, char *silineceksoyad){'},
    {n:'2', t:'h5', q:'Bir ağacın ikili (arama) ağaç olup olmadığını bulan fonksiyonu yazınız. İkili ağaç ise 1, değil ise 0 değerini döndürecek.', qc: L('// kâğıtta düğüm yapısı yok; dersteki yapı varsayıldı', AGAC, '', 'int ikili_agacmi(struct dugum *kok){'),
     note:'Her düğümünün en fazla iki çocuğu olan bir yapıda soru ancak "ikili arama ağacı mı" diye anlamlı; öyle çözüldü.',
     tip:'Sadece çocuğuyla karşılaştırmak yetmez: her düğüm, atalarından gelen alt ve üst sınırın arasında olmalı.',
     ac: L('#include <limits.h>', 'int bst_yardimci(struct dugum *kok, int alt, int ust){', '    if(kok == NULL) return 1;', '    if(kok->anahtar <= alt || kok->anahtar >= ust) return 0;', '    return bst_yardimci(kok->sol, alt, kok->anahtar) &&   // solda: üst sınır = kok', '           bst_yardimci(kok->sag, kok->anahtar, ust);      // sağda: alt sınır = kok', '}', 'int ikili_agacmi(struct dugum *kok){', '    return bst_yardimci(kok, INT_MIN, INT_MAX);', '}'),
     at:'Kısa yol: inorder dolaşım kesin artan sıradaysa ağaç BST\'dir.'},
    {n:'3', t:'h3', q:'Listenin sonunu listenin başı yapan (ya da başını sonu yapan) fonksiyonu yazınız.', qc: L('// kâğıtta düğüm yapısı yok; bu yapı varsayıldı', 'struct hucre{', '    int icerik;', '    struct hucre *sonraki;', '};', '', 'void sonu_bas_yap(struct hucre **liste){'),
     tip:'Son düğümü ve bir öncesini bul. Öncekinin sonraki\'si NULL olur, son düğüm başa geçer.',
     ac: L('void sonu_bas_yap(struct hucre **liste){        // 1→2→3→4 olur 4→1→2→3',
       '    struct hucre *once = NULL, *son;',
       '    if(*liste == NULL || (*liste)->sonraki == NULL) return;',
       '    son = *liste;',
       '    while(son->sonraki != NULL){ once = son; son = son->sonraki; }',
       '    once->sonraki = NULL;          // sondan bir önceki yeni son',
       '    son->sonraki = *liste;',
       '    *liste = son;',
       '}',
       '',
       '// başı sona taşıyan: 1→2→3→4 olur 2→3→4→1',
       'void basi_son_yap(struct hucre **liste){',
       '    struct hucre *ilk, *son;',
       '    if(*liste == NULL || (*liste)->sonraki == NULL) return;',
       '    ilk = *liste;',
       '    son = ilk;',
       '    while(son->sonraki != NULL) son = son->sonraki;',
       '    *liste = ilk->sonraki;',
       '    son->sonraki = ilk;',
       '    ilk->sonraki = NULL;',
       '}'),
     at:'Fonksiyon struct hucre* döndürecek şekilde sorulursa aynı işi yapıp yeni başı return et.'},
    {n:'4', t:'h5', q:'Gönderilen iki düğümün birbiriyle kardeş olup olmadığını bulan fonksiyonu yazınız. İki düğüm kardeş ise 1, değil ise 0 döndürecek.', qc: L('// kâğıtta düğüm yapısı yok; dersteki yapı varsayıldı', AGAC, '', 'int kardesmi(struct dugum *kok, struct dugum *A, struct dugum *B){'),
     tip:'Bu sefer anahtar değil düğüm adresleri geliyor. Bir düğümün sol ve sağ çocuğu A ile B ise kardeştirler.',
     ac: L('int kardesmi(struct dugum *kok, struct dugum *A, struct dugum *B){', '    if(kok == NULL || A == NULL || B == NULL) return 0;', '    if((kok->sol == A && kok->sag == B) || (kok->sol == B && kok->sag == A)) return 1;', '    return kardesmi(kok->sol, A, B) || kardesmi(kok->sag, A, B);', '}'),
     at:'Her ikili ağaçta çalışır, O(n). 2024 vizesinde aynı soru anahtarlarla soruldu.'},
    {n:'5', q:'Aşağıdaki soruları cevaplayınız.', subs:[
      {l:'a', t:'h5', q:'İkili ağaç nedir, hangi özellikleri taşıması gerekir? Örnek vererek açıklayınız.', at:'Her düğümün en fazla iki çocuğu (sol ve sağ) olan ağaçtır. İkili arama ağacında ayrıca her düğümün solundakiler ondan küçük, sağındakiler büyüktür. Örnek: 50 kökünde solda 25, sağda 100.'},
      {l:'b', out:1, q:'AVL ağacı nedir, hangi özellikleri taşıması gerekir? Örnek vererek açıklayınız.', at:'Her düğümde sol ve sağ alt ağaç yükseklik farkı en fazla 1 olan ikili arama ağacıdır; ekleme ve silmede bu koşul döndürmelerle korunur.'},
      {l:'c', t:'h6', q:'Heap ağacı nedir, hangi özellikleri taşıması gerekir? Örnek vererek açıklayınız.', at:'Tam (complete) bir ikili ağaçtır, yani son seviye hariç bütün seviyeler dolu ve son seviye soldan doludur. Max heap\'te her ebeveyn çocuklarından büyük ya da eşittir; bu yüzden en büyük eleman köktedir. Dizide tutulur: i\'nin çocukları 2i+1 ve 2i+2.', draw:[{heap:[98,78,92,52,56,44,84]}]}]}
   ]},

  {id:'f0708', kind:'Final', title:'Final 2007-2008', date:'2008', dur:0, pdf:'final-2008.pdf',
   intro:'Her soru 25 puan. Eski ama dört sorunun dördü de vize konusu.',
   qs:[
    {n:'1', p:25, t:'h3', q:'Sıralı ve çift yönlü bağlantılı bir listenin yapısı aşağıda verilmektedir. Buna göre bu listeye eleman eklemeyi amaçlayan ve prototipi aşağıda verilen fonksiyonu yazınız. Eleman başarılı bir şekilde eklenirse fonksiyon true, aksi hâlde false döndürmeli.',
     qc: L('struct yapi {', '    int val;', '    struct yapi *next;', '    struct yapi *prev;', '};', '', 'bool ekle(int eleman, struct yapi **head, struct yapi **tail){'),
     tip:'Önce ilk büyük ya da eşit düğümü (t) bul. Çift yönlüde dört bağ var: yeni->next, yeni->prev, öncekinin next\'i, sonrakinin prev\'i. Başa ya da sona eklerken head ya da tail de değişir.',
     ac: L('#include <stdbool.h>',
       'bool ekle(int eleman, struct yapi **head, struct yapi **tail){',
       '    struct yapi *yeni, *t = *head;',
       '    while(t != NULL && t->val < eleman) t = t->next;   // ilk büyük ya da eşit',
       '    if(t != NULL && t->val == eleman) return false;   // zaten var',
       '    yeni = (struct yapi*)malloc(sizeof(struct yapi));',
       '    if(yeni == NULL) return false;',
       '    yeni->val = eleman;',
       '    yeni->next = t;',
       '    if(t == NULL){                       // sona (liste boşsa da)',
       '        yeni->prev = *tail;',
       '        if(*tail != NULL) (*tail)->next = yeni; else *head = yeni;',
       '        *tail = yeni;',
       '    } else {                             // t\'nin önüne',
       '        yeni->prev = t->prev;',
       '        if(t->prev != NULL) t->prev->next = yeni; else *head = yeni;',
       '        t->prev = yeni;',
       '    }',
       '    return true;',
       '}'),
     anim:'a-cift'},
    {n:'2', p:25, t:'h5', q:'İkili bir ağacın derinliğini bulan derinlik isimli bir fonksiyon yazınız. Ağacın derinliği köke en uzak yaprağın köke olan uzaklığıdır; ağaçta sadece kök varsa derinlik 0\'dır.',
     qc: L('struct CELL{', '    int element;', '    struct CELL *right, *left;', '};', '', 'int derinlik(struct CELL *root){'),
     tip:'Sadece kök varsa 0 olması için boş ağaca −1 de.',
     ac: L('int derinlik(struct CELL *root){', '    int sol, sag;', '    if(root == NULL) return -1;          // böylece tek kök 0 olur', '    sol = derinlik(root->left);', '    sag = derinlik(root->right);', '    return 1 + (sol > sag ? sol : sag);', '}')},
    {n:'3', t:'h5', q:'İkili sıralı (arama) ağaçları düşünelim.', subs:[
      {l:'a', q:'Inorder taraması aynı olan iki ikili ağaç birbirinin aynısı mıdır? Bunu inorder sırası 15 20 25 27 30 60 75 80 olan iki ağaç için gösteriniz.', at:'Hayır. İkisi de aşağıdaki inorder\'ı verir ama farklı ağaçlar.', draw:[{cap:'kök 30', bst:[30,20,15,25,27,60,75,80]}, {cap:'kök 60', bst:[60,25,20,15,30,27,75,80]}]},
      {l:'b', q:'Preorder taraması aynı olan iki ikili ağaç birbirinin aynısı mıdır? Bunu preorder sırası 30 20 15 25 27 70 60 80 75 olan iki ağaç için gösteriniz.', at:'İkili arama ağacıysa evet: preorder sırasıyla eklersen hep aşağıdaki ağaç çıkar. Genel ikili ağaçta (sıralı değilse) hayır.', draw:[{bst:[30,20,15,25,27,70,60,80,75]}]}]},
    {n:'4', p:25, t:'h6', q:'Verilen bir dizinin heap özelliğini sağlayıp sağlamadığını bulan heapmi isimli fonksiyonu yazınız (last_index dizinin son elemanının indeksi).', qc:'bool heapmi(int A[], int last_index){',
     tip:'Sadece iç düğümlere bak: her i için çocukları 2i+1 ve 2i+2, ebeveynden büyük olmamalı.',
     ac: L('bool heapmi(int A[], int last_index){', '    int i;', '    for(i = 0; 2*i + 1 <= last_index; i++){                    // sadece iç düğümler', '        if(A[i] < A[2*i + 1]) return false;                    // sol çocuk büyük', '        if(2*i + 2 <= last_index && A[i] < A[2*i + 2]) return false;', '    }', '    return true;', '}'),
     at:'Örnek: 98 78 92 52 56 44 84 → true, 48 56 84 15 78 → false.'}
   ]},

  {id:'diger', kind:'Final', title:'Yılı belli olmayan sayfalar', date:'2023–2025', dur:0, pdf:'final-butunleme-2023-2025.pdf',
   intro:'Fotoğraflarda hangi sınava ait olduğu okunmayan sayfalar. Çoğu final sorusu.',
   qs:[
    {n:'1', p:20, t:'h5', q:'İkili ağaca ilişkin düğüm tanımlaması verilmiştir. Buna göre tanımlaması aşağıda verilen sekilce_ayni_mi isimli fonksiyonu yazınız. Bu fonksiyon, örnek olarak altta sol ve ortadaki gibi iki ağacın kökleri parametre olarak gönderildiğinde geriye 1, sol ve sağdaki gibi iki ağacın kökleri gönderildiğinde geriye 0 döndürmelidir.',
     qc: L('struct dugum{ // ikili arama ağacı', '    int key;', '    struct dugum *sol,*sag;', '};', '', 'int sekilce_ayni_mi(struct dugum *kok1, struct dugum *kok2){'),
     draw:[{cap:'sol', tree:[50, [25, null, [30, [27], [35]]], [60, null, [70]]]}, {cap:'orta', tree:[80, [10, null, [30, [25], [35]]], [90, null, [95]]]}, {cap:'sağ', tree:[25, [10, null, [30, [15], null]], [90]]}],
     tip:'Anahtarlara değil sadece yapıya bak. İkisi de boşsa aynı, biri boşsa farklı.',
     ac: L('int sekilce_ayni_mi(struct dugum *kok1, struct dugum *kok2){', '    if(kok1 == NULL && kok2 == NULL) return 1;   // ikisi de boş', '    if(kok1 == NULL || kok2 == NULL) return 0;   // biri boş, diğeri değil', '    return sekilce_ayni_mi(kok1->sol, kok2->sol) &&', '           sekilce_ayni_mi(kok1->sag, kok2->sag);', '}'),
     at:'2020 vizesinde aynı kod foo adıyla verilip "ne yapar?" diye sorulmuştu.'},
    {n:'2', out:1, q:'Hash tablosu ve liste düğüm tanımlamaları verilmektedir. Parametre olarak verilen hash tablosundaki düğümlerden tek bir liste oluşturan ve hash tablosunu yok eden fonksiyonu yazınız (malloc yapılmayacak).', qc:'void hash_tablosundan_liste_olustur(struct hash_tablosu **htable, struct cell **lbasi){'},
    {n:'3', out:1, q:'Hash tablosu ile ilgili tanımlar verilmektedir. Parametre olarak verilen düğümün bulunduğu listedeki düğümlerin hepsini silen fonksiyonu yazınız.', qc:'void liste_sil(struct hash_tablosu *htable, struct cell *dugum){'},
    {n:'4', out:1, q:'Derste gördüğümüz Kruskal minimum spanning tree tanımlamaları verilmektedir. İki düğümün aynı spanning tree\'de olup olmadığını hesaplayan, aynıysa 1, değilse 0 döndüren fonksiyonu yazınız.', qc:'int dugumler_ayni_spanning_tree_demi(struct GraphKruskal g, int dugum1, int dugum2){'},
    {n:'5', t:'h5', q:'Kısa sorular (farklı final sayfalarından).', subs:[
      {l:'a', out:1, q:'minHeap dengeli ikili arama ağacı mıdır? Doğru/yanlış şeklinde veriniz.', at:'Yanlış. Heap dengeli bir ikili ağaçtır ama arama ağacı değildir.'},
      {l:'b', out:1, q:'Derste gördüğümüz floyd_warshall algoritmasının çalışma zamanı karmaşıklığı nedir? (n düğüm sayısı)', at:'O(n³).'},
      {l:'c', out:1, q:'Başlangıçta boş bir AVL ağacına 80, 40, 10, 60, 70 sırasıyla ekleniyor. Oluşan AVL ağacını çiziniz.', st:['80, 40, 10: sol-sol dengesizlik, 80\'de sağa döndür → 40 kök (10, 80).', '60: 80\'in soluna. 70: 60\'ın sağına → 80\'de sol-sağ dengesizlik, çift döndürme → 70 (60, 80).'], at:'Kök 40; solda 10; sağda 70, onun çocukları 60 ve 80.', draw:[{bst:[40,10,70,60,80]}]},
      {l:'d', out:1, q:'Başlangıçta boş bir AVL ağacına 80, 40, 50, 60, 70 sırasıyla ekleniyor. Oluşan AVL ağacını çiziniz.', st:['80, 40, 50: sol-sağ dengesizlik → 50 kök (40, 80).', '60: 80\'in soluna. 70: 60\'ın sağına → 80\'de sol-sağ dengesizlik → 70 (60, 80).'], at:'Kök 50; solda 40; sağda 70, onun çocukları 60 ve 80.', draw:[{bst:[50,40,70,60,80]}]},
      {l:'e', out:1, q:'Depth-first search (DFS) algoritmasında kuyruk mu, yoksa yığın mı kullanılır? Breadth-first search (BFS) için?', at:'DFS yığın (ya da özyineleme), BFS kuyruk kullanır.'},
      {l:'f', out:1, q:'"Red-Black ağaçlarında parent\'ın rengi siyahsa sağ child siyah olamaz" ifadesi doğru mudur?', at:'Yanlış. Kural kırmızı düğümün çocuklarının kırmızı olamayacağıdır; siyah ebeveynin siyah çocuğu olabilir.'},
      {l:'g', q:'"Dengeli ikili arama ağacında farklı iki yaprak düğümünden kök düğüme olan yolların uzunlukları farkı en fazla 1\'dir" ifadesinin doğru olup olmadığını Evet ya da Hayır şeklinde cevaplayınız.', at:'Hayır. Denge koşulu her düğümün alt ağaç yükseklikleriyle ilgilidir; yaprak derinlikleri arasında 2 ya da daha fazla fark olabilir.'},
      {l:'h', q:'Bir fonksiyonda tanımlı yerel bir değişkenin adresini geri döndürmek anlamsal hataya yol açar ifadesinin doğru olup olmadığını Evet ya da Hayır şeklinde cevaplayınız.', at:'Evet. Fonksiyon bitince yerel değişkenin stack\'teki yeri geçersiz olur; o adresi kullanmak tanımsız davranıştır.'},
      {l:'i', q:'Heap sort algoritmasının karmaşıklığını O notasyonunda ifade ediniz.', at:'O(n log n).'},
      {l:'j', out:1, q:'"Minimum Spanning Tree yönsüz graflar için hesaplanır" ifadesi doğru mudur? MST ve en kısa yol algoritmalarına birer örnek veriniz.', at:'Evet. MST: Prim, Kruskal. En kısa yol: Dijkstra, Floyd-Warshall.'}]}
   ]}
  ];
  window.VY_EX = EX;
})();

// ---------- çıkmış sınav sayfaları: sınav listesi, her sınav için çözülebilir sayfa
(function(){
  if(typeof document === 'undefined') return;
  var EX = window.VY_EX || [], hl = window.VY_HL || function(s){ return esc(s); }, LIB = window.VY_ANIM_LIB || {};
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var CK = 'kaynaklar/veri-yapilari/cikmis/';
  var WEEK = {h1:'Hafta 1 · Diziler', h2:'Hafta 2 · Matris', h3:'Hafta 3 · Listeler', h4:'Hafta 4 · Yığın', h5:'Hafta 5 · BST', h6:'Hafta 6 · Heap'};
  var animTitle = {}; (window.VY_ANIMS || []).forEach(function(a){ animTitle[a.id] = a.title; });
  var store = {
    get: function(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
    set: function(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
  };
  var OK = {}; try { OK = JSON.parse(store.get('vy.exok') || '{}') || {}; } catch(e){ OK = {}; }

  // çizimler: heap dizisi, BST ekleme sırası ya da [anahtar, sol, sağ] biçiminde ağaç
  function bstSpec(keys){
    function ins(t, k){ if(!t) return [k, null, null]; if(k < t[0]) t[1] = ins(t[1], k); else t[2] = ins(t[2], k); return t; }
    var root = null; keys.forEach(function(k){ root = ins(root, k); }); return root;
  }
  function treeState(spec){
    var st = {nodes:{}, root:null, ptrs:{}, hl:[], vis:[], path:[], gone:[]}, n = 0;
    (function mk(t, set){ if(!t) return set(null); var id = 'd' + (n++); st.nodes[id] = {k:t[0], l:null, r:null}; set(id);
      mk(t[1], function(c){ st.nodes[id].l = c; }); mk(t[2], function(c){ st.nodes[id].r = c; }); })(spec, function(id){ st.root = id; });
    return st;
  }
  function draws(list){
    if(!list || !list.length || !LIB.DRAW) return '';
    return '<div class="ex-figs">' + list.map(function(d){
      var svg = d.heap ? LIB.DRAW.heap({a:d.heap, n:d.heap.length, hl:[], sw:[]}) : LIB.DRAW.tree(treeState(d.tree || bstSpec(d.bst)));
      return '<figure class="ex-fig">' + svg + (d.cap ? '<figcaption>' + esc(d.cap) + '</figcaption>' : '') + '</figure>';
    }).join('') + '</div>';
  }
  function pts(x){ return x.p ? '<span class="exq-pts">' + x.p + ' puan</span>' : ''; }
  function ptsOf(q){ return q.p || (q.subs || []).reduce(function(s, x){ return s + (x.p || 0); }, 0); }
  function hasSol(x){ return !!(x.ac || x.at || (x.st && x.st.length)); }
  function solution(x, withDraw){
    var h = '';
    if(x.st && x.st.length) h += '<ol class="fn-steps">' + x.st.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>';
    if(x.ac) h += '<pre class="code hl">' + hl(x.ac) + '</pre>';
    if(x.at) h += '<p class="ex-at">' + esc(x.at) + '</p>';
    if(withDraw) h += draws(x.draw);
    if(x.anim && animTitle[x.anim]) h += '<div class="chips"><a class="chip anim" href="#' + x.anim + '">▶ Adım adım izle: ' + esc(animTitle[x.anim]) + '</a></div>';
    return h;
  }
  function work(key, rows, x, withDraw){
    var h = '<textarea class="ex-ans" rows="' + rows + '" data-k="' + key + '" placeholder="Cevabını buraya yaz, sonra çözümle karşılaştır (bu tarayıcıda saklanır)" spellcheck="false"></textarea>';
    if(x.tip) h += '<details class="ex-tip"><summary>İpucu</summary><p>' + esc(x.tip) + '</p></details>';
    h += '<details class="ex-sol"><summary>Çözümü ve cevabı göster</summary><div class="ex-solb">' + solution(x, withDraw) + '</div></details>';
    h += '<label class="ex-ok"><input type="checkbox" data-ok="' + key + '"' + (OK[key] ? ' checked' : '') + '> Doğru yaptım</label>';
    return h;
  }
  function outNote(x){ return '<p class="ex-out">' + (hasSol(x) ? 'Final konusu, vize kapsamında değil; yine de kısa cevabı aşağıda.' : 'Final konusu (graf, hash ya da AVL), vize kapsamında değil. Çözüm eklenmedi; sorunun tamamı kâğıdın PDF\'inde.') + '</p>'; }
  function question(e, q){
    var key = e.id + '.' + q.n, h = '<article class="exq' + (q.out ? ' out' : '') + '">';
    h += '<div class="exq-top"><span class="exq-no">' + (q.n === '?' ? 'Soru' : 'Soru ' + esc(q.n)) + '</span>' + (ptsOf(q) ? '<span class="exq-pts">' + ptsOf(q) + ' puan</span>' : '') +
      (q.t && WEEK[q.t] ? '<a class="chip" href="#' + q.t + '">' + WEEK[q.t] + '</a>' : '') + (q.out ? '<span class="tag wait">Final konusu</span>' : '') + '</div>';
    h += '<p class="exq-q">' + esc(q.q) + '</p>';
    if(q.note) h += '<p class="fn-note"><b>Not:</b> ' + esc(q.note) + '</p>';
    if(q.qc) h += '<pre class="code hl">' + hl(q.qc) + '</pre>';
    h += draws(q.draw);   // sorunun kendi şekilleri (şıklardaki şekiller cevaba ait)
    if(q.subs){
      h += q.subs.map(function(s){
        var k = key + s.l;
        return '<div class="exs' + (s.out ? ' out' : '') + '"><p class="exs-q"><b>' + esc(s.l) + ')</b> ' + esc(s.q) + (s.p ? ' <span class="exq-pts">(' + s.p + ' puan)</span>' : '') + (s.out ? ' <span class="tag wait">Final konusu</span>' : '') + '</p>' +
          (s.qc ? '<pre class="code hl">' + hl(s.qc) + '</pre>' : '') +
          (hasSol(s) ? work(k, s.ac ? 6 : 2, s, true) : outNote(s)) + '</div>';
      }).join('');
    } else if(hasSol(q)){
      if(q.out) h += outNote(q);
      h += work(key, q.ac ? 8 : 3, q, false);
    } else h += outNote(q);
    return h + '</article>';
  }
  function countOk(e){
    var total = 0, ok = 0;
    e.qs.forEach(function(q){ (q.subs ? q.subs.map(function(s){ return [e.id + '.' + q.n + s.l, s]; }) : [[e.id + '.' + q.n, q]]).forEach(function(p){ if(hasSol(p[1])){ total++; if(OK[p[0]]) ok++; } }); });
    return {ok:ok, total:total};
  }
  var main = document.querySelector('main');
  EX.forEach(function(e, i){
    var sec = document.createElement('section');
    sec.className = 'view'; sec.dataset.view = 's-' + e.id; sec.hidden = true;
    var total = e.qs.reduce(function(s, q){ return s + ptsOf(q); }, 0), prev = EX[i - 1], next = EX[i + 1];
    sec.innerHTML = '<a class="back" href="#cikmis">← Bütün sınavlar</a>' +
      '<div class="view-head"><span class="label">' + esc(e.kind) + ' · ' + esc(e.date) + '</span><h1>' + esc(e.title) + '</h1>' +
      '<p class="muted" style="max-width:70ch">' + (e.intro ? esc(e.intro) + ' ' : '') + e.qs.length + ' soru' + (total ? ' · ' + total + ' puan' : '') + (e.dur ? ' · ' + e.dur + ' dakika' : '') + '. Önce kendin çöz, sonra çözümü aç; doğru yaptıklarını işaretle.</p></div>' +
      '<div class="toolbar ex-bar">' + (e.dur ? '<button class="btn" type="button" data-timer>⏱ ' + e.dur + ' dakika başlat</button><span class="ex-clock" data-clock></span>' : '') +
      '<button class="btn" type="button" data-openall>Bütün çözümleri aç</button><span class="ex-score" data-score></span>' +
      '<a class="btn" href="' + CK + e.pdf + '" target="_blank" rel="noopener">Kâğıdın kendisi (PDF)</a></div>' +
      '<div class="ex-list">' + e.qs.map(function(q){ return question(e, q); }).join('') + '</div>' +
      '<div class="pager">' + (prev ? '<a class="btn" href="#s-' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<a class="btn" href="#cikmis">← Bütün sınavlar</a>') +
      (next ? '<a class="btn" href="#s-' + next.id + '">' + esc(next.title) + ' →</a>' : '<a class="btn" href="#cikmis">Bütün sınavlar →</a>') + '</div>';
    main.appendChild(sec);
    var score = sec.querySelector('[data-score]');
    function paint(){ var c = countOk(e); score.textContent = c.total ? 'Doğru: ' + c.ok + ' / ' + c.total : ''; }
    paint();
    sec.querySelectorAll('textarea[data-k]').forEach(function(t){
      t.value = store.get('vy.ex.' + t.dataset.k) || '';
      t.addEventListener('input', function(){ store.set('vy.ex.' + t.dataset.k, t.value); });
    });
    sec.addEventListener('change', function(ev){
      var c = ev.target.closest('input[data-ok]'); if(!c) return;
      if(c.checked) OK[c.dataset.ok] = 1; else delete OK[c.dataset.ok];
      store.set('vy.exok', JSON.stringify(OK)); paint(); paintIndex();
    });
    var all = sec.querySelector('[data-openall]'), open = false;
    all.addEventListener('click', function(){
      open = !open;
      sec.querySelectorAll('details.ex-sol').forEach(function(d){ d.open = open; });
      all.textContent = open ? 'Bütün çözümleri kapat' : 'Bütün çözümleri aç';
    });
    var tb = sec.querySelector('[data-timer]'), clock = sec.querySelector('[data-clock]'), timer = null, end = 0;
    if(tb) tb.addEventListener('click', function(){
      if(timer){ clearInterval(timer); timer = null; tb.textContent = '⏱ ' + e.dur + ' dakika başlat'; clock.textContent = ''; return; }
      end = Date.now() + e.dur * 60000; tb.textContent = 'Süreyi durdur';
      var tick = function(){ var s = Math.max(0, Math.round((end - Date.now()) / 1000));
        clock.textContent = s ? Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2) + ' kaldı' : 'Süre doldu';
        if(!s){ clearInterval(timer); timer = null; tb.textContent = '⏱ Yeniden başlat'; } };
      tick(); timer = setInterval(tick, 1000);
    });
  });

  // sınav listesi
  var idx = document.getElementById('ex-index');
  function paintIndex(){
    if(!idx) return;
    var groups = [['Vizeler', EX.filter(function(e){ return e.kind === 'Vize'; })], ['Final ve bütünleme', EX.filter(function(e){ return e.kind !== 'Vize'; })]];
    idx.innerHTML = groups.map(function(g){
      return '<div class="section"><div class="section-title"><h2>' + g[0] + '</h2>' + (g[0] === 'Vizeler' ? '<p>Vize sınavının kendisi bunlar: önce bunları çöz</p>' : '<p>Vize konusuna giren soruları çözümlü, gerisi işaretli</p>') + '</div><div class="grid">' + g[1].map(function(e){
        var weeks = [], inScope = 0, c = countOk(e);
        e.qs.forEach(function(q){ if(!q.out) inScope++; [q].concat(q.subs || []).forEach(function(x){ if(x.t && weeks.indexOf(x.t) < 0) weeks.push(x.t); }); });
        weeks.sort();
        return '<a class="card" href="#s-' + e.id + '"><span class="label">' + esc(e.kind) + ' · ' + esc(e.date) + '</span><h3>' + esc(e.title) + '</h3>' +
          '<p class="desc">' + weeks.map(function(w){ return WEEK[w].split(' · ')[1]; }).join(', ') + '</p>' +
          '<div class="foot"><span class="meta">' + e.qs.length + ' soru' + (inScope < e.qs.length ? ' · ' + inScope + '\'i vize konusu' : '') + (c.ok ? ' · ' + c.ok + '/' + c.total + ' doğru' : '') + '</span><span class="go">Çöz →</span></div></a>';
      }).join('') + '</div></div>';
    }).join('');
  }
  paintIndex();

  // hafta sayfalarına o konudan çıkmış sorular
  document.addEventListener('DOMContentLoaded', function(){
    Object.keys(WEEK).forEach(function(w){
      var sec = document.querySelector('[data-view="' + w + '"] .read > section'); if(!sec) return;
      var links = [];
      EX.forEach(function(e){ e.qs.forEach(function(q){ if(!q.out && (q.t === w || (q.subs || []).some(function(s){ return s.t === w && !s.out; }))) links.push('<a class="chip" href="#s-' + e.id + '">' + esc(e.title.replace(' (ödev)', '').replace(' (telafi ödevi)', '')) + ' · ' + esc(q.n) + '. soru</a>'); }); });
      if(!links.length) return;
      var box = sec.querySelector('.kod-week');
      if(!box){ box = document.createElement('div'); box.className = 'kod-week'; var head = sec.querySelector('.sec-head'); if(head) head.insertAdjacentElement('afterend', box); else sec.insertBefore(box, sec.firstChild); }
      var row = document.createElement('div'); row.className = 'chips';
      row.innerHTML = '<span class="lbl-sm">Bu konudan çıkmış sorular</span>' + links.join('');
      box.appendChild(row);
    });
  });
})();
