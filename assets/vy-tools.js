// Veri Yapıları: ağaç çizimleri, heapify ve BST araçları, kısa sorular (eski sayfadan)
(function(){
  // ---- ağaç çizimi ----
  function svgTree(root, o){
    o = o || {};
    if(!root) return '<p class="muted" style="text-align:center">(boş ağaç)</p>';
    var i = 0, maxD = 0, ns = [];
    (function w(n, d){ if(!n) return; w(n.l, d+1); n.x = i++; n.d = d; if(d > maxD) maxD = d; ns.push(n); w(n.r, d+1); })(root, 0);
    var SX = 44, SY = 58, R = 18, PAD = 24;
    var W = PAD*2 + (i-1)*SX, H = PAD*2 + maxD*SY + (o.idx ? 12 : 0);
    var px = function(n){ return PAD + n.x*SX; }, py = function(n){ return PAD + n.d*SY; };
    var e = '', c = '';
    ns.forEach(function(n){ [n.l, n.r].forEach(function(ch){ if(ch) e += '<line class="te" x1="'+px(n)+'" y1="'+py(n)+'" x2="'+px(ch)+'" y2="'+py(ch)+'"/>'; }); });
    ns.forEach(function(n){
      var leaf = !n.l && !n.r;
      c += '<g class="tn'+(o.leaves && leaf ? ' leaf' : '')+'"><circle cx="'+px(n)+'" cy="'+py(n)+'" r="'+R+'"/>' +
           '<text x="'+px(n)+'" y="'+py(n)+'" dy="0.35em">'+n.k+'</text>' +
           (o.idx ? '<text class="ti" x="'+px(n)+'" y="'+(py(n)+R+11)+'">'+n.i+'</text>' : '') + '</g>';
    });
    return '<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" role="img" aria-label="'+(o.label||'ikili ağaç')+'">'+e+c+'</svg>';
  }
  function heapTree(a){
    var ns = a.map(function(k, i){ return {k:k, i:i}; });
    ns.forEach(function(n, i){ n.l = ns[2*i+1] || null; n.r = ns[2*i+2] || null; });
    return ns[0] || null;
  }
  function parse(s){ return (s.match(/-?\d+/g) || []).map(Number); }

  // ---- BST (dersin ekle / sil fonksiyonlarının aynısı) ----
  function bstInsert(root, k){
    var node = {k:k, l:null, r:null};
    if(!root) return node;
    var d = root;
    for(;;){
      if(k < d.k){ if(!d.l){ d.l = node; return root; } d = d.l; }
      else if(k > d.k){ if(!d.r){ d.r = node; return root; } d = d.r; }
      else return root;
    }
  }
  function bstBuild(keys){ var r = null; keys.forEach(function(k){ r = bstInsert(r, k); }); return r; }
  function bstDelete(root, x){
    var parent = null, d = root, sol = 0;
    while(d){ if(x < d.k){ parent = d; d = d.l; sol = 1; } else if(x > d.k){ parent = d; d = d.r; sol = 0; } else break; }
    if(!d) return {root:root, ok:false};
    var rep;
    if(!d.l) rep = d.r;
    else if(!d.r) rep = d.l;
    else {
      var d1 = d.l, d2 = null;
      while(d1.r){ d2 = d1; d1 = d1.r; }
      if(d2){ d2.r = d1.l; d1.l = d.l; }
      d1.r = d.r; rep = d1;
    }
    if(!parent) return {root:rep, ok:true};
    if(sol) parent.l = rep; else parent.r = rep;
    return {root:root, ok:true};
  }
  function pre(t){ return t ? [t.k].concat(pre(t.l), pre(t.r)) : []; }
  function ino(t){ return t ? ino(t.l).concat([t.k], ino(t.r)) : []; }
  function post(t){ return t ? post(t.l).concat(post(t.r), [t.k]) : []; }
  function h(t){ return t ? 1 + Math.max(h(t.l), h(t.r)) : 0; }
  function leaves(t){ return !t ? 0 : (!t.l && !t.r ? 1 : leaves(t.l) + leaves(t.r)); }
  function internal(t){ return (!t || (!t.l && !t.r)) ? 0 : 1 + internal(t.l) + internal(t.r); }
  function balanced(t){ return !t || (Math.abs(h(t.l) - h(t.r)) <= 1 && balanced(t.l) && balanced(t.r)); }

  // ---- heap (dersin buble_down / heapify'ının aynısı) ----
  function bubbleDown(a, n, i){
    while(2*i+1 < n){
      var l = 2*i+1, r = l+1, b = l;
      if(r < n && a[r] > a[l]) b = r;
      if(a[b] < a[i]) break;
      var t = a[i]; a[i] = a[b]; a[b] = t; i = b;
    }
  }
  function heapify(arr){
    var a = arr.slice(), steps = [];
    for(var i = Math.floor(a.length/2) - 1; i >= 0; i--){
      var k = a[i]; bubbleDown(a, a.length, i);
      steps.push('buble_down(i=' + i + ', anahtar ' + k + ')  →  ' + a.join(' '));
    }
    return {a:a, steps:steps};
  }

  // "50(25(,30),90)" biçimindeki ağaç tanımını okur
  function parseTree(s){
    s = s.replace(/\s+/g, ''); var i = 0;
    function node(){
      var m = s.slice(i).match(/^-?\d+/);
      if(!m) return null;
      i += m[0].length;
      var n = {k:+m[0], l:null, r:null};
      if(s[i] === '('){ i++; n.l = node(); if(s[i] === ',') i++; n.r = node(); if(s[i] === ')') i++; }
      return n;
    }
    return node();
  }
  document.querySelectorAll('[data-tree]').forEach(function(el){
    el.innerHTML = svgTree(parseTree(el.dataset.tree), {leaves:!!el.dataset.leaves, label:'ikili ağaç'});
  });

  // statik çizimler
  document.querySelectorAll('[data-heap]').forEach(function(el){
    el.innerHTML = svgTree(heapTree(parse(el.dataset.heap)), {idx:true, leaves:!!el.dataset.leaves, label:'heap: '+el.dataset.heap});
  });
  document.querySelectorAll('[data-bst]').forEach(function(el){
    el.innerHTML = svgTree(bstBuild(parse(el.dataset.bst)), {leaves:!!el.dataset.leaves, label:'ikili arama ağacı: '+el.dataset.bst});
  });

  // heapify aracı
  function runHeap(){
    var arr = parse(document.getElementById('hin').value);
    var r = heapify(arr);
    document.getElementById('hbefore').innerHTML = svgTree(heapTree(arr), {idx:true});
    document.getElementById('hafter').innerHTML = svgTree(heapTree(r.a), {idx:true});
    document.getElementById('hout').innerHTML = arr.length ? '<span><b>heap dizisi</b> ' + r.a.join(' ') + '</span><span><b>n</b> ' + arr.length + ' · buble_down i = ' + (Math.floor(arr.length/2)-1) + ' … 0</span>' : '';
    document.getElementById('hsteps').innerHTML = r.steps.map(function(s){ return '<span>' + s + '</span>'; }).join('') || '<span>(iç düğüm yok)</span>';
  }
  document.getElementById('hgo').addEventListener('click', runHeap);
  document.getElementById('hin').addEventListener('keydown', function(e){ if(e.key === 'Enter') runHeap(); });
  runHeap();

  // BST aracı
  var bst = null, note = '';
  function showBst(){
    document.getElementById('btree').innerHTML = svgTree(bst);
    document.getElementById('bout').innerHTML = bst ?
      (note ? '<span>' + note + '</span>' : '') +
      '<span><b>preorder </b> ' + pre(bst).join(' ') + '</span>' +
      '<span><b>inorder  </b> ' + ino(bst).join(' ') + '</span>' +
      '<span><b>postorder</b> ' + post(bst).join(' ') + '</span>' +
      '<span><b>yükseklik</b> ' + h(bst) + ' · <b>yaprak</b> ' + leaves(bst) + ' · <b>iç düğüm</b> ' + internal(bst) + ' · <b>dengeli</b> ' + (balanced(bst) ? 'evet (1)' : 'hayır (0)') + '</span>' : '';
  }
  function runBst(){ bst = bstBuild(parse(document.getElementById('bin').value)); note = ''; showBst(); }
  document.getElementById('bgo').addEventListener('click', runBst);
  document.getElementById('bin').addEventListener('keydown', function(e){ if(e.key === 'Enter') runBst(); });
  function runDel(){
    var x = parse(document.getElementById('bdel').value)[0];
    if(x === undefined) return;
    var r = bstDelete(bst, x); bst = r.root;
    note = r.ok ? 'sil(' + x + ') uygulandı' : x + ' ağaçta yok';
    showBst();
  }
  document.getElementById('bdelgo').addEventListener('click', runDel);
  document.getElementById('bdel').addEventListener('keydown', function(e){ if(e.key === 'Enter') runDel(); });
  runBst();

  // kısa cevaplı sorular
  var Q = [
    ['Dengeli ikili ağaç nedir?', 'Her düğümün sol ve sağ alt ağaçları arasındaki yükseklik farkı en fazla 1 olan ağaç.'],
    ['Heap veri yapısı dengeli ikili arama ağacı mıdır?', 'Hayır. Dengeli ikili ağaçtır ama arama ağacı değildir (sol < kök < sağ sırası yok).'],
    ['C\'de dizinin ismi neyi ifade eder?', 'Dizinin ilk elemanının adresini tutan sabit işaretçiyi.'],
    ['int dizi[]={1,2,3}; için dizi = dizi + 1 doğru mu?', 'Hayır. Dizi ismi sabit işaretçidir, atama yapılamaz (derleme hatası).'],
    ['Dizi elemanları neden aynı tipte olmak zorunda?', 'Ardışık tutulup adres taban + i·boyut ile hesaplandığı için her eleman aynı boyutta olmalı.'],
    ['BST\'de düğüm ekleme karmaşıklığı?', 'O(h). Dengeli ağaçta O(log n), en kötü durumda (doğrusal ağaç) O(n).'],
    ['Inorder çıktısı verilen BST çizilebilir mi?', 'Hayır. Inorder her zaman sıralıdır, birçok ağaç aynı çıktıyı verir.'],
    ['Preorder çıktısı verilen BST çizilebilir mi?', 'Evet. Preorder sırasıyla ekleyince aynı BST oluşur.'],
    ['heapify karmaşıklığı?', 'O(n).'],
    ['heapSort karmaşıklığı?', 'O(n log n): n−1 kez delete_max, her biri O(log n).'],
    ['delete_max ve heap\'e ekleme karmaşıklığı?', 'İkisi de O(log n) (ağacın yüksekliği kadar buble_down / buble_up).'],
    ['Bağlı listede silme karmaşıklığı?', 'O(n): silinecek düğümü bulmak için yürümek gerekir.'],
    ['n elemanlı max heap\'te en küçük eleman kaç farklı pozisyonda olabilir?', '⌈n/2⌉ = n − ⌊n/2⌋ (sadece yapraklarda: indeks n/2 … n−1).'],
    ['Heap\'te i indeksli düğümün çocukları ve ebeveyni?', 'Sol 2i+1, sağ 2i+2, ebeveyn (i−1)/2.'],
    ['heapify hangi düğümden başlar?', 'Yaprak olmayan en büyük indeksli düğümden (n/2 − 1), köke kadar buble_down.'],
    ['Ağacın yüksekliği nedir?', 'Kökten en uzak yaprağa giden yol üzerindeki düğüm sayısı.'],
    ['malloc ile ayrılan dizi elemanları ve main\'deki int **A nerede tutulur?', 'Elemanlar heap\'te; A yerel değişken olduğu için stack\'te (64-bit\'te 8 byte).'],
    ['Liste fonksiyonlarına liste başı neden ** ile gönderilir?', 'Fonksiyon liste başını değiştirebilsin diye; C\'de parametre kopyalanarak gider.'],
    ['Yığın hangi prensiple çalışır, işlemler kaç adım?', 'LIFO (son giren ilk çıkar). push/pop O(1).'],
    ['Çift yönlü listenin avantajı ve dezavantajı?', 'Avantaj: iki yönde dolaşma, işlemler kolaylaşır. Dezavantaj: düğüm başına fazladan işaretçi, daha çok bellek.'],
    ['Bitişik ve bitişik olmayan veri yapısına birer örnek?', 'Bitişik: dizi. Bitişik olmayan: bağlı liste.'],
    ['BST\'de iki çocuklu düğüm nasıl silinir?', 'Sol alt ağacın en sağındaki (veya sağ alt ağacın en solundaki) düğüm silinenin yerine geçer.'],
    ['C dizileri bellekte nasıl saklar?', 'Satır öncelikli (row-major): önce 0. satırın tüm elemanları, sonra 1. satır.'],
    ['İkili ağaç nedir?', 'Her düğümün en fazla 2 çocuğu olduğu ağaç.'],
    ['Inorder taraması aynı olan iki ikili ağaç aynı mıdır?', 'Hayır. Farklı ağaçlar aynı inorder çıktısını verebilir.'],
    ['Preorder taraması aynı olan iki ikili arama ağacı aynı mıdır?', 'Evet (anahtarlar farklıysa). Genel ikili ağaçta Hayır.'],
    ['Dengeli BST\'de iki yaprağın köke uzaklık farkı en fazla 1 midir?', 'Hayır. Denge koşulu alt ağaç yüksekliklerinde; yaprak derinlikleri 2 ve daha fazla farklı olabilir.'],
    ['Bir fonksiyonda yerel değişkenin adresini geri döndürmek anlamsal hataya yol açar mı?', 'Evet. Fonksiyon bitince yerel değişkenin stack\'teki yeri geri verilir, adres geçersiz kalır.'],
    ['int a=10; int *p=&a; int **q=&p; için *q ve **q nedir?', '*q = p = a\'nın adresi, **q = a\'nın değeri (10).'],
    ['Bellek sızıntısı (memory leak) nedir?', 'malloc ile ayrılan bloğun adresini kaybedip free etmemek; o bellek program bitene kadar kullanılamaz.']
  ];
  var esc = function(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  document.getElementById('quiz').innerHTML = Q.map(function(q, i){
    return '<div class="q"><p class="q-text">' + (i+1) + '. ' + esc(q[0]) + '</p><details><summary>Cevap</summary><div class="stack"><p>' + esc(q[1]) + '</p></div></details></div>';
  }).join('');

  // tümünü aç / kapat
  var btn = document.getElementById('toggleAll'), open = false;
  btn.addEventListener('click', function(){
    open = !open;
    document.querySelectorAll('main details').forEach(function(d){ d.open = open; });
    btn.textContent = open ? 'Tüm çözümleri kapat' : 'Tüm çözümleri aç';
  });
})();
