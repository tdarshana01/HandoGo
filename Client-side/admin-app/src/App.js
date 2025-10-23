import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App app-layout" style={{display:'flex'}}>
      <Sidebar />
      <main className="ml-0 lg:ml-64" style={{flex:1, padding:24}}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
