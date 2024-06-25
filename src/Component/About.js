import React from 'react';
import slideTransition from '../slideTransition';

const About = () => {
    return (
        <div>
            <h2 className='text-transparent'>About</h2>
        </div>
    );
};

export default slideTransition(About);
