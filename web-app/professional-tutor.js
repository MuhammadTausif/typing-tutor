// Professional Typing Tutor - Core Application Logic
// Phase 1: Lesson-Based Learning System

// ============================================================================
// LESSON DATA STRUCTURE
// ============================================================================

const lessons = [
    // LEVEL 1: FOUNDATION (HOME ROW)
    {
        id: 1,
        level: 1,
        levelName: "Foundation",
        title: "J and F Keys",
        keys: ["J", "F"],
        difficulty: 1,
        description: "Learn the anchor keys for typing - J with right index, F with left index",
        exercises: [
            { type: "repetition", text: "J J J J J J J J J J", instruction: "Press J key 10 times" },
            { type: "alternation", text: "J F J F J F J F J F", instruction: "Alternate between J and F" },
            { type: "combination", text: "jf fj jj ff jf fj ff jj", instruction: "Type key combinations" },
            { type: "words", text: "if of off jeff jest fist", instruction: "Type words using J and F" },
            { type: "sentence", text: "I like to jog. Jeff is off.", instruction: "Type complete sentences" }
        ],
        passingCriteria: { minWPM: 20, minAccuracy: 90 }
    },
    {
        id: 2,
        level: 1,
        levelName: "Foundation",
        title: "K and D Keys",
        keys: ["K", "D"],
        difficulty: 1,
        description: "Learn K with right middle finger and D with left middle finger",
        exercises: [
            { type: "repetition", text: "K K K K K K K K K K", instruction: "Press K key 10 times" },
            { type: "alternation", text: "K D K D K D K D K D", instruction: "Alternate between K and D" },
            { type: "combination", text: "kd dk kk dd kd dk dd kk", instruction: "Type key combinations" },
            { type: "words", text: "kid did add odd kids dike", instruction: "Type words using K and D" },
            { type: "sentence", text: "Kids like to add and divide.", instruction: "Type complete sentences" }
        ],
        passingCriteria: { minWPM: 20, minAccuracy: 90 }
    },
    {
        id: 3,
        level: 1,
        levelName: "Foundation",
        title: "L and S Keys",
        keys: ["L", "S"],
        difficulty: 1,
        description: "Learn L with right ring finger and S with left ring finger",
        exercises: [
            { type: "repetition", text: "L L L L L L L L L L", instruction: "Press L key 10 times" },
            { type: "alternation", text: "L S L S L S L S L S", instruction: "Alternate between L and S" },
            { type: "combination", text: "ls sl ll ss ls sl ss ll", instruction: "Type key combinations" },
            { type: "words", text: "list sail slip slid sail lies", instruction: "Type words using L and S" },
            { type: "sentence", text: "Lists and slides are useful.", instruction: "Type complete sentences" }
        ],
        passingCriteria: { minWPM: 20, minAccuracy: 90 }
    },
    {
        id: 4,
        level: 1,
        levelName: "Foundation",
        title: "A Key and Spacebar",
        keys: ["A", " "],
        difficulty: 1,
        description: "Learn A with left pinky and master the spacebar",
        exercises: [
            { type: "repetition", text: "A A A A A A A A A A", instruction: "Press A key 10 times" },
            { type: "words", text: "a add ask all are art and", instruction: "Type words with A" },
            { type: "combination", text: "a a a a a", instruction: "Type A key with spaces" },
            { type: "words", text: "add aid all ask aid are", instruction: "Type more A words" },
            { type: "sentence", text: "Add all are asked aids", instruction: "Type sentences with A" }
        ],
        passingCriteria: { minWPM: 20, minAccuracy: 90 }
    },
    {
        id: 5,
        level: 1,
        levelName: "Foundation",
        title: "Home Row Mastery",
        keys: ["J", "F", "K", "D", "L", "S", "A"],
        difficulty: 2,
        description: "Master all home row keys - complete review and integration",
        exercises: [
            { type: "combination", text: "jf kd ls a jf kd ls a", instruction: "Type all home row combinations" },
            { type: "words", text: "like disk fall jails slide silk asked flasks", instruction: "Type words using home row" },
            { type: "sentence", text: "I like to jog and fish daily.", instruction: "Type sentences with home row" },
            { type: "sentence", text: "Skilled folks ask for advice.", instruction: "Type more complex sentences" },
            { type: "paragraph", text: "All kids like to play. Jazz is fun. Skills develop daily.", instruction: "Type a paragraph" }
        ],
        passingCriteria: { minWPM: 30, minAccuracy: 95 }
    },

    // LEVEL 2: TOP ROW - Add lessons 6-11
    {
        id: 6,
        level: 2,
        levelName: "Top Row",
        title: "U and I Keys",
        keys: ["U", "I"],
        difficulty: 1,
        description: "Learn U and I keys on the top row",
        exercises: [
            { type: "repetition", text: "U U U U U U U U U U", instruction: "Press U key 10 times" },
            { type: "alternation", text: "U I U I U I U I U I", instruction: "Alternate between U and I" },
            { type: "combination", text: "ui iu uu ii ui iu ii uu", instruction: "Type key combinations" },
            { type: "words", text: "unit undo idea into unit", instruction: "Type words with U and I" },
            { type: "sentence", text: "I like unique ideas and units.", instruction: "Type complete sentences" }
        ],
        passingCriteria: { minWPM: 25, minAccuracy: 90 }
    },

    // Add more lessons as needed (7-30 follow same pattern)
    // For Phase 1, we'll add 6-11 and placeholder for rest
    {
        id: 7,
        level: 2,
        levelName: "Top Row",
        title: "O and P Keys",
        keys: ["O", "P"],
        difficulty: 1,
        description: "Learn O and P keys on the top row",
        exercises: [
            { type: "repetition", text: "O O O O O O O O O O", instruction: "Press O key 10 times" },
            { type: "alternation", text: "O P O P O P O P O P", instruction: "Alternate between O and P" },
            { type: "combination", text: "op po oo pp op po pp oo", instruction: "Type key combinations" },
            { type: "words", text: "open pipe pool post upon", instruction: "Type words with O and P" },
            { type: "sentence", text: "Open the pool and play.", instruction: "Type complete sentences" }
        ],
        passingCriteria: { minWPM: 25, minAccuracy: 90 }
    }
];

