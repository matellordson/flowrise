"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  user_id: string;
  username: string;
  password: string;
  bank_name: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "user_id",
    header: "User",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "bank_name",
    header: "Bank Name",
  },
  {
    accessorKey: "password",
    header: "Password",
  },
];
