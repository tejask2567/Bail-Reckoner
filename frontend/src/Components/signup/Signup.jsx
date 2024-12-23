// Signup.jsx
import React, { useState } from "react";
import {
  UserCircle,
  ScaleIcon,
  Users,
  Home,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import "./Signup.css";
const roles = [
  {
    id: "user",
    icon: UserCircle,
    label: "User",
    path: "/signup/user",
    endpoint: "/user/create",
  },
  {
    id: "lawyer",
    icon: Users,
    label: "Lawyer",
    path: "/signup/lawyer",
    endpoint: "/lawyer/create",
  },
  {
    id: "judge",
    icon: ScaleIcon,
    label: "Judge",
    path: "/signup/judge",
    endpoint: "/judge/create",
  },
  {
    id: "police",
    icon: Shield,
    label: "Police",
    path: "/signup/police",
    endpoint: "/police/create",
  },
];

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/")} className="home-button">
      <Home size={24} />
      <span>Home</span>
    </button>
  );
};

const SignupRoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <HomeButton />
      <div className="role-selection-container">
        <h1 className="role-title">Create Your Account</h1>
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

// User Signup Form
const UserSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const userData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      const response = await axiosInstance.post(
        "/api/v1/users/create",
        userData
      );
      console.log("Signup successful:", response.data);
      alert("User signup successful!");
      navigate("/login/user");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(
        error.response?.data?.detail || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="buttons">
        <button className="back-button1" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to roles
        </button>
      </div>
      <HomeButton />
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h2 className="signup-title">User Registration</h2>
            <p className="signup-subtitle">
              Create your account to get started
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group-signup">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group-signup">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-button">
                Create Account
              </button>
              <p className="login-link">
                Already have an account?
                <button
                  type="button"
                  onClick={() => navigate("/login/user")}
                  className="text-button"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Lawyer Signup Form
const LawyerSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    barname: "",
    barid: "",
    password: "",
    first_name: "",
    last_name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const lawyerData = {
        email: formData.email,
        barname: formData.barname,
        barid: formData.barid,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      const response = await axiosInstance.post(
        "/api/v1/lawyer/create",
        lawyerData
      );
      console.log("Lawyer signup successful:", response.data);
      alert("Lawyer signup successful!");
      navigate("/login/lawyer");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(
        error.response?.data?.detail || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="buttons">
        <button className="back-button1" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to roles
        </button>
      </div>
      <HomeButton />
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h2 className="signup-title">Lawyer Registration</h2>
            <p className="signup-subtitle">Create your lawyer account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group-signup">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="barname">Bar Name</label>
                <input
                  id="barname"
                  type="text"
                  required
                  value={formData.barname}
                  onChange={(e) =>
                    setFormData({ ...formData, barname: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="barid">Bar ID</label>
                <input
                  id="barid"
                  type="text"
                  required
                  value={formData.barid}
                  onChange={(e) =>
                    setFormData({ ...formData, barid: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-button">
                Create Account
              </button>
              <p className="login-link">
                Already have an account?
                <button
                  type="button"
                  onClick={() => navigate("/login/lawyer")}
                  className="text-button"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Judge Signup Form
const JudgeSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    barid: "",
    judgeid: "",
    password: "",
    first_name: "",
    last_name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const judgeData = {
        email: formData.email,
        barid: formData.barid,
        judgeid: formData.judgeid,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      const response = await axiosInstance.post(
        "/api/v1/judge/create",
        judgeData
      );
      console.log("Judge signup successful:", response.data);
      alert("judge signup successful!");
      navigate("/login/judge");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(
        error.response?.data?.detail || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="buttons">
        <button className="back-button1" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to roles
        </button>
      </div>
      <HomeButton />
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h2 className="signup-title">Judge Registration</h2>
            <p className="signup-subtitle">Create your judge account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group-signup">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="barid">Bar ID</label>
                <input
                  id="barid"
                  type="text"
                  required
                  value={formData.barid}
                  onChange={(e) =>
                    setFormData({ ...formData, barid: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="judgeid">Judge ID</label>
                <input
                  id="judgeid"
                  type="text"
                  required
                  value={formData.judgeid}
                  onChange={(e) =>
                    setFormData({ ...formData, judgeid: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-button">
                Create Account
              </button>
              <p className="login-link">
                Already have an account?
                <button
                  type="button"
                  onClick={() => navigate("/login/judge")}
                  className="text-button"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Police Signup Form
const PoliceSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    badge_number: "",
    station_name: "",
    password: "",
    first_name: "",
    last_name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const policeData = {
        email: formData.email,
        badge_number: formData.badge_number,
        station_name: formData.station_name,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      const response = await axiosInstance.post(
        "/api/v1/police/create",
        policeData
      );
      console.log("Police signup successful:", response.data);
      alert("Police signup successful!");
      navigate("/login/police");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(
        error.response?.data?.detail || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="buttons">
        <button className="back-button1" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to roles
        </button>
      </div>
      <HomeButton />
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h2 className="signup-title">Police Registration</h2>
            <p className="signup-subtitle">Create your police account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group-signup">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="badge_number">Badge Number</label>
                <input
                  id="badge_number"
                  type="text"
                  required
                  value={formData.badge_number}
                  onChange={(e) =>
                    setFormData({ ...formData, badge_number: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="station_name">Station Name</label>
                <input
                  id="station_name"
                  type="text"
                  required
                  value={formData.station_name}
                  onChange={(e) =>
                    setFormData({ ...formData, station_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group-signup">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="form-group-signup">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-button">
                Create Account
              </button>
              <p className="login-link">
                Already have an account?
                <button
                  type="button"
                  onClick={() => navigate("/login/police")}
                  className="text-button"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export {
  SignupRoleSelection,
  UserSignupForm,
  LawyerSignupForm,
  JudgeSignupForm,
  PoliceSignupForm,
};
