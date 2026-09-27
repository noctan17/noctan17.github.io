// 言語切り替え（ページごとの対応言語は <html data-langs> で指定）
(function () {
  const STORAGE_KEY = 'hobicale-lang';
  const FALLBACK_LANG = 'en';
  const html = document.documentElement;
  const supported = (html.dataset.langs || 'ja,en').split(',');

  function detect(tag) {
    const t = (tag || '').toLowerCase();
    if (t.startsWith('ja')) return 'ja';
    if (t.startsWith('ko')) return 'ko';
    if (t.startsWith('zh')) {
      const hant = t.includes('hant') || t.includes('-tw') || t.includes('-hk') || t.includes('-mo');
      return hant ? 'zh-Hant' : 'zh-Hans';
    }
    return 'en';
  }

  function normalize(lang) {
    return supported.includes(lang) ? lang : FALLBACK_LANG;
  }

  function readSaved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function save(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function apply(lang) {
    html.dataset.lang = lang;
    html.lang = lang;
    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.dataset.setLang === lang ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const lang = normalize(btn.dataset.setLang);
      save(lang);
      apply(lang);
    });
  });

  const param = new URLSearchParams(location.search).get('lang');
  const initial = param ? detect(param) : (readSaved() || detect(navigator.language));
  apply(normalize(initial));
})();
