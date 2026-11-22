# 英語のプロンプト集

英語の画像生成サイト向けのプロンプトです。日本語版と同じ絵の一覧（[README.md](README.md)）に対応しています。

## 生成の状況

各絵の見出しに、✅（生成済み）か ⬜（未生成）を付けています。`assets_src/images/` はリポジトリに入らないので、絵を置いたら、ここの一覧と見出しのマークを手で更新します。

全 113 枚のうち、生成済みは 113 枚、未生成は 0 枚です（2026-11-22 時点。この表と下の一覧は、第1・2章と共通の立ち絵の分です）。2026-11-21 のレビューで、新しい絵 6 枚と描き直し 2 枚を足しました（下の「2026-11-21 のレビューで、増やす・描き直す絵」）。

| 種類 | ✅ 生成済み | ⬜ 未生成 | 未生成の絵 |
|---|---|---|---|
| 立ち絵 | 26 | 0 | なし |
| 場面の絵 | 71 | 0 | なし |
| カメラの背景 | 16 | 0 | なし |

第3〜5章で足した絵は、章ごとのファイルで管理しています（作った絵は、素材の一覧 [README.md](README.md) に入れます）。

| ファイル | 全体 | ✅ 生成済み | ⬜ 未生成 |
|---|---|---|---|
| [new_prompts_ch3.md](new_prompts_ch3.md)（第3章） | 17 | 17 | 0 |
| [new_prompts_ch4.md](new_prompts_ch4.md)（第4章） | 22（背景 3・場面 19。うち 1 枚は第3章と共有） | 22 | 0 |
| [new_prompts_ch5.md](new_prompts_ch5.md)（第5章） | 16 | 16 | 0 |

ゲームの絵は、ここまでの合計で 167 枚（`game/assets/` の `chars` 30・`scenes` 111・`bg` 26）が作ってあります。未生成の絵はありません（2026-11-22 に、第4章の 14 枚と第5章の 7 枚を生成。同じ日に、会員が写る絵 6 枚と `cam26_viewing_room`・`ch4_salon_3am`・`saori_normal`・`saori_smile` を作り直した）。

2026-11-14 に絵を見比べて、絵どうし・絵とシナリオの食い違いを直すことにしました。下の「絵をそろえるための決まり」に合わせ、「作り直し（Gemini で参考画像を添付）」のプロンプトで作り直しました（23 枚、同じ日に完了。新しく作った `ch1_lobby_police`・`cam07_office_day`・`cam09_roof_day` を含め、全部で 49 枚）。作り直した絵の前の版は、`assets_src/images/backup/` に移しています（ゲームには使わない）。

作り直しで、プロンプトどおりにならず直したこと:

- `cam03_corridor`: 非常ベルが 2 つ描かれたため、同じチャットで 1 つ消させた（プロンプトに「1 つだけ」を足した）。
- `cam04_backyard`: 非常ベルが「扉の右」でなく「扉の真上」に入った。はっきり見えるので、その位置に決めた。
- `ch1_lobby_police`: 右上と右下に時刻の文字が入ったため、文字だけを消す直しをした。
- `ch1_office_couple`: 壁に時刻を表示するデジタル時計が入ったため、時計だけを消す直しをした。
- 文字を描かないよう指示しても、時計や時刻の表示が入ることがある。できた絵は、文字が入っていないか必ず確かめる。

## 2026-11-21 のレビューで、増やす・描き直す絵（すべて ✅ 作成済み）

遊んだ人（ユーザー）の指摘で、次の 4 枚を作りました（2026-11-21。Gemini で参考画像を添付して作った）。

| 状態 | 絵 | 備考 |
|---|---|---|
| ✅ 新しく | `scenes/ch1_shop_saeki_alone`（21:20 のショップ。店長がひとり） | レジで札束を数える店長。店の構図は元のまま |
| ✅ 新しく | `scenes/ch1_jump_aftermath`（飛び降りの結果。3 日目の朝） | 体は映さず、ブルーシート・野次馬・手前の缶と袋で見せる |
| ✅ 描き直し | `bg/cam03_corridor`（非常ベルを、壁に埋まって見えない形から、本物らしい形に） | 取り付け箱・発信機・表示灯のセットで描いた。前の版は `backup/` |
| ✅ 描き直し | `chars/jogasaki_aroused`（襟が破れたように見える） | 襟も肩も破れていない形に直した。`game/data/characters.js` の `aroused` は元の `jogasaki_aroused.webp` に戻した |


### 第2章の見直し（R25）で足した絵（✅）

人影（線で描いた仮の人）をやめた場面の絵です（2026-11-21 作成）。どれも、監視カメラの絵の共通の指示（隅の天井から見下ろす）で、背景の絵（`bg/`）を添付して、人を足す形で作ります。

| ファイル名 | 場面 | 描くもの | 添付する背景 |
|---|---|---|---|
| ✅ `scenes/ch2_lobby_makabe` | 5 日目 21:40、1F ロビー | エレベーターから降りた白髪の高齢の男（会長）に、白衣の男（院長）が深々と頭を下げている | `bg/cam01_lobby` |
| ✅ `scenes/ch2_clinic_morishita` | 5 日目 20:47、3F クリニック前の廊下 | 30 代の男が、閉まったクリニックのガラスの扉の前から、奥の院長室の扉へ向かい、何度もノックしている（後ろ姿） | `bg/cam11_clinic` |
| ✅ `scenes/ch2_director_kuzumi` | 4 日目 21:28、3F 院長室 | 灰色のスーツの男（所長）が、分厚い封筒を、白衣の男（院長）の机に置く。院長は両手で受け取って頭を下げる | `bg/cam12_director` |
| ✅ `scenes/ch2_news_footbridge` | 7 日目 1:00、ロビーのテレビのニュース | テレビ画面に、夜の歩道橋の階段と、規制線・パトカーの赤い光（人の体は映さない）。ニュース番組の画面で、字幕の文字は入れない | `bg/cam01_lobby` |

### ✅ ch2_lobby_makabe（5 日目 21:40、1F ロビー）

添付: `bg/cam01_lobby`（変換済みの軽い版）

```
Generate an image. Edit the attached image. Keep exactly the same lobby, camera angle, composition, lighting, colors and art style: a modern office building ground-floor lobby at night, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Add two people near the elevators: an elderly man with white hair in a dark suit who has just stepped out of the elevator, standing upright with his hands behind his back, and in front of him a middle-aged man in a white doctor's coat bowing deeply at the waist with his head lowered, as if apologizing. Small figures as seen from a high angle. The security camera itself is not visible. No text, no letters, no clock, no timestamp, no logo.
```

> **日本語訳**: 添付の絵を直す。ロビー・角度・構図・明かり・色・絵柄はそのまま（夜のオフィスビル 1 階のロビー。隅の天井の防犯カメラから見下ろす）。エレベーターのそばに 2 人を足す: エレベーターから降りたばかりの白髪の高齢の男（暗い色のスーツ。背筋を伸ばし、手を後ろで組む）と、その前で、白衣の中年の男が、腰から深く頭を下げて謝っている。高い角度から見た小さな人影。防犯カメラ自体は映さない。文字・時計・時刻・ロゴは入れない。

### ✅ ch2_clinic_morishita（5 日目 20:47、3F クリニック前の廊下）

添付: `bg/cam11_clinic`（変換済みの軽い版）

```
Generate an image. Edit the attached image. Keep exactly the same corridor, clinic glass door, camera angle, composition, lighting, colors and art style: a night-time third-floor clinic corridor, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Add one person: a man in his 30s in a rumpled dark suit and loosened tie, seen from behind, walking away from the closed glass door of the clinic toward the director's office door at the end of the corridor, and knocking on that door with his fist, desperate and tense. Small figure as seen from a high angle. The security camera itself is not visible. No text, no letters, no clock, no timestamp, no logo.
```

> **日本語訳**: 添付の絵を直す。廊下・クリニックのガラスの扉・角度・構図・明かり・色・絵柄はそのまま（夜の 3 階のクリニックの廊下）。人を 1 人足す: 30 代の男。しわのある暗い色のスーツで、ネクタイをゆるめている。後ろ姿で、閉まったクリニックのガラスの扉から、廊下の奥の院長室の扉へ向かい、こぶしでその扉をたたいている。必死で張りつめた様子。高い角度から見た小さな人影。防犯カメラ自体は映さない。文字・時計・時刻・ロゴは入れない。

### ✅ ch2_director_kuzumi（4 日目 21:28、3F 院長室）

添付: `bg/cam12_director`（変換済みの軽い版）

```
Generate an image. Edit the attached image. Keep exactly the same director's office, desk, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Add two people: a middle-aged man in a gray suit (a lawyer) standing at the front of the large desk, setting a thick brown envelope on the desk; and behind the desk a man in a white doctor's coat (the clinic director) half rising from his chair, receiving the envelope with both hands and bowing his head. Small figures as seen from a high angle. The security camera itself is not visible. No text, no letters, no clock, no timestamp, no logo.
```

> **日本語訳**: 添付の絵を直す。院長室・机・角度・構図・明かり・色・絵柄はそのまま（隅の天井の防犯カメラから見下ろす）。2 人を足す: 灰色のスーツの中年の男（弁護士）が大きな机の手前に立ち、厚い茶封筒を机の上に置いている。机の奥では、白衣の男（院長）が椅子から腰を半分上げ、両手で封筒を受け取って頭を下げている。高い角度から見た小さな人影。防犯カメラ自体は映さない。文字・時計・時刻・ロゴは入れない。

### ✅ ch2_news_footbridge（7 日目 1:00、ロビーのテレビのニュース）

添付: `bg/cam01_lobby`（変換済みの軽い版）

```
Generate an image. Edit the attached image. Keep exactly the same lobby, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. The lobby is empty of people. Only change what is shown on the wall-mounted TV screen: it now shows a night news broadcast scene of a pedestrian footbridge staircase, with yellow police tape across the stairs and red flashing police car lights reflecting on the steps, wet pavement below. No people, no body, no blood, no injury shown. The TV screen glows blue-white and casts a faint glow into the dark lobby. The security camera itself is not visible. No text, no letters, no captions, no logo, no timestamp.
```

> **日本語訳**: 添付の絵を直す。ロビー・角度・構図・明かり・色・絵柄はそのまま（隅の天井の防犯カメラから見下ろす）。ロビーに人はいない。壁のテレビの画面に映るものだけを変える: 夜のニュースの、歩道橋の階段の場面。階段に黄色い規制線が張られ、赤く点滅するパトカーの光が段に映り、下の路面は濡れている。人・体・血・けがは映さない。テレビの画面は青白く光り、暗いロビーにほのかに光を落とす。防犯カメラ自体は映さない。文字・字幕・ロゴ・時刻は入れない。

> 注: 描かれたテレビは小さく、画面の中身は大まかな赤い光の階段として見える。字幕は入っていない。

### ✅ ch1_shop_saeki_alone（21:20 のブランドショップ。閉店後、店長がひとり）

添付: `bg/cam02_shop`

```
Generate an image. Edit the attached image. Keep exactly the same boutique, camera angle, composition, lighting and art style: a closed luxury brand shop at night, shutters down, handbags lit on the shelves. Add one person: the shop manager, a woman in her early 30s in a dark tailored dress uniform with her hair in a neat bun, standing alone behind the cash register counter, seen from a high angle, counting a stack of banknotes with her head bowed. Her face is not smiling and a little tired. The rest of the shop is empty. No text, no clock, no timestamp, no logo. Viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion.
```

> **日本語訳**: 添付の絵を直す。店・角度・構図・明かり・絵柄はそのまま（夜の閉店後の高級ブランドショップ、シャッターは下りて、棚のハンドバッグが明るく照らされている）。人を 1 人だけ足す: 店長。30 代前半の女性で、濃い色の仕立てのよい制服のワンピース、髪はきちんとしたまとめ髪。レジのカウンターの奥にひとりで立ち、高い角度から見て、うつむいて札束を数えている。笑っておらず、少し疲れた顔。店のほかの場所には誰もいない。文字・時計・時刻・ロゴは入れない。隅の天井に付いた防犯カメラから見た構図。

### ✅ ch1_jump_aftermath（飛び降りの結果。3 日目の朝、ビルの前）

添付: `scenes/ch1_dropped_cans`（缶と袋の絵）、`scenes/ch1_dawn_building`（朝日のビル）

```
Generate an image. Wide horizontal 16:9. Japanese anime style background art, same art style and morning light as the attached images. A morning scene on the pavement in front of a glass skyscraper, just after a fatal fall. Do not show the body in any detail: in the middle distance, at the edge of the shadow of the building, a person's dark suit jacket and one leather shoe are visible, mostly hidden by people's legs and a half-unfolded blue tarp being held up by two police officers. A few onlookers in silhouette stand back with their hands over their mouths; one is running toward the scene. In the foreground, slightly out of focus, a spilled plastic shopping bag, a rolling beer can and a tray of sliced roast pork, the same as in the first attached image. Bright, cold morning light that contrasts with the horror. No blood, no gore, no injury details. No text.
```

> **日本語訳**: 横長 16:9。日本のアニメ調の背景美術。絵柄と朝の光は、添付の絵と同じ。ガラスの高層ビルの前の歩道、人が落ちた直後の朝の場面。体は詳しく描かない。中景の、ビルの影のはしに、濃い色のスーツの上着と革靴の片方が見えるが、人々の足と、警察官 2 人が持ち上げた半開きの青いシートで、ほとんど隠れている。数人の野次馬が、口を手でおおって、影のように離れて立つ。ひとりは現場へ走っていく。手前に、少しぼかして、散らばったレジ袋、転がるビール缶、チャーシューのパック（最初の添付の絵と同じもの）。朝のまぶしい冷たい光が、惨状と対照的。血・残酷な表現・けがの描写はなし。文字なし。

### ✅ cam03_corridor（背景）の描き直し: 非常ベル

現在の絵は、大理石の壁の何もない面に、ベルだけが埋まっているように見えます。ベルを、本物の非常ベルの形にします。

添付: `bg/cam03_corridor`（今の絵）

```
Generate an image. Edit the attached image. Keep exactly the same corridor, camera angle, composition, lighting, colors and art style. Only change the red fire alarm bell on the left marble wall: make it look like a real wall-mounted fire alarm unit. A round red alarm bell mounted on a small white rectangular backplate box, a short grey conduit pipe running up from the box into the ceiling, and a small square red manual call point (pull station) box just below it, with a tiny red indicator lamp. Keep it exactly one alarm unit, in the same position near the left edge. Do not change anything else. No text, no letters, no labels.
```

> **日本語訳**: 添付の絵を直す。廊下・角度・構図・明かり・色・絵柄はそのまま。左の大理石の壁の赤い非常ベルだけを、壁に取り付けられた本物の非常ベルの設備に見えるようにする。小さな白い四角い取り付け箱に丸い赤いベルが付き、箱から短い灰色の配管が天井へ上がり、すぐ下に小さな四角い赤い手動の発信機（押しボタンの箱）と、小さな赤い表示灯がある。設備は 1 つだけ、位置は今と同じ、左端の近く。ほかは変えない。文字・ラベルは入れない。

### ✅ jogasaki_aroused（城ヶ崎・情事のさなか）の描き直し: 襟

現在の絵は、シャツが肩から落ちて、襟と肩口が破れたように見えます。服は乱れていても、**破れても、ちぎれてもいない**形にします。

添付: `chars/jogasaki_aroused`（今の絵）、`chars/jogasaki_after`（服の描き方の手本）

```
Same character, same face, same expression and hair as the first attached image. Japanese anime style visual novel portrait, vertical 2:3, no text. Redraw only the clothing: the white dress shirt is unbuttoned from the collar down to the chest and the collar is open, but both shoulders are still covered by the shirt, the collar is intact, the fabric is clean and whole, with no tears, no ripped edges, no frayed fabric. The tie is yanked loose and hangs crooked. Sleeves rolled up. Same as the second attached image in how neatly the shirt is drawn. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
```

> **日本語訳**: 1 枚目の添付の絵と同じ人物・顔・表情・髪。日本のアニメ調のノベルゲームの立ち絵、縦長 2:3、文字なし。服だけを描き直す: 白いワイシャツは、襟から胸までボタンが外れて襟元が開いているが、両方の肩はシャツで覆われたまま、襟はそのまま、布はきれいで破れていない。裂け目・ちぎれた縁・ほつれはなし。ネクタイは引っぱってゆるめられ、曲がって垂れている。袖はまくっている。シャツのきちんとした描き方は、2 枚目の添付の絵と同じ。背景はクロマキー用の緑一色。人物に緑の光は入れない。

Negative prompt は、「密会の場面の立ち絵の Negative prompt」に、`torn clothes, ripped collar, torn shirt, tattered, frayed fabric` を足して使います。

---

## 絵をそろえるための決まり

同じ場所の絵どうし、また絵とシナリオが食い違わないよう、次の決まりに合わせて作ります。

### 建物

- ガラス張りの高層タワー「アークレジデンス＆タワー」。外観は `ch1_street_phone` の絵（ガラスのカーテンウォール、ガラスの正面玄関、植え込みのある広い歩道）を基準にする。
- 1F: 正面玄関とロビー、通りに面したブランドショップ、東廊下、ショップの裏の倉庫（バックヤード）。1F の窓から見えるのは、目の高さの通りだけ。高い所から見下ろす夜景は描かない。
- 6F: 法律事務所とエレベーターホール。事務所の窓から見えるのは、通りの向かいのビルの中ほどの階と、下に見える街灯や並木。真上から見下ろす夜景にはしない。
- 9F: 会員制サロンの前のエレベーターホール。窓はない（朝でも夜でも同じ絵を使えるようにするため）。
- B2: 中央監視室。

### カメラの絵（背景と場面の絵）

- 同じカメラの背景の絵と場面の絵は、同じ部屋・同じ角度・同じ配置にする。場面の絵は背景の絵を添付して作り、背景の絵を場面の絵から作ったときは、その場面の絵を添付する。
- その絵を写しているカメラ本体は描かない。
- 押せる機器（シナリオの `@hotspot`）と、人物の影の位置（`woman@245` など）が絵の中の機器や人の位置と合うように置く。絵ができたら、シナリオの座標を絵に合わせて直す。
- 文字は描かない。表示板・テレビ・名札は、文字のない無地にする（ゲームが文字を重ねて出すため）。
- 朝や昼の場面に夜の背景を使わない。朝の場面には朝の版の絵を作り、シナリオで `img:` を指定する。

