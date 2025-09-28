export interface User {
  id?: string
  lastName: string;
  firstName: string;
  email: string;
  role: Role;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
 lastName: string;
  firstName: string;
  email: string;
  password: string;
}

export interface CreateUserData {
  id?: string;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

export interface UserEditData {
  id: string
  lastName: string;
  firstName: string;
  email: string;
  password?: string;
}

export interface loginResponse {
  token: string;
  dataUser: User;
}

export interface SignupResponse {
  message: string;
}

export interface UserListResponse {
  data: {
    users: User[]
  }
}

export type Role = "User" | "Admin";

export type UserRole = "User" | "Admin";

export enum RoleName {
  USER = "User",
  ADMIN = "Admin"
}