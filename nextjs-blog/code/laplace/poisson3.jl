using Images
using Plots
gr()
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


function step!(f::Matrix{Float64}, h::Matrix{Float64}, threshold::Float64, boundary_type::String)
    # Create a new matrix for our return value
    height, width = size(f)
    
    converged = true
    # For every cell in the matrix
    for x = 1:width
        for y = 1:height
            # These are the indexes that we pull from for the inner cells
            y_up = y - 1
            y_down = y + 1
            x_left = x - 1
            x_right = x + 1

            if boundary_type == "dirichlet"
                if x == 1 || x == width || y == 1 || y == height
                    # On the edges we simply do nothing at all
                    continue
                end
            elseif boundary_type == "neumann"
                # Handle reflection across the boundary if we're on it
                if x == 1; x_left = x + 1 end
                if x == width; x_right = x - 1 end
                if y == 1; y_up = y + 1 end
                if y == height; y_down = y - 1 end
            end
            
            delta = 1.94 * (f[y_up, x] + f[y_down, x] + f[y, x_left] + f[y, x_right] - 4 * f[y, x] + h[y, x]) / 4.0
            f[y, x] += delta
            diff = abs(delta)
            if diff > threshold
                converged = false
            end

        end
    end
    return converged
end

function solve!(f::Matrix{Float64}, h::Matrix{Float64}, boundary_type::String)
    finished = false
    threshold = 1e-10

    for step_number = 1:30000
        if step_number % 1000 == 0
            println(step_number)
        end
        finished = step!(f, h, threshold, boundary_type)
        if finished
            println("Finished on step ", step_number)
            break
        end
    end
end

function plotAsHeat(g)
    display(heatmap(1:size(g,1), 1:size(g,2), g, c=cgrad([:blue, :cyan , :yellow, :red]), aspect_ratio=:equal))
    readline()
end

function plotAsQuiver(g; stride=4, scale=300, max_length=2)
    # stride = 4
    # scale = 300
    # max_length = 2
    h, w = size(g)
    xs = Float64[]
    ys = Float64[]
    us = Float64[]
    vs = Float64[]
    for x = 1:stride:w
        for y = 1:stride: h
            push!(xs, x)
            push!(ys, y)
            p1 = g[y, x]
            u = (g[y, x+1] - g[y, x]) * scale
            v = (g[y+1, x] - g[y, x]) * scale
            if u >= 0
                push!(us, min(u, max_length))
            else
                push!(us, max(u, -max_length))
            end

            if v >= 0
                push!(vs, min(v, max_length))
            else
                push!(vs, max(v, -max_length))
            end
        end
    end
    q = quiver(xs, ys, quiver=(us, vs),aspect_ratio=:equal)
    display(q)
    # readline()
end

function main()
    # First just make a linear gradient. Hot on the right
    n = 100
    f_linear = zeros(n, n)
    f_linear[:,1] .= 0
    f_linear[:, n] .= 1
    for x = 1:n
        f_linear[1, x] = x/n
        f_linear[n, x] = x/n
    end
    solve!(f_linear, zeros(n, n), "dirichlet")
    # plotAsQuiver(f_linear)

    # Next make a point source, hot on the left
    f_hot_left = zeros(n, n)
    h_hot_left = zeros(n, n)
    h_hot_left[50, 40] = -1
    solve!(f_hot_left, h_hot_left, "dirichlet")
    # plotAsQuiver(f_hot_left)

    # And make a point sink, cold on the right
    f_cold_right = zeros(n, n)
    h_cold_right = zeros(n, n)
    h_cold_right[50, 60] = 1
    solve!(f_cold_right, h_cold_right, "dirichlet")

    # Now sum them
    g = f_linear + f_hot_left + f_cold_right

    saveObj(matrix2Mesh(g), "combined.obj", scale_z=30)
    # plotAsHeat(g)

    # plotAsQuiver(f_linear)
    # plotAsQuiver(f_hot_left)
    # plotAsQuiver(f_cold_right)
    # plotAsQuiver(g)
    return f_linear, f_hot_left, f_cold_right, g
end

function main2()
    n = 100
    f_saddle = zeros(n, n)
    f_saddle[:, 1] .= 1
    f_saddle[:, n] .= 1
    solve!(f_saddle, zeros(n, n), "dirichlet")
    return f_saddle
end

f_linear, f_hot_left, f_cold_right, g = main()
# k = main2()