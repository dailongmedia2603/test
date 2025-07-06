import { PlusIcon, SearchIcon, CalendarIcon, ClockIcon, UsersIcon, MapPinIcon } from "lucide-react";
import React, { useState } from "react";
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

interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: "Task" | "Meeting" | "Deadline" | "Reminder" | "Break";
  priority: "Low" | "Medium" | "High";
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  color: string;
}

// Default schedule data
const defaultSchedule: ScheduleItem[] = [
  {
    id: "1",
    title: "Code Review Session",
    description: "Review pull requests for the mobile app project",
    date: "2020-11-17",
    startTime: "10:00",
    endTime: "11:00",
    location: "Development Room",
    type: "Task",
    priority: "High",
    assignee: {
      id: "1",
      name: "Blake Silva",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    status: "Scheduled",
    color: "#3f8cff"
  },
  {
    id: "2",
    title: "Design System Update",
    description: "Update design components and documentation",
    date: "2020-11-17",
    startTime: "14:00",
    endTime: "16:00",
    type: "Task",
    priority: "Medium",
    assignee: {
      id: "2",
      name: "Oscar Holloway",
      avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    status: "In Progress",
    color: "#de92eb"
  },
  {
    id: "3",
    title: "Project Deadline",
    description: "Final submission for Q4 project deliverables",
    date: "2020-11-20",
    startTime: "17:00",
    endTime: "17:00",
    type: "Deadline",
    priority: "High",
    assignee: {
      id: "3",
      name: "Emily Tyler",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    status: "Scheduled",
    color: "#ff6b6b"
  },
  {
    id: "4",
    title: "Team Lunch",
    description: "Monthly team building lunch",
    date: "2020-11-18",
    startTime: "12:00",
    endTime: "13:30",
    location: "Restaurant Downtown",
    type: "Break",
    priority: "Low",
    assignee: {
      id: "4",
      name: "Shawn Stone",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    status: "Scheduled",
    color: "#0ac846"
  }
];

export const CalendarScheduleSection = (): JSX.Element => {
  // Use localStorage hook for persistent data
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>("calendar_schedule", defaultSchedule);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "Task" as ScheduleItem["type"],
    priority: "Medium" as ScheduleItem["priority"],
    assigneeId: "",
    color: "#3f8cff"
  });

  // Available assignees
  const availableAssignees = [
    { id: "1", name: "Blake Silva", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: "2", name: "Oscar Holloway", avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: "3", name: "Emily Tyler", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: "4", name: "Shawn Stone", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
    { id: "5", name: "Louis Castro", avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
  ];

  // Type colors
  const typeColors = {
    Task: "#3f8cff",
    Meeting: "#de92eb",
    Deadline: "#ff6b6b",
    Reminder: "#ffbd21",
    Break: "#0ac846"
  };

  // Status colors
  const statusColors = {
    Scheduled: "#ffbd21",
    "In Progress": "#3f8cff",
    Completed: "#0ac846",
    Cancelled: "#ff6b6b"
  };

  // Priority colors
  const priorityColors = {
    Low: "#0ac846",
    Medium: "#ffbd21",
    High: "#ff6b6b"
  };

  // Filter schedule
  const filteredSchedule = schedule.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.assignee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "All") {
      const itemDate = new Date(item.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      switch (dateFilter) {
        case "Today":
          matchesDate = itemDate.toDateString() === today.toDateString();
          break;
        case "Tomorrow":
          matchesDate = itemDate.toDateString() === tomorrow.toDateString();
          break;
        case "This Week":
          matchesDate = itemDate >= today && itemDate <= nextWeek;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Group by date
  const groupedSchedule = filteredSchedule.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, ScheduleItem[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedSchedule).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const handleCreateItem = () => {
    if (!newItem.title.trim() || !newItem.date || !newItem.startTime || !newItem.assigneeId) return;

    const assignee = availableAssignees.find(a => a.id === newItem.assigneeId);
    if (!assignee) return;

    const item: ScheduleItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      date: newItem.date,
      startTime: newItem.startTime,
      endTime: newItem.endTime || newItem.startTime,
      location: newItem.location,
      type: newItem.type,
      priority: newItem.priority,
      assignee: assignee,
      status: "Scheduled",
      color: newItem.color
    };

    setSchedule(prev => [...prev, item]);
    setNewItem({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "Task",
      priority: "Medium",
      assigneeId: "",
      color: "#3f8cff"
    });
    setIsCreateDialogOpen(false);
  };

  const handleStatusChange = (itemId: string, newStatus: ScheduleItem["status"]) => {
    setSchedule(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const renderScheduleItem = (item: ScheduleItem) => (
    <Card key={item.id} className="rounded-2xl shadow-[0px_4px_20px_#c3cbd61b] hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div 
            className="w-1 h-16 rounded-full"
            style={{ backgroundColor: item.color }}
          ></div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-[#0a1629] font-['Nunito_Sans',Helvetica] mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                  {item.description}
                </p>
              </div>
              
              <Select 
                value={item.status} 
                onValueChange={(value: ScheduleItem["status"]) => handleStatusChange(item.id, value)}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs rounded-lg border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 text-[#7d8592] mr-1" />
                <span className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                  {formatTime(item.startTime)}
                  {item.endTime && item.endTime !== item.startTime && ` - ${formatTime(item.endTime)}`}
                </span>
              </div>
              
              {item.location && (
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 text-[#7d8592] mr-1" />
                  <span className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                    {item.location}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={item.assignee.avatar} alt={item.assignee.name} />
                  <AvatarFallback className="text-xs">{item.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                  {item.assignee.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: typeColors[item.type] }}
                  ></div>
                  <span className="text-xs font-semibold" style={{ color: typeColors[item.type] }}>
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: priorityColors[item.priority] }}
                  ></div>
                  <span className="text-xs font-semibold" style={{ color: priorityColors[item.priority] }}>
                    {item.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[28px]">
              Schedule ({filteredSchedule.length})
            </h2>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Schedule Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
                    Add Schedule Item
                  </DialogTitle>
                  <DialogDescription className="text-[#7d8592]">
                    Create a new item for the schedule.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Schedule item title"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assignee" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Assignee
                    </Label>
                    <Select value={newItem.assigneeId} onValueChange={(value) => setNewItem(prev => ({ ...prev, assigneeId: value }))}>
                      <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAssignees.map(assignee => (
                          <SelectItem key={assignee.id} value={assignee.id}>
                            {assignee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newItem.date}
                      onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newItem.startTime}
                      onChange={(e) => setNewItem(prev => ({ ...prev, startTime: e.target.value }))}
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newItem.endTime}
                      onChange={(e) => setNewItem(prev => ({ ...prev, endTime: e.target.value }))}
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newItem.location}
                      onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Location (optional)"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Type
                    </Label>
                    <Select value={newItem.type} onValueChange={(value: ScheduleItem["type"]) => setNewItem(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Task">Task</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Deadline">Deadline</SelectItem>
                        <SelectItem value="Reminder">Reminder</SelectItem>
                        <SelectItem value="Break">Break</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Priority
                    </Label>
                    <Select value={newItem.priority} onValueChange={(value: ScheduleItem["priority"]) => setNewItem(prev => ({ ...prev, priority: value }))}>
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
                    onClick={handleCreateItem}
                    className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                  >
                    Add Item
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7d8592]" />
              <Input
                placeholder="Search schedule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-[14px] border-gray-200 font-['Nunito_Sans',Helvetica]"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Task">Task</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Deadline">Deadline</SelectItem>
                <SelectItem value="Reminder">Reminder</SelectItem>
                <SelectItem value="Break">Break</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Dates</SelectItem>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <div className="space-y-6">
        {sortedDates.length === 0 ? (
          <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-[#0a1629] mb-2">No Schedule Items Found</h3>
              <p className="text-[#7d8592] mb-6">
                {searchTerm || typeFilter !== "All" || statusFilter !== "All" || dateFilter !== "All"
                  ? "No items match your current filters. Try adjusting your search criteria."
                  : "You haven't created any schedule items yet. Add your first item to get started."
                }
              </p>
              {!searchTerm && typeFilter === "All" && statusFilter === "All" && dateFilter === "All" && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Your First Item
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
                  {formatDate(date)}
                </h3>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                  {groupedSchedule[date].length} item{groupedSchedule[date].length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-3">
                {groupedSchedule[date]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(renderScheduleItem)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};