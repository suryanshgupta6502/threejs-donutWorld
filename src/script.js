import * as three from 'three'
const canvas = document.querySelector('.webgl')
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
// import {Font} from ''
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap'
import axios from 'axios'



// const input = prompt("Enter your name to display")
// const name = input.charAt(0).toUpperCase() + input.slice(1)
const name = "suryansh"


const intialwebsite = document.referrer
const usertimezone = Intl.DateTimeFormat().resolvedOptions().timeZone + " " + Intl.DateTimeFormat().resolvedOptions().locale
var device = "";

console.log("device name is ", usertimezone);


const scene = new three.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const renderer = new three.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
// renderer.render(scene, camera)


window.addEventListener("resize", () => {
    // console.log("resizing");
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)

})



const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.z = 6
// camera.position.x = Math.random()-.5
scene.add(camera)

const orbitcontrol = new OrbitControls(camera, canvas);
orbitcontrol.enableDamping = true
orbitcontrol.maxDistance = 50
console.log(orbitcontrol);



// if (window.innerWidth <= 430 && window.innerHeight <= 700) {
//     gsap.to(camera.position, { z: 13, duration: 2 })
// }

function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    device = navigator.userAgent;
    console.log(device);
    return regex.test(navigator.userAgent);
}

if (isMobile()) {
    // console.log("Mobile device detected");
    gsap.to(camera.position, { x: 2, y: 3, z: 14, duration: 2 })
    gsap.to(camera.rotation, { y: .5, delay: .5, duration: 2 })


} else {

    gsap.to(camera.position, { x: 1, z: 6, duration: 2 })
    gsap.to(camera.rotation, { y: .1, delay: .5, duration: 1.5 })
    // console.log("Desktop device detected");
}

const light = new three.AmbientLight("000000", 1)
// scene.add(light)


const textureloader = new three.TextureLoader()
const donutmatcap = textureloader.load(`./textures/matcaps/${4}.png`)
const boxmatcap = textureloader.load(`./textures/matcaps/${Math.floor(Math.random() * 8) + 1}.png`)
// const textmatcap = textureloader.load(`./textures/matcaps/${8}.png`)
const textmaterial = new three.MeshNormalMaterial()
const donutmaterial = new three.MeshMatcapMaterial({ matcap: donutmatcap });
const boxmaterial = new three.MeshMatcapMaterial({ matcap: boxmatcap })

const fontloader = new FontLoader()

fontloader.load('./fonts/helvetiker_bold.typeface.json', (font) => {
    const textgeometry = new TextGeometry(`Hello ${name} \nWelcome To \nDonut World`,
        {
            font: font,
            size: 1,
            height: .5,

            bevelEnabled: true,
            bevelThickness: .005,
            bevelSegments: 5,
            bevelOffset: 0,
            bevelSize: .01,
            curveSegments: 10
        });
    textgeometry.center()
    const namegeomtry = new TextGeometry('surya', {
        font: font,
        size: 1,
        height: .3
    })

    for (let i = 0; i < 100; i++) {
        const textmesh = new three.Mesh(namegeomtry, textmaterial)

        const radius = Math.PI * 2 * Math.random()
        textmesh.position.x = Math.cos(radius) * (9 + Math.random() * 70)
        textmesh.position.y = (Math.random() - 0.5) * 100
        textmesh.position.z = Math.sin(radius) * (3 + Math.random() * 70)

        // textmesh.rotation.x = (Math.random() - .5) * 70
        textmesh.rotation.y = (Math.random() - 0.5) * 70
        // textmesh.rotation.z = (Math.random() - 0.5) * 70
        const scale = .5;
        textmesh.scale.set(scale, scale, scale)

        scene.add(textmesh)

    }

    const text = new three.Mesh(textgeometry, textmaterial)
    scene.add(text)
    // camera.lookAt(text)


})
// const axecontol = new three.AxesHelper()
// scene.add(axecontol)
// const textureloader=new three.TextureLoader()
// const texture= textureloader.load('/textures/matcaps/1.png')
// const donutmaterial = new three.MeshBasicMaterial({color:"red"})
const torus = new three.TorusGeometry();
const boxgeometry = new three.BoxGeometry();
console.time("donut")
for (let i = 0; i < 1000; i++) {

    const donut = new three.Mesh(torus, donutmaterial)
    const box = new three.Mesh(boxgeometry, boxmaterial)
    const radius = Math.PI * 2 * Math.random()
    donut.position.x = Math.cos(radius) * (9 + Math.random() * 70)
    donut.position.y = (Math.random() - 0.5) * 70
    donut.position.z = Math.sin(radius) * (3 + Math.random() * 70)

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random();
    donut.scale.x = scale
    donut.scale.y = scale
    donut.scale.z = scale

    box.scale.y = scale
    box.scale.z = scale
    box.scale.x = scale

    scene.add(donut)

    box.position.x = (Math.random() - .5) * 70
    box.position.y = (Math.random() - 0.5) * 70
    box.position.z = (Math.random() - 0.5) * 70

    // scene.add(box)
}
console.timeEnd("donut")
// textmaterial.wireframe = true

// axios.defaults.baseURL = "https://rich-cyan-chinchilla-wrap.cyclic.app/"
// axios.defaults.baseURL = "http://localhost:3000/"

axios.post("/donutWorld", { name, device, intialwebsite, usertimezone })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.error("Error posting data:", error);
    });



const tick = () => {
    // const elapsedTime = clock.getElapsedTime()

    // Update controls
    orbitcontrol.update()

    renderer.render(scene, camera)
    // Render

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()