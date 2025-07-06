import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface SideBarSectionProps {
  activeMenu: string;
  activeSubMenu?: string;
  onMenuClick: (menuName: string) => void;
  onSubMenuClick?: (subMenuName: string) => void;
}

export const SideBarSection = ({ 
  activeMenu, 
  activeSubMenu = "",
  onMenuClick, 
  onSubMenuClick 
}: SideBarSectionProps): JSX.Element => {
  // Navigation menu items data
  const navItems = [
    {
      name: "Dashboard",
      icon: "📊",
    },
    {
      name: "Projects",
      icon: "📁",
    },
    {
      name: "Calendar",
      icon: "📅",
      subItems: [
        { name: "Events", icon: "🎯" },
        { name: "Schedule", icon: "📋" }
      ]
    },
    {
      name: "Nhân sự",
      icon: "👤",
      subItems: [
        { name: "List nhân sự", icon: "📝" },
        { name: "Hiệu suất", icon: "📈" }
      ]
    },
    {
      name: "Employees",
      icon: "👥",
    },
    {
      name: "Messenger",
      icon: "💬",
    },
    {
      name: "Info Portal",
      icon: "ℹ️",
    },
  ];

  const handleSupportClick = () => {
    alert("Support feature will be implemented soon!");
  };

  const handleLogoutClick = () => {
    if (confirm("Are you sure you want to logout?")) {
      alert("Logout functionality will be implemented!");
    }
  };

  const handleMenuItemClick = (item: any) => {
    if (item.subItems && item.subItems.length > 0) {
      // If clicking on the same menu that's already active, toggle it
      if (activeMenu === item.name) {
        // If submenu is open, close it by going to main menu
        onMenuClick(item.name);
      } else {
        // Open the menu and show first submenu
        onMenuClick(item.name);
        if (onSubMenuClick) {
          onSubMenuClick(item.subItems[0].name);
        }
      }
    } else {
      onMenuClick(item.name);
    }
  };

  const handleSubMenuClick = (subItem: any) => {
    if (onSubMenuClick) {
      onSubMenuClick(subItem.name);
    }
  };

  return (
    <aside className="fixed left-0 top-0 w-[250px] h-full py-5 px-5 z-10">
      <Card className="h-full rounded-3xl shadow-[0px_6px_58px_#c3cbd61b] relative">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Logo */}
          <div className="w-[50px] h-[50px] mt-[41px] ml-[25px] bg-[#3f8cff] rounded-lg flex items-center justify-center relative cursor-pointer hover:bg-[#3f8cff]/90 transition-colors">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-[92px] mx-[17px] flex-1">
            <ul>
              {navItems.map((item) => {
                const isActive = activeMenu === item.name;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = isActive && hasSubItems;
                
                return (
                  <li key={item.name} className="mb-[18px]">
                    {/* Main Menu Item */}
                    <div
                      className={`relative h-[46px] flex items-center rounded-[10px] cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? "bg-[#3f8cff] bg-opacity-10" 
                          : "hover:bg-gray-50 hover:bg-opacity-50"
                      }`}
                      onClick={() => handleMenuItemClick(item)}
                    >
                      {isActive && (
                        <div className="absolute w-1.5 h-[46px] right-[-5px] bg-[#3f8cff] rounded-sm" />
                      )}
                      <div className="w-6 h-6 ml-2 relative flex items-center justify-center text-lg">
                        {item.icon}
                      </div>
                      <span
                        className={`ml-3 font-['Nunito_Sans',Helvetica] font-semibold transition-colors flex-1 ${
                          isActive
                            ? "text-[#3f8cff] font-bold"
                            : "text-[#7d8592] hover:text-[#0a1629]"
                        } text-base`}
                      >
                        {item.name}
                      </span>
                      {hasSubItems && (
                        <div className="mr-2">
                          {isExpanded ? (
                            <ChevronUpIcon className="w-4 h-4 text-[#7d8592]" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-[#7d8592]" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Sub Menu Items */}
                    {isExpanded && item.subItems && (
                      <ul className="ml-6 mt-2 space-y-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = activeSubMenu === subItem.name;
                          return (
                            <li
                              key={subItem.name}
                              className={`h-[38px] flex items-center rounded-[8px] cursor-pointer transition-all duration-200 ${
                                isSubActive
                                  ? "bg-[#3f8cff] bg-opacity-15"
                                  : "hover:bg-gray-50 hover:bg-opacity-50"
                              }`}
                              onClick={() => handleSubMenuClick(subItem)}
                            >
                              <div className="w-4 h-4 ml-2 relative flex items-center justify-center text-sm">
                                {subItem.icon}
                              </div>
                              <span
                                className={`ml-2 font-['Nunito_Sans',Helvetica] font-medium transition-colors ${
                                  isSubActive
                                    ? "text-[#3f8cff] font-semibold"
                                    : "text-[#7d8592] hover:text-[#0a1629]"
                                } text-sm`}
                              >
                                {subItem.name}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Support Section */}
          <div className="mx-[17px] mb-[119px]">
            <div className="relative w-[170px] h-[215px]">
              <div className="absolute w-[170px] h-[170px] top-[45px] left-0 bg-[#3f8cff] rounded-3xl opacity-10" />
              <div className="absolute w-[140px] h-[124px] top-0 left-[19px] bg-[#3f8cff] rounded-2xl opacity-20"></div>
              <Button 
                onClick={handleSupportClick}
                className="absolute w-[129px] h-12 top-[140px] left-5 bg-[#3f8cff] rounded-[14px] shadow-[0px_6px_12px_#3f8cff43] flex items-center justify-start hover:bg-[#3f8cff]/90 transition-colors"
              >
                <div className="w-6 h-6 ml-[12px] relative flex items-center justify-center text-white">
                  🎧
                </div>
                <span className="ml-[8px] font-['Nunito_Sans',Helvetica] font-bold text-white text-base">
                  Support
                </span>
              </Button>
            </div>
          </div>

          {/* Logout */}
          <div 
            onClick={handleLogoutClick}
            className="absolute bottom-[35px] left-0 w-full flex items-center cursor-pointer hover:bg-gray-50 hover:bg-opacity-50 py-2 transition-colors"
          >
            <div className="w-6 h-6 ml-[25px] relative flex items-center justify-center text-lg">
              🚪
            </div>
            <span className="ml-[16px] font-['Nunito_Sans',Helvetica] font-semibold text-[#7d8592] text-base hover:text-[#0a1629] transition-colors">
              Logout
            </span>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};