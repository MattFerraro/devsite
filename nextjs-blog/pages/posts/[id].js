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
import katex, { render } from "katex"
import { OrbitControls } from '../../lib/OrbitControls';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DSprite } from '../../lib/CSS3DRenderer';
import React, { useEffect, useState } from 'react'

import Image from 'next/image'

const headLength = 0.15
const headWidth = 0.08
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
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypePrism]
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
      const material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide, transparent: true, opacity: .2 } );
      const mesh = new THREE.Mesh( geometry, material );
      scene.add(mesh)
    } else if (childAttrs.class.value === "Latex") {
      const root = new THREE.Vector3(...childAttrs.root.value.split(",").map(parseFloat)).multiplyScalar(arbitraryScaling)
      const msg = childAttrs.msg.value;
      const element = document.createElement( 'div' );

      element.style.width = 100 + 'px'
      element.style.height = 100 + 'px'
      element.style.verticalAlign = "middle"
      element.style.lineHeight = "100px"
      // element.style.opacity = 0.55
      element.style.textAlign = 'center'
      // element.style.background = "blue"

      // console.log("msg", msg)
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
        <canvas className="Vis3D-WebGL" width={props.width} height={props.height} style={{backgroundColor: "#EEE", position: 'absolute'}}></canvas>
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

const Latex = (props) => {
  return <div className="Latex" {...props}></div>
}

// const MDXComponents = ;

const initialize3D = (vis3DContainer) => {
  const webGLCanvas = vis3DContainer.children[0]
  const cssDiv = vis3DContainer.children[1]

  const attrs = vis3DContainer.attributes;
  console.log("attrs", attrs)

  const wholeArticle = document.getElementsByTagName("article")[0]
  const width = wholeArticle.offsetWidth
  const height = width * 9/16
  vis3DContainer.style.width = width + "px"
  vis3DContainer.style.height = height + "px"
  
  const scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xEEEEEE )
  const camera = new THREE.PerspectiveCamera( 25, width / height, 0.1, 4000 )
  camera.up = new THREE.Vector3(0, 0, 1)
  const renderer = new THREE.WebGLRenderer({canvas:webGLCanvas, antialias: true, powerPreference:"low-power"});

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

  return {renderer, renderer2, scene, scene2, camera, updater};
}

const onWindowResize = (renderPackages) => {
  const wholeArticle = document.getElementsByTagName("article")[0]
  const width = wholeArticle.offsetWidth
  const height = width * 9/16

  const webGLCanvases = document.querySelectorAll('.Vis3D-WebGL')
  const cssDivs = document.querySelectorAll('.Vis3D-CSS')
  const vis3Ds = document.querySelectorAll('.Vis3D-container')

  for (let div of cssDivs) {
    console.log("A css div", div)
    div.style.width = width + "px"
    div.style.height = height + "px"
  }
  for (let canv of webGLCanvases) {
    console.log("A webGL canvas", canv)
    canv.style.width = width + "px"
    canv.style.height = height + "px"
  }
  for (let vis of vis3Ds) {
    vis.style.width = width + "px"
    vis.style.height = height + "px"
  }
  for (let rp of renderPackages) {
    rp.renderer.setSize(width, height)
    rp.renderer2.setSize(width, height)
  }
}


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
      requestAnimationFrame( animate );
      
      renderPackages.forEach((rpackage) => {
        rpackage.renderer.render( rpackage.scene, rpackage.camera );
        rpackage.renderer2.render( rpackage.scene2, rpackage.camera );
        rpackage.updater()
      })
    }
    animate();

    setIsComponentMounted(true)
  }, [])
  if(!isComponentMounted) {
    return null
  }

  return <div></div>
}

export default function Post({ metadata, mdxSource, imgDims }) {
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
          Latex,
          img: OptimizedImage,
          p: (paragraph) => {
            if (paragraph.children && paragraph.children.props && paragraph.children.props.mdxType) {
              // console.log(paragraph.children.props.src)
              const dims = imgDims[paragraph.children.props.src]
              const ratio = dims.height / dims.width
              console.log(ratio)
              return <Image src={paragraph.children.props.src} alt={paragraph.children.props.alt} width={imageWidth} height={imageWidth * ratio}/>
            }

            return <p>{paragraph.children}</p>;
          },
        }} />

        <Vis3DRealizer></Vis3DRealizer>

      </article>
    </Layout>
  )
}
