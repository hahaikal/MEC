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
import { FileUp, Loader2 } from "lucide-react";

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

      // Create DB Record
      const fileSizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
      const documentType = isPreschool ? "MAGAZINE" : "LESSON_PLAN";

      const result = await createDocumentRecord({
        class_id: classId,
        title: values.title,
        document_url: publicUrlData.publicUrl,
        file_size_mb: fileSizeMb,
        document_type: documentType,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Document uploaded successfully");
      form.reset();
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
    </Form>
  );
}
