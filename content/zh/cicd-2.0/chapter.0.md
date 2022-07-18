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

### R

### 安裝Runner設定(Windows)

本章節安裝設定會以Windows為主，目前Runner設置在不同平台，Gitlab已有手把手指令教學。點選路徑為

Group下

Setting/CICD

