import { doctorsDB } from './doctors_data.js';

// --- Mock Data & State Management ---
const mockData = {
    user: null, // Set on login
    realm: 'personal', // 'work' or 'personal'
    cyclePhase: 'follicular', // 'menstrual', 'follicular', 'ovulation', 'luteal'
    quests: [
        { id: 1, realm: 'personal', title: 'Morning Meditation (10m)', energy: 'low', completed: false, phase: 'all', createdAt: new Date().toISOString() },
        { id: 2, realm: 'personal', title: 'Prepare magical herbal tea', energy: 'low', completed: false, phase: 'menstrual', createdAt: new Date().toISOString() },
        { id: 3, realm: 'personal', title: 'Sword practice (HIIT)', energy: 'high', completed: false, phase: 'follicular', createdAt: new Date().toISOString() },
        { id: 4, realm: 'personal', title: 'Deep journaling session', energy: 'mid', completed: false, phase: 'luteal', createdAt: new Date().toISOString() },
        { id: 5, realm: 'work', title: 'Draft Kingdom Treaty (Proposal)', energy: 'high', completed: false, phase: 'follicular', createdAt: new Date().toISOString() },
        { id: 6, realm: 'work', title: 'Organize Vault (Inbox zero)', energy: 'low', completed: false, phase: 'luteal', createdAt: new Date().toISOString() },
        { id: 7, realm: 'work', title: 'Guild Meeting Presentation', energy: 'mid', completed: false, phase: 'ovulation', createdAt: new Date().toISOString() },
    ],
    chatHistory: [
        { role: 'ai', text: 'I am Luna, the voice of the stars. Speak what weighs on your soul, and I shall answer with the wisdom of the cosmos...' }
    ],
    healthChatHistory: [
        { role: 'ai', text: 'I am ready to review your medical history. Please provide your blood test findings or scan results.<br><br><small style="color:#ffb6c1;">*Disclaimer: This information is meant strictly as a helpful guide and is not a substitute for professional medical diagnosis or treatment. Always consult your doctor.*</small>' }
    ],
    journalEntries: [],
    stats: {
        streak: 12,
        baseQuestsCompleted: 84
    },
    dailyInspiration: {
        quote: "There is no limit to what we, as women, can accomplish.",
        author: "Michelle Obama"
    },
    activeTab: 'quests', // 'quests' or 'journey'
    journalTab: 'new', // 'new' or 'memories'
    mainView: 'dashboard', // 'dashboard' or 'health'
    healthVaultTab: 'chat', // 'chat' or 'summary'
    clinicalSummaries: [],
    isGeneratingSnapshot: false,
    recommendedSpecialist: null,
    userLocation: null,
    userLat: null,
    userLon: null,
    questFilter: 'daily', // 'daily', 'weekly', 'monthly', 'yearly'
    calendarMonth: new Date().getMonth(),
    calendarYear: new Date().getFullYear(),
    periodDates: [new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0]]
};

const aiResponses = {
    menstrual: "Rest is a weapon, my lady. Gather your strength in the shadows today; the realm can wait while you heal.",
    follicular: "Your energy rises like the tides being tugged by the full moon. A perfect time to begin new quests and forge ahead on your journey.",
    ovulation: "Your charisma and power are at their peak. The moon glows fully illuminating your path. Lead the charge and conquer the day's greatest challenges.",
    luteal: "The moon wanes and so does your external energy. Focus on tying up loose ends, organizing your inventory, and preparing for the winter."
};

const phaseInfo = {
    menstrual: "Day 1-5 • Resting phase",
    follicular: "Day 6-13 • Growth phase",
    ovulation: "Day 14 • Peak energy",
    luteal: "Day 15-28 • Reflection phase"
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
}

// --- DOM Elements ---
const appContainer = document.getElementById('app');

// --- Render Logic ---

function render() {
    if (!mockData.user) {
        renderAuth();
    } else {
        renderDashboard();
    }
}

function loadProfileFromStorage() {
    const saved = localStorage.getItem('lunaUserProfile');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Error parsing profile", e);
        }
    }
    return null;
}

function handleLogin(e) {
    if (e) e.preventDefault();
    mockData.user = loadProfileFromStorage() || {
        name: "Luna",
        age: 28,
        cycleLength: 28,
        issues: "",
        designation: "Adventurer",
        workHours: "9-5",
        personalHours: "18-22",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=b6e3f4&style=circle&top=longHair"
    };
    updateCurrentCyclePhase();
    render();
}

function handleLogout() {
    mockData.user = null;
    render();
}

function toggleRealm() {
    const switcher = document.querySelector('.realm-switcher');
    mockData.realm = mockData.realm === 'personal' ? 'work' : 'personal';
    switcher.dataset.realm = mockData.realm;

    // Update active class
    const options = document.querySelectorAll('.realm-option');
    options[0].classList.toggle('active');
    options[1].classList.toggle('active');

    // Re-render quest list to filter by realm
    renderQuests();
}

// --- Profile Modal Functions ---

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex-center');
        checkCycleRegularity(); // Init evaluation text
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex-center');
    }
}

function saveProfileModal() {
    mockData.user.name = document.getElementById('profileName').value || mockData.user.name;
    mockData.user.age = document.getElementById('profileAge').value || mockData.user.age;
    mockData.user.cycleLength = document.getElementById('profileCycleLength').value || mockData.user.cycleLength;
    mockData.user.issues = document.getElementById('profileIssues').value || mockData.user.issues;
    mockData.user.designation = document.getElementById('profileDesignation').value || mockData.user.designation;
    mockData.user.workHours = document.getElementById('profileWorkHours').value || mockData.user.workHours;
    mockData.user.personalHours = document.getElementById('profilePersonalHours').value || mockData.user.personalHours;
    mockData.user.avatar = document.getElementById('profilePreview').src;

    localStorage.setItem('lunaUserProfile', JSON.stringify(mockData.user));

    closeProfileModal();
    renderDashboard();
    showToast("Profile settings & avatar globally saved!");
}

function previewProfilePic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profilePreview').src = e.target.result;
            // Also logically update all instances of the avatar image in DOM if needed.
            const navAvatar = document.querySelector('header .avatar');
            if (navAvatar) navAvatar.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function checkCycleRegularity() {
    const val = parseInt(document.getElementById('profileCycleLength').value, 10);
    const textEl = document.getElementById('cycleRegularityText');
    if (!val) {
        textEl.innerText = "";
        return;
    }

    // Standard healthy range considered ~21-35 days by most literature.
    if (val >= 21 && val <= 35) {
        textEl.innerText = "Status: Regular cycle detected.";
        textEl.style.color = "var(--accent-gold)";
    } else {
        textEl.innerText = "Status: Irregular cycle length. Recommending consult.";
        textEl.style.color = "#ff4a68";
    }
}

function toggleQuest(id, event) {
    if (event) event.stopPropagation();
    const quest = mockData.quests.find(q => q.id === id);
    if (quest) {
        const questNode = document.getElementById(`quest-item-${id}`);

        if (!quest.completed) {
            // Completing the quest
            quest.completed = true;
            quest.completedAt = new Date().toISOString();

            if (questNode && mockData.activeTab === 'quests') {
                // Update checkbox visually
                const checkbox = questNode.querySelector('.checkbox');
                if (checkbox) checkbox.classList.add('checked');

                // Strike through the text
                const title = questNode.querySelector('h4');
                if (title) {
                    title.style.textDecoration = 'line-through';
                    title.style.opacity = '0.5';
                }

                // Add an animation class after a short delay so user sees the checkmark
                setTimeout(() => {
                    questNode.classList.add('quest-completed-animation');

                    // After the animation finishes sliding out, re-render
                    setTimeout(() => {
                        renderQuests();
                        renderStats();
                        showToast("Quest archived to Journey So Far✨");
                    }, 400);
                }, 400);

                return;
            }
        } else {
            // Uncompleting from the journey so far tab
            quest.completed = false;
            quest.completedAt = null;

            if (questNode && mockData.activeTab === 'journey') {
                const checkbox = questNode.querySelector('.checkbox');
                if (checkbox) checkbox.classList.remove('checked');

                const title = questNode.querySelector('h4');
                if (title) {
                    title.style.textDecoration = 'none';
                    title.style.opacity = '1';
                }

                setTimeout(() => {
                    questNode.classList.add('quest-completed-animation');
                    setTimeout(() => {
                        renderQuests();
                        renderStats();
                        showToast("Quest restored to Active Quests 🌙");
                    }, 400);
                }, 400);
                return;
            }
        }
    }

    // Default immediate re-render if un-completing or not animating
    renderQuests();
    renderStats();
}

