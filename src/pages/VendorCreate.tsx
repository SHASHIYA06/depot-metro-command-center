
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VendorForm } from '@/components/vendor/VendorForm';
import { Vendor } from '@/types/vendor';
import { useToast } from '@/hooks/use-toast';

const VendorCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (vendor: Vendor) => {
    // In a real application, you would save the vendor to your backend/database
    console.log('Vendor submitted:', vendor);
    
    toast({
      title: "Vendor Created",
      description: `Vendor ${vendor.vendorName} has been created successfully.`,
    });
    
    // Redirect to the vendors list page (to be created)
    navigate('/vendors');
  };
  
  const handleCancel = () => {
    navigate('/vendors');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Vendor</h1>
        <p className="text-muted-foreground">
          Create a new vendor to track supplier information and contract details
        </p>
      </div>
      
      <VendorForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default VendorCreate;
