---
title: "Laplace's Equation for Engineers"
teaser: "It isn't as hard as it looks"
teaserImage: 'https://www.mattferraro.dev/images/my_router_small.jpeg'
date: '2021-06-13'
---

If you haven't seen it before, Laplace's equation looks a little scary:

![Laplace's Equation](/images/laplace/equation.svg)

But it is the key to understanding much about the world. We use this equation to solve problems in heat transfer, electrostatics, fluid flow, image processing, geostatics, caustics engineering, and many other domains.

# What is an Operator?

The upside down triangle squared is the _laplace operator_. To understand what an operator is we need to build up a few steps.

#### Scalars
Scalars (pronounced Skay-ler) are regular numbers like: 1, 3.14159, -8.73. We use these to measure things like mass or height or length. When you have a scalar variable, it is usually written x.

#### Vectors
Vectors are arrows that point from somewhere to somewhere else. They have a length *and* a direction. They can live in 2D like on paper, 3D like in a videogame, or in even higher dimensional spaces--the math always works the same! They are written x(hat).

#### Functions
Functions are things that take in scalars or vectors and output other scalars or vectors. They are written like f(x, y) = x^2 + 3y or g(x) = 7x or h(t) = sin(omega * t)

A _scalar function_ is one whose output is everywhere a scalar. A _vector function_ is one whose output is a vector.

Note that matrices can be considered functions that take in vectors and output other vectors:

[1 2; 3 4][1, 3] = [2, 3]

Or alternatively, matrices can be considered 

#### Operators
Operators are things that take in functions and output other functions (or vectors or scalars). Calculus provides us with the derivative operator d/dx which takes in a function like f(x) = x^2 + 3x and gives us back another function like f'(x) = 2x + 3.

d/dx(x^2 + 3x) = 2x + 3

The Fourier transform is another operator that takes in functions like g(t) = sin(f * t) and outputs functions like G(f) = delta(f). We use the word "transform" because this operator takes in functions in one space (time) and outputs functions in another space (frequency).

Note that matrices can be considered operators that take in matrices and output other matrices:

[1 2; 3 4][1 2; 3 4] = [1 2; 1 4]

The lines between these categories can sometimes be blurry!

#### Matrices

A matrix is just a block of numbers like

[1 2; 3 5]

But their simplicity endows them with an incredible amount of flexibility!

Matrices can be considered functions because they take in vectors and output other vectors, like:

[1 2; 3 4][1, 3] = [2, 3]

But they can also be considered operators because they can take in matrices and output other matrices!

[1 2; 3 4][1 2; 3 4] = [1 2; 1 4]

In 

# The Gradient Operator

The Gradient Operator, written (grad) takes in a scalar function and outputs a vector function.

In 2 dimensions, we might have a function like f(x, y) = 2x^3 + 2y^2. This is a scalar function because at any point (x, y) the output of the function is a single scalar. The 2D gradient operator is defined as

grad = [p/px p/py]

This means that for any input function we'll have to find two different derivatives, one with respect to x and one with respect to y, and then make a vector out of the two resulting functions. The input to (grad) is a scalar function and the output is a vector whose individual elements are scalar functions, which is just another way of saying that the output is a _vector function_. 

If f(x, y) = 2x^3 + 2y^2 then 

grad(f(x, y)) = grad(2x^3 + 2y^2) = [p/dx(2x^3 + 2y^2) p/py(2x^3 + 2y^2)] = [6x^2 4y]

Another way we can define scalar functions is with matrices like:

[]

# Contact me

If you have questions about your CNC router, feel free to @ me on [twitter](https://twitter.com/mferraro89) and I will do my best to reply.



<!-- Discard :

Quantum mechanics deals with the wavefunction, psi, which is just a special function, and quantum operators like the momentum operator or position operator. The momentum operator can take in the wave function and give you the 
which can tell you the momentum of the wavefunction. The momentum operator operates on the wavefunction and gives you back 


The Laplace transform, unrelated to the Laplace Operator, is another operator that lets you transform differential equations into s space, where they can be manipulated using regular algebra.


There are other categories of things! Complex numbers, Tensors, Bivectors/quaternions/spinors, Psuedoscalars, Geometries, Groups, Sets, Knots and so on. Math is full of different types of objects and they are all fascinating!

 -->


