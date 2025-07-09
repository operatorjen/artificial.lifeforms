let $=s=>document.querySelector(s),
 p=$('#pressure input'), c=$('#cells input'), b=$('#bacteria input'), v=$('#virus input'),
 h=$('#health span'), T=$('#time span'),
 cv=$('#pressure-cv'), ctx=cv.getContext('2d'),
 F=$('#final'), R=$('#rebirth'), X=$('#reset'),
 rs=$('#rebirths span'), d=$('#death-by'), sB=$('#side-effect-by'),
 P=0.6, C=0.9, B=1e-4, V=1e-4, H=100, t=0
p.value=P; c.value=C; b.value=B; v.value=V
const PM=0.3, PX=0.99, CM=0.2, CX=0.999,
      BL=0.02, BH=0.6, VL=0.002, VH=0.5,
      GX=0, GY=0, G=[50,50,50]
let m, iH=1, iI=0, iO=0, sP=0.5, sV=0.5, MI=0.09, MO=1.05, A=1, CPL=0
const SK={0:[1,5,8,12],1:[0,2,6,7,9,10],2:[1,4,5,11],3:[3,4]},
      OP=['running','teaching','swimming','sleeping','meditating','writing','hiking','stretching','interpreting','climbing','fighting','reading','screaming'],
      SE=['injured','ill','tired','moody','relieved','relaxed','neutral','energetic']
