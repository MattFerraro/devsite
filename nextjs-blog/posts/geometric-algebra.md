---
title: 'What is the Square Root of a Vector?'
teaser: 'The Algebra of Vectors is extremely limited.'
teaserImage: 'https://openga.org/imgs/basis.svg'
date: '2021-08-19'
---

Working with vectors is impossibly frustrating.

In school we learn how to add two vectors together and how to multiply a vector by a scalar. But how come we don't learn how to do all the other algebraic operations that we're used to?

How do you multiply together two vectors? How do you find the inverse of a vector? How do you square a vector? How do you take the square root of a vector?

These questions have actual, concrete answers. But to reach them we need to think very creatively. Let's start by inventing a few new mathematical objects.

# The Magnitude of a K-Vector

We're going to look at the things we're already familiar with and try to draw a pattern.

A **scalar** $s$ is a regular number like $1.618$ or $\frac{1}{137}$.

A scalar is just a point on a number line. Its magnitude is just its absolute value. We can call this a 0-Vector to indicate that its magnitude carries no units.

---
<!-- A scalar carries no intrinsic units and it does not correspond to any geometric object. It's just a bare value. -->

For the purposes of this post a **vector** $\vec{v}$ is a point in 3D space. Vectors are usually written like this:

$$
\begin{align}
    \vec{v} &= \begin{bmatrix}
           v_{1} \\
           v_{2} \\
           v_{3}
         \end{bmatrix}
\end{align}
$$

Where they form a single column. The transpose operator $T$ turns columns into rows and vice versa, so it is equally valid to write a vector:

$$
\vec{v}^T = (v_1, v_2, v_3)
$$

A vector is a 3D arrow that points in a direction. Its magnitude is equal to its length, so we'll call them 1-Vectors because length is a 1D quantity.

---

This suggests a pattern. If a scalar's magnitude is a 0-dimensional value that carries no units, and a vector's magnitude is a 1-dimensional value that carries units of length, can we invent a type of object whose magnitude is a 2-dimensional value that carries units of area?

Let's try!

If vectors are oriented chunks of length, then our new object is some sort of oriented chunk of area, some segment of a 2D plane that is floating in 3D space.

The easiest way to define a plane is to use the normal vector $\vec{n}$ which is perpendicular to the plane. The direction of the normal vector tells us the orientation of the plane, and we can encode magnitude as the length of that normal vector.

![visual of a normal vector and a circle in the plane]

But...wait that definition isn't consistent with our goal. This object *does* describe an oriented plane and it does have a degree of freedom to represent scale, but it's just a vector so its magnitude is length, not area. This won't work.

---

What else can we try?

One alternative way to describe a plane is to use _two_ vectors, $\vec{a}$ and $\vec{b}$. The plane that they both fall upon gives us an orientation. But how do we get an area?

We've already got two vectors so the simplest possible solution might be to complete the triangle:

![diagram of completed triangle]

Which has an area equal to:

$$
A_{triangle}=\frac{1}{2}\sin(\theta)(||\vec{a}||\cdot||\vec{b}||)
$$

This works but we'll have to carry around an inconvenient factor of $\frac{1}{2}$.

On a lark, what if we borrow an idea from CAD software and try to *extrude* $\vec{a}$ in the direction of $\vec{b}$?

![Example Bivector](/images/ga/Exterior_calc_cross_product.svg)

The resulting shape is a parallelogram which covers an area:

$$
A_{parallelogram}=\sin(\theta)(||\vec{a}||\cdot||\vec{b}||)
$$

By choosing to extrude, we get to drop the extra factor of $\frac{1}{2}$, and we get a very hands-on, intuitive definition for what we're doing with our two vectors.

In fact, let's come up with a special new symbol that means *extrude*. We'll use $\wedge$ and pronounce it "extrude". We can write down our parallelogram as $\vec{a}\wedge\vec{b}$.


> The parallelogram $\vec{a}\wedge\vec{b}$ is defined by extruding the vector $\vec{a}$ in the direction of $\vec{b}$

So we've got our new object, a 2D parallelogram floating in 3D space. It takes two vectors to describe these things so let's call this object a **bivector**.

> The **bivector** $\vec{a}\wedge\vec{b}$ is defined by extruding the vector $\vec{a}$ in the direction of $\vec{b}$

If we double the length of one of the input vectors, the output bivector stays in the same plane, it just doubles in area:

![visual of doubling either one of the input vectors]

Even though they look like different objects, we say that:

