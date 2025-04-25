
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobCardDetail } from '@/components/job-card/JobCardDetail';
import { getJobCardById } from '@/lib/mockDataJobCards';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const JobCardDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const jobCard = getJobCardById(id || '');
  
  if (!jobCard) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-semibold mb-4">Job Card Not Found</h1>
        <p className="text-muted-foreground mb-8">The requested job card does not exist or has been deleted.</p>
        <Button onClick={() => navigate('/job-cards')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Job Cards
        </Button>
      </div>
    );
  }
  
  const handleEdit = () => {
    navigate(`/job-cards/edit/${id}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Card Details</h1>
        <p className="text-muted-foreground">
          View detailed information for job card {jobCard.jcNo}
        </p>
      </div>
      
      <JobCardDetail jobCard={jobCard} onEdit={handleEdit} />
    </div>
  );
};

export default JobCardDetailPage;
