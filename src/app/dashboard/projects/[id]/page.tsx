"use client";

import { use } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  FolderKanban,
  Milestone as MilestoneIcon,
  MessageSquare,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ScrollArea } from "~/components/ui/scroll-area";
import { format } from "date-fns";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: project, isLoading } = api.project.get.useQuery({ id });

  if (isLoading)
    return <div className="p-8 text-center">Loading project...</div>;
  if (!project)
    return (
      <div className="p-8 text-center text-red-500">Project not found.</div>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FolderKanban className="h-4 w-4" />
            <span>Project</span>
            <span>/</span>
            <span className="font-medium text-slate-900">{project.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-slate-500 max-w-2xl">{project.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={getStatusVariant(project.status)}
            className="px-3 py-1"
          >
            {project.status.replace("_", " ")}
          </Badge>
          <Button variant="outline" size="sm">
            Edit Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="milestones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <MilestoneIcon className="h-4 w-4" /> Milestones
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Internal Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Project Milestones</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Milestone
            </Button>
          </div>
          <div className="grid gap-4">
            {project.milestones.length === 0 ? (
              <Card className="p-8 text-center text-slate-500 italic">
                No milestones yet.
              </Card>
            ) : (
              project.milestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardContent className="p-6 flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-semibold flex items-center gap-2">
                        {milestone.status === "COMPLETED" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-slate-400" />
                        )}
                        {milestone.title}
                      </div>
                      <p className="text-sm text-slate-500">
                        {milestone.description}
                      </p>
                      {milestone.dueDate && (
                        <p className="text-xs text-slate-400">
                          Due:{" "}
                          {format(new Date(milestone.dueDate), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        milestone.status === "COMPLETED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {milestone.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Internal Notes</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Add Note
            </Button>
          </div>
          <ScrollArea className="h-[400px] border rounded-md p-4 bg-white">
            <div className="space-y-6">
              {project.notes.length === 0 ? (
                <div className="text-center text-slate-400 italic py-10">
                  No internal notes for this project.
                </div>
              ) : (
                project.notes.map((note) => (
                  <div
                    key={note.id}
                    className="space-y-1 border-b pb-4 last:border-0"
                  >
                    <div className="text-xs text-slate-500">
                      {format(new Date(note.createdAt), "MMM d, yyyy · p")}
                    </div>
                    <div className="text-sm leading-relaxed text-slate-700">
                      {note.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    case "ON_HOLD":
      return "destructive";
    default:
      return "outline";
  }
}
