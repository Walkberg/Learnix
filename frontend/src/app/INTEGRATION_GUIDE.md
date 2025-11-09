# Integrating Route Modules with Router Configuration

## Current Status

The router configuration in `app/AppRoutes.tsx` is now using React Router v7's `createBrowserRouter()` pattern with:
- ✅ Loader-based authentication guards
- ✅ Error boundaries
- ✅ Nested routes with Outlet
- ✅ Type-safe route configuration

## How to Add Route Modules

### Step 1: Create a Route Module

Create a file in your feature's `pages/` directory (e.g., `features/courses/pages/CoursesPage.tsx`):

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getUserCourses();
        setCourses(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    await api.deleteCourse(id);
    // Refresh data
    setCourses(courses.filter(c => c.id !== id));
  };

  if (loading) return <div>Loading...</div>;
  return <div>{/* render courses */}</div>;
}

export default CoursesPage;
```

### Step 2: Update Router Configuration

Import and use the component in `app/AppRoutes.tsx`:

```tsx
// At the top
import { CoursesPage } from '../features/courses/pages/CoursesPage';

// In the router config
{
  path: 'courses',
  element: <CoursesPage />,
  errorElement: <ErrorBoundary />,
}
```

### Step 3: Test the Route

Navigate to the route and verify:
- Data loads correctly with loading state
- Errors are caught by errorElement
- Mutations update state properly

## Example: Full Feature Integration

```tsx
// features/courses/pages/CoursesPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getUserCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (courseId: string) => {
    await api.deleteCourse(courseId);
    setCourses(courses.filter(c => c.id !== courseId));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <button onClick={() => handleDelete(course.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default CoursesPage;
```

```tsx
// app/AppRoutes.tsx
import { CoursesPage } from '../features/courses/pages/CoursesPage';

export const router = createBrowserRouter([
  // ... other routes
  {
    path: 'courses',
    element: <CoursesPage />,
    errorElement: <ErrorBoundary />,
  },
]);
```

## Benefits of This Pattern

1. **Familiar**: Standard React patterns everyone knows
2. **Simple**: No magic, explicit control flow
3. **Flexible**: Easy to customize loading/error states
4. **Debuggable**: Clear where data comes from
5. **SSR Ready**: Works with server-side rendering

**Note:** React Router is used only for routing (navigation, auth guards, error boundaries) - not for data management.

## Common Patterns

### Protected Route with User Data
```tsx
export function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      const data = await api.getCurrentUser();
      if (!data) navigate('/login');
      setUser(data);
    };
    fetchUser();
  }, [navigate]);
  
  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

### Search/Filter with URL Params
```tsx
export function CoursesPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    const fetchCourses = async () => {
      const data = await api.getCourses({ search });
      setCourses(data);
    };
    fetchCourses();
  }, [search]);
  
  return <div>...</div>;
}
```

### Mutations with Event Handlers
```tsx
export function CoursePage() {
  const navigate = useNavigate();
  
  const handleCreate = async (data: CreateCourseDto) => {
    const course = await api.createCourse(data);
    navigate(`/courses/${course.id}`);
  };
  
  return <CourseForm onSubmit={handleCreate} />;
}
```

## Migration Checklist

For each page component:

- [ ] Keep data fetching in useEffect
- [ ] Keep useState for loading/error states
- [ ] Keep form handlers as event handlers
- [ ] Update imports in AppRoutes.tsx
- [ ] Add component to route config (no loaders)
- [ ] Test: data loads, errors handled
- [ ] Use state updates for data refresh after mutations
