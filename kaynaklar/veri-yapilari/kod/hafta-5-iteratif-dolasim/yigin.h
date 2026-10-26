/* 
 * File:   Yigin.h
 * Author: kadayif
 *
 * Created on 24 Ekim 2023 Salı, 16:23
 */


#ifndef YIGIN_H
#define	YIGIN_H

struct yigin_dugum{
   struct agac_dugum *veri;
   struct yigin_dugum *link;
};

struct yigin_dugum *yigin_dugum_olustur(struct agac_dugum*);
void yigin_ekle(struct agac_dugum*, struct yigin_dugum**);
struct agac_dugum* yigin_cikar(struct yigin_dugum**);
int yigin_bosmu(struct yigin_dugum*);
struct agac_dugum *yigin_goz_at(struct yigin_dugum*);





#endif	/* YIGIN_H */

