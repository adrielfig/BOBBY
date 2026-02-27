const container = document.getElementById('container');
const nav = document.getElementById("navbar")

const previousTheme = localStorage.getItem('theme');
const previousFontSize = localStorage.getItem('fontSize');
const root = document.documentElement;

if (previousTheme && previousTheme === 'dark') {
    root.style.setProperty('--background-color', '#1e1d1d');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--primary-color', '#333333');
    root.style.setProperty('--secondary-color', '#a0a0a0');
    root.style.setProperty('--third-color', '#1f1f1f');
}

if (previousFontSize) {
    if (previousFontSize === 'small') {
        root.style.setProperty('--font-size-base', '14px');
    } else if (previousFontSize === 'large') {
        root.style.setProperty('--font-size-base', '18px');
    } else {
        root.style.setProperty('--font-size-base', '16px');
    }
}

// Controles da janela (titlebar personalizada)
const btnMinimize = document.getElementById('btn-minimize');
const btnMaximize = document.getElementById('btn-maximize');
const btnClose = document.getElementById('btn-close');

if (btnMinimize && btnMaximize && btnClose && window.api) {
    btnMinimize.addEventListener('click', () => {
        window.api.windowMinimize();
    });

    btnMaximize.addEventListener('click', () => {
        window.api.windowToggleMaximize();
    });

    btnClose.addEventListener('click', () => {
        window.api.windowClose();
    });
}

function aparecerCampeonatoInput() {
    const container = document.getElementById('campeonato-input');
    container.style.display = 'block';
}
function aparecerIngressoInput() {
    const container = document.getElementById('novo-ingresso-input');
    container.style.display = 'block';
}

async function confirmarCampeonatoCriacao() {
    const nome = document.getElementById('input-campeonato-nome').value;
    if (!nome) return alert("Digite um nome!");

    try {
        const resultado = await window.api.criarCampeonato(nome);
        if (resultado == "existente") return alert("Campeonato já existe!");
        alert("Campeonato criado com sucesso!");
        setTimeout(() => {
            campeonatos();
        }, 1000);
    } catch (err) {
        console.error(err);
    }
}

async function confirmarIngressoCriacao() {
    const campeonatoSelect = document.getElementById('ingressos-campeonato-select');
    const campeonato = campeonatoSelect ? campeonatoSelect.value : '';

    const jogo = document.getElementById('novo-ingresso-jogo')?.value || '';
    const preco = document.getElementById('novo-ingresso-preco')?.value || '';
    const estoque = document.getElementById('novo-ingresso-estoque')?.value || '';
    const data = document.getElementById('novo-ingresso-data')?.value || '';
    const horario = document.getElementById('novo-ingresso-horario')?.value || '';
    const estadio = document.getElementById('novo-ingresso-estadio')?.value || '';
    const thumbnail = document.getElementById('novo-ingresso-thumbnail')?.value || '';

    if (!campeonato) {
        alert('Selecione um campeonato!');
        return;
    }

    if (!jogo || !preco || !estoque || !data || !horario || !estadio) {
        alert('Preencha todos os campos do ingresso!');
        return;
    }

    const ingresso = {
        jogo,
        preco: Number(preco),
        estoque: Number(estoque),
        data,
        horario,
        estadio,
        thumbnail: thumbnail || null
    };

    try {
        await window.api.setIngresso({ campeonato, ingresso });
        alert('Ingresso criado com sucesso!');

        const novoIngressoInput = document.getElementById('novo-ingresso-input');
        if (novoIngressoInput) {
            novoIngressoInput.style.display = 'none';
        }

        if (typeof ingressos === 'function') {
            ingressos();
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao criar ingresso.');
    }
}

// Remoção da animação de entrada
setTimeout(() => {
    if (!container || !nav) return;

    const h1 = container.getElementsByTagName('h1')[0];
    if (!h1) return;

    h1.classList.remove('animate__backInDown');
    h1.classList.add('animate__backOutUp');
    setTimeout(() => {
        nav.style.display = 'flex';
        nav.classList.add('animate__animated', 'animate__fadeInDown');
    }, 1000);
}, 3000);

