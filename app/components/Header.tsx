"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as Iconos from "./Iconos";
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Estado para la autenticación

  // Función para obtener el valor de una cookie específica
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null; // Asegura que solo se ejecute en el cliente

    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Función para eliminar una cookie específica
  const deleteCookie = (name: string): void => {
    if (typeof document === "undefined") return;

    document.cookie = `${name}=; Max-Age=0; path=/; secure; samesite=strict`;
  };

  // Verificar el estado de autenticación al cargar el componente
  useEffect(() => {
    const jwt = getCookie("jwt"); // Verificar si existe el token en las cookies
    setIsLoggedIn(!!jwt); // Actualizar el estado basado en el token
  }, []);

  // Manejar el cierre de sesión
  const handleLogout = (): void => {
    // Cerrar sesión eliminando la cookie 'jwt'
    deleteCookie("jwt");
    setIsLoggedIn(false);

    // Redirigir al usuario a /login después de cerrar sesión
    router.push('/login');
  };

  return (
    <header className="bg-gray-200 text-gray-800 p-4 flex justify-between items-center">
        
      <nav className="flex gap-6 text-2xl">
        <Link href="/" className="hover:underline"> Home </Link>
        <Link href="/clientes" className="hover:underline hidden md:block"> Clientes </Link>
        <Link href="/proyectos" className="hover:underline hidden md:block"> Proyectos </Link>
        <Link href="/albaranes" className="hover:underline hidden md:block"> Albaranes </Link>
      </nav>

      {isLoggedIn && ( <button onClick={handleLogout} className="bg-orange-300 px-2 py-1 rounded hover:bg-orange-400 transition"> <Iconos.LogOut/> </button> )}

    </header>
  );
};

export default Header;
