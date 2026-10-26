/* 
 * File:   main.c
 * Author: BM
 *
 * Created on 01 Ekim 2014 Çarşamba, 12:59
 */

#include <stdio.h>
#include <stdlib.h>

// liste düğümü tanımı. Düğümde en az iki alan mevcuttur.
struct dugum{
    int anahtar;    // düğüme ait anahtar, herbir düğüm için anahtar farklıdır.
                    // basit olsun diye anahtarın tipini int olarak belirledik.
    struct dugum *sonraki; // sonraki düğüme işaretçi
};

// dinamik olarak düğümün heapte oluşturulması
struct dugum* dugum_olustur(int anahtar){
    struct dugum *a;
    a=(struct dugum*)malloc(sizeof(struct dugum));
    if(a==NULL){
        printf("Heap alaninda yer ayrilamadi ...\n");
        exit(1);
    }
    a->anahtar=anahtar;
    a->sonraki=NULL;
    return a;
}

// listenin başına düğüm ekleme. Bu işlemden sonra liste başı işaretçisi
// yeni eklenen düğüme işaret etmeli
void liste_basina_ekle(int anahtar,struct dugum **liste_basi){
    struct dugum* a=dugum_olustur(anahtar);
    a->sonraki=*liste_basi;
    *liste_basi=a;
}

// liste sonuna ekleme yapan fonksiyon
void liste_sonuna_ekle(int icerik,struct dugum **liste_basi){
    struct dugum* a=dugum_olustur(icerik);
    if(*liste_basi==NULL){
        a->sonraki=*liste_basi;
        *liste_basi=a;
    }
    else {
        struct dugum *x=*liste_basi;
        while(x->sonraki!=NULL){
            x=x->sonraki;
        }
        x->sonraki=a;
    }
}

// listenin iteratif (döngüsel) yazdırımı
void liste_yaz(struct dugum *liste_basi){
    while(liste_basi!=NULL){
        printf("%4d ",liste_basi->anahtar);
        liste_basi=liste_basi->sonraki;
    }
    printf("\n");
}

// listenin rekürsüf yazdırımı
void liste_yaz_recursive(struct dugum *liste_basi){
    if(liste_basi!=NULL) {
    printf("%4d ",liste_basi->anahtar);
    liste_yaz_recursive(liste_basi->sonraki);
    }  
    else{ 
        printf("\n");
    }
}
// listenin tersten yazdırımı. En son düğüm ilk, ilk düğüm en son yazdırılır.
void tersten_liste_yaz_recursive(struct dugum *liste_basi){
    
    if(liste_basi!=NULL){
        tersten_liste_yaz_recursive(liste_basi->sonraki);
        printf("%4d ",liste_basi->anahtar);
    }
   
}

// listenin yok edilip, düğümlerinin kapladığı bellek bölgelerinin heape 
// geri verilmesi
void liste_yok_et(struct dugum **liste_basi){
    struct dugum *simdiki;
    while(*liste_basi!=NULL){
      //  simdiki=(*liste_basi);
      //  *liste_basi=(*liste_basi)->sonraki;
      //  free(simdiki);
        free(*liste_basi);
        *liste_basi=(*liste_basi)->sonraki;
    }
}

// düğümlerin anahtarlarına göre sıralı listeye sıralamayı bozmadan yeni bir
// düğümün eklenmesi
void liste_sirali_ekle(int anahtar, struct dugum **liste_basi){
   struct dugum *a, *b, *eklenen;
   b=*liste_basi;
   while(b!=NULL && b->anahtar <= anahtar){
       if(b->anahtar==anahtar) return;
       a = b;
       b= b->sonraki;
   }
   eklenen=dugum_olustur(anahtar);
   if(b==*liste_basi){
       eklenen->sonraki=*liste_basi;
       *liste_basi=eklenen;
   }
   else {
       a->sonraki=eklenen;
       eklenen->sonraki=b;       
   }
}

// anaharı verilen bir düğümün listeden silinip, düğümğün bellek alanının heape
// iade edilmesi
void liste_eleman_sil(int anahtar, struct dugum **liste_basi){
    struct dugum *temp=*liste_basi;
    struct dugum *once;
    
    while(temp!=NULL && temp->anahtar!=anahtar){
        once = temp;
        temp=temp->sonraki;
    }
    if(temp==NULL) return;
    else {
        if(temp==*liste_basi) *liste_basi=(*liste_basi)->sonraki;
        else once->sonraki=temp->sonraki;
        free(temp);
    }
        
}

