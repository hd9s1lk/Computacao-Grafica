import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', Start);

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
var renderer = new THREE.WebGLRenderer();

var camaraPerspetiva = new THREE.PerspectiveCamera(45, 4/3,0.1,100);

renderer.setSize(window.innerWidth -15, window.innerHeight -80);

renderer.setClearColor(0xaaaaaa);

document.body.appendChild(renderer.domElement);

var geometria = new THREE.BufferGeometry();
var vertices = new Float32Array([
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.0, 0.5, 0.0
]);

const cores = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
]);

geometria.setAttribute('position' , new THREE.BufferAttribute(vertices, 3));
geometria.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cores), 3));

var material = new THREE.MeshBasicMaterial({vertexColors: true});

var mesh = new THREE.Mesh(geometria,material);


var angulodeRotacao = 0;



var geometriaCubo = new THREE.BoxGeometry(1,1,1);

var materialCubo = new THREE.MeshBasicMaterial({vertexColors: true});

const vertexColorsCubo = new Float32Array( [
    1.0,0.0,0.0,
    0.0,1.0,0.0,
    0.0,0.0,1.0,
    0.0,0.0,0.0,

    1.0,0.0,0.0,
    0.0,0.0,0.0,
    0.0,0.0,1.0,
    0.0,1.0,0.0,

    0.0,0.0,1.0,
    0.0,1.0,0.0,
    0.0,0.0,0.0,
    1.0,0.0,0.0,

    0.0,1.0,0.0,
    1.0,0.0,0.0,
    0.0,1.0,0.0,
    0.0,0.0,0.0,

    0.0,0.0,0.0,
    1.0,0.0,0.0,
    0.0,1.0,0.0,
    0.0,0.0,1.0,

    0.0,1.0,0.0,
    1.0,0.0,0.0,
    0.0,0.0,1.0,
    0.0,0.0,0.0,
]);

geometriaCubo.setAttribute('color', new THREE.Float32BufferAttribute(vertexColorsCubo,3));

var meshCubo = new THREE.Mesh(geometriaCubo,materialCubo);

meshCubo.translateZ(-6.0);


function Start(){

    cena.add(meshCubo);
    renderer.render(cena,camaraPerspetiva);
    requestAnimationFrame(loop);
}

function loop(){

    meshCubo.rotateY(Math.PI/180*1);

    renderer.render(cena,camaraPerspetiva);

    requestAnimationFrame(loop);
}

