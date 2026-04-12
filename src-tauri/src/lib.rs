use tauri::{Manager, PhysicalPosition, PhysicalSize, Position, Size, WindowEvent};
use tauri_plugin_store::StoreExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
    .plugin(tauri_plugin_deep_link::init())
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_store::Builder::default().build())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      #[cfg(any(target_os = "linux", all(debug_assertions, windows)))]
      {
        use tauri_plugin_deep_link::DeepLinkExt;
        let _ = app.deep_link().register("gamefit");
      }

      let window = app.get_webview_window("main").unwrap();
      if let Ok(store) = app.store("window-state.json") {
        if let Some(state) = store.get("window-state") {
          let x = state.get("x").and_then(|v| v.as_i64()).unwrap_or(0) as i32;
          let y = state.get("y").and_then(|v| v.as_i64()).unwrap_or(0) as i32;
          let w = state.get("width").and_then(|v| v.as_u64()).unwrap_or(1280) as u32;
          let h = state.get("height").and_then(|v| v.as_u64()).unwrap_or(800) as u32;
          let maximized = state.get("maximized").and_then(|v| v.as_bool()).unwrap_or(false);

          let _ = window.set_position(Position::Physical(PhysicalPosition::new(x, y)));
          let _ = window.set_size(Size::Physical(PhysicalSize::new(w, h)));
          if maximized {
            let _ = window.maximize();
          }
        }
      }
      let _ = window.show();

      Ok(())
    })
    .on_window_event(|window, event| {
      if let WindowEvent::CloseRequested { .. } = event {
        let maximized = window.is_maximized().unwrap_or(false);
        let pos = window.outer_position().unwrap_or(PhysicalPosition::new(0, 0));
        let size = window.outer_size().unwrap_or(PhysicalSize::new(1280, 800));

        if let Ok(store) = window.app_handle().store("window-state.json") {
          store.set(
            "window-state",
            serde_json::json!({
              "x": pos.x,
              "y": pos.y,
              "width": size.width,
              "height": size.height,
              "maximized": maximized,
            }),
          );
          let _ = store.save();
        }
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
