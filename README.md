# Next.js 入门

要从头开始使用 React 构建一个完整的 Web 应用程序，需要考虑许多重要的细节：

- 必须使用打包程序（例如 webpack）打包代码，并使用 Babel 等编译器进行代码转换。
- 你需要针对生产环境进行优化，例如代码拆分。
- 你可能需要对一些页面进行预先渲染以提高页面性能和 SEO。你可能还希望使用服务器端渲染或客户端渲染。
- 你可能必须编写一些服务器端代码才能将 React 应用程序连接到数据存储。

一个 *框架* 就可以解决上述这些问题。但是，这样的框架必须具有正确的抽象级别，否则它将不是很有用。它还需要具有出色的“开发人员体验”，以确保您和您的团队在编写代码时拥有出色的体验。

**Next.js** 是一个 React 开发框架。Next.js 为上述所有问题提供了解决方案。但更重要的是，它能确保您和您的团队成功地构建 React 应用程序。

Next.js 具有同类框架中最佳的“开发人员体验”和许多内置功能。列举其中一些如下：

- 直观的、 基于页面 的路由系统（并支持 动态路由）
- 预渲染。支持在页面级的 静态生成 (SSG) 和 服务器端渲染 (SSR)
- 自动代码拆分，提升页面加载速度
- 具有经过优化的预取功能的 客户端路由
- 内置 CSS 和 Sass 的支持，并支持任何 CSS-in-JS 库
- 开发环境支持 快速刷新
- 利用 Serverless Functions 及 API 路由 构建 API 功能
- 完全可扩展

## 安装&启动

使用 `create-next-app` 创建新的 Next.js 应用程序，它会自动为你设置所有内容。创建项目，请运行：

```sh
npx create-next-app@latest
# or
yarn create next-app
```

如果要使用 TypeScript 开发项目，可以通过 `--typescript` 参数创建 TypeScript 项目：

```sh
npx create-next-app@latest --typescript
# or
yarn create next-app --typescript
```

安装完成后:

- 运行 `npm run dev` 或 `yarn dev` 来启动开发服务器，访问地址为 `http://localhost:3000`。

- 通过 `http://localhost:3000` 地址访问你的应用程序。

- 编辑 `pages/index.js` 文件并在浏览器中查看更新。

