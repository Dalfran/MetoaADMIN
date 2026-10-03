export type DocumentVerificationStatus =
  | 'EN_ATTENTE'
  | 'APPROUVE'
  | 'REJETE';

export type DocumentType = string;

export interface AdminDocument {
  documentId: string;

  nom: string;
  url: string;

  type: DocumentType;

  dateUpload?: string | null;
  dateModification?: string | null;

  statutVerification: DocumentVerificationStatus;

  motifRejet?: string | null;

  dateVerification?: string | null;

  verifiePar?: string | null;
}

export interface RejectDocumentRequest {
  motifRejet: string;
}
