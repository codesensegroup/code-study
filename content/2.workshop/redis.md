---
title: "Redis快速入門"
pageTitle: "Redis快速入門"
contributors: ["changemyminds"]
---

## 前言

此章節不屬於`資料密集型應用系統設計`書中內容，額外挪出的一個教學章節。

這邊主要是補充快取(Cache) Redis 資料庫的使用方式以及操作。

## 安裝

### 版本號選擇

- 奇數： 2.7、2.9、3.1，為**不穩定版本**
- 偶數： 2.6、2.8、3.0，為**穩定版本**

### Linux 安裝

#### 原始碼安裝

```bash
# 下載檔案
curl -LO "https://download.redis.io/releases/redis-6.2.7.tar.gz"

# 解壓縮
tar -xvf redis-6.2.7.tar.gz

# 移除安裝檔
rm redis-6.2.7.tar.gz

# 前往解壓縮目錄
cd redis-6.2.7

# 編譯專案 (類似編譯了class)
make

# 將binary檔安裝到某個目錄底下
make install PREFIX=/root/redis-6.2.7/redis

# 查看make的安裝目錄
$ ls /root/redis-6.2.7/redis/bin/
redis-benchmark  redis-check-aof  redis-check-rdb  redis-cli  redis-sentinel  redis-server

```

💡 如果執行 make 指令報錯誤，則需要執行下列指令，進行安裝

- Ubuntun

  ```bash
  # 請先確認gcc是否安裝
  gcc -v

  # 更新apt套件
  sudo apt-get update

  # 安裝apt套件
  sudo apt -y install gcc automake autoconf libtool make
  ```

- CentOS

  ```bash

  # 請先確認gcc是否安裝
  gcc -v

  # 更新yum套件
  sudo yum update

  # 安裝yum套件
  sudo yum -y install gcc automake autoconf libtool make

  ```

安裝目錄底下的檔案介紹
| 可執行的檔案 | 功能用途 |
| ---- | ---- |
| redis-server | 啟動 redis 伺服器 |
| redis-cli | redis 客戶端(client)操作 |
| redis-benchmark | 性能測試工具，可以在本機電腦運行，看看本機效能如何 (服務啟動起來後執行) |
| redis-check-aof | AOF 持久化文件檢測和修復工具 |
| redis-check-rdb | RDB 持久化文件檢測和修復工具 |
| redis-sentinel | 啟動哨兵模式 (Redis Cluster 使用) |

#### 其他安裝

- apt 安裝

```bash
# lsb: Linux Standard Base縮寫，用來顯示LSB和特定版本的相關訊息
# 某些最小環境的情況下需要安裝，例如在Docker Container內部
sudo apt install lsb-release

# 將repository加入到apt index中，後續進行更新和安裝
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

# 更新apt-get
sudo apt-get update

# 安裝redis
sudo apt-get install redis
```

- snap 安裝

```bash
# 查詢redis名稱
snap find redis

# 查看redis的資訊
snap info redis
```

### Windows 實體安裝

Redis 主要支援在 Linux 環境底下，因此在 Windows 環境底下支援性很差。
目前有兩個非官方的使用載點可以參考。

