// REMOVE ME — this file is unused dead code
import type { AIProviderConfig, SetupAnswers } from "@/shared/types";
import { DEFAULT_MODELS } from "@/shared/types";

export const STEPS = [
  { id: 1, label: "AI Provider" },
  { id: 2, label: "Preferences" },
  { id: 3, label: "Library" },
  { id: 4, label: "Review" },
] as const;

export const CURRENCIES = [
  { code: "EUR", label: "EUR – Euro" },
  { code: "USD", label: "USD – US Dollar" },
  { code: "GBP", label: "GBP – British Pound" },
  { code: "CAD", label: "CAD – Canadian Dollar" },
  { code: "AUD", label: "AUD – Australian Dollar" },
  { code: "JPY", label: "JPY – Japanese Yen" },
  { code: "CHF", label: "CHF – Swiss Franc" },
  { code: "CNY", label: "CNY – Chinese Yuan" },
  { code: "SEK", label: "SEK – Swedish Krona" },
  { code: "NOK", label: "NOK – Norwegian Krone" },
  { code: "DKK", label: "DKK – Danish Krone" },
  { code: "PLN", label: "PLN – Polish Złoty" },
  { code: "CZK", label: "CZK – Czech Koruna" },
  { code: "HUF", label: "HUF – Hungarian Forint" },
  { code: "RON", label: "RON – Romanian Leu" },
  { code: "BGN", label: "BGN – Bulgarian Lev" },
  { code: "HRK", label: "HRK – Croatian Kuna" },
  { code: "TRY", label: "TRY – Turkish Lira" },
  { code: "RUB", label: "RUB – Russian Ruble" },
  { code: "UAH", label: "UAH – Ukrainian Hryvnia" },
  { code: "BRL", label: "BRL – Brazilian Real" },
  { code: "MXN", label: "MXN – Mexican Peso" },
  { code: "ARS", label: "ARS – Argentine Peso" },
  { code: "CLP", label: "CLP – Chilean Peso" },
  { code: "COP", label: "COP – Colombian Peso" },
  { code: "PEN", label: "PEN – Peruvian Sol" },
  { code: "INR", label: "INR – Indian Rupee" },
  { code: "KRW", label: "KRW – South Korean Won" },
  { code: "TWD", label: "TWD – Taiwan Dollar" },
  { code: "THB", label: "THB – Thai Baht" },
  { code: "SGD", label: "SGD – Singapore Dollar" },
  { code: "MYR", label: "MYR – Malaysian Ringgit" },
  { code: "IDR", label: "IDR – Indonesian Rupiah" },
  { code: "PHP", label: "PHP – Philippine Peso" },
  { code: "VND", label: "VND – Vietnamese Dong" },
  { code: "NZD", label: "NZD – New Zealand Dollar" },
  { code: "ZAR", label: "ZAR – South African Rand" },
  { code: "ILS", label: "ILS – Israeli Shekel" },
  { code: "SAR", label: "SAR – Saudi Riyal" },
  { code: "AED", label: "AED – UAE Dirham" },
  { code: "QAR", label: "QAR – Qatari Riyal" },
  { code: "KWD", label: "KWD – Kuwaiti Dinar" },
  { code: "EGP", label: "EGP – Egyptian Pound" },
  { code: "NGN", label: "NGN – Nigerian Naira" },
  { code: "KES", label: "KES – Kenyan Shilling" },
  { code: "PKR", label: "PKR – Pakistani Rupee" },
  { code: "BDT", label: "BDT – Bangladeshi Taka" },
  { code: "HKD", label: "HKD – Hong Kong Dollar" },
] as const;

export function defaultSetupAnswers(): SetupAnswers {
  return {
    playStyle: "singleplayer",
    storyImportance: 3,
    gameplayImportance: 3,
    explorationImportance: 3,
    combatImportance: 3,
    puzzleImportance: 3,
    strategyImportance: 3,
    dealbreakers: [],
    customDealbreakers: [],
    voiceActingPreference: "preferred",
    difficultyPreference: "moderate",
    idealLength: "medium",
    currency: "EUR",
    region: "Germany",
    additionalNotes: "",
  };
}

export function defaultAiConfig(): AIProviderConfig {
  return {
    type: "anthropic",
    apiKey: "",
    model: DEFAULT_MODELS.anthropic[0] ?? "",
    baseUrl: "",
  };
}
