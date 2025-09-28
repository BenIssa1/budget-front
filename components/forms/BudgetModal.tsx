'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react"
import { BudgetEditFormData, budgetEditFormSchema, BudgetFormData, budgetFormSchema } from "@/lib/validation"
import { EditBudgetData } from "@/types/budget"
import { Label } from "@/components/ui/label"

type ServiceFormProps = {
    onSubmit: (data: BudgetFormData | BudgetEditFormData) => void;
    isLoading?: boolean;
    initialData?: EditBudgetData;
    isEditing?: boolean;
    open?: boolean;
    setOpen?: (value: boolean) => void;
};

const BudgetModal: React.FC<ServiceFormProps> = ({
    onSubmit,
    isLoading = false,
    initialData,
    isEditing,
    open,
    setOpen,
}) => {

    // Schéma et type conditionnels
    const schema = isEditing ? budgetEditFormSchema : budgetFormSchema;
    const defaultValues = isEditing
        ? {
            label: "",
            amount: "",
            description: "",
        }
        : {
            label: "",
            amount: "",
            description: "",
        };


    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<BudgetFormData | BudgetEditFormData>({
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

        const fieldsToCompare = isEditing
            ? (["label", "amount", "description"] as const)
            : (Object.keys(watchedValues) as (keyof typeof watchedValues)[]);

        return fieldsToCompare.some((key) => {
            const currentValue = watchedValues[key as keyof typeof watchedValues];
            const initialValue = initialData[key as keyof typeof initialData];
            return currentValue !== initialValue;
        });
    }, [watchedValues, initialData, isEditing]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen?.(true)}>Créer un budget</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier" : "Ajouter"} un budget</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="label" className="text-right">
                            Libelle
                        </Label>
                        <Input
                            id="label"
                            className="col-span-3"
                            {...register("label")}
                        />
                    </div>

                    {errors.label && (
                        <p
                            className="my-1 text-sm text-red-600"
                        >
                            {errors.label.message as string}
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

export default BudgetModal