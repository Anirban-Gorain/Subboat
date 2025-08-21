// import axiosClient from "./axiosClient.js";

import axios from "axios";

const GRAPHQL_ENDPOINT =
  "https://kjjcgsvslatkvloyeraw.hasura.ap-south-1.nhost.run/v1/graphql";

export async function gql(query, variables = {}) {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const { data } = await axios.post(
      GRAPHQL_ENDPOINT,
      { query, variables },
      {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      }
    );

    if (data.errors) throw new Error(data.errors[0].message);
    return data.data;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || err.message);
  }
}

export const Q_ME = /* GraphQL */ `
  query {
    users {
      id
      email
    }
  }
`;

export const Q_LIST_CHATS = /* GraphQL */ `
  query {
    chats_chats {
      title
      updated_at
      id
    }
  }
`;

export const M_NEW_CHAT = /* GraphQL */ `
  mutation NewChat($user_id: uuid!, $title: String!) {
    insert_chats_chats_one(object: { user_id: $user_id, title: $title }) {
      id
      title
      updated_at
    }
  }
`;

export const Q_LIST_MESSAGES = /* GraphQL */ `
  query ListMessages($chat_id: uuid!) {
    messages_messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender
      created_at
    }
  }
`;

export const M_INSERT_MESSAGE = /* GraphQL */ `
  mutation InsertMessage($chat_id: uuid!, $content: String!, $sender: String!) {
    insert_messages_messages_one(
      object: { chat_id: $chat_id, content: $content, sender: $sender }
    ) {
      id
      created_at
      content
      sender
    }
  }
`;
