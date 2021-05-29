import React from 'react';
import { Text } from 'react-native';

interface IProps {
  titles: string[];
}

const Header = ({ titles }: IProps) => {
  return (
    <>
      {titles.map((title) => (
        <Text key={title}>{title}</Text>
      ))}
    </>
  );
};

export default Header;
