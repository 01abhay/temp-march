import { Link, Outlet, useLocation } from 'react-router'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import logo from '../assets/logo.png'

const routes = [
  { label: 'Home', path: '/' },
  { label: 'Watchlists', path: '/watchlists' },
  { label: 'Screens', path: '/screens' },
]

export default function RootLayout() {
  const location = useLocation()

  return (
    <Container maxWidth='xl' sx={{ px: { xs: 1, md: 2 }, pb: 8 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, md: 2 }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{ py: { xs: 1, md: 2 } }}>
        <Box sx={{ width: 40, mr: 2 }}>
          <img src={logo} alt='logo' style={{ display: 'block', width: '100%' }} />
        </Box>

        <Stack direction='row' spacing={{ xs: 1, md: 2 }}>
          {routes.map(route => {
            const isActive = location.pathname === route.path
            const variant = isActive ? 'contained' : 'outlined'

            return (
              <Button key={route.path} component={Link} to={route.path} variant={variant} size='small'>
                {route.label}
              </Button>
            )
          })}
        </Stack>
      </Stack>
      <Outlet />
    </Container>
  )
}
