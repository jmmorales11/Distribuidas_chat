import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OptionsWindow from './components/OptionsWindow';
import CreateRoomView from './components/CreateRoomView';
import NormalChatView from './components/NormalChatView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OptionsWindow />} />
        <Route path="/create-room" element={<CreateRoomView />} />
        <Route path="/normal-chat" element={<NormalChatView />} />
        <Route path="/general-chat" element={<NormalChatView isGeneral={true} />} />
      </Routes>
    </Router>
  );
}

export default App;

