import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/auth/server";

export async function GET() {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const newestNoteId = await prisma.note.findFirst({
        where: {
            authorId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
        },
    });

    return NextResponse.json({
        newestNoteId: newestNoteId?.id,
    });
}