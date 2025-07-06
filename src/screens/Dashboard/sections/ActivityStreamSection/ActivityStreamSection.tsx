import { ChevronDownIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

// Activity data for mapping
const activities = [
  {
    id: 1,
    user: {
      name: "Oscar Holloway",
      role: "UI/UX Designer",
      avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    },
    items: [
      {
        id: "a1",
        type: "status",
        content: "Updated the status of Mind Map task to In Progress",
        icon: "📤",
      },
      {
        id: "a2",
        type: "attachment",
        content: "Attached files to the task",
        icon: "📎",
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Emily Tyler",
      role: "Copywriter",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    },
    items: [
      {
        id: "b1",
        type: "status",
        content: "Updated the status of Mind Map task to In Progress",
        icon: "📤",
      },
    ],
  },
];

export const ActivityStreamSection = (): JSX.Element => {
  return (
    <div className="w-full">
      <Card className="shadow-[0px_6px_58px_#c3cbd61b] rounded-3xl">
        <CardHeader className="pb-0 pt-7 px-6">
          <CardTitle className="text-[22px] font-bold text-[#0a1629] [font-family:'Nunito_Sans',Helvetica]">
            Activity Stream
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="mb-4">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-[50px] h-[50px]">
                    <AvatarImage
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-base text-[#0a1629] [font-family:'Nunito_Sans',Helvetica] leading-6">
                      {activity.user.name}
                    </p>
                    <p className="text-sm text-[#91929e] [font-family:'Nunito_Sans',Helvetica]">
                      {activity.user.role}
                    </p>
                  </div>
                </div>

                {activity.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#f4f9fd] rounded-[14px] p-4 mb-4 flex items-start"
                  >
                    <div className="w-6 h-6 mr-4 flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <p className="[font-family:'Nunito_Sans',Helvetica] font-normal text-[#0a1629] text-base leading-6">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center mt-4">
            <Button
              variant="ghost"
              className="text-[#3f8cff] font-semibold [font-family:'Nunito_Sans',Helvetica]"
            >
              View more
              <ChevronDownIcon className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};