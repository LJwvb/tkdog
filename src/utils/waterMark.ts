const WATERMARK_ID = '1.23452384164.123412415';

// MutationObserver 实例：监听水印节点被删除/篡改后自动重绘
let watermarkObserver: MutationObserver | null = null;
// 最近一次绘制参数，防篡改重绘时使用
let lastWatermarkArgs: { str1: string; str2: string } | null = null;
// 防切屏回调（在线考试等场景传入，如切屏次数统计/告警）
let onScreenSwitch: ((event: Event) => void) | null = null;
let visibilityListener: ((event: Event) => void) | null = null;

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

/**
 * 启动防作弊守护：
 * 1. MutationObserver 监听水印 DOM——被删除或样式被篡改（改 id/挪出视口/隐藏）时自动重绘，
 *    且重绘由 flag 保护不会触发观察器死循环；
 * 2. （可选）visibilitychange 监听切屏，考试场景传入回调做切屏计数/告警。
 */
const startWatermarkGuard = () => {
  // 防止重复注册
  stopWatermarkGuard();

  watermarkObserver = new MutationObserver(() => {
    const el = document.getElementById(WATERMARK_ID);
    const tampered =
      !el ||
      el.style.display === 'none' ||
      el.style.visibility === 'hidden' ||
      el.style.opacity === '0' ||
      Number(el.style.zIndex || 0) < 0;
    if (tampered && lastWatermarkArgs) {
      createWatermarkDom(lastWatermarkArgs.str1, lastWatermarkArgs.str2);
    }
  });
  watermarkObserver.observe(document.body, {
    childList: true, // 监听节点删除
    subtree: false,
  });

  if (onScreenSwitch) {
    visibilityListener = (event: Event) => {
      if (document.hidden) onScreenSwitch?.(event);
    };
    document.addEventListener('visibilitychange', visibilityListener);
  }
};

const stopWatermarkGuard = () => {
  if (watermarkObserver) {
    watermarkObserver.disconnect();
    watermarkObserver = null;
  }
  if (visibilityListener) {
    document.removeEventListener('visibilitychange', visibilityListener);
    visibilityListener = null;
  }
};

interface WatermarkOptions {
  // 切屏回调：document 进入隐藏状态（切到别的标签页/最小化）时触发
  onScreenSwitch?: (event: Event) => void;
}

// 添加水印方法
export const setWaterMark = (
  str1: string,
  str2: string,
  options: WatermarkOptions = {},
) => {
  lastWatermarkArgs = { str1, str2 };
  onScreenSwitch = options.onScreenSwitch || null;
  let id = createWatermarkDom(str1, str2);
  if (document.getElementById(id) === null) {
    id = createWatermarkDom(str1, str2);
  }
  startWatermarkGuard();
};

// 移除水印方法（同时断开守护，避免移除后被自动重绘）
export const removeWatermark = () => {
  stopWatermarkGuard();
  lastWatermarkArgs = null;
  onScreenSwitch = null;
  if (document.getElementById(WATERMARK_ID) !== null) {
    document.body.removeChild(
      document.getElementById(WATERMARK_ID) as HTMLElement,
    );
  }
};
