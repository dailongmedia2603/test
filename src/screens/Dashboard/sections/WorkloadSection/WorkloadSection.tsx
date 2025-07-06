import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const WorkloadSection = (): JSX.Element => {
  // Team member data for easier mapping
  const teamMembers = [
    {
      id: 1,
      name: "Shawn Stone",
      role: "UI/UX Designer",
      level: "Middle",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      isHighlighted: false,
    },
    {
      id: 2,
      name: "Randy Delgado",
      role: "UI/UX Designer",
      level: "Junior",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      isHighlighted: false,
    },
    {
      id: 3,
      name: "Emily Tyler",
      role: "Copywriter",
      level: "Middle",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      isHighlighted: false,
    },
    {
      id: 4,
      name: "Louis Castro",
      role: "Copywriter",
      level: "Senior",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      isHighlighted: true,
    },
    {
      id: 5,
      name: "Blake Silva",
      role: "IOS Developer",
      level: "Senior",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      isHighlighted: false,
    },
    {
      id: 6,
      name: "Joel Phillips",
      role: "UI/UX Designer",
      level: "Middle",
      image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      isHighlighted: false,
    },
    {
      id: 7,
      name: "Wayne Marsh",
      role: "Copywriter",
      level: "Junior",
      image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      isHighlighted: false,
    },
    {
      id: 8,
      name: "Oscar Holloway",
      role: "UI/UX Designer",
      level: "Middle",
      image: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      isHighlighted: false,
    },
  ];

  return (
    <section className="w-full">
      <Card className="rounded-3xl shadow-[0px_6px_58px_#c3cbd61b]">
        <CardContent className="p-7">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[22px] text-[#0a1629] [font-family:'Nunito_Sans',Helvetica]">
              Workload
            </h2>
            <div className="flex items-center text-[#3f8cff] cursor-pointer">
              <span className="font-semibold text-base [font-family:'Nunito_Sans',Helvetica]">
                View all
              </span>
              <ArrowRightIcon className="w-6 h-6 ml-2" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="bg-[#f4f9fd] rounded-3xl border-none"
              >
                <CardContent className="flex flex-col items-center pt-[18px] pb-[18px]">
                  <div className="relative w-[58px] h-[58px] mb-[15px]">
                    <div
                      className={`relative w-[60px] h-[60px] rounded-[30px] border-2 border-solid ${
                        member.isHighlighted
                          ? "border-[#3f8cff]"
                          : "border-[#7d859234]"
                      }`}
                    >
                      {/* Progress ring for highlighted member */}
                      {member.isHighlighted && (
                        <div className="absolute inset-0 rounded-full">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
                            <circle
                              cx="30"
                              cy="30"
                              r="28"
                              stroke="#3f8cff"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray="175.93"
                              strokeDashoffset="44"
                              className="opacity-80"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <img
                      className="w-[50px] h-[50px] absolute top-1 left-1 object-cover rounded-full"
                      alt={`${member.name} profile photo`}
                      src={member.image}
                    />
                  </div>

                  <h3 className="font-bold text-base text-[#0a1629] text-center mb-1 [font-family:'Nunito_Sans',Helvetica]">
                    {member.name}
                  </h3>

                  <p className="font-normal text-sm text-[#0a1629] text-center mb-3 [font-family:'Nunito_Sans',Helvetica]">
                    {member.role}
                  </p>

                  <div className="rounded overflow-hidden border border-solid border-[#7d8592] w-[46px] h-[18px] flex items-center justify-center">
                    <span className="font-semibold text-xs text-[#7d8592] [font-family:'Nunito_Sans',Helvetica]">
                      {member.level}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};