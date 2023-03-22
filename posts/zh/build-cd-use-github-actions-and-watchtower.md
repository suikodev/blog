---
title: "使用 Github Actions 与 Watchtower 构建 CD"
excerpt: "Github Actions 是 Github 推出的 CI/CD 平台, 可以自动化项目的构建，测试，部署流程。本文讲述如何利用 Github Actions 与 watchtower 来构建 web 服务的自动部署管道。"
date: "2022-9-30"
locale: "zh"
tags: [docker, DevOps]
ogImage: https://rorsch-1256426089.file.myqcloud.com/public/202212312153985.webp
coverImage: https://rorsch-1256426089.file.myqcloud.com/public/202212312153985.webp
---

## 前言

Github Actions 是 Github 推出的 CI/CD 平台, 可以自动化项目的构建，测试，部署流程。本文讲述如何利用 Github Actions 与 watchtower 来构建 web 服务的自动部署管道。

## Github Actions

在 repo 中相对根目录创建 `.github` / `workflows` 目录，在 workflows 目录下创建以 .yml 结尾的文件即可配置 Github Actions 来构建 CI/CD 流程。我们可以将 `workflow` 目录下一个 yml 文件视为一个工作流，工作流需要事件（event）来触发，下图简单的描述了 Github Actions 的触发/工作流程：

![overview-actions-simple](https://rorsch-1256426089.file.myqcloud.com/public/202209302235659.webp)

### 简单的 Github Actions 配置文件语法介绍

如上述，Github Actions 是借用 yml 语法来进行创建的，以下为一个完整的配置文件：

```yaml
name: publish

on:
  push:
    branches:
      - main

env:
  IMAGE_NAME: ${{ github.event.repository.name }}

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - name: Check out Git repository
        uses: actions/checkout@v2

      - name: Build image
        run: docker build . --tag $IMAGE_NAME

      - name: Log into GitHub Container Registry
        run: echo "${{ secrets.CR_PAT }}" | docker login https://ghcr.io -u ${{ github.actor }} --password-stdin

      - name: Push image to GitHub Container Registry
        run: |
          IMAGE_ID=ghcr.io/${{ github.repository_owner }}/$IMAGE_NAME
          IMAGE_ID=$(echo $IMAGE_ID | tr '[A-Z]' '[a-z]')
          VERSION=latest
          echo IMAGE_ID=$IMAGE_ID
          echo VERSION=$VERSION
          docker push $IMAGE_ID:$VERSION
```

上述配置文件配置了一个 Github Actions 的工作流程（workflow)，作用是在 push 代码到 `main` 分支时自动构建 docker 镜像， 上传到 registry

首先是第一部分：

```yaml
name: publish
```

这一部分的作用是给此 workflow 命名，可以在 github repo 的 actions tab 中 一个 workflows 日志中看到此命名：

