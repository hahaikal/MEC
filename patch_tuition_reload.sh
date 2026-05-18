sed -i 's/onOpenChange={setDialogOpen}/onOpenChange={(open) => {\n            setDialogOpen(open)\n            if (!open) fetchData()\n          }}/g' src/components/students/tuition-matrix-table.tsx
