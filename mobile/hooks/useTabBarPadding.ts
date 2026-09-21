// The floating tab bar is position:absolute, so it overlaps screen content instead of pushing it up.
// Every tab screen pads its bottom by this amount so the last item isn't hidden behind the pill.
// The constants are shared with (tabs)/_layout.tsx so the pill and the padding can't drift apart.
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_BOTTOM_GAP = 6;

export function useTabBarPadding() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_GAP + insets.bottom + 16;
}
