
# Go基础语法

## 模块一：Go 语言特性


##### 统一思想- 12 factors

I. 基准代码
一份基准代码，多份部署

II. 依赖
显式声明依赖关系

III. 配置
在环境中存储配置

IV. 后端服务
把后端服务当作附加资源

V. 构建，发布，运行
严格分离构建和运行

VI. 进程
以一个或多个无状态进程运行应用

```
VII. 端口绑定
通过端口绑定提供服务
VIII. 并发
通过进程模型进行扩展
IX. 易处理
快速启动和优雅终止可最大化健壮性
X. 开发环境与线上环境等价
尽可能的保持开发，预发布，线上环境相同
XI. 日志
把日志当作事件流
XII. 管理进程
后台管理任务当作一次性进程运行
```
```

```

# 目录

1. 为什么需要另外一种语言？
2. Go 语言编译环境设置
3. 控制结构
4. Go 语言常用数据结构
5. Go 语言函数调用
6. 常用语法
7. 多线程
    - 深入理解 channel
    - 基于 channel 编写一个生产者消费者程序


#### 1. 为什么需要 Go 语言


```

```
###### Less is exponentially more

- Rob Pike, Go Designer

###### Do Less, Enable More

- Russ Cox, Go Tech Lead

##### Go 语言的原则


##### 为什么需要 Go 语言

