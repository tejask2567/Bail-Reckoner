// Login.jsx
import React from "react";
import {
  UserCircle,
  ScaleIcon,
  Users,
  Home,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../context/AuthContext";
import { toFormData } from "../../api/axios";
import "./Login.css";

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/")} className="home-button">
      <Home size={24} />
      <span>Home</span>
    </button>
  );
};

const getRoleEndpoint = (role) => {
  const endpoints = {
    user: "/api/v1/user_auth/login",
    lawyer: "/api/v1/lawyer_auth/login",
    judge: "/api/v1/judge_auth/login",
    police: "/api/v1/police_auth/login",
  };
  return endpoints[role] || endpoints.user;
};

export const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    { id: "user", icon: UserCircle, label: "User", path: "/login/user" },
    { id: "lawyer", icon: Users, label: "Lawyer", path: "/login/lawyer" },
    { id: "judge", icon: ScaleIcon, label: "Judge", path: "/login/judge" },
    { id: "police", icon: Shield, label: "Police", path: "/login/police" },
  ];

  return (
    <div className="page-container">
      <HomeButton />
      <div className="role-selection-container">
        <h1 className="role-title">Select Your Role</h1>
        <div className="role-grid">
          {roles.map(({ id, icon: Icon, label, path }) => (
            <button
              key={id}
              onClick={() => navigate(path)}
              className="role-button"
            >
              <Icon size={48} className="role-icon" />
              <span className="role-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const oauthFormData = toFormData({
        username: formData.email,
        password: formData.password,
      });

      const response = await axiosInstance.post(
        getRoleEndpoint(role),
        oauthFormData
      );

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        const userData = {
          email: formData.email,
          role: role,
        };

        login(userData, { access_token, refresh_token });

        const roleRedirects = {
          user: "/dashboard",
          lawyer: "/lawyer-dashboard",
          judge: "/judge-dashboard",
          police: "/police-dashboard",
        };

        const defaultRedirect =
          location.state?.from?.pathname || roleRedirects[role] || "/";
        navigate(defaultRedirect, { replace: true });
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="buttons">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to roles
        </button>
        <button onClick={() => navigate("/")} className="home-button">
          <Home size={24} />
          <span>Home</span>
        </button>
      </div>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">{role} Login</h2>
            <p className="login-subtitle">Please enter your credentials</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group-login">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                disabled={isLoading}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group-login">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                disabled={isLoading}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="form-extras">
              <div className="remember-me">
                <input id="remember-me" type="checkbox" className="checkbox" />
                <label htmlFor="remember-me">Remember me</label>
              </div>

              <button
                type="button"
                className="forgot-password"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Role-specific login components
export const UserLogin = () => <LoginForm role="user" />;
export const LawyerLogin = () => <LoginForm role="lawyer" />;
export const JudgeLogin = () => <LoginForm role="judge" />;
export const PoliceLogin = () => <LoginForm role="police" />;
