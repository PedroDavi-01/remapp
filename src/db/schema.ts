import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabela de Pastas (os meus decks)
export const folders = pgTable('folders', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  userId: text('user_id').notNull(), // aqui vem do Clerk
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabela de Cards
export const cards = pgTable('cards', {
  id: serial('id').primaryKey(),
  folderId: integer('folder_id').references(() => folders.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  
  // Conteúdo
  front: text('front').notNull(),
  back: text('back').notNull(),

  // Lógica de Revisão Espaçada 
  nextReview: timestamp('next_review').defaultNow(), // Quando estudar de novo
  interval: integer('interval').default(0),          // Dias de intervalo atual
  easeFactor: integer('ease_factor').default(250),   // O quão fácil é o card (
  
  // Desempenho
  hits: integer('hits').default(0),  
  misses: integer('misses').default(0),
});

// Relações 
export const folderRelations = relations(folders, ({ many }) => ({
  cards: many(cards),
})); // Uma pasta tem varios  cards, etc

export const cardRelations = relations(cards, ({ one }) => ({
  folder: one(folders, {
    fields: [cards.folderId],
    references: [folders.id],
  }),
}));