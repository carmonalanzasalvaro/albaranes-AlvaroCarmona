import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware principal
export function middleware(request: NextRequest) {
  // Obtén el token JWT de las cookies
  const jwt = request.cookies.get("jwt")?.value;

  // Si no hay token, redirige al login
  if (!jwt) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si el token existe, permite el acceso
  return NextResponse.next();
}

// Configuración del middleware para proteger rutas específicas
export const config = {
  matcher: ["/clientes", "/proyectos", "/albaranes", "/"], // Añade aquí todas las rutas protegidas
};