$$
2\vec{a}\wedge\vec{b} = \vec{a}\wedge2\vec{b}
$$

Because their orientations and magnitudes are both equal.

More generally, using any scalar $s$:

$$
s\vec{a}\wedge\vec{b} = \vec{a}\wedge s\vec{b} = s(\vec{a}\wedge\vec{b})
$$

This property is called *linearity* which just means that the output scales linearly with the inputs. Scalar multiplication is also linear.

What happens if we switch the input ordering? Does $\vec{a} \wedge \vec{b}$ equal $\vec{b} \wedge \vec{a}$?

![visual of a wedge b vs b wedge a]

Well, $\vec{a} \wedge \vec{b}$ forms a parallelogram counterclockwise but $\vec{b} \wedge \vec{a}$ forms a parallelogram clockwise. To me those naturally feel like opposites, not equals.

So we define our first identity:

$$
\tag{1.0}
\vec{a} \wedge \vec{b} = -\vec{b} \wedge \vec{a}
$$

What happens if you extrude a vector by itself?

![visaul of a wedge a]

This parallelogram has zero area. So we can already write another identity!

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

This gives bivectors an interesting commonality with regular vectors. Any vector can be written as the weighted sum of basis vectors:

$$
\vec{v} = v_1 \mathbf{\hat{x}} + v_2\mathbf{\hat{y}} + v_3\mathbf{\hat{z}}
$$

Where you find the coefficients $v_1$, $v_2$, $v_3$ by projecting $\vec{v}$ onto the unit vectors $\mathbf{\hat{x}}$, $\mathbf{\hat{y}}$, $\mathbf{\hat{z}}$.

Similarly, any bivector can be written as the weighted sum of basis bivectors:
$$
\vec{a} \wedge \vec{b} = c_1\mathbf{\hat{x}} \wedge \mathbf{\hat{y}} + c_2\mathbf{\hat{y}}\wedge\mathbf{\hat{z}} + c_3\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}
$$

Where you find the coefficients $c_1$, $c_2$, $c_3$ by projecting the parallelogram $\vec{a} \wedge \vec{b}$ onto the unit bivectors $\mathbf{\hat{x}} \wedge \mathbf{\hat{y}}$, $\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}$, $\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}$.

So there we have it, a new type of object called a bivector which is an oriented chunk of area! Its magnitude carries units of area, so bivectors are considered 2-Vectors.

---

Okay we have a handle on scalars, vectors, and bivectors. Is there an object which behaves like an oriented *volume*? Something we might call a **trivector**?

<!-- In the case of bivectors we used the $\wedge$ symbol to mean *take these two vectors and complete the parallelogram* but this is such a weird, specific operation. Instead, let's think of it as a process of extrusion.  -->
<!-- We can now see a little more clearly what the $\wedge$ symbol does. It extrudes! $\vec{a} \wedge \vec{b}$ means "extrude $\vec{a}$ along the path given by $\vec{b}$", which yields a parallelogram. $\vec{a} \wedge \vec{b} \wedge \vec{c}$ means "extrude the parallelogram $\vec{a} \wedge \vec{b}$ along the path given by $\vec{c}$, which yields a parallelopiped.  -->

For bivectors we made progress by extruding one vector in the direction given by a second vector, which yielded a 2D parallelogram. Can we extrude our parallelogram into a 3D volume?

Why not! Extruding a parallelogram into 3D yields a parallelepiped. Basically a cube but all askew:

![visual of trivector] -->

Which we can write as $\vec{a}\wedge\vec{b}\wedge\vec{c}$

This object's magnitude is clearly its volume so we've got that taken care of. But how should we think about orientation?

In the case of vectors there are three orthogonal basis vectors that you can project any vector onto. Bivectors have three orthogonal basis bivectors. How many orthogonal basis *volumes* are there?

I don't see how there can be more than one. Either a shape takes up volume or it doesn't, there are not multiple orthogonal types of volume that can be occupied, at least not in our 3D universe.

So I guess we're back at something that feels more like a scalar. But scalars can be positive or negative--is there a meaningful way for volume to be negative? Can you fill a balloon with a negative amount of air?

In a sense, you can! Just flip the balloon inside out first and then inflate!

This might seem like a silly distinction but imagine what would happen with a right-handed latex glove. If you flip it inside out and then inflate it, you end up with a left-handed glove balloon!

Left-handedness vs right-handedness is the sense in which volume can be negative. By convention we think of right-handed volume as positive and left-handed volume as negative.

