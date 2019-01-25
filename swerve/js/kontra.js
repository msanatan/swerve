/*
 * Kontra.js v5.2.0 (Custom Build on 2019-01-24) | MIT
 * Build: https://straker.github.io/kontra/download?files=gameLoop+keyboard+sprite+pointer+store
 */
kontra={init(n){var t=this.canvas=document.getElementById(n)||n||document.querySelector("canvas");this.context=t.getContext("2d"),this._init()},_noop:new Function,_tick:new Function,_init:new Function};
kontra.gameLoop=function(e){let t,n,a,r,o=(e=e||{}).fps||60,i=0,p=1e3/o,c=1/o,s=!1===e.clearCanvas?kontra._noop:function(){kontra.context.clearRect(0,0,kontra.canvas.width,kontra.canvas.height)};function d(){if(n=requestAnimationFrame(d),a=performance.now(),r=a-t,t=a,!(r>1e3)){for(kontra._tick(),i+=r;i>=p;)m.update(c),i-=p;s(),m.render()}}let m={update:e.update,render:e.render,isStopped:!0,start(){t=performance.now(),this.isStopped=!1,requestAnimationFrame(d)},stop(){this.isStopped=!0,cancelAnimationFrame(n)}};return m};
!function(){let n={},t={},e={13:"enter",27:"esc",32:"space",37:"left",38:"up",39:"right",40:"down"};for(let n=0;n<26;n++)e[65+n]=(10+n).toString(36);for(i=0;i<10;i++)e[48+i]=""+i;addEventListener("keydown",function(i){let c=e[i.which];t[c]=!0,n[c]&&n[c](i)}),addEventListener("keyup",function(n){t[e[n.which]]=!1}),addEventListener("blur",function(n){t={}}),kontra.keys={bind(t,e){[].concat(t).map(function(t){n[t]=e})},unbind(t,e){[].concat(t).map(function(t){n[t]=e})},pressed:n=>!!t[n]}}();
!function(){class t{constructor(t,i){this._x=t||0,this._y=i||0}add(t,i){this.x+=(t.x||0)*(i||1),this.y+=(t.y||0)*(i||1)}clamp(t,i,h,s){this._c=!0,this._a=t,this._b=i,this._d=h,this._e=s}get x(){return this._x}get y(){return this._y}set x(t){this._x=this._c?Math.min(Math.max(this._a,t),this._d):t}set y(t){this._y=this._c?Math.min(Math.max(this._b,t),this._e):t}}kontra.vector=((i,h)=>new t(i,h)),kontra.vector.prototype=t.prototype;class i{init(t,i,h,s){for(i in t=t||{},this.position=kontra.vector(t.x,t.y),this.velocity=kontra.vector(t.dx,t.dy),this.acceleration=kontra.vector(t.ddx,t.ddy),this.width=this.height=this.rotation=0,this.ttl=1/0,this.anchor={x:0,y:0},this.context=kontra.context,t)this[i]=t[i];if(h=t.image)this.image=h,this.width=h.width,this.height=h.height;else if(h=t.animations){for(i in h)this.animations[i]=h[i].clone(),s=s||h[i];this._ca=s,this.width=s.width,this.height=s.height}return this}get x(){return this.position.x}get y(){return this.position.y}get dx(){return this.velocity.x}get dy(){return this.velocity.y}get ddx(){return this.acceleration.x}get ddy(){return this.acceleration.y}set x(t){this.position.x=t}set y(t){this.position.y=t}set dx(t){this.velocity.x=t}set dy(t){this.velocity.y=t}set ddx(t){this.acceleration.x=t}set ddy(t){this.acceleration.y=t}isAlive(){return this.ttl>0}collidesWith(t){if(this.rotation||t.rotation)return null;let i=this.x-this.width*this.anchor.x,h=this.y-this.height*this.anchor.y,s=t.x,e=t.y;return t.anchor&&(s-=t.width*t.anchor.x,e-=t.height*t.anchor.y),i<s+t.width&&i+this.width>s&&h<e+t.height&&h+this.height>e}update(t){this.advance(t)}render(){this.draw()}playAnimation(t){this._ca=this.animations[t],this._ca.loop||this._ca.reset()}advance(t){this.velocity.add(this.acceleration,t),this.position.add(this.velocity,t),this.ttl--,this._ca&&this._ca.update(t)}draw(){let t=-this.width*this.anchor.x,i=-this.height*this.anchor.y;this.context.save(),this.context.translate(this.x,this.y),this.rotation&&this.context.rotate(this.rotation),this.image?this.context.drawImage(this.image,t,i):this._ca?this._ca.render({x:t,y:i,context:this.context}):(this.context.fillStyle=this.color,this.context.fillRect(t,i,this.width,this.height)),this.context.restore()}}kontra.sprite=(t=>(new i).init(t)),kontra.sprite.prototype=i.prototype}();
!function(){let t,n=[],e=[],o={},a=[],i={},r={0:"left",1:"middle",2:"right"};function c(n){let e=n.x,o=n.y;n.anchor&&(e-=n.width*n.anchor.x,o-=n.height*n.anchor.y);let a=t.x-Math.max(e,Math.min(t.x,e+n.width)),i=t.y-Math.max(o,Math.min(t.y,o+n.height));return a*a+i*i<t.radius*t.radius}function u(){let o,a,i=e.length?e:n;for(let n=i.length-1;n>=0;n--)if(a=(o=i[n]).collidesWithPointer?o.collidesWithPointer(t):c(o))return o}function s(t){let n=void 0!==t.button?r[t.button]:"left";i[n]=!0,f(t,"onDown")}function h(t){let n=void 0!==t.button?r[t.button]:"left";i[n]=!1,f(t,"onUp")}function d(t){f(t,"onOver")}function l(t){i={}}function f(n,e){if(!kontra.canvas)return;let a,i;-1!==["touchstart","touchmove","touchend"].indexOf(n.type)?(a=(n.touches[0]||n.changedTouches[0]).clientX,i=(n.touches[0]||n.changedTouches[0]).clientY):(a=n.clientX,i=n.clientY);let r,c=kontra.canvas.height/kontra.canvas.offsetHeight,s=kontra.canvas.getBoundingClientRect(),h=(a-s.left)*c,d=(i-s.top)*c;t.x=h,t.y=d,n.target===kontra.canvas&&(n.preventDefault(),(r=u())&&r[e]&&r[e](n)),o[e]&&o[e](n,r)}t=kontra.pointer={x:0,y:0,radius:5,track(t){[].concat(t).map(function(t){t._r||(t._r=t.render,t.render=function(){n.push(this),this._r()},a.push(t))})},untrack(t,n){[].concat(t).map(function(t){t.render=t._r,t._r=n;let e=a.indexOf(t);-1!==e&&a.splice(e,1)})},over:t=>-1!==a.indexOf(t)&&u()===t,onDown(t){o.onDown=t},onUp(t){o.onUp=t},pressed:t=>!!i[t]},kontra._tick=function(){e.length=0,n.map(function(t){e.push(t)}),n.length=0},kontra._init=function(){kontra.canvas.addEventListener("mousedown",s),kontra.canvas.addEventListener("touchstart",s),kontra.canvas.addEventListener("mouseup",h),kontra.canvas.addEventListener("touchend",h),kontra.canvas.addEventListener("blur",l),kontra.canvas.addEventListener("mousemove",d),kontra.canvas.addEventListener("touchmove",d)}}();
kontra.store={set(t,e){void 0===e?localStorage.removeItem(t):localStorage.setItem(t,JSON.stringify(e))},get(t){let e=localStorage.getItem(t);try{e=JSON.parse(e)}catch(t){}return e}};