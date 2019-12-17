# linux 常用相关命令整理

## ps

`ps -e`:显示所有进程的记录，需要筛选时，结合 grep 等文本处理命令。

`ps -l`:列出进程的最基本信息，包括 s、pid、ppid、time 和 ucmd 等字段信息。

`ps u`:列出 cpu 使用率、mem 使用率、rss 内存等字段信息。

## rsync

`rsync [OPTION]... SRC DEST` :使本地和远程两个主机之间的文件达到同步

`rsync -avzp /home/src root@192.168.xx.xx:/root/dest` :本地目录`/home/src`下文件增量同步到远程`root@192.168.xx.xx:/root/dest`目录下

- `-a`:归档模式，表示以递归方式传输文件，并保持所有文件属性
- `-v`:详细模式输出
- `-z`:对备份的文件在传输时进行压缩处理
- `-p`:保持文件权限

## scp

`scp [可选参数] file_source file_target` :使本地和远程两个主机之间的文件达到同步

`scp -r /home/src root@192.168.xx.xx:/root/dest` :本地目录`/home/src`下文件全量同步到远程`root@192.168.xx.xx:/root/dest`目录下

- `-r`:递归复制整个目录
- `-p`:保持文件权限
- `-v`:详细模式输出
- `-C`:使能压缩选项

## ssh

登录远程：

`ssh xxx@192.168.xxx.xxx [CMD]` :远程操作命令

`ssh -tt -l login_name xxx@192.168.xxx.xxx 'cd /root/xxx;mkdir ceshi'` :登录远程，并在 `root/xxx` 下建立 `ceshi` 文件目录

- `-tt`:效果和`-t`一致，强制分配伪终端
- `-l`:指定登录远程主机的用户

密钥相关：

```bash
ssh-keygen -t rsa # 生成
## id_rsa --> 私钥(钥匙)
## id_rsa.pub --> 公钥(锁)

ssh-copy-id root@192.168.xx.xxx # 将公钥拷贝到远程服务器
```

## vim

`vi test.json`:阅读文件 `test.json`

退出命令：

```bash
:q # 退出
:q! # 强制退出
:w # 保存，但不退出
:w! # 强制存，但不退出
:wq # 保存，并退出
:x # 有修改就保存，没有就退出
```

操作命令：

```bash
i # 当前光标插入
o # 下新行插入
O # 上新行插入

dd # 剪切
yy # 复制
(n)p # 粘贴,n 表示粘贴行数，例如: `2p` 粘贴2行

gg # 回到第一行
shift + g # 到最后一行

:/搜索内容 # 当前光标向后搜索，按n查询下一个记录。例如: `:/ceshi`
:?搜索内容 # 当前光标向前搜索，按n查询下一个记录。例如: `:?ceshi`

```

## 最后-基本命令

`ls -l`:列举出当前工作目录的内容

`mkdir`:新建一个新目录

`pwd`:显示当前工作目录

`cd`:切换文件路径

`rmdir`:删除指定目录

`rm`:删除指定文件

`cp`:文件复制

`mv`:文件移动

`cat`:用户在标准输出上查看文件内容

`tail`:显示文件最后10行

`grep`:给定字符串中搜索匹配

`find`:在给定位置搜寻与条件匹配的文件

`tar`:创建、查看和提取tar压缩文件

`gzip`:创建和提取gzip压缩文件

`unzip`:解压gzip文件

`whatis`:解释当前命令，例：`whatis cd`

`who`:列出当前登录的用户名

`su`:切换不同用户

`uname`:显示系统信息，`uname -a`

`df`:查看磁盘使用情况

`top`:查看cpu占用情况