// Add placeholder lessons to reach 30
for (let i = 8; i <= 30; i++) {
    lessons.push({
        id: i,
        level: Math.ceil(i / 6),
        levelName: `Level ${Math.ceil(i / 6)}`,
        title: `Lesson ${i}`,
        keys: ["X"],
        difficulty: 1,
        description: `Lesson ${i} coming soon`,
        exercises: [
            { type: "repetition", text: "x x x x x x x x x x", instruction: "Practice lesson" }
        ],
        passingCriteria: { minWPM: 20, minAccuracy: 90 }
    });
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
    studentName: "",
    currentLessonId: 1,
    currentExerciseIndex: 0,
    typedText: "",
    startTime: null,
    isTyping: false,
    lessonAttempts: {},
    bestScores: {},
    completedLessons: new Set(),
    attempts: [],
    typedKeys: new Set()
};

// ============================================================================
// INITIALIZATION
// ============================================================================

window.addEventListener("DOMContentLoaded", () => {
    loadFromStorage();
    renderLessonsList();
    loadLesson(state.currentLessonId);
    setupEventListeners();
    updateProgressBar();
    renderVirtualKeyboard();
});

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

function saveToStorage() {
    const data = {
        studentName: state.studentName,
        currentLessonId: state.currentLessonId,
        currentExerciseIndex: state.currentExerciseIndex,
        completedLessons: Array.from(state.completedLessons),
        bestScores: state.bestScores,
        attempts: state.attempts
    };
    localStorage.setItem("velocityTutorData", JSON.stringify(data));
}

function loadFromStorage() {
    const saved = localStorage.getItem("velocityTutorData");
    if (saved) {
        const data = JSON.parse(saved);
        state.studentName = data.studentName || "";
        state.currentLessonId = data.currentLessonId || 1;
        state.currentExerciseIndex = data.currentExerciseIndex || 0;
        state.completedLessons = new Set(data.completedLessons || []);
        state.bestScores = data.bestScores || {};
        state.attempts = data.attempts || [];
        document.getElementById("studentName").value = state.studentName;
    }
}

// ============================================================================
// LESSON MANAGEMENT
// ============================================================================

function loadLesson(lessonId) {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    state.currentLessonId = lessonId;
    state.currentExerciseIndex = 0;
    state.typedText = "";

    // Update header
    document.getElementById("lessonTitle").textContent = `${lesson.id}. ${lesson.title}`;
    document.getElementById("currentLevel").textContent = `Level ${lesson.level}: ${lesson.levelName}`;
    document.getElementById("currentLessonDisplay").textContent = `Lesson ${lesson.id} of 30`;
    document.getElementById("keysDisplay").textContent = `Keys: ${lesson.keys.join(", ")}`;
    document.getElementById("difficultyStars").textContent = "★".repeat(lesson.difficulty) + "☆".repeat(5 - lesson.difficulty);

    // Load first exercise
    loadExercise(0);
    saveToStorage();
    renderVirtualKeyboard();
}

