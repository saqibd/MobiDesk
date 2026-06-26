# UI Reskin Rules for Cursor

You are refactoring UI ONLY.

Do NOT change:
- Navigation structure or route names (AppNavigator, RootStackParamList).
- Any services in src/services/** (authService, firestoreService, csv import/export, barcode logic).
- Types/interfaces in src/types/**.
- Firestore queries, auth calls, or business logic inside services.

When editing screens:
- Keep all imports from ../services/** intact.
- Keep all hooks (useState, useEffect, useMemo) and handler functions intact.
- Keep function signatures the same.
- Only change:
  - JSX layout
  - UI component imports (use src/components/ui/* instead of raw primitives where appropriate)
  - Styles (StyleSheet, NativeWind classes, etc.).