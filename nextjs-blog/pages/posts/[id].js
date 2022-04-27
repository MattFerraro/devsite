import Layout from '../../components/layout'
import { getAllPostIds, getPostDataMDX } from '../../lib/posts'
import Head from 'next/head'
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrism from '@mapbox/rehype-prism';
import toc from 'remark-toc'
import slug from 'remark-slug'
import katex, { render } from "katex"
import { OrbitControls } from '../../lib/OrbitControls';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DSprite } from '../../lib/CSS3DRenderer';
import { SVGRenderer } from '../../lib/SVGRenderer';

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

const headLength = 0.05
const headWidth = 0.07
const origin = new THREE.Vector3( 0, 0, 0 )
const xAxis = new THREE.Vector3(1, 0, 0)
const yAxis = new THREE.Vector3(0, 1, 0)
const zAxis = new THREE.Vector3(0, 0, 1)
const xColor = "red"
const yColor = "green"
const zColor = "blue"
const arbitraryScaling = 100
const imageWidth = 612
const imageHeight = imageWidth * 9/16

export async function getStaticProps({ params }) {
  const postData = await getPostDataMDX(params.id)

  const mdxSource = await serialize(postData.rawContent, {
    mdxOptions: {
      remarkPlugins: [remarkMath, slug, [toc, {tight:true}]],
      rehypePlugins: [rehypePrism]
    }
  });

  return {
    props: {
      metadata: postData.metadata,
      mdxSource: mdxSource,
      imgDims: postData.imgDims
    }
  }
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

const OptimizedImage = (props) => {
  return <Image {...props} width={imageWidth} height={imageHeight}/>
};

const renderChild = (child, scene, scene2) => {
  const childAttrs = child.attributes
    if (childAttrs.class.value === "Arrow") {
      const end = new THREE.Vector3(...childAttrs.end.value.split(",").map(parseFloat))
      const begin = new THREE.Vector3(...childAttrs.begin.value.split(",").map(parseFloat))
      const color = childAttrs.color.value
      const diff = end.sub(begin)
      const length = diff.length()
      const dir = diff.normalize()
      scene.add(new THREE.ArrowHelper( dir, begin.multiplyScalar(arbitraryScaling), length * arbitraryScaling, color, headLength*arbitraryScaling, headWidth*arbitraryScaling ))  
    } else if (childAttrs.class.value === "DottedLine") {
      const end = new THREE.Vector3(...childAttrs.end.value.split(",").map(parseFloat)).multiplyScalar(arbitraryScaling)
      const begin = new THREE.Vector3(...childAttrs.begin.value.split(",").map(parseFloat)).multiplyScalar(arbitraryScaling)
      const color = childAttrs.color.value
      
      const material = new THREE.LineDashedMaterial( {
        color: color,
        linewidth: 1,
        scale: 1,
        dashSize: .05 * arbitraryScaling,
        gapSize: .05 * arbitraryScaling,
      } );
      const lineGeometry = new THREE.BufferGeometry().setFromPoints( [begin, end] )
      const line = new THREE.Line( lineGeometry, material );
      line.computeLineDistances()
      scene.add( line );
      
    } else if (childAttrs.class.value === "Triangle") {
      const geometry = new THREE.BufferGeometry();
      const color = childAttrs.color.value
      const opacity = childAttrs.opacity.value
      const vertices = new Float32Array( [
        ...childAttrs.v0.value.split(",").map(parseFloat).map(x => x*arbitraryScaling),
        ...childAttrs.v1.value.split(",").map(parseFloat).map(x => x*arbitraryScaling),
        ...childAttrs.v2.value.split(",").map(parseFloat).map(x => x*arbitraryScaling),
      ] );

      geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
      // const frontMaterial = new THREE.MeshBasicMaterial( { color: color, side: THREE.FrontSide, transparent: true, opacity: opacity } );
      // const mesh = new THREE.Mesh( geometry, frontMaterial );
      // scene.add(mesh)

      // const backMaterial = new THREE.MeshBasicMaterial( { color: color, side: THREE.BackSide, transparent: false } );
      // const mesh2 = new THREE.Mesh( geometry, backMaterial );
      // scene.add(mesh2)

      const material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide, transparent: true, opacity: opacity, depthWrite: false } );
      const mesh3 = new THREE.Mesh( geometry, material );
      scene.add(mesh3)
    } else if (childAttrs.class.value==="Circle") {
      const radius = parseFloat(childAttrs.r.value) * arbitraryScaling
      const geometry = new THREE.CircleGeometry(radius, 52)
      
      const color = childAttrs.color.value
      const opacity = childAttrs.opacity.value
      const material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide, transparent: true, opacity: opacity } );
      const circle = new THREE.Mesh( geometry, material );
      
      if (childAttrs.root && childAttrs.root.value) {
        const root = new THREE.Vector3(...childAttrs.root.value.split(",").map(parseFloat)).multiplyScalar(arbitraryScaling)
        console.log("Okay neat, this one has a root", childAttrs.root.value, root)
        circle.position.x = root.x
        circle.position.y = root.y
        circle.position.z = root.z
      } else {
        console.log("This circle has no root")
      }
      
      

      const xrotation = childAttrs.rotateX.value
      circle.rotateOnWorldAxis(xAxis, xrotation * 3.14159/180)
      
      const yrotation = childAttrs.rotateY.value
      circle.rotateOnWorldAxis(yAxis, yrotation * 3.14159/180)
      
      const zrotation = childAttrs.rotateZ.value
      circle.rotateOnWorldAxis(zAxis, zrotation * 3.14159/180)


      scene.add(circle)
    } else if (childAttrs.class.value === "Latex") {
      const root = new THREE.Vector3(...childAttrs.root.value.split(",").map(parseFloat)).multiplyScalar(arbitraryScaling)
      const msg = childAttrs.msg.value;
      const element = document.createElement( 'div' );

      element.style.width = 150 + 'px'
      element.style.height = 150 + 'px'
      element.style.verticalAlign = "middle"
      element.style.lineHeight = "150px"
      // element.style.opacity = 0.55
      element.style.textAlign = 'center'
      element.classList.add("noselect")
      // element.style.background = "blue"

      
      const simplev = katex.render(msg, element, {
        throwOnError: false
      });

      const object = new CSS3DSprite(element);
      object.position.x = root.x
      object.position.y = root.y
      object.position.z = root.z
      // const object = new CSS3DObject( element );
      // object.position.copy( new THREE.Vector3(0, 1, 0) );
      // object.rotation.copy( new THREE.Euler( 0, 10 * THREE.MathUtils.DEG2RAD, 0 ) );
      scene2.add( object );
    }
}


