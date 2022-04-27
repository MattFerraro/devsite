
const width = 614
const height = 400
const PI = 3.1415926


export function newProblem(w, h) {
  const container = []
  for (let i = 0; i < h; i++) {
    container.push(new Float32Array(w))
  }
  return container
}

export function poissonSolveDirichlet(phi, left, right, top, bottom, H, epsilon = .001, overcorrection = 1.86) {
  const w = phi[0].length
  const h = phi.length

  let iterations = 0
  while (true) {
    let maxDiff = 0
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y == 0) {
          phi[y][x] = top
        } else if (y == h-1) {
          phi[y][x] = bottom
        } else if (x == 0) {
          phi[y][x] = left
        } else if (x == w-1) {
          phi[y][x] = right
        } else {
          const del = (phi[y-1][x] + phi[y+1][x] + phi[y][x-1] + phi[y][x+1] - 4 * phi[y][x] + H[y][x]) / 4.0
          phi[y][x] += del * overcorrection
          
          const diff = Math.abs(del)       

          if (diff > maxDiff) {
            maxDiff = diff
          }
        }
      }
    }
    
    iterations += 1

    if (maxDiff < epsilon) {
      break
    }
  }

  return iterations

}