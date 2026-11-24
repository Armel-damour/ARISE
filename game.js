const cv=document.getElementById('c'),c=cv.getContext('2d'),rs=document.getElementById('rs'),mb=document.getElementById('mute'),pb=document.getElementById('pause'),sb=document.getElementById('stop'),W=800,H=420,G=350;
let SC=1,LQ=false;try{LQ=localStorage.getItem('sjw_lq')=='1'}catch(e){}
if(typeof CanvasRenderingContext2D!='undefined'){const d=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'shadowBlur');if(d)Object.defineProperty(c,'shadowBlur',{get(){return d.get.call(c)},set(v){d.set.call(c,LQ?0:v)},configurable:true})}
function resize(){const r=cv.getBoundingClientRect(),dp=Math.min(window.devicePixelRatio||1,2.5);SC=Math.max(.5,r.width/W*dp);cv.width=Math.round(W*SC);cv.height=Math.round(H*SC)}

const R=['Greek','Norse','Celtic & British','African','Asian & Middle East','American'];
const T=[[0,'Medusa','mage',0,340,2.6,15,'#4f8a4f',1],[0,'Minotaur','goblin',1,900,2.5,38,'#7a4a2a',1.5],[0,'Lernaean Hydra','mage',1,1000,2.2,30,'#2a7a6a',1.5],[0,'Cerberus','goblin',1,950,2.8,36,'#3a2a2a',1.5],[0,'Chimera','dragon',0,560,3.4,22,'#c0602a',.9],[0,'Cyclops','goblin',1,1000,2.2,42,'#8a7a5a',1.6],[0,'Scylla','mage',0,360,2.6,16,'#2a5a9a',1],[0,'Typhon','dragon',1,1500,2.4,48,'#5a2a7a',1.9],[0,'Sphinx','mage',0,330,2.7,14,'#c9a24a',.95],[0,'Talos','goblin',1,1100,2,40,'#b08a3a',1.6],
[1,'Jörmungandr','dragon',1,1450,2.4,46,'#2a6a4a',1.9],[1,'Fenrir','goblin',1,1000,3,38,'#6a6a7a',1.5],[1,'Kraken','mage',1,1100,2.2,34,'#3a3a8a',1.6],[1,'Grendel','goblin',0,380,3.2,18,'#5a4a3a',1],[1,'Troll','goblin',1,900,2.2,34,'#6a6a5a',1.5],
[2,'Kelpie','goblin',0,260,3.8,13,'#2a6a8a',.9],[2,'Banshee','mage',0,300,2.8,14,'#9ab0d0',.95],[2,'Púca','goblin',0,250,3.9,12,'#3a3a3a',.85],[2,'Adze','dragon',0,520,3.8,20,'#d0b02a',.8],
[3,'Grootslang','goblin',1,1050,2.3,40,'#5a6a3a',1.6],[3,'Impundulu','dragon',0,540,3.6,22,'#3a6aff',.85],[3,'Tokoloshe','goblin',0,240,3.9,12,'#4a3a2a',.8],[3,'Ninki Nanka','dragon',0,580,3.3,23,'#2a8a5a',.9],[3,'Kishi','goblin',0,360,3.3,17,'#a04a4a',1],
[4,'Oni','goblin',1,950,2.5,38,'#b02a2a',1.5],[4,'Kitsune','mage',0,340,3,15,'#d0702a',1],[4,'Gumiho','mage',0,350,2.9,16,'#e0a0c0',1],[4,'Manticore','goblin',0,400,3.2,20,'#b0602a',1.1],[4,'Aqrabuamelu','goblin',1,1000,2.4,38,'#9a7a3a',1.5],
[5,'Wendigo','goblin',1,1300,2.8,44,'#8a9a9a',1.7]];
const foes=T.map(([r,n,type,pw,hp,sp,d,col,sc])=>({n,r:R[r],type,kind:pw?'power':'speed',hp,sp,d,col,sc,king:!!pw,bw:{goblin:pw?34:14,mage:pw?36:30,dragon:pw?34:22}[type],hv:type=='dragon'?(pw?70:45):0}));
// every big monster is a king with a court of smaller monsters from its region
foes.forEach(f=>{if(f.king){const s=foes.filter(g=>!g.king&&g.r==f.r);f.court=s.length>1?s:foes.filter(g=>!g.king)}});
// ---- WORLDS: each gate in the hub leads to one of them ----
const WORLDS=[
 {n:'Shadow Realm',sky:['#140a26','#2a1448'],gnd:'#1b0f33',line:'#7a3cff',col:'#7a3cff',dk:'#1a0a38',info:'The original realm'},
 {n:'Frost Realm',sky:['#07162b','#1d4a6a'],gnd:'#1d3d55',line:'#bfeaff',col:'#7ad0ff',dk:'#0a2a4a',ice:1,info:'Ice: you slide when you run'},
 {n:'Ember Realm',sky:['#220804','#6a1e08'],gnd:'#2a0d08',line:'#ff6a1a',col:'#ff8a2a',dk:'#4a0a02',lava:1,info:'Lava geysers burst from the ground'}];
const GATEX=[170,400,630];
let world=0,wg=0,wt=0,lv=[],amb=[],at=0,cl=[],rb=[];
let K={},prev={},state='title',rnd=0,sel=0,em=[],sh=0,parts=[],fx=[],sd=[],army=[],fallen=null,paused=false,bolts=[],fb=[],pickSel=0,pickErr=0,ghosts=[],hs=0,waves=[],egh=[],xt=0,xa=0,P,E,msg='',mt=0,t=0;
const pr=k=>K[k]&&!prev[k];
const inGame=()=>state=='hub'||state=='warp'||state=='play'||state=='extract'||state=='absorb'||state=='pick'||state=='select';
function togglePause(){if(state=='pick'){closePick();return}if(!inGame())return;paused=!paused;K={};pb.textContent=paused?'▶ Resume':'⏸ Pause'}
function stopGame(){if(!inGame())return;paused=false;pb.textContent='⏸ Pause';K={};state='title';rs.hidden=true;parts=[];fx=[];sd=[];waves=[];egh=[];ghosts=[];lv=[];cl=[];rb=[];sh=0}
function drawPause(){c.fillStyle='#000a';c.fillRect(0,0,W,H);txt('PAUSED',190,48,'#b57bff');txt('Press P or Esc, or tap the game, to resume',240,18)}

function init(){rs.hidden=true;P={x:150,y:G,vx:0,vy:0,hp:100,mp:50,f:1,atk:0,inv:0,dom:0,hit:0,at:0,ct:0,al:12,lx:0,air:0,sl:0,lc:0,cast:0,cc:0,rc:0,rs:0,rt:0,rq:0,boost:0};rnd=0;world=0;loadArmy();startRound();sel=0;enterHub()}
const SAVE='sungjinwoo_army_v1';
function saveArmy(){try{localStorage.setItem(SAVE,JSON.stringify(army.map(s=>({n:s.n,lv:s.lv||1,max:s.max,dmg:s.dmg}))))}catch(e){}}
function loadArmy(){army=[];try{const a=JSON.parse(localStorage.getItem(SAVE)||'[]');if(Array.isArray(a))a.forEach(o=>{const f=o&&foes.find(f=>f.n==o.n);if(f){const m=Math.min(+o.max||100,3000);army.push({x:150,y:G,cd:0,life:1e9,a:0,fl:0,o:(Math.random()-.5)*50,perm:1,out:0,n:f.n,col:f.col,type:f.type,kind:f.kind,sc:f.sc,hv:f.type=='dragon'?(f.kind=='power'?70:45):0,max:m,hp:m,dmg:Math.min(+o.dmg||5,80),lv:Math.min(+o.lv||1,99)})}})}catch(e){}}
function startRound(){const f=foes[rnd];E=Object.assign({x:650,y:G,vx:0,vy:0,max:f.hp,f:-1,cd:70,wind:0,stun:0,hit:0,sw:0,dash:0,dc:0,moving:0,chain:0,ww:f.bw,fly:f.type=='dragon',hv:f.hv||0,hvT:f.hv||0,dv:0,fireNext:0,lift:0,lt:0,ly:0},f);fx=[];waves=[];egh=[];bolts=[];fb=[];em=[];lv=[];cl=[];rb=[];if(E.king)spawnGuards(2);E.y=E.fly?G-E.hv:G;P.x=150;P.rs=0;P.rq=0;P.hp=Math.min(100,P.hp+30);army.forEach(s=>{s.hp=s.max;s.out=0;s.fl=0});sd=[];msg='Battle: '+f.n;mt=120}
function spark(x,y,col,n,s){for(let i=0;i<n;i++){const a=Math.random()*6.28,v=Math.random()*(s||5)+1;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:30+Math.random()*20,c:col})}}

function dust(x,y,n){for(let i=0;i<n;i++)parts.push({x:x+(Math.random()-.5)*20,y:y-2,vx:(Math.random()-.5)*3,vy:-Math.random()*1.5,l:18+Math.random()*10,c:'#9a86c4'})}
// src = the attacker (P or a shadow soldier)
function hurtE(d,kb,src){
 if(state!='play')return;
 if(P.dom>0)d*=2;
 if(em.length&&src){const m=em.filter(m=>Math.abs(m.x-src.x)<120).sort((a,b)=>Math.abs(a.x-src.x)-Math.abs(b.x-src.x))[0];if(m){m.hp-=d*1.5;m.fl=6;m.x+=(Math.sign(m.x-src.x)||1)*(kb||10)*.5;spark(m.x,G-40,'#ffb06b',6);SFX.play('hit');return}}
 E.hp-=d;E.hit=8;E.x+=(Math.sign(E.x-src.x)||1)*(kb||10)*(E.kind=='power'?.4:1);
 if(src===P)P.mp=Math.min(100,P.mp+d*.4);
 spark(E.x,E.y-50,'#b57bff',src===P?10:4);SFX.play('hit');sh=Math.max(sh,src===P?4:1);
 if(E.hp<=0)die()}
// every kill (yours or a shadow's) pauses the game until you extract the shadow
function die(){em=[];cl=[];rb=[];fallen={n:E.n,col:E.col,d:E.d,hp:E.max,type:E.type,kind:E.kind,sc:E.sc};spark(E.x,E.y-50,'#b57bff',60,9);SFX.play('die');state='extract';xt=0;xa=0;mt=0;bolts=[];fb=[];sh=Math.max(sh,8)}
function extractShadow(){if(state!='extract')return;state='absorb';xa=0;SFX.play('arise')}
function finishExtract(){
 const hp=90+fallen.hp*.3;
 army.push({x:P.x,y:G,cd:0,life:1e9,hp:hp,max:hp,a:0,fl:0,o:(Math.random()-.5)*50,perm:1,out:0,dmg:4+fallen.d*.35,col:fallen.col,n:fallen.n,type:fallen.type,kind:fallen.kind,sc:fallen.sc,hv:fallen.type=='dragon'?(fallen.kind=='power'?70:45):0});
 const nw=army.pop(),old=army.find(s=>s.n==nw.n);
 if(old)old.lv=(old.lv||1)+1,old.max=Math.round(old.max*1.1),old.dmg*=1.1,old.hp=old.max;else{nw.lv=1;army.push(nw)}
 saveArmy();spark(P.x,P.y-60,'#ffd84a',40,7);
 startRound();sel=0;state='select';msg=old?old.n+' grows stronger (Lv '+old.lv+')!':nw.n+' joins Sung Jin Woo forever!';mt=110}
function mv(sp){const tg=K.left?-sp:K.right?sp:0;
 if(WORLDS[world].ice){P.iv=(P.iv||0)*.9+tg*.1;if(Math.abs(P.iv)<.1)P.iv=0;return P.iv}
 P.iv=0;return tg}
