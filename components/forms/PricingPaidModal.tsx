'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react"
import { pricingPaidEditFormData, pricingPaidEditFormSchema, pricingPaidFormData, pricingPaidFormSchema } from "@/lib/validation"
import { EditPricingPaidData } from "@/types/pricingPaid"
import { Label } from "@/components/ui/label"

type PricingPaidFormProps = {
    onSubmit: (data: pricingPaidFormData | pricingPaidEditFormData) => void;
    isLoading?: boolean;
    initialData?: EditPricingPaidData;
    isEditing?: boolean;
    open?: boolean;
    setOpen?: (value: boolean) => void;
    onSetEditPricingPaidData: (data: EditPricingPaidData | null) => void;
    onIsEditing: (data: boolean) => void;
};

const PricingPaidModal: React.FC<PricingPaidFormProps> = ({
    onSubmit,
    isLoading = false,
    initialData,
    isEditing,
    open,
    setOpen,
    onSetEditPricingPaidData,
    onIsEditing
}) => {

    // Schéma et type conditionnels
    const schema = isEditing ? pricingPaidEditFormSchema : pricingPaidFormSchema;
    const defaultValues = isEditing
        ? {
            ordernumber: "",
            prefix: "",
            amount: "",
            description: "",
        }
        : {
            ordernumber: "",
            prefix: "",
            amount: "",
            description: "",
        };


    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<pricingPaidFormData | pricingPaidEditFormData>({
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

        const fieldsToCompare = ["ordernumber", "prefix", "amount", "description"] as const;

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
                ordernumber: "",
                prefix: "",
                amount: "",
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
                onSetEditPricingPaidData(null);
                // Réinitialiser le formulaire
                reset({
                    ordernumber: "",
                    prefix: "",
                    amount: "",
                    description: "",
                });
            }
        }}>
            <DialogTrigger asChild>
                <Button>Ajouter un numéro</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier" : "Ajouter"} un numéro</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="label" className="text-right">
                            Numéro
                        </Label>
                        <Input
                            id="label"
                            className="col-span-3"
                            {...register("ordernumber")}
                        />
                    </div>

                    {errors.ordernumber && (
                        <p
                            className="my-1 text-sm text-red-600"
                        >
                            {errors.ordernumber.message as string}
                        </p>)}

                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="label" className="text-right">
                            Préfix
                        </Label>
                        <Input
                            id="label"
                            className="col-span-3"
                            {...register("prefix")}
                        />
                    </div>

                    {errors.prefix && (
                        <p
                            className="my-1 text-sm text-red-600"
                        >
                            {errors.prefix.message as string}
                        </p>)}

                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="label" className="text-right">
                            Montant
                        </Label>
                        <Input
                            id="label"
                            className="col-span-3"
                            {...register("amount")}
                        />
                    </div>

                    {errors.amount && (
                        <p
                            className="my-1 text-sm text-red-600"
                        >
                            {errors.amount.message as string}
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

export default PricingPaidModal