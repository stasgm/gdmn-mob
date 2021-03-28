import ReactDOM from 'react-dom';

import './index.css';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

import App from './App';

initializeIcons();

ReactDOM.render(<App />, document.getElementById('root'));
