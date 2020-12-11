import * as THREE from './node_modules/three/build/three.module.js'
import * as Constructor from './constructor.js'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js'

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let hovered_object

let scene
let renderer
let mesh
let control // only one control is needed - for the main camera

let cameras = []
let main_camera
let active_camera
let active_camera_index = 0

let lamps = []

let moonLight
let textMeshes = []

let randomNumbers = [60, 90, 120]

let car = {
    start_pos: new THREE.Vector3(10, -0.5, 0),
    pos: new THREE.Vector3(10, -0.5, 0),

    mesh: null,
    camera: null,
    left_light: null,
    right_light: null,

    camera_offset: new THREE.Vector3(0, 5, -10),
    left_light_offset: new THREE.Vector3(-3, 3.5, -5),
    right_light_offset: new THREE.Vector3(3, 3.5, -5)
}

function init(){

    // initialize scene
    scene = new THREE.Scene()

    // initialize camera
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
    
    // initialize renderer
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

    // masukkin object di sini

    createSkyBox()
    
    moonLight = createMoonLight()

    scene.add(Constructor.createAsphalt())
    scene.add(Constructor.createRoad())

    //bikin lampu
    createLamp(-18, 150)    // lampu 1
    createLamp(-18, 50)     // lampu 2
    createLamp(-18, -50)    // lampu 3
    createLamp(-18, -150)   // lampu 4

    createLamp(18, 150)     // lampu 5
    createLamp(18, 50)      // lampu 6
    createLamp(18, -50)     // lampu 7
    createLamp(18, -150)    // lampu 8

    // bikin bangunan random
    // function random
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

    // bikin baris kiri
    let zPointerLeft = 235;
    for(let i = 0; i < 20; i++)
    {
        scene.add(Constructor.createBuilding(-40, zPointerLeft, randomNumbers[getRandomNumber(0, 3)]))
        zPointerLeft -= 26;
    }

    // bikin baris kanan
    let zPointerRight = 235;
    for(let i = 0; i < 20; i++)
    {
        scene.add(Constructor.createBuilding(40, zPointerRight, randomNumbers[getRandomNumber(0, 3)]))
        zPointerRight -= 26;
    }

    // bikin text
    generateTextMeshes()

    // bikin model mobil
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

    // bikin lampu depan mobil
    car.left_light = new THREE.SpotLight(0xffffff, 10, 40, Math.PI / 10, 1);
    car.left_light.position.copy(car.start_pos.clone().add(car.left_light_offset));

    car.right_light = new THREE.SpotLight(0xffffff, 10, 40, Math.PI / 10, 1);
    car.right_light.position.copy(car.start_pos.clone().add(car.right_light_offset));

    scene.add(car.left_light.target);
    scene.add(car.right_light.target);

    scene.add(car.left_light);
    scene.add(car.right_light);
}

// create the sky box
// i'm not sure if this is the intended way to implement this, please check..
let createSkyBox = () => {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('assets/cubemap/');

    const cube_texture = loader.load([
        'px.png', 'nx.png',
        'py.png', 'ny.png',
        'pz.png', 'nz.png'
    ]);

    let geometry = new THREE.BoxGeometry(500, 500, 500);
    const material = new THREE.MeshBasicMaterial({
        color: 0x777777,
        envMap: cube_texture
    });
    material.side = THREE.BackSide

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -70, 0);
    scene.add(mesh);
    return mesh;
}

// bikin moonlight
let createMoonLight = () => {
    moonLight = new THREE.PointLight(0xF4F1C9, 1, 1000, 1.5);
    moonLight.position.set(0, 500, 250);
    scene.add(moonLight)
    return moonLight;
}

// bikin lampu
let createLamp = (x, z) => {
    let lamp = {
        pole        : Constructor.createPole(x, z),
        container   : Constructor.createLampContainer(x, z),
        lid         : Constructor.createLid(x, z),
        bulb        : Constructor.createBulb(x, z),
        light       : Constructor.createLampLight(x, z)
    }
    lamps.push(lamp)

    scene.add(lamp.pole)
    scene.add(lamp.container)
    scene.add(lamp.lid)
    scene.add(lamp.bulb)
    scene.add(lamp.light)
}

// bikin text
let generateTextMeshes = () => {
    // generate Text Up
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

    // generate Text Down
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

// untuk update tiap kali refresh framerate
let update = () =>
{
    // moonLight.position.x += .05
    // mau bikin bulannya gerak ya wkwkw

    car.mesh.position.copy(car.pos.clone())
    car.camera.position.copy(car.pos.clone().add(car.camera_offset))

    car.left_light.position.copy(car.pos.clone().add(car.left_light_offset))
    car.right_light.position.copy(car.pos.clone().add(car.right_light_offset))

    car.left_light.target.position.copy(car.left_light.position.clone().add(new THREE.Vector3(0, 0, -1)));
    car.right_light.target.position.copy(car.right_light.position.clone().add(new THREE.Vector3(0, 0, -1)));

    if (active_camera.position.x < -40)
        active_camera.position.x = -40;
    else
    if (active_camera.position.x > 40)
        active_camera.position.x = 40;
    
    if (active_camera.position.y < 0) {
        active_camera.position.y = 0;
    }
    
    control.target = car.pos;
    control.update();
}

// buat render
let render = () => {
    requestAnimationFrame(render)    
    renderer.render(scene, active_camera)
    update()
}

// buat pas load
window.onload = () => {
    init()
    render()
}

// input related

window.addEventListener("mousemove", onMouseMove, false);
document.addEventListener("contextmenu", onMouseClick, false);
document.addEventListener("keydown", onDocumentKeyDown, false);

function onMouseMove(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
    // toggle lamp lights
    raycaster.setFromCamera(mouse, active_camera);
    const intersects = raycaster.intersectObjects(scene.children);

    hovered_object = null
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name == "bulb")
            hovered_object = intersects[i].object;
    }

    if (hovered_object != null) {
        lamps.forEach(item => {
            if (item.bulb == hovered_object) {
                // toggle light turning on or off
                item.light.intensity = (item.light.intensity + 1) % 2
                item.bulb.material.side =
                    (item.bulb.material.side == THREE.FrontSide) ?
                    THREE.BackSide : THREE.FrontSide
            }
        });
    }
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;

    // Ctrl to switch cameras
    if (keyCode == 17) {
        active_camera_index = (active_camera_index + 1) % 2
        active_camera = cameras[active_camera_index]
        
        // only enable control during the main camera pov
        control.enabled = (active_camera_index == 0)
    }

    if (active_camera_index == 1) {
        // W press
        if (keyCode == 83) {
            car.pos.add(new THREE.Vector3(0, 0, 3))
        }
        // S press
        if (keyCode == 87) {
            car.pos.add(new THREE.Vector3(0, 0, -3))
        }
    }
};
