'use client'

import ConfigTable from "@/components/data-table/ConfigTable";
import ConfigModal from "@/components/forms/ConfigModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { createConfig, editConfig, deleteConfig } from "@/services/config";
import { EditConfigData } from "@/types/config";
import { configFormData, configEditFormData } from "@/lib/validation";

export default function ConfigPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editConfigData, setEditConfigData] = useState<EditConfigData | undefined>(undefined);
  const [confirmDeleteConfigOpen, setConfirmDeleteConfigOpen] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");

  const queryClient = useQueryClient();

  const createConfigMutation = useMutation({
    mutationFn: async (data: configFormData) => await createConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configs'] });
      setIsModalOpen(false);
      setIsEditing(false);
      setEditConfigData(undefined);
      toast.success('Configuration créée avec succès', { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de l'opération");
      } else {
        toast.error("Une erreur s'est produite");
      }
    },
  });

  const editConfigMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: configEditFormData }) =>
      await editConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configs'] });
      setIsModalOpen(false);
      setIsEditing(false);
      setEditConfigData(undefined);
      toast.success('Configuration modifiée avec succès', { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de l'opération");
      } else {
        toast.error("Une erreur s'est produite");
      }
    },
  });

  const deleteConfigMutation = useMutation({
    mutationFn: async (id: string) => await deleteConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configs'] });
      setConfirmDeleteConfigOpen(false);
      setSelectedConfigId("");
      toast.success('Configuration supprimée avec succès', { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de l'opération");
      } else {
        toast.error("Une erreur s'est produite");
      }
    },
  });

  const handleSubmit = (data: configFormData | configEditFormData) => {
    if (isEditing && editConfigData) {
      editConfigMutation.mutate({
        id: editConfigData.id,
        data: data as configEditFormData,
      });
    } else {
      createConfigMutation.mutate(data as configFormData);
    }
  };

  const handleEditConfigData = (data: EditConfigData) => {
    setEditConfigData(data);
  };

  const handleIsEditing = (editing: boolean) => {
    setIsEditing(editing);
  };

  const handleOpen = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setIsEditing(false);
      setEditConfigData(undefined);
    }
  };

  const handleSetConfirmDeleteConfigOpen = (open: boolean) => {
    setConfirmDeleteConfigOpen(open);
  };

  const handleSetSelectedConfigId = (id: string) => {
    setSelectedConfigId(id);
  };

  const handleConfirmDelete = () => {
    if (selectedConfigId) {
      deleteConfigMutation.mutate(selectedConfigId);
    }
  };

  return (
    <div className="p-4">
      <h3 className='text-xl font-bold mb-3'>Gestion des configurations</h3>
      
      <ConfigTable
        onEditConfigData={handleEditConfigData}
        onIsEditing={handleIsEditing}
        onOpen={handleOpen}
        onSetConfirmDeleteConfigOpen={handleSetConfirmDeleteConfigOpen}
        onSetSelectedConfigId={handleSetSelectedConfigId}
        buttonComponent={
          <ConfigModal
            onSubmit={handleSubmit}
            isLoading={createConfigMutation.isPending || editConfigMutation.isPending}
            initialData={editConfigData}
            isEditing={isEditing}
            open={isModalOpen}
            setOpen={handleOpen}
          />
        }
      />

      <ConfirmModal
        open={confirmDeleteConfigOpen}
        setOpen={setConfirmDeleteConfigOpen}
        onConfirm={handleConfirmDelete}
        description="Êtes-vous sûr de vouloir supprimer cette configuration ? Cette action est irréversible."
        cancelText="Annuler"
        confirmText="Supprimer"
        isLoading={deleteConfigMutation.isPending}
      />
    </div>
  )
}