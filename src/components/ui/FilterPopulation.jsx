import React, { useEffect, useMemo, useState, useRef, memo, useCallback } from "react";
import { FiChevronDown } from "react-icons/fi";
import { getKyDuLieu, getDonViHanhChinh } from "../../service/populationApi";

const Filter = memo(({ filters, setFilters }) => {
  const [units, setUnits] = useState([]);
  const [timeItems, setTimeItems] = useState([]);
  const isUpdatingTimeId = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kyRes, donviRes] = await Promise.all([
          getKyDuLieu(),
          getDonViHanhChinh(),
        ]);

        const times = Array.isArray(kyRes?.body) ? kyRes.body : [];
        setTimeItems(times);

        const mappedUnits = (Array.isArray(donviRes?.body) ? donviRes.body : []).map(
          (u) => ({ code: u.madvhc, name: u.tenvi })
        );
        setUnits(mappedUnits);
        // set default year, quarter, and timeId if missing
        if (times.length) {
          // Ưu tiên năm 2024 nếu có, nếu không thì lấy năm đầu tiên
          const preferredYear = times.find(t => String(t.theYear) === "2024")?.theYear || times[0].theYear;
          const defaultYear = String(preferredYear);
          const defaultQuarter = String(times[0].quarter).toUpperCase();
          const defaultTimeId = times[0].timeId || times[0].timeid || times[0].dateYmd;

          // Tự động set đơn vị hành chính đầu tiên khi load
          if (filters.madvhc === null && mappedUnits.length > 0) {
            const next = {
              year: filters.year || defaultYear,
              quarter: filters.quarter || defaultQuarter,
              madvhc: mappedUnits[0].code, // Tự động set đơn vị đầu tiên
              timeId: filters.timeId || defaultTimeId,
            };
            setFilters({ ...filters, ...next });
          }
        }
      } catch (e) {
        // silent fail, keep defaults
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep filters.timeId synced with selected year/quarter and available timeItems
  useEffect(() => {
    if (!timeItems.length || isUpdatingTimeId.current) return;
    
    const match = timeItems.find(
      (t) => String(t.theYear) === String(filters.year) && String(t.quarter).toUpperCase() === String(filters.quarter)
    );
    const derived = match?.timeId || match?.timeid || match?.dateYmd;
    
    // Chỉ update khi thực sự cần thiết để tránh vòng lặp
    if (filters.quarter !== 'ALL' && derived && derived !== filters.timeId) {
      isUpdatingTimeId.current = true;
      setFilters(prev => ({ ...prev, timeId: derived }));
      setTimeout(() => { isUpdatingTimeId.current = false; }, 0);
    }
    if (filters.quarter === 'ALL') {
      const byQ = computeTimeIdsByQuarter(filters.year);
      isUpdatingTimeId.current = true;
      setFilters(prev => ({ ...prev, timeId: undefined, timeIdsByQuarter: byQ }));
      setTimeout(() => { isUpdatingTimeId.current = false; }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.year, filters.quarter, timeItems]);

  const years = useMemo(() => {
    const set = new Set();
    timeItems.forEach((t) => {
      if (t.theYear) set.add(String(t.theYear));
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [timeItems]);

  const quartersForSelectedYear = useMemo(() => {
    const qset = new Set();
    timeItems
      .filter((t) => !filters.year || String(t.theYear) === String(filters.year))
      .forEach((t) => {
        if (t.quarter) {
          const q = String(t.quarter).toUpperCase(); // q1 -> Q1
          qset.add(q);
        }
      });
    const ordered = ["Q1", "Q2", "Q3", "Q4"].filter((q) => qset.has(q));
    const base = ordered.length ? ordered : ["Q1", "Q2", "Q3", "Q4"];
    return ["ALL", ...base];
  }, [timeItems, filters.year]);

  const computeTimeIdsByQuarter = (year) => {
    const map = {};
    ["Q1", "Q2", "Q3", "Q4"].forEach((q) => {
      const match = timeItems.find(
        (t) => String(t.theYear) === String(year) && String(t.quarter).toUpperCase() === q
      );
      const tid = match?.timeId || match?.timeid || match?.dateYmd;
      if (tid) map[q] = tid;
    });
    return map;
  };

  return (
    <div className="flex justify-end items-center gap-3 py-3 mr-8">
      {/* Dropdown Quý */}
      <div className="relative">
        <select
          value={filters.quarter}
          onChange={useCallback((e) => {
            const nextQuarter = e.target.value;
            if (nextQuarter === 'ALL') {
              const byQ = computeTimeIdsByQuarter(filters.year);
              setFilters({ ...filters, quarter: nextQuarter, timeId: undefined, timeIdsByQuarter: byQ });
            } else {
              setFilters({ ...filters, quarter: nextQuarter });
            }
          }, [filters, setFilters, computeTimeIdsByQuarter])}
          className="appearance-none border border-gray-300 rounded-lg px-4 py-1 text-xs pr-8 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white hover:border-blue-400 transition"
        >
          {quartersForSelectedYear.map((q) => (
            <option key={q} value={q}>{q === 'ALL' ? 'Tất cả' : `Quý ${q.replace("Q", "")}`}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      {/* Dropdown Năm */}
      <div className="relative">
        <select
          value={filters.year}
          onChange={useCallback((e) => setFilters({ ...filters, year: e.target.value }), [filters, setFilters])}
          className="appearance-none border border-gray-300 rounded-lg px-4 py-1 text-xs pr-8 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white hover:border-blue-400 transition"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      {/* Dropdown Đơn vị hành chính */}
      <div className="relative">
        <select
          value={filters.madvhc || ''}
          onChange={useCallback((e) => setFilters({ ...filters, madvhc: e.target.value }), [filters, setFilters])}
          className="appearance-none border border-gray-300 rounded-lg px-4 py-1 text-xs pr-8 shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               bg-white hover:border-blue-400 transition w-56"
        >
          <option value="">Chọn đơn vị hành chính</option>
          {units.map((u) => (
            <option key={u.code} value={u.code}>
              {u.name}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
});

Filter.displayName = 'Filter';

export default Filter;
