// LÓGICA JAVASCRIPT
// ==========================================================
// VARIÁVEIS DE CONFIGURAÇÃO E ESTADO
const TOTAL_ESTOQUE = 28;
const TOTAL_EXPEDICAO = 12;
const GRID_ESTOQUE = document.getElementById('janela-grid');
const GRID_EXPEDICAO = document.getElementById('expedicao-grid');
const TIPOS = ['vermelha', 'azul', 'preta', 'vazia'];

let processoStatus = 'repouso'; 

// Estado inicial do estoque (28 posições)
let estoque = [
    'vermelha', 'azul', 'preta', 'vazia', 'vermelha', 'azul', 'preta',
    'azul', 'vermelha', 'vazia', 'preta', 'azul', 'vazia', 'vermelha',
    'preta', 'vazia', 'vermelha', 'azul', 'vazia', 'preta', 'vermelha',
    'vermelha', 'azul', 'preta', 'vazia', 'azul', 'preta', 'vermelha'
];

// Estado inicial da Expedição (12 posições com produção ou vazias)
let expedicao = [
    { quantidade: 0, tipo: 'vazio' },
    { quantidade: 3, tipo: 'vermelha' },
    { quantidade: 0, tipo: 'vazio' },
    { quantidade: 1, tipo: 'vermelha' },
    { quantidade: 0, tipo: 'vazio' },
    { quantidade: 5, tipo: 'azul' },
    { quantidade: 0, tipo: 'vazio' },
    { quantidade: 0, tipo: 'vazio' },
    { quantidade: 2, tipo: 'preta' },
    { quantidade: 0, tipo: 'vazio' },
    { quantidade: 0, tipo: 'vazio' },
    { quantidade: 4, tipo: 'preta' },
];


// ==========================================================
// FUNÇÕES AUXILIARES DE RENDERIZAÇÃO
// ==========================================================

// 1. Inicializa o Grid Visual de Estoque e Expedição
function inicializarGrids() {
    // 1.1 Inicializa Estoque (Janelas)
    GRID_ESTOQUE.innerHTML = '';
    estoque.forEach((tipo, i) => {
        const item = document.createElement('div');
        item.className = `janela-item ${tipo}`;
        item.id = `estoque-posicao-${i + 1}`; 
        // Atualizado para SKU conforme aprimoramentos anteriores
        item.innerHTML = tipo === 'vazia' ? 'VAZIA' : `SKU #${i + 1}`; 
        item.setAttribute('data-tipo', tipo); 
        GRID_ESTOQUE.appendChild(item);
    });

    // 1.2 Inicializa Expedição (Lotes)
    GRID_EXPEDICAO.innerHTML = '';
    expedicao.forEach((item, i) => {
        const pos = i + 1;
        const div = document.createElement('div');
        const isVazio = item.quantidade === 0;

        div.className = `expedicao-item ${isVazio ? 'vazio' : item.tipo}`;
        div.id = `expedicao-posicao-${pos}`;
        div.setAttribute('data-posicao', pos);

        if (isVazio) {
            div.innerHTML = `Posição ${pos}<br>VAZIO`;
        } else {
            div.innerHTML = `Posição ${pos}: ${item.tipo.toUpperCase()}<br><span class="expedicao-quantidade">${item.quantidade} un.</span>`;
        }
        GRID_EXPEDICAO.appendChild(div);
    });
    
    atualizarContagem(); 
}

// 2. Atualiza a contagem na tabela (Estoque)
function atualizarContagem() {
    const itens = document.querySelectorAll('.janela-item');
    const contagem = { vermelha: 0, azul: 0, preta: 0, vazia: 0 };

    itens.forEach(item => {
        const tipo = item.getAttribute('data-tipo');
        if (contagem.hasOwnProperty(tipo)) {
            contagem[tipo]++;
        }
    });

    TIPOS.forEach(tipo => {
        const countElement = document.getElementById(`count-${tipo}`);
        const percentElement = document.getElementById(`percent-${tipo}`);
        
        const quantidade = contagem[tipo];
        const percentual = ((quantidade / TOTAL_ESTOQUE) * 100).toFixed(1);

        if (countElement) {
            countElement.textContent = quantidade;
        }
        if (percentElement) {
            percentElement.textContent = `${percentual}%`;
        }
    });
}

// FUNÇÃO AUXILIAR: Determina a cor-base do lote
// CORREÇÃO: Recebe o índice da posição (0-11) para calcular o lote.
function getLoteBaseColor(posicaoIndex) {
    const loteIndex = Math.floor(posicaoIndex / 4);
    
    // As posições do lote são: [loteIndex*4, loteIndex*4 + 3]
    for (let i = loteIndex * 4; i < loteIndex * 4 + 4; i++) {
        if (expedicao[i] && expedicao[i].quantidade > 0) {
            return expedicao[i].tipo;
        }
    }
    return 'vazio'; // O lote está totalmente vazio
}


