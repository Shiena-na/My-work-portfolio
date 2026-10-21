(function () {
  var d = document, root = d.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Dark / light theme
  var mq = window.matchMedia && matchMedia('(prefers-color-scheme: dark)');
  var th = get('theme') || (mq && mq.matches ? 'dark' : 'light');
  root.setAttribute('data-theme', th);
  d.getElementById('theme').addEventListener('click', function () {
    th = th === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', th);
    set('theme', th);
  });

  // English / Filipino
  var lang = get('lang') || 'en', lb = d.getElementById('lang'), els = d.querySelectorAll('.i');
  els.forEach(function (e) { e.dataset.en = e.innerHTML; });
  function setLang(l) {
    lang = l;
    root.lang = l === 'tl' ? 'fil' : 'en';
    els.forEach(function (e) { e.innerHTML = l === 'tl' ? e.dataset.tl : e.dataset.en; });
    lb.innerHTML = l === 'tl' ? 'EN / <b>FIL</b>' : '<b>EN</b> / FIL';
    set('lang', l);
  }
  lb.addEventListener('click', function () { setLang(lang === 'en' ? 'tl' : 'en'); });
  if (lang === 'tl') setLang('tl');

  // Project filter
  var fb = d.querySelectorAll('.filter button');
  fb.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.f;
      fb.forEach(function (x) { x.classList.toggle('on', x === b); });
      d.querySelectorAll('.pj').forEach(function (p) { p.hidden = !(f === 'all' || p.dataset.cat === f); });
    });
  });

  // Scroll reveal
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('js');
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    d.querySelectorAll('.card,.pj,.job,.head,.certs li').forEach(function (e) { e.classList.add('rv'); io.observe(e); });
  }

  // Contact form: opens the visitor's email app with the message filled in
  var cf = d.getElementById('cf'), hint = d.getElementById('hint'), to = 'gawiranshiena@gmail.com';
  cf.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = cf.elements;
    var subject = encodeURIComponent('Portfolio message from ' + f.n.value.trim());
    var body = encodeURIComponent(f.m.value.trim() + '\n\n– ' + f.n.value.trim() + ' (' + f.e.value.trim() + ')');
    hint.textContent = lang === 'tl' ? 'Binubuksan ang iyong email app…' : 'Opening your email app…';
    location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
  });
})();
