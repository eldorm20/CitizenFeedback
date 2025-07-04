import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"), // user, government, admin
  district: text("district"), // For government users
  department: text("department"), // For government users
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  district: text("district").notNull(),
  status: text("status").default("new"), // new, in_progress, resolved, rejected
  type: text("type").default("complaint"), // complaint, initiative
  imageUrl: text("image_url"),
  videoUrl: text("video_url"), // Support for video uploads
  mediaUrls: text("media_urls").array(), // Multiple media files
  location: jsonb("location"), // {lat: number, lng: number, address: string}
  authorId: integer("author_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  likes: integer("likes").default(0),
  votes: integer("votes").default(0), // For initiatives voting
  views: integer("views").default(0),
  priority: text("priority").default("medium"), // low, medium, high, urgent
  tags: text("tags").array(), // Searchable tags
  assignedAgency: text("assigned_agency"), // автоматически назначенное ведомство
  agencyContact: text("agency_contact"), // контакт ответственного
  officialResponse: text("official_response"), // официальный ответ власти
  responseDate: timestamp("response_date"), // дата ответа
  internalId: text("internal_id"), // внутренний номер в ведомстве
  estimatedResolution: timestamp("estimated_resolution"), // планируемая дата решения
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  authorId: integer("author_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserPost: unique().on(table.userId, table.postId),
}));

export const commentLikes = pgTable("comment_likes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").references(() => comments.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserComment: unique().on(table.userId, table.commentId),
}));

export const postVotes = pgTable("post_votes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  voteType: text("vote_type").notNull(), // upvote, downvote
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserPostVote: unique().on(table.userId, table.postId),
}));

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  postLikes: many(postLikes),
  commentLikes: many(commentLikes),
  postVotes: many(postVotes),
  notifications: many(notifications),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  postLikes: many(postLikes),
  postVotes: many(postVotes),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  commentLikes: many(commentLikes),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
}));

export const postVotesRelations = relations(postVotes, ({ one }) => ({
  post: one(posts, {
    fields: [postVotes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postVotes.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [notifications.postId],
    references: [posts.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  role: true,
  district: true,
  department: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must not exceed 20 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["user", "government", "admin"]).default("user"),
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  authorId: true,
  likes: true,
  views: true,
  votes: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  district: z.string().min(1, "District is required"),
  type: z.enum(["complaint", "initiative"]).default("complaint"),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  authorId: true,
  likes: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type PostLike = typeof postLikes.$inferSelect;
export type CommentLike = typeof commentLikes.$inferSelect;
export type PostVote = typeof postVotes.$inferSelect;

// Extended types with relations
export type PostWithAuthor = Post & {
  author: User;
  comments: (Comment & { author: User })[];
  isLiked?: boolean;
  userVote?: 'upvote' | 'downvote' | null;
  votesCount?: number;
};

export type CommentWithAuthor = Comment & {
  author: User;
  isLiked?: boolean;
};

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
