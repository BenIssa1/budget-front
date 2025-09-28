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
import { getServices } from "@/services/service";
import { linkServiceToExtension } from "@/services/extension";
import { ServiceAPI } from "@/types/service";
import { toast } from "sonner";

interface ServiceLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    extensionId: string;
    extensionName: string;
    onSuccess?: () => void;
}

export default function ServiceLinkModal({
    isOpen,
    onClose,
    extensionId,
    extensionName,
    onSuccess,
}: ServiceLinkModalProps) {
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        data: servicesData = { services: [] },
        isFetching: servicesLoading,
        isError: servicesError,
    } = useQuery<{ services: ServiceAPI[] }>({
        queryKey: ["services"],
        queryFn: () => getServices(),
        enabled: isOpen,
    });

    const handleSubmit = async () => {
        if (!selectedServiceId) {
            toast.error("Veuillez sélectionner un service");
            return;
        }

        setIsLoading(true);
        try {
            await linkServiceToExtension(extensionId, parseInt(selectedServiceId));
            toast.success("Service lié avec succès");
            onSuccess?.();
            onClose();
            setSelectedServiceId("");
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur lors de la liaison du service");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedServiceId("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un service</DialogTitle>
                    <DialogDescription>
                        Sélectionnez un service à lier à l'extension <strong>{extensionName}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="service" className="text-sm font-medium">
                            Service
                        </label>
                        <Select
                            value={selectedServiceId}
                            onValueChange={setSelectedServiceId}
                            disabled={servicesLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionnez un service" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {servicesData.services.map((service) => (
                                    <SelectItem key={service.id} value={service.id}>
                                        {service.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {servicesError && (
                            <p className="text-sm text-red-500">
                                Erreur lors du chargement des services
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
                        disabled={!selectedServiceId || isLoading || servicesLoading}
                    >
                        {isLoading ? "Liaison..." : "Lier le service"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