// ---- TELEKINESIS: lift an enemy into the air, then throw it down ----
function liftX(){return Math.max(40,Math.min(W-40,P.x+P.f*130))}
function startThrow(){E.lift=3;E.lt=0;E.vy=8;SFX.play('fear')}
function liftTick(){
 E.lt++;E.stun=0;E.wind=0;E.dash=0;E.dv=0;E.sw=0;E.moving=0;
 const top=G-(E.fly?215:190)+(E.sc>1.5?25:0);
 if(E.lift==1){const k=Math.min(1,E.lt/32);E.y=E.ly+(top-E.ly)*(1-(1-k)*(1-k));E.x+=(liftX()-E.x)*.08;
  if(E.lt%4==0)spark(E.x,E.y-30,'#b57bff',2,3);
  if(E.lt>=32){E.lift=2;E.lt=0}}
 else if(E.lift==2){E.y=top+Math.sin(E.lt*.25)*6;E.x+=(liftX()-E.x)*.08;
  if(E.lt%5==0)spark(E.x,E.y-40*E.sc,'#b57bff',3,3);
  if(E.lt>=75)startThrow()}
 else{E.vy+=3.2;E.y+=E.vy;
  fx.push({t:'line',x:E.x,y:E.y-60*E.sc-Math.random()*40,len:50,f:1,l:6});
  if(E.y>=G){
   E.y=G;E.vy=0;E.lift=0;E.hv=0;
   const d=(60+E.max*.08)*(P.dom>0?2:1);E.hp-=d;E.hit=12;E.stun=80;
   sh=Math.max(sh,22);hs=Math.max(hs,6);SFX.play('slam');dust(E.x,G,18);spark(E.x,G-30,'#b57bff',40,9);
   fx.push({t:'crack',x:E.x,l:70},{t:'ring',x:E.x,y:G-10,r:10,l:24});
   em.forEach(m=>{if(Math.abs(m.x-E.x)<150){m.hp-=90;m.fl=8}});
   P.lc=240;msg='SLAM! -'+Math.round(d);mt=70;
   if(E.hp<=0)die();return}}
 if(E.fly)E.hv=Math.max(0,G-E.y)}
function tryLift(){
 if(E.lift==2){startThrow();return}
 if(E.lift>0)return;
 if(P.lc>0){msg='Telekinesis is recharging…';mt=40;return}
 if(Math.abs(E.x-P.x)>320){msg='Too far to lift! Get closer';mt=40;return}
 E.lift=1;E.lt=0;E.ly=E.y;E.vy=0;SFX.play('fear');msg='TELEKINESIS!';mt=60;sh=Math.max(sh,6)}
function drawLift(){
 const hx=P.x+P.f*28,hy=P.y-112,ex=E.x,ey=E.y-45*E.sc;
 c.save();c.fillStyle='#0008';c.beginPath();c.ellipse(ex,G+3,Math.max(8,30*E.sc*(1-(G-E.y)/420)),6,0,0,6.28);c.fill();
 c.strokeStyle='#c9a8ff';c.shadowColor='#b57bff';c.shadowBlur=14;c.lineWidth=2;
 for(let k=0;k<3;k++){c.globalAlpha=.75-k*.2;c.beginPath();c.moveTo(hx,hy);
  for(let i=1;i<=10;i++){const u=i/10,w=Math.sin(u*3.14);c.lineTo(hx+(ex-hx)*u+Math.sin(t*.5+i+k*2)*8*w,hy+(ey-hy)*u+Math.cos(t*.4+i*1.3+k)*8*w)}c.stroke()}
 c.globalAlpha=.55;c.lineWidth=3;c.beginPath();c.ellipse(ex,ey,34*E.sc+Math.sin(t*.3)*4,52*E.sc,0,0,6.28);c.stroke();
 if(E.lift==3){c.strokeStyle='#ffd84a';c.globalAlpha=.8;for(let i=0;i<5;i++){c.beginPath();c.moveTo(ex+(i-2)*14,ey-60*E.sc-i*6);c.lineTo(ex+(i-2)*14,ey-150*E.sc-i*12);c.stroke()}}
 c.restore()}
// ---- SHADOW CLONE TECHNIQUE: two clones fight for you and draw enemy attacks ----
function poof(q){dust(q.x,G,10);spark(q.x,q.y-50,'#ffffff',16,5);SFX.play('poof')}
function tryClone(){
 if(P.cc>0){msg='Clone technique recharging…';mt=40;return}
 for(let i=0;i<2;i++){const q={x:Math.max(30,Math.min(W-30,P.x+(i?-1:1)*70)),y:G,f:P.f,hp:2,life:600,cd:12+i*10,at:0,atk:0,al:12,vx:0};cl.push(q);poof(q)}
 while(cl.length>4)poof(cl.shift());
 P.cc=360;msg='SHADOW CLONE TECHNIQUE!';mt=70;sh=Math.max(sh,4)}
function cloneTick(){
 cl.forEach(q=>{q.life--;q.cd--;q.vx=0;if(q.atk>0)q.atk--;
  const dx=E.x-q.x,ad=Math.abs(dx);q.f=Math.sign(dx)||1;
  if(ad>70+10*E.sc){q.x+=q.f*4;q.vx=4}
  else if(q.cd<=0&&Math.abs(E.y-q.y)<100){q.at=(q.at+1)%3;q.atk=q.al=q.at==2?18:12;q.cd=q.at==2?46:24;SFX.play('strike');
   fx.push({t:'slash',x:q.x+q.f*40,y:q.y-50,f:q.f,l:10,ty:q.at});hurtE([7,8,13][q.at],[8,10,22][q.at],q)}
  q.x=Math.max(20,Math.min(W-20,q.x))});
 cl=cl.filter(q=>{if(q.hp<=0||q.life<=0){poof(q);return false}return true})}
function drawClones(){
 cl.forEach(q=>{c.globalAlpha=Math.min(1,q.life/40)*.9;hero({x:q.x,y:q.y,f:q.f,vx:q.vx,atk:q.atk,al:q.al,at:q.at,dom:0,hit:0,ghost:2});c.globalAlpha=1;
  for(let i=0;i<2;i++){c.fillStyle=i<q.hp?'#7ad0ff':'#0008';c.fillRect(q.x-9+i*10,q.y-150,8,4)}})}
// ---- RASENGAN: charge a spinning sphere, rush forward and drive it into the enemy ----
function cx(v){return Math.max(30,Math.min(W-30,v))}
function tryRas(){
 if(P.rs)return;
 if(P.rc>0){msg='Rasengan recharging…';mt=40;return}
 P.rs=1;P.rt=0;P.rq=0;SFX.play('charge');msg=cl.length?'RASENGAN (a clone helps!)':'RASENGAN…';mt=45}
function rasBoom(h,f,boost){
 const g=h!==E,bx=h.x,by=g?G-50:E.y-50*E.sc;SFX.play('rasen');
 if(g){h.hp-=140;h.fl=8;h.x=cx(h.x+f*90);em.forEach(m=>{if(m!==h&&Math.abs(m.x-bx)<110){m.hp-=70;m.fl=8}});msg='RASENGAN!'}
 else{const d=(45+E.max*.06)*(boost?1.4:1)*(P.dom>0?2:1);E.hp-=d;E.hit=12;E.stun=Math.max(E.stun,45);E.wind=0;
  E.x=cx(E.x+f*(E.kind=='power'?70:130));em.forEach(m=>{if(Math.abs(m.x-bx)<130){m.hp-=70;m.fl=8}});msg='RASENGAN! -'+Math.round(d)}
 fx.push({t:'ras',x:bx,y:by,r:8,l:22},{t:'ras',x:bx,y:by,r:2,l:16});
 for(let i=0;i<48;i++){const a=i*.52,v=2+i*.13;parts.push({x:bx,y:by,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:34,c:i%2?'#7ad0ff':'#ffffff'})}
 dust(bx,G,10);sh=Math.max(sh,24);hs=Math.max(hs,8);mt=70;
 if(!g&&E.hp<=0)die()}
// the finished sphere leaves the hero's hand and flies at the enemy (it steers toward it)
function rasLaunch(){
 const boost=cl.length>0;if(boost)poof(cl.shift());
 rb.push({x:P.x+P.f*50,y:P.y-66,vx:P.f*13,vy:-1,f:P.f,boost:boost,l:100});
 P.rs=0;P.rq=0;P.rc=200;P.sl=Math.max(P.sl,6);SFX.play('step');SFX.play('rasen');msg='RASENGAN!';mt=40}
function rbTick(){
 for(const b of rb){
  if(state!='play')return;
  b.l--;const ty=E.y-50*E.sc,dx=E.x-b.x,dy=ty-b.y,dl=Math.hypot(dx,dy)||1;
  b.vx+=(dx/dl*13-b.vx)*.12;b.vy+=(dy/dl*13-b.vy)*.12;b.x+=b.vx;b.y+=b.vy;b.f=b.vx>=0?1:-1;
  parts.push({x:b.x-b.vx,y:b.y-b.vy,vx:(Math.random()-.5)*1.2,vy:(Math.random()-.5)*1.2,l:14,c:Math.random()<.5?'#7ad0ff':'#ffffff'});
  const gd=em.find(m=>Math.abs(m.x-b.x)<38&&Math.abs((G-50)-b.y)<70);
  if(gd){b.l=0;rasBoom(gd,b.f,b.boost);continue}
  if(Math.abs(E.x-b.x)<34+20*E.sc&&Math.abs(ty-b.y)<55*E.sc+20){b.l=0;rasBoom(E,b.f,b.boost);continue}
  if(b.l<=0||b.x<-40||b.x>W+40){b.l=0;spark(b.x,b.y,'#7ad0ff',14,5)}}
 rb=rb.filter(b=>b.l>0)}
function drawRb(){
 rb.forEach(b=>{c.save();c.translate(b.x,b.y);const r=20,rg=c.createRadialGradient(0,0,1,0,0,r);rg.addColorStop(0,'#fff');rg.addColorStop(.5,'#9fe4ff');rg.addColorStop(1,'rgba(40,140,255,0)');
  c.shadowColor='#7ad0ff';c.shadowBlur=26;c.fillStyle=rg;c.beginPath();c.arc(0,0,r,0,6.28);c.fill();c.shadowBlur=0;c.strokeStyle='#ffffffcc';c.lineWidth=2;
  for(let i=0;i<3;i++){c.beginPath();c.arc(0,0,r*(.4+i*.2),t*.7+i*2,t*.7+i*2+2.2);c.stroke()}c.restore()})}
function rasTick(){
 if(!P.rs)return;
 const ch=cl.length?14:28;P.atk=0;P.rt++;P.rq=Math.min(1,P.rt/ch);P.x=Math.max(20,Math.min(W-20,P.x-P.vx*.7));
 const hx=P.x+P.f*46,hy=P.y-66;
 if(P.rt%2==0){const a=Math.random()*6.28;parts.push({x:hx+Math.cos(a)*34,y:hy+Math.sin(a)*34,vx:-Math.cos(a)*1.7,vy:-Math.sin(a)*1.7-.1,l:18,c:'#7ad0ff'})}
 if(P.rt>=ch)rasLaunch()}
// ---- the hub with the gates ----
function enterHub(){
 state='hub';world=0;K={};sd=[];em=[];bolts=[];fb=[];waves=[];egh=[];fx=[];lv=[];amb=[];cl=[];rb=[];P.rs=0;P.rq=0;
 army.forEach(s=>{s.out=0;s.fl=0});
 P.x=70;P.y=G;P.vx=0;P.vy=0;P.iv=0;P.inv=0;P.hit=0;P.atk=0;P.dom=0;
 msg='Walk into a gate to enter a world';mt=0}
