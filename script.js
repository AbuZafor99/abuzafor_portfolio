// Interactive Background: ambient glitter that drifts, drags gently toward
// the cursor when nearby, and ripples outward like water when clicked.
(function(){
  var c=document.getElementById('particles-bg');
  if(!c)return;
  var ctx=c.getContext('2d');
  var reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var pts=[],ripples=[];
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
  }
  P.prototype.up=function(){
    if(mouse.active){
      var dx=mouse.x-this.x,dy=mouse.y-this.y,d=Math.sqrt(dx*dx+dy*dy),r=160;
      if(d<r&&d>.01){var pull=(1-d/r)*.045;this.vx+=(dx/d)*pull;this.vy+=(dy/d)*pull;}
    }
    for(var i=0;i<ripples.length;i++){
      var rp=ripples[i],dx2=this.x-rp.x,dy2=this.y-rp.y,d2=Math.sqrt(dx2*dx2+dy2*dy2),edge=Math.abs(d2-rp.radius);
      if(edge<28){var f=(1-edge/28)*rp.strength;this.vx+=(dx2/(d2||1))*f;this.vy+=(dy2/(d2||1))*f;}
    }
    this.x+=this.vx;this.y+=this.vy;
    this.vx+=(this.bvx-this.vx)*.02;
    this.vy+=(this.bvy-this.vy)*.02;
    if(this.x<-10)this.x=c.width+10;if(this.x>c.width+10)this.x=-10;
    if(this.y<-10)this.y=c.height+10;if(this.y>c.height+10)this.y=-10;
  };
  P.prototype.dr=function(){
    ctx.beginPath();ctx.arc(this.x,this.y,Math.max(.1,this.sz),0,Math.PI*2);
    ctx.fillStyle='rgba(0,229,160,'+this.op+')';ctx.fill();
  };

  var n=innerWidth<768?30:60;
  for(var i=0;i<n;i++)pts.push(new P());

  function ln(){
    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){
      var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<90){
        ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle='rgba(0,229,160,'+(1-d/90)*.06+')';ctx.lineWidth=.5;ctx.stroke();
      }
    }
  }

  function drawRipples(){
    for(var i=ripples.length-1;i>=0;i--){
      var r=ripples[i];
      r.radius+=r.speed;r.life--;
      if(r.life<=0){ripples.splice(i,1);continue;}
      var a=Math.max(0,r.life/r.maxLife)*.35;
      r.strength=r.baseStrength*(r.life/r.maxLife);
      ctx.beginPath();ctx.arc(r.x,r.y,r.radius,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,229,160,'+a+')';ctx.lineWidth=1.4;ctx.stroke();
      ctx.beginPath();ctx.arc(r.x,r.y,Math.max(0,r.radius-14),0,Math.PI*2);
      ctx.strokeStyle='rgba(77,195,255,'+(a*.6)+')';ctx.lineWidth=1;ctx.stroke();
    }
  }

  function spawnRipple(x,y){
    if(ripples.length>4)ripples.shift();
    ripples.push({x:x,y:y,radius:4,speed:3.2,life:46,maxLife:46,baseStrength:1.6,strength:1.6});
  }

  addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;},{passive:true});
  document.addEventListener('mouseleave',function(){mouse.active=false;});
  addEventListener('touchmove',function(e){if(e.touches&&e.touches[0]){mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY;mouse.active=true;}},{passive:true});
  addEventListener('click',function(e){spawnRipple(e.clientX,e.clientY);});
  addEventListener('touchstart',function(e){if(e.touches&&e.touches[0])spawnRipple(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});

  function an(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach(function(p){p.up();p.dr();});
    ln();drawRipples();
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