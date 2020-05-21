# Java 代码精简

## 利用语法

### 利用三元表达式

普通

``` java
String title;
if (isMember(phone)) {
    title = "会员";
} else {
    title = "游客";
}
```
精简

``` java
String title = isMember(phone) ? "会员" : "游客";
```
>注意：对于包装类型的算术计算，需要注意避免拆包时的空指针问题。

### 利用 for-each 语句
>从 Java 5 起，提供了 for-each 循环，简化了数组和集合的循环遍历。for-each  循环允许你无需保持传统 for 循环中的索引就可以遍历数组，或在使用迭代器时无需在 while 循环中调用 hasNext 方法和 next 方法就可以遍历集合。

普通

``` java

double[] values = ...;
for(int i = 0; i < values.length; i++) {
    double value = values[i];
    // TODO: 处理value
}

List<Double> valueList = ...;
Iterator<Double> iterator = valueList.iterator();
while (iterator.hasNext()) {
    Double value = iterator.next();
    // TODO: 处理value
}
```

精简

``` java

double[] values = ...;
for(double value : values) {
    // TODO: 处理value
}

List<Double> valueList = ...;
for(Double value : valueList) {
    // TODO: 处理value
}

```
### 利用 try-with-resource 语句
>所有实现 Closeable 接口的“资源”，均可采用 try-with-resource 进行简化。

普通

``` java
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("cities.csv"));
    String line;
    while ((line = reader.readLine()) != null) {
        // TODO: 处理line
    }
} catch (IOException e) {
    log.error("读取文件异常", e);
} finally {
    if (reader != null) {
        try {
            reader.close();
        } catch (IOException e) {
            log.error("关闭文件异常", e);
        }
    }
}
```

精简

``` java
try (BufferedReader reader = new BufferedReader(new FileReader("test.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        // TODO: 处理line
    }
} catch (IOException e) {
    log.error("读取文件异常", e);
}
```
### 利用 return 关键字
>利用 return 关键字，可以提前函数返回，避免定义中间变量。

普通

``` java

public static boolean hasSuper(@NonNull List<UserDO> userList) {
    boolean hasSuper = false;
    for (UserDO user : userList) {
        if (Boolean.TRUE.equals(user.getIsSuper())) {
            hasSuper = true;
            break;
        }
    }
    return hasSuper;
}
```

精简

``` java
public static boolean hasSuper(@NonNull List<UserDO> userList) {
    for (UserDO user : userList) {
        if (Boolean.TRUE.equals(user.getIsSuper())) {
            return true;
        }
    }
    return false;
}
```
### 利用 static 关键字
>利用 static 关键字，可以把字段变成静态字段，也可以把函数变为静态函数，调用时就无需初始化类对象。

普通

``` java

public final class GisHelper {
    public double distance(double lng1, double lat1, double lng2, double lat2) {
        // 方法实现代码
    }
}


GisHelper gisHelper = new GisHelper();
double distance = gisHelper.distance(116.178692D, 39.967115D, 116.410778D, 39.899721D);

```

精简

``` java

public final class GisHelper {
    public static double distance(double lng1, double lat1, double lng2, double lat2) {
        // 方法实现代码
    }
}

double distance = GisHelper.distance(116.178692D, 39.967115D, 116.410778D, 39.899721D);

```
### 利用 lambda 表达式
>Java 8 发布以后，lambda 表达式大量替代匿名内部类的使用，在简化了代码的同时，更突出了原有匿名内部类中真正有用的那部分代码。

普通

``` java

new Thread(new Runnable() {
    public void run() {
        // 线程处理代码
    }
}).start();
```

精简

``` java
new Thread(() -> {
    // 线程处理代码
}).start();
```
### 利用方法引用
>方法引用（::），可以简化 lambda 表达式，省略变量声明和函数调用。

普通

``` java
Arrays.sort(nameArray, (a, b) -> a.compareToIgnoreCase(b));
List<Long> userIdList = userList.stream()
    .map(user -> user.getId())
    .collect(Collectors.toList());
```

精简

``` java

Arrays.sort(nameArray, String::compareToIgnoreCase);
List<Long> userIdList = userList.stream()
    .map(UserDO::getId)
    .collect(Collectors.toList());
```
### 利用静态导入
> 静态导入（import static），当程序中大量使用同一静态常量和函数时，可以简化静态常量和函数的引用。

普通

``` java

List<Double> areaList = radiusList.stream().map(r -> Math.PI * Math.pow(r, 2)).collect(Collectors.toList());

```

精简

``` java

import static java.lang.Math.PI;
import static java.lang.Math.pow;
import static java.util.stream.Collectors.toList;

List<Double> areaList = radiusList.stream().map(r -> PI * pow(r, 2)).collect(toList());

```
* 注意：静态引入容易造成代码阅读困难，所以在实际项目中应该警慎使用。

### 利用 unchecked 异常
>Java 的异常分为两类：Checked 异常和 Unchecked 异常。Unchecked 异常继承了RuntimeException ，特点是代码不需要处理它们也能通过编译，所以它们称作  Unchecked 异常。利用 Unchecked 异常，可以避免不必要的 try-catch 和 throws 异常处理。

普通

``` java

@Service
public class UserService {
    public void createUser(UserCreateVO create, OpUserVO user) throws BusinessException {
        checkOperatorUser(user);
        ...
    }
    private void checkOperatorUser(OpUserVO user) throws BusinessException {
        if (!hasPermission(user)) {
            throw new BusinessException("用户无操作权限");
        }
        ...
    }
    ...
}

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/createUser")
    public Result<Void> createUser(@RequestBody @Valid UserCreateVO create, OpUserVO user) throws BusinessException {
        userService.createUser(create, user);
        return Result.success();
    }
    ...
}
```

