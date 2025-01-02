import React from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'

interface Room {
  id: string
  name: string
  lastMessage: string
}

interface RoomListProps {
  rooms: Room[]
  onSelectRoom: (roomId: string) => void
  onCreateRoom: () => void
}

export default function RoomList({ rooms, onSelectRoom, onCreateRoom }: RoomListProps) {
  return (
    <div className="bg-white h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Salas</h2>
        <Button onClick={onCreateRoom} variant="ghost" size="icon">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-4 border-b hover:bg-blue-50 cursor-pointer"
            onClick={() => onSelectRoom(room.id)}
          >
            <p className="font-semibold">{room.name}</p>
            <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

