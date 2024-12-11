"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import * as Iconos from "../components/Iconos"; // Asegúrate de tener los iconos exportados aquí
import Swal from "sweetalert2";

type Proyecto = {
  _id: string;
  name: string;
  description: string;
};

const ProjectList: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [filterName, setFilterName] = useState<string>("");
  const [filterDescription, setFilterDescription] = useState<string>("");

  // Función para obtener el valor de una cookie específica
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Función para obtener la lista de proyectos
  const fetchProyectos = async () => {
    const token = getCookie("jwt"); // Recuperar el token de las cookies

    if (!token) {
      console.error("No se encontró un token de sesión. Inicia sesión nuevamente.");
      Swal.fire({
        title: "Error",
        text: "No se encontró un token de sesión. Inicia sesión nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setProyectos([]);
      setLoading(false);
      return;
    }

    // Construir los parámetros de consulta
    const params = new URLSearchParams();
    if (filterName) params.append("name", filterName);
    if (filterDescription) params.append("description", filterDescription);

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project?${params.toString()}`, {
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
        throw new Error("Error al obtener los proyectos");
      }

      const data: Proyecto[] = await response.json();

      if (Array.isArray(data)) {
        setProyectos(data);
      } else {
        setProyectos([]);
      }
    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al obtener los proyectos.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setProyectos([]);
      if (error.message.includes("Token inválido o expirado")) {
        // Redirigir al usuario al login si el token es inválido o ha expirado
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // Hook para cargar los proyectos al montar el componente y cuando cambian los filtros
  useEffect(() => {
    setLoading(true);
    fetchProyectos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName, filterDescription]);

  // Filtrado de proyectos utilizando useMemo para optimización
  const filteredProyectos = useMemo(() => {
    return proyectos.filter((proyecto) => {
      const matchesName = proyecto.name.toLowerCase().includes(filterName.toLowerCase());
      const matchesDescription = proyecto.description.toLowerCase().includes(filterDescription.toLowerCase());

      return matchesName && matchesDescription;
    });
  }, [proyectos, filterName, filterDescription]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="font-thin text-3xl mt-2 flex justify-center">
        Lista de Proyectos - Albaranes
      </h1>

      {/* Sección de Filtros */}
      <section className="flex flex-col gap-4 w-full max-w-md">
        <h2 className="text-xl font-semibold">Filtros</h2>

        {/* Filtro por Nombre */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-medium">
            Nombre:
          </label>
          <input
            type="text"
            id="name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="p-2 border rounded"
            placeholder="Nombre del Proyecto"
          />
        </div>

        {/* Filtro por Descripción */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-medium">
            Descripción:
          </label>
          <input
            type="text"
            id="description"
            value={filterDescription}
            onChange={(e) => setFilterDescription(e.target.value)}
            className="p-2 border rounded"
            placeholder="Descripción del Proyecto"
          />
        </div>

        {/* Botón para Resetear Filtros */}
        <button
          onClick={() => {
            setFilterName("");
            setFilterDescription("");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Resetear Filtros
        </button>
      </section>

      {/* Sección de Acciones */}
      <section className="flex gap-4">
        <Link
          className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all flex items-center justify-center gap-2"
          href="/proyectos/crear"
        >
          <Iconos.Plus />
        </Link>
        <button
          onClick={fetchProyectos}
          className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all flex items-center justify-center gap-2"
        >
          <Iconos.Reload />
        </button>
      </section>

      {/* Lista de Proyectos Filtrados */}
      {loading ? (
        <h2 className="font-thin text-2xl mt-2 flex justify-center mb-10">
          Cargando proyectos...
        </h2>
      ) : filteredProyectos.length > 0 ? (
        <ul className="flex flex-col gap-2 w-full max-w-2xl">
          {filteredProyectos.map((proyecto) => (
            <li
              key={proyecto._id}
              className="flex gap-2 justify-center items-center"
            >
              <Link
                href={`/proyectos/${proyecto._id}`}
                className="hover:scale-105 transition-all bg-orange-200 px-4 py-2 rounded w-48 text-center flex items-center justify-center"
              >
                {proyecto.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay proyectos que coincidan con los filtros.</p>
      )}
    </div>
  );
};

export default ProjectList;
