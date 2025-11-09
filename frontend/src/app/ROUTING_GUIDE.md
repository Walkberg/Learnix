# React Router v7 Implementation Guide

## Overview

This project uses React Router v7 in **Data Router Mode** for routing only:
- Loader-based authentication guards
- Type-safe route params
- Automatic error boundaries
- Nested route layouts

**Note:** This project does NOT use React Router for data management:
- ❌ No loaders for data fetching - use useState/useEffect instead
- ❌ No useLoaderData - fetch data in components
- ❌ No actions for mutations - use event handlers
- ✅ Only use React Router for routing, auth guards, and error boundaries

## Current Implementation

### Router Configuration (`app/AppRoutes.tsx`)

The router is configured using `createBrowserRouter()` instead of JSX-based `<Routes>`:

```tsx
import { createBrowserRouter, redirect } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    loader: checkAuth, // Authentication guard
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // ... more routes
    ],
  },
]);
```

### Key Principles

#### 1. Loader-Based Authentication

Instead of wrapper components, use `loader` functions:

```tsx
// ❌ OLD: Wrapper component
<ProtectedRoute>
  <MyPage />
</ProtectedRoute>

// ✅ NEW: Loader-based
const checkAuth = () => {
  if (!isAuthenticated) {
    return redirect('/login');
  }
  return null;
};

{
  path: '/',
  loader: checkAuth,
  element: <MyPage />,
}
```

**Benefits:**
- Proper HTTP redirects (302/307 status codes)
- No flash of unauthorized content
- Better UX with loading states
- SSR-friendly

#### 2. Data Fetching with useState and useEffect

Fetch data in components using traditional React patterns:

```tsx
// Route configuration - just routing, no loader
{
  path: '/courses/:courseId',
  element: <CoursePage />,
}

// Component with traditional data fetching
function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await api.getCourseById(courseId);
        setCourse(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);
  
  if (loading) return <div>Loading...</div>;
  return <div>{course.title}</div>;
}
```

**Benefits:**
- Data fetching logic stays in components
- Familiar React patterns
- Easy to debug and test
- No magic - explicit control flow

#### 3. Error Boundaries

Each route can have an `errorElement`:

```tsx
{
  path: '/courses/:courseId',
  loader: courseLoader,
  element: <CoursePage />,
  errorElement: <CourseError />,
}

function CourseError() {
  const error = useRouteError();
  return <div>Failed to load course: {error.message}</div>;
}
```

#### 4. Nested Routes with Outlet

Use `<Outlet />` for nested route rendering:

```tsx
function ProtectedLayout() {
  return (
    <AppLayout>
      <Outlet /> {/* Child routes render here */}
    </AppLayout>
  );
}

// Router config
{
  path: '/',
  element: <ProtectedLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'courses', element: <CoursesPage /> },
  ],
}
```

#### 5. Type Safety

Use TypeScript for params and state:

```tsx
import { useParams } from 'react-router-dom';

function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  
  // Fully typed!
  return <div>{course?.title}</div>;
}
```

## Migration Checklist

### ✅ Completed
- [x] Migrated from `<Routes>` to `createBrowserRouter`
- [x] Replaced `<BrowserRouter>` with `<RouterProvider>`
- [x] Converted `<Navigate>` guards to `redirect()` in loaders
- [x] Added `errorElement` to routes
- [x] Nested routes using `<Outlet />`

### 🚧 Next Steps

When converting page components to route modules:

1. **Keep data fetching in components:**
   ```tsx
   function CoursePage() {
     const [data, setData] = useState();
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       fetchData().then(setData).finally(() => setLoading(false));
     }, []);
     
     if (loading) return <div>Loading...</div>;
     return <div>{data}</div>;
   }
   ```

2. **Add error boundaries:**
   - Each route should have an `errorElement`
   - Use `useRouteError()` to access error details

3. **Update imports:**
   - Use `createBrowserRouter` not `BrowserRouter`
   - Use `RouterProvider` in main.tsx
   - Use `redirect()` not `<Navigate>` in auth guards
   - Use `Outlet` not `props.children` for layouts

## Resources

- [React Router v7 Docs](https://reactrouter.com/)
- [Data Routers Guide](https://reactrouter.com/en/main/routers/picking-a-router)
- [Loaders](https://reactrouter.com/en/main/route/loader)
- [Actions](https://reactrouter.com/en/main/route/action)
