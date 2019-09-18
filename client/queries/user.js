import { gql } from "apollo-boost";
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      avatar
      email
      joinDate
    }
  }
`;

export const VERIFY_USER_NAME = gql`
  query($username: String!) {
    isUsernameAvalaible(username: $username)
  }
`;

export const SIGNIN_USER = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: $email, password: $password) {
      token
    }
  }
`;
