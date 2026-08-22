import { type FC } from 'react';

import { EventsProvider } from './contexts/EventsContext';
import AppContent from './AppContent';
import { DEFAULT_CONFIGURATION_VALUES } from './configurationValues';

const App: FC = () => {
  return (
    <EventsProvider initialValues={DEFAULT_CONFIGURATION_VALUES}>
      <AppContent />
    </EventsProvider>
  );
};

App.displayName = 'App';

export default App;
