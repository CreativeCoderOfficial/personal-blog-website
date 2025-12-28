import { Search, Filter, X } from "lucide-react";

interface FilterPanelProps {
  // --- SEARCH PROPS ---
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchPlaceholder?: string; // Customizable placeholder

  // --- DATE PROPS ---
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;

  // --- FILTER OPTION PROPS (Renamed from 'categories') ---
  filterOptions: string[]; 
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
  filterLabel?: string; // e.g. "Filter by Category" or "Filter by File Type"
}

export default function FilterPanel({
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Search...",
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  filterOptions,
  selectedOptions,
  setSelectedOptions,
  filterLabel = "Filter by Category",
}: FilterPanelProps) {

  // Toggle Logic
  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
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
          {/* IMPROVEMENT: Clear Search Button */}
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. DATE RANGE INPUTS */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* From Date */}
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

          {/* Until Date */}
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
      </div>

      {/* BOTTOM ROW: Multi-Select Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
          <Filter className="w-4 h-4" />
          <span>{filterLabel}:</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {filterOptions.map((opt) => {
            const isSelected = selectedOptions.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggleOption(opt)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300
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
          
          {/* Clear Filters Button */}
          {selectedOptions.length > 0 && (
            <button
              onClick={() => setSelectedOptions([])}
              className="
                px-4 py-2 rounded-full text-sm font-medium 
                text-red-400 hover:text-red-300 hover:bg-red-400/10 
                flex items-center gap-1 transition-colors
              "
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

    </div>
  );
}