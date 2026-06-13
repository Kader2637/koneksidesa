import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X, Search } from "lucide-react";

export interface Select2Option {
  value: string | number;
  label: string;
  sublabel?: string;
}

interface Select2Props {
  options: Select2Option[];
  value: string | number | (string | number)[];
  onChange: (value: any) => void;
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  disabled?: boolean;
  className?: string;
  onAsyncSearch?: (query: string) => Promise<Select2Option[]>;
}

export default function Select2({
  options: initialOptions,
  value,
  onChange,
  placeholder = "Pilih opsi...",
  isSearchable = true,
  isClearable = true,
  isMulti = false,
  disabled = false,
  className = "",
  onAsyncSearch
}: Select2Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<Select2Option[]>(initialOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync initial options
  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  // Debounced Async Search
  useEffect(() => {
    if (!onAsyncSearch || !searchQuery) {
      if (!onAsyncSearch) {
        setOptions(initialOptions);
      }
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await onAsyncSearch(searchQuery);
        setOptions(res);
      } catch (err) {
        console.error("Async search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, onAsyncSearch, initialOptions]);

  // Local Search filter
  const filteredOptions = onAsyncSearch 
    ? options 
    : options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Toggle open
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
      setHighlightedIndex(-1);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle select option
  const handleSelect = (option: Select2Option) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(option.value)) {
        onChange(currentValues.filter(v => v !== option.value));
      } else {
        onChange([...currentValues, option.value]);
      }
    } else {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(isMulti ? [] : "");
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
    }
  };

  // Find label(s) for rendering
  const getSelectedLabels = () => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      return currentValues.map(v => {
        const found = options.find(o => o.value === v);
        return found ? found.label : v;
      });
    } else {
      const found = options.find(o => o.value === value);
      return found ? found.label : "";
    }
  };

  const selectedLabels = getSelectedLabels();

  return (
    <div 
      ref={containerRef}
      className={`relative w-full text-left font-sans select-none ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Control Box */}
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between min-h-[42px] px-3 py-1.5 bg-slate-50 border rounded-xl cursor-pointer transition-all duration-200 ${
          disabled ? "bg-slate-100 cursor-not-allowed opacity-60 border-slate-200" : "hover:bg-white border-slate-200 focus:border-indigo-500/50"
        } ${isOpen ? "bg-white ring-2 ring-indigo-500/10 border-indigo-500/50" : ""}`}
      >
        <div className="flex flex-wrap gap-1 items-center flex-1 min-w-0 mr-2">
          {isMulti && Array.isArray(selectedLabels) && selectedLabels.length > 0 ? (
            selectedLabels.map((lbl, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-lg border border-indigo-150"
              >
                {lbl}
                <X 
                  className="w-3 h-3 hover:text-indigo-900 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentValues = Array.isArray(value) ? value : [];
                    const labelValue = options.find(o => o.label === lbl)?.value;
                    if (labelValue !== undefined) {
                      onChange(currentValues.filter(v => v !== labelValue));
                    }
                  }}
                />
              </span>
            ))
          ) : !isMulti && selectedLabels ? (
            <span className="text-xs font-semibold text-slate-800 truncate">{selectedLabels}</span>
          ) : (
            <span className="text-xs font-semibold text-slate-400 truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isClearable && !disabled && ((isMulti && Array.isArray(value) && value.length > 0) || (!isMulti && value !== "")) && (
            <X 
              className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition"
              onClick={handleClear}
            />
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-100">
          {/* Search bar inside dropdown */}
          {isSearchable && (
            <div className="flex items-center gap-2 p-2.5 border-b border-slate-100">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik untuk mencari..."
                className="w-full bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400 font-semibold"
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {isLoading ? (
              <div className="p-3 text-center text-xs text-slate-400 font-bold">Memuat data...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">Opsi tidak ditemukan</div>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = isMulti 
                  ? (Array.isArray(value) && value.includes(option.value))
                  : value === option.value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`flex flex-col px-3.5 py-2.5 cursor-pointer text-xs transition duration-150 ${
                      isSelected 
                        ? "bg-indigo-600 text-white font-bold" 
                        : isHighlighted 
                        ? "bg-slate-50 text-slate-800 font-bold" 
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{option.label}</span>
                    {option.sublabel && (
                      <span className={`text-[10px] mt-0.5 font-normal ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
