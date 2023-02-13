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
      return '最热';
    case 1:
      return '最新';
    case 2:
      return '精选';
    case 3:
      return '其他';
    default:
      return '未知';
  }
};
