import LabelRow from '@/components/ui/LabelRow';
import React from 'react';

const ReservationPage: React.FC = () => {
  return (
    <div >
        <h3 className='text-3xl font-bold text-center mb-3'>reservation</h3>
        <div className='flex items-center flex-col w-[60%] mx-auto'>
            <LabelRow labelName='이름' labelId="userName" type='text'/>
            <LabelRow labelName='전화번호' labelId="userPhone" type='tel'/>
            <LabelRow labelName='특이사항' labelId="userMemo" type='text'/>
            
        </div>
    </div>
  );
};

export default ReservationPage;