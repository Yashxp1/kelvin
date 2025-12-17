export interface NotionPage {
  id: string;
  url: string;
  content: string;
  title?: any;
}

export interface NotionSummary {
  pageId: string;
  prompt: string;
}

export interface NotionPageCreate {
  prompt: string;
}
