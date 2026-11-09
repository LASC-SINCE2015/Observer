# 英語のプロンプト集

英語の画像生成サイト向けのプロンプトです。日本語版と同じ絵の一覧（[README.md](README.md)）に対応しています。

## 使い方

- **文章で指示するサイト**（ChatGPT・Gemini・Microsoft Designer・Ideogram など）: 各絵の「Prompt」を、そのまま 1 つ貼り付けてください。共通の指示も中に入れてあります。
- **Stable Diffusion 系のサイト**（SeaArt・Tensor.Art・Leonardo など。「Negative prompt」の欄があるサイト）: 下の「Stable Diffusion 系のサイト向け」の書き方も使えます。アニメ調のモデル（名前に Anime・Animagine・Pony などが入ったもの）を選ぶと、絵柄が出やすくなります。
- 2 枚目からは、気に入った絵を添付（参考画像・Image to Image・Character Reference など）して、文の頭に次を足すと、絵柄がそろいやすくなります。

  > Same art style, same coloring and same character design as the attached image.

- 表情違いは、次を足します。

  > Same character, same outfit, same pose. Only change the facial expression to: 〈表情〉.

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

## 立ち絵 `images/chars/`（縦長 2:3、グリーンバック）

### 一ノ瀬玲子

#### reiko_normal（一ノ瀬玲子・ふだん）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted elegant colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 34-year-old woman, the hostess (mama) of an exclusive members-only salon in a luxury tower. Long black hair with soft waves, swept to one side. Violet eyes, slightly downcast, long eyelashes. Red lipstick, a small beauty mark near her lips. Wearing an off-the-shoulder wine-red evening gown (fully clothed, elegant, not revealing), a thin gold necklace and drop earrings. Graceful, alluring and refined, with a hint of loneliness.
Expression: a calm, gentle, faint smile.
```

#### reiko_smile（玲子・艶っぽい微笑み）

```
Same character, same outfit, same pose as reiko_normal. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: eyes narrowed slightly, a sultry, knowing smile, head tilted a little. Elegant and alluring, fully clothed.
```

#### reiko_sad（玲子・すまなそうな顔）

```
Same character, same outfit, same pose as reiko_normal. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: eyes cast down, an apologetic, guilty and sorrowful look, lips slightly pressed together.
```

### 佐伯瑠璃

#### saeki_smile（佐伯瑠璃・営業スマイル）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted elegant colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 32-year-old woman, the manager of a high-end luxury brand boutique. Bright chestnut-brown bob haircut with curled ends, sharp winged eyeliner, glamorous and confident beauty. Wearing the boutique's black fitted jacket and pencil skirt uniform with an elegant silk scarf at the neck (fully clothed, stylish).
Expression: a flawless, polished customer-service smile.
```

#### saeki_scorn（佐伯・見下す目）

```
Same character, same outfit, same pose as saeki_smile. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: chin raised slightly, looking down on the viewer with cold, contemptuous eyes, a faint sneer.
```

#### saeki_normal（佐伯・すました顔）

```
Same character, same outfit, same pose as saeki_smile. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: composed, aloof, neutral face.
```

#### saeki_flushed（佐伯・情事のさなか、紅潮した姿）

```
Same character as saeki_smile: a 32-year-old glamorous woman with a chestnut-brown bob haircut with curled ends and sharp winged eyeliner. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Scene: a secret late-night rendezvous in a dim stockroom.
Look: deeply flushed cheeks and ears, dewy skin with a light sheen of sweat on her neck, shoulders and collarbone, half-lidded glossy eyes with a dazed, lovestruck gaze, lips parted as if catching her breath. Her bob hair is badly tousled, strands clinging to her cheek and neck. Her clothes are in disarray: the black uniform jacket has slid down off both shoulders to her elbows, the silk scarf hangs untied, and her white blouse is unbuttoned at the top and pulled askew, slipping off one bare shoulder. A thin black strap has slipped down that shoulder, with a glimpse of black lace at the open collar. Her pencil skirt is wrinkled. One hand clutches the open front of her blouse.
Mood: flustered, breathless, alluring, elegant.
```