// verilen bir listenin sıralanması
void liste_sirala(struct dugum **liste_basi){
    struct dugum *a,*b,*c,*d;  
    if(*liste_basi == NULL || (*liste_basi)->sonraki==NULL) return;
    d=(*liste_basi)->sonraki;
    (*liste_basi)->sonraki=NULL;
    while(d!=NULL){
        c=d;
        d=d->sonraki;
        b=*liste_basi;
        while(b!=NULL && b->anahtar < c->anahtar){
            a=b;
            b=b->sonraki;
        }
        if(b==*liste_basi){
            c->sonraki=*liste_basi;
            *liste_basi=c;
        }
        else {
            a->sonraki = c;
            c->sonraki = b;
        }
        }
    }
 
// düğümlerde tutulan işaretçi değeri değiştirilerek listenin ters çevrilmesi.
// liste başı işaretcisi ilk listenin en sonki düğümüne işaret edecektir.
void liste_ters_cevir(struct dugum **liste_basi){    
    struct dugum *a,*b;
    a=NULL;
    while(*liste_basi!=NULL){
        b=*liste_basi;
        *liste_basi=(*liste_basi)->sonraki;
        b->sonraki=a;
        a=b;
    }
    *liste_basi=a;
}

// nahtar1 ve anahtar2 değerleri ardışık iki düğümün anahatarlarına karşılık
// gelip gelmediğini belirleyen fonksiyon.
int ardisik_mi(struct dugum *liste_basi,int anahtar1, int anahtar2){
    struct dugum *onceki;
    onceki=NULL;
    while(liste_basi!=NULL){
        if(liste_basi->anahtar==anahtar1) break;
        onceki=liste_basi;
        liste_basi=liste_basi->sonraki;
    }
    if(liste_basi!=NULL && (onceki!=NULL && onceki->anahtar==anahtar2 ||
                            liste_basi->sonraki!=NULL && liste_basi->sonraki->anahtar==anahtar2))
        return 1;
    return 0;
 }   

// anahar değeri verilen anahatar değerinden küçük olan düğümlerin
// listeden silinmesi
void listeden_cikar(struct dugum **liste_basi, int anahtar){    
    struct dugum *b=*liste_basi, *a=*liste_basi;
    while(b!=NULL){
        if(anahtar > b->anahtar){
            if(b==*liste_basi){
                *liste_basi=(*liste_basi)->sonraki;
                free(b);
                a=b=*liste_basi;
            }
            else{
                a->sonraki=b->sonraki;
                free(b);
                b=a->sonraki;
            }
        }
        else{
            a=b;
            b=b->sonraki;
        }
    
    } //while
}
    
void fonk(int *dizi_A, int *dizi_B,int **dizi_sonuc, int uzunluk){
    *dizi_sonuc=(int*)malloc(sizeof(int)*uzunluk);
    for(int i=0; i<uzunluk; i++){
    //    *(*dizi_sonuc+i)=dizi_A[i]+dizi_B[i];
        (*dizi_sonuc)[i]=dizi_A[i]+dizi_B[i];
    }
}

int main(int argc, char** argv) {
    struct dugum *liste=NULL;
    liste_basina_ekle(20,&liste);
    
    liste_basina_ekle(30,&liste);
    liste_basina_ekle(200,&liste);
    liste_basina_ekle(40,&liste);
    liste_basina_ekle(80,&liste);
    liste_basina_ekle(10,&liste);
    liste_yaz(liste);
    printf("\n");
    
    liste_yaz_recursive(liste);
   // listeden_cikar(&liste, 41);
  //  liste_yaz(liste);
    
    
    printf("\n");
    
    liste_sirala(&liste);
    liste_yaz_recursive(liste);
    printf("\n");
    liste_eleman_sil(10, &liste);
    liste_yaz_recursive(liste);
    printf("\n");
    
    listeden_cikar(&liste, 41);
    liste_yaz(liste);
    return (EXIT_SUCCESS);
}

