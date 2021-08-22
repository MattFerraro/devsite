---
title: 'Intro to GA'
teaser: 'During quarantine I designed and built my own CNC router from scratch. This is everything you need to know if you want to do the same.'
teaserImage: 'https://www.mattferraro.dev/images/my_router_small.jpeg'
date: '2021-08-19'
---

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

# K-Vectors

A **scalar** $s$ is just a regular number like $1.618$ or $\frac{1}{137}$. Its magnitude (written with two bars) is equal to its absolute value

$$
||s|| = |s|
$$

A scalar carries no intrinsic units and it does not correspond to any geometric object.

A **vector** $\vec{v}$ is a point in $n$-dimensional space. In this post I'll only talk about 3D vectors, so I'll write a a column vector like:

$$
\begin{align}
    \vec{v} &= \begin{bmatrix}
           v_{1} \\
           v_{2} \\
           v_{3}
         \end{bmatrix}
\end{align}
$$

And I'll write out a row vector like $\vec{v}^T = (v_1, v_2, v_3)$. (footnote)

<!-- A vector carries meaning both in its length *and* its orientation. -->

The magnitude of a vector equals the length of the vector

$$
||\vec{v}|| = \sqrt{v_1^2 + v_2^2 + v_3^2}
$$

So one way to think of a vector is as an oriented piece of length, and length is 1-dimensional.


This suggests a pattern. If a scalar's magnitude is a 0-dimensional value that carries no units, and a vector's magnitude is a 1-dimensional value that carries units of length, is there a type of object whose magnitude carries units of area?

A **bivector** is an object that represents an oriented piece of area. To describe a bivector you provide two vectors, $\vec{u}$ and $\vec{v}$. The plane that both vectors fall on is our orientation, and the area of the parallelogram that they form is our area.

<!-- The right hand rule lets us differentiate which side of the plane is "up", and it's what separates  -->

Two vectors is enough to describe a plane






# The Outer Product

The dot product is also known as the **inner product**. What is the outer product?


---
Footnote:Yes there are special degenerate cases where we can't invert. But in general, for well-behaved matrices or functions, we can do it. The issue with vectors here is that it is _never_ possible to invert.


Switching from a column vector to a row vector and vice versa is called "transposition" and we write it with the little $^T$ symbol. 