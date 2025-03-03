import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";

const TabLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{ title: "Home", headerShown: false, animation: "none" }}
      />
      <Tabs.Screen
        name="configuration"
        options={{
          title: "Configuraciones",
          headerShown: false,
          animation: "none",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
