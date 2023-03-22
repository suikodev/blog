---
title: "每个工程师都应该是作家"
excerpt: "google的开发者网站提供了一份技术写作课程，本文记录了笔者阅读这份技术写作课程时的一些笔记与个人理解"
date: "2022-11-30"
locale: "zh"
tags: [AfterReading]
ogImage: https://rorsch-1256426089.file.myqcloud.com/public/202212312152577.webp
coverImage: https://rorsch-1256426089.file.myqcloud.com/public/202212312152577.webp
---

## 前言

google 在 [developers.google.com](http://developers.google.com/) 上提供了一份[技术写作课程](https://developers.google.com/tech-writing)，本文记录了笔者阅读这份技术写作课程时的一些笔记与个人理解

## 词汇的使用(Words)

### 术语的定义

当使用一个术语时，文章的受众可能对这个术语并不熟悉，我们对这样的一个术语的处理可以分为以下两种情况：

- 文章不准备花大量时间在这个术语上，且这个术语在业内已经有过很明确的定义。那我们在文章中第一次使用这个术语时，直接链接到已有的解释就可以了，不需要自己解释一遍（重复造轮子）
- 文章有章节或段落专门解释此术语，那么这时，对于此术语，在文中就需要给一个明确的定义。如果文章介绍了很多这样的术语，那我们最好将这样的一些术语集合起来，放到专门的术语表中

### 保持术语的一致性

原文的这句话很有意思：

- If you change the name of a variable midway through a method, your code won't compile. Similarly, if you rename a term in the middle of a document, your ideas won't compile (in your users' heads).

如果在一个方法中改变了一个变量的名称，那我们的代码是不会通过编译的，同样的，如果我们在文章中突然改变了一个术语的命名，那读者理解我们文章内容就会变得更困难

原文给出了一个例子：

- Protocol Buffers provide their own definition language. Blah, blah, blah. And that's why protobufs have won so many county fairs.

在这个例子中， `Protocol Buffers` 这个术语在最后一句变成了 `protobufs` ，这样就会让读者感到费解

关于为什么需要保持术语的一致性，除了减少读者的理解成本，原文中还有一段非常出色的解释：

- When I encounter two words that seem to be synonyms, I wonder if the author is trying to signal a subtle distinction that I need to track down and understand.
- 当我发现两个词语好像是近义词时，我会思考作者是不是在暗示我需要追踪和理解他们之间的微妙差别

如果一个术语太长了，你可能觉得在文章中从头到尾都保持一致会很累，那你可以采取这样的方法：

```markdown
**Protocol Buffers** (or **protobufs** for short) provide their own definition language. Blah, blah, blah. And that's why protobufs have won so many county fairs.
```

即在第一次引入这个术语时就重命名一下

### 正确的使用缩略语

在开始引入文章受众并不熟悉的缩略语时，应该先将全称拼写出来，将缩略语放入括号中，并加粗全称以及缩略语。例子：

```markdown
This document is for engineers who are new to the **Telekinetic Tactile Network (TTN)** or need to understand how to order TTN replacement parts through finger motions.
```

然后在下文中再使用 `TNN` 这个缩略语

正确的使用缩略语很简单，但是我们是否真的需要使用缩略语？

固然，缩略语可以减少句子的长度，如 `TNN` 与 `Telekinetic Tactile Network` 相比就少了两个词汇，但是在读者的脑子中从 `Telekinetic Tactile Network` 到 `TNN` 是需要时间转换的。如果缩略语的使用频率并不高是没有必要引入的。当然，某些约定俗成的缩略语除外，例如 `HTML` ，你可能根本想不起来原拼是啥了

总结缩略词使用的要点：

- 不需要定义出现频率很低的缩略语
- 定义缩略语时遵守以下两条原则：
  - 缩略语明显要短于全称
  - 缩略语在文中出现了很多次

### 正视模棱两可的代词

在这一节中，原文行云流水，用编程中的指针来比喻代词，非常恰当的形容了代词， 大意：多数代词指向之前使用的名词，代词就像编程中的指针一样，容易引发错误。不恰当地使用代词会在读者的头脑中造成等同于空指针错误的认知错误。很多时候都应该避免使用代词，而直接使用代词指向的名词

代词使用要点：

- 只在介绍了一个名词后再使用指向该名词的代词；**永远不要**在此名词介绍前使用代词
- 尽可能的缩短名词和指向此名词的代词的距离。如果名词和代词在一段话中相隔 5 个单词以上，都要考虑是否直接使用名词
- 如果介绍了名词 A, 紧接着又介绍了名词 B, 那之后再使用 A 时，切勿使用代词来指向 A, 不然读者一定特别容易混淆 A 与 B

## 主动语态

在主动语态这一节中，原文花了大量的篇幅讲解主动语态与被动语态的区别，识别主动语态与被动语态的方法。而对于写作有指导意义的是原文强调，在技术写作中应该尽量多的使用主动语态，主要有以下优势：

- 读者在阅读一个被动语态的句子时，往往会在脑中转换成主动语态来理解。使用主动语态有助于减少读者理解成本。
- 被动语态相较于主动语态而言，往往会颠倒句子顺序。
- 主动语态往往更短。

## 明确的句式

- Comedy writers seek the funniest results, horror writers strive for the scariest, and technical writers aim for the clearest.

在技术写作中，文章表述清晰，通俗易懂应该是我们的最高追求目标。这一节介绍了一些方法，可以让我们的句子更清晰，优美。

### 选择有力的动词（strong verb)

什么是有力的动词？原文对有力的动词是这样形容的：precise, strong, specific。相对有力的动词，原文这样形容无力的动词(week verb): imprecise, weak, or generic。

无力的动词如下：

- _be_ 的变体：is, are, am, was, were, etc.
- occur
- happen

可在以下表格中对比使用了无力的动词与使用了有力的动词的句子：

| week Verb                                   | Strong Verb                                     |
| ------------------------------------------- | ----------------------------------------------- |
| The exception occurs when dividing by zero. | Dividing by zero raises the exception.          |
| This error message happens when...          | The system generates this error message when... |
| We are very careful to ensure...            | We carefully ensure...                          |

总而言之，无力的动词在文章中往往引入如下缺陷：

- 动词的不精确或缺失
- 被动语态

### 减少 There are / There is

There are / There is 的句型往往伴随泛用的名词/动词，如上文所述，泛用的名词/动词往往是无力的。一般来讲，There are / There is 开头的句子可以转换成更明确的句子：

```markdown
There is a low-level, TensorFlow, Python interface to load a saved model.
```

```markdown
TensorFlow provides a low-level Python interface to load a saved model.
```

### 减少形容词和副词的使用

形容词与副词的恰当使用可以提升诗歌与散文的质量，但是在技术写作中往往会分散读者的注意力，可以对比一下两个句子来感受：

```markdown
Setting this flag makes the application run screamingly fast.
```

```markdown
Setting this flag makes the application run 225-250% faster.
```

与其使用 `screamingly` 这样的副词，`225-250%` 这样的数据往往更加直观。

## 减少句子的长度

为什么需要减少句子的长度？我们可以对比编程，往往大家会追求写出更简短的代码，通常有以下理由：

- 可读性
- 维护性
- 长段代码相较于短一点的代码，容易引人额外的 bug 状况

减少句子长度的理由是一样的。相较于长句，短句更加简洁有力，易于阅读。

### 一句话一个想法

尝试在一句话中表达多个想法会增加阅读理解难度。对比如下两段话：

The late 1950s was a key era for programming languages because IBM introduced Fortran in 1957 and John McCarthy introduced Lisp the following year, which gave programmers both an iterative way of solving problems and a recursive way.

The late 1950s was a key era for programming languages. IBM introduced Fortran in 1957. John McCarthy invented Lisp the following year. Consequently, by the late 1950s, programmers could solve problems iteratively or recursively.

很明显，将一段又臭又长的句子拆分成几个短句更容易阅读。对比编程, 类似于 single responsibility principle。

### 将长句拆分成列表

很多长句往往可以拆分成短句列表，如含有 `or` 的长句：

To alter the usual flow of a loop, you may use either a **break**
statement (which hops you out of the current loop) or a **continue**
statement (which skips past the remainder of the current iteration of the current loop).

拆分成列表：

- `break`, which hops you out of the current loop.
- `continue`, which skips past the remainder of the current iteration of the current loop.

### 省略无关的词语

原文中有一个表格可以感受此点：

| Wordy                     | Concise |
| ------------------------- | ------- |
| at this point in time     | now     |
| determine the location of | find    |
| is able to                | can     |

适当的替换句子中的短语可以让文章显得不那么啰里八嗦
