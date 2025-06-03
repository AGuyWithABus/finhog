import React from "react";
import TaskManagement from "@/components/dashboard/TaskManagement";

const TasksPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Organize and track your project tasks
          </p>
        </div>
        <TaskManagement />
      </div>
    </div>
  );
};

export default TasksPage;
