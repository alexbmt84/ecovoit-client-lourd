import UsersTable from "../../views/tables/UsersTable";
import UploadCsv from "../../@core/hooks/useCsfUploader";

const Users = () => {
  return (
    <>
      <h1>Users</h1>
      <UploadCsv/>
      <UsersTable/>
    </>
  )
}

export default Users;
