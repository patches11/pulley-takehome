const Controller = {
  lastSearch: undefined,
  page: 1,

  search: (ev) => {
    ev.preventDefault();
    const form = document.getElementById("form");
    const data = Object.fromEntries(new FormData(form));
    Controller.clearTable()
    Controller.paginatedSearch(data.query, 1)
    Controller.lastSearch = data.query
    Controller.page = 1
  },

  clearTable: () => {
    const table = document.getElementById("table-body");
    table.innerHTML = ""
  },

  paginatedSearch: (query, page) => {
    fetch(`/search?q=${query}&page=${page}`).then((response) => {
      response.json().then((results) => {
        Controller.updateTable(results);
      });
    });
  },

  updateTable: (results) => {
    const table = document.getElementById("table-body");
    const newRows = [];
    for (let result of results) {
      newRows.push(`<tr><td>${result}</td></tr>`);
    }
    table.innerHTML = table.innerHTML + newRows.join("\n");
  },

  loadMore: () => {
    Controller.page += 1
    Controller.paginatedSearch(Controller.lastSearch, Controller.page)
  }
};

const form = document.getElementById("form");
form.addEventListener("submit", Controller.search);

const loadMore = document.getElementById("load-more");
loadMore.addEventListener("click", Controller.loadMore);
