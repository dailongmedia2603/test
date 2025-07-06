import { ChevronRightIcon, PlusIcon, EditIcon, TrashIcon, ClockIcon, MapPinIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
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

interface NearestEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  type: "Meeting" | "Birthday" | "Deadline" | "Event" | "Reminder";
  priority: "Low" | "Medium" | "High";
  color: string;
  isCompleted: boolean;
}

// Default events data
const defaultEvents: NearestEvent[] = [
  {
    id: "1",
    title: "Presentation of the new department",
    description: "Quarterly presentation for the new design department structure",
    date: "2020-11-17",
    time: "17:00",
    duration: "4h",
    location: "Conference Room A",
    type: "Meeting",
    priority: "High",
    color: "#3f8cff",
    isCompleted: false
  },
  {
    id: "2",
    title: "Anna's Birthday",
    description: "Team celebration for Anna's birthday",
    date: "2020-11-17",
    time: "18:00",
    duration: "4h",
    location: "Office Lounge",
    type: "Birthday",
    priority: "Medium",
    color: "#de92eb",
    isCompleted: false
  },
  {
    id: "3",
    title: "Ray's Birthday",
    description: "Birthday celebration for Ray from development team",
    date: "2020-11-18",
    time: "14:00",
    duration: "4h",
    location: "Restaurant Downtown",
    type: "Birthday",
    priority: "Medium",
    color: "#de92eb",
    isCompleted: false
  },
  {
    id: "4",
    title: "Project Deadline",
    description: "Final submission for Q4 mobile app project",
    date: "2020-11-20",
    time: "23:59",
    duration: "1h",
    type: "Deadline",
    priority: "High",
    color: "#ff6b6b",
    isCompleted: false
  }
];

