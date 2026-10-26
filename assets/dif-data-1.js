// Diferansiyel Denklemler: genel kısımlar ve 1–4. bölümler (Dr. Ahmet Mollaoğulları'nın ara sınav notlarından)
// Metinlerde $...$ satır içi, $$...$$ ayrı satır formül (KaTeX). **kalın** yazılabilir.
(function(){
  var R = String.raw;
  var D = window.DIF = window.DIF || {chapters: []};

  // ---------- hangi yöntem? (karar sırası)
  D.karar = [
    {q:R`Denklemi düzenle`, a:R`Önce $y' = f(x,y)$ ya da $M(x,y)\,dx + N(x,y)\,dy = 0$ biçiminde yaz. Yarım kalmış çarpımları aç, paydaları topla. Çoğu tanıma hatası düzenlemeden önce karar vermekten çıkıyor.`},
    {q:R`x'li ve y'li çarpanlar ayrılıyor mu?`, a:R`$f(x,y) = g(x)\,h(y)$ ya da $P_1(x)Q_1(y)\,dx + P_2(x)Q_2(y)\,dy = 0$ ise **değişkenlerine ayrılabilir** (5. bölüm). $Q_1(y)P_2(x)$'e böl, iki tarafın integralini al.`, go:5},
    {q:R`Denklem tek bir ifadenin fonksiyonu mu?`, a:R`$y' = \varphi(ax+by+c)$ ise $u = ax+by+c$; $y' = \dfrac{\varphi(xy)}{x^2}$ ise $u = xy$; $x + yy' = \varphi(x^2+y^2)$ ise $u = x^2+y^2$. Dönüşümden sonra denklem ayrılabilir olur (5. bölüm).`, go:5},
    {q:R`M ve N aynı dereceden homojen mi?`, a:R`$M(tx,ty) = t^n M(x,y)$ ve $N$ için de aynı $n$ ise ya da $y' = g(y/x)$ yazılabiliyorsa **homojen**: $y = zx$, $y' = z'x + z$ (6. bölüm). $x/y$ çok geçiyorsa $x = zy$ daha kolay.`, go:6},
    {q:R`İki doğrusal ifadenin oranı mı?`, a:R`$y' = \dfrac{a_1x+b_1y+c_1}{a_2x+b_2y+c_2}$: $\dfrac{a_1}{a_2} \ne \dfrac{b_1}{b_2}$ ise $x = u+h,\ y = v+k$ ile sabitleri yok et, sonra homojen. Oranlar **eşitse** $u = a_1x + b_1y$ dönüşümü (ayrılabilir hale gelir).`, go:6},
    {q:R`Tam mı? $\partial M/\partial y = \partial N/\partial x$`, a:R`Eşitse **tam diferansiyel**: $f = \int M\,dx + \varphi(y)$, $f_y = N$'den $\varphi$ bul, cevap $f(x,y) = c$ (7. bölüm). Eşit değilse **integral çarpanı** ara: $\dfrac{M_y - N_x}{N}$ sadece $x$'e bağlıysa $\lambda(x)$, $\dfrac{N_x - M_y}{M}$ sadece $y$'ye bağlıysa $\lambda(y)$.`, go:7},
    {q:R`y ve y' birinci kuvvette mi?`, a:R`$y' + P(x)y = Q(x)$ ise **lineer**: $\lambda = e^{\int P\,dx}$, $y = \frac{1}{\lambda}\left(\int \lambda Q\,dx + c\right)$ (8. bölüm). $y$'de lineer değil ama $x$'te lineerse ($y^2dx + (3xy-1)dy = 0$ gibi) $x(y)$ için çöz.`, go:8},
    {q:R`Sağda $y^n$ var mı?`, a:R`$y' + P(x)y = Q(x)y^n$, $n \ne 0,1$ ise **Bernoulli**: $z = y^{1-n}$ ile lineer olur (8. bölüm).`, go:8},
    {q:R`$y^2$ terimi ve verilmiş bir özel çözüm var mı?`, a:R`$y' + P(x)y = Q(x)y^2 + R(x)$ ve $y_1$ verilmişse **Riccati**: $y = y_1 + \frac{1}{u}$ ile doğrudan lineer; iki özel çözüm verilmişse $\dfrac{y-y_1}{y-y_2} = c\,e^{\int (y_1-y_2)Q\,dx}$ (8. bölüm).`, go:8}
  ];

  // ---------- yöntem tanıma testi
  D.yontemler = [['ayr', 'Ayrılabilir'], ['axby', 'u = ax+by+c'], ['xy', 'u = xy'], ['x2y2', 'u = x²+y²'], ['hom', 'Homojen (y = zx)'], ['kay', 'Kaydırma (x = u+h, y = v+k)'], ['tam', 'Tam diferansiyel'], ['carp', 'İntegral çarpanı'], ['lin', 'Lineer'], ['ber', 'Bernoulli'], ['ric', 'Riccati']];
  D.test = [
    {e:R`x(y-1)\,y' = y(x+1)`, a:['ayr'], w:R`$\frac{y-1}{y}dy = \frac{x+1}{x}dx$ diye ayrılıyor.`},
    {e:R`y' = (3x+3y+8)^2`, a:['axby'], w:R`Sağ taraf sadece $3x+3y+8$'in fonksiyonu: $u = 3x+3y+8$.`},
    {e:R`y' = \dfrac{xy+1}{x^2}`, a:['xy'], w:R`$\varphi(xy)/x^2$ biçiminde, $\varphi(u) = u+1$: $u = xy$.`},
    {e:R`y\,dy = (x^2+y^2-x)\,dx`, a:['x2y2'], w:R`$x + yy' = x^2+y^2$ yazılıyor: $u = x^2+y^2$.`},
    {e:R`(x^2-3y^2)\,dx + 2xy\,dy = 0`, a:['hom'], w:R`$M$ ve $N$ ikisi de 2. dereceden homojen.`},
    {e:R`(x-4y+7)\,dx + (2x-3y+4)\,dy = 0`, a:['kay'], w:R`$\frac{1}{2} \ne \frac{-4}{-3}$: $h = 1,\ k = 2$ ile kaydır, sonra homojen.`},
    {e:R`(3x-7y-3)\,dx + (3x-7y-7)\,dy = 0`, a:['axby'], w:R`Oranlar eşit ($\frac{3}{3} = \frac{-7}{-7}$), kaydırma işe yaramaz: $u = 3x - 7y$.`},
    {e:R`(2xy-\cos x)\,dx + (x^2-4y^2)\,dy = 0`, a:['tam'], w:R`$M_y = 2x = N_x$.`},
    {e:R`(y-xy^3)\,dx + x\,dy = 0`, a:['carp'], w:R`$M_y = 1-3xy^2 \ne N_x = 1$; $xy$'nin fonksiyonu olan çarpan $\frac{1}{(xy)^3}$.`},
    {e:R`(y^2+2x^2)\,dx + xy\,dy = 0`, a:['carp', 'hom'], w:R`$\frac{M_y-N_x}{N} = \frac{1}{x}$: $\lambda = x$. Homojen olarak da çözülür.`},
    {e:R`(x+1)y' - y = e^x(x+1)^2`, a:['lin'], w:R`$y' - \frac{1}{x+1}y = e^x(x+1)$.`},
    {e:R`y^2\,dx + (3xy-1)\,dy = 0`, a:['lin'], w:R`$x$'e göre lineer: $\frac{dx}{dy} + \frac{3}{y}x = \frac{1}{y^2}$.`},
    {e:R`y' + y = xy^3`, a:['ber'], w:R`$n = 3$: $z = y^{-2}$.`},
    {e:R`y' + 4xy = 2e^{-x^2}\sqrt{y}`, a:['ber'], w:R`$n = \frac{1}{2}$: $z = y^{1/2}$.`},
    {e:R`y' = (1-x)y^2 + (2x-1)y - x,\quad y_1 = 1`, a:['ric'], w:R`$y^2$ terimi var ve bir özel çözüm verilmiş.`},
    {e:R`x^2y\,dx - (x^3-y^3)\,dy = 0`, a:['hom'], w:R`İki katsayı da 3. dereceden homojen.`},
    {e:R`(ye^{xy}+3x^2)\,dx + (xe^{xy}-\cos y)\,dy = 0`, a:['tam'], w:R`$M_y = e^{xy} + xye^{xy} = N_x$.`},
    {e:R`\dfrac{\tan y}{\tan x}\,y' + \dfrac{\cos^2 y}{\cos^2 x} = 0`, a:['ayr'], w:R`$\tan y\sec^2 y\,dy = -\tan x \sec^2 x\,dx$.`},
    {e:R`xy' - y + x\sec^2\!\left(\tfrac{y}{x}\right) = 0`, a:['hom'], w:R`$y' = z - \sec^2 z$, $z = y/x$.`},
    {e:R`(12e^{2x}y^2 - y)\,dx = dy`, a:['ber'], w:R`$y' + y = 12e^{2x}y^2$, $n = 2$.`},
    {e:R`(1+x^2)y' + xy = x`, a:['ayr', 'lin'], w:R`$(1+x^2)y' = x(1-y)$ ayrılıyor; aynı zamanda lineer.`},
    {e:R`\dfrac{dy}{dx} = \dfrac{y}{x - y\cos(x/y)}`, a:['hom'], w:R`0. dereceden homojen; $x = zy$ seçmek kolay.`},
    {e:R`r' + r\cos\theta = \cos^3\theta`, a:['lin'], w:R`$r$ ve $r'$ birinci kuvvette: $\lambda = e^{\sin\theta}$.`},
    {e:R`(x+y)\,dx + (3x+3y-1)\,dy = 0`, a:['axby'], w:R`Her şey $x+y$ cinsinden: $u = x+y$.`},
    {e:R`y' + y^2 + (2x+1)y + (1+x+x^2) = 0,\ y_1=-x,\ y_2=-x-1`, a:['ric'], w:R`İki özel çözüm verilmiş: doğrudan kapalı formül.`}
  ];

  // ---------- notlarda dikkat edilecek yerler (derleyip/hesaplayıp kontrol edildi)
  D.dikkat = [
    {w:'3. bölüm, Soru 3.3', go:'3/3.3', t:R`$x^2+(y-1)^2=1$ bu denklemin çözümü **değil**: yerine koyunca iki taraf arasında $\frac{x^2}{(y-1)^2}$ kadar fark kalıyor. Sorunun cevabı "çözüm değildir".`},
    {w:'3. bölüm, Ödev b', go:'3/Ödev', t:R`$y=(x+3)e^{x}$, $y'+y=e^{-x}$'i sağlamaz. $y=(x+3)e^{-x}$ olsaydı sağlardı (özel çözüm).`},
    {w:'3. bölüm, Ödev c', go:'3/Ödev', t:R`$t=c_1\sin(z+c_2)$ ailesinin sağladığı denklem $z''-t(z')^3=0$; notta kuvvet 2 yazılmış, onunla sağlanmıyor.`},
    {w:'3. bölüm, Ödev g', go:'3/Ödev', t:R`$y=3(x-3)^2$ yazılan denklemi sağlamaz; $(y')^3-4xyy'+8y^2=0$ olsaydı $y=c(x-c)^2$ genel çözümünün $c=3$ özel çözümü olurdu.`},
    {w:'5. bölüm, Soru 5.3', go:'5/5.3', t:R`İki terim de $ds$ yazılmış. Değişken $u=f(s)$ olduğu için birinin $du$ olması gerekiyor; $\frac{1}{s}ds + s\ln u\,du=0$ diye çözüldü.`},
    {w:'5. bölüm, Alıştırma 11', go:'5/Alıştırma 11', t:R`$u=xy$ dönüşümünün işlemesi için ikinci terim $(x+x^2y)\,dy$ olmalı (klasik kitap sorusu); yazıldığı gibi $(x+xy^2)$ ile $\varphi(xy)/x^2$ biçimine girmiyor.`},
    {w:'6. bölüm, Alıştırma 4', go:'6/Alıştırma 4', t:R`Değişkenler $t$ ve $z$; $xe^{z/t}$'deki $x$ büyük ihtimalle $t$. Öyle çözüldü.`},
    {w:'7. bölüm, Soru 7.2–7.3', go:'7/7.2', t:R`Yazıldığı gibi tam **değil**: $M_y = 2\sin 2x$, $N_x = \sin 2x$. $M = 3x^2 + y\sin 2x$ (yani $2y\sin x\cos x$) olmalı; çözüm onunla yapıldı.`},
    {w:'7. bölüm, Teorem 7.1 ve Soru 7.8', go:'7/7.8', t:R`Teoremin doğru hali: $M = y\,f(xy)$, $N = x\,g(xy)$, yani $f$ ve $g$ **$xy$'nin fonksiyonu** olmalı. 7.8'de $f = 1-xy^2$ olduğu için şart sağlanmıyor; $T=\frac{1}{xM-yN} = -\frac{1}{x^2y^3}$ ile çarpınca denklem tam olmuyor (kontrol: $\frac{2}{x^2y^3} \ne \frac{1}{x^2y^3}$). Bu denklemin işe yarayan çarpanı 7.7'deki $\frac{1}{(xy)^3}$.`},
    {w:'8. bölüm, Lineer alıştırma 1, 4, 6', go:'8/Lineer 1', t:R`Bu üçünde çıkan integral ($\int \sin x\, e^{\sin x}dx$, $\int x^3e^{x^3}dx$, $\int y^5e^{-y^4/4}dy$) elementer fonksiyonlarla alınamıyor; muhtemelen yazım hatası. Çözüm formülle (integral işaretiyle) bırakıldı, olası doğru halleri de çözüldü.`}
  ];

  // ---------- son 10 dakika
  D.son = [
    R`Ayrılabilir: $P(x)dx + Q(y)dy = 0 \Rightarrow \int P\,dx + \int Q\,dy = c$`,
    R`$y'=\varphi(ax+by+c)$: $u=ax+by+c \Rightarrow x = \int \frac{du}{b\varphi(u)+a}$`,
    R`$y' = \frac{\varphi(xy)}{x^2}$: $u = xy \Rightarrow \frac{du}{u+\varphi(u)} = \frac{dx}{x}$`,
    R`$x + yy' = \varphi(x^2+y^2)$: $u = x^2+y^2 \Rightarrow \frac{du}{\varphi(u)} = 2\,dx$`,
    R`Homojen: $y = zx,\ y' = z'x + z \Rightarrow \frac{dx}{x} = \frac{dz}{g(z)-z}$`,
    R`Kaydırma: $a_1h+b_1k+c_1=0,\ a_2h+b_2k+c_2=0$; $x=u+h,\ y=v+k$`,
    R`Tam: $M_y = N_x$; $f = \int M dx + \varphi(y)$, $\varphi'(y) = N - \frac{\partial}{\partial y}\int M dx$`,
    R`Çarpan: $\frac{\lambda'}{\lambda} = \frac{N_x - M_y}{v_y M - v_x N}$; $\lambda(x)$: $\frac{M_y-N_x}{N}$, $\lambda(y)$: $\frac{N_x-M_y}{M}$`,
    R`Lineer: $\lambda = e^{\int P dx}$, $y = \frac{1}{\lambda}\left(\int \lambda Q\,dx + c\right)$`,
    R`Bernoulli: $z = y^{1-n}$, $z' + (1-n)Pz = (1-n)Q$`,
    R`Riccati: $y = y_1 + \frac{1}{u}$ (lineer) ya da $y = y_1 + u$ (Bernoulli)`,
    R`İki özel çözüm: $\frac{y-y_1}{y-y_2} = c\,e^{\int (y_1-y_2)Q\,dx}$`
  ];

  // ================= 1. BÖLÜM =================
  D.chapters.push({no:1, grp:'Temeller', title:'Türev ve integral hatırlatma', pages:'1–6',
   ozet:'Diferansiyel denklem çözerken her adımda türev ve integral alınır. Notlarda boş bırakılan bütün tablolar burada dolu; ayrıca denklemlerde en çok lazım olan integral teknikleri var.',
   konu:[
    {h:'Temel türevler', p:[R`Notlardaki 14 kuralın cevapları:`],
     f:[R`(c)' = 0 \qquad (x^n)' = nx^{n-1} \qquad (\ln x)' = \frac{1}{x} \qquad (e^x)' = e^x \qquad (a^x)' = a^x\ln a`,
        R`(\sin x)' = \cos x \qquad (\cos x)' = -\sin x \qquad (\tan x)' = \sec^2 x = 1+\tan^2 x \qquad (\cot x)' = -\csc^2 x`,
        R`(\sec x)' = \sec x\tan x \qquad (\csc x)' = -\csc x\cot x`,
        R`(\arcsin x)' = \frac{1}{\sqrt{1-x^2}} \qquad (\arccos x)' = -\frac{1}{\sqrt{1-x^2}} \qquad (\arctan x)' = \frac{1}{1+x^2}`]},
    {h:'Zincir kuralı', p:[R`$u = f(x)$ ise her kuralın sonuna $u'$ eklenir. Örnek: $(\sin u)' = u'\cos u$.`],
     f:[R`(u^n)' = n u^{n-1}u' \qquad (\ln u)' = \frac{u'}{u} \qquad (e^u)' = u'e^u \qquad (a^u)' = u'a^u\ln a`,
        R`(\tan u)' = u'\sec^2 u \qquad (\arcsin u)' = \frac{u'}{\sqrt{1-u^2}} \qquad (\arctan u)' = \frac{u'}{1+u^2}`]},
    {h:'Diferansiyel ve kısmi türev', p:[R`Tek değişkende $dy = f'(x)\,dx$. İki değişkende **tam diferansiyel**: $df = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy$. Kısmi türevde diğer değişken sabit sayılır: $f = x^2y$ için $f_x = 2xy$, $f_y = x^2$.`, R`Bu, 7. bölümün (tam diferansiyel denklemler) temeli: $M\,dx + N\,dy$ bir $df$ ise denklemin çözümü $f = c$ olur.`]},
    {h:'Temel integraller', p:[R`Notlardaki 13 kuralın cevapları (hepsine $+c$ eklenir):`],
     f:[R`\int 0\,dx = c \qquad \int dx = x \qquad \int a\,dx = ax \qquad \int x^m dx = \frac{x^{m+1}}{m+1}\ (m\ne-1) \qquad \int \frac{dx}{x} = \ln|x|`,
        R`\int \sin ax\,dx = -\frac{\cos ax}{a} \qquad \int \cos ax\,dx = \frac{\sin ax}{a} \qquad \int \sec^2 ax\,dx = \frac{\tan ax}{a} \qquad \int \csc^2 ax\,dx = -\frac{\cot ax}{a}`,
        R`\int \frac{dx}{\sqrt{a^2-x^2}} = \arcsin\frac{x}{a} \qquad \int \frac{dx}{a^2+x^2} = \frac{1}{a}\arctan\frac{x}{a} \qquad \int e^{ax}dx = \frac{e^{ax}}{a}`,
        R`\int \big(Af(x) + Bg(x)\big)dx = A\int f\,dx + B\int g\,dx`]},
    {h:'Belirsiz integralin özellikleri', f:[R`\frac{d}{dx}\left(\int f(x)\,dx\right) = f(x) \qquad \int f'(x)\,dx = f(x) + c \qquad \int df(x) = f(x) + c \qquad \int f(x)dx = \int f(u)du = \int f(t)dt`]},
    {h:'Denklemlerde en çok lazım olan integral teknikleri', ek:1, p:[
      R`**Payda türevi payda:** $\int \frac{f'(x)}{f(x)}dx = \ln|f(x)|$. Örnek: $\int \frac{x}{1+x^2}dx = \frac{1}{2}\ln(1+x^2)$, $\int \tan x\,dx = -\ln|\cos x|$.`,
      R`**Kısmi integrasyon:** $\int u\,dv = uv - \int v\,du$. $\int xe^{-x}dx = -(x+1)e^{-x}$, $\int x\cos 3x\,dx = \frac{x\sin 3x}{3} + \frac{\cos 3x}{9}$.`,
      R`**Basit kesirler:** $\frac{1}{x(1+x^2)} = \frac{1}{x} - \frac{x}{1+x^2}$, $\frac{1}{(3z-1)(z+1)}$ gibi paydaları ayır.`,
      R`**$e^{ax}$ ile trigonometrik:** $\int e^{ax}\cos bx\,dx = \frac{e^{ax}(a\cos bx + b\sin bx)}{a^2+b^2}$, $\int e^{ax}\sin bx\,dx = \frac{e^{ax}(a\sin bx - b\cos bx)}{a^2+b^2}$. Lineer denklemlerde çok çıkar.`,
      R`**$\ln$'leri topla:** $\ln|y| = \ln|x| + c$ ise $y = Cx$ yaz. Sabiti $\ln C$ almak cevabı sadeleştirir.`]}
   ],
   formul:[['Zincir kuralı', R`\frac{d}{dx}f(u) = f'(u)\,u'`], ['Tam diferansiyel', R`df = f_x\,dx + f_y\,dy`], ['Kısmi integrasyon', R`\int u\,dv = uv - \int v\,du`], ['Payda türevi', R`\int \frac{f'}{f}dx = \ln|f|`], ['Arctan', R`\int \frac{dx}{a^2+x^2} = \frac{1}{a}\arctan\frac{x}{a}`], ['Arcsin', R`\int \frac{dx}{\sqrt{a^2-x^2}} = \arcsin\frac{x}{a}`]],
   taktik:[R`Bir integrali emin olamıyorsan sonucun türevini al: türev içteki ifadeyi veriyorsa doğrudur.`, R`$\sqrt{a^2 - b^2x^2}$ görürsen önce $b$'yi dışarı al: $\sqrt{4-9x^2} = 3\sqrt{\frac{4}{9}-x^2}$.`],
   hata:[R`$(\cos x)' = -\sin x$ ve $\int \sin x\,dx = -\cos x$: iki eksi işareti en çok unutulan yer.`, R`$\int \frac{dx}{x} = \ln|x|$; mutlak değer çoğu zaman sabitin içine girer ama logaritmanın içi negatif olamaz.`],
   qs:[
    {id:'1.1', q:R`$u(t) = 2\tan t + \arctan(t^2)$ ise $u' = ?$`, st:[R`$(\tan t)' = \sec^2 t$, zincir kuralıyla $(\arctan t^2)' = \frac{2t}{1+t^4}$.`], ans:R`$u' = 2\sec^2 t + \dfrac{2t}{1+t^4}$`},
    {id:'1.2', q:R`$y = f(x)$ olmak üzere $x^3\sin y' = \ln(\cos y) + \dfrac{e^{\sin x}}{y}$ denkleminin her iki tarafının türevini alınız.`, tip:R`$y$ ve $y'$ de $x$'in fonksiyonu: her birinin türevinde zincir kuralı var.`,
     st:[R`Sol: çarpım kuralı, $(x^3)'\sin y' + x^3(\sin y')' = 3x^2\sin y' + x^3\cos(y')\,y''$.`, R`$(\ln\cos y)' = \frac{-\sin y \cdot y'}{\cos y} = -y'\tan y$.`, R`Bölüm kuralı: $\left(\frac{e^{\sin x}}{y}\right)' = \frac{\cos x\,e^{\sin x}\,y - e^{\sin x}y'}{y^2}$.`],
     ans:R`$3x^2\sin y' + x^3y''\cos y' = -y'\tan y + \dfrac{e^{\sin x}(y\cos x - y')}{y^2}$`},
    {id:'1.3', q:R`$y = x^3\sin(2x)$ fonksiyonunun diferansiyelini yazınız.`, st:[R`$dy = y'\,dx$, çarpım kuralı: $y' = 3x^2\sin 2x + 2x^3\cos 2x$.`], ans:R`$dy = \left(3x^2\sin 2x + 2x^3\cos 2x\right)dx$`},
    {id:'1.4', q:R`$f(x,y) = x^2\ln(xy)$ fonksiyonunun tam diferansiyelini bulunuz.`, st:[R`$f_x = 2x\ln(xy) + x^2\cdot\frac{y}{xy} = 2x\ln(xy) + x$`, R`$f_y = x^2\cdot\frac{x}{xy} = \frac{x^2}{y}$`], ans:R`$df = \big(2x\ln(xy) + x\big)dx + \dfrac{x^2}{y}\,dy$`},
    {id:'1.5', q:R`$\displaystyle\int e^x\sqrt{1+e^x}\,dx$ integralini hesaplayınız.`, st:[R`$u = 1+e^x$, $du = e^x dx$.`, R`$\int \sqrt{u}\,du = \frac{2}{3}u^{3/2}$.`], ans:R`$\dfrac{2}{3}(1+e^x)^{3/2} + c$`},
    {id:'1.6', q:R`$\displaystyle\int \frac{dx}{\sqrt{4-9x^2}}$ integralini hesaplayınız.`, st:[R`$u = 3x$, $du = 3dx$: $\frac{1}{3}\int\frac{du}{\sqrt{4-u^2}}$.`, R`$\int\frac{du}{\sqrt{a^2-u^2}} = \arcsin\frac{u}{a}$, $a = 2$.`], ans:R`$\dfrac{1}{3}\arcsin\dfrac{3x}{2} + c$`},
    {id:'1.7', q:R`$\displaystyle\int x\cos 3x\,dx$ integralini hesaplayınız.`, st:[R`Kısmi: $u = x$, $dv = \cos 3x\,dx$; $du = dx$, $v = \frac{\sin 3x}{3}$.`, R`$\frac{x\sin 3x}{3} - \int\frac{\sin 3x}{3}dx = \frac{x\sin 3x}{3} + \frac{\cos 3x}{9}$.`], ans:R`$\dfrac{x\sin 3x}{3} + \dfrac{\cos 3x}{9} + c$`}
   ]});

  // ================= 2. BÖLÜM =================
  D.chapters.push({no:2, grp:'Temeller', title:'Diferansiyel denklemleri tanıma ve sınıflandırma', pages:'7–12',
   ozet:'Diferansiyel denklem nedir, neden önemli; bağımlı ve bağımsız değişken, mertebe, derece, lineerlik ve homojenlik.',
   konu:[
    {h:'Diferansiyel denklem nedir?', p:[R`Bilinmeyen bir **fonksiyonun** türevlerini ($y', y'', \frac{dy}{dx}, \dots$) ya da diferansiyellerini ($dx, dy$) içeren denklemdir. Cevabı bir sayı ya da nokta değil, bir fonksiyondur.`, R`Türevli yazım: $y'' + 3xy' - 5y = 0$. Diferansiyelli yazım: $(x+y)\,dx - \sin x\,dy = 0$.`]},
    {h:'Notlardaki iki model', p:[R`**Bakteri:** artış hızı sayıyla orantılı: $N'(t) = kN(t)$, çözüm $N = Ae^{kt}$. $N(2)=500$, $N(4)=2000$ verilince $e^{2k} = 4$, yani $e^k = 2$ ve $A = 125$: $N(t) = 125\cdot 2^t$.`, R`**Hız:** ivme zamanla orantılı: $v'(t) = kt$, $v = \frac{k}{2}t^2 + c$. $v(2) = 8$, $v(4) = 20$ verilince $2k + c = 8$, $8k + c = 20$: $k = 2$, $c = 4$, yani $v(t) = t^2 + 4$.`]},
    {h:'Bağımlı ve bağımsız değişken', p:[R`Türevi alınan fonksiyon **bağımlı**, onun bağlı olduğu değişken **bağımsız** değişkendir. $\frac{dx}{dt}$'de bağımlı $x$, bağımsız $t$. Notta $y''$ yazılınca aslında $y''(x)$ kastedilir.`]},
    {h:'Mertebe ve derece', p:[R`**Mertebe:** en yüksek türevin mertebesi. **Derece:** o en yüksek türevin kuvveti (denklem türevlere göre polinom haline getirildikten sonra).`, R`Örnek: $5(y''')^4 + \sin x\,(y'')^5 + 5xy' = \cos x$: en yüksek türev $y'''$, 3. mertebe; kuvveti 4, 4. derece. $(y'')^5$'in kuvveti dereceyi etkilemez, çünkü en yüksek türev o değil.`]},
    {h:'Lineerlik', p:[R`n. mertebeden lineer denklem:`], f:[R`a_n(x)y^{(n)} + a_{n-1}(x)y^{(n-1)} + \cdots + a_1(x)y' + a_0(x)y = Q(x)`],
     p2:[R`**Lineer olmanın kontrol listesi:** bağımlı değişken ve türevleri 1. kuvvette; birbirleriyle çarpılmıyor ($yy'$ yok); $\sin y$, $e^y$, $\sqrt{y}$ gibi bir fonksiyonun içinde değil; katsayılar sadece bağımsız değişkene bağlı.`, R`$a_i$ sabitse **sabit katsayılı**, değilse **değişken katsayılı**. $Q(x) = 0$ ise **homojen**, değilse **homojen olmayan** lineer denklem.`]}
   ],
   formul:[['Genel lineer denklem', R`a_n(x)y^{(n)} + \cdots + a_1(x)y' + a_0(x)y = Q(x)`], ['Homojen lineer', R`Q(x) = 0`]],
   taktik:[R`Mertebe sorusunda önce en yüksek türevi bul, derece için sadece onun kuvvetine bak.`, R`Lineerlik sorusunda $y$'li her terimi tek tek kontrol et: $y^2$, $yy'$, $\sin y$, $(y')^2$ görürsen lineer değil.`, R`Homojenlik (2. bölümdeki anlamıyla) sadece lineer denklemler için sorulur: $Q(x) = 0$ mı?`],
   hata:[R`Bu bölümdeki "homojen" ($Q = 0$) ile 6. bölümdeki "homojen denklem" ($M$ ve $N$ aynı dereceden homojen fonksiyon) farklı kavramlar.`, R`Lineer olmayan denklemde "homojen mi" sorusu anlamsızdır; notlardaki sınıflandırma sorularında buna dikkat.`],
   qs:[
    {id:'2.1', q:R`$x, y \in \mathbb{R}$ olmak üzere $x - y = 0$ gibi bir denklemin çözümü ne ifade eder?`, ans:R`Denklemi sağlayan sonsuz sayıda $(x, y)$ ikilisi vardır; düzlemde işaretlenince $y = x$ doğrusunu oluştururlar. Yani çözüm bir sayı değil, bir noktalar kümesidir. Diferansiyel denklemde ise aranan bir fonksiyondur.`},
    {id:'2.2', q:R`Her denklemdeki bağımlı ve bağımsız değişkenleri belirleyiniz.`, subs:[
      {l:'a', q:R`$xy' + 2x = 0$`, ans:R`Bağımlı $y$, bağımsız $x$.`},
      {l:'b', q:R`$x\,d^2x + y\,dy^2 = x^2$`, ans:R`Türevi alınan $x$: bağımlı $x$, bağımsız $y$ (yani $x\,\frac{d^2x}{dy^2} + y = x^2$).`},
      {l:'c', q:R`$\dfrac{dx}{dt} + t^2 = 0$`, ans:R`Bağımlı $x$, bağımsız $t$.`},
      {l:'d', q:R`$\dfrac{d^2y}{du^2} + y = u^3$`, ans:R`Bağımlı $y$, bağımsız $u$.`}]},
    {id:'2.3', q:R`Mertebe ve derecelerini belirleyiniz.`, subs:[
      {l:'a', q:R`$y = f(x)$ için $x(y')^3 + 2x = 0$`, ans:R`1. mertebe, 3. derece.`},
      {l:'b', q:R`$u = f(y)$ için $y\,d^3u + u\,dy^3 = y^2$`, ans:R`$y\frac{d^3u}{dy^3} + u = y^2$: 3. mertebe, 1. derece.`},
      {l:'c', q:R`$x = f(t)$ için $\left(\dfrac{dx}{dt}\right)^2 + t^3 = 0$`, ans:R`1. mertebe, 2. derece.`},
      {l:'d', q:R`$5(y''')^4 + \sin x\,(y'')^5 + 5xy' = \cos x$`, ans:R`3. mertebe, 4. derece.`}]},
    {id:'2.4', q:R`Mertebe, derece, lineerlik ve homojenliğe göre sınıflandırınız.`, subs:[
      {l:'a', q:R`$y'' + 5y' + 6y = 0$`, ans:R`2. mertebe, 1. derece, sabit katsayılı lineer, homojen.`},
      {l:'b', q:R`$(y''')^2 + x^2y'' + x^4y' = x^2e^x$`, ans:R`3. mertebe, 2. derece; $(y''')^2$ yüzünden lineer değil.`},
      {l:'c', q:R`$y'' + 5y' + y^2 = 0$`, ans:R`2. mertebe, 1. derece; $y^2$ yüzünden lineer değil.`},
      {l:'d', q:R`$5y' + \sin y = 0$`, ans:R`1. mertebe, 1. derece; $\sin y$ yüzünden lineer değil.`},
      {l:'e', red:1, q:R`$s^3t^{(4)} + 2s(t'')^5 = e^s$`, ans:R`$t = t(s)$: 4. mertebe, 1. derece; $(t'')^5$ yüzünden lineer değil. (Bağımlı $t$, bağımsız $s$.)`},
      {l:'f', red:1, q:R`Bağımlı değişkeni $z$, bağımsız değişkeni $t$ olan değişken katsayılı 2. mertebe 3. derece bir denklem yazınız. Lineer midir?`, ans:R`Örnek: $t^2(z'')^3 + t\,z' + z = 0$. Lineer değildir, çünkü 3. derece olması için $z''$'nün küpü gerekir; lineer denklemde türevler 1. kuvvette olmalı. (Yani "3. derece" isteği lineerliği baştan imkânsız kılar.)`}]}
   ]});

  // ================= 3. BÖLÜM =================
  D.chapters.push({no:3, grp:'Temeller', title:'Açık, kapalı, genel, özel ve tekil çözüm', pages:'13–18',
   ozet:'Bir fonksiyonun ya da bağıntının denklemi sağlayıp sağlamadığını kontrol etmek ve genel, özel, tekil çözümü ayırt etmek.',
   konu:[
    {h:'Açık ve kapalı çözüm', p:[R`**Açık çözüm:** $y = f(x)$ biçiminde, $y$ yalnız. Örnek: $y = 3e^{2x}$, $y' - 2y = 0$'ı sağlar çünkü $y' = 6e^{2x}$ ve $6e^{2x} - 2\cdot 3e^{2x} = 0$.`, R`**Kapalı çözüm:** $g(x,y) = 0$ biçiminde. Örnek: $x^2+y^2 = 4$'ten iki kez türev: $x + yy' = 0$, sonra $1 + y'^2 + yy'' = 0$, bu da verilen denklemin kendisi.`]},
    {h:'Çözüm doğrulama algoritması', p:[R`1) **Türet:** bağıntıyı denklemin mertebesi kadar türevle (kapalıysa $y$'yi $x$'in fonksiyonu say). 2) **Yerine koy:** $y', y''$'yü $x, y$ cinsinden denklemde yerine yaz. 3) **Sadeleştir:** gerekirse orijinal bağıntıyı kısıt olarak kullan. 4) **Karşılaştır:** iki taraf her $x, y$ için eşitse çözümdür.`]},
    {h:'Genel, özel, tekil çözüm', p:[R`**Genel çözüm:** $n$. mertebe denklem için $n$ tane keyfi sabit içerir. **Özel çözüm:** sabitlere değer verilerek elde edilir. **Tekil (singüler) çözüm:** hiçbir sabit değeriyle genel çözümden elde edilemeyen çözüm (genel çözüm ailesinin zarfı).`, R`Örnek: $(y')^2 - xy' + y = 0$'ın genel çözümü $y = cx - c^2$; $c = 2$ için $y = 2x - 4$ özel çözüm; $y = \frac{x^2}{4}$ de denklemi sağlar ama hiçbir $c$ ile elde edilmez: tekil çözüm.`]},
    {h:'Bonus: Clairaut denklemi', ek:1, p:[R`$y = xy' + f(y')$ biçimindeki denklemlerin genel çözümü $y = cx + f(c)$: $y'$ yerine $c$ yazmak yeter. Ödevdeki (e) ve (f) bu tipte. Tekil çözüm, $x = -f'(c)$ ile $c$ yok edilerek bulunur.`]}
   ],
   formul:[['Genel çözüm', R`n.\ \text{mertebe} \Rightarrow n\ \text{keyfi sabit}`], ['Clairaut', R`y = xy' + f(y') \Rightarrow y = cx + f(c)`]],
   taktik:[R`"Genel mi özel mi" sorusunda sabit sayısına bak: sabit sayısı mertebeye eşitse genel, sabit yoksa (ya da sayılar verilmişse) özel.`, R`Kapalı bağıntıda sadeleştirirken orijinal bağıntıyı kullanmayı unutma; çoğu zaman son adım budur (3.2'de $e^{3x}$'i $y'$ cinsinden yazmak gibi).`],
   hata:[R`Sağlamadığını göstermek de bir cevaptır: 3.3 ve ödevdeki (b), (f), (g) çözüm değil.`, R`Kapalı türevde $\frac{d}{dx}(y^2) = 2yy'$; $y'$ çarpanını unutma.`],
   qs:[
    {id:'3.1', q:R`$y = 4 + \sin x$ fonksiyonunun $y + y'' - 4 = 0$ denkleminin bir açık çözümü olduğunu gösteriniz.`, st:[R`$y' = \cos x$, $y'' = -\sin x$.`, R`$y + y'' - 4 = 4 + \sin x - \sin x - 4 = 0$.`], ans:R`Denklem sağlanıyor: açık çözümdür.`},
    {id:'3.2', q:R`$e^{3x} + \ln(y^2) = 1$ bağıntısının $9y^2e^{3x} + 2y''y - 2y'^2 = 0$ denkleminin bir kapalı çözümü olduğunu gösteriniz.`,
     st:[R`Türev: $3e^{3x} + \frac{2y'}{y} = 0 \Rightarrow y' = -\frac{3}{2}ye^{3x}$.`, R`Bir daha: $y'' = -\frac{3}{2}\left(y'e^{3x} + 3ye^{3x}\right)$, yani $2yy'' = -3yy'e^{3x} - 9y^2e^{3x}$.`, R`Yerine koy: $9y^2e^{3x} + 2yy'' - 2y'^2 = -3yy'e^{3x} - 2y'^2$.`, R`$y' = -\frac{3}{2}ye^{3x}$ yaz: $\frac{9}{2}y^2e^{6x} - \frac{9}{2}y^2e^{6x} = 0$.`], ans:R`Denklem sağlanıyor: kapalı çözümdür.`},
    {id:'3.3', q:R`$x^2 + (y-1)^2 = 1$ bağıntısının $(y-1)^2y' + (y-1)y'' = -xy + x - x^2 - y^2 + 2y - 1$ denkleminin çözümü olup olmadığını araştırınız.`,
     st:[R`Türev: $2x + 2(y-1)y' = 0 \Rightarrow (y-1)y' = -x$.`, R`Bir daha: $y'^2 + (y-1)y'' = -1 \Rightarrow (y-1)y'' = -1 - y'^2$.`, R`Sol taraf: $(y-1)(-x) - 1 - y'^2 = -xy + x - 1 - \frac{x^2}{(y-1)^2}$.`, R`Sağ taraf: $-xy + x - \big(x^2 + (y-1)^2\big) = -xy + x - 1$ (bağıntı kullanıldı).`, R`İki taraf arasında $\frac{x^2}{(y-1)^2}$ fark var; sadece $x = 0$'da eşit.`], ans:R`Çözüm **değildir**.`},
    {id:'Ödev', q:R`Yanlarındaki denklemlerin genel veya özel çözümü olup olmadıklarını araştırınız.`, subs:[
      {l:'a', q:R`$y = ce^x$, $\quad y' = y$`, ans:R`$y' = ce^x = y$ ✓. 1 sabit, 1. mertebe: **genel çözüm**.`},
      {l:'b', q:R`$y = (x+3)e^x$, $\quad y' + y = e^{-x}$`, ans:R`$y' = (x+4)e^x$, $y' + y = (2x+7)e^x \ne e^{-x}$: **çözüm değil**. ($y = (x+3)e^{-x}$ olsaydı $y' + y = e^{-x}$ sağlanır, özel çözüm olurdu.)`},
      {l:'c', q:R`$t = c_1\sin(z + c_2)$, $\quad z'' - t(z')^2 = 0$`, ans:R`$z = f(t)$ say: $1 = c_1\cos(z+c_2)z'$, $z' = \frac{1}{c_1\cos(z+c_2)}$, $z'' = \frac{\sin(z+c_2)}{c_1^2\cos^3(z+c_2)}$. Bu $t(z')^3$'e eşit, $t(z')^2$'ye değil: yazıldığı gibi **çözüm değil**; $z'' - t(z')^3 = 0$'ın genel çözümüdür (2 sabit, 2. mertebe).`},
      {l:'d', q:R`$\ln y = c_1x^2 + c_2$, $\quad xyy'' - yy' - x(y')^2 = 0$`, ans:R`$y' = 2c_1xy$, $y'' = 2c_1y + 4c_1^2x^2y$. Yerine: $2c_1xy^2 + 4c_1^2x^3y^2 - 2c_1xy^2 - 4c_1^2x^3y^2 = 0$ ✓. 2 sabit, 2. mertebe: **genel çözüm**.`},
      {l:'e', red:1, q:R`$z = ct + \dfrac{3}{c}$, $\ z = f(t)$, $\quad z = tz' + \dfrac{3}{z'}$`, ans:R`$z' = c$: $tc + \frac{3}{c} = z$ ✓. 1 sabit, 1. mertebe: **genel çözüm** (Clairaut tipi). Bonus: $z^2 = 12t$ tekil çözümdür.`},
      {l:'f', q:R`$y = 3x + 4$, $\quad y = xy' + (y')^3$`, ans:R`$y' = 3$: $3x + 27 \ne 3x + 4$: **çözüm değil**. (Genel çözüm $y = cx + c^3$; $c = 3$ için $y = 3x + 27$ olurdu.)`},
      {l:'g', q:R`$y = 3(x-3)^2$, $\quad (y')^3 + 4xy' + 8y^2 = 0$`, ans:R`$y' = 6(x-3)$; yerine koyunca $72x^4 - 648x^3 + \dots \ne 0$: yazıldığı gibi **çözüm değil**. Klasik hali $(y')^3 - 4xyy' + 8y^2 = 0$ olsaydı $y = c(x-c)^2$ genel çözümünün $c = 3$ için **özel çözümü** olurdu.`}]}
   ]});

  // ================= 4. BÖLÜM =================
  D.chapters.push({no:4, grp:'Temeller', title:'Eğri aileleri, başlangıç ve sınır değer problemleri', pages:'19–22',
   ozet:'Verilen bir eğri ailesinin sağladığı en düşük mertebeli denklemi bulmak (sabitleri yok etmek) ve koşullarla sabitleri belirlemek.',
   konu:[
    {h:'Eğri ailesi', p:[R`$f(x, y, c_1, \dots, c_n) = 0$ her sabit seçimi için farklı bir eğri verir; hepsine eğri ailesi denir. $y = c_1x^2 + c_2$ iki parametreli parabol ailesidir.`]},
    {h:'Sabitleri yok etme', p:[R`$n$ sabit varsa ailenin denklemi **$n$. mertebeden** olur. Algoritma: 1) Bağıntıyı $n$ kez türevle. 2) Elde edilen $n+1$ denklemden $c_1, \dots, c_n$'yi yok et. 3) Geriye kalan $F(x, y, y', \dots, y^{(n)}) = 0$ aranan denklemdir.`, R`İpucu: sabiti önce yalnız bırak, sonra türev al: $y = k\sin x$ ise $k = \frac{y}{\sin x}$; türevi sıfır: $\frac{y'\sin x - y\cos x}{\sin^2 x} = 0$.`]},
    {h:'Başlangıç ve sınır değer problemi', p:[R`Koşulların hepsi **tek noktada** verilmişse (ör. $y(0) = 3$, $y'(0) = 4$) **başlangıç değer problemi**; **farklı noktalarda** verilmişse (ör. $y(0) = 3$, $y(\frac{\pi}{2}) = 5$) **sınır değer problemi**.`, R`Notlardaki örnek: $y'' + y = 0$'ın genel çözümü $y = c_1\cos x + c_2\sin x$. $y(0) = 3,\ y'(0) = 4$ ile $y = 3\cos x + 4\sin x$; $y(0) = 3,\ y(\frac{\pi}{2}) = 5$ ile $y = 3\cos x + 5\sin x$.`]},
    {h:'Sık çıkan aileler ve denklemleri', ek:1, p:[R`$y = c_1e^{ax} + c_2e^{-ax} \Rightarrow y'' = a^2y$; $\ y = c_1\cos ax + c_2\sin ax \Rightarrow y'' + a^2y = 0$; $\ y = c_1e^{ax} + c_2e^{bx} \Rightarrow y'' - (a+b)y' + aby = 0$. Bu kalıpları bilmek sabit yok etmeyi saniyeye indirir.`]}
   ],
   formul:[['Sabit sayısı', R`n\ \text{sabit} \Rightarrow n.\ \text{mertebe denklem}`], [R`$y''+a^2y=0$`, R`y = c_1\cos ax + c_2\sin ax`], [R`$y''-a^2y=0$`, R`y = c_1e^{ax} + c_2e^{-ax}`]],
   taktik:[R`Tek sabit varsa: sabiti yalnız bırak, türev al, sabit kendiliğinden gider.`, R`İki sabit varsa: iki türev al; genelde $y''$ ilk sabiti, sonra $y'$ ikincisini verir.`, R`Başlangıç değer sorusunda önce genel çözümü bul, koşulları en son uygula.`],
   hata:[R`Mertebeyi sabit sayısından fazla alma: "en düşük mertebe" isteniyor.`, R`$y'(0)$ koşulunu uygulamak için önce genel çözümün türevini al; çoğu kişi $y$'ye uygular.`],
   qs:[
    {id:'4.1', q:R`$y = k\sin x$ eğri ailesinin sağladığı en düşük mertebeden diferansiyel denklemi elde ediniz.`, st:[R`$y' = k\cos x$, yani $k = \frac{y'}{\cos x}$.`, R`$y = \frac{y'}{\cos x}\sin x = y'\tan x$.`], ans:R`$y' = y\cot x$ (ya da $y'\sin x - y\cos x = 0$)`},
    {id:'4.2', q:R`$y = c_1x^2 + c_2$ ailesinin sağladığı en düşük mertebeden denklemi elde ediniz.`, st:[R`İki sabit: iki türev. $y' = 2c_1x$, $y'' = 2c_1$.`, R`$y' = x\cdot 2c_1 = xy''$.`], ans:R`$xy'' - y' = 0$`},
    {id:'4.3', q:R`$y'' = 4x - e^{2x}$, $\ y(0) = 3$, $\ y'(0) = 4$ başlangıç değer problemini çözünüz.`, st:[R`Bir kez integral: $y' = 2x^2 - \frac{e^{2x}}{2} + c_1$. $y'(0) = -\frac{1}{2} + c_1 = 4 \Rightarrow c_1 = \frac{9}{2}$.`, R`Bir daha: $y = \frac{2}{3}x^3 - \frac{e^{2x}}{4} + \frac{9}{2}x + c_2$. $y(0) = -\frac{1}{4} + c_2 = 3 \Rightarrow c_2 = \frac{13}{4}$.`], ans:R`$y = \dfrac{2}{3}x^3 - \dfrac{e^{2x}}{4} + \dfrac{9}{2}x + \dfrac{13}{4}$`},
    {id:'Ödev', q:R`Aşağıdaki eğri ailelerinin sağladığı en düşük mertebeden diferansiyel denklemleri elde ediniz.`, subs:[
      {l:'a', q:R`$y = (c + \sin x)^2$`, ans:R`$\sqrt{y} = c + \sin x \Rightarrow \frac{y'}{2\sqrt{y}} = \cos x$: $\ (y')^2 = 4y\cos^2 x$`},
      {l:'b', q:R`$(x-a)^2 + (y-b)^2 = 9$`, ans:R`İki sabit. $(x-a) + (y-b)y' = 0$; $1 + y'^2 + (y-b)y'' = 0$. Buradan $y - b = -\frac{1+y'^2}{y''}$, $x - a = \frac{y'(1+y'^2)}{y''}$; yerine: $\ (1+y'^2)^3 = 9(y'')^2$`},
      {l:'c', red:1, q:R`$u^2 - 3z^2 = cz$, $\ z = f(u)$`, ans:R`$c = \frac{u^2}{z} - 3z$; $u$'ya göre türev: $\frac{2uz - u^2z'}{z^2} - 3z' = 0$: $\ z' = \dfrac{2uz}{u^2 + 3z^2}$`},
      {l:'d', q:R`$x^2y^2 = 4cx$`, ans:R`$xy^2 = 4c \Rightarrow y^2 + 2xyy' = 0$: $\ y + 2xy' = 0$`},
      {l:'e', q:R`$y = (\ln x + c)\,x$`, ans:R`$\frac{y}{x} = \ln x + c \Rightarrow \frac{xy' - y}{x^2} = \frac{1}{x}$: $\ xy' = x + y$`},
      {l:'f', q:R`$y = c_1x + c_2e^{-x}$`, ans:R`$y'' = c_2e^{-x}$, $y' = c_1 - c_2e^{-x} \Rightarrow c_1 = y' + y''$. Yerine: $\ (x+1)y'' + xy' - y = 0$`},
      {l:'g', q:R`$y = c_1e^{2x} + c_2e^{-2x}$`, ans:R`$y'' = 4c_1e^{2x} + 4c_2e^{-2x} = 4y$: $\ y'' - 4y = 0$`},
      {l:'h', q:R`$y = e^{x^2 + 2xc + 2}$`, ans:R`$\ln y = x^2 + 2cx + 2$, $\frac{y'}{y} = 2x + 2c \Rightarrow c = \frac{y'}{2y} - x$. Yerine: $\ xy' = y\,(\ln y + x^2 - 2)$`},
      {l:'i', q:R`$y = c_1\cos 3x + c_2\sin 3x$`, ans:R`$y'' = -9y$: $\ y'' + 9y = 0$`}]}
   ]});
})();
