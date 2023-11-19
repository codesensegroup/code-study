---
title: "gRPC快速入門"
pageTitle: "gRPC快速入門"
contributors: ['frank30941', 'changemyminds']
---

## HTTP2入門介紹

### HTTP/2 概述
HTTP/2 是 HTTP 協議的第二個版本，它基於 Google 的 SPDY 協議，旨在提高網頁的加載速度和性能。相比於 HTTP/1.x，HTTP/2 改進了以下方面：

    多路徑傳輸 (Multiplexing)：HTTP/2 允許同一個 TCP 連接上進行多個請求和響應，從而減少了 TCP 連接數量和建立連接的延遲。
    首部壓縮 (Header Compression)：HTTP/2 使用 HPACK 算法對首部進行壓縮，從而減少了首部大小，降低了帶寬消耗。
    服務端推送 (Server Push)：HTTP/2 允許服務器在響應一個請求時主動推送相關的資源到客戶端緩存中，從而提高頁面加載速度。
### HTTP/2 原理
HTTP/2 使用二進制格式傳輸資料，將資料分為 HEADERS 和 DATA 兩部分。多個請求和響應可以在同一個 TCP 連接上進行，每個請求和響應都有自己的 ID。HTTP/2 也支持優先級 (Priority) 機制，可以對請求進行排序和分配優先級。

#### HTTP/2 和 HTTP/1.x 的不同之處

| HTTP/2 | HTTP/1.x |
|:--:|:--:|
|基於二進制格式|基於文本格式|
|允許多路徑傳輸|只能串行傳輸|
|使用首部壓縮|不支持首部壓縮|
|支持服務端推送|不支持服務端推送|
|支持優先級|不支持優先級|

### HTTP/2 的優缺點

#### 優點

* 加載速度更快：多路徑傳輸和首部壓縮等機制可以減少延遲和帶寬消耗，從而提高加載速度。
* 效率更高：多路徑傳輸和優先級等機制可以更好地利用網絡資源，從而提高效率。
* 安全性更高：HTTP/2 強制要求使用加密，從而提高了安全性。

#### 缺點
* 需要加密：HTTP/2 強制要求使用加密，這增加了網站的成本和複雜度。
* 需要支援 HTTP/2 的服務器和客戶端：不是所有的服務器和客戶端都支援 HTTP/2，需要更新到支援 HTTP/2 的版本。

---

## Protobuf 3介紹
Protocol Buffers (protobuf)是Google開發的一種輕量級、高效能的資料序列化格式，用於跨平台資料交換和儲存。Protocol Buffers可以在不同的程式語言之間進行資料交換，並且比XML和JSON等常見的資料序列化格式更小、更快、更易於使用和維護。

### 常見的欄位以及修飾符號

#### singular
gRPC內部的預設的欄位類型，沒有撰寫其他修飾符號就表示預設使用`singular`為欄位的最小單位。

#### optional
參數值為可選的，可以把它看作為`null`，通常會生成程式碼後，會有`HasXXX`方法或屬性來判斷此數值是否存在。我們藉由optional關鍵字來簡化傳輸大小。

#### repeated
宣告一個空的`list` (非`null`)，通常生成程式碼後，會根據對應的語言進行產生，例如: Go為`slice`，C#為`list`等等。

- protobuf
```protobuf
message Person {
  string name = 1;
  repeated string phone_numbers = 2;
}
```

- java
```java
// 創建一個人的物件
Person person = Person.newBuilder()
  .setName("John")
  .addPhoneNumbers("1234567890")
  .addPhoneNumbers("0987654321")
  .build();

// 獲取人的電話號碼列表
List<String> phoneNumbers = person.getPhoneNumbersList();
```

#### map
宣告一個空的`map` (非`null`)，通常生成程式碼後，會根據對應的語言進行產生，例如: Java為`HashMap`，C#為`Dictionary`等等。

- protobuf
```protobuf
message Student {
  string name = 1;
  map<string, double> grades = 2;
}
```

- java
```java
// 創建一個學生的物件
Student student = Student.newBuilder()
  .setName("John")
  .putGrades("Math", 90.0)
  .putGrades("Science", 80.0)
  .build();

// 獲取學生的成績
Map<String, Double> grades = student.getGradesMap();
```

#### enum
與我們一般使用的列舉差異不大，但宣告的enum編號必須是從**0**開始。

- protobuf
```protobuf
enum UserRole {
  ADMIN = 0;
  EDITOR = 1;
  VIEWER = 2;
}

message User {
  string name = 1;
  repeated UserRole roles = 2;
}
```

- java
```java
// 創建一個 User 物件
User user = User.newBuilder()
    .setName("John")
    .addRoles(UserRole.EDITOR)
    .addRoles(UserRole.VIEWER)
    .build();

// 獲取 User 物件的屬性值
String name = user.getName();
List<UserRole> roles = user.getRolesList();
```

