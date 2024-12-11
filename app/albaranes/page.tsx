"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Button from "../components/Button";
import * as Iconos from "../components/Iconos";

type DeliveryNote = {
  _id: string; // ID del albarán
  clientId: string; // ID del cliente
  projectId: {
    name: string; // Nombre del proyecto
    projectCode: string; // Código del proyecto
  };
  hours: number; // Horas trabajadas (si aplica)
  description: string; // Descripción del albarán
  workdate: string; // Fecha de trabajo
};

const DeliveryNoteList: React.FC = () => {
  const [albaranes, setAlbaranes] = useState<DeliveryNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [filterProject, setFilterProject] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [filterHours, setFilterHours] = useState<number | "">("");

  // Función para obtener el valor de una cookie específica
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Función para obtener la lista de albaranes
  const fetchAlbaranes = async () => {
    const token = getCookie("jwt"); // Recuperar el token de las cookies

    if (!token) {
      console.error("No se encontró un token de sesión. Inicia sesión nuevamente.");
      setAlbaranes([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en las cabeceras
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los albaranes");
      }

      const data: DeliveryNote[] = await response.json();

      if (Array.isArray(data)) {
        setAlbaranes(data);
      } else {
        setAlbaranes([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlbaranes([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para descargar el PDF de un albarán
  const downloadPDF = async (id: string) => {
    const token = getCookie("jwt"); // Recuperar el token de las cookies

    if (!token) {
      console.error("No se encontró un token de sesión. Inicia sesión nuevamente.");
      return;
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en las cabeceras
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar el PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Albaran_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  };

  // Hook para cargar los albaranes al montar el componente
  useEffect(() => {
    fetchAlbaranes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrado de albaranes utilizando useMemo para optimización
  const filteredAlbaranes = useMemo(() => {
    return albaranes.filter((albaran) => {
      // Filtro por nombre del proyecto (case insensitive)
      const matchesProject = albaran.projectId.name
        .toLowerCase()
        .includes(filterProject.toLowerCase());

      // Filtro por fecha de inicio
      const albaranDate = new Date(albaran.workdate);
      const matchesStartDate = filterStartDate
        ? albaranDate >= new Date(filterStartDate)
        : true;

      // Filtro por fecha de fin
      const matchesEndDate = filterEndDate
        ? albaranDate <= new Date(filterEndDate)
        : true;

      // Filtro por horas trabajadas
      const matchesHours =
        filterHours !== "" ? albaran.hours === filterHours : true;

      return matchesProject && matchesStartDate && matchesEndDate && matchesHours;
    });
  }, [albaranes, filterProject, filterStartDate, filterEndDate, filterHours]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="font-thin text-3xl mt-2 flex justify-center">
        Lista de Albaranes
      </h1>

      {/* Sección de Filtros */}
      <section className="flex flex-col gap-4 w-full max-w-md">
        <h2 className="text-xl font-semibold">Filtros</h2>

        {/* Filtro por Nombre del Proyecto */}
        <div className="flex flex-col gap-2">
          <label htmlFor="project" className="font-medium">
            Proyecto:
          </label>
          <input
            type="text"
            id="project"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="p-2 border rounded"
            placeholder="Nombre del Proyecto"
          />
        </div>

        {/* Filtro por Fecha de Inicio */}
        <div className="flex flex-col gap-2">
          <label htmlFor="startDate" className="font-medium">
            Fecha de Inicio:
          </label>
          <input
            type="date"
            id="startDate"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        {/* Filtro por Fecha de Fin */}
        <div className="flex flex-col gap-2">
          <label htmlFor="endDate" className="font-medium">
            Fecha de Fin:
          </label>
          <input
            type="date"
            id="endDate"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        {/* Filtro por Horas Trabajadas */}
        <div className="flex flex-col gap-2">
          <label htmlFor="hours" className="font-medium">
            Horas Trabajadas:
          </label>
          <input
            type="number"
            id="hours"
            value={filterHours}
            onChange={(e) =>
              setFilterHours(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="p-2 border rounded"
            placeholder="Cantidad de Horas"
            min="0"
          />
        </div>

        {/* Botón para Resetear Filtros */}
        <Button
          CallbackOnClick={() => {
            setFilterProject("");
            setFilterStartDate("");
            setFilterEndDate("");
            setFilterHours("");
          }}
        >
          Resetear Filtros
        </Button>
      </section>

      {/* Sección de Acciones */}
      <section className="flex gap-4">
        <Link
          className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all"
          href="/albaranes/crear"
        >
          <Iconos.Plus />
        </Link>
        <Link
          className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all"
          href="/albaranes"
        >
          <Iconos.Reload />
        </Link>
      </section>

      {/* Lista de Albaranes Filtrados */}
      {loading ? (
        <h2 className="font-thin text-2xl mt-2 flex justify-center mb-10">
          Cargando albaranes...
        </h2>
      ) : filteredAlbaranes.length > 0 ? (
        <ul className="flex flex-col gap-2 w-full max-w-2xl">
          {filteredAlbaranes.map((albaran) => (
            <li
              key={albaran._id}
              className="flex flex-col gap-2 bg-gray-100 p-4 rounded-md shadow"
            >
              <p>
                <strong>Proyecto:</strong>{" "}
                {albaran.projectId?.name || "No disponible"}
              </p>
              <p>
                <strong>Número de Albarán:</strong> {albaran._id}
              </p>
              <p>
                <strong>Fecha de Trabajo:</strong>{" "}
                {new Date(albaran.workdate).toLocaleDateString()}
              </p>
              <p>
                <strong>Horas Trabajadas:</strong> {albaran.hours}
              </p>
              <Button CallbackOnClick={() => downloadPDF(albaran._id)}>
                Descargar PDF
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay albaranes que coincidan con los filtros.</p>
      )}
    </div>
  );
};

export default DeliveryNoteList;
