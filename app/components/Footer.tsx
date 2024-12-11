import * as Iconos from "./Iconos";

export default function Footer() {
    return (
      <footer className="bg-gray-200 text-gray-800 py-6 flex flex-col justify-center items-center gap-4">
        
        <section className="flex gap-2">
          <a href="https://www.facebook.com" target="_blank"  className="text-orange-300 hover:text-orange-400 transition"> <Iconos.Facebook/> </a>
          <a href="https://www.twitter.com" target="_blank" className="text-orange-300 hover:text-orange-400 transition"> <Iconos.Twitter/> </a>
          <a href="https://www.linkedin.com" target="_blank" className="text-orange-300 hover:text-orange-400 transition"> <Iconos.LinkedIn/> </a>
        </section>

        <section>
          <p className="text-center text-gray-600"> Álvaro Carmona Lanzas. </p>
        </section>

      </footer>
    );
  }
  