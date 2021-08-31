import { GeoAreaEnum, UserRoleEnum, UserStatusEnum } from "../../types"
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
    status: UserStatusEnum.ACTIVE,
    latestCovidTestVerifiedAt: "Tue, 08 Jun 2021 08:58:04 GMT",
    signedCodeOfConductAt: "Tue, 08 Jun 2021 08:58:04 GMT",
    acceptedUserAgreementAt: "Tue, 08 Jun 2021 08:58:04 GMT",
    geoArea: GeoAreaEnum.OAK1,
  })

  expect(instance).toBeTruthy()
  expect(instance).toMatchInlineSnapshot(`
    Object {
      "acceptedUserAgreementAt": "Tue, 08 Jun 2021 08:58:04 GMT",
      "createdAt": "Tue, 08 Jun 2021 08:58:04 GMT",
      "email": "test@gmail.com",
      "enableNotifications": null,
      "firstName": "Test",
      "geoArea": "OAK1",
      "id": "profile-id",
      "isCodeOfConductSigned": null,
      "lastLoginAt": null,
      "lastName": "Test",
      "latestCovidTestVerifiedAt": "Tue, 08 Jun 2021 08:58:04 GMT",
      "notificationToken": null,
      "phoneNumber": "1005559922",
      "role": "CHAPERONE",
      "signedCodeOfConductAt": "Tue, 08 Jun 2021 08:58:04 GMT",
      "status": "ACTIVE",
      "updatedAt": "Tue, 08 Jun 2021 08:58:04 GMT",
    }
  `)
})
