// ==================== State Management ====================
let books = [];
let filteredBooks = [];
let editingBookId = null;
let selectedColor = 'from-blue-500 to-blue-700';

// ==================== DOM Elements ====================
const booksGrid = document.getElementById('booksGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const addBookBtn = document.getElementById('addBookBtn');
const statsBtn = document.getElementById('statsBtn');
const statsSection = document.getElementById('statsSection');
const emptyState = document.getElementById('emptyState');
const resultCount = document.getElementById('resultCount');

const bookModal = document.getElementById('bookModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const bookForm = document.getElementById('bookForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtnText = document.getElementById('submitBtnText');
const borrowedGroup = document.getElementById('borrowedGroup');

// Form inputs
const bookTitle = document.getElementById('bookTitle');
const bookAuthor = document.getElementById('bookAuthor');
const bookISBN = document.getElementById('bookISBN');
const bookCategory = document.getElementById('bookCategory');
const bookYear = document.getElementById('bookYear');
const bookCopies = document.getElementById('bookCopies');
const bookBorrowed = document.getElementById('bookBorrowed');
const bookDescription = document.getElementById('bookDescription');
const bookColor = document.getElementById('bookColor');

// Statistics elements
const totalBooksEl = document.getElementById('totalBooks');
const borrowedBooksEl = document.getElementById('borrowedBooks');
const availableBooksEl = document.getElementById('availableBooks');
const borrowPercentageEl = document.getElementById('borrowPercentage');
const borrowProgress = document.getElementById('borrowProgress');

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    renderBooks();
    setupEventListeners();
    setCurrentYear();
});

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Search and filter
    searchInput.addEventListener('input', filterBooks);
    categoryFilter.addEventListener('change', filterBooks);

    // Modal controls
    addBookBtn.addEventListener('click', openAddModal);
    statsBtn.addEventListener('click', toggleStats);
    closeModal.addEventListener('click', closeBookModal);
    cancelBtn.addEventListener('click', closeBookModal);
    modalOverlay.addEventListener('click', closeBookModal);
    bookForm.addEventListener('submit', handleFormSubmit);

    // Color picker
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedColor = btn.dataset.color;
            bookColor.value = selectedColor;
        });
    });

    // Prevent modal close on form click
    bookModal.addEventListener('click', (e) => e.stopPropagation());
}

// ==================== Modal Functions ====================
function openAddModal() {
    editingBookId = null;
    resetForm();
    modalTitle.textContent = 'Ajouter un nouveau livre';
    submitBtnText.textContent = 'Ajouter le livre';
    borrowedGroup.style.display = 'none';
    openModal();
}

function openEditModal(bookId) {
    editingBookId = bookId;
    const book = books.find(b => b.id === bookId);
    
    if (book) {
        bookTitle.value = book.title;
        bookAuthor.value = book.author;
        bookISBN.value = book.isbn;
        bookCategory.value = book.category;
        bookYear.value = book.year;
        bookCopies.value = book.copies;
        bookBorrowed.value = book.borrowed;
        bookDescription.value = book.description;
        selectedColor = book.coverColor;
        bookColor.value = selectedColor;

        // Update color picker
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.color === selectedColor) {
                btn.classList.add('active');
            }
        });

        modalTitle.textContent = 'Éditer le livre';
        submitBtnText.textContent = 'Mettre à jour';
        borrowedGroup.style.display = 'block';
        openModal();
    }
}

