export interface NotionPage {
  id: string;
  title: string;
  url: string;
}

export interface NotionSummary {
  pageId: string;
  prompt: string;
}

export interface NotionPageCreate {
  prompt: string;
}
