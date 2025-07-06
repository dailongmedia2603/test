import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

export const NearestEventsSection = (): JSX.Element => {
  // Event data for mapping
  const events = [
    {
      id: 1,
      title: "Presentation of the new department",
      time: "Today | 5:00 PM",
      duration: "4h",
      priorityColor: "#3f8cff",
      indicatorColor: "bg-[#3f8cff]",
    },
    {
      id: 2,
      title: "Anna's Birthday",
      time: "Today | 6:00 PM",
      duration: "4h",
      priorityColor: "#de92eb",
      indicatorColor: "bg-[#de92eb]",
    },
    {
      id: 3,
      title: "Ray's Birthday",
      time: "Tomorrow | 2:00 PM",
      duration: "4h",
      priorityColor: "#de92eb",
      indicatorColor: "bg-[#de92eb]",
    },
  ];

  return (
    <div className="w-full">
      <Card className="shadow-[0px_6px_58px_#c3cbd61b] rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between pb-0 pt-7 px-7">
          <CardTitle className="text-[22px] font-bold text-[#0a1629] [font-family:'Nunito_Sans',Helvetica]">
            Nearest Events
          </CardTitle>
          <Button
            variant="ghost"
            className="flex items-center p-0 h-auto text-[#3f8cff] hover:bg-transparent"
          >
            <span className="font-semibold text-base [font-family:'Nunito_Sans',Helvetica]">
              View all
            </span>
            <ChevronRightIcon className="w-6 h-6 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6 px-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="relative h-[104px] mb-6 overflow-hidden"
            >
              <div
                className={`absolute w-1.5 h-full left-0 top-0 rounded-sm ${event.indicatorColor}`}
              />

              <div className="ml-5 pt-1">
                <h3 className="font-bold text-base text-[#0a1629] [font-family:'Nunito_Sans',Helvetica] leading-6 w-[185px]">
                  {event.title}
                </h3>

                <div className="flex items-center justify-between mt-10">
                  <span className="font-normal text-sm text-[#91929e] [font-family:'Nunito_Sans',Helvetica]">
                    {event.time}
                  </span>

                  <div className="w-[63px] h-9 overflow-hidden">
                    <div className="relative w-[65px] h-[38px] -top-px -left-px bg-[#f4f9fd] rounded-lg flex items-center">
                      <div className="w-6 h-6 ml-[9px]">
                        <div className="relative h-6 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-[#7d8592] rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#7d8592] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <span className="ml-1 font-bold text-xs text-[#7d8592] [font-family:'Nunito_Sans',Helvetica]">
                        {event.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="absolute w-6 h-6 top-[5px] right-1 rounded-full flex items-center justify-center"
                style={{ backgroundColor: event.priorityColor }}
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};