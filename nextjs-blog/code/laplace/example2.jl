# Demonstrate running to convergence

function step(f::Matrix{Float64}, threshold)
    # Create a new matrix for our return value
    height, width = size(f)
    f2 = zeros(height, width)
    
    converged = true
    # For every cell in the matrix
    for x = 1:width
        for y = 1:height
            if x == 1 || x == width || y == 1 || y == height
                # If we're on the edge, just copy over the value
                f2[y, x] = f[y, x]
            else
                # For interior cells, replace with average
                old_val = f[y, x]
                new_val = (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1]) / 4.0
                f2[y, x] = new_val
                diff = abs(old_val - new_val)
                if diff > threshold
                    converged = false
                end
            end     
        end
    end
    return f2, converged
end

# This controls the size of the matrix!
n = 100
f = zeros(n, n)
f[1:n, n] .= 1.0

finished = false

for step_number = 1:30000

    if step_number % 1000 == 0
        println(step_number)
    end
    global f, finished = step(f, 1e-10)
    if finished
        println("Finished on step ", step_number)
        break
    end
end