- 其他编程语言的弊端。
    - 硬件发展速度远远超过软件。
    - C 语言等原生语言缺乏好的依赖管理 (依赖头文件）。
    - Java 和 C++ 等语言过于笨重。
    - 系统语言对垃圾回收和并行计算等基础功能缺乏支持。
    - 对多核计算机缺乏支持。
- Go 语言是一个可以编译高效，支持高并发的，面向垃圾回收的全新语言。
    - 秒级完成大型程序的单节点编译。
    - 依赖管理清晰。
    - 不支持继承，程序员无需花费精力定义不同类型之间的关系。
    - 支持垃圾回收，支持并发执行，支持多线程通讯。
    - 对多核计算机支持友好。


##### Go 语言不支持的特性

- 不支持函数重载和操作符重载
- 为了避免在 C/C++ 开发中的一些 Bug 和混乱，不支持隐式转换
- 支持接口抽象，不支持继承
- 不支持动态加载代码
- 不支持动态链接库
- 通过 recover 和 panic 来替代异常机制
- 不支持断言
- 不支持静态变量

如果你没做过其他语言的开发，
那么恭喜，以上大部分复杂的问题，在 Go 语言里不存在，你也无需关心。


##### Go 语言特性衍生来源

```
golang
```
```
Java Java, c#
C 语言
```
```
Limbo
```
```
Docker
Kubernetes
Istio
```
```
Javascript, Ruby 以及其
他动态语言
```
```
包定义
```
```
Unix
```
```
Plan 9
```
CSP多线程模型
(Communication Sequential Process)

```
多态支持
```
```
接口抽象
基本语法和数据结构
```
```
应用
```
```
参考：The way to go
```

#### 2. Go 语言环境搭建


##### 下载 Go

- Go 安装文件以及源代码
https://golang.google.cn/dl/
- 下载对应平台的二进制文件并安装
- 环境变量
    - GOROOT
       l go的安装目录
    - GOPATH
       l src：存放源代码
       l pkg：存放依赖包
       l bin：存放可执行文件
    - 其他常用变量
       l GOOS，GOARCH，GOPROXY
       l 国内用户建议设置 goproxy：export GOPROXY=https://goproxy.cn


##### IDE 设置（VS Code）

- 下载并安装 Visual Studio Code
https://code.visualstudio.com/download
- 安装 Go 语言插件

https://marketplace.visualstudio.com/items?itemName=golang.go

- 其他可选项
    - Intellj goland，收费软件
    - vim，sublime等


```
bug start a bug report
build compile packages and dependencies
clean remove object files and cached files
doc show documentation for package or symbol
env print Go environment information
fix update packages to use new APIs
fmt gofmt (reformat) package sources
generate generate Go files by processing source
get add dependencies to current module and install them
```
##### 一些基本命令


```
install compile and install packages and dependencies
list list packages or modules
mod module maintenance
run compile and run Go program
test test packages
tool run specified go tool
version print Go version
vet report likely mistakes in packages
```
##### 一些基本命令


##### Go build

- Go 语言不支持动态链接，因此编译时会将所有依赖编译进同一个二进制文件。
- 指定输出目录。
    - go build –o bin/mybinary.
- 常用环境变量设置编译操作系统和 CPU 架构。
    - GOOS=linux GOARCH=amd64 go build
- 全支持列表。
    - $GOROOT/src/go/build/syslist.go


##### Go test

Go 语言原生自带测试

import "testing"

func TestIncrease(t *testing.T) {
t.Log("Start testing")
increase( 1 , 2 )
}

go test ./... -v 运行测试
go test 命令扫描所有*_test.go为结尾的文件，惯例是将测试代码与正式代码放在同目录，
如 foo.go 的测试代码一般写在 foo_test.go


##### Go vet

代码静态检查，发现可能的 bug 或者可疑的构造

- Print-format 错误，检查类型不匹配的print
    str := “hello world!”
fmt.Printf("%d\n", str)
- Boolean 错误，检查一直为 true、false 或者冗余的表达式
- Range 循环，比如如下代码主协程会先退出，go routine无法被执行
    - Unreachable的代码，如 return 之后的代码
    - 其他错误，比如变量自赋值，error 检查滞后等

```
fmt.Println(i != 0 || i != 1 )
```
```
words := []string{"foo", "bar", "baz"}
for _, word := range words {
go func() {
fmt.Println(word).
}()
}
```
```
res, err := http.Get("https://www.spreadsheetdb.io/")
defer res.Body.Close()
if err != nil {
log.Fatal(err)
}
```

##### 代码版本控制

- 下载并安装 Git Command Line
    - https://git-scm.com/downloads
- Github
    - 本课程示例代码均上传在 https://github.com/cncamp/golang
- 创建代码目录
    - mkdir –p $GOPATH/src/github.com/cncamp
    - cd $GOPATH/src/github.com/cncamp
- 代码下载
    - git clone https://github.com/cncamp/golang.git
- 修改代码
- 上传代码
    - git add filename
    - git commit –m 'change logs'
    - git push


##### Golang playground

官方 playground

https://play.golang.org/

可直接编写和运行 Go 语言程序

国内可直接访问的 playground

https://goplay.tools/


#### 3. 控制结构


##### If

- 基本形式
    if condition1 {
       // do something
} else if condition2 {
// do something else
} else {
// catch-all or default
}
- if 的简短语句
    - 同 for 一样， if 语句可以在条件表达式前执行一个简单的语句。
    if v := x - 100 ; v < 0 {
       return v
}


##### switch

switch var1 {
case val1: //空分支
case val2:
fallthrough //执行case3中的f()
case val3:
f()
default: //默认分支
...
}


##### For

Go 只有一种循环结构：for 循环。

- 计入计数器的循环
for 初始化语句; 条件语句; 修饰语句{}
    for i := 0 ; i < 10 ; i++ {
       sum += i
}
- 初始化语句和后置语句是可选的，此场景与 while 等价（Go 语言不支持 while）
    for ; sum < 1000 ; {
       sum += sum
}
- 无限循环
    for {
       ifcondition1 {
          break
       }
    }


##### for-range

遍历数组，切片，字符串，Map 等
for index, char := range myString {
...

}
for key, value := range MyMap {
...
}
for index, value := range MyArray {
...
}
需要注意：如果 for range 遍历指针数组，则 value 取出的指
针地址为原指针地址的拷贝。


#### 4. 常用数据结构


##### 变量与常量

- 常量

```
const identifier type
```
- 变量

```
var identifier type
```

##### 变量定义

- 变量
    - var 语句用于声明一个变量列表，跟函数的参数列表一样，类型在最后。
    - var c, python, java bool
- 变量的初始化
    - 变量声明可以包含初始值，每个变量对应一个。
    - 如果初始化值已存在，则可以省略类型；变量会从初始值中获得类型。
    - var i, j int = 1, 2
- 短变量声明
    - 在函数中，简洁赋值语句 := 可在类型明确的地方代替 var 声明。
    - 函数外的每个语句都必须以关键字开始（var, func 等等），因此 := 结构不能在函数外使用。
    - c, python, java := true, false, "no!"


##### 类型转换与推导

- 类型转换
    - 表达式 T(v) 将值 v 转换为类型 T。
       l 一些关于数值的转换：
          l var i int = 42
          l var f float64 = float64(i)
          l var u uint = uint(f)
       l 或者，更加简单的形式：
          l i := 42
          l f := float64(i)
          l u := uint(f)
- 类型推导
    - 在声明一个变量而不指定其类型时（即使用不带类型的 := 语法或 var = 表达式语法），变量的类型由右值推导得出。
       l var i int
       l j := i // j 也是一个 int


##### 数组

- 相同类型且长度固定连续内存片段
- 以编号访问每个元素
- 定义方法
    - var identifier [len]type
- 示例
- myArray := [3]int{1,2,3}


##### 切片(slice)

- 切片是对数组一个连续片段的引用
- 数组定义中不指定长度即为切片
    - var identifier []type
- 切片在未初始化之前默认为nil， 长度为 0
- 常用方法

```
func main() {
myArray := [ 5 ]int{ 1 , 2 , 3 , 4 , 5 }
mySlice := myArray[ 1 : 3 ]
fmt.Printf("mySlice %+v\n", mySlice)
fullSlice := myArray[:]
remove3rdItem := deleteItem(fullSlice, 2 )
fmt.Printf("remove3rdItem %+v\n",
remove3rdItem)
}
func deleteItem(slice []int, index int) []int {
return append(slice[:index], slice[index+ 1 :]...)
}
```

##### Make 和 New

- New 返回指针地址
- Make 返回第一个元素，可预设内存空间，避免未来的内存拷贝
- 示例

mySlice1 := new([]int)
mySlice2 := make([]int, 0)
mySlice3 := make([]int, 10)
mySlice4 := make([]int, 10, 20)


##### 关于切片的常见问题

- 切片是连续内存并且可以动态扩展，由此引发的问题？
    a := []int
    b := []int{1,2,3}
    c := a
       a = append(b, 1)
- 修改切片的值？
    mySlice := []int{ 10 , 20 , 30 , 40 , 50 }
    for _, value := range mySlice {
       value *= 2
    }
    fmt.Printf("mySlice %+v\n", mySlice)
    for index, _ := range mySlice {
       mySlice[index] *= 2
    }
    fmt.Printf("mySlice %+v\n", mySlice)


##### Map

- 声明方法
    - var map1 map[keytype]valuetype
- 示例
    myMap := make(map[string]string, 10 )
    myMap["a"] = "b"
    myFuncMap := map[string]func() int{
    "funcA": func() int { return 1 },
    }
    fmt.Println(myFuncMap)
    f := myFuncMap["funcA"]
    fmt.Println(f())


##### 访问 Map 元素

按 Key 取值
value, exists := myMap["a"]
if exists {

println(value)
}
遍历 Map
for k, v := range myMap {
println(k, v)
}


##### 结构体和指针

- 通过 type ... struct 关键字自定义结构体
- Go 语言支持指针，但不支持指针运算
    - 指针变量的值为内存地址
    - 未赋值的指针为 nil

type MyType struct {
Name string
}

func printMyType(t *MyType){
println(t.Name)
}

func main(){
t := MyType{Name: "test"}
printMyType(&t)
}


##### 结构体标签

- 结构体中的字段除了有名字和类型外，还可以有一个可选的标签（tag）
- 使用场景：Kubernetes APIServer 对所有资源的定义都用 Json tag 和 protoBuff tag
    - NodeName string `json:"nodeName,omitempty" protobuf:"bytes,10,opt,name=nodeName"`

type MyType struct {

```
Name string `json:"name"`
```
}
func main() {

```
mt := MyType{Name: "test"}
myType := reflect.TypeOf(mt)
name := myType.Field( 0 )
tag := name.Tag.Get("json")
println(tag)
```
}


##### 类型别名

```
// Service Type string describes ingress methods for a service
type ServiceType string
const (// ServiceTypeClusterIP means a service will only be accessible inside the
// cluster, via the ClusterIP.
ServiceTypeClusterIP ServiceType = "ClusterIP"
// ServiceTypeNodePort means a service will be exposed on one port of
// every node, in addition to 'ClusterIP' type.
ServiceTypeNodePort ServiceType = "NodePort"
// ServiceTypeLoadBalancer means a service will be exposed via an
// external load balancer (if the cloud provider supports it), in addition// to 'NodePort' type.
ServiceTypeLoadBalancer ServiceType = "LoadBalancer"
// // an external name that ServiceTypeExternalNamekubednsmeans a service consists of only a reference toor equivalent will return as a CNAME
// record, with no exposing or proxying of any pods involved.
ServiceTypeExternalName ServiceType = "ExternalName"
)
```

##### 课后练习1.1

- 安装 Go
- 安装 IDE 并安装 Go 语言插件
- 编写一个小程序

```
给定一个字符串数组
["I","am","stupid","and","weak"]
用 for 循环遍历该数组并修改为
["I","am","smart","and","strong"]
```

#### 5. 函数


##### Main 函数

- 每个 Go 语言程序都应该有个 main package
- Main package 里的 main 函数是 Go 语言程序入口

package main

func main() {
args := os.Args
if len(args) != 0 {
println("Do not accept any argument")
os.Exit( 1 )
}
println("Hello world")
}


##### 参数解析

- 请注意 main 函数与其他语言不同，没有类似 java 的 []string args 参数
- Go 语言如何传入参数呢？
    - 方法 1 ：
       l fmt.Println("os args is:", os.Args)
    - 方法 2 ：
       l name := flag.String("name", "world", "specify the name you want to say hi")
       l flag.Parse()


##### Init 函数

- Init 函数：会在包初始化时运行
- 谨慎使用 init 函数
    - 当多个依赖项目引用统一项目，且被引用项目的初始化在 init 中完成，并且不可重复运行时，会导
       致启动错误

package main
var myVariable = 0
func init() {
myVariable = 1
}


##### 返回值

- 多值返回
    - 函数可以返回任意数量的返回值
- 命名返回值
    - Go 的返回值可被命名，它们会被视作定义在函数顶部的变量。
    - 返回值的名称应当具有一定的意义，它可以作为文档使用。
    - 没有参数的 return 语句返回已命名的返回值。也就是直接返回。
- 调用者忽略部分返回值

```
result, _ = strconv.Atoi(origStr)
```

##### 传递变长参数

Go 语言中的可变长参数允许调用方传递任意多个相同类型的参数

- 函数定义

func append(slice []Type, elems ...Type) []Type

- 调用方法

myArray := []string{}
myArray = append(myArray, "a","b","c")


##### 内置函数

```
函数名 作用
close 管道关闭
len, cap 返回数组、切片，Map 的长度或容量
new, make 内存分配
copy, append 操作切片
panic, recover 错误处理
print, println 打印
complex, real, imag 操作复数
```

##### 回调函数(Callback)

```
示例：
func main() {
DoOperation( 1 , increase)
DoOperation( 1 , decrease)
}
func increase(a, b int) {
println(“increase result is:”, a+b)
}
func DoOperation(y int, f func(int, int)) {
f(y, 1 )
}
func decrease(a, b int) {
println("decrease result is:", a-b)
}
```
- 函数作为参数传入其它函数，并在其他函数内部调用执行
    - strings.IndexFunc(line, unicode.IsSpace)
    - Kubernetes controller的leaderelection


##### 闭包

- 匿名函数
    - 不能独立存在
    - 可以赋值给其他变量
       l x:= func(){}
    - 可以直接调用
       l func(x,y int){println(x+y)}(1,2)
    - 可作为函数返回值
       l func Add() (func(b int) int)
          - 使用场景
             defer func() {
                if r := recover(); r != nil {
                   println(“recovered in FuncX”)
                }
}()


##### 方法

- 方法：作用在接收者上的函数
    - func (recv receiver_type) methodName(parameter_list) (return_value_list)
- 使用场景
    - 很多场景下，函数需要的上下文可以保存在receiver属性中，通过定义 receiver 的方法，该方法可以直接
       访问 receiver 属性，减少参数传递需求
    // StartTLS starts TLS on a server from NewUnstartedServer.
    func (s *Server) StartTLS() {
       if s.URL != “” {
          panic(“Server already started”)
       }
       if s.client == nil {
          s.client = &http.Client{Transport: &http.Transport{}}
       }


##### 传值还是传指针

- Go 语言只有一种规则-传值
- 函数内修改参数的值不会影响函数外原始变量的值
- 可以传递指针参数将变量地址传递给调用函数，Go 语言会

```
复制该指针作为函数内的地址，但指向同一地址
```
- 思考：当我们写代码的时候，函数的参数传递应该用struct

```
还是pointer？
```

##### 接口

- 接口定义一组方法集合
    type IF interface {
       Method1(param_list) return_type
    }
- 适用场景：Kubernetes 中有大量的接口抽象和多种实现
- Struct 无需显示声明实现 interface，只需直接实现方法
- Struct 除实现 interface 定义的接口外，还可以有额外的方法
- 一个类型可实现多个接口（Go 语言的多重继承）
- Go 语言中接口不接受属性定义
- 接口可以嵌套其他接口


##### 接口

type IF interface {
getName() string
}

type Human struct {
firstName, lastName string
}

func (h *Human) getName() string {
return h.firstName + "," + h.lastName
}

type Car struct {
factory, model string
}

func (c *Car) getName() string {
return c.factory + "-" + c.model
}

```
func main() {
interfaces := []IF{}
h := new(Human)
h.firstName = "first"
h.lastName = "last"
interfaces = append(interfaces, h)
c := new(Car)
c.factory = "benz"
c.model = "s"
interfaces = append(interfaces, c)
for _, f := range interfaces {
fmt.Println(f.getName())
}
}
```

##### 注意事项

- Interface 是可能为 nil 的，所以针对 interface 的使用一定要预
    先判空，否则会引起程序 crash(nil panic)
- Struct 初始化意味着空间分配，对 struct 的引用不会出现空指针


##### 反射机制

- reflect.TypeOf ()返回被检查对象的类型
- reflect.ValueOf()返回被检查对象的值
- 示例

myMap := make(map[string]string, 10 )

myMap["a"] = "b"

t := reflect.TypeOf(myMap)

fmt.Println("type:", t)

v := reflect.ValueOf(myMap)

fmt.Println("value:", v)


##### 基于 struct 的反射

// struct
myStruct:= T{A: "a"}
v1:= reflect.ValueOf(myStruct)
fori := 0 ; i < v1.NumField(); i++ {
fmt.Printf("Field %d: %v\n", i, v1.Field(i))
}
fori := 0 ; i < v1.NumMethod(); i++ {
fmt.Printf("Method %d: %v\n", i, v1.Method(i))
}
// 需要注意 receive是struct还是指针
result:= v1.Method( 0 ).Call(nil)
fmt.Println("result:", result)


##### Go 语言中的面向对象编程

- 可见性控制
    - public - 常量、变量、类型、接口、结构、函数等的名称大写
    - private - 非大写就只能在包内使用
- 继承
    - 通过组合实现，内嵌一个或多个 struct
- 多态
    - 通过接口实现，通过接口定义方法集，编写多套实现


##### Json 编解码

- Unmarshal: 从 string 转换至 struct
func unmarshal2Struct(humanStr string)Human {
    h := Human{}
    err := json.Unmarshal([]byte(humanStr), &h)
    if err != nil {
       println(err)
    }
    return h
}
    - Marshal: 从 struct 转换至 string
    func marshal2JsonString(h Human) string {
       h.Age = 30
       updatedBytes, err := json.Marshal(&h)
       if err != nil {
          println(err)
       }
       return string(updatedBytes)
    }


##### Json 编解码

- json 包使用 map[string]interface{} 和 []interface{} 类型保存任意对象
- 可通过如下逻辑解析任意 json
    var obj interface{}
    err := json.Unmarshal([]byte(humanStr), &obj)
    objMap, ok := obj.(map[string]interface{})
    for k, v := range objMap {
       switch value := v.(type) {
       case string:
          fmt.Printf("type of %s is string, value is %v\n", k, value)
       case interface{}:
          fmt.Printf("type of %s is interface{}, value is %v\n", k, value)
default:
fmt.Printf("type of %s is wrong, value is %v\n", k, value)
}
}


#### 6. 常用语法


##### 错误处理

- Go 语言无内置 exceptio 机制，只提供 error接口供定义错误
    typeerror interface {
       Error() string
}
- 可通过 errors.New 或fmt.Errorf 创建新的error
    - var errNotFounderror = errors.New("NotFound")
- 通常应用程序对 error 的处理大部分是判断error 是否为 nil
如需将 error归类，通常交给应用程序自定义，比如 kubernetes 自定义了与 apiserver 交互的不同类型错误
type StatusErrorstruct {
    ErrStatus metav1.Status
}
var _ error = &StatusError{}

// Error implements the Error interface.
func (e *StatusError) Error() string {
return e.ErrStatus.Message
}


##### defer

- 函数返回之前执行某个语句或函数
    - 等同于 Java 和 C# 的 finally
- 常见的 defer 使用场景：记得关闭你打开的资源
    - defer file.Close()
    - defer mu.Unlock()
    - defer println("")


##### Panic 和 recover

- panic: 可在系统出现不可恢复错误时主动调用 panic, panic 会使当前线程直接 crash
- defer: 保证执行并把控制权交还给接收到 panic 的函数调用者
- recover: 函数从 panic 或 错误场景中恢复

defer func() {
fmt.Println("defer func is called")
if err := recover(); err != nil {
fmt.Println(err)
}
}()
panic("a panic is triggered")


#### 7. 多线程


##### 并发和并行

- 并发（concurrency）
    - 两个或多个事件在同一时间间隔发生
- 并行（parallellism）
    - 两个或者多个事件在同一时刻发生

```
线程 1 线程 2 线程 1 线程 2 线程 3
```
```
线程 1
```
```
线程 2
```
```
线程 3
```

##### 协程

- 进程：
    - 分配系统资源（CPU 时间、内存等）基本单位
    - 有独立的内存空间，切换开销大
- 线程：进程的一个执行流，是 CPU 调度并能独立运行的的基本单位
    - 同一进程中的多线程共享内存空间，线程切换代价小
    - 多线程通信方便
    - 从内核层面来看线程其实也是一种特殊的进程，它跟父进程共享了打开的文件和文件系统信息，共
       享了地址空间和信号处理函数
- 协程
    - Go 语言中的轻量级线程实现
    - Golang 在 runtime、系统调用等多方面对 goroutine 调度进行了封装和处理，当遇到长时间执行
       或者进行系统调用时，会主动把当前 goroutine 的 CPU (P) 转让出去，让其他 goroutine 能被调度
       并执行，也就是 Golang 从语言层面支持了协程


##### Communicating Sequential Process

- CSP
    - 描述两个独立的并发实体通过共享的通讯 channel 进行通信的并发模型。
- Go 协程 goroutine
    - 是一种轻量线程，它不是操作系统的线程，而是将一个操作系统线程分段使用，通过调度器实现协
       作式调度。
    - 是一种绿色线程，微线程，它与 Coroutine 协程也有区别，能够在发现堵塞后启动新的微线程。
- 通道 channel
    - 类似 Unix 的 Pipe，用于协程之间通讯和同步。
    - 协程之间虽然解耦，但是它们和 Channel 有着耦合。


##### 线程和协程的差异

- 每个 goroutine (协程) 默认占用内存远比 Java 、C 的线程少
    - goroutine：2KB
    - 线程： 8 MB
- 线程/goroutine 切换开销方面，goroutine 远比线程小
    - 线程：涉及模式切换(从用户态切换到内核态)、 16 个寄存器、PC、SP...等寄存器的刷新
    - goroutine：只有三个寄存器的值修改 - PC / SP / DX.
- GOMAXPROCS
    - 控制并行线程数量


##### 协程示例

- 启动新协程：go functionName()

for i := 0 ; i < 10 ; i++ {

```
go fmt.Println(i)
```
}

time.Sleep(time.Second)


##### channel - 多线程通信

- Channel 是多个协程之间通讯的管道
    - 一端发送数据，一端接收数据
    - 同一时间只有一个协程可以访问数据，无共享内存模式可能出现的内存竞争
    - 协调协程的执行顺序
- 声明方式
    - var identifier chan datatype
    - 操作符<-
- 示例
ch := make(chan int)
go func() {
    fmt.Println("hello from goroutine")
    ch <- 0 //数据写入Channel
}()
i := <-ch//从Channel中取数据并赋值


##### 通道缓冲

- 基于 Channel 的通信是同步的
- 当缓冲区满时，数据的发送是阻塞的
- 通过 make 关键字创建通道时可定义缓冲区容量，默认缓冲区容量为 0
- 下面两个定义的区别？
    - ch := make(chan int)
    - ch := make(chan int,1)


##### 遍历通道缓冲区

ch := make(chan int, 10 )
go func() {
for i := 0 ; i < 10 ; i++ {
rand.Seed(time.Now().UnixNano())
n := rand.Intn( 10 ) // n will be between 0 and 10
fmt.Println("putting: ", n)
ch <- n
}
close(ch)
}()
fmt.Println("hello from main")
for v := range ch {
fmt.Println("receiving: ", v)
}


##### 单向通道

- 只发送通道
    - var sendOnlychan<-int
- 只接收通道
    - var readOnly<-chanint
- Istio webhook controller
    - func(w *WebhookCertPatcher) runWebhookController(stopChan <-chanstruct{}) {}
- 如何用: 双向通道转换
    var c = make(chan int)
    go prod(c)
    go consume(c)
    func prod(ch chan<- int){
       for { ch <- 1 }
    }
    func consume(ch <-chan int) {
       for { <-ch }
    }


##### 关闭通道

- 通道无需每次关闭
- 关闭的作用是告诉接收者该通道再无新数据发送
- 只有发送方需要关闭通道

```
ch := make(chan int)
defer close(ch)
if v, notClosed := <-ch; notClosed {
fmt.Println(v)
}
```

##### select

- 当多个协程同时运行时，可通过 select 轮询多个通道
    - 如果所有通道都阻塞则等待，如定义了 default 则执行 default
    - 如多个通道就绪则随机选择

select {
case v:= <- ch1:
...
case v:= <- ch2:
...
default:
...
}


##### 定时器 Timer

- time.Ticker 以指定的时间间隔重复的向通道 C 发送时间值
- 使用场景
    - 为协程设定超时时间
timer := time.NewTimer(time.Second)
select {
    // check normal channel
    case <-ch:
       fmt.Println("received from ch")
case <-timer.C:
fmt.Println("timeout waiting from channel ch")
}


##### 上下文 Context

- 超时、取消操作或者一些异常情况，往往需要进行抢占操作或者中断后续操作
- Context 是设置截止日期、同步信号，传递请求相关值的结构体
    type Context interface {
       Deadline() (deadline time.Time, ok bool)
       Done() <-chan struct{}
       Err() error
       Value(key interface{}) interface{}
}
- 用法
    - context.Background
    - context.TODO
    - context.WithDeadline
    - context.WithValue
    - context.WithCancel


##### 如何停止一个子协程

done := make(chan bool)
go func() {
for {
select {
case <-done:
fmt.Println("done channel is triggerred, exit child go routine")
return
}
}
}()
close(done)


##### 基于 Context 停止子协程

- Context 是 Go 语言对 go routine 和 timer 的封装

ctx, cancel := context.WithTimeout(context.Background(), time.Second)

defer cancel()

go process(ctx, 100 *time.Millisecond)

<-ctx.Done()

fmt.Println("main:", ctx.Err())


##### 课后练习1.2

- 基于 Channel 编写一个简单的单线程生产者消费者模型
- 队列：
队列长度 10 ，队列元素类型为 int
- 生产者：
每 1 秒往队列中放入一个类型为 int 的元素，队列满时生产者可以阻塞
- 消费者：
每一秒从队列中获取一个元素并打印，队列为空时消费者阻塞


## 模块二：Go 语言进阶


# 目录 •• 线程加锁线程调度

- 内存管理
- 包引用与依赖管理


### 1. 线程加锁


#### 锁

- Go 语言不仅仅提供基于 CSP 的通讯模型，也支持基于共享内存的多线程数据访问
- Sync 包提供了锁的基本原语
- sync.Mutex 互斥锁
    - Lock()加锁，Unlock 解锁
- sync.RWMutex 读写分离锁
    - 不限制并发读，只限制并发写和并发读写
- sync.WaitGroup
    - 等待一组 goroutine 返回
- sync.Once
    - 保证某段代码只执行一次
- sync.Cond
    - 让一组 goroutine 在满足特定条件时被唤醒


#### Mutex 示例

###### Kubernetes 中的 informer factory

// Start initializes all requested informers.
func (f *sharedInformerFactory) Start(stopCh <-chan struct{}) {
f.lock.Lock()
defer f.lock.Unlock()
for informerType, informer := range f.informers {
if !f.startedInformers[informerType] {
go informer.Run(stopCh)
f.startedInformers[informerType] = true
}
}
}


// CreateBatch create a batch of pods. All pods are created before
waiting.
func (c *PodClient) CreateBatch(pods []*v1.Pod) []*v1.Pod {
psvar:= wgmakesync.WaitGroup([]*v1.Pod, len(pods))
for wg.i, Addpod( 1 := ) range pods {
go funcdefer(i wg.intDone, pod *v1.Pod) {()
deferps[i] = GinkgoRecoverc.CreateSync()(pod)
} }(i, pod)
wg.returnWait()ps
}

#### WaitGroup 示例


#### Cond 示例

Kubernetescond: sync.NewCond中的队列，标准的生产者消费者模式(&sync.Mutex{}),

// Add marks item as needing processing.func(q *Type) Add(item interface{}) {
q.cond.L.deferq.cond.L.Lock()Unlock()
ifq.shuttingDownreturn {
}ifq.dirty.has(item) {
} return
q.metrics.q.dirty.insertadd(item)(item)
ifq.processing.return has(item) {
}q.queue= append(q.queue, item)

} q.cond.Signal()


#### Cond 示例

// Get blocks until it can return an item to be processed. If shutdown = true,// the caller should end their goroutine. You must call Done with item when you
// have finished processing it.func (q *Type) Get() (item interface{}, shutdown bool) {
q.cond.L.defer q.cond.L.Lock()Unlock()
for lenq.cond.(q.queueWait) == () 0 && !q.shuttingDown {
}if len(q.queue) == 0 {
// We must be shutting down.return nil, true
}item, q.queue = q.queue[ 0 ], q.queue[ 1 :]
q.metrics.q.processing.get(item)insert(item)
q.dirty.return item, deletefalse(item)
}


