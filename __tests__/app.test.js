const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
});

describe("All paths which do not exist", () => {
    test("404: should return error 'Not found' when the path does not exist", () => {
        return request(app)
            .get("/api/banana")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
});

describe("GET /api/topics", () => {
    test("200: should respond with an array of all topic objects", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
                expect(topics).toBeInstanceOf(Array);
                expect(topics).toHaveLength(3);
                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String),
                    });
                });
            });
    });
});

describe("GET /api", () => {
    test("200: should respond with an object describing all the available endpoints on the API", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((data) => {
                const { endpoints } = data.body;

                expect(endpoints).toMatchObject({
                    "GET /api": expect.any(Object),
                    "GET /api/topics": expect.any(Object),
                    "GET /api/articles": expect.any(Object),
                });

                for (const key in endpoints) {
                    expect(endpoints[key]).toMatchObject({
                        description: expect.any(String),
                        queries: expect.any(Array),
                        exampleResponse: expect.any(Object),
                    });
                }
            });
    });
});

describe("GET /api/articles/:article_id", () => {
    test("200: should respond with an object containing a single article corresponding to the provided article id", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                const { article } = body;

                const expectedArticle = {
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: 11,
                };

                expect(article).toBeInstanceOf(Object);
                expect(article).toMatchObject(expectedArticle);
            });
    });

    test("400: should respond with 'Bad request' when article_id is an invalid type", () => {
        return request(app)
            .get("/api/articles/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });

    test("404: should respond with 'Not found' when the article_id is of valid type, but does not exist in the database", () => {
        return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
});

describe("GET /api/articles", () => {
    test("200: should respond with an articles array containing all article objects sorted by date in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;

                expect(articles).toBeInstanceOf(Array);
                expect(articles).toHaveLength(13);
                expect(articles).toBeSortedBy("created_at", { descending: true });

                articles.forEach((article) => {
                    expect(article).toHaveProperty("author"), expect.any(String);
                    expect(article).toHaveProperty("title"), expect.any(String);
                    expect(article).toHaveProperty("article_id"), expect.any(Number);
                    expect(article).toHaveProperty("topic"), expect.any(String);
                    expect(article).toHaveProperty("created_at"), expect.any(String);
                    expect(article).toHaveProperty("votes"), expect.any(Number);
                    expect(article).toHaveProperty("article_img_url"), expect.any(String);
                    expect(article).toHaveProperty("comment_count"), expect.any(Number);
                });
            });
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test("200: should respond with an array of comments for a given article_id with the most recent comments first (date in descending order)", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;

                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(11);
                expect(comments).toBeSortedBy("created_at", { descending: true });

                comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id"), expect.any(Number);
                    expect(comment).toHaveProperty("votes"), expect.any(String);
                    expect(comment).toHaveProperty("created_at"), expect.any(String);
                    expect(comment).toHaveProperty("author"), expect.any(String);
                    expect(comment).toHaveProperty("body"), expect.any(String);
                    expect(comment).toHaveProperty("article_id"), expect(comment.article_id).toBe(1);
                });
            });
    });

    test("400: should respond with 'Bad request' when article_id is an invalid type", () => {
        return request(app)
            .get("/api/articles/banana/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });

    test("404: should respond with 'Not found' when the article_id is of valid type, but does not exist in the database", () => {
        return request(app)
            .get("/api/articles/7777/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });

    test("404: should respond with 'Not found' when there is no article_id provided", () => {
        return request(app)
            .get("/api/articles//comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });

    test("200: should respond with 'No content' when article_id is valid and it exists, but there are no comments on that article yet ", () => {
        return request(app)
            .get("/api/articles/4/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.msg).toBe("No content");
            });
    });
});

describe("POST /api/articles/:article_id/comments", () => {
    test("201: should add a comment for a specific article and should respond with an object representing the posted comment", () => {
        const newComment = {
            username: "butter_bridge",
            body: "The owls are not what they seem.",
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { postedComment } = body;

                expect(postedComment).toBeInstanceOf(Object);

                expect(postedComment).toMatchObject({
                    comment_id: 19,
                    body: "The owls are not what they seem.",
                    article_id: 1,
                    author: "butter_bridge",
                    votes: 0,
                    created_at: expect.any(String),
                });
            });
    });

    test("201: if the provided new comment object contains unnecessary properties, they should be ignored", () => {
        const newComment = {
            username: "butter_bridge",
            body: "The owls are not what they seem.",
            votes: -1000,
            nonsense: "banana",
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { postedComment } = body;

                expect(postedComment).toBeInstanceOf(Object);

                expect(postedComment).not.toHaveProperty("nonsense");

                expect(postedComment).toMatchObject({
                    comment_id: 19,
                    body: "The owls are not what they seem.",
                    article_id: 1,
                    author: "butter_bridge",
                    votes: 0,
                    created_at: expect.any(String),
                });
            });
    });

    test("400: should respond with 'Bad request' when trying to post a comment with missing fields", () => {
        const newComment = {
            username: "butter_bridge",
        };

        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });

    test("400: should respond with 'Bad request' when article id is an invalid type", () => {
        const newComment = {
            username: "butter_bridge",
            body: "The owls are not what they seem.",
        };
        return request(app)
            .post("/api/articles/banana/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });

    test("404: should respond with 'Not found' when the article id is a valid type, but does not exist", () => {
        const newComment = {
            username: "butter_bridge",
            body: "The owls are not what they seem.",
        };
        return request(app)
            .post("/api/articles/0/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });

    test("404: should respond with 'Not found' when a non-existent username is provided", () => {
        const newComment = {
            username: "anna",
            body: "The owls are not what they seem.",
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
});

describe("PATCH /api/articles/:article_id", () => {
    test("200: should update the number of votes for a specific article and should respond with the updated article", () => {
        const updateVote = { inc_votes: 100 };
        return request(app)
            .patch("/api/articles/3")
            .send(updateVote)
            .expect(200)
            .then(({ body }) => {
                const { updatedArticle } = body;

                expect(updatedArticle).toBeInstanceOf(Object);

                expect(updatedArticle).toMatchObject({
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: expect.any(String),
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
    });

    test("200: if the 'updateVote' object contains unnecessary properties, they should be ignored", () => {
        const updateVote = { inc_votes: 100, nonsense: "banana" };
        return request(app)
            .patch("/api/articles/3")
            .send(updateVote)
            .expect(200)
            .then(({ body }) => {
                const { updatedArticle } = body;

                expect(updatedArticle).toBeInstanceOf(Object);
                expect(updatedArticle).not.toHaveProperty("nonsense");

                expect(updatedArticle).toMatchObject({
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: expect.any(String),
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
    });

    test("400: should return an error 'Bad request' when the request body contains an invalid data type", () => {
        const updateVote = { inc_votes: "nonsense" };
        return request(app)
            .patch("/api/articles/3")
            .send(updateVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });

    test("400: should return an error 'Bad request' when the article id is an invalid data type", () => {
        const updateVote = { inc_votes: 5 };
        return request(app)
            .patch("/api/articles/nonsense")
            .send(updateVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
    test("404: should respond with 'Not found' when the article id is a valid type, but does not exist", () => {
        const updateVote = { inc_votes: 5 };
        return request(app)
            .patch("/api/articles/777")
            .send(updateVote)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
});

describe("DELETE /api/comments/:comment_id", () => {
    test("204: should delete a given comment by comment_id and respond with status 204 and 'No Content'", () => {
        return request(app)
            .delete("/api/comments/3")
            .expect(204)
            .then((data) => {
                expect(data.res.statusMessage).toBe("No Content");
            });
    });

    test("404: should respond with 'Not found' if the comment id is valid data type, but does not exist", () => {
        return request(app)
            .delete("/api/comments/3333")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });

    test("400: should respond with 'Bad request' if the comment id is an invalid data type", () => {
        return request(app)
            .delete("/api/comments/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
});

describe("GET /api/users", () => {
    test("200: should respond with an array containing all user objects", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                const usersArray = body.users;

                expect(usersArray).toBeInstanceOf(Array);
                expect(usersArray).toHaveLength(4);

                usersArray.forEach((user) => {
                    expect(user).toHaveProperty("username"), expect.any(String);
                    expect(user).toHaveProperty("name"), expect.any(String);
                    expect(user).toHaveProperty("avatar_url"), expect.any(String);
                });
            });
    });
});

describe("GET /api/articles (QUERIES)", () => {
    describe("GET /api/articles?topic=mitch", () => {
        test("200: should respond with an array of all articles belonging to a specific topic sorted by date (default), the default order is descending", () => {
            return request(app)
                .get("/api/articles?topic=mitch")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;

                    expect(articles).toBeInstanceOf(Array);
                    expect(articles).toHaveLength(12);
                    expect(articles).toBeSortedBy("created_at", { descending: true });

                    articles.forEach((article) => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: "mitch",
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(String),
                        });
                    });
                });
        });

        test("404: should respond with 'Not found' if the provided topic value does not exist", () => {
            return request(app)
                .get("/api/articles?topic=nonsense")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Not found");
                });
        });

        test("404: should respond with 'Not found' if the provided topic value exists, but there are no articles attached to it", () => {
            return request(app)
                .get("/api/articles?topic=paper")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Not found");
                });
        });
    });

    describe("GET /api/articles?sort_by=author", () => {
        test("200: should respond with an array of all articles sorted by any valid column (defaults to date), the default order is descending", () => {
            return request(app)
                .get("/api/articles?sort_by=author")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;

                    expect(articles).toBeInstanceOf(Array);
                    expect(articles).toHaveLength(13);
                    expect(articles).toBeSortedBy("author", { descending: true });

                    articles.forEach((article) => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(String),
                        });
                    });
                });
        });

        test("200: should respond with an array of all articles sorted by comment_count column, the default order is descending", () => {
            return request(app)
                .get("/api/articles?sort_by=comment_count")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;

                    expect(articles).toBeInstanceOf(Array);
                    expect(articles).toHaveLength(13);
                    expect(articles).toBeSortedBy("comment_count", { descending: true, coerce: true });

                    articles.forEach((article) => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(String),
                        });
                    });
                });
        });

        test("400: should respond with 'Bad request' if provided with an incorrect sort_by value", () => {
            return request(app)
                .get("/api/articles?sort_by=nonsense")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Bad request");
                });
        });
    });

    describe("GET /api/articles?order=asc", () => {
        test("200: should respond with an array of all articles sorted by date in ascending order, the default order is descending", () => {
            return request(app)
                .get("/api/articles?order=asc")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;

                    expect(articles).toBeInstanceOf(Array);
                    expect(articles).toHaveLength(13);
                    expect(articles).toBeSortedBy("created_at");

                    articles.forEach((article) => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(String),
                        });
                    });
                });
        });

        test("400: should respond with 'Bad request' if provided with an incorrect order value", () => {
            return request(app)
                .get("/api/articles?order=anna")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Bad request");
                });
        });
    });
});
