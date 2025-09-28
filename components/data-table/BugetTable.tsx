'use client'

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BudgetAPI, EditBudgetData } from "@/types/budget";
import { getBudgets } from "@/services/budget";
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

interface Props {
    buttonComponent?: React.ReactNode;
    onEditBudgetData: (data: EditBudgetData) => void;
    onIsEditing: (data: boolean) => void;
    onOpen: (value: boolean) => void;
    onSetConfirmDeleteBudgetOpen: (value: boolean) => void;
    onSetSelectedBudgetId: (value: string) => void;
}

export default function BugetTable({
    buttonComponent,
    onEditBudgetData,
    onIsEditing,
    onOpen,
    onSetConfirmDeleteBudgetOpen,
    onSetSelectedBudgetId
}: Props) {
    const {
        data: budgetsData = { budgets: [] },
        isFetching: budgetsLoading,
        isError: budgetsError,
        refetch: refetchBudgets,
    } = useQuery<{ budgets: BudgetAPI[] }>({
        queryKey: ["budgets"],
        queryFn: () => {
            return getBudgets();
        },
        placeholderData: keepPreviousData,
    });

    const columns: ColumnDef<BudgetAPI>[] = [
        {
            accessorKey: "label",
            header: "Libellé"
        },
        {
            accessorKey: "amount",
            header: "Montant",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const budget = row.original

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
                                onEditBudgetData({
                                    id: budget.id,
                                    label: budget.label,
                                    amount: budget.amount,
                                    description: budget.description,
                                })
                                onIsEditing(true);
                                onOpen(true);
                            }}>Modfier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                onSetConfirmDeleteBudgetOpen(true);
                                onSetSelectedBudgetId(row.original.id);
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
                data={budgetsData.budgets}
                isLoading={budgetsLoading}
                toolbarActionComponent={buttonComponent}
                filterColumn="label"
                placeholder="Filtrer par libellé..."
            />
        </div>
    )
}