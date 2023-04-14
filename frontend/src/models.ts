export interface Tender {
    Id: number;
    Title: string;
    Status: string;
    Budget: number;
    Description: string;
    Milestones: number;
    Deadline: string;
  }

export interface Bid {
  BidId: number;
  TenderId: number;
  BidClause: string;
  QuoteAmount: number;
  Status: string;
}

export interface TenderResponse {
  status: string;
  response: Tender[];
}

export interface BidResponse {
  status: string;
  response: Bid[];
}