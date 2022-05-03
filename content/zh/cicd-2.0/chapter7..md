---
title: Chapter 07
description: 'Chapter 07 部屬流水線原則與工具設計'
position: 101
category: 持續交付2.0：實務導向的DevOps

---
## 前言
Deployment Pipeline為CI的核心，能完整呈現軟體交付的整個過程。從程式碼完成後的提交、建構、部屬與測試到正式的發布，除了可以清楚知道整個歷程外，也可即時得知提交進度。

那我們該如何根據團隊與不同產品去設計整個Pipeline?此章的重點就在談這件事情。 

<alert>
部屬Pipeline受到軟體架構、Git Flow及團隊與產品不同而有所不同設計概念。
</alert>

## 7.1 簡單的部屬流水線
此節以實際例子來簡易OverView在Pipeline設計上會有那些環節與實際情境。書中例子以[Curise](https://reurl.cc/Dydonj)為範例，他就像今日我們很常聽到Jenkis，是一個j以Java Base開發的持續整合工具。其程式碼高達5萬行，而自動化單元測試及整合測試Case就多達2350個，端對端測試為140個，在架構也算蠻龐大的軟體系統。

但他在2010年就停止維護了，有興趣了解可以到他的[官方網站](https://reurl.cc/ank4v9)。Curise在2010年停止維護後更名為GoCD，並走Open Source開發。並將Source Code放置[Github](https://github.com/gocd/gocd)。

### 7.1.1 GoCD簡單的產品研發流程

GoCD算典型的持續整合代理伺服器架構，其架構如下，GoCD Server提供使用者UI及Pipeline腳本控制及指派工作，讓Agent去執行Pipeline過程中需要執行的Command(此處簡單帶過)。另外一提，他使用的版控工具為Mercurial不是一般主流的Git。

<div class="flex justify-between">
  <img src="images/cicd-2.0/07/001.png" width="49%" />
</div>

維護此產品的團隊人數約為12人，產品的交付其中與迭帶週期為一周。在這麼快速的迭帶週期，團隊也使用CICD，在每個迭帶結束後，用新版本替換掉目前團隊在使用的舊版本，並在每兩個迭帶後將試用版本部屬到公司內部的公用伺服器，若公司內部試用版本使用到一個品質檢測標準，一周後再將版本交給企業試用。其週期如下圖所示，

<div class="flex justify-between">
  <img src="images/cicd-2.0/07/002.png" width="49%" />
</div>

### 7.1.2 初始Pipeline設計

GoCD的Piepline設計是Base on六步提交法理論，哪六步?

 - 第一步: Clone成功版本至本地端 
 - 第二步: 修改程式碼
 - 第三步: 本地端Build && Test
 - 第四步: Merge其他人程式碼再跑一次Build && Test
 - 第五步: 提交
 - 第六步: 進Pipeline

<p align="center">
  <img src="images/cicd-2.0/07/003.png" width="50%" /> 
</p>


