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
    const carousel = new bootstrap.Carousel(heroCarousel, {
      interval: 10000,
      ride: 'carousel'
    });
  }

  // Flip card functionality for logos
  document.querySelectorAll('.flip-card').forEach(card => {
    let flipTimer; // Variable to hold the timer

    // Manual flip on click
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      // Clear any running timer if they click
      clearTimeout(flipTimer);
    });

    // Start timer on hover
    card.addEventListener('mouseenter', () => {
      // Set a timer to flip the card after 1 second
      flipTimer = setTimeout(() => {
        card.classList.add('flipped');
      }, 1000); // 1 second
    });

    // Clear timer and flip back on mouse leave
    card.addEventListener('mouseleave', () => {
      // Clear the timer
      clearTimeout(flipTimer);
      // Flip the card back to the front
      card.classList.remove('flipped');
    });
  });

  // --- Video Playback Logic (for scroller testimonials) ---
  const allVideoCards = document.querySelectorAll('.video-card');

  allVideoCards.forEach(card => {
    // Store the initial state of the wrapper for resetting
    const wrapper = card.querySelector('.video-crop-wrapper');
    if (wrapper) {
      card.dataset.originalHtml = wrapper.innerHTML;
    }

    card.addEventListener('click', function() {
      // Reset all other cards to their initial image state
      allVideoCards.forEach(otherCard => {
        if (otherCard !== card) {
          const otherWrapper = otherCard.querySelector('.video-crop-wrapper');
          if (otherWrapper && otherWrapper.classList.contains('video-is-playing')) {
            otherWrapper.classList.remove('video-is-playing');
            otherWrapper.innerHTML = otherCard.dataset.originalHtml;
          }
        }
      });

      // Play the clicked video (if it's not already playing)
      if (wrapper && !wrapper.classList.contains('video-is-playing')) {
        const videoSrc = card.getAttribute('data-video');
        wrapper.classList.add('video-is-playing');
        wrapper.innerHTML = `<video src="${videoSrc}" autoplay controls style="width:100%; height:100%; object-fit:contain;"></video>`;

        // Pause the scroller animation if it's playing
        const scrollerInner = document.querySelector('.scroller-inner');
        if (scrollerInner) {
          scrollerInner.style.animationPlayState = 'paused';
        }

        // Add an event listener for when the video ends
        const newVideo = wrapper.querySelector('video');
        if (newVideo) {
          newVideo.addEventListener('ended', () => {
            wrapper.classList.remove('video-is-playing');
            wrapper.innerHTML = card.dataset.originalHtml;
            // Resume the scroller animation
            if (scrollerInner) {
              scrollerInner.style.animationPlayState = 'running';
            }
          });
        }
      }
    });

    // Add mouseleave event listener to stop video and resume scroller
    card.addEventListener('mouseleave', function() {
      const scrollerInner = document.querySelector('.scroller-inner'); // Get scroller here too
      if (wrapper && wrapper.classList.contains('video-is-playing')) {
        const currentVideo = wrapper.querySelector('video');
        if (currentVideo) {
          currentVideo.pause(); // Pause the video
        }
        wrapper.classList.remove('video-is-playing');
        wrapper.innerHTML = card.dataset.originalHtml; // Reset to image

        // Resume the scroller animation
        if (scrollerInner) {
          scrollerInner.style.animationPlayState = 'running';
        }
      }
    });
  });
});

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