### カメラごとの決まり

| カメラ | 決まり |
|---|---|
| CAM-01 ロビー | 受付、ガラスの正面玄関、壁のテレビ。夜も照明はついている（少し落とす）。夜はテレビがついている |
| CAM-02 ショップ | 通りに面したガラスの店先（閉店後は、その内側にシャッターを下ろす）。左の壁にバッグの棚、真ん中に宝飾品のガラスケース、右にレジのカウンター。カメラは店の奥の隅から店先の方を写す（レジの奥に立つ人は、背中しか映らない） |
| CAM-03 東廊下 | 大理石の壁の廊下（`ch1_sena_mop` を基準）。左の壁に赤い非常ベル、右の天井に小さな防犯センサー |
| CAM-04 バックヤード | 金属の棚にはさまれた通路と、突き当たりの扉（`ch1_backyard_affair` を基準）。扉の真上の壁に赤い非常ベル |
| CAM-05 エレベーター | 扉が真ん中。その真上の天井近くに、無地の表示板 |
| CAM-06 6F ホール | エレベーターの扉が真ん中に 1 つ。その上に無地の階数の表示板。左に非常階段の鉄の扉 |
| CAM-07 事務所 | 左手前に夫（拓海）の机（電話、カメラ側を向いた木の横板、そばにプリンター）。右の少し奥に妻（華子）の机（電話、ノートパソコン）。天井の真ん中にスピーカー。奥の壁に入口の扉と、無地の名札の列（2 日目までは 6 枚、3 日目の朝からは 5 枚）。夜は明かりを消した暗い部屋 |
| CAM-08 9F ホール | 明るい大理石の床、白い壁、観葉植物、サロンの入口の木の扉（`ch1_reiko_look` を基準） |
| CAM-10 非常階段 | 真ん中を下りていく階段。右に 1F の踊り場の鉄の扉、その上に文字を出せる黒い表示板（無地）。緑の誘導灯 |

### 人物

- 白髪の老紳士: 白髪をきれいになでつけ、紺のスーツ（`ch1_lobby_bow` を基準）。
- そのほかの人物は、立ち絵を添付して作る。

## 使い方

- **文章で指示するサイト**（ChatGPT・Gemini・Microsoft Designer・Ideogram など）: 各絵の「Prompt」を、そのまま 1 つ貼り付けてください。共通の指示も中に入れてあります。
- **Stable Diffusion 系のサイト**（SeaArt・Tensor.Art・Leonardo など。「Negative prompt」の欄があるサイト）: 下の「Stable Diffusion 系のサイト向け」の書き方も使えます。アニメ調のモデル（名前に Anime・Animagine・Pony などが入ったもの）を選ぶと、絵柄が出やすくなります。
- 2 枚目からは、気に入った絵を添付（参考画像・Image to Image・Character Reference など）して、文の頭に次を足すと、絵柄がそろいやすくなります。

  > Same art style, same coloring and same character design as the attached image.
  >
  > **日本語訳**: 添付の絵と、絵柄・色の塗り方・人物のデザインを同じにする。

- 表情違いは、次を足します。

  > Same character, same outfit, same pose. Only change the facial expression to: 〈表情〉.
  >
  > **日本語訳**: 同じ人物・同じ服・同じポーズ。表情だけを〈表情〉に変える。

- 色気は服・表情・しぐさ・光で出します。密会の場面の `saeki_flushed`・`jogasaki_aroused`・`jogasaki_after` だけは、服を大きく乱し、下着が少しのぞく（肩に落ちたブラのひも、はだけた胸もとからのぞくレースのふち）ところまでにしています（紅潮・汗・乱れた髪・はだけた服・息づかい）。それ以上（裸・胸があらわ・性的な行為）は描きません。どのプロンプトにも「服を着ている・露出しない」を入れてあります。消さないでください（公開するゲームのため。多くのサイトでも、消すと断られます）。

## Leonardo.ai で作るとき

- **モデル**: 個別のモデル（Leonardo Anime XL など）は選ばない。「Auto Image」を選ぶ（または左上の Preset / Model で自動選択にする）。プロンプトに `Japanese anime style illustration` や `cel shading` が入っていれば、アニメ調で出る。
- **大きさ**: 立ち絵は 2:3、場面と背景は 16:9 を選ぶ。
- **立ち絵の背景**: 無料プランでは透明な PNG で直接は出せないので、**クロマキー用の緑一色の背景（グリーンバック）**で出して、あとで背景を消す。
  - 白い背景は、服や肌の明るいところ・髪のすき間と区別しにくく、きれいに抜けないためやめた。緑は人物とまず色がかぶらない。
  - プロンプトには、`solid pure green background, bright green screen background, chroma key green` と、背景を影やグラデーションのないベタ塗りにする `flat solid background, clean sharp edges, no shadows on background` が入っている。
  - Negative prompt の欄があれば、下の共通の Negative prompt（`green ambient light, green color spill, green glow` が入っている）を入れる。人物に背景の緑が映り込むのを防ぐため。欄がなければ、プロンプトに入っている `No green light or green reflections on the character.` だけでよい。
  - 人物の服や持ち物に緑が多いときは、ブルーバックにする。プロンプトの `green` を `blue` に置き換える（`solid pure blue background, bright blue screen background, chroma key blue`、Negative prompt は `blue ambient light, blue color spill, blue glow`）。
  - `assets_src/images/chars/` にそのまま置けば、`tools/optimize_images.ps1` が緑（または青）の背景を自動で透明にし、ふちに残った緑みも取る。
- **絵柄と人物をそろえる**: 気に入った 1 枚にマウスを乗せると出る「Use as reference」ボタンを押す（または、プロンプト欄の左下の、画像を参照するアイコンから、その絵を選ぶ）。そのうえで、頭に「使い方」の一文（Same art style … as the attached image.）を付けて作る。
- **Negative prompt**: 欄があるモデルでは、下の「Stable Diffusion 系のサイト向け」の Negative prompt を入れる。
- **「content safety guidelines」で断られたとき**（トークンは戻ってくる）:
  - 本文の中の、検査に反応しやすい言葉を外す。下着の名前（bra・lingerie など）、`cleavage`、`sensual`、`forbidden`、`tryst`、`intoxicated`、そして `no nudity` のような**打ち消しの言葉**（「no」が付いていても単語そのものに反応する）。
  - 密会の場面の立ち絵には、1 段弱めた版と、いちばん控えめな版を用意してある。順に試す。
- **無料プランの決まり**（2026-11 時点で調べたこと。使う前に、最新の利用規約を確かめる）:
  - 作った絵は、無料プランでも商用を含めて使ってよい、と Leonardo は案内している。
  - ただし無料プランでは、作った絵は公開され（ほかの人にも見える）、絵の権利は Leonardo が持つ。
  - 使った絵は、[README.md](README.md) の「素材の一覧とライセンス」に「Leonardo.ai（無料プラン）」と記録する。

---

## 日本語訳の読み方

各プロンプトの下に日本語訳を付けています。**貼り付けるのは英語の枠の中だけです。** 訳は、中身を把握するためのものです。

何度も出てくる決まり文句は、訳の中では次の名前で書いています。

| 名前 | 意味 |
|---|---|
| 【立ち絵の共通指示】 | 日本のアニメ調のイラスト。大人向けサスペンスのビジュアルノベルの立ち絵。繊細な線画、くっきりしたセル塗り、少し抑えた上品な色。腰から上で、体は少し横向き、顔はこちらを見る。縦長 2:3。背景は緑一色のクロマキーで、影のないベタ塗り、輪郭はくっきり。人物に緑の光や映り込みなし。文字・ロゴ・透かしなし。 |
| 【差分の共通指示】 | 基準の絵と同じ人物・服・ポーズ。アニメ調のビジュアルノベルの立ち絵、縦長 2:3、文字なし。背景は緑一色のクロマキーで、影のないベタ塗り、輪郭はくっきり。人物に緑の光なし。 |
| 【密会の共通指示】 | 基準の絵と同じ人物。アニメ調の、大人向けサスペンスのビジュアルノベルの立ち絵。繊細な線画、くっきりしたセル塗り、腰から上、縦長 2:3。背景は緑一色のクロマキーで、影のないベタ塗り、輪郭はくっきり。人物に緑の光や映り込みなし。文字・ロゴ・透かしなし。 |
| 【参照の共通指示】 | 添付の絵と同じものを保ち、指定した部分だけを変える。アニメ調のビジュアルノベルの立ち絵。繊細な線画、くっきりしたセル塗り、腰から上、縦長 2:3、文字なし。背景は緑一色のクロマキーで、影のないベタ塗り、輪郭はくっきり。人物に緑の光や映り込みなし。 |

## 立ち絵 `images/chars/`（縦長 2:3、グリーンバック）

### 一ノ瀬玲子

#### ✅ reiko_normal（一ノ瀬玲子・ふだん）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted elegant colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 34-year-old woman, the hostess (mama) of an exclusive members-only salon in a luxury tower. Long black hair with soft waves, swept to one side. Violet eyes, slightly downcast, long eyelashes. Red lipstick, a small beauty mark near her lips. Wearing an off-the-shoulder wine-red evening gown (fully clothed, elegant, not revealing), a thin gold necklace and drop earrings. Graceful, alluring and refined, with a hint of loneliness.
Expression: a calm, gentle, faint smile.
```

> **日本語訳**: 【立ち絵の共通指示】
>
> 人物: 34 歳の女性。高級タワーの中にある会員制サロンのママ。ゆるいウェーブの長い黒髪を片側に流している。紫の瞳はやや伏し目がちで、まつげが長い。赤い口紅、口もとに小さなほくろ。肩を出したワインレッドのイブニングドレス（服は着ていて、上品で、露出は多くない）、細い金のネックレス、揺れるイヤリング。優雅で色っぽく洗練されていて、どこか寂しげ。
>
> 表情: 穏やかで優しい、かすかな微笑み。

#### ✅ reiko_smile（玲子・艶っぽい微笑み）

```
Same character, same outfit, same pose as reiko_normal. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: eyes narrowed slightly, a sultry, knowing smile, head tilted a little. Elegant and alluring, fully clothed.
```

> **日本語訳**: 【差分の共通指示】（基準の絵: reiko_normal）
>
> 表情: 目を少し細めた、色っぽく、何かを知っているような微笑み。首を少しかしげる。上品で色っぽく、服は着ている。

#### ✅ reiko_sad（玲子・すまなそうな顔）

```
Same character, same outfit, same pose as reiko_normal. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: eyes cast down, an apologetic, guilty and sorrowful look, lips slightly pressed together.
```

> **日本語訳**: 【差分の共通指示】（基準の絵: reiko_normal）
>
> 表情: 目を伏せ、すまなそうで、後ろめたく、悲しげな顔。唇を軽く結ぶ。

### 佐伯瑠璃

#### ✅ saeki_smile（佐伯瑠璃・営業スマイル）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted elegant colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 32-year-old woman, the manager of a high-end luxury brand boutique. Bright chestnut-brown bob haircut with curled ends, sharp winged eyeliner, glamorous and confident beauty. Wearing the boutique's black fitted jacket and pencil skirt uniform with an elegant silk scarf at the neck (fully clothed, stylish).
Expression: a flawless, polished customer-service smile.
```

> **日本語訳**: 【立ち絵の共通指示】
>
> 人物: 32 歳の女性。高級ブランドショップの店長。毛先を巻いた明るい栗色のボブ、はね上げた鋭いアイライン。華やかで自信に満ちた美人。店の制服である黒のタイトなジャケットとペンシルスカート、首に上品なシルクのスカーフ（服は着ていて、おしゃれ）。
>
> 表情: 非の打ちどころのない、洗練された接客の笑顔。

#### ✅ saeki_scorn（佐伯・見下す目）

```
Same character, same outfit, same pose as saeki_smile. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: chin raised slightly, looking down on the viewer with cold, contemptuous eyes, a faint sneer.
```

> **日本語訳**: 【差分の共通指示】（基準の絵: saeki_smile）
>
> 表情: 顎を少し上げ、冷たく軽蔑した目でこちらを見下ろす。かすかに鼻で笑う。

#### ✅ saeki_normal（佐伯・すました顔）

```
Same character, same outfit, same pose as saeki_smile. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: composed, aloof, neutral face.
```

> **日本語訳**: 【差分の共通指示】（基準の絵: saeki_smile）
>
> 表情: すました、よそよそしい、感情を見せない顔。

#### ✅ saeki_flushed（佐伯・情事のさなか、紅潮した姿）

```
Same character as saeki_smile: a 32-year-old glamorous woman with a chestnut-brown bob haircut with curled ends and sharp winged eyeliner. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Scene: a secret late-night rendezvous in a dim stockroom.
Look: deeply flushed cheeks and ears, dewy skin with a light sheen of sweat on her neck, shoulders and collarbone, half-lidded glossy eyes with a dazed, lovestruck gaze, lips parted as if catching her breath. Her bob hair is badly tousled, strands clinging to her cheek and neck. Her clothes are in disarray: the black uniform jacket has slid down off both shoulders to her elbows, the silk scarf hangs untied, and her white blouse is unbuttoned at the top and pulled askew, slipping off one bare shoulder. A thin black strap has slipped down that shoulder, with a glimpse of black lace at the open collar. Her pencil skirt is wrinkled. One hand clutches the open front of her blouse.
Mood: flustered, breathless, alluring, elegant.
```

> **日本語訳**: 【密会の共通指示】（人物: saeki_smile と同じ。毛先を巻いた栗色のボブと鋭いアイラインの、華やかな 32 歳の女性）
>
> 場面: 薄暗い倉庫での、深夜の秘密の逢い引き。
>
> 見た目: 頬と耳が深く紅潮し、首・肩・鎖骨に薄く汗が光る。とろんとうるんだ半開きの目で、ぼうっと恋に酔った視線。息を整えるように唇が開く。ボブの髪はひどく乱れ、頬と首に張りつく。服も乱れている。黒い制服のジャケットは両肩からひじまでずり落ち、シルクのスカーフはほどけて垂れ、白いブラウスは上のボタンが外れてずれ、片方のあらわな肩から滑り落ちかけている。その肩には細い黒のひもが落ち、開いた襟もとに黒いレースが少しのぞく。ペンシルスカートにはしわ。片手でブラウスの開いた前をつかむ。
>
> 雰囲気: うろたえ、息を切らし、色っぽく、上品。

Negative prompt は、下の「密会の場面の立ち絵の Negative prompt」を使います。

**断られたとき（1 段弱めた版）**: 黒いひもとレースを外し、はだけ方を少し控えめにしたもの。

```
Same character as saeki_smile: a 32-year-old glamorous woman with a chestnut-brown bob haircut with curled ends and sharp winged eyeliner. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Scene: a secret late-night rendezvous in a dim stockroom.
Look: deeply flushed cheeks and ears, dewy skin with a light sheen of sweat on her neck and collarbone, half-lidded glossy eyes with a dazed, lovestruck gaze, lips slightly parted. Her bob hair is tousled, a few strands clinging to her cheek. Her black uniform jacket has slipped down off her shoulders, the silk scarf hangs untied, the top two buttons of her white blouse are open and the collar is askew, showing one bare shoulder. One hand holds the front of her blouse, and she glances away, flustered.
Mood: flustered, romantic, alluring, elegant.
```

> **日本語訳**: 【密会の共通指示】（人物: 上と同じ）
>
> 場面: 薄暗い倉庫での、深夜の秘密の逢い引き。
>
> 見た目: 頬と耳が深く紅潮し、首と鎖骨に薄く汗が光る。とろんとうるんだ半開きの目で、ぼうっと恋に酔った視線。唇は少し開く。ボブの髪は乱れ、数本が頬に張りつく。黒い制服のジャケットは肩からずり落ち、シルクのスカーフはほどけて垂れ、白いブラウスは上の 2 つのボタンが開いて襟がずれ、片方の肩が出ている。片手でブラウスの前を押さえ、うろたえて目をそらす。
>
> 雰囲気: うろたえ、ロマンチックで、色っぽく、上品。

**それでも断られたとき（いちばん控えめな版）**: 肩も出さず、紅潮と乱れた髪・ゆるんだスカーフだけで見せるもの。

```
Same character as saeki_smile: a 32-year-old glamorous woman with a chestnut-brown bob haircut with curled ends and sharp winged eyeliner. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Look: blushing deeply, flustered and out of breath, half-lidded glossy eyes, lips slightly parted, tousled bob hair with a few strands on her cheek. Her silk scarf is loosened and her blouse collar is slightly askew. She glances away with an embarrassed, dreamy expression.
Mood: romantic, flustered, alluring.
```

> **日本語訳**: 【密会の共通指示】（人物: 上と同じ）
>
> 見た目: 深く赤面し、うろたえて息を切らしている。とろんとうるんだ半開きの目、少し開いた唇。乱れたボブの髪が数本、頬にかかる。シルクのスカーフはゆるみ、ブラウスの襟は少しずれている。恥ずかしそうな、夢見るような顔で目をそらす。
>
> 雰囲気: ロマンチックで、うろたえ、色っぽい。

### 城ヶ崎華子

`hanako_angry` を基準の絵にして、ほかの表情はこの絵を参照して作ります。

