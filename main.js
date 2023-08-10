import * as THREE from 'three';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.add( camera );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );


var points = [];

const line = new MeshLine();
line.setPoints(points, p => 0.01);
const material = new MeshLineMaterial;
const mesh = new THREE.Mesh(line, material);
scene.add(mesh);


const earthGeo = new THREE.SphereGeometry( .15, 60, 60 );
const earthText = new THREE.TextureLoader().load("earth_texture.jpg");
earthText.colorSpace = THREE.SRGBColorSpace;
const earthMat = new THREE.MeshBasicMaterial( { map:earthText } );
const earth = new THREE.Mesh( earthGeo, earthMat );
scene.add( earth );
earth.position.set(0, 0, 0);

var light = new THREE.AmbientLight( 0x888888 )
scene.add( light )



var vel = 4;

var state = {
  u: [0,0,.2,vel,0,0]
}



function update(){

  var r = state.u.slice(0,3);
  var rr = Math.sqrt(Math.pow(r[0], 2) + Math.pow(r[1], 2) + Math.pow(r[2], 2));
  for (var i = 0; i<3; i++){
    state.u[i+3] += - 0.005 * r[i] / (Math.pow(rr, 3)) *8 ;
    state.u[i] += 0.005 * state.u[i+3];
  }
}

function simulate(){
  points = []
  for (let i = 0.6*Math.PI; i < Math.PI; i+=0.08){
    points.push(-i/(Math.PI * 5)*Math.sin(i), 0, -i/(Math.PI * 5)*Math.cos(i));

  }
  for (let j = 0; j < 10000; j += 0.1) {
    if (0.15>Math.sqrt(Math.pow(state.u[0], 2) + Math.pow(state.u[1], 2) + Math.pow(state.u[2], 2))){
      return;
    } else{
      points.push(state.u[0], state.u[1], state.u[2]);
      update()
    }
  }
}


line.setPoints(points, p => 0.01);

camera.position.y = .3;
camera.position.x = .3;
camera.position.z = .3;


var a = 0;
let reqAnim
var requestId;
function IDLE(){
    renderer.render( scene, camera );
    reqAnim = window.requestAnimationFrame( IDLE);
}

function earthOrbit() {
    line.setPoints(points.slice(0, a), p => 0.01);
    a = a+1;
    if (a >600){
    a = 0;
    }
    reqAnim = window.requestAnimationFrame( earthOrbit );
    renderer.render( scene, camera );
  }

function fullSimulate(){
  simulate();
  earthOrbit();
}

function stopAnimation() {
  cancelAnimationFrame(reqAnim);
}

simulate()
earthOrbit()


//document.getElementById("earth").addEventListener("click", earthOrbit);
//document.getElementById("tli").addEventListener("click", TLIOrbit);
//document.getElementById("moon").addEventListener("click", moonOrbit);
//document.getElementById("stop").addEventListener("click", stopAnimation);
var rangeInput = document.getElementById("animationSlider");
rangeInput.addEventListener('mouseup', (event) => {
  stopAnimation();
  const sliderValue = parseFloat(event.target.value);
  vel = sliderValue/10; 
  state.u = [0,0,.2,vel,0,0]
  simulate();
  a = 0;
  earthOrbit();
  
});
