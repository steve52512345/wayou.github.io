---
layout: post
title: "[golang]string & rune & byte"
date: 2021-07-11T23:15:11Z
---
# [golang]string & rune & byte

字符串并不由 rune 组成，而是由 byte 组成。同数组，slice 一样，可通过索引访问对应位置的元素，也能使用 slice 那样的截取语法。

```go
func main() {
	var s string = "hello word!"
	var b byte = s[1]
	s2 := s[:5]
	s3 := s[6:]
	fmt.Println(b)  // 101
	fmt.Println(s2) // hello
	fmt.Println(s3) // word!
}
```

同数组和 slice, 可使用 `len` 获取字符串的长度。因为本质上字符串是 byte 组成的，所以，这里得到的是 byte 数，而不是真实的字符数。

```go
func main() {
	s1 := "hello"
	s2 := "你好"
	fmt.Println(len(s1), len(s2)) // 5 6
}
```

也是由于字符串是 byte 为单位的缘故，如果字符串中存储的不是英文等一个字符占一个 byte 的情形时，最好不要使用 slice 操作字符串，因为得到的很可能不是一个完整的可见字符

## 字符串 & rune &  bype 的互转

可通过类型转换操作将 rune 及 byte 转成字符串：

```jsx
func main() {
	var a rune = 'x'
	var s string = string(a)
	var b byte = 'y'
	var s2 string = string(b)
	fmt.Println(s, s2)
}
```

反之亦然，

```jsx
func main() {
	s := "hello"
	b := []byte(s)
	r := []rune(s)
	fmt.Println(b, r)
	// [104 101 108 108 111] [104 101 108 108 111]
}
```

不仅字符串，其实大部分情况 下，Go 中数据就是一串连续的 bytes。

**注意**：将数字转字符串时，结果是数字对应的字符编码所代表的字符，比如：

```jsx
func main() {
	x := 65
	s := string(x)
	fmt.Println(s) // A
}
```

## rune

和 byte 不同，rune 是字符为单位，这点在 `for-range` 时体现了出来：

```go
func main() {
	s := "hello😵!"
	for i, v := range s {
		fmt.Println(i, v, string(v))
	}
}

// 输出结果：
// 0 104 h
// 1 101 e
// 2 108 l
// 3 108 l
// 4 111 o
// 5 128565 😵
// 9 33 !
```

以上。

