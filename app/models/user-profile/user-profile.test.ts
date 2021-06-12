import { UserRoleEnum, UserStatus } from "../../types"
import { UserProfileModel } from "./user-profile"

test("can be created", () => {
  const instance = UserProfileModel.create({
    id: "profile-id",
    createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
    updatedAt: "Tue, 08 Jun 2021 08:58:04 GMT",
    role: UserRoleEnum.CHAPERONE,
    firstName: "Test",
    lastName: "Test",
    email: "test@gmail.com",
    phoneNumber: "1005559922",
    status: UserStatus.ACTIVE,
    latestCovidTestVerifiedAt: "Tue, 08 Jun 2021 08:58:04 GMT",
    signedCodeOfConductAt: "Tue, 08 Jun 2021 08:58:04 GMT",
    acceptedUserAgreementAt: "Tue, 08 Jun 2021 08:58:04 GMT",
  })

  expect(instance).toBeTruthy()
})
