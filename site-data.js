/* Dynamic content layer: renders all admin-managed sections.
   Paints instantly from bundled DEFAULT_DATA (or the last cached API
   response), then refreshes from the backend when configured, so the site
   never looks empty even while a free-tier server cold-starts. */
(function () {
  'use strict';

  var DEFAULT_DATA = {
    profile: {
      name: 'MD Abu Zafor',
      tagline: 'Flutter Developer | Cross-Platform Mobile Apps',
      heroDescription: 'Building and shipping production-ready iOS & Android applications with 3 live apps on the App Store and Play Store. Specialized in Dart/Flutter, Firebase, and end-to-end mobile development.',
      aboutParagraphs: [
        "I'm a **Flutter Developer** with hands-on experience building and shipping cross-platform mobile applications live on the **Apple App Store** and **Google Play Store**.",
        'Currently at **ScaleUp Ad Agency** under Betopia Group, serving international clients from requirements to release.',
        '**3 live production apps** and **1 open-source project** demonstrate my track record.',
      ],
      aboutDetails: [
        { label: 'Location', value: 'Dhaka, Bangladesh' },
        { label: 'Current Role', value: 'Jr. Flutter Developer' },
        { label: 'Employer', value: 'ScaleUp Ad Agency' },
        { label: 'Focus', value: 'Cross-Platform Mobile' },
        { label: 'Stores', value: 'App Store & Play Store' },
        { label: 'Languages', value: 'English, Bangla' },
      ],
      email: 'abuzafor.dev@gmail.com',
      phone: '+8801725722522',
      location: 'Dhaka, Bangladesh',
      github: 'AbuZafor99',
      linkedin: 'https://linkedin.com/in/abuzafor',
      experienceStart: '2025-09-01',
      statLiveApps: '',
      statLiveSub: 'App Store & Play Store',
      statOss: '',
      statOssSub: 'GitHub — EarthQForecast',
      statExpSub: 'ScaleUp Ad Agency',
      cvUrl: '',
    },
    projects: [
      {
        title: 'Tully Planner', tagline: 'Athlete Performance',
        platform: 'iOS — Athlete & Coach Performance Tracking',
        description: 'Performance tracking app for high schools and sports organizations with custom training programs and real-time dashboards.',
        highlights: ['Cross-platform performance tracking', 'Real-time data collection and dashboards', 'QR code-based data submission', 'Custom charts and data visualizations', 'Full Apple App Store deployment'],
        tech: ['Flutter', 'Firebase', 'QR Codes', 'Charts'],
        icon: 'fas fa-running', gradient: 'linear-gradient(135deg,#0a2e1f 0%,#00e5a0 50%,#0a3d2e 100%)',
        status: 'live', statusText: 'Live on App Store', period: '2025', featured: true,
        links: { appStore: 'https://apps.apple.com/us/app/tully-planner/id6759318137' },
      },
      {
        title: 'Central Padel League', tagline: 'League Manager',
        platform: 'Cross-Platform — Sports League Management',
        description: 'Sports league app with real-time schedules, live scores, standings, and player stats.',
        highlights: ['Real-time match schedules, scores & standings', 'Push notifications', 'Player & team profiles'],
        tech: ['Flutter', 'Push Notifications', 'REST API'],
        icon: 'fas fa-trophy', gradient: 'linear-gradient(135deg,#1a0a3d 0%,#7c4dff 50%,#0a1a3d 100%)',
        status: 'live', statusText: 'iOS & Android', period: '2025',
        links: {
          appStore: 'https://apps.apple.com/us/app/central-padel-league/id6756258917',
          playStore: 'https://play.google.com/store/apps/details?id=com.pooelcentraluser.karlfive',
        },
      },
      {
        title: 'Beardfriends', tagline: 'Social Community',
        platform: 'iOS — Social Community App',
        description: 'Social community app connecting users with shared interests with real-time chat.',
        highlights: ['Firebase Auth & Firestore real-time sync', 'Real-time chat and notifications'],
        tech: ['Flutter', 'Firebase', 'Firestore'],
        icon: 'fas fa-users', gradient: 'linear-gradient(135deg,#3d1a0a 0%,#ff9800 50%,#3d2a0a 100%)',
        status: 'live', statusText: 'UK App Store', period: '2025',
        links: { appStore: 'https://apps.apple.com' },
      },
      {
        title: 'EarthQForecast', tagline: 'Seismic Monitor',
        platform: 'Flutter — Earthquake Monitoring',
        description: 'Real-time earthquake tracking with live seismic data APIs and interactive maps.',
        highlights: ['Live seismic data API integration', 'Interactive map rendering'],
        tech: ['Flutter', 'REST API', 'Maps'],
        icon: 'fas fa-globe-americas', gradient: 'linear-gradient(135deg,#0a1a3d 0%,#0088e5 50%,#0a2a3d 100%)',
        status: 'oss', statusText: 'Open Source', period: '2024',
        links: { github: 'https://github.com/AbuZafor99' },
      },
    ],
    skills: [
      { name: 'Flutter', iconClass: 'devicon-flutter-plain colored', color: '#02569B' },
      { name: 'Dart', iconClass: 'devicon-dart-plain colored', color: '#0175C2' },
      { name: 'Firebase', iconClass: 'devicon-firebase-plain colored', color: '#FFCA28' },
      { name: 'GetX', iconClass: 'devicon-flutter-plain', color: '#8B5CF6' },
      { name: 'Python', iconClass: 'devicon-python-plain colored', color: '#3776AB' },
      { name: 'Git', iconClass: 'devicon-git-plain colored', color: '#F05032' },
      { name: 'MySQL', iconClass: 'devicon-mysql-plain colored', color: '#4479A1' },
      { name: 'MongoDB', iconClass: 'devicon-mongodb-plain colored', color: '#47A248' },
      { name: 'HTML', iconClass: 'devicon-html5-plain colored', color: '#E34F26' },
      { name: 'CSS', iconClass: 'devicon-css3-plain colored', color: '#1572B6' },
      { name: 'JavaScript', iconClass: 'devicon-javascript-plain colored', color: '#F7DF1E' },
    ],
    experiences: [
      {
        role: 'Junior Flutter Developer', company: 'ScaleUp Ad Agency, Betopia Group',
        start: 'Sep 2025', end: 'Present', current: true,
        bullets: ['Develop and maintain cross-platform Flutter apps', 'REST API integration, Firebase, state management', 'App store submission and release management'],
      },
      {
        role: 'App Development Instructor', company: 'Independent University, Bangladesh (IUB)',
        start: 'Jul 2025', end: 'Dec 2025', current: false,
        bullets: ['Designed and delivered Flutter development curriculum', 'Evaluated projects and provided technical feedback'],
      },
      {
        role: 'Teaching Assistant — Physics Lab', company: 'Independent University, Bangladesh (IUB)',
        start: '2023', end: '2025', current: false,
        bullets: ['Supervised lab sessions and maintained records'],
      },
    ],
    education: [
      {
        degree: 'B.Sc. in Computer Science & Engineering',
        institution: 'Independent University, Bangladesh (IUB)',
        period: '2022 – 2025', cgpa: '3.62 / 4.00', extra: 'Minor: MIS',
      },
    ],
    certifications: [
      { title: 'Complete Flutter App Development Career Path', year: '2025', iconClass: 'fas fa-certificate' },
      { title: 'CCNA: Introduction to Networks — Cisco / IUB', year: '2023', iconClass: 'fas fa-network-wired' },
      { title: 'Master Git & GitHub — Udemy', year: '2023', iconClass: 'fab fa-github' },
      { title: 'Python for Data Science, AI & Development — Coursera', year: '2022', iconClass: 'fas fa-brain' },
    ],
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // **text** -> highlighted span
  function hl(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<span class="about-hl">$1</span>');
  }
  function rescanReveals() {
    if (window.__observeReveals) window.__observeReveals();
  }

  /* ---------- Section renderers ---------- */

  function renderHero(p) {
    var tag = document.querySelector('.hero-text .tagline');
    var desc = document.querySelector('.hero-text .desc');
    if (tag && p.tagline) tag.textContent = p.tagline;
    if (desc && p.heroDescription) desc.textContent = p.heroDescription;
    if (p.name) {
      var h1 = document.querySelector('.hero-text h1');
      var parts = p.name.trim().split(' ');
      var last = parts.pop();
      if (h1) h1.innerHTML = esc(parts.join(' ')) + ' <span class="acc">' + esc(last) + '</span>';
      var ft = document.querySelector('.ft-text .acc');
      if (ft) ft.textContent = p.name;
    }
  }

  function renderAbout(p) {
    var text = document.getElementById('aboutText');
    var det = document.getElementById('aboutDetails');
    if (text) text.innerHTML = (p.aboutParagraphs || []).map(function (para) { return '<p>' + hl(para) + '</p>'; }).join('');
    if (det) det.innerHTML = (p.aboutDetails || []).map(function (d) {
      return '<div class="ad-item"><div class="lbl">' + esc(d.label) + '</div><div class="val">' + esc(d.value) + '</div></div>';
    }).join('');
  }

  function skillVars(color) {
    var r = parseInt(color.slice(1, 3), 16) || 0, g = parseInt(color.slice(3, 5), 16) || 229, b = parseInt(color.slice(5, 7), 16) || 160;
    var rgb = r + ',' + g + ',' + b;
    return '--skill-color:' + color + ';--skill-glow:rgba(' + rgb + ',0.15);--skill-bg:rgba(' + rgb + ',0.1);--skill-bg-hover:rgba(' + rgb + ',0.2);';
  }
  function renderSkills(skills) {
    var grid = document.getElementById('skillGrid');
    if (!grid) return;
    grid.innerHTML = skills.map(function (s) {
      return '<div class="skill-card" style="' + skillVars(s.color || '#00e5a0') + '">' +
        '<div class="sk-icon-wrap"><i class="' + esc(s.iconClass) + '"' + (s.iconClass.indexOf('colored') < 0 ? ' style="color:' + esc(s.color) + ';"' : '') + '></i></div>' +
        '<span class="sk-name">' + esc(s.name) + '</span></div>';
    }).join('');
  }

  function renderExperience(items) {
    var tl = document.getElementById('expTimeline');
    if (!tl) return;
    tl.innerHTML = items.map(function (x) {
      return '<div class="tl-item reveal"><div class="tl-dot' + (x.current ? ' active' : '') + '"></div><div class="tl-content">' +
        '<div class="tl-head"><h3>' + esc(x.role) + '</h3><span class="tl-date">' + esc(x.start) + ' – ' + esc(x.end) + '</span></div>' +
        '<p class="tl-co">' + esc(x.company) + '</p>' +
        '<ul class="tl-list">' + (x.bullets || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul></div></div>';
    }).join('');
    rescanReveals();
  }

  function renderEducation(items) {
    var el = document.getElementById('eduList');
    if (!el) return;
    el.innerHTML = items.map(function (e) {
      return '<div class="edu-card reveal"><div class="edu-head"><h3>' + esc(e.degree) + '</h3>' +
        (e.cgpa ? '<span class="cgpa"><i class="fas fa-star"></i> CGPA: ' + esc(e.cgpa) + '</span>' : '') + '</div>' +
        '<p style="color:var(--muted);">' + esc(e.institution) + '</p>' +
        '<div class="edu-det"><div class="edu-d"><i class="fas fa-calendar"></i> ' + esc(e.period) + '</div>' +
        (e.extra ? '<div class="edu-d"><i class="fas fa-book"></i> ' + esc(e.extra) + '</div>' : '') + '</div></div>';
    }).join('');
    rescanReveals();
  }

  function renderCerts(items) {
    var grid = document.getElementById('certGrid');
    if (!grid) return;
    grid.innerHTML = items.map(function (c) {
      return '<div class="cert-item reveal"><div class="cert-ic"><i class="' + esc(c.iconClass || 'fas fa-certificate') + '"></i></div>' +
        '<div class="cert-info"><h4>' + esc(c.title) + '</h4><span>' + esc(c.year) + '</span></div></div>';
    }).join('');
    rescanReveals();
  }

  function renderContact(p) {
    var email = document.getElementById('contactEmail');
    var phone = document.getElementById('contactPhone');
    var loc = document.getElementById('contactLocation');
    if (email) { email.href = 'mailto:' + p.email; email.querySelector('.cl-val').textContent = p.email; }
    if (phone) { phone.href = 'tel:' + p.phone; phone.querySelector('.cl-val').textContent = p.phone; }
    if (loc) loc.querySelector('.cl-val').textContent = p.location;
  }

  function renderStats(profile, projects) {
    // numbers: admin override wins, otherwise counted from the project list
    var live = profile.statLiveApps || projects.filter(function (p) { return p.status === 'live'; }).length;
    var oss = profile.statOss || projects.filter(function (p) { return p.status === 'oss'; }).length;
    var el1 = document.querySelector('.stat-card-1 .sc-num');
    var el3 = document.querySelector('.stat-card-3 .sc-num');
    if (el1) { el1.dataset.target = live; if (el1.textContent !== '0') el1.textContent = live; }
    if (el3) { el3.dataset.target = oss; if (el3.textContent !== '0') el3.textContent = oss; }
    var sub1 = document.querySelector('.stat-card-1 .sc-sub');
    var sub2 = document.querySelector('.stat-card-2 .sc-sub');
    var sub3 = document.querySelector('.stat-card-3 .sc-sub');
    if (sub1 && profile.statLiveSub) sub1.textContent = profile.statLiveSub;
    if (sub2 && profile.statExpSub) sub2.textContent = profile.statExpSub;
    if (sub3 && profile.statOssSub) sub3.textContent = profile.statOssSub;
  }

  /* ---------- 3D project timeline ---------- */

  var STORE_META = {
    appStore: { icon: 'fab fa-apple', label: 'App Store', cls: 'apple' },
    playStore: { icon: 'fab fa-google-play', label: 'Play Store', cls: 'google' },
    github: { icon: 'fab fa-github', label: 'View Source', cls: 'github' },
    web: { icon: 'fas fa-globe', label: 'Website', cls: 'apple' },
  };

  function storeLinks(links, mini) {
    links = links || {};
    return Object.keys(STORE_META).filter(function (k) { return links[k]; }).map(function (k) {
      var m = STORE_META[k];
      return '<a href="' + esc(links[k]) + '" target="_blank" rel="noopener" class="store-link ' + m.cls + '"' +
        ' onclick="event.stopPropagation()">' +
        '<i class="' + m.icon + '"></i>' + (mini ? '' : ' ' + m.label) + '</a>';
    }).join('');
  }

  // Fallback visual for projects with no uploaded image: icon in a phone frame
  function mockup(p, small) {
    var inner = '<div class="app-screen"><i class="' + esc(p.icon || 'fas fa-mobile-alt') + ' app-logo"></i>' +
      '<div class="app-title">' + esc(p.title) + '</div><div class="app-sub">' + esc(p.tagline) + '</div></div>';
    return '<div class="phone-mockup' + (small ? ' pm-small' : '') + '"><div class="phone-notch"></div>' + inner + '</div>';
  }

  // Clickable full-bleed image block used once a project has a real screenshot
  function photoBlock(p) {
    return '<div class="pt-photo" tabindex="0" role="button" aria-label="View full image of ' + esc(p.title) + '">' +
      '<img src="' + esc(p.imageUrl) + '" alt="' + esc(p.title) + '" loading="lazy">' +
      '<span class="pt-zoom-hint"><i class="fas fa-expand"></i></span></div>';
  }

  /* ---------- Full-image lightbox ---------- */

  function refreshBodyScrollLock() {
    var modal = document.getElementById('projModal');
    var lb = document.getElementById('imgLightbox');
    var locked = (modal && modal.classList.contains('open')) || (lb && lb.classList.contains('open'));
    document.body.style.overflow = locked ? 'hidden' : '';
  }
  function openLightbox(url, alt) {
    var lb = document.getElementById('imgLightbox');
    if (!lb || !url) return;
    var img = document.getElementById('lbImg');
    img.src = url;
    img.alt = alt || '';
    lb.classList.add('open');
    refreshBodyScrollLock();
  }
  function closeLightbox() {
    var lb = document.getElementById('imgLightbox');
    if (!lb) return;
    lb.classList.remove('open');
    refreshBodyScrollLock();
  }

  function renderProjects(projects) {
    var wrap = document.getElementById('projTimeline');
    if (!wrap) return;
    var html = '<div class="pt-spine"><div class="pt-progress" id="ptProgress"></div></div>';
    projects.forEach(function (p, i) {
      var side = i % 2 === 0 ? 'left' : 'right';
      var hasPhoto = !!p.imageUrl;
      html += '<div class="pt-item ' + side + '" data-idx="' + i + '">' +
        '<div class="pt-node"><i class="' + esc(p.icon || 'fas fa-mobile-alt') + '"></i></div>' +
        '<div class="pt-period">' + esc(p.period || '') + '</div>' +
        '<div class="pt-card' + (hasPhoto ? ' has-photo' : '') + '" tabindex="0" role="button" aria-label="View details of ' + esc(p.title) + '">' +
        (p.featured ? '<span class="pt-featured"><i class="fas fa-star"></i> Featured</span>' : '') +
        '<div class="pt-preview' + (hasPhoto ? ' pt-preview-photo' : '') + '"' + (hasPhoto ? '' : ' style="background:' + esc(p.gradient || '') + ';"') + '>' +
        (hasPhoto ? photoBlock(p) : mockup(p, true)) +
        '<span class="status-badge ' + esc(p.status || 'live') + '"><span class="status-dot"></span> ' + esc(p.statusText || '') + '</span></div>' +
        '<div class="pt-body"><h3>' + esc(p.title) + '</h3>' +
        '<p class="proj-platform">' + esc(p.platform) + '</p>' +
        '<p class="pt-desc">' + esc(p.description) + '</p>' +
        '<div class="proj-tech">' + (p.tech || []).slice(0, 4).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<div class="pt-foot"><div class="store-links">' + storeLinks(p.links, true) + '</div>' +
        '<span class="pt-more">Details <i class="fas fa-arrow-right"></i></span></div>' +
        '</div></div></div>';
    });
    wrap.innerHTML = html;

    // clicking/activating the photo opens the full-image lightbox instead of
    // the project detail modal (stopPropagation keeps the two independent)
    wrap.querySelectorAll('.pt-photo').forEach(function (photoEl) {
      function zoom(e) {
        e.stopPropagation();
        var img = photoEl.querySelector('img');
        openLightbox(img.src, img.alt);
      }
      photoEl.addEventListener('click', zoom);
      photoEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zoom(e); } });
    });

    // entrance animation
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    wrap.querySelectorAll('.pt-item').forEach(function (el) { io.observe(el); });

    // 3D tilt on cards
    wrap.querySelectorAll('.pt-card').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = 'perspective(900px) rotateY(' + x * 10 + 'deg) rotateX(' + (-y * 10) + 'deg) translateZ(12px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });

    // open modal
    wrap.querySelectorAll('.pt-card').forEach(function (c, idx) {
      function open() { openProjectModal(projects[Number(c.closest('.pt-item').dataset.idx)]); }
      c.addEventListener('click', open);
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    // spine progress fill on scroll
    var prog = document.getElementById('ptProgress');
    function onScroll() {
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var done = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / (r.height)));
      prog.style.height = (done * 100) + '%';
      wrap.querySelectorAll('.pt-node').forEach(function (n) {
        var nr = n.getBoundingClientRect();
        n.classList.toggle('lit', nr.top < vh * 0.7);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Project detail modal ---------- */

  function openProjectModal(p) {
    var modal = document.getElementById('projModal');
    if (!modal || !p) return;
    var preview = modal.querySelector('.pm-preview');
    var mock = modal.querySelector('.pm-mock');
    var hasPhoto = !!p.imageUrl;
    preview.classList.toggle('has-photo', hasPhoto);
    if (hasPhoto) {
      preview.style.background = '';
      mock.className = 'pm-mock pm-photo';
      mock.innerHTML = '<img src="' + esc(p.imageUrl) + '" alt="' + esc(p.title) + '">';
      mock.onclick = function (e) { e.stopPropagation(); openLightbox(p.imageUrl, p.title); };
    } else {
      preview.style.background = p.gradient || '';
      mock.className = 'pm-mock';
      mock.innerHTML = mockup(p);
      mock.onclick = null;
    }
    modal.querySelector('.pm-badge').innerHTML = '<span class="status-badge ' + esc(p.status || 'live') + '"><span class="status-dot"></span> ' + esc(p.statusText || '') + '</span>';
    modal.querySelector('.pm-title').textContent = p.title;
    modal.querySelector('.pm-platform').textContent = p.platform || '';
    modal.querySelector('.pm-desc').textContent = p.description || '';
    modal.querySelector('.pm-highlights').innerHTML = (p.highlights || []).map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('');
    modal.querySelector('.pm-tech').innerHTML = (p.tech || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    modal.querySelector('.pm-links').innerHTML = storeLinks(p.links) || '<span class="pm-nolinks">Private client project — not publicly listed</span>';
    modal.classList.add('open');
    refreshBodyScrollLock();
  }
  function closeProjectModal() {
    var modal = document.getElementById('projModal');
    modal.classList.remove('open');
    refreshBodyScrollLock();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var lb = document.getElementById('imgLightbox');
    if (lb && lb.classList.contains('open')) { closeLightbox(); return; }
    closeProjectModal();
  });
  document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('projModal');
    if (modal) {
      modal.addEventListener('click', function (e) { if (e.target === modal) closeProjectModal(); });
      modal.querySelector('.pm-close').addEventListener('click', closeProjectModal);
    }
    var lb = document.getElementById('imgLightbox');
    if (lb) {
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
      lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    }
  });

  /* ---------- Render + refresh flow ---------- */

  function renderAll(data) {
    var p = data.profile || {};
    renderHero(p);
    renderAbout(p);
    renderContact(p);
    renderSkills(data.skills || []);
    renderProjects(data.projects || []);
    renderExperience(data.experiences || []);
    renderEducation(data.education || []);
    renderCerts(data.certifications || []);
    renderStats(p, data.projects || []);
    rescanReveals();
  }

  function merge(base, fresh) {
    if (!fresh) return base;
    var out = {};
    ['projects', 'skills', 'experiences', 'education', 'certifications'].forEach(function (k) {
      out[k] = (fresh[k] && fresh[k].length) ? fresh[k] : base[k];
    });
    out.profile = fresh.profile || base.profile;
    return out;
  }

  var cached = null;
  try { cached = JSON.parse(localStorage.getItem('siteContent') || 'null'); } catch (e) { /* ignore */ }

  window.SITE_DATA = merge(DEFAULT_DATA, cached);
  renderAll(window.SITE_DATA);

  var apiBase = (window.SITE_CONFIG && window.SITE_CONFIG.apiBase) || '';
  if (apiBase) {
    fetch(apiBase + '/api/content')
      .then(function (r) { if (!r.ok) throw new Error('API ' + r.status); return r.json(); })
      .then(function (fresh) {
        window.SITE_DATA = merge(DEFAULT_DATA, fresh);
        try { localStorage.setItem('siteContent', JSON.stringify(fresh)); } catch (e) { /* storage full */ }
        renderAll(window.SITE_DATA);
      })
      .catch(function () { /* offline or cold-starting server: fallback already rendered */ });
  }
})();
