# C# 新特性

## C# 6
### 一、字符串插值 （String Interpolation）

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
### 二、空操作符 ( ?. )
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
### 三、 NameOf
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
### 四、在Catch和Finally里使用Await
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
### 五、表达式方法体
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
### 六、自动属性初始化器
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
### 七、只读自动属性
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
### 八、异常过滤器 Exception Filter
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
### 九、 Index 初始化器
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
### 十、using 静态类的方法可以使用 static using
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

## C# 7

### 数字字面量

现在可以在数字中加下划线，增加数字的可读性。编译器或忽略所有数字中的下划线
``` C#
int million = 1_000_000;
```
虽然编译器允许在数字中任意位置添加任意个数的下划线，但显然，遵循管理，下划线应该每三位使用一次，而且，不可以将下划线放在数字的开头（_1000）或结尾（1000_）

### 改进的out关键字

C#7支持了out关键字的即插即用

``` C#
var a = 0;
int.TryParse("345", out a);

// 就地使用变量作为返回值
int.TryParse("345", int out b);
```
允许以_（下划线）形式“舍弃”某个out参数，方便你忽略不关系的参数。例如下面的例子中，获得一个二维坐标的X可以重用获得二维坐标的X，Y方法，并舍弃掉Y：

``` C# 
struct Point
{
	public int x;
	public int y;
	private void GetCoordinates(out int x, out int y)
	{
		x = this.x;
		y = this.y;
	}
	public void GetX()
	{
		// y被舍弃了，虽然GetCoordinates方法还是会传入2个变量，且执行y=this.y
		// 但它会在返回之后丢失
		GetCoordinates(out int x, out _);
		WriteLine($"({x})");
	}
}
```

### 模式匹配

模式匹配（Pattern matching）是C#7中引入的重要概念，它是之前is和case关键字的扩展。目前，C#拥有三种模式：

* 常量模式：简单地判断某个变量是否等于一个常量（包括null）
* 类型模式：简单地判断某个变量是否为一个类型的实例
* 变量模式：临时引入一个新的某个类型的变量（C#7新增）

下面的例子简单地演示了这三种模式：

``` C# 
class People
{
	public int TotalMoney { get; set; }
	public People(int a)
	{
		TotalMoney = a;
	}
}

class Program
{
	static void Main(string[] args)
	{
		var peopleList = new List<People>() {
			new People(1),
			new People(1_000_000)
		};
		foreach (var p in peopleList)
		{
			// 类型模式
			if (p is People) WriteLine("是人");
			// 常量模式
			if (p.TotalMoney > 500_000) WriteLine("有钱");
			// 变量模式
			// 加入你需要先判断一个变量p是否为People，如果是，则再取它的TotalMoney字段
			// 那么在之前的版本中必须要分开写
			if (p is People)
			{
				var temp = (People)p;
				if (temp.TotalMoney > 500_000) WriteLine("有钱");
			}
			// 变量模式允许你引入一个变量并立即使用它
			if (p is People ppl && ppl.TotalMoney > 500_000) WriteLine("有钱");
		}
		ReadKey();
	}
}
```
可以看出，变量模式引入的临时变量ppl（称为模式变量）的作用域也是整个if语句体，它的类型是People类型
case关键字也得到了改进。现在，case后面也允许模式变量，还允许when子句，代码如下：

``` C#
static void Main(string[] args)
{
	var a = 13;
	switch (a)
	{
		// 现在i就是a
		// 由于现在case后面可以跟when子句的表达式，不同的case有机会相交
		case int i when i % 2 == 1:
			WriteLine(i + " 是奇数");
			break;
		// 只会匹配第一个case，所以这个分支无法到达
		case int i when  i > 10:
			WriteLine(i + " 大于10");
			break;
		// 永远在最后被检查，即使它后面还有case子句
		default:
			break;
	}
	ReadKey();
}

```
上面的代码运行的结果是打印出13是奇数，我们可以看到，现在case功能非常强大，可以匹配更具体、跟他特定的范围。不过，多个case的范围重叠，编译器只会选择第一个匹配上的分支

### 值类型元组