精简

``` java
@Service
public class UserService {
    public void createUser(UserCreateVO create, OpUserVO user) {
        checkOperatorUser(user);
        ...
    }
    private void checkOperatorUser(OpUserVO user) {
        if (!hasPermission(user)) {
            throw new BusinessRuntimeException("用户无操作权限");
        }
        ...
    }
    ...
}

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/createUser")
    public Result<Void> createUser(@RequestBody @Valid UserCreateVO create, OpUserVO user) {
        userService.createUser(create, user);
        return Result.success();
    }
    ...
}
```
## 利用注解
### 利用 Lombok 注解
>Lombok 提供了一组有用的注解，可以用来消除Java类中的大量样板代码。

普通

``` java
public class UserVO {
    private Long id;
    private String name;
    public Long getId() {
        return this.id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }
    ...
}
```

精简

``` java

@Getter
@Setter
@ToString
public class UserVO {
    private Long id;
    private String name;
    ...
}
```
### 利用 Validation 注解

普通

``` java
@Data
public class UserCreateVO {    
  private String name;    
  private Long companyId;
}

@Service
public class UserService {    
  public Long createUser(UserCreateVO create) {        
    // TODO: 创建用户 
    if(create.getName()==null){
      ...
    }  

    if(create.getCompanyId()==null){
      ...
    } 

    return null;    
  }
}
```

精简

``` java
@Getter
@Setter
@ToString
public class UserCreateVO {
    @NotBlank(message = "用户名称不能为空")
    private String name;
    @NotNull(message = "公司标识不能为空")
    private Long companyId;
    ...
}

@Service
@Validated
public class UserService {
    public Long createUser(@Valid UserCreateVO create) {
        // TODO: 创建用户
        return null;
    }
}

```
### 利用 @NonNull 注解
>Spring 的 @NonNull 注解，用于标注参数或返回值非空，适用于项目内部团队协作。只要实现方和调用方遵循规范，可以避免不必要的空值判断，这充分体现了阿里的“新六脉神剑”提倡的“因为信任，所以简单”。

普通

``` java
public List<UserVO> queryCompanyUser(Long companyId) {
    // 检查公司标识
    if (companyId == null) {
        return null;
    }

    // 查询返回用户
    List<UserDO> userList = userDAO.queryByCompanyId(companyId);
    return userList.stream().map(this::transUser).collect(Collectors.toList());
}

Long companyId = 1L;
List<UserVO> userList = queryCompanyUser(companyId);
if (CollectionUtils.isNotEmpty(userList)) {
    for (UserVO user : userList) {
        // TODO: 处理公司用户
    }
}
```

精简

``` java

public @NonNull List<UserVO> queryCompanyUser(@NonNull Long companyId) {
    List<UserDO> userList = userDAO.queryByCompanyId(companyId);
    return userList.stream().map(this::transUser).collect(Collectors.toList());
}

Long companyId = 1L;
List<UserVO> userList = queryCompanyUser(companyId);
for (UserVO user : userList) {
    // TODO: 处理公司用户
}
```
### 利用注解特性

注解有以下特性可用于精简注解声明：
1、当注解属性值跟默认值一致时，可以删除该属性赋值；
2、当注解只有value属性时，可以去掉value进行简写；
3、当注解属性组合等于另一个特定注解时，直接采用该特定注解。

普通

``` java
@Lazy(true);
@Service(value = "userService")
@RequestMapping(path = "/getUser", method = RequestMethod.GET)
```

精简

``` java

@Lazy
@Service("userService")
@GetMapping("/getUser")
```
## 利用泛型
### 泛型接口
>在 Java 没有引入泛型前，都是采用 Object 表示通用对象，最大的问题就是类型无法强校验并且需要强制类型转换。

普通

``` java

public interface Comparable {
    public int compareTo(Object other);
}

@Getter
@Setter
@ToString
public class UserVO implements Comparable {
    private Long id;

    @Override
    public int compareTo(Object other) {
        UserVO user = (UserVO)other;
        return Long.compare(this.id, user.id);
    }
}
```

精简

``` java
public interface Comparable<T> {
    public int compareTo(T other);
}

@Getter
@Setter
@ToString
public class UserVO implements Comparable<UserVO> {
    private Long id;

    @Override
    public int compareTo(UserVO other) {
        return Long.compare(this.id, other.id);
    }
}
```
### 泛型类

普通

``` java

@Getter
@Setter
@ToString
public class IntPoint {
    private Integer x;
    private Integer y;
}

@Getter
@Setter
@ToString
public class DoublePoint {
    private Double x;
    private Double y;
}
```

精简

``` java

@Getter
@Setter
@ToString
public class Point<T extends Number> {
    private T x;
    private T y;
}
```
### 泛型方法

普通

``` java

public static Map<String, Integer> newHashMap(String[] keys, Integer[] values) {
    // 检查参数非空
    if (ArrayUtils.isEmpty(keys) || ArrayUtils.isEmpty(values)) {
        return Collections.emptyMap();
    }

    // 转化哈希映射
    Map<String, Integer> map = new HashMap<>();
    int length = Math.min(keys.length, values.length);
    for (int i = 0; i < length; i++) {
        map.put(keys[i], values[i]);
    }
    return map;
}

```

