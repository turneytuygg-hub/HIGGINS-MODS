// Initial admin credentials
let adminCredentials = {
    username: "admin 254",
    password: "admin 254",
    email: "nicekingkeng@gmail.com"
};

// Check if user is already logged in
let isAdminLoggedIn = localStorage.getItem('higginsModsAdmin') === 'true';

// Sample APK data
let apkData = [
    {
        id: 1,
        name: "Game Guardian",
        version: "101.0",
        description: "Advanced game hacker/cracker for Android games. Requires root access for full functionality.",
        size: "15.2",
        file: "game_guardian_mod.apk"
    },
    {
        id: 2,
        name: "Lucky Patcher",
        version: "10.9.3",
        description: "Modify apps, remove ads, bypass premium features, and backup apps. No root required for basic functions.",
        size: "22.5",
        file: "lucky_patcher_mod.apk"
    },
    {
        id: 3,
        name: "Spotify Premium",
        version: "8.8.96.364",
        description: "Unlocked premium features: ad-free, unlimited skips, extreme quality, and download enabled.",
        size: "85.3",
        file: "spotify_premium_mod.apk"
    }
];

// DOM Elements
const loginModal = document.getElementById('loginModal');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminPanel = document.getElementById('adminPanel');
const apkList = document.getElementById('apkList');
const contactBtn = document.getElementById('contactBtn');
const contactSection = document.getElementById('contactSection');
const currentYearSpan = document.getElementById('currentYear');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();
    
    updateUIForLoginStatus();
    renderAPKList();
    
    // Event Listeners
    adminLoginBtn.addEventListener('click', function() {
        loginModal.classList.add('active');
    });
    
    adminPanelBtn.addEventListener('click', function() {
        adminPanel.classList.toggle('active');
        if (adminPanel.classList.contains('active')) {
            adminPanelBtn.innerHTML = '<i class="fas fa-times"></i> Close Panel';
            adminPanelBtn.classList.add('btn-primary');
            adminPanelBtn.classList.remove('btn-secondary');
        } else {
            adminPanelBtn.innerHTML = '<i class="fas fa-cogs"></i> Admin Panel';
            adminPanelBtn.classList.remove('btn-primary');
            adminPanelBtn.classList.add('btn-secondary');
        }
    });
    
    logoutBtn.addEventListener('click', function() {
        logoutAdmin();
    });
    
    contactBtn.addEventListener('click', function() {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close modal when clicking outside
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });
});

// Update UI based on login status
function updateUIForLoginStatus() {
    if (isAdminLoggedIn) {
        adminLoginBtn.style.display = 'none';
        adminPanelBtn.style.display = 'flex';
        logoutBtn.style.display = 'flex';
    } else {
        adminLoginBtn.style.display = 'flex';
        adminPanelBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
        adminPanel.classList.remove('active');
    }
}

