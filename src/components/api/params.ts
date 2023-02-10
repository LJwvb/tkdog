interface Params {
  currentPage?: number; //可选属性
  readonly pageSize: number; //只读属性
  subjectID?: number;
  catalogID?: number;
}
//当前页(分页逻辑)
//每页条数(规定值：5)
//科目ID(1-12)
//目录ID(1:最热,2:最新,3:精选,4:最多收藏,5:最多被考)
export const params: Params = {
  currentPage: 0,
  pageSize: 5,
  subjectID: 1,
  catalogID: 1,
};
