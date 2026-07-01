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
import { ImagePlus, Loader2, X } from "lucide-react";
import { ImageCropper } from "@/components/ui/image-cropper";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  date: z.date({
    required_error: "A date is required.",
  }),
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
  const [cropFileSrc, setCropFileSrc] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    setIsUploading(true);
    setProgress(0);

    try {
      const file = croppedFile || (values.file[0] as File);
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
        created_at: values.date.toISOString(),
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Activity posted successfully");
      form.reset();
      setCroppedFile(null);
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Activity Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                        form.setValue('file', undefined as any);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        const url = URL.createObjectURL(file);
                        setCropFileSrc(url);
                        setShowCropper(true);
                        // Do not trigger onChange yet, wait for crop
                        // We set original file to make validation pass, but we'll override it on submit
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
      {cropFileSrc && (
        <ImageCropper
          imageSrc={cropFileSrc}
          aspectRatio={4 / 3}
          open={showCropper}
          onCancel={() => {
            setShowCropper(false);
            setCropFileSrc(null);
            // Optionally reset file input if they cancel, but we'll leave it
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
