/*
 * File:   main.c
 * Author: kadayif
 *
 * Created on 19 Ekim 2022 Çarşamba, 11:28
 * Hafta 1
 */

#include <stdio.h>
#include <stdlib.h>


/*
 *
 */


void tek_boyutlu_dizi_yaz(int *dizi, int uzunluk){  // dizi[]
    printf("--- Tek Boyutlu Dizi Yaz ---\n");
    for(int i=0; i<uzunluk; i++)
        printf("%3d ",*(dizi+i));
    printf("\n----------------------------\n");
}


void iki_boyutlu_dizi_yaz1(int *dizi, int uzunluk1, int uzunluk2){
    printf("--- İki Boyutlu Dizi Yaz1 ---\n");
    for(int i=0; i<uzunluk1; i++){
        for(int j=0; j<uzunluk2; j++)
            printf("%3d ",*(dizi+i*uzunluk2+j));
        printf("\n");
    }
    printf("----------------------------\n");
}

void iki_boyutlu_dizi_yaz2(int (*dizi)[4], int uzunluk){
    printf("--- İki Boyutlu Dizi Yaz2 ---\n");
    for(int i=0; i<uzunluk; i++){
        for(int j=0; j<4; j++)
          printf("%3d ",*(*(dizi+i)+j));   // dizi[i][j]
        printf("\n");
    }
    printf("----------------------------\n");
}

void iki_boyutlu_dizi_yaz3(int (*dizi)[3][4]){
    printf("--- İki Boyutlu Dizi Yaz3 ---\n");
    for(int i=0; i<3; i++){
        for(int j=0; j<4; j++)
            printf("%3d ",*(*(*dizi+i)+j));    // (*dizi)[i][j]  --  dizi[0][i][j]
        printf("\n");
    }
    printf("----------------------------\n");
}

void uc_boyutlu_dizi_yaz1(int *dizi, int uzunluk1, int uzunluk2, int uzunluk3){
    printf("--- Uc Boyutlu Dizi Yaz1 ---\n");
    for(int i=0; i<uzunluk1; i++){
        for(int j=0; j<uzunluk2; j++){
            for(int k=0; k<uzunluk3; k++)
                printf("%3d ",*(dizi+i*uzunluk2*uzunluk3+j*uzunluk3+k));
            printf("\n");
        }
    }
    printf("----------------------------\n");
}

void uc_boyutlu_dizi_yaz2(int (*dizi)[3][4], int uzunluk){
    printf("--- Uc Boyutlu Dizi Yaz2 ---\n");
    for(int i=0; i<uzunluk; i++){
        for(int j=0; j<3;j++){
            for(int k=0;k<4; k++)
                printf("%3d ",*(*(*(dizi+i)+j)+k));
            printf("\n");
        }
    }
    printf("----------------------------\n");
}

void uc_boyutlu_dizi_yaz3(int (*dizi)[2][3][4]){
    printf("--- Uc Boyutlu Dizi Yaz3 ---\n");
    for(int i=0; i<2; i++){
        for(int j=0; j<3;j++){
            for(int k=0;k<4; k++)
                printf("%3d ",*(*(*(*dizi+i)+j)+k));
            printf("\n");
        }
    }
    printf("----------------------------\n");
}

void uc_boyutlu_dizi_yaz4(int (*dizi)[4], int uzunluk1, int uzunluk2){
    printf("--- Uc Boyutlu Dizi Yaz4 ---\n");
    for(int i=0; i<uzunluk1; i++){
        for(int j=0; j<uzunluk2; j++){
            for(int k=0; k<4; k++)
                printf("%3d ",*(*(dizi+i*uzunluk2+j)+k));

            printf("\n");
        }
    }
    printf("----------------------------\n");
}

void foo(int *x){   // dizi[][3][4]  (*dizi)[3][4]
    printf("++++++++ %d ----------\n",*x);
}


int main(int argc, char** argv) {
    int A[]={1,3,5,6,7,8};
    //tek_boyutlu_dizi_yaz(A,sizeof(A)/4);
    int B[][4]={{1,2,3,4},{5,6,7,8},{9,10,11,12}};
    iki_boyutlu_dizi_yaz1(&B[0][0],3,4);
    iki_boyutlu_dizi_yaz2(B,3);
    iki_boyutlu_dizi_yaz3(&B);

    int C[][3][4]={{{1,2,3,4},{5,6,7,8},{9,10,11,12}},
                  {{13,14,15,16},{17,18,19,20},{21,22,23,24}}};
   // uc_boyutlu_dizi_yaz1(&C[0][0][0],2,3,4);
   // uc_boyutlu_dizi_yaz2(C,2);

    //uc_boyutlu_dizi_yaz3(&C);

    //uc_boyutlu_dizi_yaz4(&C[0][0],2,3);


    //foo(*(B+1)+2);
    //printf("C'nin adresi 0x%p   C'nin ilk elemanının adresi 0x%p\n",&C,C);  // &C[0]
    for(int i=0; i<2; i++){
        printf("-- 0x%p --   0x%p \n",C[i],*(C+i)); // C+i *(C+i)
        for(int j=0; j<3; j++){
            printf("0x%p\n",C[i][j]);
            for(int k=0; k<4; k++)
                printf("(0x%p %d) ", &C[i][j][k],C[i][j][k]);
            printf("\n");
        }
    }
    printf("----SON----\n");
    return (EXIT_SUCCESS);
}

