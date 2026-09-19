import { type FC } from 'react';

import { EventsProvider } from './contexts/events-context';
import AppContent from './app-content';
import { DEFAULT_CONFIGURATION_VALUES } from './configuration-values';

const App: FC = () => {
  return (
    <EventsProvider initialValues={DEFAULT_CONFIGURATION_VALUES}>
      <AppContent />
    </EventsProvider>
  );
};

App.displayName = 'App';

export default App;
