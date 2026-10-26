// Veri Yapıları sayfası: görünüm yönlendirme ve ders kodu görüntüleyici
(function(){
  var REPO = 'https://github.com/hsankc/ders/blob/main/';
  var K = 'kaynaklar/veri-yapilari/kod/';
  var FILES = [
    ['Hafta 1 · Diziler', [['dizi/main.c', 'hafta-1-dizi/main.c']]],
    ['Hafta 2 · Matris çarpımı', [['statik/main.c', 'hafta-2-matris-statik/main.c'], ['dinamik/main.c', 'hafta-2-matris-dinamik/main.c']]],
    ['Hafta 3 · Listeler', [['liste/main.c', 'hafta-3-liste/main.c'], ['ciftYonluListe/main.c', 'hafta-3-cift-yonlu-liste/main.c']]],
    ['Hafta 4 · Yığın', [['yiginStatik/main.c', 'hafta-4-yigin-statik/main.c'], ['yiginDinamik/main.c', 'hafta-4-yigin-dinamik/main.c']]],
    ['Hafta 5 · İkili arama ağacı', [['ikiliAramaAgaci.c', 'hafta-5-ikili-arama-agaci/ikiliAramaAgaci.c'], ['ikiliAramaAgaci.h', 'hafta-5-ikili-arama-agaci/ikiliAramaAgaci.h'], ['main.c', 'hafta-5-ikili-arama-agaci/main.c']]],
    ['Hafta 5 · İteratif dolaşım', [['ikiliAramaAgaci.c', 'hafta-5-iteratif-dolasim/ikiliAramaAgaci.c'], ['yigin.c', 'hafta-5-iteratif-dolasim/yigin.c'], ['yigin.h', 'hafta-5-iteratif-dolasim/yigin.h'], ['main.c', 'hafta-5-iteratif-dolasim/main.c'], ['ikiliAramaAgaci.h', 'hafta-5-iteratif-dolasim/ikiliAramaAgaci.h']]],
    ['Hafta 6 · Heap', [['heap/main.c', 'hafta-6-heap/main.c']]]
  ];
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };

  document.getElementById('kod-list').innerHTML = FILES.map(function(g){
    return '<div class="card"><h3>' + esc(g[0]) + '</h3><div class="files">' + g[1].map(function(f){
      return '<a href="#kod" data-file="' + f[1] + '"><span class="ic c">C</span><span>' + esc(f[0]) + '</span></a>';
    }).join('') + '</div></div>';
  }).join('');

  document.getElementById('kod-list').addEventListener('click', function(e){
    var a = e.target.closest('a[data-file]');
    if(!a) return;
    e.preventDefault();
    var path = K + a.dataset.file, box = document.getElementById('kod-box'), pre = document.getElementById('kod-pre');
    document.getElementById('kod-title').textContent = a.dataset.file;
    document.getElementById('kod-gh').href = REPO + path;
    pre.textContent = 'Yükleniyor…';
    box.hidden = false;
    fetch(path).then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); })
      .then(function(t){ pre.textContent = t.replace(/\r\n/g, '\n'); })
      .catch(function(){ pre.textContent = 'Dosya burada açılamadı. "GitHub\'da aç" ile görebilirsin.'; });
    box.scrollIntoView({block:'start'});
  });

  var views = document.querySelectorAll('.view');
  function route(){
    var id = location.hash.slice(1);
    var v = document.querySelector('[data-view="' + id + '"]') ? id : 'home';
    views.forEach(function(el){ el.hidden = el.dataset.view !== v; });
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
