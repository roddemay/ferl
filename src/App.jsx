import React, { useState } from 'react';
import axios from 'axios';
import { Box, VStack, Input, Button, Text, Heading, Container } from '@chakra-ui/react';

const API_URL = 'http://raspyme.ddns.net:8000/api/chat';

function App() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const newMessage = { role: 'user', content: input };
    setChatHistory((prev) => [...prev, newMessage]);

    try {
      const response = await axios.post(API_URL, {
        input: input,
        chat_history: chatHistory.map(msg => ({ content: msg.content }))
      });

      const aiMessage = { role: 'assistant', content: response.data.answer };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' };
      setChatHistory((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setInput('');
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">RAG Model Chat</Heading>
        <Box borderWidth={1} borderRadius="lg" p={4} minHeight="400px" maxHeight="400px" overflowY="auto">
          {chatHistory.map((message, index) => (
            <Text key={index} fontWeight={message.role === 'user' ? 'bold' : 'normal'}>
              {message.role === 'user' ? 'You: ' : 'AI: '}
              {message.content}
            </Text>
          ))}
        </Box>
        <form onSubmit={handleSubmit}>
          <VStack spacing={2}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              isDisabled={isLoading}
            />
            <Button type="submit" colorScheme="blue" isLoading={isLoading} isFullWidth>
              Send
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
}

export default App;