Negative prompt は、下の「密会の場面の立ち絵の Negative prompt」を使います。

**断られたとき（1 段弱めた版）**: 黒いひもとレースを外し、はだけ方を少し控えめにしたもの。

```
Same character as saeki_smile: a 32-year-old glamorous woman with a chestnut-brown bob haircut with curled ends and sharp winged eyeliner. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Scene: a secret late-night rendezvous in a dim stockroom.
Look: deeply flushed cheeks and ears, dewy skin with a light sheen of sweat on her neck and collarbone, half-lidded glossy eyes with a dazed, lovestruck gaze, lips slightly parted. Her bob hair is tousled, a few strands clinging to her cheek. Her black uniform jacket has slipped down off her shoulders, the silk scarf hangs untied, the top two buttons of her white blouse are open and the collar is askew, showing one bare shoulder. One hand holds the front of her blouse, and she glances away, flustered.
Mood: flustered, romantic, alluring, elegant.
```

**それでも断られたとき（いちばん控えめな版）**: 肩も出さず、紅潮と乱れた髪・ゆるんだスカーフだけで見せるもの。

```
Same character as saeki_smile: a 32-year-old glamorous woman with a chestnut-brown bob haircut with curled ends and sharp winged eyeliner. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Look: blushing deeply, flustered and out of breath, half-lidded glossy eyes, lips slightly parted, tousled bob hair with a few strands on her cheek. Her silk scarf is loosened and her blouse collar is slightly askew. She glances away with an embarrassed, dreamy expression.
Mood: romantic, flustered, alluring.
```

### 城ヶ崎華子

`hanako_angry` を基準の絵にして、ほかの表情はこの絵を参照して作ります。

#### hanako_angry（城ヶ崎華子・静かな怒り。基準の絵）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted elegant colors. Waist-up, body facing the viewer, turned only slightly to the side, face looking straight at the viewer. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 45-year-old adult woman, the head partner of a law firm. Long, straight, glossy black hair worn down, flowing past her shoulders to her chest, parted to one side. Thin-framed glasses. A strikingly beautiful mature woman with a severe, intimidating face: sharp narrow eyes, upswept eyeliner, thin arched eyebrows, high cheekbones, a defined jawline, dark red lips. A voluptuous, curvy figure with a full bust and a narrow waist. Wearing a fitted navy tailored suit, fully buttoned, over a white blouse, with a lawyer's badge on the lapel.
Expression: cold, sharp and commanding, looking down on the viewer slightly, lips closed, with no openings.
```

Negative prompt:

```
hair bun, updo, ponytail, tied hair, short hair, back view, looking over shoulder, soft face, gentle smile, round eyes, flat chest, green ambient light, green color spill, green glow, text, watermark
```

#### hanako_normal（華子・静かな笑み）

`hanako_angry` を参照して作ります。参照の効きが強いと表情が変わらないので、Strength は Low〜Mid から試します。

```
Same character, same outfit, same pose, same art style as the attached image. Only change the eyebrows, eyes and mouth. Japanese anime style visual novel portrait, delicate line art, crisp cel shading, waist-up, vertical 2:3, no text. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character.
Expression: a quiet, composed, faint smile. Eyebrows relaxed, smooth and gently arched, with a smooth forehead and a relaxed space between the brows. Calm, steady eyes looking at the viewer, slightly narrowed with confidence. The corners of her lips turned up just a little, lips closed. A serene, poised, self-assured beauty who reveals nothing.
```

Negative prompt:

```
furrowed brows, frown, angry, glaring, scowl, knitted eyebrows, wrinkles between the eyebrows, downturned mouth, open mouth, teeth, wide grin, hair bun, updo, short hair, green ambient light, green color spill, green glow, text, watermark
```

#### hanako_rage（華子・激高）

`hanako_angry` を参照して作ります。

```
Same character, same outfit, same art style as the attached image. Only change the facial expression and pose. Japanese anime style visual novel portrait, delicate line art, crisp cel shading, waist-up, vertical 2:3, no text. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character.
Expression: explosive, furious rage. Eyes wide open and blazing behind the glasses, small contracted pupils, eyebrows sharply drawn together and slanted, deep furrow between the brows, flushed cheeks, mouth open mid-shout with clenched teeth visible, jaw tense.
Pose: leaning forward toward the viewer, shoulders raised and tense, one hand raised, pointing a finger accusingly at the viewer. Long black hair swept and disheveled by the sudden movement, a few strands falling across her face. Her glasses are slightly askew. Still beautiful and intimidating, fully clothed in the navy suit.
```

Negative prompt:

```
calm face, smile, closed mouth, soft expression, sad, crying, hair bun, updo, short hair, back view, extra fingers, deformed hands, green ambient light, green color spill, green glow, text, watermark
```

### 瀬名遥

#### sena_normal（瀬名遥・まっすぐ）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted colors. Waist-up, body turned slightly to the side, face looking at the viewer. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 33-year-old woman who works as a night-shift building cleaner. Black hair tied back in a single ponytail. Little makeup but naturally good-looking, with strong, determined eyes. Wearing a gray work uniform with a towel around her neck. On her left wrist, a men's wristwatch that is too large for her.
Expression: looking straight at the viewer, serious and steady.
```

