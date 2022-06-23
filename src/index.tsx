// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom'

ReactDOM.render(
     // <React.StrictMode>
     //     <App />
     // </React.StrictMode>,
     <React.StrictMode>
          <BrowserRouter>
               <App />
          </BrowserRouter>
     </React.StrictMode>,
     document.getElementById('root')
   );