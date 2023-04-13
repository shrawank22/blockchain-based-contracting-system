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
  BidClause: string;
  QuoteAmount: number;
  Status: string;
}