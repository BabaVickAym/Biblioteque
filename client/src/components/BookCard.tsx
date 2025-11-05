import { Book } from "@/pages/Library";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Download, RotateCcw } from "lucide-react";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

export default function BookCard({ book, onEdit, onDelete, onBorrow, onReturn }: BookCardProps) {
  const availableCopies = book.copies - book.borrowed;
  const borrowPercentage = (book.borrowed / book.copies) * 100;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      {/* Cover */}
      <div className={`h-40 bg-gradient-to-br ${book.coverColor} flex items-center justify-center`}>
        <div className="text-center text-white px-4">
          <div className="text-3xl font-bold mb-2">📚</div>
          <p className="text-sm font-semibold line-clamp-2">{book.title}</p>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
        <CardDescription className="text-sm">{book.author}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Catégorie:</span>
            <span className="font-medium text-slate-900">{book.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Année:</span>
            <span className="font-medium text-slate-900">{book.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Exemplaires:</span>
            <span className="font-medium text-slate-900">{book.copies}</span>
          </div>

          {/* Availability Bar */}
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">Disponibilité</span>
              <span className="text-xs font-bold text-slate-900">
                {availableCopies}/{book.copies}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{ width: `${borrowPercentage}%` }}
              />
            </div>
          </div>

          {/* Description */}
          {book.description && <p className="text-xs text-slate-500 italic mt-2">{book.description}</p>}
        </div>
      </CardContent>

      {/* Actions */}
      <div className="border-t border-slate-200 bg-slate-50 p-3">
        <div className="flex gap-2 mb-2">
          {availableCopies > 0 ? (
            <Button
              size="sm"
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => onBorrow(book.id)}
            >
              <Download className="h-4 w-4" />
              Emprunter
            </Button>
          ) : (
            <Button size="sm" disabled className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Indisponible
            </Button>
          )}

          {book.borrowed > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => onReturn(book.id)}
            >
              <RotateCcw className="h-4 w-4" />
              Retourner
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => onEdit(book)}
          >
            <Edit2 className="h-4 w-4" />
            Éditer
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 gap-2"
            onClick={() => onDelete(book.id)}
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>
    </Card>
  );
}
