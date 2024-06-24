// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import CarBack from "mdi-material-ui/CarBack";
import Road from "mdi-material-ui/Road";
import AccountMultiple from "mdi-material-ui/AccountMultiple";
import TownHall from "mdi-material-ui/TownHall";
import ShieldAccountOutline from "mdi-material-ui/ShieldAccountOutline";
import EmailOutline from "mdi-material-ui/EmailOutline";
import History from "mdi-material-ui/History"

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'


const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Pages'
    },
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Cars',
      icon: CarBack,
      path: '/cars'
    },
    {
      title: 'Trips',
      icon: Road,
      path: '/trips',
    },
    {
      title: 'Users',
      icon: AccountMultiple,
      path: '/users',
    },
    {
      title: 'Schools',
      icon: TownHall,
      path: '/schools',
    },
    {
      title: 'Roles',
      icon: ShieldAccountOutline,
      path: '/roles',
    },
    {
      title: 'Messages',
      icon: EmailOutline,
      path: '/messages',
    },
    {
      title: 'Histories',
      icon: History,
      path: '/histories',
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
  ]
}

export default navigation