#### ✅ hanako_angry（城ヶ崎華子・静かな怒り。基準の絵）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted elegant colors. Waist-up, body facing the viewer, turned only slightly to the side, face looking straight at the viewer. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 45-year-old adult woman, the head partner of a law firm. Long, straight, glossy black hair worn down, flowing past her shoulders to her chest, parted to one side. Thin-framed glasses. A strikingly beautiful mature woman with a severe, intimidating face: sharp narrow eyes, upswept eyeliner, thin arched eyebrows, high cheekbones, a defined jawline, dark red lips. A voluptuous, curvy figure with a full bust and a narrow waist. Wearing a fitted navy tailored suit, fully buttoned, over a white blouse, with a lawyer's badge on the lapel.
Expression: cold, sharp and commanding, looking down on the viewer slightly, lips closed, with no openings.
```

> **日本語訳**: 【立ち絵の共通指示】（ただし、体はこちらに向け、横向きはわずか。顔はまっすぐこちらを見る）
>
> 人物: 45 歳の大人の女性。法律事務所の代表弁護士。つやのあるまっすぐな長い黒髪をおろし、肩を越えて胸まで流している。髪は片側で分ける。細いフレームの眼鏡。目を引くほど美しい成熟した女性で、きつく威圧的な顔立ち。鋭く細い目、はね上げたアイライン、細いアーチ形の眉、高い頬骨、はっきりしたあごの線、濃い赤の唇。豊かな胸と細い腰の、肉感的で曲線的な体つき。体に合った濃紺のテーラードスーツをボタンをすべて留めて着て、白いブラウスを合わせ、襟に弁護士のバッジ。
>
> 表情: 冷たく鋭く、人を従わせる顔。こちらを少し見下ろし、唇を閉じ、隙がない。
>
> ※採用した絵では、指定と違ってブラウスの胸もとが開いています。

Negative prompt:

```
hair bun, updo, ponytail, tied hair, short hair, back view, looking over shoulder, soft face, gentle smile, round eyes, flat chest, green ambient light, green color spill, green glow, text, watermark
```

> **日本語訳**: 入れないもの: お団子、まとめ髪、ポニーテール、結んだ髪、短い髪、後ろ姿、振り返るポーズ、優しい顔、穏やかな笑み、丸い目、平らな胸、人物への緑の光・色移り・にじみ、文字、透かし。

#### ✅ hanako_normal（華子・静かな笑み）

`hanako_angry` を参照して作ります。参照の効きが強いと表情が変わらないので、Strength は Low〜Mid から試します。

```
Same character, same outfit, same pose, same art style as the attached image. Only change the eyebrows, eyes and mouth. Japanese anime style visual novel portrait, delicate line art, crisp cel shading, waist-up, vertical 2:3, no text. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character.
Expression: a quiet, composed, faint smile. Eyebrows relaxed, smooth and gently arched, with a smooth forehead and a relaxed space between the brows. Calm, steady eyes looking at the viewer, slightly narrowed with confidence. The corners of her lips turned up just a little, lips closed. A serene, poised, self-assured beauty who reveals nothing.
```

> **日本語訳**: 【参照の共通指示】（変えるのは眉・目・口だけ。人物・服・ポーズ・絵柄は添付の絵と同じ）
>
> 表情: 静かで落ち着いた、かすかな笑み。眉は力が抜けてなめらかで、ゆるやかなアーチを描き、額はなめらかで眉間もゆるんでいる。落ち着いた揺るがない目でこちらを見て、自信から少し目を細める。口角はほんの少し上がり、唇は閉じる。穏やかで品があり、自信に満ち、何も見せない美人。

Negative prompt:

```
furrowed brows, frown, angry, glaring, scowl, knitted eyebrows, wrinkles between the eyebrows, downturned mouth, open mouth, teeth, wide grin, hair bun, updo, short hair, green ambient light, green color spill, green glow, text, watermark
```

> **日本語訳**: 入れないもの: ひそめた眉、しかめ面、怒り、にらみつける目、険しい顔、寄せた眉、眉間のしわ、下がった口角、開いた口、歯、大きな笑顔、お団子、まとめ髪、短い髪、人物への緑の光・色移り・にじみ、文字、透かし。

#### ✅ hanako_rage（華子・激高）

`hanako_angry` を参照して作ります。

```
Same character, same outfit, same art style as the attached image. Only change the facial expression and pose. Japanese anime style visual novel portrait, delicate line art, crisp cel shading, waist-up, vertical 2:3, no text. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character.
Expression: explosive, furious rage. Eyes wide open and blazing behind the glasses, small contracted pupils, eyebrows sharply drawn together and slanted, deep furrow between the brows, flushed cheeks, mouth open mid-shout with clenched teeth visible, jaw tense.
Pose: leaning forward toward the viewer, shoulders raised and tense, one hand raised, pointing a finger accusingly at the viewer. Long black hair swept and disheveled by the sudden movement, a few strands falling across her face. Her glasses are slightly askew. Still beautiful and intimidating, fully clothed in the navy suit.
```

> **日本語訳**: 【参照の共通指示】（変えるのは表情とポーズだけ。人物・服・絵柄は添付の絵と同じ）
>
> 表情: 爆発するような激しい怒り。眼鏡の奥で目を見開いて燃え上がらせ、瞳孔は小さく収縮する。眉は鋭く寄せてつり上がり、眉間に深いしわ。頬は紅潮し、叫んでいる途中で口が開き、食いしばった歯が見え、あごに力が入る。
>
> ポーズ: こちらへ身を乗り出し、肩を上げて力を入れ、片手を上げて、責めるようにこちらを指さす。長い黒髪は急な動きで振れて乱れ、数本が顔にかかる。眼鏡は少しずれている。それでも美しく威圧的で、濃紺のスーツをきちんと着ている。

Negative prompt:

```
calm face, smile, closed mouth, soft expression, sad, crying, hair bun, updo, short hair, back view, extra fingers, deformed hands, green ambient light, green color spill, green glow, text, watermark
```

> **日本語訳**: 入れないもの: 落ち着いた顔、笑顔、閉じた口、柔らかい表情、悲しみ、泣き顔、お団子、まとめ髪、短い髪、後ろ姿、指の増えた手、崩れた手、人物への緑の光・色移り・にじみ、文字、透かし。

### 瀬名遥

#### ✅ sena_normal（瀬名遥・まっすぐ）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 33-year-old woman who works as a night-shift building cleaner. Black hair tied back in a single ponytail. Little makeup but naturally good-looking, with strong, determined eyes. Wearing a gray work uniform with a towel around her neck. On her left wrist, a men's wristwatch that is too large for her.
Expression: looking straight at the viewer, serious and steady.
```

> **日本語訳**: 【立ち絵の共通指示】（色は「少し抑えた色」で、「上品な」の指定なし）
>
> 人物: 33 歳の女性。ビルの夜間清掃の作業員。黒髪を後ろで一つのポニーテールに結ぶ。化粧は薄いが、もともと整った顔立ちで、強く意志のある目。グレーの作業着、首にタオル。左の手首には、彼女には大きすぎる男物の腕時計。
>
> 表情: まっすぐこちらを見る、真剣で揺るがない顔。

#### ✅ sena_smile（瀬名・からかう笑み）

```
Same character, same outfit, same pose as sena_normal. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: a slight teasing smile, one eyebrow a little raised, warm but a bit tired.
```

> **日本語訳**: 【差分の共通指示】（基準の絵: sena_normal）
>
> 表情: 少しからかうような笑み。片方の眉を少し上げる。温かいが、少し疲れている。

### 城ヶ崎拓海

#### ✅ jogasaki_scorn（城ヶ崎拓海・吐き捨てる）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted colors. Waist-up, body turned slightly to the side. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 40-year-old elite lawyer. Neatly styled hair, an expensive dark suit and tie. Arrogant, handsome in a cold way.
Expression: looking down at the viewer with disdain, as if spitting out the words "get lost".
```

> **日本語訳**: 【立ち絵の共通指示】（色は「少し抑えた色」で、「上品な」の指定なし。顔の向きの指定なし）
>
> 人物: 40 歳のエリート弁護士。きちんと整えた髪、高級な濃い色のスーツとネクタイ。尊大で、冷たい感じの二枚目。
>
> 表情: 「失せろ」と吐き捨てるように、軽蔑してこちらを見下ろす。

#### ✅ jogasaki_normal（城ヶ崎・澄ました顔）

```
Same character, same outfit, same pose as jogasaki_scorn. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: smug, self-satisfied, neutral face.
```

> **日本語訳**: 【差分の共通指示】（基準の絵: jogasaki_scorn）
>
> 表情: 得意げで自己満足した、感情を見せない顔。
>
> ※基準の jogasaki_scorn は未生成ですが、この絵は生成済みです。jogasaki_scorn を作るときは、この絵を参照するとそろいやすくなります。

#### ✅ jogasaki_aroused（城ヶ崎・情事のさなか、興奮している）

```
Same character as jogasaki_scorn: a 40-year-old elite lawyer with neatly styled hair and an expensive dark suit. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Scene: a secret late-night rendezvous in a dim stockroom.
Look: flushed face, sweat on his forehead and neck, breathing hard, eyes burning with excitement and possessiveness, a hungry, self-satisfied grin. Jacket off. His tie is yanked loose and hanging crooked, his dress shirt is unbuttoned almost to the waist and half untucked, showing part of his chest, one side slipping off his shoulder. Hair fallen out of place over his forehead, sleeves shoved up.
Mood: heated, reckless, arrogant excitement.
```

> **日本語訳**: 【密会の共通指示】（人物: jogasaki_scorn と同じ。きちんと整えた髪と高級な濃い色のスーツの、40 歳のエリート弁護士）
>
> 場面: 薄暗い倉庫での、深夜の秘密の逢い引き。
>
> 見た目: 顔が紅潮し、額と首に汗をかき、息が荒い。興奮と独占欲に燃える目で、飢えたような、自己満足した笑み。上着は脱いでいる。ネクタイは引っぱってゆるめられ、曲がって垂れている。ワイシャツは腰近くまでボタンが外れて半分はみ出し、胸の一部が見え、片側は肩から滑り落ちかけている。髪は崩れて額にかかり、袖はまくり上げている。
>
> 雰囲気: 熱に浮かされ、無謀で、尊大な興奮。

Negative prompt は、下の「密会の場面の立ち絵の Negative prompt」を使います。

#### ✅ jogasaki_after（城ヶ崎・情事を終えて、すっきりした顔）

```
Same character as jogasaki_scorn: a 40-year-old elite lawyer with an expensive dark suit. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Scene: just after a secret rendezvous, he is putting himself back together before leaving.
Look: relaxed, satisfied, smug smirk, eyes half-closed with lazy contentment, a faint flush still on his cheeks. His shirt is still open at the chest and carelessly half tucked in; he is buttoning it back up with one hand, the loose tie draped around his neck, hair mussed and being smoothed back, suit jacket slung over his shoulder.
Mood: complacent, refreshed, arrogant, as if nothing in the world can touch him.
```

> **日本語訳**: 【密会の共通指示】（人物: jogasaki_scorn と同じ。高級な濃い色のスーツの、40 歳のエリート弁護士）
>
> 場面: 秘密の逢い引きの直後。帰る前に身なりを整えている。
>
> 見た目: 力が抜けて満足した、得意げなにやけ顔。目は半ば閉じ、けだるく満ち足りている。頬にはまだうっすら赤みが残る。シャツは胸が開いたままで、無造作に半分だけズボンに入れていて、片手でボタンを留め直している。ゆるんだネクタイを首にかけ、乱れた髪をなでつけ、スーツの上着を肩に引っかけている。
>
> 雰囲気: 満足げで、すっきりしていて、尊大。世界の何も自分には手を出せないと思っているよう。

Negative prompt は、下の「密会の場面の立ち絵の Negative prompt」を使います。

### 久住正臣

#### ✅ kuzumi_normal（久住正臣）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, muted colors. Waist-up, body turned slightly to the side. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 55-year-old man, the manager of a building management company. Graying hair, a plain gray suit. An inconspicuous, colorless man you would never remember. He is holding a stack of documents and aligning their corners with his fingers.
Expression: expressionless, polite, unreadable.
```

> **日本語訳**: 【立ち絵の共通指示】（色は「抑えた色」。顔の向きの指定なし）
>
> 人物: 55 歳の男性。ビル管理会社の所長。白髪まじりで、地味なグレーのスーツ。目立たず色のない、誰の記憶にも残らない男。書類の束を持ち、指で角をそろえている。
>
> 表情: 無表情で礼儀正しく、何を考えているか読めない。
>
> ※採用した絵は、指定と違ってほぼ後ろ向きです。

### 大河内誠司

#### ✅ okochi_normal（大河内誠司）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, muted colors. Waist-up, body turned slightly to the side. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 52-year-old police detective. A worn beige trench coat, stubble, tired but sharp eyes. Chewing gum.
Expression: a piercing, suspicious stare.
```

> **日本語訳**: 【立ち絵の共通指示】（色は「抑えた色」。顔の向きの指定なし）
>
> 人物: 52 歳の刑事。くたびれたベージュのトレンチコート、無精ひげ、疲れているが鋭い目。ガムをかんでいる。
>
> 表情: 射抜くような、疑いの目。

### 密会の場面の立ち絵の Negative prompt（saeki_flushed・jogasaki_aroused・jogasaki_after）

この 3 枚では、Negative prompt は共通のものではなく、次を使います（共通のものに入っている `underwear, lingerie` を外し、はっきりしすぎる表現を防ぐ単語を足したもの）。

- 「はっきりしすぎない」ための指定は、**本文には書かず、この Negative prompt の欄だけに書きます**。本文に「no nudity」などと打ち消しで書くと、サイトの検査が単語そのものに反応して断られやすいためです。
- Negative prompt の欄がないモデルでは、何も足さずに本文だけで作ります。
- Negative prompt を入れて断られるときは、欄を空にして試します（欄の単語に反応するサイトもあるため）。

```
nsfw, explicit, nude, topless, nipples, exposed breasts, sex, lowres, bad anatomy, bad hands, extra fingers, missing fingers, deformed, blurry, text, watermark, signature, logo, username, jpeg artifacts, child, loli, green ambient light, green color spill, green glow
```

> **日本語訳**: 入れないもの: 成人向けの表現、露骨な表現、裸、上半身裸、胸の露出、性行為、低解像度、崩れた体、崩れた手、指の増減、変形、ぼやけ、文字、透かし、署名、ロゴ、ユーザー名、JPEG のノイズ、子ども、人物への緑の光・色移り・にじみ。

---

## 場面の絵 `images/scenes/`（横長 16:9）

監視カメラから見た絵には、次の一文が入っています。屋外の絵には入っていません。

> viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion
>
> **日本語訳**: 隅の天井に付いた防犯カメラから見た構図。見下ろす角度で、広角レンズの軽いゆがみ。

### ✅ ch1_reiko_look（玲子がカメラを見上げる）

```
Japanese anime style background art with characters, cinematic. Late night inside a luxury high-rise tower, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Dim, quiet, uneasy night lighting. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
Scene: the 9th-floor elevator hall in front of an exclusive members-only salon, with a potted plant. A beautiful woman with long wavy black hair in an off-the-shoulder wine-red evening gown is waiting for the elevator. She has just looked up directly into the security camera, meeting the viewer's eyes, with a faint, mysterious expression. Elegant and alluring, fully clothed.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。深夜の高級高層タワーの中を、隅の天井に付いた防犯カメラから見た構図。見下ろす角度で、広角レンズの軽いゆがみ。薄暗く静かで、不安な夜の光。横長 16:9。文字・時刻表示・ロゴ・透かしなし。
>
> 場面: 会員制サロンの前の 9 階エレベーターホール。観葉植物がある。ゆるいウェーブの長い黒髪で、肩を出したワインレッドのイブニングドレスの美しい女性が、エレベーターを待っている。女性はたった今、防犯カメラをまっすぐ見上げて見る人と目を合わせ、かすかに謎めいた表情を浮かべている。上品で色っぽく、服は着ている。

### ✅ ch1_backyard_affair（バックヤードの密会）

```
Japanese anime style background art with characters, cinematic. Late night, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Very dim lighting, deep shadows. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
Scene: the cramped stockroom behind a luxury boutique, with stacks of cardboard boxes and metal shelves. In the shadow of the boxes, a man in a suit and a woman in a black boutique uniform are embracing closely, fully clothed. Their faces are hard to see in the darkness. A secret, hushed atmosphere.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。深夜、隅の天井に付いた防犯カメラから見た構図。見下ろす角度で、広角レンズの軽いゆがみ。とても暗く、影が深い。横長 16:9。文字・時刻表示・ロゴ・透かしなし。
>
> 場面: 高級ブランドショップの裏の狭い倉庫。段ボールの山と金属の棚。段ボールの陰で、スーツの男と黒い店の制服の女が、服を着たまま寄り添って抱き合っている。暗くて顔はよく見えない。秘密めいて、ひそやかな空気。

### ✅ ch1_sena_mop（瀬名のモップがけ）

```
Japanese anime style background art with a character, cinematic. Late night inside a luxury high-rise tower, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Dim, quiet night lighting. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
Scene: a long, empty ground-floor corridor. A woman in a gray cleaning uniform with her hair tied back is mopping the floor. She has paused and is tracing a line on the wall with her fingertips, as if checking for cracks.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。深夜の高級高層タワーの中を、隅の天井に付いた防犯カメラから見た構図。見下ろす角度で、広角レンズの軽いゆがみ。薄暗く静かな夜の光。横長 16:9。文字・時刻表示・ロゴ・透かしなし。
>
> 場面: 1 階の、長く人のいない廊下。グレーの清掃の制服で髪を後ろで結んだ女性が、床にモップをかけている。手を止めて、ひび割れを確かめるように、指先で壁に線をなぞっている。

### ✅ ch1_backyard_confront（修羅場）

```
Japanese anime style background art with characters, cinematic. Late night, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Dim lighting, light spilling in from an open door. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
Scene: the stockroom behind a luxury boutique with cardboard boxes. A beautiful, stern woman with a curvy figure, a navy suit, long straight black hair worn down and thin-framed glasses stands in the open doorway, cold and furious. A man in a disheveled suit is panicking in front of her. A woman in a black boutique uniform is frozen against the wall, clutching her jacket to her chest. All fully clothed. A tense confrontation.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。深夜、隅の天井に付いた防犯カメラから見た構図。見下ろす角度で、広角レンズの軽いゆがみ。薄暗く、開いた扉から光が差し込む。横長 16:9。文字・時刻表示・ロゴ・透かしなし。
>
> 場面: 高級ブランドショップの裏の、段ボールのある倉庫。曲線的な体つきの、美しく厳しい顔の女性が、濃紺のスーツ、おろしたまっすぐな長い黒髪、細いフレームの眼鏡で、開いた扉のところに立ち、冷たく激怒している。その前で、服の乱れたスーツの男がうろたえている。黒い店の制服の女が、上着を胸に抱えて壁際で固まっている。全員、服は着ている。張りつめた対決の場面。
>
> ※採用した絵は、華子が扉から入ってきた瞬間で、男女はまだ抱き合っています。

### ✅ ch1_monitor_room（監視室）

```
Japanese anime style background art with a character, cinematic, moody. A small, cramped basement security monitoring room late at night. A whole wall of glowing CCTV monitors is the only light, casting green light. Damp concrete walls. Seen from behind: a hunched man in a security guard's work uniform sits in front of the monitors holding a can of cold coffee. An empty second chair beside him. Lonely atmosphere. Horizontal 16:9. No text, no logo, no watermark.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくりで、重い空気。深夜の、狭い地下の中央監視室。壁一面の光る監視モニターだけが明かりで、緑の光を投げかけている。湿ったコンクリートの壁。後ろ姿: 警備員の作業着の男が背を丸めてモニターの前に座り、冷めた缶コーヒーを持っている。隣には空いた 2 つ目の椅子。孤独な空気。横長 16:9。文字・ロゴ・透かしなし。

