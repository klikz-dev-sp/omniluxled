function activateOptimizeVariant() {
  dataLayer.push({ event: "optimize.activate" });
  console.log(dataLayer);
}

const targetEl = document.getElementById("product-comparison").parentElement;

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function handleScroll() {
  if (isElementInViewport(targetEl)) {
    activateOptimizeVariant();
  }
}

window.addEventListener("scroll", handleScroll);
