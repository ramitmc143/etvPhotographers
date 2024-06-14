import React from 'react';

const handle_Pr_Ab = async (username) => {
  try {
    const response = await fetch(
      `http://202.62.74.220/etvtracker/Api/shiftAttendence?user_id=${username}`
    );

    if (!response.ok) {
      console.log('Network response was not ok in handle_Pr_Ab');
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log('Fetch error in handle_Pr_Ab:-', error);
  }
};

export default handle_Pr_Ab;


//http://172.17.15.218/etvtracker/Api/shiftAttendence?user_id=${username}
