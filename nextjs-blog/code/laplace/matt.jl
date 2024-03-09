function step(f::Matrix{Float64})
    # Create a new matrix for our return value
    height, width = size(f)
    new_f = zeros(height, width)
    
    # For every cell in the matrix
    for x = 1:width
        for y = 1:height
            if (x == 1 || x == width
               || y == 1 || y == height)
                # If we're on the edge,
                # just copy over the value
                new_f[y, x] = f[y, x]
            else
                # For interior cells,
                # replace with the average
                new_f[y, x] = (
                    f[y-1, x] + f[y+1, x] +
                    f[y, x-1] + f[y, x+1]) / 4.0
            end     
        end
    end
    return new_f
end

f = zeros(6, 6)
f[1:6, 6] .= 1.0  # Set the right side to ones
display(f)

for step_number = 1:3
    println("\n")
    global f = step(f)
    display(f)
end