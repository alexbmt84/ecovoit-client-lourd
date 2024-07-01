// ** React Imports
import {useState, ElementType, ChangeEvent, useEffect, SetStateAction} from 'react'
import useCSRFToken from "../../@core/hooks/useCsrf";
import {useRouter} from "next/router";

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import {styled} from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, {ButtonProps} from '@mui/material/Button'

// ** Icons Imports
import {SpinnerWheel} from "../../@core/components/loaders/spinner-wheel";
import axios from "axios";

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

  useCSRFToken();

  const apiUrl = "https://api.ecovoit.tech";
  const csrfToken = typeof window !== 'undefined' ? localStorage.getItem('csrfToken') : null;
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(0);
  const [status, setStatus] = useState(0);
  const [statusValue, setStatusDefaultValue] = useState("");
  const [establishment, setEstablishment] = useState(0);
  const [establishmentValue, setEstablishmentDefaultValue] = useState("")
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/avatar.png');
  const [roleValue, setRoleDefaultValue] = useState("");

  useEffect(() => {
    if (data) {
      if (data.email) {
        setEmail(data.email)
      }
      if (data.first_name) {
        setFirstName(data.first_name)
      }
      if (data.last_name) {
        setLastName(data.last_name)
      }
      if (data.role_id) {
        setRole(data.role_id)
        if (data.role_id === 1) {
          setRoleDefaultValue("1");
        } else if (data.role_id === 2) {
          setRoleDefaultValue("2")
        } else {
          setRoleDefaultValue("3")
        }
      }

      setStatus(data.active_status)
      if (data.active_status === 0) {
        setStatusDefaultValue("0")
      } else {
        setStatusDefaultValue("1")
      }

      if (data.establishment_id) {
        setEstablishment(data.establishment_id)
        if (data.establishment_id === 1) {
          setEstablishmentDefaultValue("1")
        } else {
          setEstablishmentDefaultValue("2")
        }
      }
    }
  }, [data]);

  const handleRoleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setRoleDefaultValue(event.target.value);
    if (typeof event.target.value === "string") {
      setRole(parseInt(event.target.value, 10));
    }
  };

  const handleEstablishmentChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setEstablishmentDefaultValue(event.target.value);
    if (typeof event.target.value === "string") {
      setEstablishment(parseInt(event.target.value, 10));
    }
  };

  const handleStatusChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setStatusDefaultValue(event.target.value);
    console.log(statusValue, status)
    if (typeof event.target.value === "string") {
      setStatus(parseInt(event.target.value, 10));
    }
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('access_token');
    }

    return null;

  };

  const token = getToken();

  const onChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const {files} = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)

      reader.readAsDataURL(files[0])
    }
  }

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const update = async () => {


      if (!token) {

        await router.push('/pages/login');

        return;

      }

      try {
        const response = await axios.put(`${apiUrl}/api/users/${data.id}`, {
          first_name: firstName,
          last_name: lastName,
          email: email,
          role_id: role,
          active_status: status,
          establishment_id: establishment
        }, {
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Update Successful:', response.data);
        alert('User updated successfully');

      } catch (error: any) {

        console.error('Failed to update user:', error);

        if (error.response) {

          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);

          alert(`Failed to update user: ${error.response.status} ${error.response.data.message}`);

        } else if (error.request) {

          console.error('Error request:', error.request);
          alert('No response from the server');

        } else {

          console.error('Error message:', error.message);
          alert('Error while setting up the request');

        }

      }

    };

    await update();

  };

  if (!data) {
    return (
      <SpinnerWheel/>
    )
  }

  return (
    <CardContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{marginTop: 4.8, marginBottom: 3}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              {data.avatar !== "avatar.png" ? (
                <ImgStyled src={`/images/avatars/${data.avatar}`} alt='Profile Pic'/>
              ) : (
                <ImgStyled src={imgSrc} alt='Profile Pic'/>
              )}
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
            <label>First name</label>
            <TextField
              fullWidth
              id="first_name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              type='text'
              placeholder={data.first_name}
              name={"first_name"}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label>Last name</label>
            <TextField
              fullWidth
              id="last_name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              type='text'
              placeholder={data.last_name}
              name={"last_name"}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label>Email</label>
            <TextField
              fullWidth
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type='email'
              placeholder={data.email}
              name={"email"}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <label>Role</label>
              {roleValue ? (
                <Select
                  value={roleValue}
                  onChange={handleRoleChange}
                  displayEmpty
                >
                  <MenuItem value='1'>Admin</MenuItem>
                  <MenuItem value='2'>Moderator</MenuItem>
                  <MenuItem value='3'>User</MenuItem>
                </Select>
              ) : (
                <div></div>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <label>Status</label>
              <Select
                value={statusValue}
                onChange={handleStatusChange}
              >
                <MenuItem value='0'>Active</MenuItem>
                <MenuItem value='1'>Inactive</MenuItem>
              </Select>
            </FormControl>
            <div></div>
          </Grid>
          <Grid item xs={12} sm={6}>
            {establishmentValue ? (
              <FormControl fullWidth>
                <label>Establishment</label>
                <Select
                  value={establishmentValue}
                  onChange={handleEstablishmentChange}
                >
                  <MenuItem value='1'>Nextech Avignon</MenuItem>
                  <MenuItem value='2'>Nextech Pertuis</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <div></div>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' sx={{marginRight: 3.5}} type={"submit"}>
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
