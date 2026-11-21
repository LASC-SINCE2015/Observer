# 第4章で足す絵のプロンプト

第4章の台本（`game/scenario/chapter4.js`）で使う、まだ作っていない絵の一覧です。形式・共通の決まりは [prompts_en.md](prompts_en.md) に合わせています（作ったら、ここを ✅ にして、prompts_en.md の表に移します）。

- 絵のファイルがなくても、台本は線画の代わりで最後まで遊べます。
- 人の体（遺体）は、どの絵にも描きません（社員証と手帳で伝える）。
- 文字・時計・時刻・ロゴは入れません。
- 保存先は `assets_src/images/<種類>/<名前>`。作ったら `./tools/optimize_images.ps1` で変換します。

## 生成の状況

全 22 枚（背景 3・場面の絵 19、うち 1 枚は第3章と共有）。2026-11-21 に、背景 3 枚と場面の絵 5 枚（`ch4_machine_corridor`・`ch4_salon_3am`・`ch4_cart_kuzumi`・`ch4_viewing_room`・第3章と共有の `ch3_relay_heel`）を生成済み（✅）。残りの場面の絵 14 枚は ⬜（未生成。1 日の生成の上限で止まった）。台本・`cameras.js` が指す名前と、すべて一致している（R33 で確認）。

第4章で新しく作るのは、この 22 枚だけです。9F のサロンの裏口通路（CAM-14）・入口前（CAM-15）・非常階段の踊り場（CAM-16）は、第3章と同じカメラなので、第3章の絵を使います（`new_prompts_ch3.md`）。

- 背景: `bg/cam14_salon_back`、`bg/cam15_salon_entrance`、`bg/cam16_stair_landing`
- 場面: `scenes/ch3_backdoor_threat`（9 日目 0:30 の脅し）、`scenes/ch3_backdoor_call`（9 日目 2:20 の内線）、`scenes/ch3_saori_door`（聞き直す沙織ママ）、`scenes/ch3_relay_heel`（2:28 の踊り場）

| 種類 | 枚数 | 名前 |
|---|---|---|
| カメラの背景 | 3 | cam20_machine_corridor / cam23_service_lift / cam24_unknown_line |
| 場面の絵 | 19 | ch4_machine_corridor / ch4_staff_card / ch4_lobby_tv / ch4_mama_hall / ch4_flash_office / ch4_flash_makabe / ch4_whiteboard / ch4_terminal_folder / ch4_notebook_strike / ch4_salon_3am / ch4_service_lift / ch4_cart_kuzumi / ch4_kuzumi_office / ch4_service_door / ch4_anteroom / ch4_room_view / ch4_self_9d / ch4_viewing_room / ch3_relay_heel（第3章と共有） |

## カメラの背景 `images/bg/`（横長 16:9、人はいない）

共通の指示は prompts_en.md の「カメラの背景」と同じです。

```
Japanese anime style background art, cinematic. Late night inside a luxury high-rise tower, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Dim, quiet, uneasy night lighting. No people. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
```

| 状況 | ファイル名 | Scene | 日本語訳 |
|---|---|---|---|
| ✅ | `cam20_machine_corridor` | Scene: a basement-level service corridor in front of a heavy gray steel door marked only by a blank plate (the mechanical room), concrete walls, pipes along the ceiling, a dim fluorescent light, a small paper notice taped beside the door with no readable text. | 地下の業務用の廊下。無地のプレートだけの重い灰色の鉄の扉（機械室）、コンクリートの壁、天井に配管、薄暗い蛍光灯、扉の脇に貼られた小さな紙（読める文字はない）。 |
| ✅ | `cam23_service_lift` | Scene: a 9th-floor service elevator landing, a plain stainless steel freight elevator door, a blank floor indicator panel above it with small unlit segments, a utility corridor feel, bare concrete floor. | 9 階の業務用エレベーターの前。飾りのないステンレスの貨物用エレベーターの扉、その上に文字のない階数の表示板（小さな消えた区画）、業務用の廊下の雰囲気、むき出しのコンクリートの床。 |
| ✅ | `cam24_unknown_line` | Scene: almost pure darkness with faint analog noise and a few horizontal scan lines, nothing recognizable, as if a video feed from an unknown source. | ほぼ真っ暗。かすかなアナログのノイズと数本の走査線だけで、何も判別できない（映像元不明の回線）。 |