精简

``` java

public static <K, V> Map<K, V> newHashMap(K[] keys, V[] values) {
    // 检查参数非空
    if (ArrayUtils.isEmpty(keys) || ArrayUtils.isEmpty(values)) {
        return Collections.emptyMap();
    }

    // 转化哈希映射
    Map<K, V> map = new HashMap<>();
    int length = Math.min(keys.length, values.length);
    for (int i = 0; i < length; i++) {
        map.put(keys[i], values[i]);
    }
    return map;
}
```
## 利用自身方法
### 利用构造方法
>构造方法，可以简化对象的初始化和设置属性操作。对于属性字段较少的类，可以自定义构造方法。

普通

``` java
@Getter
@Setter
@ToString
public class PageDataVO<T> {
    private Long totalCount;
    private List<T> dataList;
}

PageDataVO<UserVO> pageData = new PageDataVO<>();
pageData.setTotalCount(totalCount);
pageData.setDataList(userList);
return pageData;
```

精简

``` java
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PageDataVO<T> {
    private Long totalCount;
    private List<T> dataList;
}

return new PageDataVO<>(totalCount, userList);
```
* 注意：如果属性字段被替换时，存在构造函数初始化赋值问题。比如把属性字段title替换为 nickname ，由于构造函数的参数个数和类型不变，原有构造函数初始化语句不会报错，导致把原title值赋值给 nickname 。如果采用 Setter 方法赋值，编译器会提示错误并要求修复。

### 利用 Set 的 add 方法
>利用 Set 的 add 方法的返回值，可以直接知道该值是否已经存在，可以避免调用 contains 方法判断存在。

普通

以下案例是进行用户去重转化操作，需要先调用 contains 方法判断存在，后调用add方法进行添加。

``` java

Set<Long> userIdSet = new HashSet<>();
List<UserVO> userVOList = new ArrayList<>();
for (UserDO userDO : userDOList) {
    if (!userIdSet.contains(userDO.getId())) {
        userIdSet.add(userDO.getId());
        userVOList.add(transUser(userDO));
    }
}
```

精简

``` java

SSet<Long> userIdSet = new HashSet<>();
List<UserVO> userVOList = new ArrayList<>();
for (UserDO userDO : userDOList) {
    if (userIdSet.add(userDO.getId())) {
        userVOList.add(transUser(userDO));
    }
}
```
### 利用 Map 的 computeIfAbsent 方法
>利用 Map 的 computeIfAbsent 方法，可以保证获取到的对象非空，从而避免了不必要的空判断和重新设置值。

普通

``` java
Map<Long, List<UserDO>> roleUserMap = new HashMap<>();
for (UserDO userDO : userDOList) {
    Long roleId = userDO.getRoleId();
    List<UserDO> userList = roleUserMap.get(roleId);
    if (Objects.isNull(userList)) {
        userList = new ArrayList<>();
        roleUserMap.put(roleId, userList);
    }
    userList.add(userDO);
}
```

精简

``` java
Map<Long, List<UserDO>> roleUserMap = new HashMap<>();
for (UserDO userDO : userDOList) {
    roleUserMap.computeIfAbsent(userDO.getRoleId(), key -> new ArrayList<>())
        .add(userDO);
}
```
### 利用链式编程
>链式编程，也叫级联式编程，调用对象的函数时返回一个this对象指向对象本身，达到链式效果，可以级联调用。链式编程的优点是：编程性强、可读性强、代码简洁。

普通

``` java
StringBuilder builder = new StringBuilder(96);
builder.append("select id, name from ");
builder.append(T_USER);
builder.append(" where id = ");
builder.append(userId);
builder.append(";");
```

精简

``` java
StringBuilder builder = new StringBuilder(96);
builder.append("select id, name from ")
    .append(T_USER)
    .append(" where id = ")
    .append(userId)
    .append(";");
```
## 利用工具方法

### 避免空值判断

普通

``` java
if (userList != null && !userList.isEmpty()) {
    // TODO: 处理代码
}

```

精简

``` java
if (CollectionUtils.isNotEmpty(userList)) {
    // TODO: 处理代码
}
```
### 避免条件判断

普通

``` java
double result;
if (value <= MIN_LIMIT) {
    result = MIN_LIMIT;
} else {
    result = value;
}
```

精简

``` java
double result = Math.max(MIN_LIMIT, value);
```

### 简化赋值语句

普通

``` java

public static final List<String> ANIMAL_LIST;
static {
    List<String> animalList = new ArrayList<>();
    animalList.add("dog");
    animalList.add("cat");
    animalList.add("tiger");
    ANIMAL_LIST = Collections.unmodifiableList(animalList);
}
```

精简

``` java

// JDK流派
public static final List<String> ANIMAL_LIST = Arrays.asList("dog", "cat", "tiger");
// Guava流派
public static final List<String> ANIMAL_LIST = ImmutableList.of("dog", "cat", "tiger");
```
* 注意：Arrays.asList 返回的 List 并不是 ArrayList ，不支持 add 等变更操作。

### 简化数据拷贝

普通

``` java
UserVO userVO = new UserVO();
userVO.setId(userDO.getId());
userVO.setName(userDO.getName());
...
userVO.setDescription(userDO.getDescription());
userVOList.add(userVO);
```

精简

``` java

UserVO userVO = new UserVO();
BeanUtils.copyProperties(userDO, userVO);
userVOList.add(userVO);

```

反例

