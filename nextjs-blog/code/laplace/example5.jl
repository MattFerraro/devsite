# Same as example 4, but with a hot left edge instead of right edge.
# Also we loop through different overcorrection values to help find an optimum

function step!(f::Matrix{Float64}, threshold, overcorrection)
    # Create a new matrix for our return value
    height, width = size(f)
    
    converged = true
    # For every cell in the matrix
    for x = 1:width
        for y = 1:height
            if x != 1 && x != width && y != 1 && y != height
                # For interior cells, replace with average
                old_val = f[y, x]
                new_val = (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1]) / 4.0
                diff = new_val - old_val

                # Fast! 0.84 seconds
                f[y, x] = old_val + diff * overcorrection
                # Slooooow  8.4 seconds
                # f[y, x] = old_val + diff * over_c

                if abs(diff) > threshold
                    converged = false
                end
            end     
        end
    end
    return converged
end

# This controls the size of the matrix!
n = 100
f = zeros(n, n)
f[1:n, 1] .= 1.0

finished = false

coeffs = [1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.91, 1.92, 1.93, 1.94, 1.95, 1.96, 1.97, 1.98, 1.99, 1.995, 1.996, 1.997, 1.998, 1.999]

for coeff in coeffs
    f = zeros(n, n)
    f[1:n, 1] .= 1.0

    for step_number = 1:30000
        global finished = step!(f, 1e-10, coeff)
        if finished
            println("Finished on step ", step_number)
            break
        end
    end
end