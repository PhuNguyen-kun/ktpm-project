export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  email: string
  password: string
  full_name: string
}

export namespace CallbackTypes {
  export type CredentialCallback = (response: GoogleCredentialResponse) => Promise<void>

  export interface GoogleCredentialResponse {
    access_token: string
    expires_in?: number
    token_type?: string
    scope?: string
  }
}
