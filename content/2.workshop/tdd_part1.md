# TDD技術分享 - Part1 灌輸

TDD為軟體開發一種手法，核心思維在於釐清功能情境後，從測試程式碼開始開發。與一般開發習慣有很大的不同。

一開始會用例子情境直接去帶入理解TDD與一般開發不同之處，例子如下

<span style="background-color: #9F5000">情境 : 作為銀行客戶，我想要透過一個安全的登入系統登入我的帳戶，以便查看我的餘額和進行交易。</span>

針對這個情境，需驗證登入合法性，條件如下

 - 驗證正確的帳號和密碼可以成功登入。
 - 驗證錯誤的帳號或密碼無法登入。
 - 驗證三次登入失敗後帳戶將被鎖定。

<span style="background-color: #4F4F4F	">註: 此例在此文章會被不停地拿來使用</span>

## 1. 以範例初步體會TDD測試驅動開發

### a. 一般情境開發

一般開發大都會從最基礎的資料基礎建設開始做開發，流程如下

![一般情境開發](images/workshop/tdd-part1/001.png)

1. DBContext : 撰寫DB Entity，建置完後做Migration產出DB Table

2. Repository : 設計Repository Layer，實作資料CRUD，隔離DBContext

3. Service : 實際撰寫登入密碼驗證邏輯與服務方法(通常會參考資料層實作)

4. API Interface : Controller層，實際撰寫In Out Bound部分

5. Test Code : 最後針對Service邏輯部分撰寫測試程式碼

此為根據需求從資料層建置到API介面層的一個開發流程，期間雖然會思考使用者情境邏輯，但通常到Test Code階段情境Case才會想得比較齊全。<span style="color: #ff6666">但對於不寫測試程式碼的工程師就會懶於寫測試程式碼…此時程式會因需求變動或是除錯修改程式碼發生改A壞B或是對的東西改成錯的，在沒測試驗證邏輯保護下跑就會大概機率會出錯。</span>

### b. TDD簡易開發流程示意

TDD實際開發流程如下，會首要考慮情境去寫測試程式碼

![TDD簡易開發流程](images/workshop/tdd-part1/002.png)

關鍵在於的在Test Code到Service這段，這段實際細節流程如下

![TDD簡易開發流程2](images/workshop/tdd-part1/003.png)

細部流程會是一個測試驗證與撰寫程式碼的重複流程，我們以驗證正確的帳號和密碼可以成功登入這個測試情境為例。一開始先產生測試程式碼(注:測試程式碼非Product Code)如下，此時直接跑測試一般會出現警告或是失敗，IDE測試結果會產生紅燈，此紅燈為測試的起手情境。接著我們要想辦法讓他變成綠燈，開始實際寫測式流程

```csharp
[TestMethod]
public void LoginWithCorrectUsernameAndPassword_ShouldBeSuccess()
{
    
}
```
在撰寫測試程式，過程中我們一開始並不關心是否有真正的Concrete Class，會直接寫測試邏輯，例如下述這段驗證帳密正確性。寫這段測試時，實際沒有LoginService實體Class，因為我們著重於測試情境邏輯與流程，簡單來說我們一開始關心的是我們該如何寫完整性較高的測試”流程”，注重的是邏輯與流程，這會與一般先寫好再建置Concreate Class的思維非常不同。

```csharp
[TestMethod]
public void LoginWithCorrectUsernameAndPassword_ShouldBeSuccess()
{
    LoginService loginService = new LoginService();
    bool result = loginService.Validate("Spyua", "password123");
    Assert.IsFalse(result);
}
```
在沒有Concreate Class狀況下，IDE會檢測出沒有LoginService這個Concreate而標註紅線，此時通常會透過IDE熱鍵快速產生LoginService Class與Validate方法如下。在我們完成Concreate Class，可以刻意先不寫邏輯，讓他回傳false讓測試通過，當我們完成這段在執行測試時此時IDE就會Show綠燈。

```csharp
public class LoginService
{
    public bool Validate(string username, string password)
    {
        return false; // 刻意返回false讓測試通過
    }
}
```
接著我們要開始做重構，重構在另一個小節我會描述他的精神，在這情境重構在於完善Validate邏輯部分，因此我們快速補一下示意邏輯，再做一次測試驗證會是綠燈。

```csharp
public class LoginService
{
    public bool Validate(string username, string password)
    {
        if(username == "Spyua" && password == "password123")
            return true;
        return false;
    }
}
```

