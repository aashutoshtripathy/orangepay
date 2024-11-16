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

      // Handle dynamic segments, e.g., :userId
      if (routePathParts.length !== pathnameParts.length) return false;

      return routePathParts.every((part, index) => {
        // If part is dynamic (e.g., :userId), allow it to match anything
        return part === pathnameParts[index] || part.startsWith(':');
      });
    });

    return currentRoute ? currentRoute.name : null; // Return the route name or null if no match
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    const parts = location.split('/').filter(Boolean); // Split URL path and remove empty segments
    let currentPathname = '';

    parts.forEach((part, index) => {
      currentPathname += `/${part}`;
      const routeName = getRouteName(currentPathname, routes);

      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index === parts.length - 1, // Mark the last segment as active
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
        <Link to={`/dashboard/${userId}`} style={{ textDecoration: "none", color: "rgb(243, 108, 35)" }}>
          Home
        </Link>
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          key={index}
          {...(breadcrumb.active 
            ? { active: true } // Last item should be active, not a link
            : { to: breadcrumb.pathname } // All others should be links
          )}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
