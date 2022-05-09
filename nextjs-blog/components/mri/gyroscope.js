import React, { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { rotateAboutPoint, setupBasicScene } from './webgl_utils'
import { OBJLoader } from '../threejsutils/objloader'
import { Vector3 } from 'three'
import { RGBELoader } from '../../lib/RGBELoader'

const width = 614
const height = 400
const PI = 3.1415926

const Gyroscope = () => {
    const canvasRef = useRef()
    const webGLContext = useRef()
    const sceneContext = useRef()
    const requestIdRef = useRef(null);
    const [gravity, setGravity] = useState(1)
    const gravityRef = useRef(gravity)
    useEffect(() => {
        gravityRef.current = gravity
    }, [gravity])

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
                
                pivot.rotateOnAxis(new Vector3(0, 1, 0), .4)

                sceneContext.current.pivot = pivot
                scene.add(pivot);

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
        }
    }

    return <div>
        <div ref={canvasRef}></div>
        <div style={{width:'100%'}}>
            <input className='slider' type="range" min="0" max="10" step=".01" value={gravity} onChange={(evt) => {setGravity(evt.target.value)}}></input>
        </div>
    </div>
}



export default Gyroscope