---
title: "Next.js 13"
excerpt: "在 2022-10-26, Vercel 发布了 Next.js 13，本文主要讲述 Next.js 13 的一些新特性。"
date: "2022-10-31"
locale: "zh"
tags: [Next.js]
coverImage: https://rorsch-1256426089.file.myqcloud.com/public/202212312152644.webp
---

在 2022-10-26, Vercel 发布了 Next.js 13，本文主要讲述 Next.js 13 的一些新特性。

## 如何更新

```bash
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

## `app/` (beta)

Next.js 最受欢迎的一点就是文件式的路由系统，即只需要将文件放到文件夹中，就可以快速的创建路由，不需要更多的配置。

而经由引入 `app/` 文件夹， Next.js 13 更进一步地提升了路由与布局体验。`app/` 的引入主要来着社区讨论的[Layouts RFC](https://nextjs.org/blog/layouts-rfc) ，新的路由系统主要对以下几点提供了改进：

- **Layouts**: 保留 state 的同时在路由之间轻松共享 UI， 并避免昂贵的重渲染。
- **Server Components**: 让大多数动态应用(dynamic application) server-first。
- **Streaming**: 在渲染时以 UI 为最小单位显示即时加载 state 和 stream。
- **Support for Data Fetching**: 让 Server Components 异步执行并扩展 `fetch` api 以支持组件级别的 fetch。

在升级到 Next.js 13 时，并非一定要使用 `app/`文件夹，`app/`文件夹可以与现有的`pages`文件夹共存以进行渐进式的更新。

### Layouts

`app/`让复杂界面的构建变得更容易，可以跨导航维护状态，避免昂贵的重新渲染，并启用高级路由模式。此外，还支持以路由级别组装代码，如组件，样式，测试代码。

在 `app` 文件夹中创建路由需要一个 `page.js` 文件：

```jsx
// app/page.js
// 这个文件的路由约定为 '/'
export default function Page() {
  return <h1>hello, Next.js!</h1>;
}
```

之后我们可以通过文件系统来定义`Layouts`，Layouts 会在多个页面之间共享，在切换导航时将保存状态，保持交互，并且不会**重渲染**：

```jsx
// app/blog/layout.js
export default function BlogLayout({ children }) {
  return <section>{children}</section>;
}
```

### Server Components

`app`文件夹引入了对 React Server Component 的支持，[Server and Client Components](https://beta.nextjs.org/docs/rendering/server-and-client-components) 使用了服务端和客户端各自最擅长的功能，能让开发者使用统一的编程模型来构建快速响应的程序，提供了良好的开发体验。

Server Components 减少了发送到客户端的 Javascript，提高了首屏响应速度，为构建复杂 UI 的程序奠定了基础。

当一个路由被加载时，Next.js 和 React 运行时也将被加载，Next.js 和 React 运行时是可缓存的，并且大小可预测。这些运行时不会随着程序的规模变大而变大。而且运行时是异步加载的，能让 HTML 从服务器上被渐进式的到客户端上。

### Streaming

`app/`文件夹引入了流式渲染 UI 的能力：

![streaming](https://rorsch-1256426089.file.myqcloud.com/public/202210312242050.webp)

在 Next.js 中结合 Server Components 与 嵌套布局（nested layouts)，我们可以立即呈现页面中共不需要获取远程数据的部分，并同时为需要加载数据的部分呈现一个 loading 状态。这种方法可以让用户不需要等待整个页面加载完成即可开始与页面进行**交互（interact)**。

原文在这里额外强调了一点，如果将使用了 `app/`的 Next.js 13 应用部署到 Vercel 平台，会在 Node.js 与 Edge 运行时默认启用流式传输 response 以提升性能（很好地给自己平台打一了波广告= =）

### Data Fetching

调换一下原文顺序，我们首先看一下这段代码：

```jsx
// app/page.js
async function getData() {
  const res = await fetch("https://api.example.com/...");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  return res.json();
}

// This is an async Server Component
export default async function Page() {
  const data = await getData();

  return <main>{/* ... */}</main>;
}
```

在上文中提到过 Next.js 扩展了 `fetch`，扩展的 `fetch`自动消除了对重复数据的请求，提供了一种在组件级别获取、缓存和重新验证数据的方法。这一点最重要的体现的是以往在 Next.js 中使用的一些范式：SSG, SSR, ISR 都可以通过 一个 API 来实现：

```javascript
// 这个请求在手动被设置为无效钱都会缓存，与 getStaticProps 类似，
// force-cache 是默认的选项，可以省略
fetch(URL, { cache: "force-cache" });

// 每次请求都会重新获取数据，与 getServerSideProps 类似
fetch(URL, { cache: "no-store" });

// 这个请求在10秒内都会缓存，与配置了 revalidate 的 getStaticProps 类似
fetch(URL, { next: { revalidate: 10 } });
```

在 `app`文件夹中，无论是 layouts, pages, 或者在组件级别，都可以使用这种方式来获取远端数据，并且这种方式是支持服务端的流式传输的（与上文形成了闭环）。

## Turbopack

Next.js 13 引入了 Turbopack，基于 Rust 的 Webpack 继任者。这节在吹牛 X, 直接跳过：）

## next/image

开发体验上感知比较小，主要优化了性能，客户端需要为`next/image`加载的 JavaScript 变得更少了。比较重要的一点是现在 `alt`属性变成 required 了。

将 next/image 升级到 Next.js 13 的方法：

```bash
npx @next/codemod next-image-to-legacy-image ./pages
```

## next/link

> `next/link` no longer requires manually adding `<a>` as a child.

> `next/link` no longer requires manually adding `<a>` as a child.

> `next/link` no longer requires manually adding `<a>` as a child.

!!! 不得不说这是让我愿意升级到 Next.js 13 的动力之一，原文例子：

```jsx
import Link from 'next/link'

// Next.js 12: a 必须嵌套在 Link 里面
<Link href="/about">
  <a>About</a>
</Link>

// Next.js 13: Link 组件【always】渲染一个 a 标签
<Link href="/about">
  About
</Link>
```

实在是难以理解 Next.js 12 中的这种使用方式 = =，经常要为这种方式特别配置一下 a11y eslint 规则让人非常的难受。

## 总结

总的来说，新增的 `app` 还是很牛的，感觉很容易解决加载一些大型 JavaScript 导致首屏卡顿的问题，引入的 async server component 也让人非常兴奋，已经准备好使用 Next.js 13 来改造博客了: ) 。至于 Turbopack，原文中提到：

> - **700x faster** updates than Webpack
> - **10x faster** updates than Vite
> - **4x faster** cold starts than Webpack

有猴式对比法的嫌疑，还需要进一步的了解。next/image 是做了一些优化工作。next/link 不需要再内嵌一个 a 标签沾点姗姗来迟。
