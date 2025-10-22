import { z } from 'zod'
import type { types } from '@embedded-blockchain-surveillance-system/api'

export namespace Request {
  export const params = z.object({
    electionId: z.string()
  })

  export type Params = z.infer<typeof params>
}

export namespace Response {
  type Endpoint = '/elections/{electionId}/end'
  type Method = 'post'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ELECTION_ENDED' }>
  export type Error = Exclude<Response, Success>
}