### ✅ ch1_shop_card（ブランドショップ）

```
Japanese anime style background art with characters, cinematic. A high-end luxury brand boutique just before closing time, warm elegant lighting, designer handbags on the shelves, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no brand names, no logo, no watermark.
Scene: an elderly, distinguished man with neatly combed-back white hair, in an expensive suit, is handing a credit card over the counter without even looking at the price. The female shop manager with a chestnut bob, in a black uniform, is bowing deeply to him.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。閉店まぎわの高級ブランドショップ。温かく上品な光で、棚にデザイナーズのハンドバッグ。隅の天井に付いた防犯カメラから見た、見下ろす構図。横長 16:9。文字・ブランド名・ロゴ・透かしなし。
>
> 場面: 白髪をきちんと後ろになでつけた、高級なスーツの上品な年配の男性が、値段も見ずにカウンター越しにクレジットカードを差し出している。黒い制服で栗色のボブの女性店長が、彼に深く頭を下げている。

### ✅ ch1_lobby_bow（ロビーで頭を下げる）

```
Japanese anime style background art with characters, cinematic. The grand lobby of a luxury high-rise tower at night, marble floor, a reception counter, glass entrance doors, a TV on the wall, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Horizontal 16:9. No text, no logo, no watermark.
Scene: a younger man in a sharp suit stops in front of an elderly white-haired man in an expensive suit and bows deeply to him.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。夜の高級高層タワーの豪華なロビー。大理石の床、受付カウンター、ガラスの正面扉、壁のテレビ。隅の天井に付いた防犯カメラから見た構図で、見下ろす角度、広角レンズの軽いゆがみ。横長 16:9。文字・ロゴ・透かしなし。
>
> 場面: 仕立てのよいスーツの若めの男が、高級なスーツの白髪の年配の男の前で立ち止まり、深く頭を下げている。

### ✅ ch1_office_couple（事務所の夫婦）

```
Japanese anime style background art with characters, cinematic. A law firm office at night, large windows with a glittering city night view, two desks, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no logo, no watermark.
Scene: at the far desk, a beautiful, stern woman with a curvy figure, a navy suit, long straight black hair worn down and thin-framed glasses is reading documents. A man in a suit bends low and obsequiously serves her a cup of coffee, rubbing his hands together.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。夜の法律事務所。大きな窓にきらめく街の夜景、机が 2 つ。隅の天井に付いた防犯カメラから見た、見下ろす構図。横長 16:9。文字・ロゴ・透かしなし。
>
> 場面: 奥の机で、曲線的な体つきの、美しく厳しい顔の女性が、濃紺のスーツ、おろしたまっすぐな長い黒髪、細いフレームの眼鏡で、書類を読んでいる。スーツの男が腰を低くかがめ、揉み手をしながら、へつらうようにコーヒーを差し出している。

### ✅ ch1_hanako_desk（深夜の華子）

```
Japanese anime style background art with a character, cinematic. A law firm office very late at night, only one desk lamp lit, a city night view through the windows, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no logo, no watermark.
Scene: a beautiful, stern woman with a curvy figure, a navy suit, long straight black hair worn down and thin-framed glasses sits alone at her desk, reading documents. The other desk is empty.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。深夜遅くの法律事務所。机のスタンドが 1 つだけともり、窓の向こうに街の夜景。隅の天井に付いた防犯カメラから見た、見下ろす構図。横長 16:9。文字・ロゴ・透かしなし。
>
> 場面: 曲線的な体つきの、美しく厳しい顔の女性が、濃紺のスーツ、おろしたまっすぐな長い黒髪、細いフレームの眼鏡で、ひとりで机に座って書類を読んでいる。もう 1 つの机は空いている。

### ✅ ch1_shop_front（店の前の二人）

```
Japanese anime style illustration, cinematic, early evening. The entrance of a luxury brand boutique on the ground floor of a high-rise tower, warm light from the shop. Eye-level view. Horizontal 16:9. No text, no brand names, no logo, no watermark.
Scene: the shop manager, a glamorous woman with a chestnut bob in a black uniform, is laughing and chatting with an elegant woman with long wavy black hair in a wine-red off-the-shoulder evening gown (fully clothed). They look like close friends.
```

> **日本語訳**: 日本のアニメ調のイラスト。映画のような絵づくりで、夕方。高層タワーの 1 階にある高級ブランドショップの入口。店からの温かい光。目の高さの構図。横長 16:9。文字・ブランド名・ロゴ・透かしなし。
>
> 場面: 店長である、栗色のボブで黒い制服の華やかな女性が、ゆるいウェーブの長い黒髪で肩を出したワインレッドのイブニングドレス（服は着ている）の上品な女性と、笑っておしゃべりしている。親友のように見える。

### ✅ ch1_elevator_close（エレベーターで締め出す）

```
Japanese anime style illustration, cinematic. Inside a plain service elevator of an office tower, seen from just outside the doors as they begin to close. Horizontal 16:9. No text, no logo, no watermark.
Scene: an arrogant man in an expensive suit stands inside and presses the "close door" button without even glancing at the viewer.
```

> **日本語訳**: 日本のアニメ調のイラスト。映画のような絵づくり。オフィスタワーの飾り気のない業務用エレベーターの中を、閉まり始めた扉のすぐ外から見た構図。横長 16:9。文字・ロゴ・透かしなし。
>
> 場面: 高級なスーツの尊大な男が中に立ち、こちらを見もせずに「閉」のボタンを押している。

### ✅ ch1_street_phone（朝の歩道）

```
Japanese anime style illustration, cinematic. Early morning sidewalk in front of a gleaming luxury high-rise tower, harsh bright morning sunlight, eye-level view. Horizontal 16:9. No text, no logo, no watermark.
Scene: a man in an expensive suit walks toward the viewer while talking on his phone, with a smug, irritated expression.
```

> **日本語訳**: 日本のアニメ調のイラスト。映画のような絵づくり。輝く高級高層タワーの前の、早朝の歩道。強くまぶしい朝日で、目の高さの構図。横長 16:9。文字・ロゴ・透かしなし。
>
> 場面: 高級なスーツの男が、携帯で話しながらこちらへ歩いてくる。得意げで、いら立った顔。

### ✅ ch1_couple_morning（腕を組む二人）

```
Japanese anime style illustration, cinematic. Early morning sidewalk in front of a luxury high-rise tower, bright morning sunlight. Horizontal 16:9. No text, no logo, no watermark.
Scene: seen from behind, a man in a suit and a woman with a chestnut bob walk away arm in arm, laughing together.
```

> **日本語訳**: 日本のアニメ調のイラスト。映画のような絵づくり。高級高層タワーの前の、早朝の歩道。明るい朝日。横長 16:9。文字・ロゴ・透かしなし。
>
> 場面: 後ろ姿で、スーツの男と栗色のボブの女が、腕を組み、笑い合いながら歩いていく。

### ✅ ch1_dawn_building（朝日のビル）

```
Japanese anime style background art, cinematic. Looking up at a gleaming glass luxury high-rise tower from its entrance, early morning, the rising sun blazing behind it, dazzling lens flare, the top of the building lost in the glare. Horizontal 16:9. No people. No text, no logo, no watermark.
```

> **日本語訳**: 日本のアニメ調の背景画。映画のような絵づくり。ガラス張りの輝く高級高層タワーを、入口から見上げた構図。早朝で、昇る朝日がビルの後ろで燃えるように輝き、まぶしいレンズフレアが入り、ビルの上の方は光に消えている。横長 16:9。人物なし。文字・ロゴ・透かしなし。

### ✅ ch1_dropped_cans（転がった缶）

```
Japanese anime style illustration, cinematic, close-up. Early morning sidewalk in harsh sunlight. A dropped convenience-store plastic bag, a can of beer rolling across the pavement and a pack of sliced roast pork lying nearby. No people, nothing gory. A sense that something terrible just happened off-screen. Horizontal 16:9. No text, no logo, no watermark.
```

> **日本語訳**: 日本のアニメ調のイラスト。映画のような絵づくりで、寄りの構図。強い日差しの、早朝の歩道。コンビニのレジ袋が落ち、缶ビールが路面を転がり、チャーシューのパックが近くに落ちている。人物なし、むごい描写なし。画面の外で何か恐ろしいことが起きた直後、という気配。横長 16:9。文字・ロゴ・透かしなし。

### ✅ ch1_office_police（朝の事務所と警察）

```
Japanese anime style background art with characters, cinematic. A law firm office in the early morning, lights on, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no logo, no watermark.
Scene: a dejected man in a suit, head hanging, is being escorted out of the office by a uniformed police officer. A beautiful, stern woman with a curvy figure, a navy suit, long straight black hair worn down and thin-framed glasses watches coldly.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。早朝の法律事務所で、明かりはついている。隅の天井に付いた防犯カメラから見た、見下ろす構図。横長 16:9。文字・ロゴ・透かしなし。
>
> 場面: うなだれて打ちひしがれたスーツの男が、制服の警官に付き添われて事務所を出ていく。曲線的な体つきの、美しく厳しい顔の女性が、濃紺のスーツ、おろしたまっすぐな長い黒髪、細いフレームの眼鏡で、冷たく見つめている。

### ✅ ch1_relay_sena_usb（机の脇の瀬名と USB）

```
Japanese anime style background art with a character, cinematic. A dark law firm office late at night, a city night view through the windows, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no logo, no watermark.
Scene: a woman in a gray cleaning uniform with her hair tied back has stopped beside a desk. The desk's side panel is coming loose, and a small USB flash drive is visible in the gap. She is staring at it.
```

> **日本語訳**: 日本のアニメ調の、人物入りの背景画。映画のような絵づくり。深夜の暗い法律事務所。窓の向こうに街の夜景。隅の天井に付いた防犯カメラから見た、見下ろす構図。横長 16:9。文字・ロゴ・透かしなし。
>
> 場面: グレーの清掃の制服で髪を後ろで結んだ女性が、机の脇で立ち止まっている。机の横板が外れかけ、すき間に小さな USB メモリが見える。女性はそれをじっと見つめている。

---

## カメラの背景 `images/bg/`（横長 16:9、人はいない）

どれも、次の共通の指示のあとに「Scene:」を付けます。

```
Japanese anime style background art, cinematic. Late night inside a luxury high-rise tower, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Dim, quiet, uneasy night lighting. No people. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
```

> **日本語訳**: 日本のアニメ調の背景画。映画のような絵づくり。深夜の高級高層タワーの中を、隅の天井に付いた防犯カメラから見た構図。見下ろす角度で、広角レンズの軽いゆがみ。薄暗く静かで、不安な夜の光。人物なし。横長 16:9。文字・時刻表示・ロゴ・透かしなし。

| 状況 | ファイル名 | Scene | 日本語訳 |
|---|---|---|---|
| ✅ | `cam00_room` | Scene: a small basement security monitoring room, a whole wall of glowing CCTV monitors, a long desk, two office chairs. | 狭い地下の中央監視室。壁一面の光る監視モニター、長い机、事務椅子が 2 つ。 |
| ✅ | `cam01_lobby` | Scene: the grand marble lobby, a reception counter, glass entrance doors, a TV on the wall. | 大理石の豪華なロビー。受付カウンター、ガラスの正面扉、壁のテレビ。 |
| ✅ | `cam02_shop` | Scene: a closed luxury brand boutique, designer handbags on shelves, a cash register counter, no brand names. | 閉店した高級ブランドショップ。棚にデザイナーズのハンドバッグ、レジのカウンター。ブランド名なし。 |
| ✅ | `cam03_corridor` | Scene: a long ground-floor corridor going into the distance, a red fire alarm bell on the left wall, a small security sensor on the ceiling on the right. | 奥へ続く 1 階の長い廊下。左の壁に赤い非常ベル、右の天井に小さな防犯センサー。 |
| ✅ | `cam04_backyard` | Scene: the cramped stockroom behind a boutique, stacks of cardboard boxes, metal shelves, a door at the back, a red fire alarm bell on the wall. | ショップの裏の狭い倉庫。段ボールの山、金属の棚、奥の扉、壁の赤い非常ベル。 |
| ✅ | `cam05_elevator` | Scene: the inside of an elevator car, a floor indicator display panel near the ceiling, a handrail. | エレベーターの中。天井近くに階数の表示板、手すり。 |
| ✅ | `cam06_evhall6` | Scene: a 6th-floor elevator hall of an office floor, elevator doors with a floor indicator above them. | オフィスの階の、6 階エレベーターホール。エレベーターの扉と、その上の階数の表示。 |
| ✅ | `cam07_office` | Scene: a law firm office, large windows with a city night view, two desks with phones, a speaker in the ceiling. | 法律事務所。大きな窓に街の夜景、電話のある机が 2 つ、天井のスピーカー。 |
| ✅ | `cam08_evhall9` | Scene: a 9th-floor elevator hall in front of the entrance of an exclusive members-only salon, a potted plant, elegant decor. | 会員制サロンの入口の前の、9 階エレベーターホール。観葉植物、上品な内装。 |
| ✅ | `cam09_roof` | Scene: the rooftop of the tower at night, a railing, a water tank, the night sky and city lights. | 夜のタワーの屋上。手すり、給水タンク、夜空と街の明かり。 |
| ✅ | `cam10_stairs` | Scene: an emergency staircase, lit only by a green emergency exit sign. | 非常階段。緑の非常口の表示だけが明かり。 |

---

## 作り直し（Gemini で参考画像を添付）

「絵をそろえるための決まり」に合わせて作り直す絵です。上から順に作ります（あとの絵が、前に作った絵を添付するため）。

- 添付は、Gemini の入力欄の「＋」→「ファイルをアップロード」から、書いてある順に入れる。プロンプトの「first / second / third attached image」は、この順番を指す。
- 1 枚ごとに新しいチャットで作る（前の絵に引っぱられて、間取りが同じになるため）。
- 横長の絵が縦長で出たときは、同じチャットで「wide horizontal 16:9 landscape で作り直して」と頼む。

### 1F ロビー

#### cam01_lobby（背景・夜）

添付: `scenes/ch1_lobby_bow`

```
Generate an image. Edit the attached image. Keep exactly the same lobby, camera angle, composition and art style. Changes: remove the two men, so the lobby is empty. It is late at night (about 9:20 pm): the lobby lights are still on but slightly dimmed, and the street outside the glass entrance is dark. The large TV on the wall is switched on and shows a blurry late-night news picture (no readable text). No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。ロビー・角度・構図・絵柄はそのまま。2 人の男を消して、誰もいないロビーにする。夜 9 時 20 分ごろ。照明はついているが少し落とし、ガラスの正面玄関の外の通りは暗い。壁の大きなテレビはついていて、ぼやけた深夜のニュースの映像を流している（読める文字なし）。人なし。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

#### ch1_lobby_police（場面・3 日目の朝。新しく作る）

添付: `bg/cam01_lobby`（上で作り直したもの）、`chars/okochi_normal`

