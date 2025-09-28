'use client'

import ConfirmModal from "@/components/ConfirmModal";
import PricingPaidTable from "@/components/data-table/PricingPaidTable";
import PricingPaidModal from "@/components/forms/PricingPaidModal";
import { pricingPaidFormData } from "@/lib/validation";
import { createPricingPaid, deletePricingPaid, editPricingPaid } from "@/services/pricingPaid";
import { CreatePricingPaidData, EditPricingPaidData } from "@/types/pricingPaid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function PricingPaidPage() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editpricingPaidData, setEditPricingPaidData] = useState<EditPricingPaidData | null>(null);
  const [selectedpricingPaidId, setSelectedpricingPaidId] = useState<string | null>(null);
  const [confirmDeletepricingPaidOpen, setConfirmDeletepricingPaidOpen] = useState(false);

  const queryClient = useQueryClient();

  const createpricingPaidMutation = useMutation({
    mutationFn: createPricingPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingPaids'] });
      setOpen(false);
      setEditPricingPaidData(null);
      toast.success('Numéro payant créé avec succès', { duration: 1000 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message || 'Échec de création');
      } else {
        toast.error('Erreur lors de la création');
      }
    },
  });

  const updatepricingPaidMutation = useMutation({
    mutationFn: ({ id, ...rest }: EditPricingPaidData) => editPricingPaid(id, rest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingPaids'] });
      setOpen(false);
      setEditPricingPaidData(null);
      setSelectedpricingPaidId(null);
      toast.success('Numéro payant modifié avec succès', { duration: 1000 });
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
      await deletePricingPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingPaids'] });
      setConfirmDeletepricingPaidOpen(false);
      setSelectedpricingPaidId(null);
      toast.success("Le numéro payant supprimé avec succès", { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de l'opération");
      } else {
        toast.error('Une erreur s’est produite');
      }
    },
  });

  const handleAgentSubmit = (data: pricingPaidFormData) => {
    const apiData = {
      ordernumber: data.ordernumber,
      prefix: data.prefix,
      amount: data.amount,
      description: data.description,
    };

    if (editpricingPaidData) {
      const editData: EditPricingPaidData = {
        id: editpricingPaidData.id,
        ...apiData,
      };

      updatepricingPaidMutation.mutate(editData);
    } else {
      const createData: CreatePricingPaidData = {
        ...apiData,
      };

      createpricingPaidMutation.mutate(createData);
    }
  };

  const handleDeletepricingPaid = () => {
    if (selectedpricingPaidId) {
      deleteAgentMutation.mutate(selectedpricingPaidId);
    }
  };


  return (
    <div className="p-4">
      <h3 className='text-xl font-bold mb-3'>Gestion des numéros payants</h3>

      <PricingPaidTable
        onEditPricingPaidData={setEditPricingPaidData}
        onIsEditing={setIsEditing}
        onOpen={setOpen}
        onSetConfirmDeletepricingPaidOpen={setConfirmDeletepricingPaidOpen}
        onSetSelectedPricingPaidId={setSelectedpricingPaidId}
        buttonComponent={
          <PricingPaidModal
            initialData={editpricingPaidData ?? undefined}
            isEditing={isEditing}
            onSubmit={handleAgentSubmit}
            isLoading={createpricingPaidMutation.isPending || updatepricingPaidMutation.isPending}
            open={open}
            setOpen={setOpen}
            onSetEditPricingPaidData={setEditPricingPaidData}
            onIsEditing={setIsEditing}
          />
        }
      />

      <ConfirmModal
        open={confirmDeletepricingPaidOpen}
        setOpen={setConfirmDeletepricingPaidOpen}
        onConfirm={handleDeletepricingPaid}
        description="Cette action est irréversible."
        cancelText="Annuler"
        isLoading={deleteAgentMutation.isPending}
      />
    </div>
  )
}