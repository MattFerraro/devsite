---
title: 'What is the Inverse of a Vector?'
teaser: 'Vector algebra is extremely limited, but we can invent a much better approach'
teaserImage: 'https://openga.org/imgs/basis.svg'
date: '2021-08-19'
---

Doing algebra with vectors is impossibly frustrating.

In school we learn how to add two vectors and we can extend this to get vector subtraction, but we don't learn how to multiply and divide!

Sure, we learn about the dot product and the cross product but neither of these is invertible so neither can be extended to vector division.

If we had access to invertible vector multiplication then we would also have vector division! In fact we'd have a full-on vector algebra, just as expressive and flexible as scalar algebra!

Invertible vector multiplication does exist and we can derive it ourselves.

In this post we will re-invent a forgotten form of math that is far superior to the one you learned in school. The only tools you need are from high-school algebra.

# Table of Contents

# The Units of Magnitude

We're going to look at the things we're already familiar with and try to draw a pattern. We'll use this pattern to create some new objects.

The key insight comes from examining the units of the magnitude of scalars and vectors.

## Scalars

A **scalar** $s$ is a regular number like $-3$ or $1.618$ or $\frac{1}{137}$.

A scalar is a point on a number line. Its magnitude $\|s\|$ is just its absolute value. We can call this a 0-Vector or refer to it as "Grade 0" to indicate that its magnitude carries no units.

## Vectors
<!-- A scalar carries no intrinsic units and it does not correspond to any geometric object. It's just a bare value. -->

For the purposes of this post a **vector** $\vec{v}$ is an arrow in 3D space. It points from the origin to some other point in space and is usually written like this:

$$
\begin{align}
    \vec{v} &= \begin{bmatrix}
           v_{1} \\
           v_{2} \\
           v_{3}
         \end{bmatrix}
\end{align}
$$

Its magnitude $\|\vec{v}\|$ is equal to its length, so we'll call them 1-Vectors or say they are "Grade 1" because length is a 1-dimensional quantity.

That length is just:
$$
\|\vec{v}\| = \sqrt{v_1^2 + v_2^2 + v_3^2}
$$

## Bivectors

This suggests a pattern. If a scalar's magnitude is a 0-dimensional value that carries no units, and a vector's magnitude is a 1-dimensional value that carries units of length, can we invent a type of object whose magnitude is a 2-dimensional value that carries units of area?

Let's try!

If vectors are oriented chunks of length, then our new object is some sort of oriented chunk of area, some segment of a 2D plane that is floating in 3D space.

The most efficient way to define a plane is to use the normal vector $\vec{n}$ which is perpendicular to the plane. The direction of the normal vector tells us the orientation of the plane, and we can encode magnitude as the length of that normal vector.

![visual of a normal vector and a circle in the plane]

But...wait that definition isn't consistent with our goal. This object *does* describe an oriented plane and it does have a degree of freedom to represent scale, but it's still just a vector so its magnitude is length, not area. This won't work.

---

What else can we try?

One alternative way to describe a plane is to use _two_ vectors, $\vec{a}$ and $\vec{b}$. This requires specifying 6 values rather than just 3, so it is less efficient but who cares, we're inventing our own math here.

The plane that they both fall upon gives us an orientation. But how do we get an area?

We've already got two vectors so the simplest possible solution might be to complete the triangle:

![diagram of completed triangle]

Which has an area equal to:

$$
A_{triangle}=\frac{1}{2}\|\vec{a}\|\vec{b}\|\sin(\theta)
$$

Where $\theta$ is the angle between the vectors.

This works but we'll have to carry around an inconvenient factor of $\frac{1}{2}$.

On a lark, what if we borrow an idea from CAD software and try to *extrude* $\vec{a}$ in the direction of $\vec{b}$?

![Example Bivector](/images/ga/Exterior_calc_cross_product.svg)

<!-- If you aren't familiar with CAD software, just think of this like a noodle press that squishes dough through a hole to form a sheet for lasagna. $\vec{a}$ defines the length of the hole and $\vec{b}$ defines how long of a noodle to make. -->

The resulting shape is a parallelogram which covers an area:

$$
A_{parallelogram}=\|\vec{a}\|\|\vec{b}\|\sin(\theta)
$$

By choosing to extrude, we get to drop the extra factor of $\frac{1}{2}$, and we get a very hands-on, intuitive definition for what we're doing with our two vectors.

In fact, let's come up with a special new symbol that means *extrude*. We'll use $\wedge$ and pronounce it "extrude". We can write down our parallelogram as $\vec{a}\wedge\vec{b}$.


> The parallelogram $\vec{a}\wedge\vec{b}$ is defined by extruding the vector $\vec{a}$ in the direction of $\vec{b}$

So we've got our new object, a 2D parallelogram floating in 3D space. It takes two vectors to describe these things so let's call this object a **bivector**.

> The **bivector** $\vec{a}\wedge\vec{b}$ is defined by extruding the vector $\vec{a}$ in the direction of $\vec{b}$

If we double the length of one of the input vectors, the output bivector stays in the same plane, it just doubles in area:

![visual of doubling either one of the input vectors]

Already we have a tough choice to make. Consider the bivectors $2\vec{a}\wedge\vec{b}$ and $\vec{a}\wedge2\vec{b}$. These two objects are obviously not identical. But they share the same plane and they have the same magnitude. Should we say that they are equal or not equal?

When you're inventing your own algebra, you get to choose!

If we say they are equal we'll get an algebra that allows us to freely move coefficients around, which is a property we're used to from scalar algebra. So sure, let's define this as an axiom:

$$
2\vec{a}\wedge\vec{b} = \vec{a}\wedge2\vec{b}
$$

Because their orientations and magnitudes are both equal.

More generally, using any scalar $s$:

$$
s\vec{a}\wedge\vec{b} = \vec{a}\wedge s\vec{b} = s(\vec{a}\wedge\vec{b})
$$

