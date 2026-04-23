// ============ BACKEND CONFIGURATION ============
const API_URL = 'https://mbti-backend-rose.onrender.com/api';

// ============ AUTHENTICATION ============

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!token && !['login.html', 'register.html', 'index.html'].includes(currentPage)) {
        alert('Please login first!');
        window.location.href = 'login.html';
    }
    
    if (token && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Handle Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                alert(data.msg || 'Login failed');
            }
        } catch (err) {
            alert('Connection error. Make sure backend is running on port 5000');
        }
    });
}

// Handle Register
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                alert(data.msg || 'Registration failed');
            }
        } catch (err) {
            alert('Connection error. Make sure backend is running on port 5000');
        }
    });
}

// Handle Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('mbtiResult');
        localStorage.removeItem('mbtiAnswers');
        window.location.href = 'index.html';
    });
}

// Display user name
function displayUserName() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const userNameElements = document.querySelectorAll('#userName, #userNameDisplay');
        userNameElements.forEach(el => {
            el.textContent = user.name;
        });
    }
}

// ============ CELEBRITY MATCH FUNCTION ============

function getCelebrityMatch(personalityType) {
    const celebrities = {
        'INFJ': {
            name: 'Martin Luther King Jr.',
            emoji: '🕊️',
            title: 'Civil Rights Leader',
            quote: '"Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that."',
            funFact: 'INFJ is one of the rarest personality types (only 1-2% of population)',
            famousWorks: 'Civil Rights Movement, "I Have a Dream"',
            matchReason: 'You share the INFJ traits of idealism, vision, and deep commitment to helping others.'
        },
        'INTJ': {
            name: 'Elon Musk',
            emoji: '🚀',
            title: 'CEO of Tesla & SpaceX',
            quote: '"When something is important enough, you do it even if the odds are not in your favor."',
            funFact: 'INTJs are known as "The Architects" - strategic masterminds',
            famousWorks: 'Tesla, SpaceX, Neuralink',
            matchReason: 'You share the INTJ traits of strategic thinking, innovation, and big vision.'
        },
        'ENFP': {
            name: 'Robin Williams',
            emoji: '🎭',
            title: 'Actor & Comedian',
            quote: '"No matter what people tell you, words and ideas can change the world."',
            funFact: 'ENFPs are natural entertainers who love connecting with people',
            famousWorks: 'Mrs. Doubtfire, Aladdin, Good Will Hunting',
            matchReason: 'You share the ENFP traits of enthusiasm, creativity, and ability to inspire others.'
        },
        'ENTJ': {
            name: 'Steve Jobs',
            emoji: '🍎',
            title: 'Co-founder of Apple',
            quote: '"Stay hungry, stay foolish."',
            funFact: 'ENTJs are born leaders who excel at organizing people',
            famousWorks: 'iPhone, Mac, iPad, Pixar',
            matchReason: 'You share the ENTJ traits of leadership, determination, and revolutionary thinking.'
        },
        'INFP': {
            name: 'William Shakespeare',
            emoji: '📜',
            title: 'Playwright & Poet',
            quote: '"To thine own self be true."',
            funFact: 'INFPs are idealistic dreamers who value authenticity',
            famousWorks: 'Romeo & Juliet, Hamlet, Macbeth',
            matchReason: 'You share the INFP traits of creativity, deep emotions, and artistic expression.'
        },
        'ISTJ': {
            name: 'Queen Elizabeth II',
            emoji: '👑',
            title: 'Former Queen of UK',
            quote: '"I declare before you all that my whole life shall be devoted to your service."',
            funFact: 'ISTJs are "The Logisticians" - practical and fact-minded',
            famousWorks: '70 years of dedicated service',
            matchReason: 'You share the ISTJ traits of duty, reliability, and respect for tradition.'
        },
        'ENFJ': {
            name: 'Oprah Winfrey',
            emoji: '🎙️',
            title: 'Media Executive',
            quote: '"The biggest adventure you can take is to live the life of your dreams."',
            funFact: 'ENFJs are charismatic helpers who inspire others',
            famousWorks: 'The Oprah Winfrey Show, OWN Network',
            matchReason: 'You share the ENFJ traits of empathy, inspiration, and desire to help others.'
        },
        'INTP': {
            name: 'Albert Einstein',
            emoji: '⚛️',
            title: 'Theoretical Physicist',
            quote: '"Imagination is more important than knowledge."',
            funFact: 'INTPs are innovative inventors with thirst for knowledge',
            famousWorks: 'Theory of Relativity, E=mc²',
            matchReason: 'You share the INTP traits of logical thinking, curiosity, and love for complex theories.'
        },
        'ESTP': {
            name: 'Tom Cruise',
            emoji: '🎬',
            title: 'Actor & Producer',
            quote: '"I feel like I have the chance to do something special every day."',
            funFact: 'ESTPs are energetic risk-takers who live in the moment',
            famousWorks: 'Mission Impossible, Top Gun',
            matchReason: 'You share the ESTP traits of boldness, energy, and love for action.'
        },
        'ESFJ': {
            name: 'Taylor Swift',
            emoji: '🎤',
            title: 'Singer-Songwriter',
            quote: '"Just be yourself, there is no one better."',
            funFact: 'ESFJs are caring, social, and community-focused helpers',
            famousWorks: 'Shake It Off, Blank Space, Anti-Hero',
            matchReason: 'You share the ESFJ traits of warmth, loyalty, and desire to connect with others.'
        },
        'ISTP': {
            name: 'Bruce Lee',
            emoji: '🥋',
            title: 'Martial Artist',
            quote: '"Be water, my friend."',
            funFact: 'ISTPs are flexible, observant, and practical problem-solvers',
            famousWorks: 'Enter the Dragon, Jeet Kune Do',
            matchReason: 'You share the ISTP traits of adaptability, hands-on skills, and calm under pressure.'
        },
        'ISFP': {
            name: 'Michael Jackson',
            emoji: '🎵',
            title: 'King of Pop',
            quote: '"Just do your best and forget the rest."',
            funFact: 'ISFPs are gentle, sensitive, and artistic souls',
            famousWorks: 'Thriller, Billie Jean, Beat It',
            matchReason: 'You share the ISFP traits of artistic expression, sensitivity, and creativity.'
        },
        'ESTJ': {
            name: 'Michelle Obama',
            emoji: '👩‍⚖️',
            title: 'Former First Lady',
            quote: '"When they go low, we go high."',
            funFact: 'ESTJs are efficient, organized, and decisive executives',
            famousWorks: 'Let\'s Move! campaign, Becoming',
            matchReason: 'You share the ESTJ traits of leadership, organization, and getting things done.'
        },
        'ESFP': {
            name: 'Will Smith',
            emoji: '🎬',
            title: 'Actor & Rapper',
            quote: '"Don\'t let fear make your decisions for you."',
            funFact: 'ESFPs are spontaneous, energetic, and social entertainers',
            famousWorks: 'Men in Black, Fresh Prince, Aladdin',
            matchReason: 'You share the ESFP traits of energy, spontaneity, and love for entertaining.'
        },
        'ENTP': {
            name: 'Mark Twain',
            emoji: '📖',
            title: 'Author & Humorist',
            quote: '"Never let school interfere with your education."',
            funFact: 'ENTPs are smart, curious, and intellectual debaters',
            famousWorks: 'Huckleberry Finn, Tom Sawyer',
            matchReason: 'You share the ENTP traits of wit, curiosity, and love for intellectual debates.'
        }
    };
    
    return celebrities[personalityType] || {
        name: 'You!',
        emoji: '🌟',
        title: 'Unique Individual',
        quote: '"Be yourself; everyone else is already taken." - Oscar Wilde',
        funFact: 'Every personality type is special and valuable!',
        famousWorks: 'Your own amazing life story',
        matchReason: 'You have a unique combination of traits that makes you special!'
    };
}

