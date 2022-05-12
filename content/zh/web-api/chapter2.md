---
title: '第2章 EndPoint設計與請求形式'
description: '第2章 EndPoint設計與請求形式'
position: 200
category: Web API的設計與開發
menuTitle: 'Chapter 02'
contributors: ['changemyminds', 'spyua']
---

###### tags: `BackEnd` `Web API` 


## 關於登錄OAuth2.0(2.6~2.10)

OAuth在API設計上是蠻重要的一環，你一定很常遇到在使用某個網頁時，他會想要你Google或是Facebook的資料，此時頁面會導向一個小視窗要你輸入Google或Facebook的帳號密碼，輸入完畢後接著就會導回原本的網頁。接著網頁就可以獲取你Google與FB的相關資訊了。這種B網頁要向你索取第三方網頁的認證工作，就是OAuth會替你處理掉。

### 2.6. [陽春認證](https://reurl.cc/KrvVoe)

上述描述的認證工作，最簡易的認證機制如下圖，使用者在客戶端透過基本的帳號與密碼向後端伺服器驗證身份。伺服器會經過一連串的驗證流程，驗證成功後透過如 Session / Cookie 機制，在客戶端保存用戶登入的狀態資訊。

![](https://i.imgur.com/h22L2dC.png)

此陽春認證大致會有幾個問題

 - 1.第三方程式必須儲存 Resource Owner 的帳號密碼，通常是明文儲存。
 - 2.Server 必須支援密碼認證，即使密碼有天生的資訊安全上的弱點。
 - 3.第三方程式會得到幾乎完整的權限，可以存取 Protected Resources ，而 Resource Owner 沒辦法限制第三方程式可以拿取 Resource 的時效，以及可以存取的範圍 (subset)。
 - 4.任何第三方程式被破解 (compromized)，就會導致使用該密碼的所有資料被破解。

### 2.7 OAuth的基本認證機制

那麼OAuth在第三方認證這流程上，中間到底發生什麼事情，我們可以看下述圖意流程

![](https://i.imgur.com/ViUvehH.png)

Step1: User點下允許訪位Facebook個人資訊認證

Step2: 第三方網頁請求認可

Step3: User輸入帳命並告知Facebook可以把Token轉交給第三方網頁

Step4: 將Token轉交給第三方網頁

Step5: 第三方網頁帶取Token向Facebook調用索取資訊API

Step6: Facebook Response請求給第三方網頁

上述OAuth常見的基本流程，使用OAuth方便的是，User無須再次對請求輸入帳號密碼，認證過程中會通過Facebook提供的頁面(一般常見為帳號密碼輸入或是認證許可按鈕如下圖)。

![](https://i.imgur.com/BDIm3EB.png)

如果OAuth訪問成功就可從Facebook獲取access token，通過此token，第三方網頁就可訪問Facebook用戶允許的相關訊息(public profile mail 介紹..)。

### 2.8 OAuth 2.0 的角色定義

Resource Owner - 可以授權別人去存取 Protected Resource 。如果這個角色是人類的話，則就是指使用者 (end-user)。

Resource Server - 存放 Protected Resource 的伺服器，可以根據 Access Token 來接受 Protected Resource 的請求。

Client - 代表 Resource Owner 去存取 Protected Resource 的應用程式。 “Client” 一詞並不指任何特定的實作方式（可以在 Server 上面跑、在一般電腦上跑、或是在其他的設備）。

Authorization Server - 在認證過 Resource Owner 並且 Resource Owner 許可之後，核發 Access Token 的伺服器。

### 2.9 OAuth的認證流程形式(Grant Type)

上述簡單描述OAuth基本流程，但實際的認證流程會有四種形式，推薦此篇[認識 OAuth 2.0：一次了解各角色、各類型流程的差異](https://reurl.cc/KrvVoe)。對於四種形式我覺得此篇作者整理得很淺白易懂。這邊我也會直接擷取他對於四種形式的描述來解說。

---
Type  | 常見應用
--------------|:-----|
Authorization Code | 有透過Server處理
Implicit | Clinet端處理 
Resource Owner Password Credentials |     |  
Client Credentials |  M2M(Machine to Machine)   |  

---

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

書中筆者比較建議的方式是像 /oauth2/token此種方式去設計，因為明確指出使用的是OAuth2.0，並且與RFC 6749給出的範例雷同。

我們稍微看一下實際medium在索取facebook認證資訊時的內容如下圖，基本上也是照這邏輯下去設計

![](https://i.imgur.com/0LUwjmj.png)



[OAuth2.0](https://datatracker.ietf.org/doc/html/rfc6749)

[OAuth 2.0 筆記](https://blog.yorkxin.org/posts/oauth2-1-introduction.html)