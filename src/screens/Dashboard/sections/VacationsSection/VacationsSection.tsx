import { CalendarIcon, FilterIcon, PlusIcon, SearchIcon, MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, CheckIcon, XIcon, ClockIcon } from "lucide-react";
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
import { STORAGE_KEYS } from "../../../../lib/storage";

interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  employeeRole: string;
  type: "Annual Leave" | "Sick Leave" | "Personal Leave" | "Maternity Leave" | "Emergency Leave";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  priority: "Low" | "Medium" | "High";
  attachments?: string[];
}

interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  totalVacationDays: number;
  usedVacationDays: number;
  remainingDays: number;
}

// Default vacation requests data
const defaultVacationRequests: VacationRequest[] = [
  {
    id: "1",
    employeeId: "emp1",
    employeeName: "Emily Tyler",
    employeeAvatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    employeeRole: "Copywriter",
    type: "Annual Leave",
    startDate: "2020-12-20",
    endDate: "2020-12-25",
    days: 5,
    reason: "Christmas vacation with family",
    status: "Pending",
    submittedDate: "2020-11-15",
    priority: "Medium"
  },
  {
    id: "2",
    employeeId: "emp2",
    employeeName: "Oscar Holloway",
    employeeAvatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    employeeRole: "UI/UX Designer",
    type: "Sick Leave",
    startDate: "2020-11-18",
    endDate: "2020-11-20",
    days: 3,
    reason: "Medical treatment",
    status: "Approved",
    submittedDate: "2020-11-17",
    approvedBy: "Evan Yates",
    approvedDate: "2020-11-17",
    priority: "High"
  },
  {
    id: "3",
    employeeId: "emp3",
    employeeName: "Blake Silva",
    employeeAvatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    employeeRole: "iOS Developer",
    type: "Personal Leave",
    startDate: "2020-12-01",
    endDate: "2020-12-03",
    days: 3,
    reason: "Personal matters",
    status: "Rejected",
    submittedDate: "2020-11-10",
    approvedBy: "Evan Yates",
    approvedDate: "2020-11-12",
    rejectionReason: "Project deadline conflicts",
    priority: "Low"
  },
  {
    id: "4",
    employeeId: "emp4",
    employeeName: "Shawn Stone",
    employeeAvatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    employeeRole: "UI/UX Designer",
    type: "Annual Leave",
    startDate: "2020-12-28",
    endDate: "2021-01-05",
    days: 8,
    reason: "New Year vacation",
    status: "Approved",
    submittedDate: "2020-11-01",
    approvedBy: "Evan Yates",
    approvedDate: "2020-11-05",
    priority: "Medium"
  }
];

// Default employees data
const defaultEmployees: Employee[] = [
  {
    id: "emp1",
    name: "Emily Tyler",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    role: "Copywriter",
    department: "Marketing",
    totalVacationDays: 25,
    usedVacationDays: 12,
    remainingDays: 13
  },
  {
    id: "emp2",
    name: "Oscar Holloway",
    avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    role: "UI/UX Designer",
    department: "Design",
    totalVacationDays: 25,
    usedVacationDays: 8,
    remainingDays: 17
  },
  {
    id: "emp3",
    name: "Blake Silva",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    role: "iOS Developer",
    department: "Development",
    totalVacationDays: 25,
    usedVacationDays: 15,
    remainingDays: 10
  },
  {
    id: "emp4",
    name: "Shawn Stone",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    role: "UI/UX Designer",
    department: "Design",
    totalVacationDays: 25,
    usedVacationDays: 18,
    remainingDays: 7
  }
];

