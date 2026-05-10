/* ── MOBILE MENU ── */
const hamBtn     = document.getElementById('hamBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (hamBtn) hamBtn.addEventListener('click', e => {
  e.stopPropagation();
  mobileMenu.classList.toggle('open');
});
function closeMenu() { if (mobileMenu) mobileMenu.classList.remove('open'); }
document.addEventListener('click', e => {
  if (mobileMenu && hamBtn && !mobileMenu.contains(e.target) && !hamBtn.contains(e.target))
    closeMenu();
});

/* ── DARK MODE ── */
const themeBtn = document.getElementById('themeBtn');
const applyTheme = dark => {
  document.body.classList.toggle('dark', dark);
  themeBtn.textContent = dark ? '☀️' : '🌙';
};
applyTheme(localStorage.getItem('theme') === 'dark');

themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── NAV INDICATOR (desktop) ── */
const navLinks  = document.querySelectorAll('.nav-link');
const indicator = document.getElementById('navIndicator');

function positionIndicator(link) {
  if (!link || !indicator) return;
  const li = link.parentElement; // <li> is direct child of .nav-pill
  indicator.style.width     = link.offsetWidth + 'px';
  indicator.style.transform = `translateX(${li.offsetLeft}px)`;
}

function setActiveById(id) {
  navLinks.forEach(a => {
    const match = a.getAttribute('href') === '#' + id;
    a.classList.toggle('active', match);
    if (match) positionIndicator(a);
  });
  // sync tab bar
  document.querySelectorAll('.tab-item').forEach(t => {
    t.classList.toggle('active', t.dataset.section === id);
  });
}

/* scroll spy — paused while smooth-scrolling to avoid mid-scroll jumps */
const sections = Array.from(document.querySelectorAll('main section[id]'));
let scrollSpyPaused = false;
let scrollEndTimer  = null;

function onScroll() {
  if (scrollSpyPaused) return;
  const mid = window.scrollY + window.innerHeight * 0.4;
  let current = sections[0].id;
  for (const s of sections) {
    if (s.offsetTop <= mid) current = s.id;
  }
  setActiveById(current);
}
window.addEventListener('scroll', onScroll, { passive: true });

/* shared anchor-click handler — works for nav links AND any <a href="#section"> */
function handleAnchorClick(href) {

  const targetId = href.replace('#', '');

  /* HOME CLICK */
  if (targetId === 'home') {

    scrollSpyPaused = true;

    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    /* move indicator back to first nav item */
    const firstLink = navLinks[0];

    if (indicator && firstLink) {

      indicator.style.transition = 'none';

      positionIndicator(firstLink);

      requestAnimationFrame(() => {
        indicator.style.transition = '';
      });
    }

    clearTimeout(scrollEndTimer);

    scrollEndTimer = setTimeout(() => {
      scrollSpyPaused = false;
      onScroll();
    }, 650);

    return;
  }

  /* NORMAL SECTIONS */
  const resolvedId =
    sections.find(s => s.id === targetId)?.id;

  if (!resolvedId) return;

  scrollSpyPaused = true;

  if (indicator) {
    indicator.style.transition = 'none';
  }

  setActiveById(resolvedId);

  requestAnimationFrame(() => {
    if (indicator) {
      indicator.style.transition = '';
    }
  });

  clearTimeout(scrollEndTimer);

  scrollEndTimer = setTimeout(() => {
    scrollSpyPaused = false;
    onScroll();
  }, 650);
}

/* nav pill clicks */
navLinks.forEach(a => {
  a.addEventListener('click', () => handleAnchorClick(a.getAttribute('href')));
});

/* ALL other anchor links on the page (CTA buttons, tab-bar items, etc.) */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (a && !a.classList.contains('nav-link')) {
    handleAnchorClick(a.getAttribute('href'));
  }
});

/* init after fonts render so offsetWidth is accurate */
document.fonts.ready.then(() => {
  onScroll();
  positionIndicator(document.querySelector('.nav-link.active'));
});
window.addEventListener('resize', () => {
  positionIndicator(document.querySelector('.nav-link.active'));
});

/* ── TERMINAL ANIMATION ── */
(function () {
  const body  = document.getElementById('terminalBody');
  const steps = [
    ['prompt', 'whoami',                              55, 120],
    ['output', 'shaik_ashraf — backend eng / ml',      0, 460],
    ['blank',  '',                                     0,  70],
    ['prompt', 'cat focus.txt',                       50, 100],
    ['output', 'Spring Boot  REST APIs  scikit-learn', 0, 440],
    ['blank',  '',                                     0,  70],
    ['prompt', 'ls projects/',                        50, 100],
    ['output', 'student-performance-indicator/',       0, 130],
    ['output', 'petistaan-backend/',                   0, 440],
    ['blank',  '',                                     0,  70],
    ['prompt', 'echo $STATUS',                        50, 100],
    ['output', 'open to opportunities ✓',              0, 280],
    ['blank',  '',                                     0,  70],
    ['idle',   '',                                     0,   0],
  ];
  let idx = 0;

  function run() {
    if (idx >= steps.length) return;
    const [type, text, speed, pause] = steps[idx++];

    if (type === 'blank') {
      body.appendChild(Object.assign(document.createElement('span'), { className: 'tl', textContent: '' }));
      setTimeout(run, pause);
      return;
    }
    if (type === 'idle') {
      const l = document.createElement('span');
      l.className = 'tl';
      l.innerHTML = '<span class="tp">❯ </span><span class="t-cur"></span>';
      body.appendChild(l);
      return;
    }
    if (type === 'output') {
      const hi = text.includes('/') || text.includes('✓');
      const l  = document.createElement('span');
      l.className  = 'tl to' + (hi ? ' hi' : '');
      l.textContent = text;
      body.appendChild(l);
      setTimeout(run, pause);
      return;
    }
    if (type === 'prompt') {
      const line = document.createElement('span'); line.className = 'tl';
      const p    = document.createElement('span'); p.className = 'tp'; p.textContent = '❯ ';
      const c    = document.createElement('span'); c.className = 'tc';
      line.appendChild(p); line.appendChild(c); body.appendChild(line);
      let i = 0;
      const iv = setInterval(() => {
        c.textContent += text[i++];
        if (i >= text.length) { clearInterval(iv); setTimeout(run, pause); }
      }, speed);
    }
  }

  setTimeout(run, 900);
})();

/* ── CONTACT FORM (Formspree async) ── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && submitBtn && formSuccess) {

  contactForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {

      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        },
      });

      if (res.ok) {

        contactForm.reset();

        formSuccess.style.display = 'block';

        submitBtn.textContent = '✓ Sent!';

        setTimeout(() => {
          formSuccess.style.display = 'none';
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
        }, 5000);

      } else {
        throw new Error();
      }

    } catch {

      submitBtn.textContent = 'Failed — try again';
      submitBtn.disabled = false;

      setTimeout(() => {
        submitBtn.textContent = 'Send Message';
      }, 3000);
    }
  });
}