// ============ SHARE FUNCTIONS (Facebook, Twitter, WhatsApp) ============

function shareOnFacebook() {
    const result = JSON.parse(localStorage.getItem('mbtiResult')) || {};
    const personalityType = result.type || 'Unknown';
    const personalityName = result.name || 'Amazing Personality';
    const shareText = `🎉 I got ${personalityType} - ${personalityName} personality type! 🧠\n\nTake the MBTI test and discover your personality type too! ✨`;
    const shareUrl = window.location.origin + '/mbti-test.html';
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const result = JSON.parse(localStorage.getItem('mbtiResult')) || {};
    const personalityType = result.type || 'Unknown';
    const personalityName = result.name || 'Amazing Personality';
    const shareText = `🎉 I got ${personalityType} - ${personalityName} personality type! 🧠 Discover your personality type too! ✨`;
    const shareUrl = window.location.origin + '/mbti-test.html';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp() {
    const result = JSON.parse(localStorage.getItem('mbtiResult')) || {};
    const personalityType = result.type || 'Unknown';
    const personalityName = result.name || 'Amazing Personality';
    const shareText = `🎉 I got ${personalityType} - ${personalityName} personality type! 🧠 Take the test here: `;
    const shareUrl = window.location.origin + '/mbti-test.html';
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
}

function copyShareLink() {
    const shareUrl = window.location.origin + '/mbti-test.html';
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('✅ Link copied! Share it with your friends 🎉');
    }).catch(() => {
        alert('❌ Failed to copy link');
    });
}

