using Images
# Update the matrix values in place instead of creating a new copy with every step


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


######################## Poisson's Eqn Stuff #########################


function step!(f::Matrix{Float64}, h::Matrix{Float64}, threshold::Float64)
    # Create a new matrix for our return value
    height, width = size(f)
    
    converged = true
    # For every cell in the matrix
    for x = 1:width
        for y = 1:height
            if x != 1 && x != width && y != 1 && y != height
                # For interior cells, replace with average
                # old_val = f[y, x]
                # avg = (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1]) / 4.0
                # f[y, x] = avg + h[y, x]/4.0
                # diff = abs(old_val - f[y, x])

                # avg = (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1]) / 4.0
                # f[y, x] = avg

                # avg = (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1]) / 4.0
                # f[y, x] = avg + h[y, x]/4.0

                # THIS VERSION WORKS!
                delta = 1.94 * (f[y-1, x] + f[y+1, x] + f[y, x-1] + f[y, x+1] - 4 * f[y, x] + h[y, x]) / 4.0
                f[y, x] += delta
                diff = abs(delta)
                if diff > threshold
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
# f[1:n, n] .= 1.0
# f[1:n, 1] .= 1.0
# f[1, 1:n] .= 1.0
# f[n, 1:n] .= 1.0
h = zeros(n, n)
# h[floor(Int, n/2), floor(Int, n/2)] = 1.0
# h[30:70, 10] .= 1.0 / 8
# h[30:70, 10] .= 1.0 / 8

# h[40, 40:50] .= 1/3
# h[80, 40:50] .= 1/3
# h[60, 50:60] .= -1/3
# h[20, 50:60] .= -1/3

# h[50, 60] = -1
h[50, 40] = 1

finished = false

for step_number = 1:30000
    if step_number % 1000 == 0
        println(step_number)
    end
    global finished = step!(f, h, 1e-10)
    if finished
        println("Finished on step ", step_number)
        break
    end
end

saveObj(matrix2Mesh(f), "relaxed.obj", scale_z=30)
println(maximum(f))
println(minimum(f))

# clamp!(f, 0.0, 1.0)
# save("relaxed.png", colorview(Gray, f))


# function oversample(f, factor)
#     height, width = size(f) .* factor
#     oversampled_f = zeros(height, width)
#     for x = 1:height
#         for y = 1:width
#             new_y = floor(Int, (y-1) / factor + 1)
#             new_x = floor(Int, (x-1) / factor + 1)
#             # println("$(y), $(x) --> $(new_y), $(new_x)")
#             oversampled_f[y, x] = f[new_y, new_x]
#         end
#     end

#     return oversampled_f
# end

# oversampled = oversample(f, 4)
# save("relaxed_bigger.png", colorview(Gray, oversampled))
