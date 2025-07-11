"use client";

import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Eye,
  Router,
  CheckCircle2Icon,
  Loader2, // Import Loader2 icon for loading spinner
} from "lucide-react"; // Make sure to import Loader2
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import getInvestmentData from "./data";
import { sql } from "@/lib/sql";
import { redirect, useRouter } from "next/navigation";

interface dataType {
  id: string;
  property_name: string;
  property_type: string;
  investment_amount: number;
  image_urls: string[];
  document_urls: string[];
  created_at?: string;
  updated_at?: string;
  user: string;
  status: boolean;
}

// Mock data for demonstration
const mockData = (await getInvestmentData()) as dataType[];

const data = mockData;
const assetRequests = data;

// Fixed calculations
const totalInvestment = data.reduce(
  (sum, item) => sum + item.investment_amount,
  0,
);
const averageInvestment = data.length > 0 ? totalInvestment / data.length : 0;

const columns: ColumnDef<dataType>[] = [
  {
    accessorKey: "property_name",
    header: "Property Name",
  },
  {
    accessorKey: "property_type",
    header: "Property Type",
  },
  {
    accessorKey: "investment_amount",
    header: "Investment Amount",
    cell: ({ row }) =>
      Number(row.getValue("investment_amount")).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "status",
    header: "Status",
    // Custom cell rendering for the status column
    cell: ({ row }) => {
      const status = row.getValue("status");
      // Determine the variant based on the status value
      // Assuming 'true' means active/approved and 'false' means pending
      const variant = status ? "default" : "secondary";
      const statusText = status ? "Active" : "Pending";

      return (
        <Badge variant={variant} className="capitalize">
          {statusText}
        </Badge>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) =>
      new Date(row.getValue("updated_at")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original;

      return <ActionsCell request={request} />;
    },
  },
];

const ActionsCell = ({ request }: { request: dataType }) => {
  const [viewingRequest, setViewingRequest] = useState<dataType | null>(null);
  const [editingRequest, setEditingRequest] = useState<dataType | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setViewingRequest(request)}>
            <Eye className="mr-2 h-4 w-4" />
            View Request
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setEditingRequest(request);
              setInvestmentAmount(request.investment_amount.toString());
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Request
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await sql`UPDATE asset_request SET status = true WHERE id = ${request?.id}`;
              redirect("/admin/invest");
            }}
          >
            <CheckCircle2Icon className="mr-2 h-4 w-4" />
            Activate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Dialog */}
      <Dialog
        open={!!viewingRequest}
        onOpenChange={() => setViewingRequest(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingRequest?.property_name}</DialogTitle>
            <DialogDescription>
              Details for {viewingRequest?.property_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="mb-2 text-lg font-semibold">Property Details</h3>
              <p className="capitalize">
                <strong>Type:</strong> {viewingRequest?.property_type}
              </p>
              <p className="font-mono">
                <strong>Investment:</strong>{" "}
                {Number(viewingRequest?.investment_amount).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  },
                )}
              </p>
              <p>
                <strong>User:</strong> {viewingRequest?.user}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(
                  viewingRequest?.created_at || "",
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated:</strong>{" "}
                {new Date(
                  viewingRequest?.updated_at || "",
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="mt-4 mb-2 text-lg font-semibold">Images</h3>
              <div className="flex space-x-2">
                {viewingRequest?.image_urls.map(
                  (url: string, index: number) => (
                    <img
                      key={index}
                      src={url || "/placeholder.svg"}
                      alt={`Property ${index + 1}`}
                      className="h-24 w-24 rounded object-cover"
                    />
                  ),
                )}
              </div>
              <h3 className="mt-4 mb-2 text-lg font-semibold">Documents</h3>
              <ul className="list-disc pl-5">
                {viewingRequest?.document_urls.map(
                  (url: string, index: number) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Document {index + 1}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingRequest}
        onOpenChange={() => setEditingRequest(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Investment Amount</DialogTitle>
            <DialogDescription>
              Update the investment amount for {editingRequest?.property_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="investment" className="text-sm font-medium">
                Investment Amount ($)
              </label>
              <Input
                id="investment"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="Enter investment amount"
                className="mt-1"
                disabled={isLoading} // Disable input when loading
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingRequest(null)}
                disabled={isLoading} // Disable cancel button when loading
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  setIsLoading(true); // Set loading to true when starting update
                  try {
                    await sql`UPDATE asset_request SET investment_amount = ${investmentAmount} WHERE id = ${editingRequest?.id}`;
                    // Assuming you also want to set status to true on update amount
                    await sql`UPDATE asset_request SET status = true WHERE id = ${editingRequest?.id}`;
                    console.log("Investment amount and status updated!");
                    console.log("Request ID:", editingRequest?.id);
                    setEditingRequest(null); // Close the dialog on success
                    router.refresh(); // Refresh the page to show updated data
                  } catch (error) {
                    console.error("Failed to update investment:", error);
                    // Optionally, show an error message to the user
                  } finally {
                    setIsLoading(false); // Set loading back to false
                  }
                }}
                disabled={isLoading} // Disable the button when loading
              >
                {isLoading ? "Updating..." : "Update Amount"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = assetRequests.filter(
    (request) =>
      request.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.property_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const table = useReactTable({
    data: filteredRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Investment Dashboard</h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search properties, types, or users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Total Requests</h2>
          <div className="font-mono text-2xl font-bold">
            {assetRequests.length}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Total Investment</h2>
          <div className="font-mono text-2xl font-bold">
            {totalInvestment.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Average Investment</h2>
          <div className="font-mono text-2xl font-bold">
            {averageInvestment.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Property Types</h2>
          <div className="text-2xl font-bold">
            {assetRequests.length > 0
              ? new Set(assetRequests.map((req) => req.property_type)).size
              : 0}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "property_type" ? (
                        <Badge variant={"secondary"} className="capitalize">
                          {row.original.property_type}
                        </Badge>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No asset requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
