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
import { getPricingFrees } from "@/services/pricingFree";
import { EditPricingFreeData, PricingFreeAPI } from "@/types/pricingFree";

interface Props {
    buttonComponent?: React.ReactNode;
    onEditpricingFreeData: (data: EditPricingFreeData) => void;
    onIsEditing: (data: boolean) => void;
    onOpen: (value: boolean) => void;
    onSetConfirmDeletepricingFreeOpen: (value: boolean) => void;
    onSetSelectedpricingFreeId: (value: string) => void;
}

export default function PricingFreeTable({
    buttonComponent,
    onEditpricingFreeData,
    onIsEditing,
    onOpen,
    onSetConfirmDeletepricingFreeOpen,
    onSetSelectedpricingFreeId
}: Props) {
    const {
        data: pricingFreesData = { pricingFrees: [] },
        isFetching: pricingFreesLoading,
        isError: pricingFreesError,
        refetch: refetchFricingfrees,
    } = useQuery<{ pricingFrees: PricingFreeAPI[] }>({
        queryKey: ["pricingFrees"],
        queryFn: () => {
            return getPricingFrees();
        },
        placeholderData: keepPreviousData,
    });

    const columns: ColumnDef<PricingFreeAPI>[] = [
        {
            accessorKey: "contact",
            header: "Numéro"
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const pricingFree = row.original

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
                                onEditpricingFreeData({
                                    id: pricingFree.id,
                                    contact: pricingFree.contact,
                                    description: pricingFree.description,
                                })
                                onIsEditing(true);
                                onOpen(true);
                            }}>Modfier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                onSetConfirmDeletepricingFreeOpen(true);
                                onSetSelectedpricingFreeId(row.original.id);
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
                data={pricingFreesData.pricingFrees}
                isLoading={pricingFreesLoading}
                toolbarActionComponent={buttonComponent}
                filterColumn="contact"
                placeholder="Filtrer par libellé..."
            />
        </div>
    )
}