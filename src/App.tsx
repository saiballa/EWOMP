import AppRouter from './appRouter/routing'
import './App.css'
import { Toaster } from 'sonner'

function App() {

  return (
    <>
      <Toaster position='top-right' richColors />
      <AppRouter/>
    </>
  )
}

export default App
