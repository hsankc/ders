/* 
 * File:   IkiliAramaAgacı.h
 * Author: kadayif
 *
 * Created on 24 Ekim 2023 Salı, 15:53
 */

#ifndef IKILIARAMAAGACI_H
#define	IKILIARAMAAGACI_H

struct agac_dugum {
    int anahtar;
    struct agac_dugum *sol;
    struct agac_dugum *sag;
};

struct agac_dugum* dugum_olustur(int);
int ikili_agac_bosmu(struct  agac_dugum*);
void ekle(struct agac_dugum**,int);
void inorder_yardimci(struct agac_dugum*);
void inorder(struct agac_dugum*);
void preorder_yardimci(struct agac_dugum*);
void preorder(struct agac_dugum*);
void postorder_yardimci(struct agac_dugum*);
void postorder(struct agac_dugum*);
int dugum_sayisi(struct agac_dugum*);
int yaprak_sayisi(struct agac_dugum*);
void sil(struct agac_dugum**, int);
void yoket(struct agac_dugum**);
int en_kisa_yol_uzunlugu(struct agac_dugum*);
int ikili_arama_agaci_yardimci(struct agac_dugum*, struct agac_dugum*);
int ikili_arama_agaci_mi(struct agac_dugum*);
int ikili_arama_agaci_mi_yeni(int arg_count, ...);
int ikili_arama_agaci_dengeli_yardimci(struct agac_dugum*, struct agac_dugum*);
int ikili_arama_agaci_dengeli_mi(struct agac_dugum*);
int ic_dugum_sayisi(struct agac_dugum*);

void iterative_inOrder(struct agac_dugum*);
void iterative_preOrder(struct agac_dugum*);
void iterative_postOrder(struct agac_dugum*);

#endif	/* IKILIARAMAAGACI_H */

