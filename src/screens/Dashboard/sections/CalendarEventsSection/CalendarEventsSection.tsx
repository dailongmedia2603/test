import { PlusIcon, SearchIcon, FilterIcon, EditIcon, TrashIcon, EyeIcon, CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from "lucide-react";
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

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: "Meeting" | "Workshop" | "Conference" | "Training" | "Social" | "Other";
  priority: "Low" | "Medium" | "High";
  attendees: {
    id: string;
    name: string;
    avatar: string;
    status: "Accepted" | "Declined" | "Pending";
  }[];
  organizer: string;
  color: string;
  isRecurring: boolean;
  recurringType?: "Daily" | "Weekly" | "Monthly";
}

// Default events data
const defaultEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup Meeting",
    description: "Daily standup meeting to discuss progress and blockers",
    date: "2020-11-17",
    startTime: "09:00",
    endTime: "09:30",
    location: "Conference Room A",
    type: "Meeting",
    priority: "High",
    attendees: [
      { id: "1", name: "Emily Tyler", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", status: "Accepted" },
      { id: "2", name: "Oscar Holloway", avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", status: "Accepted" },
      { id: "3", name: "Blake Silva", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", status: "Pending" }
    ],
    organizer: "Evan Yates",
    color: "#3f8cff",
    isRecurring: true,
    recurringType: "Daily"
  },
  {
    id: "2",
    title: "Design Workshop",
    description: "UI/UX design workshop for the new mobile app",
    date: "2020-11-18",
    startTime: "14:00",
    endTime: "16:00",
    location: "Design Studio",
    type: "Workshop",
    priority: "Medium",
    attendees: [
      { id: "4", name: "Shawn Stone", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", status: "Accepted" },
      { id: "5", name: "Joel Phillips", avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", status: "Accepted" }
    ],
    organizer: "Oscar Holloway",
    color: "#de92eb",
    isRecurring: false
  },
  {
    id: "3",
    title: "Client Presentation",
    description: "Quarterly review presentation for key stakeholders",
    date: "2020-11-20",
    startTime: "10:00",
    endTime: "11:30",
    location: "Main Conference Room",
    type: "Meeting",
    priority: "High",
    attendees: [
      { id: "6", name: "Louis Castro", avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", status: "Accepted" },
      { id: "7", name: "Wayne Marsh", avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", status: "Declined" }
    ],
    organizer: "Evan Yates",
    color: "#ff6b6b",
    isRecurring: false
  }
];

export const CalendarEventsSection = (): JSX.Element => {
  // Use localStorage hook for persistent data
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>("calendar_events_detailed", defaultEvents);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "Meeting" as CalendarEvent["type"],
    priority: "Medium" as CalendarEvent["priority"],
    color: "#3f8cff"
  });

  // Type colors
  const typeColors = {
    Meeting: "#3f8cff",
    Workshop: "#de92eb",
    Conference: "#0ac846",
    Training: "#ffbd21",
    Social: "#ff6b6b",
    Other: "#7d8592"
  };

  // Priority colors
  const priorityColors = {
    Low: "#0ac846",
    Medium: "#ffbd21",
    High: "#ff6b6b"
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || event.type === typeFilter;
    const matchesPriority = priorityFilter === "All" || event.priority === priorityFilter;
    
    let matchesDate = true;
    if (dateFilter !== "All") {
      const eventDate = new Date(event.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      switch (dateFilter) {
        case "Today":
          matchesDate = eventDate.toDateString() === today.toDateString();
          break;
        case "Tomorrow":
          matchesDate = eventDate.toDateString() === tomorrow.toDateString();
          break;
        case "This Week":
          matchesDate = eventDate >= today && eventDate <= nextWeek;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesPriority && matchesDate;
  });

  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.startTime || !newEvent.endTime) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      location: newEvent.location,
      type: newEvent.type,
      priority: newEvent.priority,
      attendees: [],
      organizer: "Evan Yates",
      color: newEvent.color,
      isRecurring: false
    };

    setEvents(prev => [event, ...prev]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "Meeting",
      priority: "Medium",
      color: "#3f8cff"
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  const openViewDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
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
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderEventCard = (event: CalendarEvent) => (
    <Card key={event.id} className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b] hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-3">
              <div 
                className="w-4 h-16 rounded-full"
                style={{ backgroundColor: event.color }}
              ></div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-[#0a1629] font-['Nunito_Sans',Helvetica] mb-1">
                  {event.title}
                </h3>
                <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica] mb-3">
                  {event.description}
                </p>
                
                <div className="flex items-center gap-6 mb-3">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 text-[#7d8592] mr-2" />
                    <span className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 text-[#7d8592] mr-2" />
                    <span className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center mb-3">
                    <MapPinIcon className="w-4 h-4 text-[#7d8592] mr-2" />
                    <span className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                      {event.location}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: typeColors[event.type] }}
                    ></div>
                    <span className="text-sm font-semibold" style={{ color: typeColors[event.type] }}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: priorityColors[event.priority] }}
                    ></div>
                    <span className="text-sm font-semibold" style={{ color: priorityColors[event.priority] }}>
                      {event.priority} Priority
                    </span>
                  </div>
                  {event.isRecurring && (
                    <span className="text-xs bg-[#f4f9fd] text-[#3f8cff] px-2 py-1 rounded-full font-semibold">
                      Recurring
                    </span>
                  )}
                </div>
              </div>
            </div>

            {event.attendees.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <UsersIcon className="w-4 h-4 text-[#7d8592]" />
                <div className="flex -space-x-2">
                  {event.attendees.slice(0, 4).map((attendee, index) => (
                    <Avatar
                      key={attendee.id}
                      className="w-[26px] h-[26px] border-2 border-white"
                      style={{ zIndex: 4 - index }}
                    >
                      <AvatarImage src={attendee.avatar} alt={attendee.name} />
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {event.attendees.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-[#3f8cff] flex items-center justify-center -ml-1 border-2 border-white">
                      <span className="font-semibold text-xs text-white">
                        +{event.attendees.length - 4}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                  {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openViewDialog(event)}
              className="h-8 w-8 p-0 hover:bg-blue-50"
            >
              <EyeIcon className="h-4 w-4 text-[#3f8cff]" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteEvent(event.id)}
              className="h-8 w-8 p-0 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 text-[#ff6b6b]" />
            </Button>
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
              Calendar Events ({filteredEvents.length})
            </h2>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
                    Create New Event
                  </DialogTitle>
                  <DialogDescription className="text-[#7d8592]">
                    Fill in the details to create a new calendar event.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Event title"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Event description"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
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
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
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
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Event location"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Type
                    </Label>
                    <Select value={newEvent.type} onValueChange={(value: CalendarEvent["type"]) => setNewEvent(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Conference">Conference</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Priority
                    </Label>
                    <Select value={newEvent.priority} onValueChange={(value: CalendarEvent["priority"]) => setNewEvent(prev => ({ ...prev, priority: value }))}>
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
                    onClick={handleCreateEvent}
                    className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                  >
                    Create Event
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
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-[14px] border-gray-200 font-['Nunito_Sans',Helvetica]"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
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

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px] rounded-[14px] border-gray-200">
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

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.length === 0 ? (
          <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-[#0a1629] mb-2">No Events Found</h3>
              <p className="text-[#7d8592] mb-6">
                {searchTerm || typeFilter !== "All" || priorityFilter !== "All" || dateFilter !== "All"
                  ? "No events match your current filters. Try adjusting your search criteria."
                  : "You haven't created any events yet. Create your first event to get started."
                }
              </p>
              {!searchTerm && typeFilter === "All" && priorityFilter === "All" && dateFilter === "All" && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map(renderEventCard)
        )}
      </div>

      {/* View Event Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
              Event Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div 
                  className="w-4 h-16 rounded-full"
                  style={{ backgroundColor: selectedEvent.color }}
                ></div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-[#0a1629] font-['Nunito_Sans',Helvetica] mb-2">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-[#7d8592] font-['Nunito_Sans',Helvetica] mb-4">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>

              <div className="bg-[#f4f9fd] rounded-[14px] p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Date</p>
                    <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                      {formatDate(selectedEvent.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Time</p>
                    <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                      {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </p>
                  </div>
                  {selectedEvent.location && (
                    <div>
                      <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Location</p>
                      <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                        {selectedEvent.location}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Organizer</p>
                    <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                      {selectedEvent.organizer}
                    </p>
                  </div>
                </div>
              </div>

              {selectedEvent.attendees.length > 0 && (
                <div>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica] mb-3">
                    Attendees ({selectedEvent.attendees.length})
                  </p>
                  <div className="space-y-2">
                    {selectedEvent.attendees.map(attendee => (
                      <div key={attendee.id} className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={attendee.avatar} alt={attendee.name} />
                          <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-['Nunito_Sans',Helvetica] text-[#0a1629]">
                          {attendee.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          attendee.status === "Accepted" ? "bg-green-100 text-green-800" :
                          attendee.status === "Declined" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {attendee.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
              className="rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};