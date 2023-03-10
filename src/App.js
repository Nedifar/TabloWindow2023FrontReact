import './App.css';
import TabloMain from './components/TabloMain/tabloMain';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import InfoFloor from './components/InfoFloor/infoFloor';
import InfoCabinet from './components/InfoCabinet/InfoCabinet';

function App() {
  return (
      <Routes>
        <Route exact path='/InfoTabloFront' element={<TabloMain />}>
        </Route>
        <Route exact path='/InfoTabloFront/infofloor' element={<InfoFloor />}>
        </Route>
        <Route exact path='/InfoTabloFront/infocabinet' element={<InfoCabinet />}>
        </Route>
      </Routes>
  );
}

export default App;
