document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Carousel initialization (Hero Carousel - existing)
  const heroCarousel = document.querySelector('#heroCarousel');
  if (heroCarousel) {
    new bootstrap.Carousel(heroCarousel, {
      interval: 10000,
      ride: 'carousel'
    });
  }

  // Flip card functionality for logos
  document.querySelectorAll('.flip-card').forEach(card => {
    let flipTimer;
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      clearTimeout(flipTimer);
    });
    card.addEventListener('mouseenter', () => {
      flipTimer = setTimeout(() => card.classList.add('flipped'), 1000);
    });
    card.addEventListener('mouseleave', () => {
      clearTimeout(flipTimer);
      card.classList.remove('flipped');
    });
  });

  // --- Video Playback Logic ---
  const allVideoCards = document.querySelectorAll('.video-card');
  allVideoCards.forEach(card => {
    const wrapper = card.querySelector('.video-crop-wrapper');
    if (wrapper) {
      card.dataset.originalHtml = wrapper.innerHTML;
    }

    card.addEventListener('click', function() {
      const isPlaying = wrapper && wrapper.classList.contains('video-is-playing');
      
      // Reset all other cards first
      allVideoCards.forEach(otherCard => {
        if (otherCard !== card) {
          const otherWrapper = otherCard.querySelector('.video-crop-wrapper');
          if (otherWrapper && otherWrapper.classList.contains('video-is-playing')) {
            otherWrapper.classList.remove('video-is-playing');
            otherWrapper.innerHTML = otherCard.dataset.originalHtml;
          }
        }
      });

      // Now, handle the clicked card
      if (wrapper && !isPlaying) {
        const videoSrc = card.getAttribute('data-video');
        wrapper.classList.add('video-is-playing');
        wrapper.innerHTML = `<video src="${videoSrc}" autoplay controls style="width:100%; height:100%; object-fit:contain;"></video>`;
        const newVideo = wrapper.querySelector('video');
        if (newVideo) {
          newVideo.addEventListener('ended', () => {
            wrapper.classList.remove('video-is-playing');
            wrapper.innerHTML = card.dataset.originalHtml;
          });
        }
      }
    });
  });

  // --- Infinite Scroller Logic ---
  function setupScroller(wrapperSelector) {
    const scrollerWrapper = document.querySelector(wrapperSelector);
    if (!scrollerWrapper) return;

    const viewport = scrollerWrapper.querySelector('.scroller-viewport, .logo-scroller-viewport');
    if (!viewport) return;

    const scrollerInner = viewport.querySelector('.scroller-inner, .logo-scroller-inner');
    if (!scrollerInner) return;

    // 1. Clone items for infinite loop
    const items = Array.from(scrollerInner.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      scrollerInner.appendChild(clone);
    });

    const firstItemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight, 10);
    let scrollAmount = 0;
    let isPaused = false;

    function animateScroll() {
      if (!isPaused) {
        scrollAmount += 0.5; // Adjust speed here
        if (scrollAmount >= firstItemWidth * items.length) {
          scrollAmount = 0; // Reset to loop
        }
        viewport.scrollLeft = scrollAmount;
      }
      requestAnimationFrame(animateScroll);
    }

    // 2. Draggable functionality
    let isDown = false;
    let startX;
    let scrollLeft;

    viewport.addEventListener('mousedown', (e) => {
      isDown = true;
      isPaused = true;
      viewport.classList.add('active');
      startX = e.pageX - viewport.offsetLeft;
      scrollLeft = viewport.scrollLeft;
    });

    viewport.addEventListener('mouseleave', () => {
      isDown = false;
      isPaused = false;
      viewport.classList.remove('active');
    });

    viewport.addEventListener('mouseup', () => {
      isDown = false;
      isPaused = false;
      viewport.classList.remove('active');
    });

    viewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - viewport.offsetLeft;
      const walk = (x - startX) * 2; // scroll-fast
      viewport.scrollLeft = scrollLeft - walk;
      scrollAmount = viewport.scrollLeft; // Update animation position
    });

    // Touch events
     viewport.addEventListener('touchstart', (e) => {
        isDown = true;
        isPaused = true;
        startX = e.touches[0].pageX - viewport.offsetLeft;
        scrollLeft = viewport.scrollLeft;
    });

    viewport.addEventListener('touchend', () => {
        isDown = false;
        isPaused = false;
    });

    viewport.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - viewport.offsetLeft;
        const walk = (x - startX) * 2;
        viewport.scrollLeft = scrollLeft - walk;
        scrollAmount = viewport.scrollLeft;
    });

    // Pause on hover
    scrollerWrapper.addEventListener('mouseenter', () => isPaused = true);
    scrollerWrapper.addEventListener('mouseleave', () => {
        if (!isDown) {
            isPaused = false;
        }
    });

    // Start the animation
    requestAnimationFrame(animateScroll);
  }

  // Initialize both scrollers
  setupScroller('.scroller-wrapper');
  setupScroller('.logo-scroller-wrapper');

  // Fade-in sections on scroll
  const sections = document.querySelectorAll('.fade-in-section');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px',
    threshold: 0.1
  });

  sections.forEach(section => {
    observer.observe(section);
  });
});
