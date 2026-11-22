# 第5章で足す絵のプロンプト

`prompts_en.md` と同じ形式（英語のプロンプトと日本語訳）。第5章の台本（`game/scenario/chapter5.js`）が参照している絵のうち、まだないものです。絵がなくても、台本は線画の代わりで最後まで遊べます。絵ができたら、`prompts_en.md` に移して ⬜ → ✅ にします。

全 16 枚（立ち絵 2・カメラの背景 2・場面の絵 12）。すべて生成済み（✅）。2026-11-21 に立ち絵 2・背景 2・場面の絵 5、2026-11-22 に残りの場面の絵 7 枚（`ch5_b3_stairs`・`ch5_b3_pit`・`ch5_reiko_stairs`・`ch5_sd_yashima`・`ch5_sd_makabe`・`ch5_flashback_office`・`ch5_mall_atrium`）を生成した。2026-11-22 には、台本の「七人の男女・七つの席」に合わせ、`bg/cam26_viewing_room` を席 7 つにそろえて作り直し、会員が写る `ch5_viewing_empty`・`ch5_viewing_kuzumi`・`ch5_viewing_members`・`ch5_viewing_raid` を男女まぜの会員で作り直した（下のプロンプトは作り直した版）。

生成のときに、プロンプトから変えた点:

- `ch5_viewing_raid`: 一度目に床にこぼれたワインが血のように見えたので、同じチャットで「赤い液だまりを消し、倒れた空のグラスだけにする」と頼み直した版を使った。
- `ch5_viewing_*` は、同じチャットで `bg/cam26_viewing_room` の添付を引き継いで続けて作った。
- `ch5_machine_room_tape` は、`ch4_machine_corridor` を同じチャットで直して作った。規制テープは、扉に斜めに 1 本でなく、X の形で貼られた。
- `makabe_normal` は、`chars/okochi_normal` を添付し、「別の男。背景と服は無視」と書き足した。台本・`cameras.js`・`characters.js` が指す名前と、すべて一致している（R33 で確認）。
2026-11-22 の生成で、プロンプトから変えた点:

- `ch5_mall_atrium`: 添付なしの指定だったが、色調をそろえるため `bg/cam01_lobby` を添付し、「同じ絵柄・色で、昼の明るい設定」と書き足した。
- `ch5_b3_pit`: `bg/cam13_parking` を添付し、「同じ絵柄・色」と書き足した。炎のそばの男は 1 人、懐中電灯の光は左から（人影は小さく、数はあいまい）。
- `ch5_sd_makabe`: 7 席にそろえるため、「会員 6 人（男女まぜ・40〜70 代）が 7 つの椅子に座る」と書き足した。構図は添付の cam26 と少し変わり、モニターの壁が左に来た。
- `ch5_sd_yashima`: `scenes/ch4_self_9d` を添付し、「添付の場面を映した大きなモニター」と書いた。画面の端の吹き出しの列は、小さく読めない記号になっている。
- `ch5_reiko_stairs`: `bg/cam10_stairs` と `chars/reiko_normal`（人物。背景は無視）を添付し、「黒い長い髪・長い白いコート」と書いた。
- `ch5_b3_stairs`: 同じチャットで `ch5_reiko_stairs` の次に作った（同じ階段の絵柄で、暗がりへ降りる）。
- `ch5_flashback_office`: 同じチャットで `ch4_flash_office` の続きとして作り（同じ部屋・同じ家具）、「夕方の光・卓上ライト・26 歳の男と白髪の男。女は消す」と頼んだ。

共通の決まり:

- 場面の絵は `scenes/`（16:9）、カメラの背景は `bg/`（16:9、人なし）、立ち絵は `chars/`（縦長 2:3）。
- カメラの絵（`ch5_viewing_*`・`cam26`・`cam27`）は、隅の天井の防犯カメラから見下ろす構図（`Small figure as seen by a ceiling security camera.`、`The security camera itself is not visible.`）。
- 文字・時計・時刻・ロゴは入れない。

## 新しい立ち絵（2 枚）

