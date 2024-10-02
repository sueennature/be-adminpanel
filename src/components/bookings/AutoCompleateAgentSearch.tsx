import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Contact {
  first_name: string;
  last_name: string;
  email: string;
}

interface Info {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  telephone: string;
  address: string;
}

interface ChildProps {
    updateAgentInfo: (updatedInfo: Info) => void;
}

const AutoCompleateAgentSearch: React.FC<ChildProps> = ({ updateAgentInfo }) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Contact[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchContacts = async (searchQuery: string) => {
    setLoading(true);
    const requestBody = {
      search_query: searchQuery,
    };
    const accessToken = Cookies.get('access_token');

    try {
      const response = await axios.post(`${process.env.BE_URL}/agents/search`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-api-key': process.env.X_API_KEY,
        },
      });

      setOptions(response?.data);
      const data = response?.data?.[0]
      if(response?.data?.length == 1){
        const updatedInfo: Info = {
          firstName: data?.first_name,
          lastName: data?.last_name,
          email: data?.email,
          nationality: data?.nationality,
          telephone: data?.telephone,
          address: data?.address
         
        };
        updateAgentInfo(updatedInfo);
      }else{
        const updatedInfo: Info = {
          firstName: '',
          lastName: '',
          email: '',
          nationality: '',
          telephone: '',
          address: ''
        };
        updateAgentInfo(updatedInfo);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchContacts(''); // Optionally, fetch all contacts initially, or leave it blank
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    if (value) {
      fetchContacts(value); // Fetch contacts based on user input
    }
  };

  return (
    <Autocomplete
      sx={{ width: 300 }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      onInputChange={handleInputChange}
      isOptionEqualToValue={(option, value) => option.email === value.email}
      getOptionLabel={(option) => `${option.email}`}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Guest By Email"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
export default AutoCompleateAgentSearch;
