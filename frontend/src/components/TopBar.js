import { Menu } from "semantic-ui-react";
import {
  Link,
  useLocation
} from "react-router-dom";
import React from 'react'


export default function TopBar() {
  const location = useLocation()
  const currLocation = location.pathname.substr(1) || 'home'

  return (
    <Menu fixed="top">
      <Menu.Item
        name='home'
        active={currLocation === 'home'}
        as={Link}
        to="/"
      >
        Home
      </Menu.Item>

      <Menu.Item
        name='live-charts'
        active={currLocation === 'live-charts'}
        as={Link}
        to="/live-charts"
      >
        Live Charts
      </Menu.Item>

      <Menu.Item
        name='query-builder'
        active={currLocation === 'query-builder'}
        as={Link}
        to="/query-builder"
      >
        Query Builder
      </Menu.Item>

      {/* <Menu.Item
        name='about'
        active={page === 'about'}
        onClick={handleClick}
        as={Link}
        to="/about"
      >
        About me
      </Menu.Item> */}
    </Menu>
  )
}