```
Generate an image. Use the first attached image as the room: the same lobby, same camera angle, same composition and art style. Change the time to late morning (about 10:30 am): bright daylight comes in through the glass entrance wall, and the TV on the wall is off. Outside the glass entrance, a police car is parked at the curb, and its red rotating light reflects faintly on the glass and the marble floor. In the lobby, two uniformed police officers stand talking with the detective from the second attached image (same face, worn beige trench coat, stubble; ignore his green background), small in the frame as seen by a security camera: the two officers stand in the left half of the image, the detective in the right half. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵の部屋を使う（ロビー・角度・構図・絵柄は同じ）。時刻を昼前（10 時 30 分ごろ）に変える。ガラスの正面の壁から明るい日の光が入り、壁のテレビは消えている。正面玄関の外にパトカーが止まり、赤い回転灯の光がガラスと大理石の床にかすかに映る。ロビーでは、制服の警官 2 人が、2 枚目の刑事（同じ顔、くたびれたベージュのトレンチコート、無精ひげ。緑の背景は無視）と話している。防犯カメラから見た小さな人物で、警官 2 人は絵の左半分、刑事は右半分に立つ。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

### 1F ショップ

#### cam02_shop（背景・閉店後の夜）

添付: `scenes/ch1_shop_front`、`scenes/ch1_lobby_bow`（絵柄の見本）

```
Generate an image. The first attached image shows a luxury boutique from the outside: it is on the ground floor of a glass tower and faces the street sidewalk. Draw the INSIDE of this same boutique late at night after closing time, viewed from a security camera mounted high in a back corner of the shop, looking toward the glass storefront, high angle, slight wide-angle lens distortion. Use the art style of the second attached image (painterly anime background art with cel shading, not pen-and-ink hatching). Layout: the glass storefront and glass entrance door on the far wall; just inside the glass, a metal security shutter has been lowered all the way down, so the outside is not visible. Designer handbags on lit wooden wall shelves along the left wall, a glass showcase with small jewelry in the middle of the floor, and the cash register counter on the right side of the room, with a narrow space behind the counter where a clerk would stand with her back to the camera. The main lights are off; only the shelf and showcase display lights glow softly. This is a ground-floor shop: no windows with a city skyline view. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no brand names, no logo, no watermark.
```

> **日本語訳**: 1 枚目は、高級ブランドショップを外から見た絵。ガラスのタワーの 1 階にあり、通りの歩道に面している。この同じ店の「中」を、閉店後の深夜に、店の奥の隅の高いところにある防犯カメラから、ガラスの店先の方を見下ろして描く（広角レンズの軽いゆがみ）。絵柄は 2 枚目に合わせる（セル塗りの絵画的なアニメの背景画。ペン画の線影にしない）。配置: 奥の壁にガラスの店先とガラスの入口の扉。ガラスのすぐ内側に金属のシャッターが下まで下ろされ、外は見えない。左の壁に、明かりのついた木の棚とデザイナーズのバッグ。床の真ん中に小さな宝飾品のガラスケース。部屋の右側にレジのカウンター。その奥に、店員がカメラに背を向けて立つ細いすき間。主な照明は消え、棚とケースの照明だけがやわらかく光る。1 階の店なので、街の夜景が見える窓は描かない。人なし。横長 16:9。カメラ本体は写さない。文字・ブランド名・ロゴ・透かしなし。

#### ch1_shop_card（場面・1 日目 20:50）

添付: `bg/cam02_shop`（上で作り直したもの）、`chars/saeki_smile`、`scenes/ch1_lobby_bow`（老紳士の見本）

```
Generate an image. Use the first attached image as the room: the same boutique, same camera angle, same layout and art style. But it is 8:50 pm, just before closing: the shop is fully lit and open, the security shutter is raised, and through the glass storefront you see the dark street and sidewalk at night with street lamps (a ground-floor view, no high-rise skyline). Characters, small in the frame as seen by a security camera: the shop manager is the woman in the second attached image (same face, chestnut-brown bob, black boutique uniform, silk scarf; ignore her green background); she stands behind the cash register counter on the right, bowing deeply. The customer is the elderly man seen in the third attached image (white hair neatly combed back, navy suit); he stands in front of the counter on the shop floor side, holding out a credit card, without looking at the price tag of the handbag he has chosen. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no brand names, no logo, no watermark.
```

> **日本語訳**: 1 枚目の部屋を使う（店・角度・配置・絵柄は同じ）。ただし夜 8 時 50 分、閉店まぎわ。店は明るく営業中で、シャッターは上がっており、ガラスの店先から、街灯のある夜の暗い通りと歩道が見える（1 階からの景色。高層の夜景なし）。人物は防犯カメラから見た小さな姿: 店長は 2 枚目の女性（同じ顔、栗色のボブ、黒い店の制服、シルクのスカーフ。緑の背景は無視）。右のレジのカウンターの奥に立ち、深く頭を下げている。客は 3 枚目の老紳士（白髪をきれいになでつけ、紺のスーツ）。カウンターの手前の売り場側に立ち、選んだバッグの値札も見ずに、クレジットカードを差し出している。横長 16:9。カメラ本体は写さない。文字・ブランド名・ロゴ・透かしなし。

### 1F 東廊下

#### cam03_corridor（背景）

添付: `scenes/ch1_sena_mop`

```
Generate an image. Edit the attached image. Keep exactly the same corridor, camera angle, composition, lighting and art style. Changes: remove the cleaning woman, the mop, the bucket and the cart, so the corridor is empty. Add two small things: exactly one round red fire alarm bell (only one) mounted on the large marble wall on the left, near the left edge of the image, a little above the middle height; and a small white security motion sensor (a small box, not a camera) on the ceiling on the right side, near the top right of the image. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。廊下・角度・構図・明かり・絵柄はそのまま。清掃の女性、モップ、バケツ、カートを消して、誰もいない廊下にする。小さなものを 2 つ足す: 左の大きな大理石の壁の、絵の左端近く、真ん中より少し上に、丸い赤い非常ベルを 1 つだけ（2 つ描かれたことがあるため、「1 つだけ」と書いている）。右側の天井の、絵の右上近くに、小さな白い防犯センサー（小さな箱。カメラではない）。人なし。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

#### ch1_sena_mop（場面・非常ベルとセンサーを足す）

添付: `scenes/ch1_sena_mop`（作り直す前のもの）、`bg/cam03_corridor`（上で作り直したもの）

```
Generate an image. Edit the first attached image. Keep everything exactly the same: the corridor, the cleaning woman, her pose and face, the mop, the cart, the colors, the lighting and the art style. Only add the round red fire alarm bell on the left marble wall and the small white security sensor on the ceiling on the right, in exactly the same places as in the second attached image. Horizontal 16:9 landscape. No text, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵を直す。廊下・清掃の女性・ポーズと顔・モップ・カート・色・明かり・絵柄は、すべてそのまま。左の大理石の壁の丸い赤い非常ベルと、右の天井の小さな白い防犯センサーだけを、2 枚目の絵と同じ場所に足す。横長 16:9。文字・ロゴ・透かしなし。

### 1F バックヤード

#### cam04_backyard（背景）

添付: `scenes/ch1_backyard_affair`

```
Generate an image. Edit the attached image. Keep exactly the same stockroom, camera angle, composition, lighting and art style. Changes: remove the man and the woman, so the aisle between the shelves is empty except for the cardboard boxes. The door at the far end is closed (no light coming through it). Add a round red fire alarm bell mounted on the wall immediately to the right of the door frame, at about the height of the top of the door, clearly visible. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。倉庫・角度・構図・明かり・絵柄はそのまま。男と女を消し、棚の間の通路には段ボールだけが残る。突き当たりの扉は閉まっている（光は入らない）。扉の枠のすぐ右の壁、扉の上の端くらいの高さに、丸い赤い非常ベルを、はっきり見えるように足す。人なし。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

#### ch1_backyard_affair／ch1_backyard_confront（場面・非常ベルを足す）

添付: 直す場面の絵（作り直す前のもの）、`bg/cam04_backyard`（上で作り直したもの）。2 枚それぞれ、別のチャットで作る。

```
Generate an image. Edit the first attached image. Keep everything exactly the same: the stockroom, the people, their poses, faces and clothes, the door, the colors, the lighting and the art style. Only add the round red fire alarm bell on the wall just above the door, in exactly the same place as in the second attached image. Horizontal 16:9 landscape. No text, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵を直す。倉庫・人物・ポーズと顔と服・扉・色・明かり・絵柄は、すべてそのまま。扉のすぐ上の壁の丸い赤い非常ベルだけを、2 枚目の絵と同じ場所に足す。横長 16:9。文字・ロゴ・透かしなし。
>
> ※cam04_backyard を作ったとき、ベルは指示した「扉の右」ではなく「扉の真上」に入った。はっきり見えるので、その位置に決め、この 2 枚も「扉の真上」で作った。

### エレベーター・6F ホール・非常階段

#### cam05_elevator（背景）

添付: `bg/cam05_elevator`（作り直す前のもの）

```
Generate an image. Based on the attached image (same elevator car interior, same stainless steel materials, lighting and art style), redraw it viewed from a security camera in an upper back corner of the elevator car, high angle, strong wide-angle lens distortion. Composition: the closed stainless steel doors are in the center of the image, and the floor indicator display panel is centered directly above the doors, near the ceiling at the top of the image. The display panel is a plain dark screen with nothing on it (no numbers, no letters). The button panel is beside the doors on the right. A handrail along the side walls. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵をもとに（同じエレベーターの中、同じステンレス、明かり、絵柄）、かごの奥の上の隅の防犯カメラから見下ろす構図で描き直す（強い広角のゆがみ）。構図: 閉じたステンレスの扉が絵の真ん中。階数の表示板は扉の真上、絵の上の天井近くの真ん中。表示板は何も映っていない暗い画面（数字・文字なし）。ボタンの盤は扉の右わき。横の壁に手すり。人なし。横長 16:9。カメラ本体は写さない。文字・数字・ロゴ・透かしなし。

#### cam06_evhall6（背景）

添付: `bg/cam06_evhall6`（作り直す前のもの）

```
Generate an image. Based on the attached image (same office-floor interior style, lighting and art style), draw the 6th-floor elevator hall of an office tower late at night, viewed from a security camera mounted high in a corner of the ceiling, high angle, slight wide-angle lens distortion. Composition: one elevator door in the center of the image, with a small floor indicator display directly above it near the top of the image (a plain dark screen, nothing displayed). On the left side, a steel door to the emergency staircase, with a small green running-figure pictogram sign above it (no letters). Open floor space in front of the elevator. No other cameras anywhere in the image. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵をもとに（同じオフィスの階の内装・明かり・絵柄）、深夜のオフィスタワーの 6 階のエレベーターホールを、天井の隅の高い所の防犯カメラから見下ろして描く（広角の軽いゆがみ）。構図: 絵の真ん中にエレベーターの扉が 1 つ。その真上、絵の上の方に小さな階数の表示（何も映っていない暗い画面）。左側に非常階段の鉄の扉と、その上の小さな緑の非常口の絵文字（文字なし）。エレベーターの前は広く空いた床。ほかのカメラはどこにも描かない。人なし。横長 16:9。カメラ本体は写さない。文字・数字・ロゴ・透かしなし。

#### cam10_stairs（背景）

添付: `bg/cam10_stairs`（作り直す前のもの）

```
Generate an image. Based on the attached image (same bare concrete stairwell, metal handrails, dark green lighting and art style), redraw the emergency staircase late at night, viewed from a security camera mounted high in a corner of the ceiling, looking down, slight wide-angle lens distortion. Composition: flights of concrete stairs going down through the center of the image. On the right side, the 1st-floor landing with a steel fire door, and directly above that door, in the upper right part of the image, a small black electronic message display board (a plain dark screen, nothing displayed). A green emergency exit pictogram sign (running figure only, no letters) glows faintly and is the main light. Very dark, quiet, uneasy. No other cameras anywhere in the image. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵をもとに（同じむき出しのコンクリートの階段室、金属の手すり、暗い緑の明かり、絵柄）、深夜の非常階段を、天井の隅の高い所の防犯カメラから見下ろして描き直す（広角の軽いゆがみ）。構図: 絵の真ん中を、コンクリートの階段が下りていく。右側に 1 階の踊り場と鉄の防火扉。その扉の真上、絵の右上に、小さな黒い電光の表示板（何も映っていない暗い画面）。緑の非常口の絵文字（走る人だけ、文字なし）がかすかに光り、それが主な明かり。とても暗く、静かで、不安な感じ。ほかのカメラはどこにも描かない。人なし。横長 16:9。カメラ本体は写さない。文字・数字・ロゴ・透かしなし。

### 6F 法律事務所

#### cam07_office（背景・夜）

添付: `bg/cam07_office`（作り直す前のもの。家具と絵柄の見本）

```
Generate an image. Based on the attached image (same office furniture style, same dark teal night mood and art style), redraw the room with these exact requirements. A law firm office on the 6th floor of a tower, late at night with all the lights off, viewed from a security camera mounted high in a front corner of the ceiling, high angle, slight wide-angle lens distortion.
- Ceiling: a round ceiling speaker grille at the top center of the image.
- Two main desks: the husband's desk on the left side, closer to the camera, with a desk phone, a computer and a swivel chair; its wooden side panel faces the camera. Next to that desk, near the left edge of the image, an office printer on a low cabinet. The wife's desk on the right side, a little farther back, with a desk phone, a closed laptop, document stacks, a desk lamp (switched off) and a swivel chair.
- Back wall: the office entrance door in the center, and on the wall beside the door a row of six small blank brass nameplates (no letters).
- Left wall: large windows. This is only the 6th floor, so the view is NOT a bird's-eye skyline: across the street you see the middle floors of neighboring office buildings at eye level with a few lit windows, and street lamps and treetops below.
- The only light is the dim city light from the windows.
No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 添付の絵をもとに（同じ事務所の家具、同じ暗い青緑の夜の雰囲気と絵柄）、次の決まりどおりに描き直す。タワーの 6 階の法律事務所。深夜で、明かりはすべて消えている。天井の前の隅の高い所の防犯カメラから見下ろす（広角の軽いゆがみ）。
> - 天井: 絵の上の真ん中に、丸い天井のスピーカー。
> - 主な机 2 つ: 夫の机は左側のカメラに近いところ。電話、パソコン、回転椅子。木の横板がカメラの方を向く。その机の隣、絵の左端近くに、低い棚に載った事務所のプリンター。妻の机は右側の少し奥。電話、閉じたノートパソコン、書類の山、机のスタンド（消えている）、回転椅子。
> - 奥の壁: 真ん中に事務所の入口の扉。扉の横の壁に、無地の小さな真鍮の名札が 6 枚並ぶ（文字なし）。
> - 左の壁: 大きな窓。ここは 6 階なので、真上から見下ろす夜景にはしない。通りの向かいに、となりのオフィスビルの中ほどの階が目の高さに見え、明かりのついた窓がいくつか。下に街灯と並木の頭。
> - 明かりは、窓から入るほの暗い街の光だけ。
>
> 人なし。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

#### cam07_office_day（背景・3 日目の朝。新しく作る）

添付: `bg/cam07_office`（上で作り直したもの）

```
Generate an image. Edit the attached image. Keep exactly the same office, camera angle, composition, furniture and art style. Change the time to early morning (about 7:50 am): the lights are still off, and soft morning daylight comes in through the windows; the office buildings across the street are in morning light. On the wall beside the entrance door, the row of nameplates now has only five plates, with one empty space where a plate has been removed. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。事務所・角度・構図・家具・絵柄はそのまま。時刻を早朝（7 時 50 分ごろ）に変える。明かりは消えたままで、窓からやわらかい朝の光が入り、通りの向かいのビルも朝の光の中にある。入口の扉の横の名札の列は 5 枚になり、1 枚外した跡の空きがある。人なし。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

#### ch1_office_couple（場面・1 日目 21:20）

添付: `bg/cam07_office`（作り直したもの）、`chars/hanako_normal`、`chars/jogasaki_normal`

```
Generate an image. Use the first attached image as the room: the same office, same camera angle, same layout and art style, but at about 9:20 pm with the overhead lights on. The woman from the second attached image (same face, long straight black hair, glasses, navy suit) sits at the wife's desk on the right, reading documents. The man from the third attached image (same face, hair, dark gray suit and tie) stands beside her desk, bending low with a servile smile, having just set a cup of coffee on her desk, rubbing his hands together. Ignore their green backgrounds. Characters small in the frame as seen by a security camera. The husband's desk on the left is empty, with his chair pushed back. The floor is tidy. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 1 枚目の部屋を使う（事務所・角度・配置・絵柄は同じ）。ただし夜 9 時 20 分ごろで、天井の明かりはついている。2 枚目の女性（同じ顔、まっすぐな長い黒髪、眼鏡、紺のスーツ）が、右の妻の机で書類を読んでいる。3 枚目の男（同じ顔と髪、濃いグレーのスーツとネクタイ）は、その机のわきで、へつらう笑顔で腰を低くかがめ、コーヒーを机に置いたところで、揉み手をしている。緑の背景は無視。防犯カメラから見た小さな人物。左の夫の机は空で、椅子は引いてある。床は片づいている。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

#### ch1_hanako_desk（場面・深夜）

添付: `bg/cam07_office`（作り直したもの）、`chars/hanako_normal`

```
Generate an image. Use the first attached image as the room: the same office, same camera angle, same layout, same darkness and art style. Only the desk lamp on the wife's desk on the right is switched on, making a small pool of warm light. The woman from the second attached image (same face, long straight black hair, glasses, navy suit; ignore her green background) sits alone at that desk under the lamp, reading documents, small in the frame as seen by a security camera. The husband's desk on the left is empty. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 1 枚目の部屋を使う（事務所・角度・配置・暗さ・絵柄は同じ）。右の妻の机のスタンドだけがつき、小さく温かい光のたまりができている。2 枚目の女性（同じ顔、まっすぐな長い黒髪、眼鏡、紺のスーツ。緑の背景は無視）が、そのスタンドの下でひとり机に座り、書類を読んでいる。防犯カメラから見た小さな人物。左の夫の机は空。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

#### ch1_office_police（場面・3 日目 7:30）

添付: `bg/cam07_office_day`（上で作ったもの）、`chars/jogasaki_normal`、`chars/hanako_angry`

```
Generate an image. Use the first attached image as the room: the same office, same camera angle, same layout, the same morning light and art style, with the five nameplates beside the entrance door, but with the overhead lights switched on. The man from the second attached image (same face, hair and dark gray suit), dejected with his head hanging, is being escorted toward the entrance door by two uniformed police officers, one on each side. The woman from the third attached image (same face, long straight black hair, glasses, navy suit) stands beside her desk on the right with her arms crossed, watching coldly. Ignore their green backgrounds. Characters small in the frame as seen by a security camera. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 1 枚目の部屋を使う（事務所・角度・配置・朝の光・絵柄は同じ。入口の横の名札は 5 枚）。ただし天井の明かりはついている。2 枚目の男（同じ顔と髪、濃いグレーのスーツ）が、うなだれて、両側を制服の警官 2 人にはさまれ、入口の扉の方へ連れていかれる。3 枚目の女性（同じ顔、まっすぐな長い黒髪、眼鏡、紺のスーツ）は、右の自分の机のわきで腕を組み、冷たく見ている。緑の背景は無視。防犯カメラから見た小さな人物。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

#### ch1_relay_sena_usb（場面・6 日目 2:20）

添付: `bg/cam07_office`（作り直したもの）、`chars/sena_normal`

```
Generate an image. Use the first attached image as the room: the same office, same camera angle, same layout, same darkness and art style, but the row of nameplates beside the entrance door has only five plates, with one empty space. The cleaning woman from the second attached image (same face, black ponytail, gray work uniform, towel around her neck; ignore her green background) has stopped beside the husband's desk on the LEFT, the desk closest to the camera. The wooden side panel of that desk, facing the camera, is coming loose, and a small USB flash drive is visible in the gap. She is bending slightly and staring at it. Small in the frame as seen by a security camera. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 1 枚目の部屋を使う（事務所・角度・配置・暗さ・絵柄は同じ）。ただし入口の横の名札は 5 枚で、1 枚分の空きがある。2 枚目の清掃の女性（同じ顔、黒髪のポニーテール、グレーの作業着、首にタオル。緑の背景は無視）が、左の、カメラにいちばん近い夫の机のわきで立ち止まっている。カメラの方を向いたその机の木の横板が外れかけ、すき間に小さな USB メモリが見える。女性は少しかがんで、それをじっと見ている。防犯カメラから見た小さな人物。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

