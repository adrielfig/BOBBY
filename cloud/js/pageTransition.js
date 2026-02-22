async function campeonatos() {
    container.querySelector('#campeonatos-lista ul').innerHTML = '';
    const campeonatos = await window.api.getCampeonatos();
    console.log(campeonatos);
    campeonatos.then(data => {
        data.forEach(campeonato => {
            const li = document.createElement('li');
            li.textContent = campeonato.nome;
            container.querySelector('#campeonatos-lista ul').appendChild(li);
        });
    }).catch(error => {
        console.error('Erro ao carregar campeonatos:', error);
    });
}

async function ingressos() {

}

async function estatisticas() {

}

async function configuracoes() {

}

async function transition(newPage, button) {
    const botoes = document.querySelectorAll('nav ul li button');
    botoes.forEach(btn => btn.classList.remove('selected-nav'));
    button.classList.add('selected-nav');

    const pageContent = await window.api.getCloudPage(newPage);
    pageContent.then(content => {
        container.innerHTML = content;
        // Adicione uma classe de animação para a transição
        container.classList.add('animate__animated', 'animate__fadeIn');
        // Remova a classe de animação após a transição
        setTimeout(() => {
            container.classList.remove('animate__animated', 'animate__fadeIn');
        }, 1000);
    }).catch(error => {
        console.error('Erro ao carregar a página:', error);
    });

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