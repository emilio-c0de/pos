import { Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

import AppRouter from './AppRouter';
import DialogProvider from './context/DialogProvider';
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { appendScript } from './utils/utils';

const App = () => {
  const isOnline = useOnlineStatus();
  useEffect(() => {
    appendScript("/lib/vanilla-daterange/moment.min.js")
    appendScript("/lib/vanilla-daterange/vanilla-datetimerange-picker.js")
  }, [])

  if (!isOnline) {
    return 'Esperando la conexión...'
  }
  return (
    <Suspense fallback={<>Cargando</>}>
      <ToastContainer />
      <DialogProvider>
        {/* <BrowserRouter basename="/RestaurantUI/"> */}
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </DialogProvider>
    </Suspense>
  )
}

export default App
