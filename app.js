// Classe Contato (sem alterações, já estava boa)
class Contato {
    constructor(nome, email, telefone) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }
    // Getters e Setters com validação
    get nome() { return this._nome; }
    set nome(valor) {
        if (!valor || !valor.trim()) throw new Error("O nome é obrigatório.");
        this._nome = valor;
    }
    get email() { return this._email; }
    set email(valor) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) throw new Error("Formato de e-mail inválido.");
        this._email = valor;
    }
    get telefone() { return this._telefone; }
    set telefone(valor) {
        if (!valor || !valor.trim()) throw new Error("O telefone é obrigatório.");
        this._telefone = valor;
    }
}

// --- Seletores do DOM ---
const form = document.getElementById("form-contato");
const listaContatosUI = document.getElementById("lista-contatos");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const telefoneInput = document.getElementById("telefone");

// --- Estado da Aplicação ---
let contatos = [];

// --- Funções de Lógica ---

/**
 * Carrega contatos do localStorage ao iniciar.
 */
function carregarContatos() {
    const dados = localStorage.getItem("contatos");
    if (dados) {
        contatos = JSON.parse(dados).map(c => new Contato(c._nome, c._email, c._telefone));
    }
    renderizarContatos();
}

/**
 * Salva a lista de contatos no localStorage.
 */
function salvarContatos() {
    localStorage.setItem("contatos", JSON.stringify(contatos));
}

/**
 * Adiciona um novo contato à lista.
 */
function adicionarContato(event) {
    event.preventDefault();
    try {
        const novoContato = new Contato(nomeInput.value, emailInput.value, telefoneInput.value);
        contatos.push(novoContato);
        
        salvarContatos();
        renderizarContatos();
        
        form.reset();
        nomeInput.focus();
    } catch (erro) {
        alert(erro.message); // Simples, mas funcional. Poderia ser um modal/toast.
    }
}

/**
 * Remove um contato da lista com base no seu índice.
 */
function removerContato(index) {
    // Adiciona confirmação para evitar exclusão acidental
    const confirmacao = confirm(`Tem certeza que deseja remover ${contatos[index].nome}?`);
    if (confirmacao) {
        contatos.splice(index, 1);
        salvarContatos();
        renderizarContatos();
    }
}

// --- Funções de Renderização ---

/**
 * Cria o elemento HTML (<li>) para um único contato.
 * @param {Contato} contato - O objeto do contato.
 * @param {number} index - O índice do contato na lista.
 * @returns {HTMLLIElement} O elemento <li> construído.
 */
function criarElementoContato(contato, index) {
    const li = document.createElement("li");
    
    // Informações do Contato
    const contactInfo = document.createElement("div");
    contactInfo.className = "contact-info";
    
    const nomeStrong = document.createElement("strong");
    nomeStrong.textContent = contato.nome;
    
    const emailSpan = document.createElement("span");
    emailSpan.className = "detail";
    emailSpan.innerHTML = `<i class="fa-solid fa-envelope"></i> ${contato.email}`;
    
    const telefoneSpan = document.createElement("span");
    telefoneSpan.className = "detail";
    telefoneSpan.innerHTML = `<i class="fa-solid fa-phone"></i> ${contato.telefone}`;
    
    contactInfo.append(nomeStrong, emailSpan, telefoneSpan);

    // Botão de Ações
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";
    
    const removerButton = document.createElement("button");
    removerButton.className = "remover";
    removerButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    removerButton.dataset.index = index; // Armazena o índice no botão
    
    actionsDiv.appendChild(removerButton);
    
    li.append(contactInfo, actionsDiv);
    return li;
}

/**
 * Renderiza a lista completa de contatos na tela.
 */
function renderizarContatos() {
    listaContatosUI.innerHTML = ""; // Limpa a lista atual

    if (contatos.length === 0) {
        // Mostra a mensagem de "estado vazio"
        const emptyState = `
            <div class="empty-state">
                <i class="fa-solid fa-ghost"></i>
                <p>Sua agenda está vazia.<br>Adicione seu primeiro contato!</p>
            </div>
        `;
        listaContatosUI.innerHTML = emptyState;
    } else {
        contatos.forEach((contato, index) => {
            const elementoContato = criarElementoContato(contato, index);
            listaContatosUI.appendChild(elementoContato);
        });
    }
}

// --- Inicialização e Event Listeners ---

// Listener para o formulário de adição
form.addEventListener("submit", adicionarContato);

// Delegação de Eventos para remoção
listaContatosUI.addEventListener("click", (event) => {
    const removeButton = event.target.closest("button.remover");
    if (removeButton) {
        const index = parseInt(removeButton.dataset.index, 10);
        removerContato(index);
    }
});

// Carrega os dados iniciais quando a página é carregada
document.addEventListener("DOMContentLoaded", carregarContatos);