| ファイル名 | 描くもの |
|---|---|
| `chars/makabe_normal` | 真壁征一郎（61 歳）。白髪をきれいになでつけ、上等な黒っぽいスーツ。穏やかな無表情。目だけが笑っていない。グリーンバック |
| `chars/makabe_smile` | 同じ人物。穏やかな微笑み。ワインのグラスは持たない。グリーンバック |

### ✅ makabe_normal

添付: `chars/okochi_normal`（絵柄・大きさの手本）

```
Japanese anime style visual novel portrait, vertical 2:3, no text. A distinguished man of 61 with neatly combed white hair, wearing an expensive dark charcoal suit, a crisp white shirt and a dark tie. Calm, courteous, expressionless face; the corners of his mouth are still, his eyes steady and cold like someone watching from above. Same art style, line weight and proportions as the attached image. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
```

> **日本語訳**: 日本のアニメ調のノベルゲームの立ち絵、縦長 2:3、文字なし。白髪をきれいになでつけた 61 歳の品のある男。高そうな濃い灰色のスーツ、真っ白なシャツ、暗い色のネクタイ。穏やかで礼儀正しい無表情。口もとは動かず、目は、上から見下ろす人のように静かで冷たい。絵柄・線の太さ・体の比率は添付の絵と同じ。背景はクロマキー用の緑一色。人物に緑の光は入れない。

### ✅ makabe_smile

添付: `chars/makabe_normal`

```
Same character, same face, hair and suit as the attached image. Japanese anime style visual novel portrait, vertical 2:3, no text. A gentle, polite smile on his lips, as if complimenting someone; his eyes stay calm and do not smile. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
```

> **日本語訳**: 添付の絵と同じ人物・顔・髪・スーツ。日本のアニメ調のノベルゲームの立ち絵、縦長 2:3、文字なし。人をほめるような、やさしく礼儀正しい微笑み。目は静かなままで、笑っていない。背景はクロマキー用の緑一色。人物に緑の光は入れない。

## 新しいカメラの背景（2 枚）

### ✅ bg/cam26_viewing_room（CAM-26　9F 観覧室（隠しカメラ））

添付: `bg/cam26_viewing_room`（初版。これを直して 7 席にそろえた）

```
Generate an image. Edit the attached image. Keep exactly the same room, camera angle, composition, lighting, colors and art style (hidden camera high in a corner, a whole wall of glowing monitors, wine-red and black tones). Only fix the seating: there must be exactly SEVEN leather armchairs for members in a shallow arc facing the monitor wall (count them: seven, not eight), each with a small side table holding a wine glass or bottle, plus one larger single head seat on a low dais in the centre back (separate from the seven). No people. No text, no letters, no clock, no timestamp, no logo, no watermark. The security camera itself is not visible. Horizontal 16:9.
```

> **日本語訳**: 添付の絵を直す（2026-11-22 の作り直し）。部屋・角度・構図・明かり・色・絵柄（隅の高い所の隠しカメラ、壁一面の光るモニター、ワイン色と黒の色調）はそのまま。席の数だけ直す: 会員用の革張りの椅子は、モニターの壁に向かう浅い弧に、ちょうど 7 つ（数える: 8 でなく 7）。それぞれ小さな机にワイングラスかボトル。奥の中央の一段高い台に、ひと回り大きなひとり掛けの上座（7 つとは別）。人はいない。文字・時計・ロゴは入れない。防犯カメラ自体は映さない。

### ✅ bg/cam27_salon_front（CAM-27　9F サロン正面（観覧会の回線））

添付: `bg/cam15_salon_entrance`（第3章の、同じサロンの入口。扉・床・植物・壁の額を同じにする）、`bg/cam08_evhall9`