This property is called *linearity* which just means that the output scales linearly with the inputs. This is desirable property when designing an algebra!

But it comes at a cost. $2\vec{a}\wedge\vec{b}$ and $\vec{a}\wedge2\vec{b}$ are visually distinct objects yet we say they are equal. 

The fact that we can write (and visualize) the same bivector multiple ways implies that even though we write down bivectors using 6 numbers, that there are really only 5 degrees of freedom in a bivector.

If you've heard of quaternions, they famously use 4 numbers to represent 3 degrees of rotation. Their redundancy makes them much more algebraicly useful but also harder to visualize.

Bivectors might be similar. We'll pay close attention to this.

<!-- That means that there are many ways of writing down bivectors which are all equal to each other. Our notation is redundant. -->

<!-- Redundancy isn't necessarily a bad thing: 3D Rotation matrices are often written as 3x3 arrays which look like they have 9 degrees of freedom (the 9 numbers are each one degree of freedom). But we know that 3D rotations can always be written as {roll, pitch, yaw} so there are only 3 actual DOF in a 3x3 rotation matrix. That redundancy makes it play much more nicely with other matrices. -->

But let's keep inspecting them first! What happens if we switch the input ordering? Does $\vec{a} \wedge \vec{b}$ equal $\vec{b} \wedge \vec{a}$?

![visual of a wedge b vs b wedge a]

Well, $\vec{a} \wedge \vec{b}$ forms a parallelogram counterclockwise but $\vec{b} \wedge \vec{a}$ forms a parallelogram clockwise. Again we get to choose if these should be considered equal.

Spin direction seems pretty important to me; these naturally feel like opposites rather than equals.

So we define our second axiom:

$$
\tag{1.0}
\vec{a} \wedge \vec{b} = -\vec{b} \wedge \vec{a}
$$

Note that we're not necessarily saying that clockwise spin = positive and counterclockwise = negative, we're just saying that whatever the two spin directions are, they're opposites.

What happens if you extrude a vector by itself?

![visuaal of a wedge a]

This parallelogram has zero area. So we can already write an identity!

$$
\tag{1.1}
\vec{a} \wedge \vec{a} = 0
$$

What happens if we form a bivector from two unit vectors like $\mathbf{\hat{x}}$ and ${\mathbf{\hat{y}}}$?

![visual of xhat wedge yhat]

The parallelogram they form happens to be a square with unit area! We can use this to form three distinct unit bivectors:

- $\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}$ also known as the xy plane
- $\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}$ also known as the yz plane
- $\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}$ also known as the zx plane

![visual of the three different unit bivectors]

These three unit bivectors are clearly orthogonal to each other in the sense that if you project the yz plane onto the xy plane, its shadow occupies zero area. This is true for any pair of these planes.

This gives bivectors an interesting commonality with regular vectors. Any vector can be written as the weighted sum of basis vectors:

$$
\vec{v} = v_1 \mathbf{\hat{x}} + v_2\mathbf{\hat{y}} + v_3\mathbf{\hat{z}}
$$

Where you find the coefficients $v_1$, $v_2$, $v_3$ by projecting $\vec{v}$ onto the unit vectors $\mathbf{\hat{x}}$, $\mathbf{\hat{y}}$, $\mathbf{\hat{z}}$.

Similarly, any bivector can be written as the weighted sum of basis bivectors:
$$
\vec{a} \wedge \vec{b} = c_1(\mathbf{\hat{x}} \wedge \mathbf{\hat{y}}) + c_2(\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}) + c_3(\mathbf{\hat{z}}\wedge\mathbf{\hat{x}})
$$

Where you find the coefficients $c_1$, $c_2$, $c_3$ by projecting the parallelogram $\vec{a} \wedge \vec{b}$ onto the unit bivectors $\mathbf{\hat{x}} \wedge \mathbf{\hat{y}}$, $\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}$, $\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}$.

So there we have it, a new type of object called a bivector which is an oriented chunk of area! Its magnitude carries units of area, so bivectors are considered 2-Vectors, or referred to as "Grade 2".

It is important to remember that bivectors have a certain redundancy built into them in the sense that $s\vec{a}\wedge\vec{b} = \vec{a}\wedge s\vec{b}$. We write them using 6 numbers, but they actually only have 5 degrees of freedom.

## Trivectors

Okay we have a handle on scalars, vectors, and bivectors. Is there an object which behaves like an oriented *volume*? Something we might call a **trivector**?

<!-- In the case of bivectors we used the $\wedge$ symbol to mean *take these two vectors and complete the parallelogram* but this is such a weird, specific operation. Instead, let's think of it as a process of extrusion.  -->
<!-- We can now see a little more clearly what the $\wedge$ symbol does. It extrudes! $\vec{a} \wedge \vec{b}$ means "extrude $\vec{a}$ along the path given by $\vec{b}$", which yields a parallelogram. $\vec{a} \wedge \vec{b} \wedge \vec{c}$ means "extrude the parallelogram $\vec{a} \wedge \vec{b}$ along the path given by $\vec{c}$, which yields a parallelopiped.  -->

For bivectors we made progress by extruding one vector in the direction given by a second vector, which yielded a 2D parallelogram. Can we extrude our parallelogram into a 3D volume?

Why not! Extruding a parallelogram into 3D yields a parallelepiped. Basically a cube but all askew:

![visual of trivector]

Which we can write as $\vec{a}\wedge\vec{b}\wedge\vec{c}$

This object's magnitude is clearly its volume so we've got that taken care of. But how should we think about orientation?

In the case of vectors there are three orthogonal basis vectors that you can project any vector onto. Bivectors have three orthogonal basis bivectors. How many orthogonal basis *volumes* are there?

I don't see how there can be more than one. Either a shape takes up volume or it doesn't, there are not multiple orthogonal types of volume that can be occupied, at least not in our 3D universe.

