# 第3章で新しく要る絵のプロンプト

第3章の台本（`game/scenario/chapter3.js`）と `game/data/cameras.js`・`game/data/characters.js` が指している、まだ無い絵の一覧です。`prompts_en.md` と同じ形（英語のプロンプトと日本語訳）で書いています。絵が無くても、台本は線の背景と人の影で最後まで遊べます。絵ができたら、`prompts_en.md` の表に移し、機器の座標（下の表）を絵に合わせて直します。

作り方・保存先・共通の決まり（天井の隅から見下ろす、文字・時計を入れない、など）は `prompts_en.md` の「絵をそろえるための決まり」「使い方」に従います。

## 状況

全 17 枚（背景 5・場面の絵 10・立ち絵 2）。台本・`cameras.js`・`characters.js` が指す名前と、すべて一致している（R33 で確認）。

| 種類 | 枚数 | 絵 |
|---|---|---|
| カメラの背景（`bg/`） | 5 | cam14_salon_back、cam15_salon_entrance、cam16_stair_landing、cam17_b1_machine、cam18_stair_door9 |
| 場面の絵（`scenes/`） | 10 | ch3_backdoor_threat、ch3_backdoor_call、ch3_backdoor_stand、ch3_relay_heel、ch3_salon_lit、ch3_sena_crack、ch3_b1_leak、ch3_saori_door、ch3_box_empty、ch3_reiko_look_true |
| 立ち絵（`chars/`） | 2 | saori_normal、saori_smile |

全 17 枚、すべて ✅ 生成済みです（2026-11-21）。`assets_src/images/` に保存し、`tools/optimize_images.ps1` で `game/assets/` に変換しました（立ち絵 2 枚は WebP）。

生成のときに、プロンプトから変えた点・妥協した点:

- 機器の座標: `cam14_salon_back` は、内線電話が右の壁の少し手前、非常用設備ボックスが右端（x がおよそ 290）に描かれた。台本の `@hotspot`（電話 218,90 / ボックス 232,95）は、絵に合わせて直す必要がある。非常ベルは左の壁に 1 つ（およそ 79,68）。
- `ch3_relay_heel`・`cam16_stair_landing` は `bg/cam10_stairs` を添付して作った（同じチャットで「扉を開けてハイヒールを足す」の続きで作成）。ふちの白い焼き付きが強く、四隅だけでなく周囲全体が白くぼける。
- `cam23_service_lift`（第4章）の表示板に、読めない小さな記号が入った。意味のある文字ではないので許容。地下の廊下のような見た目で、9 階らしさは薄い。
- `ch3_box_empty` は、一度目が遠かったので、同じチャットで「もっと近づけて」と頼み直した版を使った。ねじは小さい。
- `ch3_sena_crack`・`ch4_cart_kuzumi` は、腕時計の文字盤を空白にする指示を足した。
- `ch3_saori_door` は、沙織のドレスを `dark emerald-green`、髪を `chestnut` と書き足した。
- `ch3_backdoor_stand` は、`ch3_backdoor_call` との差がごく小さい（受話器を見る向きだけ）。
- `saori_normal`・`saori_smile` は、深緑のドレスなのに、背景をグリーンバックで作ってしまった。背景を抜くと、ドレスが少し半透明（アルファ 220 前後）で青みがかる。ブルーバックで作り直すのが望ましい。



第4章も、この章の次の絵を、そのまま使います（同じカメラ・同じ場面なので、別の絵は作りません）: `bg/cam14_salon_back`、`bg/cam15_salon_entrance`、`bg/cam16_stair_landing`、`scenes/ch3_backdoor_threat`（0:30 の脅し。第4章の「焼き付いていない時間」）、`scenes/ch3_backdoor_call`（2:20 の内線。第4章の焼き付きの奥の過去）、`scenes/ch3_saori_door`（聞き直す沙織ママ）、`scenes/ch3_relay_heel`。

## 押せる機器の座標（320x180 の画面の中）

台本の `@hotspot` が指している位置です。絵を作るときは、機器をこの位置に描きます（合わなければ台本の座標を直します）。

