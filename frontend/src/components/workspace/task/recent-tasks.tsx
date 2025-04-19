import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TaskPriorityEnum, TaskStatusEnum } from '@/constant';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { getAllTasksQueryFn } from '@/lib/api';
import { getAvatarColor, getAvatarFallbackText, transformStatusEnum } from '@/lib/helper';
import { TaskType } from '@/types/api.type';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loader } from 'lucide-react';

const RecentTasks = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useQuery({
    queryKey: ['all-tasks', workspaceId],
    queryFn: () => getAllTasksQueryFn({ workspaceId }),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  // Tasks data
  const tasks: TaskType[] = data?.tasks || [];

  // const tasks: TasksType[] = [
  //   {
  //     id: 'Task-001',
  //     title: 'Update marketing campaign assets',
  //     dueDate: 'January 5, 2025',
  //     status: 'IN_PROGRESS',
  //     priority: 'HIGH',
  //     assigneeTo: 'JD',
  //   },
  //   {
  //     id: 'Task-002',
  //     title: 'Prepare quarterly financial reports',
  //     dueDate: 'February 15, 2025',
  //     status: 'DONE',
  //     priority: 'MEDIUM',
  //     assigneeTo: 'AL',
  //   },
  //   {
  //     id: 'Task-003',
  //     title: 'Fix UI bugs in the dashboard',
  //     dueDate: 'March 10, 2025',
  //     status: 'TODO',
  //     priority: 'HIGH',
  //     assigneeTo: 'RK',
  //   },
  //   {
  //     id: 'Task-004',
  //     title: 'Draft proposal for new project',
  //     dueDate: 'April 22, 2025',
  //     status: 'IN_REVIEW',
  //     priority: 'LOW',
  //     assigneeTo: 'ML',
  //   },
  //   {
  //     id: 'Task-005',
  //     title: 'Conduct team performance reviews',
  //     dueDate: 'May 1, 2025',
  //     status: 'TODO',
  //     priority: 'HIGH',
  //     assigneeTo: 'SG',
  //   },
  // ];

  // Scalable component
  return (
    <div className="flex flex-col space-y-6">
      {isLoading && <Loader className="w-8 h-8 animate-spin place-self-center flex" />}
      {tasks?.length === 0 && (
        <div className="font-semibold text-sm text-muted-foreground text-center py-5">
          No Tasks created yet
        </div>
      )}
      <ul role="list" className="divide-y divide-gray-200">
        {tasks?.map((task) => {
          const name = task?.assignedTo?.name || '';
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          return (
            <li
              key={task._id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              {/* Task Info */}
              <div className="flex flex-col space-y-1 flex-grow">
                <span className="text-sm capitalize text-gray-600 font-medium">
                  {task.taskcode}
                </span>
                <p className="text-md font-semibold text-gray-800 truncate">
                  {task.title}
                </p>
                <span className="text-sm text-gray-500">
                  Due: {task.dueDate ? format(task.dueDate, 'PPP') : null}
                </span>
              </div>

              {/* Task Status */}
              <div className="text-sm font-medium ">
                <Badge
                  variant={TaskStatusEnum[task.status]}
                  className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                >
                  <span>{transformStatusEnum(task.status)}</span>
                </Badge>
              </div>

              {/* Task Priority */}
              <div className="text-sm ml-2">
                <Badge
                  variant={TaskPriorityEnum[task.priority]}
                  className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                >
                  <span>{transformStatusEnum(task.priority)}</span>
                </Badge>
              </div>

              {/* Assignee */}
              <div className="flex items-center space-x-2 ml-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={task?.assignedTo?.profilePicture || ''}
                    alt={task.assignedTo?.name || ''}
                  />
                  <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                </Avatar>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentTasks;

// const RecentTasks = () => {
//   const tasks = [
//     {
//       id: "Task-12",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//     {
//       id: "Task-13",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//     {
//       id: "Task-14",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//     {
//       id: "Task-15",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//     {
//       id: "Task-16",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//   ];
//   return (
//     <div className="flex flex-col pt-2">
//       <ul role="list" className="space-y-2">
//         {tasks.map((item, index) => (
//           <li
//             key={index}
//             role="listitem"
//             className="shadow-none border-0 py-2 hover:bg-[#fbfbfb] transition-colors ease-in-out "
//           >
//             <div className="grid grid-cols-7 gap-1 p-0">
//               <div className="shrink">
//                 <p>{item.id}</p>
//               </div>
//               <div className="col-span-2">
//                 <p className="text-sm font-medium leading-none">{item.title}</p>
//               </div>
//               <div>dueDate</div>
//               <div>Todo</div>
//               <div>High</div>
//               <div className="flex items-center gap-4 place-self-end">
//                 <span className="text-sm text-gray-500">Assigned To</span>
//                 <Avatar className="hidden h-9 w-9 sm:flex">
//                   <AvatarImage src="/avatars/01.png" alt="Avatar" />
//                   <AvatarFallback>{item.assigneeTo}</AvatarFallback>
//                 </Avatar>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default RecentTasks;