### 9F ホール

#### cam08_evhall9（背景）

添付: `scenes/ch1_reiko_look`

```
Generate an image. Edit the attached image. Keep exactly the same elevator hall, camera angle, composition, lighting and art style. Changes: remove the woman, and remove the security camera device in the upper left corner (replace it with plain wall and ceiling). The dark wood door frame on the right is the entrance of the members-only salon; keep it. No people. Horizontal 16:9 landscape. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。エレベーターホール・角度・構図・明かり・絵柄はそのまま。女性を消し、左上の隅の防犯カメラも消す（ただの壁と天井にする）。右の濃い木の扉の枠は会員制サロンの入口なので、残す。人なし。横長 16:9。文字・ロゴ・透かしなし。

#### ch1_reiko_look（場面・左上のカメラを消す）

添付: `scenes/ch1_reiko_look`（作り直す前のもの）

```
Generate an image. Edit the attached image. Keep everything exactly the same: the hall, the woman, her pose, face, dress and gaze, the colors, the lighting and the art style. Only remove the security camera device in the upper left corner and replace it with plain wall and ceiling. Horizontal 16:9 landscape. No text, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。ホール・女性・ポーズと顔とドレスと視線・色・明かり・絵柄は、すべてそのまま。左上の隅の防犯カメラだけを消し、ただの壁と天井にする。横長 16:9。文字・ロゴ・透かしなし。

### 屋上

#### cam09_roof_day（背景・3 日目の昼前。新しく作る）

添付: `bg/cam09_roof`

```
Generate an image. Edit the attached image. Keep exactly the same rooftop, camera angle, composition, railing, water tank and art style. Change the time to late morning (about 10:30 am) in daylight under a gray overcast sky, with a strong wind: a few dead leaves and a plastic bag are being blown across the concrete. The city below in daylight. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。屋上・角度・構図・手すり・給水タンク・絵柄はそのまま。時刻を昼前（10 時 30 分ごろ）の、灰色の曇り空の日中に変える。風が強く、枯れ葉とビニール袋がコンクリートの上を吹き飛ばされている。下の街も昼の光。人なし。横長 16:9。カメラ本体は写さない。文字・ロゴ・透かしなし。

### ビルの外

#### ch1_dawn_building（場面）

添付: `scenes/ch1_street_phone`（ビルの外観の見本）

```
Generate an image. Japanese anime style background art, cinematic, in the same art style as the attached image. Draw the same glass tower that appears in the attached image (the same glass curtain-wall design and glass entrance), seen from the sidewalk just in front of its entrance, looking straight up at the tower. Early morning: the rising sun blazes behind the top of the tower, with a dazzling lens flare, and the top of the building is lost in the glare. Do not include the man or any other people. Horizontal 16:9 landscape. No text, no signs, no logo, no watermark.
```

> **日本語訳**: 日本のアニメ調の背景画。映画のような絵づくりで、絵柄は添付の絵に合わせる。添付の絵に出てくる同じガラスのタワー（同じガラスのカーテンウォールとガラスの玄関）を、玄関のすぐ前の歩道から真上に見上げて描く。早朝。昇る朝日がタワーの上の後ろで燃えるように輝き、まぶしいレンズフレアが入って、ビルの上の方は光に消えている。男もほかの人も描かない。横長 16:9。文字・看板・ロゴ・透かしなし。

#### ch1_dropped_cans（場面）

添付: `scenes/ch1_street_phone`（歩道の見本）

```
Generate an image. Japanese anime style illustration, cinematic, in the same art style as the attached image. The location is the same wide paved sidewalk in front of the glass tower entrance shown in the attached image (same paving, planters and glass facade), early morning in harsh bright sunlight. Close-up from a low angle near the ground: a dropped convenience-store plastic bag, a can of beer rolling across the paving, and a pack of sliced roast pork lying a little farther away, with the glass tower entrance blurred in the background. Do not include the man or any other people. Nothing gory, no blood. A sense that something terrible has just happened off-screen. Horizontal 16:9 landscape. No text, no labels, no logo, no watermark.
```

> **日本語訳**: 日本のアニメ調のイラスト。映画のような絵づくりで、絵柄は添付の絵に合わせる。場所は、添付の絵のガラスのタワーの玄関の前の、同じ広い舗装の歩道（同じ敷石、植え込み、ガラスの壁面）。早朝の、強くまぶしい日差し。地面に近い低い角度からの寄りの構図: 落ちたコンビニのレジ袋、敷石の上を転がる缶ビール、少し先に落ちたチャーシューのパック。背景にはぼやけたタワーの玄関。男もほかの人も描かない。むごい描写・血なし。画面の外で何か恐ろしいことが起きた直後、という気配。横長 16:9。文字・ラベル・ロゴ・透かしなし。

---

## 絵のレビューを受けた直し（Gemini で今の絵を添付）

ゲームに配置した絵を見直して、次の直しをした（2026-11-14）。どれも、今の絵を 1 枚添付して、変えるところだけを指示した。

- 小さな物（USB など）は、ゲームの解像度 320×180 でも見えるか、縮めて確かめる。
- ゲームは絵にモニターの色（ライブは緑、過去は琥珀）をかけ、色を置き換えて明るさだけを残す。目立たせたい光は、色のついた光（青など）ではなく、**明るい白い光**にする（青い光は琥珀色で消えた）。

### ch1_relay_sena_usb（USB をはっきり見せる）

添付: `scenes/ch1_relay_sena_usb`（直す前のもの）。2 回直した（1 回目の青い光が、琥珀色をかけると消えたため）。

```
Generate an image. Edit the attached image. Keep the same office, camera angle, composition, darkness, nameplates and art style, and the same cleaning woman (same face, black ponytail, gray work uniform, towel around her neck). Change only this: the wooden front panel of the husband's desk on the left (the panel facing the camera) is clearly hanging open at an angle, leaving a dark gap, and inside the gap there is a small USB flash drive with a tiny glowing blue light, so it is easy to notice even in a small, low-resolution image. The woman has crouched down low beside that desk and is peering into the gap at the USB drive. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

```
Generate an image. Edit the attached image. Keep everything exactly the same: the office, the camera angle, the composition, the nameplates, the crouching cleaning woman, the open desk panel, the colors and the art style. Change only the light of the USB flash drive in the gap: make it a much brighter, larger WHITE glow (not blue), like a small bright white lamp, clearly lighting up the inside of the gap and spilling a little white light onto the floor and onto the woman's face, so it stands out as the brightest spot in the lower half of the image even when the picture is small and tinted a single color. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 1 回目: 事務所・角度・構図・暗さ・名札・絵柄と、清掃の女性はそのまま。左の夫の机の、カメラ側の木の板をはっきり斜めに開かせて暗いすき間を作り、すき間に小さな青い光のついた USB メモリを置く（小さく粗い絵でも気づけるように）。女性は机のわきに低くしゃがみ、すき間の USB をのぞき込む。
> 2 回目: ほかはすべてそのままで、USB の光だけを、青でなく、ずっと明るく大きな白い光にする。すき間の中を照らし、床と女性の顔に少し白い光がこぼれる。絵が小さく、単色に色づけされても、絵の下半分でいちばん明るい点として目立つように。

### ch1_lobby_police（ロビーの人物を久住に替え、規制線を足す）

添付: `scenes/ch1_lobby_police`（直す前のもの）、`chars/kuzumi_normal`

```
Generate an image. Edit the first attached image. Keep the same lobby, camera angle, composition, daylight, police car and art style, and keep the two uniformed police officers. Change only these: (1) replace the detective in the beige trench coat with the man from the second attached image: a 55-year-old building management company manager with graying hair and a plain gray suit, holding a stack of documents (ignore his green background); he stands in the right half of the group, talking politely with the officers. (2) Outside the glass entrance, plain yellow police barrier tape with no letters is stretched across the sidewalk, and one more uniformed officer stands guard beside it. Small figures as seen by a security camera. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no timestamps, no logo, no watermark.
```

> **日本語訳**: ロビー・角度・構図・日の光・パトカー・絵柄と、制服の警官 2 人はそのまま。(1) ベージュのトレンチコートの刑事を、2 枚目の男（白髪まじりで地味な灰色のスーツ、書類の束を持つ、55 歳のビル管理会社の所長。緑の背景は無視）に替え、警官たちと丁寧に話している。(2) ガラスの正面玄関の外の歩道に、文字のない黄色い規制テープを張り、そのわきに見張りの警官をもう 1 人立たせる。防犯カメラから見た小さな人物。文字・数字・時刻表示なし。

### ch1_monitor_room（「故障中」の札の下がったカメラを足す）

添付: `scenes/ch1_monitor_room`（直す前のもの）

```
Generate an image. Edit the attached image. Keep everything exactly the same: the monitoring room, the wall of monitors, the man sitting with his back to us, the empty second chair, the lighting, the colors and the art style. Only add one thing: in the upper corner of the room near the ceiling, clearly visible, a small old security camera mounted on the wall, with a small blank white card hanging from it on a string (an out-of-order tag, with no letters on it). Horizontal 16:9 landscape. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 監視室・モニターの壁・背を向けて座る男・空いた 2 つ目の椅子・明かり・色・絵柄は、すべてそのまま。部屋の上の隅の天井近くに、古い小さな防犯カメラを 1 台、はっきり見えるように足す。カメラからはひもで小さな白い札（故障中の札。文字なし）が下がっている。

### ch1_sena_trace（1日目 23:00 の瀬名。新しく作る）

添付: `scenes/ch1_sena_mop`

```
Generate an image. Edit the attached image. Keep the same corridor, camera angle, composition, lighting, the red fire alarm bell, the ceiling sensor and the art style, and the same cleaning woman (same face, black ponytail, gray work uniform, towel around her neck, the men's wristwatch on her left wrist). Change only her action: she has stopped mopping, leaned the mop against the cart, stepped to the stone pillar on the right side of the corridor, and is slowly tracing a thin crack in the wall with her fingertips, looking closely at it. Small figure as seen by a security camera. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 廊下・角度・構図・明かり・赤い非常ベル・天井のセンサー・絵柄と、清掃の女性（同じ顔、黒髪のポニーテール、グレーの作業着、首にタオル、左手首の男物の腕時計）はそのまま。動きだけを変える: モップがけをやめてモップをカートに立てかけ、廊下の右の石の柱へ寄り、壁の細いひびを指先でゆっくりなぞりながら、じっと見ている。防犯カメラから見た小さな人物。

### ch1_dropped_cans（コンビニ袋を無地に）

添付: `scenes/ch1_dropped_cans`（直す前のもの）

```
Generate an image. Edit the attached image. Keep everything exactly the same: the sidewalk, the glass tower, the sunlight, the beer can, the pack of roast pork, the composition and the art style. Change only the plastic bag: make it a plain white plastic bag with no colored stripes, no logos and no printing at all. Horizontal 16:9 landscape. No people. No text, no labels, no logo, no watermark.
```

> **日本語訳**: 歩道・ガラスのタワー・日差し・缶ビール・チャーシューのパック・構図・絵柄は、すべてそのまま。レジ袋だけを、色の帯・ロゴ・印刷のない、無地の白いレジ袋にする。人なし。

---

## 第1章の足し・第2章（Gemini で参考画像を添付）

2026-11-15 に作った絵です。作り方は「作り直し（Gemini で参考画像を添付）」と同じ（1 枚ごとに新しいチャット。表情違いは同じチャットで続けて頼む）。人物の入る絵は、立ち絵や背景を添付して作ります。

- 文字を描かないよう指示しても、時計や表示が入ることがある。できた絵は、文字が入っていないか確かめる。
- 立ち絵の美咲は、ピンクの服と緑がかぶらないよう、青一色の背景（ブルーバック）で作った。
- Gemini の 1 日の画像の上限に届いたら、別の Google アカウントに切り替えて続けた。初めて使うアカウントでは、画像を添付したときに利用の確認が出る。
- 場面の絵の ch2_shop_shutter は、作ったときの文で人物を「man」と書いてしまったが、添付の立ち絵どおりの女性で描かれた。下の文は正しく直したもの。

### 第1章の足し

#### ✅ ch1_konbini（3 日目の朝、1F のコンビニ）

添付: `scenes/ch1_street_phone`

```
Generate an image. Same art style, same coloring and same building as the attached image (Japanese anime style background art, cinematic). Scene: early morning, about 8 am, inside a small, bright convenience store on the ground floor of the same glass tower. Eye-level view from behind the checkout counter area, slightly to the side. A tired 35-year-old man in a plain navy security guard work uniform, seen from behind and slightly from the side so his face is not visible, is putting a can of premium beer and a pack of thick-sliced roast pork into a plain white plastic bag at the counter. Morning sunlight comes through the glass storefront. Plain shelves with unbranded products. Horizontal 16:9 landscape. No text, no letters, no labels, no logos, no price tags, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り・建物。朝 8 時ごろ、同じガラスのタワーの 1 階の、小さく明るいコンビニの中。レジのあたりの後ろから、少し横の目の高さで見る。紺の地味な警備員の作業着の、疲れた 35 歳の男が、後ろ姿（顔は見えない）で、レジで高い缶ビールと厚切りのチャーシューのパックを無地の白いレジ袋に入れている。ガラスの店先から朝日。棚の商品は無地。文字・ラベル・ロゴ・値札なし。

#### ✅ ch1_sena_meet（真解決の最後、1F 東廊下で瀬名と向き合う）

添付: `scenes/ch1_sena_mop`、`chars/sena_normal`

```
Generate an image. Use the first attached image for the place and art style: the same marble ground-floor corridor of the luxury tower, the same lighting and the same anime art style (Japanese anime style background art with a character, cinematic). The woman is the one in the second attached image (same face, black hair tied back in a ponytail, gray cleaning work uniform, towel around her neck, an oversized men's wristwatch on her left wrist; ignore its green background). This time the view is NOT from a security camera: eye level, as seen by a man who has just walked up to her in the corridor, about three meters away. She has stopped mopping, holds the mop handle with both hands, and has just raised her face to look straight at the viewer, with a slightly teasing, bittersweet small smile. Late morning, soft indoor light. Horizontal 16:9 landscape. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 場所と絵柄は 1 枚目（同じ大理石の 1 階の廊下・明かり・絵柄）。女性は 2 枚目の人（同じ顔、黒髪のポニーテール、グレーの作業着、首にタオル、左手首に男物の大きな腕時計。緑の背景は無視）。今回は防犯カメラからではなく、廊下で 3 メートルほどの所まで歩み寄った男の目の高さから見る。モップがけをやめ、柄を両手で持ち、顔を上げてまっすぐこちらを見る。少しからかうような、ほろ苦い小さな笑み。昼前のやわらかな光。

### 第2章の立ち絵

#### ✅ saijo_normal（西条賢一郎・見下す顔）

添付: `chars/kuzumi_normal`（絵柄の参考だけ）

```
Generate an image. Same art style, same coloring, same line quality and same framing as the attached character portrait, but a completely different person (do not copy his face or clothes). Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted elegant colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3 portrait. Background: solid pure green background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark. Character: a 48-year-old man, the director of a cosmetic surgery clinic. Neatly slicked-back black hair with gray at the temples, thin rimless glasses, clean-shaven, pale, fastidious and well-groomed. A crisp white doctor's coat over an expensive pale blue shirt and a dark navy tie. He is wiping his fingers with a small white disinfectant wet wipe. Expression: looking down at the viewer with a condescending, sneering half-smile.
```

> **日本語訳**: 添付の立ち絵と同じ絵柄・塗り・線・構図で、まったく別の人物。【立ち絵の共通指示】。人物: 48 歳の男。美容クリニックの院長。こめかみに白髪のまじる、なでつけた黒髪。細い縁なし眼鏡。ひげはなく、色白で、潔癖で身なりがよい。白衣の下に高そうな薄い水色のシャツと紺のネクタイ。小さな白い除菌シートで指を拭いている。表情: こちらを見下す、さげすんだ薄笑い。

#### ✅ saijo_scared（西条・怯える顔）

同じチャットで続けて頼んだ。

```
Generate an image. Same character, same outfit, same glasses, same art style, same framing and the same solid chroma key green background as the image you just made. He is no longer holding the wet wipe: he holds an old desk phone receiver to his ear with a trembling hand. Only change the facial expression to: frightened and cowering, eyes wide behind his glasses, sweat on his forehead, mouth half open as if pleading to someone above him. Vertical 2:3 portrait. No green light on the character. No text, no logo, no watermark.
```

> **日本語訳**: 同じ人物・服・眼鏡・絵柄・構図・緑の背景。除菌シートはもう持たず、震える手で古い机の電話の受話器を耳に当てている。表情だけを、おびえて縮こまった顔に（眼鏡の奥で目を見開き、額に汗、目上の誰かに頼みこむように口が半開き）。

#### ✅ misaki_normal（桐谷美咲・ふだん）

添付: `chars/sena_normal`（絵柄の参考だけ）

```
Generate an image. Same art style, same coloring, same line quality and same framing as the attached character portrait, but a completely different person (do not copy her face, hair or clothes). Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3 portrait. Background: solid pure blue background, chroma key blue, flat solid background, clean sharp edges, no shadows on background. No blue light or blue reflections on the character. No text, no logo, no watermark. Character: a 24-year-old woman, a newly qualified night-shift nurse at a cosmetic surgery clinic. Short dark brown bob hair with a small hair clip, big frank eyes, light natural makeup, healthy and lively. Wearing a pale pink nurse scrub top with a plain white cardigan over it, a pen in the chest pocket, a simple wristwatch on a nurse's watch strap. She holds a small plastic-wrapped homemade rice ball in one hand. Expression: straightforward and a little worried, looking right at the viewer as if about to ask a question.
```

> **日本語訳**: 添付の立ち絵と同じ絵柄で、まったく別の人物。背景は青一色のクロマキー（人物に青い光なし）。人物: 24 歳の女性。美容クリニックの新人の夜勤の看護師。小さな髪留めの、こげ茶のショートボブ。大きくまっすぐな目、薄い化粧、元気で健康的。薄いピンクのスクラブに白い無地のカーディガン、胸ポケットにペン、ナースウォッチ。ラップに包んだ手作りのおにぎりを片手に持つ。表情: まっすぐで少し心配そう、何か聞きかけるようにこちらを見る。

#### ✅ misaki_smile（美咲・笑って手を振る）

同じチャットで続けて頼んだ（1 回目は絵が出ず、文字だけが返ってきたので、「再試行」で作り直した）。

```
Generate an image. Same character, same outfit, same art style, same framing and the same solid chroma key blue background as the image you just made. She is no longer holding the rice ball; she raises one hand near her shoulder in a small, shy wave. Only change the facial expression to: a warm, bright, slightly teasing smile. Vertical 2:3 portrait. No blue light on the character. No text, no logo, no watermark.
```

> **日本語訳**: 同じ人物・服・絵柄・構図・青の背景。おにぎりはもう持たず、片手を肩のあたりに上げて、小さく照れたように手を振る。表情だけを、あたたかく明るい、少しからかうような笑顔に。

#### ✅ morishita_normal（森下圭介）

添付: `chars/kuzumi_normal`（絵柄の参考だけ）

```
Generate an image. Same art style, same coloring, same line quality and same framing as the attached character portrait, but a completely different person (do not copy his face or clothes). Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3 portrait. Background: solid pure green background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark. Character: a 34-year-old ordinary office worker whose younger sister has been left in a coma after surgery. Short black hair wet and disheveled from the rain, unshaven for a few days, tired red eyes with dark circles. A cheap dark gray suit jacket damp with rain over a wrinkled white shirt, no tie, holding a crumpled brown document envelope against his chest. Expression: desperate, exhausted and accusing, staring straight at the viewer with quiet anger and grief.
```

> **日本語訳**: 添付の立ち絵と同じ絵柄で、まったく別の人物。【立ち絵の共通指示】。人物: 手術のあと妹が目を覚まさない、34 歳のふつうの会社員。雨でぬれて乱れた短い黒髪、数日そっていないひげ、くまのある疲れて赤い目。雨で湿った安い濃い灰色の上着、しわの寄った白いシャツ、ネクタイなし。くしゃくしゃの茶封筒を胸に抱える。表情: 追いつめられ、疲れきり、責めるような目で、静かな怒りと悲しみを込めてこちらを見すえる。

### 第2章のカメラの背景

#### ✅ cam11_clinic（CAM-11 3F クリニック前の廊下）

添付: `bg/cam03_corridor`

```
Generate an image. Same art style, same coloring and the same security-camera viewpoint as the attached image (Japanese anime style background art, cinematic; viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion), but a different place in the same luxury tower: the 3rd-floor corridor in front of a high-end cosmetic surgery clinic, late at night. On the left, the clinic's frosted glass double doors with a small blank white sign panel (no letters), closed for the night. Further down the corridor on the right, a solid wooden door to the director's private office, with warm light leaking out from under the door onto the floor. White walls, polished floor, a few potted plants, a bench. Dim night lighting, quiet and uneasy. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り・防犯カメラの視点で、同じタワーの別の場所。深夜の、高級美容クリニックの前の 3 階の廊下。左にクリニックのすりガラスの両開きの扉（文字のない白い表示板）。廊下の奥の右に、院長室の木の扉。扉の下から、あたたかい明かりが床に漏れている。白い壁、磨いた床、観葉植物、ベンチ。人なし。

