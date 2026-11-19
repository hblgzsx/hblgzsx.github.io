---
title: 2024 牛客寒假集训营 · 第一场补题记录
description: 回顾第一场训练中的模拟、分类讨论与实现方法，保留解题思路和 C++ 代码。
date: '2024-02-29'
topic: algorithms
kind: 算法题解
tags:
  - 算法
  - 题解
  - 牛客
featured: false
draft: false
legacy: /2024/02/29/2024年牛客寒假集训营第一场补题记录/
---
- 追逐jiangly的新一天：2024-02-02

### B.[关鸡](https://ac.nowcoder.com/acm/contest/67741/B)

> **笔记** 法一
>模拟讨论， 特判（2， 0）


```cpp
#include<bits/stdc++.h>

void solve()
{
    int n; std::cin >> n;   
    //0, 1, 2, 3
    std::map<std::pair<int,int>, int > mp;
    std::set<std::pair<int,int>> st;
    for(int i = 0; i < n; i++)
    {
        int r, c;
        std::cin >> r >> c;
        mp[{c, r}] = 1;
        st.insert({c, r});
    }
    int right = 2;
    int left = 2;
    bool flag = false;
    for(auto[c, r] : st)
    {
        if(c < 0)
        {
            if(mp[{c, r}] && left >= 0)
            {
                if(left == 2) left--;
                if(left == 1 && mp[{c, r}] && (mp[{c, r + 1}] || mp[{c + 1, r + 1}] || mp[{c - 1, r + 1}])) left--;
                if(left == 1 && mp[{c, r}] && (mp[{c, r - 1}] || mp[{c + 1, r - 1}] || mp[{c - 1, r - 1}])) left--;
            }
        }
        else if(c == 0) flag = true;
        else
        {
            if(mp[{c, r}] && right >= 0)
            {
                if(right == 2) right--;
                if(right == 1 && mp[{c, r}] && (mp[{c, r + 1}] || mp[{c + 1, r + 1}] || mp[{c - 1, r + 1}])) right--;
                if(right == 1 && mp[{c, r}] && (mp[{c, r - 1}] || mp[{c + 1, r - 1}] || mp[{c - 1, r - 1}])) right--;
            }
        }
    }
    
    int ans = right + left;
    if(ans == 4 && flag) ans = 2;
    else if(ans == 4) ans = 3;
    else if(right == 1 && left == 2)
    {
        if(flag)
        {
            if(mp[{1, 1}]) ans = 1;
            else ans = 2;
        }
        else
        {
            if(mp[{1, 1}]) ans = 2;
        }
    }
    else if(right == 2 && left == 1)
    {
        if(flag)
        {
            if(mp[{-1, 1}]) ans = 1;
            else ans = 2;
        }
        else
        {
            if(mp[{-1, 1}]) ans = 2;
        }
    }
    else if(ans == 2)
    {
        if(right == 2 || left == 2)
        {
            if(flag) ans = 1;
        }
        else if(right == 1)
        {
            if(flag)
            {
                if(mp[{-1, 1}] && mp[{1, 1}]) ans = 0;
                else if(mp[{-1, 1}] || mp[{1, 1}]) ans = 1;
            }
            else
            {
                if(mp[{-1, 1}] && mp[{1, 1}]) ans = 1;
            }
        }
    }
    else if(ans == 1)
    {
        if(flag)
        {
            if(left)
            {
                if(mp[{-1, 1}]) ans = 0;
            }
            else if(right)
            {
                if(mp[{1, 1}]) ans = 0;
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
```

> [!quote] 法二
> jiangly优美代码
> 1. 1 ^ 3 = 2, 2 ^ 3 = 1
> 2. 统一的美


```cpp
#include<bits/stdc++.h>


void solve()
{
	int n; std::cin >> n;
    std::set<std::pair<int,int> > st;
    int l1 = 0, l2 = 0, r1 = 0, r2 = 0;
    for(int i = 0; i < n; i++)
    {
        int c, r;
        std::cin >> r >> c;
        if(c <= 0) l1 = 1;
        if(c >= 0) r1 = 1;
        st.emplace(r, c);
    }
    for(auto [r, c] : st)
    {
        if(!c) continue;
        else
        {
            if(st.count({r ^ 3, c}) || st.count({r ^ 3, c + ((c > 0 )? -1 : 1) }))
            {
                if(c > 0) r2 = 1;
                else l2 = 1;
            }
        }
    }
    int ans = 4 - l1 - l2 - r1 - r2;
    if(!l2 && !r2)
    {
        ans = std::min(ans, int(3 - st.count({2, 0}) - st.count({1, 1}) - st.count({1, -1})));
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
```

