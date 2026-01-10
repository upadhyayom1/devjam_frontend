// data.js
const ISSUES_KEY = 'mnnit_issues_v2';
const USERS_KEY = 'mnnit_users_v1';
const CURRENT_USER_KEY = 'mnnit_current_user';

// === HELPER: FAKE DELAY ===
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ===========================
// 1. AUTHENTICATION LOGIC
// ===========================

async function registerUser(email, password, role) {
    await wait(800);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
        return { success: false, message: "User already exists!" };
    }

    // Create new user
    const newUser = { email, password, role };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return { success: true };
}

async function loginUser(email, password, role) {
    await wait(800);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Find matching user
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
        // Save "Session" so we know who is logged in
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return { success: true };
    } else {
        return { success: false, message: "Invalid credentials!" };
    }
}

function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'index.html';
}

function checkAuth(requiredRole) {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!user || user.role !== requiredRole) {
        alert("Access Denied! Please Login.");
        window.location.href = 'login.html'; // Redirect to login
    }
    return user;
}

// ===========================
// 2. ISSUES LOGIC (Unchanged)
// ===========================

async function getIssues() {
    await wait(400); 
    const data = localStorage.getItem(ISSUES_KEY);
    return data ? JSON.parse(data) : [];
}

async function createIssue(issueData) {
    await wait(600); 
    const issues = await getIssues();
    issues.unshift(issueData); 
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
    return { success: true };
}

async function resolveIssueInDB(id, adminImage) {
    await wait(600);
    const issues = await getIssues();
    const index = issues.findIndex(i => i.id === id);

    if (index > -1) {
        issues[index].status = 'Resolved';
        issues[index].admin_image = adminImage;
        localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
        return { success: true };
    }
    return { success: false };
}