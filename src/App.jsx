import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Recipe from "./components/Recipe";
import Root from "./components/Root";
import Fav from "./components/Fav";
import Profile from "./components/Profile";
import Login from "./components/Login";
import AddRecipe from "./components/AddRecipe";
import Card from "./components/Card";
import ProtectedRoute from "./components/ProtectedRoute";
import { IsEditingAndLoadingContext } from "./context/IsLoadingandEditingContext";
import EditRecipe from "./components/EditRecipe";
import SignUp from "./components/SignUp";
import EditProfile from "./components/EditProfile";
import EditPassword from "./components/EditPassword";
import { RecipeValidationProvider } from "./context/RecipeValidationContext";
import { ProfileValidationProvider } from "./context/ProfileValidationContext";
import { UserAuthProvider } from "./context/UserAuthContext";
import { useContext } from "react";
import Maps from "./components/Maps";
import UserRecipes from "./components/UserRecipes";

function App() {
  const { setIsLoading } = useContext(IsEditingAndLoadingContext);

  return (
    <>
      <BrowserRouter>
        <UserAuthProvider setIsLoading={setIsLoading}>
          <Routes>
            <Route path="/" element={<Root />}>
              <Route index element={<Card />} />
              {/* <Route path="about" element={<About />} /> */}
              <Route
                path="add"
                element={
                  <ProtectedRoute>
                    <RecipeValidationProvider>
                      <AddRecipe />
                    </RecipeValidationProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit"
                element={
                  <ProtectedRoute>
                    <RecipeValidationProvider>
                      <EditRecipe />
                    </RecipeValidationProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="recipe/:id"
                element={
                  <ProtectedRoute>
                    <Recipe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="fav"
                element={
                  <ProtectedRoute>
                    <Fav />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="editProfile"
                element={
                  <ProtectedRoute>
                    <ProfileValidationProvider>
                      <EditProfile />
                    </ProfileValidationProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="editPassword"
                element={
                  <ProtectedRoute>
                    <ProfileValidationProvider>
                      <EditPassword />
                    </ProfileValidationProvider>
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<Login />} />
              <Route
                path="signup"
                element={
                  <ProfileValidationProvider>
                    <SignUp />
                  </ProfileValidationProvider>
                }
              />
              <Route
                path="/userRecipes/:id"
                element={
                  <ProfileValidationProvider>
                    <UserRecipes />
                  </ProfileValidationProvider>
                }
              />
              <Route path="map" element={<Maps />} />
            </Route>
          </Routes>
        </UserAuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
