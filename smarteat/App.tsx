import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import { QuestionarioProvider } from "./src/context/Questionario"; // 1. Importe o novo provider
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      {/* 2. Envolva o AppNavigator com o QuestionarioProvider */}
      <QuestionarioProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </QuestionarioProvider>
    </AuthProvider>
  );
}