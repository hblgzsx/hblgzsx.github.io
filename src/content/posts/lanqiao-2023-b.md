---
title: 第十四届蓝桥杯省赛 B 组 · 题解整理
description: 日期统计、枚举与基础算法：整理蓝桥杯省赛的解题过程和参考实现。
date: '2024-01-30'
topic: algorithms
kind: 算法题解
tags:
  - 算法
  - 题解
  - 蓝桥杯
featured: false
draft: false
legacy: /2024/01/30/2023年第十四届蓝桥杯省赛B组AC代码/
---
## A.[日期统计](https://www.lanqiao.cn/problems/3492/learning/?page=1&first_category_id=1&second_category_id=3&tags=2023&name=%E6%97%A5%E6%9C%9F%E7%BB%9F%E8%AE%A1)
```cpp
#include<bits/stdc++.h>

void solve()
{
    int end[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    int a[] = {5,6,8,6,9,1,6,1,2,4,9,1,9,8,2,3,6,4,7,7,5,9,5,0,3,8,7,5,8,1,5,8,6,1,8,3,0,3,7,9,2,7,0,5,8,8,5,7,0,
               9,9,1,9,4,4,6,8,6,3,3,8,5,1,6,3,4,6,7,0,7,8,2,7,6,8,9,5,6,5,6,1,4,0,1,0,0,9,4,8,0,9,1,2,8,5,0,2,5,3,3};
    int ans = 0;
    std::map<std::pair<int,int>, int> mp;
    for(int i = 0; i < 100; i++)
    {
        for(int j = i + 1; j < 100; j++)
        {
            for(int k = j + 1; k < 100; k++)
            {
                for(int m = k + 1; m < 100; m++)
                {
                    int year = a[i] * 1000 + a[j] * 100 + a[k] * 10 + a[m];
                    if(year == 2023)
                    {
                        for(int i1 = m + 1; i1 < 100; i1++)
                        {
                            for(int j1 = i1 + 1; j1 < 100; j1++)
                            {
                                for(int i2 = j1 + 1; i2 < 100; i2++)
                                {
                                    for(int j2 = i2 + 1; j2 < 100; j2++)
                                    {
                                        int month = a[i1] * 10 + a[j1];
                                        int day = a[i2] * 10 + a[j2];

                                        if(month <= 12 && day <= end[month] && day > 0 && mp[{month, day}] == 0)
                                        {
                                            mp[{month, day}] = 1;
                                            ans++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    std::cout << ans << "\n";
    //235
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1;
    while(t--) solve();
    return 0;
}
```
## B.[01串的熵](https://www.lanqiao.cn/problems/3498/learning/?page=1&first_category_id=1&second_category_id=3&tags=2023&name=01%E4%B8%B2)
```cpp
#include<bits/stdc++.h>
#define len 23333333
//12305912
//11027421

double f(int x)
{
    auto a = 1.0 * x / len;
    auto b = 1.0 * (len - x) / len;
    return -(x * a * std::log2(a) + (len - x) * b * std::log2(b));
}
void solve()
{
    int l = 0, r = len;
    while(l + 1 < r)
    {
        int mid = l + r >> 1;
        if(f(mid) - 11625907.5798 >= 1e-9) r = mid;
        else l = mid;
    }
    std::cout << r << "\n";

}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1;
    while(t--) solve();
    return 0;
}

```
## C.[冶炼金属](https://www.lanqiao.cn/problems/3510/learning/?page=2&first_category_id=1&second_category_id=3&tags=2023)
```cpp
#include<bits/stdc++.h>
void solve()
{
    int n;
    std::cin >> n;
    std::vector<int> a(n), b(n);
    for(int i = 0; i < n; i++)
    {
        std::cin >> a[i] >> b[i];
    }
    auto check = [&](int x, int flag) -> bool
    {
        for(int i = 0; i < n; i++)
        {
            if(flag ? ((a[i] / x) < b[i]) : ((a[i] / x ) > b[i])) return false;
        }
        return true;
    };
    auto b_search = [&](int flag)
    {
        if(flag)
        {
            int l = -1, r = 1e9 + 1;
            while(l + 1 < r)
            {
                int mid = l + r >> 1;
                if(check(mid, flag)) l = mid;
                else r = mid;
            }
            return l;
        }
        else
        {
            int l = -1, r = 1e9 + 1;
            while(l + 1 < r)
            {
                int mid = l + r >> 1;
                if(check(mid, flag)) r = mid;
                else l = mid;
            }
            return r;
        }
    };
    std::cout << b_search(0) << " " << b_search(1) << "\n";
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1;
    while(t--) solve();
    return 0;
}
```
## D.[飞机降落](https://www.lanqiao.cn/problems/3511/learning/?page=2&first_category_id=1&second_category_id=3&tags=2023)
```cpp
#include<bits/stdc++.h>
const int N = 11;
int t[N], d[N], l[N];
int vis[N];
bool flag;
int n;
void dfs(int u, int tim)
{
    if(flag) return;
    if(u == n)
    {
        flag = true;
        return;
    }
    for(int i = 0; i < n; i++)
    {
        if(!vis[i] && tim <= t[i] + d[i])
        {
            vis[i] = true;
            dfs(u + 1, std::max(tim, t[i]) + l[i]);
            if(flag) return;
            vis[i] = false;
        }
    }
}
void solve()
{
    flag = false;
    std::cin >> n;
    for(int i = 0; i < n; i++)
    {
        std::cin >> t[i] >> d[i] >> l[i];
        vis[i] = 0;
    }
    dfs(0, 0);
    if(flag) std::cout << "YES\n";
    else std::cout << "NO\n";
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1; std::cin >> t;
    while(t--) solve();
    return 0;
}

//url: https://www.lanqiao.cn/problems/3511/learning/?page=2&first_category_id=1&second_category_id=3&status=1&tags=2023
```
## E.[接龙数列](https://www.lanqiao.cn/problems/3512/learning/?page=1&first_category_id=1&second_category_id=3&name=%E6%8E%A5%E9%BE%99)
```cpp
#include<bits/stdc++.h>
const int N = 10;
int dp[N];
std::string s;

void solve()
{
    int n; std::cin >> n;
    for(int i = 0; i < n; i++)
    {
        std::cin >> s;
        int st = s[0] - '0';
        int ed = s[s.size() - 1] - '0';
        dp[ed] = std::max(dp[ed], dp[st] + 1);
    }
    int len = 0;
    for(int i = 0; i < N; i++) len = std::max(len, dp[i]);
    std::cout << n - len << "\n";
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1;
    while(t--) solve();
    return 0;
}
```
## F.[岛屿个数](https://www.lanqiao.cn/problems/3513/learning/?page=1&first_category_id=1&second_category_id=3&name=%E5%B2%9B%E5%B1%BF)
```cpp
#include<bits/stdc++.h>
const int N = 50 + 5;
std::vector<std::string> s(N);
int vis[N][N], st[N][N];
int n, m;
int dxy[][2] = {0, 1, 0, -1, 1, 0, -1, 0, 1, 1, 1, -1, -1, 1, -1, -1};

void bfs(int x, int y)
{
    std::queue<std::pair<int,int>> q;
    q.push({x, y});
    vis[x][y] = 1;
    while(q.size())
    {
        auto t = q.front(); q.pop();
        auto nx = t.first, ny = t.second;
        for(int i = 0; i < 4; i++)
        {
            int dx = nx + dxy[i][0], dy = ny + dxy[i][1];
            if(dx < 0 || dx >= n || dy < 0 || dy >= m) continue;
            if(vis[dx][dy] || s[dx][dy] == '0') continue;
            vis[dx][dy] = 1;
            q.push({dx, dy});
        }
    }
}
bool bfs_out(int x, int y)
{
    memset(st, 0, sizeof st);
    std::queue<std::pair<int,int>> q;
    st[x][y] = 1;
    q.push({x, y});
    while(q.size())
    {
        auto t =  q.front(); q.pop();
        int nx = t.first, ny = t.second;
        if(nx ==  0 || nx == n - 1 || ny == 0 || ny == m - 1) return true;
        for(int i = 0; i < 8; i++)
        {
            int dx = nx + dxy[i][0], dy = ny + dxy[i][1];
            if(dx < 0 || dx >= n || dy < 0 || dy >= m) continue;
            if(st[dx][dy] || s[dx][dy] == '1') continue;
            st[dx][dy] = 1;
            q.push({dx, dy});
        }
    }
    return false;
}

void solve()
{
    std::cin >> n >> m;
//    std::vector<std::vector<int> > g(n, std::vector<int>(m, 0));
    for(int i = 0; i < n; i++)
    {
        std::cin >> s[i];
    }
    int ans = 0;
    for(int i = 0; i < n; i++)
    {
        for(int j = 0; j < m; j++)
        {
            if(!vis[i][j] &&  s[i][j] == '1')
            {
                bfs(i, j);
                if(bfs_out(i, j)) ans++;
            }
        }
    }
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
//url: https://www.lanqiao.cn/problems/3513/learning/?page=1&first_category_id=1&second_category_id=3&name=%E5%B2%9B%E5%B1%BF
```
## G.[子串简写](https://www.lanqiao.cn/problems/3514/learning/?page=1&first_category_id=1&second_category_id=3&name=%E5%AD%90%E4%B8%B2%E7%AE%80%E5%86%99)
```cpp
#include<bits/stdc++.h>
#define int long long
void solve()
{
    int k;
    std::string s;
    char c1, c2;
    int sum1 = 0, ans = 0;
    std::cin >> k >> s >> c1 >> c2;
    int n = s.size();
    for(int i = k - 1, j = 0; i < n; i++, j++)
    {
        if(s[j] == c1) sum1++;
        if(s[i] == c2) ans += sum1;
    }
    std::cout << ans << "\n";
}
signed main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1;
    while(t--) solve();
    return 0;
}
//url: https://www.lanqiao.cn/problems/3514/learning/?page=1&first_category_id=1&second_category_id=3&name=%E5%AD%90%E4%B8%B2%E7%AE%80%E5%86%99
```
## H.[整数删除](https://www.lanqiao.cn/problems/3515/learning/?page=1&first_category_id=1&second_category_id=3&name=%E6%95%B4%E6%95%B0)
```cpp
#include<bits/stdc++.h>
#define int long long
const int N = 5e5 + 10;
int l[N], r[N], v[N];
int n, k;
std::priority_queue<std::pair<int, int>, std::vector<std::pair<int,int>>, std::greater<std::pair<int,int> >> h;
void del(int x)
{
    r[l[x]] = r[x], l[r[x]] = l[x];
    v[l[x]] += v[x], v[r[x]] += v[x];
}
void solve()
{
    std::cin >> n >> k;
    r[0] = 1, l[n + 1] = n;
    for(int i = 1; i <= n; i++)
    {
        std::cin >> v[i];
        r[i] = i + 1, l[i] = i - 1;
        h.push({v[i], i});
    }
    while(k--)
    {
        auto t = h.top(); h.pop();
        int x = t.first, y = t.second;
        if(v[y] != x)
        {
            h.push({v[y], y});
            k++;
        }
        else del(y);
    }
    int head = r[0];
    while(head !=  n + 1)
    {
        std::cout << v[head] << " ";
        head = r[head];
    }
}
signed main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1;
    while(t--) solve();
    return 0;
}
//url: https://www.lanqiao.cn/problems/3515/learning/?page=1&first_category_id=1&second_category_id=3&name=%E6%95%B4%E6%95%B0
```
## I.[景区导游](https://www.lanqiao.cn/problems/3516/learning/?page=1&first_category_id=1&second_category_id=3&name=%E6%99%AF%E5%8C%BA%E5%AF%BC%E6%B8%B8)
```cpp
#include<bits/stdc++.h>
using i64 = long long;
const int N = 1e5 + 10;
std::vector<int> e[N], w[N];
int dep[N], fa[N][25];
i64 dist[N];
int n, k;
void dfs(int u, int Fa)
{
    dep[u] = dep[Fa] + 1;
    fa[u][0] = Fa;
    for(int i = 1; i <= 20; i++)
    {
        fa[u][i] = fa[fa[u][i - 1]][i - 1];
    }
    for(int i = 0; i < e[u].size(); i++)
    {
        int v = e[u][i];
        int t = w[u][i];
        if(v == Fa) continue;
        dist[v] = dist[u] + t;
        dfs(v, u);
    }
}
int LCA(int u, int v)
{
    if(dep[u] < dep[v]) std::swap(u, v);
    for(int i = 20; i >= 0; i--)
    {
        if(dep[fa[u][i]] >= dep[v])
        {
            u =  fa[u][i];
        }
    }
    if(u == v) return u;
    for(int i = 20; i >= 0; i--)
    {
        if(fa[u][i] != fa[v][i])
        {
            u = fa[u][i];
            v = fa[v][i];
        }
    }
    return fa[u][0];
}
i64 dis(int x, int y)
{
    if(!x || !y) return 0;
    return dist[x] + dist[y] - 2 * dist[LCA(x, y)];
}
void solve()
{
    std::cin >> n >> k;
    for(int i = 1; i < n; i++)
    {
        int u, v, t;
        std::cin >> u >> v >> t;
        e[u].push_back(v);
        w[u].push_back(t);
        e[v].push_back(u);
        w[v].push_back(t);
    }
    dfs(1, 0);
    std::vector<int> a(k + 2);
    i64 ans = 0;
    for(int i = 1; i <= k; i++)
    {
        std::cin >> a[i];
        ans += dis(a[i], a[i - 1]);
    }
    for(int i = 1; i <= k; i++)
    {
        std::cout << ans - dis(a[i - 1], a[i]) - dis(a[i], a[i + 1]) + dis(a[i - 1], a[i + 1]) << " \n"[i == k];
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1;
    while(t--) solve();
    return 0;
}
//url:https://www.lanqiao.cn/problems/3516/learning/?page=1&first_category_id=1&second_category_id=3&name=%E6%99%AF%E5%8C%BA%E5%AF%BC%E6%B8%B8
```
## J.[砍树](https://www.lanqiao.cn/problems/3517/learning/?page=1&first_category_id=1&second_category_id=3&name=%E7%A0%8D%E6%A0%91)
```cpp
#include<bits/stdc++.h>
const int N = 1e5 + 10;
int dep[N], fa[N][25];
std::vector<int> e[N], num[N];
int n, m, ans;
int siz[N];

void dfs(int u, int Fa)
{
    dep[u] = dep[Fa] + 1;
    fa[u][0] = Fa;
    for(int i = 1; i <= 20; i++)
    {
        fa[u][i] = fa[fa[u][i - 1]][i - 1];
    }
    for(auto v : e[u])
    {
        if(v == Fa) continue;
        dfs(v, u);
    }
}

int LCA(int u, int v)
{
    if(dep[u] < dep[v]) std::swap(u, v);
    for(int i = 20; i >= 0; i--)
    {
        if(dep[fa[u][i]] > dep[v])
        {
            u = fa[u][i];
        }
    }
    if(u == v) return u;
    for(int i = 20; i >= 0; i--)
    {
        if(fa[u][i] != fa[v][i])
        {
            u = fa[u][i];
            v = fa[v][i];
        }
    }
    return fa[u][0];
}

void dfs2(int u, int Fa)
{
    for(int i = 0; i < e[u].size(); i++)
    {
        int v = e[u][i], id = num[u][i];
        if(v == Fa) continue;
        dfs2(v, u);
        siz[u] += siz[v];
        if(siz[v] == m) ans = std::max(ans, id);
    }
}
void solve()
{
    std::cin >> n >> m;
    for(int i = 1; i < n; i++)
    {
        int u, v;
        std::cin >> u >> v;
        e[u].push_back(v);
        num[u].push_back(i);
        e[v].push_back(u);
        num[v].push_back(i);
    }
    for(int i = 0; i < m; i++)
    {
        int u, v; std::cin >> u >> v;
        siz[u]++, siz[v]++, siz[LCA(u, v)] -= 2;
    }
    dfs2(1, 0);
    std::cout << (ans ? ans : -1)<< "\n";
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t = 1;
    while(t--) solve();
    return 0;
}
//url: https://www.lanqiao.cn/problems/3517/learning/?page=1&first_category_id=1&second_category_id=3&name=%E7%A0%8D%E6%A0%91
```

