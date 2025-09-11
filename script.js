// JavaScript (simplified)
window.addEventListener('scroll', () => {
  // Compute scroll position
  const container = document.querySelector('.stack-container');
  const cards = document.querySelectorAll('.stack-card');
  const offset = container.getBoundingClientRect().top;
  // For example: when user scrolls so container hits top, make top card sticky
  if (offset < 100) {
    cards[0].classList.add('sticky');
    // maybe also shift other cards
  } else {
    cards[0].classList.remove('sticky');
  }
  // Additional logic: when scrolling further, unstack or transition to next card
});
