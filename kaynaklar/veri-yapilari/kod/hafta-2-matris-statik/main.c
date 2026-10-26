/* 
 * File:   main.c
 * Author: BMB
 *
 * Created on 24 Eylül 2020
 */

#include <stdio.h>
#include <stdlib.h>

/*
 * 
 */

void dot_carpim(int *A, int *B, int *C, int eleman_sayisi){
    int i;
    for(i=0; i<eleman_sayisi; i++)
        *(C+i) = *(A+i) * *(B+i);
        
}

void tek_boyutlu_dizi_yaz(int *A, int eleman_sayisi){
    int i;
    for(i=0; i<eleman_sayisi; i++)
        printf("%4d", A[i]);
    printf("\n");
        
}

void matris_carpimi(int *A, int A_satir, int A_sutun,
                    int *B, int B_satir,int B_sutun,
                    int *C,int C_satir, int C_sutun){
    int i,j,k;
    if(A_sutun!=B_satir){
        printf("Carpim matrislerinin boyutlari uyusmuyor!!!");
        return;
    }
    else if(A_satir!=C_satir || B_sutun!=C_sutun){
        printf("Sonuc matrisinin boyutlari carpan matrislere uymuyor!!!\n");
        return;
    }
    else{
        for(i=0; i<A_satir; i++)
            for(j=0; j<B_sutun; j++){
                *(C+i*C_sutun+j)= 0;
                for(k=0; k<A_sutun; k++)
                    *(C+i*C_sutun+j)= *(C+i*C_sutun+j) + *(A+i*A_sutun +k)* *(B+k*B_sutun +j);
                    //C[i][j]=C[i][j]+A[i][k]*B[k][j];
            }   
    }
}


/*
void matris_carpimi(int A[][3], int A_satir, int A_sutun,
                    int B[][2], int B_satir,int B_sutun,
                    int C[][2],int C_satir, int C_sutun){
    int i,j,k;
    if(A_sutun!=B_satir){
        printf("Carpim matrislerinin boyutlari uyusmuyor!!!");
        return;
    }
    else if(A_satir!=C_satir || B_sutun!=C_sutun){
        printf("Sonuc matrisinin boyutlari carpan matrislere uymuyor!!!\n");
        return;
    }
    else{
        for(i=0; i<A_satir; i++)
            for(j=0; j<B_sutun; j++){
                C[i][j]=0;
                for(k=0; k<A_sutun; k++)
                    C[i][j]=C[i][j]+A[i][k]*B[k][j];
            }   
    }
} */

void matris_carpimi1(int A[][3], int A_satir, int A_sutun,
                    int B[][2], int B_satir,int B_sutun,
                    int C[][2],int C_satir, int C_sutun){
    int i,j,k;
    if(A_sutun!=B_satir){
        printf("Carpim matrislerinin boyutlari uyusmuyor!!!");
        return;
    }
    else if(A_satir!=C_satir || B_sutun!=C_sutun){
        printf("Sonuc matrisinin boyutlari carpan matrislere uymuyor!!!\n");
        return;
    }
    else{
        for(i=0; i<A_satir; i++)
            for(j=0; j<B_sutun; j++){
                *(*(C+i)+j)=0;
                for(k=0; k<A_sutun; k++)
                   (*(C+i))[j] =*(*(C+i)+j)+A[i][k]*B[k][j];
            }   
    }
}

void matris_yazA(int matris[][3], int satir){
    int i,j;
    for(i=0; i<satir; i++){
        for(j=0; j<3; j++) printf("%3d ",matris[i][j]);
        printf("\n");
    }
}

void matris_yazB(int matris[][2], int satir){
    int i,j;
    for(i=0; i<satir; i++){
        for(j=0; j<2; j++) printf("%3d ", matris[i][j]);
        printf("\n");
    }
}

void matris_yaz_genel(int *dizi,int satir_sayisi,int sutun_sayisi){
    int i,j;
    for(i=0; i<satir_sayisi; i++){
        for(j=0; j<sutun_sayisi;j++){
           printf("%3d",*(dizi+(i*sutun_sayisi+j)));            
        }
        printf("\n");
    }
    printf("\n");        
    
    
}
int main(int argc, char** argv) {
    
    int x[]={3,4,0,6,1};
    int y[]={2,-1,4,-2,3};
    int z[5];
    
    int A[][3]={{1,0,2},{2,1,4},{5,1,0},{0,2,3}};
    int B[][2]={{0,1},{2,4},{3,1}};
    int C[4][2];
    
    printf("----- Dizi x ----\n");
    tek_boyutlu_dizi_yaz(x,5);
    printf("\n");
    
    printf("----- Dizi y ----\n");
    tek_boyutlu_dizi_yaz(y,5);
    printf("\n");
    
    dot_carpim(x,y,z,5);
    
    printf("----- Dizi z ----\n");
    tek_boyutlu_dizi_yaz(z,5);
    printf("\n");
    
    
    printf("----Matris A ---\n");
    matris_yazA(A,4);
    
    printf("----Matris B ---\n");
    matris_yazB(B,3);
   
    matris_carpimi(&A[0][0], 4, 3, &B[0][0], 3, 2,
               &C[0][0], 4, 2);
    
    printf("----Matris C ---\n");
    matris_yazB(C,4);
    
    printf("----Matris A (genel) ---\n");
    matris_yaz_genel(&A[0][0],4,3);
    
    printf("----Matris B (genel) ---\n");
    matris_yaz_genel(&B[0][0],3,2);
    
    printf("----Matris C (genel) ---\n");
    matris_yaz_genel(&C[0][0],4,2);

    return (EXIT_SUCCESS);
}