function showToast(message) {
    const existingToast = document.getElementById('toast-msg');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'glass-panel fade-in';
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '1rem 2rem';
    toast.style.color = 'var(--text-primary)';
    toast.style.zIndex = '9999';
    toast.style.border = '1px solid var(--accent-gold)';
    toast.style.boxShadow = '0 0 15px rgba(249, 217, 118, 0.4)';
    toast.style.fontFamily = 'var(--font-heading)';
    toast.innerHTML = `<i class="fa-solid fa-star text-gold"></i> ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.5s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

function submitJournal() {
    const input = document.getElementById('journalEntry').value;
    const mood = document.getElementById('moodSlider').value;
    const energy = document.getElementById('energySlider').value;

    if (!input.trim()) return;

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    mockData.journalEntries.push({ text: input, mood, energy, date: dateStr });

    // Animate AI companion response
    const aiText = document.querySelector('.companion-dialogue');
    aiText.innerHTML = "<em>I have recorded your thoughts securely in the ancient vault. Your sentiment appears... thoughtful. Your energy aligns with your current cycle phase.</em>";
    aiText.classList.remove('fade-in');
    void aiText.offsetWidth; // Trigger reflow
    aiText.classList.add('fade-in');

    // Switch to memories tab to show the new entry
    mockData.journalTab = 'memories';
    renderDashboard();
    showToast("Thought safely encrypted in your memories.");
}

// --- Component Generators ---

function getCycleStarts(dates) {
    if (!dates || dates.length === 0) return [];
    let sortedDates = [...dates].sort();
    let starts = [sortedDates[0]];
    let lastDate = new Date(sortedDates[0]);

    for (let i = 1; i < sortedDates.length; i++) {
        let currentDate = new Date(sortedDates[i]);
        let diff = (currentDate - lastDate) / (1000 * 60 * 60 * 24);
        if (diff > 10) {
            starts.push(sortedDates[i]);
        }
        lastDate = currentDate;
    }
    return starts;
}

function updateCurrentCyclePhase() {
    const cycleStarts = getCycleStarts(mockData.periodDates);
    if (!cycleStarts || cycleStarts.length === 0) {
        mockData.cyclePhase = 'ovulation'; // fallback default
        return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const cLen = mockData.user?.cycleLength || 28;
    const ovulationDay = cLen - 14;

    let targetStartD = null;
    let fallbackFuture = null;
    for (let s of cycleStarts) {
        let sDate = new Date(s);
        if (sDate <= today) {
            targetStartD = sDate;
        } else if (!fallbackFuture || sDate < fallbackFuture) {
            fallbackFuture = sDate;
        }
    }

    if (!targetStartD && fallbackFuture) {
        let diff = Math.round((fallbackFuture - today) / 86400000);
        targetStartD = new Date(fallbackFuture.getTime() - (Math.ceil(diff / cLen) * cLen * 86400000));
    }
    if (!targetStartD) targetStartD = new Date(cycleStarts[0]);

    if (targetStartD) {
        let diff = Math.round((today - targetStartD) / 86400000);
        let daysIntoCycle = ((diff % cLen) + cLen) % cLen;

        if (daysIntoCycle < 5) {
            mockData.cyclePhase = 'menstrual';
        } else if (daysIntoCycle < (ovulationDay - 1)) {
            mockData.cyclePhase = 'follicular';
        } else if (daysIntoCycle <= (ovulationDay + 1)) {
            mockData.cyclePhase = 'ovulation';
        } else {
            mockData.cyclePhase = 'luteal';
        }
        mockData.daysIntoCycle = daysIntoCycle + 1; // 1-indexed for display
    }
}

function generateCalendarHTML() {
    const targetMonth = mockData.calendarMonth;
    const targetYear = mockData.calendarYear;
    const dateObj = new Date(targetYear, targetMonth, 1);
    const monthName = dateObj.toLocaleString('default', { month: 'long' });

    let daysHtml = '';
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const firstDay = new Date(targetYear, targetMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)

    // Day headers
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    dayNames.forEach(d => {
        daysHtml += `<div class="cal-day-header">${d}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
        daysHtml += `<div class="cal-day empty"></div>`;
    }

    // Predict full cycle phases based on cycle starts
    const cycleStarts = getCycleStarts(mockData.periodDates);
    const cLen = mockData.user?.cycleLength || 28;
    const ovulationDay = cLen - 14;

    const todayDateStr = new Date().toISOString().split('T')[0];

    for (let i = 1; i <= daysInMonth; i++) {
        const dStr = new Date(targetYear, targetMonth, i, 12).toISOString().split('T')[0];
        let classes = ['cal-day', 'interactive'];

        if (dStr === todayDateStr) classes.push('cal-today');

        if (mockData.periodDates.includes(dStr)) {
            classes.push('cal-period');
        } else if (cycleStarts.length > 0) {
            let startD = null;
            let fallbackFuture = null;
            for (let s of cycleStarts) {
                let sDate = new Date(s);
                let dDate = new Date(dStr);
                if (sDate <= dDate) {
                    startD = sDate;
                } else if (!fallbackFuture || sDate < fallbackFuture) {
                    fallbackFuture = sDate;
                }
            }
            let targetStartD = startD;
            if (!targetStartD && fallbackFuture) {
                let diff = Math.round((fallbackFuture - new Date(dStr)) / 86400000);
                targetStartD = new Date(fallbackFuture.getTime() - (Math.ceil(diff / cLen) * cLen * 86400000));
            }
            if (!targetStartD) targetStartD = new Date(cycleStarts[0]);

            if (targetStartD) {
                const diff = Math.round((new Date(dStr) - targetStartD) / 86400000);
                const daysIntoCycle = ((diff % cLen) + cLen) % cLen;

                // Typical ovulation window is approx 5 days leading up to and including the ovulation day itself
                if (daysIntoCycle < 5) {
                    classes.push('cal-predicted'); // Menstrual/Predicted
                } else if (daysIntoCycle < (ovulationDay - 1)) {
                    classes.push('cal-follicular');
                } else if (daysIntoCycle <= (ovulationDay + 1)) {
                    classes.push('cal-ovulation');
                } else {
                    classes.push('cal-luteal');
                }
            }
        }

        daysHtml += `<div class="${classes.join(' ')}" onclick="togglePeriodDate('${dStr}')" title="Log Period">${i}</div>`;
    }

    const regFlag = (cLen >= 21 && cLen <= 35) ? "Regular cycle" : "Irregular cycle";
    const regColor = (cLen >= 21 && cLen <= 35) ? "var(--text-muted)" : "#ff4a68";

    return `
        <div class="mini-calendar">
            <div class="cal-header" style="display:flex; justify-content:space-between; align-items:center;">
                <button class="btn-icon" onclick="changeCalendarMonth(-1)" style="font-size: 0.8rem;"><i class="fa-solid fa-chevron-left"></i></button>
                <span>${monthName} ${targetYear}</span>
                <button class="btn-icon" onclick="changeCalendarMonth(1)" style="font-size: 0.8rem;"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="cal-grid" style="margin-bottom: 0.5rem;">
                ${daysHtml}
            </div>
            <div style="display: flex; justify-content: space-around; font-size: 0.7rem; color: var(--text-muted); margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.25rem;">
                <div style="display:flex; align-items:center; gap:0.25rem;"><div style="width:10px; height:10px; background:#ff4a68; border-radius:3px;"></div> Period</div>
                <div style="display:flex; align-items:center; gap:0.25rem;"><div style="width:10px; height:10px; background:#50C878; border-radius:3px;"></div> Follicular</div>
                <div style="display:flex; align-items:center; gap:0.25rem;"><div style="width:10px; height:10px; background:#f472b6; border-radius:3px;"></div> Ovulation</div>
                <div style="display:flex; align-items:center; gap:0.25rem;"><div style="width:10px; height:10px; background:#fbbf24; border-radius:3px;"></div> Luteal</div>
            </div>
            <div class="moon-render-container" style="position: relative;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg" alt="Moon Phase" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 25px var(--accent-magic-glow); margin: 0 auto; display: block;" />
            </div>
            <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: ${regColor};">
                ${regFlag} length (${cLen} days)
            </div>
        </div>
    `;
}

