import { clerkMiddleware } from '@clerk/nextjs/server'

// Landing page - semua route public, Clerk hanya untuk display state jika needed
export default clerkMiddleware(async (_auth, _req) => {
  // Tidak ada route yang di-protect - semua public
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}