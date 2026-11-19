---
title: Codeforces Round 929 · 解题记录
description: 整理 Round 929 的题目分析与代码实现，在训练中积累问题拆解的方法。
date: '2024-02-29'
topic: algorithms
kind: 算法题解
tags:
  - 算法
  - 题解
  - Codeforces
featured: false
draft: false
legacy: /2024/02/29/Codeforce Round 929（Div.3）/
---
## A.[Turtle Puzzle: Rearrange and Negate](https://codeforces.com/contest/1933/problem/A)

```cpp
// Problem: A. Turtle Puzzle: Rearrange and Negate
// Contest: Codeforces - Codeforces Round 929 (Div. 3)
// URL: https://codeforces.com/contest/1933/problem/0
// Memory Limit: 256 MB
// Time Limit: 2000 ms
// Date:2024-02-27 22:35:53
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>


void solve()
{
	int n; std::cin >> n;
	std::vector<int> a(n);
	long long ans = 0;
	for(auto &x : a) std::cin >> x, ans += abs(x);
	std::cout << ans << "\n";
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--) solve();
	return 0;
}
```



## B.[Turtle Math: Fast Three Task](https://codeforces.com/contest/1933/problem/B)

```cpp
// Problem: B. Turtle Math: Fast Three Task
// Contest: Codeforces - Codeforces Round 929 (Div. 3)
// URL: https://codeforces.com/contest/1933/problem/B
// Memory Limit: 256 MB
// Time Limit: 2000 ms
// Date:2024-02-27 22:40:23
// Author:hblgzsx
// 借鉴思路：自己
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>


void solve()
{
	int n; std::cin >> n;
	std::vector<int> a(n);
	int flag[3] = {0, 0, 0};
	int sum = 0;
	for(auto &x : a)
	{
		std::cin >> x;
		sum += x;
		if(x % 3 == 2) flag[2] = 1;
		if(x % 3 == 1) flag[1] = 1;
	}
	int v = sum % 3;
	if(v == 0) std::cout << flag[v] << "\n";
	else
	{
		if(v == 1)
		{
			if(flag[1]) std::cout << 1 << "\n";
			else std::cout << 2 << "\n";
		}
		else if(v == 2)
		{
			std::cout << 1 << "\n";
		}
	}
	
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--) solve();
	return 0;
}
```



## C.[Turtle Fingers: Count the Values of k](https://codeforces.com/contest/1933/problem/C)

```cpp
#include<bits/stdc++.h>
#define int long long

int qmi(int a, int k)
{
	int res = 1;
	while(k)
	{
		if(k & 1) res *= a;
		a *= a;
		k >>= 1;
	}
	return res;
}
void solve()
{
	int a, b, l;
	std::cin >> a >> b >> l;
	std::set<int> st;
	for(int x = 0; qmi(a, x) <= l; x++)
	{
		for(int y = 0; qmi(b, y) <= l; y++)
		{
			int k = qmi(a, x) * qmi(b, y);
			if(l >= k  && l % k == 0)
			{
				st.insert(l / k);
			}
			else if(l < k) break;
		}
	}
	std::cout << st.size() << "\n";
}
signed main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--) solve();
	return 0;
}
```



## D.[Turtle Tenacity: Continual Mods]()

```cpp
#include<bits/stdc++.h>


void solve()
{
	int n; std::cin >> n;
	std::vector<int> a(n);
	std::cin >> a[0];
	int res = a[0];
	for(int i = 1; i < n; i++) 
	{
		std::cin >> a[i];
		res = std::__gcd(res, a[i]);		
	}
	for(int i = 0; i < n; i++)
	{
		a[i] /= res;
	}
	std::sort(a.begin(), a.end());
	int x = std::upper_bound(a.begin(), a.end(), a[0]) - a.begin();
	if(x >= 2 && a[0] == 1) std::cout << "NO\n";
	else if(x >= 2 && res == 1) std::cout << "YES\n";
	else std::cout << "YES\n";
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--) solve();
	return 0;
}
```





## E.[Turtle vs. Rabbit Race: Optimal 训练](https://codeforces.com/contest/1933/problem/E)