元组（Tuple）的概念早在C#4就提出来，它是一个任意类型变量的集合，并最多支持8个变量。在我们不打算手写一个类型或结构体来盛放一个变量集合时（例如，它是临时的且用完即弃），或者打算从一个方法中返回多个值，我们会考虑使用元组。不过相比C#7的元组，C#4的元组更像一个半成品，先看看C#4如何使用元组：

``` C#
var beforeTuple = new Tuple<int, int>(2, 3);
var a = beforeTuple.Item1;
```

通过上面的代码发现，C#4中元组最大的两个问题是：

* Tuple类将其属性命名为Item1、Item2等，这些名称是无法改变的，只会让代码可读性变差
* Tuple是引用类型，使用任一Tuple类意味着在堆上分配对象，因此，会对性能造成负面影响

C#7引入的新元组（ValueTuple）解决了上面两个问题，它是一个结构体，并且你可以传入描述性名称（TupleElementNames属性）以便更容易地调用他们

``` C#
static void Main(string[] args)
{
	// 未命名的元组，访问方式和之前的元组相同
	var unnamed = ("one", "two");
	var b = unnamed.Item1;
	// 带有命名的元组
	var named = (first : "one", second : "two");
	b = named.first;
	ReadKey();
}
```
在背后，他们被编译器隐式地转化为：

``` C#
ValueTuple<string, string> unnamed = new ValueTuple<string, string>() ("one", "two");
string b = unnamed.Item1;
ValueTuple<string, string> named = new ValueTuple<string, string>() ("one", "two");
b = named.Item1;
```
我们看到，编译器将带有命名元组的实名访问转换成对应的Item，转换是使用特性实现的

#### 元组的字段名称

可以在元组定义时传入变量。此时，元组的字段名称为变量名。如果没有指明字段名称，又传入了常量，则只能使用Item1、Item2等访问元组的成员

``` C# 
static void Main(string[] args)
{
	var localVariableOne = 5;
	var localVariableTwo = "some text";
	// 显示实现的字段名称覆盖变量名
	var tuple = (explicitFieldOne : localVariableOne, explicitFieldTwo : localVariableTwo);
	var a = tuple.explicitFieldOne;
	
	// 没有指定字段名称，又传入了变量名（需要C#7.1版本）
	var tuple2 = (localVariableOne, localVariableTwo);
	var b = tuple.localVariableOne;
	
	// 如果没有指明字段名称，又传入了常量，则只能使用Item1、Item2等访问元组的成员
	var tuple3 = (5, "some text");
	var c = tuple3.Item1;
	ReadKey();
}
```

上面的代码给出了元组字段名称的优先级：

* 首先是显示实现
* 其次是变量名（编译器自动推断的，需要C#7.1）
* 最后是默认的Item1、Item2作为保留名称

另外，如果变量名或显示指定的描述名称是C#的关键字，则C#会改用ItemX作为字段名称（否则就会导致语法错误，例如将变量名为ToString的变量传入元组）

``` C#
var ToString = "1";
var Item1 = 2;
var tuple4 = (ToString, Item1);

// ToString不能用作元组字段名称，强制改为Item1
var d = tuple4.Item1; // "1"
// Item1不能用作元组字段名，强制改为Item2
var e = tuple4.Item2; // 2
ReadKey();
```

### 元组作为方法的参数和返回值

因为元组实际上是一个结构体，所以它当然可以作为方法的参数和返回值。因此，我们就有了可以返回多个变量的最简单、最优雅的方法（比使用out的可读性好很多）：

``` C#
// 使用元组作方法的参数和返回值
(int, int) MultiplyAll(int multiplier, (int a, int b) members)
{
	// 元组没有实现IEnumerator接口，不能foreach
	// foreach(var a in members)
	// 操作元组
	return (members.a * multiplier, members.b * multiplier);
}
```

上面代码中的方法会将输入中的a和b都乘以multiplier，然后返回结构。由于元组是结构体，所以即使含有引用类型，其值类型的部分也会在栈上进行分配，相比C#4的元组，C#7中的元组有着更好的性能和更友好的访问方式

#### 相同类型元组的赋值