- [網友版本 - 5.0.14.1](https://github.com/tporadowski/redis/releases)，目前還有在維護
- [微軟版本 - 3.0.504](https://github.com/microsoftarchive/redis/releases)，目前已經不在維護。

### Docker 安裝

- Redis Server

  ```bash
  docker run --name redis -d -p 6379:6379 redis:6.2.4-alpine
  ```

- Redis CLI

  ```bash
  # 這邊的IP 192.168.23.192，替換為主機的IP
  docker run -it --rm redis redis-cli -h 192.168.23.192 -p 6379
  ```

更多 Docker 使用方式參考[Redis Official](https://hub.docker.com/_/redis)

### 常用操作工具

- [RedisInsight](https://github.com/RedisInsight/RedisInsight/releases)
- redis-cli

官方推薦**RedisInsight**一款 Web base 的工具，個人習慣使用**redis-cli**和**RedisInsight**一起使用。

由於大家一起使用 RedisInsight，為了方便查看 client 端是誰，這邊我們設定 Redis Client 的使用者名稱

```bash
# 設定client的名稱，將darren替換成你自己的名子
CLIENT SETNAME darren

# 查看目前有哪些連線的client
CLIENT LIST
```

## 常用的資料結構

### Strings

- `String`是`Redis`最基本的類型，可以理解成與`Memcached`一模一樣的類型，一個`Key`對應一個`Value`
- `String`類型是二進制(Binary)安全的。意味著`Redis`的`String`可以包含資料。比如 jpg 圖片或者序列化的物件
- `String`類型是`Redis`最基本的資料類型，一個 Redis 中 Value 最多可以是 512M
- 原子性
  - 所謂原子性操作，是指不會被其他執行緒的呼叫機制打斷的操作，這種操作一但開始，就一直運行到結束，中間不會有任何的 context switch (切換到另外一個執行緒)
    - 在**單執行緒**中，能夠在單條指令中完成的操作都可以認為是”原子操作”，因為中斷只能發生於指令之間
    - 在**多執行緒**中，不能被其它執行緒打斷的操作，就叫”原子操作”

#### 常用指令

##### set / get / append / strlen / setnx

```bash
# 增加key: k1, value: v1
> set k1 v1

# 更新key: k1, value: v11
> set k1 v11

# 取得value數值
> get k1
"v11"

# 從尾部後相加，回傳目前value整體的長度
> append k1 __
(integer) 5

# 取得append後的長度
> get k1
"v11__"

# 取得k1中的value長度
> strlen k1
(integer) 5

# 只有key不存在時，才會設置key的值
> setnx k1 k0000
(integer) 0
```

##### incr / decr / incrby / decrby

```bash
# 增加key: k1, value: v1
> set k1 v1

# incr只支援integer
> incr k1
(error) ERR value is not an integer or out of range

# 替不存在的k2進行"數字字串"值加1
> incr k2
(integer) 1

# 替存在的k2進行"數字字串"加1
> incr k2
(integer) 2

# 替存在的k2進行"數字字串"減1
> decr k2
(integer) 1

# 替存在的k2進行"數字字串"減1
> decr k2
(integer) 0

# 替存在的k2進行"數字字串"減1
> decr k2
(integer) -1

# 取得k2數值，記得他是"數字字串"
> get k2
"-1"

# 一次加上100的數值
> incrby k2 100
(integer) 99

# 一次減上100的數值
> decrby k2 100
(integer) -1
```

##### setex / getset

```bash
set k1 v1

# 設定過期時間
expire k1 1000

# 更新數值
set k1 v2

# 查詢數值
> ttl k1
(integer) -1

# 將k1設定為100，且數值為v2 (重新設定則時間重新計算)，下面兩種方式皆可以
> setex k1 100 v2
> set k1 v2 EX 100

# 傳入新增的v3參數，把舊的v2傳回 (與Java中的HashMap的Put功能相同)
> getset k1 v3
"v2"
```

#### 使用場景

- 快取(Cache)資料
- 計數器。
  - 用來統計文章瀏覽次數
  - 某些商品的點擊數量等等
- 分散式共享 Session
- 設定過期(Expire)來完成時效性的資料
  - 手機驗證碼
  - 使用者登入碼
  - 分散式鎖

### Hash

- Redis hash 是一個鍵值集合
- Redis hash 是一個 string 類型的`field`和`value`的映射表，hash 特別適合用於**儲存物件**
- 類似 Java 中的`Map<String, Object>`，`C#`中的`Dictionary<string, object>`

#### 常用指令

##### hset / hget / hmset

```bash
# 設定假資料
> hset h1 familyName Chang
> hset h1 givenName EnShuo
> hset h1 age 28

# 取得hash中的數值
> hget h1 familyName
"Chang"
> hget h1 givenName
"EnShuo"
> hget h1 test
(nil)

# 使用批次來進行設定
> hmset h2 familyName Chang givenName EnShuo age 28
OK
```

##### hexists / hkeys / hvals / hincrby / hsetnx

```bash
# 設定假資料
> hset h1 familyName Chang givenName EnShuo age 28

# 查看h1中是否存在field
> hexists h1 age
(integer) 1
> hexists h1 sex
(integer) 0

# 取得所有的h1的field
> hkeys h1
1) "familyName"
2) "givenName"
3) "age"

# 取得所有的h1中的value
> hvals h1
1) "Chang"
2) "EnShuo"
3) "28"

# 替age加上3
> hincrby h1 age 3
(integer) 31

# 當age存在時，操作失敗
> hsetnx h1 age 100
(integer) 0

# 當sex不存在時，則新增
> hsetnx h1 sex man
(integer) 1
```

#### 使用場景

- 儲存使用者資訊，例如使用者名稱、密碼、電子郵件地址、手機號碼等。
- 儲存商品資訊，例如商品名稱、價格、庫存數量、圖片等。
- 儲存文章資訊，例如文章標題、作者、發布時間、內容等。
- 儲存設定資訊，例如資料庫連線字串、快取時間、超時時間等。

### Lists

- 單一鍵值(Key)多個數值(Value)
- 是一個字串列表，按照插入順序排序。你可以添加一個元素到列表的**頭部(左邊)**或**尾部(右邊)**
- 它的底層其實是[雙鏈接串列](https://zh.wikipedia.org/zh-tw/%E5%8F%8C%E5%90%91%E9%93%BE%E8%A1%A8)，對兩端的操作性能很高，通過索引下的操作中間的節點效能比較差

#### 常用指令

##### lpush / rpush / lpop / rpop / rpoplpush

```bash
# 從key值l1左邊推送四筆資料，因此順序為v4 v3 v2 v1
> lpush l1 v1 v2 v3 v4
(integer) 4

# 從key值l1右邊推送三筆資料，因此順序為v4 v3 v2 v1 v5 v6 v7
> rpush l1 v5 v6 v7
(integer) 7

# 從左方取得數值
> lpop l1
"v4"

# 從右方取得數值
> rpop l1
"v7"

# 從左方key值l2推送v2、v3，因此順序為v3、v2
> lpush l2 v2 v3

# 從左方key值l3推送v1，因此順序為v1
> lpush l3 v1

# 從l2(key)右邊取值，從l3(key)左邊推入
# l2: v3
# l3: v2、v1
> rpoplpush l2 l3

# 從l3(key)取值，則取到v1
> rpop l3
"v1"
```

##### lrange / lindex / llen

```bash
# 從key值l1左邊推送四筆資料，因此順序為v4 v3 v2 v1
> lpush l1 v1 v2 v3 v4
(integer) 4

# 取得0(索引)的第0個位置
> lrange l1 0 0
1) "v4"

# 取得1(索引)的第一位
> lrange l1 1 2
1) "v3"
2) "v2"

# 用反轉(負號)的方式獲取全部，從左到右一次全部取出
> lrange l1 0 -1
1) "v4"
2) "v3"
3) "v2"
4) "v1"

# 測試取值
> lindex l1 0
"v4"
> lindex l1 -1
"v1"
> lindex l1 -10
(nil)

# 取得長度
> llen l1
(integer) 4
```

#### 使用場景

- 實現佇列(Queue)：可以將新加入的元素插入到清單的末尾，將清單的第一個元素刪除即可實現佇列的先進先出 (FIFO) 的特性。
- 實現堆疊(Stack)：可以將新加入的元素插入到清單的末尾，將清單的最後一個元素刪除即可實現棧的後進先出 (LIFO) 的特性。
- 儲存日誌資訊：例如系統日誌、應用程式日誌等。
- 實現訊息佇列(Message Queue)：可以將訊息插入到清單的末尾，然後通過消費者(Consumer)不斷從清單的末尾獲取訊息來實現訊息的非同步處理。

### Sets

- Redis Set 對外提供的功能與**list**類似也是一個列表的功能，它特殊之處在於可以排除重複的數值，當如果要儲存的一個資料列表，不希望出現重複的資料時，set 是一個很好的選擇，且 set 提供 API 能判斷某個資料是否存在於集合中，而 list 沒有這種 API。
- Redis 的 Set 是 string 類型的無序集合。它底層是一個 Hash table，因此**新增**、**刪除**、**查詢**的時間複雜度皆為`O(1)`

#### 常用指令

##### sadd / smembers / sismember

```bash
# 會自動將重複的數值進行過濾
> sadd s1 v1 v1 v1 v2 v3 v4 v5 v5
(integer) 5

# 顯示set的s1(key)的所有數值
> smembers s1
1) "v2"
2) "v1"
3) "v4"
4) "v3"
5) "v5"

# 判s1(key)中的v1是否存在
> sismember s1 v1
(integer) 1

# 判s1(key)中的v9是否存在
> sismember s1 v9
(integer) 0
```

##### scard / srem / spop / srandmember

```bash
# 將數值進行加入
> sadd s1 v1 v2 v3 v4 v5
(integer) 5

# 取得s1(key)的數量
> scard s1
(integer) 5

# 刪除s1(key)中的v4
> srem s1 v4
(integer) 1

# 隨機從s1(key)中取出，並進行刪除
> spop s1 2
1) "v3"
2) "v2"

# 隨機從s1(key)中取出，並不刪除
> srandmember s1 2
1) "v5"
2) "v1"
```

##### sinter / sunion / sdiff

```bash
# 新增兩個set，做為測試
> sadd s1 v1 v2 v3 v4
> sadd s2 v3 v4 v5 v6

# 取交集
> sinter s1 s2
1) "v3"
2) "v4"

# 取聯集
> sunion s1 s2
1) "v4"
2) "v6"
3) "v3"
4) "v2"
5) "v1"
6) "v5"

# 取s1的差集
> sdiff s1 s2
1) "v1"
2) "v2"

# 取s2的差集
> sdiff s2 s1
1) "v5"
2) "v6"
```

#### 使用情境

- 實現抽獎功能，例如: 在一個抽獎活動中，可以使用 sets 將所有的參與者的訊息加入到集合中
- 統計網站拜訪過的 IP。將拜訪過的使用者 IP 進行加入到集合中，由於 set 可以防止重複訊息，因此最終可以顯示唯一。
- 追蹤聊天室的成員，並通過集合運算來管理成員的列表。

### Sorted sets

- Reids 有序集合 zset 與普通的 set 非常相似，也是一個沒有重複元素的字串集合。不同之處在於 zset 的`<value>`都關聯一個評分(score)，這個評分(score)被用來按照從低分到最高分的方式排序。集合的`<value>`是唯一的，但評分(score)可以是重複的。
- 因為元素是有序的，所以可以根據評分(score)或者次序(postion)來獲取一個範圍的元素。存取 zset 的中間元素也是非常快的，因此你能夠 zset 做為一個沒有重複`<value>`的智能列表。

#### 常用指令

##### zadd / zrange / zrangebyscore / zrevrangebyscore

```bash
# 增加參數
> zadd z1 100 chang 200 chen 150 huang
(integer) 3

# 查看原本資料
> zrange z1 0 -1
1) "chang"
2) "huang"
3) "chen"

# 替huang的score增加51為150+51 = 201
> zincrby z1 51 huang
"201"

# 查看修改後的資料
> zrange z1 0 -1 withscores
1) "chang"
2) "100"
3) "chen"
4) "150"
5) "huang"
6) "201"

# 統計z1中的100~200分數之間有幾個
> zcount z1 100 200
(integer) 2

# 取得該<key>集合中的排名，由0開始計算
> zrank z1 chen
(integer) 1

# 取不到數值時，則回傳(nil)
> zrank z1 error
(nil)

# 刪除該z1中的chen
> zrem z1 chen
(integer) 1
```

#### 使用情境

- 實現一個文章的閱讀排行榜
- 根據時間排序的新聞列表
- 直播聊天室中的送禮排行榜

## 其他常用功能

### Transactions

#### 介紹

- Reids 事務是一個單獨的隔離操作，事務中的所有命令都會被序列化、按順序地執行。事務在執行的過程中，不會被其他客戶端發送來的命令請求給中斷。
- Redis 事務的主要作用就是串聯多個命令防止別的命令插隊

#### Multi / Exec / discard

- 從輸入`Multi`指令開始，輸入的命令都會依次進入命令柱列中，但不會執行，直到輸入`Exec`後，Redis 會將之前的命令柱列中的命令依序執行
- 如果不想要這次的命令柱列，我們可以透過`discard`來進行放棄。

使用一個**Client A**和**Client B**來進行模擬操作

```bash
# Client A 開啟事務
> Multi
OK

# Client A執行操作
(TX)> set k1 v1
QUEUED

# Client A執行操作
(TX)> get k1
QUEUED

# Client B執行操作
> set k1 v100
OK

# Client A執行操作，可以發現將一連串的動作執行操作，不受Client B客戶端的操作
(TX)> Exec
1) OK
2) "v1"
```

將事務進行丟棄

```bash
# 開啟事務
> Multi
OK

# 設定k7數值，不小心打錯
(TX)> set k7
(error) ERR wrong number of arguments for 'set' command

# 將本次事務進行丟棄
localhost:6379(TX)> discard
OK
```

#### 使用 watch / unwatch 指令 (樂觀鎖)

- `watch`
  - 在執行`multi`之前，先執行`watch <key1> <key2>`，可以監視一個或多個`<key>`，如果事務執行之前，這個(或這些)key 的數值，被其他指令或他人改動過，那麼事務將被打斷。
- `unwatch`
  - 取消`WATCH`命令對所有 key 的監控
  - 如果在執行`WATCH`命令之後，`EXEC`或`DISCARD`命令先被執行的話，就不需要在執行`UNWATCH`了

使用 Redis 中`Watch`的功能，這種方式就是`check-and-set`機制

```bash
# 初始化k1的數值為1 (Client A)
> set k1 1
OK

# 啟用監看key k1功能 (Client A)
> WATCH k1
OK

# 開啟事務交易 (Client A)
> MULTI
OK

# 此時有人修改k1內的數值為4 (Client B)
> set k1 4
OK

# 替k1的value進行+1 (Client A)
(TX)> incr k1
QUEUED

# 替k1的value進行+1 (Client A)
(TX)> incr k1
QUEUED

# 執行事務結果，可以發現執行是失敗的，沒有返回兩個結果 (Client A)
(TX)> exec
(nil)

```

#### 三大特性

- 單獨的隔離操作
  - 事務中所有命令都會序列化、按順序地執行。事務在執行的過程中，不會被其他客戶端發送來的命令請求打斷
- 沒有隔離級別的概念
  - 柱列中的命令沒有提交之前都不會實際的被執行，因為事務提交前任何指令都不會被實際執行
- 不保證原子性
  - Redis 同一個事務中，如果有一條命令執行失敗了，其後面的命令仍然會被執行且沒有回滾(Rollback)

### Pub/sub

#### 使用上的限制

- Pub/Sub 的內容，是不會用 Key 的方式去保存的，所以自然資料無法持久化，所以資料有可能會遺失。
- 當發送者(Pub)有發送消息時且訂閱者(Sub)連線中斷，則訂閱者將無法接收到此筆訊息
- Redis Server 服務停止或當機，則資料會遺失
- Redis 設定參數

  ```bash
  # 32mb：緩衝區(buffer)一旦超過 32MB，Redis 直接將訂閱者(Sub)會強制踢    下線
  # 8mb + 60：緩衝區超過 8MB，並且持續 60 秒，Redis 也會把訂閱(Sub)會    被踢下線。
  client-output-buffer-limit pubsub 32mb 8mb 60
  ```

#### 使用上的限制

#### 使用上的考量

- 由於 Pub/Sub 的內容，是不會進行保存的，所以重要的資料不建議使用此方式來傳遞
- 發佈者(Pub)發布消息後，並不會管訂閱者(Sub)是否有接收到消息，也沒有 ACK 機制，所以無法確定訂閱者(Sub)是否有接收到訊息，因此在可靠訊息的場合中不建議使用
- 訂閱者(Sub)會占用一個 Redis Server 的連線，所以要注意是否有佔用過多的連線
- 當發佈者(Pub)發送”大量”訊息，若訂閱者(Sub)來不及消化，資料會阻塞在通道(channel)中，阻塞時間越長，資料丟失的風險就越高，當訊息量過大時，會造成緩衝區(buffer)溢出，就會導致資流失

#### 常用指令

```bash
# 查看全部的channel
> PUBSUB CHANNELS
> PUBSUB CHANNELS *

# 查看channel使用wild card
> PUBSUB CHANNELS sss*

# 訂閱listen:something的頻道
SUBSCRIBE listen:something

# 發送資料給listen:something的頻道
PUBLISH listen:something hello

# 解除訂閱listen:something的頻道
UNSUBSCRIBE listen:something

# 使用MONITOR來Debug模式查看目前送出狀態
MONITOR
```

#### 使用情境

- SignalR / WebSocket 在 K8s 底下多個 Pod 的廣播應用，[Redis backplane](https://learn.microsoft.com/zh-tw/aspnet/core/signalr/scale?view=aspnetcore-7.0)
- 在網頁應用程序中實現的即時聊天室。例如: 當有一個用戶在聊天室中發布了一條消息時，所有訂閱該消息的用戶都會收到通知。

## 常見的三大問題

### Cache Penetration (快取穿透)

在高併發的情況下，查詢一個不存在的數值時會發生。例如: id 為 **-1** 或**特別大不存在的資料時**，會造成 Cache 內的資料是找不到的，既然從 Cache 中找不到數值，因此大量的 Request 皆會落到資料庫上，造成資料庫負擔。

💡 請求未命中的 Cache，直接存取資料庫，這就是快取穿透。

✅ 解決方式

1. 在 Interface 層`增加驗證`，比如使用者權限驗證、參數驗證，不合法的參數就直接 Return，比如: id 做基本的驗證，id ≤ 0 直接`return`。
2. `快取NULL數值`，但是 Cache NULL 的時間不能太長，否則 NULL 資料長時間得不到更新，也不能太短，否則達不到防止 Cache Penetration(快取穿透)
3. 布隆過濾器(Bloom Filter) 類似 Hash table 的演算法，將所有可能的查詢生成一個 bitmap，在進行資料庫查詢之前會使用這個 bitmap 進行過濾，如果不在其中則直接過濾，從而減輕資料庫層面的壓力。

### Cache Breakdown / Hotspot Invalid (快取擊穿)

在 Cache 中的一個 Key(比如一個促銷商品)，在某個時間點過期的時候，恰好這個時間點對這個 Key 有大量的高併發請求，這些請求發現 Cache 過期了，因此都從資料庫加載資料回 Cache，如果這個時間點有高併發請求則可能會瞬間造成資料庫壓垮。

💡 熱點 Key，Cache 過期，直接攻擊資料庫

✅ 解決方式

1. 設置熱資料(Hot data)永遠**不過期**
2. 使用加互斥鎖，對 Cache 查詢時加鎖，如果 Key 不存在就加鎖，然後查 DB 進入到 Cache 中，然後解鎖，其他執行緒發現有鎖就必須等待，然後解鎖後返回資料或到資料庫查詢

### Cache Avalanche (快取雪崩)

大量的 Cache Key 在同一時間失效，導致大量的請求都落在資料庫上，如活動系統裡面同時進行著非常多的活動，但在某個時間點所有的 Cache 皆過期。

1. 設置熱資料(Hot data)永遠**不過期**
2. Cache 資料的過期時間設置為隨機，防止同一時間大量資料過期現象發生。

## 參考

- [關於 Redis Persistence - 資料持久化](https://blog.yowko.com/redis-persistence/)
- [Redis Pub/Sub](https://medium.com/jerrynotes/redis-pub-sub-%E6%98%AF%E4%BB%80%E9%BA%BC-%E6%9C%83%E9%80%A0%E6%88%90%E4%BB%80%E9%BA%BC%E5%95%8F%E9%A1%8C%E5%91%A2-ab5be1e5328d)
- [一分鐘學習 Redis 常見的三大問題](https://wuqian.blog.csdn.net/article/details/105812464)