function loadExercise(index) {
    const lesson = lessons.find(l => l.id === state.currentLessonId);
    if (!lesson || index >= lesson.exercises.length) return;

    const exercise = lesson.exercises[index];
    state.currentExerciseIndex = index;
    state.typedText = "";
    state.startTime = null;
    state.isTyping = false;
    state.typedKeys.clear();

    // Update exercise display
    const exerciseTitles = ["Key Repetition", "Key Alternation", "Basic Combinations", "Common Words", "Sentences"];
    document.getElementById("exerciseTitle").textContent = `Exercise ${index + 1}: ${exerciseTitles[index] || "Practice"}`;
    document.getElementById("exerciseNum").textContent = index + 1;
    document.getElementById("exerciseInstruction").textContent = exercise.instruction;
    document.getElementById("exerciseText").textContent = exercise.text;

    // Clear input and stats
    const inputField = document.getElementById("userInput");
    inputField.value = "";
    inputField.disabled = false;
    inputField.focus();
    resetStats();

    document.getElementById("completeMsg").classList.remove("show");
    saveToStorage();
}

// ============================================================================
// EXERCISE EXECUTION
// ============================================================================

function setupEventListeners() {
    const inputField = document.getElementById("userInput");

    inputField.addEventListener("input", handleInput);
    inputField.addEventListener("focus", () => {
        document.getElementById("exerciseText").classList.add("active");
    });

    document.getElementById("startBtn").addEventListener("click", startExercise);
    document.getElementById("nextBtn").addEventListener("click", nextExercise);
    document.getElementById("retryBtn").addEventListener("click", retryExercise);
    document.getElementById("resetBtn").addEventListener("click", resetExercise);
    document.getElementById("nextLessonBtn").addEventListener("click", nextLesson);
    document.getElementById("reviewBtn").addEventListener("click", reviewLesson);

    document.getElementById("studentName").addEventListener("change", (e) => {
        state.studentName = e.target.value;
        saveToStorage();
    });
}

function handleInput(e) {
    const inputField = e.target;
    const lesson = lessons.find(l => l.id === state.currentLessonId);
    const exercise = lesson.exercises[state.currentExerciseIndex];
    const expectedText = exercise.text;

    if (!state.isTyping && inputField.value.length > 0) {
        state.isTyping = true;
        state.startTime = Date.now();
    }

    state.typedText = inputField.value;
    renderExerciseText(expectedText, state.typedText);
    updateStats(expectedText, state.typedText);

    // Track typed keys
    inputField.value.split("").forEach(char => {
        state.typedKeys.add(char.toUpperCase());
    });
    renderVirtualKeyboard();

    // Check if exercise is complete
    if (state.typedText === expectedText && state.typedText.length > 0) {
        completeExercise();
    }
}

function renderExerciseText(expected, typed) {
    const container = document.getElementById("exerciseText");
    container.innerHTML = "";

    expected.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.className = "char";

        if (i < typed.length) {
            if (typed[i] === char) {
                span.className = "char correct";
            } else {
                span.className = "char incorrect";
            }
        } else if (i === typed.length) {
            span.className = "char current";
        } else {
            span.className = "char pending";
        }

        span.textContent = char;
        container.appendChild(span);
    });

    // Auto-scroll to current character
    const currentChar = container.querySelector(".char.current");
    if (currentChar) {
        currentChar.scrollIntoView({ block: "center", behavior: "smooth" });
    }
}

function updateStats(expected, typed) {
    if (!state.startTime) return;

    const timeElapsed = (Date.now() - state.startTime) / 1000;
    const timeInMinutes = timeElapsed / 60;
    const wordsTyped = typed.trim().split(/\s+/).length;
    const wpm = Math.round(wordsTyped / timeInMinutes) || 0;

    let correctChars = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === expected[i]) correctChars++;
    }

    const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
    const errors = typed.length - correctChars;

    document.getElementById("wpm").textContent = wpm;
    document.getElementById("accuracy").textContent = accuracy + "%";
    document.getElementById("errors").textContent = errors;
    document.getElementById("time").textContent = Math.floor(timeElapsed) + "s";

    return { wpm, accuracy, errors, timeElapsed };
}

function resetStats() {
    document.getElementById("wpm").textContent = "0";
    document.getElementById("accuracy").textContent = "100%";
    document.getElementById("errors").textContent = "0";
    document.getElementById("time").textContent = "0s";
}

function completeExercise() {
    state.isTyping = false;
    document.getElementById("completeMsg").classList.add("show");
    document.getElementById("userInput").disabled = true;

    const lesson = lessons.find(l => l.id === state.currentLessonId);
    if (state.currentExerciseIndex === lesson.exercises.length - 1) {
        // Last exercise - show lesson results
        setTimeout(() => {
            showLessonResults();
        }, 1000);
    }
}

