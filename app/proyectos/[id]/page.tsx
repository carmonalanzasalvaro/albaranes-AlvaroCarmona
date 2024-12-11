"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Proyecto = {
  _id: string;
  name: string;
  projectCode: string;
  email: string;
  address?: {
    street: string;
    number: number;
    postal: number;
    city: string;
    province: string;
  };
  code: string;
  clientId: string;
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams(); // Obtener el ID dinámico de la URL
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Función para obtener el valor de una cookie específica
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Función para obtener los detalles del proyecto
  const fetchProyecto = async () => {
    const token = getCookie("jwt"); // Recuperar el token de las cookies

    if (!token) {
      console.error("No se encontró un token de sesión. Inicia sesión nuevamente.");
      Swal.fire({
        title: "Error",
        text: "No se encontró un token de sesión. Inicia sesión nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setProyecto(null);
      setLoading(false);
      router.push("/login"); // Redirigir al usuario al login
      return;
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en las cabeceras
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token inválido o expirado
          throw new Error("Token inválido o expirado. Por favor, inicia sesión nuevamente.");
        }
        throw new Error("Error al obtener el proyecto");
      }

      const data: Proyecto = await response.json();
      setProyecto(data);
    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al obtener el proyecto.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setProyecto(null);
      if (error.message.includes("Token inválido o expirado")) {
        router.push("/login"); // Redirigir al usuario al login
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProyecto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Detalle del Proyecto</h1>
      {loading ? (
        <p>Cargando proyecto...</p>
      ) : proyecto ? (
        <div className="bg-white p-6 rounded shadow">
          <p><strong>Nombre:</strong> {proyecto.name}</p>
          <p><strong>Código del Proyecto:</strong> {proyecto.projectCode}</p>
          <p><strong>Email:</strong> {proyecto.email}</p>
          <p><strong>Código Interno:</strong> {proyecto.code}</p>
          <p><strong>ID del Cliente:</strong> {proyecto.clientId}</p>
          {proyecto.address ? (
            <p>
              <strong>Dirección:</strong> {proyecto.address.street}, {proyecto.address.number}, {proyecto.address.postal}, {proyecto.address.city}, {proyecto.address.province}
            </p>
          ) : (
            <p><strong>Dirección:</strong> No disponible</p>
          )}
        </div>
      ) : (
        <p>No se encontró el proyecto.</p>
      )}
    </div>
  );
};

export default ProjectDetail;
