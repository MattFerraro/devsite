using Images
# Output the matrix as an image


########################## Mesh Utilities ######################
struct Vector3
    x::Float64
    y::Float64
    z::Float64
end

struct Vector2
    x::Float64
    y::Float64
end

struct MeshTriangle
    a::Int64
    b::Int64
    c::Int64
end

struct Mesh
    nodes::Vector{Vector3}
    triangles::Vector{MeshTriangle}
    width::Int
    height::Int
end

function matrix2Mesh(m::Matrix)
    height, width = size(m)
    nodeList = Vector{Vector3}(undef, height * width)
    count = 1
    
    for y = 1:height
        for x = 1:width
            newPoint = Vector3(x, y, m[y, x])
            nodeList[count] = newPoint
            count += 1
        end
    end

    triangles = Vector{MeshTriangle}(undef, (width - 1) * (height - 1) * 2)
    count = 1
    for y = 1:height - 1
        for x = 1:width - 1
            # here x and y establish the column of squares we're in
            index_ul = (y - 1) * width + x
            index_ur = index_ul + 1

            index_ll = y * width + x
            index_lr = index_ll + 1

            triangles[count] = MeshTriangle(index_ul, index_ur, index_ll)
            count += 1
            triangles[count] = MeshTriangle(index_lr, index_ll, index_ur)
            count += 1
        end
    end

    # Implicit return of the mesh without needing the "return" keyword
    newMesh = Mesh(nodeList, triangles, width, height)
end

function saveObj(mesh::Mesh, filename::String; scale_x=1.0, scale_y=1.0, scale_z=1.0)
    # This function saves the mesh object in obj format
    open(filename, "w") do io
        for vertex in mesh.nodes
            println(io, "v ", vertex.x * scale_x, " ", vertex.y * scale_y, " ", vertex.z * scale_z)
        end

        for face in mesh.triangles
            println(io, "f ", face.a, " ", face.b, " ", face.c)
        end

        println(io, "dims ", mesh.width, " ", mesh.height)
    end
end

########################### Laplace Stuff ########################

function step!(f::Matrix{Float64}, threshold)
    overcorrection = 1.94

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

function relax!(f)
    finished = false
    for step_number = 1:30000
        
        if step_number % 1000 == 0
            println(step_number)
        end
        
        finished = step!(f, 1e-10)
        
        if finished
            println("Finished on step ", step_number)
            break
        end
    end
    return f
end


function oversample(f, factor)
    height, width = size(f) .* factor
    oversampled_f = zeros(height, width)
    for x = 1:height
        for y = 1:width
            new_y = floor(Int, (y-1) / factor + 1)
            new_x = floor(Int, (x-1) / factor + 1)
            # println("$(y), $(x) --> $(new_y), $(new_x)")
            oversampled_f[y, x] = f[new_y, new_x]
        end
    end

    return oversampled_f
end


n = 100

# Hot on the right
f = zeros(n, n)
f[1:n, n] .= 1.0 # right
f = relax!(f)
f_right = f
saveObj(matrix2Mesh(f), "example6.obj", scale_z=30)
# oversampled = oversample(f, 5)
# save("hot_right.png", colorview(Gray, f))


# # Hot on the left
# f = zeros(n, n)
# f[1:n, 1] .= 1.0 # left
# f = relax!(f)
# f_right = f
# save("hot_left.png", colorview(Gray, f))


# f = zeros(n, n)
# f[1:n, 1] .= 1.0 # left
# f[1:n, n] .= 1.0 # right
# f = relax!(f)
# f_right = f
# save("hot_right_and_left.png", colorview(Gray, f))


# Hot on the right
# f = zeros(n, n)
# f[1:n, n] .= 1.0 # right
# f[45:55, n] .= 0.0
# f = relax!(f)
# f_right = f
# save("hot_right_2.png", colorview(Gray, f))


# # Hot on the bottom
# f = zeros(n, n)
# f[n, 1:n-1] .= 1.0  # bottom
# f = relax!(f)
# f_bottom = f
# save("hot_bottom.png", colorview(Gray, f))


# # Hot on the right AND bottom
# f = zeros(n, n)
# f[1:n, n] .= 1.0 # right
# f[n, 1:n] .= 1.0  # bottom
# f = relax!(f)
# f_right_bottom = f
# save("hot_right_and_bottom.png", colorview(Gray, f))



# f_composite = (f_right + f_bottom)
# save("composite.png", colorview(Gray, f_composite))

# diff = f_composite - f_right_bottom
# println(maximum(diff), minimum(diff))


# # Hot on top and bottom
# f = zeros(n, n)
# f[n, 1:n] .= 1.0  # bottom
# f[1, 1:n] .= 1.0  # top
# f = relax!(f)
# save("hot_top_bottom.png", colorview(Gray, f))

# Some hot patches
# f = zeros(n, n)
# f[20:30, n] .= 1.0  # patch on right
# f[1, 70:85] .= 1.0  # top
# f[1, 50:60] .= 1.0  # top
# f[n, 70:70] .= 1.0  # top
# f = relax!(f)
# save("patches.png", colorview(Gray, f))

data = f
heatmap(1:size(data,1), 1:size(data,2), data, c=cgrad([:blue, :cyan , :yellow, :red]))
