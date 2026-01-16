"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Plus, Search, Users, Mail } from "lucide-react";
import { Input } from "~/components/ui/input";
import Link from "next/link";

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: clients, isLoading } = api.client.list.useQuery();

  const filteredClients = clients?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-slate-500">
            Manage your client relationships and projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search clients..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-slate-100" />
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      ) : filteredClients?.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-slate-400" />
          </div>
          <CardTitle>No clients found</CardTitle>
          <CardDescription>Start by adding your first client.</CardDescription>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/dashboard/clients/new">Add Client</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients?.map((client) => (
            <Card key={client.id} className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">{client.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" /> {client.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm font-medium">Recent Activity:</div>
                  <div className="text-xs text-slate-500 italic">
                    No recent projects.
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t flex justify-end">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/dashboard/clients/${client.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
