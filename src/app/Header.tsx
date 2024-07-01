import React from 'react';

// menu Props type define 
interface MenuItemProps {
  name:string,
  id:string,
  current?:boolean,
  className?:string,
  onClick?: () => void,
  type?: 'pc' | 'mo'
}

const menu:MenuItemProps[] = [
  {name:'소개', id:'about'},
  {name:'예약', id:'reservation'},
  {name:'갤러리', id:'gallery'},
  {name:'next', id:'posts'},
]


const Header: React.FC = () => {
  return (
    <>
      <header>
        <h1><a href="/">main</a></h1>
        <nav>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/posts">Post</a></li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;