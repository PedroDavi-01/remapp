'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { reviewCard } from "@/src/actions/card-actions";
import { useRouter } from "next/navigation";

export default function StudyView({ cards, folderId }: { cards: any[], folderId: number }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [mostrarVerso, setMostrarVerso] = useState(false);

  // Se não tem cards, mostra o aviso
  if (cards.length === 0) {
    return (
      <div className="text-center p-20">
        <h2 className="text-2xl font-bold">Nada para revisar! 🎉</h2>
        <Button onClick={() => router.push(`/pastas/${folderId}`)} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const cardAtual = cards[index];


  async function responder(nivel: 'easy' | 'good' | 'hard') {
    await reviewCard(cardAtual.id, folderId, nivel);

    if (index + 1 < cards.length) {
      setIndex(index + 1); 
      setMostrarVerso(false); 
    } else {
      alert("Estudo finalizado!");
      router.push(`/pastas/${folderId}`);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <div className="text-center text-sm text-zinc-400 font-bold">
        CARD {index + 1} DE {cards.length}
      </div>

      <div className="border-4 border-zinc-100 rounded-3xl p-10 min-h-[300px] flex flex-col justify-center items-center text-center bg-white shadow-sm">
        {/* Frente */}
        <div className="mb-6">
          <span className="text-xs text-blue-500 font-bold uppercase">Pergunta:</span>
          <p className="text-2xl font-bold">{cardAtual.front}</p>
        </div>

        {/* Verso */}
        {mostrarVerso ? (
          <div className="pt-6 border-t w-full">
            <span className="text-xs text-green-500 font-bold uppercase">Resposta:</span>
            <p className="text-xl text-zinc-600 italic">{cardAtual.back}</p>
          </div>
        ) : (
          <Button onClick={() => setMostrarVerso(true)} className="bg-zinc-900">
            Ver Resposta
          </Button>
        )}
      </div>

      {/* Botões de respostas */}
      {mostrarVerso && (
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={() => responder('hard')} variant="outline" className="border-red-200 text-red-600">
            Difícil
          </Button>
          <Button onClick={() => responder('good')} variant="outline" className="border-blue-200 text-blue-600">
            Bom
          </Button>
          <Button onClick={() => responder('easy')} variant="outline" className="border-green-200 text-green-600">
            Fácil
          </Button>
        </div>
      )}
    </div>
  );
}