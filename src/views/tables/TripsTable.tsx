"use client";

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import React, {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import {SpinnerWheel} from "../../@core/components/loaders/spinner-wheel";
import {VehicleType} from "./CarsTable";
import {PencilOutline, TrashCan} from "mdi-material-ui";
import {useDeleteEntity} from "../../@core/hooks/useDeleteEntity";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface EditTripDialogProps {
  open: boolean;
  onClose: () => void;
  trip: TripsType | null;
  onSave: (trip: TripsType | null) => Promise<void>;
}

export interface TripsType {
  id: React.Key | null | undefined;
  departure: string;
  destination: string;
  distance: number;
  status: number;
  departure_time: string;
  vehicle: VehicleType;
  vehicle_id: number;
  started_at: string;
  ended_at: string;
}

const EditVehicleDialog: React.FC<EditTripDialogProps> = ({open, onClose, trip, onSave}) => {
  const [localTrip, setLocalTrip] = useState<TripsType | null>(trip);
  useEffect(() => {
    setLocalTrip(trip);
  }, [trip]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setLocalTrip((prev: any) => ({...prev, [e.target.name]: e.target.value}));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Trip</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Departure"
          type="text"
          fullWidth
          variant="outlined"
          name="departure"
          value={localTrip?.departure || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="destination"
          type="text"
          fullWidth
          variant="outlined"
          name="destination"
          value={localTrip?.destination || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="distance"
          type="text"
          fullWidth
          variant="outlined"
          name="distance"
          value={localTrip?.distance || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="status"
          type="number"
          fullWidth
          variant="outlined"
          name="status"
          value={localTrip?.status}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="departure_time"
          type="text"
          fullWidth
          variant="outlined"
          name="departure_time"
          value={localTrip?.departure_time}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="vehicle_id"
          type="number"
          fullWidth
          variant="outlined"
          name="vehicle_id"
          value={localTrip?.vehicle_id || ''}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(localTrip)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const TripsTable = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<TripsType[] | []>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const {handleOpenDelete, openDelete, handleCloseDelete, handleDelete} = useDeleteEntity();
  const [selectedTrip, setSelectedTrip] = useState<TripsType | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const apiUrl = "https://api.ecovoit.tech";
  const csrfToken = typeof window !== 'undefined' ? localStorage.getItem('csrfToken') : null;

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('access_token');
    }

    return null;

  };

  const token = getToken();

  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
      }
    );
  }

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

      setTrips(prevTrips => {
        return [...prevTrips, ...response.data];
      });
      setHasMore(response.data.length > 0);

    } catch (error) {

      console.error('Failed to fetch trips data:', error);

    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    getTrips();
  }, []);

  const handleOpenEdit = useCallback((tripId) => {
    setOpenEdit(true);
    setSelectedTrip(trips.find(trip => trip.id === tripId) || null);
  }, [trips]);

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleDeleteClick = useCallback(async (tripId) => {
    const trip = trips.find(trip => trip.id === tripId);
    if (!trip) return;

    const confirmation = window.confirm("Are you sure you want to delete this trip?");
    if (confirmation) {
      const success = await handleDelete(trip, "trips");
      if (success) {
        setTrips(currentTrips => currentTrips.filter(t => t.id !== tripId));
      } else {
        console.error("Failed to execute delete operation.");
      }
    }
  }, [trips, handleDelete]);

  const handleSaveTrip = useCallback(async (trip) => {

    if (!token) {

      await router.push('/pages/login');

      return;

    }

    try {

      const response = await axios.put(`${apiUrl}/api/trips/${trip.id}`, {
        distance: trip.distance,
        departure: trip.departure,
        destination: trip.destination,
        status: trip.status,
        departure_time: trip.departure_time,
        vehicle_id: trip.vehicle_id,

      }, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Update Successful:', response.data);

      setTrips(prevTrips => prevTrips.map(t => t.id === trip.id ? {...t, ...response.data} : t));
      alert('Trip updated successfully');

    } catch (error: any) {

      console.error('Failed to update trip:', error);

      if (error.response) {

        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);

        alert(`Failed to update trip: ${error.response.status} ${error.response.data.message}`);

      } else if (error.request) {

        console.error('Error request:', error.request);
        alert('No response from the server');

      } else {

        console.error('Error message:', error.message);
        alert('Error while setting up the request');

      }

    }
    setOpenEdit(false);
  }, []);

  if (loading) {
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
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((trip) => (
              <TableRow
                key={trip.id}
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
                <TableCell align='center'>{trip.vehicle.model}</TableCell>
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
                <TableCell align="center">
                  <PencilOutline sx={{cursor: 'pointer', color: '#70b3b7'}} onClick={() => handleOpenEdit(trip.id)}/>
                  <TrashCan sx={{cursor: 'pointer', color: '#a42424'}} onClick={() => handleDeleteClick(trip.id)}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditVehicleDialog open={openEdit} onClose={handleCloseEdit} trip={selectedTrip}
                         onSave={handleSaveTrip}/>
    </>
  )
}

export default TripsTable;
