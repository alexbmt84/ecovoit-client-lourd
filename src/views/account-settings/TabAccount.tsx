// ** React Imports
import {useState, ElementType, ChangeEvent} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import {styled} from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, {ButtonProps} from '@mui/material/Button'

// ** Icons Imports
import {SpinnerWheel} from "../../@core/components/loaders/spinner-wheel";

const ImgStyled = styled('img')(({theme}) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({theme}) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

// @ts-ignore
const TabAccount = ({data}) => {
  // ** State
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/avatar.png')
  const onChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const {files} = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)

      reader.readAsDataURL(files[0])
    }
  }

  if (!data) {
    return (
      <SpinnerWheel/>
    )
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{marginTop: 4.8, marginBottom: 3}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <ImgStyled src={`/images/avatars/${data.avatar}`} alt='Profile Pic'/>
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='error' variant='outlined'
                                   onClick={() => setImgSrc(`/images/avatars/${data.avatar}`)}>
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{marginTop: 5}}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='First Name' placeholder={data.first_name} defaultValue={data.first_name}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Last Name' placeholder={data.last_name} defaultValue={data.last_name}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Email'
              placeholder={data.email}
              defaultValue={data.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label='Role' defaultValue='admin'>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='author'>Moderator</MenuItem>
                <MenuItem value='editor'>User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label='Status' defaultValue='active'>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            {data.establishment_id === 1 ? (
              <TextField fullWidth label='Establishment' placeholder='Nextech Avignon' defaultValue='Nextech Avignon' />
            ):(
              <TextField fullWidth label='Establishment' placeholder='Nextech Pertuis' defaultValue='Nextech Pertuis' />
            )}
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' sx={{marginRight: 3.5}}>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
