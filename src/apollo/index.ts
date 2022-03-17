import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

const endpoint1 = new HttpLink({
  uri: 'https://graphql-pokemon2.vercel.app/',
  credentials: 'same-origin',
})

const endpoint2 = new HttpLink({
  uri: 'https://api.spacex.land/graphql/',
  credentials: 'same-origin',
})

const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === 'spacex',
    endpoint2,
    endpoint1
  ),
  cache: new InMemoryCache(),
})

export default client
