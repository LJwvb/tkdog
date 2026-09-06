import { ref, computed, nextTick, onUnmounted, type Ref } from 'vue';
import { getTableScrollBody } from '@/utils';

/**
 * el-table 内置滚动场景下的「分页 + 滚动追加 + 自动补屏」通用逻辑。
 *
 * 解决了 8+ 管理页面重复的 getTableScrollBody / scroll 监听 / setTimeout 补屏 /
 * loading & loadingMore 互锁 / 总条数更新等漂移问题。
 *
 * 调用方只需：
 *   1. 提供 fetcher（闭包内自带搜索/排序参数，每次 reset 后用最新值）；
 *   2. 在模板里把 tableRef 绑给 <el-table ref="tableRef">；
 *   3. 业务侧搜索/排序改变时调用 reset()，会自动重置页码并刷新。
 */
export function useInfiniteTable<Item>(
  fetcher: (params: {
    currentPage: number;
    pageSize: number;
  }) => Promise<{ result?: Item[]; total?: number } | null>,
  options: {
    pageSize?: number;
    tableRef?: Ref<{ $el?: HTMLElement } | null | undefined>;
    threshold?: number;
  } = {},
) {
  const { pageSize: initPageSize = 20, tableRef, threshold = 50 } = options;

  const list = ref<Item[]>([]) as Ref<Item[]>;
  const total = ref(0);
  const currentPage = ref(1);
  // 整表蒙层：只在「首次加载 / 切 tab / 重置」时打开，滚动追加不闪蒙层
  const loading = ref(false);
  // 滚动追加中的局部守卫：避免重复触发 + 与 loading 互不干扰
  const loadingMore = ref(false);
  const noMore = computed(
    () => total.value > 0 && list.value.length >= total.value,
  );

  let scrollEl: HTMLElement | null = null;
  const onScroll = () => {
    if (!scrollEl || loadingMore.value || loading.value || noMore.value) return;
    const { scrollTop, clientHeight, scrollHeight } = scrollEl;
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      void loadMore();
    }
  };

  const bindScroll = () => {
    unbindScroll();
    scrollEl = getTableScrollBody(tableRef?.value as never);
    if (scrollEl) scrollEl.addEventListener('scroll', onScroll);
  };
  const unbindScroll = () => {
    if (scrollEl) {
      scrollEl.removeEventListener('scroll', onScroll);
      scrollEl = null;
    }
  };

  /**
   * 内容不足一屏时继续加载下一页，直到出现滚动条或加载完。
   * 用 setTimeout(50) 让 el-table 完成布局后再读取 clientHeight，否则首屏常被错判「已满」。
   */
  const fillViewport = async () => {
    if (noMore.value || loadingMore.value || loading.value) return;
    await nextTick();
    setTimeout(() => {
      const el = scrollEl || getTableScrollBody(tableRef?.value as never);
      if (!el) return;
      if (el.scrollHeight <= el.clientHeight + 10) {
        void loadMore();
      } else if (!scrollEl) {
        bindScroll();
      }
    }, 50);
  };

  const loadMore = async (): Promise<void> => {
    if (loadingMore.value || noMore.value) return;
    loadingMore.value = true;
    try {
      currentPage.value += 1;
      const res = await fetcher({
        currentPage: currentPage.value,
        pageSize: initPageSize,
      });
      const rows = res?.result ?? [];
      list.value = [...list.value, ...rows];
      total.value = res?.total ?? 0;
      await fillViewport();
    } catch (err) {
      currentPage.value -= 1;
      // eslint-disable-next-line no-console
      console.error('useInfiniteTable loadMore error:', err);
    } finally {
      loadingMore.value = false;
      loading.value = false;
    }
  };

  /** 首次加载 / 切 tab / 搜索后：清空数据并重置页码 */
  const reset = async (): Promise<void> => {
    currentPage.value = 0;
    list.value = [];
    total.value = 0;
    loading.value = true;
    await loadMore();
    bindScroll();
  };

  onUnmounted(unbindScroll);

  return {
    list,
    total,
    currentPage,
    loading,
    loadingMore,
    noMore,
    loadMore,
    reset,
    bindScroll,
    unbindScroll,
  };
}