const Vis3D = (props) => {

  return (
      <div className="Vis3D-container" camera={props.camera} style={{height: props.height + "px", position: 'relative'}}>
        <svg className="Vis3D-SVG" xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" width={props.width} height={props.height} style={{backgroundColor: "#FFF", position: 'absolute'}}></svg>
        <div className="Vis3D-CSS" style={{width: props.width, height: props.height + "px", backgroundColor: "#FFF0", position: 'absolute'}}></div>
        <div className="Vis3D-Elements">
          {props.children}
        </div>
      </div>
  )
}

const Arrow = (props) => {
  return <div className="Arrow" {...props}></div>
}

const DottedLine = (props) => {
  return <div className="DottedLine" {...props}></div>
}

const Triangle = (props) => {
  return <div className="Triangle" {...props}></div>
}

const Circle = (props) => {
  return <div className="Circle" {...props}></div>
}

const Latex = (props) => {
  return <div className="Latex" {...props}></div>
}

const Attribution = (props) => {
  const link = <a href={props.src}>{props.srcName}</a>
  const name = <a href={props.license}>{props.licenseName}</a>
  return <div className="attribution">Image from {link} licensed {name}</div>
}

const AudioControls = (props) => {
  return <div>
    <audio controls>
    <source src={props.src} type="audio/wav"></source>
    Your browser does not support the audio element.
    </audio>
  </div>
}

const AudioControls2 = (props) => {
  return <div className="waveform-container" src={props.src} stereo={props.stereo ? "true" : "false"}>
      <button>Play/Pause</button>
      <button>Zoom Out</button>
      <button>Zoom In</button>
      <button>Zoom WAY In</button>
    </div>
}

const UltimateCircleInverter = (props) => {
  return <canvas className="ultimate-circle-inverter" width={614} height={400} style={{width:614, height: 400, cursor:"crosshair"}} {...props}></canvas>
}

const CircleInverter = (props) => {
  return <canvas className="circle-inverter" width={614} height={400} style={{width:614, height: 400, cursor:"crosshair"}} {...props}></canvas>
}

