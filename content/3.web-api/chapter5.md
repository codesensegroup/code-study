---
title: "第5章 開發方便更改設計的API"
pageTitle: "第5章 開發方便更改設計的API"
contributors: ['cshs108']
---

## 5.1 方便更改設計的重要性

- API必須保持公開提供串接的狀態，但是我們會需要添加新功能、廢棄某些功能
- 如果只是修改API內部邏輯，對外的數據格式不變，則不需要更新API設計規範

### 5.1.1 公開發佈的API

- LSUD(Large set of unknown developers)
    - ex.FB這類的公開API
    - 影響不特定開發者，範圍未知
    - API改版的影響程度大
    - 無法保證用戶端可以搭配API改版而重新串接，此時強制變更API會導致終端用戶、串接應用，覺得這個服務不可靠
    

### 5.1.2 面向移動應用的API

- SSKD(Small set of known develop)
    - 只有影響特定開發者，範圍可控
    - API的改版影響程度小
    - 注意不更新應用程式的刁民
    

### 5.1.3 Web服務中使用的API

- 注意快取的影響

## 5.2 透過版本訊息來管理API

- 更新API有會不等程度的影響，透過某些機制讓不更新用戶可以繼續使用舊的服務，更新後的用戶使用新的服務
    
    ![截圖 2022-01-12 下午11.43.43.png](https://spiny-backbone-80c.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F29bf5df3-10d1-4a7b-bc29-a5d707f00340%2F%E6%88%AA%E5%9C%96_2022-01-12_%E4%B8%8B%E5%8D%8811.43.43.png?table=block&id=0e1b970a-4780-46ec-98d9-fb6c780f5c3c&spaceId=5d2d13ed-dba9-47b9-be73-4ea525461379&width=2000&userId=&cache=v2)
    
- 實現的方式
    - 不同的URI
        - 舊的：http://api.example.com/user/123
        - 新的：http://newapi.example.com/user/123
        - 議題：new的命名不好，如果之後又要改版，newnewapi?
    

### 5.2.1 在URI中嵌入版本編號

- http://api.example.com/v2/user/123
- 最常見的方式，舊版本的api短時間能可繼續使用
    
    ![截圖 2022-01-12 下午11.50.22.png](https://spiny-backbone-80c.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F3225328c-044c-4b7e-9235-90d4cb26339f%2F%E6%88%AA%E5%9C%96_2022-01-12_%E4%B8%8B%E5%8D%8811.50.22.png?table=block&id=682fa534-6843-4827-afbb-4b85f5857ee3&spaceId=5d2d13ed-dba9-47b9-be73-4ea525461379&width=2000&userId=&cache=v2)
    

### 5.2.2 如何添加版本編號

- 編號規則：主版本編號、次版本編號、補丁版本編號。ex.1.0.1
- 如果只是修正BUG，則增加補丁版本編號ex.1.0.2
- 如果功能新、刪，且向下兼容，則增加次版本編號ex.1.1.1
- 如果本次修改無法向下兼容，則增加主版本編號ex.2.0.1
- 以http://api.example.com/v1/user/123來說，只使用一個版本編號，代表為主版本編號，因此當主版本編號增加時，API才進行版本升級
- 同時維護多版本的API成本相當高，也容易讓用戶混淆該用哪一個，因此小更動會盡量不去升級api版本，而是盡可能地向下相容
- 只有發生可以放棄下向相容的重大更新時才去升級api版本，因此大部分的api的網址版本編號只有主版本編號ex./v1

### 5.2.3 在查詢字串加入版本訊息

- http://api.example.com/user/123?v=1.5
- 差異：使用參數的方式代表是可以省略，如果沒有填，伺服器會直接使用默認的版本(通常是最新版本)
- 該選擇加在網址路徑還是參數？
    - 建議加在網址路徑，因為參數的方式如果省略的話，用戶其實不知道呼叫到的是哪個版本
    

### 5.2.4 透過媒體類型來指定版本訊息

- 在header加入Accept:application/api.example.v2+json
- 好處：URL可以作為純粹的資源使用

### 5.2.5 該採用什麼方法

- 最常用的是在URL的路徑中嵌入版本訊息

## 5.3 版本變更的方針

- 盡可能向下相容
- ex.原本使用gender(Int)1=男生2=女生，如果想要改為gender(String)男生、女生的方式紀錄，則建議多一個參數genderStr(String)，並把gender標示為廢棄
- 什麼時候該升級版本
    - 權限、驗證機制調整，ex.v1沒有身份驗證機制，v2有身份驗證機制，則可以廢棄v1升級到v2
    - 因為這類的調整會動到的地方太多，難達成向下相容，因此該升級版本
    

## 5.4 終止提供API

- 公告讓用戶知道該升級，舊API什麼時候結束服務，用戶可以規劃系統升級的時程
- Blackout Test：暫時一段時間不提供服務，逼迫用戶提早升級

### 5.4.2 正式停止舊API

- 回傳http status 410，同時給予錯誤訊息
- 應用服務必須針對410的錯誤提示用戶該升級系統

### 5.4.3 在使用條款中寫明支援期限

- 在X個月後，不再支援舊版api，但不是直接關閉服務
- 新的API出來的時候，同時宣布至少支援X月

## 5.5 編排層(中間層)

- ex.fb graph api，源頭端的API可以負責叫小範圍，就像是單一個積木，減少開發的複雜性
- 終端透過中間層去組裝多個積木來達成頁面的需求
- 終端可以受到API改版的影響較小，源頭端可以減少API變更的阻礙

![截圖 2022-01-13 上午12.30.21.png](https://spiny-backbone-80c.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F6006189a-1eb8-427c-95bf-9ecc11863135%2F%E6%88%AA%E5%9C%96_2022-01-13_%E4%B8%8A%E5%8D%8812.30.21.png?table=block&id=ea41ce46-1dba-4281-9890-96fb05b6c6e1&spaceId=5d2d13ed-dba9-47b9-be73-4ea525461379&width=2000&userId=&cache=v2)

## 5.6小結

- 最大限度減少API版本更新的頻率，注意向下兼容
- 在URI中嵌入API版本的主版本編號
- 停止提供API服務時不能立即中止，至少需要繼續公開六個月