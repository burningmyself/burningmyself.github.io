# Kubernetes原生配置管理利器 kustomize



# 一、引入kustomize原因

​    Dcoker是利用集装箱的思想，将依赖和运行环境打包成自包含、轻量级、可移植的容器，它给开发人员带来的切实好处就是一次构建、到处运行，消除了开发、测试、生产环境不一致性。看完之后，不以为然，真的可以完全消除各个环境的不一致性吗？时至今日，Kubernetes 已经上生产，但是各个环境的不一致性，仍然没有解决，大致问题就是，所有服务全部容器化不太现实，比如 MySql、Redis 等，这些服务本身已经存在现有的、稳定的部署方式，且这些服务是不怎么变动的，当然可以使用 Kubernetes 把数据库打成镜像，通过有状态服务资源对象编排，纳入到 Kubernetes 集群管理当中，实现动态扩缩容。但对于中小企业来说，最急切的还是自己业务，对于数据库服务还是使用原有服务器部署，最大程度上降低研发成本。这就带来了如下几个问题：

- 其一、开发环境和测试环境连接的数据库地址不是同一个，线上环境更是不同，每次上线都需要维护三份，甚至更多配置即 Kubernetes ConfigMap。


- 其二、通过镜像解决了各个环境的打包问题，但是随之而来的是大量 yaml 编排文件，编排文件如何管理？各个环境虽然镜像一样，但是配置参数可能不同，比如：开发一个副本，但是生产可能需要三个等等。


- 其三、yaml 配置较多，要么一个个执行，或者单独维护脚本批量执行 yaml。

​    为了解决不同应用在不同环境中存在使用不同配置参数的复杂问题，容器的生态系统出现了 helm，它大大简化了应用管理的难度，简单来说，helm 类似于 Kubernetes 程序包管理器，用于应用的配置、分发、版本控制、查找等操作。它的核心功能是把 Kubernetes 资源对象（Deployment、ConfigMap、Service）打包到一个 Charts 中，制作完成各个 Charts 保存到 Chart 仓库进行存储和转发，虽然 helm 可以解决 Kubernetes 资源对象生命周期管理以及通过模板的版本控制，但是 helm 使用起来复杂，只想管理几个不同环境 yaml 配置，helm 搞了很多模板等概念，且不支持多租户，虽然 helm v3 抛弃了tiller，同时引入了 lua，本想简单解决 yaml 编排文件问题，却引入更高的复杂度。

​    但云原生社区从来不会让我们失望，随之而来的，就是 Kustomize，只有一个 cli 工具，通过这个工具可以打包不同环境的配置，在 Kubernetes 1.14 版本之后，直接集成到 kubectl 命令中，通过执行 kubectl apply -k 命令就可以完成不同环境应用的打包，可以说相当简单。下面对 Kustomize 进行介绍。



# 二、Kustomize 设计理念

Kustomize 允许用户以一个应用描述文件 （YAML 文件）为基础（Base YAML），然后通过 Overlay 的方式生成最终部署应用所需的描述文件。两者都是由 kustomization 文件表示。基础（Base）声明了共享的内容（资源和常见的资源配置），Overlay 则声明了差异。它的设计目的是给 kubernetes 的用户提供一种可以重复使用同一套配置的声明式应用管理，从而在配置工作中用户只需要管理和维护kubernetes的API对象，而不需要学习或安装其它的配置管理工具，也不需要通过复制粘贴来得到新的环境的配置。





# 三、kustomize作用

