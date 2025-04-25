
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/types/job-card';
import { ChevronRight, Filter, FilePlus, Search, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';

interface JobCardListProps {
  jobCards: JobCard[];
  title?: string;
}

export const JobCardList: React.FC<JobCardListProps> = ({ 
  jobCards, 
  title = "Job Cards"
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [systemFilter, setSystemFilter] = useState<string>('');
  const [maintenanceTypeFilter, setMaintenanceTypeFilter] = useState<string>('');

  // Create list of unique systems for filter dropdown
  const systems = Array.from(new Set(jobCards.map(jobCard => jobCard.system))).sort();

  // Apply filters to job cards
  const filteredJobCards = jobCards.filter(jobCard => {
    const matchesSearch = 
      searchTerm === '' || 
      jobCard.jcNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.failureDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.issuedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.trainNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || jobCard.status === statusFilter;
    const matchesSystem = systemFilter === '' || jobCard.system === systemFilter;
    const matchesMaintenanceType = maintenanceTypeFilter === '' || jobCard.maintenanceType === maintenanceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesSystem && matchesMaintenanceType;
  });

  const handleExport = (type: 'excel' | 'pdf') => {
    const dataToExport = filteredJobCards.map(card => ({
      'JC No': card.jcNo,
      'FRACAS ID': card.fracasId,
      'Train': card.trainNo,
      'Car': card.carNo,
      'Issued To': card.issuedTo,
      'Failure Date': card.failureOccurredDate,
      'Maintenance Type': card.maintenanceType,
      'System': card.system,
      'Sub-System': card.subSystem,
      'Failure': card.failureDescription,
      'Status': card.status
    }));

    if (type === 'excel') {
      exportToExcel(dataToExport, 'job_cards_export');
      toast({
        title: "Export Successful",
        description: `${dataToExport.length} job cards have been exported to Excel.`
      });
    } else {
      exportToPDF(dataToExport, 'job_cards_export', 'Job Cards Report');
      toast({
        title: "Export Successful",
        description: `${dataToExport.length} job cards have been exported to PDF.`
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>View and manage job cards</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')} className="flex gap-2 items-center">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Excel</span>
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')} className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </Button>
          <Button onClick={() => navigate('/job-cards/new')} className="flex gap-2 items-center">
            <FilePlus className="h-4 w-4" />
            <span>New Job Card</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search job cards..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={maintenanceTypeFilter} onValueChange={setMaintenanceTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="CM">CM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                  <SelectItem value="OPM">OPM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Systems</SelectItem>
                  {systems.map(system => (
                    <SelectItem key={system} value={system}>{system}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>JC No</TableHead>
                <TableHead>Train</TableHead>
                <TableHead>Car</TableHead>
                <TableHead className="hidden md:table-cell">Issued To</TableHead>
                <TableHead className="hidden md:table-cell">System</TableHead>
                <TableHead className="hidden md:table-cell">Failure Date</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobCards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No job cards found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobCards.map((jobCard) => (
                  <TableRow key={jobCard.id} className="cursor-pointer" onClick={() => navigate(`/job-cards/${jobCard.id}`)}>
                    <TableCell className="font-medium">{jobCard.jcNo}</TableCell>
                    <TableCell>{jobCard.trainNo}</TableCell>
                    <TableCell>{jobCard.carNo}</TableCell>
                    <TableCell className="hidden md:table-cell">{jobCard.issuedTo}</TableCell>
                    <TableCell className="hidden md:table-cell">{jobCard.system}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(parseISO(jobCard.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{jobCard.maintenanceType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          jobCard.status === 'open' ? 'default' :
                          jobCard.status === 'in_progress' ? 'secondary' :
                          jobCard.status === 'completed' ? 'outline' : 'success'
                        }
                      >
                        {jobCard.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          navigate(`/job-cards/${jobCard.id}`);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Showing {filteredJobCards.length} of {jobCards.length} job cards
        </div>
      </CardContent>
    </Card>
  );
};
