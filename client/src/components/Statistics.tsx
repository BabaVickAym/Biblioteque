import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, CheckCircle } from "lucide-react";

interface StatisticsProps {
  totalBooks: number;
  totalBorrowed: number;
  availableBooks: number;
}

export default function Statistics({ totalBooks, totalBorrowed, availableBooks }: StatisticsProps) {
  const borrowPercentage = totalBooks > 0 ? Math.round((totalBorrowed / totalBooks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Total Books */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-900">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Total de livres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{totalBooks}</div>
          <p className="text-xs text-blue-700 mt-1">Exemplaires en collection</p>
        </CardContent>
      </Card>

      {/* Borrowed Books */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-orange-900">
            <Users className="h-5 w-5 text-orange-600" />
            Livres empruntés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-900">{totalBorrowed}</div>
          <div className="mt-2 h-2 bg-orange-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all"
              style={{ width: `${borrowPercentage}%` }}
            />
          </div>
          <p className="text-xs text-orange-700 mt-1">{borrowPercentage}% de la collection</p>
        </CardContent>
      </Card>

      {/* Available Books */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-900">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">{availableBooks}</div>
          <p className="text-xs text-green-700 mt-1">Prêts à être empruntés</p>
        </CardContent>
      </Card>
    </div>
  );
}