function filterQuestsByTime(quest) {
    const filter = mockData.questFilter;
    const now = new Date();
    const targetDateStr = mockData.activeTab === 'quests' ? quest.createdAt : quest.completedAt;

    if (!targetDateStr) return true;
    const targetDate = new Date(targetDateStr);

    if (filter === 'daily') {
        return targetDate.toDateString() === now.toDateString();
    } else if (filter === 'weekly') {
        const diff = Math.abs(now - targetDate) / (1000 * 60 * 60 * 24);
        return diff <= 7;
    } else if (filter === 'monthly') {
        return targetDate.getMonth() === now.getMonth() && targetDate.getFullYear() === now.getFullYear();
    } else if (filter === 'yearly') {
        return targetDate.getFullYear() === now.getFullYear();
    }
    return true;
}

function renderAuth() {
    appContainer.innerHTML = `
        <div class="auth-container fade-in">
            <div class="glass-panel auth-card">
                <div class="logo justify-center mb-4">
                    <i class="fa-solid fa-moon"></i>
                    <span>LunaRhythm</span>
                </div>
                <h1>Welcome, Daughter of the Moon</h1>
                <p class="auth-subtitle">Your AI-powered adventure companion awaits.</p>
                
                <form class="auth-form" onsubmit="handleLogin(event)">
                    <input type="email" class="auth-input" placeholder="Email Address" required value="moonchild@realm.com">
                    <input type="password" class="auth-input" placeholder="Password" required value="password123">
                    <button type="submit" class="btn-primary" style="margin-top: 1rem; width: 100%;">Enter Realm</button>
                </form>
                
                <div class="divider">OR</div>
                
                <button class="google-btn" onclick="handleLogin()">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="20">
                    Continue with Google
                </button>
            </div>
        </div>
    `;

    // Attach globals for inline handlers
    window.handleLogin = handleLogin;
}

