'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { z } from "zod";

const bonusSchema = z.object({
    amount: z.string().min(1, { message: "Le montant est requis" }).refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        { message: "Le montant doit être un nombre positif" }
    ),
});

type BonusFormData = z.infer<typeof bonusSchema>;

type BonusModalProps = {
    onSubmit: (data: BonusFormData) => void;
    isLoading?: boolean;
    open?: boolean;
    setOpen?: (value: boolean) => void;
    extensionName?: string;
};

const BonusModal: React.FC<BonusModalProps> = ({
    onSubmit,
    isLoading = false,
    open,
    setOpen,
    extensionName = "",
}) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BonusFormData>({
        resolver: zodResolver(bonusSchema),
        defaultValues: {
            amount: "",
        },
    });

    // Réinitialiser le formulaire quand le modal s'ouvre
    useEffect(() => {
        if (open) {
            reset({
                amount: "",
            });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Donner un bonus à {extensionName}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 items-center gap-4 mb-3">
                        <Label htmlFor="amount" className="text-right">
                            Montant du bonus
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="col-span-3"
                            {...register("amount")}
                        />
                    </div>

                    {errors.amount && (
                        <p className="my-1 text-sm text-red-600">
                            {errors.amount.message as string}
                        </p>
                    )}

                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen?.(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "En cours..." : "Donner le bonus"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default BonusModal
