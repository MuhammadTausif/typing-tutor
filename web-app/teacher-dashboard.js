// Teacher Dashboard - Phase 3
// Class management, student monitoring, analytics, reports

// ============================================================================
// CLASS DATA MANAGEMENT
// ============================================================================

const classData = {
    className: "Class Period 1",
    students: [],
    reports: [],

    initialize(name = "Class Period 1") {
        this.className = name;
        document.getElementById("className").textContent = name;
        this.loadFromStorage();
    },

    addStudent(student) {
        const newStudent = {
            id: student.id || `STU${Date.now()}`,
            name: student.name,
            lessonsCompleted: 0,
            bestWPM: 0,
            averageAccuracy: 0,
            totalPoints: 0,
            badges: 0,
            joinDate: new Date().toISOString(),
            attempts: [],
            lastActivity: null
        };
        this.students.push(newStudent);
        this.saveToStorage();
        return newStudent;
    },

    removeStudent(studentId) {
        this.students = this.students.filter(s => s.id !== studentId);
        this.saveToStorage();
    },

    getStudent(studentId) {
        return this.students.find(s => s.id === studentId);
    },

    updateStudent(studentId, updates) {
        const student = this.getStudent(studentId);
        if (student) {
            Object.assign(student, updates);
            this.saveToStorage();
        }
        return student;
    },

    saveToStorage() {
        const data = {
            className: this.className,
            students: this.students,
            reports: this.reports,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem("teacherDashboard", JSON.stringify(data));
    },

    loadFromStorage() {
        const saved = localStorage.getItem("teacherDashboard");
        if (saved) {
            const data = JSON.parse(saved);
            this.className = data.className || this.className;
            this.students = data.students || [];
            this.reports = data.reports || [];
            document.getElementById("className").textContent = this.className;
        }
    }
};

// ============================================================================
// ANALYTICS ENGINE
// ============================================================================

const classAnalytics = {
    getClassStats() {
        const students = classData.students;
        
        if (students.length === 0) {
            return {
                totalStudents: 0,
                activeToday: 0,
                averageWPM: 0,
                averageAccuracy: 0,
                totalLessonsCompleted: 0
            };
        }

        const today = new Date().toDateString();
        const activeToday = students.filter(s => 
            s.lastActivity && new Date(s.lastActivity).toDateString() === today
        ).length;

        const totalWPM = students.reduce((sum, s) => sum + (s.bestWPM || 0), 0);
        const avgWPM = Math.round(totalWPM / students.length);

        const totalAccuracy = students.reduce((sum, s) => sum + (s.averageAccuracy || 0), 0);
        const avgAccuracy = Math.round(totalAccuracy / students.length);

        const totalLessons = students.reduce((sum, s) => sum + (s.lessonsCompleted || 0), 0);

        return {
            totalStudents: students.length,
            activeToday,
            averageWPM: avgWPM,
            averageAccuracy: avgAccuracy,
            totalLessonsCompleted: totalLessons,
            classTotal: students.length
        };
    },

    getTopPerformers(limit = 5) {
        return classData.students
            .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
            .slice(0, limit)
            .map((student, index) => ({
                rank: index + 1,
                name: student.name,
                points: student.totalPoints || 0,
                wpm: student.bestWPM || 0,
                accuracy: student.averageAccuracy || 0,
                lessons: student.lessonsCompleted || 0
            }));
    },

    getProgressDistribution() {
        const dist = {
            0: 0,
            5: 0,
            10: 0,
            15: 0,
            20: 0,
            25: 0,
            30: 0
        };

        classData.students.forEach(student => {
            const lessons = student.lessonsCompleted || 0;
            if (lessons === 0) dist[0]++;
            else if (lessons <= 5) dist[5]++;
            else if (lessons <= 10) dist[10]++;
            else if (lessons <= 15) dist[15]++;
            else if (lessons <= 20) dist[20]++;
            else if (lessons <= 25) dist[25]++;
            else dist[30]++;
        });

        return dist;
    },

    getAccuracyDistribution() {
        const dist = {
            "80-85": 0,
            "85-90": 0,
            "90-95": 0,
            "95-98": 0,
            "98-100": 0
        };

        classData.students.forEach(student => {
            const acc = student.averageAccuracy || 0;
            if (acc < 85) dist["80-85"]++;
            else if (acc < 90) dist["85-90"]++;
            else if (acc < 95) dist["90-95"]++;
            else if (acc < 98) dist["95-98"]++;
            else dist["98-100"]++;
        });

        return dist;
    },

    getWPMDistribution() {
        const dist = {
            "0-30": 0,
            "30-50": 0,
            "50-70": 0,
            "70-90": 0,
            "90+": 0
        };

        classData.students.forEach(student => {
            const wpm = student.bestWPM || 0;
            if (wpm < 30) dist["0-30"]++;
            else if (wpm < 50) dist["30-50"]++;
            else if (wpm < 70) dist["50-70"]++;
            else if (wpm < 90) dist["70-90"]++;
            else dist["90+"]++;
        });

        return dist;
    }
};

// ============================================================================
// REPORT GENERATION
// ============================================================================

const reportEngine = {
    generateClassReport() {
        const stats = classAnalytics.getClassStats();
        const topPerformers = classAnalytics.getTopPerformers();

        const report = {
            type: "class",
            title: `Class Report - ${classData.className}`,
            generatedDate: new Date().toISOString(),
            data: {
                totalStudents: stats.totalStudents,
                activeToday: stats.activeToday,
                averageWPM: stats.averageWPM,
                averageAccuracy: stats.averageAccuracy,
                totalLessonsCompleted: stats.totalLessonsCompleted,
                topPerformers: topPerformers
            }
        };

        return report;
    },

    generateStudentReport(studentId) {
        const student = classData.getStudent(studentId);
        if (!student) return null;

        const report = {
            type: "student",
            title: `Student Report - ${student.name}`,
            generatedDate: new Date().toISOString(),
            data: {
                name: student.name,
                id: student.id,
                lessonsCompleted: student.lessonsCompleted,
                bestWPM: student.bestWPM,
                averageAccuracy: student.averageAccuracy,
                totalPoints: student.totalPoints,
                badges: student.badges,
                joinDate: student.joinDate,
                lastActivity: student.lastActivity,
                attemptCount: student.attempts ? student.attempts.length : 0
            }
        };

        return report;
    },

    generateAchievementReport() {
        const report = {
            type: "achievement",
            title: `Achievement Report - ${classData.className}`,
            generatedDate: new Date().toISOString(),
            data: {
                totalBadges: classData.students.reduce((sum, s) => sum + (s.badges || 0), 0),
                studentBadges: classData.students
                    .filter(s => (s.badges || 0) > 0)
                    .map(s => ({ name: s.name, badges: s.badges }))
                    .sort((a, b) => b.badges - a.badges)
            }
        };

        return report;
    },

    generateTrendReport() {
        const report = {
            type: "trend",
            title: `Trend Analysis - ${classData.className}`,
            generatedDate: new Date().toISOString(),
            data: {
                progressDistribution: classAnalytics.getProgressDistribution(),
                accuracyDistribution: classAnalytics.getAccuracyDistribution(),
                wpmDistribution: classAnalytics.getWPMDistribution()
            }
        };

        return report;
    }
};

// ============================================================================
// UI FUNCTIONS
// ============================================================================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Mark button active
    event.target.classList.add('active');

    // Refresh tab content
    if (tabName === 'overview') refreshOverview();
    else if (tabName === 'students') refreshStudents();
    else if (tabName === 'analytics') refreshAnalytics();
    else if (tabName === 'reports') refreshReports();
}

