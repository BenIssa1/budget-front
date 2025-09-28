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
import { getExtensions } from "@/services/extension";
import { ExtensionAPI } from "@/types/extension";


interface Props {
    buttonComponent?: React.ReactNode;
    onBonusClick?: (extension: ExtensionAPI) => void;
    onBudgetClick?: (extension: ExtensionAPI) => void;
    onServiceClick?: (extension: ExtensionAPI) => void;
}

export default function ExtensionTable({ buttonComponent, onBonusClick, onBudgetClick, onServiceClick } : Props) {
    const {
        data: extensionsData = { extensions: [] },
        isFetching: extensionsLoading,
        isError: extensionsError,
        refetch: refetchextensions,
    } = useQuery<{ extensions: ExtensionAPI[] }>({
        queryKey: ["extensions"],
        queryFn: () => {
            return getExtensions();
        },
        placeholderData: keepPreviousData,
    });

    const columns: ColumnDef<ExtensionAPI>[] = [
        {
            accessorKey: "callerIdName",
            header: "Nom & Prénoms"
        },
        {
            accessorKey: "number",
            header: "Numéro interne",
        },
        {
            accessorKey: "emailAddr",
            header: "Email",
        },
        {
            accessorKey: "mobileNumber",
            header: "Contact",
        },
        {
            accessorKey: "balance",
            header: "Solde",
        },
        {
            accessorKey: "budget",
            header: "Budget",
            cell: ({ row }) => {
                const budget = row.original.budget;
                return budget ? `${budget.label} - ${budget.amount} FCFA` : "Aucun budget";
            },
        },
        {
            accessorKey: "service",
            header: "Service",
            cell: ({ row }) => {
                const service = row.original.service;
                return service ? service.label : "Aucun service";
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const extension = row.original

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
                            <DropdownMenuItem onClick={() => onBonusClick?.(extension)}>
                                Donner un bonus
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onBudgetClick?.(extension)}>
                                Ajouter un budget
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onServiceClick?.(extension)}>
                                Ajouter un service
                            </DropdownMenuItem>
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
                data={extensionsData.extensions}
                isLoading={extensionsLoading}
                toolbarActionComponent={buttonComponent}
                filterColumn="callerIdName"
                placeholder="Filtrer par nom & prénoms..."
            />
        </div>
    )
}