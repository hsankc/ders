#include "yigin.h"
#include "ikiliAramaAgaci.h"
#include <stdio.h>
#include <stdlib.h>
struct yigin_dugum *yigin_dugum_olustur(struct agac_dugum* veri){
    struct yigin_dugum *d;
    d=(struct yigin_dugum*)malloc(sizeof(struct yigin_dugum));
    if(d==NULL){
        printf("Yer ayrilamadi... exit...");
        exit(1);
    }
    d->veri=veri;
    d->link =NULL;
    return d;
}

void yigin_ekle(struct agac_dugum *icerik, struct yigin_dugum **dugum_gostergesi){
    struct yigin_dugum *d=yigin_dugum_olustur(icerik);
    d->link = *dugum_gostergesi;
    *dugum_gostergesi=d;
}

struct agac_dugum* yigin_cikar(struct yigin_dugum **yigin_gostergesi){
    struct yigin_dugum *d;
    struct agac_dugum* icerik;
    if(*yigin_gostergesi == NULL) return NULL;
    d=*yigin_gostergesi;
    *yigin_gostergesi=(*yigin_gostergesi)->link;
    icerik=d->veri;
    free(d);   
    return icerik;
}

int yigin_bosmu(struct yigin_dugum *yigin_isaretcisi){
    if(yigin_isaretcisi == NULL) return 1;
    else return 0;
}

struct agac_dugum *yigin_goz_at(struct yigin_dugum *yigin_gostergesi){
    if(yigin_gostergesi==NULL) return NULL;
    return yigin_gostergesi->veri;
}




