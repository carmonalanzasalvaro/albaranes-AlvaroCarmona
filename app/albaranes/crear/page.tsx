"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

type FormData = {
  clientId: string;
  projectId: string;
  format: "material" | "hours";
  material: string;
  hours: number;
  description: string;
  workdate: string;
};

const CrearAlbaran: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    clientId: "",
    projectId: "",
    format: "material", // Por defecto "material"
    material: "",
    hours: 0,
    description: "",
    workdate: "",
  });

  // Función para obtener el valor de una cookie específica
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Maneja el cambio en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "hours" ? Number(value) : value, // Convertir a número si es `hours`
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

    const albaranData = {
      clientId: formData.clientId,
      projectId: formData.projectId,
      format: formData.format,
      material: formData.material,
      hours: formData.hours,
      description: formData.description,
      workdate: formData.workdate,
    };

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en las cabeceras
        },
        body: JSON.stringify(albaranData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el albarán");
      }

      // Confirmación en ventana emergente
      Swal.fire({
        title: "¡Albarán creado!",
        text: `El albarán se ha creado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      // Limpia el formulario después de la creación
      setFormData({
        clientId: "",
        projectId: "",
        format: "material",
        material: "",
        hours: 0,
        description: "",
        workdate: "",
      });
    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al crear el albarán.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">Crear un Albarán</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-lg bg-white p-8 shadow-md rounded-md"
      >
        <input
          type="text"
          name="clientId"
          placeholder="ID del cliente"
          value={formData.clientId}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="projectId"
          placeholder="ID del proyecto"
          value={formData.projectId}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <select
          name="format"
          value={formData.format}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        >
          <option value="material">Material</option>
          <option value="hours">Horas</option>
        </select>
        <input
          type="text"
          name="material"
          placeholder="Tipo de material (si aplica)"
          value={formData.material}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="number"
          name="hours"
          placeholder="Horas (si aplica)"
          value={formData.hours}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="date"
          name="workdate"
          placeholder="Fecha de trabajo"
          value={formData.workdate}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
        >
          Crear Albarán
        </button>
      </form>
      <Link className="hover:underline" href="/albaranes">
        Volver a la lista de albaranes
      </Link>
    </div>
  );
};

export default CrearAlbaran;
