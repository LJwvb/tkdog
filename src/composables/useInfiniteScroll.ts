import { ref, onMounted, onUnmounted, type Ref } from 'vue';

/**
 * 无限滚动 composable
 * @param loadMore 加载更多数据的函数，返回是否还有更多数据
 * @param options 配置选项
 */
export function useInfiniteScroll(
  loadMore: (page: number, pageSize: number) => Promise<boolean>,
  options: {
    threshold?: number; // 触发加载的距离阈值（px），默认 100
    pageSize?: number; // 每页条数，默认 20
    immediate?: boolean; // 是否立即加载第一页，默认 true
  } = {},
) {
  const { threshold = 100, pageSize = 20, immediate = true } = options;

  const list = ref<any[]>([]);
  const loading = ref(false);
  const finished = ref(false);
  const error = ref(false);
  const currentPage = ref(0);
  const total = ref(0);

  let scrollContainer: HTMLElement | Window | null = null;
  let scrollHandler: (() => void) | null = null;

  const loadData = async (reset = false) => {
    if (loading.value || (finished.value && !reset)) return;

    if (reset) {
      currentPage.value = 0;
      list.value = [];
      finished.value = false;
      error.value = false;
    }

    loading.value = true;
    error.value = false;

    try {
      currentPage.value += 1;
      const hasMore = await loadMore(currentPage.value, pageSize);
      finished.value = !hasMore;
    } catch (e) {
      console.error('Infinite scroll load error:', e);
      error.value = true;
      currentPage.value -= 1; // 回退页码
    } finally {
      loading.value = false;
    }
  };

  const handleScroll = () => {
    if (!scrollContainer || loading.value || finished.value || error.value)
      return;

    let scrollTop: number;
    let scrollHeight: number;
    let clientHeight: number;

    if (scrollContainer === window) {
      scrollTop = window.scrollY || document.documentElement.scrollTop;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = window.innerHeight;
    } else {
      const el = scrollContainer as HTMLElement;
      scrollTop = el.scrollTop;
      scrollHeight = el.scrollHeight;
      clientHeight = el.clientHeight;
    }

    // 滚动到底部附近时触发加载
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadData();
    }
  };

  const setupScrollListener = (
    container?: HTMLElement | Ref<HTMLElement | null>,
  ) => {
    // 先移除旧的监听
    removeScrollListener();

    if (container) {
      const el = container instanceof HTMLElement ? container : container.value;
      if (el) {
        scrollContainer = el;
        scrollHandler = handleScroll;
        el.addEventListener('scroll', scrollHandler, { passive: true });
      }
    } else {
      scrollContainer = window;
      scrollHandler = handleScroll;
      window.addEventListener('scroll', scrollHandler, { passive: true });
    }
  };

  const removeScrollListener = () => {
    if (scrollHandler && scrollContainer) {
      if (scrollContainer === window) {
        window.removeEventListener('scroll', scrollHandler);
      } else {
        (scrollContainer as HTMLElement).removeEventListener(
          'scroll',
          scrollHandler,
        );
      }
    }
    scrollHandler = null;
    scrollContainer = null;
  };

  const reset = () => {
    loadData(true);
  };

  onMounted(() => {
    if (immediate) {
      loadData();
    }
  });

  onUnmounted(() => {
    removeScrollListener();
  });

  return {
    list,
    loading,
    finished,
    error,
    currentPage,
    total,
    loadData,
    reset,
    setupScrollListener,
  };
}
