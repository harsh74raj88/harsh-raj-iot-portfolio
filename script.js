/* =====================================================
   FINAL CLEAN SCRIPT.JS
   Features:
   - Cursor glow
   - Mobile menu
   - Scroll reveal
   - Active navbar
   - Hero status text rotation
   - Typing effect
   - 3D hover cards
   - Stats auto animation with HUD scan sound after first click
   - Simple pip sound on selected cards/buttons/tabs
===================================================== */


/* CURSOR GLOW */
const cursorGlow = document.getElementById("cursorGlow");

window.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;

  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});


/* MOBILE MENU */
const menuBtn = document.getElementById("menuBtn");
const navLinksBox = document.getElementById("navLinks");

if (menuBtn && navLinksBox) {
  menuBtn.addEventListener("click", () => {
    navLinksBox.classList.toggle("open");
  });

  navLinksBox.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinksBox.classList.remove("open");
    });
  });
}


/* SCROLL REVEAL */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


/* ACTIVE NAV LINK ON SCROLL */
const allSections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "home";

  allSections.forEach((section) => {
    const sectionTop = section.offsetTop - 170;

    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});


/* HERO STATUS TEXT ROTATION */
const statusText = document.querySelector(".status-text");

if (statusText) {
  const messages = [
    "● SYSTEM ONLINE",
    "● IOT CORE ACTIVE",
    "● PYTHON MODULE READY",
    "● SENSOR NETWORK LINKED",
    "● ESP32 INTERFACE READY",
  ];

  let messageIndex = 0;

  setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length;
    statusText.textContent = messages[messageIndex];
  }, 2400);
}


/* TYPING EFFECT */
const typingText = document.querySelector(".typing-text");

if (typingText) {
  const typingOriginalText = typingText.textContent.trim();
  typingText.textContent = "";

  let typingIndex = 0;

  function typeHeroText() {
    if (typingIndex < typingOriginalText.length) {
      typingText.textContent += typingOriginalText.charAt(typingIndex);
      typingIndex++;
      setTimeout(typeHeroText, 42);
    }
  }

  setTimeout(typeHeroText, 700);
}


/* 3D CARD HOVER EFFECT */
const hoverCards = document.querySelectorAll(
  ".skill-card, .project-card, .timeline-item, .mini-card, .arch-card, .cert-card, .stat-card, .about-panel, .system-panel"
);

hoverCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


/* =====================================================
   SIMPLE HUD SOUND SYSTEM
   Browser rule: sound starts after first user click
===================================================== */

let hudAudioContext = null;
let hudSoundReady = false;
let statsAnimated = false;

function unlockHudSound() {
  if (!hudAudioContext) {
    hudAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  hudSoundReady = true;
}

function playTone(frequency, duration, volume, type = "sine") {
  if (!hudSoundReady || !hudAudioContext) return;

  const oscillator = hudAudioContext.createOscillator();
  const gainNode = hudAudioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, hudAudioContext.currentTime);

  gainNode.gain.setValueAtTime(volume, hudAudioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    hudAudioContext.currentTime + duration
  );

  oscillator.connect(gainNode);
  gainNode.connect(hudAudioContext.destination);

  oscillator.start();
  oscillator.stop(hudAudioContext.currentTime + duration);
}


/* Small pip sound for selected tabs/cards/buttons */
function playPipSound() {
  playTone(850, 0.055, 0.045, "sine");
}


/* Scanner tick while stats percentage is loading */
function playScanTick() {
  playTone(720, 0.035, 0.035, "square");
}


/* Completion beep when stats complete */
function playCompleteBeep() {
  playTone(980, 0.07, 0.055, "sine");

  setTimeout(() => {
    playTone(1250, 0.055, 0.045, "triangle");
  }, 65);
}


/* HUD STATS COUNTER WITH SOUND */
const statNumbers = document.querySelectorAll(".stat-card strong");

function resetStats() {
  statNumbers.forEach((number) => {
    number.textContent = "0%";
  });
}

function animateNumber(element) {
  const finalValue = Number(element.dataset.count);

  if (Number.isNaN(finalValue)) return;

  let currentValue = 0;

  const timer = setInterval(() => {
    currentValue++;
    element.textContent = `${currentValue}%`;

    if (currentValue % 12 === 0) {
      playScanTick();
    }

    if (currentValue >= finalValue) {
      element.textContent = `${finalValue}%`;
      playCompleteBeep();
      clearInterval(timer);
    }
  }, 18);
}

function runStatsAnimationWithSound() {
  if (statsAnimated) return;

  statsAnimated = true;
  resetStats();

  statNumbers.forEach((number, index) => {
    setTimeout(() => {
      animateNumber(number);
    }, index * 220);
  });
}


/* First click unlocks sound and starts stats animation */
document.addEventListener(
  "click",
  () => {
    unlockHudSound();
    runStatsAnimationWithSound();
  },
  { once: true }
);


/* Pip sound only on selected clickable elements */
document.addEventListener("click", (event) => {
  const soundTarget = event.target.closest(
    ".nav-links a, .btn, .project-demo-btn, .project-card, .skill-card, .mini-card, .arch-card, .timeline-item, .cert-card, .stat-card"
  );

  if (soundTarget) {
    unlockHudSound();
    playPipSound();
  }
});