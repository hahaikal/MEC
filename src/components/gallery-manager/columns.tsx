'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToggleGalleryItem, useDeleteGalleryItem } from '@/lib/hooks/use-gallery'
import { GALLERY_CATEGORIES } from '@/types/gallery'
import { toast } from 'sonner'

type GalleryRow = {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string
  is_active: boolean
  order_index: number
  created_at: string
}

export const columns: ColumnDef<GalleryRow>[] = [
  {
    accessorKey: 'image_url',
    header: 'Image',
    cell: ({ row }) => (
      <div className="h-16 w-24 overflow-hidden rounded-lg bg-slate-100">
        <img
          src={row.getValue('image_url')}
          alt={row.original.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue('title')}</p>
        {row.original.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const cat = GALLERY_CATEGORIES.find(c => c.value === row.getValue('category'))
      return <Badge variant="secondary">{cat?.label || row.getValue('category')}</Badge>
    },
  },
  {
    accessorKey: 'order_index',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Order
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: function StatusCell({ row }) {
      const toggle = useToggleGalleryItem()
      const isActive = row.getValue('is_active') as boolean

      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => {
              toggle.mutate(
                { id: row.original.id, isActive: checked },
                {
                  onSuccess: (result) => {
                    if ('error' in result && result.error) {
                      toast.error(result.error)
                    } else {
                      toast.success(checked ? 'Item activated' : 'Item deactivated')
                    }
                  },
                }
              )
            }}
          />
          <span className={`text-xs ${isActive ? 'text-green-600' : 'text-red-500'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: function ActionsCell({ row, table }) {
      const deleteMutation = useDeleteGalleryItem()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                const meta = table.options.meta as any
                meta?.onEdit?.(row.original)
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &quot;{row.original.title}&quot; and its image from storage. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      deleteMutation.mutate(row.original.id, {
                        onSuccess: (result) => {
                          if ('error' in result && result.error) {
                            toast.error(result.error)
                          } else {
                            toast.success('Item deleted successfully')
                          }
                        },
                      })
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
