import { db } from "@/src/db/index";
import { folders, cards } from "@/src/db/schema";
import { eq, count } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { createCard } from "@/src/actions/card-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function HomePage() {
  const { userId } = await auth();

  // Pega as pastas para o usuário escolher no <select>
  const userFolders = await db.select()
    .from(folders)
    .where(eq(folders.userId, userId!));

  // Select do Total de Cards para o Dash
  const [totalCards] = await db.select({ value: count() })
    .from(cards)
    .where(eq(cards.userId, userId!));

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-500">Crie cards rapidamente e veja seu progresso.</p>
      </div>

      {/* Grid de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total de Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCards.value}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Decks Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userFolders.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Formulario*/}
      <Card className="border-2 border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle>Criação Rápida de Card</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCard} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Frente (Pergunta)</label>
                <Input 
                  name="front" 
                  placeholder="Ex: O que é 'Hoisting'?" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Verso (Resposta)</label>
                <Input 
                  name="back" 
                  placeholder="Ex: É o comportamento do JS de mover declarações para o topo." 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Selecione o Deck</label>
              <select 
                name="folderId" 
                className="w-full flex h-10 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Escolha uma pasta...</option>
                {userFolders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6">
              Adicionar Card
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {userFolders.length === 0 && (
        <p className="text-center text-sm text-zinc-500">
          Você precisa criar uma pasta na aba <strong className="text-blue-600">Decks</strong> antes de adicionar cards.
        </p>
      )}
    </main>
  );
}