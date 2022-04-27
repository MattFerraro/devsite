
import React, { useEffect, useState, useRef } from 'react'
import { newProblem, poissonSolveDirichlet } from './poisson'

const width = 614
const height = 400
const PI = 3.1415926

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function onMouseMove(el, ctx, event) {
  drawAxes(ctx, true)
  const pos = getMousePos(el, event)
}

const DipoleV2 = (props) => {
  const dipole1Ref = useRef({ x: width * 1/3, y: height/2, w: 10, h: 40, theta: PI/2 });
  const dipole2Ref = useRef({ x: width * 2/3, y: height/2, w: 10, h: 40, theta: 0 });
  const phiRef = useRef({})
  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  const discretization = 4

  const renderDipole = (ctx, d) => {
    const effectiveRadius = Math.sqrt(d.w * d.w + d.h * d.h)
    const theta0 = Math.atan2(d.h, d.w) + d.theta + PI /2
    const theta1 = Math.atan2(d.h, -d.w) + d.theta + PI /2
    const theta2 = Math.atan2(-d.h, -d.w) + d.theta + PI /2
    const theta3 = Math.atan2(-d.h, d.w) + d.theta + PI /2

    ctx.beginPath()
    ctx.moveTo(Math.cos(theta0) * effectiveRadius + d.x, Math.sin(theta0) * effectiveRadius + d.y)
    ctx.lineTo(Math.cos(theta1) * effectiveRadius + d.x, Math.sin(theta1) * effectiveRadius + d.y)
    ctx.lineTo(Math.cos(theta2) * effectiveRadius + d.x, Math.sin(theta2) * effectiveRadius + d.y)
    ctx.lineTo(Math.cos(theta3) * effectiveRadius + d.x, Math.sin(theta3) * effectiveRadius + d.y)
    ctx.lineTo(Math.cos(theta0) * effectiveRadius + d.x, Math.sin(theta0) * effectiveRadius + d.y)
    ctx.stroke()
  }
  const renderPhi = (ctx, phi, method='potential') => {
    if (method === 'potential') {
      for (let y = 0; y < phi.length; y++) {
        for (let x = 0; x < phi[0].length; x++) {
          const val = phi[y][x]
          const redness = Math.floor(val) * 4
          const blueness = Math.floor(-val) * 4
          const fillStyle = `rgba(${redness},${blueness},0,.5)`
          ctx.fillStyle = fillStyle;
          ctx.fillRect(x * discretization, y * discretization, discretization, discretization)
        }
      }
    } else if (method === 'vector') {
      for (let y = 0; y < phi.length - 1; y++) {
        for (let x = 0; x < phi[0].length - 1; x++) {
          const val = phi[y][x]
          const dx = phi[y][x + 1] - val
          const dy = phi[y + 1][x] - val
          
          ctx.beginPath()
          ctx.moveTo(x * discretization, y * discretization)
          ctx.lineTo(x * discretization + dx, y * discretization + dy)
          ctx.stroke()
        }
      }
    } else if (method === 'lines') {
      for (let y = 0; y < phi.length - 1; y++) {
        for (let x = 0; x < phi[0].length - 1; x++) {
          const val = phi[y][x]
          const dx = phi[y][x + 1] - val
          const dy = phi[y + 1][x] - val
          
          ctx.beginPath()
          ctx.moveTo(x * discretization, y * discretization)
          ctx.lineTo(x * discretization + dx, y * discretization + dy)
          ctx.stroke()
        }
      }
    }
  }

  const renderFrame = () => {
    const phi = phiRef.current
    const d1 = dipole1Ref.current
    const d2 = dipole2Ref.current
    // console.log(d2)

    let H = newProblem(width / discretization, height / discretization)
    for (let d of [d1, d2]) {
      const effectiveRadius = Math.sqrt(d.w * d.w + d.h * d.h)
      const x1 =  Math.round((Math.cos(d.theta) * effectiveRadius + d.x) / discretization)
      const y1 = Math.round((Math.sin(d.theta) * effectiveRadius + d.y) / discretization)
      const x2 = Math.round((Math.cos(d.theta + PI) * effectiveRadius + d.x) / discretization)
      const y2 = Math.round((Math.sin(d.theta + PI) * effectiveRadius + d.y) / discretization)
      H[y1][x1] = 100
      H[y2][x2] = -100
    }
    
    let iterations = poissonSolveDirichlet(phi, 0, 0, 0, 0, H)
    console.log(iterations)
    const ctx = canvasRef.current.getContext("2d")
    ctx.clearRect(0,0, width, height)

    renderDipole(ctx, d1)
    renderDipole(ctx, d2)
    renderPhi(ctx, phi, 'lines')

    d2.theta += 0.01
  };

  const tick = () => {
    if (!canvasRef.current) return;
    renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    let phi = newProblem(width / discretization, height / discretization)
    let H = newProblem(width / discretization, height / discretization)

    // This modifies phi in place!
    let iterations = poissonSolveDirichlet(phi, 100, 0, 0, 0, H)

    phiRef.current = phi

    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };

  }, [])


  return <canvas ref={canvasRef} className="dipole-vis" width={width} height={height} style={{width:width, height: height}}></canvas>
}

export default DipoleV2