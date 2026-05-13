import { db } from "@/src/db/index";
import { cards } from "@/src/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import StudyView from "@/src/components/study-view";

export default async function EstudarPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const { id } = await params;
  const folderId = Number(id);

  if (!userId || isNaN(folderId)) return notFound();

  // Busca os cards 
  const cardsToStudy = await db.select().from(cards).where(
    and(
      eq(cards.folderId, folderId),
      eq(cards.userId, userId),
      lte(cards.nextReview, new Date()) 
    )
  );

  return <StudyView cards={cardsToStudy} folderId={folderId} />;
}