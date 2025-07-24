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