using Images

function main()
    # Set up the boundary conditions
    n = 6
    f = zeros(n, n)
    f[1:n, n] .= 1.0

    max_steps = 20000

    for step_n = 1:max_steps
        # Step the system one time step
        f, max_diff = step(f)
        
        if max_diff < 1e-10
            println("Convergence reached at step ", step_n)
            break
        end

        if step_n == max_steps
            println("Not converged. Max diff: ", max_diff)
        end
    end

    display(f)
    save("converged.png", colorview(Gray, f))
end

function step(f::Matrix{Float64})
    # Create a new matrix for our return value
    height, width = size(f)
    f2 = zeros(height, width)

    max_diff = 0
    
    # For every cell in the matrix
    for x = 1:width
        for y = 1:height
            if x == 1 || x == width || y == 1 || y == height
                # If we're on the edge, just copy over the value
                f2[y, x] = f[y, x]
            else
                # If we're in the center space, replace with average
                f2[y, x] = (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1]) / 4.0

                diff = abs(f2[y, x] - f[y, x])
                if diff > max_diff
                    max_diff = diff
                end
            end     
        end
    end
    return f2, max_diff
end


function main2(f)
    # Set up the boundary conditions
    max_steps = 20000

    for step_n = 1:max_steps
        # Step the system one time step
        max_diff = step_explicit_diff!(f)
        
        if max_diff < 1e-5
            println("Convergence reached at step ", step_n)
            break
        end

        if step_n == max_steps
            println("Not converged. Max diff: ", max_diff)
        end
    end

    return f
end

function step!(f)
    # Create a new matrix for our return value
    max_diff = 0
   
    height, width = size(f)

    # For every cell in the matrix
    for x = 1:width
        for y = 1:height
            if x == 1 || x == width || y == 1 || y == height
                # If we're on the edge, do nothing               
            else
                # If we're in the center space, replace with average
                old_val = f[y, x]
                new_val = (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1]) / 4.0
                f[y, x] = new_val

                diff = abs(old_val - new_val)
                if diff > max_diff
                    max_diff = diff
                end
            end     
        end
    end
    return max_diff
end

function step_explicit_diff!(f)
    # Create a new matrix for our return value
    max_diff = 0
   
    height, width = size(f)

    # For every cell in the matrix
    for x = 1:width
        for y = 1:height
            if x == 1 || x == width || y == 1 || y == height
                # If we're on the edge, do nothing               
            else
                # If we're in the center space, replace with average
                old_val = f[y, x]
                new_val = (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1]) / 4.0
                
                diff = new_val - old_val

                f[y, x] += diff * 1.0 #1.94 

                diff = abs(old_val - new_val)
                if diff > max_diff
                    max_diff = diff
                end
            end     
        end
    end
    return max_diff
end


# n = 100
# f = zeros(n, n)
# f[1:n, n] .= 1.0  # the right most edge
# # f[1:n, 1] .= 1.0  # the left most edge
# # f[1, 1:n] .= 1.0  # the top
# f[n, 1:n] .= 1.0  # the bottom
# final_f = main2(f)
# save("converged.png", colorview(Gray, final_f))

main()