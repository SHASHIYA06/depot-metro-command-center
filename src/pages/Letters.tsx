
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, FileText, Mail, Calendar, User, Building } from 'lucide-react';
import { Letter } from '@/types/letter';

// Sample letters data - replace with actual data from your backend
const sampleLetters: Letter[] = [
  {
    id: '1',
    letterType: 'Incoming',
    letterNumber: 'BEML/2024/001',
    date: '2024-01-15',
    subject: 'Technical Specifications for Train Maintenance',
    issuedByOrReceivedFrom: 'BMRCL Technical Team',
    attachments: ['spec_document.pdf'],
    remarks: 'Urgent review required',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T10:30:00',
    createdBy: 'user-1'
  },
  {
    id: '2',
    letterType: 'Outgoing',
    letterNumber: 'BEML/OUT/2024/001',
    date: '2024-01-16',
    subject: 'Monthly Progress Report - Train Commissioning',
    issuedByOrReceivedFrom: 'BMRCL Project Management',
    attachments: ['progress_report.pdf', 'timeline.xlsx'],
    remarks: 'Submitted as per schedule',
    createdAt: '2024-01-16T14:20:00',
    updatedAt: '2024-01-16T14:20:00',
    createdBy: 'user-2'
  },
  {
    id: '3',
    letterType: 'Incoming',
    letterNumber: 'BMRCL/2024/078',
    date: '2024-01-18',
    subject: 'Safety Compliance Audit Schedule',
    issuedByOrReceivedFrom: 'BMRCL Safety Department',
    attachments: ['audit_schedule.pdf'],
    remarks: 'Action required within 7 days',
    createdAt: '2024-01-18T09:15:00',
    updatedAt: '2024-01-18T09:15:00',
    createdBy: 'user-1'
  }
];

const Letters = () => {
  const navigate = useNavigate();
  const [letters] = useState<Letter[]>(sampleLetters);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  // Filter letters based on search and filters
  const filteredLetters = letters.filter(letter => {
    const matchesSearch = searchTerm === '' || 
      letter.letterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.issuedByOrReceivedFrom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || letter.letterType === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleCreateLetter = () => {
    navigate('/letters/new');
  };

  const getTypeColor = (type: string) => {
    return type === 'Incoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Letters Management</h1>
          <p className="text-muted-foreground">
            Manage incoming and outgoing correspondence
          </p>
        </div>
        <Button onClick={handleCreateLetter} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Letter
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Letters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{letters.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {letters.filter(l => l.letterType === 'Incoming').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outgoing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {letters.filter(l => l.letterType === 'Outgoing').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {letters.filter(l => new Date(l.date).getMonth() === new Date().getMonth()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Letters List</CardTitle>
          <CardDescription>
            Search and filter through all correspondence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search letters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Incoming">Incoming</SelectItem>
                <SelectItem value="Outgoing">Outgoing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Letters Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Letter Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>From/To</TableHead>
                  <TableHead>Attachments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLetters.map((letter) => (
                  <TableRow key={letter.id}>
                    <TableCell className="font-mono">{letter.letterNumber}</TableCell>
                    <TableCell>{new Date(letter.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(letter.letterType)}>
                        {letter.letterType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{letter.subject}</TableCell>
                    <TableCell>{letter.issuedByOrReceivedFrom}</TableCell>
                    <TableCell>
                      {letter.attachments.length > 0 ? (
                        <Badge variant="outline">
                          {letter.attachments.length} file(s)
                        </Badge>
                      ) : (
                        'None'
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedLetter(letter)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Letter Details</DialogTitle>
                          </DialogHeader>
                          {selectedLetter && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-semibold">Letter Number:</label>
                                  <p>{selectedLetter.letterNumber}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold">Date:</label>
                                  <p>{new Date(selectedLetter.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold">Type:</label>
                                  <Badge className={getTypeColor(selectedLetter.letterType)}>
                                    {selectedLetter.letterType}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold">From/To:</label>
                                  <p>{selectedLetter.issuedByOrReceivedFrom}</p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-semibold">Subject:</label>
                                <p>{selectedLetter.subject}</p>
                              </div>
                              
                              {selectedLetter.attachments.length > 0 && (
                                <div>
                                  <label className="text-sm font-semibold">Attachments:</label>
                                  <ul className="list-disc list-inside">
                                    {selectedLetter.attachments.map((attachment, index) => (
                                      <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                                        {attachment}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {selectedLetter.remarks && (
                                <div>
                                  <label className="text-sm font-semibold">Remarks:</label>
                                  <p>{selectedLetter.remarks}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLetters.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No letters found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Letters;
