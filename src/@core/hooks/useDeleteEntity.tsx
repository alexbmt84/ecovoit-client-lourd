import {SetStateAction, useState} from "react";
import axios from "axios";
import {UserType} from "../../views/tables/UsersTable";

const useDeleteEntity = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<UserType | null>(null);  // Add state for selectedUser

  const handleOpenDelete = (entity: SetStateAction<UserType | null>) => {
    setSelectedEntity(entity);
    setOpenDelete(true);
  }

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDelete = async (user: { id: any; }) => {
    if (user && user.id) {
      try {
        const token = sessionStorage.getItem('access_token');
        const response = await axios.delete(`https://api.ecovoit.tech/api/users/${user.id}`, {
          headers: {'Authorization': `Bearer ${token}`}
        });
        console.log('Deletion successful:', response);
        setOpenDelete(false); // Close modal only on successful deletion

        return true; // Indicate successful deletion
      } catch (error) {
        console.error('Failed to delete user:', error);
        setOpenDelete(false);

        return false; // Indicate failed deletion
      }
    }

    return false; // If no user or id, indicate failure
  };


  return {openDelete, handleOpenDelete, handleCloseDelete, handleDelete};
}

export {useDeleteEntity}
