const sidebar = require('../../conf/sidebarConf/index');
const nav = require('../../conf/navConf');
const pluginConf = require('../../conf/pluginConf');
const headConf = require('../../conf/headConf');
module.exports = {
    title: '砥砺前行',
    description: 'Stay hungry，Stay foolish',
    // theme: 'awesome',
    locales: {
        '/': {
          lang: 'zh-CN',
        }
    },
    head: headConf,
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        lastUpdated: '上次更新', // 文档更新时间：每个文件git最后提交的时间
        nav,
        sidebar,
        sidebarDepth: 2, // 将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        searchMaxSuggestions: 10,
        // 假定GitHub。也可以是一个完整的 GitLab URL。
        repo: 'liujie2019/VuePress-Blog',
        // 自定义项目仓库链接文字
        // 默认根据 `themeConfig.repo` 中的 URL 来自动匹配是 "GitHub"/"GitLab"/"Bitbucket" 中的哪个，如果不设置时是 "Source"。
        // repoLabel: '贡献代码！',
        // 以下为可选的 "Edit this page" 链接选项
        // 如果你的文档和项目位于不同仓库：
        docsRepo: 'liujie2019/VuePress-Blog',
        // 如果你的文档不在仓库的根目录下：
        docsDir: 'docs',
        // 如果你的文档在某个特定的分支（默认是 'master' 分支）：
        docsBranch: 'master',
        // 默认为 false，设置为 true 来启用，当前 markdown 的 github 代码链接
        editLinks: true,
        // 自定义编辑链接的文本。默认是 "Edit this page"
        editLinkText: '查看原文 | 在GitHub上编辑此页'
    },
    plugins: pluginConf
}