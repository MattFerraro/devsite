
import React, { useEffect } from 'react'

const width = 614
const height = 400
const radius = .5
const scale = 75

function canvasArrow(ctx, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function drawAxes(ctx, unitCircle = false) {
  ctx.lineWidth = 2;
  ctx.clearRect(0,0, width, height)

  ctx.strokeStyle = "#00FF00";
  ctx.beginPath();
  ctx.moveTo(width/2, 0);
  ctx.lineTo(width/2, height);
  ctx.stroke(); 

  ctx.strokeStyle = "#0000FF";
  ctx.beginPath();
  ctx.moveTo(0, height/2);
  ctx.lineTo(width, height/2);
  ctx.stroke(); 

  if (unitCircle) {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(width/2, height/2, 1 * scale, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Draw the points
  ctx.beginPath();
  ctx.arc(1 * scale + width/2, 0 * scale + height / 2, .08 * scale, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.font = "25px Times New Roman";
  ctx.textAlign = "center";
  ctx.fillText("1", 1 * scale + width / 2 + 20, 0 * scale + height / 2 + 8); 

  ctx.beginPath();
  ctx.arc(-1 * scale + width/2, 0 * scale + height / 2, .08 * scale, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.fillText("-1", -1 * scale + width / 2 - 20, 0 * scale + height / 2 + 8); 

  ctx.beginPath();
  ctx.arc(0 * scale + width/2, 1 * scale + height / 2, .08 * scale, 0, 2 * Math.PI, false);
  ctx.fillText("-i", 0 * scale + width / 2, 1 * scale + height / 2 + 35); 
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0 * scale + width/2, -1 * scale + height / 2, .08 * scale, 0, 2 * Math.PI, false);
  ctx.fillText("i", 0 * scale + width / 2, -1 * scale + height / 2 - 20); 
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0 * scale + width/2, 0 * scale + height / 2, .08 * scale, 0, 2 * Math.PI, false);
  ctx.fillText("0", 0 * scale + width / 2 + 15, 0 * scale + height / 2 + 25); 
  ctx.fill();

}

function drawRegularCircle(ctx, pos, radiusOverride = radius, reticle = false) {
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.arc(pos.x, pos.y, radiusOverride * scale, 0, 2 * Math.PI);
  ctx.stroke(); 

  if (reticle) {
    ctx.beginPath()
    ctx.moveTo(pos.x - radiusOverride * scale, pos.y)
    ctx.lineTo(pos.x + radiusOverride * scale, pos.y)
    ctx.moveTo(pos.x, pos.y - radiusOverride * scale)
    ctx.lineTo(pos.x, pos.y + radiusOverride * scale)
    ctx.stroke()
  }
}

function drawUltimateCircle(ctx, pos, radiusOverride = radius, reticle = false) {
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#FFA50088";
  ctx.arc(pos.x, pos.y, radiusOverride * scale, 0, 2 * Math.PI);
  ctx.fill()
  ctx.stroke();

  // ctx.beginPath();
  // ctx.strokeStyle = "#FFA500";
  // ctx.arc(pos.x, pos.y, radiusOverride * scale * .9, 0, 2 * Math.PI);
  // ctx.stroke();

  if (reticle) {
    ctx.beginPath()
    ctx.moveTo(pos.x - radiusOverride * scale, pos.y)
    ctx.lineTo(pos.x + radiusOverride * scale, pos.y)
    ctx.moveTo(pos.x, pos.y - radiusOverride * scale)
    ctx.lineTo(pos.x, pos.y + radiusOverride * scale)
    ctx.stroke()
  }

  const n = 4
  for (let i = 0; i < n; i++) {
    // The point for the head of the arrow
    const theta = 3.1415926 * 2 * i / n
    const x = Math.cos(theta) * radiusOverride * scale + pos.x
    const y = Math.sin(theta) * radiusOverride * scale + pos.y

    // The point for the tail of the arrow
    const theta2 = theta - 0.01
    const x2 = Math.cos(theta2) * radiusOverride * scale + pos.x
    const y2 = Math.sin(theta2) * radiusOverride * scale + pos.y

    ctx.beginPath()
    canvasArrow(ctx, x2, y2, x, y)
    ctx.stroke()
    ctx.closePath()
  }
}

function drawInverseUltimateCircle(ctx, pos, bizarro = false) {
  // real coords, center of circle
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#FFA50088";
  let realXCenter = (pos.x - width / 2) / scale
  let realYCenter = (pos.y - height / 2) / scale
  if (bizarro) {
    realYCenter = (pos.x - width / 2) / scale
    realXCenter = (pos.y - height / 2) / scale
  }
  const realRadius = Math.sqrt(realXCenter * realXCenter + realYCenter * realYCenter)

  const n = 180
  const pts = []
  for (let i = 0; i < n; i++) {
    const angle = 2 * 3.1415926 / n * i
    // real coords
    const x = Math.cos(angle) * radius + realXCenter
    const y = Math.sin(angle) * radius + realYCenter

    // real coords
    const r = Math.sqrt((x * x) + (y * y))
    const theta = Math.atan2(y, x)
    const rInverse = 1 / r
    const thetaInverse = -theta
    
    // Real Coords
    const x2 = Math.cos(thetaInverse) * rInverse
    const y2 = Math.sin(thetaInverse) * rInverse

    if (bizarro) {
      pts.push({y: x2, x: y2})
    } else {
      pts.push({x: x2, y: y2})
    }
  }

  // FILL IN THE BIG CIRCLE
  
  ctx.beginPath();
  const pt0 = pts[0]
  ctx.moveTo(pt0.x * scale + width / 2, pt0.y * scale + height / 2)
  for (let i = 1; i < n; i++) {
    let pt1
    if (i == n - 1) {
      pt1 = pts[0]
    } else {
      pt1 = pts[i]
    }
    ctx.lineTo(pt1.x * scale + width / 2, pt1.y * scale + height / 2)
  }
  ctx.stroke();
  if (realRadius > radius) {
    ctx.fill();
  } else {
    const pt0 = pts[0]
    const boost = 5
    ctx.moveTo(pt0.x*boost * scale + width / 2, pt0.y*boost * scale + height / 2)
    for (let i = 1; i < n; i++) {
      let pt1
      if (i == n - 1) {
        pt1 = pts[0]
      } else {
        pt1 = pts[i]
      }
      ctx.lineTo(pt1.x*boost * scale + width / 2, pt1.y*boost * scale + height / 2)
    }
    ctx.fill("evenodd");
  }
  ctx.closePath();

  // DRAW THE ARROW HEADS
  const m = 4
  for (let i = 0; i < m; i++) {
    const indx = i / m * 180;
    // The point for the head of the arrow
    const x = pts[indx].x * scale + width / 2
    const y = pts[indx].y * scale + height / 2

    // The point for the tail of the arrow
    const x2 = pts[indx+1].x * scale + width / 2
    const y2 = pts[indx+1].y * scale + height / 2

    ctx.beginPath()
    if (bizarro) {
      canvasArrow(ctx, x2, y2, x, y)
    } else {
      canvasArrow(ctx, x, y, x2, y2)
    }
    ctx.stroke()
    ctx.closePath()
  }
}

function drawInverseCircle(ctx, pos) {
  // real coords, center of circle
  ctx.strokeStyle = "#000000";
  const realXCenter = (pos.x - width / 2) / scale
  const realYCenter = (pos.y - height / 2) / scale

  const n = 180
  const pts = []
  for (let i = 0; i < n; i++) {
    const angle = 2 * 3.1415926 / n * i
    // real coords
    const x = Math.cos(angle) * radius + realXCenter
    const y = Math.sin(angle) * radius + realYCenter

    // real coords
    const r = Math.sqrt((x * x) + (y * y))
    const theta = Math.atan2(y, x)
    const rInverse = 1 / r
    const thetaInverse = -theta
    
    // Real Coords
    const x2 = Math.cos(thetaInverse) * rInverse
    const y2 = Math.sin(thetaInverse) * rInverse

    pts.push({x: x2, y: y2})
  }

  for (let i = 0; i < n; i++) {
    const pt0 = pts[i]
    let pt1
    if (i == n - 1) {
      pt1 = pts[0]
    } else {
      pt1 = pts[i + 1]
    }
    ctx.beginPath();
    ctx.moveTo(pt0.x * scale + width / 2, pt0.y * scale + height / 2)
    ctx.lineTo(pt1.x * scale + width / 2, pt1.y * scale + height / 2)
    ctx.stroke(); 
  }
}

function drawInverseCursor(ctx, pos, radiusOverride = radius, reticle = false, circle=true) {
  // real coords
  ctx.strokeStyle = "#000000";
  const realX = (pos.x - width / 2) / scale
  const realY = (pos.y - height / 2) / scale
  const r = Math.sqrt((realX * realX) + (realY * realY))
  const theta = Math.atan2(realY, realX)
  const rInverse = 1 / r

  const thetaInverse = -theta
  const x2 = Math.cos(thetaInverse) * rInverse * scale
  const y2 = Math.sin(thetaInverse) * rInverse * scale
  
  if (circle) {
    ctx.beginPath();
    ctx.arc(x2 + width/2, y2 + height/2, radiusOverride * scale, 0, 2 * Math.PI);
    ctx.stroke();
  }

  if (reticle) {
    ctx.beginPath()
    ctx.moveTo(x2 + width/2 - radiusOverride * scale, y2 + height/2)
    ctx.lineTo(x2 + width/2 + radiusOverride * scale, y2 + height/2)
    ctx.moveTo(x2 + width/2, y2 + height/2 - radiusOverride * scale)
    ctx.lineTo(x2 + width/2, y2 + height/2 + radiusOverride * scale)
    ctx.stroke()
  }

  //pixel coords
  const screenX = x2 + width / 2
  const screenY = y2 + height / 2
  if (screenX > width || screenX < 0 || screenY > height || screenY < 0) {
    // const phi = Math.atan2(y2, x2)
    //TODO: implement this
  }
  
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

const CircleInverterRealizer = (props) => {
  useEffect(async () => {
    document.querySelectorAll('.circle-inverter').forEach((el) => {
      const ctx = el.getContext("2d");
      el.addEventListener("mousemove", (event) => {
        const pos = getMousePos(el, event)
        drawAxes(ctx, true)
        drawRegularCircle(ctx, pos)
        drawInverseCircle(ctx, pos)
      })
      drawAxes(ctx, true)
    })

    document.querySelectorAll('.ultimate-circle-inverter').forEach((el) => {
      const ctx = el.getContext("2d");
      el.addEventListener("mousemove", (event) => {
        const pos = getMousePos(el, event)
        drawAxes(ctx, true)
        drawUltimateCircle(ctx, pos)
        if (el.attributes.bizarro && el.attributes.bizarro.value === "yes") {
          drawInverseUltimateCircle(ctx, pos, true)
        } else {
          drawInverseUltimateCircle(ctx, pos)
        }
      })
      drawAxes(ctx, true)
    })

    document.querySelectorAll('.complex-number-inverter').forEach((el) => {
      const ctx = el.getContext("2d");
      el.addEventListener("mousemove", (event) => {
        const pos = getMousePos(el, event)
        drawAxes(ctx, true)
        // drawRegularCircle(ctx, pos, 0.2, true)
        drawInverseCursor(ctx, pos, 0.2, true, false)
      })
      drawAxes(ctx, true)
    })
  })
  return <div></div>
}

export default CircleInverterRealizer