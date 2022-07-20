---
title: 'Chapter 00 使用Gitlab做CI/CD'
description: 'Chapter 09 使用Gitlab做CI/CD'
position: 99
category: 持續交付2.0：實務導向的DevOps
menuTitle: 'Chapter 00'
contributors: ['changemyminds','spyua']
---

## 前言
此章節不屬於持續交付2.0書中內容，額外挪出的一個教學章節。

CI/CD目前在大部分會做頻繁整合與部屬的團隊都已在使用，因此在開發中在目前的趨勢中有一定的必要性。CI為持續整合，他的用意本質在於當既有程式碼或產品有任何異動時，可以在短時間內完成整合，並確保用作如預期。而CD為持續交付，注意英文中的D為Delivery而不是Deployment。用意在讓任何一個異動可以保有品質的盡快交給客戶，並能為此帶來對應的價值，此章節會手把手教學如何使用Gitlab來達到CI/CD自動化。並透過CI/CD將.Net Core專案部屬到部屬機上。


<alert>
CI/CD精神在於做到快速整合並保有高品質且能交付客戶使用，重點在於精神大於自動化工具，因此每個專案與產品狀況團隊也會具有不同的計畫與交付流程。
</alert>

## 簡易開發流程

### 不使用CI/CD

一般簡易開發整合流程為

 - Step1. 開發
 - Step2. 建置
 - Step3. 測試
 - Step4. 部屬

如下圖所示，在沒有自動化整合平台下，基本上所有流程都須透過手動去完成。

<p align="center">
  <img src="images/cicd-2.0/00/001.png" width="100%" /> 
</p>

### 使用CI/CD

如下圖所示，我們只需要寫好Script File，交付到Gitlab，並在Gitlab Server上做好設定，Server就會根據Script腳本所寫的指令(命令)，交付Runner Server作執行。在使用此自動化整合架構下，我們可透過Gitlab與Runner Server完成上述的步驟開發、建置、測試與整合，甚至是程式碼分析。

一般CI會做建置測試與程式碼分析，而CD則是做部屬、整合測試與交付。在不同的應用場合下，設置會根據不同環境應用建立專屬CI與CD Runner服務。但此章節不會講到太複雜的情境，會以簡易的開發、建置、測試與部屬四個步驟帶過。

<p align="center">
  <img src="images/cicd-2.0/00/002.png" width="100%" /> 
</p>

<alert>
一般可做自動化整合的Git Server，都會需要一個代理伺服器(Runner Server)來幫忙執行Script。因此我們會需要一台機器做專門的Runner Server來服務Git Server。
</alert>

## Runner Server設定

Runner Server須根據開發應用選擇不同的作業環境，例如若你的專案已.Net Framework為主。你想做自動化整合，你的Runner機台則就須選用Windows OS。若日可做跨平台的.Net Core，你則可以選擇Linux OS環境去架設Runner Server。

因Runner Server會根據Script指令做建置與測試甚至是部屬，所以需安裝可執行相對應的CLI指令及SDK。如上述提到的.Net Core，若Runner Server要編譯.Net Core專案，則就需安裝相對應的SDK。若CD需透過SSH連至部屬機操作，則Runner Server則需具備SSH連線能力。簡單的說，開發環境可做的事情，大部分在Runner上也要都具有相同功能。

### Gitlab Runner分類

Gitlab Runner設置有三種模式，如下

 - Share Runner : 所有Group或專案可使用，不需自行架設Runner，免費版本兩千分鐘使用限制。
 - Specific(Project) Runner : 特定需求使用，需自行架設Runner。
![003](images/cicd-2.0/00/003.png)

 - Group Runner : 同Group的Project可使用，需自行架設Runner。

![004](images/cicd-2.0/00/004.png)

### 安裝Runner設定

上述提到Runner設置有三種，此文章我們會以Group Runner設置為主，請先至以下路徑

YourGroup → Setting → CI/CD → Runner (點選Expand)

展開後，請點選New group runner view的Take me there就會進入到Runners 設定頁面如下圖，