// ==========================================================
// FUNÇÕES DE CONTROLE DE STATUS E ESTOQUE UNITÁRIO
// ==========================================================

// 3. Lógica para alternar o Status de Processo
function toggleProcessoStatus() {
    const indicator = document.getElementById('processo-status-indicator');
    const button = document.getElementById('toggle-status-btn');

    if (processoStatus === 'repouso') {
        processoStatus = 'trabalhando';
        indicator.textContent = 'EM OPERAÇÃO'; 
        indicator.classList.remove('status-repouso');
        indicator.classList.add('status-trabalhando'); // Certifique-se que você tem a classe 'status-trabalhando' no CSS
        button.textContent = 'PAUSAR / STAND-BY'; 
        button.classList.remove('btn-toggle-repouso');
        button.classList.add('btn-toggle-trabalhando');
    } else {
        processoStatus = 'repouso';
        indicator.textContent = 'STAND-BY'; 
        indicator.classList.remove('status-trabalhando');
        indicator.classList.add('status-repouso');
        button.textContent = 'INICIAR OPERAÇÃO'; 
        button.classList.remove('btn-toggle-trabalhando');
        button.classList.add('btn-toggle-repouso');
    }
} 

// 4. Lógica de Movimentação de Estoque (Entrada/Saída de 1 unidade)
function handleMovimentacao(acao) {
    const tipoJanela = document.getElementById('tipo-janela').value;
    const janelas = Array.from(document.querySelectorAll('.janela-item'));
    
    if (acao === 'entrada') {
        const posicaoVazia = janelas.find(j => j.getAttribute('data-tipo') === 'vazia');
        if (posicaoVazia) {
            posicaoVazia.classList.remove('vazia');
            posicaoVazia.classList.add(tipoJanela);
            posicaoVazia.setAttribute('data-tipo', tipoJanela);
            // Atualizado para SKU conforme aprimoramentos anteriores
            posicaoVazia.textContent = `SKU #${posicaoVazia.id.split('-')[1]}`; 
            alert(`✅ Entrada: SKU ${tipoJanela.toUpperCase()} produzido no Estoque.`);
        } else {
            alert('🛑 ERRO: O estoque está completamente cheio!');
        }
    } else if (acao === 'saida') {
        const janelaParaRemover = janelas.find(j => j.getAttribute('data-tipo') === tipoJanela);
        if (janelaParaRemover) {
            janelaParaRemover.classList.remove(tipoJanela);
            janelaParaRemover.classList.add('vazia');
            janelaParaRemover.setAttribute('data-tipo', 'vazia');
            janelaParaRemover.textContent = 'VAZIA';
            alert(`📦 Saída: SKU ${tipoJanela.toUpperCase()} consumido do Estoque.`);
        } else {
            alert(`🛑 ERRO: Não há SKUs do tipo ${tipoJanela.toUpperCase()} em estoque!`);
        }
    }
    atualizarContagem(); 
}


// ==========================================================
// FUNÇÕES DE EXPEDIÇÃO (LOTE / RÁPIDA)
// ==========================================================