// Make share functions global
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnWhatsApp = shareOnWhatsApp;
window.copyShareLink = copyShareLink;

// ============ DASHBOARD ============
function loadDashboard() {
    if (!window.location.pathname.includes('dashboard.html')) return;
    displayUserName();
    loadMBTIStatus();
    loadMoodData();
    loadSuggestions();
    loadMoodChart();
    loadRecentActivity();
}

async function loadMBTIStatus() {
    const token = localStorage.getItem('token');
    const personalityDiv = document.getElementById('personalityInfo');
    const mbtiStatus = document.getElementById('mbtiStatus');
    
    if (!token) return;
    
    try {
        const response = await fetch(`${API_URL}/mbti/my-result`, {
            headers: { 'x-auth-token': token }
        });
        
        if (!response.ok) {
            throw new Error('No MBTI result found');
        }
        
        const data = await response.json();
        
        if (data && data.type) {
            if (mbtiStatus) mbtiStatus.textContent = `${data.type} - ${data.name}`;
            if (personalityDiv) {
                personalityDiv.innerHTML = `
                    <div class="personality-result">
                        <h3 style="color:var(--primary); margin-bottom:10px;">${data.type} - ${data.name}</h3>
                        <p>${data.description || 'You have completed the MBTI test!'}</p>
                        <a href="mbti-test.html" class="btn-outline-small" style="margin-top:15px; border-color:var(--primary); color:var(--primary);">Retake Test</a>
                    </div>
                `;
            }
        } else {
            showNoMBTIStatus(mbtiStatus, personalityDiv);
        }
    } catch (err) {
        console.log('Error loading MBTI status:', err);
        showNoMBTIStatus(mbtiStatus, personalityDiv);
    }
}

function showNoMBTIStatus(mbtiStatus, personalityDiv) {
    if (mbtiStatus) mbtiStatus.textContent = 'Not Taken';
    if (personalityDiv) {
        personalityDiv.innerHTML = `
            <p class="empty-state">You haven't taken the MBTI test yet.</p>
            <a href="mbti-test.html" class="btn-outline-small">Start MBTI Test</a>
        `;
    }
}

