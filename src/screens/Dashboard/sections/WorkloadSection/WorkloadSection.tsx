import { ArrowRightIcon, FilterIcon, SearchIcon, UserPlusIcon, EditIcon, EyeIcon } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  level: "Junior" | "Middle" | "Senior";
  image: string;
  workload: number; // percentage 0-100
  department: string;
  email: string;
  joinDate: string;
  currentProjects: string[];
  skills: string[];
  isActive: boolean;
}

// Default team members data
const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Shawn Stone",
    role: "UI/UX Designer",
    level: "Middle",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    workload: 85,
    department: "Design",
    email: "shawn.stone@company.com",
    joinDate: "2019-03-15",
    currentProjects: ["Medical App", "E-commerce Platform"],
    skills: ["Figma", "Adobe XD", "Prototyping"],
    isActive: true
  },
  {
    id: "2",
    name: "Randy Delgado",
    role: "UI/UX Designer",
    level: "Junior",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    workload: 60,
    department: "Design",
    email: "randy.delgado@company.com",
    joinDate: "2020-08-10",
    currentProjects: ["Food Delivery Service"],
    skills: ["Sketch", "InVision", "User Research"],
    isActive: true
  },
  {
    id: "3",
    name: "Emily Tyler",
    role: "Copywriter",
    level: "Middle",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    workload: 70,
    department: "Marketing",
    email: "emily.tyler@company.com",
    joinDate: "2018-11-20",
    currentProjects: ["Medical App", "CRM Dashboard"],
    skills: ["Content Strategy", "SEO", "Brand Writing"],
    isActive: true
  },
  {
    id: "4",
    name: "Louis Castro",
    role: "Copywriter",
    level: "Senior",
    image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    workload: 95,
    department: "Marketing",
    email: "louis.castro@company.com",
    joinDate: "2017-05-12",
    currentProjects: ["E-commerce Platform", "Food Delivery Service", "CRM Dashboard"],
    skills: ["Technical Writing", "UX Writing", "Content Management"],
    isActive: true
  },
  {
    id: "5",
    name: "Blake Silva",
    role: "iOS Developer",
    level: "Senior",
    image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    workload: 80,
    department: "Development",
    email: "blake.silva@company.com",
    joinDate: "2016-09-08",
    currentProjects: ["Medical App"],
    skills: ["Swift", "Objective-C", "iOS SDK"],
    isActive: true
  },
  {
    id: "6",
    name: "Joel Phillips",
    role: "UI/UX Designer",
    level: "Middle",
    image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    workload: 75,
    department: "Design",
    email: "joel.phillips@company.com",
    joinDate: "2019-01-25",
    currentProjects: ["E-commerce Platform", "CRM Dashboard"],
    skills: ["UI Design", "Design Systems", "Accessibility"],
    isActive: true
  },
  {
    id: "7",
    name: "Wayne Marsh",
    role: "Copywriter",
    level: "Junior",
    image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    workload: 45,
    department: "Marketing",
    email: "wayne.marsh@company.com",
    joinDate: "2020-10-15",
    currentProjects: ["Food Delivery Service"],
    skills: ["Social Media", "Blog Writing", "Email Marketing"],
    isActive: true
  },
  {
    id: "8",
    name: "Oscar Holloway",
    role: "UI/UX Designer",
    level: "Middle",
    image: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    workload: 90,
    department: "Design",
    email: "oscar.holloway@company.com",
    joinDate: "2018-07-03",
    currentProjects: ["Medical App", "E-commerce Platform"],
    skills: ["User Experience", "Wireframing", "Interaction Design"],
    isActive: true
  }
];

