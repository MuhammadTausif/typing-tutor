// Unified App Logic - Integration of all modules

const appState = {
    currentView: 'dashboard',
    studentName: '',
    init() {
        this.loadStudent();
        this.setupNavigation();
        this.updateDashboard();
        // Initialize gamification
        if (typeof gamificationState !== 'undefined') {
            gamificationState.initialize(this.studentName || 'Student');
        }
    },
    
    loadStudent() {
        const saved = localStorage.getItem('appStudentName');
        if (saved) {
            this.studentName = saved;
            document.getElementById('studentName').value = saved;
        }
    },
    
    setupNavigation() {
        const input = document.getElementById('studentName');
        if (input) {
            input.addEventListener('change', (e) => {
                this.studentName = e.target.value || 'Student';
                localStorage.setItem('appStudentName', this.studentName);
                if (typeof gamificationState !== 'undefined') {
                    gamificationState.initialize(this.studentName);
                }
            });
        }
    },
    
    updateDashboard() {
        if (typeof gamificationState === 'undefined') return;
        const stats = gamificationState.getStats();
        if (!stats) return;
        
        const progress = document.getElementById('dashProgress');
        const bar = document.getElementById('dashProgressBar');
        const points = document.getElementById('dashPoints');
        const badges = document.getElementById('dashBadges');
        const streak = document.getElementById('dashStreak');
        
        if (progress) progress.textContent = `${stats.lessonsCompleted}/30`;
        if (bar) bar.style.width = `${(stats.lessonsCompleted / 30) * 100}%`;
        if (points) points.textContent = stats.totalPoints || 0;
        if (badges) badges.textContent = (stats.badgesByTier.bronze + stats.badgesByTier.silver + stats.badgesByTier.gold + stats.badgesByTier.platinum);
        if (streak) streak.textContent = `${stats.currentStreak || 0} 🔥`;
    }
};

function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Show selected view
    const viewEl = document.getElementById(`${viewName}-view`);
    if (viewEl) viewEl.classList.add('active');
    
    // Mark nav item active
    const navItem = document.querySelector(`[data-view="${viewName}"]`);
    if (navItem) navItem.classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        lessons: 'Lessons',
        gamification: 'Achievements',
        certificates: 'Certificates',
        teacher: 'Teacher Dashboard',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[viewName] || 'Dashboard';
    
    appState.currentView = viewName;
    
    // Load view-specific content
    loadViewContent(viewName);
}

function loadViewContent(viewName) {
    switch(viewName) {
        case 'dashboard':
            appState.updateDashboard();
            break;
        case 'lessons':
            loadLessonsView();
            break;
        case 'gamification':
            loadGamificationView();
            break;
        case 'certificates':
            loadCertificatesView();
            break;
        case 'teacher':
            loadTeacherView();
            break;
    }
}

function loadLessonsView() {
    if (typeof lessons === 'undefined') return;
    const container = document.getElementById('lessonsList');
    if (!container) return;
    
    container.innerHTML = '<h3>📚 Lessons</h3>' + lessons.slice(0, 15).map(lesson => `
        <div class="lesson-item" onclick="selectLesson(${lesson.id}); return false;" style="cursor: pointer; padding: 10px; background: var(--bg-lighter); margin: 8px 0; border-radius: 6px; border-left: 3px solid var(--accent);">
            <div style="font-weight: 600; color: var(--accent);">Lesson ${lesson.id}</div>
            <div style="font-size: 0.85rem; color: var(--text-dim);">${lesson.title}</div>
        </div>
    `).join('');
}

function loadGamificationView() {
    if (typeof gamificationState === 'undefined') return;
    const container = document.getElementById('gamificationDashboard');
    const dashboard = new GamificationDashboard('gamificationDashboard');
    const stats = gamificationState.getStats();
    if (stats) dashboard.render(stats);
}

function loadCertificatesView() {
    const container = document.getElementById('certificatesContainer');
    container.innerHTML = '<p style="color: var(--text-dim);">Complete lessons to earn certificates</p>';
}

function loadTeacherView() {
    if (typeof classData === 'undefined') return;
    const stats = classAnalytics.getClassStats();
    const html = `
        <div style="background: var(--bg-light); border: 2px solid var(--bg-lighter); border-radius: 12px; padding: 20px;">
            <h3 style="margin-bottom: 15px;">Class Statistics</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <div><strong>Students:</strong> ${stats.totalStudents}</div>
                <div><strong>Active Today:</strong> ${stats.activeToday}</div>
                <div><strong>Avg WPM:</strong> ${stats.averageWPM}</div>
                <div><strong>Avg Accuracy:</strong> ${stats.averageAccuracy}%</div>
            </div>
        </div>
    `;
    document.getElementById('teacherContent').innerHTML = html;
}

function selectLesson(lessonId) {
    if (typeof loadLesson === 'function') {
        loadLesson(lessonId);
        // Don't switch view, stay in lessons
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    appState.init();
    if (typeof certificateManager !== 'undefined') {
        certificateManager.loadFromStorage();
    }
    if (typeof classData !== 'undefined') {
        classData.loadFromStorage();
    }
});