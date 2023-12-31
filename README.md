# ShakeSearch Challenge

Welcome to the Pulley Shakesearch Challenge! This repository contains a simple web app for searching text in the complete works of Shakespeare.

## Prerequisites

To run the tests, you need to have [Go](https://go.dev/doc/install) and [Docker](https://docs.docker.com/engine/install/) installed on your system.

## Your Task

Your task is to fix the underlying code to make the failing tests in the app pass. There are 3 frontend tests and 3 backend tests, with 2 of each currently failing. You should not modify the tests themselves, but rather improve the code to meet the test requirements. You can use the provided Dockerfile to run the tests or the app locally. The success criteria are to have all 6 tests passing.

## Instructions

<img width="404" alt="image" src="https://github.com/ProlificLabs/shakesearch/assets/98766735/9a5b96b5-0e44-42e1-8d6e-b7a9e08df9a1">

*** 

**Do not open a pull request or fork the repo**. Use these steps to create a hard copy.

1. Create a repository from this one using the "Use this template" button.
2. Fix the underlying code to make the tests pass
3. Include a short explanation of your changes in the readme or changelog file
4. Email us back with a link to your copy of the repo

## Running the App Locally


This command runs the app on your machine and will be available in browser at localhost:3001.

```bash
make run
```

## Running the Tests

This command runs backend and frontend tests.

Backend testing directly runs all Go tests.

Frontend testing run the app and mochajs tests inside docker, using internal port 3002.

```bash
make test
```

Good luck!


## Patrick Takehome Notes

### Go Tests

* Fix case insensitive test case by changing both the data fed into the search index and the query to lower case.
  * Seems like SuffixArray also supports a regex based search via FindAllIndex, that might be the better solution if we wanted to support both case sensitive and case-insensitive search, or more advanced search functions, but I kept it simple since it seemed like we want all searches to be case-insensitive
* Fix test TestSearchDrunk by changing the code to return 20 results at a time and add a page query param, this appears to be the expected behavior.
  * pages start at 1 rather than 0 to keep in line with what users would expect to see
  * page size fixed at 20
  * invalid pages such as -1 just return the first page of results, higher pages just return empty. I didn't implement any envelope to give more info such as count etc.

### Javascript Tests

* Javascript test 'should return search results for "romeo, wherefore art thou"' fixed by previous Go changes
  * It seems like this was intentional this would be fixed by the Go code change
* Javascript test 'should load more results for "horse" when clicking "Load More"' fixed by using new page query param in go endpoint, and implementing tracking of current page and search
  * Kept the state inside the Controller singleton, I think that is a reasonable approach here

### Other notes

* Added a couple more Go tests to check my error handling conditions on the page param
* Given the basic nature of the js code, I tried to stay in line with that when handling the "Load More" button, I think the implementation makes sense from a user perspective but could probably use some polishing.