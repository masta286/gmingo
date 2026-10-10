const canvas=document.getElementById("game"),ctx=canvas.getContext("2d");
const scoreEl=document.getElementById("score"),waveEl=document.getElementById("wave"),bestEl=document.getElementById("best");
const startScreen=document.getElementById("startScreen"),gameOver=document.getElementById("gameOver"),finalScore=document.getElementById("finalScore");
const W=canvas.width,H=canvas.height;
let keys={},running=false,last=0,score=0,wave=1,best=Number(localStorage.neonBest||0);
let player,bullets,enemies,particles,stars,spawnTimer=0,shootTimer=0,dashTimer=0,waveTimer=0;

bestEl.textContent=best;
stars=Array.from({length:130},()=>({x:Math.random()*W,y:Math.random()*H,s:.4+Math.random()*1.8}));

function reset(){
 score=0;wave=1;spawnTimer=0;shootTimer=0;dashTimer=0;waveTimer=0;
 player={x:W/2,y:H-90,r:18,speed:290,hp:100};
 bullets=[];enemies=[];particles=[];
 updateStats();
}
function updateStats(){scoreEl.textContent=score;waveEl.textContent=wave;bestEl.textContent=best}

function start(){reset();running=true;startScreen.classList.add("hidden");gameOver.classList.add("hidden");last=performance.now();requestAnimationFrame(loop)}
function end(){running=false;finalScore.textContent=score;if(score>best){best=score;localStorage.neonBest=best}bestEl.textContent=best;gameOver.classList.remove("hidden")}

function shoot(){
 if(shootTimer>0)return;
 bullets.push({x:player.x,y:player.y-22,vx:0,vy:-650,r:4});
 shootTimer=.16;
}
function dash(){
 if(dashTimer>0)return;
 player.y-=90;dashTimer=1.2;
 burst(player.x,player.y,20,"dash");
}
function spawnEnemy(){
 const type=Math.random();
 const fast=type<.22;
 enemies.push({
   x:30+Math.random()*(W-60),y:-35,r:fast?13:18,
   speed:(fast?120:65)+wave*7,hp:fast?1:2+Math.floor(wave/4),
   phase:Math.random()*7,fast
 });
}
function burst(x,y,n,color){
 for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=30+Math.random()*180;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.35+Math.random()*.45,color})}
}
function hitEnemy(e){
 e.hp--;burst(e.x,e.y,7,e.fast?"#ff416c":"#8a6cff");
 if(e.hp<=0){score+=e.fast?80:120;burst(e.x,e.y,22,"#35e7ff");return true}return false;
}

function update(dt){
 const left=keys.ArrowLeft||keys.a||keys.A,right=keys.ArrowRight||keys.d||keys.D;
 const up=keys.ArrowUp||keys.w||keys.W,down=keys.ArrowDown||keys.s||keys.S;
 let dx=(right?1:0)-(left?1:0),dy=(down?1:0)-(up?1:0);
 const len=Math.hypot(dx,dy)||1;
 player.x+=dx/len*player.speed*dt;player.y+=dy/len*player.speed*dt;
 player.x=Math.max(25,Math.min(W-25,player.x));player.y=Math.max(40,Math.min(H-35,player.y));
 if(keys[" "]||keys.Space)shoot(); if(keys.Shift)dash();
 shootTimer=Math.max(0,shootTimer-dt);dashTimer=Math.max(0,dashTimer-dt);
 spawnTimer-=dt;waveTimer+=dt;
 if(spawnTimer<=0){spawnEnemy();spawnTimer=Math.max(.22,1.0-wave*.035)}
 if(waveTimer>18){wave++;waveTimer=0;burst(W/2,90,35,"#35e7ff")}
 bullets.forEach(b=>b.y+=b.vy*dt);bullets=bullets.filter(b=>b.y>-20);
 enemies.forEach(e=>{e.y+=e.speed*dt;e.x+=Math.sin(e.phase+e.y*.015)*25*dt});
 for(let i=enemies.length-1;i>=0;i--){
   const e=enemies[i];
   for(let j=bullets.length-1;j>=0;j--){
     const b=bullets[j];
     if(Math.hypot(e.x-b.x,e.y-b.y)<e.r+b.r){
       bullets.splice(j,1);if(hitEnemy(e))enemies.splice(i,1);break;
     }
   }
   if(!enemies[i])continue;
   if(Math.hypot(e.x-player.x,e.y-player.y)<e.r+player.r){
     player.hp-=25;burst(player.x,player.y,18,"#ff416c");enemies.splice(i,1);
     if(player.hp<=0){end();return}
   }else if(e.y>H+30){player.hp-=15;enemies.splice(i,1);if(player.hp<=0){end();return}}
 }
 particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;p.life-=dt});
 particles=particles.filter(p=>p.life>0);
 stars.forEach(s=>{s.y+=(15+s.s*25)*dt;if(s.y>H)s.y=0});
 updateStats();
}