[Kustomize](https://github.com/kubernetes-sigs/kustomize) 是一个独立的工具，用来通过 [kustomization 文件](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization) 定制 Kubernetes 对象。

- 从其他来源生成资源          (依据从其它资源生成资源)
- 为资源设置贯穿性字段     (设置资源字段)
- 组织和定制资源集合        (组合和定制资源集合)





# 四、kustomize使用

## 4.1 通过kubectl使用 kustomization 文件来管理 Kubernetes 对象介绍

> 从 1.14 版本开始，`kubectl` 也开始支持使用 kustomization 文件来管理 Kubernetes 对象，所以你必须拥有一个 Kubernetes 的集群，同时你的 Kubernetes 集群必须带有 kubectl 命令行工具



## 4.2 命令格式

```powershell
查看包含 kustomization 文件的目录中的资源
kubectl kustomize <kustomization_directory>
```



~~~powershell
应用这些资源，使用 --kustomize 或 -k 参数来执行 kubectl apply
kubectl apply -k <kustomization_directory>
~~~



## 4.3 命令使用

### 4.3.1 生成资源

ConfigMap 和 Secret 包含其他 Kubernetes 对象（如 Pod）所需要的配置或敏感数据。 ConfigMap 或 Secret 中数据的来源往往是集群外部，例如某个 `.properties` 文件或者 SSH 密钥文件。 Kustomize 提供 `secretGenerator` 和 `configMapGenerator`，可以基于文件或字面值来生成 Secret 和 ConfigMap。

##### 4.3.1.1 configMapGenerator生成configMap

##### 4.3.1.1.1 基于属性文件来生成 ConfigMap

要基于文件来生成 ConfigMap，可以在 `configMapGenerator` 的 `files` 列表中添加表项。 下面是一个根据 `.properties` 文件中的数据条目来生成 ConfigMap 的示例：

```powershell
# 生成一个  application.properties 文件
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

所生成的 ConfigMap 可以使用下面的命令来检查：

```powershell
kubectl kustomize ./
```

所生成的 ConfigMap 为：

```yaml
apiVersion: v1
data:
  application.properties: |
        FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-8mbdf7882g
```



##### 4.3.1.1.2 env 文件生成 ConfigMap



要从 env 文件生成 ConfigMap，请在 `configMapGenerator` 中的 `envs` 列表中添加一个条目。 下面是一个用来自 `.env` 文件的数据生成 ConfigMap 的例子：

```shell
# 创建一个 .env 文件
cat <<EOF >.env
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  envs:
  - .env
EOF
```

可以使用以下命令检查生成的 ConfigMap：

```shell
kubectl kustomize ./
```

生成的 ConfigMap 为：

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-42cfbf598f
```

**说明：** `.env` 文件中的每个变量在生成的 ConfigMap 中成为一个单独的键。 这与之前的示例不同，前一个示例将一个名为 `.properties` 的文件（及其所有条目）嵌入到同一个键的值中。



#### 4.3.1.2  使用生成的configMap

要在 Deployment 中使用生成的 ConfigMap，使用 configMapGenerator 的名称对其进行引用。 Kustomize 将自动使用生成的名称替换该名称。

这是使用生成的 ConfigMap 的 deployment 示例：

```yaml
# 创建一个 application.properties 文件
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app
        volumeMounts:
        - name: config
          mountPath: /config
      volumes:
      - name: config
        configMap:
          name: example-configmap-1
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

生成 ConfigMap 和 Deployment：

```shell
kubectl kustomize ./
```

生成的 Deployment 将通过名称引用生成的 ConfigMap：

```yaml
apiVersion: v1
data:
  application.properties: |
        FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-g4hk9g2ff8

---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: my-app
  name: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - image: my-app
        name: app
        volumeMounts:
        - mountPath: /config
          name: config
      volumes:
      - configMap:
          name: example-configmap-1-g4hk9g2ff8
        name: config
```



#### 4.3.1.2 设置贯穿性字段

在项目中为所有 Kubernetes 对象设置贯穿性字段是一种常见操作。 贯穿性字段的一些使用场景如下：

- 为所有资源设置相同的名字空间
- 为所有对象添加相同的前缀或后缀
- 为对象添加相同的标签(Labels)集合
- 为对象添加相同的注解(annotations)集合

```shell
# 创建一个 deployment.yaml
cat <<EOF >./deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
EOF

cat <<EOF >./kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
commonLabels:
  app: bingo
commonAnnotations:
  oncallPager: 400-500-600
resources:
- deployment.yaml
EOF
```

执行 `kubectl kustomize ./` 查看这些字段都被设置到 Deployment 资源上：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    oncallPager: 400-500-600
  labels:
    app: bingo
  name: dev-nginx-deployment-001
  namespace: my-namespace
spec:
  selector:
    matchLabels:
      app: bingo
  template:
    metadata:
      annotations:
        oncallPager: 400-500-600
      labels:
        app: bingo
    spec:
      containers:
      - image: nginx
        name: nginx
```



#### 4.3.1.3 组合和定制资源

一种常见的做法是在项目中构造资源集合并将其放到同一个文件或目录中管理。 Kustomize 提供基于不同文件来组织资源并向其应用补丁或者其他定制的能力。

##### 4.3.1.3.1 组合

Kustomize 支持组合不同的资源。`kustomization.yaml` 文件的 `resources` 字段定义配置中要包含的资源列表。 你可以将 `resources` 列表中的路径设置为资源配置文件的路径。 下面是由 Deployment 和 Service 构成的 NGINX 应用的示例：

```shell
# 创建 deployment.yaml 文件
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# 创建 service.yaml 文件
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# 创建 kustomization.yaml 来组织以上两个资源
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

`kubectl kustomize ./` 所得到的资源中既包含 Deployment 也包含 Service 对象。



##### 4.3.1.3.2 定制

###### 4.3.1.3.2.1 patchesStrategicMerge

补丁文件（Patches）可以用来对资源执行不同的定制。 Kustomize 通过 `patchesStrategicMerge` 和 `patchesJson6902` 支持不同的打补丁机制。 `patchesStrategicMerge` 的内容是一个文件路径的列表，其中每个文件都应可解析为 [策略性合并补丁（Strategic Merge Patch）](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/strategic-merge-patch.md)。 补丁文件中的名称必须与已经加载的资源的名称匹配。 建议构造规模较小的、仅做一件事情的补丁。 例如，构造一个补丁来增加 Deployment 的副本个数；构造另外一个补丁来设置内存限制。

```shell
# 创建 deployment.yaml 文件
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# 生成一个补丁 increase_replicas.yaml
cat <<EOF > increase_replicas.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
EOF

# 生成另一个补丁 set_memory.yaml
cat <<EOF > set_memory.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  template:
    spec:
      containers:
      - name: my-nginx
        resources:
          limits:
            memory: 512Mi
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
patchesStrategicMerge:
- increase_replicas.yaml
- set_memory.yaml
EOF
```

执行 `kubectl kustomize ./` 来查看 Deployment：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: 512Mi
```



###### 4.3.1.3.2.2 patchesJson6902

并非所有资源或者字段都支持策略性合并补丁。为了支持对任何资源的任何字段进行修改， Kustomize 提供通过 `patchesJson6902` 来应用 [JSON 补丁](https://tools.ietf.org/html/rfc6902)的能力。 为了给 JSON 补丁找到正确的资源，需要在 `kustomization.yaml` 文件中指定资源的组（group）、 版本（version）、类别（kind）和名称（name）。 例如，为某 Deployment 对象增加副本个数的操作也可以通过 `patchesJson6902` 来完成：

```shell
# 创建一个 deployment.yaml 文件
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# 创建一个 JSON 补丁文件
cat <<EOF > patch.yaml
- op: replace
  path: /spec/replicas
  value: 3
EOF

# 创建一个 kustomization.yaml
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml

patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: my-nginx
  path: patch.yaml
EOF
```



执行 `kubectl kustomize ./` 以查看 `replicas` 字段被更新：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
```



###### 4.3.1.3.2.3 通过kustomization.yaml文件中images字段注入

除了补丁之外，Kustomize 还提供定制容器镜像或者将其他对象的字段值注入到容器中的能力，并且不需要创建补丁。 例如，你可以通过在 `kustomization.yaml` 文件的 `images` 字段设置新的镜像来更改容器中使用的镜像。

```shell
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
images:
- name: nginx
  newName: my.image.registry/nginx
  newTag: 1.4.0
EOF
```



执行 `kubectl kustomize ./` 以查看所使用的镜像已被更新：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: my.image.registry/nginx:1.4.0
        name: my-nginx
        ports:
        - containerPort: 80
```



###### 4.3.1.3.2.4 通过变量注入字段

有些时候，Pod 中运行的应用可能需要使用来自其他对象的配置值。 例如，某 Deployment 对象的 Pod 需要从环境变量或命令行参数中读取读取 Service 的名称。 由于在 `kustomization.yaml` 文件中添加 `namePrefix` 或 `nameSuffix` 时 Service 名称可能发生变化，建议不要在命令参数中硬编码 Service 名称。 对于这种使用场景，Kustomize 可以通过 `vars` 将 Service 名称注入到容器中。

```shell
# 创建一个 deployment.yaml 文件（引用此处的文档分隔符）
cat <<'EOF' > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        command: ["start", "--host", "$(MY_SERVICE_NAME)"]
EOF

# 创建一个 service.yaml 文件
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

cat <<EOF >./kustomization.yaml
namePrefix: dev-
nameSuffix: "-001"

resources:
- deployment.yaml
- service.yaml

vars:
- name: MY_SERVICE_NAME
  objref:
    kind: Service
    name: my-nginx
    apiVersion: v1
EOF
```

执行 `kubectl kustomize ./` 以查看注入到容器中的 Service 名称是 `dev-my-nginx-001`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-my-nginx-001
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - command:
        - start
        - --host
        - dev-my-nginx-001
        image: nginx
        name: my-nginx
```



### 4.3.2 基准（Bases）与覆盖（Overlays）

Kustomize 中有 **基准（bases）** 和 **覆盖（overlays）** 的概念区分。 **基准** 是包含 `kustomization.yaml` 文件的一个目录，其中包含一组资源及其相关的定制。 基准可以是本地目录或者来自远程仓库的目录，只要其中存在 `kustomization.yaml` 文件即可。 **覆盖** 也是一个目录，其中包含将其他 kustomization 目录当做 `bases` 来引用的 `kustomization.yaml` 文件。 **基准**不了解覆盖的存在，且可被多个覆盖所使用。 覆盖则可以有多个基准，且可针对所有基准中的资源执行组织操作，还可以在其上执行定制。

```shell
# 创建一个包含基准的目录 
mkdir base
# 创建 base/deployment.yaml
cat <<EOF > base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
EOF

# 创建 base/service.yaml 文件
cat <<EOF > base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# 创建 base/kustomization.yaml
cat <<EOF > base/kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

此基准可在多个覆盖中使用。你可以在不同的覆盖中添加不同的 `namePrefix` 或其他贯穿性字段。 下面是两个使用同一基准的覆盖：

```shell
mkdir dev
cat <<EOF > dev/kustomization.yaml
bases:
- ../base
namePrefix: dev-
EOF

mkdir prod
cat <<EOF > prod/kustomization.yaml
bases:
- ../base
namePrefix: prod-
EOF
```

执行 `kubectl kustomize ./` 以查看覆盖中的资源对象



### 4.3.3  如何使用 Kustomize 来应用、查看和删除对象

在 `kubectl` 命令中使用 `--kustomize` 或 `-k` 参数来识别被 `kustomization.yaml` 所管理的资源。 注意 `-k` 要指向一个 kustomization 目录。例如：

```shell
kubectl apply -k <kustomization 目录>/
```



假定使用下面的 `kustomization.yaml`：

```shell
# 创建 deployment.yaml 文件
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# 创建 kustomization.yaml
cat <<EOF >./kustomization.yaml
namePrefix: dev-
commonLabels:
  app: my-nginx
resources:
- deployment.yaml
EOF
```

执行下面的命令来应用 Deployment 对象 `dev-my-nginx`：

```shell
kubectl apply -k ./
deployment.apps/dev-my-nginx created
```

运行下面的命令之一来查看 Deployment 对象 `dev-my-nginx`：

```shell
kubectl get -k ./
kubectl describe -k ./
```

执行下面的命令删除 Deployment 对象 `dev-my-nginx`：

```shell
kubectl delete -k ./
deployment.apps "dev-my-nginx" deleted
```



# 五、kustomize客户端应用

>通过kustomize客户端来使用 kustomization 文件来管理 Kubernetes 对象



## 5.1 kustomize客户端下载

```powershell
# curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash
# mv kustomize /usr/bin
```

命令格式

```powershell
kustomize [command] 
```



## 5.2 创建资源

`kustomize build`递归地构建指向的 kustomization.yaml，从而生成一组准备好部署的 Kubernetes 资源

```shell
# 创建一个 deployment.yaml
cat <<EOF >./deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
EOF

cat <<EOF >./kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
commonLabels:
  app: bingo
commonAnnotations:
  oncallPager: 400-500-600
resources:
- deployment.yaml
EOF
```

通过kustomize build ./ 来查看生成的Kubernetes 资源



## 5.3 修改资源

`kustomize edit`自定义的修改你的kustomization.yaml

```powershell
# 创建一个 deployment.yaml
cat <<EOF >./deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
EOF

cat <<EOF >./kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
commonLabels:
  app: bingo
commonAnnotations:
  oncallPager: 400-500-600
resources:
- deployment.yaml
EOF
```

通过kustomize edit  来修改Kubernetes 资源

```powershell
# kustomize edit set image nginx=mynginx:v1.1
# cat kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
commonLabels:
  app: bingo
commonAnnotations:
  oncallPager: 400-500-600
resources:
- deployment.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
images:
- name: nginx
  newName: mynginx
  newTag: v1.1
```

