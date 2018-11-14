# 一小时学会C# 6
## 一、字符串插值 （String Interpolation）

C# 6之前我们拼接字符串时需要这样
```C#
 var Name = "Jack";
 var results = "Hello" + Name;
```
或者
```C#
 var Name = "Jack";
 var results = string.Format("Hello {0}", Name);
``` 
但是C#6里我们就可以使用新的字符串插值特性
```C#
  var Name = "Jack";
  var results = $"Hello {Name}";
```  
上面只是一个简单的例子，想想如果有多个值要替换的话，用C#6的这个新特性，代码就会大大减小，而且可读性比起之前大大增强
```C#
 Person p = new Person {FirstName = "Jack", LastName = "Wang", Age = 100};
 var results = string.Format("First Name: {0} LastName: {1} Age: { 2} ", p.FirstName, p.LastName, p.Age);
``` 
有了字符串插值后:
```C#
 var results = $"First Name: {p.FirstName} LastName: {p.LastName} Age: {p.Age}";
```
字符串插值不光是可以插简单的字符串，还可以直接插入代码
```C#
Console.WriteLine($"Jack is saying { new Tools().SayHello() }");

var info = $"Your discount is {await GetDiscount()}";
```
那么如何处理多语言呢？我们可以使用 IFormattable下面的代码如何实现多语言？
```C#
 Double remain = 2000.5; 
 var results= $"your money is {remain:C}";  
```
输出 your money is $2,000.50

