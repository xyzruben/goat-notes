# GOAT Notes 🐐📝

GOAT Notes is a modern, full-stack AI-powered note-taking app built from scratch using industry-standard tools. Designed as a production-ready portfolio project, it showcases authentication, database modeling, and clean UI design — all powered by scalable cloud technologies.

This project reflects my commitment to becoming a professional, with a strong focus on backend logic, authentication, and modern frontend architecture.

---

## ✨ Features

- 🔐 User authentication with Supabase
- 📦 PostgreSQL database using Prisma ORM
- 🧠 OpenAI-powered note interaction (coming soon)
- 🗂️ Relational schema (`User`, `Note`)
- 📁 Full CRUD for notes (secure and user-scoped)
- 💅 Modern UI with Tailwind CSS and shadcn/ui
- ⚙️ Type-safe development with TypeScript
- ☁️ Deployed on Vercel (coming soon)

---

## 🧰 Tech Stack

| Tool         | Purpose                            |
|--------------|------------------------------------|
| **Next.js 15**   | React framework (App Router)       |
| **TypeScript**   | Type-safe JavaScript              |
| **Supabase**     | Auth + PostgreSQL database        |
| **Prisma ORM**   | Schema modeling + migrations      |
| **Tailwind CSS** | Utility-first styling             |
| **shadcn/ui**    | Reusable, modern UI components    |
| **OpenAI API**   | AI-powered features (in progress) |
| **pnpm**         | Package manager                   |
| **Vercel**       | Deployment (coming soon)          |

---

## 🔒 Authentication

Supabase handles secure user signup, login, and session management. Prisma enforces row-level access so users can only read/write their own notes.

---

## 🧠 AI Integration (In Progress)

I'm integrating the OpenAI API to let users interact with their notes using natural language — enabling summarization, extraction, or even rewriting.

---

## 💻 Local Setup

Clone the repo and install dependencies:

```bash
git clone git@github.com:xyzruben/goat-notes.git
cd goat-notes
pnpm install
pnpm dev
