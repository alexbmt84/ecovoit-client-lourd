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

export interface UserType {
  id: React.Key | null | undefined;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  role_id: number;
  establishment_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

const CarsTable = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserType[]|[]>([]);

  useEffect(() => {

    const getUsers = async () => {

      setLoading(true);

      const token = sessionStorage.getItem('access_token');

      if (!token) {
        await router.push('/pages/login');
      }

      try {

        const response = await axios.get(`https://api.ecovoit.tech/api/users`, {

          headers: {
            'Authorization': `Bearer ${token}`
          }

        });

        setUsers(response.data);

      } catch (error) {

        console.error('Failed to fetch users data:', error);

      } finally {
        setLoading(false);
      }

    };

    getUsers()

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
              <TableCell>First Name</TableCell>
              <TableCell align='center'>Last Name</TableCell>
              <TableCell align='center'>Email</TableCell>
              <TableCell align='center'>Password</TableCell>
              <TableCell align='center'>Phone Number</TableCell>
              <TableCell align='center'>Role</TableCell>
              <TableCell align='center'>Establishment</TableCell>
              <TableCell align='center'>Created At</TableCell>
              <TableCell align='center'>Updated At</TableCell>
              <TableCell align='center'>Deleted At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {user.first_name}
                </TableCell>
                <TableCell align='center'>{user.last_name}</TableCell>
                <TableCell align='center'>{user.email}</TableCell>
                <TableCell align='center'>{user.password}</TableCell>
                <TableCell align='center'>{user.phone_number}</TableCell>
                <TableCell align='center'>{user.role_id}</TableCell>
                <TableCell align='center'>{user.establishment_id}</TableCell>
                {user.created_at ? (
                  <TableCell align='center'>  {
                    new Date(user.created_at).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                ) : (
                  <TableCell align='center'></TableCell>
                )}
                {user.updated_at ? (
                  <TableCell align='center'>  {
                    new Date(user.updated_at).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                ) : (
                  <TableCell align='center'></TableCell>
                )}
                {user.deleted_at ? (
                  <TableCell align='center'>  {
                    new Date(user.deleted_at).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                ) : (
                  <TableCell align='center'></TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default CarsTable
