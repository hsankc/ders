/* 
 * File:   main.c
 * Author: kadayif
 *
 * Created on 24 Ekim 2023 Salı, 16:22
 */

#include <stdio.h>
#include <stdlib.h>

/*
 * 
 */

#include "ikiliAramaAgaci.h"
#include "yigin.h"
int main(int argc, char** argv) {
    struct agac_dugum *kok=NULL;
    
    ekle(&kok,50);
    ekle(&kok,25);
    ekle(&kok,100);   
    ekle(&kok,80);  
    ekle(&kok,78); 
    ekle(&kok,130);
    ekle(&kok,39);
    ekle(&kok,35);
    ekle(&kok,11);
    printf("Agac Dengeli mi: %d\n",ikili_arama_agaci_dengeli_mi(kok));
    iterative_inOrder(kok);
    printf("\n");
    iterative_preOrder(kok);
    printf("\n");
    iterative_postOrder(kok);
    printf("\n");
   // kok->sol->anahtar=65;
   // printf("Ikili arama agaci mi: %d\n",ikili_arama_agaci_mi(kok));
   // printf("Ikili arama agaci mi: %d\n",ikili_arama_agaci_mi_yeni(1,kok));
    return (EXIT_SUCCESS);
}