``` java
List<UserVO> userVOList = JSON.parseArray(JSON.toJSONString(userDOList), UserVO.class);
```
* 精简代码，但不能以过大的性能损失为代价。例子是浅层拷贝，用不着 JSON 这样重量级的武器。

### 简化异常断言

普通

``` java
if (Objects.isNull(userId)) {
    throw new IllegalArgumentException("用户标识不能为空");
}

```

精简

``` java
Assert.notNull(userId, "用户标识不能为空");
```

* 注意：可能有些插件不认同这种判断，导致使用该对象时会有空指针警告。

### 简化测试用例
>把测试用例数据以 JSON 格式存入文件中，通过 JSON 的 parseObject 和 parseArray 方法解析成对象。虽然执行效率上有所下降，但可以减少大量的赋值语句，从而精简了测试代码。


普通

``` java
@Test
public void testCreateUser() {
    UserCreateVO userCreate = new UserCreateVO();
    userCreate.setName("Changyi");
    userCreate.setTitle("Developer");
    userCreate.setCompany("AMAP");
    ...
    Long userId  = userService.createUser(OPERATOR, userCreate);
    Assert.assertNotNull(userId, "创建用户失败");
}
```

精简

``` java

@Test
public void testCreateUser() {
    String jsonText = ResourceHelper.getResourceAsString(getClass(), "createUser.json");
    UserCreateVO userCreate = JSON.parseObject(jsonText, UserCreateVO.class);
    Long userId  = userService.createUser(OPERATOR, userCreate);
    Assert.assertNotNull(userId, "创建用户失败");
}
```
* 建议：JSON 文件名最好以被测试的方法命名，如果有多个版本可以用数字后缀表示。

### 简化算法实现
>一些常规算法，已有现成的工具方法，我们就没有必要自己实现了。

普通

``` java

int totalSize = valueList.size();
List<List<Integer>> partitionList = new ArrayList<>();
for (int i = 0; i < totalSize; i += PARTITION_SIZE) {
    partitionList.add(valueList.subList(i, Math.min(i + PARTITION_SIZE, totalSize)));
}
```

精简

``` java

List<List<Integer>> partitionList = ListUtils.partition(valueList, PARTITION_SIZE);
```

### 封装工具方法
>一些特殊算法，没有现成的工具方法，我们就只好自己亲自实现了。


普通

比如，SQL 设置参数值的方法就比较难用，setLong 方法不能设置参数值为 null 。

``` java
 // 设置参数值
if (Objects.nonNull(user.getId())) {
  statement.setLong(1, user.getId());
} else {
    statement.setNull(1, Types.BIGINT);
}

```

精简
我们可以封装为一个工具类 SqlHelper ，简化设置参数值的代码。

``` java
/** SQL辅助类 */
public final class SqlHelper {
    /** 设置长整数值 */
    public static void setLong(PreparedStatement statement, int index, Long value) throws SQLException {
        if (Objects.nonNull(value)) {
            statement.setLong(index, value.longValue());
        } else {
            statement.setNull(index, Types.BIGINT);
        }
    }
    ...
}

 // 设置参数值
SqlHelper.setLong(statement, 1, user.getId());
```
## 利用数据结构
### 利用数组简化
>对于固定上下限范围的 if-else 语句，可以用数组+循环来简化。
普通

``` java

public static int getGrade(double score) {
    if (score >= 90.0D) {
        return 1;
    }
    if (score >= 80.0D) {
        return 2;
    }
    if (score >= 60.0D) {
        return 3;
    }
    if (score >= 30.0D) {
        return 4;
    }
    return 5;
}
```

精简

``` java

private static final double[] SCORE_RANGES = new double[] {90.0D, 80.0D, 60.0D, 30.0D};
public static int getGrade(double score) {
    for (int i = 0; i < SCORE_RANGES.length; i++) {
        if (score >= SCORE_RANGES[i]) {
            return i + 1;
        }
    }
    return SCORE_RANGES.length + 1;
}
```

思考：上面的案例返回值是递增的，所以用数组简化是没有问题的。但是，如果返回值不是递增的，能否用数组进行简化呢？答案是可以的，请自行思考解决。

### 利用 Map 简化
>对于映射关系的 if-else 语句，可以用Map来简化。此外，此规则同样适用于简化映射关系的 switch 语句。


普通

``` java

public static String getBiologyClass(String name) {
    switch (name) {
        case "dog" :
            return "animal";
        case "cat" :
            return "animal";
        case "lavender" :
            return "plant";
        ...
        default :
            return null;
    }
}

```

精简

``` java
private static final Map<String, String> BIOLOGY_CLASS_MAP
    = ImmutableMap.<String, String>builder()
        .put("dog", "animal")
        .put("cat", "animal")
        .put("lavender", "plant")
        ...
        .build();
public static String getBiologyClass(String name) {
    return BIOLOGY_CLASS_MAP.get(name);
}
```
已经把方法简化为一行代码，其实都没有封装方法的必要了。

### 利用容器类简化
>Java 不像 Python 和 Go ，方法不支持返回多个对象。如果需要返回多个对象，就必须自定义类，或者利用容器类。常见的容器类有 Apache 的 Pair 类和 Triple 类， Pair 类支持返回 2 个对象， Triple 类支持返回 3 个对象。

普通

``` java
@Setter
@Getter
@ToString
@AllArgsConstructor
public static class PointAndDistance {
    private Point point;
    private Double distance;
}

public static PointAndDistance getNearest(Point point, Point[] points) {
    // 计算最近点和距离
    ...

    // 返回最近点和距离
    return new PointAndDistance(nearestPoint, nearestDistance);
}

```

