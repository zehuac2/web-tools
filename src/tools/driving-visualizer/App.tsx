import { type FC } from 'react';
import { Provider } from 'react-redux';
import DrivingVisualizer from './DrivingVisualizer';
import { store } from './store/index';

const App: FC = () => {
  return (
    <Provider store={store}>
      <DrivingVisualizer />
    </Provider>
  );
};

App.displayName = 'App';

export default App;
