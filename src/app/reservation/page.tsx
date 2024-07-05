import LabelRow from '@/components/ui/LabelRow';
import React from 'react';

const ReservationPage: React.FC = () => {
  return (
    <div >
      <section className=''>
        <div className="w-full">
          <h3 className='font-bold text-center mb-3'>reservation</h3>
          <div className=''>
            <LabelRow labelName='이름' labelId="userName" type='text'/>
            <LabelRow labelName='전화번호' labelId="userPhone" type='tel'/>
            <LabelRow labelName='특이사항' labelId="userMemo" type='text'/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReservationPage;