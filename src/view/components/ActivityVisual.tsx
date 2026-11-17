import { StyleSheet, Text, View } from "react-native";
import { FractionDisplay } from "@/view/components/FractionDisplay";
import { Pizza } from "@/view/components/Pizza";
import { tokens } from "@/view/tokens";

export type ActivityVisualKind = "equivalent" | "numberLine" | "decimal" | "quantity" | "operations";

const SegmentedBar = ({ selected, total }: { selected: number; total: number }) => (
  <View style={styles.bar}>
    {Array.from({ length: total }, (_, index) => (
      <View key={index} style={[styles.segment, index < selected && styles.segmentSelected, index < total - 1 && styles.segmentBorder]} />
    ))}
  </View>
);

export const ActivityVisual = ({ kind }: { kind: ActivityVisualKind }) => {
  if (kind === "equivalent") {
    return (
      <View style={styles.card}>
        <Text style={styles.caption}>Pizza de referência</Text>
        <Pizza denominator={3} selected={[0, 1]} label="Pizza de referência com duas de três fatias pintadas" size={144} showSummary={false} />
        <FractionDisplay numerator={2} denominator={3} />
      </View>
    );
  }

  if (kind === "numberLine") {
    return (
      <View accessible accessibilityRole="image" accessibilityLabel="Reta de zero a dois. Três meios está no meio entre um e dois." style={styles.card}>
        <Text style={styles.caption}>Encontre 3/2 na reta</Text>
        <View style={styles.lineArea}>
          <View style={styles.track} />
          <View style={styles.marker}>
            <View style={styles.markerDot} />
            <Text style={styles.markerLabel}>3/2</Text>
          </View>
          <View style={styles.ticks}>
            <Text style={styles.tickLabel}>0</Text><Text style={styles.tickLabel}>1</Text><Text style={styles.tickLabel}>2</Text>
          </View>
        </View>
      </View>
    );
  }

  if (kind === "decimal") {
    return (
      <View style={styles.card}>
        <Text style={styles.caption}>A mesma parte, de dois jeitos</Text>
        <View style={styles.horizontal}>
          <Pizza denominator={4} selected={[0]} label="Uma de quatro partes pintada" size={112} showSummary={false} />
          <Text style={styles.equals}>=</Text>
          <Text style={styles.decimal}>0,25</Text>
        </View>
        <Text style={styles.helper}>Um quarto também é vinte e cinco centésimos.</Text>
      </View>
    );
  }

  if (kind === "quantity") {
    return (
      <View accessible accessibilityRole="image" accessibilityLabel="Vinte objetos divididos em quatro grupos de cinco. Três grupos, quinze objetos, estão destacados." style={styles.card}>
        <Text style={styles.caption}>3/4 de 20 objetos</Text>
        <View style={styles.groups}>
          {Array.from({ length: 4 }, (_, group) => (
            <View key={group} style={styles.group}>
              {Array.from({ length: 5 }, (_, item) => (
                <View key={item} style={[styles.object, group < 3 && styles.objectSelected]} />
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.helper}>4 grupos iguais · 3 grupos destacados</Text>
      </View>
    );
  }

  return (
    <View accessible accessibilityRole="image" accessibilityLabel="Um meio são três sextos. Um terço são dois sextos. Juntos são cinco sextos." style={styles.card}>
      <Text style={styles.caption}>Transforme em partes iguais</Text>
      <View style={styles.equationRow}><Text style={styles.equationLabel}>1/2 = 3/6</Text><SegmentedBar selected={3} total={6} /></View>
      <View style={styles.equationRow}><Text style={styles.equationLabel}>1/3 = 2/6</Text><SegmentedBar selected={2} total={6} /></View>
      <View style={styles.equationRow}><Text style={styles.equationLabel}>Total = 5/6</Text><SegmentedBar selected={5} total={6} /></View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { width: "100%", alignItems: "center", gap: tokens.space.md, padding: tokens.space.md, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.surfaceLow },
  caption: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24, fontWeight: "500", textAlign: "center" },
  lineArea: { width: "100%", height: 88, justifyContent: "center" },
  track: { height: tokens.activity.line, backgroundColor: tokens.color.outline, borderRadius: tokens.shape.full },
  marker: { position: "absolute", left: "75%", top: tokens.space.xs, alignItems: "center", transform: [{ translateX: -tokens.space.sm }] },
  markerDot: { width: tokens.activity.marker, height: tokens.activity.marker, borderRadius: tokens.shape.full, backgroundColor: tokens.color.action, borderWidth: 2, borderColor: tokens.color.surface },
  markerLabel: { marginTop: tokens.space.xs, color: tokens.color.action, fontSize: tokens.type.label, fontWeight: "700" },
  ticks: { position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", justifyContent: "space-between" },
  tickLabel: { color: tokens.color.onSurface, fontSize: tokens.type.label },
  horizontal: { width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: tokens.space.md },
  equals: { color: tokens.color.onSurface, fontSize: tokens.type.title, fontWeight: "700" },
  decimal: { color: tokens.color.action, fontSize: tokens.type.title, fontWeight: "700" },
  helper: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20, textAlign: "center" },
  groups: { alignSelf: "center", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: tokens.activity.groupGap, maxWidth: 200 },
  group: { width: 72, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: tokens.space.xs, padding: tokens.space.xs, borderWidth: 1, borderColor: tokens.color.outlineVariant, borderRadius: tokens.shape.small },
  object: { width: tokens.activity.item, height: tokens.activity.item, borderRadius: tokens.shape.full, backgroundColor: tokens.color.surfaceHigh },
  objectSelected: { backgroundColor: tokens.color.action },
  equationRow: { width: "100%", flexDirection: "row", alignItems: "center", gap: tokens.space.sm },
  equationLabel: { width: 96, color: tokens.color.onSurface, fontSize: tokens.type.label, fontWeight: "700" },
  bar: { flex: 1, height: tokens.activity.item, flexDirection: "row", overflow: "hidden", borderRadius: tokens.shape.small, borderWidth: 1, borderColor: tokens.color.outline },
  segment: { flex: 1, backgroundColor: tokens.color.surface },
  segmentSelected: { backgroundColor: tokens.color.action },
  segmentBorder: { borderRightWidth: 1, borderRightColor: tokens.color.onSurface }
});
