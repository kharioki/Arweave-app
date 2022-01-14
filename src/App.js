import './App.css';
import { useState } from 'react';
import Arweave from 'arweave';

// connect to an Arweave node
const arweave = Arweave.init({});

function App() {
  const [state, setState] = useState('');
  const [transactionId, setTransactionId] = useState('');

  async function createTransaction() {
    if (!state) return;
    try {
      const formData = state
      setState('');

      // create and send transaction to Arweave
      let transaction = await arweave.createTransaction({ data: formData });
      await arweave.transactions.sign(transaction);
      let uploader = await arweave.transactions.getUploader(transaction);

      // upload indicator
      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(
          `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
        );
      }

      setTransactionId(transaction.id);
    } catch (err) {
      console.log('error', err);
    }
  }

  async function readFromArweave() {
    // read arweave data using any transaction ID
    arweave.transactions
      .getData(transactionId, {
        decode: true,
        string: true,
      })
      .then((data) => {
        console.log('data', data);
      });
  }

  return (
    <div className="container">
      <button style={button} onClick={createTransaction}>
        Create Transaction
      </button>

      <button style={button} onClick={readFromArweave}>
        Read Transaction
      </button>

      <input
        style={input}
        onChange={(e) => setState(e.target.value)}
        placeholder="text"
        value={state}
      />
    </div>
  );
}

const button = {
  outline: 'none',
  border: '1px solid black',
  padding: '10px',
  backgroundColor: '#fff',
  width: '200px',
  marginBottom: '10px',
  cursor: 'pointer',
}

const input = {
  backgroundColor: '#ddd',
  outline: 'none',
  border: 'none',
  width: '200px',
  fontSize: '16px',
  padding: '10px',
}

export default App;