<!-- The trivector $\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}$ has volume $+1$, but the trivector $\mathbf{\hat{y}}\wedge\mathbf{\hat{x}}\wedge\mathbf{\hat{z}}$ has volume $-1$. -->

Some quick doodling will convince you that the three right-handed unit trivectors are:
- $\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}$
- $\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}$
- $\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}\wedge\mathbf{\hat{x}}$

And the three left-handed unit trivectors are:
- $\mathbf{\hat{y}}\wedge\mathbf{\hat{x}}\wedge\mathbf{\hat{z}}$
- $\mathbf{\hat{z}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{x}}$
- $\mathbf{\hat{x}}\wedge\mathbf{\hat{z}}\wedge\mathbf{\hat{y}}$

But there is no need to explicitely remember these because there is a helpful pattern: You can swap the positions of any two vectors at the cost of a minus sign like this:

$$
(\mathbf{\hat{x}}\wedge\mathbf{\hat{y}})\wedge\mathbf{\hat{z}} = - (\mathbf{\hat{y}}\wedge\mathbf{\hat{x}})\wedge\mathbf{\hat{z}}
$$

$$
\mathbf{\hat{x}}\wedge(\mathbf{\hat{y}}\wedge\mathbf{\hat{z}}) = \mathbf{\hat{x}}\wedge-(\mathbf{\hat{z}}\wedge\mathbf{\hat{y}})
$$

$$
\mathbf{\hat{x}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{z}} = - \mathbf{\hat{z}}\wedge\mathbf{\hat{y}}\wedge\mathbf{\hat{x}}
$$

Which is actually just an extension of equation $1.0$, repeated here:

$$
\tag{1.0}
\vec{a} \wedge \vec{b} = -\vec{b} \wedge \vec{a}
$$

And that's all there is to know about trivectors!

---

To recap:

- **Scalars**: magnitude carries no units. aka **0-Vectors**
- **Vectors**: magnitude carries length units. aka **1-Vectors**
- **Bivectors**: magnitude carries area units. aka **2-Vectors**
- **Trivectors**: magnitude carries volume units. aka **3-Vectors**

The concept of a K-Vector extends out to any number of dimensions, but if we're only considering a 3D universe then trivectors are the highest-order objects that have any meaning.

It is impossible to hold any 3D volume in a 2D universe, so it is also impossible to hold any 4D volume in a 3D universe. There's no way to extend our pattern further without diving into spacetime and relativity.

# Geometric Addition

We all know how to add scalars together, and vectors can be added together in a simple geometrical way: just put the base of the 2nd vector at the tip of the 1st and examine the resulting vector.



<!-- Referring to these objects by their specific names can get tedious, so let's introduce a new word.

A **Geometric** is any instance of any of these K-Vectors. -->



<!-- Sure! Let's call it a **trivector** and write it as $\vec{a}\wedge\vec{b}\wedge\vec{c}$.  -->

<!-- Geometrically, this object just looks like a bivector that has been extruded out in a third dimension. Its magnitude is the volume of the parallelepiped that is formed.




In three dimensions volume cannot really be oriented except in the sense of handedness. The trivector $\mathbf{\hat{x}} \wedge \mathbf{\hat{y}} \wedge \mathbf{\hat{z}}$ has magnitude $+1$ because it constitutes a right-handed coordinate space. But if we permute the order of any two vectors, we form a left handed space. Therefore $\mathbf{\hat{y}} \wedge \mathbf{\hat{x}} \wedge \mathbf{\hat{z}}$ has magnitude $-1$.

Written as identities:
$$
\tag{1.2}
(\vec{a} \wedge \vec{b}) \wedge \vec{c} = (-\vec{b} \wedge \vec{a}) \wedge \vec{c}
$$
$$
\tag{1.3}
\vec{a} \wedge (\vec{b} \wedge \vec{c}) = \vec{a} \wedge (-\vec{c} \wedge \vec{b})
$$
$$
\tag{1.4}
\vec{a} \wedge \vec{b} \wedge \vec{c} = -\vec{c} \wedge \vec{b} \wedge \vec{a}
$$

Equations $1.2$ and $1.3$ are actually just extensions of equation $1.0$, and equation $1.4$ is trivial to derive given $1.2$ and $1.3$, but it's nice to see it all written out.

Think about a sphere in 3D space. If you rotate it around it remains indistinguishable from its starting state. This means that there is only one unit sphere. Trivectors are just blobs of volume, so there is only one unit trivector and it is defined as $\mathbf{\hat{x}} \wedge \mathbf{\hat{y}} \wedge \mathbf{\hat{z}}$.

