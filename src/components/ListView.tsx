
import { useState, useEffect } from 'react';
import { Stack, StackStatus } from '@/types';
import StackCard from './StackCard';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, X, Filter, Clock, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRoadmap } from '@/contexts/RoadmapContext';
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface ListViewProps {
  stacks: Stack[];
}

const ListView: React.FC<ListViewProps> = ({ stacks: initialStacks }) => {
  const { categories, filterStacks } = useRoadmap();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StackStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'default' | 'alphabetical' | 'status' | 'recent'>('default');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const isMobile = useIsMobile();
  
  const filteredStacks = filterStacks(
    searchQuery, 
    statusFilter, 
    categoryFilter
  );
  
  // Apply sorting
  const sortedStacks = [...filteredStacks].sort((a, b) => {
    switch (sortOption) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'status':
        // Sort by status priority: completed > in-progress > not-started
        const statusPriority = { 'completed': 0, 'in-progress': 1, 'not-started': 2 };
        return statusPriority[a.status] - statusPriority[b.status];
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        // Default is by category
        return a.category.localeCompare(b.category);
    }
  });
  
  // Group stacks by category
  const stacksByCategory = sortedStacks.reduce((acc, stack) => {
    const category = stack.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(stack);
    return acc;
  }, {} as Record<string, Stack[]>);
  
  // Sort categories alphabetically
  const sortedCategories = Object.keys(stacksByCategory).sort();

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (categoryFilter !== 'all') count++;
    if (searchQuery) count++;
    if (sortOption !== 'default') count++;
    setActiveFiltersCount(count);
  }, [statusFilter, categoryFilter, searchQuery, sortOption]);

  // Animation variants for items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortOption('default');
  };

  // Filters for mobile view
  const FiltersMobile = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden relative">
          <SlidersHorizontal className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine your roadmap view
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="mobile-status" className="mb-2 block">Status</Label>
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as StackStatus | 'all')}
            >
              <SelectTrigger id="mobile-status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mobile-category" className="mb-2 block">Category</Label>
            <Select 
              value={categoryFilter} 
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger id="mobile-category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mobile-sort" className="mb-2 block">Sort By</Label>
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as 'default' | 'alphabetical' | 'status' | 'recent')}
            >
              <SelectTrigger id="mobile-sort">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default (by category)</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="status">Status Priority</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full" 
            onClick={clearAllFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 search-box">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search stacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-transparent border-none focus-visible:ring-primary focus-visible:ring-offset-0"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <FiltersMobile />
        </div>
        
        {/* Desktop Advanced Filters */}
        <div className="hidden md:block">
          <Collapsible
            open={isAdvancedFilterOpen}
            onOpenChange={setIsAdvancedFilterOpen}
            className="mb-4"
          >
            <div className="flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1.5 px-2.5 text-sm">
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value as 'default' | 'alphabetical' | 'status' | 'recent')}
              >
                <SelectTrigger className="w-[180px] h-9 bg-background/60 backdrop-blur-sm border-muted">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (by category)</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="status">Status Priority</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <CollapsibleContent className="mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="mb-2 block">Status</Label>
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => setStatusFilter(value as StackStatus | 'all')}
                  >
                    <SelectTrigger id="status" className="bg-background/60 backdrop-blur-sm border-muted">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category" className="mb-2 block">Category</Label>
                  <Select 
                    value={categoryFilter} 
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger id="category" className="bg-background/60 backdrop-blur-sm border-muted">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4" 
                  onClick={clearAllFilters}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Clear all filters
                </Button>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      
      {/* Results counter with animations */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex justify-between items-center"
      >
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-primary">{filteredStacks.length}</span> stack{filteredStacks.length !== 1 ? 's' : ''}
        </p>
        
        {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery || sortOption !== 'default') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reset
          </Button>
        )}
      </motion.div>
      
      {/* Stacks by category */}
      {filteredStacks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 rounded-lg border border-dashed border-muted glass-card"
        >
          <p className="text-muted-foreground mb-2">No stacks found matching your filters</p>
          <Button 
            variant="outline" 
            onClick={clearAllFilters}
            className="cyber-button"
          >
            Clear filters
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {sortedCategories.map((category) => (
            <motion.div key={category} variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold font-mono gradient-text">{category}</h2>
                <div className="h-[1px] flex-1 glow-line-animation bg-gradient-to-r from-primary/50 to-transparent"></div>
                <span className="text-sm text-muted-foreground">
                  {stacksByCategory[category].length} item{stacksByCategory[category].length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {stacksByCategory[category].map((stack) => (
                    <motion.div 
                      key={stack.id} 
                      variants={itemVariants}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StackCard stack={stack} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ListView;