### E.[本题又主要考察了贪心](https://ac.nowcoder.com/acm/contest/67741/E)

> **笔记** + 标签
>DFS


```cpp
#include<bits/stdc++.h>

void solve()
{
    int n, m; std::cin >> n >> m;
    std::vector<int> a(n);
    for(int i = 0; i < n; i++)
    {
        std::cin >> a[i];
    }
    std::vector<int> u(m), v(m);
    for(int i = 0; i < m; i++)
    {
        std::cin >> u[i] >> v[i];
        u[i]--, v[i]--;
    }
    int ans = n;
    auto dfs = [&](auto self, int o)-> void
    {
        if(o == m)
        {
            int res = 1;
            for(int i = 1; i < n; i++)
            {
                res += (a[i] > a[0]);
            }
            ans = std::min(ans, res);
            return;
        }
        for(auto [x, y] : {std::make_pair(3, 0), {0, 3}, {1, 1}})
        {
            a[u[o]] += x;
            a[v[o]] += y;
            self(self, o + 1);
            a[u[o]] -= x;
            a[v[o]] -= y;
        }
    };
    dfs(dfs, 0);
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

//url: https://ac.nowcoder.com/acm/contest/67741/E
```


### F.[鸡数题！](https://ac.nowcoder.com/acm/contest/67741/F)

