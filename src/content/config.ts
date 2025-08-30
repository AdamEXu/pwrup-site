import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.date(),
    author: z.object({
      name: z.string(),
      avatar: z.string().url().optional()
    }).optional(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = { blog };
