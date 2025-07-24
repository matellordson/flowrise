// src/components/InvestmentForm.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react"; // Import useEffect
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import { redirect } from "next/navigation";

// --- Constants ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_DOCUMENT_TYPES = [
  "image/jpeg", // Allow images as documents too
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf", // PDF documents
  // Add more document types here if needed, e.g.:
  // "application/msword", // .doc
  // "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  // "application/vnd.ms-excel", // .xls
  // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  // "text/plain", // .txt
];

// --- Zod Schema ---
const formSchema = z.object({
  property: z
    .string()
    .min(2, {
      message: "Property name must be at least 2 characters.",
    })
    .max(100, {
      message: "Property name must not exceed 100 characters.",
    }),
  type: z
    .string({
      error: "Please select a property type.",
    })
    .min(1, "Please select a property type."),
  investmentAmount: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val.replace(/,/g, ""));
      return !isNaN(num) && num > 0;
    },
    {
      message: "Investment amount must be a valid positive number.",
    },
  ),
  images: z
    .array(z.instanceof(File))
    .min(1, {
      message: "Please upload at least one image.",
    })
    .max(10, {
      message: "You can upload a maximum of 10 images.",
    })
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
      message: "Each image must be less than 5MB.",
    })
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      {
        message: "Only JPEG, PNG, and WebP images are allowed for images.",
      },
    ),
  documents: z
    .array(z.instanceof(File))
    .min(1, {
      message: "Please upload at least one document.",
    })
    .max(10, {
      message: "You can upload a maximum of 10 documents.",
    })
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
      message: "Each document must be less than 5MB.",
    })
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type)),
      {
        message: `Only ${ACCEPTED_DOCUMENT_TYPES.map(
          (t) => t.split("/")[1] || t.split("/")[0].toUpperCase(),
        )
          .join(", ")
          .replace(/, ([^,]*)$/, " or $1")} types are allowed for documents.`,
      },
    ),
});