So I guess we're back at something that feels more like a scalar. In fact you might even think of trivectors as *psuedoscalars* because they behave so similarly. But scalars can be positive or negative--is there a meaningful way for volume to be negative? Can you fill a balloon with a negative amount of air?

Sure, just flip the balloon inside out first and then inflate!

This might seem like a silly distinction but imagine what would happen with a right-handed latex glove balloon. If you flip it inside out and then inflate it, you end up with a left-handed glove balloon!

Left-handedness vs right-handedness is the sense in which volume can be negative. By convention we think of right-handed volume as positive and left-handed volume as negative, so

$$
\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}} = -\mathbf{\hat{z}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{x}}
$$

![diagram of the two different coordinate systems]

<!-- The trivector $\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}$ has volume $+1$, but the trivector $\mathbf{\hat{y}}\wedge\mathbf{\hat{x}}\wedge\mathbf{\hat{z}}$ has volume $-1$. -->

Some quick doodling will convince you that the three ways to write right-handed unit trivectors are:
- $\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}$
- $\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}$
- $\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}$

And the three ways of writing a left-handed unit trivector are:
- $\mathbf{\hat{y}}\wedge\mathbf{\hat{x}}\wedge\mathbf{\hat{z}}$
- $\mathbf{\hat{z}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{x}}$
- $\mathbf{\hat{x}}\wedge\mathbf{\hat{z}}\wedge\mathbf{\hat{y}}$

But there is no need to explicitely remember these because there is a helpful pattern: You can swap the positions of any two adjacent vectors at the cost of a minus sign like this:

$$
\mathbf{\hat{x}}\wedge(\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}) = \mathbf{\hat{x}}\wedge-(\mathbf{\hat{z}}\wedge\mathbf{\hat{y}})
$$

$$
(\mathbf{\hat{x}}\wedge\mathbf{\hat{y}})\wedge\mathbf{\hat{z}} = - (\mathbf{\hat{y}}\wedge\mathbf{\hat{x}})\wedge\mathbf{\hat{z}}
$$

$$
\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}} = - \mathbf{\hat{z}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{x}}
$$

Where the third identity is constructed by using each of the first two identities.

This property is actually just an extension of equation $1.0$, repeated here:

$$
\tag{1.0}
\vec{a} \wedge \vec{b} = -\vec{b} \wedge \vec{a}
$$

So now we see the implication of our earlier decision that clockwise and counterclockwise paralellograms were opposites! That decision implies that right handed and left handed volumes are opposites.

We could have chosen to ignore bivector spin direction but if we'd have made that decision then to be self-consistent we would now be forced to ignore trivector coordinate handedness. Perhaps there is a useful algebraic system down that road, but it is not the one that seems most useful to me.

Trivectors are called 3-Vectors or thought of as "Grade 3" because their magnitude carries units of volume.

## Recap

|             | K aka Grade | Magnitude | Written                                 | Orthogonal Bases | Think
|:--          |:--      |:--              |:--                                    |:--               |:--
|Scalars      |0        |-                | $s$                                   | 1                | Numbers
|Vectors      |1        |length           | $\vec{a}$                             | 3                | Arrows
|Bivectors    |2        |area             | $\vec{a}\wedge\vec{b}$                | 3                | Parallelograms
|Trivectors   |3        |volume           | $\vec{a}\wedge\vec{b}\wedge\vec{c}$   | 1                | Weird Cubes 

The concept of a K-Vector extends out to any number of dimensions, so we might ask what about 4-Vectors?

Well, it is impossible to hold any 3D volume in a 2D universe, so it also seems impossible to hold any 4D volume in a 3D universe. I don't think there's any way to extend our pattern further without amending our definition of what *space* is.

# Addition of Like Types

We've derived some new objects and now it's time we learn how they interact with each other.

We all know how to add scalars together: Just add the values.

Vectors can be added together in a simple way: Project the input vectors onto three orthogonal unit vectors then add up the components

$$
\vec{a} + \vec{b} = (a_1\mathbf{\hat{x}} + a_2\mathbf{\hat{y}} + a_3\mathbf{\hat{z}}) + (b_1\mathbf{\hat{x}} + b_2\mathbf{\hat{y}} + b_3\mathbf{\hat{z}})
$$
$$
\vec{a} + \vec{b} = (a_1 + b_1)\mathbf{\hat{x}} + (a_2+b_2)\mathbf{\hat{y}} + (a_3+b_3)\mathbf{\hat{z}}
$$

Bivectors behave a lot like vectors:

$$
\vec{a} \wedge \vec{b} + \vec{c} \wedge \vec{d}= (ab_1\mathbf{\hat{x}}\wedge\mathbf{\hat{y}} + ab_2\mathbf{\hat{y}}\wedge\mathbf{\hat{z}} + ab_3\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}) + (cd_1\mathbf{\hat{x}}\wedge\mathbf{\hat{y}} + cd_2\mathbf{\hat{y}}\wedge\mathbf{\hat{z}} + cd_3\mathbf{\hat{z}}\wedge\mathbf{\hat{x}})
$$

$$
\vec{a} \wedge \vec{b} + \vec{c} \wedge \vec{d}= (ab_1+cd_1)\mathbf{\hat{x}}\wedge\mathbf{\hat{y}} + (ab_2+cd_2)\mathbf{\hat{y}}\wedge\mathbf{\hat{z}} + (ab_3+cd_3)\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}
$$

We could go ahead and develop explicit formulas for how to project a bivector on another bivector but there's no need. We're just trying to develop an intuition right now.

Trivectors are just fancy scalars. There's only one meaningful unit trivector so you just write your trivectors in terms of $\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}$ and add the components you end up with

$$
a_1 (\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}) + b_1 (\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}) = (a_1 + b_1)(\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}})
$$

You might have to wrangle your input trivectors a little. If you've got $a_1(\mathbf{\hat{x}}\wedge\mathbf{\hat{z}}\wedge\mathbf{\hat{y}})$ remember that this is equal to $-a_1(\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}})$.

