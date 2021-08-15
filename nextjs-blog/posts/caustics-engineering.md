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

# Snell's Law

# Finding the Heightmap

# Alternative Approaches

It does not work well to embed a grid of small lenses onto the surface, where each micro lens constitutes something like a pixel. Such an approach could make individual points in the image brighter or darker, something akin to pointilism, but it would not distribute light globally over the image correctly. It would be unable to form an image with large bright or dark areas. You could try angling the micro lenses to redirect light to different parts of the image, but [the results are not so great](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.410.8628&rep=rep1&type=pdf). Machining such an object, akin to a [Fresnel lens](https://en.wikipedia.org/wiki/Fresnel_lens), is a nightmare.


# My Code

Source code is available [here](https://github.com/MattFerraro/causticsEngineering). I am very new to programming in Julia so if you have suggestions for how to improve this code, in terms of correctness or speed or clarity, please give me a shout or make a pull request!

# Licensing

I want as many people as possible to have access to this technique. Please feel free to use this code for anything you want, free from any restrictions whatsoever. I only ask that if you make something, please show me!

# Contact me

If you use my code to make your own magic windows, I'd love to see them! I'm on Twitter at [@mferraro89](https://twitter.com/mferraro89)
