/* 
 * File:   main.c
 * Author: BM
 *
 * Created on 22 Ekim 2014 Çarşamba, 12:58
 */

#include <stdio.h>
#include <stdlib.h>

/*
 * 
 */

#include "ikiliAramaAgaci.h" 



struct agac_dugum* dugum_olustur(int anahtar){
    struct agac_dugum *d = (struct agac_dugum*)malloc(sizeof(struct agac_dugum));
    if(d==NULL){
        printf("Heapte gerekli yer ayrilamadi... exit ...\n");
        exit(1);
    }
    d->anahtar = anahtar; //(*d).icerik=icerik;
    d->sol=d->sag=NULL;
    return d;
}

int ikili_agac_bosmu(struct  agac_dugum *kok ){
   if(kok==NULL) return 1;
   else return 0;
}

void ekle(struct agac_dugum **kok,int anahtar){
    struct agac_dugum *dugum;
    struct agac_dugum *d;
    struct agac_dugum *geri;
    
    d=*kok;
    while(d!=NULL){
        geri=d;
        if(anahtar < d->anahtar) d=d->sol;
        else if(anahtar > d->anahtar) d= d->sag;
        else return;
    }
    dugum=dugum_olustur(anahtar);
    if(*kok==NULL){
        *kok = dugum;
        return;
    }
    if(anahtar < geri->anahtar) geri->sol = dugum;
    else geri->sag = dugum;
    
}

void inorder_yardimci(struct agac_dugum *kok){   
    if(kok==NULL) return;
    inorder_yardimci(kok->sol);
    printf("%4d ",kok->anahtar);
    inorder_yardimci(kok->sag);   
}

void inorder(struct agac_dugum *kok){
    if(kok==NULL) return;
    inorder_yardimci(kok);
    printf("\n");
}

void preorder_yardimci(struct agac_dugum *kok){   
    if(kok==NULL) return;
    printf("%4d ",kok->anahtar);
    preorder_yardimci(kok->sol);
    preorder_yardimci(kok->sag);   
}
void preorder(struct agac_dugum *kok){
    if(kok==NULL) return;
    preorder_yardimci(kok);
    printf("\n");
}

void postorder_yardimci(struct agac_dugum *kok){
    if(kok==NULL) return;   
    postorder_yardimci(kok->sol);
    postorder_yardimci(kok->sag);
    printf("%4d ",kok->anahtar);   
}

void postorder(struct agac_dugum *kok){
    if(kok==NULL) return;
    postorder_yardimci(kok);
    printf("\n");
}

int dugum_sayisi(struct agac_dugum *kok){
    if(kok==NULL) return 0;
    return 1+dugum_sayisi(kok->sol)+dugum_sayisi(kok->sag);
}

int yaprak_sayisi(struct agac_dugum *kok){
    if(kok==NULL) return 0;
    if(kok->sol==NULL && kok->sag == NULL) return 1;
    else return yaprak_sayisi(kok->sol)+yaprak_sayisi(kok->sag);
}

void sil(struct agac_dugum **kok, int silinen){ 
    struct agac_dugum *d=*kok;
    struct agac_dugum *parent=NULL;
    struct agac_dugum *d1,*d2;
    int sol;
    while(d!=NULL){
        if(silinen < d->anahtar){
            parent=d; d=d->sol; sol=1;
        }
        else if(silinen > d->anahtar){
            parent=d; d=d->sag; sol = 0;
        }
        else break;
    }
    if(d==NULL) return;
    if(d->sol==NULL){ // silinen dugumun solu bos
        if(parent==NULL) *kok=d->sag;
        else{
            if(sol==1) parent->sol=d->sag;
            else parent->sag=d->sag;
        }
    }
    else if(d->sag==NULL){  // silinen dugumun sagi bos
        if(parent==NULL) *kok=d->sol;
        else {
            if(sol==1) parent->sol=d->sol;
            else parent->sag = d->sol;
        }
    }
    else { // silinen dugumun hem sagi hem de solu dolu
           // silinencek dugumun solunun en sagina git
           // en sagdaki dugum silinen dugumun konumunu alir
        d1=d->sol;
        d2=NULL;
        while(d1->sag!=NULL){
            d2=d1;
            d1=d1->sag;
        }
        if(d2!=NULL){
            d2->sag= d1->sol;
            d1->sol=d->sol;
        }
        d1->sag = d->sag;
        if(parent==NULL) *kok=d1; // agacin koku degisti
        else {
            if(sol==1) parent->sol=d1;
            else parent->sag=d1;
        }
    } 
    
  /*  else { // silinen dugumun hem sagi hem de solu dolu
           // silinencek dugumun saginin en soluna git
           // en soldaki dugum silinen dugumun konumunu alir
        d1=d->sag;
        d2=NULL;
        while(d1->sol!=NULL){
            d2=d1;
            d1=d1->sol;
        }
        if(d2!=NULL){
            d2->sol= d1->sag;
            d1->sag=d->sag;
        }
        d1->sol = d->sol;
        if(parent==NULL) *kok=d1; // agacin koku degisti
        else {
            if(sol==1) parent->sol=d1;
            else parent->sag=d1;
        }
    } 
    */
    free(d); 
}

