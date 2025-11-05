import { useState } from "react";
import { Book } from "@/pages/Library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddBookFormProps {
  onSubmit: (book: Omit<Book, "id">) => void;
  onCancel: () => void;
  initialBook?: Book;
  isEditing?: boolean;
}

const categories = ["Fiction", "Non-fiction", "Science", "History", "Biography", "Children", "Technology"];
const coverColors = [
  "from-amber-500 to-orange-600",
  "from-red-500 to-red-700",
  "from-blue-500 to-blue-700",
  "from-purple-500 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-green-500 to-emerald-600",
  "from-pink-500 to-rose-600",
  "from-yellow-500 to-orange-600",
];

export default function AddBookForm({ onSubmit, onCancel, initialBook, isEditing }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: initialBook?.title || "",
    author: initialBook?.author || "",
    isbn: initialBook?.isbn || "",
    category: initialBook?.category || "Fiction",
    year: initialBook?.year || new Date().getFullYear(),
    copies: initialBook?.copies || 1,
    borrowed: initialBook?.borrowed || 0,
    description: initialBook?.description || "",
    coverColor: initialBook?.coverColor || coverColors[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.author.trim()) newErrors.author = "L'auteur est requis";
    if (!formData.isbn.trim()) newErrors.isbn = "L'ISBN est requis";
    if (formData.copies < 1) newErrors.copies = "Au moins 1 exemplaire requis";
    if (formData.borrowed > formData.copies) newErrors.borrowed = "Les emprunts ne peuvent pas dépasser le nombre d'exemplaires";
    if (formData.year < 1000 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = "L'année doit être valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "copies" || name === "borrowed" ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Titre du livre *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex: Le Seigneur des Anneaux"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      {/* Author */}
      <div className="space-y-2">
        <Label htmlFor="author">Auteur *</Label>
        <Input
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Ex: J.R.R. Tolkien"
          className={errors.author ? "border-red-500" : ""}
        />
        {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
      </div>

      {/* ISBN */}
      <div className="space-y-2">
        <Label htmlFor="isbn">ISBN *</Label>
        <Input
          id="isbn"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="Ex: 978-2253045199"
          className={errors.isbn ? "border-red-500" : ""}
        />
        {errors.isbn && <p className="text-sm text-red-500">{errors.isbn}</p>}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label htmlFor="year">Année de publication</Label>
        <Input
          id="year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          min="1000"
          max={new Date().getFullYear() + 1}
          className={errors.year ? "border-red-500" : ""}
        />
        {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
      </div>

      {/* Copies */}
      <div className="space-y-2">
        <Label htmlFor="copies">Nombre d'exemplaires *</Label>
        <Input
          id="copies"
          name="copies"
          type="number"
          value={formData.copies}
          onChange={handleChange}
          min="1"
          className={errors.copies ? "border-red-500" : ""}
        />
        {errors.copies && <p className="text-sm text-red-500">{errors.copies}</p>}
      </div>

      {/* Borrowed (only for editing) */}
      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="borrowed">Exemplaires empruntés</Label>
          <Input
            id="borrowed"
            name="borrowed"
            type="number"
            value={formData.borrowed}
            onChange={handleChange}
            min="0"
            max={formData.copies}
            className={errors.borrowed ? "border-red-500" : ""}
          />
          {errors.borrowed && <p className="text-sm text-red-500">{errors.borrowed}</p>}
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Décrivez brièvement le livre..."
          rows={3}
        />
      </div>

      {/* Cover Color */}
      <div className="space-y-2">
        <Label>Couleur de couverture</Label>
        <div className="grid grid-cols-4 gap-2">
          {coverColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, coverColor: color }))}
              className={`h-10 rounded-lg bg-gradient-to-br ${color} transition-all ${
                formData.coverColor === color ? "ring-2 ring-slate-900 ring-offset-2" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
          {isEditing ? "Mettre à jour" : "Ajouter le livre"}
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
