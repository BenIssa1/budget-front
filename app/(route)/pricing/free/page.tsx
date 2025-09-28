'use client'

import ConfirmModal from "@/components/ConfirmModal";
import PricingFreeTable from "@/components/data-table/PricingFreeTable";
import PricingFreeModal from "@/components/forms/PricingFreeModal";
import { pricingFreeFormData } from "@/lib/validation";
import { createPricingFree, deletePricingFree, editPricingFree } from "@/services/pricingFree";
import { CreatePricingFreeData, EditPricingFreeData } from "@/types/pricingFree";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function PricingFreePage() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editpricingFreeData, setEditpricingFreeData] = useState<EditPricingFreeData | null>(null);
  const [selectedpricingFreeId, setSelectedpricingFreeId] = useState<string | null>(null);
  const [confirmDeletepricingFreeOpen, setConfirmDeletepricingFreeOpen] = useState(false);

  const queryClient = useQueryClient();

  const createpricingFreeMutation = useMutation({
    mutationFn: createPricingFree,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingFrees'] });
      setOpen(false);
      toast.success('Numéro gratuit créé avec succès', { duration: 1000 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message || 'Échec de création');
      } else {
        toast.error('Erreur lors de la création');
      }
    },
  });

  const updatepricingFreeMutation = useMutation({
    mutationFn: ({ id, ...rest }: EditPricingFreeData) => editPricingFree(id, rest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingFrees'] });
      setOpen(false);
      toast.success('Numéro gratuit modifié avec succès', { duration: 1000 });
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
      await deletePricingFree(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingFrees'] });
      setConfirmDeletepricingFreeOpen(false);
      setSelectedpricingFreeId(null);
      toast.success("Le numéro gratuit supprimé avec succès", { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de l'opération");
      } else {
        toast.error('Une erreur s’est produite');
      }
    },
  });

  const handleAgentSubmit = (data: pricingFreeFormData) => {
    const apiData = {
      contact: data.contact,
      description: data.description,
    };

    if (editpricingFreeData) {
      const editData: EditPricingFreeData = {
        id: editpricingFreeData.id,
        ...apiData,
      };

      updatepricingFreeMutation.mutate(editData);
    } else {
      const createData: CreatePricingFreeData = {
        ...apiData,
      };

      createpricingFreeMutation.mutate(createData);
    }
  };

  const handleDeletepricingFree = () => {
    if (selectedpricingFreeId) {
      deleteAgentMutation.mutate(selectedpricingFreeId);
    }
  };


  return (
    <div className="p-4">
      <h3 className='text-xl font-bold mb-3'>Gestion des numéros gratuits</h3>

      <PricingFreeTable
        onEditpricingFreeData={setEditpricingFreeData}
        onIsEditing={setIsEditing}
        onOpen={setOpen}
        onSetConfirmDeletepricingFreeOpen={setConfirmDeletepricingFreeOpen}
        onSetSelectedpricingFreeId={setSelectedpricingFreeId}
        buttonComponent={
          <PricingFreeModal
            initialData={editpricingFreeData ?? undefined}
            isEditing={isEditing}
            onSubmit={handleAgentSubmit}
            isLoading={createpricingFreeMutation.isPending || updatepricingFreeMutation.isPending}
            open={open}
            setOpen={setOpen}
            onSetEditPricingFreeData={setEditpricingFreeData}
            onIsEditing={setIsEditing}
          />
        }
      />

      <ConfirmModal
        open={confirmDeletepricingFreeOpen}
        setOpen={setConfirmDeletepricingFreeOpen}
        onConfirm={handleDeletepricingFree}
        description="Cette action est irréversible."
        cancelText="Annuler"
        isLoading={deleteAgentMutation.isPending}
      />
    </div>
  )
}