const digo = require('digo')
const path = require('path')

const targetDir = path.resolve(__dirname, '../doc') // 目标文件夹
const destFile = path.resolve(__dirname, '../README.md') // 输出文件

const entries = digo.readDir(targetDir).filter((name) => name != 'images')

let doc_tpl = `# beezen 的日常记录\n\n[beezen博客地址](http://www.dongbizhen.com)\n\n## 目录`

entries.forEach((name) => {
  doc_tpl += `\n\n- [${name}](./doc/${name})`
})

digo.writeFile(destFile, doc_tpl)
