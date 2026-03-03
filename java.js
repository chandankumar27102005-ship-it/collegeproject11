  (function() {
            // ---------- background slideshow (2 sec interval) with fallback ----------
            const images = [
                "https://cmscollege.edu.in/sc/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-3.54.25-PM.jpeg",
                "https://cmscollege.edu.in/sc/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-3.54.24-PM.jpeg",
                "https://cmscollege.edu.in/sc/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-3.54.25-PM-3.jpeg",
                "https://cmscollege.edu.in/sc/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-3.54.25-PM-1.jpeg",
                "https://cmscollege.edu.in/sc/wp-content/uploads/2025/10/PHOTO-2025-10-10-16-15-08-1.jpg",
                "https://cmscollege.edu.in/sc/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-3.54.25-PM-2.jpeg",
                "https://cmscollege.edu.in/sc/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-3.54.26-PM.jpeg",
                "https://cmscollege.edu.in/sc/wp-content/uploads/2023/05/IMG_20251010_124123422-scaled.jpg"
            ];
            const fallbackImages = [
                "https://images.unsplash.com/photo-1562774053-701939374585?w=1920",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920"
            ];

            const bg = document.getElementById('bg-slideshow');
            let idx = 0;
            let useFallback = false;

            function nextBg() {
                let url;
                if (!useFallback) {
                    url = images[idx];
                    const img = new Image();
                    img.onload = () => {
                        bg.style.backgroundImage = `url('${url}')`;
                    };
                    img.onerror = () => {
                        useFallback = true;
                        idx = 0;
                        nextBg();
                    };
                    img.src = url;
                } else {
                    url = fallbackImages[idx % fallbackImages.length];
                    bg.style.backgroundImage = `url('${url}')`;
                }
                if (!useFallback) {
                    bg.style.backgroundImage = `url('${url}')`;
                }
                idx = (idx + 1) % (useFallback ? fallbackImages.length : images.length);
            }
            nextBg();
            setInterval(nextBg, 2000);

            // ---------- intro animation + canvas blast ----------
            const intro = document.getElementById('intro-overlay');
            const mainContent = document.getElementById('main-content');
            const canvas = document.getElementById('intro-canvas');
            const ctx = canvas.getContext('2d');
            let w, h, particles = [];

            function resizeCanvas() {
                w = window.innerWidth;
                h = window.innerHeight;
                canvas.width = w;
                canvas.height = h;
            }
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            function createBlast(cx, cy) {
                for (let i=0; i<150; i++) {
                    let angle = Math.random()*2*Math.PI;
                    let speed = 3+Math.random()*15;
                    particles.push({
                        x: cx, y: cy,
                        vx: Math.cos(angle)*speed,
                        vy: Math.sin(angle)*speed,
                        life: 1,
                        size: Math.random()*8+3,
                        color: `hsl(${Math.random()*60+20}, 90%, 60%)`
                    });
                }
            }

            function animateCanvas() {
                ctx.clearRect(0,0,w,h);
                for (let i=particles.length-1; i>=0; i--) {
                    let p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.08;
                    p.life -= 0.005;
                    if (p.life<=0 || p.y>h+100) { particles.splice(i,1); continue; }
                    ctx.globalAlpha = p.life;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size*p.life, 0, 2*Math.PI);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'white';
                }
                requestAnimationFrame(animateCanvas);
            }
            animateCanvas();

            setTimeout(() => {
                createBlast(w*0.5, h*0.4);
            }, 2000);

            setTimeout(() => {
                intro.classList.add('hidden');
                mainContent.classList.add('visible');
            }, 5200);

            document.getElementById('skipIntro').addEventListener('click', () => {
                intro.classList.add('hidden');
                mainContent.classList.add('visible');
            });

            // ---------- dark mode ----------
            const themeToggle = document.getElementById('themeToggle');
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark');
                const sun = themeToggle.querySelector('.fa-sun');
                const moon = themeToggle.querySelector('.fa-moon');
                if (document.body.classList.contains('dark')) {
                    sun.style.display = 'none';
                    moon.style.display = 'inline';
                } else {
                    sun.style.display = 'inline';
                    moon.style.display = 'none';
                }
            });
            themeToggle.querySelector('.fa-moon').style.display = 'none';

            // ---------- mobile menu ----------
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('navLinks');
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                let icon = hamburger.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    hamburger.querySelector('i').className = 'fas fa-bars';
                });
            });

            // ---------- progress & navbar shadow ----------
            const progress = document.getElementById('progress-bar');
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                let winScroll = document.documentElement.scrollTop;
                let height = document.documentElement.scrollHeight - window.innerHeight;
                let scrolled = (winScroll/height)*100;
                progress.style.width = scrolled+'%';
                if (winScroll>80) navbar.classList.add('shadow');
                else navbar.classList.remove('shadow');
            });

            const topBtn = document.getElementById('back-to-top');
            window.addEventListener('scroll', () => {
                if (window.scrollY>400) topBtn.classList.add('visible');
                else topBtn.classList.remove('visible');
            });
            topBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

            document.getElementById('homeLink').addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('home').scrollIntoView({behavior:'smooth'});
            });
            document.getElementById('eventsLink').addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('events').scrollIntoView({behavior:'smooth'});
            });

            const regModal = document.getElementById('registerModal');
            const conModal = document.getElementById('contactModal');
            document.getElementById('registerLink').addEventListener('click', (e) => {
                e.preventDefault(); regModal.classList.add('active');
            });
            document.getElementById('contactLink').addEventListener('click', (e) => {
                e.preventDefault(); conModal.classList.add('active');
            });
            document.getElementById('closeRegister').addEventListener('click', ()=>regModal.classList.remove('active'));
            document.getElementById('closeContact').addEventListener('click', ()=>conModal.classList.remove('active'));
            window.addEventListener('click', (e)=>{
                if(e.target===regModal) regModal.classList.remove('active');
                if(e.target===conModal) conModal.classList.remove('active');
            });

            const events = [
                { title:'HackCollab', cat:'technical', date:'2025-04-10 09:00', desc:'24h hackathon', icon:'fa-microchip' },
                { title:'Riff 2025', cat:'cultural', date:'2025-04-12 16:00', desc:'band war', icon:'fa-music' },
                { title:'Football T3', cat:'sports', date:'2025-04-15 08:00', desc:'5-a-side', icon:'fa-futbol' },
                { title:'Code Wars', cat:'technical', date:'2025-04-18 11:00', desc:'coding challenge', icon:'fa-laptop-code' },
                { title:'ArtFest', cat:'cultural', date:'2025-04-20 10:00', desc:'live painting', icon:'fa-paintbrush' },
                { title:'Cricket', cat:'sports', date:'2025-04-22 15:30', desc:'T3 tournament', icon:'fa-baseball-bat-ball' }
            ];

            function renderEvents(filter='all') {
                let html = '';
                events.forEach((e,i) => {
                    if(filter==='all' || e.cat===filter) {
                        html += `<div class="event-card">
                            <i class="fas ${e.icon} fa-3x" style="color:gold;"></i>
                            <h3 style="margin:0.8rem 0 0.2rem;">${e.title}</h3>
                            <p style="font-size:0.9rem;">${e.desc}</p>
                            <div class="countdown-box">
                                <span class="countdown-item"><span class="countdown-num" id="d${i}">00</span>d</span>
                                <span class="countdown-item"><span class="countdown-num" id="h${i}">00</span>h</span>
                                <span class="countdown-item"><span class="countdown-num" id="m${i}">00</span>m</span>
                                <span class="countdown-item"><span class="countdown-num" id="s${i}">00</span>s</span>
                            </div>
                        </div>`;
                    }
                });
                document.getElementById('eventGrid').innerHTML = html;
            }
            renderEvents();

            function updateCountdowns() {
                events.forEach((e,i) => {
                    let target = new Date(e.date).getTime();
                    let now = new Date().getTime();
                    let diff = target - now;
                    if(diff<0) diff=0;
                    let days = Math.floor(diff/(1000*60*60*24));
                    let hours = Math.floor((diff/(1000*60*60))%24);
                    let mins = Math.floor((diff/(1000*60))%60);
                    let secs = Math.floor((diff/1000)%60);
                    if(document.getElementById(`d${i}`)) {
                        document.getElementById(`d${i}`).innerText = days.toString().padStart(2,'0');
                        document.getElementById(`h${i}`).innerText = hours.toString().padStart(2,'0');
                        document.getElementById(`m${i}`).innerText = mins.toString().padStart(2,'0');
                        document.getElementById(`s${i}`).innerText = secs.toString().padStart(2,'0');
                    }
                });
            }
            setInterval(updateCountdowns,1000);

            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
                    this.classList.add('active');
                    renderEvents(this.dataset.filter);
                });
            });

            const regForm = document.getElementById('modalRegForm');
            const regConfirm = document.getElementById('modalConfirmPopup');
            regForm.addEventListener('submit', (e) => {
                e.preventDefault();
                let name = document.getElementById('modalFullName').value.trim();
                let email = document.getElementById('modalEmail').value.trim();
                let phone = document.getElementById('modalPhone').value.trim();
                let event = document.getElementById('modalEventSelect').value;
                if(!name || !email || !phone || !event) {
                    regConfirm.style.display = 'block';
                    regConfirm.innerText = '❌ all fields required';
                    regConfirm.style.background = 'rgba(180,60,60,0.3)';
                    return;
                }
                if(!/^\S+@\S+\.\S+$/.test(email)) {
                    regConfirm.style.display = 'block';
                    regConfirm.innerText = '❌ invalid email';
                    return;
                }
                if(!/^\d{10}$/.test(phone)) {
                    regConfirm.style.display = 'block';
                    regConfirm.innerText = '❌ phone 10 digits';
                    return;
                }
                let data = JSON.parse(localStorage.getItem('registrations')||'[]');
                data.push({name,email,phone,event,date:new Date().toISOString()});
                localStorage.setItem('registrations',JSON.stringify(data));
                regConfirm.style.display = 'block';
                regConfirm.innerText = `✅ registered, ${name}!`;
                regConfirm.style.background = 'rgba(0,100,0,0.3)';
                regForm.reset();
            });

            const conForm = document.getElementById('modalContactForm');
            const conConfirm = document.getElementById('modalContactConfirm');
            conForm.addEventListener('submit', (e) => {
                e.preventDefault();
                conConfirm.style.display = 'block';
                conConfirm.innerText = '✨ message sent';
                conConfirm.style.background = 'rgba(0,100,0,0.3)';
                conForm.reset();
            });
        })();