function goHub(){if(state=='select'||state=='play')enterHub()}
function gateNear(){for(let i=0;i<GATEX.length;i++)if(Math.abs(P.x-GATEX[i])<36)return i;return -1}
function enterGate(i){
 if(state!='hub'||i<0)return;
 wg=i;wt=0;state='warp';K={};SFX.play('arise');SFX.play('voice')}
function hubClick(e){
 const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width;
 for(let i=0;i<GATEX.length;i++)if(Math.abs(x-GATEX[i])<60){P.x=GATEX[i];P.f=1;enterGate(i);return}}
function tickHub(){
 freeMove();
 if(pr('jump')||pr('arise')){const g=gateNear();if(g>=0)enterGate(g)}
 parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.l--});parts=parts.filter(p=>p.l>0);
 fx.forEach(f=>{f.l--;if(f.r)f.r+=12});fx=fx.filter(f=>f.l>0);
 for(let i=0;i<GATEX.length;i++)if(t%4==0)parts.push({x:GATEX[i]+(Math.random()-.5)*60,y:G-Math.random()*150,vx:0,vy:-.6-Math.random(),l:34,c:WORLDS[i].col});
 if(sh>0)sh*=.85}
function tickWarp(){
 t++;wt++;const gx=GATEX[wg];
 P.x+=(gx-P.x)*.14;P.vx=0;P.y=G;P.f=gx>=P.x?1:-1;
 for(let i=0;i<3;i++)parts.push({x:gx+(Math.random()-.5)*80,y:G-Math.random()*150,vx:(gx-P.x)*.05+(Math.random()-.5),vy:-1-Math.random()*2,l:26,c:WORLDS[wg].col});
 parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.l--});parts=parts.filter(p=>p.l>0);
 if(wt>=60){
  world=wg;parts=[];fx=[];amb=[];K={};startRound();sel=0;state='select';
  P.x=150;P.y=G;P.iv=0;SFX.play('win');msg='You entered the '+WORLDS[world].n;mt=110}}
// ambient weather: snow in the Frost Realm, rising embers in the Ember Realm
function ambTick(){
 const w=WORLDS[state=='warp'?wg:world];
 if(state=='title'){amb=[];return}
 if(w.ice&&at++%2==0&&amb.length<110)amb.push({x:Math.random()*W,y:-4,vx:-.5+Math.random(),vy:.8+Math.random()*1.4,c:'#ffffff',s:2+Math.random()*2});
 if(w.lava&&at++%3==0&&amb.length<70)amb.push({x:Math.random()*W,y:G+2,vx:(Math.random()-.5)*.8,vy:-.6-Math.random()*1.6,c:Math.random()<.5?'#ff8a2a':'#ffd84a',s:2+Math.random()*2});
 amb.forEach(a=>{a.x+=a.vx;a.y+=a.vy;if(w.ice)a.vx+=Math.sin(a.y*.05)*.02});
 amb=amb.filter(a=>w.ice?a.y<G:a.y>-6)}
// lava geysers: telegraphed first, then they erupt and hurt anyone nearby, you, your shadows and the monster
function lavaTick(){
 if(!WORLDS[world].lava||state!='play')return;
 if(t%240==0)lv.push({x:60+Math.random()*(W-120),t:0});
 lv.forEach(o=>{o.t++;
  if(o.t==70){SFX.play('slam');sh=Math.max(sh,6);spark(o.x,G-20,'#ff6a1a',22,6);
   if(Math.abs(P.x-o.x)<32&&P.y>=G-30)hurtP(10);
   sd.forEach(q=>{if(Math.abs(q.x-o.x)<32&&q.type!='dragon')hurtS(q,12)});reap();
   if(!E.fly&&Math.abs(E.x-o.x)<40*E.sc){E.hit=8;E.hp-=14;spark(E.x,E.y-50,'#ff8a2a',10);if(E.hp<=0){die();return}}}});
 lv=lv.filter(o=>o.t<96)}
function drawLava(){
 lv.forEach(o=>{
  if(o.t<70){const k=o.t/70;c.save();c.translate(o.x,G+3);c.scale(1,.3);c.strokeStyle='rgba(255,'+Math.floor(200-150*k)+',40,'+(.35+.5*k)+')';c.lineWidth=3;
   c.beginPath();c.arc(0,0,34*(1-k*.2),0,6.28);c.stroke();c.beginPath();c.arc(0,0,34*k,0,6.28);c.stroke();c.restore()}
  else{const k=(o.t-70)/26,h=190*Math.sin(Math.min(1,k)*3.14)+10,gr=c.createLinearGradient(0,G-h,0,G);
   gr.addColorStop(0,'rgba(255,230,120,.9)');gr.addColorStop(.5,'rgba(255,120,30,.9)');gr.addColorStop(1,'rgba(200,40,10,.9)');
   c.fillStyle=gr;c.beginPath();c.moveTo(o.x-26,G);c.quadraticCurveTo(o.x-14,G-h*.8,o.x,G-h);c.quadraticCurveTo(o.x+14,G-h*.8,o.x+26,G);c.fill()}})}
function drawGate(i,gx){
 const w=WORLDS[i],top=G-130,near=state=='hub'&&Math.abs(P.x-gx)<36,pth=()=>{c.beginPath();c.moveTo(gx-41,G);c.lineTo(gx-41,top);c.arc(gx,top,41,Math.PI,0);c.lineTo(gx+41,G)};
 c.save();
 c.beginPath();c.moveTo(gx-34,G);c.lineTo(gx-34,top);c.arc(gx,top,34,Math.PI,0);c.lineTo(gx+34,G);c.closePath();c.save();c.clip();
 const gr=c.createRadialGradient(gx,G-90,4,gx,G-90,115);gr.addColorStop(0,'#fff');gr.addColorStop(.22,w.col);gr.addColorStop(1,w.dk);
 c.fillStyle=gr;c.fillRect(gx-40,top-40,80,200);c.strokeStyle='#fff';c.lineWidth=2;
 for(let k=0;k<5;k++){const r=8+((t*.7+k*13)%64);c.globalAlpha=Math.max(0,1-r/72)*.8;c.beginPath();c.ellipse(gx,G-90,r*.5,r*1.25,t*.03+k,0,4.6);c.stroke()}
 c.restore();c.globalAlpha=1;
 c.shadowColor=w.col;c.shadowBlur=near?34:16;c.strokeStyle='#241438';c.lineWidth=14;pth();c.stroke();
 c.shadowBlur=0;c.strokeStyle=w.col;c.lineWidth=2;pth();c.stroke();
 c.fillStyle=w.col;for(let k=0;k<4;k++)c.fillRect(gx-45,G-110+k*26,8,5),c.fillRect(gx+37,G-110+k*26,8,5);
 c.textAlign='center';c.font='bold 14px sans-serif';c.fillStyle='#fff';c.fillText(w.n.toUpperCase(),gx,top-52);
 c.font='10px sans-serif';c.fillStyle=w.col;c.fillText(i==0?'RETURN TO THE ORIGINAL':'NEW WORLD',gx,top-38);
 if(near&&state=='hub'&&Math.floor(t/20)%2==0){c.font='bold 12px sans-serif';c.fillStyle='#ffd84a';c.fillText('▲ / Enter',gx,G+22)}
 c.textAlign='left';c.restore()}
// the hero stays fully mobile while a shadow is being extracted
function freeMove(){
 t++;
 const sp=P.dom>0?6:4;
 P.vx=mv(sp);if(K.left)P.f=-1;if(K.right)P.f=1;
 if(K.jump&&P.y>=G){P.vy=P.dom>0?-16:-13;dust(P.x,G,6)}
 P.vy+=.7;P.y+=P.vy;if(P.y>G){P.y=G;P.vy=0}
 if(P.y>=G&&P.air){P.air=0;dust(P.x,G,8)}if(P.y<G)P.air=1;
 P.x=Math.max(20,Math.min(W-20,P.x+P.vx));
 if(P.atk>0)P.atk--;if(P.sl>0)P.sl--;if(P.inv>0)P.inv--;if(P.hit>0)P.hit--;if(P.dom>0)P.dom--;if(P.ct>0)P.ct--;
 P.mp=Math.min(100,P.mp+.05);
 if(pr('strike')&&P.atk<=3){P.at=P.ct>0?(P.at+1)%3:0;P.ct=34;const ty=P.at;P.atk=P.al=ty==2?18:12;SFX.play('strike');
  fx.push({t:'slash',x:P.x+P.f*40,y:P.y-50,f:P.f,l:10,ty:ty});P.lx=P.f*(ty==2?11:6)}
 if(P.atk>0)P.x=Math.max(20,Math.min(W-20,P.x+P.lx*P.atk/P.al));
 if(pr('step')&&P.mp>=10){P.mp-=10;const o=P.x;P.x=Math.max(20,Math.min(W-20,P.x+P.f*170));P.inv=18;SFX.play('step');P.sl=14;
  for(let i=0;i<6;i++)ghosts.push({x:o+(P.x-o)*i/6,y:P.y,f:P.f,atk:0,al:12,at:0,vx:6,dom:P.dom,hit:0,ghost:1,l:8+i})}
 if(P.y>=G&&P.vx&&t%6==0)dust(P.x,G,2);
 if(((P.dom>0&&P.vx)||P.inv>0||(P.atk>0&&P.at==2))&&t%2==0)ghosts.push({x:P.x,y:P.y,f:P.f,atk:P.atk,al:P.al,at:P.at,vx:P.vx,dom:P.dom,hit:0,ghost:1,l:10});
 ghosts.forEach(g=>g.l--);ghosts=ghosts.filter(g=>g.l>0)}
function tickExtract(){
 xt++;freeMove();
 if(xt%2==0)parts.push({x:E.x+(Math.random()-.5)*50,y:G,vx:(Math.random()-.5)*.6,vy:-2-Math.random()*2,l:45,c:Math.random()<.5?'#b57bff':'#ffd84a'});
 if(state=='absorb'){xa++;const a=xa/40,bx=E.x+(P.x-E.x)*a*a;
  parts.push({x:bx,y:E.y-60,vx:(P.x-bx)/20,vy:-.5,l:20,c:'#ffd84a'});
  if(xa>=40)finishExtract()}
 parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.02;p.l--});parts=parts.filter(p=>p.l>0);
 fx.forEach(f=>{f.l--;if(f.r)f.r+=12});fx=fx.filter(f=>f.l>0);
 if(sh>0)sh*=.85}
function drawExtraction(){
 const a=state=='absorb'?xa/40:0,bx=E.x+(P.x-E.x)*a*a,by=E.y-Math.min(xt,50)*1.1*(1-a)-a*30;
 c.save();c.translate(E.x,G+4);c.scale(1,.28);c.strokeStyle='#b57bff';c.lineWidth=3;c.globalAlpha=1-a;
 c.beginPath();c.arc(0,0,70+Math.sin(xt*.1)*4,0,6.28);c.stroke();c.beginPath();c.arc(0,0,48,0,6.28);c.stroke();
 for(let i=0;i<8;i++){const q=xt*.03+i*.785;c.beginPath();c.moveTo(Math.cos(q)*48,Math.sin(q)*48);c.lineTo(Math.cos(q)*70,Math.sin(q)*70);c.stroke()}
 c.restore();
 c.globalAlpha=Math.max(0,1-xt/40)*(1-a);mon(E.type,E.x,E.y,E.f,E.col,'#ff4444',null,0,E.sc,{});
 c.globalAlpha=Math.min(1,xt/30)*(1-a*.5);mon(E.type,bx,by,E.f,'#0a0418','#ffd84a','#b57bff',0,E.sc*(1-a*.6),{bob:Math.sin(xt*.15)*2,wc:'#5b2bd0',orb:'#ffd84a',wing:'#0a0418'});
 c.globalAlpha=1}