如果它们的基数（即成员数）相同，且每个元素的类型要么相同，要么可以实现隐式转换，则两个元组被看作相同的类型：

``` C#
static void Main(string[] args)
{
	var a = (first : "one", second : 1);
	WriteLine(a.GetType());
	var b = (a : "hello", b : 2);
	WriteLine(b.GetType());
	var c = (a : 3, b : "world");
	WriteLine(c.GetType());
	
	WriteLine(a.GetType() == b.GetType()); // True，两个元组基数和类型相同
	WriteLine(a.GetType() == c.GetType()); // False，两个元组基数相同但类型不同
	
	(string a, int b) d = a;
	// 属性first，second消失了，取而代之的是a和b
	WriteLine(d.a);
	// 定义了一个新的元组，成员为string和object类型
	(string a, object b) e;
	// 由于int可以被隐式转换为object，所以可以这样赋值
	e = a;
	ReadKey();
}
```
### 解构

C#7允许你定义结构方法（Deconstructor），注意，它和C#诞生即存在的析构函数（Destructor）不同。解构函数和构造函数做的事情某种程度上是相对的——构造函数将若干个类型组合为一个大的类型，而结构方法将大类型拆散为一堆小类型，这些小类型可以是单个字段，也可以是元组。当类型成员很多而需要的部分通常较小时，解构方法会很有用，它可以防止类型传参时复制的高昂代价

#### 元组的解构

可以在括号内显示地声明每个字段的类型，为元组中的每个元素创建离散变量，也可以用var关键字

``` C# 
static void Main(string[] args)
{
	// 定义元组
	(int count, double sum, double sumOfSquares) tuple = (1, 2, 3);
	// 使用方差的计算公式得到方差
	var variance = tuple.sumOfSquares - tuple.sum * tuple.sum / tuple.count;

	// 将一个元组放在等号右边，将对应的变量值和类型放在等号左边，就会导致解构
	(int count, double sum, double sumOfSquares) = (1, 2, 3);
	// 解构之后的方差计算，代码简洁美观
	variance = sumOfSquares - sum * sum / count;
	// 也可以这样解构，这会导致编译器推断元组的类型为三个int
	var (a, b, c) = (1, 2, 3);
	ReadKey();
}
```
上面的代码中，出现了两次解构方法的隐式调用：左边是一个没有元组变量名的元组（只有一些成员变量名），右边是元组的实例。解构方法所做的事情，就是将右边元组的实例中每个成员，逐个指派给左边元组的成员变量。例如：

``` C#
(int count, double sum, double sumOfSquares) = (1, 2, 3);
```

就会使得count，sum和sumOfSquares的值分别为1，2，3。如果没有这个功能，就需要定义3个变量，然后赋值3次，最终得到6行代码，大大提高了代码的可读性。
对于元组，C#提供了内置的解构支持，因此不需要手动写解构方法，如果需要对非元组类型进行解构，就需要定义自己的解构方法，显而易见，上面的解构通过如下的签名的函数完成：

``` C#
public void Deconstruct(out int count, out double sum, out double sumOfSquares)
```

#### 解构其他类型

解构函数的名称必须为Deconstruct，下面的例子从一个较大的类型People中解构出我们想要的三项成员：

``` C# 
// 示例类型
public class People
{
	public int ID;
	public string FirstName;
	public string MiddleName;
	public string LastName;
	public int Age;
	public string CompanyName;
	// 解构全名，包括姓、名字和中间名
	public void Deconstruct(out string f, out string m, out string l)
	{
		f = FirstName;
		m = MiddleName;
		l = LastName;
	}
}

static void Main(string[] args)
{
	var  p = People();
	p.FirstName = "Test";
	var (fName, mName, lName) = p;
	WriteLine(fName);

	ReadKey();
}
```

解构方法不能有返回值，且要解构的每个成员必须以out标识出来。如果编译器对一个类型的实例解构，却没发现对应的解构函数，就会发生编译时异常。如果在解构时发生隐式类型转换，则不会发生编译时异常，例如将上述的解构函数的输入参数类型都改为object类型，仍然可以完成解构，可以通过**重载解构函数对类型实现不同方式的解构**

