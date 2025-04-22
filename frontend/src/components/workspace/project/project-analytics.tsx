import { useParams } from 'react-router-dom';
import AnalyticsCard from '../common/analytics-card';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { useQuery } from '@tanstack/react-query';
import { getProjectAnalyticsQueryFn } from '@/lib/api';

const ProjectAnalytics = () => {
  // const analyticsList = [
  //   {
  //     id: "total-task",
  //     title: "Total Task",
  //     value: 10,
  //   },
  //   {
  //     id: "overdue-task",
  //     title: "Overdue Task",
  //     value: 30,
  //   },
  //   {
  //     id: "completed-task",
  //     title: "Completed Task",
  //     value: 18,
  //   },
  // ];

  const param = useParams();
  const projectId = param.projectId as string;
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ['project-analytics', projectId],
    queryFn: () => getProjectAnalyticsQueryFn({ workspaceId, projectId }),
    staleTime: 0,
    enabled: !!projectId,
  });

  const analytics = data?.analytics;

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-4">
      <AnalyticsCard
        isLoading={isPending}
        title={'Total Task'}
        value={analytics?.totalTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title={'Pending Task'}
        value={analytics?.pendingTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title={'Overdue Task'}
        value={analytics?.overdueTask || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title={'Completed Task'}
        value={analytics?.completedTasks || 0}
      />
    </div>
  );
};

export default ProjectAnalytics;

