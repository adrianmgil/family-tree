import './App.css';
import DrawTree from './DrawTree';
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <DrawTree />
      </div>
    </QueryClientProvider >
  );
}

export default App;
