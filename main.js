// Testimonial slider
const testimonialItems = document.querySelectorAll('.testimonial-item');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let currentTestimonial = 0;
let testimonialInterval;

// About Video Controls
const aboutVideo = document.getElementById('aboutVideo');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const volumeIcon = document.getElementById('volumeIcon');
const muteIcon = document.getElementById('muteIcon');
const volumeSlider = document.getElementById('volumeSlider');
aboutVideo.volume = 0;

// Audio player toggle
const audio = document.getElementById("audioPlayer");
const progressFill = document.getElementById("progressFill");
const audioTime = document.getElementById("audioTime");
const playBtn = document.getElementById('audioPlayIcon');

const heroVideo = document.getElementById('heroVideo');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile navigation toggle
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('open');
}

// Fade in on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const observerhero = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            heroVideo.play().catch(() => {});
        } else {
            heroVideo.pause();
        }
    });
}, {
    threshold: 0.5
});

function togglePlayPause() {
    pauseOtherVideos('aboutVideo');
    if (aboutVideo.paused) {
        aboutVideo.volume = 0.5;
        aboutVideo.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        aboutVideo.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }

    if (aboutVideo.muted) {
        aboutVideo.currentTime = 0;
        aboutVideo.muted = false;
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
    }
}

function toggleMute() {
    pauseOtherVideos('aboutVideo');
    aboutVideo.volume = 0.5; // Set default volume when unmuting
    if (aboutVideo.muted) {
        aboutVideo.muted = false;
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
        volumeSlider.value = aboutVideo.volume * 100;
    } else {
        aboutVideo.muted = true;
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'block';
    }
}

function changeVolume(value) {
    pauseOtherVideos('aboutVideo');
    aboutVideo.volume = value / 100;
    if (value == 0) {
        aboutVideo.muted = true;
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'block';
    } else {
        aboutVideo.muted = false;
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
    }
}

//mute all videos except the one being played
function pauseOtherVideos(currentVideoId) {
    audio.pause();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block'; // pause video about me

    const videos = document.querySelectorAll("video");
 
    videos.forEach(video => {
        if (video.id !== currentVideoId && video.id !== "heroVideo") {
            video.pause();
        }
    });
}

// Demo play function
function playDemo(category) {
    pauseOtherVideos(category);

    let videoElement = document.getElementById(category);

    if (videoElement.paused) {
        videoElement.play();
        videoElement.currentTime = 0;
        videoElement.volume = 0.5;
    } else {
        videoElement.pause();
        videoElement.volume = 0.5;
    }
}

function toggleAudioPlayer() {
    if (audio.paused) {
        pauseOtherVideos("none");
        audio.play();
        playBtn.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
    }
}

audio.addEventListener("timeupdate", () => {

    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;

    audioTime.textContent = `
        ${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}
    `;
});

function setProgress(event) {

    const progressBar = event.currentTarget;
    const width = progressBar.clientWidth;
    const clickX = event.offsetX;

    audio.currentTime = (clickX / width) * audio.duration;
}

function formatTime(time) {

    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function showTestimonial(index) {
    testimonialItems.forEach(item => item.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    testimonialItems[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonial = index;
}

function startTestimonialAutoRotate() {
    testimonialInterval = setInterval(() => {
        let nextIndex = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(nextIndex);
    }, 5000);
}

function resetTestimonialAutoRotate() {
    clearInterval(testimonialInterval);
    startTestimonialAutoRotate();
}

testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => {
        showTestimonial(parseInt(dot.dataset.index));
        resetTestimonialAutoRotate();
    });
});

// ========================================
// Stats Counter Animation
// ========================================
function animateStats() {
    const stats = document.querySelectorAll('.hero-stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/\d/g, '');
                
                let current = 0;
                const increment = numericValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        target.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current) + suffix;
                    }
                }, 30);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// Auto-rotate testimonials
startTestimonialAutoRotate();

// Observers
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

observerhero.observe(heroVideo);

document.addEventListener('DOMContentLoaded', function() {
    animateStats();
    changeVolume(0);
});