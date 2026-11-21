'use strict';
/* ===================================================================
   立ち絵の PNG を、透明を残したまま WebP にする（ファイルを小さくして、公開サイトでの読み込みを速くする）
   使い方: node tools/portraits_to_webp.js
     1. このスクリプトが、小さなサーバーを http://127.0.0.1:8766/ で立てる
     2. 表示された URL をブラウザで開くと、ブラウザが game/assets/chars/*.png を WebP に変換して送り返す
     3. 送り返された WebP を game/assets/chars/ に保存し、終わったらサーバーを止める
   - 変換はブラウザ（Canvas の toBlob）が行うので、ほかのインストールは不要
   - PNG は消さない。WebP を確かめてから、data/characters.js のパスを .webp にして、PNG を消す
   =================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8766;
const QUALITY = 0.86;   // WebP の画質（0〜1）
const DIR = path.join(__dirname, '..', 'game', 'assets', 'chars');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png'));

const page = `<!doctype html><meta charset="utf-8"><title>立ち絵を WebP に</title>
<pre id="log">変換しています…\n</pre>
<script>
const files = ${JSON.stringify(files)};
const log = (s) => { document.getElementById('log').textContent += s + '\\n'; };
(async () => {
  for (const f of files) {
    const img = new Image();
    img.src = '/png/' + encodeURIComponent(f);
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    const blob = await new Promise((r) => c.toBlob(r, 'image/webp', ${QUALITY}));
    if (!blob || blob.type !== 'image/webp') { log('NG（このブラウザは WebP に書き出せません）: ' + f); continue; }
    const res = await fetch('/save/' + encodeURIComponent(f.replace(/\\.png$/, '.webp')), { method: 'POST', body: blob });
    log((res.ok ? 'OK ' : 'NG ') + f + ' → ' + Math.round(blob.size / 1024) + 'KB');
  }
  await fetch('/done', { method: 'POST' });
  log('終わりました。このタブは閉じてかまいません。');
})();
</script>`;

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url);
  if (req.method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
  } else if (req.method === 'GET' && url.startsWith('/png/')) {
    const name = path.basename(url.slice(5));
    if (!files.includes(name)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': 'image/png' });
    fs.createReadStream(path.join(DIR, name)).pipe(res);
  } else if (req.method === 'POST' && url.startsWith('/save/')) {
    const name = path.basename(url.slice(6));
    if (!/^[\w-]+\.webp$/.test(name)) { res.writeHead(400); res.end(); return; }
    const chunks = [];
    req.on('data', (d) => chunks.push(d));
    req.on('end', () => {
      fs.writeFileSync(path.join(DIR, name), Buffer.concat(chunks));
      res.writeHead(200); res.end();
    });
  } else if (req.method === 'POST' && url === '/done') {
    res.writeHead(200); res.end();
    console.log('変換が終わりました。');
    server.close();
  } else {
    res.writeHead(404); res.end();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`立ち絵 ${files.length} 枚を WebP にします。ブラウザで http://127.0.0.1:${PORT}/ を開いてください。`);
});
