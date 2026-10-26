/* 
 * File:   main.c
 * Author: kadayif
 *
 * Created on 24 Ekim 2023 Salı, 16:09
 */

#include <stdio.h>
#include <stdlib.h>

#include "ikiliAramaAgaci.h"

void en_sondaki_dugumu_sil(struct agac_dugum **kok){
    struct agac_dugum *a,*b;
    if(*kok==NULL) return;
    a=*kok;
    while(a->sag!=NULL){
        b=a;
        a=a->sag;
    }
    if(a==*kok) *kok= (*kok)->sol;
    else b->sag=a->sol;
    free(a);
}

void invert(struct agac_dugum *kok){
    struct agac_dugum *temp;
    if(kok==NULL) return;
    temp=kok->sol;
    kok->sol=kok->sag;
    kok->sag=temp;
    invert(kok->sol);
    invert(kok->sag);
}

void invert1(struct agac_dugum *kok){
    struct agac_dugum *temp;
    if(kok==NULL) return;
    temp=kok->sag;
    invert(kok->sol);
    invert(kok->sag);
    
    kok->sag=kok->sol;
    kok->sol=temp;
    
}

int main(int argc, char** argv) {
    struct agac_dugum *kok=NULL;
    ekle(&kok,50);
    ekle(&kok,25);
    ekle(&kok,100);   
    ekle(&kok,80);  
    ekle(&kok,30);  
    ekle(&kok,130);
    ekle(&kok,39);
    ekle(&kok,35);
    inorder(kok);
    preorder(kok);
    postorder(kok);
  //  sil(&kok, 50);
    preorder(kok);
    printf("%d\n",ic_dugum_sayisi(kok));
    printf("%d\n",en_kisa_yol_uzunlugu(kok));
    printf("%d\n",ikili_arama_agaci_mi(kok));
    printf("%d\n",ikili_arama_agaci_dengeli_mi(kok));
    
    printf("----------------\n");
    preorder(kok);
    invert(kok);
    preorder(kok);
    invert1(kok);
    preorder(kok);
    
 //   printf("Agac Dengeli mi: %d\n",agac_dengeli_mi(kok,kok));
 //   printf("\n");
 //   kok->sol->anahtar=65;
 //   printf("Ikili arama agaci mi: %d\n",ikili_arama_agaci_mi(kok,kok));
 //   printf("Ikili arama agaci mi: %d\n",ikili_arama_agaci_mi_yeni(1,kok));
    
    
    
    return (EXIT_SUCCESS);
}

