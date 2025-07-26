import React, { useContext, useState } from 'react'
import { StudentContext } from '../context/StudentContext';

const Logo = ({ color = 'black', size = '40px' }) => {
  const {navigate} = useContext(StudentContext)

  return (
    <div className='cursor-pointer' onClick={()=>navigate('/')}>
      <p style={{ fontSize: size }}>
        <span style={{ color: "#6DB6DF" }}>Elev</span>
        <span style={{ color }}>{`ate`}</span>
      </p>
    </div>
  );
};

export default Logo;
