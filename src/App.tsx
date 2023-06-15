import './App.css';
import TabloMain from './components/TabloMain/tabloMain';
import { Routes, Route } from 'react-router-dom';
import InfoFloor from './components/InfoFloor/infoFloor';
import InfoCabinet from './components/InfoCabinet/InfoCabinet';

function App() : JSX.Element {
  return (
      <Routes>
        <Route path='/Tablo' element={<TabloMain />}>
        </Route>
        <Route path='/Tablo/infofloor' element={<InfoFloor />}>
        </Route>
        <Route path='/Tablo/infocabinet' element={<InfoCabinet />}>
        </Route>
      </Routes>
  );
}

export default App;
