
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Edit, Trash2, Image } from 'lucide-react';

interface CommissioningActivity {
  id: string;
  trainSet: string;
  carNo: string;
  system: string;
  activity: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  remarks: string;
  officer: string;
  date: string;
  photoUrls: string[];
}

interface CommissioningTableProps {
  activities: CommissioningActivity[];
  currentUser: string;
  onEdit: (activity: CommissioningActivity) => void;
  onDelete: (id: string, officer: string) => void;
}

export const CommissioningTable: React.FC<CommissioningTableProps> = ({
  activities,
  currentUser,
  onEdit,
  onDelete
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [viewingActivity, setViewingActivity] = useState<CommissioningActivity | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewPhotos = (activity: CommissioningActivity) => {
    setSelectedPhotos(activity.photoUrls);
    setViewingActivity(activity);
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No commissioning activities found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Train Set</TableHead>
              <TableHead>Car No</TableHead>
              <TableHead>System</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Officer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.trainSet}</TableCell>
                <TableCell>{activity.carNo}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={activity.system}>
                  {activity.system}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={activity.activity}>
                  {activity.activity}
                </TableCell>
                <TableCell>{getStatusBadge(activity.status)}</TableCell>
                <TableCell>{activity.officer}</TableCell>
                <TableCell>{format(new Date(activity.date), 'dd MMM yyyy HH:mm')}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {activity.photoUrls.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewPhotos(activity)}
                        title="View Photos"
                      >
                        <Image className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {activity.officer === currentUser && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEdit(activity)}
                          title="Edit Activity"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive"
                              title="Delete Activity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this commissioning activity? 
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-4">
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button 
                                variant="destructive" 
                                onClick={() => onDelete(activity.id, activity.officer)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Photo viewer dialog */}
      <Dialog open={viewingActivity !== null} onOpenChange={(open) => !open && setViewingActivity(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Photos for {viewingActivity?.activity} - {viewingActivity?.trainSet}
            </DialogTitle>
            <DialogDescription>
              Uploaded by {viewingActivity?.officer} on {viewingActivity && format(new Date(viewingActivity.date), 'dd MMM yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {selectedPhotos.map((url, index) => (
              <div key={index} className="overflow-hidden rounded-md border">
                <img 
                  src={url} 
                  alt={`Photo ${index + 1}`} 
                  className="h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
