import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberForm from '../components/MemberForm';
import { membrosService } from '../services/membros';
import { toast } from 'react-toastify';

const CadastroMembro: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      await membrosService.createMember(data);
      // The success toast is already shown in the service
      navigate('/members'); // Redirect to members list after successful registration
    } catch (error) {
      // The error is already handled and toasted in the service
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    navigate('/members'); // Redirect to members list if the user cancels
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cadastro de Novo Membro</h1>
        <MemberForm
          onSave={handleSave}
          onClose={handleClose}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default CadastroMembro;
