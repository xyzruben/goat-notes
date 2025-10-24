import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/auth/server";
import { ratelimit, getClientIp } from "@/lib/ratelimit";
import { validateCORS, addCORSHeaders } from "@/lib/cors";

export async function GET(request: NextRequest) {
    // CORS validation
    const corsError = validateCORS(request);
    if (corsError) return corsError;

    // Rate limiting check
    const ip = getClientIp(request);
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

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

    const response = NextResponse.json({
        newestNoteId: newestNoteId?.id,
    });

    return addCORSHeaders(response, request);
}