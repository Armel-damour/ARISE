// Synthesized sound effects (Web Audio, no files needed)
const SFX=(()=>{
let ac,mg,mute=false;
function ctx(){
 if(!ac){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ac=new A();mg=ac.createGain();mg.gain.value=.35;mg.connect(ac.destination)}
 if(ac.state==='suspended')ac.resume();return ac}
function tone(f1,f2,dur,type,vol,delay){
 const a=ctx();if(!a||mute)return;
 const o=a.createOscillator(),g=a.createGain(),t0=a.currentTime+(delay||0);
 o.type=type||'sine';o.frequency.setValueAtTime(f1,t0);o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t0+dur);
 g.gain.setValueAtTime(vol||.5,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);
 o.connect(g);g.connect(mg);o.start(t0);o.stop(t0+dur)}
function noise(dur,vol,fq,delay){
 const a=ctx();if(!a||mute)return;
 const n=Math.floor(a.sampleRate*dur),b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);
 for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
 const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t0=a.currentTime+(delay||0);
 s.buffer=b;f.type='bandpass';f.frequency.value=fq||1500;
 g.gain.setValueAtTime(vol||.4,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);
 s.connect(f);f.connect(g);g.connect(mg);s.start(t0)}
const S={
 strike(){noise(.12,.35,3000);tone(900,300,.1,'sawtooth',.15)},
 hit(){tone(220,60,.15,'square',.25);noise(.08,.25,800)},
 hurt(){tone(160,50,.25,'sawtooth',.4);noise(.15,.3,500)},
 step(){noise(.25,.3,1200);tone(1200,200,.2,'sine',.15)},
 arise(){tone(60,40,.8,'sawtooth',.4);tone(200,800,.6,'triangle',.2,.1);tone(150,600,.6,'triangle',.2,.3)},
 fear(){tone(120,30,.9,'sawtooth',.5);noise(.6,.3,300)},
 domain(){tone(50,25,1.4,'sawtooth',.6);tone(100,900,1,'square',.2);noise(1,.4,200)},
 slam(){tone(70,28,.6,'sine',.7);noise(.4,.5,120)},
 voice(){if(mute)return;tone(80,45,1.1,'sawtooth',.3);noise(.5,.2,200);
  if(window.speechSynthesis){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance('Arise!');u.pitch=.1;u.rate=.55;u.volume=1;
   const v=speechSynthesis.getVoices().find(v=>/^en/i.test(v.lang)&&/male|david|daniel|alex|george|mark/i.test(v.name)&&!/female/i.test(v.name));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}},
 charge(){tone(200,1400,.55,'sine',.22);noise(.5,.15,2600)},
 rasen(){tone(900,90,.4,'sawtooth',.4);noise(.4,.5,1800);tone(70,30,.5,'sine',.6)},
 poof(){noise(.2,.35,2400);tone(700,200,.12,'triangle',.15)},
 soldier(){tone(500,250,.06,'square',.06)},
 die(){tone(300,40,.7,'sawtooth',.4);noise(.5,.4,400)},
 win(){[440,554,659,880].forEach((f,i)=>tone(f,f,.4,'triangle',.3,i*.15))},
 lose(){[330,262,196,130].forEach((f,i)=>tone(f,f*.9,.4,'sawtooth',.25,i*.2))}
};
return{play(n){if(S[n])S[n]()},toggle(){mute=!mute;return mute},unlock(){ctx()},hide(b){if(!ac)return;try{b?ac.suspend():ac.resume()}catch(e){}}}
})();