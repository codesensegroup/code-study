---
title: "Redis Ring"
pageTitle: "Redis Ring"
contributors: ["frank30941"]
---

## Hash Function

以下是簡單的 Hash Function 的公式：

    XXX mod N = Y  (N: number of nodes, Y: node index)

這個公式可以用來計算 key 要存放在哪個 node 上。
但是這個公式有個問題，就是當 N 增加時，會造成大量的資料重新分配，使資料不平均分配，所以 Redis Ring 使用 [CRC16](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) 作為 Hash Function，對於 CRC16 所產生的值範圍是 0 ~ 65535。

## Redis Ring

每個 node 都是一個 Redis server，而 slot 是一個 0 ~ 16383 的數字，每個 node 負責一個 slot。

例如：node1 負責 slot 0 ~ 511，node2 負責 slot 512 ~ 1023，以此類推，直到 slot 分配到 16383 為止。

每個 key 都會被 Hash Function 轉換成一個 slot，並存放在對應的 node 上
其分配方式如下：

    slot = CRC16(key) mod 16384

``` txt
# 依次序set key value 操作Redis Server
set book1 abc
set book2 def
set book3 ghi
set book4 jkl
set book5 mno
set book6 pqr
set book7 stu

# Redis叢集資料Slot分流機制
                          client
                            |  (依上面次序進行set操作)
                            V
                  CRC16(key) mod 16384
--------------------------------------------------------------
       Redis               Redis               Redis
     (Master)            (Master)            (Master)
    |        |           |       |           |       |
    V        V           V       V           V       V
  Redis    Redis       Redis    Redis       Redis    Redis
(Replica) (Replica)  (Replica) (Replica)  (Replica) (Replica)
--------------------------------------------------------------
     book1=abc            book2=def             book3=ghi
     book4=jkl            book5=mno             book6=pqr
     book7=stu
```
[Day27 Redis架構實戰-Redis叢集Slot分流機制](https://ithelp.ithome.com.tw/articles/10281010?sc=pt)

## Redis Ring 的缺點

* 因為 Redis Ring 是一個同步的集群，所以當一個 node 過載時，會造成整個 Redis Ring 都會變慢。
* 且Redis Server集群採用Gossip協議實施無中心式叢集，如果超過1000個主節點時因為Gossip協議需要頻繁的訊息傳輸所以效率會變差，主要是因為網路頻寬的問題，故不建議部署超過1000個主節點
* 對於 Redis Ring 的資料分配，當資料量增加時，會造成資料分配不均勻，所以 Redis Ring 會造成資料分散在不同的 node 上，而不是在同一個 node 上。
* 所以根據上述問題 lua script 不能對不同的 node 執行，所以在 lua script 中，不能使用 Redis Ring 的特性。(不過可以使用key{hash}的方式來分配到同一個 node 上,但有傾斜的潛在問題，或是使用pipeline的方式來執行)
