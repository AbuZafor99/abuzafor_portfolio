// Interactive Background: dense ambient glitter that trails the cursor
// and, on click, a real water-drop moment — droplets burst up and fall
// with gravity (actual vertical motion reads as 3D far better than a flat
// circle), then organic wavy, directionally-shaded rings settle outward.
(function(){
  var c=document.getElementById('particles-bg');
  if(!c)return;
  var ctx=c.getContext('2d');
  var reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var pts=[],ripples=[],flashes=[],droplets=[];
  var mouse={x:-9999,y:-9999,active:false};

  function rs(){c.width=innerWidth;c.height=innerHeight;}
  rs();
  addEventListener('resize',rs);

  function P(){
    this.x=Math.random()*c.width;
    this.y=Math.random()*c.height;
    this.sz=Math.random()*1.6+.5;
    this.bvx=(Math.random()-.5)*.25;
    this.bvy=(Math.random()-.5)*.25;
    this.vx=this.bvx;
    this.vy=this.bvy;
    this.op=Math.random()*.45+.12;
    this.boost=0;
  }
  P.prototype.up=function(){
    if(mouse.active){
      var dx=mouse.x-this.x,dy=mouse.y-this.y,d=Math.sqrt(dx*dx+dy*dy),r=220;
      if(d<r&&d>.01){
        var t=1-d/r,pull=t*t*.14;
        this.vx+=(dx/d)*pull;this.vy+=(dy/d)*pull;
        if(t>this.boost)this.boost=t;
      }
    }
    for(var i=0;i<ripples.length;i++){
      var rp=ripples[i],dx2=this.x-rp.x,dy2=this.y-rp.y,d2=Math.sqrt(dx2*dx2+dy2*dy2),edge=Math.abs(d2-rp.radius);
      if(edge<30){var f=(1-edge/30)*rp.strength;this.vx+=(dx2/(d2||1))*f;this.vy+=(dy2/(d2||1))*f;}
    }
    this.x+=this.vx;this.y+=this.vy;
    this.vx+=(this.bvx-this.vx)*.012;
    this.vy+=(this.bvy-this.vy)*.012;
    this.boost*=.94;
    if(this.x<-10)this.x=c.width+10;if(this.x>c.width+10)this.x=-10;
    if(this.y<-10)this.y=c.height+10;if(this.y>c.height+10)this.y=-10;
  };
  P.prototype.dr=function(){
    var sz=this.sz+this.boost*2,op=Math.min(1,this.op+this.boost*.6);
    ctx.beginPath();ctx.arc(this.x,this.y,Math.max(.1,sz),0,Math.PI*2);
    ctx.fillStyle='rgba(0,229,160,'+op+')';ctx.fill();
  };

  var n=innerWidth<768?90:190;
  for(var i=0;i<n;i++)pts.push(new P());

  function ln(){
    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){
      var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<85){
        ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle='rgba(0,229,160,'+(1-d/85)*.05+')';ctx.lineWidth=.5;ctx.stroke();
      }
    }
  }

  // The click "drop": a burst of droplets shoot up and outward then fall
  // back with gravity — real vertical motion is what actually reads as 3D —
  // followed by 3 staggered, decelerating rings that settle outward.
  function spawnRipple(x,y){
    if(ripples.length>9)ripples.splice(0,ripples.length-9);
    for(var k=0;k<3;k++){
      ripples.push({x:x,y:y,radius:0,wait:k*5,speed:3.6-k*.5,life:54+k*10,maxLife:54+k*10,baseStrength:1.8-k*.5,strength:1.8-k*.5,seed:Math.random()*10});
    }
    if(flashes.length>3)flashes.shift();
    flashes.push({x:x,y:y,life:16,maxLife:16});

    if(droplets.length>60)droplets.splice(0,droplets.length-60);
    var dc=12;
    for(var d=0;d<dc;d++){
      var ang=(Math.PI*2*d/dc)+(Math.random()-.5)*.5;
      var spd=1.3+Math.random()*1.7;
      droplets.push({
        x:x,y:y,
        vx:Math.cos(ang)*spd,
        vy:Math.sin(ang)*spd*.4-2.4-Math.random()*1.3,
        life:0,maxLife:24+Math.random()*10,
        sz:.8+Math.random()*1.3
      });
    }
  }

  function updateDroplets(){
    for(var i=droplets.length-1;i>=0;i--){
      var dp=droplets[i];
      dp.vy+=.2;
      dp.x+=dp.vx;dp.y+=dp.vy;
      dp.life++;
      if(dp.life>=dp.maxLife){droplets.splice(i,1);continue;}
      var a=1-dp.life/dp.maxLife;
      ctx.beginPath();ctx.arc(dp.x,dp.y,Math.max(.1,dp.sz*a+.3),0,Math.PI*2);
      ctx.fillStyle='rgba(190,255,235,'+(a*.85)+')';
      ctx.fill();
    }
  }

  // organic wavy ring (not a perfect circle) with directional shading so it
  // reads as a raised, lit surface rather than a flat drawn line
  function ringPath(x,y,radius,squash,wob,seed,inset){
    radius=Math.max(0,radius-inset);
    var steps=40;
    ctx.beginPath();
    for(var s=0;s<=steps;s++){
      var ang=(s/steps)*Math.PI*2;
      var rad=radius+Math.sin(ang*3+seed)*wob;
      var px=x+Math.cos(ang)*rad;
      var py=y+Math.sin(ang)*rad*squash;
      if(s===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.closePath();
  }

  function drawRipples(){
    for(var i=ripples.length-1;i>=0;i--){
      var r=ripples[i];
      if(r.wait>0){r.wait--;continue;}
      r.radius+=r.speed;
      r.speed*=.985;
      r.life--;
      if(r.life<=0){ripples.splice(i,1);continue;}
      var a=Math.max(0,r.life/r.maxLife)*.42;
      r.strength=r.baseStrength*(r.life/r.maxLife);
      var age=1-r.life/r.maxLife;
      var squash=.38+.2*age;
      var wob=Math.min(3,r.radius*.05);

      ringPath(r.x,r.y+2.5,r.radius,squash,wob,r.seed,0);
      ctx.strokeStyle='rgba(0,0,0,'+(a*.35)+')';ctx.lineWidth=2;ctx.stroke();

      ringPath(r.x,r.y,r.radius,squash,wob,r.seed,0);
      ctx.strokeStyle='rgba(0,229,160,'+a+')';ctx.lineWidth=1.6;ctx.stroke();

      ringPath(r.x-1,r.y-1,r.radius,squash,wob*.6,r.seed,10);
      ctx.strokeStyle='rgba(190,255,235,'+(a*.7)+')';ctx.lineWidth=1;ctx.stroke();

      ringPath(r.x,r.y,r.radius,squash,wob*.6,r.seed+2,20);
      ctx.strokeStyle='rgba(77,195,255,'+(a*.45)+')';ctx.lineWidth=1;ctx.stroke();
    }
  }

  function drawFlashes(){
    for(var i=flashes.length-1;i>=0;i--){
      var f=flashes[i];f.life--;
      if(f.life<=0){flashes.splice(i,1);continue;}
      var a=f.life/f.maxLife,rad=20*a+2;
      var g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,rad);
      g.addColorStop(0,'rgba(255,255,255,'+(.6*a)+')');
      g.addColorStop(.4,'rgba(0,229,160,'+(.4*a)+')');
      g.addColorStop(1,'rgba(0,229,160,0)');
      ctx.beginPath();ctx.arc(f.x,f.y,rad,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
    }
  }

  addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;},{passive:true});
  document.addEventListener('mouseleave',function(){mouse.active=false;});
  addEventListener('touchmove',function(e){if(e.touches&&e.touches[0]){mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY;mouse.active=true;}},{passive:true});
  addEventListener('click',function(e){spawnRipple(e.clientX,e.clientY);});
  addEventListener('touchstart',function(e){if(e.touches&&e.touches[0])spawnRipple(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});

  function an(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach(function(p){p.up();p.dr();});
    ln();drawRipples();updateDroplets();drawFlashes();
    requestAnimationFrame(an);
  }
  if(!reduced)an();else pts.forEach(function(p){p.dr();});
})();

