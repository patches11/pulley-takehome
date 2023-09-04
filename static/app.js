const Controller = {
  lastSearch: "",
  page: 1,

  search: (ev) => {
    ev.preventDefault();
    const form = document.getElementById("form");
    const data = Object.fromEntries(new FormData(form));
    const query = data.query
    Controller.resetResults(query)
    Controller.paginatedSearch(query, 1)
    Controller.lastSearch = query
    Controller.page = 1
  },

  resetResults: (search) => {
    const table = document.getElementById("table-body");
    table.innerHTML = ""
    const header = document.getElementById("results-header");
    header.innerHTML = `<strong>Search Results For:</strong> ${search}`
    const noResults = document.getElementById("maybe-no-results");
    noResults.innerHTML = ""
  },

  paginatedSearch: (query, page) => {
    if (query.length > 0) {
      fetch(`/search?q=${query}&page=${page}`).then((response) => {
        response.json().then((results) => {
          Controller.updateTable(results);
        });
      });
    } else {
      Controller.updateTable([])
    }
  },

  updateTable: (results) => {
    if (results.length == 0) {
      const noResults = document.getElementById("maybe-no-results");
      noResults.innerHTML = "<strong>No Results Returned</strong>"
    } else {
      const table = document.getElementById("table-body");
      const newRows = [];
      for (let result of results) {
        newRows.push(`<tr><td>${result}</td></tr>`);
      }
      table.innerHTML = table.innerHTML + newRows.join("\n");
    }
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
