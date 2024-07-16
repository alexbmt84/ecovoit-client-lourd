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
import {PencilOutline, TrashCan} from "mdi-material-ui";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useDeleteEntity} from "../../@core/hooks/useDeleteEntity";

interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleType | null;
  onSave: (vehicle: VehicleType | null) => Promise<void>;
}

export interface VehicleType {
  id: React.Key | null | undefined;
  model: string;
  immatriculation: string;
  places: number;
  picture: string;
  user_id: number;
}

const EditVahicleDialog: React.FC<EditVehicleDialogProps> = ({open, onClose, vehicle, onSave}) => {
  const [localVehicle, setLocalVehicle] = useState<VehicleType | null>(vehicle);
  useEffect(() => {
    setLocalVehicle(vehicle);
  }, [vehicle]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setLocalVehicle((prev: any) => ({...prev, [e.target.name]: e.target.value}));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Vehicle</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Model"
          type="text"
          fullWidth
          variant="outlined"
          name="model"
          value={localVehicle?.model || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Immatriculation"
          type="text"
          fullWidth
          variant="outlined"
          name="immatriculation"
          value={localVehicle?.immatriculation || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Places"
          type="number"
          fullWidth
          variant="outlined"
          name="places"
          value={localVehicle?.places || ''}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(localVehicle)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const CarsTable = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleType[] | []>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const apiUrl = "https://api.ecovoit.tech";
  const csrfToken = typeof window !== 'undefined' ? localStorage.getItem('csrfToken') : null;
  const [hasMore, setHasMore] = useState(true);
  const {handleOpenDelete, openDelete, handleCloseDelete, handleDelete} = useDeleteEntity();

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('access_token');
    }

    return null;

  };

  const token = getToken();

    const getVehicles = async () => {

      setLoading(true);

      if (!token) {
        await router.push('/pages/login');
      }

      try {

        const response = await axios.get(`https://api.ecovoit.tech/api/vehicles`, {

          headers: {
            'Authorization': `Bearer ${token}`
          }

        });

        setVehicles(prevVehicles => {
          return [...prevVehicles, ...response.data];
        });
        setHasMore(response.data.length > 0);

      } catch (error) {

        console.error('Failed to fetch vehicles data:', error);

      } finally {
        setLoading(false);
      }

    };

  useEffect(() => {
    getVehicles();
  },[]);

  const handleOpenEdit = useCallback((vehicleId) => {
    setOpenEdit(true);
    setSelectedVehicle(vehicles.find(vehicle => vehicle.id === vehicleId) || null);
  }, [vehicles]);

  const handleSaveVehicle = useCallback(async (vehicle) => {

    if (!token) {

      await router.push('/pages/login');

      return;

    }

    try {

      const response = await axios.put(`${apiUrl}/api/vehicles/${vehicle.id}`, {
        model: vehicle.model,
        immatriculation: vehicle.immatriculation,
        places: vehicle.places,
        picture: vehicle.picture,
        user_id: vehicle.user_id,
      }, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Update Successful:', response.data);

      setVehicles(prevVehicles => prevVehicles.map(v => v.id === vehicle.id ? {...v, ...response.data} : v));
      alert('Vehicle updated successfully');

    } catch (error: any) {

      console.error('Failed to update vehicle:', error);

      if (error.response) {

        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);

        alert(`Failed to update vehicle: ${error.response.status} ${error.response.data.message}`);

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


  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleDeleteClick = useCallback(async (vehicleId) => {
    const vehicle = vehicles.find(vehicle => vehicle.id === vehicleId);
    if (!vehicle) return;

    const confirmation = window.confirm("Are you sure you want to delete this vehicle?");
    if (confirmation) {
      const success = await handleDelete(vehicle, "vehicles"); // Pass the user directly
      if (success) {
        setVehicles(currentVehicles => currentVehicles.filter(v => v.id !== vehicleId));
      } else {
        console.error("Failed to execute delete operation.");
      }
    }
  }, [vehicles, handleDelete]);

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
              <TableCell>Model</TableCell>
              <TableCell align='center'>Immatriculation</TableCell>
              <TableCell align='center'>Places</TableCell>
              <TableCell align='center'>Picture</TableCell>
              <TableCell align='center'>User</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map(vehicle => (
              <TableRow
                key={vehicle.id}
              >
                <TableCell component='th' scope='row'>
                  {vehicle.model}
                </TableCell>
                <TableCell align='center'>{vehicle.immatriculation}</TableCell>
                <TableCell align='center'>{vehicle.places}</TableCell>
                <TableCell align='center'>{vehicle.picture}</TableCell>
                <TableCell align='center'>{vehicle.user_id}</TableCell>
                <TableCell align="center">
                  <PencilOutline sx={{cursor: 'pointer', color: '#70b3b7'}} onClick={() => handleOpenEdit(vehicle.id)}/>
                  <TrashCan sx={{cursor: 'pointer', color: '#a42424'}} onClick={() => handleDeleteClick(vehicle.id)}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditVahicleDialog open={openEdit} onClose={handleCloseEdit} vehicle={selectedVehicle}
                         onSave={handleSaveVehicle}/>
    </>
  )
}

export default CarsTable
