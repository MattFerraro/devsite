---
title: "Magic Windows"
teaser: "IDK yet"
teaserImage: 'https://www.mattferraro.dev/images/laplace/separatrix_heightmap.png'
date: '2021-08-14'
---

I recently made a physical object that defies all intuition. It's a square of acrylic, smooth on both sides, totally transparent. A small window.

![Clear Acrylic](/images/caustics/clear_acrylic.jpg)

But it has the magic property that if you shine a flashlight on it, it projects an image:

![2D Image of Cat](/images/caustics/2D_image.jpg)

And if you take it out in the sun, it produces this 3D hologram:

[![Hologram Preview](https://i.imgur.com/nVz7ZF0.png)](https://www.youtube.com/watch?v=7tO8SiZAOvY)

This post describes the math that went into making the object, and how you can create your own.

# But first: How is this even possible?

Let's focus on the 2D image before talking about the hologram.

The physical phenomenon we're looking at is called a *caustic*.

![Example Caustic](https://courses.cs.ut.ee/MTAT.03.015/2017_fall/uploads/Main/glass.jpg)

Caustics are the bright patches of light we see when illuminating a transparent object. All the photons which _don't_ pass through the object are what form the object's shadow. All those photons have to go somewhere; they contribute to the caustic pattern.

<!-- Light bouncing around, reflecting and refracting and dispersing, sometimes even back in the direction of the light source, is what gives a diamond it's brilliance. -->

The most interesting aspect of caustics is that they arise from even the tiniest of variations in surface flatness. Even the gentlest waves on the surface of a pool form powerful lenses that cast intense caustics on the floor below.

<!-- ![Water Caustics](https://upload.wikimedia.org/wikipedia/commons/e/ea/Great_Barracuda%2C_corals%2C_sea_urchin_and_Caustic_%28optics%29_in_Kona%2C_Hawaii_2009.jpg) -->
![Water Caustics](https://courses.cs.ut.ee/MTAT.03.015/2017_fall/uploads/Main/pattern.jpg)

The reason my acrylic square can project an image is because I've embedded just the right amount of concavity and convexity into the surface so that the refracted light forms a caustic image.

To gain some intuition for how it is done, consider a traditional convex lens:

![Parabolic Lens](https://static.wixstatic.com/media/484e6e_d974eb7c1c8e4b0ea914f971873ea866.gif)

This lens forms the simplest possible caustic. It focuses *all* of its incoming light into a single point. The caustic image from this lens is dark everywhere with one very bright spot in the center.

Zooming in on one small section of the lens we notice a few properties:
1. The thickness of the lens does not have a direct impact on the outgoing ray angle. We could add material to the left side of this lens and nothing would change.
2. The angle formed between the incoming light rays and the glass has a strong effect on the refracted ray angle
3. Whether two rays converge or diverge is controlled by how *curved* the lens is where the rays meet the glass

In other words, the thickness of the glass $t(x)$ is not on its own important. But the slope of the glass, $\frac{\mathrm{d}t}{\mathrm{d}x}$, gives us the outgoing ray angle via Snell's law. Where rays converge the image is brighter than the light source. Where rays diverge the image is darker. Therefore the brightness of the image (at that point, where the rays fall) is controlled by $\frac{\mathrm{d}^2t}{\mathrm{d}x^2}$.

The thickness of my acrylic slab varies across the entire $xy$ plane. I could call this $t(x,y)$ but I hate using $t$ to mean anything other than *time*, so I'll use $h(x,y)$ and we'll think of it as a *heightmap* instead of a *thickness* map.

By controlling $\frac{\partial h}{\partial x}$, $\frac{\partial h}{\partial y}$, $\frac{\partial ^2 h}{\partial x^2}$, and $\frac{\partial ^2 h}{\partial y^2}$, we can steer all of our incoming light to the correct locations in the image, while contributing the right brightness to make it recognizable. By making some simplifying assumptions we can guarantee that the resulting heightmap will be smooth and continuous.

For the cat image shown above, the total height variation over the 10cm x 10cm surface is about 1.5mm.

![Slight Refraction](/images/caustics/slight_refraction.jpg)

Notice how the slight variations in surface height distort the straight line of the floor molding.

# Formulating the Problem

We want to find a heightmap $h(x,y)$ whose caustic image has brightness $b(u,v)$, equal to some input image. To achieve this we can imagine a grid of cells, akin to pixels, on the surface of the acrylic lens. Here each "pixel" on the lens corresponds to a pixel in the image and both grids are square and perfectly aligned. Image pixels and their corresponding lens-space "pixels" are labeled with shared $(i, j)$ coordinates. Remember that $(i, j)$ are integers labeling the column and row of the pixel, whereas $(x, y)$ and $(u, v)$ are real numbers measured in something like meters or inches.

[Add a diagram here]

# Steps to a Solution

**Step 1:** We morph the cells on the lens, making them bigger or smaller, so that the area of lens cell $(i, j)$ is proportional to the brightness of image cell $(i, j)$. The resulting lens grid is no longer square--lots of warping and skew have to be introduced to maintain continuity. This step is by far the hardest part and must be solved iteratively.

**Step 2:** For each cell $(i, j)$ we need to find the angle from the lens cell to image cell and use Snell's law to find the required surface normal. This step is straightforward geometry.

**Step 3:** Integrate all the surface normals to find a continuous heightmap $h(x,y)$. We're back to iterative methods here, but if we apply certain contraints to how we solve step 1, this step is actually fast and easy.

# Morphing the Cells

For an image with $n \times n$ pixels, the lens grid will need $(n+1) \times (n+1)$ points, so that each cell in the lens grid is defined by four points. Technically we should adopt yet another coordinate system to label the _points_ in the lens grid since they are distinct from the _cells_ in the lens grid, but I think it's easier to just reuse $(i, j)$ and we can say that for grid cell $(i, j)$, the point in the upper left is defined as grid point $(i, j)$. This leaves us with one row and one column of extra grid points along the bottom and right edges, but that will be trivial to deal with when it comes up.

Each _point_ in the lens grid $p(i,j)$ has an $(x, y)$ coordinate. A point's $(i, j)$ coordinates never change but the $(x, y)$ coordinates will change as we morph the cells more and more.

### Computing the Loss

Given the $(x, y)$ locations of all the lens grid points, simple geometry lets us calculate the area of each lens grid cell. Of course at first every cell has the same area, but that will change as soon as we start morphing things.

The condition we're hoping for is that every lens grid cell $(i, j)$ has an area which is proportional to the brightness of image pixel $(i, j)$. We can compute a "loss image" by subtracting the area of each grid cell from the brightness of each pixel.

We start by taking a normal image, in this case 500x500 pixels, and we convert it to black and white to find brightness, which ranges from 0-255:

[original image --> B&W]

Then we set up the physical parameters of our magic window by choosing a width and height. Here I use 10cm x 10cm.

```julia
w = .1
h = .1

```

Now for each cell we just look at the brightness we want and subtract the area that we have. The output is a "loss image".

[regular loss image]

But we've been sloppy and mixed units of area with units of pixel brightness so the resulting image is difficult to interpret. We can fix that by normalizing the loss image to range from -1 to 1.

[normalized, colorized loss image]

Red areas indicate regions where our image is too bright and blue areas are where the image is too dark.

### Stepping to Reduce Loss

The loss image (or any image) can be thought of as a scalar field $L(x, y)$. The gradient of a scalar field yields a vector field, which we could call $\nabla L(x,y)$. We can step each grid point slowly in the direction of the gradient field, and in doing so the cells that are too small will get bigger and the cells that are too big will get smaller. Our loss will shrink, and we'll create our image.

But in practice this doesn't work at all! The loss image is not smooth at all, in fact it is exactly as patchy and discontinuous as our input image. This means that in regions of high contrast, two neighboring cells will need to step in drastically different directions. This creates a situation where improving one cell's loss will necessarily worsen its neighbor's losses, which means that in practice this method can never converge. It's a dead end.

Instead let's draw an analogy to Computational Fluid Dynamics. We need to dilate certain cells and shrink others according to a per-cell brightness function. This is similar to modeling compressible air flow where each cell has a per-cell pressure function. If every cell in a 2D grid has some initial pressure, how does the system relax over time? The regions with high pressure expand and the regions of low pressure contract, with regions of middling pressure getting shoved around in a sort of global tug-of-war.

So, how is this problem solved in CFD simulations? The standard approach is to define a **Velocity Potential** called $\Phi$ (read: *phi*). If you've ever seen the Gravitational Potential used to simulate orbits, or the Electric Potential to simulate the paths of charged particles, know that we're dealing with a similar object here.

The Velocity Potential $\Phi$ is a scalar field defined at each cell, so we might write it as $\Phi(i, j)$. Its units are $meters^2 / second$ which at first glance is not very easy to interpret. But the reason $\Phi$ is convenient is that its spatial derivatives are measured in $meters/second$. In other words, the gradient of $\Phi$ gives a vector whose units are velocity:

$$
\tag{1.0}
\nabla \Phi = \vec{v}
$$

[Example phi with example velocity field]

So if we can find a $\Phi$ that describes our pressure distribution, all we need to do is calculate $\vec{v} = \nabla \Phi$ and we'll be able to step all of our points according to $\vec{v}$ to decrease our loss.

So how do we find a suitable $\Phi$? Well, the property we already know about each cell is its normalized loss, which encodes how much that cell needs to grow or shrink. This property, how much a cell grows or shrinks over time as it moves with a velocity field, is called the **divergence** of that field. Divergence is written as $\nabla \cdot$ so in our case, we know that we need to find a velocity fields whose divergence equals the loss:

$$
\tag{1.1}
\nabla \cdot \vec{v} = L(x, y)
$$

<!-- Remember that $L$ is the loss field we've already calculated, and $\vec{v}$ is some unknown velocity field. $\vec{v}$ is the thing we want to solve for. -->

We don't yet know the velocity field $\vec{v}$, we just know that whatever $\vec{v}$ is, its divergence equals the loss field calculated above.

Unfortunately we cannot easily invert this equation to find $\vec{v}$ directly. But we can plug equation $(1.0)$ in to equation $(1.1)$ to yield:

$$
\tag{1.2}
\nabla \cdot \nabla \Phi = L(x, y)
$$

Which we read as *The divergence of the gradient of the potential field $\Phi$ equals the loss*.

This equation comes up surprisingly frequently in many branches of physics and math. It is usually written in a more convenient shorthand:

$$
\tag{1.3}
\nabla ^2 \Phi = L
$$

Which you may recognize as [Poisson's Equation](https://mattferraro.dev/posts/poissons-equation)!

This is fantastic news because Poisson's equation is [extremely straightforward](https://mattferraro.dev/posts/poissons-equation#how-do-i-solve-it) to solve! If you aren't familiar with it, just think of this step like inverting a big matrix, or numerically integrating an ODE, or finding the square root of a real number. It's an intricate, tedious task that would be painful to do with a paper and pencil, but it's the kind of thing computers are *really* good at.

Now that we've written down the problem as Poisson's Equation, it is as good as solved. We can use any off the shelf solver, plug in our known $L(x, y)$ and out pops $\Phi(x,y)$ as if by magic.

[Image of cat Phi]

This is an example of [Neumann boundary conditions](https://mattferraro.dev/posts/poissons-equation#neumann-boundary-conditions) where $\nabla \Phi = 0$ along the edges because we can't have any grid cells flying off the edges of the acrylic!

<!-- TODO: copy paste my earlier description of the Gradient -->

We plug $\Phi$ in to Equation $(1.0)$ to find $\vec{v}$ and we take a look at the vector field:

[Image of the cat vector field]

This vector field is everywhere smooth and continuous. We simply march the grid points along this vector field and we'll get exactly what we need: The cells which need to grow will grow because the local vector field has positive divergence. The cells which need to shrink will shrink because the local vector field has negative divergence. Cells which are already the right size will migrate and distort but their areas will not change because the local vector field has zero divergence.

We step all the lens grid points forward some small amount in the direction of $\vec{v}$, dilating bright parts of the image and shrinking dark parts. After morphing the grid a tiny amount we recompute the loss function $L$, find a new $\Phi$ and new $\vec{v}$, and take another small step.

```julia
image = read_image("cat.png")
gray = convert_to_grayscale(image)
grid = create_initial_grid(gray.size + 1)

L = compute_loss(gray, grid)

while maximum(L) > 0.01:
    ϕ = poisson_solver(L, "neumann", 0)
    v = compute_gradient(ϕ)
    grid = step_grid(grid, v)
    L = compute_loss(gray, grid)
```

After three or four iterations the loss gets very small and we've got our morphed cells!

[image of morphed cells]

Again, this morphed grid has the special property that every cell in this grid has an area proportional to the brightness of the desired image.

# Snell's Law and Normal Vectors

Snell's law tells us how light bends when passing from one material to another. 

![Snell's Law](https://uploads-cdn.omnicalculator.com/images/snells-law2.png)

$$
\tag{1.4}
\frac{\sin(\theta_2)}{\sin(\theta_1)} = \frac{n_1}{n_2}
$$

Where $n_1 = 1.49$ is the [Refractive Index](https://en.wikipedia.org/wiki/Refractive_index) of acrylic and $n_2 = 1$ is the refractive index of air.

Snell's law is not some arbitrary axiom of physics. It is a direct consequence of Fermat's [Principle of Least Time](https://en.wikipedia.org/wiki/Fermat%27s_principle), which is a fascinating and critical link between wave optics and ray optics.

In our case, each lens cell $(i, j)$ has migrated to position $(x, y)$, and it needs to send its light to the image plane at $(u, v)$.

There is some distance between the lens and the image which we can label $d$. Using a little trigonometry we can find the angle between $(x, y)$ and $(u, v)$ which we can call $\theta_2$:

[diagram of this trig]

$$
\tag{1.5}
\theta_2 = {\tan}^{-1} \left( \frac{\sqrt{(u - x)^2 + (v - y)^2}}{d} \right)
$$

Plugging $\theta_2$ into $(1.4)$ gives us $\theta_1$. The incoming light rays are assumed to be horizontal and parallel, so $\theta_1$ gives us the angle of the surface normal.

Now we can define a 3D normal vector $\vec{N}(x, y)$ which everywhere points normal to our heightmap. If we normalize $\vec{N}$ so that the its z coordinate is $-1$, we can write it:

$$
\tag{1.6}
\vec{N} = (\frac{\partial{h}}{\partial{x}}, \frac{\partial{h}}{\partial{y}}, -1)
$$

If you consider just the $x$ and $y$ components, we recognize that

$$
\tag{1.7}
\vec{N}_{xy} = \nabla h
$$

Which is a property often used in computer graphics applications, as well as geospatial applications involving [Digital Elevation Models](https://en.wikipedia.org/wiki/Digital_elevation_model).

<!-- TODO: Actually derive this! -->

After some tedious geometry and a small angle approximation, we find the $x$ and $y$ components of the normal vector $\vec{N}$:

$$
\tag{1.8}
N_x(i, j) = \tan \frac{\tan^{-1} \left( \frac{u - x} {d} \right)} {(n_1 - n_2)}
$$
$$
\tag{1.9}
N_y(i, j) = \tan \frac{\tan^{-1} \left( \frac{v - y} {d} \right)} {(n_1 - n_2)}
$$

# Finding the Heightmap

At this point we have our morphed grid cells and we've found all our surface normals. All we have to do is find a heightmap $h(x,y)$ that has the required surface normals.

We could try to integrate the normals manually, starting at one corner and working our way down the grid, but this method causes small errors to stack up quickly and can't be performed stably.

A much better approach is to reach back to equation $(1.7)$, repeated here:

$$
\tag{1.7}
\vec{N}_{xy} = \nabla h
$$

And to take the divergence of both sides:

$$
\tag{1.10}
\nabla \cdot \vec{N}_{xy} = \nabla \cdot \nabla h
$$

Adopting shorthand and swapping sides:
$$
\tag{1.11}
\nabla ^2 h = \nabla \cdot \vec{N}_{xy}
$$

We arrive at yet another instance of Poisson's Equation! We found $\vec{N}_{xy}$ in the previous section, and calculating the divergence of a known vector field is easy:

$$
\tag{1.12}
\nabla \cdot \vec{N}_{xy} = \left( \frac{\partial}{\partial{x}}, \frac{\partial}{\partial{y}} \right) \cdot (\vec{N}_x, \vec{N}_y) = \frac{\partial{\vec{N}_x}}{\partial{x}} + \frac{\partial{\vec{N}_y}}{\partial{y}}
$$

In code it looks like:

```julia
δx = (Nx[i+1, j] - Nx[i, j])
δy = (Ny[i, j+1] - Ny[i, j])
divergence[i, j] = δx + δy
```

All that's left is to plug our known $\nabla \cdot \vec{N}_{xy}$ in to a Poisson solver with Neumann boundary conditions and out pops $h(x, y)$, ready to use!

[example h field]

Well, that's not quite accurate. By modifying the height of each point we've actually changed the distance from each lens point to the image, so the lens-image distance is no longer a constant $d$ it is actually a function $D(x,y)$. With our heightmap in hand we can easily calculate:

$$
\tag{1.13}
D(x,y) = d - h(x,y)
$$

And repeat the process by calculating new normals using $D(x,y)$ instead of $d$, which lets us create a new heightmap. We can loop this process and measure changes to ensure convergence, but in practice just 2 or 3 iterations is all you need.

# Finishing Touches

At this stage we have a heightmap, not a solid 3D object.

# Alternative Approaches

It does not work well to embed a grid of small lenses onto the surface, where each micro lens constitutes something like a pixel. Such an approach could make individual points in the image brighter or darker, something akin to pointilism, but it would not distribute light globally over the image correctly. It would be unable to form an image with large bright or dark areas. You could try angling the micro lenses to redirect light to different parts of the image, but [the results are not so great](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.410.8628&rep=rep1&type=pdf). Machining such an object, akin to a [Fresnel lens](https://en.wikipedia.org/wiki/Fresnel_lens), is a nightmare.


# My Code

Source code is available [here](https://github.com/MattFerraro/causticsEngineering). I am very new to programming in Julia so if you have suggestions for how to improve this code, in terms of correctness or speed or clarity, please give me a shout or make a pull request!

# Licensing

I want as many people as possible to have access to this technique. Please feel free to use this code for anything you want, free from any restrictions whatsoever. I only ask that if you make something, please show me!

# Contact me

If you use my code to make your own magic windows, I'd love to see them! I'm on Twitter at [@mferraro89](https://twitter.com/mferraro89)
