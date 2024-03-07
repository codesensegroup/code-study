---
title: "使用Gitlab做CI/CD"
pageTitle: "使用Gitlab做CI/CD"
contributors: ['spyua','changemyminds']
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

<div align="center">
  <img src="images/workshop/gitlab-cicd/001.png" width="100%" />
</div>

### 使用CI/CD

如下圖所示，我們只需要寫好Script File，交付到Gitlab，並在Gitlab Server上做好設定，Server就會根據Script腳本所寫的指令(命令)，交付Runner Server作執行。在使用此自動化整合架構下，我們可透過Gitlab與Runner Server完成上述的步驟開發、建置、測試與整合，甚至是程式碼分析。

一般CI會做建置測試與程式碼分析，而CD則是做部屬、整合測試與交付。在不同的應用場合下，設置會根據不同環境應用建立專屬CI與CD Runner服務。但此章節不會講到太複雜的情境，會以簡易的開發、建置、測試與部屬四個步驟帶過。

<div align="center">
  <img src="images/workshop/gitlab-cicd/002.png" width="100%" />
</div>

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
![003](images/workshop/gitlab-cicd/003.png)

- Group Runner : 同Group的Project可使用，需自行架設Runner。

![004](images/workshop/gitlab-cicd/004.png)

### 安裝Runner設定

上述提到Runner設置有三種，此文章我們會以Group Runner設置為主，請先至以下路徑

YourGroup → Setting → CI/CD → Runner (點選Expand)

展開後，請點選New group runner view的Take me there就會進入到Runners 設定頁面如下圖，

![004](images/workshop/gitlab-cicd/004.png)

你可以點選右上角的Register a group runner，並根據你要設置的平台，在Show runner installation and registration instructions 選項有詳細設置方式，如下圖

![005](images/workshop/gitlab-cicd/005.png)

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

![006](images/workshop/gitlab-cicd/006.png)

請輸入Register指令

```Script
./gitlab-runner.exe register --url https://gitlab.com/ --registration-token your token
```

