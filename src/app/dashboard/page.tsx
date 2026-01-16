"use client";

import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FolderKanban, Users, Clock, CheckCircle2, Plus } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";

export default function DashboardOverviewPage() {
  const { data: projects } = api.project.list.useQuery();
  const { data: clients } = api.client.list.useQuery();

  const stats = [
    {
      name: "Active Projects",
      value: projects?.filter((p) => p.status !== "COMPLETED").length || 0,
      icon: FolderKanban,
      color: "text-blue-600",
    },
    {
      name: "Total Clients",
      value: clients?.length || 0,
      icon: Users,
      color: "text-purple-600",
    },
    {
      name: "Completed Projects",
      value: projects?.filter((p) => p.status === "COMPLETED").length || 0,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      name: "Overdue Milestones",
      value: 0,
      icon: Clock,
      color: "text-red-600",
    }, // For future implementation
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-none border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card className="shadow-none border-slate-200">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              View your latest project activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {project.client?.name || "No Client"}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase tracking-wider"
                    >
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>
                </Link>
              ))}
              {(!projects || projects.length === 0) && (
                <div className="text-center py-8 text-slate-400 italic">
                  No projects created yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Getting Started */}
        <Card className="shadow-none border-slate-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you might want to perform.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link
              href="/dashboard/projects/new"
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 group hover:bg-blue-100 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-blue-900 leading-none">
                  Create a Project
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  Launch a new workspace for a client.
                </div>
              </div>
            </Link>
            <Link
              href="/dashboard/clients/new"
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100 group hover:bg-purple-100 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-purple-900 leading-none">
                  Add a Client
                </div>
                <div className="text-sm text-purple-700 mt-1">
                  Onboard a new client relationship.
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