So we've made it through the first hurdle--our new algebra would not be very useful it we couldn't add like types!

# Addition of Disparate Types

What does it mean to add a scalar to a vector?

$$
a_1\mathbf{\hat{x}} + b = ?
$$

I don't think there is any meaningful way to perform this computation. All you can do is just write out the sum as given.

This is reminsicent of the imaginary number $i=\sqrt{-1}$. We just accept that value in the direction of $i$ is simply orthogonal to value in the direction of $1$, so we write out complex numbers like:

$$
a + bi
$$

And we don't try to actually **add** $a$ and $b$ in any other way.

Generalizing a bit, objects with different grades are just orthogonal to each other and cannot be meaningfully added.

A quantity like
$$
a + b\mathbf{\hat{x}} + c(\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}) + d(\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}})
$$

Is perfectly valid, but it cannot be simplified into anything else. We can call this object a **Geometric** and write it as $\mathbf{G}$.

If objects with different grades don't mix, then the sum of any two geometrics, $\mathbf{G_1}$ and $\mathbf{G_2}$, is just the pairwise sum of their scalar, vector, bivector, and trivector components.

So there, adding disparate types is permitted it just doesn't simplify.

# Choosing The Vector Product

Now that we have objects called Geometrics, we can start to think about how we might multiply them together.

Let's start by considering two vectors.

Earlier we talked about the extrusion operator which forms what we might call the *extrude product*. And you're already familiar with the *dot product* and maybe even the *cross product*.

All of these seem like reasonable choices for our definition of the *vector product* but there's a serious problem with using all of these: they are all noninvertable.

The dot product is very lossy because it collapses two vectors onto a single scalar. 6 Input numbers collapsing into just 1 output number means the operation is very lossy and there is no hope of ever recovering the inputs.

<!-- For a given vector $\vec{a}$ and scalar $s$ there are infinitely many vectors $\vec{b}$ such that $\vec{b} \cdot \vec{a} = s$. -->

![diagram of all the ambiguous dot products]

This is why there is no "inverse dot product" that would let us write something like $\vec{b} = s \cdot \vec{a}^{-1}$. The dot product is not invertible, so the vector $\vec{a}$ is not invertible under dot multiplication.

The cross product has a similar problem. It takes in 2 input vectors and outputs just a single vector. Collapsing 6 numbers into 3 means it doesn't stand a chance of being invertible.

![diagram of ambiguous cross products]

If you haven't heard of the cross product that's okay. It's a garbage form of vector multiplication that I will speak of no further.

The extrude product that we invented earlier gets us closer. Taking in two vectors and outputting a bivector means 6 numbers in, 6 numbers out. This could potentially be a lossless, invertible operation.

But, given just the magnitude and orientation of the resulting bivector, there are an infinite number of ways to extrude the vector $\vec{a}$ to get there.

![diagram of ambiguous wedge products]

You can extrude $\vec{a}$ just a little bit in a direction very perpendicular to $\vec{a}$ or you can extrude it a whole lot in a direction more parallel to $\vec{a}$, or anywhere in between. You can always end up with the same area parallelogram in the same plane.

This ambiguity means there is no clear way to invert the extrude product. Actually this lack of constraint is what I was referring to earlier when I said that bivectors are written out using 6 numbers, but only encapsulate 5 degrees of freedom.

Comparing the two (cross products are garbage) side by side we see:

|             | Dot Product |  Extrude Product
| :---------- | :---------- | :-----
| Written     | $\vec{a} \cdot \vec{b}$   | $\vec{a} \wedge \vec{b}$
| Formula     | $\|\vec{a}\|~\|\vec{b}\| \sin{\theta_{ab}}$ | $\|\vec{a}\|~\|\vec{b}\| \cos{\theta_{ab}}$
| Resulting Grade | 0 |  2
| Input DOF | 6 | 6
| Resulting DOF | 1 | 5
| Invertible   | No        | No
| Commutivity | $\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$ | $\vec{a} \wedge \vec{b} = -\vec{b} \wedge \vec{a}$
| Squaring | $\vec{a} \cdot \vec{a} = \|a\|^2$ | $\vec{a} \wedge \vec{a} = 0$

A *Eureka* moment is upon us!

---

What if we define the Vector Product as:

$$
\tag{2.0}
\vec{a}\vec{b} = \vec{a} \cdot \vec{b} + \vec{a} \wedge \vec{b}
$$

The input vectors each have 3 degrees of freedom so that's 6 input DOF. The output is a Geometric with scalar and a bivector components, which has 1 + 5 = 6 DOF so this system is not lossy! It should permit an unambiguous inversion operation!

More visually, the extrude product was *almost* invertible, the only degree of freedom left to constrain was: how parallel are $\vec{a}$ and $\vec{b}$? The dot product answers that question directly.

We write the vector product as $\vec{a}\vec{b}$ in direct analogy to how we write scalar multiplication like $7x$ or $2c^2$ because it will behave almost the same way that scalar multiplication behaves.

This new definition is very important so let's examine it a few ways.

# Examining the Vector Product

What happens when we plug in two of the same vector?

$$
\tag{2.1}
\vec{a}\vec{a} = \vec{a} \cdot \vec{a} + \vec{a} \wedge \vec{a}
$$

The formula for the dot product is:

$$
\vec{a} \cdot \vec{b} = \|\vec{a}\| \|\vec{b}\| \cos{\theta}
$$

Where $\theta$ is the angle between the vectors. With two of the same vector, that angle is $0$ so $\cos{\theta} = 1$. That means $\vec{a} \cdot \vec{a} = \|\vec{a}\|^2$

And we know that extruding a vector along itself yields a parallelogram with zero area, which we formalized in equation $1.1$: $\vec{a} \wedge \vec{a} = 0$, so:

$$
\tag{2.2}
\vec{a}\vec{a} = \|\vec{a}\|^2 + 0 = \|\vec{a}\|^2
$$

