## 说明文档
公共模块，组件，指令，mixin,utils,style等

## 使用方法

安装 npm i wjh-common --registry http://172.30.1.32:9527
如更新记得修改版本号
main.js 引入 (其他页面按照vue正常引入使用就好)

1. （全部组件引入）
  import wjhComponents from 'wjh-common' // 全部引入
  Vue.use(wjhComponents) //使用

2. （组件按需引入）


import Layout from 'wjh-common/components/wjhLayout'

import {Layout} from 'wjh-common'; // 按需引入

Vue.component('Layout', Layout); // 注册组件

3. （引入utils对象）


import utils from 'wjh-common/utils';


import {utils} from 'wjh-common';


utils.test(); //使用

4. （按需引入方法）


import {test} from 'wjh-common/utils';


test() //使用


5. （样式css引入）


import 'wjh-common/styles/index.scss'; // 全局样式

6. （vue.config.js中设置的别名 , 如开发环境的时候使用本地组件方便调试引入以下代码）
- 1. const commonUrl = process.env.NODE_ENV === 'development' ? resolve('../wjh-common') : 'wjh-common'
- 2. config.resolve.alias:{'@wjh': commonUrl}
- 3. 使用本地组件调试如果报eslint错误，请安装 
   -  "eslint-config-standard": "^14.1.1",
   -  "eslint-plugin-html": "^6.0.2",
   -  "eslint-plugin-import": "^2.20.2",
   -  "eslint-plugin-node": "^11.1.0",
   -  "eslint-plugin-promise": "^4.2.1",
   -  "eslint-plugin-standard": "^4.0.1",

## 项目说明
由于系统中共同组件较多，所以采用NPM私服来管理公共组件等模块，方便统一调整。

## 维护方式
正常项目维护，
1. 项目GIT地址 
2. 开发完成后git提交备份  
3. 修改 package.json 内的版本号
4. 发包 npm publish --registry http://172.30.1.32:9527

## 文件目录结构
自己看

## 版本更新说明
1. 抽离整个layoutz组件。
2. 新增公共搜索组件。
3. 新增弹框默认带form组件。
4. 统一UI样式，新增公共config.scss配置文件
5. 优化mixin

