import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import UserRegister from '../pages/auth/UserRegister'
import ChooseRegister from '../pages/auth/ChooseRegister'
import UserLogin from '../pages/auth/UserLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'

import Home from '../pages/general/Home'
import Saved from '../pages/general/Saved'

import CreateFood from '../pages/food-partner/CreateFood'
import Profile from '../pages/food-partner/Profile'

import ProtectedRoute from './ProtectedRoute'
import AppLayout from './AppLayout'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/register" element={<ChooseRegister />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />

        {/* USER ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Saved />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* FOOD PARTNER ROUTES */}
        <Route
          path="/create-food"
          element={
            <ProtectedRoute>
              <CreateFood />
            </ProtectedRoute>
          }
        />

        <Route
          path="/food-partner/:id"
          element={<Profile />}
        />
      </Routes>
    </Router>
  )
}

export default AppRoutes
