import { useState } from "react"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"
import SelectedMember from "./SelectedMember"
import ChatCard from "../ChatCard/ChatCard"
import NewGroup from "./NewGroup"
import { useDispatch, useSelector } from "react-redux"
import { searchUser } from "../../Redux/Auth/Action"

const CreateGroup = ({ setIsGroup }) => {
  const [newGroup, setNewGroup] = useState(false)
  const [groupMember, setGroupMember] = useState(new Set())
  const [query, setQuery] = useState("")
  const dispatch = useDispatch()
  const { auth } = useSelector((store) => store)
  const token = localStorage.getItem("token")

  const handleRemoveMember = (item) => {
    const updatedMembers = new Set(groupMember)
    updatedMembers.delete(item)
    setGroupMember(updatedMembers)
  }

  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }))
  }

  return (
    <div className="w-full h-full">
      {!newGroup && (
        <div>
          {/* Header */}
          <div className="flex items-center space-x-10 bg-blue-400 text-white pt-16 px-10 pb-5">
            <BsArrowLeft className="cursor-pointer text-2xl font-bold" onClick={() => setIsGroup(false)} />
            <p className="text-xl font-semibold">Add Participants</p>
          </div>

          <div className="relative bg-white py-4 px-3">
            {/* Showing and removing group members */}
            <div className="flex space-x-2 flex-wrap space-y-1">
              {groupMember.size > 0 &&
                Array.from(groupMember).map((item, index) => (
                  <SelectedMember key={index} handleRemoveMember={(item) => handleRemoveMember(item)} member={item} />
                ))}
            </div>

            {/* Adding group members */}
            <input
              type="text"
              className="outline-none border-b border-blue-200 p-2 w-[93%]"
              placeholder="Search user"
              value={query}
              onChange={(e) => {
                handleSearch(e.target.value)
                setQuery(e.target.value)
              }}
            />
          </div>

          <div className="bg-white overflow-y-scroll h-[50.3vh]">
            {query &&
              auth.searchUser?.map((item) => (
                <div
                  onClick={() => {
                    groupMember.add(item)
                    setGroupMember(groupMember)
                    setQuery("")
                  }}
                  key={item?.id}
                >
                  <hr />
                  <ChatCard userImg={item.profile} name={item.name} />
                </div>
              ))}
          </div>

          <div className="bottom-10 py-10 bg-blue-50 items-center justify-center flex">
            <div
              onClick={() => {
                setNewGroup(true)
              }}
              className="bg-blue-600 rounded-full p-4 cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <BsArrowRight className="text-white font-bold text-3xl" />
            </div>
          </div>
        </div>
      )}

      {newGroup && <NewGroup groupMember={groupMember} setIsGroup={setIsGroup} />}
    </div>
  )
}

export default CreateGroup

