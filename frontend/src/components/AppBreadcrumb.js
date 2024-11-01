import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import routes from '../routes'; 
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname;
  const userId = localStorage.getItem('userId');

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find(route => {
      const routePathParts = route.path.split('/');
      const pathnameParts = pathname.split('/');

      if (routePathParts.length !== pathnameParts.length) return false;

      return routePathParts.every((part, index) => {
        return part === pathnameParts[index] || part.startsWith(':'); 
      });
    });
    return currentRoute ? currentRoute.name : false;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    const parts = location.split('/').filter(Boolean); 
    let currentPathname = '';

    parts.forEach((part, index) => {
      currentPathname += `/${part}`; 
      const routeName = getRouteName(currentPathname, routes);
      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index === parts.length - 1,
        });
      }
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);
  console.log("Generated breadcrumbs:", breadcrumbs);  

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem>
        <Link to={`/dashboard/${userId}`} style={{ textDecoration: "none", color: "rgb(243, 108, 35)" }}>Home</Link>
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          {...(breadcrumb.active ? { active: true } : { to: breadcrumb.pathname })}
          key={index}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
      <CBreadcrumbItem>
        <Link to={`/dashboard/${userId}/details`} style={{ textDecoration: "none", color: "rgb(243, 108, 35)" }}>
          View Details
        </Link>
      </CBreadcrumbItem>
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
