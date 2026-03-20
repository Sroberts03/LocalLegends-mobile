import { Stack } from 'expo-router';

export default function ToolsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="notifications"
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="settings"
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}