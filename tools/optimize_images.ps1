# 絵の元ファイルを、ゲームで使う大きさと形式に変えて game/assets/ に書き出す
#
# 使い方（リポジトリ直下で）:
#   ./tools/optimize_images.ps1
#
# - 元ファイル: assets_src/images/chars/  … 立ち絵（緑一色・青一色・白の背景なら、背景を自動で透明にする。透明な PNG ならそのまま）
#               assets_src/images/scenes/ … 場面の絵（16:9）
#               assets_src/images/bg/     … カメラの背景（16:9、人のいない絵）
# - 書き出し先: game/assets/chars/*.png（高さ 1200px まで）
#               game/assets/scenes/*.jpg・game/assets/bg/*.jpg（1280x720 に切り抜き、画質 82）
# - ファイル名は、元ファイルの名前（拡張子を除く）をそのまま使う。
# - Windows に入っている .NET の画像の機能（System.Drawing）だけを使う。インストールは要らない。

param(
    [string]$Src = "assets_src/images",
    [string]$Dst = "game/assets"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

# 単色の背景を透明にする処理（グリーンバック・ブルーバック・白い背景）
# - 画素ごとの処理は PowerShell では遅いので、C# で書く（.NET に入っている機能だけを使う）
# - 処理を書き換えたら、クラス名の末尾の数字を上げる（同じ PowerShell の中では、同じ名前のクラスを作り直せないため）
# - 背景の色は、画像の上の 2 つの隅の色から決める（下の隅は、人物の体や服がかかりやすいため）
# - 背景の色に近い画素を、画像のふちからたどって消す。人物に囲まれた背景（髪のすき間など）も消す
# - 消したところのそばの画素は、背景の色との近さに応じて半透明にし、映り込んだ緑（青）みを取る
if (-not ("KeyBackground5" -as [type])) {
    Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class KeyBackground5 {
    static int br, bg, bb, mode;
    // 0: なし / 1: 緑 / 2: 青 / 3: 白
    static int Kind(Color k) {
        int r = k.R, g = k.G, b = k.B;
        if (g >= 100 && g - Math.Max(r, b) >= 40) return 1;
        if (b >= 100 && b - Math.Max(r, g) >= 40) return 2;
        int mx = Math.Max(r, Math.Max(g, b)), mn = Math.Min(r, Math.Min(g, b));
        if (mn > 225 && mx - mn < 22) return 3;
        return 0;
    }
    // 背景の色を決める。決まれば 1〜3、単色の背景でなければ 0
    public static int DetectMode(Bitmap bmp) {
        Point[] cs = { new Point(3, 3), new Point(bmp.Width - 4, 3), new Point(bmp.Width / 4, 3), new Point(bmp.Width * 3 / 4, 3) };
        int m0 = -1, sr = 0, sg = 0, sb = 0, n = 0;
        foreach (Point c in cs) {
            Color k = bmp.GetPixel(c.X, c.Y);
            if (k.A < 250) return 0;
            int m = Kind(k);
            if (m == 0) continue;            // 頭が上のふちにかかっているところは数えない
            if (m0 >= 0 && m != m0) return 0;
            m0 = m; sr += k.R; sg += k.G; sb += k.B; n++;
        }
        if (n < 2) return 0;
        br = sr / n; bg = sg / n; bb = sb / n; mode = m0;
        return m0;
    }
    // その画素が、どれだけ背景の色か（0 = 人物、1 = 完全に背景）。背景の色との距離で決める
    static double Key(byte[] p, int i) {
        int b = p[i], g = p[i + 1], r = p[i + 2];
        if (mode == 3) {
            // 白い背景: 肌の明るいところを消さないよう、ほぼ真っ白で色みのない画素だけを背景にする
            int mn = Math.Min(r, Math.Min(g, b)), mx = Math.Max(r, Math.Max(g, b));
            return (mx - mn < 20) ? Clamp01((mn - 175) / 60.0) : 0;
        }
        double dist = Math.Sqrt((r - br) * (r - br) + (g - bg) * (g - bg) + (b - bb) * (b - bb));
        double k = 1 - (dist - 45) / 75.0;
        if (mode == 1 && g <= Math.Max(r, b)) k = Math.Min(k, 0);   // 緑みのない画素は人物
        if (mode == 2 && b <= Math.Max(r, g)) k = Math.Min(k, 0);
        return Clamp01(k);
    }
    static double Clamp01(double v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
    public static void Remove(Bitmap bmp, int unused) {
        int w = bmp.Width, h = bmp.Height;
        BitmapData d = bmp.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        byte[] p = new byte[d.Stride * h];
        Marshal.Copy(d.Scan0, p, 0, p.Length);
        int stride = d.Stride;
        double th = mode == 3 ? 0.9 : 0.85;
        Func<int, bool> isBg = k => Key(p, (k / w) * stride + (k % w) * 4) >= th;
        bool[] gone = new bool[w * h];
        // 1) ふちからたどる
        Queue<int> q = new Queue<int>();
        Action<int> push = k => { if (!gone[k] && isBg(k)) { gone[k] = true; q.Enqueue(k); } };
        for (int x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
        for (int y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
        while (q.Count > 0) {
            int k = q.Dequeue(); int x = k % w, y = k / w;
            if (x > 0) push(k - 1); if (x < w - 1) push(k + 1);
            if (y > 0) push(k - w); if (y < h - 1) push(k + w);
        }
        // 2) 人物に囲まれた背景も消す。白い背景のときだけは、白目などを残すため、ある程度大きい部分に限る
        int minArea = mode == 3 ? Math.Max(300, w * h / 2500) : 12;
        bool[] seen = new bool[w * h];
        for (int s0 = 0; s0 < w * h; s0++) {
            if (gone[s0] || seen[s0] || !isBg(s0)) continue;
            List<int> comp = new List<int>();
            Queue<int> cq = new Queue<int>();
            seen[s0] = true; cq.Enqueue(s0);
            while (cq.Count > 0) {
                int k = cq.Dequeue(); comp.Add(k);
                int x = k % w, y = k / w;
                int[] ns = { x > 0 ? k - 1 : -1, x < w - 1 ? k + 1 : -1, y > 0 ? k - w : -1, y < h - 1 ? k + w : -1 };
                foreach (int n in ns) {
                    if (n < 0 || seen[n] || gone[n] || !isBg(n)) continue;
                    seen[n] = true; cq.Enqueue(n);
                }
            }
            if (comp.Count >= minArea) foreach (int k in comp) gone[k] = true;
        }
        // 3) 透明にする。消したところから 3 画素以内は、背景の色との近さで半透明にし、緑（青）みを取る
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
            int k = y * w + x, i = y * stride + x * 4;
            if (gone[k]) { p[i + 3] = 0; continue; }
            bool near = false;
            for (int dy = -3; dy <= 3 && !near; dy++) for (int dx = -3; dx <= 3 && !near; dx++) {
                int nx = x + dx, ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < w && ny < h && gone[ny * w + nx]) near = true;
            }
            if (!near) continue;
            double key = Key(p, i);
            p[i + 3] = (byte)(255 * (1 - key));
            if (mode == 1 && p[i + 1] > Math.Max(p[i], p[i + 2])) p[i + 1] = Math.Max(p[i], p[i + 2]);
            if (mode == 2 && p[i] > Math.Max(p[i + 1], p[i + 2])) p[i] = Math.Max(p[i + 1], p[i + 2]);
        }
        Marshal.Copy(p, 0, d.Scan0, p.Length);
        bmp.UnlockBits(d);
    }
}
"@
}

function New-Canvas([int]$cw, [int]$ch, [bool]$alpha) {
    $fmt = if ($alpha) { [System.Drawing.Imaging.PixelFormat]::Format32bppArgb } else { [System.Drawing.Imaging.PixelFormat]::Format24bppRgb }
    $bmp = New-Object System.Drawing.Bitmap $cw, $ch, $fmt
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    return @($bmp, $g)
}

# 立ち絵: 縦横比はそのまま、高さを 1200px までに縮める。透明はそのまま残す
function Convert-Portrait([string]$in, [string]$out) {
    $img = [System.Drawing.Image]::FromFile((Resolve-Path $in))
    try {
        $k = [Math]::Min(1.0, 1200.0 / $img.Height)
        $outW = [int]($img.Width * $k); $outH = [int]($img.Height * $k)
        $bmp, $g = New-Canvas $outW $outH $true
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.DrawImage($img, 0, 0, $outW, $outH)
        # 背景が単色（四隅が緑・青・白）なら、背景を透明にする
        $mode = [KeyBackground5]::DetectMode($bmp)
        if ($mode -gt 0) {
            [KeyBackground5]::Remove($bmp, $mode)
            $names = @{ 1 = "緑"; 2 = "青"; 3 = "白" }
            Write-Output "  $($names[$mode])の背景を透明にしました: $([System.IO.Path]::GetFileName($in))"
        }
        $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
        $g.Dispose(); $bmp.Dispose()
    } finally { $img.Dispose() }
}

# 場面・背景: 16:9 になるよう真ん中を切り抜いて 1280x720 にし、JPEG で保存する
function Convert-Wide([string]$in, [string]$out) {
    $img = [System.Drawing.Image]::FromFile((Resolve-Path $in))
    try {
        # PowerShell の変数は大文字と小文字を区別しないので、名前を分ける
        $outW = 1280; $outH = 720
        $k = [Math]::Max($outW / $img.Width, $outH / $img.Height)
        $drawW = $img.Width * $k; $drawH = $img.Height * $k
        $bmp, $g = New-Canvas $outW $outH $false
        $g.DrawImage($img, [single](($outW - $drawW) / 2), [single](($outH - $drawH) / 2), [single]$drawW, [single]$drawH)
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $params = New-Object System.Drawing.Imaging.EncoderParameters 1
        $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 82L
        $bmp.Save($out, $codec, $params)
        $g.Dispose(); $bmp.Dispose()
    } finally { $img.Dispose() }
}

$kinds = @(
    @{ Name = "chars"; Ext = ".png"; Fn = "Convert-Portrait" },
    @{ Name = "scenes"; Ext = ".jpg"; Fn = "Convert-Wide" },
    @{ Name = "bg"; Ext = ".jpg"; Fn = "Convert-Wide" }
)

$count = 0
foreach ($k in $kinds) {
    $dir = Join-Path $Src $k.Name
    if (-not (Test-Path $dir)) { continue }
    $outDir = Join-Path $Dst $k.Name
    New-Item -ItemType Directory -Force $outDir | Out-Null
    Get-ChildItem $dir -File | Where-Object { $_.Extension -match '^\.(png|jpe?g|bmp)$' } | ForEach-Object {
        $out = Join-Path (Resolve-Path $outDir) ($_.BaseName + $k.Ext)
        & $k.Fn $_.FullName $out
        $kb = [int]((Get-Item $out).Length / 1024)
        Write-Output ("{0}/{1}{2}  ({3} KB)" -f $k.Name, $_.BaseName, $k.Ext, $kb)
        $count++
    }
}
Write-Output "書き出した数: $count"
