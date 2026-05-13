import { db } from "@/src/db/index";
import { folders, cards } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteCard } from "@/src/actions/card-actions"; 
import { EditCardDialog } from "@/src/components/edit-card-dialog";
import Link from "next/link";
import { Pencil, Trash2, Eye } from "lucide-react"; 

export default async function PastaDetalhesPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { userId } = await auth();
  const { id } = await params;
  const folderId = Number(id);

  if (isNaN(folderId)) return notFound();

  const [folder] = await db.select().from(folders).where(
    and(eq(folders.id, folderId), eq(folders.userId, userId!))
  );

  if (!folder) return notFound();

  const allCards = await db.select().from(cards).where(
    and(eq(cards.folderId, folderId), eq(cards.userId, userId!))
  );

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{folder.name}</h1>
          <p className="text-zinc-500">{allCards.length} cards neste deck</p>
        </div>
        <Link href={`/pastas/${folderId}/estudar`}>
        <Button className="bg-green-600 hover:bg-green-700 font-bold px-6">
          Estudar este Deck 
        </Button>
        </Link>
      </div>

      {/* Lista de Cards */}
      <div className="space-y-3">
        {allCards.map((card) => (
          <Card key={card.id} className="overflow-hidden border-zinc-200">
            <CardContent className="p-0">
              <div className="p-4 flex justify-between items-center bg-white">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Frente</span>
                  <p className="font-semibold text-slate-800">{card.front}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase">Revisar em</span>
                    <span className="text-sm font-medium text-slate-600">
                      {card.nextReview?.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  {/* Botão de Edit */}
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-600">
                      <EditCardDialog 
                        cardId={card.id}
                        folderId={folderId}
                        initialFront={card.front}
                        initialBack={card.back}
                      />
                    </Button>
                    
                    {/* Botão de Excluir */}
                    <form action={async () => {
                      'use server'
                      await deleteCard(card.id, folderId);
                    }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Verso  */}
              <details className="group border-t border-zinc-100">
                <summary className="list-none cursor-pointer p-3 text-center text-xs font-bold text-zinc-400 hover:bg-zinc-50 flex items-center justify-center gap-2 transition-colors">
                  <Eye className="h-3 w-3" /> VER RESPOSTA
                </summary>
                <div className="p-6 bg-slate-50 text-slate-700 border-t border-zinc-100 italic">
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase mb-2 not-italic">Verso</span>
                  {card.back}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}