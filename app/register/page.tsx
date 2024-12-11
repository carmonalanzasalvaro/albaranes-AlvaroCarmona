"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import React from "react";

type Inputs = {
  email: string;
  password: string;
};

const Register: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  // Función para establecer una cookie
  const setCookie = (name: string, value: string, days: number): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(
      value
    )};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  };

  // Función para obtener el valor de una cookie específica
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Función para mostrar el pop-up de validación
  const mostrarPopUpValidacion = async (): Promise<void> => {
    const jwt = getCookie("jwt"); // Obtener el token desde las cookies

    if (!jwt) {
      Swal.fire("Error", "No se encontró un token de sesión válido.", "error");
      return;
    }

    const { value: codigo, isConfirmed } = await Swal.fire({
      title: "Código de Verificación",
      text: "Por favor, introduce el código enviado a tu correo electrónico.",
      input: "text",
      inputPlaceholder: "Código de validación",
      showCancelButton: true,
      confirmButtonText: "Validar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "¡El código no puede estar vacío!";
        }
      },
    });

    if (isConfirmed && codigo) {
      validarCodigo(codigo, jwt);
    }
  };

  // Validación del código con el servidor
  const validarCodigo = async (codigo: string, token: string): Promise<void> => {
    try {
      const response = await fetch(
        "https://bildy-rpmaya.koyeb.app/api/user/validation",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Añade el token en las cabeceras
          },
          body: JSON.stringify({ code: codigo }), // Enviamos el código en el cuerpo
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire("¡Éxito!", "Tu cuenta ha sido validada.", "success");
        router.push("/"); // Redirige a la página principal u otra ruta
      } else {
        Swal.fire(
          "Error",
          data.message || "El código ingresado es incorrecto.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Hubo un problema al validar el código.", "error");
    }
  };

  // Manejo del formulario de registro
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch(
        "https://bildy-rpmaya.koyeb.app/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error en el registro"
        );
      }

      const result = await response.json();

      // Manejo del token de sesión usando cookies en lugar de localStorage
      if (result?.token) {
        setCookie("jwt", result.token, 1); // Guarda el token en una cookie por 1 día
        mostrarPopUpValidacion(); // Llama al pop-up para validar la cuenta
      } else {
        throw new Error("No se recibió el token");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al registrarse", "error");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="font-thin text-3xl mt-2 flex justify-center">
        Registro - Albaranes
      </h1>
      <form
        className="flex flex-col justify-center items-center gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="block px-4 py-2 mb-1"
          placeholder="Correo Electrónico"
          {...register("email", { required: true })}
          type="email"
        />

        <input
          className="block px-4 py-2 mb-1"
          placeholder="Contraseña"
          type="password"
          {...register("password", { required: true })}
        />

        <input
          className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all cursor-pointer"
          type="submit"
          value="Registrarse"
        />

        {errors.email && (
          <span className="block text-red-500">El correo es requerido</span>
        )}
        {errors.password && (
          <span className="block text-red-500">
            La contraseña es requerida
          </span>
        )}
      </form>

      <Link className="hover:underline" href="/login">
        ¿Ya tienes cuenta? Inicia sesión.
      </Link>
    </div>
  );
};

export default Register;
