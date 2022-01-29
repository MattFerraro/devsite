import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import imageSize from 'image-size';

const postsDirectory = path.join(process.cwd(), 'posts')

const allowList = [
  "cnc-router.mdx",
  "poissons-equation.mdx",
  "caustics-engineering.mdx",
  "geometric-algebra.mdx",
  "joule-thomson.mdx",
  // "impulse-response.mdx",
  "inverse-of-a-circle.mdx",
  // "simple-test.mdx"
]

export function getSortedPostsData() {
  // Get file names under /posts

  // This section controls what shows up on the front page
  // const fileNames = fs.readdirSync(postsDirectory)
  const fileNames = allowList;
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.mdx$/, '')

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

  // This area controls what builds and is hosted, NOT what ends up on the front page
  // To allow EVERYTHING:
  // const fileNames = fs.readdirSync(postsDirectory)
  const fileNames = allowList
  // To allow a subset, use allowList

  
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.mdx$/, '')
      }
    }
  })
}

export async function getPostDataMDX(id) {
  const fullPath = path.join(postsDirectory, `${id}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const imgDirectory = path.join(process.cwd(), `public/images/${id}`)

  const imgDims = {}
  if (fs.existsSync(imgDirectory)) {
    const imgNames = fs.readdirSync(imgDirectory)
    // imgNames = imgNames.filter(name => !name.endsWith(".wav"))
    for (let img of imgNames) {
      if (img.startsWith(".")) {
        continue
      }
      if (img.endsWith(".mp4") || img.endsWith(".wav") || img.endsWith(".mp3")) {
        continue
      }
      try {
        const dimensions = imageSize(imgDirectory + "/" + img)
        imgDims[`/images/${id}/${img}`] = dimensions
      } catch (error) {
        console.log("Could not read " + imgDirectory + "/" + img)
      }

      
    }
  }
  
  
  return {
    id: id,
    rawContent: matterResult.content,
    metadata: matterResult.data,
    imgDims: imgDims,
    // content: matterResult.content,
    // ...matterResult.data
  }
}