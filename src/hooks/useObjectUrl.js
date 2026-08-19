import { useEffect, useMemo } from 'react';

export function useObjectUrl(value) {
  const url = useMemo(
    () => (value && typeof URL !== 'undefined' ? URL.createObjectURL(value) : ''),
    [value],
  );

  useEffect(() => {
    if (!url) return undefined;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
}
