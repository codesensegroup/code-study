---
title: "第6章 開發牢固的WebAPI"
pageTitle: "第6章 開發牢固的WebAPI"
contributors: ['BackPOPO']
---
  

## 6.5 同安全相關的 HTTP Header

> ***當使用者通過瀏覽器發送request到伺服器上，伺服器會回應response給瀏覽器，此時就會帶上一些header，其中有些header可以保證網站安全。***
> 
> 
> 
<br>

### **6.5.1 X-Content-Type-Options [連結](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Content-Type-Options)**
> <br>
>
> IE系列：
> 
> - IE8 ━ ：無效(自帶Content Sniffing)
> - IE8 ✚：可用
>
> **`避免Client執行不正常的 Content-Type 類型檔案。`**
> 
> 
> 該標頭`告訴瀏覽器不要猜測所提供內容的MIME`（多用途Internet郵件擴展名）類型，而是信任" Content-Type"標頭。如果沒有設定：`X-Content-Type-Options`標頭，則某些較舊的瀏覽器可能會錯誤地將文件檢測為 Script 或 CSS Style，從而可能導致XSS攻擊。
> 
> <BR>
>
> **`推薦設定：`**
>
> ```
> X-Content-Type-Options：nosniff 
>
> 阻止瀏覽器探知檔案的 mime type ( disable Content sniffing )，一般情況下瀏覽器會去探知資源的 Content-Type ，以判別資源類型。
>
> 例如：image/png、text/css，而有些資源的 Content-Type 有可能是錯誤或缺少的，此時就會進行 Content sniffing猜測解析內容，將 X-Content-Type-Options 設成 nosniff，可阻止這種行為。
>
> 沒有設成 nosniff 的風險為攻擊者可能使用錯誤的 header 隱藏攻擊的 script ，例如 <script src=”https://example.com/attacker.txt" ></script>，attacker.txt 實際是 js 檔，表面的 header 是 text/plain ，實際上瀏覽器會解析 scrip t的content type ，並且執行 script。
> ```
> <br>

> - **`什麼是 content sniffing：`** 一般來說瀏覽器會透過 Content-Type 來判斷請求到的資源是什麼類型，像透過 `<script src="script.js">` 拿到的 Content-Type 一般都是 `text/javascript`，因此瀏覽器看到之後就會拿來執行。但有些網站（尤其是十幾二十年前的舊網站）在開發時並沒有把 Content-Type 設好，導致某些 JS 檔的 Content-Type 是 `text/plain`，也就是純文字檔。為了讓這些網站可以順利運作，**瀏覽器除了參考 Content-Type 之外，也會做 content sniffing 從檔案內容分析是什麼類型**，如果分析出是 JS 那就會拿去執行，這樣舊網站才不會壞掉。
> - **`sniffing 這個動作看似貼心，卻也是一個弱點：`** 譬如說有些網站允許使用者上傳檔案，那**`攻擊者就可以惡意上傳一些有 JS 特徵的 JPG 檔（這些圖片會被瀏覽器判斷成腳本）**。`接著想辦法讓這張圖片被載入到前端來，導致裡面的惡意腳本被執行，`造成 XSS 攻擊。`
>
> ![Untitled](images/web-api/06/065/Untitled.png)
>
> <br>
>
<br>

