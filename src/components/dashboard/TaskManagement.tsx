import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Search,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  completed: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

const TaskManagement = () => {
  const { toast } = useToast();
  const [view, setView] = useState<"board" | "list">("board");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  // Form states for new task
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    description: "",
    project: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: new Date(),
  });

  // Form states for new project
  const [newProjectForm, setNewProjectForm] = useState({
    name: "",
    description: "",
  });

  // State for projects and tasks
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete overhaul of client website",
      tasks: [
        {
          id: "101",
          title: "Design Homepage",
          description: "Create wireframes and mockups for the homepage",
          project: "1",
          status: "completed",
          priority: "high",
          dueDate: new Date(2023, 5, 15),
          completed: true,
        },
        {
          id: "102",
          title: "Develop Frontend",
          description: "Implement the frontend based on approved designs",
          project: "1",
          status: "in-progress",
          priority: "medium",
          dueDate: new Date(2023, 5, 30),
          completed: false,
        },
      ],
    },
    {
      id: "2",
      name: "Marketing Campaign",
      description: "Q3 digital marketing campaign",
      tasks: [
        {
          id: "201",
          title: "Content Creation",
          description: "Create blog posts and social media content",
          project: "2",
          status: "todo",
          priority: "medium",
          dueDate: new Date(2023, 6, 10),
          completed: false,
        },
        {
          id: "202",
          title: "Ad Setup",
          description: "Configure Google and Facebook ad campaigns",
          project: "2",
          status: "todo",
          priority: "high",
          dueDate: new Date(2023, 6, 5),
          completed: false,
        },
      ],
    },
  ]);

  // Get all tasks from all projects
  const allTasks = projects.flatMap((project) => project.tasks);

  // Apply filters and search
  const filteredTasks = allTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesProject =
      projectFilter === "all" || task.project === projectFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  // Filter tasks by status
  const todoTasks = filteredTasks.filter((task) => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "in-progress",
  );
  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed",
  );

  // Helper functions
  const generateId = () => Date.now().toString();

  const handleCreateTask = () => {
    if (!newTaskForm.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    if (!newTaskForm.project) {
      toast({
        title: "Error",
        description: "Please select a project",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: generateId(),
      title: newTaskForm.title,
      description: newTaskForm.description,
      project: newTaskForm.project,
      status: "todo",
      priority: newTaskForm.priority,
      dueDate: newTaskForm.dueDate,
      completed: false,
    };

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === newTaskForm.project
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project,
      ),
    );

    // Reset form
    setNewTaskForm({
      title: "",
      description: "",
      project: "",
      priority: "medium",
      dueDate: new Date(),
    });
    setSelectedDate(new Date());
    setNewTaskDialogOpen(false);

    toast({
      title: "Success",
      description: "Task created successfully",
    });
  };

  const handleCreateProject = () => {
    if (!newProjectForm.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: generateId(),
      name: newProjectForm.name,
      description: newProjectForm.description,
      tasks: [],
    };

    setProjects((prevProjects) => [...prevProjects, newProject]);

    // Reset form
    setNewProjectForm({
      name: "",
      description: "",
    });
    setNewProjectDialogOpen(false);

    toast({
      title: "Success",
      description: "Project created successfully",
    });
  };

  const handleToggleTaskComplete = (taskId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => ({
        ...project,
        tasks: project.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                status: !task.completed ? "completed" : "todo",
              }
            : task,
        ),
      })),
    );

    const task = allTasks.find((t) => t.id === taskId);
    if (task) {
      toast({
        title: "Success",
        description: `Task &quot;${task.title}&quot; marked as ${!task.completed ? "completed" : "incomplete"}`,
      });
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setProjectFilter("all");
    setSearchQuery("");
    toast({
      title: "Filters cleared",
      description: "All filters have been reset",
    });
  };

  const renderTaskCard = (task: Task) => {
    const priorityColor = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };

    return (
      <Card key={task.id} className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => handleToggleTaskComplete(task.id)}
              />
              <div>
                <h4
                  className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}
                >
                  {task.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {projects.find((p) => p.id === task.project)?.name}
                </p>
              </div>
            </div>
            <Badge className={priorityColor[task.priority]}>
              {task.priority}
            </Badge>
          </div>
          <p className="mt-2 text-sm">{task.description}</p>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            <span>Due: {format(task.dueDate, "MMM dd, yyyy")}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Management</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNewProjectDialogOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" /> New Project
          </Button>
          <Button onClick={() => setNewTaskDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Filter tasks by status, priority, or project.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="status-filter">Status</Label>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="col-span-2 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="priority-filter">Priority</Label>
                      <Select
                        value={priorityFilter}
                        onValueChange={setPriorityFilter}
                      >
                        <SelectTrigger className="col-span-2 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="project-filter">Project</Label>
                      <Select
                        value={projectFilter}
                        onValueChange={setProjectFilter}
                      >
                        <SelectTrigger className="col-span-2 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Clear Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">
            <Tabs
              value={view}
              onValueChange={(value) => setView(value as "board" | "list")}
            >
              <TabsList>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {view === "board" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                To Do{" "}
                <Badge variant="outline" className="ml-2">
                  {todoTasks.length}
                </Badge>
              </h3>
              <div className="space-y-3">{todoTasks.map(renderTaskCard)}</div>
            </div>
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                In Progress{" "}
                <Badge variant="outline" className="ml-2">
                  {inProgressTasks.length}
                </Badge>
              </h3>
              <div className="space-y-3">
                {inProgressTasks.map(renderTaskCard)}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                Completed{" "}
                <Badge variant="outline" className="ml-2">
                  {completedTasks.length}
                </Badge>
              </h3>
              <div className="space-y-3">
                {completedTasks.map(renderTaskCard)}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Task</th>
                    <th className="p-2 text-left">Project</th>
                    <th className="p-2 text-left">Priority</th>
                    <th className="p-2 text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center">
                          <Checkbox
                            id={`list-task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() =>
                              handleToggleTaskComplete(task.id)
                            }
                          />
                          {task.status === "completed" && (
                            <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <p
                            className={
                              task.completed ? "line-through text-gray-500" : ""
                            }
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {task.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-2">
                        {projects.find((p) => p.id === task.project)?.name}
                      </td>
                      <td className="p-2">
                        <Badge
                          className={
                            task.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {format(task.dueDate, "MMM dd, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>

      {/* New Task Dialog */}
      <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="Task title"
                value={newTaskForm.title}
                onChange={(e) =>
                  setNewTaskForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Task description"
                value={newTaskForm.description}
                onChange={(e) =>
                  setNewTaskForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-project">Project</Label>
              <Select
                value={newTaskForm.project}
                onValueChange={(value) =>
                  setNewTaskForm((prev) => ({ ...prev, project: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={newTaskForm.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setNewTaskForm((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          setNewTaskForm((prev) => ({
                            ...prev,
                            dueDate: date,
                          }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewTaskDialogOpen(false);
                setNewTaskForm({
                  title: "",
                  description: "",
                  project: "",
                  priority: "medium",
                  dueDate: new Date(),
                });
                setSelectedDate(new Date());
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Project name"
                value={newProjectForm.name}
                onChange={(e) =>
                  setNewProjectForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Project description"
                value={newProjectForm.description}
                onChange={(e) =>
                  setNewProjectForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewProjectDialogOpen(false);
                setNewProjectForm({
                  name: "",
                  description: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskManagement;
