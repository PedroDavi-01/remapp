'use client'

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { editCard } from "@/src/actions/card-actions"

interface EditCardProps {
  cardId: number
  folderId: number
  initialFront: string
  initialBack: string
}

export function EditCardDialog({ cardId, folderId, initialFront, initialBack }: EditCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-600">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Card</DialogTitle>
        </DialogHeader>
        <form action={async (formData) => {
          await editCard(formData)
          setOpen(false) 
        }} className="space-y-4 pt-4">
          {/* Campos ocultos para passar os IDs para a Action */}
          <input type="hidden" name="cardId" value={cardId} />
          <input type="hidden" name="folderId" value={folderId} />

          <div className="space-y-2">
            <label className="text-sm font-medium">Frente</label>
            <Input name="front" defaultValue={initialFront} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Verso</label>
            <Input name="back" defaultValue={initialBack} required />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Salvar Alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}