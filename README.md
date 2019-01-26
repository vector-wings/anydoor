# anydoor
Tiny NodeJS Static Web Server

## .gitignore匹配模式
    1、匹配模式前 / 代表项目根目录
    2、匹配模式最后加 / 代表是目录
    3、匹配模式前加 ！代表取反
    4、* 代表任意字符
    5、? 匹配任意一个字符
    6、** 匹配多级目录
    
## 版本号含义
    x.y.z
    修复bug，升级z位
    新增功能，并兼容之前，升级y位
    大版本升级，不保证兼容，升级x位
## 热加载
    supervisor组件
    
## Node.js 需要注意的地方
    __dirname: 总是返回被执行的 js 所在【文件夹】的绝对路径
    __filename: 总是返回被执行的 js 【文件】的绝对路径
    process.cwd(): 总是返回运行 node 命令时所在的文件夹的绝对路径
    
## 安装
```
    npm i -g anydoor
```
```    
    anydoor  # 把当前文件夹作为静态资源服务器根目录
    anydoor -p 8080  # 设置端口号
    anydoor -h localhost  # 设置host为localhost
    anydoor -d /usr  # 设置根目录为/usr
```
