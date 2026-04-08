import { describe, expect, it } from "vitest";
import { computeTargetPrice, type RiskLevel } from "./response-parser";

describe("computeTargetPrice", () => {
  const fp = 60;

  function calc(
    score: number,
    risk: RiskLevel = "none",
    confidence: string | null = "High",
    refund = false,
  ) {
    return computeTargetPrice(score, risk, confidence, fp, refund);
  }

  it("returns 'Don't buy' when adjusted score < 40", () => {
    expect(calc(35).label).toBe("Don't buy");
    expect(calc(35).value).toBeNull();
    expect(calc(39).label).toBe("Don't buy");
  });

  it("returns full price when adjusted score >= 92", () => {
    expect(calc(95).value).toBe(60);
    expect(calc(92).value).toBe(60);
  });

  it("returns less than full price at score 85", () => {
    expect(calc(85).value).toBeLessThan(60);
    expect(calc(85).value).toBeGreaterThan(40);
  });

  it("gives continuous prices with no cliffs at band boundaries", () => {
    const p64 = calc(64).value!;
    const p65 = calc(65).value!;
    expect(Math.abs(p65 - p64)).toBeLessThanOrEqual(2);
  });

  it("applies risk penalty for high risk", () => {
    const noRisk = calc(75, "none");
    const highRisk = calc(75, "high");
    expect(highRisk.value!).toBeLessThan(noRisk.value!);
  });

  it("applies risk penalty for medium risk", () => {
    const noRisk = calc(75, "none");
    const medRisk = calc(75, "medium");
    expect(medRisk.value!).toBeLessThan(noRisk.value!);
    expect(medRisk.value!).toBeGreaterThan(calc(75, "high").value!);
  });

  it("applies low-confidence penalty when risk is present", () => {
    const high = calc(70, "medium", "High");
    const low = calc(70, "medium", "Low");
    expect(low.value!).toBeLessThan(high.value!);
  });

  it("does not apply low-confidence penalty when risk is none", () => {
    const high = calc(70, "none", "High");
    const low = calc(70, "none", "Low");
    expect(low.value).toBe(high.value);
  });

  it("refund guard boosts the price", () => {
    const noRefund = calc(75, "high", "High", false);
    const withRefund = calc(75, "high", "High", true);
    expect(withRefund.value!).toBeGreaterThan(noRefund.value!);
  });

  it("refund guard has no effect when there are no deductions", () => {
    const noRefund = calc(80, "none", "High", false);
    const withRefund = calc(80, "none", "High", true);
    expect(withRefund.value).toBe(noRefund.value);
  });

  it("produces smooth increments across the range", () => {
    const prices: number[] = [];
    for (let s = 40; s <= 92; s++) {
      const r = calc(s);
      prices.push(r.value ?? 0);
    }
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it("produces conservative mid-range prices", () => {
    const at75 = calc(75).value!;
    expect(at75).toBeLessThan(fp * 0.65);
    expect(at75).toBeGreaterThan(fp * 0.40);
  });
});
