import { CalendarIcon } from "lucide-react";
import React from "react";
import { Avatar } from "../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";

export const ProjectListSection = (): JSX.Element => {
  // Project data that can be mapped over if needed for multiple projects
  const projectData = {
    id: "PN0001221",
    title: "Food Delivery Service",
    createdDate: "Sep 10, 2020",
    priority: "Medium",
    allTasks: 50,
    activeTasks: 24,
    assignees: [
      { src: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", alt: "Team member 1" },
      { src: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", alt: "Team member 2" },
      { src: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", alt: "Team member 3" },
    ],
  };

  return (
    <div className="w-full">
      <Card className="relative w-full shadow-[0px_6px_58px_#c3cbd61b] rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-row">
            {/* Left section */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#de92eb] rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-normal text-sm text-[#91929e]">
                    {projectData.id}
                  </span>
                  <h3 className="font-bold text-lg text-[#0a1629] leading-[26px]">
                    {projectData.title}
                  </h3>

                  <div className="flex items-center mt-6 gap-2">
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-[#7d8592]" />
                      <span className="ml-2 font-semibold text-sm text-[#7d8592]">
                        Created {projectData.createdDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 bg-[#ffbd21] rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span className="ml-2 font-bold text-sm text-[#ffbd21]">
                      {projectData.priority}
                    </span>
                  </div>
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
                <div className="flex flex-col">
                  <span className="text-sm text-[#91929e]">All tasks</span>
                  <span className="font-bold text-base text-[#0a1629] mt-1">
                    {projectData.allTasks}
                  </span>
                </div>

                {/* Active tasks */}
                <div className="flex flex-col">
                  <span className="text-sm text-[#91929e]">Active tasks</span>
                  <span className="font-bold text-base text-[#0a1629] mt-1">
                    {projectData.activeTasks}
                  </span>
                </div>

                {/* Assignees */}
                <div className="flex flex-col">
                  <span className="text-sm text-[#91929e]">Assignees</span>
                  <div className="flex -space-x-2 mt-1">
                    {projectData.assignees.map((assignee, index) => (
                      <Avatar
                        key={index}
                        className="w-[26px] h-[26px] border-2 border-white"
                      >
                        <img
                          src={assignee.src}
                          alt={assignee.alt}
                          className="object-cover w-full h-full"
                        />
                      </Avatar>
                    ))}
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