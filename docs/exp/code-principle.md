# 编码原则

## 吻（保持最简单愚蠢）
如果保持简单而不是复杂，大多数系统都能发挥最佳性能。

为什么：
* 更少的代码花费更少的时间来编写，具有更少的错误，并且更容易修改。
* 简约是最终的成熟。
* 似乎没有任何东西可以添加，但是当没有什么可以带走时，达到完美。

资源：

* [Kiss原则](https://en.wikipedia.org/wiki/KISS_principle)

* [保持简单愚蠢（KISS）](http://principles-wiki.net/principles:keep_it_simple_stupid)

## YAGNI(你不需要它)

YAGNI代表“你不会需要它”：在必要之前不要实施某些东西。

为什么：

* 任何仅用于明天需要的功能的工作意味着从当前迭代需要完成的功能中失去工作量。
* 它导致代码膨胀; 软件变得更大，更复杂。

怎么样：

* 当你真正需要它们时，总是要实现它们，而不是在你预见到需要它们的时候。

资源：

*[你不会需要它](http://c2.com/xp/YouArentGonnaNeedIt.html)
*[你不需要它！](http://www.xprogramming.com/Practices/PracNotNeed.html)
*[你不需要它](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)

## 做最简单的事可能有效

为什么:

* 如果我们只是解决问题的真正原因，那么真正问题的真正进展就会最大化。

怎么样:

* 问问自己：“最简单的事情是什么？”

资源:

* [做最简单的事可能有效](http://c2.com/xp/DoTheSimplestThingThatCouldPossiblyWork.html)

## 关注点分离

关注点分离是将计算机程序分成不同部分的设计原则，这样每个部分都解决了一个单独的问题。例如，应用程序的业务逻辑是一个问题，用户界面是另一个问题。更改用户界面不应要求更改业务逻辑，反之亦然。

引用[Edsger W. Dijkstra](https://en.wikipedia.org/wiki/Edsger_W._Dijkstra)（1974）：
```
这就是我有时称之为“关注点的分离”，即使不完全可能，它仍然是我所知道的有效排序一个人思想的唯一可行技术。这就是我所说的“将注意力集中在某些方面”：它并不意味着忽视其他方面，它只是公正地从这个方面来看，另一个是无关紧要的事实。
```
为什么:

* 简化软件应用程序的开发和维护。
* 当问题分离时，各个部分可以重复使用，也可以独立开发和更新。

怎么样:

* 将程序功能分解为尽可能少重叠的单独模块。

资源:

* [关注点分离](https://en.wikipedia.org/wiki/Separation_of_concerns)

## 保持干燥

每一条知识都必须在系统中具有单一，明确，权威的表示。

程序中的每个重要功能都应该在源代码中的一个位置实现。在通过不同的代码片段执行类似的功能的情况下，通过抽象出变化的部分将它们组合成一个通常是有益的。

为什么:

* 重复（无意或有目的的重复）可能导致维护噩梦，差的因素和逻辑矛盾。
* 对系统的任何单个元素的修改不需要改变其他逻辑上不相关的元素。
* 另外，逻辑上相关的元素都可以预测和统一地改变，因此保持同步。

怎么样:

* 只在一个地方放置业务规则，长表达式，if语句，数学公式，元数据等。
* 确定系统中使用的每一条知识的单一，权威来源，然后使用该源生成该知识的适用实例（代码，文档，测试等）。
* 适用[三条规则](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming))。

资源:

* [别重复自己](http://wiki.c2.com/?DontRepeatYourself)
* [不要重复自己](https://en.wikipedia.org/wiki/Don't_repeat_yourself)

有关:

* [抽象原则](https://en.wikipedia.org/wiki/Abstraction_principle_(computer_programming))
* [Once And Only Once](http://wiki.c2.com/?OnceAndOnlyOnce)是DRY的一个子集（也称为重构的目标）。
* [单一事实来源](https://en.wikipedia.org/wiki/Single_source_of_truth)
违反DRY是[WET](http://thedailywtf.com/articles/The-WET-Cart)（写一切两次）

## 维护者代码

为什么：

* 到目前为止，维护是任何项目中最昂贵的阶段。

怎么样：

* 做维护者。
* 总是编码好像最终维护你的代码的人是一个知道你住在哪里的暴力精神病患者。
* 始终以这样一种方式编码和评论：如果有人在少数几个级别上接受代码，他们会乐于阅读并从中学习。
* [不要让我思考](http://www.sensible.com/dmmt.html)。
* 使用[最小惊讶原则](http://en.wikipedia.org/wiki/Principle_of_least_astonishment)。

资源:

* [维护者代码](http://wiki.c2.com/?CodeForTheMaintainer)
* [高尚的维护编程艺术](https://blog.codinghorror.com/the-noble-art-of-maintenance-programming/)

## 避免过早优化

引用[唐纳德克努特](https://en.wikiquote.org/wiki/Donald_Knuth)：
```
程序员浪费了大量时间来思考或担心程序中非关键部分的速度，而这些效率尝试实际上在考虑调试和维护时会产生很大的负面影响。我们应该忘记小的效率，大约97％的时间说：过早的优化是所有邪恶的根源。然而，我们不应该放弃那个至关重要的3％的机会。
```

理解什么是“不成熟”并不是“过早”是至关重要的。

为什么:

* 事先不知道瓶颈在哪里。
* 优化后，可能更难以阅读并因此维护。

怎么样:

* [让它工作正确使它快速](http://wiki.c2.com/?MakeItWorkMakeItRightMakeItFast)
* 在您需要之前不要进行优化，并且只有在进行性能分析后才发现瓶颈才能优化。

资源:

* [程序优化](https://en.wikipedia.org/wiki/Program_optimization)
* [过早优化](http://wiki.c2.com/?PrematureOptimization)

## 最小化耦合

模块/组件之间的耦合是它们相互依赖的程度; 较低的耦合更好。换句话说，耦合是代码单元“A”在对代码单元“A”的未知改变之后将“破坏”的概率。

为什么:

* 一个模块的变化通常会对其他模块的变化产生连锁反应。
* 由于模块间依赖性的增加，模块的组装可能需要更多的努力和/或时间。
* 特定模块可能更难以重用和/或测试，因为必须包含依赖模块。
* 开发人员可能害怕更改代码，因为他们不确定可能会受到什么影响。

怎么样:

* 消除，最小化并减少必要关系的复杂性。
* 通过隐藏实现细节，减少了耦合。
* 应用得墨忒耳定律。

资源:

* [耦合](https://en.wikipedia.org/wiki/Coupling_(computer_programming))
* [耦合与凝聚力](http://wiki.c2.com/?CouplingAndCohesion)

## 得墨忒耳定律

不要和陌生人说话。

为什么:

* 它通常会收紧耦合
* 它可能会揭示太多的实现细节

怎么样:

对象的方法只能调用以下方法：

* 对象本身。
* 方法的一个论点。
* 在方法中创建的任何对象。
* 对象的任何直接属性/字段。

资源:

* [得墨忒耳定律](https://en.wikipedia.org/wiki/Law_of_Demeter)
* [得墨忒耳定律不是一个点数运动](https://haacked.com/archive/2009/07/14/law-of-demeter-dot-counting.aspx/)

## 继承的组合

为什么:

* 类之间的耦合较少。
* 使用继承，子类很容易做出假设，并破坏LSP。

怎么样:

* 测试LSP（可替代性）以决定何时继承。
* 当存在“具有”（或“使用”）关系时，在“是”时继承。

资源:

* [赞成组合而不是继承](https://blogs.msdn.microsoft.com/thalesc/2012/09/05/favor-composition-over-inheritance/)

## 正交

正交性的基本思想是，在概念上不相关的事物不应该与系统相关。

来源：[Be Orthogonal](https://www.artima.com/intv/dry3.html)

它与简单相关; 设计越正交，异常越少。这使得用编程语言更容易学习，读写程序。正交特征的含义与上下文无关; 关键参数是对称性和一致性。

资料来源：[正交性](https://en.wikipedia.org/wiki/Orthogonality_(programming))

## 稳健性原则

保守你的所作所为，要接受别人的自由

协作服务取决于彼此的接口。通常接口需要进化，导致另一端接收未指定的数据。如果收到的数据不严格遵循规范，那么天真的实现就会拒绝协作。更复杂的实现仍然会忽略它无法识别的数据。

为什么:

* 为了能够发展服务，您需要确保提供商可以进行更改以支持新需求，同时最大限度地减少对现有客户的破坏。

怎么样:

* 将命令或数据发送到其他机器（或同一台机器上的其他程序）的代码应完全符合规范，但只要含义明确，接收输入的代码就应接受不符合要求的输入。

资源:

* [维基百科中的稳健性原则](https://en.wikipedia.org/wiki/Robustness_principle)
* [宽容读者](https://martinfowler.com/bliki/TolerantReader.html)

## 控制反转

控制倒置也被称为好莱坞原则，“不要打电话给我们，我们会打电话给你”。这是一种设计原则，其中计算机程序的定制编写部分从通用框架接收控制流。控制反转具有强烈的含义，即可重用代码和特定于问题的代码即使在应用程序中一起操作也是独立开发的。

为什么:

* 控制反转用于增加程序的模块性并使其可扩展。
* 将任务的执行与实现分离。
* 将模块集中在它所针对的任务上。
* 使模块免于假设其他系统如何做他们所做的事情，而是依赖合同。
* 更换模块时防止副作用。

怎么样:

* 使用工厂模式
* 使用服务定位器模式
* 使用依赖注入
* 使用上下文查找
* 使用模板方法模式
* 使用策略模式

资源:

* [维基百科中的控制反转](https://en.wikipedia.org/wiki/Inversion_of_control)
* [控制容器的反转和依赖注入模式](https://www.martinfowler.com/articles/injection.html)

## 最大化凝聚力

单个模块/组件的凝聚力是其职责构成有意义单元的程度; 更高的凝聚力更好。

为什么:

* 理解模块的难度增加。
* 维护系统的难度增加，因为域中的逻辑更改会影响多个模块，并且因为一个模块中的更改需要更改相关模块。
* 由于大多数应用程序不需要模块提供的随机操作集，因此增加了重用模块的难度。

怎么样:

* 集团相关的功能共享一个单一的职责（例如在一个班级）。

资源:

* [凝聚](https://en.wikipedia.org/wiki/Cohesion_(computer_science))
* [耦合与凝聚力](http://wiki.c2.com/?CouplingAndCohesion)

## 利斯科夫替代原则(里氏替换原则)

LSP完全是关于对象的预期行为：

程序中的对象应该可以替换其子类型的实例，而不会改变该程序的正确性。

资源：

* [利斯科夫替代原则](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
* [利斯科夫替代原则](http://www.blackwasp.co.uk/lsp.aspx)

## 开放/封闭原则

软件实体（例如类）应该是可以扩展的，但是关闭以进行修改。即，这样的实体可以允许在不改变其源代码的情况下修改其行为。

为什么:

* 通过最小化对现有代码的更改来提高可维护性和稳定性

怎么样:

* 编写可以扩展的类（与可以修改的类相对）。
* 仅暴露需要更改的移动部件，隐藏其他所有内容。

资源:

* [开放封闭原则](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
* [开放封闭原则](https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html)

## 单一责任原则

一个班级永远不应该有多个改变的理由。

长版本：每个班级都应该承担一个责任，并且该责任应该由班级完全封装。责任可以被定义为改变的理由，因此一个类或模块应该只有一个改变的理由。

为什么:

* 可维护性：仅在一个模块或类中需要进行更改。

怎么样

* 应用[Curly定律](https://blog.codinghorror.com/curlys-law-do-one-thing/)。

资源:

* [单一责任原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)

## 隐藏实施细节

软件模块通过提供接口隐藏信息（即实现细节），而不泄漏任何不必要的信息。

为什么:

* 当实现更改时，使用的接口客户端不必更改。

怎么样:

* 最小化类和成员的可访问性。
* 不要公开公开成员数据。
* 避免将私有实现细节放入类的接口中。
* 减少耦合以隐藏更多实现细节。

资源:

* [信息隐藏](https://en.wikipedia.org/wiki/Information_hiding)

## 卷毛定律

Curly定律是为任何特定的代码选择一个明确定义的目标：做一件事。

* [卷毛定律：做一件事](https://blog.codinghorror.com/curlys-law-do-one-thing/)
* 一个规则或卷曲定律

## 封装了哪些变化

一个好的设计可以识别最有可能改变的热点，并将它们封装在API之后。当发生预期的变化时，修改保持在本地。

为什么:

* 在发生更改时最小化所需的修改

怎么样:

* 封装API背后不同的概念
* 可能将不同的概念分成它自己的模块

资源:

* [封装变化的概念](http://principles-wiki.net/principles:encapsulate_the_concept_that_varies)
* [封装什么变化](https://blogs.msdn.microsoft.com/steverowe/2007/12/26/encapsulate-what-varies/)
* [信息隐藏](https://en.wikipedia.org/wiki/Information_hiding)

## 接口隔离原理

将胖接口减少为多个更小，更具体的客户端特定接口。接口应该更多地依赖于调用它的代码而不是实现它的代码。

为什么:

* 如果一个类实现了不需要的方法，则调用者需要知道该类的方法实现。例如，如果一个类实现一个方法但只是抛出，那么调用者将需要知道实际上不应该调用此方法。

怎么样:

* 避免胖接口。类不应该实现违反[单一责任原则的方法。](https://en.wikipedia.org/wiki/Single_responsibility_principle)

资源:

* [界面隔离原理](https://en.wikipedia.org/wiki/Interface_segregation_principle)

## 童子军规则

美国童子军有一个简单的规则，我们可以适用于我们的职业：“让露营地更清洁，而不是你发现它”。童子军规则规定我们应该始终保持代码比我们发现的更干净。

为什么:

* 在对现有代码库进行更改时，代码质量往往会降低，从而累积技术债务。按照boyscout规则，我们应该注意每次提交的质量。无论多么小，技术债务都会受到持续重构的抵制。

怎么样:

* 每次提交都要确保它不会降低代码库质量。
* 每当有人看到一些不太清晰的代码时，他们应该抓住机会在那里修复它。

资源:

* [机会重构](https://martinfowler.com/bliki/OpportunisticRefactoring.html)

## 命令查询分离

命令查询分离原则指出每个方法应该是执行操作的命令或将数据返回给调用者而不是两者都返回的查询。提出问题不应该修改答案。

应用此原则后，程序员可以更自信地编写代码。查询方法可以在任何地方以任何顺序使用，因为它们不会改变状态。使用命令必须更加小心。

为什么:

* 通过将方法明确地分离为查询和命令，程序员可以在不知道每个方法的实现细节的情况下进行编码。

怎么样:

* 将每个方法实现为查询或命令
* 将命名约定应用于方法名称，该方法名称暗示该方法是查询还是命令

资源:

* [维基百科中的命令查询分离](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation)
* [Martin Fowler命令查询分离](https://martinfowler.com/bliki/CommandQuerySeparation.html)