使用IFormattable 多语言
```C#
class Program
{
    static void Main(string[] args)
    {

        Double remain = 2000.5; 

       var results= ChineseText($"your money is {remain:C}");

        Console.WriteLine(results);
        Console.Read();
    }

    public static string ChineseText(IFormattable formattable)
    {
        return formattable.ToString(null, new CultureInfo("zh-cn"));
    }
}
```
输出  your money is ￥2,000.50
## 二、空操作符 ( ?. )
C# 6添加了一个 ?. 操作符，当一个对象或者属性职为空时直接返回null, 就不再继续执行后面的代码，在之前我们的代码里经常出现 NullException, 所以我们就需要加很多Null的判断，比如
```C#
 if (user != null && user.Project != null && user.Project.Tasks != null && user.Project.Tasks.Count > 0)
 {
   Console.WriteLine(user.Project.Tasks.First().Name);
 }
```
现在我们可以不用写 IF 直接写成如下这样
```C#
Console.WriteLine(user?.Project?.Tasks?.First()?.Name);
```
这个?. 特性不光是可以用于取值，也可以用于方法调用，如果对象为空将不进行任何操作，下面的代码不会报错，也不会有任何输出。
```C#
class Program
{
    static void Main(string[] args)
    {
        User user = null;
        user?.SayHello();
        Console.Read();
    }
}

public class User
{
    public void SayHello()
    {
        Console.WriteLine("Ha Ha");
    }
}
```
还可以用于数组的索引器
```C#
class Program
{
    static void Main(string[] args)
    {
        User[] users = null;

        List<User> listUsers = null;

        // Console.WriteLine(users[1]?.Name); // 报错
        // Console.WriteLine(listUsers[1]?.Name); //报错

        Console.WriteLine(users?[1].Name); // 正常
        Console.WriteLine(listUsers?[1].Name); // 正常

        Console.ReadLine();
    }
}
```
注意： 上面的代码虽然可以让我们少些很多代码，而且也减少了空异常，但是我们却需要小心使用，因为有的时候我们确实是需要抛出空异常，那么使用这个特性反而隐藏了Bug
## 三、 NameOf
过去，我们有很多的地方需要些硬字符串，导致重构比较困难，而且一旦敲错字母很难察觉出来，比如
```C#
if (role == "admin")
{
}
```
WPF 也经常有这样的代码
```C#
public string Name
{
  get { return name; }
  set
  {
      name= value;
      RaisePropertyChanged("Name");
  }
}
```
现在有了C#6 NameOf后，我们可以这样
```C#
public string Name
{
  get { return name; }
  set
  {
      name= value;
      RaisePropertyChanged(NameOf(Name));
  }
}
static void Main(string[] args)
{
    Console.WriteLine(nameof(User.Name)); //  output: Name
    Console.WriteLine(nameof(System.Linq)); // output: Linq
    Console.WriteLine(nameof(List<User>)); // output: List
    Console.ReadLine();
}
```
注意： NameOf只会返回Member的字符串，如果前面有对象或者命名空间，NameOf只会返回 . 的最后一部分, 另外NameOf有很多情况是不支持的，比如方法，关键字，对象的实例以及字符串和表达式
## 四、在Catch和Finally里使用Await
在之前的版本里，C#开发团队认为在Catch和Finally里使用Await是不可能，而现在他们在C#6里实现了它。
```C#
Resource res = null;
try
{
    res = await Resource.OpenAsync(); // You could always do this.  
}
catch (ResourceException e)
{
    await Resource.LogAsync(res, e); // Now you can do this … 
} 
finally
{
    if (res != null) await res.CloseAsync(); // … and this.
}
```        
## 五、表达式方法体
一句话的方法体可以直接写成箭头函数，而不再需要大括号
```C#
 class Program
 {
    private static string SayHello() => "Hello World";
    private static string JackSayHello() => $"Jack {SayHello()}";

    static void Main(string[] args)
    {
        Console.WriteLine(SayHello());
        Console.WriteLine(JackSayHello());
        
        Console.ReadLine();
    }
}
```
## 六、自动属性初始化器
之前我们需要赋初始化值，一般需要这样
``` C#
public class Person
{
    public int Age { get; set; }

    public Person()
    {
        Age = 100;
    }
}
```
但是C# 6的新特性里我们这样赋值
```C#
public class Person
{
    public int Age { get; set; } = 100;
}
```
## 七、只读自动属性
C# 1里我们可以这样实现只读属性
``` C#
public class Person
{
    private int age=100;

    public int Age
    {
        get { return age; }
    }
}
```
但是当我们有自动属性时，我们没办法实行只读属性，因为自动属性不支持readonly关键字，所以我们只能缩小访问权限
```C#
public class Person
{
    public  int Age { get; private set; }
   
}
```
但是 C#6里我们可以实现readonly的自动属性了
```C#
public class Person
{
    public int Age { get; } = 100;
}
```
## 八、异常过滤器 Exception Filter
```C#
static void Main(string[] args)
{

    try
    {
        throw  new ArgumentException("Age");
    }
    catch (ArgumentException argumentException) when( argumentException.Message.Equals("Name"))
    {
        throw  new ArgumentException("Name Exception");

    }

    catch (ArgumentException argumentException) when( argumentException.Message.Equals("Age"))
    {
        throw new Exception("not handle");
        
    }
    catch  (Exception e)
    {
        
        throw;
    }
}
```
在之前，一种异常只能被Catch一次，现在有了Filter后可以对相同的异常进行过滤，至于有什么用，那就是见仁见智了，我觉得上面的例子，定义两个具体的异常 NameArgumentException 和AgeArgumentException代码更易读。
## 九、 Index 初始化器
这个主要是用在Dictionary上，至于有什么用，我目前没感觉到有一点用处，谁能知道很好的使用场景，欢迎补充:
```C#
var names = new Dictionary<int, string>
{
    [1] = "Jack",
    [2] = "Alex",
    [3] = "Eric",
    [4] = "Jo"
};

foreach (var item in names)
{
    Console.WriteLine($"{item.Key} = {item.Value}");
}
```
## 十、using 静态类的方法可以使用 static using
这个功能在我看来，同样是很没有用的功能，也为去掉前缀有的时候我们不知道这个是来自哪里的，而且如果有一个同名方法不知道具体用哪个，当然经证实是使用类本身的覆盖，但是容易搞混不是吗？
```C#
using System;
using static System.Math;
namespace CSharp6NewFeatures
 {
  class Program
  {
      static void Main(string[] args)
    {
        Console.WriteLine(Log10(5)+PI);
    }
  }
}
```
总结
上面一到八我认为都是比较有用的新特性，后面的几个我觉得用处不大，当然如果找到合适的使用场景应该有用，欢迎大家补充。
最后，祝大家编程愉快。