function renderDashboard() {
    // Generate or fetch Avatar URL
    const avatarUrl = mockData.user.avatar;

    appContainer.innerHTML = `
        <header class="glass-panel fade-in">
            <div class="logo" style="cursor: pointer;" onclick="switchMainView('dashboard')" title="Back to Dashboard">
                <i class="fa-solid fa-moon"></i>
                LunaRhythm
            </div>
            
            <div class="realm-switcher" data-realm="${mockData.realm}" onclick="toggleRealm()">
                <div class="realm-slider"></div>
                <div class="realm-option ${mockData.realm === 'personal' ? 'active' : ''}">Personal</div>
                <div class="realm-option ${mockData.realm === 'work' ? 'active' : ''}">Work Realm</div>
            </div>
            
            <div class="profile-menu">
                <button class="btn-primary" style="background: ${mockData.mainView === 'health' ? 'var(--accent-gold)' : 'transparent'}; border: 1px solid var(--accent-gold); color: ${mockData.mainView === 'health' ? 'var(--bg-dark)' : 'var(--accent-gold)'}; padding: 0.5rem 1rem; border-radius: var(--border-radius-pill);" onclick="switchMainView('health')"><i class="fa-solid fa-notes-medical"></i> Your Health</button>
                <img src="${avatarUrl}" class="avatar" onclick="openProfileModal()" title="Profile" alt="Profile" style="margin-left: 1rem;" />
                <button class="btn-icon" onclick="handleLogout()" title="Logout" style="margin-left: 0.5rem;"><i class="fa-solid fa-right-from-bracket"></i></button>
            </div>
        </header>

        ${mockData.mainView === 'health' ? `
        <main class="fade-in" style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
            <h2 class="text-gold mb-4" style="font-family: var(--font-heading);"><i class="fa-solid fa-notes-medical"></i> Medical Vault & AI Analysis</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div class="glass-panel" style="padding: 2rem; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 class="mb-4" style="font-family: var(--font-heading); color: var(--text-primary);">Upload Records</h3>
                    <div class="mb-4">
                        <label class="text-muted text-sm mb-2 d-block"><i class="fa-solid fa-droplet" style="color:#ff4a68;"></i> Blood Test Findings</label>
                        <input type="file" id="bloodTestUpload" class="auth-input mb-3" accept=".pdf,.jpg,.jpeg,.png" style="padding: 0.8rem; cursor: pointer;" />
                    </div>
                    <div class="mb-4">
                        <label class="text-muted text-sm mb-2 d-block"><i class="fa-solid fa-x-ray" style="color:var(--accent-magic);"></i> Scans & Imaging</label>
                        <input type="file" id="scanUpload" class="auth-input mb-3" accept=".pdf,.jpg,.jpeg,.png" style="padding: 0.8rem; cursor: pointer;" />
                    </div>
                    <button class="btn-primary w-100" onclick="analyzeHealth()"><i class="fa-solid fa-magnifying-glass-chart"></i> Analyze with Luna</button>
                </div>
                
                <div class="glass-panel" style="padding: 2rem; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; height: 600px;">
                    <div style="display: flex; gap: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 1rem;">
                        <h3 class="${mockData.healthVaultTab === 'chat' ? 'text-gold' : 'text-muted'}" style="font-family: var(--font-heading); margin: 0; cursor: pointer; transition: 0.3s;" onclick="switchHealthVaultTab('chat')"><i class="fa-solid fa-user-doctor"></i> Luna AI Chat</h3>
                        <h3 class="${mockData.healthVaultTab === 'summary' ? 'text-gold' : 'text-muted'}" style="font-family: var(--font-heading); margin: 0; cursor: pointer; transition: 0.3s;" onclick="switchHealthVaultTab('summary')"><i class="fa-solid fa-file-medical"></i> Clinical Snapshot</h3>
                    </div>
                    
                    ${mockData.healthVaultTab === 'chat' ? `
                    <div id="healthChatBox" style="flex: 1; overflow-y: auto; padding-right: 0.5rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 1rem; min-height: 0;">
                    </div>
                    <form onsubmit="sendHealthChat(event)" style="display: flex; gap: 0.5rem; margin-top: auto;">
                        <input type="text" id="healthChatInput" class="auth-input" placeholder="Ask questions about your health..." style="flex: 1; padding: 0.8rem;" autocomplete="off" />
                        <button type="submit" class="btn-icon" style="background: var(--accent-gold); color: var(--bg-dark);"><i class="fa-solid fa-paper-plane"></i></button>
                    </form>
                    ` : `
                    <div id="clinicalSummaryBox" class="fade-in" style="flex: 1; overflow-y: auto; padding-right: 0.5rem; display: flex; flex-direction: column; gap: 1rem; min-height: 0; color: var(--text-primary); font-size: 0.95rem; line-height: 1.6;">
                        ${mockData.isGeneratingSnapshot ? `
                        <div class="glass-panel" style="padding: 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 0.5rem; text-align: center;">
                            <i class="fa-solid fa-spinner fa-spin fa-2x text-gold mb-3"></i>
                            <p class="text-muted" style="margin: 0;">Luna is scanning your documents to compile a clinical snapshot...</p>
                        </div>
                        ` : ''}
                        ${mockData.clinicalSummaries.length === 0 && !mockData.isGeneratingSnapshot ? '<p class="text-muted text-center" style="margin-top: 2rem;">Upload records and analyze them with Luna to auto-generate a clinical snapshot.</p>' :
                mockData.clinicalSummaries.map((summary, index) => `
                            <div class="glass-panel summary-dropdown" style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 0.5rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="toggleClinicalSummary(${index})">
                                    <h4 style="margin: 0; font-family: var(--font-heading); color: var(--accent-gold); font-size: 1rem;">
                                        ${summary.title}
                                    </h4>
                                    <i class="fa-solid fa-chevron-${summary.expanded ? 'up' : 'down'}" style="color: var(--text-muted);"></i>
                                </div>
                                ${summary.expanded ? `
                                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                                    ${summary.content}
                                </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    `}
                </div>
            </div>
            
            <div class="glass-panel mt-4 fade-in" style="padding: 2rem; border: 1px solid rgba(255,255,255,0.1); margin-top: 2rem;">
                <h3 class="mb-3 text-gold" style="font-family: var(--font-heading);"><i class="fa-solid fa-hand-holding-medical"></i> Contact Healers</h3>
                <p class="text-muted mb-4">Search your location to connect with trusted medical professionals nearby.</p>
                <form onsubmit="submitLocation(event)" style="display: flex; gap: 1rem; max-width: 480px; margin-bottom: 0.5rem;">
                    <input type="text" id="locationInput" value="${mockData.userLocation || ''}" class="auth-input" placeholder="City or Zip Code..." style="flex: 1; padding: 0.8rem;" />
                    <button type="submit" class="btn-primary">Search</button>
                    <button type="button" class="btn-icon" style="background: var(--accent-magic); color: var(--bg-dark); padding: 0 1.2rem; border-radius: 8px;" onclick="detectLocation()" title="Use GPS"><i class="fa-solid fa-location-arrow"></i></button>
                    ${mockData.userLocation ? `<button type="button" class="btn-icon" style="background: rgba(255,255,255,0.1); padding: 0 1.2rem; border-radius: 8px;" onclick="resetLocation()" title="Clear Location"><i class="fa-solid fa-xmark"></i></button>` : ''}
                </form>
                <div id="locationError" class="text-sm text-magic" style="display: none; margin-bottom: 1rem;"></div>

                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem; margin-top: 1rem;">
                    <p class="text-muted mb-0">
                        ${mockData.userLocation
                ? (mockData.clinicalSummaries.length > 0 ? `Based on your recent analysis, we recommend seeing a <strong class="text-magic">${mockData.recommendedSpecialist || 'General Physician'}</strong> near <strong style="color:var(--text-primary)">${mockData.userLocation}</strong>.` : `Viewing trusted healers near <strong style="color:var(--text-primary)">${mockData.userLocation}</strong>.`)
                : (mockData.clinicalSummaries.length > 0 ? `Based on your recent analysis, we recommend seeing a <strong class="text-magic">${mockData.recommendedSpecialist || 'General Physician'}</strong>.` : `Showing all available trusted healers.`)}
                    </p>
                </div>

                <div class="healers-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                    ${(() => {
                let filtered = doctorsDB;
                if (mockData.recommendedSpecialist) {
                    filtered = filtered.filter(h => h.type === mockData.recommendedSpecialist);
                } else {
                    filtered = filtered.filter(h => h.type === 'General Physician' || h.type === 'Gynecologist');
                }

                filtered = filtered.map(h => { return { ...h, calculatedDist: calculateDistance(mockData.userLat, mockData.userLon, h.lat, h.lon) }; });

                if (mockData.userLat !== null && mockData.userLon !== null) {
                    filtered = filtered.filter(h => h.calculatedDist === null || h.calculatedDist <= 3);
                    filtered.sort((a, b) => (a.calculatedDist || Infinity) - (b.calculatedDist || Infinity));
                }

                if (filtered.length === 0) {
                    return `<div class="glass-panel text-center" style="grid-column: 1 / -1; padding: 3rem 1rem;">
                                <i class="fa-solid fa-user-doctor text-muted fa-3x mb-3"></i>
                                <h4 class="text-primary mb-2">No healers found nearby</h4>
                                <p class="text-muted">We couldn't find any ${mockData.recommendedSpecialist || 'General Physician'}s within a 3km radius of your location.</p>
                            </div>`;
                }

                return filtered.map(healer => `
                            <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); position: relative; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                                <div style="display: flex; gap: 1rem; align-items: start;">
                                    <div style="width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(181, 124, 255, 0.2); border: 2px solid var(--accent-magic); flex-shrink: 0;">
                                        <i class="fa-solid fa-user-doctor text-magic fa-lg"></i>
                                    </div>
                                    <div style="flex: 1;">
                                        <h5 style="margin: 0; color: var(--text-primary); font-size: 1.1rem; font-family: var(--font-heading);">${healer.name}</h5>
                                        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;">${healer.degree}</div>
                                        <div style="font-size: 0.85rem; color: var(--accent-gold); margin-top: 0.1rem; text-transform: uppercase;">${healer.type}</div>
                                    </div>
                                    ${healer.calculatedDist !== null ? `<div class="text-gold text-sm" style="font-weight: 600; flex-shrink:0;"><i class="fa-solid fa-location-arrow"></i> ${healer.calculatedDist.toFixed(1)} km</div>` : ''}
                                </div>
                                
                                <div style="font-size: 0.9rem; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem;">
                                    <div style="margin-bottom: 0.4rem;"><i class="fa-solid fa-hospital text-magic" style="width:20px;"></i> <strong style="color: var(--text-primary);">${healer.clinic}</strong></div>
                                    <div style="margin-bottom: 0.4rem; display:flex; gap: 5px;"><i class="fa-solid fa-location-dot text-magic" style="width:20px; flex-shrink:0; margin-top: 3px;"></i> <span>${healer.address}</span></div>
                                    <div style="margin-bottom: 0.2rem;"><i class="fa-solid fa-phone text-magic" style="width:20px;"></i> ${healer.contact}</div>
                                </div>
                                
                                <a href="${healer.gmapsLink}" target="_blank" class="btn-primary" style="text-align: center; text-decoration: none; padding: 0.6rem; margin-top: 0.5rem; border-radius: 8px;">
                                    <i class="fa-solid fa-map-location-dot"></i> Open in Maps
                                </a>
                            </div>
                        `).join('');
            })()}
                </div>
            </div>
        </main>
        ` : `
        <main class="dashboard-grid fade-in">
            <!-- Left Sidebar -->
            <aside class="left-sidebar">
                <div class="glass-panel luna-companion">
                    <img src="luna-logo.png" class="luna-orb" alt="Luna AI" />
                    <h3 class="realm-title">Luna AI</h3>
                    <p class="companion-dialogue">${aiResponses[mockData.cyclePhase]}</p>
                </div>
                
                <div class="glass-panel cycle-widget text-center">
                    <h4 class="text-gold mb-2">Cycle Phase Tracker</h4>
                    ${generateCalendarHTML()}
                    <div class="phase-indicator mt-4">
                        <span class="text-magic fw-bold text-uppercase mt-2">${mockData.cyclePhase}</span>
                        <div class="text-muted text-sm mt-1">${mockData.daysIntoCycle ? `Day ${mockData.daysIntoCycle} • ` : ''}${phaseInfo[mockData.cyclePhase] || 'Journeying...'}</div>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <section class="main-content">
                <div class="glass-panel quests-section">
                    <div class="section-header">
                        <div class="tabs">
                            <h3 class="${mockData.activeTab === 'quests' ? 'active-tab' : 'inactive-tab'}" onclick="switchTab('quests')">Active Quests</h3>
                            <h3 class="${mockData.activeTab === 'journey' ? 'active-tab' : 'inactive-tab'}" onclick="switchTab('journey')">Journey So Far</h3>
                        </div>
                        <button class="btn-icon" onclick="openAddQuestModal()" title="Add Quest"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <div class="quests-filter-row">
                        <span style="cursor:pointer; color: ${mockData.questFilter === 'daily' ? 'var(--accent-gold)' : 'var(--text-muted)'};" onclick="switchQuestFilter('daily')">Daily</span>
                        <span style="cursor:pointer; color: ${mockData.questFilter === 'weekly' ? 'var(--accent-gold)' : 'var(--text-muted)'};" onclick="switchQuestFilter('weekly')">Weekly</span>
                        <span style="cursor:pointer; color: ${mockData.questFilter === 'monthly' ? 'var(--accent-gold)' : 'var(--text-muted)'};" onclick="switchQuestFilter('monthly')">Monthly</span>
                        <span style="cursor:pointer; color: ${mockData.questFilter === 'yearly' ? 'var(--accent-gold)' : 'var(--text-muted)'};" onclick="switchQuestFilter('yearly')">Yearly</span>
                    </div>
                    <div class="quest-list" id="questList">
                        <!-- Quests injected here -->
                    </div>
                </div>

                <div class="glass-panel journal-section">
                    <div class="section-header" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; width: 100%;">
                            <h3>Chronicle (Journal)</h3>
                            <span class="text-muted text-sm"><i class="fa-solid fa-lock"></i> Encrypted</span>
                        </div>
                        <div class="tabs">
                            <h3 style="font-size: 1rem;" class="${mockData.journalTab === 'new' ? 'active-tab' : 'inactive-tab'}" onclick="switchJournalTab('new')">New Entry</h3>
                            <h3 style="font-size: 1rem;" class="${mockData.journalTab === 'memories' ? 'active-tab' : 'inactive-tab'}" onclick="switchJournalTab('memories')">Memories</h3>
                        </div>
                    </div>
                    
                    ${mockData.journalTab === 'new' ? `
                        <div class="mood-energy-sliders fade-in">
                            <div class="slider-group">
                                <label><span>Mood</span> <span class="text-gold"><i class="fa-solid fa-face-smile"></i></span></label>
                                <input type="range" id="moodSlider" min="1" max="10" value="7">
                            </div>
                            <div class="slider-group">
                                <label><span>Energy</span> <span class="text-magic"><i class="fa-solid fa-bolt"></i></span></label>
                                <input type="range" id="energySlider" min="1" max="10" value="8">
                            </div>
                        </div>
                        <textarea id="journalEntry" class="journal-input fade-in" placeholder="Record your thoughts, moon goddess..."></textarea>
                        <div style="text-align: right;" class="fade-in">
                            <button class="btn-primary" onclick="submitJournal()"><i class="fa-solid fa-feather-pointed"></i> Scribe</button>
                        </div>
                    ` : `
                        <div class="memories-list fade-in" style="max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; padding-right: 0.5rem;">
                            ${mockData.journalEntries.length === 0 ? '<p class="text-muted text-center py-4" style="margin: 0;">Your vault is empty. Scribe your first thought.</p>' :
            mockData.journalEntries.map(entry => `
                                  <div style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--border-radius-sm);">
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                          <span class="text-muted text-sm">${entry.date}</span>
                                          <div style="display: flex; gap: 0.5rem; font-size: 0.8rem;">
                                              <span class="text-gold"><i class="fa-solid fa-face-smile"></i> ${entry.mood}</span>
                                              <span class="text-magic"><i class="fa-solid fa-bolt"></i> ${entry.energy}</span>
                                          </div>
                                      </div>
                                      <p style="color: var(--text-primary); font-size: 0.95rem; white-space: pre-wrap; margin: 0;">${entry.text}</p>
                                  </div>
                              `).reverse().join('')
        }
                        </div>
                    `}
                </div>
            </section>

            <!-- Right Sidebar -->
            <aside class="right-sidebar">
                <div class="glass-panel daily-inspiration">
                    <h4 class="text-gold"><i class="fa-solid fa-star"></i> Daily Inspiration</h4>
                    <p class="quote-content">"${mockData.dailyInspiration.quote}"</p>
                    <p class="quote-author">- ${mockData.dailyInspiration.author}</p>
                </div>
                
                <div class="glass-panel moons-call-chat" style="margin-top: 1.5rem; display: flex; flex-direction: column; height: 320px;">
                    <h4 class="text-gold mb-2"><i class="fa-solid fa-moon"></i> The Moon's Call</h4>
                    <div id="chatBox" style="flex: 1; overflow-y: auto; padding-right: 0.5rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
                        <!-- Chat messages injected here -->
                    </div>
                    <form onsubmit="sendMoonChat(event)" style="display: flex; gap: 0.5rem;">
                        <input type="text" id="chatInput" class="auth-input" placeholder="Commune with Luna..." style="flex: 1; padding: 0.8rem;" autocomplete="off" />
                        <button type="submit" class="btn-icon" style="background: var(--accent-gold); color: var(--bg-dark);"><i class="fa-solid fa-paper-plane"></i></button>
                    </form>
                </div>
                
                <div class="glass-panel stats-widget">
                    <h4>Luna's Legacy</h4>
                    <div class="stat-grid" id="statsGrid">
                        <!-- Stats injected here -->
                    </div>
                </div>

                <div class="glass-panel health-tip-widget" style="margin-top: 1.5rem; padding: 1.5rem;">
                    <h4 class="text-gold" style="font-size: 1rem;"><i class="fa-solid fa-heart-pulse"></i> Today's Health Tip</h4>
                    <p class="mt-2 text-sm text-muted" style="line-height: 1.6;">Focus on a nutrient-dense, antioxidant-rich diet, manage stress, and maintain moderate exercise.</p>
                    
                    <div class="mt-4 mb-3">
                        <strong class="text-secondary text-sm" style="display: block; margin-bottom: 0.3rem;">Recommended Exercise:</strong>
                        <p class="text-sm" style="line-height: 1.5; margin-bottom: 0; color: #dcd0ff;">Moderate cardio (brisk walking, swimming), Yoga, and Pilates to improve circulation and reduce stress. High energy phases may support strength training.</p>
                    </div>

                    <div>
                        <strong class="text-secondary text-sm" style="display: block; margin-bottom: 0.3rem;">Recommended Foods:</strong>
                        <p class="text-sm" style="line-height: 1.5; margin-bottom: 0; color: #dcd0ff;">Omega-3 rich foods (salmon, walnuts), leafy greens for Folate, and antioxidant-rich berries. Incorporate healthy fats (avocados) and plant-based protein.</p>
                    </div>
                </div>
            </aside>
        </main>
        `}
        
        <!-- Add Quest Modal Layout Overlay -->
        <div id="addQuestModal" class="modal-overlay hidden">
            <div class="glass-panel modal-content">
                <div class="modal-header">
                    <h3 class="text-gold">Forge New Quest</h3>
                    <button class="btn-icon" onclick="closeAddQuestModal()"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <input type="text" id="newQuestTitle" class="auth-input mb-3" placeholder="Quest Title (e.g., Gather ingredients)" />
                    
                    <label class="text-muted text-sm mb-1 d-block">Energy Level Required</label>
                    <select id="newQuestEnergy" class="auth-input mb-4 text-white">
                        <option value="low">Low Energy (Restorative)</option>
                        <option value="mid">Mid Energy (Standard)</option>
                        <option value="high">High Energy (Intense)</option>
                    </select>
                    
                    <button class="btn-primary w-100 mt-2" onclick="submitNewQuest()"><i class="fa-solid fa-scroll"></i> Decree Quest</button>
                </div>
            </div>
        </div>
        
        <!-- Edit Quest Modal Layout Overlay -->
        <div id="editQuestModal" class="modal-overlay hidden">
            <div class="glass-panel modal-content">
                <div class="modal-header">
                    <h3 class="text-gold">Edit Quest</h3>
                    <button class="btn-icon" onclick="closeEditQuestModal()"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="editQuestId" />
                    <input type="text" id="editQuestTitle" class="auth-input mb-3" placeholder="Quest Title" />
                    
                    <label class="text-muted text-sm mb-1 d-block">Energy Level Required</label>
                    <select id="editQuestEnergy" class="auth-input mb-4 text-white">
                        <option value="low">Low Energy (Restorative)</option>
                        <option value="mid">Mid Energy (Standard)</option>
                        <option value="high">High Energy (Intense)</option>
                    </select>
                    
                    <button class="btn-primary w-100 mt-2" onclick="saveEditQuest()"><i class="fa-solid fa-scroll"></i> Save Changes</button>
                </div>
            </div>
        </div>

        <!-- Profile Modal -->
        <div id="profileModal" class="modal-overlay hidden">
            <div class="glass-panel modal-content" style="max-height: 80vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3 class="text-gold">Your Profile</h3>
                    <button class="btn-icon" onclick="closeProfileModal()"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 1rem;">
                        <img src="${avatarUrl}" id="profilePreview" class="avatar" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto; display: block;" />
                        <label for="profilePicUpload" style="cursor: pointer; color: var(--accent-gold); font-size: 0.8rem; margin-top: 0.5rem; display: inline-block;">Upload New Image</label>
                        <input type="file" id="profilePicUpload" style="display: none;" accept="image/*" onchange="previewProfilePic(event)" />
                    </div>

                    <label class="text-muted text-sm mb-1 d-block">Name</label>
                    <input type="text" id="profileName" class="auth-input mb-3" value="${mockData.user.name || ''}" />
                    
                    <label class="text-muted text-sm mb-1 d-block">Age</label>
                    <input type="number" id="profileAge" class="auth-input mb-3" placeholder="e.g. 28" value="${mockData.user.age || ''}" />
                    
                    <label class="text-muted text-sm mb-1 d-block">Cycle Length (Days)</label>
                    <input type="number" id="profileCycleLength" class="auth-input mb-3" placeholder="e.g. 28" value="${mockData.user.cycleLength || ''}" oninput="checkCycleRegularity()" />
                    <p id="cycleRegularityText" class="text-sm text-gold" style="margin-top: -10px; margin-bottom: 15px;"></p>
                    
                    <label class="text-muted text-sm mb-1 d-block">Any Period Health Issues?</label>
                    <textarea id="profileIssues" class="auth-input mb-3" rows="2" placeholder="(Will be securely logged)">${mockData.user.issues || ''}</textarea>

                    <label class="text-muted text-sm mb-1 d-block">Designation / Role</label>
                    <input type="text" id="profileDesignation" class="auth-input mb-3" value="${mockData.user.designation || ''}" />

                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <div style="flex:1;">
                            <label class="text-muted text-sm mb-1 d-block">Work Hours</label>
                            <input type="text" id="profileWorkHours" class="auth-input" placeholder="e.g. 9-5" value="${mockData.user.workHours || ''}" />
                        </div>
                        <div style="flex:1;">
                            <label class="text-muted text-sm mb-1 d-block">Personal Hours</label>
                            <input type="text" id="profilePersonalHours" class="auth-input" placeholder="e.g. 18-22" value="${mockData.user.personalHours || ''}" />
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn-primary" style="flex: 1;" onclick="saveProfileModal()"><i class="fa-solid fa-save"></i> Save</button>
                        <button class="btn-primary" style="flex: 1; background: transparent; border: 1px solid var(--accent-muted);" onclick="closeProfileModal()"><i class="fa-solid fa-times"></i> Cancel</button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // Ensure auth-input scales nicely in modal
            document.querySelectorAll('.modal-overlay').forEach(el => el.classList.add('fade-in'));
        </script>
    `;

    // Attach globals
    window.toggleRealm = toggleRealm;
    window.handleLogout = handleLogout;
    window.toggleQuest = toggleQuest;
    window.submitJournal = submitJournal;
    window.switchTab = switchTab;
    window.switchQuestFilter = switchQuestFilter;
    window.switchJournalTab = switchJournalTab;
    window.openAddQuestModal = openAddQuestModal;
    window.closeAddQuestModal = closeAddQuestModal;
    window.submitNewQuest = submitNewQuest;
    window.openEditQuestModal = openEditQuestModal;
    window.closeEditQuestModal = closeEditQuestModal;
    window.saveEditQuest = saveEditQuest;
    window.changeCalendarMonth = changeCalendarMonth;
    window.togglePeriodDate = togglePeriodDate;
    window.openProfileModal = openProfileModal;
    window.closeProfileModal = closeProfileModal;
    window.saveProfileModal = saveProfileModal;
    window.previewProfilePic = previewProfilePic;
    window.checkCycleRegularity = checkCycleRegularity;
    window.sendMoonChat = sendMoonChat;
    window.switchMainView = switchMainView;
    window.switchHealthVaultTab = switchHealthVaultTab;
    window.toggleClinicalSummary = toggleClinicalSummary;
    window.analyzeHealth = analyzeHealth;
    window.sendHealthChat = sendHealthChat;
    window.submitLocation = submitLocation;
    window.resetLocation = resetLocation;
    window.detectLocation = detectLocation;

    if (mockData.mainView === 'dashboard') {
        renderQuests();
        renderStats();
        renderMoonChat();
    } else {
        if (mockData.healthVaultTab === 'chat') {
            renderHealthChat();
        }
    }
}