```
Generate an image. Edit the first attached image. Keep exactly the same 9th-floor hall, the same wooden double door of the members-only salon, the same bright marble floor, white walls, potted plants, lighting, colors and art style, viewed from a ceiling-mounted security camera, high angle, slight wide-angle lens distortion. Change only the viewpoint: this is a second camera looking straight at the salon door from the opposite side of the hall, so the door is centered in the frame, with the elevator hall behind the viewer. A small framed portrait hangs beside the door, perfectly straight. A small round side table with a vase of white flowers stands beside the door. No people. No text, no letters, no clock, no timestamp, no logo. The security camera itself is not visible.
```

> **日本語訳**: 1 枚目の絵を直す。9 階のホール、会員制サロンの同じ木の両開きの扉、同じ明るい大理石の床、白い壁、観葉植物、明かり、色、絵柄はそのまま（隅の天井の防犯カメラから見下ろす、少し広角のゆがみ）。視点だけを変える: ホールの反対側から、サロンの扉を正面に見る 2 台目のカメラ。扉がフレームの真ん中に来る。扉の脇の壁に、まっすぐ掛かった小さな額。扉の脇に、白い花を生けた小さな丸い机。人なし。文字・時計・時刻・ロゴは入れない。防犯カメラ自体は映さない。

## 新しい場面の絵（12 枚）

- 玲子の SD カードの「会員たち」の記録（台本では `ch5_viewing_members` を使う）は、CAM-26 の絵と同じ部屋・同じ絵なので、別に作りません（`ch5_sd_wine` は欠番）。
- 機械室の前（`ch5_machine_room_tape`）は第4章の `ch4_machine_corridor`、9 年前の現場事務所（`ch5_flashback_office`）は第4章の `ch4_flash_office` と同じ部屋です。先に第4章の絵を作り、それを添付して作ります。

### ✅ scenes/ch5_machine_room_tape（B2 機械室の前の廊下。黄色い規制テープ）

添付: `scenes/ch4_machine_corridor`（第4章の同じ廊下。警官と刑事を消して、人を足し直す）

```
Generate an image. Edit the attached image. Keep exactly the same basement corridor, steel door, camera angle, composition, lighting, colors and art style. Remove the police officers and the detective. The steel door keeps its yellow-and-black police tape, now stuck diagonally across it. Three small figures walking past it toward a service hatch at the far end: a man in a rumpled long coat who does not turn his head, a thin man in a work uniform, and a woman in a cleaning uniform with a mop. No faces in detail. No text, no letters, no clock, no logo.
```

> **日本語訳**: 添付の絵と同じような、夜のオフィスビルの地下の廊下（コンクリートの壁、薄暗い蛍光灯）。中景に、黄色と黒の規制テープが斜めに貼られた鉄の扉。その前を、奥の点検口へ向かって通り過ぎる小さな人影が 3 人: しわのある長いコートの男（扉のほうへ顔を向けない）、作業着のやせた男、モップを持った清掃の制服の女。顔は細かく描かない。文字・時計・ロゴは入れない。

### ✅ scenes/ch5_b3_stairs（地下 3 階へ降りる階段）

添付: `bg/cam10_stairs`

```
Generate an image. Edit the attached image idea: a narrow concrete stairwell going down into darkness, damp walls, a single bare bulb far below. Three small figures descending in single file, seen from behind and above. Cold, oppressive. No text, no letters, no logo.
```

> **日本語訳**: 添付の絵と同じような、暗がりへ降りていく、せまいコンクリートの階段。湿った壁。はるか下に、むき出しの電球が 1 つ。3 人の小さな人影が一列で降りていく（後ろ上から見た構図）。冷たく息苦しい。文字・ロゴは入れない。

### ✅ scenes/ch5_b3_pit（地下 3 階のピット）

添付: `bg/cam13_parking`

```
Generate an image. A vast bare concrete underground floor like an unfinished parking level, rows of identical square pillars receding into darkness at perfectly even intervals, no windows, no signs, no cameras. A rusted steel shelf in the far depth lined with identical metal binders. In the middle distance a man in a grey suit crouches beside a small tin bin with orange flames, pulling a binder to his chest; a few small figures with flashlights approach from the left. Dim, cold, only the flames and flashlights as light sources. No text, no letters, no logo.
```