過了一遍這個流程，大致要帶出涵義在於TDD為測試流程，由測試不過(紅燈)到測試過(轉綠燈)，期間會不停地做測試，寫Product Code，測試，重構再次測試，直到你將Product Code完成。最後，會再做一次Review看是否要做重構(重新整理程式碼)。

此時你應該會小疑問，Service參考實作Repository怎麼沒有? 這後面會搭配如何使用測試Mock去寫這段，並做詳細說明。

## 2. 使用ATDD設計好的故事設定

上章節討論完後，對於TDD實作流程應該會有一定的認知。但你有發現到一件事情嗎? TDD是其實很貼近於開發角色，實際他是偏於底層的思維，對於較接近User的上層情境邏輯會有一段小落差外，另外就是實際開發過程，我們還是需要開發者能透徹了解實際的情境外，且能與User與PM達到共識，理想上整體的測試情境與條例都可讓三方理解。

而這整個過程就是要探討如何從User Requirement定義出User Story與測試條例過程，我們或稱做ATDD，英文縮寫為 Acceptance Test-Driven Development。<span style="color: #ff6666">他會是TDD整個流程中最重要的一環</span>。歸根究柢，還是要透徹討論去理解使用這需求。就像寫小說一樣，有清楚的故事設定背景，才會有好的故事內容。

> 系統的存在目的，是為了滿足使用者需求，而不是給開發人員寫爽的。 (91)

ATDD探討會有幾個環節，分別為

1. 從User Requirement定義出 User Story

2. 根據User Story設計出Use case diagram並搭配Use case 
description

3. 根據1,2 列出實際功能清單

4. 定義出acceptance testing

而這四個環節，會不斷的與實際撰寫測試做循環驗證與修正

### a. User Story Lightning Talk (參考91)

我們如果要將User Requirement用最簡單的方式讓大家都可以瞭解這個需求是什麼，通常會使用User Story描述技巧，它是敏捷開發中用來描述功能需求的一個簡單又實用的方法。透過User Story，開發者可以更容易理解使用者的需求和目標，並專注於創造有價值的解決方案。通常，User Story的制定格式會遵循以下結構：

中文版

<span style="background-color: #977C00">作為（某個角色），我想要（某個功能或動作），以便（達到某個目的或效益）。</span>

英文版

<span style="background-color: #977C00">As a "role", I want "goal/desire" so that "benefit" </span>

- **某個角色**：使用該功能的人，可以是特定的使用者、系統管理員、客戶等。
- **某個功能或動作**：這部分描述想要開發的具體功能或系統應該執行的動作。
- **達到某個目的或效益**：這部分解釋了為什麼這個功能是有價值的，也就是說，它可以達到什麼特定的效益或目的。

以我們上述的登入系統情境，我們會這樣定義

```diff
作為 一個銀行客戶，
我希望 能夠透過一個安全的登入系統登入我的帳戶，
以便 查看我的餘額和進行交易，
並且我期望：

如果 我輸入的帳號和密碼是正確的，那麼 我應該可以成功登入。
如果 我輸入的帳號或密碼是錯誤的，那麼 我不應該能夠登入。
如果 我連續三次登入失敗，那麼 我的帳戶應該被鎖定，以保護我的安全。
```

<details>
  <summary>小練習</summary>
  
  情境描述

  作為銀行客戶，我想要從我的一個帳戶轉帳到另一個帳戶，以便管理我的財務。

  Acceptance Test Case:
   - 驗證足夠餘額的轉帳是成功的。
   - 驗證餘額不足的轉帳應該失敗。
   - 驗證成功的轉帳應該在兩個帳戶間正確移動金額。

  User Story

  ```diff
  作為 一個銀行客戶，
  我希望 能夠從我的一個帳戶轉帳到另一個帳戶，
  以便 管理我的財務，
  同時確保：

  如果 我的帳戶有足夠的餘額，那麼 轉帳應該成功。
  如果 我的帳戶餘額不足，那麼 轉帳應該失敗。
  如果 轉帳成功，那麼 兩個帳戶間的金額應該正確移動。
  ```
</details>

##### I. User Story 討論

上述是直接定義出User Story的情境結果，一般我們會使用敏捷開發討論User Story，在敏捷開發中，User Story的定義和討論是一個持續的過程，涉及多個階段和參與者(PO、PG…)。

