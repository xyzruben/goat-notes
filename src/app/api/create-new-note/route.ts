import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/auth/server";
import { ratelimit, getClientIp } from "@/lib/ratelimit";
import { validateCORS, addCORSHeaders } from "@/lib/cors";

export async function POST(request: NextRequest) {
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

    const {id} = await prisma.note.create({
        data: {
            authorId: user.id,
            text: ""
        }
    })

    const response = NextResponse.json({
        noteId: id
    });

    return addCORSHeaders(response, request);
}