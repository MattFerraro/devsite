import React, { useEffect, useState, useRef } from "react"
import * as THREE from "three"
import { rotateAboutPoint, setupBasicScene } from "./webgl_utils"
import { Vector3 } from "three"
import { RGBELoader } from "../../lib/RGBELoader"
import { BufferGeometry } from "three"

const width = 614
const height = 400
const PI = 3.1415926

const fieldLinesPerPole = 19
const showSpheres = false
const fieldLinesN = 100
const lineMaterial = new THREE.LineBasicMaterial({
  vertexColors: THREE.VertexColors,
})

const DipoleWebGL = () => {
  const canvasRef = useRef()
  const webGLContext = useRef()
  const sceneContext = useRef()
  const requestIdRef = useRef(null)

  const sliderRef = useRef(null)

  const [exciting, setExciting] = useState(false)
  const [showFieldLines, setShowFieldLines] = useState(true)
  const showFieldLinesRef = useRef(showFieldLines)
  const [showArrows, setShowArrows] = useState(false)
  const showArrowsRef = useRef(showArrows)

  const timestampRef = useRef(0)
  const arrowGroupRef = useRef()

  const [size, setSize] = useState(1)
  const sizeRef = useRef(size)
  useEffect(() => {
    sizeRef.current = size
  }, [size])

  const mainDipoleRef = useRef({
    theta: PI / 2,
    mu: 1,
    r: 0.03,
    r2: 0.02,
    dt: 0,
    I: 1,
    center: { x: 0, z: 0 },
    north: { x: 0, z: 0 },
    south: { x: 0, z: 0 },
  })

  const otherDipoleRef = useRef({
    theta: -PI / 2,
    mu: 1,
    r: 0.03,
    r2: 0.02,
    dt: 0,
    I: 1,
    center: { x: 0.06, z: 0 },
    north: { x: 0, z: 0 },
    south: { x: 0, z: 0 },
  })

  const updateDipole = (dipole) => {
    dipole.north.x = Math.cos(dipole.theta) * dipole.r2 + dipole.center.x
    dipole.north.z = Math.sin(dipole.theta) * dipole.r2 + dipole.center.z
    dipole.south.x = Math.cos(dipole.theta + PI) * dipole.r2 + dipole.center.x
    dipole.south.z = Math.sin(dipole.theta + PI) * dipole.r2 + dipole.center.z
  }

  const [strength, setStrength] = useState(1)
  useEffect(() => {
    otherDipoleRef.current.mu = strength
    const f = 0.5
    if (sceneContext.current) {
      sceneContext.current.otherCylinder.scale.set(
        strength * f + f,
        strength * f + f,
        1
      )
    }
  }, [strength])

  const [separation, setSeparation] = useState(0.06)
  useEffect(() => {
    otherDipoleRef.current.center.x = parseFloat(separation)
    updateDipole(otherDipoleRef.current)
  }, [separation])

  const exciteRef = useRef(false)
  const exciteButtonRef = useRef()
  const arrowsRef = useRef(false)

  useEffect(() => {
    const { scene, camera, renderer } = setupBasicScene(
      canvasRef.current,
      true,
      false
    )
    webGLContext.current = { scene, camera, renderer }
    sceneContext.current = setScene(scene, renderer)

    requestIdRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(requestIdRef.current)
    }
  }, [])

  const tick = (timestamp) => {
    animate(timestamp)
    requestIdRef.current = requestAnimationFrame(tick)
  }

  const animate = (timestamp) => {
    const { renderer, scene, camera } = webGLContext.current
    update(timestamp)
    renderer.render(scene, camera)
  }

  const setScene = (scene, renderer) => {
    let envmaploader = new THREE.PMREMGenerator(renderer)
    new RGBELoader()
      .setPath("/resources/hdr/")
      .load("studio_small_09_1k.hdr", (hdrmap) => {
        const envmap = envmaploader.fromCubemap(hdrmap)

        const r = 0.008
        const ar = 3
        const faces = 32
        const cylinderGroup = new THREE.Group()
        const cylinderGeometry = new THREE.CylinderGeometry(r, r, r * ar, faces)
        cylinderGeometry.translate(0, (r * ar) / 2, 0)
        const cylinderMaterial = new THREE.MeshStandardMaterial({
          color: 0xff0000,
          metalness: 0.85,
          envMap: envmap.texture,
        })
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
        cylinder.rotateOnAxis(new Vector3(1, 0, 0), PI / 2)

        const cylinderGeometry2 = new THREE.CylinderGeometry(
          r,
          r,
          r * ar,
          faces
        )
        cylinderGeometry2.translate(0, (-r * ar) / 2, 0)
        const cylinderMaterial2 = new THREE.MeshStandardMaterial({
          color: 0x0000ff,
          metalness: 0.85,
          envMap: envmap.texture,
        })
        const cylinder2 = new THREE.Mesh(cylinderGeometry2, cylinderMaterial2)
        cylinder2.rotateOnAxis(new Vector3(1, 0, 0), PI / 2)
        cylinderGroup.add(cylinder)
        cylinderGroup.add(cylinder2)
        scene.add(cylinderGroup)

        const cylinderGroup2 = new THREE.Group()
        const cylinderGeometry3 = new THREE.CylinderGeometry(
          r,
          r,
          r * ar,
          faces
        )
        cylinderGeometry3.translate(0, (r * ar) / 2, 0)
        const cylinder3 = new THREE.Mesh(cylinderGeometry3, cylinderMaterial)
        cylinder3.rotateOnAxis(new Vector3(1, 0, 0), PI / 2)

        const cylinderGeometry4 = new THREE.CylinderGeometry(
          r,
          r,
          r * ar,
          faces
        )
        cylinderGeometry4.translate(0, (-r * ar) / 2, 0)
        const cylinder4 = new THREE.Mesh(cylinderGeometry4, cylinderMaterial2)
        cylinder4.rotateOnAxis(new Vector3(1, 0, 0), PI / 2)
        cylinderGroup2.add(cylinder3)
        cylinderGroup2.add(cylinder4)
        cylinderGroup2.position.setComponent(0, 0.1)
        cylinderGroup2.rotateY(PI)
        scene.add(cylinderGroup2)

        sceneContext.current.cylinderGroup = cylinderGroup
        sceneContext.current.otherCylinder = cylinderGroup2
        // const axesHelper = new THREE.AxesHelper( .08 );
        // scene.add( axesHelper );

        const arrowGroup = new THREE.Group()
        const arrows = []
        for (let x = -0.16; x < 0.16; x += 0.02) {
          for (let z = -0.15; z <= 0.1; z += 0.02) {
            const dir = sampleField(
              otherDipoleRef.current,
              new Vector3(x, 0, z)
            )
            const l = dir.length()
            l = Math.min(l, 0.1)
            dir.normalize()

            // const length = l * .00001;
            const origin = new THREE.Vector3(x, 0, z)
            const length = 0.01
            const hex = 0x000000

            const arrowHelper = new THREE.ArrowHelper(
              dir,
              origin,
              length,
              hex,
              length * 0.3,
              length * 0.3
            )
            arrowGroup.add(arrowHelper)
            arrows.push({ x, z, arrowHelper })
          }
        }
        scene.add(arrowGroup)
        arrowGroupRef.current = arrowGroup
        sceneContext.current.arrows = arrows

        if (!showArrows) {
          arrowGroup.visible = false
        }

        updateDipole(otherDipoleRef.current)
        updateDipole(mainDipoleRef.current)

        if (showSpheres) {
          // add north point sphere
          const markRadius = 0.008
          const geometry = new THREE.SphereGeometry(markRadius, 32, 16)
          const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
          const sphere = new THREE.Mesh(geometry, material)
          sphere.position.set(
            mainDipoleRef.current.north.x,
            0,
            mainDipoleRef.current.north.z
          )
          scene.add(sphere)
          sceneContext.current.northSphere = sphere

          // add south point sphere
          const geometry2 = new THREE.SphereGeometry(markRadius, 32, 16)
          const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff })
          const sphere2 = new THREE.Mesh(geometry2, material2)
          sphere2.position.set(
            mainDipoleRef.current.south.x,
            0,
            mainDipoleRef.current.south.z
          )
          scene.add(sphere2)
          sceneContext.current.southSphere = sphere2
        }

        // Create a sine-like wave
        // const curve = new THREE.SplineCurve( [
        //     new THREE.Vector2( -.10, 0 ),
        //     new THREE.Vector2( -.05, .05 ),
        //     new THREE.Vector2( 0, 0 ),
        //     new THREE.Vector2( .05, -.05 ),
        //     new THREE.Vector2( .10, 0 )
        // ] );

        // const points = curve.getPoints( 15 );
        // console.log(points)

        // Add all the Line objects and geometries so we can animate them later
        const fieldLines = []
        const points = []
        const colors = []
        for (let i = 0; i < fieldLinesN; i++) {
          points.push({ x: i / 10000, y: 0, z: 0 })
          colors.push(0)
          colors.push(0)
          colors.push(1)
        }
        for (let i = 0; i < 2 * fieldLinesPerPole; i++) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
          const lineObject = new THREE.Line(lineGeometry, lineMaterial)
          scene.add(lineObject)
          lineGeometry.setAttribute(
            "color",
            new THREE.BufferAttribute(new Float32Array(colors), 3)
          )
          fieldLines.push({ lineObject, lineGeometry })
        }
        sceneContext.current.fieldLines = fieldLines
        sceneContext.current.scene = scene
      })

    return {}
  }

  const update = (timestamp) => {
    let deltaTime = timestamp - timestampRef.current
    if (deltaTime > 16.6 * 3.5) {
      deltaTime = 16.6
    }
    timestampRef.current = timestamp

    // Update the physics
    const time = deltaTime / 1000
    const dipole1 = mainDipoleRef.current
    const dipole2 = otherDipoleRef.current

    updateDipole(dipole1)
    updateDipole(dipole2)

    if (exciteRef.current) {
      dipole1.dt = 0
      dipole1.theta += 0.05
    } else {
      const sep = -(dipole1.center.x - dipole2.center.x)
      const torque =
        -Math.sin(dipole1.theta - PI / 2) * (1 / sep) * dipole2.mu -
        dipole1.dt * 0.3
      const ddt = torque / dipole1.I
      dipole1.dt += ddt * time
      dipole1.theta = dipole1.theta + dipole1.dt * time //+ .5 * ddt * time * time
    }

    if (sceneContext.current.otherCylinder) {
      const other = sceneContext.current.otherCylinder
      other.position.setComponent(0, dipole2.center.x)
    }

    updateDipole(dipole1)
    updateDipole(dipole2)

    // Update the view of that physics
    if (sceneContext.current.cylinderGroup) {
      sceneContext.current.cylinderGroup.rotation.y = PI / 2 - dipole1.theta
    }

    if (sceneContext.current.arrows && showArrows) {
      const arrows = sceneContext.current.arrows
      for (let a = 0; a < arrows.length; a++) {
        const arrow = arrows[a]
        const dir = sampleFields(new Vector3(arrow.x, 0, arrow.z))

        let l = dir.length() * 0.01 * otherDipoleRef.current.mu
        l = Math.min(l, 0.01)
        dir.normalize()

        arrow.arrowHelper.setDirection(dir)
        arrow.arrowHelper.setLength(
          l,
          Math.min(l * 0.3, 0.005),
          Math.min(l * 0.3, 0.005)
        )
      }
    }

    if (sceneContext.current.northSphere) {
      sceneContext.current.northSphere.position.set(
        mainDipoleRef.current.north.x,
        0,
        mainDipoleRef.current.north.z
      )
      sceneContext.current.southSphere.position.set(
        mainDipoleRef.current.south.x,
        0,
        mainDipoleRef.current.south.z
      )
    }

    if (sceneContext.current.fieldLines) {
      // Draw lines for main dipole
      for (let i = 0; i < fieldLinesPerPole; i++) {
        const { lineGeometry, lineObject } = sceneContext.current.fieldLines[i]

        if (!showFieldLinesRef.current) {
          // Hide the lines!
          lineObject.visible = false
          continue
        } else {
          lineObject.visible = true
        }

        const angle = ((PI * 2) / fieldLinesPerPole) * i + dipole1.theta
        const startingR = 0.001
        const startingX =
          Math.cos(angle) * startingR + mainDipoleRef.current.north.x
        const startingZ =
          Math.sin(angle) * startingR + mainDipoleRef.current.north.z

        const newPath = integratePath(
          { x: startingX, z: startingZ },
          fieldLinesN
        )

        const positionArray = lineGeometry.attributes.position.array
        for (let n = 0; n < fieldLinesN; n++) {
          positionArray[n * 3] = newPath[n].x
          positionArray[n * 3 + 2] = newPath[n].z
        }
        lineGeometry.attributes.position.needsUpdate = true

        const colorArray = lineGeometry.attributes.color.array
        for (let n = 0; n <= newPath.realLength; n++) {
          const ratio = n / (newPath.realLength + 1)
          colorArray[n * 3] = 1 - ratio
          colorArray[n * 3 + 1] = 0
          colorArray[n * 3 + 2] = ratio
        }
        lineGeometry.attributes.color.needsUpdate = true
      }

      // Draw lines for the other dipole
      for (let i = 0; i < fieldLinesPerPole; i++) {
        const { lineGeometry, lineObject } =
          sceneContext.current.fieldLines[i + fieldLinesPerPole]

        if (!showFieldLinesRef.current) {
          // Hide the lines!
          lineObject.visible = false
          continue
        } else {
          lineObject.visible = true
        }

        const angle = ((PI * 2) / fieldLinesPerPole) * i + dipole2.theta
        const startingR = 0.001
        const startingX =
          Math.cos(angle) * startingR + otherDipoleRef.current.north.x
        const startingZ =
          Math.sin(angle) * startingR + otherDipoleRef.current.north.z

        const newPath = integratePath(
          { x: startingX, z: startingZ },
          fieldLinesN
        )

        const positionArray = lineGeometry.attributes.position.array
        for (let n = 0; n < fieldLinesN; n++) {
          positionArray[n * 3] = newPath[n].x
          positionArray[n * 3 + 2] = newPath[n].z
        }
        lineGeometry.attributes.position.needsUpdate = true

        const colorArray = lineGeometry.attributes.color.array
        for (let n = 0; n < newPath.realLength; n++) {
          const ratio = n / newPath.realLength
          colorArray[n * 3] = 1 - ratio
          colorArray[n * 3 + 1] = 0
          colorArray[n * 3 + 2] = ratio
        }
        lineGeometry.attributes.color.needsUpdate = true
      }
    }

    if (webGLContext.current.camera) {
      // webGLContext.current.camera.position.set(0, otherDipoleRef.current.center.x * 2 + .3, 0)
    }
  }

  const integratePath = (start, n) => {
    // start is an object like {x: 0, z: 0}
    const stepSize = 0.02 * Math.sqrt(otherDipoleRef.current.center.x)
    const md = mainDipoleRef.current
    const od = otherDipoleRef.current

    const point = new Vector3(start.x, 0, start.z)
    const points = []
    points.push(point.clone())

    let converged = false
    for (let s = 0; s < n; s++) {
      if (converged) {
        points.push(point.clone())
        continue
      }

      // Euler integration
      // let k1 = sampleField(od, point)
      // k1.normalize().multiplyScalar(stepSize)
      // point.add(k1)
      // points.push(point.clone())

      // RK4 integration
      let k1 = sampleFields(point).normalize()
      let k2 = sampleFields({
        x: point.x + (k1.x * stepSize) / 2,
        z: point.z + (k1.z * stepSize) / 2,
      }).normalize()
      let k3 = sampleFields({
        x: point.x + (k2.x * stepSize) / 2,
        z: point.z + (k2.z * stepSize) / 2,
      }).normalize()
      let k4 = sampleFields({
        x: point.x + k3.x * stepSize,
        z: point.z + k3.z * stepSize,
      }).normalize()

      const kx = (1 / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x)
      const kz = (1 / 6) * (k1.z + 2 * k2.z + 2 * k3.z + k4.z)

      point.add({ x: kx * stepSize, y: 0, z: kz * stepSize })
      points.push(point.clone())

      const distToMainSouth = point.distanceTo(
        new Vector3(md.south.x, 0, md.south.z)
      )
      const distToOtherSouth = point.distanceTo(
        new Vector3(od.south.x, 0, od.south.z)
      )
      const minDist = Math.min(distToMainSouth, distToOtherSouth)

      if (minDist < stepSize / 2) {
        converged = true
        points.realLength = s
      }
    }
    if (!converged) {
      points.realLength = n
    }

    return points
  }

  const beginExcite = () => {
    exciteRef.current = true
    setExciting(true)
  }

  const endExcite = () => {
    exciteRef.current = false
    setExciting(false)
  }

  const toggleArrows = () => {
    showArrowsRef.current = !showArrows
    setShowArrows(!showArrows)
    arrowGroupRef.current.visible = !showArrows
  }

  const toggleFieldLines = () => {
    showFieldLinesRef.current = !showFieldLines
    setShowFieldLines(!showFieldLines)
  }

  const sampleFields = (point) => {
    const other = sampleField(otherDipoleRef.current, point)
    const main = sampleField(mainDipoleRef.current, point)
    return other.add(main)
  }

  const sampleField = (dipole, point) => {
    // simulate a positive charge at the North pole and a negative charge at the south pole
    const fromNorth = new Vector3(
      point.x - dipole.north.x,
      0,
      point.z - dipole.north.z
    )
    const fromNorthLength = fromNorth.length()
    fromNorth.normalize()
    fromNorth.divideScalar(Math.pow(fromNorthLength, 2))

    const toSouth = new Vector3(
      dipole.south.x - point.x,
      0,
      dipole.south.z - point.z
    )
    const toSouthLength = toSouth.length()
    toSouth.normalize()
    toSouth.divideScalar(toSouthLength * toSouthLength)
    const sum = toSouth.add(fromNorth)
    return sum.multiplyScalar(dipole.mu)
  }

  const exciteButtonClassName = exciteRef.current
    ? "excite-button pushed-button"
    : "excite-button"
  return (
    <div>
      <div ref={canvasRef}></div>
      <div className="button-and-slider" style={{ width: "100%" }}>
        <button
          type="button"
          className={exciteButtonClassName}
          onMouseDown={beginExcite}
          onMouseUp={endExcite}
        >
          Excite
        </button>
        <input
          className="slider"
          type="range"
          min="1"
          max="4"
          step=".02"
          value={strength}
          onChange={(evt) => {
            setStrength(evt.target.value)
          }}
        ></input>
      </div>
      <div className="arrow-options" style={{ width: "100%" }}>
        <button type="button" className="lines-button" onClick={toggleArrows}>
          {showArrowsRef.current ? "Hide Arrows" : "Show Arrows"}
        </button>
        <button
          type="button"
          className="lines-button"
          onClick={toggleFieldLines}
        >
          {showFieldLinesRef.current ? "Hide Field Lines" : "Show Field Lines"}
        </button>
      </div>
    </div>
  )
}

export default DipoleWebGL