### 2. 线程调度


### 深入理解 Go 语言线程调度

- 进程：资源分配的基本单位
- 线程：调度的基本单位
- 无论是线程还是进程，在 linux 中都以 task_struct 描述，从内核角度看，与进程无本质区别
- Glibc 中的 pthread 库提供 NPTL（Native POSIX Threading Library）支持
    Processmm
       fs
files
signal

```
Processmm
fs
files
signal
```
```
Process Process
mm
fs
files
signal
```
```
创建进程：fork 创建线程：pthread_create
```

#### Linux 进程的内存使用

Kernel space
Stack
未分配内存
Heap
BSS（未初始化数据）
Data（初始化数据）
Text（程序代码）

```
PGD PUD PMD PT
PGD: page global directoryPUD: page upper directory
PMP: page middle directoryPT: page table
```
```
虚拟地址 物理内存 磁盘（虚拟内存）
```
```
参数环境变量
```

#### CPU 对内存的访问

- CPU 上有个 Memory Management Unit（MMU） 单元
- CPU 把虚拟地址给 MMU，MMU 去物理内存中查询页表，得到实际的物理地址
- CPU 维护一份缓存 Translation Lookaside Buffer（TLB），缓存虚拟地址和物理地址的映射关系

```
CPU
```
```
TLB MMU PGD PUD PMD PT
```
```
物理内存
```
总线


