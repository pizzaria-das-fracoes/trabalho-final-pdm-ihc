import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/view/theme";

export type TabItem<T extends string> = {
  id: T;
  label: string;
  activeColor?: string;
};

type SegmentedTabsProps<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (next: T) => void;
};

export const SegmentedTabs = <T extends string>({
  items,
  value,
  onChange
}: SegmentedTabsProps<T>) => (
  <View style={styles.track} accessibilityRole="tablist">
    {items.map((item) => {
      const active = item.id === value;
      return (
        <Pressable
          key={item.id}
          onPress={() => onChange(item.id)}
          accessibilityRole="tab"
          accessibilityState={{ selected: active }}
          style={({ pressed }) => [
            styles.tab,
            active
              ? {
                  backgroundColor: item.activeColor ?? theme.color.magic,
                  borderColor: theme.color.segmentedBorder,
                  borderBottomWidth: pressed ? 2 : 4,
                  transform: [{ translateY: pressed ? 1.5 : 0 }]
                }
              : pressed && styles.tabPressed
          ]}
        >
          <Text
            numberOfLines={1}
            selectable={false}
            style={[styles.label, active && styles.labelActive]}
          >
            {item.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    gap: theme.space.sm,
    padding: theme.space.xsPlus,
    borderRadius: 16,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.outlineVariant
  },
  tab: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: theme.space.base,
    paddingVertical: theme.space.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.color.transparent,
    alignItems: "center",
    justifyContent: "center"
  },
  tabPressed: {
    backgroundColor: theme.color.surfaceLow
  },
  label: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 13,
    color: theme.color.onSurfaceMuted
  },
  labelActive: {
    color: theme.color.white
  }
});
