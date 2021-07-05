# Demonstrate stepping towards Laplace's Equation

function step(f::Matrix{Float64})
    # Create a new matrix for our return value
    height, width = size(f)
    f2 = zeros(height, width)
    
    # For every cell in the matrix
    for x = 1:width
        for y = 1:height
            if x == 1 || x == width || y == 1 || y == height
                # If we're on the edge, just copy over the value
                f2[y, x] = f[y, x]
            else
                # For interior cells, replace with average
                f2[y, x] = (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1]) / 4.0
            end     
        end
    end
    return f2
end

f = zeros(6, 6)
f[1:6, 6] .= 1.0
display(f)

for step_number = 1:3
    println("\n")
    global f = step(f)
    display(f)
end