'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react"
import { configEditFormData, configEditFormSchema, configFormData, configFormSchema } from "@/lib/validation"
import { EditConfigData } from "@/types/config"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type ConfigFormProps = {
    onSubmit: (data: configFormData | configEditFormData) => void;
    isLoading?: boolean;
    initialData?: EditConfigData;
    isEditing?: boolean;
    open?: boolean;
    setOpen?: (value: boolean) => void;
};

const ConfigModal: React.FC<ConfigFormProps> = ({
    onSubmit,
    isLoading = false,
    initialData,
    isEditing,
    open,
    setOpen,
}) => {

    // Schéma et type conditionnels
    const schema = isEditing ? configEditFormSchema : configFormSchema;
    const defaultValues = isEditing
        ? {
            ip: "",
            clientId: "",
            secretId: "",
            isActive: false,
        }
        : {
            ip: "",
            clientId: "",
            secretId: "",
            isActive: false,
        };


    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<configFormData | configEditFormData>({
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
            ? (["ip", "clientId", "secretId", "isActive"] as const)
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
                <Button onClick={() => setOpen?.(true)}>Ajouter une configuration</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier" : "Ajouter"} une configuration</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="ip" className="text-right">
                            Adresse IP
                        </Label>
                        <Input
                            id="ip"
                            className="col-span-3"
                            {...register("ip")}
                        />
                    </div>

                    {errors.ip && (
                        <p
                            className="my-1 text-sm text-red-600"
                        >
                            {errors.ip.message as string}
                        </p>)}

                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="clientId" className="text-right">
                            ID Client
                        </Label>
                        <Input
                            id="clientId"
                            className="col-span-3"
                            {...register("clientId")}
                        />
                    </div>

                    {errors.clientId && (
                        <p
                            className="my-1 text-sm text-red-600"
                        >
                            {errors.clientId.message as string}
                        </p>)}

                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="secretId" className="text-right">
                            ID Secret
                        </Label>
                        <Input
                            id="secretId"
                            className="col-span-3"
                            {...register("secretId")}
                        />
                    </div>

                    {errors.secretId && (
                        <p
                            className="my-1 text-sm text-red-600"
                        >
                            {errors.secretId.message as string}
                        </p>)}

                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="isActive" className="text-right">
                            Actif
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={watchedValues.isActive || false}
                                onCheckedChange={(checked) => setValue("isActive", checked as boolean)}
                            />
                            <Label htmlFor="isActive" className="text-sm font-normal">
                                Configuration active
                            </Label>
                        </div>
                    </div>

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

export default ConfigModal
