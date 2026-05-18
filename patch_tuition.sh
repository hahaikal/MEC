sed -i 's/student={selectedCell.student}/studentId={selectedCell.student.id}\n          studentName={selectedCell.student.name}\n          programId=""\n          baseFee={selectedCell.student.base_fee}\n          status={selectedCell.existingPayment ? "paid" : "unpaid"}/g' src/components/students/tuition-matrix-table.tsx

sed -i 's/month={selectedCell.month}/monthName={selectedCell.month}/g' src/components/students/tuition-matrix-table.tsx
sed -i '/existingPayment={selectedCell.existingPayment}/d' src/components/students/tuition-matrix-table.tsx
sed -i '/onSuccess={handlePaymentSaved}/d' src/components/students/tuition-matrix-table.tsx