精简

``` java
public static Pair<Point, Double> getNearest(Point point, Point[] points) {
    // 计算最近点和距离
    ...

    // 返回最近点和距离
    return ImmutablePair.of(nearestPoint, nearestDistance);
}
```
### 利用 ThreadLocal 简化
> ThreadLocal 提供了线程专有对象，可以在整个线程生命周期中随时取用，极大地方便了一些逻辑的实现。用 ThreadLocal 保存线程上下文对象，可以避免不必要的参数传递。

普通

由于 DateFormat 的 format 方法线程非安全（建议使用替代方法），在线程中频繁初始化 DateFormat 性能太低，如果考虑重用只能用参数传入 DateFormat 。例子如下：


``` java

public static String formatDate(Date date, DateFormat format) {
    return format.format(date);
}

public static List<String> getDateList(Date minDate, Date maxDate, DateFormat format) {
    List<String> dateList = new ArrayList<>();
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(minDate);
    String currDate = formatDate(calendar.getTime(), format);
    String maxsDate = formatDate(maxDate, format);
    while (currDate.compareTo(maxsDate) <= 0) {
        dateList.add(currDate);
        calendar.add(Calendar.DATE, 1);
        currDate = formatDate(calendar.getTime(), format);
    }
    return dateList;
}
```

精简

可能你会觉得以下的代码量反而多了，如果调用工具方法的地方比较多，就可以省下一大堆 DateFormat 初始化和传入参数的代码。

``` java
private static final ThreadLocal<DateFormat> LOCAL_DATE_FORMAT = new ThreadLocal<DateFormat>() {
    @Override
    protected DateFormat initialValue() {
        return new SimpleDateFormat("yyyyMMdd");
    }
};

public static String formatDate(Date date) {
    return LOCAL_DATE_FORMAT.get().format(date);
}

public static List<String> getDateList(Date minDate, Date maxDate) {
    List<String> dateList = new ArrayList<>();
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(minDate);
    String currDate = formatDate(calendar.getTime());
    String maxsDate = formatDate(maxDate);
    while (currDate.compareTo(maxsDate) <= 0) {
        dateList.add(currDate);
        calendar.add(Calendar.DATE, 1);
        currDate = formatDate(calendar.getTime());
    }
    return dateList;
}
```
* 注意：ThreadLocal 有一定的内存泄露的风险，尽量在业务代码结束前调用 remove 方法进行数据清除。

## 利用 Optional
>在 Java 8 里，引入了一个 Optional 类，该类是一个可以为 null 的容器对象。
### 保证值存在

普通

``` java
Integer thisValue;
if (Objects.nonNull(value)) {
    thisValue = value;
} else {
    thisValue = DEFAULT_VALUE;
}
```

精简

``` java
Integer thisValue = Optional.ofNullable(value).orElse(DEFAULT_VALUE);
```
### 保证值合法

普通

``` java

Integer thisValue;
if (Objects.nonNull(value) && value.compareTo(MAX_VALUE) <= 0) {
    thisValue = value;
} else {
    thisValue = MAX_VALUE;
}
```

精简

``` java

Integer thisValue = Optional.ofNullable(value)
    .filter(tempValue -> tempValue.compareTo(MAX_VALUE) <= 0).orElse(MAX_VALUE);

```
### 避免空判断

普通

``` java
String zipcode = null;
if (Objects.nonNull(user)) {
    Address address = user.getAddress();
    if (Objects.nonNull(address)) {
        Country country = address.getCountry();
        if (Objects.nonNull(country)) {
            zipcode = country.getZipcode();
        }
    }
}
```

精简

``` java

String zipcode = Optional.ofNullable(user).map(User::getAddress)
    .map(Address::getCountry).map(Country::getZipcode).orElse(null);
```
## 利用 Stream
> 流（Stream）是Java 8的新成员，允许你以声明式处理数据集合，可以看成为一个遍历数据集的高级迭代器。流主要有三部分构成：获取一个数据源→数据转换→执行操作获取想要的结果。每次转换原有 Stream 对象不改变，返回一个新的 Stream 对象，这就允许对其操作可以像链条一样排列，形成了一个管道。流（Stream）提供的功能非常有用，主要包括匹配、过滤、汇总、转化、分组、分组汇总等功能。

### 匹配集合数据

普通

``` java

boolean isFound = false;
for (UserDO user : userList) {
    if (Objects.equals(user.getId(), userId)) {
        isFound = true;
        break;
    }
}
```

精简

``` java
boolean isFound = userList.stream()
    .anyMatch(user -> Objects.equals(user.getId(), userId));
```
### 过滤集合数据

普通

``` java

List<UserDO> resultList = new ArrayList<>();
for (UserDO user : userList) {
    if (Boolean.TRUE.equals(user.getIsSuper())) {
        resultList.add(user);
    }
}
```

精简

``` java
List<UserDO> resultList = userList.stream()
    .filter(user -> Boolean.TRUE.equals(user.getIsSuper()))
    .collect(Collectors.toList());
```
### 汇总集合数据

普通

``` java
double total = 0.0D;
for (Account account : accountList) {
    total += account.getBalance();
}
```

精简

``` java
double total = accountList.stream().mapToDouble(Account::getBalance).sum();
```
### 转化集合数据

普通

