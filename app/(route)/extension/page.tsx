'use client'

import ExtensionTable from "@/components/data-table/Extension";
import BonusModal from "@/components/forms/BonusModal";
import BudgetLinkModal from "@/components/forms/BudgetLinkModal";
import ServiceLinkModal from "@/components/forms/ServiceLinkModal";
import ConfirmModal from "@/components/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { addBonus, syncExtensions } from "@/services/extension";
import { ExtensionAPI } from "@/types/extension";

export default function ExtensionPage() {
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<ExtensionAPI | null>(null);
  const [confirmSyncOpen, setConfirmSyncOpen] = useState(false);

  const queryClient = useQueryClient();

  const addBonusMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) =>
      await addBonus(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extensions'] });
      setBonusModalOpen(false);
      setSelectedExtension(null);
      toast.success('Bonus ajouté avec succès', { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de l'opération");
      } else {
        toast.error("Une erreur s'est produite");
      }
    },
  });

  const syncExtensionsMutation = useMutation({
    mutationFn: async () => await syncExtensions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extensions'] });
      setConfirmSyncOpen(false);
      toast.success('Synchronisation réussie', { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de la synchronisation");
      } else {
        toast.error("Une erreur s'est produite lors de la synchronisation");
      }
    },
  });

  const handleBonusClick = (extension: ExtensionAPI) => {
    setSelectedExtension(extension);
    setBonusModalOpen(true);
  };

  const handleBudgetClick = (extension: ExtensionAPI) => {
    setSelectedExtension(extension);
    setBudgetModalOpen(true);
  };

  const handleServiceClick = (extension: ExtensionAPI) => {
    setSelectedExtension(extension);
    setServiceModalOpen(true);
  };

  const handleBonusSubmit = (data: { amount: string }) => {
    if (selectedExtension?.id) {
      addBonusMutation.mutate({
        id: selectedExtension.id,
        amount: Number(data.amount),
      });
    }
  };

  const handleSyncClick = () => {
    setConfirmSyncOpen(true);
  };

  const handleConfirmSync = () => {
    syncExtensionsMutation.mutate();
  };

  return (
    <div className="p-4">
      <h3 className='text-xl font-bold mb-3'>Gestion des extensions</h3>
      
      <ExtensionTable
        onBonusClick={handleBonusClick}
        onBudgetClick={handleBudgetClick}
        onServiceClick={handleServiceClick}
        buttonComponent={
          <Button 
            className="mx-2" 
            variant="outline"
            onClick={handleSyncClick}
            disabled={syncExtensionsMutation.isPending}
          >
            {syncExtensionsMutation.isPending ? "Synchronisation..." : "Synchronisation"}
          </Button>
        }
      />

      <BonusModal
        open={bonusModalOpen}
        setOpen={setBonusModalOpen}
        onSubmit={handleBonusSubmit}
        isLoading={addBonusMutation.isPending}
        extensionName={selectedExtension?.callerIdName || ""}
      />

      <BudgetLinkModal
        isOpen={budgetModalOpen}
        onClose={() => {
          setBudgetModalOpen(false);
          setSelectedExtension(null);
        }}
        extensionId={selectedExtension?.id || ""}
        extensionName={selectedExtension?.callerIdName || ""}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['extensions'] });
        }}
      />

      <ServiceLinkModal
        isOpen={serviceModalOpen}
        onClose={() => {
          setServiceModalOpen(false);
          setSelectedExtension(null);
        }}
        extensionId={selectedExtension?.id || ""}
        extensionName={selectedExtension?.callerIdName || ""}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['extensions'] });
        }}
      />

      <ConfirmModal
        open={confirmSyncOpen}
        setOpen={setConfirmSyncOpen}
        onConfirm={handleConfirmSync}
        description="Cette action va synchroniser les extensions avec le système Yeastar. Voulez-vous continuer ?"
        cancelText="Annuler"
        confirmText="Synchroniser"
        isLoading={syncExtensionsMutation.isPending}
      />
    </div>
  )
}