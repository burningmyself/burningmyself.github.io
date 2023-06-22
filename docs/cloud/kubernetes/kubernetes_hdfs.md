## **1.1 大数据HDFS分布式文件系统搭建**

这里我们使用5台节点来安装分布式文件系统，每台节点给了4G内存，4个core，并且每台节点已经关闭防火墙、配置主机名、设置yum源、各个节点时间同步、各个节点两两免密、安装JDK操作。5台节点信息如下：

| **节点IP** | **节点名称** |
| ---------------- | ------------------ |
| 192.168.179.4    | node1              |
| 192.168.179.5    | node2              |
| 192.168.179.6    | node3              |
| 192.168.179.7    | node4              |
| 192.168.179.8    | node5              |

下面一一进行基础技术组件搭建。

备注：修改阿里镜像源：

```
#安装wget，wget是linux最常用的下载命令(有些系统默认安装，可忽略)
yum -y install wget

#备份当前的yum源
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup

#下载阿里云的yum源配置
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo

#清除原来文件缓存，构建新加入的repo结尾文件的缓存
yum clean all
yum makecache
```

### 1.1.1 **搭建Zookeeper**

这里搭建zookeeper版本为3.4.13，搭建zookeeper对应的角色分布如下：

| **节点IP** | **节点名称** | **Zookeeper** |
| ---------------- | ------------------ | ------------------- |
| 192.168.179.4    | node1              |                     |
| 192.168.179.5    | node2              |                     |
| 192.168.179.6    | node3              | ★                  |
| 192.168.179.7    | node4              | ★                  |
| 192.168.179.8    | node5              | ★                  |

具体搭建步骤如下:

1) **上传zookeeper并解压,配置环境变量**

在node1,node2,node3,node4,node5各个节点都创建/software目录，方便后期安装技术组件使用。

```
mkdir /software
```

将zookeeper安装包上传到node3节点/software目录下并解压：

```
[root@node3 software]# tar -zxvf ./zookeeper-3.4.13.tar.gz
```

在node3节点配置环境变量：

```
#进入vim /etc/profile，在最后加入：
export ZOOKEEPER_HOME=/software/zookeeper-3.4.13
export PATH=$PATH:$ZOOKEEPER_HOME/bin

#使配置生效
source /etc/profile
```

2) **在node3节点配置zookeeper**

进入“/software/zookeeper-3.4.13/conf”修改zoo_sample.cfg为zoo.cfg：

```
[root@node3 conf]# mv zoo_sample.cfg  zoo.cfg
```

配置zoo.cfg中内容如下：

```
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/opt/data/zookeeper
clientPort=2181
server.1=node3:2888:3888
server.2=node4:2888:3888
server.3=node5:2888:3888
```

3) **将配置好的zookeeper发送到node4,node5节点**

```
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/opt/data/zookeeper
clientPort=2181
server.1=node3:2888:3888
server.2=node4:2888:3888
server.3=node5:2888:3888
```

4) **各个节点上创建数据目录，并配置zookeeper环境变量**

在node3,node4,node5各个节点上创建zoo.cfg中指定的数据目录“/opt/data/zookeeper”。

```
mkdir -p /opt/data/zookeeper
```

在node4,node5节点配置zookeeper环境变量

```
#进入vim /etc/profile，在最后加入：
export ZOOKEEPER_HOME=/software/zookeeper-3.4.13
export PATH=$PATH:$ZOOKEEPER_HOME/bin

#使配置生效
source /etc/profile
```

5) **各个节点创建节点ID**

在node3,node4,node5各个节点路径“/opt/data/zookeeper”中添加myid文件分别写入1,2,3:

```
#在node3的/opt/data/zookeeper中创建myid文件写入1
#在node4的/opt/data/zookeeper中创建myid文件写入2
#在node5的/opt/data/zookeeper中创建myid文件写入3
```

6) **各个节点启动zookeeper,并检查进程状态**

```
#各个节点启动zookeeper命令
zkServer.sh start

#检查各个节点zookeeper进程状态
zkServer.sh status
```

### 1.1.2 **搭建HDFS**

这里搭建HDFS版本为3.3.4，搭建HDFS对应的角色在各个节点分布如下：

| **节点IP** | **节点名称** | **NN** | **DN** | **ZKFC** | **JN** | **RM** | **NM** |
| ---------------- | ------------------ | ------------ | ------------ | -------------- | ------------ | ------------ | ------------ |
| 192.168.179.4    | node1              | ★           |              | ★             |              | ★           |              |
| 192.168.179.5    | node2              | ★           |              | ★             |              | ★           |              |
| 192.168.179.6    | node3              |              | ★           |                | ★           |              | ★           |
| 192.168.179.7    | node4              |              | ★           |                | ★           |              | ★           |
| 192.168.179.8    | node5              |              | ★           |                | ★           |              | ★           |

