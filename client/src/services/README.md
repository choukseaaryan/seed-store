# API Services Documentation

## Core API Service (`api.ts`)

The core API service provides a configured Axios instance with interceptors for handling common scenarios.

### Features
- Automatic timestamp addition to prevent caching
- Authentication header management
- Comprehensive error handling for different HTTP status codes
- Cookie support for authentication

### Usage
```typescript
import api from './api';

// Basic usage
const response = await api.get('/endpoint');

// With query parameters
const response = await api.get('/endpoint', { params: { id: 1 } });

// Post request with data
const response = await api.post('/endpoint', { data: 'value' });
```

## CRUD Service Factory (`crudService.ts`)

A factory function that creates standardized CRUD operations for any resource type.

### Usage
```typescript
import { createCrudService } from './crudService';
import type { YourModel } from '../types/models';

const yourService = createCrudService<YourModel>('your-endpoint');

// Now you have access to:
await yourService.getAll();         // GET /your-endpoint
await yourService.getById('123');   // GET /your-endpoint/123
await yourService.create(data);     // POST /your-endpoint
await yourService.update('123', data); // PUT /your-endpoint/123
await yourService.delete('123');    // DELETE /your-endpoint/123
```

## Product Service (`productService.ts`)

Extended service for product-related operations.

### Additional Endpoints
```typescript
// Update product stock
await productService.updateStock(productId, quantity);

// Get products by category
await productService.getByCategory(categoryId);

// Get low stock products
await productService.getLowStock();
```

## Customer Service (`customerService.ts`)

Extended service for customer-related operations.

### Additional Endpoints
```typescript
// Get customer bills
await customerService.getBills(customerId);

// Get top customers
await customerService.getTopCustomers();
```

## Type Definitions (`types/api.ts`)

### Common Types
```typescript
// Generic API Response
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Paginated Response
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  };
}

// Query Parameters
interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

## Error Handling

The API service includes comprehensive error handling through interceptors:

- 401: Unauthorized - Redirects to login
- 403: Forbidden - Permission denied
- 404: Not found
- 422: Validation errors
- 429: Rate limiting
- 500+: Server errors

Use the `useErrorHandler` hook for consistent error handling across the application:

```typescript
import { useErrorHandler } from '../hooks/useErrorHandler';

const { handleError } = useErrorHandler();

try {
  await api.get('/endpoint');
} catch (error) {
  handleError(error);
}
```
