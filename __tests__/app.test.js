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
