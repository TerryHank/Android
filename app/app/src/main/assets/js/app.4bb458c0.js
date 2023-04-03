(()=>{"use strict";var e={8213:(e,r,t)=>{var n=t(1957),o=t(1947),a=t(499),i=t(9835);function s(e,r){const t=(0,i.up)("router-view");return(0,i.wg)(),(0,i.j4)(t)}var l=t(1639);const u={},c=(0,l.Z)(u,[["render",s]]),d=c;var f=t(3340),p=t(3746);const h=(0,f.h)((()=>{const e=(0,p.WB)();return e}));var v=t(8339);const m=[{path:"/:catchAll(.*)*",component:()=>Promise.all([t.e(736),t.e(64),t.e(602)]).then(t.bind(t,6602)),children:[{path:"",component:()=>Promise.all([t.e(736),t.e(64),t.e(786)]).then(t.bind(t,786))},{path:"record",component:()=>Promise.all([t.e(736),t.e(64),t.e(558)]).then(t.bind(t,8558))}]}],b=m,g=(0,f.BC)((function(){const e=v.PO,r=(0,v.p7)({scrollBehavior:()=>({left:0,top:0}),routes:b,history:e("/android_asset/")});return r}));async function y(e,r){const t=e(d);t.use(o.Z,r);const n="function"===typeof h?await h({}):h;t.use(n);const i=(0,a.Xl)("function"===typeof g?await g({store:n}):g);return n.use((({store:e})=>{e.router=i})),{app:t,store:n,router:i}}var w=t(2121);const k={config:{},plugins:{Dialog:w.Z}};async function O({app:e,router:r,store:t}){e.use(r),e.mount("#q-app")}y(n.ri,k).then(O)}},r={};function t(n){var o=r[n];if(void 0!==o)return o.exports;var a=r[n]={exports:{}};return e[n](a,a.exports,t),a.exports}t.m=e,(()=>{var e=[];t.O=(r,n,o,a)=>{if(!n){var i=1/0;for(c=0;c<e.length;c++){for(var[n,o,a]=e[c],s=!0,l=0;l<n.length;l++)(!1&a||i>=a)&&Object.keys(t.O).every((e=>t.O[e](n[l])))?n.splice(l--,1):(s=!1,a<i&&(i=a));if(s){e.splice(c--,1);var u=o();void 0!==u&&(r=u)}}return r}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[n,o,a]}})(),(()=>{t.n=e=>{var r=e&&e.__esModule?()=>e["default"]:()=>e;return t.d(r,{a:r}),r}})(),(()=>{t.d=(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})}})(),(()=>{t.f={},t.e=e=>Promise.all(Object.keys(t.f).reduce(((r,n)=>(t.f[n](e,r),r)),[]))})(),(()=>{t.u=e=>"js/"+(64===e?"chunk-common":e)+"."+{64:"f1f0662b",558:"256be3f4",602:"b3d56099",786:"cd17814c"}[e]+".js"})(),(()=>{t.miniCssF=e=>"css/"+e+"."+{558:"60768661",602:"87e5ed93"}[e]+".css"})(),(()=>{t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()})(),(()=>{t.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r)})(),(()=>{var e={},r="recpro:";t.l=(n,o,a,i)=>{if(e[n])e[n].push(o);else{var s,l;if(void 0!==a)for(var u=document.getElementsByTagName("script"),c=0;c<u.length;c++){var d=u[c];if(d.getAttribute("src")==n||d.getAttribute("data-webpack")==r+a){s=d;break}}s||(l=!0,s=document.createElement("script"),s.charset="utf-8",s.timeout=120,t.nc&&s.setAttribute("nonce",t.nc),s.setAttribute("data-webpack",r+a),s.src=n),e[n]=[o];var f=(r,t)=>{s.onerror=s.onload=null,clearTimeout(p);var o=e[n];if(delete e[n],s.parentNode&&s.parentNode.removeChild(s),o&&o.forEach((e=>e(t))),r)return r(t)},p=setTimeout(f.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=f.bind(null,s.onerror),s.onload=f.bind(null,s.onload),l&&document.head.appendChild(s)}}})(),(()=>{t.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}})(),(()=>{t.p="/android_asset/"})(),(()=>{if("undefined"!==typeof document){var e=(e,r,t,n,o)=>{var a=document.createElement("link");a.rel="stylesheet",a.type="text/css";var i=t=>{if(a.onerror=a.onload=null,"load"===t.type)n();else{var i=t&&("load"===t.type?"missing":t.type),s=t&&t.target&&t.target.href||r,l=new Error("Loading CSS chunk "+e+" failed.\n("+s+")");l.code="CSS_CHUNK_LOAD_FAILED",l.type=i,l.request=s,a.parentNode.removeChild(a),o(l)}};return a.onerror=a.onload=i,a.href=r,t?t.parentNode.insertBefore(a,t.nextSibling):document.head.appendChild(a),a},r=(e,r)=>{for(var t=document.getElementsByTagName("link"),n=0;n<t.length;n++){var o=t[n],a=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(a===e||a===r))return o}var i=document.getElementsByTagName("style");for(n=0;n<i.length;n++){o=i[n],a=o.getAttribute("data-href");if(a===e||a===r)return o}},n=n=>new Promise(((o,a)=>{var i=t.miniCssF(n),s=t.p+i;if(r(i,s))return o();e(n,s,null,o,a)})),o={143:0};t.f.miniCss=(e,r)=>{var t={558:1,602:1};o[e]?r.push(o[e]):0!==o[e]&&t[e]&&r.push(o[e]=n(e).then((()=>{o[e]=0}),(r=>{throw delete o[e],r})))}}})(),(()=>{var e={143:0};t.f.j=(r,n)=>{var o=t.o(e,r)?e[r]:void 0;if(0!==o)if(o)n.push(o[2]);else{var a=new Promise(((t,n)=>o=e[r]=[t,n]));n.push(o[2]=a);var i=t.p+t.u(r),s=new Error,l=n=>{if(t.o(e,r)&&(o=e[r],0!==o&&(e[r]=void 0),o)){var a=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.src;s.message="Loading chunk "+r+" failed.\n("+a+": "+i+")",s.name="ChunkLoadError",s.type=a,s.request=i,o[1](s)}};t.l(i,l,"chunk-"+r,r)}},t.O.j=r=>0===e[r];var r=(r,n)=>{var o,a,[i,s,l]=n,u=0;if(i.some((r=>0!==e[r]))){for(o in s)t.o(s,o)&&(t.m[o]=s[o]);if(l)var c=l(t)}for(r&&r(n);u<i.length;u++)a=i[u],t.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return t.O(c)},n=globalThis["webpackChunkrecpro"]=globalThis["webpackChunkrecpro"]||[];n.forEach(r.bind(null,0)),n.push=r.bind(null,n.push.bind(n))})();var n=t.O(void 0,[736],(()=>t(8213)));n=t.O(n)})();