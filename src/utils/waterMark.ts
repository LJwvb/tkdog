const WATERMARK_ID = '1.23452384164.123412415';

const createWatermarkDom = (str1: string, str2: string): string => {
  if (document.getElementById(WATERMARK_ID) !== null) {
    document.body.removeChild(
      document.getElementById(WATERMARK_ID) as HTMLElement,
    );
  }
  const can: HTMLCanvasElement = document.createElement('canvas');
  can.width = 250;
  can.height = 250;
  const cans = can.getContext('2d');
  if (!cans) return WATERMARK_ID;
  cans.rotate((-20 * Math.PI) / 180);
  cans.font = '16px Vedana';
  cans.fillStyle = '#666666';
  cans.textAlign = 'center';
  cans.textBaseline = 'middle';
  cans.fillText(str1, can.width / 2, can.height);
  cans.fillText(str2, can.width / 2, can.height + 22);
  const div = document.createElement('div');
  div.id = WATERMARK_ID;
  div.style.pointerEvents = 'none';
  div.style.top = '40px';
  div.style.left = '0px';
  div.style.opacity = '0.15';
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.width = document.documentElement.clientWidth + 'px';
  div.style.height = document.documentElement.clientHeight + 'px';
  div.style.background =
    'url(' + can.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div);
  return WATERMARK_ID;
};

// 添加水印方法
export const setWaterMark = (str1: string, str2: string) => {
  let id = createWatermarkDom(str1, str2);
  if (document.getElementById(id) === null) {
    id = createWatermarkDom(str1, str2);
  }
};

// 移除水印方法
export const removeWatermark = () => {
  if (document.getElementById(WATERMARK_ID) !== null) {
    document.body.removeChild(
      document.getElementById(WATERMARK_ID) as HTMLElement,
    );
  }
};
