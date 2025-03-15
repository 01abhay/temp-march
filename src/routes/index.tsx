import { BrowserRouter, Routes, Route } from 'react-router'

import RootLayout from '../pages/_RootLayout'
import Home from '../pages/Home'
import Watchlist from '../pages/Watchlist'
import Screens from '../pages/Screens'
import Stock from '../pages/Stock'

export default function RootRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/watchlist' element={<Watchlist />} />
          <Route path='/screens' element={<Screens />} />

          <Route path='/stock/:symbol' element={<Stock />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