#### ✅ cam12_director（CAM-12 3F 院長室）

添付: `bg/cam07_office`（絵柄の参考だけ）

```
Generate an image. Same art style and coloring as the attached image (Japanese anime style background art, cinematic), but a different room: the private office of a cosmetic surgery clinic director, late at night, seen from a tiny hidden camera high in the corner of the ceiling, steep high angle, strong wide-angle lens distortion. Layout: a large dark wooden executive desk in the center-right, with a desk lamp switched on, a black IP desk phone on the right edge of the desk, a leather chair behind it. On the left wall, a gray steel wall safe at waist height with a small keypad (the keypad faces away so its buttons cannot be read). On the back wall: one large framed group photo of about ten clinic staff in white coats and nurse uniforms standing in two rows, and next to it a small framed certificate of gratitude. A bookshelf with medical books. In the upper center of the image, a small round ceiling speaker grille. Warm lamp light, the rest of the room dim. No people. Horizontal 16:9 landscape. The camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗りで、別の部屋。深夜の、美容クリニックの院長室を、天井の隅の高いところの小さな隠しカメラから見下ろす（急な角度、強い広角のゆがみ）。右寄りの真ん中に大きな木の机（電気スタンドがついている、机の右端に黒い電話、後ろに革の椅子）。左の壁の腰の高さに灰色の金庫（番号のボタンは向こう向きで読めない）。奥の壁に、白衣と看護師の服の 10 人ほどが 2 列に並んだ大きな集合写真の額と、小さな感謝状の額。医学書の本棚。絵の上の真ん中に、天井の丸いスピーカーの網。人なし。

#### ✅ cam13_parking（CAM-13 B1 駐車場）

添付: `bg/cam10_stairs`

```
Generate an image. Same art style, same coloring and the same security-camera look as the attached image (Japanese anime style background art, cinematic; viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion), but a different place in the same luxury tower: the underground B1 parking garage late at night. Concrete pillars, painted parking lines, fluorescent ceiling lights, a few parked cars. In the center-left foreground, an expensive black luxury sedan parked alone in its space, with its headlights left switched ON, shining brightly onto the concrete wall in front of it. On the right, the silver doors of an elevator lobby. No people. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no license plate characters, no signs, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り・防犯カメラの見え方で、同じタワーの地下 1 階の駐車場（深夜）。コンクリートの柱、駐車の白線、天井の蛍光灯。左寄りの手前に、黒い高級セダンが 1 台。ヘッドライトがつけっぱなしで、前の壁を明るく照らしている。右に、エレベーターの銀色の扉。人なし。ナンバーの文字なし。

### 第2章の場面の絵

#### ✅ ch2_director_desk（院長室。西条がカルテを書き写す）

添付: `bg/cam12_director`、`chars/saijo_normal`

```
Generate an image. Edit the first attached image. Keep exactly the same room, camera angle, composition, lighting, colors and art style (the safe on the left wall, the group photo, the bookshelf, the desk, the lamp and the phone stay where they are). Add one person: the man from the second attached image (48-year-old clinic director, slicked-back hair with gray temples, rimless glasses, white doctor's coat; ignore its green background), sitting in the chair behind the desk, bent over and writing with a pen. On the desk in front of him lie two open paper medical charts side by side (an old worn one and a new clean one), and at the edge of the desk a few stacks of old banknote bundles, each wrapped with a paper band. Small figure as seen by a hidden ceiling camera. Horizontal 16:9 landscape. The camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵を直す。部屋・角度・構図・明かり・色・絵柄はそのまま。2 枚目の男（院長）を、机の後ろの椅子に座らせ、前かがみでペンで書かせる。机の上に紙のカルテを 2 冊（古いものと新しいもの）並べて開き、机の端に帯封の付いた古い札束をいくつか積む。

#### ✅ ch2_director_safe（院長室。西条が金庫から札束を出す）

添付: `scenes/ch2_director_desk`

```
Generate an image. Edit the attached image. Keep exactly the same room, camera angle, composition, lighting, colors and art style, and the same man (clinic director in a white coat with rimless glasses). Change only this: the man has left the desk and stands at the gray wall safe on the left wall, with its heavy door swung open; he is taking out a thick stack of old banknote bundles wrapped in paper bands. His back half-hides the keypad. The chair behind the desk is empty, and the two paper charts still lie open on the desk. Horizontal 16:9 landscape. The camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 添付の絵を直す。部屋・角度・構図・明かり・色・絵柄と、院長はそのまま。院長は机を離れ、左の壁の灰色の金庫の前に立つ。重い扉は開いていて、帯封の付いた古い札束の厚い束を取り出している。背中でテンキーが半分隠れる。机の後ろの椅子は空で、2 冊のカルテは机の上に開いたまま。

#### ✅ ch2_director_misaki（院長室。美咲がカルテを撮る）

添付: `bg/cam12_director`、`chars/misaki_normal`

