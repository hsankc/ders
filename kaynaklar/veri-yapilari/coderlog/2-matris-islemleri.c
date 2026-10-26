#include <stdio.h>
#include <stdlib.h>

void matris_olustur(int*** matris, int satir_sayisi, int sutun_sayisi)
{
    int i,j;

    *matris = (int**)malloc(sizeof(int*)*satir_sayisi);

    for(i=0;i<satir_sayisi;i++)
    {
        *(*matris+i) = (int*)malloc(sizeof(int)*sutun_sayisi);

        for(j=0;j<sutun_sayisi;j++)
        {
            *(*(*matris+i)+j) = rand()%3;
        }
    }
}

void matris_yaz(int** matris, int satir_sayisi, int sutun_sayisi)
{
    int i,j;

    for(i=0;i<satir_sayisi;i++)
    {
        for(j=0;j<sutun_sayisi;j++)
        {
            printf("%d ", *(*(matris+i)+j));
            if(j==sutun_sayisi-1)
            {
                printf("\n");
            }
        }

        if(i==satir_sayisi-1)
        {
            printf("\n");
        }
    }
}

int** matris_topla(int** m1,int satir1,int sutun1,
                   int** m2,int satir2,int sutun2)
{
    int i,j;

    int** m3;
    matris_olustur(&m3,satir1,sutun1);

    if(satir1==satir2 && sutun1==sutun2)
    {
        for(i=0;i<satir1;i++)
        {
            for(j=0;j<sutun1;j++)
            {
                //m3[i][j] = m1[i][j] + m2[i][j];
                (*(*(m3+i)+j)) = (*(*(m1+i)+j)) + (*(*(m2+i)+j));
            }
        }

        return m3;
    }
    else
    {
        printf("Satir ve sutun uyusmazligindan dolayi toplanamaz.\n");
        return;
    }
}

int** matris_carp(int** m1,int satir1,int sutun1,
                  int** m2,int satir2,int sutun2)
{
    int i,j,k;
    int** m3;

    matris_olustur(&m3,satir1,sutun2);

    if(sutun1==satir2)
    {
        for(i=0;i<satir1;i++)
        {
            for(j=0;j<sutun2;j++)
            {
                m3[i][j] = 0;
                for(k=0;k<sutun1;k++)
                {
                    m3[i][j] = m3[i][j] + m1[i][k]*m2[k][j];
                    //(*(m3+i)+j) = (*(m3+i)+j) + (*(*(m1+i)+k)) * (*(*(m2+k)+j));
                }
            }
        }
        return m3;
    }
    else
    {
        printf("Satir ve sutun uyusmazligindan dolayi carpilamaz.\n");
        return;
    }
}

int main()
{

    int** m1;
    int** m2;
    int** m3;
    int** m4;

    int satir1, sutun1, satir2, sutun2;

    printf("Satir sayisini girin: ");
    scanf("%d", &satir1);

    printf("Sutun sayisini girin: ");
    scanf("%d", &sutun1);

    printf("Satir2 sayisini girin: ");
    scanf("%d", &satir2);

    printf("Sutun2 sayisini girin: ");
    scanf("%d", &sutun2);

    matris_olustur(&m1,satir1,sutun1);
    matris_olustur(&m2,satir2,sutun2);

    matris_yaz(m1,satir1,sutun1);
    matris_yaz(m2,satir2,sutun2);

    m3 = matris_topla(m1,satir1,sutun1,
                      m2,satir2,sutun2);

    matris_yaz(m3,satir1,sutun1);

    m4 = matris_carp(m1,satir1,sutun1,
                     m2,satir2,sutun2);

    matris_yaz(m4,satir1,sutun2);


    return 0;
}
