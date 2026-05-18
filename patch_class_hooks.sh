sed -i 's/users:teacher_id (id, full_name),/users:teacher_id (id, full_name),\n          programs:program_id (id, name),/g' src/lib/hooks/use-classes.ts
