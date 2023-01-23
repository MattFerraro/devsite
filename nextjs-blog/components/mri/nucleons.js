import React, { useEffect, useState, useRef } from "react"
import * as THREE from "three"
import { rotateAboutPoint, setupBasicScene } from "./webgl_utils"
import { Vector3 } from "three"
import { RGBELoader } from "../../lib/RGBELoader"

const width = 614
const height = 400
const PI = 3.1415926

const Nucleons = () => {
  const canvasRef = useRef()
  const webGLContext = useRef()
  const sceneContext = useRef()
  const requestIdRef = useRef(null)
  const [nucleon, setNucleon] = useState("proton")
  const [gravity, setGravity] = useState(2)
  const gravityRef = useRef(gravity)
  useEffect(() => {
    gravityRef.current = gravity
  }, [gravity])

  const [phi, setPhi] = useState(0.2)
  const phiRef = useRef(phi)
  useEffect(() => {
    phiRef.current = phi
  }, [phi])

  useEffect(() => {
    const { scene, camera, renderer } = setupBasicScene(
      canvasRef.current,
      false,
      false
    )
    webGLContext.current = { scene, camera, renderer }
    sceneContext.current = setScene(scene, renderer)

    requestIdRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(requestIdRef.current)
    }
  }, [])

  const tick = () => {
    animate()
    requestIdRef.current = requestAnimationFrame(tick)
  }

  const animate = () => {
    const { renderer, scene, camera } = webGLContext.current
    update()
    renderer.render(scene, camera)
  }

  const setScene = (scene, renderer) => {
    let envmaploader = new THREE.PMREMGenerator(renderer)
    new RGBELoader()
      .setPath("/resources/hdr/")
      .load("studio_small_09_1k.hdr", (hdrmap) => {
        const envmap = envmaploader.fromCubemap(hdrmap)

        const roughness = 0.3
        const metalness = 0.8
        const n = 8
        const m = 8
        const R = 0.06

        const protonMaterial = new THREE.MeshStandardMaterial({
          color: 0xff3333,
          roughness: roughness,
          metalness: metalness,
          envMap: envmap.texture,
        })
        const protonSphere = new THREE.Mesh(
          new THREE.SphereGeometry(R, n, m),
          protonMaterial
        )
        scene.add(protonSphere)
        sceneContext.current.proton = protonSphere

        // const neutronMaterial = new THREE.MeshStandardMaterial( {
        //     color: 0xFFFFFF,
        //     roughness: roughness,
        //     metalness: metalness,
        //     envMap: envmap.texture,
        // })
        // const neutronSphere = new THREE.Mesh( new THREE.SphereGeometry( R, n, m ), neutronMaterial );
        // scene.add(neutronSphere)
        // sceneContext.current.neutron = neutronSphere

        // const electronMaterial = new THREE.MeshStandardMaterial( {
        //     color: 0x3333FF,
        //     roughness: roughness,
        //     metalness: metalness,
        //     envMap: envmap.texture,
        // })
        // const electronSphere = new THREE.Mesh( new THREE.SphereGeometry( R/5, n, m ), electronMaterial );
        // scene.add(electronSphere)
        // sceneContext.current.electron = electronSphere
      })
    return {}
  }

  const update = () => {
    if (sceneContext.current.proton) {
      const proton = sceneContext.current.proton
      proton.rotateZ(0.02 * gravityRef.current)
    }
    if (sceneContext.current.neutron) {
      const obj = sceneContext.current.neutron
      obj.rotateZ(-0.02 * gravityRef.current)
    }
  }

  const protonClass = nucleon === "proton" ? "selected" : ""
  const neutronClass = nucleon === "neutron" ? "selected" : ""
  const electronClass = nucleon === "electron" ? "selected" : ""
  return (
    <div>
      <div ref={canvasRef}></div>
      <div className="button-and-slider" style={{ width: "100%" }}>
        <button
          className={"excite-button compact " + protonClass}
          type="button"
          onClick={() => {
            setNucleon("proton")
          }}
        >
          Proton
        </button>
        <button
          className={"excite-button compact " + neutronClass}
          type="button"
          onClick={() => {
            setNucleon("neutron")
          }}
        >
          Neutron
        </button>
        <button
          className={"excite-button " + electronClass}
          type="button"
          onClick={() => {
            setNucleon("electron")
          }}
        >
          Electron
        </button>
        <input
          className="slider"
          type="range"
          min="0"
          max="5"
          step=".01"
          value={gravity}
          onChange={(evt) => {
            setGravity(evt.target.value)
          }}
        ></input>
      </div>
    </div>
  )
}

export default Nucleons
