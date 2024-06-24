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

export interface SchoolType {
  id: number;
  name: string;
  phone_number: string;
  adress: string;
  postal_code: string;
  city: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

const CarsTable = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<SchoolType[]|[]>([]);

  useEffect(() => {

    const getSchools = async () => {

      setLoading(true);

      const token = sessionStorage.getItem('access_token');

      if (!token) {
        await router.push('/pages/login');
      }

      try {

        const response = await axios.get(`https://api.ecovoit.tech/api/establishments`, {

          headers: {
            'Authorization': `Bearer ${token}`
          }

        });

        setSchools(response.data);

      } catch (error) {

        console.error('Failed to fetch schools data:', error);

      } finally {
        setLoading(false);
      }

    };

    getSchools()

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
              <TableCell>Name</TableCell>
              <TableCell align='center'>Phone Number</TableCell>
              <TableCell align='center'>Address</TableCell>
              <TableCell align='center'>Postal Code</TableCell>
              <TableCell align='center'>City</TableCell>
              <TableCell align='center'>Created At</TableCell>
              <TableCell align='center'>Updated At</TableCell>
              <TableCell align='center'>Deleted At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools.map((school, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {school.name}
                </TableCell>
                <TableCell align='center'>{school.phone_number}</TableCell>
                <TableCell align='center'>{school.adress}</TableCell>
                <TableCell align='center'>{school.postal_code}</TableCell>
                <TableCell align='center'>{school.city}</TableCell>
                {school.created_at ? (
                  <TableCell align='center'>  {
                    new Date(school.created_at).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                ) : (
                  <TableCell align='center'></TableCell>
                )}
                {school.updated_at ? (
                  <TableCell align='center'>  {
                    new Date(school.updated_at).toLocaleDateString("fr", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                ) : (
                  <TableCell align='center'></TableCell>
                )}
                {school.deleted_at ? (
                  <TableCell align='center'>  {
                    new Date(school.deleted_at).toLocaleDateString("fr", {
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
