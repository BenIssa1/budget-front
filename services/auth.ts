import axiosAuth from "@/lib/axios";
import { userEditFormData } from "@/lib/validation";
import { User, UserListResponse } from "@/types/auth";

// Login function
export const loginUser = async (email: string, password: string) => {
  const response = await axiosAuth.post("/auth/signin", {
    email,
    password,
  });
  return response.data;
};

// Signup function
export const signupUser = async (email: string, lastName: string, firstName: string, password: string) => {
  const response = await axiosAuth.post("/auth/signup", {
    email,
    lastName,
    firstName,
    password
  });
  return response.data;
};

// Send reset password email
export const sendResetPasswordEmail = async (email: string) => {
  const response = await axiosAuth.post(
    "/auth/reset-password",
    {
      email,
    }
  );
  return response.data;
};

// Verify OTP code
export const verifyResetCode = async (email: string | null, code: number) => {
  const response = await axiosAuth.post(
    "/auth/check-otp",
    {
      email,
      otp: code,
    }
  );
  return response.data;
};

// Reset password
export const resetPassword = async (
  otp: number | undefined,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const response = await axiosAuth.post("/auth/change-password", {
    otp,
    email,
    password,
    confirmPassword
  });
  return response.data;
};

export const getAllUsers = async (
): Promise<{
    users: User[];
}> => {
    const response = await axiosAuth.get(`/auth/users`);
    const data: UserListResponse = response;

    return {
        users: data.data.users,
    };
};

export const editUser = async (id: string, data: Omit<userEditFormData, "id">): Promise<User> => {
    const response = await axiosAuth.put(`/auth/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await axiosAuth.delete(`/auth/users/${id}`);
};