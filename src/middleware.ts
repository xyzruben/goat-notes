import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { generateRequestId } from '@/lib/logger'

export async function middleware(request: NextRequest) {
  // Generate unique request ID for tracing
  const requestId = request.headers.get('x-request-id') || generateRequestId();
  const response = await updateSession(request);

  // Add request ID to response headers for client-side correlation
  response.headers.set('x-request-id', requestId);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  const isAuthRoute = request.nextUrl.pathname==="/login" || request.nextUrl.pathname==="/sign-up";

  if (isAuthRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL),)
    }
  } 

  const {searchParams, pathname} = new URL(request.url)

  if (!searchParams.get("noteId") && pathname === "/") {
    const {
      data: {user},
    } = await supabase.auth.getUser();

    if (user) {
      const cookieHeader = request.headers.get('cookie') || '';

      const fetchNewestResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note`,
        {
          headers: {
            'cookie': cookieHeader,
          }
        }
      );

      const {newestNoteId} = await fetchNewestResponse.json();

      if (newestNoteId) {
        const url = request.nextUrl.clone();
        url.searchParams.set("noteId", newestNoteId);
        return NextResponse.redirect(url);
      } else {
        const createNoteResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note`,
          {
            method: "POST",
            headers:{
              "Content-Type":"application/json",
              'cookie': cookieHeader,
            }
          }
        );

        const {noteId} = await createNoteResponse.json();
        const url = request.nextUrl.clone();
        url.searchParams.set("noteId", noteId);
        return NextResponse.redirect(url);
      }
    }

  }

  return supabaseResponse;
}