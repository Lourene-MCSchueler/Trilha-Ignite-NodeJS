import { AppError } from "@shared/errors/AppError";
import { DayjsDateProvider } from "@shared/infra/providers/DateProvider/implementantion/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/infra/providers/MailProvider/in-memory/MailProviderInMemory";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory"
import { UsersTokensRepositoryInMemory } from "../../repositories/in-memory/UsersTokensRepositoryInMemory";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase"

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send forgot Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider()
    mailProvider = new MailProviderInMemory()
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    )
  })

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail")

    await usersRepositoryInMemory.create({
      driver_license: "12345",
      email: "email@email.com.br",
      name: "Name Test",
      password: "159753"
    })

    await sendForgotPasswordMailUseCase.execute("email@email.com.br")
    expect(sendMail).toHaveBeenCalled()
  })

  it("should not be able to send an email if user does not exists", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("email@email.com.br")
    ).rejects.toEqual(new AppError("User does not exists!"))
  })

  it("should be able to create an users token", async () => {
    const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, "create")

    await usersRepositoryInMemory.create({
      driver_license: "12222",
      email: "email@test.com.br",
      name: "Test Test",
      password: "159753"
    })
    await sendForgotPasswordMailUseCase.execute("email@test.com.br")
    expect(generateTokenMail).toHaveBeenCalled()
  })
})