import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Bibliothèque</h1>
            <p className="text-xs text-slate-500">Système de Gestion</p>
          </div>
        </div>
        <nav className="hidden gap-6 md:flex">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Accueil
          </a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Catégories
          </a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Emprunts
          </a>
        </nav>
      </div>
    </header>
  );
}
