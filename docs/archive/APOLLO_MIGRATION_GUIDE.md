# 🚀 Apollo Rest Link Migration Guide

## Overview

This guide will help you migrate from the current REST-based Discourse integration to the new Apollo Rest Link approach, which provides GraphQL-like syntax while maintaining direct REST API communication.

## 🎯 **What We've Built**

### **1. Apollo Client Configuration** (`lib/apollo-client.ts`)

- **Rest Link**: Maps Discourse REST endpoints to GraphQL queries
- **Auth Integration**: Automatically adds authentication headers
- **Smart Caching**: Apollo's built-in cache management
- **Error Handling**: Comprehensive error policies

### **2. GraphQL Schema** (`lib/discourse-schema.ts`)

- **Type Definitions**: Complete Discourse data types
- **Query Mappings**: REST endpoints mapped to GraphQL queries
- **Mutation Support**: Create, update, delete operations
- **Input Types**: Structured data for mutations

### **3. Apollo Hooks** (`hooks/useApolloDiscourse.ts`)

- **Query Hooks**: `useLatestTopics`, `useCategories`, etc.
- **Mutation Hooks**: `createTopic`, `createPost`, etc.
- **Cache Management**: Automatic refetching and cache updates
- **Loading States**: Built-in loading and error states

## 🔄 **Migration Steps**

### **Step 1: Install Dependencies**

```bash
npm install @apollo/client apollo-link-rest graphql
```

### **Step 2: Update Your App Layout**

Add Apollo Provider to your root layout:

```typescript
// app/_layout.tsx
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../lib/apollo-client';

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      {/* Your existing providers */}
      <AuthProvider>
        <ThemeProvider>
          {/* Your app content */}
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
```

### **Step 3: Replace REST Hooks with Apollo Hooks**

#### **Before (REST-based):**

```typescript
import { useDiscourse } from '../hooks/useDiscourse';

function FeedScreen() {
  const { topics, fetchLatestTopics, isLoading, error } = useDiscourse();

  useEffect(() => {
    fetchLatestTopics();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <FlatList data={topics} renderItem={TopicCard} />
  );
}
```

#### **After (Apollo-based):**

```typescript
import { useApolloDiscourse } from '../hooks/useApolloDiscourse';

function FeedScreen() {
  const { useLatestTopics } = useApolloDiscourse();
  const { data, loading, error } = useLatestTopics();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <FlatList data={data?.latestTopics || []} renderItem={TopicCard} />
  );
}
```

### **Step 4: Update Mutations**

#### **Before (REST-based):**

```typescript
const { createTopic } = useDiscourse();

const handleSubmit = async (title: string, content: string) => {
  const topic = await createTopic(1, title, content, ['tech']);
  if (topic) {
    // Handle success
  }
};
```

#### **After (Apollo-based):**

```typescript
const { createTopic } = useApolloDiscourse();

const handleSubmit = async (title: string, content: string) => {
  try {
    const result = await createTopic({
      variables: {
        input: {
          title,
          raw: content,
          category_id: 1,
          tags: ['tech'],
        },
      },
    });

    if (result.data?.createTopic) {
      // Handle success
    }
  } catch (error) {
    // Handle error
  }
};
```

## 📊 **Feature Comparison**

| Feature                | REST Approach              | Apollo Approach           |
| ---------------------- | -------------------------- | ------------------------- |
| **Data Fetching**      | Manual `useEffect` + state | Automatic with `useQuery` |
| **Loading States**     | Manual `isLoading` state   | Built-in `loading` state  |
| **Error Handling**     | Manual `error` state       | Built-in `error` state    |
| **Caching**            | Manual implementation      | Automatic Apollo cache    |
| **Refetching**         | Manual `refetch` function  | Built-in `refetch`        |
| **Optimistic Updates** | Not available              | Built-in support          |
| **Type Safety**        | Manual TypeScript          | GraphQL schema + types    |
| **Developer Tools**    | Limited                    | Apollo DevTools           |

## 🎯 **Migration Benefits**

### **1. Better Developer Experience**

