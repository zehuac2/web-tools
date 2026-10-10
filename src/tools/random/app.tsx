import { type FC } from 'react';
import { Provider } from 'react-redux';
import RandomTool from './random-tool';
import { store } from './store';

const App: FC = () => {
  return (
    <Provider store={store}>
      <RandomTool />
    </Provider>
  );
};

App.displayName = 'App';

export default App;
