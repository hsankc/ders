#include <stdio.h>
#include <stdlib.h>

int main()
{
    //Pointer Nedir? & Pointer'a Pointer Nedir?

    /*
    int a = 10;

    int* ptr;
    int** ptr2;
    int*** ptr3;

    ptr = &a;

    printf("%d\n", a);      //a'nin değeri
    printf("%p\n", &a);     //a'nin adresi
    printf("%p\n", ptr);    //a'nin adresi
    printf("%d\n", *ptr);   //a'nin değeri
    printf("%p\n", &ptr);   //pointer'in adresi

    printf("-----------------------------\n");

    ptr2 = &ptr;

    printf("%p\n", ptr2);
    printf("%p\n", &ptr2);
    printf("%d\n", **ptr2);

    ptr3 = &ptr2;

    printf("-----------------------------\n");

    printf("%p\n", ptr3);       //ptr2'nin adresi
    printf("%p\n", *ptr3);      //ptr'nin adresi
    printf("%p\n", **ptr3);     //a'nın adresi
    printf("%d\n", ***ptr3);    //a'nın değeri
    */

    //Pointerlarin gercek kullanimi

    /*
    int x = 20;
    int* ptr;

    ptr = &x;


    printf("%d\n", x);

    sayinin_iki_kati(x);
    sayinin_uc_kati(ptr);

    printf("%d\n", x);
    */


    //Dizi ve pointerlarin benzerliği
    /*
    int x = 20;
    int* ptr;

    ptr = &x;


    int dizi[] = {1,2,3};

    printf("%d\n", dizi[0]);

    printf("%p\n", &dizi);
    printf("%p\n", &dizi[0]);
    printf("%p\n", &dizi[1]);
    printf("%p\n", &dizi[2]);

    printf("-------------------------\n");

    printf("%p\n", dizi); //dizi ile pointerin en büyük ortak özelliği
    printf("%p\n", ptr);

    printf("-------------------------\n");

    printf("%d\n", *ptr);
    printf("%d\n", *dizi);      //1
    printf("%d\n", *(dizi+1));  //2
    */

    //Statik ve Dinamik Dizi Nedir?

    //Static Array

    /*
    int dizi[] = {1,2,3};


    //Dynamic Array

    int* ptr = &dizi;
    */


    //Bir boyutlu dinamik dizi oluşturalım

    /*
    int* ptr;

    int sutun_sayisi, i;

    printf("Sutun sayisini giriniz.");
    scanf("%d", &sutun_sayisi);

    //malloc , rand() - include <stdlib.h>

    ptr = (int*)malloc(sizeof(int)* sutun_sayisi);


    for(i=0; i<sutun_sayisi; i++)
    {
        *(ptr+i) = rand()%100;
        printf("%d ", *(ptr+i));
    }
    */



    //İki boyutlu dinamik dizi oluşturalım

    /*int** ptr;
    int i, j, sutun_sayisi, satir_sayisi;

    printf("Satir sayisini giriniz: ");
    scanf("%d", &satir_sayisi);

    printf("Sutun sayisini giriniz: ");
    scanf("%d", &sutun_sayisi);

    ptr = (int**)malloc(sizeof(int*)*satir_sayisi);

    for(i=0;i<satir_sayisi;i++)
    {
        *(ptr+i) = (int*)malloc(sizeof(int)*sutun_sayisi);

        for(j=0;j<sutun_sayisi;j++)
        {
            *(*(ptr+i)+j) = rand()%100;
            printf("%d ", *(*(ptr+i)+j));
        }
    }*/



    int** matris;
    int sutun_sayisi, satir_sayisi;

    printf("Satir sayisini giriniz: ");
    scanf("%d", &satir_sayisi);

    printf("Sutun sayisini giriniz: ");
    scanf("%d", &sutun_sayisi);

    iki_boyutlu_matris_olustur(&matris, satir_sayisi, sutun_sayisi);
    matris_yaz(&matris,sutun_sayisi, satir_sayisi);


    return 0;
}

void matris_yaz(int*** matris,int sutun_sayisi, int satir_sayisi)
{
    int i,j;

    for(i=0;i<satir_sayisi;i++)
    {
        for(j=0;j<sutun_sayisi;j++)
        {
            printf("%d ", *(*(*matris+i)+j));

            if(j==sutun_sayisi-1)
            {
                printf("\n");
            }
        }
    }
}

void iki_boyutlu_matris_olustur(int*** matris,int satir_sayisi, int sutun_sayisi)
{
    int i,j;

    *matris = (int**)malloc(sizeof(int*)*satir_sayisi);

    for(i=0;i<satir_sayisi;i++)
    {
        *(*matris+i) = (int*)malloc(sizeof(int)*sutun_sayisi);

        for(j=0;j<sutun_sayisi;j++)
        {
            *(*(*matris+i)+j) = rand()%100;
        }
    }
}

void sayinin_iki_kati(int x)
{
    x = x*2;
}

void sayinin_uc_kati(int* ptr)
{
    *ptr = (*ptr) * 3;
}
