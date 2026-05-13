'use client' 

import { Trash2 } from "lucide-react"
import { deleteFolder } from "@/src/actions/folder-actions"

export function DeleteFolderButton({ folderId }: { folderId: number }) {
  return (
    <button 
      onClick={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (confirm("Tem certeza? Isso apagará todos os cards desta pasta.")) {
          await deleteFolder(folderId)
        }
      }} 
      className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}