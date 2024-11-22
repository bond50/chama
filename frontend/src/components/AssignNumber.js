// src/components/AssignNumber.js

import React from 'react';
import { assignNumber } from '../api';

const AssignNumber = ({ userId }) => {
  const handleAssignNumber = async () => {
    try {
      const updatedUser = await assignNumber(userId);
      alert(`Number assigned: ${updatedUser.assignedNumber}`);
    } catch (error) {
      alert("Error assigning number: " + error.message);
    }
  };

  return <button onClick={handleAssignNumber}>Assign Number</button>;
};

export default AssignNumber;
