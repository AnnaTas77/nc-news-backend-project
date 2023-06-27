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

                expect(article).toBeInstanceOf(Object);

                expect(article).toHaveProperty("author"), expect.any(String);
                expect(article).toHaveProperty("title"), expect.any(String);
                expect(article).toHaveProperty("article_id"), expect.any(Number);
                expect(article).toHaveProperty("body"), expect.any(String);
                expect(article).toHaveProperty("topic"), expect.any(String);
                expect(article).toHaveProperty("created_at"), expect.any(String);
                expect(article).toHaveProperty("votes"), expect.any(Number);
                expect(article).toHaveProperty("article_img_url"), expect.any(String);
            });
    });

    test("400: should respond with 'Bad request' when article_id is invalid", () => {
        return request(app)
            .get("/api/articles/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
});
