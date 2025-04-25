
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobCardForm } from '@/components/job-card/JobCardForm';
import { JobCard } from '@/types/job-card';
import { getJobCardById } from '@/lib/mockDataJobCards';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const JobCardEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  const handleSubmit = (updatedJobCard: JobCard) => {
    // In a real application, you would update the job card in your backend/database
    console.log('Job card updated:', updatedJobCard);
    
    toast({
      title: "Job Card Updated",
      description: `Job Card ${updatedJobCard.jcNo} has been updated successfully.`,
    });
    
    // Redirect to the job card detail page
    navigate(`/job-cards/${id}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Job Card</h1>
        <p className="text-muted-foreground">
          Edit details for job card {jobCard.jcNo}
        </p>
      </div>
      
      <JobCardForm initialJobCard={jobCard} onSubmit={handleSubmit} isEditing={true} />
    </div>
  );
};

export default JobCardEdit;
