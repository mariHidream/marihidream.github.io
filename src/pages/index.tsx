
import Header from '@/components/Header';
import React from 'react';
import '@/styles/global.module.css'


const HomePage: React.FC = () => {
  return (
    <div>
      <Header></Header>
      <div className='text-center'>main contents</div>
    </div>
  );
};

export default HomePage;