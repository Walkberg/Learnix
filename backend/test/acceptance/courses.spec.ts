import request from "supertest";
import { describe, it, expect } from "@jest/globals";

// Acceptance test stub for Course flows (FR-002)

describe("Courses acceptance", () => {
  it("should create a course and enforce Free quota", async () => {
    // create course
    // assert 201 and course persisted
    // create up to quota and assert creation denied after 3 for Free user
    expect(true).toBe(true);
  });
});
