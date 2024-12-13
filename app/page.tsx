"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ethers } from "ethers"; // Import ethers.js

export default function LandingPage() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [votingInProgress, setVotingInProgress] = useState(false);
  const [proposalCount, setProposalCount] = useState<number>(0); // Initialize the proposal count

  // Placeholder function to fetch files from Pinata
  const fetchUploadedFiles = async () => {
    const apiUrl = "https://api.pinata.cloud/data/pinList?status=pinned"; // Example endpoint
    const headers = {
      pinata_api_key: "853de9720224327dafff",
      pinata_secret_api_key:
        "bf59fb47ae7ce8843efd7d39e5685d1b40ddaa71b4b3deb535f93b525fae18e0",
    };

    try {
      const response = await fetch(apiUrl, { headers });
      const data = await response.json();
      setUploadedFiles(data.rows); // Assuming the response has 'rows' with file info
    } catch (error) {
      console.error("Error fetching IPFS files:", error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const voteOnProposal = async (file: any, vote: boolean) => {
    setVotingInProgress(true);
    const proposalId = proposalCount + 1; // Increment proposalId

    try {
      // Assuming you have a contract connected through ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Replace with your actual contract ABI and address
      const contractAddress = "0x2Dd0465A03536142fa455acEb48D6A754A6aA378";
      const contractABI = [
        {
          inputs: [
            {
              internalType: "string",
              name: "_description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_requiredVotes",
              type: "uint256",
            },
          ],
          name: "addProposal",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "proposalId",
              type: "uint256",
            },
          ],
          name: "ProposalAccepted",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_proposalId",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "_vote",
              type: "bool",
            },
          ],
          name: "vote",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "proposalId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "voter",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "vote",
              type: "bool",
            },
          ],
          name: "Voted",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_proposalId",
              type: "uint256",
            },
          ],
          name: "getProposal",
          outputs: [
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "yesVotes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "noVotes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "requiredVotes",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "accepted",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proposalCount",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "proposals",
          outputs: [
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "yesVotes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "noVotes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "requiredVotes",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "accepted",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ];
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Call the vote function on the smart contract
      const tx = await contract.vote(proposalId, vote);
      await tx.wait(); // Wait for the transaction to be mined
      alert("Vote successful!");
    } catch (error) {
      console.error("Error voting on proposal:", error);
      alert("Error voting on proposal.");
    } finally {
      setVotingInProgress(false);
      setProposalCount(proposalCount + 1); // Increment the proposal count after each vote
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6  space-y-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl  font-bold mb-4 bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 rounded-2xl">
          Welcome to GovernX
        </h1>
        <p className="text-lg text-white bg-zinc-700 px-6 py-6 rounded-2xl ">
          AI-Powered DAO Proposals and Automatic Transactions with Avalanche
          Integration
        </p>
      </header>

      <div className="flex flex-col items-center justify-center px-7 py-6  rounded-2xl bg-zinc-700">
        <h1 className="px-4 py-5 font-serif font-bold">Try it out</h1>
        <Link href="/home" className="bg-blue-400 rounded-2xl px-4 py-4">
          <button>Click it!!</button>
        </Link>
      </div>

      <section className="text-center mb-12 py-6 bg-zinc-800 rounded-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-gray-300 mb-6">
          GovernX is a platform that allows you to create and vote on DAO proposals created using AI. This is how it works :
        </p>
        <div className="space-y-8 px-40">
          <div className="bg-zinc-600 rounded-2xl px-4 py-4 space-y-4 w-full">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                1
              </div>
              <div className="flex items-center justify-center px-2">
                <h3 className="text-xl font-bold text-white px-3">Connect Wallet:</h3>
                <p className="text-gray-300">
                  Easily connect your wallet (e.g., MetaMask) to the platform to
                  initiate transactions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                2
              </div>
              <div className="flex items-center justify-center px-2">
                <h3 className="text-xl font-bold text-white px-2">
                  Proposal:
                </h3>
                <p className="text-gray-300">
                  Write your DAO proposal in the provided text box, specifying
                  the recipient address and amount.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                3
              </div>
              <div className="flex items-center justify-center px-2">
                <h3 className="text-xl font-bold text-white px-2">IPFS:</h3>
                <p className="text-gray-300">
                  Store the cryptic proposal by A.I. on IPFS and get the hash. This hash will be used to identify the proposal on the blockchain.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                4
              </div>
              <div className="flex items-center justify-center px-2">
                <h3 className="text-xl font-bold text-white px-2">Voting:</h3>
                <p className="text-gray-300">
                  Once done then this proposal will be voted on by the community members.
                </p>
              </div>
            </div>
          </div>

          {/* IPFS Files Section */}
          <section className="mt-12 bg-zinc-600 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Files Uploaded to IPFS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file) => (
                  <div
                    key={file.ipfs_pin_hash}
                    className="bg-gray-800 p-4 rounded-lg shadow-lg"
                  >
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {file.file_name || "Untitled File"}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      IPFS Link:{" "}
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                      >
                        {file.ipfs_pin_hash}
                      </a>
                    </p>

                    {/* Voting Buttons */}
                    <div className="flex space-x-4 mt-4">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        onClick={() => voteOnProposal(file, true)}
                        disabled={votingInProgress}
                      >
                        Vote Yes
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={() => voteOnProposal(file, false)}
                        disabled={votingInProgress}
                      >
                        Vote No
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No files uploaded yet.</p>
              )}
            </div>
          </section>
        </div>
      </section>

      <footer className="mt-12 text-center">
  <p className="text-lg text-gray-300">
    Want to learn more or start using GovernX?{" "}
    <a
      href="mailto:alok@web3gov.com"
      className="text-blue-400 underline"
    >
      Contact Alok
    </a>
  </p>
</footer>

    </div>
  );
}