<details>
  <summary>細部實際討論做法簡易描述</summary>
  
  1. **撰寫User Story**：在便條紙或數字化的看板上寫下User Story的基本描述，包括角色、功能和效益。

  2. **定義Acceptance Criteria**：測試人員和開發人員共同參與的一個重要環節。Acceptance Criteria（或Acceptance Test Case）明確界定了User Story完成的條件。這些條件可以在同一張便條紙的下方寫出，也可以單獨記錄貼在同一個區塊。

  3. **User Story討論會議**：開發團隊、產品擁有者、測試人員和其他利益相關者所有人將共同討論User Story的細節，包括Acceptance Criteria。這個過程有助於確保每個人都理解需求並同意測試標準。

  4. **估算和排程**：團隊可能還會為User Story進行大小估算和排程。使用像是點數費式數列這樣的估算方法，並將User Story分配到特定的開發迭代或冲刺中。

  5. **持續溝通和澄清**：隨著開發的進展，可能還需要進一步的討論和澄清。涉及更多的會議或非正式的交流。

</details>

細部討論細節歸類大原則上Follow 3C原則，也就是Card、Conversation與Confirmation


<details>
  <summary>3C原則</summary>
  
  1. **Card（卡片）**：
    - **目的**：卡片作為一個描述溝通媒介，用於紀錄User Story的核心概念。
    - **內容**：通常包括角色、功能和效益。例如，“作為銀行客戶，我希望能夠透過一個安全的登入系統登入我的帳戶，以便查看我的餘額和進行交易。”
    - **特點**：卡片應該簡短明了，就像Lighting Talk，短時間提供足夠的信息來引發更深入的討論。

  2. **Conversation（對話）**：
    - **目的**：透過團隊之間的對話來深入理解User Story的細節，並解決任何歧義和不清楚的地方。
    - **內容**：包括討論Acceptance Criteria、技術細節、依賴關係等。
    - **特點**：對話可以在正式的計畫會議中進行，也可以是隨時發生的非正式討論。

  3. **Confirmation（確認）**：
    - **目的**：通過明確的Acceptance Criteria確定User Story的完成條件，確保所有利益相關者對需求和期望有共同理解。
    - **內容**：明確定義何時User Story被認為是“完成”的，例如，正確的帳號和密碼可以成功登入等。
    - **特點**：這部分通常涉及測試人員、開發人員和產品擁有者的密切合作，以確保所有人對接受標準有共同理解。

  這三個元素共同構成了完整的User Story，支援敏捷開發過程中的協作和溝通。卡片是引發對話的起點，對話是深入理解需求的過程，確認則是確保所有人對完成標準達成共識的過程。
  
</details>

##### II. User Case Digram 

在討論過程中，我們會使用Digram來輔助討論，可以明確看出系統邊界、角色關係與案例，一般會Follow 5W準則(Who、Where、What、When與Why)。如我們此章節提到的登入系統情境例子，它的User Case Digram可能會長的如下

![User Case Digram](images/workshop/tdd-part1/004.png)

圖中的pre與post為pre-condition（前置條件）和post-condition（後置條件）的角色。

1. **Pre-condition（前置條件）**：
    - 描述了必須先滿足的條件，用例才能夠被執行。
    - 例如，客戶必須輸入正確的帳號和密碼。

2. **Post-condition（後置條件）**：
    - 描述了用例執行成功後系統的狀態。
    - 例如，客戶可以成功登入，並能夠訪問其帳戶以查看餘額和進行交易

##### III. Acceptance testing 

Acceptance testing為接收測試描述，它一樣是在討論過程中會去定義出的驗收標準描述。用來說明某一個user story，系統在特定情況下應該完成什麼樣功能，以及針對某一些輸入，應該具備怎樣的輸出結果。從從使用者的角度來檢視，系統是否能正常運作（是否符合使用者的期望)。通常以自然語言撰寫。

描述內容盡量把握幾個準則 (91)

 - 使用者為owner(PO)來主導撰寫 : 使用者為最後的驗收人員，所以使用者最有資格、也最應該來撰寫驗收測試。讓使用者來主導，而由有經驗的測試人員與開發人員輔助撰寫測試案 

 - 重點在What，而不是How : 驗收測試案例的重點在於該有什麼樣的功能，用什麼樣的方式，能代表滿足這個user story。如何做到細節就不用過於描述。

 - 簡潔、準確、避免無異議的描述 : 例如我們提到的登入例子，以ATDD接受測試描述就會如下
   - 驗證正確的帳號和密碼可以成功登入。
   - 驗證錯誤的帳號或密碼無法登入。
   - 驗證三次登入失敗後帳戶將被鎖定。

