import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import { CreateElectionUseCase } from './use-case'
import middleware from './middleware'
import { Container } from '@n8n/di'

const CreateElectionRoute = new Hono().post('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const body = c.req.valid('json')
  const useCase = Container.get(CreateElectionUseCase)
  const result = await useCase.execute(body)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.CREATED
  }

  return c.json(response, statusCode)
})

export default CreateElectionRoute
