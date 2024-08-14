// script.js

const users = JSON.parse(localStorage.getItem('users')) || [];
const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

const questions = [
    { question: "Which of the following is the capital of Arunachal Pradesh?", answers: ["Itanagar", "Dispur", "Imphal", "Panaji"], correct: 0 },
    { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1 },
    { question: "Which planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 1 },
    { question: "Which of the following states is not located in the North?", answers: ["Jharkhand", "Jammu and Kashmi", " Himachal Pradesh", "Haryana"], correct: 0 },
    { question: "What is the largest ocean on Earth?", answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], correct: 3 },
    { question: "Which state has the largest area?", answers: [" Maharashtra", "Madhya Pradesh", "Uttar Pradesh", " Rajasthan"], correct: 3 },
    { question: "Which city is known as the “summer capital” of Jammu and Kashmir?", answers: ["Jammu", "Srinagar", "Shimla", "Shimla"], correct: 0 }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 60;

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
}

function showSignup() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Sign Up Successful! Please log in.');
        showLogin();
    } else {
        alert('Please fill in all fields.');
    }
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        document.getElementById('auth').style.display = 'none';
        document.getElementById('quiz').style.display = 'block';
        startTimer();
        loadQuestion();
    } else {
        alert('Invalid credentials.');
    }
}

function startTimer() {
    timeLeft = 60;
    document.getElementById('time').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;

    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.onclick = () => checkAnswer(index);
        answersDiv.appendChild(button);
    });

    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = questions.length;
}

function checkAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const feedback = document.getElementById('feedback');
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');

    if (selectedIndex === question.correct) {
        score++;
        feedback.textContent = `Correct! ${question.explanation}`;
        feedback.className = 'correct';
        correctSound.play();
    } else {
        feedback.textContent = `Incorrect. ${question.explanation}`;
        feedback.className = 'incorrect';
        incorrectSound.play();
    }
    feedback.style.display = 'block';
    setTimeout(nextQuestion, 2000); // Show feedback for 2 seconds
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        document.getElementById('feedback').style.display = 'none';
    } else {
        showResult();
    }
}

function showResult() {
    clearInterval(timer);
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('score').textContent = score;

    // Save to leaderboard
    const username = document.getElementById('login-username').value;
    if (username) {
        leaderboard.push({ username, score });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    startTimer();
    loadQuestion();
}

function showLeaderboard() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboard.sort((a, b) => b.score - a.score).forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.username}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

function hideLeaderboard() {
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('result').style.display = 'block';
}

function clearLeaderboard() {
    if (confirm('Are you sure you want to clear the leaderboard?')) {
        localStorage.removeItem('leaderboard');
        leaderboard.length = 0; // Clear the array in memory
        showLeaderboard(); // Refresh the leaderboard view
    }
}