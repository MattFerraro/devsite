---
title: 'Anatomy of a CNC Router'
date: '2020-01-08'
---

![My Homemade CNC Router](/images/my_router.jpg "My Homemade CNC Router")

This is the blog post I wish I could have read when I started designing my CNC router

In it I'll cover all the components and some of the design considerations you'll need to keep in mind when desiging your own CNC router.

# Overall Layout

The foundation of a CNC router is some sort of rigid frame. On top of the frame you attach linear guides which allow your axes to move. You actuate that movement with belts or screws, whose rotation is powered by motors. Those motors are controlled by a pulse generator attached to a gcode intepreter, which gets its commands from a gcode sender. I'll cover all your major options below.

---

# Frame Construction

The frame is the main body of your machine. You should use the most rigid material you are able to work with.

### Wood

![Wooden Frame Router](/images/wooden_frame.jpg "Example Wooden Frame Router")

If you only have access to woodworking equipment, then [wood is your only choice](https://www.youtube.com/watch?v=jjdXpp77MdU). The main advantages of wood are that it is cheap and easy to work with. The main disadvantage is that wood is not rigid enough to resist cutting forces, leading to chatter and low-quality surface finishes. A secondary concern is that wood is very dimensionally unstable, easily fluctuating with temperature and humidity changes.

If you never intend to cut any material harder than wood and you are comfortable never achieving tight tolerances or repeatable dimensions, a wooden frame can be a very economical choice. If you are primarily making art pieces rather than functional mechanical parts subject to tolerances, this might be a good choice for you.

### Metal tube with 3D Printed Joints

![Mostly Printed CNC](/images/mpcnc.jpg "The Mostly Printed CNC")

The Mostly Printed CNC and [others](https://www.youtube.com/watch?v=Njs0FU6PfPg) like it make use of cheap extruded metal tube to serve as bones and 3D printed parts to serve as joints. Many of these designs don't require metalworking skills of any kind except to cut metal tubes to length. Given the ubiquity of 3D printers nowadays, these designs are extremely accessible, maybe moreso than wooden designs.

Their primary weakness is that 3D printed parts aren't very rigid, so the precision, repeatability, and surface finish of parts created on these machines is limited. Another common weakness in these designs is to use the extruded metal surface as the linear guide. Extruded metal is not a precision surface so any surface imperfections in the metal will translate to imperfections in the finished work. This limits the usefulness to hobby and art projects.

I should mention that "low-precision" for a CNC router might mean give or take 30 thousandths of an inch. If you are a woodworker used to table saws and pencil-drawn lines, tolerances that tight are fantastic and either a wooden frame or mostly printed frame will likely exceed your needs.

### Extruded Aluminum aka 8020

![Avid CNC](/images/avidcnc.jpg "Avid CNC")

A very popular choice for router frames is aluminum 8020. The extruded profiles can be ordered in many dimensions and some providers like [Misumi](https://us.misumi-ec.com/vona2/mech/M1500000000/M1501000000/M1501010000/?searchFlow=results2category&KWSearch=Aluminum%20extrusions) will not only cut them to length for you, they will drill and countersink holes, they will tap ends, and perform many other operations for you right in their factory.

The ease of working with 8020 cannot be overstated. If you have a miter saw you can easily cut it to length yourself to produce whatever design you like. The main advantages are that you get the rigidity of metal-on-metal joints and the infinite reworkability of a lego set without the difficulty of more traditional metalworking.

Some providers can even mill precision surfaces onto your extrusion, allowing it to play double duty as a structural member and a linear guide.

The main disadvantages of 8020 are that it is more costly than extruded aluminum tube and that it isn't as rigid as steel. Still, it is a very popular choice because it is the cheapest, easiest way to produce a machine capable of hitting tolerances and producing great surface finishes.

### Steel Beams

![Steel Frame Router](/images/steel_frame_router.png "Steel Frame Router")

A Steel frame is a fantastic choice for its high mass and high rigidity. The biggest downsides are that metalworking requires tools that many hobbyists don't have access to.

But if you're comfortable cutting, welding, and powder coating steel then you should probably go ahead and build the frame out of steel. Some large surfaces will need to be milled flat to hold linear guides, so make sure you plan everything out before you start welding.

With a steel frame you can hit tight tolerances and cut almost any material, or at least your limitations won't have anything to do with the frame. See This Old Tony's excellent steel-framed CNC router build [here](https://www.youtube.com/watch?v=K9UA9ZRFwWU)

---

# Linear Guides

The role of the linear guide is to constrain movement onto a single axis, preventing any unwanted rotation or deflection. These are often some of the most expensive parts on a CNC router.

but most CNC routers use much lighter duty linear guides because they are cheaper up front and easier to replace when worn. These typically take one of two forms: supported precision shafts or ground precision rails. The only job of the linear guide is to restrict movement along a translation axis. Your primary concern when choosing linear guides are rigidity and height.

### Box Ways or Dovetail Ways

![Dovetail Ways](/images/dovetail_ways.jpg "Dovetail ways")

Mills and lathes generally use box ways or dovetail ways, which are precision machined surfaces floating over each other on a microscopically thin film of oil, kept tight with a small insert called a gibbs. When maintained properly with oil, ways [do not wear whatsoever](https://www.youtube.com/watch?v=cwdoUjynpEk&t=125) and will literally last longer than every other part of the machine.

Ways have the advantage of a huge contact area, allowing vibrations to couple very effectively across the linear guide. This allows vibrational energy to spread out through the entire machine body where it is can be dampened effectively in one part or another.

They carry the secondary advantage of being extremely massive, which helps reduce the amplitude of vibrations. Ways are the most rigid linear guides available. In mills or lathes the ways can be ground directly into the body of the machine, reducing assembly complexity and part count.

Despite all these advantages they are almost never incorporated into CNC routers because they are too expensive per unit length, their large mass makes them unweildy, and their wear patterns are not a good match for computer controlled machining.

The issue with wear is that if a small problem does develop on the ways, it can quickly cascade into a serious issue that causes further damage. Repairing ways, especially in situ, is a tremendously tedious and therefore expensive process. A human machinist is likely to notice such problems developing on a manual mill, but the computer operatoring a CNC mill will not notice.

In contrast all following linear guides are cheap and easy to replace when worn.

### Supported Shafts

![Supported Shaft linear guides](/images/supported_shafts.png "Supported Shafts")

Supported shafts are precision ground steel with aluminum support structure underneath that allows you to fix the shaft firmly to the frame of the CNC machine. The linear bearings that run on the shaft are free to rotate about 20 degrees back and forth on the long axis of the shaft, meaning they actually offer two distinct degrees of freedom, one of which must be further constrained by some other aspect of your design. The bearings are usually easy to remove and replace.

These shafts introduce a lot of separation between the fixed surface and the moving surface, giving you space to put lead screws, run wires, or access the back side of the movable part.

### Ground Rails

![Ground Rail linear guides](/images/linear_rails.png "Ground Rails")

Precision ground linear rails are much lower profile than supported shafts. Their short height allows you to produce a much more compact design which can be good for rigidity, but the lack of space can make it difficult to fit a lead screw.

Also if you get this type of rail, be very careful **never** to remove the slides from the rail. The ball bearings inside will fall out and get everywhere. They are difficult to put back inside if you can even find them all.


### Unsupported Shafts

![Unsupported linear shafts](/images/unsupported_shaft.png "Unsupported Shaft")

Very cheap, low-quality builds will use unsupported linear shafts which are held only at two points. This is a [terrible idea](http://www.mycncuk.com/threads/4356-Why-not-use-unsupported-rails) because the deflection for a given force is several orders of magnitude larger, leading to very low precision and lots of chatter, which leads to poor surface finish, slower cutting speeds, and shorter tool lifetime.

This solution works for laser cutters and 3D printers where tool forces are negligible, but this approach is inadequate for a CNC router. Despite the drawbacks, many cheap designs still use this type of linear guide. Avoid this if at all possible.

---

# Linear Actuation

The job of the linear actuator is to turn rotational movement into linear movement in order to propel the axes along their linear guides. Your main concerns are backlash, price, maximum length, backdrivability, and mechanical reduction. Secondary concerns might include resistence to wear, dust, and vibration.

### Belt Drives

![Belt Drive](/images/belt_drive.png "A Typical Belt Drive")

Belt Drives are extremely inexpensive, lightweight, and their cost is not dependent on the length you want to actuate. Very cheap ones do have a tiny amount of give under load and they may stretch a little over time, but not over the course of a single job and not if you buy from a reputable source.

Some designs feature a fixed motor with a moving belt that shuttles a linear stage back and forth. This can lead to belt flapping or bouncing unless you find a way to dampen belt vibrations.

An alternative approach is to use a fixed belt with your motor on the moving stage, as seen on the popular [Shapeoko](https://carbide3d.com/shapeoko/) router. This allows you to trade a belt-bouncing problem for a cable routing problem, to power the moving motor.

Backlash can be a problem with belts if your pully and belt teeth don't mesh perfectly. Another problem with belts is that there is no mechanical reduction between the motor and the gear that moves the belt. This is great for high-speed applications but can cause torque problems, inviting chatter and the possibility of missing steps.

### Rack and Pinion

![Rack and Pinion](/images/rack_and_pinion.jpg "Example Rack and Pinion")

The primary advantage of a Rack and Pinion system is that extremely long lengths can be achieved. If you need >8 feet of travel, R&P is the way to go. These systems are typically geared very aggressively to be able to travel long distances quickly with some sacrifice in spatial resolution.

Like belt drives, R&P systems are easily backdrivable which can be good for manually moving the X and Y axes around. However, the Z axis of a CNC must not be backdrivable to prevent the spindle from falling into the bed when power is turned off.

### Lead Screws/Acme Screws

![Lead Screw](/images/lead_screw.jpg "Example lead screw")

Lead screws are commonly found in manual mills and lathes for their superior load carrying ability. Lead screws are inexpensive, wear predictably, can be easily replaced, and offer low friction movement.

The main drawback of a lead screw is backlash. Most lead screw systems have substantial backlash that cannot be uniformly compensated for in CNC software. Some software packages do offer "backlash compensation" which does its best and in some situations performs perfectly, but the problem is not solvable in the general sense.

There are also special nuts that can be preloaded with tension to reduce backlash. This introduces a tradeoff between friction and backlash which can be effective in practice, but requires tuning.

For backlash reasons alone, lead screws are not generally used on high quality CNC routers. The one exception is the Z axes, where the mass of the spindle pushing down on the lead screw can offer sufficient preload to eliminate backlash. If you go this route be mindful of using down-cut spiral bits, which impart force upwards against the spindle.

### Ball Screws

![Ball Screw](/images/ball_screw.jpg "Example ball screw")

Ball screws look a lot like lead screws but they are better. Their thread profile is specially matched to the recirculating ball bearings in the nut so there is no friction, no wear, and no backlash. Many high quality CNC routers use ball screws because they offer fantastic performance, even if they are much more expensive than other options.

Their fundamental drawbacks, shared with lead screws, are that longer shafts can lead to vibration issues (screw whip) if spun too quickly. This limits the useful maximum length of ball screws and lead screws to about 4 feet.  For any length less than that, ball screws are the most expensive and performant choice. For anything longer than that, belts or R&P start to function better.

A primary concern with lead screws and ball screws is that neither solution is backdrivable so when the power is turned off the axis is still effectively locked in place. For big heavy equipment this can be a great safety feature. For small hobby machines this can sometimes prove annoying.

Lead screws and ball screws also offer built-in mechanical reduction. A single rotation of the shaft might move the axis as little as 1mm or as much as 30mm depending on the purpose of the shaft. A typical value for hobby grade machines is 5mm/turn. This limits the maximum travel speed of the machine, but that is usually not a primary concern unless you are working in a job shop where time is money. The mechanical reduction buys you spatial resolution.

### Threaded Rod

![Threaded Rod](/images/threaded_rod.jpg "Example Threaded Rod")

It is tempting to use threaded rod, aka "all-thread", or even just a big bolt with a nut on it to produce linear motion. This approach is much cheaper and after all, it looks a lot like the lead screw doesn't it? But **do not fall into this trap.** The two systems are nothing alike.

The thread profile on a lead screw is trapezoidal, the thread pitch is aggressive, and the surface finish is smooth. A lead screw is **designed** to transmit linear motion via rotation.

The thread profile on threaded rod is triangular, the thread pitch is comparatively fine, and the surface finish is rough. A threaded rod is **designed** to lock nuts into place and keep them there via friction.

If you go down this path you are going to have a bad time.

---

# Motors

Motors turn electrical power into the mechanical rotation which powers the lead screws. In practice there are only two practical choies.

### Stepper Motors

Far and away the most popular option, stepper motors have multiple sets of wires (motor poles) that you energize in a particular pattern in order to *step* the motor by some small angular increment like .9 degrees. The logic to control this is trivial to implement on an Arduino, but the power required is often far too high for an Arduino to source, so you can use an H-bridge per

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

---

# Axis Arrangement

When 2020 began, my theme for the year was to learn how to design and produce physical objects and mechanical systems. When lockdown began I decided to learn these skills by designing and building my own 3-axis CNC router.

I started by looking at routers I could buy, comparing overall layouts and high-level design choices. Cheap little routers like the [3018](https://www.banggood.com/3018-3-Axis-Mini-DIY-CNC-Router-Standard-Spindle-Motor-Wood-Engraving-Machine-Milling-Engraver-p-1274569.html) are well liked and affordable but they come with serious limitations--namely small working volume and low rigidity which lead to slow cutting speed and limited ability to cut materials harder than wood. Usually these machines are underpowered and some come with sketchy software.

![A typical 3018 import router from China](/images/3018.png "3018 CNC Router")

This style of router has a fixed gantry where the work piece slides back and forth on a moving table.

Larger, [more expensive](https://www.toolots.com/6040.html?cid=10311468392) CNC routers tend to leave the work piece fixed and use a sliding gantry instead.

![A typical 6040 import router from China](/images/6040.png "6040 CNC Router")

I opted to go with a scaled up version of the 3018 layout because I thought I could build a stiffer frame that way.

