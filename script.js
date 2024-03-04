// Declaring variables
const books = document.querySelector('.grid-container');
const addBook = document.querySelector('.btn-add');
const modal = document.getElementById('modal');
const span = document.querySelector('.close');
const addBookForm = document.querySelector('.add-book-form'); 

// Adds a click event listener to "addBook" element and displays a modal, 
// updates form title to "Add New Book" and submit button text to "Submit"
addBook.addEventListener('click', () => {
    modal.style.display = 'block';
    document.querySelector('.form-title').textContent = "Add New Book";
    document.querySelector('.form-submit-button').textContent = "Submit";
    clearFormFields();
});

// Handles form submission, creates/updates a book object based on form data, 
// saves and renders books if editing, adds new book to library if not editing, 
// resets form, and hides modal
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
});

// Declares an empty array named "myLibrary" to store book objects
let myLibrary = [];

// Constructor function for creating a Book object with title, author, pages, 
// read, and a random id 
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = Math.floor(Math.random() *1000000000);
}

// Adds a new Book object with the provided title, author, pages, 
// and read values to the myLibrary array, and then saves and renders the books
function addBookToLibrary(title, author, pages, read) {
    myLibrary.push(new Book(title, author, pages, read));
    saveAndRenderBooks();
}

// Creates and returns a new HTML element (el) with the provided content 
// and class name (className)
function createBookElement(el, content, className) {
    const element = document.createElement(el);
    element.textContent = content;
    element.setAttribute('class', className);
    return element;
}

// Creates and returns a new read element for a book item, including a title, 
// checkbox, and event listener to toggle the read status of the book
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

// Retrieves 'library' data from local storage and assigns it to myLibrary array, 
// or initializes an empty array, saves and renders the books
function addLocalStorage() {
    myLibrary = JSON.parse(localStorage.getItem('library')) || [];
    saveAndRenderBooks(); 
}

// Saves the myLibrary array to local storage as 'library' data in JSON format, 
// and then renders the books
function saveAndRenderBooks () {
    localStorage.setItem('library', JSON.stringify(myLibrary));
    renderBooks();
}

// Removes a book from the myLibrary array at the specified index
function deleteBook(index) {
    myLibrary.splice(index, 1);
    saveAndRenderBooks();
}

// Fills out the edit form with the details of the provided book object, 
// updates the modal display, form title, submit button text, form id, 
// and input values accordingly
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

// Creates and returns an edit icon element for a book, with a click event listener 
// that fills out the edit form with the details of the corresponding book
function createEditIcon(book) {
    const editIcon = document.createElement('span');
    editIcon.setAttribute('class', 'material-symbols-outlined');
    editIcon.textContent = 'edit_square';

    editIcon.addEventListener("click", () => {
        fillOutEditForm(book);
    });
    return editIcon;
}

// Creates and returns a book item element for a book, with various attributes, 
// child elements for title, author, pages, read status, delete button, and edit icon. 
// Also adds event listener for delete button click to remove the corresponding book 
// from the library
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

// Clears the content of the books element. Then, for each book in myLibrary, 
// calls the createBookItem function to create and display a book item element
function renderBooks () {
    books.textContent = "";
    myLibrary.map((book, index) => {
        createBookItem(book, index); 
    });
}

// Clears form fields
function clearFormFields() {
    document.querySelector('[name="book-title"]').value = '';
    document.querySelector('[name="book-author"]').value = '';
    document.querySelector('[name="book-pages"]').value = '';
    document.querySelector('[name="book-read"]').checked = false;
}

// Calls the addLocalStorage function
addLocalStorage();