寫過測試經驗的開發者應該會意識到，這測試描述其實還需要轉譯成測試3A撰寫描述，這就是我們下章節會提到BDD章節，回提到關於DSL(Domain Specific Lanaguage)語言描述，DSL就會較貼近實際的測試撰寫情境。

## 3. BDD神輔助

這章節用意在於要帶出使用DSL語法描述測試條例並使用Net Specflow Tool協助我們產生測試程式碼，來輔助我們TDD整個開發過程。BDD英文全名為Behavior-driven development，由使用者行為情境討論來做開發起始點，過程TDD這章節不加以詳述，我們要探討的是DSL(Domain Specific Lanaguage)語言描述。

### a. Gherkin 3A

DSL(Domain Specific Lanaguage)語言描述為了解決特定領域的問題而設計的，例如我們常看到的SQL與HTML則就是針對資料庫領域與網頁領域而設計的語法。

相對於BDD開發，也有針對此領域而設計的語言叫****Gherkin ，使用 "Given-When-Then" 的結構去描述軟件功能的期望行為。例如我們提到的安全登入例子，以Gherkin描述就會如下****

```Diff
Feature: 安全登入

Scenario: 正確的帳號和密碼
  Given 一個有效的帳號和密碼
  When 用戶嘗試登入
  Then 登入應成功

Scenario: 錯誤的帳號或密碼
  Given 一個無效的帳號或密碼
  When 用戶嘗試登入
  Then 登入應失敗

Scenario: 三次登入失敗
  Given 用戶已經嘗試登入兩次並失敗
  When 用戶再次嘗試登入並失敗
  Then 帳戶應被鎖定
```

相對於我們上述提到的Acceptance testing 描述，會更接近於Test的3A架構，3A即是Arrange、Act與Assert。在寫測試段，一個測試會有這三個流程階段。如果我們轉成3A描述則會如下

**Scenario: 正確的帳號和密碼**

- **Arrange（安排）**：設置測試的初始條件。**`Given 一個有效的帳號和密碼`**。
- **Act（執行）**：執行要測試的行為。**`When 用戶嘗試登入`**。
- **Assert（斷言）**：驗證系統的實際行為是否符合預期。**`Then 登入應成功`**。

**Scenario: 錯誤的帳號或密碼**

- **Arrange（安排）**：**`Given 一個無效的帳號或密碼`**。
- **Act（執行）**：**`When 用戶嘗試登入`**。
- **Assert（斷言）**：**`Then 登入應失敗`**。

**Scenario: 三次登入失敗**

- **Arrange（安排）**：**`Given 用戶已經嘗試登入兩次並失敗`**。
- **Act（執行）**：**`When 用戶再次嘗試登入並失敗`**。
- **Assert（斷言）**：**`Then 帳戶應被鎖定`**。

實際的測試程式碼會如下(非Specflow產生)

```csharp
using NUnit.Framework;

[TestFixture]
public class LoginTests
{
    private LoginService _loginService;

    [SetUp]
    public void Setup()
    {
        _loginService = new LoginService(); // Arrange: 初始化測試環境
    }

    [Test]
    public void LoginWithValidCredentials_ShouldSucceed()
    {
        // Arrange: 設置測試的初始條件
        _loginService.SetCredentials("validUsername", "validPassword");

        // Act: 執行要測試的行為
        bool result = _loginService.AttemptLogin();

        // Assert: 驗證系統的實際行為是否符合預期
        Assert.IsTrue(result);
    }

    [Test]
    public void LoginWithInvalidCredentials_ShouldFail()
    {
        // Arrange
        _loginService.SetCredentials("invalidUsername", "invalidPassword");

        // Act
        bool result = _loginService.AttemptLogin();

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void LoginWithThreeFailedAttempts_ShouldLockAccount()
    {
        // Arrange
        _loginService.SetCredentials("invalidUsername", "invalidPassword");

        // Act
        _loginService.AttemptLogin();
        _loginService.AttemptLogin();
        _loginService.AttemptLogin();

        // Assert
        Assert.IsTrue(_loginService.IsAccountLocked());
    }
}
```

### b. Specflow Tool ([官方文件](https://docs.specflow.org/projects/specflow/en/latest/Bindings/Step-Definitions.html))

##### I. 安裝

Step1 : 至VS IDE延伸模組安裝 SpecFlow

