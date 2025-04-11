
import { useState } from 'react';
import { Stack, StackStatus } from '@/types';
import StackCard from './StackCard';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";
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
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';

interface ListViewProps {
  stacks: Stack[];
}

const ListView: React.FC<ListViewProps> = ({ stacks: initialStacks }) => {
  const { categories, filterStacks } = useRoadmap();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StackStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const isMobile = useIsMobile();
  
  const filteredStacks = filterStacks(
    searchQuery, 
    statusFilter === 'all' ? undefined : statusFilter, 
    categoryFilter === 'all' ? undefined : categoryFilter
  );
  
  // Group stacks by category
  const stacksByCategory = filteredStacks.reduce((acc, stack) => {
    const category = stack.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(stack);
    return acc;
  }, {} as Record<string, Stack[]>);
  
  // Sort categories alphabetically
  const sortedCategories = Object.keys(stacksByCategory).sort();

  // Animation variants for items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Filters for mobile view
  const FiltersMobile = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <SlidersHorizontal className="h-4 w-4" />
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
          <Button 
            className="w-full" 
            onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
          >
            Clear Filters
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
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search stacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/60 backdrop-blur-sm border-muted"
            />
          </div>
          <FiltersMobile />
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden md:grid md:grid-cols-2 gap-4">
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
      </div>
      
      {/* Results counter with animations */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex justify-between items-center"
      >
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredStacks.length}</span> stack{filteredStacks.length !== 1 ? 's' : ''}
        </p>
        
        {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
          >
            Clear filters
          </Button>
        )}
      </motion.div>
      
      {/* Stacks by category */}
      {filteredStacks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 rounded-lg border border-dashed"
        >
          <p className="text-muted-foreground mb-2">No stacks found matching your filters</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
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
                <h2 className="text-xl font-bold font-mono">{category}</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                <span className="text-sm text-muted-foreground">
                  {stacksByCategory[category].length} item{stacksByCategory[category].length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {stacksByCategory[category].map((stack) => (
                  <motion.div key={stack.id} variants={itemVariants}>
                    <StackCard stack={stack} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ListView;
