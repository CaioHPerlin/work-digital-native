import React from 'react';
import { Appbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';

type HeaderProps = {
  toggleMenu: () => void;
};

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  return (
    <Appbar.Header style={{ backgroundColor: '#FFAE69' }}>
      <TouchableOpacity onPress={toggleMenu}>
        <Appbar.Action icon="menu" />
      </TouchableOpacity>
      <Appbar.Content title="WorkDigital" />
    </Appbar.Header>
  );
};

export default Header;
