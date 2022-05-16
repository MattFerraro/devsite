import React, { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { rotateAboutPoint, setupBasicScene } from './webgl_utils'
import { OBJLoader } from '../threejsutils/objloader'
import { Vector3 } from 'three'
import { RGBELoader } from '../../lib/RGBELoader'
// import { SpriteText2D, textAlign } from 'three-text2d'
import SpriteText from 'three-spritetext'

const width = 614
const height = 400
const PI = 3.1415926

const angularMomentumColor = 0xf08826
const forceColor = 0x00bf19
const torqueColor = 0x6500bd
const radiusColor = 0x0095e6

const Gyroscope = () => {
    const canvasRef = useRef()
    const webGLContext = useRef()
    const sceneContext = useRef()
    const requestIdRef = useRef(null);
    const [gravity, setGravity] = useState(2)
    const gravityRef = useRef(gravity)
    useEffect(() => {
        gravityRef.current = gravity
    }, [gravity])

    const [phi, setPhi] = useState(.2)
    const phiRef = useRef(phi)
    useEffect(() => {
        phiRef.current = phi
    }, [phi])

    useEffect(() => {
        const {scene, camera, renderer} = setupBasicScene(canvasRef.current)
        webGLContext.current = {scene, camera, renderer}
        sceneContext.current = setScene(scene, renderer)

        requestIdRef.current = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(requestIdRef.current);
        };
    }, [])

    const tick = () => {
        animate();
        requestIdRef.current = requestAnimationFrame(tick);
    };

    const animate = () => {
        const {renderer, scene, camera} = webGLContext.current
        update()
        renderer.render(scene, camera)
    }

    const setScene = (scene, renderer) => {
        let envmaploader = new THREE.PMREMGenerator(renderer)
        new RGBELoader().setPath("/resources/hdr/").load("studio_small_09_1k.hdr", (hdrmap) => {
            const envmap = envmaploader.fromCubemap(hdrmap)

            const objLoader = new OBJLoader();
            objLoader.load('/resources/mri/base.obj', (root) => {
                const baseMaterial = new THREE.MeshStandardMaterial( {
                    color: 0x71797E,
                    roughness: .3,
                    metalness: .85,
                    envMap: envmap.texture,
                })
                root.traverse( (child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = baseMaterial
                    }
                })

                scene.add(root);
            });
            
            objLoader.load('/resources/mri/frame.obj', (root) => {
                const pivot = new THREE.Object3D()
                pivot.position.set(0, 0, -.065)

                const frameMaterial = new THREE.MeshStandardMaterial( {
                    color: 0x71797E,
                    roughness: .3,
                    metalness: .85,
                    envMap: envmap.texture,
                })
                root.traverse( (child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = frameMaterial
                    }
                })
                root.position.set(0,0,.065)
                pivot.add(root)
                
                const tiltAngle = 0.5
                pivot.rotateOnAxis(new Vector3(0, 1, 0), tiltAngle)

                sceneContext.current.pivot = pivot
                scene.add(pivot);

                const amArrow = new THREE.ArrowHelper( new Vector3(0, 0, 1), new Vector3(0, 0, 0), .16, angularMomentumColor, .01, .007 );
                pivot.add(amArrow)
                
                const torqueArrow2 = new THREE.ArrowHelper( new Vector3(0, 1, 0), new Vector3(0, 0, .16), .03, torqueColor, .01, .007 );
                pivot.add(torqueArrow2)

                const FArrow2 = new THREE.ArrowHelper( new Vector3(Math.sin(tiltAngle), 0, -Math.cos(tiltAngle)), new Vector3(0, 0, .065), .03, forceColor, .01, .007 * gravityRef.current );
                pivot.add(FArrow2)

                const rArrow = new THREE.ArrowHelper( new Vector3(Math.cos(tiltAngle), 0, Math.sin(tiltAngle)), new Vector3(0, 0, 0), Math.sin(tiltAngle) * .065, radiusColor, .01, .007 );
                pivot.add(rArrow)

                // const sprite = new SpriteText2D("SPRITE", { align: textAlign.center,  font: '20px Arial', fillStyle: '#000000' , antialias: true })
                // scene.add(sprite)

                // const myText = new SpriteText('My text', 10, "black");
                // scene.add(myText);

                // const geometry = new THREE.FontGeometry("Hello There", {font: font, size: 80})

                // const axesHelper = new THREE.AxesHelper( .2 );
                // pivot.add(axesHelper)

                sceneContext.current.FArrow = FArrow2
                sceneContext.current.torqueArrow = torqueArrow2

                objLoader.load('/resources/mri/spinner.obj', (root) => {

                    const spinnerMaterial = new THREE.MeshStandardMaterial( {
                        color: 0xb5a642,
                        roughness: .3,
                        metalness: .85,
                        envMap: envmap.texture,
                    })
                    root.traverse( (child) => {
                        if (child instanceof THREE.Mesh) {
                            child.material = spinnerMaterial
                        }
                    })
                    root.position.set(0,0,.065)
                    pivot.add(root);
                    sceneContext.current.spinner = root
                    
                });
            });
        })

        

        return {}
    }

    const update = () => {
        if (sceneContext.current.pivot) {
            const pivot = sceneContext.current.pivot
            pivot.rotateOnWorldAxis(new Vector3(0, 0, 1), gravityRef.current * .01)
            
            if (sceneContext.current.spinner) {
                const spinner = sceneContext.current.spinner
                spinner.rotateOnAxis(new Vector3(0, 0, 1), .2)
            }

            if (sceneContext.current.FArrow) {
                sceneContext.current.FArrow.setLength(gravityRef.current * .01, Math.min(.01, gravityRef.current * .01), Math.min(.007, gravityRef.current * .01))
            }
            if (sceneContext.current.torqueArrow) {
                sceneContext.current.torqueArrow.setLength(gravityRef.current * .01, Math.min(.01, gravityRef.current * .01), Math.min(.007, gravityRef.current * .01))
            }
        }
    }

    return <div>
        <div ref={canvasRef}></div>
        <div style={{width:'100%'}}>
            <input className='slider' type="range" min="0" max="5" step=".01" value={gravity} onChange={(evt) => {setGravity(evt.target.value)}}></input>
        </div>
    </div>
}



export default Gyroscope