function slam(){
 const x=E.x+E.f*60;sh=Math.max(sh,E.sc>1.5?18:13);SFX.play('slam');dust(x,G,14);
 fx.push({t:'crack',x:x,l:70},{t:'ring',x:x,y:G-10,r:10,l:20});
 waves.push({x:x,v:-7,hit:0,l:55,d:E.d*.5},{x:x,v:7,hit:0,l:55,d:E.d*.5})}
function foePose(){
 if(E.type=='mage'){const q=E.wind>0?1-E.wind/E.ww:0;return{cast:q,orb:E.kind=='power'?'#ff5fd0':'#c070ff',bob:Math.sin(t*.1)*2-(E.kind=='power'?6:0),wc:'#8a6a4a'}}
 if(E.type=='dragon')return{dive:E.dv==1,tilt:E.dv==1?.65:E.dv==2?-.25:(E.wind>0&&!E.fireNext)?-.3:0,mouth:E.wind>0&&E.fireNext,wing:'#3a1458',ph:0}
 const k=E.kind=='power',o={big:k,wc:k?'#8a6a4a':'#cde',type:E.type};
 o.run=E.dash>0?10:E.moving?(k?4:9):0;
 o.bob=(E.stun>0||E.wind>0||E.moving||E.dash>0)?0:Math.sin(t*.1)*1.5;
 let ar=.3,ln=0;
 if(E.hit>0){ln=-.25;ar=.9}
 else if(E.stun>0){ln=Math.sin(t*.5)*.12;ar=.8}
 else if(E.wind>0){const q=1-E.wind/E.ww;ar=.3+(k?2.8:1.0)*q;ln=-(k?.22:.12)*q}
 else if(E.sw>0){const q=1-E.sw/12;ar=(k?3.1:1.3)-(k?4.6:2.8)*q;ln=.28*Math.sin(q*3.14)+.05}
 else if(E.dash>0){ln=.35;ar=1.2}
 else if(E.moving){ln=.08;ar=.5+Math.sin(t*.45)*.4}
 o.arm=ar;o.lean=ln+(E.type=='goblin'?.12:0);return o}
function soPose(s){const ty=s.type||'soldier',mx=(ty=='mage'||ty=='dragon')?10:8,q=s.a>0?(mx-s.a)/mx:0;
 return{run:s.mv?6:0,ph:s.o,bob:s.mv||s.a>0?0:Math.sin(t*.1+s.o)*1.5,arm:s.a>0?1.1-2.7*q:s.mv?.5+Math.sin(t*.45+s.o)*.4:.3,lean:s.a>0?.2*Math.sin(q*3.14):s.mv?.1:0,
  type:ty,cast:ty=='mage'&&s.a>0?q:0,orb:'#ffd84a',mouth:ty=='dragon'&&s.a>0,wing:'#1a0a38'}}
function mon(type,x,y,f,col,eye,aura,hit,s,o){
 if(type=='dragon')dragon(x,y,f,col,eye,aura,hit,s,o);
 else if(type=='mage')mage(x,y,f,col,eye,aura,hit,s,o);
 else{o=o||{};o.type=type;fig(x,y,f,col,eye,aura,hit,0,s,o)}}
function orb(b){c.save();c.shadowColor=b.col;c.shadowBlur=18;c.fillStyle=b.col;c.beginPath();c.arc(b.x,b.y,b.r,0,6.28);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(b.x,b.y,b.r*.45,0,6.28);c.fill();c.restore()}
function wingPath(){c.beginPath();c.moveTo(0,0);c.lineTo(-6,-56);c.lineTo(-22,-34);c.lineTo(-34,-48);c.lineTo(-40,-16);c.lineTo(-16,-8);c.closePath();c.fill()}
function dragon(x,y,f,col,eye,aura,hit,s,o){
 o=o||{};const fl=Math.sin(t*(o.dive?.55:.3)+(o.ph||0)),wc=hit>0?'#fff':(o.wing||col),bd=hit>0?'#fff':col;
 c.save();c.translate(x,y+(o.bob||0));c.scale(f*(s||1),s||1);
 if(aura){c.shadowColor=aura;c.shadowBlur=30}
 c.rotate(o.tilt||0);
 c.save();c.globalAlpha*=.6;c.translate(4,-52);c.rotate(-.9+fl*.6);c.fillStyle=wc;wingPath();c.restore();
 c.fillStyle=bd;c.beginPath();c.moveTo(-20,-30);c.quadraticCurveTo(-55,-20,-66,-48+fl*5);c.lineTo(-56,-46+fl*5);c.quadraticCurveTo(-46,-34,-18,-46);c.closePath();c.fill();
 c.fillRect(-10,-30,6,16);c.fillRect(6,-30,6,16);
 c.beginPath();c.ellipse(0,-42,26,16,0,0,6.28);c.fill();
 c.beginPath();c.moveTo(14,-52);c.lineTo(32,-76);c.lineTo(46,-76);c.lineTo(58,-66);c.lineTo(46,-60);c.lineTo(32,-58);c.lineTo(22,-34);c.fill();
 c.beginPath();c.moveTo(34,-76);c.lineTo(28,-90);c.lineTo(40,-78);c.fill();
 c.shadowBlur=0;c.fillStyle=eye;c.beginPath();c.arc(43,-71,3,0,6.28);c.fill();
 if(o.mouth){c.fillStyle='rgba(255,140,40,.85)';c.beginPath();c.arc(58,-64,7+Math.sin(t*.8)*2,0,6.28);c.fill()}
 c.save();c.translate(-2,-54);c.rotate(-.9-fl*.7);c.fillStyle=wc;wingPath();c.restore();
 c.restore()}
function mage(x,y,f,col,eye,aura,hit,s,o){
 o=o||{};const q=o.cast||0;
 c.save();c.translate(x,y+(o.bob||0));c.scale(f*(s||1),s||1);
 if(aura){c.shadowColor=aura;c.shadowBlur=28}
 c.fillStyle=hit>0?'#fff':col;
 const sw=Math.sin(t*.15+(o.ph||0))*3;
 c.beginPath();c.moveTo(-13,-96);c.lineTo(13,-96);c.lineTo(24+sw,0);c.lineTo(-24+sw,0);c.fill();
 c.beginPath();c.arc(0,-104,12,0,6.28);c.fill();
 c.beginPath();c.moveTo(-17,-110);c.lineTo(17,-110);c.lineTo(4,-140);c.lineTo(10,-152);c.lineTo(-4,-138);c.fill();
 c.shadowBlur=0;c.fillStyle=eye;c.fillRect(4,-106,7,3);
 c.save();c.translate(14,-74);c.rotate(-.15-q*.6);
 c.strokeStyle=o.wc||'#8a6a4a';c.lineWidth=4;c.beginPath();c.moveTo(0,36);c.lineTo(0,-60);c.stroke();
 c.shadowColor=o.orb||'#c070ff';c.shadowBlur=18;c.fillStyle=o.orb||'#c070ff';c.beginPath();c.arc(0,-66,6+q*7,0,6.28);c.fill();
 c.restore();c.restore()}
// ---- enemy AI per monster type ----
function hurtS(s,d){s.hp-=d;s.fl=6;spark(s.x,s.y-50,'#7a3cff',6)}
function regen(){army.forEach(s=>{if(!s.out&&s.hp<s.max)s.hp=Math.min(s.max,s.hp+s.max/420)})}
function reap(){sd=sd.filter(s=>{if(s.hp<=0){spark(s.x,s.y-50,'#7a3cff',16);if(s.perm){s.hp=0;s.out=0;s.fl=0;msg=s.n+' returns into your shadow to regenerate';mt=70}return false}return true})}
function hitArea(rg,d){
 if(Math.abs(P.x-E.x)<rg&&Math.abs(P.y-E.y)<80)hurtP(d);
 sd.forEach(s=>{if(Math.abs(s.x-E.x)<rg)hurtS(s,d*.9)});cl.forEach(q=>{if(Math.abs(q.x-E.x)<rg)q.hp-=2});reap()}
function meleeAI(best){
 const pw=E.kind=='power',rg=pw?130:95,ar=pw?110:80;
 if(E.wind>0){E.wind--;
  if(!pw&&E.wind<6&&E.wind>0)E.x+=E.f*6;
  if(E.wind==0){E.sw=12;hitArea(rg,E.d);
   if(pw)slam();
   else if(!E.chain&&Math.random()<.6){E.chain=1;E.wind=E.ww=9}else E.chain=0}}
 else if(E.dash>0){E.x+=E.f*14;E.moving=1;
  fx.push({t:'line',x:E.x-E.f*20,y:E.y-20-Math.random()*80,len:60+Math.random()*60,f:E.f,l:8});
  if(E.dash==0&&best<ar+20){E.wind=E.ww=E.bw;E.cd=40}}
 else{
  if(best>(pw?85:65)){E.x+=E.f*E.sp;E.moving=1}
  if(!pw&&best>130&&best<340&&E.dc<=0&&Math.random()<.03){E.dash=12;E.dc=110;SFX.play('step')}
  if(best<ar&&E.cd<=0){E.wind=E.ww=E.bw;E.cd=(pw?70:38)+Math.random()*30}
  if(Math.random()<.004&&E.y>=G)E.vy=-12}}
function blink(){
 const nx=P.x<W/2?P.x+330:P.x-330;
 for(let i=0;i<6;i++)egh.push({x:E.x+(nx-E.x)*i/6,y:E.y,f:E.f,l:9+i});
 spark(E.x,E.y-50,'#c070ff',14);E.x=Math.max(30,Math.min(W-30,nx));E.dc=150;spark(E.x,E.y-50,'#c070ff',14);SFX.play('step')}
function castBolts(){
 const pw=E.kind=='power',n=pw?3:1,sx=E.x+E.f*26*E.sc,sy=E.y-100*E.sc,sp=pw?6:7;
 for(let i=0;i<n;i++){const hy=pw?[G-18,G-62,G-105][i]:(Math.random()<.4?G-18:G-62);
  bolts.push({x:sx,y:sy,vx:E.f*(sp-i*.3),ty:hy,d:E.d,col:pw?'#ff5fd0':'#c070ff',r:pw?11:8,l:170})}
 SFX.play('hit')}
function mageAI(best){
 const pw=E.kind=='power',want=pw?300:240;
 if(E.wind>0){E.wind--;if(E.wind==0){E.sw=12;castBolts()}return}
 if(best<want-90){E.x-=E.f*E.sp*1.2;E.moving=1;if((E.x<=40||E.x>=W-40)&&E.dc<=0)blink()}
 else if(best>want+40){E.x+=E.f*E.sp;E.moving=1}
 if(best<110&&E.dc<=0)blink();
 if(E.cd<=0&&best<560){E.wind=E.ww=E.bw;E.cd=(pw?85:60)+Math.random()*30}}
function fire(tg){
 const pw=E.kind=='power',n=pw?3:1,sx=E.x+E.f*44*E.sc,sy=E.y-45*E.sc;
 for(let i=0;i<n;i++){const tx=tg.x+(i-(n-1)/2)*80,fr=Math.max(12,Math.abs(tx-sx)/6),vx=(tx-sx)/fr;
  bolts.push({x:sx,y:sy,vx:vx,vy:((tg.y-45)-sy)/fr,d:E.d,col:'#ff8a2a',r:pw?12:9,l:fr+30})}
 SFX.play('hit')}
