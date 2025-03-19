import { useSessionById } from "@/hooks/useSessionById";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const index = () => {
  const { id, name, date } = useLocalSearchParams();
  const navigation = useNavigation();
  const textColor = useThemeColor({}, "text");
  const { refetch, qrCodes, error, loading } = useSessionById(
    id.toLocaleString()
  );

  const dateTransform = (dateString: string): string => {
    const clean = dateString.trim().replace(/,/g, "").replace(" ", "T");
    const date = new Date(clean);

    if (isNaN(date.getTime())) {
      console.error("Fecha inválida:", dateString);
      return "";
    }

    const base = date
      .toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
      .replace(",", "");

    const year = date.getFullYear();
    return `${base} del ${year}`;
  };

  useEffect(() => {
    navigation.setOptions({ title: `${name ? name : "QR"}` });

    return () => {
      // Cleanup
      navigation.setOptions({ title: "QRs" });
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerDate}>
        <Text style={[{ color: textColor }, styles.text]}>Creado el</Text>
        <Text style={[{ color: textColor }, styles.textDate]}>
          {date
            ? dateTransform(Array.isArray(date) ? date[0] : date)
            : "Sin fecha"}
        </Text>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  containerDate: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    paddingTop: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textDate: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