![Specflow Install 1](images/workshop/tdd-part1/005.png)

Step2 :  新增Nunit專案

Step3 : Nunit專案安裝 SpecFlow.NUnit

![Specflow Install 2](images/workshop/tdd-part1/006.png)

##### II. 撰寫Feature檔案並撰寫內容

先在Nunit專案新增feature file，如果延伸套件有裝，應該可以在新增選項看到Specflow項目

![Specflow Write 1](images/workshop/tdd-part1/007.png)

新增完後，接著我們根據3.a提到的Gherkin 描述範例填到feature file內

```Gherkin
Feature: 安全登入

Scenario: 正確的帳號和密碼
    Given 一個有效的帳號和密碼
    When 用戶嘗試登入
    Then 登入應成功

Scenario: 錯誤的帳號或密碼
    Given 一個無效的帳號或密碼
    When 用戶嘗試登入
    Then 登入應失敗

Scenario: 二次登入失敗
    Given 用戶已經嘗試登入兩次並失敗
    When 用戶再次嘗試登入並失敗
    Then 帳戶應被鎖定
```

##### III. 產生測試Code

撰寫完feature檔案後，在feature內文還沒產生對應的測試Code，他會是一個紫色HL的狀態，如下圖

![Specflow gen code 1](images/workshop/tdd-part1/008.png)

此時我們針對檔案內文點選右鍵(任何一處都可)，點選Define Step

![Specflow gen code 2](images/workshop/tdd-part1/009.png)

他會產生一個選擇表如下，基本上都是全選

![Specflow gen code 2](images/workshop/tdd-part1/010.png)

你就會看到測試程式碼被產生，而且是整個對應你的feature file (Testing Item Board點下去會指到feature file不是Test  cs file)

![Specflow gen code 3](images/workshop/tdd-part1/011.png)

##### IV. (重要)修改feature 

這小節稍微紀錄一下，如果我們要改需求，勢必會動到feature file，此時會需要同步更新所產生的Testing Code。理想上基本上更動是要整個連動，但實際上這工具目前版本使用起來沒這麼直覺。

這邊給個上述case如下

```Gherkin
Scenario: 二次登入失敗
    Given 用戶已經嘗試登入兩次並失敗
    When 用戶再次嘗試登入並失敗
    Then 帳戶應被鎖定
```
原本是2次登入失敗，如果我們想改描述變成3次登入，<span style="color: #ff6666">此時不能直接改文字描述部分</span>，你必須對Given按右鍵，點選Rename Steps，跳出下面視窗修改，才能同步改道所產生的Testing Code，<span style="color: #ff6666">但僅止於Attribute描述部分，Testing Function Name要自己重新命名</span>

![Specflow modify](images/workshop/tdd-part1/012.png)

另外如果點擊後沒反應，只需要對解決方案按右鍵並做重新編輯即可

> Specflow讓PO、User與PG專注在feature file的異動，且三方都看得懂實際的測試項目，相對於一般3A的測試Code撰寫可讀性會在更接近自然語言

## 4. TDD Combo Hit 

討論完Specflow部分，我們試著完成整個測試，請先建置你的Product Project，結構如下

![File Structure](images/workshop/tdd-part1/013.png)

### a. Run TDD ([Sample Code](https://github.com/spyua/TDD-WorkShop.git))

繼上述由Specflow產生的Scenario，針對正確的帳號和密碼情境參考完善測試Code如下 (PS : 測試專案需安裝FluentAssertions) ，

```csharp
public class 安全登入StepDefinitions
{
    private LoginService _loginService; // 假設有一個登入服務
    private string _username;
    private string _password;
    private bool _loginResult;

    public 安全登入StepDefinitions()
    {
        _loginService = new LoginService(); // 初始化登入服務
        _username = string.Empty;
        _password = string.Empty;
        _loginResult = false;
    }

    [Given(@"一個有效的帳號和密碼")]
    public void Given一個有效的帳號和密碼()
    {
        _username = "validUser";
        _password = "validPassword";
    }

    [When(@"用戶嘗試登入")]
    public void When用戶嘗試登入()
    {
        _loginResult = _loginService.Login(_username, _password);
    }

    [Then(@"登入應成功")]
    public void Then登入應成功()
    {
        _loginResult.Should().BeTrue();
    }
}
```
在一開始我們並沒有LoginService這個物件，因此IDE會反紅，此時直接使用IDE的Quick Action，點選產生新的類型