| カメラ | 機器 | 座標 x,y | 絵の中の位置の目安 |
|---|---|---|---|
| CAM-14 | 壁の内線電話 | 218,90 | 右の壁、腰より少し上 |
| CAM-14 | 通路の表示板（文字を出す黒い板） | 160,34 | 通路の奥の扉の上、天井近く |
| CAM-14 | 非常ベル | 36,68 | 左の壁の、目の高さより少し上 |
| CAM-14 | 非常用設備ボックス（押せない。物語の手がかり） | 290,95 | 通路の右の突き当たり近く。扉つきの赤いボックス |

## カメラの背景 `images/bg/`

### ✅ cam14_salon_back（CAM-14 9F サロン裏口の通路）

添付: `bg/cam03_corridor`

```
Generate an image. Same art style, same coloring and the same security-camera viewpoint as the attached image (Japanese anime style background art, cinematic; viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion), but a different place in the same luxury tower: the staff back-door corridor behind an exclusive members-only salon on the 9th floor, late at night. A narrow plain corridor with cream walls and a gray floor, lit by cold fluorescent ceiling lights. On the left wall, one red emergency alarm bell with a mounting box. On the right wall, a gray wall-mounted intercom telephone with a handset. Above a closed door at the far end, a blank black rectangular sign panel (no letters). Near the right end of the corridor, a red wall-mounted emergency equipment box with a closed door and a fire hose reel visible through a small window. At the left, a plain staff door (the back door of the salon). No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り・防犯カメラの視点で、同じタワーの別の場所。深夜の、9 階の会員制サロンの裏の、従業員用の裏口の通路。クリーム色の壁と灰色の床の狭い通路。冷たい蛍光灯。左の壁に、取り付け箱つきの赤い非常ベルを 1 つ。右の壁に、受話器つきの灰色の内線電話。奥の扉の上に、文字のない黒い長方形の表示板。右の端の近くに、扉つきの赤い非常用設備ボックス（小さな窓から消火ホースのリールが見える）。左に、地味な従業員用の扉（サロンの裏口）。人なし。

### ✅ cam15_salon_entrance（CAM-15 9F サロン入口前）

添付: `bg/cam08_evhall9`

```
Generate an image. Same art style, same coloring and the same security-camera viewpoint as the attached image, the same 9th-floor hall in front of the members-only salon (bright marble floor, white walls, potted plants, the salon's wooden entrance door), but seen from the end of the corridor beside the salon's entrance, closer to the door. Beside the door on the wall, one framed portrait photo of a woman in a dark frame (the face is small and too far away to see clearly; no text), hanging perfectly straight. A small blank white sign hangs on the door. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り・視点で、同じ 9 階のサロンの前のホール（明るい大理石の床、白い壁、観葉植物、サロンの木の入口の扉）を、入口の脇の廊下の端から、扉に近い位置で見る。扉の脇の壁に、女性の肖像写真の黒い額を 1 つ（顔は小さく、遠くてはっきり見えない）。額は、まっすぐに掛かっている（傾きは、干渉のあとの絵 ch3_salon_lit だけに出す）。扉に、文字のない小さな白い札。人なし。

### ✅ cam16_stair_landing（CAM-16 9F 非常階段の踊り場）

添付: `bg/cam10_stairs`

```
Generate an image. Same art style, same coloring and the same security-camera viewpoint as the attached image, but the 9th-floor landing of the emergency staircase: a small concrete landing with a steel door on the left (the door to the 9th-floor corridor), a steel handrail, concrete stairs going down to the right, and a green emergency exit light on the wall. Cold, bare, quiet. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り・視点で、非常階段の 9 階の踊り場。小さなコンクリートの踊り場。左に鉄の扉（9 階の廊下へ出る扉）、鉄の手すり、右へ下りるコンクリートの階段、壁に緑の非常口の灯り。冷たく、何もない。人なし。

### ✅ cam17_b1_machine（CAM-17 B1 機械室前）

添付: `bg/cam03_corridor`

```
Generate an image. Same art style, same coloring and the same security-camera viewpoint as the attached image, but the basement B1 corridor in front of a machine room: a gray concrete corridor with exposed pipes along the ceiling, a heavy steel door to the machine room on the right, and a small white water-leak sensor box mounted on the wall at the bottom of the left wall. A shallow puddle spreads on the floor only directly below the sensor; the pipes above are dry. Dim, damp, quiet. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り・視点で、地下 1 階の機械室の前の廊下。灰色のコンクリートの廊下、天井に沿った露出した配管、右に機械室の重い鉄の扉、左の壁の低いところに小さな白い漏水センサーの箱。床の水たまりは、センサーの真下にだけ広がっている。頭の上の配管は乾いている。人なし。

### ✅ cam18_stair_door9（CAM-18 9F 非常階段の扉前）

添付: `bg/cam03_corridor`

```
Generate an image. Same art style, same coloring and the same security-camera viewpoint as the attached image, but a short dim corridor on the 9th floor that ends at a heavy gray steel fire door (the emergency staircase door) with a green emergency exit light above it. Cream walls, gray floor, cold fluorescent light. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り・視点で、9 階の短い薄暗い廊下。突き当たりに、重い灰色の鉄の防火扉（非常階段の扉）があり、その上に緑の非常口の灯り。クリーム色の壁、灰色の床、冷たい蛍光灯。人なし。

## 場面の絵 `images/scenes/`

### ✅ ch3_backdoor_threat（9 日目 0:30、裏口の通路で脅される玲子）

添付: `bg/cam14_salon_back`、`chars/reiko_sad`

```
Generate an image. Edit the first attached image. Keep exactly the same corridor, camera angle, composition, lighting, colors and art style. Add two people as small figures seen from a high ceiling camera: the woman from the second attached image (wine-red evening gown, long black hair; ignore its green background), standing with her back against the left wall, shoulders sunk, looking down; and in front of her, a tall man in a dark suit and a dark cap, standing half-turned so that his face is outside the edge of the frame or hidden by the cap brim and shadow (no face visible). Tense, threatening mood. The security camera itself is not visible. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵を直す。通路・角度・構図・明かり・色・絵柄はそのまま。天井の高いところのカメラから見た小さな人影を 2 人足す: 2 枚目の女性（ワインレッドのドレス、長い黒髪）が、左の壁に背をつけ、肩を落とし、うつむいて立つ。その前に、暗いスーツと帽子の背の高い男が、体を半分そらして立つ（顔は画面の外に出るか、帽子のつばと影で見えない）。張りつめた、脅す空気。

### ✅ ch3_backdoor_call（9 日目 2:20、内線を取る玲子）

添付: `scenes/ch3_backdoor_threat`

```
Generate an image. Edit the attached image. Keep exactly the same corridor, camera angle, composition, lighting, colors and art style, and the same woman. Remove the man. Change only this: the woman stands at the intercom telephone on the right wall, holding the handset to her ear with one hand, her face pale and frightened, her other hand pressed to her chest. Small figure as seen from a high ceiling camera. The security camera itself is not visible. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。通路・角度・構図・明かり・色・絵柄と、女性はそのまま。男は消す。女性は、右の壁の内線電話の前に立ち、片手で受話器を耳に当て、顔は青ざめて怯えている。もう片方の手は胸に当てる。

### ✅ ch3_backdoor_stand（電話が切れて、立ち止まる玲子。任意）

添付: `scenes/ch3_backdoor_call`

```
Generate an image. Edit the attached image. Keep everything the same, but the woman has taken the handset away from her ear and is looking at it in her hand, motionless, her head slightly tilted in confusion. The other hand is still at her chest. The security camera itself is not visible. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。ほかはそのまま。女性は、受話器を耳から離し、手の中の受話器を見つめて動かない。首を少しかしげ、戸惑っている。もう片方の手は胸に当てたまま。

### ✅ ch3_relay_heel（9 日目 2:28、9F 非常階段の踊り場。第3章のリレーの一枚）

添付: `bg/cam16_stair_landing`

```
Generate an image. Edit the attached image. Keep exactly the same landing, camera angle, composition, lighting, colors and art style. Change only this: the steel door on the left stands wide open, showing the dark corridor beyond. On the concrete floor of the landing, one single red high-heeled shoe lies on its side, near the open door, as if kicked off in a struggle. Nothing else; no person, no blood. The edges of the whole image look overexposed and burned white, with a soft white glow that fades toward the center, like a frozen, burned-in frame. The security camera itself is not visible. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。踊り場・角度・構図・明かり・色・絵柄はそのまま。左の鉄の扉が大きく開いていて、奥の暗い廊下が見える。踊り場のコンクリートの床に、赤いハイヒールが片方だけ、開いた扉のそばに横倒しで転がっている（もみあって脱げたように）。ほかには何もなし（人も血も描かない）。絵のふちは、白く焼けて飛んでいて、中央に向かって淡く消える白い光。焼き付いて止まった一枚のように見せる。

### ✅ ch3_salon_lit（干渉のあとの 9F サロン入口。明かりがついている）

添付: `bg/cam15_salon_entrance`

```
Generate an image. Edit the attached image. Keep exactly the same hall, camera angle, composition and art style. Change only this: the small sign on the door is gone, the salon's wooden door is slightly ajar and warm golden light spills out of the gap onto the marble floor. The framed portrait on the wall beside the door now hangs slightly crooked, as if someone had touched it. No people. The security camera itself is not visible. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。ホール・角度・構図・絵柄はそのまま。扉の小さな札がなくなり、サロンの木の扉が少し開いて、隙間から温かい金色の光が大理石の床に漏れている。扉の脇の肖像写真の額は、少し傾いている（人の手が触れた印。ここで初めて傾く）。人なし。

### ✅ ch3_sena_crack（8 日目 20:50、廊下の柱のひびを指でなぞる瀬名）

添付: `scenes/ch1_sena_mop`、`chars/sena_normal`

```
Generate an image. Edit the first attached image. Keep the same marble-walled corridor style, camera angle, lighting, colors and art style, but it is the underground B2 corridor in front of a security room: plain gray concrete walls, a concrete pillar on the right with a thin diagonal crack running down it. A cleaning worker (the person from the second attached image: a woman in a gray cleaning uniform and cap; ignore its green background) stands beside the pillar with her back mostly to the camera, tracing the crack with one finger, a cleaning cart parked behind her. A large, oversized men's wristwatch is visible on her left wrist below the sleeve. Small figure as seen from a high ceiling camera. The security camera itself is not visible. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵を直す。廊下の絵柄・角度・明かり・色はそのままに、地下 2 階の監視室の前の廊下にする: 飾りのない灰色のコンクリートの壁、右にコンクリートの柱、斜めに細いひび。清掃の作業員（2 枚目の人物。灰色の清掃の制服と帽子の女性）が、柱のそばで、ほぼ背中を向けて、指でひびをなぞっている。後ろに清掃のワゴン。左の手首の袖口から、大きすぎる男物の腕時計が見える。

### ✅ ch3_b1_leak（9 日目 2:15、B1 機械室前の漏水）

添付: `bg/cam17_b1_machine`

```
Generate an image. Edit the attached image so it looks like a normal eye-level view (not a high security-camera angle): the same B1 corridor in front of the machine room, seen from standing height at the corridor, with a flashlight beam falling on the white leak-sensor box on the lower left wall and the shallow puddle directly below it. The pipes on the ceiling above are completely dry. Same art style and colors. No people. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵を、防犯カメラの高い角度でなく、立った目の高さから見た絵にする。同じ地下 1 階の機械室の前の廊下。懐中電灯の光が、左の壁の低いところの白い漏水センサーの箱と、その真下の浅い水たまりを照らす。天井の配管は、完全に乾いている。絵柄・色は同じ。人なし。

### ✅ ch3_saori_door（9 日目 23:50、サロンの前に立つ新しいママ）

添付: `bg/cam15_salon_entrance`、`chars/saori_normal`

```
Generate an image. Edit the first attached image, but as a normal eye-level view (not a high security-camera angle): the 9th-floor hall in front of the members-only salon's wooden door, warm light on the marble floor. In front of the door stands the woman from the second attached image (34-year-old hostess with long wavy hair and an elegant dark green evening gown; ignore its background), smiling politely toward the viewer with her hands together. Same art style and colors as the first image. The framed portrait beside the door shows the same woman, slightly crooked. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵を、防犯カメラの高い角度でなく、立った目の高さの絵にする: 会員制サロンの木の扉の前の 9 階のホール。大理石の床に温かい明かり。扉の前に、2 枚目の女性（34 歳のママ。ゆるいウェーブの長い髪、上品な深緑のイブニングドレス。背景は無視）が、両手を合わせて、こちらに礼儀正しく微笑んでいる。扉の脇の額の写真も、同じ女性で、少し傾いている。絵柄・色は 1 枚目と同じ。

### ✅ ch3_box_empty（9 日目 23:55、空の非常用設備ボックス）

添付: `bg/cam14_salon_back`

```
Generate an image. Edit the attached image, but as a normal eye-level close view (not a high security-camera angle): the red wall-mounted emergency equipment box at the end of the back-door corridor, its door swung open, the inside empty except for a folded hose and a plastic manual pocket. On the floor right in front of it, one small silver screw lies on the gray floor, catching the light. Same art style and colors. No people. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵を、防犯カメラの高い角度でなく、立った目の高さの近い絵にする: 裏口の通路の突き当たりの、壁の赤い非常用設備ボックス。扉が開いていて、中は、畳んだホースと、透明な説明書の袋のほかは空っぽ。その真ん前の灰色の床に、小さな銀色のねじが一本、光を受けて落ちている。絵柄・色は同じ。人なし。

### ✅ ch3_reiko_look_true（真解決のラスト。エレベーターを待ち、カメラを見上げる玲子）

添付: `scenes/ch1_reiko_look`、`chars/okochi_normal`

```
Generate an image. Edit the first attached image. Keep exactly the same 9th-floor elevator hall, camera angle, composition, lighting, colors and art style, and the same woman waiting for the elevator and looking up toward the camera. Change only this: her expression is no longer a practiced, alluring smile but a plain, tired, relieved face with a little sadness; her hair is slightly disheveled and she wears a plain gray coat over her dress. Next to her stands the man from the second attached image (52-year-old detective in a rumpled coat; ignore its background), looking at the elevator doors with a gum-chewing frown. Small figures as seen from a high ceiling camera. The security camera itself is not visible. Horizontal 16:9 landscape. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵を直す。9 階のエレベーターホール・角度・構図・明かり・色・絵柄と、エレベーターを待ってカメラを見上げる女性はそのまま。変えるのは、表情だけ: 練習された色っぽい微笑みではなく、飾らない、疲れた、ほっとしたような、少し悲しげな顔。髪はすこし乱れ、ドレスの上に地味な灰色のコートを着ている。そばに、2 枚目の男（52 歳の刑事。くたびれたコート。背景は無視）が、ガムをかみながら、しかめ面でエレベーターの扉を見ている。

## 立ち絵 `images/chars/`

### ✅ saori_normal（三枝沙織・ふだん。玲子と同じ型の「ママ」）

添付: `chars/reiko_normal`（構図・服の型だけ参考。顔は別人にする）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted elegant colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a woman in her mid-30s, the new hostess (mama) of an exclusive members-only salon in a luxury tower. A different person from the woman in the reference image, but the same type: long softly wavy hair, in warm chestnut brown (not black), brown eyes, soft pink lipstick, no beauty mark. Wearing an off-the-shoulder deep emerald-green evening gown (fully clothed, elegant, not revealing), a thin silver necklace and drop earrings. The same graceful, practiced hostess manner, but her gaze is blank and polite and does not really see the viewer.
Expression: a polite, perfectly shaped, practiced smile that does not reach the eyes.
```

> **日本語訳**: 【立ち絵の共通指示】（玲子とは別人。ただし、同じ型の「ママ」）
>
> 人物: 30 代半ばの女性。高級タワーの会員制サロンの、新しいママ。参考の絵の女性とは別人だが、同じ型: ゆるいウェーブの長い髪（黒でなく、暖かい栗色）、茶色の瞳、やわらかいピンクの口紅、ほくろなし。肩を出した深いエメラルドグリーンのイブニングドレス（服は着ていて、上品で、露出は多くない）、細い銀のネックレス、揺れるイヤリング。同じ優雅で慣れたママのふるまい。ただし、まなざしは空っぽで礼儀正しく、こちらを本当には見ていない。
>
> 表情: 礼儀正しい、きれいな形の、慣れた微笑み。目までは届いていない。

### ✅ saori_smile（沙織・微笑み）

```
Same character, same outfit, same pose as saori_normal. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: a wider, practiced hostess smile, head tilted a little, welcoming. Elegant, fully clothed.
```

> **日本語訳**: 【差分の共通指示】（基準の絵: saori_normal）
>
> 表情: 少し大きくした、慣れたママの微笑み。首を少しかしげ、迎え入れるような顔。上品で、服は着ている。
