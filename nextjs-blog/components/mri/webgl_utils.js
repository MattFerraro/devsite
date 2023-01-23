import * as THREE from "three"
import { OrbitControls } from "../../lib/OrbitControls"

const width = 614
const height = 400
const PI = 3.1415926

export const setupBasicScene = (container, orbit = true, axes = true) => {
  // Initiate a basic WebGL scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  const camera = new THREE.PerspectiveCamera(35, width / height, 0.01, 100)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)

  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
  container.appendChild(renderer.domElement)

  const lights = []
  lights[0] = new THREE.PointLight(0xffffff, 1, 0)
  lights[1] = new THREE.PointLight(0xffffff, 1, 0)
  // lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

  lights[0].position.set(0, 0, 0.05)
  lights[1].position.set(0, 0.05, 0.05)
  // lights[ 2 ].position.set( -1, -2, -1 );

  scene.add(lights[0])
  scene.add(lights[1])
  // scene.add( lights[ 2 ] );
  // const sphereSize = .01;
  // let pointLightHelper = new THREE.PointLightHelper( lights[0], sphereSize );
  // scene.add( pointLightHelper );
  // pointLightHelper = new THREE.PointLightHelper( lights[1], sphereSize );
  // scene.add( pointLightHelper );
  // pointLightHelper = new THREE.PointLightHelper( lights[2], sphereSize );
  // scene.add( pointLightHelper );

  const light = new THREE.AmbientLight(0x404040) // soft white light
  scene.add(light)

  camera.position.y = 0.33
  // camera.position.y = .6

  camera.up.set(0, 0, 1)
  camera.lookAt(0, 0, 0)

  if (orbit) {
    const controls = new OrbitControls(camera, renderer.domElement)
  }

  if (axes) {
    const axesHelper = new THREE.AxesHelper(0.08)
    scene.add(axesHelper)
  }

  return { scene, camera, renderer }
}

// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
export const rotateAboutPoint = (obj, point, axis, theta, pointIsWorld) => {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position) // compensate for world coordinate
  }

  obj.position.sub(point) // remove the offset
  obj.position.applyAxisAngle(axis, theta) // rotate the POSITION
  obj.position.add(point) // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position) // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta) // rotate the OBJECT
}
