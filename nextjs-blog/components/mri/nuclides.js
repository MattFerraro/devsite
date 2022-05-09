import React, { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { setupBasicScene } from './webgl_utils'

const width = 614
const height = 400
const PI = 3.1415926

const Nuclides = () => {
    const canvasRef = useRef()
    const webGLContext = useRef()
    const sceneContext = useRef()
    const requestIdRef = useRef(null);

    useEffect(() => {
        const {scene, camera, renderer} = setupBasicScene(canvasRef.current)
        webGLContext.current = {scene, camera, renderer}
        sceneContext.current = setScene(scene)

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

    const setScene = (scene) => {
        // Set up the scene that this particular view is trying to illustrate
        const protonGeometry = new THREE.IcosahedronGeometry(1.5, 1)
        // const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
        // const protonMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
        const protonMaterial = new THREE.MeshPhongMaterial( { color: 0xff0d00, emissive: 0x340907, side: THREE.DoubleSide, flatShading: true } );
        
        const proton = new THREE.Mesh(protonGeometry, protonMaterial)
        // proton.position.x = -1.75
        scene.add(proton)

        const neutronGeometry = new THREE.DodecahedronGeometry(1.5, 1)
        // // const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
        const neutronMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
        const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial)
        // neutron.position.x = 1.75
        // scene.add(neutron)

        return {proton, neutron}
    }

    const update = () => {
        const {proton, neutron} = sceneContext.current
        proton.rotation.y += 0.01
        
    }

    return <div ref={canvasRef}></div>
}



export default Nuclides