function refreshOverview() {
    const stats = classAnalytics.getClassStats();
    const topPerformers = classAnalytics.getTopPerformers(5);

    document.getElementById('totalStudents').textContent = stats.totalStudents;
    document.getElementById('activeToday').textContent = stats.activeToday;
    document.getElementById('avgWPM').textContent = stats.averageWPM;
    document.getElementById('avgAccuracy').textContent = stats.averageAccuracy + '%';

    let topHTML = '<div style="background: var(--bg-light); border: 2px solid var(--bg-lighter); border-radius: 12px; padding: 15px;">';
    if (topPerformers.length === 0) {
        topHTML += '<p style="color: var(--text-dim);">No students yet</p>';
    } else {
        topPerformers.forEach(student => {
            topHTML += `
                <div style="padding: 10px 0; border-bottom: 1px solid var(--bg-lighter); display: flex; justify-content: space-between;">
                    <span><strong>#${student.rank} ${student.name}</strong></span>
                    <span style="color: var(--accent);">${student.points} pts | ${student.wpm} WPM</span>
                </div>
            `;
        });
    }
    topHTML += '</div>';

    document.getElementById('topPerformers').innerHTML = topHTML;
    updateLastUpdate();
}

function refreshStudents() {
    const tbody = document.getElementById('studentsTableBody');
    const searchTerm = document.getElementById('searchStudent')?.value.toLowerCase() || '';

    const filteredStudents = classData.students.filter(s => 
        s.name.toLowerCase().includes(searchTerm)
    );

    if (filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-dim);">No students found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredStudents.map(student => `
        <tr>
            <td><span class="student-name">${student.name}</span></td>
            <td>${student.lessonsCompleted}/30</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(student.lessonsCompleted / 30) * 100}%"></div>
                </div>
            </td>
            <td><span class="badge-small">${student.bestWPM} WPM</span></td>
            <td><span class="badge-small">${student.averageAccuracy}%</span></td>
            <td><strong>${student.totalPoints}</strong></td>
            <td>
                <button class="btn" style="padding: 6px 12px; font-size: 0.85rem;" onclick="viewStudentDetails('${student.id}')">View</button>
            </td>
        </tr>
    `).join('');

    updateLastUpdate();
}

function refreshAnalytics() {
    // Chart placeholders - can be integrated with Chart.js or similar
    updateLastUpdate();
}

function refreshReports() {
    const tbody = document.getElementById('reportsTableBody');
    
    if (classData.reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-dim);">No reports generated yet</td></tr>';
        return;
    }

    tbody.innerHTML = classData.reports.map(report => `
        <tr>
            <td style="text-transform: capitalize;">${report.type} Report</td>
            <td>${new Date(report.generatedDate).toLocaleDateString()}</td>
            <td>${JSON.stringify(report.data).substring(0, 50)}...</td>
            <td>
                <button class="btn" style="padding: 6px 12px; font-size: 0.85rem;" onclick="viewReport('${report.type}')">View</button>
            </td>
        </tr>
    `).join('');

    updateLastUpdate();
}

function openAddStudent() {
    document.getElementById('addStudentModal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function addStudent() {
    const name = document.getElementById('studentNameInput').value.trim();
    const id = document.getElementById('studentIdInput').value.trim();

    if (!name) {
        alert('Please enter student name');
        return;
    }

    classData.addStudent({ name, id });
    refreshStudents();
    closeModal('addStudentModal');
    document.getElementById('studentNameInput').value = '';
    document.getElementById('studentIdInput').value = '';
}

function viewStudentDetails(studentId) {
    const student = classData.getStudent(studentId);
    if (!student) return;

    const html = `
        <div style="background: var(--bg-lighter); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>Joined:</strong> ${new Date(student.joinDate).toLocaleDateString()}</p>
            <p><strong>Last Activity:</strong> ${student.lastActivity ? new Date(student.lastActivity).toLocaleString() : 'Never'}</p>
        </div>

        <div style="background: var(--bg-lighter); padding: 15px; border-radius: 8px;">
            <h4 style="margin-bottom: 10px;">Performance</h4>
            <p><strong>Lessons Completed:</strong> ${student.lessonsCompleted}/30</p>
            <p><strong>Best WPM:</strong> ${student.bestWPM}</p>
            <p><strong>Average Accuracy:</strong> ${student.averageAccuracy}%</p>
            <p><strong>Total Points:</strong> ${student.totalPoints}</p>
            <p><strong>Badges Earned:</strong> ${student.badges}</p>
        </div>
    `;

    document.getElementById('detailsTitle').textContent = `${student.name} - Details`;
    document.getElementById('detailsContent').innerHTML = html;
    document.getElementById('studentDetailsModal').classList.add('show');
}

function exportStudents() {
    if (classData.students.length === 0) {
        alert('No students to export');
        return;
    }

    let csv = 'Name,ID,Lessons,Best WPM,Accuracy,Points,Badges\n';
    classData.students.forEach(s => {
        csv += `${s.name},${s.id},${s.lessonsCompleted},${s.bestWPM},${s.averageAccuracy},${s.totalPoints},${s.badges}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-data-${new Date().toLocaleDateString()}.csv`;
    a.click();
}

function generateReport() {
    const type = document.getElementById('reportType').value;
    let report;

    switch (type) {
        case 'class':
            report = reportEngine.generateClassReport();
            break;
        case 'student':
            if (classData.students.length === 0) {
                alert('No students to report on');
                return;
            }
            report = reportEngine.generateStudentReport(classData.students[0].id);
            break;
        case 'achievement':
            report = reportEngine.generateAchievementReport();
            break;
        case 'trend':
            report = reportEngine.generateTrendReport();
            break;
    }

    if (report) {
        classData.reports.push(report);
        classData.saveToStorage();
        refreshReports();
        alert('Report generated successfully!');
    }
}

function viewReport(reportType) {
    const report = classData.reports.find(r => r.type === reportType);
    if (!report) return;

    let html = `<h4>${report.title}</h4>`;
    html += `<p style="color: var(--text-dim);">Generated: ${new Date(report.generatedDate).toLocaleString()}</p>`;
    html += `<pre style="background: var(--bg); padding: 10px; border-radius: 6px; overflow-x: auto;">`;
    html += JSON.stringify(report.data, null, 2);
    html += `</pre>`;

    document.getElementById('detailsContent').innerHTML = html;
    document.getElementById('studentDetailsModal').classList.add('show');
}

function printReport() {
    window.print();
}

function updateLastUpdate() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    classData.initialize("Class Period 1");
    refreshOverview();
});