搭建具体步骤如下：

1) **各个节点安装HDFS HA自动切换必须的依赖**

```
yum -y install psmisc
```

2) **上传下载好的Hadoop安装包到node1节点上，并解压**

```
[root@node1 software]# tar -zxvf ./hadoop-3.3.4.tar.gz
```

3) **在node1节点上配置Hadoop的环境变量**

```
[root@node1 software]# vim /etc/profile
export HADOOP_HOME=/software/hadoop-3.3.4/
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:

#使配置生效
source /etc/profile
```

4) **配置$HADOOP_HOME/etc/hadoop下的hadoop-env.sh文件**

```
#导入JAVA_HOME
export JAVA_HOME=/usr/java/jdk1.8.0_181-amd64/
```

5) **配置$HADOOP_HOME/etc/hadoop下的hdfs-site.xml文件**

```
<configuration>
    <property>
        <!--这里配置逻辑名称，可以随意写 -->
        <name>dfs.nameservices</name>
        <value>mycluster</value>
    </property>
    <property>
        <!-- 禁用权限 -->
        <name>dfs.permissions.enabled</name>
        <value>false</value>
    </property>
    <property>
        <!-- 配置namenode 的名称，多个用逗号分割  -->
        <name>dfs.ha.namenodes.mycluster</name>
        <value>nn1,nn2</value>
    </property>
    <property>
        <!-- dfs.namenode.rpc-address.[nameservice ID].[name node ID] namenode 所在服务器名称和RPC监听端口号  -->
        <name>dfs.namenode.rpc-address.mycluster.nn1</name>
        <value>node1:8020</value>
    </property>
    <property>
        <!-- dfs.namenode.rpc-address.[nameservice ID].[name node ID] namenode 所在服务器名称和RPC监听端口号  -->
        <name>dfs.namenode.rpc-address.mycluster.nn2</name>
        <value>node2:8020</value>
    </property>
    <property>
        <!-- dfs.namenode.http-address.[nameservice ID].[name node ID] namenode 监听的HTTP协议端口 -->
        <name>dfs.namenode.http-address.mycluster.nn1</name>
        <value>node1:50070</value>
    </property>
    <property>
        <!-- dfs.namenode.http-address.[nameservice ID].[name node ID] namenode 监听的HTTP协议端口 -->
        <name>dfs.namenode.http-address.mycluster.nn2</name>
        <value>node2:50070</value>
    </property>

    <property>
        <!-- namenode 共享的编辑目录， journalnode 所在服务器名称和监听的端口 -->
        <name>dfs.namenode.shared.edits.dir</name>
        <value>qjournal://node3:8485;node4:8485;node5:8485/mycluster</value>
    </property>

    <property>
        <!-- namenode高可用代理类 -->
        <name>dfs.client.failover.proxy.provider.mycluster</name>
        <value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
    </property>

    <property>
        <!-- 使用ssh 免密码自动登录 -->
        <name>dfs.ha.fencing.methods</name>
        <value>sshfence</value>
    </property>

    <property>
        <name>dfs.ha.fencing.ssh.private-key-files</name>
        <value>/root/.ssh/id_rsa</value>
    </property>

    <property>
        <!-- journalnode 存储数据的地方 -->
        <name>dfs.journalnode.edits.dir</name>
        <value>/opt/data/journal/node/local/data</value>
    </property>

    <property>
        <!-- 配置namenode自动切换 -->
        <name>dfs.ha.automatic-failover.enabled</name>
        <value>true</value>
    </property>

</configuration>
```

6) **配置$HADOOP_HOME/ect/hadoop/core-site.xml**

```
<configuration>
    <property>
        <!-- 为Hadoop 客户端配置默认的高可用路径  -->
        <name>fs.defaultFS</name>
        <value>hdfs://mycluster</value>
    </property>
    <property>
        <!-- Hadoop 数据存放的路径，namenode,datanode 数据存放路径都依赖本路径，不要使用 file:/ 开头，使用绝对路径即可
            namenode 默认存放路径 ：file://${hadoop.tmp.dir}/dfs/name
            datanode 默认存放路径 ：file://${hadoop.tmp.dir}/dfs/data
        -->
        <name>hadoop.tmp.dir</name>
        <value>/opt/data/hadoop/</value>
    </property>

    <property>
        <!-- 指定zookeeper所在的节点 -->
        <name>ha.zookeeper.quorum</name>
        <value>node3:2181,node4:2181,node5:2181</value>
    </property>

</configuration>
```

7) **配置$HADOOP_HOME/etc/hadoop/yarn-site.xml**

