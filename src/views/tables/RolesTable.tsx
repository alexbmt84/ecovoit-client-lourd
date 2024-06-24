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

export interface RoleType {
  id: number;
  label: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

const CarsTable = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<RoleType[]|[]>([]);

  useEffect(() => {

    const getRoles = async () => {

      setLoading(true);

      const token = sessionStorage.getItem('access_token');

      if (!token) {
        await router.push('/pages/login');
      }

      try {

        const response = await axios.get(`https://api.ecovoit.tech/api/roles`, {

          headers: {
            'Authorization': `Bearer ${token}`
          }

        });

        setRoles(response.data);

      } catch (error) {

        console.error('Failed to fetch schools data:', error);

      } finally {
        setLoading(false);
      }

    };

    getRoles()

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
              <TableCell>Id</TableCell>
              <TableCell align='center'>Label</TableCell>
              <TableCell align='center'>Created At</TableCell>
              <TableCell align='center'>Updated At</TableCell>
              <TableCell align='center'>Deleted At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {role.id}
                </TableCell>
                <TableCell align={"center"}>{role.label}</TableCell>
                {role.created_at ? (
                  <TableCell align='center'>  {
                    new Date(role.created_at).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                ) : (
                  <TableCell align='center'></TableCell>
                )}
                {role.updated_at ? (
                  <TableCell align='center'>  {
                    new Date(role.updated_at).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                ) : (
                  <TableCell align='center'></TableCell>
                )}
                {role.deleted_at ? (
                  <TableCell align='center'>  {
                    new Date(role.deleted_at).toLocaleDateString("fr", {
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
