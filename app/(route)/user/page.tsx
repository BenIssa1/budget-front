'use client'

import ConfirmModal from "@/components/ConfirmModal";
import { userEditFormData, userFormData } from "@/lib/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import UserTable from "@/components/data-table/UserTable";
import UserModal from "@/components/forms/UserModal";
import { deleteUser, editUser, signupUser } from "@/services/auth";
import { CreateUserData, SignupFormValues, UserEditData } from "@/types/auth";

export default function UserPage() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editUserData, setEditUserData] = useState<UserEditData | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [confirmDeleteUserOpen, setConfirmDeleteUserOpen] = useState(false);

  const queryClient = useQueryClient();


  const createUserMutation = useMutation({
    mutationFn: async ({ email, lastName, firstName, password }: SignupFormValues) =>
      await signupUser(email, lastName, firstName, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
      toast.success('user créé avec succès', { duration: 1000 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message || 'Échec de création');
      } else {
        toast.error('Erreur lors de la création');
      }
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...rest }: UserEditData) => editUser(id, rest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
      toast.success('user modifié avec succès', { duration: 1000 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error?.response?.data?.message || 'Échec de modification');
      } else {
        toast.error('Erreur lors de la modification');
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) =>
      await deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setConfirmDeleteUserOpen(false);
      setSelectedUserId(null);
      toast.success("L'utilisateur supprimé avec succès", { duration: 1500 });
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message || "Échec de l'opération");
      } else {
        toast.error("Une erreur s'est produite");
      }
    },
  });


  const handleAgentSubmit = (data: userFormData | userEditFormData) => {
    if (editUserData) {
      // Mode édition - ne pas inclure le mot de passe s'il est vide
      const editData: UserEditData = {
        id: editUserData.id,
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName,
        ...(data.password && data.password.trim() !== "" && { password: data.password }),
      };

      updateUserMutation.mutate(editData);
    } else {
      // Mode création - mot de passe obligatoire
      const createData: CreateUserData = {
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName,
        password: data.password || "",
      };

      createUserMutation.mutate(createData);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUserId) {
      deleteUserMutation.mutate(selectedUserId);
    }
  };

  return (
    <div className="p-4">
      <h3 className='text-xl font-bold mb-3'>Gestion des users</h3>

      <UserTable
        onEditUserData={setEditUserData}
        onIsEditing={setIsEditing}
        onOpen={setOpen}
        onSetConfirmDeleteuserOpen={setConfirmDeleteUserOpen}
        onSetSelecteduserId={setSelectedUserId}
        buttonComponent={
          <UserModal
            initialData={editUserData ?? undefined}
            isEditing={isEditing}
            onSubmit={handleAgentSubmit}
            isLoading={createUserMutation.isPending || updateUserMutation.isPending}
            open={open}
            setOpen={setOpen}
            onSetEditUserData={setEditUserData}
            onIsEditing={setIsEditing}
          />
        }
      />

      <ConfirmModal
        open={confirmDeleteUserOpen}
        setOpen={setConfirmDeleteUserOpen}
        onConfirm={handleDeleteUser}
        description="Cette action est irréversible."
        cancelText="Annuler"
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  )
}