```
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <property>
        <name>yarn.nodemanager.env-whitelist</name>
        <value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAPRED_HOME</value>
    </property>

    <property>
        <!-- 配置yarn为高可用 -->
        <name>yarn.resourcemanager.ha.enabled</name>
        <value>true</value>
    </property>
    <property>
        <!-- 集群的唯一标识 -->
        <name>yarn.resourcemanager.cluster-id</name>
        <value>mycluster</value>
    </property>
    <property>
        <!--  ResourceManager ID -->
        <name>yarn.resourcemanager.ha.rm-ids</name>
        <value>rm1,rm2</value>
    </property>
    <property>
        <!-- 指定ResourceManager 所在的节点 -->
        <name>yarn.resourcemanager.hostname.rm1</name>
        <value>node1</value>
    </property>
    <property>
        <!-- 指定ResourceManager 所在的节点 -->
        <name>yarn.resourcemanager.hostname.rm2</name>
        <value>node2</value>
    </property>
    <property>
        <!-- 指定ResourceManager Http监听的节点 -->
        <name>yarn.resourcemanager.webapp.address.rm1</name>
        <value>node1:8088</value>
    </property>
    <property>
        <!-- 指定ResourceManager Http监听的节点 -->
        <name>yarn.resourcemanager.webapp.address.rm2</name>
        <value>node2:8088</value>
    </property>
    <property>
        <!-- 指定zookeeper所在的节点 -->
        <name>yarn.resourcemanager.zk-address</name>
        <value>node3:2181,node4:2181,node5:2181</value>
</property>
<property>
       <!-- 关闭虚拟内存检查 -->
    <name>yarn.nodemanager.vmem-check-enabled</name>
    <value>false</value>
</property>
	<!-- 启用节点的内容和CPU自动检测，最小内存为1G -->
    <!--<property>
        <name>yarn.nodemanager.resource.detect-hardware-capabilities</name>
        <value>true</value>
    </property>-->
</configuration>
```

8) **配置$HADOOP_HOME/etc/hadoop/mapred-site.xml**

```
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>
```

9) **配置$HADOOP_HOME/etc/hadoop/workers文件**

```
[root@node1 ~]# vim /software/hadoop-3.3.4/etc/hadoop/workers
node3
node4
node5
```

10) **配置$HADOOP_HOME/sbin/start-dfs.sh 和stop-dfs.sh两个文件中顶部添加以下参数，防止启动错误**

```
HDFS_DATANODE_USER=root
HDFS_DATANODE_SECURE_USER=hdfs
HDFS_NAMENODE_USER=root
HDFS_JOURNALNODE_USER=root
HDFS_ZKFC_USER=root
```

11) **配置$HADOOP_HOME/sbin/start-yarn.sh和stop-yarn.sh两个文件顶部添加以下参数，防止启动错误**

```
YARN_RESOURCEMANAGER_USER=root
YARN_NODEMANAGER_USER=root
```

12) **将配置好的Hadoop安装包发送到其他4个节点**

```
[root@node1 ~]# scp -r /software/hadoop-3.3.4 node2:/software/
[root@node1 ~]# scp -r /software/hadoop-3.3.4 node3:/software/
[root@node1 ~]# scp -r /software/hadoop-3.3.4 node4:/software/
[root@node1 ~]# scp -r /software/hadoop-3.3.4 node5:/software/
```

13) **在node2、node3、node4、node5节点上配置HADOOP_HOME**

```
#分别在node2、node3、node4、node5节点上配置HADOOP_HOME
vim /etc/profile
export HADOOP_HOME=/software/hadoop-3.3.4/
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:

#最后记得Source
source /etc/profile
```

14) **启动HDFS和Yarn**

```
#在node3,node4,node5节点上启动zookeeper
zkServer.sh start

#在node1上格式化zookeeper
[root@node1 ~]# hdfs zkfc -formatZK

#在每台journalnode中启动所有的journalnode,这里就是node3,node4,node5节点上启动
hdfs --daemon start journalnode

#在node1中格式化namenode
[root@node1 ~]# hdfs namenode -format

#在node1中启动namenode,以便同步其他namenode
[root@node1 ~]# hdfs --daemon start namenode

#高可用模式配置namenode,使用下列命令来同步namenode(在需要同步的namenode中执行，这里就是在node2上执行):
[root@node2 software]# hdfs namenode -bootstrapStandby

#node1上启动HDFS,启动Yarn
[root@node1 sbin]# start-dfs.sh
[root@node1 sbin]# start-yarn.sh
注意以上也可以使用start-all.sh命令启动Hadoop集群。
```

15) **访问WebUI**

```
#访问HDFS : http://node1:50070
#访问Yarn WebUI ：http://node1:8088
```

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1666918405095/222e6bbeeb6942d3bd453576c2ace737.png)

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/20/1666918405095/ccb112a251d042408f66f52db1155be7.png)

18) **停止集群**

```
#停止集群 
[root@node1 ~]# stop-dfs.sh 
[root@node1 ~]# stop-yarn.sh
注意：以上也可以使用 stop-all.sh 停止集群。
```
