import { ChevronDownIcon, PlusIcon, TrashIcon, EyeIcon, MessageSquareIcon, FileIcon, CheckIcon } from "lucide-react";
import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
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

interface ActivityItem {
  id: string;
  type: "status" | "attachment" | "comment" | "task" | "meeting";
  content: string;
  icon: string;
  timestamp: string;
  projectId?: string;
  projectName?: string;
}

interface Activity {
  id: string;
  user: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  items: ActivityItem[];
  timestamp: string;
}

// Default activity data
const defaultActivities: Activity[] = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Oscar Holloway",
      role: "UI/UX Designer",
      avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    },
    items: [
      {
        id: "a1",
        type: "status",
        content: "Updated the status of Mind Map task to In Progress",
        icon: "📤",
        timestamp: "2020-11-17T10:30:00Z",
        projectId: "1",
        projectName: "Medical App"
      },
      {
        id: "a2",
        type: "attachment",
        content: "Attached files to the task",
        icon: "📎",
        timestamp: "2020-11-17T10:35:00Z",
        projectId: "1",
        projectName: "Medical App"
      },
    ],
    timestamp: "2020-11-17T10:30:00Z"
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "Emily Tyler",
      role: "Copywriter",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    },
    items: [
      {
        id: "b1",
        type: "comment",
        content: "Added feedback on the new design concepts",
        icon: "💬",
        timestamp: "2020-11-17T09:15:00Z",
        projectId: "2",
        projectName: "E-commerce Platform"
      },
    ],
    timestamp: "2020-11-17T09:15:00Z"
  },
  {
    id: "3",
    user: {
      id: "3",
      name: "Blake Silva",
      role: "iOS Developer",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    },
    items: [
      {
        id: "c1",
        type: "task",
        content: "Completed authentication module implementation",
        icon: "✅",
        timestamp: "2020-11-17T08:45:00Z",
        projectId: "1",
        projectName: "Medical App"
      },
    ],
    timestamp: "2020-11-17T08:45:00Z"
  }
];

