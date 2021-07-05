# Now with overcorrection

# Side note: don't use this global value! use the local one instead!
over_c = 1.0

function step!(f::Matrix{Float64}, threshold)
    # Side note: use this local one! It is 10x faster on my computer
    overcorrection = 1.91

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
f[1:n, n] .= 1.0

finished = false

for step_number = 1:30000
    if step_number % 1000 == 0
        println(step_number)
    end
    global finished = step!(f, 1e-10)
    if finished
        println("Finished on step ", step_number)
        break
    end
end
