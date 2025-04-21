
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const RecentProjectUpdates = ({ projectUpdates }: { projectUpdates: any[] }) => (
  <div className="space-y-4 pt-4">
    <h2 className="text-xl font-semibold">Recent Project Updates</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projectUpdates.map(update => (
        <Card key={update.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{update.title}</CardTitle>
            <CardDescription className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(update.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{update.content}</p>
            <p className="text-xs text-muted-foreground mt-2">Source: {update.source}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default RecentProjectUpdates;
