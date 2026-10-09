(()=>{var Qm=Object.defineProperty;var Od=(s,e,t)=>()=>{if(t)throw t[0];try{return s&&(e=s(s=0)),e}catch(n){throw t=[n],n}};var eg=(s,e)=>{for(var t in e)Qm(s,t,{get:e[t],enumerable:!0})};function tg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function ur(s,e){return new ng[s](e)}function Hp(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function _r(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Kh(){let s=_r("canvas");return s.style.display="block",s}function Gp(s){Oi=s}function Wp(){return Oi}function xr(...s){let e="THREE."+s.shift();Oi?Oi("log",e,...s):console.log(e,...s)}function Xp(s){let e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function de(...s){s=Xp(s);let e="THREE."+s.shift();if(Oi)Oi("warn",e,...s);else{let t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function De(...s){s=Xp(s);let e="THREE."+s.shift();if(Oi)Oi("error",e,...s);else{let t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Kn(...s){let e=s.join(" ");e in Bd||(Bd[e]=!0,de(...s))}function qp(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function gn(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Yt[s&255]+Yt[s>>8&255]+Yt[s>>16&255]+Yt[s>>24&255]+"-"+Yt[e&255]+Yt[e>>8&255]+"-"+Yt[e>>16&15|64]+Yt[e>>24&255]+"-"+Yt[t&63|128]+Yt[t>>8&255]+"-"+Yt[t>>16&255]+Yt[t>>24&255]+Yt[n&255]+Yt[n>>8&255]+Yt[n>>16&255]+Yt[n>>24&255]).toLowerCase()}function He(s,e,t){return Math.max(e,Math.min(t,s))}function $h(s,e){return(s%e+e)%e}function ig(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function sg(s,e,t){return s!==e?(t-s)/(e-s):0}function Na(s,e,t){return(1-t)*s+t*e}function rg(s,e,t,n){return Na(s,e,1-Math.exp(-t*n))}function ag(s,e=1){return e-Math.abs($h(s,e*2)-e)}function og(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function lg(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function cg(s,e){return s+Math.floor(Math.random()*(e-s+1))}function ug(s,e){return s+Math.random()*(e-s)}function hg(s){return s*(.5-Math.random())}function dg(s){s!==void 0&&(zd=s);let e=zd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function fg(s){return s*us}function pg(s){return s*fs}function mg(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function gg(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function _g(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function xg(s,e,t,n,i){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),d=r((e-n)/2),h=a((e-n)/2),f=r((n-e)/2),p=a((n-e)/2);switch(i){case"XYX":s.set(o*u,l*d,l*h,o*c);break;case"YZY":s.set(l*h,o*u,l*d,o*c);break;case"ZXZ":s.set(l*d,l*h,o*u,o*c);break;case"XZX":s.set(o*u,l*p,l*f,o*c);break;case"YXY":s.set(l*f,o*u,l*p,o*c);break;case"ZYZ":s.set(l*p,l*f,o*u,o*c);break;default:de("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function sn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function $e(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function vg(){let s={enabled:!0,workingColorSpace:mr,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ot&&(i.r=di(i.r),i.g=di(i.g),i.b=di(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(i.r=hr(i.r),i.g=hr(i.g),i.b=hr(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Pn?gr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Kn("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Kn("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[mr]:{primaries:e,whitePoint:n,transfer:gr,toXYZ:Vd,fromXYZ:Hd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Kt},outputColorSpaceConfig:{drawingBufferColorSpace:Kt}},[Kt]:{primaries:e,whitePoint:n,transfer:ot,toXYZ:Vd,fromXYZ:Hd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Kt}}}),s}function di(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function hr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}function bu(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Ya.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(de("Texture: Unable to serialize Texture."),{})}function wu(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}function Uu(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Qi.fromArray(s,r);let o=i.x*Math.abs(Qi.x)+i.y*Math.abs(Qi.y)+i.z*Math.abs(Qi.z),l=e.dot(Qi),c=t.dot(Qi),u=n.dot(Qi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}function Rg(){let s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}let r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;(c&8388608)===0;)c<<=1,u-=8388608;c&=-8388609,u+=947912704,r[l]=c|u}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:a,offsetTable:o}}function un(s){Math.abs(s)>65504&&de("DataUtils.toHalfFloat(): Value out of range."),s=He(s,-65504,65504),hi.floatView[0]=s;let e=hi.uint32View[0],t=e>>23&511;return hi.baseTable[t]+((e&8388607)>>hi.shiftTable[t])}function Ia(s){let e=s>>10;return hi.uint32View[0]=hi.mantissaTable[hi.offsetTable[e]+(s&1023)]+hi.exponentTable[e],hi.floatView[0]}function ic(s,e,t,n,i,r){ir.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Ta.x=r*ir.x-i*ir.y,Ta.y=i*ir.x+r*ir.y):Ta.copy(ir),s.copy(e),s.x+=Ta.x,s.y+=Ta.y,s.applyMatrix4(Jp)}function Fg(s,e,t,n,i,r,a,o){let l;if(e.side===Gt?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===vi,o),l===null)return null;dc.copy(o),dc.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(dc);return c<t.near||c>t.far?null:{distance:c,point:dc.clone(),object:s}}function fc(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,lc),s.getVertexPosition(l,cc),s.getVertexPosition(c,uc);let u=Fg(s,e,t,n,lc,cc,uc,nf);if(u){let d=new R;On.getBarycoord(nf,lc,cc,uc,d),i&&(u.uv=On.getInterpolatedAttribute(i,o,l,c,d,new ee)),r&&(u.uv1=On.getInterpolatedAttribute(r,o,l,c,d,new ee)),a&&(u.normal=On.getInterpolatedAttribute(a,o,l,c,d,new R),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new R,materialIndex:0};On.getNormal(lc,cc,uc,h.normal),u.face=h,u.barycoord=d}return u}function Gu(s,e){return s-e}function Vg(s,e){return s.z-e.z}function Hg(s,e){return e.z-s.z}function Yg(s,e,t=0){let n=e.itemSize;if(s.isInterleavedBufferAttribute||s.array.constructor!==e.array.constructor){let i=s.count;for(let r=0;r<i;r++)for(let a=0;a<n;a++)e.setComponent(r+t,a,s.getComponent(r,a))}else e.array.set(s.array,t*n);e.needsUpdate=!0}function is(s,e){if(s.constructor!==e.constructor){let t=Math.min(s.length,e.length);for(let n=0;n<t;n++)e[n]=s[n]}else{let t=Math.min(s.length,e.length);e.set(new s.constructor(s.buffer,0,t))}}function yc(s,e,t,n,i,r,a){let o=s.geometry.attributes.position;if(Jc.fromBufferAttribute(o,i),Kc.fromBufferAttribute(o,r),t.distanceSqToSegment(Jc,Kc,Xu,pf)>n)return;Xu.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(Xu);if(!(c<e.near||c>e.far))return{distance:c,point:pf.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}function xf(s,e,t,n,i,r,a){let o=sh.distanceSqToPoint(s);if(o<t){let l=new R;sh.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}function Qh(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,d){let h=(a-r)/c-(o-r)/(c+u)+(o-a)/u,f=(o-a)/u-(l-a)/(u+d)+(l-o)/d;h*=u,f*=u,i(a,o,h,f)},calc:function(r){let a=r*r,o=a*r;return s+e*r+t*a+n*o}}}function Sf(s,e,t,n,i){let r=(n-e)*.5,a=(i-t)*.5,o=s*s,l=s*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*s+t}function Zg(s,e){let t=1-s;return t*t*e}function Jg(s,e){return 2*(1-s)*s*e}function Kg(s,e){return s*s*e}function Fa(s,e,t,n){return Zg(s,e)+Jg(s,t)+Kg(s,n)}function $g(s,e){let t=1-s;return t*t*t*e}function jg(s,e){let t=1-s;return 3*t*t*s*e}function Qg(s,e){return 3*(1-s)*s*s*e}function e_(s,e){return s*s*s*e}function Oa(s,e,t,n,i){return $g(s,e)+jg(s,t)+Qg(s,n)+e_(s,i)}function t_(s,e,t=2){let n=e&&e.length,i=n?e[0]*t:s.length,r=Kp(s,0,i,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=a_(s,e,r,t)),s.length>80*t){o=s[0],l=s[1];let u=o,d=l;for(let h=t;h<i;h+=t){let f=s[h],p=s[h+1];f<o&&(o=f),p<l&&(l=p),f>u&&(u=f),p>d&&(d=p)}c=Math.max(u-o,d-l),c=c!==0?32767/c:0}return po(r,a,t,o,l,c,0),a}function Kp(s,e,t,n,i){let r;if(i===__(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=Mf(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Mf(a/n|0,s[a],s[a+1],r);return r&&Lr(r,r.next)&&(go(r),r=r.next),r}function Es(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(Lr(t,t.next)||Et(t.prev,t,t.next)===0)){if(go(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function po(s,e,t,n,i,r,a){if(!s)return;!a&&r&&h_(s,n,i,r);let o=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?i_(s,n,i,r):n_(s)){e.push(l.i,s.i,c.i),go(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=s_(Es(s),e),po(s,e,t,n,i,r,2)):a===2&&r_(s,e,t,n,i,r):po(Es(s),e,t,n,i,r,1);break}}}function n_(s){let e=s.prev,t=s,n=s.next;if(Et(e,t,n)>=0)return!1;let i=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,u=Math.min(i,r,a),d=Math.min(o,l,c),h=Math.max(i,r,a),f=Math.max(o,l,c),p=n.next;for(;p!==e;){if(p.x>=u&&p.x<=h&&p.y>=d&&p.y<=f&&Da(i,o,r,l,a,c,p.x,p.y)&&Et(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function i_(s,e,t,n){let i=s.prev,r=s,a=s.next;if(Et(i,r,a)>=0)return!1;let o=i.x,l=r.x,c=a.x,u=i.y,d=r.y,h=a.y,f=Math.min(o,l,c),p=Math.min(u,d,h),_=Math.max(o,l,c),g=Math.max(u,d,h),m=rh(f,p,e,t,n),y=rh(_,g,e,t,n),M=s.prevZ,x=s.nextZ;for(;M&&M.z>=m&&x&&x.z<=y;){if(M.x>=f&&M.x<=_&&M.y>=p&&M.y<=g&&M!==i&&M!==a&&Da(o,u,l,d,c,h,M.x,M.y)&&Et(M.prev,M,M.next)>=0||(M=M.prevZ,x.x>=f&&x.x<=_&&x.y>=p&&x.y<=g&&x!==i&&x!==a&&Da(o,u,l,d,c,h,x.x,x.y)&&Et(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;M&&M.z>=m;){if(M.x>=f&&M.x<=_&&M.y>=p&&M.y<=g&&M!==i&&M!==a&&Da(o,u,l,d,c,h,M.x,M.y)&&Et(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;x&&x.z<=y;){if(x.x>=f&&x.x<=_&&x.y>=p&&x.y<=g&&x!==i&&x!==a&&Da(o,u,l,d,c,h,x.x,x.y)&&Et(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function s_(s,e){let t=s;do{let n=t.prev,i=t.next.next;!Lr(n,i)&&jp(n,t,t.next,i)&&mo(n,i)&&mo(i,n)&&(e.push(n.i,t.i,i.i),go(t),go(t.next),t=s=i),t=t.next}while(t!==s);return Es(t)}function r_(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&p_(a,o)){let l=Qp(a,o);a=Es(a,a.next),l=Es(l,l.next),po(a,e,t,n,i,r,0),po(l,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function a_(s,e,t,n){let i=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:s.length,c=Kp(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(f_(c))}i.sort(o_);for(let r=0;r<i.length;r++)t=l_(i[r],t);return t}function o_(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function l_(s,e){let t=c_(s,e);if(!t)return e;let n=Qp(t,s);return Es(n,n.next),Es(t,t.next)}function c_(s,e){let t=e,n=s.x,i=s.y,r=-1/0,a;if(Lr(s,t))return t;do{if(Lr(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){let d=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r&&(r=d,a=t.x<t.next.x?t:t.next,d===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,u=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&$p(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){let d=Math.abs(i-t.y)/(n-t.x);mo(t,s)&&(d<u||d===u&&(t.x>a.x||t.x===a.x&&u_(a,t)))&&(a=t,u=d)}t=t.next}while(t!==o);return a}function u_(s,e){return Et(s.prev,s,e.prev)<0&&Et(e.next,s,s.next)<0}function h_(s,e,t,n){let i=s;do i.z===0&&(i.z=rh(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,d_(i)}function d_(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function rh(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function f_(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function $p(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function Da(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&$p(s,e,t,n,i,r,a,o)}function p_(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!m_(s,e)&&(mo(s,e)&&mo(e,s)&&g_(s,e)&&(Et(s.prev,s,e.prev)||Et(s,e.prev,e))||Lr(s,e)&&Et(s.prev,s,s.next)>0&&Et(e.prev,e,e.next)>0)}function Et(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Lr(s,e){return s.x===e.x&&s.y===e.y}function jp(s,e,t,n){let i=Ac(Et(s,e,t)),r=Ac(Et(s,e,n)),a=Ac(Et(t,n,s)),o=Ac(Et(t,n,e));return!!(i!==r&&a!==o||i===0&&wc(s,t,e)||r===0&&wc(s,n,e)||a===0&&wc(t,s,n)||o===0&&wc(t,e,n))}function wc(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Ac(s){return s>0?1:s<0?-1:0}function m_(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&jp(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function mo(s,e){return Et(s.prev,s,s.next)<0?Et(s,e,s.next)>=0&&Et(s,s.prev,e)>=0:Et(s,e,s.prev)<0||Et(s,s.next,e)<0}function g_(s,e){let t=s,n=!1,i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Qp(s,e){let t=ah(s.i,s.x,s.y),n=ah(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Mf(s,e,t,n){let i=ah(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function go(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function ah(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function __(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}function bf(s){let e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Tf(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}function v_(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}function y_(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){let i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}function Ef(s,e,t){let n=`${s.x},${s.y},${s.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${s.x},${s.y},${s.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n),t.add(i),!0)}function Os(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];if(Af(i))i.isRenderTargetTexture?(de("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Af(i[0])){let r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Qt(s){let e={};for(let t=0;t<s.length;t++){let n=Os(s[t]);for(let i in n)e[i]=n[i]}return e}function Af(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function S_(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function ed(s){let e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}function Fn(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Ba(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function em(s){function e(i,r){return s[i]-s[r]}let t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function lh(s,e,t){let n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i}function tm(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}function T_(s,e,t,n,i=30){let r=s.clone();r.name=e;let a=[];for(let l=0;l<r.tracks.length;++l){let c=r.tracks[l],u=c.getValueSize(),d=[],h=[];for(let f=0;f<c.times.length;++f){let p=c.times[f]*i;if(!(p<t||p>=n)){d.push(c.times[f]);for(let _=0;_<u;++_)h.push(c.values[f*u+_])}}d.length!==0&&(c.times=Fn(d,c.times.constructor),c.values=Fn(h,c.values.constructor),a.push(c))}r.tracks=a;let o=1/0;for(let l=0;l<r.tracks.length;++l)o>r.tracks[l].times[0]&&(o=r.tracks[l].times[0]);for(let l=0;l<r.tracks.length;++l)r.tracks[l].shift(-1*o);return r.resetDuration(),r}function E_(s,e=0,t=s,n=30){n<=0&&(n=30);let i=t.tracks.length,r=e/n;for(let a=0;a<i;++a){let o=t.tracks[a],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;let c=s.tracks.find(function(m){return m.name===o.name&&m.ValueTypeName===l});if(c===void 0)continue;let u=0,d=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=d/3);let h=0,f=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=f/3);let p=o.times.length-1,_;if(r<=o.times[0]){let m=u,y=d-u;_=o.values.slice(m,y)}else if(r>=o.times[p]){let m=p*d+u,y=m+d-u;_=o.values.slice(m,y)}else{let m=o.createInterpolant(),y=u,M=d-u;m.evaluate(r),_=m.resultBuffer.slice(y,M)}l==="quaternion"&&new Vt().fromArray(_).normalize().conjugate().toArray(_);let g=c.times.length;for(let m=0;m<g;++m){let y=m*f+h;if(l==="quaternion")Vt.multiplyQuaternionsFlat(c.values,y,_,0,c.values,y);else{let M=f-h*2;for(let x=0;x<M;++x)c.values[y+x]-=_[x]}}}return s.blendMode=iu,s}function nm(s,e,t,n,i){let r=1-s;return r*r*r*e+3*r*r*s*t+3*r*s*s*n+s*s*s*i}function w_(s,e,t,n,i){let r=1-s;return 3*r*r*(t-e)+6*r*s*(n-t)+3*s*s*(i-n)}function A_(s,e,t,n,i){let r=(s-e)/(i-e);for(let a=0;a<8;a++){let o=nm(r,e,t,n,i)-s;if(Math.abs(o)<1e-10)break;let l=w_(r,e,t,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}function Cf(s,e){for(let t=0,n=s.length;t!==n;t+=2)s[t]*=e}function C_(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return As;case"vector":case"vector2":case"vector3":case"vector4":return Hr;case"color":return Vr;case"quaternion":return Cs;case"bool":case"boolean":return ei;case"string":return ti}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function R_(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=C_(s.type);if(s.times===void 0){let n=[],i=[];tm(s.keys,n,i,"value"),s.times=n,s.values=i}let t;return e.parse!==void 0?t=e.parse(s):t=new e(s.name,s.times,s.values,s.interpolation),Ba(s.settings)&&(t.settings={inTangents:Fn(s.settings.inTangents,Float32Array),outTangents:Fn(s.settings.outTangents,Float32Array)}),t}function Rf(s){try{let e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}function I_(){this._document.hidden===!1&&this.reset()}function Vf(s,e){return s.distance-e.distance}function ph(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let a=0,o=r.length;a<o;a++)ph(r[a],e,t,!0)}}function im(s){let e=[];s.isBone===!0&&e.push(s);for(let t=0;t<s.children.length;t++)e.push(...im(s.children[t]));return e}function Pt(s,e,t,n,i,r,a){Uc.set(i,r,a).unproject(n);let o=e[s];if(o!==void 0){let l=t.getAttribute("position");for(let c=0,u=o.length;c<u;c++)l.setXYZ(o[c],Uc.x,Uc.y,Uc.z)}}function Y_(s,e){let t=s.image&&s.image.width?s.image.width/s.image.height:1;return t>e?(s.repeat.x=1,s.repeat.y=t/e,s.offset.x=0,s.offset.y=(1-s.repeat.y)/2):(s.repeat.x=e/t,s.repeat.y=1,s.offset.x=(1-s.repeat.x)/2,s.offset.y=0),s}function Z_(s,e){let t=s.image&&s.image.width?s.image.width/s.image.height:1;return t>e?(s.repeat.x=e/t,s.repeat.y=1,s.offset.x=(1-s.repeat.x)/2,s.offset.y=0):(s.repeat.x=1,s.repeat.y=t/e,s.offset.x=0,s.offset.y=(1-s.repeat.y)/2),s}function J_(s){return s.repeat.x=1,s.repeat.y=1,s.offset.x=0,s.offset.y=0,s}function au(s,e,t,n){let i=K_(n);switch(t){case tu:return s*e;case tl:return s*e/i.components*i.byteLength;case aa:return s*e/i.components*i.byteLength;case Mi:return s*e*2/i.components*i.byteLength;case nl:return s*e*2/i.components*i.byteLength;case nu:return s*e*3/i.components*i.byteLength;case jt:return s*e*4/i.components*i.byteLength;case il:return s*e*4/i.components*i.byteLength;case oa:case la:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ca:case ua:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case rl:case ol:return Math.max(s,16)*Math.max(e,8)/4;case sl:case al:return Math.max(s,8)*Math.max(e,8)/2;case ll:case cl:case hl:case dl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ul:case ha:case fl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case pl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ml:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case gl:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case _l:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case xl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case vl:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case yl:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Sl:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Ml:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case bl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Tl:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case El:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case wl:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Al:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Cl:case Rl:case Pl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Il:case Dl:return Math.ceil(s/4)*Math.ceil(e/4)*8;case da:case Ll:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function K_(s){switch(s){case ln:case $0:return{byteLength:1,components:1};case Ns:case j0:case Ct:return{byteLength:2,components:1};case Qo:case el:return{byteLength:2,components:4};case vn:case jo:case $t:return{byteLength:4,components:1};case Q0:case eu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}var mh,Kf,$f,gh,X0,_h,jf,Qf,Yi,xh,Ds,vi,Gt,Cn,on,Zi,Ji,q0,Y0,Ko,ep,ni,vh,yh,Sh,Mh,bh,Jr,Th,Eh,Z0,J0,wh,Ah,Ch,Rh,Ph,Ih,Dh,Lh,Uh,za,ka,Va,hs,Ha,Ga,Wa,Xa,Kr,Nh,Fh,Rn,$r,jr,Qr,Ki,ea,ta,na,Oc,Oh,$o,Hn,yi,ia,sa,Ls,ds,kt,dr,Tt,K0,tp,Us,np,xt,ra,ip,Gn,sp,ln,$0,j0,Ns,jo,vn,$t,Ct,Qo,el,Fs,Q0,eu,tu,nu,jt,zn,Si,tl,aa,Mi,nl,rp,il,oa,la,ca,ua,sl,rl,al,ol,ll,cl,ul,hl,dl,ha,fl,pl,ml,gl,_l,xl,vl,yl,Sl,Ml,bl,Tl,El,wl,Al,Cl,Rl,Pl,Il,Dl,da,Ll,Bh,zh,kh,fr,qa,La,Bc,Ui,Ni,pr,Ul,iu,ap,op,lp,Vh,su,cp,up,ii,Hh,Pn,Kt,mr,gr,ot,hp,dp,fp,pp,Ua,mp,gp,_p,xp,vp,yp,Sp,Mp,bp,Tp,Ep,wp,Ap,Gh,Wh,Xh,qh,Nl,Yh,Zh,Fl,Jh,Ol,Cp,Rp,Pp,Ip,Dp,Lp,Up,Np,Fp,ru,hn,Fi,Op,Bp,zp,kp,Vp,ng,Bd,Oi,Yp,dn,Yt,zd,us,fs,jh,sd,ee,Vt,rd,R,Su,kd,ad,Ye,Mu,Vd,Hd,et,Ws,Ya,yg,bn,zc,Sg,Tu,At,od,ut,vr,yt,ps,kc,ms,Vc,W0,Ge,Xs,Ln,Mg,bg,Ci,Zl,pn,Gd,Wd,En,gs,Tg,Xd,qs,ri,Jl,va,Eg,wg,qd,Yd,Zd,Jd,Ag,Ys,Eu,lt,Jn,Cg,_s,Zp,Ri,Kl,le,Zt,Za,Ja,Bi,Un,ai,Au,oi,Zs,Js,Kd,Cu,Ru,Pu,Iu,Du,Lu,On,Ft,li,Nn,$l,Ks,$s,js,Pi,Ii,ji,ya,jl,Ql,Qi,hi,Hc,Lt,ec,Pg,rt,Gc,Wc,Xc,qc,yr,Yc,Sr,Zc,Me,Ig,Sa,Nu,Ut,Dg,Sn,Fu,Qs,mn,Ma,zt,We,xs,nn,zi,Ou,Lg,Ug,Mn,Ng,Nt,Mr,er,ba,tr,nr,ir,Ta,Jp,tc,Ea,nc,$d,Bu,jd,Ka,sc,Qd,$a,ci,zu,rc,ac,fi,_n,ef,es,oc,tf,lc,cc,uc,ku,hc,nf,dc,mt,wa,sf,rf,Og,af,pc,Vu,of,Hu,ja,br,rn,lf,Bg,Qa,$n,sr,cf,mc,uf,zg,Aa,Ca,Tr,ts,kg,gc,jn,hf,eo,ih,cn,Gg,Wg,Xg,_c,ns,Ra,df,qg,Wu,Jt,xc,to,Ht,Jc,Kc,ff,Pa,vc,Xu,pf,kn,mf,gf,xn,no,Er,_f,sh,Sc,Mc,vs,io,$c,jc,ys,Qc,e0,ki,Ss,t0,pi,so,wr,mi,ro,ao,Ms,bs,gi,oo,bc,Tc,qu,Ec,lo,fn,Ts,co,vf,yf,Yu,Zu,Ju,Ar,Cr,uo,Rr,ho,Pr,Ir,Dr,n0,fo,Vi,_i,oh,Tn,_o,x_,Ur,xo,Nr,Qn,vo,Fr,Hi,yo,So,Mo,Or,bo,wf,To,en,M_,b_,ct,Gi,ws,Br,Eo,wo,Ao,Co,Wi,zr,Ro,Po,i0,xi,Io,kr,Do,Lo,an,ei,Vr,As,Uo,Cs,ti,Hr,Xi,Bn,Gr,td,Wt,ui,ch,wn,s0,r0,rr,qi,a0,o0,l0,Vn,No,Ku,Pf,If,Rs,Cc,Rc,Zn,Ps,Di,Df,Lf,It,uh,Wr,hh,Fo,An,dh,Xr,Oo,Bo,qr,zo,Uf,ko,Yr,Vo,Ho,$u,c0,P_,Nf,Ff,ju,u0,Pc,Zr,h0,Of,Bf,ss,d0,ar,or,Go,Wo,Is,rs,Qu,D_,as,os,f0,Xo,ls,zf,L_,cs,p0,m0,qo,nd,U_,id,N_,F_,O_,B_,z_,k_,V_,fh,pt,g0,Yo,H_,Zo,_0,x0,G_,v0,y0,S0,kf,M0,b0,T0,E0,ld,w0,Hf,Jo,Gf,Ic,lr,cr,eh,W_,X_,A0,Wf,C0,Li,Dc,th,R0,P0,q_,Xf,qf,I0,D0,L0,Yf,Lc,Zf,U0,Uc,wt,N0,Nc,F0,O0,B0,Jf,Fc,nh,z0,k0,V0,H0,G0,cd=Od(()=>{mh="186",Kf={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},$f={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},gh=0,X0=1,_h=2,jf=3,Qf=0,Yi=1,xh=2,Ds=3,vi=0,Gt=1,Cn=2,on=0,Zi=1,Ji=2,q0=3,Y0=4,Ko=5,ep=6,ni=100,vh=101,yh=102,Sh=103,Mh=104,bh=200,Jr=201,Th=202,Eh=203,Z0=204,J0=205,wh=206,Ah=207,Ch=208,Rh=209,Ph=210,Ih=211,Dh=212,Lh=213,Uh=214,za=0,ka=1,Va=2,hs=3,Ha=4,Ga=5,Wa=6,Xa=7,Kr=0,Nh=1,Fh=2,Rn=0,$r=1,jr=2,Qr=3,Ki=4,ea=5,ta=6,na=7,Oc="attached",Oh="detached",$o=300,Hn=301,yi=302,ia=303,sa=304,Ls=306,ds=1e3,kt=1001,dr=1002,Tt=1003,K0=1004,tp=1004,Us=1005,np=1005,xt=1006,ra=1007,ip=1007,Gn=1008,sp=1008,ln=1009,$0=1010,j0=1011,Ns=1012,jo=1013,vn=1014,$t=1015,Ct=1016,Qo=1017,el=1018,Fs=1020,Q0=35902,eu=35899,tu=1021,nu=1022,jt=1023,zn=1026,Si=1027,tl=1028,aa=1029,Mi=1030,nl=1031,rp=1032,il=1033,oa=33776,la=33777,ca=33778,ua=33779,sl=35840,rl=35841,al=35842,ol=35843,ll=36196,cl=37492,ul=37496,hl=37488,dl=37489,ha=37490,fl=37491,pl=37808,ml=37809,gl=37810,_l=37811,xl=37812,vl=37813,yl=37814,Sl=37815,Ml=37816,bl=37817,Tl=37818,El=37819,wl=37820,Al=37821,Cl=36492,Rl=36494,Pl=36495,Il=36283,Dl=36284,da=36285,Ll=36286,Bh=2200,zh=2201,kh=2202,fr=2300,qa=2301,La=2302,Bc=2303,Ui=2400,Ni=2401,pr=2402,Ul=2500,iu=2501,ap=0,op=1,lp=2,Vh=3200,su=3201,cp=3202,up=3203,ii=0,Hh=1,Pn="",Kt="srgb",mr="srgb-linear",gr="linear",ot="srgb",hp="",dp="rg",fp="ga",pp=0,Ua=7680,mp=7681,gp=7682,_p=7683,xp=34055,vp=34056,yp=5386,Sp=512,Mp=513,bp=514,Tp=515,Ep=516,wp=517,Ap=518,Gh=519,Wh=512,Xh=513,qh=514,Nl=515,Yh=516,Zh=517,Fl=518,Jh=519,Ol=35044,Cp=35048,Rp=35040,Pp=35045,Ip=35049,Dp=35041,Lp=35046,Up=35050,Np=35042,Fp="100",ru="300 es",hn=2e3,Fi=2001,Op={COMPUTE:"compute",RENDER:"render"},Bp={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},zp={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"},kp={TEXTURE_COMPARE:"depthTextureCompare"},Vp={NONE:0,SHARED:1,FULL:2};ng={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};Bd={},Oi=null;Yp={[za]:ka,[Va]:Wa,[Ha]:Xa,[hs]:Ga,[ka]:za,[Wa]:Va,[Xa]:Ha,[Ga]:hs},dn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}},Yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],zd=1234567,us=Math.PI/180,fs=180/Math.PI;jh={DEG2RAD:us,RAD2DEG:fs,generateUUID:gn,clamp:He,euclideanModulo:$h,mapLinear:ig,inverseLerp:sg,lerp:Na,damp:rg,pingpong:ag,smoothstep:og,smootherstep:lg,randInt:cg,randFloat:ug,randFloatSpread:hg,seededRandom:dg,degToRad:fg,radToDeg:pg,isPowerOfTwo:mg,ceilPowerOfTwo:gg,floorPowerOfTwo:_g,setQuaternionFromProperEuler:xg,normalize:$e,denormalize:sn},sd=class sd{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};sd.prototype.isVector2=!0;ee=sd,Vt=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],d=n[i+3],h=r[a+0],f=r[a+1],p=r[a+2],_=r[a+3];if(d!==_||l!==h||c!==f||u!==p){let g=l*h+c*f+u*p+d*_;g<0&&(h=-h,f=-f,p=-p,_=-_,g=-g);let m=1-o;if(g<.9995){let y=Math.acos(g),M=Math.sin(y);m=Math.sin(m*y)/M,o=Math.sin(o*y)/M,l=l*m+h*o,c=c*m+f*o,u=u*m+p*o,d=d*m+_*o}else{l=l*m+h*o,c=c*m+f*o,u=u*m+p*o,d=d*m+_*o;let y=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=y,c*=y,u*=y,d*=y}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,a){let o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],d=r[a],h=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+u*d+l*f-c*h,e[t+1]=l*p+u*h+c*d-o*f,e[t+2]=c*p+u*f+o*h-l*d,e[t+3]=u*p-o*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),d=o(r/2),h=l(n/2),f=l(i/2),p=l(r/2);switch(a){case"XYZ":this._x=h*u*d+c*f*p,this._y=c*f*d-h*u*p,this._z=c*u*p+h*f*d,this._w=c*u*d-h*f*p;break;case"YXZ":this._x=h*u*d+c*f*p,this._y=c*f*d-h*u*p,this._z=c*u*p-h*f*d,this._w=c*u*d+h*f*p;break;case"ZXY":this._x=h*u*d-c*f*p,this._y=c*f*d+h*u*p,this._z=c*u*p+h*f*d,this._w=c*u*d-h*f*p;break;case"ZYX":this._x=h*u*d-c*f*p,this._y=c*f*d+h*u*p,this._z=c*u*p-h*f*d,this._w=c*u*d+h*f*p;break;case"YZX":this._x=h*u*d+c*f*p,this._y=c*f*d+h*u*p,this._z=c*u*p-h*f*d,this._w=c*u*d-h*f*p;break;case"XZY":this._x=h*u*d-c*f*p,this._y=c*f*d-h*u*p,this._z=c*u*p+h*f*d,this._w=c*u*d+h*f*p;break;default:de("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+o+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(u-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(He(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+i*c-r*l,this._y=i*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},rd=class rd{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(kd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(kd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),u=2*(o*t-r*i),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-r*d,this.z=i+l*d+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Su.copy(this).projectOnVector(e),this.sub(Su)}reflect(e){return this.sub(Su.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};rd.prototype.isVector3=!0;R=rd,Su=new R,kd=new Vt,ad=class ad{constructor(e,t,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],f=n[5],p=n[8],_=i[0],g=i[3],m=i[6],y=i[1],M=i[4],x=i[7],E=i[2],T=i[5],A=i[8];return r[0]=a*_+o*y+l*E,r[3]=a*g+o*M+l*T,r[6]=a*m+o*x+l*A,r[1]=c*_+u*y+d*E,r[4]=c*g+u*M+d*T,r[7]=c*m+u*x+d*A,r[2]=h*_+f*y+p*E,r[5]=h*g+f*M+p*T,r[8]=h*m+f*x+p*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+i*r*c-i*a*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,h=o*l-u*r,f=c*r-a*l,p=t*d+n*h+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return e[0]=d*_,e[1]=(i*c-u*n)*_,e[2]=(o*n-i*a)*_,e[3]=h*_,e[4]=(u*t-i*l)*_,e[5]=(i*r-o*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Kn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Mu.makeScale(e,t)),this}rotate(e){return Kn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Mu.makeRotation(-e)),this}translate(e,t){return Kn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Mu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ad.prototype.isMatrix3=!0;Ye=ad,Mu=new Ye,Vd=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Hd=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);et=vg();Ya=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ws===void 0&&(Ws=_r("canvas")),Ws.width=e.width,Ws.height=e.height;let i=Ws.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ws}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=_r("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=di(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(di(t[n]/255)*255):t[n]=di(t[n]);return{data:t,width:e.width,height:e.height}}else return de("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},yg=0,bn=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:yg++}),this.uuid=gn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(bu(i[a].image)):r.push(bu(i[a]))}else r=bu(i);n.url=r}return t||(e.images[this.uuid]=n),n}};zc=class extends bn{constructor(e=null){Kn('Source: "Source" has been renamed to "TextureSource". Please update your code to use "THREE.TextureSource" instead.'),super(e),this.isSource=!0}},Sg=0,Tu=new R,At=class s extends dn{constructor(e=s.DEFAULT_IMAGE,t=s.DEFAULT_MAPPING,n=kt,i=kt,r=xt,a=Gn,o=jt,l=ln,c=s.DEFAULT_ANISOTROPY,u=Pn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Sg++}),this.uuid=gn(),this.name="",this.source=new bn(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ee(0,0),this.repeat=new ee(1,1),this.center=new ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Tu).x}get height(){return this.source.getSize(Tu).y}get depth(){return this.source.getSize(Tu).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){de(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){de(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==$o)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ds:e.x=e.x-Math.floor(e.x);break;case kt:e.x=e.x<0?0:1;break;case dr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ds:e.y=e.y-Math.floor(e.y);break;case kt:e.y=e.y<0?0:1;break;case dr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};At.DEFAULT_IMAGE=null;At.DEFAULT_MAPPING=$o;At.DEFAULT_ANISOTROPY=1;od=class od{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,x=(f+1)/2,E=(m+1)/2,T=(u+h)/4,A=(d+_)/4,v=(p+g)/4;return M>x&&M>E?M<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(M),i=T/n,r=A/n):x>E?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=T/i,r=v/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=A/r,i=v/r),this.set(n,i,r,t),this}let y=Math.sqrt((g-p)*(g-p)+(d-_)*(d-_)+(h-u)*(h-u));return Math.abs(y)<.001&&(y=1),this.x=(g-p)/y,this.y=(d-_)/y,this.z=(h-u)/y,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this.w=He(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this.w=He(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};od.prototype.isVector4=!0;ut=od,vr=class extends dn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t),this.textures=[];let i={width:e,height:t,depth:n.depth},r=new At(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:xt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new bn(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},yt=class extends vr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ps=class extends At{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Tt,this.minFilter=Tt,this.wrapR=kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},kc=class extends yt{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new ps(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}},ms=class extends At{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Tt,this.minFilter=Tt,this.wrapR=kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Vc=class extends yt{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new ms(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}},W0=class W0{constructor(e,t,n,i,r,a,o,l,c,u,d,h,f,p,_,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,u,d,h,f,p,_,g)}set(e,t,n,i,r,a,o,l,c,u,d,h,f,p,_,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=u,m[10]=d,m[14]=h,m[3]=f,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new W0().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/Xs.setFromMatrixColumn(e,0).length(),r=1/Xs.setFromMatrixColumn(e,1).length(),a=1/Xs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let h=a*u,f=a*d,p=o*u,_=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+p*c,t[5]=h-_*c,t[9]=-o*l,t[2]=_-h*c,t[6]=p+f*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*u,f=l*d,p=c*u,_=c*d;t[0]=h+_*o,t[4]=p*o-f,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=f*o-p,t[6]=_+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*u,f=l*d,p=c*u,_=c*d;t[0]=h-_*o,t[4]=-a*d,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*u,t[9]=_-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*u,f=a*d,p=o*u,_=o*d;t[0]=l*u,t[4]=p*c-f,t[8]=h*c+_,t[1]=l*d,t[5]=_*c+h,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*u,t[4]=_-h*d,t[8]=p*d+f,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*d+p,t[10]=h-_*d}else if(e.order==="XZY"){let h=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+_,t[5]=a*u,t[9]=f*d-p,t[2]=p*d-f,t[6]=o*u,t[10]=_*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Mg,e,bg)}lookAt(e,t,n){let i=this.elements;return pn.subVectors(e,t),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Ci.crossVectors(n,pn),Ci.lengthSq()===0&&(Math.abs(n.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Ci.crossVectors(n,pn)),Ci.normalize(),Zl.crossVectors(pn,Ci),i[0]=Ci.x,i[4]=Zl.x,i[8]=pn.x,i[1]=Ci.y,i[5]=Zl.y,i[9]=pn.y,i[2]=Ci.z,i[6]=Zl.z,i[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],f=n[13],p=n[2],_=n[6],g=n[10],m=n[14],y=n[3],M=n[7],x=n[11],E=n[15],T=i[0],A=i[4],v=i[8],w=i[12],P=i[1],I=i[5],F=i[9],z=i[13],L=i[2],B=i[6],Y=i[10],X=i[14],Z=i[3],G=i[7],J=i[11],Q=i[15];return r[0]=a*T+o*P+l*L+c*Z,r[4]=a*A+o*I+l*B+c*G,r[8]=a*v+o*F+l*Y+c*J,r[12]=a*w+o*z+l*X+c*Q,r[1]=u*T+d*P+h*L+f*Z,r[5]=u*A+d*I+h*B+f*G,r[9]=u*v+d*F+h*Y+f*J,r[13]=u*w+d*z+h*X+f*Q,r[2]=p*T+_*P+g*L+m*Z,r[6]=p*A+_*I+g*B+m*G,r[10]=p*v+_*F+g*Y+m*J,r[14]=p*w+_*z+g*X+m*Q,r[3]=y*T+M*P+x*L+E*Z,r[7]=y*A+M*I+x*B+E*G,r[11]=y*v+M*F+x*Y+E*J,r[15]=y*w+M*z+x*X+E*Q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],p=e[3],_=e[7],g=e[11],m=e[15],y=l*f-c*h,M=o*f-c*d,x=o*h-l*d,E=a*f-c*u,T=a*h-l*u,A=a*d-o*u;return t*(_*y-g*M+m*x)-n*(p*y-g*E+m*T)+i*(p*M-_*E+m*A)-r*(p*x-_*T+g*A)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(r*u-o*l)+i*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],p=e[12],_=e[13],g=e[14],m=e[15],y=t*o-n*a,M=t*l-i*a,x=t*c-r*a,E=n*l-i*o,T=n*c-r*o,A=i*c-r*l,v=u*_-d*p,w=u*g-h*p,P=u*m-f*p,I=d*g-h*_,F=d*m-f*_,z=h*m-f*g,L=y*z-M*F+x*I+E*P-T*w+A*v;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let B=1/L;return e[0]=(o*z-l*F+c*I)*B,e[1]=(i*F-n*z-r*I)*B,e[2]=(_*A-g*T+m*E)*B,e[3]=(h*T-d*A-f*E)*B,e[4]=(l*P-a*z-c*w)*B,e[5]=(t*z-i*P+r*w)*B,e[6]=(g*x-p*A-m*M)*B,e[7]=(u*A-h*x+f*M)*B,e[8]=(a*F-o*P+c*v)*B,e[9]=(n*P-t*F-r*v)*B,e[10]=(p*T-_*x+m*y)*B,e[11]=(d*x-u*T-f*y)*B,e[12]=(o*w-a*I-l*v)*B,e[13]=(t*I-n*w+i*v)*B,e[14]=(_*M-p*E-g*y)*B,e[15]=(u*E-d*M+h*y)*B,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,d=o+o,h=r*c,f=r*u,p=r*d,_=a*u,g=a*d,m=o*d,y=l*c,M=l*u,x=l*d,E=n.x,T=n.y,A=n.z;return i[0]=(1-(_+m))*E,i[1]=(f+x)*E,i[2]=(p-M)*E,i[3]=0,i[4]=(f-x)*T,i[5]=(1-(h+m))*T,i[6]=(g+y)*T,i[7]=0,i[8]=(p+M)*A,i[9]=(g-y)*A,i[10]=(1-(h+_))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Xs.set(i[0],i[1],i[2]).length(),o=Xs.set(i[4],i[5],i[6]).length(),l=Xs.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Ln.copy(this);let c=1/a,u=1/o,d=1/l;return Ln.elements[0]*=c,Ln.elements[1]*=c,Ln.elements[2]*=c,Ln.elements[4]*=u,Ln.elements[5]*=u,Ln.elements[6]*=u,Ln.elements[8]*=d,Ln.elements[9]*=d,Ln.elements[10]*=d,t.setFromRotationMatrix(Ln),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,r,a,o=hn,l=!1){let c=this.elements,u=2*r/(t-e),d=2*r/(n-i),h=(t+e)/(t-e),f=(n+i)/(n-i),p,_;if(l)p=r/(a-r),_=a*r/(a-r);else if(o===hn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Fi)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=hn,l=!1){let c=this.elements,u=2/(t-e),d=2/(n-i),h=-(t+e)/(t-e),f=-(n+i)/(n-i),p,_;if(l)p=1/(a-r),_=a/(a-r);else if(o===hn)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===Fi)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};W0.prototype.isMatrix4=!0;Ge=W0,Xs=new R,Ln=new Ge,Mg=new R(0,0,0),bg=new R(1,1,1),Ci=new R,Zl=new R,pn=new R,Gd=new Ge,Wd=new Vt,En=class s{constructor(e=0,t=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],d=i[2],h=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-He(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-He(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(He(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-He(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:de("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Gd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wd.setFromEuler(this),this.setFromQuaternion(Wd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};En.DEFAULT_ORDER="XYZ";gs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Tg=0,Xd=new R,qs=new Vt,ri=new Ge,Jl=new R,va=new R,Eg=new R,wg=new Vt,qd=new R(1,0,0),Yd=new R(0,1,0),Zd=new R(0,0,1),Jd={type:"added"},Ag={type:"removed"},Ys={type:"childadded",child:null},Eu={type:"childremoved",child:null},lt=class s extends dn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Tg++}),this.uuid=gn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let e=new R,t=new En,n=new Vt,i=new R(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ge},normalMatrix:{value:new Ye}}),this.matrix=new Ge,this.matrixWorld=new Ge,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return qs.setFromAxisAngle(e,t),this.quaternion.multiply(qs),this}rotateOnWorldAxis(e,t){return qs.setFromAxisAngle(e,t),this.quaternion.premultiply(qs),this}rotateX(e){return this.rotateOnAxis(qd,e)}rotateY(e){return this.rotateOnAxis(Yd,e)}rotateZ(e){return this.rotateOnAxis(Zd,e)}translateOnAxis(e,t){return Xd.copy(e).applyQuaternion(this.quaternion),this.position.add(Xd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(qd,e)}translateY(e){return this.translateOnAxis(Yd,e)}translateZ(e){return this.translateOnAxis(Zd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ri.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Jl.copy(e):Jl.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),va.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ri.lookAt(va,Jl,this.up):ri.lookAt(Jl,va,this.up),this.quaternion.setFromRotationMatrix(ri),i&&(ri.extractRotation(i.matrixWorld),qs.setFromRotationMatrix(ri),this.quaternion.premultiply(qs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(De("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Jd),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null):De("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ag),Eu.child=e,this.dispatchEvent(Eu),Eu.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ri.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ri.multiply(e.parent.matrixWorld)),e.applyMatrix4(ri),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Jd),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(va,e,Eg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(va,wg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),h=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};lt.DEFAULT_UP=new R(0,1,0);lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;Jn=class extends lt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Cg={type:"move"},_s=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Jn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Jn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Jn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let g=t.getJointPose(_,n),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&h>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cg)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Jn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Zp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ri={h:0,s:0,l:0},Kl={h:0,s:0,l:0};le=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=et.workingColorSpace){if(e=$h(e,1),t=He(t,0,1),n=He(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=wu(a,r,e+1/3),this.g=wu(a,r,e),this.b=wu(a,r,e-1/3)}return et.colorSpaceToWorking(this,i),this}setStyle(e,t=Kt){function n(r){r!==void 0&&parseFloat(r)<1&&de("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:de("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);de("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Kt){let n=Zp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):de("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=di(e.r),this.g=di(e.g),this.b=di(e.b),this}copyLinearToSRGB(e){return this.r=hr(e.r),this.g=hr(e.g),this.b=hr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Kt){return et.workingToColorSpace(Zt.copy(this),e),Math.round(He(Zt.r*255,0,255))*65536+Math.round(He(Zt.g*255,0,255))*256+Math.round(He(Zt.b*255,0,255))}getHexString(e=Kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(Zt.copy(this),t);let n=Zt.r,i=Zt.g,r=Zt.b,a=Math.max(n,i,r),o=Math.min(n,i,r),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(Zt.copy(this),t),e.r=Zt.r,e.g=Zt.g,e.b=Zt.b,e}getStyle(e=Kt){et.workingToColorSpace(Zt.copy(this),e);let t=Zt.r,n=Zt.g,i=Zt.b;return e!==Kt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Ri),this.setHSL(Ri.h+e,Ri.s+t,Ri.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ri),e.getHSL(Kl);let n=Na(Ri.h,Kl.h,t),i=Na(Ri.s,Kl.s,t),r=Na(Ri.l,Kl.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Zt=new le;le.NAMES=Zp;Za=class s{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new le(e),this.density=t}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},Ja=class s{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new le(e),this.near=t,this.far=n}clone(){return new s(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Bi=class extends lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Un=new R,ai=new R,Au=new R,oi=new R,Zs=new R,Js=new R,Kd=new R,Cu=new R,Ru=new R,Pu=new R,Iu=new ut,Du=new ut,Lu=new ut,On=class s{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Un.subVectors(e,t),i.cross(Un);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Un.subVectors(i,t),ai.subVectors(n,t),Au.subVectors(e,t);let a=Un.dot(Un),o=Un.dot(ai),l=Un.dot(Au),c=ai.dot(ai),u=ai.dot(Au),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let h=1/d,f=(c*l-o*u)*h,p=(a*u-o*l)*h;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,oi)===null?!1:oi.x>=0&&oi.y>=0&&oi.x+oi.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,oi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,oi.x),l.addScaledVector(a,oi.y),l.addScaledVector(o,oi.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return Iu.setScalar(0),Du.setScalar(0),Lu.setScalar(0),Iu.fromBufferAttribute(e,t),Du.fromBufferAttribute(e,n),Lu.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Iu,r.x),a.addScaledVector(Du,r.y),a.addScaledVector(Lu,r.z),a}static isFrontFacing(e,t,n,i){return Un.subVectors(n,t),ai.subVectors(e,t),Un.cross(ai).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),ai.subVectors(this.a,this.b),Un.cross(ai).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return s.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return s.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return s.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return s.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return s.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,a,o;Zs.subVectors(i,n),Js.subVectors(r,n),Cu.subVectors(e,n);let l=Zs.dot(Cu),c=Js.dot(Cu);if(l<=0&&c<=0)return t.copy(n);Ru.subVectors(e,i);let u=Zs.dot(Ru),d=Js.dot(Ru);if(u>=0&&d<=u)return t.copy(i);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Zs,a);Pu.subVectors(e,r);let f=Zs.dot(Pu),p=Js.dot(Pu);if(p>=0&&f<=p)return t.copy(r);let _=f*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Js,o);let g=u*p-f*d;if(g<=0&&d-u>=0&&f-p>=0)return Kd.subVectors(r,i),o=(d-u)/(d-u+(f-p)),t.copy(i).addScaledVector(Kd,o);let m=1/(g+_+h);return a=_*m,o=h*m,t.copy(n).addScaledVector(Zs,a).addScaledVector(Js,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ft=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Nn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Nn):Nn.fromBufferAttribute(r,a),Nn.applyMatrix4(e.matrixWorld),this.expandByPoint(Nn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),$l.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$l.copy(n.boundingBox)),$l.applyMatrix4(e.matrixWorld),this.union($l)}let i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Nn),Nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ya),jl.subVectors(this.max,ya),Ks.subVectors(e.a,ya),$s.subVectors(e.b,ya),js.subVectors(e.c,ya),Pi.subVectors($s,Ks),Ii.subVectors(js,$s),ji.subVectors(Ks,js);let t=[0,-Pi.z,Pi.y,0,-Ii.z,Ii.y,0,-ji.z,ji.y,Pi.z,0,-Pi.x,Ii.z,0,-Ii.x,ji.z,0,-ji.x,-Pi.y,Pi.x,0,-Ii.y,Ii.x,0,-ji.y,ji.x,0];return!Uu(t,Ks,$s,js,jl)||(t=[1,0,0,0,1,0,0,0,1],!Uu(t,Ks,$s,js,jl))?!1:(Ql.crossVectors(Pi,Ii),t=[Ql.x,Ql.y,Ql.z],Uu(t,Ks,$s,js,jl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Nn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Nn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},li=[new R,new R,new R,new R,new R,new R,new R,new R],Nn=new R,$l=new Ft,Ks=new R,$s=new R,js=new R,Pi=new R,Ii=new R,ji=new R,ya=new R,jl=new R,Ql=new R,Qi=new R;hi=Rg();Hc=class{static toHalfFloat(e){return un(e)}static fromHalfFloat(e){return Ia(e)}},Lt=new R,ec=new ee,Pg=0,rt=class extends dn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ol,this.updateRanges=[],this.gpuType=$t,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ec.fromBufferAttribute(this,t),ec.applyMatrix3(e),this.setXY(t,ec.x,ec.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix3(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix4(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyNormalMatrix(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.transformDirection(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$e(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=sn(t,this.array)),t}setX(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=sn(t,this.array)),t}setY(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=sn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=sn(t,this.array)),t}setW(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),i=$e(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),i=$e(i,this.array),r=$e(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}},Gc=class extends rt{constructor(e,t,n){super(new Int8Array(e),t,n)}},Wc=class extends rt{constructor(e,t,n){super(new Uint8Array(e),t,n)}},Xc=class extends rt{constructor(e,t,n){super(new Uint8ClampedArray(e),t,n)}},qc=class extends rt{constructor(e,t,n){super(new Int16Array(e),t,n)}},yr=class extends rt{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Yc=class extends rt{constructor(e,t,n){super(new Int32Array(e),t,n)}},Sr=class extends rt{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Zc=class extends rt{constructor(e,t,n){super(new Uint16Array(e),t,n),this.isFloat16BufferAttribute=!0}getX(e){let t=Ia(this.array[e*this.itemSize]);return this.normalized&&(t=sn(t,this.array)),t}setX(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize]=un(t),this}getY(e){let t=Ia(this.array[e*this.itemSize+1]);return this.normalized&&(t=sn(t,this.array)),t}setY(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+1]=un(t),this}getZ(e){let t=Ia(this.array[e*this.itemSize+2]);return this.normalized&&(t=sn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+2]=un(t),this}getW(e){let t=Ia(this.array[e*this.itemSize+3]);return this.normalized&&(t=sn(t,this.array)),t}setW(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+3]=un(t),this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array)),this.array[e+0]=un(t),this.array[e+1]=un(n),this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),i=$e(i,this.array)),this.array[e+0]=un(t),this.array[e+1]=un(n),this.array[e+2]=un(i),this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),i=$e(i,this.array),r=$e(r,this.array)),this.array[e+0]=un(t),this.array[e+1]=un(n),this.array[e+2]=un(i),this.array[e+3]=un(r),this}},Me=class extends rt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Ig=new Ft,Sa=new R,Nu=new R,Ut=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Ig.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Sa.subVectors(e,this.center);let t=Sa.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Sa,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Nu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Sa.copy(e.center).add(Nu)),this.expandByPoint(Sa.copy(e.center).sub(Nu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Dg=0,Sn=new Ge,Fu=new lt,Qs=new R,mn=new Ft,Ma=new Ft,zt=new R,We=class s extends dn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dg++}),this.uuid=gn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(tg(e)?Sr:yr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Sn.makeRotationFromQuaternion(e),this.applyMatrix4(Sn),this}rotateX(e){return Sn.makeRotationX(e),this.applyMatrix4(Sn),this}rotateY(e){return Sn.makeRotationY(e),this.applyMatrix4(Sn),this}rotateZ(e){return Sn.makeRotationZ(e),this.applyMatrix4(Sn),this}translate(e,t,n){return Sn.makeTranslation(e,t,n),this.applyMatrix4(Sn),this}scale(e,t,n){return Sn.makeScale(e,t,n),this.applyMatrix4(Sn),this}lookAt(e){return Fu.lookAt(e),Fu.updateMatrix(),this.applyMatrix4(Fu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qs).negate(),this.translate(Qs.x,Qs.y,Qs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,r=e.length;i<r;i++){let a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Me(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&de("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ft);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){De("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];mn.setFromBufferAttribute(r),this.morphTargetsRelative?(zt.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(zt),zt.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(zt)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&De('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ut);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){De("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){let n=this.boundingSphere.center;if(mn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ma.setFromBufferAttribute(o),this.morphTargetsRelative?(zt.addVectors(mn.min,Ma.min),mn.expandByPoint(zt),zt.addVectors(mn.max,Ma.max),mn.expandByPoint(zt)):(mn.expandByPoint(Ma.min),mn.expandByPoint(Ma.max))}mn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)zt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(zt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)zt.fromBufferAttribute(o,c),l&&(Qs.fromBufferAttribute(e,c),zt.add(Qs)),i=Math.max(i,n.distanceToSquared(zt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&De('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){De("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new rt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new R,l[v]=new R;let c=new R,u=new R,d=new R,h=new ee,f=new ee,p=new ee,_=new R,g=new R;function m(v,w,P){c.fromBufferAttribute(n,v),u.fromBufferAttribute(n,w),d.fromBufferAttribute(n,P),h.fromBufferAttribute(r,v),f.fromBufferAttribute(r,w),p.fromBufferAttribute(r,P),u.sub(c),d.sub(c),f.sub(h),p.sub(h);let I=1/(f.x*p.y-p.x*f.y);isFinite(I)&&(_.copy(u).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(I),g.copy(d).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(I),o[v].add(_),o[w].add(_),o[P].add(_),l[v].add(g),l[w].add(g),l[P].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let v=0,w=y.length;v<w;++v){let P=y[v],I=P.start,F=P.count;for(let z=I,L=I+F;z<L;z+=3)m(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let M=new R,x=new R,E=new R,T=new R;function A(v){E.fromBufferAttribute(i,v),T.copy(E);let w=o[v];M.copy(w),M.sub(E.multiplyScalar(E.dot(w))).normalize(),x.crossVectors(T,w);let I=x.dot(l[v])<0?-1:1;a.setXYZW(v,M.x,M.y,M.z,I)}for(let v=0,w=y.length;v<w;++v){let P=y[v],I=P.start,F=P.count;for(let z=I,L=I+F;z<L;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new rt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let i=new R,r=new R,a=new R,o=new R,l=new R,c=new R,u=new R,d=new R;if(e)for(let h=0,f=e.count;h<f;h+=3){let p=e.getX(h+0),_=e.getX(h+1),g=e.getX(h+2);i.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,g),u.subVectors(a,r),d.subVectors(i,r),u.cross(d),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)i.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),d.subVectors(i,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)zt.fromBufferAttribute(e,t),zt.normalize(),e.setXYZ(t,zt.x,zt.y,zt.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,d=o.normalized,h=new c.constructor(l.length*u),f=0,p=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*u;for(let m=0;m<u;m++)h[p++]=c[f++]}return new rt(h,u,d)}if(this.index===null)return de("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new s,n=this.index.array,i=this.attributes;for(let o in i){let l=i[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let u=0,d=c.length;u<d;u++){let h=c[u],f=e(h,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(i[l]=u,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let u=i[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},xs=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ol,this.updateRanges=[],this.version=0,this.uuid=gn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=gn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=gn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},nn=new R,zi=class s{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$e(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=sn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=sn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=sn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=sn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),i=$e(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),i=$e(i,this.array),r=$e(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){xr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new rt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new s(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){xr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ou=new R,Lg=new R,Ug=new Ye,Mn=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=Ou.subVectors(n,t).cross(Lg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(Ou),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ug.getNormalMatrix(e),i=this.coplanarPoint(Ou).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Ng=0,Nt=class extends dn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ng++}),this.uuid=gn(),this.name="",this.type="Material",this.blending=Zi,this.side=vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Z0,this.blendDst=J0,this.blendEquation=ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new le(0,0,0),this.blendAlpha=0,this.depthFunc=hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ua,this.stencilZFail=Ua,this.stencilZPass=Ua,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){de(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){de(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new le().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Mn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ee().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ee().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Mr=class extends Nt{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new le(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ba=new R,tr=new R,nr=new R,ir=new ee,Ta=new ee,Jp=new Ge,tc=new R,Ea=new R,nc=new R,$d=new ee,Bu=new ee,jd=new ee,Ka=class extends lt{constructor(e=new Mr){if(super(),this.isSprite=!0,this.type="Sprite",er===void 0){er=new We;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new xs(t,5);er.setIndex([0,1,2,0,2,3]),er.setAttribute("position",new zi(n,3,0,!1)),er.setAttribute("uv",new zi(n,2,3,!1))}this.geometry=er,this.material=e,this.center=new ee(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&De('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),tr.setFromMatrixScale(this.matrixWorld),Jp.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),nr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&tr.multiplyScalar(-nr.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let a=this.center;ic(tc.set(-.5,-.5,0),nr,a,tr,i,r),ic(Ea.set(.5,-.5,0),nr,a,tr,i,r),ic(nc.set(.5,.5,0),nr,a,tr,i,r),$d.set(0,0),Bu.set(1,0),jd.set(1,1);let o=e.ray.intersectTriangle(tc,Ea,nc,!1,ba);if(o===null&&(ic(Ea.set(-.5,.5,0),nr,a,tr,i,r),Bu.set(0,1),o=e.ray.intersectTriangle(tc,nc,Ea,!1,ba),o===null))return;let l=e.ray.origin.distanceTo(ba);l<e.near||l>e.far||t.push({distance:l,point:ba.clone(),uv:On.getInterpolation(ba,tc,Ea,nc,$d,Bu,jd,new ee),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};sc=new R,Qd=new R,$a=class extends lt{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);let t=e.levels;for(let n=0,i=t.length;n<i;n++){let r=t[n];this.addLevel(r.object.clone(),r.distance,r.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);let i=this.levels,r;for(r=0;r<i.length&&!(t<i[r].distance);r++);return i.splice(r,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){let t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){let i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){let t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let r=t[n].distance;if(t[n].object.visible&&(r-=r*t[n].hysteresis),e<r)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){sc.setFromMatrixPosition(this.matrixWorld);let i=e.ray.origin.distanceTo(sc);this.getObjectForDistance(i).raycast(e,t)}}update(e){let t=this.levels;if(t.length>1){sc.setFromMatrixPosition(e.matrixWorld),Qd.setFromMatrixPosition(this.matrixWorld);let n=sc.distanceTo(Qd)/e.zoom;t[0].object.visible=!0;let i,r;for(i=1,r=t.length;i<r;i++){let a=t[i].distance;if(t[i].object.visible&&(a-=a*t[i].hysteresis),n>=a)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<r;i++)t[i].object.visible=!1}}toJSON(e){let t=super.toJSON(e);t.object.autoUpdate=this.autoUpdate,t.object.levels=[];let n=this.levels;for(let i=0,r=n.length;i<r;i++){let a=n[i];t.object.levels.push({object:a.object.uuid,distance:a.distance,hysteresis:a.hysteresis})}return t}},ci=new R,zu=new R,rc=new R,ac=new R,fi=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ci)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ci.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ci.copy(this.origin).addScaledVector(this.direction,t),ci.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){zu.copy(e).add(t).multiplyScalar(.5),rc.copy(t).sub(e).normalize(),ac.copy(this.origin).sub(zu);let r=e.distanceTo(t)*.5,a=-this.direction.dot(rc),o=ac.dot(this.direction),l=-ac.dot(rc),c=ac.lengthSq(),u=Math.abs(1-a*a),d,h,f,p;if(u>0)if(d=a*l-o,h=a*o-l,p=r*u,d>=0)if(h>=-p)if(h<=p){let _=1/u;d*=_,h*=_,f=d*(d+a*h+2*o)+h*(a*d+h+2*l)+c}else h=r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h<=-p?(d=Math.max(0,-(-a*r+o)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=p?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(a*r+o)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=a>0?-r:r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(zu).addScaledVector(rc,h),f}intersectSphere(e,t){if(e.radius<0)return null;ci.subVectors(e.center,this.origin);let n=ci.dot(this.direction),i=ci.dot(ci)-n*n,r=e.radius*e.radius;if(i>r)return null;let a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,i=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,i=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(o=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,ci)!==null}intersectTriangle(e,t,n,i,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,d=e.x-a.x,h=e.y-a.y,f=e.z-a.z,p=t.x-a.x,_=t.y-a.y,g=t.z-a.z,m=n.x-a.x,y=n.y-a.y,M=n.z-a.z,x=Math.abs(l),E=Math.abs(c),T=Math.abs(u),A,v,w,P,I,F,z,L,B,Y,X,Z;if(x>=E&&x>=T?(w=l,F=d,B=p,Z=m,l>=0?(A=c,v=u,P=h,I=f,z=_,L=g,Y=y,X=M):(A=u,v=c,P=f,I=h,z=g,L=_,Y=M,X=y)):E>=T?(w=c,F=h,B=_,Z=y,c>=0?(A=u,v=l,P=f,I=d,z=g,L=p,Y=M,X=m):(A=l,v=u,P=d,I=f,z=p,L=g,Y=m,X=M)):(w=u,F=f,B=g,Z=M,u>=0?(A=l,v=c,P=d,I=h,z=p,L=_,Y=m,X=y):(A=c,v=l,P=h,I=d,z=_,L=p,Y=y,X=m)),w===0)return null;let G=A/w,J=v/w,Q=1/w,we=P-G*F,Ee=I-J*F,tt=z-G*B,qe=L-J*B,Je=Y-G*Z,q=X-J*Z,te=Je*qe-q*tt,fe=we*q-Ee*Je,Oe=tt*Ee-qe*we;if(i){if(te<0||fe<0||Oe<0)return null}else if((te<0||fe<0||Oe<0)&&(te>0||fe>0||Oe>0))return null;let be=te+fe+Oe;if(be===0)return null;let ze=Q*(te*F+fe*B+Oe*Z);return(be>0?ze<0:ze>0)?null:this.at(ze/be,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},_n=class extends Nt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Kr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ef=new Ge,es=new fi,oc=new Ut,tf=new R,lc=new R,cc=new R,uc=new R,ku=new R,hc=new R,nf=new R,dc=new R,mt=class extends lt{constructor(e=new We,t=new _n){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let o=this.morphTargetInfluences;if(r&&o){hc.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=o[l],d=r[l];u!==0&&(ku.fromBufferAttribute(d,e),a?hc.addScaledVector(ku,u):hc.addScaledVector(ku.sub(t),u))}t.add(hc)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oc.copy(n.boundingSphere),oc.applyMatrix4(r),es.copy(e.ray).recast(e.near),!(oc.containsPoint(es.origin)===!1&&(es.intersectSphere(oc,tf)===null||es.origin.distanceToSquared(tf)>(e.far-e.near)**2))&&(ef.copy(r).invert(),es.copy(e.ray).applyMatrix4(ef),!(n.boundingBox!==null&&es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,es)))}_computeIntersections(e,t,n){let i,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=h.length;p<_;p++){let g=h[p],m=a[g.materialIndex],y=Math.max(g.start,f.start),M=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let x=y,E=M;x<E;x+=3){let T=o.getX(x),A=o.getX(x+1),v=o.getX(x+2);i=fc(this,m,e,n,c,u,d,T,A,v),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let g=p,m=_;g<m;g+=3){let y=o.getX(g),M=o.getX(g+1),x=o.getX(g+2);i=fc(this,a,e,n,c,u,d,y,M,x),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=h.length;p<_;p++){let g=h[p],m=a[g.materialIndex],y=Math.max(g.start,f.start),M=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let x=y,E=M;x<E;x+=3){let T=x,A=x+1,v=x+2;i=fc(this,m,e,n,c,u,d,T,A,v),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=p,m=_;g<m;g+=3){let y=g,M=g+1,x=g+2;i=fc(this,a,e,n,c,u,d,y,M,x),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}};wa=new ut,sf=new ut,rf=new ut,Og=new ut,af=new Ge,pc=new R,Vu=new Ut,of=new Ge,Hu=new fi,ja=class extends mt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Oc,this.bindMatrix=new Ge,this.bindMatrixInverse=new Ge,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ft),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,pc),this.boundingBox.expandByPoint(pc)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ut),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,pc),this.boundingSphere.expandByPoint(pc)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vu.copy(this.boundingSphere),Vu.applyMatrix4(i),e.ray.intersectsSphere(Vu)!==!1&&(of.copy(i).invert(),Hu.copy(e.ray).applyMatrix4(of),!(this.boundingBox!==null&&Hu.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Hu)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new ut,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Oc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Oh?this.bindMatrixInverse.copy(this.bindMatrix).invert():de("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;sf.fromBufferAttribute(i.attributes.skinIndex,e),rf.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(wa.copy(t),t.set(0,0,0,0)):(wa.set(...t,1),t.set(0,0,0)),wa.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let a=rf.getComponent(r);if(a!==0){let o=sf.getComponent(r);af.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Og.copy(wa).applyMatrix4(af),a)}}return t.isVector4&&(t.w=wa.w),t.applyMatrix4(this.bindMatrixInverse)}},br=class extends lt{constructor(){super(),this.isBone=!0,this.type="Bone"}},rn=class extends At{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Tt,u=Tt,d,h){super(null,a,o,l,c,u,i,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},lf=new Ge,Bg=new Ge,Qa=class s{constructor(e=[],t=[]){this.uuid=gn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){de("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ge)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Ge;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:Bg;lf.multiplyMatrices(o,t[r]),lf.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new rn(t,e,e,jt,$t);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let r=e.bones[n],a=t[r];a===void 0&&(de("Skeleton: No bone found with UUID:",r),a=new br),this.bones.push(a),this.boneInverses.push(new Ge().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){let a=t[i];e.bones.push(a.uuid);let o=n[i];e.boneInverses.push(o.toArray())}return e}},$n=class extends rt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},sr=new Ge,cf=new Ge,mc=[],uf=new Ft,zg=new Ge,Aa=new mt,Ca=new Ut,Tr=class extends mt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new $n(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,zg)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ft),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,sr),uf.copy(e.boundingBox).applyMatrix4(sr),this.boundingBox.union(uf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ut),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,sr),Ca.copy(e.boundingSphere).applyMatrix4(sr),this.boundingSphere.union(Ca)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Aa.geometry=this.geometry,Aa.material=this.material,Aa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ca.copy(this.boundingSphere),Ca.applyMatrix4(n),e.ray.intersectsSphere(Ca)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,sr),cf.multiplyMatrices(n,sr),Aa.matrixWorld=cf,Aa.raycast(e,mc);for(let a=0,o=mc.length;a<o;a++){let l=mc[a];l.instanceId=r,l.object=this,t.push(l)}mc.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new $n(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new rn(new Float32Array(i*this.count),i,this.count,tl,$t));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ts=new Ut,kg=new ee(.5,.5),gc=new R,jn=class{constructor(e=new Mn,t=new Mn,n=new Mn,i=new Mn,r=new Mn,a=new Mn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=hn,n=!1){let i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],d=r[5],h=r[6],f=r[7],p=r[8],_=r[9],g=r[10],m=r[11],y=r[12],M=r[13],x=r[14],E=r[15];if(i[0].setComponents(c-a,f-u,m-p,E-y).normalize(),i[1].setComponents(c+a,f+u,m+p,E+y).normalize(),i[2].setComponents(c+o,f+d,m+_,E+M).normalize(),i[3].setComponents(c-o,f-d,m-_,E-M).normalize(),n)i[4].setComponents(l,h,g,x).normalize(),i[5].setComponents(c-l,f-h,m-g,E-x).normalize();else if(i[4].setComponents(c-l,f-h,m-g,E-x).normalize(),t===hn)i[5].setComponents(c+l,f+h,m+g,E+x).normalize();else if(t===Fi)i[5].setComponents(l,h,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){ts.center.set(0,0,0);let t=kg.distanceTo(e.center);return ts.radius=.7071067811865476+t,ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(gc.x=i.normal.x>0?e.max.x:e.min.x,gc.y=i.normal.y>0?e.max.y:e.min.y,gc.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(gc)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},hf=new Ge,eo=class s{constructor(){this.coordinateSystem=hn,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){let r=t[i];hf.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[i]===void 0&&(n[i]=new jn),n[i].setFromProjectionMatrix(hf,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++)t[i]===void 0&&(t[i]=new jn),t[i].copy(n[i]);return this._count=e._count,this}clone(){return new s().copy(this)}};ih=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){let r=this.pool,a=this.list;this.index>=r.length&&r.push({start:-1,count:-1,z:-1,index:-1});let o=r[this.index];a.push(o),this.index++,o.start=e,o.count=t,o.z=n,o.index=i}reset(){this.list.length=0,this.index=0}},cn=new Ge,Gg=new le(1,1,1),Wg=new jn,Xg=new eo,_c=new Ft,ns=new Ut,Ra=new R,df=new R,qg=new R,Wu=new ih,Jt=new mt,xc=[];to=class extends mt{constructor(e,t,n=t*2,i){super(new We,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4),n=new rn(t,e,e,jt,$t);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Uint32Array(e*e),n=new rn(t,e,e,aa,vn);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Float32Array(e*e*4).fill(1),n=new rn(t,e,e,jt,$t);n.colorSpace=et.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){let t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(let r in e.attributes){let a=e.getAttribute(r),{array:o,itemSize:l,normalized:c}=a,u=new o.constructor(n*l),d=new rt(u,l,c);t.setAttribute(r,d)}if(e.getIndex()!==null){let r=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new rt(r,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let i=e.getAttribute(n),r=t.getAttribute(n);if(i.itemSize!==r.itemSize||i.normalized!==r.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ft);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let r=t[n].geometryIndex;this.getMatrixAt(n,cn),this.getBoundingBoxAt(r,_c).applyMatrix4(cn),e.union(_c)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ut);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let r=t[n].geometryIndex;this.getMatrixAt(n,cn),this.getBoundingSphereAt(r,ns).applyMatrix4(cn),e.union(ns)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let n={visible:!0,active:!0,geometryIndex:e},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Gu),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));let r=this._matricesTexture;cn.identity().toArray(r.image.data,i*16),r.needsUpdate=!0;let a=this._colorsTexture;return a&&(Gg.toArray(a.image.data,i*4),a.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);let i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},r=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;let a=e.getIndex();if(a!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?a.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Gu),l=this._availableGeometryIds.shift(),r[l]=i):(l=this._geometryCount,this._geometryCount++,r.push(i)),this.setGeometryAt(l,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,l}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);let n=this.geometry,i=n.getIndex()!==null,r=n.getIndex(),a=t.getIndex(),o=this._geometryInfo[e];if(i&&a.count>o.reservedIndexCount||t.attributes.position.count>o.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let l=o.vertexStart,c=o.reservedVertexCount;o.vertexCount=t.getAttribute("position").count;for(let u in n.attributes){let d=t.getAttribute(u),h=n.getAttribute(u);Yg(d,h,l);let f=d.itemSize;for(let p=d.count,_=c;p<_;p++){let g=l+p;for(let m=0;m<f;m++)h.setComponent(g,m,0)}h.needsUpdate=!0,h.addUpdateRange(l*f,c*f)}if(i){let u=o.indexStart,d=o.reservedIndexCount;o.indexCount=t.getIndex().count;for(let h=0;h<a.count;h++)r.setX(u+h,l+a.getX(h));for(let h=a.count,f=d;h<f;h++)r.setX(u+h,l);r.needsUpdate=!0,r.addUpdateRange(u,o.reservedIndexCount)}return o.start=i?o.indexStart:o.vertexStart,o.count=i?o.indexCount:o.vertexCount,o.boundingBox=null,t.boundingBox!==null&&(o.boundingBox=t.boundingBox.clone()),o.boundingSphere=null,t.boundingSphere!==null&&(o.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let n=this._instanceInfo;for(let i=0,r=n.length;i<r;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,n=this._geometryInfo,i=n.map((a,o)=>o).sort((a,o)=>n[a].vertexStart-n[o].vertexStart),r=this.geometry;for(let a=0,o=n.length;a<o;a++){let l=i[a],c=n[l];if(c.active!==!1){if(r.index!==null){if(c.indexStart!==t){let{indexStart:u,vertexStart:d,reservedIndexCount:h}=c,f=r.index,p=f.array,_=e-d;for(let g=u;g<u+h;g++)p[g]=p[g]+_;f.array.copyWithin(t,u,u+h),f.addUpdateRange(t,h),f.needsUpdate=!0,c.indexStart=t}t+=c.reservedIndexCount}if(c.vertexStart!==e){let{vertexStart:u,reservedVertexCount:d}=c,h=r.attributes;for(let f in h){let p=h[f],{array:_,itemSize:g}=p;_.copyWithin(e*g,u*g,(u+d)*g),p.addUpdateRange(e*g,d*g),p.needsUpdate=!0}c.vertexStart=e}e+=c.reservedVertexCount,c.start=r.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=t,this._nextVertexStart=e,this._visibilityChanged=!0,this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){let r=new Ft,a=n.index,o=n.attributes.position;for(let l=i.start,c=i.start+i.count;l<c;l++){let u=l;a&&(u=a.getX(u)),r.expandByPoint(Ra.fromBufferAttribute(o,u))}i.boundingBox=r}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){let r=new Ut;this.getBoundingBoxAt(e,_c),_c.getCenter(r.center);let a=n.index,o=n.attributes.position,l=0;for(let c=i.start,u=i.start+i.count;c<u;c++){let d=c;a&&(d=a.getX(d)),Ra.fromBufferAttribute(o,d),l=Math.max(l,r.center.distanceToSquared(Ra))}r.radius=Math.sqrt(l),i.boundingSphere=r}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null?t.isVector4?t.set(1,1,1,1):t.setRGB(1,1,1):t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this._visibilityChanged=!0,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){let t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(Gu);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let i=new Int32Array(e),r=new Int32Array(e);is(this._multiDrawCounts,i),is(this._multiDrawStarts,r),this._multiDrawCounts=i,this._multiDrawStarts=r,this._maxInstanceCount=e;let a=this._indirectTexture,o=this._matricesTexture,l=this._colorsTexture;a.dispose(),this._initIndirectTexture(),is(a.image.data,this._indirectTexture.image.data),o.dispose(),this._initMatricesTexture(),is(o.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),is(l.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){let n=[...this._geometryInfo].filter(o=>o.active);if(Math.max(...n.map(o=>o.vertexStart+o.reservedVertexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let r=this.geometry;r.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new We,this._initializeGeometry(r));let a=this.geometry;r.index&&is(r.index.array,a.index.array);for(let o in r.attributes)is(r.attributes[o].array,a.attributes[o].array)}raycast(e,t){let n=this._instanceInfo,i=this._geometryInfo,r=this.matrixWorld,a=this.geometry;Jt.material=this.material,Jt.geometry.index=a.index,Jt.geometry.attributes=a.attributes,Jt.geometry.boundingBox===null&&(Jt.geometry.boundingBox=new Ft),Jt.geometry.boundingSphere===null&&(Jt.geometry.boundingSphere=new Ut);for(let o=0,l=n.length;o<l;o++){if(!n[o].visible||!n[o].active)continue;let c=n[o].geometryIndex,u=i[c];Jt.geometry.setDrawRange(u.start,u.count),this.getMatrixAt(o,Jt.matrixWorld).premultiply(r),this.getBoundingBoxAt(c,Jt.geometry.boundingBox),this.getBoundingSphereAt(c,Jt.geometry.boundingSphere),Jt.raycast(e,xc);for(let d=0,h=xc.length;d<h;d++){let f=xc[d];f.object=this,f.batchId=o,t.push(f)}xc.length=0}Jt.material=null,Jt.geometry.index=null,Jt.geometry.attributes={},Jt.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._multiDrawBytesPerElement=e._multiDrawBytesPerElement,this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,r){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let a=i.getIndex(),o=a===null?1:a.array.BYTES_PER_ELEMENT,l=1;r.wireframe&&(l=2,o=i.attributes.position.count>65535?4:2);let c=this._instanceInfo,u=this._multiDrawStarts,d=this._multiDrawCounts,h=this._geometryInfo,f=this.perObjectFrustumCulled,p=this._indirectTexture,_=p.image.data,g=n.isArrayCamera?Xg:Wg;f&&(n.isArrayCamera?g.setFromArrayCamera(n):(cn.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),g.setFromProjectionMatrix(cn,n.coordinateSystem,n.reversedDepth)));let m=0;if(this.sortObjects){cn.copy(this.matrixWorld).invert(),Ra.setFromMatrixPosition(n.matrixWorld).applyMatrix4(cn),df.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(cn);for(let x=0,E=c.length;x<E;x++)if(c[x].visible&&c[x].active){let T=c[x].geometryIndex;this.getMatrixAt(x,cn),this.getBoundingSphereAt(T,ns).applyMatrix4(cn);let A=!1;if(f&&(A=!g.intersectsSphere(ns)),!A){let v=h[T],w=qg.subVectors(ns.center,Ra).dot(df);Wu.push(v.start,v.count,w,x)}}let y=Wu.list,M=this.customSort;M===null?y.sort(r.transparent?Hg:Vg):M.call(this,y,n);for(let x=0,E=y.length;x<E;x++){let T=y[x];u[m]=T.start*o*l,d[m]=T.count*l,_[m]=T.index,m++}Wu.reset()}else for(let y=0,M=c.length;y<M;y++)if(c[y].visible&&c[y].active){let x=c[y].geometryIndex,E=!1;if(f&&(this.getMatrixAt(y,cn),this.getBoundingSphereAt(x,ns).applyMatrix4(cn),E=!g.intersectsSphere(ns)),!E){let T=h[x];u[m]=T.start*o*l,d[m]=T.count*l,_[m]=y,m++}}p.needsUpdate=!0,this._multiDrawCount=m,this._multiDrawBytesPerElement=o,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,r,a){this.onBeforeRender(e,null,i,r,a)}},Ht=class extends Nt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new le(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Jc=new R,Kc=new R,ff=new Ge,Pa=new fi,vc=new Ut,Xu=new R,pf=new R,kn=class extends lt{constructor(e=new We,t=new Ht){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Jc.fromBufferAttribute(t,i-1),Kc.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Jc.distanceTo(Kc);e.setAttribute("lineDistance",new Me(n,1))}else de("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),vc.copy(n.boundingSphere),vc.applyMatrix4(i),vc.radius+=r,e.ray.intersectsSphere(vc)===!1)return;ff.copy(i).invert(),Pa.copy(e.ray).applyMatrix4(ff);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=f,g=p-1;_<g;_+=c){let m=u.getX(_),y=u.getX(_+1),M=yc(this,e,Pa,l,m,y,_);M&&t.push(M)}if(this.isLineLoop){let _=u.getX(p-1),g=u.getX(f),m=yc(this,e,Pa,l,_,g,p-1);m&&t.push(m)}}else{let f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=f,g=p-1;_<g;_+=c){let m=yc(this,e,Pa,l,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){let _=yc(this,e,Pa,l,p-1,f,p-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};mf=new R,gf=new R,xn=class extends kn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)mf.fromBufferAttribute(t,i),gf.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+mf.distanceTo(gf);e.setAttribute("lineDistance",new Me(n,1))}else de("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},no=class extends kn{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Er=class extends Nt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new le(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},_f=new Ge,sh=new fi,Sc=new Ut,Mc=new R,vs=class extends lt{constructor(e=new We,t=new Er){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Sc.copy(n.boundingSphere),Sc.applyMatrix4(i),Sc.radius+=r,e.ray.intersectsSphere(Sc)===!1)return;_f.copy(i).invert(),sh.copy(e.ray).applyMatrix4(_f);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let h=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=h,_=f;p<_;p++){let g=c.getX(p);Mc.fromBufferAttribute(d,g),xf(Mc,g,l,i,e,t,this)}}else{let h=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=h,_=f;p<_;p++)Mc.fromBufferAttribute(d,p),xf(Mc,p,l,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};io=class extends At{constructor(e,t,n,i,r=xt,a=xt,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;let u=this;function d(){u.needsUpdate=!0,u._requestVideoFrameCallbackId=e.requestVideoFrameCallback(d)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(d))}clone(){return new this.constructor(this.image).copy(this)}update(){let e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}},$c=class extends io{constructor(e,t,n,i,r,a,o,l){super({},e,t,n,i,r,a,o,l),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(e){this.image=e,this.needsUpdate=!0}},jc=class extends At{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=Tt,this.minFilter=Tt,this.generateMipmaps=!1,this.needsUpdate=!0}},ys=class extends At{constructor(e,t,n,i,r,a,o,l,c,u,d,h){super(null,a,o,l,c,u,i,r,d,h),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}},Qc=class extends ys{constructor(e,t,n,i,r,a){super(e,t,n,r,a),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=kt,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},e0=class extends ys{constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,Hn),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}},ki=class extends At{constructor(e=[],t=Hn,n,i,r,a,o,l,c,u){super(e,t,n,i,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ss=class extends At{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},t0=class extends At{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isHTMLTexture=!0,this.generateMipmaps=!1,this.needsUpdate=!0;let u=e?e.parentNode:null;u!==null&&"requestPaint"in u&&(u.onpaint=()=>{this.needsUpdate=!0},u.requestPaint())}dispose(){let e=this.image?this.image.parentNode:null;e!==null&&"onpaint"in e&&(e.onpaint=null),super.dispose()}},pi=class extends At{constructor(e,t,n=vn,i,r,a,o=Tt,l=Tt,c,u=zn,d=1){if(u!==zn&&u!==Si)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,i,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new bn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},so=class extends pi{constructor(e,t=vn,n=Hn,i,r,a=Tt,o=Tt,l,c=zn){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},wr=class extends At{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},mi=class s extends We{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};let o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],u=[],d=[],h=0,f=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,i,a,2),p("x","z","y",1,-1,e,n,-t,i,a,3),p("x","y","z",1,-1,e,t,n,i,r,4),p("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Me(c,3)),this.setAttribute("normal",new Me(u,3)),this.setAttribute("uv",new Me(d,2));function p(_,g,m,y,M,x,E,T,A,v,w){let P=x/A,I=E/v,F=x/2,z=E/2,L=T/2,B=A+1,Y=v+1,X=0,Z=0,G=new R;for(let J=0;J<Y;J++){let Q=J*I-z;for(let we=0;we<B;we++){let Ee=we*P-F;G[_]=Ee*y,G[g]=Q*M,G[m]=L,c.push(G.x,G.y,G.z),G[_]=0,G[g]=0,G[m]=T>0?1:-1,u.push(G.x,G.y,G.z),d.push(we/A),d.push(1-J/v),X+=1}}for(let J=0;J<v;J++)for(let Q=0;Q<A;Q++){let we=h+Q+B*J,Ee=h+Q+B*(J+1),tt=h+(Q+1)+B*(J+1),qe=h+(Q+1)+B*J;l.push(we,Ee,qe),l.push(Ee,tt,qe),Z+=6}o.addGroup(f,Z,w),f+=Z,h+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},ro=class s extends We{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));let a=[],o=[],l=[],c=[],u=t/2,d=Math.PI/2*e,h=t,f=2*d+h,p=n*2+r,_=i+1,g=new R,m=new R;for(let y=0;y<=p;y++){let M=0,x=0,E=0,T=0;if(y<=n){let w=y/n,P=w*Math.PI/2;x=-u-e*Math.cos(P),E=e*Math.sin(P),T=-e*Math.cos(P),M=w*d}else if(y<=n+r){let w=(y-n)/r;x=-u+w*t,E=e,T=0,M=d+w*h}else{let w=(y-n-r)/n,P=w*Math.PI/2;x=u+e*Math.sin(P),E=e*Math.cos(P),T=e*Math.sin(P),M=d+h+w*d}let A=Math.max(0,Math.min(1,M/f)),v=0;y===0?v=.5/i:y===p&&(v=-.5/i);for(let w=0;w<=i;w++){let P=w/i,I=P*Math.PI*2,F=Math.sin(I),z=Math.cos(I);m.x=-E*z,m.y=x,m.z=E*F,o.push(m.x,m.y,m.z),g.set(-E*z,T,E*F),g.normalize(),l.push(g.x,g.y,g.z),c.push(P+v,A)}if(y>0){let w=(y-1)*_;for(let P=0;P<i;P++){let I=w+P,F=w+P+1,z=y*_+P,L=y*_+P+1;a.push(I,F,z),a.push(F,L,z)}}}this.setIndex(a),this.setAttribute("position",new Me(o,3)),this.setAttribute("normal",new Me(l,3)),this.setAttribute("uv",new Me(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},ao=class s extends We{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let r=[],a=[],o=[],l=[],c=new R,u=new ee;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,h=3;d<=t;d++,h+=3){let f=n+d/t*i;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[h]/e+1)/2,u.y=(a[h+1]/e+1)/2,l.push(u.x,u.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new Me(a,3)),this.setAttribute("normal",new Me(o,3)),this.setAttribute("uv",new Me(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Ms=class s extends We{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let u=[],d=[],h=[],f=[],p=0,_=[],g=n/2,m=0;y(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new Me(d,3)),this.setAttribute("normal",new Me(h,3)),this.setAttribute("uv",new Me(f,2));function y(){let x=new R,E=new R,T=0,A=(t-e)/n;for(let v=0;v<=r;v++){let w=[],P=v/r,I=P*(t-e)+e;for(let F=0;F<=i;F++){let z=F/i,L=z*l+o,B=Math.sin(L),Y=Math.cos(L);E.x=I*B,E.y=-P*n+g,E.z=I*Y,d.push(E.x,E.y,E.z),x.set(B,A,Y).normalize(),h.push(x.x,x.y,x.z),f.push(z,1-P),w.push(p++)}_.push(w)}for(let v=0;v<i;v++)for(let w=0;w<r;w++){let P=_[w][v],I=_[w+1][v],F=_[w+1][v+1],z=_[w][v+1];(e>0||w!==0)&&(u.push(P,I,z),T+=3),(t>0||w!==r-1)&&(u.push(I,F,z),T+=3)}c.addGroup(m,T,0),m+=T}function M(x){let E=p,T=new ee,A=new R,v=0,w=x===!0?e:t,P=x===!0?1:-1;for(let F=1;F<=i;F++)d.push(0,g*P,0),h.push(0,P,0),f.push(.5,.5),p++;let I=p;for(let F=0;F<=i;F++){let L=F/i*l+o,B=Math.cos(L),Y=Math.sin(L);A.x=w*Y,A.y=g*P,A.z=w*B,d.push(A.x,A.y,A.z),h.push(0,P,0),T.x=B*.5+.5,T.y=Y*.5*P+.5,f.push(T.x,T.y),p++}for(let F=0;F<i;F++){let z=E+F,L=I+F;x===!0?u.push(L,L+1,z):u.push(L+1,L,z),v+=3}c.addGroup(m,v,x===!0?1:2),m+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},bs=class s extends Ms{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new s(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},gi=class s extends We{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};let r=[],a=[];o(i),c(n),u(),this.setAttribute("position",new Me(r,3)),this.setAttribute("normal",new Me(r.slice(),3)),this.setAttribute("uv",new Me(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let M=new R,x=new R,E=new R;for(let T=0;T<t.length;T+=3)f(t[T+0],M),f(t[T+1],x),f(t[T+2],E),l(M,x,E,y)}function l(y,M,x,E){let T=E+1,A=[];for(let v=0;v<=T;v++){A[v]=[];let w=y.clone().lerp(x,v/T),P=M.clone().lerp(x,v/T),I=T-v;for(let F=0;F<=I;F++)F===0&&v===T?A[v][F]=w:A[v][F]=w.clone().lerp(P,F/I)}for(let v=0;v<T;v++)for(let w=0;w<2*(T-v)-1;w++){let P=Math.floor(w/2);w%2===0?(h(A[v][P+1]),h(A[v+1][P]),h(A[v][P])):(h(A[v][P+1]),h(A[v+1][P+1]),h(A[v+1][P]))}}function c(y){let M=new R;for(let x=0;x<r.length;x+=3)M.x=r[x+0],M.y=r[x+1],M.z=r[x+2],M.normalize().multiplyScalar(y),r[x+0]=M.x,r[x+1]=M.y,r[x+2]=M.z}function u(){let y=new R;for(let M=0;M<r.length;M+=3){y.x=r[M+0],y.y=r[M+1],y.z=r[M+2];let x=g(y)/2/Math.PI+.5,E=m(y)/Math.PI+.5;a.push(x,1-E)}p(),d()}function d(){for(let y=0;y<a.length;y+=6){let M=a[y+0],x=a[y+2],E=a[y+4],T=Math.max(M,x,E),A=Math.min(M,x,E);T>.9&&A<.1&&(M<.2&&(a[y+0]+=1),x<.2&&(a[y+2]+=1),E<.2&&(a[y+4]+=1))}}function h(y){r.push(y.x,y.y,y.z)}function f(y,M){let x=y*3;M.x=e[x+0],M.y=e[x+1],M.z=e[x+2]}function p(){let y=new R,M=new R,x=new R,E=new R,T=new ee,A=new ee,v=new ee;for(let w=0,P=0;w<r.length;w+=9,P+=6){y.set(r[w+0],r[w+1],r[w+2]),M.set(r[w+3],r[w+4],r[w+5]),x.set(r[w+6],r[w+7],r[w+8]),T.set(a[P+0],a[P+1]),A.set(a[P+2],a[P+3]),v.set(a[P+4],a[P+5]),E.copy(y).add(M).add(x).divideScalar(3);let I=g(E);_(T,P+0,y,I),_(A,P+2,M,I),_(v,P+4,x,I)}}function _(y,M,x,E){E<0&&y.x===1&&(a[M]=y.x-1),x.x===0&&x.z===0&&(a[M]=E/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function m(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.vertices,e.indices,e.radius,e.detail)}},oo=class s extends gi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new s(e.radius,e.detail)}},bc=new R,Tc=new R,qu=new R,Ec=new On,lo=class extends We{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let i=Math.pow(10,4),r=Math.cos(us*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],u=["a","b","c"],d=new Array(3),h={},f=[];for(let p=0;p<l;p+=3){a?(c[0]=a.getX(p),c[1]=a.getX(p+1),c[2]=a.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);let{a:_,b:g,c:m}=Ec;if(_.fromBufferAttribute(o,c[0]),g.fromBufferAttribute(o,c[1]),m.fromBufferAttribute(o,c[2]),Ec.getNormal(qu),d[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,d[1]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,d[2]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let y=0;y<3;y++){let M=(y+1)%3,x=d[y],E=d[M],T=Ec[u[y]],A=Ec[u[M]],v=`${x}_${E}`,w=`${E}_${x}`;w in h&&h[w]?(qu.dot(h[w].normal)<=r&&(f.push(T.x,T.y,T.z),f.push(A.x,A.y,A.z)),h[w]=null):v in h||(h[v]={index0:c[y],index1:c[M],normal:qu.clone()})}}for(let p in h)if(h[p]){let{index0:_,index1:g}=h[p];bc.fromBufferAttribute(o,_),Tc.fromBufferAttribute(o,g),f.push(bc.x,bc.y,bc.z),f.push(Tc.x,Tc.y,Tc.z)}this.setAttribute("position",new Me(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},fn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){de("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),i=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);let u=n[i],h=n[i+1]-u,f=(a-u)/h;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);let a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new ee:new R);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new R,i=[],r=[],a=[],o=new R,l=new Ge;for(let f=0;f<=e;f++){let p=f/e;i[f]=this.getTangentAt(p,new R)}r[0]=new R,a[0]=new R;let c=Number.MAX_VALUE,u=Math.abs(i[0].x),d=Math.abs(i[0].y),h=Math.abs(i[0].z);u<=c&&(c=u,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();let p=Math.acos(He(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(He(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),a[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ts=class extends fn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ee){let n=t,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),h=l-this.aX,f=c-this.aY;l=h*u-f*d+this.aX,c=h*d+f*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},co=class extends Ts{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};vf=new R,yf=new R,Yu=new Qh,Zu=new Qh,Ju=new Qh,Ar=class extends fn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new R){let n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=i[(o-1)%r]:(yf.subVectors(i[0],i[1]).add(i[0]),c=yf);let d=i[o%r],h=i[(o+1)%r];if(this.closed||o+2<r?u=i[(o+2)%r]:(vf.subVectors(i[r-1],i[r-2]).add(i[r-1]),u=vf),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(d),f),_=Math.pow(d.distanceToSquared(h),f),g=Math.pow(h.distanceToSquared(u),f);_<1e-4&&(_=1),p<1e-4&&(p=_),g<1e-4&&(g=_),Yu.initNonuniformCatmullRom(c.x,d.x,h.x,u.x,p,_,g),Zu.initNonuniformCatmullRom(c.y,d.y,h.y,u.y,p,_,g),Ju.initNonuniformCatmullRom(c.z,d.z,h.z,u.z,p,_,g)}else this.curveType==="catmullrom"&&(Yu.initCatmullRom(c.x,d.x,h.x,u.x,this.tension),Zu.initCatmullRom(c.y,d.y,h.y,u.y,this.tension),Ju.initCatmullRom(c.z,d.z,h.z,u.z,this.tension));return n.set(Yu.calc(l),Zu.calc(l),Ju.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new R().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};Cr=class extends fn{constructor(e=new ee,t=new ee,n=new ee,i=new ee){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new ee){let n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Oa(e,i.x,r.x,a.x,o.x),Oa(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},uo=class extends fn{constructor(e=new R,t=new R,n=new R,i=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new R){let n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Oa(e,i.x,r.x,a.x,o.x),Oa(e,i.y,r.y,a.y,o.y),Oa(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Rr=class extends fn{constructor(e=new ee,t=new ee){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ee){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ee){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ho=class extends fn{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Pr=class extends fn{constructor(e=new ee,t=new ee,n=new ee){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ee){let n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Fa(e,i.x,r.x,a.x),Fa(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ir=class extends fn{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){let n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Fa(e,i.x,r.x,a.x),Fa(e,i.y,r.y,a.y),Fa(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Dr=class extends fn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ee){let n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],u=i[a>i.length-2?i.length-1:a+1],d=i[a>i.length-3?i.length-1:a+2];return n.set(Sf(o,l.x,c.x,u.x,d.x),Sf(o,l.y,c.y,u.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new ee().fromArray(i))}return this}},n0=Object.freeze({__proto__:null,ArcCurve:co,CatmullRomCurve3:Ar,CubicBezierCurve:Cr,CubicBezierCurve3:uo,EllipseCurve:Ts,LineCurve:Rr,LineCurve3:ho,QuadraticBezierCurve:Pr,QuadraticBezierCurve3:Ir,SplineCurve:Dr}),fo=class extends fn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new n0[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,r=this.curves;i<r.length;i++){let a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new n0[i.type]().fromJSON(i))}return this}},Vi=class extends fo{constructor(e){super(),this.type="Path",this.currentPoint=new ee,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Rr(this.currentPoint.clone(),new ee(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let r=new Pr(this.currentPoint.clone(),new ee(e,t),new ee(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){let o=new Cr(this.currentPoint.clone(),new ee(e,t),new ee(n,i),new ee(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Dr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,l){let c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,i,r,a,o,l),this}absellipse(e,t,n,i,r,a,o,l){let c=new Ts(e,t,n,i,r,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},_i=class extends Vi{constructor(e){super(e),this.uuid=gn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new Vi().fromJSON(i))}return this}};oh=class{static triangulate(e,t,n=2){return t_(e,t,n)}},Tn=class s{static area(e){let t=e.length,n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return s.area(e)<0}static triangulateShape(e,t){let n=[],i=[],r=[];bf(e),Tf(n,e);let a=e.length;t.forEach(bf);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Tf(n,t[l]);let o=oh.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};_o=class s extends We{constructor(e=new _i([new ee(.5,.5),new ee(-.5,.5),new ee(-.5,-.5),new ee(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new Me(i,3)),this.setAttribute("uv",new Me(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1,h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,m=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:x_,M,x=!1,E,T,A,v;if(m){M=m.getSpacedPoints(u),x=!0,h=!1;let $=m.isCatmullRomCurve3?m.closed:!1;E=m.computeFrenetFrames(u,$),T=new R,A=new R,v=new R}h||(g=0,f=0,p=0,_=0);let w=o.extractPoints(c),P=w.shape,I=w.holes;if(!Tn.isClockWise(P)){P=P.reverse();for(let $=0,se=I.length;$<se;$++){let ae=I[$];Tn.isClockWise(ae)&&(I[$]=ae.reverse())}}function z($){let ae=10000000000000001e-36,oe=$[0];for(let he=1;he<=$.length;he++){let ke=he%$.length,Be=$[ke],Xe=Be.x-oe.x,Ze=Be.y-oe.y,D=Xe*Xe+Ze*Ze,ht=Math.max(Math.abs(Be.x),Math.abs(Be.y),Math.abs(oe.x),Math.abs(oe.y)),nt=ae*ht*ht;if(D<=nt){$.splice(ke,1),he--;continue}oe=Be}}z(P),I.forEach(z);let L=I.length,B=P;for(let $=0;$<L;$++){let se=I[$];P=P.concat(se)}function Y($,se,ae){return se||De("ExtrudeGeometry: vec does not exist"),$.clone().addScaledVector(se,ae)}let X=P.length;function Z($,se,ae){let oe,he,ke,Be=$.x-se.x,Xe=$.y-se.y,Ze=ae.x-$.x,D=ae.y-$.y,ht=Be*Be+Xe*Xe,nt=Be*D-Xe*Ze;if(Math.abs(nt)>Number.EPSILON){let C=Math.sqrt(ht),S=Math.sqrt(Ze*Ze+D*D),O=se.x-Xe/C,H=se.y+Be/C,K=ae.x-D/S,ce=ae.y+Ze/S,ue=((K-O)*D-(ce-H)*Ze)/(Be*D-Xe*Ze);oe=O+Be*ue-$.x,he=H+Xe*ue-$.y;let j=oe*oe+he*he;if(j<=2)return new ee(oe,he);ke=Math.sqrt(j/2)}else{let C=!1;Be>Number.EPSILON?Ze>Number.EPSILON&&(C=!0):Be<-Number.EPSILON?Ze<-Number.EPSILON&&(C=!0):Math.sign(Xe)===Math.sign(D)&&(C=!0),C?(oe=-Xe,he=Be,ke=Math.sqrt(ht)):(oe=Be,he=Xe,ke=Math.sqrt(ht/2))}return new ee(oe/ke,he/ke)}let G=[];for(let $=0,se=B.length,ae=se-1,oe=$+1;$<se;$++,ae++,oe++)ae===se&&(ae=0),oe===se&&(oe=0),G[$]=Z(B[$],B[ae],B[oe]);let J=[],Q,we=G.concat();for(let $=0,se=L;$<se;$++){let ae=I[$];Q=[];for(let oe=0,he=ae.length,ke=he-1,Be=oe+1;oe<he;oe++,ke++,Be++)ke===he&&(ke=0),Be===he&&(Be=0),Q[oe]=Z(ae[oe],ae[ke],ae[Be]);J.push(Q),we=we.concat(Q)}let Ee;if(g===0)Ee=Tn.triangulateShape(B,I);else{let $=[],se=[];for(let ae=0;ae<g;ae++){let oe=ae/g,he=f*Math.cos(oe*Math.PI/2),ke=p*Math.sin(oe*Math.PI/2)+_;for(let Be=0,Xe=B.length;Be<Xe;Be++){let Ze=Y(B[Be],G[Be],ke);fe(Ze.x,Ze.y,-he),oe===0&&$.push(Ze)}for(let Be=0,Xe=L;Be<Xe;Be++){let Ze=I[Be];Q=J[Be];let D=[];for(let ht=0,nt=Ze.length;ht<nt;ht++){let C=Y(Ze[ht],Q[ht],ke);fe(C.x,C.y,-he),oe===0&&D.push(C)}oe===0&&se.push(D)}}Ee=Tn.triangulateShape($,se)}let tt=Ee.length,qe=p+_;for(let $=0;$<X;$++){let se=h?Y(P[$],we[$],qe):P[$];x?(A.copy(E.normals[0]).multiplyScalar(se.x),T.copy(E.binormals[0]).multiplyScalar(se.y),v.copy(M[0]).add(A).add(T),fe(v.x,v.y,v.z)):fe(se.x,se.y,0)}for(let $=1;$<=u;$++)for(let se=0;se<X;se++){let ae=h?Y(P[se],we[se],qe):P[se];x?(A.copy(E.normals[$]).multiplyScalar(ae.x),T.copy(E.binormals[$]).multiplyScalar(ae.y),v.copy(M[$]).add(A).add(T),fe(v.x,v.y,v.z)):fe(ae.x,ae.y,d/u*$)}for(let $=g-1;$>=0;$--){let se=$/g,ae=f*Math.cos(se*Math.PI/2),oe=p*Math.sin(se*Math.PI/2)+_;for(let he=0,ke=B.length;he<ke;he++){let Be=Y(B[he],G[he],oe);fe(Be.x,Be.y,d+ae)}for(let he=0,ke=I.length;he<ke;he++){let Be=I[he];Q=J[he];for(let Xe=0,Ze=Be.length;Xe<Ze;Xe++){let D=Y(Be[Xe],Q[Xe],oe);x?fe(D.x,D.y+M[u-1].y,M[u-1].x+ae):fe(D.x,D.y,d+ae)}}}Je(),q();function Je(){let $=i.length/3;if(h){let se=0,ae=X*se;for(let oe=0;oe<tt;oe++){let he=Ee[oe];Oe(he[2]+ae,he[1]+ae,he[0]+ae)}se=u+g*2,ae=X*se;for(let oe=0;oe<tt;oe++){let he=Ee[oe];Oe(he[0]+ae,he[1]+ae,he[2]+ae)}}else{for(let se=0;se<tt;se++){let ae=Ee[se];Oe(ae[2],ae[1],ae[0])}for(let se=0;se<tt;se++){let ae=Ee[se];Oe(ae[0]+X*u,ae[1]+X*u,ae[2]+X*u)}}n.addGroup($,i.length/3-$,0)}function q(){let $=i.length/3,se=0;te(B,se),se+=B.length;for(let ae=0,oe=I.length;ae<oe;ae++){let he=I[ae];te(he,se),se+=he.length}n.addGroup($,i.length/3-$,1)}function te($,se){let ae=$.length;for(;--ae>=0;){let oe=ae,he=ae-1;he<0&&(he=$.length-1);for(let ke=0,Be=u+g*2;ke<Be;ke++){let Xe=X*ke,Ze=X*(ke+1),D=se+oe+Xe,ht=se+he+Xe,nt=se+he+Ze,C=se+oe+Ze;be(D,ht,nt,C)}}}function fe($,se,ae){l.push($),l.push(se),l.push(ae)}function Oe($,se,ae){ze($),ze(se),ze(ae);let oe=i.length/3,he=y.generateTopUV(n,i,oe-3,oe-2,oe-1);st(he[0]),st(he[1]),st(he[2])}function be($,se,ae,oe){ze($),ze(se),ze(oe),ze(se),ze(ae),ze(oe);let he=i.length/3,ke=y.generateSideWallUV(n,i,he-6,he-3,he-2,he-1);st(ke[0]),st(ke[1]),st(ke[3]),st(ke[1]),st(ke[2]),st(ke[3])}function ze($){i.push(l[$*3+0]),i.push(l[$*3+1]),i.push(l[$*3+2])}function st($){r.push($.x),r.push($.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return v_(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new n0[i.type]().fromJSON(i)),new s(n,e.options)}},x_={generateTopUV:function(s,e,t,n,i){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],u=e[i*3+1];return[new ee(r,a),new ee(o,l),new ee(c,u)]},generateSideWallUV:function(s,e,t,n,i,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],d=e[n*3+2],h=e[i*3],f=e[i*3+1],p=e[i*3+2],_=e[r*3],g=e[r*3+1],m=e[r*3+2];return Math.abs(o-u)<Math.abs(a-c)?[new ee(a,1-l),new ee(c,1-d),new ee(h,1-p),new ee(_,1-m)]:[new ee(o,1-l),new ee(u,1-d),new ee(f,1-p),new ee(g,1-m)]}};Ur=class s extends gi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new s(e.radius,e.detail)}},xo=class s extends We{constructor(e=[new ee(0,-.5),new ee(.5,0),new ee(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=He(i,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],u=1/t,d=new R,h=new ee,f=new R,p=new R,_=new R,g=0,m=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:g=e[y+1].x-e[y].x,m=e[y+1].y-e[y].y,f.x=m*1,f.y=-g,f.z=m*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:g=e[y+1].x-e[y].x,m=e[y+1].y-e[y].y,f.x=m*1,f.y=-g,f.z=m*0,p.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(p)}for(let y=0;y<=t;y++){let M=n+y*u*i,x=Math.sin(M),E=Math.cos(M);for(let T=0;T<=e.length-1;T++){d.x=e[T].x*x,d.y=e[T].y,d.z=e[T].x*E,a.push(d.x,d.y,d.z),h.x=y/t,h.y=T/(e.length-1),o.push(h.x,h.y);let A=l[3*T+0]*x,v=l[3*T+1],w=l[3*T+0]*E;c.push(A,v,w)}}for(let y=0;y<t;y++)for(let M=0;M<e.length-1;M++){let x=M+y*e.length,E=x,T=x+e.length,A=x+e.length+1,v=x+1;r.push(E,T,v),r.push(A,v,T)}this.setIndex(r),this.setAttribute("position",new Me(a,3)),this.setAttribute("uv",new Me(o,2)),this.setAttribute("normal",new Me(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.points,e.segments,e.phiStart,e.phiLength)}},Nr=class s extends gi{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new s(e.radius,e.detail)}},Qn=class s extends We{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,d=e/o,h=t/l,f=[],p=[],_=[],g=[];for(let m=0;m<u;m++){let y=m*h-a;for(let M=0;M<c;M++){let x=M*d-r;p.push(x,-y,0),_.push(0,0,1),g.push(M/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let y=0;y<o;y++){let M=y+c*m,x=y+c*(m+1),E=y+1+c*(m+1),T=y+1+c*m;f.push(M,x,T),f.push(x,E,T)}this.setIndex(f),this.setAttribute("position",new Me(p,3)),this.setAttribute("normal",new Me(_,3)),this.setAttribute("uv",new Me(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.widthSegments,e.heightSegments)}},vo=class s extends We{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);let o=[],l=[],c=[],u=[],d=e,h=(t-e)/i,f=new R,p=new ee;for(let _=0;_<=i;_++){for(let g=0;g<=n;g++){let m=r+g/n*a;f.x=d*Math.cos(m),f.y=d*Math.sin(m),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,u.push(p.x,p.y)}d+=h}for(let _=0;_<i;_++){let g=_*(n+1);for(let m=0;m<n;m++){let y=m+g,M=y,x=y+n+1,E=y+n+2,T=y+1;o.push(M,x,T),o.push(x,E,T)}}this.setIndex(o),this.setAttribute("position",new Me(l,3)),this.setAttribute("normal",new Me(c,3)),this.setAttribute("uv",new Me(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Fr=class s extends We{constructor(e=new _i([new ee(0,.5),new ee(-.5,-.5),new ee(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],i=[],r=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Me(i,3)),this.setAttribute("normal",new Me(r,3)),this.setAttribute("uv",new Me(a,2));function c(u){let d=i.length/3,h=u.extractPoints(t),f=h.shape,p=h.holes;Tn.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,m=p.length;g<m;g++){let y=p[g];Tn.isClockWise(y)===!0&&(p[g]=y.reverse())}let _=Tn.triangulateShape(f,p);for(let g=0,m=p.length;g<m;g++){let y=p[g];f=f.concat(y)}for(let g=0,m=f.length;g<m;g++){let y=f[g];i.push(y.x,y.y,0),r.push(0,0,1),a.push(y.x,y.y)}for(let g=0,m=_.length;g<m;g++){let y=_[g],M=y[0]+d,x=y[1]+d,E=y[2]+d;n.push(M,x,E),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return y_(t,e)}static fromJSON(e,t){let n=[];for(let i=0,r=e.shapes.length;i<r;i++){let a=t[e.shapes[i]];n.push(a)}return new s(n,e.curveSegments)}};Hi=class s extends We{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,u=[],d=new R,h=new R,f=[],p=[],_=[],g=[];for(let m=0;m<=n;m++){let y=[],M=m/n,x=a+M*o,E=e*Math.cos(x),T=Math.sqrt(e*e-E*E),A=0;m===0&&a===0?A=.5/t:m===n&&l===Math.PI&&(A=-.5/t);for(let v=0;v<=t;v++){let w=v/t,P=i+w*r;d.x=-T*Math.cos(P),d.y=E,d.z=T*Math.sin(P),p.push(d.x,d.y,d.z),h.copy(d).normalize(),_.push(h.x,h.y,h.z),g.push(w+A,1-M),y.push(c++)}u.push(y)}for(let m=0;m<n;m++)for(let y=0;y<t;y++){let M=u[m][y+1],x=u[m][y],E=u[m+1][y],T=u[m+1][y+1];(m!==0||a>0)&&f.push(M,x,T),(m!==n-1||l<Math.PI)&&f.push(x,E,T)}this.setIndex(f),this.setAttribute("position",new Me(p,3)),this.setAttribute("normal",new Me(_,3)),this.setAttribute("uv",new Me(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},yo=class s extends gi{constructor(e=1,t=0){let n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new s(e.radius,e.detail)}},So=class s extends We{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);let l=[],c=[],u=[],d=[],h=new R,f=new R,p=new R;for(let _=0;_<=n;_++){let g=a+_/n*o;for(let m=0;m<=i;m++){let y=m/i*r;f.x=(e+t*Math.cos(g))*Math.cos(y),f.y=(e+t*Math.cos(g))*Math.sin(y),f.z=t*Math.sin(g),c.push(f.x,f.y,f.z),h.x=e*Math.cos(y),h.y=e*Math.sin(y),p.subVectors(f,h).normalize(),u.push(p.x,p.y,p.z),d.push(m/i),d.push(_/n)}}for(let _=1;_<=n;_++)for(let g=1;g<=i;g++){let m=(i+1)*_+g-1,y=(i+1)*(_-1)+g-1,M=(i+1)*(_-1)+g,x=(i+1)*_+g;l.push(m,y,x),l.push(y,M,x)}this.setIndex(l),this.setAttribute("position",new Me(c,3)),this.setAttribute("normal",new Me(u,3)),this.setAttribute("uv",new Me(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}},Mo=class s extends We{constructor(e=1,t=.4,n=64,i=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:r,q:a},n=Math.floor(n),i=Math.floor(i);let o=[],l=[],c=[],u=[],d=new R,h=new R,f=new R,p=new R,_=new R,g=new R,m=new R;for(let M=0;M<=n;++M){let x=M/n*r*Math.PI*2;y(x,r,a,e,f),y(x+.01,r,a,e,p),g.subVectors(p,f),m.addVectors(p,f),_.crossVectors(g,m),m.crossVectors(_,g),_.normalize(),m.normalize();for(let E=0;E<=i;++E){let T=E/i*Math.PI*2,A=-t*Math.cos(T),v=t*Math.sin(T);d.x=f.x+(A*m.x+v*_.x),d.y=f.y+(A*m.y+v*_.y),d.z=f.z+(A*m.z+v*_.z),l.push(d.x,d.y,d.z),h.subVectors(d,f).normalize(),c.push(h.x,h.y,h.z),u.push(M/n),u.push(E/i)}}for(let M=1;M<=n;M++)for(let x=1;x<=i;x++){let E=(i+1)*(M-1)+(x-1),T=(i+1)*M+(x-1),A=(i+1)*M+x,v=(i+1)*(M-1)+x;o.push(E,T,v),o.push(T,A,v)}this.setIndex(o),this.setAttribute("position",new Me(l,3)),this.setAttribute("normal",new Me(c,3)),this.setAttribute("uv",new Me(u,2));function y(M,x,E,T,A){let v=Math.cos(M),w=Math.sin(M),P=E/x*M,I=Math.cos(P);A.x=T*(2+I)*.5*v,A.y=T*(2+I)*w*.5,A.z=T*Math.sin(P)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},Or=class s extends We{constructor(e=new Ir(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),t=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:r};let a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new R,l=new R,c=new ee,u=new R,d=[],h=[],f=[],p=[];_(),this.setIndex(p),this.setAttribute("position",new Me(d,3)),this.setAttribute("normal",new Me(h,3)),this.setAttribute("uv",new Me(f,2));function _(){for(let M=0;M<t;M++)g(M);g(r===!1?t:0),y(),m()}function g(M){u=e.getPointAt(M/t,u);let x=a.normals[M],E=a.binormals[M];for(let T=0;T<=i;T++){let A=T/i*Math.PI*2,v=Math.sin(A),w=-Math.cos(A);l.x=w*x.x+v*E.x,l.y=w*x.y+v*E.y,l.z=w*x.z+v*E.z,l.normalize(),h.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,d.push(o.x,o.y,o.z)}}function m(){for(let M=1;M<=t;M++)for(let x=1;x<=i;x++){let E=(i+1)*(M-1)+(x-1),T=(i+1)*M+(x-1),A=(i+1)*M+x,v=(i+1)*(M-1)+x;p.push(E,T,v),p.push(T,A,v)}}function y(){for(let M=0;M<=t;M++)for(let x=0;x<=i;x++)c.x=M/t,c.y=x/i,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new s(new n0[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},bo=class extends We{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,i=new R,r=new R;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){let d=l[c],h=d.start,f=d.count;for(let p=h,_=h+f;p<_;p+=3)for(let g=0;g<3;g++){let m=o.getX(p+g),y=o.getX(p+(g+1)%3);i.fromBufferAttribute(a,m),r.fromBufferAttribute(a,y),Ef(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let u=3*o+c,d=3*o+(c+1)%3;i.fromBufferAttribute(a,u),r.fromBufferAttribute(a,d),Ef(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new Me(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};wf=Object.freeze({__proto__:null,BoxGeometry:mi,CapsuleGeometry:ro,CircleGeometry:ao,ConeGeometry:bs,CylinderGeometry:Ms,DodecahedronGeometry:oo,EdgesGeometry:lo,ExtrudeGeometry:_o,IcosahedronGeometry:Ur,LatheGeometry:xo,OctahedronGeometry:Nr,PlaneGeometry:Qn,PolyhedronGeometry:gi,RingGeometry:vo,ShapeGeometry:Fr,SphereGeometry:Hi,TetrahedronGeometry:yo,TorusGeometry:So,TorusKnotGeometry:Mo,TubeGeometry:Or,WireframeGeometry:bo}),To=class extends Nt{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new le(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};en={clone:Os,merge:Qt},M_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,b_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ct=class extends Nt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=M_,this.fragmentShader=b_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=S_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new le().setHex(i.value);break;case"v2":this.uniforms[n].value=new ee().fromArray(i.value);break;case"v3":this.uniforms[n].value=new R().fromArray(i.value);break;case"v4":this.uniforms[n].value=new ut().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Ye().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Ge().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Gi=class extends ct{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ws=class extends Nt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new le(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ii,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Br=class extends ws{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ee(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return He(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new le(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new le(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new le(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},Eo=class extends Nt{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new le(16777215),this.specular=new le(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ii,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Kr,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},wo=class extends Nt{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new le(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ii,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ao=class extends Nt{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ii,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},Co=class extends Nt{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ii,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Kr,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Wi=class extends Nt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},zr=class extends Nt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},Ro=class extends Nt{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new le(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ii,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this.fog=e.fog,this}},Po=class extends Ht{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};i0=class{static convertArray(e,t){return Fn(e,t)}static isTypedArray(e){return Hp(e)}static hasTangents(e){return Ba(e)}static getKeyframeOrder(e){return em(e)}static sortedArray(e,t,n){return lh(e,t,n)}static flattenJSON(e,t,n,i){tm(e,t,n,i)}static subclip(e,t,n,i,r=30){return T_(e,t,n,i,r)}static makeClipAdditive(e,t=0,n=e,i=30){return E_(e,t,n,i)}},xi=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Io=class extends xi{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ui,endingEnd:Ui}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ni:r=e,o=2*t-n;break;case pr:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ni:a=e,l=2*n-t;break;case pr:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),_=p*p,g=_*p,m=-h*g+2*h*_-h*p,y=(1+h)*g+(-1.5-2*h)*_+(-.5+h)*p+1,M=(-1-f)*g+(1.5+f)*_+.5*p,x=f*g-f*_;for(let E=0;E!==o;++E)r[E]=m*a[u+E]+y*a[c+E]+M*a[l+E]+x*a[d+E];return r}},kr=class extends xi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(i-t),d=1-u;for(let h=0;h!==o;++h)r[h]=a[c+h]*d+a[l+h]*u;return r}},Do=class extends xi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Lo=class extends xi{interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.inTangents,d=this.outTangents;if(!u||!d){let p=(n-t)/(i-t),_=1-p;for(let g=0;g!==o;++g)r[g]=a[c+g]*_+a[l+g]*p;return r}let h=o*2,f=e-1;for(let p=0;p!==o;++p){let _=a[c+p],g=a[l+p],m=f*h+p*2,y=d[m],M=d[m+1],x=e*h+p*2,E=u[x],T=u[x+1],A=A_(n,t,y,E,i);r[p]=nm(A,_,M,T,g)}return r}};an=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Fn(t,this.TimeBufferType),this.values=Fn(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Fn(e.times,Array),values:Fn(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Ba(e.settings)&&(n.settings={inTangents:Fn(e.settings.inTangents,Array),outTangents:Fn(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Do(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new kr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Io(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Lo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case fr:t=this.InterpolantFactoryMethodDiscrete;break;case qa:t=this.InterpolantFactoryMethodLinear;break;case La:t=this.InterpolantFactoryMethodSmooth;break;case Bc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return de("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return fr;case this.InterpolantFactoryMethodLinear:return qa;case this.InterpolantFactoryMethodSmooth:return La;case this.InterpolantFactoryMethodBezier:return Bc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Ba(this.settings)&&(Cf(this.settings.inTangents,e),Cf(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(De("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(De("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){De("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){De("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Hp(i))for(let o=0,l=i.length;o!==l;++o){let c=i[o];if(isNaN(c)){De("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===La,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(i)l=!0;else{let d=o*n,h=d-n,f=d+n;for(let p=0;p!==n;++p){let _=t[d+p];if(_!==t[h+p]||_!==t[f+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,h=a*n;for(let f=0;f!==n;++f)t[h+f]=t[d+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Ba(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};an.prototype.ValueTypeName="";an.prototype.TimeBufferType=Float32Array;an.prototype.ValueBufferType=Float32Array;an.prototype.DefaultInterpolation=qa;ei=class extends an{constructor(e,t,n){super(e,t,n)}};ei.prototype.ValueTypeName="bool";ei.prototype.ValueBufferType=Array;ei.prototype.DefaultInterpolation=fr;ei.prototype.InterpolantFactoryMethodLinear=void 0;ei.prototype.InterpolantFactoryMethodSmooth=void 0;Vr=class extends an{constructor(e,t,n,i){super(e,t,n,i)}};Vr.prototype.ValueTypeName="color";As=class extends an{constructor(e,t,n,i){super(e,t,n,i)}};As.prototype.ValueTypeName="number";Uo=class extends xi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t),c=e*o;for(let u=c+o;c!==u;c+=4)Vt.slerpFlat(r,0,a,c-o,a,c,l);return r}},Cs=class extends an{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Uo(this.times,this.values,this.getValueSize(),e)}};Cs.prototype.ValueTypeName="quaternion";Cs.prototype.InterpolantFactoryMethodSmooth=void 0;ti=class extends an{constructor(e,t,n){super(e,t,n)}};ti.prototype.ValueTypeName="string";ti.prototype.ValueBufferType=Array;ti.prototype.DefaultInterpolation=fr;ti.prototype.InterpolantFactoryMethodLinear=void 0;ti.prototype.InterpolantFactoryMethodSmooth=void 0;Hr=class extends an{constructor(e,t,n,i){super(e,t,n,i)}};Hr.prototype.ValueTypeName="vector";Xi=class{constructor(e="",t=-1,n=[],i=Ul){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=gn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(R_(n[a]).scale(i));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(an.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let u=em(l);l=lh(l,1,u),c=lh(c,1,u),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new As(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],u=c.name.match(r);if(u&&u.length>1){let d=u[1],h=i[d];h||(i[d]=h=[]),h.push(c)}}let a=[];for(let o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};Bn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Rf(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Rf(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};Gr=class{constructor(e,t,n){let i=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&i.onStart!==void 0&&i.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,i.onProgress!==void 0&&i.onProgress(u,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let f=c[d],p=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},td=new Gr,Wt=class{constructor(e){this.manager=e!==void 0?e:td,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Wt.DEFAULT_MATERIAL_NAME="__DEFAULT";ui={},ch=class extends Error{constructor(e,t){super(e),this.response=t}},wn=class extends Wt{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Bn.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(ui[e]!==void 0){ui[e].push({onLoad:t,onProgress:n,onError:i});return}ui[e]=[],ui[e].push({onLoad:t,onProgress:n,onError:i});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&de("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=ui[e],d=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=h?parseInt(h):0,p=f!==0,_=0,g=new ReadableStream({start(m){y();function y(){d.read().then(({done:M,value:x})=>{if(M)m.close();else{_+=x.byteLength;let E=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:f});for(let T=0,A=u.length;T<A;T++){let v=u[T];v.onProgress&&v.onProgress(E)}m.enqueue(x),y()}},M=>{m.error(M)})}}});return new Response(g)}else throw new ch(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(o),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{Bn.add(`file:${e}`,c);let u=ui[e];delete ui[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=ui[e];if(u===void 0)throw this.manager.itemError(e),c;delete ui[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},s0=class extends Wt{constructor(e){super(e)}load(e,t,n,i){let r=this,a=new wn(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(o){try{t(r.parse(JSON.parse(o)))}catch(l){i?i(l):De(l),r.manager.itemError(e)}},n,i)}parse(e){let t=[];for(let n=0;n<e.length;n++){let i=Xi.parse(e[n]);t.push(i)}return t}},r0=class extends Wt{constructor(e){super(e)}load(e,t,n,i){let r=this,a=[],o=new ys,l=new wn(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(r.withCredentials);let c=0;function u(d){l.load(e[d],function(h){let f=r.parse(h,!0);a[d]={width:f.width,height:f.height,format:f.format,mipmaps:f.mipmaps},c+=1,c===6&&(f.mipmapCount===1&&(o.minFilter=xt),o.image=a,o.format=f.format,o.needsUpdate=!0,t&&t(o))},n,i)}if(Array.isArray(e))for(let d=0,h=e.length;d<h;++d)u(d);else l.load(e,function(d){let h=r.parse(d,!0);if(h.isCubemap){let f=h.mipmaps.length/h.mipmapCount;for(let p=0;p<f;p++){a[p]={mipmaps:[]};for(let _=0;_<h.mipmapCount;_++)a[p].mipmaps.push(h.mipmaps[p*h.mipmapCount+_]),a[p].format=h.format,a[p].width=h.width,a[p].height=h.height}o.image=a}else o.image.width=h.width,o.image.height=h.height,o.mipmaps=h.mipmaps;h.mipmapCount===1&&(o.minFilter=xt),o.format=h.format,o.needsUpdate=!0,t&&t(o)},n,i);return o}},rr=new WeakMap,qi=class extends Wt{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Bn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let d=rr.get(a);d===void 0&&(d=[],rr.set(a,d)),d.push({onLoad:t,onError:i})}return a}let o=_r("img");function l(){u(),t&&t(this);let d=rr.get(this)||[];for(let h=0;h<d.length;h++){let f=d[h];f.onLoad&&f.onLoad(this)}rr.delete(this),r.manager.itemEnd(e)}function c(d){u(),i&&i(d),Bn.remove(`image:${e}`);let h=rr.get(this)||[];for(let f=0;f<h.length;f++){let p=h[f];p.onError&&p.onError(d)}rr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Bn.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}},a0=class extends Wt{constructor(e){super(e)}load(e,t,n,i){let r=new ki;r.colorSpace=Kt;let a=new qi(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function l(c){a.load(e[c],function(u){r.images[c]=u,o++,o===6&&(r.needsUpdate=!0,t&&t(r))},void 0,i)}for(let c=0;c<e.length;++c)l(c);return r}},o0=class extends Wt{constructor(e){super(e)}load(e,t,n,i){let r=this,a=new rn,o=new wn(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(u){i!==void 0?i(u):De(u);return}r._applyTexData(a,c),t&&t(a,c)},n,i),a}createDataTexture(e){let t=new rn;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:kt,e.wrapT=t.wrapT!==void 0?t.wrapT:kt,e.magFilter=t.magFilter!==void 0?t.magFilter:xt,e.minFilter=t.minFilter!==void 0?t.minFilter:xt,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=Gn),t.mipmapCount===1&&(e.minFilter=xt),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}},l0=class extends Wt{constructor(e){super(e)}load(e,t,n,i){let r=new At,a=new qi(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}},Vn=class extends lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new le(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},No=class extends Vn{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new le(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Ku=new Ge,Pf=new R,If=new R,Rs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ee(512,512),this.mapType=ln,this.map=null,this.mapPass=null,this.matrix=new Ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new jn,this._frameExtents=new ee(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Pf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Pf),If.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(If),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){Ku.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ku,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;e.coordinateSystem===Fi||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ku)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Cc=new R,Rc=new Vt,Zn=new R,Ps=class extends lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ge,this.projectionMatrix=new Ge,this.projectionMatrixInverse=new Ge,this.coordinateSystem=hn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Cc,Rc,Zn),Zn.x===1&&Zn.y===1&&Zn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cc,Rc,Zn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Cc,Rc,Zn),Zn.x===1&&Zn.y===1&&Zn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cc,Rc,Zn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Di=new R,Df=new ee,Lf=new ee,It=class extends Ps{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=fs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(us*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fs*2*Math.atan(Math.tan(us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Di.x,Di.y).multiplyScalar(-e/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Di.x,Di.y).multiplyScalar(-e/Di.z)}getViewSize(e,t){return this.getViewBounds(e,Df,Lf),t.subVectors(Lf,Df)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(us*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},uh=class extends Rs{constructor(){super(new It(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=fs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Wr=class extends Vn{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.target=new lt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new uh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},hh=class extends Rs{constructor(){super(new It(90,1,.5,500)),this.isPointLightShadow=!0}},Fo=class extends Vn{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new hh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},An=class extends Ps{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},dh=class extends Rs{constructor(){super(new An(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Xr=class extends Vn{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.target=new lt,this.shadow=new dh}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Oo=class extends Vn{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}},Bo=class extends Vn{constructor(e,t,n=10,i=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){let t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}},qr=class{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new R)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){let n=e.x,i=e.y,r=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.282095),t.addScaledVector(a[1],.488603*i),t.addScaledVector(a[2],.488603*r),t.addScaledVector(a[3],.488603*n),t.addScaledVector(a[4],1.092548*(n*i)),t.addScaledVector(a[5],1.092548*(i*r)),t.addScaledVector(a[6],.315392*(3*r*r-1)),t.addScaledVector(a[7],1.092548*(n*r)),t.addScaledVector(a[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){let n=e.x,i=e.y,r=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.886227),t.addScaledVector(a[1],2*.511664*i),t.addScaledVector(a[2],2*.511664*r),t.addScaledVector(a[3],2*.511664*n),t.addScaledVector(a[4],2*.429043*n*i),t.addScaledVector(a[5],2*.429043*i*r),t.addScaledVector(a[6],.743125*r*r-.247708),t.addScaledVector(a[7],2*.429043*n*r),t.addScaledVector(a[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){let n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){let n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){let n=e.x,i=e.y,r=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*r,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*r,t[6]=.315392*(3*r*r-1),t[7]=1.092548*n*r,t[8]=.546274*(n*n-i*i)}},zo=class extends Vn{constructor(e=new qr,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}toJSON(e){let t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}},Uf={},ko=class s extends Wt{constructor(e){super(e),this.textures={}}load(e,t,n,i){let r=this,a=new wn(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(e,function(o){try{t(r.parse(JSON.parse(o)))}catch(l){i?i(l):De(l),r.manager.itemError(e)}},n,i)}parse(e){let t=this.createMaterialFromType(e.type);return t.fromJSON(e,this.textures),t}setTextures(e){return this.textures=e,this}createMaterialFromType(e){return s.createMaterialFromType(e)}static createMaterialFromType(e){let n={ShadowMaterial:To,SpriteMaterial:Mr,RawShaderMaterial:Gi,ShaderMaterial:ct,PointsMaterial:Er,MeshPhysicalMaterial:Br,MeshStandardMaterial:ws,MeshPhongMaterial:Eo,MeshToonMaterial:wo,MeshNormalMaterial:Ao,MeshLambertMaterial:Co,MeshDepthMaterial:Wi,MeshDistanceMaterial:zr,MeshBasicMaterial:_n,MeshMatcapMaterial:Ro,LineDashedMaterial:Po,LineBasicMaterial:Ht,Material:Nt,...Uf}[e],i;return n===void 0?(Kn(`MaterialLoader: Unknown material type "${e}". Use .registerMaterial() before starting the deserialization process.`),i=new Nt):i=new n,i}static registerMaterial(e,t){Uf[e]=t}},Yr=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Vo=class extends We{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},Ho=class extends Wt{constructor(e){super(e)}load(e,t,n,i){let r=this,a=new wn(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(e,function(o){try{t(r.parse(JSON.parse(o)))}catch(l){i?i(l):De(l),r.manager.itemError(e)}},n,i)}parse(e){let t={},n={};function i(f,p){if(t[p]!==void 0)return t[p];let g=f.interleavedBuffers[p],m=r(f,g.buffer),y=ur(g.type,m),M=new xs(y,g.stride);return M.uuid=g.uuid,g.usage!==void 0&&M.setUsage(g.usage),t[p]=M,M}function r(f,p){if(n[p]!==void 0)return n[p];let g=f.arrayBuffers[p],m=new Uint32Array(g).buffer;return n[p]=m,m}let a=e.isInstancedBufferGeometry?new Vo:new We,o=e.data.index;if(o!==void 0){let f=ur(o.type,o.array);a.setIndex(new rt(f,1))}let l=e.data.attributes;for(let f in l){let p=l[f],_;if(p.isInterleavedBufferAttribute){let g=i(e.data,p.data);_=new zi(g,p.itemSize,p.offset,p.normalized)}else{let g=ur(p.type,p.array),m=p.isInstancedBufferAttribute?$n:rt;_=new m(g,p.itemSize,p.normalized)}p.name!==void 0&&(_.name=p.name),p.usage!==void 0&&_.setUsage(p.usage),p.gpuType!==void 0&&(_.gpuType=p.gpuType),a.setAttribute(f,_)}let c=e.data.morphAttributes;if(c)for(let f in c){let p=c[f],_=[];for(let g=0,m=p.length;g<m;g++){let y=p[g],M;if(y.isInterleavedBufferAttribute){let x=i(e.data,y.data);M=new zi(x,y.itemSize,y.offset,y.normalized)}else{let x=ur(y.type,y.array);M=new rt(x,y.itemSize,y.normalized)}y.name!==void 0&&(M.name=y.name),y.usage!==void 0&&M.setUsage(y.usage),y.gpuType!==void 0&&(M.gpuType=y.gpuType),_.push(M)}a.morphAttributes[f]=_}e.data.morphTargetsRelative&&(a.morphTargetsRelative=!0);let d=e.data.groups||e.data.drawcalls||e.data.offsets;if(d!==void 0)for(let f=0,p=d.length;f!==p;++f){let _=d[f];a.addGroup(_.start,_.count,_.materialIndex)}let h=e.data.boundingSphere;return h!==void 0&&(a.boundingSphere=new Ut().fromJSON(h)),e.name&&(a.name=e.name),e.userData&&(a.userData=e.userData),a}},$u={},c0=class extends Wt{constructor(e){super(e)}load(e,t,n,i){let r=this,a=this.path===""?Yr.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||a;let o=new wn(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(l){let c=null;try{c=JSON.parse(l)}catch(d){i!==void 0&&i(d),De("ObjectLoader: Can't parse "+e+".",d.message);return}let u=c.metadata;if(u===void 0||u.type===void 0||u.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+e)),De("ObjectLoader: Can't load "+e);return}r.parse(c,t)},n,i)}async loadAsync(e,t){let n=this,i=this.path===""?Yr.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||i;let r=new wn(this.manager);r.setPath(this.path),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials);let a=await r.loadAsync(e,t),o;try{o=JSON.parse(a)}catch(c){throw new Error("THREE.ObjectLoader: Can't parse "+e+". "+c.message)}let l=o.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await n.parseAsync(o)}parse(e,t){let n=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),r=this.parseGeometries(e.geometries,i),a=this.parseImages(e.images,function(){t!==void 0&&t(c)}),o=this.parseTextures(e.textures,a),l=this.parseMaterials(e.materials,o),c=this.parseObject(e.object,r,l,o,n),u=this.parseSkeletons(e.skeletons,c);if(this.bindSkeletons(c,u),this.bindLightTargets(c),t!==void 0){let d=!1;for(let h in a)if(a[h].data instanceof HTMLImageElement){d=!0;break}d===!1&&t(c)}return c}async parseAsync(e){let t=this.parseAnimations(e.animations),n=this.parseShapes(e.shapes),i=this.parseGeometries(e.geometries,n),r=await this.parseImagesAsync(e.images),a=this.parseTextures(e.textures,r),o=this.parseMaterials(e.materials,a),l=this.parseObject(e.object,i,o,a,t),c=this.parseSkeletons(e.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}static registerGeometry(e,t){$u[e]=t}parseShapes(e){let t={};if(e!==void 0)for(let n=0,i=e.length;n<i;n++){let r=new _i().fromJSON(e[n]);t[r.uuid]=r}return t}parseSkeletons(e,t){let n={},i={};if(t.traverse(function(r){r.isBone&&(i[r.uuid]=r)}),e!==void 0)for(let r=0,a=e.length;r<a;r++){let o=new Qa().fromJSON(e[r],i);n[o.uuid]=o}return n}parseGeometries(e,t){let n={};if(e!==void 0){let i=new Ho;for(let r=0,a=e.length;r<a;r++){let o,l=e[r];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":o=i.parse(l);break;default:l.type in wf?o=wf[l.type].fromJSON(l,t):l.type in $u?o=$u[l.type].fromJSON(l,t):de(`ObjectLoader: Unknown geometry type "${l.type}". Use .registerGeometry() before starting the deserialization process.`)}o.uuid=l.uuid,l.name!==void 0&&(o.name=l.name),l.userData!==void 0&&(o.userData=l.userData),n[l.uuid]=o}}return n}parseMaterials(e,t){let n={},i={};if(e!==void 0){let r=new ko;r.setTextures(t);for(let a=0,o=e.length;a<o;a++){let l=e[a];n[l.uuid]===void 0&&(n[l.uuid]=r.parse(l)),i[l.uuid]=n[l.uuid]}}return i}parseAnimations(e){let t={};if(e!==void 0)for(let n=0;n<e.length;n++){let i=e[n],r=Xi.parse(i);t[r.uuid]=r}return t}parseImages(e,t){let n=this,i={},r;function a(l){return l=n.manager.resolveURL(l),n.manager.itemStart(l),r.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function o(l){if(typeof l=="string"){let c=l,u=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return a(u)}else return l.data?{data:ur(l.type,l.data),width:l.width,height:l.height}:null}if(e!==void 0&&e.length>0){let l=new Gr(t);r=new qi(l),r.setCrossOrigin(this.crossOrigin);for(let c=0,u=e.length;c<u;c++){let d=e[c],h=d.url;if(Array.isArray(h)){let f=[];for(let p=0,_=h.length;p<_;p++){let g=h[p],m=o(g);m!==null&&(m instanceof HTMLImageElement?f.push(m):f.push(new rn(m.data,m.width,m.height)))}i[d.uuid]=new bn(f)}else{let f=o(d.url);i[d.uuid]=new bn(f)}}}return i}async parseImagesAsync(e){let t=this,n={},i;async function r(a){if(typeof a=="string"){let o=a,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(o)?o:t.resourcePath+o;return await i.loadAsync(l)}else return a.data?{data:ur(a.type,a.data),width:a.width,height:a.height}:null}if(e!==void 0&&e.length>0){i=new qi(this.manager),i.setCrossOrigin(this.crossOrigin);for(let a=0,o=e.length;a<o;a++){let l=e[a],c=l.url;if(Array.isArray(c)){let u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d],p=await r(f);p!==null&&(p instanceof HTMLImageElement?u.push(p):u.push(new rn(p.data,p.width,p.height)))}n[l.uuid]=new bn(u)}else{let u=await r(l.url);n[l.uuid]=new bn(u)}}}return n}parseTextures(e,t){function n(r,a){return typeof r=="number"?r:(de("ObjectLoader.parseTexture: Constant should be in numeric form.",r),a[r])}let i={};if(e!==void 0)for(let r=0,a=e.length;r<a;r++){let o=e[r];o.image===void 0&&de('ObjectLoader: No "image" specified for',o.uuid),t[o.image]===void 0&&de("ObjectLoader: Undefined image",o.image);let l=t[o.image],c=l.data,u;Array.isArray(c)?(u=new ki,c.length===6&&(u.needsUpdate=!0)):(c&&c.data?u=new rn:u=new At,c&&(u.needsUpdate=!0)),u.source=l,u.uuid=o.uuid,o.name!==void 0&&(u.name=o.name),o.mapping!==void 0&&(u.mapping=n(o.mapping,P_)),o.channel!==void 0&&(u.channel=o.channel),o.offset!==void 0&&u.offset.fromArray(o.offset),o.repeat!==void 0&&u.repeat.fromArray(o.repeat),o.center!==void 0&&u.center.fromArray(o.center),o.rotation!==void 0&&(u.rotation=o.rotation),o.wrap!==void 0&&(u.wrapS=n(o.wrap[0],Nf),u.wrapT=n(o.wrap[1],Nf)),o.format!==void 0&&(u.format=o.format),o.internalFormat!==void 0&&(u.internalFormat=o.internalFormat),o.type!==void 0&&(u.type=o.type),o.colorSpace!==void 0&&(u.colorSpace=o.colorSpace),o.minFilter!==void 0&&(u.minFilter=n(o.minFilter,Ff)),o.magFilter!==void 0&&(u.magFilter=n(o.magFilter,Ff)),o.anisotropy!==void 0&&(u.anisotropy=o.anisotropy),o.flipY!==void 0&&(u.flipY=o.flipY),o.generateMipmaps!==void 0&&(u.generateMipmaps=o.generateMipmaps),o.premultiplyAlpha!==void 0&&(u.premultiplyAlpha=o.premultiplyAlpha),o.unpackAlignment!==void 0&&(u.unpackAlignment=o.unpackAlignment),o.compareFunction!==void 0&&(u.compareFunction=o.compareFunction),o.normalized!==void 0&&(u.normalized=o.normalized),o.userData!==void 0&&(u.userData=o.userData),i[o.uuid]=u}return i}parseObject(e,t,n,i,r){let a;function o(h){return t[h]===void 0&&de("ObjectLoader: Undefined geometry",h),t[h]}function l(h){if(h!==void 0){if(Array.isArray(h)){let f=[];for(let p=0,_=h.length;p<_;p++){let g=h[p];n[g]===void 0&&de("ObjectLoader: Undefined material",g),f.push(n[g])}return f}return n[h]===void 0&&de("ObjectLoader: Undefined material",h),n[h]}}function c(h){return i[h]===void 0&&de("ObjectLoader: Undefined texture",h),i[h]}let u,d;switch(e.type){case"Scene":a=new Bi,e.background!==void 0&&(Number.isInteger(e.background)?a.background=new le(e.background):a.background=c(e.background)),e.environment!==void 0&&(a.environment=c(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?a.fog=new Ja(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(a.fog=new Za(e.fog.color,e.fog.density)),e.fog.name!==""&&(a.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(a.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(a.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&a.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(a.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&a.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":a=new It(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(a.focus=e.focus),e.zoom!==void 0&&(a.zoom=e.zoom),e.filmGauge!==void 0&&(a.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(a.filmOffset=e.filmOffset),e.view!==void 0&&(a.view=Object.assign({},e.view));break;case"OrthographicCamera":a=new An(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(a.zoom=e.zoom),e.view!==void 0&&(a.view=Object.assign({},e.view));break;case"AmbientLight":a=new Oo(e.color,e.intensity);break;case"DirectionalLight":a=new Xr(e.color,e.intensity),a.target=e.target||"";break;case"PointLight":a=new Fo(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":a=new Bo(e.color,e.intensity,e.width,e.height);break;case"SpotLight":a=new Wr(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),a.target=e.target||"";break;case"HemisphereLight":a=new No(e.color,e.groundColor,e.intensity);break;case"LightProbe":let h=new qr().fromArray(e.sh);a=new zo(h,e.intensity);break;case"SkinnedMesh":u=o(e.geometry),d=l(e.material),a=new ja(u,d),e.bindMode!==void 0&&(a.bindMode=e.bindMode),e.bindMatrix!==void 0&&a.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(a.skeleton=e.skeleton);break;case"Mesh":u=o(e.geometry),d=l(e.material),a=new mt(u,d);break;case"InstancedMesh":u=o(e.geometry),d=l(e.material);let f=e.count,p=e.instanceMatrix,_=e.instanceColor;a=new Tr(u,d,f),a.instanceMatrix=new $n(new Float32Array(p.array),16),_!==void 0&&(a.instanceColor=new $n(new Float32Array(_.array),_.itemSize));break;case"BatchedMesh":u=o(e.geometry),d=l(e.material),a=new to(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,d),a.geometry=u,a.perObjectFrustumCulled=e.perObjectFrustumCulled,a.sortObjects=e.sortObjects,a._drawRanges=e.drawRanges,a._reservedRanges=e.reservedRanges,a._geometryInfo=e.geometryInfo.map(g=>{let m=null,y=null;return g.boundingBox!==void 0&&(m=new Ft().fromJSON(g.boundingBox)),g.boundingSphere!==void 0&&(y=new Ut().fromJSON(g.boundingSphere)),{...g,boundingBox:m,boundingSphere:y}}),a._instanceInfo=e.instanceInfo,a._availableInstanceIds=e._availableInstanceIds,a._availableGeometryIds=e._availableGeometryIds,a._nextIndexStart=e.nextIndexStart,a._nextVertexStart=e.nextVertexStart,a._geometryCount=e.geometryCount,a._maxInstanceCount=e.maxInstanceCount,a._maxVertexCount=e.maxVertexCount,a._maxIndexCount=e.maxIndexCount,a._geometryInitialized=e.geometryInitialized,a._matricesTexture=c(e.matricesTexture.uuid),a._indirectTexture=c(e.indirectTexture.uuid),e.colorsTexture!==void 0&&(a._colorsTexture=c(e.colorsTexture.uuid)),e.boundingSphere!==void 0&&(a.boundingSphere=new Ut().fromJSON(e.boundingSphere)),e.boundingBox!==void 0&&(a.boundingBox=new Ft().fromJSON(e.boundingBox));break;case"LOD":a=new $a;break;case"Line":a=new kn(o(e.geometry),l(e.material));break;case"LineLoop":a=new no(o(e.geometry),l(e.material));break;case"LineSegments":a=new xn(o(e.geometry),l(e.material));break;case"PointCloud":case"Points":a=new vs(o(e.geometry),l(e.material));break;case"Sprite":a=new Ka(l(e.material));break;case"Group":a=new Jn;break;case"Bone":a=new br;break;default:a=new lt}if(a.uuid=e.uuid,e.name!==void 0&&(a.name=e.name),e.matrix!==void 0?(a.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(a.matrixAutoUpdate=e.matrixAutoUpdate),a.matrixAutoUpdate&&a.matrix.decompose(a.position,a.quaternion,a.scale)):(e.position!==void 0&&a.position.fromArray(e.position),e.rotation!==void 0&&a.rotation.fromArray(e.rotation),e.quaternion!==void 0&&a.quaternion.fromArray(e.quaternion),e.scale!==void 0&&a.scale.fromArray(e.scale)),e.up!==void 0&&a.up.fromArray(e.up),e.pivot!==void 0&&(a.pivot=new R().fromArray(e.pivot)),e.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),e.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=e.morphTargetInfluences.slice()),e.castShadow!==void 0&&(a.castShadow=e.castShadow),e.receiveShadow!==void 0&&(a.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(a.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(a.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(a.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(a.shadow.radius=e.shadow.radius),e.shadow.blurSamples!==void 0&&(a.shadow.blurSamples=e.shadow.blurSamples),e.shadow.focus!==void 0&&(a.shadow.focus=e.shadow.focus),e.shadow.aspect!==void 0&&(a.shadow.aspect=e.shadow.aspect),e.shadow.mapSize!==void 0&&a.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(a.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(a.visible=e.visible),e.frustumCulled!==void 0&&(a.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(a.renderOrder=e.renderOrder),e.static!==void 0&&(a.static=e.static),e.userData!==void 0&&(a.userData=e.userData),e.layers!==void 0&&(a.layers.mask=e.layers),e.children!==void 0){let h=e.children;for(let f=0;f<h.length;f++)a.add(this.parseObject(h[f],t,n,i,r))}if(e.animations!==void 0){let h=e.animations;for(let f=0;f<h.length;f++){let p=h[f];a.animations.push(r[p])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(a.autoUpdate=e.autoUpdate);let h=e.levels;for(let f=0;f<h.length;f++){let p=h[f],_=a.getObjectByProperty("uuid",p.object);_!==void 0&&a.addLevel(_,p.distance,p.hysteresis)}}return a}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){let i=t[n.skeleton];i===void 0?de("ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){let n=t.target,i=e.getObjectByProperty("uuid",n);i!==void 0?t.target=i:t.target=new lt}})}},P_={UVMapping:$o,CubeReflectionMapping:Hn,CubeRefractionMapping:yi,EquirectangularReflectionMapping:ia,EquirectangularRefractionMapping:sa,CubeUVReflectionMapping:Ls},Nf={RepeatWrapping:ds,ClampToEdgeWrapping:kt,MirroredRepeatWrapping:dr},Ff={NearestFilter:Tt,NearestMipmapNearestFilter:K0,NearestMipmapLinearFilter:Us,LinearFilter:xt,LinearMipmapNearestFilter:ra,LinearMipmapLinearFilter:Gn},ju=new WeakMap,u0=class extends Wt{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&de("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&de("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Bn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{ju.has(a)===!0?(i&&i(ju.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Bn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),ju.set(l,c),Bn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Bn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Zr=class{static getContext(){return Pc===void 0&&(Pc=new(window.AudioContext||window.webkitAudioContext)),Pc}static setContext(e){Pc=e}},h0=class extends Wt{constructor(e){super(e)}load(e,t,n,i){let r=this,a=new wn(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(l){try{let c=l.slice(0),u=Zr.getContext(),d=e+"#decode";r.manager.itemStart(d),u.decodeAudioData(c,function(h){t(h),r.manager.itemEnd(d)}).catch(function(h){o(h),r.manager.itemEnd(d)})}catch(c){o(c)}},n,i);function o(l){i?i(l):De(l),r.manager.itemError(e)}}},Of=new Ge,Bf=new Ge,ss=new Ge,d0=class{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new It,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new It,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){let t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,ss.copy(e.projectionMatrix);let i=t.eyeSep/2,r=i*t.near/t.focus,a=t.near*Math.tan(us*t.fov*.5)/t.zoom,o,l;Bf.elements[12]=-i,Of.elements[12]=i,o=-a*t.aspect+r,l=a*t.aspect+r,ss.elements[0]=2*t.near/(l-o),ss.elements[8]=(l+o)/(l-o),this.cameraL.projectionMatrix.copy(ss),o=-a*t.aspect-r,l=a*t.aspect-r,ss.elements[0]=2*t.near/(l-o),ss.elements[8]=(l+o)/(l-o),this.cameraR.projectionMatrix.copy(ss)}this.cameraL.matrix.copy(e.matrixWorld).multiply(Bf),this.cameraL.matrixWorldNeedsUpdate=!0,this.cameraR.matrix.copy(e.matrixWorld).multiply(Of),this.cameraR.matrixWorldNeedsUpdate=!0}},ar=-90,or=1,Go=class extends lt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new It(ar,or,e,t);i.layers=this.layers,this.add(i);let r=new It(ar,or,e,t);r.layers=this.layers,this.add(r);let a=new It(ar,or,e,t);a.layers=this.layers,this.add(a);let o=new It(ar,or,e,t);o.layers=this.layers,this.add(o);let l=new It(ar,or,e,t);l.layers=this.layers,this.add(l);let c=new It(ar,or,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===hn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Fi)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Wo=class extends It{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Is=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=I_.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};rs=new R,Qu=new Vt,D_=new R,as=new R,os=new R,f0=class extends lt{constructor(){super(),this.type="AudioListener",this.context=Zr.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._timer=new Is}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e),this._timer.update();let t=this.context.listener;if(this.timeDelta=this._timer.getDelta(),this.matrixWorld.decompose(rs,Qu,D_),as.set(0,0,-1).applyQuaternion(Qu),os.set(0,1,0).applyQuaternion(Qu),t.positionX){let n=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(rs.x,n),t.positionY.linearRampToValueAtTime(rs.y,n),t.positionZ.linearRampToValueAtTime(rs.z,n),t.forwardX.linearRampToValueAtTime(as.x,n),t.forwardY.linearRampToValueAtTime(as.y,n),t.forwardZ.linearRampToValueAtTime(as.z,n),t.upX.linearRampToValueAtTime(os.x,n),t.upY.linearRampToValueAtTime(os.y,n),t.upZ.linearRampToValueAtTime(os.z,n)}else t.setPosition(rs.x,rs.y,rs.z),t.setOrientation(as.x,as.y,as.z,os.x,os.y,os.z)}},Xo=class extends lt{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){de("Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){de("Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;let t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){de("Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){de("Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){de("Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(de("Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){de("Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}copy(e,t){return super.copy(e,t),e.sourceType!=="buffer"?(de("Audio: Audio source type cannot be copied."),this):(this.autoplay=e.autoplay,this.buffer=e.buffer,this.detune=e.detune,this.loop=e.loop,this.loopStart=e.loopStart,this.loopEnd=e.loopEnd,this.offset=e.offset,this.duration=e.duration,this.playbackRate=e.playbackRate,this.hasPlaybackControl=e.hasPlaybackControl,this.sourceType=e.sourceType,this.filters=e.filters.slice(),this)}clone(e){return new this.constructor(this.listener).copy(this,e)}},ls=new R,zf=new Vt,L_=new R,cs=new R,p0=class extends Xo{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(ls,zf,L_),cs.set(0,0,1).applyQuaternion(zf);let t=this.panner;if(t.positionX){let n=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(ls.x,n),t.positionY.linearRampToValueAtTime(ls.y,n),t.positionZ.linearRampToValueAtTime(ls.z,n),t.orientationX.linearRampToValueAtTime(cs.x,n),t.orientationY.linearRampToValueAtTime(cs.y,n),t.orientationZ.linearRampToValueAtTime(cs.z,n)}else t.setPosition(ls.x,ls.y,ls.z),t.setOrientation(cs.x,cs.y,cs.z)}},m0=class{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0,t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}},qo=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,a;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,r=e*i+i,a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[r+o]=n[o];a=t}else{a+=t;let o=t/a;this._mixBufferRegion(n,r,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,a=i;r!==a;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Vt.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){let a=this._workIndex*r;Vt.multiplyQuaternionsFlat(e,a,e,t,e,n),Vt.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,r){let a=1-i;for(let o=0;o!==r;++o){let l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,r){for(let a=0;a!==r;++a){let o=t+a;e[o]=e[o]+e[n+a]*i}}},nd="\\[\\]\\.:\\/",U_=new RegExp("["+nd+"]","g"),id="[^"+nd+"]",N_="[^"+nd.replace("\\.","")+"]",F_=/((?:WC+[\/:])*)/.source.replace("WC",id),O_=/(WCOD+)?/.source.replace("WCOD",N_),B_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",id),z_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",id),k_=new RegExp("^"+F_+O_+B_+z_+"$"),V_=["material","materials","bones","map"],fh=class{constructor(e,t,n){let i=n||pt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},pt=class s{constructor(e,t,n){this.path=t,this.parsedPath=n||s.parseTrackName(t),this.node=s.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new s.Composite(e,t,n):new s(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(U_,"")}static parseTrackName(e){let t=k_.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);V_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,r=t.propertyIndex;if(e||(e=s.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){de("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){De("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){De("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){De("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){De("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){De("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){De("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){De("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[i];if(a===void 0){let c=t.nodeName;De("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){De("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){De("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};pt.Composite=fh;pt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};pt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};pt.prototype.GetterByBindingType=[pt.prototype._getValue_direct,pt.prototype._getValue_array,pt.prototype._getValue_arrayElement,pt.prototype._getValue_toArray];pt.prototype.SetterByBindingTypeAndVersioning=[[pt.prototype._setValue_direct,pt.prototype._setValue_direct_setNeedsUpdate,pt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[pt.prototype._setValue_array,pt.prototype._setValue_array_setNeedsUpdate,pt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[pt.prototype._setValue_arrayElement,pt.prototype._setValue_arrayElement_setNeedsUpdate,pt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[pt.prototype._setValue_fromArray,pt.prototype._setValue_fromArray_setNeedsUpdate,pt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];g0=class{constructor(){this.isAnimationObjectGroup=!0,this.uuid=gn(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;let e={};this._indicesByUUID=e;for(let n=0,i=arguments.length;n!==i;++n)e[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};let t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){let e=this._objects,t=this._indicesByUUID,n=this._paths,i=this._parsedPaths,r=this._bindings,a=r.length,o,l=e.length,c=this.nCachedObjects_;for(let u=0,d=arguments.length;u!==d;++u){let h=arguments[u],f=h.uuid,p=t[f];if(p===void 0){p=l++,t[f]=p,e.push(h);for(let _=0,g=a;_!==g;++_)r[_].push(new pt(h,n[_],i[_]))}else if(p<c){o=e[p];let _=--c,g=e[_];t[g.uuid]=p,e[p]=g,t[f]=_,e[_]=h;for(let m=0,y=a;m!==y;++m){let M=r[m],x=M[_],E=M[p];M[p]=x,E===void 0&&(E=new pt(h,n[m],i[m])),M[_]=E}}else e[p]!==o&&De("AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){let e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length,r=this.nCachedObjects_;for(let a=0,o=arguments.length;a!==o;++a){let l=arguments[a],c=l.uuid,u=t[c];if(u!==void 0&&u>=r){let d=r++,h=e[d];t[h.uuid]=u,e[u]=h,t[c]=d,e[d]=l;for(let f=0,p=i;f!==p;++f){let _=n[f],g=_[d],m=_[u];_[u]=g,_[d]=m}}}this.nCachedObjects_=r}uncache(){let e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length,r=this.nCachedObjects_,a=e.length;for(let o=0,l=arguments.length;o!==l;++o){let c=arguments[o],u=c.uuid,d=t[u];if(d!==void 0)if(delete t[u],d<r){let h=--r,f=e[h],p=--a,_=e[p];d!==h&&(t[f.uuid]=d),e[d]=f,h!==p&&(t[_.uuid]=h),e[h]=_,e.pop();for(let g=0,m=i;g!==m;++g){let y=n[g],M=y[h],x=y[p];y[d]=M,y[h]=x,y.pop()}}else{let h=--a,f=e[h];d!==h&&(t[f.uuid]=d),e[d]=f,e.pop();for(let p=0,_=i;p!==_;++p){let g=n[p];g[d]=g[h],g.pop()}}}this.nCachedObjects_=r}subscribe_(e,t){let n=this._bindingsIndicesByPath,i=n[e],r=this._bindings;if(i!==void 0)return r[i];let a=this._paths,o=this._parsedPaths,l=this._objects,c=l.length,u=this.nCachedObjects_,d=new Array(c);i=r.length,n[e]=i,a.push(e),o.push(t),r.push(d);for(let h=u,f=l.length;h!==f;++h){let p=l[h];d[h]=new pt(p,e,t)}return d}unsubscribe_(e){let t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){let i=this._paths,r=this._parsedPaths,a=this._bindings,o=a.length-1,l=a[o],c=i[o];t[c]=n,a[n]=l,a.pop(),r[n]=r[o],r.pop(),i[n]=i[o],i.pop()}}},Yo=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let r=t.tracks,a=r.length,o=new Array(a),l={endingStart:Ui,endingEnd:Ui};for(let c=0;c!==a;++c){let u=r[c].createInterpolant(null);o[c]=u,u.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=zh,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,r=e._clip.duration,a=r/i,o=i/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,r=i.time,a=this.timeScale,o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);let l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let r=this._startTime;if(r!==null){let l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);let a=this._updateTime(t),o=this._updateWeight(e);if(o>0){let l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case iu:for(let u=0,d=l.length;u!==d;++u)l[u].evaluate(a),c[u].accumulateAdditive(o);break;case Ul:default:for(let u=0,d=l.length;u!==d;++u)l[u].evaluate(a),c[u].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,r=this._loopCount,a=n===kh;if(e===0)return r===-1?i:a&&(r&1)===1?t-i:i;if(n===Bh){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){let o=Math.floor(i/t);i-=t*o,r+=Math.abs(o);let l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){let c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=i;if(a&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=Ni,i.endingEnd=Ni):(e?i.endingStart=this.zeroSlopeAtStart?Ni:Ui:i.endingStart=pr,t?i.endingEnd=this.zeroSlopeAtEnd?Ni:Ui:i.endingEnd=pr)}_scheduleFading(e,t,n){let i=this._mixer,r=i.time,a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);let o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=n,this}},H_=new Float32Array(1),Zo=class extends dn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName,u=c[l];u===void 0&&(u={},c[l]=u);for(let d=0;d!==r;++d){let h=i[d],f=h.name,p=u[f];if(p!==void 0)++p.referenceCount,a[d]=p;else{if(p=a[d],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,f));continue}let _=t&&t._propertyBindings[d].binding.parsedPath;p=new qo(pt.create(n,f,_),h.ValueTypeName,h.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,f),a[d]=p}o[d].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,r=this._actionsByClip,a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{let o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,l[u]=c,l.pop(),e._byClipCacheIndex=null;let d=o.actionByRoot,h=(e._localRoot||this._root).uuid;delete d[h],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,r=this._bindings,a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new kr(new Float32Array(2),new Float32Array(2),1,H_),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){let i=t||this._root,r=i.uuid,a=typeof e=="string"?Xi.findByName(i,e):e,o=a!==null?a.uuid:e,l=this._actionsByClip[o],c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Ul),l!==void 0){let d=l.actionByRoot[r];if(d!==void 0&&d.blendMode===n)return d;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;let u=new Yo(this,a,t,n);return this._bindAction(u,c),this._addInactiveAction(u,o,r),u}existingAction(e,t){let n=t||this._root,i=n.uuid,r=typeof e=="string"?Xi.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,a);let o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){let a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){let c=a[o];this._deactivateAction(c);let u=c._cacheIndex,d=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,d._cacheIndex=u,t[u]=d,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let a in n){let o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(let a in r){let o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}},_0=class extends vr{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isRenderTarget3D=!0,this.depth=n;for(let r=0;r<this.textures.length;r++){let a=new ms(null,e,t,n);a.isRenderTargetTexture=!0,a.renderTarget=this,this.textures[r]=a}this._setTextureOptions(i)}},x0=class s{constructor(e){this.value=e}clone(){return new s(this.value.clone===void 0?this.value:this.value.clone())}},G_=0,v0=class extends dn{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:G_++}),this.name="",this.usage=Ol,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){let t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(e){this.name=e.name,this.usage=e.usage;let t=e.uniforms;this.uniforms.length=0;for(let n=0,i=t.length;n<i;n++){let r=Array.isArray(t[n])?t[n]:[t[n]];for(let a=0;a<r.length;a++)this.uniforms.push(r[a].clone())}return this}clone(){return new this.constructor().copy(this)}},y0=class extends xs{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}},S0=class{constructor(e,t,n,i,r,a=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=i,this.count=r,this.normalized=a,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}},kf=new Ge,M0=class{constructor(e,t,n=0,i=1/0){this.ray=new fi(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new gs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):De("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return kf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(kf),this}intersectObject(e,t=!0,n=[]){return ph(e,this,n,t),n.sort(Vf),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)ph(e[i],this,n,t);return n.sort(Vf),n}};b0=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,de("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},T0=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=He(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(He(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},E0=class{constructor(e=1,t=0,n=0){this.radius=e,this.theta=t,this.y=n}set(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+n*n),this.theta=Math.atan2(e,n),this.y=t,this}clone(){return new this.constructor().copy(this)}},ld=class ld{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};ld.prototype.isMatrix2=!0;w0=ld,Hf=new ee,Jo=class{constructor(e=new ee(1/0,1/0),t=new ee(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Hf.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hf).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Gf=new R,Ic=new R,lr=new R,cr=new R,eh=new R,W_=new R,X_=new R,A0=class{constructor(e=new R,t=new R){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Gf.subVectors(e,this.start),Ic.subVectors(this.end,this.start);let n=Ic.dot(Ic);if(n===0)return 0;let r=Ic.dot(Gf)/n;return t&&(r=He(r,0,1)),r}closestPointToPoint(e,t,n){let i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}distanceSqToLine3(e,t=W_,n=X_){let i=10000000000000001e-32,r,a,o=this.start,l=e.start,c=this.end,u=e.end;lr.subVectors(c,o),cr.subVectors(u,l),eh.subVectors(o,l);let d=lr.dot(lr),h=cr.dot(cr),f=cr.dot(eh);if(d<=i&&h<=i)return t.copy(o),n.copy(l),t.sub(n),t.dot(t);if(d<=i)r=0,a=f/h,a=He(a,0,1);else{let p=lr.dot(eh);if(h<=i)a=0,r=He(-p/d,0,1);else{let _=lr.dot(cr),g=d*h-_*_;g!==0?r=He((_*f-p*h)/g,0,1):r=0,a=(_*r+f)/h,a<0?(a=0,r=He(-p/d,0,1)):a>1&&(a=1,r=He((_-p)/d,0,1))}}return t.copy(o).addScaledVector(lr,r),n.copy(l).addScaledVector(cr,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}},Wf=new R,C0=class extends lt{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";let n=new We,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let a=0,o=1,l=32;a<l;a++,o++){let c=a/l*Math.PI*2,u=o/l*Math.PI*2;i.push(Math.cos(c),Math.sin(c),1,Math.cos(u),Math.sin(u),1)}n.setAttribute("position",new Me(i,3));let r=new Ht({fog:!1,toneMapped:!1});this.cone=new xn(n,r),this.add(this.cone),this.update()}dispose(){super.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorldNeedsUpdate=!0;let e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),Wf.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Wf),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}},Li=new R,Dc=new Ge,th=new Ge,R0=class extends xn{constructor(e){let t=im(e),n=new We,i=[],r=[];for(let c=0;c<t.length;c++){let u=t[c];u.parent&&u.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),r.push(0,0,0),r.push(0,0,0))}n.setAttribute("position",new Me(i,3)),n.setAttribute("color",new Me(r,3));let a=new Ht({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,a),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1;let o=new le(255),l=new le(65280);this.setColors(o,l)}updateMatrixWorld(e){let t=this.bones,n=this.geometry,i=n.getAttribute("position");th.copy(this.root.matrixWorld).invert();for(let r=0,a=0;r<t.length;r++){let o=t[r];o.parent&&o.parent.isBone&&(Dc.multiplyMatrices(th,o.matrixWorld),Li.setFromMatrixPosition(Dc),i.setXYZ(a,Li.x,Li.y,Li.z),Dc.multiplyMatrices(th,o.parent.matrixWorld),Li.setFromMatrixPosition(Dc),i.setXYZ(a+1,Li.x,Li.y,Li.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}setColors(e,t){let i=this.geometry.getAttribute("color");for(let r=0;r<i.count;r+=2)i.setXYZ(r,e.r,e.g,e.b),i.setXYZ(r+1,t.r,t.g,t.b);return i.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}};P0=class extends mt{constructor(e,t,n){let i=new Hi(t,4,2),r=new _n({wireframe:!0,fog:!1,toneMapped:!1});super(i,r),this.light=e,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}},q_=new R,Xf=new le,qf=new le,I0=class extends lt{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";let i=new Nr(t);i.rotateY(Math.PI*.5),this.material=new _n({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);let r=i.getAttribute("position"),a=new Float32Array(r.count*3);i.setAttribute("color",new rt(a,3)),this.add(new mt(i,this.material)),this.update()}dispose(){super.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){let e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{let t=e.geometry.getAttribute("color");Xf.copy(this.light.color),qf.copy(this.light.groundColor);for(let n=0,i=t.count;n<i;n++){let r=n<i/2?Xf:qf;t.setXYZ(n,r.r,r.g,r.b)}t.needsUpdate=!0}this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),e.lookAt(q_.setFromMatrixPosition(this.light.matrixWorld).negate())}},D0=class extends xn{constructor(e=10,t=10,n=4473924,i=8947848){n=new le(n),i=new le(i);let r=t/2,a=e/t,o=e/2,l=[],c=[];for(let h=0,f=0,p=-o;h<=t;h++,p+=a){l.push(-o,0,p,o,0,p),l.push(p,0,-o,p,0,o);let _=h===r?n:i;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}let u=new We;u.setAttribute("position",new Me(l,3)),u.setAttribute("color",new Me(c,3));let d=new Ht({vertexColors:!0,toneMapped:!1});super(u,d),this.type="GridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},L0=class extends xn{constructor(e=10,t=16,n=8,i=64,r=4473924,a=8947848){r=new le(r),a=new le(a);let o=[],l=[];if(t>1)for(let d=0;d<t;d++){let h=d/t*(Math.PI*2),f=Math.sin(h)*e,p=Math.cos(h)*e;o.push(0,0,0),o.push(f,0,p);let _=d&1?r:a;l.push(_.r,_.g,_.b),l.push(_.r,_.g,_.b)}for(let d=0;d<n;d++){let h=d&1?r:a,f=e-e/n*d;for(let p=0;p<i;p++){let _=p/i*(Math.PI*2),g=Math.sin(_)*f,m=Math.cos(_)*f;o.push(g,0,m),l.push(h.r,h.g,h.b),_=(p+1)/i*(Math.PI*2),g=Math.sin(_)*f,m=Math.cos(_)*f,o.push(g,0,m),l.push(h.r,h.g,h.b)}}let c=new We;c.setAttribute("position",new Me(o,3)),c.setAttribute("color",new Me(l,3));let u=new Ht({vertexColors:!0,toneMapped:!1});super(c,u),this.type="PolarGridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},Yf=new R,Lc=new R,Zf=new R,U0=class extends lt{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",t===void 0&&(t=1);let i=new We;i.setAttribute("position",new Me([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));let r=new Ht({fog:!1,toneMapped:!1});this.lightPlane=new kn(i,r),this.add(this.lightPlane),i=new We,i.setAttribute("position",new Me([0,0,0,0,0,1],3)),this.targetLine=new kn(i,r),this.add(this.targetLine),this.update()}dispose(){super.dispose(),this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),Yf.setFromMatrixPosition(this.light.matrixWorld),Lc.setFromMatrixPosition(this.light.target.matrixWorld),Zf.subVectors(Lc,Yf),this.lightPlane.lookAt(Lc),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(Lc),this.targetLine.scale.z=Zf.length()}},Uc=new R,wt=new Ps,N0=class extends xn{constructor(e){let t=new We,n=new Ht({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],r=[],a={};o("n1","n2"),o("n2","n4"),o("n4","n3"),o("n3","n1"),o("f1","f2"),o("f2","f4"),o("f4","f3"),o("f3","f1"),o("n1","f1"),o("n2","f2"),o("n3","f3"),o("n4","f4"),o("p","n1"),o("p","n2"),o("p","n3"),o("p","n4"),o("u1","u2"),o("u2","u3"),o("u3","u1"),o("c","t"),o("p","c"),o("cn1","cn2"),o("cn3","cn4"),o("cf1","cf2"),o("cf3","cf4");function o(p,_){l(p),l(_)}function l(p){i.push(0,0,0),r.push(0,0,0),a[p]===void 0&&(a[p]=[]),a[p].push(i.length/3-1)}t.setAttribute("position",new Me(i,3)),t.setAttribute("color",new Me(r,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();let c=new le(16755200),u=new le(16711680),d=new le(43775),h=new le(16777215),f=new le(3355443);this.setColors(c,u,d,h,f)}setColors(e,t,n,i,r){let o=this.geometry.getAttribute("color");return o.setXYZ(0,e.r,e.g,e.b),o.setXYZ(1,e.r,e.g,e.b),o.setXYZ(2,e.r,e.g,e.b),o.setXYZ(3,e.r,e.g,e.b),o.setXYZ(4,e.r,e.g,e.b),o.setXYZ(5,e.r,e.g,e.b),o.setXYZ(6,e.r,e.g,e.b),o.setXYZ(7,e.r,e.g,e.b),o.setXYZ(8,e.r,e.g,e.b),o.setXYZ(9,e.r,e.g,e.b),o.setXYZ(10,e.r,e.g,e.b),o.setXYZ(11,e.r,e.g,e.b),o.setXYZ(12,e.r,e.g,e.b),o.setXYZ(13,e.r,e.g,e.b),o.setXYZ(14,e.r,e.g,e.b),o.setXYZ(15,e.r,e.g,e.b),o.setXYZ(16,e.r,e.g,e.b),o.setXYZ(17,e.r,e.g,e.b),o.setXYZ(18,e.r,e.g,e.b),o.setXYZ(19,e.r,e.g,e.b),o.setXYZ(20,e.r,e.g,e.b),o.setXYZ(21,e.r,e.g,e.b),o.setXYZ(22,e.r,e.g,e.b),o.setXYZ(23,e.r,e.g,e.b),o.setXYZ(24,t.r,t.g,t.b),o.setXYZ(25,t.r,t.g,t.b),o.setXYZ(26,t.r,t.g,t.b),o.setXYZ(27,t.r,t.g,t.b),o.setXYZ(28,t.r,t.g,t.b),o.setXYZ(29,t.r,t.g,t.b),o.setXYZ(30,t.r,t.g,t.b),o.setXYZ(31,t.r,t.g,t.b),o.setXYZ(32,n.r,n.g,n.b),o.setXYZ(33,n.r,n.g,n.b),o.setXYZ(34,n.r,n.g,n.b),o.setXYZ(35,n.r,n.g,n.b),o.setXYZ(36,n.r,n.g,n.b),o.setXYZ(37,n.r,n.g,n.b),o.setXYZ(38,i.r,i.g,i.b),o.setXYZ(39,i.r,i.g,i.b),o.setXYZ(40,r.r,r.g,r.b),o.setXYZ(41,r.r,r.g,r.b),o.setXYZ(42,r.r,r.g,r.b),o.setXYZ(43,r.r,r.g,r.b),o.setXYZ(44,r.r,r.g,r.b),o.setXYZ(45,r.r,r.g,r.b),o.setXYZ(46,r.r,r.g,r.b),o.setXYZ(47,r.r,r.g,r.b),o.setXYZ(48,r.r,r.g,r.b),o.setXYZ(49,r.r,r.g,r.b),o.needsUpdate=!0,this}update(){let e=this.geometry,t=this.pointMap,n=1,i=1,r,a;if(wt.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)r=1,a=0;else if(this.camera.coordinateSystem===hn)r=-1,a=1;else if(this.camera.coordinateSystem===Fi)r=0,a=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);Pt("c",t,e,wt,0,0,r),Pt("t",t,e,wt,0,0,a),Pt("n1",t,e,wt,-n,-i,r),Pt("n2",t,e,wt,n,-i,r),Pt("n3",t,e,wt,-n,i,r),Pt("n4",t,e,wt,n,i,r),Pt("f1",t,e,wt,-n,-i,a),Pt("f2",t,e,wt,n,-i,a),Pt("f3",t,e,wt,-n,i,a),Pt("f4",t,e,wt,n,i,a),Pt("u1",t,e,wt,n*.7,i*1.1,r),Pt("u2",t,e,wt,-n*.7,i*1.1,r),Pt("u3",t,e,wt,0,i*2,r),Pt("cf1",t,e,wt,-n,0,a),Pt("cf2",t,e,wt,n,0,a),Pt("cf3",t,e,wt,0,-i,a),Pt("cf4",t,e,wt,0,i,a),Pt("cn1",t,e,wt,-n,0,r),Pt("cn2",t,e,wt,n,0,r),Pt("cn3",t,e,wt,0,-i,r),Pt("cn4",t,e,wt,0,i,r),e.getAttribute("position").needsUpdate=!0}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}};Nc=new Ft,F0=class extends xn{constructor(e,t=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(24),r=new We;r.setIndex(new rt(n,1)),r.setAttribute("position",new rt(i,3)),super(r,new Ht({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&Nc.setFromObject(this.object),Nc.isEmpty())return;let e=Nc.min,t=Nc.max,n=this.geometry.attributes.position,i=n.array;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=e.x,i[4]=t.y,i[5]=t.z,i[6]=e.x,i[7]=e.y,i[8]=t.z,i[9]=t.x,i[10]=e.y,i[11]=t.z,i[12]=t.x,i[13]=t.y,i[14]=e.z,i[15]=e.x,i[16]=t.y,i[17]=e.z,i[18]=e.x,i[19]=e.y,i[20]=e.z,i[21]=t.x,i[22]=e.y,i[23]=e.z,n.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},O0=class extends xn{constructor(e,t=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new We;r.setIndex(new rt(n,1)),r.setAttribute("position",new Me(i,3)),super(r,new Ht({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){let t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},B0=class extends kn{constructor(e,t=1,n=16776960){let i=n,r=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],a=new We;a.setAttribute("position",new Me(r,3)),a.computeBoundingSphere(),super(a,new Ht({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;let o=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new We;l.setAttribute("position",new Me(o,3)),l.computeBoundingSphere(),this.add(new mt(l,new _n({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}},Jf=new R,z0=class extends lt{constructor(e=new R(0,0,1),t=new R(0,0,0),n=1,i=16776960,r=n*.2,a=r*.2){super(),this.type="ArrowHelper",Fc===void 0&&(Fc=new We,Fc.setAttribute("position",new Me([0,0,0,0,1,0],3)),nh=new bs(.5,1,5,1),nh.translate(0,-.5,0)),this.position.copy(t),this.line=new kn(Fc,new Ht({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new mt(nh,new _n({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,a)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Jf.set(e.z,0,-e.x).normalize();let t=Math.acos(e.y);this.quaternion.setFromAxisAngle(Jf,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}},k0=class extends xn{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new We;i.setAttribute("position",new Me(t,3)),i.setAttribute("color",new Me(n,3));let r=new Ht({vertexColors:!0,toneMapped:!1});super(i,r),this.type="AxesHelper"}setColors(e,t,n){let i=new le,r=this.geometry.attributes.color.array;return i.set(e),i.toArray(r,0),i.toArray(r,3),i.set(t),i.toArray(r,6),i.toArray(r,9),i.set(n),i.toArray(r,12),i.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},V0=class{constructor(){this.type="ShapePath",this.color=new le,this.subPaths=[],this.currentPath=null,this.userData={}}moveTo(e,t){return this.currentPath=new Vi,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,r,a){return this.currentPath.bezierCurveTo(e,t,n,i,r,a),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(){function e(l,c){let u=!1,d=c.length;for(let h=0,f=d-1;h<d;f=h++){let p=c[h],_=c[f];p.y>l.y!=_.y>l.y&&l.x<(_.x-p.x)*(l.y-p.y)/(_.y-p.y)+p.x&&(u=!u)}return u}function t(l,c){let u=c.getCenter(new ee);if(e(u,l))return u;let d=u.y,h=[],f=l.length;for(let p=0;p<f;p++){let _=l[p],g=l[(p+1)%f];if(_.y>d!=g.y>d){let m=_.x+(d-_.y)*(g.x-_.x)/(g.y-_.y);h.push(m)}}return h.length>1&&(h.sort((p,_)=>p-_),u.x=(h[0]+h[1])/2),u}let n=this.userData.style&&this.userData.style.fillRule||"nonzero";n!=="nonzero"&&n!=="evenodd"&&(de('Fill-rule "'+n+'" is not supported, falling back to "nonzero".'),n="nonzero");let i=n==="nonzero"?(l=>l!==0):(l=>(l&1)!==0),r=[];for(let l of this.subPaths){let c=l.getPoints();if(c.length<3)continue;let u=Tn.area(c);if(u===0)continue;let d=new Jo;for(let h=0;h<c.length;h++)d.expandByPoint(c[h]);r.push({subPath:l,points:c,boundingBox:d,interiorPoint:t(c,d),absArea:Math.abs(u),winding:u<0?-1:1,container:null,exclude:!1,role:null})}r.sort((l,c)=>c.absArea-l.absArea);for(let l=0;l<r.length;l++){let c=r[l],u=0;for(let d=l-1;d>=0;d--){let h=r[d];if(h.boundingBox.containsBox(c.boundingBox)&&e(c.interiorPoint,h.points)){c.container=h.exclude?h.container:h,u=h.winding,c.winding+=u;break}}i(c.winding)===i(u)&&(c.exclude=!0)}for(let l of r)l.exclude||(l.role=l.container===null||l.container.role==="hole"?"outer":"hole");let a=[],o=new Map;for(let l of r){if(l.exclude||l.role!=="outer")continue;let c=new _i;c.curves=l.subPath.curves,a.push(c),o.set(l,c)}for(let l of r){if(l.exclude||l.role!=="hole")continue;let c=o.get(l.container);if(!c)continue;let u=new Vi;u.curves=l.subPath.curves,c.holes.push(u)}return a}},H0=class extends dn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};G0=class{static contain(e,t){return Y_(e,t)}static cover(e,t){return Z_(e,t)}static fill(e){return J_(e)}static getByteLength(e,t,n,i){return au(e,t,n,i)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?de("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186")});var gt={};eg(gt,{ACESFilmicToneMapping:()=>Ki,AddEquation:()=>ni,AddOperation:()=>Fh,AdditiveAnimationBlendMode:()=>iu,AdditiveBlending:()=>Ji,AgXToneMapping:()=>ta,AlphaFormat:()=>tu,AlwaysCompare:()=>Jh,AlwaysDepth:()=>ka,AlwaysStencilFunc:()=>Gh,AmbientLight:()=>Oo,AnimationAction:()=>Yo,AnimationClip:()=>Xi,AnimationLoader:()=>s0,AnimationMixer:()=>Zo,AnimationObjectGroup:()=>g0,AnimationUtils:()=>i0,ArcCurve:()=>co,ArrayCamera:()=>Wo,ArrowHelper:()=>z0,AttachedBindMode:()=>Oc,Audio:()=>Xo,AudioAnalyser:()=>m0,AudioContext:()=>Zr,AudioListener:()=>f0,AudioLoader:()=>h0,AxesHelper:()=>k0,BackSide:()=>Gt,BasicDepthPacking:()=>Vh,BasicShadowMap:()=>Qf,BatchedMesh:()=>to,BezierInterpolant:()=>Lo,Bone:()=>br,BooleanKeyframeTrack:()=>ei,Box2:()=>Jo,Box3:()=>Ft,Box3Helper:()=>O0,BoxGeometry:()=>mi,BoxHelper:()=>F0,BufferAttribute:()=>rt,BufferGeometry:()=>We,BufferGeometryLoader:()=>Ho,ByteType:()=>$0,Cache:()=>Bn,Camera:()=>Ps,CameraHelper:()=>N0,CanvasTexture:()=>Ss,CapsuleGeometry:()=>ro,CatmullRomCurve3:()=>Ar,CineonToneMapping:()=>Qr,CircleGeometry:()=>ao,ClampToEdgeWrapping:()=>kt,Clock:()=>b0,Color:()=>le,ColorKeyframeTrack:()=>Vr,ColorManagement:()=>et,Compatibility:()=>kp,CompressedArrayTexture:()=>Qc,CompressedCubeTexture:()=>e0,CompressedTexture:()=>ys,CompressedTextureLoader:()=>r0,ConeGeometry:()=>bs,ConstantAlphaFactor:()=>Lh,ConstantColorFactor:()=>Ih,Controls:()=>H0,CubeCamera:()=>Go,CubeDepthTexture:()=>so,CubeReflectionMapping:()=>Hn,CubeRefractionMapping:()=>yi,CubeTexture:()=>ki,CubeTextureLoader:()=>a0,CubeUVReflectionMapping:()=>Ls,CubicBezierCurve:()=>Cr,CubicBezierCurve3:()=>uo,CubicInterpolant:()=>Io,CullFaceBack:()=>X0,CullFaceFront:()=>_h,CullFaceFrontBack:()=>jf,CullFaceNone:()=>gh,Curve:()=>fn,CurvePath:()=>fo,CustomBlending:()=>Ko,CustomToneMapping:()=>ea,CylinderGeometry:()=>Ms,Cylindrical:()=>E0,Data3DTexture:()=>ms,DataArrayTexture:()=>ps,DataTexture:()=>rn,DataTextureLoader:()=>o0,DataUtils:()=>Hc,DecrementStencilOp:()=>_p,DecrementWrapStencilOp:()=>vp,DefaultLoadingManager:()=>td,DepthFormat:()=>zn,DepthStencilFormat:()=>Si,DepthTexture:()=>pi,DetachedBindMode:()=>Oh,DirectionalLight:()=>Xr,DirectionalLightHelper:()=>U0,DiscreteInterpolant:()=>Do,DodecahedronGeometry:()=>oo,DoubleSide:()=>Cn,DstAlphaFactor:()=>wh,DstColorFactor:()=>Ch,DynamicCopyUsage:()=>Up,DynamicDrawUsage:()=>Cp,DynamicReadUsage:()=>Ip,EdgesGeometry:()=>lo,EllipseCurve:()=>Ts,EqualCompare:()=>qh,EqualDepth:()=>Ha,EqualStencilFunc:()=>bp,EquirectangularReflectionMapping:()=>ia,EquirectangularRefractionMapping:()=>sa,Euler:()=>En,EventDispatcher:()=>dn,ExternalTexture:()=>wr,ExtrudeGeometry:()=>_o,FileLoader:()=>wn,Float16BufferAttribute:()=>Zc,Float32BufferAttribute:()=>Me,FloatType:()=>$t,Fog:()=>Ja,FogExp2:()=>Za,FramebufferTexture:()=>jc,FrontSide:()=>vi,Frustum:()=>jn,FrustumArray:()=>eo,GLBufferAttribute:()=>S0,GLSL1:()=>Fp,GLSL3:()=>ru,GreaterCompare:()=>Yh,GreaterDepth:()=>Wa,GreaterEqualCompare:()=>Fl,GreaterEqualDepth:()=>Ga,GreaterEqualStencilFunc:()=>Ap,GreaterStencilFunc:()=>Ep,GridHelper:()=>D0,Group:()=>Jn,HTMLTexture:()=>t0,HalfFloatType:()=>Ct,HemisphereLight:()=>No,HemisphereLightHelper:()=>I0,IcosahedronGeometry:()=>Ur,ImageBitmapLoader:()=>u0,ImageLoader:()=>qi,ImageUtils:()=>Ya,IncrementStencilOp:()=>gp,IncrementWrapStencilOp:()=>xp,InstancedBufferAttribute:()=>$n,InstancedBufferGeometry:()=>Vo,InstancedInterleavedBuffer:()=>y0,InstancedMesh:()=>Tr,Int16BufferAttribute:()=>qc,Int32BufferAttribute:()=>Yc,Int8BufferAttribute:()=>Gc,IntType:()=>jo,InterleavedBuffer:()=>xs,InterleavedBufferAttribute:()=>zi,Interpolant:()=>xi,InterpolateBezier:()=>Bc,InterpolateDiscrete:()=>fr,InterpolateLinear:()=>qa,InterpolateSmooth:()=>La,InterpolationSamplingMode:()=>zp,InterpolationSamplingType:()=>Bp,InvertStencilOp:()=>yp,KeepStencilOp:()=>Ua,KeyframeTrack:()=>an,LOD:()=>$a,LatheGeometry:()=>xo,Layers:()=>gs,LessCompare:()=>Xh,LessDepth:()=>Va,LessEqualCompare:()=>Nl,LessEqualDepth:()=>hs,LessEqualStencilFunc:()=>Tp,LessStencilFunc:()=>Mp,Light:()=>Vn,LightProbe:()=>zo,LightShadow:()=>Rs,Line:()=>kn,Line3:()=>A0,LineBasicMaterial:()=>Ht,LineCurve:()=>Rr,LineCurve3:()=>ho,LineDashedMaterial:()=>Po,LineLoop:()=>no,LineSegments:()=>xn,LinearFilter:()=>xt,LinearInterpolant:()=>kr,LinearMipMapLinearFilter:()=>sp,LinearMipMapNearestFilter:()=>ip,LinearMipmapLinearFilter:()=>Gn,LinearMipmapNearestFilter:()=>ra,LinearSRGBColorSpace:()=>mr,LinearToneMapping:()=>$r,LinearTransfer:()=>gr,Loader:()=>Wt,LoaderUtils:()=>Yr,LoadingManager:()=>Gr,LoopOnce:()=>Bh,LoopPingPong:()=>kh,LoopRepeat:()=>zh,MOUSE:()=>Kf,Material:()=>Nt,MaterialBlending:()=>ep,MaterialLoader:()=>ko,MathUtils:()=>jh,Matrix2:()=>w0,Matrix3:()=>Ye,Matrix4:()=>Ge,MaxEquation:()=>Mh,Mesh:()=>mt,MeshBasicMaterial:()=>_n,MeshDepthMaterial:()=>Wi,MeshDistanceMaterial:()=>zr,MeshLambertMaterial:()=>Co,MeshMatcapMaterial:()=>Ro,MeshNormalMaterial:()=>Ao,MeshPhongMaterial:()=>Eo,MeshPhysicalMaterial:()=>Br,MeshStandardMaterial:()=>ws,MeshToonMaterial:()=>wo,MinEquation:()=>Sh,MirroredRepeatWrapping:()=>dr,MixOperation:()=>Nh,MultiplyBlending:()=>Y0,MultiplyOperation:()=>Kr,NearestFilter:()=>Tt,NearestMipMapLinearFilter:()=>np,NearestMipMapNearestFilter:()=>tp,NearestMipmapLinearFilter:()=>Us,NearestMipmapNearestFilter:()=>K0,NeutralToneMapping:()=>na,NeverCompare:()=>Wh,NeverDepth:()=>za,NeverStencilFunc:()=>Sp,NoBlending:()=>on,NoColorSpace:()=>Pn,NoNormalPacking:()=>hp,NoToneMapping:()=>Rn,NormalAnimationBlendMode:()=>Ul,NormalBlending:()=>Zi,NormalGAPacking:()=>fp,NormalRGPacking:()=>dp,NotEqualCompare:()=>Zh,NotEqualDepth:()=>Xa,NotEqualStencilFunc:()=>wp,NumberKeyframeTrack:()=>As,Object3D:()=>lt,ObjectLoader:()=>c0,ObjectSpaceNormalMap:()=>Hh,OctahedronGeometry:()=>Nr,OneFactor:()=>Jr,OneMinusConstantAlphaFactor:()=>Uh,OneMinusConstantColorFactor:()=>Dh,OneMinusDstAlphaFactor:()=>Ah,OneMinusDstColorFactor:()=>Rh,OneMinusSrcAlphaFactor:()=>J0,OneMinusSrcColorFactor:()=>Eh,OrthographicCamera:()=>An,PCFShadowMap:()=>Yi,PCFSoftShadowMap:()=>xh,PMREMGenerator:()=>zs,Path:()=>Vi,PerspectiveCamera:()=>It,Plane:()=>Mn,PlaneGeometry:()=>Qn,PlaneHelper:()=>B0,PointLight:()=>Fo,PointLightHelper:()=>P0,Points:()=>vs,PointsMaterial:()=>Er,PolarGridHelper:()=>L0,PolyhedronGeometry:()=>gi,PositionalAudio:()=>p0,PropertyBinding:()=>pt,PropertyMixer:()=>qo,QuadraticBezierCurve:()=>Pr,QuadraticBezierCurve3:()=>Ir,Quaternion:()=>Vt,QuaternionKeyframeTrack:()=>Cs,QuaternionLinearInterpolant:()=>Uo,R11_EAC_Format:()=>hl,RED_GREEN_RGTC2_Format:()=>da,RED_RGTC1_Format:()=>Il,REVISION:()=>mh,RG11_EAC_Format:()=>ha,RGBADepthPacking:()=>su,RGBAFormat:()=>jt,RGBAIntegerFormat:()=>il,RGBA_ASTC_10x10_Format:()=>El,RGBA_ASTC_10x5_Format:()=>Ml,RGBA_ASTC_10x6_Format:()=>bl,RGBA_ASTC_10x8_Format:()=>Tl,RGBA_ASTC_12x10_Format:()=>wl,RGBA_ASTC_12x12_Format:()=>Al,RGBA_ASTC_4x4_Format:()=>pl,RGBA_ASTC_5x4_Format:()=>ml,RGBA_ASTC_5x5_Format:()=>gl,RGBA_ASTC_6x5_Format:()=>_l,RGBA_ASTC_6x6_Format:()=>xl,RGBA_ASTC_8x5_Format:()=>vl,RGBA_ASTC_8x6_Format:()=>yl,RGBA_ASTC_8x8_Format:()=>Sl,RGBA_BPTC_Format:()=>Cl,RGBA_ETC2_EAC_Format:()=>ul,RGBA_PVRTC_2BPPV1_Format:()=>ol,RGBA_PVRTC_4BPPV1_Format:()=>al,RGBA_S3TC_DXT1_Format:()=>la,RGBA_S3TC_DXT3_Format:()=>ca,RGBA_S3TC_DXT5_Format:()=>ua,RGBDepthPacking:()=>cp,RGBFormat:()=>nu,RGBIntegerFormat:()=>rp,RGB_BPTC_SIGNED_Format:()=>Rl,RGB_BPTC_UNSIGNED_Format:()=>Pl,RGB_ETC1_Format:()=>ll,RGB_ETC2_Format:()=>cl,RGB_PVRTC_2BPPV1_Format:()=>rl,RGB_PVRTC_4BPPV1_Format:()=>sl,RGB_S3TC_DXT1_Format:()=>oa,RGDepthPacking:()=>up,RGFormat:()=>Mi,RGIntegerFormat:()=>nl,RawShaderMaterial:()=>Gi,Ray:()=>fi,Raycaster:()=>M0,RectAreaLight:()=>Bo,RedFormat:()=>tl,RedIntegerFormat:()=>aa,ReinhardToneMapping:()=>jr,RenderObjectRefreshType:()=>Vp,RenderTarget:()=>vr,RenderTarget3D:()=>_0,RepeatWrapping:()=>ds,ReplaceStencilOp:()=>mp,ReverseSubtractEquation:()=>yh,RingGeometry:()=>vo,SIGNED_R11_EAC_Format:()=>dl,SIGNED_RED_GREEN_RGTC2_Format:()=>Ll,SIGNED_RED_RGTC1_Format:()=>Dl,SIGNED_RG11_EAC_Format:()=>fl,SRGBColorSpace:()=>Kt,SRGBTransfer:()=>ot,Scene:()=>Bi,ShaderChunk:()=>je,ShaderLib:()=>Wn,ShaderMaterial:()=>ct,ShadowMaterial:()=>To,Shape:()=>_i,ShapeGeometry:()=>Fr,ShapePath:()=>V0,ShapeUtils:()=>Tn,ShortType:()=>j0,Skeleton:()=>Qa,SkeletonHelper:()=>R0,SkinnedMesh:()=>ja,Source:()=>zc,Sphere:()=>Ut,SphereGeometry:()=>Hi,Spherical:()=>T0,SphericalHarmonics3:()=>qr,SplineCurve:()=>Dr,SpotLight:()=>Wr,SpotLightHelper:()=>C0,Sprite:()=>Ka,SpriteMaterial:()=>Mr,SrcAlphaFactor:()=>Z0,SrcAlphaSaturateFactor:()=>Ph,SrcColorFactor:()=>Th,StaticCopyUsage:()=>Lp,StaticDrawUsage:()=>Ol,StaticReadUsage:()=>Pp,StereoCamera:()=>d0,StreamCopyUsage:()=>Np,StreamDrawUsage:()=>Rp,StreamReadUsage:()=>Dp,StringKeyframeTrack:()=>ti,SubtractEquation:()=>vh,SubtractiveBlending:()=>q0,TOUCH:()=>$f,TangentSpaceNormalMap:()=>ii,TetrahedronGeometry:()=>yo,Texture:()=>At,TextureLoader:()=>l0,TextureSource:()=>bn,TextureUtils:()=>G0,Timer:()=>Is,TimestampQuery:()=>Op,TorusGeometry:()=>So,TorusKnotGeometry:()=>Mo,Triangle:()=>On,TriangleFanDrawMode:()=>lp,TriangleStripDrawMode:()=>op,TrianglesDrawMode:()=>ap,TubeGeometry:()=>Or,UVMapping:()=>$o,Uint16BufferAttribute:()=>yr,Uint32BufferAttribute:()=>Sr,Uint8BufferAttribute:()=>Wc,Uint8ClampedBufferAttribute:()=>Xc,Uniform:()=>x0,UniformsGroup:()=>v0,UniformsLib:()=>pe,UniformsUtils:()=>en,UnsignedByteType:()=>ln,UnsignedInt101111Type:()=>eu,UnsignedInt248Type:()=>Fs,UnsignedInt5999Type:()=>Q0,UnsignedIntType:()=>vn,UnsignedShort4444Type:()=>Qo,UnsignedShort5551Type:()=>el,UnsignedShortType:()=>Ns,VSMShadowMap:()=>Ds,Vector2:()=>ee,Vector3:()=>R,Vector4:()=>ut,VectorKeyframeTrack:()=>Hr,VideoFrameTexture:()=>$c,VideoTexture:()=>io,WebGL3DRenderTarget:()=>Vc,WebGLArrayRenderTarget:()=>kc,WebGLCoordinateSystem:()=>hn,WebGLCubeRenderTarget:()=>Vl,WebGLRenderTarget:()=>yt,WebGLRenderer:()=>Hl,WebGLUtils:()=>Im,WebGPUCoordinateSystem:()=>Fi,WebXRController:()=>_s,WireframeGeometry:()=>bo,WrapAroundEnding:()=>pr,ZeroCurvatureEnding:()=>Ui,ZeroFactor:()=>bh,ZeroSlopeEnding:()=>Ni,ZeroStencilOp:()=>pp,createCanvasElement:()=>Kh,error:()=>De,getConsoleFunction:()=>Wp,log:()=>xr,setConsoleFunction:()=>Gp,warn:()=>de,warnOnce:()=>Kn});function Em(){let s=null,e=!1,t=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function $_(s){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,d=c.byteLength,h=s.createBuffer();s.bindBuffer(l,h),s.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let u=l.array,d=l.updateRanges;if(s.bindBuffer(c,o),d.length===0)s.bufferSubData(c,0,u);else{d.sort((f,p)=>f.start-p.start);let h=0;for(let f=1;f<d.length;f++){let p=d[h],_=d[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++h,d[h]=_)}d.length=h+1;for(let f=0,p=d.length;f<p;f++){let _=d[f];s.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}function Lv(s,e,t,n,i,r){let a=new le(0),o=i===!0?0:1,l,c,u=null,d=0,h=null;function f(y){let M=y.isScene===!0?y.background:null;if(M&&M.isTexture){let x=y.backgroundBlurriness>0;M=e.get(M,x)}return M}function p(y){let M=!1,x=f(y);x===null?g(a,o):x&&x.isColor&&(g(x,1),M=!0);let E=s.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function _(y,M){let x=f(M);x&&(x.isCubeTexture||x.mapping===Ls)?(c===void 0&&(c=new mt(new mi(1,1,1),new ct({name:"BackgroundCubeMaterial",uniforms:Os(Wn.backgroundCube.uniforms),vertexShader:Wn.backgroundCube.vertexShader,fragmentShader:Wn.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Dv.makeRotationFromEuler(M.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(wm),c.material.toneMapped=et.getTransfer(x.colorSpace)!==ot,(u!==x||d!==x.version||h!==s.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,h=s.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new mt(new Qn(2,2),new ct({name:"BackgroundMaterial",uniforms:Os(Wn.background.uniforms),vertexShader:Wn.background.vertexShader,fragmentShader:Wn.background.fragmentShader,side:vi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=et.getTransfer(x.colorSpace)!==ot,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||h!==s.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,h=s.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function g(y,M){y.getRGB(ou,ed(s)),t.buffers.color.setClear(ou.r,ou.g,ou.b,M,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,M=1){a.set(y),o=M,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,g(a,o)},render:p,addToRenderList:_,dispose:m}}function Uv(s,e){let t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=h(null),r=i,a=!1;function o(I,F,z,L,B){let Y=!1,X=d(I,L,z,F);r!==X&&(r=X,c(r.object)),Y=f(I,L,z,B),Y&&p(I,L,z,B),B!==null&&e.update(B,s.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,x(I,F,z,L),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return s.createVertexArray()}function c(I){return s.bindVertexArray(I)}function u(I){return s.deleteVertexArray(I)}function d(I,F,z,L){let B=L.wireframe===!0,Y=n[F.id];Y===void 0&&(Y={},n[F.id]=Y);let X=I.isInstancedMesh===!0?I.id:0,Z=Y[X];Z===void 0&&(Z={},Y[X]=Z);let G=Z[z.id];G===void 0&&(G={},Z[z.id]=G);let J=G[B];return J===void 0&&(J=h(l()),G[B]=J),J}function h(I){let F=[],z=[],L=[];for(let B=0;B<t;B++)F[B]=0,z[B]=0,L[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:z,attributeDivisors:L,object:I,attributes:{},index:null}}function f(I,F,z,L){let B=r.attributes,Y=F.attributes,X=0,Z=z.getAttributes();for(let G in Z)if(Z[G].location>=0){let Q=B[G],we=Y[G];if(we===void 0&&(G==="instanceMatrix"&&I.instanceMatrix&&(we=I.instanceMatrix),G==="instanceColor"&&I.instanceColor&&(we=I.instanceColor)),Q===void 0||Q.attribute!==we||we&&Q.data!==we.data)return!0;X++}return r.attributesNum!==X||r.index!==L}function p(I,F,z,L){let B={},Y=F.attributes,X=0,Z=z.getAttributes();for(let G in Z)if(Z[G].location>=0){let Q=Y[G];Q===void 0&&(G==="instanceMatrix"&&I.instanceMatrix&&(Q=I.instanceMatrix),G==="instanceColor"&&I.instanceColor&&(Q=I.instanceColor));let we={};we.attribute=Q,Q&&Q.data&&(we.data=Q.data),B[G]=we,X++}r.attributes=B,r.attributesNum=X,r.index=L}function _(){let I=r.newAttributes;for(let F=0,z=I.length;F<z;F++)I[F]=0}function g(I){m(I,0)}function m(I,F){let z=r.newAttributes,L=r.enabledAttributes,B=r.attributeDivisors;z[I]=1,L[I]===0&&(s.enableVertexAttribArray(I),L[I]=1),B[I]!==F&&(s.vertexAttribDivisor(I,F),B[I]=F)}function y(){let I=r.newAttributes,F=r.enabledAttributes;for(let z=0,L=F.length;z<L;z++)F[z]!==I[z]&&(s.disableVertexAttribArray(z),F[z]=0)}function M(I,F,z,L,B,Y,X){X===!0?s.vertexAttribIPointer(I,F,z,B,Y):s.vertexAttribPointer(I,F,z,L,B,Y)}function x(I,F,z,L){_();let B=L.attributes,Y=z.getAttributes(),X=F.defaultAttributeValues;for(let Z in Y){let G=Y[Z];if(G.location>=0){let J=B[Z];if(J===void 0&&(Z==="instanceMatrix"&&I.instanceMatrix&&(J=I.instanceMatrix),Z==="instanceColor"&&I.instanceColor&&(J=I.instanceColor)),J!==void 0){let Q=J.normalized,we=J.itemSize,Ee=e.get(J);if(Ee===void 0)continue;let tt=Ee.buffer,qe=Ee.type,Je=Ee.bytesPerElement,q=qe===s.INT||qe===s.UNSIGNED_INT||J.gpuType===jo;if(J.isInterleavedBufferAttribute){let te=J.data,fe=te.stride,Oe=J.offset;if(te.isInstancedInterleavedBuffer){for(let be=0;be<G.locationSize;be++)m(G.location+be,te.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let be=0;be<G.locationSize;be++)g(G.location+be);s.bindBuffer(s.ARRAY_BUFFER,tt);for(let be=0;be<G.locationSize;be++)M(G.location+be,we/G.locationSize,qe,Q,fe*Je,(Oe+we/G.locationSize*be)*Je,q)}else{if(J.isInstancedBufferAttribute){for(let te=0;te<G.locationSize;te++)m(G.location+te,J.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let te=0;te<G.locationSize;te++)g(G.location+te);s.bindBuffer(s.ARRAY_BUFFER,tt);for(let te=0;te<G.locationSize;te++)M(G.location+te,we/G.locationSize,qe,Q,we*Je,we/G.locationSize*te*Je,q)}}else if(X!==void 0){let Q=X[Z];if(Q!==void 0)switch(Q.length){case 2:s.vertexAttrib2fv(G.location,Q);break;case 3:s.vertexAttrib3fv(G.location,Q);break;case 4:s.vertexAttrib4fv(G.location,Q);break;default:s.vertexAttrib1fv(G.location,Q)}}}}y()}function E(){w();for(let I in n){let F=n[I];for(let z in F){let L=F[z];for(let B in L){let Y=L[B];for(let X in Y)u(Y[X].object),delete Y[X];delete L[B]}}delete n[I]}}function T(I){if(n[I.id]===void 0)return;let F=n[I.id];for(let z in F){let L=F[z];for(let B in L){let Y=L[B];for(let X in Y)u(Y[X].object),delete Y[X];delete L[B]}}delete n[I.id]}function A(I){for(let F in n){let z=n[F];for(let L in z){let B=z[L];if(B[I.id]===void 0)continue;let Y=B[I.id];for(let X in Y)u(Y[X].object),delete Y[X];delete B[I.id]}}}function v(I){for(let F in n){let z=n[F],L=I.isInstancedMesh===!0?I.id:0,B=z[L];if(B!==void 0){for(let Y in B){let X=B[Y];for(let Z in X)u(X[Z].object),delete X[Z];delete B[Y]}delete z[L],Object.keys(z).length===0&&delete n[F]}}}function w(){P(),a=!0,r!==i&&(r=i,c(r.object))}function P(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:w,resetDefaultState:P,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:v,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:g,disableUnusedAttributes:y}}function Nv(s,e,t){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(s.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];t.update(h,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Fv(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(A){return!(A!==jt&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let v=A===Ct&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==ln&&A!==$t&&!v&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(de("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&de("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),y=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),M=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=s.getParameter(s.MAX_SAMPLES),T=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:x,maxSamples:E,samples:T}}function Ov(s){let e=this,t=null,n=0,i=!1,r=!1,a=new Mn,o=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||n!==0||i;return i=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){let p=d.clippingPlanes,_=d.clipIntersection,g=d.clipShadows,m=s.get(d);if(!i||p===null||p.length===0||r&&!g)r?u(null):c();else{let y=r?0:n,M=y*4,x=m.clippingState||null;l.value=x,x=u(p,h,M,f);for(let E=0;E!==M;++E)x[E]=t[E];m.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,f,p){let _=d!==null?d.length:0,g=null;if(_!==0){if(g=l.value,p!==!0||g===null){let m=f+_*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<m)&&(g=new Float32Array(m));for(let M=0,x=f;M!==_;++M,x+=4)a.copy(d[M]).applyMatrix4(y,o),a.normal.toArray(g,x),g[x+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function Hv(s){let e=[],t=[],n=s,i=s-pa+1+Bv;for(let r=0;r<i;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,h=6,f=3,p=new Float32Array(f*h*d),_=new Float32Array(f*h*d);for(let m=0;m<d;m++){let y=m%3*2/3-1,M=m>2?0:-1,x=[y,M,0,y+2/3,M,0,y+2/3,M+1,0,y,M,0,y+2/3,M+1,0,y,M+1,0];p.set(x,f*h*m);for(let E=0;E<h;E++){let T=u[E*2]*2-1,A=u[E*2+1]*2-1;m===0?Bs.set(1,A,T):m===1?Bs.set(-T,1,-A):m===2?Bs.set(-T,A,1):m===3?Bs.set(-1,A,-T):m===4?Bs.set(-T,-1,A):Bs.set(T,A,-1),Bs.toArray(_,(m*h+E)*f)}}let g=new We;g.setAttribute("position",new rt(p,f)),g.setAttribute("outputDirection",new rt(_,f)),t.push(new mt(g,null)),n>pa&&n--}return{lodMeshes:t,sizeLods:e}}function rm(s,e,t){let n=new yt(s,e,t);return n.texture.mapping=Ls,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fa(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Gv(s,e,t){return new ct({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:kv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:cu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:on,depthTest:!1,depthWrite:!1})}function Wv(s,e,t){return new ct({name:"SphericalGaussianBlur",defines:{SAMPLES:zv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:cu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:on,depthTest:!1,depthWrite:!1})}function am(){return new ct({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:cu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:on,depthTest:!1,depthWrite:!1})}function om(){return new ct({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:on,depthTest:!1,depthWrite:!1})}function cu(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}function Xv(s){let e=new WeakMap,t=new WeakMap,n=null;function i(h,f=!1){return h==null?null:f?a(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===ia||f===sa)if(e.has(h)){let p=e.get(h).texture;return o(p,h.mapping)}else{let p=h.image;if(p&&p.height>0){let _=new Vl(p.height);return _.fromEquirectangularTexture(s,h),e.set(h,_),h.addEventListener("dispose",c),o(_.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let f=h.mapping,p=f===ia||f===sa,_=f===Hn||f===yi;if(p||_){let g=t.get(h),m=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==m)return n===null&&(n=new zs(s)),g=p?n.fromEquirectangular(h,g):n.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),g.texture;if(g!==void 0)return g.texture;{let y=h.image;return p&&y&&y.height>0||_&&y&&l(y)?(n===null&&(n=new zs(s)),g=p?n.fromEquirectangular(h):n.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function o(h,f){return f===ia?h.mapping=Hn:f===sa&&(h.mapping=yi),h}function l(h){let f=0,p=6;for(let _=0;_<p;_++)h[_]!==void 0&&f++;return f===p}function c(h){let f=h.target;f.removeEventListener("dispose",c);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function qv(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&Kn("WebGLRenderer: "+n+" extension not supported."),i}}}function Yv(s,e,t,n){let i={},r=new WeakMap;function a(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let p in h.attributes)e.remove(h.attributes[p]);h.removeEventListener("dispose",a),delete i[h.id];let f=r.get(h);f&&(e.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(d,h){return i[h.id]===!0||(h.addEventListener("dispose",a),i[h.id]=!0,t.memory.geometries++),h}function l(d){let h=d.attributes;for(let f in h)e.update(h[f],s.ARRAY_BUFFER)}function c(d){let h=[],f=d.index,p=d.attributes.position,_=0;if(p===void 0)return;if(f!==null){let y=f.array;_=f.version;for(let M=0,x=y.length;M<x;M+=3){let E=y[M+0],T=y[M+1],A=y[M+2];h.push(E,T,T,A,A,E)}}else{let y=p.array;_=p.version;for(let M=0,x=y.length/3-1;M<x;M+=3){let E=M+0,T=M+1,A=M+2;h.push(E,T,T,A,A,E)}}let g=new(p.count>=65535?Sr:yr)(h,1);g.version=_;let m=r.get(d);m&&e.remove(m),r.set(d,g)}function u(d){let h=r.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function Zv(s,e,t){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,h){s.drawElements(n,h,r,d*a),t.update(h,n,1)}function c(d,h,f){f!==0&&(s.drawElementsInstanced(n,h,r,d*a,f),t.update(h,n,f))}function u(d,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,f);let _=0;for(let g=0;g<f;g++)_+=h[g];t.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Jv(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:De("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Kv(s,e,t){let n=new WeakMap,i=new ut;function r(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==d){let w=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();let f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],M=0;f===!0&&(M=1),p===!0&&(M=2),_===!0&&(M=3);let x=o.attributes.position.count*M,E=1;x>e.maxTextureSize&&(E=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let T=new Float32Array(x*E*4*d),A=new ps(T,x,E,d);A.type=$t,A.needsUpdate=!0;let v=M*4;for(let P=0;P<d;P++){let I=g[P],F=m[P],z=y[P],L=x*E*4*P;for(let B=0;B<I.count;B++){let Y=B*v;f===!0&&(i.fromBufferAttribute(I,B),T[L+Y+0]=i.x,T[L+Y+1]=i.y,T[L+Y+2]=i.z,T[L+Y+3]=0),p===!0&&(i.fromBufferAttribute(F,B),T[L+Y+4]=i.x,T[L+Y+5]=i.y,T[L+Y+6]=i.z,T[L+Y+7]=0),_===!0&&(i.fromBufferAttribute(z,B),T[L+Y+8]=i.x,T[L+Y+9]=i.y,T[L+Y+10]=i.z,T[L+Y+11]=z.itemSize===4?i.w:1)}}h={count:d,texture:A,size:new ee(x,E)},n.set(o,h),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let p=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",h.size)}return{update:r}}function $v(s,e,t,n,i){let r=new WeakMap;function a(c){let u=i.render.frame,d=c.geometry,h=e.get(c,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function o(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}function Qv(s,e,t,n,i,r){let a=new yt(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new We;c.setAttribute("position",new Me([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Me([0,2,0,0,2,0],2));let u=new Gi({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new mt(c,u),h=new An(-1,1,1,-1,0,1),f=null,p=null,_=!1,g,m=null,y=[],M=!1;this.setSize=function(x,E){a.setSize(x,E),o!==null&&o.setSize(x,E),l!==null&&l.setSize(x,E);for(let T=0;T<y.length;T++){let A=y[T];A.setSize&&A.setSize(x,E)}},this.setEffects=function(x){y=x,M=y.length>0&&y[0].isRenderPass===!0;let E=a.width,T=a.height;y.length>0&&o===null&&(o=new yt(E,T,{type:Ct,depthBuffer:!1,stencilBuffer:!1}),l=new yt(E,T,{type:Ct,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<y.length;A++){let v=y[A];v.setSize&&v.setSize(E,T)}},this.begin=function(x,E){if(_||x.toneMapping===Rn&&y.length===0)return!1;if(m=E,E!==null){let T=E.width,A=E.height;(a.width!==T||a.height!==A)&&this.setSize(T,A)}return M===!1&&x.setRenderTarget(a),g=x.toneMapping,x.toneMapping=Rn,!0},this.hasRenderPass=function(){return M},this.end=function(x,E){x.toneMapping=g,_=!0;let T=a,A=o;for(let v=0;v<y.length;v++){let w=y[v];w.enabled!==!1&&(w.render(x,A,T,E),w.needsSwap!==!1&&(T=A,A=A===o?l:o))}if(f!==x.outputColorSpace||p!==x.toneMapping){f=x.outputColorSpace,p=x.toneMapping,u.defines={},et.getTransfer(f)===ot&&(u.defines.SRGB_TRANSFER="");let v=jv[p];v&&(u.defines[v]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,x.setRenderTarget(m),x.render(d,h),m=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}function ga(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=lm[i];if(r===void 0&&(r=new Float32Array(i),lm[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Ot(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Bt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function uu(s,e){let t=cm[e];t===void 0&&(t=new Int32Array(e),cm[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function e9(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function t9(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;s.uniform2fv(this.addr,e),Bt(t,e)}}function n9(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ot(t,e))return;s.uniform3fv(this.addr,e),Bt(t,e)}}function i9(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;s.uniform4fv(this.addr,e),Bt(t,e)}}function s9(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ot(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Bt(t,e)}else{if(Ot(t,n))return;dm.set(n),s.uniformMatrix2fv(this.addr,!1,dm),Bt(t,n)}}function r9(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ot(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Bt(t,e)}else{if(Ot(t,n))return;hm.set(n),s.uniformMatrix3fv(this.addr,!1,hm),Bt(t,n)}}function a9(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ot(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Bt(t,e)}else{if(Ot(t,n))return;um.set(n),s.uniformMatrix4fv(this.addr,!1,um),Bt(t,n)}}function o9(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function l9(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;s.uniform2iv(this.addr,e),Bt(t,e)}}function c9(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ot(t,e))return;s.uniform3iv(this.addr,e),Bt(t,e)}}function u9(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;s.uniform4iv(this.addr,e),Bt(t,e)}}function h9(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function d9(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;s.uniform2uiv(this.addr,e),Bt(t,e)}}function f9(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ot(t,e))return;s.uniform3uiv(this.addr,e),Bt(t,e)}}function p9(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;s.uniform4uiv(this.addr,e),Bt(t,e)}}function m9(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(gd.compareFunction=t.isReversedDepthBuffer()?Fl:Nl,r=gd):r=Am,t.setTexture2D(e||r,i)}function g9(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Rm,i)}function _9(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Pm,i)}function x9(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Cm,i)}function v9(s){switch(s){case 5126:return e9;case 35664:return t9;case 35665:return n9;case 35666:return i9;case 35674:return s9;case 35675:return r9;case 35676:return a9;case 5124:case 35670:return o9;case 35667:case 35671:return l9;case 35668:case 35672:return c9;case 35669:case 35673:return u9;case 5125:return h9;case 36294:return d9;case 36295:return f9;case 36296:return p9;case 35678:case 36198:case 36298:case 36306:case 35682:return m9;case 35679:case 36299:case 36307:return g9;case 35680:case 36300:case 36308:case 36293:return _9;case 36289:case 36303:case 36311:case 36292:return x9}}function y9(s,e){s.uniform1fv(this.addr,e)}function S9(s,e){let t=ga(e,this.size,2);s.uniform2fv(this.addr,t)}function M9(s,e){let t=ga(e,this.size,3);s.uniform3fv(this.addr,t)}function b9(s,e){let t=ga(e,this.size,4);s.uniform4fv(this.addr,t)}function T9(s,e){let t=ga(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function E9(s,e){let t=ga(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function w9(s,e){let t=ga(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function A9(s,e){s.uniform1iv(this.addr,e)}function C9(s,e){s.uniform2iv(this.addr,e)}function R9(s,e){s.uniform3iv(this.addr,e)}function P9(s,e){s.uniform4iv(this.addr,e)}function I9(s,e){s.uniform1uiv(this.addr,e)}function D9(s,e){s.uniform2uiv(this.addr,e)}function L9(s,e){s.uniform3uiv(this.addr,e)}function U9(s,e){s.uniform4uiv(this.addr,e)}function N9(s,e,t){let n=this.cache,i=e.length,r=uu(t,i);Ot(n,r)||(s.uniform1iv(this.addr,r),Bt(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=gd:a=Am;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function F9(s,e,t){let n=this.cache,i=e.length,r=uu(t,i);Ot(n,r)||(s.uniform1iv(this.addr,r),Bt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Rm,r[a])}function O9(s,e,t){let n=this.cache,i=e.length,r=uu(t,i);Ot(n,r)||(s.uniform1iv(this.addr,r),Bt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Pm,r[a])}function B9(s,e,t){let n=this.cache,i=e.length,r=uu(t,i);Ot(n,r)||(s.uniform1iv(this.addr,r),Bt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Cm,r[a])}function z9(s){switch(s){case 5126:return y9;case 35664:return S9;case 35665:return M9;case 35666:return b9;case 35674:return T9;case 35675:return E9;case 35676:return w9;case 5124:case 35670:return A9;case 35667:case 35671:return C9;case 35668:case 35672:return R9;case 35669:case 35673:return P9;case 5125:return I9;case 36294:return D9;case 36295:return L9;case 36296:return U9;case 35678:case 36198:case 36298:case 36306:case 35682:return N9;case 35679:case 36299:case 36307:return F9;case 35680:case 36300:case 36308:case 36293:return O9;case 36289:case 36303:case 36311:case 36292:return B9}}function fm(s,e){s.seq.push(e),s.map[e.id]=e}function k9(s,e,t){let n=s.name,i=n.length;for(pd.lastIndex=0;;){let r=pd.exec(n),a=pd.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){fm(t,c===void 0?new _d(o,s,e):new xd(o,s,e));break}else{let d=t.map[o];d===void 0&&(d=new vd(o),fm(t,d)),t=d}}}function pm(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}function G9(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function W9(s){et._getMatrix(mm,et.workingColorSpace,s);let e=`mat3( ${mm.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(s)){case gr:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return de("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function gm(s,e,t){let n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+G9(s.getShaderSource(e),o)}else return r}function X9(s,e){let t=W9(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Y9(s,e){let t=q9[e];return t===void 0?(de("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Z9(){et.getLuminanceCoefficients(lu);let s=lu.x.toFixed(4),e=lu.y.toFixed(4),t=lu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function J9(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(kl).join(`
`)}function K9(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function $9(s,e){let t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),a=r.name,o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function kl(s){return s!==""}function _m(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function xm(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function yd(s){return s.replace(j9,ey)}function ey(s,e){let t=je[e];if(t===void 0){let n=Q9.get(e);if(n!==void 0)t=je[n],de('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return yd(t)}function vm(s){return s.replace(ty,ny)}function ny(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function ym(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function sy(s){return iy[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}function ay(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":ry[s.envMapMode]||"ENVMAP_TYPE_CUBE"}function ly(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":oy[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}function uy(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":cy[s.combine]||"ENVMAP_BLENDING_NONE"}function hy(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function dy(s,e,t,n){let i=s.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=sy(t),c=ay(t),u=ly(t),d=uy(t),h=hy(t),f=J9(t),p=K9(r),_=i.createProgram(),g,m,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(kl).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(kl).join(`
`),m.length>0&&(m+=`
`)):(g=[ym(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(kl).join(`
`),m=[ym(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Rn?"#define TONE_MAPPING":"",t.toneMapping!==Rn?je.tonemapping_pars_fragment:"",t.toneMapping!==Rn?Y9("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,X9("linearToOutputTexel",t.outputColorSpace),Z9(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(kl).join(`
`)),a=yd(a),a=_m(a,t),a=xm(a,t),o=yd(o),o=_m(o,t),o=xm(o,t),a=vm(a),o=vm(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===ru?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ru?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let M=y+g+a,x=y+m+o,E=pm(i,i.VERTEX_SHADER,M),T=pm(i,i.FRAGMENT_SHADER,x);i.attachShader(_,E),i.attachShader(_,T),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function A(I){if(s.debug.checkShaderErrors){let F=i.getProgramInfoLog(_)||"",z=i.getShaderInfoLog(E)||"",L=i.getShaderInfoLog(T)||"",B=F.trim(),Y=z.trim(),X=L.trim(),Z=!0,G=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,E,T);else{let J=gm(i,E,"vertex"),Q=gm(i,T,"fragment");De("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+B+`
`+J+`
`+Q)}else B!==""?de("WebGLProgram: Program Info Log:",B):(Y===""||X==="")&&(G=!1);G&&(I.diagnostics={runnable:Z,programLog:B,vertexShader:{log:Y,prefix:g},fragmentShader:{log:X,prefix:m}})}i.deleteShader(E),i.deleteShader(T),v=new ma(i,_),w=$9(i,_)}let v;this.getUniforms=function(){return v===void 0&&A(this),v};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=i.getProgramParameter(_,V9)),P},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=H9++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=T,this}function py(s){return s===Mi||s===ha||s===da}function my(s,e,t,n,i,r){let a=new gs,o=new Sd,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer,h=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return l.add(v),v===0?"uv":`uv${v}`}function _(v,w,P,I,F,z){let L=I.fog,B=F.geometry,Y=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?I.environment:null,X=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,Z=e.get(v.envMap||Y,X),G=Z&&Z.mapping===Ls?Z.image.height:null,J=f[v.type];v.precision!==null&&(h=n.getMaxPrecision(v.precision),h!==v.precision&&de("WebGLProgram.getParameters:",v.precision,"not supported, using",h,"instead."));let Q=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,we=Q!==void 0?Q.length:0,Ee=0;B.morphAttributes.position!==void 0&&(Ee=1),B.morphAttributes.normal!==void 0&&(Ee=2),B.morphAttributes.color!==void 0&&(Ee=3);let tt,qe,Je,q;if(J){let St=Wn[J];tt=St.vertexShader,qe=St.fragmentShader}else{tt=v.vertexShader,qe=v.fragmentShader;let St=o.getVertexShaderStage(v),dt=o.getFragmentShaderStage(v);o.update(v,St,dt),Je=St.id,q=dt.id}let te=s.getRenderTarget(),fe=s.state.buffers.depth.getReversed(),Oe=F.isInstancedMesh===!0,be=F.isBatchedMesh===!0,ze=!!v.map,st=!!v.matcap,$=!!Z,se=!!v.aoMap,ae=!!v.lightMap,oe=!!v.bumpMap&&v.wireframe===!1,he=!!v.normalMap,ke=!!v.displacementMap,Be=!!v.emissiveMap,Xe=!!v.metalnessMap,Ze=!!v.roughnessMap,D=v.anisotropy>0,ht=v.clearcoat>0,nt=v.dispersion>0,C=v.retroreflectivity>0,S=v.iridescence>0,O=v.sheen>0,H=v.transmission>0,K=D&&!!v.anisotropyMap,ce=ht&&!!v.clearcoatMap,ue=ht&&!!v.clearcoatNormalMap,j=ht&&!!v.clearcoatRoughnessMap,ie=S&&!!v.iridescenceMap,me=S&&!!v.iridescenceThicknessMap,Ue=O&&!!v.sheenColorMap,ve=O&&!!v.sheenRoughnessMap,ge=!!v.specularMap,Ne=!!v.specularColorMap,Ve=!!v.specularIntensityMap,Ke=H&&!!v.transmissionMap,N=H&&!!v.thicknessMap,_e=!!v.gradientMap,ne=!!v.alphaMap,xe=v.alphaTest>0,Te=!!v.alphaHash,re=!!v.extensions,Fe=Rn;v.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Fe=s.toneMapping);let Ie={shaderID:J,shaderType:v.type,shaderName:v.name,vertexShader:tt,fragmentShader:qe,defines:v.defines,customVertexShaderID:Je,customFragmentShaderID:q,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:h,batching:be,batchingColor:be&&F._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&F.instanceColor!==null,instancingMorph:Oe&&F.morphTexture!==null,outputColorSpace:te===null?s.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:ze,matcap:st,envMap:$,envMapMode:$&&Z.mapping,envMapCubeUVHeight:G,aoMap:se,lightMap:ae,bumpMap:oe,normalMap:he,displacementMap:ke,emissiveMap:Be,normalMapObjectSpace:he&&v.normalMapType===Hh,normalMapTangentSpace:he&&v.normalMapType===ii,packedNormalMap:he&&v.normalMapType===ii&&py(v.normalMap.format),metalnessMap:Xe,roughnessMap:Ze,anisotropy:D,anisotropyMap:K,clearcoat:ht,clearcoatMap:ce,clearcoatNormalMap:ue,clearcoatRoughnessMap:j,dispersion:nt,retroreflection:C,iridescence:S,iridescenceMap:ie,iridescenceThicknessMap:me,sheen:O,sheenColorMap:Ue,sheenRoughnessMap:ve,specularMap:ge,specularColorMap:Ne,specularIntensityMap:Ve,transmission:H,transmissionMap:Ke,thicknessMap:N,gradientMap:_e,opaque:v.transparent===!1&&v.blending===Zi&&v.alphaToCoverage===!1,alphaMap:ne,alphaTest:xe,alphaHash:Te,combine:v.combine,mapUv:ze&&p(v.map.channel),aoMapUv:se&&p(v.aoMap.channel),lightMapUv:ae&&p(v.lightMap.channel),bumpMapUv:oe&&p(v.bumpMap.channel),normalMapUv:he&&p(v.normalMap.channel),displacementMapUv:ke&&p(v.displacementMap.channel),emissiveMapUv:Be&&p(v.emissiveMap.channel),metalnessMapUv:Xe&&p(v.metalnessMap.channel),roughnessMapUv:Ze&&p(v.roughnessMap.channel),anisotropyMapUv:K&&p(v.anisotropyMap.channel),clearcoatMapUv:ce&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:ue&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:me&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:ve&&p(v.sheenRoughnessMap.channel),specularMapUv:ge&&p(v.specularMap.channel),specularColorMapUv:Ne&&p(v.specularColorMap.channel),specularIntensityMapUv:Ve&&p(v.specularIntensityMap.channel),transmissionMapUv:Ke&&p(v.transmissionMap.channel),thicknessMapUv:N&&p(v.thicknessMap.channel),alphaMapUv:ne&&p(v.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(he||D),vertexNormals:!!B.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!B.attributes.uv&&(ze||ne),fog:!!L,useFog:v.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||B.attributes.normal===void 0&&he===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:fe,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:Ee,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:Fe,decodeVideoTexture:ze&&v.map.isVideoTexture===!0&&et.getTransfer(v.map.colorSpace)===ot,decodeVideoTextureEmissive:Be&&v.emissiveMap.isVideoTexture===!0&&et.getTransfer(v.emissiveMap.colorSpace)===ot,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Cn,flipSided:v.side===Gt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:re&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&v.extensions.multiDraw===!0||be)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Ie.vertexUv1s=l.has(1),Ie.vertexUv2s=l.has(2),Ie.vertexUv3s=l.has(3),l.clear(),Ie}function g(v){let w=[];if(v.shaderID?w.push(v.shaderID):(w.push(v.customVertexShaderID),w.push(v.customFragmentShaderID)),v.defines!==void 0)for(let P in v.defines)w.push(P),w.push(v.defines[P]);return v.isRawShaderMaterial===!1&&(m(w,v),y(w,v),w.push(s.outputColorSpace)),w.push(v.customProgramCacheKey),w.join()}function m(v,w){v.push(w.precision),v.push(w.outputColorSpace),v.push(w.envMapMode),v.push(w.envMapCubeUVHeight),v.push(w.mapUv),v.push(w.alphaMapUv),v.push(w.lightMapUv),v.push(w.aoMapUv),v.push(w.bumpMapUv),v.push(w.normalMapUv),v.push(w.displacementMapUv),v.push(w.emissiveMapUv),v.push(w.metalnessMapUv),v.push(w.roughnessMapUv),v.push(w.anisotropyMapUv),v.push(w.clearcoatMapUv),v.push(w.clearcoatNormalMapUv),v.push(w.clearcoatRoughnessMapUv),v.push(w.iridescenceMapUv),v.push(w.iridescenceThicknessMapUv),v.push(w.sheenColorMapUv),v.push(w.sheenRoughnessMapUv),v.push(w.specularMapUv),v.push(w.specularColorMapUv),v.push(w.specularIntensityMapUv),v.push(w.transmissionMapUv),v.push(w.thicknessMapUv),v.push(w.combine),v.push(w.fogExp2),v.push(w.sizeAttenuation),v.push(w.morphTargetsCount),v.push(w.morphAttributeCount),v.push(w.numSunLights),v.push(w.numDirLights),v.push(w.numPointLights),v.push(w.numSpotLights),v.push(w.numSpotLightMaps),v.push(w.numHemiLights),v.push(w.numRectAreaLights),v.push(w.numSunLightShadows),v.push(w.numDirLightShadows),v.push(w.numPointLightShadows),v.push(w.numSpotLightShadows),v.push(w.numSpotLightShadowsWithMaps),v.push(w.numLightProbes),v.push(w.shadowMapType),v.push(w.toneMapping),v.push(w.numClippingPlanes),v.push(w.numClipIntersection),v.push(w.depthPacking)}function y(v,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function M(v){let w=f[v.type],P;if(w){let I=Wn[w];P=en.clone(I.uniforms)}else P=v.uniforms;return P}function x(v,w){let P=u.get(w);return P!==void 0?++P.usedTimes:(P=new dy(s,w,v,i),c.push(P),u.set(w,P)),P}function E(v){if(--v.usedTimes===0){let w=c.indexOf(v);c[w]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function T(v){o.remove(v)}function A(){o.dispose()}return{getParameters:_,getProgramCacheKey:g,getUniforms:M,acquireProgram:x,releaseProgram:E,releaseShaderCache:T,programs:c,dispose:A}}function gy(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function _y(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function Sm(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Mm(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function o(h,f,p,_,g,m){let y=s[e];return y===void 0?(y={id:h.id,object:h,geometry:f,material:p,materialVariant:a(h),groupOrder:_,renderOrder:h.renderOrder,z:g,group:m},s[e]=y):(y.id=h.id,y.object=h,y.geometry=f,y.material=p,y.materialVariant=a(h),y.groupOrder=_,y.renderOrder=h.renderOrder,y.z=g,y.group=m),e++,y}function l(h,f,p,_,g,m,y){y.reversedDepth===!0&&(g=-g);let M=o(h,f,p,_,g,m);p.transmission>0?n.push(M):p.transparent===!0?i.push(M):t.push(M)}function c(h,f,p,_,g,m){let y=o(h,f,p,_,g,m);p.transmission>0?n.unshift(y):p.transparent===!0?i.unshift(y):t.unshift(y)}function u(h,f){t.length>1&&t.sort(h||_y),n.length>1&&n.sort(f||Sm),i.length>1&&i.sort(f||Sm)}function d(){for(let h=e,f=s.length;h<f;h++){let p=s[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:d,sort:u}}function xy(){let s=new WeakMap;function e(n,i){let r=s.get(n),a;return r===void 0?(a=new Mm,s.set(n,[a])):i>=r.length?(a=new Mm,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function vy(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new R,color:new le};break;case"SpotLight":t={position:new R,direction:new R,color:new le,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new le,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new le,groundColor:new le};break;case"RectAreaLight":t={color:new le,position:new R,halfWidth:new R,halfHeight:new R};break}return s[e.id]=t,t}}}function yy(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}function My(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function by(s){let e=new vy,t=yy(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);let i=new R,r=new Ge,a=new Ge;function o(c){let u=0,d=0,h=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let f=0,p=0,_=0,g=0,m=0,y=0,M=0,x=0,E=0,T=0,A=0,v=0,w=0,P=0;c.sort(My);for(let F=0,z=c.length;F<z;F++){let L=c[F],B=L.color,Y=L.intensity,X=L.distance,Z=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Mi?Z=L.shadow.map.texture:Z=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=B.r*Y,d+=B.g*Y,h+=B.b*Y;else if(L.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(L.sh.coefficients[G],Y);P++}else if(L.isSunLight){let G=e.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let J=L.shadow,Q=t.get(L);Q.shadowIntensity=J.intensity,Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize.copy(J.mapSize).multiply(J.getFrameExtents()),n.sunShadow[p]=Q,n.sunShadowMap[p]=Z;let we=J.getViewportCount();for(let Ee=0;Ee<we;Ee++)n.sunShadowMatrix[_+Ee]=J.getMatrix(Ee),n.sunShadowCascade[_+Ee]=J._cascadeData[Ee];_+=we,p++}n.sun[f]=G,f++}else if(L.isDirectionalLight){let G=e.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let J=L.shadow,Q=t.get(L);Q.shadowIntensity=J.intensity,Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize=J.mapSize,n.directionalShadow[g]=Q,n.directionalShadowMap[g]=Z,n.directionalShadowMatrix[g]=L.shadow.matrix,E++}n.directional[g]=G,g++}else if(L.isSpotLight){let G=e.get(L);G.position.setFromMatrixPosition(L.matrixWorld),G.color.copy(B).multiplyScalar(Y),G.distance=X,G.coneCos=Math.cos(L.angle),G.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),G.decay=L.decay,n.spot[y]=G;let J=L.shadow;if(L.map&&(n.spotLightMap[v]=L.map,v++,J.updateMatrices(L),L.castShadow&&w++),n.spotLightMatrix[y]=J.matrix,L.castShadow){let Q=t.get(L);Q.shadowIntensity=J.intensity,Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize=J.mapSize,n.spotShadow[y]=Q,n.spotShadowMap[y]=Z,A++}y++}else if(L.isRectAreaLight){let G=e.get(L);G.color.copy(B).multiplyScalar(Y),G.halfWidth.set(L.width*.5,0,0),G.halfHeight.set(0,L.height*.5,0),n.rectArea[M]=G,M++}else if(L.isPointLight){let G=e.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),G.distance=L.distance,G.decay=L.decay,L.castShadow){let J=L.shadow,Q=t.get(L);Q.shadowIntensity=J.intensity,Q.shadowBias=J.bias,Q.shadowNormalBias=J.normalBias,Q.shadowRadius=J.radius,Q.shadowMapSize=J.mapSize,Q.shadowCameraNear=J.camera.near,Q.shadowCameraFar=J.camera.far,n.pointShadow[m]=Q,n.pointShadowMap[m]=Z,n.pointShadowMatrix[m]=L.shadow.matrix,T++}n.point[m]=G,m++}else if(L.isHemisphereLight){let G=e.get(L);G.skyColor.copy(L.color).multiplyScalar(Y),G.groundColor.copy(L.groundColor).multiplyScalar(Y),n.hemi[x]=G,x++}}M>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let I=n.hash;(I.sunLength!==f||I.directionalLength!==g||I.pointLength!==m||I.spotLength!==y||I.rectAreaLength!==M||I.hemiLength!==x||I.numSunShadows!==p||I.numDirectionalShadows!==E||I.numPointShadows!==T||I.numSpotShadows!==A||I.numSpotMaps!==v||I.numLightProbes!==P)&&(n.sun.length=f,n.directional.length=g,n.spot.length=y,n.rectArea.length=M,n.point.length=m,n.hemi.length=x,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=A,n.spotShadowMap.length=A,n.spotLightMatrix.length=A+v-w,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=P,I.sunLength=f,I.directionalLength=g,I.pointLength=m,I.spotLength=y,I.rectAreaLength=M,I.hemiLength=x,I.numSunShadows=p,I.numDirectionalShadows=E,I.numPointShadows=T,I.numSpotShadows=A,I.numSpotMaps=v,I.numLightProbes=P,n.version=Sy++)}function l(c,u){let d=0,h=0,f=0,p=0,_=0,g=0,m=u.matrixWorldInverse;for(let y=0,M=c.length;y<M;y++){let x=c[y];if(x.isSunLight){let E=n.sun[d];E.direction.setFromMatrixPosition(x.matrixWorld),E.direction.transformDirection(m),d++}else if(x.isDirectionalLight){let E=n.directional[h];E.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(m),h++}else if(x.isSpotLight){let E=n.spot[p];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(m),p++}else if(x.isRectAreaLight){let E=n.rectArea[_];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(m),a.identity(),r.copy(x.matrixWorld),r.premultiply(m),a.extractRotation(r),E.halfWidth.set(x.width*.5,0,0),E.halfHeight.set(0,x.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),_++}else if(x.isPointLight){let E=n.point[f];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(m),f++}else if(x.isHemisphereLight){let E=n.hemi[g];E.direction.setFromMatrixPosition(x.matrixWorld),E.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:n}}function bm(s){let e=new by(s),t=[],n=[],i=[];function r(h){d.camera=h,t.length=0,n.length=0,i.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){i.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Ty(s){let e=new WeakMap;function t(i,r=0){let a=e.get(i),o;return a===void 0?(o=new bm(s),e.set(i,[o])):r>=a.length?(o=new bm(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}function Ry(s,e,t){let n=new jn,i=new ee,r=new ee,a=new ut,o=new Wi,l=new zr,c={},u=t.maxTextureSize,d={[vi]:Gt,[Gt]:vi,[Cn]:Cn},h=new ct({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ee},radius:{value:4}},vertexShader:Ey,fragmentShader:wy}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let p=new We;p.setAttribute("position",new rt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new mt(p,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yi;let m=this.type;this.render=function(T,A,v){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===xh&&(de("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Yi);let w=s.getRenderTarget(),P=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),F=s.state;F.setBlending(on),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let z=m!==this.type;z&&A.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(B=>B.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,B=T.length;L<B;L++){let Y=T[L],X=Y.shadow;if(X===void 0){de("WebGLShadowMap:",Y,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);let Z=X.getFrameExtents();i.multiply(Z),r.copy(X.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/Z.x),i.x=r.x*Z.x,X.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/Z.y),i.y=r.y*Z.y,X.mapSize.y=r.y));let G=s.state.buffers.depth.getReversed();if(X.camera._reversedDepth=G,X.map===null||z===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===Ds){if(Y.isPointLight){de("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new yt(i.x,i.y,{format:Mi,type:Ct,minFilter:xt,magFilter:xt,generateMipmaps:!1}),X.map.texture.name=Y.name+".shadowMap",X.map.depthTexture=new pi(i.x,i.y,$t),X.map.depthTexture.name=Y.name+".shadowMapDepth",X.map.depthTexture.format=zn,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Tt,X.map.depthTexture.magFilter=Tt}else Y.isPointLight?(X.map=new Vl(i.x),X.map.depthTexture=new so(i.x,vn)):(X.map=new yt(i.x,i.y),X.map.depthTexture=new pi(i.x,i.y,vn)),X.map.depthTexture.name=Y.name+".shadowMap",X.map.depthTexture.format=zn,this.type===Yi?(X.map.depthTexture.compareFunction=G?Fl:Nl,X.map.depthTexture.minFilter=xt,X.map.depthTexture.magFilter=xt):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Tt,X.map.depthTexture.magFilter=Tt);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==i.x||X.map.height!==i.y)&&X.map.setSize(i.x,i.y);let J=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();Y.isPointLight!==!0&&X.updateMatrices(Y,v);for(let Q=0;Q<J;Q++){let we=X.getCamera(Q);if(Y.isPointLight){let Ee=X.camera,tt=X.matrix,qe=Y.distance||Ee.far;qe!==Ee.far&&(Ee.far=qe,Ee.updateProjectionMatrix()),zl.setFromMatrixPosition(Y.matrixWorld),Ee.position.copy(zl),md.copy(Ee.position),md.add(Ay[Q]),Ee.up.copy(Cy[Q]),Ee.lookAt(md),Ee.updateMatrixWorld(),tt.makeTranslation(-zl.x,-zl.y,-zl.z),Tm.multiplyMatrices(Ee.projectionMatrix,Ee.matrixWorldInverse),X._frustum.setFromProjectionMatrix(Tm,Ee.coordinateSystem,Ee.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)s.setRenderTarget(X.map,Q),s.clear();else{Q===0&&(s.setRenderTarget(X.map),s.clear());let Ee=X.getViewport(Q);a.set(r.x*Ee.x,r.y*Ee.y,r.x*Ee.z,r.y*Ee.w),F.viewport(a)}n=X.getFrustum(Q),x(A,v,we,Y,this.type)}X.isPointLightShadow!==!0&&this.type===Ds&&y(X,v),X.needsUpdate=!1}m=this.type,g.needsUpdate=!1,s.setRenderTarget(w,P,I)};function y(T,A){let v=e.update(_);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new yt(i.x,i.y,{format:Mi,type:Ct}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(A,null,v,h,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(A,null,v,f,_,null)}function M(T,A,v,w){let P=null,I=v.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)P=I;else if(P=v.isPointLight===!0?l:o,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let F=P.uuid,z=A.uuid,L=c[F];L===void 0&&(L={},c[F]=L);let B=L[z];B===void 0&&(B=P.clone(),L[z]=B,A.addEventListener("dispose",E)),P=B}if(P.visible=A.visible,P.wireframe=A.wireframe,w===Ds?P.side=A.shadowSide!==null?A.shadowSide:A.side:P.side=A.shadowSide!==null?A.shadowSide:d[A.side],P.alphaMap=A.alphaMap,P.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,P.map=A.map,P.clipShadows=A.clipShadows,P.clippingPlanes=A.clippingPlanes,P.clipIntersection=A.clipIntersection,P.displacementMap=A.displacementMap,P.displacementScale=A.displacementScale,P.displacementBias=A.displacementBias,P.wireframeLinewidth=A.wireframeLinewidth,P.linewidth=A.linewidth,v.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let F=s.properties.get(P);F.light=v}return P}function x(T,A,v,w,P){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&P===Ds)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,T.matrixWorld);let z=e.update(T),L=T.material;if(Array.isArray(L)){let B=z.groups;for(let Y=0,X=B.length;Y<X;Y++){let Z=B[Y],G=L[Z.materialIndex];if(G&&G.visible){let J=M(T,G,w,P);T.onBeforeShadow(s,T,A,v,z,J,Z),s.renderBufferDirect(v,null,z,J,T,Z),T.onAfterShadow(s,T,A,v,z,J,Z)}}}else if(L.visible){let B=M(T,L,w,P);T.onBeforeShadow(s,T,A,v,z,B,null),s.renderBufferDirect(v,null,z,B,T,null),T.onAfterShadow(s,T,A,v,z,B,null)}}let F=T.children;for(let z=0,L=F.length;z<L;z++)x(F[z],A,v,w,P)}function E(T){T.target.removeEventListener("dispose",E);for(let v in c){let w=c[v],P=T.target.uuid;P in w&&(w[P].dispose(),delete w[P])}}}function Py(s,e){function t(){let N=!1,_e=new ut,ne=null,xe=new ut(0,0,0,0);return{setMask:function(Te){ne!==Te&&!N&&(s.colorMask(Te,Te,Te,Te),ne=Te)},setLocked:function(Te){N=Te},setClear:function(Te,re,Fe,Ie,St){St===!0&&(Te*=Ie,re*=Ie,Fe*=Ie),_e.set(Te,re,Fe,Ie),xe.equals(_e)===!1&&(s.clearColor(Te,re,Fe,Ie),xe.copy(_e))},reset:function(){N=!1,ne=null,xe.set(-1,0,0,0)}}}function n(){let N=!1,_e=!1,ne=null,xe=null,Te=null;return{setReversed:function(re){if(_e!==re){let Fe=e.get("EXT_clip_control");re?Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.ZERO_TO_ONE_EXT):Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.NEGATIVE_ONE_TO_ONE_EXT),_e=re;let Ie=Te;Te=null,this.setClear(Ie)}},getReversed:function(){return _e},setTest:function(re){re?te(s.DEPTH_TEST):fe(s.DEPTH_TEST)},setMask:function(re){ne!==re&&!N&&(s.depthMask(re),ne=re)},setFunc:function(re){if(_e&&(re=Yp[re]),xe!==re){switch(re){case za:s.depthFunc(s.NEVER);break;case ka:s.depthFunc(s.ALWAYS);break;case Va:s.depthFunc(s.LESS);break;case hs:s.depthFunc(s.LEQUAL);break;case Ha:s.depthFunc(s.EQUAL);break;case Ga:s.depthFunc(s.GEQUAL);break;case Wa:s.depthFunc(s.GREATER);break;case Xa:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xe=re}},setLocked:function(re){N=re},setClear:function(re){Te!==re&&(Te=re,_e&&(re=1-re),s.clearDepth(re))},reset:function(){N=!1,ne=null,xe=null,Te=null,_e=!1}}}function i(){let N=!1,_e=null,ne=null,xe=null,Te=null,re=null,Fe=null,Ie=null,St=null;return{setTest:function(dt){N||(dt?te(s.STENCIL_TEST):fe(s.STENCIL_TEST))},setMask:function(dt){_e!==dt&&!N&&(s.stencilMask(dt),_e=dt)},setFunc:function(dt,Dn,qn){(ne!==dt||xe!==Dn||Te!==qn)&&(s.stencilFunc(dt,Dn,qn),ne=dt,xe=Dn,Te=qn)},setOp:function(dt,Dn,qn){(re!==dt||Fe!==Dn||Ie!==qn)&&(s.stencilOp(dt,Dn,qn),re=dt,Fe=Dn,Ie=qn)},setLocked:function(dt){N=dt},setClear:function(dt){St!==dt&&(s.clearStencil(dt),St=dt)},reset:function(){N=!1,_e=null,ne=null,xe=null,Te=null,re=null,Fe=null,Ie=null,St=null}}}let r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap,u={},d={},h={},f=new WeakMap,p=[],_=null,g=!1,m=null,y=null,M=null,x=null,E=null,T=null,A=null,v=new le(0,0,0),w=0,P=!1,I=null,F=null,z=null,L=null,B=null,Y=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),X=!1,Z=0,G=s.getParameter(s.VERSION);G.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(G)[1]),X=Z>=1):G.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),X=Z>=2);let J=null,Q={},we=s.getParameter(s.SCISSOR_BOX),Ee=s.getParameter(s.VIEWPORT),tt=new ut().fromArray(we),qe=new ut().fromArray(Ee);function Je(N,_e,ne,xe){let Te=new Uint8Array(4),re=s.createTexture();s.bindTexture(N,re),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Fe=0;Fe<ne;Fe++)N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY?s.texImage3D(_e,0,s.RGBA,1,1,xe,0,s.RGBA,s.UNSIGNED_BYTE,Te):s.texImage2D(_e+Fe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Te);return re}let q={};q[s.TEXTURE_2D]=Je(s.TEXTURE_2D,s.TEXTURE_2D,1),q[s.TEXTURE_CUBE_MAP]=Je(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[s.TEXTURE_2D_ARRAY]=Je(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),q[s.TEXTURE_3D]=Je(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(s.DEPTH_TEST),a.setFunc(hs),oe(!1),he(X0),te(s.CULL_FACE),se(on);function te(N){u[N]!==!0&&(s.enable(N),u[N]=!0)}function fe(N){u[N]!==!1&&(s.disable(N),u[N]=!1)}function Oe(N,_e){return h[N]!==_e?(s.bindFramebuffer(N,_e),h[N]=_e,N===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=_e),N===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=_e),!0):!1}function be(N,_e){let ne=p,xe=!1;if(N){ne=f.get(_e),ne===void 0&&(ne=[],f.set(_e,ne));let Te=N.textures;if(ne.length!==Te.length||ne[0]!==s.COLOR_ATTACHMENT0){for(let re=0,Fe=Te.length;re<Fe;re++)ne[re]=s.COLOR_ATTACHMENT0+re;ne.length=Te.length,xe=!0}}else ne[0]!==s.BACK&&(ne[0]=s.BACK,xe=!0);xe&&s.drawBuffers(ne)}function ze(N){return _!==N?(s.useProgram(N),_=N,!0):!1}let st={[ni]:s.FUNC_ADD,[vh]:s.FUNC_SUBTRACT,[yh]:s.FUNC_REVERSE_SUBTRACT};st[Sh]=s.MIN,st[Mh]=s.MAX;let $={[bh]:s.ZERO,[Jr]:s.ONE,[Th]:s.SRC_COLOR,[Z0]:s.SRC_ALPHA,[Ph]:s.SRC_ALPHA_SATURATE,[Ch]:s.DST_COLOR,[wh]:s.DST_ALPHA,[Eh]:s.ONE_MINUS_SRC_COLOR,[J0]:s.ONE_MINUS_SRC_ALPHA,[Rh]:s.ONE_MINUS_DST_COLOR,[Ah]:s.ONE_MINUS_DST_ALPHA,[Ih]:s.CONSTANT_COLOR,[Dh]:s.ONE_MINUS_CONSTANT_COLOR,[Lh]:s.CONSTANT_ALPHA,[Uh]:s.ONE_MINUS_CONSTANT_ALPHA};function se(N,_e,ne,xe,Te,re,Fe,Ie,St,dt){if(N===on){g===!0&&(fe(s.BLEND),g=!1);return}if(g===!1&&(te(s.BLEND),g=!0),N!==Ko){if(N!==m||dt!==P){if((y!==ni||E!==ni)&&(s.blendEquation(s.FUNC_ADD),y=ni,E=ni),dt)switch(N){case Zi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ji:s.blendFunc(s.ONE,s.ONE);break;case q0:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Y0:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:De("WebGLState: Invalid blending: ",N);break}else switch(N){case Zi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ji:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case q0:De("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Y0:De("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:De("WebGLState: Invalid blending: ",N);break}M=null,x=null,T=null,A=null,v.set(0,0,0),w=0,m=N,P=dt}return}Te=Te||_e,re=re||ne,Fe=Fe||xe,(_e!==y||Te!==E)&&(s.blendEquationSeparate(st[_e],st[Te]),y=_e,E=Te),(ne!==M||xe!==x||re!==T||Fe!==A)&&(s.blendFuncSeparate($[ne],$[xe],$[re],$[Fe]),M=ne,x=xe,T=re,A=Fe),(Ie.equals(v)===!1||St!==w)&&(s.blendColor(Ie.r,Ie.g,Ie.b,St),v.copy(Ie),w=St),m=N,P=!1}function ae(N,_e){N.side===Cn?fe(s.CULL_FACE):te(s.CULL_FACE);let ne=N.side===Gt;_e&&(ne=!ne),oe(ne),N.blending===Zi&&N.transparent===!1?se(on):se(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);let xe=N.stencilWrite;o.setTest(xe),xe&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Be(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?te(s.SAMPLE_ALPHA_TO_COVERAGE):fe(s.SAMPLE_ALPHA_TO_COVERAGE)}function oe(N){I!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),I=N)}function he(N){N!==gh?(te(s.CULL_FACE),N!==F&&(N===X0?s.cullFace(s.BACK):N===_h?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):fe(s.CULL_FACE),F=N}function ke(N){N!==z&&(X&&s.lineWidth(N),z=N)}function Be(N,_e,ne){N?(te(s.POLYGON_OFFSET_FILL),(L!==_e||B!==ne)&&(L=_e,B=ne,a.getReversed()&&(_e=-_e),s.polygonOffset(_e,ne))):fe(s.POLYGON_OFFSET_FILL)}function Xe(N){N?te(s.SCISSOR_TEST):fe(s.SCISSOR_TEST)}function Ze(N){N===void 0&&(N=s.TEXTURE0+Y-1),J!==N&&(s.activeTexture(N),J=N)}function D(N,_e,ne){ne===void 0&&(J===null?ne=s.TEXTURE0+Y-1:ne=J);let xe=Q[ne];xe===void 0&&(xe={type:void 0,texture:void 0},Q[ne]=xe),(xe.type!==N||xe.texture!==_e)&&(J!==ne&&(s.activeTexture(ne),J=ne),s.bindTexture(N,_e||q[N]),xe.type=N,xe.texture=_e)}function ht(){let N=Q[J];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function nt(){try{s.compressedTexImage2D(...arguments)}catch(N){De("WebGLState:",N)}}function C(){try{s.compressedTexImage3D(...arguments)}catch(N){De("WebGLState:",N)}}function S(){try{s.texSubImage2D(...arguments)}catch(N){De("WebGLState:",N)}}function O(){try{s.texSubImage3D(...arguments)}catch(N){De("WebGLState:",N)}}function H(){try{s.compressedTexSubImage2D(...arguments)}catch(N){De("WebGLState:",N)}}function K(){try{s.compressedTexSubImage3D(...arguments)}catch(N){De("WebGLState:",N)}}function ce(){try{s.texStorage2D(...arguments)}catch(N){De("WebGLState:",N)}}function ue(){try{s.texStorage3D(...arguments)}catch(N){De("WebGLState:",N)}}function j(){try{s.texImage2D(...arguments)}catch(N){De("WebGLState:",N)}}function ie(){try{s.texImage3D(...arguments)}catch(N){De("WebGLState:",N)}}function me(N){return d[N]!==void 0?d[N]:s.getParameter(N)}function Ue(N,_e){d[N]!==_e&&(s.pixelStorei(N,_e),d[N]=_e)}function ve(N){tt.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),tt.copy(N))}function ge(N){qe.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),qe.copy(N))}function Ne(N,_e){let ne=c.get(_e);ne===void 0&&(ne=new WeakMap,c.set(_e,ne));let xe=ne.get(N);xe===void 0&&(xe=s.getUniformBlockIndex(_e,N.name),ne.set(N,xe))}function Ve(N,_e){let xe=c.get(_e).get(N);l.get(_e)!==xe&&(s.uniformBlockBinding(_e,xe,N.__bindingPointIndex),l.set(_e,xe))}function Ke(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),u={},d={},J=null,Q={},h={},f=new WeakMap,p=[],_=null,g=!1,m=null,y=null,M=null,x=null,E=null,T=null,A=null,v=new le(0,0,0),w=0,P=!1,I=null,F=null,z=null,L=null,B=null,tt.set(0,0,s.canvas.width,s.canvas.height),qe.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:fe,bindFramebuffer:Oe,drawBuffers:be,useProgram:ze,setBlending:se,setMaterial:ae,setFlipSided:oe,setCullFace:he,setLineWidth:ke,setPolygonOffset:Be,setScissorTest:Xe,activeTexture:Ze,bindTexture:D,unbindTexture:ht,compressedTexImage2D:nt,compressedTexImage3D:C,texImage2D:j,texImage3D:ie,pixelStorei:Ue,getParameter:me,updateUBOMapping:Ne,uniformBlockBinding:Ve,texStorage2D:ce,texStorage3D:ue,texSubImage2D:S,texSubImage3D:O,compressedTexSubImage2D:H,compressedTexSubImage3D:K,scissor:ve,viewport:ge,reset:Ke}}function Iy(s,e,t,n,i,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ee,u=new WeakMap,d=new Set,h,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,S){return p?new OffscreenCanvas(C,S):_r("canvas")}function g(C,S,O){let H=1,K=nt(C);if((K.width>O||K.height>O)&&(H=O/Math.max(K.width,K.height)),H<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let ce=Math.floor(H*K.width),ue=Math.floor(H*K.height);h===void 0&&(h=_(ce,ue));let j=S?_(ce,ue):h;return j.width=ce,j.height=ue,j.getContext("2d").drawImage(C,0,0,ce,ue),de("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ce+"x"+ue+")."),j}else return"data"in C&&de("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),C;return C}function m(C){return C.generateMipmaps}function y(C){s.generateMipmap(C)}function M(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function x(C,S,O,H,K,ce=!1){if(C!==null){if(s[C]!==void 0)return s[C];de("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ue;H&&(ue=e.get("EXT_texture_norm16"),ue||de("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=S;if(S===s.RED&&(O===s.FLOAT&&(j=s.R32F),O===s.HALF_FLOAT&&(j=s.R16F),O===s.UNSIGNED_BYTE&&(j=s.R8),O===s.UNSIGNED_SHORT&&ue&&(j=ue.R16_EXT),O===s.SHORT&&ue&&(j=ue.R16_SNORM_EXT)),S===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(j=s.R8UI),O===s.UNSIGNED_SHORT&&(j=s.R16UI),O===s.UNSIGNED_INT&&(j=s.R32UI),O===s.BYTE&&(j=s.R8I),O===s.SHORT&&(j=s.R16I),O===s.INT&&(j=s.R32I)),S===s.RG&&(O===s.FLOAT&&(j=s.RG32F),O===s.HALF_FLOAT&&(j=s.RG16F),O===s.UNSIGNED_BYTE&&(j=s.RG8),O===s.UNSIGNED_SHORT&&ue&&(j=ue.RG16_EXT),O===s.SHORT&&ue&&(j=ue.RG16_SNORM_EXT)),S===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(j=s.RG8UI),O===s.UNSIGNED_SHORT&&(j=s.RG16UI),O===s.UNSIGNED_INT&&(j=s.RG32UI),O===s.BYTE&&(j=s.RG8I),O===s.SHORT&&(j=s.RG16I),O===s.INT&&(j=s.RG32I)),S===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(j=s.RGB8UI),O===s.UNSIGNED_SHORT&&(j=s.RGB16UI),O===s.UNSIGNED_INT&&(j=s.RGB32UI),O===s.BYTE&&(j=s.RGB8I),O===s.SHORT&&(j=s.RGB16I),O===s.INT&&(j=s.RGB32I)),S===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(j=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(j=s.RGBA16UI),O===s.UNSIGNED_INT&&(j=s.RGBA32UI),O===s.BYTE&&(j=s.RGBA8I),O===s.SHORT&&(j=s.RGBA16I),O===s.INT&&(j=s.RGBA32I)),S===s.RGB&&(O===s.UNSIGNED_SHORT&&ue&&(j=ue.RGB16_EXT),O===s.SHORT&&ue&&(j=ue.RGB16_SNORM_EXT),O===s.UNSIGNED_INT_5_9_9_9_REV&&(j=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&(j=s.R11F_G11F_B10F)),S===s.RGBA){let ie=ce?gr:et.getTransfer(K);O===s.FLOAT&&(j=s.RGBA32F),O===s.HALF_FLOAT&&(j=s.RGBA16F),O===s.UNSIGNED_BYTE&&(j=ie===ot?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT&&ue&&(j=ue.RGBA16_EXT),O===s.SHORT&&ue&&(j=ue.RGBA16_SNORM_EXT),O===s.UNSIGNED_SHORT_4_4_4_4&&(j=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(j=s.RGB5_A1)}return(j===s.R16F||j===s.R32F||j===s.RG16F||j===s.RG32F||j===s.RGBA16F||j===s.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function E(C,S){let O;return C?S===null||S===vn||S===Fs?O=s.DEPTH24_STENCIL8:S===$t?O=s.DEPTH32F_STENCIL8:S===Ns&&(O=s.DEPTH24_STENCIL8,de("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===vn||S===Fs?O=s.DEPTH_COMPONENT24:S===$t?O=s.DEPTH_COMPONENT32F:S===Ns&&(O=s.DEPTH_COMPONENT16),O}function T(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Tt&&C.minFilter!==xt?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function A(C){let S=C.target;S.removeEventListener("dispose",A),w(S),S.isVideoTexture&&u.delete(S),S.isHTMLTexture&&d.delete(S)}function v(C){let S=C.target;S.removeEventListener("dispose",v),I(S)}function w(C){let S=n.get(C);if(S.__webglInit===void 0)return;let O=C.source,H=f.get(O);if(H){let K=H[S.__cacheKey];K.usedTimes--,K.usedTimes===0&&P(C),Object.keys(H).length===0&&f.delete(O)}n.remove(C)}function P(C){let S=n.get(C);s.deleteTexture(S.__webglTexture);let O=C.source,H=f.get(O);delete H[S.__cacheKey],a.memory.textures--}function I(C){let S=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(S.__webglFramebuffer[H]))for(let K=0;K<S.__webglFramebuffer[H].length;K++)s.deleteFramebuffer(S.__webglFramebuffer[H][K]);else s.deleteFramebuffer(S.__webglFramebuffer[H]);S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer[H])}else{if(Array.isArray(S.__webglFramebuffer))for(let H=0;H<S.__webglFramebuffer.length;H++)s.deleteFramebuffer(S.__webglFramebuffer[H]);else s.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&s.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let H=0;H<S.__webglColorRenderbuffer.length;H++)S.__webglColorRenderbuffer[H]&&s.deleteRenderbuffer(S.__webglColorRenderbuffer[H]);S.__webglDepthRenderbuffer&&s.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let O=C.textures;for(let H=0,K=O.length;H<K;H++){let ce=n.get(O[H]);ce.__webglTexture&&(s.deleteTexture(ce.__webglTexture),a.memory.textures--),n.remove(O[H])}n.remove(C)}let F=0;function z(){F=0}function L(){return F}function B(C){F=C}function Y(){let C=F;return C>=i.maxTextures&&de("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+i.maxTextures),F+=1,C}function X(C){let S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function Z(C,S){let O=n.get(C);if(C.isVideoTexture&&D(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&O.__version!==C.version){let H=C.image;if(H===null)de("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)de("WebGLRenderer: Texture marked for update but image is incomplete");else{fe(O,C,S);return}}else C.isExternalTexture&&(O.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+S)}function G(C,S){let O=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){fe(O,C,S);return}else C.isExternalTexture&&(O.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+S)}function J(C,S){let O=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){fe(O,C,S);return}t.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+S)}function Q(C,S){let O=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&O.__version!==C.version){Oe(O,C,S);return}t.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+S)}let we={[ds]:s.REPEAT,[kt]:s.CLAMP_TO_EDGE,[dr]:s.MIRRORED_REPEAT},Ee={[Tt]:s.NEAREST,[K0]:s.NEAREST_MIPMAP_NEAREST,[Us]:s.NEAREST_MIPMAP_LINEAR,[xt]:s.LINEAR,[ra]:s.LINEAR_MIPMAP_NEAREST,[Gn]:s.LINEAR_MIPMAP_LINEAR},tt={[Wh]:s.NEVER,[Jh]:s.ALWAYS,[Xh]:s.LESS,[Nl]:s.LEQUAL,[qh]:s.EQUAL,[Fl]:s.GEQUAL,[Yh]:s.GREATER,[Zh]:s.NOTEQUAL};function qe(C,S){if(S.type===$t&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===xt||S.magFilter===ra||S.magFilter===Us||S.magFilter===Gn||S.minFilter===xt||S.minFilter===ra||S.minFilter===Us||S.minFilter===Gn)&&de("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,we[S.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,we[S.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,we[S.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,Ee[S.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,Ee[S.minFilter]),S.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,tt[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Tt||S.minFilter!==Us&&S.minFilter!==Gn||S.type===$t&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");s.texParameterf(C,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function Je(C,S){let O=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",A));let H=S.source,K=f.get(H);K===void 0&&(K={},f.set(H,K));let ce=X(S);if(ce!==C.__cacheKey){K[ce]===void 0&&(K[ce]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),K[ce].usedTimes++;let ue=K[C.__cacheKey];ue!==void 0&&(K[C.__cacheKey].usedTimes--,ue.usedTimes===0&&P(S)),C.__cacheKey=ce,C.__webglTexture=K[ce].texture}return O}function q(C,S,O){return Math.floor(Math.floor(C/O)/S)}function te(C,S,O,H){let ce=C.updateRanges;if(ce.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,S.width,S.height,O,H,S.data);else{ce.sort((Ue,ve)=>Ue.start-ve.start);let ue=0;for(let Ue=1;Ue<ce.length;Ue++){let ve=ce[ue],ge=ce[Ue],Ne=ve.start+ve.count,Ve=q(ge.start,S.width,4),Ke=q(ve.start,S.width,4);ge.start<=Ne+1&&Ve===Ke&&q(ge.start+ge.count-1,S.width,4)===Ve?ve.count=Math.max(ve.count,ge.start+ge.count-ve.start):(++ue,ce[ue]=ge)}ce.length=ue+1;let j=t.getParameter(s.UNPACK_ROW_LENGTH),ie=t.getParameter(s.UNPACK_SKIP_PIXELS),me=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,S.width);for(let Ue=0,ve=ce.length;Ue<ve;Ue++){let ge=ce[Ue],Ne=Math.floor(ge.start/4),Ve=Math.ceil(ge.count/4),Ke=Ne%S.width,N=Math.floor(Ne/S.width),_e=Ve,ne=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,Ke),t.pixelStorei(s.UNPACK_SKIP_ROWS,N),t.texSubImage2D(s.TEXTURE_2D,0,Ke,N,_e,ne,O,H,S.data)}C.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,j),t.pixelStorei(s.UNPACK_SKIP_PIXELS,ie),t.pixelStorei(s.UNPACK_SKIP_ROWS,me)}}function fe(C,S,O){let H=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(H=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(H=s.TEXTURE_3D);let K=Je(C,S),ce=S.source;t.bindTexture(H,C.__webglTexture,s.TEXTURE0+O);let ue=n.get(ce);if(ce.version!==ue.__version||K===!0){if(t.activeTexture(s.TEXTURE0+O),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){let ne=et.getPrimaries(et.workingColorSpace),xe=S.colorSpace===Pn?null:et.getPrimaries(S.colorSpace),Te=S.colorSpace===Pn||ne===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te)}t.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment);let ie=g(S.image,!1,i.maxTextureSize);ie=ht(S,ie);let me=r.convert(S.format,S.colorSpace),Ue=r.convert(S.type),ve=x(S.internalFormat,me,Ue,S.normalized,S.colorSpace,S.isVideoTexture);qe(H,S);let ge,Ne=S.mipmaps,Ve=S.isVideoTexture!==!0,Ke=ue.__version===void 0||K===!0,N=ce.dataReady,_e=T(S,ie);if(S.isDepthTexture)ve=E(S.format===Si,S.type),Ke&&(Ve?t.texStorage2D(s.TEXTURE_2D,1,ve,ie.width,ie.height):t.texImage2D(s.TEXTURE_2D,0,ve,ie.width,ie.height,0,me,Ue,null));else if(S.isDataTexture)if(Ne.length>0){Ve&&Ke&&t.texStorage2D(s.TEXTURE_2D,_e,ve,Ne[0].width,Ne[0].height);for(let ne=0,xe=Ne.length;ne<xe;ne++)ge=Ne[ne],Ve?N&&t.texSubImage2D(s.TEXTURE_2D,ne,0,0,ge.width,ge.height,me,Ue,ge.data):t.texImage2D(s.TEXTURE_2D,ne,ve,ge.width,ge.height,0,me,Ue,ge.data);S.generateMipmaps=!1}else Ve?(Ke&&t.texStorage2D(s.TEXTURE_2D,_e,ve,ie.width,ie.height),N&&te(S,ie,me,Ue)):t.texImage2D(s.TEXTURE_2D,0,ve,ie.width,ie.height,0,me,Ue,ie.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ve&&Ke&&t.texStorage3D(s.TEXTURE_2D_ARRAY,_e,ve,Ne[0].width,Ne[0].height,ie.depth);for(let ne=0,xe=Ne.length;ne<xe;ne++)if(ge=Ne[ne],S.format!==jt)if(me!==null)if(Ve){if(N)if(S.layerUpdates.size>0){let Te=au(ge.width,ge.height,S.format,S.type);for(let re of S.layerUpdates){let Fe=ge.data.subarray(re*Te/ge.data.BYTES_PER_ELEMENT,(re+1)*Te/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ne,0,0,re,ge.width,ge.height,1,me,Fe)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ne,0,0,0,ge.width,ge.height,ie.depth,me,ge.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ne,ve,ge.width,ge.height,ie.depth,0,ge.data,0,0);else de("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ve?N&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,ne,0,0,0,ge.width,ge.height,ie.depth,me,Ue,ge.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ne,ve,ge.width,ge.height,ie.depth,0,me,Ue,ge.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{Ve&&Ke&&t.texStorage2D(s.TEXTURE_2D,_e,ve,Ne[0].width,Ne[0].height);for(let ne=0,xe=Ne.length;ne<xe;ne++)ge=Ne[ne],S.format!==jt?me!==null?Ve?N&&t.compressedTexSubImage2D(s.TEXTURE_2D,ne,0,0,ge.width,ge.height,me,ge.data):t.compressedTexImage2D(s.TEXTURE_2D,ne,ve,ge.width,ge.height,0,ge.data):de("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ve?N&&t.texSubImage2D(s.TEXTURE_2D,ne,0,0,ge.width,ge.height,me,Ue,ge.data):t.texImage2D(s.TEXTURE_2D,ne,ve,ge.width,ge.height,0,me,Ue,ge.data)}else if(S.isDataArrayTexture)if(Ve){if(Ke&&t.texStorage3D(s.TEXTURE_2D_ARRAY,_e,ve,ie.width,ie.height,ie.depth),N)if(S.layerUpdates.size>0){let ne=au(ie.width,ie.height,S.format,S.type);for(let xe of S.layerUpdates){let Te=ie.data.subarray(xe*ne/ie.data.BYTES_PER_ELEMENT,(xe+1)*ne/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,xe,ie.width,ie.height,1,me,Ue,Te)}S.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,me,Ue,ie.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ve,ie.width,ie.height,ie.depth,0,me,Ue,ie.data);else if(S.isData3DTexture)Ve?(Ke&&t.texStorage3D(s.TEXTURE_3D,_e,ve,ie.width,ie.height,ie.depth),N&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,me,Ue,ie.data)):t.texImage3D(s.TEXTURE_3D,0,ve,ie.width,ie.height,ie.depth,0,me,Ue,ie.data);else if(S.isFramebufferTexture){if(Ke)if(Ve)t.texStorage2D(s.TEXTURE_2D,_e,ve,ie.width,ie.height);else{let ne=ie.width,xe=ie.height;for(let Te=0;Te<_e;Te++)t.texImage2D(s.TEXTURE_2D,Te,ve,ne,xe,0,me,Ue,null),ne>>=1,xe>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in s){let ne=s.canvas;if(ne.hasAttribute("layoutsubtree")||ne.setAttribute("layoutsubtree","true"),ie.parentNode!==ne){ne.appendChild(ie),d.add(S),ne.onpaint=xe=>{let Te=xe.changedElements;for(let re of d)Te.includes(re.image)&&(re.needsUpdate=!0)},ne.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,ie);else{let Te=s.RGBA,re=s.RGBA,Fe=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Te,re,Fe,ie)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ne.length>0){if(Ve&&Ke){let ne=nt(Ne[0]);t.texStorage2D(s.TEXTURE_2D,_e,ve,ne.width,ne.height)}for(let ne=0,xe=Ne.length;ne<xe;ne++)ge=Ne[ne],Ve?N&&t.texSubImage2D(s.TEXTURE_2D,ne,0,0,me,Ue,ge):t.texImage2D(s.TEXTURE_2D,ne,ve,me,Ue,ge);S.generateMipmaps=!1}else if(Ve){if(Ke){let ne=nt(ie);t.texStorage2D(s.TEXTURE_2D,_e,ve,ne.width,ne.height)}N&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,me,Ue,ie)}else t.texImage2D(s.TEXTURE_2D,0,ve,me,Ue,ie);m(S)&&y(H),ue.__version=ce.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function Oe(C,S,O){if(S.image.length!==6)return;let H=Je(C,S),K=S.source;t.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+O);let ce=n.get(K);if(K.version!==ce.__version||H===!0){t.activeTexture(s.TEXTURE0+O);let ue=et.getPrimaries(et.workingColorSpace),j=S.colorSpace===Pn?null:et.getPrimaries(S.colorSpace),ie=S.colorSpace===Pn||ue===j?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);let me=S.isCompressedTexture||S.image[0].isCompressedTexture,Ue=S.image[0]&&S.image[0].isDataTexture,ve=[];for(let re=0;re<6;re++)!me&&!Ue?ve[re]=g(S.image[re],!0,i.maxCubemapSize):ve[re]=Ue?S.image[re].image:S.image[re],ve[re]=ht(S,ve[re]);let ge=ve[0],Ne=r.convert(S.format,S.colorSpace),Ve=r.convert(S.type),Ke=x(S.internalFormat,Ne,Ve,S.normalized,S.colorSpace),N=S.isVideoTexture!==!0,_e=ce.__version===void 0||H===!0,ne=K.dataReady,xe=T(S,ge);qe(s.TEXTURE_CUBE_MAP,S);let Te;if(me){N&&_e&&t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,Ke,ge.width,ge.height);for(let re=0;re<6;re++){Te=ve[re].mipmaps;for(let Fe=0;Fe<Te.length;Fe++){let Ie=Te[Fe];S.format!==jt?Ne!==null?N?ne&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe,0,0,Ie.width,Ie.height,Ne,Ie.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe,Ke,Ie.width,Ie.height,0,Ie.data):de("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe,0,0,Ie.width,Ie.height,Ne,Ve,Ie.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe,Ke,Ie.width,Ie.height,0,Ne,Ve,Ie.data)}}}else{if(Te=S.mipmaps,N&&_e){Te.length>0&&xe++;let re=nt(ve[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,Ke,re.width,re.height)}for(let re=0;re<6;re++)if(Ue){N?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ve[re].width,ve[re].height,Ne,Ve,ve[re].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,ve[re].width,ve[re].height,0,Ne,Ve,ve[re].data);for(let Fe=0;Fe<Te.length;Fe++){let St=Te[Fe].image[re].image;N?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe+1,0,0,St.width,St.height,Ne,Ve,St.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe+1,Ke,St.width,St.height,0,Ne,Ve,St.data)}}else{N?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ne,Ve,ve[re]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,Ne,Ve,ve[re]);for(let Fe=0;Fe<Te.length;Fe++){let Ie=Te[Fe];N?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe+1,0,0,Ne,Ve,Ie.image[re]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe+1,Ke,Ne,Ve,Ie.image[re])}}}m(S)&&y(s.TEXTURE_CUBE_MAP),ce.__version=K.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function be(C,S,O,H,K,ce){let ue=r.convert(O.format,O.colorSpace),j=r.convert(O.type),ie=x(O.internalFormat,ue,j,O.normalized,O.colorSpace),me=n.get(S),Ue=n.get(O);if(Ue.__renderTarget=S,!me.__hasExternalTextures){let ve=Math.max(1,S.width>>ce),ge=Math.max(1,S.height>>ce);K===s.TEXTURE_3D||K===s.TEXTURE_2D_ARRAY?t.texImage3D(K,ce,ie,ve,ge,S.depth,0,ue,j,null):t.texImage2D(K,ce,ie,ve,ge,0,ue,j,null)}t.bindFramebuffer(s.FRAMEBUFFER,C),Ze(S)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,H,K,Ue.__webglTexture,0,Xe(S)):(K===s.TEXTURE_2D||K>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,H,K,Ue.__webglTexture,ce),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ze(C,S,O){if(s.bindRenderbuffer(s.RENDERBUFFER,C),S.depthBuffer){let H=S.depthTexture,K=H&&H.isDepthTexture?H.type:null,ce=E(S.stencilBuffer,K),ue=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Ze(S)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Xe(S),ce,S.width,S.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,Xe(S),ce,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,ce,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ue,s.RENDERBUFFER,C)}else{let H=S.textures;for(let K=0;K<H.length;K++){let ce=H[K],ue=r.convert(ce.format,ce.colorSpace),j=r.convert(ce.type),ie=x(ce.internalFormat,ue,j,ce.normalized,ce.colorSpace);Ze(S)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Xe(S),ie,S.width,S.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,Xe(S),ie,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,ie,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function st(C,S,O){let H=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let K=n.get(S.depthTexture);if(K.__renderTarget=S,(!K.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),H){if(K.__webglInit===void 0&&(K.__webglInit=!0,S.depthTexture.addEventListener("dispose",A)),K.__webglTexture===void 0){K.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture),qe(s.TEXTURE_CUBE_MAP,S.depthTexture);let me=r.convert(S.depthTexture.format),Ue=r.convert(S.depthTexture.type),ve;S.depthTexture.format===zn?ve=s.DEPTH_COMPONENT24:S.depthTexture.format===Si&&(ve=s.DEPTH24_STENCIL8);for(let ge=0;ge<6;ge++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,ve,S.width,S.height,0,me,Ue,null)}}else Z(S.depthTexture,0);let ce=K.__webglTexture,ue=Xe(S),j=H?s.TEXTURE_CUBE_MAP_POSITIVE_X+O:s.TEXTURE_2D,ie=S.depthTexture.format===Si?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(S.depthTexture.format===zn)Ze(S)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ie,j,ce,0,ue):s.framebufferTexture2D(s.FRAMEBUFFER,ie,j,ce,0);else if(S.depthTexture.format===Si)Ze(S)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ie,j,ce,0,ue):s.framebufferTexture2D(s.FRAMEBUFFER,ie,j,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function $(C){let S=n.get(C),O=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){let H=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),H){let K=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,H.removeEventListener("dispose",K)};H.addEventListener("dispose",K),S.__depthDisposeCallback=K}S.__boundDepthTexture=H}if(C.depthTexture&&!S.__autoAllocateDepthBuffer)if(O)for(let H=0;H<6;H++)st(S.__webglFramebuffer[H],C,H);else{let H=C.texture.mipmaps;H&&H.length>0?st(S.__webglFramebuffer[0],C,0):st(S.__webglFramebuffer,C,0)}else if(O){S.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[H]),S.__webglDepthbuffer[H]===void 0)S.__webglDepthbuffer[H]=s.createRenderbuffer(),ze(S.__webglDepthbuffer[H],C,!1);else{let K=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ce=S.__webglDepthbuffer[H];s.bindRenderbuffer(s.RENDERBUFFER,ce),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,ce)}}else{let H=C.texture.mipmaps;if(H&&H.length>0?t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=s.createRenderbuffer(),ze(S.__webglDepthbuffer,C,!1);else{let K=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ce=S.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ce),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,ce)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function se(C,S,O){let H=n.get(C);S!==void 0&&be(H.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&$(C)}function ae(C){let S=C.texture,O=n.get(C),H=n.get(S);C.addEventListener("dispose",v);let K=C.textures,ce=C.isWebGLCubeRenderTarget===!0,ue=K.length>1;if(ue||(H.__webglTexture===void 0&&(H.__webglTexture=s.createTexture()),H.__version=S.version,a.memory.textures++),ce){O.__webglFramebuffer=[];for(let j=0;j<6;j++)if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer[j]=[];for(let ie=0;ie<S.mipmaps.length;ie++)O.__webglFramebuffer[j][ie]=s.createFramebuffer()}else O.__webglFramebuffer[j]=s.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer=[];for(let j=0;j<S.mipmaps.length;j++)O.__webglFramebuffer[j]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(ue)for(let j=0,ie=K.length;j<ie;j++){let me=n.get(K[j]);me.__webglTexture===void 0&&(me.__webglTexture=s.createTexture(),a.memory.textures++)}if(C.samples>0&&Ze(C)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let j=0;j<K.length;j++){let ie=K[j];O.__webglColorRenderbuffer[j]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[j]);let me=r.convert(ie.format,ie.colorSpace),Ue=r.convert(ie.type),ve=x(ie.internalFormat,me,Ue,ie.normalized,ie.colorSpace,C.isXRRenderTarget===!0),ge=Xe(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,ge,ve,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+j,s.RENDERBUFFER,O.__webglColorRenderbuffer[j])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),ze(O.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ce){t.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture),qe(s.TEXTURE_CUBE_MAP,S);for(let j=0;j<6;j++)if(S.mipmaps&&S.mipmaps.length>0)for(let ie=0;ie<S.mipmaps.length;ie++)be(O.__webglFramebuffer[j][ie],C,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ie);else be(O.__webglFramebuffer[j],C,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);m(S)&&y(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ue){for(let j=0,ie=K.length;j<ie;j++){let me=K[j],Ue=n.get(me),ve=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ve=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ve,Ue.__webglTexture),qe(ve,me),be(O.__webglFramebuffer,C,me,s.COLOR_ATTACHMENT0+j,ve,0),m(me)&&y(ve)}t.unbindTexture()}else{let j=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(j=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(j,H.__webglTexture),qe(j,S),S.mipmaps&&S.mipmaps.length>0)for(let ie=0;ie<S.mipmaps.length;ie++)be(O.__webglFramebuffer[ie],C,S,s.COLOR_ATTACHMENT0,j,ie);else be(O.__webglFramebuffer,C,S,s.COLOR_ATTACHMENT0,j,0);m(S)&&y(j),t.unbindTexture()}C.depthBuffer&&$(C)}function oe(C){let S=C.textures;for(let O=0,H=S.length;O<H;O++){let K=S[O];if(m(K)){let ce=M(C),ue=n.get(K).__webglTexture;t.bindTexture(ce,ue),y(ce),t.unbindTexture()}}}let he=[],ke=[];function Be(C){if(C.samples>0){if(Ze(C)===!1){let S=C.textures,O=C.width,H=C.height,K=s.COLOR_BUFFER_BIT,ce=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ue=n.get(C),j=S.length>1;if(j)for(let me=0;me<S.length;me++)t.bindFramebuffer(s.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ue.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);let ie=C.texture.mipmaps;ie&&ie.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let me=0;me<S.length;me++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(K|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(K|=s.STENCIL_BUFFER_BIT)),j){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ue.__webglColorRenderbuffer[me]);let Ue=n.get(S[me]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ue,0)}s.blitFramebuffer(0,0,O,H,0,0,O,H,K,s.NEAREST),l===!0&&(he.length=0,ke.length=0,he.push(s.COLOR_ATTACHMENT0+me),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(he.push(ce),ke.push(ce),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ke)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),j)for(let me=0;me<S.length;me++){t.bindFramebuffer(s.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.RENDERBUFFER,ue.__webglColorRenderbuffer[me]);let Ue=n.get(S[me]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ue.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.TEXTURE_2D,Ue,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let S=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[S])}}}function Xe(C){return Math.min(i.maxSamples,C.samples)}function Ze(C){let S=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function D(C){let S=a.render.frame;u.get(C)!==S&&(u.set(C,S),C.update())}function ht(C,S){let O=C.colorSpace,H=C.format,K=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||O!==mr&&O!==Pn&&(et.getTransfer(O)===ot?(H!==jt||K!==ln)&&de("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):De("WebGLTextures: Unsupported texture color space:",O)),S}function nt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=Y,this.resetTextureUnits=z,this.getTextureUnits=L,this.setTextureUnits=B,this.setTexture2D=Z,this.setTexture2DArray=G,this.setTexture3D=J,this.setTextureCube=Q,this.rebindTextures=se,this.setupRenderTarget=ae,this.updateRenderTargetMipmap=oe,this.updateMultisampleRenderTarget=Be,this.setupDepthRenderbuffer=$,this.setupFrameBufferTexture=be,this.useMultisampledRTT=Ze,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Im(s,e){function t(n,i=Pn){let r,a=et.getTransfer(i);if(n===ln)return s.UNSIGNED_BYTE;if(n===Qo)return s.UNSIGNED_SHORT_4_4_4_4;if(n===el)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Q0)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===eu)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===$0)return s.BYTE;if(n===j0)return s.SHORT;if(n===Ns)return s.UNSIGNED_SHORT;if(n===jo)return s.INT;if(n===vn)return s.UNSIGNED_INT;if(n===$t)return s.FLOAT;if(n===Ct)return s.HALF_FLOAT;if(n===tu)return s.ALPHA;if(n===nu)return s.RGB;if(n===jt)return s.RGBA;if(n===zn)return s.DEPTH_COMPONENT;if(n===Si)return s.DEPTH_STENCIL;if(n===tl)return s.RED;if(n===aa)return s.RED_INTEGER;if(n===Mi)return s.RG;if(n===nl)return s.RG_INTEGER;if(n===il)return s.RGBA_INTEGER;if(n===oa||n===la||n===ca||n===ua)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===oa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===la)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ca)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===oa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===la)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ca)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ua)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===sl||n===rl||n===al||n===ol)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===sl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===rl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===al)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ol)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ll||n===cl||n===ul||n===hl||n===dl||n===ha||n===fl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ll||n===cl)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ul)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===hl)return r.COMPRESSED_R11_EAC;if(n===dl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ha)return r.COMPRESSED_RG11_EAC;if(n===fl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===pl||n===ml||n===gl||n===_l||n===xl||n===vl||n===yl||n===Sl||n===Ml||n===bl||n===Tl||n===El||n===wl||n===Al)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===pl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ml)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===gl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===_l)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===vl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===yl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Sl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ml)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===bl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Tl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===El)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Al)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Cl||n===Rl||n===Pl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Cl)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Rl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Pl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Il||n===Dl||n===da||n===Ll)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Il)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Dl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===da)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ll)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Fs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}function Ny(s,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,ed(s)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function i(g,m,y,M,x){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),d(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),h(g,m),m.isMeshPhysicalMaterial&&f(g,m,x)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),_(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,y,M):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Gt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Gt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let y=e.get(m),M=y.envMap,x=y.envMapRotation;M&&(g.envMap.value=M,g.envMapRotation.value.setFromMatrix4(Uy.makeRotationFromEuler(x)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Dm),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,y,M){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*y,g.scale.value=M*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function d(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function h(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,y){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Gt&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){let y=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Fy(s,e,t,n){let i={},r={},a=[],o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,E){let T=E.program;n.uniformBlockBinding(x,T)}function c(x,E){let T=i[x.id];T===void 0&&(g(x),T=u(x),i[x.id]=T,x.addEventListener("dispose",y));let A=E.program;n.updateUBOMapping(x,A);let v=e.render.frame;r[x.id]!==v&&(h(x),r[x.id]=v)}function u(x){let E=d();x.__bindingPointIndex=E;let T=s.createBuffer(),A=x.__size,v=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,A,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,E,T),T}function d(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return De("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){let E=i[x.id],T=x.uniforms,A=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let v=0,w=T.length;v<w;v++){let P=T[v];if(Array.isArray(P))for(let I=0,F=P.length;I<F;I++)f(P[I],v,I,A);else f(P,v,0,A)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(x,E,T,A){if(_(x,E,T,A)===!0){let v=x.__offset,w=x.value;if(Array.isArray(w)){let P=0;for(let I=0;I<w.length;I++){let F=w[I],z=m(F);p(F,x.__data,P),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(P+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(w,x.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,v,x.__data)}}function p(x,E,T){typeof x=="number"||typeof x=="boolean"?E[0]=x:x.isMatrix3?(E[0]=x.elements[0],E[1]=x.elements[1],E[2]=x.elements[2],E[3]=0,E[4]=x.elements[3],E[5]=x.elements[4],E[6]=x.elements[5],E[7]=0,E[8]=x.elements[6],E[9]=x.elements[7],E[10]=x.elements[8],E[11]=0):ArrayBuffer.isView(x)?E.set(new x.constructor(x.buffer,x.byteOffset,E.length)):x.toArray(E,T)}function _(x,E,T,A){let v=x.value,w=E+"_"+T;if(A[w]===void 0)return typeof v=="number"||typeof v=="boolean"?A[w]=v:ArrayBuffer.isView(v)?A[w]=v.slice():A[w]=v.clone(),!0;{let P=A[w];if(typeof v=="number"||typeof v=="boolean"){if(P!==v)return A[w]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(P.equals(v)===!1)return P.copy(v),!0}}return!1}function g(x){let E=x.uniforms,T=0,A=16;for(let w=0,P=E.length;w<P;w++){let I=Array.isArray(E[w])?E[w]:[E[w]];for(let F=0,z=I.length;F<z;F++){let L=I[F],B=Array.isArray(L.value)?L.value:[L.value];for(let Y=0,X=B.length;Y<X;Y++){let Z=B[Y],G=m(Z),J=T%A,Q=J%G.boundary,we=J+Q;T+=Q,we!==0&&A-we<G.storage&&(T+=A-we),L.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=T,T+=G.storage}}}let v=T%A;return v>0&&(T+=A-v),x.__size=T,x.__cache={},this}function m(x){let E={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(E.boundary=4,E.storage=4):x.isVector2?(E.boundary=8,E.storage=8):x.isVector3||x.isColor?(E.boundary=16,E.storage=12):x.isVector4?(E.boundary=16,E.storage=16):x.isMatrix3?(E.boundary=48,E.storage=48):x.isMatrix4?(E.boundary=64,E.storage=64):x.isTexture?de("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(E.boundary=16,E.storage=x.byteLength):de("WebGLRenderer: Unsupported uniform value type.",x),E}function y(x){let E=x.target;E.removeEventListener("dispose",y);let T=a.indexOf(E.__bindingPointIndex);a.splice(T,1),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function M(){for(let x in i)s.deleteBuffer(i[x]);a=[],i={},r={}}return{bind:l,update:c,dispose:M}}function By(){return si===null&&(si=new rn(Oy,16,16,Mi,Ct),si.name="DFG_LUT",si.minFilter=xt,si.magFilter=xt,si.wrapS=kt,si.wrapT=kt,si.generateMipmaps=!1,si.needsUpdate=!0),si}var j_,Q_,e1,t1,n1,i1,s1,r1,a1,o1,l1,c1,u1,h1,d1,f1,p1,m1,g1,_1,x1,v1,y1,S1,M1,b1,T1,E1,w1,A1,C1,R1,P1,I1,D1,L1,U1,N1,F1,O1,B1,z1,k1,V1,H1,G1,W1,X1,q1,Y1,Z1,J1,K1,$1,j1,Q1,ex,tx,nx,ix,sx,rx,ax,ox,lx,cx,ux,hx,dx,fx,px,mx,gx,_x,xx,vx,yx,Sx,Mx,bx,Tx,Ex,wx,Ax,Cx,Rx,Px,Ix,Dx,Lx,Ux,Nx,Fx,Ox,Bx,zx,kx,Vx,Hx,Gx,Wx,Xx,qx,Yx,Zx,Jx,Kx,$x,jx,Qx,ev,tv,nv,iv,sv,rv,av,ov,lv,cv,uv,hv,dv,fv,pv,mv,gv,_v,xv,vv,yv,Sv,Mv,bv,Tv,Ev,wv,Av,Cv,Rv,Pv,Iv,je,pe,Wn,ou,Dv,wm,pa,Bv,zv,kv,Bl,sm,ud,hd,dd,fd,Vv,Bs,zs,Vl,jv,Am,gd,Cm,Rm,Pm,lm,cm,um,hm,dm,_d,xd,vd,pd,ma,V9,H9,mm,q9,lu,j9,Q9,ty,iy,ry,oy,cy,fy,Sd,Md,Sy,Ey,wy,Ay,Cy,Tm,zl,md,Dy,Ly,bd,Td,Uy,Dm,Oy,si,Hl,Xn=Od(()=>{cd();cd();j_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Q_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,e1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,t1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,n1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,i1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,s1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,r1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,a1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,o1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,l1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,c1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,u1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,h1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,d1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,f1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,p1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,m1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,g1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,x1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,v1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,y1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,S1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,M1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,b1=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,T1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,E1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,w1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,A1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,C1="gl_FragColor = linearToOutputTexel( gl_FragColor );",R1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,P1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,I1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,D1=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,L1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,U1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,N1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,F1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,O1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,B1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,z1=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,k1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,V1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,H1=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,G1=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,W1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,X1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,q1=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Y1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Z1=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,J1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,K1=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,$1=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,j1=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Q1=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ex=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,tx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,nx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ix=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ax=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ox=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,lx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ux=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,fx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,px=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,mx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,_x=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,xx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Sx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Mx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Tx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ex=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ax=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Cx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Rx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Px=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ix=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ux=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Nx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Fx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ox=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Bx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,kx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Vx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Hx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Wx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Xx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,qx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Yx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Kx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,$x=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,jx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Qx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ev=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,rv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,av=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ov=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,lv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,cv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,dv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,fv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,_v=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,vv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,yv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,bv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ev=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Av=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Cv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Pv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Iv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:j_,alphahash_pars_fragment:Q_,alphamap_fragment:e1,alphamap_pars_fragment:t1,alphatest_fragment:n1,alphatest_pars_fragment:i1,aomap_fragment:s1,aomap_pars_fragment:r1,batching_pars_vertex:a1,batching_vertex:o1,begin_vertex:l1,beginnormal_vertex:c1,bsdfs:u1,iridescence_fragment:h1,bumpmap_pars_fragment:d1,clipping_planes_fragment:f1,clipping_planes_pars_fragment:p1,clipping_planes_pars_vertex:m1,clipping_planes_vertex:g1,color_fragment:_1,color_pars_fragment:x1,color_pars_vertex:v1,color_vertex:y1,common:S1,cube_uv_reflection_fragment:M1,defaultnormal_vertex:b1,displacementmap_pars_vertex:T1,displacementmap_vertex:E1,emissivemap_fragment:w1,emissivemap_pars_fragment:A1,colorspace_fragment:C1,colorspace_pars_fragment:R1,envmap_fragment:P1,envmap_common_pars_fragment:I1,envmap_pars_fragment:D1,envmap_pars_vertex:L1,envmap_physical_pars_fragment:W1,envmap_vertex:U1,fog_vertex:N1,fog_pars_vertex:F1,fog_fragment:O1,fog_pars_fragment:B1,gradientmap_pars_fragment:z1,lightmap_pars_fragment:k1,lights_lambert_fragment:V1,lights_lambert_pars_fragment:H1,lights_pars_begin:G1,lights_toon_fragment:X1,lights_toon_pars_fragment:q1,lights_phong_fragment:Y1,lights_phong_pars_fragment:Z1,lights_physical_fragment:J1,lights_physical_pars_fragment:K1,lights_fragment_begin:$1,lights_fragment_maps:j1,lights_fragment_end:Q1,lightprobes_pars_fragment:ex,logdepthbuf_fragment:tx,logdepthbuf_pars_fragment:nx,logdepthbuf_pars_vertex:ix,logdepthbuf_vertex:sx,map_fragment:rx,map_pars_fragment:ax,map_particle_fragment:ox,map_particle_pars_fragment:lx,metalnessmap_fragment:cx,metalnessmap_pars_fragment:ux,morphinstance_vertex:hx,morphcolor_vertex:dx,morphnormal_vertex:fx,morphtarget_pars_vertex:px,morphtarget_vertex:mx,normal_fragment_begin:gx,normal_fragment_maps:_x,normal_pars_fragment:xx,normal_pars_vertex:vx,normal_vertex:yx,normalmap_pars_fragment:Sx,clearcoat_normal_fragment_begin:Mx,clearcoat_normal_fragment_maps:bx,clearcoat_pars_fragment:Tx,iridescence_pars_fragment:Ex,opaque_fragment:wx,packing:Ax,premultiplied_alpha_fragment:Cx,project_vertex:Rx,dithering_fragment:Px,dithering_pars_fragment:Ix,roughnessmap_fragment:Dx,roughnessmap_pars_fragment:Lx,shadowmap_pars_fragment:Ux,shadowmap_pars_vertex:Nx,shadowmap_vertex:Fx,shadowmask_pars_fragment:Ox,skinbase_vertex:Bx,skinning_pars_vertex:zx,skinning_vertex:kx,skinnormal_vertex:Vx,specularmap_fragment:Hx,specularmap_pars_fragment:Gx,tonemapping_fragment:Wx,tonemapping_pars_fragment:Xx,transmission_fragment:qx,transmission_pars_fragment:Yx,uv_pars_fragment:Zx,uv_pars_vertex:Jx,uv_vertex:Kx,worldpos_vertex:$x,background_vert:jx,background_frag:Qx,backgroundCube_vert:ev,backgroundCube_frag:tv,cube_vert:nv,cube_frag:iv,depth_vert:sv,depth_frag:rv,distance_vert:av,distance_frag:ov,equirect_vert:lv,equirect_frag:cv,linedashed_vert:uv,linedashed_frag:hv,meshbasic_vert:dv,meshbasic_frag:fv,meshlambert_vert:pv,meshlambert_frag:mv,meshmatcap_vert:gv,meshmatcap_frag:_v,meshnormal_vert:xv,meshnormal_frag:vv,meshphong_vert:yv,meshphong_frag:Sv,meshphysical_vert:Mv,meshphysical_frag:bv,meshtoon_vert:Tv,meshtoon_frag:Ev,points_vert:wv,points_frag:Av,shadow_vert:Cv,shadow_frag:Rv,sprite_vert:Pv,sprite_frag:Iv},pe={common:{diffuse:{value:new le(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new le(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new R},probesMax:{value:new R},probesResolution:{value:new R}},points:{diffuse:{value:new le(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new le(16777215)},opacity:{value:1},center:{value:new ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},Wn={basic:{uniforms:Qt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:Qt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new le(0)},envMapIntensity:{value:1}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:Qt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new le(0)},specular:{value:new le(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:Qt([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new le(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:Qt([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new le(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:Qt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:Qt([pe.points,pe.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:Qt([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:Qt([pe.common,pe.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:Qt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:Qt([pe.sprite,pe.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distance:{uniforms:Qt([pe.common,pe.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distance_vert,fragmentShader:je.distance_frag},shadow:{uniforms:Qt([pe.lights,pe.fog,{color:{value:new le(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};Wn.physical={uniforms:Qt([Wn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new le(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new le(0)},specularColor:{value:new le(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};ou={r:0,b:0,g:0},Dv=new Ge,wm=new Ye;wm.set(-1,0,0,0,1,0,0,0,1);pa=4,Bv=6,zv=20,kv=256,Bl=new An,sm=new le,ud=null,hd=0,dd=0,fd=!1,Vv=new R,Bs=new R,zs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){let{size:a=256,position:o=Vv}=r;ud=this._renderer.getRenderTarget(),hd=this._renderer.getActiveCubeFace(),dd=this._renderer.getActiveMipmapLevel(),fd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=om(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=am(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ud,hd,dd),this._renderer.xr.enabled=fd,e.scissorTest=!1,fa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Hn||e.mapping===yi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ud=this._renderer.getRenderTarget(),hd=this._renderer.getActiveCubeFace(),dd=this._renderer.getActiveMipmapLevel(),fd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:xt,minFilter:xt,generateMipmaps:!1,type:Ct,format:jt,colorSpace:mr,depthBuffer:!1},i=rm(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=rm(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Hv(r)),this._blurMaterial=Wv(r,e,t),this._ggxMaterial=Gv(r,e,t)}return i}_compileMaterial(e){let t=new mt(new We,e);this._renderer.compile(t,Bl)}_sceneToCubeUV(e,t,n,i,r){let l=new It(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(sm),d.toneMapping=Rn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new mt(new mi,new _n({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,g=_.material,m=!1,y=e.background;y?y.isColor&&(g.color.copy(y),e.background=null,m=!0):(g.color.copy(sm),m=!0);for(let M=0;M<6;M++){let x=M%3;x===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[M],r.y,r.z)):x===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[M]));let E=this._cubeSize;fa(i,x*E,M>2?E:0,E,E),d.setRenderTarget(i),m&&d.render(_,l),d.render(e,l)}d.toneMapping=f,d.autoClear=h,e.background=y}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Hn||e.mapping===yi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=om()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=am());let r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;fa(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Bl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=c*1.25,f=d*h,{_lodMax:p}=this,_=this._sizeLods[n],g=3*_*(n>p-pa?n-p+pa:0),m=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,fa(r,g,m,3*_,2*_),i.setRenderTarget(r),i.render(o,Bl),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,fa(e,g,m,3*_,2*_),i.setRenderTarget(e),i.render(o,Bl)}_blur(e,t,n,i){let r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,i,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[i];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let u=this._sizeLods[i],d=3*u*(i>this._lodMax-pa?i-this._lodMax+pa:0),h=4*(this._cubeSize-u);fa(t,d,h,3*u,2*u),a.setRenderTarget(t),a.render(l,Bl)}};Vl=class extends yt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new ki(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new mi(5,5,5),r=new ct({name:"CubemapFromEquirect",uniforms:Os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Gt,blending:on});r.uniforms.tEquirect.value=t;let a=new mt(i,r),o=t.minFilter;return t.minFilter===Gn&&(t.minFilter=xt),new Go(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}};jv={[$r]:"LINEAR_TONE_MAPPING",[jr]:"REINHARD_TONE_MAPPING",[Qr]:"CINEON_TONE_MAPPING",[Ki]:"ACES_FILMIC_TONE_MAPPING",[ta]:"AGX_TONE_MAPPING",[na]:"NEUTRAL_TONE_MAPPING",[ea]:"CUSTOM_TONE_MAPPING"};Am=new At,gd=new pi(1,1),Cm=new ps,Rm=new ms,Pm=new ki,lm=[],cm=[],um=new Float32Array(16),hm=new Float32Array(9),dm=new Float32Array(4);_d=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=v9(t.type)}},xd=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=z9(t.type)}},vd=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,a=i.length;r!==a;++r){let o=i[r];o.setValue(e,t[o.id],n)}}},pd=/(\w+)(\])?(\[|\.)?/g;ma=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);k9(o,l,this)}let i=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let a=e[i];a.id in t&&n.push(a)}return n}};V9=37297,H9=0;mm=new Ye;q9={[$r]:"Linear",[jr]:"Reinhard",[Qr]:"Cineon",[Ki]:"ACESFilmic",[ta]:"AgX",[na]:"Neutral",[ea]:"Custom"};lu=new R;j9=/^[ \t]*#include +<([\w\d./]+)>/gm;Q9=new Map;ty=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;iy={[Yi]:"SHADOWMAP_TYPE_PCF",[Ds]:"SHADOWMAP_TYPE_VSM"};ry={[Hn]:"ENVMAP_TYPE_CUBE",[yi]:"ENVMAP_TYPE_CUBE",[Ls]:"ENVMAP_TYPE_CUBE_UV"};oy={[yi]:"ENVMAP_MODE_REFRACTION"};cy={[Kr]:"ENVMAP_BLENDING_MULTIPLY",[Nh]:"ENVMAP_BLENDING_MIX",[Fh]:"ENVMAP_BLENDING_ADD"};fy=0,Sd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Md(e),t.set(e,n)),n}},Md=class{constructor(e){this.id=fy++,this.code=e,this.usedTimes=0}};Sy=0;Ey=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Ay=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],Cy=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],Tm=new Ge,zl=new R,md=new R;Dy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ly=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,bd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new wr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ct({vertexShader:Dy,fragmentShader:Ly,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new mt(new Qn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Td=class extends dn{constructor(e,t){super();let n=this,i=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,p=null,_=typeof XRWebGLBinding<"u",g=new bd,m={},y=t.getContextAttributes(),M=null,x=null,E=[],T=[],A=new ee,v=null,w=null,P=new It;P.viewport=new ut;let I=new It;I.viewport=new ut;let F=[P,I],z=new Wo,L=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let te=E[q];return te===void 0&&(te=new _s,E[q]=te),te.getTargetRaySpace()},this.getControllerGrip=function(q){let te=E[q];return te===void 0&&(te=new _s,E[q]=te),te.getGripSpace()},this.getHand=function(q){let te=E[q];return te===void 0&&(te=new _s,E[q]=te),te.getHandSpace()};function Y(q){let te=T.indexOf(q.inputSource);if(te===-1)return;let fe=E[te];fe!==void 0&&(fe.update(q.inputSource,q.frame,c||a),fe.dispatchEvent({type:q.type,data:q.inputSource}))}function X(){i.removeEventListener("select",Y),i.removeEventListener("selectstart",Y),i.removeEventListener("selectend",Y),i.removeEventListener("squeeze",Y),i.removeEventListener("squeezestart",Y),i.removeEventListener("squeezeend",Y),i.removeEventListener("end",X),i.removeEventListener("inputsourceschange",Z);for(let q=0;q<E.length;q++){let te=T[q];te!==null&&(T[q]=null,E[q].disconnect(te))}L=null,B=null,g.reset();for(let q in m)delete m[q];if(e.setRenderTarget(M),f=null,h=null,d=null,i=null,x=null,Je.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(A.width,A.height,!1),w!==null){let q=w.camera;q.fov=w.fov,q.zoom=w.zoom,q.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&de("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&de("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(q){if(i=q,i!==null){if(M=e.getRenderTarget(),i.addEventListener("select",Y),i.addEventListener("selectstart",Y),i.addEventListener("selectend",Y),i.addEventListener("squeeze",Y),i.addEventListener("squeezestart",Y),i.addEventListener("squeezeend",Y),i.addEventListener("end",X),i.addEventListener("inputsourceschange",Z),y.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,Oe=null,be=null;y.depth&&(be=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=y.stencil?Si:zn,Oe=y.stencil?Fs:vn);let ze={colorFormat:t.RGBA8,depthFormat:be,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(ze),i.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),x=new yt(h.textureWidth,h.textureHeight,{format:jt,type:ln,depthTexture:new pi(h.textureWidth,h.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let fe={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,fe),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new yt(f.framebufferWidth,f.framebufferHeight,{format:jt,type:ln,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Je.setContext(i),Je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z(q){for(let te=0;te<q.removed.length;te++){let fe=q.removed[te],Oe=T.indexOf(fe);Oe>=0&&(T[Oe]=null,E[Oe].disconnect(fe))}for(let te=0;te<q.added.length;te++){let fe=q.added[te],Oe=T.indexOf(fe);if(Oe===-1){for(let ze=0;ze<E.length;ze++)if(ze>=T.length){T.push(fe),Oe=ze;break}else if(T[ze]===null){T[ze]=fe,Oe=ze;break}if(Oe===-1)break}let be=E[Oe];be&&be.connect(fe)}}let G=new R,J=new R;function Q(q,te,fe){G.setFromMatrixPosition(te.matrixWorld),J.setFromMatrixPosition(fe.matrixWorld);let Oe=G.distanceTo(J),be=te.projectionMatrix.elements,ze=fe.projectionMatrix.elements,st=be[14]/(be[10]-1),$=be[14]/(be[10]+1),se=(be[9]+1)/be[5],ae=(be[9]-1)/be[5],oe=(be[8]-1)/be[0],he=(ze[8]+1)/ze[0],ke=st*oe,Be=st*he,Xe=Oe/(-oe+he),Ze=Xe*-oe;if(te.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Ze),q.translateZ(Xe),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),be[10]===-1)q.projectionMatrix.copy(te.projectionMatrix),q.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{let D=st+Xe,ht=$+Xe,nt=ke-Ze,C=Be+(Oe-Ze),S=se*$/ht*D,O=ae*$/ht*D;q.projectionMatrix.makePerspective(nt,C,S,O,D,ht),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function we(q,te){te===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(te.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(i===null)return;let te=q.near,fe=q.far;g.texture!==null&&(g.depthNear>0&&(te=g.depthNear),g.depthFar>0&&(fe=g.depthFar)),z.near=I.near=P.near=te,z.far=I.far=P.far=fe,(L!==z.near||B!==z.far)&&(i.updateRenderState({depthNear:z.near,depthFar:z.far}),L=z.near,B=z.far),z.layers.mask=q.layers.mask|6,P.layers.mask=z.layers.mask&-5,I.layers.mask=z.layers.mask&-3;let Oe=q.parent,be=z.cameras;we(z,Oe);for(let ze=0;ze<be.length;ze++)we(be[ze],Oe);be.length===2?Q(z,P,I):z.projectionMatrix.copy(P.projectionMatrix),w===null&&q.isPerspectiveCamera&&(w={camera:q,fov:q.fov,zoom:q.zoom}),Ee(q,z,Oe)};function Ee(q,te,fe){fe===null?q.matrix.copy(te.matrixWorld):(q.matrix.copy(fe.matrixWorld),q.matrix.invert(),q.matrix.multiply(te.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(te.projectionMatrix),q.projectionMatrixInverse.copy(te.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=fs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(q){l=q,h!==null&&(h.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(z)},this.getCameraTexture=function(q){return m[q]};let tt=null;function qe(q,te){if(u=te.getViewerPose(c||a),p=te,u!==null){let fe=u.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let Oe=!1;fe.length!==z.cameras.length&&(z.cameras.length=0,Oe=!0);for(let $=0;$<fe.length;$++){let se=fe[$],ae=null;if(f!==null)ae=f.getViewport(se);else{let he=d.getViewSubImage(h,se);ae=he.viewport,$===0&&(e.setRenderTargetTextures(x,he.colorTexture,he.depthStencilTexture),e.setRenderTarget(x))}let oe=F[$];oe===void 0&&(oe=new It,oe.layers.enable($),oe.viewport=new ut,F[$]=oe),oe.matrix.fromArray(se.transform.matrix),oe.matrix.decompose(oe.position,oe.quaternion,oe.scale),oe.projectionMatrix.fromArray(se.projectionMatrix),oe.projectionMatrixInverse.copy(oe.projectionMatrix).invert(),oe.viewport.set(ae.x,ae.y,ae.width,ae.height),$===0&&(z.matrix.copy(oe.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Oe===!0&&z.cameras.push(oe)}let be=i.enabledFeatures;if(be&&be.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){d=n.getBinding();let $=d.getDepthInformation(fe[0]);$&&$.isValid&&$.texture&&g.init($,i.renderState)}if(be&&be.includes("camera-access")&&_){e.state.unbindTexture(),d=n.getBinding();for(let $=0;$<fe.length;$++){let se=fe[$].camera;if(se){let ae=m[se];ae||(ae=new wr,m[se]=ae);let oe=d.getCameraImage(se);ae.sourceTexture=oe}}}}for(let fe=0;fe<E.length;fe++){let Oe=T[fe],be=E[fe];Oe!==null&&be!==void 0&&be.update(Oe,te,c||a)}tt&&tt(q,te),te.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:te}),p=null}let Je=new Em;Je.setAnimationLoop(qe),this.setAnimationLoop=function(q){tt=q},this.dispose=function(){}}},Uy=new Ge,Dm=new Ye;Dm.set(-1,0,0,0,1,0,0,0,1);Oy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),si=null;Hl=class{constructor(e={}){let{canvas:t=Kh(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=ln}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let _=f,g=new Set([il,nl,aa]),m=new Set([ln,vn,Ns,Fs,Qo,el]),y=new Uint32Array(4),M=new Int32Array(4),x=new R,E=null,T=null,A=[],v=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Rn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,I=!1,F=null,z=null,L=null,B=null;this._outputColorSpace=Kt;let Y=0,X=0,Z=null,G=-1,J=null,Q=new ut,we=new ut,Ee=null,tt=new le(0),qe=0,Je=t.width,q=t.height,te=1,fe=null,Oe=null,be=new ut(0,0,Je,q),ze=new ut(0,0,Je,q),st=!1,$=new jn,se=!1,ae=!1,oe=new Ge,he=new R,ke=new ut,Be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Xe=!1;function Ze(){return Z===null?te:1}let D=n;function ht(b,U){return t.getContext(b,U)}let nt,C,S,O,H,K,ce,ue,j,ie,me,Ue,ve,ge,Ne,Ve,Ke,N,_e,ne,xe,Te,re;try{let b={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",St,!1),t.addEventListener("webglcontextrestored",dt,!1),t.addEventListener("webglcontextcreationerror",Dn,!1),D===null){let U="webgl2";if(D=ht(U,b),D===null)throw ht(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Fe()}catch(b){throw t.removeEventListener("webglcontextlost",St,!1),t.removeEventListener("webglcontextrestored",dt,!1),t.removeEventListener("webglcontextcreationerror",Dn,!1),De("WebGLRenderer: "+b.message),b}function Fe(){nt=new qv(D),nt.init(),xe=new Im(D,nt),C=new Fv(D,nt,e,xe),S=new Py(D,nt),C.reversedDepthBuffer&&h&&S.buffers.depth.setReversed(!0),z=D.createFramebuffer(),L=D.createFramebuffer(),B=D.createFramebuffer(),O=new Jv(D),H=new gy,K=new Iy(D,nt,S,H,C,xe,O),ce=new Xv(P),ue=new $_(D),Te=new Uv(D,ue),j=new Yv(D,ue,O,Te),ie=new $v(D,j,ue,Te,O),N=new Kv(D,C,K),Ne=new Ov(H),me=new my(P,ce,nt,C,Te,Ne),Ue=new Ny(P,H),ve=new xy,ge=new Ty(nt),Ke=new Lv(P,ce,S,ie,p,l),Ve=new Ry(P,ie,C),re=new Fy(D,O,C,S),_e=new Nv(D,nt,O),ne=new Zv(D,nt,O),O.programs=me.programs,P.capabilities=C,P.extensions=nt,P.properties=H,P.renderLists=ve,P.shadowMap=Ve,P.state=S,P.info=O}_!==ln&&(w=new Qv(_,t.width,t.height,o,i,r));let Ie=new Td(P,D);this.xr=Ie,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let b=nt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=nt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(b){b!==void 0&&(te=b,this.setSize(Je,q,!1))},this.getSize=function(b){return b.set(Je,q)},this.setSize=function(b,U,W=!0){if(Ie.isPresenting){de("WebGLRenderer: Can't change size while VR device is presenting.");return}Je=b,q=U,t.width=Math.floor(b*te),t.height=Math.floor(U*te),W===!0&&(t.style.width=b+"px",t.style.height=U+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(Je*te,q*te).floor()},this.setDrawingBufferSize=function(b,U,W){Je=b,q=U,te=W,t.width=Math.floor(b*W),t.height=Math.floor(U*W),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(_===ln){De("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){de("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(Q)},this.getViewport=function(b){return b.copy(be)},this.setViewport=function(b,U,W,k){b.isVector4?be.set(b.x,b.y,b.z,b.w):be.set(b,U,W,k),S.viewport(Q.copy(be).multiplyScalar(te).round())},this.getScissor=function(b){return b.copy(ze)},this.setScissor=function(b,U,W,k){b.isVector4?ze.set(b.x,b.y,b.z,b.w):ze.set(b,U,W,k),S.scissor(we.copy(ze).multiplyScalar(te).round())},this.getScissorTest=function(){return st},this.setScissorTest=function(b){S.setScissorTest(st=b)},this.setOpaqueSort=function(b){fe=b},this.setTransparentSort=function(b){Oe=b},this.getClearColor=function(b){return b.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor(...arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,W=!0){let k=0;if(b){let V=!1;if(Z!==null){let Se=Z.texture.format;V=g.has(Se)}if(V){let Se=Z.texture.type,Ce=m.has(Se),ye=Ke.getClearColor(),Re=Ke.getClearAlpha(),Le=ye.r,Qe=ye.g,it=ye.b;Ce?(y[0]=Le,y[1]=Qe,y[2]=it,y[3]=Re,D.clearBufferuiv(D.COLOR,0,y)):(M[0]=Le,M[1]=Qe,M[2]=it,M[3]=Re,D.clearBufferiv(D.COLOR,0,M))}else k|=D.COLOR_BUFFER_BIT}U&&(k|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(k|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&D.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),F=b},this.dispose=function(){t.removeEventListener("webglcontextlost",St,!1),t.removeEventListener("webglcontextrestored",dt,!1),t.removeEventListener("webglcontextcreationerror",Dn,!1),Ke.dispose(),ve.dispose(),ge.dispose(),H.dispose(),ce.dispose(),ie.dispose(),Te.dispose(),re.dispose(),me.dispose(),Ie.dispose(),Ie.removeEventListener("sessionstart",Cd),Ie.removeEventListener("sessionend",Rd),$i.stop()};function St(b){b.preventDefault(),xr("WebGLRenderer: Context Lost."),I=!0}function dt(){xr("WebGLRenderer: Context Restored."),I=!1;let b=O.autoReset,U=Ve.enabled,W=Ve.autoUpdate,k=Ve.needsUpdate,V=Ve.type;Fe(),O.autoReset=b,Ve.enabled=U,Ve.autoUpdate=W,Ve.needsUpdate=k,Ve.type=V}function Dn(b){De("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function qn(b){let U=b.target;U.removeEventListener("dispose",qn),qm(U)}function qm(b){Ym(b),H.remove(b)}function Ym(b){let U=H.get(b).programs;U!==void 0&&(U.forEach(function(W){me.releaseProgram(W)}),b.isShaderMaterial&&me.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,W,k,V,Se){U===null&&(U=Be);let Ce=V.isMesh&&V.matrixWorld.determinantAffine()<0,ye=Km(b,U,W,k,V);S.setMaterial(k,Ce);let Re=W.index,Le=1;if(k.wireframe===!0){if(Re=j.getWireframeAttribute(W),Re===void 0)return;Le=2}let Qe=W.drawRange,it=W.attributes.position,Pe=Qe.start*Le,ft=(Qe.start+Qe.count)*Le;Se!==null&&(Pe=Math.max(Pe,Se.start*Le),ft=Math.min(ft,(Se.start+Se.count)*Le)),Re!==null?(Pe=Math.max(Pe,0),ft=Math.min(ft,Re.count)):it!=null&&(Pe=Math.max(Pe,0),ft=Math.min(ft,it.count));let Dt=ft-Pe;if(Dt<0||Dt===1/0)return;Te.setup(V,k,ye,W,Re);let bt,vt=_e;if(Re!==null&&(bt=ue.get(Re),vt=ne,vt.setIndex(bt)),V.isMesh)k.wireframe===!0?(S.setLineWidth(k.wireframeLinewidth*Ze()),vt.setMode(D.LINES)):vt.setMode(D.TRIANGLES);else if(V.isLine){let qt=k.linewidth;qt===void 0&&(qt=1),S.setLineWidth(qt*Ze()),V.isLineSegments?vt.setMode(D.LINES):V.isLineLoop?vt.setMode(D.LINE_LOOP):vt.setMode(D.LINE_STRIP)}else V.isPoints?vt.setMode(D.POINTS):V.isSprite&&vt.setMode(D.TRIANGLES);if(V.isBatchedMesh)if(nt.get("WEBGL_multi_draw"))vt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let qt=V._multiDrawStarts,Ae=V._multiDrawCounts,tn=V._multiDrawCount,at=Re?ue.get(Re).bytesPerElement:1,yn=H.get(k).currentProgram.getUniforms();for(let Yn=0;Yn<tn;Yn++)yn.setValue(D,"_gl_DrawID",Yn),vt.render(qt[Yn]/at,Ae[Yn])}else if(V.isInstancedMesh)vt.renderInstances(Pe,Dt,V.count);else if(W.isInstancedBufferGeometry){let qt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Ae=Math.min(W.instanceCount,qt);vt.renderInstances(Pe,Dt,Ae)}else vt.render(Pe,Dt)};function Ad(b,U,W,k){F!==null&&b.isNodeMaterial&&F.setObject(k,b),se===!0&&Ne.setState(b,W,!1),b.transparent===!0&&b.side===Cn&&b.forceSinglePass===!1?(b.side=Gt,b.needsUpdate=!0,Yl(b,U,k),b.side=vi,b.needsUpdate=!0,Yl(b,U,k),b.side=Cn):Yl(b,U,k)}this.compile=function(b,U,W=null){W===null&&(W=b),F!==null&&F.renderStart(b,U,W),T=ge.get(W),T.init(U),v.push(T),W.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),b!==W&&b.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),T.setupLights(),F!==null&&F.updateLights(T.state.lightsArray),ae=this.localClippingEnabled,se=Ne.init(this.clippingPlanes,ae),se===!0&&Ne.setGlobalState(this.clippingPlanes,U),F!==null&&Ve.render(T.state.shadowsArray,W,U);let k=new Set;return b.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let Se=V.material;if(Se)if(Array.isArray(Se))for(let Ce=0;Ce<Se.length;Ce++){let ye=Se[Ce];Ad(ye,W,U,V),k.add(ye)}else Ad(Se,W,U,V),k.add(Se)}),T=v.pop(),F!==null&&F.renderEnd(),k},this.compileAsync=function(b,U,W=null){let k=this.compile(b,U,W);return new Promise(V=>{function Se(){if(k.forEach(function(Ce){let Re=H.get(Ce).currentProgram;(Re===void 0||Re.isReady())&&k.delete(Ce)}),k.size===0){V(b);return}setTimeout(Se,10)}nt.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let vu=null;function Zm(b){vu&&vu(b)}function Cd(){$i.stop()}function Rd(){$i.start()}let $i=new Em;$i.setAnimationLoop(Zm),typeof self<"u"&&$i.setContext(self),this.setAnimationLoop=function(b){vu=b,Ie.setAnimationLoop(b),b===null?$i.stop():$i.start()},Ie.addEventListener("sessionstart",Cd),Ie.addEventListener("sessionend",Rd),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){De("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;F!==null&&F.renderStart(b,U);let W=Ie.enabled===!0&&Ie.isPresenting===!0,k=w!==null&&(Z===null||W)&&w.begin(P,Z);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Ie.enabled===!0&&Ie.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ie.cameraAutoUpdate===!0&&Ie.updateCamera(U),U=Ie.getCamera()),b.isScene===!0&&b.onBeforeRender(P,b,U,Z),T=ge.get(b,v.length),T.init(U),T.state.textureUnits=K.getTextureUnits(),v.push(T),oe.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),$.setFromProjectionMatrix(oe,hn,U.reversedDepth),ae=this.localClippingEnabled,se=Ne.init(this.clippingPlanes,ae),E=ve.get(b,A.length),E.init(),A.push(E),Ie.enabled===!0&&Ie.isPresenting===!0){let Ce=P.xr.getDepthSensingMesh();Ce!==null&&yu(Ce,U,-1/0,P.sortObjects)}yu(b,U,0,P.sortObjects),E.finish(),F!==null&&F.updateLights(T.state.lightsArray),P.sortObjects===!0&&E.sort(fe,Oe),Xe=Ie.enabled===!1||Ie.isPresenting===!1||Ie.hasDepthSensing()===!1,Xe&&Ke.addToRenderList(E,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),se===!0&&Ne.beginShadows();let V=T.state.shadowsArray;if(Ve.render(V,b,U),se===!0&&Ne.endShadows(),(k&&w.hasRenderPass())===!1){let Ce=E.opaque,ye=E.transmissive;if(T.setupLights(),U.isArrayCamera){let Re=U.cameras;if(ye.length>0)for(let Le=0,Qe=Re.length;Le<Qe;Le++){let it=Re[Le];Id(Ce,ye,b,it)}Xe&&Ke.render(b);for(let Le=0,Qe=Re.length;Le<Qe;Le++){let it=Re[Le];Pd(E,b,it,it.viewport)}}else ye.length>0&&Id(Ce,ye,b,U),Xe&&Ke.render(b),Pd(E,b,U)}Z!==null&&X===0&&(K.updateMultisampleRenderTarget(Z),K.updateRenderTargetMipmap(Z)),k&&w.end(P),b.isScene===!0&&b.onAfterRender(P,b,U),Te.resetDefaultState(),G=-1,J=null,v.pop(),v.length>0?(T=v[v.length-1],K.setTextureUnits(T.state.textureUnits),se===!0&&Ne.setGlobalState(P.clippingPlanes,T.state.camera)):T=null,A.pop(),A.length>0?E=A[A.length-1]:E=null,F!==null&&F.renderEnd()};function yu(b,U,W,k){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)W=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLightProbeGrid)T.pushLightProbeGrid(b);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum($)){k&&ke.setFromMatrixPosition(b.matrixWorld).applyMatrix4(oe);let Ce=ie.update(b),ye=b.material;ye.visible&&E.push(b,Ce,ye,W,ke.z,null,U)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum($))){let Ce=ie.update(b),ye=b.material;if(k&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ke.copy(b.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),ke.copy(Ce.boundingSphere.center)),ke.applyMatrix4(b.matrixWorld).applyMatrix4(oe)),Array.isArray(ye)){let Re=Ce.groups;for(let Le=0,Qe=Re.length;Le<Qe;Le++){let it=Re[Le],Pe=ye[it.materialIndex];Pe&&Pe.visible&&E.push(b,Ce,Pe,W,ke.z,it,U)}}else ye.visible&&E.push(b,Ce,ye,W,ke.z,null,U)}}let Se=b.children;for(let Ce=0,ye=Se.length;Ce<ye;Ce++)yu(Se[Ce],U,W,k)}function Pd(b,U,W,k){let{opaque:V,transmissive:Se,transparent:Ce}=b;T.setupLightsView(W),se===!0&&Ne.setGlobalState(P.clippingPlanes,W),k&&S.viewport(Q.copy(k)),V.length>0&&ql(V,U,W),Se.length>0&&ql(Se,U,W),Ce.length>0&&ql(Ce,U,W),S.buffers.depth.setTest(!0),S.buffers.depth.setMask(!0),S.buffers.color.setMask(!0),S.setPolygonOffset(!1)}function Id(b,U,W,k){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[k.id]===void 0){let Pe=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[k.id]=new yt(1,1,{generateMipmaps:!0,type:Pe?Ct:ln,minFilter:Gn,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:et.workingColorSpace})}let Se=T.state.transmissionRenderTarget[k.id],Ce=k.viewport||Q;Se.setSize(Ce.z*P.transmissionResolutionScale,Ce.w*P.transmissionResolutionScale);let ye=P.getRenderTarget(),Re=P.getActiveCubeFace(),Le=P.getActiveMipmapLevel();P.setRenderTarget(Se),P.getClearColor(tt),qe=P.getClearAlpha(),qe<1&&P.setClearColor(16777215,.5),P.clear(),Xe&&Ke.render(W);let Qe=P.toneMapping;P.toneMapping=Rn;let it=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),T.setupLightsView(k),se===!0&&Ne.setGlobalState(P.clippingPlanes,k),ql(b,W,k),K.updateMultisampleRenderTarget(Se),K.updateRenderTargetMipmap(Se),nt.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let ft=0,Dt=U.length;ft<Dt;ft++){let bt=U[ft],{object:vt,geometry:qt,material:Ae,group:tn}=bt;if(Ae.side===Cn&&vt.layers.test(k.layers)){let at=Ae.side;Ae.side=Gt,Ae.needsUpdate=!0,Dd(vt,W,k,qt,Ae,tn),Ae.side=at,Ae.needsUpdate=!0,Pe=!0}}Pe===!0&&(K.updateMultisampleRenderTarget(Se),K.updateRenderTargetMipmap(Se))}P.setRenderTarget(ye,Re,Le),P.setClearColor(tt,qe),it!==void 0&&(k.viewport=it),P.toneMapping=Qe}function ql(b,U,W){let k=U.isScene===!0?U.overrideMaterial:null;for(let V=0,Se=b.length;V<Se;V++){let Ce=b[V],{object:ye,geometry:Re,group:Le}=Ce,Qe=Ce.material;Qe.allowOverride===!0&&k!==null&&(Qe=k),ye.layers.test(W.layers)&&Dd(ye,U,W,Re,Qe,Le)}}function Dd(b,U,W,k,V,Se){F!==null&&V.isNodeMaterial&&F.setObject(b,V),b.onBeforeRender(P,U,W,k,V,Se),b.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),V.onBeforeRender(P,U,W,k,b,Se),V.transparent===!0&&V.side===Cn&&V.forceSinglePass===!1?(V.side=Gt,V.needsUpdate=!0,P.renderBufferDirect(W,U,k,V,b,Se),V.side=vi,V.needsUpdate=!0,P.renderBufferDirect(W,U,k,V,b,Se),V.side=Cn):P.renderBufferDirect(W,U,k,V,b,Se),b.onAfterRender(P,U,W,k,V,Se)}function Yl(b,U,W){U.isScene!==!0&&(U=Be);let k=H.get(b),V=T.state.lights,Se=T.state.shadowsArray,Ce=V.state.version,ye=me.getParameters(b,V.state,Se,U,W,T.state.lightProbeGridArray),Re=me.getProgramCacheKey(ye),Le=k.programs;k.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,k.fog=U.fog;let Qe=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;k.envMap=ce.get(b.envMap||k.environment,Qe),k.envMapRotation=k.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Le===void 0&&(b.addEventListener("dispose",qn),Le=new Map,k.programs=Le);let it=Le.get(Re);if(it!==void 0){if(k.currentProgram===it&&k.lightsStateVersion===Ce)return Ud(b,ye),it}else ye.uniforms=me.getUniforms(b),F!==null&&b.isNodeMaterial&&F.build(b,W,ye),b.onBeforeCompile(ye,P),it=me.acquireProgram(ye,Re),Le.set(Re,it),k.uniforms=ye.uniforms;let Pe=k.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Pe.clippingPlanes=Ne.uniform),Ud(b,ye),k.needsLights=jm(b),k.lightsStateVersion=Ce,k.needsLights&&(Pe.ambientLightColor.value=V.state.ambient,Pe.lightProbe.value=V.state.probe,Pe.sunLights.value=V.state.sun,Pe.sunLightShadows.value=V.state.sunShadow,Pe.directionalLights.value=V.state.directional,Pe.directionalLightShadows.value=V.state.directionalShadow,Pe.spotLights.value=V.state.spot,Pe.spotLightShadows.value=V.state.spotShadow,Pe.rectAreaLights.value=V.state.rectArea,Pe.ltc_1.value=V.state.rectAreaLTC1,Pe.ltc_2.value=V.state.rectAreaLTC2,Pe.pointLights.value=V.state.point,Pe.pointLightShadows.value=V.state.pointShadow,Pe.hemisphereLights.value=V.state.hemi,Pe.sunShadowMatrix.value=V.state.sunShadowMatrix,Pe.sunShadowCascade.value=V.state.sunShadowCascade,Pe.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Pe.spotLightMatrix.value=V.state.spotLightMatrix,Pe.spotLightMap.value=V.state.spotLightMap,Pe.pointShadowMatrix.value=V.state.pointShadowMatrix),k.lightProbeGrid=T.state.lightProbeGridArray.length>0,k.currentProgram=it,k.uniformsList=null,it}function Ld(b){if(b.uniformsList===null){let U=b.currentProgram.getUniforms();b.uniformsList=ma.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function Ud(b,U){let W=H.get(b);W.outputColorSpace=U.outputColorSpace,W.batching=U.batching,W.batchingColor=U.batchingColor,W.instancing=U.instancing,W.instancingColor=U.instancingColor,W.instancingMorph=U.instancingMorph,W.skinning=U.skinning,W.morphTargets=U.morphTargets,W.morphNormals=U.morphNormals,W.morphColors=U.morphColors,W.morphTargetsCount=U.morphTargetsCount,W.numClippingPlanes=U.numClippingPlanes,W.numIntersection=U.numClipIntersection,W.vertexAlphas=U.vertexAlphas,W.vertexTangents=U.vertexTangents,W.toneMapping=U.toneMapping}function Jm(b,U){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;x.setFromMatrixPosition(U.matrixWorld);for(let W=0,k=b.length;W<k;W++){let V=b[W];if(V.texture!==null&&V.boundingBox.containsPoint(x))return V}return null}function Km(b,U,W,k,V){U.isScene!==!0&&(U=Be),K.resetTextureUnits();let Se=U.fog,Ce=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?U.environment:null,ye=Z===null?P.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:et.workingColorSpace,Re=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Le=ce.get(k.envMap||Ce,Re),Qe=k.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,it=!!W.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Pe=!!W.morphAttributes.position,ft=!!W.morphAttributes.normal,Dt=!!W.morphAttributes.color,bt=Rn;k.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(bt=P.toneMapping);let vt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,qt=vt!==void 0?vt.length:0,Ae=H.get(k),tn=T.state.lights;if(se===!0&&(ae===!0||b!==J)){let Mt=b===J&&k.id===G;Ne.setState(k,b,Mt)}let at=!1;k.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==tn.state.version||Ae.outputColorSpace!==ye||V.isBatchedMesh&&Ae.batching===!1||!V.isBatchedMesh&&Ae.batching===!0||V.isBatchedMesh&&Ae.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&Ae.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&Ae.instancing===!1||!V.isInstancedMesh&&Ae.instancing===!0||V.isSkinnedMesh&&Ae.skinning===!1||!V.isSkinnedMesh&&Ae.skinning===!0||V.isInstancedMesh&&Ae.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Ae.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Ae.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Ae.instancingMorph===!1&&V.morphTexture!==null||Ae.envMap!==Le||k.fog===!0&&Ae.fog!==Se||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==Ne.numPlanes||Ae.numIntersection!==Ne.numIntersection)||Ae.vertexAlphas!==Qe||Ae.vertexTangents!==it||Ae.morphTargets!==Pe||Ae.morphNormals!==ft||Ae.morphColors!==Dt||Ae.toneMapping!==bt||Ae.morphTargetsCount!==qt||!!Ae.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(at=!0):(at=!0,Ae.__version=k.version);let yn=Ae.currentProgram;at===!0&&(yn=Yl(k,U,V),F&&k.isNodeMaterial&&F.onUpdateProgram(k,yn,Ae));let Yn=!1,Ei=!1,Hs=!1,_t=yn.getUniforms(),Rt=Ae.uniforms;if(S.useProgram(yn.program)&&(Yn=!0,Ei=!0,Hs=!0),k.id!==G&&(G=k.id,Ei=!0),Ae.needsLights){let Mt=Jm(T.state.lightProbeGridArray,V);Ae.lightProbeGrid!==Mt&&(Ae.lightProbeGrid=Mt,Ei=!0)}if(Yn||J!==b){S.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),_t.setValue(D,"projectionMatrix",b.projectionMatrix),_t.setValue(D,"viewMatrix",b.matrixWorldInverse);let Ai=_t.map.cameraPosition;Ai!==void 0&&Ai.setValue(D,he.setFromMatrixPosition(b.matrixWorld)),C.logarithmicDepthBuffer&&_t.setValue(D,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&_t.setValue(D,"isOrthographic",b.isOrthographicCamera===!0),J!==b&&(J=b,Ei=!0,Hs=!0)}if(Ae.needsLights&&(tn.state.sunShadowMap.length>0&&_t.setValue(D,"sunShadowMap",tn.state.sunShadowMap,K),tn.state.directionalShadowMap.length>0&&_t.setValue(D,"directionalShadowMap",tn.state.directionalShadowMap,K),tn.state.spotShadowMap.length>0&&_t.setValue(D,"spotShadowMap",tn.state.spotShadowMap,K),tn.state.pointShadowMap.length>0&&_t.setValue(D,"pointShadowMap",tn.state.pointShadowMap,K)),V.isSkinnedMesh){_t.setOptional(D,V,"bindMatrix"),_t.setOptional(D,V,"bindMatrixInverse");let Mt=V.skeleton;Mt&&(Mt.boneTexture===null&&Mt.computeBoneTexture(),_t.setValue(D,"boneTexture",Mt.boneTexture,K))}V.isBatchedMesh&&(_t.setOptional(D,V,"batchingTexture"),_t.setValue(D,"batchingTexture",V._matricesTexture,K),_t.setOptional(D,V,"batchingIdTexture"),_t.setValue(D,"batchingIdTexture",V._indirectTexture,K),_t.setOptional(D,V,"batchingColorTexture"),V._colorsTexture!==null&&_t.setValue(D,"batchingColorTexture",V._colorsTexture,K));let wi=W.morphAttributes;if((wi.position!==void 0||wi.normal!==void 0||wi.color!==void 0)&&N.update(V,W,yn),(Ei||Ae.receiveShadow!==V.receiveShadow)&&(Ae.receiveShadow=V.receiveShadow,_t.setValue(D,"receiveShadow",V.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&U.environment!==null&&(Rt.envMapIntensity.value=U.environmentIntensity),Rt.dfgLUT!==void 0&&(Rt.dfgLUT.value=By()),Ei){if(_t.setValue(D,"toneMappingExposure",P.toneMappingExposure),Ae.needsLights&&$m(Rt,Hs),Se&&k.fog===!0&&Ue.refreshFogUniforms(Rt,Se),Ue.refreshMaterialUniforms(Rt,k,te,q,T.state.transmissionRenderTarget[b.id]),Ae.needsLights&&Ae.lightProbeGrid){let Mt=Ae.lightProbeGrid;Rt.probesSH.value=Mt.texture,Rt.probesMin.value.copy(Mt.boundingBox.min),Rt.probesMax.value.copy(Mt.boundingBox.max),Rt.probesResolution.value.copy(Mt.resolution)}ma.upload(D,Ld(Ae),Rt,K)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(ma.upload(D,Ld(Ae),Rt,K),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&_t.setValue(D,"center",V.center),_t.setValue(D,"modelViewMatrix",V.modelViewMatrix),_t.setValue(D,"normalMatrix",V.normalMatrix),_t.setValue(D,"modelMatrix",V.matrixWorld),k.uniformsGroups!==void 0){let Mt=k.uniformsGroups;for(let Ai=0,Gs=Mt.length;Ai<Gs;Ai++){let Fd=Mt[Ai];re.update(Fd,yn),re.bind(Fd,yn)}}return yn}function $m(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.sunLights.needsUpdate=U,b.sunLightShadows.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function jm(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return Z},this.setRenderTargetTextures=function(b,U,W){let k=H.get(b);k.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),H.get(b.texture).__webglTexture=U,H.get(b.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:W,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){let W=H.get(b);W.__webglFramebuffer=U,W.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,W=0){Z=b,Y=U,X=W;let k=null,V=!1,Se=!1;if(b){let ye=H.get(b);if(ye.__useDefaultFramebuffer!==void 0){S.bindFramebuffer(D.FRAMEBUFFER,ye.__webglFramebuffer),Q.copy(b.viewport),we.copy(b.scissor),Ee=b.scissorTest,S.viewport(Q),S.scissor(we),S.setScissorTest(Ee),G=-1;return}else if(ye.__webglFramebuffer===void 0)K.setupRenderTarget(b);else if(ye.__hasExternalTextures)K.rebindTextures(b,H.get(b.texture).__webglTexture,H.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let Qe=b.depthTexture;if(ye.__boundDepthTexture!==Qe){if(Qe!==null&&H.has(Qe)&&(b.width!==Qe.image.width||b.height!==Qe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(b)}}let Re=b.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(Se=!0);let Le=H.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Le[U])?k=Le[U][W]:k=Le[U],V=!0):b.samples>0&&K.useMultisampledRTT(b)===!1?k=H.get(b).__webglMultisampledFramebuffer:Array.isArray(Le)?k=Le[W]:k=Le,Q.copy(b.viewport),we.copy(b.scissor),Ee=b.scissorTest}else Q.copy(be).multiplyScalar(te).floor(),we.copy(ze).multiplyScalar(te).floor(),Ee=st;if(W!==0&&(k=z),S.bindFramebuffer(D.FRAMEBUFFER,k)&&S.drawBuffers(b,k),S.viewport(Q),S.scissor(we),S.setScissorTest(Ee),V){let ye=H.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,ye.__webglTexture,W)}else if(Se){let ye=U;for(let Re=0;Re<b.textures.length;Re++){let Le=H.get(b.textures[Re]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Re,Le.__webglTexture,W,ye)}}else if(b!==null&&W!==0){let ye=H.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,ye.__webglTexture,W)}G=-1};function Nd(b){let U=H.get(b);return(U.__readFormat!==b.format||U.__readType!==b.type)&&(U.__readFormat=b.format,U.__readType=b.type,U.__formatReadable=C.textureFormatReadable(b.format),U.__typeReadable=C.textureTypeReadable(b.type)),U}this.readRenderTargetPixels=function(b,U,W,k,V,Se,Ce,ye=0){if(!(b&&b.isWebGLRenderTarget)){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=H.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ce!==void 0&&(Re=Re[Ce]),Re){S.bindFramebuffer(D.FRAMEBUFFER,Re);try{let Le=b.textures[ye],Qe=Le.format,it=Le.type;b.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+ye);let Pe=Nd(Le);if(Pe.__formatReadable===!1){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Pe.__typeReadable===!1){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-k&&W>=0&&W<=b.height-V&&D.readPixels(U,W,k,V,xe.convert(Qe),xe.convert(it),Se)}finally{let Le=Z!==null?H.get(Z).__webglFramebuffer:null;S.bindFramebuffer(D.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(b,U,W,k,V,Se,Ce,ye=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=H.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ce!==void 0&&(Re=Re[Ce]),Re)if(U>=0&&U<=b.width-k&&W>=0&&W<=b.height-V){S.bindFramebuffer(D.FRAMEBUFFER,Re);let Le=b.textures[ye],Qe=Le.format,it=Le.type;b.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+ye);let Pe=Nd(Le);if(Pe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Pe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ft=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,ft),D.bufferData(D.PIXEL_PACK_BUFFER,Se.byteLength,D.STREAM_READ),D.readPixels(U,W,k,V,xe.convert(Qe),xe.convert(it),0),D.bindBuffer(D.PIXEL_PACK_BUFFER,null);let Dt=Z!==null?H.get(Z).__webglFramebuffer:null;S.bindFramebuffer(D.FRAMEBUFFER,Dt);let bt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await qp(D,bt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,ft),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,Se),D.bindBuffer(D.PIXEL_PACK_BUFFER,null),D.deleteBuffer(ft),D.deleteSync(bt),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,W=0){let k=Math.pow(2,-W),V=Math.floor(b.image.width*k),Se=Math.floor(b.image.height*k),Ce=U!==null?U.x:0,ye=U!==null?U.y:0;K.setTexture2D(b,0),D.copyTexSubImage2D(D.TEXTURE_2D,W,0,0,Ce,ye,V,Se),S.unbindTexture()},this.copyTextureToTexture=function(b,U,W=null,k=null,V=0,Se=0){let Ce,ye,Re,Le,Qe,it,Pe,ft,Dt,bt=b.isCompressedTexture?b.mipmaps[Se]:b.image;if(W!==null)Ce=W.max.x-W.min.x,ye=W.max.y-W.min.y,Re=W.isBox3?W.max.z-W.min.z:1,Le=W.min.x,Qe=W.min.y,it=W.isBox3?W.min.z:0;else{let Rt=Math.pow(2,-V);Ce=Math.floor(bt.width*Rt),ye=Math.floor(bt.height*Rt),b.isDataArrayTexture?Re=bt.depth:b.isData3DTexture?Re=Math.floor(bt.depth*Rt):Re=1,Le=0,Qe=0,it=0}k!==null?(Pe=k.x,ft=k.y,Dt=k.z):(Pe=0,ft=0,Dt=0);let vt=xe.convert(U.format),qt=xe.convert(U.type),Ae;U.isData3DTexture?(K.setTexture3D(U,0),Ae=D.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(K.setTexture2DArray(U,0),Ae=D.TEXTURE_2D_ARRAY):(K.setTexture2D(U,0),Ae=D.TEXTURE_2D),S.activeTexture(D.TEXTURE0),S.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),S.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),S.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);let tn=S.getParameter(D.UNPACK_ROW_LENGTH),at=S.getParameter(D.UNPACK_IMAGE_HEIGHT),yn=S.getParameter(D.UNPACK_SKIP_PIXELS),Yn=S.getParameter(D.UNPACK_SKIP_ROWS),Ei=S.getParameter(D.UNPACK_SKIP_IMAGES);S.pixelStorei(D.UNPACK_ROW_LENGTH,bt.width),S.pixelStorei(D.UNPACK_IMAGE_HEIGHT,bt.height),S.pixelStorei(D.UNPACK_SKIP_PIXELS,Le),S.pixelStorei(D.UNPACK_SKIP_ROWS,Qe),S.pixelStorei(D.UNPACK_SKIP_IMAGES,it);let Hs=b.isDataArrayTexture||b.isData3DTexture,_t=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){let Rt=H.get(b),wi=H.get(U),Mt=H.get(Rt.__renderTarget),Ai=H.get(wi.__renderTarget);S.bindFramebuffer(D.READ_FRAMEBUFFER,Mt.__webglFramebuffer),S.bindFramebuffer(D.DRAW_FRAMEBUFFER,Ai.__webglFramebuffer);for(let Gs=0;Gs<Re;Gs++)Hs&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,H.get(b).__webglTexture,V,it+Gs),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,H.get(U).__webglTexture,Se,Dt+Gs)),D.blitFramebuffer(Le,Qe,Ce,ye,Pe,ft,Ce,ye,D.DEPTH_BUFFER_BIT,D.NEAREST);S.bindFramebuffer(D.READ_FRAMEBUFFER,null),S.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(V!==0||b.isRenderTargetTexture||H.has(b)){let Rt=H.get(b),wi=H.get(U);S.bindFramebuffer(D.READ_FRAMEBUFFER,L),S.bindFramebuffer(D.DRAW_FRAMEBUFFER,B);for(let Mt=0;Mt<Re;Mt++)Hs?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Rt.__webglTexture,V,it+Mt):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Rt.__webglTexture,V),_t?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,wi.__webglTexture,Se,Dt+Mt):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,wi.__webglTexture,Se),V!==0?D.blitFramebuffer(Le,Qe,Ce,ye,Pe,ft,Ce,ye,D.COLOR_BUFFER_BIT,D.NEAREST):_t?D.copyTexSubImage3D(Ae,Se,Pe,ft,Dt+Mt,Le,Qe,Ce,ye):D.copyTexSubImage2D(Ae,Se,Pe,ft,Le,Qe,Ce,ye);S.bindFramebuffer(D.READ_FRAMEBUFFER,null),S.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else _t?b.isDataTexture||b.isData3DTexture?D.texSubImage3D(Ae,Se,Pe,ft,Dt,Ce,ye,Re,vt,qt,bt.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(Ae,Se,Pe,ft,Dt,Ce,ye,Re,vt,bt.data):D.texSubImage3D(Ae,Se,Pe,ft,Dt,Ce,ye,Re,vt,qt,bt):b.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,Se,Pe,ft,Ce,ye,vt,qt,bt.data):b.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,Se,Pe,ft,bt.width,bt.height,vt,bt.data):D.texSubImage2D(D.TEXTURE_2D,Se,Pe,ft,Ce,ye,vt,qt,bt);S.pixelStorei(D.UNPACK_ROW_LENGTH,tn),S.pixelStorei(D.UNPACK_IMAGE_HEIGHT,at),S.pixelStorei(D.UNPACK_SKIP_PIXELS,yn),S.pixelStorei(D.UNPACK_SKIP_ROWS,Yn),S.pixelStorei(D.UNPACK_SKIP_IMAGES,Ei),Se===0&&U.generateMipmaps&&D.generateMipmap(Ae),S.unbindTexture()},this.initRenderTarget=function(b){H.get(b).__webglFramebuffer===void 0&&K.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?K.setTextureCube(b,0):b.isData3DTexture?K.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?K.setTexture2DArray(b,0):K.setTexture2D(b,0),S.unbindTexture()},this.resetState=function(){Y=0,X=0,Z=null,S.reset(),Te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}});Xn();Xn();var _a={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};Xn();Xn();var Xt=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},zy=new An(-1,1,1,-1,0,1),Ed=class extends We{constructor(){super(),this.setAttribute("position",new Me([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Me([0,2,0,0,2,0],2))}},ky=new Ed,In=class{constructor(e){this._mesh=new mt(ky,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,zy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var bi=class extends Xt{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof ct?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=en.clone(e.uniforms),this.material=new ct({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new In(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Gl=class extends Xt{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}},hu=class extends Xt{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var du=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new ee);this._width=n.width,this._height=n.height,t=new yt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ct}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new bi(_a),this.copyPass.material.blending=on,this.timer=new Is}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let i=0,r=this.passes.length;i<r;i++){let a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Gl!==void 0&&(a instanceof Gl?n=!0:a instanceof hu&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new ee);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};Xn();var fu=class extends Xt{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new le}render(e,t,n){let i=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=i}};Xn();Xn();var Lm={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new le(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var xa=class s extends Xt{constructor(e,t=1,n,i){super(),this.strength=t,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new ee(e.x,e.y):new ee(256,256),this.clearColor=new le(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new yt(r,a,{type:Ct,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let d=new yt(r,a,{type:Ct,depthBuffer:!1});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let h=new yt(r,a,{type:Ct,depthBuffer:!1});h.texture.name="UnrealBloomPass.v"+u,h.texture.generateMipmaps=!1,this.renderTargetsVertical.push(h),r=Math.round(r/2),a=Math.round(a/2)}let o=Lm;this.highPassUniforms=en.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ct({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new ee(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=en.clone(_a.uniforms),this.blendMaterial=new ct({uniforms:this.copyUniforms,vertexShader:_a.vertexShader,fragmentShader:_a.fragmentShader,premultipliedAlpha:!0,blending:Ji,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new le,this._oldClearAlpha=1,this._basic=new _n,this._fsQuad=new In(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new ee(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let a=0;a<e;a++)t.push(.39894*Math.exp(-.5*a*a/(n*n))/n);let i=[],r=[];for(let a=1;a<e;a+=2){let o=t[a],l=a+1<e?t[a+1]:0,c=o+l;i.push((a*o+(a+1)*l)/c),r.push(c)}return new ct({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new ee(.5,.5)},direction:{value:new ee(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:i},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new ct({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};xa.BlurDirectionX=new ee(1,0);xa.BlurDirectionY=new ee(0,1);Xn();var Wl={name:"BokehShader",defines:{DEPTH_PACKING:1,PERSPECTIVE_CAMERA:1},uniforms:{tColor:{value:null},tDepth:{value:null},focus:{value:1},aspect:{value:1},aperture:{value:.025},maxblur:{value:.01},nearClip:{value:1},farClip:{value:1e3}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		varying vec2 vUv;

		uniform sampler2D tColor;
		uniform sampler2D tDepth;

		uniform float maxblur; // max blur amount
		uniform float aperture; // aperture - bigger values for shallower depth of field

		uniform float nearClip;
		uniform float farClip;

		uniform float focus;
		uniform float aspect;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, nearClip, farClip );
			#else
			return orthographicDepthToViewZ( depth, nearClip, farClip );
			#endif
		}


		void main() {

			vec2 aspectcorrect = vec2( 1.0, aspect );

			float viewZ = getViewZ( getDepth( vUv ) );

			float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

			vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );

			vec2 dofblur9 = dofblur * 0.9;
			vec2 dofblur7 = dofblur * 0.7;
			vec2 dofblur4 = dofblur * 0.4;

			vec4 col = vec4( 0.0 );

			col += texture2D( tColor, vUv.xy );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );

			gl_FragColor = col / 41.0;
			gl_FragColor.a = 1.0;

		}`};var pu=class extends Xt{constructor(e,t,n){super(),this.scene=e,this.camera=t;let i=n.focus!==void 0?n.focus:1,r=n.aperture!==void 0?n.aperture:.025,a=n.maxblur!==void 0?n.maxblur:1;this._renderTargetDepth=new yt(1,1,{minFilter:Tt,magFilter:Tt,type:Ct}),this._renderTargetDepth.texture.name="BokehPass.depth",this._materialDepth=new Wi,this._materialDepth.depthPacking=su,this._materialDepth.blending=on;let o=en.clone(Wl.uniforms);o.tDepth.value=this._renderTargetDepth.texture,o.focus.value=i,o.aspect.value=t.aspect,o.aperture.value=r,o.maxblur.value=a,o.nearClip.value=t.near,o.farClip.value=t.far,this.materialBokeh=new ct({defines:Object.assign({},Wl.defines),uniforms:o,vertexShader:Wl.vertexShader,fragmentShader:Wl.fragmentShader}),this.uniforms=o,this._fsQuad=new In(this.materialBokeh),this._oldClearColor=new le}render(e,t,n){this.scene.overrideMaterial=this._materialDepth,e.getClearColor(this._oldClearColor);let i=e.getClearAlpha(),r=e.autoClear;e.autoClear=!1,e.setClearColor(16777215),e.setClearAlpha(1),e.setRenderTarget(this._renderTargetDepth),e.clear(),e.render(this.scene,this.camera),this.uniforms.tColor.value=n.texture,this.uniforms.nearClip.value=this.camera.near,this.uniforms.farClip.value=this.camera.far,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),e.clear(),this._fsQuad.render(e)),this.scene.overrideMaterial=null,e.setClearColor(this._oldClearColor),e.setClearAlpha(i),e.autoClear=r}setSize(e,t){this.materialBokeh.uniforms.aspect.value=e/t,this._renderTargetDepth.setSize(e,t)}dispose(){this._renderTargetDepth.dispose(),this._materialDepth.dispose(),this.materialBokeh.dispose(),this._fsQuad.dispose()}};Xn();var Um={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		uniform float intensity;
		uniform bool grayscale;
		uniform float time;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			float noise = rand( fract( vUv + time ) );

			vec3 color = base.rgb + base.rgb * clamp( 0.1 + noise, 0.0, 1.0 );

			color = mix( base.rgb, color, intensity );

			if ( grayscale ) {

				color = vec3( luminance( color ) ); // assuming linear-srgb

			}

			gl_FragColor = vec4( color, base.a );

		}`};var mu=class extends Xt{constructor(e=.5,t=!1){super();let n=Um;this.uniforms=en.clone(n.uniforms),this.material=new ct({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=e,this.uniforms.grayscale.value=t,this._fsQuad=new In(this.material)}render(e,t,n,i){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=i,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};Xn();var Xl={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var gu=class extends Xt{constructor(){super(),this.isOutputPass=!0,this.uniforms=en.clone(Xl.uniforms),this.material=new Gi({name:Xl.name,uniforms:this.uniforms,vertexShader:Xl.vertexShader,fragmentShader:Xl.fragmentShader}),this._fsQuad=new In(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},et.getTransfer(this._outputColorSpace)===ot&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===$r?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===jr?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Qr?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ki?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ta?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===na?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ea&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function _u(s){let e=s>>>0||1;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var zS=(()=>{let s=_u(1337),e=[];for(let t=0;t<256;t++)e[t]=t;for(let t=255;t>0;t--){let n=Math.floor(s()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e.concat(e)})();var ks=(s,e,t)=>{let n=Math.min(1,Math.max(0,(t-s)/(e-s)));return n*n*(3-2*n)},Vs=s=>Math.min(1,Math.max(0,s));function wd(s){let t=document.createElement("canvas");t.width=t.height=128;let n=t.getContext("2d");if(s==="soft"){let i=n.createRadialGradient(64,64,0,64,64,64);i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.35,"rgba(255,255,255,.55)"),i.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=i,n.fillRect(0,0,128,128)}else if(s==="ring"){let i=n.createRadialGradient(64,64,38.4,64,64,64);i.addColorStop(0,"rgba(255,255,255,0)"),i.addColorStop(.7,"rgba(255,220,180,.35)"),i.addColorStop(.85,"rgba(255,255,255,.5)"),i.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=i,n.fillRect(0,0,128,128)}else{let i=n.createLinearGradient(0,0,0,128);i.addColorStop(0,"rgba(255,255,255,0)"),i.addColorStop(.5,"rgba(255,255,255,.9)"),i.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=i,n.fillRect(128/2-3,0,6,128)}return new Ss(t)}function Nm(s,e,t,n={}){let i=new Hl({canvas:s,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});return i.setPixelRatio(1),i.setSize(e,t,!1),i.shadowMap.enabled=!0,i.shadowMap.type=Yi,i.toneMapping=Ki,i.toneMappingExposure=n.exposure==null?.6:n.exposure,i}function Fm(s,e,t,n,i,r={}){let a=new du(s);a.addPass(new fu(e,t));let o=new bi({uniforms:{tDiffuse:{value:null},uMax:{value:r.clampMax||48}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float uMax; varying vec2 vUv;
      void main(){ vec4 c = texture2D(tDiffuse, vUv); bvec3 bad = bvec3(!(c.r == c.r) || c.r > 1e30, !(c.g == c.g) || c.g > 1e30, !(c.b == c.b) || c.b > 1e30);
        if (any(bad)) c.rgb = vec3(0.0); gl_FragColor = vec4(min(c.rgb, vec3(uMax)), 1.0); }`});a.addPass(o);let l=new xa(new ee(n,i),r.bloom==null?.22:r.bloom,.6,r.bloomThreshold==null?.9:r.bloomThreshold);a.addPass(l);let c=new bi({uniforms:{tDiffuse:{value:null},uSun:{value:new ee(.5,.5)},uAmount:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform vec2 uSun; uniform float uAmount; varying vec2 vUv;
      float dither(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){ vec3 base = texture2D(tDiffuse, vUv).rgb; if (uAmount <= 0.001) { gl_FragColor = vec4(base, 1.0); return; }
        const int N = 64; vec2 d = (vUv - uSun) / float(N) * 0.55;
        vec2 p = vUv - d * dither(gl_FragCoord.xy); float illum = 1.0; vec3 acc = vec3(0.0);
        for (int i = 0; i < N; i++) { p -= d; vec3 s = texture2D(tDiffuse, p).rgb; float l = max(0.0, dot(s, vec3(0.3, 0.59, 0.11)) - 0.7);
          acc += s * l * illum; illum *= 0.972; }
        acc /= float(N) * 0.25;
        float edge = 1.0 - smoothstep(0.6, 1.4, length(uSun - 0.5) * 2.0);
        float sky = smoothstep(uSun.y - 0.04, uSun.y + 0.12, vUv.y);
        gl_FragColor = vec4(base + min(acc, vec3(1.2)) * (uAmount * 0.55) * edge * sky, 1.0); }`});a.addPass(c);let u=new pu(e,t,{focus:900,aperture:r.aperture==null?4e-5:r.aperture,maxblur:r.maxblur==null?.0035:r.maxblur});a.addPass(u);let d=new bi({uniforms:{tDiffuse:{value:null},uWarm:{value:.5},uVig:{value:r.vignette==null?.42:r.vignette},uLift:{value:0},uCA:{value:r.ca==null?1.2:r.ca}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float uWarm, uVig, uLift, uCA; varying vec2 vUv;
      void main(){ vec2 d = vUv - 0.5; vec2 off = d * (uCA / 1920.0) * length(d) * 4.0;
        vec3 c = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
        float l = dot(c, vec3(0.299, 0.587, 0.114));
        vec3 shadows = vec3(0.92, 0.98, 1.08), highs = vec3(1.08, 1.0, 0.92);
        c *= mix(shadows, highs, smoothstep(0.15, 0.85, l)) * mix(vec3(1.0), vec3(1.05, 0.98, 0.9), uWarm);
        c = c * (1.0 - uLift) + uLift * 0.06;
        c *= 1.0 - uVig * smoothstep(0.35, 0.95, length(d) * 1.4);
        gl_FragColor = vec4(c, 1.0); }`});a.addPass(d);let h=new mu(r.grain==null?.16:r.grain,!1);a.addPass(h),a.addPass(new gu);let f=new R;return{composer:a,guard:o,bloom:l,rays:c,bokeh:u,grade:d,film:h,sunOnScreen:_=>(t.updateMatrixWorld(),f.copy(_).multiplyScalar(2e4).add(t.position).project(t),c.uniforms.uSun.value.set(f.x*.5+.5,f.y*.5+.5),f.z<1)}}function Om(s,e,t,n,i){window.__nativeBlur=!0;let r=new yt(t,n,{type:Ct,depthBuffer:!1,stencilBuffer:!1}),a=new Bi,o=new An(-1,1,1,-1,0,1),l=new ct({uniforms:{tex:{value:null},w:{value:1}},depthTest:!1,depthWrite:!1,transparent:!0,blending:Ko,blendSrc:Jr,blendDst:Jr,blendEquation:ni,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:"uniform sampler2D tex; uniform float w; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(tex, vUv).rgb * w, 1.0); }"}),c=new ct({uniforms:{tex:{value:null}},depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:"uniform sampler2D tex; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(tex, vUv).rgb, 1.0); }"}),u=new mt(new Qn(2,2),l);a.add(u);let{composer:d,film:h}=e;return function(p){let _=Math.max(1,Math.floor(window.__blur||1));if(_===1){i(p),h.uniforms.time.value=p,d.renderToScreen=!0,d.render(0);return}let g=window.__fps||30,m=window.__shutter==null?.5:window.__shutter;d.renderToScreen=!1;let y=s.autoClear;s.setRenderTarget(r),s.setClearColor(0,1),s.clear(),s.setRenderTarget(null);for(let M=0;M<_;M++)i(Math.max(0,p-m/g*(M/_))),h.uniforms.time.value=p,d.render(0),u.material=l,l.uniforms.tex.value=d.readBuffer.texture,l.uniforms.w.value=1/_,s.setRenderTarget(r),s.autoClear=!1,s.render(a,o),s.autoClear=y,s.setRenderTarget(null);u.material=c,c.uniforms.tex.value=r.texture,s.setRenderTarget(null),s.render(a,o)}}function Bm(s,e,t={}){let n=new zs(s),i=new Bi,r=new ct({side:Gt,depthWrite:!1,uniforms:{uTop:{value:new le(t.top||8233676)},uHor:{value:new le(t.horizon||15781792)},uGround:{value:new le(t.ground||3815978)},uSun:{value:(t.sun||new R(0,.3,-1)).clone().normalize()},uSunCol:{value:new le(t.sunColor||16765594)},uSunPow:{value:t.sunPower==null?6:t.sunPower}},vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform vec3 uTop, uHor, uGround, uSun, uSunCol; uniform float uSunPow; varying vec3 vD;
      void main(){ vec3 d = normalize(vD); vec3 c = d.y > 0.0 ? mix(uHor, uTop, pow(d.y, 0.55)) : mix(uHor, uGround, pow(-d.y, 0.4));
        float g = max(dot(d, uSun), 0.0); c += uSunCol * (pow(g, 64.0) * uSunPow + pow(g, 6.0) * 0.35); gl_FragColor = vec4(c, 1.0); }`});i.add(new mt(new Hi(100,48,24),r));let a=n.fromScene(i,0,.1,1e3);return e.environment=a.texture,n.dispose(),a.texture}function zm(s,e={}){let t=e.width||60,n=e.depth||30,i=e.seconds||10,r=new Qn(t,n,e.segX||480,e.segZ||240);r.rotateX(-Math.PI/2),s.wrapS=kt,s.wrapT=kt,s.minFilter=xt;let a={uH:{value:s},uScroll:{value:0},uSpan:{value:e.window||4},uSec:{value:i},uAmp:{value:e.amp||6},uT:{value:0},uKick:{value:0},uGlow:{value:e.glow==null?1.2:e.glow},uLava:{value:e.lava==null?.62:e.lava},uLight:{value:(e.light||new R(1,.35,.2)).clone().normalize()},uLightCol:{value:new le(e.lightColor||16751210)},uFillCol:{value:new le(e.fillColor||2759242)},uRock:{value:new le(e.rock||1708566)},uHead:{value:e.head==null?0:e.head},uHeadAmt:{value:0},uHalf:{value:e.half||n/2}},o=new ct({uniforms:en.merge([pe.fog,{}]),fog:e.fog!==!1,vertexShader:`#include <fog_pars_vertex>
      uniform sampler2D uH; uniform float uScroll, uSpan, uSec, uAmp, uKick, uHalf; varying float vH; varying vec2 vUv; varying float vBass; varying vec3 vW; varying float vLX; varying float vFy;
      // the canyon: low frequencies in the middle, highs on the walls; past uHalf the top wall carries on to the plane's edge
      float fyOf(vec3 p){ return min(1.0, abs(p.z) / uHalf); }
      float hAt(vec2 uv, float fy){ float tx = clamp((uScroll + (uv.x - 0.5) * uSpan) / uSec, 0.0, 1.0);
        return texture2D(uH, vec2(tx, 1.0 - fy)).r; }
      void main(){ vUv = uv; float fy = fyOf(position); float h = hAt(uv, fy); vFy = fy;
        vec3 p = position; p.y += (h * h) * uAmp * (0.25 + fy * 1.4) + fy * fy * uAmp * 0.6 - (1.0 - fy) * (1.0 - fy) * uAmp * 0.25 * (1.0 + uKick * 0.6);
        vH = h; vBass = (1.0 - smoothstep(0.0, 0.18, fy)) * h; vLX = p.x;
        vec4 wp = modelMatrix * vec4(p, 1.0); vW = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`#include <fog_pars_fragment>
      uniform float uGlow, uKick, uLava, uHead, uHeadAmt; uniform vec3 uLight, uLightCol, uFillCol, uRock;
      varying float vH; varying vec2 vUv; varying float vBass; varying vec3 vW; varying float vLX; varying float vFy;
      vec3 magma(float x){ x = clamp(x, 0.0, 1.0);
        vec3 a = mix(vec3(0.0, 0.0, 0.016), vec3(0.157, 0.043, 0.33), smoothstep(0.0, 0.2, x));
        a = mix(a, vec3(0.47, 0.11, 0.43), smoothstep(0.2, 0.4, x)); a = mix(a, vec3(0.75, 0.23, 0.46), smoothstep(0.4, 0.6, x));
        a = mix(a, vec3(0.93, 0.41, 0.35), smoothstep(0.6, 0.75, x)); a = mix(a, vec3(0.98, 0.65, 0.29), smoothstep(0.75, 0.88, x));
        a = mix(a, vec3(0.99, 0.99, 0.75), smoothstep(0.88, 1.0, x)); return pow(a, vec3(2.2)); }   // the ramp is sRGB; light is linear
      void main(){
        vec3 n = normalize(cross(dFdx(vW), dFdy(vW))); if (n.y < 0.0) n = -n;   // faceted normal from the displaced surface
        vec3 v = normalize(cameraPosition - vW);
        float dif = max(dot(n, uLight), 0.0), up = 0.5 + 0.5 * n.y, rim = pow(1.0 - max(dot(n, v), 0.0), 4.0);
        vec3 rock = uRock * (uLightCol * dif * 1.6 + uFillCol * up * 1.2) + uLightCol * rim * 0.06 * (0.4 + vH);
        float fyy = vFy;
        float lava = smoothstep(uLava, 1.0, vH) * mix(1.0, 0.2, smoothstep(0.4, 0.85, fyy));   // the loudest cells melt; the high walls stay rock
        vec3 c = mix(rock, magma(0.35 + 0.65 * vH) * uGlow * 1.25, lava);
        c += magma(0.72 + 0.28 * vBass) * vBass * vBass * (1.4 + 2.2 * uKick);   // the bass river, punched by kicks
        float head = exp(-pow((vLX - uHead) / 0.07, 2.0)) * uHeadAmt;             // the playhead traces the sound's cross-section
        c += vec3(1.0, 0.62, 0.32) * head * (0.4 + 0.9 * vH) * (1.0 - smoothstep(0.45, 0.85, vFy));   // on the floor and lower slopes only
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`});Object.assign(o.uniforms,a);let l=new mt(r,o);return l.frustumCulled=!1,l.userData.set=(c,u,d=0,h=0)=>{a.uT.value=c,a.uScroll.value=u??c,a.uKick.value=d,a.uHeadAmt.value=h},l.userData.uniforms=a,l}function km(s,e,t={}){let n=e.fps||30,i=e.tape||[],r=i.length,a=s.width,o=s.height,l=document.createElement("canvas");l.width=a,l.height=o;let c=l.getContext("2d");c.drawImage(s,0,0);let u=c.getImageData(0,0,a,o).data,d=r?i[r-1]:a/n,h=t.width||Math.max(64,Math.round(d*n*2)),f=document.createElement("canvas");f.width=h,f.height=o;let p=f.getContext("2d"),_=p.createImageData(h,o),g=0;for(let y=0;y<h;y++){let M=y/(h-1)*d;for(;g<r-2&&i[g+1]<M;)g++;let x=i[g],E=i[Math.min(r-1,g+1)],T=E>x?Vs((M-x)/(E-x)):0,A=Math.min(a-1,(g+T)/n*(a/Math.max(1e-6,r/n))),v=Math.floor(A),w=Math.min(a-1,v+1),P=A-v;for(let I=0;I<o;I++){let F=u[(I*a+v)*4]*(1-P)+u[(I*a+w)*4]*P,z=(I*h+y)*4;_.data[z]=_.data[z+1]=_.data[z+2]=F,_.data[z+3]=255}}p.putImageData(_,0,0);let m=new Ss(f);return m.colorSpace=Pn,{texture:m,seconds:d}}function Vm(s,e={}){let t=e.per||60,n=s.length*t,i=_u(e.seed||5),r=new Float32Array(n*3),a=new Float32Array(n),o=new Float32Array(n*3),l=new Float32Array(n),c=new Float32Array(n);for(let _=0;_<n;_++){let g=i()*Math.PI*2,m=.4+i()*.6,y=(e.speed||5)*(.35+i()*.9);o[_*3]=Math.cos(g)*y*.55,o[_*3+1]=m*y,o[_*3+2]=Math.sin(g)*y*.55,l[_]=.5+i()*1.1,c[_]=.5+i()}let u=new We;u.setAttribute("position",new rt(r,3)),u.setAttribute("alpha",new rt(a,1)),u.setAttribute("size",new rt(c,1));let d=new ct({uniforms:{uTex:{value:wd("soft")},uCol:{value:new le(e.color||16752704)},uSize:{value:e.size||9}},vertexShader:`attribute float alpha; attribute float size; uniform float uSize; varying float vA;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; vA = alpha;
        gl_PointSize = uSize * size * 10.0 / max(0.5, -mv.z); }`,fragmentShader:`uniform sampler2D uTex; uniform vec3 uCol; varying float vA;
      void main(){ vec4 s = texture2D(uTex, gl_PointCoord); gl_FragColor = vec4(uCol * (1.0 + 2.5 * vA), s.a * vA); }`,transparent:!0,depthWrite:!1,blending:Ji}),h=new vs(u,d);h.frustumCulled=!1;let f=e.gravity==null?6:e.gravity,p=e.drift||0;return h.userData.set=(_,g)=>{let m=g(_);s.forEach((y,M)=>{let x=m-g(y.t),E=_>=y.t;for(let T=0;T<t;T++){let A=M*t+T,v=E?x:-1;if(v<0||v>l[A]){a[A]=0,r[A*3+1]=-999;continue}r[A*3]=y.x+o[A*3]*v-p*v,r[A*3+1]=y.y+o[A*3+1]*v-.5*f*v*v,r[A*3+2]=y.z+o[A*3+2]*v;let w=v/l[A];a[A]=(1-w)*(1-w)*Math.min(1,v*30)}}),u.attributes.position.needsUpdate=!0,u.attributes.alpha.needsUpdate=!0},h}function Hm(s={}){let e=new bi({uniforms:{tDiffuse:{value:null},uChroma:{value:0},uSlice:{value:0},uNegative:{value:0},uMono:{value:0},uWarp:{value:0},uFrame:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float uChroma, uSlice, uNegative, uMono, uWarp, uFrame; varying vec2 vUv;
      float h1(float x){ return fract(sin(x * 91.345 + uFrame * 7.13) * 43758.5453); }
      void main(){ vec2 uv = vUv;
        float band = floor(uv.y * 24.0); float r = h1(band);
        uv.x += (r > 0.72 ? (h1(band + 3.0) - 0.5) * 0.12 * uSlice : 0.0);            // slice displacement on chosen bands
        uv.y += sin(uv.x * 6.2832 + uFrame * 0.3) * 0.01 * uWarp;                      // a breathing tape warp
        vec2 d = (uv - 0.5) * 0.012 * uChroma;
        vec3 c = vec3(texture2D(tDiffuse, uv + d).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - d).b);
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
        c = mix(c, pow(vec3(l) * 1.35, vec3(1.25)) * vec3(0.78, 0.88, 1.0), uMono);            // freeze: cold silver monochrome (time stopped)
        c = mix(c, (vec3(1.0) - c) * 0.8, uNegative);                                           // negative tear: keep it to a few frames
        gl_FragColor = vec4(c, 1.0); }`});return e.userData={set:t=>{let n=e.uniforms;for(let i in t){let r="u"+i[0].toUpperCase()+i.slice(1);n[r]&&(n[r].value=t[i])}}},e}var xu={fps:30,frames:302,seconds:10.067,bpm:120.97,beats:[0,.491,.971,1.493,1.973,2.475,2.965,3.467,3.968,4.469,4.971,5.472,5.973,6.443,6.944,7.445,7.925,8.416,8.917,9.419,9.92],downbeats:[0,1.973,3.968,5.973,7.925,9.92],kicks:[2,2.5,3,3.5,4,4.5,5,5.5,6,6.8,7.2,7.7,8.2,8.7,9.2,9.7],onsets:[2,2.233,2.367,2.5,2.733,2.867,3,3.233,3.367,3.5,3.733,3.867,4,4.233,4.367,4.5,4.733,4.867,5,5.233,5.367,5.5,5.733,5.867,6,6.367,7.533,7.7,7.933,8.067,8.2,8.433,8.567,8.7,8.933,9.067,9.2,9.433,9.567,9.7,9.933],rms:[.1420000046491623,.1340000033378601,.11900000274181366,.10700000077486038,.10199999809265137,.08799999952316284,.08399999886751175,.08299999684095383,.07699999958276749,.07500000298023224,.06800000369548798,.06599999964237213,.07199999690055847,.07000000029802322,.07100000232458115,.1770000010728836,.17399999499320984,.15800000727176666,.16099999845027924,.1469999998807907,.1379999965429306,.12099999934434891,.11800000071525574,.11999999731779099,.1120000034570694,.11100000143051147,.10599999874830246,.11400000005960464,.11100000143051147,.11699999868869781,.1770000010728836,.15700000524520874,.1509999930858612,.13099999725818634,.12200000137090683,.11699999868869781,.11400000005960464,.10899999737739563,.10899999737739563,.10100000351667404,.09600000083446503,.09600000083446503,.09300000220537186,.0860000029206276,.0820000022649765,.17499999701976776,.16300000250339508,.15199999511241913,.14399999380111694,.13600000739097595,.12399999797344208,.11299999803304672,.1509999930858612,.18799999356269836,.16099999845027924,.1550000011920929,.13699999451637268,.12700000405311584,.10899999737739563,.08299999684095383,.9850000143051147,.9380000233650208,.8799999952316284,.8009999990463257,.7429999709129333,.6819999814033508,.5910000205039978,.5759999752044678,.3919999897480011,.527999997138977,.2809999883174896,.4749999940395355,.20100000500679016,.31700000166893005,.08100000023841858,.9810000061988831,.9380000233650208,.8809999823570251,.800000011920929,.7450000047683716,.6819999814033508,.5910000205039978,.5740000009536743,.39500001072883606,.5289999842643738,.27300000190734863,.4749999940395355,.19599999487400055,.32600000500679016,.08299999684095383,.9750000238418579,.9369999766349792,.8830000162124634,.7960000038146973,.7480000257492065,.6830000281333923,.5950000286102295,.5740000009536743,.39500001072883606,.5299999713897705,.27900001406669617,.4740000069141388,.19599999487400055,.3179999887943268,.07599999755620956,.9750000238418579,.9380000233650208,.8809999823570251,.8040000200271606,.7440000176429749,.6809999942779541,.593999981880188,.5730000138282776,.39500001072883606,.5299999713897705,.2759999930858612,.4729999899864197,.19900000095367432,.31299999356269836,.06599999964237213,.9900000095367432,.8880000114440918,.9800000190734863,.8659999966621399,.8410000205039978,.7549999952316284,.6060000061988831,.6029999852180481,.6190000176429749,.5019999742507935,.3610000014305115,.23000000417232513,.09799999743700027,.11500000208616257,.0560000017285347,.9890000224113464,.8920000195503235,.9789999723434448,.8650000095367432,.8420000076293945,.7559999823570251,.6069999933242798,.6050000190734863,.6190000176429749,.5049999952316284,.36500000953674316,.2370000034570694,.11800000071525574,.13099999725818634,.07699999958276749,.9879999756813049,.890999972820282,.9789999723434448,.8659999966621399,.8410000205039978,.7559999823570251,.6039999723434448,.6029999852180481,.6200000047683716,.503000020980835,.3610000014305115,.2329999953508377,.10999999940395355,.12999999523162842,.07199999690055847,.9890000224113464,.8899999856948853,.9800000190734863,.8650000095367432,.8420000076293945,.7570000290870667,.6060000061988831,.6029999852180481,.6209999918937683,.5049999952316284,.36399999260902405,.23600000143051147,.11900000274181366,.1379999965429306,.08100000023841858,.9779999852180481,.9269999861717224,.9649999737739563,.902999997138977,.8880000114440918,.8180000185966492,.7900000214576721,.6579999923706055,.5960000157356262,.5249999761581421,.5440000295639038,.5630000233650208,.5559999942779541,.5130000114440918,.4339999854564667,.5630000233650208,.26100000739097595,.46299999952316284,.25600001215934753,.11400000005960464,.20399999618530273,.17599999904632568,.12999999523162842,.0560000017285347,.020999999716877937,.014999999664723873,.008999999612569809,.004000000189989805,.004999999888241291,.003000000026077032,.003000000026077032,.003000000026077032,.0020000000949949026,.0020000000949949026,.0020000000949949026,.0020000000949949026,.07999999821186066,.14399999380111694,.21899999678134918,.22599999606609344,.09799999743700027,.22200000286102295,.1809999942779541,.14399999380111694,.1120000034570694,.17599999904632568,.2280000001192093,.3199999928474426,.4309999942779541,.22300000488758087,.03799999877810478,1,.8610000014305115,1,1,.7760000228881836,.3700000047683716,.35899999737739563,.5789999961853027,.75,.7239999771118164,.4090000092983246,.44699999690055847,.7960000038146973,.45899999141693115,.40299999713897705,.9900000095367432,1,.7760000228881836,.9779999852180481,.6980000138282776,.6840000152587891,.4860000014305115,.6859999895095825,.5099999904632568,.4429999887943268,.21799999475479126,.38199999928474426,.3440000116825104,.414000004529953,.20200000703334808,.9929999709129333,.9430000185966492,.8059999942779541,.9539999961853027,.6880000233650208,.6830000281333923,.5170000195503235,.6759999990463257,.4880000054836273,.4490000009536743,.23399999737739563,.40700000524520874,.4059999883174896,.3959999978542328,.22499999403953552,.9890000224113464,.9049999713897705,.7649999856948853,.7570000290870667,.7670000195503235,.7580000162124634,.5720000267028809,.6349999904632568,.44699999690055847,.3479999899864197,.47600001096725464,.45500001311302185,.17599999904632568,.23399999737739563,.14499999582767487,.9929999709129333,.8980000019073486,.7730000019073486,.734000027179718,.7839999794960022,.7480000257492065,.5809999704360962,.6169999837875366,.4519999921321869,.3240000009536743,.35100001096725464],bass:[.006000000052154064,.0020000000949949026,.004000000189989805,.004999999888241291,.007000000216066837,.009999999776482582,.014000000432133675,.01600000075995922,.017000000923871994,.01899999938905239,.024000000208616257,.02800000086426735,.027000000700354576,.02800000086426735,.03400000184774399,.039000000804662704,.03500000014901161,.039000000804662704,.04800000041723251,.04800000041723251,.0430000014603138,.04600000008940697,.05299999937415123,.052000001072883606,.04600000008940697,.04899999871850014,.054999999701976776,.05299999937415123,.04699999839067459,.05000000074505806,.0560000017285347,.05299999937415123,.04600000008940697,.04699999839067459,.050999999046325684,.04800000041723251,.03999999910593033,.035999998450279236,.03700000047683716,.03400000184774399,.02800000086426735,.024000000208616257,.023000000044703484,.02199999988079071,.02500000037252903,.02800000086426735,.02500000037252903,.02199999988079071,.020999999716877937,.020999999716877937,.020999999716877937,.020999999716877937,.02199999988079071,.020999999716877937,.019999999552965164,.023000000044703484,.02199999988079071,.01899999938905239,.019999999552965164,.04100000113248825,.6859999895095825,1,.7269999980926514,.6480000019073486,.5019999742507935,.5440000295639038,.4059999883174896,.37599998712539673,.35899999737739563,.3499999940395355,.31200000643730164,.3109999895095825,.2720000147819519,.28299999237060547,.13600000739097595,.6890000104904175,1,.7210000157356262,.6499999761581421,.503000020980835,.546999990940094,.4020000100135803,.3779999911785126,.3569999933242798,.3479999899864197,.3100000023841858,.3190000057220459,.28299999237060547,.3089999854564667,.15800000727176666,.6850000023841858,1,.7319999933242798,.6520000100135803,.4959999918937683,.5580000281333923,.42500001192092896,.3840000033378601,.3659999966621399,.36500000953674316,.3199999928474426,.3160000145435333,.27799999713897705,.2919999957084656,.1509999930858612,.6800000071525574,.9940000176429749,.718999981880188,.6589999794960022,.5070000290870667,.5479999780654907,.4059999883174896,.3720000088214874,.3580000102519989,.3499999940395355,.3059999942779541,.3059999942779541,.2680000066757202,.2809999883174896,.13099999725818634,.6840000152587891,.9409999847412109,.7419999837875366,.6620000004768372,.5989999771118164,.546999990940094,.453000009059906,.37700000405311584,.4359999895095825,.3779999911785126,.3009999990463257,.2240000069141388,.13500000536441803,.0860000029206276,.05299999937415123,.6859999895095825,.9430000185966492,.7419999837875366,.6600000262260437,.5979999899864197,.546999990940094,.453000009059906,.37599998712539673,.4359999895095825,.37700000405311584,.30000001192092896,.22200000286102295,.1340000033378601,.08500000089406967,.05299999937415123,.6859999895095825,.9419999718666077,.7409999966621399,.6600000262260437,.597000002861023,.546999990940094,.45399999618530273,.37700000405311584,.43700000643730164,.3779999911785126,.30000001192092896,.22200000286102295,.1340000033378601,.08500000089406967,.05299999937415123,.6859999895095825,.9419999718666077,.7429999709129333,.6589999794960022,.5979999899864197,.546999990940094,.453000009059906,.37599998712539673,.4359999895095825,.37700000405311584,.30000001192092896,.22200000286102295,.1340000033378601,.08500000089406967,.05299999937415123,.6959999799728394,.949999988079071,.7839999794960022,.7179999947547913,.6370000243186951,.5870000123977661,.5339999794960022,.4569999873638153,.3490000069141388,.2809999883174896,.23100000619888306,.19200000166893005,.1860000044107437,.17299999296665192,.1420000046491623,.10700000077486038,.08799999952316284,.07699999958276749,.057999998331069946,.039000000804662704,.03700000047683716,.017999999225139618,.008999999612569809,.004000000189989805,.017000000923871994,.013000000268220901,.008999999612569809,.004999999888241291,.003000000026077032,.0020000000949949026,0,0,0,0,0,.0010000000474974513,.012000000104308128,.004999999888241291,.008999999612569809,.012000000104308128,.019999999552965164,.02199999988079071,.04899999871850014,.052000001072883606,.04800000041723251,.08799999952316284,.11800000071525574,.1979999989271164,.27900001406669617,.2980000078678131,.0820000022649765,.8149999976158142,.9919999837875366,.6299999952316284,.8510000109672546,.6959999799728394,.41999998688697815,.27799999713897705,.3569999933242798,.4819999933242798,.5529999732971191,.4410000145435333,.27000001072883606,.49799999594688416,.5360000133514404,.32499998807907104,.7839999794960022,1,.7710000276565552,.7770000100135803,.5730000138282776,.5590000152587891,.36000001430511475,.44200000166893005,.45500001311302185,.33500000834465027,.28200000524520874,.24500000476837158,.26899999380111694,.3630000054836273,.2070000022649765,.75,1,.6880000233650208,.7099999785423279,.5830000042915344,.5199999809265137,.3840000033378601,.4230000078678131,.4410000145435333,.3070000112056732,.2590000033378601,.21799999475479126,.27799999713897705,.296999990940094,.1469999998807907,.6959999799728394,.9860000014305115,.6370000243186951,.5600000023841858,.5199999809265137,.5649999976158142,.4309999942779541,.3919999897480011,.41200000047683716,.2549999952316284,.3009999990463257,.34700000286102295,.25200000405311584,.16500000655651093,.08699999749660492,.6819999814033508,.9729999899864197,.628000020980835,.5490000247955322,.5199999809265137,.5590000152587891,.4300000071525574,.38499999046325684,.40799999237060547,.2529999911785126,.3050000071525574],mid:[.4410000145435333,.3930000066757202,.3400000035762787,.30399999022483826,.2879999876022339,.2709999978542328,.257999986410141,.2549999952316284,.25,.23600000143051147,.2199999988079071,.20499999821186066,.21799999475479126,.22699999809265137,.23800000548362732,.6169999837875366,.5180000066757202,.46799999475479126,.453000009059906,.45899999141693115,.4320000112056732,.39399999380111694,.37599998712539673,.3659999966621399,.34700000286102295,.3310000002384186,.32499998807907104,.32899999618530273,.3050000071525574,.3149999976158142,.6669999957084656,.5400000214576721,.48500001430511475,.4300000071525574,.42100000381469727,.4169999957084656,.4090000092983246,.3840000033378601,.3779999911785126,.36500000953674316,.35199999809265137,.34700000286102295,.3240000009536743,.2809999883174896,.28999999165534973,.6769999861717224,.593999981880188,.5460000038146973,.503000020980835,.4659999907016754,.4090000092983246,.37599998712539673,.4779999852180481,.7400000095367432,.5849999785423279,.527999997138977,.47699999809265137,.4449999928474426,.3799999952316284,.33799999952316284,.9100000262260437,.6549999713897705,.4350000023841858,.2549999952316284,.21199999749660492,.17499999701976776,.15700000524520874,.1850000023841858,.29899999499320984,.24799999594688416,.22699999809265137,.2240000069141388,.257999986410141,.3479999899864197,.39100000262260437,.8650000095367432,.6349999904632568,.4180000126361847,.27399998903274536,.21400000154972076,.1940000057220459,.18400000035762787,.21799999475479126,.3059999942779541,.23399999737739563,.20800000429153442,.20900000631809235,.24899999797344208,.36800000071525574,.3959999978542328,.8870000243186951,.6470000147819519,.42399999499320984,.2770000100135803,.23999999463558197,.23000000417232513,.20999999344348907,.23800000548362732,.3529999852180481,.27799999713897705,.2549999952316284,.24899999797344208,.27300000190734863,.3700000047683716,.3889999985694885,.8989999890327454,.6539999842643738,.42500001192092896,.26600000262260437,.22699999809265137,.20399999618530273,.18199999630451202,.21199999749660492,.32100000977516174,.2529999911785126,.2409999966621399,.23600000143051147,.24400000274181366,.3160000145435333,.33899998664855957,.9359999895095825,.6549999713897705,.3959999978542328,.2370000034570694,.17100000381469727,.17299999296665192,.1550000011920929,.1850000023841858,.2770000100135803,.2240000069141388,.19900000095367432,.19599999487400055,.20100000500679016,.3140000104904175,.35100001096725464,.9330000281333923,.6520000100135803,.41499999165534973,.26499998569488525,.20999999344348907,.20399999618530273,.21199999749660492,.23999999463558197,.30300000309944153,.2639999985694885,.24899999797344208,.24899999797344208,.26100000739097595,.3619999885559082,.39800000190734863,.9179999828338623,.652999997138977,.38999998569488525,.23600000143051147,.164000004529953,.16300000250339508,.15800000727176666,.21299999952316284,.3089999854564667,.24300000071525574,.22699999809265137,.2290000021457672,.25099998712539673,.37400001287460327,.40299999713897705,.9160000085830688,.6299999952316284,.4480000138282776,.26499998569488525,.2280000001192093,.22300000488758087,.20000000298023224,.22699999809265137,.3140000104904175,.2639999985694885,.25600001215934753,.25999999046325684,.27000001072883606,.3869999945163727,.39899998903274536,.9559999704360962,.7179999947547913,.44999998807907104,.3089999854564667,.2770000100135803,.25600001215934753,.2370000034570694,.2160000056028366,.18400000035762787,.16300000250339508,.15600000321865082,.2240000069141388,.38600000739097595,.2879999876022339,.2150000035762787,.17299999296665192,.13300000131130219,.08900000154972076,.061000000685453415,.03200000151991844,.01600000075995922,.003000000026077032,.0010000000474974513,.0020000000949949026,.019999999552965164,.00800000037997961,.007000000216066837,.007000000216066837,.010999999940395355,.013000000268220901,.00800000037997961,.007000000216066837,.006000000052154064,.004999999888241291,.004999999888241291,.004999999888241291,.00800000037997961,.0010000000474974513,.007000000216066837,.017000000923871994,.03400000184774399,.05000000074505806,.06300000101327896,.0729999989271164,.07800000160932541,.08399999886751175,.09700000286102295,.11599999666213989,.14100000262260437,.23499999940395355,.25600001215934753,1,.8569999933242798,.5789999961853027,.4169999957084656,.3009999990463257,.2630000114440918,.24400000274181366,.2280000001192093,.19200000166893005,.16699999570846558,.18199999630451202,.19900000095367432,.16500000655651093,.21299999952316284,.24699999392032623,.8949999809265137,.5889999866485596,.3540000021457672,.19200000166893005,.1420000046491623,.14300000667572021,.14800000190734863,.1509999930858612,.16699999570846558,.18000000715255737,.1809999942779541,.19499999284744263,.20600000023841858,.3100000023841858,.35199999809265137,1,.8389999866485596,.4959999918937683,.25699999928474426,.21400000154972076,.164000004529953,.12700000405311584,.11299999803304672,.10599999874830246,.24500000476837158,.23999999463558197,.26100000739097595,.30000001192092896,.42399999499320984,.515999972820282,1,.7170000076293945,.41600000858306885,.27000001072883606,.24300000071525574,.24400000274181366,.2409999966621399,.23499999940395355,.24300000071525574,.2549999952316284,.25699999928474426,.28200000524520874,.33899998664855957,.4860000014305115,.5609999895095825,1,.8769999742507935,.578000009059906,.3499999940395355,.2720000147819519,.22499999403953552,.19499999284744263,.17599999904632568,.17900000512599945,.16699999570846558,.17399999499320984],high:[.08299999684095383,.05999999865889549,.041999999433755875,.029999999329447746,.023000000044703484,.023000000044703484,.024000000208616257,.023000000044703484,.019999999552965164,.02199999988079071,.02199999988079071,.02199999988079071,.02500000037252903,.02800000086426735,.028999999165534973,.20600000023841858,.14100000262260437,.1080000028014183,.09200000017881393,.07199999690055847,.06199999898672104,.0560000017285347,.04399999976158142,.04399999976158142,.04399999976158142,.041999999433755875,.0430000014603138,.04100000113248825,.041999999433755875,.04399999976158142,.30300000309944153,.1889999955892563,.14800000190734863,.11699999868869781,.0949999988079071,.08299999684095383,.07599999755620956,.06300000101327896,.05900000035762787,.05299999937415123,.05000000074505806,.04699999839067459,.04500000178813934,.0430000014603138,.04399999976158142,.20600000023841858,.1420000046491623,.11599999666213989,.09399999678134918,.07800000160932541,.06199999898672104,.052000001072883606,.09300000220537186,.16699999570846558,.10700000077486038,.0820000022649765,.06800000369548798,.05900000035762787,.04800000041723251,.08399999886751175,.5389999747276306,.0989999994635582,.02800000086426735,.020999999716877937,.017999999225139618,.017000000923871994,.01899999938905239,.49900001287460327,.8009999990463257,.10499999672174454,.032999999821186066,.31200000643730164,.23999999463558197,.10899999737739563,.12099999934434891,.5479999780654907,.12300000339746475,.04600000008940697,.03700000047683716,.03200000151991844,.027000000700354576,.02199999988079071,.5180000066757202,.8309999704360962,.13699999451637268,.05999999865889549,.3310000002384186,.25999999046325684,.12600000202655792,.14100000262260437,.5600000023841858,.1289999932050705,.050999999046325684,.04100000113248825,.035999998450279236,.029999999329447746,.023000000044703484,.5009999871253967,.8029999732971191,.1120000034570694,.03999999910593033,.3190000057220459,.2460000067949295,.11100000143051147,.12300000339746475,.5350000262260437,.0989999994635582,.026000000536441803,.02199999988079071,.01899999938905239,.01600000075995922,.017000000923871994,.5,.8069999814033508,.11599999666213989,.04500000178813934,.32199999690055847,.24500000476837158,.10999999940395355,.11800000071525574,.5569999814033508,.12200000137090683,.04699999839067459,.03400000184774399,.02800000086426735,.02500000037252903,.023000000044703484,.5189999938011169,.824999988079071,.12999999523162842,.05999999865889549,.35100001096725464,.27000001072883606,.12800000607967377,.14100000262260437,.6010000109672546,.16300000250339508,.0820000022649765,.06499999761581421,.0560000017285347,.05000000074505806,.0430000014603138,.527999997138977,.8640000224113464,.18000000715255737,.1080000028014183,.3880000114440918,.3050000071525574,.16599999368190765,.18000000715255737,.6129999756813049,.1770000010728836,.09399999678134918,.07199999690055847,.057999998331069946,.04899999871850014,.0430000014603138,.5289999842643738,.8330000042915344,.14300000667572021,.07500000298023224,.36000001430511475,.2809999883174896,.13600000739097595,.1469999998807907,.5640000104904175,.12700000405311584,.054999999701976776,.041999999433755875,.03700000047683716,.03099999949336052,.03099999949336052,.5149999856948853,.8349999785423279,.15199999511241913,.07999999821186066,.367000013589859,.28700000047683716,.14499999582767487,.15299999713897705,.5170000195503235,.18199999630451202,.10199999809265137,.06199999898672104,.04500000178813934,.03200000151991844,.02199999988079071,.014999999664723873,.012000000104308128,.00800000037997961,.006000000052154064,.6299999952316284,1,.382999986410141,.13500000536441803,.054999999701976776,.020999999716877937,.008999999612569809,.004000000189989805,.0010000000474974513,.0010000000474974513,0,0,.0020000000949949026,.01600000075995922,.004999999888241291,.01600000075995922,.012000000104308128,.006000000052154064,.006000000052154064,.003000000026077032,.0020000000949949026,.0020000000949949026,.0020000000949949026,.0020000000949949026,.0010000000474974513,.0020000000949949026,0,0,.0010000000474974513,.0010000000474974513,.0020000000949949026,.004999999888241291,.008999999612569809,.017999999225139618,.04699999839067459,.42100000381469727,.2619999945163727,.07999999821186066,.13899999856948853,.13600000739097595,.9779999852180481,.9039999842643738,.6100000143051147,.36500000953674316,.25999999046325684,.2409999966621399,.17499999701976776,.5149999856948853,.7799999713897705,.11299999803304672,.05400000140070915,.3230000138282776,.2460000067949295,.11900000274181366,.13500000536441803,.6439999938011169,.21199999749660492,.1340000033378601,.10400000214576721,.09099999815225601,.07999999821186066,.07400000095367432,.5120000243186951,.75,.10400000214576721,.04600000008940697,.3400000035762787,.257999986410141,.12800000607967377,.14900000393390656,1,.9419999718666077,.5910000205039978,.414000004529953,.2840000092983246,.21799999475479126,.1589999943971634,.5170000195503235,.7549999952316284,.5270000100135803,.35600000619888306,.6079999804496765,.5270000100135803,.4309999942779541,.4779999852180481,.8299999833106995,.3700000047683716,.26899999380111694,.23600000143051147,.210999995470047,.1809999942779541,.15700000524520874,.6000000238418579,.8529999852180481,.16599999368190765,.1120000034570694,.3880000114440918,.3140000104904175,.1899999976158142,.2160000056028366,1,1,.6579999923706055,.48399999737739563,.3310000002384186,.24899999797344208,.1889999955892563,.5540000200271606,.8009999990463257,.14100000262260437,.07599999755620956],onset:[0,.005,.008,.017,.016,.019,.017,.018,.018,.017,.02,.019,.023,.022,.032,.171,.011,.017,.025,.024,.021,.047,.017,.025,.023,.022,.023,.022,.022,.033,.211,.01,.018,.022,.024,.022,.028,.019,.024,.022,.026,.024,.02,.019,.032,.154,.013,.019,.021,.02,.019,.034,.081,.041,.011,.017,.018,.02,.016,.308,.886,.009,.011,.014,.014,.013,.016,1,.258,.005,.011,.767,.052,.062,.123,.782,.01,.011,.021,.015,.018,.024,1,.252,.007,.012,.756,.049,.064,.125,.776,.01,.01,.019,.016,.017,.018,.987,.26,.007,.012,.762,.048,.064,.124,.779,.009,.011,.018,.016,.014,.015,1,.256,.005,.011,.762,.043,.066,.122,.791,.011,.013,.014,.012,.013,.023,1,.248,.005,.01,.787,.042,.074,.121,.796,.009,.019,.017,.015,.017,.022,.982,.25,.01,.014,.758,.044,.073,.124,.79,.01,.02,.019,.015,.019,.025,.991,.249,.007,.011,.771,.044,.069,.127,.784,.009,.017,.016,.018,.015,.025,.98,.252,.008,.011,.771,.044,.073,.116,.751,.031,.028,.028,.026,.024,.024,.021,.019,.017,.016,.665,.199,.028,.018,.014,.011,.008,.004,.002,.003,.001,.001,.012,.106,.003,.076,.006,.015,.005,0,.001,.001,.001,.001,.006,.027,.001,.012,.018,.024,.027,.033,.034,.039,.093,.552,.06,.032,.163,.15,.919,.064,.053,.044,.056,.069,.047,.727,.245,.017,.02,.714,.045,.052,.138,.816,.012,.019,.022,.019,.021,.024,.93,.236,.012,.012,.775,.045,.071,.137,.907,.068,.045,.057,.054,.048,.04,.746,.231,.089,.012,.692,.047,.062,.134,.816,.015,.02,.031,.019,.021,.016,.921,.241,.012,.017,.749,.049,.071,.136,.903,.063,.051,.059,.053,.045,.043,.75,.235,.012,.026],centroid:[.13,.124,.116,.109,.102,.1,.099,.098,.097,.098,.097,.098,.099,.101,.103,.169,.154,.14,.126,.117,.114,.131,.105,.105,.105,.103,.098,.099,.104,.106,.203,.18,.168,.154,.142,.134,.131,.126,.121,.118,.119,.121,.12,.119,.122,.168,.152,.142,.133,.126,.123,.133,.132,.139,.126,.119,.116,.114,.111,.41,.602,.13,.027,.025,.028,.024,.028,.81,.958,.251,.045,.664,.593,.196,.34,.607,.134,.032,.031,.033,.028,.037,.795,.955,.265,.064,.663,.588,.193,.334,.609,.135,.033,.032,.036,.031,.035,.785,.934,.24,.049,.651,.582,.188,.329,.604,.13,.027,.026,.029,.025,.029,.803,.951,.253,.052,.662,.602,.198,.362,.604,.14,.032,.029,.028,.028,.034,.815,.918,.246,.067,.799,.812,.327,.449,.603,.147,.043,.041,.04,.04,.042,.792,.905,.255,.094,.76,.757,.313,.423,.602,.148,.045,.043,.04,.039,.045,.803,.907,.246,.076,.778,.771,.302,.422,.607,.142,.036,.034,.035,.034,.04,.798,.905,.245,.077,.758,.755,.299,.414,.562,.13,.044,.038,.034,.03,.026,.023,.022,.02,.019,.342,.381,.213,.1,.064,.033,.021,.012,.012,.007,.004,.004,.023,.265,.149,.805,.828,.345,.371,.235,.233,.235,.242,.249,.202,.039,.005,.005,.007,.016,.024,.033,.044,.07,.125,.581,.402,.124,.174,.414,.543,.264,.247,.152,.143,.181,.185,.788,.917,.189,.06,.728,.475,.154,.293,.608,.154,.062,.052,.058,.052,.067,.767,.934,.264,.058,.765,.628,.184,.322,.593,.269,.234,.195,.174,.153,.151,.797,.971,.328,.189,.707,.557,.237,.332,.576,.166,.099,.101,.098,.084,.09,.769,.936,.303,.086,.615,.577,.242,.345,.588,.277,.253,.236,.197,.15,.148,.807,.975,.33,.086],silence:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],pitch_dive:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],pitch_rise:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],speed:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,.9470000267028809,.8930000066757202,.8399999737739563,.7870000004768372,.7329999804496765,.6800000071525574,.6269999742507935,.5730000138282776,.5199999809265137,.46700000762939453,.4129999876022339,.36000001430511475,.3070000112056732,.2529999911785126,.20000000298023224,.1469999998807907,.09300000220537186,.03999999910593033,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.0729999989271164,.1469999998807907,.2199999988079071,.2930000126361847,.367000013589859,.4399999976158142,.5130000114440918,.5870000123977661,.6600000262260437,.7329999804496765,.8069999814033508,.8799999952316284,.953000009059906,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],tape:[.0333000011742115,.06669999659061432,.10000000149011612,.13330000638961792,.16670000553131104,.20000000298023224,.23330000042915344,.26669999957084656,.30000001192092896,.33329999446868896,.3666999936103821,.4000000059604645,.4332999885082245,.4666999876499176,.5,.53329998254776,.5666999816894531,.6000000238418579,.6333000063896179,.666700005531311,.699999988079071,.733299970626831,.766700029373169,.800000011920929,.833299994468689,.8666999936103821,.8999999761581421,.9333000183105469,.96670001745224,1,1.0333000421524048,1.0666999816894531,1.100000023841858,1.1332999467849731,1.166700005531311,1.2000000476837158,1.233299970626831,1.266700029373169,1.2999999523162842,1.333299994468689,1.3667000532150269,1.399999976158142,1.4333000183105469,1.4666999578475952,1.5,1.5333000421524048,1.5666999816894531,1.600000023841858,1.6332999467849731,1.666700005531311,1.7000000476837158,1.733299970626831,1.766700029373169,1.7999999523162842,1.833299994468689,1.8667000532150269,1.899999976158142,1.9333000183105469,1.9666999578475952,2,2.0332999229431152,2.066699981689453,2.0999999046325684,2.1333000659942627,2.1666998863220215,2.200000047683716,2.233299970626831,2.266700029373169,2.299999952316284,2.3333001136779785,2.3666999340057373,2.4000000953674316,2.433300018310547,2.4667000770568848,2.5,2.5332999229431152,2.566699981689453,2.5999999046325684,2.6333000659942627,2.6666998863220215,2.700000047683716,2.733299970626831,2.766700029373169,2.799999952316284,2.8333001136779785,2.8666999340057373,2.9000000953674316,2.933300018310547,2.9667000770568848,3,3.0332999229431152,3.066699981689453,3.0999999046325684,3.1333000659942627,3.1666998863220215,3.200000047683716,3.233299970626831,3.266700029373169,3.299999952316284,3.3333001136779785,3.3666999340057373,3.4000000953674316,3.433300018310547,3.4667000770568848,3.5,3.5332999229431152,3.566699981689453,3.5999999046325684,3.6333000659942627,3.6666998863220215,3.700000047683716,3.733299970626831,3.766700029373169,3.799999952316284,3.8333001136779785,3.8666999340057373,3.9000000953674316,3.933300018310547,3.9667000770568848,4,4.033299922943115,4.066699981689453,4.099999904632568,4.133299827575684,4.1666998863220215,4.199999809265137,4.23330020904541,4.26669979095459,4.300000190734863,4.3333001136779785,4.366700172424316,4.400000095367432,4.433300018310547,4.466700077056885,4.5,4.533299922943115,4.566699981689453,4.599999904632568,4.633299827575684,4.6666998863220215,4.699999809265137,4.73330020904541,4.76669979095459,4.800000190734863,4.8333001136779785,4.866700172424316,4.900000095367432,4.933300018310547,4.966700077056885,5,5.033299922943115,5.066699981689453,5.099999904632568,5.133299827575684,5.1666998863220215,5.199999809265137,5.23330020904541,5.26669979095459,5.300000190734863,5.3333001136779785,5.366700172424316,5.400000095367432,5.433300018310547,5.466700077056885,5.5,5.533299922943115,5.566699981689453,5.599999904632568,5.633299827575684,5.6666998863220215,5.699999809265137,5.73330020904541,5.76669979095459,5.800000190734863,5.8333001136779785,5.866700172424316,5.900000095367432,5.933300018310547,5.966700077056885,6,6.033299922943115,6.066699981689453,6.099999904632568,6.133299827575684,6.164899826049805,6.194699764251709,6.222700119018555,6.248899936676025,6.2733001708984375,6.296000003814697,6.31689977645874,6.335999965667725,6.353300094604492,6.368899822235107,6.382699966430664,6.394700050354004,6.404900074005127,6.413300037384033,6.420000076293945,6.424900054931641,6.427999973297119,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.429299831390381,6.43179988861084,6.436699867248535,6.443999767303467,6.453800201416016,6.466000080108643,6.4807000160217285,6.497799873352051,6.517300128936768,6.539299964904785,6.563799858093262,6.590700149536133,6.619999885559082,6.651800155639648,6.685100078582764,6.718400001525879,6.751800060272217,6.785099983215332,6.818399906158447,6.851799964904785,6.8850998878479,6.918399810791016,6.9517998695373535,6.985099792480469,7.018400192260742,7.051799774169922,7.085100173950195,7.1184000968933105,7.151800155639648,7.185100078582764,7.218400001525879,7.251800060272217,7.285099983215332,7.318399906158447,7.351799964904785,7.3850998878479,7.418399810791016,7.4517998695373535,7.485099792480469,7.518400192260742,7.551799774169922,7.585100173950195,7.6184000968933105,7.651800155639648,7.685100078582764,7.718400001525879,7.751800060272217,7.785099983215332,7.818399906158447,7.851799964904785,7.8850998878479,7.918399810791016,7.9517998695373535,7.985099792480469,8.018400192260742,8.051799774169922,8.085100173950195,8.118399620056152,8.151800155639648,8.185099601745605,8.218400001525879,8.251799583435059,8.285099983215332,8.318400382995605,8.351799964904785,8.385100364685059,8.418399810791016,8.451800346374512,8.485099792480469,8.518400192260742,8.551799774169922,8.585100173950195,8.618399620056152,8.651800155639648,8.685099601745605,8.718400001525879,8.751799583435059,8.785099983215332,8.818400382995605,8.851799964904785,8.885100364685059,8.918399810791016,8.951800346374512,8.985099792480469,9.018400192260742]};var Gm="data:image/png;base64,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";var Xm=8,Ti=120,Wm=Ti/Xm;function Gy(s,e,t){let n=window.MOTION,i=n.channels(xu),r=Z=>i.tape(Z),a=Nm(s,e,t,{exposure:.7});a.shadowMap.enabled=!1;let o=new gt.Scene;o.fog=new gt.FogExp2(1706518,.018);let l=new gt.PerspectiveCamera(36,e/t,.1,900),c={uBass:{value:0}},u=new gt.Mesh(new gt.SphereGeometry(500,48,24),new gt.ShaderMaterial({side:gt.BackSide,depthWrite:!1,fog:!1,uniforms:c,vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uBass; varying vec3 vD;
      void main(){ vec3 d = normalize(vD); float y = d.y;
        vec3 top = vec3(0.012, 0.006, 0.03), hor = vec3(0.30, 0.06, 0.10), low = vec3(0.04, 0.01, 0.02);
        vec3 c = y > 0.0 ? mix(hor, top, pow(clamp(y * 3.2, 0.0, 1.0), 0.6)) : mix(hor, low, clamp(-y * 6.0, 0.0, 1.0));
        vec3 e = normalize(vec3(1.0, 0.075, 0.0)); float g = max(dot(d, e), 0.0), r = acos(min(1.0, g));
        float disc = 1.0 - smoothstep(0.072, 0.075, r);                          // the moon's black disc
        float corona = exp(-max(0.0, r - 0.074) * (46.0 - 12.0 * uBass)) * (0.55 + 1.1 * uBass);
        c = mix(c + vec3(1.0, 0.42, 0.16) * corona + vec3(0.9, 0.2, 0.3) * pow(g, 24.0) * 0.25, vec3(0.004, 0.0, 0.006), disc);
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}));o.add(u),Bm(a,o,{top:656404,horizon:9054746,ground:1705478,sun:new gt.Vector3(1,.075,0),sunColor:16747082,sunPower:3});let d=null,h=new Promise((Z,G)=>{let J=new Image;J.onload=()=>{let{texture:Q,seconds:we}=km(J,xu);d=zm(Q,{width:Ti,depth:90,half:17,segX:960,segZ:420,window:Xm,seconds:we,amp:5.2,glow:1,lava:.72,light:new gt.Vector3(1,.32,.18),lightColor:16747088,fillColor:5913232,rock:3155500}),d.position.set(0,-1.2,0),o.add(d),Z()},J.onerror=G,J.src=Gm}),f=new gt.WebGLCubeRenderTarget(256,{type:gt.HalfFloatType,generateMipmaps:!0,minFilter:gt.LinearMipmapLinearFilter}),p=new gt.CubeCamera(.05,600,f);o.add(p);let _=new gt.Mesh(new gt.SphereGeometry(.9,128,64),new gt.MeshStandardMaterial({color:16777215,metalness:1,roughness:.06,envMap:f.texture,envMapIntensity:1}));o.add(_);let g=Vm(xu.kicks.map(Z=>({t:Z,x:0,y:.1,z:0})),{per:90,speed:6.5,gravity:7,drift:Wm,size:4.5,seed:11});o.add(g);let m=2400,y=_u(29),M=new Float32Array(m*3),x=[];for(let Z=0;Z<m;Z++)x.push([y()*Ti-Ti/2,.2+y()*9,(y()-.5)*30,.15+y()*.5,y()*6.28]);let E=new gt.BufferGeometry;E.setAttribute("position",new gt.BufferAttribute(M,3));let T=new gt.Points(E,new gt.PointsMaterial({map:wd("soft"),color:16751194,size:.09,transparent:!0,opacity:.55,depthWrite:!1,blending:gt.AdditiveBlending,sizeAttenuation:!0}));T.frustumCulled=!1,o.add(T);let A=Fm(a,o,l,e,t,{bloom:.6,bloomThreshold:.78,aperture:6e-5,maxblur:.004,vignette:.55,grain:.12,ca:1.4});A.bloom.radius=.6,A.grade.uniforms.uLift.value=.08;let v=Hm();A.composer.insertPass(v,A.composer.passes.length-1);let w=[[0,-.05,14.5,10.5,16,3.2],[1.2,-.08,13,8,13,2],[2,-.25,8.8,2.4,10,.8],[3,-.1,8.4,2.1,10,.8],[4,.12,8.6,2.3,10,.8],[4.7,.08,11.5,5.2,13,.2],[5.4,.02,12.5,6.2,14,0],[6,-.05,9.5,3.2,10,.8],[6.5,.55,8.4,2.6,3,1.2],[7.2,1.15,7.8,2.4,1.5,1.3],[7.85,.12,8.6,2.2,8.5,.9],[8.4,-.12,8.2,2,10,.8],[8.9,-.18,8.8,2.4,10,.8],[10,-.05,13.5,6.5,14,.4]];function P(Z){let G=0;for(;G<w.length-2&&Z>w[G+1][0];)G++;let J=w[Math.max(0,G-1)],Q=w[G],we=w[G+1],Ee=w[Math.min(w.length-1,G+2)],tt=we[0]-Q[0],qe=Vs((Z-Q[0])/tt),Je=qe*qe,q=Je*qe,te=[];for(let $=1;$<6;$++){let se=(we[$]-J[$])/Math.max(.001,we[0]-J[0])*tt,ae=(Ee[$]-Q[$])/Math.max(.001,Ee[0]-Q[0])*tt;te.push((2*q-3*Je+1)*Q[$]+(q-2*Je+qe)*se+(-2*q+3*Je)*we[$]+(q-Je)*ae)}let[fe,Oe,be,ze,st]=te;return[new gt.Vector3(-Math.cos(fe)*Oe,be,Math.sin(fe)*Oe),new gt.Vector3(ze,st,0)]}let I=6,F=6.75,z=7.2,L=7.85,B=new gt.Vector3;function Y(Z){let G=r(Z),J=i.kick(Z,1,6),Q=i.onset(Z,1,3),we=i.v("bass",Z),Ee=i.v("speed",Z),tt=i.silent(Z),qe=Math.floor(Z*30);d&&d.userData.set(Z,G,J,(.35+.9*Q)*(tt?0:1)*ks(.3,1.2,Z)),c.uBass.value=Vs(we*1.1+J*.35);let Je=1-.16*J,q=1/Math.sqrt(Je);_.position.set(0,1.45+.35*we+.1*Math.sin(G*2.1),0),_.scale.set(q,Je,q),_.rotation.y=G*.8,g.userData.set(Z,r);for(let $=0;$<m;$++){let se=x[$],ae=se[0]-G*Wm*.85;ae=((ae+Ti/2)%Ti+Ti)%Ti-Ti/2,B.set(ae,se[1]+Math.sin(G*se[3]*2+se[4])*.25+G*se[3]*.4,se[2]+Math.cos(G*se[3]+se[4])*.3),M[$*3]=B.x,M[$*3+1]=B.y%9.5,M[$*3+2]=B.z}E.attributes.position.needsUpdate=!0;let[te,fe]=P(Z),Oe=.05*J;l.position.copy(te).add(new gt.Vector3(0,Oe*Math.sin(qe*12.9898),Oe*Math.cos(qe*78.233))),l.lookAt(fe),l.rotateZ(.026*J*(Math.floor(Z*2)%2?1:-1)*ks(7.9,8.3,Z)),l.fov=36+3.5*J-2.5*ks(I,F,Z)*(1-ks(z,L,Z)),l.updateProjectionMatrix(),_.visible=!1,p.position.copy(_.position),p.update(a,o),_.visible=!0,A.bokeh.uniforms.focus.value=l.position.distanceTo(_.position);let be=A.sunOnScreen(new gt.Vector3(1,.075,0));A.rays.uniforms.uAmount.value=be?.35+.45*J:0,A.grade.uniforms.uWarm.value=.45+.3*we,a.toneMappingExposure=(.85+.25*J)*(.75+.25*ks(0,.9,Z))*(1-.45*ks(9.4,10,Z));let ze=Math.abs(i.v("speed",Z+1/60)-i.v("speed",Z-1/60))*30,st=tt&&!i.silent(Z-.1)?1:0;v.userData.set({chroma:.35*Q+.6*J+.5*Vs(ze/2)+st,slice:.35*Vs(ze/2)+.9*st,negative:st?.9:0,mono:Vs((.25-Ee)/.25),warp:(1-Ee)*.6,frame:qe})}return{render:Om(a,A,e,t,Y),ready:h,scene:o,camera:l,renderer:a}}window.__three={build:Gy};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
