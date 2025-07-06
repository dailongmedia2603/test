import { CalendarIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";

export const ProjectsSection = (): JSX.Element => {
  // Project data that can be mapped over if needed for multiple projects
  const projectData = {
    id: "PN0001265",
    title: "Medical App (iOS native)",
    createdDate: "Sep 12, 2020",
    priority: "Medium",
    stats: {
      allTasks: 34,
      activeTasks: 13,
    },
    assignees: [
      { img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", alt: "Team member 1" },
      { img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", alt: "Team member 2" },
      { img: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1", alt: "Team member 3" },
      { additional: 2 },
    ],
  };

  return (
    <div className="w-full">
      <Card className="relative w-full shadow-[0px_6px_58px_#c3cbd61b] rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left section with project info */}
            <div className="flex-1 p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 mr-4 bg-[#3f8cff] rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <div>
                  <p className="font-normal text-sm text-[#91929e]">
                    {projectData.id}
                  </p>
                  <h3 className="font-bold text-lg text-[#0a1629] leading-[26px]">
                    {projectData.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center mt-6 space-x-8">
                {/* Created date */}
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2">
                    <CalendarIcon className="w-[18px] h-5 text-[#7d8592]" />
                  </div>
                  <span className="font-semibold text-sm text-[#7d8592] leading-4">
                    Created {projectData.createdDate}
                  </span>
                </div>

                {/* Priority */}
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 bg-[#ffbd21] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="font-bold text-sm text-[#ffbd21] leading-4">
                    {projectData.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <Separator
              orientation="vertical"
              className="h-auto hidden md:block"
            />

            {/* Right section with project data */}
            <div className="p-6 md:w-[390px]">
              <h3 className="font-bold text-base text-[#0a1629] leading-6 mb-4">
                Project Data
              </h3>

              <div className="flex space-x-12">
                {/* All tasks */}
                <div>
                  <p className="text-sm text-[#91929e]">All tasks</p>
                  <p className="font-bold text-base text-[#0a1629] mt-1">
                    {projectData.stats.allTasks}
                  </p>
                </div>

                {/* Active tasks */}
                <div>
                  <p className="text-sm text-[#91929e]">Active tasks</p>
                  <p className="font-bold text-base text-[#0a1629] mt-1">
                    {projectData.stats.activeTasks}
                  </p>
                </div>

                {/* Assignees */}
                <div>
                  <p className="text-sm text-[#91929e]">Assignees</p>
                  <div className="flex mt-1">
                    {projectData.assignees.map((assignee, index) =>
                      "img" in assignee ? (
                        <img
                          key={`assignee-${index}`}
                          className="w-[26px] h-[26px] rounded-full object-cover -ml-1 first:ml-0 border-2 border-white"
                          style={{ zIndex: 3 - index }}
                          alt={assignee.alt}
                          src={assignee.img}
                        />
                      ) : (
                        <div
                          key="additional-assignees"
                          className="w-6 h-6 rounded-full bg-[#3f8cff] flex items-center justify-center -ml-1 border-2 border-white"
                          style={{ zIndex: 0 }}
                        >
                          <span className="font-semibold text-xs text-white">
                            +{assignee.additional}
                          </span>
                        </div>
                      ),
                    )}
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