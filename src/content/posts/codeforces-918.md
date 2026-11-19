---
title: Codeforces Round 918 · 解题记录
description: 记录 Div.4 题目的分析与实现，梳理模拟、贪心和基础数据结构的使用。
date: '2023-12-29'
topic: algorithms
kind: 算法题解
tags:
  - 算法
  - 题解
  - Codeforces
featured: false
draft: false
legacy: /2023/12/29/Codeforces Round 918 (Div.4)/
---
###  A.[Odd One Out](https://codeforces.com/contest/1915/problem/A)

```cpp
// Problem: A. Odd One Out
// Contest: Codeforces - Codeforces Round 918 (Div. 4)
// URL: https://codeforces.com/contest/1915/problem/A
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// Date:2023-12-28 22:46:47
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>


void solve(){
	int a, b, c;
	std::cin >> a >> b >> c;
	if(a == b) std::cout << c << "\n";
	else if(a == c) std::cout << b << "\n";
	else std::cout << a << "\n";
}
int main(){
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--){
		solve();
	}
	return 0;
}
```

### B.[Not Quite Latin Square](https://codeforces.com/contest/1915/problem/B)

```cpp
// Problem: B. Not Quite Latin Square
// Contest: Codeforces - Codeforces Round 918 (Div. 4)
// URL: https://codeforces.com/contest/1915/problem/B
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// Date:2023-12-28 22:49:19
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>


void solve(){
	int n; std::cin >> n;
	while(n--){
		std::string s;
		for(int i = 0; i < 3; i++){
			std::cin >> s;
			std::vector<int> a(3);
			bool flag = false;
			for(int j = 0; j< 3; j++){
				if(s[j] == '?'){
					flag = true;
				}
				else a[s[j] - 'A'] = 1;
			}
			
			if(flag){
				for(int j = 0; j < 3; j++){
					if(!a[j]){
						std::cout << char(j + 'A') << "\n";
					}
				}
			}
		}
	}
}
int main(){
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1;
	while(t--){
		solve();
	}
	return 0;
}
```

### C.[Can I Square?](https://codeforces.com/contest/1915/problem/C)

```cpp
// Problem: C. Can I Square?
// Contest: Codeforces - Codeforces Round 918 (Div. 4)
// URL: https://codeforces.com/contest/1915/problem/C
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// Date:2023-12-28 22:58:38
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>
// std::map<long long,int> mp;
// void init(){
	// for(int i = 0; i <= 1e7 + 10; i++){
		// mp[i * i] = 1;
	// }
// }

bool check(long long x){
	long long l = 0, r = 1e9;
	while(l + 1 < r){
		long long mid = (l + r) / 2;
		if(mid * mid <= x) l = mid;
		else{
			r = mid;
		}
	}
	
	// std::cout << l << "\n";
	return (l * l) == x;
	
}
void solve(){
	int n; std::cin >> n;
	std::vector<int> a(n);
	long long sum = 0;
	for(auto &x : a) std::cin >> x, sum += x;
	
	if(check(sum)){
		std::cout << "YES\n";
	}else{
		std::cout << "NO\n";
	}
}
int main(){
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	// init();
	while(t--){
		solve();
	}
	return 0;
}
```

### D.[Unnatural Language Processing](https://codeforces.com/contest/1915/problem/D)

```cpp
// Problem: D. Unnatural Language Processing
// Contest: Codeforces - Codeforces Round 918 (Div. 4)
// URL: https://codeforces.com/contest/1915/problem/D
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// Date:2023-12-28 23:13:49
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>


void solve(){
	int n; std::cin >> n;
	std::string s; std::cin >> s;
	std::vector<bool> st(5);
	st[0] = 1;
	st[4] = 1;
	//1, 2, 3, 0, 4
	// 01, 010;
	std::string t;
	for(int i = 0; i < n; i++){
		if(i + 3 < n && st[s[i + 3] - 'a'] == 0){
			t += s[i++];
			t += s[i++];
			t += s[i];
			t += '.';
		}
		else if(i + 3 == n){
			t += s[i++];
			t += s[i++];
			t += s[i];
		}
		else if(i + 2 == n){
			t += s[i++];
			t += s[i];
		}
		else{
			t += s[i++];
			t += s[i];
			t += '.';
		}
	}
	std::cout << t << "\n";
}
int main(){
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--){
		solve();
	}
	return 0;
}
```

### E.[Romantic Glasses](https://codeforces.com/contest/1915/problem/E)

