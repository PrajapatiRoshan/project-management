import AnalyticsCard from "../common/analytics-card";

const ProjectAnalytics = () => {
  const analyticsList = [
    {
      id: "total-task",
      title: "Total Task",
      value: 10,
    },
    {
      id: "overdue-task",
      title: "Overdue Task",
      value: 30,
    },
    {
      id: "completed-task",
      title: "Completed Task",
      value: 18,
    },
  ];

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {analyticsList?.map((v) => (
        <AnalyticsCard title={v.title} value={v.value} key={v.id} />
      ))}
    </div>
  );
};

export default ProjectAnalytics;
