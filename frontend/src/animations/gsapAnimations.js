import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const revealHero = (target) => {
  gsap.fromTo(target,
    { opacity: 0, y: 30 },
    {
      duration: 1,
      opacity: 1,
      y: 0,
      ease: 'power3.out',
      stagger: 0.1,
    }
  );
};

export const animateOnScroll = (target) => {
  gsap.from(target, {
    scrollTrigger: {
      trigger: target,
      start: 'top 80%',
    },
    duration: 1,
    opacity: 0,
    y: 50,
    ease: 'power3.out',
  });
};

export const hoverScale = (target) => {
  gsap.to(target, {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out',
  });
};

export const hoverScaleExit = (target) => {
  gsap.to(target, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out',
  });
};