``` java
List<UserVO> userVOList = new ArrayList<>();
for (UserDO userDO : userDOList) {
    userVOList.add(transUser(userDO));
}

```

精简

``` java

List<UserVO> userVOList = userDOList.stream()
    .map(this::transUser).collect(Collectors.toList());
```

### 分组集合数据

普通

``` java

Map<Long, List<UserDO>> roleUserMap = new HashMap<>();
for (UserDO userDO : userDOList) {
    roleUserMap.computeIfAbsent(userDO.getRoleId(), key -> new ArrayList<>())
        .add(userDO);
}
```

精简

``` java

Map<Long, List<UserDO>> roleUserMap = userDOList.stream()
    .collect(Collectors.groupingBy(UserDO::getRoleId));
```
### 分组汇总集合

普通

``` java

Map<Long, Double> roleTotalMap = new HashMap<>();
for (Account account : accountList) {
    Long roleId = account.getRoleId();
    Double total = Optional.ofNullable(roleTotalMap.get(roleId)).orElse(0.0D);
    roleTotalMap.put(roleId, total + account.getBalance());
}
```

精简

``` java

roleTotalMap = accountList.stream().collect(Collectors.groupingBy(Account::getRoleId, Collectors.summingDouble(Account::getBalance)));

```
### 生成范围集合
> Python 的 range 非常方便，Stream 也提供了类似的方法。

普通

``` java
int[] array1 = new int[N];
for (int i = 0; i < N; i++) {
    array1[i] = i + 1;
}

int[] array2 = new int[N];
array2[0] = 1;
for (int i = 1; i < N; i++) {
    array2[i] = array2[i - 1] * 2;
}

```

精简

``` java
int[] array1 = IntStream.rangeClosed(1, N).toArray();
int[] array2 = IntStream.iterate(1, n -> n * 2).limit(N).toArray();
```
## 利用程序结构

### 返回条件表达式
>条件表达式判断返回布尔值，条件表达式本身就是结果。

普通

``` java

public boolean isSuper(Long userId)
    UserDO user = userDAO.get(userId);
    if (Objects.nonNull(user) && Boolean.TRUE.equals(user.getIsSuper())) {
        return true;
    }
    return false;
}
```

精简

``` java

public boolean isSuper(Long userId)
    UserDO user = userDAO.get(userId);
    return Objects.nonNull(user) && Boolean.TRUE.equals(user.getIsSuper());
}
```
### 最小化条件作用域
>最小化条件作用域，尽量提出公共处理代码。

普通

``` java
Result result = summaryService.reportWorkDaily(workDaily);
if (result.isSuccess()) {
    String message = "上报工作日报成功";
    dingtalkService.sendMessage(user.getPhone(), message);
} else {
    String message = "上报工作日报失败:" + result.getMessage();
    log.warn(message);
    dingtalkService.sendMessage(user.getPhone(), message);
}
```

精简

``` java
String message;
Result result = summaryService.reportWorkDaily(workDaily);
if (result.isSuccess()) {
    message = "上报工作日报成功";
} else {
    message = "上报工作日报失败:" + result.getMessage();
    log.warn(message);
}
dingtalkService.sendMessage(user.getPhone(), message);
```

### 调整表达式位置
>调整表达式位置，在逻辑不变的前提下，让代码变得更简洁。

普通1

``` java

String line = readLine();
while (Objects.nonNull(line)) {
    ... // 处理逻辑代码
    line = readLine();
}
```

普通2

``` java
for (String line = readLine(); Objects.nonNull(line); line = readLine()) {
    ... // 处理逻辑代码
}
```

精简

``` java

String line;
while (Objects.nonNull(line = readLine())) {
    ... // 处理逻辑代码
}
```
* 注意：有些规范可能不建议这种精简写法。

### 利用非空对象
>在比较对象时，交换对象位置，利用非空对象，可以避免空指针判断。

普通

``` java

private static final int MAX_VALUE = 1000;
boolean isMax = (value != null && value.equals(MAX_VALUE));
boolean isTrue = (result != null && result.equals(Boolean.TRUE));

```

精简

``` java

private static final Integer MAX_VALUE = 1000;
boolean isMax = MAX_VALUE.equals(value);
boolean isTrue = Boolean.TRUE.equals(result);
```
## 利用设计模式
### 模板方法模式
>模板方法模式（Template Method Pattern）定义一个固定的算法框架，而将算法的一些步骤放到子类中实现，使得子类可以在不改变算法框架的情况下重定义该算法的某些步骤。

普通

``` java
@Repository
public class UserValue {
    /** 值操作 */
    @Resource(name = "stringRedisTemplate")
    private ValueOperations<String, String> valueOperations;
    /** 值模式 */
    private static final String KEY_FORMAT = "Value:User:%s";

    /** 设置值 */
    public void set(Long id, UserDO value) {
        String key = String.format(KEY_FORMAT, id);
        valueOperations.set(key, JSON.toJSONString(value));
    }

    /** 获取值 */
    public UserDO get(Long id) {
        String key = String.format(KEY_FORMAT, id);
        String value = valueOperations.get(key);
        return JSON.parseObject(value, UserDO.class);
    }

    ...
}

@Repository
public class RoleValue {
    /** 值操作 */
    @Resource(name = "stringRedisTemplate")
    private ValueOperations<String, String> valueOperations;
    /** 值模式 */
    private static final String KEY_FORMAT = "Value:Role:%s";

    /** 设置值 */
    public void set(Long id, RoleDO value) {
        String key = String.format(KEY_FORMAT, id);
        valueOperations.set(key, JSON.toJSONString(value));
    }

    /** 获取值 */
    public RoleDO get(Long id) {
        String key = String.format(KEY_FORMAT, id);
        String value = valueOperations.get(key);
        return JSON.parseObject(value, RoleDO.class);
    }

    ...
}

```

