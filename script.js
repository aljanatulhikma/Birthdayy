/* =========================================================
   BIRTHDAY WEBSITE FOR JUSTIN — MAIN SCRIPT
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============= LOADING SCREEN ============= */
  const loadingScreen = document.getElementById('loading-screen');
  const loadingLine = document.getElementById('loadingLine');
  const loadingBarFill = document.getElementById('loadingBarFill');
  const loadingStars = document.getElementById('loadingStars');

  // small starfield inside loading screen
  createStars(loadingStars, 40);

  const loadingMessages = ['Connecting to Batcave...', 'Loading Memories...'];
  let msgIndex = 0;
  loadingLine.textContent = loadingMessages[0];

  const loadingMsgInterval = setInterval(() => {
    msgIndex++;
    if (msgIndex < loadingMessages.length) {
      loadingLine.style.opacity = 0;
      setTimeout(() => {
        loadingLine.textContent = loadingMessages[msgIndex];
        loadingLine.style.opacity = 1;
      }, 300);
    }
  }, 1100);

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 18 + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      clearInterval(loadingMsgInterval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }, 400);
    }
    loadingBarFill.style.width = progress + '%';
  }, 260);

  /* ============= GLOBAL STARS ============= */
  const starsLayer = document.getElementById('starsLayer');
  createStars(starsLayer, 70);

  function createStars(container, count) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = Math.random() * 100 + '%';
      star.style.left = Math.random() * 100 + '%';
      star.style.animationDelay = (Math.random() * 3) + 's';
      star.style.animationDuration = (2 + Math.random() * 3) + 's';
      const size = Math.random() * 2 + 1;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      container.appendChild(star);
    }
  }

  /* ============= RAIN CANVAS ============= */
  const canvas = document.getElementById('rain-canvas');
  const ctx = canvas.getContext('2d');
  let raindrops = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const isMobile = window.innerWidth < 768;
  const dropCount = isMobile ? 45 : 90;

  for (let i = 0; i < dropCount; i++) {
    raindrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 18 + 8,
      speed: Math.random() * 5 + 4,
      opacity: Math.random() * 0.25 + 0.08
    });
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(180, 200, 220, 0.5)';
    ctx.lineWidth = 1;
    raindrops.forEach(drop => {
      ctx.globalAlpha = drop.opacity;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.stroke();
      drop.y += drop.speed;
      if (drop.y > canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * canvas.width;
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawRain);
  }
  drawRain();

  /* ============= GOLD PARTICLES ============= */
  function spawnGoldParticle() {
    const particle = document.createElement('div');
    particle.className = 'gold-particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.bottom = '0px';
    const duration = Math.random() * 8 + 8;
    particle.style.animationDuration = duration + 's';
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
  }
  setInterval(spawnGoldParticle, 900);

  /* ============= MOUSE GLOW (desktop only) ============= */
  const mouseGlow = document.getElementById('mouseGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseGlow.style.left = e.clientX + 'px';
      mouseGlow.style.top = e.clientY + 'px';
      mouseGlow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => {
      mouseGlow.classList.remove('active');
    });
  }

  /* ============= SCROLL REVEAL ============= */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ============= ENTER BUTTON ============= */
  const enterBtn = document.getElementById('enterBtn');
  const storyIntroSection = document.getElementById('storyRows');
  enterBtn.addEventListener('click', () => {
    playMusic();
    storyIntroSection.scrollIntoView({ behavior: 'smooth' });
  });

  /* ============= MUSIC PLAYER ============= */
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicPlayer = document.getElementById('musicPlayer');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const volumeSlider = document.getElementById('volumeSlider');
  const progressTrack = document.getElementById('progressTrack');
  const progressFill = document.getElementById('progressFill');
  const autoplayPopup = document.getElementById('autoplayPopup');

  bgMusic.volume = 0.6;
  let musicWasPlayingBeforeLetter = false;
  let userVolume = 0.6;

  function playMusic() {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        musicPlayer.classList.add('playing');
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        autoplayPopup.classList.remove('show');
      }).catch(() => {
        autoplayPopup.classList.add('show');
      });
    }
  }

  function pauseMusic() {
    bgMusic.pause();
    musicPlayer.classList.remove('playing');
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  autoplayPopup.addEventListener('click', () => {
    playMusic();
  });

  volumeSlider.addEventListener('input', (e) => {
    userVolume = e.target.value / 100;
    bgMusic.volume = userVolume;
  });

  bgMusic.addEventListener('timeupdate', () => {
    if (bgMusic.duration) {
      const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
      progressFill.style.width = percent + '%';
    }
  });

  progressTrack.addEventListener('click', (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    if (bgMusic.duration) {
      bgMusic.currentTime = percent * bgMusic.duration;
    }
  });

  bgMusic.addEventListener('error', () => {
    console.warn('File musik tidak ditemukan. Website tetap berjalan normal.');
  });

  /* try gentle autoplay on load (muted-friendly fallback) */
  setTimeout(() => {
    const p = bgMusic.play();
    if (p !== undefined) {
      p.then(() => {
        musicPlayer.classList.add('playing');
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      }).catch(() => {
        autoplayPopup.classList.add('show');
      });
    }
  }, 1500);

  /* ============= PHOTOS: MANIFEST MODE OR NUMBERED FALLBACK ============= */
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryImages = [];

  // Coba baca images/photos.txt dulu (daftar nama file bebas, satu per baris).
  // Kalau ada dan berisi, sistem ini dipakai (tidak perlu rename foto apa pun).
  // Kalau tidak ada / kosong / gagal dibaca, otomatis kembali ke sistem lama
  // yaitu mencari images/1.jpg sampai images/20.jpg.
  fetch('images/photos.txt', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('manifest not found');
      return res.text();
    })
    .then(text => {
      const files = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

      if (files.length === 0) throw new Error('manifest empty');
      loadPhotosFromManifest(files);
    })
    .catch(() => {
      loadPhotosNumberedFallback();
    });

  function loadPhotosFromManifest(files) {
    // 11 foto pertama dipasang ke slot bab 1-5, sisanya masuk ke galeri.
    const chapterSlots = document.querySelectorAll('[data-slot]');

    chapterSlots.forEach(imgEl => {
      const slotIndex = parseInt(imgEl.dataset.slot, 10) - 1;
      const frame = imgEl.parentElement;
      if (files[slotIndex]) {
        frame.style.display = '';
        imgEl.onerror = () => { frame.style.display = 'none'; };
        imgEl.src = 'images/' + files[slotIndex];
      } else {
        frame.style.display = 'none';
      }
    });

    files.forEach((filename, i) => {
      const src = 'images/' + filename;
      const img = new Image();
      img.onload = () => {
        addGalleryItem(src, i + 1);
        galleryImages.push(src);
      };
      img.onerror = () => {
        // Foto di daftar tapi filenya tidak ketemu, lewati otomatis
      };
      img.src = src;
    });
  }

  function loadPhotosNumberedFallback() {
    const totalPhotos = 20;
    for (let i = 1; i <= totalPhotos; i++) {
      const src = `images/${i}.jpg`;
      const img = new Image();
      img.onload = () => {
        addGalleryItem(src, i);
        galleryImages.push(src);
      };
      img.onerror = () => {
        // Foto tidak ditemukan, lewati otomatis tanpa error
      };
      img.src = src;
    }
  }

  function addGalleryItem(src, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = index;
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Kenangan ${index}`;
    img.loading = 'lazy';
    item.appendChild(img);
    item.addEventListener('click', () => openLightbox(src));
    galleryGrid.appendChild(item);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    obs.observe(item);
  }

  /* ============= LIGHTBOX ============= */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentLightboxIndex = 0;

  function openLightbox(src) {
    currentLightboxIndex = galleryImages.indexOf(src);
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  function showLightboxIndex(index) {
    if (galleryImages.length === 0) return;
    currentLightboxIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentLightboxIndex];
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightboxPrev.addEventListener('click', () => showLightboxIndex(currentLightboxIndex - 1));
  lightboxNext.addEventListener('click', () => showLightboxIndex(currentLightboxIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxIndex(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightboxIndex(currentLightboxIndex + 1);
  });

  /* swipe support for mobile lightbox */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showLightboxIndex(currentLightboxIndex - 1);
      else showLightboxIndex(currentLightboxIndex + 1);
    }
  });

  /* ============= VIDEOS: MANIFEST MODE OR NUMBERED FALLBACK ============= */
  const videoStack = document.getElementById('videoStack');

  fetch('videos/videos.txt', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('video manifest not found');
      return res.text();
    })
    .then(text => {
      const files = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
      if (files.length === 0) throw new Error('video manifest empty');
      files.forEach(filename => addVideoCard('videos/' + filename));
    })
    .catch(() => {
      const totalVideos = 5;
      for (let i = 1; i <= totalVideos; i++) {
        addVideoCard(`videos/video${i}.mp4`);
      }
    });

  function addVideoCard(src) {
    const card = document.createElement('div');
    card.className = 'video-card';
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = src;
    video.addEventListener('error', () => {
      card.remove();
    });
    card.appendChild(video);
    videoStack.appendChild(card);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    obs.observe(card);
  }

  /* ============= LETTER PAGE — PARAGRAPH FADE + VOLUME DUCKING ============= */
  const letterSection = document.getElementById('letter');
  const letterParagraphs = document.querySelectorAll('.letter-body p');
  const letterQuote = document.getElementById('letterQuote');
  let letterVolumeDucked = false;

  const letterParaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const index = Array.from(letterParagraphs).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (index % 3) * 150);
      }
    });
  }, { threshold: 0.3 });
  letterParagraphs.forEach(p => letterParaObserver.observe(p));

  const letterSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !letterVolumeDucked) {
        letterVolumeDucked = true;
        duckVolume();
      } else if (!entry.isIntersecting && letterVolumeDucked) {
        letterVolumeDucked = false;
        restoreVolume();
      }
    });
  }, { threshold: 0.2 });
  letterSectionObserver.observe(letterSection);

  function duckVolume() {
    const target = userVolume * 0.3;
    fadeVolume(bgMusic.volume, target, 800);
  }
  function restoreVolume() {
    fadeVolume(bgMusic.volume, userVolume, 800);
  }
  function fadeVolume(from, to, duration) {
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      bgMusic.volume = from + (to - from) * progress;
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);
  }

  const letterQuoteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) letterQuote.classList.add('visible');
    });
  }, { threshold: 0.5 });
  letterQuoteObserver.observe(letterQuote);

  /* ============= ENDING SEQUENCE ============= */
  const endingLines = document.querySelectorAll('.ending-line');
  const endingFinal = document.getElementById('endingFinal');
  let endingTriggered = false;

  const endingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !endingTriggered) {
        endingTriggered = true;
        runEndingSequence();
      }
    });
  }, { threshold: 0.4 });
  endingObserver.observe(document.getElementById('ending'));

  function runEndingSequence() {
    endingLines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('visible');
      }, i * 1800);
    });
    setTimeout(() => {
      endingFinal.classList.add('visible');
    }, endingLines.length * 1800 + 800);

    // gently fade music down at the end
    setTimeout(() => {
      fadeVolume(bgMusic.volume, userVolume * 0.35, 3000);
    }, 500);
  }

  const replayBtn = document.getElementById('replayBtn');
  replayBtn.addEventListener('click', () => {
    fadeVolume(bgMusic.volume, userVolume, 1500);
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  });

});