And just like that we've learned what it means to take the square of a vector!

$$
\tag{2.3}
\vec{a}^2 = \|\vec{a}\|^2
$$

Any vector squared yields a scalar equal to the magnitude of that vector, squared.

---

Consider the quantity $\frac{\vec{a}}{\vec{a}^2}$. What happens if you multiply it by $\vec{a}$?

$$
\tag{2.3}
\left(\frac{\vec{a}}{\vec{a}^2}\right) \vec{a} = \frac{\vec{a}^2}{\vec{a}^2} = 1
$$

$\vec{a}$ times the quantity $\frac{\vec{a}}{\vec{a}^2}$ equals $1$. That means $\frac{\vec{a}}{\vec{a}^2}$ is the inverse of the vector $\vec{a}$:

$$
\tag{2.4}
\vec{a}^{-1} = \frac{\vec{a}}{\vec{a}^2}
$$

Just like scalars, vectors can be meaningfully inverted! Apparently the inverse of a vector is just that same vector, but scaled so that its new magnitude squared is the inverse of its old magnitude squared. Writing in a more suggestive way with help from equation $2.3$:

$$
\tag{2.4}
\vec{a}^{-1} = \frac{1}{\|\vec{a}\|^2} \vec{a}
$$

There's even a certain similarity between a vector's inverse and a scalar's:

$$
s^{-1} = \frac{1}{s} 1
$$

<!-- Or how the inverse of a matrix $A$ always carries a factor of $\frac{1}{\det(A)}$. -->

---

What happens if we swap the order of the input vectors?

The dot product is commutative:

$$
\tag{2.5}
\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}
$$

And we know from equation $1.0$ that the extrude product is anticommutative: 
$$
\tag{1.0}
\vec{a} \wedge \vec{b} = -\vec{b} \wedge \vec{a}
$$

So the vector product $\vec{b}\vec{a}$:

$$
\tag{2.6}
\vec{b}\vec{a} = \vec{b} \cdot \vec{a} + \vec{b} \wedge \vec{a}
$$

Can be rewritten as:

$$
\tag{2.6}
\vec{b}\vec{a} = \vec{a} \cdot \vec{b} - \vec{a} \wedge \vec{b}
$$

Which is more similar to our original definition:

$$
\tag{2.0}
\vec{a}\vec{b} = \vec{a} \cdot \vec{b} + \vec{a} \wedge \vec{b}
$$

Just for practice, let's add equations $2.6$ and $2.0$ to get:
$$
\tag{2.7}
\vec{a}\vec{b} + \vec{b}\vec{a} = \vec{a} \cdot \vec{b} - \vec{a} \wedge \vec{b} + \vec{a} \cdot \vec{b} + \vec{a} \wedge \vec{b} = 2 \vec{a} \cdot \vec{b}
$$

Dividing both sides by $2$ gives us an explicit formula for the dot product in terms of the vector product!

$$
\tag{2.8}
\vec{a} \cdot \vec{b} = \frac{\vec{a}\vec{b} + \vec{b}\vec{a}}{2}
$$

If we subtract equation $2.6$ from equation $2.0$ we get:
$$
\tag{2.9}
\vec{a}\vec{b} - \vec{b}\vec{a} = \vec{a} \cdot \vec{b} + \vec{a} \wedge \vec{b} - \vec{a} \cdot \vec{b} + \vec{a} \wedge \vec{b} = 2 \vec{a} \wedge \vec{b}
$$

Which, after dividing both sides by $2$, gives an explicit formula for the extrude product in terms of the vector product!

$$
\tag{2.9}
\vec{a} \wedge \vec{b} = \frac{\vec{a}\vec{b} - \vec{b}\vec{a}}{2}
$$

---

What if we plug in unit vectors?

$$
\mathbf{\hat{x}}\mathbf{\hat{y}} = \mathbf{\hat{x}} \cdot \mathbf{\hat{y}} + \mathbf{\hat{x}} \wedge \mathbf{\hat{y}}
$$

The dot product of two orthogonal basis vectors is always $0$ (because $\cos{\theta}=0$), so:

$$
\mathbf{\hat{x}}\mathbf{\hat{y}} = \mathbf{\hat{x}} \wedge \mathbf{\hat{y}}
$$

This is an incredibly convenient result! It means that we can stop writing our unit bivectors as $\mathbf{\hat{x}} \wedge \mathbf{\hat{y}}$ and instead start writing them as $\mathbf{\hat{x}}\mathbf{\hat{y}}$ which is much more compact.

Given that $\mathbf{\hat{x}} \wedge \mathbf{\hat{y}} = -\mathbf{\hat{y}} \wedge \mathbf{\hat{x}}$, it is clear that $\mathbf{\hat{x}}\mathbf{\hat{y}} = - \mathbf{\hat{y}}\mathbf{\hat{x}}$, so our freedom to swap the order of any two unit vectors at the cost of a minus sign still holds.

---

We created equation $2.0$ to give us a way to multiply two vectors together. Can it cope if we start throwing bivectors at it? Let's try multiplying the bivector $\mathbf{\hat{x}}\mathbf{\hat{y}}$ times the unit vector $\mathbf{\hat{z}}$.

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}})\mathbf{\hat{z}} = (\mathbf{\hat{x}}\mathbf{\hat{y}}) \cdot \mathbf{\hat{z}} + (\mathbf{\hat{x}}\mathbf{\hat{y}}) \wedge \mathbf{\hat{z}}
$$

Well, what does it mean to take the dot product between the $\mathbf{\hat{x}}\mathbf{\hat{y}}$ plane and the $\mathbf{\hat{z}}$ vector? Normally we visualize the dot product by projecting one argument onto the other, but in this case the $\mathbf{\hat{z}}$ vector is completely orthogonal to the $\mathbf{\hat{x}}\mathbf{\hat{y}}$ plane. It casts no "shadow". So I think it makes sense to say that

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}) \cdot \mathbf{\hat{z}} = 0
$$

