/**
 * FAQ on PDP - Above the fold
 */
let fold =
  document.getElementById('section-faq')?.parentElement?.offsetTop || 500;

window.addEventListener('scroll', function (e) {
  if (this.scrollY > fold - window.innerHeight) {
    if (window.runExperiment != 1) {
      window.runExperiment = 1;

      window._conv_q = window._conv_q || [];
      window._conv_q.push(['executeExperiment', '100412969']);

      console.log('Activated FAQs A/B Experiment');

      _conv_q.push(['triggerConversion', '100411732']);
    }
  }
});
