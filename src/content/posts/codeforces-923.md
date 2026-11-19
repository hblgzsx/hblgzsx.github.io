---
title: Codeforces Round 923 · 训练与复盘
description: 一次 Div.3 训练的代码与复盘，记录实现过程及值得改进的地方。
date: '2024-02-09'
topic: algorithms
kind: 算法题解
tags:
  - 算法
  - 题解
  - Codeforces
featured: false
draft: false
legacy: /2024/02/09/Codeforces Round 923 (Div.3)/
---
## [Codeforces Round 923(Div.3)](https://codeforces.com/contest/1927)

第一次尝试一个文件完成所有题目，不太好，不利于维护和他人查看

```cpp
#include<bits/stdc++.h>
const int N = 2e5 + 10;
void solveA()
{
    int n;
    std::string s;
    std::cin >> n >> s;
    int end = n, start = 0;
    for(int i = 0; i < n; i++)
    {
        if(s[i] == 'B')
        {
            start = i;
            break;
        }
    }
    for(int i = n - 1; i >= 0; i--)
    {
        if(s[i] == 'B')
        {
            end = i;
            break;
        }
    }
    std::cout << end - start + 1 << "\n";
}

void solveB()
{
    int n;
    std::cin >> n;
    std::vector<int> a(n);
    for(auto &x : a) std::cin >> x;
    std::map<int,int> mp;
    for(auto x : a)
    {
        std::cout << char(mp[x] + 'a');
        mp[x]++;
    }
    std::cout << "\n";
}

void solveC()
{
    int n, m, k;
    std::cin >> n >> m >> k;
    std::set<int> a, b, c;
    std::map<int,int> mp;
    for(int i = 0; i < n; i++)
    {
        int x; std::cin >> x;
        if(x <= k)
        {
            a.insert(x);
            mp[x] = 1;
            c.insert(x);
        }
    }
    for(int i = 0; i < m; i++)
    {
        int x; std::cin >> x;
        if(x <= k)
        {
            b.insert(x);
            c.insert(x);
        }
    }
    if(c.size() == k && b.size() >= k / 2 && a.size() >= k / 2)
    {
        int flag = 0;
        for(auto x : b)
        {
            if(mp[x] == 1) flag++;
        }
        if(a.size() + b.size() - flag >= k)
        {
            std::cout << "YES\n";
            return;
        }
    }
    else std::cout << "NO\n";
}

void solveD() {
    int n;
    std::cin >> n;
    std::vector<int> a(n + 1);
    std::map<int, int> mp;
    int now, index;
    std::cin >> now;
    a[1] = now;
    index = 1;
    for (int i = 2; i <= n; i++)
    {
        std::cin >> a[i];
        if(a[i] != now)
        {
            for(int j = index; j < i; j++)
            {
                mp[j] = i;
            }
            index = i;
            now = a[i];
        }
    }
    int q; std::cin >> q;
    while(q--)
    {
        int l, r;
        std::cin >> l >> r;
        if(mp[l] == 0 || mp[l] > r)
        {
            std::cout << "-1 -1\n";
        }
        else
        {
            std::cout << l << " " << mp[l] << "\n";
        }
    }
    std::cout << "\n";
}

void solveE()
{
    int n, k;
    std::cin >> n >> k;

    if(n == k)
    {
        for(int i = 1; i <= n; i++)
        {
            std::cout << i << " ";
        }
        std::cout << "\n";
        return;
    }
    int m = n / k;
    int r = n % k;
    std::vector<int> a;
    int mx = 0;
    for(int i = 0; i < r; i++)
    {
        a.push_back((i % 2 == 0 ? i * (m + 1) + 1 :  (i + 1) * (m + 1)));
        mx = (i + 1) * (m + 1);
    }
    int mx1 = mx;
    for(int i = r; i < k; i++)
    {
        a.push_back((i % 2 == 0 ? (i - r) * (m) + 1 + mx1 :  ((i - r) + 1) * (m) + mx1));
        mx = ((i - r)+ 1) * (m) + mx1;
    }
    int cnt = 0;
    while(cnt < n)
    {
        for(int i = 0; i < k; i++)
        {
            if(cnt < n)
            {
                std::cout << a[i] << " ";
                if(i % 2 == 0) a[i]++;
                else a[i]--;
            }
            else break;
            cnt++;
        }
    }
    std::cout << "\n";
}

struct DSU
{
    std::vector<int> f, siz;
    DSU(int n) : f(n), siz(n, 1){std::iota(f.begin(), f.end(), 0);}
    int leader(int x)
    {
        while(x != f[x]) x = f[x] = f[f[x]];
        return x;
    }
    bool same(int u, int v)
    {
        return leader(u) == leader(v);
    }
    bool merge(int u, int v)
    {
        u = leader(u);
        v = leader(v);
        if(u == v) return false;
        siz[u] += siz[v];
        f[v] = u;
        return true;
    }
    int size(int x)
    {
    	return siz[leader(x)];
    }
};
struct Edge
{
    int u, v, w;
    bool operator<(const Edge& X) const
    {
        return w < X.w;
    }
}e[2 * N];
std::vector<int> E[2 * N], siz(N), path(N);
std::queue<int> q;

void solveF1()
{
    int n, m; std::cin >> n >> m;
    DSU dsu(N);
    int ans = 0;
    for(int i = 0; i < n; i++)
    {
        siz[i] = 0;
        path[i] = 0;
        E[i].clear();
    }
    for(int i = 0; i < m; i++)
    {
        int u, v, w;
        std::cin >> u >> v >> w;
        u--, v--;
        e[i] = {u, v, w};
    }
    std::sort(e, e + m);
    for(int i = m - 1; i >= 0; i--)
    {
        int u = e[i].u, v = e[i].v;
        if(dsu.same(u, v))
        {
            ans = i;
        }
        dsu.merge(u, v);
    }
    for(int i = m - 1; i > ans; i--)
    {
        int u = e[i].u, v = e[i].v;
        E[u].push_back(v);
        E[v].push_back(u);
    }
    auto bfs = [&](int x) -> void
    {
        q.push(x);
        siz[x] = 1;
        while(q.size())
        {
            auto u = q.front(); q.pop();
            for(auto v : E[u])
            {
                if(siz[v]) continue;
                siz[v] = siz[u] + 1;
                path[v] = u;
                q.push(v);
            }
        }
    };
    int u = e[ans].u, v = e[ans].v;
    bfs(u);
    n = siz[v];
    std::cout << e[ans].w << " " << n << "\n";
    for(int i = 1; i <= n; i++)
    {
        std::cout << v + 1 << " ";
        v = path[v];
    }
    std::cout << "\n";
}

void solveF2()
{
    int n, m;
    std::cin >> n >> m;
    std::vector<std::array<int, 3>> edges(m);
    for(int i = 0;i < m; i++)
    {
        int u, v, w;
        std::cin >> u >> v >> w;
        u--, v--;
        edges[i] = {w, u, v};
    }
    std::sort(edges.begin(), edges.end(), std::greater());
    int ans = 1e9;
    DSU dsu(n);
    int U, V;
    std::vector<std::vector<int>> adj(n);
    for(auto [w, u, v] : edges)
    {
        if(!dsu.merge(u, v))
        {
            ans = w;
            U = u;
            V = v;
        }
        else
        {
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
    }
    std::vector<int> path;
    auto dfs = [&](auto self, int x, int Fa) -> bool
    {
        if(x == V)
        {
            path.push_back(x);
            return true;
        }
        for(auto v : adj[x])
        {
            if(v == Fa) continue;
            if(self(self, v, x))
            {
                path.push_back(x);
                return true;
            }
        }
        return false;
    };

    dfs(dfs, U, -1);
    std::cout << ans << " " << path.size() << "\n";
    for(auto x : path)
    {
        std::cout << x + 1 << " \n"[x == path.back()];
    }
}


void solveG()
{
    int n;
    std::cin >> n;
    std::vector<int> a(n);
    for(auto &x : a) std::cin >> x;
    std::vector<int> pre(n + 1);
    for(int i = 0; i < n; i++)
    {
        pre[i + 1] = std::max(pre[i], std::min(n, i + a[i]));
    }
    std::vector<int> dp(n + 1, n);
    for(int i = 0, x = 0; ; i = pre[i + 1], x++)
    {
    	dp[i] = x;
    	if(i == n) break;
    }
    for(int i = 0; i < n; i++)
    {
        for(int j = i; j < n; j++)
        {
        	if(j - a[j] + 1 <= i)
        	{
        		int cur = j + 1;
	            int mx = 0;
	            for(int k = i; k < j; k++)
	            {
	                mx = std::max(mx, std::min(n, k + a[k]));
	            }
	            for(int k = j + 1, x = dp[i] + 1; ; k = mx, x++)
	            {
	                while(cur <= k && cur < n)
	                {
	                    mx = std::max(mx, std::min(n, cur + a[cur]));
	                    cur++;
	                }
	                dp[k] = std::min(dp[k], x);
	                if(mx == k) break;
	            }
        	}
        }
    }
    std::cout << dp[n] << "\n";
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1; std::cin >> t;
    while(t--) solveG();
    return 0;
}
```

