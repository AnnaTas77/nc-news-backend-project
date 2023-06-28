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
                const articlesArray = body.articles;

                expect(articlesArray).toBeInstanceOf(Array);
                expect(articlesArray).toHaveLength(13);
                expect(articlesArray).toBeSortedBy("created_at", { descending: true });

                articlesArray.forEach((article) => {
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
                const commentsArray = body.comments;

                expect(commentsArray).toBeInstanceOf(Array);
                expect(commentsArray).toHaveLength(11);
                expect(commentsArray).toBeSortedBy("created_at", { descending: true });

                commentsArray.forEach((comment) => {
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
                // console.log("postedComment =>>", postedComment);

                expect(postedComment).toBeInstanceOf(Object);

                expect(postedComment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                });
            });
    });

    test("400: should respond with 'Bad request' when trying to post a comment with missing fields (malformed request)", () => {
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

    test("400: should respond with 'Bad request' when article_id is an invalid type", () => {
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
});
