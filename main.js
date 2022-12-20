let app;

/**
 * Book
 *
 * @param title {string}
 * @param author {string}
 * @param pages {number}
 * @param imageUrl {string}
 * @param read {boolean}
 * @constructor
 */
function Book(title, author, pages, imageUrl, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.imageUrl = imageUrl;
  this.read = read;
}

/**
 *
 * @param id {number}
 * @param book {Book}
 * @constructor
 */
function Record(id, book) {
  this.id = id;
  this.book = book;
}

/**
 * Storage facilities
 *
 * @constructor
 */
function Storage() {
  this.lastId = 0;

  // Adds random books for example purposes
  this.db = [
    new Record(
      1,
      new Book(
        "Fifty Shades of Gray",
        "E. L. James",
        514,
        "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTRl34v2iRF1MQfzwDOuop_3akLq9EFutHbhXAra9Gs_UKK8M0o",
        true
      )
    ),
    new Record(
      2,
      new Book(
        "Harry Potter and the Philosopher's Stone",
        "J. K. Rowling",
        812,
        "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRkWXbfQrO5oTm1I5izjeRTbQD-vKPnybT24S2kFw2eH8LyyCo5",
        false
      )
    ),
    new Record(
      3,
      new Book(
        "Gangsta Rap Coloring Book",
        "aye jay",
        146,
        "http://www.fastprint.co.uk/Assets/User/2074-gangsta-rap-coloring-book.jpg",
        false
      )
    ),
    new Record(
      4,
      new Book(
        "Still Stripping After 25 Years",
        "Elanor Burns",
        169,
        "http://www.fastprint.co.uk/Assets/User/2113-still-stripping-after-25-years.jpg",
        true
      )
    ),
    new Record(
      5,
      new Book(
        "Eating People Is Wrong",
        "Joe Hums",
        567,
        "http://www.fastprint.co.uk/Assets/User/2064-eating-people-is-wrong.jpg",
        false
      )
    ),
  ];

  /**
   * Add new book to storage
   *
   * @param book {Book}
   */
  this.add = function (book) {
    const id = this.lastId;
    this.db.push(new Record(id, book));
    this.lastId = id + 1;
  };

  /**
   * Deletes book by id
   * @param id {number}
   */
  this.delete = function (id) {
    this.db = this.db.filter((element) => element.id !== id);
  };

  /**
   * Returns number of records
   *
   * @returns {number}
   */
  this.count = function () {
    return this.db.length;
  };

  /**
   * Gets all records
   *
   * @returns {[Record,Record]|*}
   * @param {"asc"|"desc"} order
   */
  this.getAllRecords = (order = "asc") => {
    return order === "asc" ? this.db : this.db.reverse();
  };
}

/**
 * Main App
 *
 * @constructor
 */
function App() {
  let storage = null;

  /**
   * Hides all views
   */
  const hideAllViews = () => {
    [...document.querySelectorAll(".main section")].forEach((el) => {
      el.classList.remove("visible");
    });
  };

  /**
   * Show view based on view name
   *
   * @param viewName {string}
   */
  const showView = (viewName) => {
    const el = document.querySelector(`.main section.${viewName}`);
    el.classList.add("visible");
  };

  /**
   * Get storage, behaves like a singleton
   *
   * @returns {Storage}
   */
  const getStorage = () => {
    storage = storage || new Storage();
    return storage;
  };

  /**
   *  Validates books as input by user and display
   *  appropriate errors when... appropriate
   *
   * @param book {Book}
   * @return {boolean}
   */
  const validateBookDataAndDisplayErrors = (book) => {
    let hasNoErrors = true;
    for (let elementName of Object.getOwnPropertyNames(book)) {
      document.querySelector(`#${elementName}`).classList.remove("error");
      document.querySelector(`#${elementName} ~ .error-message`).innerHTML = "";

      if (elementName === "read") {
        continue;
      }

      if (!book[elementName]) {
        document.querySelector(`#${elementName}`).classList.add("error");
        document.querySelector(
          `#${elementName} ~ .error-message`
        ).innerHTML = `You need to fill ${elementName}`;
        hasNoErrors = false;
      }
    }
    return hasNoErrors;
  };

  /**
   * Resets book add input fields
   * to their original state
   */
  const resetBookInputFields = () => {
    document.querySelectorAll(".input-wrapper input").forEach((element) => {
      element.value = "";
      element.checked = false;
    });
  };

  /**
   * Updates book counter based on record
   */
  this.updateBookCounter = () => {
    document.querySelector(".books-counter").innerHTML = getStorage()
      .count()
      .toFixed();
  };

  this.switchView = (viewName) => {
    hideAllViews();
    showView(viewName);
  };

  /**
   * Update HTML book list based on what's on storage
   */
  this.updateBooksList = () => {
    document.querySelector(".books-list").innerHTML = "";
    getStorage()
      .getAllRecords("desc")
      .forEach((record) => {
        document.querySelector(
          ".books-list"
        ).innerHTML += `<div class="book-record" data-id="${record.id}">
                <div class="image">
                  <img
                    src="${record.book.imageUrl}"
                    alt=""
                  />
                </div>
                <div class="title">${record.book.title}</div>
                <div class="author">${record.book.author}</div>
                <div class="pages">${record.book.pages} pages</div>
                <div class="read" data-id="${
                  record.id
                }">Read: <input class="edit-read" type="checkbox" data-id="${record.id}" ${
          record.book.read && "checked"
        }></div>
                <div class="actions">
                  <span class="material-symbols-outlined delete-book" data-id="${
                    record.id
                  }"> delete </span>
                </div>
            </div>`;
      });
  };

  /**
   * Adds new book
   */
  this.addBook = () => {
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const pages = document.querySelector("#pages").value;
    const imageUrl = document.querySelector("#imageUrl").value;
    const read = document.querySelector("#read").checked;

    const book = new Book(title, author, pages, imageUrl, read);

    if (!validateBookDataAndDisplayErrors(book)) {
      return;
    }

    getStorage().add(book);
    resetBookInputFields();
    this.refreshUI();
  };

  /**
   * Deletes book based on its ID
   *
   * @param id {number}
   */
  this.deleteBook = (id) => {
    getStorage().delete(id);
    this.refreshUI();
  };

  /**
   * Toggles read property based on user input
   *
   * @param id {number}
   * @param read {boolean}
   */
  this.editRead = (id, read) => {
    for (let record of getStorage().db) {
      if (record.id === id) {
        record.book.read = read;
        return;
      }
    }
  };

  this.refreshUI = () => {
    app.updateBooksList();
    app.updateBookCounter();
  };
}

app = app || new App();
app.refreshUI();

// EVENT LISTENERS
document
  .querySelectorAll(".nav-action-wrapper .material-symbols-outlined")
  .forEach((el) => {
    el.addEventListener("click", (event) => {
      event.stopPropagation();
      app.switchView(event.currentTarget.dataset.view);
    });
  });

document.querySelector(".add-book-bto").addEventListener("click", () => {
  app.addBook();
});

document.querySelector(".main").addEventListener("click", (event) => {
  const targetElement = event.target.closest(".delete-book");
  if (!targetElement) {
    return;
  }
  app.deleteBook(+targetElement.dataset.id);
});

document.querySelector(".main").addEventListener("click", (event) => {
  const targetElement = event.target.closest(".edit-read");
  if (!targetElement) {
    return;
  }
  app.editRead(+targetElement.dataset.id, targetElement.checked);
});