#### 忽略类型成员

为了少写代码，我们可以在解构时忽略类型成员。例如，我们如果只关系People的姓和名字，而不关心中间名，则不需要多写一个解构函数，而是利用现有的：

``` C#
var (fName, _, lName) = p;
```

通过使用下划线来忽略类型成员，此时仍然会调用带有三个参数的解构函数，但是p将会只有fName和lName两个成员元组也支持忽略类型成员的解构

#### 使用扩展方法进行解构

即使类型并非由自己定义，仍然可以通过解构扩展方法来解构类型，例如解构.NET自带的DateTime类型：

``` C#
class Program
{
	static void Main(string[] args)
	{
		var d = DateTime.Now;
		(string s, DayOfWeek dow) = d;
		WriteLine($"今天是 {s}, 是 {d}");
		ReadKey();
	}
}
public static class ReflectionExtensions
{
	// 解构DateTime并获得想要的值
	public static void Deconstruct(this DateTime dateTime, out string DateString, out DayOfWeek dayOfWeek)
	{
		DateString = dateTime.ToString("yyyy-MM-dd");
		dayOfWeek = dateTime.DayOfWeek;
	}
}
```
如果类型提供了解构方法，你又在扩展方法中定义了与签名相同的解构方法，则编译器会优先选用类型提供的解构方法

### 局部函数

局部函数（local functions）和匿名方法很像，当你有一个只会使用一次的函数（通常作为其他函数的辅助函数）时，可以使用局部函数或匿名方法。如下是一个利用局部函数和元组计算斐波那契数列的例子：

``` C#
static void Main(string[] args)
{
	WriteLine(Fibonacci(10));
	ReadKey();
}
public static int Fibonacci(int x)
{
	if (x < 0) throw new ArgumentException("输入正整数", nameof(x));
	return Fib(x).current;

	// 局部函数定义
	(int current, int previous) Fib(int i)
	{
		if (i == 1) return (1, 0);
		var (p, pp) = Fib(i - 1);
		return (p + pp, p);
	}
}
```

局部函数是属于定义该函数的方法的，在上面的例子中，Fib函数只在Fibonacci方法中可用

* 局部函数只能在方法体中使用
* 不能在匿名方法中使用
* 只能用async和unsafe修饰局部函数，不能使用访问修饰符，默认是私有、静态的
* 局部函数和某普通方法签名相同，局部函数会将普通方法隐藏，局部函数所在的外部方法调用时，只会调用到局部函数

### 更多的表达式体成员

C#6允许类型的定义中，字段后跟表达式作为默认值。C#7进一步允许了构造函数、getter、setter以及析构函数后跟表达式：

``` C#
class CSharpSevenClass
{
	int a;
	// get, set使用表达式
	string b
	{
		get => b;
		set => b = "12345";	
	}
	// 构造函数
	CSharpSevenClass(int x) => a = x;
	// 析构函数
	~CSharpSevenClass() => a = 0;
}
```
上面的代码演示了所有C#7中允许后跟表达式（但过去版本不允许）的类型实例成员

## C# 8

### 可空引用类型

从此，引用类型将会区分是否可分，可以从根源上解决 NullReferenceException。但是由于这个特性会打破兼容性，因此没有当作 error 来对待，而是使用 warning 折衷，而且开发人员需要手动 opt-in 才可以使用该特性（可以在项目层级或者文件层级进行设定）。
例如：

``` C# 
string s = null; // 产生警告: 对不可空引用类型赋值 null
string? s = null; // Ok

void M(string? s)
{
    Console.WriteLine(s.Length); // 产生警告：可能为 null
    if (s != null)
    {
        Console.WriteLine(s.Length); // Ok
    }
}
```
至此，妈妈再也不用担心我的程序到处报 NullReferenceException 啦！

### 异步流（Async streams）

考虑到大部分 Api 以及函数实现都有了对应的 async版本，而 IEnumerable<T>和 IEnumerator<T>还不能方便的使用 async/await就显得很麻烦了。
但是，现在引入了异步流，这些问题得到了解决。
我们通过新的 IAsyncEnumerable<T>和 IAsyncEnumerator<T>来实现这一点。同时，由于之前 foreach是基于IEnumerable<T>和 IEnumerator<T>实现的，因此引入了新的语法await foreach来扩展 foreach的适用性。
例如：