// Render APK list
function renderAPKList() {
    if (apkData.length === 0) {
        apkList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No APKs Available</h3>
                <p>No modded APKs have been uploaded yet.</p>
                ${isAdminLoggedIn ? '<p>Use the Admin Panel to upload your first APK.</p>' : ''}
            </div>
        `;
        return;
    }
    
    apkList.innerHTML = apkData.map(apk => `
        <div class="apk-card" data-id="${apk.id}">
            <div class="apk-header">
                <h3 class="apk-title">${apk.name}</h3>
                <div class="apk-meta">
                    <span>Version: ${apk.version}</span>
                    <span>Modded</span>
                </div>
            </div>
            <div class="apk-body">
                <p class="apk-description">${apk.description}</p>
            </div>
            <div class="apk-footer">
                <span class="apk-size">${apk.size} MB</span>
                <button class="btn btn-primary luminous-border" onclick="downloadAPK(${apk.id})">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `).join('');
}

// Admin login function
function loginAdmin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const loginStatus = document.getElementById('loginStatus');
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        isAdminLoggedIn = true;
        localStorage.setItem('higginsModsAdmin', 'true');
        
        loginStatus.className = 'status-message status-success';
        loginStatus.innerHTML = '<i class="fas fa-check-circle"></i> Login successful!';
        
        setTimeout(() => {
            loginModal.classList.remove('active');
            updateUIForLoginStatus();
            
            // Clear login fields
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
            loginStatus.className = 'status-message';
        }, 1500);
    } else {
        loginStatus.className = 'status-message status-error';
        loginStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Invalid username or password!';
    }
}

// Logout function
function logoutAdmin() {
    isAdminLoggedIn = false;
    localStorage.removeItem('higginsModsAdmin');
    adminPanel.classList.remove('active');
    adminPanelBtn.innerHTML = '<i class="fas fa-cogs"></i> Admin Panel';
    adminPanelBtn.classList.remove('btn-primary');
    adminPanelBtn.classList.add('btn-secondary');
    updateUIForLoginStatus();
    
    // Show logout notification
    showNotification('Logged out successfully', 'success');
}

// Upload APK function
function uploadAPK() {
    if (!isAdminLoggedIn) {
        showNotification('You must be logged in as admin to upload APKs', 'error');
        return;
    }
    
    const name = document.getElementById('apkName').value.trim();
    const version = document.getElementById('apkVersion').value.trim();
    const description = document.getElementById('apkDescription').value.trim();
    const size = document.getElementById('apkSize').value.trim();
    const fileInput = document.getElementById('apkFile');
    const adminStatus = document.getElementById('adminStatus');
    
    // Validation
    if (!name || !version || !description || !size) {
        adminStatus.className = 'status-message status-error';
        adminStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all fields!';
        return;
    }
    
    if (!fileInput.files.length) {
        adminStatus.className = 'status-message status-error';
        adminStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please select an APK file!';
        return;
    }
    
    const file = fileInput.files[0];
    if (!file.name.endsWith('.apk')) {
        adminStatus.className = 'status-message status-error';
        adminStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Only .apk files are allowed!';
        return;
    }
    
    // Create new APK object
    const newAPK = {
        id: apkData.length + 1,
        name: name,
        version: version,
        description: description,
        size: size,
        file: file.name
    };
    
    // Add to APK data
    apkData.unshift(newAPK);
    
    // Update UI
    renderAPKList();
    
    // Show success message
    adminStatus.className = 'status-message status-success';
    adminStatus.innerHTML = `<i class="fas fa-check-circle"></i> APK "${name}" uploaded successfully!`;
    
    // Clear form
    document.getElementById('apkName').value = '';
    document.getElementById('apkVersion').value = '';
    document.getElementById('apkDescription').value = '';
    document.getElementById('apkSize').value = '';
    document.getElementById('apkFile').value = '';
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
        adminStatus.className = 'status-message';
    }, 5000);
}

// Change password function
function changePassword() {
    if (!isAdminLoggedIn) {
        showNotification('You must be logged in to change password', 'error');
        return;
    }
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const adminStatus = document.getElementById('adminStatus');
    
    if (!newPassword || !confirmPassword) {
        adminStatus.className = 'status-message status-error';
        adminStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in both password fields!';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        adminStatus.className = 'status-message status-error';
        adminStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Passwords do not match!';
        return;
    }
    
    if (newPassword.length < 6) {
        adminStatus.className = 'status-message status-error';
        adminStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Password must be at least 6 characters!';
        return;
    }
    
    // Update password
    adminCredentials.password = newPassword;
    
    // Show success message
    adminStatus.className = 'status-message status-success';
    adminStatus.innerHTML = '<i class="fas fa-check-circle"></i> Password changed successfully!';
    
    // Clear password fields
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
        adminStatus.className = 'status-message';
    }, 5000);
}

// Download APK function
function downloadAPK(id) {
    const apk = apkData.find(a => a.id === id);
    if (!apk) return;
    
    // Show download notification
    showNotification(`Starting download: ${apk.name}`, 'success');
    
    // In a real application, this would trigger an actual file download
    // For demo purposes, we'll simulate a download
    setTimeout(() => {
        const message = `Download would start for: ${apk.name} v${apk.version} (${apk.size} MB)\n\n`;
        message += `In a real implementation, the APK file "${apk.file}" would be downloaded.`;
        alert(message);
    }, 500);
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `status-message status-${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.maxWidth = '350px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
        loginModal.classList.remove('active');
        document.getElementById('loginStatus').className = 'status-message';
    }
});
