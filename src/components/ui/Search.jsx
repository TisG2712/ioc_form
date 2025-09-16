import React, { memo } from "react";
import { FaSearch } from "react-icons/fa";

/**
 * Generic search/filter toolbar
 * props:
 * - fields: Array of { name, label, type: 'text'|'select', placeholder?, options?: Array<{value,label}> }
 * - values: Record<string,string>
 * - onChange: (name: string, value: string) => void
 * - onSearch: () => void
 */
const Search = memo(({ fields = [], values = {}, onChange, onSearch }) => {
  return (
    <div className="w-full bg-white p-2">
      <div className="flex gap-2">
        {fields.map((field) => (
          <div key={field.name} className="flex items-center gap-2">
            <span className="whitespace-nowrap text-xs text-gray-700">
              {field.label}:
            </span>
            {field.type === "select" ? (
              <select
                className="flex-1 text-xs border rounded px-2 py-1 bg-white"
                value={values[field.name] ?? ""}
                onChange={(e) =>
                  onChange && onChange(field.name, e.target.value)
                }
              >
                {(field.options || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="flex-1 text-xs border rounded px-2 py-1"
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) =>
                  onChange && onChange(field.name, e.target.value)
                }
              />
            )}
          </div>
        ))}
        <div className="flex items-center md:justify-end">
          <button
            type="button"
            onClick={onSearch}
            className="text-xs bg-blue-600 text-white px-2 py-1.5 rounded inline-flex items-center gap-2"
          >
            <FaSearch />
            Tìm Kiếm
          </button>
        </div>
      </div>
    </div>
  );
});

Search.displayName = 'Search';

export default Search;
