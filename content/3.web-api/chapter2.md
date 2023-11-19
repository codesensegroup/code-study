---
title: "第2章 EndPoint設計與請求形式"
pageTitle: "第2章 EndPoint設計與請求形式"
contributors: ['changemyminds', 'spyua']
---

## 2.1 設計通過API公開的功能

SNS在線服務功能

- 使用者註冊
- 登入
- 獲取自己的資訊
- 更新自己的資訊
- 取得使用者資訊
- 搜尋使用者
- 添加好友
- 刪除好友
- 取得好友列表
- 搜尋好友
- 發送消息
- 取得好友的訊息
- 編輯訊息
- 刪除訊息
- 好友動態列表
- 特定用的動態列表
- 發表動態訊息
- 編輯動態訊息
- 刪除動態訊息

## 2.2 API EndPoint的設計思想

#### EndPoint的基本設計

怎麼設計一個優秀的URI，有一個重要的原則

> 容易記憶，URI包含的功能一目了然
> 

💡**容易記憶的原則如下**

- 短小便於輸入的URI
- 人可以讀懂的URI
- 沒有大小寫混用的URI
- 修改方便的URI
- 不會曝露伺服器架構的URI
- 規則統一的URI

1. 短小便於輸入的URI

    💀 反例
    
    ```bash
    http://api.example.com/service/api/search
    ```
    
    💡 正例
    
    ```bash
    http://api.example.com/search
    ```
    
    ✅ 結論
    
    > 將URI使用短小、簡單的方式進行表達，更易於理解和記憶。
    > 

2. 人可以讀懂的URI

    💀 反例
    
    ```bash
    http://api.example.com/sv/u
    ```
    
    💡 正例
    
    ```bash
    http://api.example.com/products/12345
    ```
    
    📦 補充
    
    API的設計查詢時，該使用`search`還是`find`詞彙?
    
    通常使用`search`來表示，`search`表示在某個地方尋找，而`find`則是尋找某個特定物品。
    
    ✅ 結論
    
    > 盡量少用縮寫，適當的使用完整的英文單字來表示。
    > 

3. 沒有大小寫混用的URI

    💀 反例
    
    ```bash
    http://api.example.com/Users/12345
    http://example.com/API/getUserName
    ```
    
    💡 正例
    
    ```bash
    http://api.example.com/users/12345
    ```
    
    📦 補充
    
    如果遇到兩種大小寫的URI進行混用時，應該如何進行處理?
    
    ```bash
    http://example.com/USERS/12345
    http://example.com/users/12345
    ```
    
    在普通的Web網站下，如果採用了不論大小寫都會返回相同的結果會出現一種問題，會導致Google等搜尋引    擎會認為有多個頁面返回了相同的結果而導致網站排名進行下降。
    
    參考下列服務，當遇到大寫字母的URI時，會自動返回404
    在線服務     | 處理混有大寫字母的URL  |
    ------------|:-----:|
    Foursqare    | 出錯404 |
    Github       | 出錯404 |
    Tumblr       | 出錯404 |

    ✅ 結論
    
    > 盡量不要使用大小寫字母混用會造成API難以理解，一般標準的做法是，統一使用小寫的URI。
    >

4. 修改方便的URI

    修改方便在英語文語意為`Hackable`。修改方便的URI指的是能將某個URI非常容易修改為另外一個URI。    通常應用在獲取某種商品。
    
    💀 反例
    
    按照資料庫的資料表進行結構區分，例如: 1 ~ 300000儲存到alpha資表表內。
    
    ```bash
    # ID的範圍 1 ~ 300000
    http://api.example.com/v1/items/alpha/:id
    
    # ID的範圍 400001 ~ 500000
    http://api.example.com/v1/items/beta/:id
    
    # ID的範圍 500001 ~ 700000
    http://api.example.com/v1/items/gamma/:id
    
    # ID的範圍 700001 ~
    http://api.example.com/v1/items/delta/:id
    ```
    
    💡 正例
    
    ```bash
    http://api.example.com/v1/items/123456
    ```
    
    ✅ 結論
    
    > 盡量讓URI的延展性佳(這邊指的是/items/{id})，可以藉由輸入不同的編號，來修改URI，而不是必須    要去猜測。
    > 