That leaves us with

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}})\mathbf{\hat{z}} = (\mathbf{\hat{x}}\mathbf{\hat{y}}) \wedge \mathbf{\hat{z}}
$$

Which is just ordinary extrusion of a bivector along a vector. After removing parenthesis and substituting in equation $n$ we see that:

$$
\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}} = \mathbf{\hat{x}} \wedge \mathbf{\hat{y}} \wedge \mathbf{\hat{z}}
$$

Another huge notational win! The unit trivector can be written as $\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}$!

---

What about two of the same unit vector?

$$
\mathbf{\hat{x}}\mathbf{\hat{x}} = \mathbf{\hat{x}} \cdot \mathbf{\hat{x}} + \mathbf{\hat{x}} \wedge \mathbf{\hat{x}}
$$

Any vector that has length 1, when dot multiplied with itself, is 1. The extrude product of any vector with itself is $0$. So:

$$
\mathbf{\hat{x}}\mathbf{\hat{x}} = 1
$$
$$
\mathbf{\hat{y}}\mathbf{\hat{y}} = 1
$$
$$
\mathbf{\hat{z}}\mathbf{\hat{z}} = 1
$$

Which means *any unit-length vector is its own inverse!* This will help us simplify complex expressions!

---

<!-- Just for practice let's try squaring the unit trivector. Let's just spell it out and give it a go:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}) ^2 = \mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}
$$

To be clear, I have not yet plugged two trivectors into our vector product equation. I'm just expanding out the definition of the square by writing it the long way.

I don't have any idea how to visualize the vector product of six unit vectors, but the beautiful thing about algebra is that once you derive rules that work, you can *just use them*. Let's swap the last two vectors and add a minus sign:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}) ^2 = -\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}\mathbf{\hat{x}}\mathbf{\hat{z}}\mathbf{\hat{y}}
$$

Now let's swap second $\mathbf{\hat{x}}$ with the second $\mathbf{\hat{z}}$ and remove our minus sign:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}) ^2 = \mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}\mathbf{\hat{z}}\mathbf{\hat{x}}\mathbf{\hat{y}}
$$

And finally let's swap our trailing $\mathbf{\hat{x}}$ and $\mathbf{\hat{y}}$ bringing back the minus:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}) ^2 = -\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}\mathbf{\hat{z}}\mathbf{\hat{y}}\mathbf{\hat{x}}
$$

Knowing that $\mathbf{\hat{z}}$ is its own inverse, this simplifies:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}) ^2 = -\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{y}}\mathbf{\hat{x}}
$$

And again with $\mathbf{\hat{y}}$:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}) ^2 = -\mathbf{\hat{x}}\mathbf{\hat{x}}
$$

And again with $\mathbf{\hat{x}}$:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}) ^2 = -1
$$

Which if we take the square root of both sides shows us:

$$
\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}} = \sqrt{-1}
$$

Whoa. Apparently, the unit trivector is also the square root of negative one! Without resorting to "imaginary" numbers, we've stumbled upon an object with the property we normally assign to $i$! Maybe our new system of algebra can do some of the things that we normally rely on complex numbers to do, like rotations? -->

Now that we can simplify complicated expressions, let's make some! What happens if we try to square the $\mathbf{\hat{x}}\mathbf{\hat{y}}$ unit bivector?

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}})^2 = \mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{x}}\mathbf{\hat{y}}
$$

Here I'm just writing out what it means to square something, I haven't plugged it in to our special vector product formula. We can swap the last two axes and bring in a minus sign:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}})^2 = -\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{y}}\mathbf{\hat{x}}
$$

The two $\mathbf{\hat{y}}$'s cancel:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}})^2 = -\mathbf{\hat{x}}\mathbf{\hat{x}}
$$

And the two $\mathbf{\hat{x}}$'s cancel:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}})^2 = -1
$$

Whoa. Apparently, the unit bivector that lives in the $\mathbf{\hat{x}}\mathbf{\hat{y}}$ plane squares to negative one! Without resorting to anything "imaginary", we've stumbled upon an object with the property we normally assign to the imaginary number $i$! Maybe our new system of algebra can do some of the things that we normally rely on complex numbers to do, like rotations?

This property is so remarkable to stumble upon that I think we should feel free to refer to the $\mathbf{\hat{x}}\mathbf{\hat{y}}$ unit bivector as just $i$ for short!

But there was nothing special about the $\mathbf{\hat{x}}\mathbf{\hat{y}}$ that gave us this strange property. Does it hold with the $\mathbf{\hat{y}}\mathbf{\hat{z}}$ plane?

$$
(\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = \mathbf{\hat{y}}\mathbf{\hat{z}}\mathbf{\hat{y}}\mathbf{\hat{z}}
$$

$$
(\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = -\mathbf{\hat{y}}\mathbf{\hat{z}}\mathbf{\hat{z}}\mathbf{\hat{y}}
$$

$$
(\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = -\mathbf{\hat{y}}\mathbf{\hat{y}}
$$

$$
(\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = -1
$$

Huh. So we have *two* imaginary numbers which are orthogonal to each other? We can't just call this one $i$ as well. Maybe we'll call this one $j$?

For completeness' sake let's try the last one:

$$
(\mathbf{\hat{z}}\mathbf{\hat{x}})^2 = \mathbf{\hat{z}}\mathbf{\hat{x}}\mathbf{\hat{z}}\mathbf{\hat{x}}
$$

$$
(\mathbf{\hat{z}}\mathbf{\hat{x}})^2 = -\mathbf{\hat{z}}\mathbf{\hat{x}}\mathbf{\hat{x}}\mathbf{\hat{z}}
$$

$$
(\mathbf{\hat{z}}\mathbf{\hat{x}})^2 = -\mathbf{\hat{z}}\mathbf{\hat{z}}
$$

$$
(\mathbf{\hat{z}}\mathbf{\hat{x}})^2 = -1
$$

Which is unsurprising the third time around, I guess. This plane is orthogonal to both of the previous planes so let's call it $k$!

Apparently our new algebraic system based on Geometrics permits three mutually orthogonal "imaginary numbers" corresponding to the three unit bivectors!

If you've ever studied [Quaternions](https://www.youtube.com/watch?v=d4EgbgTm0Bg) you might remember the fundamental equation that defines them:

$$
i^2 = j^2 = k^2 = ijk = -1
$$

And how strikingly similar our current situation seems to be! Perhaps our new algebra will be useful for some of the things that Quaternions are useful for!

<!-- 
Squaring bivectors has proven to be very interesting. What happens if we square the unit trivector?

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = \mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}
$$

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = -\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{x}}\mathbf{\hat{z}}\mathbf{\hat{y}}\mathbf{\hat{z}}
$$

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = \mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}\mathbf{\hat{z}}
$$

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = \mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{x}}\mathbf{\hat{y}}
$$

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = -\mathbf{\hat{x}}\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{y}}
$$

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}})^2 = -1
$$

