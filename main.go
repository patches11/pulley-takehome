package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"index/suffixarray"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func main() {
	searcher := Searcher{}
	err := searcher.Load("completeworks.txt")
	if err != nil {
		log.Fatal(err)
	}

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	http.HandleFunc("/search", handleSearch(searcher))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	fmt.Printf("shakesearch available at http://localhost:%s...", port)
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
	if err != nil {
		log.Fatal(err)
	}
}

type Searcher struct {
	CompleteWorks string
	SuffixArray   *suffixarray.Index
}

func handleSearch(searcher Searcher) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		query, ok := r.URL.Query()["q"]
		if !ok || len(query[0]) < 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing search query in URL params"))
			return
		}
		pageStr := r.URL.Query().Get("page")
		page, pageErr := strconv.Atoi(pageStr)
		if pageErr != nil || page < 1 {
			page = 1
		}
		results := searcher.Search(query[0], page)
		buf := &bytes.Buffer{}
		enc := json.NewEncoder(buf)
		err := enc.Encode(results)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("encoding failure"))
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(buf.Bytes())
	}
}

func (s *Searcher) Load(filename string) error {
	dat, err := ioutil.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("Load: %w", err)
	}
	s.CompleteWorks = string(dat)
	s.SuffixArray = suffixarray.New(bytes.ToLower(dat))
	return nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func (s *Searcher) Search(query string, page int) []string {
	idxs := s.SuffixArray.Lookup([]byte(strings.ToLower(query)), -1)
	start := 20 * (page - 1)
	end := 20 * page
	pageIndexes := idxs[min(start, len(idxs)):min(end, len(idxs))]
	results := []string{}
	for _, idx := range pageIndexes {
		results = append(results, s.CompleteWorks[idx-250:idx+250])
	}
	return results
}