5. 不會曝露伺服器架構的URI

    💀 反例
    
    ```bash
    http://api.example.com/cgi-bin/get_user.php?user=100
    ```
    
    💡 正例
    
    ```bash
    http://api.example.com/user/100
    ```
    
    ✅ 結論

    > 不要將無意義的資訊暴露出來。例如:  
    > 1. `cgi-bin`，可以猜測你可能是使用CGI的方式運行。
    > 2. `get_user.php`，可以猜測你可能是使用php進行撰寫。
    > 
6. 規則統一的URI

    💀 反例
    
    ```bash
    # 獲取好友資訊
    http://api.example.com/friends?id=100
    
    # 發送好友資訊
    http://api.example.com/friend/100/message
    ```
    
    💡 正例
    
    ```bash
    # 獲取好友資訊
    http://api.example.com/friends/100
    
    # 發送好友資訊
    http://api.example.com/friends/100/message
    ```
    
    ✅ 結論
    
    > 統一URI的設計，讓使用者易於理解。

## 2.3 HTTP方法和EndPoint

方法名稱     | 說明  |
------------|:-----:|
GET    | 獲取資源 |
POST       | 新增資源 |
PUT       | 更新已有資源 |
DELETE       | 刪除資源 |
PATCH       | 更新部分資源 |
HEAD       | 獲取資源的Metadata資訊 |

> Metedata為描述資料的資料，舉例：描述HTML5這份文件的資料。 <br>
> Metedata不會呈現在畫面上，只會給瀏覽器和搜尋引擎查看。 <br>
> https://ithelp.ithome.com.tw/articles/10237545 <br>

## 2.4 API端點的設計


目的     | EndPoint  | 方法 | 其他相同 |
------------|:-----:|:-----:|:-----:|
使用者註冊      | http://api.example.com/v1/users <br> http://api.example.com/v1/auth/sign <br> http://api.example.com/v1/auth/register | POST | 其他相同 |
登入           | http://api.example.com/v1/auth/login | POST | |
獲取自己的資訊  | http://api.example.com/v1/users/me <br> http://api.example.com/v1/auth/me | GET | |
更新自己的資訊  | http://api.example.com/v1/users/me <br> http://api.example.com/v1/auth/me | PUT | |
取得使用者資訊  | http://api.example.com/v1/users/:id <br> http://api.example.com/v1/users/{id} | GET | 搜尋使用者 |
取得使用者列表  | http://api.example.com/v1/users | GET | |
取得好友列表  | http://api.example.com/v1/users/:id/friends | GET | |
添加好友        | http://api.example.com/v1/users/:id/friends | POST | |
刪除好友        | http://api.example.com/v1/users/:id/friends/:id | DELETE | |
搜尋好友        | http://api.example.com/v1/users/:id/friends/:id | GET | |
發送消息        | http://api.example.com/v1/friends/:id/message | POST | |
取得好友的訊息        | http://api.example.com/v1/friends/:id | GET | |
編輯訊息        | http://api.example.com/v1/friends/:id | PUT | |
刪除訊息        | http://api.example.com/v1/friends/:id | DELETE | |
好友動態列表        | http://api.example.com/v1/users/:id/friends/updates | GET | |
取得特定使用者的動態訊息        | http://api.example.com/v1/users/:id/updates | GET | |
發表動態訊息        | http://api.example.com/v1/updates | POST | |
編輯動態訊息        | http://api.example.com/v1/updates/:id | PUT | |
刪除動態訊息        | http://api.example.com/v1/updates/:id | DELETE | |

 > `:id`為佔位符號

