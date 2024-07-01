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
import {PencilOutline} from "mdi-material-ui";
import {TrashCan} from "mdi-material-ui";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useDeleteEntity} from "../../@core/hooks/useDeleteEntity";

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserType | null;
  onSave: (user: UserType | null) => Promise<void>;
}

export interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  role_id: number;
  establishment_id: number;
  active_status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

// @ts-ignore
const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onClose, user, onSave }) => {
const [localUser, setLocalUser] = useState<UserType | null>(user);
  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setLocalUser((prev: any) => ({...prev, [e.target.name]: e.target.value}));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          variant="outlined"
          name="first_name"
          value={localUser?.first_name || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          variant="outlined"
          name="last_name"
          value={localUser?.last_name || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          name="email"
          value={localUser?.email || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Phone Number"
          type="tel"
          fullWidth
          variant="outlined"
          name="phone_number"
          value={localUser?.phone_number || ''}
          onChange={handleChange}
        />
        {/* Add more fields as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(localUser)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const CarsTable = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const apiUrl = "https://api.ecovoit.tech";
  const csrfToken = typeof window !== 'undefined' ? localStorage.getItem('csrfToken') : null;
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const {handleOpenDelete, openDelete, handleCloseDelete, handleDelete} = useDeleteEntity();

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('access_token');
    }

    return null;

  };

  const token = getToken();

  const fetchUsers = async (page: number) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      await router.push('/pages/login');

      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/api/users?page=${page}`, {
        headers: {'Authorization': `Bearer ${token}`}
      });
      setUsers(prevUsers => {
        // Concaténer les listes plutôt que de les remplacer évite de re-rendre tout le tableau
        return [...prevUsers, ...response.data.data];
      });
      setHasMore(response.data.data.length > 0);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleFetchMore = () => {
    setLastScrollPosition(window.scrollY);
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    if (lastScrollPosition && users.length > 0) {
      window.scrollTo(0, lastScrollPosition);
    }
  }, [users]);

  const handleOpenEdit = useCallback((userId) => {
    setOpenEdit(true);
    setSelectedUser(users.find(user => user.id === userId) || null);
  }, [users]);

  const handleDeleteClick = useCallback(async (userId) => {
    const user = users.find(user => user.id === userId);
    if (!user) return;

    const confirmation = window.confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      const success = await handleDelete(user); // Pass the user directly
      if (success) {
        setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
      } else {
        console.error("Failed to execute delete operation.");
      }
    }
  }, [users, handleDelete]);

  const handleSaveUser = useCallback(async (user) => {

    if (!token) {

      await router.push('/pages/login');

      return;

    }

    try {

      const response = await axios.put(`${apiUrl}/api/users/${user.id}`, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id,
        active_status: user.active_status,
        establishment_id: user.establishment_id,
      }, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Update Successful:', response.data);
      setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? {...u, ...response.data} : u));
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
    setOpenEdit(false);
  }, []);

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  if (loading) {
    return (
      <div className="center-container">
        <SpinnerWheel/>
      </div>
    )
  }

  // @ts-ignore
  return (
    <>
      <TableContainer component={Paper}>
        <InfiniteScroll
          dataLength={users.length}
          next={handleFetchMore}
          hasMore={hasMore}
          loader={<SpinnerWheel/>}
          endMessage={<p style={{textAlign: 'center'}}>
            <b>Yay! You have seen it all</b>
          </p>}
          scrollableTarget="scrollableDiv"
        >
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{minWidth: 120}}>First Name</TableCell>
                <TableCell align="center">Last Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Phone Number</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Establishment</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell sx={{minWidth: 110}} align="center">Created At</TableCell>
                <TableCell sx={{minWidth: 110}} align="center">Updated At</TableCell>
                <TableCell sx={{minWidth: 120}} align="center">Deleted At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {user.first_name}
                  </TableCell>
                  <TableCell align="center">{user.last_name}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.phone_number}</TableCell>
                  {user.role_id === 1 ? (
                    <TableCell align="center">Admin</TableCell>
                  ) : (user.role_id === 2 ? (
                    <TableCell align="center">Moderator</TableCell>
                  ) : (
                    <TableCell align="center">User</TableCell>
                  ))}
                  {user.establishment_id === 1 ? (
                    <TableCell align="center">Nextech Avignon</TableCell>
                  ) : (
                    <TableCell align="center">Nextech Pertuis</TableCell>
                  )}
                  {user.active_status === 0 ? (
                    <TableCell align="center">Offline</TableCell>
                  ) : (
                    <TableCell align="center">Online</TableCell>
                  )}
                  <TableCell align="center">
                    {user.created_at && new Date(user.created_at).toLocaleDateString("fr", {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {user.updated_at && new Date(user.updated_at).toLocaleDateString("fr", {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {user.deleted_at && new Date(user.deleted_at).toLocaleDateString("fr", {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <PencilOutline sx={{cursor: 'pointer', color: '#70b3b7'}} onClick={() => handleOpenEdit(user.id)}/>
                    <TrashCan sx={{cursor: 'pointer', color: '#a42424'}} onClick={() => handleDeleteClick(user.id)}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </InfiniteScroll>
      </TableContainer>
      <EditUserDialog open={openEdit} onClose={handleCloseEdit} user={selectedUser} onSave={handleSaveUser}/>
      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CarsTable