> **日本語訳**: 未完成の駐車場の階のような、広くて何もないコンクリートの地下の階。同じ四角い柱が、暗がりの奥へ、完全に等間隔で並ぶ。窓も、標識も、カメラもない。奥に、錆びたスチールの棚と、同じ形の金属の綴りの列。中景で、灰色のスーツの男が、火の上がった小さなブリキの缶のそばにしゃがみ、綴りを胸に抱え込んでいる。左から、懐中電灯を持った小さな人影が数人近づく。暗く冷たい。光は、炎と懐中電灯だけ。文字・ロゴは入れない。

### ✅ scenes/ch5_reiko_stairs（地上の非常階段の踊り場）

添付: `bg/cam10_stairs`

```
Generate an image. Edit the attached image idea: a landing of an outdoor-side emergency staircase of an office building, pre-dawn blue light coming through a gap in the door, grey concrete, railing. A woman in her mid-30s with long dark hair in a long white coat stands alone against the wall near the top of a flight, hands in her pockets, composed but with a faint shadow in her face. Wide shot, no text, no logo.
```

> **日本語訳**: 添付の絵と同じような、オフィスビルの非常階段の踊り場。夜明け前の青い光が、扉のすき間から差し込む。灰色のコンクリートと手すり。30 代半ばの、黒い長い髪の女が、長い白いコートで、階段の上のほうの壁を背に、ひとりで立つ。両手をポケットに入れ、落ち着いているが、顔に薄い陰がある。引きの構図。文字・ロゴは入れない。

### ✅ scenes/ch5_sd_yashima（観覧室の記録「記録_YASHIMA_RIKU」）

添付: `scenes/ch4_self_9d`（第4章の、監視室で背を丸める八島の絵。これを、大きなモニターに映った画面として使う）

```
Generate an image. A big monitor in a dark room showing a security-camera view of a hunched man in a work uniform sitting at a control desk in a basement monitoring room, seen from behind; around the edges of the screen, short lines of comment bubbles scroll by in blurry unreadable glyphs. In the foreground, silhouettes of two people in leather chairs watching and laughing, one holding a wine glass. Hidden-camera look, grainy, blue monitor glow. No readable text, no clock, no logo.
```

> **日本語訳**: 暗い部屋の大きなモニター。地下の監視室で、作業着の男が背を丸めて制御卓の前に座っている後ろ姿を、防犯カメラの視点で映している。画面のふちに、短い吹き出しのような書き込みが流れていく（読めないぼやけた記号）。手前に、革張りの椅子から画面を見て笑う 2 人のシルエット。ひとりはワイングラスを持つ。隠しカメラの映像のような粒子の粗さ、青いモニターの光。読める文字・時計・ロゴは入れない。

### ✅ scenes/ch5_sd_makabe（観覧室の記録　上座の男）

添付: `bg/cam26_viewing_room`

```
Generate an image. Edit the attached image idea: the hidden viewing room from a high camera, grainy. In the centre back on the raised dais, a white-haired man in a dark suit sits in the larger single armchair, lifting a wine glass to the light between two fingers, calm, looking at the monitor wall rather than at anyone. Around him, six members seated, glasses raised toward him. No readable text, no clock, no logo.
```

> **日本語訳**: 添付の絵と同じ観覧室を、高い所のカメラから見た粒子の粗い構図。奥の中央、一段高い台の上の大きなひとり掛けの椅子に、白髪の暗いスーツの男が座り、ワイングラスを指でつまんで、光にかざしている。穏やかで、誰も見ず、モニターの壁を見ている。まわりに会員 6 人が座り、彼に向かってグラスを掲げている。読める文字・時計・ロゴは入れない。

### ✅ scenes/ch5_viewing_empty（CAM-26 の今の映像。誰もいない観覧室）

添付: `bg/cam26_viewing_room`（2026-11-22 に席を 7 つにそろえて作り直した版）

