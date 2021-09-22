import Layout from '../../components/layout'
import { getAllPostIds, getPostDataMDX } from '../../lib/posts'
import Head from 'next/head'
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
// import { MDXProvider } from '@mdx-js/react'
// import SimpleExample from '../posts/simple-test.mdx'
// import SimpleExample from '../../posts/simple-test.mdx'
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { OrbitControls } from '../../lib/OrbitControls';

import * as THREE from 'three';

import React, { useEffect, useState } from 'react'


export async function getStaticProps({ params }) {
  const postData = await getPostDataMDX(params.id)

  const mdxSource = await serialize(postData.rawContent, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    }
  });

  return {
    props: {
      metadata: postData.metadata,
      mdxSource: mdxSource
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

const styledDiv = (props) => {
  return <div style={{ color: props.color }}>{props.children}</div>
};

const Vis3D = (props) => {
  console.log("VIS3D PROPS")
  console.log(props.width, props.height)
  return <canvas className="Vis3D" width={props.width} height={props.height} style={{backgroundColor: "lightgray"}}>{props.children}</canvas>
}

const Arrow = (props) => {
  return <div className="Arrow" {...props}></div>
}

const DottedLine = (props) => {
  return <div className="DottedLine" {...props}></div>
}

const MDXComponents = {
  styledDiv,
  Vis3D,
  Arrow,
  DottedLine,
};

const initialize3D = (vis3D) => {
  const attrs = vis3D.attributes;
  
  const wholeArticle = document.getElementsByTagName("article")[0]
  const width = wholeArticle.offsetWidth
  const height = width * 9/16

  console.log("from article", width, height)
  vis3D.width = width
  vis3D.height = height
  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xEEEEEE );
  const camera = new THREE.PerspectiveCamera( 25, width / height, 0.1, 1000 );
  camera.up = new THREE.Vector3(0, 0, 1)
  const renderer = new THREE.WebGLRenderer({canvas:vis3D, antialias:true, powerPreference:"low-power"});

  // function drawLine(color, start, end) {
  //   const lineMaterial = new THREE.LineBasicMaterial( { color: color } );
  //   const points = [];
  //   points.push( start );
  //   points.push( end );
  //   const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
  //   const line = new THREE.Line( lineGeometry, lineMaterial );
  //   scene.add( line );
  // }

  // Add the axis
  const headLength = 0.15
  const headWidth = 0.08
  const origin = new THREE.Vector3( 0, 0, 0 )
  const xAxis = new THREE.Vector3(1, 0, 0)
  const yAxis = new THREE.Vector3(0, 1, 0)
  const zAxis = new THREE.Vector3(0, 0, 1)
  const xColor = "red"
  const yColor = "green"
  const zColor = "blue"
  scene.add(new THREE.ArrowHelper( xAxis, origin, 1.0, xColor, headLength, headWidth ))
  scene.add(new THREE.ArrowHelper( yAxis, origin, 1.0, yColor, headLength, headWidth ))
  scene.add(new THREE.ArrowHelper( zAxis, origin, 1.0, zColor, headLength, headWidth ))
  

  // Add any arrows that are called for
  for (let child of vis3D.children) {
    const childAttrs = child.attributes
    console.log(childAttrs)
    console.log(childAttrs.class)
    if (childAttrs.class.value === "Arrow") {
      const end = new THREE.Vector3(...childAttrs.end.value.split(",").map(parseFloat))
      const begin = new THREE.Vector3(...childAttrs.begin.value.split(",").map(parseFloat))
      const color = childAttrs.color.value
      const diff = end.sub(begin)
      const length = diff.length()
      const dir = diff.normalize()
      scene.add(new THREE.ArrowHelper( dir, begin, length, color, headLength, headWidth ))  
    } else if (childAttrs.class.value === "DottedLine") {
      const end = new THREE.Vector3(...childAttrs.end.value.split(",").map(parseFloat))
      const begin = new THREE.Vector3(...childAttrs.begin.value.split(",").map(parseFloat))
      const color = childAttrs.color.value
      
      // const lineMaterial = new THREE.LineBasicMaterial( { color: color } )
      const material = new THREE.LineDashedMaterial( {
        color: color,
        linewidth: 1,
        scale: 2,
        dashSize: .1,
        gapSize: .1,
      } );
      const lineGeometry = new THREE.BufferGeometry().setFromPoints( [begin, end] )
      const line = new THREE.Line( lineGeometry, material );
      line.computeLineDistances()
      scene.add( line );
      
      
      // const diff = end.sub(begin)
      // const length = diff.length()
      // const dir = diff.normalize()
      // scene.add(new THREE.ArrowHelper( dir, begin, length, "red", headLength, headWidth ))
    }
  }

  const scale = 2.5
  camera.position.x = 2 * scale;
  camera.position.y = 1 * scale;
  camera.position.z = 1 * scale;

  const controls = new OrbitControls( camera, renderer.domElement );

  function updater() {
  }

  return {renderer, scene, camera, updater};
}



const Vis3DRealizer = () => {
  const [isComponentMounted, setIsComponentMounted] = useState(false)
  useEffect(() => {
    const vis3Ds = document.querySelectorAll('.Vis3D')
    
    const renderPackages = [];
    vis3Ds.forEach(function(vis3D) {
      const rendererPackage = initialize3D(vis3D);
      renderPackages.push(rendererPackage)
    });

    function animate() {
      requestAnimationFrame( animate );
      
      renderPackages.forEach((rpackage) => {
        rpackage.renderer.render( rpackage.scene, rpackage.camera );
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

export default function Post({ metadata, mdxSource }) {
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
          
        <MDXRemote {...mdxSource} components={MDXComponents} />

        <Vis3DRealizer></Vis3DRealizer>

      </article>
    </Layout>
  )
}
