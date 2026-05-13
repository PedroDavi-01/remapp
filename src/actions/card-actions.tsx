'use server'

import { db } from "@/src/db/index";
import { cards } from "@/src/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

// Criação de Card
export async function createCard(formData: FormData) {
  const { userId } = await auth();
  
  // Dados do forms
  const folderId = Number(formData.get('folderId'));
  const front = formData.get('front') as string;
  const back = formData.get('back') as string;

  if (!userId || !folderId || !front || !back) {
    console.error("Dados insuficientes para criar o card");
    return;
  }

  await db.insert(cards).values({
    userId,
    folderId,
    front,
    back,
    nextReview: new Date(), 
    interval: 0,
    easeFactor: 250, 
  });

  revalidatePath('/home');
  revalidatePath(`/pastas/${folderId}`);
}

// Deletar Card
export async function deleteCard(cardId: number, folderId: number) {
  const { userId } = await auth();

  if (!userId) return;

  await db.delete(cards).where(
    and(
      eq(cards.id, cardId),
      eq(cards.userId, userId)
    )
  );

  revalidatePath(`/pastas/${folderId}`);
}

// Editar Card
export async function editCard(formData: FormData) {
  const { userId } = await auth();
  const cardId = Number(formData.get('cardId'));
  const folderId = Number(formData.get('folderId'));
  const front = formData.get('front') as string;
  const back = formData.get('back') as string;

  if (!userId || !cardId) return;

  await db.update(cards)
    .set({ front, back })
    .where(
      and(
        eq(cards.id, cardId),
        eq(cards.userId, userId)
      )
    );

  revalidatePath(`/pastas/${folderId}`);
}

// src/actions/card-actions.ts

export async function reviewCard(
  cardId: number, 
  folderId: number, 
  rating: 'easy' | 'good' | 'hard'
) {
  const { userId } = await auth();
  if (!userId) return;

  const hoje = new Date();
  let proximaRevisao = new Date();

  // Lógica de Repetição Espaçada Simples
  if (rating === 'easy') {
    // Fácil: Soma 4 dias à data atual
    proximaRevisao.setDate(hoje.getDate() + 4);
  } else if (rating === 'good') {
    // Bom: Soma 1 dia 
    proximaRevisao.setDate(hoje.getDate() + 1);
  } else {
    // Difícil: Mantém a data como "agora" para aparecer de novo na sessão
    proximaRevisao = hoje;
  }

  // Atualiza o card no banco de dados
  await db.update(cards)
    .set({ 
      nextReview: proximaRevisao 
    })
    .where(
      and(
        eq(cards.id, cardId),
        eq(cards.userId, userId)
      )
    );

  revalidatePath(`/pastas/${folderId}`);
  revalidatePath(`/pastas/${folderId}/estudar`);
}