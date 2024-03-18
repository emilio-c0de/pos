
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { useOnlineStatus } from './hooks/useOnlineStatus'
import DialogProvider from './context/DialogProvider'; 
import AppRouter from './AppRouter';

const App = () => {
  const isOnline = useOnlineStatus();
  // useEffect(() => {
  //   appendScript("./assets/lib/vanilla-daterange/moment.min.js")
  //   appendScript("./assets/lib/vanilla-daterange/vanilla-datetimerange-picker.js")
  // }, [])

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
