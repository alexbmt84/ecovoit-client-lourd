// ** React Imports
import {ReactNode, useState} from 'react'

// ** Next Imports
import {useRouter} from 'next/router'
import useCSRFToken from "../../../@core/hooks/useCsrf";
import {useAuth} from "../../../@core/context/authContext";

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import {styled} from '@mui/material/styles'
import MuiCard, {CardProps} from '@mui/material/Card'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({theme}) => ({
  [theme.breakpoints.up('sm')]: {width: '28rem'}
}))

const LoginPage = () => {

  const router = useRouter()

  useCSRFToken();

  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayError, setError] = useState<string | null>(null);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setLoading(true)


    login(email, password)
      .then(() => {
        router.push('/');
      }).catch((error) => {
      setError(error.response ? error.response.data : error.message);
      console.log(displayError)
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <Box className='content-center'>
      <Card sx={{zIndex: 1}}>
        <CardContent sx={{padding: theme => `${theme.spacing(12, 9, 7)} !important`}}>
          <Box sx={{mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
               className={"login-logo-container"}>

            <img src={"/images/logos/logo.png"} alt={"logo"} width={"50px"}/>

          </Box>
          <Box sx={{mb: 6}}>
            <Typography variant='h5' sx={{fontWeight: 600, marginBottom: 3, textAlign: "center"}}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2' sx={{textAlign: "center"}}>Please sign-in to your account and start the
              adventure</Typography>
          </Box>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className={"login-container"}>
              <label htmlFor="email">Email</label>
              <input className={"login-input"} id="email" value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="m@example.com" required type="email" name={"email"}/>
            </div>
            <div className={"login-container"}>
              <label htmlFor="password">Mot de passe</label>
              <input className={"login-input"} id="password" value={password}
                     onChange={e => setPassword(e.target.value)}
                     placeholder="••••••••" required type="password" name={"password"}/>
            </div>
            <div className={"login-button-container"}>
              <Button className="w-full login-button" type="submit" disabled={loading}>
                Connexion
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