#### sena_smile（瀬名・からかう笑み）

```
Same character, same outfit, same pose as sena_normal. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: a slight teasing smile, one eyebrow a little raised, warm but a bit tired.
```

### 城ヶ崎拓海

#### jogasaki_scorn（城ヶ崎拓海・吐き捨てる）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, slightly muted colors. Waist-up, body turned slightly to the side. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 40-year-old elite lawyer. Neatly styled hair, an expensive dark suit and tie. Arrogant, handsome in a cold way.
Expression: looking down at the viewer with disdain, as if spitting out the words "get lost".
```

#### jogasaki_normal（城ヶ崎・澄ました顔）

```
Same character, same outfit, same pose as jogasaki_scorn. Japanese anime style visual novel portrait, vertical 2:3, no text. Background: solid pure green chroma key background, flat solid background, clean sharp edges, no shadows on background. No green light on the character.
Expression: smug, self-satisfied, neutral face.
```

#### jogasaki_aroused（城ヶ崎・情事のさなか、興奮している）

```
Same character as jogasaki_scorn: a 40-year-old elite lawyer with neatly styled hair and an expensive dark suit. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Scene: a secret late-night rendezvous in a dim stockroom.
Look: flushed face, sweat on his forehead and neck, breathing hard, eyes burning with excitement and possessiveness, a hungry, self-satisfied grin. Jacket off. His tie is yanked loose and hanging crooked, his dress shirt is unbuttoned almost to the waist and half untucked, showing part of his chest, one side slipping off his shoulder. Hair fallen out of place over his forehead, sleeves shoved up.
Mood: heated, reckless, arrogant excitement.
```

Negative prompt は、下の「密会の場面の立ち絵の Negative prompt」を使います。

#### jogasaki_after（城ヶ崎・情事を終えて、すっきりした顔）

```
Same character as jogasaki_scorn: a 40-year-old elite lawyer with an expensive dark suit. Japanese anime style visual novel portrait for a mature suspense story, delicate line art, crisp cel shading, waist-up, vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Scene: just after a secret rendezvous, he is putting himself back together before leaving.
Look: relaxed, satisfied, smug smirk, eyes half-closed with lazy contentment, a faint flush still on his cheeks. His shirt is still open at the chest and carelessly half tucked in; he is buttoning it back up with one hand, the loose tie draped around his neck, hair mussed and being smoothed back, suit jacket slung over his shoulder.
Mood: complacent, refreshed, arrogant, as if nothing in the world can touch him.
```

Negative prompt は、下の「密会の場面の立ち絵の Negative prompt」を使います。

### 久住正臣

#### kuzumi_normal（久住正臣）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, muted colors. Waist-up, body turned slightly to the side. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 55-year-old man, the manager of a building management company. Graying hair, a plain gray suit. An inconspicuous, colorless man you would never remember. He is holding a stack of documents and aligning their corners with his fingers.
Expression: expressionless, polite, unreadable.
```

### 大河内誠司

#### okochi_normal（大河内誠司）

