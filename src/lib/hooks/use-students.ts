import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudents, createStudent, updateStudent, deleteStudent } from "@/actions/students";
import { StudentFormValues } from "@/lib/validators/student";
import { toast } from "sonner";

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents(),
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentFormValues) => createStudent(data),
    onSuccess: () => {
      toast.success("Siswa berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StudentFormValues }) =>
      updateStudent(id, data),
    onSuccess: () => {
      toast.success("Data siswa berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      toast.success("Siswa berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}