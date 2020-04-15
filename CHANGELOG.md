<!--
 * @Author: your name
 * @Date: 2020-03-14 17:21:08
 * @LastEditTime: 2020-04-13 07:30:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUI-Language-Support\CHANGELOG.md
 -->
# 2020/4.13 V0.3.0

### 完成点
- 在漫长的等待之后，我终于完成了一个定制化的小型parser,现在他可以基于语法树为用户提供快速的提示功能

### 优化点
- 加大了预处理的范围，使用snapshot存储分析结果，这样相比于正则表达式的匹配，减少了大量字符串的运算。
- 使用分析树，提供了一个向上递归解析的方法。在此基础上使用map实现记忆搜索。加快了搜索进度。
- 添加了资源树的buildCompletion方法，现在，你可以额直接从资源树中取出Completion而非在调用函数的时候现场生成，这减少了大量的代码复用，并为我们在未来支持更多组件库提供了基础。
- 现在parser支持自定义的符号了，例如：devui使用d-作为开头，需要注意的是它现在并没有在全局进行应用，在未来会努力做到这一点。

### 更新计划：
V0.3.1: 提供完整的completion功能，尝试解决空格无法唤醒的问题，如果确实没有解决方法，那么使用addCompletion.
V0.3.2: 提供一个递归扫描器，能够在项目开始的时候扫描是否存在组件库依赖，以及对src中的各种component进行语法树的预解析。
V0.3.3：更新现有的parser架构，使得parser通过双亲标签进行解析。并据此给出文档规范，在此次更新之后，它应该会支持“+”功能。
V0.3.4: 了解angular的template语法，并使得差价能够根据提示生成template模板。

# 2020/3/15 V 0.2.1~V0.2.2

### 完成点：
V0.2.1
- 添加了打包脚本，现在，你可以使用'yarn package'命令对项目进行一键打包。
- 更新了README.md

v0.2.2
- 优化了打包脚本，现在，插件的体积将是原来的60%左右

### 架构更新

- 将采用typescript所提供的Language-servicePlugin，为devui提供包括自动提示，代码纠错，悬浮提醒的一系列功能。点击<a herf="https://github.com/sspku-yqLiu/devui-language-service">这里</a>了解更多

- 在完成service后,他将集成到插件的devui库中，注意：这并不意味着要求用户的devui中也同样需要安装language-service服务，但是我强烈推荐devui集成语言服务，因为这将会大大帮助插件开发者。

BUGS :
- 参考上一版，因为是周末就没怎么敲代码了=-=

# 2020/3/14 V0.2.0

### 完成点：
- 使用了angular-language-support架构
- 添加了拦截器功能，现在在没有DevUI依赖的文件夹中，插件将不会被激活。
- 使用rollup对项目进行打包，减少了代码冗余。
- 添加了Logo License 以CHANGELOG.md

### BUGS:
- 使用人工打包而非批处理打包，java文件无法满足自动打包功能。
- 似乎disableLanguageService()函数并没有起作用，也许只在DEBUG情境下才这样
- 仍然没有添加对typescript语法的支持
- package.json文件中的main在DEBUG模式与生产模式中不同，这是否是打包批处理文件应该完成的工作？

# 2020/3/12 V0.1.0

完成点：

- 完成最小可用产品，能够在html中实现大类标签提示。

BUGS：

- 在所有的html中都会提示。冗余严重

下一步要做的事：

- 完成大类中api的提示
- 完成启动控制器，仅当发现ng-devui插件时启动提示功能。

# 2020/3/11 V0.0.1

完成点：

正式登陆vscode 完成在商店中发布

BUGS：

无法运行，初始化失败，怀疑是session类的BUG

下一步要做的事：

发布最小可用产品。