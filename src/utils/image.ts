/**
 * 纯前端图片处理工具（不引入第三方库，走 canvas 重编码）。
 * 本站所有上传图片统一存 webp（唯一例外是 GIF 动图，canvas 会把它压成只剩一帧）：
 * - 头像：先压到长边 256 再上传（展示尺寸最大 80px，原图 2~5MB 纯属浪费）；
 * - 评论图：只转格式、不缩放，画质 q0.9，兼顾体积与清晰度；
 * - 浏览器不支持 webp 编码（Safari 14 以下）时原样上传，由后端 sharp 兜底转码。
 */

/** 头像压缩后的最长边（px）：头像最大展示尺寸 80px，3 倍屏也只有 240px */
export const AVATAR_MAX_EDGE = 256;
/** 头像重编码质量：视觉上几乎无损，体积约为原图的 1/10 */
const DEFAULT_QUALITY = 0.85;
/** 评论图等原尺寸图片的重编码质量（不缩放，质量给高一点） */
const FULLSIZE_QUALITY = 0.9;

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片读取失败，请换一张试试'));
    };
    // 现代浏览器的 <img> 会自动按 EXIF 方向摆正，这里不必再手动处理旋转
    img.src = url;
  });

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

// 浏览器能否编码 webp（Safari 14 以下不能）：只探测一次，结果缓存
let webpEncodeSupported: boolean | null = null;
const canEncodeWebp = async (): Promise<boolean> => {
  if (webpEncodeSupported === null) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const blob = await canvasToBlob(canvas, 'image/webp', 0.8);
    // 不支持 webp 编码时，toBlob 会静默回退成 image/png，所以要比对返回的 type
    webpEncodeSupported = !!blob && blob.type === 'image/webp';
  }
  return webpEncodeSupported;
};

/**
 * 把图片重新编码成 webp（可选缩放）。
 * - GIF / 已是 webp：原样返回（GIF 是唯一例外，动图会被 canvas 压成静帧）
 * - maxEdge <= 0：不缩放，只换格式（评论图走这条）
 * - 浏览器不支持 webp 编码、读图失败或编码失败：原样返回，交给后端 sharp 兜底
 */
export async function toWebp(
  file: File,
  options: { maxEdge?: number; quality?: number } = {},
): Promise<File> {
  const { maxEdge = 0, quality = FULLSIZE_QUALITY } = options;
  if (file.type === 'image/gif' || file.type === 'image/webp') return file;
  if (!(await canEncodeWebp())) return file;

  const img = await loadImage(file);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  if (!width || !height) return file;

  const scale = maxEdge > 0 ? Math.min(1, maxEdge / Math.max(width, height)) : 1;
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const blob = await canvasToBlob(canvas, 'image/webp', quality);
  if (!blob) return file;
  // 文件名只用扩展名有意义（后端按后缀与文件头判断格式、并自己重命名），这里给个纯 ASCII 名
  return new File([blob], `image_${Date.now()}.webp`, { type: 'image/webp' });
}

/**
 * 头像专用：压到「最长边不超过 maxEdge」并转 webp。
 * 头像最大展示 80px（3 倍屏 240px），256 足够；线上曾出现 4.7MB 的头像文件。
 */
export async function compressImage(
  file: File,
  maxEdge = AVATAR_MAX_EDGE,
  quality = DEFAULT_QUALITY,
): Promise<File> {
  return toWebp(file, { maxEdge, quality });
}
