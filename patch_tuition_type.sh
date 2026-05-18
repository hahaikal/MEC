sed -i '/created_at: string;/a \  class_enrollments?: { classes?: { program_id: string } }\[\];' src/components/students/tuition-matrix-table.tsx
