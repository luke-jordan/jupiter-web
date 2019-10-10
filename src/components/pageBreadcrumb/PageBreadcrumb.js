import React from 'react';
import { NavLink } from 'react-router-dom';

import './PageBreadcrumb.scss';
import arrowIcon from 'assets/images/arrow-left-silver.svg';

const PageBreadcrumb = props => {
  const link = props.link;
  return <div className="page-breadcrumb">
    <div className="breadcrumb-inner">
      <div className="breadcrumb-link">
        <NavLink to={link.to}>
          <img src={arrowIcon} alt="arrow"></img> {link.text}
        </NavLink>
      </div>
      <div className="breadcrumb-title">{props.title}</div>
    </div>
  </div>;
}

export default PageBreadcrumb;