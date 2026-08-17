import {
  PREFERS_DARK_QUERY,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from './theme';

/**
 * Source for the blocking `<script is:inline>` in `ToolLayout.astro`.
 *
 * An inline script cannot import, so this builds the source from the same
 * constants `theme.ts` exports. A key rename then cannot drift between the
 * two.
 *
 * The script runs before first paint. It resolves the stored preference and
 * writes a concrete `data-theme`, so the page never flashes the wrong theme.
 * The `catch` still writes `light`, so the attribute is never absent.
 */
export const THEME_BOOT_SCRIPT = `(function(){
try{
var p=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var t=p==='light'||p==='dark'?p:(matchMedia(${JSON.stringify(PREFERS_DARK_QUERY)}).matches?'dark':'light');
document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},t);
}catch(e){
document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},'light');
}
})();`;
