/* ===== LOAD PERSONAL DATA FROM data.json =====
   Populates the most identity-related fields (name, tagline, contact
   links) from the separate data.json file at runtime. If this page is
   opened directly as a local file (file://) instead of served over
   http(s), the browser blocks fetch() of local JSON for security
   reasons — in that case this silently does nothing and the page falls
   back to the text already written directly in index.html. Once
   deployed to any real host (Netlify, GitHub Pages, Vercel), this
   works normally. */
(function(){
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      try {
        const heroLines = document.querySelectorAll('.hero-name .hn-line');
        if (heroLines[0] && data.headline) heroLines[0].textContent = data.headline[0];
        if (heroLines[1] && data.headline) heroLines[1].textContent = data.headline[1];

        const roleEl = document.querySelector('.hero-role');
        if (roleEl && data.role) roleEl.textContent = data.role;

        const taglineEl = document.querySelector('.hero-desc');
        if (taglineEl && data.tagline) taglineEl.textContent = data.tagline;

        const navCta = document.querySelector('.nav-cta');
        if (navCta && data.contact) {
          navCta.textContent = data.contact.email;
          navCta.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + data.contact.email;
        }

        document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
          if (data.contact) a.href = 'mailto:' + data.contact.email;
        });
        document.querySelectorAll('a[href^="tel:"]').forEach(a => {
          if (data.contact) a.href = 'tel:' + data.contact.phone.replace(/[^+\d]/g,'');
        });
      } catch(e){ console.error('data.json apply error:', e); }
    })
    .catch(() => { /* opened locally via file:// — using hardcoded HTML fallback content */ });
})();

