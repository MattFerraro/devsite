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
  return <canvas className="Vis3D" width={props.width} height={props.height} style={{backgroundColor: "lightgray", width:props.width, height:props.height}}>{props.children}</canvas>
}

const Arrow = (props) => {
  return <div className="Arrow" {...props}></div>
}

const MDXComponents = {
  styledDiv,
  Vis3D,
  Arrow
};

const initialize3D = (vis3D) => {
  const attrs = vis3D.attributes;
  const width = parseInt(attrs.width.value.replace("px", ""))
  const height = parseInt(attrs.height.value.replace("px", ""))
  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xEEEEEE );
  const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
  const renderer = new THREE.WebGLRenderer({canvas:vis3D, antialias:true});

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
  scene.add(new THREE.ArrowHelper( new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 0, 0 ), 1.0, 0xff0000, 0.15, 0.08 ))
  scene.add(new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 1.0, 0x00ff00, 0.15, 0.08 ))
  scene.add(new THREE.ArrowHelper( new THREE.Vector3( 0, 0, 1 ), new THREE.Vector3( 0, 0, 0 ), 1.0, 0x0000ff, 0.15, 0.08 ))
  

  // Add any arrows that are called for
  for (let child of vis3D.children) {
    const childAttrs = child.attributes
    let end = childAttrs.end.value.split(",").map(parseFloat)
    let begin = childAttrs.begin.value.split(",").map(parseFloat)
    let color = childAttrs.color.value
    let dir = new THREE.Vector3(end[0] - begin[0], end[1] - begin[1], end[2] - begin[2])

    scene.add(new THREE.ArrowHelper( dir, new THREE.Vector3( ...begin ), 1.0, color, 0.15, 0.08 ))
  }


  camera.position.z = 2;
  camera.position.x = .5;
  camera.position.y = 0.5;

  renderer.setSize( width, height );

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
