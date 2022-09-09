import { container } from "tsyringe";
import { Request, Response } from 'express'
import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

export class ListRentalsByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    console.log('id', id)

    const listRentalsByUserUseCase = container.resolve(
      ListRentalsByUserUseCase,
    );
    const rentals = await listRentalsByUserUseCase.execute(id);

    return response.json(rentals)
  }
}