- Step4 : 設置Register參數
  - a. Gitlab URL : 若是Group Runner，可以輸入Group Gitlab的URL(Ex:<https://gitlab.com/groupxxxx>)
  - b. Registration Token : Your Token (Group Token or Specific Project Token)
  - c. Description : 關於此Runner的描述
  - d. Tags : 寫CI.yml時，工作會根據Tag名稱指向符合此名稱的Runner，所以這參數設定很重要，一般可以根據你的環境去命名例如Windows-xxxx或者是Linux-xxxx
  - e. Maintenance note : 維護說明，可填寫維護時須注意事項
  - f. Executor : 執行器種類，若要走較一般的CI就是選shell，執行器就可根據不同作業系統做對應的CLI執行器設定(例如Windows設定PowerShell，Linux設定bash。[參考](https://docs.gitlab.com/runner/shells/))
  
- Step5 : 完成

此時我們在點選

YourGroup → Setting → CI/CD → Runner (點選Expand) → Take me there

你就可以看到註冊好的Runner顯示在設定頁面上了

![007](images/workshop/gitlab-cicd/007.png)

### Linux設置[[官網說明](https://docs.gitlab.com/runner/install/)]

- Step 1 : 安裝與啟動

至Gitlab說明文件直接照步驟操刀

至YourGroup → Setting → CI/CD → Runner (點選Expand) → Take me there → Register group runner →Show runner installation and registration instructions

![008](images/workshop/gitlab-cicd/008.png)

- Step 2 : 註冊 (可直接參照上述 Windows設置註冊)

### Shell設置

上述設置好Ruuner後，接著需調整Runner設定檔的執行器，請開啟Runner資料夾下的toml檔，並照下圖設置

<div align="center">
  <img src="images/workshop/gitlab-cicd/009.png" width="70%" />
</div>

詳細對應Shell設定可至此查詢[[連結請點我](https://docs.gitlab.com/runner/shells/)]

### 安裝編譯環境設定

因為Runner為代替本機電腦做建置、測試與部屬。所以需在上面安裝相對應環境，專案上我們會使用dotnet core為範例。所以電腦需安裝對應需有的SDK，若使用Docker則需安裝Docker環境。

- [Net Core SDK安裝參考](https://docs.microsoft.com/zh-tw/dotnet/core/install/windows?tabs=net60)
- [Dokcer安裝參考](https://github.com/changemyminds/script/tree/master/docker/install) 好用請給讚，謝謝

## CI撰寫

### 建置與測試

### Hello CI/CD

請到此下載Sample Code

<https://gitlab.com/test8214/emptyproject>

下載下來後將此專案上到你的Group Project，若你的Runner已設好，我們可以直接從Gitlab頁面點選 Set up CI/C，如下圖

<div align="center">
  <img src="images/workshop/gitlab-cicd/010.png" width="90%" />
</div>

接著點選Configure pipeline，此時Gitlab會幫你生成yml Sample Code，此Sample Code已幫你寫好的基本build, test與deploy Stages。請將最上層註解刪除，並加上default區段，runner tag

```=script
# default表示所有job都會參考以及使用
default:
  # 使用Gitlab Runner有相關的標籤
  tags:
    - Windows(根據你的Runner Tag去填寫)
```

此時若Runner設置無誤，就可以看到Gitlab開始跑CI/CD，如下圖

<div align="center">
  <img src="images/workshop/gitlab-cicd/011.png" width="90%" />
</div>

根據此腳本，我們可以得知CI.yml的基本語法由stages及對應的job name中的script。若要新增Job則只需在stages新增，例如我們在test站點後新增build-release，請修改stage區塊如下

```yaml
stages:          # List of stages for jobs, and their order of execution.
  - build
  - test
  - build-release # 新增build-release
  - deploy
```

並將以下Script放置lint-test-job下

```yaml
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

<div align="center">
  <img src="images/workshop/gitlab-cicd/012.png" width="100%" />
</div>

### build 與 test

#### build-job

一般在CI/CD Sample，很常會看到這個站點，用意在測試建置專案是否能編譯過。在dotnet core專案，我們在CLI模式下可以用dotnet build去建置專案，此時我們可以嘗試將build-job站點script加入dotnet build指令(建議先註解調build job以外的job Script站別)，如下

```yaml
build-job:       # This job runs in the build stage, which runs first.
  stage: build
  script:
    - echo "Compiling the code..."
    - dotnet build SampleWebAPI\src\SampleWebAPI -c debug
```

更新yml file後，檢查一下Pipeline能否編輯的過。編譯過可看到訊息如下

<div align="center">
  <img src="images/workshop/gitlab-cicd/013.png" width="100%" />
</div>

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

<div align="center">
  <img src="images/workshop/gitlab-cicd/014.png" width="100%" />
</div>

#### 使用變數

上述編譯與測試有使用到dotnet build與test，基本上我們可以將我們的src與test路徑寫成變數，這樣在使用上可以重複利用減少重複的程式碼

```yaml
variables:
  AppFolderPath: SampleWebAPI\\src\\SampleWebAPI
  TestFolderPath: SampleWebAPI\\test\\SampleWebAPI.Test
```

接著將原本的Build與Test Jib Script換掉

```yaml
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
因為我們使用dot net core，如果我們有寫測試Code，我們可以直接省略測試建置這個站點(build-job)。只需要做Test即可(unit-test-job)。下dot net test時，因為要跑測試，他會順便建置App專案。
</alert>

## CD撰寫

接著我們要做簡易的Release建置與部屬，因為Windows權限設置較麻煩，這部分Demo我們使用Linux Runner去實現(Windows系統若要快速啟用Linux Runner，可以使用WSL2)。請啟用Linux Runner並在Runner上設置好.net core需要編譯的SDK安裝，另外則是SSH安裝。

Runner設置好後，我們將上述提到的default區塊使用到的tags設定，由Windows改成Linux(在此可根據你的Linux設置)。接著將上述寫好的腳本將斜線改成反斜線，參考Script如下

```yaml
# default表示所有job都會參考以及使用
default:
  # 使用Gitlab Runner有相關的標籤
  tags:
    - Linux

variables:
  AppFolderPath: SampleWebAPI//src//SampleWebAPI
  TestFolderPath: SampleWebAPI//test//SampleWebAPI.Test

stages:          # List of stages for jobs, and their order of execution
  - test

unit-test-job:   # This job runs in the test stage.
  stage: test    # It only starts when the job in the build stage completes successfully.
  script:
    - echo "Running unit tests... This will take about 60 seconds."
    - dotnet test ${TestFolderPath}

```

若已確定你的Pipeline無誤，接著就可以往下走測試Release建置與部屬

### 建置與部屬

在建置部屬之前，請先準備好你的部屬Server，目前此章節用的部屬Server為Ubuntu 20.04 Linux，並已安裝好

- .Net Core 3.1 SDK
- SSH
- Docker
- pm2
- unzip

### SSH設定

為了簡易Demo，連線部分我們直接使用ssh與部屬Server溝通，為了免登入密碼，故須設置ssh私鑰與公鑰。請至你的Linux Runner資料夾底下會有一個.ssh file。若你是照Gitlab上的步驟設置，沒意外你的Runner路徑會在home底下

```yaml
# 切換sudo
sudo -i

# 切換到ssh目錄下
cd /home/gitlab-runner/.ssh

#產生金鑰匙(方便測試可全按Enter)
ssh-keygen

#更改私鑰權限為600
chmod 600 id_rsa

# 接著將你的公鑰傳至你的部屬機上
scp id_dsa.pub user@abc.xxx.xxx.xxx:/root/.ssh/id_dsa.pub
```

接著連過去部屬機

```yaml
# 連線部屬機
ssh root@abc.xxx.xxx.xxx

# 輸入密碼

# 至SSH File底下將Key複製一分到authorized_keys檔案底下
cat id_rsa.pub > authorized_keys

# 確定authorized_keys權限為600
chmod 600 authorized_keys

# 登出
exit

# 再次登入確定是否免密碼
ssh root@abc.xxx.xxx.xxx

```

比較笨的方式，你也可以手動複製將你自己Runner下的私鑰手動複製到部屬機的authorized_keys檔案

### Project SSH Key變數

確定好Runner與部屬機之間已可免密碼連線後，我們需要在將Runner的私鑰複製一份至專案的CI/CD設定下

請至你Group

YourPorject Repo/Settings/CICD 下

此時你會看到Variables，請新增一SSH_PRIVATE_KEY變數如下

![015](images/workshop/gitlab-cicd/015.png)

<alert>
須注意!因為是Group Runner，所以一開始我只將SSH PK設置在Group Setting的CICD設置變數下。結果Project上tags觸發Pipeline在部屬時找不到SSH PK。所以Project Repo若要上tags，須將SSH PK設置在Project Repo Setting的CICD變數設定下。
</alert>

### build-release-job與deploy

部屬機等環境設置好後，接下來就開始寫Release與deploy。先簡單帶artifacts版本，然後連至部屬主機將artifacts載下來後，解壓縮直接透過pm2將web api服務啟起來。

#### build-release-job

為了減少測試時間。我們可以先嘗試使用dotnet publish指令，自己先試看看有無問題，無問題通常可以直接將指令複製到script上。

建置release stage，參考script如下

```=script
default:
  tags:
    - Linux

variables:
  AppFolderPath: SampleWebAPI//src//SampleWebAPI
  TestFolderPath: SampleWebAPI//test//SampleWebAPI.Test

stages:          
  - test
  # 建置release stage
  - release

unit-test-job:  
  stage: test
  script:
    - echo "Running unit tests... This will take about 60 seconds."
    - dotnet test ${TestFolderPath}

# 建置release stage
build-release-job:
  stage: release
  script:
    - echo "Build release..."
    - dotnet publish ${AppFolderPath} -c release
```

#### 建置artifacts

接著我們希望在release job完成後同步產生artifacts。參考script如下

```script
build-release-job:
  stage: release
  script:
    - echo "Build release..."
    - dotnet publish ${AppFolderPath} -c release
  artifacts:
    # on_success always on_failure
    when: always 
    # 30 mins, 1 weeks...
    expire_in: 30 mins
    paths:
      - ./SampleWebAPI/src/SampleWebAPI/bin/release/netcoreapp3.1
```

我們將artifacts寫至build-release-job下，這邊會有幾個設定

- when : upload articacts時機 ([參考點我](https://docs.gitlab.com/ee/ci/yaml/#artifactswhen))
- expire : articats 存活時間 ([參考點我](https://docs.gitlab.com/ee/ci/yaml/#artifactsexclude))
- paths: 要包裝檔案的路徑

此時我們在跑一次Pipeline，就可以看到build-release-job下有個可下載的介面(如下圖)，代表你的artifactst產生成功。

![016](images/workshop/gitlab-cicd/016.png)

#### artifacts url測試([參考點我](https://docs.gitlab.com/ee/ci/pipelines/job_artifacts.html#access-the-latest-job-artifacts-by-url))

接著我們可以透過url下載artifacts，Sample如下

<https://gitlab.com/test8214/testproject/-/jobs/artifacts/main/download?job=build-release-job>

可修改的部分

- test8214 : 你的Group Url
- testproject : Project Repository Name
- main:表示主線
- release-job:表示你的stage job

<font color="#dd0000"> artifacts Project URL請根據你實際的 Project URL設定調整，誤直接照抄</font>

所以此url的意思為要從testproject下main主線最後一個成功Pipeline的build-release-job下載artifacts。

另外，比較好的方法是用CI_JOB_TOKEN去打Job Artifacts API拿取Artifacts，參考如
連結<https://docs.gitlab.com/ee/api/job_artifacts.html>

因為url方式是拿取最後一個Pipeline的build-release-job產物，代表他會拿取前一個成功的Pipline產物不是當下運行Pipeline的build-release-job產物。

因為這樣，所以這個Demo就不會將build-release-job上only tags。讓deploy可以正確拿取目前運行Pipeline編譯好的程式碼如下。

![017](images/workshop/gitlab-cicd/017.png)

<alert>
較好的Pepeline設計是將release設置在tag觸發時，也就是做CD時機點。後續再找時間修正artifacts下載方式
</alert>

#### deploy

在build-release-job做完後，接著我們要做deploy stage，一開始我們須建立ssh連線，腳本指令如下

```script
deploy-job:
  stage: deploy
  script:
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -     
    - mkdir -p ~/.ssh     
    - chmod 700 ~/.ssh 
    -> 
      ssh -o StrictHostKeyChecking=no -v user@125.229.14.65 -p 40122
```

這部分會稍微難了解一點，整體來說，主要目的在於建立一個具有PK權限的連線，讓Gitlab Runner可以在不同已允許權限的部屬主機連線(也許不只一台)。

細節部分，ssh-agent有點像是管理ssh key的工具。

第一行eval通常是印出來的意思，有點類似 echo，不過他可以直接把指令顯示出來，所以此處為顯示ssh-agent的狀態。

第二行是把 gitlab的環境變數讀取出來，之後 tr -d  '\r' 主要是把換行給取代掉，windows內建是CRLF 相當於 /r/n，而這邊的 /r 就是Carriage-Return，所謂的迴車字元。

第三行創建 -/.ssh 是在目前使用者目錄底下創建 .ssh，用來記錄等一下你的ssh連線資訊，通常ssh連線後，會記錄在一個叫做 known_host的檔案。

寫好連線deploy-job後，我們可以嘗試讓他跑看看能否連線部屬主機成功，

```script
default:
  tags:
    - Linux

variables:
  AppFolderPath: SampleWebAPI//src//SampleWebAPI
  TestFolderPath: SampleWebAPI//test//SampleWebAPI.Test

stages:          
  - test
  - release
  # 部屬
  - deploy

unit-test-job:  
  stage: test
  script:
    - echo "Running unit tests... This will take about 60 seconds."
    - dotnet test ${TestFolderPath}


build-release-job:
  stage: release
  script:
    - echo "Build release..."
    - dotnet publish ${AppFolderPath} -c release
  artifacts:
    # on_success always on_failure
    when: always 
    # 30 mins, 1 weeks...
    expire_in: 30 mins
    paths:
      - ./SampleWebAPI/src/SampleWebAPI/bin/release/netcoreapp3.1
# 部屬      
deploy-job:
  stage: deploy
  script:
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -     
    - mkdir -p ~/.ssh     
    - chmod 700 ~/.ssh 
    -> 
      ssh -o StrictHostKeyChecking=no -v user@125.229.14.65 -p 40122
```

若連線成功，deploy stage則會運行通過(打勾勾)，接著就可以開始寫連至部屬Server的指令了。這邊可以看到有一個->的符號，代表此符號區段下的指令是在SSH目標主機上執行。

接著連過去後，我們加入要執行的Script指令

```script
# 部屬      
deploy-job:
  stage: deploy
  script:
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -     
    - mkdir -p ~/.ssh     
    - chmod 700 ~/.ssh 
    - >
      ssh -o StrictHostKeyChecking=no -v user@125.229.14.65 -p 40122
      "mkdir -p ~/sampleapi &&
       wget -O ~/sampleapi/release-build.zip https://gitlab.com/test8214/testproject/-/jobs/artifacts/main/download?job=build-release-job &&
       sudo unzip -o ~/sampleapi/release-build.zip -d ~/sampleapi &&
       pm2 start 'dotnet ~/sampleapi/SampleWebAPI/src/SampleWebAPI/bin/release/netcoreapp3.1/SampleWebAPI.dll --urls http://0.0.0.0:5000' --name 'code-sense-api-service' &&
       pm2 delete code-sense-api-service &&
       pm2 start 'dotnet ~/sampleapi/SampleWebAPI/src/SampleWebAPI/bin/release/netcoreapp3.1/SampleWebAPI.dll --urls http://0.0.0.0:5000' --name 'code-sense-api-service'
      "
```

指令內容大致是連至目標主機後，

- 在user下建置sampleapi資料夾
- 下載artifacts
- 解壓鎖
- 使用pm2將Service Run起來

<font color="#dd0000"> artifacts Project URL請根據你實際的 Project URL設定調整，誤直接照抄</font>

![018](images/workshop/gitlab-cicd/018.png)

deploy完後此時就可以透過API，得到資料

 <http://x.x.x.x:你的對外Port/weatherforecast>

<alert>
deploy可以看到pm2 start兩次，因為在第一次加入時沒有對應service name可以刪除會出錯。使用> /dev/null 測試沒用。只能先用此法暫解。章節目的還是在於如何建立一起一條簡易的CI/CD Pipeline為注。正式複雜的場合可以參考Docker版本
</alert>

#### only tags

接著我們要在deploy上tags觸發事件(上標籤)，只需要在原本的script下，多一個tags屬性

```script
# 部屬      
deploy-job:
  stage: deploy
  script:
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -     
    - mkdir -p ~/.ssh     
    - chmod 700 ~/.ssh 
    - >
      ssh -o StrictHostKeyChecking=no -v user@125.229.14.65 -p 40122
      "mkdir -p ~/sampleapi &&
       wget -O ~/sampleapi/release-build.zip https://gitlab.com/test8214/testproject/-/jobs/artifacts/main/download?job=build-release-job &&
       sudo unzip -o ~/sampleapi/release-build.zip -d ~/sampleapi &&
       pm2 start 'dotnet ~/sampleapi/SampleWebAPI/src/SampleWebAPI/bin/release/netcoreapp3.1/SampleWebAPI.dll --urls http://0.0.0.0:5000' --name 'code-sense-api-service' &&
       pm2 delete code-sense-api-service &&
       pm2 start 'dotnet ~/sampleapi/SampleWebAPI/src/SampleWebAPI/bin/release/netcoreapp3.1/SampleWebAPI.dll --urls http://0.0.0.0:5000' --name 'code-sense-api-service'
      "
  # 上tags觸發事件
  only:
    - tags
```

上完tags後，deploy事件則只會在你上tag時觸發。接著就可以在tag頁面看到此次的release tag是否有通過Pipeline Job。

![019](images/workshop/gitlab-cicd/019.png)

<alert>
一般CD做release build與deploy都會上only tags，此範例因為artifacts還不確定是不是已正確方式拿取，所以只在deploy上only tags。
</alert>

## 參考專案

Repository:<https://gitlab.com/test8214/testproject>

## Docker版本(Speak，後續待寫)

Repository:<https://gitlab.com/test8214/demoproject>