// 5. LOAD RÁPIDO: Transfere do Estoque (SKUs) para a Expedição (Lotes)
function transferirParaExpedicao() {
    const tipoJanela = document.getElementById('tipo-janela').value; // Tipo a ser transferido
    const janelas = Array.from(document.querySelectorAll('.janela-item'));
    const posicaoExpedicao = parseInt(document.getElementById('expedicao-posicao-rapida').value);
    const quantidade = parseInt(document.getElementById('expedicao-quantidade').value);
    const posicaoExpedicaoIndex = posicaoExpedicao - 1; // 0 a 11

    if (posicaoExpedicaoIndex < 0 || posicaoExpedicaoIndex >= TOTAL_EXPEDICAO || quantidade <= 0 || isNaN(quantidade)) {
        alert('Entrada inválida. Verifique a Posição (1-12) e a Quantidade (> 0).');
        return;
    }
    
    // A) Checagem de Lote (Regra de Cor)
    const corBaseLote = getLoteBaseColor(posicaoExpedicaoIndex);
    if (corBaseLote !== 'vazio' && corBaseLote !== tipoJanela) {
        alert(`🛑 ERRO DE LOTE: A Posição ${posicaoExpedicao} faz parte do Lote reservado para janelas ${corBaseLote.toUpperCase()}.`);
        return;
    }

    // B) Checagem de Estoque para a Transferência
    let unidadesDisponiveis = janelas.filter(j => j.getAttribute('data-tipo') === tipoJanela).length;
    if (unidadesDisponiveis < quantidade) {
        alert(`🛑 ERRO DE ESTOQUE: Não há ${quantidade} SKUs ${tipoJanela.toUpperCase()} disponíveis no Estoque. Apenas ${unidadesDisponiveis} un.`);
        return;
    }

    // C) Execução da Transferência
    let itemExpedicao = expedicao[posicaoExpedicaoIndex];
    
    // C.1) Remove do Estoque (unidade por unidade)
    for (let i = 0; i < quantidade; i++) {
        const janelaParaRemover = janelas.find(j => j.getAttribute('data-tipo') === tipoJanela);
        if (janelaParaRemover) {
            janelaParaRemover.classList.remove(tipoJanela);
            janelaParaRemover.classList.add('vazia');
            janelaParaRemover.setAttribute('data-tipo', 'vazia');
            janelaParaRemover.textContent = 'VAZIA';
        }
    }
    
    // C.2) Adiciona à Expedição (em lote)
    itemExpedicao.quantidade += quantidade;
    itemExpedicao.tipo = tipoJanela;
    
    // D) Atualiza o DOM da Expedição
    const divExpedicao = document.getElementById(`expedicao-posicao-${posicaoExpedicao}`);
    divExpedicao.classList.remove('vazio', 'vermelha', 'azul', 'preta');
    divExpedicao.classList.add(itemExpedicao.tipo);
    divExpedicao.innerHTML = `Posição ${posicaoExpedicao}: ${itemExpedicao.tipo.toUpperCase()}<br><span class="expedicao-quantidade">${itemExpedicao.quantidade} un.</span>`;
    divExpedicao.setAttribute('data-tipo', itemExpedicao.tipo);

    alert(`✅ LOAD RÁPIDO: ${quantidade} SKUs ${tipoJanela.toUpperCase()} transferidos do Estoque para a Expedição (Posição ${posicaoExpedicao}). Total: ${itemExpedicao.quantidade} un.`);

    atualizarContagem(); // Atualiza a contagem de estoque
}


// 6. UNLOAD RÁPIDO: Expedir (Remover do Lote) com Quantidade
function expedirJanelaRapida() {
    const posicao = parseInt(document.getElementById('expedicao-posicao-rapida').value);
    const posicaoIndex = posicao - 1;
    const quantidadeRemover = parseInt(document.getElementById('expedicao-quantidade').value);
    
    if (posicaoIndex < 0 || posicaoIndex >= TOTAL_EXPEDICAO || quantidadeRemover <= 0 || isNaN(quantidadeRemover)) {
        alert('Entrada inválida. Verifique a Posição (1-12) e a Quantidade (> 0).');
        return;
    }

    let item = expedicao[posicaoIndex];
    
    if (item.quantidade === 0) {
        alert('⚠️ Atenção: A posição de Expedição selecionada já está VAZIA.');
        return;
    }
    
    if (quantidadeRemover > item.quantidade) {
        alert(`🛑 ERRO: Tentativa de remover ${quantidadeRemover} un. A Posição ${posicao} só contém ${item.quantidade} un.`);
        return;
    }

    // Lógica de Remoção
    item.quantidade -= quantidadeRemover;
    
    // Atualiza o DOM
    const div = document.getElementById(`expedicao-posicao-${posicao}`);

    if (item.quantidade === 0) {
        // Se a quantidade chegar a zero, a posição fica VAZIA
        item.tipo = 'vazio';
        div.classList.remove('vermelha', 'azul', 'preta');
        div.classList.add('vazio');
        div.innerHTML = `Posição ${posicao}<br>VAZIO`;
        div.setAttribute('data-tipo', 'vazio');
    } else {
        // Apenas atualiza a quantidade
        div.innerHTML = `Posição ${posicao}: ${item.tipo.toUpperCase()}<br><span class="expedicao-quantidade">${item.quantidade} un.</span>`;
    }

    alert(`🚚 UNLOAD RÁPIDO: ${quantidadeRemover} SKUs ${item.tipo.toUpperCase()} removidos da Posição ${posicao}. Restam: ${item.quantidade} un.`);
}


// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

// Chama a função inicial ao carregar a página
window.onload = inicializarGrids;

// REMOVEMOS AS FUNÇÕES OBSOLETAS:
// - adicionarProducaoExpedicao()
// - expedirJanela()
// - adicionarProducaoExpedicaoRapida()