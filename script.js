const books = document.querySelector('.grid-container');
const addBook = document.querySelector('.btn-add');
const modal = document.getElementById('modal');
const span = document.querySelector('.close');
const addBookForm = document.querySelector('.add-book-form'); 

addBook.addEventListener('click', () => {
    modal.style.display = 'block';
    document.querySelector('.form-title').textContent = "Add New Book";
    document.querySelector('.form-submit-button').textContent = "Submit";
});

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    let newBook = {};
    for(let [name, value] of data) {
        if (name === 'book-read') {
            newBook['book-read'] = true;
        } else {
            newBook[name] = value || ""; 
        }
    }
    if (!newBook['book-read']) {
        newBook['book-read'] = false;
    }
    if(document.querySelector('.form-title').textContent === "Edit Book") {
        let id = e.target.id;
        let editBook = myLibrary.filter((book) => (book.id == id))[0];
        editBook.title = newBook['book-title'];
        editBook.author = newBook['book-author'];
        editBook.pages = newBook['book-pages'];
        editBook.read = newBook['book-read'];
        saveAndRenderBooks();
    } else {
    addBookToLibrary
        (newBook['book-title'], 
        newBook['book-author'], 
        newBook['book-pages'], 
        newBook['book-read']
    );
    }
    addBookForm.reset();
    modal.style.display ="none";
});

span.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if(e.target === modal) {
        modal.style.display = "none";
    }
})

let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = Math.floor(Math.random() *1000000000);
}

function addBookToLibrary(title, author, pages, read) {
    myLibrary.push(new Book(title, author, pages, read));
    saveAndRenderBooks();
}

function createBookElement(el, content, className) {
    const element = document.createElement(el);
    element.textContent = content;
    element.setAttribute('class', className);
    return element;
}

function createReadElement(bookItem, book) {
    const read = document.createElement('div');
    read.setAttribute('class', 'book-read');
    read.appendChild(createBookElement("h1", "Read?", "book-read-title"));
    const input = document.createElement('input'); 
    input.type = 'checkbox';
    input.addEventListener('click', (e) => {
        if(e.target.checked) {
            bookItem.setAttribute('class', 'card book read-checked');
            book.read = true;
            saveAndRenderBooks();
        } else {
            bookItem.setAttribute('class', 'card book read-unchecked');
            book.read = false;
            saveAndRenderBooks();
        }
    });
    if (book.read) {
        input.checked = true; 
        bookItem.setAttribute('class', 'card book read-checked');
    }
    read.appendChild(input);
    return read;
}

function addLocalStorage() {
    myLibrary = JSON.parse(localStorage.getItem('library')) || [];
    saveAndRenderBooks(); 
}

function saveAndRenderBooks () {
    localStorage.setItem('library', JSON.stringify(myLibrary));
    renderBooks();
}

function deleteBook(index) {
    myLibrary.splice(index, 1);
    saveAndRenderBooks();
}

function fillOutEditForm(book) {
    modal.style.display = 'block';
    document.querySelector('.form-title').textContent = 'Edit Book';
    document.querySelector('.form-submit-button').textContent = 'Edit';
    document.querySelector('.add-book-form').setAttribute('id', book.id);
    document.getElementById('book-title').value = book.title || "";
    document.getElementById('book-author').value = book.author || "";
    document.getElementById('book-pages').value = book.pages || "";
    document.getElementById('book-read').checked = book.read;
}

function createEditIcon(book) {
    const editIcon = document.createElement('span');
    editIcon.setAttribute('class', 'material-symbols-outlined');
    editIcon.textContent = 'edit_square';

    editIcon.addEventListener("click", () => {
        fillOutEditForm(book);
    });
    return editIcon;
}

function createBookItem(book, index) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('id', index);
    bookItem.setAttribute('key', index);
    bookItem.setAttribute('class', 'card book');
    bookItem.appendChild(createBookElement('h1', `${book.title}`, "book-title"));
    bookItem.appendChild(createBookElement('h1', `Author: ${book.author}`, "book-author"));
    bookItem.appendChild(createBookElement('h1', `Pages: ${book.pages}`, "book-pages"));
    bookItem.appendChild(createReadElement(bookItem, book));
    bookItem.appendChild(createBookElement('button', 'delete', 'delete material-symbols-outlined'));
    bookItem.appendChild(createEditIcon(book));
    bookItem.querySelector('.delete').addEventListener('click', () => deleteBook(index));
    books.insertAdjacentElement('afterbegin', bookItem);
}

function renderBooks () {
    books.textContent = "";
    myLibrary.map((book, index) => {
        createBookItem(book, index); 
    });
}

addLocalStorage();
