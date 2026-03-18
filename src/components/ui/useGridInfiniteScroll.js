import { useEffect } from 'react';

export default function useGridInfiniteScroll({
  viewportRef,
  loading,
  loadingRef,
  hasNext,
  onLoadMore,
  threshold = 80,
}) {
  useEffect(() => {
    const viewport = viewportRef?.current;
    if (!viewport) return undefined;

    const scrollElement = viewport.querySelector('.wx-scroll');
    if (!scrollElement) return undefined;

    const handleGridScroll = () => {
      if (loading || loadingRef?.current || !hasNext) return;

      const remain =
        scrollElement.scrollHeight -
        scrollElement.scrollTop -
        scrollElement.clientHeight;

      if (remain <= threshold) {
        onLoadMore();
      }
    };

    handleGridScroll();
    scrollElement.addEventListener('scroll', handleGridScroll, {
      passive: true,
    });

    return () => {
      scrollElement.removeEventListener('scroll', handleGridScroll);
    };
  }, [viewportRef, loading, loadingRef, hasNext, onLoadMore, threshold]);
}