#### 进程切换开销

- 直接开销
    - 切换页表全局目录（PGD）
    - 切换内核态堆栈
    - 切换硬件上下文（进程恢复前，必须装入寄存器的数据统称为硬件上下文）
    - 刷新 TLB
    - 系统调度器的代码执行
- 间接开销
    - CPU 缓存失效导致的进程需要到内存直接访问的 IO 操作变多


#### 线程切换开销

- 线程本质上只是一批共享资源的进程，线程切换本质上依然需要内核进行进程切换
- 一组线程因为共享内存资源，因此一个进程的所有线程共享虚拟地址空间，线程切换相比进程
    切换，主要节省了虚拟地址空间的切换


#### 用户线程

无需内核帮助，应用程序在用户空间创建的可执行单元，创建销毁完全在用户态完成。

```
CPU
```
```
Kernel Thread Kernel Thread Kernel Thread
```
```
User Thread
User Thread
User Thread
```
```
User Thread
User Thread
```
```
User Thread
User Thread
User Thread
```
```
Process Process Process
```
```
用户态
内核态
```

#### Goroutine

Go 语言基于 GMP 模型实现用户态线程

- G：表示 goroutine，每个 goroutine 都有自己的栈空间，定时器，
    初始化的栈空间在 2 k 左右，空间会随着需求增长。
