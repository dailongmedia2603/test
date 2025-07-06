import { CalendarIcon, FilterIcon, PlusIcon, SearchIcon, MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../../../lib/storage";

interface Project {
  id: string;
  projectNumber: string;
  title: string;
  description: string;
  createdDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Active" | "Completed" | "On Hold" | "Planning";
  allTasks: number;
  activeTasks: number;
  completedTasks: number;
  assignees: {
    id: string;
    name: string;
    avatar: string;
  }[];
  color: string;
  category: string;
  deadline?: string;
}

// Default projects data
const defaultProjects: Project[] = [
  {
    id: "1",
    projectNumber: "PN0001265",
    title: "Medical App (iOS native)",
    description: "A comprehensive medical application for iOS with patient management and appointment scheduling features.",
    createdDate: "Sep 12, 2020",
    priority: "Medium",
    status: "Active",
    allTasks: 34,
    activeTasks: 13,
    completedTasks: 21,
    assignees: [
      { id: "1", name: "John Doe", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "2", name: "Jane Smith", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "3", name: "Mike Johnson", avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
    ],
    color: "#3f8cff",
    category: "Mobile Development",
    deadline: "Dec 15, 2020"
  },
  {
    id: "2",
    projectNumber: "PN0001221",
    title: "Food Delivery Service",
    description: "Complete food delivery platform with restaurant management and real-time tracking.",
    createdDate: "Sep 10, 2020",
    priority: "Medium",
    status: "Active",
    allTasks: 50,
    activeTasks: 24,
    completedTasks: 26,
    assignees: [
      { id: "4", name: "Sarah Wilson", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "5", name: "Tom Brown", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "6", name: "Lisa Davis", avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
    ],
    color: "#de92eb",
    category: "Web Development",
    deadline: "Nov 30, 2020"
  },
  {
    id: "3",
    projectNumber: "PN0001290",
    title: "Food Delivery Service",
    description: "Enhanced version with AI-powered recommendations and advanced analytics.",
    createdDate: "May 28, 2020",
    priority: "Low",
    status: "Completed",
    allTasks: 23,
    activeTasks: 0,
    completedTasks: 23,
    assignees: [
      { id: "7", name: "Alex Chen", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "8", name: "Emma Wilson", avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
    ],
    color: "#0ac846",
    category: "Web Development",
    deadline: "Aug 15, 2020"
  },
  {
    id: "4",
    projectNumber: "PN0001301",
    title: "E-commerce Platform",
    description: "Modern e-commerce solution with advanced payment integration and inventory management.",
    createdDate: "Oct 5, 2020",
    priority: "High",
    status: "Active",
    allTasks: 67,
    activeTasks: 45,
    completedTasks: 22,
    assignees: [
      { id: "9", name: "David Lee", avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "10", name: "Sophie Turner", avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "11", name: "Ryan Garcia", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
    ],
    color: "#ff6b6b",
    category: "E-commerce",
    deadline: "Jan 20, 2021"
  },
  {
    id: "5",
    projectNumber: "PN0001312",
    title: "CRM Dashboard",
    description: "Customer relationship management system with advanced analytics and reporting.",
    createdDate: "Nov 1, 2020",
    priority: "Medium",
    status: "Planning",
    allTasks: 28,
    activeTasks: 5,
    completedTasks: 0,
    assignees: [
      { id: "12", name: "Maria Rodriguez", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "13", name: "James Wilson", avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
    ],
    color: "#ffbd21",
    category: "Business Tools",
    deadline: "Feb 28, 2021"
  }
];

export const ProjectsPageSection = (): JSX.Element => {
  // Use localStorage hook for persistent data
  const [projects, setProjects] = useLocalStorage<Project[]>(STORAGE_KEYS.PROJECTS, defaultProjects);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    priority: "Medium" as Project["priority"],
    status: "Planning" as Project["status"],
    category: "",
    deadline: "",
    color: "#3f8cff"
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(projects.map(p => p.category)));

  // Priority colors
  const priorityColors = {
    Low: "#0ac846",
    Medium: "#ffbd21",
    High: "#ff6b6b"
  };

  // Status colors
  const statusColors = {
    Active: "#3f8cff",
    Completed: "#0ac846",
    "On Hold": "#ff6b6b",
    Planning: "#ffbd21"
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || project.priority === priorityFilter;
    const matchesCategory = categoryFilter === "All" || project.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleCreateProject = () => {
    if (!newProject.title.trim()) return;

    const project: Project = {
      id: Date.now().toString(),
      projectNumber: `PN${String(Date.now()).slice(-7)}`,
      title: newProject.title,
      description: newProject.description,
      createdDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      priority: newProject.priority,
      status: newProject.status,
      allTasks: 0,
      activeTasks: 0,
      completedTasks: 0,
      assignees: [],
      color: newProject.color,
      category: newProject.category,
      deadline: newProject.deadline
    };

    setProjects(prev => [project, ...prev]);
    setNewProject({
      title: "",
      description: "",
      priority: "Medium",
      status: "Planning",
      category: "",
      deadline: "",
      color: "#3f8cff"
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditProject = () => {
    if (!selectedProject || !newProject.title.trim()) return;

    setProjects(prev => prev.map(project => 
      project.id === selectedProject.id 
        ? { ...project, ...newProject }
        : project
    ));
    
    setIsEditDialogOpen(false);
    setSelectedProject(null);
    setNewProject({
      title: "",
      description: "",
      priority: "Medium",
      status: "Planning",
      category: "",
      deadline: "",
      color: "#3f8cff"
    });
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setNewProject({
      title: project.title,
      description: project.description,
      priority: project.priority,
      status: project.status,
      category: project.category,
      deadline: project.deadline || "",
      color: project.color
    });
    setIsEditDialogOpen(true);
  };

  const renderProjectCard = (project: Project) => (
    <Card key={project.id} className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b] hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-row">
          {/* Left section */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: project.color }}
              >
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-normal text-sm text-[#91929e]">
                  {project.projectNumber}
                </span>
                <h3 className="font-bold text-lg text-[#0a1629] leading-[26px] mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-[#7d8592] mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 text-[#7d8592] mr-2" />
                    <span className="font-semibold text-sm text-[#7d8592]">
                      Created {project.createdDate}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                      style={{ backgroundColor: priorityColors[project.priority] }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span 
                      className="font-bold text-sm"
                      style={{ color: priorityColors[project.priority] }}
                    >
                      {project.priority}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                      style={{ backgroundColor: statusColors[project.status] }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span 
                      className="font-bold text-sm"
                      style={{ color: statusColors[project.status] }}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                {project.deadline && (
                  <div className="flex items-center mb-4">
                    <CalendarIcon className="w-4 h-4 text-[#ff6b6b] mr-2" />
                    <span className="text-sm text-[#ff6b6b] font-semibold">
                      Deadline: {project.deadline}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="w-[300px] pl-6 border-l border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-base text-[#0a1629]">
                Project Data
              </h4>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(project)}
                  className="h-8 w-8 p-0 hover:bg-blue-50"
                >
                  <EditIcon className="h-4 w-4 text-[#3f8cff]" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4 text-[#ff6b6b]" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="font-normal text-sm text-[#91929e]">All tasks</p>
                <p className="font-bold text-base text-[#0a1629] mt-1">{project.allTasks}</p>
              </div>
              <div>
                <p className="font-normal text-sm text-[#91929e]">Active tasks</p>
                <p className="font-bold text-base text-[#0a1629] mt-1">{project.activeTasks}</p>
              </div>
              <div>
                <p className="font-normal text-sm text-[#91929e]">Completed</p>
                <p className="font-bold text-base text-[#0a1629] mt-1">{project.completedTasks}</p>
              </div>
            </div>

            <div>
              <p className="font-normal text-sm text-[#91929e] mb-2">Assignees</p>
              <div className="flex -space-x-2">
                {project.assignees.slice(0, 4).map((assignee, index) => (
                  <Avatar
                    key={assignee.id}
                    className="w-[26px] h-[26px] border-2 border-white"
                    style={{ zIndex: 4 - index }}
                  >
                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                    <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {project.assignees.length > 4 && (
                  <div className="w-6 h-6 rounded-full bg-[#3f8cff] flex items-center justify-center -ml-1 border-2 border-white">
                    <span className="font-semibold text-xs text-white">
                      +{project.assignees.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="font-normal text-sm text-[#91929e] mb-1">Category</p>
              <span className="inline-block px-3 py-1 bg-[#f4f9fd] text-[#3f8cff] text-sm font-semibold rounded-full">
                {project.category}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header with filters and search */}
      <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[28px]">
              All Projects ({filteredProjects.length})
            </h2>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
                    Create New Project
                  </DialogTitle>
                  <DialogDescription className="text-[#7d8592]">
                    Fill in the details to create a new project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Project title"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Project description"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={newProject.category}
                      onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Web Development"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Priority
                    </Label>
                    <Select value={newProject.priority} onValueChange={(value: Project["priority"]) => setNewProject(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Status
                    </Label>
                    <Select value={newProject.status} onValueChange={(value: Project["status"]) => setNewProject(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deadline" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Deadline
                    </Label>
                    <Input
                      id="deadline"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                      placeholder="e.g., Dec 31, 2024"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleCreateProject}
                    className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                  >
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7d8592]" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-[14px] border-gray-200 font-['Nunito_Sans',Helvetica]"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.length === 0 ? (
          <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-bold text-[#0a1629] mb-2">No Projects Found</h3>
              <p className="text-[#7d8592] mb-6">
                {searchTerm || statusFilter !== "All" || priorityFilter !== "All" || categoryFilter !== "All"
                  ? "No projects match your current filters. Try adjusting your search criteria."
                  : "You haven't created any projects yet. Create your first project to get started."
                }
              </p>
              {!searchTerm && statusFilter === "All" && priorityFilter === "All" && categoryFilter === "All" && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map(renderProjectCard)
        )}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
              Edit Project
            </DialogTitle>
            <DialogDescription className="text-[#7d8592]">
              Update the project details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                Title
              </Label>
              <Input
                id="edit-title"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Project title"
                className="col-span-3 rounded-[14px] border-gray-200"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                Description
              </Label>
              <Input
                id="edit-description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Project description"
                className="col-span-3 rounded-[14px] border-gray-200"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                Category
              </Label>
              <Input
                id="edit-category"
                value={newProject.category}
                onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Web Development"
                className="col-span-3 rounded-[14px] border-gray-200"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-priority" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                Priority
              </Label>
              <Select value={newProject.priority} onValueChange={(value: Project["priority"]) => setNewProject(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                Status
              </Label>
              <Select value={newProject.status} onValueChange={(value: Project["status"]) => setNewProject(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-deadline" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                Deadline
              </Label>
              <Input
                id="edit-deadline"
                value={newProject.deadline}
                onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                placeholder="e.g., Dec 31, 2024"
                className="col-span-3 rounded-[14px] border-gray-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleEditProject}
              className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
            >
              Update Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};