``` C# 
async Task<int> GetBigResultAsync()
{
    var result = await GetResultAsync();
    if (result > 20) return result; 
    else return -1;
}

async IAsyncEnumerable<int> GetBigResultsAsync()
{
    await foreach (var result in GetResultsAsync())
    {
        if (result > 20) yield return result; 
    }
}
```

### 范围和下标类型

C# 8.0 引入了 Index 类型，可用作数组下标，并且使用 ^ 操作符表示倒数。
不过要注意的是，倒数是从 1 开始的。

``` C#
Index i1 = 3;  // 下标为 3
Index i2 = ^4; // 倒数第 4 个元素
int[] a = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
Console.WriteLine($"{a[i1]}, {a[i2]}"); // "3, 6"
```

除此之外，还引入了 “..” 操作符用来表示范围（注意是左闭右开区间）。

``` C#
var slice = a[i1..i2]; // { 3, 4, 5 }
```
关于这个下标从 0 开始，倒数从 1 开始，范围左闭右开，笔者刚开始觉得很奇怪，但是发现 Python 等语言早已经做了这样的实践，并且效果不错。因此这次微软也采用了这种方式设计了 C# 8.0 的这个语法。

### 接口的默认实现方法

从此接口中可以包含实现了：

``` C#
interface ILogger
{
    void Log(LogLevel level, string message);
    void Log(Exception ex) => Log(LogLevel.Error, ex.ToString()); // 这是一个默认实现重载
}

class ConsoleLogger : ILogger
{
    public void Log(LogLevel level, string message) { ... }
    // Log(Exception) 会得到执行的默认实现
}
```

在上面的例子中，Log(Exception)将会得到执行的默认实现。

### 模式匹配表达式和递归模式语句

现在可以这么写了（patterns 里可以包含 patterns）

``` C#
IEnumerable<string> GetEnrollees()
{
    foreach (var p in People)
    {
        if (p is Student { Graduated: false, Name: string name }) yield return name;
    }
}
```

Student { Graduated: false, Name: string name }检查 p 是否为 Graduated = false且 Name为 string的 Student，并且迭代返回 name。
可以这样写之后是不是很爽？

更有：

``` C#
var area = figure switch 
{
    Line _      => 0,
    Rectangle r => r.Width * r.Height,
    Circle c    => c.Radius * 2.0 * Math.PI,
    _           => throw new UnknownFigureException(figure)
};
```

典型的模式匹配语句，只不过没有用“match”关键字，而是沿用了
了“switch”关键字。
但是不得不说，一个字，爽！


### 目标类型推导

以前我们写下面这种变量/成员声明的时候，大概最简单的写法就是：

``` C#
var points = new [] { new Point(1, 4), new Point(2, 6) };

private List<int> _myList = new List<int>();
```
现在我们可以这么写啦：

``` C#
Point[] ps = { new (1, 4), new (3,-2), new (9, 5) };

private List<int> _myList = new ();
```

## C# 9

### init属性访问器

对象初始化方式对于创建对象来说是一种非常灵活和可读的格式，特别是对树状嵌入型对象的创建。简单的例如

``` C#
new Person
{
    FirstName = "Scott",
    LastName = "Hunter"
}
```

原有的要进行对象初始化，我们必须要做就是写一些属性，并且在构造函数的初次调用中，通过给属性的setter赋值来实现。

``` C#
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
```

就这样的方式而言，set访问器对于初始化来说是必须的，但是如果你想要的是只读属性，这个set就是不合适的。除过初始化，其他情况不需要，而且很多情况下容易引起属性值改变。为了解决这个矛盾，只用来初始化的init访问器出现了。init访问器是一个只在对象初始化时用来赋值的set访问器的变体，并且后续的赋值操作是不允许的。例如：
``` C#
public class Person
{
    public string FirstName { get; init; }
    public string LastName { get; init; }
}
```
### init属性访问器和只读字段

