import app from "app";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createConsole } from "./factories/console-factory";
import prisma from "config/database";

beforeEach(async () => {
  await prisma.console.deleteMany();
});

const server = supertest(app);

describe("GET /consoles", () => {
  it("should respond with status 200 and empty array", async () => {
    const response = await server.get("/consoles");

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it("sould respond whit status 200 and with console data", async () => {
    const console = await createConsole();

    const response = await server.get("/consoles");

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual([
      {
        id: console.id,
        name: console.name,
      },
    ]);
  });
});

describe("GET /consoles/:id", () => {
  it("should responde with status 404 when the console do not exists", async () => {
    const response = await server.get("/consoles/0");

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should responde with 200 and with console data", async () => {
    const console = await createConsole();

    const response = await server.get(`/consoles/${console.id}`);

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual({
      id: console.id,
      name: console.name,
    });
  });
});

describe("POST /consoles", () => {
  it("should respond with 422 when the body is not valid", async () => {
    const body = {
      name: 12344,
    };

    const response = await server.post("/consoles").set(body);

    expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });
});