![004](images/cicd-2.0/00/004.png)

你可以點選右上角的Register a group runner，並根據你要設置的平台，在Show runner installation and registration instructions 選項有詳細設置方式，如下圖

![005](images/cicd-2.0/00/005.png)

### Windows設置[[官網說明](https://docs.gitlab.com/runner/install/)]

 - Step1 : [下載Windows Gitlab Runner檔案](https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe)
  
 - Step2 : 安裝與啟動

```=script
# 切換到下載目錄
cd D:\SystemService\gitlab-runner

# 安裝服務
gitlab-runner-windows-amd64.exe install

# 進行服務啟動
gitlab-runner-windows-amd64.exe start
```

安裝和啟動服務成功後，可以透過工具管理員查看狀態

 - Step3 : 註冊

至YourGroup → Setting → CI/CD → Runner (點選Expand) → Take me there → Register group runner →Show runner installation and registration instructions

點選Windows Tab 此時就會跑出建議指令流程，

![006](images/cicd-2.0/00/006.png)

請輸入Register指令

```Script
./gitlab-runner.exe register --url https://gitlab.com/ --registration-token your token
```
 - Step4 : 設置Register參數
   - a. Gitlab URL : 若是Group Runner，可以輸入Group Gitlab的URL(Ex:https://gitlab.com/groupxxxx)
   - b. Registration Token : Your Token (Group Token or Specific Project Token)
   - c. Description : 關於此Runner的描述
   - d. Tags : 寫CI.yml時，工作會根據Tag名稱指向符合此名稱的Runner，所以這參數設定很重要，一般可以根據你的環境去命名例如Windows-xxxx或者是Linux-xxxx
   - e. Maintenance note : 維護說明，可填寫維護時須注意事項
   - f. Executor : 執行器種類，若要走較一般的CI就是選shell，執行器就可根據不同作業系統做對應的CLI執行器設定(例如Windows設定PowerShell，Linux設定bash。[參考](https://docs.gitlab.com/runner/shells/))
  
  - Step5 : 完成

此時我們在點選

YourGroup → Setting → CI/CD → Runner (點選Expand) → Take me there

你就可以看到註冊好的Runner顯示在設定頁面上了

![007](images/cicd-2.0/00/007.png)

### Linux設置[[官網說明](https://docs.gitlab.com/runner/install/)]

 - Step 1 : 安裝與啟動

至Gitlab說明文件直接照步驟操刀

至YourGroup → Setting → CI/CD → Runner (點選Expand) → Take me there → Register group runner →Show runner installation and registration instructions

![008](images/cicd-2.0/00/008.png)

 - Step 2 : 註冊 (可直接參照上述 Windows設置註冊)

### Shell設置

上述設置好Ruuner後，接著需調整Runner設定檔的執行器，請開啟Runner資料夾下的toml檔，並照下圖設置

<p align="center">
  <img src="images/cicd-2.0/00/009.png" width="70%" /> 
</p>

詳細對應Shell設定可至此查詢[[連結請點我](https://docs.gitlab.com/runner/shells/)]

### 安裝編譯環境設定

因為Runner為代替本機電腦做建置、測試與部屬。所以需在上面安裝相對應環境，專案上我們會使用dotnet core為範例。所以電腦需安裝對應需有的SDK，若使用Docker則需安裝Docker環境。

 - [Net Core SDK安裝參考](https://docs.microsoft.com/zh-tw/dotnet/core/install/windows?tabs=net60)
 - [Dokcer安裝參考](https://github.com/changemyminds/script/tree/master/docker/install) 好用請給讚，謝謝

## CI撰寫

### 建置與測試

### Hello CI/CD

請到此下載Sample Code

https://gitlab.com/test8214/emptyproject

下載下來後將此專案上到你的Group Project，若你的Runner已設好，我們可以直接從Gitlab頁面點選 Set up CI/C，如下圖

<p align="center">
  <img src="images/cicd-2.0/00/010.png" width="90%" /> 
</p>

接著點選Configure pipeline，此時Gitlab會幫你生成yml Sample Code，此Sample Code已幫你寫好的基本build, test與deploy Stages。請將最上層註解刪除，並加上default區段，runner tag

```=script
# default表示所有job都會參考以及使用
default:
  # 使用Gitlab Runner有相關的標籤
  tags:
    - Windows(根據你的Runner Tag去填寫)
```

此時若Runner設置無誤，就可以看到Gitlab開始跑CI/CD，如下圖

<p align="center">
  <img src="images/cicd-2.0/00/011.png" width="90%" /> 
</p>

根據此腳本，我們可以得知CI.yml的基本語法由stages及對應的job name中的script。若要新增Job則只需在stages新增，例如我們在test站點後新增build-release，請修改stage區塊如下


```=script
stages:          # List of stages for jobs, and their order of execution
  - build
  - test
  - build-release # 新增build-release
  - deploy
```

並將以下Script放置lint-test-job下

```=script
lint-test-job:   # This job also runs in the test stage.
  stage: test    # It can run at the same time as unit-test-job (in parallel).
  script:
    - echo "Linting code... This will take about 10 seconds."
    - sleep 10
    - echo "No lint issues found."

#新增build-release job
build-release-job:
  stage: build-release
  script:
    - echo "Build release app package..."
    - echo "Build complete."
```

接著做commit，我們即可看到Pipeline由三個站點變成四個站點

<p align="center">
  <img src="images/cicd-2.0/00/012.png" width="100%" /> 
</p>

### build 與 test

#### build-job

一般在CI/CD Sample，很常會看到這個站點，用意在測試建置專案是否能編譯過。在dotnet core專案，我們在CLI模式下可以用dotnet build去建置專案，此時我們可以嘗試將build-job站點script加入dotnet build指令(建議先註解調build job以外的job Script站別)，如下

```=script
build-job:       # This job runs in the build stage, which runs first.
  stage: build
  script:
    - echo "Compiling the code..."
    - dotnet build SampleWebAPI\src\SampleWebAPI -c debug
```

更新yml file後，檢查一下Pipeline能否編輯的過。編譯過可看到訊息如下

<p align="center">
  <img src="images/cicd-2.0/00/013.png" width="100%" /> 
</p>


#### unit-test-job
接著我們嘗試加入Test Job，請刪除lint-test-job只保留unit-test-job並將dotnet test加入script，如下

```=script
unit-test-job:   # This job runs in the test stage.
  stage: test    # It only starts when the job in the build stage completes successfully.
  script:
    - echo "Running unit tests... This will take about 60 seconds."
    - dotnet test SampleWebAPI\test\SampleWebAPI.Test
```
更新yml file後，檢查一下Pipeline能否編輯的過。編譯過可看到訊息如下

<p align="center">
  <img src="images/cicd-2.0/00/014.png" width="100%" /> 
</p>

#### 使用變數

上述編譯與測試有使用到dotnet build與test，基本上我們可以將我們的src與test路徑寫成變數，這樣在使用上可以重複利用減少重複的程式碼

```=script
variables:
  AppFolderPath: SampleWebAPI\\src\\SampleWebAPI
  TestFolderPath: SampleWebAPI\\test\\SampleWebAPI.Test
```

接著將原本的Build與Test Jib Script換掉

```=script
build-job:       # This job runs in the build stage, which runs first.
  stage: build
  script:
    - echo "Compiling the code..."
    - dotnet build ${AppFolderPath} -c debug

unit-test-job:   # This job runs in the test stage.
  stage: test    # It only starts when the job in the build stage completes successfully.
  script:
    - echo "Running unit tests... This will take about 60 seconds."
    - dotnet test ${TestFolderPath}
```

<alert>
因為我們使用dot net core，所以在測試建置這個站點(build-job)，如果我們有寫測試Code，我們可以直接省略測試建置這個站點。只需要做Test即可。下dot net test時，因為要跑測試，他會順便建置App專案。
</alert>

## CD撰寫

### 建置與部屬

### SSH設定

### publish與deploy