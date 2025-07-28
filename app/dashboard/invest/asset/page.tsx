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
import { MoreHorizontal, Eye, Trash2, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import getUserInvestmentData from "./data";
import { sql } from "@/lib/sql";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserInvestmentType {
  id: string;
  property_name: string;
  property_type: string;
  investment_amount: number;
  current_value: number;
  image_urls: string[];
  document_urls: string[];
  created_at: string;
  status: boolean;
}

interface CalculatedInvestmentType extends UserInvestmentType {
  monthly_return: number;
  overall_roi: number;
  months_invested: number;
}

// Utility functions for calculations
const calculateMonthsInvested = (createdAt: string): number => {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
  return Math.max(diffMonths, 1); // Minimum 1 month to avoid division by zero
};

const calculateMonthlyReturn = (
  currentValue: number,
  investmentAmount: number,
  monthsInvested: number,
): number => {
  const totalReturn = currentValue - investmentAmount;
  return totalReturn / monthsInvested;
};

const calculateOverallROI = (
  currentValue: number,
  investmentAmount: number,
): number => {
  if (investmentAmount === 0) return 0;
  return ((currentValue - investmentAmount) / investmentAmount) * 100;
};

// Fetch and process user investment data
const userData = (await getUserInvestmentData()) as UserInvestmentType[];

// Add calculated fields to each investment
const userInvestments: CalculatedInvestmentType[] = userData.map(
  (investment) => {
    const monthsInvested = calculateMonthsInvested(investment.created_at);
    const monthlyReturn = calculateMonthlyReturn(
      investment.current_value,
      investment.investment_amount,
      monthsInvested,
    );
    const overallROI = calculateOverallROI(
      investment.current_value,
      investment.investment_amount,
    );

    return {
      ...investment,
      monthly_return: monthlyReturn,
      overall_roi: overallROI,
      months_invested: monthsInvested,
    };
  },
);

// Calculate dashboard stats
const totalInvested = userInvestments.reduce(
  (sum, item) => sum + item.investment_amount,
  0,
);
const totalCurrentValue = userInvestments.reduce(
  (sum, item) => sum + item.current_value,
  0,
);
const totalMonthlyReturn = userInvestments.reduce(
  (sum, item) => sum + item.monthly_return,
  0,
);
const overallROI =
  totalInvested > 0
    ? ((totalCurrentValue - totalInvested) / totalInvested) * 100
    : 0;

const columns: ColumnDef<CalculatedInvestmentType>[] = [
  {
    accessorKey: "property_name",
    header: "Property Name",
  },
  {
    accessorKey: "property_type",
    header: "Property Type",
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.getValue("property_type")}
      </Badge>
    ),
  },
  {
    accessorKey: "investment_amount",
    header: "Invested Amount",
    cell: ({ row }) =>
      Number(row.getValue("investment_amount")).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
  },
  {
    accessorKey: "current_value",
    header: "Current Value",
    cell: ({ row }) =>
      Number(row.getValue("current_value")).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
  },
  {
    accessorKey: "monthly_return",
    header: "Monthly Return",
    cell: ({ row }) => {
      const monthlyReturn = Number(row.getValue("monthly_return"));
      const isPositive = monthlyReturn >= 0;
      return (
        <span
          className={
            isPositive
              ? "text-green-500 dark:text-green-300"
              : "text-red-400 dark:text-red-300"
          }
        >
          {monthlyReturn.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "overall_roi",
    header: "Overall ROI",
    cell: ({ row }) => {
      const roi = Number(row.getValue("overall_roi"));
      const isPositive = roi >= 0;
      return (
        <span
          className={
            isPositive
              ? "text-green-500 dark:text-green-300"
              : "text-red-400 dark:text-red-300"
          }
        >
          {roi.toFixed(2)}%
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
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
    id: "actions",
    cell: ({ row }) => {
      const investment = row.original;
      return <ActionsCell investment={investment} />;
    },
  },
];

const ActionsCell = ({
  investment,
}: {
  investment: CalculatedInvestmentType;
}) => {
  const [viewingInvestment, setViewingInvestment] =
    useState<CalculatedInvestmentType | null>(null);
  const [deletingInvestment, setDeletingInvestment] =
    useState<CalculatedInvestmentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!deletingInvestment) return;

    setIsLoading(true);
    try {
      await sql`DELETE FROM asset_request WHERE id = ${deletingInvestment.id}`;
      setDeletingInvestment(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete investment:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <DropdownMenuItem onClick={() => setViewingInvestment(investment)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeletingInvestment(investment)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Asset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Dialog */}
      <Dialog
        open={!!viewingInvestment}
        onOpenChange={() => setViewingInvestment(null)}
      >
        <DialogContent className="h-[32rem] max-w-2xl overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>{viewingInvestment?.property_name}</DialogTitle>
            <DialogDescription>
              Investment details for {viewingInvestment?.property_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="mb-2 text-lg font-semibold">Investment Details</h3>
              <p className="capitalize">
                <strong>Type:</strong> {viewingInvestment?.property_type}
              </p>
              <p className="font-mono">
                <strong>Invested Amount:</strong>{" "}
                {Number(viewingInvestment?.investment_amount).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  },
                )}
              </p>
              <p className="font-mono">
                <strong>Current Value:</strong>{" "}
                {Number(viewingInvestment?.current_value).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  },
                )}
              </p>
              <p className="font-mono">
                <strong>Monthly Return:</strong>{" "}
                <span
                  className={
                    Number(viewingInvestment?.monthly_return) >= 0
                      ? "text-green-500 dark:text-green-300"
                      : "text-red-400 dark:text-red-300"
                  }
                >
                  {Number(viewingInvestment?.monthly_return).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                    },
                  )}
                </span>
              </p>
              <p className="font-mono">
                <strong>Overall ROI:</strong>{" "}
                <span
                  className={
                    Number(viewingInvestment?.overall_roi) >= 0
                      ? "text-green-500 dark:text-green-300"
                      : "text-red-400 dark:text-red-300"
                  }
                >
                  {Number(viewingInvestment?.overall_roi).toFixed(2)}%
                </span>
              </p>
              <p className="text-sm text-gray-600">
                <strong>Months Invested:</strong>{" "}
                {viewingInvestment?.months_invested}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge
                  variant={viewingInvestment?.status ? "default" : "secondary"}
                >
                  {viewingInvestment?.status ? "Active" : "Pending"}
                </Badge>
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(
                  viewingInvestment?.created_at || "",
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="mt-4 mb-2 text-lg font-semibold">Images</h3>
              <div className="flex flex-wrap gap-2 space-x-2">
                {viewingInvestment?.image_urls.map(
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
                {viewingInvestment?.document_urls.map(
                  (url: string, index: number) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingInvestment}
        onOpenChange={() => setDeletingInvestment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              investment in <strong>{deletingInvestment?.property_name}</strong>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredInvestments = userInvestments.filter(
    (investment) =>
      investment.property_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      investment.property_type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const table = useReactTable({
    data: filteredInvestments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assets</h1>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center justify-between gap-x-3">
        <Input
          placeholder="Search properties or types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Button size={"sm"} asChild>
          <Link href={"/dashboard/invest/asset/new-asset"}>
            <Plus />
            New
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Total Invested</h2>
          <div className="font-mono text-2xl font-bold">
            {totalInvested.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Current Value</h2>
          <div className="font-mono text-2xl font-bold">
            {totalCurrentValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Monthly Return</h2>
          <div className="font-mono text-2xl font-bold">
            <span
              className={
                totalMonthlyReturn <= 0
                  ? "text-red-400 dark:text-red-300"
                  : "text-green-500 dark:text-green-300"
              }
            >
              {totalMonthlyReturn.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Overall ROI</h2>
          <div className="font-mono text-2xl font-bold">
            <span
              className={
                totalMonthlyReturn <= 0
                  ? "text-red-400 dark:text-red-300"
                  : "text-green-500 dark:text-green-300"
              }
            >
              {overallROI.toFixed(2)}%
            </span>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  No investments found.
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

export default UserDashboard;
