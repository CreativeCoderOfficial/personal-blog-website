import { Search, Filter, X, Calendar, RotateCcw, Layers } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { PostFilters } from "@/types/post";
import MultiPillFilter from "@/components/posts/filtering/MultiPillFilter"

interface FilterPanelProps {
  //  Use PostFilters props
  filters: PostFilters;
  setFilters: Dispatch<SetStateAction<PostFilters>>;

  // Config props 
  searchPlaceholder?: string;
  filterLabel?: string;
  filterOptions: string[];
  
  // show/hide specific optional inputs
  resourceTypeLabel?: string;
  resourceTypeOptions?: string[];
}

export default function FilterPanel({
  filters,
  setFilters,
  searchPlaceholder = "Search...",
  filterOptions,
  filterLabel = "Filter by Category",
  resourceTypeOptions = [], 
  resourceTypeLabel = "Filter by Type",
}: FilterPanelProps) {

// --- LOGIC HELPERS ---
const hasSearch = filters.search.length > 0;
const hasDates = filters.dateFrom !== "" || filters.dateTo !== "";
const hasCategories = filters.categories.length > 0;
const hasResourceTypes = filters.resourceType.length > 0;
  
// Check if ANY filter is active
const hasAnyFilter = hasSearch || hasDates || hasCategories || hasResourceTypes;

// --- UPDATE HELPERS (The "Internal Adapters") ---
const updateSearch = (val: string) => {
  setFilters(prev => ({ ...prev, search: val }));
};

const updateDate = (field: 'dateFrom' | 'dateTo', val: string) => {
  setFilters(prev => ({ ...prev, [field]: val }));
};

// Generic toggle function for both Categories and Resource Types
  const toggleFilter = (field: 'categories' | 'resourceType', option: string) => {
    setFilters(prev => {
      const current = prev[field];
      const newList = current.includes(option)
        ? current.filter(c => c !== option) // Remove
        : [...current, option];             // Add
      
      return { ...prev, [field]: newList };
    });
  };
  
  // --- CLEAR HANDLERS ---
  const clearDates = () => {
      setFilters(prev => ({ ...prev, dateFrom: "", dateTo: "" }));
    };

  const clearAll = () => {
    setFilters(prev => ({
      search: "",
      categories: [],
      dateFrom: "",
      dateTo: "",
      resourceType: []
    }));
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
            value={filters.search}
            onChange={(e) => updateSearch(e.target.value)}
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
              onClick={() => updateSearch("")}
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
                value={filters.dateFrom}
                onChange={(e) => updateDate('dateFrom', e.target.value)}
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
                value={filters.dateTo}
                onChange={(e) => updateDate('dateTo', e.target.value)}
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

      {/* Category Options */}
      <MultiPillFilter
        label={filterLabel}
        labelIcon={<Filter className="w-4 h-4" />}
        options={filterOptions}
        selected={filters.categories}
        onToggle={(opt) => toggleFilter("categories", opt)}
        onClear={() => setFilters((prev) => ({ ...prev, categories: [] }))}
        clearLabel="Clear Categories"
        selectedClass="bg-accent-purple text-white border-accent-purple shadow-lg shadow-accent-purple/20"
       />
      
      {/*  Resource Type row: (Only renders if options exist) */}
      {resourceTypeOptions.length > 0 && (
        <div className="pt-4 border-t border-border-subtle/50">
         <MultiPillFilter
          label={resourceTypeLabel}
          labelIcon={<Layers className="w-4 h-4" />}
          options={resourceTypeOptions}
          selected={filters.resourceType}
          onToggle={(opt) => toggleFilter("resourceType", opt)}
          onClear={() => setFilters((prev) => ({ ...prev, resourceType: [] }))}
          clearLabel="Clear"
          selectedClass="bg-accent-orange text-white border-accent-orange"
          />
        </div>
      )}

        
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