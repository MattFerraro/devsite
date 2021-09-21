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

const MDXComponents = {
  styledDiv
};

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
        
        {/* <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} /> */}
      </article>
    </Layout>
  )
}
