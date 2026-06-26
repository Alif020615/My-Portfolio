// script.js
// Voxel & Cyber Interactive Portfolio Engine

// ==========================================
// 1. DYNAMIC THEME SYSTEM
// ==========================================
const themes = ['', 'theme-amber', 'theme-space'];
let currentThemeIdx = 0;

const themeBtn = document.getElementById('btn-theme');

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        // Play click chime
        playClickSound();

        // Cycle theme
        document.body.classList.remove(themes[currentThemeIdx]);
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        if (themes[currentThemeIdx]) {
            document.body.classList.add(themes[currentThemeIdx]);
        }

        const themeNames = ["Cyberpunk Neon", "Amber Terminal", "Deep Space"];
        showNotice(`Theme Swapped: ${themeNames[currentThemeIdx]}`);
    });
}

function showNotice(text) {
    // Generate notice element dynamically
    let toast = document.getElementById('notice-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'notice-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: rgba(10, 14, 23, 0.85);
            border: 1px solid var(--card-border);
            color: var(--neon-cyan);
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            z-index: 2000;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform: translateY(100px);
            opacity: 0;
        `;
        document.body.appendChild(toast);
    }
    toast.innerText = text;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 2500);
}


// ==========================================
// 2. PROCEDURAL SOUND SYNTHESIZER
// ==========================================
let audioCtx = null;
let isMuted = true;
const soundBtn = document.getElementById('btn-sound');

function initAudio() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
        audioCtx = new AudioContextClass();
    }
}

if (soundBtn) {
    soundBtn.addEventListener('click', () => {
        initAudio();
        isMuted = !isMuted;
        
        const icon = soundBtn.querySelector('i');
        if (isMuted) {
            soundBtn.classList.add('muted');
            icon.className = 'fa-solid fa-volume-xmark';
            showNotice("Sound Synth: Muted");
        } else {
            soundBtn.classList.remove('muted');
            icon.className = 'fa-solid fa-volume-high';
            showNotice("Sound Synth: Enabled");
            playChimeSound(); // Play feedback chime
        }
    });
}

// Synthesize a keypress type beep (high-pass/short)
function playTypeSound() {
    if (isMuted || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

// Synthesize a menu selection hover chimes
function playHoverSound() {
    if (isMuted || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.09);
}

// Synthesize direct button click confirmation chimes
function playClickSound() {
    if (isMuted || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.16);
}

// Play startup chime
function playChimeSound() {
    if (isMuted || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
    });
}

// Bind hover audio to links and buttons
document.querySelectorAll('a, button, .project-details-link, .term-quick-cmd').forEach(el => {
    el.addEventListener('mouseenter', () => playHoverSound());
    el.addEventListener('click', () => playClickSound());
});


// ==========================================
// 3. INTERACTIVE NODE CANVAS PARTICLES
// ==========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 70;
const mouse = { x: null, y: null, radius: 130 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Boundary collision bounces
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw(color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

// Populate particle coordinates
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Render loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Read active CSS neon variable values
    const neonColor = getComputedStyle(document.body).getPropertyValue('--neon-cyan').trim() || '#06b6d4';
    
    // Convert hex to rgb format for opacity line blending
    let r = 6, g = 182, b = 212; // fallback defaults
    if (neonColor.startsWith('#')) {
        const hex = neonColor.substring(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    }

    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw(neonColor);
    });

    // Draw mesh connection lines
    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Lines to other particles
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            
            if (dist < 90) {
                const alpha = (1 - (dist / 90)) * 0.15;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        // Lines to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
            const distToMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
            if (distToMouse < mouse.radius) {
                const alpha = (1 - (distToMouse / mouse.radius)) * 0.35;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.lineWidth = 1.0;
                ctx.stroke();
            }
        }
    }
}
animateParticles();


// ==========================================
// 4. SUBTITLE TYPEWRITER LOOP
// ==========================================
const typewriterWords = [
    "full-stack web applications.",
    "scalable containerized services.",
    "high-performance network systems.",
    "interactive 3D WebGL experiences."
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const txtElement = document.getElementById('typewriter-text');

function type() {
    const currentWord = typewriterWords[wordIndex];
    
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    txtElement.innerHTML = currentWord.substring(0, charIndex);

    let typeSpeed = 80;
    if (isDeleting) { typeSpeed /= 2; }

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex++;
        if (wordIndex === typewriterWords.length) {
            wordIndex = 0;
        }
        typeSpeed = 500; // Pause before starting new word
    }

    setTimeout(type, typeSpeed);
}


// ==========================================
// 5. SHELL TERMINAL SIMULATOR WITH VFS
// ==========================================
const virtualFileSystem = {
    'resume.txt': 'MUHAMMAD ALIF FAHIMI BIN MOHD WADI\nComputer Application Developer\nEmail: aliffahimi22@gmail.com\nPhone: +6011 1851 1766\nWeb: github.com/Alif020615',
    'skills': {
        'languages.txt': 'Languages & Frameworks:\n  - Python (Flask)\n  - Java (Servlets, JDBC, JSP)\n  - JavaScript (React, Node, Express, Three.js)\n  - HTML5, CSS3, SQL, MySQL, MongoDB',
        'tools.txt': 'Tools & Cloud:\n  - Git, Docker, Kubernetes, AWS ECS, Azure, Tomcat, Maven, CI/CD, REST APIs'
    },
    'projects': {
        'student_tracker.txt': 'Student Activity Tracking System - University FYP (Nov 2025)\nBuilt with Flask, SQLAlchemy, Bootstrap, PyTest (90% coverage).',
        'kindergarten.txt': 'Kindergarten Management System (Apr 2025)\nBuilt with Java Servlets, JDBC, MySQL, Tomcat.',
        'coffee_shop.txt': 'My Online Coffee Shop (Nov 2024)\nBuilt with React, Node.js, Express, MongoDB, GitHub Actions.',
        'kidquest.txt': 'KidQuest Learning Hub (Jan 2026)\nBuilt with Vanilla HTML5/CSS3, Web Audio & Speech APIs.',
        'novanav.txt': 'NovaNav Smart Navigation (Apr 2026)\nBuilt with Leaflet.js, Nominatim API, Glassmorphism.',
        'browserdoom.txt': 'BrowserDoom 3D Game (Feb 2026)\nBuilt with Three.js, WebGL, FileReader API.'
    }
};

let currentPath = []; // empty array stands for root dir

const terminalScreen = document.getElementById('terminal-screen');
const terminalInput = document.getElementById('terminal-input');
const quickCmdBtns = document.querySelectorAll('.term-quick-cmd');

// Resolve path reference
function getDirectoryByPath(pathArr) {
    let dir = virtualFileSystem;
    for (const folder of pathArr) {
        dir = dir[folder];
    }
    return dir;
}

function handleCommand(cmdText) {
    const rawTokens = cmdText.trim().split(/\s+/);
    const cmd = rawTokens[0].toLowerCase();
    const arg = rawTokens[1];

    let output = '';
    const currentDirectory = getDirectoryByPath(currentPath);

    switch (cmd) {
        case 'help':
            output = "Available Shell Commands:<br>" +
                     "  <span class='text-orange'>ls</span>           - List files/directories in current path.<br>" +
                     "  <span class='text-orange'>cd [folder]</span>  - Change working directory (e.g. 'cd projects', 'cd ..').<br>" +
                     "  <span class='text-orange'>cat [file]</span>   - Read text file contents.<br>" +
                     "  <span class='text-orange'>pwd</span>          - Print working directory path.<br>" +
                     "  <span class='text-orange'>about</span>        - Print professional summary details.<br>" +
                     "  <span class='text-orange'>clear</span>        - Flush terminal buffer logs.";
            break;
        case 'about':
            output = "Muhammad Alif Fahimi is a Results-driven Computer Application Developer focused on full-stack web architectures, object-oriented systems, and containerized cloud deployments. Dedicated to high-speed REST integrations and clean code engineering.";
            break;
        case 'pwd':
            output = '/' + currentPath.join('/');
            break;
        case 'ls':
            const items = Object.keys(currentDirectory);
            const formatted = items.map(name => {
                const isFolder = typeof currentDirectory[name] === 'object';
                return isFolder ? `<span class='text-cyan'>${name}/</span>` : name;
            });
            output = formatted.join('   ') || '[Directory is empty]';
            break;
        case 'cd':
            if (!arg) {
                // cd to root
                currentPath = [];
                output = '';
            } else if (arg === '..') {
                if (currentPath.length > 0) {
                    currentPath.pop();
                }
                output = '';
            } else {
                if (currentDirectory[arg] && typeof currentDirectory[arg] === 'object') {
                    currentPath.push(arg);
                    output = '';
                } else if (currentDirectory[arg]) {
                    output = `cd: not a directory: ${arg}`;
                } else {
                    output = `cd: no such file or directory: ${arg}`;
                }
            }
            break;
        case 'cat':
            if (!arg) {
                output = 'cat: missing filename. usage: cat [filename]';
            } else if (currentDirectory[arg] && typeof currentDirectory[arg] === 'string') {
                output = currentDirectory[arg].replace(/\n/g, '<br>');
            } else if (currentDirectory[arg]) {
                output = `cat: ${arg}: is a directory`;
            } else {
                output = `cat: ${arg}: no such file`;
            }
            break;
        case 'clear':
            // Handled inside runner
            break;
        default:
            output = `Command not found: '${cmd}'. Type <span class='text-orange'>'help'</span> to view commands list.`;
    }

    return output;
}

function runTerminal(cmdText) {
    if (cmdText.trim() === '') return;

    // Play click/tap sound on type run
    playTypeSound();

    const logLine = document.createElement('div');
    logLine.className = 'terminal-line';
    
    // Display current working directory path prefix
    const pathPrefix = '/' + currentPath.join('/');
    logLine.innerHTML = `<span class='prompt'>aliffahimi@dev:${pathPrefix}$</span> <span class='cmd-run'>${cmdText}</span>`;
    
    const inputLine = terminalScreen.querySelector('.terminal-line-input');
    terminalScreen.insertBefore(logLine, inputLine);

    const cleanCmd = cmdText.trim().toLowerCase().split(/\s+/)[0];

    if (cleanCmd === 'clear') {
        const lines = terminalScreen.querySelectorAll('.terminal-line');
        lines.forEach(l => l.remove());
    } else {
        const result = handleCommand(cmdText);
        if (result) {
            const replyLine = document.createElement('div');
            replyLine.className = 'terminal-line reply';
            replyLine.innerHTML = result;
            terminalScreen.insertBefore(replyLine, inputLine);
        }
    }

    // Autoscroll
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

// Key listeners
if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            runTerminal(terminalInput.value);
            terminalInput.value = '';
        }
    });
}

// Quick button binders
quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        runTerminal(cmd);
    });
});


// ==========================================
// 6. PORTFOLIO PAGE INTERACTIONS
// ==========================================

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.querySelector('.nav');

if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = mobileBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            const icon = mobileBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });
}

// Project Category Filters
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-filter');

        projCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (cat === 'all' || cardCat === cat) {
                card.style.display = 'flex';
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

// Expand details
function toggleDetails(linkElement) {
    linkElement.classList.toggle('active');
    const panel = linkElement.nextElementSibling;
    if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
        panel.style.maxHeight = '0px';
    } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
    }
}

// Scroll navigation highlighter
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let currentSectionId = '';
    
    sections.forEach(sec => {
        const top = sec.offsetTop - 150;
        const height = sec.clientHeight;
        const scroll = window.scrollY;

        if (scroll >= top && scroll < top + height) {
            currentSectionId = sec.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
});

// Scroll fade reveal
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-fade').forEach(el => {
    scrollObserver.observe(el);
});

// Clipboard copy action chimes
function copyText(val) {
    navigator.clipboard.writeText(val).then(() => {
        showNotice(`Copied: ${val}`);
    }).catch(err => {
        console.error("Failed to copy text:", err);
    });
}

// Form submissions
function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log("Form dispatch logs:", { name, email, message });
    
    showNotice("Dispatch Success! Check browser logs.");
    alert(`Transmission complete! Thank you, ${name}. I will contact you at: ${email}.`);
    document.getElementById('contact-form').reset();
}

// Initialize Typewriter
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});