### 2.4.1 訪問資源的EndPoint設計的注意事項

1. 使用名詞的複數形式
    - `URI`表示資源的集合
    - `HTTP`方法表示一般動詞

2. 注意所用的單字<br>
    例如: `search`和`find`兩者中，該選用哪種比較好?
    
    > API一般設計採用`search`
      
    可以從👇網站查看各種API範例
    [ProgrammableWeb](https://www.programmableweb.com/)

3. 不使用空格以及需要編碼的字串<br>
    當URI裡存在無法直接使用的字串時，則需要使用到百分號編碼（英語：Percent-encoding），又稱：URL編碼（*URL encoding*）。
    例如： `%E3%81%82`。

4️. 使用連接符來連接多個單字，基本上連接字串的方式總共有三種寫法。

- S**pinal-Case寫法**

    一般稱為脊柱形命名法。
    
    ```
    http://api.example.com/v1/users/12345/profile-image
    ```

- Snake Case**寫法**

    一般稱為蛇型命名法。
    
    ```
    http://api.example.com/v1/users/12345/profile_image
    ```

- Camel Case寫法

    一般稱為駝峰命名法。
    
    ```
    http://api.example.com/v1/users/12345/profileImage
    ```
    
<aside>   

💡 這三種寫法中，網路上最推薦Spinal-Case的方法，其中一個原因是因為Google推薦使用。

</aside>

另外最好在URI中使用多個單字，例如不要使用`popular_users`，而是使用`users/popular`用路徑那樣子來劃分。

## 2.5 搜尋與查詢參數的設計

### 2.5.1 獲取資料量和獲取位置的查詢參數

當資料量很龐大的時候，例如 👇 使用者資料列表API，如果今天是FB等級的使用者，那可能有好幾億，這樣一次把所有數值吐回來是不可能達成的，因此可以採用分頁(Pagination)來處理。

```
http://api.example.com/v1/users
```

> 分頁的使用，一般可以透過SQL中`limit`和`offset`數值來產生。

- 各大服務查詢的方式
    - 資料量 使用`limit`、`count`、`per_page`
    - 資料位置 使用`page`、`offset`、`cursor`

![001](https://military-share-82c.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F2d9a6bfd-d6c2-4c99-b6ed-843469653bad%2FUntitled.png?table=block&id=158287f6-0e24-4ad3-8da3-b761bdff3043&spaceId=7cddc0b4-9d6b-472a-acd3-0cab4ea53d17&width=1590&userId=&cache=v2)

<aside>

一般來說 `per_page` 和`page`會一起出現，而`limit`和`offset`會成對出現。

</aside>

- 分頁的舉例
1頁可以容納50條紀錄，當要取第三頁(從101開始)的資料時，該怎麼撰寫呢?
```
per_page=50&page=3

limit=50&offset=100
```

<aside>

💡 一般`page`從1開始(1-based)計數，而`offset`則從0開始(0-based)計數。

</aside>

### 2.5.2 使用相對位置存在的問題
當使用`offset`或`limit`來取得指定的資料位置時，其實都是要從頭開始數第幾條，每次都要從第1條資料開始計數，因此效能較差。

- 從頭開始計數
![002](https://military-share-82c.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F4ac448fb-50c5-4c6e-91d5-9ddc8c249e69%2FUntitled.png?table=block&id=74605e3e-b17f-43a3-8d95-74de1f7a68a2&spaceId=7cddc0b4-9d6b-472a-acd3-0cab4ea53d17&width=1120&userId=&cache=v2)

- 當資料更新的頻率比較高的時候，會導致當前獲取資料出現一定的偏差。
![003](https://military-share-82c.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd5d28ba3-3a36-418a-87c4-941043ce2cc8%2FUntitled.png?table=block&id=0c282def-8acc-4d50-b940-055399e49605&spaceId=7cddc0b4-9d6b-472a-acd3-0cab4ea53d17&width=1120&userId=&cache=v2)

### 2.5.3 使用絕對位置來取得資料
可以透過指"定某個ID之前"或"某個日期之前"等條件，來解決相對應位置取得資料的問題。

例如：Twiiter的API中的`max_id`、YouTube中的`publishedBefore`。

### 2.5.4 使用參數來過濾
以下例子使用Linkedin的People Search API舉例。

```
http://api.linkedin.com/v1/people-search?first-name=Clair

http://api.linkedin.com/v1/people-search?last-name=Clair

http://api.linkedin.com/v1/people-search?school-name=Shermer&20High%20School
```

### 2.5.5 查詢參數和路徑的使用區別
到底該把參數附加在查詢參數裡面? 還是放在路徑裡呢? 可以依據下列兩點來解釋

- 是否可以表示唯一資源所需的資訊

```
http://api.example.com/v1/users/10
```

- 是否可以省略


### 分頁的額外補充

- 請求
    - `perPage` 每個頁面的大小(每個頁面的項目)
    - `page` 目前頁面的編號

```
http://api.example.com/v1/users?page=3&perPage=50
```

- 回應
    - `currentPage` 目前頁面的編號
    - `pageSize` 每個頁面的大小(每個頁面的項目)
    - `totalPages` 頁面總數量
    - `totalItems`  項目的總數量
    - `items` 目前頁面上的項目


## 關於登錄OAuth2.0 (2.6 ~ 2.10)

OAuth在API設計上是蠻重要的一環，你一定很常遇到在使用某個網頁時，他會想要你Google或是Facebook的資料，此時頁面會導向一個小視窗要你輸入Google或Facebook的帳號密碼，輸入完畢後接著就會導回原本的網頁。接著網頁就可以獲取你Google與FB的相關資訊了。這種B網頁要向你索取第三方網頁的認證工作，就是OAuth會替你處理掉。

### 2.6. [陽春認證](https://reurl.cc/KrvVoe)

上述描述的認證工作，最簡易的認證機制如下圖，使用者在客戶端透過基本的帳號與密碼向後端伺服器驗證身份。伺服器會經過一連串的驗證流程，驗證成功後透過如 Session / Cookie 機制，在客戶端保存用戶登入的狀態資訊。

![](https://i.imgur.com/h22L2dC.png)

此陽春認證大致會有幾個問題

 1. 第三方程式必須儲存 Resource Owner 的帳號密碼，通常是明文儲存。
 2. Server 必須支援密碼認證，即使密碼有天生的資訊安全上的弱點。
 3. 第三方程式會得到幾乎完整的權限，可以存取 Protected Resources ，而 Resource Owner 沒辦法限制第三方程式可以拿取 Resource 的時效，以及可以存取的範圍 (subset)。
 4. 任何第三方程式被破解 (compromized)，就會導致使用該密碼的所有資料被破解。

### 2.7 OAuth的基本認證機制

那麼OAuth在第三方認證這流程上，中間到底發生什麼事情，我們可以看下述圖意流程

![](https://i.imgur.com/ViUvehH.png)

- Step1：User點下允許訪位Facebook個人資訊認證

- Step2：第三方網頁請求認可

- Step3：User輸入帳命並告知Facebook可以把Token轉交給第三方網頁

- Step4：將Token轉交給第三方網頁

- Step5：第三方網頁帶取Token向Facebook調用索取資訊API

- Step6：Facebook Response請求給第三方網頁

上述OAuth常見的基本流程，使用OAuth方便的是，User無須再次對請求輸入帳號密碼，認證過程中會通過Facebook提供的頁面(一般常見為帳號密碼輸入或是認證許可按鈕如下圖)。

![](https://i.imgur.com/BDIm3EB.png)

如果OAuth訪問成功就可從Facebook獲取access token，通過此token，第三方網頁就可訪問Facebook用戶允許的相關訊息(public profile mail 介紹...)。

### 2.8 OAuth 2.0 的角色定義

- Resource Owner：可以授權別人去存取 Protected Resource 。如果這個角色是人類的話，則就是指使用者 (end-user)。

- Resource Server：存放 Protected Resource 的伺服器，可以根據 Access Token 來接受 Protected Resource 的請求。

- Client：代表 Resource Owner 去存取 Protected Resource 的應用程式。 “Client” 一詞並不指任何特定的實作方式（可以在 Server 上面跑、在一般電腦上跑、或是在其他的設備）。

- Authorization Server：在認證過 Resource Owner 並且 Resource Owner 許可之後，核發 Access Token 的伺服器。

### 2.9 OAuth的認證流程形式(Grant Type)

上述簡單描述OAuth基本流程，但實際的認證流程會有四種形式，推薦此篇[認識 OAuth 2.0：一次了解各角色、各類型流程的差異](https://reurl.cc/KrvVoe)。對於四種形式我覺得此篇作者整理得很淺白易懂。這邊我也會直接擷取他對於四種形式的描述來解說。

Type  | 常見應用
--------------|:-----|
Authorization Code | 有透過Server處理
Implicit | Clinet端處理 
Resource Owner Password Credentials |     |  
Client Credentials |  M2M(Machine to Machine)   |  

### 2.10 **Authorization Code**

###### 流程示意

常見類型，通常應用在SSR伺服器渲染的設計上，大部分的邏輯處理程式碼以極機密都會保存在Server。

![](https://i.imgur.com/m2Ednsg.png)

###### 詳細流程


(1) Authorization Request

【Client】GET -> 【Authorization Endpoint】

第一步是 Client 產生一個 URL 連到 Authorization Endpoint ，要 Resource Owner 打開（點擊）這個 URL ，從而產生「向 Authorization Endpoint 發送 GET request」的操作。

把參數包在 URI 的 query components 裡面。

參數名  | 填什麼/意義
--------------|:-----|
response_type | code
client_id | 自己的 Client ID 
state |    內部狀態 |  
redirect_uri | 申請結果下來之後要轉址去哪裡   | 
scope |  申請的存取範圍   |  

```
GET /authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz
    &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
Host: server.example.com
```

---

(4) Authorization Response

【Authorization Endpoint】 302 Response ->  GET 【Client: Redirection Endpoint】

Resource Owner 若同意授權，這個「同意授權」的 request 會往 Authorization Endpoint 發送，接著會收到 302 的轉址 response ，裡面帶有「前往 Client 的 Redirection Endpoint 的 URL」的轉址 (Location header)，從而產生「向 Redirection URI 發送 GET Request」的操作。


參數名  | 填什麼/意義
--------------|:-----|
code | Authorization Code
state | 原內部狀態 

```
HTTP/1.1 302 Found
Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA
          &state=xyz
```

 - state 如果 (1) 的時候有附上，則 Resopnse 裡面必須有，完全一致的原值。如果原本就沒有，就不需要回傳。

 - Authorization Code：

    - 必須是短時效的，建議最長 10 分鐘。
    - Client 只能使用一次，如果重複使用，Authorization Server 必須拒絕，並且建議撤銷之前透過這個 Grant 核發過的 Tokens
    - 要綁定 Code ↔ Client ID ↔ Redirection URI 的關係
    - 長度由 Authorization Server 定義，應寫在文件中， Client 不可以瞎猜。

---

(5) Access Token Request

【Client】POST -> 【Token Endpoint】

參數名  | 填什麼/意義
--------------|:-----|
grant_type | Authorization Code
code | 在 (4) 拿到的 Authorization Code 
redirect_uri | 如果 (A) 有提供，則必須提供一模一樣的。
client_id | 	自己的 Client ID


###### Authorization Server 的處理程序

 - 要求 Client 認證自己（如果是 Confidential Client 或有拿到 Client Credentials）
 - 如果 Client 有出示認證資料，就認證它
 - 確定 Authorization Code 是發給 Client 的
    - Confidential: 用 Client 的認證過程來證明
    - Public: 用 Client ID 來證明
 - 驗證 Authorization Code 正確
 - 如果 (1) 有給 Redirection URI 的話，確定這次給的 Redirection URI 與 (1) 時的一模一樣。

```
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
```

(5) Access Token Response

【Client】 <- 【Token Endpoint】

若 Access Token Request 合法且有經過授權，則核發 Access Token，同時可以核發 Refresh Token （非必備）。如果 Client 認證失敗，或 Request 不合法，則依照 [RFC 6749 Section 5.2](https://datatracker.ietf.org/doc/html/rfc6749) 的規定回覆錯誤。

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "access_token":"2YotnFZFEjr1zCsicMWpAA",
  "token_type":"example",
  "expires_in":3600,
  "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
  "example_parameter":"example_value"
}
```

##### **Implicit**


###### 流程示意

通常應用在SPA設計，整個應用程式都在前端運行，依需求向後端 API 取得資料。由於整個應用程式都在前端運行，所以會缺少「後端伺服器透過 Authorization Code Grant 交換 Access Token 」的步驟。取而代之的是請 Authorization Server 直接核發 Access Token。


這邊要注意最終應用程式就能拿著 Access Token 向 Resource Server 取得資料。特別留意：不像 Authorization Code Flow，這邊是由前端獲得與管理 Access Token，並帶著 Access Token 發出請求前往取得資源，因此在安全性上「相對脆弱」。

![](https://i.imgur.com/UMvZKO9.png)

###### 詳細流程

(1) Authorization Request

【Client】GET ->【Authorization Endpoint】

第一步是 Client 產生一個 URL 連到 Authorization Endpoint ，要 Resource Owner 打開（點擊）這個 URL ，從而產生「向 Authorization Endpoint 發送 GET request」的操作。

把參數包在 URI 的 query component 裡面。

參數名  | 填什麼/意義
--------------|:-----|
response_type | code
client_id | 自己的 Client ID 
state |    內部狀態 |  
redirect_uri | 申請結果下來之後要轉址去哪裡   | 
scope |  申請的存取範圍   |  

###### Authorization Server 的處理程序

因為 Implicit Grant Flow 是直接在 Authorization Endpoint 發 Access Token ，所以資料驗證和授權都在這一步處理。所以這個 Request 進來的時候， Authorization Server 要做這些事：

驗證所有必須給的參數都有給且合法

Redirection URI 與預先在 Authorization Server 設定的相符。
如果沒問題，就詢問 Resource Owner 是否授權，即 (B) 步驟

(4) Authorization Response

【Client】 <- 302【Authorization Endpoint】

Resource Owner 若同意授權，這個「同意授權」的 request 會往 Authorization Endpoint 發送，接著會收到 302 的轉址 response ，裡面帶有「前往 Client 的 Redirection Endpoint 的 URL」的轉址 (Location header)，從而產生「向 Redirection URI 發送 GET Request」的操作。

參數要用 URL Encoding 編起來，放在 Fragment Component 裡面。

若 Access Token Request 合法且有經過授權，則核發 Access Token。如果 Client 認證失敗，或 Request 不合法，則依照 Section 5.2 的規定回覆錯誤。

特別注意 Implicit Grant Type 禁止 核發 Refresh Token。

某些 User-Agent 不支援 Fragment Redirection ，這種情況可以使用間接轉址，即是轉到一個頁面，放一個 “Continue” 的按鈕，按下去連到真正的 Redirection URI 。


參數名	|填什麼/意義
--------------|:-----|
access_token	|	即 Access Token
expires_in	| 建議有	幾秒過期，如 3600 表示 10 分鐘。若要省略，最好在文件裡註明效期。
scope	|	Access Token 的授權範圍 (scopes)。
state	|	原內部狀態。

其中 scope 如果和 (1) 申請的不同則要附上，如果一樣的話就不必附上。

其中 state 如果 (1) 的時候有附上，則 Resopnse 裡面必須有，完全一致的原值。如果原本就沒有，就不需要回傳。

Access Token 的長度由 Authorization Server 定義，應寫在文件中， Client 不可以瞎猜。

Client 遇到不認識的參數必須忽略。

```
HTTP/1.1 302 Found
Location: http://example.com/cb#access_token=2YotnFZFEjr1zCsicMWpAA
          &state=xyz&token_type=example&expires_in=3600
```

##### **Resource Owner Password Credentials**

###### 流程示意

由使用者提供帳號與密碼等資訊給應用程式，由應用程式直接向 Authorization Server 交換 Access Token，因此「必須是使用者高度信賴的應用程式」才適合使用，且唯有前兩種皆不可行時，才會考慮使用當前類型的流程。

體驗上和以往的帳號密碼登入雷同。

![](https://i.imgur.com/N9DUpEB.png)


###### 流程細節


(2,3) Authorization Request & Response

在這個流程裡面， Authorization Grant 就是 Resource Owner 的帳號密碼，所以在 Step (A) 裡面直接向 Resource Onwer 索取，沒有經過網路來取得 Authorization。

Spec 不規定 Client 要怎麼拿到帳號密碼，但是 Client 取得 Access Token 之後，必須把 Resource Owner 的帳號密碼給銷毀掉。

(4) Access Token Request

【Client】POST -> 【Token Endpoint】

參數名	|填什麼/意義
--------------|:-----|
grant_type	|	password
username	| Resource Owner 的帳號
password	| Resource Owner 的密碼
scope	|	申請的存取範圍

###### Authorization Server 的處理程序

這個 Request 進來的時候， Authorization Server 要做這些事：

要求 Client 認證自己（如果是 Confidential Client 或有拿到 Client Credentials）

如果 Client 有出示認證資料，就認證它

##### **Client Credentials**

###### 流程示意

通常是由應用程式向 Authourization Server 請求取得 Access Token 以獲取「自己」的相關資源，而非使用者的資源。

這個流程已經跳脫使用者，因此，使用者身份驗證的流程將不再需要。取而代之的，是應用程式必須向 Authorization Server 提供驗證所需的自身資訊。

![](https://i.imgur.com/uPeIjN5.png)

###### 流程細節

(1) Access Token Request

【Client】POST -> 【Token Endpoint】

參數名	|填什麼/意義
--------------|:-----|
grant_type	|	password
scope	|	申請的存取範圍

```
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
```
 
 (2) Access Token Response

【Client】POST <- 【Token Endpoint】

若 Access Token Request 合法且有經過授權，則核發 Access Token，但是最好不要核發 Refresh Token。如果 Client 認證失敗，或 Request 不合法，則依照的[RFC6749規定(Section5.2)](https://datatracker.ietf.org/doc/html/rfc6749)回覆錯誤。


```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "access_token":"2YotnFZFEjr1zCsicMWpAA",
  "token_type":"example",
  "expires_in":3600,
  "example_parameter":"example_value"
}
```

#### 簡易整理

![](https://i.imgur.com/4cIcic1.png)


#### d.OAuth端點範例

上述探討完四種認證流程形式，那實際使用OAuth時，端點的形式該如何設計?下述為常見的幾個有名的網站

![](https://i.imgur.com/1pHhAR6.png)

書中筆者比較建議的方式是像`/oauth2/token`此種方式去設計，因為明確指出使用的是OAuth2.0，並且與RFC 6749給出的範例雷同。

我們稍微看一下實際medium在索取facebook認證資訊時的內容如下圖，基本上也是照這邏輯下去設計

![](https://i.imgur.com/0LUwjmj.png)



[OAuth2.0](https://datatracker.ietf.org/doc/html/rfc6749)

[OAuth 2.0 筆記](https://blog.yorkxin.org/posts/oauth2-1-introduction.html)
