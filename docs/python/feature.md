# Python新特性
## Python2.x与3​​.x版本区别
Python的3​​.0版本，常被称为Python 3000，或简称Py3k。相对于Python的早期版本，这是一个较大的升级。 
为了不带入过多的累赘，Python 3.0在设计的时候没有考虑向下相容。
许多针对早期Python版本设计的程式都无法在Python 3.0上正常执行。
为了照顾现有程式，Python 2.6作为一个过渡版本，基本使用了Python 2.x的语法和库，同时考虑了向Python 3.0的迁移，允许使用部分Python 3.0的语法与函数。
新的Python程式建议使用Python 3.0版本的语法。
除非执行环境无法安装Python 3.0或者程式本身使用了不支援Python 3.0的第三方库。目前不支援Python 3.0的第三方库有Twisted, py2exe, PIL等。
大多数第三方库都正在努力地相容Python 3.0版本。即使无法立即使用Python 3.0，也建议编写相容Python 3.0版本的程式，然后使用Python 2.6, Python 2.7来执行。
Python 3.0的变化主要在以下几个方面:
### print 函数
print语句没有了，取而代之的是print()函数。 Python 2.6与Python 2.7部分地支持这种形式的print语法。在Python 2.6与Python 2.7里面，以下三种形式是等价的：
```python
print "fish"
print ("fish") #注意print后面有个空格
print("fish") #print()不能带有任何其它参数
```
然而，Python 2.6实际已经支持新的print()语法：
```python
from __future__ import print_function
print("fish", "panda", sep=', ')
```
### Unicode

Python 2 有 ASCII str() 类型，unicode() 是单独的，不是 byte 类型。 
现在， 在 Python 3，我们最终有了 Unicode (utf-8) 字符串，以及一个字节类：byte 和 bytearrays。

由于 Python3.X 源码文件默认使用utf-8编码，这就使得以下代码是合法的： 
```python
>>> 中国 = 'china' 
>>>print(中国) 
china
```
Python 2.x
```python
>>> str = "我爱北京天安门"
>>> str
'\xe6\x88\x91\xe7\x88\xb1\xe5\x8c\x97\xe4\xba\xac\xe5\xa4\xa9\xe5\xae\x89\xe9\x97\xa8'
>>> str = u"我爱北京天安门"
>>> str
u'\u6211\u7231\u5317\u4eac\u5929\u5b89\u95e8'
```
Python 3.x
```python
>>> str = "我爱北京天安门"
>>> str
'我爱北京天安门'
```
### 除法运算
Python中的除法较其它语言显得非常高端，有套很复杂的规则。Python中的除法有两个运算符，/和// 
首先来说/除法:
在python 2.x中/除法就跟我们熟悉的大多数语言，比如Java啊C啊差不多，整数相除的结果是一个整数，把小数部分完全忽略掉，浮点数除法会保留小数点的部分得到一个浮点数的结果。
在python 3.x中/除法不再这么做了，对于整数之间的相除，结果也会是浮点数。 
Python 2.x:
```python
>>> 1 / 2
0
>>> 1.0 / 2.0
0.5
```
Python 3.x:
```python
>>> 1/2
0.5
```
而对于//除法，这种除法叫做floor除法，会对除法的结果自动进行一个floor操作，在python 2.x和python 3.x中是一致的。
python 2.x:
```python
>>> -1 // 2
-1
```
python 3.x:
```python
>>> -1 // 2
-1
```
注意的是并不是舍弃小数部分，而是执行 floor 操作，如果要截取整数部分，那么需要使用 math 模块的 trunc 函数
python 3.x:
```python
>>> import math
>>> math.trunc(1 / 2)
0
>>> math.trunc(-1 / 2)
0
```
### 异常
在 Python 3 中处理异常也轻微的改变了，在 Python 3 中我们现在使用 as 作为关键词。
捕获异常的语法由 except exc, var 改为 except exc as var。
使用语法except (exc1, exc2) as var可以同时捕获多种类别的异常。 Python 2.6已经支持这两种语法。
1. 在2.x时代，所有类型的对象都是可以被直接抛出的，在3.x时代，只有继承自BaseException的对象才可以被抛出。 
2. 2.x raise语句使用逗号将抛出对象类型和参数分开，3.x取消了这种奇葩的写法，直接调用构造函数抛出对象即可。 

