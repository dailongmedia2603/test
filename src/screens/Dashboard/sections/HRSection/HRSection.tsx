import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { VacationsSection } from "../VacationsSection";

interface HRSectionProps {
  activeSubMenu: string;
  onSubMenuClick: (subMenuName: string) => void;
}

export const HRSection = ({ activeSubMenu, onSubMenuClick }: HRSectionProps): JSX.Element => {
  const renderContent = () => {
    switch (activeSubMenu) {
      case "List nhân sự":
        return (
          <div className="space-y-6">
            <h2 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[32px]">
              Danh sách nhân sự
            </h2>
            <Card className="p-8 rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
              <div className="text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-[#0a1629] mb-2">Danh sách nhân sự</h3>
                <p className="text-[#7d8592]">Quản lý thông tin và hồ sơ nhân viên</p>
              </div>
            </Card>
          </div>
        );
      case "Hiệu suất":
        return (
          <div className="space-y-6">
            <h2 className="font-['Nunito_Sans',Helvetica] font-bold text-[#0a1629] text-[32px]">
              Hiệu suất làm việc
            </h2>
            <Card className="p-8 rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-[#0a1629] mb-2">Đánh giá hiệu suất</h3>
                <p className="text-[#7d8592]">Theo dõi và đánh giá hiệu suất làm việc của nhân viên</p>
              </div>
            </Card>
          </div>
        );
      default:
        return <VacationsSection />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};