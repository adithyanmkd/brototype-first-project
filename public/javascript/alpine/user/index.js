document.addEventListener('alpine:init', () => {
  Alpine.data('index', () => ({
    // return modal state
    returnOpen: false,

    // cancel modal state
    cancelOpen: false,
  }));
});
