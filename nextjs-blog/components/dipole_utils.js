const PI = 3.1415926
const width = 614
const height = 400

export const findNorth = (dipole) => {
  const x = Math.cos(dipole.theta) * dipole.radius + dipole.x
  const y = Math.sin(dipole.theta) * dipole.radius + dipole.y
  return [x, y]
}
export const findSouth = (dipole) => {
  const x = Math.cos(dipole.theta + PI) * dipole.radius + dipole.x
  const y = Math.sin(dipole.theta + PI) * dipole.radius + dipole.y
  return [x, y]
}

export const cross2D = (r, F) => {
  return r[0] * F[1] - r[1] * F[0]
}

export const applyTorques = (dipoles) => {
  const dt = 0.01
  const kdrag = 1
  for (let d of dipoles) {
    d.ddtheta = d.nettorque / d.moment - d.dtheta * kdrag  // acceleration
    d.dtheta += d.ddtheta * dt  // velocity
    d.theta += d.dtheta * dt  // position
  }
}

export const sampleField = (x, y, dipoles, reverse) => {
  let fieldX = 0
  let fieldY = 0
  const distanceScale = .001  // each pixels = 1 mm

  for (let i = 0; i < dipoles.length; i++) {
    const d = dipoles[i]

    const [x1, y1] = findNorth(d)

    // make a vector that points from the point in question to the North Monopole
    let dirNorthX = x - x1
    let dirNorthY = y - y1
    // normalize that vector
    const radiusNorth = Math.hypot(dirNorthX, dirNorthY)
    dirNorthX /= radiusNorth
    dirNorthY /= radiusNorth
    // it now has a length of 1 unit = 1 pixel = 1 mm

    // The actual field strength
    const distCorrectionNorth = 1 / (radiusNorth * radiusNorth * distanceScale * distanceScale)
    fieldX += dirNorthX * distCorrectionNorth * d.strength
    fieldY += dirNorthY * distCorrectionNorth * d.strength

    // find the location of the South Monopole
    const [x2, y2] = findSouth(d)

    let dirSouthX = x - x2
    let dirSouthY = y - y2
    // normalize that vector
    const radiusSouth = Math.hypot(dirSouthX, dirSouthY)
    dirSouthX /= radiusSouth
    dirSouthY /= radiusSouth
    // The actual field strength
    const distCorrectionSouth = 1 / (radiusSouth * radiusSouth * distanceScale * distanceScale)
    fieldX -= dirSouthX * distCorrectionSouth * d.strength
    fieldY -= dirSouthY * distCorrectionSouth * d.strength

  }
  if (reverse) {
    return [-fieldX, -fieldY]
  } else {
    return [fieldX, fieldY]
  }
}


export function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}



export const renderFieldVectors = (ctx, dipoles) => {
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

export const renderStreamlines = (ctx, dipoles) => {
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

export const renderDipole = (ctx, d, selected, north) => {
  const theta0 = Math.atan2(d.h, d.w) + d.theta + PI /2
  const theta1 = Math.atan2(d.h, -d.w) + d.theta + PI /2
  const theta2 = Math.atan2(-d.h, -d.w) + d.theta + PI /2
  const theta3 = Math.atan2(-d.h, d.w) + d.theta + PI /2

  const thetaL = 0 + d.theta + PI/2
  const thetaR = PI + d.theta + PI/2

  ctx.fillStyle = 'blue';
  ctx.beginPath()
  ctx.moveTo(Math.cos(theta0) * d.radius + d.x, Math.sin(theta0) * d.radius + d.y)
  ctx.lineTo(Math.cos(theta1) * d.radius + d.x, Math.sin(theta1) * d.radius + d.y)
  ctx.lineTo(Math.cos(thetaR) * d.w + d.x, Math.sin(thetaR) * d.w + d.y)
  ctx.lineTo(Math.cos(thetaL) * d.w + d.x, Math.sin(thetaL) * d.w + d.y)
  ctx.lineTo(Math.cos(theta0) * d.radius + d.x, Math.sin(theta0) * d.radius + d.y)
  ctx.stroke()
  ctx.fill()

  ctx.fillStyle = 'red';
  ctx.beginPath()
  ctx.moveTo(Math.cos(theta2) * d.radius + d.x, Math.sin(theta2) * d.radius + d.y)
  ctx.lineTo(Math.cos(theta3) * d.radius + d.x, Math.sin(theta3) * d.radius + d.y)
  ctx.lineTo(Math.cos(thetaL) * d.w + d.x, Math.sin(thetaL) * d.w + d.y)
  ctx.lineTo(Math.cos(thetaR) * d.w + d.x, Math.sin(thetaR) * d.w + d.y)
  ctx.lineTo(Math.cos(theta2) * d.radius + d.x, Math.sin(theta2) * d.radius + d.y)
  ctx.stroke()
  ctx.fill()



  if (selected) {
    if (north) {
      const [nx, ny] = findNorth(d)
      ctx.strokeStyle = 'black'
      ctx.beginPath();
      ctx.arc(nx, ny, 30, 0, 2 * Math.PI);
      ctx.stroke();
    } else {
      const [sx, sy] = findSouth(d)
      ctx.strokeStyle = 'black'
      ctx.beginPath();
      ctx.arc(sx, sy, 30, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}