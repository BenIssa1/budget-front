'use client'

import ConfirmModal from "@/components/ConfirmModal";
import ServiceTable from "@/components/data-table/ServiceTable";
import ServiceModal from "@/components/forms/ServiceModal";
import { serviceFormData } from "@/lib/validation";
import { createService, deleteService, editService } from "@/services/service";
import { CreateServiceData, EditServiceData } from "@/types/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function ServicePage() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editServiceData, setEditServiceData] = useState<EditServiceData | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [confirmDeleteServiceOpen, setConfirmDeleteServiceOpen] = useState(false);

  const queryClient = useQueryClient();

  const createServiceMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setOpen(false);
      toast.success('Service créé avec succès', { duration: 1000 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message || 'Échec de création');
      } else {
        toast.error('Erreur lors de la création');
      }
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, ...rest }: EditServiceData) => editService(id, rest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setOpen(false);
      toast.success('Service modifié avec succès', { duration: 1000 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message || 'Échec de modification');
      } else {
        toast.error('Erreur lors de la modification');
      }
    },
  });

  const deleteAgentMutation = useMutation({
    mutationFn: async (id: string) =>
      await deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setConfirmDeleteServiceOpen(false);
      setSelectedServiceId(null);
      toast.success("Le Service supprimé avec succès", { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de l'opération");
      } else {
        toast.error('Une erreur s’est produite');
      }
    },
  });

  const handleAgentSubmit = (data: serviceFormData) => {
    const apiData = {
      label: data.label,
      description: data.description,
    };

    if (editServiceData) {
      const editData: EditServiceData = {
        id: editServiceData.id,
        ...apiData,
      };

      updateServiceMutation.mutate(editData);
    } else {
      const createData: CreateServiceData = {
        ...apiData,
      };

      createServiceMutation.mutate(createData);
    }
  };

  const handleDeleteService = () => {
    if (selectedServiceId) {
      deleteAgentMutation.mutate(selectedServiceId);
    }
  };


  return (
    <div className="p-4">
      <h3 className='text-xl font-bold mb-3'>Gestion des Services</h3>

      <ServiceTable
        onEditServiceData={setEditServiceData}
        onIsEditing={setIsEditing}
        onOpen={setOpen}
        onSetConfirmDeleteServiceOpen={setConfirmDeleteServiceOpen}
        onSetSelectedServiceId={setSelectedServiceId}
        buttonComponent={
          <ServiceModal
            initialData={editServiceData ?? undefined}
            isEditing={isEditing}
            onSubmit={handleAgentSubmit}
            isLoading={createServiceMutation.isPending || updateServiceMutation.isPending}
            open={open}
            setOpen={setOpen}
          />
        }
      />

      <ConfirmModal
        open={confirmDeleteServiceOpen}
        setOpen={setConfirmDeleteServiceOpen}
        onConfirm={handleDeleteService}
        description="Cette action est irréversible."
        cancelText="Annuler"
        isLoading={deleteAgentMutation.isPending}
      />
    </div>
  )
}