import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export const FirebaseStatus: React.FC = () => {
  // Component disabled - no longer showing Firebase status warnings
  return null;
};