因为init访问器只能在初始化时被调用，原来只能在构造函数里进行初始化的只读字段，现在可以在属性中进行初始化，不用再在构造函数进行初始化。省略了构造函数。

``` C#
public class Person
{
    private readonly string firstName;
    private readonly string lastName;
    
    public string FirstName 
    { 
        get => firstName; 
        init => firstName = (value ?? throw new ArgumentNullException(nameof(FirstName)));
    }
    public string LastName 
    { 
        get => lastName; 
        init => lastName = (value ?? throw new ArgumentNullException(nameof(LastName)));
    }
}
```

###  Records

如果你需要一个整个对象都是不可变的，且行为像一个值的类型，你可以考虑将其声明为record。

``` C#
public data class Person
{
    public string FirstName { get; init; }
    public string LastName { get; init; }
}
```
关键字data用来将类标记为record。这样类就具有了像值一样的行为。records意味看起来更像值，也就是数据，而且很少像对象。不是说他们有可变的封装的状态，而是通过创建代表新状态的records来呈现随时间变化的状态。records不是被他们的标识符界定，而是被他们的内容所界定的。

### With表达式

当用不可变的数据类型时，一个公用的模式是从现存的值类创建新值来呈现一个新状态。例如，如果Person改变了他的last name，我们就需要通过拷贝原来数据，并设置一个不同的last name来呈现一个新Person。这种技术被称为非破坏性改变。作为呈现随时间变化的person，record呈现了一个特定时间的person的状态。为了帮助这种类型的编程处理，records就提出了一个新的表达式，这就是with表达式：

``` C#
var otherPerson = person with { LastName = "Hanselman" };
```

with表达式使用初始化语法来声明与原来对象不同的新状态对象。

一个record隐式定义了一个带有保护访问级别的“拷贝构造函数”，用来将现有record对象的字段值拷贝到新对象对应字段中：

``` C#
protected Person(Person original) { /* copy all the fields */ } // generated
```
with表达式就会引起拷贝构造函数进行调用，然后应用对象初始化器来有限更改属性相应值。如果你不喜欢默认的产生的拷贝构造函数，你可以自定以，with表达式也会进行调用。

### 基于值的相等

所有对象都从object类型继承了 Equals(object)，这是静态方法 Object.Equals(object, object) 用来比较两个非空参数的基础。

结构重写这个方法，通过递归调用每个结构字段的Equals方法，从而有了“基于值的相等”，Recrods也是这样。这意味着那样与他们无值保持一致，两个record对象可以不用是同一个对象，而且相等。例如我们修改回了last name：

``` C#
var originalPerson = otherPerson with { LastName = "Hunter" };
```

现在我们会有 ReferenceEquals(person, originalPerson) = false (他们不是同一对象)，但是 Equals(person, originalPerson) = true (他们有同样的值).。

如果你不喜欢默认Equals重写的字段与字段比较行为，你可以进行重写。你只需要认真理解基于值的相等时如何在records中工作原理，特别是涉及到继承的时候，后面我们会提到。

与基于值的Equals一起的，还伴有基于值的GetHashCode()的重写。

### data成员

不可变的Records的成员是带有init的公共属性，可以通过with表达式进行无破坏性修改的。为了优化这种共有情况，records改变了形如string FirstName的默认意思，即在结构和类中声明的隐式私有字段，在records中成了公有，仅初始化自动属性。

``` C#
public data class Person { string FirstName; string LastName; }
```

上面这段声明，就是跟下面这段代码意思相同：

``` C#
public data class Person
{
    public string FirstName { get; init; }
    public string LastName { get; init; }
}
```

这个使得record声明看起来优美而清晰直观。如果你真的需要一个私有字段，你可以显式添加private修饰符。

``` C#
private string firstName;
```

### Positional records

 在record是可以指定构造函数和解构函数（注意不是析构函数）的。

 ```C#
public data class Person 
{ 
    string FirstName; 
    string LastName; 
    public Person(string firstName, string lastName) 
      => (FirstName, LastName) = (firstName, lastName);
    public void Deconstruct(out string firstName, out string lastName) 
      => (firstName, lastName) = (FirstName, LastName);
}
 ```