在2.x时代，异常在代码中除了表示程序错误，还经常做一些普通控制结构应该做的事情，在3.x中可以看出，设计者让异常变的更加专一，只有在错误发生的情况才能去用异常捕获语句来处理。

### xrange
在 Python 2 中 xrange() 创建迭代对象的用法是非常流行的。比如： for 循环或者是列表/集合/字典推导式。 
这个表现十分像生成器（比如。"惰性求值"）。但是这个 xrange-iterable 是无穷的，意味着你可以无限遍历。 
由于它的惰性求值，如果你不得仅仅不遍历它一次，xrange() 函数 比 range() 更快（比如 for 循环）。尽管如此，对比迭代一次，不建议你重复迭代多次，因为生成器每次都从头开始。 
在 Python 3 中，range() 是像 xrange() 那样实现以至于一个专门的 xrange() 函数都不再存在（在 Python 3 中 xrange() 会抛出命名异常）。
```python
import timeit

n = 10000
def test_range(n):
    return for i in range(n):
        pass

def test_xrange(n):
    for i in xrange(n):
        pass   
```
Python 2
```python
print 'Python', python_version()

print '\ntiming range()' 
%timeit test_range(n)

print '\n\ntiming xrange()' 
%timeit test_xrange(n)

#Python 2.7.6

timing range()
1000 loops, best of 3: 433 µs per loop


timing xrange()
1000 loops, best of 3: 350 µs per loop
```
Python 3
```python
print('Python', python_version())

print('\ntiming range()')
%timeit test_range(n)

#Python 3.4.1

timing range()
1000 loops, best of 3: 520 µs per loop
```
```python
print(xrange(10))
---------------------------------------------------------------------------
NameError                                 Traceback (most recent call last)
<ipython-input-5-5d8f9b79ea70> in <module>()
----> 1 print(xrange(10))

NameError: name 'xrange' is not defined
```
### 八进制字面量表示
八进制数必须写成0o777，原来的形式0777不能用了；二进制必须写成0b111。
新增了一个bin()函数用于将一个整数转换成二进制字串。 Python 2.6已经支持这两种语法。
在Python 3.x中，表示八进制字面量的方式只有一种，就是0o1000。
python 2.x
```python
>>> 0o1000
512
>>> 01000
512
```
python 3.x
```python
>>> 01000
  File "<stdin>", line 1
    01000
        ^
SyntaxError: invalid token
>>> 0o1000
512
```
### 不等运算符
Python 2.x中不等于有两种写法 != 和 <>
Python 3.x中去掉了<>, 只有!=一种写法，还好，我从来没有使用<>的习惯 
### 去掉了repr表达式``
Python 2.x 中反引号``相当于repr函数的作用 
Python 3.x 中去掉了``这种写法，只允许使用repr函数，这样做的目的是为了使代码看上去更清晰么？不过我感觉用repr的机会很少，一般只在debug的时候才用，多数时候还是用str函数来用字符串描述对象。
```python
def sendMail(from_: str, to: str, title: str, body: str) -> bool:
    pass
```
### 多个模块被改名（根据PEP8）

| 旧的名字     | 新的名字      |
| ------------ | ------------- |
| _winreg      | winreg        |
| ConfigParser | configParaser |
| copy_reg     | copyreg       |
| Queue        | queue         |
| SocketServer | socketserver  |
| repr         | reprlib       |
StringIO模块现在被合并到新的io模组内。 new, md5, gopherlib等模块被删除。 Python 2.6已经支援新的io模组。
httplib, BaseHTTPServer, CGIHTTPServer, SimpleHTTPServer, Cookie, cookielib被合并到http包内。
取消了exec语句，只剩下exec()函数。 Python 2.6已经支援exec()函数。
### 数据类型 
1. Py3.X去除了long类型，现在只有一种整型——int，但它的行为就像2.X版本的long 
2. 新增了bytes类型，对应于2.X版本的八位串，定义一个bytes字面量的方法如下：
```python
>>> b = b'china' 
>>> type(b) 
<type 'bytes'> 
```
str对象和bytes对象可以使用.encode() (str -> bytes) or .decode() (bytes -> str)方法相互转化。 
```python
>>> s = b.decode() 
>>> s 
'china' 
>>> b1 = s.encode() 
>>> b1 
b'china' 
```
3. dict的.keys()、.items 和.values()方法返回迭代器，返回的值不再是list，而是view。所以dict.iterkeys(),dict.iteritems()和dict.itervalues()被去掉了。同时去掉的还有 dict.has_key()，用 in替代它吧 。
### 打开文件
原：
```python
file( ..... )
#或 
open(.....)
```
改为只能用
```python
open(.....)
```
### 从键盘录入一个字符串
在python2.x中raw_input()和input( )，两个函数都存在，其中区别为：
 raw_input()---将所有输入作为字符串看待，返回字符串类型 
 input()-----只能接收"数字"的输入，在对待纯数字输入时具有自己的特性，它返回所输入的数字的类型（int, float ） 
