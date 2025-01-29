import React, { useEffect, useState } from "react"
import { Alert, Snackbar } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { currentUser, register } from "../../Redux/Auth/Action"
import ChatImage from "./people_register.jpg"

const Signup = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const { auth } = useSelector((store) => store)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem("token")

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(register(inputData))
    setOpenSnackbar(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputData((values) => ({ ...values, [name]: value }))
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return
    setOpenSnackbar(false)
  }

  useEffect(() => {
    if (token) dispatch(currentUser(token))
  }, [token, dispatch])

  useEffect(() => {
    if (auth.reqUser?.name) {
      navigate("/")
    }
  }, [auth.reqUser, navigate])

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-blue-800 to-blue-500">
      <div className="flex flex-col md:flex-row w-full max-w-5xl backdrop-filter backdrop-blur-xl bg-white bg-opacity-10 rounded-2xl shadow-2xl border border-opacity-30 border-white overflow-hidden">
        <div className="w-full md:w-1/2 p-4 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-6 md:mb-8 drop-shadow-lg">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="name" className="block text-base md:text-lg font-medium text-white drop-shadow">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                value={inputData.name}
                className="mt-1 block w-full px-3 md:px-4 py-2 md:py-3 bg-white bg-opacity-20 border border-transparent rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-base md:text-lg"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-base md:text-lg font-medium text-white drop-shadow">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={inputData.email}
                className="mt-1 block w-full px-3 md:px-4 py-2 md:py-3 bg-white bg-opacity-20 border border-transparent rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-base md:text-lg"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base md:text-lg font-medium text-white drop-shadow">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                value={inputData.password}
                className="mt-1 block w-full px-3 md:px-4 py-2 md:py-3 bg-white bg-opacity-20 border border-transparent rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-base md:text-lg"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full text-lg md:text-xl bg-opacity-80 text-white hover:text-blue-200 focus:outline-none transition-colors duration-300 border-b-2 border-transparent hover:border-blue-200 bg-white backdrop-filter backdrop-blur-sm px-3 py-2 md:py-3 rounded-lg hover:bg-opacity-75"
              >
                <span className="text-blue-500 font-semibold">Sign Up</span>
              </button>
            </div>
          </form>

          <div className="mt-6 md:mt-8 flex items-center justify-center">
            <span className="text-base md:text-lg text-white drop-shadow">Already have an account?</span>
            <button
              onClick={() => navigate("/signin")}
              className="ml-2 text-lg md:text-xl bg-opacity-80 text-white hover:text-blue-200 focus:outline-none transition-colors duration-300 border-b-2 border-transparent hover:border-blue-200 bg-white backdrop-filter backdrop-blur-sm px-2 md:px-3 py-1 rounded-lg hover:bg-opacity-75"
            >
              <span className="text-blue-500 font-semibold">Sign In</span>
            </button>
          </div>
        </div>
        <div className="hidden md:block w-full md:w-1/2 relative">
          <img src={ChatImage || "/placeholder.svg"} alt="People chatting" className="w-full h-full object-cover" />
        </div>
      </div>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Your account has been successfully created!!
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Signup

