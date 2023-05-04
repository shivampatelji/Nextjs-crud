import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Modal,
  TextField,
  Button,
} from '@mui/material';

function HomeStatic({ list }) {
  console.log(list);

  // State variables for the modal box
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to open the modal box and set the selected user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to close the modal box
  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Data from API:</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Profile Picture</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Edit</TableCell> {/* New "Edit" column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.firstName}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>
                  <Avatar
                    alt={`${item.firstName} ${item.lastName}`}
                    src={item.avatar}
                  />
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal box for editing user data */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '5px',
          }}
        >
          <h2>Edit User Data</h2>
          <form>
            <TextField
              label="First Name"
              defaultValue={selectedUser?.firstName}
              fullWidth
              style={{ marginBottom: '1rem' }}
            />
            <TextField
              label="Last Name"
              defaultValue={selectedUser?.lastName}
              fullWidth
              style={{ marginBottom: '1rem' }}
            />
            <TextField
              label="Email"
              defaultValue={selectedUser?.email}
              fullWidth
              style={{ marginBottom: '1rem' }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: '1rem' }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:5000/allUsers');
  const data = await res.json();
  const list = data.message;

  // Pass data to the page component as props
  return { props: { list } };
}

export default HomeStatic;