也可以用更精简的语法表达上面同样的内容。

```C#
public data class Person(string FirstName, string LastName);
```
该方式声明了公开的带有初始化自动属性、构造函数和解构函数，和第6条第一段代码带有大括号的声明方式是不同的。现在你就可以写如下代码：
``` C#
var person = new Person("Scott", "Hunter"); // positional construction
var (f, l) = person;                        // positional deconstruction
```
当然，如果你不喜欢产生的自动属性，你可以自定义你自己的同名属性代替，产生的构造函数和解构函数将会只使用那个。

### Records和变化

record基于值这种语义没有很好应对可变状态这种情况。想象给字典插入一个record对象。要查找到它，就得根据Equals和（一些时候）GetHashCode。 但是如果record改变了状态，它们也会跟着改变。这样，我们就可能再找不到这个record。在哈希表实现中，这样可能会损害数据结构，由于放置位置是基于它到达的哈希码。

现实中，存在有一些record内部的可变状态的有效的高级应用，如缓存。但是在重写默认行为来忽略这种状态所涉及的人工工作可能是相当多的。

### with表达式和继承
众所周知，基于值相等和非破坏性变化值的方式在和继承纠结在一起时，非常具有挑战性。下来，我们添加一个继承的record类Student来说明我们的例子：
``` C#
public data class Person { string FirstName; string LastName; }
public data class Student : Person { int ID; }
```
下来，我们通过创建一个Student，但是把他存放到Person变量中，来说明with表达式的使用：

``` C#
Person person = new Student { FirstName = "Scott", LastName = "Hunter", ID = GetNewId() };
otherPerson = person with { LastName = "Hanselman" };
```

在最后一行，编译器不知道person实际存放的是一个Student，这样，新person对象就不会得到正确的拷贝，即就不会像4中的第一段代码拷贝那样，得到同样ID值。

C#为了使这个得以正确工作。Records有一个隐藏的virtual方法，用于执行整体对象的克隆。每个派生的record类型重写了这个方法，以调用那个类型的拷贝构造函数，派少的record构造函数也受约束于父record的拷贝构造函数。with表达式简单调用这个隐藏的“clone”方法，应用对象初始化器给结果。

### 基于值相等和继承

类似于with表达式的支持，基于值的相等性也必须是“virtual”，在这种意义上来说，Students需要比较所有student字段，即使在比较时静态已知类型是像Person这样的基类，也容易通过重写已经有的virtual Equals方法来实现。

然而，相等有着一个格外的挑战，就是如果比较两个不同类型的Person会怎么样？我们不能让他们中一个决定应用哪一个相等性：相等应该是语义的，所以不管两个对象中哪个先来，解构应是相同的。换句话说，他们必须在被应用的相等性达成一致。

这个问题的例子如下：

``` C#
Person person1 = new Person { FirstName = "Scott", LastName = "Hunter" };
Person person2 = new Student { FirstName = "Scott", LastName = "Hunter", ID = GetNewId() };
```
这两个对象是不是彼此相等？person1可能这样认为，由于person2有着person所有的成员，并且值相等，但是person2不敢苟同。我们需要确认他们两个对于他们是不同对象达成一致意见。

再一次，C#自然为你考虑到了这个，实现的方式是records有一个虚拟保护的属性，叫做EqualityContract。每个派生的record重写它，以便比较相等，两个对象必须有同样的EqualityContract。

### 顶级程序

通常，我们洗一个简单的C#程序，都要求有大量的样例代码：

``` C#
using System;
class Program
{
    static void Main()
    {
        Console.WriteLine("Hello World!");
    }
}
```
这个对于初学者是无法抗拒，但是这使得代码凌乱，大量堆积，并且增加了缩进层级。在C#9.0中，你可以选择在顶级用如下代码代替写你的主程序：
``` C#
using System;

Console.WriteLine("Hello World!");
```
当然，任何语句都是允许的。但是这个程序代码必须出现在using后，在任何类型或者命名空间声明的前面。并且你只能在一个文件里面这样做，像你如今只写一个main方法一样。

