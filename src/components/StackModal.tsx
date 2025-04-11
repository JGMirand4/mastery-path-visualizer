
import { useState, useEffect } from 'react';
import { useRoadmap } from '@/contexts/RoadmapContext';
import { Stack, StackStatus, SubTopic } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StackModalProps {
  isOpen: boolean;
  onClose: () => void;
  editStack?: Stack;
}

const emptySubtopic = (): SubTopic => ({
  id: Date.now().toString(),
  title: '',
  isCompleted: false,
});

const emptyStack = (): Omit<Stack, 'id' | 'lastUpdated'> => ({
  icon: '📚',
  title: '',
  description: '',
  status: 'not-started',
  category: '',
  subtopics: [emptySubtopic()],
  resources: [''],
  notes: '',
  repositoryUrl: '',
});

const commonIcons = ['📚', '⚡', '🔥', '💻', '🧠', '🤖', '🐍', '☕', '⚛️', '🔒', '🔍', '🌐', '📱', '🚀', '🧩', '🔧', '🔨', '🎨', '🔢', '📊', '📈', '🧪'];

const StackModal: React.FC<StackModalProps> = ({ isOpen, onClose, editStack }) => {
  const { addStack, updateStack, categories } = useRoadmap();
  const [formData, setFormData] = useState<Omit<Stack, 'id' | 'lastUpdated'>>(emptyStack());
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (editStack) {
      setFormData({
        icon: editStack.icon,
        title: editStack.title,
        description: editStack.description,
        status: editStack.status,
        category: editStack.category,
        subtopics: editStack.subtopics,
        resources: editStack.resources || [''],
        notes: editStack.notes || '',
        repositoryUrl: editStack.repositoryUrl || '',
      });
      setIsEditing(true);
    } else {
      setFormData(emptyStack());
      setIsEditing(false);
    }
  }, [editStack]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleIconSelect = (icon: string) => {
    setFormData({ ...formData, icon });
  };
  
  const handleSubtopicChange = (index: number, value: string) => {
    const newSubtopics = [...formData.subtopics];
    newSubtopics[index] = { ...newSubtopics[index], title: value };
    setFormData({ ...formData, subtopics: newSubtopics });
  };
  
  const addSubtopic = () => {
    setFormData({
      ...formData,
      subtopics: [...formData.subtopics, emptySubtopic()]
    });
  };
  
  const removeSubtopic = (index: number) => {
    if (formData.subtopics.length > 1) {
      const newSubtopics = formData.subtopics.filter((_, i) => i !== index);
      setFormData({ ...formData, subtopics: newSubtopics });
    }
  };
  
  const handleResourceChange = (index: number, value: string) => {
    const newResources = [...formData.resources];
    newResources[index] = value;
    setFormData({ ...formData, resources: newResources });
  };
  
  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, '']
    });
  };
  
  const removeResource = (index: number) => {
    if (formData.resources.length > 1) {
      const newResources = formData.resources.filter((_, i) => i !== index);
      setFormData({ ...formData, resources: newResources });
    }
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!formData.category.trim()) {
      alert('Category is required');
      return;
    }
    
    // Filter out empty subtopics
    const filteredSubtopics = formData.subtopics.filter(s => s.title.trim());
    if (filteredSubtopics.length === 0) {
      alert('At least one subtopic is required');
      return;
    }
    
    // Filter out empty resources
    const filteredResources = formData.resources.filter(r => r.trim());
    
    const stackData = {
      ...formData,
      subtopics: filteredSubtopics,
      resources: filteredResources.length > 0 ? filteredResources : undefined,
    };
    
    if (isEditing && editStack) {
      updateStack({ ...editStack, ...stackData });
    } else {
      addStack(stackData);
    }
    
    onClose();
  };

  const resetAndClose = () => {
    setFormData(emptyStack());
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Stack' : 'Add New Stack'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your stack details and progress.'
              : 'Add a new technology or skill to your mastery roadmap.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-4 gap-4 items-start">
            <div>
              <Label htmlFor="icon" className="mb-2 block">Icon</Label>
              <div className="border p-2 rounded-md grid grid-cols-4 gap-2 max-h-[120px] overflow-y-auto">
                {commonIcons.map(icon => (
                  <Button
                    key={icon}
                    type="button"
                    variant={formData.icon === icon ? 'default' : 'outline'}
                    className="h-8 w-8 p-0"
                    onClick={() => handleIconSelect(icon)}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="col-span-3 space-y-4">
              <div>
                <Label htmlFor="title" className="mb-2 block">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., React, Python, Machine Learning"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="category" className="mb-2 block">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status" className="mb-2 block">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value as StackStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="mb-2 block">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of this technology or skill"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Subtopics</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubtopic}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {formData.subtopics.map((subtopic, index) => (
                <div key={subtopic.id} className="flex gap-2">
                  <Input
                    placeholder={`Subtopic ${index + 1}`}
                    value={subtopic.title}
                    onChange={(e) => handleSubtopicChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSubtopic(index)}
                    disabled={formData.subtopics.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Resources</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addResource}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Resource ${index + 1} (e.g., website, book, course)`}
                    value={resource}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeResource(index)}
                    disabled={formData.resources.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes" className="mb-2 block">Personal Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any personal notes or thoughts about this stack"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="repositoryUrl" className="mb-2 block">GitHub Repository (Optional)</Label>
            <Input
              id="repositoryUrl"
              name="repositoryUrl"
              placeholder="e.g., https://github.com/username/repo"
              value={formData.repositoryUrl}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Update' : 'Add'} Stack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StackModal;
