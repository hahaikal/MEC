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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { ImageCropper } from "@/components/ui/image-cropper";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  date: z.date({
    required_error: "A date is required.",
  }),
  files: z.any().refine((files) => files && files.length > 0, "At least one image is required."),
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
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filesToCrop, setFilesToCrop] = useState<{file: File, url: string}[]>([]);

  const currentFileToCrop = filesToCrop[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    setProgress(0);

    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Update progress per file
        setProgress(Math.round((i / selectedFiles.length) * 100));

        const fileExt = file.name.split('.').pop();
        const fileName = `${classId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `activities/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("parent_hub_gallery")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("parent_hub_gallery")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setProgress(90);

      const result = await createActivityRecord({
        class_id: classId,
        title: values.title,
        description: values.description,
        image_url: uploadedUrls.join(','), // Store as comma-separated
        created_at: values.date.toISOString(),
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setProgress(100);
      toast.success("Activity posted successfully");
      form.reset();
      setPreviewUrls([]);
      setSelectedFiles([]);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to post activity");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }

  const removeFile = (indexToRemove: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== indexToRemove);
    const newPreviews = previewUrls.filter((_, i) => i !== indexToRemove);
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    form.setValue('files', newFiles.length > 0 ? newFiles : undefined as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
          name="files"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>
                Photos (Max 10MB per file)
                <span className="block text-xs font-normal text-blue-600 mt-1">
                  Bisa upload lebih dari 1 foto
                </span>
              </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    multiple
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        const newFilesToCrop = files.map(file => ({
                          file,
                          url: URL.createObjectURL(file)
                        }));
                        setFilesToCrop(prev => [...prev, ...newFilesToCrop]);
                        e.target.value = '';
                      }
                    }}
                    {...field}
                  />
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {previewUrls.map((url, i) => (
                        <div key={i} className="relative group aspect-square">
                          <img 
                            src={url} 
                            alt={`Preview ${i + 1}`} 
                            className="h-full w-full rounded-lg object-cover border" 
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(i)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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

      {currentFileToCrop && (
        <ImageCropper
          open={!!currentFileToCrop}
          imageSrc={currentFileToCrop.url}
          aspectRatio={16 / 9}
          onCropComplete={(croppedFile) => {
            const newSelected = [...selectedFiles, croppedFile];
            setSelectedFiles(newSelected);
            form.setValue('files', newSelected);
            
            const newPreview = URL.createObjectURL(croppedFile);
            setPreviewUrls([...previewUrls, newPreview]);
            
            setFilesToCrop(prev => prev.slice(1));
          }}
          onCancel={() => {
            setFilesToCrop(prev => prev.slice(1));
          }}
        />
      )}
    </Form>
  );
}
