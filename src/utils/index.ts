import queryString from 'query-string';
import { nextTick, onMounted, onActivated } from 'vue';

export const queryObj = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);

export const questionType = (questionType: number) => {
  switch (questionType) {
    case 0:
      return '单选题';
    case 1:
      return '多选题';
    case 2:
      return '判断题';
    case 3:
      return '简答题';
    default:
      return '未知';
  }
};
export const difficulty = (difficulty: number) => {
  switch (difficulty) {
    case 0:
      return '简单';
    case 1:
      return '中等';
    case 2:
      return '困难';
    default:
      return '未知';
  }
};

export const catalogIDType = (catalogID: number) => {
  switch (catalogID) {
    case 0:
      return {
        name: '最热',
        color: '#f50e0e',
      };
    case 1:
      return {
        name: '最新',
        color: '#67C23A',
      };
    case 2:
      return {
        name: '精选',
        color: '#CD7F32',
      };
    default:
      return {
        name: '未知',
        color: '#000',
      };
  }
};
export const transitionTime = (addDate: string) => {
  if (!addDate) return '';
  const date = new Date(addDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
export const transitionSex = (sex: unknown) => {
  const sexVal = Number(sex);
  if (sexVal === 0) {
    return '女';
  }
  if (sexVal === 1) {
    return '男';
  }
  return '未知';
};
export const isNaN = (value: any) => {
  return value !== value;
};
// ==== isNumber  函数====
const toString = Object.prototype.toString;
export function is(val: any, type: string) {
  return toString.call(val) === `[object ${type}]`;
}
export function isNumber(val: any) {
  return is(val, 'Number');
}

// ==== buildShortUUID  函数====
export function buildShortUUID(prefix = '') {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);

  return prefix + '_' + random + String(time);
}

// ==== onMountedOrActivated  hook====
export function onMountedOrActivated(hook: () => void) {
  let mounted: boolean;
  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    });
  });
  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}
