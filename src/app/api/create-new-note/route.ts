import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/auth/server";

export async function POST() {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const {id} = await prisma.note.create({
        data: {
            authorId: user.id,
            text: ""
        }
    })

    return NextResponse.json({
        noteId: id
    });
}