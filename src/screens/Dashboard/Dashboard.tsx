import {
  BellIcon,
  CalendarIcon,
  ChevronRightIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

import { ActivityStreamSection } from "./sections/ActivityStreamSection";
import { CalendarSection } from "./sections/CalendarSection";
import { CalendarEventsSection } from "./sections/CalendarEventsSection";
import { CalendarScheduleSection } from "./sections/CalendarScheduleSection";
import { NearestEventsSection } from "./sections/NearestEventsSection";
import { ProjectDetailsSection } from "./sections/ProjectDetailsSection/ProjectDetailsSection";
import { ProjectListSection } from "./sections/ProjectListSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ProjectsPageSection } from "./sections/ProjectsPageSection";
import { SideBarSection } from "./sections/SideBarSection";
import { HRSection } from "./sections/HRSection";
import { WorkloadSection } from "./sections/WorkloadSection";

export const Dashboard = (): JSX.Element => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [activeSubMenu, setActiveSubMenu] = useState("");

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
    setActiveSubMenu(""); // Reset submenu when changing main menu
    console.log(`Navigating to: ${menuName}`);
  };

  const handleSubMenuClick = (subMenuName: string) => {
    setActiveSubMenu(subMenuName);
    console.log(`Navigating to submenu: ${subMenuName}`);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return (
          <>
            {/* Workload Section */}
            <WorkloadSection />

            {/* Projects Header */}
            <div className="mt-8 flex justify-between items-center mb-6">
              <h2 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[22px]">
                Projects
              </h2>
              <Button
                variant="link"
                className="text-[#3f8cff] font-['Nunito_Sans',Helvetica] font-semibold text-base p-0 hover:text-[#3f8cff]/80"
                onClick={() => setActiveMenu("Projects")}
              >
                View all
                <ChevronRightIcon className="ml-2 w-6 h-6" />
              </Button>
            </div>

            {/* Projects Sections */}
            <div className="space-y-6">
              <ProjectsSection />
              <ProjectListSection />
              <ProjectDetailsSection />
            </div>
          </>
        );
      case "Projects":
        return <ProjectsPageSection />;
      case "Calendar":
        if (activeSubMenu === "Events") {
          return <CalendarEventsSection />;
        } else if (activeSubMenu === "Schedule") {
          return <CalendarScheduleSection />;
        } else {
          return <CalendarSection />;
        }
      case "Nhân sự":
        return <HRSection activeSubMenu={activeSubMenu} onSubMenuClick={handleSubMenuClick} />;
      case "Employees":
        return (
          <div className="space-y-6">
            <h2 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[32px]">
              Employees
            </h2>
            <WorkloadSection />
            <Card className="p-8 rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
              <div className="text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-[#0a1629] mb-2">Employee Directory</h3>
                <p className="text-[#7d8592]">Employee profiles and management tools</p>
              </div>
            </Card>
          </div>
        );
      case "Messenger":
        return (
          <div className="space-y-6">
            <h2 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[32px]">
              Messenger
            </h2>
            <Card className="p-8 rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-[#0a1629] mb-2">Team Communication</h3>
                <p className="text-[#7d8592]">Internal messaging and team chat</p>
              </div>
            </Card>
            <ActivityStreamSection />
          </div>
        );
      case "Info Portal":
        return (
          <div className="space-y-6">
            <h2 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[32px]">
              Info Portal
            </h2>
            <Card className="p-8 rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
              <div className="text-center">
                <div className="text-6xl mb-4">ℹ️</div>
                <h3 className="text-xl font-bold text-[#0a1629] mb-2">Information Portal</h3>
                <p className="text-[#7d8592]">Company news, policies, and announcements</p>
              </div>
            </Card>
          </div>
        );
      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-[#0a1629]">Page Not Found</h2>
            <p className="text-[#7d8592] mt-2">The requested page could not be found.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#f4f9fd] min-h-screen flex flex-row">
      <div className="w-full max-w-[1440px] mx-auto relative">
        {/* Sidebar */}
        <SideBarSection 
          activeMenu={activeMenu} 
          activeSubMenu={activeSubMenu}
          onMenuClick={handleMenuClick}
          onSubMenuClick={handleSubMenuClick}
        />

        {/* Main Content */}
        <div className="ml-[250px] p-5">
          {/* Header */}
          <header className="flex items-center gap-4 mb-8">
            {/* Search */}
            <Card className="w-[412px] shadow-[0px_6px_58px_#c3cbd61b] rounded-[14px]">
              <CardContent className="p-0">
                <div className="flex items-center h-12">
                  <div className="pl-5 pr-2">
                    <SearchIcon className="w-[19px] h-[19px] text-[#7d8592]" />
                  </div>
                  <Input
                    className="border-0 h-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#7d8592] font-['Nunito_Sans',Helvetica]"
                    placeholder="Search"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification */}
            <Card className="w-12 h-12 shadow-[0px_6px_58px_#c3cbd61b] rounded-[14px] cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0 flex items-center justify-center h-full">
                <BellIcon className="w-5 h-5" />
              </CardContent>
            </Card>

            {/* User Profile */}
            <Card className="w-[182px] shadow-[0px_6px_58px_#c3cbd61b] rounded-[14px] cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center h-12">
                  <Avatar className="ml-[13px] w-[34px] h-[34px]">
                    <AvatarImage
                      src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
                      alt="Evan Yates"
                    />
                    <AvatarFallback>EY</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-base">
                    Evan Yates
                  </span>
                  <ChevronRightIcon className="ml-auto mr-[13px] w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </header>

          {/* Welcome Message */}
          <div className="mb-8">
            <p className="font-['Nunito_Sans',Helvetica] font-normal text-[#7d8592] text-base">
              Welcome back, Evan!
            </p>
            <div className="flex justify-between items-center mt-4">
              <h1 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-4xl">
                {activeSubMenu ? `${activeMenu} - ${activeSubMenu}` : activeMenu}
              </h1>
              
              {/* Date Range Selector */}
              <Card className="w-[280px] h-12 bg-[#e6ecf4] border-0 rounded-[14px]">
                <CardContent className="p-0 flex items-center h-full">
                  <div className="ml-[17px]">
                    <CalendarIcon className="w-[18px] h-5" />
                  </div>
                  <span className="ml-[14px] font-['Nunito_Sans',Helvetica] font-normal text-[#0a1629] text-base">
                    Nov 16, 2020 - Dec 16, 2020
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="flex gap-5">
            <div className="flex-1 max-w-[840px]">
              {renderContent()}
            </div>

            {/* Right Sidebar - Only show on Dashboard */}
            {activeMenu === "Dashboard" && (
              <div className="w-[280px] space-y-6">
                <NearestEventsSection />
                <ActivityStreamSection />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};