function draw(){
 ctx.clearRect(0,0,W,H);
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#050b19");g.addColorStop(1,"#02040b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.fillStyle="#b8e9ff";stars.forEach(s=>{ctx.globalAlpha=.25+s.s*.18;ctx.fillRect(s.x,s.y,s.s,s.s*2)});ctx.globalAlpha=1;

 bullets.forEach(b=>{ctx.shadowBlur=18;ctx.shadowColor="#35e7ff";ctx.fillStyle="#d9fbff";ctx.fillRect(b.x-2,b.y-10,4,18);ctx.shadowBlur=0});
 enemies.forEach(e=>{
   ctx.save();ctx.translate(e.x,e.y);ctx.rotate(Math.sin(e.y*.02)*.4);
   ctx.shadowBlur=20;ctx.shadowColor=e.fast?"#ff416c":"#7a5cff";ctx.strokeStyle=e.fast?"#ff416c":"#947cff";ctx.lineWidth=3;
   ctx.fillStyle="#11142b";ctx.beginPath();ctx.moveTo(0,-e.r);ctx.lineTo(e.r,e.r);ctx.lineTo(0,e.r*.45);ctx.lineTo(-e.r,e.r);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
 });
 ctx.save();ctx.translate(player.x,player.y);ctx.shadowBlur=25;ctx.shadowColor="#35e7ff";ctx.fillStyle="#082535";ctx.strokeStyle="#5df1ff";ctx.lineWidth=3;
 ctx.beginPath();ctx.moveTo(0,-25);ctx.lineTo(19,20);ctx.lineTo(0,13);ctx.lineTo(-19,20);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle="#ff3f82";ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.restore();

 particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life*1.8);ctx.fillStyle=p.color;ctx.fillRect(p.x-2,p.y-2,4,4)});ctx.globalAlpha=1;

 // health bar
 ctx.fillStyle="#0d1828";ctx.fillRect(20,20,180,12);ctx.fillStyle="#35e7ff";ctx.fillRect(20,20,180*Math.max(0,player.hp/100),12);
 ctx.strokeStyle="#34516c";ctx.strokeRect(20,20,180,12);ctx.fillStyle="#7890a8";ctx.font="11px Arial";ctx.fillText("HULL",20,48);
}

function loop(t){if(!running)return;const dt=Math.min(.033,(t-last)/1000);last=t;update(dt);draw();requestAnimationFrame(loop)}
window.addEventListener("keydown",e=>{keys[e.key]=true;if([" ","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key))e.preventDefault()});
window.addEventListener("keyup",e=>keys[e.key]=false);
document.getElementById("startBtn").onclick=start;
document.getElementById("restartBtn").onclick=start;
document.getElementById("mobileShoot").ontouchstart=e=>{e.preventDefault();shoot()};
document.querySelectorAll(".mobile-controls button[data-key]").forEach(b=>{
 const k=b.dataset.key;
 b.addEventListener("touchstart",e=>{e.preventDefault();keys[k]=true});
 b.addEventListener("touchend",e=>{e.preventDefault();keys[k]=false});
});
reset();draw();
