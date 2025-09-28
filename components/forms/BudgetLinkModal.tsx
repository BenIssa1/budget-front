'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getBudgets } from "@/services/budget";
import { linkBudgetToExtension } from "@/services/extension";
import { BudgetAPI } from "@/types/budget";
import { toast } from "sonner";

interface BudgetLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    extensionId: string;
    extensionName: string;
    onSuccess?: () => void;
}

export default function BudgetLinkModal({
    isOpen,
    onClose,
    extensionId,
    extensionName,
    onSuccess,
}: BudgetLinkModalProps) {
    const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        data: budgetsData = { budgets: [] },
        isFetching: budgetsLoading,
        isError: budgetsError,
    } = useQuery<{ budgets: BudgetAPI[] }>({
        queryKey: ["budgets"],
        queryFn: () => getBudgets(),
        enabled: isOpen,
    });

    const handleSubmit = async () => {
        if (!selectedBudgetId) {
            toast.error("Veuillez sélectionner un budget");
            return;
        }

        setIsLoading(true);
        try {
            await linkBudgetToExtension(extensionId, parseInt(selectedBudgetId));
            toast.success("Budget lié avec succès");
            onSuccess?.();
            onClose();
            setSelectedBudgetId("");
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur lors de la liaison du budget");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedBudgetId("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un budget</DialogTitle>
                    <DialogDescription>
                        Sélectionnez un budget à lier à l'extension <strong>{extensionName}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="budget" className="text-sm font-medium">
                            Budget
                        </label>
                        <Select
                            value={selectedBudgetId}
                            onValueChange={setSelectedBudgetId}
                            disabled={budgetsLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionnez un budget" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {budgetsData.budgets.map((budget) => (
                                    <SelectItem key={budget.id} value={budget.id}>
                                        {budget.label} - {budget.amount} FCFA
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {budgetsError && (
                            <p className="text-sm text-red-500">
                                Erreur lors du chargement des budgets
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedBudgetId || isLoading || budgetsLoading}
                    >
                        {isLoading ? "Liaison..." : "Lier le budget"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
