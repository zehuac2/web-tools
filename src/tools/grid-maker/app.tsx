import { type FC } from 'react';
import { Provider } from 'react-redux';

import AppContent from './app-content';
import { store } from './store';

const App: FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

App.displayName = 'App';

export default App;
