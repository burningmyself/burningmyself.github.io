# Python 语法技巧

Python 开发中有哪些高级技巧？这是知乎上一个问题，我总结了一些常见的技巧在这里，可能谈不上多高级，但掌握这些至少可以让你的代码看起来 Pythonic 一点。如果你还在按照类C语言的那套风格来写的话，在 code review 恐怕会要被吐槽了。

## 列表推导式
```python
>>> chars = [ c for c in 'python' ]
>>> chars
['p', 'y', 't', 'h', 'o', 'n']
```
## 字典推导式
```python
>>> dict1 = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}
>>> double_dict1 = {k:v*2 for (k,v) in dict1.items()}
>>> double_dict1
{'a': 2, 'b': 4, 'c': 6, 'd': 8, 'e': 10}
```
## 集合推导式
```python
>>> set1 = {1,2,3,4}
>>> double_set = {i*2 for i in set1}
>>> double_set
{8, 2, 4, 6}
```
## 合并字典
```python
>>> x = {'a':1,'b':2}
>>> y = {'c':3, 'd':4}
>>> z = {**x, **y}
>>> z
{'a': 1, 'b': 2, 'c': 3, 'd': 4}
```
## 复制列表
```python
>>> nums = [1,2,3]
>>> nums[::]
[1, 2, 3]
>>> copy_nums = nums[::]
>>> copy_nums
[1, 2, 3]
```
## 反转列表
```python
>>> reverse_nums = nums[::-1]
>>> reverse_nums
[3, 2, 1]
```
 PACKING / UNPACKING
## 变量交换
```python
>>> a,b = 1, 2
>>> a ,b = b,a
>>> a
2
>>> b
1
```
## 高级拆包
```python
>>> a, *b = 1,2,3
>>> a
1
>>> b
[2, 3]
```
或者
```python
>>> a, *b, c = 1,2,3,4,5
>>> a
1
>>> b
[2, 3, 4]
>>> c
5
```
## 函数返回多个值（其实是自动packing成元组）然后unpacking赋值给4个变量
```python
>>> def f():
...     return 1, 2, 3, 4
...
>>> a, b, c, d = f()
>>> a
1
>>> d
4
```
## 列表合并成字符串
```python
>>> " ".join(["I", "Love", "Python"])
'I Love Python'
```
## 链式比较
```python
>>> if a > 2 and a < 5:
...     pass
...
>>> if 2<a<5:
...     pass
```
## yield from
```python
# 没有使用 field from
def dup(n):
    for i in range(n):
        yield i
        yield i

# 使用yield from
def dup(n):
    for i in range(n):
    yield from [i, i]

for i in dup(3):
    print(i)

>>>
0
0
1
1
2
2
```
## in 代替 or
```python
>>> if x == 1 or x == 2 or x == 3:
...     pass
...
>>> if x in (1,2,3):
...     pass
```
## 字典代替多个if else
```python
def fun(x):
    if x == 'a':
        return 1
    elif x == 'b':
        return 2
    else:
        return None

def fun(x):
    return {"a": 1, "b": 2}.get(x)
```
## 有下标索引的枚举
```python
>>> for i, e in enumerate(["a","b","c"]):
...     print(i, e)
...
0 a
1 b
2 c
```
## 生成器
注意区分列表推导式，生成器效率更高
```python
>>> g = (i**2 for i in range(5))
>>> g
<generator object <genexpr> at 0x10881e518>
>>> for i in g:
...     print(i)
...
0
1
4
9
16
```
## 默认字典 defaultdict
```python
>>> d = dict()
>>> d['nums']
KeyError: 'nums'
>>>

>>> from collections import defaultdict
>>> d = defaultdict(list)
>>> d["nums"]
[]
```
## 字符串格式化
```python
>>> lang = 'python'
>>> f'{lang} is most popular language in the world'
'python is most popular language in the world'
```
## 列表中出现次数最多的元素
```python
>>> nums = [1,2,3,3]
>>> max(set(nums), key=nums.count)
3

或者
from collections import Counter
>>> Counter(nums).most_common()[0][0]
3
```
## 读写文件
```python
>>> with open("test.txt", "w") as f:
...     f.writelines("hello")
```
## 判断对象类型，可指定多个类型
```python
>>> isinstance(a, (int, str))
True
```
## 类似的还有字符串的 startswith，endswith
```python
>>> "http://foofish.net".startswith(('http','https'))
True
>>> "https://foofish.net".startswith(('http','https'))
True
```
## __str__ 与 __repr__ 区别
```python
>>> str(datetime.now())
'2018-11-20 00:31:54.839605'
>>> repr(datetime.now())
'datetime.datetime(2018, 11, 20, 0, 32, 0, 579521)'
```
前者对人友好，可读性更强，后者对计算机友好，支持 obj == eval(repr(obj))
## 使用装饰器
```python
def makebold(f):
return lambda: "<b>" + f() + "</b>"

def makeitalic(f):
return lambda: "<i>" + f() + "</i>"

@makebold
@makeitalic
def say():
return "Hello"

>>> say()
<b><i>Hello</i></b>
```
## 不使用装饰器，可读性非常差
```python
def say():
return "Hello"
>>> makebold(makeitalic(say))()
<b><i>Hello</i></b>
```