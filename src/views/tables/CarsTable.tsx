"use client";

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import {SpinnerWheel} from "../../@core/components/loaders/spinner-wheel";

export interface VehicleType {
  id: React.Key | null | undefined;
  model: string;
  immatriculation: string;
  places: number;
  picture: string;
  user_id: number;
}

const CarsTable = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleType[]|[]>([]);

  useEffect(() => {

    const getVehicles = async () => {

      setLoading(true);

      const token = sessionStorage.getItem('access_token');

      if (!token) {
        await router.push('/pages/login');
      }

      try {

        const response = await axios.get(`https://api.ecovoit.tech/api/vehicles`, {

          headers: {
            'Authorization': `Bearer ${token}`
          }

        });

        setVehicles(response.data);

      } catch (error) {

        console.error('Failed to fetch vehicles data:', error);

      } finally {
        setLoading(false);
      }

    };

    getVehicles()

  }, []);

  if(loading) {
    return (
      <div className="center-container">
        <SpinnerWheel/>
      </div>
    )
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell align='center'>Immatriculation</TableCell>
              <TableCell align='center'>Places</TableCell>
              <TableCell align='center'>Picture</TableCell>
              <TableCell align='center'>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map(vehicle => (
              <TableRow
                key={vehicle.model}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {vehicle.model}
                </TableCell>
                <TableCell align='center'>{vehicle.immatriculation}</TableCell>
                <TableCell align='center'>{vehicle.places}</TableCell>
                <TableCell align='center'>{vehicle.picture}</TableCell>
                <TableCell align='center'>{vehicle.user_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default CarsTable