在python3.x中raw_input()和input( )进行了整合，去除了raw_input()，仅保留了input()函数，其接收任意任性输入，将所有输入默认为字符串处理，并返回字符串类型。
原:
```python
raw_input( "提示信息" )
```
改为:
```python
input( "提示信息" )
```
### map、filter 和 reduce
这三个函数号称是函数式编程的代表。在 Python3.x 和 Python2.x 中也有了很大的差异。

首先我们先简单的在 Python2.x 的交互下输入 map 和 filter,看到它们两者的类型是 built-in function(内置函数):
```python
>>> map
<built-in function map>
>>> filter
<built-in function filter>
>>>
```
它们输出的结果类型都是列表:
```python
>>> map(lambda x:x *2, [1,2,3])
[2, 4, 6]
>>> filter(lambda x:x %2 ==0,range(10))
[0, 2, 4, 6, 8]
>>>
```
但是在Python 3.x中它们却不是这个样子了：
```python
>>> map
<class 'map'>
>>> map(print,[1,2,3])
<map object at 0x10d8bd400>
>>> filter
<class 'filter'>
>>> filter(lambda x:x % 2 == 0, range(10))
<filter object at 0x10d8bd3c8>
>>>
```
首先它们从函数变成了类，其次，它们的返回结果也从当初的列表成了一个可迭代的对象, 我们尝试用 next 函数来进行手工迭代:
```python
>>> f =filter(lambda x:x %2 ==0, range(10))
>>> next(f)
0
>>> next(f)
2
>>> next(f)
4
>>> next(f)
6
>>>
```
对于比较高端的 reduce 函数，它在 Python 3.x 中已经不属于 built-in 了，被挪到 functools 模块当中。
## Python3.+新特性
新的语法特性：
* 格式化字符串字面值
* 数字字符串中支持下划线
* 变量注释的语法
* 异步生成器
* 异步列表推导
* 用类处理数据时减少样板代码的数据类
* 一处可能无法向后兼容的变更涉及处理生成器中的异常
* 面向解释器的“开发模式
* 具有纳秒分辨率的时间对象
* 环境中默认使用UTF-8编码的UTF-8模式
* 触发调试器的一个新的内置函数
### 新的模块
添加了一个安全模块secrets到标准库中
### CPython实现改进
* 字典基于Raymond Hettinger的建议使用更紧凑的表示重新实现了，和PyPy的字典实现类似。结果是和3.5版本相比，3.6版本字典的内存使用减少了20%到25%。
* 使用新的协议，自定义类的创建被简化了。
* 类属性的定义顺序能够被保存。
* 在**kwargs中元素的顺序对应于传递给函数时的关键字参数的顺序。
* 添加了DTrace和SystemTap探测的支持。
* 新的PYTHONMALLOC环境变量可以用于调试解释器内存分配和访问错误。
### 重大的标准库改进
* asyncio模块接收了新特性，重大的可用性和性能改进，然后修复了大量的BUG。从Python 3.6开始asyncio模块不再是临时的了，它已经被认为是稳定的了。
* 新的文件系统路径协议已实现，用于支持路径类对象。所有标准库函数在处理路径时已使用新的协议。
* datetime模块在本地时间消除歧义上获得了支持。
* typing模块接受了一些改进。
* tracemalloc模块经过重大改造，现在可以为ResourceWarnning提供更好的输出，也为内存分配错误提供更好的诊断。
### 安全改进
* secrets模块已被添加，可以生成更安全的伪随机数。
* 在Linux上，os.urandom()现在会被锁住，直到系统的伪随机滴池被初始化增加安全。
* hashlib和ssl模块现在支持OpenSSL 1.1.0。
* hashlib模块现在支持BLAKE2、SHA-3和SHAKE摘要算法和scrypt()秘钥导出功能。
### Windows改进
* Windows文件系统和控制台编码改为了UTF-8。
* python.exe和pythonw.exe现在支持长路径，详情请看[removing the MAX_PATH limitation](https://docs.python.org/3/using/windows.html#max-path)。
* 一个._pth文件可以被添加用于隔离模块，避免全路径搜索，详情请看文档。
### Formatted字符串字面值
Formatted字符串是带有’f’字符前缀的字符串，可以很方便的格式化字符串。
```python
>>> name = "xiaoming"
>>> f"He name is {name}"
'He name is xiaoming'
>>> width = 10
>>> precision = 4
>>> value = decimal.Decimal("12.34567")
>>> f"result: {value:{width}.{precision}}"
'result:      12.35'
```
### 数字中支持下划线
数字中支持使用下划线，方便阅读，例如：
```python
>>> 1_000_000_000_000_000
1000000000000000
>>> 0x_FF_FF_FF_FF
4294967295
```
字符串format方法也支持了’_’选项，当格式化为浮点数或整数时，以3位分隔，当格式化为’b’,’o’,’x’和’X’时，以4位分隔
```python
>>> '{:_}'.format(10000000)
'10_000_000'
>>> '{:_b}'.format(10000000)
'1001_1000_1001_0110_1000_0000'
```
### 变量注释语法
变量注释没有给变量带来特殊的意义，只是为了方便IDE做类型检查。
```python
>>> from typing import List,Dict
>>> primes: List[int] = []
>>> stats: Dict[str, int] = {}
```
上面代码中primes为变量名，List[int]为变量注释，用来说明primes列表是用来存放int类型数据的，但是这个不是强制性的，你使用append()方法添加一个str类型数据也是可以的，IDE会提示你添加的数据有误，但是运行时不会报错。
### 异步生成器
在Python3.5中，await和yield不能再同一个函数中使用，但是Python3.6已经取消了这个限制，可以在同一个函数体中使用了
```python
async def ticker(delay, to):
    """Yield numbers from 0 to *to* every *delay* seconds."""
    for i in range(to):
        yield i
        await asyncio.sleep(delay)
```
### 异步列表推导
增加在list、set和dict的列表推导和生成表达式中使用async for。 
如下面这段代码:
```python
result = []
async for i in aiter():
    if i % 2:
        result.append(i)
```
使用异步推导式之后，可以简写成
```python
result = [i async for i in aiter() if i % 2]
```
现在也支持在所有的推导式中使用await表达式
```
result = [await fun() for fun in funcs]
```
### Python数据类
众所周知，Python是处理结构化数据的一种快捷又方便的方法。Python提供了用来组织管理结构，并将常见行为与数据实例联系起来的类，但是拥有许多初始化器的类历来存在这个弊端：需要大量的样板代码为它们创建实例。比如说：
```python
class User():
    def __init__(self,name,user_id,just_joined=True):
        self.name=name
        self.id=user_id
        self.just_joined=just_joined
```
为了使这实现自动化：为类创建实例，Python 3.7引入了一个新的模块dataclasses，如[pep-0557](https://www.python.org/dev/peps/pep-0557/)中所述。它提供了一个装饰器，能够以异常简单的方式重现上述行为：
```python
@dataclass
class User():
    name:str
    user_id:int
    just_joined:bool=True
```
因而生成的类运行起来如同普通的Python类。你还可以声明某些字段是“冻结”或不可变的，并且使创建属性的特殊方法（比如__hash__或__repr__）实现自动化（或手动覆盖）。
### Python生成器异常处理
正如[PEP 479](https://www.python.org/dev/peps/pep-0479/)中概述，开发了一段时间的一处变更旨在让人们更容易调试Python生成器引发的StopIteration异常。以前，生成器遇到另一个问题时很容易引发StopIteration，而不是由于它用完了需要迭代的东西。这带来了一整批很难追踪的代码缺陷。

在Python 3.7中，生成器引发StopIteration异常后，StopIteration异常将被转换成RuntimeError异常，那样它不会悄悄一路影响应用程序的堆栈框架。这意味着如何处理生成器的行为方面不太敏锐的一些程序会在Python 3.7中抛出RuntimeError。而在Python 3.6中，这种行为生成一个弃用警告；在Python 3.7中，它生成一个完整的错误。

一个简易的方法是使用try/except代码段，在StopIteration传播到生成器的外面捕获它。更好的解决方案是重新考虑如何构建生成器――比如说，使用return语句来终止生成器，而不是手动引发StopIteration。想进一步了解如何在现有代码中补救这个问题，如何在新代码中防范该问题，请参阅[PEP 469](https://www.python.org/dev/peps/pep-0479/)。

### Python开发模式
Python解释器新的命令行开关：-X让开发人员可以为解释器设置许多低级选项。在Python 3.7中，选项-X dev启用“开发模式”，这种运行时检查机制通常对性能有重大影响，但在调试过程中对开发人员很有用。

-X dev激活的选项包括：
* asyncio模块的调试模式。这为异步操作提供了更详细的日志记录和异常处理，而异常操作可能很难调试或推理。
* 面向内存分配器的调试钩子。这对于编写CPython扩展件的那些人很有用。它能够实现更明确的运行时检查，了解CPython如何在内部分配内存和释放内存。
* 启用faulthandler模块，那样发生崩溃后，traceback始终转储出去。
### 具有纳秒分辨率的Python时间函数
Python 3.7中一类新的时间函数返回纳秒精度的时间值。尽管Python是一种解释型语言，但是Python的核心开发人员维克多•斯廷纳（Victor Stinner）主张报告纳秒精度的时间。最主要的原因是，在处理转换其他程序（比如数据库）记录的时间值时，可以避免丢失精度。

新的时间函数使用后缀_ns。比如说，time.process_time()的纳秒版本是time.process_time_ns()。请注意，并非所有的时间函数都有对应的纳秒版本，因为其中一些时间函数并不得益于此。
### Python UTF-8模式
Python一直支持UTF-8，以便轻松处理字符串和文本。但是周围环境中的语言环境（locale）有时仍是ASCII，而不是UTF-8，检测语言环境的机制并不总是很可靠。

Python 3.7添加了所谓的“UTF-8模式”，可通过-X命令行开关启用该模式，该模式假设UTF-8是环境提供的语言环境。在POSIX语言环境中，UTF-8模式默认情况下已被启用，但在其他位置默认情况下被禁用，以免破坏向后兼容。值得试一试在默认情况下开启UTF-8模式，但不应该在生产环境下启用它，除非你确信Python与周围环境的所有交互都使用UTF-8。
### 内置breakpoint()函数
Python随带内置的调试器，不过它也可以连入到第三方调试工具，只要它们能与Python的内部调试API进行对话。不过，Python到目前为止缺少一种从Python应用程序里面以编程方式触发调试器的标准化方法。

Python 3.7添加了breakpoint()，这个内置函数使得函数被调用时，让执行切换到调试器。相应的调试器不一定是Python自己的pdb，可以是之前被设为首选调试器的任何调试器。以前，调试器不得不手动设置，然后调用，因而使代码更冗长。而有了breakpoint()，只需一个命令即可调用调试器，并且让设置调试器和调用调试器泾渭分明。
### 其他新的Python 3.7功能
Python 3.7有另外的众多变更。下面是你在使用最新版本的Python时可能会遇到的其他一些功能：

面向线程本地存储支持的C-API

[PEP 539](https://www.python.org/dev/peps/pep-0539/)中描述，线程特定存储（TSS）API取代了老式的线程本地存储（TLS）API。如果谁定制CPython或编写使用解释器的内部API的CPython扩展件，就要明白这一点。

模块属性访问定制

你在Python程序中创建模块时，现在可以针对该模块的实例定制属性访问的行为。为此，只需要在模块里面创建一个__getattr__方法，就跟为一个类创建方法那样。这样一来，就可以对诸如请求模块里面不存在的函数或方法之类的操作进行拦截、标记或代理。

Python importlib资源

importlib模块现在可用来读取“资源”，即随Python应用程序一并交付的二进制工件，比如数据文件。这样一来，开发人员可以通过importlib的抽象来访问那些文件，所以它们存储在系统上某个地方的.zip文件中还是存储在目录中并不重要。

底层优化

现在许多单独的操作更快速了：

由于新的操作码，方法调用起来最多快20%。（除非你在编写直接处理Python操作码的代码，否则不需要担心由此带来的影响。）
正则表达式中不区分大小写的匹配速度更快了，有时要快20倍。
源代码中的一些常量现在可以更高效地优化。

### 更多特性
[Python Feature](https://github.com/leisurelicht/wtfpython-cn)