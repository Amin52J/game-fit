"use client";
import React, { createContext, useContext, useCallback, useEffect, useReducer, useState } from "react";
import type {
  AppState,
  AIProviderConfig,
  Game,
  SetupAnswers,
  AnalysisResult,
} from "@/shared/types";
import { INITIAL_STATE } from "@/shared/types";
import { useAuth } from "./AuthProvider";
import * as db from "@/shared/api/db";

type Action =
  | { type: "INIT"; payload: AppState }
  | { type: "SET_AI_PROVIDER"; payload: AIProviderConfig }
  | { type: "SET_GAMES"; payload: Game[] }
  | { type: "ADD_GAME"; payload: Game }
  | { type: "UPDATE_GAME"; payload: Game }
  | { type: "DELETE_GAME"; payload: string }
  | { type: "SET_INSTRUCTIONS"; payload: string }
  | { type: "SET_SETUP_ANSWERS"; payload: SetupAnswers }
  | { type: "COMPLETE_SETUP" }
  | { type: "ADD_ANALYSIS"; payload: AnalysisResult }
  | { type: "DELETE_ANALYSIS"; payload: string }
  | { type: "CLEAR_HISTORY" }
  | { type: "RESET" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "SET_AI_PROVIDER":
      return { ...state, aiProvider: action.payload };
    case "SET_GAMES":
      return { ...state, games: action.payload };
    case "ADD_GAME":
      return { ...state, games: [...state.games, action.payload] };
    case "UPDATE_GAME":
      return {
        ...state,
        games: state.games.map((g) => (g.id === action.payload.id ? action.payload : g)),
      };
    case "DELETE_GAME":
      return { ...state, games: state.games.filter((g) => g.id !== action.payload) };
    case "SET_INSTRUCTIONS":
      return { ...state, instructions: action.payload };
    case "SET_SETUP_ANSWERS":
      return { ...state, setupAnswers: action.payload };
    case "COMPLETE_SETUP":
      return { ...state, isSetupComplete: true };
    case "ADD_ANALYSIS":
      return { ...state, analysisHistory: [action.payload, ...state.analysisHistory] };
    case "DELETE_ANALYSIS":
      return {
        ...state,
        analysisHistory: state.analysisHistory.filter((a) => a.id !== action.payload),
      };
    case "CLEAR_HISTORY":
      return { ...state, analysisHistory: [] };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  dispatch: React.Dispatch<Action>;
  setAIProvider: (config: AIProviderConfig) => void;
  setGames: (games: Game[]) => void;
  addGame: (game: Game) => void;
  updateGame: (game: Game) => void;
  deleteGame: (id: string) => void;
  setInstructions: (instructions: string) => void;
  setSetupAnswers: (answers: SetupAnswers) => void;
  completeSetup: () => void;
  addAnalysis: (result: AnalysisResult) => void;
  deleteAnalysis: (id: string) => void;
  clearHistory: () => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch({ type: "INIT", payload: INITIAL_STATE });
      setHydrated(false);
      return;
    }
    let cancelled = false;
    setHydrated(false);
    db.loadUserState().then((loaded) => {
      if (!cancelled) {
        dispatch({ type: "INIT", payload: loaded });
        setHydrated(true);
      }
    });
    return () => { cancelled = true; };
  }, [user]);

  const setAIProvider = useCallback((config: AIProviderConfig) => {
    dispatch({ type: "SET_AI_PROVIDER", payload: config });
    db.saveAIProvider(config);
  }, []);

  const setGames = useCallback((games: Game[]) => {
    dispatch({ type: "SET_GAMES", payload: games });
    db.saveAllGames(games);
  }, []);

  const addGame = useCallback((game: Game) => {
    dispatch({ type: "ADD_GAME", payload: game });
    db.insertGame(game);
  }, []);

  const updateGame = useCallback((game: Game) => {
    dispatch({ type: "UPDATE_GAME", payload: game });
    db.updateGame(game);
  }, []);

  const deleteGame = useCallback((id: string) => {
    dispatch({ type: "DELETE_GAME", payload: id });
    db.deleteGame(id);
  }, []);

  const setInstructions = useCallback((instructions: string) => {
    dispatch({ type: "SET_INSTRUCTIONS", payload: instructions });
    db.saveInstructions(instructions);
  }, []);

  const setSetupAnswers = useCallback((answers: SetupAnswers) => {
    dispatch({ type: "SET_SETUP_ANSWERS", payload: answers });
    db.saveSetupAnswers(answers);
  }, []);

  const completeSetup = useCallback(() => {
    dispatch({ type: "COMPLETE_SETUP" });
    db.saveSetupComplete(true);
  }, []);

  const addAnalysis = useCallback((result: AnalysisResult) => {
    dispatch({ type: "ADD_ANALYSIS", payload: result });
    db.insertAnalysis(result);
  }, []);

  const deleteAnalysis = useCallback((id: string) => {
    dispatch({ type: "DELETE_ANALYSIS", payload: id });
    db.deleteAnalysis(id);
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
    db.clearHistory();
  }, []);

  const resetApp = useCallback(() => {
    dispatch({ type: "RESET" });
    db.resetUserData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        hydrated,
        dispatch,
        setAIProvider,
        setGames,
        addGame,
        updateGame,
        deleteGame,
        setInstructions,
        setSetupAnswers,
        completeSetup,
        addAnalysis,
        deleteAnalysis,
        clearHistory,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
