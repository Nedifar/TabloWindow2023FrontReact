import './App.css';
import TabloMain from './components/TabloMain/tabloMain';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import InfoFloor from './components/InfoFloor/infoFloor';

function App() {
  return (
      <Routes>
        <Route exact path='/InfoTabloFront' element={<TabloMain />}>
        </Route>
        <Route exact path='/InfoTabloFront/infofloor' element={<InfoFloor />}>
        </Route>
      </Routes>
  );
}

export default App;