async function loadMoodData() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_URL}/mood/my-moods`, {
            headers: { 'x-auth-token': token }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch moods');
        }
        
        const moods = await response.json();
        
        const totalEntries = document.getElementById('totalEntries');
        if (totalEntries) totalEntries.textContent = moods?.length || 0;
        
        let streak = 0;
        if (moods && moods.length > 0) {
            const today = new Date().toDateString();
            const lastMoodDate = new Date(moods[0].date).toDateString();
            
            if (lastMoodDate === today) {
                streak = 1;
                for (let i = 1; i < moods.length; i++) {
                    const prevDate = new Date(moods[i-1].date);
                    const currDate = new Date(moods[i].date);
                    const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }
        
        const moodStreak = document.getElementById('moodStreak');
        if (moodStreak) moodStreak.textContent = streak;
        
    } catch (err) {
        console.log('Error loading mood data:', err);
    }
}

async function loadSuggestions() {
    const token = localStorage.getItem('token');
    const suggestionsDiv = document.getElementById('suggestionsList');
    
    if (!suggestionsDiv) return;
    
    try {
        const response = await fetch(`${API_URL}/suggestions/my-suggestions`, {
            headers: { 'x-auth-token': token }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch suggestions');
        }
        
        const suggestions = await response.json();
        
        if (suggestions && suggestions.length > 0) {
            suggestionsDiv.innerHTML = suggestions.map(s => `
                <div class="suggestion-item" style="border-left-color: ${s.color || '#8b5cf6'}">
                    <h4>${s.icon || '💡'} ${s.title}</h4>
                    <p>${s.description}</p>
                </div>
            `).join('');
        } else {
            suggestionsDiv.innerHTML = '<p class="empty-state">✨ Take the MBTI test for personalized suggestions!</p>';
        }
    } catch (err) {
        suggestionsDiv.innerHTML = '<p class="empty-state">✨ Complete MBTI test to get suggestions!</p>';
    }
}

async function loadRecentActivity() {
    const token = localStorage.getItem('token');
    const activityDiv = document.getElementById('recentActivities');
    
    if (!activityDiv) return;
    
    try {
        const [mbtiRes, moodRes] = await Promise.all([
            fetch(`${API_URL}/mbti/my-result`, { headers: { 'x-auth-token': token } }),
            fetch(`${API_URL}/mood/my-moods`, { headers: { 'x-auth-token': token } })
        ]);
        
        const mbti = mbtiRes.ok ? await mbtiRes.json() : null;
        const moods = moodRes.ok ? await moodRes.json() : [];
        
        let activities = [];
        
        if (mbti && mbti.type) {
            activities.push(`🎯 Completed MBTI Test - ${mbti.type}`);
        }
        
        if (moods && moods.length > 0) {
            const lastMood = moods[0];
            activities.push(`😊 Logged mood: ${lastMood.mood} on ${new Date(lastMood.date).toLocaleDateString()}`);
        }
        
        if (activities.length > 0) {
            activityDiv.innerHTML = activities.map(a => `<p style="padding:8px 0; border-bottom:1px solid #e5e7eb;">${a}</p>`).join('');
        } else {
            activityDiv.innerHTML = '<p class="empty-state">📝 No recent activity. Take the MBTI test!</p>';
        }
    } catch (err) {
        activityDiv.innerHTML = '<p class="empty-state">📝 Complete activities to see here!</p>';
    }
}

// ============ MOOD CHART ============
async function loadMoodChart() {
    const canvas = document.getElementById('moodChart');
    if (!canvas) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_URL}/mood/last-30-days`, {
            headers: { 'x-auth-token': token }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch mood data');
        }
        
        const moods = await response.json();
        
        const moodValues = { 'Great': 5, 'Good': 4, 'OK': 3, 'Poor': 2, 'Bad': 1 };
        const moodColors = { 'Great': '#22d3ee', 'Good': '#8b5cf6', 'OK': '#fbbf24', 'Poor': '#f97316', 'Bad': '#ef4444' };
        
        let existingChart = Chart.getChart(canvas);
        if (existingChart) existingChart.destroy();
        
        if (moods && moods.length > 0) {
            const last7Moods = moods.slice(0, 7).reverse();
            
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: last7Moods.map(m => new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                    datasets: [{
                        label: 'Mood Level',
                        data: last7Moods.map(m => moodValues[m.mood] || 3),
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 4,
                        pointRadius: 6,
                        pointHoverRadius: 10,
                        pointBackgroundColor: last7Moods.map(m => moodColors[m.mood] || '#8b5cf6'),
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { 
                            position: 'bottom',
                            labels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans', weight: 'bold' } }
                        },
                        tooltip: { 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#fff',
                            bodyColor: '#cbd5e1',
                            borderColor: '#8b5cf6',
                            borderWidth: 1,
                            callbacks: { 
                                label: (ctx) => {
                                    const mood = Object.keys(moodValues).find(key => moodValues[key] === ctx.raw);
                                    return `Mood: ${mood || 'OK'} (${ctx.raw}/5)`;
                                }
                            }
                        }
                    },
                    scales: { 
                        y: { 
                            min: 1, 
                            max: 5, 
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { 
                                color: '#94a3b8',
                                stepSize: 1, 
                                callback: (val) => ['Bad', 'Poor', 'OK', 'Good', 'Great'][val-1] 
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#94a3b8' }
                        }
                    }
                }
            });
        } else {
            new Chart(canvas, {
                type: 'line',
                data: { 
                    labels: ['No Data'], 
                    datasets: [{ 
                        label: 'Mood Level', 
                        data: [3], 
                        borderColor: '#ccc',
                        backgroundColor: 'rgba(200,200,200,0.1)'
                    }] 
                },
                options: { 
                    responsive: true,
                    plugins: {
                        tooltip: { callbacks: { label: () => 'No mood data yet. Start tracking!' } }
                    }
                }
            });
        }
    } catch (err) {
        console.log('Error loading mood chart:', err);
    }
}

// ============ MBTI TEST ============
let currentQIndex = 0;
let questions = [];
let answers = {};

async function initMBTITest() {
    if (!document.getElementById('questionContainer')) return;
    
    // Always reset test state when entering the test page
    localStorage.removeItem('mbtiAnswers');
    answers = {};
    currentQIndex = 0;
    
    await loadQuestions();
}

