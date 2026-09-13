# 定位稽核（2026-09-13）

## 結果

- 總案件：131 筆
- 可顯示且已覆核位置：110 筆
- 其中採臺北市官方主地號宗地 polygon：85 筆（77 個不重複宗地）
- 仍待定位、維持半透明候選點：21 筆
- 超出台北／新北合理座標範圍：0 筆

## 官方定位方法

1. 從案件名稱擷取行政區、段、小段及第一筆地號。
2. 查詢臺北市 TGEO 地籍圖公開 ArcGIS 圖層。
3. 保存宗地 polygon，並以最大外環的面積重心作為標記位置。
4. 圖上以半透明色塊呈現宗地範圍；文字明確註記「主地號」，不宣稱是完整更新基地或入口。
5. 無法由現行地籍命中的舊地號，以及尚未取得同等官方幾何的新北案件，繼續標示為待定位候選，不升級成已覆核。

## 資料來源

- [臺北市 TGEO 空間地理資訊平台](https://tgeo.swc.taipei/)
- [臺北市都市更新案件範圍圖](https://arcgis.tpgos.gov.taipei/arcgis/rest/services/DO/TEST_RENEWAL_DONEW_V2/MapServer)
- [新北市都市更新案件資訊查詢](https://www.uro.ntpc.gov.tw/UrbanRenewalExploration/List)

定位快取由 `npm run data:locations` 更新，整合檔由 `npm run data:integrate` 重新產生。
