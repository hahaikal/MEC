import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  isProcessing?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Ya, Simpan',
  cancelText = 'Batal',
  isProcessing = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(val) => !isProcessing && onOpenChange(val)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              if (onCancel) onCancel()
            }}
            disabled={isProcessing}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
