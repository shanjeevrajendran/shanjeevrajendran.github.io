// Light motion, all of it skipped when the reader asks for reduced motion:
// tiles and sections rise in once as they enter the view, and in the Cloakroom tile
// the agent's copy starts with the real values and swaps to placeholders once.
(function () {
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var items = document.querySelectorAll('[data-reveal]');
  if (still || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // The recorded run plays, muted, only while it is on screen. Reduced motion keeps the poster frame.
  var run = document.querySelector('video.run');
  if (run && !still && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run.preload = 'auto'; run.play().catch(function () {}); }
        else run.pause();
      });
    }, { threshold: 0.25 }).observe(run);
  }

  var pane = document.querySelector('[data-swap]');
  if (!pane) return;
  var marks = pane.querySelectorAll('mark');
  var button = pane.querySelector('.swap');
  var masked = function (on) {
    marks.forEach(function (m) { m.classList.toggle('done', on); });
    button.setAttribute('aria-pressed', on ? 'false' : 'true');
    button.textContent = on ? 'Show real values' : 'Show placeholders';
  };
  button.hidden = false;
  button.addEventListener('click', function () {
    masked(button.getAttribute('aria-pressed') === 'true');
  });

  if (still) { masked(true); return; }
  button.disabled = true;
  setTimeout(function () {
    marks.forEach(function (m, i) {
      setTimeout(function () { m.classList.add('done'); }, i * 160);
    });
    setTimeout(function () { button.disabled = false; }, marks.length * 160);
  }, 1400);
})();
