---
title: "Liquibase快速入門"
pageTitle: "Liquibase快速入門"
contributors: ["changemyminds"]
---

## 前言

此章節主要是補充CI/CD 2.0的11.7章節的內容，關於版本控制

## 常用的資料庫版本更新方式，有下列兩種

- `State-based tools`  通過比較兩個資料庫中的結構模型而產生的腳本(script)，使用此腳本進行資料庫升級。
- `Migration-based tools` 創建遷移用的腳本，替資料庫從一個版本遷移到下一個版本。

### State-based tools (基於狀態的版本控制)

<div align="center">
  <img src="images/workshop/liquibase/001.png" width="70%" />
</div>

在`state based`模式底下，我們僅需要維護資料庫的目標狀態，每個**表(Table)**、**Stored Procedure**、**View**、**Trigger**將保存為單獨的SQL文件，這些SQL文件就是資料庫真實的樣貌。而升級資料庫所需的腳本會由工具自動生成，從而大大減輕維護成本。
> 可以想像成MySQL中的mysqldump所建立的DDL表結構語法。

在`IaC(Infrastructure-as-Code)`領域中，Kubernetes、HashiCorp Terraform等流行軟體皆採用這種方式。

<aside>

    💡 目前最流行的做法是推薦此方式，但此方法會有缺點，由於Script是系統產生的，因此還是得自行注意細節。

</aside>

### Migration-based tools (基於遷移的版本控制)

<div align="center">
  <img src="images/workshop/liquibase/002.png" width="70%" />
</div>

基於遷移的方法是將所有的遷移腳本儲存在Repository中。每一個腳本都包含了一系列的DDL語句，例如: CREATE/ALTER/DROP TABLE。最終的資料庫中的資料表結構是由這些腳本按照順序的執行來完成的。

相比`state based`模式，該模式增加了成本的**維護**和**複雜性**，但它能讓我們更直接地控制**遷移過程**，從而能夠處理如資料庫遷移這樣上下文相關的場景。

## Database Version Control Tools

