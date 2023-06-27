import React, { useState } from "react";
import './menu.css'; // Estilos CSS del Sidebar
export const Menu = () => {

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial', margin: '0 20px 0 0', flex: '0 0 25%' }}>
<div class="wrapper">
  <div class="sidebar">
    <div class="profile">
      <img
        src="https://i.pinimg.com/564x/3f/85/13/3f8513ace58e7f851a316c3e00a6b609.jpg"
        alt="profile_picture"></img>
      <h3>Caamal Puc Antonio</h3>
      <p>Dashboard</p>
    </div>
    <div>
      <ul>
        <li>
          <a href="/">
            <span class="icon"><i class="fas fa-home"></i></span>
            <span class="item">Dashboard</span>
          </a>
        </li>
        <li>
          <a  href="/productos">
            <span class="icon"><i class="fas fa-user-friends"></i></span>
            <span class="item">Productos</span>
          </a>
        </li>
        <li>
          <a href="/fabricantes">
            <span class="icon"><i class="fas fa-tachometer-alt"></i></span>
            <span class="item">Fabricantes</span>
          </a>
        </li>
       
      </ul>
    </div>
  </div>

</div>
    </div>
  );
};
