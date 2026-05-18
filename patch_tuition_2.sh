sed -i 's/programId=""/programId={selectedCell.student.program_id || ""}/g' src/components/students/tuition-matrix-table.tsx
