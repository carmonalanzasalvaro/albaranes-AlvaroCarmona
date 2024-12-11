"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Cliente = {
  _id: string;
  name: string;
  cif: string;
  address: {
    street: string;
    number: number;
    postal: number;
    city: string;
    province: string;
  };
};

const ClienteDetail: React.FC = () => {
  const { id } = useParams(); // Obtener el ID dinámico de la URL
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Función para obtener el valor de una cookie específica
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Función para obtener la lista de clientes
  const fetchCliente = async () => {
    const token = getCookie("jwt"); // Recuperar el token de las cookies

    if (!token) {
      console.error("No se encontró un token de sesión. Inicia sesión nuevamente.");
      Swal.fire({
        title: "Error",
        text: "No se encontró un token de sesión. Inicia sesión nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setCliente(null);
      setLoading(false);
      router.push("/login"); // Redirigir al usuario al login
      return;
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
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
        throw new Error("Error al obtener el cliente");
      }

      const data: Cliente = await response.json();
      setCliente(data);
    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al obtener el cliente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setCliente(null);
      if (error.message.includes("Token inválido o expirado")) {
        router.push("/login"); // Redirigir al usuario al login
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCliente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Detalle del Cliente</h1>
      {loading ? (
        <p>Cargando cliente...</p>
      ) : cliente ? (
        <div className="bg-white p-6 rounded shadow">
          <p><strong>Nombre:</strong> {cliente.name}</p>
          <p><strong>CIF:</strong> {cliente.cif}</p>
          <p>
            <strong>Dirección:</strong> {cliente.address.street}, {cliente.address.number}, {cliente.address.postal}, {cliente.address.city}, {cliente.address.province}
          </p>
        </div>
      ) : (
        <p>No se encontró el cliente.</p>
      )}
    </div>
  );
};

export default ClienteDetail;
