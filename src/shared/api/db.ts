import { getSupabase } from "./supabase";
import type {
  AppState,
  AIProviderConfig,
  Game,
  SetupAnswers,
  AnalysisResult,
} from "@/shared/types";
import { INITIAL_STATE } from "@/shared/types";

interface SettingsRow {
  id: string;
  ai_provider: Record<string, unknown> | null;
  setup_answers: Record<string, unknown> | null;
  instructions: string;
  is_setup_complete: boolean;
}

interface GameRow {
  id: string;
  name: string;
  sorting_name: string | null;
  score: number | null;
}

interface AnalysisRow {
  id: string;
  game_name: string;
  price: number;
  response: string;
  timestamp: number;
}

async function uid(): Promise<string | null> {
  const { data: { user } } = await getSupabase().auth.getUser();
  return user?.id ?? null;
}

// ——— Load full user state ———

export async function loadUserState(): Promise<AppState> {
  const sb = getSupabase();
  const id = await uid();
  if (!id) return INITIAL_STATE;

  const [settingsRes, gamesRes, historyRes] = await Promise.all([
    sb.from("user_settings").select("*").eq("id", id).single(),
    sb.from("games").select("*").eq("user_id", id),
    sb.from("analysis_history").select("*").eq("user_id", id).order("timestamp", { ascending: false }),
  ]);

  const s = settingsRes.data as SettingsRow | null;
  const games: Game[] = ((gamesRes.data ?? []) as GameRow[]).map((g) => ({
    id: g.id,
    name: g.name,
    sortingName: g.sorting_name ?? undefined,
    score: g.score,
  }));
  const history: AnalysisResult[] = ((historyRes.data ?? []) as AnalysisRow[]).map((h) => ({
    id: h.id,
    gameName: h.game_name,
    price: Number(h.price),
    response: h.response,
    timestamp: Number(h.timestamp),
  }));

  return {
    isSetupComplete: s?.is_setup_complete ?? false,
    aiProvider: (s?.ai_provider as unknown as AIProviderConfig) ?? null,
    games,
    instructions: s?.instructions ?? "",
    setupAnswers: (s?.setup_answers as unknown as SetupAnswers) ?? null,
    analysisHistory: history,
  };
}

// ——— Settings ———

export async function saveAIProvider(provider: AIProviderConfig) {
  const id = await uid();
  if (!id) return;
  await getSupabase()
    .from("user_settings")
    .update({ ai_provider: provider as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function saveInstructions(instructions: string) {
  const id = await uid();
  if (!id) return;
  await getSupabase()
    .from("user_settings")
    .update({ instructions, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function saveSetupAnswers(answers: SetupAnswers) {
  const id = await uid();
  if (!id) return;
  await getSupabase()
    .from("user_settings")
    .update({ setup_answers: answers as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function saveSetupComplete(complete: boolean) {
  const id = await uid();
  if (!id) return;
  await getSupabase()
    .from("user_settings")
    .update({ is_setup_complete: complete, updated_at: new Date().toISOString() })
    .eq("id", id);
}

// ——— Games ———

export async function saveAllGames(games: Game[]) {
  const id = await uid();
  if (!id) return;
  const sb = getSupabase();

  await sb.from("games").delete().eq("user_id", id);

  if (games.length === 0) return;

  const BATCH_SIZE = 500;
  for (let i = 0; i < games.length; i += BATCH_SIZE) {
    const batch = games.slice(i, i + BATCH_SIZE).map((g) => ({
      id: g.id,
      user_id: id,
      name: g.name,
      sorting_name: g.sortingName ?? null,
      score: g.score,
    }));
    await sb.from("games").insert(batch);
  }
}

export async function insertGame(game: Game) {
  const id = await uid();
  if (!id) return;
  await getSupabase().from("games").insert({
    id: game.id,
    user_id: id,
    name: game.name,
    sorting_name: game.sortingName ?? null,
    score: game.score,
  });
}

export async function updateGame(game: Game) {
  const id = await uid();
  if (!id) return;
  await getSupabase()
    .from("games")
    .update({ name: game.name, sorting_name: game.sortingName ?? null, score: game.score })
    .eq("id", game.id)
    .eq("user_id", id);
}

export async function deleteGame(gameId: string) {
  const id = await uid();
  if (!id) return;
  await getSupabase().from("games").delete().eq("id", gameId).eq("user_id", id);
}

// ——— Analysis History ———

export async function insertAnalysis(result: AnalysisResult) {
  const id = await uid();
  if (!id) return;
  await getSupabase().from("analysis_history").insert({
    id: result.id,
    user_id: id,
    game_name: result.gameName,
    price: result.price,
    response: result.response,
    timestamp: result.timestamp,
  });
}

export async function deleteAnalysis(analysisId: string) {
  const id = await uid();
  if (!id) return;
  await getSupabase().from("analysis_history").delete().eq("id", analysisId).eq("user_id", id);
}

export async function clearHistory() {
  const id = await uid();
  if (!id) return;
  await getSupabase().from("analysis_history").delete().eq("user_id", id);
}

// ——— Full Reset ———

export async function resetUserData() {
  const id = await uid();
  if (!id) return;
  const sb = getSupabase();
  await Promise.all([
    sb.from("games").delete().eq("user_id", id),
    sb.from("analysis_history").delete().eq("user_id", id),
    sb.from("user_settings").update({
      ai_provider: null,
      setup_answers: null,
      instructions: "",
      is_setup_complete: false,
      updated_at: new Date().toISOString(),
    }).eq("id", id),
  ]);
}
