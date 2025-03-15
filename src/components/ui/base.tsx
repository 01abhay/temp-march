import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import MuiCardHeader from '@mui/material/CardHeader'
import MuiCardContent from '@mui/material/CardContent'

export const Card = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2),
  },
}))
export const CardHeader = styled(MuiCardHeader)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2),
  },
}))
export const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2),
  },
}))
