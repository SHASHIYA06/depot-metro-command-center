
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LetterForm } from '@/components/letter/LetterForm';
import { Letter } from '@/types/letter';
import { useToast } from '@/hooks/use-toast';

const LetterCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (letter: Letter) => {
    // In a real application, you would save the letter to your backend/database
    console.log('Letter submitted:', letter);
    
    toast({
      title: "Letter Created",
      description: `Letter ${letter.letterNumber} has been created successfully.`,
    });
    
    // Redirect to the letters list page (to be created)
    navigate('/letters');
  };
  
  const handleCancel = () => {
    navigate('/letters');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Letter Record</h1>
        <p className="text-muted-foreground">
          Create a new record for incoming or outgoing correspondence
        </p>
      </div>
      
      <LetterForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default LetterCreate;
