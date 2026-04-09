'use strict';
var $=function(i){return document.getElementById(i);};
var qs=function(s){return document.querySelector(s);};
var ve=function(s){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);};
function ini(n){return n.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0,2);}
function rnd(a,b){return Math.floor(Math.random()*(b-a)+a);}
function pick(a){return a[Math.floor(Math.random()*a.length)];}

/* TOAST */
function toast(icon,title,desc,type){
  type=type||'';
  var w=$('toasts');if(!w)return;
  var el=document.createElement('div');
  el.className='tw '+type;
  el.innerHTML='<span class="tico">'+icon+'</span><div><div class="tttl">'+title+'</div><div class="tdsc">'+desc+'</div></div>';
  w.appendChild(el);
  setTimeout(function(){el.classList.add('leaving');setTimeout(function(){el.remove();},320);},4000);
}

/* USER STORE */
function lu(){try{return JSON.parse(localStorage.getItem('kyc_u')||'[]');}catch(e){return[];}}
function su(a){try{localStorage.setItem('kyc_u',JSON.stringify(a));}catch(e){}}
var cu=null;

/* ERROR HELPERS */
function se(id,m){var e=$(id);if(e)e.textContent=m;}
function ce(){['lee','lpe','sne','see','spe'].forEach(function(i){se(i,'');});}

/* AUTH SWAP — no JS animations, just toggle class */
function showLogin(){
  ce();
  $('sp').classList.remove('active');
  $('lp').classList.remove('active');
  void $('lp').offsetWidth;
  $('lp').classList.add('active');
}
function showSignup(){
  ce();
  $('lp').classList.remove('active');
  $('sp').classList.remove('active');
  void $('sp').offsetWidth;
  $('sp').classList.add('active');
}

$('gs').addEventListener('click',function(e){e.preventDefault();showSignup();});
$('gl').addEventListener('click',function(e){e.preventDefault();showLogin();});

/* LOGIN */
$('lbtn').addEventListener('click',function(){
  ce();
  var em=$('le').value.trim().toLowerCase();
  var pw=$('lpw').value;
  var ok=true;
  if(!em){se('lee','Email is required.');ok=false;}
  else if(!ve(em)){se('lee','Enter a valid email.');ok=false;}
  if(!pw){se('lpe','Password is required.');ok=false;}
  if(!ok)return;
  var u=lu().find(function(x){return x.email===em&&x.password===pw;});
  if(!u){se('lpe','Incorrect email or password.');return;}
  enterDash(u);
});

/* SIGNUP */
$('sbtn').addEventListener('click',function(){
  ce();
  var nm=$('sn').value.trim();
  var em=$('se').value.trim().toLowerCase();
  var pw=$('spw').value;
  var ok=true;
  if(!nm){se('sne','Name is required.');ok=false;}
  if(!em){se('see','Email is required.');ok=false;}
  else if(!ve(em)){se('see','Enter a valid email.');ok=false;}
  if(!pw){se('spe','Password is required.');ok=false;}
  else if(pw.length<6){se('spe','Minimum 6 characters.');ok=false;}
  if(!ok)return;
  var us=lu();
  if(us.find(function(x){return x.email===em;})){se('see','Account exists. Sign in instead.');return;}
  var nu={name:nm,email:em,password:pw};
  us.push(nu);su(us);
  enterDash(nu);
});

document.addEventListener('keydown',function(e){
  if(e.key!=='Enter')return;
  if($('lp').classList.contains('active'))$('lbtn').click();
  if($('sp').classList.contains('active'))$('sbtn').click();
});

/* ENTER DASHBOARD — no inline style overrides */
function enterDash(user){
  cu=user;
  $('aw').classList.add('hidden');
  $('dash').classList.remove('hidden');
  var av=ini(user.name);
  ['sba','tav'].forEach(function(id){var e=$(id);if(e)e.textContent=av;});
  ['sbn','tnm'].forEach(function(id){var e=$(id);if(e)e.textContent=user.name;});
  KD=BD.map(function(r){return Object.assign({},r);});
  LS=Object.assign({},INIT);
  renderTable(KD.filter(function(r){return r.status==='pending';}));
  animStats();
  startRT();
  wireDash();
}

