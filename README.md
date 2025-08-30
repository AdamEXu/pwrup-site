# Pwrup Blog

Blog platform built with [Astro](https://astro.build/), [Clerk](https://clerk.dev) for auth, [Upstash Redis](https://upstash.com) for storage and [Cloudflare R2](https://www.cloudflare.com/products/r2/) for image hosting.

## Getting started

```bash
pnpm install
cp .env.example .env # fill in secrets
pnpm dev
```

## Environment variables

See `.env.example` for all required variables:

- `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` – Clerk keys.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` – Upstash REST credentials.
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_BASE_URL` – Cloudflare R2 configuration.
- `SITE_URL`, `DEFAULT_OG_IMAGE` – site metadata.
- `SEED_ADMIN_EMAILS` – optional comma separated admin emails to seed.

## KV Schema

Posts and indexes are stored in Upstash using the following keys:

| Key | Type | Description |
| --- | ---- | ----------- |
| `post:<id>` | JSON | full post record |
| `post:slug:<slug>` | string | maps slug to post id |
| `zidx:posts:published` | ZSET | post ids scored by `publishedAt` |
| `zidx:posts:draft` | ZSET | post ids scored by `updatedAt` |
| `sidx:tag:<tag>` | SET | post ids for a given tag |
| `sidx:author:<authorId>` | SET | post ids by author |
| `sidx:month:<YYYY-MM>` | SET | archive index for month |
| `author:<clerkUserId>` | JSON | cached author profile |
| `author:byEmail:<email>` | string | lookup from email to author id |
| `s:admins:emails` | SET | lower–cased admin email allow‑list |

The `post` record contains fields such as `id`, `slug`, `status`, `title`, `description`, `tags`, `author`, `headerImage`, `content` and timestamps. Secondary indexes must be kept in sync whenever a post is created, updated or deleted.

## Scripts

- `pnpm dev` – start the development server.
- `pnpm build` – build the site for production.
- `pnpm preview` – preview a production build.


## Notes

Run `pnpm install` after pulling changes to install new dependencies before building.