This is starting to look familiar. Let me confirm a quick hunch:

$$
(\mathbf{\hat{x}}\mathbf{\hat{y}})(\mathbf{\hat{y}}\mathbf{\hat{z}})(\mathbf{\hat{z}}\mathbf{\hat{x}}) = \mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{y}}\mathbf{\hat{z}}\mathbf{\hat{z}}\mathbf{\hat{x}}
$$ -->

# A Quick Warmup (Start here if you just need a refresher)

We're now armed with a robust set of identities, tools for simplifying complexity, and even a few hints at what directions we might want to explore. It's time to see what our newly invented form of algebra can do!

First let's do a quick practice problem just to get a taste. We're going to simplify:

$$
\mathbf{G} = (\mathbf{\hat{x}} + \mathbf{\hat{y}})(\mathbf{\hat{z}} + \mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}})
$$

We're just dealing with normal algebra here. Use the FOIL method:

$$
\mathbf{G} = \mathbf{\hat{x}}\mathbf{\hat{z}} + \mathbf{\hat{x}}\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}+ \mathbf{\hat{y}}\mathbf{\hat{z}} + \mathbf{\hat{y}}\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}
$$

Let's simplify the second term because $\mathbf{\hat{x}}$ is its own inverse:

$$
\mathbf{G} = \mathbf{\hat{x}}\mathbf{\hat{z}} + \mathbf{\hat{y}}\mathbf{\hat{z}}+ \mathbf{\hat{y}}\mathbf{\hat{z}} + \mathbf{\hat{y}}\mathbf{\hat{x}}\mathbf{\hat{y}}\mathbf{\hat{z}}
$$

On the final term let's swap the middle $\mathbf{\hat{x}}$ and $\mathbf{\hat{y}}$ and add our minus sign:

$$
\mathbf{G} = \mathbf{\hat{x}}\mathbf{\hat{z}} + \mathbf{\hat{y}}\mathbf{\hat{z}}+ \mathbf{\hat{y}}\mathbf{\hat{z}} - \mathbf{\hat{y}}\mathbf{\hat{y}}\mathbf{\hat{x}}\mathbf{\hat{z}}
$$

Remembering that $\mathbf{\hat{y}}^2 = 1$:

$$
\mathbf{G} = \mathbf{\hat{x}}\mathbf{\hat{z}} + \mathbf{\hat{y}}\mathbf{\hat{z}}+ \mathbf{\hat{y}}\mathbf{\hat{z}} - \mathbf{\hat{x}}\mathbf{\hat{z}}
$$

Then combining like terms we see:

$$
\mathbf{G} = 2\mathbf{\hat{y}}\mathbf{\hat{z}}
$$

And that's what it feels like to use our new algebra! We did all that work to define the vector product, but most of our actual manipulations boil down to just swapping orders and adding minus signs, or cancelling out squared unit vectors.

# Vectors as Transformations

In Matrix Algebra we often employ transformations that look like:

$$
A'=MAM^{-1}
$$

And when working with Quaternions rotate vectors we apply them like:

$$
{\vec{v}\,}'=\mathbf{q}\vec{v}\mathbf{q}^{-1}
$$

So it isn't a huge leap to ask: What happens we use a *vector* as a transformation? We can invert them and multiply them now, so let's try!

Vectors of unit length are easier to invert so we'll make sure to use that kind of vector as our "transform". This is purely to make the math easier to write:

Let's set $\vec{v} = (1\mathbf{\hat{x}} + 0\mathbf{\hat{y}} + 0\mathbf{\hat{z}})$ and $\vec{q} = \frac{1}{\sqrt{2}}(1\mathbf{\hat{x}} + 1\mathbf{\hat{y}} + 0\mathbf{\hat{z}})$

$$
{\vec{v}\,}'=\mathbf{a}\vec{v}\mathbf{q}^{-1}
$$


# Further Reading:
- http://new.math.uiuc.edu/math198/MA198-2015/stelzer3/mathwriteup1.pdf 

<!-- What happens when we plug in a unit vector like $\hat{x}$?

$$
\tag{2.1}
\hat{x}\hat{x} = \hat{x} \cdot \hat{x} + \hat{x} \wedge \hat{x}
$$

The dot product of a vector with itself equals the square of its magnitude. If the vector has length $1$ then the square of its magnitude is $1$.

From equation $1.1$ We know that the wedge product of a vector with itself is $0$. So:

$$
\tag{2.1}
\hat{x}\hat{x} = 1 + 0 = 1
$$

Identical logic for $\hat{y}$ and $\hat{z}$ yields:

$$
\tag{2.2}
\hat{y}\hat{y} = 1
$$
$$
\tag{2.3}
\hat{z}\hat{z} = 1
$$
 -->



<!-- 


---





