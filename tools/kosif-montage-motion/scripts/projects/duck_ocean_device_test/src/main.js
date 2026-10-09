const {THREE,makeRenderer,makePost,makeFrameLoop}=window.K3;
function build(canvas,W,H){
 const renderer=makeRenderer(canvas,W,H),scene=new THREE.Scene();
 scene.background=new THREE.Color(0x9ccbd8);scene.fog=new THREE.Fog(0xaacbd2,18,65);
 const camera=new THREE.PerspectiveCamera(37,W/H,.1,100);
 camera.position.set(0,3.2,12);camera.lookAt(0,.15,0);
 scene.add(new THREE.HemisphereLight(0xd6f5ff,0x35546a,2));
 const key=new THREE.DirectionalLight(0xffe2ac,3.4);key.position.set(-4,8,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0x91d9ff,2.0);rim.position.set(5,4,-4);scene.add(rim);
 const waterMat=new THREE.MeshPhysicalMaterial({color:0x087caa,metalness:.28,roughness:.19,clearcoat:1,transparent:true,opacity:.94,side:THREE.DoubleSide});
 const geo=new THREE.PlaneGeometry(120,120,90,90);geo.rotateX(-Math.PI/2);const water=new THREE.Mesh(geo,waterMat);water.position.y=-.88;scene.add(water);
 const yellow=new THREE.MeshPhysicalMaterial({color:0xffcf39,roughness:.38,clearcoat:.45}),light=new THREE.MeshPhysicalMaterial({color:0xffe57c,roughness:.4}),orange=new THREE.MeshStandardMaterial({color:0xff7a24,roughness:.42}),black=new THREE.MeshPhysicalMaterial({color:0x0c1823,roughness:.12,clearcoat:1}),white=new THREE.MeshBasicMaterial({color:0xffffff});
 const duck=new THREE.Group();scene.add(duck);
 function ell(parent,x,y,z,sx,sy,sz,mat){let o=new THREE.Mesh(new THREE.SphereGeometry(1,40,28),mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o}
 ell(duck,0,0,0,1.75,.96,1.04,yellow);
 ell(duck,.94,1.05,.12,.79,.85,.78,light);
 ell(duck,-.05,.19, .86,1.02,.48,.22,light);
 ell(duck,-1.45,.43,0,.55,.37,.53,yellow);
 const wing=ell(duck,-.22,.2,1.0,.95,.41,.19,light);wing.rotation.z=-.13;
 ell(duck,1.50,.82,.34,.65,.17,.4,orange);ell(duck,1.48,.65,.36,.48,.09,.3,orange);
 for(const x of [.66,1.22]){ell(duck,x,1.22,.79,.115,.155,.08,white);ell(duck,x+.035,1.21,.86,.068,.115,.05,black);ell(duck,x+.015,1.26,.905,.021,.028,.015,white)}
 const post=makePost(renderer,scene,camera,W,H);
 const vertices=geo.attributes.position,original=Float32Array.from(vertices.array);
 function update(t){duck.position.y=.10+Math.sin(t*2.6)*.12;duck.rotation.z=Math.sin(t*2.6+.4)*.035;duck.rotation.y=-.22+Math.sin(t*.8)*.09;wing.rotation.z=-.13+Math.sin(t*3)*.08;
 for(let i=0;i<vertices.count;i++){const x=original[i*3],y=original[i*3+1];vertices.setZ(i,.10*Math.sin(x*.55+t*1.4)*Math.cos(y*.43+t*.9)+.06*Math.sin(x*.9+y*.7+t*1.8))}vertices.needsUpdate=true;geo.computeVertexNormals();
 camera.position.x=Math.sin(t*.35)*.45;camera.position.y=3.2+Math.sin(t*.5)*.14;camera.lookAt(0,.18,0)}
 return {render:makeFrameLoop(renderer,post,W,H,update),ready:Promise.resolve(),scene,camera,renderer}
}
window.__three={build};