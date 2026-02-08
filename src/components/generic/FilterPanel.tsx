import { Search, Filter, X, Calendar, RotateCcw } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface FilterPanelProps {
  // --- SEARCH PROPS ---
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  searchPlaceholder?: string;
  
  // --- CATEGORY PROPS ---
  filterLabel: string;
  filterOptions: string[];
  selectedOptions: string[];
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;

  // --- DATE PROPS ---
  dateFrom: string;
  setDateFrom: Dispatch<SetStateAction<string>>;
  dateTo: string;
  setDateTo: Dispatch<SetStateAction<string>>;
}

export default function FilterPanel({
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Search...",
  filterOptions,
  selectedOptions,
  setSelectedOptions,
  filterLabel = "Filter by Category",
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: FilterPanelProps) {

  // --- LOGIC HELPERS ---
  const hasSearch = searchTerm.length > 0;
  const hasDates = dateFrom !== "" || dateTo !== "";
  const hasCategories = selectedOptions.length > 0;
  const hasAnyFilter = hasSearch || hasDates || hasCategories;

  // --- TOGGLE LOGIC ---
  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // --- CLEAR HANDLERS ---
  const clearDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  const clearAll = () => {
    setSearchTerm("");
    setSelectedOptions([]);
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="
      mt-10 mb-16 p-6 md:p-8
      bg-card/30 backdrop-blur-md 
      border border-border-subtle rounded-3xl
      flex flex-col gap-8
    ">
      
      {/* TOP ROW: Search & Date Range */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* 1. SEARCH INPUT */}
        <div className="relative group">
          <Search className="
            absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 
            text-text-secondary group-focus-within:text-accent-purple 
            transition-colors
          " />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-12 pr-10 py-4
              bg-main/50 border border-border-subtle rounded-xl 
              text-text-primary placeholder:text-text-secondary/50
              focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple
              transition-all
            "
          />
          {hasSearch && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. DATE RANGE SECTION */}
        <div className="flex flex-col gap-2">
          {/* Inputs Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-xs text-text-secondary uppercase font-bold mr-2">From</span>
              </div>
              <input 
                type="date" 
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="
                  w-full pl-16 pr-4 py-4
                  bg-main/50 border border-border-subtle rounded-xl 
                  text-text-primary scheme-dark cursor-pointer
                  focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange
                  transition-all
                "
              />
            </div>

            <div className="relative flex-1 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-xs text-text-secondary uppercase font-bold mr-2">Until</span>
              </div>
              <input 
                type="date" 
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="
                  w-full pl-16 pr-4 py-4
                  bg-main/50 border border-border-subtle rounded-xl 
                  text-text-primary scheme-dark cursor-pointer
                  focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange
                  transition-all
                "
              />
            </div>
          </div>

          {/* Clear Dates Button - Shows only when dates are active */}
          {hasDates && (
            <div className="flex justify-end">
              <button 
                onClick={clearDates}
                className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear Dates
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ROW: Category Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
            <Filter className="w-4 h-4" />
            <span>{filterLabel}:</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {filterOptions.map((opt) => {
            const isSelected = selectedOptions.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggleOption(opt)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 capitalize
                  ${isSelected 
                    ? "bg-accent-purple text-white border-accent-purple shadow-lg shadow-accent-purple/20" 
                    : "bg-main/50 text-text-secondary border-border-subtle hover:border-text-secondary hover:text-text-primary"
                  }
                `}
              >
                {opt}
              </button>
            );
          })}
          
          {/* Clear Categories Button */}
          {hasCategories && (
            <button
              onClick={() => setSelectedOptions([])}
              className="
                px-4 py-2 rounded-full text-sm font-medium 
                text-red-400 hover:text-red-300 hover:bg-red-400/10 
                flex items-center gap-1 transition-colors
              "
            >
              <X className="w-3 h-3" />
              Clear Categories
            </button>
          )}
        </div>
      </div>

      {/* A Clear All Option pops up if any filter is active */}
      {hasAnyFilter && (
        <div className="pt-6 border-t border-border-subtle flex justify-end">
          <button 
            onClick={clearAll}
            className="
              text-sm font-semibold text-text-secondary 
              hover:text-accent-red transition-colors 
              flex items-center gap-2
            "
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
}