Vector multiplication would be so much more useful it if were invertible. If we had such an operation, we could manipulate vector equations with all the power and ease that we manipulate scalar equations.

For example, given an equation like:

$$
a = \vec{b} * \vec{c}
$$

We could solve for $\vec{b}$ when given just values for $\vec{a}$ and $\vec{c}$

---

When you hear "vector multiplication" maybe you think of the dot product:

$$
a = \vec{b} \cdot \vec{c}
$$


$$
\begin{align}
    \vec{a} &= \begin{bmatrix}
           a_{1} \\
           a_{2} \\
           a_{3}
         \end{bmatrix}
\end{align}
$$

$$
\begin{align}
    \vec{b} &= \begin{bmatrix}
           b_{1} \\
           b_{2} \\
           b_{3}
         \end{bmatrix}
\end{align}
$$

$$
c = \vec{a} * \vec{b}
$$

> What do you get if you multiply two vectors, $\vec{a}$ and $\vec{b}$?

Really think about this for a second. We know how to add two vectors:

$$
\begin{align}
    \vec{a} + \vec{b} &= \begin{bmatrix}
           a_{1} + b_{1} \\
           a_{2} + b_{2} \\
           a_{3} + b_{3}
         \end{bmatrix}
\end{align}
$$

And we know how to multiply a vector by a scalar:

$$
\begin{align}
    S \cdot \vec{a} &= \begin{bmatrix}
           S * a_{1} \\
           S * a_{2} \\
           S * a_{3}
         \end{bmatrix}
\end{align}
$$

But what does it mean to _multiply two vectors?_

You might reach for the dot product:

$$
c = \vec{a}^T \cdot \vec{b} = (a_{1} \cdot b_{1} + a_{2} \cdot b_{2} + a_{3} \cdot b_{3})
$$

In which case the output is a scalar.

But the dot product doesn't behave like multiplication should behave. It is lossy and not invertible. If I gave you this equation

$$
30 = a * 2 
$$

You'd have no trouble solving it, because scalar multiplication can be inverted unambiguously. But if I gave you

$$
\begin{align}
    30 = [a_1, a_2, a_3] \cdot \begin{bmatrix}
           2 \\
           2 \\
           2
         \end{bmatrix}
\end{align}
$$

You would have some trouble because

$$
\begin{align}
    30 = [10, 3, 2] \cdot \begin{bmatrix}
           2 \\
           2 \\
           2
         \end{bmatrix}
\end{align}
$$

But also

$$
\begin{align}
    30 = [4, 3, 8] \cdot \begin{bmatrix}
           2 \\
           2 \\
           2
         \end{bmatrix}
\end{align}
$$

And there are actually an infinite number of satisfactory values for $a$. As long as $a_1 + a_2 + a_3 = 15$, the equation is true. That means we don't get an unambiguous vector $\vec{a}$ back, we get a whole *plane* of solutions which all meet the criteria.

This is unacceptable! We never have this problem when we multiply scalars or complex numbers or functions or square matrices[footnote]. Why should we settle for less here?

"Okay," you say, "let's try a cross product!"

$$
\begin{align}
    \vec{c} = \vec{a} \times \vec{b} &= \begin{bmatrix}
           a_2b_3 - a_3b_2 \\
           a_3b_1 - a_1b_3 \\
           a_1b_2 - a_2b_1
         \end{bmatrix}
\end{align}
$$

A cross product takes in two input vectors and it yields a new vector which is perpendicular to both of the inputs.

This makes more sense intuitively, because a vector times a vector *should* result in a new vector, right? I mean, scalar multiplication yields a scalar and square matrix multiplication yields a square matrix.

This stands a much better chance of being invertible, right? 

$$
\begin{align}
    \begin{bmatrix}
           30 \\
           30 \\
           30
         \end{bmatrix} = \vec{a} \times \begin{bmatrix}
           2 \\
           2 \\
           2
         \end{bmatrix}
\end{align}
$$

Maybe with some matrix tricks we can just solve for $\vec{a}$. 

But wait a second...

A cross product gives you a new vector which is *perpendicular* to both input vectors. But $\vec{30}$ is not at all perpendicular to $\vec{2}$, in fact they are parallel!

The equation we are trying to trying to invert stands in direct contravention to the definition of the cross product! It cannot possibly be solved!

And this is not just a special case, chosen to be inconvenient. The only way this equation could ever stand a chance of being solved is if $\vec{c}$ and $\vec{b}$ just happen to be perpendicular. And even in that special case we still get an infinite number of answers!

So if the dot product and cross product both fail to be invertible, what *should* we use for vector multiplication?

We'll come right back to this, but to answer the question we need some more tools.









# The Outer Product

The dot product is also known as the **inner product**. What is the outer product?


---
Footnote:Yes there are special degenerate cases where we can't invert. But in general, for well-behaved matrices or functions, we can do it. The issue with vectors here is that it is _never_ possible to invert.


Switching from a column vector to a row vector and vice versa is called "transposition" and we write it with the little $^T$ symbol. 




# Notes

Scalars are a kind of "degenerate" vector. bivectors are a kind of "super" vector.



Another way to represent a plane is to describe the normal vector, and then encode "area" in the length of the vector. This is the approach we learn in school and it is why so many students struggle with concepts like angular momentum and magnetism. Angular momentum should not be taught as a vector. It is a bivector.

We learn about vectors like position and velocity and acceleration and we instinctively grasp that they can be added together, negated, multiplied. But then we learn about a bizarro world set of vectors like angular momentum and torque which can be added and multiplied but the two worlds are not to mix. It is not sensible to add a torque vector to a position vector. This new view makes it obvious why--angular momentum and torque are bivectors, not vectors.

We know intuitively that angular momentum vectors cannot sensibly be added to vectors that represent locations. -->

<!-- End with calling it the noodle press operator? -->

Honestly cross products are probably a mistake.

Special relativity as a modification of what "space" is.