- M：抽象化代表内核线程，记录内核线程栈信息，当 goroutine 调度
    到线程时，使用该 goroutine 自己的栈信息。
- P：代表调度器，负责调度 goroutine，维护一个本地 goroutine 队
    列，M 从 P 上获得 goroutine 并执行，同时还负责部分内存的管理。
       M G

```
P
```
```
G G G G
```

#### GMP 模型细节

```
G M
```
```
P
```
```
G
```
```
G
```
```
G G G G
G
```
```
G M
```
```
P
```
```
G
```
```
G
```
```
G M
```
```
P
```
```
G
```
```
G
```
```
G
```
```
P P
```
pidle（全局空闲P列表）

```
GRQ（全局可运行G队列）
```
```
G G G
```
gFree（全局自由G列表）

```
G G G
```
sudog（阻塞队列）

```
CPU CPU CPU
```
```
G Grunning
G Grunnable
G Gwaiting
G Gsyscall
G Gdead
P Pidle
P Prunning
P Psyscall
```
```
LRQ LRQ LRQ
```

#### G 所处的位置

- 进程都有一个全局的 G 队列
- 每个 P 拥有自己的本地执行队列
- 有不在运行队列中的 G
    - 处于 channel 阻塞态的 G 被放在 sudog
    - 脱离 P 绑定在 M 上的 G，如系统调用
    - 为了复用，执行结束进入 P 的 gFree 列表中的 G


#### Goroutine 创建过程

- 获取或者创建新的 Goroutine 结构体
    - 从处理器的 gFree 列表中查找空闲的 Goroutine
    - 如果不存在空闲的 Goroutine，会通过 runtime.malg 创建一个栈大小足够的新结构体
- 将函数传入的参数移到 Goroutine 的栈上
- 更新 Goroutine 调度相关的属性，更新状态为_Grunnable
- 返回的 Goroutine 会存储到全局变量 allgs 中


#### 将 Goroutine 放到运行队列上

- Goroutine 设置到处理器的 runnext 作为下一个处理器
    执行的任务
- 当处理器的本地运行队列已经没有剩余空间时，就会把
    本地队列中的一部分 Goroutine 和待加入的 Goroutine
    通过 runtime.runqputslow 添加到调度器持有的全局
    运行队列上


#### 调度器行为

- 为了保证公平，当全局运行队列中有待执行的 Goroutine 时，通过 schedtick 保证有一定
    几率会从全局的运行队列中查找对应的 Goroutine
- 从处理器本地的运行队列中查找待执行的 Goroutine
- 如果前两种方法都没有找到 Goroutine，会通过 runtime.findrunnable 进行阻塞地查找
    Goroutine
       - 从本地运行队列、全局运行队列中查找
       - 从网络轮询器中查找是否有 Goroutine 等待运行
       - 通过 runtime.runqsteal 尝试从其他随机的处理器中窃取待运行的 Goroutine


#### 课后练习 2.1

- 将练习1.2中的生产者消费者模型修改成为多个生产者和多个消费者模式


### 3. 内存管理


#### 关于内存管理的争论

内存管理太重要了！手动管理麻烦且容易出错，所以我们应该交给机器去管理！ 内存管理太重要了！所以如果交给机器管理我不能放心！

```
Java/golang
```
```
c/c++
```

#### 堆内存管理

```
Heap
```
```
Mutator
Allocator
```
```
Collector
```
```
内存分配器，处理动态内存分配请求
```
用户程序，通过 Allocator 创建对象

```
垃圾回收器，回收内存空间 对象头，Collector 和 Allocator 同步对象元数据
```
```
Object Header
```

#### 堆内存管理

- 初始化连续内存块作为堆
- 有内存申请的时候，Allocator 从堆内存的未分配区域分割小内存块
- 用链表将已分配内存连接起来
- 需要信息描述每个内存块的元数据：大小，是否使用，下一个内存块的地址等

```
size used next data size used next data unmapped
Object Header
```
```
align
Object Header
```

### TCMalloc 概览

```
CentralCache
```
```
ThreadCache 1ThreadCache 2
ThreadCache n
```
```
Application
```
```
PageHeap
```
MemoryVirtual

```
Size class 0
Size class 1
Size class 2
Size class n
```
```
Size class 0
Size class 1
Size class 2
Size class n
```
```
Span list 1Span list 2
Span list 128
```
```
Large span set
```
```
... Small object
```
```
Large and medium object
```
```
Pages Span
```
```
Free Object
```
```
Span list 1: 1 pageSpan list 2: 2 pagesSpan list 128: 128 pages = 1M
```

#### TCMalloc

- page:内存页，一块 8 K 大小的内存空间。Go 与操作系统之间的内存申请和释放，都是以
    page 为单位的
- span: 内存块，一个或多个连续的 page 组成一个 span
- sizeclass : 空间规格，每个 span 都带有一个 sizeclass ，标记着该 span 中的 page 应该如何
    使用
- object : 对象，用来存储一个变量数据内存空间，一个 span 在初始化时，会被切割成一堆等大
    的 object ；假设 object 的大小是 16 B ，span 大小是 8 K ，那么就会把 span 中的 page 就会
    被初始化 8 K / 16B = 512 个 object 。所谓内存分配，就是分配一个 object 出去


#### TCMalloc

- 对象大小定义
    - 小对象大小：0~256KB
    - 中对象大小：256KB~1MB
    - 大对象大小：>1MB
- 小对象的分配流程
    - ThreadCacheCentralCache -和> CentralCacheHeapPage，无系统调用配合无锁分配，分配效率是非常高的-> HeapPage，大部分时候，ThreadCache 缓存都是足够的，不需要去访问
- 中对象分配流程
    - 直接在 PageHeap 中选择适当的大小即可， 128 Page 的 Span 所保存的最大内存就是 1 MB