async function loadQuestions() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/mbti/questions`, {
            headers: { 'x-auth-token': token }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load questions');
        }
        
        questions = await response.json();
        const totalQuestionsSpan = document.getElementById('totalQuestions');
        if (totalQuestionsSpan) totalQuestionsSpan.textContent = questions.length;
        
        loadSavedAnswers();
        displayQuestion();
        
        document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);
        document.getElementById('prevBtn')?.addEventListener('click', prevQuestion);
    } catch (err) {
        console.error('Error loading questions:', err);
        const container = document.getElementById('questionContainer');
        if (container) {
            container.innerHTML = '<div class="empty-state">❌ Failed to load questions. Make sure backend is running on port 5000</div>';
        }
    }
}

function loadSavedAnswers() {
    const saved = localStorage.getItem('mbtiAnswers');
    if (saved) {
        answers = JSON.parse(saved);
    } else {
        answers = {};
    }
}

function displayQuestion() {
    if (currentQIndex >= questions.length) {
        submitTest();
        return;
    }
    
    const q = questions[currentQIndex];
    const container = document.getElementById('questionContainer');
    if (!container) return;
    
    const optionLetters = ['A', 'B', 'C', 'D'];
    const savedAnswer = answers[q._id];
    
    container.innerHTML = `
        <div class="question-header">
            <span class="question-number">Question ${currentQIndex + 1} of ${questions.length}</span>
        </div>
        <div class="question-text">${q.text}</div>
        <div class="options-grid">
            ${q.options.map((opt, idx) => `
                <label class="option-card ${savedAnswer === optionLetters[idx] ? 'selected' : ''}">
                    <input type="radio" name="answer" value="${optionLetters[idx]}" ${savedAnswer === optionLetters[idx] ? 'checked' : ''}>
                    <span class="option-text">${opt}</span>
                </label>
            `).join('')}
        </div>
    `;
    
    const progress = ((currentQIndex + 1) / questions.length) * 100;
    const testProgress = document.getElementById('testProgress');
    if (testProgress) testProgress.style.width = `${progress}%`;
    
    const currentQuestionNum = document.getElementById('currentQuestionNum');
    if (currentQuestionNum) currentQuestionNum.textContent = currentQIndex + 1;
    
    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            answers[q._id] = e.target.value;
            localStorage.setItem('mbtiAnswers', JSON.stringify(answers));
            
            document.querySelectorAll('.option-card').forEach(card => {
                card.classList.remove('selected');
            });
            e.target.closest('.option-card').classList.add('selected');
        });
    });
    
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.disabled = currentQIndex === 0;
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.textContent = currentQIndex === questions.length - 1 ? 'Submit Test' : 'Next Question →';
    }
}

function nextQuestion() {
    const q = questions[currentQIndex];
    if (!answers[q._id]) {
        alert('Please select an answer before continuing!');
        return;
    }
    
    if (currentQIndex === questions.length - 1) {
        submitTest();
    } else {
        currentQIndex++;
        displayQuestion();
    }
}

function prevQuestion() {
    if (currentQIndex > 0) {
        currentQIndex--;
        displayQuestion();
    }
}

async function submitTest() {
    let allAnswered = true;
    for (let i = 0; i < questions.length; i++) {
        if (!answers[questions[i]._id]) {
            allAnswered = false;
            break;
        }
    }
    
    if (!allAnswered) {
        alert('Please answer all questions before submitting!');
        return;
    }
    
    const token = localStorage.getItem('token');
    const answerArray = [];
    
    for (let i = 0; i < questions.length; i++) {
        answerArray.push(answers[questions[i]._id] || 'A');
    }
    
    const submitBtn = document.getElementById('nextBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }
    
    try {
        const response = await fetch(`${API_URL}/mbti/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ answers: answerArray })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            localStorage.setItem('mbtiResult', JSON.stringify(result));
            localStorage.removeItem('mbtiAnswers');
            window.location.href = `result.html?type=${result.type}`;
        } else {
            alert('Failed to submit test: ' + (result.msg || 'Unknown error'));
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Test';
            }
        }
    } catch (err) {
        console.error('Submit error:', err);
        alert('Connection error. Make sure backend is running on port 5000');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Test';
        }
    }
}

// ============ MOOD TRACKER ============
let selectedMood = null;

function initMoodTracker() {
    if (!window.location.pathname.includes('mood-tracker.html')) return;
    
    loadMoodHistoryDisplay();
    
    document.querySelectorAll('.mood-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMood = btn.dataset.mood;
        });
    });
    
    const saveBtn = document.getElementById('saveMoodBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveMood);
    }
}