let Xp=[]
function st(){
  let s=Math.random()*SE.length|0,
      k=Math.random()*4|0,
      op=OP[SK[k][Math.random()*SK[k].length|0]]
  Xp.push([op,SE[s]])
  s<3?C-=2e-6:s>3&&(C+=2.5e-6)
  if(s==1){V+=1e-4;B+=1e-4}
}
let tX={}, S=0
const f=(()=>{
  let W,Ht,sp,rad,lim,nX,nY,Ps,grid,NP,th=10
  const setH=CV=>{
    for(let i=0;i<G.length;i++){
      let col=`hsla(${(V/B*35|0)+40},13%,35%`,
          col2=`hsla(${(CV*10|0)+11},83%,20%`
      if(t>500&&t<=1e3) col2=`hsla(${(V/B/t*45|0)+160},73%,45%`
      else if(t>1e3&&t<=1.5e3) col2=`hsla(${(CV*15|0)+30},63%,45%`
      else if(t>1.5e3&&t<=2e3){col=`hsla(${(V/B*205|0)+70},63%,45%`;col2=`hsla(${(CV*20|0)+240},60%,85%`}
      else if(t>2e3&&t<=2.5e3){col=`hsla(${(V/B*115|0)},33%,45%`;col2=`hsla(${(CV*210|0)+51},83%,35%`}
      else if(t>2.5e3&&t<=3e3){col=`hsla(${(V/B*185|0)+10},53%,65%`;col2=`hsla(${(CV*215|0)+110},63%,45%`}
      else if(t>3e3&&t<=3.5e3){col=`hsla(${(V/B*115|0)+10},93%,45%`;col2=`hsla(${(CV*210|0)+51},83%,70%`}
      else if(t>3.5e3&&t<=4e3){col=`hsla(${(V/B*315|0)+10},83%,55%`;col2=`hsla(${(CV*221|0)+211},93%,20%`}
      else if(t>4e3&&t<=4.5e3){col=`hsla(${(V/B*35|0)+110},13%,5%`;col2=`hsla(${(CV*130|0)+70},73%,50%`}
      else if(t>4.5e3){col=`hsla(${(V/B*15|0)+110},33%,45%`;col2=`hsla(${(CV*100|0)+110},73%,80%`}
      if(!S||!tX[i]){tX[i]=document.createElement('canvas');tX[i].width=tX[i].height=C*Math.random()*500+200;S=1}
      let nc=tX[i].getContext('2d')
      nc.clearRect(0,0,W,Ht)
      let g=nc.createRadialGradient(rad,rad,0.8,rad,rad,rad)
      g.addColorStop(0,col2+',1)');g.addColorStop(.9,col+',.05)')
      nc.fillStyle=g;nc.beginPath();nc.arc(rad,rad,rad,0,Math.PI*2);nc.fill()
    }
  }
  const run=()=>{
    P=Math.sin(P*(C/P))
    C=Math.cos((P-(B*V))*C)
    let bR=Math.random(),vR=Math.random()
    if(bR>BL&&bR<BH){B=Math.sin(B+(C/(bR*2500)));C-=B*C}
    else if(bR>=BH){B=Math.sin(B+(C/(bR*1000)));C-=B*C;V>=VH&&(C-=V*C)}
    if(bR>=BH){V=Math.sin(V+(B*(vR*1000)));H--}
    else if(bR>BL) V=Math.sin(V-(B*(vR*1000)))
    else V=Math.sin(V+(B*(vR*1000)))
    if(P<0||isNaN(P)){p.classList.add('critical');P=0;A=0}
    if(C<1e-6||isNaN(C)){c.classList.add('critical');C=0;A=0}
    B<1e-6&&(B=1e-6);V<1e-6&&(V=1e-6)
    p.value=P.toFixed(7);c.value=C.toFixed(7);b.value=B.toFixed(7);v.value=V.toFixed(7)
    if((P<PM||P>=PX)&&(B>=BH||V>=VL)){
      C<CM?(c.classList.add('critical'),H-=P/100/C):c.classList.remove('critical')
      P>=PX&&(p.classList.add('critical'),H-=P/500/C)
      V>=VH&&(v.classList.add('critical'),H-=P/100/V)
      P<1e-4&&(p.classList.add('critical'),H=0,A=0)
    }
    V<VH?v.classList.remove('critical'):v.classList.add('critical')
    B<BH?b.classList.remove('critical'):b.classList.add('critical')
    (P>=PM&&P<PX&&C>CM&&C<CX)&&(p.classList.remove('critical'),c.classList.remove('critical'),H+=P*C/(B/V))
    C<CM&&(c.classList.add('critical'),H=0)
    H>=1&&A&&t%10==0&&st()
    for(let i=0;i<nX*nY;i++)grid[i].l=0
    for(let i=NP;i--;)Ps[i].f1()
    for(let i=NP;i--;)Ps[i].f2()
    for(let i=NP;i--;)Ps[i].f1()
    let img=m.getImageData(0,0,W,Ht)
    for(let i=0,n=img.data.length;i<n;i+=2) img.data[i+2]<th&&(img.data[i+1]/=2)
    ctx.putImageData(img,0,0)
    setH(C)
    if(!A&&!CPL){
      h.textContent='no';T.textContent=t;R.disabled=''
      let A2=JSON.parse(localStorage.getItem('levvvels-avg-arr'))||[];A2.push(t)
      let tot=A2.reduce((a,b)=>a+b,0)
      localStorage.setItem('levvvels-avg-curr',tot/A2.length)
      localStorage.setItem('levvvels-avg-arr',JSON.stringify(A2))
      localStorage.setItem('levvvels-experiences',JSON.stringify(Xp))
      F.querySelector('.ttl span').textContent=t
      F.querySelector('.lifespan span').textContent=(tot/A2.length).toFixed(2)
      F.querySelector('.rebirths span').textContent=A2.length
      F.querySelector('#experiences').innerHTML=Xp.map(e=>`<p>${e[0]} <em>${e[1]}</em></p>`)
      F.classList.remove('hidden')
      d.textContent=Xp[Xp.length-1][0];sB.textContent=Xp[Xp.length-1][1]
      CPL=1
    } else {
      T.textContent=t; t++; requestAnimationFrame(run)
    }
  }
  const Pcl=function(t,x,y){this.t=t;this.x=x;this.y=y;this.px=x;this.py=y;this.vx=0;this.vy=0}
  Pcl.prototype.f1=function(){
    let cell=grid[(this.y/sp|0)*nX+(this.x/sp|0)]
    cell&&(cell.a[cell.l++]=this)
    this.vx=this.x-this.px; this.vy=this.y-this.py
    let dx=this.x-Math.random()*W, dy=this.y-Math.random()*Ht, d=Math.hypot(dx,dy)
    if(d<rad){let co=dx/d, si=dy/d; this.vx-=co; this.vy-=si;}
    this.vx+=GX; this.vy+=GY
    this.px=this.x; this.py=this.y
    this.x+=this.vx; this.y+=this.vy
  }
  Pcl.prototype.f2=function(){
    let FA=0, FB=0, cx=this.x/sp|0, cy=this.y/sp|0, close=[]
    for(let ox=-1;ox<2;ox++)for(let oy=-1;oy<2;oy++){
      let cell=grid[(cy+oy)*nX+(cx+ox)]
      if(cell&&cell.l)for(let i=0;i<cell.l;i++){
        let o=cell.a[i]
        if(o!==this){
          let dfx=o.x-this.x, dfy=o.y-this.y, dd=Math.hypot(dfx,dfy)
          if(dd<sp){
            let m=1-dd/sp; FA+=m*m; FB+=m*m*m/2
            o.m=m; o.dfx=dfx/dd*m; o.dfy=dfy/dd*m; close.push(o)
          }
        }
      }
    }
    FA=(FA-2)*.99
    for(let o of close){
      let pr=FA+FB*o.m
      this.t!==o.t&&(pr*=.96*P)
      let dx=o.dfx*pr, dy=o.dfy*pr
      o.x+=dx; o.y+=dy
      this.x-=dx; this.y-=dy
    }
    this.x=this.x<lim?lim:this.x>W-lim?W-lim:this.x
    this.y=this.y<lim?lim:this.y>Ht-lim?Ht-lim:this.y
    this.draw()
  }
  Pcl.prototype.draw=function(){
    let s=rad*10
    m.drawImage(tX[this.t],this.x-rad,this.y-rad,s,s)
  }
  return {
    init:()=>{
      Ps=[]; grid=[]
      cv.height=Ht=window.innerHeight/2
      cv.width=W=window.innerWidth/2
      let mc=document.createElement('canvas')
      mc.width=W; mc.height=Ht; m=mc.getContext('2d')
      sp=W/Ht*10; rad=W/Ht*20; lim=rad
      setH(C)
      nX=W/sp|0; nY=Ht/sp|0
      for(let i=0;i<nX*nY;i++)grid[i]={l:0,a:[]}
      for(let i=0;i<G.length;i++)for(let k=G[i];k--;)Ps.push(new Pcl(i,Math.random()*W,Math.random()*Ht))
      NP=Ps.length
      run()
    }
  }
})()
f.init()
R.onclick=()=>location.reload()
X.onclick=()=>{localStorage.clear();R.click()}
window.onresize=()=>{
  m.clearRect(0,0,window.innerWidth,window.innerHeight)
  ctx=cv.getContext('2d')
}
