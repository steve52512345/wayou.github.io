---
layout: post
title: "[golang] Slices"
date: 2021-07-11T00:27:00Z
---
# [golang] Slices

## Slice 的声明

语法同数组，只是不需要指定大小了。

```go
// 注意与数组进行区分，数组的大小不能省略，需要使用 `...`
var slices = []int{
	1, 2, 3,
}

// 使用索引初始化部分元素，该语句创始了一个长度为 5 的 slice 且设置最后一个元素为 99
var slices2 = []int{
	4: 99,
}

fmt.Println(slices, slices2)
// [1 2 3] [0 0 0 0 99]
```

访问也同数组一样，通过下标完成。

```go
fmt.Println(slices[1])  // 2
fmt.Println(slices2[6]) // 🚨 panic: runtime error: index out of range [6] with length 5
```

## Slice 的初始值

当声明 slice 未初始化时，其初始值为 `nil`

```go
var mySlice []int
fmt.Println(mySlice == nil) // true
```

不同于其他语言中的 `null`，`nil` 表示没有值，`nil` 是无类型的，所以可赋值给任意类型，此处值为 `nil` 的 slice 是空的，如果打印出来可看到一个空数组 `[]`。

## Slice 的常用方法

### len

同数组，获取 slice 的长度

### append

向 slice 追加元素

```go
var mySlice []int
// 追加一个元素
mySlice = append(mySlice, 1)
// 可一次性追加多个元素
mySlice = append(mySlice, 2, 3, 4)
// 可通过 `...` 操作符将另一个 slice 展开后进行追加
var x = []int{5, 6}
mySlice = append(mySlice, x...)
fmt.Println(mySlice)
```

注意：需要将 `append` 的返回再赋值到原来的变量，因为 Go 中函数调用时参数是值传递，并不会修改原来的数据。

### Capacity

Slice 的值是存储在一块连续内存中，slice 的 capacity 一般会比 slice 实际长度大一些，用于在向 slice 添加元素时预留的空间。当向 slice 添加的元素超过 capacity 时，实现上，Go 会创始一个新的 slice，其 capacity 比添加元素后的总长度要大，将原来 slice 的元素复制到这个新 slice 并且返回。

通过如下的代码可看到 capacity 的增长过程：

```go
func main() {
	var x []int
	x = append(x, 1)
	fmt.Println(x, len(x), cap(x))
	x = append(x, 2)
	fmt.Println(x, len(x), cap(x))
	x = append(x, 3)
	fmt.Println(x, len(x), cap(x))
	x = append(x, 4)
	fmt.Println(x, len(x), cap(x))
	x = append(x, 5)
	fmt.Println(x, len(x), cap(x))
}

// 输出：
// [1] 1 1
// [1 2] 2 2
// [1 2 3] 3 4
// [1 2 3 4] 4 4
// [1 2 3 4 5] 5 8
```

可以看到随着元素的增加 capacity 在适时增大。但如果我们在一开始就指定好 slice 的大小，势必会节省些开销。通过 `make` 来创始一个包含初始 capacity 的 slice。

### make

通过 `make` 可指定 slice 类型，长度和 capacity。

```go
func main() {
	x := make([]int, 5, 10)
	fmt.Println(x, len(x), cap(x))
	// [0 0 0 0 0] 5 10
}
```

上面示例创始了一个长度为 5，并且填充了零值的 slice，其容量 capacity 为 10。

但这样创始后 slice 中的值是未初始化的零值，容易通过索引进行访问和操作，埋下隐患，可以声明长度 0，只指定想要的 capacity。这样通过索引访问元素时就会有报错了。

```go
func main() {
	x := make([]int, 0, 10)
	fmt.Println(x, len(x), cap(x), x[2]) //🚨 panic: runtime error: index out of range [2] with length 0
	x = append(x, 1, 2, 3)
	fmt.Println(x, len(x), cap(x), x[2]) // [1 2 3] 3 10 3
}
```

使用 slice 的一个原则是尽量避免 capacity 的增长，以减少不必要的开销。

### 从现有 slice 截取

