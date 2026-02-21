const container = document.getElementById('container');
const nav = document.getElementById("navbar")

const previousTheme = localStorage.getItem('theme');
const root = document.documentElement;

if (previousTheme && previousTheme === 'dark') {
    root.style.setProperty('--background-color', '#1e1d1d');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--primary-color', '#333333');
    root.style.setProperty('--secondary-color', '#a0a0a0');
    root.style.setProperty('--third-color', '#1f1f1f');
}

// Remoção da animação de entrada
setTimeout(() => {
    const h1 = container.getElementsByTagName('h1')[0];
    h1.classList.remove('animate__backInDown');
    h1.classList.add('animate__backOutUp');
    setTimeout(() => {
        nav.style.display = 'flex';
        nav.classList.add('animate__animated', 'animate__fadeInDown');
    }, 1000);
}, 3000);

