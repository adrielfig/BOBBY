async function campeonatos() {
    const list = container.querySelector('#campeonatos-lista ul');
    if (!list) return;
    list.innerHTML = '';
    try {
        const data = await window.api.getCampeonatos();
        if (!data || data.length === 0) {
            list.innerHTML = '<li>Nenhum campeonato encontrado.</li>';
            return;
        }
        data.forEach(campeonato => {
            const li = document.createElement('li');
            li.textContent = campeonato.nome;
            list.appendChild(li);
        });
    } catch (error) {
        console.error(error);
    }
}

let campeonatoSelected = null;

async function ingressos() {
    const campeonatoSelect = document.getElementById('ingressos-campeonato-select');
    const list = container.querySelector('#ingressos-lista ul');
    const ingressosBtns = document.getElementById('ingressos-btns');
    if (!campeonatoSelect || !list) return;

    async function carregarIngressos() {
        list.innerHTML = '';
        campeonatoSelected = campeonatoSelect.value;
        console.log(campeonatoSelected);
        ingressosBtns.style.display = 'none';
        if (campeonatoSelect.value === '') {
            list.innerHTML = '<li>Por favor, selecione um campeonato.</li>';
            return;
        }
        // Carrega os campeonatos para o select
        try {
            const data = await window.api.getCampeonatos();
            if (!data || data.length === 0) {
                campeonatoSelect.innerHTML = '<option value="">Nenhum campeonato disponível</option>';
                campeonatoSelected = null;
                return;
            }
            campeonatoSelect.innerHTML = '<option value="">Selecione um campeonato</option>';
            console.log(campeonatoSelected)
            ingressosBtns.style.display = 'block';
            data.forEach(campeonato => {
                const option = document.createElement('option');
                option.id = campeonato.nome;
                option.value = campeonato.nome;
                option.textContent = campeonato.nome;
                campeonatoSelect.appendChild(option);
            });
            campeonatoSelect.value = campeonatoSelected || '';
            campeonatoSelected = null;
        } catch (error) {
            console.error(error);
        }

        try {
            const data = await window.api.getIngressos(campeonatoSelect.value);
            if (!data || data.length === 0) {
                list.innerHTML = '<li>Nenhum ingresso encontrado para o campeonato selecionado.</li>';
                return;
            }
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