async function saveMood() {
    if (!selectedMood) {
        alert('Please select a mood!');
        return;
    }
    
    const comment = document.getElementById('moodComment')?.value || '';
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please login first!');
        window.location.href = 'login.html';
        return;
    }
    
    const saveBtn = document.getElementById('saveMoodBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
    }
    
    try {
        const response = await fetch(`${API_URL}/mood/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ mood: selectedMood, comment })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('✅ Mood saved successfully!');
            
            selectedMood = null;
            if (document.getElementById('moodComment')) {
                document.getElementById('moodComment').value = '';
            }
            document.querySelectorAll('.mood-option').forEach(b => b.classList.remove('selected'));
            
            await loadMoodHistoryDisplay();
            
            if (window.location.pathname.includes('dashboard.html')) {
                loadMoodChart();
                loadMoodData();
            }
        } else {
            alert('❌ Failed to save mood: ' + (data.msg || data.error || 'Server error'));
        }
    } catch (err) {
        console.error('Error saving mood:', err);
        alert('❌ Connection error. Make sure backend is running on port 5000');
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Today\'s Mood →';
        }
    }
}

async function loadMoodHistoryDisplay() {
    const historyDiv = document.getElementById('moodHistoryList');
    if (!historyDiv) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/mood/my-moods`, {
            headers: { 'x-auth-token': token }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch moods');
        }

        const moods = await response.json();

        const moodIcons = { 'Great': '😁', 'Good': '😊', 'OK': '😐', 'Poor': '😟', 'Bad': '😢' };

        if (moods && moods.length > 0) {
            historyDiv.innerHTML = moods.slice(0, 10).map(m => `
                <div class="history-item">
                    <div class="history-mood">
                        <span style="font-size:1.5rem;">${moodIcons[m.mood] || '😐'}</span>
                        <strong>${m.mood}</strong>
                    </div>
                    <div class="history-date">
                        ${new Date(m.date).toLocaleDateString()}
                        ${m.comment ? `<br><small style="color:#666;">💬 ${m.comment.substring(0, 40)}</small>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            historyDiv.innerHTML = '<p class="empty-state">📝 No mood entries yet. Start tracking today!</p>';
        }
    } catch (err) {
        console.log('Error loading mood history:', err);
        historyDiv.innerHTML = '<p class="empty-state">📝 No mood entries yet. Start tracking today!</p>';
    }
}

// ============ PERSONALITY INSIGHTS DATA ============

const personalityInsights = {
    'INTJ': {
        name: 'The Architect',
        tips: ['Strategic Planning', 'Software Engineering', 'Scientific Research', 'Systems Analysis', 'Entrepreneurship'],
        celebs: [
            { name: 'Elon Musk', emoji: '🚀', title: 'Tech Visionary' },
            { name: 'Michelle Obama', emoji: '⚖️', title: 'Former First Lady' }
        ],
        story: 'Elon Musk, a classic INTJ, envisioned a future where humanity is multi-planetary. Despite multiple failures with SpaceX rockets, his strategic long-term thinking and unwavering logic led to the first successful private orbital launch, revolutionizing the space industry forever.'
    },
    'INTP': {
        name: 'The Logician',
        tips: ['Software Architecture', 'Theoretical Physics', 'Data Science', 'Academic Research', 'Technical Writing'],
        celebs: [
            { name: 'Albert Einstein', emoji: '⚛️', title: 'Physicist' },
            { name: 'Bill Gates', emoji: '💻', title: 'Microsoft Founder' }
        ],
        story: 'Albert Einstein used his INTP curiosity to question the very fabric of time and space. His thought experiments, conducted while working as a patent clerk, eventually led to the Theory of Relativity, proving that logical breakthroughs can happen anywhere.'
    },
    'ENTJ': {
        name: 'The Commander',
        tips: ['Executive Management', 'Business Strategy', 'Corporate Law', 'Venture Capital', 'Institutional Leadership'],
        celebs: [
            { name: 'Steve Jobs', emoji: '🍎', title: 'Apple Co-founder' },
            { name: 'Gordon Ramsay', emoji: '👨‍🍳', title: 'Master Chef' }
        ],
        story: 'Steve Jobs’ ENTJ leadership and vision transformed Apple from a garage startup into the world\'s most valuable company. His relentless pursuit of perfection and ability to command large-scale innovation changed how we interact with technology daily.'
    },
    'ENTP': {
        name: 'The Debater',
        tips: ['Product Innovation', 'Marketing Strategy', 'Political Consulting', 'Public Relations', 'Venture Entrepreneurship'],
        celebs: [
            { name: 'Mark Twain', emoji: '📖', title: 'Author & Wit' },
            { name: 'Robert Downey Jr.', emoji: '🛡️', title: 'Actor' }
        ],
        story: 'Robert Downey Jr. utilized his ENTP wit and adaptability to reinvent his career. After facing significant personal challenges, his quick-thinking nature and charismatic presence allowed him to become the face of the Marvel Cinematic Universe as Iron Man.'
    },
    'INFJ': {
        name: 'The Advocate',
        tips: ['Psychology & Counseling', 'Non-profit Leadership', 'Creative Writing', 'Environmental Advocacy', 'Educational Design'],
        celebs: [
            { name: 'Nelson Mandela', emoji: '🇿🇦', title: 'Civil Rights Leader' },
            { name: 'Lady Gaga', emoji: '🎤', title: 'Artist & Activist' }
        ],
        story: 'Nelson Mandela spent 27 years in prison, but his INFJ vision for a united, rainbow nation never wavered. His ability to lead with empathy and moral conviction eventually brought an end to Apartheid, proving the quiet power of the INFJ spirit.'
    },
    'INFP': {
        name: 'The Mediator',
        tips: ['Creative Arts', 'Social Advocacy', 'Human Resources', 'Counseling', 'Editorial Work'],
        celebs: [
            { name: 'William Shakespeare', emoji: '📜', title: 'Playwright' },
            { name: 'Princess Diana', emoji: '👑', title: 'Humanitarian' }
        ],
        story: 'Princess Diana used her INFP empathy to break down social barriers. By touching a person with HIV/AIDS at a time when the world was terrified, she changed global perceptions through a single, authentic gesture of human connection and kindness.'
    },
    'ENFJ': {
        name: 'The Protagonist',
        tips: ['Community Organizing', 'Public Speaking', 'Sales Management', 'Teaching', 'Diplomatic Service'],
        celebs: [
            { name: 'Oprah Winfrey', emoji: '🎙️', title: 'Media Mogul' },
            { name: 'Barack Obama', emoji: '🇺🇸', title: 'Former President' }
        ],
        story: 'Oprah Winfrey’s ENFJ ability to connect with people on a deep emotional level turned her talk show into a global platform for inspiration. She used her influence to build schools and empower millions, embodying the true Protagonist spirit.'
    },
    'ENFP': {
        name: 'The Campaigner',
        tips: ['Creative Direction', 'Journalism', 'Events Marketing', 'Social Entrepreneurship', 'Public Relations'],
        celebs: [
            { name: 'Robin Williams', emoji: '🎭', title: 'Legendary Actor' },
            { name: 'Ellen DeGeneres', emoji: '📺', title: 'TV Host' }
        ],
        story: 'Robin Williams’ ENFP energy was legendary. He used his boundless creativity and spontaneous humor to bring joy to millions. His career was a testament to how the Campaigner personality can inspire and uplift the human spirit through art.'
    },
    'ISTJ': {
        name: 'The Logistician',
        tips: ['Project Management', 'Financial Auditing', 'Law Enforcement', 'Military Strategy', 'Operations Management'],
        celebs: [
            { name: 'Queen Elizabeth II', emoji: '👑', title: 'Monarch' },
            { name: 'George Washington', emoji: '🏛️', title: 'US President' }
        ],
        story: 'Queen Elizabeth II’s 70-year reign was a masterclass in ISTJ duty and reliability. Her unwavering commitment to her role provided a sense of stability through decades of global change, showing the strength of quiet, consistent dedication.'
    },
    'ISFJ': {
        name: 'The Defender',
        tips: ['Healthcare Management', 'Customer Success', 'Elementary Education', 'Museum Curation', 'Social Work'],
        celebs: [
            { name: 'Mother Teresa', emoji: '🕊️', title: 'Humanitarian' },
            { name: 'Beyoncé', emoji: '🐝', title: 'Global Icon' }
        ],
        story: 'Mother Teresa dedicated her ISFJ nature to serving the "poorest of the poor" in Calcutta. Her practical, hands-on care for the suffering became a global symbol of selfless service and the profound impact of individual compassion.'
    },
    'ESTJ': {
        name: 'The Executive',
        tips: ['Business Administration', 'School Principal', 'Judge/Law', 'Project Coordination', 'Government Leadership'],
        celebs: [
            { name: 'Michelle Obama', emoji: '📚', title: 'Advocate' },
            { name: 'Judge Judy', emoji: '⚖️', title: 'TV Judge' }
        ],
        story: 'Michelle Obama utilized her ESTJ organization and leadership to launch the "Let\'s Move!" campaign. By creating clear structures and measurable goals, she successfully influenced national policies on childhood health and nutrition.'
    },
    'ESFJ': {
        name: 'The Consul',
        tips: ['Human Resources', 'Event Planning', 'Public Relations', 'Hospitality Management', 'Nursing'],
        celebs: [
            { name: 'Taylor Swift', emoji: '🎤', title: 'Singer-Songwriter' },
            { name: 'Jennifer Garner', emoji: '🎬', title: 'Actress & Activist' }
        ],
        story: 'Taylor Swift’s ESFJ sense of community has built one of the most loyal fanbases in history. Her focus on connection, tradition, and caring for her "Swifties" shows how the Consul type can lead through warmth and social harmony.'
    },
    'ISTP': {
        name: 'The Virtuoso',
        tips: ['Mechanical Engineering', 'Aviation', 'Data Analysis', 'Forensic Science', 'Sports Science'],
        celebs: [
            { name: 'Bruce Lee', emoji: '🥋', title: 'Martial Artist' },
            { name: 'Steve Jobs', emoji: '📱', title: 'Design Visionary' }
        ],
        story: 'Bruce Lee adapted his ISTP mastery of mechanics to create "Jeet Kune Do." He famously said, "Be water, my friend," embodying the ISTP traits of total adaptability and practical, hands-on perfection of his craft.'
    },
    'ISFP': {
        name: 'The Adventurer',
        tips: ['Graphic Design', 'Fashion Innovation', 'Fine Arts', 'Culinary Arts', 'Wildlife Photography'],
        celebs: [
            { name: 'Michael Jackson', emoji: '🕺', title: 'Pop Legend' },
            { name: 'Frida Kahlo', emoji: '🎨', title: 'Painter' }
        ],
        story: 'Frida Kahlo used her ISFP sensitivity to turn her physical pain into world-renowned art. Her bold, colorful, and deeply personal paintings show how the Adventurer type can find beauty and expression in the most challenging circumstances.'
    },
    'ESTP': {
        name: 'The Entrepreneur',
        tips: ['Sales & Negotiation', 'Emergency Management', 'Professional Sports', 'Stock Trading', 'Marketing'],
        celebs: [
            { name: 'Tom Cruise', emoji: '🎬', title: 'Actor/Producer' },
            { name: 'Madonna', emoji: '🎶', title: 'Music Icon' }
        ],
        story: 'Tom Cruise’s ESTP boldness is seen in his legendary dedication to performing his own stunts. Whether climbing the Burj Khalifa or flying fighter jets, his live-in-the-moment energy and tactical skill have defined his career.'
    },
    'ESFP': {
        name: 'The Entertainer',
        tips: ['Performing Arts', 'Event Planning', 'Travel & Tourism', 'Retail Management', 'Public Relations'],
        celebs: [
            { name: 'Will Smith', emoji: '🎭', title: 'Actor & Icon' },
            { name: 'Marilyn Monroe', emoji: '💎', title: 'Legendary Actress' }
        ],
        story: 'Will Smith’s ESFP energy and natural charisma made him a global superstar across music, TV, and film. His ability to connect with anyone and light up any room is a classic example of the Entertainer personality in action.'
    }
};

// ============ COMMUNITY INSIGHTS PAGE ============

function initCommunityPage() {
    const explorer = document.getElementById('mbtiExplorer');
    if (!explorer) return;

    explorer.addEventListener('change', (e) => {
        loadInsights(e.target.value);
    });

    // Auto-load user's personality if available
    const result = JSON.parse(localStorage.getItem('mbtiResult'));
    if (result && result.type) {
        explorer.value = result.type;
        loadInsights(result.type);
    }
}

function loadInsights(type) {
    const content = document.getElementById('insightContent');
    const emptyState = document.getElementById('emptyState');
    
    if (!type) {
        if (content) content.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    const data = personalityInsights[type];
    if (!data) return;

    // Show content, hide empty state
    if (content) content.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';

    // Update UI
    const displayType = document.getElementById('displayType');
    const displayName = document.getElementById('displayName');
    if (displayType) displayType.textContent = type;
    if (displayName) displayName.textContent = data.name;
    
    // Career Tips
    const tipsContainer = document.getElementById('careerTips');
    if (tipsContainer) {
        tipsContainer.innerHTML = data.tips.map(tip => `
            <div class="career-tip-item">${tip}</div>
        `).join('');
    }

    // Celebrities
    const celebGrid = document.getElementById('celebrityGrid');
    if (celebGrid) {
        celebGrid.innerHTML = data.celebs.map(celeb => `
            <div class="celebrity-card">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${celeb.emoji}</div>
                <div class="celebrity-name">${celeb.name}</div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">${celeb.title}</div>
            </div>
        `).join('');
    }

    // Story
    const storyBox = document.getElementById('inspiringStory');
    if (storyBox) storyBox.textContent = data.story;

    // Scroll to content
    if (content) content.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============ INITIALIZE EVERYTHING ============
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    displayUserName();
    loadDashboard();
    initMBTITest();
    initMoodTracker();
    initCommunityPage();
});