
import React, { useEffect, useState, useRef } from 'react'
import { findNorth, findSouth, cross2D, sampleField } from './dipole_utils'

const width = 614
const height = 400
const PI = 3.1415926


const DipoleV2 = (props) => {
  const dipole1Ref = useRef({
    x: width * 1/3, y: height/2, w: 10, h: 40,
    theta: PI/2, dtheta:0, moment: 1,
    strength:1.5});
  const dipole2Ref = useRef({
    x: width * 2/3, y: height/2, w: 10, h: 40,
    theta: PI/2, dtheta:0, moment: 1, 
    strength: .5});
    dipole1Ref.current.radius = dipole1Ref.current.h
    dipole2Ref.current.radius = dipole2Ref.current.h


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
  
  const renderDipole = (ctx, d, renderForces) => {
    const theta0 = Math.atan2(d.h, d.w) + d.theta + PI /2
    const theta1 = Math.atan2(d.h, -d.w) + d.theta + PI /2
    const theta2 = Math.atan2(-d.h, -d.w) + d.theta + PI /2
    const theta3 = Math.atan2(-d.h, d.w) + d.theta + PI /2

    ctx.strokeStyle = 'black';
    ctx.beginPath()
    ctx.moveTo(Math.cos(theta0) * d.radius + d.x, Math.sin(theta0) * d.radius + d.y)
    ctx.lineTo(Math.cos(theta1) * d.radius + d.x, Math.sin(theta1) * d.radius + d.y)
    ctx.lineTo(Math.cos(theta2) * d.radius + d.x, Math.sin(theta2) * d.radius + d.y)
    ctx.lineTo(Math.cos(theta3) * d.radius + d.x, Math.sin(theta3) * d.radius + d.y)
    ctx.lineTo(Math.cos(theta0) * d.radius + d.x, Math.sin(theta0) * d.radius + d.y)
    ctx.stroke()
  }
  
  const renderFieldVectors = (ctx, dipoles) => {
    const fieldScale = 10
    ctx.lineWidth = .75;
    ctx.strokeStyle = "green"
    for (let x = 0; x < width; x += 20) {
      for (let y = 0; y < height; y += 20) {
        const [fieldX, fieldY] = sampleField(x, y, dipoles)

        let l = Math.sqrt(fieldX * fieldX + fieldY * fieldY)
        const [dirX, dirY] = [fieldX / l, fieldY / l]
        const angle = Math.atan2(dirY, dirX)

        const tipX = x + dirX * fieldScale
        const tipY = y + dirY * fieldScale

        const tipAngleSpread = PI / 9
        const tipAngleLength = 3
        const tipAngle1 = angle + PI + tipAngleSpread
        const tipAngle2 = angle + PI - tipAngleSpread


        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(tipX, tipY)
        ctx.lineTo(Math.cos(tipAngle1) * tipAngleLength + tipX, Math.sin(tipAngle1) * tipAngleLength + tipY)
        ctx.moveTo(tipX, tipY)
        ctx.lineTo(Math.cos(tipAngle2) * tipAngleLength + tipX, Math.sin(tipAngle2) * tipAngleLength + tipY)
        ctx.stroke()
      }
    }
  }

  const renderStreamlines = (ctx, dipoles) => {
    ctx.strokeStyle = 'red';
    // First emit the lines from the North poles
    const streamlineStartOffset = 2
    const numLines = 18
    const fanAngle = 2 * PI / numLines
    for (let i = 0; i < dipoles.length; i +=1 ){
      // For each dipole we need to draw the field lines
      const d = dipoles[i]
      d.terminalAngles = []

      // At the North monopole, start emitting streamlines in a circle
      const [northX, northY] = findNorth(d)

      for (let t = d.theta; t < 2 * PI + d.theta; t += fanAngle) {
        const startingX = northX + Math.cos(t) * streamlineStartOffset
        const startingY = northY + Math.sin(t) * streamlineStartOffset

        const path = integratePath(startingX, startingY, dipoles, false)
        
        
        const prevX = northX
        const prevY = northY
        for (let p = 0; p < path.length; p++) {
          const fraction = p / path.length
          const pt = path[p]
          
          ctx.beginPath()
          ctx.moveTo(prevX, prevY)          
          ctx.strokeStyle = `rgb(${(1 - fraction) * 254},0, ${fraction * 254})`
          ctx.lineTo(pt[0], pt[1])

          ctx.stroke()
          prevX = pt[0]
          prevY = pt[1]

        }
      }
    }
    
    return
    // Now examine the south poles to see what lines are missing
    for (let i = 0; i < dipoles.length; i +=1 ){
      const d = dipoles[i]
      if (!d.terminalAngles) return

      // At the South monopole, check the terminal angles

      // if (d.terminalAngles.length !== numLines) {
      if (true) {
        // const numMissing = numLines - d.terminalAngles.length
        // const anglesMissing = new Set()
        
        // // Find the ones that are missing and emit them!        
        // for (let a = 0; a < numLines; a++) {
        //   anglesMissing.add(a) // assume every line is missing
        // }
        
        // for (let j = 0; j < d.terminalAngles.length; j++) {
        //   let correctedAngle = d.terminalAngles[j]
        //   correctedAngle -= d.theta 
        //   if (correctedAngle < 0){
        //     correctedAngle += 2 * PI
        //   } 
        //   // They should now all go from 0 --> 2 * PI spaced equally

        //   correctedAngle /= 2 * PI
        //   // now from 0 --> 1

        //   correctedAngle *= numLines
        //   // now from 0 --> numLines

        //   anglesMissing.delete(Math.round(correctedAngle))

        // }
        // console.log("Still missing:", anglesMissing)
        
        const anglesMissing = []
        d.terminalAngles.sort()

        const differences = []
        for (let ai = 1; ai < d.terminalAngles.length; ai++) {
          const angleDiff = d.terminalAngles[ai] - d.terminalAngles[ai - 1]
          differences.push(angleDiff)

          const numInside = angleDiff / fanAngle

          if (numInside < 2) {
            continue
          } else {
            // place just one, right in the middle!
            const leftAngle = d.terminalAngles[ai] + PI
            const rightAngle = d.terminalAngles[ai-1] + PI
            const avg = (leftAngle + rightAngle) / 2

            // anglesMissing.push((d.terminalAngles[ai] + PI) + d.terminalAngles[ai-1] + PI)
            // anglesMissing.push(d.terminalAngles[ai-1] + PI)
            anglesMissing.push(avg)
          }
        }

        // anglesMissing.push(0)
        // for (let ai = 0; ai < numLines; ai++ ) {
        //   anglesMissing.pu
        // }



        // console.log("one dipole")
        // let prevAngle = 0
        // for (let angle of d.terminalAngles) {
        //   if (angle - prevAngle > fanAngle * 1.05) {
        //     anglesMissing.push(prevAngle + fanAngle)
        //   }
        //   prevAngle = angle
        //   // if (angle > fanAngle) {
        //   //   anglesMissing.push(0)

        //   // }
        // }

        // if (d.terminalAngles[d.terminalAngles.length - 1] < 2 * PI) {
        // anglesMissing.push(fanAngle * 10 + d.theta)
        // anglesMissing.push(fanAngle * 11 + d.theta)
        // anglesMissing.push(fanAngle * 12 + d.theta)
        // anglesMissing.push(2 * PI - fanAngle)
        // anglesMissing.push(2 * PI - fanAngle * 2)
        // }



        // Emit some lines from the South poles
        const [southX, southY] = findSouth(d)
        for (let a of anglesMissing) {
          // const aCorrected = a / numLines // now back to 0 --> 1
          // aCorrected *= 2 * PI // now back to 0 --> 2 PI
          // aCorrected += d.theta
          // console.log(aCorrected)
          const startingX = southX + Math.cos(a) * streamlineStartOffset
          const startingY = southY + Math.sin(a) * streamlineStartOffset
          const path = integratePath(startingX, startingY, dipoles, true)

          const prevX = southX
          const prevY = southY
          for (let p = 0; p < path.length; p++) {
            const fraction = p / path.length
            const pt = path[p]
            
            ctx.beginPath()
            ctx.moveTo(prevX, prevY)          
            // ctx.strokeStyle = `rgb(${(1 - fraction) * 254},0, ${fraction * 254})`
            ctx.strokeStyle = "green"
            ctx.lineTo(pt[0], pt[1])

            ctx.stroke()
            prevX = pt[0]
            prevY = pt[1]

          }
        }

      }

    }

  }

  const integratePath = (startingX, startingY, dipoles, reverse) => {
    // reverse = false means start at North pole and follow
    // reverse = true means start at South pole and follow
    const path = []
    path.push([startingX, startingY])

    let x = startingX
    let y = startingY

    const step = 5

    const endpoints = []
    for (let d of dipoles) {
      if (reverse) {
        endpoints.push(findNorth(d))
      } else {
        endpoints.push(findSouth(d))
      }
    }

    for (let s = 0; s < 3000; s++) {
      // rk4
      let [k1x, k1y] = sampleField(x, y, dipoles, reverse)
      const k1l = Math.hypot(k1x, k1y)
      k1x = k1x / k1l
      k1y = k1y / k1l

      let [k2x, k2y] = sampleField(x + k1x * step / 2, y + k1y * step / 2, dipoles, reverse)
      const k2l = Math.hypot(k2x, k2y)
      k2x = k2x / k2l
      k2y = k2y / k2l

      let [k3x, k3y] = sampleField(x + k2x * step / 2, y + k2y * step / 2, dipoles, reverse)
      const k3l = Math.hypot(k3x, k3y)
      k3x = k3x / k3l
      k3y = k3y / k3l

      let [k4x, k4y] = sampleField(x + k3x * step, y + k3y * step, dipoles, reverse)
      const k4l = Math.hypot(k4x, k4y)
      k4x = k4x / k4l
      k4y = k4y / k4l

      let kx = 1/6 * (k1x + 2 * k2x + 2 * k3x + k4x)
      let ky = 1/6 * (k1y + 2 * k2y + 2 * k3y + k4y)

      x += kx * step
      y += ky * step

      // check if we're very close to a south pole
      const terminated = false
      for (let e = 0; e < endpoints.length; e++) {
        const endpoint = endpoints[e]
        const dist = Math.hypot(endpoint[0] - x, endpoint[1] - y)
        if (dist < step) {
          path.push(endpoint)
          let terminalAngle = Math.atan2(endpoint[1] - y, endpoint[0] - x)
          if (terminalAngle < 0) {
            terminalAngle += 2 * PI
          }
          if (dipoles[e].terminalAngles) {
            dipoles[e].terminalAngles.push(terminalAngle)
          }
          
          terminated = true
        }
      }
      
      if (terminated) {
        break
      } else {
        path.push([x, y])
      }
    }
    return path
  }

  const findForce = (m1x, m1y, m2x, m2y, m1s, m2s, attractive) => {
    // Find the force that m1 feels because of m2, assuming they attract
    const fMagGain = 100000
    const dx = m2x - m1x
    const dy = m2y - m1y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const dirx = dx / dist 
    const diry = dy / dist
    const fMag = m1s * m2s / (dist * dist) * fMagGain

    const fx = dirx * fMag
    const fy = diry * fMag
    if (attractive) {
      return [fx, fy]
    } else {
      return [-fx, -fy]
    }
  }

  const calculateTorques = (dipoles) => {
    // This just finds the torques and saves them to the dipoles for rendering
    const distanceScale = .001  // each pixels = 1 mm

    for (let d of dipoles) {
      // For each dipole we need to calculate torque
      const [northX, northY] = findNorth(d)
      const [southX, southY] = findSouth(d)

      d.north = {}
      d.south = {}

      // The first step is to find all the dipoles which are not this dipole
      for (let other of dipoles) {
        if (other == d) {
          continue
        }

        const [otherNorthX, otherNorthY] = findNorth(other)
        const [otherSouthX, otherSouthY] = findSouth(other)

        // Our dipole's North pole feels attraction to the other dipole's South pole
        d.north.south = findForce(northX, northY, otherSouthX, otherSouthY, d.strength, other.strength, true)
        
        // and our dipole's North pole feels repulsion from the other dipole's North pole
        d.north.north = findForce(northX, northY, otherNorthX, otherNorthY, d.strength, other.strength, false)
        d.north.net = [d.north.north[0] + d.north.south[0], d.north.north[1] + d.north.south[1]]
        const northDx = northX - d.x
        const northDy = northY - d.y
        d.north.torque = cross2D([northDx, northDy], [d.north.net[0], d.north.net[1]])
        
        // Our dipole's South pole feels attraction to the other dipole's North pole
        d.south.north = findForce(southX, southY, otherNorthX, otherNorthY, d.strength, other.strength, true)
        // and our dipole's North pole feels repulsion from the other dipole's North pole
        d.south.south = findForce(southX, southY, otherSouthX, otherSouthY, d.strength, other.strength, false)
        d.south.net = [d.south.north[0] + d.south.south[0], d.south.north[1] + d.south.south[1]]
        const southDx = southX - d.x
        const southDy = southY - d.y
        d.south.torque = cross2D([southDx, southDy], [d.south.net[0], d.south.net[1]])
        

        d.net = [d.north.net[0] + d.south.net[0], d.north.net[1] + d.south.net[1]]
        d.nettorque = d.north.torque + d.south.torque
        
        
      }
    }
  }

  const applyTorques = (dipoles) => {
    const dt = 0.01
    const kdrag = 1
    for (let d of dipoles) {
      d.ddtheta = d.nettorque / d.moment - d.dtheta * kdrag  // acceleration
      d.dtheta += d.ddtheta * dt  // velocity
      d.theta += d.dtheta * dt  // position
    }
  }

  const renderFrame = () => {
    const d1 = dipole1Ref.current
    const d2 = dipole2Ref.current

    // Simulate the physics
    calculateTorques([d1, d2]) 
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
    renderDipole(ctx, d1, false)
    renderDipole(ctx, d2, false)

    if (showFieldLinesRef.current) {
      renderStreamlines(ctx, [d1, d2])
    }
    if (showFieldVectorsRef.current) {
      renderFieldVectors(ctx, [d1, d2])
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
      if (evt[0].intersectionRatio === 1 && rotation === "unset") {
        setRotation("free")
      }
      
      canvasVisibleRef.current = evt[0].isIntersecting
    }, {rootMargin: "0px", threshold: [.01, 1]});
    observer.observe(canvasRef.current);
  }, [])


  return <div>
      <canvas ref={canvasRef} className="dipole-vis" width={width} height={height} style={{width:width, height: height}}></canvas>
      <input type="checkbox" checked={rotation==="driven"} id="rotate3" name="rotate" value="rotate" onChange={() => setRotation(rotation==="driven"?"free":"driven")}></input>
      <label htmlFor="rotate3"> Autospin </label>

      <input type="checkbox" checked={showFieldLines} id="showfieldlines3" name="showfieldlines" value="showfieldlines" onChange={() => setShowFieldLines(!showFieldLines)}></input>
      <label htmlFor="showfieldlines3"> Show Field Lines </label>
      
      <input type="checkbox" checked={showFieldVectors} id="showfieldvectors3" name="showfieldvectors" value="showfieldvectors" onChange={() => setShowFieldVectors(!showFieldVectors)}></input>
      <label htmlFor="showfieldvectors3"> Show Field Vectors </label>
      
    </div>
}

export default DipoleV2