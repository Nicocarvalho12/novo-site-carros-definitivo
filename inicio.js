document.addEventListener('DOMContentLoaded', function() {
    // PARTE DO CONTROLE DE TEMA
    const botaoTema = document.getElementById("tema");
    const body = document.body;
    
    // ESTA VERIFICANDO O ESTADO DO MODO ESCURO
    let escuro = localStorage.getItem('modoEscuro') === 'true';
    
    // APLICA O MODO ESCURO SE ESTIVER ATIVO
    if (escuro) {
        body.classList.add("escuro");
        botaoTema.textContent = "Modo claro";
    }
    
    // ADICIONA O EVENTO DE CLIQUE PARA ALTERAR O TEMA
    botaoTema.addEventListener("click", function() {
        escuro = !escuro;
        body.classList.toggle("escuro", escuro);
        botaoTema.textContent = escuro ? "Modo claro" : "Modo escuro";
        localStorage.setItem('modoEscuro', escuro);
    });






    // PARTE DO CONTROLE DE MENU para dispositivos móveis
    // Seleciona os elementos do menu
    const menuToggle = document.getElementById("menuToggle"); 
    const menuClose = document.getElementById("menuClose"); 
    const listaMenu = document.querySelector(".listaMenu");
    
    // Verifica se os elementos existem antes de adicionar eventos
    if (menuToggle && menuClose && listaMenu) { 
        menuToggle.addEventListener("click", function() {
            listaMenu.classList.add("active");
            document.body.style.overflow = "hidden";
        });
        // Fechar menu ao clicar no botão de fechar
        menuClose.addEventListener("click", function() {
            listaMenu.classList.remove("active");
            document.body.style.overflow = "";
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll(".listaMenu a").forEach(link => {
            link.addEventListener("click", function() {
                listaMenu.classList.remove("active");
                document.body.style.overflow = "";
            });
        });
    }
    
    // Destacar o link ativo no menu 
    // Obtém a página atual
    // e adiciona a classe 'active' ao link correspondente
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".listaMenu a").forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
    
    //ESTA FUNÇÃO AJUSTA O MENU PARA DISPOSITIVOS MÓVEIS OU DESKTOP
    function ajustarMenu() {
        if (window.innerWidth < 768) {
            // Menu mobile
            if (listaMenu) listaMenu.classList.add('mobile');
        } else {
            // Menu desktop
            if (listaMenu) {
                listaMenu.classList.remove('mobile', 'active');
                document.body.style.overflow = "";
            }
        }
    }
    
    // Adiciona o evento de resize para ajustar o menu
    ajustarMenu();
    window.addEventListener('resize', ajustarMenu);
    
    // Suavizar rolagem para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // EFEITO DE HOVER NOS CARDS
    document.querySelectorAll('.carro').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 24px rgba(0, 70, 136, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
    });
});
// CÓDIGO DO MINI CRUD: LISTA DE AGENDAMENTOS/TEST DRIVE
let agendamentos = []; // Renomeando para 'agendamentos' para maior clareza
let itemSendoEditadoIndex = -1; 

// Elementos do DOM (Atualizados)
const inputCarro = document.getElementById('input-carro');
const inputData = document.getElementById('input-data');
const inputHora = document.getElementById('input-hora');
const listaDeItens = document.getElementById('lista-de-itens');
const formAdicionar = document.getElementById('form-adicionar-item');
const btnAdicionar = document.getElementById('btn-adicionar');
const feedbackMensagem = document.getElementById('feedback-mensagem');