var dw=false;
function wireDash(){
  if(dw)return;dw=true;
  $('si').addEventListener('input',function(e){
    var q=e.target.value.toLowerCase();
    renderTable(KD.filter(function(r){
      return r.name.toLowerCase().includes(q)||r.id.toLowerCase().includes(q)||r.country.toLowerCase().includes(q);
    }));
  });
  $('exbtn').addEventListener('click',function(){
    var h=['ID','Client','Country','Submitted','Documents','Risk','Status'];
    var rows=KD.map(function(r){return[r.id,r.name,r.country,r.submitted,r.docs,r.risk,r.status].join(',');});
    var b=new Blob([h.join(',')+'\n'+rows.join('\n')],{type:'text/csv'});
    var url=URL.createObjectURL(b),a=document.createElement('a');
    a.href=url;a.download='kyc.csv';a.click();URL.revokeObjectURL(url);
    toast('📄','CSV Exported','Data downloaded','tb');
  });
}

/* LOGOUT */
['lout','tlout'].forEach(function(id){
  var e=$(id);if(!e)return;
  e.addEventListener('click',function(){
    stopRT();cu=null;
    $('dash').classList.add('hidden');
    $('aw').classList.remove('hidden');
    showLogin();
    $('le').value='';$('lpw').value='';
    ce();
  });
});

/* HAMBURGER */
$('hbg').addEventListener('click',function(){$('sidebar').classList.toggle('open');$('ovl').classList.toggle('open');});
$('ovl').addEventListener('click',function(){$('sidebar').classList.remove('open');$('ovl').classList.remove('open');});

/* SIDEBAR NAV */
document.querySelectorAll('.sblink').forEach(function(a){
  a.addEventListener('click',function(e){
    e.preventDefault();
    document.querySelectorAll('.sblink').forEach(function(x){x.classList.remove('active');});
    a.classList.add('active');
    $('sidebar').classList.remove('open');$('ovl').classList.remove('open');
    var v=a.dataset.view;
    var map={
      pending:['Pending Verifications','23 applications awaiting your review'],
      approved:['Approved Clients','All approved KYC applications'],
      rejected:['Rejected Applications','Applications that did not pass verification'],
      docs:['Document Review','Review submitted identity and financial documents'],
      risk:['Risk Checks','High-risk accounts flagged for review']
    };
    var t=map[v]||['Overview',''];
    $('tt').textContent=t[0];$('ts').textContent=t[1];
    $('pht').textContent=t[0];$('phs').textContent=t[1];
    var f=v==='approved'?KD.filter(function(r){return r.status==='approved';})
        :v==='rejected'?KD.filter(function(r){return r.status==='rejected';})
        :v==='risk'?KD.filter(function(r){return r.risk==='HIGH';})
        :KD.filter(function(r){return r.status==='pending';});
    renderTable(f);
  });
});