## 場面の絵 `images/scenes/`（横長 16:9）

### ✅ ch4_machine_corridor（11 日目 21:10、機械室の前。第5章の ch5_machine_room_tape の元にもなる）

添付: `bg/cam20_machine_corridor`

```
Generate an image. Edit the attached image. Keep exactly the same corridor, steel door, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. Add yellow police tape stretched across the corridor in front of the door, two uniformed police officers standing on either side of the door with their hands at their sides, and in the middle a tired detective in a rumpled beige coat standing beside the tape and looking toward the viewer. Small figures as seen from a high angle. The steel door is closed; nothing behind it is shown. No text, no clock, no timestamp, no logo.
```

> **日本語訳**: 添付の絵を直す。廊下・鉄の扉・角度・構図・明かり・色・絵柄はそのまま（隅の天井の防犯カメラから見下ろす）。扉の前の廊下に黄色い規制線を張り、扉の両脇に制服の警官が 2 人、手を体の脇につけて立つ。真ん中の規制線のそばに、しわのあるベージュのコートの疲れた刑事が、こちらを向いて立つ。高い角度から見た小さな人影。扉は閉まっていて、中は映さない。文字・時計・時刻・ロゴは入れない。

### ⬜ ch4_staff_card（社員証のアップ）

添付: `chars/okochi_normal`（手とコートの見本）

```
Generate an image. Wide horizontal 16:9. Japanese anime style, cinematic close-up, cold fluorescent light. A gloved hand in the foreground holds a small clear plastic evidence bag, and inside it is an old worn staff ID card on a lanyard: a small photo of a man in his thirties with an awkward, apologetic smile, and blank gray bars where the name and title would be (no readable text). The background is the blurred concrete wall of a basement corridor with a strip of yellow police tape out of focus. The bag is held slightly trembling. No body, no blood. No readable text, no clock, no logo.
```

> **日本語訳**: 横長 16:9。日本のアニメ調、映画のようなアップ。冷たい蛍光灯の光。手前で、手袋をした手が小さな透明の証拠袋を持ち、中に古くすり切れたストラップ付きの社員証。30 代の男の小さな顔写真（困ったような申し訳なさそうな笑み）、名前と役職のところは文字のない灰色の帯。背景は、地下の廊下のコンクリートの壁と、ぼやけた黄色い規制線。袋はわずかに震えている。体・血は映さない。読める文字・時計・ロゴは入れない。

### ⬜ ch4_lobby_tv（11 日目、ロビーのテレビに会長のインタビュー）

添付: `bg/cam01_lobby`

```
Generate an image. Edit the attached image. Keep exactly the same lobby, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. The lobby is empty of people. Only change what is shown on the wall-mounted TV screen: a news interview, an elderly man with neatly combed white hair in a dark suit smiling calmly, surrounded by several microphones held toward him from the edge of the frame. The TV glows blue-white. No subtitles, no text, no clock, no logo.
```

> **日本語訳**: 添付の絵を直す。ロビー・角度・構図・明かり・色・絵柄はそのまま。ロビーに人はいない。壁のテレビの画面だけを変える: ニュースのインタビュー。白髪をきれいになでつけた紺のスーツの高齢の男が、穏やかに微笑み、画面の端から何本ものマイクが向けられている。テレビは青白く光る。字幕・文字・時計・ロゴは入れない。

### ⬜ ch4_mama_hall（9F のサロン入口に、知らないママ。CAM-08 の今の映像）

添付: `bg/cam08_evhall9`、`chars/saori_normal`（第3章で作る沙織ママ。第3章の `ch3_saori_door` と同じ人にする）

```
Generate an image. Edit the first attached image. Keep exactly the same 9th-floor hall, salon wooden door, potted plant, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. Add one woman standing at the salon entrance: the woman from the second attached image (34-year-old hostess with long wavy hair and an elegant dark green evening gown; ignore its background), giving a graceful small bow to someone just out of frame. A small framed portrait beside the door shows the same woman. Small figure as seen from a high angle. No text, no clock, no logo.
```

> **日本語訳**: 1 枚目の絵を直す。9 階のホール・サロンの木の扉・観葉植物・角度・構図・明かり・色・絵柄はそのまま。サロンの入口に女を 1 人足す: 2 枚目の女性（34 歳のママ。ゆるいウェーブの長い髪、上品な深緑のイブニングドレス。背景は無視）が、フレームの外の誰かに、優雅に小さく会釈している。扉の脇の額には、同じ女性の肖像。高い角度から見た小さな人影。文字・時計・ロゴは入れない。

