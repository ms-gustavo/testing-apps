import { describe, expect, it } from "vitest";
import { CreateAppointment } from "./create-appointment";
import { Appointment } from "../entities/appointment";
import { getFutureDate } from "../tests/utils/get-future-date";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";

describe("Create Appointment", () => {
  it("should be able to create an appointment", () => {
    const startsAt = getFutureDate("2022-08-10");
    const endsAt = getFutureDate("2022-08-11");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    //system under test
    const sut = new CreateAppointment(appointmentsRepository);

    expect(
      sut.execute({
        customer: "John Doe",
        startsAt,
        endsAt,
      })
    ).resolves.toBeInstanceOf(Appointment);
  });

  it("should not be able to create an appointment with overlapping dates", async () => {
    const startsAt = getFutureDate("2022-08-10");
    const endsAt = getFutureDate("2022-08-15");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    //system under test
    const sut = new CreateAppointment(appointmentsRepository);

    await sut.execute({
      customer: "John Doe",
      startsAt,
      endsAt,
    });

    expect(
      sut.execute({
        customer: "John Doe Two",
        startsAt: getFutureDate("2022-08-14"),
        endsAt: getFutureDate("2022-08-18"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      sut.execute({
        customer: "John Doe Two",
        startsAt: getFutureDate("2022-08-09"),
        endsAt: getFutureDate("2022-08-12"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      sut.execute({
        customer: "John Doe Two",
        startsAt: getFutureDate("2022-08-09"),
        endsAt: getFutureDate("2022-08-17"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      sut.execute({
        customer: "John Doe Two",
        startsAt: getFutureDate("2022-08-11"),
        endsAt: getFutureDate("2022-08-13"),
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
