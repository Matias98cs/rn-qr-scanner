import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";

const TabLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{ title: "Inicio", headerShown: false }}
      />
      <Tabs.Screen
        name="scanQr"
        options={{
          title: "QR",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="configuration"
        options={{
          title: "Configuraciones",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
