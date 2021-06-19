import Ajv from "ajv"
import addFormats from "ajv-formats"
import { LatLng, User, UserRoleEnum, UserStatusEnum } from "."
import UserSchema from "./User.schema.json"
import LatLngSchema from "./LatLng.schema.json"

describe("schema tests", () => {
  let ajv

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true })
    addFormats(ajv)
  })

  it("should correctly validate a valid LatLng object", () => {
    const input: LatLng = {
      lat: 45,
      lng: 123,
    }
    const validate = ajv.compile(LatLngSchema)
    const result = validate(input)
    expect(result).toEqual(true)
  })

  it("should correctly validate a valid User object", () => {
    const input: User = {
      id: "5cc66a70-50a0-4df0-879b-6a4636c18a41",
      firebaseUserId: "11223344",
      createdAt: "2021-01-01 11:00:00",
      updatedAt: "2021-01-01 11:00:00",
      role: UserRoleEnum.REQUESTER,
      status: UserStatusEnum.ACTIVE,
      phoneNumber: 1112223333,
      email: "test@google.com",
      password: "password",
      firstName: "Test",
      lastName: "Name",
      latestCovidTestVerifiedAt: "2021-01-01 11:00:00",
      signedCodeOfConductAt: "2021-01-01 11:00:00",
    }
    const validate = ajv.compile(UserSchema)
    const result = validate(input)
    expect(result).toEqual(true)
  })

  it("should correctly validate a invalid User object", () => {
    const input: User = {
      id: "5cc66a70-50a0-4df0-879b-6a4636c18a41",
      firebaseUserId: "11223344",
      createdAt: "2021-01-01 11:00:00",
      updatedAt: "2021-01-01 11:00:00",
      role: UserRoleEnum.REQUESTER,
      status: UserStatusEnum.ACTIVE,
      phoneNumber: 1112223333,
      email: "test@google.com",
      password: "password",
      firstName: "Test",
      lastName: "Name",
      latestCovidTestVerifiedAt: "2021-01-01 11:00:00",
      signedCodeOfConductAt: "2021-01-01 11:00:00",
    }
    // Purposefully delete a field
    delete input.firstName

    const validate = ajv.compile(UserSchema)
    const result = validate(input)
    // console.log(validate.errors)
    expect(result).toEqual(false)
    expect(validate.errors).toBeTruthy()
  })
})