const ComplexNumberInverter = (props) => {
  return <canvas className="complex-number-inverter" width={614} height={400} style={{width:614, height: 400, cursor:"crosshair"}}></canvas>
}

const initialize3D = (vis3DContainer) => {
  const svgEl = vis3DContainer.children[0]
  const cssDiv = vis3DContainer.children[1]

  const attrs = vis3DContainer.attributes;

  const wholeArticle = document.getElementsByTagName("article")[0]
  const width = wholeArticle.offsetWidth
  const height = width * 9/16
  vis3DContainer.style.width = width + "px"
  vis3DContainer.style.height = height + "px"
  
  const scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xFFFFFF )
  const camera = new THREE.PerspectiveCamera( 25, width / height, 0.1, 4000 )
  camera.up = new THREE.Vector3(0, 0, 1)
  
  const renderer = new SVGRenderer(svgEl)

  const renderer2 = new CSS3DRenderer(cssDiv)
  renderer2.setSize(width, height)
  renderer.setSize(width, height)
  const scene2 = new THREE.Scene()
  
  renderer2.domElement.style.top = 0;

  // Add the axis
  scene.add(new THREE.ArrowHelper( xAxis, origin, 1.0 * arbitraryScaling, xColor, headLength * arbitraryScaling, headWidth*arbitraryScaling ))
  scene.add(new THREE.ArrowHelper( yAxis, origin, 1.0 * arbitraryScaling, yColor, headLength * arbitraryScaling, headWidth*arbitraryScaling ))
  scene.add(new THREE.ArrowHelper( zAxis, origin, 1.0 * arbitraryScaling, zColor, headLength * arbitraryScaling, headWidth*arbitraryScaling ))
  
  // Add any arrows that are called for
  for (let child of vis3DContainer.children[2].children) {
    renderChild(child, scene, scene2)
  }

  const cameraPos = new THREE.Vector3(...attrs.camera.value.split(",").map(parseFloat)).multiplyScalar(arbitraryScaling)
  camera.position.x = cameraPos.x
  camera.position.y = cameraPos.y
  camera.position.z = cameraPos.z

  const controls = new OrbitControls( camera, renderer2.domElement );

  function updater() {
  }

  return {renderer, renderer2, scene, scene2, camera, updater, controls};
}

const onWindowResize = (renderPackages) => {
  const wholeArticle = document.getElementsByTagName("article")[0]
  const width = wholeArticle.offsetWidth
  const height = width * 9/16

  const webGLCanvases = document.querySelectorAll('.Vis3D-WebGL')
  const svgAreas = document.querySelectorAll('.Vis3D-SVG')
  const cssDivs = document.querySelectorAll('.Vis3D-CSS')
  const vis3Ds = document.querySelectorAll('.Vis3D-container')

  for (let div of cssDivs) {
    div.style.width = width + "px"
    div.style.height = height + "px"
  }
  for (let canv of webGLCanvases) {
    canv.style.width = width + "px"
    canv.style.height = height + "px"
  }
  for (let s of svgAreas) {
    s.style.width = width + "px"
    s.style.height = height + "px"
  }
  for (let vis of vis3Ds) {
    vis.style.width = width + "px"
    vis.style.height = height + "px"
  }
  for (let rp of renderPackages) {
    rp.renderer.setSize(width, height)
    rp.renderer2.setSize(width, height)

    rp.renderer.render( rp.scene, rp.camera );
    rp.renderer2.render( rp.scene2, rp.camera );
  }
}

const Katexifier = (props) => {
  const [isComponentMounted, setIsComponentMounted] = useState(false)
  console.log("Rendering Katexifier")
  useEffect(() => {
    console.log("Doing the katex stuff")
    document.querySelectorAll('.math-display').forEach((el) => {
      katex.render(el.innerText, el, {displayMode: true})
    })

    document.querySelectorAll('.math-inline').forEach((el) => {
      katex.render(el.innerText, el)
    })
    
  })
  if(!isComponentMounted) {
    return null
  }

  return <div></div>
}

import dynamic from 'next/dynamic'

const Waveformifier = dynamic(() => import('../../components/waveformifier'), {
    ssr: false
})

const CircleInverterRealizer = dynamic(() => import('../../components/circleinverterrealizer'), {
  ssr: false
})

const DipoleV2 = dynamic(() => import('../../components/dipolev2'), {
  ssr: false
})

