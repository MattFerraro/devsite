---
title: 'Anatomy of a CNC Router'
date: '2020-01-08'
---

![My Homemade CNC Router](/images/my_router.jpg "My Homemade CNC Router")

This is the encyclopedic blog post I wish I could have read when I started designing my CNC router

I'll cover all the components and some of the design considerations you'll need to keep in mind when desiging your own CNC router.

# Table of Contents

# Overall Layout

The foundation of a CNC router is some sort of rigid frame. On top of the frame you attach linear guides which allow your axes to move. You actuate that movement with belts or screws, whose rotation is powered by motors. Those motors are controlled by a pulse generator attached to a gcode intepreter, which gets its commands from a gcode sender. I'll cover all your major options below.

---

# Frame Construction

The frame is the main body of your machine. You should use the most rigid material you are able to work with.

## Wood

![Wooden Frame Router](/images/wooden_frame.jpg "Example Wooden Frame Router")

If you only have access to woodworking equipment, then [wood is your only choice](https://www.youtube.com/watch?v=jjdXpp77MdU). The main advantages of wood are that it is cheap and easy to work with. The main disadvantage is that wood is not rigid enough to resist cutting forces, leading to chatter and low-quality surface finishes. A secondary concern is that wood is very dimensionally unstable, easily fluctuating with temperature and humidity changes.

If you never intend to cut any material harder than wood and you are comfortable never achieving tight tolerances or repeatable dimensions, a wooden frame can be a very economical choice. If you are primarily making art pieces rather than functional mechanical parts subject to tolerances, this might be a good choice for you.

## Metal tube with 3D Printed Joints

![Mostly Printed CNC](/images/mpcnc.jpg "The Mostly Printed CNC")

The Mostly Printed CNC and [others](https://www.youtube.com/watch?v=Njs0FU6PfPg) like it make use of cheap extruded metal tube to serve as bones and 3D printed parts to serve as joints. Many of these designs don't require metalworking skills of any kind except to cut metal tubes to length. Given the ubiquity of 3D printers nowadays, these designs are extremely accessible, maybe moreso than wooden designs.

Their primary weakness is that 3D printed parts aren't very rigid, so the precision, repeatability, and surface finish of parts created on these machines is limited. Another common weakness in these designs is to use the extruded metal surface as the linear guide. Extruded metal is not a precision surface so any surface imperfections in the metal will translate to imperfections in the finished work. This limits the usefulness to hobby and art projects.

I should mention that "low-precision" for a CNC router might mean give or take 30 thousandths of an inch. If you are a woodworker used to table saws and pencil-drawn lines, tolerances that tight are fantastic and either a wooden frame or mostly printed frame will likely exceed your needs.

## Extruded Aluminum aka 8020

![Avid CNC](/images/avidcnc.jpg "Avid CNC")

A very popular choice for router frames is aluminum 8020. The extruded profiles can be ordered in many dimensions and some providers like [Misumi](https://us.misumi-ec.com/vona2/mech/M1500000000/M1501000000/M1501010000/?searchFlow=results2category&KWSearch=Aluminum%20extrusions) will not only cut them to length for you, they will drill and countersink holes, they will tap ends, and perform many other operations for you right in their factory.

The ease of working with 8020 cannot be overstated. If you have a miter saw you can easily cut it to length yourself to produce whatever design you like. The main advantages are that you get the rigidity of metal-on-metal joints and the infinite reworkability of a lego set without the difficulty of more traditional metalworking.

Some providers can even mill precision surfaces onto your extrusion, allowing it to play double duty as a structural member and a linear guide.

The main disadvantages of 8020 are that it is more costly than extruded aluminum tube and that it isn't as rigid as steel. Still, it is a very popular choice because it is the cheapest, easiest way to produce a machine capable of hitting tolerances and producing great surface finishes.

## Steel Beams

![Steel Frame Router](/images/steel_frame_router.png "Steel Frame Router")

A Steel frame is a fantastic choice for its high mass and high rigidity. The biggest downsides are that metalworking requires tools that many hobbyists don't have access to.

If you are comfortable cutting, welding, and powder coating steel then you should probably go ahead and build the frame out of steel. Some large surfaces will need to be milled flat to hold linear guides, so make sure you plan everything out before you start welding.

With a steel frame you can hit tight tolerances and cut almost any material. Your machine's primary limitation won't be its frame. See This Old Tony's excellent steel-framed CNC router build [here](https://www.youtube.com/watch?v=K9UA9ZRFwWU)

---

# Linear Guides

The role of the linear guide is to constrain movement onto a single axis, preventing any unwanted rotation or deflection. These are often some of the most expensive parts on a CNC router.

## Box Ways or Dovetail Ways

![Dovetail Ways](/images/dovetail_ways.jpg "Dovetail ways")

Mills and lathes generally use box ways or dovetail ways, which are precision machined surfaces floating over each other on a microscopically thin film of oil, kept tight with a small insert called a gibbs. When kept clean of damaging debris and maintained properly with oil, ways [do not wear whatsoever](https://www.youtube.com/watch?v=cwdoUjynpEk&t=125) and will last longer than every other part of the machine.

Ways have the advantage of a huge contact area, allowing vibrations to couple very effectively across the linear guide and into the frame. This allows vibrational energy to spread out through the entire machine body where it can be dampened effectively.

They carry the secondary advantage of being extremely massive, which helps reduce the amplitude of vibrations. Ways are the most rigid linear guides available. In mills or lathes the ways can be ground directly into the body of the machine, reducing assembly complexity and part count.

Despite all these advantages they are almost never incorporated into CNC routers because they are too expensive per unit length, their large mass makes them unweildy, and their wear patterns are not a good match for computer controlled machining.

The issue with wear is that if a small problem does develop on the ways, it can quickly cascade into a serious issue that causes further damage. Repairing ways, especially in situ, is a tremendously tedious and therefore expensive process. A human machinist is likely to notice such problems developing on a manual mill, but the computer operatoring a CNC mill will not notice.

In contrast all following linear guides are cheap and easy to replace when worn.

## Supported Shafts

![Supported Shaft linear guides](/images/supported_shafts.png "Supported Shafts")

Supported shafts are precision ground steel with aluminum support structure underneath that allows you to fix the shaft firmly to the frame of the CNC machine. The linear bearings that run on the shaft are free to rotate about 20 degrees back and forth on the long axis of the shaft, meaning they actually offer two distinct degrees of freedom, one of which must be further constrained by some other aspect of your design. The bearings are usually easy to remove and replace.

These shafts introduce a lot of separation between the fixed surface and the moving surface, giving you space to put lead screws, run wires, or access the back side of the movable part.

## Ground Rails

![Ground Rail linear guides](/images/linear_rails.png "Ground Rails")

Precision ground linear rails are much lower profile than supported shafts. Their short height allows you to produce a much more compact design which can be good for rigidity, but the lack of space can make it difficult to fit a lead screw.

Also if you get this type of rail, be very careful **never** to remove the slides from the rail. The ball bearings inside will fall out and get everywhere. They are difficult to put back inside if you can even find them all.


## Unsupported Shafts

![Unsupported linear shafts](/images/unsupported_shaft.png "Unsupported Shaft")

Very cheap, low-quality builds will use unsupported linear shafts which are held only at two points. This is a [terrible idea](http://www.mycncuk.com/threads/4356-Why-not-use-unsupported-rails) because the deflection for a given force is several orders of magnitude larger, leading to very low precision and lots of chatter, which leads to poor surface finish, slower cutting speeds, and shorter tool lifetime.

This solution works for laser cutters and 3D printers where tool forces are negligible, but this approach is inadequate for a CNC router. Despite the drawbacks, many cheap designs still use this type of linear guide. Avoid this if at all possible.

---

# Linear Actuation

The job of the linear actuator is to turn rotational movement into linear movement in order to propel the axes along their linear guides. Your main concerns are backlash, price, maximum length, backdrivability, and mechanical reduction. Secondary concerns might include resistence to wear, dust, and vibration.

## Belt Drives

![Belt Drive](/images/belt_drive.png "A Typical Belt Drive")

Belt Drives are extremely inexpensive, lightweight, and their cost is not dependent on the length you want to actuate. Very cheap ones do have a tiny amount of give under load and they may stretch a little over time, but not over the course of a single job.

Some designs feature a fixed motor with a moving belt that shuttles a linear stage back and forth. This can lead to belt flapping or bouncing unless you find a way to dampen belt vibrations.

An alternative approach is to use a fixed belt with your motor on the moving stage, as seen on the popular [Shapeoko](https://carbide3d.com/shapeoko/) router. This allows you to trade a belt-bouncing problem for a cable routing problem, to power the moving motor.

Backlash can be a problem with belts if your pully and belt teeth don't mesh perfectly. Another problem with belts is that there is no mechanical reduction between the motor and the gear that moves the belt. This is great for high-speed applications but can cause torque problems, inviting chatter and the possibility of missing steps.

## Rack and Pinion

![Rack and Pinion](/images/rack_and_pinion.jpg "Example Rack and Pinion")

The primary advantage of a Rack and Pinion system is that extremely long lengths can be achieved. If you need >8 feet of travel, R&P is the way to go. These systems are typically geared very aggressively to be able to travel long distances quickly with some sacrifice in spatial resolution.

Like belt drives, R&P systems are easily backdrivable which can be good for manually moving the X and Y axes around. However, the Z axis of a CNC must not be backdrivable to prevent the spindle from falling into the bed when power is turned off. Do not use a belt drive or a R&P drive on your Z axis.

## Lead Screws/Acme Screws

![Lead Screw](/images/lead_screw.jpg "Example lead screw")

Lead screws are commonly found in manual mills and lathes for their superior load carrying ability. Lead screws are inexpensive, wear predictably, can be easily replaced, and offer low friction movement.

The main drawback of a lead screw is backlash. Most lead screw systems have substantial backlash that cannot be uniformly compensated for in CNC software. Some software packages do offer "backlash compensation" which does its best and in some situations performs perfectly, but the problem is not solvable in the general sense.

There are also special nuts that can be preloaded with tension to reduce backlash. This introduces a tradeoff between friction and backlash which can be effective in practice, but requires tuning.

For backlash reasons alone, lead screws are not generally used on high quality CNC routers. The one exception is the Z axes, where the mass of the spindle pushing down on the lead screw can offer sufficient preload to eliminate backlash. If you go this route be mindful of using down-cut spiral bits, which impart force upwards against the spindle.

## Ball Screws

![Ball Screw](/images/ball_screw.jpg "Example ball screw")

Ball screws look a lot like lead screws but they are better. Their thread profile is specially matched to the recirculating ball bearings in the nut so there is no friction, no wear, and no backlash. Many high quality CNC routers use ball screws because they offer fantastic performance, even if they are much more expensive than other options.

Their fundamental drawbacks, shared with lead screws, are that longer shafts can lead to vibration issues (screw whip) if spun too quickly. This limits the useful maximum length of ball screws and lead screws to about 4 feet.  For any length less than that, ball screws are the most expensive and performant choice. For anything longer than that, belts or R&P start to function better.

A primary concern with lead screws and ball screws is that neither solution is backdrivable so when the power is turned off the axis is still effectively locked in place. For big heavy equipment this can be a great safety feature. For small hobby machines this can sometimes prove annoying.

Lead screws and ball screws also offer built-in mechanical reduction. A single rotation of the shaft might move the axis as little as 1mm or as much as 30mm depending on the purpose of the shaft. A typical value for hobby grade machines is 5mm/turn. This limits the maximum travel speed of the machine, but that is usually not a primary concern unless you are working in a job shop where time is money. The mechanical reduction buys you spatial resolution.

## Threaded Rod

![Threaded Rod](/images/threaded_rod.jpg "Example Threaded Rod")

It is tempting to use threaded rod, aka "all-thread", or even just a big bolt with a nut on it to produce linear motion. This approach is much cheaper and after all, it looks a lot like the lead screw doesn't it? But **do not fall into this trap.** The two systems are nothing alike.

The thread profile on a lead screw is trapezoidal, the thread pitch is aggressive, and the surface finish is smooth. A lead screw is **designed** to transmit linear motion via rotation.

The thread profile on threaded rod is triangular, the thread pitch is comparatively fine, and the surface finish is rough. A threaded rod is **designed** to lock nuts into place and keep them there via friction.

If you go down this path you are going to have a bad time.

---

# Motors

Motors turn electrical power into the mechanical rotation which powers the lead screws. In practice there are two choies.

## Stepper Motors

![Stepper Motors](/images/steppers.jpg "Example Nema23 Stepper Motors")

Far and away the most popular option, stepper motors have multiple sets of wires (motor poles) that you energize in a particular pattern in order to *step* the motor by some small angular increment like 1.8 degrees. The logic to control this is trivial to implement on an Arduino, but the power required is often far too high for an Arduino to source, so you generally buy a motor controller that takes in step and direction pulses, and powers the motor poles directly.

Steppers have high torque at low speed but their torque falls off quickly at high RPM. Consequently it often doesn't make sense to combine a stepper with a gear box reduction. Consider a 10x gear reduction: Your gear box grants a 10x increase in torque but your motor must run at 10x the speed to achieve the same axis speed. But in running 10x faster, your motor may have less that 10x the torque it had at a slow speed. So in the end you have a strictly worse setup than a direct drive system. Besides, gear boxes add friction, noise, and backlash.

A common mistake is to attach a lead screw directly to the shaft of the stepper motor in such a manner that the cutting forces transmitted through the lead screw are borne by the motor itself. This is bad for the motor because the bearings inside are not generally designed to tolerate axial forces and may heat up or become damaged under load. Also, the motor shaft and the motor body may well have axial slop that translates directly into backlash. A properly mounted lead screw or ball screw has bearing blocks on both sides to handle the axial loads. Motors are for radial loads.

One gotcha with steppers is that if your cutting forces even momentarily exceed the torque available, they slip. This is called skipping steps and it means your parts come out with severe defects, usually over every surface of the part machined after the skip. The only solution is to over spec your motors and run them at higher torque than you ever expect your machine to need.

Some stepper motor controllers allow for microstepping, which is a way of artifically splitting the motor steps into finer increments. For example you might see an 8x microstepper so that each motor pulse moves 0.225 degrees instead of the full 1.8 degrees. Microstepping is a mixed bag and it is debatable how much you should apply. More microsteps means finer resolving power, less excitation of natural resonances in your machine, and less noise. But it comes at the expense of lower torque and higher step frequency--two resources that may be at a premium in a home built CNC. Conventional wisdom is to use microstepping as sparingly as possible while still achieving the resolution that you want. For me that means 8x microstepping.

## Servo Motors

![Clearpath Servo](/images/clearpath.png "Some Clearpath Servo Motors")

A servo motor is a complex feedback control system in its own right. It consists of a motor, a measurement system to determine its exact position, and a controller with on board logic that keeps the motor in the exact position specified even when changing external torques try to drive the motor away from its position.

Any type of motor can be used, including DC, AC, or stepper motors. The sensor is usually a digital rotary encoder, but some systems use rotary resolvers or HAL effect sensors. The controller is usually some sort of microcontroller that has configurable gains so you can tune in the response characteristics that you want. Some controllers consist purely of discrete electrical components and may be tuned by moving potentiometers.

Compared to steppers, servo motors are generally much faster, quieter, smoother, and stronger. Their drawbacks are complexity and price. A single servo motor for a single axis of a CNC router might cost $40. A drop in replacement servo motor may cost $400 and require tuning after installation.

That said, servo motors don't skip steps. Even if you do temporarily overwhelm the available torque, the defects on the resulting part will be limited to only the immediate area where the problem occurred.

If you are considering going with servo motors, Teknik Clearpath are considered great value. If you are comfortable choosing your own motors, soldering wires, and programming in python, you should look into buying an [ODrive](https://odriverobotics.com/). With an ODrive controller, you can turn almost any motor into a servo.

Servos can usually be configured to take in the same step/direction pulses that are used to control stepper motors, so that nothing upstream of the motors needs to change if you decide to start with steppers and move to servos later on.

---

# GCode Interpreter and Step Generator

GCode is a command language for CNC machines. A command looks like:

```
G01 X7Y43 F98
```

Which instructs the machine to move linearly to the new X, Y coordinate `(7, 43)` at a speed of 98 inches/min.

GCode commands exist to move around in straight lines and in circular arcs, to start and stop the spindle and coolant, to change spindle speed or change cutting tool, and many other actions. Specialized extensions exist for certain types of machines. For example, 3D printers support commands for heating the print bed, extruding plastic, or waiting for a temperature to be reached.

The GCode interpreter is the tiny computer that sits on your machine awaiting instructions in the form of GCode. As it receives instructions, it performs thousands of computations per second to generate the appropriate step/direction pulses for your stepper motor controllers, causing the actual movement to occur.

## GRBL

![Arduino Uno](/images/arduino.jpg "An Arduino Uno")

For small hobby CNC machines, [GRBL](https://github.com/gnea/grbl/wiki) is the dominant GCode interpeter. It is free to use and runs smoothly on an [Arduino Uno](https://store.arduino.cc/usa/arduino-uno-rev3). It can control up to 3 axes of movement with spare outputs to control your spindle and coolant.

To use GRBL you must configure it so it knows how your machine works. You have to teach it how many steps per inch your motors require, how to stop movement if it hits the end of its ranges, and whether or not certain axes should be inverted. You can choose to operate in metric vs imperial units, what the maximum safe travel speed is, and many other things.

If you don't know where to start, start with GRBL.

## TinyG

![TinyG Board](/images/tinyg.jpg "The TinyG Board")

TinyG is a [high performance](https://github.com/synthetos/TinyG/wiki/What-is-TinyG) version of GRBL that forked away in 2010. It can handle up to 6 axes of control: XYZ translation but also ABC axes of rotation. Its motors and axes are remappable, allowing you more design freedom for how to actuate your axes. It also uses a 3rd order motion planner instead of a 2nd order controller, capping maximum jerk instead of maximum acceleration. This leads to much smoother, quieter operation.

Another huge difference is that you can buy TinyG pre-loaded onto a custom PCB, purpose built with on board motor controllers to be the ideal hardware for running TinyG. It can generate higher frequency stepper pulses for smoother microstepping, and it frees you from having to buy dedicated stepper controllers.

The drawbacks are cost and complexity. GRBL will cost you $25 all-in. A [TinyG board](https://synthetos.myshopify.com/collections/assembled-electronics/products/tinyg) will cost $130. GRBL only requires configuring a few settings. TinyG requires much more configuration. Lastly, the TinyG board has a maximum motor current of 2 amps per motor. This is plenty for most hobby uses but won't cut it for large machines.

TinyG is a great piece of software and hardware that was once cutting edge, but for a new build it has largely been surpassed by its successor, G2Core.

## G2Core

![Arduino Due](/images/due.jpg "An Arduino Due")

G2Core is a fork of TinyG (itself a fork of GRBL) that is meant to run on an Arduino Due [Arduino Due](https://store.arduino.cc/usa/due). It has all the advantages of TinyG software with none of the disadvantages of TinyG hardware.

[G2Core](https://github.com/synthetos/g2) can support up to *nine* machine axes, configurable tool offset, safety interlocks, fifth order motion planning, the works.

The only drawback is complexity. You really need to understand what you're doing before you jump in to G2Core, so it isn't a great choice for your very first 3-axis CNC router. But if you're already comfortable with CNC or you really need the extra axes, G2Core is a fantastic choice.

## Smoothieware

![SmoothieBoard](/images/smoothieboard.jpg)

Smoothieware, the company that develops [Smoothieware](http://smoothieware.org/) the software and Smoothieboard the hardware, tries to support all kinds of machines including 3D printers, laser cutters, CNC routers, CNC lathes, and more. Consequently, Smoothieboards are jam packed full of motor ports, high-power mosfet ports, thermrister ports, everything. The boards are large and [expensive](https://www.robosprout.com/product/smoothieboard-5xc/), but they are a great option if you need a single integrated solution.

A cheaper option is that Smoothieware can also be made to run on lesser hardware furnished by third party vendors. It won't be as well supported, but it can absolutely get you by on the cheap.

Just keep in mind that over generalization can sometimes be frustrating as it prevents the specialization that makes other tools easy to use. If you're setting up your smoothieboard to run your CNC router, there will be loads of settings you need to be sure to ignore because they aren't relevant to your machine.

But some designers want to build a [single machine](https://www.v1engineering.com/specifications/) capable of being a 3D printer, a laser cutter, and a CNC router just by changing out the tool. If that is your goal, Smoothieware is by far the best option.

Another big pro for the Smoothieboard is that their documentation is very [comprehensive](https://smoothieware.github.io/Webif-pack/documentation/web/html/cnc-mill-guide.html). There is a big community of users online, just know that they are mostly in the 3D printer camp.

Lastly, one huge benefit of the Smoothieboard is that it incorporates both the GCode interpreter and the GCode sender all in a single board. This means you have one fewer component to worry about, and makes Smoothieboard overall a very compelling, batteries-included solution.

---

# GCode sender

A GCode sender is responsible for reading gcode lines out of a large file and streaming them down to the GCode interpreter, usually over a USB connection. GCode senders are usually programs that run on regular laptops or raspberry pi's, but it is possible to integrate the GCode sender and GCoder interpreter together on a single board. Senders provide higher-level operations like pausing and resuming a tool path, jogging the cutter around using a pendant, or adjusting the z-height offset when changing to a different tool.

Senders provide you with a user interface of some kind that lets you actuate your CNC machine at a much more intuitive level than at the GCode level.

## Universal GCode Sender

![Universal GCode Sender](/images/ugs.png "A Screenshot of UGS")

A tried and true program, [UGS](https://winder.github.io/ugs_website/) has been a trusted favorite for a long time but it is looking somewhat long in the tooth. It requires quite an old Java runtime in order to function, its UI consumes 100% CPU on my 2018 Macbook Pro, and it looks, well, old.

One benefit of UGS is that it can talk to several different GCode interpreters such as GRBL, G2Core, etc. UGS does technically run on any operating system, but on a mac that means creating an Oracle account, digging through their archives to find a JRE old enough, downloading the huge JRE and then putting up with Java updates for the rest of your life.

If nothing else works for you UGS is a great fallback but I don't recommend it for most users.

## CNCJS

![CNCJS](/images/cncjs.png "Screenshot of CNCJS")

[CNCJS](https://cnc.js.org/) is probably the most beautiful GCode sender available today. It talks to all the major GCode interpreters, runs on any operating system, and most importantly it presents its UI as a web application.

This is staggeringly useful because it means you can run your GCode sender on a cheap raspberry pi which is tethered to your CNC over USB, but you can set up your pi to host the CNCJS web UI globally on your local network. That means you can keep an eye on your CNC's progress, even pausing it or resuming it, from your laptop on the other side of your house.

Before you try anything else, give CNCJS a try. It will likely meet your needs.

## bCNC

![bCNC](/images/bcnc.png "Screenshot of bCNC")

To me, [bCNC](https://github.com/vlachoudis/bCNC) looks pretty ugly. It is written in python and can be easily pip installed. Its super power is that it comes with auto bed levelling that probes a grid of points, applying correction to get you very close to the surface for situations where z height *really* matters. If you are using engraving bits to carve your own PCBs, you should try out bCNC.

## Carbide Motion

![Carbide Motion](/images/carbide_motion.png "Screenshot of Carbide Motion")

By all accounts a decent GCode sender, [Carbide Motion](https://carbide3d.com/carbidemotion/) only works with the Nomad or Shapeoko CNC routers. For a homebuilt router, this is just not an option.

## Smoothieboard

![Smoothieboard Web UI](/images/smoothieboard_ui.png "Screenshot of Smoothieboard Web UI")

As mentioned above, Smoothieboards combine the GCode sender and GCoder interpreter into a single piece of hardware. You can connect a Smoothieboard to the internet with an ethernet cable and it'll host a little web UI you can access from your laptop to control the router.

It's a bit light on features, for example there is no 3D graphical display of your tool path, but it should be sufficient to get the job done.

## Others Not Mentioned

There are loads of Gcode senders I didn't have time to investigate: Easel, Candle, Candle2, Goko, Grbl-Panel, Gcode-sender, OpenCNCPilot, ChiliPeppr and more. I will add reviews as I have time to learn about them.

---

# Spindle

The spindle is the shaft that rotates very fast. It is attached to a big motor on one side and your cutting bit (or a holder that holds your bit) on the other side. For CNC routers, a spindle speed of 10,000-20,000 RPM is standard. For CNC mills, the spindle is generally much slower at 1,000-10,000 RPM, but with significantly more torque.

## Palm Router

By far the most common choice for hobby grade CNC routers, a palm router like the [Makita RT0701C](https://www.amazon.com/Makita-RT0701C-1-1-Compact-Router/dp/B00E7D3V4S/ref=sr_1_1) or [DeWalt DW611](https://www.dewalt.com/products/power-tools/routers-planers-and-joiners/routers/114-hp-max-torque-variable-speed-compact-router/dwp611) is a great starting spindle.

## Air Cooled Spindle

## Water Cooled Spindle

---

# Dust Collection

## Vacuum Boot

## Enclosure

---

# Work Holding

# Interesting examples

## Onefinity

## Shapeoko

## Vulcan Machine Co

---

# Miscellanous Improvements

## Spindle control

## Z Axis probe

---

# Axis Arrangement

When 2020 began, my theme for the year was to learn how to design and produce physical objects and mechanical systems. When lockdown began I decided to learn these skills by designing and building my own 3-axis CNC router.

I started by looking at routers I could buy, comparing overall layouts and high-level design choices. Cheap little routers like the [3018](https://www.banggood.com/3018-3-Axis-Mini-DIY-CNC-Router-Standard-Spindle-Motor-Wood-Engraving-Machine-Milling-Engraver-p-1274569.html) are well liked and affordable but they come with serious limitations--namely small working volume and low rigidity which lead to slow cutting speed and limited ability to cut materials harder than wood. Usually these machines are underpowered and some come with sketchy software.

![A typical 3018 import router from China](/images/3018.png "3018 CNC Router")

This style of router has a fixed gantry where the work piece slides back and forth on a moving table.

Larger, [more expensive](https://www.toolots.com/6040.html?cid=10311468392) CNC routers tend to leave the work piece fixed and use a sliding gantry instead.

![A typical 6040 import router from China](/images/6040.png "6040 CNC Router")

I opted to go with a scaled up version of the 3018 layout because I thought I could build a stiffer frame that way.

