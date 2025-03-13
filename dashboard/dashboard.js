document.addEventListener('DOMContentLoaded', function() {
    // Tjek om brugeren er logget ind
    const sessionData = localStorage.getItem('discord_session');
    if (!sessionData) {
        window.location.href = 'index.html';
        return;
    }
    
    const session = JSON.parse(sessionData);
    if (!session.user || !session.expiresAt || session.expiresAt < Date.now()) {
        localStorage.removeItem('discord_session');
        window.location.href = 'index.html';
        return;
    }
    
    // Vis brugerdetaljer
    const userAvatar = document.getElementById('user-avatar');
    const username = document.getElementById('username');
    
    if (session.user.avatar) {
        userAvatar.src = `https://cdn.discordapp.com/avatars/${session.user.id}/${session.user.avatar}.png`;
    }
    username.textContent = session.user.username;
    
    // Log ud funktion
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('discord_session');
        window.location.href = 'index.html';
    });
    
    // Tema skifter
    const themeButtons = document.querySelectorAll('.theme-btn');
    const root = document.documentElement;
    
    // Indlæs gemt tema
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    
    // Markér den aktive tema-knap
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Tilføj klik-hændelser til tema-knapperne
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            
            // Opdater active klasse
            themeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Anvend tema
            applyTheme(theme);
            
            // Gem i localStorage
            localStorage.setItem('theme', theme);
        });
    });
    
    // Indlæs gemte indstillinger
    const savedSettings = localStorage.getItem('portfolio_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        if (settings.language) {
            document.getElementById('language-select').value = settings.language;
        }
        
        if (settings.displayName) {
            document.getElementById('display-name').value = settings.displayName;
        }
        
        if (settings.bio) {
            document.getElementById('bio').value = settings.bio;
        }
    }
    
    // Gem indstillinger
    document.getElementById('save-settings').addEventListener('click', function() {
        const language = document.getElementById('language-select').value;
        const displayName = document.getElementById('display-name').value;
        const bio = document.getElementById('bio').value;
        
        const settings = {
            language,
            displayName,
            bio
        };
        
        localStorage.setItem('portfolio_settings', JSON.stringify(settings));
        
        // Vis bekræftelse
        showToast('Indstillinger gemt!');
    });
    
    // Hjælpefunktioner
    function applyTheme(theme) {
        switch(theme) {
            case 'dark':
                root.style.setProperty('--primary-color', '#3498db');
                root.style.setProperty('--bg-color', '#121212');
                root.style.setProperty('--bg-light', '#1e1e1e');
                root.style.setProperty('--text-color', '#ffffff');
                break;
            case 'light':
                root.style.setProperty('--primary-color', '#2980b9');
                root.style.setProperty('--bg-color', '#f5f5f5');
                root.style.setProperty('--bg-light', '#e9e9e9');
                root.style.setProperty('--text-color', '#333333');
                break;
            case 'blue':
                root.style.setProperty('--primary-color', '#3498db');
                root.style.setProperty('--bg-color', '#0a3d62');
                root.style.setProperty('--bg-light', '#0c4b78');
                root.style.setProperty('--text-color', '#ffffff');
                break;
        }
    }
    
    function showToast(message) {
        let toast = document.querySelector('.toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.visibility = 'visible';
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.visibility = 'hidden';
            }, 300);
        }, 3000);
    }
});
