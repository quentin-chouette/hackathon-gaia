import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Chat from './components/Chat';
import { useState } from 'react';
import Start from './components/Start';

export type PreInfo = {
  address? : string,
  departement? : string,
  size? : number,
  inclinaison? : number,
  zone_type? : string,
  haie? : boolean,
  arbre? : boolean,
  riviere? : boolean,
  culture? : string,
  date? : string,
  old_culture? : string,
  old_date? : string,
  independant? : boolean,
  PAC? : boolean,
  temps_partiel? : boolean,
  commercialisation? : boolean,
 ask_aides: boolean,
}
function App() {
  const [preSet, setPreSet] = useState<PreInfo>(
    {
      "address" : "18 chemin de la Brède, 33560 Sainte Eulalie",
      "departement" : "Gironde",
      "size" : 15,
      "inclinaison" : 5,
      "zone_type" : "zone de montagne",
      "haie" : true,
      "arbre" : false,
      "riviere" : true,
      "culture" : "blé",
      "date" : "01/06/2024",
      "old_culture" : "vigne",
      "old_date" : "20/11/2023",
      "independant" : false,
      "PAC" : true,
      "temps_partiel" : true,
      "commercialisation" : true,
     "ask_aides": false,
  }
  );
  return (
    <Router>
      <Routes>
          <Route path='/' Component={() => <Start preSet={preSet} setPreSet={setPreSet} />}/>
          <Route path='/chat' Component={() => <Chat preSet={preSet} />}/> 
      </Routes>      
    </Router>
  )
}

export default App
