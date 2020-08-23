const digo = require('digo')
const path = require('path')
const inquirer = require('inquirer')
const YAML = require('js-yaml')

const draftDir = path.resolve(__dirname, '../draft') // 暂存文件夹
const docDir = path.resolve(__dirname, '../doc') // 发布文件夹
const destFile = path.resolve(__dirname, '../README.md') // 输出文件

let commitMsg = [] // 提交内容
const entries = digo.readDir(draftDir).reverse() // 所有暂存文章列表
const articles = entries.map((e, index) => ({
  name: e,
  value: index,
}))
// 选择需要发布的文章
inquirer
  .prompt([
    {
      type: 'checkbox',
      message: '请选择需要发布的文章',
      choices: articles,
      default: [0],
      name: 'article',
    },
  ])
  .then((answers) => {
    // 选中文章将会同步到 doc 发布文件夹
    answers.article.forEach((e) => {
      // 过滤文件头
      const fileStr = digo
        .readFile(path.resolve(draftDir, entries[e]))
        .toString()
      const newstr = fileStr.replace(/---([\w\W]*)---/, '')
      // 文件写入
      digo.writeFile(path.resolve(docDir, entries[e]), newstr)
      console.log(`${entries[e]} 已同步到 doc 目录`)
      commitMsg.push(entries[e])
    })

    // 模板
    let doc_tpl = `# beezen 的日常记录\n\n[beezen博客地址](http://www.dongbizhen.com)\n\n## 目录`
    const docEntries = digo.readDir(docDir).reverse() // 所有暂存文章列表
    docEntries.forEach((name) => {
      doc_tpl += `\n\n- [${name}](./doc/${name})`
    })

    // 输出发布的文章目录
    digo.writeFile(destFile, doc_tpl)

    // git 智能提交
    digo.exec(
      `git add . && git commit -am "${commitMsg.join(
        ','
      )}文章更新" && git push -f`
    )
  })
