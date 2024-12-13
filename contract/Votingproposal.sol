// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
   
    struct Proposal {
        string description;  
        uint256 yesVotes;      
        uint256 noVotes;      
        uint256 requiredVotes; 
        bool accepted;         
    }

  
    mapping(uint256 => Proposal) public proposals;

   
    uint256 public proposalCount;

  
    event Voted(uint256 proposalId, address voter, bool vote);

    
    event ProposalAccepted(uint256 proposalId);

    function vote(uint256 _proposalId, bool _vote) public {
        
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");

        Proposal storage proposal = proposals[_proposalId];

        
        require(!proposal.accepted, "Proposal already accepted");

       
        if (_vote) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }

       
        emit Voted(_proposalId, msg.sender, _vote);

        
        if (proposal.yesVotes >= proposal.requiredVotes) {
            proposal.accepted = true;
            emit ProposalAccepted(_proposalId);
        }
    }

   
    function getProposal(uint256 _proposalId) public view returns (
        string memory description,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 requiredVotes,
        bool accepted
    ) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        return (proposal.description, proposal.yesVotes, proposal.noVotes, proposal.requiredVotes, proposal.accepted);
    }

    
    function addProposal(string memory _description, uint256 _requiredVotes) public {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            description: _description,
            yesVotes: 0,
            noVotes: 0,
            requiredVotes: _requiredVotes,
            accepted: false
        });
    }
}
