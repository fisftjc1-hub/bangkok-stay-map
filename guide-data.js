// Guide content. Facts were checked on 2026-11-12; items marked 「再確認」 had conflicting or secondary sources.
// Do not put booking confirmations, personal contacts or credentials in this public file.
window.GUIDE = {
  updated: '2026-11-12',
  disclaimer: '開放時間、票價、船班與法規以 2026/11/12 查到的公開資料整理，標示「再確認」者來源不一致；出發前與當天請以官方公告和訂房確認信為準。',
  trip: {name: '曼谷・沙美島', start: '2026-12-12', end: '2026-12-16', people: 15, route: '沙美島 1 晚 → 曼谷 3 晚'},

  stays: [
    {
      id: 'ratchada', main: true, mapHome: 'ratchada',
      name: 'Ratchada Retreat Boutique Suites', short: 'Ratchada Retreat', zh: '曼谷 Ratchada／Din Daeng',
      when: '12/13–12/16 · 3 晚', who: '全團',
      query: 'Ratchada Retreat Boutique Suites', placeId: 'ChIJu2qNA6ef4jARC7qjW5LbJAA', lat: 13.7628673, lng: 100.5634893,
      address: '582/30 Thanon Asok-Din Daeng, Din Daeng, Bangkok 10400',
      addressTh: '582/30 ถ. อโศก - ดินแดง แขวงดินแดง เขตดินแดง กรุงเทพมหานคร 10400',
      phone: '+66 83 847 2513',
      facts: [
        ['入住', '15:00 後（12/13）'],
        ['退房', '11:00 前（12/16）'],
        ['最近捷運', 'MRT 藍線 Phra Ram 9（BL20），步行約 10–12 分鐘（約 850 m）']
      ],
      notes: [
        '步行約 9 分鐘可到 Central Rama 9 百貨（超市、美食街、換匯）。',
        '往北約 1 km 是 MRT Thailand Cultural Centre 站一帶的夜市與 Esplanade。',
        '同一業主另有名稱相近的物業（Boutique Homestay、Bespoke Urban Villa），叫車時請認明地址 582/30 Asok-Din Daeng。'
      ],
      warn: '電話與泰文地址取自 Google 地圖商家資料（2026/11/12）；入住方式與聯絡窗口仍以訂房確認信為準。',
      links: [['Booking 頁面', 'https://www.booking.com/hotel/th/ratchada-retreat-boutique-suites.html']]
    },
    {
      id: 'baanploy', mapPlace: 'baanploy',
      name: 'Baan Ploy Sea', short: 'Baan Ploy Sea', zh: '班普羅海飯店・沙美島 Ao Noi Na',
      when: '12/12 · 1 晚', who: '全團',
      query: 'Baan Ploy Sea Koh Samet', lat: 12.57543, lng: 101.45715,
      address: '84 Moo 4, Tumbol Phe, Amphur Mueng, Rayong 21160（實際位置在島上北岸 Ao Noi Na）',
      addressTh: 'บ้านพลอยทะเล เกาะเสม็ด (อ่าวน้อยหน่า)',
      phone: '+66 38 644 355',
      facts: [
        ['入住', '15:00'],
        ['退房', '12:00'],
        ['飯店手機', '+66 61 413 8457'],
        ['接駁船碼頭', 'Ban Phe 的 Ao Prao Pier（飯店集團自有碼頭，不是 Nuan Thip）'],
        ['去程船班', 'Ban Phe → 沙美島：11:00／13:30／16:00'],
        ['回程船班', 'Na Dan 碼頭 → Ao Prao Pier：10:00／12:30／15:00（提前 30 分鐘在大廳等）'],
        ['船資', '來回成人 340 泰銖；包快艇單程 7–18 人每艘 5,000 泰銖'],
        ['周邊', '便利商店與 ATM 約 850 m；Sai Kaew Beach 約 1.2 km；大廳前有島上計程車']
      ],
      notes: [
        '出發前 30 分鐘到 Ao Prao Pier 報到；15 人建議先向飯店登記船班或包船。',
        '上島需付國家公園門票，是否由飯店代收未確認，請每人備 300 泰銖現金。'
      ],
      links: [['飯店官網', 'https://www.baanploysea.com/'], ['接駁船說明', 'https://www.baanploysea.com/transportation/'], ['Ao Prao Pier 位置', 'https://goo.gl/maps/q6UnTsFds2mRZZme7']]
    },
    {
      id: 'seaqueen', mapPlace: 'seaqueen',
      name: 'SEAQUEEN The Pool, Koh Samed', short: 'SEAQUEEN The Pool', zh: '沙美島・Na Dan 碼頭附近',
      when: '12/12 · 1 晚', who: '部分成員',
      query: 'SEAQUEEN The Pool Koh Samed', lat: 12.5738074, lng: 101.464078,
      address: 'No. 8, Na Dan Pier, Koh Samet, Phe, Rayong 21160（Na Dan 碼頭旁，Sai Kaew Beach 約 750 m）',
      addressTh: 'เลขที่ 8 ท่าเรือหน้าด่าน เกาะเสม็ด ตำบลเพ เมือง ระยอง 21160',
      phone: '+66 94 956 4850',
      facts: [
        ['入住', '14:00 起（21:00 後抵達請前一天告知）'],
        ['退房', '11:30 或 12:00（各訂房站寫法不同，再確認）'],
        ['接駁', '飯店不提供接駁；由 Na Dan 碼頭步行或搭雙條車'],
        ['與 Baan Ploy Sea', '直線約 0.8 km，步行約 15 分鐘或搭雙條車'],
        ['與 Na Dan 碼頭', '直線約 150 m，下船走路就到']
      ],
      links: [['Booking 頁面', 'https://www.booking.com/hotel/th/seaqueen-the-pool-koh-samed.html']]
    }
  ],
  stayNotes: [
    {id: 'near-rama9', title: 'Central Rama 9', sub: '離 Ratchada Retreat 最近的百貨', paras: ['步行約 9 分鐘，就在 MRT Phra Ram 9 站旁。超市、美食街、藥妝與換匯都在這裡解決。']},
    {id: 'near-night', title: 'Ratchada 夜市', sub: 'MRT Thailand Cultural Centre 站 3、4 號出口', paras: ['原 The One Ratchada（17:00–24:00）所在地，距住宿約 1 km。'], warn: '夜市名稱與營運狀況近期有變動（有來源稱 2026 年 3 月改以 Train Night Market Ratchada 重開），去之前先查 Google 地圖最新評論。'}
  ],

  // Extra details for the places in itinerary.js (names and coordinates come from there).
  places: {
    banphe: {name: 'Ban Phe・Ao Prao Pier', query: 'Ao Prao Pier Ban Phe', noTransit: true, brief: '搭飯店接駁船上島的碼頭',
      facts: [['飯店船班', '11:00／13:30／16:00（Baan Ploy Sea 接駁船）'], ['碼頭電話', '+66 38 651 134'], ['碼頭時間', '每日 07:00–18:00'], ['船資', '來回成人 340 泰銖']],
      tips: ['出發前 30 分鐘到碼頭報到。', '地圖上的標記是 Ban Phe 碼頭區的概略位置，實際上船處請用「Ao Prao Pier 位置」連結。', '住 SEAQUEEN 的人也可改搭 Nuan Thip 碼頭的公船到 Na Dan（單程約 50 泰銖，約每小時一班，船滿才開）。'],
      links: [['Ao Prao Pier 位置', 'https://goo.gl/maps/q6UnTsFds2mRZZme7']], keywords: '碼頭 船 接駁 Nuan Thip'},
    nadan: {noTransit: true, brief: '沙美島主要碼頭；回程接駁船在這裡上船',
      facts: [['回程飯店船', '10:00／12:30／15:00 → Ao Prao Pier'], ['公船', '往 Ban Phe 約 08:00–18:00，末班時間各來源不一，再確認']],
      tips: ['碼頭附近可租機車（每日約 400 泰銖起）、搭雙條車。', '國家公園售票處在碼頭往 Sai Kaew 的路上。'], keywords: '碼頭 船'},
    seaqueen: {name: 'SEAQUEEN The Pool（部分成員住宿）', query: 'SEAQUEEN The Pool Koh Samed', noTransit: true, brief: 'Na Dan 碼頭旁，14:00 起入住',
      paras: ['離碼頭直線約 150 m，下船後可先放行李。到 Baan Ploy Sea 直線約 0.8 km。'], links: [['住宿詳情', '#stay/seaqueen']]},
    baanploy: {name: 'Baan Ploy Sea（今晚住宿）', query: 'Baan Ploy Sea Koh Samet', noTransit: true, brief: '北岸 Ao Noi Na，15:00 入住',
      paras: ['全團住宿。SEAQUEEN The Pool 在 Na Dan 碼頭旁，兩邊直線約 0.8 km。'], links: [['住宿詳情', '#stay/baanploy']]},
    saikaew: {noTransit: true, brief: '島上最熱鬧的白沙灘，適合游泳',
      paras: ['沙細水淺，餐廳、酒吧最集中；晚上有海灘酒吧與火舞表演。離 Baan Ploy Sea 約 1.2 km。'],
      facts: [['國家公園門票', '外國成人 200 或 300 泰銖（來源不一），請備 300 泰銖現金']],
      tips: ['售票處可能不收卡。', '票根留著，進出海灘可能會查。'], keywords: '海灘 火舞 酒吧 門票'},
    aophai: {noTransit: true, brief: 'Sai Kaew 南邊步行約 10 分鐘，稍微安靜', paras: ['一樣有海灘酒吧與火舞，但人比 Sai Kaew 少，適合看夕陽後續攤。'], keywords: '海灘 酒吧 夕陽'},

    palace: {query: 'Grand Palace Bangkok', brief: '外國人 500 泰銖・15:30 前入場',
      facts: [['售票／入場', '08:30–15:30（官網關門時間寫法不一，請 15:30 前進場）'], ['門票', '500 泰銖，含玉佛寺；線上票不可退改'], ['入口', 'Mani Noppharat 門'], ['最近車站', 'MRT Sanam Chai 步行約 15 分鐘；或 Tha Chang 碼頭']],
      tips: ['服裝要遮肩、遮膝：不可無袖、短褲、短裙、破褲。', '門口附近自稱「今天休館」來搭話的人不要理，直接走到售票處。'],
      warn: '2026 年 8 月曾因王室儀式縮短開放並加嚴服裝規定，12 月是否仍受影響未確認，出發前看官網公告。',
      links: [['官方購票', 'https://www.royalgrandpalace.th/en/buy-ticket']], keywords: '大皇宮 門票 服裝 寺廟'},
    emerald: {query: 'Wat Phra Kaew Bangkok', brief: '在大皇宮內，同一張門票', paras: ['玉佛寺位於大皇宮範圍內，不需另外購票。殿內不可拍照，進殿需脫鞋。'], keywords: '玉佛寺 寺廟'},
    watpho: {query: 'Wat Pho Bangkok', brief: '300 泰銖・08:00–19:30',
      facts: [['開放', '08:00–19:30'], ['門票', '300 泰銖'], ['最近車站', 'MRT Sanam Chai 1 號出口，步行 3–10 分鐘']],
      tips: ['不可穿短褲，需穿著得體。', '寺內有著名的泰式按摩學校，想按要現場排。'], links: [['官方資訊', 'https://watpho.com/en/contact/plan']], keywords: '臥佛寺 門票 按摩 寺廟'},
    watarun: {query: 'Wat Arun Bangkok', brief: '對岸；從 Tha Tien 搭渡船過河',
      facts: [['開放', '約 08:00–18:00，最後入場約 17:30（再確認）'], ['門票', '多數資料寫 200 泰銖（再確認）'], ['過河渡船', 'Tha Tien 碼頭上船，約 5–8 泰銖，請備零錢；約營運到 18:00']],
      tips: ['遮肩遮膝，門口可借沙龍。', '塔上階梯很陡，穿好走的鞋。', '傍晚從對岸（Tha Tien 一側）看夕陽最漂亮。'], keywords: '鄭王廟 渡船 門票 夕陽 寺廟'},
    supanniga: {query: 'Supanniga Eating Room Tha Tien', brief: '河景泰菜・15 人請先訂位',
      facts: [['地址', '392/25-26 Maha Rat Rd'], ['電話', '+66 92 253 9251'], ['營業', '約 11:00–22:00（各來源略有出入，另有一說週一公休，再確認）']],
      tips: ['頂樓可看鄭王廟夕陽，晚餐時段要先訂。', '可電話、米其林指南頁面或 Klook 套餐訂位。'],
      links: [['米其林頁面', 'https://guide.michelin.com/en/bangkok-region/bangkok/restaurant/supanniga-eating-room-tha-tian']], keywords: '餐廳 晚餐 訂位 泰菜'},
    iconsiam: {query: 'ICONSIAM', brief: '河岸百貨・10:00–22:00',
      facts: [['營業', '10:00–22:00'], ['接駁船', 'Sathorn 碼頭（BTS Saphan Taksin）出發，約 8–12 泰銖，每 15–20 分鐘一班'], ['捷運', '金線 Charoen Nakhon 站有連通道']],
      tips: ['G 樓 SookSiam 是室內水上市場風格的小吃區。', '回 Ratchada 人多時直接叫車最省事。'], keywords: '百貨 購物 接駁船'},
    paragon: {query: 'Siam Paragon', brief: 'BTS Siam 直通・10:00–22:00', facts: [['營業', '每日 10:00–22:00'], ['最近車站', 'BTS Siam 直通']], tips: ['地下樓 Gourmet Market 適合買伴手禮；同店同日滿 2,000 泰銖可辦退稅。'], keywords: '百貨 購物 伴手禮 退稅'},
    central: {query: 'CentralWorld Bangkok', brief: '空橋連 Siam 與 Chit Lom・10:00–22:00', facts: [['營業', '10:00–22:00'], ['最近車站', 'BTS Chit Lom 或 Siam，走空橋']], keywords: '百貨 購物'},
    erawan: {query: 'Erawan Shrine Bangkok', brief: '免費・BTS Chit Lom 8 號出口',
      facts: [['開放', '約 06:00–22:00（有來源寫到 24:00）'], ['費用', '免費；供品現場購買'], ['最近車站', 'BTS Chit Lom 8 號出口約 100 m']],
      tips: ['順時針拜四面；穿著端莊即可。', '供品在神壇內的攤位買，路邊兜售的較貴。'], keywords: '四面佛 拜拜'},
    mega: {query: 'Mega Bangna', driveOnly: true, brief: '大型購物中心・10:00–22:00',
      facts: [['營業', '每日 10:00–22:00'], ['免費接駁車', 'BTS Udom Suk 5 號出口，7-Eleven 前站牌；約每 30 分鐘一班，車程約 40 分鐘'], ['接駁時間', 'Udom Suk 發車 08:00–22:00；商場回程 08:30–23:30']],
      tips: ['15 人從 Siam 過去建議包車或分車叫 Grab，比轉 BTS＋接駁車省時。'], links: [['官方交通說明', 'https://www.mega-bangna.com/en/service-guide/การเดินทาง/5']], keywords: '百貨 購物 接駁車 IKEA'},
    topgolf: {query: 'Topgolf Megacity Bangkok', driveOnly: true, brief: '在 Mega Bangna 旁・按打位計時收費',
      facts: [['營業', '週日至週四 09:00–23:00；週五、六 09:00–24:00'], ['收費', '按打位每小時計，每打位最多 6 人；價格依星期與時段變動'], ['參考價', '舊資料每打位每小時 850–1,450 泰銖，現價再確認']],
      tips: ['15 人需要 3 個打位，務必先預約（可在 14 天前到 3 小時前訂）。', '不需要自備球具。'], keywords: '高爾夫 預約'},
    terminal: {query: 'Terminal 21 Asok', brief: 'MRT Sukhumvit／BTS Asok 直通・10:00–22:00', facts: [['營業', '10:00–22:00'], ['從住宿', 'MRT Phra Ram 9 搭 2 站到 Sukhumvit，約 5 分鐘']], tips: ['5 樓 Pier 21 美食街便宜又多選擇，先在櫃台儲值卡片。'], keywords: '百貨 購物 美食街'},
    emsphere: {query: 'EmSphere Bangkok', brief: 'BTS Phrom Phong・週五六開到 24:00', facts: [['營業', '週日至週四 10:00–22:00；週五、六 10:00–24:00'], ['最近車站', 'BTS Phrom Phong']], keywords: '百貨 購物'},
    emquartier: {query: 'EmQuartier Bangkok', brief: 'BTS Phrom Phong 直通・10:00–22:00', facts: [['營業', '10:00–22:00'], ['最近車站', 'BTS Phrom Phong 直通']], keywords: '百貨 購物'},
    bigc: {query: 'Big C Ratchadamri', brief: '零食伴手禮採買・09:00 開門',
      facts: [['營業', '09:00 起，多數資料寫到凌晨 02:00（關門時間再確認）'], ['退稅', '同日滿 2,000 泰銖，憑護照到店內退稅櫃台開 P.P.10 表單'], ['最近車站', 'BTS Chit Lom']],
      tips: ['退稅櫃台樓層各來源不一，到場直接問。', '比百貨早開門，適合放在最後一天早上。'], keywords: '超市 伴手禮 零食 退稅'},
    airport: {query: 'Suvarnabhumi Airport Departures', driveOnly: true, brief: '蘇凡納布 BKK・回程',
      facts: [['出發', '原定 10:30 從市區出發'], ['車程', '不塞車推估 40–60 分鐘；尖峰（07:00–09:30、16:00–19:00）可能加倍']],
      tips: ['退稅金額滿 20,000 泰銖的人，報到前先到海關檢查櫃台驗貨。', '過移民關後到 VAT Refund 辦公室領款。'], links: [['退稅流程', '#info/vat'], ['機場交通', '#move/airport']], keywords: '機場 退稅 回程'}
  },

  days: [
    {id: 'd12', date: '2026-12-12', title: '沙美島', brief: '包車到 Ban Phe，搭船上島', sleep: 'baanploy',
      summary: '抵達後包車到 Ban Phe，從 Ao Prao Pier 搭飯店接駁船上島，入住 Baan Ploy Sea，下午到傍晚在 Sai Kaew Beach 與 Ao Phai。',
      steps: [
        {title: '曼谷 → Ban Phe 包車', icon: '車', paras: ['車程約 2.5–3.5 小時，尖峰更久。15 人加行李通常要 2 台 van。']},
        {place: 'banphe'},
        {title: '搭船上島', icon: '船', paras: ['飯店接駁船 11:00／13:30／16:00；錯過末班就要包快艇（7–18 人每艘單程 5,000 泰銖）。']},
        {place: 'nadan'}, {place: 'seaqueen'}, {place: 'baanploy'}, {place: 'saikaew'}, {place: 'aophai'}
      ],
      tips: ['每人備 300 泰銖現金付國家公園門票。', '島上便利商店與 ATM 離飯店約 850 m，防曬、水、現金先帶好。', '島上移動靠雙條車：共乘到 Sai Kaew／Ao Phai 每人約 20–60 泰銖，沒有公告價，上車前先講好。'],
      pending: ['搭哪一班船（或包快艇）', '海灘酒吧／夕陽地點']},
    {id: 'd13', date: '2026-12-13', title: '舊城・河岸', brief: '回曼谷，大皇宮、臥佛寺、鄭王廟', sleep: 'ratchada',
      summary: '上午搭船、包車回曼谷，下午走大皇宮、臥佛寺、鄭王廟，傍晚在 Supanniga 看夕陽吃晚餐，之後到 ICONSIAM。',
      steps: [
        {title: '沙美島 → Ban Phe → 曼谷', icon: '船', time: '10:00 船', paras: ['回程接駁船 10:00／12:30／15:00 從 Na Dan 碼頭開，提前 30 分鐘在飯店大廳等。Baan Ploy Sea 12:00 前退房。', '上岸後包車回曼谷約 2.5–3.5 小時。Ratchada Retreat 15:00 後才能入住。']},
        {place: 'palace'}, {place: 'emerald'}, {place: 'watpho'}, {place: 'watarun'}, {place: 'supanniga'}, {place: 'iconsiam'}
      ],
      tips: ['時間很緊：大皇宮 15:30 停止入場。搭 10:00 的船、11:00 左右從 Ban Phe 出發，最快也要 14:00 前後才到舊城。', '建議讓車直接開到大皇宮，行李留在車上，逛完再回住宿；或把大皇宮改到別天上午。', '今天全程寺廟：出門就穿遮肩、遮膝的衣服，鞋子好穿脫。', '晚上回住宿：MRT Sanam Chai 搭藍線直達 Phra Ram 9（11 站，約 25 分鐘）。'],
      pending: ['回程船班與包車時間', 'Supanniga 訂位']},
    {id: 'd14', date: '2026-12-14', title: 'Siam・Bangna', brief: '市中心購物，下午 Mega Bangna、Topgolf', sleep: 'ratchada',
      summary: '上午到 Siam 商圈（Paragon、CentralWorld、四面佛），下午往東南到 Mega Bangna，晚上 Topgolf。',
      steps: [
        {title: '住宿 → Siam', icon: '車', paras: ['MRT Phra Ram 9 → Sukhumvit，轉 BTS Asok 往 Khu Khot 方向 4 站到 Siam，含轉乘約 25–30 分鐘。MRT 可刷感應信用卡，BTS 要另外買票。']},
        {place: 'paragon'}, {place: 'central'}, {place: 'erawan'},
        {title: 'Siam → Bangna', icon: '車', paras: ['包車或分車叫 Grab 最省時。大眾運輸是 BTS 到 Udom Suk 再轉 Mega Bangna 免費接駁車（車程約 40 分鐘）。']},
        {place: 'mega'}, {place: 'topgolf'},
        {title: 'Bangna → 住宿', icon: '車', paras: ['距離遠、時間晚，直接叫車回 Ratchada。']}
      ],
      tips: ['Topgolf 按打位計時，15 人訂 3 個打位。', '百貨多半 10:00 才開門，不用太早出發。'],
      pending: ['Topgolf 預約時段']},
    {id: 'd15', date: '2026-12-15', title: 'Sukhumvit', brief: '睡晚一點，Asok／Phrom Phong 商圈', sleep: 'ratchada',
      summary: '睡晚後逛 Terminal 21、EmSphere、EmQuartier，安排按摩與 Rooftop。',
      steps: [
        {title: '住宿 → Asok', icon: '車', paras: ['MRT Phra Ram 9 搭 2 站到 Sukhumvit，出站就是 Terminal 21，約 5 分鐘。']},
        {place: 'terminal'},
        {title: 'Asok → Phrom Phong', icon: '車', paras: ['BTS Asok 往 Kheha 方向 1 站；走路約 15 分鐘也到得了。']},
        {place: 'emsphere'}, {place: 'emquartier'},
        {title: '按摩・Rooftop', icon: '夜', paras: ['店家尚未決定。15 人按摩要先預約，可以分兩家或分兩批。']}
      ],
      tips: ['最後一晚：先把退稅單與護照整理好，隔天直接帶去機場。', 'BTS 末班車約 24:00，建議 23:00 前進站，不然就叫車。'],
      pending: ['按摩店家', 'Rooftop 店家']},
    {id: 'd16', date: '2026-12-16', title: 'Siam・BKK', brief: '最後採買，前往機場', sleep: null,
      summary: '11:00 前退房，最後採買後前往蘇凡納布機場。',
      steps: [
        {title: '退房', icon: '住', time: '11:00 前', paras: ['Ratchada Retreat 11:00 前退房。']},
        {place: 'bigc'}, {place: 'paragon'}, {place: 'central'},
        {title: '前往機場', icon: '車', time: '10:30', paras: ['原定 10:30 出發。15 人加行李請預訂 2 台 van。']},
        {place: 'airport'}
      ],
      tips: ['時間衝突：原定 10:30 往機場，但百貨 10:00 才開門，只有 Big C（09:00 開）來得及。請依班機時間決定要不要保留 Siam 採買。', '退稅商品與護照、P.P.10 表單放隨身，不要託運前就封箱。'],
      pending: ['班機時間與出發往機場的時間', 'Siam 採買是否保留']}
  ],

  quick: [
    {title: '緊急電話', text: '觀光警察 1155・救護 1669', href: '#info/emergency'},
    {title: '回住宿', text: 'Ratchada Retreat 地址與導航', href: '#stay/ratchada'},
    {title: '捷運怎麼搭', text: '從住宿到各商圈', href: '#move/routes'},
    {title: '沙美島船班', text: '飯店接駁船與公船', href: '#move/boat'},
    {title: '機場', text: '車程與提前多久到', href: '#move/airport'},
    {title: '入境 TDAC', text: '抵達前 3 天內線上填', href: '#info/entry'},
    {title: '退稅', text: '滿 2,000 泰銖・P.P.10', href: '#info/vat'},
    {title: '寺廟服裝', text: '遮肩遮膝、好穿脫的鞋', href: '#info/temple'}
  ],

  todo: [
    {id: 'todo-tdac', text: '每個人：抵達日前 3 天內線上填好 TDAC'},
    {id: 'todo-passport', text: '每個人：護照效期 6 個月以上'},
    {id: 'todo-van12', text: '預訂 12/12 往 Ban Phe、12/13 回曼谷的包車（2 台 van）'},
    {id: 'todo-boat', text: '向 Baan Ploy Sea 登記 15 人船班，或包快艇'},
    {id: 'todo-d13', text: '決定 12/13 大皇宮怎麼排（15:30 停止入場）'},
    {id: 'todo-supanniga', text: 'Supanniga Tha Tien 訂 15 人晚餐'},
    {id: 'todo-topgolf', text: 'Topgolf 訂 3 個打位'},
    {id: 'todo-massage', text: '12/15 按摩與 Rooftop 選店、預約'},
    {id: 'todo-van16', text: '預訂 12/16 往機場的車，確認出發時間'},
    {id: 'todo-host', text: '向 Ratchada Retreat 房東確認入住方式與聯絡窗口'}
  ],

  move: [
    {id: 'routes', title: '從住宿出發', wide: true, cards: [
      {id: 'mrt-table', title: '從 Ratchada Retreat 搭捷運', sub: '起點：MRT 藍線 Phra Ram 9（BL20），步行約 10–12 分鐘',
        table: {head: ['目的地', '怎麼搭', '時間', '票價'], rows: [
          ['Sanam Chai（大皇宮、臥佛寺）', '藍線往 Lak Song 方向直達，11 站，不用轉車', '約 25 分鐘', '約 42 泰銖'],
          ['Sukhumvit／Asok（Terminal 21）', '藍線 2 站到 Sukhumvit', '約 5 分鐘', '約 20 泰銖'],
          ['Phrom Phong（EmSphere、EmQuartier）', 'MRT 到 Sukhumvit，轉 BTS Asok 往 Kheha 方向 1 站', '約 20 分鐘', 'MRT＋BTS 分開買'],
          ['Siam（Paragon、CentralWorld）', 'MRT 到 Sukhumvit，轉 BTS Asok 往 Khu Khot 方向 4 站', '約 25–30 分鐘', 'MRT＋BTS 分開買']]},
        warn: '行車時間以每站約 2 分鐘推估，不含走到車站與等車；實際請用 Google 地圖查。'}
    ]},
    {id: 'rail', title: '捷運 MRT／BTS', cards: [
      {id: 'mrt', title: 'MRT（地鐵）', facts: [['付款', '可直接刷感應信用卡（Visa／Mastercard／銀聯）進出站'], ['票價', '17–44 泰銖'], ['營運', '約 06:00–24:00']], tips: ['一人一卡，不能一張卡刷多人。', '進站要過安檢門，大包包可能被要求打開。']},
      {id: 'bts', title: 'BTS（空鐵）', facts: [['付款', '不能刷信用卡；買單程票或 Rabbit 卡'], ['票價', '約 17–65 泰銖'], ['營運', '約 06:00–24:00']], tips: ['售票機多半只收硬幣或小鈔，人多時直接到櫃台買。', 'MRT 與 BTS 是不同系統，轉乘要出站重新買票。', '深夜回程抓 23:00 前進站。']}
    ]},
    {id: 'car', title: '叫車與包車', cards: [
      {id: 'grab', title: 'Grab／Bolt', paras: ['兩個 App 都能用。Bolt 通常便宜兩三成，Grab 車多、較穩定；尖峰與下雨會加價。'], tips: ['15 人要分 4 台一般車，或叫 2–3 台大車（GrabVan／6 人座）。', '上車地點選好找的大門或 7-Eleven，司機比較不會迷路。', '路邊計程車請司機跳表（meter）；不跳表就換一台。']},
      {id: 'van', title: '15 人包車', paras: ['一台 van 約坐 9–10 人，15 人加行李通常要 2 台。'], facts: [['市區參考價', '每台 10 小時含司機約 3,950 泰銖，超時每小時約 300 泰銖'], ['曼谷 ↔ Ban Phe', '單程約 2.5–3.5 小時；報價請直接詢問車行']], tips: ['12/12、12/13、12/14（Bangna）、12/16（機場）最適合包車。', '過路費、停車費是否內含，預訂時先問清楚。']}
    ]},
    {id: 'boat', title: '沙美島船班', cards: [
      {id: 'hotel-boat', title: 'Baan Ploy Sea 接駁船', sub: 'Ban Phe 的 Ao Prao Pier ↔ 沙美島',
        facts: [['去程', '11:00／13:30／16:00'], ['回程', '10:00／12:30／15:00（Na Dan 碼頭 → Ao Prao Pier）'], ['船資', '來回成人 340 泰銖'], ['包快艇', '單程每艘：1–6 人 2,500 泰銖；7–18 人 5,000 泰銖'], ['碼頭電話', '+66 38 651 134'], ['碼頭停車', '住客每車每晚 100 泰銖']],
        tips: ['出發前 30 分鐘到碼頭報到。', '回程提前 30 分鐘在飯店大廳等。'], links: [['官方船班', 'https://www.baanploysea.com/transportation/'], ['Ao Prao Pier 位置', 'https://goo.gl/maps/q6UnTsFds2mRZZme7']]},
      {id: 'public-boat', title: '公船與快艇', sub: 'Nuan Thip 碼頭 ↔ Na Dan 碼頭',
        facts: [['公船', 'Ban Phe 出發約 09:00 起每小時一班；單程 50、來回 100 泰銖'], ['末班', '16:00–18:00 之間，各來源不一，再確認'], ['快艇', '無固定班次，10 人分攤約每人 250 泰銖']],
        tips: ['公船是船滿才開，時刻只能參考。', 'SEAQUEEN The Pool 離 Na Dan 碼頭近，搭公船最順。']},
      {id: 'island', title: '島上交通與門票', facts: [['雙條車', '共乘到 Sai Kaew／Ao Phai 每人約 20–60 泰銖；包車到南部海灘 200–600 泰銖'], ['租機車', 'Na Dan 碼頭附近每日約 400 泰銖起'], ['國家公園門票', '外國成人 200 或 300 泰銖，請備 300 泰銖現金']], tips: ['雙條車沒有公告價，上車前先講好。', '島上路陡且多沙，不熟機車不要騎。']}
    ]},
    {id: 'airport', title: '機場', cards: [
      {id: 'bkk', title: '蘇凡納布機場 BKK', facts: [['從 Ratchada 搭車', '不塞車推估 40–60 分鐘；尖峰（07:00–09:30、16:00–19:00）可能加倍'], ['大眾運輸', 'MRT 轉機場快線約 35–50 分鐘（帶行李較辛苦）'], ['建議', '起飛前 3–4 小時從住宿出發'], ['計程車', '機場排班跳表車另加 50 泰銖機場費與過路費']], tips: ['要退稅的人再多抓 30 分鐘。', '回程 12/16 原定 10:30 出發，請依班機時間回推。']}
    ]}
  ],

  info: [
    {id: 'before', title: '入境與出發前', cards: [
      {id: 'entry', title: '入境泰國', facts: [['簽證', '台灣護照免簽 30 天（2026/9/15 起由 60 天改為 30 天）'], ['護照', '效期 6 個月以上'], ['TDAC', '所有外國旅客必填、免費；抵達前 3 天內（含抵達日）線上填']], warn: 'TDAC 只在官方網站 tdac.immigration.go.th 填寫，搜尋結果裡收費的都是代辦或仿冒網站。', links: [['TDAC 官方網站', 'https://tdac.immigration.go.th']]},
      {id: 'weather', title: '12 月中天氣', facts: [['曼谷', '約 21–32°C，乾季、少雨'], ['沙美島', '約 24–30°C，海水約 28°C']], tips: ['白天熱、百貨與捷運冷氣強，帶一件薄外套。', '防曬、帽子、太陽眼鏡必備。']},
      {id: 'power', title: '電壓與插座', paras: ['220V／50Hz。台灣兩扁腳插頭通常可以直接插，但電器本身要支援 220V（手機、筆電充電器一般都支援；吹風機、離子夾要看標示）。']}
    ]},
    {id: 'money', title: '錢與通訊', cards: [
      {id: 'cash', title: '匯率與現金', facts: [['匯率', '1 泰銖約 0.96–0.99 新台幣（2026 年 11 月初中價）'], ['心算', '泰銖價格幾乎等於台幣價格']], tips: ['寺廟門票、渡船、雙條車、國家公園門票、夜市都收現金。', '市區換匯所匯率通常比機場好；Central Rama 9 就有。', '百貨、餐廳、MRT 可刷卡。']},
      {id: 'tip', title: '小費', paras: ['不是強制。餐廳帳單沒有服務費時留零錢或約一成；按摩每人 50–100 泰銖；行李員、司機 20–50 泰銖。']},
      {id: 'vat', title: 'VAT 退稅', facts: [['門檻', '同一家店、同一天滿 2,000 泰銖'], ['店內', '出示護照，索取 P.P.10 表單與稅務發票'], ['機場（未滿 20,000 泰銖）', '不用海關蓋章，過移民關後到 VAT Refund 辦公室領款'], ['機場（滿 20,000 泰銖）', '報到前先到海關檢查櫃台驗貨蓋章'], ['領款', '30,000 泰銖以內可領現金']], tips: ['購買後 60 天內離境才能退。', '要驗貨的商品不要先託運。'], links: [['機場官方說明', 'https://suvarnabhumi.airportthai.co.th/service/facility/detail/43']]}
    ]},
    {id: 'rules', title: '規定與禮儀', cards: [
      {id: 'temple', title: '寺廟服裝與禮儀', list: ['遮肩、遮膝：不穿無袖、短褲、短裙、破褲。', '進殿脫鞋，穿好穿脫的鞋和襪子。', '不要用腳指向佛像，女性不碰觸僧侶。', '玉佛寺殿內不可拍照。', '12/13 一整天都在寺廟，出門就穿對，不用現場租借。']},
      {id: 'alcohol', title: '酒類', facts: [['販售時段', '11:00–24:00（下午禁售已於 2026/5/29 取消）'], ['年齡', '20 歲以上']], tips: ['午夜後商店不賣酒。', '佛教節日與選舉日全國禁售；寺廟、公園內禁止飲酒。']},
      {id: 'vape', title: '電子菸與大麻', list: ['電子菸在泰國全面違法，攜帶入境、持有都會被罰，請不要帶。', '大麻自 2025 年 6 月起僅限醫療用途，購買需處方；公共場所吸食會被罰。', '任何大麻製品帶回台灣都是違法的，包含零食、飲料。'], warn: '買零食、飲料時留意包裝上的大麻葉圖案。'}
    ]},
    {id: 'emergency', title: '緊急聯絡', cards: [
      {id: 'numbers', title: '緊急電話', facts: [['觀光警察（可說英文）', '1155'], ['救護車', '1669'], ['警察', '191'], ['消防', '199']], tips: ['遇到糾紛、被敲竹槓先打 1155。', '護照遺失：先到警局報案，再聯絡辦事處。']},
      {id: 'teco', title: '駐泰國台北經濟文化辦事處', facts: [['急難救助電話', '+66 81 666 4006'], ['總機電話', '+66 2 119 3555'], ['地址', '40/64 Vibhavadi-Rangsit 66, Laksi, Bangkok 10210'], ['外交部旅外急難專線', '台灣國內免付費 0800-085-095']], tips: ['急難救助電話限車禍、搶劫、被捕等緊急狀況使用。'], links: [['外交部領事事務局', 'https://www.boca.gov.tw/sp-foof-countrycp-03-24-dec45-03-1.html']]}
    ]},
    {id: 'thai', title: '常用泰語', wide: true, cards: [
      {id: 'phrases', title: '指給對方看也可以', table: {head: ['中文', '泰文', '唸法'], rows: [
        ['你好', 'สวัสดี', 'sa-wat-dee（男生加 khrap，女生加 kha）'],
        ['謝謝', 'ขอบคุณ', 'khop-khun'],
        ['多少錢？', 'เท่าไหร่', 'thao-rai'],
        ['不要辣', 'ไม่เผ็ด', 'mai phet'],
        ['不要香菜', 'ไม่ใส่ผักชี', 'mai sai phak-chi'],
        ['結帳', 'เช็คบิล', 'chek-bin'],
        ['廁所在哪裡？', 'ห้องน้ำอยู่ที่ไหน', 'hong-nam yu thi-nai'],
        ['請跳表', 'เปิดมิเตอร์ด้วย', 'poet mi-toe duai'],
        ['去這裡', 'ไปที่นี่', 'pai thi-ni']]}}
    ]},
    {id: 'packing', title: '行李清單', checklist: [
      {id: 'pack-passport', text: '護照（效期 6 個月以上）、TDAC 填寫完成畫面'},
      {id: 'pack-cash', text: '泰銖現金與一張感應信用卡（MRT 可直接刷）'},
      {id: 'pack-sim', text: '上網：eSIM 或 SIM 卡，出發前先開通測試'},
      {id: 'pack-apps', text: '手機裝好 Grab、Bolt、Google 地圖（先下載曼谷與沙美島離線地圖）'},
      {id: 'pack-temple', text: '寺廟用：有袖上衣、過膝長褲或長裙、好穿脫的鞋'},
      {id: 'pack-beach', text: '海島用：泳衣、防曬、帽子、太陽眼鏡、拖鞋、防水袋'},
      {id: 'pack-jacket', text: '薄外套（百貨、捷運、包車冷氣很強）'},
      {id: 'pack-meds', text: '常備藥：腸胃藥、止痛藥、暈船藥、防蚊液'},
      {id: 'pack-charger', text: '充電器、行動電源（放隨身行李，不可託運）'},
      {id: 'pack-novape', text: '不要帶電子菸'}
    ]}
  ]
};
