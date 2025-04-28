
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NCRForm } from '@/components/ncr/NCRForm';
import { NCRReport } from '@/types/ncr';
import { useToast } from '@/hooks/use-toast';

const NCRCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (ncrReport: NCRReport) => {
    // In a real application, you would save the NCR report to your backend/database
    console.log('NCR Report submitted:', ncrReport);
    
    toast({
      title: "NCR Report Created",
      description: `NCR Report ${ncrReport.ncrReportNo} has been created successfully.`,
    });
    
    // Redirect to the NCR reports list page (to be created)
    navigate('/ncr-reports');
  };
  
  const handleCancel = () => {
    navigate('/ncr-reports');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create NCR Report</h1>
        <p className="text-muted-foreground">
          Create a new Non-Conformance Report (NCR) to track quality issues and resolutions
        </p>
      </div>
      
      <NCRForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default NCRCreate;
