import Head from 'next/head';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Checkbox,
  FormGroup,
  ListItemText,
} from '@mui/material';
import { IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { countries, indianStatesWithCities } from '../utils/constants';

const RegisterPage = () => {
  const router = useRouter();
  // State variables for form fields and validation
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
  //console.log(profilePicture);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'password and confirmpassword doest match',
        icon: 'warning',
      });
      return false;
    }
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
      .post('http://localhost:5000/users', data)
      .then((response) => {
        console.log('User created:', data);
        if (response.data.success) {
          Swal.fire({
            title: 'Member Registered',
            text: 'Member added Successfully',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then(() => {
            router.push('/homepage');
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

  return (
    <div style={{ backgroundColor: '#F7EFE5', height: '130vh' }}>
      <Head>
        <title>Register | CrudDemo</title>
        <meta name="description" content="Login to CrudDemo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          maxWidth: '400px',
          margin: 'auto',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Registration Form
        </Typography>
        <TextField
          fullWidth
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
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
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

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
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 5 + 8, // 48 is the height of each item, 5 is the number of visible items, 8 accounts for padding
                      width: 250, // Optional, you can set the width of the dropdown here
                    },
                  },
                }}
              >
                {Object.keys(indianStatesWithCities).map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                label="City"
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
                />
              }
              label="Playing"
            />
          </FormGroup>
        </FormControl>
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
        <Button
          style={{ width: '100%', marginBottom: '10px' }}
          variant="contained"
          type="submit"
        >
          Register
        </Button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Typography>Already have An Account?</Typography>
          <p className="title">
            <Link href="/login">Login!</Link>
          </p>
        </div>
      </Box>
    </div>
  );
};

export default RegisterPage;