function showLessonResults() {
    const lesson = lessons.find(l => l.id === state.currentLessonId);
    const stats = updateStats(lesson.exercises[state.currentExerciseIndex].text, state.typedText);

    document.getElementById("resultWPM").textContent = stats.wpm;
    document.getElementById("resultAccuracy").textContent = stats.accuracy + "%";
    document.getElementById("resultErrors").textContent = stats.errors;
    document.getElementById("resultTime").textContent = Math.ceil(stats.timeElapsed) + "s";

    let feedback = "";
    if (stats.accuracy >= 95 && stats.wpm >= lesson.passingCriteria.minWPM) {
        feedback = "🎉 Excellent! You've mastered this lesson. Ready for the next one?";
        state.completedLessons.add(lesson.id);
    } else if (stats.accuracy >= 90) {
        feedback = "✓ Good job! Try again to improve your speed.";
    } else {
        feedback = "Keep practicing! Focus on accuracy first.";
    }

    document.getElementById("feedbackMsg").textContent = feedback;
    document.getElementById("resultsModal").classList.add("show");

    // Store attempt
    state.attempts.push({
        lessonId: lesson.id,
        exerciseIndex: state.currentExerciseIndex,
        ...stats,
        accuracy: stats.accuracy,
        timestamp: new Date().toISOString()
    });

    saveToStorage();
}

// ============================================================================
// NAVIGATION
// ============================================================================

function startExercise() {
    const inputField = document.getElementById("userInput");
    inputField.focus();
}

function nextExercise() {
    const lesson = lessons.find(l => l.id === state.currentLessonId);
    if (state.currentExerciseIndex < lesson.exercises.length - 1) {
        loadExercise(state.currentExerciseIndex + 1);
    }
}

function retryExercise() {
    loadExercise(state.currentExerciseIndex);
}

function resetExercise() {
    state.typedText = "";
    state.startTime = null;
    state.isTyping = false;
    state.typedKeys.clear();
    document.getElementById("userInput").value = "";
    document.getElementById("userInput").disabled = false;
    document.getElementById("userInput").focus();
    resetStats();
    renderExerciseText(lessons.find(l => l.id === state.currentLessonId).exercises[state.currentExerciseIndex].text, "");
    renderVirtualKeyboard();
    document.getElementById("completeMsg").classList.remove("show");
}

function nextLesson() {
    if (state.currentLessonId < 30) {
        loadLesson(state.currentLessonId + 1);
        document.getElementById("resultsModal").classList.remove("show");
        updateProgressBar();
    }
}

function reviewLesson() {
    loadExercise(0);
    document.getElementById("resultsModal").classList.remove("show");
}

// ============================================================================
// UI RENDERING
// ============================================================================

function renderLessonsList() {
    const container = document.getElementById("lessonsList");
    container.innerHTML = "";

    lessons.forEach(lesson => {
        const div = document.createElement("div");
        div.className = "lesson-item";
        if (lesson.id === state.currentLessonId) div.classList.add("active");

        const completed = state.completedLessons.has(lesson.id);
        const icon = completed ? "✓" : "○";

        div.innerHTML = `
            <div class="lesson-num">${icon} Lesson ${lesson.id}</div>
            <div class="lesson-title">${lesson.title}</div>
            <div class="lesson-keys">${lesson.keys.join(" ")}</div>
        `;

        div.addEventListener("click", () => {
            loadLesson(lesson.id);
            updateProgressBar();
        });

        container.appendChild(div);
    });
}

function renderVirtualKeyboard() {
    const container = document.getElementById("keyboard");
    container.innerHTML = "";

    const lesson = lessons.find(l => l.id === state.currentLessonId);
    const lessonKeys = new Set(lesson.keys.map(k => k.toUpperCase()));

    const keyboardRows = [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M"]
    ];

    keyboardRows.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "key-row";

        row.forEach(key => {
            const keyDiv = document.createElement("div");
            keyDiv.className = "key";
            keyDiv.textContent = key;

            if (lessonKeys.has(key)) {
                keyDiv.classList.add("current-lesson");
            }
            if (state.typedKeys.has(key)) {
                keyDiv.classList.add("typed-correct");
            }

            rowDiv.appendChild(keyDiv);
        });

        container.appendChild(rowDiv);
    });
}

function updateProgressBar() {
    const completed = state.completedLessons.size;
    const total = lessons.length;
    const percentage = Math.round((completed / total) * 100);

    document.getElementById("progressText").textContent = `${completed} / ${total} Lessons`;
    document.getElementById("progressFill").style.width = percentage + "%";
    document.getElementById("progressPercent").textContent = percentage + "%";

    // Update best WPM and avg accuracy
    if (state.attempts.length > 0) {
        const bestWPM = Math.max(...state.attempts.map(a => a.wpm));
        const avgAccuracy = Math.round(state.attempts.reduce((sum, a) => sum + a.accuracy, 0) / state.attempts.length);
        document.getElementById("bestWPM").textContent = bestWPM;
        document.getElementById("avgAccuracy").textContent = avgAccuracy + "%";
    }
}
