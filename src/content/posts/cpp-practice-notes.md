---
title: C++ 编程实践：那些容易忽略的细节
description: 从数组分配、容器使用到并查集，记录算法编程中的经验与实现细节。
date: '2024-02-08'
topic: programming
kind: 技术实践
tags:
  - C++
  - 编程基础
  - 性能优化
featured: false
draft: false
legacy: /2024/02/08/个人C++编程积累小知识/
---
1. 全局和局部定义数组超时原因
- 全局定义数组只需要定义一次，也就是只需要花费一次定义的时间。
- 局部定义数组需要定义很多次，花费的时间就为很多次。
- 需要注意的是，如果数组特别大，局部定义数组和全局定义数组的区别就很大，定义时间很长，尤其是针对C++的STL库的数组或者用法，例如`const int N = 1e5 + 10, std::vector<int> a(N), 和std::cin >> n, std::vector<int> a(n)`就相差很多，数组越大，vector定义需要的时间就越长，所以如果选择局部定义，就不要统一把数组定义到最大，只需要定义到我们需要的大小即可，否则容易超时，如果n为N，则会超时.而n则一般不会，算法竞赛中，如果有t组样例，通常会保证t组样例的总和不会超过一个值，比如2e5, 所以开多个数组的n的总和，也就是只有一个N的效果，如果是每个数组都开到N, 超时是可想而知的。
- 经验代码
```cpp
#include<bits/stdc++.h>
const int N = 2e5 + 10;

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
std::queue<int> q;
void solve()
{
    int n, m; std::cin >> n >> m;
    DSU dsu(n);
    int ans = 0;
########################################################
    std::vector<std::vector<int> > E(2 * n);
    std::vector<int> siz(n), path(n);
   //这里的局部定义，如果n为N，则会超时.而n则一般不会，算法竞赛中，如果有t组样例，通常会保证t组样例的总和不会超过一个值，比如2e5, 所以开多个数组的n的总和，也就是只有一个N的效果，如果是每个数组都开到N, 超时是可想而知的。
#########################################################
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

signed main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1; std::cin >> t;
    while(t--) solve();
    return 0;
}
```

