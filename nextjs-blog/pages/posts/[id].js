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
  // const scene = new THREE.Scene();
  // const camera = new THREE.PerspectiveCamera( 75, props.width / props.height, 0.1, 1000 );
  // const renderer = new THREE.WebGLRenderer();
  // renderer.setSize( props.width, props.height );
  
  return <div className="Vis3D" width={props.width} height={props.height} style={{backgroundColor: "lightgray", width:props.width, height:props.height}}>{props.children}</div>
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

  console.log(attrs.width.value)
  const width = parseInt(attrs.width.value.replace("px", ""))
  const height = parseInt(attrs.height.value.replace("px", ""))
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

  const renderer = new THREE.WebGLRenderer();

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 5;

  renderer.setSize( width, height );
  vis3D.appendChild( renderer.domElement );

  return {renderer, scene, camera, cube};
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
        rpackage.cube.rotation.x += 0.01;
        rpackage.cube.rotation.y += 0.01;
        rpackage.renderer.render( rpackage.scene, rpackage.camera );

      })
    }
    animate();

    setIsComponentMounted(true)
  }, [])
  if(!isComponentMounted) {
    return null
  }

  return <h1>I'm only executed on the client!</h1>
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
