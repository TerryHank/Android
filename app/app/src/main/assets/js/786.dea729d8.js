"use strict";(globalThis["webpackChunkrecpro"]=globalThis["webpackChunkrecpro"]||[]).push([[786],{786:(e,t,n)=>{n.r(t),n.d(t,{default:()=>N});var i=n(9835),o=n(499),s=n(6309),a=n(9302),r=n(9290),l=n(6535),c=n(2878);const d=(0,r.o)(),p=0,u=222,m=0,g=154;(0,o.iH)(1);const w=new l.xoR({color:"blue",specular:16777215,shininess:30}),h=(new l.xoR({color:8410453,specular:8410453,shininess:30}),new l.xoR({color:8421504,specular:8421504,shininess:30}));let f=0,b="";const x=e=>{if((new Date).getTime()-f<1e3*d.btnBounce)return;if(b==e)return;b=e,d.playAudio=!0;const t=e.replace("right","");console.log(e,t),f=(new Date).getTime()},v=(e,t)=>{const n=d.ball.shadow;for(let i=0;i<4;i++){let o=36,s=46+30*i;for(let a=0;a<6;a++){let r=d.buttonHeight.medium;const l=7,c=7,p=`${a},${i}`;if(e>o-n-l&&e<o+n+l&&t<s+n+c&&t>s-n-c)return{name:p,x:o,y:s,z:r};o+=30}}for(let i=0;i<9;i++){if(5==i)continue;let o=52+15*i,s=19,a=d.buttonHeight.medium;const r=7,l=7,c=`${i},-1`;if(e>o-n-r&&e<o+n+r&&t<s+n+l&&t>s-n-l)return{name:c,x:o,y:s,z:a}}return null},S=()=>{let e=j[0];j.filter((e=>e.position.z>0)).forEach((t=>{t.position.z<e.position.z&&(e=t)})),d.scene?.getObjectByName("blockGroup")?.children.forEach((e=>{e.material=h}));const t=new l.Pa4;e.getWorldPosition(new l.Pa4);const n=v(t.x,t.y);if(n){if(t.z>n.z)return void d.pushRealTimeCoordinate(`${n.name} 上小球因高度超出不触发`);d.pushRealTimeCoordinate(`${n.name} 上小球触发 ${t.x},${t.y},${t.z}`);const e=d.scene?.getObjectByName("blockGroup")?.getObjectByName(n.name);return e.material=w,setTimeout((()=>{e.material=h}),3e3),void x(n.name)}},$=(e,t,n,i)=>{if(!i)return void d.pushRealTimeCoordinate(`箭头坐标 ${parseInt(String(e))},${parseInt(String(t))} 但不更新`);const o=d.scene?.getObjectByName("arrow");let s=o.position.x+e,a=o.position.y+t;a<m?a=m:a>g&&(a=g),s<0?s=0:s>u&&(s=u),o?.position.set(s,a,o.position.z),d.pushRealTimeCoordinate(`箭头坐标 ${parseInt(String(e))},${parseInt(String(t))} 映射后 ${parseInt(String(s))},${parseInt(String(a))}`)},y=(0,o.iH)(!1);let I=null;const R=100;(0,i.YP)((()=>y.value),(e=>{j.forEach((t=>{t.getObjectByName("shadow").visible=!e}))}));const T=(e,t,n,i,o)=>{const s=j[i];clearTimeout(I),I=setTimeout((()=>{y.value=!0}),R),y.value=!1;d.scene.getObjectByName("arrow");const a=parseInt(String(d.axisRate2.x))*e+parseInt(String(d.axisOffset2.x)),r=parseInt(String(d.axisRate2.y))*t+parseInt(String(d.axisOffset2.y)),l=parseInt(String(d.axisRate2.z))*n+parseInt(String(d.axisOffset2.z)),c=(parseInt(String(a))-d.minX)/(d.maxX-d.minX)*(u-p)+p,w=(parseInt(String(r))-d.minY)/(d.maxY-d.minY)*(g-m)+m;let h=c,f=w,b=l;h=h<p?p:h>u?u:h,f=f<m?m:f>g?g:f,s.position.set(h,f,b);const x=j.find((e=>e.position.z<b));void 0!==x&&x.id!==s.id||(j.filter((e=>e.id!==s.id)).forEach((e=>{e.visible=!1})),s.visible=!0);const v=s.position.z-1;s.children[0].scale.set(1,v/100,1),i==o&&S(),d.pushRealTimeCoordinate(`${i}号小球 ${parseInt(String(e))},${parseInt(String(t))},${parseInt(String(n))} 映射后 ${parseInt(String(h))},${parseInt(String(f))},${parseInt(String(b))}`)};let j=[];const z=e=>{j=[];new l.xoR({color:"red",shininess:30});const t=new l.vBJ({color:"red"}),n=new l.xo$(d.ball.size,32,32),i=new l.xo$(.1,12,12),o=new l.Kj0(i,t);o.name="arrow",o.position.set(111,72,0),e.add(o);for(let s=0;s<4;s++){const e=new l.Kj0(n,t);e.position.set(0,0,100);const i=new l.fHI(.4,.4,100,16),s=new l.Kj0(i,t);s.position.set(0,0,0),s.geometry.translate(0,-50,0),s.rotateOnAxis(new l.Pa4(1,0,0),Math.PI/2),e.add(s);const a=new l.xo$(d.ball.shadow,16,16),r=new l.Kj0(a,t);s.add(r),r.position.set(0,0,0),r.geometry.translate(0,-100,0),r.name="shadow",s.scale.set(1,.3,1),o.add(e),j.push(e)}},B=()=>{window.receiveMainCoordinate=$,d.subBallReceiver.set("ball2",T)},P=()=>{d.subBallReceiver.delete("ball2")},C={createBall:z,updateBall:S,initReceiveFunction:B,removeReceiveFunction:P};var H=n(794);const k=(0,i.aZ)({__name:"TouchScene",setup(e){const t=(0,o.iH)();(0,a.Z)();let n,s,d,p=!1;var u=new l.SUY,m=24,g=1/m,w=0;const h=()=>{if(!p){requestAnimationFrame(h);var e=u.getDelta();w+=e,w>g&&(d.render(n,s),w=0)}},f=(0,r.o)();(0,i.YP)((()=>f.heightKey),(e=>{n.clear(),v()}));const b=()=>{const e=document.createElement("canvas");e.width=286,e.height=128;const t=e.getContext("2d");t.font="48px 'STKaiti', '华文楷体', serif",t.fillStyle="rgba(255,0,0, 0.8)",t.textAlign="center",t.textBaseline="middle",t.fillText("原",32,64),t.fillText("宇",96,64),t.fillText("科",160,64),t.fillText("技",224,64);const i=(new l.dpR).load(e.toDataURL("image/png")),o=new l.vBJ({map:i,transparent:!0,side:l.ehD}),s=new l._12(222,90),a=new l.Kj0(s,o);a.position.set(122,150,30),a.rotation.x=Math.PI/2,n.add(a),e.remove()},x=()=>{const e=new l.xoR({color:8421504,specular:8421504,shininess:30}),t=new l.ZAu;t.name="blockGroup",n.add(t);for(let n=0;n<4;n++){let i=30,o=40+30*n;for(let s=0;s<6;s++){let a=f.buttonHeight.medium;const r=new l.DvJ(12,12,a),c=new l.Kj0(r,e);c.position.set(i+6,o+6,a/2),c.name=`${s},${n}`,t.add(c),i+=30}}for(let n=0;n<9;n++){if(5==n)continue;let i=46+15*n,o=13,s=f.buttonHeight.medium;const a=new l.DvJ(12,12,s),r=new l.Kj0(a,e);r.position.set(i+6,o+6,s/2),r.name=`${n},-1`,t.add(r)}},v=()=>{n.add(s),H.Z.createPlane(n,222,154),C.createBall(n);const e=new l.Ox3(16777215,1);e.position.set(20,20,10),n.add(e),s.position.x=61,x(),b()};let S=!1,$={width:0,height:0};const y=()=>{const e=t.value;n=new l.xsS,f.scene=n;const i=document.querySelector(".q-page");S||($.width=i.clientWidth,$.height=i.clientHeight),s=new l.cPb(80,$.width/$.height,.1,3e3),s.position.set(0,-70,60),s.lookAt(111,77,0),d=new l.CP7,d.setSize($.width,$.height-40),d.setClearColor(12178431,1),e.appendChild(d.domElement);const o=new c.z(s,d.domElement);o.enableDamping=!0,o.target.set(111,77,0),o.update(),S=!0,v(),h()};return(0,i.bv)((()=>{y(),setTimeout((()=>{const e=f.buttonHeight.low;f.buttonHeight.low=10,setTimeout((()=>{f.buttonHeight.low=e}),500)}),5e3),setTimeout((()=>{C.initReceiveFunction()}),500)})),(0,i.Jd)((()=>{p=!0,C.removeReceiveFunction()})),(e,n)=>((0,i.wg)(),(0,i.iD)("div",{ref_key:"video_container",ref:t},null,512))}});var O=n(9885),D=n(9984),K=n.n(D);const Z=k,_=Z;K()(k,"components",{QPage:O.Z});const E=(0,i.aZ)({__name:"IndexPage",setup(e){const t=(0,r.o)();return(e,n)=>{const a=(0,i.up)("q-page");return(0,i.wg)(),(0,i.j4)(a,{class:"row items-center justify-evenly",style:{position:"relative"}},{default:(0,i.w5)((()=>[0==(0,o.SU)(t).enableScene?((0,i.wg)(),(0,i.j4)(s.Z,{key:0})):((0,i.wg)(),(0,i.j4)(_,{key:1}))])),_:1})}}}),A=E,N=A;K()(E,"components",{QPage:O.Z})}}]);