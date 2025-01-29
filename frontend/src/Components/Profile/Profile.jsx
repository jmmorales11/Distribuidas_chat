import { useState } from "react"
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../../Redux/Auth/Action"

const Profile = ({ handleCloseOpenProfile }) => {
  const [flag, setFlag] = useState(false)
  const [username, setUsername] = useState(null)
  const [tempPicture, setTempPicture] = useState(null)
  const { auth } = useSelector((store) => store)
  const dispatch = useDispatch()

  const handleFlag = () => {
    setFlag(true)
  }

  const handleCheckClick = (e) => {
    setFlag(false)
    const data = {
      id: auth.reqUser.id,
      token: localStorage.getItem("token"),
      data: { name: username },
    }
    dispatch(updateUser(data))
  }

  const handleChange = (e) => {
    setUsername(e.target.value)
  }

  const uploadToCloudinary = (pics) => {
    const data = new FormData()
    data.append("file", pics)
    data.append("upload_preset", "whatsapp")
    data.append("cloud_name", "dadlxgune")
    fetch("https://api.cloudinary.com/v1_1/dadlxgune/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setTempPicture(data.url.toString())
        const dataa = {
          id: auth.reqUser.id,
          token: localStorage.getItem("token"),
          data: { profile: data.url.toString() },
        }
        dispatch(updateUser(dataa))
      })
  }

  const handleUpdateName = (e) => {
    if (e.key === "Enter") {
      const data = {
        id: auth.reqUser.id,
        token: localStorage.getItem("token"),
        data: { name: username },
      }
      dispatch(updateUser(data))
    }
  }

  return (
    <div className="w-full h-full bg-blue-50">
      <div className="flex items-center space-x-10 bg-blue-400 text-white pt-16 px-10 pb-5">
        <BsArrowLeft
          className="cursor-pointer text-2xl font-bold hover:text-blue-200 transition-colors"
          onClick={handleCloseOpenProfile}
        />
        <p className="cursor-pointer font-semibold text-xl">Profile</p>
      </div>

      {/* update profile pic section */}
      <div className="flex flex-col justify-center items-center my-12">
        <label htmlFor="imgInput" className="relative group">
          <img
            className="rounded-full w-[15vw] h-[15vw] cursor-pointer border-4 border-blue-400 group-hover:border-blue-500 transition-colors"
            src={
              auth.reqUser.profile ||
              tempPicture ||
              "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0=" ||
              "/placeholder.svg"
            }
            alt="Profile"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-300">
            <BsPencil className="text-white opacity-0 group-hover:opacity-100 text-3xl" />
          </div>
        </label>

        <input onChange={(e) => uploadToCloudinary(e.target.files[0])} type="file" id="imgInput" className="hidden" />
      </div>

      {/* name section */}
      <div className="bg-white px-6 py-4 shadow-md rounded-lg mx-4">
        <p className="text-blue-800 font-medium mb-2">Your name</p>

        {!flag && (
          <div className="w-full flex justify-between items-center">
            <p className="py-3 text-blue-900">{auth.reqUser?.name || "Username"}</p>
            <BsPencil
              onClick={handleFlag}
              className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
            />
          </div>
        )}

        {flag && (
          <div className="w-full flex justify-between items-center py-2">
            <input
              onKeyPress={handleUpdateName}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              className="w-[80%] outline-none border-b-2 border-blue-500 p-2 focus:border-blue-700 transition-colors"
            />
            <BsCheck2
              onClick={handleCheckClick}
              className="cursor-pointer text-2xl text-blue-600 hover:text-blue-800 transition-colors"
            />
          </div>
        )}
      </div>

      <div className="px-6 my-5">
        <p className="py-10 text-blue-700 text-sm">
          This is not your username or pin. This name will be visible to your WhatsApp contacts.
        </p>
      </div>
    </div>
  )
}

export default Profile

