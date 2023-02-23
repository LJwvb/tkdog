import queryString from 'query-string';

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
      return '填空题';
    case 4:
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
  const date = new Date(addDate);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
export const isNaN = (value: any) => {
  return value !== value;
};
