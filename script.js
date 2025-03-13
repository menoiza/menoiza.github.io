const DISCORD_CLIENT_ID = '1349797471240585339';
const REDIRECT_URI = window.location.origin + window.location.pathname;
const DISCORD_API_URL = 'https://discord.com/api/v10';

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const avatar = document.getElementById('avatar');
const username = document.getElementById('username');
const modal = document.getElementById('login-modal');
const closeBtn = document.querySelector('.close-btn');
const loginStatus = document.getElementById('login-status');

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    
    loginBtn.addEventListener('click', () => {
        initiateDiscordLogin();
    });
    
    logoutBtn.addEventListener('click', () => {
        logout();
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];
    
    if (accessToken) {
        window.history.replaceState({}, document.title, window.location.pathname);
        
        modal.style.display = 'block';
        loginStatus.textContent = 'Fetching your Discord profile...';
        
        fetchDiscordUser(accessToken, tokenType)
            .then(user => {
                saveSession(user, accessToken, tokenType);
                
                displayUserInfo(user);
                loginStatus.textContent = 'Login successful!';
                
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 1500);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                loginStatus.textContent = 'Login failed. Please try again.';
            });
    }
});

function initiateDiscordLogin() {
    const scope = 'identify email';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = discordAuthUrl;
}

async function fetchDiscordUser(accessToken, tokenType) {
    const response = await fetch(`${DISCORD_API_URL}/users/@me`, {
        headers: {
            Authorization: `${tokenType} ${accessToken}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    
    return await response.json();
}

function saveSession(user, accessToken, tokenType) {
    const session = {
        user,
        accessToken,
        tokenType,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24
    };
    
    localStorage.setItem('discord_session', JSON.stringify(session));
}

function checkSession() {
    const sessionData = localStorage.getItem('discord_session');
    
    if (sessionData) {
        const session = JSON.parse(sessionData);
        
        if (session.expiresAt && session.expiresAt > Date.now()) {
            displayUserInfo(session.user);
        } else {
            logout();
        }
    }
}

function displayUserInfo(user) {
    if (user) {
        const avatarUrl = user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` 
            : 'https://cdn.discordapp.com/embed/avatars/0.png';
        
        avatar.src = avatarUrl;
        username.textContent = user.username;
        
        userInfo.style.display = 'flex';
        loginBtn.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('discord_session');
    userInfo.style.display = 'none';
    loginBtn.style.display = 'block';
}
