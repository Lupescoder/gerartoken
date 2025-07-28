// --- INICIALIZAÇÃO E EVENTOS ---
document.addEventListener('DOMContentLoaded', function() {
    // Lógica do Carrossel
    const images = document.querySelectorAll('.carousel-image');
    if (images.length > 0) {
        let currentImageIndex = 0;
        images[currentImageIndex].classList.replace('opacity-0', 'opacity-100');
        setInterval(() => {
            images[currentImageIndex].classList.replace('opacity-100', 'opacity-0');
            currentImageIndex = (currentImageIndex + 1) % images.length;
            images[currentImageIndex].classList.replace('opacity-0', 'opacity-100');
        }, 5000);
    }

    // Lógica do Formulário
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        enviarDados();
    });

    // Lógica para Fechar o Modal
    const modal = document.getElementById('tokenModal');
    const closeModalButton = document.getElementById('closeModalButton');
    closeModalButton.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
});
// Lógica para Copiar o Token
document.getElementById('copyTokenButton').addEventListener('click', () => {
    const token = document.getElementById('tokenDisplay').textContent;
    navigator.clipboard.writeText(token).then(() => {
        const copyIcon = document.getElementById('copyIcon');
        const checkIcon = document.getElementById('checkIcon');
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        setTimeout(() => {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error('Falha ao copiar: ', err);
    });
});
// --- LÓGICA DE ENVIO DO FORMULÁRIO ---
async function enviarDados() {
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonSpinner = submitButton.querySelector('.button-spinner');

    // 1. Coletar dados e validar
    const sistema = document.getElementById('sistema').value;
    const clinica = document.getElementById('nomeClinica').value.trim();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (sistema === 'selecione' || !clinica || !username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Ativar estado de carregamento do botão
    submitButton.disabled = true;
    buttonText.classList.add('hidden');
    buttonSpinner.classList.remove('hidden');

    // 2. Preparar dados para a API
    const clientToken = btoa(clinica);
    const apiUrl = sistema === 'igut' ? 'https://api.igut.med.br/v2/usuarios/login' : 'https://api.eba.med.br/v3/usuarios/login';

    // 3. Enviar requisição com Fetch
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client_token': clientToken,
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            const token = data.data.token;
            showTokenModal(token);
        } else {
            const errorMessage = data.message || `Erro ${response.status}`;
            alert('Erro ao fazer login: ' + errorMessage);
        }
    } catch (error) {
        alert('Não foi possível comunicar com o servidor. Verifique sua conexão.');
        console.error('Erro de rede ou de script:', error);
    } finally {
        // Desativar estado de carregamento do botão
        submitButton.disabled = false;
        buttonText.classList.remove('hidden');
        buttonSpinner.classList.add('hidden');
    }
}

// --- FUNÇÃO PARA MOSTRAR O MODAL ---
function showTokenModal(token) {
    const modal = document.getElementById('tokenModal');
    const tokenDisplay = document.getElementById('tokenDisplay');
    if (token) {
        tokenDisplay.textContent = token;
        modal.classList.remove('hidden');
    } else {
        alert('Erro: Token não encontrado na resposta do servidor.');
    }
}