```
Generate an image. Edit the first attached image. Keep exactly the same room, camera angle, composition, lighting, colors and art style (the safe on the left wall, the group photo, the bookshelf, the desk, the lamp and the phone stay where they are). Add one person: the young nurse from the second attached image (short dark brown bob with a hair clip, pale pink scrubs, white cardigan; ignore its blue background). She stands at the desk, leaning over it, holding up a smartphone with both hands and photographing two open paper medical charts lying side by side on the desk. A few stacks of old banknote bundles wrapped in paper bands sit at the edge of the desk. The leather chair is empty and pushed back. Tense, hurried atmosphere. Small figure as seen by a hidden ceiling camera. Horizontal 16:9 landscape. The camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵を直す。部屋・角度・構図・明かり・色・絵柄はそのまま。2 枚目の若い看護師（ブルーバックは無視）を、机に身を乗り出させ、両手でスマホを構えて、並べて開いた 2 冊の紙のカルテを撮らせる。机の端に帯封の札束。革の椅子は空で、後ろに引いてある。張りつめた、急いだ空気。

#### ✅ ch2_misaki_wave（クリニック前の廊下。美咲がカメラに手を振る）

添付: `bg/cam11_clinic`、`chars/misaki_smile`

```
Generate an image. Edit the first attached image. Keep exactly the same corridor, camera angle, composition, lighting, colors and art style (the clinic glass doors on the left, the director's door with light under it, the bench and plants). Add one person: the young nurse from the second attached image (short dark brown bob with a hair clip, pale pink scrubs, white cardigan; ignore its blue background). She stands in the middle of the corridor, has stopped walking, looks straight up into the security camera, and gives it a small, shy wave with one hand and a warm little smile. Small figure as seen by a ceiling security camera, but her face and the waving hand are clearly readable. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の絵を直す。廊下・角度・構図・明かり・色・絵柄はそのまま。2 枚目の若い看護師を、廊下の真ん中で立ち止まらせ、監視カメラをまっすぐ見上げて、片手で小さく、はにかむように手を振らせ、温かい小さな笑みを浮かべさせる。顔と振る手ははっきり見えるように。

#### ✅ ch2_lobby_morishita（夜のロビー。森下が西条に詰め寄る）

添付: `bg/cam01_lobby`、`chars/morishita_normal`、`chars/saijo_normal`

```
Generate an image. Edit the first attached image. Keep exactly the same night lobby, camera angle, composition, lighting, colors and art style. Add two people in front of the elevator doors: the man from the second attached image (34-year-old man in a rain-damp dark gray jacket, messy wet black hair, holding a brown envelope; ignore its green background) is angrily confronting the man from the third attached image (48-year-old clinic director in a white doctor's coat, rimless glasses; ignore its green background), leaning toward him and shouting, one hand raised. The doctor leans back with a disgusted, contemptuous look, holding up a hand to keep him away. Small figures as seen by a ceiling security camera. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の夜のロビーはそのまま。エレベーターの扉の前に 2 人を足す。2 枚目の男（雨に濡れた濃い灰色の上着、茶封筒を持つ）が、3 枚目の院長に、身を乗り出し片手を上げて怒鳴りながら詰め寄る。院長は身を引き、嫌悪と軽蔑の顔で、手を上げて遠ざけようとする。

#### ✅ ch2_backyard_saeki（バックヤード。佐伯がひとりで泣く）

添付: `bg/cam04_backyard`、`chars/saeki_normal`

```
Generate an image. Edit the first attached image. Keep exactly the same stockroom, camera angle, composition, lighting, colors and art style (metal shelves, cardboard boxes, the door at the end and the red fire alarm bell above it). Add one person: the woman from the second attached image (boutique manager with a curled chestnut bob, black fitted jacket and skirt uniform, silk scarf; ignore its green background). She sits alone on the floor in the aisle with her back against a cardboard box, knees pulled up, head bowed, crying quietly, holding two airline tickets in her hand. Lonely, quiet, late at night after closing. Small figure as seen by a ceiling security camera. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の倉庫はそのまま（金属の棚、段ボール、奥の扉とその上の赤い火災ベル）。2 枚目の女（店長）を、通路の床に、段ボールに背をあずけて膝を抱えて座らせ、うつむいて静かに泣かせる。手には航空券が 2 枚。閉店後の深夜の、さびしく静かな空気。

#### ✅ ch2_backyard_reiko（バックヤード。玲子が佐伯の肩を抱き、カメラを見上げる）

添付: `chars/reiko_normal`（`ch2_backyard_saeki` を作ったチャットで続けて頼む）

```
Generate an image. Edit the stockroom image you just made. Keep exactly the same stockroom, camera angle, composition, lighting, colors and art style, and keep the crying boutique manager sitting on the floor in the same place. Add one more person: the woman from the attached portrait (long wavy black hair swept to one side, off-the-shoulder wine-red evening gown, gold necklace; ignore its green background). She crouches beside the crying woman with one arm around her shoulders, and with her other hand she holds a smartphone to her ear, and she is looking straight up into the security camera, meeting the viewer's eyes with a calm, unreadable face. Small figures as seen by a ceiling security camera, but the gowned woman's upturned face is clearly visible. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: さっき作った倉庫の絵を直す。倉庫・角度・構図・明かり・色・絵柄と、床で泣く店長はそのまま。添付の女（ワインレッドのドレス）を足す。泣く店長のそばにかがんで片腕で肩を抱き、もう片方の手でスマホを耳に当て、監視カメラをまっすぐ見上げて、落ち着いた読めない顔で見る側と目を合わせる。

#### ✅ ch2_relay_news（昼のロビーのテレビ。森下と逮捕のニュース）

添付: `scenes/ch1_lobby_police`、`chars/morishita_normal`

```
Generate an image. Same art style and coloring as the first attached image (Japanese anime style, the same daytime tower lobby). Composition: a close, slightly high-angle view from a ceiling security camera, zoomed in on the large flat-screen TV mounted on the lobby wall, so the TV screen fills most of the frame, with a little of the lobby wall and a potted plant around its edges. On the TV screen, a midday news broadcast in two panels: on the left panel, a formal headshot photo of the man from the second attached image (34-year-old man with short black hair, tired eyes; neat, dry hair this time, wearing a plain suit; ignore its green background); on the right panel, news footage of a man in a plain navy security guard work uniform being led into a black car by two plainclothes detectives in front of a glass tower, with his face covered by a mosaic blur. The bottom of the screen has a plain blank caption bar with no letters. No readable text anywhere. Horizontal 16:9 landscape. No letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目と同じ絵柄・塗り（昼のタワーのロビー）。天井のカメラから少し見下ろして、壁の大きなテレビに寄る（画面が画面のほとんどを占める）。テレビは昼のニュースで 2 分割。左に 2 枚目の男の、きちんとした顔写真（髪は乾いて整い、地味なスーツ）。右に、ガラスのタワーの前で、紺の警備員の作業着の男が 2 人の私服の刑事に黒い車へ連れて行かれる映像（顔はモザイク）。下の字幕の帯は無地。

#### ✅ ch2_parking_saijo（地下駐車場。西条が車のライトを消す）

添付: `bg/cam13_parking`、`chars/saijo_normal`

```
Generate an image. Edit the first attached image. Keep exactly the same parking garage, camera angle, composition, lighting, colors and art style, and the same black luxury sedan in the same place. Changes: the sedan's headlights are now switched OFF. Add one person: the man from the second attached image (48-year-old clinic director in a white doctor's coat, rimless glasses; ignore its green background), standing at the open driver's door of the sedan, leaning in to switch off the lights, with an irritated face. Small figure as seen by a ceiling security camera. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no license plate characters, no logo, no watermark.
```

> **日本語訳**: 1 枚目の駐車場と、同じ場所の黒い高級車はそのまま。車のヘッドライトを消した状態にする。2 枚目の院長を、開いた運転席のドアのところに立たせ、身をかがめてライトを消させる。いらだった顔。

#### ✅ ch2_clinic_kuzumi（クリニック前の廊下。久住が封筒を運ぶ）

添付: `bg/cam11_clinic`、`chars/kuzumi_normal`

```
Generate an image. Edit the first attached image. Keep exactly the same corridor, camera angle, composition, lighting, colors and art style (the clinic glass doors on the left, the director's wooden door with light under it, the bench and plants). Add one person: the man from the second attached image (55-year-old building manager, graying hair, plain gray suit; ignore its green background). He walks down the corridor toward the director's door, carrying a thick brown envelope tucked under one arm, his face calm and expressionless. Small figure as seen by a ceiling security camera. Horizontal 16:9 landscape. The security camera itself is not visible. No text, no letters, no numbers, no logo, no watermark.
```

> **日本語訳**: 1 枚目の廊下はそのまま。2 枚目の男（55 歳のビル管理者、白髪まじり、地味な灰色のスーツ）を、院長室の扉へ向かって歩かせる。厚い茶封筒を小脇に抱え、落ち着いた無表情。

#### ✅ ch2_hydrant_money（地下 2 階の非常階段。消火栓の中の札束）

添付: `bg/cam10_stairs`

```
Generate an image. Same art style and coloring as the attached image (Japanese anime style background art, cinematic, the same emergency stairwell with green exit-sign light), but this time an eye-level view, not from a security camera. Scene: the bottom landing of the emergency staircase on the second basement level, late at night. On the concrete wall, a red fire hydrant cabinet with its metal door swung open; inside, behind the coiled fire hose, a plain brown paper bag is pushed in, its top slightly open, showing the edges of thick stacks of old banknotes. Dim, cold, uneasy light. No people. Horizontal 16:9 landscape. No text, no letters, no numbers, no signs, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り（緑の非常口の光の非常階段）。ただし監視カメラではなく目の高さ。深夜の地下 2 階の、非常階段のいちばん下の踊り場。コンクリートの壁の赤い消火栓の扉が開いていて、巻いたホースの奥に無地の茶色の紙袋が押し込まれ、口から古い札束の端がのぞく。薄暗く冷たい、落ち着かない光。人はいない。

#### ✅ ch2_mailbox（古いアパートの郵便受け）

添付: `scenes/ch1_street_phone`

```
Generate an image. Same art style and coloring as the attached image (Japanese anime style background art, cinematic), but a very different place: the row of cheap metal mailboxes in the entrance of a run-down old apartment building, in the evening, under a flickering fluorescent light. Eye-level close view of one small mailbox with its little door open. Inside, a few stiff window envelopes (overdue bills), and sticking out between them, a single plain sheet of white paper folded in half, with no envelope and no stamp. Peeling paint, a little rust, lonely and shabby mood. No people. Horizontal 16:9 landscape. No readable text, no letters, no numbers, no names, no logo, no watermark.
```

> **日本語訳**: 添付の絵と同じ絵柄・塗り。ただし場所はまったく違い、古くさびれたアパートの入口の、安い金属の郵便受けの列。夕方、ちらつく蛍光灯の下。小さな郵便受けの 1 つに目の高さで寄り、小さな扉が開いている。中には窓付きの封筒（督促状）が数通と、その間から、封筒にも入っておらず切手もない、二つ折りの白い紙が 1 枚はみ出している。塗装のはがれ、少しのさび。さびしく、みすぼらしい空気。人はいない。

#### ✅ ch2_shop_shutter（朝。佐伯が店のシャッターを上げる）

添付: `scenes/ch1_shop_front`、`chars/saeki_normal`

```
Generate an image. Same art style, same coloring and same shop front as the first attached image (Japanese anime style background art, cinematic). Scene: early morning, about 7 am, cool pale morning light, the street is empty. The woman from the second attached image (the boutique manager; same face, hair and clothes) is standing in front of the shop, raising its metal roll-up shutter halfway with both hands, seen from the side. Her expression is tired but calm. Eye-level view from across the narrow street. Horizontal 16:9 landscape. No text, no letters, no signs with writing, no logo, no watermark.
```

> **日本語訳**: 1 枚目と同じ絵柄・塗り・店先。朝 7 時ごろの、冷たく淡い朝の光。通りに人はいない。2 枚目の女（店長。顔・髪・服は同じ）が店の前に立ち、金属の巻き上げシャッターを両手で半分まで上げている。横から見る。疲れているが落ち着いた顔。細い通りの向かいから、目の高さで見る。

#### ✅ ch2_lobby_morning（朝のロビー。森下と美咲が向き合う）

添付: `scenes/ch1_lobby_police`、`chars/morishita_normal`、`chars/misaki_normal`

```
Generate an image. Same art style, same coloring and same building lobby as the first attached image (Japanese anime style background art, cinematic), but without any police officers. Scene: morning, about 8 am, soft bright sunlight through the glass entrance, the lobby is quiet. Two people stand facing each other in the middle of the lobby, a few steps apart, seen from the side at eye level: on the left, the young man from the second attached image (same face, hair and clothes; ignore its plain background), looking down a little awkwardly; on the right, the young woman from the third attached image (same face, hair and clothes; ignore its blue background), looking at him with a gentle, slightly sad smile. Medium-small figures, full body. Horizontal 16:9 landscape. No text, no letters, no logo, no watermark.
```

> **日本語訳**: 1 枚目と同じ絵柄・塗り・ロビー。ただし警官はいない。朝 8 時ごろ、ガラスの入口から柔らかく明るい日ざし。静かなロビー。真ん中に 2 人が数歩離れて向き合い、横から目の高さで見る。左に 2 枚目の若い男（少しぎこちなく目を伏せる）、右に 3 枚目の若い女（彼を見て、やさしく、少し悲しげに微笑む）。人物は全身で、やや小さめ。

---

## Stable Diffusion 系のサイト向け

「Prompt」と「Negative prompt」を分けて入れるサイトでは、文章のプロンプトの代わりに、次のような単語を並べる書き方も効きます。

### 立ち絵の例（玲子）

Prompt:

```
masterpiece, best quality, anime style, visual novel sprite, 1girl, solo, mature female, 34 years old, long black hair, wavy hair, side-swept hair, violet eyes, half-closed eyes, long eyelashes, red lips, mole under mouth, off-shoulder evening gown, wine red dress, gold necklace, drop earrings, elegant, alluring, cowboy shot, looking at viewer, light smile, simple background, green background, chroma key green, flat color background, no shadows
```

> **日本語訳**: 傑作、最高品質、アニメ調、ビジュアルノベルの立ち絵、女性 1 人、1 人だけ、成熟した女性、34 歳、長い黒髪、ウェーブの髪、横に流した髪、紫の瞳、半開きの目、長いまつげ、赤い唇、口もとのほくろ、肩を出したイブニングドレス、ワインレッドのドレス、金のネックレス、揺れるイヤリング、上品、色っぽい、太ももあたりから上の構図、こちらを見る、軽い笑み、単純な背景、緑の背景、クロマキーの緑、ベタ塗りの背景、影なし。

Negative prompt（すべての絵で共通。最後の `green …` の 3 つは、立ち絵の背景の緑が人物に移らないようにするため）:

```
nsfw, nude, nipples, underwear, lingerie, cleavage cutout, lowres, bad anatomy, bad hands, extra fingers, missing fingers, deformed, blurry, text, watermark, signature, logo, username, jpeg artifacts, child, loli, green ambient light, green color spill, green glow
```

> **日本語訳**: 入れないもの: 成人向けの表現、裸、胸の露出、下着、肌を見せる切り抜きの服、低解像度、崩れた体、崩れた手、指の増減、変形、ぼやけ、文字、透かし、署名、ロゴ、ユーザー名、JPEG のノイズ、子ども、人物への緑の光・色移り・にじみ。

- 人物を変えるときは、`1girl` 以下の見た目の単語を、上の各人物の英語の説明から拾って並べ替えます（例: 佐伯は `chestnut hair, bob cut, curled hair, winged eyeliner, black blazer, pencil skirt, silk scarf`）。
- 男性は `1boy, mature male` にします。
- 場面の絵は、`from above, security camera view, fisheye, night, dim lighting, scenery` を足し、`simple background` 以降（緑の背景の指定）を消します。


## 2026-11-22 のレビューで足した絵・描き直した絵（すべて ✅）

遊んだ人（ユーザー）の指摘で、次の絵を Google Gemini（無料）で作りました。どれも、参考画像を添付し、人物の見た目は添付の絵に合わせています。

### 立ち絵（3 枚）

#### ✅ saeki_bag（第1章。閉店後、バッグを肩にかけて値札を見る）
添付: `chars/saeki_smile`
```
Generate an image. Use the attached image as the reference for the same character, same face, same hairstyle and same outfit (black fitted boutique jacket, pencil skirt, silk scarf). Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted elegant colors. Waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. Pose: after closing time, she has taken a luxury handbag from the shelf and hangs it on her shoulder, standing slightly turned to the side as if looking into a mirror. With her other hand she holds the small price tag of the bag, turned over, and looks down at it. Expression: the polished smile is gone; a quiet, tired, wistful face, lips pressed lightly, a trace of longing and resignation. The handbag is an elegant leather handbag, no logo, no brand marks. No text, no letters, no numbers on the tag, no logo, no watermark.
```
> **日本語訳**: 添付の絵と同じ人物・顔・髪・服（黒のジャケット、ペンシルスカート、スカーフ）。閉店後、棚の高級バッグを肩にかけ、鏡を見るように少し横を向く。もう片方の手で、バッグの小さな値札を裏返して見下ろす。接客の笑顔は消え、静かで疲れた、物ほしげであきらめた顔。バッグにロゴなし。文字なし。（1 回目の生成で上限に当たり、別のアカウントで作った）

#### ✅ reiko_look（第1章。エレベーターホールで、こちらを見る）
添付: `chars/reiko_smile`
```
（1 回目）Generate an image. Use the attached image as the reference for the same character, ... Pose: she stands waiting for an elevator and lifts her chin, tilting her head slightly upward, looking up toward a camera above and in front of her, so her gaze meets the viewer from slightly below. One hand rests lightly on her bag strap. Expression: a soft, practiced, gentle smile that does not quite reach her eyes; a faint shadow of sadness and unease behind the elegance.
（2 回目、同じチャットで）Edit the image you just made. Keep exactly the same woman ... Change only the pose: her hand must NOT touch her hair; both hands rest lightly at the shoulder bag strap in front of her. Tilt her head back and lift her chin clearly, so she is looking UP at a camera mounted above her ...
```
> **日本語訳**: エレベーターを待ちながら、あごを上げ、頭を少し上へ傾けて、上のカメラを見上げる。目が、下からこちらに合う。手はバッグの紐に軽く添える。やわらかく、作り慣れた笑み。目までは届かない。優雅さの奥に、悲しみと不安の影。（1 回目は髪に手をやる姿勢になったので、手を髪に触れさせず、バッグの紐に添える直しを頼んだ。結果は、こちらをまっすぐ見る顔で、採用した）

#### ✅ reiko_nod（第1章。カメラに会釈する）
添付: `chars/reiko_smile`
```
Generate an image. Use the attached image as the reference for the same character, same face, same hairstyle, same makeup and same dress. ... Pose: she gives a small, polite nod of greeting toward the viewer, head tilted down a little, both hands lightly clasped in front of her, her eyes glancing up shyly at the viewer. Expression: a gentle, slightly shy, tender smile, a little surprised at her own gesture.
```
> **日本語訳**: こちらへ小さく丁寧に会釈する。頭を少し下げ、両手を前で軽く重ね、はにかんで目だけ上目づかいにこちらを見る。やさしく、少し照れた、自分のしぐさに少し驚いたような笑み。

### 場面の絵（新しく 10 枚）

背景の絵（`bg/`）か、元の場面の絵を土台に、人物を足す・動かす形で作りました。人物の見た目は `chars/hanako_normal`（華子）に合わせています。共通の決まり: 部屋・角度・構図・明かり・絵柄は動かさない。防犯カメラから見下ろした小さな人物。カメラ本体は写さない。文字・ロゴなし。

| 絵 | 添付 | 足す・変えるもの |
|---|---|---|
| ✅ `ch1_jogasaki_desk` | `scenes/ch1_hanako_desk` | 机の華子はそのまま。40 歳の弁護士（城ヶ崎）が、窓際の空いた机の脇にかがんで、手のひらで横板を押さえ、華子のほうを見上げる |
| ✅ `ch1_hanako_pack` | `scenes/ch1_hanako_desk` | 華子が、椅子のそばに立ち、書類を閉じてバッグにしまう（ノートパソコンは閉じ、ランプは点いたまま） |
| ✅ `ch1_hanako_husband_desk` | `scenes/ch1_hanako_desk` | 華子の机は空。華子は、窓際の空いた机（夫の机）のそばに立ち、机の上を見下ろす |
| ✅ `ch1_hanako_evhall6` | `bg/cam06_evhall6`、`chars/hanako_normal` | 華子が、閉じたエレベーターの扉の前に立ち、肩にバッグ。呼び出しボタンへ手を伸ばす |
| ✅ `ch1_hanako_elevator` | `bg/cam05_elevator`、`chars/hanako_normal` | 華子がひとりでエレベーターの中に立ち、ボタンを押す |
| ✅ `ch1_hanako_stairs` | `bg/cam10_stairs`、`chars/hanako_normal` | 華子が、手すりに手を添えて階段を下りる |
| ✅ `ch1_couple_corridor` | `bg/cam03_corridor`、`chars/jogasaki_normal`、`chars/saeki_smile` | 城ヶ崎と佐伯が、寄り添って、ささやき笑いながら、廊下の奥へ歩く |
| ✅ `ch2_saijo_elevator` | `bg/cam05_elevator`、`chars/saijo_normal` | 白衣の西条が、エレベーターの中でひとりでボタンを押す。落ち着かない様子 |
| ✅ `ch2_saijo_corridor` | `bg/cam11_clinic`、`chars/saijo_normal` | 西条が、後ろを気にしながら、小さな鍵を手に、院長室の扉へ急ぐ |
| ✅ `ch1_hanako_corridor` | `bg/cam03_corridor`、`chars/hanako_normal` | 華子が、廊下の奥へ向かって足早に歩く（非常ベル・発信機・センサーはそのまま） |

### 描き直した絵（4 枚）

| 絵 | 添付 | 直したこと |
|---|---|---|
| ✅ `ch1_sena_mop` | `bg/cam03_corridor`、`chars/sena_normal` | 背景の非常ベル（箱・発信機つき）と場面の絵の非常ベル（むき出し）が食い違っていたので、背景の絵を土台に、清掃の女性・カート・バケツを足して作り直した |
| ✅ `ch1_sena_trace` | （上のチャットで続けて） | 上の絵から、モップを立てかけ、右の柱のひびを指でなぞる動きに変えた |
| ✅ `ch1_konbini` | `scenes/ch1_konbini`（元の絵） | 八島がレジの中（店員側）にいるように見えた。商品の棚の側に客（八島）、カウンターを挟んだレジの側に店員、という配置に直し、立ち位置が一目で分かるようにした（レジの向きだけの直しでは、変わらなかった） |
| ✅ `ch1_jump_aftermath` | `scenes/ch1_jump_aftermath`（元の絵） | 缶・袋・チャーシューのパックが、人や靴に比べて巨大だったので、実物の大きさに小さく描き直した。靴は、シートのそばに、実物の大きさで置いた |


### 第3・5章の仮の人影を置き換えた場面の絵（20 枚。2026-11-22）

台本で、人物を線の影（仮の人影）で出していた場面の絵です。背景の絵（`bg/`）に人物を足す形で、Google Gemini（無料）で作りました。共通のプロンプトの型は、「添付の 1 枚目を直す。部屋・角度・構図・明かり・色・絵柄はそのまま、何も動かさない。足すのは、（人物の説明と動き）だけ。防犯カメラから見下ろした小さな人物。カメラ本体は写さない。文字・ロゴなし」です。人物の見た目は、添付の立ち絵（緑の背景は無視）に合わせています。

| 絵 | 場面 | 添付 |
|---|---|---|
| ✅ `ch3_okochi_lobby` | 1F ロビー。受付のそばの柱に、くたびれたコートの刑事（大河内）が腕を組んでもたれ、ガムをかんでいる | bg/cam01_lobby、chars/okochi_normal |
| ✅ `ch3_reiko_stairdoor` | 9F 非常階段の扉前。玲子が、扉を開けて階段室へ入り、一度だけ振り返る | bg/cam18_stair_door9、chars/reiko_normal |
| ✅ `ch3_reiko_landing` | 9F 非常階段の踊り場。玲子が壁ぎわに立ち、手すりを持って、階段の下を怖がって見ている | bg/cam16_stair_landing、chars/reiko_normal |
| ✅ `ch3_man_backhall` | 9F 裏口の通路。帽子を目深にかぶった男（顔は見えない）が、画面の端で携帯を耳に当てる | bg/cam14_salon_back、chars/kuzumi_normal（体つきだけ） |
| ✅ `ch3_man_exit` | 9F 非常階段の扉前。帽子の男（顔は見えない）が、ひとりで扉から出て、壁ぎわを歩く | bg/cam18_stair_door9、chars/kuzumi_normal（体つきだけ） |
| ✅ `ch3_makabe_salon` | 9F サロン入口前の廊下。白髪の会長（真壁）がゆっくり歩き、清掃の瀬名が、うつむいて端に立つ | bg/cam15_salon_entrance、chars/makabe_normal、chars/sena_normal |
| ✅ `ch3_okochi_reiko_hall` | 9F エレベーターホール。降りてきた大河内と、サロンの戸口に立つ玲子が、小声で話す | bg/cam08_evhall9、chars/okochi_normal、chars/reiko_normal |
| ✅ `ch3_okochi_backhall` | 9F 裏口の通路。大河内が、奥の非常用設備ボックスへ向かって歩く | bg/cam14_salon_back、chars/okochi_normal |
| ✅ `ch3_reiko_exit` | 9F 裏口の通路。奥の扉から玲子が出てきて、大河内のほうを見る（上の絵から続けて作った） | （ch3_okochi_backhall を作ったチャットで続けて） |
| ✅ `ch3_boxes_corridor` | 1F 東廊下。捜査員 2 人が、段ボール箱を抱えて奥へ歩く | bg/cam03_corridor |
| ✅ `ch3_arrest_lobby` | 1F ロビー。刑事と捜査員に挟まれた作業着の男（八島）が、ガラス扉へ連れていかれる | bg/cam01_lobby、chars/okochi_normal |
| ✅ `ch3_saijo_police` | 3F クリニック前の廊下。院長（西条）が、腕を組んだ刑事に、何度も頭を下げる | bg/cam11_clinic、chars/saijo_normal、chars/okochi_normal |
| ✅ `ch5_kuzumi_run` | 非常階段。灰色のスーツの男（久住）が、書類の綴りを抱えて、階段を必死に駆ける | bg/cam10_stairs、chars/kuzumi_normal |
| ✅ `ch5_reiko_stair` | 非常階段。玲子が、1F の扉の前の踊り場で、壁に背を向けて静かに待つ | bg/cam10_stairs、chars/reiko_normal |
| ✅ `ch5_makabe_room` | 中央監視室。入口の内側に、真壁が、ひとりで穏やかに立つ | bg/cam00_room、chars/makabe_normal |
| ✅ `ch5_makabe_paper` | 中央監視室。真壁が、机の中央で、古い紙を 1 枚、指で机の上にすべらせる（文字は読めない） | scenes/ch5_makabe_room |
| ✅ `ch5_play_hall9` | 9F エレベーターホール。八島と玲子が、カメラに見せる、ぎこちない記録の受け渡しの芝居をする | bg/cam08_evhall9、chars/reiko_normal |
| ✅ `ch5_play_lobby` | 1F ロビー。八島と玲子が、同じ受け渡しの芝居をする | bg/cam01_lobby、chars/reiko_normal |
| ✅ `ch5_play_salon` | 9F サロン前。八島と玲子が、扉の前に並んで立つ（玲子が半歩前） | bg/cam27_salon_front、chars/reiko_normal |
| ✅ `ch5_lobby_watch` | 1F ロビー。住人 3 人（灰色のスーツの男・暗いコートの女・カーディガンの年配の男）が、大型モニターを見上げて固まる | bg/cam01_lobby |

- 「謎の男」（`ch3_man_backhall`・`ch3_man_exit`）は、第3章の時点で正体が割れないよう、帽子を目深にかぶせ、顔が見えない形で頼んだ。
- 1 回で思いどおりになった絵が多い。`ch5_makabe_paper` は、アカウントの上限とエラーで、別のアカウントで作り直した。
