import deviceDetails from '../deviceDetails/DeviceDetails';

const handlePostApi = async (loginUserData) => {
  const userData = await deviceDetails(loginUserData);
  console.log('userData:-----', userData);

  const options = {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  };

  try {
    let response = await fetch('http://202.62.74.220/etvtracker/Api/insert_data_fcm', options);
    let responseData = await response.text();

    console.log('Response:---', responseData);

    if (response.ok) {
      console.log('User details submitted successfully:', responseData);
    } else {
      let errorData;
      try {
        errorData = JSON.parse(responseData);
      } catch (parseError) {
        errorData = { message: 'Unknown error occurred' };
      }
      console.log(errorData.message || 'Failed to fetch data');
    }
  } catch (error) {
    console.log('Error:', error);
    return { error: 'Something went wrong' };
  }
};

export default handlePostApi;