#### oneof
跟`enum`非常相似，但主要用於互斥的屬性，且不能搭配`repeated`關鍵字。

- protobuf
```protobuf
message Stock {
    // Stock-specific data
}

message Currency {
    // Currency-specific data
}

message ChangeNotification {
  int32 id = 1;
  oneof instrument {
    Stock stock = 2;
    Currency currency = 3;
  }
  oneof actionType {
    int32 increase = 4;
    int32 decrease = 5;
  }
}
```

- java
```java
// 創建ChangeNotification物件，並設置id、股票和增量等資訊
ChangeNotification notification = ChangeNotification.newBuilder()
        .setId(1)
        .setStock(Stock.newBuilder().build())
        .setIncrease(100)
        .build();

// 創建Currency物件，並設置id、貨幣和減量等資訊
ChangeNotification currencyNotification = ChangeNotification.newBuilder()
        .setId(2)
        .setCurrency(Currency.newBuilder().build())
        .setDecrease(50)
        .build();
```                

### Well known types

|  套件名稱   | 用途  |
|  ----  | ----  |
| google.protobuf.Empty  | 類似於void沒有回傳值，但在ProtoBuf中仍需要撰寫 |
| google.protobuf.Timestamp  | 類似於DateTime或DateTimeOffset |
| google.protobuf.Duration  | 類似於TimeSpan |
| google.protobuf.Any  | 類似於object，需要透過`Is`和`Unpack<>`來進行判斷物件型別和轉型 |

💡 更多形別參考👉[參考](https://protobuf.dev/reference/protobuf/google.protobuf/)

## gRPC Code generator
### buf
Building a better way to work with Protocol Buffers
#### install buf
``` sh
brew install bufbuild/buf/buf
```
#### install go tool
```sh
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest

go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest

go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

go install github.com/envoyproxy/protoc-gen-validate@latest
```

#### Getting start
``` sh
git clone https://github.com/bufbuild/buf-tour
cd buf-tour/start/getting-started-with-buf-cli
```

buf使用buf.yaml文件配置，使用此命令創建您自己的文件：
``` sh
cd proto
buf mod init
```
運行此命令後，您會在當前目錄中看到一個buf.yaml包含以下內容的文件：
buf.yaml
``` yml
version: v1
breaking:
  use:
    - FILE
lint:
  use:
    - DEFAULT
```
buf默認情況下假定當前目錄中有一個buf.yaml，或者使用默認值代替文件buf.yaml 。buf.yaml我們建議始終在文件層次結構的根目錄下放置一個文件.proto，因為這是.proto 解析導入路徑的方式。
在我們繼續之前，讓我們驗證一切都設置正確，然後我們可以構建我們的模塊。如果沒有錯誤，我們就知道我們已經正確設置了一個 buf 模塊：
``` sh
// ~/.../buf-tour/start/getting-started-with-buf-cli/proto
buf build 
echo $?
```

#### 生成代碼
使用以下命令移回目錄getting-started-with-buf-cli
``` sh
cd ..
touch buf.gen.yaml
```
更新您的內容buf.gen.yaml以包含 Go 和 Connect-Go 插件：
``` yml
version: v1
managed:
  enabled: true
  go_package_prefix:
    default: github.com/bufbuild/buf-tour/gen
plugins:
  - plugin: buf.build/protocolbuffers/go
    out: gen
    opt: paths=source_relative
  - plugin: buf.build/bufbuild/connect-go
    out: gen
    opt: paths=source_relative
```

``` sh
buf generate proto
```

``` sh
getting-started-with-buf-cli
├── buf.gen.yaml
├── gen
│   ├── google
│   │   └── type
│   │       └── datetime.pb.go
│   └── pet
│       └── v1
│           ├── pet.pb.go
│           └── petv1connect
│               └── pet.connect.go
└── proto
    ├── buf.yaml
    ├── google
    │   └── type
    │       └── datetime.proto
    └── pet
        └── v1
            └── pet.proto
```


### protoc

## gRCP 呼叫的四種類型

<div class="flex justify-between">
  <img src="images/ddia/appendix01/grpc-4-types.png" />
</div>

### Unary
類似傳統類型的RESTful API，client發送request而Server回應Response。

### Server Streaming
Client發送一次request，而server可以回傳多次資料。

### Client Streaming
Client發送多次資料，直到告知server資料傳完後，server在給予Response。

### Bi Dirctional Streaming
兩邊都用串流的方式傳送資料。

## gRPC工具

### grpcurl

### grpcui

### postman


## 參考
[Google Protocol Buffers](https://protobuf.dev/)
