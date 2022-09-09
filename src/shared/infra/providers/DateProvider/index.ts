import { container } from "tsyringe";
import { IDateProvider } from "./IDateProvider";
import { DayjsDateProvider } from "./implementantion/DayjsDateProvider";

container.registerSingleton<IDateProvider>(
  "DayjsDateProvider",
  DayjsDateProvider,
);

