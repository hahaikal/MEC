"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
import { studentSchema, type StudentFormValues } from "@/lib/validators/student";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/use-auth";

interface StudentFormProps {
  onSuccess?: () => void;
  initialData?: any; // Data siswa untuk mode edit
}

export function StudentForm({ onSuccess, initialData }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState<{ id: string; name: string; price: number }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const { user } = useAuth();
  const supabase = createClient();
  const isEditing = !!initialData;

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone_number: initialData?.phone_number || "",
      parent_name: initialData?.parent_name || "",
      parent_phone: initialData?.parent_phone || "",
      nis: initialData?.nis || "",
      base_fee: initialData?.base_fee || 0,
      billing_cycle_date: initialData?.billing_cycle_date || 10,
      class_id: initialData?.class_id || undefined,
      program_id: initialData?.paymentMap?.program_id || "", 
      address: initialData?.address || "",
    },
  });

  // Fetch Programs and Classes on mount
  useEffect(() => {
    async function fetchData() {
      const { data: programsData, error: programsError } = await supabase
        .from("programs")
        .select("id, name, price")
        .eq("is_active", true);

      if (programsError) {
        console.error("Error fetching programs:", programsError);
      } else if (programsData) {
        setPrograms(programsData);
      }

      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select("id, name")
        .order("name");

      if (classesError) {
        console.error("Error fetching classes:", classesError);
      } else if (classesData) {
        setClasses(classesData);
      }
    }
    fetchData();
  }, [initialData, supabase]);

  const handleProgramChange = (programId: string) => {
    const program = programs.find((p) => p.id === programId);
    if (program) {
      // Only auto-set fee if creating new or explicitly changing program
      form.setValue("base_fee", program.price);
    }
    form.setValue("program_id", programId);
  };

  async function onSubmit(data: StudentFormValues) {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        // --- UPDATE MODE ---
        const { error: updateError } = await supabase
          .from("students")
          .update({
            name: data.name,
            email: data.email || null,
            phone_number: data.phone_number || null,
            parent_name: data.parent_name || null,
            parent_phone: data.parent_phone || null,
            nis: data.nis || null,
            address: data.address || null,
            base_fee: data.base_fee,
            class_id: data.class_id || null,
            billing_cycle_date: data.billing_cycle_date,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (updateError) throw updateError;
        toast.success("Student updated successfully");
      } else {
        // --- CREATE MODE ---
        // FIX: Change status to 'ACTIVE' (uppercase) to match database constraint
        const { data: student, error: studentError } = await supabase
          .from("students")
          .insert({
            name: data.name,
            email: data.email || null,
            phone_number: data.phone_number || null,
            parent_name: data.parent_name || null,
            parent_phone: data.parent_phone || null,
            nis: data.nis || null,
            date_of_birth: data.date_of_birth ? data.date_of_birth.toISOString() : null,
            address: data.address || null,
            base_fee: data.base_fee,
            class_id: data.class_id || null,
            billing_cycle_date: data.billing_cycle_date,
            created_by: user.id,
            status: "ACTIVE", 
          })
          .select()
          .single();

        if (studentError) {
            console.error("Student Insert Error:", studentError);
            throw studentError;
        }

        // Enroll Student
        const { error: enrollmentError } = await supabase
          .from("student_programs")
          .insert({
            student_id: student.id,
            program_id: data.program_id,
            status: "active", // This table likely uses lowercase 'active', checking schema... schema says 'active' is allowed.
            enrollment_date: new Date().toISOString(),
          });

        if (enrollmentError) {
          console.error("Enrollment error:", enrollmentError);
          toast.warning("Student created but program enrollment failed.");
        } else {
          toast.success("Student created and enrolled successfully");
        }
      }

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="nis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIS (Student ID)</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="class_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Only show program selection if creating new student or we want to allow changing it explicitly */}
        {(!isEditing || true) && (
             <FormField
             control={form.control}
             name="program_id"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Program</FormLabel>
                 <Select onValueChange={handleProgramChange} defaultValue={field.value}>
                   <FormControl>
                     <SelectTrigger>
                       <SelectValue placeholder="Select Program" />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                     {programs.map((p) => (
                       <SelectItem key={p.id} value={p.id}>
                         {p.name} - {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(p.price)}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 <FormDescription>
                    {isEditing ? "Changing this may update the monthly fee." : "Sets the default tuition fee."}
                 </FormDescription>
                 <FormMessage />
               </FormItem>
             )}
           />
        )}
     

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="parent_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parent_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+62..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="base_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Tuition Fee (IDR)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Student" : "Save Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
}