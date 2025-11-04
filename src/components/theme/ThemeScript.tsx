// Injected early to avoid theme flash; runs without React on initial load.
export function ThemeScript() {
  const code = `
    (function(){
      try{
        var ls = localStorage.getItem('theme');
        var theme = ls ? ls : 'light';
        var root = document.documentElement;
        if(theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
      }catch(e){}
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