/* KYC DATA */
var BD=[
  {id:'KYC-2041',name:'James Harrington',flag:'🇬🇧',country:'United Kingdom',submitted:'08 Apr 2026',docs:'Passport, PoA',risk:'LOW',status:'pending',chip:''},
  {id:'KYC-2040',name:'Amira El-Sayed',flag:'🇦🇪',country:'UAE',submitted:'08 Apr 2026',docs:'National ID, Bank Stmt',risk:'MEDIUM',status:'pending',chip:'c1'},
  {id:'KYC-2039',name:'Stefan Müller',flag:'🇩🇪',country:'Germany',submitted:'07 Apr 2026',docs:'Passport, PoA',risk:'LOW',status:'pending',chip:'c2'},
  {id:'KYC-2038',name:'Priya Nair',flag:'🇮🇳',country:'India',submitted:'07 Apr 2026',docs:'Aadhaar, Bank Stmt',risk:'MEDIUM',status:'pending',chip:'c3'},
  {id:'KYC-2037',name:'Carlos Vega',flag:'🇲🇽',country:'Mexico',submitted:'06 Apr 2026',docs:'Passport, Utility Bill',risk:'HIGH',status:'pending',chip:'c4'},
  {id:'KYC-2036',name:'Yuki Tanaka',flag:'🇯🇵',country:'Japan',submitted:'06 Apr 2026',docs:'MyNumber Card, Bank Stmt',risk:'LOW',status:'pending',chip:'c5'},
  {id:'KYC-2035',name:'Fatima Al-Rashid',flag:'🇸🇦',country:'Saudi Arabia',submitted:'05 Apr 2026',docs:'National ID, PoA',risk:'MEDIUM',status:'pending',chip:''}
];
var KD=BD.map(function(r){return Object.assign({},r);});

function renderTable(data){
  var tb=$('ktb');if(!tb)return;
  if(!data.length){tb.innerHTML='<tr><td colspan="7" style="text-align:center;padding:32px;color:#9ca3af;font-size:13px;">No records found</td></tr>';return;}
  tb.innerHTML=data.map(function(r,i){
    return '<tr class="kr" style="--ri:'+i+'" data-id="'+r.id+'">'+
      '<td><div class="ccell"><div class="cchip '+r.chip+'">'+ini(r.name)+'</div>'+
      '<div><div class="cnm">'+r.name+'</div><div class="cid">'+r.id+'</div></div></div></td>'+
      '<td class="cco">'+r.flag+' '+r.country+'</td>'+
      '<td class="cdt">'+r.submitted+'</td>'+
      '<td class="cdo">'+r.docs+'</td>'+
      '<td><span class="rbdg '+r.risk+'">'+r.risk+'</span></td>'+
      '<td><span class="sbdg '+r.status+'">'+r.status.charAt(0).toUpperCase()+r.status.slice(1)+'</span></td>'+
      '<td><div class="acell">'+
        (r.status==='pending'?'<button class="bap" data-id="'+r.id+'">Approve</button><button class="brj" data-id="'+r.id+'">Reject</button>':'')+
        '<button class="bvw" data-id="'+r.id+'">View</button>'+
      '</div></td></tr>';
  }).join('');
  tb.querySelectorAll('.bap').forEach(function(b){b.addEventListener('click',function(){doApp(b.dataset.id);});});
  tb.querySelectorAll('.brj').forEach(function(b){b.addEventListener('click',function(){doRej(b.dataset.id);});});
  tb.querySelectorAll('.bvw').forEach(function(b){b.addEventListener('click',function(){doVw(b.dataset.id);});});
}

function doApp(id){
  var r=KD.find(function(r){return r.id===id;});
  if(!r||r.status!=='pending')return;
  r.status='approved';LS.pending=Math.max(0,LS.pending-1);LS.approvedToday++;
  upS();syB();renderTable(KD.filter(function(r){return r.status==='pending';}));
  toast('✅','Approved',r.name+' approved','tg');
}
function doRej(id){
  var r=KD.find(function(r){return r.id===id;});
  if(!r||r.status!=='pending')return;
  r.status='rejected';LS.pending=Math.max(0,LS.pending-1);
  upS();syB();renderTable(KD.filter(function(r){return r.status==='pending';}));
  toast('❌','Rejected',r.name+' rejected','tr');
}
function doVw(id){
  var r=KD.find(function(r){return r.id===id;});
  if(!r)return;
  toast('👁','Viewing '+id,r.name+' · '+r.country+' · '+r.risk,'tb');
}

