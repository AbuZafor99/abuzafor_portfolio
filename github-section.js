/* GitHub Activity section: live stats pulled from the public GitHub API,
   cached in localStorage for 1 hour to stay well under the 60 req/h
   unauthenticated rate limit. */
(function () {
  'use strict';

  var USER = (window.SITE_CONFIG && window.SITE_CONFIG.githubUser) || 'AbuZafor99';
  var CACHE_KEY = 'ghData:v2:' + USER;
  var CACHE_TTL = 60 * 60 * 1000; // 1 hour

  var LANG_COLORS = {
    Dart: '#00B4AB', Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6',
    HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219', Kotlin: '#A97BFF', Swift: '#F05138',
    'C++': '#f34b7d', C: '#555555', 'C#': '#178600', PHP: '#4F5D95', Ruby: '#701516',
    Go: '#00ADD8', Rust: '#dea584', Shell: '#89e051', 'Jupyter Notebook': '#DA5B0B',
    'Objective-C': '#438eff', CMake: '#DA3434', Makefile: '#427819',
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function gh(path) {
    return fetch('https://api.github.com' + path, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { if (!r.ok) throw new Error('GitHub API ' + r.status); return r.json(); });
  }

  // Daily contribution counts (github-contributions-api.jogruber.de mirrors
  // the public GitHub contribution calendar with CORS enabled)
  function fetchContributions() {
    return fetch('https://github-contributions-api.jogruber.de/v4/' + USER + '?y=last')
      .then(function (r) { if (!r.ok) throw new Error('contrib ' + r.status); return r.json(); })
      .then(function (d) { return d.contributions || []; })
      .catch(function () { return []; });
  }

  function streaks(days) {
    var total = 0, active = 0, cur = 0, longest = 0, run = 0;
    days.forEach(function (d) {
      total += d.count;
      if (d.count > 0) { active++; run++; if (run > longest) longest = run; }
      else run = 0;
    });
    // current streak: walk back from the last day; today with 0 doesn't break it yet
    var i = days.length - 1;
    if (i >= 0 && days[i].count === 0) i--;
    for (; i >= 0 && days[i].count > 0; i--) cur++;
    return { total: total, active: active, current: cur, longest: longest };
  }

  function fetchAll() {
    return Promise.all([
      gh('/users/' + USER),
      gh('/users/' + USER + '/repos?per_page=100&sort=pushed'),
      gh('/users/' + USER + '/events/public?per_page=100').catch(function () { return []; }),
      fetchContributions(),
    ]).then(function (res) {
      var user = res[0], repos = res[1], events = res[2], contributions = res[3];
      var own = repos.filter(function (r) { return !r.fork; });
      var stars = 0, forks = 0, langCount = {};
      own.forEach(function (r) {
        stars += r.stargazers_count;
        forks += r.forks_count;
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
      });
      var commits = 0, lastPush = null;
      events.forEach(function (e) {
        if (e.type === 'PushEvent') {
          commits += (e.payload && e.payload.commits) ? e.payload.commits.length : 1;
          if (!lastPush) lastPush = e.created_at;
        }
      });
      var langs = Object.keys(langCount).map(function (k) { return { name: k, count: langCount[k] }; })
        .sort(function (a, b) { return b.count - a.count; }).slice(0, 6);
      var totalLang = langs.reduce(function (t, l) { return t + l.count; }, 0) || 1;
      langs.forEach(function (l) { l.pct = Math.round((l.count / totalLang) * 100); });

      return {
        login: user.login,
        name: user.name || user.login,
        avatar: user.avatar_url,
        url: user.html_url,
        bio: user.bio || '',
        followers: user.followers,
        publicRepos: user.public_repos,
        stars: stars,
        forks: forks,
        recentCommits: commits,
        lastPush: lastPush,
        langs: langs,
        contributions: contributions,
        fetchedAt: Date.now(),
      };
    });
  }

  function render(d) {
    var root = document.getElementById('ghContent');
    if (!root) return;

    var statTiles = [
      { icon: 'fas fa-book', num: d.publicRepos, label: 'Public Repos' },
      { icon: 'fas fa-code-commit fa-code-branch', num: d.recentCommits + '+', label: 'Recent Commits' },
      { icon: 'fas fa-star', num: d.stars, label: 'Total Stars' },
      { icon: 'fas fa-users', num: d.followers, label: 'Followers' },
    ].map(function (t) {
      return '<div class="gh-stat"><i class="' + t.icon + '"></i><div class="gh-stat-num">' + t.num + '</div><div class="gh-stat-lbl">' + t.label + '</div></div>';
    }).join('');

    var langBar = d.langs.map(function (l) {
      return '<span class="gh-lang-seg" style="width:' + l.pct + '%;background:' + (LANG_COLORS[l.name] || '#8888a0') + ';" title="' + esc(l.name) + ' ' + l.pct + '%"></span>';
    }).join('');
    var langLegend = d.langs.map(function (l) {
      return '<span class="gh-lang-item"><span class="gh-lang-dot" style="background:' + (LANG_COLORS[l.name] || '#8888a0') + ';"></span>' + esc(l.name) + ' <em>' + l.pct + '%</em></span>';
    }).join('');

    // Daily streak cards + contribution calendar
    var days = d.contributions || [];
    var activityHTML = '';
    if (days.length) {
      var st = streaks(days);
      var streakCards = [
        { icon: 'fas fa-fire', num: st.current, unit: st.current === 1 ? 'day' : 'days', label: 'Current Streak', hot: st.current > 0 },
        { icon: 'fas fa-bolt', num: st.longest, unit: st.longest === 1 ? 'day' : 'days', label: 'Longest Streak' },
        { icon: 'fas fa-calendar-check', num: st.active, unit: 'days', label: 'Active Days (1y)' },
        { icon: 'fas fa-code-commit fa-terminal', num: st.total, unit: '', label: 'Contributions (1y)' },
      ].map(function (c) {
        return '<div class="gh-streak' + (c.hot ? ' hot' : '') + '"><i class="' + c.icon + '"></i>' +
          '<div class="gh-streak-num">' + c.num + (c.unit ? ' <em>' + c.unit + '</em>' : '') + '</div>' +
          '<div class="gh-streak-lbl">' + c.label + '</div></div>';
      }).join('');

      // GitHub-style heatmap: columns = weeks, rows = weekdays
      var cells = '';
      var firstDow = new Date(days[0].date + 'T00:00:00').getDay();
      for (var i = 0; i < firstDow; i++) cells += '<span class="gh-day empty"></span>';
      var monthLabels = [], lastMonth = -1;
      days.forEach(function (day, idx) {
        var dt = new Date(day.date + 'T00:00:00');
        var week = Math.floor((idx + firstDow) / 7);
        if (dt.getDate() <= 7 && dt.getMonth() !== lastMonth) {
          lastMonth = dt.getMonth();
          monthLabels.push({ week: week, name: dt.toLocaleString('en', { month: 'short' }) });
        }
        var lvl = Math.min(4, day.level != null ? day.level : (day.count > 0 ? Math.min(4, Math.ceil(day.count / 3)) : 0));
        cells += '<span class="gh-day l' + lvl + '" title="' + day.count + ' contribution' + (day.count === 1 ? '' : 's') + ' on ' + day.date + '"></span>';
      });
      var months = monthLabels.map(function (m) {
        return '<span class="gh-cal-month" style="grid-column:' + (m.week + 1) + ';">' + m.name + '</span>';
      }).join('');

      activityHTML =
        '<div class="gh-activity reveal"><div class="gh-langs-head"><i class="fas fa-fire"></i> Daily Activity <span class="gh-hint">last 12 months, updated live</span></div>' +
        '<div class="gh-streaks">' + streakCards + '</div>' +
        '<div class="gh-cal-scroll"><div class="gh-cal-months">' + months + '</div><div class="gh-cal">' + cells + '</div>' +
        '<div class="gh-cal-legend">Less <span class="gh-day l0"></span><span class="gh-day l1"></span><span class="gh-day l2"></span><span class="gh-day l3"></span><span class="gh-day l4"></span> More</div></div></div>';
    }

    root.innerHTML =
      '<div class="gh-top reveal">' +
      '<div class="gh-profile">' +
      '<img src="' + esc(d.avatar) + '" alt="' + esc(d.name) + '" class="gh-avatar">' +
      '<div><div class="gh-name">' + esc(d.name) + '</div>' +
      '<a class="gh-login" href="' + esc(d.url) + '" target="_blank" rel="noopener"><i class="fab fa-github"></i> @' + esc(d.login) + '</a></div>' +
      '<a href="' + esc(d.url) + '" target="_blank" rel="noopener" class="btn-o gh-visit"><i class="fab fa-github"></i> View Profile</a></div>' +
      '<div class="gh-stats">' + statTiles + '</div></div>' +
      '<div class="gh-langs reveal"><div class="gh-langs-head"><i class="fas fa-code"></i> Language Breakdown <span class="gh-hint">across ' + d.publicRepos + ' public repos</span></div>' +
      '<div class="gh-lang-bar">' + langBar + '</div><div class="gh-lang-legend">' + langLegend + '</div></div>' +
      activityHTML;

    if (window.__observeReveals) window.__observeReveals();
  }

  function init() {
    var root = document.getElementById('ghContent');
    if (!root) return;

    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { /* ignore */ }

    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      render(cached);
      return;
    }
    if (cached) render(cached); // stale cache: show it while refreshing

    fetchAll().then(function (d) {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) { /* ignore */ }
      render(d);
    }).catch(function () {
      // rate-limited or offline with no cache: hide the section rather than show a broken one
      if (!cached) {
        var sec = document.getElementById('github');
        if (sec) sec.style.display = 'none';
        var nav = document.querySelectorAll('a[href="#github"]');
        nav.forEach(function (a) { var li = a.closest('li'); (li || a).style.display = 'none'; });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