const Vis3DRealizer = () => {
  const [isComponentMounted, setIsComponentMounted] = useState(false)
  useEffect(() => {
    const vis3Ds = document.querySelectorAll('.Vis3D-container')
    
    const renderPackages = [];
    vis3Ds.forEach(function(vis3D) {
      const rendererPackage = initialize3D(vis3D);
      renderPackages.push(rendererPackage)
    });

    window.addEventListener( 'resize', () => {onWindowResize(renderPackages)} );

    function animate() {
      // requestAnimationFrame( animate );
      
      renderPackages.forEach((rpackage) => {
        rpackage.renderer.render( rpackage.scene, rpackage.camera );
        rpackage.renderer2.render( rpackage.scene2, rpackage.camera );
        rpackage.updater()
      })
    }
    animate();

    renderPackages.forEach((rpackage) => {
      rpackage.controls.addEventListener('change', (e) => {
        rpackage.renderer.render( rpackage.scene, rpackage.camera );
        rpackage.renderer2.render( rpackage.scene2, rpackage.camera );
        // rpackage.updater()
      });
    })

    // this.controls.addEventListener('change', this.render.bind(this));

    // setIsComponentMounted(true)
  })
  if(!isComponentMounted) {
    return null
  }

  return <div></div>
}

export default function Post({ metadata, mdxSource, imgDims }) {
  let imgCount = 0
  return (
    <Layout>
      <Head>
        <title>{metadata.title}</title>
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={metadata.teaserImage}/>
        <meta name="twitter:site:id" content="@mferraro89" />
        <meta name="twitter:creator:id" content="@mferraro89" />
        <meta property="twitter:title" content={metadata.title} />
        <meta property="twitter:description" content={metadata.teaser} />

        <meta property="og:title" content={metadata.title} />
        <meta property="og:image" content={metadata.teaserImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:description" content={metadata.teaser} />
        <meta name="description" content={metadata.teaser} />
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{metadata.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={metadata.date} />
        </div>
          
        
        <MDXRemote {...mdxSource} components={{
          Vis3D,
          Arrow,
          DottedLine,
          Triangle,
          Circle,
          Latex,
          Attribution,
          AudioControls,
          AudioControls2,
          CircleInverter,
          UltimateCircleInverter,
          ComplexNumberInverter,
          DipoleV2,
          img: OptimizedImage,
          p: (paragraph) => {

            if (paragraph.children && paragraph.children.props && paragraph.children.props.mdxType && paragraph.children.props.mdxType === 'img') {
              const src = paragraph.children.props.src
              
              const childProps = paragraph.children.props

              if (src.endsWith(".mp4")) {
                return <video width="100%" height="auto" autoPlay muted controls loop><source src={src} type="video/mp4"></source></video>
              }
              
              const dims = imgDims[paragraph.children.props.src]
              
              const ratio = dims.height / dims.width
              const quality = 90
              imgCount += 1
              if (imgCount < 5) {
                if (childProps.title && childProps.title === "dno") {
                  return <Image priority={true} unoptimized={true} src={paragraph.children.props.src} alt={paragraph.children.props.alt} width={imageWidth} height={imageWidth * ratio}/>
                } else{
                  return <Image priority={true} quality={quality} src={paragraph.children.props.src} alt={paragraph.children.props.alt} width={imageWidth} height={imageWidth * ratio}/>
                }
              } else {
                if (childProps.title && childProps.title === "dno") {
                  return <Image unoptimized={true} src={paragraph.children.props.src} alt={paragraph.children.props.alt} width={imageWidth} height={imageWidth * ratio}/>
                } else{
                  return <Image quality={quality} src={paragraph.children.props.src} alt={paragraph.children.props.alt} width={imageWidth} height={imageWidth * ratio}/>
                }
              }

            } else {
              return <p>{paragraph.children}</p>
            }
          } 
        }} scope={{
          "ax": .5, "ay": .5, "az": .8,
          "acolor": "orange",
          "bx": .5, "by": .5, "bz": 0,
          "bcolor": "purple",
          "cx": -.3, "cy": .5, "cz": 0,
          "ccolor": "aqua"
        }} />

        <Vis3DRealizer></Vis3DRealizer>
        <Katexifier></Katexifier>
        <Waveformifier></Waveformifier>
        <CircleInverterRealizer></CircleInverterRealizer>

      </article>
    </Layout>
  )
}