精简

``` java
public abstract class AbstractDynamicValue<I, V> {
    /** 值操作 */
    @Resource(name = "stringRedisTemplate")
    private ValueOperations<String, String> valueOperations;

    /** 设置值 */
    public void set(I id, V value) {
        valueOperations.set(getKey(id), JSON.toJSONString(value));
    }

    /** 获取值 */
    public V get(I id) {
        return JSON.parseObject(valueOperations.get(getKey(id)), getValueClass());
    }

    ...

    /** 获取主键 */
    protected abstract String getKey(I id);

    /** 获取值类 */
    protected abstract Class<V> getValueClass();
}

@Repository
public class UserValue extends AbstractValue<Long, UserDO> {
    /** 获取主键 */
    @Override
    protected String getKey(Long id) {
        return String.format("Value:User:%s", id);
    }

    /** 获取值类 */
    @Override
    protected Class<UserDO> getValueClass() {
        return UserDO.class;
    }
}

@Repository
public class RoleValue extends AbstractValue<Long, RoleDO> {
    /** 获取主键 */
    @Override
    protected String getKey(Long id) {
        return String.format("Value:Role:%s", id);
    }

    /** 获取值类 */
    @Override
    protected Class<RoleDO> getValueClass() {
        return RoleDO.class;
    }
}
```
### 建造者模式
> 建造者模式（Builder Pattern）将一个复杂对象的构造与它的表示分离，使同样的构建过程可以创建不同的表示，这样的设计模式被称为建造者模式。

普通

``` java
public interface DataHandler<T> {
    /** 解析数据 */
public T parseData(Record record);

    /** 存储数据 */
public boolean storeData(List<T> dataList);
}

public <T> long executeFetch(String tableName, int batchSize, DataHandler<T> dataHandler) throws Exception {
    // 构建下载会话
    DownloadSession session = buildSession(tableName);

    // 获取数据数量
    long recordCount = session.getRecordCount();
    if (recordCount == 0) {
        return 0;
    }

    // 进行数据读取
    long fetchCount = 0L;
    try (RecordReader reader = session.openRecordReader(0L, recordCount, true)) {
        // 依次读取数据
        Record record;
        List<T> dataList = new ArrayList<>(batchSize);
        while ((record = reader.read()) != null) {
            // 解析添加数据
            T data = dataHandler.parseData(record);
            if (Objects.nonNull(data)) {
                dataList.add(data);
            }

            // 批量存储数据
            if (dataList.size() == batchSize) {
                boolean isContinue = dataHandler.storeData(dataList);
                fetchCount += batchSize;
                dataList.clear();
                if (!isContinue) {
                    break;
                }
            }
        }

        // 存储剩余数据
        if (CollectionUtils.isNotEmpty(dataList)) {
            dataHandler.storeData(dataList);
            fetchCount += dataList.size();
            dataList.clear();
        }
    }

    // 返回获取数量
    return fetchCount;
}

 // 使用案例
long fetchCount = odpsService.executeFetch("user", 5000, new DataHandler() {
    /** 解析数据 */
    @Override
public T parseData(Record record) {
        UserDO user = new UserDO();
        user.setId(record.getBigint("id"));
        user.setName(record.getString("name"));
        return user;
    }

    /** 存储数据 */
    @Override
public boolean storeData(List<T> dataList) {
        userDAO.batchInsert(dataList);
        return true;
    }
});
```

精简

``` java

public <T> long executeFetch(String tableName, int batchSize, Function<Record, T> dataParser, Function<List<T>, Boolean> dataStorage) throws Exception {
    // 构建下载会话
    DownloadSession session = buildSession(tableName);

    // 获取数据数量
    long recordCount = session.getRecordCount();
    if (recordCount == 0) {
        return 0;
    }

    // 进行数据读取
    long fetchCount = 0L;
    try (RecordReader reader = session.openRecordReader(0L, recordCount, true)) {
        // 依次读取数据
        Record record;
        List<T> dataList = new ArrayList<>(batchSize);
        while ((record = reader.read()) != null) {
            // 解析添加数据
            T data = dataParser.apply(record);
            if (Objects.nonNull(data)) {
                dataList.add(data);
            }

            // 批量存储数据
            if (dataList.size() == batchSize) {
                Boolean isContinue = dataStorage.apply(dataList);
                fetchCount += batchSize;
                dataList.clear();
                if (!Boolean.TRUE.equals(isContinue)) {
                    break;
                }
            }
        }

        // 存储剩余数据
        if (CollectionUtils.isNotEmpty(dataList)) {
            dataStorage.apply(dataList);
            fetchCount += dataList.size();
            dataList.clear();
        }
    }

    // 返回获取数量
    return fetchCount;
}

 // 使用案例
long fetchCount = odpsService.executeFetch("user", 5000, record -> {
        UserDO user = new UserDO();
        user.setId(record.getBigint("id"));
        user.setName(record.getString("name"));
        return user;
    }, dataList -> {
        userDAO.batchInsert(dataList);
        return true;
    });

```
普通的建造者模式，实现时需要定义 DataHandler 接口，调用时需要实现 DataHandler 匿名内部类，代码较多较繁琐。而精简后的建造者模式，充分利用了函数式编程，实现时无需定义接口，直接使用 Function 接口；调用时无需实现匿名内部类，直接采用 lambda 表达式，代码较少较简洁。