- 大对象分配流程
    - 从 large span set 选择合适数量的页面组成 span，用来存储数据


#### Go 语言内存分配

```
mcentral
```
```
mmcache of P1cache of P2
mcache of P3
```
```
Application
```
```
mheap
```
MemoryVirtual

```
span class 0
span class 0
spanclass 1
span 134 class
```
```
spanspanclass 1class
133
```
```
free
```
```
Tiny object
```
```
Large and medium object
```
```
Pages Span
```
```
span class 0 Free Object
span class 0spanclass 1
```
```
span 134 class
```
```
span class 1
```
```
scav
```
```
heapArenaarenas
heapArenaheapArena
```

#### Go 语言内存分配

- mcache：小对象的内存分配直接走
    - size class 从 1 到 66 ，每个 class 两个 span
    - Span 大小是 8 KB，按 span class 大小切分
- mcentral
    - Spanspan，内的所有内存块都被占用时，没有剩余空间继续分配对象，mcache 拿到 span 后继续分配对象 mcache 会向 mcentral 申请 1 个
    - 当spanmcentral 向 mcache 提供 span 时，如果没有符合条件的 span，mcentral 会向 mheap 申请
- mheap
    - 当 mheap 没有足够的内存时，mheap 会向 OS 申请内存
    - Mheap 把 Span 组织成了树结构，而不是链表
    - 然后把 Span 分配到 heapArena 进行管理，它包含地址映射和 span 是否包含指针等位图
       - 为了更高效的分配、回收和再利用内存


#### 内存回收

- 引用计数（Python，PHP，Swift）
    - 对每一个对象维护一个引用计数，当引用该对象的对象被销毁的时候，引用计数减收该对象 1 ，当引用计数为 0 的时候，回
    - 优点：对象可以很快的被回收，不会出现内存耗尽或达到某个阀值时才回收
    - 缺点：不能很好的处理循环引用，而且实时维护引用计数，有也一定的代价
- 标记-清除（Golang）
    - 从根变量开始遍历所有引用的对象，引用的对象标记为"被引用"，没有被标记的进行回收
    - 优点：解决引用计数的缺点
    - 缺点：需要 STW（stop the word），即要暂停程序运行
- 分代收集（Java）
    - 按照生命周期进行划分不同的代空间，生命周期长的放入老年代，短的放入新生代，新生代的回收频率高于老年代的频率


#### mspan

- allocBits
    - 记录了每块内存分配的情况
- gcmarkBits
    - 记录了每块内存的引用情况，标记阶段对每块内存进行标记，有对象引用的内存标记为 1 ，没有的标
       记为 0


#### mspan

- 这两个位图的数据结构是完全一致的，标记结束则进行内存回收，回收的时候，将 allocBits 指
    向 gcmarkBits，标记过的则存在，未进行标记的则进行回收

```
startAddrmspan
allocBitsnpages
gcmarkBitsallocCount
spanclass
```
```
1 1 0 1 0 0 1 ...
1 1 0 0 0 0 0 ...
```

#### GC 工作流程

Golang GC 的大部分处理是和用户代码并行的

- Mark：
    - Mark Prepare: 务数量等。这个过程需要初始化 GCSTW任务，包括开启写屏障 (write barrier) 和辅助 GC(mutator assist)，统计root对象的任
    - GC Drains: 加入标记队列扫描所有(灰色队列root)，并循环处理灰色队列的对象，直到灰色队列为空。该过程后台并行执行对象，包括全局指针和 goroutine(G) 栈上的指针（扫描对应 G 栈时需停止该 G)，将其
- Mark Termination程中可能会有新的对象分配和指针赋值，这个时候就需要通过写屏障（：完成标记工作，重新扫描(re-scan)全局指针和栈。因为write barrierMark 和用户程序是并行的，所以在）记录下来，re-scan 再检查一下，这Mark 过
    个过程也是会 STW 的
- Sweep：按照标记结果回收所有的白色对象，该过程后台并行执行
- Sweep Termination：对未清扫的 span 进行清扫, 只有上一轮的 GC 的清扫工作完成才可以开始新一轮的 GC


#### GC 工作流程

```
关闭 •• GC写操作是正常的赋值关闭
栈扫描 开启写屏障 STW •• 开启写屏障等准备工作，短暂开启从全局空间和 goroutine 栈空间上收集变量STW
标记 • 三色标记法，直到没有灰色对象
标记结束 STW • 开启 STW，回头重新扫描 root 区域新变量，对他们进行标记
清除 • 关闭 STW 和 写屏障，对白色对象进行清除
关闭 • 循环结束，重启下一阶段GC
```

#### 三色标记

- GC 开始时，认为所有 object 都是 白色，即垃圾。
- 从 root 区开始遍历，被触达的 object 置成 灰色。
- 遍历所有灰色 object，将他们内部的引用变量置成 灰色，自身置成 黑色
- 循环第 3 步，直到没有灰色 object 了，只剩下了黑白两种，白色的都是垃圾。
- 对于黑色 object，如果在标记期间发生了写操作，写屏障会在真正赋值前将新对象标记为 灰色。
- 标记过程中，mallocgc 新分配的 object，会先被标记成 黑色 再返回。
    a
b
c

```
d a
b
c
```
```
d a
b
c
```
```
d a
b
c
```
```
d a
b
c
```
```
d
```

#### 垃圾回收触发机制

- 内存分配量达到阀值触发 GC
    - 每次内存分配时都会检查当前内存分配量是否已达到阀值，如果达到阀值则立即启动 GC。
       - 阀值 = 上次 GC 内存分配量 * 内存增长率
       - 内存增长率由环境变量 GOGC 控制，默认为 100 ，即每当内存扩大一倍时启动 GC。
- 定期触发 GC
    - 默认情况下，最长 2 分钟触发一次 GC，这个间隔在 src/runtime/proc.go:forcegcperiod 变量中
       被声明
- 手动触发
    - 程序代码中也可以使用 runtime.GC()来手动触发 GC。这主要用于 GC 性能测试和统计。


### 4. 包引用与依赖管理


#### Go 语言依赖管理的演进

- 回顾 GOPATH
    - 通过环境变量设置系统级的 Go 语言类库目录
    - GOPATH 的问题？
       - 不同项目可能依赖不同版本
       - 代码被 clone 以后需要设置 GOPATH 才能编译
- vendor
    - 自 1.6 版本，支持 vendor 目录，在每个 Go 语言项目中，创建一个名叫 vendor 的目录，并将依赖拷贝至该目录。
    - Go 语言项目会自动将 vendor 目录作为自身的项目依赖路径
    - 好处？
       - 每个项目的 vendor目录是独立的，可以灵活的选择版本
       - Vendor 目录与源代码一起 check in 到 github，其他人 checkout 以后可直接编译
       - 无需在编译期间下载依赖包，所有依赖都已经与源代码保存在一起


#### vendor 管理工具

通过声明式配置，实现 vendor 管理的自动化

- 在早期，Go 语言无自带依赖管理工具，社区方案鱼龙混杂比较出名的包括
    - Godeps, Glide
- Go 语言随后发布了自带的依赖管理工具 Gopkg
- 很快用新的工具 gomod 替换掉了 gopkg
    - 切换 mod 开启模式：export GO111MODULE=on/off/auto
    - Go mod 相比之前的工具更灵活易用，以基本统一了 Go 语言依赖管理
思考：用依赖管理工具的目的？
- 版本管理
- 防篡改


#### Go mod 使用

- 创建项目
- 初始化 Go 模块
    - go mod init
- 下载依赖包
    - go mod download（下载的依赖包在$GOPATH/pkg，如果没有设置 GOPATH，则下载在项目根目录/pkg）
    - 在源代码中使用某个依赖包，如 github.com/emicklei/go-restful
- 添加缺少的依赖并为依赖包瘦身
    - go mod tidy
- 把 Go 依赖模块添加到 vendor 目录
    - go mod vendor
