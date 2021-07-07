// base component

import Header from './components/Header/Header';
import Landing from './pages/Landing';
import 'bulma/css/bulma.min.css';

const App = () => {
  return (
    <div>
      <Header />
      <Landing />
    </div>
  );
};

export default App;
