async function campeonatos() {
    const list = container.querySelector('#campeonatos-lista ul');
    if (!list) return;

    list.style.padding = "0";
    list.style.margin = "0";
    list.style.width = "100%";
    
    list.innerHTML = '';

    try {
        const data = await window.api.getCampeonatos();
        
        data.forEach(campeonato => {
            const li = document.createElement('li');
            
            li.style.display = "flex";
            li.style.width = "600px";  
            li.style.minWidth = "100%";       
            li.style.boxSizing = "border-box";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";
            
            li.style.marginBottom = "12px";
            li.style.padding = "15px 20px";  
            li.style.backgroundColor = "var(--primary-color)";
            li.style.border = "1px solid #e0e0e0";
            li.style.borderRadius = "8px";
            li.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";

            const span = document.createElement('span');
            span.textContent = campeonato.nome;
            span.style.flex = "1";            
            span.style.fontSize = "1.1rem";   
            li.appendChild(span);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.style.padding = "8px 16px";
            btnExcluir.style.backgroundColor = "var(--third-color)";
            btnExcluir.style.cursor = "pointer";
            btnExcluir.style.flexShrink = "0";     
            
            btnExcluir.onclick = () => {
                if(confirm(`Excluir ${campeonato.nome}?`)) {
                    window.api.excluirCampeonato(campeonato.nome).then(() => {
                        campeonatos();
                    });
                }
            };

            li.appendChild(btnExcluir);
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
    const novoIngressoBtns = document.getElementById('novo-ingresso-btns');
    if (!campeonatoSelect || !list) return;
    campeonatoSelect.innerHTML = '<option value="">Selecione um campeonato</option>';
    campeonatoSelect.value = "";

    async function carregarIngressos() {
        campeonatoSelected = campeonatoSelect.value;
        novoIngressoBtns.style.display = 'none';
        list.innerHTML = '<li>Por favor, selecione um campeonato.</li>';
        // Carrega os campeonatos para o select
        try {
            const data = await window.api.getCampeonatos();
            if (!data || data.length === 0) {
                campeonatoSelect.innerHTML = '<option value="">Nenhum campeonato disponível</option>';
                campeonatoSelected = null;
                return;
            }
            campeonatoSelect.innerHTML = '<option value="">Selecione um campeonato</option>';
            if (campeonatoSelected !== "") ingressosBtns.style.display = 'block';

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
                if (campeonatoSelected === "") return;
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