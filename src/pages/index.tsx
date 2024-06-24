// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import {useAuth} from "../@core/context/authContext";
import {useRouter} from "next/router";
import {useEffect} from "react";

const Dashboard = () => {

  const {isAuthenticated} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/pages/login");
    }
  }, [isAuthenticated, router]);

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>

        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
