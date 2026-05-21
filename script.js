/* ==========================================================================
   SANGAMESH PORTFOLIO — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. INVERTED COLOR CURSOR (mix-blend-mode)
     ========================================== */
  const cursorEl = document.getElementById('inverted-cursor');
  let mouse = { x: 0, y: 0 };
  let cursorPos = { x: 0, y: 0 };
  let isMobile = window.innerWidth <= 960 || ('ontouchstart' in window);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animateCursor() {
    if (!isMobile && cursorEl) {
      // Smooth lerp for premium lag-behind effect
      cursorPos.x += (mouse.x - cursorPos.x) * 0.15;
      cursorPos.y += (mouse.y - cursorPos.y) * 0.15;
      cursorEl.style.left = cursorPos.x + 'px';
      cursorEl.style.top = cursorPos.y + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover grow effect on interactive elements
  const interactives = document.querySelectorAll('a, button, .project-row, .skills-tab, .theme-btn, .contact-card, .roadmap-step');
  interactives.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (cursorEl) cursorEl.classList.add('hovering');
    });
    item.addEventListener('mouseleave', () => {
      if (cursorEl) cursorEl.classList.remove('hovering');
    });
  });

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 960 || ('ontouchstart' in window);
    if (isMobile && cursorEl) {
      cursorEl.style.display = 'none';
    } else if (cursorEl) {
      cursorEl.style.display = 'block';
    }
  });


  /* ==========================================
     2. DYNAMIC NEURAL CANVAS BACKGROUND
     ========================================== */
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const maxParticles = 65;

    // Resize canvas
    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Get color dynamically based on theme
    function getThemeColors() {
      const theme = document.body.getAttribute('data-theme') || 'warm';
      if (theme === 'cyber') {
        return {
          particle: '#ec4899',
          line: 'rgba(6, 182, 212, 0.12)',
          highlight: '#06b6d4'
        };
      } else if (theme === 'obsidian') {
        return {
          particle: '#8d8d9b',
          line: 'rgba(255, 255, 255, 0.04)',
          highlight: '#38bdf8'
        };
      } else {
        // Warm Editorial
        return {
          particle: '#c29d53',
          line: 'rgba(194, 157, 83, 0.07)',
          highlight: '#245c43'
        };
      }
    }

    // Particle blueprint
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1;
      }

      draw() {
        const colors = getThemeColors();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.particle;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundary
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Mouse repulsion
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 1500;
          this.x -= dx * force;
          this.y -= dy * force;
        }
      }
    }

    // Initialize particles array
    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();

    // Draw connecting lines
    function drawConnections() {
      const colors = getThemeColors();
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          let dx = particlesArray[i].x - particlesArray[j].x;
          let dy = particlesArray[i].y - particlesArray[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.strokeStyle = colors.line;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }


  /* ==========================================
     3. THEME SWAPPER CONTROLS
     ========================================== */
  const themeButtons = document.querySelectorAll('.theme-btn');
  
  // Set theme from local storage
  const activeTheme = localStorage.getItem('sanga-theme') || 'warm';
  document.body.setAttribute('data-theme', activeTheme);
  themeButtons.forEach(btn => {
    if (btn.getAttribute('data-theme-val') === activeTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const themeVal = btn.getAttribute('data-theme-val');
      document.body.setAttribute('data-theme', themeVal);
      localStorage.setItem('sanga-theme', themeVal);

      // Set active button style
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });


  /* ==========================================
     4. GSAP SCROLL TRIGGER ANIMATIONS
     ========================================== */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade reveal elements cleanly on scroll
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(el, 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.95, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Special parallax element in Hero image
    const imageFrame = document.querySelector('.image-frame');
    if (imageFrame) {
      gsap.to(imageFrame, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }


  /* ==========================================
     5. HERO TYPING LOOP (Polished)
     ========================================== */
  const roles = [
    'AI/DS Developer',
    'Full Stack Builder',
    'Problem Solver',
    'Python Enthusiast',
  ];

  const typingEl = document.getElementById('typing-role');
  if (typingEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const TYPING_SPEED = 70;
    const DELETING_SPEED = 40;
    const PAUSE_AFTER = 1700;
    const PAUSE_BEFORE = 350;

    function typeLoop() {
      const current = roles[roleIndex];

      if (!isDeleting) {
        typingEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeLoop, PAUSE_AFTER);
          return;
        }
        setTimeout(typeLoop, TYPING_SPEED);
      } else {
        typingEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeLoop, PAUSE_BEFORE);
          return;
        }
        setTimeout(typeLoop, DELETING_SPEED);
      }
    }
    typeLoop();
  }


  /* ==========================================
     6. NAVBAR SCROLL CLASS LISTENER
     ========================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  /* ==========================================
     7. PROJECTS SECTOR FILTERING
     ========================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectRows = document.querySelectorAll('.project-row');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterVal = btn.getAttribute('data-filter');

      // Change button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Animate project rows out & in
      projectRows.forEach(row => {
        const cat = row.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          row.classList.remove('hide');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(row, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
          }
        } else {
          row.classList.add('hide');
        }
      });
      
      // Refresh ScrollTrigger to adjust trigger markers
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });


  /* ==========================================
     8. DETAILED MODAL TRIGGER & CONTENT LOADING
     ========================================== */
  const modal = document.getElementById('project-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');

  function openModal(data) {
    if (!modal) return;
    
    // Fill content
    document.getElementById('modal-category').textContent = data.category || 'AI / Web Development';
    document.getElementById('modal-title').textContent = data.title || 'Project';
    document.getElementById('modal-description').textContent = data.desc || '';
    document.getElementById('modal-tech').textContent = data.tech || '';
    document.getElementById('modal-challenges').textContent = data.challenges || '';
    
    // Set URLs
    document.getElementById('modal-link').setAttribute('href', data.link || '#');
    document.getElementById('modal-github').setAttribute('href', data.github || '#');

    // Display modal
    modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  // Row selection trigger click
  projectRows.forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') return;

      const data = {
        category: row.querySelector('.project-tags').textContent,
        title: row.getAttribute('data-title'),
        desc: row.getAttribute('data-desc'),
        tech: row.getAttribute('data-tech'),
        challenges: row.getAttribute('data-challenges'),
        link: row.getAttribute('data-link'),
        github: row.getAttribute('data-github')
      };
      openModal(data);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // Close modal on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });


  /* ==========================================
     9. INTERACTIVE SKILLS ROADMAP TAB SWITCHING
     ========================================== */
  const skillsTabs = document.querySelectorAll('.skills-tab');
  const roadmapPaths = document.querySelectorAll('.roadmap-path');

  function activateSkillPath(category) {
    // Update tab active state
    skillsTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-skill-cat') === category);
    });

    // Switch the visible roadmap path
    roadmapPaths.forEach(path => {
      if (path.getAttribute('data-path') === category) {
        path.classList.add('active');

        // Animate the steps in with stagger using GSAP
        const steps = path.querySelectorAll('.roadmap-step');
        if (typeof gsap !== 'undefined' && steps.length > 0) {
          gsap.fromTo(steps,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.12,
              overwrite: true
            }
          );
        }
      } else {
        path.classList.remove('active');
      }
    });
  }

  skillsTabs.forEach(tab => {
    // Click to switch
    tab.addEventListener('click', () => {
      activateSkillPath(tab.getAttribute('data-skill-cat'));
    });

    // Hover to preview
    tab.addEventListener('mouseenter', () => {
      activateSkillPath(tab.getAttribute('data-skill-cat'));
    });
  });

  // Initialize the first path animation
  const initialPath = document.querySelector('.roadmap-path.active');
  if (initialPath && typeof gsap !== 'undefined') {
    const steps = initialPath.querySelectorAll('.roadmap-step');
    gsap.fromTo(steps,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.3
      }
    );
  }


  /* ==========================================
     10. 3D ROTATING WIREFRAME GLOBE
     ========================================== */
  const globeCanvas = document.getElementById('globe-canvas');
  if (globeCanvas) {
    const gCtx = globeCanvas.getContext('2d');
    let globeAngle = 0;
    const ROTATION_SPEED = 0.003;

    // High-DPI canvas scaling
    function resizeGlobe() {
      const container = globeCanvas.parentElement;
      const size = Math.min(container.offsetWidth, container.offsetHeight, 400);
      const dpr = window.devicePixelRatio || 1;
      globeCanvas.width = size * dpr;
      globeCanvas.height = size * dpr;
      globeCanvas.style.width = size + 'px';
      globeCanvas.style.height = size + 'px';
      gCtx.scale(dpr, dpr);
    }
    resizeGlobe();
    window.addEventListener('resize', resizeGlobe);

    // Globe color palette adapts to active theme
    function getGlobeColors() {
      const theme = document.body.getAttribute('data-theme') || 'warm';
      if (theme === 'cyber') {
        return {
          wire: 'rgba(236, 72, 153, 0.18)',
          wireHighlight: 'rgba(6, 182, 212, 0.25)',
          dot: '#ec4899',
          dotGlow: 'rgba(236, 72, 153, 0.6)',
          satellite: '#06b6d4',
          satTrail: 'rgba(6, 182, 212, 0.15)',
          outline: 'rgba(236, 72, 153, 0.12)'
        };
      } else if (theme === 'obsidian') {
        return {
          wire: 'rgba(255, 255, 255, 0.06)',
          wireHighlight: 'rgba(56, 189, 248, 0.15)',
          dot: '#a3a3ac',
          dotGlow: 'rgba(56, 189, 248, 0.5)',
          satellite: '#38bdf8',
          satTrail: 'rgba(56, 189, 248, 0.12)',
          outline: 'rgba(255, 255, 255, 0.06)'
        };
      } else {
        return {
          wire: 'rgba(194, 157, 83, 0.12)',
          wireHighlight: 'rgba(36, 92, 67, 0.18)',
          dot: '#c29d53',
          dotGlow: 'rgba(194, 157, 83, 0.5)',
          satellite: '#245c43',
          satTrail: 'rgba(36, 92, 67, 0.1)',
          outline: 'rgba(24, 22, 20, 0.06)'
        };
      }
    }

    // 3D projection helpers
    function rotateY(x, y, z, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: x * cos + z * sin,
        y: y,
        z: -x * sin + z * cos
      };
    }

    function project(x, y, z, cx, cy, radius) {
      return {
        px: cx + x * radius,
        py: cy + y * radius,
        depth: z // positive = front-facing
      };
    }

    // City coordinates (lat, lon in radians)
    const cities = [
      { lat: 0.2268, lon: 1.3486 },  // Bangalore
      { lat: 0.7128, lon: -1.2906 }, // New York
      { lat: 0.8987, lon: -0.0044 }, // London
      { lat: 0.6226, lon: 2.4352 },  // Tokyo
      { lat: -0.5923, lon: 2.6198 }, // Sydney
      { lat: 0.8580, lon: 0.6503 },  // Moscow
      { lat: 0.3434, lon: -1.7012 }, // San Francisco
      { lat: -0.4018, lon: -0.7605 },// São Paulo
      { lat: 0.0876, lon: 0.6344 },  // Dubai
      { lat: 0.5530, lon: 0.0407 },  // Paris
      { lat: 0.3948, lon: 1.9898 },  // Shanghai
      { lat: -0.0234, lon: 0.6378 }, // Nairobi
    ];

    // Satellite orbits
    const satellites = [
      { inclination: 0.4, phase: 0, speed: 0.008, orbitRadius: 1.15 },
      { inclination: -0.6, phase: 2.1, speed: 0.006, orbitRadius: 1.22 },
      { inclination: 0.8, phase: 4.2, speed: 0.01, orbitRadius: 1.08 },
    ];

    function drawGlobe() {
      const size = parseInt(globeCanvas.style.width);
      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.36;
      const colors = getGlobeColors();

      gCtx.clearRect(0, 0, size, size);

      // Subtle outer glow ring
      const gradient = gCtx.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.3);
      gradient.addColorStop(0, colors.outline);
      gradient.addColorStop(1, 'transparent');
      gCtx.beginPath();
      gCtx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      gCtx.fillStyle = gradient;
      gCtx.fill();

      // Draw latitude lines
      const latCount = 7;
      for (let i = 0; i <= latCount; i++) {
        const lat = -Math.PI / 2 + (Math.PI / latCount) * i;
        const cosLat = Math.cos(lat);
        const sinLat = Math.sin(lat);
        const segments = 60;

        gCtx.beginPath();
        let started = false;
        for (let j = 0; j <= segments; j++) {
          const lon = (Math.PI * 2 / segments) * j;
          const x3d = cosLat * Math.cos(lon);
          const y3d = sinLat;
          const z3d = cosLat * Math.sin(lon);

          const rotated = rotateY(x3d, y3d, z3d, globeAngle);
          if (rotated.z < -0.05) continue; // Behind the sphere

          const p = project(rotated.x, rotated.y, rotated.z, cx, cy, radius);
          if (!started) {
            gCtx.moveTo(p.px, p.py);
            started = true;
          } else {
            gCtx.lineTo(p.px, p.py);
          }
        }
        gCtx.strokeStyle = colors.wire;
        gCtx.lineWidth = 0.7;
        gCtx.stroke();
      }

      // Draw longitude lines
      const lonCount = 12;
      for (let i = 0; i < lonCount; i++) {
        const lon = (Math.PI * 2 / lonCount) * i;
        const segments = 60;

        gCtx.beginPath();
        let started = false;
        for (let j = 0; j <= segments; j++) {
          const lat = -Math.PI / 2 + (Math.PI / segments) * j;
          const x3d = Math.cos(lat) * Math.cos(lon);
          const y3d = Math.sin(lat);
          const z3d = Math.cos(lat) * Math.sin(lon);

          const rotated = rotateY(x3d, y3d, z3d, globeAngle);
          if (rotated.z < -0.05) continue;

          const p = project(rotated.x, rotated.y, rotated.z, cx, cy, radius);
          if (!started) {
            gCtx.moveTo(p.px, p.py);
            started = true;
          } else {
            gCtx.lineTo(p.px, p.py);
          }
        }
        gCtx.strokeStyle = colors.wire;
        gCtx.lineWidth = 0.5;
        gCtx.stroke();
      }

      // Draw city dots
      cities.forEach(city => {
        const x3d = Math.cos(city.lat) * Math.cos(city.lon);
        const y3d = Math.sin(city.lat);
        const z3d = Math.cos(city.lat) * Math.sin(city.lon);

        const rotated = rotateY(x3d, y3d, z3d, globeAngle);
        if (rotated.z < 0) return; // Behind the sphere

        const p = project(rotated.x, rotated.y, rotated.z, cx, cy, radius);
        const alpha = 0.3 + rotated.z * 0.7;
        const dotRadius = 1.8 + rotated.z * 1.5;

        // Glow
        gCtx.beginPath();
        gCtx.arc(p.px, p.py, dotRadius + 3, 0, Math.PI * 2);
        gCtx.fillStyle = colors.dotGlow.replace('0.5', (alpha * 0.3).toFixed(2));
        gCtx.fill();

        // Dot
        gCtx.beginPath();
        gCtx.arc(p.px, p.py, dotRadius, 0, Math.PI * 2);
        gCtx.fillStyle = colors.dot;
        gCtx.globalAlpha = alpha;
        gCtx.fill();
        gCtx.globalAlpha = 1;
      });

      // Draw orbiting satellites
      satellites.forEach(sat => {
        const t = globeAngle * sat.speed * 100 + sat.phase;
        const orbitX = Math.cos(t) * sat.orbitRadius;
        const orbitZ = Math.sin(t) * sat.orbitRadius;
        const orbitY = Math.sin(sat.inclination) * Math.sin(t) * sat.orbitRadius * 0.4;

        const rotated = rotateY(orbitX, orbitY, orbitZ, globeAngle * 0.3);
        const p = project(rotated.x, rotated.y, rotated.z, cx, cy, radius);

        // Draw trail
        const trailSegments = 12;
        for (let i = 1; i <= trailSegments; i++) {
          const tPast = t - i * 0.06;
          const tx = Math.cos(tPast) * sat.orbitRadius;
          const tz = Math.sin(tPast) * sat.orbitRadius;
          const ty = Math.sin(sat.inclination) * Math.sin(tPast) * sat.orbitRadius * 0.4;
          const rPast = rotateY(tx, ty, tz, globeAngle * 0.3);
          const pPast = project(rPast.x, rPast.y, rPast.z, cx, cy, radius);

          gCtx.beginPath();
          gCtx.arc(pPast.px, pPast.py, 1.2 - (i * 0.08), 0, Math.PI * 2);
          gCtx.fillStyle = colors.satTrail;
          gCtx.globalAlpha = (1 - i / trailSegments) * 0.6;
          gCtx.fill();
          gCtx.globalAlpha = 1;
        }

        // Satellite glow
        gCtx.beginPath();
        gCtx.arc(p.px, p.py, 5, 0, Math.PI * 2);
        const satGradient = gCtx.createRadialGradient(p.px, p.py, 0, p.px, p.py, 5);
        satGradient.addColorStop(0, colors.satellite);
        satGradient.addColorStop(1, 'transparent');
        gCtx.fillStyle = satGradient;
        gCtx.fill();

        // Satellite dot
        gCtx.beginPath();
        gCtx.arc(p.px, p.py, 2, 0, Math.PI * 2);
        gCtx.fillStyle = colors.satellite;
        gCtx.fill();
      });

      globeAngle += ROTATION_SPEED;
      requestAnimationFrame(drawGlobe);
    }

    drawGlobe();
  }

});