本圖片的來源資料，是參考[網址](https://dbmstools.com/categories/version-control-tools)

<div align="center">
  <img src="images/workshop/liquibase/003.png" width="100%" />
</div>

## Liquibase快速入門

### 安裝CLI

Liquibase版本，我們將採用4.15.0版本進行演示，記得必須要安裝Java 8以上(官方建議Java 11)。

#### Win10

1. 前往[官網載點](https://www.liquibase.org/download?_ga=2.168149096.812788205.1662033186-1359190506.1661672342)或[Github Release](https://github.com/liquibase/liquibase/releases)依照對應所需的版本進行安裝，我們使用zip檔進行安裝

    <div align="center">
      <img src="images/workshop/liquibase/004.png" width="50%" />
    </div>

2. 下載後進行解壓縮放到指定的路徑底下，將liquibase放置在`D:\tool\liquibase-4.15.0`路徑

    <div align="center">
      <img src="images/workshop/liquibase/005.png" width="100%" />
    </div>

3. 設定系統環境變數，添加`D:\tool\liquibase-4.15.0`路徑

4. 測試指令，重新開啟Terminal，並輸入指令liquibase -v

    <div align="center">
      <img src="images/workshop/liquibase/006.png" width="100%" />
    </div>

#### Docker

```bash
# 下載image liquibase 4.15.0
docker pull liquibase/liquibase:4.15.0

# 查看liquibase版本，測試是否安裝成工
docker run --rm liquibase/liquibase:4.15.0 -v
```

#### 初始化liquibase

```bash
# 初始化專案
liquibase init project

# 查看初始化後的結果
ls
## example-changelog.sql  liquibase.properties
```

### 安裝Package Manager

Liquibase提供預設Driver在`internal\lib`底下，但某些適合的資料庫Driver還是沒有提供，因此我們可以使用`Liquibase Package Manager`來幫助我們快速的搜尋套件來完成。

> 更多的Liquibase Driver，參考[網址](https://raw.githubusercontent.com/liquibase/liquibase-package-manager/master/internal/app/packages.json)

#### 安裝

1. 前往[Github Release](https://github.com/liquibase/liquibase-package-manager/releases)進行下載，點選對應的OS進行下載，這邊採用Win10進行舉例。

2. 下載完成後解壓縮，設定環境變數 → 系統變數 → Path → 編輯環境變數 → 加上`D:\tool\lpm-0.1.7-windows` → 重啟終端機(Terminal)

#### 常用指令

```bash
# 查看目前可以使用的lib
lpm update

# 查看套件版本
lpm -v

# 搜尋套件mongodb名稱
lpm search mongodb

# 將mongodb加入到套件中
lpm add -g mongodb
lpm add -g liquibase-mongodb

# 查看目前加入的套件
lpm list
```

💡 指令`lpm add`的參數`-g`說明 <br>

- 使用global會將套件安裝到lib資料夾中，此資料夾為liquibase預設的lib資料夾
- 沒使用global則會安裝到liquibase_libs底下，必須再額外執行`JAVA_OPTS`來設定Java環境

### 執行方式

一般liquibase的執行有兩種方式，分別為

- 完全的CLI指令，不需要透過`liquibase.properties`設定
- 使用CLI指令搭配`liquibase.properties`設定檔

### 常用命令

```bash

# 初始化liquibase
liquibase init project

# 產生changelog並把log等級debug寫入到error.log
liquibase --log-level=debug --logFile=error.log generateChangeLog

# liquibase更新資料庫
liquibase update

# liquibase更新資料庫，並且指定某個shopping_cart
liquibase --labels="feature/shopping_cart" update

# liquibase更新資料庫，指定dev環境上版本
liquibase --log-level=debug --contexts="dev" update

# 替目前最後一筆DATABASECHANGELOG，進行tag上版本
liquibase tag version_1.3

# 將所有指定的資料庫中的所有資料表丟棄 (包含非liquibase創建)
liquibase drop-all

# 往回退回一個changeset版本
liquibase rollbackCount 1

# 退回到version_1.3的tag版本
liquibase rollback version_1.3

# 查看changeset的列表
liquibase status --verbose

# 驗證dbchangelog.xml的格式是否正確
liquibase validate
```

### 從現有資料庫產生ChangeLog

```bash
# 從現有資料庫產生ChangeLog
liquibase --driver=com.microsoft.sqlserver.jdbc.SQLServerDriver \
  --classpath=D:/tool/liquibase-4.15.0/internal/lib/mssql-jdbc.jar \
  --url=jdbc:sqlserver://127.0.0.1:1433;database=Test_Liquibase_Demo;trustServerCertificate=true; \
  --changeLogFile=dbchangelog-test.xml \
  --username=test \
  --password=12345678 \
  generateChangeLog

# 查看產生的結果
ls
##dbchangelog-test.xml
```

### Migration-based

傳統的Migration方式，藉由Script版本來進行控制。

#### 前置作業

請先在SQL Serer中建立`Test_Liquibase_Demo`資料庫。

#### 新增資料

1. 修改`liquibase.properties`

    ```yaml
    classpath=D:/tool/liquibase-4.15.0/internal/lib/mssql-jdbc.jar
    driver=com.microsoft.sqlserver.jdbc.SQLServerDriver
    url=jdbc:sqlserver://127.0.0.1:1433;database=Test_Liquibase_Demo;trustServerCertificate=true;
    username=test
    password=12345678
    changeLogFile=dbchangelog.xml
    liquibase.hub.mode=off
    ```

2. 初始化ChangeLog(產生dbchangelog.xml)

    ```bash
    # 初始化，將錯誤訊息，塞入到error.log中
    liquibase --log-level=debug --logFile=error.log generateChangeLog          
    ```

3. 新增`DbChangeLog_V1.0.sql`

    ```sql
    --liquibase formatted sql
    --changeset changemyminds:00001 labels:first-time
    --comment Create Users table
    CREATE TABLE Users (
        -- 使用者編號
        ID INTEGER NOT NULL IDENTITY NOT FOR REPLICATION,
        -- 使用者姓名
        Username NVARCHAR (50) NOT NULL,
        -- 使用者密碼
        Password NVARCHAR (50) NOT NULL,
        -- 使用者狀態
        Status INTEGER NOT NULL,
    );
    --rollback DELETE FROM Users;

    --changeset changemyminds:00002 labels:first-time
    --comment Insert default users
    INSERT INTO
        Users (Username, Password, Status)
    VALUES
        ('Darren', '11111111', 1),
        ('spyua', '11111111', 1),
        ('Jimpo', '11111111', 1),
        ('frank', '11111111', 1);
    --rollback DELETE FROM Users WHERE Username='Darren' OR Username='spyua OR Username='Jimpo OR Username='frank'    
    ```

4. 新增`DbChangeLog_V1.1.sql`

    ```sql
    --liquibase formatted sql
    --changeset changemyminds:00003 labels:feature/shopping_cart
    --comment Create table SHOES
    CREATE TABLE SHOES(
     [ID] [bigint] IDENTITY(1, 1) NOT NULL PRIMARY KEY,
     Brand VARCHAR(50),
     Size bigint, 
    );
    --rollback DROP TABLE SHOES
    
    --changeset changemyminds:00004 labels:feature/shopping_cart
    --comment Insert shoes record
    INSERT INTO SHOES(Brand, Size) VALUES('Addias', 100);
    INSERT INTO SHOES(Brand, Size) VALUES('NewBlance', 400);
    --rollback DELETE FROM SHOES WHERE Brand='Addias' OR Brand='NewBlance'
    ```

5. 修改`dbchangelog.xml`

    ```xml
    <?xml version="1.1" encoding="UTF-8" standalone="no"?>
    <databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext"     xmlns:pro="http://www.liquibase.org/xml/ns/pro" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.    liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd http://www.liquibase.org/xml/ns/pro     http://www.liquibase.org/xml/ns/pro/liquibase-pro-latest.xsd http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/    dbchangelog/dbchangelog-latest.xsd">
        <include file="DbChangeLog_V1.0.sql" />
        <include file="DbChangeLog_V1.1.sql" />
        <!-- 新增Tag版本 -->
        <changeSet id="tag_1.2" author="changemyminds">
            <tagDatabase tag="version_1.2" />
        </changeSet>
    
    </databaseChangeLog>
    ```

#### 常見操作

```bash
# 執行first-time標籤，進行migration
liquibase --log-level=debug --labels="first-time" update

# 執行全部的migration
liquibase --log-level=debug update

# 執行rollback
liquibase rollbackCount 1

# 將所有指定的資料庫中的所有資料表丟棄 (包含非liquibase創建)
liquibase drop-all
```

### State-based

某些情況下我們想要比較Database的版本，例如: 測試機的`Schema`和正式機的`Schema`中的差異，然後自動產生正式機可以使用SQL Script來讓我進行操作。

我們需要利用`diff`、`diffChangeLog`、`updateSQL`、`futureRollbackSQL`來完成。

<alert>

使用`State-based`方式，由於產生的腳本(script)是由`Liquibase`進行產生的，因此可能會有差異，建議還是要檢查，若沒有安全感的話，建議還是使用`Migration-based`比較可以自己掌控。

</alert>

#### 前置作業

請先在SQL Serer中建立`Test_Liquibase_Demo_Prod`資料庫。

#### 執行操作

1. 新增`liquibase.properties`

    ```yaml
    # 連線的驅動driver
    classpath=D:/tool/liquibase-4.15.0/internal/lib/mssql-jdbc.jar
    driver=com.microsoft.sqlserver.jdbc.SQLServerDriver
    
    # 產生的檔案
    changeLogFile=dbchangelog.xml
    
    # 關閉hub
    liquibase.hub.mode=off
    
    # 正式機資料庫
    url=jdbc:sqlserver://127.0.0.1:1433;databaseName=Test_Liquibase_Demo_Prod;trustServerCertificate=true;
    username=test
    password=12345678
      
    # 參考的測試機資料庫
    referenceUrl=jdbc:sqlserver://127.0.0.1:1433;databaseName=Test_Liquibase_Demo;trustServerCertificate=true;
    referenceUsername=test
    referencePassword=12345678
    ```

2. 執行指令

    ```bash
    # 對資料庫進行兩者差異的比較，並將結果寫入到檔案中
    liquibase diff --outputFile=diff_between_DEV_PROD.log
    
    # 對資料庫進行兩者差異的比較，並且產生changelog
    liquibase diffChangeLog
    
    # 創建差異的SQL
    liquibase updateSQL > update.sql
    
    # 也可以產生rollback的sql
    liquibase futureRollbackSQL > rollback.sql
    ```

3. 更新正式機資料庫

    ```bash
    liquibase update
    ```

## 參考

- [liquibase](https://docs.liquibase.com/home.html)
- [version-control-tools](https://dbmstools.com/categories/version-control-tools)