```cpp
// Problem: E. Romantic Glasses
// Contest: Codeforces - Codeforces Round 918 (Div. 4)
// URL: https://codeforces.com/contest/1915/problem/E
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// Date:2023-12-28 23:56:07
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>
#define int long long
const int N = 2e5 + 10;
// int a[N];
std::vector<int> a(N, 0);
void solve(){
	int n; std::cin >> n;	
	// std::vector<int> a(N, 0);害人不浅
	for(int i = 0; i < n; i++){
		int x; std::cin >> x;
		if(i % 2) x = -x;
		a[i + 1] = a[i] + x;
	}
	//0也要加进去
	std::sort(a.begin(), a.begin() + n + 1);
	for(int i = 0; i < n; i++){
		if(a[i] == a[i + 1]) {
			// puts("YES");
			std::cout << "YES\n";
			return;
		}
	}
	std::cout << "NO\n";
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

### F.[Greetings](https://codeforces.com/contest/1915/problem/F)

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

### G.[Bicycles](https://codeforces.com/contest/1915/problem/G)

- jiangly源码

```cpp
// Problem: G. Bicycles
// Contest: Codeforces - Codeforces Round 918 (Div. 4)
// URL: https://codeforces.com/contest/1915/problem/G
// Memory Limit: 256 MB
// Time Limit: 4000 ms
// Date:2023-12-30 22:29:09
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>
using i64 = long long;

void solve()
{
	int n, m;
	std::cin >> n >> m;
	std::vector<std::vector<std::pair<int,int>>> adj(n);
	for(int i = 0; i < m; i++)
	{
		int u, v, w;
		std::cin >> u >> v >> w;
		u--, v--;
		adj[u].emplace_back(v, w);
		adj[v].emplace_back(u, w);
	}
	
	std::vector<int> s(n);
	for(int i = 0; i < n; i++)
	{
		std::cin >> s[i];
	}
	
	std::vector<i64> dis(n * n, -1ll);
	std::priority_queue<std::pair<i64,int>, std::vector<std::pair<i64,int> >, std::greater<> > q;
	//距离+节点编号
	
	q.emplace(0, 0);
	
	while(!q.empty())
	{
		auto [d, x] = q.top();
		q.pop();
		
		if(dis[x] != -1)
		{
			continue;
		}
		dis[x] = d;
		
		
		/*？？？？*/
		int c = x / n, b = x % n;
		
		//b -> bike -> 自行车编号
		//c -> city -> 城市编号
		
		if(c == n - 1)
		{
			std::cout << d << "\n";
			return;
		}
		
		// c * n + c, 换当前城市编号的自行车。
		q.emplace(d, c * n + c);
		
		// y * n + b, 保持之前编号的自行车。
		// city * n + bike -> 唯一确定
		// n * (0 ~ n - 1) + (0 ~ n - 1) = (0, (n + 1) * (n - 1)) -> n**2 - n + n - 1 + 1
		for(auto [y, w]: adj[c])
		{
			q.emplace(d + s[b] * w, y * n + b);
		}
	}
	
	
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1;
	while(t--)
	{
		solve();
	}
	return 0;
}
```

- 补题代码

```cpp
// Problem: G. Bicycles
// Contest: Codeforces - Codeforces Round 918 (Div. 4)
// URL: https://codeforces.com/contest/1915/problem/G
// Memory Limit: 256 MB
// Time Limit: 4000 ms
// Date:2024-01-02 01:36:20
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>
using i64 = long long;

void solve()
{
	int n, m;
	std::cin >> n >> m;
	std::vector<int> s(n);
	std::vector<std::vector<std::pair<int, int> > > adj(n);
	for(int i = 0; i < m; i++)
	{
		int u, v, w;
		std::cin >> u >> v >> w;
		u--, v--;
		adj[u].emplace_back(v, w);
		adj[v].emplace_back(u, w);
	}
	for(int i = 0; i < n; i++)
	{
		std::cin >> s[i];
	}
	//注意小根堆的声明
	std::priority_queue<std::pair<i64,int>, std::vector<std::pair<i64, int> >, std::greater<> > q;
	std::vector<i64> dis(n * n, -1ll);
	q.emplace(0, 0);
	while(q.size())
	{
		auto [d, x] = q.top();
		q.pop();
		if(dis[x] != -1)
		{
			continue;
		}
		dis[x] = d;
		
		i64 c = x / n, b = x % n;
		
		if(c == n - 1)
		{
			std::cout << d << "\n";
			return;
		}
		q.emplace(d, c * n + c);
		for(auto [y, w] : adj[c])
		{
			q.emplace(d + s[b] * w, y * n + b);
		}
	}
	
	
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--)
	{
		solve();
	}
	return 0;
}
```