![image-20240228143157443](https://raw.githubusercontent.com/hblgzsx/UploadImage/main/img/202402290922032.png)

```cpp
#include <bits/stdc++.h>
 
using i64 = long long;
template<class T>
constexpr T power(T a, i64 b) 
{
    T res = 1;
    for (; b; b /= 2, a *= a) 
    {
        if (b % 2) 
        {
            res *= a;
        }
    }
    return res;
}
 
constexpr i64 mul(i64 a, i64 b, i64 p) 
{
    i64 res = a * b - i64(1.L * a * b / p) * p;
    res %= p;
    if (res < 0) 
    {
        res += p;
    }
    return res;
}
template<i64 P>
struct MLong {
    i64 x;
    constexpr MLong() : x{} {}
    constexpr MLong(i64 x) : x{norm(x % getMod())} {}
     
    static i64 Mod;
    constexpr static i64 getMod() {
        if (P > 0) {
            return P;
        } else {
            return Mod;
        }
    }
    constexpr static void setMod(i64 Mod_) {
        Mod = Mod_;
    }
    constexpr i64 norm(i64 x) const {
        if (x < 0) {
            x += getMod();
        }
        if (x >= getMod()) {
            x -= getMod();
        }
        return x;
    }
    constexpr i64 val() const {
        return x;
    }
    explicit constexpr operator i64() const {
        return x;
    }
    constexpr MLong operator-() const {
        MLong res;
        res.x = norm(getMod() - x);
        return res;
    }
    constexpr MLong inv() const {
        assert(x != 0);
        return power(*this, getMod() - 2);
    }
    constexpr MLong &operator*=(MLong rhs) & {
        x = mul(x, rhs.x, getMod());
        return *this;
    }
    constexpr MLong &operator+=(MLong rhs) & {
        x = norm(x + rhs.x);
        return *this;
    }
    constexpr MLong &operator-=(MLong rhs) & {
        x = norm(x - rhs.x);
        return *this;
    }
    constexpr MLong &operator/=(MLong rhs) & {
        return *this *= rhs.inv();
    }
    friend constexpr MLong operator*(MLong lhs, MLong rhs) {
        MLong res = lhs;
        res *= rhs;
        return res;
    }
    friend constexpr MLong operator+(MLong lhs, MLong rhs) {
        MLong res = lhs;
        res += rhs;
        return res;
    }
    friend constexpr MLong operator-(MLong lhs, MLong rhs) {
        MLong res = lhs;
        res -= rhs;
        return res;
    }
    friend constexpr MLong operator/(MLong lhs, MLong rhs) {
        MLong res = lhs;
        res /= rhs;
        return res;
    }
    friend constexpr std::istream &operator>>(std::istream &is, MLong &a) {
        i64 v;
        is >> v;
        a = MLong(v);
        return is;
    }
    friend constexpr std::ostream &operator<<(std::ostream &os, const MLong &a) {
        return os << a.val();
    }
    friend constexpr bool operator==(MLong lhs, MLong rhs) {
        return lhs.val() == rhs.val();
    }
    friend constexpr bool operator!=(MLong lhs, MLong rhs) {
        return lhs.val() != rhs.val();
    }
};
 
template<>
i64 MLong<0LL>::Mod = i64(1E18) + 9;
 
template<int P>
struct MInt {
    int x;
    constexpr MInt() : x{} {}
    constexpr MInt(i64 x) : x{norm(x % getMod())} {}
     
    static int Mod;
    constexpr static int getMod() {
        if (P > 0) {
            return P;
        } else {
            return Mod;
        }
    }
    constexpr static void setMod(int Mod_) {
        Mod = Mod_;
    }
    constexpr int norm(int x) const {
        if (x < 0) {
            x += getMod();
        }
        if (x >= getMod()) {
            x -= getMod();
        }
        return x;
    }
    constexpr int val() const {
        return x;
    }
    explicit constexpr operator int() const {
        return x;
    }
    constexpr MInt operator-() const {
        MInt res;
        res.x = norm(getMod() - x);
        return res;
    }
    constexpr MInt inv() const {
        assert(x != 0);
        return power(*this, getMod() - 2);
    }
    constexpr MInt &operator*=(MInt rhs) & {
        x = 1LL * x * rhs.x % getMod();
        return *this;
    }
    constexpr MInt &operator+=(MInt rhs) & {
        x = norm(x + rhs.x);
        return *this;
    }
    constexpr MInt &operator-=(MInt rhs) & {
        x = norm(x - rhs.x);
        return *this;
    }
    constexpr MInt &operator/=(MInt rhs) & {
        return *this *= rhs.inv();
    }
    friend constexpr MInt operator*(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res *= rhs;
        return res;
    }
    friend constexpr MInt operator+(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res += rhs;
        return res;
    }
    friend constexpr MInt operator-(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res -= rhs;
        return res;
    }
    friend constexpr MInt operator/(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res /= rhs;
        return res;
    }
    friend constexpr std::istream &operator>>(std::istream &is, MInt &a) {
        i64 v;
        is >> v;
        a = MInt(v);
        return is;
    }
    friend constexpr std::ostream &operator<<(std::ostream &os, const MInt &a) {
        return os << a.val();
    }
    friend constexpr bool operator==(MInt lhs, MInt rhs) {
        return lhs.val() == rhs.val();
    }
    friend constexpr bool operator!=(MInt lhs, MInt rhs) {
        return lhs.val() != rhs.val();
    }
};

template<>
int MInt<0>::Mod = 998244353;

template<int V, int P>
constexpr MInt<P> CInv = MInt<P>(V).inv();

constexpr int P = 1000000007;
using Z = MInt<P>;

struct Comb
{
	int n;
	std::vector<Z> _fac;
	std::vector<Z> _invfac;
	std::vector<Z> _inv;
	
	Comb(): n{0}, _fac{1}, _invfac{1}, _inv{0}{}
	Comb(int n) : Comb()
	{
		init(n);
	}
	
	void init(int m)
	{
		m = std::min(m, Z::getMod() - 1);
		if(m <= n) return;
		_fac.resize(m + 1);
		_invfac.resize(m + 1);
		_inv.resize(m + 1);
		
		for(int i = n + 1; i <= m; i++)
		{
			_fac[i] = _fac[i - 1] * i;
		}
		_invfac[m] = _fac[m].inv();
		for(int i = m; i > n; i--)
		{
			_invfac[i - 1] = _invfac[i] * i;
			_inv[i] = _invfac[i] * _fac[i - 1];
		}
		n = m;
	}
	
	
	Z fac(int m)
	{
		if(m > n) init(2 * m);
		return _fac[m];
	}
	Z invfac(int m)
	{
		if(m > n) init(2 * m);
		return _invfac[m];
	}
	Z inv(int m)
	{
		if(m > n) init(2 * m);
		return _inv[m];
	}
	Z binom(int n, int m)
	{
		if(n < m || m < 0) return 0;
		return fac(n) * invfac(m) * invfac(n - m);
	}
}comb;


void solve()
{
	int n, m; std::cin >> n >> m;
	Z ans = 0;
	for(int i =0 ; i <= m; i++)
	{
		ans += ((m - i) % 2 ? -1 : 1) * comb.binom(m, i) * power(Z(i), n);
	}
	ans *= comb.invfac(m);
	std::cout << ans << "\n";
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





### H.[01背包，但是bit](https://ac.nowcoder.com/acm/contest/67741/H)

模拟思路---jiangly
```cpp
/*
4 11
1 8
1 4
1 5
1 1
*/

/*
(11) 1011

(8) 1000
(4)  100
(5)  101
(1)    1

(m ^ (1 << i)) | ((1 << i) - 1)
1011
i = 4;
(1011) ^ (10000) | 1111
11011 | 1111

 
if ((s & w[i]) == w[i]) { res += v[i];}

11111
 1000 res += 1
 
11111
  100 res += 1

11111
  101 res += 1

11111
    1 res += 1
//笑话，位运算又不会了
1011
3210（位数索引）


1011
i = 3;
(1011) ^ (1000) | 111
0011 | 111
0111 
if ((s & w[i]) == w[i]) { res += v[i];}

0111
1000 

0111
 100 res += 1

0111
 101 res += 1
 
0111
   1 res += 1
   
   
思路枚举每一位为1的地方，为1前面的地方，或必须和m的前缀相同，后面的任意
   
*/
```

```cpp
#include<bits/stdc++.h>
using i64 = long long;


void solve()
{
    int n, m; std::cin >> n >> m;
    std::vector<int> v(n), w(n);
    for(int i = 0; i < n; i++)
    {
        std::cin >> v[i] >> w[i];
    }
    i64 ans = 0;
    auto check = [&](int s)
    {
        i64 res = 0;
        for(int i = 0; i < n; i++)
        {
            if((s & w[i]) == w[i])
            {
                res += v[i];
            }
        }
        ans = std::max(ans, res);
    };
    
    for(int i = 29; i >= 0; i--)
    {
        if(m >> i & 1)
        {
            check((m ^ (1 << i)) | ((1 << i) - 1));
        }
    }
    check(m);//最高位的1没有check
    std::cout << ans << "\n";
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int t; std::cin >> t;
    while(t--) solve();
    return 0;
}

```
### I.[It's bertrand paradox. Again!](https://ac.nowcoder.com/acm/contest/67741/I)

> [!quote] 新题型
> 考虑随机性，x, y, r, 不换x,y, 换r的动作，一定会使得(x, y)均衡分布，也就是考虑特别的地方，x,y, r都换的动作在x，y坐标大时不均衡，卡特殊点，比如(3, 97), (5, 95)


```cpp
#include<bits/stdc++.h>


void solve()
{
	int n; std::cin >> n;
    int flag = 0;
    for(int i = 0; i < n; i++)
    {
        int x, y, r;
        std::cin >> x >> y >> r;
        if(r <= 3 && (abs(x) >= 97 || abs(y) >= 97)) flag++;
    }
    //随机性，随机性，随机性
    if(flag >= 5000) std::cout << "bit-noob\n";
    else std::cout << "buaa-noob\n";
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


### J.[又鸟之亦心](https://ac.nowcoder.com/acm/contest/67741/J)

```cpp
#include<bits/stdc++.h>
using i64 = long long;

void solve()
{
    int n, x, y;
    std::cin >> n >> x >> y;
    std::vector<int> a(n);
    for(auto  &x : a) std::cin >> x;
    auto check = [&](int d)
    {
        std::set<int> S;
        int lst = x;
        if(std::abs(x - y) <= d)
        {
            S.insert(y);
        }
        
        for(auto x : a)
        {
            if(S.size() && std::abs(x - lst) <= d)
            {
                S.insert(lst);
            }
            while(S.size() && *S.begin() < x - d)
            {
                S.erase(*S.begin());
            }
            while(S.size() && *S.rbegin() > x + d)
            {
                S.erase(*S.rbegin());
            }
            lst = x;
        }
        return S.size();
    };
    
    int l = -1, r = 1E9;
    while(l + 1 < r)
    {
        i64 mid = l + r >> 1;
        if(check(mid)) r = mid;
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