```cpp
#include<bits/stdc++.h>


void solve()
{
    int n; std::cin >> n;
    std::vector<int> a(n + 1, 0);
    for(int i = 0; i < n; i++)
    {
        std::cin >> a[i + 1];
        a[i + 1] += a[i];
    }
    int q;
    std::cin >> q;

    while(q--)
    {
        int l, u;
        std::cin >> l >> u;
        int L = l, R = n;
        while(L + 1 < R)
        {
            int mid = L + R >> 1;
            if(a[mid] - a[l - 1] > u) R = mid;
            else L = mid;
        }
        int rest = u - (a[R - 1] - a[l - 1]);
        int Rint = a[R] - a[R - 1];
        int rest1 = Rint - rest;
        rest1--;
        if(rest1 < rest)
        {
            std::cout << R << " ";
        }
        else if(R <= l) std::cout << l << " ";
        else std::cout << R - 1 << " ";
    }
    std::cout << "\n";
}

int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--) solve();
	return 0;
}
```





## F.[Turtle Mission: Robot and the Earthquake](https://codeforces.com/contest/1933/problem/F)

```cpp
#include<bits/stdc++.h>
const int N = 1e3 + 10, INF = 0x3f3f3f3f;
int a[N][N];
int vis[N][N];
void solve()
{
	int n, m; std::cin >> n >> m;
	// std::vector<std::vector<int>> vis(n + 1, std::vector<int> (m + 1, -1));
	for(int i = 0; i < n; i++)
	{
		for(int j = 0; j < m; j++)
		{
			std::cin >> a[i][j];
			vis[i][j] = -1;
		}
	}
	
	std::queue<std::pair<int,int>> q;
	vis[0][0] = 0;
	q.push({0, 0});
	int ans = INF;
	
	while(q.size())
	{
		auto [x,  y] = q.front();
		q.pop();
		if(y == m - 1)
		{
			ans = std::min(ans, vis[x][y] + ((x - n + 1 - vis[x][y]) % n + n) % n);
		}
		
		int tx = (x + 1) % n, ty = y + 1;
		if(ty <= m + 1 && a[tx][ty] == 0 && vis[tx][ty] == -1)
		{
			vis[tx][ty] = vis[x][y] + 1;
			q.push({tx, ty});
		}
		
		tx = (x + 2) % n, ty = y;
		if(a[(x + 1) % n][y] == 0 && a[tx][ty] == 0 && vis[tx][ty] == -1)
		{
			vis[tx][ty] = vis[x][y] + 1;
			q.push({tx, ty});
		}
	}
	
	if(ans == INF) ans = -1;
	std::cout << ans << "\n";
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--) solve();
	return 0;
}
```



## G.[Turtle Magic: Royal Turtle Shell Pattern](https://codeforces.com/contest/1933/problem/G)

```cpp
#include<bits/stdc++.h>


void solve()
{
	int n, m, q;
	std::cin >> n >> m >> q;
	auto find = [&](int x, int y, int k)
	{
		if(k < 4)
		{
			y += k;
			if(x % 2 == 1)
			{
				return y % 4 == 0 || y % 4 == 3;
			}
			else
			{
				return y % 4 == 1 || y % 4 == 2;
			}
		}
		else 
		{
			x += k - 4;
			if(y % 2 == 1)
			{
				return x % 4 == 0 || x % 4 == 3;
			}
			else
			{
				return x % 4 == 1 || x % 4 == 2;
			}
		}
	};
	
	int flag[8] = {0};
	int ans = 8;
	std::cout << ans << "\n";
	while(q--)
	{
		int x, y; std::cin >> x >> y;
		std::string s;
		std::cin >> s;
		int t = (s[0] == 's');
		for(int i = 0; i < 8; i++)
		{
			if(flag[i] == 0)
			{
				if(find(x, y, i) != t)
				{
					flag[i] = 1;
					ans--;
				}	
			}
		}
		std::cout << ans << "\n";
	}
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
	int t = 1; std::cin >> t;
	while(t--) solve();
	return 0;
}
```

