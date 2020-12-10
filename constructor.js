import * as THREE from './node_modules/three/build/three.module.js'

//bikin asphalt
export let createAsphalt = ()=>{
    let geometry = new THREE.PlaneGeometry(500, 500);
    let loader = new THREE.TextureLoader();
    let texture = loader.load('./assets/asphalt.jpg');

    //repeat texture
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);

    let material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: texture
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -0.5, 0);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
}

//bikin jalan
export let createRoad = ()=>{
    let geometry = new THREE.PlaneGeometry(30, 500);
    let loader = new THREE.TextureLoader();
    let texture = loader.load('./assets/road.jpg');

    //repeat texture
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 8);

    let material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: texture
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -0.4, 0);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
}

//bikin bangunan
export let createBuilding = (x, z, height)=>{
    let geometry = new THREE.BoxGeometry(25, height, 25)
    let loader = new THREE.TextureLoader();
    let texture = loader.load('./assets/building.jpg');

    //repeat texture
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 8);

    let material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.65,
        roughness: 0.67,
        map: texture
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, height / 2 - 0.5, z);
    mesh.receiveShadow = true;
    return mesh;
}

//bikin lampu jalan
    //bikin pole
    export let createPole = (x, z)=>{
        let geometry = new THREE.CylinderGeometry(0.4, 0.4, 10, 32);

        let material = new THREE.MeshStandardMaterial({
            color: 0x43464B,
            roughness: 0.1,
            metalness: 0.6,
        })
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 5, z); //-16, 5, 100
        mesh.castShadow = true;
        return mesh;
    }

    //bikin lamp container
    export let createLampContainer = (x, z)=>{
        let geometry = new THREE.CylinderGeometry(1, 0.5, 1, 4, 1);

        let material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: true
        })
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 10.5, z); //-16, 10.5, 100
        mesh.castShadow = true;
        return mesh;
    }

    //bikin penutup lamp container
    export let createLid = (x, z)=>{
        let geometry = new THREE.CylinderGeometry(0, 1, 1, 4, 1);

        let material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: true
        })
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 11.5, z); //-16, 11.5, 100
        mesh.castShadow = true;
        return mesh;
    }

    //bikin bohlam lampu
    export let createBulb = (x, z)=>{
        let geometry = new THREE.SphereGeometry(0.5, 32, 32)

        let material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            side: THREE.BackSide
        })
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 10.8, z); //-16, 10.8, 100
        mesh.castShadow = true;
        return mesh;
    }

    //bikin cahaya lampu
    export let createLampLight = (x, z)=>{
        let lampLight = new THREE.PointLight(0xffffff, 3, 20, 1.5);
        lampLight.position.set(x, 10.8, z); //-16, 10.8, 100
        lampLight.castShadow = true;
        return lampLight;
    }

//bikin lampu depan mobil
export let createCarLight = () =>{
    let helper

    let carLight = new THREE.SpotLight(0xffffff, 3, 40, Math.PI / 2, false, 0.5);
    carLight.position.set(10, 30, -10);
    carLight.castShadow = true;
    return carLight;

    helper = new THREE.SpotLightHelper(carLight)
    return helper;
}




