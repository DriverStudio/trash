(function () {

  /* ------------------------------------------
     Прогресс-бар чтения
     ------------------------------------------ */

  var progressBar = document.createElement('div');
  progressBar.id = 'read-progress';
  document.body.appendChild(progressBar);

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(progress, 100) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();


  /* ------------------------------------------
     Счётчик прочитанных блоков
     ------------------------------------------ */

  var counter = document.createElement('div');
  counter.id = 'block-counter';
  counter.innerHTML = 'Прочитано блоков: <span id="block-count">0</span>';
  document.body.appendChild(counter);

  var countEl = document.getElementById('block-count');
  var readCount = 0;

  function updateCounter() {
    countEl.textContent = readCount;
    counter.classList.add('visible');
  }


  /* ------------------------------------------
     Анимация появления + подсветка
     ------------------------------------------ */

  var selectors = [
    'h1', 'h2', 'h3', 'h4',
    'div.nonum_head',
    'div.definition',
    'div.theorem',
    'div.lemma',
    'div.axiom',
    'div.citation',
    'div.proof',
    'div.notice',
    'div.advice',
    'div.attention',
    'div.task',
    'div.example',
    'div.conclusion',
    'div.internet',
    'div.literature',
    'div.question',
    'div.one_question'
  ];

  var blockSelectors = [
    'div.definition', 'div.theorem', 'div.lemma', 'div.axiom',
    'div.citation', 'div.proof', 'div.notice', 'div.advice',
    'div.attention', 'div.task', 'div.example', 'div.conclusion',
    'div.internet', 'div.literature', 'div.question', 'div.one_question'
  ];

  var targets = document.querySelectorAll(selectors.join(', '));

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  targets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = el.tagName.match(/^H[1-4]$/) || el.classList.contains('nonum_head')
      ? 'translateY(10px)'
      : 'translateX(-12px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;

      el.style.opacity = '1';
      el.style.transform = 'none';

      /* Подсветка только для контентных блоков */
      var isBlock = blockSelectors.some(function (sel) {
        var tag = sel.split('.')[0];
        var cls = sel.split('.')[1];
        return el.tagName.toLowerCase() === tag && el.classList.contains(cls);
      });

      if (isBlock) {
        el.classList.remove('anim-highlight');
        void el.offsetWidth; /* reflow для перезапуска анимации */
        el.classList.add('anim-highlight');

        readCount++;
        updateCounter();

        el.addEventListener('animationend', function () {
          el.classList.remove('anim-highlight');
        }, { once: true });
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.08 });

  targets.forEach(function (el) {
    observer.observe(el);
  });


  /* ------------------------------------------
     3D tilt при наведении мыши
     ------------------------------------------ */

  var tiltSelectors = [
    'div.definition', 'div.theorem', 'div.lemma', 'div.axiom',
    'div.citation', 'div.proof', 'div.notice', 'div.advice',
    'div.attention', 'div.task', 'div.example', 'div.conclusion',
    'div.internet', 'div.literature', 'div.question', 'div.one_question'
  ];

  var tiltBlocks = document.querySelectorAll(tiltSelectors.join(', '));

  var MAX_TILT = 2; /* градусов */

  tiltBlocks.forEach(function (el) {
    el.style.willChange = 'transform, box-shadow';

    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;

      var rotateX = (-y * MAX_TILT).toFixed(2);
      var rotateY = ( x * MAX_TILT).toFixed(2);

      el.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
      el.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      el.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.07)';
    });

    el.addEventListener('mouseleave', function () {
      el.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      el.style.boxShadow = '';
    });
  });

})();