### ⬜ ch4_flash_office（8 年前、汐見ベイコートの現場事務所）

添付: `bg/cam07_office`（部屋の雰囲気の見本）

```
Generate an image. Wide horizontal 16:9. Japanese anime style, slightly desaturated, soft sepia flashback tone. A construction site temporary office in daytime: steel desks piled with blueprints, a hard hat on a shelf, a whiteboard with blank grids, dusty window light. In the middle, a young man in a work jacket (the main character, age 27) reaching out a little late to take a thick bundle of papers from a young woman in a work uniform whose hands are trembling as she holds them out. No readable text, no clock, no logo.
```

> **日本語訳**: 横長 16:9。日本のアニメ調。少し色を落とした、やわらかいセピアの回想の色。昼間の建設現場の仮設事務所: 設計図が積まれた鉄の机、棚のヘルメット、罫線だけの白板、ほこりっぽい窓の光。真ん中で、作業ジャケットの若い男（主人公、27 歳）が、作業服の若い女が震える手で差し出す厚い紙の束を、少し遅れて受け取ろうと手をのばす。読める文字・時計・ロゴは入れない。

### ⬜ ch4_flash_makabe（8 年前、常務室。紙は映さない）

```
Generate an image. Wide horizontal 16:9. Japanese anime style, slightly desaturated, soft sepia flashback tone. A senior executive's quiet office, seen from the eye level of someone standing in front of a large polished desk. Behind the desk sits a man in his early fifties with white-streaked combed hair and an expensive dark suit, smiling calmly. In the foreground, only his hand is visible at the edge of the desk, one finger pressing and sliding a single sheet of paper across the desktop toward the viewer; the paper is shown only from the back or its edge, face down, so nothing on it is visible. No readable text, no clock, no logo.
```

> **日本語訳**: 横長 16:9。日本のアニメ調。少し色を落とした、やわらかいセピアの回想の色。重役の静かな部屋。大きな磨かれた机の前に立つ人の目の高さから見る。机の向こうに、白髪まじりの髪をなでつけ、高価な濃い色のスーツを着た 50 代前半の男が、穏やかに微笑んで座っている。手前には、机のふちに彼の手だけが見え、指一本で 1 枚の紙を、こちらへ向けて机の上をすべらせている。紙は裏側か縁だけで、何が書いてあるかは見えない。読める文字・時計・ロゴは入れない。

### ⬜ ch4_whiteboard（監視室のホワイトボード）

添付: `bg/cam00_room`

```
Generate an image. Edit the attached image. Keep the same basement monitoring room, lighting, colors and art style, but change the viewpoint to a medium shot of a wall-mounted whiteboard on the concrete wall beside the monitors. The whiteboard has a neat hand-ruled grid: three horizontal rows and four columns of boxes, all empty, with a black marker resting in the tray and a half-erased smudge in one corner. A faint cold glow from the monitors falls on it. No people. No readable text, no numbers, no clock, no logo.
```

> **日本語訳**: 添付の絵を直す。地下の監視室・明かり・色・絵柄は同じにして、視点を、モニターの脇のコンクリートの壁にかかったホワイトボードの中景に変える。ホワイトボードには、定規で引いたような罫線の表（3 行・4 列のます）が、すべて空欄で書かれている。ペン置きに黒いマーカー、隅に半分消した跡。モニターの冷たい光がかすかに当たる。人はいない。読める文字・数字・時計・ロゴは入れない。

### ⬜ ch4_terminal_folder（空のフォルダ）

```
Generate an image. Wide horizontal 16:9. Japanese anime style, cinematic close-up of a computer monitor in a dim basement room. On the screen, a plain file manager window shows one empty folder, with an empty list area and a tiny gray counter in the corner (only blank gray shapes, no readable text or numbers). The cold blue-white glow lights a man's tired reflection faintly in the dark screen edge. Cables and a half-drunk can of coffee beside the keyboard. No readable text, no numbers, no clock, no logo.
```