如果你想返回状态，你可以那样做，你想用await，也可以那样做。并且，如果你想访问命令行参数，args也是可用的。

本地方法是语句的另一个形式，也是允许在顶级程序代码用的。在顶级代码段外部的任何地方调用他们都会产生错误。

### 增强的模式匹配

C#9.0添加了几个新的模式，如果要了解下面代码段的上下文，请参阅模式匹配教程：

``` C#
public static decimal CalculateToll(object vehicle) =>
    vehicle switch
    {
       ...
       
        DeliveryTruck t when t.GrossWeightClass > 5000 => 10.00m + 5.00m,
        DeliveryTruck t when t.GrossWeightClass < 3000 => 10.00m - 2.00m,
        DeliveryTruck _ => 10.00m,

        _ => throw new ArgumentException("Not a known vehicle type", nameof(vehicle))
    };
```

（1）简单类型模式

当前，当类型匹配的时候，一个类型模式需要声明一个标识符——即使这标识符是_，像上面代码中的DeliveryTruck _ 。但是在C#9.0中，你可以只写类型，如下所示：
``` C#
DeliveryTruck => 10.00m,
```

（2）关系模式

C#9.0 推出了关系运算符相应的模式，例如<,<=等等。所以你现在可以用switch表达式将下上面模式中的DeliveryTruck部分写成下面样子：

```C#
DeliveryTruck t when t.GrossWeightClass switch
{
    > 5000 => 10.00m + 5.00m,
    < 3000 => 10.00m - 2.00m,
    _ => 10.00m,
},
```
这的 > 5000 和 < 3000是关系模式。

（3）逻辑模式

最后，你可以用逻辑操作符and，or 和not将模式进行组合，来详细说明，以避免表达式操作符引起的混淆。例如，上面嵌入的switch可以按照升序排序，如下：
``` C#
DeliveryTruck t when t.GrossWeightClass switch
{
    < 3000 => 10.00m - 2.00m,
    >= 3000 and <= 5000 => 10.00m,
    > 5000 => 10.00m + 5.00m,
},
```

中间的case使用了and 来组合两个关系模式形成了一个表达区间的模式。

not模式的公同使用是它将会被用在null常量模式上，就像not null。例如我们要根据是否为空来分割一个未知的case处理代码段：

``` C#
not null => throw new ArgumentException($"Not a known vehicle type: {vehicle}", nameof(vehicle)),
null => throw new ArgumentNullException(nameof(vehicle))
```
not将在包含了is表达式的if条件语句使用也会很方便，并且会取代笨重的双括号：

``` C#
if (!(e is Customer)) { ... }
```
你可以这样写：
``` C#
if (e is not Customer) { ... }
```
### 增强的类型推导

类型推导是当一个表达式从它所被使用的地方的上下文中获得它的类型时，我们经常使用的一个专业术语。例如null和lambda表达式总是涉及到类型推导的。

在C#9.0中，先前没有实现类型推导的一些表达式现在也可以用他们的上下文来进行类型推导了。

（1）类型推导的new表达式

在C#中，new表达式总是要求一个具体指定的类型（除了隐式类型数组表达式）。现在，如果表达式被指派给一个明确的类型时，你可以忽略new中类型。

``` C#
Point p = new (3, 5);
```
（2）类型推导的??和?:

一些时候，条件表达式??和?:在分支中没有明显的共享类型。现有这种情况会失败，但是在C#9.0中，如果各分支可以转换 为目标类型，这种情况时允许的。
``` C#
Person person = student ?? customer; // Shared base type
int? result = b ? 0 : null; // nullable value type
```
### 支持协变的返回值

一些时候，在子类的一个重写方法中返回一个更具体的、且不同于父类方法定义的返回类型更为有用，C# 9.0对这种情况提供了支持。

``` C#
abstract class Animal
{
    public abstract Food GetFood();
    ...
}
class Tiger : Animal
{
    public override Meat GetFood() => ...;
}
```





总结
上面一到八我认为都是比较有用的新特性，后面的几个我觉得用处不大，当然如果找到合适的使用场景应该有用，欢迎大家补充。
最后，祝大家编程愉快。
