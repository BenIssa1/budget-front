'use client'

import ConfirmModal from "@/components/ConfirmModal";
import BugetTable from "@/components/data-table/BugetTable";
import BudgetModal from "@/components/forms/BudgetModal";
import { BudgetFormData } from "@/lib/validation";
import { createBudget, deleteBudget, editBuget } from "@/services/budget";
import { CreateBugetData, EditBudgetData } from "@/types/budget";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function BudgetPage() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editBudgetData, setEditBudgetData] = useState<EditBudgetData | null>(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [confirmDeleteBudgetOpen, setConfirmDeleteBudgetOpen] = useState(false);

  const queryClient = useQueryClient();

  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setOpen(false);
      toast.success('Buget créé avec succès', { duration: 1000 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message || 'Échec de création');
      } else {
        toast.error('Erreur lors de la création');
      }
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, ...rest }: EditBudgetData) => editBuget(id, rest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setOpen(false);
      toast.success('Buget modifié avec succès', { duration: 1000 });
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
      await deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setConfirmDeleteBudgetOpen(false);
      setSelectedBudgetId(null);
      toast.success("Le budget supprimé avec succès", { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de l'opération");
      } else {
        toast.error('Une erreur s’est produite');
      }
    },
  });

  const handleAgentSubmit = (data: BudgetFormData) => {
    const apiData = {
      label: data.label,
      amount: data.amount,
      description: data.description,
    };

    if (editBudgetData) {
      const editData: EditBudgetData = {
        id: editBudgetData.id,
        ...apiData,
      };

      updateBudgetMutation.mutate(editData);
    } else {
      const createData: CreateBugetData = {
        ...apiData,
      };

      createBudgetMutation.mutate(createData);
    }
  };

  const handleDeleteBudget = () => {
    if (selectedBudgetId) {
      deleteAgentMutation.mutate(selectedBudgetId);
    }
  };


  return (
    <div className="p-4">
      <h3 className='text-xl font-bold mb-3'>Gestion des budgets</h3>

      <BugetTable
        onEditBudgetData={setEditBudgetData}
        onIsEditing={setIsEditing}
        onOpen={setOpen}
        onSetConfirmDeleteBudgetOpen={setConfirmDeleteBudgetOpen}
        onSetSelectedBudgetId={setSelectedBudgetId}
        buttonComponent={
          <BudgetModal
            initialData={editBudgetData ?? undefined}
            isEditing={isEditing}
            onSubmit={handleAgentSubmit}
            isLoading={createBudgetMutation.isPending || updateBudgetMutation.isPending}
            open={open}
            setOpen={setOpen}
          />
        }
      />

      <ConfirmModal
        open={confirmDeleteBudgetOpen}
        setOpen={setConfirmDeleteBudgetOpen}
        onConfirm={handleDeleteBudget}
        description="Cette action est irréversible."
        cancelText="Annuler"
        isLoading={deleteAgentMutation.isPending}
      />
    </div>
  )
}