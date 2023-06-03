import { gql } from '@apollo/client';

export const ME = gql`
  query Query {
    me {
      _id
      username
      email
      password
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