```
Japanese anime style illustration, character portrait (tachi-e) for a mature suspense visual novel. Delicate line art, crisp cel shading, muted colors. Waist-up, body turned slightly to the side. Vertical 2:3. Background: solid pure green background, bright green screen background, chroma key green, flat solid background, clean sharp edges, no shadows on background. No green light or green reflections on the character. No text, no logo, no watermark.
Character: a 52-year-old police detective. A worn beige trench coat, stubble, tired but sharp eyes. Chewing gum.
Expression: a piercing, suspicious stare.
```

### 密会の場面の立ち絵の Negative prompt（saeki_flushed・jogasaki_aroused・jogasaki_after）

この 3 枚では、Negative prompt は共通のものではなく、次を使います（共通のものに入っている `underwear, lingerie` を外し、はっきりしすぎる表現を防ぐ単語を足したもの）。

- 「はっきりしすぎない」ための指定は、**本文には書かず、この Negative prompt の欄だけに書きます**。本文に「no nudity」などと打ち消しで書くと、サイトの検査が単語そのものに反応して断られやすいためです。
- Negative prompt の欄がないモデルでは、何も足さずに本文だけで作ります。
- Negative prompt を入れて断られるときは、欄を空にして試します（欄の単語に反応するサイトもあるため）。

```
nsfw, explicit, nude, topless, nipples, exposed breasts, sex, lowres, bad anatomy, bad hands, extra fingers, missing fingers, deformed, blurry, text, watermark, signature, logo, username, jpeg artifacts, child, loli, green ambient light, green color spill, green glow
```

---

## 場面の絵 `images/scenes/`（横長 16:9）

監視カメラから見た絵には、次の一文が入っています。屋外の絵には入っていません。

> viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion

### ch1_reiko_look（玲子がカメラを見上げる）

```
Japanese anime style background art with characters, cinematic. Late night inside a luxury high-rise tower, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Dim, quiet, uneasy night lighting. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
Scene: the 9th-floor elevator hall in front of an exclusive members-only salon, with a potted plant. A beautiful woman with long wavy black hair in an off-the-shoulder wine-red evening gown is waiting for the elevator. She has just looked up directly into the security camera, meeting the viewer's eyes, with a faint, mysterious expression. Elegant and alluring, fully clothed.
```

### ch1_backyard_affair（バックヤードの密会）

```
Japanese anime style background art with characters, cinematic. Late night, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Very dim lighting, deep shadows. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
Scene: the cramped stockroom behind a luxury boutique, with stacks of cardboard boxes and metal shelves. In the shadow of the boxes, a man in a suit and a woman in a black boutique uniform are embracing closely, fully clothed. Their faces are hard to see in the darkness. A secret, hushed atmosphere.
```

### ch1_sena_mop（瀬名のモップがけ）

```
Japanese anime style background art with a character, cinematic. Late night inside a luxury high-rise tower, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Dim, quiet night lighting. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
Scene: a long, empty ground-floor corridor. A woman in a gray cleaning uniform with her hair tied back is mopping the floor. She has paused and is tracing a line on the wall with her fingertips, as if checking for cracks.
```

### ch1_backyard_confront（修羅場）

```
Japanese anime style background art with characters, cinematic. Late night, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Dim lighting, light spilling in from an open door. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
Scene: the stockroom behind a luxury boutique with cardboard boxes. A beautiful, stern woman with a curvy figure, a navy suit, long straight black hair worn down and thin-framed glasses stands in the open doorway, cold and furious. A man in a disheveled suit is panicking in front of her. A woman in a black boutique uniform is frozen against the wall, clutching her jacket to her chest. All fully clothed. A tense confrontation.
```

### ch1_monitor_room（監視室）

```
Japanese anime style background art with a character, cinematic, moody. A small, cramped basement security monitoring room late at night. A whole wall of glowing CCTV monitors is the only light, casting green light. Damp concrete walls. Seen from behind: a hunched man in a security guard's work uniform sits in front of the monitors holding a can of cold coffee. An empty second chair beside him. Lonely atmosphere. Horizontal 16:9. No text, no logo, no watermark.
```

### ch1_shop_card（ブランドショップ）

