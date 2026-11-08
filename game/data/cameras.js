'use strict';
/* ===================================================================
   カメラの一覧（全章で共通）
   - Observer.camera('ID', { place: 場所の表示名, bg: 背景の種類, mic: 音が入るか })
   - bg の種類は js/renderer.js の BACKGROUNDS を参照
   - 並べた順に、モニター壁に並ぶ（章ごとに @cameras で絞れる）
   =================================================================== */

Observer.camera('CAM-00', { place: 'B2 中央監視室', bg: 'room' });
Observer.camera('CAM-01', { place: '1F ロビー', bg: 'lobby' });
Observer.camera('CAM-02', { place: '1F ブランドショップ', bg: 'shop' });
Observer.camera('CAM-03', { place: '1F 東廊下', bg: 'corridor' });
Observer.camera('CAM-04', { place: '1F バックヤード', bg: 'backyard', mic: true });
Observer.camera('CAM-05', { place: 'エレベーター 1号機', bg: 'elevator' });
Observer.camera('CAM-06', { place: '6F エレベーターホール', bg: 'evhall' });
Observer.camera('CAM-07', { place: '6F 城ヶ崎・高東法律事務所', bg: 'office' });
Observer.camera('CAM-08', { place: '9F エレベーターホール', bg: 'evhall9' });
Observer.camera('CAM-09', { place: '屋上', bg: 'roof' });
Observer.camera('CAM-10', { place: '非常階段', bg: 'stairs' });
