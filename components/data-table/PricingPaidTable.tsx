'use client'

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DataTable } from "../Table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { getPricingPaids } from "@/services/pricingPaid";
import { EditPricingPaidData, PricingPaidAPI } from "@/types/pricingPaid";

interface Props {
    buttonComponent?: React.ReactNode;
    onEditPricingPaidData: (data: EditPricingPaidData) => void;
    onIsEditing: (data: boolean) => void;
    onOpen: (value: boolean) => void;
    onSetConfirmDeletepricingPaidOpen: (value: boolean) => void;
    onSetSelectedPricingPaidId: (value: string) => void;
}

export default function PricingPaidTable({
    buttonComponent,
    onEditPricingPaidData,
    onIsEditing,
    onOpen,
    onSetConfirmDeletepricingPaidOpen,
    onSetSelectedPricingPaidId
}: Props) {
    const {
        data: pricingPaidsData = { pricingPaids: [] },
        isFetching: pricingPaidsLoading,
        isError: pricingPaidsError,
        refetch: refetchFricingPaids,
    } = useQuery<{ pricingPaids: PricingPaidAPI[] }>({
        queryKey: ["pricingPaids"],
        queryFn: () => {
            return getPricingPaids();
        },
        placeholderData: keepPreviousData,
    });

    const columns: ColumnDef<PricingPaidAPI>[] = [
        {
            accessorKey: "ordernumber",
            header: "Numéro"
        },
        {
            accessorKey: "prefix",
            header: "Préfix"
        },
        {
            accessorKey: "amount",
            header: "Montant"
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const pricingPaid = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                onEditPricingPaidData({
                                    id: pricingPaid.id,
                                    ordernumber: pricingPaid.ordernumber,
                                    prefix: pricingPaid.prefix,
                                    amount: pricingPaid.amount,
                                    description: pricingPaid.description,
                                })
                                onIsEditing(true);
                                onOpen(true);
                            }}>Modfier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                onSetConfirmDeletepricingPaidOpen(true);
                                onSetSelectedPricingPaidId(row.original.id);
                            }}>Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <div>
            <DataTable
                length={3}
                columns={columns}
                data={pricingPaidsData.pricingPaids}
                isLoading={pricingPaidsLoading}
                toolbarActionComponent={buttonComponent}
                filterColumn="ordernumber"
                placeholder="Filtrer par libellé..."
            />
        </div>
    )
}