```
Japanese anime style background art with characters, cinematic. A high-end luxury brand boutique just before closing time, warm elegant lighting, designer handbags on the shelves, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no brand names, no logo, no watermark.
Scene: an elderly, distinguished man with neatly combed-back white hair, in an expensive suit, is handing a credit card over the counter without even looking at the price. The female shop manager with a chestnut bob, in a black uniform, is bowing deeply to him.
```

### ch1_lobby_bow（ロビーで頭を下げる）

```
Japanese anime style background art with characters, cinematic. The grand lobby of a luxury high-rise tower at night, marble floor, a reception counter, glass entrance doors, a TV on the wall, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Horizontal 16:9. No text, no logo, no watermark.
Scene: a younger man in a sharp suit stops in front of an elderly white-haired man in an expensive suit and bows deeply to him.
```

### ch1_office_couple（事務所の夫婦）

```
Japanese anime style background art with characters, cinematic. A law firm office at night, large windows with a glittering city night view, two desks, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no logo, no watermark.
Scene: at the far desk, a beautiful, stern woman with a curvy figure, a navy suit, long straight black hair worn down and thin-framed glasses is reading documents. A man in a suit bends low and obsequiously serves her a cup of coffee, rubbing his hands together.
```

### ch1_hanako_desk（深夜の華子）

```
Japanese anime style background art with a character, cinematic. A law firm office very late at night, only one desk lamp lit, a city night view through the windows, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no logo, no watermark.
Scene: a beautiful, stern woman with a curvy figure, a navy suit, long straight black hair worn down and thin-framed glasses sits alone at her desk, reading documents. The other desk is empty.
```

### ch1_shop_front（店の前の二人）

```
Japanese anime style illustration, cinematic, early evening. The entrance of a luxury brand boutique on the ground floor of a high-rise tower, warm light from the shop. Eye-level view. Horizontal 16:9. No text, no brand names, no logo, no watermark.
Scene: the shop manager, a glamorous woman with a chestnut bob in a black uniform, is laughing and chatting with an elegant woman with long wavy black hair in a wine-red off-the-shoulder evening gown (fully clothed). They look like close friends.
```

### ch1_elevator_close（エレベーターで締め出す）

```
Japanese anime style illustration, cinematic. Inside a plain service elevator of an office tower, seen from just outside the doors as they begin to close. Horizontal 16:9. No text, no logo, no watermark.
Scene: an arrogant man in an expensive suit stands inside and presses the "close door" button without even glancing at the viewer.
```

### ch1_street_phone（朝の歩道）

```
Japanese anime style illustration, cinematic. Early morning sidewalk in front of a gleaming luxury high-rise tower, harsh bright morning sunlight, eye-level view. Horizontal 16:9. No text, no logo, no watermark.
Scene: a man in an expensive suit walks toward the viewer while talking on his phone, with a smug, irritated expression.
```

### ch1_couple_morning（腕を組む二人）

```
Japanese anime style illustration, cinematic. Early morning sidewalk in front of a luxury high-rise tower, bright morning sunlight. Horizontal 16:9. No text, no logo, no watermark.
Scene: seen from behind, a man in a suit and a woman with a chestnut bob walk away arm in arm, laughing together.
```

### ch1_dawn_building（朝日のビル）

```
Japanese anime style background art, cinematic. Looking up at a gleaming glass luxury high-rise tower from its entrance, early morning, the rising sun blazing behind it, dazzling lens flare, the top of the building lost in the glare. Horizontal 16:9. No people. No text, no logo, no watermark.
```

### ch1_dropped_cans（転がった缶）

```
Japanese anime style illustration, cinematic, close-up. Early morning sidewalk in harsh sunlight. A dropped convenience-store plastic bag, a can of beer rolling across the pavement and a pack of sliced roast pork lying nearby. No people, nothing gory. A sense that something terrible just happened off-screen. Horizontal 16:9. No text, no logo, no watermark.
```

### ch1_office_police（朝の事務所と警察）

```
Japanese anime style background art with characters, cinematic. A law firm office in the early morning, lights on, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no logo, no watermark.
Scene: a dejected man in a suit, head hanging, is being escorted out of the office by a uniformed police officer. A beautiful, stern woman with a curvy figure, a navy suit, long straight black hair worn down and thin-framed glasses watches coldly.
```

