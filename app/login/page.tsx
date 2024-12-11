"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/navigation';

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error en la autenticación");
      }

      const result = await response.json();

      // Manejo del token de sesión en cookies
      if (result?.token) {
        document.cookie = `jwt=${result.token}; path=/; max-age=3600; secure; samesite=strict;`;
        router.push('/');
      } else {
        throw new Error("No se recibió el token");
      }
    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="font-thin text-3xl mt-2 flex justify-center" >Login - Albaranes</h1>
      <form
        className="flex flex-col justify-center items-center gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="block px-4 py-2 mb-1"
          placeholder="Correo Electrónico"
          {...register("email", { required: true })}
        />

        <input
          className="block px-4 py-2 mb-1"
          placeholder="Contraseña"
          type="password"
          {...register("password", { required: true })}
        />

        <input className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all cursor-pointer" type="submit" />

        {errors.email && (
          <span className="block text-red-500">El correo es requerido</span>
        )}
        {errors.password && (
          <span className="block text-red-500">La contraseña es requerida</span>
        )}
      </form>

      <Link className="hover:underline" href="/register">
        ¿No tienes cuenta? Regístrate.
      </Link>
    </div>
  );
}
