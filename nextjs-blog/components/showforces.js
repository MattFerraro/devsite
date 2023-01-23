const [showForces, setShowForces] = useState(false)
const showForcesRef = useRef(showForces)
useEffect(() => {
  showForcesRef.current = showForces
}, [showForces])

<input type="checkbox" checked={showForces} id="showforces" name="showforces" value="showforces" onChange={() => setShowForces(!showForces)}></input>
<label htmlFor="showforces"> Show Forces </label>

const [nx, ny] = findNorth(d)
const [sx, sy] = findSouth(d)

if (renderForces) {
  ctx.strokeStyle = 'red';
  if (d.north.north) {
    ctx.beginPath()
    ctx.moveTo(nx, ny)
    ctx.lineTo(nx + d.north.north[0] * 10, ny + d.north.north[1] * 10)
    ctx.stroke()
  }
  ctx.strokeStyle = 'blue';
  if (d.north.south) {
    ctx.beginPath()
    ctx.moveTo(nx, ny)
    ctx.lineTo(nx + d.north.south[0] * 10, ny + d.north.south[1] * 10)
    ctx.stroke()
  }
  ctx.strokeStyle = 'green';
  if (d.south.north) {
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(sx + d.south.north[0] * 10, sy + d.south.north[1] * 10)
    ctx.stroke()
  }
  ctx.strokeStyle = 'purple';
  if (d.south.south) {
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(sx + d.south.south[0] * 10, sy + d.south.south[1] * 10)
    ctx.stroke()
  }


  ctx.strokeStyle = 'orange';
  if (d.north.net) {
    ctx.beginPath()
    ctx.moveTo(nx, ny)
    ctx.lineTo(nx + d.north.net[0] * 10, ny + d.north.net[1] * 10)
    ctx.stroke()
  }

  ctx.strokeStyle = 'brown';
  if (d.south.net) {
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(sx + d.south.net[0] * 10, sy + d.south.net[1] * 10)
    ctx.stroke()
  }


  ctx.strokeStyle = 'gray';
  if (d.net) {
    ctx.beginPath()
    ctx.moveTo(d.x, d.y)
    ctx.lineTo(d.x + d.net[0] * 10, d.y + d.net[1] * 10)
    ctx.stroke()
  }
}


<input type="checkbox" checked={rotation==="free"} id="free" name="free" value="free" onChange={() => setRotation("free")}></input>
<label htmlFor="free"> Free </label>

<input type="checkbox" checked={rotation==="fixed"} id="fixed" name="fixed" value="fixed" onChange={() => setRotation("fixed")}></input>
<label htmlFor="fixed"> Fixed </label>