function switchHealthVaultTab(tab) {
    mockData.healthVaultTab = tab;
    renderDashboard();
}

function toggleClinicalSummary(index) {
    if (mockData.clinicalSummaries[index]) {
        mockData.clinicalSummaries[index].expanded = !mockData.clinicalSummaries[index].expanded;
        renderDashboard();
    }
}

function switchMainView(view) {
    mockData.mainView = view;
    if (view === 'health' && !mockData.userLocation) {
        detectLocation();
    }
    renderDashboard();
}

async function submitLocation(event) {
    if (event) event.preventDefault();
    const loc = document.getElementById('locationInput').value.trim();
    if (loc) {
        mockData.userLocation = loc;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc + ', Bengaluru, India')}`);
            const data = await res.json();
            if (data && data.length > 0) {
                mockData.userLat = parseFloat(data[0].lat);
                mockData.userLon = parseFloat(data[0].lon);
            } else {
                mockData.userLat = null;
                mockData.userLon = null;
            }
        } catch (e) {
            mockData.userLat = null;
            mockData.userLon = null;
        }
        renderDashboard();
    }
}

function resetLocation() {
    mockData.userLocation = null;
    mockData.userLat = null;
    mockData.userLon = null;
    renderDashboard();
}

function detectLocation() {
    const errorEl = document.getElementById('locationError');
    if (errorEl) errorEl.style.display = 'none';

    // Utilize Browser's Native Google Location Services (Geolocation API)
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // Reverse Geocode
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await res.json();

                let city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || 'Your Current Location';
                mockData.userLocation = city;
                mockData.userLat = lat;
                mockData.userLon = lon;
                renderDashboard();
            } catch (err) {
                mockData.userLocation = `Coordinates: ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
                mockData.userLat = position.coords.latitude;
                mockData.userLon = position.coords.longitude;
                renderDashboard();
            }
        }, function (error) {
            if (errorEl) {
                errorEl.textContent = "Unable to retrieve your location via GPS. Please type it in.";
                errorEl.style.display = 'block';
            }
        });
    } else {
        if (errorEl) {
            errorEl.textContent = "Geolocation is not supported by your browser.";
            errorEl.style.display = 'block';
        }
    }
}

