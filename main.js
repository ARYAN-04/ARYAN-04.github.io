/**
 * Aryan Dwivedi Portfolio: Shared Scripts
 * Features: Command Palette (Cmd+K or /), Themes and Accents, Live IST Clock, GitHub API
 */

(function () {
  'use strict';

  const GH_USER = 'ARYAN-04';
  const EMAIL = 'aryandwivedi208@gmail.com';
  const X_URL = 'https://x.com/aryand208';

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* --------------------------------------------------------------------------
     1. THEME & ACCENT MANAGEMENT
     -------------------------------------------------------------------------- */
  const THEMES = [
    { id: 'zed-dark', name: 'Dark', defaultAccent: '#FF746C' },
    { id: 'ayu-dark', name: 'Ayu', defaultAccent: '#ffb454' },
    { id: 'nord', name: 'Nord', defaultAccent: '#88c0d0' },
    { id: 'zed-light', name: 'Light', defaultAccent: '#e45649' }
  ];

  const SWATCHES = [
    { name: 'Pastel Red', hex: '#FF746C' },
    { name: 'Amber', hex: '#ffb454' },
    { name: 'Cyan', hex: '#88c0d0' },
    { name: 'Emerald', hex: '#98c379' },
    { name: 'Purple', hex: '#c678dd' },
    { name: 'Blue', hex: '#61afef' }
  ];

  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function applyTheme(themeId) {
    if (themeId === 'zed-dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
    localStorage.setItem('portfolio-theme', themeId);

    document.querySelectorAll('.flavor-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.flavor === themeId);
    });
  }

  function applyAccent(colorHex) {
    document.documentElement.style.setProperty('--accent', colorHex);
    document.documentElement.style.setProperty('--accent-soft', hexToRgba(colorHex, 0.14));
    document.documentElement.style.setProperty('--accent-border', hexToRgba(colorHex, 0.32));
    localStorage.setItem('portfolio-accent', colorHex);

    document.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color.toLowerCase() === colorHex.toLowerCase());
    });
  }

  function applyBgEffect(enabled) {
    document.body.classList.toggle('bg-effect-on', enabled);
    localStorage.setItem('portfolio-bg-effect', enabled ? 'true' : 'false');
    const toggle = document.getElementById('bg-effect-checkbox');
    if (toggle) toggle.checked = enabled;
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'zed-dark';
    const savedAccent = localStorage.getItem('portfolio-accent') || '#FF746C';
    const savedBgEffect = localStorage.getItem('portfolio-bg-effect') === 'true';

    applyTheme(savedTheme);
    applyAccent(savedAccent);
    applyBgEffect(savedBgEffect);

    const themePickerContainer = document.getElementById('theme-picker-widget');
    if (themePickerContainer) {
      themePickerContainer.innerHTML = `
        <div class="bento-header">
          <div class="bento-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            Themes
          </div>
          <span style="font-family:var(--mono);font-size:11px;color:var(--text-muted);">Presets</span>
        </div>
        <div class="theme-flavors">
          <button class="flavor-btn ${savedTheme === 'zed-dark' ? 'active' : ''}" data-flavor="zed-dark">Dark</button>
          <button class="flavor-btn ${savedTheme === 'ayu-dark' ? 'active' : ''}" data-flavor="ayu-dark">Ayu</button>
          <button class="flavor-btn ${savedTheme === 'nord' ? 'active' : ''}" data-flavor="nord">Nord</button>
          <button class="flavor-btn ${savedTheme === 'zed-light' ? 'active' : ''}" data-flavor="zed-light">Light</button>
        </div>
        <div class="color-swatches" id="swatch-container"></div>
        <div class="bg-effect-toggle">
          <label class="toggle-label" for="bg-effect-checkbox">
            <input type="checkbox" id="bg-effect-checkbox" class="toggle-checkbox" ${savedBgEffect ? 'checked' : ''}>
            <span>Dot-grid Pattern</span>
          </label>
          <span style="color:var(--text-muted);" id="bg-effect-state">${savedBgEffect ? 'ON' : 'OFF'}</span>
        </div>
      `;

      const swatchContainer = document.getElementById('swatch-container');
      SWATCHES.forEach(c => {
        const btn = document.createElement('button');
        btn.className = `swatch-btn ${c.hex.toLowerCase() === savedAccent.toLowerCase() ? 'active' : ''}`;
        btn.dataset.color = c.hex;
        btn.title = c.name;
        btn.style.backgroundColor = c.hex;
        btn.addEventListener('click', () => {
          applyAccent(c.hex);
          showToast(`Applied ${c.name} accent`);
        });
        swatchContainer.appendChild(btn);
      });

      themePickerContainer.querySelectorAll('.flavor-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const flavor = btn.dataset.flavor;
          applyTheme(flavor);
          const themeConfig = THEMES.find(t => t.id === flavor);
          if (themeConfig) {
            applyAccent(themeConfig.defaultAccent);
          }
          showToast(`Theme: ${btn.textContent}`);
        });
      });

      const bgCheckbox = document.getElementById('bg-effect-checkbox');
      const bgStateLabel = document.getElementById('bg-effect-state');
      if (bgCheckbox) {
        bgCheckbox.addEventListener('change', (e) => {
          applyBgEffect(e.target.checked);
          if (bgStateLabel) bgStateLabel.textContent = e.target.checked ? 'ON' : 'OFF';
        });
      }
    }
  }

  /* --------------------------------------------------------------------------
     2. LIVE NEW DELHI (IST) CLOCK
     -------------------------------------------------------------------------- */
  function updateLiveClock() {
    const clockElements = document.querySelectorAll('.live-clock-time');
    const iconElements = document.querySelectorAll('.live-clock-icon');
    if (!clockElements.length) return;

    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const timeString = now.toLocaleTimeString('en-GB', options);
      
      const hourOptions = { timeZone: 'Asia/Kolkata', hour12: false, hour: 'numeric' };
      const currentHour = parseInt(now.toLocaleTimeString('en-US', hourOptions), 10);
      const isDay = currentHour >= 6 && currentHour < 18;

      clockElements.forEach(el => {
        el.textContent = `${timeString} IST`;
      });
      iconElements.forEach(el => {
        el.textContent = isDay ? '☀️' : '🌙';
      });
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     3. TOAST NOTIFICATION
     -------------------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  /* --------------------------------------------------------------------------
     4. COMMAND PALETTE (Press / or ⌘K)
     -------------------------------------------------------------------------- */
  const COMMANDS = [
    {
      group: 'Navigation',
      label: 'Go to Home',
      icon: 'home',
      run: () => { window.location.href = './'; }
    },
    {
      group: 'Navigation',
      label: 'Go to About',
      icon: 'user',
      run: () => { window.location.href = 'about'; }
    },
    {
      group: 'Navigation',
      label: 'Go to Projects',
      icon: 'folder',
      run: () => { window.location.href = 'projects'; }
    },
    {
      group: 'Navigation',
      label: 'Go to Resume',
      icon: 'file',
      run: () => { window.location.href = 'resume'; }
    },
    {
      group: 'Navigation',
      label: 'Go to Contact',
      icon: 'mail',
      run: () => { window.location.href = 'contact'; }
    },
    {
      group: 'Actions',
      label: 'Download Resume (PDF)',
      icon: 'download',
      badge: 'PDF',
      run: () => { window.open('resume.pdf', '_blank', 'noopener'); }
    },
    {
      group: 'Actions',
      label: 'Copy Email Address',
      icon: 'copy',
      badge: 'Clipboard',
      run: () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(EMAIL).then(() => {
            showToast(`Copied ${EMAIL} to clipboard`);
          }).catch(() => {});
        } else {
          showToast(`Email: ${EMAIL}`);
        }
      }
    },
    {
      group: 'Social Profiles',
      label: 'Open X Profile (@aryand208)',
      icon: 'external',
      badge: '↗',
      run: () => { window.open(X_URL, '_blank', 'noopener'); }
    },
    {
      group: 'Social Profiles',
      label: 'Open GitHub Profile',
      icon: 'external',
      badge: '↗',
      run: () => { window.open(`https://github.com/${GH_USER}`, '_blank', 'noopener'); }
    },
    {
      group: 'Social Profiles',
      label: 'Open LinkedIn Profile',
      icon: 'external',
      badge: '↗',
      run: () => { window.open('https://linkedin.com/in/aryan-dwivedi-5905a51ba/', '_blank', 'noopener'); }
    },
    {
      group: 'Themes',
      label: 'Switch Theme to Dark (Pastel Red)',
      icon: 'moon',
      run: () => { applyTheme('zed-dark'); applyAccent('#FF746C'); showToast('Theme: Dark'); }
    },
    {
      group: 'Themes',
      label: 'Switch Theme to Ayu (Amber)',
      icon: 'moon',
      run: () => { applyTheme('ayu-dark'); applyAccent('#ffb454'); showToast('Theme: Ayu'); }
    },
    {
      group: 'Themes',
      label: 'Switch Theme to Nord (Cyan)',
      icon: 'moon',
      run: () => { applyTheme('nord'); applyAccent('#88c0d0'); showToast('Theme: Nord'); }
    },
    {
      group: 'Themes',
      label: 'Switch Theme to Light',
      icon: 'sun',
      run: () => { applyTheme('zed-light'); applyAccent('#e45649'); showToast('Theme: Light'); }
    }
  ];

  const ICONS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
  };

  let paletteOverlay = null;
  let paletteInput = null;
  let paletteResults = null;
  let currentFiltered = [];
  let selectedIdx = 0;

  function createPaletteDom() {
    if (document.getElementById('palette-overlay')) return;

    paletteOverlay = document.createElement('div');
    paletteOverlay.id = 'palette-overlay';
    paletteOverlay.className = 'palette-overlay';
    paletteOverlay.setAttribute('role', 'dialog');
    paletteOverlay.setAttribute('aria-modal', 'true');

    paletteOverlay.innerHTML = `
      <div class="palette-modal">
        <div class="palette-input-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input id="palette-input" type="text" placeholder="Type a command or search pages..." autocomplete="off" spellcheck="false">
          <span class="palette-esc">Esc</span>
        </div>
        <div class="palette-results" id="palette-results"></div>
      </div>
    `;

    document.body.appendChild(paletteOverlay);

    paletteInput = document.getElementById('palette-input');
    paletteResults = document.getElementById('palette-results');

    paletteOverlay.addEventListener('click', (e) => {
      if (e.target === paletteOverlay) closePalette();
    });

    paletteInput.addEventListener('input', () => {
      renderPaletteResults(paletteInput.value);
    });

    paletteInput.addEventListener('keydown', onPaletteKeyDown);
  }

  function renderPaletteResults(query) {
    const q = (query || '').trim().toLowerCase();
    currentFiltered = COMMANDS.filter(cmd => {
      return cmd.label.toLowerCase().includes(q) ||
             (cmd.group && cmd.group.toLowerCase().includes(q)) ||
             (cmd.badge && cmd.badge.toLowerCase().includes(q));
    });

    selectedIdx = 0;
    paletteResults.innerHTML = '';

    if (!currentFiltered.length) {
      paletteResults.innerHTML = '<div class="palette-empty">No matching commands or pages.</div>';
      return;
    }

    let lastGroup = null;
    currentFiltered.forEach((cmd, idx) => {
      if (cmd.group !== lastGroup) {
        const grp = document.createElement('div');
        grp.className = 'palette-group-title';
        grp.textContent = cmd.group;
        paletteResults.appendChild(grp);
        lastGroup = cmd.group;
      }

      const row = document.createElement('div');
      row.className = `palette-row ${idx === selectedIdx ? 'selected' : ''}`;
      row.dataset.index = idx;

      const svgContent = ICONS[cmd.icon] || ICONS.file;
      row.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${svgContent}</svg>
        <span class="palette-label">${cmd.label}</span>
        ${cmd.badge ? `<span class="palette-badge">${cmd.badge}</span>` : ''}
      `;

      row.addEventListener('click', () => executePaletteItem(idx));
      row.addEventListener('mousemove', () => setPaletteSelected(idx));
      paletteResults.appendChild(row);
    });
  }

  function setPaletteSelected(idx) {
    selectedIdx = idx;
    paletteResults.querySelectorAll('.palette-row').forEach(el => {
      el.classList.toggle('selected', parseInt(el.dataset.index, 10) === idx);
    });
  }

  function executePaletteItem(idx) {
    const cmd = currentFiltered[idx];
    if (cmd && typeof cmd.run === 'function') {
      closePalette();
      cmd.run();
    }
  }

  function onPaletteKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentFiltered.length) {
        setPaletteSelected((selectedIdx + 1) % currentFiltered.length);
        scrollPaletteRowIntoView();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentFiltered.length) {
        setPaletteSelected((selectedIdx - 1 + currentFiltered.length) % currentFiltered.length);
        scrollPaletteRowIntoView();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executePaletteItem(selectedIdx);
    }
  }

  function scrollPaletteRowIntoView() {
    const selectedEl = paletteResults.querySelector('.palette-row.selected');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  function openPalette() {
    createPaletteDom();
    paletteOverlay.classList.add('open');
    paletteInput.value = '';
    renderPaletteResults('');
    setTimeout(() => { paletteInput.focus(); }, 30);
  }

  function closePalette() {
    if (paletteOverlay) {
      paletteOverlay.classList.remove('open');
    }
  }

  function initPaletteKeyListeners() {
    createPaletteDom();

    document.querySelectorAll('.search-trigger, [data-action="open-palette"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openPalette();
      });
    });

    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (paletteOverlay && paletteOverlay.classList.contains('open')) {
          closePalette();
        } else {
          openPalette();
        }
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        openPalette();
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. GITHUB DATA FETCHER (REPOS, REAL ACTIVITY, LANGUAGES)
     -------------------------------------------------------------------------- */
  function renderRepoCard(repo, isPinned) {
    const updated = new Date(repo.pushed_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    const card = document.createElement('div');
    card.className = 'term-card';
    card.innerHTML = `
      <div class="term-header">
        <div class="term-dots">
          <div class="term-dot red"></div>
          <div class="term-dot yellow"></div>
          <div class="term-dot green"></div>
        </div>
        <div class="term-stars">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          ${isPinned ? '<span>Pinned</span>' : repo.stargazers_count}
        </div>
      </div>
      <div class="term-body">
        <div class="term-repo-path"><span>${GH_USER}</span> / ${escapeHtml(repo.name)}</div>
        <div class="term-title">
          <a href="${repo.html_url}" target="_blank" rel="noopener">${escapeHtml(repo.name)}</a>
        </div>
        <div class="term-desc">${escapeHtml(repo.description) || 'No description provided.'}</div>
        <div class="term-tags">
          ${repo.language ? `<span class="term-tag highlight">${escapeHtml(repo.language)}</span>` : ''}
          ${(repo.topics || []).slice(0, 3).map(t => `<span class="term-tag">${escapeHtml(t)}</span>`).join('')}
          <span class="term-tag" style="margin-left:auto;">${updated}</span>
        </div>
      </div>
    `;
    return card;
  }

  const CACHE_KEY = 'portfolio-gh-cache-v2';
  const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

  function getCachedGitHubData() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.repos)) {
        return parsed;
      }
    } catch (e) {}
    return null;
  }

  function setCachedGitHubData(repos, commits, languages) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        repos: repos || [],
        commits: commits || [],
        languages: languages || null
      }));
    } catch (e) {}
  }

  function renderReposAndCommits(nonForks, fetchedCommits, languageBreakdown) {
    const pinnedContainer = document.getElementById('pinned-repos-grid');
    const dynamicContainer = document.getElementById('dynamic-repos-grid');
    const langBarContainer = document.getElementById('lang-bar-container');
    const commitContainer = document.getElementById('recent-commits-list');

    // 1. Home page: limited to 2 repos
    if (pinnedContainer) {
      pinnedContainer.innerHTML = '';
      const pinnedList = nonForks
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
        .slice(0, 2);

      if (!pinnedList.length) {
        pinnedContainer.innerHTML = '<div class="term-card"><div class="term-body">No public repositories found.</div></div>';
      } else {
        pinnedList.forEach(r => {
          pinnedContainer.appendChild(renderRepoCard(r, true));
        });
      }
    }

    // 2. Projects page: all repositories
    if (dynamicContainer) {
      dynamicContainer.innerHTML = '';
      if (!nonForks.length) {
        dynamicContainer.innerHTML = '<div class="term-card"><div class="term-body">No public repositories found.</div></div>';
      } else {
        nonForks.forEach(r => {
          dynamicContainer.appendChild(renderRepoCard(r, false));
        });
      }
    }

    // 3. Language Mix Bar (All Languages Breakdown)
    if (langBarContainer) {
      const langColors = {
        Python: '#3572A5',
        Go: '#00ADD8',
        TypeScript: '#3178c6',
        JavaScript: '#f1e05a',
        HTML: '#e34c26',
        CSS: '#563d7c',
        PHP: '#4F5D95',
        Shell: '#89e051',
        Dockerfile: '#384d54',
        'C++': '#f34b7d',
        C: '#555555',
        SQL: '#e38c00'
      };

      let sortedLangs = [];
      let total = 0;

      if (languageBreakdown && Object.keys(languageBreakdown).length > 0) {
        total = Object.values(languageBreakdown).reduce((a, b) => a + b, 0);
        sortedLangs = Object.entries(languageBreakdown).sort((a, b) => b[1] - a[1]);
      } else {
        const langCounts = {};
        nonForks.forEach(r => {
          if (r.language) {
            const lang = r.language === 'Jupyter Notebook' ? 'Python' : r.language;
            langCounts[lang] = (langCounts[lang] || 0) + 1;
          }
        });
        total = Object.values(langCounts).reduce((a, b) => a + b, 0);
        sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
      }

      if (total > 0) {
        let barHtml = '<div class="lang-distribution">';
        let chipsHtml = '<div class="lang-chips">';

        sortedLangs.forEach(([lang, val]) => {
          const rawPct = (val / total) * 100;
          if (rawPct < 0.5 && sortedLangs.length > 6) return; // ignore sub-0.5% fragments
          const pct = rawPct >= 1 ? Math.round(rawPct) : rawPct.toFixed(1);
          const color = langColors[lang] || '#a0a0ab';
          barHtml += `<div class="lang-seg" style="width:${Math.max(rawPct, 1)}%;background-color:${color};" title="${lang}: ${pct}%"></div>`;
          chipsHtml += `
            <div class="lang-chip-item">
              <span class="lang-dot" style="background-color:${color};"></span>
              <span>${lang}</span>
              <span style="color:var(--text-muted);">${pct}%</span>
            </div>
          `;
        });

        barHtml += '</div>';
        chipsHtml += '</div>';
        langBarContainer.innerHTML = barHtml + chipsHtml;
      }
    }

    // 4. Real Recent Commits
    if (commitContainer) {
      if (Array.isArray(fetchedCommits) && fetchedCommits.length > 0) {
        commitContainer.innerHTML = fetchedCommits.map(c => `
          <div class="commit-item">
            <span class="commit-msg"><span class="scope">${escapeHtml(c.repo)}:</span> ${escapeHtml(c.message)}</span>
            <span class="commit-diff" style="font-family:var(--mono);color:var(--text-muted);">${c.sha ? `⚲ ${c.sha}` : ''}</span>
          </div>
        `).join('');
      } else {
        const recentlyPushed = nonForks
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, 3);
        commitContainer.innerHTML = recentlyPushed.map(r => `
          <div class="commit-item">
            <span class="commit-msg"><span class="scope">${escapeHtml(r.name)}:</span> pushed update</span>
            <span class="commit-diff" style="font-family:var(--mono);color:var(--text-muted);">${new Date(r.pushed_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
          </div>
        `).join('');
      }
    }
  }

  async function fetchGitHubData() {
    const pinnedContainer = document.getElementById('pinned-repos-grid');
    const dynamicContainer = document.getElementById('dynamic-repos-grid');
    const langBarContainer = document.getElementById('lang-bar-container');
    const commitContainer = document.getElementById('recent-commits-list');

    if (!pinnedContainer && !dynamicContainer && !langBarContainer && !commitContainer) return;

    // Check Cache first (15-min TTL)
    const cached = getCachedGitHubData();
    if (cached) {
      renderReposAndCommits(cached.repos, cached.commits, cached.languages);
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/users/${GH_USER}/repos?sort=pushed&per_page=100`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const repos = await response.json();
      const nonForks = repos.filter(r => !r.fork && r.name !== 'ARYAN-04.github.io');

      // Fetch Real Commits
      let fetchedCommits = [];
      if (commitContainer || !cached) {
        const recentlyPushed = nonForks
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, 3);

        const commitPromises = recentlyPushed.map(async (repo) => {
          try {
            const cRes = await fetch(`https://api.github.com/repos/${GH_USER}/${repo.name}/commits?per_page=1`, {
              headers: { Accept: 'application/vnd.github+json' }
            });
            if (!cRes.ok) return null;
            const cList = await cRes.json();
            if (Array.isArray(cList) && cList.length > 0) {
              return {
                repo: repo.name,
                message: cList[0].commit.message.split('\n')[0],
                sha: (cList[0].sha || '').substring(0, 7)
              };
            }
          } catch (e) {
            return null;
          }
          return null;
        });

        fetchedCommits = (await Promise.all(commitPromises)).filter(Boolean);
      }

      // Fetch Exact Multi-Language Byte Breakdown across repositories
      let languageBreakdown = null;
      if (langBarContainer || !cached) {
        const langTotals = {};
        const langPromises = nonForks.map(async (repo) => {
          try {
            const lRes = await fetch(`https://api.github.com/repos/${GH_USER}/${repo.name}/languages`, {
              headers: { Accept: 'application/vnd.github+json' }
            });
            if (!lRes.ok) return;
            const lData = await lRes.json();
            for (const [lang, bytes] of Object.entries(lData)) {
              const normalized = (lang === 'Jupyter Notebook') ? 'Python' : lang;
              langTotals[normalized] = (langTotals[normalized] || 0) + bytes;
            }
          } catch (e) {}
        });

        await Promise.all(langPromises);
        if (Object.keys(langTotals).length > 0) {
          languageBreakdown = langTotals;
        }
      }

      // Render and cache
      renderReposAndCommits(nonForks, fetchedCommits, languageBreakdown);
      setCachedGitHubData(nonForks, fetchedCommits, languageBreakdown);
    } catch (err) {
      if (pinnedContainer) {
        pinnedContainer.innerHTML = `<div class="term-card"><div class="term-body" style="color:var(--text-muted);">Could not reach GitHub API. Browse repos at <a href="https://github.com/${GH_USER}" target="_blank">github.com/${GH_USER}</a>.</div></div>`;
      }
      if (dynamicContainer) {
        dynamicContainer.innerHTML = `<div class="term-card"><div class="term-body" style="color:var(--text-muted);">Could not reach GitHub API. Browse repos at <a href="https://github.com/${GH_USER}" target="_blank">github.com/${GH_USER}</a>.</div></div>`;
      }
      if (commitContainer) {
        commitContainer.innerHTML = `
          <div class="commit-item" style="color:var(--text-muted);">
            <span>Recent activity available at <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener">github.com/${GH_USER}</a></span>
          </div>
        `;
      }
    }
  }

  /* --------------------------------------------------------------------------
     6. ACTIVE PAGE HIGHLIGHT
     -------------------------------------------------------------------------- */
  function setActiveNav() {
    const raw = window.location.pathname.replace(/^\/|\.html$/g, '').split('/').pop() || '';
    const current = (raw === 'index' || raw === '') ? '' : raw;

    document.querySelectorAll('nav.main-links a').forEach(link => {
      const rawHref = (link.getAttribute('href') || '').replace(/^\/|\.html$/g, '').replace(/^\.\/?$/, '');
      const href = (rawHref === 'index' || rawHref === '') ? '' : rawHref;
      if (href === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     INITIALIZATION
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initPaletteKeyListeners();
    setActiveNav();
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
    fetchGitHubData();

    document.querySelectorAll('[data-action="copy-email"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(EMAIL).then(() => {
            showToast(`Copied ${EMAIL} to clipboard!`);
          }).catch(() => {});
        } else {
          showToast(`Email: ${EMAIL}`);
        }
      });
    });
  });

})();
