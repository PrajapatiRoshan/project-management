import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/helper";

const RecentMembers = () => {
  const members = [
    {
      name: "Alice Johnson",
      role: "Member",
      joinedDate: "December 20, 2024",
      avatar: "/avatars/alice.png",
      initials: "AJ",
    },
    {
      name: "Bob Smith",
      role: "Admin",
      joinedDate: "December 18, 2024",
      avatar: "/avatars/bob.png",
      initials: "BS",
    },
    {
      name: "Chloe Martinez",
      role: "Member",
      joinedDate: "December 17, 2024",
      avatar: "/avatars/chloe.png",
      initials: "CM",
    },
    {
      name: "David Lee",
      role: "Owner",
      joinedDate: "December 15, 2024",
      avatar: "/avatars/david.png",
      initials: "DL",
    },
    {
      name: "Eleanor Brown",
      role: "Member",
      joinedDate: "December 12, 2024",
      avatar: "/avatars/eleanor.png",
      initials: "EB",
    },
    {
      name: "Frank White",
      role: "Member",
      joinedDate: "December 10, 2024",
      avatar: "/avatars/frank.png",
      initials: "FW",
    },
    {
      name: "Grace Green",
      role: "Admin",
      joinedDate: "December 8, 2024",
      avatar: "/avatars/grace.png",
      initials: "GG",
    },
  ];

  return (
    <div className="flex flex-col pt-2">
      <ul role="list" className="space-y-3">
        {members.map((member, index) => (
          <li
            key={index}
            role="listitem"
            className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="h-9 w-9 sm:flex">
                <AvatarImage src={member.avatar} alt="Avatar" />
                <AvatarFallback
                  className={`${getAvatarColor(member.initials)}`}
                >
                  {" "}
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Member Details */}
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>

            {/* Joined Date */}
            <div className="ml-auto text-sm text-gray-500">
              <p>Joined</p>
              <p>{member.joinedDate}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentMembers;
