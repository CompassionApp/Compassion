import { ChaperoneRequestModel } from "./chaperone-request"

describe("ChaperoneRequestModel", () => {
  it("should be created", () => {
    const instance = ChaperoneRequestModel.create({
      id: "test",
      requestedBy: {
        id: "user-id",
        email: "test@test.org",
        firstName: "Test",
        lastName: "User",
      },
      createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
    })

    expect(instance).toBeTruthy()
  })

  it("should remove a chaperone when one is assigned", () => {
    const instance = ChaperoneRequestModel.create({
      id: "test",
      requestedBy: {
        id: "user-id",
        email: "test@test.org",
        firstName: "Test",
        lastName: "User",
      },
      createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
      chaperones: [
        {
          email: "test@user.org",
          firstName: "Test",
          id: "test-user",
          lastName: "User",
          phoneNumber: null,
        },
      ],
    })

    instance.removeChaperone("test@user.org")
    expect(instance.chaperones).toHaveLength(0)
  })

  it("should remove a chaperone when multiple are assigned", () => {
    const instance = ChaperoneRequestModel.create({
      id: "test",
      requestedBy: {
        id: "user-id",
        email: "test@test.org",
        firstName: "Test",
        lastName: "User",
      },
      createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
      chaperones: [
        {
          email: "test@user.org",
          firstName: "Test",
          id: "test-user",
          lastName: "User",
          phoneNumber: null,
        },
        {
          email: "test2@user.org",
          firstName: "Test2",
          id: "test-user2",
          lastName: "User2",
          phoneNumber: null,
        },
      ],
    })

    instance.removeChaperone("test2@user.org")
    expect(instance.chaperones).toHaveLength(1)
    expect(instance.chaperones[0]).toEqual({
      email: "test@user.org",
      firstName: "Test",
      id: "test-user",
      lastName: "User",
      phoneNumber: null,
    })
  })

  it("should add a chaperone to a request with no chaperones", () => {
    const instance = ChaperoneRequestModel.create({
      id: "test",
      requestedBy: {
        id: "user-id",
        email: "test@test.org",
        firstName: "Test",
        lastName: "User",
      },
      createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
      chaperones: [],
    })

    expect(instance.chaperones).toHaveLength(0)
    instance.addChaperone({
      email: "test@user.org",
      firstName: "Test",
      id: "test-user",
      lastName: "User",
      phoneNumber: null,
      fullName: "Test User",
    })
    expect(instance.chaperones).toHaveLength(1)
    expect(instance.chaperones[0]).toEqual({
      email: "test@user.org",
      firstName: "Test",
      id: "test-user",
      lastName: "User",
      phoneNumber: null,
    })
  })

  it("should add a chaperone to a request with one other chaperone", () => {
    const instance = ChaperoneRequestModel.create({
      id: "test",
      requestedBy: {
        id: "user-id",
        email: "test@test.org",
        firstName: "Test",
        lastName: "User",
      },
      createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
      chaperones: [
        {
          email: "test2@user.org",
          firstName: "Test2",
          id: "test-user2",
          lastName: "User2",
          phoneNumber: null,
        },
      ],
    })

    expect(instance.chaperones).toHaveLength(1)
    instance.addChaperone({
      email: "test@user.org",
      firstName: "Test",
      id: "test-user",
      lastName: "User",
      phoneNumber: null,
      fullName: "Test User",
    })
    expect(instance.chaperones).toHaveLength(2)
    expect(instance.chaperones[1]).toEqual({
      email: "test@user.org",
      firstName: "Test",
      id: "test-user",
      lastName: "User",
      phoneNumber: null,
    })
  })

  it("should throw an error if too many chaperones are added", () => {
    const instance = ChaperoneRequestModel.create({
      id: "test",
      requestedBy: {
        id: "user-id",
        email: "test@test.org",
        firstName: "Test",
        lastName: "User",
      },
      createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
      chaperones: [
        {
          email: "test@user.org",
          firstName: "Test",
          id: "test-user",
          lastName: "User",
          phoneNumber: null,
        },
        {
          email: "test2@user.org",
          firstName: "Test2",
          id: "test-user2",
          lastName: "User2",
          phoneNumber: null,
        },
      ],
    })

    expect(instance.chaperones).toHaveLength(2)
    const fn = () => {
      instance.addChaperone({
        email: "test3@user.org",
        firstName: "Test3",
        id: "test-user3",
        lastName: "User3",
        phoneNumber: null,
        fullName: "Test User3",
      })
    }
    expect(fn).toThrowError()
    expect(instance.chaperones).toHaveLength(2)
  })

  it("should yield true if the user is assigned to the request", () => {
    const instance = ChaperoneRequestModel.create({
      id: "test",
      requestedBy: {
        id: "user-id",
        email: "test@test.org",
        firstName: "Test",
        lastName: "User",
      },
      createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
      chaperones: [
        {
          email: "test2@user.org",
          firstName: "Test2",
          id: "test-user2",
          lastName: "User2",
          phoneNumber: null,
        },
        {
          email: "test3@user.org",
          firstName: "Test3",
          id: "test-user3",
          lastName: "User3",
          phoneNumber: null,
        },
      ],
    })

    expect(instance.isAssignedToUser("test@test.org")).toBeTruthy()
    expect(instance.isAssignedToUser("test2@user.org")).toBeTruthy()
    expect(instance.isAssignedToUser("test3@user.org")).toBeTruthy()
  })

  it("should yield false if the user is not assigned to the request", () => {
    const instance = ChaperoneRequestModel.create({
      id: "test",
      requestedBy: {
        id: "user-id",
        email: "test@test.org",
        firstName: "Test",
        lastName: "User",
      },
      createdAt: "Tue, 08 Jun 2021 08:58:04 GMT",
      chaperones: [
        {
          email: "test2@user.org",
          firstName: "Test2",
          id: "test-user2",
          lastName: "User2",
          phoneNumber: null,
        },
      ],
    })

    expect(instance.isAssignedToUser("user-id1")).toBeFalsy()
    expect(instance.isAssignedToUser("test4@user.org")).toBeFalsy()
  })
})
