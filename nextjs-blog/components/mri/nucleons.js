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
  const [gravity, setGravity] = useState(0)
  const gravityRef = useRef(gravity)
  useEffect(() => {
    gravityRef.current = gravity
  }, [gravity])

  const [phi, setPhi] = useState(3.1415926 / 6)
  const phiRef = useRef(phi)
  useEffect(() => {
    phiRef.current = phi
  }, [phi])

  useEffect(() => {
    const { scene, camera, renderer } = setupBasicScene(
      canvasRef.current,
      true,
      true
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
        const R = 0.04

        const pivot = new THREE.Object3D()

        const protonMaterial = new THREE.MeshStandardMaterial({
          color: 0xff1111,
          roughness: roughness,
          metalness: metalness,
          envMap: envmap.texture,
        })
        const protonSphere = new THREE.Mesh(
          // new THREE.SphereGeometry(R, n, m),
          new THREE.OctahedronGeometry(R, 0),
          protonMaterial
        )
        pivot.add(protonSphere)
        sceneContext.current.proton = protonSphere

        const neutronMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: roughness,
          metalness: metalness,
          envMap: envmap.texture,
        })
        const neutronSphere = new THREE.Mesh(
          // new THREE.SphereGeometry(R, n, m),
          new THREE.OctahedronGeometry(R, 0),
          neutronMaterial
        )
        pivot.add(neutronSphere)
        sceneContext.current.neutron = neutronSphere

        const electronMaterial = new THREE.MeshStandardMaterial({
          color: 0x1111ff,
          roughness: roughness,
          metalness: metalness,
          envMap: envmap.texture,
        })
        const electronSphere = new THREE.Mesh(
          // new THREE.SphereGeometry(R / 5, n, m),
          new THREE.TetrahedronGeometry(R, 0),
          electronMaterial
        )
        pivot.add(electronSphere)
        sceneContext.current.electron = electronSphere

        pivot.rotateOnAxis(new Vector3(0, 1, 0), phi)
        const axesHelper = new THREE.AxesHelper(0.07)
        pivot.add(axesHelper)

        protonSphere.visible = true
        neutronSphere.visible = false
        electronSphere.visible = false

        scene.add(pivot)
        sceneContext.current.pivot = pivot
      })
    return {}
  }

  const update = () => {
    const precessionAngle = gravityRef.current * 0.01
    // const precessionCorrection = precessionAngle * Math.sin(phiRef.current)
    if (sceneContext.current.pivot) {
      const pivot = sceneContext.current.pivot
      pivot.rotateOnWorldAxis(new Vector3(0, 0, 1), precessionAngle)
    }

    if (sceneContext.current.proton) {
      const proton = sceneContext.current.proton
      proton.rotateZ(-precessionAngle * Math.cos(phi))

      // proton.rotateZ(0.08)
    }
    if (sceneContext.current.neutron) {
      // const nucleon = sceneContext.current.neutron
      // nucleon.rotateZ(-0.08 - precessionCorrection)
    }
    if (sceneContext.current.electron) {
      // const nucleon = sceneContext.current.electron
      // nucleon.rotateZ(0.08)
    }

    // The proton and neutron spin the
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
      <div>
        <input
          className="slider"
          type="range"
          min="0"
          max="6.28318"
          step=".01"
          value={phi}
          onChange={(evt) => {
            const pivot = sceneContext.current.pivot
            pivot.rotateOnAxis(new Vector3(0, 1, 0), -phi)
            pivot.rotateOnAxis(new Vector3(0, 1, 0), evt.target.value)
            setPhi(evt.target.value)
          }}
        ></input>
      </div>
    </div>
  )
}

export default Nucleons