// Available users for creating activities
const availableUsers = [
  { id: "1", name: "Oscar Holloway", role: "UI/UX Designer", avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1" },
  { id: "2", name: "Emily Tyler", role: "Copywriter", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1" },
  { id: "3", name: "Blake Silva", role: "iOS Developer", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1" },
  { id: "4", name: "Shawn Stone", role: "UI/UX Designer", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1" },
  { id: "5", name: "Louis Castro", role: "Copywriter", avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1" }
];

export const ActivityStreamSection = (): JSX.Element => {
  // Use localStorage hook for persistent data
  const [activities, setActivities] = useLocalStorage<Activity[]>("activity_stream", defaultActivities);

  // State for showing more activities
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewAllDialogOpen, setIsViewAllDialogOpen] = useState(false);

  // New activity form state
  const [newActivity, setNewActivity] = useState({
    userId: "",
    type: "status" as ActivityItem["type"],
    content: "",
    projectName: ""
  });

  // Activity type icons and colors
  const activityTypeConfig = {
    status: { icon: "📤", color: "#3f8cff", label: "Status Update" },
    attachment: { icon: "📎", color: "#de92eb", label: "File Attachment" },
    comment: { icon: "💬", color: "#0ac846", label: "Comment" },
    task: { icon: "✅", color: "#ffbd21", label: "Task Completion" },
    meeting: { icon: "🎯", color: "#ff6b6b", label: "Meeting" }
  };

  // Sort activities by timestamp (newest first)
  const sortedActivities = activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Display activities (show 3 by default, all if showAllActivities is true)
  const displayActivities = showAllActivities ? sortedActivities : sortedActivities.slice(0, 3);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleCreateActivity = () => {
    if (!newActivity.userId || !newActivity.content.trim()) return;

    const user = availableUsers.find(u => u.id === newActivity.userId);
    if (!user) return;

    const activityItem: ActivityItem = {
      id: Date.now().toString(),
      type: newActivity.type,
      content: newActivity.content,
      icon: activityTypeConfig[newActivity.type].icon,
      timestamp: new Date().toISOString(),
      projectName: newActivity.projectName || undefined
    };

    const activity: Activity = {
      id: Date.now().toString(),
      user: user,
      items: [activityItem],
      timestamp: new Date().toISOString()
    };

    setActivities(prev => [activity, ...prev]);
    setNewActivity({
      userId: "",
      type: "status",
      content: "",
      projectName: ""
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteActivity = (activityId: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
    }
  };

  const handleDeleteActivityItem = (activityId: string, itemId: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const updatedItems = activity.items.filter(item => item.id !== itemId);
        if (updatedItems.length === 0) {
          return null; // Mark for removal
        }
        return { ...activity, items: updatedItems };
      }
      return activity;
    }).filter(Boolean) as Activity[]);
  };

  return (
    <div className="w-full">
      <Card className="shadow-[0px_6px_58px_#c3cbd61b] rounded-3xl">
        <CardHeader className="pb-0 pt-7 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[22px] font-bold text-[#0a1629] [font-family:'Nunito_Sans',Helvetica]">
              Activity Stream
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
                      Add Activity
                    </DialogTitle>
                    <DialogDescription className="text-[#7d8592]">
                      Create a new activity entry for the team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        User
                      </Label>
                      <Select value={newActivity.userId} onValueChange={(value) => setNewActivity(prev => ({ ...prev, userId: value }))}>
                        <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUsers.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} - {user.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Type
                      </Label>
                      <Select value={newActivity.type} onValueChange={(value: ActivityItem["type"]) => setNewActivity(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(activityTypeConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.icon} {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Content
                      </Label>
                      <Input
                        id="content"
                        value={newActivity.content}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Describe the activity..."
                        className="col-span-3 rounded-[14px] border-gray-200"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Project
                      </Label>
                      <Input
                        id="project"
                        value={newActivity.projectName}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, projectName: e.target.value }))}
                        placeholder="Project name (optional)"
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
                      onClick={handleCreateActivity}
                      className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                    >
                      Add Activity
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {displayActivities.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-bold text-[#0a1629] mb-2">No Activities</h3>
                <p className="text-[#7d8592] mb-4">No team activities to display yet.</p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
              </div>
            ) : (
              displayActivities.map((activity) => (
                <div key={activity.id} className="mb-4 group">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-[50px] h-[50px]">
                      <AvatarImage
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {activity.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-base text-[#0a1629] [font-family:'Nunito_Sans',Helvetica] leading-6">
                            {activity.user.name}
                          </p>
                          <p className="text-sm text-[#91929e] [font-family:'Nunito_Sans',Helvetica]">
                            {activity.user.role} • {formatTimestamp(activity.timestamp)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-red-50"
                        >
                          <TrashIcon className="h-3 w-3 text-[#ff6b6b]" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {activity.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#f4f9fd] rounded-[14px] p-4 mb-4 flex items-start group/item hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-6 h-6 mr-4 flex items-center justify-center text-lg">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="[font-family:'Nunito_Sans',Helvetica] font-normal text-[#0a1629] text-base leading-6">
                          {item.content}
                        </p>
                        {item.projectName && (
                          <p className="text-sm text-[#3f8cff] font-semibold mt-1">
                            Project: {item.projectName}
                          </p>
                        )}
                        <p className="text-xs text-[#91929e] mt-1">
                          {formatTimestamp(item.timestamp)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteActivityItem(activity.id, item.id)}
                        className="opacity-0 group-hover/item:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-red-50 ml-2"
                      >
                        <TrashIcon className="h-3 w-3 text-[#ff6b6b]" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center items-center mt-4">
            {!showAllActivities && sortedActivities.length > 3 ? (
              <Button
                variant="ghost"
                onClick={() => setShowAllActivities(true)}
                className="text-[#3f8cff] font-semibold [font-family:'Nunito_Sans',Helvetica]"
              >
                View more ({sortedActivities.length - 3} more)
                <ChevronDownIcon className="ml-2 h-6 w-6" />
              </Button>
            ) : showAllActivities && sortedActivities.length > 3 ? (
              <Button
                variant="ghost"
                onClick={() => setShowAllActivities(false)}
                className="text-[#3f8cff] font-semibold [font-family:'Nunito_Sans',Helvetica]"
              >
                Show less
                <ChevronDownIcon className="ml-2 h-6 w-6 rotate-180" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};