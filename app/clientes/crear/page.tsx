"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function CrearCliente() {
  const [formData, setFormData] = useState({
    name: "",
    cif: "",
    street: "",
    number: "",
    postal: "",
    city: "",
    province: "",
  });

  // Función para obtener el valor de una cookie específica
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Maneja el cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getCookie("jwt"); // Recuperar el token de las cookies

    if (!token) {
      Swal.fire({
        title: "Error",
        text: "No se encontró un token de sesión. Inicia sesión nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const clientData = {
      name: formData.name,
      cif: formData.cif,
      address: {
        street: formData.street,
        number: Number(formData.number),
        postal: Number(formData.postal),
        city: formData.city,
        province: formData.province,
      },
    };

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en las cabeceras
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el cliente");
      }

      // Confirmación en ventana emergente
      Swal.fire({
        title: "¡Cliente creado!",
        text: `El cliente "${formData.name}" se ha creado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      // Limpia el formulario después de la creación
      setFormData({
        name: "",
        cif: "",
        street: "",
        number: "",
        postal: "",
        city: "",
        province: "",
      });
    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al crear el cliente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">Crear un Cliente</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-lg bg-white p-8 shadow-md rounded-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre del cliente"
          value={formData.name}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="cif"
          placeholder="CIF"
          value={formData.cif}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Calle"
          value={formData.street}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="number"
          name="number"
          placeholder="Número"
          value={formData.number}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="number"
          name="postal"
          placeholder="Código Postal"
          value={formData.postal}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          value={formData.city}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="province"
          placeholder="Provincia"
          value={formData.province}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
        >
          Crear Cliente
        </button>
      </form>
      {/* Botón para volver atrás */}
      <Link
        href="/clientes"
        className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
      >
        Volver a la Lista de Clientes
      </Link>
    </div>
  );
}
