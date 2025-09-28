'use client'

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ServiceAPI, EditServiceData } from "@/types/service";
import { getServices } from "@/services/service";
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
    onEditServiceData: (data: EditServiceData) => void;
    onIsEditing: (data: boolean) => void;
    onOpen: (value: boolean) => void;
    onSetConfirmDeleteServiceOpen: (value: boolean) => void;
    onSetSelectedServiceId: (value: string) => void;
}

export default function ServiceTable({
    buttonComponent,
    onEditServiceData,
    onIsEditing,
    onOpen,
    onSetConfirmDeleteServiceOpen,
    onSetSelectedServiceId
}: Props) {
    const {
        data: servicesData = { services: [] },
        isFetching: servicesLoading,
        isError: servicesError,
        refetch: refetchservices,
    } = useQuery<{ services: ServiceAPI[] }>({
        queryKey: ["services"],
        queryFn: () => {
            return getServices();
        },
        placeholderData: keepPreviousData,
    });

    const columns: ColumnDef<ServiceAPI>[] = [
        {
            accessorKey: "label",
            header: "Libellé"
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const service = row.original

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
                                onEditServiceData({
                                    id: service.id,
                                    label: service.label,
                                    description: service.description,
                                })
                                onIsEditing(true);
                                onOpen(true);
                            }}>Modfier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                onSetConfirmDeleteServiceOpen(true);
                                onSetSelectedServiceId(row.original.id);
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
                data={servicesData.services}
                isLoading={servicesLoading}
                toolbarActionComponent={buttonComponent}
                filterColumn="label"
                placeholder="Filtrer par libellé..."
            />
        </div>
    )
}