/* STATS */
var INIT={pending:23,approvedToday:8,flagged:4,rate:87,nextId:2042};
var LS=Object.assign({},INIT);
function animStats(){
  cUp('sv1',LS.pending,900);cUp('sv2',LS.approvedToday,1100);
  cUp('sv3',LS.flagged,700);cUp('sv4',LS.rate,800,'%');
}
function cUp(id,t,d,sfx){
  sfx=sfx||'';var el=$(id);if(!el)return;
  var t0=performance.now();
  function f(now){
    var p=Math.min((now-t0)/d,1),v=Math.round(t*(1-Math.pow(1-p,3)));
    el.innerHTML=v+(sfx?'<span class="pct">'+sfx+'</span>':'');
    if(p<1)requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
}
function upS(){
  var p=$('sv1'),a=$('sv2'),f=$('sv3'),r=$('sv4');
  if(p)p.textContent=LS.pending;if(a)a.textContent=LS.approvedToday;
  if(f)f.textContent=LS.flagged;
  if(r)r.innerHTML=LS.rate+'<span class="pct">%</span>';
}
function syB(){
  var pc=$('spc'),ac=$('sac');
  if(pc)pc.textContent=LS.pending;if(ac)ac.textContent=LS.approvedToday+134;
}

/* REALTIME */
var NC=[
  {name:'Omar Hassan',flag:'🇪🇬',country:'Egypt',docs:'National ID, Bank Stmt',risk:'MEDIUM',chip:'c1'},
  {name:'Sophie Bernard',flag:'🇫🇷',country:'France',docs:'Passport, PoA',risk:'LOW',chip:'c2'},
  {name:'Ivan Petrov',flag:'🇷🇺',country:'Russia',docs:'Passport, Utility Bill',risk:'HIGH',chip:'c3'},
  {name:'Layla Al-Amin',flag:'🇰🇼',country:'Kuwait',docs:'Civil ID, Bank Stmt',risk:'MEDIUM',chip:'c4'},
  {name:'Chen Wei',flag:'🇨🇳',country:'China',docs:'ID Card, Bank Stmt',risk:'MEDIUM',chip:'c5'},
  {name:'Emma Williams',flag:'🇦🇺',country:'Australia',docs:'Passport, PoA',risk:'LOW',chip:''},
  {name:'Arjun Sharma',flag:'🇮🇳',country:'India',docs:'Passport, Aadhaar',risk:'LOW',chip:'c1'}
];
var rids=[];
function startRT(){rids.push(setInterval(onNS,rnd(20000,35000)));rids.push(setInterval(onFU,rnd(30000,50000)));}
function stopRT(){rids.forEach(clearInterval);rids=[];}
function onNS(){
  if(!cu)return;
  var c=pick(NC),id='KYC-'+LS.nextId++;
  var dt=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  KD.unshift(Object.assign({},c,{id:id,submitted:dt,status:'pending'}));
  LS.pending++;upS();syB();
  var av=qs('.sblink.active');
  if(!av||av.dataset.view==='pending')renderTable(KD.filter(function(r){return r.status==='pending';}));
  toast('📋','New Submission',c.name+' ('+id+')','tb');
}
function onFU(){
  if(!cu)return;
  if(Math.random()<0.5){
    LS.flagged++;var n=$('sn3');if(n)n.textContent='↑ '+(LS.flagged-4)+' new flag today';
    upS();toast('⚠️','New Flag','A high-risk account flagged','tr');
  }else if(LS.flagged>1){LS.flagged--;upS();toast('✅','Flag Cleared','Account cleared','tg');}
}

/* DARK MODE — applied immediately, no conflict with layout */
(function(){
  var btn=$('dtgl');if(!btn)return;
  /* Apply saved preference before anything renders */
  if(localStorage.getItem('theme')==='dark'){
    document.body.classList.add('dark');
    btn.textContent='☀️';
  }
  btn.addEventListener('click',function(){
    var d=document.body.classList.toggle('dark');
    btn.textContent=d?'☀️':'🌙';
    localStorage.setItem('theme',d?'dark':'light');
  });
})();
