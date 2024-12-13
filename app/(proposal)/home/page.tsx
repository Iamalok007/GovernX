"use client";
import { useState } from "react";

declare global {
  interface Window {
    ethereum: any;
  }
}

import { HfInference } from "@huggingface/inference";
import { ethers, parseEther } from "ethers";
import { create } from "ipfs-http-client";
import axios from 'axios';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [proposal, setProposal] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [crypticProposal, setCrypticProposal] = useState<string | null>(null);
  const [amount, setAmount] = useState("0.00000001");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);  // New state to hold the IPFS URL

  const inference = new HfInference("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");

  const pinataApiUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const pinataApiKey = '853de9720224327dafff';  // Replace with your API Key
  const pinataSecretApiKey = 'bf59fb47ae7ce8843efd7d39e5685d1b40ddaa71b4b3deb535f93b525fae18e0';  // Replace with your Secret API Key

  // IPFS client setup
  const ipfsClient = create({
    url: "https://ipfs.infura.io:5001/api/v0", // Infura's IPFS gateway URL
    headers: {
      authorization: `853de9720224327dafff`, // Replace with your API key
    },
  });

  // Wallet Connection
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setConnected(true);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet.");
    }
  };

 


  // Generate Cryptic Proposal Code
  const generateCode = async () => {
    if (!receiverAddress) {
      setFeedback("Please provide a receiver address.");
      return;
    }

    setLoading(true);
    setCrypticProposal(null);
    setFeedback(null);

    const proposalContent = `
    const proposalID = "0x${Math.random()
      .toString(16)
      .slice(2, 10)
      .toUpperCase()}"; // Unique Proposal Identifier
    const sender = "${account}"; // Sender's wallet address
    const receiver = "${receiverAddress}"; // Receiver's wallet address
    const amount = "${amount}"; // Amount to transfer in AVAX
    const timestamp = "${new Date().toISOString()}"; // Timestamp of Proposal Creation
    const expiration = "${new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString()}"; // Expiration Date
    const governanceWeight = "75"; // Governance weight of the sender
    const quorumRequired = "60"; // Minimum quorum required

    const crypticDetails = {
      encodedPurpose: ethers.utils.keccak256(ethers.toUtf8Bytes("${
        proposal || "General fund transfer"
      }")),
      proposalHash: ethers.utils.keccak256(ethers.toUtf8Bytes(
        "${account}${receiverAddress}${amount}${Date.now()}"
      )),
    };

    export async function executeProposal() {
      if (Date.now() > new Date(expiration).getTime()) {
        throw new Error("Proposal has expired.");
      }
      if (governanceWeight < quorumRequired) {
        throw new Error("Insufficient governance weight.");
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        const tx = await signer.sendTransaction({
          to: receiver,
          value: ethers.parseEther(amount),
        });
        console.log("Transaction Hash:", tx.hash);
        console.log("Purpose Hash:", crypticDetails.encodedPurpose);
      } catch (error) {
        console.error("Proposal execution failed:", error);
      }
    }

    executeProposal();
    `;

    try {
      const response = await inference.textGeneration({
        model: "bigcode/starcoder",
        inputs: proposalContent,
        parameters: { max_length: 512, temperature: 1.0 },
      });

      setCrypticProposal(response.generated_text || "No proposal generated.");
    } catch (error) {
      console.error("Error generating proposal:", error);
      setFeedback("Error generating proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Upload Proposal to IPFS
  const uploadToIPFS = async (fileBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', fileBlob);

    try {
      const response = await axios.post(pinataApiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      const ipfsHash = response.data.IpfsHash;
      console.log('File successfully uploaded to IPFS with hash:', ipfsHash);
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
    }
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (crypticProposal) {
      const fileBlob = new Blob([crypticProposal], { type: 'text/plain' });
      const fileUrl = await uploadToIPFS(fileBlob);
      if (fileUrl) {
        setFileUrl(fileUrl);  // Save the file URL in state
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">GovernX: AI-Powered DAO Proposals</h1>

      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded-md mb-4 ${connected ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={connectWallet}
        disabled={connected}
      >
        {connected ? `Connected: ${account}` : "Connect Wallet"}
      </button>

      <textarea
        className="w-full max-w-lg h-40 border border-gray-300 rounded-md p-2 mb-4 text-black"
        placeholder="Write your DAO proposal here..."
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
      ></textarea>

      <input
        type="text"
        className="w-full max-w-lg border border-gray-300 rounded-md p-2 mb-4 text-black"
        placeholder="Enter receiver address"
        value={receiverAddress}
        onChange={(e) => setReceiverAddress(e.target.value)}
      />

      <input
        type="text"
        className="w-full max-w-lg border border-gray-300 rounded-md p-2 mb-4 text-black"
        placeholder="Enter amount to transfer"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600"
        onClick={generateCode}
        disabled={loading || !proposal || !receiverAddress}
      >
        {loading ? "Generating Proposal..." : "Generate Proposal"}
      </button>

      {crypticProposal && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm max-w-lg text-black space-x-4">
          <h2 className="font-bold text-lg">Generated Proposal:</h2>
          <pre className="text-sm overflow-auto">{crypticProposal}</pre>
        </div>
      )}

      {feedback && (
        <div className="mt-4 p-4 bg-white border text-black border-gray-200 rounded-md shadow-sm max-w-lg">
          <p>{feedback}</p>
        </div>
      )}

      {crypticProposal && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          onClick={handleFileUpload}
        >
          Upload Proposal to IPFS
        </button>
      )}

      {fileUrl && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm max-w-lg text-black">
          <p>Proposal successfully uploaded! Access it <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">here</a>.</p>
        </div>
      )}
    </div>
  );
}