### ch1_relay_sena_usb（机の脇の瀬名と USB）

```
Japanese anime style background art with a character, cinematic. A dark law firm office late at night, a city night view through the windows, viewed from a ceiling-mounted security camera in the corner, high angle. Horizontal 16:9. No text, no logo, no watermark.
Scene: a woman in a gray cleaning uniform with her hair tied back has stopped beside a desk. The desk's side panel is coming loose, and a small USB flash drive is visible in the gap. She is staring at it.
```

---

## カメラの背景 `images/bg/`（横長 16:9、人はいない）

どれも、次の共通の指示のあとに「Scene:」を付けます。

```
Japanese anime style background art, cinematic. Late night inside a luxury high-rise tower, viewed from a ceiling-mounted security camera in the corner, high angle, slight wide-angle lens distortion. Dim, quiet, uneasy night lighting. No people. Horizontal 16:9. No text, no timestamp, no logo, no watermark.
```

| ファイル名 | Scene |
|---|---|
| `cam00_room` | Scene: a small basement security monitoring room, a whole wall of glowing CCTV monitors, a long desk, two office chairs. |
| `cam01_lobby` | Scene: the grand marble lobby, a reception counter, glass entrance doors, a TV on the wall. |
| `cam02_shop` | Scene: a closed luxury brand boutique, designer handbags on shelves, a cash register counter, no brand names. |
| `cam03_corridor` | Scene: a long ground-floor corridor going into the distance, a red fire alarm bell on the left wall, a small security sensor on the ceiling on the right. |
| `cam04_backyard` | Scene: the cramped stockroom behind a boutique, stacks of cardboard boxes, metal shelves, a door at the back, a red fire alarm bell on the wall. |
| `cam05_elevator` | Scene: the inside of an elevator car, a floor indicator display panel near the ceiling, a handrail. |
| `cam06_evhall6` | Scene: a 6th-floor elevator hall of an office floor, elevator doors with a floor indicator above them. |
| `cam07_office` | Scene: a law firm office, large windows with a city night view, two desks with phones, a speaker in the ceiling. |
| `cam08_evhall9` | Scene: a 9th-floor elevator hall in front of the entrance of an exclusive members-only salon, a potted plant, elegant decor. |
| `cam09_roof` | Scene: the rooftop of the tower at night, a railing, a water tank, the night sky and city lights. |
| `cam10_stairs` | Scene: an emergency staircase, lit only by a green emergency exit sign. |

---

## Stable Diffusion 系のサイト向け

「Prompt」と「Negative prompt」を分けて入れるサイトでは、文章のプロンプトの代わりに、次のような単語を並べる書き方も効きます。

### 立ち絵の例（玲子）

Prompt:

```
masterpiece, best quality, anime style, visual novel sprite, 1girl, solo, mature female, 34 years old, long black hair, wavy hair, side-swept hair, violet eyes, half-closed eyes, long eyelashes, red lips, mole under mouth, off-shoulder evening gown, wine red dress, gold necklace, drop earrings, elegant, alluring, cowboy shot, looking at viewer, light smile, simple background, green background, chroma key green, flat color background, no shadows
```

Negative prompt（すべての絵で共通。最後の `green …` の 3 つは、立ち絵の背景の緑が人物に移らないようにするため）:

```
nsfw, nude, nipples, underwear, lingerie, cleavage cutout, lowres, bad anatomy, bad hands, extra fingers, missing fingers, deformed, blurry, text, watermark, signature, logo, username, jpeg artifacts, child, loli, green ambient light, green color spill, green glow
```

- 人物を変えるときは、`1girl` 以下の見た目の単語を、上の各人物の英語の説明から拾って並べ替えます（例: 佐伯は `chestnut hair, bob cut, curled hair, winged eyeliner, black blazer, pencil skirt, silk scarf`）。
- 男性は `1boy, mature male` にします。
- 場面の絵は、`from above, security camera view, fisheye, night, dim lighting, scenery` を足し、`simple background` 以降（緑の背景の指定）を消します。
