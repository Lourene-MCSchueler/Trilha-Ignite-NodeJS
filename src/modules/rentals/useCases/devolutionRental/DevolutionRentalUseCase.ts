/* eslint-disable prettier/prettier */
import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/infra/providers/DateProvider/IDateProvider";

import { Rental } from "../../infra/typeorm/entities/Rental";


interface IRequest {
  id: string;
  user_id: string;
}
@injectable()
export class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) { }

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id)
    console.log('rental', rental)
    const car = await this.carsRepository.findById(rental.car_id)
    console.log('car', car)

    const minimum_daily = 1

    if (!rental) {
      throw new AppError("Rentals does not exists")
    }
    const dateNow = this.dateProvider.dateNow()

    let daily = this.dateProvider.compareInDays(
      rental.start_date,
      dateNow
    )
    console.log('daily', daily)

    if (daily <= 0) {
      daily = minimum_daily
    }
    const delay = this.dateProvider.compareInDays(
      rental.expected_return_date,
      dateNow
    )
    console.log('delay', delay)
    let total = 0;

    if (delay > 0) {
      const calculate_fine = delay * car.fine_amount;
      total = calculate_fine;
    }
    total += daily * car.daily_rate;
    console.log('total', total)

    rental.end_date = dateNow;
    rental.total = total;

    await this.rentalsRepository.create(rental)

    await this.carsRepository.updateAvailable(car.id, true)

    return rental
  };
}
