"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { createActivityRecord } from "@/actions/activities";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { ImagePlus, Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  file: z.any().refine((files) => files && files.length > 0, "Image is required."),
});

interface UploadActivityFormProps {
  classId: string;
  onSuccess?: () => void;
}

export function UploadActivityForm({
  classId,
  onSuccess,
}: UploadActivityFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    setIsUploading(true);
    setProgress(0);

    try {
      const file = values.file[0] as File;
      const supabase = createClient();

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      const fileExt = file.name.split('.').pop();
      const fileName = `${classId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `activities/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("parent_hub_gallery")
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
        .from("parent_hub_gallery")
        .getPublicUrl(filePath);

      // Create DB Record
      const result = await createActivityRecord({
        class_id: classId,
        title: values.title,
        description: values.description,
        image_url: publicUrlData.publicUrl,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Activity posted successfully");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to post activity");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.error("Form validation errors:", errors);
        toast.error("Please fill in all required fields correctly.");
      })} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Spelling Bee Winner!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Share details about this activity..." {...field} />
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
              <FormLabel>Photo (Max 10MB)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg, image/jpg, image/png, image/webp"
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
              Posting
            </>
          ) : (
            <>
              <ImagePlus className="mr-2 h-4 w-4" />
              Post Activity
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
