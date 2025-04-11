
import { useState } from 'react';
import { Stack, StackStatus } from '@/types';
import StackCard from './StackCard';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoadmap } from '@/contexts/RoadmapContext';

interface ListViewProps {
  stacks: Stack[];
}

const ListView: React.FC<ListViewProps> = ({ stacks: initialStacks }) => {
  const { categories, filterStacks } = useRoadmap();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StackStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const filteredStacks = filterStacks(
    searchQuery, 
    statusFilter as StackStatus | undefined, 
    categoryFilter || undefined
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

  return (
    <div className="container mx-auto py-6">
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search" className="mb-2 block">Search</Label>
          <Input 
            id="search"
            placeholder="Search stacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status" className="mb-2 block">Status</Label>
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as StackStatus | '')}
          >
            <SelectTrigger id="status">
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
            <SelectTrigger id="category">
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
      
      {/* Display results count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredStacks.length} stack{filteredStacks.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Stacks by category */}
      <div className="space-y-10">
        {filteredStacks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No stacks found matching your filters</p>
          </div>
        ) : (
          sortedCategories.map((category) => (
            <div key={category}>
              <h2 className="text-xl font-bold mb-4 font-mono">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {stacksByCategory[category].map((stack) => (
                  <StackCard key={stack.id} stack={stack} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListView;