function openModal() {
    bookModal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookModal() {
    bookModal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    resetForm();
    editingBookId = null;
}

function resetForm() {
    bookForm.reset();
    bookYear.value = new Date().getFullYear();
    bookCopies.value = 1;
    bookBorrowed.value = 0;
    selectedColor = 'from-blue-500 to-blue-700';
    bookColor.value = selectedColor;
    
    // Reset color picker
    document.querySelectorAll('.color-btn').forEach((btn, index) => {
        if (index === 2) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Clear error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('error'));
}

// ==================== Form Validation ====================
function validateForm() {
    const errors = {};

    if (!bookTitle.value.trim()) {
        errors.title = 'Le titre est requis';
    }

    if (!bookAuthor.value.trim()) {
        errors.author = 'L\'auteur est requis';
    }

    if (!bookISBN.value.trim()) {
        errors.isbn = 'L\'ISBN est requis';
    }

    if (bookCopies.value < 1) {
        errors.copies = 'Au moins 1 exemplaire requis';
    }

    if (bookBorrowed.value > bookCopies.value) {
        errors.borrowed = 'Les emprunts ne peuvent pas dépasser le nombre d\'exemplaires';
    }

    const year = parseInt(bookYear.value);
    if (year < 1000 || year > new Date().getFullYear() + 1) {
        errors.year = 'L\'année doit être valide';
    }

    // Display errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('error'));

    Object.keys(errors).forEach(field => {
        const errorEl = document.getElementById(field + 'Error');
        const inputEl = document.getElementById('book' + field.charAt(0).toUpperCase() + field.slice(1));
        
        if (errorEl) {
            errorEl.textContent = errors[field];
        }
        if (inputEl) {
            inputEl.classList.add('error');
        }
    });

    return Object.keys(errors).length === 0;
}

// ==================== Form Submit ====================
function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const bookData = {
        title: bookTitle.value.trim(),
        author: bookAuthor.value.trim(),
        isbn: bookISBN.value.trim(),
        category: bookCategory.value,
        year: parseInt(bookYear.value),
        copies: parseInt(bookCopies.value),
        borrowed: parseInt(bookBorrowed.value) || 0,
        description: bookDescription.value.trim(),
        coverColor: selectedColor
    };

    if (editingBookId) {
        updateBook(editingBookId, bookData);
    } else {
        addBook(bookData);
    }

    closeBookModal();
}

// ==================== Book Management ====================
function addBook(bookData) {
    const newBook = {
        id: Date.now().toString(),
        ...bookData
    };

    books.push(newBook);
    saveBooks();
    filterBooks();
    showToast(`"${newBook.title}" a été ajouté à la bibliothèque`, 'success');
}

function updateBook(bookId, bookData) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        Object.assign(book, bookData);
        saveBooks();
        filterBooks();
        showToast(`"${book.title}" a été mis à jour`, 'success');
    }
}

function deleteBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book && confirm(`Êtes-vous sûr de vouloir supprimer "${book.title}" ?`)) {
        books = books.filter(b => b.id !== bookId);
        saveBooks();
        filterBooks();
        showToast(`"${book.title}" a été supprimé de la bibliothèque`, 'success');
    }
}

function borrowBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book && book.borrowed < book.copies) {
        book.borrowed++;
        saveBooks();
        renderBooks();
        showToast(`"${book.title}" a été emprunté`, 'success');
    }
}

function returnBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book && book.borrowed > 0) {
        book.borrowed--;
        saveBooks();
        renderBooks();
        showToast(`"${book.title}" a été retourné`, 'success');
    }
}

// ==================== Filtering & Search ====================
function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    filteredBooks = books.filter(book => {
        const matchesSearch = 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.isbn.toLowerCase().includes(searchTerm);

        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderBooks();
}

// ==================== Rendering ====================
function renderBooks() {
    booksGrid.innerHTML = '';

    if (filteredBooks.length === 0) {
        emptyState.style.display = 'block';
        resultCount.textContent = '0';
        updateStats();
        return;
    }

    emptyState.style.display = 'none';
    resultCount.textContent = filteredBooks.length;

    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
    });

    updateStats();
}

