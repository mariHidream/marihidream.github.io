import React from 'react';

interface LabelOptions {
    labelName : string;
    type : string;
    labelId : string
}


const LabelRow = ({labelName,labelId, type="text"} : LabelOptions) => {
  return (
    <>
        <label htmlFor={labelId} className="block text-sm font-medium leading-6 text-gray-900">
            {labelName}
        </label>
        <input type={type} />
    </>
  );
};

export default LabelRow;