
import React, { useEffect, useState, useRef } from 'react'
import { calculateTorques, getMousePos, findNorth, findSouth, applyTorques, renderDipole, renderFieldVectors, renderStreamlines } from './dipole_utils'

const width = 614
const height = 400
const PI = 3.1415926


const DipoleV2 = (props) => {
  const dipole1Ref = useRef({
    x: width * 1/3, y: height/2, w: 10, h: 40,
    theta: PI/2, dtheta:0, moment: 1,
    strength:1, numLines: 23});
  const dipole2Ref = useRef({
    x: width * 2/3, y: height/2, w: 10, h: 40,
    theta: -PI/4, dtheta:0, moment: 1,
    strength: 1, numLines: 23});
    dipole1Ref.current.radius = dipole1Ref.current.h
    dipole2Ref.current.radius = dipole2Ref.current.h
  const backgroundRef = useRef({theta: PI/2, strength: 0, numLines: 18})
  
  const selectedDipoleRef = useRef(null)

  const [rotation, setRotation] = useState("unset")
  const rotationRef = useRef(rotation)
  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  const [showFieldLines, setShowFieldLines] = useState(true)
  const showFieldLinesRef = useRef(showFieldLines)
  useEffect(() => {
    showFieldLinesRef.current = showFieldLines
  }, [showFieldLines])

  const [showFieldVectors, setShowFieldVectors] = useState(false)
  const showFieldVectorsRef = useRef(showFieldVectors)
  useEffect(() => {
    showFieldVectorsRef.current = showFieldVectors
  }, [showFieldVectors])
  
  const canvasRef = useRef(null);
  const canvasVisibleRef = useRef(false)
  const requestIdRef = useRef(null);


  const renderFrame = () => {
    const d1 = dipole1Ref.current
    const d2 = dipole2Ref.current
    const background = backgroundRef.current

    // console.log("render")

    // Simulate the physics
    calculateTorques([d1, d2], background)
    if (rotationRef.current === "driven") {
      d2.theta += 0.004
      d2.dtheta = 0
    } else if (rotationRef.current === "free") {
      // apply the torques
      applyTorques([d2])
    } else if (rotationRef.current === "fixed") {
      // Do nothing
    } else if (rotationRef.current === "unset") {
      // Do nothing
    }

    // Draw the scene
    const ctx = canvasRef.current.getContext("2d")
    ctx.clearRect(0,0, width, height)
    
    if (showFieldLinesRef.current) {
      renderStreamlines(ctx, [d1, d2], background)
    }
    if (showFieldVectorsRef.current) {
      renderFieldVectors(ctx, [d1, d2], background)
    }


    if (selectedDipoleRef.current && selectedDipoleRef.current.dipole === 1) {
      
      renderDipole(ctx, d1, true, selectedDipoleRef.current.north)
    } else {
      renderDipole(ctx, d1, false, false)
    }
    if (selectedDipoleRef.current && selectedDipoleRef.current.dipole === 2) {
      renderDipole(ctx, d2, true, selectedDipoleRef.current.north)
      
    } else {
      renderDipole(ctx, d2, false, false)
    }

  };

  const tick = () => {
    if (!canvasRef.current) return;
    if (!canvasVisibleRef.current) {
      console.log("Cancelling v2 animation")
      return;
    }
    renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((evt) => {
      if (!canvasVisibleRef.current && evt[0].isIntersecting) {
        console.log("restarting v2 animations")
        requestIdRef.current = requestAnimationFrame(tick);
      }
      console.log("intersection observer rot:", rotation)
      if (evt[0].intersectionRatio === 1 && rotationRef.current === "unset") {
        console.log("freeing rotation")
        setRotation("free")
      }
      
      canvasVisibleRef.current = evt[0].isIntersecting
    }, {rootMargin: "0px", threshold: [.01, 1]});
    observer.observe(canvasRef.current);
  }, [])


  const mouseDown = (evt) => {
    const coords = getMousePos(canvasRef.current, evt)
    // Which of the monopoles is that close to?
    
    const dipoles = [dipole1Ref.current, dipole2Ref.current]

    let minDist = 10000
    let dipole = null
    let north = null
    for (let di = 0; di < dipoles.length; di++) {
      const d = dipoles[di]
      const [nx, ny] = findNorth(d)
      const [sx, sy] = findSouth(d)
      const distNorth = Math.hypot(nx - coords.x, ny - coords.y)
      const distSouth = Math.hypot(sx - coords.x, sy - coords.y)
      
      if (distNorth < minDist) {
        minDist = distNorth
        dipole = di + 1
        north = true
      }
      if (distSouth < minDist) {
        minDist = distSouth
        dipole = di + 1
        north = false
      }
    }

    if (minDist < 30) {
      selectedDipoleRef.current = {
        "dipole": dipole,
        "north": north
      }
      setRotation("fixed")
    }
  }

  const mouseUp = (evt) => {
    if (selectedDipoleRef.current) {
      selectedDipoleRef.current = null
      setRotation("free")
    }
  } 

  const mouseMove = (evt) => {
    if (!selectedDipoleRef.current) return
    const coords = getMousePos(canvasRef.current, evt)
    
    if (selectedDipoleRef.current.dipole === 2) {
      const centerX = dipole2Ref.current.x
      const centerY = dipole2Ref.current.y
      let newTheta = Math.atan2(coords.y - centerY, coords.x - centerX)
      dipole2Ref.current.dtheta = 0

      if (selectedDipoleRef.current.north) {
        dipole2Ref.current.theta = newTheta
      } else {
        dipole2Ref.current.theta = newTheta + PI
      }
    }

    if (selectedDipoleRef.current.dipole === 1) {
      const centerX = dipole1Ref.current.x
      const centerY = dipole1Ref.current.y
      let newTheta = Math.atan2(coords.y - centerY, coords.x - centerX)
      dipole1Ref.current.dtheta = 0

      if (selectedDipoleRef.current.north) {
        dipole1Ref.current.theta = newTheta
      } else {
        dipole1Ref.current.theta = newTheta + PI
      }
    }
  }

  // <input type="checkbox" checked={rotation==="driven"} id="rotate2" name="rotate" value="rotate" onChange={() => setRotation(rotation==="driven"?"free":"driven")}></input>
  //     <label htmlFor="rotate2"> Autospin </label>

  // <input type="checkbox" checked={showFieldVectors} id="showfieldvectors2" name="showfieldvectors" value="showfieldvectors" onChange={() => setShowFieldVectors(!showFieldVectors)}></input>
  //     <label htmlFor="showfieldvectors2"> Show Field Indicators </label>

  // <input type="checkbox" checked={showFieldLines} id="showfieldlines2" name="showfieldlines" value="showfieldlines" onChange={() => setShowFieldLines(!showFieldLines)}></input>
  //     <label htmlFor="showfieldlines2"> Show Field Lines </label>

  return <div>
      <canvas ref={canvasRef} onMouseMove={mouseMove} onMouseUp={mouseUp} onMouseDown={mouseDown} className="dipole-vis" width={width} height={height} style={{width:width, height: height}}></canvas>
      

      
      
      
      
    </div>
}

export default DipoleV2