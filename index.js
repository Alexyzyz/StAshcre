import * as THREE from './node_modules/three/build/three.module.js'
import * as Constructor from './constructor.js'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js'

let scene
let renderer
let mesh
let control // only one control is needed - for the main camera

let cameras = []
let main_camera
let active_camera
let active_camera_index = 0

let moonLight
let textMeshes = []

let randomNumbers = [60, 90, 120]

let car = {
    start_pos: new THREE.Vector3(10, -0.5, 0),
    pos: new THREE.Vector3(10, -0.5, 0),

    mesh: null,
    camera: null,
    light: null,

    camera_offset: new THREE.Vector3(0, 5, -10),
    light_offset: new THREE.Vector3(3, 3.5, -10)
}

function init(){

    //initialize scene
    scene = new THREE.Scene()

    //initialize camera
    let fov = 45
    let aspect = window.innerWidth / window.innerHeight

    main_camera = new THREE.PerspectiveCamera(fov, aspect)
    main_camera.position.set(-10, 20, 90)
    main_camera.lookAt(0, 0, 0)

    car.camera = new THREE.PerspectiveCamera(fov, aspect)
    car.camera.position.copy(car.start_pos.clone().add(car.camera_offset))

    cameras[0] = main_camera
    cameras[1] = car.camera
    active_camera = cameras[active_camera_index]
    
    //initialize renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })

    renderer.setClearColor(0x364038)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.type = THREE.PCFSoftShadowMap //buat shadowMap
    renderer.shadowMap.enabled = true //buat shadowMap
    document.body.appendChild(renderer.domElement)

    control = new OrbitControls(main_camera, renderer.domElement)
    control.maxDistance = 1000
    control.minDistance = 50
    control.maxPolarAngle = Math.PI / 2
    control.enablePan = false

    //Masukkin object di sini
    moonLight = createMoonLight()
    scene.add(Constructor.createAsphalt())
    scene.add(Constructor.createRoad())

    //bikin lampu
    createLamp(-18, 150) //lampu 1
    createLamp(-18, 50) //lampu 2
    createLamp(-18, -50) //lampu 3
    createLamp(-18, -150) //lampu 4

    createLamp(18, 150) //lampu 5
    createLamp(18, 50) //lampu 6
    createLamp(18, -50) //lampu 7
    createLamp(18, -150) //lampu 8

    //bikin bangunan random
    //function random
    let getRandomNumber = (start, range) =>
    {
        let getRandom = Math.floor((Math.random() * range) + start);
        if(getRandom != 60 && getRandom != 90 && getRandom != 120)
        {
            while(getRandom > range)
            {
                getRandom = Math.floor((Math.random() * range) + start);
            }
        }
        return getRandom;
    }

        //bikin baris kiri
        let zPointerLeft = 235;
        for(let i = 0; i < 20; i++)
        {
            scene.add(Constructor.createBuilding(-40, zPointerLeft, randomNumbers[getRandomNumber(0, 3)]))
            zPointerLeft -= 26;
        }

        //bikin baris kanan
        let zPointerRight = 235;
        for(let i = 0; i < 20; i++)
        {
            scene.add(Constructor.createBuilding(40, zPointerRight, randomNumbers[getRandomNumber(0, 3)]))
            zPointerRight -= 26;
        }

    //bikin text
    generateTextMeshes()

    //bikin model mobil
    let handle_load = (gltf) =>
    {
        car.mesh = gltf.scene.children[0];
        car.mesh.rotation.y = Math.PI;
        car.mesh.position.copy(car.start_pos);
        car.mesh.scale.set(4, 4, 4);
        scene.add(car.mesh);
    }
    const loader = new GLTFLoader();
    loader.load('./assets/model/model.glb', handle_load)

    //bikin lampu depan mobil
    car.light = new THREE.SpotLight(0xffffff, 10, 40, Math.PI / 10, 1);
    car.light.position.copy(car.start_pos.clone().add(car.light_offset));
    car.light.target.position.z = car.light.position.z + 1;
    scene.add(car.light);
}

//bikin moonlight
let createMoonLight = () =>{
    moonLight = new THREE.PointLight(0xF4F1C9, 1, 1000, 1.5);
    moonLight.position.set(0, 500, 250);
    scene.add(moonLight)
    return moonLight;
}

//bikin lampu
let createLamp = (x, z) =>{
    scene.add(Constructor.createPole(x, z))
    scene.add(Constructor.createLampContainer(x, z))
    scene.add(Constructor.createLid(x, z))
    scene.add(Constructor.createBulb(x, z))
    scene.add(Constructor.createLampLight(x, z))
}

//bikin text
let generateTextMeshes = () =>{
    //generate Text Up
    let fontLoader1 = new THREE.FontLoader()

    fontLoader1.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) =>
    {
        let geometry = new THREE.TextGeometry("ST.", {
            font: font,
            height: 2,
            size: 6
        })

        geometry.center()

        let material = new THREE.MeshToonMaterial({
            color: 'white'
        })

        mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0, 13, -60)
        scene.add(mesh)
        textMeshes.push(mesh)
    })

    //generate Text Down
    let fontLoader2 = new THREE.FontLoader()

    fontLoader2.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) =>
    {
        let geometry = new THREE.TextGeometry("ASHCRE", {
            font: font,
            height: 2,
            size: 6
        })

        geometry.center()

        let material = new THREE.MeshToonMaterial({
            color: 'white'
        })

        mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0, 5, -60)
        scene.add(mesh)
        textMeshes.push(mesh)
    })

}

//untuk update tiap kali refresh framerate
let update = ()=>
{
    // moonLight.position.x += .05

    car.mesh.position.copy(car.pos.clone())
    car.camera.position.copy(car.pos.clone().add(car.camera_offset))
    car.light.position.copy(car.pos.clone().add(car.light_offset))

    if (active_camera.position.x < -40)
    active_camera.position.x = -40;
    else
    if (active_camera.position.x > 40)
    active_camera.position.x = 40;
    
    if (active_camera.position.y < 0) {
        active_camera.position.y = 0;
    }
    
    console.log(car.light.rotation)
    control.update();
}

//buat render
let render = () => {
    requestAnimationFrame(render)
    renderer.render(scene, active_camera)
    update()
}

//buat pas load
window.onload = () => {
    init()
    render()
}

document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 17) {
        active_camera_index = (active_camera_index + 1) % 2
        active_camera = cameras[active_camera_index]
        
        control.enabled = (active_camera_index == 0) // only enable control during the main camera pov
    }

    if (active_camera_index == 1) {
        if (keyCode == 83) {
            car.pos.add(new THREE.Vector3(0, 0, 3))
        }

        if (keyCode == 87) {
            car.pos.add(new THREE.Vector3(0, 0, -3))
        }
    }
};
