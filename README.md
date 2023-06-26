# Northcoders News API Project

### Environment Variables Configuration

In order to successfully connect to the two databases locally, please make sure to set the following environment variables:

1. Create a new file in the root directory and name it ".env.development".
2. In the ".env.development" file add the following line: "PGDATABASE=nc_news" and save the file.
3. Create another new file in the root directory and name it ".env.test".
4. In the ".env.test" file add the following line: "PGDATABASE=nc_news_test" and save the file.
5. Add these two files as ".env.\*" to the ".gitignore" file.
