import Head from "next/head";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <>
      <Head>
        <title>Accès non autorisé</title>
        <meta name="description" content="Erreur 403 - Accès non autorisé" />
      </Head>

      <div className="min-h-screen bg-red-700 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center z-10">
          <h1 className="text-9xl font-bold text-white drop-shadow-lg">403</h1>
          <p className="text-2xl mt-6 text-white drop-shadow-lg text-center">
            Accès non autorisé
          </p>
          <p className="text-lg mt-2 text-white/90 drop-shadow-lg text-center max-w-md">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>

          <div className="mt-10">
            <Link
              href="/dashboard"
              className="px-8 py-4 font-bold bg-black text-white rounded-full transition-colors hover:bg-gray-800"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}