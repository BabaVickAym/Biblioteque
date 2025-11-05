import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, Edit2, Trash2, BookOpen, Users, BarChart3, X } from "lucide-react";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import AddBookForm from "@/components/AddBookForm";
import Statistics from "@/components/Statistics";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  year: number;
  copies: number;
  borrowed: number;
  description: string;
  coverColor: string;
}

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const categories = ["Fiction", "Non-fiction", "Science", "History", "Biography", "Children", "Technology"];

  // Load books from localStorage
  useEffect(() => {
    const savedBooks = localStorage.getItem("libraryBooks");
    if (savedBooks) {
      try {
        const parsedBooks = JSON.parse(savedBooks);
        setBooks(parsedBooks);
      } catch (error) {
        console.error("Error loading books:", error);
        // Initialize with sample data if localStorage is empty
        initializeSampleBooks();
      }
    } else {
      initializeSampleBooks();
    }
  }, []);

  // Filter books based on search and category
  useEffect(() => {
    let filtered = books;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.isbn.toLowerCase().includes(term)
      );
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory]);

  // Save books to localStorage
  useEffect(() => {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }, [books]);

  const initializeSampleBooks = () => {
    const sampleBooks: Book[] = [
      {
        id: "1",
        title: "Le Seigneur des Anneaux",
        author: "J.R.R. Tolkien",
        isbn: "978-2253045199",
        category: "Fiction",
        year: 1954,
        copies: 3,
        borrowed: 1,
        description: "Une épopée fantastique incontournable",
        coverColor: "from-amber-500 to-orange-600",
      },
      {
        id: "2",
        title: "1984",
        author: "George Orwell",
        isbn: "978-2070360857",
        category: "Fiction",
        year: 1949,
        copies: 2,
        borrowed: 0,
        description: "Un roman dystopique sur un régime totalitaire",
        coverColor: "from-red-500 to-red-700",
      },
      {
        id: "3",
        title: "Sapiens",
        author: "Yuval Noah Harari",
        isbn: "978-2226257017",
        category: "Non-fiction",
        year: 2011,
        copies: 4,
        borrowed: 2,
        description: "Une histoire brève de l'humanité",
        coverColor: "from-blue-500 to-blue-700",
      },
      {
        id: "4",
        title: "Le Monde de Sophie",
        author: "Jostein Gaarder",
        isbn: "978-2253048756",
        category: "Fiction",
        year: 1991,
        copies: 2,
        borrowed: 1,
        description: "Un roman philosophique captivant",
        coverColor: "from-purple-500 to-indigo-600",
      },
      {
        id: "5",
        title: "Cosmos",
        author: "Carl Sagan",
        isbn: "978-2253048763",
        category: "Science",
        year: 1980,
        copies: 1,
        borrowed: 0,
        description: "Un voyage à travers l'univers",
        coverColor: "from-cyan-500 to-blue-600",
      },
    ];
    setBooks(sampleBooks);
  };

  const addBook = (newBook: Omit<Book, "id">) => {
    const book: Book = {
      ...newBook,
      id: Date.now().toString(),
    };
    setBooks([...books, book]);
    setIsAddDialogOpen(false);
    toast.success(`"${newBook.title}" a été ajouté à la bibliothèque`);
  };

  const updateBook = (updatedBook: Book) => {
    setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)));
    setIsEditDialogOpen(false);
    setEditingBook(null);
    toast.success(`"${updatedBook.title}" a été mis à jour`);
  };

  const deleteBook = (id: string) => {
    const book = books.find((b) => b.id === id);
    setBooks(books.filter((book) => book.id !== id));
    toast.success(`"${book?.title}" a été supprimé de la bibliothèque`);
  };

  const borrowBook = (id: string) => {
    setBooks(
      books.map((book) => {
        if (book.id === id && book.borrowed < book.copies) {
          return { ...book, borrowed: book.borrowed + 1 };
        }
        return book;
      })
    );
    const book = books.find((b) => b.id === id);
    toast.success(`"${book?.title}" a été emprunté`);
  };

  const returnBook = (id: string) => {
    setBooks(
      books.map((book) => {
        if (book.id === id && book.borrowed > 0) {
          return { ...book, borrowed: book.borrowed - 1 };
        }
        return book;
      })
    );
    const book = books.find((b) => b.id === id);
    toast.success(`"${book?.title}" a été retourné`);
  };

  const totalBooks = books.reduce((sum, book) => sum + book.copies, 0);
  const totalBorrowed = books.reduce((sum, book) => sum + book.borrowed, 0);
  const availableBooks = totalBooks - totalBorrowed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Section */}
        {showStats && (
          <div className="mb-8">
            <Statistics totalBooks={totalBooks} totalBorrowed={totalBorrowed} availableBooks={availableBooks} />
          </div>
        )}

        {/* Top Bar with Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 flex-1 md:flex-row md:gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Rechercher par titre, auteur ou ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={showStats ? "default" : "outline"}
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Stats</span>
              </Button>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Ajouter un livre</span>
                    <span className="sm:hidden">Ajouter</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau livre</DialogTitle>
                    <DialogDescription>Remplissez les informations du livre</DialogDescription>
                  </DialogHeader>
                  <AddBookForm onSubmit={addBook} onCancel={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-slate-600">
          {filteredBooks.length} livre{filteredBooks.length !== 1 ? "s" : ""} trouvé{filteredBooks.length !== 1 ? "s" : ""}
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={(book) => {
                  setEditingBook(book);
                  setIsEditDialogOpen(true);
                }}
                onDelete={deleteBook}
                onBorrow={borrowBook}
                onReturn={returnBook}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="mb-4 h-12 w-12 text-slate-300" />
              <p className="text-lg font-medium text-slate-600">Aucun livre trouvé</p>
              <p className="text-sm text-slate-500">Essayez de modifier votre recherche ou d'ajouter un nouveau livre</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Edit Book Dialog */}
      {editingBook && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Éditer le livre</DialogTitle>
              <DialogDescription>Modifiez les informations du livre</DialogDescription>
            </DialogHeader>
            <AddBookForm
              initialBook={editingBook}
              onSubmit={(data) => updateBook({ ...editingBook, ...data })}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingBook(null);
              }}
              isEditing
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