function renderHealthChat() {
    const box = document.getElementById('healthChatBox');
    if (!box) return;
    box.innerHTML = mockData.healthChatHistory.map(msg => {
        const isUser = msg.role === 'user';
        return `
            <div style="text-align: ${isUser ? 'right' : 'left'};" class="fade-in">
                <span style="display: inline-block; padding: 0.8rem; border-radius: var(--border-radius-sm); font-size: 0.95rem; background: ${isUser ? 'rgba(255, 182, 193, 0.2)' : 'rgba(0, 0, 0, 0.4)'}; color: ${isUser ? '#fff' : '#dcd0ff'}; border-left: ${!isUser ? '3px solid var(--accent-magic)' : 'none'}; border-right: ${isUser ? '3px solid var(--accent-gold)' : 'none'}; line-height: 1.5;">
                    ${msg.text}
                </span>
            </div>
        `;
    }).join('');
    box.scrollTop = box.scrollHeight;
}

async function analyzeHealth() {
    const bloodInput = document.getElementById('bloodTestUpload');
    const scanInput = document.getElementById('scanUpload');

    const bloodFile = bloodInput.files ? bloodInput.files[0] : null;
    const scanFile = scanInput.files ? scanInput.files[0] : null;

    if (!bloodFile && !scanFile) {
        showToast("Please upload your .pdf, .jpg, or .png finding records before analyzing.");
        return;
    }

    let apiKey = 'AIzaSyC1oPkW0W2BB_jNlUb124rErEsyoQnICYA';

    const uploadNames = [];
    if (bloodFile) uploadNames.push(bloodFile.name);
    if (scanFile) uploadNames.push(scanFile.name);

    mockData.healthChatHistory.push({ role: 'user', text: `Please analyze my uploaded medical records: ${uploadNames.join(', ')}` });
    renderHealthChat();

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ mimeType: file.type, data: reader.result.split(',')[1] });
        reader.onerror = error => reject(error);
    });

    try {
        const loadingIndex = mockData.healthChatHistory.length;
        mockData.healthChatHistory.push({ role: 'ai', text: 'Luna is reading the stars and assessing your records... <i class="fa-solid fa-spinner fa-spin"></i>' });
        renderHealthChat();

        const parts = [
            { text: "You are Luna, an empathetic, intuitive medical AI. I am a user. I am uploading some medical test results. Please automatically interpret the test results from the uploaded files. Use semantic pattern matching for keywords in the test results. Start assessing the summary and any information I should know. Incorporate insights based on the feminine health cycle. Conclude your message with a disclaimer that this is strictly a helpful guide and not a substitute for professional medical diagnosis." }
        ];

        if (bloodFile) parts.push({ inlineData: await toBase64(bloodFile) });
        if (scanFile) parts.push({ inlineData: await toBase64(scanFile) });

        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
        });

        if (!response.ok) {
            const errJson = await response.json();
            throw new Error(errJson.error?.message || response.statusText || 'Generation failed.');
        }

        const json = await response.json();
        let aiText = json.candidates[0].content.parts[0].text;
        aiText = aiText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

        mockData.healthChatHistory[loadingIndex].text = aiText;
        bloodInput.value = '';
        scanInput.value = '';
        renderHealthChat();

        // Asynchronously generate clinical summary
        mockData.isGeneratingSnapshot = true;
        if (mockData.mainView === 'health') renderDashboard();

        fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "You are a clinical AI. The user has inputted medical test results in image/PDF format. Parse the standard diagnostic numbers or findings and provide a highly concise, structured \"Clinical Snapshot summary\" strictly formatted in HTML (without markdown formatting blocks). Include an <h4> tag intro, followed by \"<ul><li>...</li></ul>\" highlighting key notable anomalies or markers. End with a short generic disclaimer in <small> tags. Do not use markdown backticks." },
                        ...parts.slice(1) // Include the uploaded images/pdf base64 parts
                    ]
                }]
            })
        }).then(r => r.json()).then(summaryJson => {
            mockData.isGeneratingSnapshot = false;
            if (summaryJson.candidates && summaryJson.candidates[0]) {
                let rawSummary = summaryJson.candidates[0].content.parts[0].text;
                rawSummary = rawSummary.replace(/```html/g, '').replace(/```/g, '');

                let analysisType = 'General Upload Analysis';
                if (bloodFile && scanFile) analysisType = 'Blood & Scan Analysis';
                else if (bloodFile) analysisType = 'Blood Panel Analysis';
                else if (scanFile) analysisType = 'Imaging Scan Analysis';

                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                let spec = 'General Physician';
                const lowerSummary = rawSummary.toLowerCase();
                if (lowerSummary.includes('pcos') || lowerSummary.includes('cyst') || lowerSummary.includes('ovary') || lowerSummary.includes('gynecol') || lowerSummary.includes('menstrua') || lowerSummary.includes('pelvic')) {
                    spec = 'Gynecologist';
                } else if (lowerSummary.includes('thyroid') || lowerSummary.includes('tsh') || lowerSummary.includes('glucose') || lowerSummary.includes('hormone') || lowerSummary.includes('insulin')) {
                    spec = 'Endocrinologist';
                } else if (lowerSummary.includes('iron') || lowerSummary.includes('vitamin') || lowerSummary.includes('diet') || lowerSummary.includes('nutrition') || lowerSummary.includes('deficiency')) {
                    spec = 'General Physician';
                }
                mockData.recommendedSpecialist = spec;

                mockData.clinicalSummaries.unshift({
                    title: `Snapshot ${dateStr} - ${analysisType}`,
                    content: rawSummary,
                    expanded: true
                });

                if (mockData.mainView === 'health') {
                    renderDashboard(); // Re-render to show updated text if they are on the summary tab
                }
            } else {
                if (mockData.mainView === 'health') renderDashboard();
            }
        }).catch(err => {
            console.error("Summary generation failed:", err);
            mockData.isGeneratingSnapshot = false;
            if (mockData.mainView === 'health') {
                renderDashboard();
            }
        });

    } catch (e) {
        mockData.healthChatHistory.push({ role: 'ai', text: 'Cosmic interference: ' + e.message });
        renderHealthChat();
    }
}

