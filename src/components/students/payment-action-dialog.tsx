import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface PaymentActionDialogProps {
  studentId: string
  studentName: string
  programId: string
  monthName: string
  year: string
  baseFee: number
  status: "paid" | "unpaid" | "partial"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentActionDialog({
  studentId,
  studentName,
  programId,
  monthName,
  year,
  baseFee,
  status,
  open,
  onOpenChange,
}: PaymentActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const supabase = createClient()
  
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [discount, setDiscount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [notes, setNotes] = useState("")

  const finalAmount = Math.max(0, baseFee - discount)

  useEffect(() => {
    if (open) {
      setPaymentDate(new Date().toISOString().split('T')[0])
      setDiscount(0)
      setNotes("")
      setPaymentMethod("cash")
    }
  }, [open])

  const handlePayment = async () => {
    if (!programId) {
      toast.error("Data program siswa tidak ditemukan. Pembayaran membutuhkan Program ID.")
      return
    }

    try {
      setIsLoading(true)
      
      const { error } = await supabase.from("payments").insert({
        student_id: studentId,
        program_id: programId,
        amount: finalAmount,
        category: "tuition",
        payment_for_month: `${monthName} ${year}`,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        payment_status: "completed",
        notes: notes ? `${notes} (Disc: ${formatCurrency(discount)})` : discount > 0 ? `Discount: ${formatCurrency(discount)}` : null,
        received_by: (await supabase.auth.getUser()).data.user?.id
      })

      if (error) throw error

      toast.success(`Pembayaran SPP ${monthName} berhasil`)
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["students"] }) // Refresh status pembayaran di tabel siswa juga
      router.refresh() // Refresh data server component
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Gagal mencatat pembayaran: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bayar SPP: {monthName} {year}</DialogTitle>
          <DialogDescription>
            Siswa: <span className="font-semibold text-foreground">{studentName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Tanggal Pembayaran</Label>
            <Input
              id="date"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Biaya (SPP)</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm flex items-center font-medium">
                {formatCurrency(baseFee)}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="discount">Diskon (Rp)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md flex justify-between items-center border border-blue-100 dark:border-blue-900">
            <span className="text-sm font-medium">Total Diterima:</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(finalAmount)}
            </span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="method">Metode Pembayaran</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tunai (Cash)</SelectItem>
                <SelectItem value="transfer">Transfer Bank</SelectItem>
                <SelectItem value="qris">QRIS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              placeholder="Catatan tambahan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handlePayment} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}