function dragonAI(tg,best){
 const pw=E.kind=='power',hov=pw?70:45;
 if(E.dv==1){E.hvT=0;E.hv=Math.max(0,E.hv-6);E.x+=(E.dtx-E.x)*.16;E.moving=1;
  fx.push({t:'line',x:E.x-E.f*20,y:E.y-30-Math.random()*60,len:60,f:E.f,l:8});
  if(E.hv<14){E.dv=2;E.sw=12;hitArea(pw?150:105,E.d);if(pw)slam();E.hvT=hov;E.cd=(pw?85:50)+Math.random()*30}
  return}
 if(E.dv==2){E.hvT=hov;if(E.hv>hov-8)E.dv=0;return}
 if(E.wind>0){E.hvT=E.fireNext?hov:hov+45;E.wind--;
  if(E.wind==0){E.sw=12;if(E.fireNext)fire(tg);else{E.dv=1;E.dtx=tg.x}}return}
 const want=pw?260:190;
 if(best>want+40){E.x+=E.f*E.sp;E.moving=1}else if(best<want-80){E.x-=E.f*E.sp*.8;E.moving=1}
 E.hvT=hov+Math.sin(t*.05)*10;
 if(E.cd<=0&&best<540){E.fireNext=(best>170&&Math.random()<(pw?.7:.45))?1:0;E.wind=E.ww=E.fireNext?E.bw:E.bw-6;E.cd=(pw?90:60)+Math.random()*30}}
function tickBolts(){
 bolts.forEach(b=>{b.x+=b.vx;if(b.ty!=null)b.y+=(b.ty-b.y)*.12;else b.y+=b.vy;b.l--;
  if(P.inv<=0&&Math.abs(b.x-P.x)<24&&Math.abs(b.y-(P.y-55))<50){hurtP(b.d);b.l=0;spark(b.x,b.y,b.col,10)}
  sd.forEach(s=>{const k=s.sc||.85;if(b.l>0&&Math.abs(b.x-s.x)<22*k&&Math.abs(b.y-(s.y-50*k))<55*k){hurtS(s,b.d*.9);b.l=0;spark(b.x,b.y,b.col,8)}});
  cl.forEach(q=>{if(b.l>0&&Math.abs(b.x-q.x)<22&&Math.abs(b.y-(q.y-55))<55){q.hp-=1;b.l=0;spark(b.x,b.y,b.col,8)}});
  if(b.y>G-4&&b.ty==null){b.l=0;spark(b.x,G-6,b.col,8)}});
 bolts=bolts.filter(b=>b.l>0&&b.x>-30&&b.x<W+30);
 fb.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.l--;
  if(Math.abs(b.x-E.x)<30*E.sc&&Math.abs(b.y-(E.y-45*E.sc))<65*E.sc){hurtE(b.d,3,{x:b.x});b.l=0;spark(b.x,b.y,b.col,8)}});
 fb=fb.filter(b=>b.l>0);reap()}
function hurtP(d){if(P.inv>0)return;if(P.rs==1){P.rs=0;P.rq=0;P.rc=60;msg='Rasengan interrupted!';mt=50}P.hp-=P.dom>0?d/2:d;P.hit=8;P.x+=E.f*18;hs=4;SFX.play('hurt');spark(P.x,P.y-50,'#ff5577',10);sh=6;
 if(P.hp<1)P.hp=1}
// ---- summon board: pick which extracted shadow to call out ----
function reserve(){return army.filter(s=>!s.out)}
function cost(s){return 0}
function ready(s){return s.hp>=s.max-.01}
function callOne(s,free){
 if(!ready(s)){pickErr=60;msg=s.n+' is still regenerating…';mt=60;return false}
 s.out=1;s.x=Math.max(20,Math.min(W-20,P.x+(Math.random()-.5)*120));s.y=s.type=='dragon'?G-s.hv:G;s.cd=0;s.fl=0;sd.push(s);spark(s.x,s.y-40,'#ffd84a',16);return true}
function deployArmy(){let n=0;reserve().forEach(s=>{if(callOne(s,true))n++});return n}
function openPick(){
 SFX.play('voice');
 if(!reserve().length){if(P.mp>=40){P.mp-=40;summon(3);SFX.play('arise');msg='ARISE!';mt=60}else{msg='Not enough mana!';mt=60}return}
 K={};pickSel=0;pickErr=0;state='pick'}
function closePick(){if(state=='pick')state='play'}
function pickCall(s){if(callOne(s)){SFX.play('arise');msg=s.n+' answers your call!';mt=80;closePick()}}
function pickAll(){let n=0;reserve().forEach(s=>{if(callOne(s))n++});if(n){SFX.play('arise');msg='ARISE!';mt=80;closePick()}}
function pickKey(k){
 const r=reserve();if(!r.length){closePick();return}
 if(k=='arrowleft')pickSel=(pickSel+r.length-1)%r.length;
 else if(k=='arrowright')pickSel=(pickSel+1)%r.length;
 else if(k=='enter'||k==' ')pickCall(r[pickSel]);
 else if(k>='1'&&k<='6'&&r[Math.floor(pickSel/6)*6+ +k-1])pickCall(r[Math.floor(pickSel/6)*6+ +k-1]);
 else if(k=='0')pickAll();
 else if(k=='a'||k=='escape')closePick()}
function pickLayout(){
 const r=reserve(),pg=Math.floor(pickSel/6),sl=r.slice(pg*6,pg*6+6),n=sl.length,cw=124,gap=8,x0=(W-(n*cw+(n-1)*gap))/2;
 return{pg:pg,pages:Math.ceil(r.length/6),cards:sl.map((s,i)=>({s:s,gi:pg*6+i,x:x0+i*(cw+gap),y:105,w:cw,h:190})),all:{x:W/2-170,y:330,w:160,h:38},close:{x:W/2+10,y:330,w:160,h:38}}}
function pickClick(e){
 const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height,L=pickLayout(),hit=b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h;
 const k=L.cards.find(hit);if(k){pickSel=k.gi;pickCall(k.s);return}
 if(hit(L.all))pickAll();else if(hit(L.close))closePick()}
function drawPick(){
 const L=pickLayout();
 c.fillStyle='#000c';c.fillRect(0,0,W,H);
 txt('CHOOSE A SHADOW TO SUMMON'+(L.pages>1?' (page '+(L.pg+1)+'/'+L.pages+' · ←/→ browse)':''),48,26,'#b57bff');
 txt('MANA ∞ · click or press 1-'+L.cards.length+' · Enter = highlighted · 0 = call all · A or Esc = close',74,12,'#cbb8ff');
 L.cards.forEach((k,i)=>{const s=k.s,sel=k.gi==pickSel,ok=ready(s);
  c.fillStyle=sel?'#2a1a4a':'#150d28';c.fillRect(k.x,k.y,k.w,k.h);
  c.strokeStyle=sel?'#ffd84a':ok?'#7a3cff':'#555';c.lineWidth=sel?3:2;c.strokeRect(k.x,k.y,k.w,k.h);
  c.save();c.beginPath();c.rect(k.x+2,k.y+2,k.w-4,112);c.clip();c.globalAlpha=ok?1:.45;
  mon(s.type,k.x+k.w/2,k.y+(s.type=='dragon'?98:110),1,'#2b0f52','#ffd84a',s.col,0,.45*s.sc,{wing:'#1a0a38',orb:'#ffd84a'});
  c.restore();
  c.textAlign='center';c.fillStyle='#fff';c.font='bold 12px sans-serif';c.fillText(s.n,k.x+k.w/2,k.y+132);
  c.fillStyle='#b57bff';c.font='10px sans-serif';c.fillText((s.kind=='power'?'BIG ':'SMALL ')+s.type.toUpperCase(),k.x+k.w/2,k.y+146);
  c.fillStyle='#0008';c.fillRect(k.x+15,k.y+154,100,6);c.fillStyle='#7ad0ff';c.fillRect(k.x+15,k.y+154,100*s.hp/s.max,6);
  c.fillStyle=ok?'#ffd84a':'#ff6b8a';c.font='bold 12px sans-serif';c.fillText(ok?'READY'+(s.lv>1?' · Lv '+s.lv:''):'REGEN '+Math.floor(100*s.hp/s.max)+'%',k.x+k.w/2,k.y+177);
  c.fillStyle='#ffd84a';c.beginPath();c.arc(k.x+14,k.y+14,10,0,6.28);c.fill();c.fillStyle='#000';c.font='bold 12px sans-serif';c.fillText(i+1,k.x+14,k.y+18);
  c.textAlign='left'});
 [[L.all,'CALL ALL (0)'],[L.close,'CLOSE (A)']].forEach(([b,l])=>{c.fillStyle='#2a1a4a';c.fillRect(b.x,b.y,b.w,b.h);c.strokeStyle='#7a3cff';c.lineWidth=2;c.strokeRect(b.x,b.y,b.w,b.h);txt(l,b.y+25,15,'#fff')});
 if(pickErr>0){pickErr--;txt('Still regenerating inside Sung Jin Woo!',318,16,'#ff6b8a')}}

// ---- king's army: guards fight for the king and must be cleared to reach him ----
function spawnGuards(k){for(let i=0;i<k;i++){const g=E.court[Math.floor(Math.random()*E.court.length)];em.push({x:E.x+(Math.random()-.5)*90,hp:60,max:60,cd:40,f:-1,fl:0,type:g.type,col:g.col,n:g.n,sc:.55,dmg:5+g.d*.3});spark(E.x,G-40,'#ff5577',12)}}
function tickGuards(){
 if(E.king&&E.hp>0&&em.length<4&&t%360==0)spawnGuards(1);
 em.forEach(m=>{const tg=sd.filter(s=>s.hp>0).reduce((a,b)=>Math.abs(b.x-m.x)<Math.abs(a.x-m.x)?b:a,P),dx=tg.x-m.x;
  m.f=Math.sign(dx)||1;if(Math.abs(dx)>36)m.x+=m.f*(m.type=='goblin'?2.2:1.6);
  m.cd--;if(m.fl>0)m.fl--;
  if(Math.abs(dx)<=44&&m.cd<=0){m.cd=55;if(tg===P)hurtP(m.dmg);else hurtS(tg,m.dmg)}
  m.x=Math.max(20,Math.min(W-20,m.x))});
 em=em.filter(m=>{if(m.hp<=0){spark(m.x,G-30,'#ff9a4a',14);return false}return true})}
function drawGuards(){em.forEach(m=>{const y=m.type=='dragon'?G-55+Math.sin(t*.1+m.x)*4:G;mon(m.type,m.x,y,m.f,'#2b0f52','#ff5577',m.col,m.fl,m.sc,{wing:'#1a0a38',orb:'#ff5577'});c.fillStyle='#0008';c.fillRect(m.x-18,y-m.sc*110-12,36,4);c.fillStyle='#ff5577';c.fillRect(m.x-18,y-m.sc*110-12,36*Math.max(0,m.hp)/m.max,4)})}
// ---- monster select board: region tabs, 30 monsters ----
function selList(r){return foes.map((f,i)=>i).filter(i=>foes[i].r==r)}
function selLayout(){const r=foes[sel].r,tw=Math.floor((W-20)/R.length),tabs=R.map((n,i)=>({i:i,n:n,x:10+i*tw,y:68,w:tw-4,h:28})),cards=selList(r).map((gi,j)=>({i:gi,j:j,f:foes[gi],x:14+(j%5)*156,y:104+Math.floor(j/5)*130,w:148,h:122}));return{tabs:tabs,cards:cards}}
function selGo(i){if(state!='select'||!foes[i])return;rnd=i;sel=i;startRound();state='play';SFX.play('voice')}
function selRegion(d){const ri=(R.indexOf(foes[sel].r)+d+R.length)%R.length;sel=selList(R[ri])[0]}
function selKey(k){
 if(k=='arrowleft')sel=(sel+foes.length-1)%foes.length;
 else if(k=='arrowright')sel=(sel+1)%foes.length;
 else if(k=='arrowup')selRegion(-1);
 else if(k=='arrowdown')selRegion(1);
 else if(k=='enter'||k==' ')selGo(sel);
 else if(k>='0'&&k<='9'){const l=selList(foes[sel].r),j=k=='0'?9:+k-1;if(l[j]!=null)selGo(l[j])}}
