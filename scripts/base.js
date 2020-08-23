const YAML = require("js-yaml")
const path = require("path")
const digo = require("digo")
const str = digo.readFile(path.resolve(__dirname,"../draft/20200630-Taro转快应用的那些事（二）.md")).toString()
const newstr = str.match(/---([\w\W]*)---/) && str.match(/---([\w\W]*)---/)[0].replace(/---([\w\W]*)---/,"$1")
const yarmstr = YAML.safeLoad(newstr)

console.log(yarmstr)