/* ===== PHOTO CARD 3D TILT ===== */
(function(){
  try {
  const card = document.querySelector('.photo-card');
  if(!card) return;
  card.style.transition = 'transform .4s ease';
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    card.style.transition = 'transform .08s linear';
    card.style.transform = `perspective(900px) rotateX(${y*-8}deg) rotateY(${x*8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transition = 'transform .4s ease';
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
  });
  } catch(e){ console.error(e); }
})();

/* ===== MOBILE NAV TOGGLE + RELIABLE SECTION SCROLLING ===== */
(function(){
  try {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', ()=>{
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  document.querySelectorAll('[data-scroll]').forEach(a=>{
    a.addEventListener('click', function(e){
      const sel = this.getAttribute('data-scroll');
      const target = sel && sel.length > 1 ? document.querySelector(sel) : null;
      if(target){
        e.preventDefault();
        toggle.classList.remove('open');
        links.classList.remove('open');
        const navH = 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({top, behavior:'smooth'});
      }
    });
  });
  } catch(e){ console.error(e); }
})();

/* ===== SKILL CARD BAR FILL ===== */
(function(){
  try {
  const bars = document.querySelectorAll('.scard-bar-fill');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.width = entry.target.dataset.pct + '%';
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.4});
  bars.forEach(b=>io.observe(b));
  } catch(e){ console.error(e); }
})();

/* ===== SCROLL REVEAL ===== */
(function(){
  try {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); } });
  }, {threshold:0.15});
  els.forEach(el=>io.observe(el));
  } catch(e){ console.error(e); }
})();

/* ===== DECK FLIP + NAV ===== */
(function(){
  try {
  document.querySelectorAll('.deck-card').forEach(card=>{
    card.querySelectorAll('.deck-flip-btn').forEach(btn=>{
      btn.addEventListener('click', ()=> card.classList.toggle('flipped'));
    });
  });
  const track = document.getElementById('deckTrack');
  document.getElementById('deckNext').addEventListener('click', ()=> track.scrollBy({left:390, behavior:'smooth'}));
  document.getElementById('deckPrev').addEventListener('click', ()=> track.scrollBy({left:-390, behavior:'smooth'}));
  } catch(e){ console.error(e); }
})();

/* ===== PROJECT CARD MINI VISUALS ===== */
(function(){
  try {
  function drawBars(id){
    const c = document.getElementById(id); const ctx = c.getContext('2d');
    function fit(){ c.width = c.clientWidth*2; c.height = c.clientHeight*2; ctx.setTransform(2,0,0,2,0,0); }
    fit();
    const w=c.clientWidth,h=c.clientHeight;
    const vals=[0.5,0.75,0.4,0.9,0.6,0.8,0.35,0.7];
    const bw = w/(vals.length*1.6);
    vals.forEach((v,i)=>{
      const x = i*(w/vals.length)+ (w/vals.length-bw)/2;
      const bh = v*h*0.78;
      const grad = ctx.createLinearGradient(0,h-bh,0,h);
      grad.addColorStop(0,'#FF7A45'); grad.addColorStop(1,'rgba(255,122,69,0.15)');
      ctx.fillStyle=grad; ctx.fillRect(x,h-bh,bw,bh);
    });
  }
  function drawTrend(id){
    const c = document.getElementById(id); const ctx = c.getContext('2d');
    c.width=c.clientWidth*2; c.height=c.clientHeight*2; ctx.setTransform(2,0,0,2,0,0);
    const w=c.clientWidth,h=c.clientHeight;
    const pts=[0.7,0.6,0.75,0.5,0.55,0.3,0.35,0.2,0.28,0.15];
    ctx.beginPath();
    pts.forEach((v,i)=>{ const x=(w/(pts.length-1))*i, y=v*h*0.85+h*0.08; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    const grad = ctx.createLinearGradient(0,0,w,0);
    grad.addColorStop(0,'#FF3D3D'); grad.addColorStop(1,'#FF7A45');
    ctx.strokeStyle=grad; ctx.lineWidth=2.4; ctx.stroke();
    pts.forEach((v,i)=>{ const x=(w/(pts.length-1))*i, y=v*h*0.85+h*0.08; ctx.beginPath(); ctx.arc(x,y,2.6,0,7); ctx.fillStyle='#FF7A45'; ctx.fill(); });
  }
  function drawParticles(id){
    const c = document.getElementById(id); const ctx = c.getContext('2d');
    c.width=c.clientWidth*2; c.height=c.clientHeight*2; ctx.setTransform(2,0,0,2,0,0);
    const w=c.clientWidth,h=c.clientHeight;
    const n=60, pts=[];
    for(let i=0;i<n;i++){ pts.push({x:Math.random()*w,y:Math.random()*h}); }
    ctx.strokeStyle='rgba(255,122,69,0.18)'; ctx.lineWidth=1;
    for(let i=0;i<n;i++){ for(let j=i+1;j<n;j++){ const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y; if(Math.sqrt(dx*dx+dy*dy)<38){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); } } }
    pts.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,1.8,0,7); ctx.fillStyle= Math.random()>0.5?'#FF7A45':'#FF3D3D'; ctx.fill(); });
  }
  drawBars('mockBars'); drawTrend('mockTrend'); drawParticles('mockParticle');
  } catch(e){ console.error(e); }
})();

/* ===== CONTACT TERMINAL ===== */
(function(){
  try {
  const form = document.getElementById('contactForm');
  const packet = document.getElementById('packetDot');
  const response = document.getElementById('termResponse');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('cfName').value.trim();
    const fromEmail = document.getElementById('cfEmail').value.trim();
    const msg = document.getElementById('cfMsg').value.trim();

    const subject = encodeURIComponent('Portfolio contact from ' + (name || 'website visitor'));
    const body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + fromEmail + '\n\n' +
      msg
    );
    const gmailLink = 'https://mail.google.com/mail/?view=cm&fs=1&to=nehabawankar88@gmail.com&su=' + subject + '&body=' + body;

    // Open immediately, synchronously, inside the click — browsers block
    // popups opened after a delay (e.g. from setTimeout), so this must
    // happen right here, not after the animation below.
    // Open using a real anchor click (not window.open) — this is treated as
    // a genuine user-initiated navigation and is far less likely to be
    // blocked by popup blockers or sandboxed preview environments.
    const mailAnchor = document.createElement('a');
    mailAnchor.href = gmailLink;
    mailAnchor.target = '_blank';
    mailAnchor.rel = 'noopener';
    document.body.appendChild(mailAnchor);
    mailAnchor.click();
    document.body.removeChild(mailAnchor);

    response.innerHTML = '';
    packet.style.opacity = 1;
    packet.style.left = '0%';
    packet.style.transition = 'left 1.1s cubic-bezier(.4,.1,.2,1)';
    requestAnimationFrame(()=>{ packet.style.left = '100%'; });

    const lines = [
      'encrypting payload... AES-256',
      'routing packet to nehabawankar88@gmail.com...',
      'handshake accepted',
      'mail compose window opened'
    ];
    lines.forEach((text, i)=>{
      setTimeout(()=>{
        const d = document.createElement('div');
        d.textContent = '> '+text;
        response.appendChild(d);
      }, 300 + i*380);
    });

    setTimeout(()=>{
      const thanks = document.createElement('div');
      thanks.textContent = '✓ Thank you for contacting me — I\'ll get back to you soon!';
      thanks.style.cssText = 'color:var(--amber);font-weight:700;margin-top:8px;';
      response.appendChild(thanks);

      const fallback = document.createElement('a');
      fallback.href = gmailLink;
      fallback.target = '_blank';
      fallback.rel = 'noopener';
      fallback.textContent = 'Gmail not opening? Click here to send manually →';
      fallback.style.cssText = 'display:inline-block;margin-top:8px;color:var(--teal);text-decoration:underline;';
      response.appendChild(fallback);
    }, 300 + lines.length*380 + 200);

    setTimeout(()=>{
      packet.style.transition = 'none';
      packet.style.opacity = 0;
      packet.style.left = '0%';
      form.reset();
    }, 300 + lines.length*380 + 400);
  });
  } catch(e){ console.error(e); }
})();