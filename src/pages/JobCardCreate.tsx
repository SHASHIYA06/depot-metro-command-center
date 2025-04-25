
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JobCardForm } from '@/components/job-card/JobCardForm';
import { JobCard } from '@/types/job-card';
import { useToast } from '@/hooks/use-toast';

const JobCardCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (jobCard: JobCard) => {
    // In a real application, you would save the job card to your backend/database
    console.log('Job card submitted:', jobCard);
    
    toast({
      title: "Job Card Created",
      description: `Job Card ${jobCard.jcNo} has been created successfully.`,
    });
    
    // Redirect to the job cards list page
    navigate('/job-cards');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Job Card</h1>
        <p className="text-muted-foreground">
          Create a new job card to track maintenance and repairs
        </p>
      </div>
      
      <JobCardForm onSubmit={handleSubmit} />
    </div>
  );
};

export default JobCardCreate;
