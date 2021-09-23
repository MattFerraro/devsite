import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import Image from "next/image"

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

        <p>I try to post deep write-ups for a technical audience roughly once a month.</p>

        <p>If you want to subscribe to my content you can do so <a href="https://ca75030e.sibforms.com/serve/MUIEAGjBW1dCQAf8qMFX-PhgssdP7xAbJmCY9uoRoyLP9e0H62Ej8NG7cXcsFAU4JdfU0mlwZa9vTc3lfKa7ONXDCTtvU7Y2m9i9LiIrhDIASC7j1k_YpcahV1TMGzlwXbVthGoDvpVJxeBsz_9hFE3WNdjA4jcc_ocoNfDuOvU5-qLryUjlHk1PiSFoeSbUrmA3i9CVNsxK3V3i">here</a>.</p>
        
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Posts</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title, teaser, teaserImage }) => (
            <li className={utilStyles.listItem} key={id}>
              <div className={utilStyles.postCard}>
                {/* <img src={teaserImage}></img> */}
                <Image src={teaserImage} priority height={200} width="612"></Image>
                <div className={utilStyles.postCardTitle}>
                  <Link href={`/posts/${id}`} prefetch={false}>
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
      <iframe width="100%" height="390" src="https://ca75030e.sibforms.com/serve/MUIEAGjBW1dCQAf8qMFX-PhgssdP7xAbJmCY9uoRoyLP9e0H62Ej8NG7cXcsFAU4JdfU0mlwZa9vTc3lfKa7ONXDCTtvU7Y2m9i9LiIrhDIASC7j1k_YpcahV1TMGzlwXbVthGoDvpVJxeBsz_9hFE3WNdjA4jcc_ocoNfDuOvU5-qLryUjlHk1PiSFoeSbUrmA3i9CVNsxK3V3i" frameBorder={"0"} scrolling="auto" allowFullScreen style={{display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%"}}></iframe>
      </section>
    </Layout>
  )
}


// import Head from "next/head";
// import { MDXRemote } from "next-mdx-remote";
// import { serialize } from "next-mdx-remote/serialize";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";

// const styledDiv = ({ children }) => (
//   <div style={{ color: "blue" }}>{children}</div>
// );

// const MDXComponents = {
//   styledDiv
// };

// const data = `# Testing KaTeX

// This is the number $x = 13$ and this

// $$
// E = mc^2 + 2
// $$

// <styledDiv>
// Does this work?
// </styledDiv>

// test

// is an equation`;

// export default function Home({ mdxSource }) {
//   return (
//     <div>
//       <Head>
//         <title>KaTeX test</title>
//         <meta name="description" content="Generated by create next app" />
//         <link
//           rel="stylesheet"
//           href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
//           integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
//           crossOrigin="anonymous"
//         />
//       </Head>

//       <div>
//         <span className="katex">
//           <span className="katex-mathml">
//             The KaTeX stylesheet is not loaded!
//           </span>
//           <span className="katex-version rule">KaTeX stylesheet version: </span>
//         </span>

//         <MDXRemote {...mdxSource} components={MDXComponents} />
//       </div>
//     </div>
//   );
// }

// export async function getStaticProps() {
//   const mdxSource = await serialize(data, {
//     mdxOptions: {
//       remarkPlugins: [remarkMath],
//       rehypePlugins: [rehypeKatex]
//     }
//   });

//   return {
//     props: {
//       mdxSource
//     }
//   };
// }