function selClick(e){const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height,hit=b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h,L=selLayout(),tb=L.tabs.find(hit);
 if(tb){sel=selList(R[tb.i])[0];return}const k=L.cards.find(hit);if(k)selGo(k.i)}
function drawSelect(){
 c.fillStyle='#000d';c.fillRect(0,0,W,H);
 txt('CHOOSE YOUR NEXT MONSTER · '+WORLDS[world].n.toUpperCase(),30,24,WORLDS[world].col=='#7a3cff'?'#b57bff':WORLDS[world].col);
 txt('click a card · 1-9, 0 pick · ←/→ browse · ↑/↓ region · 👑 kings lead an army · beating a shadow you own levels it up · G = gates',52,11,'#cbb8ff');
 const L=selLayout();
 L.tabs.forEach(b=>{const on=R[b.i]==foes[sel].r;c.fillStyle=on?'#4a2a8a':'#150d28';c.fillRect(b.x,b.y,b.w,b.h);c.strokeStyle=on?'#ffd84a':'#7a3cff';c.lineWidth=2;c.strokeRect(b.x,b.y,b.w,b.h);c.fillStyle='#fff';c.font='bold 12px sans-serif';c.textAlign='center';c.fillText(b.n,b.x+b.w/2,b.y+18);c.textAlign='left'});
 L.cards.forEach(k=>{const f=k.f,own=army.find(s=>s.n==f.n),on=k.i==sel;
  c.fillStyle=on?'#2a1a4a':'#150d28';c.fillRect(k.x,k.y,k.w,k.h);
  c.strokeStyle=on?'#ffd84a':own?'#4ade80':'#7a3cff';c.lineWidth=on?3:2;c.strokeRect(k.x,k.y,k.w,k.h);
  c.save();c.beginPath();c.rect(k.x+2,k.y+2,k.w-4,68);c.clip();
  mon(f.type,k.x+k.w/2,k.y+(f.type=='dragon'?62:68),-1,'#2b0f52','#ff5577',f.col,0,.24*f.sc,{wing:'#1a0a38',orb:'#ff5577'});c.restore();
  c.textAlign='center';c.fillStyle='#fff';c.font='bold 13px sans-serif';c.fillText(f.n,k.x+k.w/2,k.y+86);
  c.fillStyle=f.king?'#ffd84a':'#b57bff';c.font='10px sans-serif';c.fillText((f.king?'👑 KING · ':'SMALL · ')+f.type.toUpperCase(),k.x+k.w/2,k.y+99);
  c.fillStyle=own?'#4ade80':'#9a86c4';c.font='bold 11px sans-serif';c.fillText(own?'✔ IN ARMY'+(own.lv>1?' Lv '+own.lv:''):'NOT EXTRACTED',k.x+k.w/2,k.y+114);
  c.fillStyle='#ffd84a';c.beginPath();c.arc(k.x+12,k.y+12,9,0,6.28);c.fill();c.fillStyle='#000';c.font='bold 11px sans-serif';c.fillText(k.j==9?0:k.j+1,k.x+12,k.y+16);
  c.textAlign='left'});
 txt('Shadow army inside Sung Jin Woo: '+army.length+' / '+foes.length+' · they never die, they only return to regenerate',398,13,'#cbb8ff')}
function summon(n){
 for(let i=0;i<n;i++){sd.push({x:P.x+(i-n/2)*40,y:G,cd:i*10,life:900,hp:90,max:90,a:0,fl:0,type:'soldier',sc:.85,o:(Math.random()-.5)*50});spark(P.x+(i-n/2)*40,G-30,'#7a3cff',14)}
 const tmp=sd.filter(s=>!s.perm);while(tmp.length>6)sd.splice(sd.indexOf(tmp.shift()),1)}

function update(){
 t++;if(mt>0)mt--;regen();reap();tickGuards();lavaTick();cloneTick();rbTick();
 const sp=P.dom>0?6:4;
 P.vx=mv(sp);if(K.left)P.f=-1;if(K.right)P.f=1;
 if(K.jump&&P.y>=G){P.vy=P.dom>0?-16:-13;dust(P.x,G,6)}
 P.vy+=.7;P.y+=P.vy;if(P.y>G){P.y=G;P.vy=0}
 if(P.y>=G&&P.air){P.air=0;dust(P.x,G,8)}if(P.y<G)P.air=1;
 P.x=Math.max(20,Math.min(W-20,P.x+P.vx));
 if(P.atk>0)P.atk--;if(P.sl>0)P.sl--;if(P.inv>0)P.inv--;if(P.hit>0)P.hit--;if(P.dom>0)P.dom--;
 if(P.atk>0&&Math.abs(E.x-P.x)>45)P.x=Math.max(20,Math.min(W-20,P.x+P.lx*P.atk/P.al));
 if(P.ct>0)P.ct--;
 if(P.y>=G&&P.vx&&t%6==0)dust(P.x,G,2);
 if(P.dom>0&&P.vx)P.sl=Math.max(P.sl,2);
 if(((P.dom>0&&P.vx)||P.inv>0||(P.atk>0&&P.at==2))&&t%2==0)ghosts.push({x:P.x,y:P.y,f:P.f,atk:P.atk,al:P.al,at:P.at,vx:P.vx,dom:P.dom,hit:0,ghost:1,l:10});
 ghosts.forEach(g=>g.l--);ghosts=ghosts.filter(g=>g.l>0);
 P.mp=Math.min(100,P.mp+.05);P.hp=Math.min(100,P.hp+.015);if(P.lc>0)P.lc--;if(P.cc>0)P.cc--;if(P.rc>0)P.rc--;P.cast=E.lift>0?1:0;
 // 3-hit combo: slash, reverse slash, spinning kick finisher
 if(pr('strike')&&P.atk<=3&&!P.rs){
  P.at=P.ct>0?(P.at+1)%3:0;P.ct=34;const ty=P.at;
  P.atk=P.al=ty==2?18:12;SFX.play('strike');
  fx.push({t:'slash',x:P.x+P.f*40,y:P.y-50,f:P.f,l:10,ty:ty});
  P.lx=P.f*(ty==2?11:6);
  if(Math.abs(E.x-P.x)<[90,95,115][ty]&&(E.x-P.x)*P.f>-10&&Math.abs(E.y-P.y)<90){hs=[3,3,8][ty];hurtE([10,12,22][ty],[12,16,34][ty],P)}}
 if(pr('step')&&P.mp>=10){P.mp-=10;const o=P.x;P.x=Math.max(20,Math.min(W-20,P.x+P.f*170));P.inv=18;SFX.play('step');P.sl=14;for(let i=0;i<6;i++)ghosts.push({x:o+(P.x-o)*i/6,y:P.y,f:P.f,atk:0,al:12,at:0,vx:6,dom:P.dom,hit:0,ghost:1,l:8+i});
  for(let i=0;i<14;i++)spark(o+(P.x-o)*i/14,P.y-40,'#7a3cff',2,2);
  if((E.x-o)*(E.x-P.x)<0)hurtE(12,20,P)}
 if(pr('arise'))openPick();
 if(pr('lift'))tryLift();
 if(pr('clone'))tryClone();
 if(pr('ras'))tryRas();
 rasTick();
 if(pr('fear')&&P.mp>=30){P.mp-=30;SFX.play('fear');E.stun=130;E.wind=0;fx.push({t:'ring',x:P.x,y:P.y-40,r:10,l:30});sh=8;hurtE(5,0,P)}
 if(pr('domain')&&P.mp>=100&&P.dom<=0){P.mp=0;P.dom=360;SFX.play('domain');deployArmy();summon(4);fx.push({t:'ring',x:P.x,y:P.y-40,r:10,l:50});sh=14;msg='MONARCH’S DOMAIN';mt=90;hurtE(40,30,P)}
 // enemy: targets the nearest of the hunter or any shadow soldier
 if(E.hit>0)E.hit--;if(E.sw>0)E.sw--;if(E.dash>0)E.dash--;if(E.dc>0)E.dc--;
 if(E.lift>0)liftTick();
 else if(E.fly){E.hv+=(E.hvT-E.hv)*.1;E.y=G-E.hv+(E.dv?0:Math.sin(t*.12)*3)}
 else{E.vy+=.7;E.y+=E.vy;if(E.y>G){E.y=G;E.vy=0}}
 E.cd--;E.moving=0;
 const pw=E.kind=='power';
 if(E.lift>0){}
 else if(E.stun>0)E.stun--;
 else{
  let tg=P,best=Math.abs(P.x-E.x);
  sd.forEach(s=>{const d=Math.abs(s.x-E.x);if(d<best){best=d;tg=s}});
  cl.forEach(q=>{const d=Math.abs(q.x-E.x);if(d<best){best=d;tg=q}});
  E.f=tg.x>E.x?1:-1;
  if(E.type=='mage')mageAI(best);else if(E.type=='dragon')dragonAI(tg,best);else meleeAI(best);
 }
 if(!pw&&(E.moving||E.dash>0)&&t%2==0)egh.push({x:E.x,y:E.y,f:E.f,l:9});
 if(pw&&E.moving&&!E.fly&&E.type!='mage'&&t%26==0){sh=Math.max(sh,3);dust(E.x,G,4)}
 egh.forEach(g=>g.l--);egh=egh.filter(g=>g.l>0);
 waves.forEach(w=>{w.x+=w.v;w.l--;if(!w.hit&&P.y>=G-12&&P.inv<=0&&Math.abs(P.x-w.x)<28){w.hit=1;hurtP(w.d)}});
 waves=waves.filter(w=>w.l>0);
 tickBolts();
 E.x=Math.max(20,Math.min(W-20,E.x));
 // shadow soldiers fight on their own, no input needed
 sd.forEach(s=>{s.life--;s.cd--;if(s.fl>0)s.fl--;
  const ty=s.type||'soldier',rng=ty=='mage'||ty=='dragon',dx=E.x-s.x,ad=Math.abs(dx);
  if(s.a>0){s.a--;if(!rng&&s.a>4)s.x+=Math.sign(dx)*3}
  s.mv=0;
  if(rng){const want=ty=='mage'?230:200;
   if(ad>want+30){s.x+=Math.sign(dx)*3.2;s.mv=1}else if(ad<want-70){s.x-=Math.sign(dx)*2.6;s.mv=1}
   s.x=Math.max(20,Math.min(W-20,s.x));
   if(s.cd<=0&&ad<want+160){s.cd=ty=='mage'?55:70;s.a=10;SFX.play('soldier');
    const sy=s.y-(ty=='dragon'?42:100)*(s.sc||1),fr=Math.max(10,ad/6);
    fb.push({x:s.x+Math.sign(dx)*24,y:sy,vx:Math.sign(dx)*6,vy:((E.y-45*E.sc)-sy)/fr,d:(s.dmg||4)*1.4,col:ty=='mage'?'#c070ff':'#ff8a2a',r:ty=='mage'?7:10,l:90})}}
  else{
   if(ad>55){s.x+=Math.sign(E.x+s.o-s.x)*3.2;s.mv=1}
   else if(s.cd<=0){s.cd=30;s.a=8;SFX.play('soldier');hurtE(s.dmg||4,3,s)}}
  if(ty=='dragon')s.y=G-s.hv+Math.sin(t*.1+s.o)*4});
 sd=sd.filter(s=>s.life>0);
 parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.1;p.l--});parts=parts.filter(p=>p.l>0);
 fx.forEach(f=>{f.l--;if(f.r)f.r+=12});fx=fx.filter(f=>f.l>0);
 if(sh>0)sh*=.85;
}