![image-20220930230905791](https://rorsch-1256426089.file.myqcloud.com/public/202209302309238.webp)

第二部分，声明事件：

```yaml
on:
  push:
    branches:
      - main
```

此部分是上文描述，用来触发任务的事件。上述代码的意思是在 push 代码到 `main` 分支时触发任务

第三部分，声明环境变量：

```yaml
env:
  IMAGE_NAME: ${{ github.event.repository.name }}
```

此部分用来声明环境变量，可以在关于任务的配置中去引用此变量，`github.event.repository.name` 为 github 提供的 repo 上下文信息（context information），可以通过参考信息拿到 repo 作者用户名，repo 名等，关于 github 提供的 repo 上下文信息，详见 GitHub 的官方文档：https://docs.github.com/en/actions/learn-github-actions/contexts

第四部分，声明任务：

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - name: Check out Git repository
        uses: actions/checkout@v2

      - name: Build image
        run: docker build . --tag $IMAGE_NAME
```

`runs-on: ubuntu-latest` 代表使用 Github 提供的 `ubuntu-latest` 镜像，`steps` 代表任务步骤。上述代码中 `steps`有两段，第一段代表使用其他人分享的 actions 来迁出代码用来进行第二段的构建镜像操作。这里就不得不谈到 Github Actions 相对于其他 CI 平台的优越之处，在于可以抽象出一次任务步骤用来分享给其他人使用。如在下节中使用的 [action-docker-layer-caching](https://github.com/satackey/action-docker-layer-caching) ，可以用来缓存 docker layer, 加快下一次的镜像构建速度

以上四个部分基本涵盖了 Github Actions 配置文件通用的写法，具体的 Github Actions 的教程可以查阅 Github 的官方文档：https://docs.github.com/en/actions/learn-github-actions

## Watchtower

[Watchtower](https://github.com/containrrr/watchtower) 是一个 docker 镜像，可以在其他的 docker 镜像有更新时，自动更新 container。本次构建的 CD Pipeline 是利用 watchtower 的 HTTP Hook 来触发 container 更新操作，watchtower 默认会定时更新镜像，有关 watchtower 的详情，可见官方文档：https://containrrr.dev/watchtower/

## CD Pipeline

本文介绍的 CD 流程如下:

![CD 流程示意图](https://rorsch-1256426089.file.myqcloud.com/public/202209302236560.webp)

1. Push 代码到 Github，触发 Github Actions，以下 2 到 6 步为 Github Actions 任务步骤（[jobs](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#jobs))。

2. Github Actions checkout 代码, 语法：

   ```yaml
   - name: Check out Git repository
     uses: actions/checkout@v2
   ```

3. 使用 docker layer 缓存：

   ```yaml
   - uses: satackey/action-docker-layer-caching@v0.0.11
   	# Ignore the failure of a step and avoid terminating the job.
   	continue-on-error: true
   ```

4. 构建 docker 镜像(注意的是，这一步可以执行的前提是你的 Repo 中理所当然的应该要有 Dockerfile)：

   ```yaml
   - name: Build image
   	run: docker build . --tag $IMAGE_NAME
   ```

5. 上传镜像，下列步骤表示登录 [ghcr](https://github.blog/2020-09-01-introducing-github-container-registry/) , 给构建出的 images 打上 tag，上传到 ghcr：

   ```yaml
   - name: Log into GitHub Container Registry
   	run: run: echo "${{ secrets.CR_PAT }}" | docker login https://ghcr.io -u ${{ github.actor }} --password-stdin
   - name: Push image to GitHub Container Registry
   	run: |
         IMAGE_ID=ghcr.io/${{ github.repository_owner }}/$IMAGE_NAME
         # Change all uppercase to lowercase
         IMAGE_ID=$(echo $IMAGE_ID | tr '[A-Z]' '[a-z]')

         VERSION=latest

         # Strip "v" prefix from tag name
         [[ "${{ github.ref }}" == "refs/tags/"* ]] && VERSION=$(echo $VERSION | sed -e 's/^v//')

         echo IMAGE_ID=$IMAGE_ID
         echo VERSION=$VERSION
         docker tag $IMAGE_NAME $IMAGE_ID:$VERSION
         docker push $IMAGE_ID:$VERSION
   ```

6. 触发 watchtower 的 HTTP API:

   ```yaml
   - name: Redeploy
    run: |
     curl -H "Authorization: Bearer ${{ secrets.WATCHTOWER_TOKEN }}" https://xxxx.xxx/v1/update
   ```

7. Watchtower 拉取最新的 images 进行更新（以下为一次通过 HTTP Hook 触发 watchtower 自动更新的 docker logs)：

![截屏2022-09-30 21.55.15](https://rorsch-1256426089.file.myqcloud.com/public/202209302236696.webp)

在以上 7 个流程正常走完后，服务端部署的服务即会成功更新。流程的成功与否可以通过 Github 发送的邮件知晓。