export default function InvestmentForm() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      property: "",
      type: "",
      investmentAmount: "",
      images: [],
      documents: [],
    },
  });

  // Effect to update image previews whenever selectedImages changes
  useEffect(() => {
    const newImagePreviews: string[] = [];
    selectedImages.forEach((file) => {
      newImagePreviews.push(URL.createObjectURL(file));
    });
    setImagePreviews(newImagePreviews);

    // Clean up URLs when component unmounts or images change
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  // Effect to update document previews whenever selectedDocuments changes
  useEffect(() => {
    const newDocumentPreviews: string[] = [];
    selectedDocuments.forEach((file) => {
      // For documents, show actual image preview if it's an image type, otherwise a generic file icon
      if (file.type.startsWith("image/")) {
        newDocumentPreviews.push(URL.createObjectURL(file));
      } else {
        newDocumentPreviews.push("/file-icon.svg"); // You should create this generic file icon in public/
      }
    });
    setDocumentPreviews(newDocumentPreviews);

    return () => {
      newDocumentPreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          // Only revoke object URLs created by createObjectURL
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [selectedDocuments]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Filter out files that exceed max size or invalid type for immediate client-side feedback
    const validFiles = files.filter(
      (file) =>
        file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type),
    );

    const newImages = [...selectedImages, ...validFiles].slice(0, 10);
    setSelectedImages(newImages);
    form.setValue("images", newImages, { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    form.setValue("images", newImages, { shouldValidate: true });
  };

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(
      (file) =>
        file.size <= MAX_FILE_SIZE &&
        ACCEPTED_DOCUMENT_TYPES.includes(file.type),
    );

    const newDocuments = [...selectedDocuments, ...validFiles].slice(0, 10);
    setSelectedDocuments(newDocuments);
    form.setValue("documents", newDocuments, { shouldValidate: true });
  };

  const removeDocument = (index: number) => {
    const newDocuments = selectedDocuments.filter((_, i) => i !== index);
    setSelectedDocuments(newDocuments);
    form.setValue("documents", newDocuments, { shouldValidate: true });
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("property", values.property);
    formData.append("type", values.type);
    formData.append(
      "investmentAmount",
      values.investmentAmount.replace(/,/g, ""),
    ); // Send clean number

    // Append images
    values.images.forEach((file) => {
      formData.append("images", file);
    });
    // Append documents
    values.documents.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await fetch("/api/asset", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to submit form.",
        );
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      toast("You will recieve an email about your investment");

      // Reset form fields and local state
      form.reset();
      setSelectedImages([]);
      setImagePreviews([]);
      setSelectedDocuments([]);
      setDocumentPreviews([]);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(
        error.message || "An unexpected error occurred during submission.",
      );
    } finally {
      setIsSubmitting(false);
      redirect("/dashboard/invest/asset");
    }
  };

  return (
    <div className="bg-background">
      <div className="mx-auto px-1 py-6">
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2">
          {/* Left side - Hero Section */}
          <div className="bg-muted/30 hidden h-full flex-col items-center justify-center p-12 lg:flex">
            <div className="max-w-md space-y-6 text-center">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Investment Property Hero"
                className="h-64 w-full rounded-lg object-cover shadow-lg"
              />
              <div className="space-y-4">
                <h1 className="text-foreground text-3xl font-bold">
                  Start Your Investment Journey
                </h1>
                <p className="text-muted-foreground text-lg">
                  Upload your property details and let us help you make informed
                  investment decisions.
                </p>
                <div className="flex items-center justify-center space-x-8 pt-4">
                  <div className="text-center">
                    <div className="text-foreground text-2xl font-bold">
                      500+
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Properties Listed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-foreground text-2xl font-bold">
                      $2M+
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Total Investments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form Section */}
          <div className="flex w-full flex-col justify-start overflow-y-auto lg:px-12">
            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Property Form</CardTitle>
                  <CardDescription>
                    Fill out the details for your investment property
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="property"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter property name"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the name or address of the investment
                              property
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="residential-property">
                                  Residential Property
                                </SelectItem>
                                <SelectItem value="commercial-property">
                                  Commercial Property
                                </SelectItem>
                                <SelectItem value="land">Land</SelectItem>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="silver">Silver</SelectItem>
                                <SelectItem value="other-precious-metals">
                                  Other Precious Metals (e.g., Platinum,
                                  Palladium)
                                </SelectItem>
                                <SelectItem value="fine-art">
                                  Fine Art
                                </SelectItem>
                                <SelectItem value="classic-luxury-vehicles">
                                  Classic & Luxury Vehicles
                                </SelectItem>
                                <SelectItem value="rare-collectibles">
                                  Rare Collectibles (e.g., coins, stamps,
                                  antiques)
                                </SelectItem>
                                <SelectItem value="high-value-jewelry-watches">
                                  High-Value Jewelry & Watches
                                </SelectItem>
                                <SelectItem value="vintage-wine-spirits">
                                  Vintage Wine & Spirits
                                </SelectItem>
                                <SelectItem value="heavy-equipment-machinery">
                                  Heavy Equipment & Machinery
                                </SelectItem>
                                <SelectItem value="commercial-vehicles">
                                  Commercial Vehicles (e.g., trucks, planes,
                                  boats)
                                </SelectItem>
                                <SelectItem value="farm-forest-assets">
                                  Farm & Forest Assets (e.g., Farmland, Timber,
                                  Livestock)
                                </SelectItem>
                                <SelectItem value="other-tangible-assets">
                                  Other Tangible Assets
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="investmentAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Investment Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform">
                                  $
                                </span>
                                <Input
                                  placeholder="0"
                                  className="pl-8"
                                  {...field}
                                  onChange={(e) => {
                                    const formatted = formatCurrency(
                                      e.target.value,
                                    );
                                    field.onChange(formatted);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Enter the total amount you plan to invest in this
                              property
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Property Images Upload */}
                      <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Images</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex w-full items-center justify-center">
                                  <label
                                    htmlFor="image-upload"
                                    className="border-border bg-muted/50 hover:bg-muted flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                                  >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Upload className="text-muted-foreground mb-4 h-8 w-8" />
                                      <p className="text-muted-foreground mb-2 text-sm">
                                        <span className="font-semibold">
                                          Click to upload
                                        </span>{" "}
                                        or drag and drop
                                      </p>
                                      <p className="text-muted-foreground text-xs">
                                        PNG, JPG, JPEG or WebP (MAX. 5MB each)
                                      </p>
                                    </div>
                                    <input
                                      id="image-upload"
                                      type="file"
                                      className="hidden"
                                      multiple
                                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                      onChange={handleImageChange}
                                    />
                                  </label>
                                </div>

                                {selectedImages.length > 0 && (
                                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {imagePreviews.map((preview, index) => (
                                      <div
                                        key={index}
                                        className="group relative"
                                      >
                                        <div className="bg-muted aspect-square overflow-hidden rounded-lg">
                                          {/* Use local object URL for preview */}
                                          {preview && (
                                            <img
                                              src={
                                                preview // Use the generated object URL
                                              }
                                              alt={`Image preview ${index + 1}`}
                                              className="h-full w-full object-cover"
                                            />
                                          )}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeImage(index)}
                                          className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                        <div className="bg-background/80 text-foreground absolute bottom-2 left-2 rounded px-2 py-1 text-xs backdrop-blur-sm">
                                          {selectedImages[index]?.name}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <p className="text-muted-foreground text-sm">
                                  {selectedImages.length}/10 images selected
                                </p>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Property Documents Upload */}
                      <FormField
                        control={form.control}
                        name="documents"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Documents</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex w-full items-center justify-center">
                                  <label
                                    htmlFor="document-upload"
                                    className="border-border bg-muted/50 hover:bg-muted flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                                  >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Upload className="text-muted-foreground mb-4 h-8 w-8" />
                                      <p className="text-muted-foreground mb-2 text-sm">
                                        <span className="font-semibold">
                                          Click to upload
                                        </span>{" "}
                                        or drag and drop
                                      </p>
                                      <p className="text-muted-foreground text-xs">
                                        PNG, JPG, JPEG, WebP or PDF (MAX. 5MB
                                        each)
                                      </p>
                                    </div>
                                    <input
                                      id="document-upload"
                                      type="file"
                                      className="hidden"
                                      multiple
                                      accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                                      onChange={handleDocumentChange}
                                    />
                                  </label>
                                </div>

                                {selectedDocuments.length > 0 && (
                                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {documentPreviews.map((preview, index) => (
                                      <div
                                        key={index}
                                        className="group relative"
                                      >
                                        <div className="bg-muted flex aspect-square items-center justify-center overflow-hidden rounded-lg">
                                          {/* For documents, show generic icon or image preview */}
                                          {preview && (
                                            <img
                                              src={
                                                preview // Use the generated object URL or generic icon
                                              }
                                              alt={`Document preview ${index + 1}`}
                                              className="h-full w-full object-cover"
                                            />
                                          )}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeDocument(index)}
                                          className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                        <div className="bg-background/80 text-foreground absolute bottom-2 left-2 rounded px-2 py-1 text-xs backdrop-blur-sm">
                                          {selectedDocuments[index]?.name}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <p className="text-muted-foreground text-sm">
                                  {selectedDocuments.length}/10 documents
                                  selected
                                </p>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {submitError && (
                        <p className="text-sm text-red-500">{submitError}</p>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Submitting..."
                          : "Submit Investment Form"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
