import { CalendarIcon } from "lucide-react";
import React from "react";
import { Avatar } from "../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";

export const ProjectDetailsSection = (): JSX.Element => {
  // Project assignees data
  const assignees = [
    { src: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", alt: "Assignee 1" },
    { src: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", alt: "Assignee 2" },
    { src: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", alt: "Assignee 3" },
  ];

  return (
    <div className="w-full">
      <Card className="relative w-full rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
        <CardContent className="p-6">
          <div className="flex flex-row">
            {/* Left section */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0ac846] rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-normal text-sm text-[#91929e]">
                    PN0001290
                  </span>
                  <h3 className="font-bold text-lg text-[#0a1629] leading-[26px]">
                    Food Delivery Service
                  </h3>
                </div>
              </div>

              <div className="flex items-center mt-6 gap-8">
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2">
                    <CalendarIcon className="w-[18px] h-5 text-gray-500" />
                  </div>
                  <span className="font-semibold text-sm text-[#7d8592]">
                    Created May 28, 2020
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 bg-[#0ac846] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="font-bold text-sm text-[#0ac846]">Low</span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <Separator orientation="vertical" className="mx-4 h-auto" />

            {/* Right section */}
            <div className="flex-1">
              <h4 className="font-bold text-base text-[#0a1629] mb-4">
                Project Data
              </h4>

              <div className="grid grid-cols-3 gap-4">
                {/* All tasks */}
                <div>
                  <p className="font-normal text-sm text-[#91929e]">
                    All tasks
                  </p>
                  <p className="font-bold text-base text-[#0a1629] mt-1">23</p>
                </div>

                {/* Active tasks */}
                <div>
                  <p className="font-normal text-sm text-[#91929e]">
                    Active tasks
                  </p>
                  <p className="font-bold text-base text-[#0a1629] mt-1">20</p>
                </div>

                {/* Assignees */}
                <div>
                  <p className="font-normal text-sm text-[#91929e]">
                    Assignees
                  </p>
                  <div className="flex mt-1">
                    {assignees.map((assignee, index) => (
                      <Avatar
                        key={`assignee-${index}`}
                        className="w-[26px] h-[26px] border-2 border-white -ml-1 first:ml-0"
                      >
                        <img
                          src={assignee.src}
                          alt={assignee.alt}
                          className="w-full h-full object-cover"
                        />
                      </Avatar>
                    ))}
                    <div className="w-6 h-6 -ml-1 bg-[#3f8cff] rounded-full border-2 border-solid border-white flex items-center justify-center">
                      <span className="font-semibold text-xs text-white">
                        +5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};