### 代理模式
>Spring 中最重要的代理模式就是 AOP (Aspect-Oriented Programming，面向切面的编程)，是使用 JDK 动态代理和 CGLIB 动态代理技术来实现的。

普通

``` java

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {
    /** 用户服务 */
    @Autowired
    private UserService userService;

    /** 查询用户 */
    @PostMapping("/queryUser")
    public Result<?> queryUser(@RequestBody @Valid UserQueryVO query) {
        try {
            PageDataVO<UserVO> pageData = userService.queryUser(query);
            return Result.success(pageData);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return Result.failure(e.getMessage());
        }
    }
    ...
}
```

精简1

基于  @ControllerAdvice 的异常处理：

``` java
@RestController
@RequestMapping("/user")
public class UserController {
    /** 用户服务 */
    @Autowired
    private UserService userService;

    /** 查询用户 */
    @PostMapping("/queryUser")
    public Result<PageDataVO<UserVO>> queryUser(@RequestBody @Valid UserQueryVO query) {
        PageDataVO<UserVO> pageData = userService.queryUser(query);
        return Result.success(pageData);
    }
    ...
}

@Slf4j
@ControllerAdvice
public class GlobalControllerAdvice {
    /** 处理异常 */
    @ResponseBody
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error(e.getMessage(), e);
        return Result.failure(e.getMessage());
    }
}
```

精简2

基于 AOP 的异常处理：

``` java
// UserController代码同"精简1"

@Slf4j
@Aspect
public class WebExceptionAspect {
    /** 点切面 */
    @Pointcut("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    private void webPointcut() {}

    /** 处理异常 */
    @AfterThrowing(pointcut = "webPointcut()", throwing = "e")
    public void handleException(Exception e) {
        Result<Void> result = Result.failure(e.getMessage());
        writeContent(JSON.toJSONString(result));
    }
    ...
}
```
## 利用删除代码
>“少即是多”，“少”不是空白而是精简，“多”不是拥挤而是完美。删除多余的代码，才能使代码更精简更完美。
### 删除已废弃的代码
>删除项目中的已废弃的包、类、字段、方法、变量、常量、导入、注解、注释、已注释代码、Maven包导入、MyBatis的SQL语句、属性配置字段等，可以精简项目代码便于维护。

普通

``` java
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
public class ProductService {
    @Value("discardRate")
    private double discardRate;
    ...
    private ProductVO transProductDO(ProductDO productDO) {
        ProductVO productVO = new ProductVO();
        BeanUtils.copyProperties(productDO, productVO);
        // productVO.setPrice(getDiscardPrice(productDO.getPrice()));
        return productVO;
    }
    private BigDecimal getDiscardPrice(BigDecimal originalPrice) {
        ...
    }
}
```

精简

``` java

@Service
public class ProductService {
    ...
    private ProductVO transProductDO(ProductDO productDO) {
        ProductVO productVO = new ProductVO();
        BeanUtils.copyProperties(productDO, productVO);
        return productVO;
    }
}
```
### 删除接口方法的public
>对于接口(interface)，所有的字段和方法都是 public 的，可以不用显式声明为 public 。

普通

``` java

public interface UserDAO {
    public Long countUser(@Param("query") UserQuery query);
    public List<UserDO> queryUser(@Param("query") UserQuery query);
}
```

精简

``` java

public interface UserDAO {
    Long countUser(@Param("query") UserQuery query);
    List<UserDO> queryUser(@Param("query") UserQuery query);
}
```
### 删除枚举构造方法的 private
>对于枚举(menu)，构造方法都是 private 的，可以不用显式声明为 private 。

普通

``` java
public enum UserStatus {
    DISABLED(0, "禁用"),
    ENABLED(1, "启用");
    private final Integer value;
    private final String desc;
    private UserStatus(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }
    ...
}
```

精简

``` java
public enum UserStatus {
    DISABLED(0, "禁用"),
    ENABLED(1, "启用");
    private final Integer value;
    private final String desc;
    UserStatus(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }
    ...
}
```
### 删除 final 类方法的 final
> 对于 final 类，不能被子类继承，所以其方法不会被覆盖，没有必要添加 final 修饰。

普通

``` java
public final Rectangle implements Shape {
    ...
    @Override
    public final double getArea() {
        return width * height;
    }
}
```

精简

``` java

public final Rectangle implements Shape {
    ...
    @Override
    public double getArea() {
        return width * height;
    }
}
```
### 删除基类 implements 的接口
> 如果基类已 implements 某接口，子类没有必要再 implements 该接口，只需要直接实现接口方法即可。

普通

``` java
public interface Shape {
    ...
    double getArea();
}
public abstract AbstractShape implements Shape {
    ...
}
public final Rectangle extends AbstractShape implements Shape {
    ...
    @Override
    public double getArea() {
        return width * height;
    }
}
```

精简

``` java

...
public final Rectangle extends AbstractShape {
    ...
    @Override
    public double getArea() {
        return width * height;
    }
}
```
### 删除不必要的变量
>不必要的变量，只会让代码看起来更繁琐。

普通

``` java

public Boolean existsUser(Long userId) {
    Boolean exists = userDAO.exists(userId);
    return exists;
}
```

精简

``` java

public Boolean existsUser(Long userId) {
    return userDAO.exists(userId);
}
```