function createBookCard(book) {
    const availableCopies = book.copies - book.borrowed;
    const borrowPercentage = (book.borrowed / book.copies) * 100;

    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <div class="book-cover" style="background: linear-gradient(135deg, ${getCoverGradient(book.coverColor)})">
            <span>📚</span>
        </div>
        <div class="book-header">
            <h3 class="book-title">${escapeHtml(book.title)}</h3>
            <p class="book-author">${escapeHtml(book.author)}</p>
        </div>
        <div class="book-body">
            <div class="book-info">
                <div class="book-info-item">
                    <span class="book-info-label">Catégorie</span>
                    <span class="book-info-value">${book.category}</span>
                </div>
                <div class="book-info-item">
                    <span class="book-info-label">Année</span>
                    <span class="book-info-value">${book.year}</span>
                </div>
                <div class="book-info-item">
                    <span class="book-info-label">Exemplaires</span>
                    <span class="book-info-value">${book.copies}</span>
                </div>
            </div>

            <div class="availability">
                <div class="availability-label">
                    <span>Disponibilité</span>
                    <span>${availableCopies}/${book.copies}</span>
                </div>
                <div class="availability-bar">
                    <div class="availability-fill" style="width: ${borrowPercentage}%"></div>
                </div>
            </div>

            ${book.description ? `<p class="book-description">${escapeHtml(book.description)}</p>` : ''}
        </div>
        <div class="book-footer">
            <div class="book-actions">
                ${availableCopies > 0 
                    ? `<button class="btn btn-success btn-small" onclick="borrowBook('${book.id}')">
                        <i class="fas fa-download"></i> Emprunter
                       </button>`
                    : `<button class="btn btn-small" disabled>
                        <i class="fas fa-download"></i> Indisponible
                       </button>`
                }
                ${book.borrowed > 0 
                    ? `<button class="btn btn-outline btn-small" onclick="returnBook('${book.id}')">
                        <i class="fas fa-undo"></i> Retourner
                       </button>`
                    : ''
                }
            </div>
            <div class="book-actions-secondary">
                <button class="btn btn-outline btn-small" onclick="openEditModal('${book.id}')">
                    <i class="fas fa-edit"></i> Éditer
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteBook('${book.id}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `;

    return card;
}

// ==================== Statistics ====================
function updateStats() {
    const totalBooks = books.reduce((sum, book) => sum + book.copies, 0);
    const totalBorrowed = books.reduce((sum, book) => sum + book.borrowed, 0);
    const availableBooks = totalBooks - totalBorrowed;
    const borrowPercentage = totalBooks > 0 ? Math.round((totalBorrowed / totalBooks) * 100) : 0;

    totalBooksEl.textContent = totalBooks;
    borrowedBooksEl.textContent = totalBorrowed;
    availableBooksEl.textContent = availableBooks;
    borrowPercentageEl.textContent = `${borrowPercentage}% de la collection`;
    borrowProgress.style.width = `${borrowPercentage}%`;
}

function toggleStats() {
    statsSection.style.display = statsSection.style.display === 'none' ? 'block' : 'none';
    statsBtn.classList.toggle('btn-primary');
    statsBtn.classList.toggle('btn-outline');
}

// ==================== Storage ====================
function saveBooks() {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
}

function loadBooks() {
    const saved = localStorage.getItem('libraryBooks');
    
    if (saved) {
        try {
            books = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading books:', error);
            initializeSampleBooks();
        }
    } else {
        initializeSampleBooks();
    }
}

function initializeSampleBooks() {
    books = [
        {
            id: '1',
            title: 'Le Seigneur des Anneaux',
            author: 'J.R.R. Tolkien',
            isbn: '978-2253045199',
            category: 'Fiction',
            year: 1954,
            copies: 3,
            borrowed: 1,
            description: 'Une épopée fantastique incontournable',
            coverColor: 'from-amber-500 to-orange-600'
        },
        {
            id: '2',
            title: '1984',
            author: 'George Orwell',
            isbn: '978-2070360857',
            category: 'Fiction',
            year: 1949,
            copies: 2,
            borrowed: 0,
            description: 'Un roman dystopique sur un régime totalitaire',
            coverColor: 'from-red-500 to-red-700'
        },
        {
            id: '3',
            title: 'Sapiens',
            author: 'Yuval Noah Harari',
            isbn: '978-2226257017',
            category: 'Non-fiction',
            year: 2011,
            copies: 4,
            borrowed: 2,
            description: 'Une histoire brève de l\'humanité',
            coverColor: 'from-blue-500 to-blue-700'
        },
        {
            id: '4',
            title: 'Le Monde de Sophie',
            author: 'Jostein Gaarder',
            isbn: '978-2253048756',
            category: 'Fiction',
            year: 1991,
            copies: 2,
            borrowed: 1,
            description: 'Un roman philosophique captivant',
            coverColor: 'from-purple-500 to-indigo-600'
        },
        {
            id: '5',
            title: 'Cosmos',
            author: 'Carl Sagan',
            isbn: '978-2253048763',
            category: 'Science',
            year: 1980,
            copies: 1,
            borrowed: 0,
            description: 'Un voyage à travers l\'univers',
            coverColor: 'from-cyan-500 to-blue-600'
        }
    ];

    saveBooks();
}

// ==================== Utilities ====================
function setCurrentYear() {
    bookYear.value = new Date().getFullYear();
}

function getCoverGradient(colorClass) {
    const gradients = {
        'from-amber-500 to-orange-600': '#f59e0b, #dc2626',
        'from-red-500 to-red-700': '#ef4444, #b91c1c',
        'from-blue-500 to-blue-700': '#3b82f6, #1e40af',
        'from-purple-500 to-indigo-600': '#a855f7, #4f46e5',
        'from-cyan-500 to-blue-600': '#06b6d4, #2563eb',
        'from-green-500 to-emerald-600': '#22c55e, #059669',
        'from-pink-500 to-rose-600': '#ec4899, #e11d48',
        'from-yellow-500 to-orange-600': '#eab308, #dc2626'
    };
    return gradients[colorClass] || '#3b82f6, #1e40af';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
        <i class="${icons[type]} toast-icon"></i>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
