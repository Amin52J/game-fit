export const noopSubscribe = () => () => {};
export const getTauri = () => "__TAURI__" in window;
export const getTauriServer = () => null as boolean | null;
