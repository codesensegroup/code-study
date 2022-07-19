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

