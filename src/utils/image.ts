/**
 * 纯前端图片压缩工具（不引入第三方库，走 canvas 重编码）。
 * 使用场景：头像这类展示尺寸很小、但对体积敏感的图片，
 * 原图动辄 2~5MB，直接上传+回显会白等好几秒、也多占服务器带宽。
 */

/** 头像压缩后的最长边（px）：头像最大展示尺寸 80px，3 倍屏也只有 240px */
export const AVATAR_MAX_EDGE = 256;
/** 重编码质量：视觉上几乎无损，体积约为原图的 1/10 */
const DEFAULT_QUALITY = 0.85;
/** 原图尺寸未超限且体积已小于该值时，不再重编码（避免越压越大） */
const SKIP_BYTES = 100 * 1024;

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
 * 把图片压到「最长边不超过 maxEdge」并重新编码。
 * - GIF / WebP 直接原样返回：canvas 会把动图压成只剩一帧
 * - 尺寸没超限且体积已经很小、或压缩后反而更大时，返回原文件
 * - 不支持 webp 编码的浏览器回退成 JPEG，并先铺白底（JPEG 不支持透明）
 */
export async function compressImage(
  file: File,
  maxEdge = AVATAR_MAX_EDGE,
  quality = DEFAULT_QUALITY,
): Promise<File> {
  if (file.type === 'image/gif' || file.type === 'image/webp') return file;

  const img = await loadImage(file);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  if (!width || !height) return file;

  const scale = Math.min(1, maxEdge / Math.max(width, height));
  if (scale === 1 && file.size <= SKIP_BYTES) return file;

  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  const useWebp = await canEncodeWebp();
  if (!useWebp) {
    // 回退 JPEG 时先铺白底，否则 png 的透明区域会变成黑块
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const mime = useWebp ? 'image/webp' : 'image/jpeg';
  const ext = useWebp ? 'webp' : 'jpg';
  const blob = await canvasToBlob(canvas, mime, quality);
  if (!blob || blob.size >= file.size) return file;
  // 文件名只用扩展名有意义（后端按后缀判断格式、并自己重命名），这里给个纯 ASCII 名
  return new File([blob], `image_${Date.now()}.${ext}`, { type: mime });
}
