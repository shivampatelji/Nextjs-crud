import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  TablePagination,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Button,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';
import { indianStatesWithCities, countries } from '../utils/constants';
import { PhotoCamera } from '@mui/icons-material';
//import { useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: 'black',
    },
    '& .MuiFormLabel-root.Mui-disabled': {
      color: 'black',
    },
  },
}));

const Homepage = () => {
  const router = useRouter();
  const { name } = router.query;
  const classes = useStyles();
  const [allMembersList, setAllMembersList] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [isView, setIsView] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const getAllMembers = () => {
    axios
      .get('http://localhost:5000/allUsers')
      .then((response) => {
        console.log(response);
        setAllMembersList(response.data.message);
        // Add logic to display a success message to the user
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        Swal.fire('Error', 'Server Down', 'error');
        // Add logic to display an error message to the user
      });
  };

  const onDeleteBtnClick = (email) => {
    axios
      .post('http://localhost:5000/deleteUser', { email })
      .then((response) => {
        console.log(response);
        Swal.fire('Member Deleted', 'Member Deleted Successfully', 'success');
        getAllMembers();
        // Add logic to display a success message to the user
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        Swal.fire('Error', 'Server Down', 'error');
        // Add logic to display an error message to the user
      });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Member Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState(
    indianStatesWithCities['Andaman and Nicobar Islands'][0]
  );
  const [state, setState] = useState(Object.keys(indianStatesWithCities)[0]);
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState({
    reading: false,
    writing: false,
    traveling: false,
    playing: false,
  });
  const [profilePicture, setProfilePicture] = useState(null);

  // Update state variables when form fields change
  const handleAreasOfInterestChange = (event) => {
    setAreasOfInterest({
      ...areasOfInterest,
      [event.target.name]: event.target.checked,
    });
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to save the data in the database and display the success message

    const data = {
      firstName,
      lastName,
      gender,
      email,
      password,
      city,
      state,
      zip,
      country,
      areasOfInterest,
      profilePicture,
    };
    console.log('Form submitted:', {
      firstName,
      lastName,
      gender,
      email,
      password,
      city,
      state,
      zip,
      country,
      areasOfInterest,
      profilePicture,
    });
    axios
      .post('http://localhost:5000/updateUser', data)
      .then((response) => {
        console.log('User updated:', response);
        if (response.data.success) {
          setOpenDialog(false);
          getAllMembers();
          Swal.fire({
            title: 'Member Updated',
            text: 'Member Updated Successfully',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
        } else {
          Swal.fire({
            title: response.data.message,

            icon: 'warning',
          });
        }
        // Add logic to display a success message to the user
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        Swal.fire(
          'Error',
          'An error occurred while creating the member',
          'error'
        );
        // Add logic to display an error message to the user
      });
  };

  const onViewBtnClick = (memberData) => {
    setOpenDialog(true);
    setIsView(true);
    setDialogTitle('Member Details');
    console.log(memberData);
    const {
      areasOfInterest,
      _id,
      firstName,
      lastName,
      gender,
      email,
      password,
      city,
      state,
      zip,
      country,
      profilePicture,
    } = memberData;
    setFirstName(firstName);
    setLastName(lastName);
    setGender(gender);
    setEmail(email);
    setPassword(password);
    setCity(city);
    setState(state);
    setZip(zip);
    setCountry(country);
    setProfilePicture(profilePicture);
    setAreasOfInterest(areasOfInterest);
  };

  const onEditBtnClick = (memberData) => {
    setOpenDialog(true);
    setDialogTitle('Update Member');
    console.log(memberData);
    const {
      areasOfInterest,
      _id,
      firstName,
      lastName,
      gender,
      email,
      password,
      city,
      state,
      zip,
      country,
      profilePicture,
    } = memberData;
    setFirstName(firstName);
    setLastName(lastName);
    setGender(gender);
    setEmail(email);
    setPassword(password);
    setConfirmPassword(password);
    setCity(city);
    setState(state);
    setZip(zip);
    setCountry(country);
    setProfilePicture(profilePicture);
    setAreasOfInterest(areasOfInterest);
  };

  const onCloseBtnClick = () => {
    setOpenDialog(false);
    setIsView(false);
    setFirstName('');
    setLastName('');
    setGender('');
    setEmail('');
    setPassword('');
    setCity('');
    setState('');
    setZip('');
    setCountry('');
    setProfilePicture('');
    setAreasOfInterest('');
  };

  useEffect(() => {
    // get isLoggedIn from sessionStorage
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    // check if isLoggedIn is true
    if (isLoggedIn) {
      getAllMembers();
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    setTotalRows(allMembersList.length);
  }, [allMembersList]);

  return (
    <>
      <Head>
        <title>HomePage | CrudDemo</title>
        <meta name="description" content="Login to CrudDemo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isUserLoggedIn ? (
        <>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Member Form
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="logout"
                onClick={() => {
                  router.push('/');
                  sessionStorage.clear();
                }}
              >
                <ExitToAppIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Typography
            variant="h4"
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '10px',
            }}
          >
            Welcome {name}
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: '600', fontSize: '16px' }}>
                    Profile Pic
                  </TableCell>
                  <TableCell style={{ fontWeight: '600', fontSize: '16px' }}>
                    First Name
                  </TableCell>
                  <TableCell style={{ fontWeight: '600', fontSize: '16px' }}>
                    Last Name
                  </TableCell>
                  <TableCell style={{ fontWeight: '600', fontSize: '16px' }}>
                    Email
                  </TableCell>
                  <TableCell style={{ fontWeight: '600', fontSize: '16px' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allMembersList
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div>
                          {row.profilePicture === null ? (
                            <div>-</div>
                          ) : (
                            <Image
                              src={row.profilePicture}
                              alt="TableSelectedpicture"
                              width={50}
                              height={50}
                              //style={{ width: '50px', height: '50px' }}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{row.firstName}</TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            onViewBtnClick(row);
                            // Implement your View logic here
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            onEditBtnClick(row);
                            // Implement your Edit logic here
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            onDeleteBtnClick(row.email);
                            // Implement your Delete logic here
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalRows}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => {
                setPage(newPage);
              }}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>

          <Dialog
            // onClose={handleClose}
            open={openDialog}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                maxWidth: '900px',
                padding: '20px',
                margin: 'auto',
                height: '700px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography variant="h4">{dialogTitle}</Typography>
                <Typography
                  variant="h5"
                  style={{ color: 'red', cursor: 'pointer' }}
                  onClick={() => {
                    onCloseBtnClick();
                  }}
                >
                  X
                </Typography>
              </div>

              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                required
                disabled={isView}
                className={classes.root}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isView}
                className={classes.root}
              />
              <FormControl component="fieldset" required>
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  row
                  aria-label="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
              {isView ? (
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isView}
                  className={classes.root}
                />
              ) : null}

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isView}
                className={classes.root}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {!isView ? (
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : null}

              <FormControl fullWidth required>
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  labelId="country-label"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (e.target.value !== 'India') {
                      setState('');
                      setCity('');
                      setZip('');
                    } else {
                      setState(Object.keys(indianStatesWithCities)[0]);
                      setCity(
                        indianStatesWithCities['Andaman and Nicobar Islands'][0]
                      );
                    }
                  }}
                  disabled={isView}
                  className={classes.root}
                  label="Country"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 5 + 8, // 48 is the height of each item, 5 is the number of visible items, 8 accounts for padding
                        width: 250, // Optional, you can set the width of the dropdown here
                      },
                    },
                  }}
                >
                  {/* Add your list of countries here */}
                  {countries.map((item, index) => (
                    <MenuItem key={index} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {country === 'India' ? (
                <>
                  <FormControl fullWidth required>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setCity(indianStatesWithCities[e.target.value][0]);
                      }}
                      label="State"
                      disabled={isView}
                      className={classes.root}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 5 + 8, // 48 is the height of each item, 5 is the number of visible items, 8 accounts for padding
                            width: 250, // Optional, you can set the width of the dropdown here
                          },
                        },
                      }}
                    >
                      {Object.keys(indianStatesWithCities).map(
                        (item, index) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth required>
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                      labelId="city-label"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      label="City"
                      disabled={isView}
                      className={classes.root}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 5 + 8, // 48 is the height of each item, 5 is the number of visible items, 8 accounts for padding
                            width: 250, // Optional, you can set the width of the dropdown here
                          },
                        },
                      }}
                    >
                      {indianStatesWithCities[state].map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                    disabled={isView}
                    className={classes.root}
                  />
                </>
              ) : null}
              {/* Replace the items in the Select components with your own data */}

              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Area of Interest</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={areasOfInterest.reading}
                        onChange={handleAreasOfInterestChange}
                        name="reading"
                        disabled={isView}
                        className={classes.root}
                      />
                    }
                    label="Reading"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={areasOfInterest.writing}
                        onChange={handleAreasOfInterestChange}
                        name="writing"
                        disabled={isView}
                        className={classes.root}
                      />
                    }
                    label="Writing"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={areasOfInterest.traveling}
                        onChange={handleAreasOfInterestChange}
                        name="traveling"
                        disabled={isView}
                        className={classes.root}
                      />
                    }
                    label="Traveling"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={areasOfInterest.playing}
                        onChange={handleAreasOfInterestChange}
                        name="playing"
                        disabled={isView}
                        className={classes.root}
                      />
                    }
                    label="Playing"
                  />
                </FormGroup>
              </FormControl>

              {!isView ? (
                <Box sx={{ mt: 2 }}>
                  <input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleProfilePictureChange}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                    Upload Profile Picture
                  </label>
                  {profilePicture && (
                    <Image
                      src={profilePicture}
                      alt="Selectedpicture"
                      width={50}
                      height={50}
                      //style={{ marginLeft: '10px', maxHeight: '50px' }}
                    />
                  )}
                </Box>
              ) : (
                <>
                  {profilePicture && (
                    <Image
                      src={profilePicture}
                      alt="Selectedpicture"
                      width={50}
                      height={50}
                      //style={{ marginLeft: '10px', maxHeight: '50px' }}
                    />
                  )}
                </>
              )}

              {!isView ? (
                <Button
                  style={{ width: '100%' }}
                  variant="contained"
                  type="submit"
                >
                  Update
                </Button>
              ) : null}

              <div style={{ height: '20px', visibility: 'hidden' }}>dfdf</div>
            </Box>
          </Dialog>
        </>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};

export default Homepage;
