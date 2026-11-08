'use strict';
/* ===================================================================
   カメラの一覧（全章で共通）
   - Observer.camera('ID', { place: 場所の表示名, bg: 線の背景の種類, mic: 音が入るか, bgimg: 背景の絵 })
   - bg の種類は js/renderer.js の BACKGROUNDS を参照
   - bgimg は game/assets/ からのパス。絵のファイルがあれば bg の代わりに使う（なければ bg）
   - 並べた順に、モニター壁に並ぶ（章ごとに @cameras で絞れる）
   =================================================================== */

Observer.camera('CAM-00', { place: 'B2 中央監視室', bg: 'room', bgimg: 'bg/cam00_room.jpg' });
Observer.camera('CAM-01', { place: '1F ロビー', bg: 'lobby', bgimg: 'bg/cam01_lobby.jpg' });
Observer.camera('CAM-02', { place: '1F ブランドショップ', bg: 'shop', bgimg: 'bg/cam02_shop.jpg' });
Observer.camera('CAM-03', { place: '1F 東廊下', bg: 'corridor', bgimg: 'bg/cam03_corridor.jpg' });
Observer.camera('CAM-04', { place: '1F バックヤード', bg: 'backyard', mic: true, bgimg: 'bg/cam04_backyard.jpg' });
Observer.camera('CAM-05', { place: 'エレベーター 1号機', bg: 'elevator', bgimg: 'bg/cam05_elevator.jpg' });
Observer.camera('CAM-06', { place: '6F エレベーターホール', bg: 'evhall', bgimg: 'bg/cam06_evhall6.jpg' });
Observer.camera('CAM-07', { place: '6F 城ヶ崎・高東法律事務所', bg: 'office', bgimg: 'bg/cam07_office.jpg' });
Observer.camera('CAM-08', { place: '9F エレベーターホール', bg: 'evhall9', bgimg: 'bg/cam08_evhall9.jpg' });
Observer.camera('CAM-09', { place: '屋上', bg: 'roof', bgimg: 'bg/cam09_roof.jpg' });
Observer.camera('CAM-10', { place: '非常階段', bg: 'stairs', bgimg: 'bg/cam10_stairs.jpg' });
