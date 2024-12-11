"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Button from "../components/Button"; // Asegúrate de tener este componente
import * as Iconos from "../components/Iconos";

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

const ClientList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [filterName, setFilterName] = useState<string>("");
  const [filterCIF, setFilterCIF] = useState<string>("");
  const [filterCity, setFilterCity] = useState<string>("");
  const [filterProvince, setFilterProvince] = useState<string>("");

  // Función para obtener el valor de una cookie específica
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Función para obtener la lista de clientes
  const fetchClientes = async () => {
    const token = getCookie("jwt"); // Recuperar el token de las cookies

    if (!token) {
      console.error("No se encontró un token de sesión. Inicia sesión nuevamente.");
      setClientes([]);
      setLoading(false);
      return;
    }

    // Construir los parámetros de consulta
    const params = new URLSearchParams();
    if (filterName) params.append("name", filterName);
    if (filterCIF) params.append("cif", filterCIF);
    if (filterCity) params.append("city", filterCity);
    if (filterProvince) params.append("province", filterProvince);

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en las cabeceras
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los clientes");
      }

      const data: Cliente[] = await response.json();

      if (Array.isArray(data)) {
        setClientes(data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  // Hook para cargar los clientes al montar el componente y cuando cambian los filtros
  useEffect(() => {
    setLoading(true);
    fetchClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName, filterCIF, filterCity, filterProvince]);

  // Filtrado de clientes utilizando useMemo para optimización
  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesName = cliente.name.toLowerCase().includes(filterName.toLowerCase());
      const matchesCIF = cliente.cif.toLowerCase().includes(filterCIF.toLowerCase());
      const matchesCity = cliente.address.city.toLowerCase().includes(filterCity.toLowerCase());
      const matchesProvince = cliente.address.province.toLowerCase().includes(filterProvince.toLowerCase());

      return matchesName && matchesCIF && matchesCity && matchesProvince;
    });
  }, [clientes, filterName, filterCIF, filterCity, filterProvince]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="font-thin text-3xl mt-2 flex justify-center">
        Lista de Clientes - Albaranes
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
            placeholder="Nombre del Cliente"
          />
        </div>

        {/* Filtro por CIF */}
        <div className="flex flex-col gap-2">
          <label htmlFor="cif" className="font-medium">
            CIF:
          </label>
          <input
            type="text"
            id="cif"
            value={filterCIF}
            onChange={(e) => setFilterCIF(e.target.value)}
            className="p-2 border rounded"
            placeholder="CIF del Cliente"
          />
        </div>

        {/* Filtro por Ciudad */}
        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="font-medium">
            Ciudad:
          </label>
          <input
            type="text"
            id="city"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="p-2 border rounded"
            placeholder="Ciudad del Cliente"
          />
        </div>

        {/* Filtro por Provincia */}
        <div className="flex flex-col gap-2">
          <label htmlFor="province" className="font-medium">
            Provincia:
          </label>
          <input
            type="text"
            id="province"
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
            className="p-2 border rounded"
            placeholder="Provincia del Cliente"
          />
        </div>

        {/* Botón para Resetear Filtros */}
        <Button
          CallbackOnClick={() => {
            setFilterName("");
            setFilterCIF("");
            setFilterCity("");
            setFilterProvince("");
          }}
        >
          Resetear Filtros
        </Button>
      </section>

      {/* Sección de Acciones */}
      <section className="flex gap-4">
        <Link
          className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all flex items-center justify-center"
          href="/clientes/crear"
        >
          <Iconos.Plus />
        </Link>
        <Link
          className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all flex items-center justify-center"
          href="/clientes"
        >
          <Iconos.Reload />
        </Link>
      </section>

      {/* Lista de Clientes Filtrados */}
      {loading ? (
        <h2 className="font-thin text-2xl mt-2 flex justify-center mb-10">
          Cargando clientes...
        </h2>
      ) : filteredClientes.length > 0 ? (
        <ul className="flex flex-col gap-2 w-full max-w-2xl">
          {filteredClientes.map((cliente) => (
            <li
              key={cliente._id}
              className="flex gap-2 justify-center items-center"
            >
              <Link
                href={`/clientes/${cliente._id}`}
                className="hover:scale-105 transition-all bg-orange-200 px-4 py-2 rounded w-48 text-center flex items-center justify-center gap-2"
              >
                {cliente.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay clientes que coincidan con los filtros.</p>
      )}
    </div>
  );
};

export default ClientList;