> **日本語訳**: 横長 16:9。日本のアニメ調。薄暗い地下室のコンピュータのモニターの、映画のようなアップ。画面には、飾りのないファイル管理の窓に、空のフォルダが 1 つ。一覧は空で、隅に小さな灰色のカウンター（無地の灰色の形だけで、読める文字・数字はない）。冷たい青白い光が、暗い画面のふちに、疲れた男の顔をかすかに映す。キーボードの脇に、ケーブルと飲みかけの缶コーヒー。読める文字・数字・時計・ロゴは入れない。

### ⬜ ch4_notebook_strike（手帳の一行に線を引く）

```
Generate an image. Wide horizontal 16:9. Japanese anime style, cinematic close-up, warm desk lamp light in a dim room. A man's hand holding a plastic ruler flat on an open notebook page, drawing a straight pencil line through a single line of neat handwriting (the handwriting is shown only as tidy rows of small marks, not readable). The page has several other neat lines above and below. The handwriting is very straight, as if drawn with a ruler. No readable text, no clock, no logo.
```

> **日本語訳**: 横長 16:9。日本のアニメ調。映画のようなアップ。薄暗い部屋の、あたたかい卓上ランプの光。男の手が、開いた手帳のページに定規を平らに当て、きれいな手書きの一行に、まっすぐな鉛筆の線を引いている（字は、小さな印のそろった行として描くだけで、読めない）。ページの上下には、ほかのきれいな行がいくつもある。字は、定規で引いたようにまっすぐ。読める文字・時計・ロゴは入れない。

### ✅ ch4_salon_3am（9 日目 3:05、変わったあとの 3 時）

添付: `bg/cam15_salon_entrance`（第3章の絵）、`chars/reiko_sad`

```
Generate an image. Edit the attached image. Keep exactly the same passage, wooden doors, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. The salon double door stands open. Add two people walking away along the passage toward the right: a man in a dark gray work uniform seen from above with his face turned away, holding a ring of keys in one hand and supporting with his other arm a woman in an elegant dark dress whose steps are unsteady and head is lowered (matching the attached character reference). Small figures as seen from a high angle. No violence is shown. No text, no clock, no logo.
```

> **日本語訳**: 添付の絵を直す。通路・木の扉・角度・構図・明かり・色・絵柄はそのまま（隅の天井の防犯カメラから見下ろす）。サロンの両開きの扉は開いている。通路を右へ歩いていく 2 人を足す: 濃い灰色の作業服の男は、上から見た形で顔をそむけ、片手に鍵束を持ち、もう片方の腕で、足もとのおぼつかない、うつむいた上品な濃い色のドレスの女（添付の人物と同じ）を支えている。高い角度から見た小さな人影。暴力は映さない。文字・時計・ロゴは入れない。

### ⬜ ch4_service_lift（9 日目 3:07、業務用エレベーターの表示）

添付: `bg/cam23_service_lift`

```
Generate an image. Edit the attached image. Keep exactly the same service elevator landing, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. No people. Only change the blank floor indicator panel above the elevator door: a row of small segments, with the segments for the upper levels now unlit and one small segment lit near the bottom of the row, as if the car is passing downward; below the last segment, the panel is simply dark and ends. No text, no numbers, no clock, no logo.
```

> **日本語訳**: 添付の絵を直す。業務用エレベーターの前・角度・構図・明かり・色・絵柄はそのまま。人はいない。扉の上の、文字のない階数の表示板だけを変える: 小さな区画の列で、上の階の区画は消え、列の下のほうの区画が 1 つ点いている（箱が下へ通り過ぎていくように）。最後の区画の下は、ただ暗くて終わっている。文字・数字・時計・ロゴは入れない。

### ✅ ch4_cart_kuzumi（11 日目 1:05、台車を押す久住）

添付: `bg/cam20_machine_corridor`、`chars/kuzumi_normal`

```
Generate an image. Edit the attached image. Keep exactly the same corridor, steel door, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. Add one man: a middle-aged man with neatly parted hair in a gray work uniform (matching the attached character reference), pushing a flat hand cart down the corridor toward the steel door, looking straight ahead. On the cart there is only a folded gray tarpaulin, flat and low, with no shape under it. He is glancing at his wristwatch. Small figure as seen from a high angle. No body, no blood. No text, no clock, no timestamp, no logo.
```

