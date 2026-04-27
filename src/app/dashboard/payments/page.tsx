'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useStudents } from '@/lib/hooks/use-students'
import { useTuitionDetails, useStudentPayments } from '@/lib/hooks/use-payments'
import { createPayment } from '@/actions/payments'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Search } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const months = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
]

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  // New Payment State
  const [payMonth, setPayMonth] = useState<string>((new Date().getMonth() + 1).toString())
  const [payYear, setPayYear] = useState<string>(new Date().getFullYear().toString())
  const [payMethod, setPayMethod] = useState<string>('cash')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: students, isLoading: isLoadingStudents } = useStudents()
  const { data: tuitionInfo, isLoading: isLoadingTuition } = useTuitionDetails(selectedStudentId)
  const { data: history, isLoading: isLoadingHistory } = useStudentPayments(selectedStudentId)

  const queryClient = useQueryClient()

  const filteredStudents = students?.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) && s.status === 'ACTIVE'
  ).slice(0, 5) || []

  const selectedStudent = students?.find(s => s.id === selectedStudentId)

  const handlePayment = async () => {
    if (!selectedStudentId || !tuitionInfo) return
    setIsSubmitting(true)

    const res = await createPayment({
      student_id: selectedStudentId,
      program_id: tuitionInfo.programId,
      amount: tuitionInfo.finalPrice,
      discount_amount: tuitionInfo.discount,
      category: 'tuition',
      month: parseInt(payMonth),
      year: parseInt(payYear),
      payment_method: payMethod,
      notes
    })

    setIsSubmitting(false)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Pembayaran SPP berhasil dicatat")
      queryClient.invalidateQueries({ queryKey: ['payments', 'student', selectedStudentId] })
      // Reset some fields
      setNotes('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Tagihan & Pembayaran SPP</h1>
        <p className="text-muted-foreground mt-1">Proses pembayaran SPP dengan perhitungan diskon otomatis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Column: Search & Select */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cari Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ketik nama siswa..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {isLoadingStudents ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> :
                  search && filteredStudents.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4">Siswa tidak ditemukan</div>
                  ) : (
                  filteredStudents.map(s => (
                    <div
                      key={s.id}
                      onClick={() => { setSelectedStudentId(s.id); setSearch('') }}
                      className={`p-3 rounded-md cursor-pointer border hover:border-blue-500 transition-colors ${selectedStudentId === s.id ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}
                    >
                      <div className="font-medium text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">Kelas: {s.class_name || '-'}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Billing Engine & History */}
        <div className="md:col-span-2 space-y-6">
          {!selectedStudentId ? (
            <Card className="h-full flex items-center justify-center bg-slate-50/50">
              <CardContent className="text-center text-muted-foreground pt-6">
                Pilih siswa dari panel di sebelah kiri untuk melihat dan memproses pembayaran.
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Billing Panel */}
              <Card>
                <CardHeader className="pb-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedStudent?.name}</CardTitle>
                      <CardDescription className="mt-1">Kelas: {selectedStudent?.class_name || 'Belum ada kelas'}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {isLoadingTuition ? (
                    <div className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Memuat data tagihan...</div>
                  ) : !tuitionInfo?.programId ? (
                    <div className="text-red-500 bg-red-50 p-4 rounded-md text-sm">
                      Siswa ini belum didaftarkan ke kelas yang memiliki Program (Program ID kosong). Harap atur Program untuk kelas ini terlebih dahulu agar tagihan dapat dihitung.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Pricing Info */}
                      <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                        <h3 className="font-semibold text-slate-700">Rincian Tagihan SPP</h3>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Harga Program:</span>
                          <span>Rp {tuitionInfo.price.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Diskon Aktif:</span>
                          <span className="text-green-600">- Rp {tuitionInfo.discount.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between font-bold text-lg">
                          <span>Total Bayar:</span>
                          <span>Rp {tuitionInfo.finalPrice.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      {/* Payment Form */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Bulan SPP</label>
                            <Select value={payMonth} onValueChange={setPayMonth}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {months.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Tahun</label>
                            <Input type="number" value={payYear} onChange={e => setPayYear(e.target.value)} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium">Metode Pembayaran</label>
                          <Select value={payMethod} onValueChange={setPayMethod}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Tunai / Cash</SelectItem>
                              <SelectItem value="transfer">Transfer Bank</SelectItem>
                              <SelectItem value="card">Kartu Kredit/Debit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium">Catatan (Opsional)</label>
                          <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Mis. Lunas via BCA" />
                        </div>

                        <Button
                          onClick={handlePayment}
                          disabled={isSubmitting || tuitionInfo.finalPrice < 0}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                          Proses Pembayaran
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* History Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Riwayat Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Periode SPP</TableHead>
                        <TableHead>Nominal</TableHead>
                        <TableHead>Metode</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingHistory ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-4">Memuat...</TableCell></TableRow>
                      ) : history?.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada riwayat pembayaran.</TableCell></TableRow>
                      ) : (
                        history?.map(h => (
                          <TableRow key={h.id}>
                            <TableCell>{format(new Date(h.payment_date || h.created_at), 'dd MMM yyyy')}</TableCell>
                            <TableCell>{months.find(m => m.value === h.month)?.label} {h.year}</TableCell>
                            <TableCell className="font-medium">Rp {h.amount.toLocaleString('id-ID')}</TableCell>
                            <TableCell className="capitalize">{h.payment_method}</TableCell>
                            <TableCell>
                              <Badge variant={h.payment_status === 'completed' ? 'default' : 'secondary'} className={h.payment_status === 'completed' ? 'bg-green-100 text-green-800' : ''}>
                                {h.payment_status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