function fig(x,y,f,col,eye,aura,hit,atk,s,o){
 o=o||{};const big=o.big,ar=o.arm==null?.3:o.arm,w=Math.sin(t*.45+(o.ph||0))*(o.run||0);
 c.save();c.translate(x,y+(o.bob||0));c.scale(f*(s||1),s||1);
 if(aura){c.shadowColor=aura;c.shadowBlur=big?35:25}
 c.fillStyle=hit>0?'#fff':col;
 c.fillRect(-12+w,-48,10,48);c.fillRect(2-w,-48,10,48);
 c.save();c.translate(0,-48);c.rotate(o.lean||0);c.translate(0,48);
 c.fillRect(-16,-92,32,48);
 if(big)c.fillRect(-22,-96,44,14);
 c.beginPath();c.arc(0,-104,13,0,6.28);c.fill();
 if(o.type=='goblin'){c.beginPath();c.moveTo(-10,-110);c.lineTo(-28,-122);c.lineTo(-11,-98);c.moveTo(10,-110);c.lineTo(28,-122);c.lineTo(11,-98);c.fill()}
 c.save();c.translate(10,-84);c.rotate(ar);
 c.fillRect(-4,0,8,30);
 c.shadowBlur=0;c.strokeStyle=o.wc||'#ccc';c.lineWidth=big?8:4;c.beginPath();c.moveTo(0,26);c.lineTo(0,26+(big?50:32));c.stroke();
 c.restore();
 c.shadowBlur=0;c.fillStyle=eye;c.fillRect(4,-107,8,3);
 c.restore();c.restore()}
function hero(o){
 const d=o.dom>0,gh=o.ghost,s=d?1.15:1,au=d?'#d020ff':'#7a3cff',h=o.hit>0&&!gh,co=h?'#fff':gh?(gh==2?'#2a9fd0':'#7a3cff'):'#0f0818',ey=d?'#ff3df0':'#b57bff';
 const air=o.y<G-2,run=Math.abs(o.vx)>.5,ty=o.atk>0?o.at:-1,al=o.al||12,p=o.atk>0?(al-o.atk)/al:0;
 const lean=ty>=0?(ty==1?.22:.16)+(ty==2?.2*Math.sin(p*3.14):0):run?.12:0;
 const bob=(!air&&!run&&ty<0)?Math.sin(t*.12)*1.5:0;
 c.save();c.translate(o.x,o.y+bob);c.scale(o.f*s,s);
 if(!gh){c.save();c.shadowColor=au;c.shadowBlur=30;c.fillStyle=au+'66';
  for(let i=0;i<6;i++){c.beginPath();c.ellipse(-22+i*9,-50,5,30+Math.sin(t*.2+i*2)*14,0,0,6.28);c.fill()}
  c.restore()}
 const w=run?Math.sin(t*.45)*(d?9:6):0,sw=Math.sin(t*.1)*4-(run?12:0)-(air?10:0);
 c.fillStyle=co;c.beginPath();c.moveTo(-14,-92);c.lineTo(-38+sw,-26);c.lineTo(-22,-14);c.lineTo(-8,-34);c.lineTo(10,-92);c.fill();
 c.fillStyle=h?'#fff':gh?(gh==2?'#1f7fa8':'#7a3cff'):'#07040d';
 if(air){c.fillRect(-11,-46,10,34);c.save();c.translate(2,-46);c.rotate(-.8);c.fillRect(0,0,10,34);c.restore()}
 else if(ty==2){c.fillRect(-11,-46,10,46);c.save();c.translate(2,-46);c.rotate(-1.4*Math.sin(p*3.14));c.fillRect(0,0,10,46);c.restore()}
 else{c.fillRect(-11+w,-46,10,46);c.fillRect(2-w,-46,10,46)}
 c.save();c.translate(0,-46);c.rotate(lean);c.translate(0,46);
 c.fillStyle=co;c.fillRect(-15,-96,30,52);
 c.fillStyle=au;c.fillRect(-15,-70,30,3);c.fillRect(8,-96,3,52);
 c.fillStyle='#e8cdb5';c.beginPath();c.arc(2,-107,11,0,6.28);c.fill();
 c.fillStyle='#07040d';c.beginPath();c.moveTo(-11,-104);c.lineTo(-16,-124);c.lineTo(-5,-117);c.lineTo(-2,-134);c.lineTo(5,-118);c.lineTo(13,-130);c.lineTo(14,-112);c.lineTo(4,-114);c.lineTo(-1,-110);c.fill();
 c.save();c.shadowColor=ey;c.shadowBlur=10;c.fillStyle=ey;c.fillRect(5,-109,7,3);c.restore();
 c.fillStyle=co;c.fillRect(6,-92,9,26);
 c.lineCap='round';c.shadowColor='#c9a8ff';c.shadowBlur=12;c.strokeStyle='#e6d8ff';c.lineWidth=4;c.beginPath();
 if(ty>=0){const a=ty==0?-1.3+p*2.5:ty==1?1.2-p*2.5:p*6.28-1.5,b=ty==2?a+3.14:a+.6;
  c.moveTo(14,-70);c.lineTo(14+Math.cos(a)*50,-70+Math.sin(a)*50);c.moveTo(14,-70);c.lineTo(14+Math.cos(b)*38,-70+Math.sin(b)*38)}
 else if(o.rs){c.moveTo(14,-68);c.lineTo(46,-66);c.moveTo(-14,-62);c.lineTo(-30,-76)}
 else if(o.cast){c.moveTo(14,-70);c.lineTo(42,-114);c.moveTo(-14,-62);c.lineTo(-30,-76)}
 else if(run){c.moveTo(14,-66);c.lineTo(-6,-70);c.moveTo(-14,-62);c.lineTo(-34,-66)}
 else{c.moveTo(14,-64);c.lineTo(34,-78);c.moveTo(-14,-62);c.lineTo(-30,-76)}
 c.stroke();c.fillStyle='#e8cdb5';c.beginPath();c.arc(14,-66,4,0,6.28);c.fill();
 if(o.rs>0){const q=o.rq||0,r=6+q*13;c.save();c.translate(o.rs==2?50:46,-66);const rg=c.createRadialGradient(0,0,1,0,0,r);rg.addColorStop(0,'#fff');rg.addColorStop(.5,'#9fe4ff');rg.addColorStop(1,'rgba(40,140,255,0)');
  c.shadowColor='#7ad0ff';c.shadowBlur=24;c.fillStyle=rg;c.beginPath();c.arc(0,0,r,0,6.28);c.fill();c.shadowBlur=0;c.strokeStyle='#ffffffcc';c.lineWidth=2;
  for(let i=0;i<3;i++){c.beginPath();c.arc(0,0,r*(.45+i*.2),t*.6+i*2,t*.6+i*2+2.2);c.stroke()}c.restore()}
 c.restore();c.restore()}
function bar(x,y,w,v,m,col,lab){c.fillStyle='#0008';c.fillRect(x,y,w,14);c.fillStyle=col;c.fillRect(x,y,w*Math.max(0,v)/m,14);c.strokeStyle='#fff6';c.strokeRect(x,y,w,14);c.fillStyle='#fff';c.font='11px sans-serif';c.fillText(lab,x+4,y+11)}
function txt(s,y,sz,col){c.font='bold '+sz+'px sans-serif';c.textAlign='center';c.fillStyle=col||'#fff';c.fillText(s,W/2,y);c.textAlign='left'}

