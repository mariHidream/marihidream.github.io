
import clsx from 'clsx';
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

const menu : MenuItemProps[] = [
  {name:'소개', id:'about'},
  {name:'예약', id:'reservation'},
  {name:'갤러리', id:'gallery'},
  {name:'포스트', id:'posts'},
]


const Header: React.FC = () => {
  return (
    <>
      <header className="flex items-start justify-center">
        <h1 className="px-10 py-5 mr-5"><a href="/">main</a></h1>
        <nav className="py-5">
          <ul className="flex items-center justify-between">
            {menu.map((item) => (
                <li key={item.id} className='px-8'>
                  <a href={`/${item.id}`}>{item.name}</a>
                </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;