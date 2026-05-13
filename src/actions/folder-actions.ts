'use server'

import { db } from "@/src/db/index";
import { folders } from "@/src/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

// Criar Pasta
export async function createFolder(formData: FormData) {
  const { userId } = await auth();
  const name = formData.get('name') as string;

  // Validações insanas
  if (!userId || !name) {
    console.error("Erro: Usuário não logado ou nome da pasta vazio.");
    return;
  }

  await db.insert(folders).values({
    name: name,
    userId: userId,
  });

  revalidatePath('/pastas');
}

// Edit de pasta
export async function editFolder(formData: FormData) {
  const { userId } = await auth();
  const folderId = Number(formData.get('folderId'));
  const newName = formData.get('name') as string;

  if (!userId || !newName || !folderId) return;

  await db.update(folders)
    .set({ name: newName })
    .where(
      and(
        eq(folders.id, folderId),
        eq(folders.userId, userId) 
      )
    );

  revalidatePath('/pastas');
}

// Action de deletar
export async function deleteFolder(folderId: number) {
  const { userId } = await auth();

  if (!userId) return;

  await db.delete(folders)
    .where(
      and(
        eq(folders.id, folderId),
        eq(folders.userId, userId)
      )
    );

  revalidatePath('/pastas');
}