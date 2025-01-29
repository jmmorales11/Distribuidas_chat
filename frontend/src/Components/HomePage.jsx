import React, { useEffect, useRef, useState } from "react"
import "./HomePage.css"
import { useNavigate } from "react-router-dom"
import Profile from "./Profile/Profile"
import CreateGroup from "./Group/CreateGroup"
import { useDispatch, useSelector } from "react-redux"
import { currentUser, logoutAction, searchUser, deactivateUserStatus } from "../Redux/Auth/Action"
import { createChat, getUsersChat } from "../Redux/Chat/Action"
import { createMessage, getAllMessages, markMessagesAsRead } from "../Redux/Message/Action"
import SockJs from "sockjs-client/dist/sockjs"
import { over } from "stompjs"
import ProfileSection from "./HomeComponents/ProfileSection"
import SearchBar from "./HomeComponents/SearchBar"
import ChatList from "./HomeComponents/ChatList"
import MessageCard from "./MessageCard/MessageCard"
import { AiOutlineSearch, AiOutlineSend } from "react-icons/ai"
import { BsMicFill, BsThreeDotsVertical, BsArrowLeft } from "react-icons/bs"

function HomePage() {
  const [querys, setQuerys] = useState("")
  const [currentChat, setCurrentChat] = useState(null)
  const [content, setContent] = useState("")
  const [isProfile, setIsProfile] = useState(false)
  const navigate = useNavigate()
  const [isGroup, setIsGroup] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()
  const { auth, chat, message } = useSelector((store) => store)
  const token = localStorage.getItem("token")
  const [stompClient, setStompClient] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [lastMessages, setLastMessages] = useState({})
  const messageContainerRef = useRef(null)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768)
  const [showChatList, setShowChatList] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [messageContainerRef])

  const connect = () => {
    const sock = new SockJs("http://localhost:8080/ws")
    const temp = over(sock)
    setStompClient(temp)

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    }

    temp.connect(headers, onConnect, onError)
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop().split(";").shift()
    }
  }

  const onError = (error) => {
    console.log("on error ", error)
  }

  const onConnect = () => {
    setIsConnected(true)

    if (stompClient && currentChat) {
      if (currentChat.isGroupChat) {
        stompClient.subscribe(`/group/${currentChat?.id}`, onMessageReceive)
      } else {
        stompClient.subscribe(`/user/${currentChat?.id}`, onMessageReceive)
      }
    }
  }

  const onMessageReceive = (payload) => {
    console.log("Mensaje recibido:", payload.body)
    const receivedMessage = JSON.parse(payload.body)

    dispatch({
      type: "CREATE_NEW_MESSAGE",
      payload: receivedMessage,
    })

    setMessages((prevMessages) => [...prevMessages, receivedMessage])

    setLastMessages((prevLastMessages) => ({
      ...prevLastMessages,
      [receivedMessage.chat.id]: receivedMessage,
    }))
  }

  useEffect(() => {
    if (!stompClient && !isConnected) {
      connect()
      console.log("WebSocket conectado")
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("WebSocket desconectado")
        })
      }
    }
  }, [stompClient, isConnected])

  useEffect(() => {
    if (isConnected && stompClient && currentChat?.id) {
      const subscription = currentChat.isGroupChat
        ? stompClient.subscribe(`/group/${currentChat.id}`, onMessageReceive)
        : stompClient.subscribe(`/user/${currentChat.id}`, onMessageReceive)
      console.log(
        `Suscrito al canal: ${currentChat.isGroupChat ? `/group/${currentChat.id}` : `/user/${currentChat.id}`}`,
      )

      return () => {
        subscription.unsubscribe()
        console.log("Desuscrito del canal")
      }
    }
  }, [isConnected, stompClient, currentChat])

  useEffect(() => {
    if (message.newMessage && stompClient) {
      stompClient.send("/app/message", {}, JSON.stringify(message.newMessage))
      setMessages((prevMessages) => [...prevMessages, message.newMessage])
    }
  }, [message.newMessage, stompClient])

  useEffect(() => {
    if (message.messages) {
      setMessages(message.messages)
    }
  }, [message.messages])

  useEffect(() => {
    if (currentChat?.id) {
      dispatch(getAllMessages({ chatId: currentChat.id, token }))
    }
  }, [currentChat, message.newMessage])

  useEffect(() => {
    dispatch(getUsersChat({ token }))
  }, [chat.createdChat, chat.createdGroup])

  useEffect(() => {
    const updatedLastMessages = { ...lastMessages }

    if (message.messages && message.messages.length > 0) {
      message.messages.forEach((msg) => {
        updatedLastMessages[msg.chat.id] = msg
      })

      setLastMessages(updatedLastMessages)
    }
  }, [message.messages])

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickOnChatCard = (userId) => {
    dispatch(createChat({ token, data: { userId } }))
  }

  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }))
  }

  const handleCreateNewMessage = () => {
    dispatch(
      createMessage({
        token,
        data: { chatId: currentChat.id, content: content },
      }),
    )
    setContent("")
  }

  useEffect(() => {
    dispatch(currentUser(token))
  }, [token])

  const handleCurrentChat = async (item) => {
    setCurrentChat(item)

    if (isMobileView) {
      setShowChatList(false)
    }

    try {
      await fetch(`http://localhost:8080/api/messages/markAsRead/${item.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setLastMessages((prevLastMessages) => ({
        ...prevLastMessages,
        [item.id]: { ...prevLastMessages[item.id], read: true },
      }))

      console.log(`Mensajes del chat ${item.id} marcados como leídos.`)
    } catch (error) {
      console.error("Error al marcar mensajes como leídos:", error)
    }
  }

  useEffect(() => {
    if (Array.isArray(chat?.chats)) {
      chat.chats.forEach((chat) => {
        dispatch(getAllMessages({ chatId: chat.id, token }))
      })
    } else {
      console.error("chat.chats no es un array:", chat?.chats)
    }
  }, [chat?.chats, token, dispatch])

  useEffect(() => {
    const prevLastMessages = { ...lastMessages }
    if (message.messages && message.messages.length > 0) {
      message.messages.forEach((msg) => {
        prevLastMessages[msg.chat.id] = msg
      })

      setLastMessages(prevLastMessages)
    }
  }, [message.messages])

  const handleNavigate = () => {
    setIsProfile(true)
  }

  const handleCloseOpenProfile = () => {
    setIsProfile(false)
  }

  const handleCreateGroup = () => {
    setIsGroup(true)
  }

  const handleLogout = () => {
    const userId = auth.reqUser?.id
    if (userId && token) {
      dispatch(deactivateUserStatus(userId, token))
    }
    dispatch(logoutAction())
    navigate("/signin")
  }

  const handleBackToList = () => {
    setShowChatList(true)
    setCurrentChat(null)
  }

  useEffect(() => {
    if (!auth.reqUser) {
      navigate("/signin")
    }
  }, [auth.reqUser])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-blue-50">
      <div className="w-full h-full py-4 md:py-14 bg-blue-600">
        <div className="flex flex-col md:flex-row bg-white h-full md:h-[90vh] absolute inset-0 md:top-[5vh] md:left-[2vw] md:w-[96vw] rounded-lg shadow-lg">
          {(!isMobileView || (isMobileView && showChatList)) && (
            <div className="left w-full md:w-[30%] h-full bg-blue-100 overflow-y-auto rounded-l-lg">
              {isProfile && (
                <div className="w-full h-full">
                  <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
                </div>
              )}
              {isGroup && <CreateGroup setIsGroup={setIsGroup} handleCloseOpenProfile={handleCloseOpenProfile}/>}
              {!isProfile && !isGroup && (
                <div className="w-full">
                  <ProfileSection
                    auth={auth}
                    isProfile={isProfile}
                    isGroup={isGroup}
                    handleNavigate={handleNavigate}
                    handleClick={handleClick}
                    handleCreateGroup={handleCreateGroup}
                    handleLogout={handleLogout}
                    handleClose={handleClose}
                    open={open}
                    anchorEl={anchorEl}
                  />
                  <SearchBar querys={querys} setQuerys={setQuerys} handleSearch={handleSearch} />
                  <ChatList
                    querys={querys}
                    auth={auth}
                    chat={chat}
                    lastMessages={lastMessages}
                    handleClickOnChatCard={handleClickOnChatCard}
                    handleCurrentChat={handleCurrentChat}
                  />
                </div>
              )}
            </div>
          )}
          {(!isMobileView || (isMobileView && !showChatList)) && (
            <div className="w-full md:w-[70%] h-full flex flex-col bg-white relative rounded-r-lg">
              {!currentChat?.id ? (
                <div className="flex flex-col items-center justify-center h-full bg-blue-50">
                  <div className="max-w-[70%] text-center">
                    <img
                      className="ml-11 w-1/2 md:w-[75%] mx-auto"
                      src="https://cdn.pixabay.com/photo/2015/08/03/13/58/whatsapp-873316_640.png"
                      alt="whatsapp-icon"
                    />
                    <h1 className="text-2xl md:text-4xl text-blue-600">WhatsApp Web</h1>
                    <p className="my-4 md:my-9 text-sm md:text-base text-blue-800">
                      Send and receive messages with WhatsApp and save time.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="header bg-blue-500 p-2 md:p-3 flex items-center rounded-tr-lg">
                    {isMobileView && (
                      <button onClick={handleBackToList} className="mr-2 text-white">
                        <BsArrowLeft size={24} />
                      </button>
                    )}
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <img
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white"
                        src={
                          currentChat.group
                            ? currentChat.chat_image ||
                              "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                            : auth.reqUser?.id !== currentChat.users[0]?.id
                              ? currentChat.users[0]?.profile ||
                                "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                              : currentChat.users[1]?.profile ||
                                "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                        }
                        alt="profile"
                      />
                      <p className="text-sm md:text-base font-semibold text-white">
                        {currentChat.group
                          ? currentChat.chatName
                          : auth.reqUser?.id !== currentChat.users[0]?.id
                            ? currentChat.users[0].name
                            : currentChat.users[1].name}
                      </p>
                    </div>
                  </div>
                  <div className="flex-grow overflow-y-auto px-2 md:px-10 bg-blue-50" ref={messageContainerRef}>
                    <div className="space-y-1 w-full flex flex-col justify-end min-h-full py-2">
                      {messages?.length > 0 &&
                        messages?.map((item, i) => (
                          <MessageCard
                            key={i}
                            isReqUserMessage={item?.user?.id !== auth?.reqUser?.id}
                            content={item.content}
                            timestamp={item.timestamp}
                            profilePic={
                              item?.user?.profile ||
                              "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                            }
                          />
                        ))}
                    </div>
                  </div>
                  <div className="footer bg-blue-100 py-2 md:py-3 rounded-br-lg">
                    <div className="flex justify-between items-center px-2 md:px-5 relative">
                      <input
                        className="py-2 outline-none border-none bg-white pl-2 md:pl-4 rounded-md w-[85%] text-sm md:text-base"
                        type="text"
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type message"
                        value={content}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleCreateNewMessage()
                            setContent("")
                          }
                        }}
                      />
                      <AiOutlineSend
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          handleCreateNewMessage()
                          setContent("")
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage

