import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";
import VerifyEmailScreen from "./screens/VerifyEmailScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import WorkoutPlanScreen from "./screens/WorkoutPlanScreen";
import CreateWorkoutScreen from "./screens/CreateWorkoutScreen";
import WorkoutDetailScreen from "./screens/WorkoutDetailScreen";
import ProgressScreen from "./screens/ProgressScreen";
import AddProgressScreen from "./screens/AddProgressScreen";
import WorkoutCompletionScreen from "./screens/WorkoutCompletionScreen";
import WorkoutHistoryScreen from "./screens/WorkoutHistoryScreen";
import WorkoutHistoryDetailScreen from "./screens/WorkoutHistoryDetailScreen";
import Notebook from "./screens/Notebook";
import NotebookDetail from "./screens/NotebookDetail";
import BMIScreen from "./screens/BMIScreen";
import BlogScreen from "./screens/blogs/BlogsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
        <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="AddProgress" component={AddProgressScreen} />
        <Stack.Screen name="Notebook" component={Notebook} />
        <Stack.Screen name="NotebookDetail" component={NotebookDetail} />
        <Stack.Screen
          name="WorkoutCompletion"
          component={WorkoutCompletionScreen}
        />
        <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
        <Stack.Screen
          name="WorkoutHistoryDetail"
          component={WorkoutHistoryDetailScreen}
        />
        <Stack.Screen name="BMIGuide" component={BMIScreen} />
        <Stack.Screen name="Blogs" component={BlogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
