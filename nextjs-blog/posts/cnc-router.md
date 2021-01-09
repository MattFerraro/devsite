---
title: 'Homemade CNC Router'
date: '2020-01-08'
---

![My Homemade CNC Router](/images/my_router.jpg "My Homemade CNC Router")

# Overall Layout

When 2020 began, my theme for the year was to learn how to design and produce physical objects and mechanical systems. When lockdown began I decided to build these skills by designing and building my own 3-axis CNC router.

I started by looking at routers I could buy, comparing overall layouts and high-level design choices. Cheap little routers like the [3018](https://www.banggood.com/3018-3-Axis-Mini-DIY-CNC-Router-Standard-Spindle-Motor-Wood-Engraving-Machine-Milling-Engraver-p-1274569.html) are well liked and affordable but they come with serious limitations--namely small working volume and low rigidity which lead to slow cutting speed and limited ability to cut materials harder than wood. Usually these machines are underpowered and some come with sketchy software.

![A typical 3018 import router from China](/images/3018.png "3018 CNC Router")

This style of router has a fixed gantry where the work piece slides back and forth on a moving table.

Larger, [more expensive](https://www.toolots.com/6040.html?cid=10311468392) CNC routers tend to leave the work piece fixed and use a sliding gantry instead.

![A typical 6040 import router from China](/images/6040.png "6040 CNC Router")

I opted to go with a scaled up version of the 3018 layout because I thought I could build a stiffer frame that way.

---

# Linear Guides

A very expensive part of any CNC system is the linear motion hardware. Mills and lathes can use heavy duty box ways or dovetail ways, but most CNC routers use much lighter duty linear rails. These typically take one of two forms: supported precision shafts or ground precision rails.

### Supported Shafts

![Supported Shaft linear guides](/images/supported_shafts.png "Supported Shafts")

Supported shafts are precision ground shafts, usually steel, with aluminum support structure underneath that allows you to fix the shaft firmly to the frame of the CNC machine. The linear bearings that run on the shaft are free to rotate about 20 degrees back and forth on the long axis of the shaft, meaning each one has two distinct degrees of freedom.

### Ground Rails

![Ground Rail linear guides](/images/linear_rails.png "Ground Rails")

Precision ground linear rails are generally a single rectangular piece of steel with many mounting holes evenly spaced along the length of the rail. The linear bearings that ride on the rail are not free to rotate in any axis, meaning each one has just a single degree of freedom.

### Unsupported Shafts

![Unsupported linear shafts](/images/unsupported_shaft.png "Unsupported Shaft")

Very cheap, low-quality builds will use unsupported linear shafts which are held only at two points. This is a [terrible idea](http://www.mycncuk.com/threads/4356-Why-not-use-unsupported-rails) because the deflection for a given force is several orders of magnitude larger, leading to very low precision and lots of chatter, which leads to poor surface finish, slower cutting speeds, and shorter tool lifetime.

This solution works for laser cutters and 3D printers where cutting forces are nonexistant, but this approach is inadequate for a CNC router. Despite the drawbacks, many cheap designs still use this type of linear guide.

---

# Linear Actuation

### Belt Drives

### Rack and Pinion

### Lead Screws/Acme Screws

### Ball Screws

---

# Motors

### Stepper Motors

### Servo Motors

---

# Motor Electronics

### Integrated packages

### Standalone components

---

# GCode Interpreter and Step Generator

### TinyG

### GRBL

---

# GCode sender

### Universal GCode Sender

### CNCJS

### Axion

---

# Spindle

### Air Cooled Spindle

### Water Cooled Spindle

### Palm Router

---

# Dust Collection

### Vacuum Boot

### Enclosure

---

# Miscellanous Improvements

### Spindle control

### Z Axis probe
