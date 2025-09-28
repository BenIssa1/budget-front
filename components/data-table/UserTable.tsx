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
import { User, UserEditData } from "@/types/auth";
import { getAllUsers } from "@/services/auth";

interface Props {
    buttonComponent?: React.ReactNode;
    onEditUserData: (data: UserEditData) => void;
    onIsEditing: (data: boolean) => void;
    onOpen: (value: boolean) => void;
    onSetConfirmDeleteuserOpen: (value: boolean) => void;
    onSetSelecteduserId: (value: string) => void;
}

export default function UserTable({
    buttonComponent,
    onEditUserData,
    onIsEditing,
    onOpen,
    onSetConfirmDeleteuserOpen,
    onSetSelecteduserId
}: Props) {
    const {
        data: usersData = { users: [] },
        isFetching: usersLoading,
        isError: usersError,
        refetch: refetchusers,
    } = useQuery<{ users: User[] }>({
        queryKey: ["users"],
        queryFn: () => {
            return getAllUsers();
        },
        placeholderData: keepPreviousData,
    });

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "email",
            header: "Email"
        },
        {
            accessorKey: "lastName",
            header: "Nom"
        },
        {
            accessorKey: "firstName",
            header: "Prénoms",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original

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
                                if (user.id) {
                                    onEditUserData({
                                        id: user.id,
                                        email: user.email,
                                        lastName: user.lastName,
                                        firstName: user.firstName,
                                    });
                                    onIsEditing(true);
                                    onOpen(true);
                                }
                            }}>Modifier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                if (user.id) {
                                    onSetSelecteduserId(user.id);
                                    onSetConfirmDeleteuserOpen(true);
                                }
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
                data={usersData.users}
                isLoading={usersLoading}
                toolbarActionComponent={buttonComponent}
                filterColumn="lastName"
                placeholder="Filtrer par libellé..."
            />
        </div>
    )
}