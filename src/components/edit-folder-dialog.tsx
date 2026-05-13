'use client'

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { editFolder } from "@/src/actions/folder-actions"

export function EditFolderDialog({ id, initialName }: { id: number, initialName: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-zinc-500 hover:text-blue-600"
          onClick={(e) => e.stopPropagation()} 
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Editar Nome da Pasta</DialogTitle>
        </DialogHeader>
        <form action={async (formData) => {
          await editFolder(formData)
          setOpen(false)
        }} className="space-y-4 pt-4">
          <input type="hidden" name="folderId" value={id} />
          <Input name="name" defaultValue={initialName} required autoFocus />
          <Button type="submit" className="w-full bg-blue-600">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}