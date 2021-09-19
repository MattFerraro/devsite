import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home ({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>I'm an aerospace engineer and a software engineer. I love math and science, and I have two cats.</p>

        <p>I try to post deep write-ups for a technical audience.</p>

        <p>If you want to subscribe to my content you can do so <a href="https://ca75030e.sibforms.com/serve/MUIEAGjBW1dCQAf8qMFX-PhgssdP7xAbJmCY9uoRoyLP9e0H62Ej8NG7cXcsFAU4JdfU0mlwZa9vTc3lfKa7ONXDCTtvU7Y2m9i9LiIrhDIASC7j1k_YpcahV1TMGzlwXbVthGoDvpVJxeBsz_9hFE3WNdjA4jcc_ocoNfDuOvU5-qLryUjlHk1PiSFoeSbUrmA3i9CVNsxK3V3i">here</a>.</p>
        
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Posts</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title, teaser, teaserImage }) => (
            <li className={utilStyles.listItem} key={id}>
              <div className={utilStyles.postCard}>
                <img src={teaserImage}></img>
                <div className={utilStyles.postCardTitle}>
                  <Link href={`/posts/${id}`}>
                    <a>{title}</a>
                  </Link>
                </div>
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
              </div>
          </li>
          ))}
        </ul>
      </section>

      <section>
      <iframe width="100%" height="390" src="https://ca75030e.sibforms.com/serve/MUIEAGjBW1dCQAf8qMFX-PhgssdP7xAbJmCY9uoRoyLP9e0H62Ej8NG7cXcsFAU4JdfU0mlwZa9vTc3lfKa7ONXDCTtvU7Y2m9i9LiIrhDIASC7j1k_YpcahV1TMGzlwXbVthGoDvpVJxeBsz_9hFE3WNdjA4jcc_ocoNfDuOvU5-qLryUjlHk1PiSFoeSbUrmA3i9CVNsxK3V3i" frameborder="0" scrolling="auto" allowfullscreen style={{display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%"}}></iframe>
      </section>
    </Layout>
  )
}
