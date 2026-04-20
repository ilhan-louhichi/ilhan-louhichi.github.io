
// particles.js alternative - simple canvas particles with connecting lines (blue neon)
(function(){
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h, ratio = window.devicePixelRatio || 1;

  function resize(){ 
    w = canvas.width = window.innerWidth * ratio;
    h = canvas.height = window.innerHeight * ratio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  window.addEventListener('resize', resize);
  resize();

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function init(){
    particles = [];
    const count = Math.floor((w*h)/(120000)); // adjust density
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: rand(-0.3,0.3)*ratio,
        vy: rand(-0.3,0.3)*ratio,
        r: rand(0.6,1.6)*ratio,
        alpha: rand(0.3,0.9)
      });
    }
  }

  function render(){
    ctx.clearRect(0,0,w,h);
    // subtle vignette
    ctx.fillStyle = 'rgba(0,6,12,0.15)';
    ctx.fillRect(0,0,w,h);

    // draw particles
    for(let p of particles){
      ctx.beginPath();
      ctx.fillStyle = 'rgba(10,160,255,'+p.alpha+')';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(10,160,255,0.9)';
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // draw lines between close particles
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if(d < 140*ratio){
          const alpha = 1 - d/(140*ratio);
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(26,115,255,'+ (alpha*0.6) +')';
          ctx.lineWidth = 1 * ratio;
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
  }

  function step(){
    for(let p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
    }
    render();
    requestAnimationFrame(step);
  }

  // add interactive mouse particle
  let mouse = {x:-9999,y:-9999};
  window.addEventListener('mousemove', e=>{
    mouse.x = e.clientX * ratio;
    mouse.y = e.clientY * ratio;
    // add a particle near mouse occasionally
    if(Math.random() < 0.3 && particles.length < 200){
      particles.push({x:mouse.x + (Math.random()-0.5)*40, y:mouse.y + (Math.random()-0.5)*40, vx:rand(-0.6,0.6), vy:rand(-0.6,0.6), r:1.2*ratio, alpha:0.9});
    }
  });

  init();
  step();

  // re-init on high-dpi change
  setInterval(()=>{ if(window.devicePixelRatio !== ratio){ ratio = window.devicePixelRatio; resize(); init(); }}, 2000);
})();
