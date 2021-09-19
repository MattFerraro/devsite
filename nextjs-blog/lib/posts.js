import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import slug from 'remark-slug'
import html from 'remark-html'
import toc from 'remark-toc'
import remarkGfm from 'remark-gfm'
import math from 'remark-math'
import remark2rehype from 'remark-rehype'
import katex from 'rehype-katex'
import rehypePrism from '@mapbox/rehype-prism'
import markdown from 'remark-parse'
import stringify from 'rehype-stringify'
import unified from 'unified'
import visit from 'unist-util-visit'

const postsDirectory = path.join(process.cwd(), 'posts')

const allowList = [
  "cnc-router.md",
  "poissons-equation.md",
  "caustics-engineering.md",
]

export function getSortedPostsData() {
  // Get file names under /posts
  // const fileNames = fs.readdirSync(postsDirectory)
  const fileNames = allowList;
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]

  // To allow EVERYTHING:
  const fileNames = fs.readdirSync(postsDirectory)
  // To allow a subset, use allowList
  
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

function attacher() {
  return transformer

  function transformer(tree, file) {
    // console.info(tree)
    // console.info(tree)
    visit(tree, 'element', visitor)
    function visitor(node, index, parent) {
      if (node.tagName == "img") {
        console.log(node)
      }
    }
  }
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)
  
  const processor = await unified()
    .use(markdown)
    .use(slug)
    .use(toc, {tight: true})
    .use(math)
    .use(remarkGfm)
    .use(remark2rehype, {allowDangerousHtml: true})
    .use(katex, {"output": "html"})
    .use(stringify, {allowDangerousHtml: true})
    .use(attacher)
    .use(rehypePrism)
    .process(matterResult.content);
  
  const contentHtml = processor.contents;
  
  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}