配置细节会被保存在项目根目录的 go.mod 中
可在 require 或者 replacement 中指定版本


#### go.mod sample

module k8s.io/go 1.13 apiserver
require (github.com/evanphx/json-patch v4.9.0+incompatible
github.comgithub.com/go/go--openapiopenapi//spec v0.19.3jsonreferencev0.19.3 // indirect
github.comgithub.com//google/gogogo/protobuf-cmpv1.3.2v0.3.0
github.comk8s.io/apimachinery/google/gofuzzv0.0.0-v1.1.0 20210518100737 - 44f1264f7b6b
)
replace (golang.org/x/crypto => golang.org/x/crypto v0.0.0- 20200220183623 - bac4c82f6975
golang.orgk8s.io/api=> k8s.io//x/text => apigolang.orgv0.0.0- 20210518101910 /x/text v0.3.2 -53468e23a787

k8s.io/k8s.io/clientapimachinery-go => k8s.io/client=> k8s.io/apimachinery-go v0.0.0- 20210518104342 v0.0.0- (^20210518100737) - fa3acefe68f3-44f1264f7b6b
) k8s.io/component-base => k8s.io/component-base v0.0.0-^20210518111421 - 67c12a31a26a


#### GOPROXY 和 GOPRIVATE

- GOPROXY
    - 为拉取 Go 依赖设置代理
       - export GOPROXY=https://goproxy.cn
- 在设置 GOPROXY 以后，默认所有依赖拉取都需要经过 proxy 连接 git repo，拉取代码，并做
    checksum 校验
- 某些私有代码仓库是 goproxy.cn 无法连接的，因此需要设置 GOPRIVATE 来声明私有代码仓库
    GOPRIVATE=*.corp.example.com
    GOPROXY=proxy.example.com
    GONOPROXY=myrepo.corp.example.com


### 5. Makefile


#### Go 语言项目多采用 Makefile 组织项目编译

root:
export ROOT=github.com/cncamp/golang;
.PHONY: root

release:
echo "building httpserver binary"
mkdir -p bin/amd64
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/amd64.
.PHONY: release


### 6. 动手编写一个 HTTP Server


#### 理解 net.http 包

- 注册 handle 处理函数
http.HandleFunc("/healthz", healthz)
//Use the default DefaultServeMux.
ListenAndService
err := http.ListenAndServe(":80", nil)
if err != nil {
log.Fatal(err)
}
- 定义 handle 处理函数
func*http.Requesthealthz(w ) {http.ResponseWriter, r
io.WriteString(w, "ok")
}


#### 阻塞 IO 模型

```
应用进程 系统调用 系统内核
recvfrom 数据报文尚未就绪
```
```
数据报文就绪
拷贝数据
```
```
处理数据报 系统调用返回 拷贝完成
```
recvfrom进程阻塞于调用


#### 非阻塞 IO 模型

```
应用进程 系统内核
recvfrom 系统调用 数据报文尚未就绪
```
```
数据报文就绪
拷贝数据
```
```
处理数据报 拷贝完成
```
recvfrom，直至返回进程重复调用OK

```
recvfrom
recvfrom
```
```
系统调用返回错误
返回错误
```
```
返回OK
```
```
系统调用
```

#### IO 多路复用

```
应用进程 系统内核
select/poll 系统调用 数据报文尚未就绪
```
```
数据报文就绪
拷贝数据
```
```
处理数据报文 拷贝完成
```
进程阻塞于等待有可读的select/pollsocket 调用，

```
recvfrom
```
```
返回可读
```
```
返回OK
```
系统调用
数据复制到进程缓冲区期间进程阻塞 ，


### 异步 IO

```
应用进程 系统内核
异步 IO 读 系统调用 数据报文尚未就绪
```
```
数据报文就绪
拷贝数据
```
```
处理数据报文 拷贝完成
```
```
程序继续运行
```
```
系统调用返回
```
```
发送信号
```

#### Linux epoll

epoll_create1 ...

```
rdlistwq
ovflistrbr
epitem
```
```
epitem epitem
```
```
epitem epitem epitem epitem
```
```
epitem epitem epitem
```
```
epoll_ctl(epfd, op, fd, event)
```
```
sk_wait...
...
```
```
epoll_wait(epfd, event, maxevents, timeout)
copy
```
```
Data from network stack
```

#### Go 语言高性能 httpserver 的实现细节

- Go 语言将协程与 fd 资源绑定
    - 一个 socket fd 与一个协程绑定
    - 当 socket fd 未就绪时，将对应协程设置为 Gwaiting 状态，将 CPU 时间片让给其他协程
    - GoGrunnable语言 runtime 并加入执行队列调度器进行调度唤醒协程时，检查 fd 是否就绪，如果就绪则将协程置为
    - 协程被调度后处理 fd 数据
       Server
G
G
G

```
fd
fd
fd
```
```
client
client
client
```
```
data ready
data not ready
```
```
runnable
waiting
runnable
data ready
```

#### 代码实现细节

https://pouncing-waterfall-7c4.notion.site/http-server-socket-detail-
e1f350d63c7c4d9f86ce140949bd90c2


### 7. 调试


#### debug

- gdb:
    - Gccgo 原生支持 gdb，因此可以用 gdb 调试 Go 语言代码，但 dlv 对 Go 语言 debug 的支持比 gdb 更好
    - Gdb 对 Go 语言的栈管理，多线程支持等方面做的不够好，调试代码时可能有错乱现象
- dlv：
    - Go 语言的专有 debugger


#### dlv 的配置

- 配置
    - 在 vscode 中配置 dlb
    - 菜单：View -> Command Palette
    - 选择 Go : Install/Update Tools，选择安装
    - 安装完后，从改入口列表中可以看到 dlv 和 dlv-dap 已经安装好
- Debug 方法
    - 在代码中设置断点
    - 菜单中选择 Run -> Start Debugging 即可进入调试


#### 更多 debug 方法

- 添加日志
    - 在关键代码分支中加入日志
    - 基于fmt包将日志输出到标准输出 stdout
       - fmt.Println()
    - fmt 无日志重定向，无日志分级
- 即与日志框架将日志输出到对应的 appender
    - 比如可利用 glog 进行日志输出
       - 可配置 appender，将标准输出转至文件
       - 支持多级日志输出，可修改配置调整日志等级
       - 自带时间戳和代码行，方便调试


#### Glog 使用方法示例