async function sendHealthChat(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('healthChatInput');
    const text = input.value.trim();
    if (!text) return;

    let apiKey = 'AIzaSyC1oPkW0W2BB_jNlUb124rErEsyoQnICYA';

    mockData.healthChatHistory.push({ role: 'user', text: text });
    input.value = '';
    renderHealthChat();

    try {
        const loadingIndex = mockData.healthChatHistory.length;
        mockData.healthChatHistory.push({ role: 'ai', text: 'Luna is pondering... <i class="fa-solid fa-spinner fa-spin"></i>' });
        renderHealthChat();

        const historicalContext = mockData.healthChatHistory.map(m => m.role + ": " + m.text.replace(/<[^>]+>/g, '')).join("\n");
        const parts = [
            { text: `You are Luna, an empathetic medical AI. Here is our internal thought log representation of the chat history:\n${historicalContext}\n\nRespond directly to the latest user message thoughtfully. Add a tiny disclaimer at the end that this is not medical advice.` }
        ];

        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
        });

        if (!response.ok) {
            const errJson = await response.json();
            throw new Error(errJson.error?.message || response.statusText || 'API failed.');
        }

        const json = await response.json();
        let aiText = json.candidates[0].content.parts[0].text;
        aiText = aiText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

        mockData.healthChatHistory[loadingIndex].text = aiText;
        renderHealthChat();
    } catch (e) {
        mockData.healthChatHistory.push({ role: 'ai', text: 'Error connecting to the celestial network: ' + e.message });
        renderHealthChat();
    }
}

function renderMoonChat() {
    const box = document.getElementById('chatBox');
    if (!box) return;

    box.innerHTML = mockData.chatHistory.map(msg => {
        const isUser = msg.role === 'user';
        return `
            <div style="text-align: ${isUser ? 'right' : 'left'};" class="fade-in">
                <span style="display: inline-block; padding: 0.6rem 0.8rem; border-radius: var(--border-radius-sm); font-size: 0.85rem; background: ${isUser ? 'rgba(255, 182, 193, 0.2)' : 'rgba(0, 0, 0, 0.4)'}; color: ${isUser ? '#fff' : '#dcd0ff'}; border-left: ${!isUser ? '3px solid var(--accent-magic)' : 'none'}; border-right: ${isUser ? '3px solid var(--accent-gold)' : 'none'};">
                    ${msg.text}
                </span>
            </div>
        `;
    }).join('');
    // Scroll to bottom
    box.scrollTop = box.scrollHeight;
}

