sed -i '/<TableHead>Nama Kelas<\/TableHead>/a \                  <TableHead>Program<\/TableHead>' src/app/dashboard/classes/page.tsx
sed -i '/<TableCell className="font-medium">{c.name}<\/TableCell>/a \                      <TableCell>{c.programs?.name || <span className="text-muted-foreground text-sm italic">Belum ditentukan<\/span>}<\/TableCell>' src/app/dashboard/classes/page.tsx
sed -i 's/colSpan={6}/colSpan={7}/g' src/app/dashboard/classes/page.tsx
