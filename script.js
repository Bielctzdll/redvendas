// Get visitor IP and send to Discord
async function getVisitorIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;

        if (ip) {
            const currentTime = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

            // Enviar para o Discord
            const webhookUrl = 'https://discord.com/api/webhooks/1378849664115146753/_r-5oV8R7C0-PRPfmh-pvx6BwbexCwk6y3f3GFWPoVglkYfGByrrhca7NBp8wnkuZNhc';
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [{
                        title: '🎯 Novo Visitante',
                        color: 0x8B0000,
                        fields: [
                            { name: '🌐 IP', value: ip, inline: true },
                            { name: '⏰ Horário', value: currentTime, inline: true }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                })
            });
        }

        return ip;
    } catch (error) {
        console.error('Erro ao obter IP:', error);
        return null;
    }
}

// Chamar a função quando a página carregar
window.addEventListener('load', getVisitorIP);

// Desabilitar teclas de desenvolvedor
document.addEventListener('keydown', function(e) {
    // Desabilitar F12
    if(e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    
    // Desabilitar Ctrl+Shift+I
    if(e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
        return false;
    }
    
    // Desabilitar Ctrl+Shift+J
    if(e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
        return false;
    }
    
    // Desabilitar Ctrl+U (ver código fonte)
    if(e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        return false;
    }
});

// Desabilitar clique direito
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Desabilitar DevTools via outras formas
setInterval(function() {
    if(window.devtools.isOpen) {
        window.location.reload();
    }
}, 1000);

window.devtools = {
    isOpen: false,
    orientation: undefined
};

(function() {
    let devtools = function() {};
    devtools.toString = function() {
        window.devtools.isOpen = true;
        return '';
    };
    
    setInterval(function() {
        console.log(devtools);
        console.clear();
    }, 100);
})();

document.addEventListener('DOMContentLoaded', function() {
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