// Verifica se os elementos do CRUD estão presentes
if (inputCarro && listaDeItens && formAdicionar) {

    // 1. Persistência de Dados (LocalStorage)
    function carregarAgendamentos() {
        const agendamentosSalvos = localStorage.getItem('listaAgendamentos');
        // JSON.parse() converte a string JSON de volta para o array de objetos
        agendamentos = agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];
        listarAgendamentos();
    }

    function salvarAgendamentos() {
        // JSON.stringify() converte o array de objetos em uma string JSON antes de salvar
        localStorage.setItem('listaAgendamentos', JSON.stringify(agendamentos));
    }

    // 2. Feedback Visual (Mantido)
    function exibirFeedback(mensagem, tipo = 'sucesso') {
        feedbackMensagem.textContent = mensagem;
        feedbackMensagem.classList.remove('mensagem-sucesso', 'mensagem-erro', 'mensagem-oculta');
        feedbackMensagem.classList.add(`mensagem-${tipo}`);
        feedbackMensagem.style.display = 'block';

        setTimeout(() => {
            feedbackMensagem.classList.add('mensagem-oculta');
            feedbackMensagem.style.display = 'none';
        }, 3000);
    }

    // 3. Formatação de Data
    function formatarData(dataISO) {
        // dataISO está no formato YYYY-MM-DD
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // 4. Listar Itens (READ)
    function listarAgendamentos() {
        listaDeItens.innerHTML = ''; 

        if (agendamentos.length === 0) {
            listaDeItens.innerHTML = '<li style="text-align: center; color: #666; font-style: italic;">Nenhum agendamento ativo.</li>';
            return;
        }

        agendamentos.forEach((item, index) => {
            const li = document.createElement('li');

            // Container de informações
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('item-agendamento-info');

            // Linha do Carro
            const carroSpan = document.createElement('span');
            carroSpan.classList.add('item-agendamento-carro');
            carroSpan.textContent = item.carro;

            // Linha de Data e Hora
            const dataHoraSpan = document.createElement('span');
            dataHoraSpan.classList.add('item-agendamento-data-hora');
            
            const dataFormatada = formatarData(item.data);
            dataHoraSpan.innerHTML = `<i class="fas fa-calendar-alt"></i> ${dataFormatada} &nbsp;|&nbsp; <i class="fas fa-clock"></i> ${item.hora}`;


            // Container para os botões (Mantido)
            const botoesDiv = document.createElement('div');
            botoesDiv.classList.add('item-botoes');

            // Botão EDITAR
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn-acao', 'btn-editar');
            btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
            btnEditar.addEventListener('click', () => editarAgendamento(index));

            // Botão EXCLUIR
            const btnExcluir = document.createElement('button');
            btnExcluir.classList.add('btn-acao', 'btn-excluir');
            btnExcluir.innerHTML = '<i class="fas fa-trash-alt"></i> Excluir';
            btnExcluir.addEventListener('click', () => removerAgendamento(index));

            // Monta a estrutura
            infoDiv.appendChild(carroSpan);
            infoDiv.appendChild(dataHoraSpan);
            botoesDiv.appendChild(btnEditar);
            botoesDiv.appendChild(btnExcluir);
            
            li.appendChild(infoDiv);
            li.appendChild(botoesDiv);

            listaDeItens.appendChild(li);
        });
    }

    // 5. Adicionar/Atualizar Agendamento (CREATE/UPDATE)
    formAdicionar.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const novoCarro = inputCarro.value.trim();
        const novaData = inputData.value;
        const novaHora = inputHora.value;

        // **Validação: Impedir campos vazios**
        if (novoCarro === "" || novaData === "" || novaHora === "") {
            exibirFeedback("Todos os campos devem ser preenchidos!", "erro");
            return;
        }
        
        // Objeto do novo agendamento
        const novoAgendamento = {
            carro: novoCarro,
            data: novaData,
            hora: novaHora
        };

        if (itemSendoEditadoIndex !== -1) {
            // Lógica de EDIÇÃO (UPDATE)
            
            // Não faremos validação de duplicidade complexa (data/hora), apenas a de carro.
            // Para editar, apenas substituímos.
            agendamentos[itemSendoEditadoIndex] = novoAgendamento;
            itemSendoEditadoIndex = -1; 
            
            btnAdicionar.innerHTML = '<i class="fas fa-calendar-alt"></i> Agendar'; // Volta o botão
            btnAdicionar.style.backgroundColor = 'var(--cor-primaria)';
            exibirFeedback("Agendamento editado com sucesso ✅", "sucesso");

        } else {
            // Lógica de ADIÇÃO (CREATE)

            // Validação de Duplicidade (checa se o mesmo carro, na mesma data e hora já existe)
            const duplicado = agendamentos.some(item => 
                item.carro.toLowerCase() === novoCarro.toLowerCase() &&
                item.data === novaData &&
                item.hora === novaHora
            );

            if (duplicado) {
                exibirFeedback("Você já tem uma consulta agendada para este carro, data e hora!", "erro");
                return;
            }

            agendamentos.push(novoAgendamento);
            exibirFeedback("Agendamento criado com sucesso ✅", "sucesso");
        }
        
        // Ações finais
        inputCarro.value = ''; // Limpa o campo do carro
        inputData.value = ''; // Limpa o campo da data
        inputHora.value = ''; // Limpa o campo da hora
        
        salvarAgendamentos(); 
        listarAgendamentos();
    });

    // 6. Excluir Agendamento (DELETE)
    function removerAgendamento(index) {
        if (confirm(`Tem certeza que deseja remover o agendamento do carro "${agendamentos[index].carro}"?`)) {
            agendamentos.splice(index, 1); 
            salvarAgendamentos();
            listarAgendamentos();
            exibirFeedback("Agendamento removido com sucesso 🗑️", "sucesso");
            
            // Reseta o estado de edição se o item excluído era o que estava sendo editado
            if (itemSendoEditadoIndex === index) {
                itemSendoEditadoIndex = -1;
                btnAdicionar.innerHTML = '<i class="fas fa-calendar-alt"></i> Agendar';
                btnAdicionar.style.backgroundColor = 'var(--cor-primaria)';
                inputCarro.value = '';
                inputData.value = '';
                inputHora.value = '';
            }
        }
    }

    // 7. Editar Agendamento (UPDATE - preparação)
    function editarAgendamento(index) {
        const item = agendamentos[index];
        
        // Preenche os campos do formulário com os dados do agendamento
        inputCarro.value = item.carro;
        inputData.value = item.data;
        inputHora.value = item.hora;
        
        itemSendoEditadoIndex = index; // Define o índice do item sendo editado

        // Atualiza o botão para indicar o modo de edição/salvar
        btnAdicionar.innerHTML = '<i class="fas fa-save"></i> Salvar Edição';
        btnAdicionar.style.backgroundColor = '#f39c12'; // Cor de destaque para edição
        
        inputCarro.focus();
    }

    // Inicializa a aplicação ao carregar a página
    window.addEventListener('load', carregarAgendamentos);
}
