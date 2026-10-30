/* ═══════════════════════════════════════════════
   Dangel — interactive terminal
   - 홈의 #term 에 인라인 터미널을 띄우고
   - 모든 페이지에서 ` (백틱) 키로 드롭다운 터미널을 엽니다.
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var SITE = window.SITE || { base: '', categories: [], posts: [] };
  var THEMES = ['green', 'amber', 'dracula', 'paper'];
  var HIST_KEY = 'dangel-history';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function url(p) { return SITE.base + p; }
  function catBy(dir) {
    return SITE.categories.find(function (c) { return c.dir === dir || c.slug === dir; });
  }
  function postsIn(slug) { return SITE.posts.filter(function (p) { return p.cat === slug; }); }
  function store(get, key, val) {
    try { return get ? localStorage.getItem(key) : localStorage.setItem(key, val); } catch (e) { return null; }
  }

  /* ── 테마 ─────────────────────────────── */
  function setTheme(name) {
    if (name === 'green') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = name;
    store(false, 'dangel-theme', name === 'green' ? '' : name);
  }
  function currentTheme() { return document.documentElement.dataset.theme || 'green'; }
  function nextTheme() {
    var i = THEMES.indexOf(currentTheme());
    var n = THEMES[(i + 1) % THEMES.length];
    setTheme(n);
    return n;
  }

  /* ── 명령어 ───────────────────────────── */
  var COMMANDS = {
    help: function () {
      return [
        '<span class="ok">사용 가능한 명령어</span>',
        '  <b>ls</b> [dir]        디렉터리(카테고리) / 글 목록',
        '  <b>cd</b> &lt;dir&gt;        카테고리로 이동  (cd ctf, cd ~, cd about)',
        '  <b>open</b> &lt;n&gt;        ls 결과의 n번째 글 열기',
        '  <b>grep</b> &lt;word&gt;     제목/태그 검색',
        '  <b>recent</b>          최근 글 5개',
        '  <b>whoami</b>          자기소개',
        '  <b>neofetch</b>        블로그 정보',
        '  <b>theme</b> [name]    테마 변경 (' + THEMES.join(' | ') + ')',
        '  <b>history</b> · <b>clear</b> · <b>date</b> · <b>echo</b> · <b>exit</b>',
        '<span class="dim">Tab: 자동완성 · ↑↓: 히스토리 · ` : 어디서나 터미널 열기</span>'
      ].join('\n');
    },

    ls: function (args, t) {
      var dir = (args[0] || '').replace(/^~?\/?/, '').replace(/\/$/, '');
      if (!dir) {
        t.last = [];
        return SITE.categories.map(function (c) {
          return 'drwxr-xr-x  <a href="' + url('/' + c.dir + '/') + '" class="ok">' + esc(c.dir) + '/</a>' +
            '  <span class="dim">' + String(c.count).padStart(2) + ' posts · ' + esc(c.name) + '</span>';
        }).concat(['-rw-r--r--  <a href="' + url('/about/') + '">about.md</a>']).join('\n');
      }
      var c = catBy(dir);
      if (!c) return '<span class="err">ls: \'' + esc(dir) + '\'에 접근할 수 없습니다: 그런 디렉터리가 없습니다</span>';
      return listPosts(postsIn(c.slug), t, 'ls: ' + c.dir + '/ 는 비어 있습니다');
    },

    cd: function (args) {
      var d = (args[0] || '~').replace(/^~?\/?/, '').replace(/\/$/, '');
      if (d === '' || d === '..' || d === '~') return go('/');
      if (d === 'about' || d === 'whoami') return go('/about/');
      var c = catBy(d);
      if (!c) return '<span class="err">cd: ' + esc(d) + ': 그런 디렉터리가 없습니다</span>  <span class="dim">(ls 로 확인)</span>';
      return go('/' + c.dir + '/');
    },

    open: function (args, t) {
      var n = parseInt(args[0], 10);
      var list = t.last && t.last.length ? t.last : SITE.posts;
      if (!n || n < 1 || n > list.length) return '<span class="err">open: 1~' + list.length + ' 사이 번호를 입력하세요</span>';
      location.href = list[n - 1].url;
      return '<span class="dim">opening ' + esc(list[n - 1].title) + ' ...</span>';
    },

    grep: function (args, t) {
      var q = args.join(' ').toLowerCase();
      if (!q) return '<span class="err">usage: grep &lt;word&gt;</span>';
      var hits = SITE.posts.filter(function (p) {
        return p.title.toLowerCase().indexOf(q) > -1 ||
          (p.tags || []).some(function (tg) { return String(tg).toLowerCase().indexOf(q) > -1; });
      });
      return listPosts(hits, t, 'grep: \'' + q + '\' 와 일치하는 글이 없습니다');
    },

    recent: function (_, t) { return listPosts(SITE.posts.slice(0, 5), t, '아직 글이 없습니다'); },

    whoami: function () {
      return [
        '<span class="ok">dangel</span>  <span class="dim">— security learner &amp; developer</span>',
        '  “만들 줄 알아야 부술 수 있고, 부숴봐야 제대로 만든다.”',
        '  자세히 → <a href="' + url('/about/') + '">cd about</a>'
      ].join('\n');
    },

    neofetch: function () {
      var logo = [
        '   ____  ',
        '  |  _ \\ ',
        '  | | | |',
        '  | |_| |',
        '  |____/ '
      ];
      var info = [
        '<span class="ok">dangel</span>@<span class="ok">blog</span>',
        '-----------',
        '<span class="ok">OS</span>: GitHub Pages (Jekyll)',
        '<span class="ok">Shell</span>: dangel-sh 1.0',
        '<span class="ok">Theme</span>: ' + currentTheme(),
        '<span class="ok">Posts</span>: ' + SITE.posts.length + ' in ' + SITE.categories.length + ' dirs',
        '<span class="ok">Uptime</span>: since ' + (SITE.posts.length ? SITE.posts[SITE.posts.length - 1].date : 'today')
      ];
      var out = [];
      for (var i = 0; i < info.length; i++) out.push('<span class="ok">' + esc(logo[i] || '         ') + '</span>   ' + info[i]);
      return out.join('\n');
    },

    theme: function (args) {
      var n = args[0];
      if (!n) n = nextTheme();
      else if (THEMES.indexOf(n) < 0) return '<span class="err">theme: ' + esc(n) + ' 없음. 선택: ' + THEMES.join(', ') + '</span>';
      else setTheme(n);
      return 'theme → <span class="ok">' + n + '</span>';
    },

    history: function (_, t) {
      return t.hist.map(function (h, i) { return String(i + 1).padStart(4) + '  ' + esc(h); }).join('\n') || '';
    },
    date: function () { return new Date().toString(); },
    echo: function (args) { return esc(args.join(' ')); },
    clear: function (_, t) { t.out.innerHTML = ''; return null; },
    exit: function (_, t) {
      if (t.drawer) { t.drawer.classList.remove('open'); return null; }
      return '<span class="dim">logout? 여긴 블로그라 나갈 수 없어요 :)</span>';
    },
    sudo: function (args) {
      if (args.join(' ').indexOf('rm -rf') > -1) return '<span class="err">nice try. 이 사건은 보고됩니다. 🚨</span>';
      return '<span class="warn">dangel is not in the sudoers file. This incident will be reported.</span>';
    },
    pwd: function () { return '/home/dangel' + location.pathname.replace(SITE.base, '').replace(/\/$/, ''); },
    cat: function (args) {
      if (/about/.test(args[0] || '')) return go('/about/');
      if (/flag/i.test(args[0] || '')) return '<span class="warn">DANGEL{r34d_th3_wr1t3ups_f1rst}</span>';
      return '<span class="dim">cat: 글은 open &lt;n&gt; 으로 여세요</span>';
    }
  };
  COMMANDS.dir = COMMANDS.ls;
  COMMANDS['?'] = COMMANDS.help;
  COMMANDS.cls = COMMANDS.clear;

  function listPosts(list, t, emptyMsg) {
    t.last = list;
    if (!list.length) return '<span class="warn">' + esc(emptyMsg) + '</span>';
    return list.map(function (p, i) {
      var c = catBy(p.cat);
      return '<span class="dim">[' + (i + 1) + ']</span> <span class="warn">' + p.date + '</span> ' +
        '<span class="ok">' + esc(c ? c.dir : p.cat) + '/</span> <a href="' + p.url + '">' + esc(p.title) + '</a>';
    }).join('\n') + '\n<span class="dim">→ open &lt;번호&gt; 로 열기</span>';
  }
  function go(path) {
    location.href = url(path);
    return '<span class="dim">cd ' + esc(path) + ' ...</span>';
  }

  /* ── 터미널 위젯 ─────────────────────── */
  function mount(el, opts) {
    opts = opts || {};
    el.classList.add('term');
    el.innerHTML = '<pre class="out"></pre><div class="line"><span class="ps1">dangel@blog:~$</span><input type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="터미널 명령어 입력"></div>';
    var t = {
      el: el, out: el.querySelector('.out'), input: el.querySelector('input'),
      hist: [], hi: 0, last: [], drawer: opts.drawer || null
    };
    try { t.hist = JSON.parse(store(true, HIST_KEY) || '[]'); } catch (e) { t.hist = []; }
    t.hi = t.hist.length;

    function print(html) {
      if (html == null) return;
      t.out.insertAdjacentHTML('beforeend', html + '\n');
      el.scrollTop = el.scrollHeight;
    }
    t.print = print;

    function run(raw) {
      var line = raw.trim();
      print('<span class="ps1">dangel@blog:~$</span>' + esc(raw));
      if (!line) return;
      t.hist.push(line);
      t.hist = t.hist.slice(-50);
      t.hi = t.hist.length;
      store(false, HIST_KEY, JSON.stringify(t.hist));
      var parts = line.split(/\s+/);
      var name = parts.shift().toLowerCase();
      var fn = COMMANDS[name];
      if (!fn) return print('<span class="err">' + esc(name) + ': command not found</span>  <span class="dim">(help 입력)</span>');
      print(fn(parts, t));
    }

    function complete() {
      var v = t.input.value;
      var parts = v.split(/\s+/);
      var pool, word;
      if (parts.length <= 1) { pool = Object.keys(COMMANDS); word = parts[0]; }
      else if (/^(cd|ls|dir)$/.test(parts[0])) { pool = SITE.categories.map(function (c) { return c.dir; }).concat(['about', '~']); word = parts[parts.length - 1]; }
      else if (parts[0] === 'theme') { pool = THEMES; word = parts[parts.length - 1]; }
      else return;
      var m = pool.filter(function (p) { return p.indexOf(word) === 0; });
      if (m.length === 1) { parts[parts.length - 1] = m[0]; t.input.value = parts.join(' ') + ' '; }
      else if (m.length > 1) print('<span class="dim">' + m.join('  ') + '</span>');
    }

    t.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { run(t.input.value); t.input.value = ''; }
      else if (e.key === 'Tab') { e.preventDefault(); complete(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (t.hi > 0) t.input.value = t.hist[--t.hi]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); t.hi = Math.min(t.hist.length, t.hi + 1); t.input.value = t.hist[t.hi] || ''; }
      else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); t.out.innerHTML = ''; }
      else if (e.key === 'Escape' && t.drawer) { t.drawer.classList.remove('open'); t.input.blur(); }
    });
    el.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A' && !window.getSelection().toString()) t.input.focus();
    });

    if (opts.greeting) print(opts.greeting);
    return t;
  }

  /* ── 페이지 초기화 ───────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    // 홈 인라인 터미널
    var home = document.getElementById('term');
    if (home) {
      mount(home, {
        greeting: '<span class="dim">Welcome to dangel-sh 1.0 — </span><b>help</b><span class="dim"> 를 입력해 시작하세요.</span>'
      });
    }

    // 드롭다운 터미널 (모든 페이지)
    var drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', '터미널');
    var inner = document.createElement('div');
    drawer.appendChild(inner);
    document.body.appendChild(drawer);
    var dt = mount(inner, { drawer: drawer, greeting: '<span class="dim">dangel-sh — help · Esc 로 닫기</span>' });

    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (e.key === '`' && (tag !== 'input' && tag !== 'textarea' || e.target === dt.input)) {
        e.preventDefault();
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) dt.input.focus(); else dt.input.blur();
      }
    });

    // 테마 버튼
    document.querySelectorAll('.theme-btn').forEach(function (b) {
      b.addEventListener('click', function () { b.title = 'theme: ' + nextTheme(); });
    });

    // 모바일 메뉴
    var tog = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.nav');
    if (tog && nav) tog.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      tog.setAttribute('aria-expanded', open);
    });

    // 코드블록 복사 버튼
    document.querySelectorAll('div.highlighter-rouge').forEach(function (box) {
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'copy';
      btn.addEventListener('click', function () {
        var code = box.querySelector('pre').innerText;
        (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject())
          .then(function () { btn.textContent = 'copied!'; })
          .catch(function () { btn.textContent = 'failed'; })
          .finally(function () { setTimeout(function () { btn.textContent = 'copy'; }, 1500); });
      });
      box.appendChild(btn);
    });
  });
})();
