// --- Seletores do DOM ---
const setupSection = document.getElementById('setup-section');
const gameSection = document.getElementById('game-section');

const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const startGameBtn = document.getElementById('start-game-btn');

const p1DisplayName = document.getElementById('p1-display-name');
const p2DisplayName = document.getElementById('p2-display-name');
const resultadoEl = document.getElementById('resultado');
const dado1El = document.getElementById('dado1');
const dado2El = document.getElementById('dado2');
const rolarBtn = document.getElementById('rolar-btn');

// Seletor para o botão de alterar nomes
const alterarNomesBtn = document.getElementById('alterar-nomes-btn');

const rankingListEl = document.getElementById('ranking-list');
const limparRankingBtn = document.getElementById('limpar-ranking-btn');

// --- Chaves do local storage ---
const RANKING_KEY = 'jogoDeDadosRanking';
const PLAYER_NAMES_KEY = 'jogoDeDadosPlayerNames';

// --- Estado (status) do jogo ---
let playerNames = { p1: 'Jogador 1', p2: 'Jogador 2' };

// --- Funções de persistência e configuração ---
function salvarNomes()
{
    localStorage.setItem(PLAYER_NAMES_KEY, JSON.stringify(playerNames));
}

function carregarNomes()
{
    const nomesJSON = localStorage.getItem(PLAYER_NAMES_KEY);
    if (nomesJSON)
    {
        playerNames = JSON.parse(nomesJSON);
        player1NameInput.value = playerNames.p1;
        player2NameInput.value = playerNames.p2;
    }
}

function iniciarJogo()
{
    const p1 = player1NameInput.value.trim() || "Jogador 1";
    const p2 = player2NameInput.value.trim() || "Jogador 2";

    if (!p1 || !p2) {
        alert("Por favor, digite o nome dos dois jogadores.");
        return;
    }

    playerNames.p1 = p1;
    playerNames.p2 = p2;
    
    salvarNomes();

    p1DisplayName.textContent = playerNames.p1;
    p2DisplayName.textContent = playerNames.p2;

    setupSection.classList.add('hidden');
    gameSection.classList.remove('hidden');

    exibirRanking();
}

// --- Funções de ranking ---
function carregarRanking()
{
    const rankingJSON = localStorage.getItem(RANKING_KEY);
    return rankingJSON ? JSON.parse(rankingJSON) : [];
}

function salvarRanking(ranking)
{
    localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
}

function atualizarRanking(vencedor)
{
    let ranking = carregarRanking();
    const jogadorIndex = ranking.findIndex(jogador => jogador.nome === vencedor);

    if (jogadorIndex > -1) {
        ranking[jogadorIndex].vitorias++;
    } else {
        ranking.push({ nome: vencedor, vitorias: 1 });
    }

    ranking.sort((a, b) => b.vitorias - a.vitorias);
    
    salvarRanking(ranking);
    exibirRanking();
}

function exibirRanking()
{
    const ranking = carregarRanking();
    rankingListEl.innerHTML = ''; 

    if (ranking.length === 0) {
        rankingListEl.innerHTML = '<li>Nenhuma partida registrada ainda.</li>';
        return;
    }

    ranking.forEach((jogador, index) => {
        const li = document.createElement('li');
        let destaque = '';
        if (jogador.nome === playerNames.p1 || jogador.nome === playerNames.p2) {
            destaque = '⭐ ';
        }
        li.textContent = `${destaque}${index + 1}º - ${jogador.nome}: ${jogador.vitorias} vitórias`;
        rankingListEl.appendChild(li);
    });
}

// --- Lógica principal do jogo ---
function rolarDados()
{
    const valorDado1 = Math.floor(Math.random() * 6) + 1;
    const valorDado2 = Math.floor(Math.random() * 6) + 1;

    dado1El.src = `./assets/imagens/dado-girando1.gif`;
    dado2El.src = `./assets/imagens/dado-girando1.gif`;

    rolarBtn.disabled = true;
    alterarNomesBtn.disabled = true; // Desabilita também o botão de alterar nome

    setTimeout(() =>
    {
        dado1El.src = `./assets/imagens/dado-${valorDado1}.png`;
        dado2El.src = `./assets/imagens/dado-${valorDado2}.png`;

        if (valorDado1 > valorDado2)
        {
            resultadoEl.textContent = `🚩 ${playerNames.p1} Venceu!`;
            atualizarRanking(playerNames.p1);
        } else if (valorDado2 > valorDado1)
            {
                resultadoEl.textContent = `${playerNames.p2} Venceu! 🚩`;
                atualizarRanking(playerNames.p2);
            } else
            {
                resultadoEl.textContent = "🎌 Empate! 🎌";
            }
        rolarBtn.disabled = false;
        alterarNomesBtn.disabled = false; // Habilita o botão de volta
    }, 2000);
}

// --- Eventos de escuta (eventListener) ---
startGameBtn.addEventListener('click', iniciarJogo);
rolarBtn.addEventListener('click', rolarDados);

alterarNomesBtn.addEventListener('click', () =>
{
    // Esconde a tela do jogo e mostra a tela de configuração
    gameSection.classList.add('hidden');
    setupSection.classList.remove('hidden');
    player1NameInput.value = "";
    player2NameInput.value = "";
    player1NameInput.focus();
});

limparRankingBtn.addEventListener('click', () =>
{
    if (confirm('Tem certeza que deseja limpar todo o ranking?')) {
        localStorage.removeItem(RANKING_KEY);
        localStorage.removeItem(PLAYER_NAMES_KEY);
        exibirRanking();
    }
});

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () =>
{
    carregarNomes();
});

//
// Procedimento para ouvir a tecla "Enter" em cada input e prosseguir para o input seguinte
//    mas se for o último input executa o botão designado para processar os dados.
// 
document.addEventListener("keydown", function (event)
{
    if (event.key === "Enter")
    {
        event.preventDefault(); // impede envio do formulário

        // Pegamos SOMENTE os campos que você quer navegar
        const campos =
        [
            document.getElementById("player1-name"),
            document.getElementById("player2-name"),
            document.getElementById("start-game-btn")
        ];

        const index = campos.indexOf(document.activeElement);

        // Se estiver em um campo válido
        if (index !== -1)
        {
            // Se NÃO for o último → vai para o próximo
            if (index < campos.length - 1)
            {
                campos[index + 1].focus();
            } 
            // Se for o último → executa o botão
            else
            {
                campos[index].click();
            }
        }
    }
});
