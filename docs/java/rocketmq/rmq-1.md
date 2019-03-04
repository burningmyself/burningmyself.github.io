# RocketMq下载与安装

本文讲解下载并安装单机版RocketMq，linux环境。

### 正文介绍：

目前 RocketMQ 已经成为Apache 顶级项目 。 在阿里内部， RocketMQ 很好地服务了 集 团大大小小上千个应 用，在每年的双十一当天，更有不可思议的万亿级消息通过 RocketMQ 流转(在 2017 年的双十一当天，整个阿里巴巴集团通过 RocketMQ 流转的线上消息达到了 万亿级，峰值 TPS 达到 5600 万)，在阿里大中台策略上发挥着举足轻重的作用 。

此外， RocketMQ 是使用 Java语言开发的，比起 Kafka 的 Scala语言和 RabbitMQ 的 Erlang 语 言，更容易找 到技术人员进行定制开发 。

#### 1.RocketMQ 由四部分组成

* 发信者     ------------>    Producer

* 收信者     ------------->   Consumer 

* 负责暂存  -------------->  Broker

* 传输的邮局 -------------> NameServer

   启动 RocketMQ 的顺序是先启动 NameServer，再启动 Broker，这时候消 息队列已 经可以提供服务了，想发送消息就使用 Producer来发送，想接收消息 就使用 Consumer来接收 。 很多应用程序既要发送，又要接收，可以启动多个Producer 和 Consumer 来发送多种消息，同时接收多种消息 。         

#### 2.那么RocketMq有什么用？

1. 应用解藕

2. 流量消峰：把一秒内下的订单分散成一段时间来处理，这时有些用户可 能在下单后十几秒才能收到下单成功的状态，但是也比不能下单的体验要好。

3. 消息分发：数据的产生方只 需要把各自的数据写人一个消息队列即可 数据使用方根据各自需求订阅感兴 趣的数据，不同数据团队所订阅的数据可以重复也可以不重复，互不干扰，也 不必和数据产生方关联

除了上面列出的应用解棉、流量消峰、消息分发等功能外，消息队列还有保证最终一致性、方便动态扩容等功能。

#### 3.安装使用
``` shell
    -- 下载
    wget -c http://mirror.bit.edu.cn/apache/rocketmq/4.4.0/rocketmq-all-4.4.0-bin-release.zip
    -- 解压
    unzip rocketmq-all-4.4.0-bin-release.zip
    -- Start Name Server
    nohup sh bin/mqnamesrv
    -- Start Broker
    nohup sh bin/mqbroker -n localhost:9876 
    -- 发送
    rocketmq-all-4.3.0/distribution/target/apache-rocketmq 当前目录下 执行  export NAMESRV ADDR=localhost:9876 执行  sh bin/tools.sh org.apache.rocketmq.example.quickstart.Producer 效果SendResult [sendStatus=SEND OK, msgid= 省略很多
    -- 接收
    sh bin/tools.sh org.apache.rocketmq.example.quickstart.Consumer 效果 ConsumeMessageThread 主d Receive New Messages : [MessageExt 省略
    -- 闭消息队列
    sh bin/mqshutdown broker
    sh bin/mqshutdown namesrv
```