export const VacationsSection = (): JSX.Element => {
  // Use localStorage hooks for persistent data
  const [vacationRequests, setVacationRequests] = useLocalStorage<VacationRequest[]>("vacation_requests", defaultVacationRequests);
  const [employees, setEmployees] = useLocalStorage<Employee[]>("employees", defaultEmployees);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"requests" | "employees" | "calendar">("requests");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VacationRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    employeeId: "",
    type: "Annual Leave" as VacationRequest["type"],
    startDate: "",
    endDate: "",
    reason: "",
    priority: "Medium" as VacationRequest["priority"]
  });

  // Status colors
  const statusColors = {
    Pending: "#ffbd21",
    Approved: "#0ac846",
    Rejected: "#ff6b6b",
    Cancelled: "#7d8592"
  };

  // Type colors
  const typeColors = {
    "Annual Leave": "#3f8cff",
    "Sick Leave": "#ff6b6b",
    "Personal Leave": "#de92eb",
    "Maternity Leave": "#0ac846",
    "Emergency Leave": "#ffbd21"
  };

  // Filter requests
  const filteredRequests = vacationRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || request.status === statusFilter;
    const matchesType = typeFilter === "All" || request.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleCreateRequest = () => {
    if (!newRequest.employeeId || !newRequest.startDate || !newRequest.endDate || !newRequest.reason.trim()) return;

    const employee = employees.find(emp => emp.id === newRequest.employeeId);
    if (!employee) return;

    const days = calculateDays(newRequest.startDate, newRequest.endDate);
    
    const request: VacationRequest = {
      id: Date.now().toString(),
      employeeId: newRequest.employeeId,
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      employeeRole: employee.role,
      type: newRequest.type,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      days: days,
      reason: newRequest.reason,
      status: "Pending",
      submittedDate: new Date().toISOString().split('T')[0],
      priority: newRequest.priority
    };

    setVacationRequests(prev => [request, ...prev]);
    setNewRequest({
      employeeId: "",
      type: "Annual Leave",
      startDate: "",
      endDate: "",
      reason: "",
      priority: "Medium"
    });
    setIsCreateDialogOpen(false);
  };

  const handleApproveRequest = (requestId: string) => {
    setVacationRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: "Approved" as const,
            approvedBy: "Evan Yates",
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : request
    ));
  };

  const handleRejectRequest = (requestId: string, reason: string = "Not specified") => {
    setVacationRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: "Rejected" as const,
            approvedBy: "Evan Yates",
            approvedDate: new Date().toISOString().split('T')[0],
            rejectionReason: reason
          }
        : request
    ));
  };

  const handleDeleteRequest = (requestId: string) => {
    if (confirm("Are you sure you want to delete this vacation request?")) {
      setVacationRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const openViewDialog = (request: VacationRequest) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const renderRequestCard = (request: VacationRequest) => (
    <Card key={request.id} className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b] hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-[50px] h-[50px]">
              <AvatarImage src={request.employeeAvatar} alt={request.employeeName} />
              <AvatarFallback>{request.employeeName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                {request.employeeName}
              </h3>
              <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                {request.employeeRole}
              </p>
              <div className="flex items-center mt-2 gap-4">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: typeColors[request.type] }}
                  ></div>
                  <span className="text-sm font-semibold" style={{ color: typeColors[request.type] }}>
                    {request.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: statusColors[request.status] }}
                  ></div>
                  <span className="text-sm font-semibold" style={{ color: statusColors[request.status] }}>
                    {request.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openViewDialog(request)}
              className="h-8 w-8 p-0 hover:bg-blue-50"
            >
              <EyeIcon className="h-4 w-4 text-[#3f8cff]" />
            </Button>
            {request.status === "Pending" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleApproveRequest(request.id)}
                  className="h-8 w-8 p-0 hover:bg-green-50"
                >
                  <CheckIcon className="h-4 w-4 text-[#0ac846]" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRejectRequest(request.id)}
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <XIcon className="h-4 w-4 text-[#ff6b6b]" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteRequest(request.id)}
              className="h-8 w-8 p-0 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 text-[#ff6b6b]" />
            </Button>
          </div>
        </div>

        <div className="bg-[#f4f9fd] rounded-[14px] p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Start Date</p>
              <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                {new Date(request.startDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">End Date</p>
              <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                {new Date(request.endDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Duration</p>
              <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                {request.days} day{request.days > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica] mb-1">Reason</p>
            <p className="text-[#0a1629] font-['Nunito_Sans',Helvetica]">{request.reason}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-[#7d8592]">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>Submitted {new Date(request.submittedDate).toLocaleDateString()}</span>
          </div>
          {request.approvedDate && (
            <div className="flex items-center">
              <span>Processed {new Date(request.approvedDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderEmployeeCard = (employee: Employee) => (
    <Card key={employee.id} className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b] hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-[60px] h-[60px]">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-[#0a1629] font-['Nunito_Sans',Helvetica]">
              {employee.name}
            </h3>
            <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
              {employee.role}
            </p>
            <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
              {employee.department}
            </p>
          </div>
        </div>

        <div className="bg-[#f4f9fd] rounded-[14px] p-4">
          <h4 className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica] mb-3">
            Vacation Balance
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#3f8cff] font-['Nunito_Sans',Helvetica]">
                {employee.totalVacationDays}
              </p>
              <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#ff6b6b] font-['Nunito_Sans',Helvetica]">
                {employee.usedVacationDays}
              </p>
              <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Used</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0ac846] font-['Nunito_Sans',Helvetica]">
                {employee.remainingDays}
              </p>
              <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Remaining</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#3f8cff] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(employee.usedVacationDays / employee.totalVacationDays) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#7d8592] mt-1 text-center">
              {Math.round((employee.usedVacationDays / employee.totalVacationDays) * 100)}% used
            </p>
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
              Vacation Management
            </h2>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
                    Create Vacation Request
                  </DialogTitle>
                  <DialogDescription className="text-[#7d8592]">
                    Submit a new vacation request for approval.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="employee" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Employee
                    </Label>
                    <Select value={newRequest.employeeId} onValueChange={(value) => setNewRequest(prev => ({ ...prev, employeeId: value }))}>
                      <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Type
                    </Label>
                    <Select value={newRequest.type} onValueChange={(value: VacationRequest["type"]) => setNewRequest(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="col-span-3 rounded-[14px] border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                        <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                        <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newRequest.startDate}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, startDate: e.target.value }))}
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newRequest.endDate}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, endDate: e.target.value }))}
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Reason
                    </Label>
                    <Input
                      id="reason"
                      value={newRequest.reason}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Reason for vacation"
                      className="col-span-3 rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Priority
                    </Label>
                    <Select value={newRequest.priority} onValueChange={(value: VacationRequest["priority"]) => setNewRequest(prev => ({ ...prev, priority: value }))}>
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

                  {newRequest.startDate && newRequest.endDate && (
                    <div className="col-span-4 bg-[#f4f9fd] rounded-[14px] p-4">
                      <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                        Duration: <span className="font-semibold text-[#0a1629]">
                          {calculateDays(newRequest.startDate, newRequest.endDate)} day(s)
                        </span>
                      </p>
                    </div>
                  )}
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
                    onClick={handleCreateRequest}
                    className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                  >
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-[#f4f9fd] rounded-[14px] p-1 mb-6">
            <Button
              variant={activeTab === "requests" ? "default" : "ghost"}
              onClick={() => setActiveTab("requests")}
              className={`flex-1 rounded-[10px] font-['Nunito_Sans',Helvetica] font-semibold ${
                activeTab === "requests" 
                  ? "bg-white text-[#3f8cff] shadow-sm" 
                  : "text-[#7d8592] hover:text-[#0a1629]"
              }`}
            >
              Vacation Requests ({filteredRequests.length})
            </Button>
            <Button
              variant={activeTab === "employees" ? "default" : "ghost"}
              onClick={() => setActiveTab("employees")}
              className={`flex-1 rounded-[10px] font-['Nunito_Sans',Helvetica] font-semibold ${
                activeTab === "employees" 
                  ? "bg-white text-[#3f8cff] shadow-sm" 
                  : "text-[#7d8592] hover:text-[#0a1629]"
              }`}
            >
              Employee Balances ({employees.length})
            </Button>
            <Button
              variant={activeTab === "calendar" ? "default" : "ghost"}
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 rounded-[10px] font-['Nunito_Sans',Helvetica] font-semibold ${
                activeTab === "calendar" 
                  ? "bg-white text-[#3f8cff] shadow-sm" 
                  : "text-[#7d8592] hover:text-[#0a1629]"
              }`}
            >
              Calendar View
            </Button>
          </div>

          {/* Search and Filters - Only show for requests tab */}
          {activeTab === "requests" && (
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7d8592]" />
                <Input
                  placeholder="Search requests..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] rounded-[14px] border-gray-200">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                  <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content based on active tab */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          {filteredRequests.length === 0 ? (
            <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-[#0a1629] mb-2">No Vacation Requests Found</h3>
                <p className="text-[#7d8592] mb-6">
                  {searchTerm || statusFilter !== "All" || typeFilter !== "All"
                    ? "No requests match your current filters. Try adjusting your search criteria."
                    : "No vacation requests have been submitted yet."
                  }
                </p>
                {!searchTerm && statusFilter === "All" && typeFilter === "All" && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create First Request
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map(renderRequestCard)
          )}
        </div>
      )}

      {activeTab === "employees" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map(renderEmployeeCard)}
        </div>
      )}

      {activeTab === "calendar" && (
        <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-[#0a1629] mb-2">Calendar View</h3>
            <p className="text-[#7d8592]">
              Calendar view with vacation schedules will be implemented here
            </p>
          </CardContent>
        </Card>
      )}

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
              Vacation Request Details
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-[60px] h-[60px]">
                  <AvatarImage src={selectedRequest.employeeAvatar} alt={selectedRequest.employeeName} />
                  <AvatarFallback>{selectedRequest.employeeName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                    {selectedRequest.employeeName}
                  </h3>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">
                    {selectedRequest.employeeRole}
                  </p>
                  <div className="flex items-center mt-2 gap-4">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: typeColors[selectedRequest.type] }}
                      ></div>
                      <span className="text-sm font-semibold" style={{ color: typeColors[selectedRequest.type] }}>
                        {selectedRequest.type}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: statusColors[selectedRequest.status] }}
                      ></div>
                      <span className="text-sm font-semibold" style={{ color: statusColors[selectedRequest.status] }}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#f4f9fd] rounded-[14px] p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Start Date</p>
                    <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                      {new Date(selectedRequest.startDate).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">End Date</p>
                    <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                      {new Date(selectedRequest.endDate).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Duration</p>
                    <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                      {selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Priority</p>
                    <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                      {selectedRequest.priority}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica] mb-2">Reason</p>
                  <p className="text-[#0a1629] font-['Nunito_Sans',Helvetica]">{selectedRequest.reason}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Submitted Date</p>
                  <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                    {new Date(selectedRequest.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                {selectedRequest.approvedBy && (
                  <div>
                    <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Processed By</p>
                    <p className="font-semibold text-[#0a1629] font-['Nunito_Sans',Helvetica]">
                      {selectedRequest.approvedBy}
                    </p>
                  </div>
                )}
              </div>

              {selectedRequest.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-[14px] p-4">
                  <p className="text-sm text-red-600 font-['Nunito_Sans',Helvetica] mb-1">Rejection Reason</p>
                  <p className="text-red-800 font-['Nunito_Sans',Helvetica]">{selectedRequest.rejectionReason}</p>
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
            {selectedRequest?.status === "Pending" && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    handleApproveRequest(selectedRequest.id);
                    setIsViewDialogOpen(false);
                  }}
                  className="bg-[#0ac846] hover:bg-[#0ac846]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                >
                  Approve
                </Button>
                <Button 
                  onClick={() => {
                    handleRejectRequest(selectedRequest.id);
                    setIsViewDialogOpen(false);
                  }}
                  className="bg-[#ff6b6b] hover:bg-[#ff6b6b]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                >
                  Reject
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};