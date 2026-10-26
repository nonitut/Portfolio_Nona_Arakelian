(() => {
  document.documentElement.classList.add('js-ready');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(el, { y: 22, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: 0.75, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card, { y: 28 }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 55%', scrub: 0.5 }
    });
  });
  gsap.fromTo('.footer-title', { y: 35 }, {
    y: 0, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top 35%', scrub: 0.6 }
  });
})();