> **日本語訳**: 添付の絵を直す。廊下・鉄の扉・角度・構図・明かり・色・絵柄はそのまま。男を 1 人足す: 髪をきちんと分けた中年の男（灰色の作業服。添付の人物と同じ）が、平らな台車を押して廊下を鉄の扉へ向かい、まっすぐ前を見ている。台車の上は、たたんだ灰色の防水シートが平らに低く載っているだけで、下に形はない。腕時計に目を落としている。高い角度から見た小さな人影。体・血は映さない。文字・時計・時刻・ロゴは入れない。

### ⬜ ch4_kuzumi_office（管理会社の事務所）

```
Generate an image. Wide horizontal 16:9. Japanese anime style, cinematic, a quiet building-management office late at night. A tidy desk with stacks of papers whose edges are perfectly aligned, a bank of small monitors, and a man in a gray work jacket seen from behind, sitting very straight and watching one monitor that shows a dim basement monitoring room. On the desk, neat rows of binders and a wristwatch laid flat. Cold light from the monitors. No readable text, no clock, no timestamp, no logo.
```

> **日本語訳**: 横長 16:9。日本のアニメ調。映画のような絵づくり。深夜の、静かなビル管理会社の事務所。縁がぴったりそろった書類の山のある、きれいな机。小さなモニターの列。灰色の作業ジャケットの男が、背筋をまっすぐにして座り、薄暗い地下の監視室を映した 1 台のモニターを後ろから見ている。机の上に、きちんと並んだバインダーと、平らに置かれた腕時計。モニターの冷たい光。読める文字・時計・時刻・ロゴは入れない。

### ⬜ ch4_service_door（11 日目の夜、ビルの通用口の外）

添付: `scenes/ch1_street_phone`（ビルの外観・歩道の見本）

```
Generate an image. Wide horizontal 16:9. Japanese anime style background art with a character, cinematic. A night-time side service entrance of a glass skyscraper, a plain steel door with a small light above it, a low concrete step, wind blowing a few leaves across the pavement, city lights reflected in the glass wall of the tower above. A man in his mid thirties in a rumpled security uniform sits on the step with his back against the door, hunched, a bag at his feet, looking down. Same building and art style as the attached image. No text, no clock, no logo.
```

> **日本語訳**: 横長 16:9。日本のアニメ調の、人物入りの背景画。映画のような絵づくり。夜のガラスの高層ビルの通用口。飾りのない鉄の扉と、上の小さな明かり、低いコンクリートの段差。数枚の葉が風で歩道を転がり、頭上のガラスの壁に街の明かりが映る。30 代半ばの男が、しわのある警備の制服で、扉に背をつけて段差に座り、背を丸め、足もとに鞄を置いてうつむいている。ビルと絵柄は添付の絵と同じ。文字・時計・ロゴは入れない。

### ⬜ ch4_anteroom（監視室の前室）

添付: `scenes/ch1_sena_mop`（清掃員の見本）

```
Generate an image. Wide horizontal 16:9. Japanese anime style background art with a character, cinematic. A small windowless anteroom in front of a basement monitoring room: bare concrete walls, a flickering fluorescent tube, an open gray electrical panel on the wall with its inspection hatch cover hanging, and a cleaning cart parked against the wall with folded sheets and a bundle of mops. A woman in a gray cleaning uniform with a towel around her neck and her hair tied back stands by the panel, one hand on the open hatch. Same style as the attached image. No text, no clock, no logo.
```

> **日本語訳**: 横長 16:9。日本のアニメ調の、人物入りの背景画。映画のような絵づくり。地下の監視室の前の、窓のない小さな前室。むき出しのコンクリートの壁、ちらつく蛍光灯、壁の開いた灰色の配電盤（点検口のふたが垂れている）、壁ぎわに停めた清掃用のワゴン（たたんだシーツとモップの束）。グレーの清掃の制服で、首にタオルを掛け、髪を後ろで結んだ女が、配電盤のそばで、開いた点検口に片手をかけて立つ。絵柄は添付の絵と同じ。文字・時計・ロゴは入れない。

### ⬜ ch4_room_view（今の監視室を、故障中だったカメラから）

添付: `bg/cam00_room`、`scenes/ch1_monitor_room`

```
Generate an image. Edit the attached image. Keep exactly the same basement monitoring room, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. Add two people seen from above and behind: a man in a rumpled security uniform sitting hunched at the long desk facing the glowing monitor wall, and standing a little behind him on his right a woman in a gray cleaning uniform with her hair tied back, leaning in toward the monitors. Small figures as seen from a high angle. No text, no clock, no timestamp, no logo.
```

