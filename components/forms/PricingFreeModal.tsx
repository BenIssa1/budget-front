'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react"
import { pricingFreeEditFormData, pricingFreeEditFormSchema, pricingFreeFormData, pricingFreeFormSchema } from "@/lib/validation"
import { EditPricingFreeData } from "@/types/pricingFree"
import { Label } from "@/components/ui/label"

type PricingFreeFormProps = {
    onSubmit: (data: pricingFreeFormData | pricingFreeEditFormData) => void;
    isLoading?: boolean;
    initialData?: EditPricingFreeData;
    isEditing?: boolean;
    open?: boolean;
    setOpen?: (value: boolean) => void;
    onSetEditPricingFreeData: (data: EditPricingFreeData | null) => void;
    onIsEditing: (data: boolean) => void;
};

const PricingFreeModal: React.FC<PricingFreeFormProps> = ({
    onSubmit,
    isLoading = false,
    initialData,
    isEditing,
    open,
    setOpen,
    onSetEditPricingFreeData,
    onIsEditing,
}) => {

    // Schéma et type conditionnels
    const schema = isEditing ? pricingFreeEditFormSchema : pricingFreeFormSchema;
    const defaultValues = isEditing
        ? {
            contact: "",
            description: "",
        }
        : {
            contact: "",
            description: "",
        };

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<pricingFreeFormData | pricingFreeEditFormData>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    // Surveiller les valeurs du formulaire
    const watchedValues = watch();

    // Réinitialiser le formulaire avec les données initiales quand elles changent
    useEffect(() => {
        if (initialData) {
            if (isEditing) {
                const { ...editData } = initialData;
                reset(editData);
            } else {
                reset(initialData);
            }
        }
    }, [initialData, isEditing, reset]);

    // Vérifier si le formulaire a été modifié
    const isFormModified = useMemo(() => {
        if (!isEditing || !initialData) return true;

        const fieldsToCompare = ["contact", "description"] as const;

        return fieldsToCompare.some((key) => {
            const currentValue = watchedValues[key as keyof typeof watchedValues];
            const initialValue = initialData[key as keyof typeof initialData];
            
            // Normaliser les valeurs vides
            const normalizedCurrent = currentValue === "" || currentValue === undefined ? "" : currentValue;
            const normalizedInitial = initialValue === "" || initialValue === undefined ? "" : initialValue;
            
            return normalizedCurrent !== normalizedInitial;
        });
    }, [watchedValues, initialData, isEditing]);

    

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                contact: "",
                description: "",
            });
        }
    }, [initialData, reset]);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen?.(isOpen);
            if (isOpen) {
                // Réinitialiser les données quand le modal s'ouvre
                onIsEditing(false);
                onSetEditPricingFreeData(null);
                // Réinitialiser le formulaire
                reset({
                    contact: "",
                    description: "",
                });
            }
        }}>
            <DialogTrigger asChild>
                <Button>Ajouter un contact</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier" : "Ajouter"} un contact</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="label" className="text-right">
                            Contact
                        </Label>
                        <Input
                            id="label"
                            className="col-span-3"
                            {...register("contact")}
                        />
                    </div>

                    {errors.contact && (
                        <p
                            className="my-1 text-sm text-red-600"
                        >
                            {errors.contact.message as string}
                        </p>)}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            className="col-span-3"
                            {...register("description")}
                        />
                    </div>

                    {errors.description && (
                        <p
                            className="my-1 text-sm text-red-600"
                        >
                            {errors.description.message as string}
                        </p>)}

                    <div className="mt-6">
                        <Button
                            type="submit"
                            disabled={isLoading || (isEditing && !isFormModified)}
                        >
                            {isLoading ? "En cours..." : isEditing ? "Modifier" : "Ajouter"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default PricingFreeModal