```
Generate an image. Edit the attached image. Keep exactly the same viewing room, camera angle, composition, lighting, colors and art style, and the same seven armchairs plus the head seat on the dais. Now there are no people at all: all seven armchairs are empty, half-drunk wine glasses stand on the side tables, the wall of monitors is dim; the head seat on the dais has one wine glass left on its armrest. One of the side tables has an extra glass. No text, no letters, no clock, no logo, no watermark. The security camera itself is not visible. Horizontal 16:9.
```

> **日本語訳**: 添付の絵を直す。観覧室・角度・構図・明かり・色・絵柄、7 つの椅子と一段高い台の上座はそのまま。誰もいない: 空の革張りの椅子が 7 つ、小さな机の上に飲みかけのワイングラス、壁のモニターは暗い。上座の肘掛けにワイングラスが 1 つ置かれている。机の一つに、グラスが 1 つ余っている。文字・時計・ロゴは入れない。防犯カメラ自体は映さない。

### ✅ scenes/ch5_viewing_kuzumi（観覧室。会員たちに囲まれる久住）

添付: `bg/cam26_viewing_room`（作り直した版）

```
Generate an image. Edit the attached image. Keep exactly the same viewing room, camera angle, composition, lighting, colors and art style, and the same seven armchairs plus the head seat on the dais. Four members sit in the armchairs holding wine glasses (a mix: two men and two women, aged 40s to 70s, well dressed), and look at a middle-aged man in a grey suit who stands in the centre of the room with his hands folded in front and his head slightly bowed, tidy and obedient. The other armchairs are empty. Small figures as seen from a high angle by a hidden camera. No readable text, no clock, no logo, no watermark. The security camera itself is not visible. Horizontal 16:9.
```

> **日本語訳**: 添付の絵を直す。観覧室・角度・構図・明かり・色・絵柄、7 つの椅子と上座はそのまま。男女 2 人ずつ（40〜70 代、身なりがよい）の会員 4 人が、ワイングラスを持って椅子に座り、部屋の中央に立つ灰色のスーツの中年の男を見ている。男は手を前で組み、少し頭を下げて、きちんと従順に立つ。ほかの椅子は空。高い角度の隠しカメラから見た小さな人影。読める文字・時計・ロゴは入れない。防犯カメラ自体は映さない。

### ✅ scenes/ch5_viewing_members（観覧室。モニターを見て笑う会員たち）

添付: `bg/cam26_viewing_room`（作り直した版）

```
Generate an image. Edit the attached image. Keep exactly the same viewing room, camera angle, composition, lighting, colors and art style, and the same seven armchairs plus the head seat on the dais. Add members seated in the armchairs: five of the seven armchairs are occupied, by well-dressed men and women in a mix (three men and two women, aged 40s to 70s, one woman with grey hair in an elegant dress), wine glasses in hand, looking up at the wall of monitors; two of them are leaning toward each other laughing, one is pointing at a monitor. The head seat on the dais stays empty. Small figures as seen from a high angle by a hidden camera. No readable text, no clock, no logo, no watermark. The security camera itself is not visible. Horizontal 16:9.
```

> **日本語訳**: 添付の絵を直す。観覧室・角度・構図・明かり・色・絵柄、7 つの椅子と上座はそのまま。椅子に会員を足す: 7 つのうち 5 つが埋まり、身なりのいい男女（男 3・女 2、40〜70 代、うち 1 人は白髪の上品なドレスの女）が、ワイングラスを手に壁のモニターを見上げている。2 人は顔を寄せて笑い、ひとりはモニターの一つを指さしている。上座は空のまま。高い角度の隠しカメラから見た小さな人影。読める文字・時計・ロゴは入れない。防犯カメラ自体は映さない。

### ✅ scenes/ch5_viewing_raid（観覧室への突入）

添付: `bg/cam26_viewing_room`（作り直した版）

