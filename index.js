const themeToggler = document.querySelector('.theme-toggler');
const lightIcon = themeToggler.querySelector('span:nth-child(1)');
const darkIcon = themeToggler.querySelector('span:nth-child(2)');

// Função para aplicar tema
function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-theme');
    lightIcon.classList.remove('active');
    darkIcon.classList.add('active');
  } else {
    document.body.classList.remove('dark-theme');
    lightIcon.classList.add('active');
    darkIcon.classList.remove('active');
  }
}

// Verifica o tema salvo no localStorage ao carregar a página
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  applyTheme(true);
} else {
  applyTheme(false);
}

// Evento para alternar tema e salvar a preferência
themeToggler.addEventListener('click', () => {
  const isDarkMode = document.body.classList.toggle('dark-theme');

  if (isDarkMode) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }

  lightIcon.classList.toggle('active');
  darkIcon.classList.toggle('active');
});