void yoket(struct agac_dugum **kok){
    if(*kok!=NULL){
        yoket(&(*kok)->sol);
        yoket(&(*kok)->sag);
        free(*kok);
        *kok=NULL;
    }
}

int ic_dugum_sayisi(struct agac_dugum *kok){ // ic dugum sayisi
    if(kok==NULL || kok->sol == NULL && kok->sag == NULL ) return 0;
    return 1+ic_dugum_sayisi(kok->sol) + ic_dugum_sayisi(kok->sag);
}

int en_kisa_yol_uzunlugu(struct agac_dugum *root){
    int sol,sag,kucuk,buyuk;
    if(root==NULL) return 0;
  //  if (root->sol==NULL && root->sag==NULL) return 1;
    sol=en_kisa_yol_uzunlugu(root->sol);
    sag=en_kisa_yol_uzunlugu(root->sag);
    if(sol<sag){
        kucuk=sol;
        buyuk=sag;
    }
    else {
        kucuk=sag;
        buyuk=sol;
    }
    if(root->sol!=NULL && root->sag!=NULL) return kucuk+1;
    return buyuk+1;
}



 int ikili_arama_agaci_yardimci(struct agac_dugum *kok, struct agac_dugum *node){
    struct agac_dugum *a; 
    if(node==NULL) return 1; 
    a=kok;
    while(a!=NULL && a!=node){
           if(node->anahtar < a->anahtar ) a=a->sol;
           else if (node->anahtar > a->anahtar ) a=a->sag;
           else break;
    }
    if(a!=node) return 0;
    if(ikili_arama_agaci_yardimci(kok,node->sol)) 
           return ikili_arama_agaci_yardimci(kok,node->sag); 
    return 0;    
}

 int ikili_arama_agaci_mi(struct agac_dugum *kok){
     return ikili_arama_agaci_yardimci(kok,kok);
 }
 
 
#include <stdarg.h> 
int ikili_arama_agaci_mi_yeni(int arg_count, ...){
    struct agac_dugum *kok,*node;
    struct agac_dugum *a; 
    // va_list is a type to hold information about
    // variable arguments
    va_list ap;
  
    // va_start must be called before accessing
    // variable argument list
    va_start(ap, arg_count);
  
    // Now arguments can be accessed one by one
    // using va_arg macro. Initialize min as first
    // argument in list
    kok = va_arg(ap, struct agac_dugum*);
    if(arg_count==1) node=kok;
    else {
          node=va_arg(ap, struct agac_dugum*);
         // va_end(ap);
    } 
    if(node==NULL) return 1; 
    a=kok;
    while(a!=NULL && a!=node){
           if(node->anahtar < a->anahtar ) a=a->sol;
           else if (node->anahtar > a->anahtar ) a=a->sag;
           else break;
    }
    if(a!=node) return 0;
    if(ikili_arama_agaci_mi_yeni(2,kok,node->sol)) 
           return ikili_arama_agaci_mi_yeni(2,kok,node->sag); 
    return 0;    
} 
 
 
int ikili_arama_agaci_dengeli_yardimci(struct agac_dugum *kok, struct agac_dugum *node){
     if(kok==node && node==NULL) return 1;
     if(node==NULL) return -1; 
     int sol = ikili_arama_agaci_dengeli_yardimci(kok,node->sol);
     int sag = ikili_arama_agaci_dengeli_yardimci(kok,node->sag);
     if(sol == 0 || sag == 0) return 0;
     if(sol-sag > 1 || sol-sag < -1) return 0;
     if(kok==node) return 1;
     if(sol < sag) return sol -1;
     return sag -1;    
 }

int ikili_arama_agaci_dengeli_mi(struct agac_dugum *kok){
    return ikili_arama_agaci_dengeli_yardimci(kok,kok);
    
}

