'use client'

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ConfigAPI, EditConfigData } from "@/types/config";
import { getConfigs } from "@/services/config";
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
import { Badge } from "../ui/badge";

interface Props {
    buttonComponent?: React.ReactNode;
    onEditConfigData: (data: EditConfigData) => void;
    onIsEditing: (data: boolean) => void;
    onOpen: (value: boolean) => void;
    onSetConfirmDeleteConfigOpen: (value: boolean) => void;
    onSetSelectedConfigId: (value: string) => void;
}

export default function ConfigTable({
    buttonComponent,
    onEditConfigData,
    onIsEditing,
    onOpen,
    onSetConfirmDeleteConfigOpen,
    onSetSelectedConfigId
}: Props) {
    const {
        data: configsData = { configs: [] },
        isFetching: configsLoading,
        isError: configsError,
        refetch: refetchconfigs,
    } = useQuery<{ configs: ConfigAPI[] }>({
        queryKey: ["configs"],
        queryFn: () => {
            return getConfigs();
        },
        placeholderData: keepPreviousData,
    });

    const columns: ColumnDef<ConfigAPI>[] = [
        {
            accessorKey: "ip",
            header: "Adresse IP"
        },
        {
            accessorKey: "clientId",
            header: "ID Client",
        },
        {
            accessorKey: "secretId",
            header: "ID Secret",
        },
        {
            accessorKey: "isActive",
            header: "Statut",
            cell: ({ row }) => {
                const isActive = row.original.isActive;
                return (
                    <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Actif" : "Inactif"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const config = row.original

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
                                onEditConfigData({
                                    id: config.id,
                                    ip: config.ip,
                                    clientId: config.clientId,
                                    secretId: config.secretId,
                                    isActive: config.isActive,
                                })
                                onIsEditing(true);
                                onOpen(true);
                            }}>Modifier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                onSetConfirmDeleteConfigOpen(true);
                                onSetSelectedConfigId(row.original.id);
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
                data={configsData.configs}
                isLoading={configsLoading}
                toolbarActionComponent={buttonComponent}
                filterColumn="ip"
                placeholder="Filtrer par adresse IP..."
            />
        </div>
    )
}