import"flag" (

")github.com/golang/glog"
func flag.main() {Set("v", "4")

glog.mux := V( (^2) http.).InfoNewServeMux("Starting http server..."() )
mux.err HandleFunc:= http.ListenAndServe("/", rootHandler(":80"), mux)
if err != log.Fatalnil (err){
} }


#### 性能分析（Performance Profiling）

- CPU Profiling: 在代码中添加 CPUProfile 代码，runtime/pprof 包提供支持
varfunccpuprofilemain() { = flag.String("cpuprofile", "", "write cpu profile to file")
    flag.if *cpuprofileParse() != "" {
       f, errif err != := os.Createnil { (*cpuprofile)
          } log.Fatal(err)
    deferpprof.pprof.StartCPUProfileStopCPUProfile(f)()
} }


#### 分析 CPU 瓶颈

- 运行 cpuprofilie 代码后，会在 /tmp/cpuprofile 中记录 cpu 使用时间
- 运行 go tool pprof /tmp/cpuprofile 进入分析模式
- 运行 top10 查看 top 10 线程，显示 30ms 花费在 main.main
Showing nodes accounting for 30ms, 100% of 30ms total
    flat flat% sum% cum cum%
    30ms 100% 100% 30ms 100% main.main
       0 0% 100% 30ms 100% runtime.main
- (pprof) list main.main 显示 30 毫秒都花费在循环上
Total: 30ms
30ms 30ms (flat, cum) 100% of Total
    20ms 20ms 21: for i := 0; i < 100000000; i++ {
    10ms 10ms 22: result += I
- 可执行 web 命令生成 svg 文件，在通过浏览器打开 svg 文件查看图形化分析结果


#### 其他可用 profiling 工具分析的问题

- CPU profile
    - 程序的 CPU 使用情况，每 100 毫秒采集一次 CPU 使用情况
- Memory Profile
    - 程序的内存使用情况
- Block Profiling
    - 非运行态的 goroutine 细节，分析和查找死锁
- Goroutine Profiling
    - 所有 goroutines 的细节状态，有哪些 goroutine，它们的调用关系是怎样的


#### 针对 http 服务的 pprof

```
Import ("net/http/pprof"
)
funcmuxstartHTTP:= http.(addrNewServeMuxstring, s *tnetd.Server() ) {
mux.mux.HandleFuncHandleFunc((“/debug/“/debug/pprofpprof/”/profile”, pprof.Index, pprof.Profile) )
mux.mux.HandleFuncHandleFunc((“/debug/“/debug/pprofpprof/symbol”/trace”, pprof.Trace, pprof.Symbol) )
serverAddr:= &: addrhttp.Server, {
} Handler: mux,
} server.ListenAndServe()
```
- net/http/pprof 包提供支持
- 如果采用默认 mux handle，则只需 import
_ "net/http/pprof”
- 如果采用自定义 mux handle，则需要注册 pprof handler


#### 分析 go profiling 结果

在运行了开启 pprof 的服务器以后，可以通过访问对应的 URL 获得 profile 结果

- allocs: A sampling of all past memory allocations
- block: Stack traces that led to blocking on synchronization primitives
- cmdline: The command line invocation of the current program
- goroutine: Stack traces of all current goroutines
- heap: A sampling of memory allocations of live objects. You can specify the gc GET parameter to
    run GC before taking the heap sample.


- mutex: Stack traces of holders of contended mutexes
- profile: CPU profile. You can specify the duration in the seconds GET parameter. After you get the
    profile file, use the go tool pprof command to investigate the profile.
- threadcreate: Stack traces that led to the creation of new OS threads
- trace: A trace of execution of the current program. You can specify the duration in the seconds
    GET parameter. After you get the trace file, use the go tool trace command to investigate the
    trace.

#### 分析 go profiling 结果


#### 结果分析示例

- 分析 goroutine 运行情况
    - curl localhost/debug/pprof/goroutine?debug=2
- 分析堆内存使用情况
    - curl localhost/debug/pprof/heap?debug=2


### 8. Kubernetes 中常用代码解读


#### Rate Limit Queue

func (r *ItemExponentialFailureRateLimiter) When(item interface{}) time.Duration {
r.failuresLock.defer r.failuresLock.Lock()Unlock()
expr.failures:= r.failures[item] = [item]r.failures[item] + 1
// The backoff is capped such that ‘calculated’ value never overflows.backoff := float64(r.baseDelay.Nanoseconds()) * math.Pow( 2 , float64(exp))
if backoff > math.MaxInt64 {return r.maxDelay
}
calculatedif calculated > := time.r.maxDelayDuration(backoff){
} return r.maxDelay
} return calculated


### 9. Kubernetes 日常运维中的代码调试场景


#### 案例 1 ：空指针

- 问题描述
Kubenetes 调度器在调度有外挂存储需求的 pod 的时候，在获取节点信息失败
时会异常退出
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x105e2
83]


#### 案例 1 ：空指针

- 根因分析
nil pointe 是 Go 语言中最常出现的一类错误，也最容易判断，通常在 call stack 中就会告诉
你哪行代码有问题
在调度器 csi.go 中的如下代码，当 node 为 nil 的时候，对 node 的引用 node.Name 就会
引发空指针
nodeif:= node == nodeInfo.nilNode{ ()

not found: return framework.%s", node.NameNewStatus)) (framework.Error, fmt.Sprintf("node
}

- 解决办法
当指针为空时，不要继续引用。
https://github.com/kubernetes/kubernetes/pull/102229


#### 案例 2 ：Map 的读写冲突

- 问题描述：
程序在遍历 Kubernetes 对象的 Annotation 时异常退出
- 根因分析
Kubernetes 对象中 Label 和 Annotation 是 map[string]string
经常有代码需要修改这两个 Map
同时可能有其他线程 for...range 遍历
- 解决方法：
    - 用 sync.RWMutex 加锁
    - 使用线程安全 Map，比如 sync.Map{}


#### 案例 3 ：kube-proxy 消耗 10 个 CPU

- 问题描述
客户汇报问题，kube-proxy 消耗了主机 10 个 CPU
- 根因分析
    - 登录问题机器，执行top命令查看 cpu消耗，可以看到kube-proxy的cpu消耗和pid信息
    - 对说明程序创建了大量可回收对象。kube-proxy进程运行System profiling tool，发现 10 个CPU中，超过 60%的CPU都在做垃圾回收，这说明GC需要回收的对象太多了，
       - perf top –p<pid>
Overhead Shared Obj Symbol
26.48% kube-proxy [.] runtime.gcDrain
13.86% kube-proxy [.] runtime.greyobject
10.71% kube-proxy [.] runtime.(*lfstack).pop
10.04% kube-proxy [.] runtime.scanobject


#### 案例 3 ：kube-proxy 消耗 10 个 CPU

通过 pprof 分析内存占用情况
curl 127.0.0.1:10249/debug/pprof/heap?debug=2
1: 245760 [301102: 73998827520] @ 0x11ddcda 0x11f306e 0x11f35f5 0x11fbdce 0x1204a8a 0x114ed76
0x114eacb 0x11
# 0x11ddcd9
k8s.io/kubernetes/vendor/github.com/vishvananda/netlink.(*Handle).RouteListFiltered+0x679
# 0x11f306d k8s.io/kubernetes/pkg/proxy/ipvs.(*netlinkHandle).GetLocalAddresses+0xed
# 0x11f35f4 k8s.io/kubernetes/pkg/proxy/ipvs.(*realIPGetter).NodeIPs+0x64
# 0x11fbdcd k8s.io/kubernetes/pkg/proxy/ipvs.(*Proxier).syncProxyRules+0x47dd


#### 案例 3 ：kube-proxy 消耗 10 个

- heap dump 分析
    - GetLocalAddresses 函数调用创建了 301102 个对象，占用内存 73998827520
    - 如此多的对象被创建，显然会导致 kube-proxy 进程忙于 GC，占用大量 CPU
    - 对照代码分析通过 ip route GetLocalAddresses命令获得当前节点所有的实现local，发现该函数的主要目的是获取节点本机路由信息并转换成 go struct 并过滤掉 ipvs0IP 地址，获取的方法是网口上的路由信息
    - ip route show table local type local proto kernel
    - 因为集群规模较大，该命令返回 5000 条左右记录，因此每次函数调用都会有数万个对象被生成
    - 而反复调用该函数创建大量临时对象kube-proxy 在处理每一个服务的时候都会调用该方法，因为集群有数千个服务，因此，kube-proxy在
- 修复方法
    - 函数调用提取到循环外
    - https://github.com/kubernetes/kubernetes/pull/79444


#### 案例 4 ：线程池耗尽

- 问题描述：
在 Kubernetes 中有一个控制器，叫做 endpoint controller，该控制器符合生产者消费者模式，默认有 5
个 worker 线程作为消费者。该消费者在处理请求时，可能调用的 LBaaS 的 API 更新负载均衡配置。我们
发现该控制器会时不时不工作，具体表现为，该做的配置变更没发生，相关日志也不打印了。
- 根因分析：
通过 pprof 打印出该进程的所有 go routine 信息，发现 worker 线程都卡在 http 请求调用处。
当worker线程调用 LBaaS API 时，底层是 net/http 包调用，而客户端在发起连接请求时，未设置客户端
超时时间。这导致当出现某些网络异常时，客户端会永远处于等待状态。
- 解决方法：
修改代码加入客户端超时控制。


#### 课后练习 2.2

- 编写一个 HTTP 服务器
    接收客户端请求并将请求的 Header 打印出来返回给客户端