// 3D Tilt on Project Cards
document.querySelectorAll('[data-tilt]').forEach(function(c){c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+x*8+'deg) rotateX('+(-y*8)+'deg) translateZ(6px)';});c.addEventListener('mouseleave',function(){c.style.transform='';});});

// Navbar Active State & Shadow
(function(){var nb=document.getElementById('navbar'),nls=document.querySelectorAll('.nav-links a'),secs=document.querySelectorAll('section');addEventListener('scroll',function(){nb.classList.toggle('scrolled',scrollY>50);var cur='';secs.forEach(function(s){if(scrollY>=s.offsetTop-100)cur=s.id;});nls.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+cur);});});})();

// Mobile Menu
(function(){var h=document.getElementById('hamburger'),m=document.getElementById('mobMenu'),o=false;h.addEventListener('click',function(){o=!o;m.classList.toggle('open',o);h.children[0].style.transform=o?'rotate(45deg) translate(5px,5px)':'';h.children[1].style.opacity=o?'0':'';h.children[2].style.transform=o?'rotate(-45deg) translate(5px,-5px)':'';});m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){o=false;m.classList.remove('open');h.children[0].style.transform='';h.children[1].style.opacity='';h.children[2].style.transform='';});});})();

// Scroll Reveal (exposed so dynamically rendered sections can register too)
(function(){var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.1,rootMargin:'0px 0px -50px 0px'});window.__observeReveals=function(root){(root||document).querySelectorAll('.reveal:not(.visible)').forEach(function(el){obs.observe(el);});};window.__observeReveals();})();

