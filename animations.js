(function () {
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

  var targets = document.querySelectorAll(selectors.join(', '));

  /* Если IntersectionObserver недоступен — просто показываем всё */
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  /* Сбрасываем анимацию из CSS — будем управлять через классы */
  targets.forEach(function (el) {
    el.style.animationName = 'none';
    el.style.opacity = '0';

    var tag = el.tagName.toLowerCase();
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
      el.dataset.animType = 'up';
    } else {
      el.dataset.animType = 'left';
    }
  });

  /* Вставляем keyframes если их ещё нет */
  if (!document.getElementById('anim-keyframes')) {
    var style = document.createElement('style');
    style.id = 'anim-keyframes';
    style.textContent = [
      '@keyframes fadeUp {',
      '  from { opacity: 0; transform: translateY(10px); }',
      '  to   { opacity: 1; transform: translateY(0); }',
      '}',
      '@keyframes fadeLeft {',
      '  from { opacity: 0; transform: translateX(-12px); }',
      '  to   { opacity: 1; transform: translateX(0); }',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;
      var type = el.dataset.animType === 'up' ? 'fadeUp' : 'fadeLeft';

      el.style.animation = type + ' 0.45s ease both';
      observer.unobserve(el);
    });
  }, { threshold: 0.08 });

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
