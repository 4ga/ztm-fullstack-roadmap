import { describe, expect, it } from "vitest";
import { parseConfig } from "../src/config";

describe("parseConfig", () => {
  it("uses default when optional vars are missing", () => {
    const result = parseConfig({});

    expect(result).toEqual({
      nodeEnv: "development",
      port: 3000,
    });
  });

  it("throws on invalid PORT", () => {
    expect(() =>
      parseConfig({
        PORT: "not-a-number",
      }),
    ).toThrow();
  });

  it("throws on invalid NODE_ENV", () => {
    expect(() => parseConfig({ NODE_ENV: "staging" })).toThrow();
  });
});