function draw(){
 c.setTransform(SC,0,0,SC,0,0);
 const g=c.createLinearGradient(0,0,0,H);const wd=WORLDS[state=='warp'?wg:world],hub=state=='hub'||state=='warp';g.addColorStop(0,P&&P.dom>0?'#3a0a5a':wd.sky[0]);g.addColorStop(1,wd.sky[1]);
 c.fillStyle=g;c.fillRect(0,0,W,H);
 c.save();if(sh>.5)c.translate((Math.random()-.5)*sh,(Math.random()-.5)*sh);
 c.fillStyle='#fff3';for(let i=0;i<30;i++)c.fillRect((i*97)%W,(i*53)%200,2,2);
 c.fillStyle=wd.gnd;c.fillRect(0,G,W,H-G);c.fillStyle=wd.line;c.fillRect(0,G,W,2);
 if(wd.lava){const lg=c.createLinearGradient(0,G,0,H);lg.addColorStop(0,'#ff5a1a66');lg.addColorStop(1,'#00000000');c.fillStyle=lg;c.fillRect(0,G,W,H-G)}
 if(wd.ice){c.fillStyle='#ffffff22';for(let i=0;i<8;i++)c.fillRect(i*110+20,G+10+(i%3)*14,70,3)}
 if(state!='title'){
  amb.forEach(a=>{c.fillStyle=a.c;c.globalAlpha=.8;c.fillRect(a.x,a.y,a.s,a.s)});c.globalAlpha=1;
  if(hub)GATEX.forEach((gx,i)=>drawGate(i,gx));
  sd.forEach(s=>{c.globalAlpha=Math.min(1,s.life/60);
   const k=s.sc||.85,ty=s.type||'soldier';
   mon(ty,s.x,s.y,E.x>s.x?1:-1,'#2b0f52',s.perm?'#ffd84a':'#7ad0ff',s.perm?s.col:'#5b2bd0',s.fl,k,soPose(s));c.globalAlpha=1;
   const top=s.y-({dragon:105,mage:155,goblin:126}[ty]||122)*k-6,bw=Math.max(32,26*k);
   c.fillStyle='#0008';c.fillRect(s.x-bw/2,top,bw,4);c.fillStyle='#7ad0ff';c.fillRect(s.x-bw/2,top,bw*Math.max(0,s.hp)/s.max,4);
   if(s.perm){c.fillStyle='#ffd84a';c.font='10px sans-serif';c.textAlign='center';c.fillText(s.n,s.x,top-6);c.textAlign='left'}});
  waves.forEach(w=>{c.globalAlpha=Math.max(0,w.l/55);c.fillStyle='#ff8a3c';c.beginPath();c.moveTo(w.x-14,G+2);c.lineTo(w.x,G-14-w.l*.6);c.lineTo(w.x+14,G+2);c.fill()});c.globalAlpha=1;
  if(hub){}else if(state=='extract'||state=='absorb')drawExtraction();
  else{egh.forEach(g=>{c.globalAlpha=g.l/9*.4;mon(E.type,g.x,g.y,g.f,'#7ad0ff','#7ad0ff',null,0,E.sc,{run:8,lean:.3,wing:'#7ad0ff'})});c.globalAlpha=1;
   mon(E.type,E.x,E.y,E.f,E.col,'#ff4444',E.wind>0?'#ff2a2a':E.kind=='power'?'#a8451f':E.dash>0?'#7ad0ff':null,E.hit,E.sc,foePose())}
  bolts.concat(fb).forEach(orb);
  if(state=='play'&&E.lift>0)drawLift();
  drawRb();
  if(state=='play'&&E.stun>0){c.fillStyle='#ffe066';c.font='20px sans-serif';c.fillText('✦ ✦ ✦',E.x-24,E.y-(110*E.sc+40))}
  if(state=='play'&&E.wind>0){c.fillStyle='#f00';c.font='bold 26px sans-serif';c.fillText('!',E.x-4,E.y-(110*E.sc+40))}
  ghosts.forEach(g=>{c.globalAlpha=g.l/10*.35;hero(g)});
  if(state=='warp'){const k=Math.max(.05,1-wt/60);c.save();c.translate(P.x,G-60);c.scale(k,k);c.translate(-P.x,-(G-60));c.globalAlpha=k;hero(P);c.restore()}
  else{c.globalAlpha=P.inv>0?.45:1;hero(P)}
  c.globalAlpha=1;drawGuards();drawLava();drawClones();
  if(state=='extract'||state=='absorb'){c.fillStyle='rgba(181,123,255,.7)';c.beginPath();c.arc(P.x+P.f*34,P.y-72,8+Math.sin(xt*.3)*3,0,6.28);c.fill()}
  fx.forEach(f=>{if(f.t=='slash'){c.save();c.translate(f.x-f.f*20,f.y);c.globalAlpha=f.l/10;c.strokeStyle=f.ty==2?'#ff9dfb':'#d9b8ff';c.lineWidth=f.ty==2?7:5;c.beginPath();
    if(f.ty==2)c.arc(0,0,62,0,6.28);else{c.rotate(f.ty==1?-f.f*.7:0);c.arc(0,0,40+f.ty*8,f.f>0?-1:2.1,f.f>0?1:4.2)}
    c.stroke();c.restore()}
   else if(f.t=='ras'){c.strokeStyle='rgba(122,208,255,'+f.l/22+')';c.lineWidth=5;c.beginPath();c.arc(f.x,f.y,f.r,0,6.28);c.stroke();c.strokeStyle='rgba(255,255,255,'+f.l/22+')';c.lineWidth=2;c.beginPath();c.arc(f.x,f.y,f.r*.6,0,6.28);c.stroke()}
   else if(f.t=='line'){c.strokeStyle='rgba(122,208,255,'+f.l/8+')';c.lineWidth=2;c.beginPath();c.moveTo(f.x,f.y);c.lineTo(f.x-f.f*f.len,f.y);c.stroke()}
   else if(f.t=='crack'){c.strokeStyle='rgba(255,140,60,'+Math.min(1,f.l/40)+')';c.lineWidth=2;c.beginPath();c.moveTo(f.x,G+2);c.lineTo(f.x-14,G+8);c.lineTo(f.x-6,G+14);c.moveTo(f.x,G+2);c.lineTo(f.x+16,G+7);c.lineTo(f.x+8,G+13);c.stroke()}
   else{c.strokeStyle='#a47bff';c.lineWidth=4;c.beginPath();c.arc(f.x,f.y,f.r,0,6.28);c.stroke()}});
  parts.forEach(p=>{c.globalAlpha=p.l/50;c.fillStyle=p.c;c.fillRect(p.x,p.y,3,3)});c.globalAlpha=1;
  if(P.sl>0){c.strokeStyle='rgba(200,170,255,.45)';c.lineWidth=2;for(let i=0;i<16;i++){const y=Math.random()*G,x=Math.random()*W,l=80+Math.random()*160;c.beginPath();c.moveTo(x,y);c.lineTo(x-P.f*l,y);c.stroke()}}
 }
 c.restore();
 if(state!='title'){
  bar(16,14,300,P.hp,100,'#e0405a','SUNG JIN WOO · IMMORTAL');bar(16,32,300,P.mp,100,P.mp>=100?'#ff3df0':'#7a3cff','MANA ∞'+(P.dom>0?' · DOMAIN '+Math.ceil(P.dom/60)+'s':''));
  if(!hub)bar(W-316,14,300,E.hp,E.max,'#d9a030',(E.king?'👑 KING ':'')+E.n+' ['+(E.kind=='power'?'BIG ':'SMALL ')+E.type.toUpperCase()+'] '+'('+Math.min(rnd+1,foes.length)+'/'+foes.length+')');
  c.fillStyle='#fff';c.font='12px sans-serif';c.fillText('Shadow army: '+army.length+' ('+army.filter(s=>!s.out&&s.hp>=s.max-.01).length+' ready inside you) · Fighting: '+sd.length,16,62);
  c.fillStyle=wd.col;c.font='bold 12px sans-serif';c.fillText(hub?'THE GATES':wd.n.toUpperCase()+' · '+wd.info,16,80);
  if(!hub){c.font='bold 11px sans-serif';[['E Lift',P.lc],['C Clone',P.cc],['R Rasengan',P.rc]].forEach((a,k)=>{c.fillStyle=a[1]>0?'#9a86c4':'#ffd84a';c.fillText(a[0]+(a[1]>0?' '+Math.ceil(a[1]/60)+'s':' ✓'),16+k*92,95)})}
  if(state=='hub'){txt('THE GATES OF THE WORLDS',112,28,'#b57bff');txt('Walk to a gate and press ▲ / Enter (or tap a gate) to step inside',138,14,'#cbb8ff')}
  if(mt>0)txt(msg,110,30,'#d9b8ff')}
 if(state=='title'){txt('SUNG JIN WOO',140,48,'#b57bff');txt('Walk through the gates to new worlds, extract shadows, keep them forever',190,17);txt('Press Enter or tap to begin',250,20,'#ffe066')}
 if(state=='extract'){c.fillStyle='#0006';c.fillRect(0,0,W,76);txt('SHADOW EXTRACTION',40,34,'#b57bff');txt(fallen.n+' has fallen. Its shadow rises. Keep moving!',64,16);
  if(Math.floor(xt/25)%2==0)txt('Press X (or Enter, or tap) to extract its shadow',120,20,'#ffe066')}
 if(state=='absorb')txt('ARISE!',120,42,'#ffd84a');
 if(state=='warp'&&wt>25){c.globalAlpha=Math.min(1,(wt-25)/32);c.fillStyle=WORLDS[wg].col;c.fillRect(0,0,W,H);c.globalAlpha=1}
 if(state=='win'){c.fillStyle='#000a';c.fillRect(0,0,W,H);txt('VICTORY — ARISE!',190,44,'#b57bff');txt('All 6 monsters defeated! Army: '+army.filter(s=>s.hp>0).length+' shadows. Press Restart below',240,18)}
}
function tick(){if(paused){sh=0;if(P)P.sl=0}else if(state=='play'){if(hs>0)hs--;else update()}else if(state=='extract'||state=='absorb')tickExtract();else if(state=='hub')tickHub();else if(state=='warp')tickWarp();if(!paused)ambTick();if(P)P.mp=100;if(state=='pick')regen();prev=Object.assign({},K)}
let lastT=0,acc=0,fc=0,ft=0,lowN=0,lastMenu=null;
function render(){
 draw();if(state=='pick')drawPick();if(state=='select')drawSelect();if(paused)drawPause();
 pb.disabled=sb.disabled=!inGame();
 const m=state=='title'||state=='select'||state=='pick'||state=='win';
 if(m!==lastMenu&&document.body){lastMenu=m;document.body.classList.toggle('menu',m)}}
function loop(ts){
 ts=ts||performance.now();let dt=ts-lastT;lastT=ts;if(dt<0||dt>250)dt=16.7;
 acc+=dt;let n=0;while(acc>=16.667&&n<4){tick();acc-=16.667;n++}if(n==4)acc=0;
 render();
 fc++;if(ts-ft>2000){const fps=fc*1000/(ts-ft);fc=0;ft=ts;
  if(inGame()&&!paused&&fps<42&&!LQ){if(++lowN>=2)setLQ(true)}else lowN=0}
 requestAnimationFrame(loop)}
function setLQ(v){LQ=v;try{localStorage.setItem('sjw_lq',v?'1':'0')}catch(e){}const b=document.getElementById('lq');if(b)b.textContent=v?'✨ Graphics: Low':'✨ Graphics: High'}
// controls: arrows move/jump/strike, D step, L arise, W fear, S domain
const KM={arrowleft:'left',arrowright:'right',arrowup:'jump',arrowdown:'strike',j:'strike',d:'step',a:'arise',w:'fear',s:'domain',e:'lift',c:'clone',r:'ras'};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();SFX.unlock();if(k=='p'||k=='escape'){togglePause();e.preventDefault();return}if(paused)return;if(k=='g'&&(state=='select'||state=='play')){goHub();e.preventDefault();return}if(k=='enter'&&state=='hub'){const g=gateNear();if(g>=0)enterGate(g);e.preventDefault();return}if(state=='select'){if(!e.repeat)selKey(k);e.preventDefault();return}if(state=='pick'){if(!e.repeat)pickKey(k);e.preventDefault();return}if((k=='enter'||k=='x')&&state=='extract')extractShadow();else if(k=='enter'&&(state=='title'||state=='win'))init();const a=KM[k];if(a){K[a]=true;e.preventDefault()}});
addEventListener('keyup',e=>{const a=KM[e.key.toLowerCase()];if(a)K[a]=false});
cv.addEventListener('pointerdown',e=>{SFX.unlock();if(paused){togglePause();return}if(state=='hub'){hubClick(e);return}if(state=='select'){selClick(e);return}if(state=='pick'){pickClick(e);return}if(state=='extract')extractShadow();else if(state=='title'||state=='win')init()});
document.querySelectorAll('.pad button').forEach(b=>{const k=b.dataset.k;
 b.addEventListener('pointerdown',e=>{e.preventDefault();SFX.unlock();if(paused)return;if(k=='gates'){goHub();return}if(state=='select')return;if(state=='pick'){if(k=='arise')closePick();return}if(k=='extract'){if(state=='extract')extractShadow();return}if(state=='title'||state=='win')init();K[k]=true});
 ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>K[k]=false))});
rs.addEventListener('click',()=>{SFX.unlock();init()});
pb.addEventListener('click',togglePause);sb.addEventListener('click',stopGame);
mb.addEventListener('click',()=>{mb.textContent=SFX.toggle()?'🔇 Sound off':'🔊 Sound on'});
// ---- desktop + phone support ----
(function(){
 const B=document.body,mm=window.matchMedia?matchMedia('(pointer:coarse)').matches:false;
 if(B&&mm)B.classList.add('touch');
 const hp=document.getElementById('help');if(hp&&!mm)hp.open=true;
 const tb=document.getElementById('tb'),gt=document.getElementById('gt'),fs=document.getElementById('fs'),lq=document.getElementById('lq');
 if(tb)tb.addEventListener('click',()=>B.classList.toggle('touch'));
 if(gt)gt.addEventListener('click',()=>{SFX.unlock();goHub()});
 if(lq){lq.addEventListener('click',()=>setLQ(!LQ));setLQ(LQ)}
 if(fs){if(!(document.fullscreenEnabled||document.webkitFullscreenEnabled))fs.hidden=true;
  fs.addEventListener('click',async()=>{try{if(document.fullscreenElement||document.webkitFullscreenElement){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}
   else{await (B.requestFullscreen||B.webkitRequestFullscreen).call(document.documentElement);if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}}catch(e){}})}
 addEventListener('resize',resize);addEventListener('orientationchange',()=>setTimeout(resize,200));
 if(window.ResizeObserver)new ResizeObserver(resize).observe(cv);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(inGame()&&!paused)togglePause();SFX.hide(true)}else SFX.hide(false)});
 addEventListener('blur',()=>{K={}});
 addEventListener('touchend',()=>SFX.unlock(),{passive:true});
 document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('canvas,.pad,.row'))e.preventDefault()});
 resize();
})();
loop();