> **日本語訳**: 添付の絵を直す。地下の監視室・角度・構図・明かり・色・絵柄はそのまま（隅の天井の防犯カメラから見下ろす）。上の後ろから見た人を 2 人足す: しわのある警備の制服の男が、光るモニターの壁に向かって長い机に背を丸めて座り、その少し後ろの右に、グレーの清掃の制服で髪を結んだ女が、モニターのほうへ身を寄せて立つ。高い角度から見た小さな人影。文字・時計・時刻・ロゴは入れない。

### ⬜ ch4_self_9d（9 日目 1:00、3 日前の自分）

添付: `bg/cam00_room`、`scenes/ch1_monitor_room`

```
Generate an image. Edit the attached image. Keep exactly the same basement monitoring room, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. Add one person seen from above and behind: a man in a rumpled security uniform sitting hunched alone at the long desk, leaning toward the monitor wall, one hand over his mouth, staring at one monitor. Empty coffee cans on the desk. The second chair is empty. Small figure as seen from a high angle. No text, no clock, no timestamp, no logo.
```

> **日本語訳**: 添付の絵を直す。地下の監視室・角度・構図・明かり・色・絵柄はそのまま。上の後ろから見た人を 1 人足す: しわのある警備の制服の男が、ひとりで長い机に背を丸めて座り、モニターの壁のほうへ身を乗り出して、片手を口に当て、1 台のモニターを見つめている。机の上に空き缶。もう一つの椅子は空。高い角度から見た小さな人影。文字・時計・時刻・ロゴは入れない。

### ✅ ch4_viewing_room（観覧室の一瞬の映像。第5章の CAM-26 と同じ部屋）

添付: `bg/cam26_viewing_room`（第5章の新しい背景。先に作る。椅子の数・上座・モニターの壁を、そのまま使う）

```
Generate an image. Edit the attached image. Keep exactly the same viewing room, camera angle, composition, lighting, colors and art style (a hidden camera high in a corner, a whole wall of glowing monitors, seven leather armchairs in a shallow arc, a larger head seat on a low dais). Make it look like a small glitchy video feed: faint scan lines and noise over the image. Add the backs and shoulders of four or five people in formal clothes seated in the armchairs, seen from behind. One of them is holding up a glass of red wine toward the camera as if making a toast. No faces visible. No text, no clock, no timestamp, no logo.
```

> **日本語訳**: 添付の絵を直す。観覧室・角度・構図・明かり・色・絵柄はそのまま（隅の高い所の隠しカメラ、壁一面の光るモニター、浅い弧の革張りの椅子 7 つ、一段高い台の上の上座）。小さな、乱れた映像に見えるよう、かすかな走査線とノイズを重ねる。礼服の 4〜5 人が、椅子に座った背中と肩を、後ろから見せている。そのうちの 1 人が、カメラに向かって赤ワインのグラスを掲げている（乾杯のように）。顔は見えない。文字・時計・時刻・ロゴは入れない。

### ✅ ch3_relay_heel（第3章と共有。9 日目 2:28、9F 非常階段の踊り場）

第3章の「届く一枚」と同じ絵です。第3章の台本と同じファイルを使います（作るのは 1 枚だけ）。

添付: `bg/cam10_stairs`

```
Generate an image. Edit the attached image. Keep exactly the same emergency staircase landing, camera angle, composition, lighting, colors and art style, viewed from a ceiling-mounted security camera in the corner, high angle. No people. The heavy metal door on the landing stands open, and on the floor just inside the doorway lies a single high-heeled shoe, tipped on its side. The edges of the whole image are bleached to a soft glowing white, as if the picture is burned at its borders. No text, no clock, no timestamp, no logo.
```

> **日本語訳**: 添付の絵を直す。非常階段の踊り場・角度・構図・明かり・色・絵柄はそのまま（隅の天井の防犯カメラから見下ろす）。人はいない。踊り場の重い鉄の扉は開いたままで、戸口のすぐ内側の床に、ハイヒールが片方、横倒しで転がっている。絵全体のふちが、白くやわらかく光るように焼けている（絵のふちが焼き付いたように）。文字・時計・時刻・ロゴは入れない。
