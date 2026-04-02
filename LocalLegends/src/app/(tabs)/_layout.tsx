import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions= {{ 
      tabBarStyle: {
          width: '90%',
          height: 60,
          borderRadius: 30,
          bottom: 30,
          position: 'absolute',
          left: '50%',
          marginLeft: '5%',
          shadowColor: '#000000aa',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
      },
      tabBarActiveTintColor: '#6366f1',
      tabBarInactiveTintColor: '#94a3b8',
      headerShown: false 
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Play',
          tabBarIcon: ({ color }) => <Ionicons name="basketball" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="myGames"
        options={{
          title: 'My Games',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}