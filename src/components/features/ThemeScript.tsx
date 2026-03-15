/**
 * ThemeScript — inline script injected into <head>
 * Reads saved theme from localStorage BEFORE first paint
 * to prevent flash of unstyled content (FOUC).
 *
 * Must be a Server Component returning a <script> tag with
 * dangerouslySetInnerHTML so it runs synchronously.
 */

const VALID_THEMES = ['theme-midnight', 'theme-eclipse', 'theme-parchment', 'theme-arctic']
const DEFAULT_THEME = 'theme-midnight'

// This script runs before React hydration
const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('aiba-theme');
    var valid = ${JSON.stringify(VALID_THEMES)};
    var theme = (saved && valid.includes(saved)) ? saved : '${DEFAULT_THEME}';
    document.documentElement.classList.add(theme);
  } catch(e) {
    document.documentElement.classList.add('${DEFAULT_THEME}');
  }
})();
`

export default function ThemeScript() {
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  )
}
