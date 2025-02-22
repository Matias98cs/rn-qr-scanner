import { View, Text, StyleSheet, SafeAreaView, Pressable, useWindowDimensions } from "react-native";
import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const {height} = useWindowDimensions()
  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView
      style={{
        paddingTop: height * 0.1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      <Text style={styles.title}>QR Code Scanner</Text>
      <View style={{ gap: 20, paddingTop: 20 }}>
        <Pressable onPress={requestPermission}>
          <Text style={styles.buttonStyle}>Request Permissions</Text>
        </Pressable>
        <Link href={"/scanner"} asChild>
          <Pressable disabled={!isPermissionGranted}>
            <Text
              style={[
                styles.buttonStyle,
                {
                  opacity: !isPermissionGranted ? 0.5 : 1,
                },
              ]}
            >
              Scan Code
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
});