// Experience Counter (start date is admin-managed via profile.experienceStart)
(function(){var st=(window.SITE_DATA&&window.SITE_DATA.profile&&window.SITE_DATA.profile.experienceStart)||'2025-09-01',sd=new Date(st),nw=new Date();if(isNaN(sd))sd=new Date(2025,8,1);var df=nw-sd,dd=Math.floor(df/(1e3*60*60*24)),mo=Math.floor(dd/30.44),rd=Math.floor(dd-mo*30.44),el=document.getElementById('expCounter'),lb=document.getElementById('expLabel');if(mo<12){el.dataset.target=mo;lb.textContent='Months Experience';if(rd>15)el.dataset.target=mo+1;}else{var yr=Math.floor(mo/12),rm=mo%12;el.dataset.target=yr;if(rm>0)lb.textContent='Years '+rm+'+ Months Experience';else lb.textContent='Years Experience';}var done=new Set();var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!done.has(e.target)){done.add(e.target);var t=parseInt(e.target.dataset.target),c=0,s=Math.max(1,t/60);(function cnt(){c+=s;if(c>=t)e.target.textContent=t+(e.target.id==='expCounter'?'+':'');else{e.target.textContent=Math.floor(c);requestAnimationFrame(cnt);}})();}});},{threshold:0.5});document.querySelectorAll('.sc-num[data-target]').forEach(function(c){obs.observe(c);});})();

// Scroll Progress Bar
(function(){var b=document.getElementById('scrollBar');addEventListener('scroll',function(){var s=scrollY,t=document.documentElement.scrollHeight-innerHeight;b.style.width=(s/t*100)+'%';});})();

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var href=this.getAttribute('href');if(href==='#')return;e.preventDefault();var t=document.querySelector(href);if(t)t.scrollIntoView({behavior:'smooth',block:'start'});});});