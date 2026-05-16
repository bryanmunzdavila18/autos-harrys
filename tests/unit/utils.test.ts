import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges tailwind classes deduplicating conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles conditional values", () => {
    expect(cn("text-sm", false && "text-lg", "font-bold")).toBe("text-sm font-bold");
  });
});