async function sendMoonChat(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    let apiKey = 'AIzaSyC1oPkW0W2BB_jNlUb124rErEsyoQnICYA';

    // Add user message to history
    mockData.chatHistory.push({ role: 'user', text: text });
    input.value = '';
    renderMoonChat();

    try {
        const loadingIndex = mockData.chatHistory.length;
        mockData.chatHistory.push({ role: 'ai', text: 'Listening to the stars... <i class="fa-solid fa-spinner fa-spin"></i>' });
        renderMoonChat();

        const historicalContext = mockData.chatHistory.map(m => m.role + ": " + m.text.replace(/<[^>]+>/g, '')).join("\n");
        const parts = [
            { text: `You are Luna, the intuitive, celestial voice of the moon. Act as the user's empathetic best friend who knows everything, listens unconditionally, and always has her back. You communicate warmly, intertwining cosmic metaphors with deep emotional support. \nHere is the immediate chat history:\n${historicalContext}\n\nRespond thoughtfully in character to the latest user message.` }
        ];

        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
        });

        if (!response.ok) {
            const errJson = await response.json();
            throw new Error(errJson.error?.message || response.statusText || 'API disrupted.');
        }

        const json = await response.json();
        let aiText = json.candidates[0].content.parts[0].text;
        aiText = aiText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

        mockData.chatHistory[loadingIndex].text = aiText;
        renderMoonChat();
    } catch (e) {
        const loadingIndex = mockData.chatHistory.findIndex(msg => msg.text && msg.text.includes('fa-spinner'));
        const errorText = 'The cosmic winds disrupted my thoughts (' + e.message + '). Please whisper that to me again.';
        if (loadingIndex >= 0) {
            mockData.chatHistory[loadingIndex].text = errorText;
        } else {
            mockData.chatHistory.push({ role: 'ai', text: errorText });
        }
        renderMoonChat();
    }
}

function renderQuests() {
    const list = document.getElementById('questList');
    if (!list) return;

    // Filter by realm and by completion status based on the selected tab
    const filteredQuests = mockData.quests.filter(q => {
        const realmMatch = q.realm === mockData.realm;
        const statusMatch = mockData.activeTab === 'quests' ? !q.completed : q.completed;
        return realmMatch && statusMatch && filterQuestsByTime(q);
    });

    if (filteredQuests.length === 0) {
        if (mockData.activeTab === 'quests') {
            list.innerHTML = `<p class="text-muted text-center py-4">No quests remain in this realm. Rest easy, Daughter of the Moon.</p>`;
        } else {
            list.innerHTML = `<p class="text-muted text-center py-4">Your journey here has just begun. Complete quests to add them to your legacy.</p>`;
        }
        return;
    }

    list.innerHTML = filteredQuests.map(q => {
        const targetDateStr = mockData.activeTab === 'quests' ? q.createdAt : q.completedAt;
        const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();
        const isToday = targetDate.toDateString() === new Date().toDateString();
        const dateLabel = isToday ? 'Today' : targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return `
        <div class="quest-item fade-in" id="quest-item-${q.id}">
            <div class="quest-info" onclick="openEditQuestModal(${q.id})" style="cursor: pointer; flex: 1;">
                <h4 style="text-decoration: ${q.completed ? 'line-through' : 'none'}; opacity: ${q.completed ? '0.5' : '1'}">${q.title}</h4>
                <div class="quest-meta">
                    <span class="tag energy-${q.energy}"><i class="fa-solid fa-bolt"></i> ${q.energy}</span>
                    <span><i class="fa-regular fa-clock"></i> ${dateLabel}</span>
                </div>
            </div>
            <div class="checkbox ${q.completed ? 'checked' : ''}" onclick="toggleQuest(${q.id}, event)">
                <i class="fa-solid fa-check"></i>
            </div>
        </div>
        `;
    }).join('');
}

function renderStats() {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;

    const completedQuests = mockData.quests.filter(q => q.completed);
    const totalQuestsCompleted = completedQuests.length;

    // Calculate streak
    const completedDates = new Set();
    completedQuests.forEach(q => {
        if (q.completedAt) {
            completedDates.add(new Date(q.completedAt).toDateString());
        }
    });

    let currentStreak = 0;
    let checkDate = new Date();

    if (completedDates.has(checkDate.toDateString())) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (completedDates.has(checkDate.toDateString())) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    } else {
        checkDate.setDate(checkDate.getDate() - 1);
        if (completedDates.has(checkDate.toDateString())) {
            currentStreak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
            while (completedDates.has(checkDate.toDateString())) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        }
    }

    grid.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${currentStreak}</div>
            <div class="stat-label">Day Streak <i class="fa-solid fa-fire" style="color:#ff9800"></i></div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalQuestsCompleted}</div>
            <div class="stat-label">Quests Conquered</div>
        </div>
    `;
}

// --- New Interactions ---

function switchTab(tabName) {
    mockData.activeTab = tabName;
    renderDashboard(); // Re-render to update tab styles and list
}

function switchQuestFilter(filterName) {
    mockData.questFilter = filterName;
    renderDashboard();
}

function switchJournalTab(tabName) {
    mockData.journalTab = tabName;
    renderDashboard();
}

function changeCalendarMonth(delta) {
    mockData.calendarMonth += delta;
    if (mockData.calendarMonth > 11) {
        mockData.calendarMonth = 0;
        mockData.calendarYear++;
    } else if (mockData.calendarMonth < 0) {
        mockData.calendarMonth = 11;
        mockData.calendarYear--;
    }
    renderDashboard();
}

function togglePeriodDate(dateStr) {
    if (mockData.periodDates.includes(dateStr)) {
        mockData.periodDates = mockData.periodDates.filter(d => d !== dateStr);
    } else {
        mockData.periodDates.push(dateStr);
    }
    mockData.periodDates.sort();

    // calculate dynamic cycle length based on actual tracking 
    const cycleStarts = getCycleStarts(mockData.periodDates);
    if (cycleStarts.length >= 2) {
        const lastStart = new Date(cycleStarts[cycleStarts.length - 1]);
        const prevStart = new Date(cycleStarts[cycleStarts.length - 2]);
        const newLength = Math.round((lastStart - prevStart) / (1000 * 60 * 60 * 24));
        if (newLength >= 15 && newLength <= 60 && mockData.user) {
            mockData.user.cycleLength = newLength;
            localStorage.setItem('lunaUserProfile', JSON.stringify(mockData.user));
            // Ensure inputs visually reflect it
            const profLn = document.getElementById('profileCycleLength');
            if (profLn) profLn.value = newLength;
        }
    }

    updateCurrentCyclePhase();
    renderDashboard();
}

function openAddQuestModal() {
    const modal = document.getElementById('addQuestModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex-center'); // To display correctly
    }
}

function closeAddQuestModal() {
    const modal = document.getElementById('addQuestModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex-center');
    }
}

function submitNewQuest() {
    const title = document.getElementById('newQuestTitle').value;
    const energy = document.getElementById('newQuestEnergy').value;

    if (!title.trim()) return;

    const newId = mockData.quests.length > 0 ? Math.max(...mockData.quests.map(q => q.id)) + 1 : 1;

    mockData.quests.push({
        id: newId,
        realm: mockData.realm, // Add to current realm
        title: title,
        energy: energy,
        completed: false,
        phase: 'all'
    });

    closeAddQuestModal();
    // Switch to 'quests' tab automatically if not already there
    if (mockData.activeTab !== 'quests') {
        mockData.activeTab = 'quests';
        renderDashboard();
    } else {
        renderQuests();
    }
}

function openEditQuestModal(id) {
    const quest = mockData.quests.find(q => q.id === id);
    if (!quest) return;

    document.getElementById('editQuestId').value = quest.id;
    document.getElementById('editQuestTitle').value = quest.title;
    document.getElementById('editQuestEnergy').value = quest.energy;

    const modal = document.getElementById('editQuestModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex-center');
    }
}

function closeEditQuestModal() {
    const modal = document.getElementById('editQuestModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex-center');
    }
}

function saveEditQuest() {
    const id = parseInt(document.getElementById('editQuestId').value, 10);
    const title = document.getElementById('editQuestTitle').value;
    const energy = document.getElementById('editQuestEnergy').value;

    if (!title.trim()) return;

    const questIndex = mockData.quests.findIndex(q => q.id === id);
    if (questIndex !== -1) {
        mockData.quests[questIndex].title = title;
        mockData.quests[questIndex].energy = energy;
    }

    closeEditQuestModal();
    renderQuests();
    showToast("Quest updated successfully✨");
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    render();
});
