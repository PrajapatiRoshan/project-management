import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWorkspaceId from "@/hooks/use-workspace-id";

const RecentProjects = () => {
  const workspaceId = useWorkspaceId();

  const projects = [
    {
      emoji: "🚀",
      name: "Space Exploration Initiative",
      date: "December 28, 2024",
      createdBy: "AB",
    },
    {
      emoji: "🛒",
      name: "E-Commerce Platform Revamp",
      date: "December 27, 2024",
      createdBy: "JD",
    },
    {
      emoji: "🌱",
      name: "Sustainability Research",
      date: "December 26, 2024",
      createdBy: "MJ",
    },
    {
      emoji: "📚",
      name: "Educational Content Development",
      date: "December 25, 2024",
      createdBy: "SS",
    },
    {
      emoji: "🏗️",
      name: "Urban Infrastructure Design",
      date: "December 24, 2024",
      createdBy: "RT",
    },
    {
      emoji: "🎨",
      name: "Creative Branding Campaign",
      date: "December 23, 2024",
      createdBy: "KL",
    },
    {
      emoji: "⚙️",
      name: "Automation Workflow Setup",
      date: "December 22, 2024",
      createdBy: "AK",
    },
    {
      emoji: "💼",
      name: "Corporate Strategy Alignment",
      date: "December 21, 2024",
      createdBy: "CN",
    },
    {
      emoji: "🧬",
      name: "Genomics Research Project",
      date: "December 20, 2024",
      createdBy: "LH",
    },
    {
      emoji: "🌍",
      name: "Global Outreach Program",
      date: "December 19, 2024",
      createdBy: "ZW",
    },
  ];

  return (
    <div className="flex flex-col pt-2">
      <ul role="list" className="space-y-2">
        {projects.map((item, index) => (
          <li
            key={index}
            role="listitem"
            className="shadow-none cursor-pointer border-0 py-2 hover:bg-gray-50 transition-colors ease-in-out "
          >
            <Link
              to={`/workspace/${workspaceId}/project/:p383dh`}
              className="grid gap-8 p-0"
            >
              <div className="flex items-start gap-2">
                <div className="text-xl !leading-[1.4rem]">{item.emoji}</div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <span className="text-sm text-gray-500">Created by</span>
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>{item.createdBy}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentProjects;
