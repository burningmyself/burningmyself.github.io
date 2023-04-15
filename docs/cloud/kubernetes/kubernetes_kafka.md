# kubernetes云原生中间件上云部署 kafka

Apache Kafka是一种流行的分布式流式消息平台。Kafka生产者将数据写入分区主题，这些主题通过可配置的副本存储到broker群集上。 消费者来消费存储在broker的分区生成的数据。



# 一、环境说明

- storageclass
- ingress



# 二、kafka部署及部署验证

~~~powershell
# vim kafka.yaml
~~~



~~~powershell
# cat kafka.yaml
apiVersion: v1
kind: Service
metadata:
  name: kafka-svc
  labels:
    app: kafka-app
spec:
  clusterIP: None
  ports:
    - name: '9092'
      port: 9092
      protocol: TCP
      targetPort: 9092
  selector:
    app: kafka-app
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: kafka
  labels:
    app: kafka-app
spec:
  serviceName: kafka-svc
  replicas: 3
  selector:
    matchLabels:
      app: kafka-app
  template:
    metadata:
      labels:
        app: kafka-app
    spec:
      containers:
        - name: kafka-container
          image: doughgle/kafka-kraft
          ports:
            - containerPort: 9092
            - containerPort: 9093
          env:
            - name: REPLICAS
              value: '3'
            - name: SERVICE
              value: kafka-svc
            - name: NAMESPACE
              value: default
            - name: SHARE_DIR
              value: /mnt/kafka
            - name: CLUSTER_ID
              value: oh-sxaDRTcyAr6pFRbXyzA
            - name: DEFAULT_REPLICATION_FACTOR
              value: '3'
            - name: DEFAULT_MIN_INSYNC_REPLICAS
              value: '2'
          volumeMounts:
            - name: data
              mountPath: /mnt/kafka
            - name: localtime
              mountPath: /etc/localtime
      volumes:
      - name: localtime
        hostPath:
          path: /etc/localtime
          type: ''

  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes:
          - "ReadWriteOnce"
        storageClassName: nfs-client
        resources:
          requests:
            storage: "1Gi"
~~~



~~~powershell
# kubectl apply -f kafka.yaml
~~~



~~~powershell
# kubectl get pods
NAME                                     READY   STATUS    RESTARTS       AGE
kafka-0                                  1/1     Running   1 (2m4s ago)   4m22s
kafka-1                                  1/1     Running   0              3m22s
kafka-2                                  1/1     Running   0              2m9s
~~~



~~~powershell
# kubectl get svc
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
kafka-svc    ClusterIP   None         <none>        9092/TCP   4m42s
~~~





# 三、kafka应用测试

~~~powershell
创建客户端pod
# kubectl run kafka-client --rm -it --image bitnami/kafka:3.1.0 -- bash
~~~



~~~powershell
进入客户端pod
I have no name!@kafka-client:/$ ls /opt/bitnami/kafka/bin/
connect-distributed.sh        kafka-consumer-perf-test.sh  kafka-producer-perf-test.sh         kafka-verifiable-consumer.sh
connect-mirror-maker.sh       kafka-delegation-tokens.sh   kafka-reassign-partitions.sh        kafka-verifiable-producer.sh
connect-standalone.sh         kafka-delete-records.sh      kafka-replica-verification.sh       trogdor.sh
kafka-acls.sh                 kafka-dump-log.sh            kafka-run-class.sh                  windows
kafka-broker-api-versions.sh  kafka-features.sh            kafka-server-start.sh               zookeeper-security-migration.sh
kafka-cluster.sh              kafka-get-offsets.sh         kafka-server-stop.sh                zookeeper-server-start.sh
kafka-configs.sh              kafka-leader-election.sh     kafka-storage.sh                    zookeeper-server-stop.sh
kafka-console-consumer.sh     kafka-log-dirs.sh            kafka-streams-application-reset.sh  zookeeper-shell.sh
kafka-console-producer.sh     kafka-metadata-shell.sh      kafka-topics.sh
kafka-consumer-groups.sh      kafka-mirror-maker.sh        kafka-transactions.sh
~~~



~~~powershell
查看默认存在的topic
I have no name!@kafka-client:/opt/bitnami/kafka/bin$ kafka-topics.sh --list --bootstrap-server kafka-svc.default.svc.cluster.local:9092
__consumer_offsets
test
~~~



~~~powershell
创建topic
I have no name!@kafka-client:/opt/bitnami/kafka/bin$ kafka-topics.sh --bootstrap-server kafka-svc.default.svc.cluster.local:9092 --topic test01 --create --partitions 3 --replication-factor 2
~~~





~~~powershell
创建数据生产者，添加数据
I have no name!@kafka-client:/opt/bitnami/kafka/bin$ ./kafka-console-producer.sh --topic test --request-required-acks all --bootstrap-server kafka-svc.default.svc.cluster.local:9092
>hello world
~~~



~~~powershell
在当前终端或另一个终端中创建数据消费者，消费数据
I have no name!@kafka-client:/opt/bitnami/kafka/bin$ kafka-console-consumer.sh --topic test --from-beginning --bootstrap-server kafka-svc.default.svc.cluster.local:9092
~~~



~~~powershell
查看默认test topic相关描述信息
I have no name!@kafka-client:/opt/bitnami/kafka/bin$ kafka-topics.sh --describe --topic test --bootstrap-server kafka-svc.default.svc.cluster.local:9092
Topic: test     TopicId: TkbmiTw8S7Om3eVK1LwapQ PartitionCount: 1       ReplicationFactor: 3    Configs: min.insync.replicas=2,segment.bytes=1073741824
        Topic: test     Partition: 0    Leader: 2       Replicas: 2,0,1 Isr: 2,0,1
~~~



~~~powershell
查看test01 topic相关描述信息
I have no name!@kafka-client:/opt/bitnami/kafka/bin$ kafka-topics.sh --describe --topic test01  --bootstrap-server kafka-svc.default.svc.cluster.local:9092
Topic: test01   TopicId: JspG5aMhSyewmCWvUaE5ZQ PartitionCount: 3       ReplicationFactor: 2    Configs: min.insync.replicas=2,segment.bytes=1073741824
        Topic: test01   Partition: 0    Leader: 1       Replicas: 1,2   Isr: 1,2
        Topic: test01   Partition: 1    Leader: 2       Replicas: 2,0   Isr: 2,0
        Topic: test01   Partition: 2    Leader: 0       Replicas: 0,1   Isr: 0,1
~~~