### **6.5.2 X-XSS-Protection [連結](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-XSS-Protection)**
> <br>
>
> IE系列：
> 
> - IE8 ━ ：無效
> - IE8 ✚：可用(可停用)
> **`瀏覽器檢測到 XSS Script 攻擊，即停止執行頁面載入。`**
> 
> 可搭配設置 Content-Security-Policy 來禁用 Corss Javascript。
>
> 現代多數瀏覽器不太需要這項保護，但對於不支援 CSP 的舊版瀏覽器的用戶提供保護。
> 
> ```
> X-XSS-Protection: 0
> 	禁止XSS过滤。
> 
> X-XSS-Protection: 1 
> 	啟用XSS過濾（通常瀏覽器是預設的）。如果檢測到跨站腳本攻擊，瀏覽器將清除頁面（刪除不安全的部分）。
> 
> X-XSS-Protection: 1; mode=block
> 	啟用XSS過濾。如果檢測到攻擊，瀏覽器將不會清除頁面，而是阻止頁面載入。
> 
> X-XSS-Protection: 1; report=<reporting-uri> 
> 	啟用XSS過濾。如果檢測到跨站腳本攻擊，瀏覽器將清除頁面並使用CSP report-uri指令的功能發送違規報告。
> ```
> 
> <BR>
>
> **`推薦設定：`**
>
> ```
> X-XSS-Protection: 1; mode=block
> 啟用XSS過濾。如果檢測到攻擊，瀏覽器將不會清除頁面，而是阻止頁面載入。
> ```
>
> <br>
>
<br>

