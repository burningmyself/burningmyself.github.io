# Python 拼接字符串的 7 种方式
## 1、来自C语言的%方式
```python
print('%s %s' % ('Hello', 'world'))
>>> Hello world
```
%号格式化字符串的方式继承自古老的C语言，这在很多编程语言都有类似的实现。上例的%s是一个占位符，它仅代表一段字符串，并不是拼接的实际内容。实际的拼接内容在一个单独的%号后面，放在一个元组里。

类似的占位符还有：%d（代表一个整数）、%f（代表一个浮点数）、%x（代表一个16进制数），等等。%占位符既是这种拼接方式的特点，同时也是其限制，因为每种占位符都有特定意义，实际使用起来太麻烦了。
## 2、format()拼接方式
```python
# 简洁版
s1 = 'Hello {}! My name is {}.'.format('World', 'Python猫')
print(s1)
>>>Hello World! My name is Python猫.

# 对号入座版
s2 = 'Hello {0}! My name is {1}.'.format('World', 'Python猫')
s3 = 'Hello {name1}! My name is {name2}.'.format(name1='World', name2='Python猫')
print(s2)
>>>Hello World! My name is Python猫.
print(s3)
>>>Hello World! My name is Python猫.
```
这种方式使用花括号{}做占位符，在format方法中再转入实际的拼接值。容易看出，它实际上是对%号拼接方式的改进。这种方式在Python2.6中开始引入。

上例中，简洁版的花括号中无内容，缺点是容易弄错次序。对号入座版主要有两种，一种传入序列号，一种则使用key-value的方式。实战中，我们更推荐后一种，既不会数错次序，又更直观可读。
## 3、() 类似元组方式
```python
s_tuple = ('Hello', ' ', 'world')
s_like_tuple = ('Hello' ' ' 'world')

print(s_tuple) 
>>>('Hello', ' ', 'world')
print(s_like_tuple) 
>>>Hello world

type(s_like_tuple) >>>str
```
注意，上例中s_like_tuple并不是一个元组，因为元素间没有逗号分隔符，这些元素间可以用空格间隔，也可以不要空格。使用type()查看，发现它就是一个str类型。我没查到这是啥原因，猜测或许()括号中的内容是被Python优化处理了。

这种方式看起来很快捷，但是，括号()内要求元素是真实字符串，不能混用变量，所以不够灵活。
```python
# 多元素时，不支持有变量
str_1 = 'Hello'
str_2 = (str_1 'world')
>>> SyntaxError: invalid syntax
str_3 = (str_1 str_1)
>>> SyntaxError: invalid syntax
# 但是下面写法不会报错
str_4 = (str_1)
```
说实话，我不喜欢这种实现方式。浓浓的一股被面向对象思想毒害的臭味。

就不多说了。
5、常用的+号方式
```python
str_1 = 'Hello world！ ' 
str_2 = 'My name is Python猫.'
print(str_1 + str_2)
>>>Hello world！ My name is Python猫.
print(str_1)
>>>Hello world！ 
```
这种方式最常用、直观、易懂，是入门级的实现方式。但是，它也存在两处让人容易犯错的地方。

首先，新入门编程的同学容易犯错，他们不知道字符串是不可变类型，新的字符串会独占一块新的内存，而原来的字符串保持不变。上例中，拼接前有两段字符串，拼接后实际有三段字符串。

其次，一些有经验的老程序员也容易犯错，他们以为当拼接次数不超过3时，使用+号连接符就会比其它方式快（ps：不少Python教程都是如此建议），但这没有任何合理根据。

事实上，在拼接短的字面值时，由于CPython中的 常数折叠 （constant folding）功能，这些字面值会被转换成更短的形式，例如'a'+'b'+'c' 被转换成'abc'，'hello'+'world'也会被转换成'hello world'。这种转换是在编译期完成的，而到了运行期时就不会再发生任何拼接操作，因此会加快整体计算的速度。

常数折叠优化有一个限度，它要求拼接结果的长度不超过20。所以，当拼接的最终字符串长度不超过20时，+号操作符的方式，会比后面提到的join等方式快得多，这与+号的使用次数无关。
## 6、join()拼接方式
```python
str_list = ['Hello', 'world']
str_join1 = ' '.join(str_list)
str_join2 = '-'.join(str_list)
print(str_join1) >>>Hello world
print(str_join2) >>>Hello-world
```
str对象自带的join()方法，接受一个序列参数，可以实现拼接。拼接时，元素若不是字符串，需要先转换一下。可以看出，这种方法比较适用于连接序列对象中（例如列表）的元素，并设置统一的间隔符。

当拼接长度超过20时，这种方式基本上是首选。不过，它的缺点就是，不适合进行零散片段的、不处于序列集合的元素拼接。
## 7、f-string方式
```python
name = 'world'
myname = 'python_cat'
words = f'Hello {name}. My name is {myname}.'
print(words)
>>> Hello world. My name is python_cat.
```
f-string方式出自PEP 498（Literal String Interpolation，字面字符串插值），从Python3.6版本引入。其特点是在字符串前加 f 标识，字符串中间则用花括号{}包裹其它字符串变量。

这种方式在可读性上秒杀format()方式，处理长字符串的拼接时，速度与join()方法相当。

尽管如此，这种方式与其它某些编程语言相比，还是欠优雅，因为它引入了一个 f 标识。而其它某些程序语言可以更简练，比如shell：
```shell
name="world"
myname="python_cat"
words="Hello ${name}. My name is ${myname}."
echo $words
>>>Hello world. My name is python_cat.
```
总结一下，我们前面说的“字符串拼接”，其实是从结果上理解。若从实现原理上划分的话，我们可以将这些方法划分出三种类型：
格式化类：%、format()、template
拼接类：+、()、join()
插值类：f-string
当要处理字符串列表等序列结构时，采用join()方式；拼接长度不超过20时，选用+号操作符方式；长度超过20的情况，高版本选用f-string，低版本时看情况使用format()或join()方式。