有关使用 `create-next-app` 的更多信息，请查看 [`create-next-app`](https://www.nextjs.cn/docs/api-reference/create-next-app) 文档。



## 开发

### 路由

Next.js 使用基于页面文件的路由，`/` 根路径为 `pages/index.js`

声明式的路由跳转，使用内置的 `Link` 组件，如果要从当前页面跳转到 `/posts/first-post`：

```jsx
import Link from 'next/link'
<Link href="/posts/first-post"><a>To first post</a></Link>
```
这种跳转方式与 `<a>` 标签跳转的区别是：前者不会触发页面的刷新，而后者会。

#### 动态路由

创建一个名为 `[id].js` 的页面。以 `[` 开头和 `]` 结尾的页面是Next.js中的[动态路由](https://www.nextjs.cn/docs/routing/dynamic-routes)。

使用 [`getStaticPaths`](https://www.nextjs.cn/docs/basic-features/data-fetching#getstaticpaths-static-generation) 来生成动态路由的参数:

```jsx
export async function getStaticPaths() {
  // 返回一个包含 paths 属性的对象，paths 取值为数组，每一项是一个页面的参数
  // params 将会被传给页面的 props 或者页面 getStaticProps 方法的参数
  // 这里的 id 可以请求接口生成
  return {
    paths: [
      {
        params: {
          id: 1,
        }
      },
      {
        params: {
          id: 1,
        }
      }
    ]
  }
}
```

然后在页面 `getStaticProps` 方法中接受动态路由的参数：

```jsx
export async function getStaticProps({ params }) {
  // 使用 getStaticPaths 生成的路由参数将会传到这里的 params
  const { id } = params;
  // 根据 id 获取数据
  const pageData = await getData(id);
  // 将静态渲染的数据返回给页面使用
  return {
    props: {
      pageData,
    }
  }
}
```

### 样式

Next.js 支持 CSS-in-JS 的方式编写 CSS。

可以使用 [styled-jsx](https://github.com/vercel/styled-jsx) 的方式写样式：

```jsx
<style jsx>{`
  …
`}</style>
```

还可以使用 `.module.css` 或者 `.module.scss`（需要安装 sass 库：`npm i sass`）的方式：

```js
import style from './layout.module.scss'
<div className={style.container}>{children}</div>
```

还支持使用流行的 CSS 库，例如 [Tailwind CSS](https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss) 。

#### 全局样式

要添加全局样式，需要在 `pages` 下创建 `_app.js` 文件，在此文件中导入的 `css` 文件将在全局生效，可以用来做一些样式重置之类的操作。

添加 `_app.js` 文件之后需要重启开发服务器 `npm run dev`。

该App组件是所有不同页面通用的顶级组件。例如，可以使用此App组件在页面之间导航时保​​持状态。

添加全局样式步骤：

1. 在根目录创建 `styles` 目录，在其下面创建 `global.css` 文件；
2. 在 `pages/_app.js` 中引入 `global.css`：
```jsx
import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

### 静态文件

Next.js 可以在顶级 `public` 目录下提供静态文件，例如图像。`public` 可以从应用程序的根目录引用其中的文件。

例如在 `public` 下放置了 logo `vercel.svg`，路径为 `/public/vercel.svg`，要在页面中引用时：

```jsx
<img src="/vercel.svg" alt="Vercel Logo" className="logo" />
```

如果要引入 `/images/me.jpg`，需要将 `me.jpg` 放置在 `/public/images/` 下，文件路径为 `/public/images/me.jpg`

### 元数据

如果我们想修改页面的元数据，比如 `<title>` 标签时，需要使用 Next.js 内置的 `Head` 组件：

```jsx
import Head from 'next/head'
<Head>
  <title>First Post</title>
  <link rel="icon" href="/favicon.ico" />
</Head>
```


### 预渲染

Next.js 的两种预渲染形式。

- **静态生成（推荐）**： HTML 是在 构建时（build time） 生成的，并重用于每个页面请求。要使页面使用“静态生成”，只需导出（export）页面组件或导出（export） `getStaticProps` 函数（如果需要还可以导出 `getStaticPaths` 函数）。对于可以在用户请求之前预先渲染的页面来说，这非常有用。你也可以将其与客户端渲染一起使用以便引入其他数据。

- **服务器端渲染**： HTML 是在 每个页面请求 时生成的。要设置某个页面使用服务器端渲染，请导出（export） `getServerSideProps` 函数。由于服务器端渲染会导致性能比“静态生成”慢，因此仅在绝对必要时才使用此功能。

> 文档: [Next.js 预渲染](https://www.nextjs.cn/docs/basic-features/pages#%E9%A2%84%E6%B8%B2%E6%9F%93)

## 部署

Next.js 可以部署到任何安装 Node.js 服务器。

Next.js 的 `package.json` 中有以下可运行的脚本：

```json
{
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```

在服务器中 `git pull` 拉取到 Next.js 项目代码后，执行 `npm i` 安装依赖；

然后执行一次 `npm run build` 脚本，在文件夹中构建生产应用程序 `.next`；

构建后，运行 `npm run start` 启动一个支持混合页面的 Node.js 服务器，为静态生成的和服务器端呈现的页面以及 API 路由提供服务。

> 提示：可以自定义 `package.json` 中的 `start` 脚本以接受 `PORT` 参数来自定义启动端口，方法是将其更新为： `"start": "next start -p $PORT"`.

服务启动后，通过服务器公网地址加端口号即可访问网站。