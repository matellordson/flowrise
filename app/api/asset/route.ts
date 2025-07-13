// app/api/investments/route.ts (for App Router)
import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { sql } from "@/lib/sql"; // Using your direct SQL client
import { auth } from "@/auth";

// Initialize ImageKit with your private key (server-side only)
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 1. Extract text fields
    const propertyName = formData.get("property")?.toString();
    const propertyType = formData.get("type")?.toString();
    const investmentAmountStr = formData.get("investmentAmount")?.toString();

    // Basic validation for required fields
    if (!propertyName || !propertyType || !investmentAmountStr) {
      return NextResponse.json(
        { error: "Missing required form fields." },
        { status: 400 },
      );
    }

    const investmentAmount = parseFloat(investmentAmountStr.replace(/,/g, ""));
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid investment amount." },
        { status: 400 },
      );
    }

    // 2. Handle image and document uploads to ImageKit
    const imageFiles = formData.getAll("images") as File[]; // Type assertion for File[]
    const documentFiles = formData.getAll("documents") as File[]; // Type assertion for File[]

    const uploadFiles = async (files: File[]) => {
      const urls: string[] = [];
      for (const file of files) {
        if (file instanceof File) {
          // Ensure it's a File object
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: file.name,
            folder: "/investment-properties", // Consistent folder for your uploads
            useUniqueFileName: true,
          });
          urls.push(uploadResponse.url);
        }
      }
      return urls;
    };

    const imageUrls = await uploadFiles(imageFiles);
    const documentUrls = await uploadFiles(documentFiles);
    const session = await auth();

    // 3. Save data to PostgreSQL using direct SQL
    // Ensure your table 'investment_properties' exists and has columns:
    // id (UUID, PK), property_name (TEXT), property_type (TEXT),
    // investment_amount (NUMERIC or REAL), image_urls (TEXT[]), document_urls (TEXT[]),
    // created_at (TIMESTAMP), updated_at (TIMESTAMP)
    const result = await sql`
      INSERT INTO asset_request (
        property_name,
        property_type,
        investment_amount,
        image_urls,
        document_urls,
        created_at,
        updated_at,
        "user",
        current_value
      ) VALUES (
        ${propertyName},
        ${propertyType},
        ${investmentAmount},
        ${imageUrls},
        ${documentUrls},
        NOW(),
        NOW(),
        ${session?.user?.email},
        ${investmentAmount}
      ) 
    `;

    // Assuming the first row is the inserted one, and we want to return it
    const newProperty = result[0];

    return NextResponse.json(
      {
        message: "Property created successfully!",
        property: newProperty,
        imageUrls, // Still return these for client confirmation
        documentUrls,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to process request", details: errorMessage },
      { status: 500 },
    );
  }
}
