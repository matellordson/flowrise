"use client";

import type React from "react";

import { useState } from "react";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
      required_error: "Please select a property type.",
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
    .refine(
      (files) => {
        return files.every((file) => file.size <= MAX_FILE_SIZE);
      },
      {
        message: "Each image must be less than 5MB.",
      },
    )
    .refine(
      (files) => {
        return files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
      },
      {
        message: "Only JPEG, PNG, and WebP images are allowed.",
      },
    ),
});

export default function InvestmentForm() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      property: "",
      type: "",
      investmentAmount: "",
      images: [],
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // Combine with existing images, but limit to 10 total
    const newImages = [...selectedImages, ...files].slice(0, 10);
    setSelectedImages(newImages);
    form.setValue("images", newImages);

    // Create previews for new images
    const newPreviews = [...imagePreviews];
    files.forEach((file, index) => {
      if (newPreviews.length < 10) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreviews((prev) => [
            ...prev.slice(0, selectedImages.length + index),
            result,
            ...prev.slice(selectedImages.length + index + 1),
          ]);
        };
        reader.readAsDataURL(file);
        newPreviews.push(""); // Placeholder
      }
    });
    setImagePreviews(newPreviews.slice(0, 10));
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
    form.setValue("images", newImages);
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    // Handle form submission here
    alert("Form submitted successfully! Check console for details.");
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-0 lg:grid-cols-2">
          {/* Left side - Hero Section */}
          <div className="bg-muted/30 hidden flex-col items-center justify-center p-12 lg:flex">
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
          <div className="flex flex-col justify-center p-6 lg:p-12">
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
                                <SelectItem value="residential">
                                  Residential
                                </SelectItem>
                                <SelectItem value="commercial">
                                  Commercial
                                </SelectItem>
                                <SelectItem value="industrial">
                                  Industrial
                                </SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="office">Office</SelectItem>
                                <SelectItem value="mixed-use">
                                  Mixed Use
                                </SelectItem>
                                <SelectItem value="land">Land</SelectItem>
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
                                      accept="image/*"
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
                                          {preview && (
                                            <img
                                              src={
                                                preview || "/placeholder.svg"
                                              }
                                              alt={`Preview ${index + 1}`}
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

                      <Button type="submit" className="w-full">
                        Submit Investment Form
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
