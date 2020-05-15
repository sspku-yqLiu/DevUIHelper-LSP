<!--
 * @Author: your name
 * @Date: 2020-03-14 17:21:08
 * @LastEditTime: 2020-05-15 16:48:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUI-Language-Support\CHANGELOG.md
 -->
# 2020/5/15 V4.0.4
	更新文档
	修复snippetBUG
# 2020/5/15 V 4.0.0

### 优化点
- 我们拥有了一个全局的parser现在支持指令的补全了
- 我们采用了一种独特的链表来完成ast它将会被开源到yq-dataStructor npm包中，您可以点此进行了解
- 我们新型的解析器大幅提高了补全的质量，现在您可以拥有类似webstome的补全体验，更妙的是，我们对于组件的理解更胜一筹！

### 更新计划：
V4.1 完成Igniter,是分析放入到预处理中
V4.2 完成EditTree算法，这是一个基于对三大框架的dom操作理解，创造的一个新型dom树操作函数。
V4.3 完成对其他框架的支持
V4.4 生成官网

# 2020/4/20 V3.2
未发布版本
整理了文档
# 2020/4/28 V3.1.3
Completion与Hover施工完毕
# 2020/4/23 V3.1.2

增加了Hover功能

# 2020/4/20 V3.1.1

对 HTML_SOURE做了一些修正

# 2020/4/20 V3.1.0

增加了悬浮提示内容
V3.1版本致力于改善hover和completion的提示精准度。

# 2020/4/17 V 3.0.2

现在element的提示是以智能生成的snippet为模板的

# 2020/4/16 V 3.0.1

解决了代码块生成错误的问题

# 2020/4/13 V3.0.0

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


# V2.3.0

- 为自动补全提供了新的外观！ 现在你会发现不同类型的补全拥有其特色的提示图标！
- 现在我们为属性提供了补全服务，并且让它能够正确的停在两个引号之间
- 修复了多次换行导致补全与悬浮提示失效的问题
- 修复了多个空格引发的补全不稳定问题
- 修复了标签`d-column`不存在的问题

# V2.1.0

### 更新的功能点：

- 修复了在属性值引号内也会进行提示的BUG。

### 暂时存在的问题：

- 但引发了一个更为有趣的BUG

# V2.0.0

### 更新的功能点：

- 创建了element 和 attribute对象，现在不需要params文件夹了，在html_info.ts里面一起生成。
- 依据1重写了两个hovercompletion,hoverApiDetails文件，现在他们被放入一个completion.ts文件里面，并且能够对元素（类似d-button）进行提示了。
- 重写了hover和hover.api方法，现在他们合并到了一个hover.ts文件中，并且修改了元素（类似d-button）的提示样式
- 把所有功能函数合并到util.ts里面。还有一些小的优化比如减少代码冗余，减少any类型的使用等等。

### 暂时存在的问题：

- 还是没有拦截器，所有html文件都会提示
- html_info文件是由params文件夹处理来的，所以params提示不准确的地方这个也一样不准确，需要重新爬取
- 建议使用打包工具（rollup这类）直接打包会导致node_modules里面的东西全都打包进去，out和src文件夹也都打包了导致体积很大

# V1.0.4 (Mar 28th, 2020)

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