export const NearestEventsSection = (): JSX.Element => {
  // Use localStorage hook for persistent data
  const [events, setEvents] = useLocalStorage<NearestEvent[]>("nearest_events", defaultEvents);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewAllDialogOpen, setIsViewAllDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "1h",
    location: "",
    type: "Meeting" as NearestEvent["type"],
    priority: "Medium" as NearestEvent["priority"]
  });

  // Type colors
  const typeColors = {
    Meeting: "#3f8cff",
    Birthday: "#de92eb",
    Deadline: "#ff6b6b",
    Event: "#0ac846",
    Reminder: "#ffbd21"
  };

  // Sort events by date and time, show only upcoming events
  const upcomingEvents = events
    .filter(event => !event.isCompleted)
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3); // Show only 3 nearest events

  const formatEventTime = (date: string, time: string) => {
    const eventDate = new Date(`${date} ${time}`);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let dayText = "";
    if (eventDate.toDateString() === today.toDateString()) {
      dayText = "Today";
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      dayText = "Tomorrow";
    } else {
      dayText = eventDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }

    const timeText = eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    return `${dayText} | ${timeText}`;
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.time) return;

    const event: NearestEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      duration: newEvent.duration,
      location: newEvent.location,
      type: newEvent.type,
      priority: newEvent.priority,
      color: typeColors[newEvent.type],
      isCompleted: false
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "1h",
      location: "",
      type: "Meeting",
      priority: "Medium"
    });
    setIsCreateDialogOpen(false);
  };

  const handleCompleteEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, isCompleted: true } : event
    ));
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-[0px_6px_58px_#c3cbd61b] rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between pb-0 pt-7 px-7">
          <CardTitle className="text-[22px] font-bold text-[#0a1629] [font-family:'Nunito_Sans',Helvetica]">
            Nearest Events
          </CardTitle>
          <div className="flex items-center gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-[#3f8cff] hover:bg-blue-50"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
                    Create New Event
                  </DialogTitle>
                  <DialogDescription className="text-[#7d8592]">
                    Add a new event to your nearest events list.
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
                    <Label htmlFor="type" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Type
                    </Label>
                    <Select value={newEvent.type} onValueChange={(value: NearestEvent["type"]) => setNewEvent(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Birthday">Birthday</SelectItem>
                        <SelectItem value="Deadline">Deadline</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Reminder">Reminder</SelectItem>
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
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 2h, 30m"
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
                    <Label htmlFor="priority" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Priority
                    </Label>
                    <Select value={newEvent.priority} onValueChange={(value: NearestEvent["priority"]) => setNewEvent(prev => ({ ...prev, priority: value }))}>
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

            <Button
              variant="ghost"
              className="flex items-center p-0 h-auto text-[#3f8cff] hover:bg-transparent"
              onClick={() => setIsViewAllDialogOpen(true)}
            >
              <span className="font-semibold text-base [font-family:'Nunito_Sans',Helvetica]">
                View all
              </span>
              <ChevronRightIcon className="w-6 h-6 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-6">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-bold text-[#0a1629] mb-2">No Upcoming Events</h3>
              <p className="text-[#7d8592] mb-4">You don't have any upcoming events.</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="relative h-[104px] mb-6 overflow-hidden group hover:bg-gray-50 rounded-lg transition-colors p-2"
              >
                <div
                  className="absolute w-1.5 h-full left-0 top-0 rounded-sm"
                  style={{ backgroundColor: event.color }}
                />

                {/* Action buttons - show on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCompleteEvent(event.id)}
                    className="h-6 w-6 p-0 hover:bg-green-50"
                    title="Mark as completed"
                  >
                    <ClockIcon className="h-3 w-3 text-[#0ac846]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="h-6 w-6 p-0 hover:bg-red-50"
                    title="Delete event"
                  >
                    <TrashIcon className="h-3 w-3 text-[#ff6b6b]" />
                  </Button>
                </div>

                <div className="ml-5 pt-1">
                  <h3 className="font-bold text-base text-[#0a1629] [font-family:'Nunito_Sans',Helvetica] leading-6 w-[185px] pr-8">
                    {event.title}
                  </h3>

                  {event.location && (
                    <div className="flex items-center mt-1">
                      <MapPinIcon className="w-3 h-3 text-[#7d8592] mr-1" />
                      <span className="text-xs text-[#7d8592] [font-family:'Nunito_Sans',Helvetica]">
                        {event.location}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6">
                    <span className="font-normal text-sm text-[#91929e] [font-family:'Nunito_Sans',Helvetica]">
                      {formatEventTime(event.date, event.time)}
                    </span>

                    <div className="w-[63px] h-9 overflow-hidden">
                      <div className="relative w-[65px] h-[38px] -top-px -left-px bg-[#f4f9fd] rounded-lg flex items-center">
                        <div className="w-6 h-6 ml-[9px]">
                          <div className="relative h-6 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-[#7d8592] rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-[#7d8592] rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        <span className="ml-1 font-bold text-xs text-[#7d8592] [font-family:'Nunito_Sans',Helvetica]">
                          {event.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute w-6 h-6 top-[5px] right-1 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: event.color }}
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* View All Events Dialog */}
      <Dialog open={isViewAllDialogOpen} onOpenChange={setIsViewAllDialogOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
              All Events ({events.length})
            </DialogTitle>
            <DialogDescription className="text-[#7d8592]">
              Manage all your events and their status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {events.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-lg font-bold text-[#0a1629] mb-2">No Events</h3>
                <p className="text-[#7d8592]">You haven't created any events yet.</p>
              </div>
            ) : (
              events
                .sort((a, b) => {
                  const dateA = new Date(`${a.date} ${a.time}`);
                  const dateB = new Date(`${b.date} ${b.time}`);
                  return dateA.getTime() - dateB.getTime();
                })
                .map((event) => (
                  <Card key={event.id} className={`rounded-2xl ${event.isCompleted ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div 
                            className="w-4 h-16 rounded-full"
                            style={{ backgroundColor: event.color }}
                          ></div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-[#0a1629] font-['Nunito_Sans',Helvetica] mb-1 ${event.isCompleted ? 'line-through' : ''}`}>
                              {event.title}
                            </h4>
                            <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica] mb-2">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-[#7d8592]">
                              <span>{formatEventTime(event.date, event.time)}</span>
                              <span>Duration: {event.duration}</span>
                              {event.location && (
                                <span className="flex items-center">
                                  <MapPinIcon className="w-3 h-3 mr-1" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span 
                                className="px-2 py-1 rounded-full text-xs font-semibold"
                                style={{ 
                                  backgroundColor: `${event.color}20`, 
                                  color: event.color 
                                }}
                              >
                                {event.type}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                event.priority === "High" ? "bg-red-100 text-red-800" :
                                event.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }`}>
                                {event.priority}
                              </span>
                              {event.isCompleted && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!event.isCompleted && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompleteEvent(event.id)}
                              className="h-8 w-8 p-0 hover:bg-green-50"
                              title="Mark as completed"
                            >
                              <ClockIcon className="h-4 w-4 text-[#0ac846]" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50"
                            title="Delete event"
                          >
                            <TrashIcon className="h-4 w-4 text-[#ff6b6b]" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsViewAllDialogOpen(false)}
              className="rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setIsViewAllDialogOpen(false);
                setIsCreateDialogOpen(true);
              }}
              className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};