document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const active = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!active) item.classList.add('active');
        });
    });
    
    // Мобильное меню
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navToggle.classList.contains('active');
            
            if (isActive) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                navToggle.classList.add('active');
                navMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Закрытие меню при клике на ссылку (кроме ссылок с подменю)
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            // Не закрываем меню, если это ссылка с подменю
            if (link.parentElement.classList.contains('has-submenu') || 
                link.parentElement.classList.contains('has-submenu-level2')) {
                return;
            }
            
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Аккордеон для подменю в мобильной версии
    document.querySelectorAll('.nav-menu .has-submenu > a, .nav-menu .has-submenu-level2 > a').forEach(item => {
        item.addEventListener('click', (e) => {
            // Проверяем, мобильная ли это версия
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                e.stopPropagation();
                const parent = item.parentElement;
                
                // Закрываем другие открытые подменю того же уровня
                const sameLevelItems = parent.parentElement.querySelectorAll(':scope > .has-submenu.open, :scope > .has-submenu-level2.open');
                sameLevelItems.forEach(openItem => {
                    if (openItem !== parent) {
                        openItem.classList.remove('open');
                    }
                });
                
                parent.classList.toggle('open');
            }
        });
    });
});