- **Declarative queries** instead of imperative API calls
- **Automatic state management** for loading, error, and data
- **Built-in caching** with smart invalidation
- **Type safety** with GraphQL schema

### **2. Improved Performance**

- **Automatic caching** prevents unnecessary API calls
- **Background refetching** keeps data fresh
- **Optimistic updates** for better UX
- **Normalized cache** prevents duplicate data

### **3. Enhanced Features**

- **Apollo DevTools** for debugging
- **Error boundaries** and retry logic
- **Subscription support** (future enhancement)
- **Offline support** (future enhancement)

## 🔧 **Advanced Usage Examples**

### **1. Optimistic Updates**

```typescript
const [toggleLike] = useMutation(TOGGLE_LIKE, {
  optimisticResponse: {
    toggleLike: { success: true },
  },
  update: (cache, { data }) => {
    // Update cache immediately
    cache.modify({
      id: cache.identify({ __typename: 'Post', id: postId }),
      fields: {
        liked: (existing) => !existing,
        like_count: (existing) => existing + 1,
      },
    });
  },
});
```

### **2. Cache Management**

```typescript
const { updateTopicCache, refetchLatestTopics } = useApolloDiscourse();

const handleCreateTopic = async (topicData) => {
  const result = await createTopic({ variables: { input: topicData } });

  if (result.data?.createTopic) {
    // Update cache manually if needed
    updateTopicCache(result.data.createTopic.id, {
      title: () => result.data.createTopic.title,
      posts_count: () => 1,
    });

    // Refetch related queries
    refetchLatestTopics();
  }
};
```

### **3. Error Handling**

```typescript
const { data, loading, error } = useLatestTopics();

if (error) {
  return (
    <View>
      <Text>Error: {error.message}</Text>
      <Button
        title="Retry"
        onPress={() => refetch()}
      />
    </View>
  );
}
```

## 🧪 **Testing the Migration**

### **1. Use the Test Component**

```typescript
import { TestApolloConnection } from '../components/test-apollo-connection';

// Add this to a screen to test the connection
<TestApolloConnection />
```

### **2. Verify Connection**

- Check if topics are loading
- Verify categories are fetched
- Confirm site info is retrieved
- Test refetch functionality

### **3. Monitor Console**

- Look for Apollo Client logs
- Check for Rest Link requests
- Verify authentication headers

## 🚨 **Common Issues & Solutions**

### **1. "RestLink is not a constructor"**

```bash
# Make sure you have the correct package
npm install apollo-link-rest
```

### **2. "Cannot read property 'concat' of undefined"**

```typescript
// Ensure you're importing from the correct package
import { setContext } from '@apollo/client/link/context';
```

### **3. "GraphQL error: Unknown type"**

```typescript
// Make sure your schema is properly defined
// Check that all types referenced in queries exist
```

### **4. Authentication not working**

```typescript
// Verify your auth link is properly configured
// Check that tokens are being stored correctly
```

## 🔮 **Future Enhancements**

### **1. Real-time Updates**

```typescript
// WebSocket subscriptions for live updates
const { data } = useSubscription(NEW_POST_SUBSCRIPTION);
```

### **2. Offline Support**

```typescript
// Apollo Client offline support
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new ApolloLink((operation, forward) => {
    // Handle offline scenarios
  }),
});
```

### **3. Advanced Caching**

```typescript
// Custom cache policies
const cache = new InMemoryCache({
  typePolicies: {
    Topic: {
      fields: {
        posts: {
          merge(existing, incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});
```

## 🎉 **Migration Complete!**

Once you've completed the migration:

1. **Remove old REST hooks** (optional - keep for gradual migration)
2. **Update all components** to use Apollo hooks
3. **Test thoroughly** with the test component
4. **Monitor performance** improvements
5. **Enjoy the benefits** of GraphQL-like syntax with REST APIs!

## 📚 **Additional Resources**

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Apollo Rest Link](https://github.com/apollographql/apollo-link-rest)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)

---

**Happy Migration! 🚀**

Your app now has the power of Apollo Client with the simplicity of REST APIs!
