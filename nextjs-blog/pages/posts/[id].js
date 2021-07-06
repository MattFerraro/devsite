import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
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
export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta
          property="og:title"
          content={postData.title}
        />
        <meta
          property="twitter:title"
          content={postData.title}
        />
        <meta name="twitter:title" content={postData.title} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image:src" content={postData.teaserImage}/>
        <meta
          property="og:image"
          content={postData.teaserImage}
        />
        <meta
          property="og:type"
          content="article"
        />
        <meta
          name="description"
          content={postData.teaser}
        />
        <meta
          property="og:description"
          content={postData.teaser}
        />
        <meta
          property="twitter:description"
          content={postData.teaser}
        />
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}
