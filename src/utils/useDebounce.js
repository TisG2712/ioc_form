import { useState, useEffect } from 'react';

// Custom hook để debounce giá trị
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook để debounce filters
export const useDebouncedFilters = (filters, delay = 300) => {
  const debouncedMadvhc = useDebounce(filters?.madvhc, delay);
  const debouncedQuarter = useDebounce(filters?.quarter, delay);
  const debouncedYear = useDebounce(filters?.year, delay);
  const debouncedTimeId = useDebounce(filters?.timeId, delay);

  return {
    madvhc: debouncedMadvhc,
    quarter: debouncedQuarter,
    year: debouncedYear,
    timeId: debouncedTimeId,
    timeIdsByQuarter: filters?.timeIdsByQuarter
  };
};
