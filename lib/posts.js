import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark'
import html from 'remark-html';

// 获取 posts 目录的绝对路径
const postsDirectory = path.join(process.cwd(), 'posts');

// 获取所有文章的元数据
export function getSortedPostsData() {
  // 获取 posts 目录下所有的文件名，返回数组
  const fileNames = fs.readdirSync(postsDirectory);
  // 将所有文件转为对象
  const allPostsData = fileNames.map(fileName => {
    // 删除掉 .md 后缀
    const id = fileName.replace(/\.md$/, '');

    // 将 markdown 转为 string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用 gray-matter 解析文章元数据
    const matterResult = matter(fileContents);

    // 将数据与文章id结合起来
    return {
      id,
      ...matterResult.data,
    };
  })

  // 返回根据时间排序过的文章数据
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }
    return -1;
  })
}

// 获取所有文章id（文件名）
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

// 根据文章id获取文章数据
export async function getPostData(id) {
  // 将 markdown 转为 string
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // 使用 remark remark-html库将 markdown 字符串转为 html
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}