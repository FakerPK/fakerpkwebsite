import { Navbar } from './components/Navbar/Navbar'
import { Hero } from './components/Hero/Hero'
import { Technologies } from './components/Technologies/Technologies'
import { Portfolio } from './components/Portfolio/Portfolio'
import { Contact } from './components/Contact/Contact'

function App() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <Technologies />
      <Portfolio />
      <Contact />
    </div>
  )
}

export default App