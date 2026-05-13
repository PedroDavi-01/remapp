import { db } from "@/src/db/index";
import { folders } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { createFolder } from "@/src/actions/folder-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EditFolderDialog } from "@/src/components/edit-folder-dialog";
import { DeleteFolderButton } from "@/src/components/delete-folder-button";
import { FolderPlus } from "lucide-react";
import Link from "next/link";

export default async function PastasPage() {
  const { userId } = await auth();

  // Busca as pastas do user logado
  const userFolders = await db.select()
    .from(folders)
    .where(eq(folders.userId, userId!));

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Meus Decks</h1>
        <p className="text-zinc-500 font-medium">Cria e gere as tuas categorias de estudo.</p>
      </div>

      {/* Formulário  */}
      <Card className="border-2 border-blue-50 shadow-sm overflow-hidden">
        <CardContent className="pt-6 bg-white">
          <form action={createFolder} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input 
                name="name" 
                placeholder="Nome da pasta (ex: React, Inglês...)" 
                required 
                className="pl-10 h-12 rounded-xl border-zinc-200 focus:ring-blue-500"
              />
              <FolderPlus className="absolute left-3 top-3.5 h-5 w-5 text-zinc-400" />
            </div>
            <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-100">
              Criar Pasta
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pastas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userFolders.map((folder) => (
          <div key={folder.id} className="relative group">
            <Link href={`/pastas/${folder.id}`}>
              <Card className="hover:border-blue-400 transition-all cursor-pointer h-full border-zinc-200 shadow-sm hover:shadow-xl bg-white group-hover:-translate-y-1 duration-200">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 pr-16">
                    <span className="text-3xl">📁</span>
                    <span className="truncate">{folder.name}</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                      Abrir Deck
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Ações Rápidas */}
            <div className="absolute right-4 top-5 z-30 flex gap-1">
              <EditFolderDialog id={folder.id} initialName={folder.name} />
              <DeleteFolderButton folderId={folder.id} />
            </div>
          </div>
        ))}

        {userFolders.length === 0 && (
          <div className="col-span-full py-32 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-zinc-200">
            <div className="text-5xl mb-4 opacity-20">📂</div>
            <h3 className="text-xl font-bold text-slate-400">Nenhum deck encontrado</h3>
            <p className="text-zinc-400">Cria a tua primeira pasta acima para começar a estudar.</p>
          </div>
        )}
      </div>
    </main>
  );
}