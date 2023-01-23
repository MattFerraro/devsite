
import React, { useEffect, useState, useRef } from 'react'
import { calculateTorques, getMousePos, findNorth, findSouth, applyTorques, renderDipole, renderFieldVectors, renderStreamlines } from './dipole_utils'

const width = 614
const height = 400
const PI = 3.1415926


const DipoleV4 = (props) => {
  const dipole1Ref = useRef({
    x: width * 1/3, y: height/2, w: 5, h: 30,
    theta: 0, dtheta:0, moment: 1, 
    strength: 1, numLines: 18, clipOffscreen: true});
  dipole1Ref.current.radius = dipole1Ref.current.h
  
  const dipole2Ref = useRef({
    x: width * 2/3, y: height/2, w: 5, h: 30,
    theta: 0, dtheta:0, moment: 1, 
    strength: 1, numLines: 18, clipOffscreen: true});
  dipole2Ref.current.radius = dipole2Ref.current.h
  const backgroundRef = useRef({theta: -PI/2, strength: .1, numLines: 18})
  const [BGStrength, setBGStrength] = useState(backgroundRef.current.strength)
  useEffect(() => {
    backgroundRef.current.strength = BGStrength
    backgroundRef.current.numLines = BGStrength / 5 + 10
  }, [BGStrength])
  
  const selectedDipoleRef = useRef(null)

  const [rotation, setRotation] = useState("unset")
  const rotationRef = useRef(rotation)
  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  const [separation, setSeparation] = useState(width * 1/3)
  const separationRef = useRef(separation)
  useEffect(() => {
    separationRef.current = separation
  }, [separation])

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
    const d2 = dipole2Ref.current
    const d1 = dipole1Ref.current
    const background = backgroundRef.current

    // Set separation correctly
    const midpoint = width / 2
    const separatedXLeft = midpoint - separationRef.current / 2
    const separatedXRight = midpoint + separationRef.current / 2
    d1.x = separatedXLeft
    d2.x = separatedXRight

    // Simulate the physics
    calculateTorques([d1, d2], background) 
    if (rotationRef.current === "free") {
      // apply the torques
      applyTorques([d1, d2])
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
      console.log("Cancelling v3 animation")
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
        console.log("restarting v3 animations")
        requestIdRef.current = requestAnimationFrame(tick);
      }
      if (evt[0].intersectionRatio === 1 && rotation === "unset") {
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
      console.log("selected")
    }
  }

  const mouseUp = (evt) => {
    selectedDipoleRef.current = null
    setRotation("free")
    console.log("unselected")
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

  return <div>
      <canvas ref={canvasRef} onMouseMove={mouseMove} onMouseUp={mouseUp} onMouseDown={mouseDown} className="dipole-vis" width={width} height={height} style={{width:width, height: height}}></canvas>
      <div>
        
      </div>

      <div>
        Field Strength:
        <input type="range" min="0" max="2" value={BGStrength} onChange={(evt) => {setBGStrength(evt.target.value)}} id="myRange"></input>

        Separation:
        <input type="range" min="3" max="300" value={separation} onChange={(evt) => {setSeparation(evt.target.value)}} id="myRange2"></input>
      </div>
    </div>
}

export default DipoleV4