In three dimensions there are three unit vectors, three unit bivectors, but just one unit scalar and one unit trivector. For this reason, when working in 3D space, trivectors are often referred to as *psuedoscalars*, but I'll continue to call them trivectors. 

Trivectors, whose magnitudes are volumes, are considered 3-Vectors.

---

To recap:

- **Scalars**: magnitude carries no units. aka **0-Vectors**
- **Vectors**: magnitude carries length units. aka **1-Vectors**
- **Bivectors**: magnitude carries area units. aka **2-Vectors**
- **Trivectors**: magnitude carries volume units. aka **3-Vectors**

The concept of a K-Vector extends out to any number of dimensions. If we're only considered a 3D universe then trivectors (3-Vectors) are the highest-order objects that have any meaning.

A **Geometric** is any one instance of any of these K-Vectors.

# The Geometric Product

Armed with our knowledge of Geometrics, we can start to think about how we might multiply any two Geometrics together. Let's start by considering just the vector product. After all, bivectors and trivectors are just built out of vectors so maybe solving the simplest case will automatically extend to the more complex cases.

So, how should we multiply two vectors together?

The dot product is a poor choice because it is very lossy. Converting two vectors with three degrees of freedom each down into a single scalar means we go from six degrees of freedom down to just 1.

define the Geometric Product:

$$
\tag{2.0}
\vec{a}\vec{b} = \vec{a} \cdot \vec{b} + \vec{a} \wedge \vec{b}
$$



The product of two vectors $\vec{a}$ and $\vec{b}$ is their dot product (a scalar) plus their wedge product (a bivector).

This equation is very important so let's examine it a few different ways.

---

What happens when we plug in two of the same vector?

$$
\tag{2.1}
\vec{a}\vec{a} = \vec{a} \cdot \vec{a} + \vec{a} \wedge \vec{a}
$$

We know from high school math that the dot product of a vector with itself equals the length of the vector squared.

We know from equation $1.1$ that the wedge product of a vector with itself is $0$. So:

$$
\tag{2.2}
\vec{a}\vec{a} = \vec{a}^2 = ||\vec{a}||^2 + 0 = ||\vec{a}||^2
$$

And just like that we've learned what it means to take the square of a vector!

---

Consider the quantity $\frac{\vec{a}}{||\vec{a}||^2}$. What happens if you multiply it by $\vec{a}$?

$$
\tag{2.3}
\frac{\vec{a}}{||\vec{a}||^2}\vec{a} = \frac{\vec{a}^2}{||\vec{a}||^2} = \frac{||\vec{a}||^2}{||\vec{a}||^2} = 1
$$

This quantity, when multiplied by $\vec{a}$, equals $1$. That means this quantity is the inverse of the vector $\vec{a}$:

$$
\tag{2.4}
\vec{a}^{-1} = \frac{\vec{a}}{||\vec{a}||^2}
$$

Just like scalars, vectors can be meaningfully inverted!

---

What happens if we swap the order of the input vectors?

We learn in high school that the dot product is commutative:

$$
\tag{2.5}
\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}
$$

And we know from equation $1.0$ that the wedge product is anticommutative: 
$$
\tag{1.0}
\vec{a} \wedge \vec{b} = -\vec{b} \wedge \vec{a}
$$

So we can write $\vec{b}\vec{a}$ as:
$$
\tag{2.6}
\vec{b}\vec{a} = \vec{a} \cdot \vec{b} - \vec{a} \wedge \vec{b}
$$

Which is interesting compared to the original definition:

$$
\tag{2.0}
\vec{a}\vec{b} = \vec{a} \cdot \vec{b} + \vec{a} \wedge \vec{b}
$$

We can add equations $2.6$ and $2.0$ to get:
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
\vec{a}\vec{b} - \vec{b}\vec{a} = \vec{a} \cdot \vec{b} + \vec{a} \wedge \vec{b} - \vec{a} \cdot \vec{b} + \vec{a} \wedge \vec{b} = -2 \vec{a} \wedge \vec{b}
$$

Which, after dividing both sides by $-2$, gives an explicit formula for the wedge product in terms of the vector product!

$$
\tag{2.9}
\vec{a} \wedge \vec{b} = \frac{\vec{a}\vec{b} - \vec{b}\vec{a}}{2}
$$


---

What if we plug in unit vectors?

(important identities)

# K-Vector multiplication

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