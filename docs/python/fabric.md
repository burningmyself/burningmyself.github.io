# 远程部署神器 Fabric，支持 Python3

如果你搜一圈 “Fabric “关键字，你会发现 90% 的资料都是过时的，因为现在 Fabric 支持 Python3，但是它又不兼容旧版 Fabric。所以，如果你按照那些教程去操作的话根本跑不通。

如果你还没用过 Fabric，那么这篇文章就是帮你快速上手 Fabric 的。不管你现在用不用，先了解了以后也用得着。

平时我们的开发流程是这样，经过几个月奋战，项目终于开发完了，测试也没问题了，我们就把代码提交到 GitHub 那样的托管平台，准备部署到正式环境。你小心翼翼地登录到正式服务器，进入到项目目录中，把代码从远程仓库拉下来，然后启动程序。后面每次有新功能发布或者哪怕只是修改了一个小小的 Bug 时，你都要执行重复的操作，登录服务器，切换到指定目录，拉取代码，重启服务。

其实这种操作非常繁琐，也没什么技术含量，还容易出问题，于是 Fabric 出场了。Fabric 是一个远程部署神器，它可以在本地执行远程服务器的命令。

怎么做？很简单，就几个步骤。

### 安装 Fabric
```
pip install fabric --upgrade
```

注意，如果你安装的是旧版的 Fabric，那么新版的 Fabric 是不兼容旧版的，目前 Fabric 有三个版本，Fabric1 就是以前的 Fabric，只支持 Python2，已不推荐使用，而 Fabric2 就是现在的 Fabric，同时支持 Python2 和 Python3， 也是官方强烈推荐的版本， 还有一个 Fabric3，这是网友从旧版的 Fabric1 克隆过来的非官方版本，但是兼容 Fabric1，也支持 Python2 和 Python3。

最新的 Fabric 不需要 fabfile.py 文件， 也不需要 fab 命令，而现在网络上几乎所有的教程、资料都还是基于 fabric1 写的，当你在看那些教程的时候，注意甄别。  而新版 Fabric 提供的 API 非常简单。

### 运行命令

先看个例子，下面是一段部署脚本

```python
# deploy.py
# 1.  创建一个远程连接
# 2. 进入指定目录
# 3. 在指定目录下面执行重启命令

from fabric import Connection

def main():
    # ip 我是随便填的
    # 如果你的电脑配了ssh免密码登录，就不需要 connect_kwargs 来指定密码了。
    c = Connection("root@232.231.231.22", connect_kwargs={"password": "youpassword"})

    with c.cd('/var/www/youproject'):
        c.run("git pull origin master")
        c.run("/usr/bin/supervisorctl -c ../supervisor/supervisord.conf restart youproject")

if __name__ == '__main__':
    main()
```
执行

```
python deploy.py
```
执行完成后，最新代码就已经部署到正式环境并重启了服务，是不是非常方便，妈妈再也不要担心我在正式环境敲错命令删数据库跑路了。

Fabric 不仅支持 Linux，而且在 Windows 平台也能很好的运行，在中小型项目，它是非常不错的运维工具，有了 Frabic ，管理上百台服务器都不成问题。

### 构建连接

```python
class Connection(Context):
    host = None
    user = None
    port = None
    ssh_config = None
    connect_timeout = None
    connect_kwargs = None
    ...
```

构建 Connection 对象的方式有不同的方式，例如你可以将 host 写成 “root@192.168.101.1:22” ，也可以作为3个参数分开写。而 connect_kwargs 是字典对象，通常填服务器的登录密码或者密钥。

### 上传文件

run 方法用于执行命令，cd 进入指定目录，put 方法用于上传文件， 例如：
```python
from fabric import Connection
c = Connection('web1')
c.put('myfiles.tgz', '/opt/mydata')
c.run('tar -C /opt/mydata -xzvf /opt/mydata/myfiles.tgz')
```

### 多台服务器
如果是要在多台服务器运行命令，简单的办法就是使用迭代，挨个服务器执行命令：
```python
# web1,web2,mac1 都是服务器的名字，你也可以用ip代替
>>> from fabric import Connection
>>> for host in ('web1', 'web2', 'mac1'):
>>>     result = Connection(host).run('uname -s')
...     print("{}: {}".format(host, result.stdout.strip()))
...
web1: Linux
web2: Linux
mac1: Darwin
```
或者使用 SerialGroup

```python
from fabric import SerialGroup as Group
pool = Group('web1', 'web2', 'web3', connect_kwargs={"password": "youpassword"} )
pool.put('myfiles.tgz', '/opt/mydata')
pool.run('tar -C /opt/mydata -xzvf /opt/mydata/myfiles.tgz')
```

Group(*hosts, **kwargs) 参数说明：

*hosts: 可以传入多个主机名或IP
**kwargs 接收的参数可以和Connection一样，可以指定密码

本文完，你 get 了吗？  
[更多参考请点击：](https://www.fabfile.org/)https://www.fabfile.org/
