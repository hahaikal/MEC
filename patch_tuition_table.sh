sed -i 's/programId={selectedCell.student.program_id || ""}/programId={selectedCell.student.class_enrollments?.[0]?.classes?.program_id || ""}/g' src/components/students/tuition-matrix-table.tsx
