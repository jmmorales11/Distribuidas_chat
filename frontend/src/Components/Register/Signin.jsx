import React, { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, login, activateUserStatus } from "../../Redux/Auth/Action";
import ChatImage from "./people-chatting.jpg";

const Signin = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [inputData, setInputData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { auth } = useSelector((store) => store);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(inputData)); // Asume que `login` devuelve una promesa.
    if (result?.success) {
      setSnackbarMessage("Login Successfully!!");
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage("Login refused");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((values) => ({ ...values, [name]: value }));
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (token) {
      dispatch(currentUser(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (auth.reqUser?.name) {
      dispatch(activateUserStatus(auth.reqUser.id, token));
      navigate("/");
    }
  }, [auth.reqUser, navigate, token, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-blue-800 to-blue-500">
      <div className="flex w-full max-w-5xl backdrop-filter backdrop-blur-xl bg-white bg-opacity-10 rounded-2xl shadow-2xl border border-opacity-30 border-white overflow-hidden">
        <div className="md:block w-1/2 relative">
          <img
            src={ChatImage}
            alt="People chatting"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-white drop-shadow"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={inputData.email}
                className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-20 border border-transparent rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-lg"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-white drop-shadow"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                value={inputData.password}
                className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-20 border border-transparent rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-lg"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full text-xl bg-opacity-80 text-white hover:text-blue-200 focus:outline-none transition-colors duration-300 border-b-2 border-transparent hover:border-blue-200 bg-white backdrop-filter backdrop-blur-sm px-3 py-3 rounded-lg hover:bg-opacity-75"
              >
                <span className="text-blue-500 font-semibold">Sign In</span>
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center">
            <span className="text-lg text-white drop-shadow">
              Don't have an account?
            </span>
            <button
              onClick={() => navigate("/signup")}
              className="ml-2 text-xl bg-opacity-80 text-white hover:text-blue-200 focus:outline-none transition-colors duration-300 border-b-2 border-transparent hover:border-blue-200 bg-white backdrop-filter backdrop-blur-sm px-3 py-1 rounded-lg hover:bg-opacity-75"
            >
              <span className="text-blue-500 font-semibold">Sign Up</span>
            </button>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signin;
