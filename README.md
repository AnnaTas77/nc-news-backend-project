# Northcoders News API Project

## Project Description

The News API is designed to allow programmatic access to application data and is intended to mimic the functionality of real-world backend services like Reddit. Built using Node.js and interacting with a PostgreSQL (PSQL) database, this API allows users to retrieve articles, comments, topics, and user information. Additionally, it supports filtering, sorting, and updating article data, along with managing comments.

The database used for this project is PostgreSQL (PSQL). Therefore **node-postgres** can be used to interact with the database.

> You can find the hosted version of the Northcoders News API Project [here](https://news-backend-project.onrender.com/api).

### API Endpoints and Functionality

1. **GET /api/topics:** Responds with an array of topics.
2. **GET /api:** Responds with an array of available endpoints.
3. **GET /api/articles/:article_id:** Responds with a single article by article_id.
4. **GET /api/articles:** Responds with an array of articles.
5. **GET /api/articles/:article_id/comments:** Responds with an array of comments by article_id.
6. **POST /api/articles/:article_id/comments:** Adds a comment to an article by article_id.
7. **PATCH /api/articles/:article_id:** Updates an article by article_id.
8. **DELETE /api/comments/:comment_id:** Deletes a comment by comment_id.
9. **GET /api/users:** Responds with an array of users.
10. **GET /api/articles (Queries):** Allows articles to be filtered and sorted.
11. **GET /api/articles/:article_id (comment count):** Adds a comment count to the response when retrieving a single article.

## Getting Started

To get started with the Northcoders News API locally, follow these steps:

### 1. Clone the GitHub repository

    git clone https://github.com/AnnaTas77/nc-news-backend-project

### 2. Install project dependencies

    npm install

### 3. Environment Variables Configuration

In order to successfully connect to the two databases locally, please make sure to set the following environment variables:

1. Create a new file in the root directory and name it ".env.development".
2. In the ".env.development" file add the following line: "PGDATABASE=nc_news" and save the file.
3. Create another new file in the root directory and name it ".env.test".
4. In the ".env.test" file add the following line: "PGDATABASE=nc_news_test" and save the file.
5. Add these two files as ".env.\*" to the ".gitignore" file.
   Set up the local database:

### 4.Setup the database

    npm run setup-dbs

### 4.Seed the database

    npm run seed

### 5.To run the test suite using Jest

    npm test


### Feel free to explore the API's endpoints, experiment with the functionality, and integrate it into your own projects. 😊