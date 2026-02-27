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
                if (confirm(`Excluir ${campeonato.nome}?`)) {
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
    const novoIngressoInput = document.getElementById('novo-ingresso-input');
    const novoIngressoBtn = document.getElementById('novo-ingresso-btn');
    if (!campeonatoSelect || !list || !novoIngressoInput || !novoIngressoBtn) return;
    campeonatoSelect.innerHTML = '<option value="">Selecione um campeonato</option>';
    campeonatoSelect.value = "";

    async function carregarIngressos() {
        const selected = campeonatoSelect.value;
        campeonatoSelected = selected;

        if (!selected) {
            list.innerHTML = '<li>Por favor, selecione um campeonato.</li>';
            novoIngressoBtn.style.display = 'none';
            novoIngressoInput.style.display = 'none';
        } else {
            list.innerHTML = '<li>Carregando...</li>';
            novoIngressoBtn.style.display = 'none';
            novoIngressoInput.style.display = 'none';
        }

        try {
            const data = await window.api.getCampeonatos();
            if (!data || data.length === 0) {
                if (selected !== "") {
                    campeonatoSelect.innerHTML = '<option value="">Nenhum campeonato disponível</option>';
                    campeonatoSelected = null;
                }
                return;
            }
            campeonatoSelect.innerHTML = '<option value="">Selecione um campeonato</option>';
            data.forEach(campeonato => {
                const option = document.createElement('option');
                option.id = campeonato.nome;
                option.value = campeonato.nome;
                option.textContent = campeonato.nome;
                campeonatoSelect.appendChild(option);
            });

            campeonatoSelect.removeEventListener('change', carregarIngressos);
            campeonatoSelect.value = selected || '';
            campeonatoSelect.addEventListener('change', carregarIngressos);

            if (selected !== "") novoIngressoBtn.style.display = 'block';
            campeonatoSelected = null;
        } catch (error) {
            console.error(error);
        }

        if (!campeonatoSelect.value) {
            list.innerHTML = '<li>Por favor, selecione um campeonato.</li>';
            return;
        }

        try {
            const data = await window.api.getIngressos(campeonatoSelect.value);
            const lista = data && typeof data === 'object' && !Array.isArray(data)
                ? Object.entries(data).map(([id, ing]) => ({ id, ...ing }))
                : Array.isArray(data) ? data : [];

            if (lista.length === 0) {
                list.innerHTML = '<li>Nenhum ingresso encontrado para o campeonato selecionado.</li>';
                return;
            }

            const campeonatoAtual = campeonatoSelect.value;
            list.innerHTML = '';
            lista.forEach(ingresso => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.flexDirection = 'column';
                li.style.width = '600px';
                li.style.minWidth = '100%';
                li.style.boxSizing = 'border-box';
                li.style.marginBottom = '12px';
                li.style.padding = '15px 20px';
                li.style.backgroundColor = 'var(--primary-color)';
                li.style.border = '1px solid #e0e0e0';
                li.style.borderRadius = '8px';
                li.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';

                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.width = '100%';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';

                const span = document.createElement('span');
                span.textContent = `${ingresso.jogo || 'Sem nome'} | ${ingresso.data ?? '—'} | ${ingresso.horario ?? '—'}`;
                span.style.flex = '1';
                span.style.fontSize = '1.1rem';
                row.appendChild(span);

                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.style.padding = '8px 16px';
                btnEditar.style.marginRight = '8px';
                btnEditar.style.backgroundColor = 'var(--third-color)';
                btnEditar.style.cursor = 'pointer';
                btnEditar.style.flexShrink = '0';
                row.appendChild(btnEditar);

                const btnExcluir = document.createElement('button');
                btnExcluir.textContent = 'Excluir';
                btnExcluir.style.padding = '8px 16px';
                btnExcluir.style.backgroundColor = 'var(--third-color)';
                btnExcluir.style.cursor = 'pointer';
                btnExcluir.style.flexShrink = '0';
                row.appendChild(btnExcluir);

                li.appendChild(row);

                const editPanel = document.createElement('div');
                editPanel.style.display = 'none';
                editPanel.style.marginTop = '12px';
                editPanel.style.paddingTop = '12px';
                editPanel.style.borderTop = '1px solid #e0e0e0';
                editPanel.style.flexDirection = 'column';
                editPanel.style.gap = '8px';

                const fields = [
                    { key: 'jogo', placeholder: 'Qual jogo? Ex: FLAMENGO x PALMEIRAS' },
                    { key: 'preco', placeholder: 'Preço em robux. Ex: 25' },
                    { key: 'estoque', placeholder: 'Quantidade disponível. Ex: 50' },
                    { key: 'data', placeholder: 'Data do jogo. Ex: 10/05/2026' },
                    { key: 'horario', placeholder: 'Horário. Ex: 19:00' },
                    { key: 'estadio', placeholder: 'Estádio. Ex: Maracanã' },
                    { key: 'thumbnail', placeholder: 'Thumbnail. Ex: rbxassetid://1234567890' }
                ];

                fields.forEach(({ key, placeholder }) => {
                    const wrap = document.createElement('div');
                    wrap.style.display = 'flex';
                    wrap.style.alignItems = 'center';
                    wrap.style.gap = '8px';
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = placeholder;
                    input.value = ingresso[key] != null ? String(ingresso[key]) : '';
                    input.style.flex = '1';
                    input.style.padding = '6px 10px';
                    const btnApply = document.createElement('button');
                    btnApply.textContent = 'Aplicar';
                    btnApply.style.padding = '6px 12px';
                    btnApply.style.flexShrink = '0';
                    btnApply.style.cursor = 'pointer';
                    btnApply.onclick = async () => {
                        let val = input.value.trim();
                        if (key === 'preco' || key === 'estoque') val = val === '' ? 0 : Number(val);
                        await window.api.atualizarIngresso(campeonatoAtual, ingresso.id, { [key]: val });
                        ingresso[key] = val;
                        span.textContent = `${ingresso.jogo || 'Sem nome'} | ${ingresso.data ?? '—'} | ${ingresso.horario ?? '—'}`;
                    };
                    wrap.appendChild(input);
                    wrap.appendChild(btnApply);
                    editPanel.appendChild(wrap);
                });

                const btnAcabar = document.createElement('button');
                btnAcabar.textContent = 'Acabar Edição';
                btnAcabar.style.marginTop = '8px';
                btnAcabar.style.padding = '8px 16px';
                btnAcabar.style.cursor = 'pointer';
                btnAcabar.onclick = () => {
                    editPanel.style.display = 'none';
                    carregarIngressos();
                };
                editPanel.appendChild(btnAcabar);

                li.appendChild(editPanel);

                btnEditar.onclick = () => {
                    editPanel.style.display = editPanel.style.display === 'none' ? 'flex' : 'none';
                };

                btnExcluir.onclick = () => {
                    if (confirm(`Excluir ingresso "${ingresso.jogo || 'Sem nome'}"?`)) {
                        window.api.excluirIngresso(campeonatoAtual, ingresso.id).then(() => carregarIngressos());
                    }
                };

                list.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            list.innerHTML = '<li>Erro ao carregar ingressos.</li>';
        }
    }

    await carregarIngressos();
    campeonatoSelect.removeEventListener('change', carregarIngressos);
    campeonatoSelect.addEventListener('change', carregarIngressos);
}

async function estatisticas() {
    const resumoTotalCampeonatos = container.querySelector('#total-campeonatos');
    const resumoTotalIngressos = container.querySelector('#total-ingressos');
    const listaIngressosCampeonato = container.querySelector('#lista-ingressos-campeonato');

    if (!resumoTotalCampeonatos || !resumoTotalIngressos || !listaIngressosCampeonato) return;

    resumoTotalCampeonatos.textContent = 'Carregando...';
    resumoTotalIngressos.textContent = 'Carregando...';
    listaIngressosCampeonato.innerHTML = '<li>Carregando...</li>';

    try {
        const dados = await window.api.getEstatisticas();
        const {
            totalCampeonatos = 0,
            totalIngressos = 0,
            totalCompras = 0,
            ingressosPorCampeonato = []
        } = dados || {};

        resumoTotalCampeonatos.textContent = String(totalCampeonatos);
        resumoTotalIngressos.textContent = `${totalIngressos} ingressos / ${totalCompras} compra(s)`;

        if (!ingressosPorCampeonato.length) {
            listaIngressosCampeonato.innerHTML = '<li>Nenhum ingresso cadastrado.</li>';
            return;
        }

        listaIngressosCampeonato.innerHTML = '';
        ingressosPorCampeonato.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.campeonato}: ${item.quantidadeIngressos} ingresso(s) / ${item.quantidadeCompras} compra(s)`;
            listaIngressosCampeonato.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        resumoTotalCampeonatos.textContent = '0';
        resumoTotalIngressos.textContent = '0 ingressos / 0 compra(s)';
        listaIngressosCampeonato.innerHTML = '<li>Erro ao carregar estatísticas.</li>';
    }
}

async function configuracoes() {
    const root = document.documentElement;
    const toggle = container.querySelector('#dark-mode-toggle');
    const fontSizeSelect = container.querySelector('#font-size-select');
    if (!toggle || !fontSizeSelect) return;

    const applyDarkTheme = () => {
        root.style.setProperty('--background-color', '#1e1d1d');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--primary-color', '#333333');
        root.style.setProperty('--secondary-color', '#a0a0a0');
        root.style.setProperty('--third-color', '#1f1f1f');
        localStorage.setItem('theme', 'dark');
    };

    const applyLightTheme = () => {
        root.style.removeProperty('--background-color');
        root.style.removeProperty('--text-color');
        root.style.removeProperty('--primary-color');
        root.style.removeProperty('--secondary-color');
        root.style.removeProperty('--third-color');
        localStorage.removeItem('theme');
    };

    const applyFontSize = (sizeKey) => {
        let sizeValue = '16px';
        if (sizeKey === 'small') sizeValue = '14px';
        if (sizeKey === 'large') sizeValue = '18px';
        root.style.setProperty('--font-size-base', sizeValue);
        localStorage.setItem('fontSize', sizeKey);
    };

    const previousTheme = localStorage.getItem('theme');
    const previousFontSize = localStorage.getItem('fontSize') || 'medium';

    toggle.checked = previousTheme === 'dark';
    fontSizeSelect.value = previousFontSize;
    applyFontSize(previousFontSize);

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    });

    fontSizeSelect.addEventListener('change', () => {
        applyFontSize(fontSizeSelect.value);
    });
}

async function transition(newPage, button) {
    const botoes = document.querySelectorAll('nav ul li button');
    botoes.forEach(btn => btn.classList.remove('selected-nav'));
    button.classList.add('selected-nav');

    const content = await window.api.getCloudPage(newPage);
    container.innerHTML = content;
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