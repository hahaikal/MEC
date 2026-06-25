"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { createDocumentRecord } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { FileUp, Loader2, X } from "lucide-react";
import { ImageCropper } from "@/components/ui/image-cropper";

const MAX_FILE_SIZE = 35 * 1024 * 1024; // 35MB

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  file: z
    .any()
    .refine((files) => files?.length == 1, "PDF file is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 35MB.`
    )
    .refine(
      (files) => files?.[0]?.type === "application/pdf",
      "Only .pdf files are accepted."
    ),
  coverImage: z.any().optional(),
});

interface UploadDocumentFormProps {
  classId: string;
  isPreschool: boolean;
  onSuccess?: () => void;
}

export function UploadDocumentForm({
  classId,
  isPreschool,
  onSuccess,
}: UploadDocumentFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cropFileSrc, setCropFileSrc] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    setProgress(0);

    try {
      const file = values.file[0] as File;
      const supabase = createClient();

      // Simulate initial progress to show UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      const fileExt = file.name.split('.').pop();
      const fileName = `${classId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("parent_hub_magazines")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setProgress(100);

      const { data: publicUrlData } = supabase.storage
        .from("parent_hub_magazines")
        .getPublicUrl(filePath);

      // Handle optional cover image upload
      let coverImageUrl: string | undefined = undefined;
      const finalCoverImage = croppedFile || (values.coverImage?.[0] as File);
      if (finalCoverImage) {
        const imgExt = finalCoverImage.name.split('.').pop() || 'jpeg';
        const imgName = `${classId}-cover-${Math.random().toString(36).substring(2)}.${imgExt}`;
        
        const { data: imgUpload, error: imgError } = await supabase.storage
          .from("parent_hub_magazines")
          .upload(imgName, finalCoverImage, { cacheControl: "3600", upsert: false });

        if (!imgError && imgUpload) {
          const { data: imgPublicUrl } = supabase.storage
            .from("parent_hub_magazines")
            .getPublicUrl(imgName);
          coverImageUrl = imgPublicUrl.publicUrl;
        }
      }

      // Create DB Record
      const fileSizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
      const documentType = isPreschool ? "MAGAZINE" : "LESSON_PLAN";

      const result = await createDocumentRecord({
        class_id: classId,
        title: values.title,
        document_url: publicUrlData.publicUrl,
        file_size_mb: fileSizeMb,
        document_type: documentType,
        cover_image_url: coverImageUrl,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Document uploaded successfully");
      form.reset();
      setCroppedFile(null);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. July 2026 Issue or Week 1 Plan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>PDF File (Max 35MB)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    onChange(e.target.files);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Cover Image (Optional)</FormLabel>
              <FormControl>
                {croppedFile ? (
                  <div className="relative mt-2">
                    <img 
                      src={URL.createObjectURL(croppedFile)} 
                      alt="Cropped Preview" 
                      className="h-40 w-full rounded-lg object-cover" 
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => { 
                        setCroppedFile(null);
                        form.setValue('coverImage', undefined as any);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        const url = URL.createObjectURL(file);
                        setCropFileSrc(url);
                        setShowCropper(true);
                        onChange(files);
                      }
                    }}
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </>
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" />
              Upload {isPreschool ? "Magazine" : "Lesson Plan"}
            </>
          )}
        </Button>
      </form>
      {cropFileSrc && (
        <ImageCropper
          imageSrc={cropFileSrc}
          aspectRatio={4 / 3}
          open={showCropper}
          onCancel={() => {
            setShowCropper(false);
            setCropFileSrc(null);
          }}
          onCropComplete={(croppedFile) => {
            setCroppedFile(croppedFile);
            setShowCropper(false);
            setCropFileSrc(null);
          }}
        />
      )}
    </Form>
  );
}