export const WorkloadSection = (): JSX.Element => {
  // Use localStorage hook for persistent data
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>("team_members", defaultTeamMembers);

  // Filter and view states
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [workloadFilter, setWorkloadFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAllMembers, setShowAllMembers] = useState(false);

  // Dialog states
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isViewMemberOpen, setIsViewMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    level: "Junior" as TeamMember["level"],
    department: "",
    email: "",
    workload: 50,
    skills: "",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
  });

  // Get unique departments and roles
  const departments = Array.from(new Set(teamMembers.map(member => member.department)));
  const roles = Array.from(new Set(teamMembers.map(member => member.role)));

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "All" || member.department === departmentFilter;
    const matchesLevel = levelFilter === "All" || member.level === levelFilter;
    
    let matchesWorkload = true;
    if (workloadFilter !== "All") {
      switch (workloadFilter) {
        case "Low":
          matchesWorkload = member.workload < 50;
          break;
        case "Medium":
          matchesWorkload = member.workload >= 50 && member.workload < 80;
          break;
        case "High":
          matchesWorkload = member.workload >= 80;
          break;
      }
    }
    
    return matchesSearch && matchesDepartment && matchesLevel && matchesWorkload;
  });

  // Display members (show 8 by default, all if showAllMembers is true)
  const displayMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 8);

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "#ff6b6b"; // Red - Overloaded
    if (workload >= 80) return "#ffbd21"; // Orange - High
    if (workload >= 60) return "#3f8cff"; // Blue - Normal
    return "#0ac846"; // Green - Low
  };

  const getWorkloadStatus = (workload: number) => {
    if (workload >= 90) return "Overloaded";
    if (workload >= 80) return "High";
    if (workload >= 60) return "Normal";
    return "Available";
  };

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.role.trim() || !newMember.department.trim() || !newMember.email.trim()) return;

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      role: newMember.role,
      level: newMember.level,
      image: newMember.image,
      workload: newMember.workload,
      department: newMember.department,
      email: newMember.email,
      joinDate: new Date().toISOString().split('T')[0],
      currentProjects: [],
      skills: newMember.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      isActive: true
    };

    setTeamMembers(prev => [...prev, member]);
    setNewMember({
      name: "",
      role: "",
      level: "Junior",
      department: "",
      email: "",
      workload: 50,
      skills: "",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
    });
    setIsAddMemberOpen(false);
  };

  const handleViewMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsViewMemberOpen(true);
  };

  const handleUpdateWorkload = (memberId: string, newWorkload: number) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, workload: newWorkload } : member
    ));
  };

  const renderMemberCard = (member: TeamMember) => (
    <Card
      key={member.id}
      className="bg-[#f4f9fd] rounded-3xl border-none hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => handleViewMember(member)}
    >
      <CardContent className="flex flex-col items-center pt-[18px] pb-[18px] relative">
        {/* Edit button - shows on hover */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            handleViewMember(member);
          }}
        >
          <EyeIcon className="h-3 w-3 text-[#3f8cff]" />
        </Button>

        <div className="relative w-[58px] h-[58px] mb-[15px]">
          <div
            className="relative w-[60px] h-[60px] rounded-[30px] border-2 border-solid"
            style={{ borderColor: getWorkloadColor(member.workload) }}
          >
            {/* Progress ring */}
            <div className="absolute inset-0 rounded-full">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r="28"
                  stroke={getWorkloadColor(member.workload)}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="175.93"
                  strokeDashoffset={175.93 - (175.93 * member.workload) / 100}
                  className="opacity-80 transition-all duration-300"
                />
              </svg>
            </div>
          </div>
          <img
            className="w-[50px] h-[50px] absolute top-1 left-1 object-cover rounded-full"
            alt={`${member.name} profile photo`}
            src={member.image}
          />
          
          {/* Workload percentage badge */}
          <div 
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: getWorkloadColor(member.workload) }}
          >
            {member.workload}%
          </div>
        </div>

        <h3 className="font-bold text-base text-[#0a1629] text-center mb-1 [font-family:'Nunito_Sans',Helvetica]">
          {member.name}
        </h3>

        <p className="font-normal text-sm text-[#0a1629] text-center mb-2 [font-family:'Nunito_Sans',Helvetica]">
          {member.role}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="rounded overflow-hidden border border-solid border-[#7d8592] px-2 py-1 flex items-center justify-center">
            <span className="font-semibold text-xs text-[#7d8592] [font-family:'Nunito_Sans',Helvetica]">
              {member.level}
            </span>
          </div>
          <div 
            className="rounded px-2 py-1 flex items-center justify-center"
            style={{ backgroundColor: `${getWorkloadColor(member.workload)}20`, color: getWorkloadColor(member.workload) }}
          >
            <span className="font-semibold text-xs [font-family:'Nunito_Sans',Helvetica]">
              {getWorkloadStatus(member.workload)}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#7d8592] text-center [font-family:'Nunito_Sans',Helvetica]">
          {member.currentProjects.length} active project{member.currentProjects.length !== 1 ? 's' : ''}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <section className="w-full">
      <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
        <CardContent className="p-7">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[22px] text-[#0a1629] [font-family:'Nunito_Sans',Helvetica]">
              Team Workload ({filteredMembers.length})
            </h2>
            <div className="flex items-center gap-4">
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold">
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
                      Add Team Member
                    </DialogTitle>
                    <DialogDescription className="text-[#7d8592]">
                      Add a new team member to track their workload.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Full name"
                        className="col-span-3 rounded-[14px] border-gray-200"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@company.com"
                        className="col-span-3 rounded-[14px] border-gray-200"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Role
                      </Label>
                      <Input
                        id="role"
                        value={newMember.role}
                        onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="e.g., UI/UX Designer"
                        className="col-span-3 rounded-[14px] border-gray-200"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={newMember.department}
                        onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="e.g., Design"
                        className="col-span-3 rounded-[14px] border-gray-200"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="level" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Level
                      </Label>
                      <Select value={newMember.level} onValueChange={(value: TeamMember["level"]) => setNewMember(prev => ({ ...prev, level: value }))}>
                        <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Middle">Middle</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="workload" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Workload
                      </Label>
                      <div className="col-span-3 space-y-2">
                        <Input
                          id="workload"
                          type="range"
                          min="0"
                          max="100"
                          value={newMember.workload}
                          onChange={(e) => setNewMember(prev => ({ ...prev, workload: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-[#7d8592]">
                          <span>0%</span>
                          <span className="font-semibold">{newMember.workload}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="skills" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Skills
                      </Label>
                      <Input
                        id="skills"
                        value={newMember.skills}
                        onChange={(e) => setNewMember(prev => ({ ...prev, skills: e.target.value }))}
                        placeholder="Figma, Adobe XD, Prototyping"
                        className="col-span-3 rounded-[14px] border-gray-200"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddMemberOpen(false)}
                      className="rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      onClick={handleAddMember}
                      className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                    >
                      Add Member
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="flex items-center text-[#3f8cff] cursor-pointer hover:text-[#3f8cff]/80"
              >
                <span className="font-semibold text-base [font-family:'Nunito_Sans',Helvetica]">
                  {showAllMembers ? "Show Less" : "View all"}
                </span>
                <ArrowRightIcon className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7d8592]" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-[14px] border-gray-200 font-['Nunito_Sans',Helvetica]"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[150px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[120px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Middle">Middle</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>

            <Select value={workloadFilter} onValueChange={setWorkloadFilter}>
              <SelectTrigger className="w-[140px] rounded-[14px] border-gray-200">
                <SelectValue placeholder="Workload" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Workload</SelectItem>
                <SelectItem value="Low">Low (&lt;50%)</SelectItem>
                <SelectItem value="Medium">Medium (50-80%)</SelectItem>
                <SelectItem value="High">High (80%+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-4 gap-4">
            {displayMembers.map(renderMemberCard)}
          </div>

          {/* Show more indicator */}
          {!showAllMembers && filteredMembers.length > 8 && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={() => setShowAllMembers(true)}
                className="text-[#3f8cff] hover:text-[#3f8cff]/80"
              >
                +{filteredMembers.length - 8} more members
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Member Dialog */}
      <Dialog open={isViewMemberOpen} onOpenChange={setIsViewMemberOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
              Team Member Details
            </DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    className="w-20 h-20 rounded-full object-cover"
                    src={selectedMember.image}
                    alt={selectedMember.name}
                  />
                  <div 
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: getWorkloadColor(selectedMember.workload) }}
                  >
                    {selectedMember.workload}%
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                    {selectedMember.name}
                  </h3>
                  <p className="text-[#7d8592] font-['Nunito_Sans',Helvetica] mb-2">
                    {selectedMember.role} • {selectedMember.level}
                  </p>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                    {selectedMember.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: `${getWorkloadColor(selectedMember.workload)}20`, 
                        color: getWorkloadColor(selectedMember.workload) 
                      }}
                    >
                      {getWorkloadStatus(selectedMember.workload)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#f4f9fd] rounded-[14px] p-4">
                  <h4 className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica] mb-3">
                    Work Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-[#7d8592]">Department:</span>
                      <span className="ml-2 font-semibold text-[#0a1629]">{selectedMember.department}</span>
                    </div>
                    <div>
                      <span className="text-sm text-[#7d8592]">Join Date:</span>
                      <span className="ml-2 font-semibold text-[#0a1629]">
                        {new Date(selectedMember.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-[#7d8592]">Current Workload:</span>
                      <span className="ml-2 font-semibold text-[#0a1629]">{selectedMember.workload}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f4f9fd] rounded-[14px] p-4">
                  <h4 className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica] mb-3">
                    Current Projects
                  </h4>
                  <div className="space-y-1">
                    {selectedMember.currentProjects.length > 0 ? (
                      selectedMember.currentProjects.map((project, index) => (
                        <div key={index} className="text-sm text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                          • {project}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                        No active projects
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#f4f9fd] rounded-[14px] p-4">
                <h4 className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica] mb-3">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-white text-[#3f8cff] text-sm font-semibold rounded-full border border-[#3f8cff]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#f4f9fd] rounded-[14px] p-4">
                <h4 className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica] mb-3">
                  Update Workload
                </h4>
                <div className="space-y-2">
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedMember.workload}
                    onChange={(e) => {
                      const newWorkload = parseInt(e.target.value);
                      setSelectedMember(prev => prev ? { ...prev, workload: newWorkload } : null);
                      handleUpdateWorkload(selectedMember.id, newWorkload);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-[#7d8592]">
                    <span>0%</span>
                    <span className="font-semibold">{selectedMember.workload}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsViewMemberOpen(false)}
              className="rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};