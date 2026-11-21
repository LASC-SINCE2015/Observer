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
Observer.camera('CAM-07', { place: '6F 城ヶ崎法律事務所', bg: 'office', bgimg: 'bg/cam07_office.jpg' });
Observer.camera('CAM-08', { place: '9F エレベーターホール', bg: 'evhall9', bgimg: 'bg/cam08_evhall9.jpg' });
Observer.camera('CAM-09', { place: '屋上', bg: 'roof', bgimg: 'bg/cam09_roof.jpg' });
Observer.camera('CAM-10', { place: '非常階段', bg: 'stairs', bgimg: 'bg/cam10_stairs.jpg' });
Observer.camera('CAM-11', { place: '3F クリニック前の廊下', bg: 'corridor', bgimg: 'bg/cam11_clinic.jpg' });
Observer.camera('CAM-12', { place: '3F 院長室', bg: 'office', mic: true, bgimg: 'bg/cam12_director.jpg' });
Observer.camera('CAM-13', { place: 'B1 駐車場', bg: 'dark', bgimg: 'bg/cam13_parking.jpg' });
// 第3章（CAM-14〜19 を使う。CAM-19 は予備）
Observer.camera('CAM-14', { place: '9F サロン裏口の通路', bg: 'corridor', mic: true, bgimg: 'bg/cam14_salon_back.jpg' });
Observer.camera('CAM-15', { place: '9F サロン入口前', bg: 'evhall9', bgimg: 'bg/cam15_salon_entrance.jpg' });
Observer.camera('CAM-16', { place: '9F 非常階段の踊り場', bg: 'stairs', bgimg: 'bg/cam16_stair_landing.jpg' });
Observer.camera('CAM-17', { place: 'B1 機械室前', bg: 'corridor', bgimg: 'bg/cam17_b1_machine.jpg' });
Observer.camera('CAM-18', { place: '9F 非常階段の扉前', bg: 'corridor', bgimg: 'bg/cam18_stair_door9.jpg' });
// 第5章（CAM-26〜32 を使う）
Observer.camera('CAM-26', { place: '9F 観覧室（隠しカメラ）', bg: 'dark', mic: true, bgimg: 'bg/cam26_viewing_room.jpg' });
Observer.camera('CAM-27', { place: '9F サロン正面（観覧会の回線）', bg: 'evhall9', mic: true, bgimg: 'bg/cam27_salon_front.jpg' });
Observer.camera('CAM-28', { place: 'B3 地下3階', bg: 'dark' });
// 第4章（CAM-20・23・24 を使う。9F のサロンの裏口・入口は第3章の CAM-14・15、踊り場は CAM-16 を、そのまま使う。CAM-21・22・25 は欠番）
Observer.camera('CAM-20', { place: 'B2 機械室の前', bg: 'corridor', bgimg: 'bg/cam20_machine_corridor.jpg' });
Observer.camera('CAM-23', { place: '9F 業務用エレベーター前', bg: 'evhall', bgimg: 'bg/cam23_service_lift.jpg' });
Observer.camera('CAM-24', { place: '保守用の回線（映像元不明）', bg: 'dark', bgimg: 'bg/cam24_unknown_line.jpg' });
