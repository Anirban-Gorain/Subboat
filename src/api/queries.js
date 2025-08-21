export const Q_ME = /* GraphQL */ `
  query {
    users {
      id
      email
    }
  }
`;

export const Q_LIST_CHATS = /* GraphQL */ `
  query ListChats($user_id: uuid!) {
    chats_chats(
      where: { user_id: { _eq: $user_id } }
      order_by: { updated_at: desc }
    ) {
      id
      title
      created_at
      updated_at
    }
  }
`;

export const M_NEW_CHAT = /* GraphQL */ `
  mutation NewChat($user_id: uuid!, $title: String!) {
    chats_insert_chats_one(object: { user_id: $user_id, title: $title }) {
      id
      title
      created_at
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
