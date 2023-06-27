/**
 * Activate Optimize on scroll in view
 */
// function activateOptimizeVariant() {
//   dataLayer.push({ event: "optimize.activate" });
//   console.log(dataLayer);
// }

// const targetEl = document.getElementById("product-comparison").parentElement;

// function isElementInViewport(el) {
//   const rect = el.getBoundingClientRect();
//   return (
//     rect.bottom >= 0 &&
//     rect.right >= 0 &&
//     rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
//     rect.left <= (window.innerWidth || document.documentElement.clientWidth)
//   );
// }

// function handleScroll() {
//   if (isElementInViewport(targetEl)) {
//     activateOptimizeVariant();
//   }
// }

// window.addEventListener("scroll", handleScroll);

/**
 * Activate Optmize on Cart Open
 */
function activateOptimizeVariant() {
  dataLayer.push({ event: 'optimize.activate' });
  console.log(dataLayer);
}

const targetEl = document.getElementById('cart-drawer');

// create a new observer instance
const cartObserver = new MutationObserver(function (mutations) {
  console.log(mutations);
  mutations.forEach(function (mutation) {
    if (
      mutation.attributeName === 'class' &&
      mutation.target.classList.contains('opened-drawer')
    ) {
      activateOptimizeVariant();
    }
  });
});

// pass in the target node, as well as the observer options
cartObserver.observe(targetEl, { attributes: true });
