export interface IOriginalNft {
  tokenId?: string
  'Wallet Address'?: string
  'Profile Image': File[] | Blob[] | undefined
  'Full Name': string
  'Discord Handle': string
  Job: string
  Introduction: string
}

export interface IAnonylNft {
  tokenId: string
  'Wallet Address'?: string
  'Profile Image': File[] | Blob[] | undefined
  'Full Name': string
  'Discord Handle': string
  Job: string
  Introduction: string
  Occasion?: string
  Memo?: string
}
