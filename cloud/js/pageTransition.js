async function campeonatos() {
    const list = container.querySelector('#campeonatos-lista ul');
    if (!list) return;
    list.innerHTML = '';
    try {
        const data = await window.api.getCampeonatos();
        data.forEach(campeonato => {
            const li = document.createElement('li');
            li.textContent = campeonato.nome;
            list.appendChild(li);
        });
    } catch (error) {
        console.error(error);
    }
}

async function ingressos() {
    const campeonatoSelect = document.getElementById('ingressos-campeonato-select');
    const list = container.querySelector('#ingressos-lista ul');
    if (!campeonatoSelect || !list) return;

    async function carregarIngressos() {
        list.innerHTML = '';
        try {
            const data = await window.api.getIngressos(campeonatoSelect.value);
            data.forEach(ingresso => {
                const li = document.createElement('li');
                li.textContent = ingresso.nome;
                list.appendChild(li);
            });
        } catch (error) {
            console.error(error);
        }
    }

    await carregarIngressos();
    campeonatoSelect.removeEventListener('change', carregarIngressos);
    campeonatoSelect.addEventListener('change', carregarIngressos);
}

async function estatisticas() {

}

async function configuracoes() {

}

async function transition(newPage, button) {
    const botoes = document.querySelectorAll('nav ul li button');
    botoes.forEach(btn => btn.classList.remove('selected-nav'));
    button.classList.add('selected-nav');

    const content = await window.api.getCloudPage(newPage);
    container.innerHTML = content;
    container.classList.add('animate__animated', 'animate__fadeIn');
    setTimeout(() => {
        container.classList.remove('animate__animated', 'animate__fadeIn');
    }, 1000);
    switch (newPage) {
        case 'campeonatos.html':
            campeonatos();
            break;
        case 'ingressos.html':
            ingressos();
            break;
        case 'estatisticas.html':
            estatisticas();
            break;
        case 'configuracoes.html':
            configuracoes();
            break;
        default:
            break;
    }
}
