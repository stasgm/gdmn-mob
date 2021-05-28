import React from 'react';
import { Text } from 'react-native';

const Header = ({ titles }: { titles: string[] }) => {
  return (
    <>
      {titles.map((title) => (
        <Text>{title}</Text>
      ))}
    </>
  );
};

export default Header;
