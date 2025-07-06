import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
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

interface CalendarEvent {
  id: string;
  title: string;
  date: number;
  color: string;
  time?: string;
}

// Default events data
const defaultEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: 5,
    color: "#3f8cff",
    time: "10:00 AM"
  },
  {
    id: "2", 
    title: "Project Review",
    date: 12,
    color: "#de92eb",
    time: "2:00 PM"
  },
  {
    id: "3",
    title: "Client Call",
    date: 18,
    color: "#0ac846",
    time: "3:30 PM"
  },
  {
    id: "4",
    title: "Design Workshop",
    date: 25,
    color: "#ffbd21",
    time: "9:00 AM"
  },
  {
    id: "5",
    title: "Sprint Planning",
    date: 30,
    color: "#ff6b6b",
    time: "11:00 AM"
  }
];

export const CalendarSection = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date(2020, 10, 1)); // November 2020
  
  // Use localStorage hook for persistent events data
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>(STORAGE_KEYS.CALENDAR_EVENTS, defaultEvents);

  // Form state for new event
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    color: "#3f8cff"
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const eventColors = [
    { value: "#3f8cff", label: "Blue" },
    { value: "#de92eb", label: "Purple" },
    { value: "#0ac846", label: "Green" },
    { value: "#ffbd21", label: "Orange" },
    { value: "#ff6b6b", label: "Red" },
    { value: "#20c997", label: "Teal" },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedDate(null);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title.trim()) return;
    
    const eventDate = selectedDate || new Date().getDate();
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: eventDate,
      color: newEvent.color,
      time: newEvent.time || "12:00 PM"
    };

    setEvents(prev => [...prev, event]);
    
    // Reset form
    setNewEvent({ title: "", time: "", color: "#3f8cff" });
    setSelectedDate(null);
    setIsDialogOpen(false);
  };

  const handleCancelEvent = () => {
    setNewEvent({ title: "", time: "", color: "#3f8cff" });
    setSelectedDate(null);
    setIsDialogOpen(false);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-[120px] p-2 border-r border-b border-gray-100"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter(event => event.date === day);
      const isToday = day === 17; // Highlighting Nov 17 as shown in the design
      
      days.push(
        <div 
          key={day} 
          className="h-[120px] p-2 border-r border-b border-gray-100 bg-white hover:bg-blue-50 transition-colors cursor-pointer"
          onClick={() => handleDayClick(day)}
        >
          <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-[#3f8cff]' : 'text-[#0a1629]'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: event.color }}
                title={`${event.title} - ${event.time}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Could add edit functionality here
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full space-y-6">
      {/* Calendar Header */}
      <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[28px]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleAddEvent}
                  className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
                    {selectedDate ? `Add Event - ${monthNames[currentDate.getMonth()]} ${selectedDate}` : 'Add New Event'}
                  </DialogTitle>
                  <DialogDescription className="text-[#7d8592]">
                    Create a new event for your calendar. Fill in the details below.
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
                      className="col-span-3 rounded-[14px] border-gray-200 font-['Nunito_Sans',Helvetica]"
                    />
                  </div>
                  
                  {!selectedDate && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Date
                      </Label>
                      <Select onValueChange={(value) => setSelectedDate(parseInt(value))}>
                        <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                          <SelectValue placeholder="Select a date" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map(day => (
                            <SelectItem key={day} value={day.toString()}>
                              {monthNames[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Time
                    </Label>
                    <Input
                      id="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="e.g., 2:00 PM"
                      className="col-span-3 rounded-[14px] border-gray-200 font-['Nunito_Sans',Helvetica]"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Color
                    </Label>
                    <Select value={newEvent.color} onValueChange={(value) => setNewEvent(prev => ({ ...prev, color: value }))}>
                      <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: newEvent.color }}
                            ></div>
                            {eventColors.find(c => c.value === newEvent.color)?.label}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {eventColors.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: color.value }}
                              ></div>
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEvent}
                    className="rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleSaveEvent}
                    className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                  >
                    Save Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Calendar Grid */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-[#f4f9fd]">
              {dayNames.map(day => (
                <div key={day} className="p-4 text-center font-['Nunito_Sans',Helvetica] font-semibold text-[#7d8592] text-sm border-r border-gray-100 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
        <CardContent className="p-6">
          <h3 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[22px] mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {events
              .sort((a, b) => a.date - b.date)
              .slice(0, 5)
              .map(event => (
              <div key={event.id} className="flex items-center space-x-4 p-3 bg-[#f4f9fd] rounded-[14px] hover:bg-blue-50 transition-colors">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: event.color }}
                ></div>
                <div className="flex-1">
                  <p className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">
                    {event.title}
                  </p>
                  <p className="font-['Nunito_Sans',Helvetica] text-[#7d8592] text-xs">
                    {monthNames[currentDate.getMonth()]} {event.date}, {currentDate.getFullYear()} • {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};