### **6.5.3 X-Frame-Options [連結](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Headers/X-Frame-Options)**
> <br>
>
> IE系列：
> 
> - IE8 ━ ：無
> - IE8 ✚：這個 HTTP response header 在 2009 年時首先由 IE8 實作，接著其他瀏覽器才跟上，在 2013 年時才變成了完整的 [RFC7034](https://www.rfc-editor.org/rfc/rfc7034.txt)。
>
> **允許或禁止網頁載入 `<frame>` 與 `<iframe>`。**
> 
> 
> **副作用是其他正常的網站，也無法在 frame 中顯示被禁用 frame 的網頁。**
> 
> **`X-Frame-Options` 最前面的 `X` 說明了它比較像是一個過渡時期的東西，在未來新的瀏覽器當中，它的功能會被 CSP（Content Security Policy）給取代，並且把上面提到的問題解決。**
> 
> ```
> X-Frame-Options: DENY
> 	拒絕任何網頁把這個網頁嵌入，包含 <iframe>, <frame>, <object>, <applet>, <embed> 這些 tag 都不行。
> 
> X-Frame-Options: SAMEORIGIN
> 	只有 same origin 的網頁可以。
> 
> X-Frame-Options: ALLOW-FROM https://example.com/
> 	只允許特定的 origin 嵌入，除此之外其他的都不行（只能放一個值不能放列表，所以如果要多個 origin，要像 CORS header 那樣在 server 動態調整輸出）。
> 
> WebAPI：可以減輕在通過Frame讀取資料導致的某些漏洞而被惡意使用。(應該也不會在Fram內讀取資料，有加有保庇。)
> ```
> 
> <BR>
>
> **`推薦設定：`**
>
> ```
> X-Frame-Options: SAMEORIGIN
> 	只有 same origin 的網頁可以。
> ```
>
> <aside>
>
> 💡 **`補充：Clickjacking 點擊劫持攻擊`**
>
>
> 點擊劫持（Clickjacking）技術又稱為 **`界面偽裝攻擊（UI redress attack）`**
是一種將惡意程式隱藏在看似正常的網頁中，並誘使使用者在不知情情況下點擊的手段。
>
>**`攻擊原理`** 
>
> 1) 使用者被誘使點擊種下惡意程式的連結時，
> 2) 該連結上其實覆蓋了一個隱藏的 `<iframe>`，
> 3) 點擊該連結時，實際上是點選了隱藏的 `<iframe>`，
> 4) 如果 `<iframe>` 內容是個 facebook 的「讚」按鈕，
> 5) 用戶點到連結時，實際上是操作的是 facebook 的介面。如 Twitter、Facebook 和 Paypal 等網站上，都曾經發生過此種攻擊。
>
>**`會偽裝連結使受害者點擊惡意連結`**
>
> `CSS z-index 屬性`：在 CSS 當中 z-index 的數字越大，表示越上層，受害者插入 `<iframe>` 或其他 HTML 的時候，可以調整標籤的「透明度」、「z-index」，可以設定為透明且最上層，使受害者可以點擊。
>
>
> ![Untitled](images/web-api/06/065/Untitled%201.png)
>
>
> ![Untitled](images/web-api/06/065/Untitled%202.png)
>
>
> [不識廬山真面目：Clickjacking 點擊劫持攻擊 (cymetrics.io)](https://tech-blog.cymetrics.io/posts/huli/clickjacking-intro/)
>
> [Day17【Web】網路攻擊：點擊劫持 Clickjacking - iT 邦幫忙::一起幫忙解決難題，拯救 IT 人的一天 (ithome.com.tw)](https://ithelp.ithome.com.tw/articles/10276933?sc=iThelpR)
>
> </aside>
>
> <br>
>
<br>

### **6.5.4 Content-Security-Policy [連結](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)**
> <br>
>
> **內容安全策略 （[CSP](https://developer.mozilla.org/zh-CN/docs/Glossary/CSP)） 是一個額外的安全層，用於檢測並削弱某些特定類型的攻擊，包括跨站腳本 （[XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) ） 和數據注入攻擊等。**
無論是數據盜取、網站內容污染還是散發惡意軟體，這些攻擊都是主要的手段。
> 
>
> <aside>
> 📌 CSP 建議在 server 端加 ，雖然前端可以利用 `meta http-equiv`
> 給瀏覽器一些額外資訊， 但所有文件還是 prefer 在 Server 那邊加 HTTP header
>
> </aside>
>
> <BR>
>
> **`推薦設定：`**
>
> ```
> Content-Security-Policy: default-src larry.com
>	限制瀏覽器只能從 larry.com 這個網域載入圖片、CSS、字體等等各種資源
>
> WebAPI：Content-Secuity-Policy: default-src 'none'
>	告知瀏覽器不要讀取其他資源**
> ```
>
> ![Untitled](images/web-api/06/065/Untitled%203.png)
>
>
> <aside>
> 💡 補充：
>
> [簡單弄懂同源政策 (Same Origin Policy) 與跨網域 (CORS)](https://medium.com/starbugs/%E5%BC%84%E6%87%82%E5%90%8C%E6%BA%90%E6%94%BF%E7%AD%96-same-origin-policy-%E8%88%87%E8%B7%A8%E7%B6%B2%E5%9F%9F-cors-e2e5c1a53a19)
>
>
> [Content Security Policy (CSP) — 幫你網站列白名單吧](https://medium.com/hannah-lin/content-security-policy-csp-%E5%B9%AB%E4%BD%A0%E7%B6%B2%E7%AB%99%E5%88%97%E7%99%BD%E5%90%8D%E5%96%AE%E5%90%A7-df38c990f63c)
>
>
> [Day11-記得要戴安全帽（一）](https://ithelp.ithome.com.tw/articles/10272394)
>
> </aside>
>
> <br>
<br>


### **6.5.5 Strict-Transport-Security [連結](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Strict-Transport-Security)**
> <br>
>
> **全名是 HTTP Strict Transport Security。**
> **強制瀏覽器只能使用安全的 HTTPS 協定跟網站進行連線，而不能使用 HTTP。**
>
> 譬如說很多網站其實用 HTTP 跟 HTTPS 都連得上，但考量到安全性，當然是希望使用者都走 HTTPS。這時只要在 header 裡加上 `Strict-Transport-Security: max-age=31536000; includeSubDomains`，那在往後的 31536000 秒內（其實就是一年啦XD），只要使用者的瀏覽器看到這個網域或他的子網域，就會全部改成用 HTTPS 進行連線，真的是很方便呢。
> 
>
> ![Untitled](images/web-api/06/065/Untitled%204.png)
>
> <aside>
> 📌 只有在 HTTPS 有效
> </aside>
>
> <br>
<br>

### **6.5.6 Public-Key-Pins [連結](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Public-Key-Pins) `已棄用`**
> <br>
>
> `不再建議使用此功能。雖然某些瀏覽器可能仍然支援它，但它可能已經從相關的Web標準中刪除，可能正在被刪除，或者可能只是為了相容目的而保留。避免使用它，並盡可能更新現有代碼;請參閱此頁面底部的[相容性表](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Public-Key-Pins#browser_compatibility)，以指導您的決定。請注意，此功能可能隨時停止工作。`
> 
> **用於將特定加密公[鑰](https://developer.mozilla.org/en-US/docs/Glossary/Key)與某個 Web 伺服器相關聯，以降低使用偽造證書進行 [MITM](https://developer.mozilla.org/en-US/docs/Glossary/MitM) 攻擊的風險。但是，它已從現代瀏覽器中刪除，不再支援。**
> 
> <BR>
>
> **`推薦設定：`**
>
> <aside>
> 📌 Certificate Transparency
> </aside>
>
> <aside>
> 📌 Expect-CT
> </aside>
>
> <br>
<br>

### **6.5.7 Set-Cookie [連結](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)**
> <br>
>
> **`從後端設置`**：使用後端語言設置 cookie，通過 response 的 Set-Cookie header，瀏覽器會根據 Set-Cookie 儲存 cookie
>
> **`從前端 javascript 設置`**：如：document.cookie = “name=John;”。
> 
> 
> ### **cookie原理 [連結](https://juejin.cn/post/6959830432519520292)**
> 
> <aside>
> 📌 Cookie（也叫HTTP cookie，web cookie）是保存在瀏覽器中的一小塊數據（不超過4K）。 HTTP協定是無狀態的，因此cookie最初被設計來幫助網站保存一些狀態資訊，或者使用者的一些操作歷史。 比如基於cookie實現的前端購物車（現在通常會用local storage來替代cookie），或者結合session來實現使用者登錄狀態，亦或者是保留使用者在網站上填寫的表單資訊方便下次輸入。
> 
> </aside>
> 
> ![Untitled](images/web-api/06/065/Untitled%205.png)
> 
> ### 同源策略
> 
> cookie常常被用於存儲使用者的私有資訊，所以為了保證隱私安全，防止cookie資訊被盜取，瀏覽器施行了同源政策。 只有當各個網路訪問滿足同源策略時，才允許共用cookie資訊。 所謂的「同源」指的是：
> 
> - 協定相同
> - 功能變數名稱相同
> - 埠相同
> 
> ```
> http:// www.test.com :80/xxxxxx
> ------- ------------ ---
>     |         |       |
>    協議      域名     端口**
> ```
> 
> 只有當這三者相同時，瀏覽器才認為是符合同源策略的。 而基於cookie的網路攻擊則是通過繞過各種辦法繞過同源策略來實施攻擊，比如XSS、CSRF攻擊。
> 
> ### **cookie帶來的安全問題**
> 
> - **網路竊聽（中間人攻擊）**
> 
> ![Untitled](images/web-api/06/065/Untitled%206.png)
> 
> - **DNS緩存中毒**
> 
> ![Untitled](images/web-api/06/065/Untitled%207.png)
> 
> - **斷續器 - cookie盜用**
> 
> ![Untitled](images/web-api/06/065/Untitled%208.png)
> 
> - **斷續器 - 代理請求**
> 
> ![Untitled](images/web-api/06/065/Untitled%209.png)
> 
>
> ```
> Cookie flag：
> 	Expires：設定一個日期，到日期時就會自動失效。
> 	Max-Age：設定秒數，秒數過後自動失效，比Expires優先度高。
> 	Domain：設定作用網域，設定之後會包含子網域，若無設定則默認當前網域，不包含子網域。
> 	Path：設定作用路徑，設定/admin將匹配/admin/users,/admin/roles等路徑。
> 	Secure：只能使用https傳到伺服器。
> 	HttpOnly：只能經由伺服器存取cookie，不能經由document.cookie。
> 	SameSite：Lax: default 值，在不同網域時不會發送，但在其他網域導向原本網域時會發送。
> 	Strict: 只能在同網域下傳送。
> 	None: 可以跨域發送，但必須有Secure flag。
> ```
> 
> <br>
>
> **`推薦設定：`**
>
> ```
> Cookie flag：
> 	**Expires：設定一個日期，到日期時就會自動失效。
> 	Max-Age：設定秒數，秒數過後自動失效，比Expires優先度高。
> 	Domain：設定作用網域，設定之後會包含子網域，若無設定則默認當前網域，不包含子網域。
> 	Path：設定作用路徑，設定/admin將匹配/admin/users,/admin/roles等路徑。
> 	Secure：只能使用https傳到伺服器。
> 	HttpOnly：只能經由伺服器存取cookie，不能經由document.cookie。
> 	SameSite：Lax: default 值，在不同網域時不會發送，但在其他網域導向原本網域時會發送。**
> 	Strict: 只能在同網域下傳送。
> 	None: 可以跨域發送，但必須有Secure flag。
> ```
> 
> <aside>
> 💡補充：
> 
> [資安議題 — Cookie 安全. 前言 | by LSZ | 程式愛好者 | Medium](https://medium.com/%E7%A8%8B%E5%BC%8F%E6%84%9B%E5%A5%BD%E8%80%85/%E8%B3%87%E5%AE%89%E8%AD%B0%E9%A1%8C-cookie%E5%AE%89%E5%85%A8-a04337ec128)
> 
> [Cookie 的安全隱患 - iT 邦幫忙::一起幫忙解決難題，拯救 IT 人的一天 (ithome.com.tw)](https://ithelp.ithome.com.tw/articles/10218811)
> 
> </aside>
> 
> ![Untitled](images/web-api/06/065/Untitled%2010.png)
> 
> ![Untitled](images/web-api/06/065/Untitled%2011.png)
> 
> ![Untitled](images/web-api/06/065/Untitled%2012.png)
> 
> [資安議題 — Http Security Header. 當使用者通過瀏覽器發送request到伺服器上，伺服器會回應response給瀏… | by LSZ | 程式愛好者 | Medium](https://medium.com/%E7%A8%8B%E5%BC%8F%E6%84%9B%E5%A5%BD%E8%80%85/%E9%97%9C%E6%96%BC%E5%AE%89%E5%85%A8%E6%80%A7%E7%9A%84header-b3b7adcb0fca)
> 
> [前端單兵基本教練 - X-Frame-Options、CSP frame-ancestors 網站內嵌限制實測-黑暗執行緒 (darkthread.net)](https://blog.darkthread.net/blog/ie-frame-ancestors/)
> 
> 
> <br>
<br>


## **6.6 應對大規模訪問的對策**
> <br>
>
> ***不僅是Web API服務，任何在網路上公開的服務都會時不時地遇到來自外部的大規模訪問。當伺服器遇到大規模訪問時，為了處理這些訪問會耗盡資源，進而無法提供服務。這時不僅是這些大規模訪問，任何人都無法和伺服器端建立連線。***
> 
> 
> <aside>
> ⚠️ **DDOS：**
> 
> [ddos 攻擊定義，防護策略與三手法| Cloudflare | Cloudflare](https://www.cloudflare.com/zh-tw/learning/ddos/what-is-a-ddos-attack/)
> 
> ![Untitled](images/web-api/06/066/Untitled.png)
> 
> [Famous DDoS Attacks | Cloudflare](https://www.cloudflare.com/zh-tw/learning/ddos/famous-ddos-attacks/)
> 
> ![Untitled](images/web-api/06/066/Untitled%201.png)
> 
> [【Security 的老生常談】又是你嗎？DDoS ?! - (discover-thefutureofwork-tw.cloud)](https://discover-thefutureofwork-tw.cloud/2021/12/25/cliches-of-ddos/)
> 
> ![Untitled](images/web-api/06/066/Untitled%202.png)
> 
> </aside>
> 
> 
> <br>
<br>

### **6.6.1 限制使用者的訪問***
> <br>
>
> - **用什麼樣的機制來識別使用者**
> - **如何確定限速的數值**
> - **以什麼單位來設置限速的數值**
> - **在什麼時候重置限速的數值**
> 
> ![Untitled](images/web-api/06/066/Untitled%203.png)
> 
> ```jsx
> Twitter
> 	對搜索推文的操作(search/tweet)：每 15 分鐘 180 次
>   對直接取得消息的操作(direct_message)：每 15 分鐘 15 次
> 
> Zendesk
> 	基本 1 分鐘內 200 次
>   不同端點，有些只允許 10 分鐘 15 次 (更新 ticket) , 或更少
> ```
> 
> 
> <br>
<br>

### **6.6.2 限速的單位**
> <br>
>
> - **上限值要根據所設想的API使用情境進行調整**
> - **要了解你所提供的API會在怎樣的情況被用戶使用，並以此為依據來決定如何設置訪問限制速。**
> 
> <aside>
> ❌ 對資料庫頻繁更新的查詢類 API ： 用戶需要頻繁地訪問API，取得最新資料。如果設定 1 小時只允許訪問 10 次這樣嚴格的限制。那麼即使使用API，也無法給應用或服務帶來更高的附加價值，API用戶數也難以增加。
> 
> </aside>
> 
> <aside>
> 📌 Etsy 服務引入"progressive rate limit"(累進限速)的限速方式，用戶訪問上限 24 小時 1 萬次
> 
> 計算：
> 24 小時 拆成 12 個單元，每個單元 2 小時，以過去 12 個單元累計訪問次數做為訪問上限。
> 即使用戶超過上限，只需要再等待 2 小時，第一個單元的訪問次數就會重置，用戶就可以再訪問。
> 
> </aside>
> 
> 
> <br>
<br>

### **6.6.3 應對超出上限值的情況**

> - **可以返回HTTP協議中備好的“429 Too Many Request”狀態碼。**
> 
> **當用戶超出訪問上限值時，服務端該如何返回響應訊息呢？這種情況下可以返回HTTP協議中備好的“429 Too Many Request”狀態碼。429狀態碼在2012年4月釋出的RFC 6585中定義，當特定使用者在一定時間內發起的請求次數過多時，伺服器端可以返回該狀態碼錶示出錯。RFC 文件中對該狀態碼描述如下：**
> 
> ![Untitled](images/web-api/06/066/Untitled%204.png)
> 
> ![Untitled](images/web-api/06/066/Untitled%205.png)
> 
> 
> <br>
<br>

### **6.6.4 向用戶告知訪問限速的信息** 

> - **用戶會一直訪問 API**
> - **用戶如果知道限速信息，就可能會針對性的編寫出自動調整訪問量的客戶端程序。**
> 
> ![Untitled](images/web-api/06/066/Untitled%206.png)
> 
> ![Untitled](images/web-api/06/066/Untitled%207.png)
> 
> ![Untitled](images/web-api/06/066/Untitled%208.png)
> 
> ![Untitled](images/web-api/06/066/Untitled%209.png)
> 
> [https://api.github.com/rate_limit](https://api.github.com/rate_limit)
> 
> ![Untitled](images/web-api/06/066/Untitled%2010.png)
> 
> ![Untitled](images/web-api/06/066/Untitled%2011.png)
> 
> ![Untitled](images/web-api/06/066/Untitled%2012.png)
> 
> ![Untitled](images/web-api/06/066/Untitled%2013.png)
> 
> ![Untitled](images/web-api/06/066/Untitled%2014.png)
> 
> ![Untitled](images/web-api/06/066/Untitled%2015.png)
> 
> 
> [Web API 的設計與開發 | 七月十五九月初七 (luisedware.github.io)](https://luisedware.github.io/2017/11/09/Web-API-%E7%9A%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%BC%80%E5%8F%91/)
> 
> <br>