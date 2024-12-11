import Link from "next/link";
import * as Iconos from './components/Iconos';

export default function Home() {

  return (
    <div className="">
      <h1 className="font-thin text-3xl mt-2 flex justify-center mb-10" >Home - Albaranes</h1>
      <section className="flex flex-col gap-6 text-center justify-center items-center">
        <article className="flex gap-8 justify-center items-center flex-col sm:flex-row" >
          <Link className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all flex gap-4 w-36" href="/clientes"> <Iconos.Clientes/> <p>Clientes</p> </Link>
          <p className="text-wrap max-w-52 text-left hidden sm:block">Gestiona la información de los clientes, actualiza sus datos y realiza un seguimiento de sus actividades.</p>
        </article>

        <article className="flex gap-8 justify-center items-center flex-col sm:flex-row" >
          <Link className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all flex gap-4 w-36" href="/proyectos "> <Iconos.Proyectos/> <p>Proyectos</p> </Link>
          <p className="text-wrap max-w-52 text-left hidden sm:block">Planifica y supervisa los proyectos, asigna tareas al equipo y monitorea el progreso en tiempo real.</p>
        </article>

        <article className="flex gap-8 justify-center items-center flex-col sm:flex-row" >
          <Link className="bg-orange-300 px-4 py-2 rounded-lg hover:scale-110 transition-all flex gap-4 w-36" href="/albaranes"> <Iconos.Albaranes/> <p>Albaranes</p> </Link>
          <p className="text-wrap max-w-52 text-left hidden sm:block">Crea y administra los albaranes, organiza las entregas y lleva un control detallado de cada transacción.</p>
        </article>
      </section>
    </div>
  );
}
