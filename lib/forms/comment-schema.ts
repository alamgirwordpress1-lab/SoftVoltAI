import * as z from "./zod";

/**
 * A comment on a blog post. The same shape is checked in the browser, in the
 * route handler and again by WordPress, which is what decides whether it is
 * published or held for moderation.
 */
export const commentSchema = z.object({
  post: z.number().int().positive(),
  parent: z.number().int().nonnegative().optional(),
  name: z.string().trim().min(2, "Your name").max(80),
  email: z.string().trim().email("An email address that works").max(160),
  content: z.string().trim().min(2, "Write a little more than that").max(4000),
  // honeypot — humans never see it. A filled one is accepted here on purpose:
  // the route answers with a pretend success, so a bot never learns the name.
  website: z.string().max(200).optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;
