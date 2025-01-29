import React from "react"
import { AiOutlineClose } from "react-icons/ai"

const SelectedMember = ({ handleRemoveMember, member }) => {
  return (
    <div className="flex items-center bg-blue-200 rounded-full p-1 transition-colors hover:bg-blue-300">
      <img
        className="w-7 h-7 rounded-full border border-blue-400"
        src={
          member.profile || "https://cdn.pixabay.com/photo/2023/09/04/06/59/dog-8232158_1280.jpg" || "/placeholder.svg"
        }
        alt={`${member.name}'s profile`}
      />
      <p className="px-2 text-blue-800 font-medium">{member.name}</p>
      <AiOutlineClose
        onClick={() => handleRemoveMember(member)}
        className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
      />
    </div>
  )
}

export default SelectedMember

