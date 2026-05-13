import { db } from "@/src/db/index";
import { cards, folders } from "@/src/db/schema";
import { eq, lte, and, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, CheckCircle2, } from "lucide-react";

export default async function DesempenhoPage() {
  const { userId } = await auth();

  // Total de pastas
  const [totalFolders] = await db.select({ count: sql<number>`count(*)` })
    .from(folders).where(eq(folders.userId, userId!));

  // Total de cards
  const [totalCards] = await db.select({ count: sql<number>`count(*)` })
    .from(cards).where(eq(cards.userId, userId!));

  // Cards que vencem hoje ou estão atrasados
  const [cardsParaHoje] = await db.select({ count: sql<number>`count(*)` })
    .from(cards)
    .where(
      and(
        eq(cards.userId, userId!),
        lte(cards.nextReview, new Date())
      )
    );

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900">Seu Progresso</h1>
        <p className="text-zinc-500 font-medium">Veja como está sua retenção de conteúdo.</p>
      </div>

      {/* Grid de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-100 shadow-blue-50/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-zinc-500 uppercase">Total de Decks</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">📁</div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{totalFolders.count}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 shadow-purple-50/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-zinc-500 uppercase">Total de Cards</CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">🗂️</div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{totalCards.count}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 shadow-orange-50/50 shadow-lg animate-pulse hover:animate-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-zinc-500 uppercase">Revisões Pendentes</CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">🔥</div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{cardsParaHoje.count}</div>
            <p className="text-xs text-orange-600 font-bold mt-1">Cards que você precisa estudar hoje!</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Dica de Estudo */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold italic">Dica de mestre:</h2>
          <p className="text-slate-300 leading-relaxed">
            O segredo da aprovação não é estudar muito em um dia só, mas revisar um pouco todos os dias. 
            Seus <span className="text-blue-400 font-bold">{cardsParaHoje.count} cards</span> pendentes são a prioridade agora!
          </p>
        </div>
        <div className="text-6xl">🧠</div>
      </div>
    </main>
  );
}