现有 slice 变量后跟的中括号里指定需要截取的起始和结束索引，`[start,end)`，可得到新的 slice。

```go
x := []int{1, 2, 3, 4, 5}
a := x[1:3]
b := x[:3]
c := x[1:]
fmt.Println(a, b, c)
// [2 3] [1 2 3] [2 3 4 5]
```

但上述截取操作，并没有创始新的内存空间，新形成的 slice 与原来的 slice 是共用相同的存储，所以，如果对其中任意 slice 有修改，会影响所有变量。请看另一个示例：

```go
func main() {
	x := []int{1, 2, 3, 4}
	y := x[:2]
	z := x[1:]
	x[1] = 20
	y[0] = 10
	z[1] = 30
	fmt.Println(x, y, z) // [10 20 30 4] [10 20] [20 30 4]
}
```

截取操作和 `append` 结合时会有些迷惑性，请看如下示例：

```go
func main() {
	x := []int{1, 2, 3, 4}
	y := x[:2]
	y = append(y, 30)
	fmt.Println(x, y) // [1 2 30 4] [1 2 30]
}
```

可以看到，从原 slice 截取出来的子集 `y` 添加新元素后直接替换了该内存空间的值，而并不是将原来的 slice 长度增加了一个。

当从一个 slice 截取新的 slice 时，新的 capacity 和原 slice 一样，再减去 offset。比如上面 `y` 是从开头截取的，所以 offset 为 0，其 capacity 就也和原 slice 是一样的。

但其长度却是 2，当 append 时，将元素设置到索引为 2 的位置，效果就是修改了原来的内容，而不是扩展空间。

截取出来的子 slice，在共享的内存区域，如果原来有值，则会互相影响，如果原来没有值，则不会影响。具体来说：

```go
func main() {
	x := make([]int, 0, 5)
	x = append(x, 1, 2, 3, 4)
	y := x[:2]
	z := x[2:]
	fmt.Println(cap(x), cap(y), cap(z))
	y = append(y, 30, 40, 50)
	fmt.Println(x, y, z) // 1. [1 2 30 40] [1 2 30 40 50] [30 40]
	x = append(x, 60)
	fmt.Println(x, y, z) // 2. [1 2 30 40 60] [1 2 30 40 60] [30 40]
	z = append(z, 70)
	fmt.Println(x, y, z) // 3. [1 2 30 40 70] [1 2 30 40 70] [30 40 70]
}
```

上面示例代码中，

1. 处设置了 y 的 2，3，4 索引位置的值，但因为 y 和 x, z 共享的位置中，只有 2,3 原来是有值的，所以这两处的变动同步到了 x, z 中
2. 处修改了 x 索引为 4 处的值，此时 y 索引为 4 处也有值，所以也同步被修改了，因为 z 对应原来 x 索引 4 处没有值，所以不受影响
3. 最后设置 z 时，所有都受影响了

应该尽量避免像上面这样对子 slice 进行 append 操作，形成互相影响。对应地，可使用 full slice expression 来创建子 slice，其实就是限制子 slice 长度与 capacity 一致，这样在对子 slice 进行 append 操作时，会生成新的 slice，当然就不会影响原有的数据。

```go
y := x[:2:2]
z := x[2:4:4] 
```

### copy

截取的方式会有内存共享的问题，通过 `copy` 复制的试试则是生成一个全新的 slice，

```go
func main() {
	x := []int{1, 2, 3, 4}
	y := make([]int, 2)
	num := copy(y, x)
	fmt.Println(num, y) // 2 [1 2]
}
```

copy 会尽可能多地从源 slice 复制元素到目标 slice，具体个数取决于谁的 length 更小。

也可以指定从哪里开始复制：

```go
func main() {
	x := []int{1, 2, 3, 4}
	y := make([]int, 2)
	num := copy(y, x[2:])
	fmt.Println(num, y) // 2 [3 4]
}
```

甚至指定目标 slice 从哪里开始存放，以及源和目标可指定为同一 slice ：

```go
func main() {
	x := []int{1, 2, 3, 4}
	num := copy(x[:3], x[1:])
	fmt.Println(num, x) // 3 [2 3 4 4]
}
```

以上。