```
Generate an image. Edit the attached image. Keep exactly the same viewing room, camera angle, composition, lighting, colors and art style, and the same seven armchairs plus the head seat on the dais. Uniformed police officers rush in through double doors on both sides; the seven well-dressed members (a mix of men and women, aged 40s to 70s) freeze or stand up with their hands raised, one trying to hide behind an armchair, and a couple of empty wine glasses lie tipped over on the floor (the glasses are empty and clear: no liquid, no red stains on the floor). The wall of monitors is bright, each monitor showing a close-up of a startled face. Small figures as seen from a high angle by a hidden camera. No readable text, no clock, no logo, no watermark. The security camera itself is not visible. Horizontal 16:9.
```

> **日本語訳**: 添付の絵を直す。観覧室・角度・構図・明かり・色・絵柄、7 つの椅子と上座はそのまま。制服の警官たちが両側の扉から突入する。身なりのいい男女の会員 7 人（40〜70 代）が、凍りつくか立ち上がって手を上げ、ひとりは椅子の陰に隠れようとしている。床に空のワイングラスが数個倒れている（グラスは空で透明。液体も赤い染みもない。血に見えないため）。壁のモニターは明るく、その一つひとつに、驚いた顔のアップが映る。高い角度の隠しカメラから見た小さな人影。読める文字・時計・ロゴは入れない。防犯カメラ自体は映さない。

### ✅ scenes/ch5_flashback_office（9 年前、開業前の現場事務所）

添付: `scenes/ch4_flash_office`（第4章の 8 年前の同じ現場事務所。1 年前の同じ部屋にする）、`bg/cam07_office`

```
Generate an image. Keep the same construction-site temporary office as the attached ch4 flashback image (same room, same furniture and layout). A construction-site temporary office before a shopping mall opening, nine years ago: steel desks, drawings pinned to the wall, hard hats on a shelf, evening light through a window, desk lamp. In the foreground a young man of 26 in work clothes sits at a desk with a pen, a printout of a table of numbers in front of him; at the far side a white-haired man in a good suit stands with his hands behind his back, not touching the paper. Warm sepia-tinted memory feel, soft vignette. No readable text, no clock, no logo.
```

> **日本語訳**: 9 年前、ショッピングモールの開業前の、建設現場の仮設の事務所。スチールの机、壁に留めた図面、棚の上のヘルメット、窓から差す夕方の光、卓上のライト。手前で、作業着の 26 歳の若い男が、ペンを持って机に座り、目の前に数字の表の出力がある。奥に、品のいいスーツの白髪の男が、後ろで手を組んで立ち、紙には触れない。暖かいセピア色の記憶の雰囲気、やわらかい周辺減光。読める文字・時計・ロゴは入れない。

### ✅ scenes/ch5_mall_atrium（「異常なし」のエンディング。汐見ベイコートの吹き抜け）

添付: なし（`bg/cam01_lobby` の色調をそろえる）

```
Generate an image. Wide horizontal 16:9. Japanese anime style background art. The bright, busy atrium of a large shopping mall on a normal afternoon: a tall open atrium, glass roof, several floors of shops around a void, shoppers walking with bags, small figures. A woman in the middle distance looks up at the high ceiling beams; high up on a concrete beam, a thin dark hairline crack is just visible. Cheerful, clean, quietly ominous. No readable text, no logo.
```

> **日本語訳**: 横長 16:9、日本のアニメ調の背景美術。ふつうの昼下がりの、大きなショッピングモールの、明るくにぎわう吹き抜け。高い吹き抜け、ガラスの屋根、空洞をかこむ数階の店、袋を持って歩く買い物客（小さな人影）。中景の女性が、高い天井の梁を見上げている。高いコンクリートの梁に、細くて暗いひびの線が、かろうじて見える。明るく清潔で、静かに不穏。読める文字・ロゴは入れない。

## 絵を入れたあとの作業

- カメラの背景（`cam26`・`cam27`）は、人がいない絵。台本の `@hotspot CAM-26 live 160,50 壁のモニター` と `160,18 天井のスピーカー`、`@hotspot CAM-00 live 150,110 机の上の紙` の座標を、絵の機器の位置に合わせて直す。
- 立ち絵（`makabe_normal`・`makabe_smile`）を足したら、`node tools/portraits_to_webp.js` で WebP にする（`characters.js` のパスはすでに `.webp`）。
