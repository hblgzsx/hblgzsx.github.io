---
title: 离散化：在相对顺序中简化问题
description: 理解离散化的核心思想，比较去重排序与映射的实现方式，整理保序映射在算法题中的应用。
date: '2023-12-30'
topic: algorithms
kind: 学习笔记
tags:
  - 算法
  - 算法基础
  - 离散化
featured: true
draft: false
legacy: /2023/12/30/ACM算法@离散化/
---
## 简介

离散化是一种数据处理的技巧，本质上可以看成是一种 [哈希](https://oi-wiki.org/string/hash/#hash-的思想)，其保证数据在哈希以后仍然保持原来的全/偏序关系。

通俗地讲就是当有些数据因为本身很大或者类型不支持，自身无法作为数组的下标来方便地处理，而影响最终结果的只有元素之间的相对大小关系时，我们可以将原来的数据按照排名来处理问题，即离散化。

用来离散化的可以是大整数、浮点数、字符串等等。

### 方法一

通常原数组中会有重复的元素，一般把相同的元素离散化为相同的数据。

方法如下：

1. 创建原数组的副本。
2. 将副本中的值从小到大排序。
3. 将排序好的副本去重。
4. 查找原数组的每一个元素在副本中的位置，位置即为排名，将其作为离散化后的值。

>时间复杂度：去重复杂度为$O(n)$,排序复杂度为$O(n\log n)$, 最后$n$次查找复杂度为$O(n\log n)$, 总时间复杂度为$O(n\log n)$。

#### vector数组写法

```cpp
std::vector<int> a(n);

//原数组 a
//副本数组 b
//1.创建副本法1
auto b = a;
//1.创建副本法2
std::vector<int> b(a);
std::sort(b.begin(), b.end());
b.erase(std::unique(b.begin(), b.end()), b.end());
for(int i = 0; i < n; i++)
{
    a[i] = std::lower_bound(b.begin(), b.end(), a[i]) - b.begin();
}    
//2 4 6 8 10
//0 1 2 3 4
```

#### 普通数组写法

```cpp
//原数组 a
//副本数组 b
for(int i = 1; i <= n; i++)
{
    b[i] = a[i];
}
std::sort(b + 1, b + n + 1);
int len = std::unique(b + 1, b + n + 1) - (b + 1);
for(int i = 1; i <= n; i++)
{
    a[i] = std::lower_bound(b + 1, b + len +1, a[i]) - b;
}
//2 4 6 8 10
//1 2 3 4 5
```

### 方法二

根据题目要求，有时候会把相同的元素跟据输入顺序离散化为不同的数据。

此时再用 `std::lower_bound()` 函数实现就有些困难了，需要换一种思路：

1. 创建原数组的副本，同时记录每个元素出现的位置。
2. 将副本按值从小到大排序，当值相同时，按出现顺序从小到大排序。
3. 将离散化后的数字放回原数组。

```cpp
struct Node
{
    int idx, val;
    bool operator <(const Node&W) const
    {
        if(val == W.val) return idx < W.idx;
        return val < W.val;
    }
}tmp[N];

//std::vector<std::pair<int,int>> tmp(10);
//以上结构体等价于std::pair

for(int i = 1; i <= n; i++) tmp[i] = (Node){i, arr[i]};
std::sort(tmp + 1, tmp + n + 1);
for(int i = 1; i <= n; i++) arr[tmp[i].idx] = i;

```

>时间复杂度：排序复杂度为$O(n\log n)$,总时间复杂度为$O(n\log n)$。

### 例题，逆序对---F.[Greetings](https://codeforces.com/contest/1915/problem/F)

```cpp
// Problem: F. Greetings
// Contest: Codeforces - Codeforces Round 918 (Div. 4)
// URL: https://codeforces.com/contest/1915/problem/F
// Memory Limit: 256 MB
// Time Limit: 5000 ms
// Date:2023-12-29 02:03:20
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>
#define int long long
#define x first
#define y second
using PII = std::pair<int,int>;
const int N = 2e5 + 10;	
std::vector<int> t(N);
std::vector<PII> a(N), b(N);
std::vector<int> c(N);
int cnt = 0;
int n;


struct Fenwick
{
	int tree[N]{0};
	// Fenwick(int n = 0): tree(n){}
	
	int lowbit(int x)
	{
		return x & -x;
	}
	void add(int x, int v)
	{
		for(x; x <= N; x += lowbit(x))
		{
			tree[x] += v;
		}
	}
	int sum(int x)
	{
		int ans = 0;
		for(x; x > 0; x-= lowbit(x))
		{
			ans += tree[x];
		}
		return ans;
	}
	
	int rangeSum(int l, int r)
	{
		return sum(r) - sum(l);
	}
	
};

//语法语法，auto a数值传参，auto& a引用地址传参
// 全局可以不传参了。
void solve3(auto &a,int l, int r){
	if(l >= r) return;
	int mid = l + r >> 1;
	solve3(a, l, mid);
	solve3(a, mid + 1, r);
	
	int k = 0, i = l, j = mid + 1;
	while(i <= mid && j <= r){
		if(a[i].y > a[j].y){
			cnt += mid - i + 1;
			t[k++] = a[j++].y;
		}
		else{
			t[k++] = a[i++].y;
		}
	}
	
	while(i <= mid) t[k++] = a[i++].y;
	while(j <= r) t[k++] = a[j++].y;
	for(int i = l, j = 0; i <= r; i++) a[i].y = t[j++];
	
}

void solve1(){
	for(int i = 1; i <= n; i++) b[i] = {a[i].y, i};
	std::sort(b.begin() + 1, b.begin() + n + 1);
	std::vector<int> c(N);
	for(int i = 1; i <= n; i++) c[b[i].y] = i;
	// Fenwick BIT(N); vector<int> 局部声明非常浪费时间
	Fenwick BIT;
	int res = 0;
	for(int i = 1; i <= n; i++)
	{
		BIT.add(c[i], 1);
		res += i - BIT.sum(c[i]);
	}
	std::cout << res << "\n";
}
void solve2(){
	for(int i = 1; i <= n; i++) b[i] = {a[i].y, i};
	std::sort(b.begin() + 1, b.begin() + n + 1);
	for(int i = 1; i <= n; i++) c[b[i].y] = i;
	Fenwick BIT;
	int res = 0;
	for(int i = n; i ; i--)
	{
		BIT.add(c[i], 1);
		res += BIT.sum(c[i] - 1);
	}
	std::cout << res << "\n";
}


void solve(){
	std::cin >> n;
	for(int i = 1; i <= n; i++){
		std::cin >> a[i].x >> a[i].y;
	}
	sort(a.begin() + 1, a.begin() + n + 1);
	// 方法1
	// 离散化 + 树状数组1
	// solve1();
	
	// 方法2
	// 离散化 + 树状数组2
	solve2();
	
	// 方法3
	// cnt = 0;
	// 归并排序
	// solve3(a, 1, n);
	// std::cout << cnt << "\n";
}
signed main(){
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--){
		solve();
	}
	return 0;
}
```

