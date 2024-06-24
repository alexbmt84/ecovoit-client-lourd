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

export interface TripsType {
  id: React.Key | null | undefined;
  departure: string;
  destination: string;
  distance: number;
  status: number;
  departure_time: string;
  vehicle_id: number;
  started_at: string;
  ended_at: string;
}

const TripsTable = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<TripsType[]|[]>([]);

  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
      }
    );
  }

  useEffect(() => {

    const getTrips = async () => {

      setLoading(true);

      const token = sessionStorage.getItem('access_token');

      if (!token) {
        await router.push('/pages/login');
      }

      try {

        const response = await axios.get(`https://api.ecovoit.tech/api/trips`, {

          headers: {
            'Authorization': `Bearer ${token}`
          }

        });

        setTrips(response.data);

      } catch (error) {

        console.error('Failed to fetch trips data:', error);

      } finally {
        setLoading(false);
      }

    };

    getTrips()

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
              <TableCell>Departure</TableCell>
              <TableCell align='center'>Destination</TableCell>
              <TableCell align='center'>Distance</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align='center'>Departure Time</TableCell>
              <TableCell align='center'>Vehicle</TableCell>
              <TableCell align='center'>Started At</TableCell>
              <TableCell align='center'>Ended At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((trip, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {toTitleCase(trip.departure)}
                </TableCell>
                <TableCell align='center'>{toTitleCase(trip.destination)}</TableCell>
                <TableCell align='center'>{trip.distance} km</TableCell>
                {trip.status === 0 ? (
                  <TableCell align='center'>Non démarré</TableCell>
                ) : (
                  <TableCell align='center'>En cours</TableCell>
                )}

                <TableCell align='center'>
                  {
                    new Date(trip.departure_time).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }
                </TableCell>
                <TableCell align='center'>{trip.vehicle_id}</TableCell>
                {trip.started_at ? (
                  <TableCell align='center'>  {
                    new Date(trip.started_at).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                ) : (
                  <TableCell align='center'>Non démarré</TableCell>
                )}
                {trip.ended_at ? (
                  <TableCell align='center'>  {
                    new Date(trip.ended_at).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                ) : (
                  <TableCell align='center'>Non terminé</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default TripsTable;
