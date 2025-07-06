import { CalendarIcon, FilterIcon, PlusIcon, SearchIcon, MoreHorizontalIcon, EditIcon, TrashIcon, EyeIcon, ExternalLinkIcon } from "lucide-react";
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
  clientName: string;
  projectName: string;
  contractValue: number; // Giá trị hợp đồng
  paidAmount: number; // Đã thanh toán
  debt: number; // Công nợ
  paymentProgress: number; // Tiến độ thanh toán (%)
  projectProgress: number; // Tiến độ dự án (%)
  status: "Đang chạy" | "Hoàn thành" | "Pending" | "Quá hạn";
  startDate: string;
  endDate?: string;
  description: string;
  priority: "Thấp" | "Trung bình" | "Cao";
  assignees: {
    id: string;
    name: string;
    avatar: string;
  }[];
  link?: string;
  category: string;
}

// Default projects data based on the image
const defaultProjects: Project[] = [
  {
    id: "1",
    clientName: "ABC Corporation",
    projectName: "Website Redesign",
    contractValue: 120000000,
    paidAmount: 50000000,
    debt: 70000000,
    paymentProgress: 42, // (50/120)*100
    projectProgress: 75,
    status: "Đang chạy",
    startDate: "2020-09-01",
    endDate: "2020-12-31",
    description: "Thiết kế lại website công ty với giao diện hiện đại",
    priority: "Cao",
    assignees: [
      { id: "1", name: "John Doe", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "2", name: "Jane Smith", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
    ],
    link: "https://abc-corp.com",
    category: "Web Development"
  },
  {
    id: "2",
    clientName: "XYZ Industries",
    projectName: "Marketing Campaign",
    contractValue: 85000000,
    paidAmount: 0,
    debt: 85000000,
    paymentProgress: 0,
    projectProgress: 60,
    status: "Đang chạy",
    startDate: "2020-10-01",
    endDate: "2021-01-31",
    description: "Chiến dịch marketing tổng thể cho sản phẩm mới",
    priority: "Trung bình",
    assignees: [
      { id: "3", name: "Mike Johnson", avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
    ],
    link: "https://xyz-industries.com",
    category: "Marketing"
  },
  {
    id: "3",
    clientName: "Tech Innovators",
    projectName: "Mobile App Dev",
    contractValue: 350000000,
    paidAmount: 350000000,
    debt: 0,
    paymentProgress: 100,
    projectProgress: 100,
    status: "Hoàn thành",
    startDate: "2020-05-01",
    endDate: "2020-10-31",
    description: "Phát triển ứng dụng mobile cho iOS và Android",
    priority: "Cao",
    assignees: [
      { id: "4", name: "Sarah Wilson", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" },
      { id: "5", name: "Tom Brown", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" }
    ],
    link: "https://tech-innovators.com",
    category: "Mobile Development"
  }
];

export const ProjectsPageSection = (): JSX.Element => {
  // Use localStorage hook for persistent data
  const [projects, setProjects] = useLocalStorage<Project[]>(STORAGE_KEYS.PROJECTS, defaultProjects);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [clientFilter, setClientFilter] = useState("Tất cả");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    clientName: "",
    projectName: "",
    contractValue: 0,
    paidAmount: 0,
    description: "",
    priority: "Trung bình" as Project["priority"],
    status: "Đang chạy" as Project["status"],
    category: "",
    startDate: "",
    endDate: "",
    link: ""
  });

  // Get unique clients for filter
  const clients = Array.from(new Set(projects.map(p => p.clientName)));

  // Calculate statistics
  const stats = {
    total: projects.length,
    running: projects.filter(p => p.status === "Đang chạy").length,
    completed: projects.filter(p => p.status === "Hoàn thành").length,
    pending: projects.filter(p => p.status === "Pending").length,
    overdue: projects.filter(p => p.status === "Quá hạn").length
  };

  // Status colors
  const statusColors = {
    "Đang chạy": "#3f8cff",
    "Hoàn thành": "#0ac846",
    "Pending": "#ffbd21",
    "Quá hạn": "#ff6b6b"
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Tất cả" || project.status === statusFilter;
    const matchesClient = clientFilter === "Tất cả" || project.clientName === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const calculateDebt = (contractValue: number, paidAmount: number) => {
    return contractValue - paidAmount;
  };

  const calculatePaymentProgress = (contractValue: number, paidAmount: number) => {
    return contractValue > 0 ? Math.round((paidAmount / contractValue) * 100) : 0;
  };

  const handleCreateProject = () => {
    if (!newProject.clientName.trim() || !newProject.projectName.trim()) return;

    const debt = calculateDebt(newProject.contractValue, newProject.paidAmount);
    const paymentProgress = calculatePaymentProgress(newProject.contractValue, newProject.paidAmount);

    const project: Project = {
      id: Date.now().toString(),
      clientName: newProject.clientName,
      projectName: newProject.projectName,
      contractValue: newProject.contractValue,
      paidAmount: newProject.paidAmount,
      debt: debt,
      paymentProgress: paymentProgress,
      projectProgress: 0,
      status: newProject.status,
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      endDate: newProject.endDate,
      description: newProject.description,
      priority: newProject.priority,
      assignees: [],
      link: newProject.link,
      category: newProject.category
    };

    setProjects(prev => [project, ...prev]);
    setNewProject({
      clientName: "",
      projectName: "",
      contractValue: 0,
      paidAmount: 0,
      description: "",
      priority: "Trung bình",
      status: "Đang chạy",
      category: "",
      startDate: "",
      endDate: "",
      link: ""
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditProject = () => {
    if (!selectedProject || !newProject.clientName.trim() || !newProject.projectName.trim()) return;

    const debt = calculateDebt(newProject.contractValue, newProject.paidAmount);
    const paymentProgress = calculatePaymentProgress(newProject.contractValue, newProject.paidAmount);

    setProjects(prev => prev.map(project => 
      project.id === selectedProject.id 
        ? { 
            ...project, 
            ...newProject,
            debt: debt,
            paymentProgress: paymentProgress
          }
        : project
    ));
    
    setIsEditDialogOpen(false);
    setSelectedProject(null);
    setNewProject({
      clientName: "",
      projectName: "",
      contractValue: 0,
      paidAmount: 0,
      description: "",
      priority: "Trung bình",
      status: "Đang chạy",
      category: "",
      startDate: "",
      endDate: "",
      link: ""
    });
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setNewProject({
      clientName: project.clientName,
      projectName: project.projectName,
      contractValue: project.contractValue,
      paidAmount: project.paidAmount,
      description: project.description,
      priority: project.priority,
      status: project.status,
      category: project.category,
      startDate: project.startDate,
      endDate: project.endDate || "",
      link: project.link || ""
    });
    setIsEditDialogOpen(true);
  };

  const updateProjectProgress = (projectId: string, newProgress: number) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, projectProgress: newProgress }
        : project
    ));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Statistics */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[32px]">
              Quản lý Dự án
            </h1>
            <p className="text-[#7d8592] font-['Nunito_Sans',Helvetica] mt-2">
              Theo dõi, quản lý và phân tích tất cả các dự án của bạn.
            </p>
          </div>
          <Button className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold">
            Thời gian
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b] border-2 border-[#3f8cff]/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3f8cff] rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <div>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Tổng dự án</p>
                  <p className="text-2xl font-bold text-[#0a1629] font-['Nunito_Sans',Helvetica]">{stats.total}</p>
                  <p className="text-xs text-[#7d8592] font-['Nunito_Sans',Helvetica]">Dự án đang hoạt động</p>
                </div>
                <div className="ml-auto text-green-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3f8cff] rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Đang chạy</p>
                  <p className="text-2xl font-bold text-[#0a1629] font-['Nunito_Sans',Helvetica]">{stats.running}</p>
                  <p className="text-xs text-[#7d8592] font-['Nunito_Sans',Helvetica]">Dự án đang triển khai</p>
                </div>
                <div className="ml-auto text-green-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0ac846] rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <div>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Hoàn thành</p>
                  <p className="text-2xl font-bold text-[#0a1629] font-['Nunito_Sans',Helvetica]">{stats.completed}</p>
                  <p className="text-xs text-[#7d8592] font-['Nunito_Sans',Helvetica]">Dự án đã kết thúc</p>
                </div>
                <div className="ml-auto text-green-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ffbd21] rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <div>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Pending</p>
                  <p className="text-2xl font-bold text-[#0a1629] font-['Nunito_Sans',Helvetica]">{stats.pending}</p>
                  <p className="text-xs text-[#7d8592] font-['Nunito_Sans',Helvetica]">Dự án đang lên kế hoạch</p>
                </div>
                <div className="ml-auto text-green-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ff6b6b] rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <div>
                  <p className="text-sm text-[#7d8592] font-['Nunito_Sans',Helvetica]">Quá hạn</p>
                  <p className="text-2xl font-bold text-[#0a1629] font-['Nunito_Sans',Helvetica]">{stats.overdue}</p>
                  <p className="text-xs text-[#7d8592] font-['Nunito_Sans',Helvetica]">Dự án trễ deadline</p>
                </div>
                <div className="ml-auto text-green-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7d8592]" />
                <Input
                  placeholder="Tìm kiếm dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px] rounded-[14px] border-gray-200 font-['Nunito_Sans',Helvetica]"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] rounded-[14px] border-gray-200">
                  <SelectValue placeholder="Tất cả nhân sự" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tất cả">Tất cả nhân sự</SelectItem>
                  <SelectItem value="Đang chạy">Đang chạy</SelectItem>
                  <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-[150px] rounded-[14px] border-gray-200">
                  <SelectValue placeholder="Tất cả tiến độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tất cả">Tất cả tiến độ</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client} value={client}>{client}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="rounded-[14px] border-gray-200">
                <FilterIcon className="w-4 h-4 mr-2" />
                Dự án lưu trữ
              </Button>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Thêm dự án
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
                    Tạo dự án mới
                  </DialogTitle>
                  <DialogDescription className="text-[#7d8592]">
                    Điền thông tin để tạo dự án mới.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Tên khách hàng
                      </Label>
                      <Input
                        id="clientName"
                        value={newProject.clientName}
                        onChange={(e) => setNewProject(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="Tên công ty/khách hàng"
                        className="rounded-[14px] border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectName" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Tên dự án
                      </Label>
                      <Input
                        id="projectName"
                        value={newProject.projectName}
                        onChange={(e) => setNewProject(prev => ({ ...prev, projectName: e.target.value }))}
                        placeholder="Tên dự án"
                        className="rounded-[14px] border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contractValue" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Giá trị hợp đồng (VNĐ)
                      </Label>
                      <Input
                        id="contractValue"
                        type="number"
                        value={newProject.contractValue}
                        onChange={(e) => setNewProject(prev => ({ ...prev, contractValue: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        className="rounded-[14px] border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paidAmount" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Đã thanh toán (VNĐ)
                      </Label>
                      <Input
                        id="paidAmount"
                        type="number"
                        value={newProject.paidAmount}
                        onChange={(e) => setNewProject(prev => ({ ...prev, paidAmount: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        className="rounded-[14px] border-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Mô tả dự án
                    </Label>
                    <Input
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Mô tả chi tiết về dự án"
                      className="rounded-[14px] border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Trạng thái
                      </Label>
                      <Select value={newProject.status} onValueChange={(value: Project["status"]) => setNewProject(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="rounded-[14px] border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Đang chạy">Đang chạy</SelectItem>
                          <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Độ ưu tiên
                      </Label>
                      <Select value={newProject.priority} onValueChange={(value: Project["priority"]) => setNewProject(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger className="rounded-[14px] border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Thấp">Thấp</SelectItem>
                          <SelectItem value="Trung bình">Trung bình</SelectItem>
                          <SelectItem value="Cao">Cao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Ngày bắt đầu
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                        className="rounded-[14px] border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                        Ngày kết thúc
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                        className="rounded-[14px] border-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="link" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                      Link dự án
                    </Label>
                    <Input
                      id="link"
                      value={newProject.link}
                      onChange={(e) => setNewProject(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="https://..."
                      className="rounded-[14px] border-gray-200"
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
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleCreateProject}
                    className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                  >
                    Tạo dự án
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f4f9fd]">
                <tr>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">Client</th>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">Tên dự án</th>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">Giá trị HD</th>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">Đã thanh toán</th>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">Công nợ</th>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">Tiến độ TT</th>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">Link</th>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">Tiến độ</th>
                  <th className="text-left p-4 font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629] text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12">
                      <div className="text-6xl mb-4">📁</div>
                      <h3 className="text-xl font-bold text-[#0a1629] mb-2">Không tìm thấy dự án</h3>
                      <p className="text-[#7d8592] mb-6">
                        {searchTerm || statusFilter !== "Tất cả" || clientFilter !== "Tất cả"
                          ? "Không có dự án nào phù hợp với bộ lọc hiện tại."
                          : "Bạn chưa tạo dự án nào. Tạo dự án đầu tiên để bắt đầu."
                        }
                      </p>
                      {!searchTerm && statusFilter === "Tất cả" && clientFilter === "Tất cả" && (
                        <Button 
                          onClick={() => setIsCreateDialogOpen(true)}
                          className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
                        >
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Tạo dự án đầu tiên
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="p-4">
                        <span className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                          {project.clientName}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-['Nunito_Sans',Helvetica] text-[#0a1629]">
                          {project.projectName}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-['Nunito_Sans',Helvetica] text-[#0a1629]">
                          {formatCurrency(project.contractValue)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-['Nunito_Sans',Helvetica] text-[#0ac846] font-semibold">
                            {formatCurrency(project.paidAmount)}
                          </span>
                          <div className="w-4 h-4 text-[#0ac846]">✓</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-['Nunito_Sans',Helvetica] text-[#ff6b6b] font-semibold">
                          {formatCurrency(project.debt)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-['Nunito_Sans',Helvetica] text-[#0a1629] font-semibold">
                            {project.paymentProgress}%
                          </span>
                          <div className="w-4 h-4 text-[#0ac846]">✓</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {project.link ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(project.link, '_blank')}
                            className="h-8 w-8 p-0 text-[#3f8cff] hover:bg-blue-50"
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-[#7d8592]">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-semibold"
                            style={{ 
                              backgroundColor: `${statusColors[project.status]}20`, 
                              color: statusColors[project.status] 
                            }}
                          >
                            {project.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-50"
                          >
                            <MoreHorizontalIcon className="h-4 w-4 text-[#7d8592]" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-xl">
              Chỉnh sửa dự án
            </DialogTitle>
            <DialogDescription className="text-[#7d8592]">
              Cập nhật thông tin dự án.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-clientName" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                  Tên khách hàng
                </Label>
                <Input
                  id="edit-clientName"
                  value={newProject.clientName}
                  onChange={(e) => setNewProject(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Tên công ty/khách hàng"
                  className="rounded-[14px] border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-projectName" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                  Tên dự án
                </Label>
                <Input
                  id="edit-projectName"
                  value={newProject.projectName}
                  onChange={(e) => setNewProject(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Tên dự án"
                  className="rounded-[14px] border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-contractValue" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                  Giá trị hợp đồng (VNĐ)
                </Label>
                <Input
                  id="edit-contractValue"
                  type="number"
                  value={newProject.contractValue}
                  onChange={(e) => setNewProject(prev => ({ ...prev, contractValue: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="rounded-[14px] border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-paidAmount" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                  Đã thanh toán (VNĐ)
                </Label>
                <Input
                  id="edit-paidAmount"
                  type="number"
                  value={newProject.paidAmount}
                  onChange={(e) => setNewProject(prev => ({ ...prev, paidAmount: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="rounded-[14px] border-gray-200"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                Mô tả dự án
              </Label>
              <Input
                id="edit-description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả chi tiết về dự án"
                className="rounded-[14px] border-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                  Trạng thái
                </Label>
                <Select value={newProject.status} onValueChange={(value: Project["status"]) => setNewProject(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="rounded-[14px] border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang chạy">Đang chạy</SelectItem>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-priority" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                  Độ ưu tiên
                </Label>
                <Select value={newProject.priority} onValueChange={(value: Project["priority"]) => setNewProject(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="rounded-[14px] border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thấp">Thấp</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Cao">Cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-link" className="font-['Nunito_Sans',Helvetica] font-semibold text-[#0a1629]">
                Link dự án
              </Label>
              <Input
                id="edit-link"
                value={newProject.link}
                onChange={(e) => setNewProject(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://..."
                className="rounded-[14px] border-gray-200"
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
              Hủy
            </Button>
            <Button 
              type="submit" 
              onClick={handleEditProject}
              className="bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white rounded-[14px] font-['Nunito_Sans',Helvetica] font-semibold"
            >
              Cập nhật dự án
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};