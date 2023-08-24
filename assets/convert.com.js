/**
 * Opened Cart
 */
const cartObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (
      mutation.attributeName === 'class' &&
      mutation.target.classList.contains('opened-drawer')
    ) {
      if (window.runExperiment != 1) {
        window.runExperiment = 1;

        window._conv_q = window._conv_q || [];
        window._conv_q.push(['executeExperiment', '100412269']);

        console.log('Activated New Cart Upsell A/B Experiment');

        // trigger "opened cart drawer" goal
        _conv_q.push(['triggerConversion', '10046163']);
      }
    }
  });
});

cartObserver.observe(document.getElementById('cart-drawer'), {
  attributes: true,
});

/**
 * FAQ on PDP - Above the fold
 */
