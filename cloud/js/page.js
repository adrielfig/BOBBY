function transition(newPage, button) {
    const botoes = document.querySelectorAll('nav ul li button');
    botoes.forEach(btn => btn.classList.remove('selected-nav'));
    button.classList.add('selected-nav');
    
    const pageContent = window.api.getCloudPage(newPage);
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
}