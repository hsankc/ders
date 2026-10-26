/* 
 * File:   main.c
 * Author: BM
 *
 * Created on 13 Ekim 2014 Pazartesi, 14:51
 */

#include <stdio.h>
#include <stdlib.h>

/*
 * 
 */

// en az üç alana sahip. ileri işaretçisi düğümden sonraki düğüme işaret etmekte.
// gei ise düğümden önce gelen düğüme işaret etmektedir.
struct dugum{
    int anahtar;
    struct dugum *ileri;
    struct dugum *geri;
};

// listenin ilk ve son düğmlerine işaretçileri barındıran yapı
struct ciftYonluListe{
    struct dugum *bas;
    struct dugum *son;
};

// dinamik olarak düğüm oluşturan fonksiyon
struct dugum *dugumOlustur(int anahtar){
    struct dugum *yeni; 
    yeni=(struct dugum*)malloc(sizeof(struct dugum));
    if(yeni==NULL){
        printf("Hata, yer ayrilamadi. Sonlaniyor...");
        exit(1);
    }
    yeni->anahtar =anahtar;
    yeni->geri=yeni->ileri = NULL;
    return yeni;
}

// listenin ilk ve son düğümlerini tutan işaretçiler için heapten yer ayırma
void ciftYonluListeBaslat(struct ciftYonluListe **liste){
    *liste=(struct ciftYonluListe*)malloc(sizeof(struct ciftYonluListe));
    if(*liste==NULL){
        printf("Hata, yer ayrilamadi. Sonlaniyor...");
        exit(1);
    }
    (*liste)->bas=(*liste)->son=NULL;
}

// liste başına düğüm ekleme
void liste_basina_ekle(int anahtar,struct ciftYonluListe *liste){
    struct dugum *yeni;
    yeni=dugumOlustur(anahtar);
    if(liste->son==NULL) liste->son=yeni;
    else{
        liste->bas->geri=yeni;
        yeni->ileri=liste->bas;
    }
    liste->bas=yeni;  
}

// liste sonuna düğüm ekleme ekle
void liste_sonuna_ekle(int anahtar,struct ciftYonluListe *liste){
    struct dugum *yeni;
    yeni=dugumOlustur(anahtar);
    if(liste->bas==NULL) liste->bas=yeni;
    else {
        liste->son->ileri=yeni;
        yeni->geri=liste->son;
    }
    liste->son=yeni;
}

// listenin yazdırılması
void liste_yazdir(struct ciftYonluListe *liste){
    struct dugum *bas;
    if(liste==NULL)return;
    bas=liste->bas;
    while(bas!=NULL){
        printf("%4d ",bas->anahtar);
        bas=bas->ileri;
    }
    printf("\n");
}

// listenin yanlış olarak yazdırılması
void liste_yazdir_yanlis(struct ciftYonluListe *liste){
    //struct dugum *bas=liste->bas;
  /*  while(liste->bas!=NULL){
        printf("%4d ",liste->bas->anahtar);
        liste->bas=liste->bas->ileri;
    } */    
}

// listenin sondan başlayarak yazdırılması
void liste_yazdir_sondan(struct ciftYonluListe *liste){
    struct dugum *son;
    if(liste==NULL) return;
    son=liste->son;
    while(son!=NULL){
        printf("%4d ",son->anahtar);
        son=son->geri;
    }
    printf("\n");    
}

// listenin düğümlerinin silinerek bellek alanlarının heape iade edilmesi
void liste_yok_et(struct ciftYonluListe **liste){
    struct dugum *a;
    if(*liste==NULL) return;
    while((*liste)->bas!=NULL){
        a=(*liste)->bas;
        (*liste)->bas = (*liste)->bas->ileri;
        free(a);
    }
    free(*liste);
    *liste=NULL;
}

int main(int argc, char** argv) {    
    struct ciftYonluListe *liste;
    ciftYonluListeBaslat(&liste);
    liste_basina_ekle(40,liste);
    liste_sonuna_ekle(60,liste);
    liste_basina_ekle(90,liste);
    liste_sonuna_ekle(5,liste);
    liste_sonuna_ekle(15,liste);
    liste_yazdir(liste);
   // liste_yazdir_yanlis(liste);
    liste_yazdir_sondan(liste);
    
    liste_yok_et(&liste);
    
    
    
    return (EXIT_SUCCESS);
}

