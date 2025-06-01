// Função para mostrar notificações
function showNotification(message, icon) {
    const container = document.querySelector('.notifications-container');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    container.appendChild(notification);

    // Remover notificação após a animação
    setTimeout(() => {
        notification.remove();
    }, 4300); // 4s + 300ms da animação
}

// Get visitor's IP
async function getVisitorIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Erro ao obter IP:', error);
        return null;
    }
}

// Verificar se o usuário já enviou o Instagram
async function checkIfUserSubmitted() {
    const ip = await getVisitorIP();
    const savedData = localStorage.getItem('visitorData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.ip === ip) {
            return true; // Usuário já enviou
        }
    }
    return false; // Usuário ainda não enviou
}

// Função para mostrar/esconder o modal do Instagram
async function toggleInstagramModal(show = true) {
    const modal = document.getElementById('instagramModal');
    const overlay = document.getElementById('overlay');
    
    if (show) {
        // Verificar se o usuário já enviou
        const hasSubmitted = await checkIfUserSubmitted();
        if (hasSubmitted) {
            return; // Não mostrar o modal se já enviou
        }
        
        modal.style.display = 'block';
        overlay.style.display = 'block';
        document.getElementById('instagramInput').focus();
    } else {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

// Save visitor info
function saveVisitorInfo(ip, instagram) {
    const visitorInfo = {
        ip: ip,
        instagram: instagram,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('visitorInfo', JSON.stringify(visitorInfo));
}

// Check if visitor has already submitted info
async function checkVisitorStatus() {
    const currentIP = await getVisitorIP();
    if (!currentIP) return true; // Se não conseguir o IP, mostra o modal

    const savedInfo = localStorage.getItem('visitorInfo');
    if (!savedInfo) return true; // Se não tiver info salva, mostra o modal

    const visitorInfo = JSON.parse(savedInfo);
    return visitorInfo.ip !== currentIP; // Só mostra o modal se o IP for diferente
}

// Função para ofuscar dados sensíveis
const _0x5f4e = {
    encrypt: function(data) {
        return btoa(encodeURIComponent(data));
    },
    decrypt: function(data) {
        return decodeURIComponent(atob(data));
    }
};

// Função para gerar um ID único para cada sessão
const _0x3e2d = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Submit contact info to Discord webhook
async function submitContactInfo(event) {
    event.preventDefault();
    
    const instagram = document.getElementById('instagramInput').value.trim();
    if (!instagram) return;

    try {
        const ip = await getVisitorIP();
        if (!ip) return;

        const currentTime = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        const webhookUrl = 'https://discord.com/api/webhooks/1378849664115146753/_r-5oV8R7C0-PRPfmh-pvx6BwbexCwk6y3f3GFWPoVglkYfGByrrhca7NBp8wnkuZNhc';
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [{
                    title: '🎯 Novo Visitante',
                    color: 0x8B0000,
                    fields: [
                        { name: '📸 Instagram', value: '@' + instagram, inline: true },
                        { name: '🌐 IP', value: ip, inline: true },
                        { name: '⏰ Horário', value: currentTime, inline: true }
                    ],
                    timestamp: new Date().toISOString()
                }]
            })
        });

        if (response.ok) {
            saveVisitorInfo(ip, instagram);
            toggleInstagramModal(false);
            
            setTimeout(() => {
                showNotification('Novas atualizações feitas no site!', 'fa-bell');
                setTimeout(() => {
                    showNotification('Desenvolvido Pela Empresa RedVendas!', 'fa-code');
                }, 200);
            }, 2000);
        }
    } catch (error) {
        console.error('Erro ao enviar para o Discord:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // Check if should show Instagram modal based on IP
    const shouldShowModal = await checkVisitorStatus();
    if (shouldShowModal) {
        toggleInstagramModal(true);
    }

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
        const isOpen = navLinksContainer.classList.contains('active');
        mobileMenuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinksContainer.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinksContainer.classList.contains('active') && 
            !navLinksContainer.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navLinksContainer.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });

    const backToTopButton = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section[id], header[id]');
    
    // Show button only when user scrolls down 300px
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }

        // Update active nav link based on scroll position
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    });

    // Handle nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
